// /pages/api/openai.ts

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import OpenAI from "openai";

// Import o promptsJson “cru” (com tokens {...})
import { promptsJson } from "@/app/constants/prompts";

// Import nosso utilitário de “preencher placeholders”:
import { fillAllPrompts, type PromptsJson } from "@/utils/fillPrompts";

// Reutiliza o schema de preferências (Zod) definido em outro arquivo
import {
  preferencesSchema,
  type PreferencesData,
} from "@/app/(private)/dashboard/settings/type";

const prefsBodySchema = z.object({
  prefs: preferencesSchema,
});

const promptOptionsBodySchema = z.object({
  prompt: z.string(),
  options: z
    .object({
      categorized: z.boolean().optional(),
      platform: z.string().optional(),
      format: z.string().optional(),
      tone: z.string().optional(),
      audience: z.string().optional(),
      count: z.number().optional(),
    })
    .optional(),
});

const requestBodySchema = z.union([prefsBodySchema, promptOptionsBodySchema]);

const openai = new OpenAI();

// Se quiser outro “número razoável” diferente de 5 para modo não-categorizado,
// basta alterar este valor:
const DEFAULT_NON_CATEGORIZED_COUNT = 5; // Garante entre 1 e 5 ideias

/**
 * Função auxiliar que gera as ideias a partir de um prompt genérico,
 * instruindo o modelo a produzir saídas extensas, detalhadas e em passo-a-passo,
 * usando **somente aspas duplas ASCII** para todos os campos de texto.
 */
