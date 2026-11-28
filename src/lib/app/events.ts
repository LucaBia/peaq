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
export type PilotStart = (typeof PILOT_STARTS)[number];

/** Turn on when the date is set AND the database functions below exist. Until then the button says confirmations are closed. */
export const PILOT_CONFIRM_OPEN = false;

// These functions aren't in the generated database types yet: drop the cast after regenerating types.ts.
// Called lazily: importing this file must not create the Supabase client (tests and tools run without .env).
const rpc = (fn: string, args?: Record<string, unknown>) =>
  (supabase.rpc as unknown as (fn: string, args?: Record<string, unknown>) => PromiseLike<{ data: unknown; error: { message: string } | null }>).call(supabase, fn, args);

/**
 * Confirming a spot at the pilot race. Already wired to the database functions proposed in
 * docs/07-eventi-note-per-luca.md: once they exist, flip PILOT_CONFIRM_OPEN and it works.
 * While it is off, none of these is ever called.
 */
export const pilotService = {
  /** The start the athlete confirmed with, or null if they haven't confirmed. */
  async myStart(): Promise<PilotStart | null> {
    const { data, error } = await rpc("my_pilot_start");
    if (error) throw error;
    return (PILOT_STARTS as readonly string[]).includes(data as string) ? (data as PilotStart) : null;
  },
  /** Confirms, or changes the start if already confirmed. Fails with "full" when the spots are gone. */
  async confirm(start: PilotStart): Promise<void> {
    const { error } = await rpc("confirm_pilot_presence", { _start: start });
    if (error) throw error;
  },
  async cancel(): Promise<void> {
    const { error } = await rpc("cancel_pilot_presence");
    if (error) throw error;
  },
};
/** True when a confirmation failed because every spot is taken. */
export const pilotIsFull = (e: unknown) => /\bfull\b/.test((e as { message?: string } | null)?.message ?? "");

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
