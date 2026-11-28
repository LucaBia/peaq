import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { SettingsScreen } from "@/components/app/Settings";
import { currentUserIsAdmin } from "@/lib/admin/api";
import { athleteService } from "@/lib/app/athlete";
import { authService } from "@/lib/app/auth";

export const Route = createFileRoute("/_authenticated/app/settings")({
  head: () => ({ meta: [{ title: "Impostazioni — PEAQ" }, { name: "robots", content: "noindex" }] }),
  component: Page,
});

function Page() {
  const { user } = Route.useRouteContext();
  const nav = useNavigate();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["athlete", user.id], queryFn: () => athleteService.loadAll(user.id) });
  const isAdmin = useQuery({ queryKey: ["is-admin", user.id], queryFn: () => currentUserIsAdmin() });

  async function logout() {
    await qc.cancelQueries(); qc.clear(); await authService.signOut(); nav({ to: "/welcome", replace: true });
  }
  if (q.isLoading) return <div className="flex flex-1 items-center justify-center"><Loader2 className="size-8 animate-spin text-muted-foreground" /></div>;
  const p = q.data?.profile;
  return <SettingsScreen bib={p?.bib_number ?? null} username={p?.username ?? ""} discipline={(p?.discipline as "run" | null) ?? null}
    documents={q.data?.documents ?? []} email={user.email ?? null} isAdmin={!!isAdmin.data} onLogout={logout}
    onPasswordReset={user.email ? () => authService.requestReset(user.email!) : undefined} />;
}
