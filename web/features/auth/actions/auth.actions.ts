"use server";

import { revalidatePath } from "next/cache";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabasePublicEnv } from "@/lib/supabase/shared";
import { loginSchema, registerSchema } from "@/features/auth/schemas/auth.schemas";

export type AuthActionState = {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!hasSupabasePublicEnv()) {
    return {
      success: false,
      message: "Missing Supabase env. Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please check the form fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  revalidatePath("/dashboard", "layout");

  return {
    success: true,
    message: "Logged in successfully.",
  };
}

export async function registerAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  if (!hasSupabasePublicEnv()) {
    return {
      success: false,
      message: "Missing Supabase env. Configure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    };
  }

  const parsed = registerSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please check the form fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        full_name: parsed.data.fullName,
      },
    },
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  if (!data.user) {
    return {
      success: false,
      message: "Could not create user.",
    };
  }

  return {
    success: true,
    message: "Account created. You can now log in.",
  };
}

export async function logoutAction() {
  if (!hasSupabasePublicEnv()) {
    return;
  }

  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();

  revalidatePath("/", "layout");
}
