import { createFileRoute } from "@tanstack/react-router";
import ArtistProfileCreation from "@/views/ArtistProfileCreation";

export const Route = createFileRoute("/create-profile")({
  head: () => ({
    meta: [
      { title: 'Create Artist Profile — Swazi Artistry' },
      { name: "description", content: 'Set up your artist profile and start getting booked.' },
      { property: "og:title", content: 'Create Artist Profile — Swazi Artistry' },
      { property: "og:description", content: 'Set up your artist profile and start getting booked.' },
    ],
  }),
  ssr: false,
  component: ArtistProfileCreation,
});
