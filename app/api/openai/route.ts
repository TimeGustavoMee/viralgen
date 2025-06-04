// /app/api/openai/route.ts

"use server";

import { NextResponse } from "next/server";
import { z } from "zod";
import OpenAI from "openai";
import { generateFilledPrompts } from "@/utils/fillPrompts";

const requestBodySchema = z.object({
  prompt: z.string(),
  userId: z.string(),
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

const DEFAULT_NON_CATEGORIZED_COUNT = 5;
const openai = new OpenAI();

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = requestBodySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, errors: parsed.error.format() },
        { status: 400 }
      );
    }

    const { prompt, userId, options } = parsed.data;
    const isCategorized = options?.categorized ?? false;
    const ideaCount = options?.count ?? DEFAULT_NON_CATEGORIZED_COUNT;

    const filledPrompts = await generateFilledPrompts(userId);
    if ("error" in filledPrompts) {
      return NextResponse.json(
        { success: false, error: filledPrompts.error },
        { status: 500 }
      );
    }

    const systemMessage = filledPrompts.blocks
      .map((blk) => blk.prompt.trim())
      .join("\n\n");

    const systemMessageWithInstructions = `
${systemMessage}

Você é um assistente que **sempre retorna apenas JSON válido com aspas duplas ASCII (")**. Não adicione texto fora do JSON.

Formato esperado da resposta:
{
  "ideas": [ ... ],
  "categories": [ ... ]
}

Para cada ideia de conteúdo, inclua:
- id
- title
- description
- context
- steps (em ordem)
- examples
- variations
- platform
- format
- tags
- estimatedEngagement
- difficulty
- timeToCreate
- bestTimeToPost
- targetAudience
- isFavorite (sempre false)

NUNCA inclua explicações fora do JSON.
`.trim();

    let userPrompt = `
Com base neste input do usuário: "${prompt}", gere exatamente ${ideaCount} ideias de conteúdo altamente detalhadas com base nas preferências do negócio.

Cada ideia deve conter:
1. Contexto e justificativa;
2. Passos de implementação (em ordem);
3. Exemplos práticos;
4. Sugestões de variações;

A resposta deve estar em JSON puro e válido.
`.trim();

    if (options?.platform) userPrompt += `\nPlataforma: ${options.platform}`;
    if (options?.format) userPrompt += `\nFormato: ${options.format}`;
    if (options?.tone) userPrompt += `\nTom: ${options.tone}`;
    if (options?.audience) userPrompt += `\nPúblico-alvo: ${options.audience}`;

    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemMessageWithInstructions },
        { role: "user", content: userPrompt },
      ],
      temperature: 1,
      max_tokens: 3000,
    });

    const rawText = chatResponse.choices?.[0]?.message?.content || "";
    const cleaned = rawText.replace(/[“”]/g, '"').replace(/‘|’/g, "'");
    //console.log("Resposta da OpenAI:", cleaned);

    let parsedJson;
    try {
      parsedJson = JSON.parse(cleaned);
    } catch (err) {
      return NextResponse.json(
        { success: false, error: "Resposta inválida da OpenAI." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: isCategorized
        ? { categories: parsedJson.categories || [] }
        : { ideas: parsedJson.ideas || [] },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Erro desconhecido" },
      { status: 500 }
    );
  }
}
