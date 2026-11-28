import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import { AthletesScreen } from "@/components/app/Athletes";
import { SOCIAL_OPEN, socialService, type AthleteRow } from "@/lib/app/social";

export const Route = createFileRoute("/_authenticated/app/athletes")({
  validateSearch: z.object({ tab: z.enum(["followers", "following"]).optional() }),
  beforeLoad: () => { if (!SOCIAL_OPEN) throw redirect({ to: "/app" }); },
  head: () => ({ meta: [{ title: "Atleti — PEAQ" }, { name: "robots", content: "noindex" }] }),
  component: Page,
});

function Page() {
  const { user } = Route.useRouteContext();
  const { tab = "followers" } = Route.useSearch();
  const nav = useNavigate();
  const qc = useQueryClient();
  const [query, setQuery] = useState("");
  const q = query.trim();
  const followers = useQuery({ queryKey: ["social", "followers", user.id], queryFn: () => socialService.followers(user.id) });
  const following = useQuery({ queryKey: ["social", "following", user.id], queryFn: () => socialService.following(user.id) });
  const results = useQuery({ queryKey: ["social", "search", q], queryFn: () => socialService.search(q), enabled: q.length > 0 });
  const toggle = useMutation({
    mutationFn: (a: AthleteRow) => (a.following ? socialService.unfollow(a.userId) : socialService.follow(a.userId)),
    onSettled: () => qc.invalidateQueries({ queryKey: ["social"] }),
  });
  return (
    <AthletesScreen meId={user.id} followers={followers.data ?? []} following={following.data ?? []} tab={tab} onTab={(t) => nav({ to: "/app/athletes", search: { tab: t }, replace: true })}
      query={query} onQuery={setQuery} results={results.data ?? []} busyId={toggle.isPending ? toggle.variables.userId : null} onToggle={(a) => toggle.mutate(a)} />
  );
}
