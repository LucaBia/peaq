import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Body, BottomBar, Notice, PrimaryButton, Title } from "../ui";
import { useAppLang } from "@/lib/app/i18n";
import { athleteService } from "@/lib/app/athlete";
import { useOb } from "./context";

export function NotificationsStep() {
  const { t } = useAppLang();
  const { userId, goTo } = useOb();
  const [p, setP] = useState({ new_events: true, lobby_opening: true, results: true });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(false);
  async function save(prefs: typeof p) {
    setSaving(true); setErr(false);
    try { await athleteService.saveNotifications(userId, prefs); await goTo(9); } catch { setErr(true); } finally { setSaving(false); }
  }
  const rows = [["new_events", t.ob.notif.newEvents], ["lobby_opening", t.ob.notif.lobby], ["results", t.ob.notif.results]] as const;
  return (
    <>
      <Body>
        <Title sub={t.ob.notif.sub}>{t.ob.notif.title}</Title>
        <div className="divide-y rounded-3xl border">
          {rows.map(([k, l]) => (
            <label key={k} htmlFor={k} className="flex min-h-16 items-center justify-between gap-4 px-5">
              <span className="font-medium">{l}</span>
              <Switch id={k} checked={p[k]} onCheckedChange={(v) => setP({ ...p, [k]: v })} />
            </label>
          ))}
        </div>
        {err && <div className="mt-6"><Notice tone="error">{t.common.networkError}</Notice></div>}
      </Body>
      <BottomBar>
        <PrimaryButton onClick={() => save(p)} loading={saving}>{t.ob.notif.save}</PrimaryButton>
        <PrimaryButton variant="ghost" disabled={saving} onClick={() => save({ new_events: false, lobby_opening: false, results: false })}>{t.ob.notif.notNow}</PrimaryButton>
      </BottomBar>
    </>
  );
}
