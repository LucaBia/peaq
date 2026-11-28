import { createFileRoute } from "@tanstack/react-router";
import { FaqScreen } from "@/components/app/Settings";

export const Route = createFileRoute("/_authenticated/app/faq")({
  head: () => ({ meta: [{ title: "FAQ — PEAQ" }, { name: "robots", content: "noindex" }] }),
  component: FaqScreen,
});
