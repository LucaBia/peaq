import { forwardRef, useState, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Drawer } from "vaul";
import { Check, ChevronDown, ChevronLeft, Eye, EyeOff, Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppLang } from "@/lib/app/i18n";

/** Mobile-sized app frame. Centered card on desktop, fullscreen on phones. */
export function AppFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-secondary sm:flex sm:items-center sm:justify-center sm:py-8 theme-app">
      <div className="theme-app relative mx-auto flex min-h-dvh w-full max-w-[430px] flex-col bg-background sm:min-h-[min(860px,calc(100dvh-4rem))] sm:overflow-hidden sm:rounded-[2rem] sm:border sm:shadow-xl">
        {children}
      </div>
    </div>
  );
}

export function LangSwitch() {
  const { lang, setLang, t } = useAppLang();
  return (
    <div role="group" aria-label={t.common.language} className="flex rounded-full border p-0.5 text-xs font-medium">
      {(["it", "en"] as const).map((l) => (
        <button key={l} type="button" onClick={() => setLang(l)} aria-pressed={lang === l}
          className={cn("min-h-8 rounded-full px-3 uppercase transition-colors", lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground")}>{l}</button>
      ))}
    </div>
  );
}

export function TopBar({ onBack, backTo, right, children }: { onBack?: (() => void) | undefined; backTo?: string | undefined; right?: ReactNode; children?: ReactNode }) {
  const { t } = useAppLang();
  const cls = "-ml-2 flex size-11 items-center justify-center rounded-full hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring";
  return (
    <header className="pt-safe sticky top-0 z-20 bg-background/95 px-4 pb-2 backdrop-blur">
      <div className="flex h-11 items-center justify-between gap-3">
        <div className="w-11">
          {onBack ? <button type="button" onClick={onBack} aria-label={t.common.back} className={cls}><ChevronLeft className="size-6" /></button>
            : backTo ? <Link to={backTo} aria-label={t.common.back} className={cls}><ChevronLeft className="size-6" /></Link> : null}
        </div>
        <div className="flex-1">{children}</div>
        <div className="flex min-w-11 justify-end">{right}</div>
      </div>
    </header>
  );
}

export function Progress({ step, total }: { step: number; total: number }) {
  const { t } = useAppLang();
  return (
    <div role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={step} aria-label={t.ob.step.replace("{n}", String(step)).replace("{t}", String(total))} className="flex gap-1">
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={cn("h-1 flex-1 rounded-full transition-colors duration-300", i < step ? "bg-primary" : "bg-border")} />
      ))}
    </div>
  );
}

export function Title({ children, sub }: { children: ReactNode; sub?: ReactNode }) {
  return (
    <div className="mb-8">
      <h1 className="text-[2rem] font-bold leading-[1.05] tracking-tight">{children}</h1>
      {sub && <p className="mt-3 text-base text-muted-foreground">{sub}</p>}
    </div>
  );
}

export function Body({ children, className }: { children: ReactNode; className?: string }) {
  return <main className={cn("flex-1 px-6 pb-6 pt-4 animate-in fade-in slide-in-from-right-4 duration-300", className)}>{children}</main>;
}

/** Bottom action area that stays reachable above the keyboard. */
export function BottomBar({ children }: { children: ReactNode }) {
  return <div className="pb-safe sticky bottom-0 z-20 mt-auto space-y-3 border-t bg-background/95 px-6 pt-4 backdrop-blur">{children}</div>;
}

export const PrimaryButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean; variant?: "primary" | "ghost" | "outline" }>(
  ({ loading, disabled, children, className, variant = "primary", ...p }, ref) => (
    <button ref={ref} disabled={disabled || loading} aria-busy={loading}
      className={cn("flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-base font-semibold transition-all active:scale-[0.98] disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        variant === "primary" && "bg-primary text-primary-foreground disabled:bg-muted disabled:text-muted-foreground",
        variant === "outline" && "border bg-background disabled:opacity-50",
        variant === "ghost" && "h-12 text-muted-foreground hover:text-foreground disabled:opacity-50", className)} {...p}>
      {loading && <Loader2 className="size-5 animate-spin" />}{children}
    </button>
  ),
);
PrimaryButton.displayName = "PrimaryButton";

