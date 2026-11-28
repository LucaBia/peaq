import { createFileRoute, redirect } from "@tanstack/react-router";
import { LegalPage } from "@/components/app/Legal";
import { LEGAL_PUBLISHED, legalVisible } from "@/lib/legal";

export const Route = createFileRoute("/privacy")({
  // Not public until the texts are final: see lib/legal.ts.
  beforeLoad: () => { if (!legalVisible) throw redirect({ to: "/" }); },
  head: () => ({ meta: [{ title: "Informativa sulla privacy — PEAQ" }, ...(LEGAL_PUBLISHED ? [{ name: "description", content: "Informativa sulla privacy di PEAQ Race." }] : [{ name: "robots", content: "noindex" }])] }),
  component: () => <LegalPage doc="privacy" />,
});
