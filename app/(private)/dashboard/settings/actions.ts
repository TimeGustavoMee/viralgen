'use server';

import { createClient } from "@/utils/supabase/server";
import { UpdatePreferencesData } from "./type";

// para atualizar senha
export async function changePasswordAction(formData: FormData) {
  const supabase = await createClient();


  // Pega o e-mail do usuário logado
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) {
    return { error: "Usuário não autenticado." };
  }

  const currentPassword = formData.get("current_password") as string;
  const newPassword = formData.get("new_password") as string;

  // tenta re-autenticar com a senha atual
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: currentPassword,
  });

  if (signInError) {
    return { error: "Senha atual incorreta." };
  }

  // atualiza a senha
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    return { error: "Falha ao atualizar senha. Tente novamente." };
  }

  return { success: true };
}

export async function changeNameAction(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session?.access_token) {
    return { error: "User not authenticated." };
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/settings/change-name`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const data = await res.json();
    return { error: data.error || "Erro desconhecido." };
  }

  return { success: true };
}

// === savePref ===
// Faz upsert em todas as tabelas de preferência (business_info, target_audience, content_preferences, platform_preferences, brand_voice, examples)
export async function savePref(data: UpdatePreferencesData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError) {
    return { status: `Auth error: ${authError.message}` };
  }
  if (!user) {
    return { status: "not_authenticated" };
  }

  const userId = user.id;

  // 1) Business Information
  const businessInfoRecord = {
    user_id: userId,
    business_name: data.businessName,
    business_type: data.businessType,
    industry: data.industry,
    niche: data.niche,
    business_size: data.businessSize,
    years_in_business: data.yearsInBusiness,
    website: data.website,
  };
  const { error: errBusiness } = await supabase
    .from("business_information")
    .upsert(businessInfoRecord, { onConflict: "user_id" });
  if (errBusiness) {
    return { status: `error_business_info: ${errBusiness.message}` };
  }

  // 2) Target Audience
  const targetAudienceRecord = {
    user_id: userId,
    target_age: data.targetAge,
    target_gender: data.targetGender,
    target_location: data.targetLocation,
    target_interests: data.targetInterests,
    target_pain_points: data.targetPainPoints,
  };
  const { error: errTarget } = await supabase
    .from("target_audience")
    .upsert(targetAudienceRecord, { onConflict: "user_id" });
  if (errTarget) {
    return { status: `error_target_audience: ${errTarget.message}` };
  }

  // 3) Content Preferences (repare que agora incluímos “cta”)
  const contentPreferencesRecord = {
    user_id: userId,
    preferred_tone: data.contentTone,
    preferred_formality: data.contentFormality,
    preferred_length: data.contentLength,
    preferred_frequency: data.contentFrequency,
    use_emojis: data.contentEmojis,
    use_hashtags: data.contentHashtags,
    cta: data.contentCallToAction ?? false, // <--- reativado
  };
  const { error: errContentPrefs } = await supabase
    .from("content_preferences")
    .upsert(contentPreferencesRecord, { onConflict: "user_id" });
  if (errContentPrefs) {
    return { status: `error_content_preferences: ${errContentPrefs.message}` };
  }

  // 4) Platform Preferences
  const platformPreferencesRecord = {
    user_id: userId,
    instagram: data.platforms?.instagram || false,
    facebook: data.platforms?.facebook || false,
    tiktok: data.platforms?.tiktok || false,
    twitter: data.platforms?.twitter || false,
    linkedin: data.platforms?.linkedin || false,
    youtube: data.platforms?.youtube || false,
  };
  const { error: errPlatformPrefs } = await supabase
    .from("platform_preferences")
    .upsert(platformPreferencesRecord, { onConflict: "user_id" });
  if (errPlatformPrefs) {
    return { status: `error_platform_preferences: ${errPlatformPrefs.message}` };
  }

  // 5) Brand Voice
  const brandVoiceRecord = {
    user_id: userId,
    brand_values: data.brandValues,
    brand_personality: data.brandPersonality,
    brand_description: data.brandDescription,
  };
  const { error: errBrandVoice } = await supabase
    .from("brand_voice")
    .upsert(brandVoiceRecord, { onConflict: "user_id" });
  if (errBrandVoice) {
    return { status: `error_brand_voice: ${errBrandVoice.message}` };
  }

  // 6) Examples
  const examplesRecord = {
    user_id: userId,
    competitor_urls: data.competitorUrls,
    favorite_content: data.favoriteContent,
    content_to_avoid: data.contentToAvoid,
  };
  const { error: errExamples } = await supabase
    .from("examples")
    .upsert(examplesRecord, { onConflict: "user_id" });
  if (errExamples) {
    return { status: `error_examples: ${errExamples.message}` };
  }

  return { status: "success" };
}

export async function getPref(userId: string) {
  try {
    const supabase = await createClient();

    const { data: bizRows, error: errBiz } = await supabase
      .from("business_information")
      .select("*")
      .eq("user_id", userId)
      .limit(1)
      .single();
    if (errBiz && errBiz.code !== "PGRST116") {
      throw new Error(`Erro ao buscar business_information: ${errBiz.message}`);
    }

    const { data: targetRows, error: errTarget } = await supabase
      .from("target_audience")
      .select("*")
      .eq("user_id", userId)
      .limit(1)
      .single();
    if (errTarget && errTarget.code !== "PGRST116") {
      throw new Error(`Erro ao buscar target_audience: ${errTarget.message}`);
    }

    const { data: contentRows, error: errContent } = await supabase
      .from("content_preferences")
      .select("*")
      .eq("user_id", userId)
      .limit(1)
      .single();
    if (errContent && errContent.code !== "PGRST116") {
      throw new Error(`Erro ao buscar content_preferences: ${errContent.message}`);
    }

    const { data: platformRows, error: errPlatform } = await supabase
      .from("platform_preferences")
      .select("*")
      .eq("user_id", userId)
      .limit(1)
      .single();
    if (errPlatform && errPlatform.code !== "PGRST116") {
      throw new Error(`Erro ao buscar platform_preferences: ${errPlatform.message}`);
    }

    const { data: brandRows, error: errBrand } = await supabase
      .from("brand_voice")
      .select("*")
      .eq("user_id", userId)
      .limit(1)
      .single();
    if (errBrand && errBrand.code !== "PGRST116") {
      throw new Error(`Erro ao buscar brand_voice: ${errBrand.message}`);
    }

    const { data: examplesRows, error: errExamples } = await supabase
      .from("examples")
      .select("*")
      .eq("user_id", userId)
      .limit(1)
      .single();
    if (errExamples && errExamples.code !== "PGRST116") {
      throw new Error(`Erro ao buscar examples: ${errExamples.message}`);
    }

    return {
      businessInfo: bizRows || null,
      targetAudience: targetRows || null,
      contentPreferences: contentRows || null,
      platformPreferences: platformRows || null,
      brandVoice: brandRows || null,
      examples: examplesRows || null,
    };
  } catch (error) {
    console.error("Erro ao buscar preferências:", error);
    return { error: "Erro ao buscar preferências." };
  }
}
