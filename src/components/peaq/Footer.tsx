import { Link } from "@tanstack/react-router";
import { useLang } from "@/lib/i18n";
import { LEGAL_PATH, legalVisible } from "@/lib/legal";
import { LangSwitch } from "./Nav";
import { Wordmark, wrap } from "./core";

export function Footer() {
  const { t } = useLang();
  const link = "inline-flex min-h-11 items-center underline-offset-4 hover:underline";
  return (
    <footer className="py-10">
      <div className={wrap}>
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div><Wordmark className="w-24" /><p className="font-display mt-3 text-xl uppercase leading-none">{t.footer.tagline}</p></div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {/* The legal pages appear here once they are published (lib/legal.ts). */}
            {legalVisible && <><Link to={LEGAL_PATH.privacy} className={link}>{t.footer.privacy}</Link><Link to={LEGAL_PATH.terms} className={link}>{t.footer.terms}</Link><Link to={LEGAL_PATH.cookie} className={link}>{t.footer.cookie}</Link></>}
            <LangSwitch />
          </div>
        </div>
        <p className="mt-8 border-t pt-6 text-sm text-muted-foreground">© {new Date().getFullYear()} PEAQ. {t.footer.rights} {t.footer.adults}</p>
      </div>
    </footer>
  );
}
