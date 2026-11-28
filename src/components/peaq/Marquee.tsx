import { appDict } from "@/lib/app/i18n";
import { LEAGUES } from "@/lib/app/rating";
import { useLang } from "@/lib/i18n";

/** The six leagues running across a black band. */
export function Marquee() {
  const { lang } = useLang();
  const row = [...LEAGUES, ...LEAGUES, ...LEAGUES, ...LEAGUES];
  return (
    <div className="relative z-10 overflow-hidden bg-foreground py-4 text-background" aria-hidden>
      <div className="flex w-max animate-marquee">
        {row.map((l, i) => (
          <span key={i} className="font-display flex items-center gap-10 pr-10 text-3xl uppercase md:text-5xl">{appDict[lang].leagues[l]}<span className="size-3 rounded-full md:size-4" style={{ background: `var(--league-${l})` }} /></span>
        ))}
      </div>
    </div>
  );
}
