import { useState } from "react";
import { useLang } from "@/lib/i18n";
import { LangSwitch } from "./Nav";

export function Footer() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between md:px-10">
        <div className="eyebrow flex items-center gap-3"><span className="size-2 rounded-full bg-primary animate-blink" /> PEAQ — {t.status}</div>
        <div className="eyebrow flex flex-wrap items-center gap-6 text-muted-foreground">
          <button onClick={() => setOpen(!open)} aria-expanded={open} className="hover:text-foreground">{t.footer.privacy}</button>
          <a href="#waitlist" className="hover:text-foreground">{t.footer.contact}</a>
          <LangSwitch />
        </div>
        <div className="eyebrow text-muted-foreground">© {new Date().getFullYear()} PEAQ. {t.footer.rights}</div>
      </div>
      {open && <p className="mx-auto max-w-[1600px] px-5 pb-10 text-sm text-muted-foreground md:px-10">{t.footer.privacyText}</p>}
    </footer>
  );
}
