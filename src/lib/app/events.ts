import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { AppDict } from "@/lib/app/i18n";
import pilotImg from "@/assets/event-pilot.jpg";
import runImg from "@/assets/runner-close.jpg";
import bikeImg from "@/assets/cyclist.jpg";

type EventRow = Database["public"]["Tables"]["events"]["Row"];
export type EventDiscipline = "run" | "bike" | "both";

/** What the Events screens render. Database rows and the pilot race are both mapped to this shape. */
export type AppEvent = {
  id: string;
  title: string;
  discipline: EventDiscipline;
  /** ISO date, or null while the date is still to be announced. */
  startsAt: string | null;
  location: string | null;
  description: string | null;
  capacity: number | null;
  image: string;
  inviteOnly: boolean;
  free: boolean;
  /** Only the pilot race: its extra sections come from `t.pilot`. */
  pilot: boolean;
};

export const PILOT_EVENT_ID = "gara-pilota";
export const PILOT_STARTS = ["valle", "collina", "passo"] as const;

/**
 * The pilot race lives in code for now: the `events` table needs a date (`starts_at` is NOT NULL) and has no
 * fields for format, leagues, image or invite-only yet. See docs/07-eventi-note-per-luca.md for what to add;
 * once it's there, delete this function and publish the race from the admin panel.
 */
export function pilotEvent(t: AppDict): AppEvent {
  return {
    id: PILOT_EVENT_ID, title: t.pilot.title, discipline: "run", startsAt: null, location: t.pilot.place,
    description: null, capacity: 40, image: pilotImg, inviteOnly: true, free: true, pilot: true,
  };
}

const fromRow = (r: EventRow): AppEvent => ({
  id: r.id, title: r.title, discipline: r.discipline as EventDiscipline, startsAt: r.starts_at, location: r.location,
  description: r.description, capacity: r.capacity, image: r.discipline === "bike" ? bikeImg : runImg,
  inviteOnly: false, free: false, pilot: false,
});

export const eventsService = {
  /** Published events from the database, soonest first. */
  async listPublished(): Promise<AppEvent[]> {
    const { data, error } = await supabase.from("events").select("*").eq("status", "published").order("starts_at", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(fromRow);
  },
  async getPublished(id: string): Promise<AppEvent | null> {
    const { data, error } = await supabase.from("events").select("*").eq("status", "published").eq("id", id).maybeSingle();
    if (error) throw error;
    return data ? fromRow(data) : null;
  },
};

export const matchesSport = (e: AppEvent, sport: "all" | "run" | "bike") => sport === "all" || e.discipline === "both" || e.discipline === sport;

/** Parts of the date for posters and tickets, in the app language. */
export function dateParts(iso: string, lang: "it" | "en") {
  const d = new Date(iso), loc = lang === "it" ? "it-IT" : "en-GB";
  return {
    day: d.toLocaleDateString(loc, { day: "numeric" }),
    month: d.toLocaleDateString(loc, { month: "short" }).replace(".", ""),
    weekday: d.toLocaleDateString(loc, { weekday: "long" }),
    full: d.toLocaleDateString(loc, { weekday: "short", day: "numeric", month: "long", year: "numeric" }),
    time: d.toLocaleTimeString(loc, { hour: "2-digit", minute: "2-digit" }),
  };
}
