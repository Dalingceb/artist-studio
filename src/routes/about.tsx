import { createFileRoute } from "@tanstack/react-router";
import About from "@/views/About";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: 'About Us — Swazi Artistry' },
      { name: "description", content: "Learn about Swazi Artistry and our mission to support Eswatini's creatives." },
      { property: "og:title", content: 'About Us — Swazi Artistry' },
      { property: "og:description", content: "Learn about Swazi Artistry and our mission to support Eswatini's creatives." },
    ],
  }),
  component: About,
});
