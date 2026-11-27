import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FileCheck } from "lucide-react";
import { adminService } from "@/lib/admin/api";
import { useAppLang } from "@/lib/app/i18n";
import { cn } from "@/lib/utils";
import { Badge, cellCls, EmptyState, headCls, PageHead, Panel, Spinner } from "@/components/admin/ui";
import { Notice } from "@/components/app/ui";

export const Route = createFileRoute("/_authenticated/admin/documents")({ component: DocsPage });

const FILTERS = [null, "pending", "approved", "rejected"] as const;

function DocsPage() {
  const { t } = useAppLang();
  const td = t.admin.documents;
  const qc = useQueryClient();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("pending");
  const docs = useQuery({ queryKey: ["admin", "documents", filter], queryFn: () => adminService.listDocuments(filter ?? undefined) });

  const review = useMutation({
    mutationFn: ({ id, status }: { id: string; status: "approved" | "rejected" }) => adminService.reviewDocument(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "documents"] }),
  });

  async function openFile(path: string | null) {
    if (!path) return;
    try {
      const url = await adminService.documentUrl(path);
      window.open(url, "_blank", "noopener");
    } catch {
      /* ignore — the row still shows status */
    }
  }

  const typeLabel = (x: string) => (x === "medical_certificate" ? td.tMedical : td.tMembership);
  const statusBadge = (s: string) =>
    s === "approved" ? <Badge tone="success">{td.stApproved}</Badge>
    : s === "rejected" ? <Badge tone="danger">{td.stRejected}</Badge>
    : s === "expired" ? <Badge tone="danger">{td.stExpired}</Badge>
    : <Badge tone="warning">{td.stPending}</Badge>;
  const filterLabel = (f: (typeof FILTERS)[number]) => (f === null ? td.all : f === "pending" ? td.pending : f === "approved" ? td.approved : td.rejected);
  const list = docs.data ?? [];

  return (
    <>
      <PageHead title={td.title} sub={td.sub} />
      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button key={String(f)} onClick={() => setFilter(f)} aria-pressed={filter === f}
            className={cn("rounded-full border px-3 py-1.5 text-sm font-medium", filter === f ? "border-foreground bg-foreground text-background" : "text-muted-foreground hover:border-foreground")}>
            {filterLabel(f)}
          </button>
        ))}
      </div>
      {docs.isError ? (
        <Notice tone="error">{t.admin.loadError}</Notice>
      ) : docs.isLoading ? (
        <Spinner />
      ) : list.length === 0 ? (
        <Panel>
          <EmptyState icon={<FileCheck className="size-8" />}>{td.empty}</EmptyState>
        </Panel>
      ) : (
        <Panel>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className={headCls}>{td.user}</th>
                <th className={headCls}>{td.type}</th>
                <th className={headCls}>{td.org}</th>
                <th className={headCls}>{td.status}</th>
                <th className={`${headCls} text-right`}>{td.actions}</th>
              </tr>
            </thead>
            <tbody>
              {list.map((d) => (
                <tr key={d.id} className="border-b last:border-0">
                  <td className={`${cellCls} font-medium`}>
                    {d.username ? `@${d.username}` : d.email}
                    <span className="block text-xs font-normal text-muted-foreground">{d.email}</span>
                  </td>
                  <td className={cellCls}>
                    {typeLabel(d.doc_type)}
                    {d.card_number && <span className="block text-xs text-muted-foreground">{d.card_number}</span>}
                  </td>
                  <td className={cellCls}>{d.organization ?? "—"}</td>
                  <td className={cellCls}>{statusBadge(d.status)}</td>
                  <td className={cellCls}>
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openFile(d.storage_path)} disabled={!d.storage_path} className="rounded-lg px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted disabled:opacity-40">
                        {d.storage_path ? td.view : td.noFile}
                      </button>
                      {d.status !== "approved" && (
                        <button onClick={() => review.mutate({ id: d.id, status: "approved" })} className="rounded-lg px-2 py-1 text-xs font-medium text-success hover:bg-muted">{td.approve}</button>
                      )}
                      {d.status !== "rejected" && (
                        <button onClick={() => review.mutate({ id: d.id, status: "rejected" })} className="rounded-lg px-2 py-1 text-xs font-medium text-destructive hover:bg-muted">{td.reject}</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}
    </>
  );
}
