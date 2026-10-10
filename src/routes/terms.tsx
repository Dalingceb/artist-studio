import { createFileRoute } from "@tanstack/react-router";
import Terms from "@/views/Terms";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Use — Swazi Artistry" },
      { name: "description", content: "The rules for using Swazi Artistry as a client or artist." },
      { property: "og:title", content: "Terms of Use — Swazi Artistry" },
      { property: "og:description", content: "The rules for using Swazi Artistry as a client or artist." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Terms,
});
