import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { adminService } from "@/lib/admin/api";
import { fmt, useAppLang } from "@/lib/app/i18n";
import { AdminSearch, Badge, cellCls, EmptyState, headCls, PageHead, Panel, Spinner } from "@/components/admin/ui";
import { Notice } from "@/components/app/ui";

export const Route = createFileRoute("/_authenticated/admin/users")({ component: UsersPage });

function UsersPage() {
  const { t } = useAppLang();
  const tu = t.admin.users;
  const [q, setQ] = useState("");
  const athletes = useQuery({ queryKey: ["admin", "athletes"], queryFn: () => adminService.listAthletes() });
  const cities = useQuery({
    queryKey: ["admin", "cities-map"],
    queryFn: async () => {
      const { data } = await supabase.from("cities").select("id,name");
      return new Map((data ?? []).map((c) => [c.id, c.name] as const));
    },
  });

  const rows = useMemo(() => {
    const list = athletes.data ?? [];
    const s = q.trim().toLowerCase();
    if (!s) return list;
    return list.filter((a) => (a.username ?? "").toLowerCase().includes(s) || (a.email ?? "").toLowerCase().includes(s));
  }, [athletes.data, q]);

  return (
    <>
      <PageHead
        title={tu.title}
        sub={fmt(tu.sub, { n: athletes.data?.length ?? 0 })}
        action={<AdminSearch value={q} onChange={setQ} placeholder={tu.search} />}
      />
      {athletes.isError ? (
        <Notice tone="error">{t.admin.loadError}</Notice>
      ) : athletes.isLoading ? (
        <Spinner />
      ) : rows.length === 0 ? (
        <Panel>
          <EmptyState icon={<Users className="size-8" />}>{tu.empty}</EmptyState>
        </Panel>
      ) : (
        <Panel>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className={headCls}>{tu.user}</th>
                <th className={headCls}>{tu.email}</th>
                <th className={headCls}>{tu.bib}</th>
                <th className={headCls}>{tu.discipline}</th>
                <th className={headCls}>{tu.city}</th>
                <th className={headCls}>{tu.onboarding}</th>
                <th className={headCls}>{tu.joined}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.user_id} className="border-b last:border-0">
                  <td className={`${cellCls} font-medium`}>{a.username ? `@${a.username}` : "—"}</td>
                  <td className={cellCls}>{a.email}</td>
                  <td className={`${cellCls} tabular-nums`}>{a.bib_number ?? "—"}</td>
                  <td className={cellCls}>{a.discipline ? t.disc[a.discipline as "run"] : "—"}</td>
                  <td className={cellCls}>{(a.city_id && cities.data?.get(a.city_id)) || "—"}</td>
                  <td className={cellCls}>
                    {a.onboarding_completed_at ? <Badge tone="success">{tu.done}</Badge> : <Badge>{tu.pending}</Badge>}
                  </td>
                  <td className={`${cellCls} whitespace-nowrap text-muted-foreground`}>{new Date(a.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}
    </>
  );
}
