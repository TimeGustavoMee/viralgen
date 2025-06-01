// app/(private)/dashboard/settings/type.ts
import { z } from "zod";

export const targetAgeEnum = z.enum([
  "18–24",
  "25–34",
  "35–44",
  "45–54",
  "55–64",
  "65+",
]);
export const targetGenderEnum = z.enum(["male", "female", "all"]);


// Reativamos “contentCallToAction” como boolean aqui:

export const preferencesSchema = z.object({
  // === BUSINESS INFORMATION ===
  businessName: z.string(),
  businessType: z.enum([
    "saas",
    "ecommerce",
    "service_provider",
    "agency",
    "restaurant",
    "retail_store",
    "healthcare",
    "education",
    "non_profit",
    "other",
  ]),

  industry: z.enum([
    "technology",
    "marketing",
    "healthcare",
    "finance",
    "education",
    "food & Beverage",
    "fashion",
    "travel",
    "fitness",
    "beauty",
    "other",
  ]),
  niche: z.string(),

  businessSize: z.enum(["solo_entrepreneur", "small", "medium", "large"]),

  yearsInBusiness: z.enum([
    "less_1_year",
    "1_3_years",
    "4_10_years",
    "more_10_years",
  ]),

  website: z.string(),

  // === TARGET AUDIENCE ===
  targetGender: z.array(targetGenderEnum).min(1),
  targetAge: z.array(targetAgeEnum).min(1),
  targetLocation: z.string(),
  targetInterests: z.array(z.string()),
  targetPainPoints: z.array(z.string()),

  // === CONTENT PREFERENCES ===
  contentTone: z.enum([
    "professional",
    "casual",
    "funny",
    "serious",
    "inspirational",
    "educational",
    "conversational",
  ]),
  contentFormality: z.enum(["formal", "semi_formal", "casual", "very_casual"]),
  contentLength: z.enum(["short", "medium", "long"]),
  contentFrequency: z.enum([
    "daily",
    "several_times_a_week",
    "weekly",
    "bi_weekly",
    "monthly",
  ]),
  contentEmojis: z.boolean(),
  contentHashtags: z.boolean(),
  contentCallToAction: z.boolean(), // <--- reativado

  // === PLATFORM PREFERENCES ===
  platforms: z.object({
    instagram: z.boolean(),
    facebook: z.boolean(),
    tiktok: z.boolean(),
    twitter: z.boolean(),
    linkedin: z.boolean(),
    youtube: z.boolean(),
  }),

  // === BRAND VOICE ===
  brandValues: z.array(z.string()),
  brandPersonality: z.string(),
  brandDescription: z.string(),

  // === EXAMPLES ===
  competitorUrls: z.array(z.string()),
  favoriteContent: z.string(),
  contentToAvoid: z.string(),
});

// Para atualização parcial (todos os campos opcionais)

export const updatePreferencesSchema = preferencesSchema.partial();


export type UpdatePreferencesData = z.infer<typeof updatePreferencesSchema>;
export type PreferencesData = z.infer<typeof preferencesSchema>;
export type TargetAge = z.infer<typeof targetAgeEnum>;

export type TargetGender = z.infer<typeof targetGenderEnum>;

