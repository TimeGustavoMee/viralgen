'use server';

import { createClient } from "@/utils/supabase/server";
import { cookies } from 'next/headers';

export async function changeNameAction(formData: FormData) {
    const cookieStore = cookies();

    const supabase = await createClient()

    const {
        data: { session },
        error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session?.access_token) {
        return { error: 'Usuário não autenticado.' };
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/settings/change-name`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${session.access_token}`,
        },
        body: formData,
    });

    if (!res.ok) {
        const data = await res.json();
        return { error: data.error || 'Erro desconhecido.' };
    }

    return { success: true };
}
