import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, MapPin } from "lucide-react";
import { fmt, useAppLang } from "@/lib/app/i18n";
import { dateParts, matchesSport, PILOT_STARTS, type AppEvent } from "@/lib/app/events";
import { cn } from "@/lib/utils";
import { Segmented } from "./ui";

type Sport = "all" | "run" | "bike";

const label = "text-[0.6875rem] font-semibold uppercase tracking-[0.08em]";
const photoShade = "absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/80";

function Badge({ children }: { children: ReactNode }) {
  return <span className={cn(label, "rounded-full bg-white px-2.5 py-1 text-black")}>{children}</span>;
}

/** Events tab: sport filter + posters (the soonest one large, the others in two columns). */
export function EventsList({ events, loading }: { events: AppEvent[]; loading?: boolean }) {
  const { t } = useAppLang();
  const [sport, setSport] = useState<Sport>("all");
  const list = events.filter((e) => matchesSport(e, sport));
  const [first, ...rest] = list;

  return (
    <main className="pt-safe flex flex-1 flex-col px-4 animate-in fade-in duration-300">
      <h1 className="px-2 pt-4 text-[2rem] font-bold tracking-tight">{t.app.eventsTitle}</h1>
      <div className="mt-4"><Segmented label={t.ev.filter} value={sport} onChange={setSport} options={(["all", "run", "bike"] as const).map((s) => ({ value: s, label: t.ev[s] }))} /></div>
      {first ? (
        <div className="mt-4 space-y-3 pb-8">
          <EventPoster event={first} size="lg" />
          {rest.length > 0 && <div className="grid grid-cols-2 gap-3">{rest.map((e) => <EventPoster key={e.id} event={e} size="sm" />)}</div>}
        </div>
      ) : !loading && (
        <p className="flex flex-1 items-center justify-center px-6 pb-16 text-center text-muted-foreground">{sport === "bike" ? t.ev.emptyBike : t.ev.emptyRun}</p>
      )}
    </main>
  );
}

function EventPoster({ event: e, size }: { event: AppEvent; size: "lg" | "sm" }) {
  const { t, lang } = useAppLang();
  const d = e.startsAt ? dateParts(e.startsAt, lang) : null;
  const lg = size === "lg";
  const meta = [e.location, d?.time, e.discipline === "both" ? null : t.ev[e.discipline], e.free ? t.ev.free : null].filter(Boolean).join(" · ");
  return (
    <Link to="/app/events/$eventId" params={{ eventId: e.id }}
      className={cn("relative flex flex-col justify-between overflow-hidden bg-black text-white transition-transform active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring", lg ? "aspect-[10/11] rounded-[1.75rem] p-5" : "aspect-[4/5] rounded-3xl p-3.5")}>
      <img src={e.image} alt="" className="absolute inset-0 size-full object-cover" />
      <div className={photoShade} />
      <div className="relative flex items-start justify-between gap-2">
        {d ? (
          <div className="flex items-start gap-2">
            <span className={cn("font-display leading-[0.85]", lg ? "text-[5.5rem]" : "text-6xl")}>{d.day}</span>
            <span className="pt-1"><span className={cn("font-display block uppercase leading-none", lg ? "text-2xl" : "text-lg")}>{d.month}</span>{lg && <span className={cn(label, "mt-1.5 block")}>{d.weekday}</span>}</span>
          </div>
        ) : <span className={cn(label, "pt-1.5")}>{t.ev.dateTbd}</span>}
        {e.inviteOnly && <Badge>{t.ev.inviteOnly}</Badge>}
      </div>
      <div className="relative">
        <h2 className={cn("font-display uppercase leading-[0.95]", lg ? "text-[2.75rem]" : "text-2xl")}>{e.title}</h2>
        <p className={cn("mt-2 text-white/90", lg ? "text-sm" : "text-xs")}>{meta}</p>
      </div>
    </Link>
  );
}

function Field({ name, children, className }: { name: string; children: ReactNode; className?: string | undefined }) {
  return <div className={className}><dt className={cn(label, "text-muted-foreground")}>{name}</dt><dd className="mt-0.5 font-semibold leading-snug">{children}</dd></div>;
}