async function generateFromPrompt(
  // “prompt” genérico que o usuário enviou (pode vir de `promptOptionsBodySchema`)
  prompt: string,
  options: {
    categorized?: boolean;
    platform?: string;
    format?: string;
    tone?: string;
    audience?: string;
    count?: number;
  } = {},
  // AQUI recebemos o “PromptsJson” já preenchido (todos os blocos preenchidos com prefs)
  filledPrompts: PromptsJson
): Promise<{
  ideas?: Array<{
    id: string;
    title: string;
    description: string;
    isFavorite: boolean;
    format?: string;
    platform?: string;
    tags?: string[];
    estimatedEngagement?: string;
    difficulty?: "easy" | "medium" | "hard";
    timeToCreate?: string;
    bestTimeToPost?: string;
    targetAudience?: string;
    variations?: string[];
    steps?: string[];    // campo extra para passo-a-passo
    examples?: string[]; // campo extra para exemplos práticos
    context?: string;    // campo extra para contexto e justificativa
  }>;
  categories?: Array<{
    name: string;
    ideas: Array<{
      id: string;
      title: string;
      description: string;
      isFavorite: boolean;
      format?: string;
      platform?: string;
      tags?: string[];
      estimatedEngagement?: string;
      difficulty?: "easy" | "medium" | "hard";
      timeToCreate?: string;
      bestTimeToPost?: string;
      targetAudience?: string;
      variations?: string[];
      steps?: string[];
      examples?: string[];
      context?: string;
    }>;
  }>;
}> {
  // (1) Concatena todos os prompts preenchidos
  const systemMessage = filledPrompts.blocks
    .map((blk) => blk.prompt.trim())
    .join("\n\n");

  // (2) Instruções adicionais para JSON + uso de ASPAS DUPLAS ASCII
  const systemMessageWithInstructions = `
${systemMessage}

Você é um assistente que **sempre retorna JSON válido usando exclusivamente ASPAS DUPLAS ASCII (\"), sem aspas curvas (“ ”) nem texto extra fora do JSON**. Gere as ideias seguindo exatamente este formato:

{
  "ideas": [
    {
      "id": "<string única>",
      "title": "<título da ideia>",
      "description": "<descrição da ideia>",
      "context": "<explicação de contexto e justificativa: por que essa ideia faz sentido>",
      "steps": [
        "<passo 1 detalhado para implementar a ideia>",
        "<passo 2 detalhado>",
        "... outros passos em ordem sequencial"
      ],
      "examples": [
        "<exemplo prático de aplicação 1>",
        "<exemplo prático de aplicação 2>"
      ],
      "isFavorite": false,
      // campos opcionais abaixo (incluir apenas se fizer sentido):
      "format": "<ex: vídeo, texto, imagem>",
      "platform": "<ex: Instagram, LinkedIn, etc>",
      "tags": ["<tag1>", "<tag2>"],
      "estimatedEngagement": "<ex: Alto, Médio, Baixo>",
      "difficulty": "<\"easy\" | \"medium\" | \"hard\">",
      "timeToCreate": "<ex: 2h, 30m>",
      "bestTimeToPost": "<ex: Manhã, Tarde, Noite>",
      "targetAudience": "<descrição do público>",
      "variations": ["<variação1>", "<variação2>"]
    }
    // ... mais objetos de ideia
  ]
}

Se for requisitado com categorização (options.categorized = true):
{
  "categories": [
    {
      "name": "<nome da categoria>",
      "ideas": [
        {
          "id": "<string única>",
          "title": "<título da ideia>",
          "description": "<descrição da ideia>",
          "context": "<explicação de contexto e justificativa>",
          "steps": [
            "<passo 1>",
            "<passo 2>",
            "... outros passos"
          ],
          "examples": [
            "<exemplo prático 1>",
            "<exemplo prático 2>"
          ],
          "isFavorite": false
          // mesmos campos opcionais de cima
        }
        // ... mais ideias
      ]
    }
    // ... mais categorias
  ]
}

**Para cada ideia, forneça**:
1. **Contexto e justificativa**: explique por que essa ideia é relevante para o público-alvo e como se conecta com o objetivo do usuário.
2. **Descrição detalhada**: detalhe em profundidade o que a ideia envolve.
3. **Passos de implementação**: liste, em ordem sequencial, instruções claras e acionáveis para implementar a ideia do início ao fim.
4. **Exemplos práticos de aplicação**: apresente no mínimo um exemplo concreto de como essa ideia foi ou poderia ser aplicada.
5. **Variações e customizações**: sugira alternativas ou adaptações que o usuário pode considerar.

**NÃO inclua texto nem explicações fora da estrutura JSON acima**.  
`.trim();

  const {
    categorized = false,
    platform,
    format,
    tone,
    audience,
    count,
  } = options;

  let userPrompt = `Gere ${categorized ? "categorias de ideias" : "ideias"
    } com base neste input: "${prompt}"`;

  if (platform) {
    userPrompt += `\nPlataforma preferida: ${platform}.`;
  }
  if (format) {
    userPrompt += `\nFormato sugerido: ${format}.`;
  }
  if (tone) {
    userPrompt += `\nTom da mensagem: ${tone}.`;
  }
  if (audience) {
    userPrompt += `\nPúblico-alvo: ${audience}.`;
  }

  // Se count for passado, sobrescrevemos; senão, usamos DEFAULT_NON_CATEGORIZED_COUNT
  const promptCount = categorized ? count : DEFAULT_NON_CATEGORIZED_COUNT;
  if (promptCount) {
    userPrompt += `\nRetorne aproximadamente ${promptCount} ${categorized ? "categorias" : "ideias"
      } extensas e detalhadas.`;
  }

  const chatResponse = await openai.chat.completions.create({
    model: "gpt-4o-mini", // ou "gpt-4o", "gpt-4"
    messages: [
      { role: "system", content: systemMessageWithInstructions },
      { role: "user", content: userPrompt.trim() },
    ],
    temperature: 1,
    max_tokens: 2048, // garante resposta longa o suficiente
  });

  // 1) Obtém texto bruto
  const text = chatResponse.choices?.[0]?.message?.content || "";

  // 2) Substitui eventuais aspas curvas por aspas duplas ASCII
  const cleaned = text
    .replace(/[“”]/g, '"')  // aspas curvas para "
    .replace(/‘|’/g, "'");  // aspas simples curvas para '

  // 3) Converte para JSON
  let parsed: any;
  try {
    parsed = JSON.parse(cleaned);
  } catch (err) {
    console.error("Falha ao converter resposta da OpenAI em JSON:", cleaned);
    throw new Error(
      "Falha ao processar a resposta da OpenAI como JSON válido. Conteúdo recebido:\n" +
      cleaned
    );
  }
  return parsed;
}

