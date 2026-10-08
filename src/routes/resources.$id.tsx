import { createFileRoute } from "@tanstack/react-router";
import ResourceDetail from "@/views/ResourceDetail";

export const Route = createFileRoute("/resources/$id")({
  head: () => ({
    meta: [
      { title: 'Learning Resource — Swazi Artistry' },
      { name: "description", content: 'Read this learning resource for artists.' },
      { property: "og:title", content: 'Learning Resource — Swazi Artistry' },
      { property: "og:description", content: 'Read this learning resource for artists.' },
    ],
  }),
  component: ResourceDetail,
});
