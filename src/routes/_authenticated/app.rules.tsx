import { createFileRoute } from "@tanstack/react-router";
import { RulesScreen } from "@/components/app/Settings";

export const Route = createFileRoute("/_authenticated/app/rules")({
  head: () => ({ meta: [{ title: "Regolamento — PEAQ" }, { name: "robots", content: "noindex" }] }),
  component: RulesScreen,
});
