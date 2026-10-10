import { createFileRoute } from "@tanstack/react-router";
import Privacy from "@/views/Privacy";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Swazi Artistry" },
      { name: "description", content: "How Swazi Artistry collects, uses and protects your personal information." },
      { property: "og:title", content: "Privacy Policy — Swazi Artistry" },
      { property: "og:description", content: "How Swazi Artistry collects, uses and protects your personal information." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Privacy,
});
