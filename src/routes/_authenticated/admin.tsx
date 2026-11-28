import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AdminFrame } from "@/components/admin/ui";
import { currentUserIsAdmin } from "@/lib/admin/api";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async () => {
    if (!(await currentUserIsAdmin())) throw redirect({ to: "/app" });
  },
  component: () => (
    <AdminFrame>
      <Outlet />
    </AdminFrame>
  ),
});
