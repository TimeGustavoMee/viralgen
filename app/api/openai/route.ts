// /app/api/openai/route.ts

"use server";

import { NextResponse } from "next/server";
import { z } from "zod";
import OpenAI from "openai";

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
    let ideaCount: number;
    if (isCategorized) {
      ideaCount = options?.count ?? DEFAULT_NON_CATEGORIZED_COUNT;
    } else {
      ideaCount = DEFAULT_NON_CATEGORIZED_COUNT;
    }

    // 1. SYSTEM MESSAGE WITH INSTRUCTIONS
    const systemMessageWithInstructions = `
You are an assistant that **must always return only valid JSON using ASCII double quotes (")**. Do not add any text outside the JSON.

Expected response format (example of a single content idea):
{
  "ideas": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "fase1": {
        "ganchoSupremo": "string",
        "choqueDeRealidade": "string",
        "storytellingContexto": "string",
        "entregaDeValor1": "string",
        "ctaDuploBeneficio": "string",
        "entregaDeValor2": "string",
        "callToBase": "string",
        "cliffhangerSupremo": "string"
      },
      "context": "string",
      "steps": ["string", "..."],
      "examples": ["string", "..."],
      "variations": ["string", "..."],
      "platform": "string",
      "format": "string",
      "tags": ["string", "..."],
      "estimatedEngagement": "string",
      "difficulty": "string",
      "timeToCreate": "string",
      "bestTimeToPost": "string",
      "targetAudience": "string",
      "isFavorite": false
    }
  ]
}

Rules:
1. For each idea, fill in all required fields (id, title, description, context, steps, examples, variations, platform, format, tags, estimatedEngagement, difficulty, timeToCreate, bestTimeToPost, targetAudience, isFavorite).
2. The “fase1” object must contain exactly these 8 keys:
   - “ganchoSupremo”
   - “choqueDeRealidade”
   - “storytellingContexto”
   - “entregaDeValor1”
   - “ctaDuploBeneficio”
   - “entregaDeValor2”
   - “callToBase”
   - “cliffhangerSupremo”
3. Do not include any explanations outside the JSON. Only return the complete JSON object.
`.trim();

    // 2. USER PROMPT
    let userPrompt = `
Based on this user input: "${prompt}", generate exactly ${ideaCount} highly detailed content ideas based on the business preferences.

Each idea must strictly follow this logical sequence (VIRALGEN DNA – Strategic Creation):

📍 [fase1.1] ULTIMATE HOOK – The scroll killer  
Goal: stop the scroll within 3s. Use triggers like curiosity, scarcity, status, or fear.  
Ex: “90% of diets fail. Discover the real reason.”

📍 [fase1.2] REALITY SHOCK – Cognitive confrontation  
Goal: generate outrage, awareness, or a mental alert.  
Ex: “You’re aging 20% faster by not doing this.”

📍 [fase1.3] STORYTELLING + CONTEXT – Emotional connection  
Goal: activate identification and narrative bonding.  
Ex: “In 2018, a Brazilian turned R$2,000 into R$2 million.”

📍 [fase1.4] VALUE DELIVERY 1 – The hidden part  
Deliver real value, but hold one piece back.  
Ex: “Step 1: Identify a product with hidden demand...”

📍 [fase1.5] DUAL CTA + REAL BENEFIT  
Rule: 2 mandatory actions + a reward or benefit.  
Ex: “Follow + comment ‘WANT’ to get the hidden checklist.”

📍 [fase1.6] VALUE DELIVERY 2 – The revealed part  
Show the final piece, validate authority, end with impact.  
Ex: “The 3 hacks that increased my leads by 400%.”

📍 [fase1.7] CALL TO BASE (CTB 2.0)  
Bring the audience to your own safe environments.  
Ex: “Access the secret list via the bio link.”

📍 [fase1.8] ULTIMATE CLIFFHANGER – Continuity  
Ex: “Tomorrow I’ll reveal how you can apply this in 24h.”

The response must be pure and valid JSON, strictly following the format described in the system message.
`.trim();
    if (isCategorized) {
      if (options?.platform) userPrompt += `\nPlatform: ${options.platform}`;
      if (options?.format) userPrompt += `\nFormat: ${options.format}`;
      if (options?.tone) userPrompt += `\nTone: ${options.tone}`;
      if (options?.audience) userPrompt += `\nTarget audience: ${options.audience}`;
      if (options?.count) {
        userPrompt += `\nNumber of ideas: ${options.count}`;
      }

    };

    // 3. CALL TO OPENAI
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemMessageWithInstructions },
        { role: "user", content: userPrompt },
      ],
      temperature: 1,
      max_tokens: 6000,
    });
    console.log("OpenAI response:", chatResponse);
    const rawText = chatResponse.choices?.[0]?.message?.content || "";
    const cleaned = rawText.replace(/[“”]/g, '"').replace(/‘|’/g, "'");
    console.log("Raw response from OpenAI:", rawText);

    let parsedJson;
    try {
      parsedJson = JSON.parse(cleaned);
    } catch (err) {
      return NextResponse.json(
        { success: false, error: "Invalid response from OpenAI." },
        { status: 500 }
      );
    }

    console.log("Parsed JSON:", parsedJson);
    return NextResponse.json({
      success: true,
      data: {
        ideas: parsedJson.ideas,
      },
    })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}
