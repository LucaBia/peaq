import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { EventsList } from "@/components/app/Events";
import { eventsService, pilotEvent } from "@/lib/app/events";
import { useAppLang } from "@/lib/app/i18n";

export const Route = createFileRoute("/_authenticated/app/events")({
  head: () => ({ meta: [
    { title: "Eventi — PEAQ" }, { name: "description", content: "Le gare PEAQ in programma." },
    { property: "og:title", content: "Eventi — PEAQ" }, { property: "og:description", content: "Le gare PEAQ in programma." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" },
  ] }),
  component: Page,
});

function Page() {
  const { t } = useAppLang();
  const published = useQuery({ queryKey: ["events", "published"], queryFn: eventsService.listPublished });
  // The pilot race comes from code (no date yet); anything published from the admin panel follows it.
  return <EventsList events={[pilotEvent(t), ...(published.data ?? [])]} loading={published.isLoading} />;
}
