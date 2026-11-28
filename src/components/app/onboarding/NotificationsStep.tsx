import { useState } from "react";
import { Body, BottomBar, Notice, PrimaryButton, Title } from "../ui";
import { useAppLang } from "@/lib/app/i18n";
import { athleteService } from "@/lib/app/athlete";
import { useOb } from "./context";

const ALL = { new_events: true, lobby_opening: true, results: true };
const NONE = { new_events: false, lobby_opening: false, results: false };

/** One choice, as in Figma A13: all three notifications on, or none for now. */
export function NotificationsStep() {
  const { t } = useAppLang();
  const { userId, goTo } = useOb();
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(false);
  async function save(prefs: typeof ALL) {
    setSaving(true); setErr(false);
    try { await athleteService.saveNotifications(userId, prefs); await goTo(9); } catch { setErr(true); } finally { setSaving(false); }
  }
  return (
    <>
      <Body>
        <Title bars>{t.ob.notif.title}</Title>
        <p className="text-lg">{t.ob.notif.sub}</p>
        <ul className="mt-2 space-y-1.5 text-lg">
          {t.ob.notif.items.map((x) => <li key={x} className="flex gap-3"><span className="mt-3 size-1.5 shrink-0 rounded-full bg-foreground" aria-hidden />{x}</li>)}
        </ul>
        <p className="mt-6 text-sm text-muted-foreground">{t.ob.notif.note}</p>
        {err && <div className="mt-6"><Notice tone="error">{t.common.networkError}</Notice></div>}
      </Body>
      <BottomBar>
        <PrimaryButton onClick={() => save(ALL)} loading={saving}>{t.ob.notif.save}</PrimaryButton>
        <PrimaryButton variant="ghost" disabled={saving} onClick={() => save(NONE)}>{t.ob.notif.notNow}</PrimaryButton>
      </BottomBar>
    </>
  );
}
