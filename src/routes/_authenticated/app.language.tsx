import { createFileRoute } from "@tanstack/react-router";
import { LanguageScreen } from "@/components/app/Settings";

export const Route = createFileRoute("/_authenticated/app/language")({
  head: () => ({ meta: [{ title: "Lingua — PEAQ" }, { name: "robots", content: "noindex" }] }),
  component: LanguageScreen,
});
