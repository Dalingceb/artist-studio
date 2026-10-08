import { createFileRoute } from "@tanstack/react-router";
import JobListings from "@/views/JobListings";

export const Route = createFileRoute("/jobs/")({
  head: () => ({
    meta: [
      { title: 'Gigs & Jobs — Swazi Artistry' },
      { name: "description", content: 'Find open gigs and job listings for artists in Eswatini.' },
      { property: "og:title", content: 'Gigs & Jobs — Swazi Artistry' },
      { property: "og:description", content: 'Find open gigs and job listings for artists in Eswatini.' },
    ],
  }),
  component: JobListings,
});
