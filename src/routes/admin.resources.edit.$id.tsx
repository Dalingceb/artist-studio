import { createFileRoute } from "@tanstack/react-router";
import AdminRoute from "@/components/admin/AdminRoute";
import AdminResourceForm from "@/views/AdminResourceForm";

export const Route = createFileRoute("/admin/resources/edit/$id")({
  head: () => ({
    meta: [
      { title: 'Edit Resource — Swazi Artistry' },
      { name: "description", content: 'Swazi Artistry administration.' },
      { property: "og:title", content: 'Edit Resource — Swazi Artistry' },
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
