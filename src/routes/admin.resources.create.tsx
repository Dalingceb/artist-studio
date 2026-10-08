import { createFileRoute } from "@tanstack/react-router";
import AdminRoute from "@/components/admin/AdminRoute";
import AdminResourceForm from "@/views/AdminResourceForm";

export const Route = createFileRoute("/admin/resources/create")({
  head: () => ({
    meta: [
      { title: 'New Resource — Swazi Artistry' },
      { name: "description", content: 'Swazi Artistry administration.' },
      { property: "og:title", content: 'New Resource — Swazi Artistry' },
      { property: "og:description", content: 'Swazi Artistry administration.' },
    ],
  }),
  ssr: false,
  component: Page,
});

function Page() {
  return (
    <AdminRoute>
      <AdminResourceForm />
    </AdminRoute>
  );
}
