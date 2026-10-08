import { createFileRoute } from "@tanstack/react-router";
import JobApplication from "@/views/JobApplication";

export const Route = createFileRoute("/jobs/$id/apply")({
  head: () => ({
    meta: [
      { title: 'Apply for Job — Swazi Artistry' },
      { name: "description", content: 'Send your application for this gig.' },
      { property: "og:title", content: 'Apply for Job — Swazi Artistry' },
      { property: "og:description", content: 'Send your application for this gig.' },
    ],
  }),
  ssr: false,
  component: JobApplication,
});
