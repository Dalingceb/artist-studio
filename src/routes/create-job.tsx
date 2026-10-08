import { createFileRoute } from "@tanstack/react-router";
import CreateJobListing from "@/views/CreateJobListing";

export const Route = createFileRoute("/create-job")({
  head: () => ({
    meta: [
      { title: 'Post a Job — Swazi Artistry' },
      { name: "description", content: 'Post a gig and find the right artist.' },
      { property: "og:title", content: 'Post a Job — Swazi Artistry' },
      { property: "og:description", content: 'Post a gig and find the right artist.' },
    ],
  }),
  ssr: false,
  component: CreateJobListing,
});
