import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { NotificationsScreen, type NotifPrefs } from "@/components/app/Settings";
import { athleteService } from "@/lib/app/athlete";

export const Route = createFileRoute("/_authenticated/app/notifications")({
  head: () => ({ meta: [{ title: "Notifiche — PEAQ" }, { name: "robots", content: "noindex" }] }),
  component: Page,
});

function Page() {
  const { user } = Route.useRouteContext();
  const qc = useQueryClient();
  const key = ["notifications", user.id];
  const q = useQuery({ queryKey: key, queryFn: () => athleteService.loadNotifications(user.id) });
  const [error, setError] = useState(false);

  // The switch moves at once; if saving fails it goes back and a message appears.
  async function change(next: NotifPrefs) {
    const before = q.data;
    qc.setQueryData(key, next); setError(false);
    try { await athleteService.saveNotifications(user.id, next); } catch { qc.setQueryData(key, before); setError(true); }
  }
  if (q.isLoading) return <div className="flex flex-1 items-center justify-center"><Loader2 className="size-8 animate-spin text-muted-foreground" /></div>;
  return <NotificationsScreen prefs={q.data ?? { new_events: false, lobby_opening: false, results: false }} error={error || q.isError} onChange={change} />;
}
