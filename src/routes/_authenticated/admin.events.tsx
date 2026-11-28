import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Calendar, Pencil, Plus, Trash2 } from "lucide-react";
import { adminService, type EventRow } from "@/lib/admin/api";
import { useAppLang } from "@/lib/app/i18n";
import { cn } from "@/lib/utils";
import { Badge, cellCls, EmptyState, headCls, PageHead, Panel, Spinner } from "@/components/admin/ui";
import { Field, Notice, PrimaryButton, Sheet, TextInput, inputCls } from "@/components/app/ui";

export const Route = createFileRoute("/_authenticated/admin/events")({ component: EventsPage });

type Disc = "run" | "bike" | "both";
type Status = "draft" | "published" | "cancelled";
type Draft = { id?: string; title: string; description: string; discipline: Disc; starts_at: string; location: string; capacity: string; status: Status };

const emptyDraft = (): Draft => ({ title: "", description: "", discipline: "run", starts_at: "", location: "", capacity: "", status: "draft" });

function toLocalInput(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function fromRow(e: EventRow): Draft {
  return {
    id: e.id,
    title: e.title,
    description: e.description ?? "",
    discipline: e.discipline as Disc,
    starts_at: toLocalInput(e.starts_at),
    location: e.location ?? "",
    capacity: e.capacity != null ? String(e.capacity) : "",
    status: e.status as Status,
  };
}

function EventsPage() {
  const { t } = useAppLang();
  const te = t.admin.events;
  const qc = useQueryClient();
  const events = useQuery({ queryKey: ["admin", "events"], queryFn: () => adminService.listEvents() });
  const [draft, setDraft] = useState<Draft | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin", "events"] });

  const save = useMutation({
    mutationFn: async (d: Draft) => {
      const payload = {
        title: d.title.trim(),
        description: d.description.trim() || null,
        discipline: d.discipline,
        starts_at: new Date(d.starts_at).toISOString(),
        location: d.location.trim() || null,
        capacity: d.capacity.trim() ? Number(d.capacity) : null,
        status: d.status,
      };
      if (d.id) await adminService.updateEvent(d.id, payload);
      else await adminService.createEvent(payload);
    },
    onSuccess: () => { invalidate(); setDraft(null); },
  });
  const del = useMutation({ mutationFn: (id: string) => adminService.deleteEvent(id), onSuccess: invalidate });
  const setStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Status }) => adminService.setEventStatus(id, status),
    onSuccess: invalidate,
  });

  function submit() {
    if (!draft) return;
    if (draft.title.trim().length < 3) return setErr(te.errTitle);
    if (!draft.starts_at) return setErr(te.errDate);
    setErr(null);
    save.mutate(draft);
  }

  const badge = (s: string) =>
    s === "published" ? <Badge tone="success">{te.stPublished}</Badge> : s === "cancelled" ? <Badge tone="danger">{te.stCancelled}</Badge> : <Badge>{te.stDraft}</Badge>;
  const list = events.data ?? [];

  return (
    <>
      <PageHead
        title={te.title}
        sub={te.sub}
        action={
          <button onClick={() => { setErr(null); setDraft(emptyDraft()); }} className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground">
            <Plus className="size-4" />
            {te.new}
          </button>
        }
      />
      {events.isError ? (
        <Notice tone="error">{t.admin.loadError}</Notice>
      ) : events.isLoading ? (
        <Spinner />
      ) : list.length === 0 ? (
        <Panel>
          <EmptyState icon={<Calendar className="size-8" />}>{te.empty}</EmptyState>
        </Panel>
      ) : (
        <Panel>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className={headCls}>{te.colTitle}</th>
                <th className={headCls}>{te.colDiscipline}</th>
                <th className={headCls}>{te.colDate}</th>
                <th className={headCls}>{te.colStatus}</th>
                <th className={`${headCls} text-right`}>{te.colActions}</th>
              </tr>
            </thead>
            <tbody>
              {list.map((e) => (
                <tr key={e.id} className="border-b last:border-0">
                  <td className={`${cellCls} font-medium`}>
                    {e.title}
                    {e.location && <span className="block text-xs font-normal text-muted-foreground">{e.location}</span>}
                  </td>
                  <td className={cellCls}>{t.disc[e.discipline as Disc]}</td>
                  <td className={`${cellCls} whitespace-nowrap`}>{new Date(e.starts_at).toLocaleString()}</td>
                  <td className={cellCls}>{badge(e.status)}</td>
                  <td className={cellCls}>
                    <div className="flex items-center justify-end gap-1">
                      {e.status === "published" ? (
                        <button onClick={() => setStatus.mutate({ id: e.id, status: "draft" })} className="rounded-lg px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted">{te.unpublish}</button>
                      ) : (
                        <button onClick={() => setStatus.mutate({ id: e.id, status: "published" })} className="rounded-lg px-2 py-1 text-xs font-medium text-success hover:bg-muted">{te.publish}</button>
                      )}
                      <button onClick={() => { setErr(null); setDraft(fromRow(e)); }} aria-label={te.edit} className="rounded-lg p-2 text-muted-foreground hover:bg-muted"><Pencil className="size-4" /></button>
                      <button onClick={() => { if (confirm(te.delConfirm)) del.mutate(e.id); }} aria-label={te.del} className="rounded-lg p-2 text-destructive hover:bg-muted"><Trash2 className="size-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}

      <Sheet open={!!draft} onOpenChange={(o) => { if (!o) setDraft(null); }} title={draft?.id ? te.edit : te.new}>
        {draft && (
          <div className="space-y-4 px-6 pb-6">
            {err && <Notice tone="error">{err}</Notice>}
            <Field id="ev-title" label={te.fTitle}>
              <TextInput id="ev-title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} maxLength={120} />
            </Field>
            <Field id="ev-desc" label={te.fDesc}>
              <textarea id="ev-desc" value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} maxLength={2000} rows={3} className={cn(inputCls(), "h-auto py-3")} />
            </Field>
            <Field id="ev-disc" label={te.fDiscipline}>
              <div className="flex gap-2">
                {(["run", "bike", "both"] as const).map((d) => (
                  <button key={d} type="button" onClick={() => setDraft({ ...draft, discipline: d })} aria-pressed={draft.discipline === d}
                    className={cn("flex-1 rounded-xl border px-3 py-3 text-sm font-medium", draft.discipline === d ? "border-primary bg-primary text-primary-foreground" : "hover:border-foreground")}>
                    {t.disc[d]}
                  </button>
                ))}
              </div>
            </Field>
            <Field id="ev-date" label={te.fDate}>
              <TextInput id="ev-date" type="datetime-local" value={draft.starts_at} onChange={(e) => setDraft({ ...draft, starts_at: e.target.value })} />
            </Field>
            <Field id="ev-loc" label={te.fLocation} hint={t.common.optional}>
              <TextInput id="ev-loc" value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} maxLength={160} />
            </Field>
            <Field id="ev-cap" label={te.fCapacity} hint={t.common.optional}>
              <TextInput id="ev-cap" type="number" min={1} value={draft.capacity} onChange={(e) => setDraft({ ...draft, capacity: e.target.value })} />
            </Field>
            <Field id="ev-status" label={te.fStatus}>
              <div className="flex gap-2">
                {(["draft", "published", "cancelled"] as const).map((s) => (
                  <button key={s} type="button" onClick={() => setDraft({ ...draft, status: s })} aria-pressed={draft.status === s}
                    className={cn("flex-1 rounded-xl border px-3 py-3 text-sm font-medium", draft.status === s ? "border-primary bg-primary text-primary-foreground" : "hover:border-foreground")}>
                    {s === "draft" ? te.stDraft : s === "published" ? te.stPublished : te.stCancelled}
                  </button>
                ))}
              </div>
            </Field>
            <PrimaryButton onClick={submit} loading={save.isPending}>{draft.id ? te.save : te.create}</PrimaryButton>
            {save.isError && <Notice tone="error">{t.admin.loadError}</Notice>}
          </div>
        )}
      </Sheet>
    </>
  );
}
