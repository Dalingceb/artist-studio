import { createFileRoute } from "@tanstack/react-router";
import JobDetails from "@/views/JobDetails";

export const Route = createFileRoute("/jobs/$id/")({
  head: () => ({
    meta: [
      { title: 'Job Details — Swazi Artistry' },
      { name: "description", content: 'See the details of this gig and apply.' },
      { property: "og:title", content: 'Job Details — Swazi Artistry' },
      { property: "og:description", content: 'See the details of this gig and apply.' },
    ],
  }),
  component: JobDetails,
});
