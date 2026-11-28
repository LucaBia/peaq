import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { AthleteScreen } from "@/components/app/Athletes";
import { Notice, PrimaryButton } from "@/components/app/ui";
import { useAppLang } from "@/lib/app/i18n";
import { SOCIAL_OPEN, socialService } from "@/lib/app/social";

// "athletes_" keeps this page a sibling of the athletes list instead of nesting it inside the list.
export const Route = createFileRoute("/_authenticated/app/athletes_/$userId")({
  beforeLoad: () => { if (!SOCIAL_OPEN) throw redirect({ to: "/app" }); },
  head: () => ({ meta: [{ title: "Atleta — PEAQ" }, { name: "robots", content: "noindex" }] }),
  component: Page,
});

function Page() {
  const { userId } = Route.useParams();
  const { user } = Route.useRouteContext();
  const { t } = useAppLang();
  const qc = useQueryClient();
  const athlete = useQuery({ queryKey: ["social", "athlete", userId], queryFn: () => socialService.athlete(userId) });
  const toggle = useMutation({
    mutationFn: () => (athlete.data?.following ? socialService.unfollow(userId) : socialService.follow(userId)),
    onSettled: () => qc.invalidateQueries({ queryKey: ["social"] }),
  });

  if (athlete.isLoading) return <div className="flex flex-1 items-center justify-center"><Loader2 className="size-8 animate-spin text-muted-foreground" /></div>;
  if (!athlete.data) return (
    <div className="space-y-4 p-6 pt-10">
      <Notice tone={athlete.isError ? "error" : "muted"}>{athlete.isError ? t.common.networkError : t.soc.notFound}</Notice>
      <Link to="/app"><PrimaryButton tabIndex={-1}>{t.common.back}</PrimaryButton></Link>
    </div>
  );
  return <AthleteScreen athlete={athlete.data} isMe={userId === user.id} busy={toggle.isPending} error={toggle.isError} onToggle={() => toggle.mutate()}
    onReport={() => socialService.report(userId)} onBlock={() => socialService.block(userId).then(() => { qc.invalidateQueries({ queryKey: ["social"] }); })} />;
}
