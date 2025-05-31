"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { RegisterFormData } from "./register/type";

// reset password
export async function resetPassword(formData: FormData, code: string) {
    const supabase = await createClient();
    const { error: CodeError } = await supabase.auth.exchangeCodeForSession(code);

    if (CodeError) {
        return {
            status: CodeError?.message,
        };
    }

    const { error } = await supabase.auth.updateUser({
        password: formData.get("password") as string,
    });

    if (error) {
        return {
            status: error?.message,
        };
    }

    return { status: "success" };
}
// forgot password
export async function forgotPassword(formData: FormData) {
    const supabase = await createClient();

    const email = formData.get("email") as string;

    const origin =
        process.env.NEXT_PUBLIC_BASE_URL || // Use environment variable if set
        "http://localhost:3000"; // Fallback for local development

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/reset-password`,
    });

    if (error) {
        return {
            status: error?.message,
            user: null,
        };
    }

    return { status: "success" };
}

//logiun
export async function Login(formData: FormData) {
    // Create a new Supabase client instance using the server-side function to ensure the client is created on the server
    const supabase = await createClient();

    // Extract the email and password from the FormData object
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    // Use the signInWithPassword method to authenticate the user in Supabase node_modules@supabase/supabase-js/src/lib/auth.ts
    const { error } = await supabase.auth.signInWithPassword(data);

    if (error) {
        return { error: 'Falha ao fazer login. Verifique suas credenciais' };
    }

    // Revalidate the dashboard page to update the user session
    revalidatePath('/dashboard', 'layout');
    return { success: 'Login Realizado!' };
}

export async function loginWithToken(token: string) {
    const supabase = await createClient();
    // Exchange the token for a session
    const { error } = await supabase.auth.exchangeCodeForSession(token);

    if (error) {
        return { error: 'Falha ao fazer login.' };
    }

    revalidatePath('/dashboard', 'layout');
    return { success: 'Login Realizado!' };
}


//get user session
export async function getUserSession() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();

    if (error) {
        return null;
    }

    return { status: 'success', user: data?.user };
}

export async function signup(data: RegisterFormData) {
    const supabase = await createClient();

    const email = data.email;
    const password = data.password;

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                first_name: data.firstName,
                last_name: data.lastName,
            },
        },
    });


    if (error) {
        return { status: error.message };
    }

    return { status: 'success' };
}
