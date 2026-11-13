import { createFileRoute } from "@tanstack/react-router";
import { Calendar as Icon } from "lucide-react";
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
  return (
    <main className="pt-safe flex flex-1 flex-col px-6 animate-in fade-in duration-300">
      <h1 className="pt-4 text-[2rem] font-bold tracking-tight">{t.app.eventsTitle}</h1>
      <div className="flex flex-1 flex-col items-center justify-center pb-16 text-center">
        <div className="flex size-20 items-center justify-center rounded-3xl bg-muted"><Icon className="size-9" aria-hidden /></div>
        <span className="mt-6 rounded-full border px-3 py-1 text-xs font-semibold">{t.common.comingSoon}</span>
        <p className="mt-4 max-w-72 text-muted-foreground">{t.app.eventsEmpty}</p>
      </div>
    </main>
  );
}
