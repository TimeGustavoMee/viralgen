// /app/api/openai/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import OpenAI from "openai";

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

// Instancia o cliente oficial da OpenAI usando a variável de ambiente OPENAI_API_KEY
const openai = new OpenAI();

// Função auxiliar que chama a OpenAI e espera um JSON estruturado de volta
async function generateFromPrompt(
  prompt: string,
  options: {
    categorized?: boolean;
    platform?: string;
    format?: string;
    tone?: string;
    audience?: string;
    count?: number;
  } = {}
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
  // Vamos montar a mensagem de sistema + usuário para que o modelo retorne exatamente
  // o JSON que esperamos (com "ideas" ou "categories", conforme options.categorized).
  const systemMessage = `
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
`;

  // Monta a instrução do usuário com base no prompt recebido e nas opções
  // Podemos enriquecer a instrução incluindo platform, format, tone etc, se vierem.
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

  // Se vierem parâmetros extras, adicionamos detalhes ao pedido
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
  if (count) {
    userPrompt += `\nRetorne aproximadamente ${count} ${
      categorized ? "categorias" : "ideias"
    }.`;
  }

  // Chamamos a OpenAI Chat Completion (você pode usar qualquer modelo que desejar)
  const chatResponse = await openai.chat.completions.create({
    model: "gpt-4o-mini", // ou "gpt-4o", "gpt-4", conforme sua assinatura
    messages: [
      { role: "system", content: systemMessage.trim() },
      { role: "user", content: userPrompt.trim() },
    ],
    temperature: 1,
    // Você pode ajustar max_tokens, top_p etc conforme necessário
  });

  // O conteúdo de resposta deverá ser um JSON; então fazemos parse do texto
  const text = chatResponse.choices?.[0]?.message?.content || "";
  // Em caso de erro de parse, podemos lançar para ser capturado pelo catch
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

  // Retornamos o objeto exatamente no formato que esperamos
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

      // Para gerar a partir de prefs, podemos transformar o objeto prefs em um texto ou JSON
      // e pedir ao modelo para retornar as ideias/categorias a partir daí.
      // Exemplo de prompt:
      const prefsAsJson = JSON.stringify(prefs);
      const systemMessagePrefs = `
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
          "isFavorite": false,
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
`;

      const userMessagePrefs = `
Aqui está o objeto de preferências (JSON):
\`\`\`
${prefsAsJson}
\`\`\`
Gere as categorias e ideias conforme as instruções acima.
      `.trim();

      const chatResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemMessagePrefs.trim() },
          { role: "user", content: userMessagePrefs.trim() },
        ],
        temperature: 0.7,
      });

      const text = chatResponse.choices?.[0]?.message?.content || "";
      let parsed: any;
      try {
        parsed = JSON.parse(text);
      } catch (err) {
        console.error("Erro ao converter resposta da OpenAI em JSON (prefs):", text);
        throw new Error(
          "Falha ao processar a resposta da OpenAI como JSON válido. Conteúdo recebido: " +
            text
        );
      }

      // Retornamos exatamente o que o modelo enviou (categories + extraIdeas)
      return NextResponse.json({
        success: true,
        data: parsed,
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

      // Chamamos nossa função que dispara a OpenAI e retorna o JSON com "ideas" ou "categories"
      const fakeResult = await generateFromPrompt(prompt, {
        categorized: options?.categorized,
        platform: options?.platform,
        format: options?.format,
        tone: options?.tone,
        audience: options?.audience,
        count: options?.count,
      });

      if (options?.categorized) {
        return NextResponse.json({
          success: true,
          data: {
            categories: fakeResult.categories,
          },
        });
      } else {
        return NextResponse.json({
          success: true,
          data: {
            ideas: fakeResult.ideas,
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
