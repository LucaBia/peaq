import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { EventDetail, type PilotRsvp } from "@/components/app/Events";
import { Notice, PrimaryButton } from "@/components/app/ui";
import { athleteService } from "@/lib/app/athlete";
import { eventsService, PILOT_CONFIRM_OPEN, PILOT_EVENT_ID, pilotEvent, pilotService, type PilotStart } from "@/lib/app/events";
import { useAppLang } from "@/lib/app/i18n";

// "events_" keeps this page a sibling of the Events list (same tab bar) instead of nesting it inside the list.
export const Route = createFileRoute("/_authenticated/app/events_/$eventId")({
  head: () => ({ meta: [
    { title: "Gara — PEAQ" }, { name: "description", content: "Dettaglio della gara PEAQ." },
    { property: "og:title", content: "Gara — PEAQ" }, { property: "og:description", content: "Dettaglio della gara PEAQ." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" },
  ] }),
  component: Page,
});

function Page() {
  const { eventId } = Route.useParams();
  const { user } = Route.useRouteContext();
  const { t } = useAppLang();
  const isPilot = eventId === PILOT_EVENT_ID;
  const athlete = useQuery({ queryKey: ["athlete", user.id], queryFn: () => athleteService.loadAll(user.id) });
  const fromDb = useQuery({ queryKey: ["events", "published", eventId], queryFn: () => eventsService.getPublished(eventId), enabled: !isPilot });
  const event = isPilot ? pilotEvent(t) : fromDb.data;

  // Pilot race confirmation: ready, but switched off until PILOT_CONFIRM_OPEN (see lib/app/events.ts).
  const qc = useQueryClient();
  const rsvpOn = isPilot && PILOT_CONFIRM_OPEN;
  const myStart = useQuery({ queryKey: ["pilot-start", user.id], queryFn: pilotService.myStart, enabled: rsvpOn });
  const save = useMutation({
    mutationFn: (start: PilotStart | null) => (start ? pilotService.confirm(start) : pilotService.cancel()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["pilot-start", user.id] }),
  });
  const rsvp: PilotRsvp | undefined = rsvpOn && myStart.isSuccess
    ? { name: athlete.data?.profile?.username ?? "", start: myStart.data, saving: save.isPending, error: save.isError, onConfirm: (s) => save.mutate(s), onCancel: () => save.mutate(null) }
    : undefined;

  if (!isPilot && fromDb.isLoading) return <div className="flex flex-1 items-center justify-center"><Loader2 className="size-8 animate-spin text-muted-foreground" /></div>;
  if (!event) return (
    <div className="space-y-4 p-6 pt-10">
      <Notice tone={fromDb.isError ? "error" : "muted"}>{fromDb.isError ? t.common.networkError : t.ev.notFound}</Notice>
      <Link to="/app/events"><PrimaryButton tabIndex={-1}>{t.ev.backToEvents}</PrimaryButton></Link>
    </div>
  );
  return <EventDetail event={event} bib={athlete.data?.profile?.bib_number} rsvp={rsvp} />;
}
