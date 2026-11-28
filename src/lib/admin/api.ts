import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Fn = Database["public"]["Functions"];
type Tbl = Database["public"]["Tables"];

export type AdminAthlete = Fn["admin_list_athletes"]["Returns"][number];
export type AdminUser = Fn["admin_list_admins"]["Returns"][number];
export type AdminDocument = Fn["admin_list_documents"]["Returns"][number];
export type EventRow = Tbl["events"]["Row"];
export type EventInsert = Tbl["events"]["Insert"];
export type EventStatus = "draft" | "published" | "cancelled";
export type City = Tbl["cities"]["Row"];

const ok = <D,>(r: { data: D; error: unknown }) => {
  if (r.error) throw r.error;
  return r.data;
};

/** Reads the signed-in user's own roles (RLS: "Users read own roles"). */
export async function currentUserIsAdmin(): Promise<boolean> {
  const { data, error } = await supabase.from("user_roles").select("role");
  if (error) return false;
  return (data ?? []).some((r) => r.role === "admin");
}

export const adminService = {
  isAdmin: currentUserIsAdmin,

  // Users
  async listAthletes() {
    return (ok(await supabase.rpc("admin_list_athletes")) ?? []) as AdminAthlete[];
  },

  // Admins
  async listAdmins() {
    return (ok(await supabase.rpc("admin_list_admins")) ?? []) as AdminUser[];
  },
  async setAdmin(userId: string, grant: boolean) {
    ok(await supabase.rpc("admin_set_admin", { _user_id: userId, _grant: grant }));
  },

  // Documents
  async listDocuments(status?: string) {
    const args = status ? { _status: status } : {};
    return (ok(await supabase.rpc("admin_list_documents", args)) ?? []) as AdminDocument[];
  },
  async reviewDocument(id: string, status: "approved" | "rejected" | "pending" | "expired", note?: string) {
    const args = note ? { _id: id, _status: status, _note: note } : { _id: id, _status: status };
    ok(await supabase.rpc("review_document", args));
  },
  async documentUrl(path: string) {
    const { data, error } = await supabase.storage.from("athlete-documents").createSignedUrl(path, 300);
    if (error) throw error;
    return data.signedUrl;
  },

  // Events
  async listEvents() {
    return (ok(await supabase.from("events").select("*").order("starts_at", { ascending: false })) ?? []) as EventRow[];
  },
  async createEvent(e: EventInsert) {
    return ok(await supabase.from("events").insert(e).select().single());
  },
  async updateEvent(id: string, e: Partial<EventInsert>) {
    ok(await supabase.from("events").update({ ...e, updated_at: new Date().toISOString() }).eq("id", id));
  },
  async setEventStatus(id: string, status: EventStatus) {
    ok(await supabase.from("events").update({ status, updated_at: new Date().toISOString() }).eq("id", id));
  },
  async deleteEvent(id: string) {
    ok(await supabase.from("events").delete().eq("id", id));
  },

  // Cities (for the event form)
  async searchCities(q: string) {
    let req = supabase.from("cities").select("*").order("name").limit(40);
    if (q.trim()) req = req.ilike("name", `%${q.trim()}%`);
    return (ok(await req) ?? []) as City[];
  },
  async cityLabel(id: string | null) {
    if (!id) return null;
    const c = ok(await supabase.from("cities").select("name,region").eq("id", id).maybeSingle());
    return c ? `${c.name}${c.region ? `, ${c.region}` : ""}` : null;
  },
};
