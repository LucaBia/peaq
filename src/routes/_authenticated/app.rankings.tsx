import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { Rankings } from "@/components/app/Rankings";
import { Notice, PrimaryButton } from "@/components/app/ui";
import { athleteService } from "@/lib/app/athlete";
import { useAppLang } from "@/lib/app/i18n";
import { rankingsService, type RankMe, type RankSport } from "@/lib/app/rankings";
import type { League } from "@/lib/app/rating";
import { SOCIAL_OPEN } from "@/lib/app/social";

export const Route = createFileRoute("/_authenticated/app/rankings")({
  head: () => ({ meta: [
    { title: "Classifiche — PEAQ" }, { name: "description", content: "La classifica PEAQ della tua città." },
    { property: "og:title", content: "Classifiche — PEAQ" }, { property: "og:description", content: "La classifica PEAQ della tua città." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" },
  ] }),
  component: Page,
});

function Page() {
  const { user } = Route.useRouteContext();
  const { t } = useAppLang();
  const athlete = useQuery({ queryKey: ["athlete", user.id], queryFn: () => athleteService.loadAll(user.id) });
  const cityId = athlete.data?.profile?.city_id ?? null;
  const city = useQuery({ queryKey: ["city", cityId], queryFn: () => athleteService.city(cityId), enabled: !!cityId });
  const ranking = (sport: RankSport) => ({ queryKey: ["ranking", sport, cityId], queryFn: () => rankingsService.city(sport, cityId), enabled: !!athlete.data });
  const run = useQuery(ranking("run")), bike = useQuery(ranking("bike"));

  if (athlete.isLoading) return <div className="flex flex-1 items-center justify-center"><Loader2 className="size-8 animate-spin text-muted-foreground" /></div>;
  const profile = athlete.data?.profile;
  if (athlete.isError || !profile) return <div className="space-y-4 p-6"><Notice tone="error">{t.common.networkError}</Notice><PrimaryButton onClick={() => athlete.refetch()}>{t.common.retry}</PrimaryButton></div>;

  const ratings: RankMe["ratings"] = {};
  for (const r of athlete.data?.ratings ?? []) if (r.discipline === "run" || r.discipline === "bike") ratings[r.discipline] = { rating: r.rating, league: r.league as League };
  const me: RankMe = { userId: user.id, username: profile.username ?? "", city: city.data?.name ?? null, ratings };
  return <Rankings me={me} entries={{ run: run.data ?? [], bike: bike.data ?? [] }} athleteLinks={SOCIAL_OPEN} />;
}
