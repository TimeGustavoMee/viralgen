// /app/(private)/dashboard/chat/type.ts

import { z } from "zod";

/**
 * Esquema para validar cada ideia de conteúdo gerada pelo backend.
 * Inclui os campos obrigatórios e todos os campos opcionais que podem vir na API.
 */
export const ContentIdeaSchema = z.object({
  id: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  isFavorite: z.boolean().default(false).optional(),
  fase1: z.object({
    ganchoSupremo: z.string(),
    choqueDeRealidade: z.string(),
    storytellingContexto: z.string(),
    entregaDeValor1: z.string(),
    ctaDuploBeneficio: z.string(),
    entregaDeValor2: z.string(),
    callToBase: z.string(),
    cliffhangerSupremo: z.string(),
  }),
  context: z.string().optional(),
  steps: z.array(z.string()).optional(),
  examples: z.array(z.string()).optional(),
  variations: z.array(z.string()).optional(),
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


export type ContentCategory = z.infer<typeof ContentIdeaSchema>;