/** Event page: the ticket, then (pilot race only) how it works, the three starts and the notes. */
export function EventDetail({ event: e, bib }: { event: AppEvent; bib: number | null | undefined }) {
  const { t, lang } = useAppLang();
  const d = e.startsAt ? dateParts(e.startsAt, lang) : null;
  const sport = e.discipline === "both" ? `${t.ev.run} · ${t.ev.bike}` : t.ev[e.discipline];

  return (
    <main className="flex flex-1 flex-col animate-in fade-in duration-300">
      <header className="pt-safe flex items-center gap-1 px-2 pb-2">
        <Link to="/app/events" aria-label={t.ev.backToEvents} className="flex size-11 shrink-0 items-center justify-center rounded-full hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"><ChevronLeft className="size-6" /></Link>
        <h1 className="truncate text-xl font-bold tracking-tight">{e.title}</h1>
      </header>

      <div className="flex-1 space-y-6 px-4 pb-6 pt-2">
        <section className="overflow-hidden rounded-3xl border">
          <div className="relative flex h-36 flex-col justify-between bg-black p-5 text-white">
            <img src={e.image} alt="" className="absolute inset-0 size-full object-cover" />
            <div className={photoShade} />
            <p className={cn(label, "relative")}>{[d ? d.full : t.ev.dateTbd, sport].join(" · ")}</p>
            <p className="font-display relative text-[2rem] uppercase leading-none">{e.title}</p>
          </div>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-4 p-5">
            <Field name={t.ev.date}>{d ? d.full : t.ev.dateTbd}</Field>
            <Field name={t.ev.start}>{d ? d.time : t.ev.timeTbd}</Field>
            <Field name={t.ev.place} className={e.pilot ? undefined : "col-span-2"}>{e.location ?? "—"}</Field>
            {e.pilot && <>
              <Field name={t.pilot.lap}>{t.pilot.lapValue}</Field>
              <Field name={t.pilot.format}>{t.pilot.formatValue}</Field>
              <Field name={t.pilot.leagues}>{t.pilot.leaguesValue}</Field>
            </>}
          </dl>
          <div className="relative" aria-hidden>
            <div className="mx-6 border-t-2 border-dashed" />
            <span className="absolute -left-3 top-1/2 size-6 -translate-y-1/2 rounded-full border bg-background" />
            <span className="absolute -right-3 top-1/2 size-6 -translate-y-1/2 rounded-full border bg-background" />
          </div>
          <dl className="grid grid-cols-[auto_1fr_auto] gap-x-5 p-5">
            <Field name={t.ev.yourBib}><span className="font-display text-3xl leading-none">{bib ? `#${bib}` : "—"}</span></Field>
            {e.pilot ? <Field name={t.pilot.startWith}>{t.pilot.startWithValue}</Field> : <Field name={t.ev.sport}>{sport}</Field>}
            <Field name={t.ev.spots}>{e.capacity ?? "—"}</Field>
          </dl>
        </section>

        {e.pilot ? <PilotSections capacity={e.capacity ?? 0} /> : e.description && (
          <section><h2 className={cn(label, "px-1 text-muted-foreground")}>{t.ev.info}</h2><p className="mt-2 whitespace-pre-line px-1">{e.description}</p></section>
        )}
      </div>

      {e.pilot && (
        // Sits just above the tab bar of the app layout (3.5rem + its bottom safe area + 1px border).
        <div className="sticky z-20 border-t bg-background/95 px-4 py-3 backdrop-blur" style={{ bottom: "calc(3.5rem + max(env(safe-area-inset-bottom), 1rem) + 1px)" }}>
          <button type="button" disabled className="flex min-h-14 w-full items-center justify-center rounded-2xl bg-muted px-4 text-center text-base font-semibold text-muted-foreground">{t.pilot.cta}</button>
        </div>
      )}
    </main>
  );
}

function PilotSections({ capacity }: { capacity: number }) {
  const { t } = useAppLang();
  const h2 = "text-xl font-bold tracking-tight";
  return (
    <>
      <div className="rounded-3xl bg-muted p-5">
        <p className="font-semibold">{fmt(t.pilot.inviteTitle, { n: capacity })}</p>
        <p className="mt-1 text-sm text-muted-foreground">{t.pilot.inviteSub}</p>
      </div>

      <section className="px-1">
        <h2 className={h2}>{t.pilot.howTitle}</h2>
        <ol className="mt-3 space-y-3">
          {t.pilot.how.map((step, i) => (
            <li key={step} className="flex items-start gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground" aria-hidden>{i + 1}</span>
              <span className="pt-0.5">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className={cn(h2, "px-1")}>{t.pilot.startsTitle}</h2>
        <p className="mt-1 px-1 text-sm text-muted-foreground">{t.pilot.startsSub}</p>
        <ul className="mt-3 divide-y rounded-3xl border">
          {PILOT_STARTS.map((l) => (
            <li key={l} className="flex items-start gap-3 p-4">
              <span className="mt-1 h-10 w-1.5 shrink-0 rounded-full" style={{ background: `var(--league-${l})` }} aria-hidden />
              <div><p className="font-semibold">{t.leagues[l]}</p><p className="text-sm text-muted-foreground">{t.pilot.starts[l]}</p></div>
            </li>
          ))}
        </ul>
      </section>

      <section className="px-1">
        <h2 className={h2}>{t.ev.info}</h2>
        <div className="mt-2 space-y-2 text-muted-foreground">{t.pilot.info.map((p) => <p key={p}>{p}</p>)}</div>
        <p className="mt-3 flex items-center gap-1.5 text-sm font-medium"><MapPin className="size-4" aria-hidden />{t.pilot.place}</p>
      </section>
    </>
  );
}
