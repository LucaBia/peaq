import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type T = Database["public"]["Tables"];
export type Profile = T["athlete_profiles"]["Row"];
export type Rating = T["athlete_ratings"]["Row"];
export type Progression = T["athlete_progression"]["Row"];
export type Performance = T["athlete_performance"]["Row"];
export type PrivateInfo = T["athlete_private"]["Row"];
export type DocumentRow = T["athlete_documents"]["Row"];
export type City = T["cities"]["Row"];
export type Discipline = "run" | "bike" | "both";

/** Error codes raised by our database functions. */
export function errorCode(e: unknown): string {
  const msg = (e as { message?: string })?.message ?? "";
  const m = msg.match(/[a-z_]+/g)?.find((x) => KNOWN.has(x));
  return m ?? "network";
}
const KNOWN = new Set(["username_taken", "invalid_username", "underage", "username_locked", "taken", "reserved", "invalid_number", "already_assigned", "implausible_run", "implausible_bike", "invalid_run", "incomplete_profile", "profile_missing"]);

const ok = <D,>(r: { data: D; error: unknown }) => { if (r.error) throw r.error; return r.data; };

export const athleteService = {
  async loadAll(userId: string) {
    const [profile, priv, perf, ratings, prog, progress, docs] = await Promise.all([
      supabase.from("athlete_profiles").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("athlete_private").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("athlete_performance").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("athlete_ratings").select("*").eq("user_id", userId),
      supabase.from("athlete_progression").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("onboarding_progress").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("athlete_documents").select("*").eq("user_id", userId).order("created_at"),
    ]);
    return {
      profile: ok(profile), priv: ok(priv), perf: ok(perf), ratings: ok(ratings) ?? [], progression: ok(prog),
      progress: ok(progress), documents: ok(docs) ?? [],
    };
  },
  async city(id: string | null) {
    if (!id) return null;
    return ok(await supabase.from("cities").select("*").eq("id", id).maybeSingle());
  },
  async searchCities(q: string) {
    let req = supabase.from("cities").select("*").order("name").limit(40);
    if (q.trim()) req = req.ilike("name", `%${q.trim()}%`);
    return ok(await req) ?? [];
  },
  async usernameAvailable(u: string) {
    return ok(await supabase.rpc("username_available", { _username: u })) as boolean;
  },
  async savePersonal(v: { username: string; dob: string; gender: string; nationality: string; cityId: string }) {
    ok(await supabase.rpc("save_personal_info", { _username: v.username, _dob: v.dob, _gender: v.gender, _nationality: v.nationality, _city_id: v.cityId }));
  },
  async setDiscipline(d: Discipline) { ok(await supabase.rpc("set_discipline", { _discipline: d })); },
  async bibStatus(n: number) { return ok(await supabase.rpc("bib_status", { _number: n })) as "available" | "taken" | "reserved" | "invalid"; },
  async randomBib() { return ok(await supabase.rpc("random_available_bib")) as number; },
  async claimBib(n: number) { return ok(await supabase.rpc("claim_bib", { _number: n })) as number; },
  async savePerformance(runKm: number | null, runSec: number | null, wkg: number | null) {
    ok(await supabase.rpc("save_performance", { _run_distance_km: runKm as number, _run_time_seconds: runSec as number, _bike_wkg: wkg as number }));
  },
  async completeOnboarding() { ok(await supabase.rpc("complete_onboarding")); },
  async saveProgress(userId: string, step: number, draft: Record<string, unknown>) {
    ok(await supabase.from("onboarding_progress").upsert({ user_id: userId, current_step: step, draft: draft as never, updated_at: new Date().toISOString() }));
  },
  async uploadDocument(userId: string, v: { type: "medical_certificate" | "membership_card"; file?: File | null; expiresOn?: string; organization?: string; cardNumber?: string }) {
    let path: string | null = null;
    if (v.file) {
      const ext = v.file.name.split(".").pop()?.toLowerCase() ?? "pdf";
      path = `${userId}/${v.type}-${crypto.randomUUID()}.${ext}`;
      const up = await supabase.storage.from("athlete-documents").upload(path, v.file, { contentType: v.file.type });
      if (up.error) throw up.error;
    }
    const r = await supabase.from("athlete_documents").insert({
      user_id: userId, doc_type: v.type, storage_path: path, expires_on: v.expiresOn || null,
      organization: v.organization || null, card_number: v.cardNumber?.trim() || null,
    }).select().single();
    if (r.error) { if (path) await supabase.storage.from("athlete-documents").remove([path]); throw r.error; }
    return r.data;
  },
  async removeDocument(doc: DocumentRow) {
    ok(await supabase.from("athlete_documents").delete().eq("id", doc.id));
    if (doc.storage_path) await supabase.storage.from("athlete-documents").remove([doc.storage_path]);
  },
  async loadNotifications(userId: string) {
    const p = ok(await supabase.from("notification_preferences").select("new_events, lobby_opening, results").eq("user_id", userId).maybeSingle());
    return p ?? { new_events: false, lobby_opening: false, results: false };
  },
  async saveNotifications(userId: string, p: { new_events: boolean; lobby_opening: boolean; results: boolean }) {
    ok(await supabase.from("notification_preferences").upsert({ user_id: userId, ...p, decided_at: new Date().toISOString() }));
  },
};
