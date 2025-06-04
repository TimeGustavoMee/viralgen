"use server";

import { getPref } from "@/app/(private)/dashboard/settings/actions";

// Tipos de bloco e JSON de prompts
export interface PromptsBlock {
  id: number;
  name: string;
  prompt: string;
}

export interface PromptsJson {
  blocks: PromptsBlock[];
}

// Tipo genérico para substituição de variáveis
export type VariablesObject = Record<
  string,
  string | string[] | boolean | { [k: string]: boolean }
>;

/**
 * Substitui variáveis dentro de um template no formato {variavel}.
 */
export async function fillTemplate(
  template: string,
  variables: VariablesObject
): Promise<string> {
  return template.replace(/\{([^}]+)\}/g, (_, key) => {
    const value = variables[key];
    if (value === undefined || value === null) return "";

    if (Array.isArray(value)) {
      return value.join(", ");
    } else if (typeof value === "object") {
      return JSON.stringify(value);
    } else {
      return String(value);
    }
  });
}

/**
 * Substitui variáveis em todos os blocos de um objeto `promptsJson`.
 */
export async function fillAllPrompts(
  promptsJson: PromptsJson,
  variables: VariablesObject
): Promise<PromptsJson> {
  const blocks = await Promise.all(
    promptsJson.blocks.map(async (block) => ({
      ...block,
      prompt: await fillTemplate(block.prompt, variables),
    }))
  );

  return { blocks };
}

/**
 * Wrapper principal: busca preferências do usuário e retorna prompts com variáveis substituídas.
 */
export async function generateFilledPrompts(
  userId: string
): Promise<PromptsJson | { error: any }> {
  const prefs = await getPref(userId);

  if ("error" in prefs) {
    return { error: prefs.error };
  }

  const variables: VariablesObject = {
    businessName: prefs.businessInfo?.business_name || "",
    businessType: prefs.businessInfo?.business_type || "",
    industry: prefs.businessInfo?.industry || "",
    niche: prefs.businessInfo?.niche || "",
    businessSize: prefs.businessInfo?.business_size || "",
    yearsInBusiness: prefs.businessInfo?.years_in_business || "",
    website: prefs.businessInfo?.website || "",

    targetGender: prefs.targetAudience?.target_gender || "",
    targetAge: prefs.targetAudience?.target_age || "",
    targetLocation: prefs.targetAudience?.target_location || "",
    targetInterests: prefs.targetAudience?.target_interests || [],
    targetPainPoints: prefs.targetAudience?.target_pain_points || [],

    contentTone: prefs.contentPreferences?.preferred_tone || "",
    contentFormality: prefs.contentPreferences?.preferred_formality || "",
    contentLength: prefs.contentPreferences?.preferred_length || "",
    contentFrequency: prefs.contentPreferences?.preferred_frequency || "",
    contentEmojis: prefs.contentPreferences?.use_emojis || false,
    contentHashtags: prefs.contentPreferences?.use_hashtags || false,
    contentCallToAction: prefs.contentPreferences?.cta || false,

    platforms: Object.entries(prefs.platformPreferences || {})
      .filter(([, v]) => v)
      .map(([k]) => k)
      .join(", "),

    brandValues: prefs.brandVoice?.brand_values || [],
    brandPersonality: prefs.brandVoice?.brand_personality || "",
    brandDescription: prefs.brandVoice?.brand_description || "",

    competitorUrls: prefs.examples?.competitor_urls || [],
    favoriteContent: prefs.examples?.favorite_content || "",
    contentToAvoid: prefs.examples?.content_to_avoid || "",
  };

  const { promptsJson } = await import("@/app/constants/prompts");

  return await fillAllPrompts(promptsJson, variables);
}
