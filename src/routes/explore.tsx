import { createFileRoute } from "@tanstack/react-router";
import Explore from "@/views/Explore";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: 'Explore Artists — Swazi Artistry' },
      { name: "description", content: 'Browse musicians, painters, dancers and more creatives from Eswatini.' },
      { property: "og:title", content: 'Explore Artists — Swazi Artistry' },
      { property: "og:description", content: 'Browse musicians, painters, dancers and more creatives from Eswatini.' },
    ],
  }),
  component: Explore,
});
