"use server";

import { createClient } from "@/utils/supabase/server";
import { UpdatePreferencesData } from "./type";

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

    // 2) Target Audience
    const targetAudienceRecord = {
        user_id: userId,
        target_age: data.targetAge,
        target_gender: data.targetGender,
        target_location: data.targetLocation,
        target_interests: data.targetInterests,
        target_pain_points: data.targetPainPoints,
    };

    // 3) Content Preferences — remove `content_call_to_action` entirely
    const contentPreferencesRecord = {
        user_id: userId,
        content_tone: data.contentTone,
        content_formality: data.contentFormality,
        content_length: data.contentLength,
        content_frequency: data.contentFrequency,
        content_emojis: data.contentEmojis,
        content_hashtags: data.contentHashtags,
        // ** OMIT `content_call_to_action` here **
    };

    // 4) Platform Preferences
    const platformPreferencesRecord = {
        user_id: userId,
        platforms: data.platforms,
    };

    // 5) Brand Voice
    const brandVoiceRecord = {
        user_id: userId,
        brand_values: data.brandValues,
        brand_personality: data.brandPersonality,
        brand_description: data.brandDescription,
    };

    // 6) Examples
    const examplesRecord = {
        user_id: userId,
        competitor_urls: data.competitorUrls,
        favorite_content: data.favoriteContent,
        content_to_avoid: data.contentToAvoid,
    };

    // Upsert each table in turn:

    const { error: errBusiness } = await supabase
        .from("business_information")
        .upsert(businessInfoRecord, { onConflict: "user_id" });
    if (errBusiness) {
        return { status: `error_business_info: ${errBusiness.message}` };
    }

    const { error: errTarget } = await supabase
        .from("target_audience")
        .upsert(targetAudienceRecord, { onConflict: "user_id" });
    if (errTarget) {
        return { status: `error_target_audience: ${errTarget.message}` };
    }

    const { error: errContentPrefs } = await supabase
        .from("content_preferences")
        .upsert(contentPreferencesRecord, { onConflict: "user_id" });
    if (errContentPrefs) {
        return { status: `error_content_preferences: ${errContentPrefs.message}` };
    }

    const { error: errPlatformPrefs } = await supabase
        .from("platform_preferences")
        .upsert(platformPreferencesRecord, { onConflict: "user_id" });
    if (errPlatformPrefs) {
        return { status: `error_platform_preferences: ${errPlatformPrefs.message}` };
    }

    const { error: errBrandVoice } = await supabase
        .from("brand_voice")
        .upsert(brandVoiceRecord, { onConflict: "user_id" });
    if (errBrandVoice) {
        return { status: `error_brand_voice: ${errBrandVoice.message}` };
    }

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
