import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Shield, UserPlus, X } from "lucide-react";
import { adminService } from "@/lib/admin/api";
import { useAppLang } from "@/lib/app/i18n";
import { Badge, cellCls, EmptyState, headCls, PageHead, Panel, Spinner } from "@/components/admin/ui";
import { Notice, OptionList, SearchBox, Sheet } from "@/components/app/ui";

export const Route = createFileRoute("/_authenticated/admin/admins")({ component: AdminsPage });

function AdminsPage() {
  const { t } = useAppLang();
  const ta = t.admin.admins;
  const qc = useQueryClient();
  const admins = useQuery({ queryKey: ["admin", "admins"], queryFn: () => adminService.listAdmins() });
  const [picking, setPicking] = useState(false);
  const [q, setQ] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const athletes = useQuery({ queryKey: ["admin", "athletes"], queryFn: () => adminService.listAthletes(), enabled: picking });

  const grant = useMutation({
    mutationFn: (userId: string) => adminService.setAdmin(userId, true),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin", "admins"] }); setPicking(false); setQ(""); },
    onError: () => setErr(t.admin.loadError),
  });
  const revoke = useMutation({
    mutationFn: (userId: string) => adminService.setAdmin(userId, false),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "admins"] }),
    onError: (e) => {
      const m = (e as { message?: string })?.message ?? "";
      setErr(m.includes("last_admin") ? ta.lastAdmin : t.admin.loadError);
    },
  });

  const adminIds = useMemo(() => new Set((admins.data ?? []).map((a) => a.user_id)), [admins.data]);
  const options = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (athletes.data ?? [])
      .filter((a) => !adminIds.has(a.user_id))
      .filter((a) => !s || (a.username ?? "").toLowerCase().includes(s) || (a.email ?? "").toLowerCase().includes(s))
      .slice(0, 40)
      .map((a) => ({ value: a.user_id, label: a.username ? `@${a.username}` : ta.noUsername, sub: a.email }));
  }, [athletes.data, q, adminIds, ta.noUsername]);

  return (
    <>
      <PageHead
        title={ta.title}
        sub={ta.sub}
        action={
          <button onClick={() => { setErr(null); setPicking(true); }} className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground">
            <UserPlus className="size-4" />
            {ta.add}
          </button>
        }
      />
      {err && <div className="mb-4"><Notice tone="error">{err}</Notice></div>}
      {admins.isError ? (
        <Notice tone="error">{t.admin.loadError}</Notice>
      ) : admins.isLoading ? (
        <Spinner />
      ) : (admins.data ?? []).length === 0 ? (
        <Panel>
          <EmptyState icon={<Shield className="size-8" />}>{ta.empty}</EmptyState>
        </Panel>
      ) : (
        <Panel>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className={headCls}>{ta.user}</th>
                <th className={headCls}>{ta.email}</th>
                <th className={`${headCls} text-right`}>{ta.actions}</th>
              </tr>
            </thead>
            <tbody>
              {(admins.data ?? []).map((a) => (
                <tr key={a.user_id} className="border-b last:border-0">
                  <td className={`${cellCls} font-medium`}>
                    {a.username ? `@${a.username}` : ta.noUsername} <Badge tone="success">admin</Badge>
                  </td>
                  <td className={cellCls}>{a.email}</td>
                  <td className={cellCls}>
                    <div className="flex justify-end">
                      <button onClick={() => { setErr(null); if (confirm(ta.removeConfirm)) revoke.mutate(a.user_id); }} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-destructive hover:bg-muted">
                        <X className="size-4" />
                        {ta.remove}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}

      <Sheet open={picking} onOpenChange={setPicking} title={ta.pickTitle}>
        <SearchBox value={q} onChange={setQ} placeholder={ta.pickSearch} />
        <OptionList options={options} onSelect={(id) => grant.mutate(id)} />
      </Sheet>
    </>
  );
}
