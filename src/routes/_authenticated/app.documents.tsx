import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { DocumentsScreen } from "@/components/app/Documents";
import { athleteService } from "@/lib/app/athlete";

export const Route = createFileRoute("/_authenticated/app/documents")({
  head: () => ({ meta: [{ title: "Documenti — PEAQ" }, { name: "robots", content: "noindex" }] }),
  component: Page,
});

function Page() {
  const { user } = Route.useRouteContext();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["athlete", user.id], queryFn: () => athleteService.loadAll(user.id) });
  if (q.isLoading) return <div className="flex flex-1 items-center justify-center"><Loader2 className="size-8 animate-spin text-muted-foreground" /></div>;
  // Settings reads the same cached data: refresh it after every upload or removal.
  return <DocumentsScreen userId={user.id} documents={q.data?.documents ?? []} onDocs={() => qc.invalidateQueries({ queryKey: ["athlete", user.id] })} />;
}