export async function POST(request: NextRequest) {
  try {
    // 1) Leitura do JSON e validação via Zod
    const json = await request.json();
    const parsed = requestBodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.issues },
        { status: 400 }
      );
    }

    // 2) Se chegou aqui, payload é { prefs } ou { prompt + options? }
    const { data } = parsed;

    if ("prefs" in data) {
      // — Caso 1: veio { prefs }
      const { prefs } = data as { prefs: PreferencesData };

      // (A) Geramos o “PromptsJson” preenchido a partir das preferências:
      //     cada bloco em promptsJson tem placeholders {…} que serão substituídos por prefs[fieldName].
      const filledPrompts = fillAllPrompts(promptsJson as PromptsJson, prefs);

      // (B) Montamos um systemMessage geral a partir de todos os blocos preenchidos:
      //     o generateFromPrompt recebe esse filledPrompts para concatenar + instruções extras.
      //
      // Aqui, vamos pedir categorias + extraIdeas:
      const systemMessagePrefs = filledPrompts.blocks
        .map((blk) => blk.prompt.trim())
        .join("\n\n");

      const systemMessageWithPrefsInstructions = `
${systemMessagePrefs}

Você é um assistente que recebe um objeto JSON com preferências de negócio de um usuário (campos como businessName, industry, targetAudience etc.).
A partir dessas preferências, gere um JSON estruturado contendo:
1) "categories": lista de categorias (campo "name") e, dentro de cada categoria, um array "ideas" com objetos de ideias (mesmos campos de id, title, description, isFavorite, etc.);
2) "extraIdeas": lista de objetos de ideias independentes (id, title, description, isFavorite, etc.).

**Use APENAS aspas duplas ASCII (\"), sem aspas curvas (“ ”), e não inclua texto fora da estrutura JSON.**

Obedeça a estrutura exatamente:
{
  "categories": [
    {
      "name": "<string>",
      "ideas": [
        {
          "id": "<string única>",
          "title": "<string>",
          "description": "<string>",
          "isFavorite": false
          // campos opcionais se relevantes
        }
        // ... ideias
      ]
    }
    // ... categorias
  ],
  "extraIdeas": [
    {
      "id": "<string única>",
      "title": "<string>",
      "description": "<string>",
      "isFavorite": false
      // campos opcionais
    }
    // ... mais ideias extras
  ]
}
`.trim();

      const prefsAsJson = JSON.stringify(prefs);

      const userMessagePrefs = `
Aqui está o objeto de preferências (JSON):
\`\`\`
${prefsAsJson}
\`\`\`
Gere as categorias e ideias conforme as instruções acima.
      `.trim();

      // (C) Chamamos a OpenAI usando o “systemMessageWithPrefsInstructions”
      const chatResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemMessageWithPrefsInstructions },
          { role: "user", content: userMessagePrefs },
        ],
        temperature: 1,
        max_tokens: 2048,
      });

      // Processamento da resposta JSON do prefs (mesma lógica de limpeza):
      const rawText = chatResponse.choices?.[0]?.message?.content || "";
      const cleanedPrefs = rawText
        .replace(/[“”]/g, '"')
        .replace(/‘|’/g, "'");
      let parsedPrefs: any;
      try {
        parsedPrefs = JSON.parse(cleanedPrefs);
      } catch (err) {
        console.error("Falha ao converter resposta da OpenAI em JSON (prefs):", cleanedPrefs);
        throw new Error(
          "Falha ao processar a resposta da OpenAI como JSON válido. Conteúdo recebido:\n" +
          cleanedPrefs
        );
      }

      return NextResponse.json({
        success: true,
        data: parsedPrefs,
      });
    } else {
      // — Caso 2: veio { prompt: string; options?: {...} }
      const { prompt, options } = parsed.data as {
        prompt: string;
        options?: {
          categorized?: boolean;
          platform?: string;
          format?: string;
          tone?: string;
          audience?: string;
          count?: number;
        };
      };

      // Usa um objeto vazio para preencher promptsJson, caso não haja prefs.
      const dummyPrefs: PreferencesData = {} as any;

      // (A) Preenchemos o promptsJson “cru” usando um objeto vazio (ou padrão)
      const filledPrompts = fillAllPrompts(promptsJson as PromptsJson, dummyPrefs);

      // (B) Definimos se é categorizado ou não:
      const isCategorized = options?.categorized ?? false;
      const promptCount = isCategorized ? options?.count : DEFAULT_NON_CATEGORIZED_COUNT;

      // (C) Chamamos nossa função geradora, que concatena todos os blocos preenchidos
      //     + instruções extras para gerar output JSON de “ideas” ou “categories”.
      const results = await generateFromPrompt(
        prompt,
        {
          categorized: isCategorized,
          platform: options?.platform,
          format: options?.format,
          tone: options?.tone,
          audience: options?.audience,
          count: promptCount,
        },
        filledPrompts
      );

      if (isCategorized) {
        return NextResponse.json({
          success: true,
          data: {
            categories: results.categories,
          },
        });
      } else {
        return NextResponse.json({
          success: true,
          data: {
            ideas: results.ideas,
          },
        });
      }
    }
  } catch (error: any) {
    console.error("Erro em /api/openai:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}
