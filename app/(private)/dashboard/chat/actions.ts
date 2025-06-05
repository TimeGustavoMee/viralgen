// src/app/(private)/dashboard/chat/actions.ts
"use client";

import { z } from "zod";
import type { ContentIdea, ContentCategory } from "./type";
import { ContentIdeaSchema, ContentCategorySchema } from "./type";

// Utilitários para normalização (mantive o normalizeDifficulty igual ao seu)
function normalizeDifficulty(
  value: string | undefined
): "easy" | "medium" | "hard" | undefined {
  if (!value) return undefined;
  const val = value.toLowerCase();
  if (val.includes("easy") || val.includes("fácil")) return "easy";
  if (val.includes("medium") || val.includes("médio")) return "medium";
  if (val.includes("hard") || val.includes("difícil")) return "hard";
  return undefined;
}

interface RawIdea {
  id?: string;
  title?: string;
  description?: string;
  isFavorite?: boolean;
  context?: string;
  steps?: unknown;
  examples?: unknown;
  variations?: unknown;
  format?: string;
  platform?: string;
  tags?: unknown;
  estimatedEngagement?: string;
  difficulty?: string;
  timeToCreate?: string;
  bestTimeToPost?: string;
  targetAudience?: string;
  // adicionamos aqui o objeto inteiro que vem do backend
  fase1?: {
    ganchoSupremo?: string;
    choqueDeRealidade?: string;
    storytellingContexto?: string;
    entregaDeValor1?: string;
    ctaDuploBeneficio?: string;
    entregaDeValor2?: string;
    callToBase?: string;
    cliffhangerSupremo?: string;
  };
}

function sanitizeIdeas(ideas: RawIdea[]): ContentIdea[] {
  return ideas.map((idea, idx) => {
    // 1) garante que existe um objeto “fase1”
    const rawFase1 = idea.fase1 ?? {};
    // 2) extrai cada campo de dentro de fase1
    const fase1 = {
      ganchoSupremo: rawFase1.ganchoSupremo ?? "",
      choqueDeRealidade: rawFase1.choqueDeRealidade ?? "",
      storytellingContexto: rawFase1.storytellingContexto ?? "",
      entregaDeValor1: rawFase1.entregaDeValor1 ?? "",
      ctaDuploBeneficio: rawFase1.ctaDuploBeneficio ?? "",
      entregaDeValor2: rawFase1.entregaDeValor2 ?? "",
      callToBase: rawFase1.callToBase ?? "",
      cliffhangerSupremo: rawFase1.cliffhangerSupremo ?? "",
    };

    return {
      id: idea.id || `${Date.now()}-${idx}`,
      title: idea.title ?? "Untitled Idea",
      description: idea.description ?? "",
      isFavorite: idea.isFavorite ?? false,

      // **não esqueça de incluir fase1 aqui**
      fase1,

      context: idea.context ?? "",
      steps: Array.isArray(idea.steps) ? (idea.steps as string[]) : [],
      examples: Array.isArray(idea.examples) ? (idea.examples as string[]) : [],
      variations: Array.isArray(idea.variations)
        ? (idea.variations as string[])
        : [],
      format: idea.format ?? undefined,
      platform: idea.platform ?? undefined,
      tags: Array.isArray(idea.tags) ? (idea.tags as string[]) : [],
      estimatedEngagement: idea.estimatedEngagement ?? undefined,
      difficulty: normalizeDifficulty(idea.difficulty),
      timeToCreate: idea.timeToCreate ?? undefined,
      bestTimeToPost: idea.bestTimeToPost ?? undefined,
      targetAudience: idea.targetAudience ?? undefined,
    };
  });
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

  let res: Response;
  try {
    res = await fetch("/api/openai", {
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
  } catch (fetchErr) {
    console.error("Erro de rede ao chamar /api/openai:", fetchErr);
    throw new Error("Não foi possível conectar ao servidor para gerar ideias.");
  }

  if (!res.ok) {
    let errMsg = `Falha ao gerar ideias de conteúdo (status ${res.status})`;
    let errJson: any = {};
    try {
      errJson = await res.json();
      if (errJson?.error) {
        errMsg += `: ${errJson.error}`;
      } else {
        errMsg += ": Resposta inválida da OpenAI.";
      }
    } catch (parseErr) {
      console.error("Não foi possível parsear JSON de erro:", parseErr);
      errMsg += ": Resposta de erro não é JSON.";
    }
    console.error("Erro ao gerar ideias de conteúdo:", errJson);
    throw new Error(errMsg);
  }

  let json: any;
  try {
    json = await res.json();
  } catch (parseErr) {
    console.error("Erro ao parsear JSON de sucesso:", parseErr);
    throw new Error("Resposta inválida ao gerar ideias de conteúdo.");
  }

  // Verifica se o JSON tem o formato esperado
  if (!json.data || !Array.isArray(json.data.ideas)) {
    console.error("Formato de resposta inesperado:", json);
    throw new Error("Formato de dados inesperado ao gerar ideias.");
  }

  const rawIdeas = json.data.ideas;
  const sanitized = sanitizeIdeas(rawIdeas);

  return sanitized;
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

  let res: Response;
  try {
    res = await fetch("/api/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        prompt,
        userId,
        options: {
          ...restOptions,
          categorized: true,
        },
      }),
    });
  } catch (fetchErr) {
    console.error("Erro de rede ao chamar /api/openai (categorizado):", fetchErr);
    throw new Error("Não foi possível conectar ao servidor para gerar conteúdo categorizado.");
  }

  if (!res.ok) {
    let errMsg = `Falha ao gerar conteúdo categorizado (status ${res.status})`;
    let errJson: any = {};
    try {
      errJson = await res.json();
      if (errJson?.error) {
        errMsg += `: ${errJson.error}`;
      } else {
        errMsg += ": Resposta inválida da OpenAI.";
      }
    } catch (parseErr) {
      console.error("Não foi possível parsear JSON de erro:", parseErr);
      errMsg += ": Resposta de erro não é JSON.";
    }
    console.error("Erro ao gerar conteúdo categorizado:", errJson);
    throw new Error(errMsg);
  }

  let json: any;
  try {
    json = await res.json();
  } catch (parseErr) {
    console.error("Erro ao parsear JSON categorizado de sucesso:", parseErr);
    throw new Error("Resposta inválida ao gerar conteúdo categorizado.");
  }

  // Verifica formato esperado
  if (!json.data || !Array.isArray(json.data.ideas)) {
    console.error("Formato de resposta categorizada inesperado:", json);
    throw new Error("Formato de dados inesperado ao gerar conteúdo categorizado.");
  }

  const rawIdeas = json.data.ideas;
  const sanitized = sanitizeIdeas(rawIdeas);

  const categoryName =
    typeof json.data.categoryName === "string"
      ? json.data.categoryName
      : "Uncategorized";

  const result: ContentCategory[] = [
    {
      name: categoryName,
      ideas: sanitized,
    },
  ];

  return result;
}
