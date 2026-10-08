import { createFileRoute } from "@tanstack/react-router";
import Categories from "@/views/Categories";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: 'Talent Categories — Swazi Artistry' },
      { name: "description", content: 'Explore artists by category, from music and dance to visual arts.' },
      { property: "og:title", content: 'Talent Categories — Swazi Artistry' },
      { property: "og:description", content: 'Explore artists by category, from music and dance to visual arts.' },
    ],
  }),
  component: Categories,
});
