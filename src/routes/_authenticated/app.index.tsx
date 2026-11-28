import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, LogOut, Shield } from "lucide-react";
import { ProfileScreen } from "@/components/app/Profile";
import { LangSwitch, Notice, PrimaryButton } from "@/components/app/ui";
import { athleteService } from "@/lib/app/athlete";
import { currentUserIsAdmin } from "@/lib/admin/api";
import { authService } from "@/lib/app/auth";
import { pilotEvent } from "@/lib/app/events";
import { useAppLang } from "@/lib/app/i18n";

export const Route = createFileRoute("/_authenticated/app/")({
  head: () => ({ meta: [
    { title: "Il tuo profilo — PEAQ" }, { name: "description", content: "Il tuo pettorale, rating e progressione su PEAQ." },
    { property: "og:title", content: "Il tuo profilo — PEAQ" }, { property: "og:description", content: "Il tuo pettorale, rating e progressione su PEAQ." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" },
  ] }),
  component: Profile,
});

function Profile() {
  const { user } = Route.useRouteContext();
  const { t } = useAppLang();
  const nav = useNavigate();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["athlete", user.id], queryFn: () => athleteService.loadAll(user.id) });
  const isAdmin = useQuery({ queryKey: ["is-admin", user.id], queryFn: () => currentUserIsAdmin() });

  async function logout() {
    await qc.cancelQueries(); qc.clear(); await authService.signOut(); nav({ to: "/auth", replace: true });
  }
  if (q.isLoading) return <div className="flex flex-1 items-center justify-center"><Loader2 className="size-8 animate-spin text-muted-foreground" /></div>;
  if (q.isError || !q.data?.profile) return <div className="space-y-4 p-6"><Notice tone="error">{t.common.networkError}</Notice><PrimaryButton onClick={() => q.refetch()}>{t.common.retry}</PrimaryButton></div>;

  const { profile: p, ratings, progression } = q.data;
  const icon = "flex size-11 items-center justify-center rounded-full hover:bg-black/10 focus-visible:outline-2 focus-visible:outline-current";
  return (
    <ProfileScreen bib={p.bib_number} username={p.username ?? ""} ratings={ratings} level={progression?.level ?? 1} xp={progression?.xp ?? 0}
      racesDone={progression?.events_completed ?? 0} upcoming={[pilotEvent(t)]}
      actions={<>
        <span className="rounded-full bg-background text-foreground"><LangSwitch /></span>
        {isAdmin.data && <Link to="/admin" aria-label="Admin" className={icon}><Shield className="size-5" /></Link>}
        <button type="button" onClick={logout} aria-label={t.auth.logout} className={icon}><LogOut className="size-5" /></button>
      </>} />
  );
}
