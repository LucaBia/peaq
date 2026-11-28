import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, Loader2, X } from "lucide-react";
import { Body, BottomBar, Field, Notice, OptionList, PrimaryButton, SearchBox, SelectButton, Sheet, TextInput, Title } from "../ui";
import { useAppLang } from "@/lib/app/i18n";
import { athleteService, errorCode } from "@/lib/app/athlete";
import { COUNTRY_CODES, countryName, flag } from "@/lib/app/countries";
import { isAdult, isValidUsername } from "@/lib/app/validation";
import { useOb } from "./context";

const GENDERS = ["male", "female", "non_binary", "undisclosed"] as const;

function maxDob() { const d = new Date(); d.setFullYear(d.getFullYear() - 18); return d.toISOString().slice(0, 10); }

export function PersonalStep() {
  const { t, lang } = useAppLang();
  const { draft, setDraft, goTo, data } = useOb();
  const locked = !!data.profile?.onboarding_completed_at;
  const username = draft.username ?? "";
  const [sheet, setSheet] = useState<null | "gender" | "country" | "city">(null);
  const [q, setQ] = useState("");
  const [uState, setUState] = useState<"idle" | "checking" | "ok" | "taken" | "invalid">("idle");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [dobTouched, setDobTouched] = useState(false);

  useEffect(() => {
    if (!username) return setUState("idle");
    if (!isValidUsername(username)) return setUState("invalid");
    setUState("checking");
    const id = setTimeout(async () => {
      try { setUState((await athleteService.usernameAvailable(username)) ? "ok" : "taken"); } catch { setUState("idle"); }
    }, 400);
    return () => clearTimeout(id);
  }, [username]);

  const countries = useMemo(() => COUNTRY_CODES.map((c) => ({ value: c, label: `${flag(c)}  ${countryName(c, lang)}` }))
    .sort((a, b) => a.label.slice(4).localeCompare(b.label.slice(4), lang)), [lang]);
  const cities = useQuery({ queryKey: ["cities", q], queryFn: () => athleteService.searchCities(q), enabled: sheet === "city" });

  const dobOk = !!draft.dob && isAdult(draft.dob);
  const valid = uState === "ok" && dobOk && !!draft.gender && !!draft.nationality && !!draft.cityId;

  async function next() {
    if (!valid || saving) return;
    setSaving(true); setErr(null);
    try {
      await athleteService.savePersonal({ username, dob: draft.dob!, gender: draft.gender!, nationality: draft.nationality!, cityId: draft.cityId! });
      await goTo(2);
    } catch (e) {
      const c = errorCode(e);
      if (c === "username_taken") setUState("taken");
      else setErr(c === "underage" ? t.ob.p.dobErr : c === "username_locked" ? t.ob.p.errLocked : t.common.networkError);
    } finally { setSaving(false); }
  }

  const uStatus = { idle: null, checking: <span className="flex items-center gap-1 text-xs text-muted-foreground"><Loader2 className="size-3 animate-spin" />{t.ob.p.checking}</span>,
    ok: <span className="flex items-center gap-1 text-xs font-medium text-success"><Check className="size-3" />{t.ob.p.available}</span>,
    taken: <span className="flex items-center gap-1 text-xs font-medium text-destructive"><X className="size-3" />{t.ob.p.taken}</span>,
    invalid: <span className="text-xs font-medium text-destructive">{t.ob.p.invalidUser}</span> }[uState];

  return (
    <>
      <Body>
        <Title>{t.ob.p.title}</Title>
        <div className="space-y-3">
          <Field id="username" label={t.ob.p.username} status={uStatus} hint={t.ob.p.usernameHint}>
            <TextInput id="username" autoCapitalize="none" autoCorrect="off" spellCheck={false} maxLength={20} disabled={locked}
              value={username} ok={uState === "ok"} invalid={uState === "taken" || uState === "invalid"}
              onChange={(e) => setDraft({ username: e.target.value.toLowerCase().replace(/\s/g, "") })} />
          </Field>
          <Field id="dob" label={t.ob.p.dob} error={dobTouched && draft.dob && !dobOk ? t.ob.p.dobErr : null}>
            <TextInput id="dob" type="date" max={maxDob()} min="1900-01-01" value={draft.dob ?? ""} invalid={dobTouched && !!draft.dob && !dobOk}
              onChange={(e) => setDraft({ dob: e.target.value })} onBlur={() => setDobTouched(true)} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field id="gender" label={t.ob.p.gender}>
              <SelectButton id="gender" placeholder={t.ob.p.choose} value={draft.gender ? t.ob.p.genders[draft.gender as keyof typeof t.ob.p.genders] : undefined} onClick={() => setSheet("gender")} />
            </Field>
            <Field id="nat" label={t.ob.p.nationality}>
              <SelectButton id="nat" placeholder={t.ob.p.choose} value={draft.nationality ? `${flag(draft.nationality)}  ${countryName(draft.nationality, lang)}` : undefined} onClick={() => { setQ(""); setSheet("country"); }} />
            </Field>
          </div>
          <Field id="city" label={t.ob.p.city} hint={t.ob.p.cityHint}>
            <SelectButton id="city" placeholder={t.ob.p.choose} value={draft.cityLabel} onClick={() => { setQ(""); setSheet("city"); }} />
          </Field>
          {err && <Notice tone="error">{err}</Notice>}
        </div>
      </Body>
      <BottomBar><PrimaryButton onClick={next} disabled={!valid} loading={saving}>{t.common.continue}</PrimaryButton></BottomBar>

      <Sheet open={sheet === "gender"} onOpenChange={(o) => !o && setSheet(null)} title={t.ob.p.gender}>
        <OptionList options={GENDERS.map((g) => ({ value: g, label: t.ob.p.genders[g] }))} value={draft.gender as never} onSelect={(v) => { setDraft({ gender: v }); setSheet(null); }} />
      </Sheet>
      <Sheet open={sheet === "country"} onOpenChange={(o) => !o && setSheet(null)} title={t.ob.p.nationality}>
        <SearchBox value={q} onChange={setQ} placeholder={t.ob.p.searchCountry} />
        <OptionList options={countries.filter((c) => c.label.toLowerCase().includes(q.toLowerCase()))} value={draft.nationality} onSelect={(v) => { setDraft({ nationality: v }); setSheet(null); }} />
      </Sheet>
      <Sheet open={sheet === "city"} onOpenChange={(o) => !o && setSheet(null)} title={t.ob.p.city}>
        <SearchBox value={q} onChange={setQ} placeholder={t.ob.p.searchCity} />
        {cities.isLoading ? <div className="flex justify-center py-8"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
          : cities.isError ? <div className="px-6"><Notice tone="error">{t.common.networkError}</Notice></div>
          : <OptionList options={(cities.data ?? []).map((c) => ({ value: c.id, label: c.name, sub: [c.region, countryName(c.country_code, lang)].filter(Boolean).join(" · ") }))}
              value={draft.cityId} onSelect={(v) => { const c = cities.data!.find((x) => x.id === v)!; setDraft({ cityId: v, cityLabel: `${c.name}${c.region ? `, ${c.region}` : ""}` }); setSheet(null); }} />}
      </Sheet>
    </>
  );
}
