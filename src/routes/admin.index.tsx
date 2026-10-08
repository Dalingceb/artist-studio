import { createFileRoute } from "@tanstack/react-router";
import AdminRoute from "@/components/admin/AdminRoute";
import AdminDashboard from "@/views/AdminDashboard";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [
      { title: 'Admin Dashboard — Swazi Artistry' },
      { name: "description", content: 'Swazi Artistry administration.' },
      { property: "og:title", content: 'Admin Dashboard — Swazi Artistry' },
      { property: "og:description", content: 'Swazi Artistry administration.' },
    ],
  }),
  ssr: false,
  component: Page,
});

function Page() {
  return (
    <AdminRoute>
      <AdminDashboard />
    </AdminRoute>
  );
}
