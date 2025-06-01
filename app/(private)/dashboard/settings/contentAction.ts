"use server";

import { createClient } from "@/utils/supabase/server";

type ContentPayload = {
    preferredTone: string;
    preferredFormality: string;
    preferredLength: string;
    preferredFrequency: string;
    useEmojis: boolean;
    useHashtags: boolean;
    // se quiser reativar o CTA, basta descomentar:
    cta: boolean;
};

export async function updateContentPreferencesAction(formData: FormData) {
    const supabase = await createClient();

    // 1) recuperar usuário logado
    const {
        data: { user },
        error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
        return { error: "Usuário não autenticado." };
    }

    const userId = user.id;

    // 2) extrair campos do formData
    const preferredTone = formData.get("preferred_tone") as string;
    const preferredFormality = formData.get("preferred_formality") as string;
    const preferredLength = formData.get("preferred_length") as string;
    const preferredFrequency = formData.get("preferred_frequency") as string;
    const useEmojis = formData.get("use_emojis") === "true";
    const useHashtags = formData.get("use_hashtags") === "true";
    // se usar CTA, descomente:
    const cta = formData.get("cta") === "true";

    // 3) montar objeto para upsert (note snake_case → colunas no Postgres)
    const contentPreferencesRecord: {
        user_id: string;
        preferred_tone: string;
        preferred_formality: string;
        preferred_length: string;
        preferred_frequency: string;
        use_emojis: boolean;
        use_hashtags: boolean;
        cta: boolean;
    } = {
        user_id: userId,
        preferred_tone: preferredTone,
        preferred_formality: preferredFormality,
        preferred_length: preferredLength,
        preferred_frequency: preferredFrequency,
        use_emojis: useEmojis,
        use_hashtags: useHashtags,
        cta,
    };

    // 4) upsert na tabela content_preferences
    const { error: errContentPrefs } = await supabase
        .from("content_preferences")
        .upsert(contentPreferencesRecord, { onConflict: "user_id" });
    if (errContentPrefs) {
        return { error: `Falha ao atualizar content_preferences: ${errContentPrefs.message}` };
    }

    // 5) opcional: se quiser retornar de volta as preferências atualizadas para o front
    const { data: newRow, error: selectError } = await supabase
        .from("content_preferences")
        .select("*")
        .eq("user_id", userId)
        .single();
    if (selectError) {
        return { error: `Preferências salvas, mas falha ao buscar: ${selectError.message}` };
    }

    return { success: true, content: newRow };
}
