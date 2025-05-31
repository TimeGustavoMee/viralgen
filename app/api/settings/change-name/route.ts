// app/api/settings/change-name/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase/admin';

export async function POST(req: NextRequest) {
    const formData = await req.formData();

    const token = req.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return NextResponse.json({ error: 'Token ausente' }, { status: 401 });
    }

    const {
        data: { user },
        error: userError,
    } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
        return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 });
    }

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
        user_metadata: {
            first_name: formData.get('first_name') as string,
            last_name: formData.get('last_name') as string,
        },
    });

    if (updateError) {
        return NextResponse.json({ error: 'Erro ao atualizar dados' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
