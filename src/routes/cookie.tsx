import { createFileRoute, redirect } from "@tanstack/react-router";
import { LegalPage } from "@/components/app/Legal";
import { LEGAL_PUBLISHED, legalVisible } from "@/lib/legal";

export const Route = createFileRoute("/cookie")({
  // Not public until the texts are final: see lib/legal.ts.
  beforeLoad: () => { if (!legalVisible) throw redirect({ to: "/" }); },
  head: () => ({ meta: [{ title: "Cookie policy — PEAQ" }, ...(LEGAL_PUBLISHED ? [{ name: "description", content: "Cookie policy di PEAQ Race." }] : [{ name: "robots", content: "noindex" }])] }),
  component: () => <LegalPage doc="cookie" />,
});
