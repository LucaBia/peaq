import { createFileRoute } from "@tanstack/react-router";
import { RatingGuide } from "@/components/app/Guides";

export const Route = createFileRoute("/_authenticated/app/rating")({
  head: () => ({ meta: [{ title: "Come funziona il rating — PEAQ" }, { name: "robots", content: "noindex" }] }),
  component: Page,
});

function Page() {
  return <RatingGuide />;
}
