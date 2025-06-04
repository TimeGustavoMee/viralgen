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

⚙️ FASE 1 – DNA VIRALGEN (Criação Estratégica)

Cada conteúdo deve seguir exatamente esta sequência lógica:

📍 [fase1.1] GANCHO SUPREMO – O scroll killer

Objetivo: parar o dedo em até 3s.

Use gatilhos como: curiosidade, escassez, status, medo, antecipação.

Ex: “90% das dietas fracassam. Descubra o motivo real.”

📍 [fase1.2] CHOQUE DE REALIDADE – Confronto cognitivo

Objetivo: gerar revolta, consciência ou alerta mental.

Ex: “Você está envelhecendo 20% mais rápido por não fazer isso.”

📍 [fase1.3] STORYTELLING + CONTEXTO – Conexão emocional

Objetivo: ativar identificação e vínculo narrativo.

Ex: “Em 2018, um brasileiro transformou R$2 mil em R$2 milhões.”

📍 [fase1.4] ENTREGA DE VALOR 1 – Parte Oculta

Entregue valor real, mas guarde uma peça para depois.

Ex: “Passo 1: Identifique um produto com demanda oculta...”

📍 [fase1.5] CTA DUPLO + BENEFÍCIO REAL

Regra: 2 ações obrigatórias + uma recompensa ou benefício.

Ex: “Siga + comente ‘QUERO’ para receber o checklist oculto.”

📍 [fase1.6] ENTREGA DE VALOR 2 – Parte Revelada

Mostre a peça final, valide autoridade, conclua com impacto.

Ex: “Os 3 hacks que aumentaram meus leads em 400%.”

📍 [fase1.7] CALL TO BASE (CTB 2.0)

Leve o público para ambientes próprios e seguros.

Ex: “Acesse a lista secreta pelo link da bio.”

📍 [fase1.8] CLIFFHANGER SUPREMO – Continuidade

Ex: “Amanhã eu revelo como você pode aplicar isso em 24h.”


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
    console.log("Resposta da OpenAI:", cleaned);

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
