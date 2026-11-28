import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Tutorial } from "@/components/app/Tutorial";
import { AppFrame } from "@/components/app/ui";
import { athleteService } from "@/lib/app/athlete";
import type { League } from "@/lib/app/rating";

// "How PEAQ works", opened from Help. Outside /app on purpose: full screen, without the tab bar.
export const Route = createFileRoute("/_authenticated/how")({
  head: () => ({ meta: [{ title: "Come funziona PEAQ — PEAQ" }, { name: "robots", content: "noindex" }] }),
  component: Page,
});

function Page() {
  const { user } = Route.useRouteContext();
  const nav = useNavigate();
  const q = useQuery({ queryKey: ["athlete", user.id], queryFn: () => athleteService.loadAll(user.id) });
  const p = q.data?.profile;
  const r = q.data?.ratings.find((x) => x.discipline === "run") ?? q.data?.ratings[0];
  const back = () => nav({ to: "/app/help" });
  return (
    <AppFrame>
      <div className="pt-safe flex flex-1 flex-col">
        {p && <Tutorial bib={p.bib_number ?? 0} username={p.username ?? ""} discipline={(p.discipline ?? "run") as "run"} rating={r?.rating} league={r?.league as League | undefined} onDone={back} onSkip={back} />}
      </div>
    </AppFrame>
  );
}
