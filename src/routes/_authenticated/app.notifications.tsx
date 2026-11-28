import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { NotificationsScreen, type NotifPrefs } from "@/components/app/Settings";
import { Notice, PrimaryButton } from "@/components/app/ui";
import { athleteService } from "@/lib/app/athlete";
import { useAppLang } from "@/lib/app/i18n";

export const Route = createFileRoute("/_authenticated/app/notifications")({
  head: () => ({ meta: [{ title: "Notifiche — PEAQ" }, { name: "robots", content: "noindex" }] }),
  component: Page,
});

function Page() {
  const { user } = Route.useRouteContext();
  const { t } = useAppLang();
  const qc = useQueryClient();
  const key = ["notifications", user.id];
  const q = useQuery({ queryKey: key, queryFn: () => athleteService.loadNotifications(user.id) });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  // The switch moves at once and the others wait until it is saved; if saving fails it goes back and a message appears.
  async function change(next: NotifPrefs) {
    const before = q.data;
    if (!before || saving) return;
    qc.setQueryData(key, next); setSaving(true); setError(false);
    try { await athleteService.saveNotifications(user.id, next); } catch { qc.setQueryData(key, before); setError(true); } finally { setSaving(false); }
  }
  if (q.isLoading) return <div className="flex flex-1 items-center justify-center"><Loader2 className="size-8 animate-spin text-muted-foreground" /></div>;
  // Without the saved choices there are no switches: one tap would overwrite them with guesses.
  if (!q.data) return <div className="flex flex-1 flex-col justify-center gap-4 p-6"><Notice tone="error">{t.common.networkError}</Notice><PrimaryButton onClick={() => q.refetch()}>{t.common.retry}</PrimaryButton></div>;
  return <NotificationsScreen prefs={q.data} error={error} saving={saving} onChange={change} />;
}
