import { createFileRoute } from "@tanstack/react-router";
import AdminRoute from "@/components/admin/AdminRoute";
import AdminResourceManagement from "@/views/AdminResourceManagement";

export const Route = createFileRoute("/admin/resources/")({
  head: () => ({
    meta: [
      { title: 'Manage Resources — Swazi Artistry' },
      { name: "description", content: 'Swazi Artistry administration.' },
      { property: "og:title", content: 'Manage Resources — Swazi Artistry' },
      { property: "og:description", content: 'Swazi Artistry administration.' },
    ],
  }),
  ssr: false,
  component: Page,
});

function Page() {
  return (
    <AdminRoute>
      <AdminResourceManagement />
    </AdminRoute>
  );
}
