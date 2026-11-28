import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { StageGuide } from "@/components/app/Guides";
import { athleteService } from "@/lib/app/athlete";

export const Route = createFileRoute("/_authenticated/app/stage")({
  head: () => ({ meta: [{ title: "Tappa — PEAQ" }, { name: "robots", content: "noindex" }] }),
  component: Page,
});

function Page() {
  const { user } = Route.useRouteContext();
  // Same cache key as the Profile page: no extra request when coming from there.
  const athlete = useQuery({ queryKey: ["athlete", user.id], queryFn: () => athleteService.loadAll(user.id) });
  const p = athlete.data?.progression;
  return <StageGuide level={p?.level ?? 1} xp={p?.xp ?? 0} />;
}
