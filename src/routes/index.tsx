import { createFileRoute } from "@tanstack/react-router";
import Index from "@/views/Index";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Swazi Artistry — Discover Eswatini's Creative Talent" },
      { name: "description", content: 'Find and book talented artists, performers and creatives across Eswatini.' },
      { property: "og:title", content: "Swazi Artistry — Discover Eswatini's Creative Talent" },
      { property: "og:description", content: 'Find and book talented artists, performers and creatives across Eswatini.' },
    ],
  }),
  component: Index,
});
