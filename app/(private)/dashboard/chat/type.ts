// /app/(private)/dashboard/chat/type.ts

import { z } from "zod";

/**
 * Esquema para validar cada ideia de conteúdo gerada pelo backend.
 * Inclui os campos obrigatórios e todos os campos opcionais que podem vir na API.
 */
export const ContentIdeaSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  isFavorite: z.boolean().default(false),

  // Campos opcionais para exibição detalhada
  context: z.string().optional(),
  steps: z.array(z.string()).optional(),
  examples: z.array(z.string()).optional(),
  variations: z.array(z.string()).optional(),

  // Metadados opcionais
  format: z.string().optional(),
  platform: z.string().optional(),
  tags: z.array(z.string()).optional(),
  estimatedEngagement: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  timeToCreate: z.string().optional(),
  bestTimeToPost: z.string().optional(),
  targetAudience: z.string().optional(),
});

export type ContentIdea = z.infer<typeof ContentIdeaSchema>;

/**
 * Esquema para validar uma categoria de conteúdo:
 * - name: string
 * - ideas: array de ContentIdea
 */
export const ContentCategorySchema = z.object({
  name: z.string(),
  ideas: z.array(ContentIdeaSchema),
});

export type ContentCategory = z.infer<typeof ContentCategorySchema>;
