import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import OpenAI from "openai";
import { promptsJson } from "@/app/constants/prompts";

// Reutiliza o schema de preferências (Zod) definido em outro arquivo
import {
  preferencesSchema,
  type PreferencesData,
} from "@/app/(private)/dashboard/settings/type";
import { get } from "http";

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
  const systemMessage = promptsJson + `
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

  const chatResponse = await openai.chat.completions.create({
    model: "gpt-4o-mini", // ou "gpt-4o", "gpt-4", 
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
      const systemMessagePrefs = promptsJson + `
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

      // Retornamos exatamente o que o modelo enviou (categories + extraIdeas)
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

      // Se não for categorizado, ignoramos o count do usuário e usamos o DEFAULT_NON_CATEGORIZED_COUNT
      const isCategorized = options?.categorized ?? false;
      const promptCount = isCategorized
        ? options?.count
        : DEFAULT_NON_CATEGORIZED_COUNT;

      const results = await generateFromPrompt(prompt, {
        categorized: isCategorized,
        platform: options?.platform,
        format: options?.format,
        tone: options?.tone,
        audience: options?.audience,
        count: promptCount,
      });

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
