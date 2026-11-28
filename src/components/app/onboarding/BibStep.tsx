import { Bib } from "../Bib";
import { Body, BottomBar, PrimaryButton, Title } from "../ui";
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
      <Body>
        <Title bars sub={t.ob.bib.sub} className="animate-in fade-in slide-in-from-bottom-2 duration-500">{t.ob.bib.title}</Title>
        <div className="-mx-1 [perspective:1000px]">
          <Bib animate number={p.bib_number!} username={p.username!} discipline={p.discipline as "run"} league={league} variant={p.bib_variant} />
        </div>
      </Body>
      <BottomBar><PrimaryButton onClick={() => goTo(7)}>{t.common.continue}</PrimaryButton></BottomBar>
    </>
  );
}
