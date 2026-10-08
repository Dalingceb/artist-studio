import { createFileRoute } from "@tanstack/react-router";
import FAQ from "@/views/FAQ";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: 'FAQ — Swazi Artistry' },
      { name: "description", content: 'Answers to common questions about booking and joining as an artist.' },
      { property: "og:title", content: 'FAQ — Swazi Artistry' },
      { property: "og:description", content: 'Answers to common questions about booking and joining as an artist.' },
    ],
  }),
  component: FAQ,
});
