import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import { SignupCta, useSignedIn } from "./Cta";
import { LeagueRidge } from "./Hero";
import { useReveal } from "./core";

/** Last block: the call to create the bib, over the league mountains. */
export function FinalCta() {
  const ref = useRef<HTMLElement>(null);
  const { t, lang } = useLang();
  const signedIn = useSignedIn();
  useReveal(ref, [lang]);
  return (
    <section ref={ref} className="px-3 pb-3">
      <div className="relative mx-auto max-w-[76rem] overflow-hidden rounded-[2.5rem] bg-[#0b0b0f] px-5 pt-20 text-center text-white md:pt-28">
        <h2 data-reveal className="whitespace-pre-line text-[clamp(2.5rem,8vw,5.5rem)] font-bold leading-[1.02] tracking-tight">{t.final.title}</h2>
        <p data-reveal="0.1" className="mx-auto mt-5 max-w-md text-lg text-white/80">{t.final.sub}</p>
        <div data-reveal="0.15" className="mt-9 flex flex-col items-center gap-2">
          <SignupCta label={t.final.cta} />
          {!signedIn && <p className="text-white/80">{t.final.have} <Link to="/auth" search={{}} className="inline-flex min-h-11 items-center font-semibold text-white underline underline-offset-4">{t.final.login}</Link></p>}
        </div>
        <LeagueRidge className="-mx-5 mt-10 h-32 w-[calc(100%+2.5rem)] max-w-none md:h-52" />
      </div>
    </section>
  );
}
