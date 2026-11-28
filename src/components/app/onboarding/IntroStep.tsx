import { Tutorial } from "../Tutorial";
import type { League } from "@/lib/app/rating";
import { useOb } from "./context";

/** Onboarding step 7: the "How PEAQ works" tutorial, shown with the athlete's own bib, rating and league. */
export function IntroStep() {
  const { data, goTo } = useOb();
  const p = data.profile!;
  const r = data.ratings.find((x) => x.discipline === "run") ?? data.ratings[0];
  return <Tutorial bib={p.bib_number!} username={p.username!} discipline={p.discipline as "run"} rating={r?.rating} league={r?.league as League | undefined} onDone={() => goTo(8)} onSkip={() => goTo(8)} />;
}
