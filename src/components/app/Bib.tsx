import { Wordmark } from "@/components/peaq/core";
import { leagueColorVar, leagueInk, type League } from "@/lib/app/rating";
import { useAppLang } from "@/lib/app/i18n";
import { cn } from "@/lib/utils";

/** Visual variants are cosmetic only; the number is never editable here. */
export const BIB_VARIANTS = { classic: { paper: "oklch(0.985 0.004 95)", ink: "oklch(0.16 0.004 160)" } } as const;
export type BibVariant = keyof typeof BIB_VARIANTS;

export function Bib({ number, username, discipline, league, variant = "classic", className, animate }: {
  number: number; username: string; discipline: "run" | "bike" | "both"; league: League; variant?: string; className?: string; animate?: boolean;
}) {
  const { t } = useAppLang();
  const v = BIB_VARIANTS[(variant as BibVariant) in BIB_VARIANTS ? (variant as BibVariant) : "classic"];
  const band = leagueColorVar(league);
  return (
    <div className={cn("relative aspect-[1.32] w-full overflow-hidden rounded-[1.25rem] shadow-[0_24px_60px_-20px_oklch(0.16_0.004_160/0.45)]", animate && "animate-in zoom-in-90 fade-in duration-700", className)}
      style={{ background: v.paper, color: v.ink }} role="img" aria-label={`PEAQ ${number} — ${username} — ${t.disc[discipline]} — ${t.leagues[league]}`}>
      {/* safety-pin holes */}
      {["left-4 top-4", "right-4 top-4", "left-4 bottom-4", "right-4 bottom-4"].map((p) => (
        <span key={p} className={cn("absolute size-3 rounded-full border-2", p)} style={{ borderColor: "oklch(0.8 0.005 95)", background: "oklch(0.93 0.004 95)" }} />
      ))}
      <div className="absolute inset-x-0 top-0 flex h-[22%] items-center justify-between px-9" style={{ background: band, color: leagueInk(league) }}>
        <Wordmark className="h-[38%] w-auto" accent={false} />
        <span className="font-mono text-[0.6rem] font-bold uppercase tracking-[0.25em]">{t.leagues[league]}</span>
      </div>
      <svg viewBox="0 0 400 120" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[40%] w-full" aria-hidden>
        <path d="M0 120 L70 60 L110 85 L180 20 L230 70 L270 45 L330 90 L400 50 L400 120Z" fill="currentColor" opacity="0.05" />
        <path d="M0 120 L90 80 L150 100 L220 55 L300 95 L400 75 L400 120Z" fill="currentColor" opacity="0.06" />
        <path d="M180 20 L230 70" stroke={league === "peaq" ? "oklch(0.6 0.22 27)" : `var(--league-${league})`} strokeWidth="3" fill="none" />
      </svg>
      <div className="absolute inset-x-0 top-[22%] bottom-[18%] flex items-center justify-center">
        <span className="font-display leading-none tracking-tight" style={{ fontSize: number >= 1000 ? "clamp(4rem,26vw,7.5rem)" : "clamp(4.5rem,32vw,9rem)" }}>{number}</span>
      </div>
      <div className="absolute inset-x-9 bottom-[7%] flex items-end justify-between font-mono text-[0.65rem] uppercase tracking-[0.18em]">
        <span className="truncate font-bold">@{username}</span>
        <span className="opacity-60">{t.disc[discipline]}</span>
      </div>
    </div>
  );
}
