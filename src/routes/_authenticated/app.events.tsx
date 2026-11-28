import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Calendar as Icon, Loader2, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAppLang } from "@/lib/app/i18n";

export const Route = createFileRoute("/_authenticated/app/events")({
  head: () => ({ meta: [
    { title: "Eventi — PEAQ" }, { name: "description", content: "Eventi PEAQ: in arrivo." },
    { property: "og:title", content: "Eventi — PEAQ" }, { property: "og:description", content: "Eventi PEAQ: in arrivo." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" },
  ] }),
  component: Page,
});

function Page() {
  const { t } = useAppLang();
  const events = useQuery({
    queryKey: ["events", "published"],
    queryFn: async () => {
      const { data, error } = await supabase.from("events").select("*").eq("status", "published").order("starts_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
  const list = events.data ?? [];

  return (
    <main className="pt-safe flex flex-1 flex-col px-6 animate-in fade-in duration-300">
      <h1 className="pt-4 text-[2rem] font-bold tracking-tight">{t.app.eventsTitle}</h1>
      {events.isLoading ? (
        <div className="flex flex-1 items-center justify-center"><Loader2 className="size-7 animate-spin text-muted-foreground" /></div>
      ) : list.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center pb-16 text-center">
          <div className="flex size-20 items-center justify-center rounded-3xl bg-muted"><Icon className="size-9" aria-hidden /></div>
          <span className="mt-6 rounded-full border px-3 py-1 text-xs font-semibold">{t.common.comingSoon}</span>
          <p className="mt-4 max-w-72 text-muted-foreground">{t.app.eventsEmpty}</p>
        </div>
      ) : (
        <ul className="mt-6 space-y-3 pb-8">
          {list.map((e) => (
            <li key={e.id} className="rounded-3xl border p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full border px-2.5 py-0.5 text-xs font-semibold">{t.disc[e.discipline as "run"]}</span>
                <time className="text-sm text-muted-foreground">{new Date(e.starts_at).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}</time>
              </div>
              <h2 className="mt-3 text-lg font-bold">{e.title}</h2>
              {e.location && <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin className="size-4" />{e.location}</p>}
              {e.description && <p className="mt-2 text-sm text-muted-foreground">{e.description}</p>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
