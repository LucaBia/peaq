import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { LeaguesGuide } from "@/components/app/Guides";
import { athleteService } from "@/lib/app/athlete";
import type { League } from "@/lib/app/rating";

export const Route = createFileRoute("/_authenticated/app/leagues")({
  head: () => ({ meta: [{ title: "Le leghe — PEAQ" }, { name: "robots", content: "noindex" }] }),
  component: Page,
});

function Page() {
  const { user } = Route.useRouteContext();
  // Same cache key as the Profile page: no extra request when coming from there.
  const athlete = useQuery({ queryKey: ["athlete", user.id], queryFn: () => athleteService.loadAll(user.id) });
  const ratings = athlete.data?.ratings ?? [];
  const mine = ratings.find((r) => r.discipline === "run") ?? ratings[0];
  return <LeaguesGuide current={mine?.league as League | undefined} />;
}
