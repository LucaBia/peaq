import { createFileRoute, Link, Outlet, redirect, useLocation } from "@tanstack/react-router";
import { Calendar, Trophy, User } from "lucide-react";
import { AppFrame } from "@/components/app/ui";
import { useAppLang } from "@/lib/app/i18n";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/app")({
  beforeLoad: async ({ context }) => {
    const { data } = await supabase.from("athlete_profiles").select("onboarding_completed_at").eq("user_id", context.user.id).maybeSingle();
    if (!data?.onboarding_completed_at) throw redirect({ to: "/onboarding" });
  },
  component: AppLayout,
});

function AppLayout() {
  const { t } = useAppLang();
  const tabs = [{ to: "/app", label: t.app.tabs.profile, Icon: User }, { to: "/app/events", label: t.app.tabs.events, Icon: Calendar }, { to: "/app/rankings", label: t.app.tabs.rankings, Icon: Trophy }] as const;
  // Pages opened from the Profile (settings, guides, athletes…) keep the Profile tab lit, as in Figma.
  const path = useLocation({ select: (l) => l.pathname });
  const current = path.startsWith("/app/events") ? "/app/events" : path.startsWith("/app/rankings") ? "/app/rankings" : "/app";
  return (
    <AppFrame>
      <div className="flex flex-1 flex-col"><Outlet /></div>
      <nav aria-label="PEAQ" className="pb-safe sticky bottom-0 z-30 grid grid-cols-3 border-t bg-background/95 pt-2 backdrop-blur">
        {tabs.map(({ to, label, Icon }) => (
          <Link key={to} to={to} activeOptions={{ exact: true }} className={cn("flex min-h-12 flex-col items-center justify-center gap-1 text-[0.7rem] font-medium", to === current ? "text-foreground" : "text-muted-foreground")}>
            <Icon className="size-6" aria-hidden />{label}
          </Link>
        ))}
      </nav>
    </AppFrame>
  );
}