export function Field({ label, error, hint, status, children, id }: { label: string; error?: string | null; hint?: ReactNode; status?: ReactNode; children: ReactNode; id: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between"><label htmlFor={id} className="text-sm font-medium">{label}</label>{status}</div>
      {children}
      {error ? <p id={`${id}-err`} role="alert" className="text-sm text-destructive">{error}</p> : hint ? <p className="text-sm text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

export const inputCls = (invalid?: boolean, ok?: boolean) =>
  cn("h-14 w-full rounded-2xl border bg-background px-4 text-base outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground",
    invalid && "border-destructive focus:border-destructive", ok && "border-success focus:border-success");

export const TextInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean; ok?: boolean }>(
  ({ invalid, ok, className, ...p }, ref) => <input ref={ref} aria-invalid={invalid || undefined} aria-describedby={invalid ? `${p.id}-err` : undefined} className={cn(inputCls(invalid, ok), className)} {...p} />,
);
TextInput.displayName = "TextInput";

export function PasswordInput(p: InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  const [show, setShow] = useState(false);
  const { t } = useAppLang();
  return (
    <div className="relative">
      <TextInput {...p} type={show ? "text" : "password"} className="pr-14" />
      <button type="button" onClick={() => setShow(!show)} aria-label={show ? t.auth.hide : t.auth.show}
        className="absolute right-1 top-1 flex size-12 items-center justify-center rounded-xl text-muted-foreground hover:text-foreground">
        {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
      </button>
    </div>
  );
}

export function SelectButton({ id, value, placeholder, onClick, invalid }: { id: string; value?: ReactNode; placeholder: string; onClick: () => void; invalid?: boolean }) {
  return (
    <button id={id} type="button" onClick={onClick} className={cn(inputCls(invalid), "flex items-center justify-between text-left")}>
      <span className={cn("truncate", !value && "text-muted-foreground")}>{value || placeholder}</span>
      <ChevronDown className="size-5 shrink-0 text-muted-foreground" />
    </button>
  );
}

/** Native-style bottom sheet. */
export function Sheet({ open, onOpenChange, title, children }: { open: boolean; onOpenChange: (o: boolean) => void; title: string; children: ReactNode }) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} repositionInputs={false}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 bg-foreground/40" />
        <Drawer.Content className="theme-app fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[85dvh] max-w-[430px] flex-col rounded-t-[1.75rem] bg-background outline-none">
          <div className="mx-auto mt-3 h-1.5 w-10 rounded-full bg-border" />
          <Drawer.Title className="px-6 pb-2 pt-4 text-lg font-semibold">{title}</Drawer.Title>
          <Drawer.Description className="sr-only">{title}</Drawer.Description>
          <div className="pb-safe flex-1 overflow-y-auto">{children}</div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

export function OptionList<V extends string>({ options, value, onSelect }: { options: { value: V; label: ReactNode; sub?: ReactNode }[]; value?: V | null | undefined; onSelect: (v: V) => void }) {
  const { t } = useAppLang();
  if (!options.length) return <p className="px-6 py-8 text-center text-muted-foreground">{t.common.noResults}</p>;
  return (
    <ul role="listbox" className="px-2">
      {options.map((o) => (
        <li key={o.value}>
          <button type="button" role="option" aria-selected={value === o.value} onClick={() => onSelect(o.value)}
            className="flex min-h-14 w-full items-center justify-between gap-3 rounded-xl px-4 py-2 text-left hover:bg-muted">
            <span><span className="block text-base">{o.label}</span>{o.sub && <span className="block text-sm text-muted-foreground">{o.sub}</span>}</span>
            {value === o.value && <Check className="size-5" aria-hidden />}
          </button>
        </li>
      ))}
    </ul>
  );
}

export function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="sticky top-0 bg-background px-6 pb-3">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input autoFocus value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder}
          className="h-12 w-full rounded-xl bg-muted pl-12 pr-4 text-base outline-none focus:ring-2 focus:ring-ring" />
      </div>
    </div>
  );
}

export function Checkbox({ checked, onChange, children, id }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode; id: string }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm text-muted-foreground">
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span aria-hidden className={cn("mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-ring", checked && "border-primary bg-primary text-primary-foreground")}>
        {checked && <Check className="size-4" />}
      </span>
      <span>{children}</span>
    </label>
  );
}

export function Notice({ children, tone = "muted" }: { children: ReactNode; tone?: "muted" | "error" | "success" }) {
  return <div role={tone === "error" ? "alert" : "status"} className={cn("rounded-2xl p-4 text-sm", tone === "muted" && "bg-muted text-muted-foreground", tone === "error" && "bg-destructive/10 text-destructive", tone === "success" && "bg-success/10 text-success")}>{children}</div>;
}

/** Grey track with a black pill on the selected choice (Corsa/Bici, Tutte/Corsa/Bici): always the same look. */
export function Segmented<V extends string>({ options, value, onChange, label }: { options: { value: V; label: ReactNode }[]; value: V; onChange: (v: V) => void; label: string }) {
  return (
    <div role="group" aria-label={label} className="grid rounded-full bg-muted p-1" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map((o) => (
        <button key={o.value} type="button" onClick={() => onChange(o.value)} aria-pressed={value === o.value}
          className={cn("min-h-11 rounded-full text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring", value === o.value ? "bg-primary text-primary-foreground" : "text-foreground")}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
