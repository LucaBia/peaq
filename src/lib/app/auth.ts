import { supabase } from "@/integrations/supabase/client";

const origin = () => window.location.origin;

export type AuthErrorKey = "errCredentials" | "errNotConfirmed" | "errExists" | "errRate" | "errWeak" | "network";

export function mapAuthError(e: { message?: string; code?: string; status?: number } | null): AuthErrorKey {
  const m = `${e?.code ?? ""} ${e?.message ?? ""}`.toLowerCase();
  if (m.includes("not confirmed") || m.includes("email_not_confirmed")) return "errNotConfirmed";
  if (m.includes("invalid login") || m.includes("invalid_credentials")) return "errCredentials";
  if (m.includes("already registered") || m.includes("user_already_exists")) return "errExists";
  if (m.includes("rate") || e?.status === 429) return "errRate";
  if (m.includes("weak") || m.includes("pwned")) return "errWeak";
  return "network";
}

export const authService = {
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: `${origin()}/confirm` } });
    if (error) throw error;
    // Supabase hides existing accounts by returning a user with no identities.
    if (data.user && data.user.identities?.length === 0) throw { code: "user_already_exists" };
    return data;
  },
  async signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) throw error;
  },
  async resendConfirmation(email: string) {
    const { error } = await supabase.auth.resend({ type: "signup", email, options: { emailRedirectTo: `${origin()}/confirm` } });
    if (error) throw error;
  },
  async requestReset(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${origin()}/reset-password` });
    if (error) throw error;
  },
  async updatePassword(password: string) {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  },
  async currentUser() {
    const { data } = await supabase.auth.getUser();
    return data.user;
  },
  async signOut() {
    await supabase.auth.signOut();
  },
};
