import { Bib } from "../Bib";
import { Body, BottomBar, PrimaryButton } from "../ui";
import { useAppLang } from "@/lib/app/i18n";
import { PROVISIONAL_BASELINE, type League } from "@/lib/app/rating";
import { useOb } from "./context";

export function BibStep() {
  const { t } = useAppLang();
  const { data, goTo } = useOb();
  const p = data.profile!;
  const league = (data.ratings[0]?.league as League) ?? PROVISIONAL_BASELINE.league;
  return (
    <>
      <Body className="flex flex-col justify-center">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <h1 className="text-[2rem] font-bold leading-[1.05] tracking-tight">{t.ob.bib.title}</h1>
          <p className="mt-3 text-muted-foreground">{t.ob.bib.sub}</p>
        </div>
        <div className="mt-10 [perspective:1000px]">
          <Bib animate number={p.bib_number!} username={p.username!} discipline={p.discipline as "run"} league={league} variant={p.bib_variant} />
        </div>
        <div className="mt-6 flex justify-between text-sm">
          <span className="text-muted-foreground">{t.ob.bib.league}</span><span className="font-semibold">{t.leagues[league]} · {t.app.provisional}</span>
        </div>
      </Body>
      <BottomBar><PrimaryButton onClick={() => goTo(7)}>{t.common.continue}</PrimaryButton></BottomBar>
    </>
  );
}
