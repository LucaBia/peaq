import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { LeagueGuide } from "@/components/app/Guides";
import { athleteService } from "@/lib/app/athlete";
import { LEAGUES, type League } from "@/lib/app/rating";

// "leagues_" keeps this page a sibling of the leagues list instead of nesting it inside the list.
export const Route = createFileRoute("/_authenticated/app/leagues_/$league")({
  head: () => ({ meta: [{ title: "Lega — PEAQ" }, { name: "robots", content: "noindex" }] }),
  component: Page,
});

function Page() {
  const { league } = Route.useParams();
  const { user } = Route.useRouteContext();
  // Same cache key as the Profile page: no extra request when coming from there.
  const athlete = useQuery({ queryKey: ["athlete", user.id], queryFn: () => athleteService.loadAll(user.id) });
  if (!(LEAGUES as readonly string[]).includes(league)) return <Navigate to="/app/leagues" replace />;
  const ratings = athlete.data?.ratings ?? [];
  const mine = ratings.find((r) => r.discipline === "run") ?? ratings[0];
  return <LeagueGuide league={league as League} current={mine?.league as League | undefined} />;
}
