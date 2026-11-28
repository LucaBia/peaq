import { Wordmark } from "@/components/peaq/core";
import { leagueColorVar, leagueInk, type League } from "@/lib/app/rating";
import { useAppLang } from "@/lib/app/i18n";
import { cn } from "@/lib/utils";

/** Visual variants are cosmetic only; the number is never editable here. */
export const BIB_VARIANTS = { classic: { paper: "#ffffff", ink: "#000000" } } as const;
export type BibVariant = keyof typeof BIB_VARIANTS;

/**
 * The bib as in Figma A12: white card, logo and league on top, the number in the middle and the name on a wavy band in
 * the league colour. Every size follows the card's width (cqw), so it reads the same at any size.
 */
export function Bib({ number, username, discipline, league, variant = "classic", className, animate }: {
  number: number; username: string; discipline: "run" | "bike" | "both"; league: League; variant?: string; className?: string; animate?: boolean;
}) {
  const { t } = useAppLang();
  const v = BIB_VARIANTS[(variant as BibVariant) in BIB_VARIANTS ? (variant as BibVariant) : "classic"];
  const band = leagueColorVar(league), ink = leagueInk(league);
  return (
    <div className={cn("w-full [container-type:inline-size]", animate && "animate-in zoom-in-90 fade-in duration-700", className)}>
      <div className="relative aspect-[400/260] overflow-hidden rounded-[7cqw] border-[1.5px] shadow-[0_20px_44px_-22px_rgb(0_0_0/0.4)]" style={{ background: v.paper, color: v.ink }}
        role="img" aria-label={`PEAQ ${number} — ${username} — ${t.disc[discipline]} — ${t.leagues[league]}`}>
        <svg viewBox="0 0 400 260" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden>
          <path d="M0 200 C 50 180, 95 214, 150 196 S 250 172, 300 192 S 370 204, 400 184 L400 260 L0 260Z" fill={band} />
        </svg>
        <div className="absolute inset-x-[5cqw] top-[4.5cqw] flex items-center justify-between gap-[3cqw]">
          <Wordmark className="h-[5.5cqw] w-auto" />
          {/* On a small bib (tutorial) only the league, so the text never goes under 11px. */}
          <span className="whitespace-nowrap rounded-full px-[3cqw] py-[1.3cqw] text-[max(0.6875rem,3.25cqw)] font-semibold uppercase leading-none tracking-[0.08em]" style={{ background: band, color: ink }}>{t.leagues[league]}<span className="hidden @[20rem]:inline"> · {t.disc[discipline]}</span></span>
        </div>
        <p className="font-display absolute inset-x-0 top-[13cqw] text-center leading-none" style={{ fontSize: number >= 1000 ? "22cqw" : "25cqw" }}>{number}</p>
        <p className="absolute inset-x-[5cqw] bottom-[4.5cqw] truncate text-[6.25cqw] font-semibold uppercase leading-none tracking-[0.02em]" style={{ color: ink }}>{username}</p>
      </div>
    </div>
  );
}
