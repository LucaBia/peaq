import type { ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Calendar, FileCheck, LogOut, Shield, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppLang } from "@/lib/app/i18n";
import { LangSwitch } from "@/components/app/ui";
import { authService } from "@/lib/app/auth";

/** Wide desktop shell for the admin area (light `theme-app` palette). */
export function AdminFrame({ children }: { children: ReactNode }) {
  const { t } = useAppLang();
  const navigate = useNavigate();
  const items = [
    { to: "/admin/users", label: t.admin.nav.users, Icon: Users },
    { to: "/admin/events", label: t.admin.nav.events, Icon: Calendar },
    { to: "/admin/admins", label: t.admin.nav.admins, Icon: Shield },
    { to: "/admin/documents", label: t.admin.nav.documents, Icon: FileCheck },
  ] as const;
  const linkCls =
    "flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted data-[status=active]:bg-muted data-[status=active]:text-foreground";
  async function logout() {
    await authService.signOut();
    navigate({ to: "/auth" });
  }
  return (
    <div className="theme-app min-h-dvh bg-secondary text-foreground">
      <div className="mx-auto flex min-h-dvh max-w-[1200px] flex-col md:flex-row">
        <aside className="flex flex-col gap-1 border-b bg-background p-4 md:w-60 md:shrink-0 md:border-b-0 md:border-r">
          <div className="mb-4 flex items-center justify-between gap-2 px-2">
            <span className="text-lg font-bold tracking-tight">
              PEAQ <span className="text-muted-foreground">Admin</span>
            </span>
            <LangSwitch />
          </div>
          <nav aria-label="Admin" className="flex gap-1 overflow-x-auto md:flex-col">
            {items.map(({ to, label, Icon }) => (
              <Link key={to} to={to} className={linkCls}>
                <Icon className="size-5 shrink-0" aria-hidden />
                <span className="whitespace-nowrap">{label}</span>
              </Link>
            ))}
          </nav>
          <div className="mt-6 flex flex-col gap-1 border-t pt-4 md:mt-auto md:border-t-0">
            <Link to="/app" className={linkCls}>
              <ArrowLeft className="size-5 shrink-0" aria-hidden />
              <span className="whitespace-nowrap">{t.admin.backToApp}</span>
            </Link>
            <button type="button" onClick={logout} className={cn(linkCls, "text-left")}>
              <LogOut className="size-5 shrink-0" aria-hidden />
              <span className="whitespace-nowrap">{t.auth.logout}</span>
            </button>
          </div>
        </aside>
        <main className="flex-1 overflow-x-hidden px-4 py-6 md:px-8">{children}</main>
      </div>
    </div>
  );
}

export function PageHead({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {sub && <p className="mt-1 text-sm text-muted-foreground">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

/** Card container; wraps tables so they scroll horizontally on small screens. */
export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("overflow-x-auto rounded-2xl border bg-background", className)}>{children}</div>;
}

export const headCls = "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground";
export const cellCls = "px-4 py-3 align-middle text-sm";

type Tone = "neutral" | "success" | "warning" | "danger";
export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        tone === "neutral" && "bg-muted text-muted-foreground",
        tone === "success" && "bg-success/12 text-success",
        tone === "warning" && "bg-amber-500/15 text-amber-700",
        tone === "danger" && "bg-destructive/12 text-destructive",
      )}
    >
      {children}
    </span>
  );
}

export function EmptyState({ icon, children }: { icon?: ReactNode; children: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center text-muted-foreground">
      {icon}
      <p className="max-w-sm text-sm">{children}</p>
    </div>
  );
}

export function AdminSearch({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={placeholder}
      className="h-11 w-full max-w-xs rounded-xl border bg-background px-4 text-sm outline-none focus:border-foreground"
    />
  );
}

export function Spinner() {
  return <div className="flex items-center justify-center py-16 text-sm text-muted-foreground">…</div>;
}
