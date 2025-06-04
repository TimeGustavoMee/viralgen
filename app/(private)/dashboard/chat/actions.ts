"use client";

import { z } from "zod";
import type { ContentIdea, ContentCategory } from "./type";
import { ContentIdeaSchema, ContentCategorySchema } from "./type";

// Utilitários para normalização
function normalizeDifficulty(value: string | undefined): "easy" | "medium" | "hard" | undefined {
  if (!value) return undefined;
  const val = value.toLowerCase();
  if (val.includes("easy") || val.includes("fácil")) return "easy";
  if (val.includes("medium") || val.includes("médio")) return "medium";
  if (val.includes("hard") || val.includes("difícil")) return "hard";
  return undefined;
}

function sanitizeIdeas(ideas: any[]): ContentIdea[] {
  return ideas.map((idea, idx) => ({
    id: idea.id || `${Date.now()}-${idx}`,
    title: idea.title ?? "Untitled Idea",
    description: idea.description ?? "",
    isFavorite: idea.isFavorite ?? false,
    context: idea.context ?? "",
    steps: Array.isArray(idea.steps) ? idea.steps : [],
    examples: Array.isArray(idea.examples) ? idea.examples : [],
    variations: Array.isArray(idea.variations) ? idea.variations : [],
    format: idea.format ?? undefined,
    platform: idea.platform ?? undefined,
    tags: Array.isArray(idea.tags) ? idea.tags : [],
    estimatedEngagement: idea.estimatedEngagement ?? undefined,
    difficulty: normalizeDifficulty(idea.difficulty),
    timeToCreate: idea.timeToCreate ?? undefined,
    bestTimeToPost: idea.bestTimeToPost ?? undefined,
    targetAudience: idea.targetAudience ?? undefined,
  }));
}

// Geração de ideias simples (não categorizadas)
export async function generateContentIdeas(
  prompt: string,
  options: {
    platform?: string;
    format?: string;
    tone?: string;
    audience?: string;
    count?: number;
    userId: string;
  }
): Promise<ContentIdea[]> {
  const { userId, ...restOptions } = options;

  const res = await fetch("/api/openai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      prompt,
      userId,
      options: {
        ...restOptions,
        categorized: false,
      },
    }),
  });

  if (!res.ok) {
    let errMsg = `Falha ao gerar ideias de conteúdo (status ${res.status})`;
    try {
      const errJson = await res.json();
      if (errJson?.error) errMsg += `: ${errJson.error}`;
      console.error("Erro ao gerar ideias de conteúdo:", errJson);
    } catch { }
    console.error("Erro ao gerar ideias de conteúdo:", errMsg);
    throw new Error(errMsg);
  }

  const json = await res.json();
  const sanitized = sanitizeIdeas(json.data.ideas || []);

  const parseResult = z.array(ContentIdeaSchema).safeParse(sanitized);
  if (!parseResult.success) {
    console.error("Erro de validação em ContentIdea:", parseResult.error.format());
    throw new Error("Formato inválido para ContentIdea");
  }

  return parseResult.data;
}

// Geração de conteúdo categorizado
export async function generateCategorizedContent(
  prompt: string,
  options: {
    platform?: string;
    format?: string;
    tone?: string;
    audience?: string;
    count?: number;
    userId: string;
  }
): Promise<ContentCategory[]> {
  const { userId, ...restOptions } = options;

  const res = await fetch("/api/openai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      prompt,
      userId,
      options: {
        ...restOptions,
        categorized: true, // ainda envia categorized como true
      },
    }),
  });

  if (!res.ok) {
    let errMsg = `Falha ao gerar conteúdo categorizado (status ${res.status})`;
    try {
      const errJson = await res.json();
      if (errJson?.error) errMsg += `: ${errJson.error}`;
    } catch { }
    throw new Error(errMsg);
  }

  const json = await res.json();
  const ideas = sanitizeIdeas(json.data?.ideas || []);
  console.log("Ideias sanitizadas:", ideas);

  const result: ContentCategory[] = [{
    name: json.data?.categoryName || "Uncategorized",
    ideas,
  }];

  const parse = z.array(ContentCategorySchema).safeParse(result);
  if (!parse.success) {
    console.error("Erro de validação em ContentCategory:", parse.error.format());
    throw new Error("Formato inválido para ContentCategory");
  }

  return parse.data;
}