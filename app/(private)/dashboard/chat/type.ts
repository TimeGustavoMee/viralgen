// /app/(private)/dashboard/chat/type.ts
import { Viewport } from "@radix-ui/react-toast";
import { View } from "lucide-react";
import { z } from "zod";

export const ContentIdeaSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  isFavorite: z.boolean().default(false),
});
export type ContentIdea = z.infer<typeof ContentIdeaSchema>;

export const ContentCategorySchema = z.object({
  name: z.string(),
  ideas: z.array(ContentIdeaSchema),
});
export type ContentCategory = z.infer<typeof ContentCategorySchema>;
