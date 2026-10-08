import { createFileRoute } from "@tanstack/react-router";
import LearningResources from "@/views/LearningResources";

export const Route = createFileRoute("/resources/")({
  head: () => ({
    meta: [
      { title: 'Learning Resources — Swazi Artistry' },
      { name: "description", content: 'Guides and articles to help artists grow their careers.' },
      { property: "og:title", content: 'Learning Resources — Swazi Artistry' },
      { property: "og:description", content: 'Guides and articles to help artists grow their careers.' },
    ],
  }),
  component: LearningResources,
});
