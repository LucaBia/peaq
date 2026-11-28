import { createFileRoute } from "@tanstack/react-router";
import { HelpScreen } from "@/components/app/Settings";

export const Route = createFileRoute("/_authenticated/app/help")({
  head: () => ({ meta: [{ title: "Aiuto e feedback — PEAQ" }, { name: "robots", content: "noindex" }] }),
  component: HelpScreen,
});
