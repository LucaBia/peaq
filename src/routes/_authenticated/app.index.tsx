import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, LogOut, MapPin, Shield } from "lucide-react";
import { Bib } from "@/components/app/Bib";
import { LangSwitch, Notice, PrimaryButton } from "@/components/app/ui";
import { Wordmark } from "@/components/peaq/core";
import { athleteService } from "@/lib/app/athlete";
import { currentUserIsAdmin } from "@/lib/admin/api";
import { authService } from "@/lib/app/auth";
import { fmt, useAppLang } from "@/lib/app/i18n";
import { PROVISIONAL_BASELINE, XP_FOR_NEXT_LEVEL, type League } from "@/lib/app/rating";

export const Route = createFileRoute("/_authenticated/app/")({
  head: () => ({ meta: [
    { title: "Il tuo profilo — PEAQ" }, { name: "description", content: "Il tuo pettorale, rating e progressione su PEAQ." },
    { property: "og:title", content: "Il tuo profilo — PEAQ" }, { property: "og:description", content: "Il tuo pettorale, rating e progressione su PEAQ." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" },
  ] }),
  component: Profile,
});

function Stat({ label, value, sub }: { label: string; value: React.ReactNode; sub?: React.ReactNode }) {
  return <div className="rounded-3xl border p-4"><p className="text-xs font-medium text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>{sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}</div>;
}

function Profile() {
  const { user } = Route.useRouteContext();
  const { t } = useAppLang();
  const nav = useNavigate();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["athlete", user.id], queryFn: () => athleteService.loadAll(user.id) });
  const city = useQuery({ queryKey: ["city", q.data?.profile?.city_id], queryFn: () => athleteService.city(q.data!.profile!.city_id), enabled: !!q.data?.profile?.city_id });
  const isAdmin = useQuery({ queryKey: ["is-admin", user.id], queryFn: () => currentUserIsAdmin() });

  async function logout() {
    await qc.cancelQueries(); qc.clear(); await authService.signOut(); nav({ to: "/auth", replace: true });
  }
  if (q.isLoading) return <div className="flex flex-1 items-center justify-center"><Loader2 className="size-8 animate-spin text-muted-foreground" /></div>;
  if (q.isError || !q.data?.profile) return <div className="space-y-4 p-6"><Notice tone="error">{t.common.networkError}</Notice><PrimaryButton onClick={() => q.refetch()}>{t.common.retry}</PrimaryButton></div>;

  const { profile: p, ratings, progression } = q.data;
  const run = ratings.find((r) => r.discipline === "run"), bike = ratings.find((r) => r.discipline === "bike");
  const league = ((run ?? bike)?.league as League) ?? PROVISIONAL_BASELINE.league;
  const xp = progression?.xp ?? 0, level = progression?.level ?? 1, next = XP_FOR_NEXT_LEVEL[level];
  const ratingCard = (label: string, r: typeof run) => r && (
    <Stat label={label} value={r.rating} sub={<>{t.leagues[r.league as League]}{r.provisional && <> · {t.app.provisional} · {fmt(t.app.placement, { a: r.placement_races_completed, b: r.placement_races_required })}</>}</>} />
  );

  return (
    <main className="flex-1 animate-in fade-in duration-300">
      <header className="pt-safe flex items-center justify-between px-6 pb-2">
        <Wordmark className="h-5 w-auto" />
        <div className="flex items-center gap-2"><LangSwitch />{isAdmin.data && <Link to="/admin" aria-label="Admin" className="flex size-11 items-center justify-center rounded-full hover:bg-muted"><Shield className="size-5" /></Link>}<button type="button" onClick={logout} aria-label={t.auth.logout} className="flex size-11 items-center justify-center rounded-full hover:bg-muted"><LogOut className="size-5" /></button></div>
      </header>
      <div className="space-y-6 px-6 pb-8 pt-4">
        <div>
          <h1 className="text-[2rem] font-bold leading-tight tracking-tight">@{p.username}</h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">{city.data && <><MapPin className="size-4" />{city.data.name} · </>}{t.disc[p.discipline as "run"]}</p>
        </div>
        <Bib number={p.bib_number!} username={p.username!} discipline={p.discipline as "run"} league={league} variant={p.bib_variant} />
        <div className="rounded-3xl border p-5">
          <div className="flex items-baseline justify-between"><span className="text-lg font-bold">{t.app.level} {level}</span><span className="text-sm tabular-nums text-muted-foreground">{xp}{next ? ` / ${next}` : ""} {t.app.xp}</span></div>
          <div className="mt-3 h-2 rounded-full bg-muted" role="progressbar" aria-valuenow={xp} aria-valuemax={next ?? xp} aria-label={t.app.xp}>
            <div className="h-2 rounded-full bg-primary transition-all" style={{ width: next ? `${Math.min(100, (xp / next) * 100)}%` : "100%" }} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {ratingCard(t.app.runRating, run)}
          {ratingCard(t.app.bikeRating, bike)}
          <Stat label={t.app.events} value={progression?.events_completed ?? 0} />
        </div>
        <section className="rounded-3xl bg-muted p-5">
          <h2 className="text-sm font-semibold">{t.app.upcoming}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t.app.noUpcoming}</p>
        </section>
      </div>
    </main>
  );
}
