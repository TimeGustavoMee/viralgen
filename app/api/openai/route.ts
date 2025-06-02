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
 * Função auxiliar que gera as ideias a partir de um prompt genérico.
 * Aqui vamos reaproveitar o mesmo “systemMessage” de todos os blocos preenchidos
 * via fillAllPrompts(...) + instruções adicionais.
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
    }>;
  }>;
}> {
  // (1) Concatenamos todos os “prompts” preenchidos de cada bloco
  //     num único systemMessage, separados por 2 quebras de linha.
  const systemMessage = filledPrompts.blocks
    .map((blk) => blk.prompt.trim())
    .join("\n\n");

  // (2) Adicionamos instruções fixas para o ChatGPT seguir “sempre JSON”
  const systemMessageWithInstructions = `
${systemMessage}

Você é um assistente especializado em gerar ideias de conteúdo para mídias sociais e marketing digital.
Você sempre responderá com JSON válido (sem explicações em texto), seguindo exatamente esta estrutura:

Se for requisitado sem categorização:
{
  "ideas": [
    {
      "id": "<string única>",
      "title": "<título da ideia>",
      "description": "<descrição da ideia>",
      "isFavorite": false,
      // campos opcionais abaixo (incluir apenas se fizer sentido):
      "format": "<ex: vídeo, texto, imagem>",
      "platform": "<ex: Instagram, LinkedIn, etc>",
      "tags": ["<tag1>", "<tag2>"],
      "estimatedEngagement": "<ex: Alto, Médio, Baixo>",
      "difficulty": "<\\"easy\\" | \\"medium\\" | \\"hard\\">",
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
          "isFavorite": false,
          // mesmos campos opcionais de acima
        }
        // ... mais ideias
      ]
    }
    // ... mais categorias
  ]
}

Não inclua nenhuma explicação fora desse JSON. Não coloque comentários, nem texto adicional.
  `.trim();

  const {
    categorized = false,
    platform,
    format,
    tone,
    audience,
    count,
  } = options;

  let userPrompt = `Gere ${
    categorized ? "categorias de ideias" : "ideias"
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
    userPrompt += `\nRetorne aproximadamente ${promptCount} ${
      categorized ? "categorias" : "ideias"
    }.`;
  }

  const chatResponse = await openai.chat.completions.create({
    model: "gpt-4o-mini", // ou "gpt-4o", "gpt-4"
    messages: [
      { role: "system", content: systemMessageWithInstructions },
      { role: "user", content: userPrompt.trim() },
    ],
    temperature: 1,
  });

  const text = chatResponse.choices?.[0]?.message?.content || "";
  let parsed: any;
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    console.error("Erro ao converter resposta da OpenAI em JSON:", text);
    throw new Error(
      "Falha ao processar a resposta da OpenAI como JSON válido. Conteúdo recebido: " +
        text
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
      //     basicamente, cada bloco em promptsJson tem placeholders {…}
      //     que serão substituídos por prefs[fieldName].
      const filledPrompts = fillAllPrompts(promptsJson as PromptsJson, prefs);

      // (B) Montamos um systemMessage geral a partir de todos os blocos preenchidos:
      //     (observe que generateFromPrompt espera receber o filledPrompts
      //     para concatenar os blocos já preenchidos + instruções adicionais.)
      //
      // Opcionalmente, se você quiser um comportamento “diferente” ao usar somente prefs,
      // basta trocar a chamada a generateFromPrompt por outro prompt genérico.
      //
      // Aqui vamos pedir categorias + extraIdeas:
      const systemMessagePrefs = filledPrompts.blocks
        .map((blk) => blk.prompt.trim())
        .join("\n\n");

      const systemMessageWithPrefsInstructions = `
${systemMessagePrefs}

Você é um assistente que recebe um objeto JSON com preferências de negócio de um usuário (campos como businessName, industry, targetAudience etc.).
A partir dessas preferências, gere um JSON estruturado contendo:
1) "categories": lista de categorias (campo "name") e, dentro de cada categoria, um array "ideas" com objetos de ideias (mesmos campos de id, title, description, isFavorite, etc.);
2) "extraIdeas": lista de objetos de ideias independentes (id, title, description, isFavorite, etc.).

Não inclua explicações fora do JSON. Obedeça a estrutura exatamente:
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
        temperature: 0.7,
      });

      const text = chatResponse.choices?.[0]?.message?.content || "";
      let parsedPrefs: any;
      try {
        parsedPrefs = JSON.parse(text);
      } catch (err) {
        console.error("Erro ao converter resposta da OpenAI em JSON (prefs):", text);
        throw new Error(
          "Falha ao processar a resposta da OpenAI como JSON válido. Conteúdo recebido: " +
            text
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

      // Vamos supor que o usuário queira usar o mesmo “promptsJson” preenchido com dados default,
      // ou então passo um objeto vazio para não quebrar fillAllPrompts:
      // (se você tiver um jeito de saber qual “prefs” usar aqui, pode passar as prefs certas)
      const dummyPrefs: PreferencesData = {} as any;

      // (A) Preenchemos o promptsJson “cru” usando um objeto vazio (ou padrão)
      const filledPrompts = fillAllPrompts(promptsJson as PromptsJson, dummyPrefs);
      console.log(">>> filledPrompts:", JSON.stringify(filledPrompts, null, 2));


      // (B) Definimos se é categorizado ou não:
      const isCategorized = options?.categorized ?? false;
      const promptCount = isCategorized ? options?.count : DEFAULT_NON_CATEGORIZED_COUNT;

      // (C) Chamamos nossa função geradora, que concatena todos os blocos preenchidos
      //     + instruções extras para gerar output JSON de “ideas” ou “categories”.
      const results = await generateFromPrompt(prompt, {
        categorized: isCategorized,
        platform: options?.platform,
        format: options?.format,
        tone: options?.tone,
        audience: options?.audience,
        count: promptCount,
      }, filledPrompts);

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
