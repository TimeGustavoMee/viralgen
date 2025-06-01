// /app/(private)/dashboard/chat/actions.ts
import { z } from "zod"
import type { ContentIdea, ContentCategory } from "@/app/(private)/dashboard/chat/type"
import { ContentIdeaSchema, ContentCategorySchema } from "@/app/(private)/dashboard/chat/type"


export async function generateContentIdeas(
  prompt: string,
  options: {
    platform?: string
    format?: string
    tone?: string
    audience?: string
    count?: number
  }
): Promise<ContentIdea[]> {
  const res = await fetch("/api/openai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      options: {
        platform: options.platform,
        format: options.format,
        tone: options.tone,
        audience: options.audience,
        count: options.count,
        categorized: false, 
      },
    }),
  })

  if (!res.ok) {
    let errMsg = `Falha ao gerar ideias de conteúdo (status ${res.status})`
    try {
      const errJson = await res.json()
      if (errJson?.error) errMsg += `: ${errJson.error}`
      else if (Array.isArray(errJson?.errors)) {
        errMsg += `: ${JSON.stringify(errJson.errors)}`
      }
    } catch {
      /* ignore */
    }
    throw new Error(errMsg)
  }

  const json = await res.json()
  // Esperamos: { success: true, data: { ideas: ContentIdea[] } }
  if (!json.success || !json.data) {
    throw new Error("Resposta inesperada do servidor ao gerar ideias")
  }

  const rawIdeas = json.data.ideas
  if (!Array.isArray(rawIdeas)) {
    throw new Error("Resposta inesperada do servidor: “ideas” não é um array")
  }

  // Valida com Zod cada item
  const parseResult = z.array(ContentIdeaSchema).safeParse(rawIdeas)
  if (!parseResult.success) {
    console.error("Erro validando ContentIdea:", parseResult.error.format())
    throw new Error("Servidor retornou formato inválido para ContentIdea")
  }

  return parseResult.data
}


export async function generateCategorizedContent(
  prompt: string
): Promise<ContentCategory[]> {
  const res = await fetch("/api/openai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt,
      options: {
        categorized: true,
      },
    }),
  })

  if (!res.ok) {
    let errMsg = `Falha ao gerar conteúdo categorizado (status ${res.status})`
    try {
      const errJson = await res.json()
      if (errJson?.error) errMsg += `: ${errJson.error}`
      else if (Array.isArray(errJson?.errors)) {
        errMsg += `: ${JSON.stringify(errJson.errors)}`
      }
    } catch {
      /* ignore */
    }
    throw new Error(errMsg)
  }

  const json = await res.json()
  // Esperamos: { success: true, data: { categories: ContentCategory[] } }
  if (!json.success || !json.data) {
    throw new Error("Unexpected server response when generating categorized content")
  }

  const rawCategories = json.data.categories
  if (!Array.isArray(rawCategories)) {
    throw new Error("Unexcpeted server response: “categories” is not an array")
  }

  // Valida com Zod cada categoria
  const parseResult = z.array(ContentCategorySchema).safeParse(rawCategories)
  if (!parseResult.success) {
    console.error("Error validating", parseResult.error.format())
    throw new Error("Server returned wrong formatted ContentCategory")
  }

  return parseResult.data
}
