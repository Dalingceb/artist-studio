import { createFileRoute } from "@tanstack/react-router";
import ArtistProfile from "@/views/ArtistProfile";

export const Route = createFileRoute("/artist/$id")({
  head: () => ({
    meta: [
      { title: 'Artist Profile — Swazi Artistry' },
      { name: "description", content: "View this artist's portfolio, reviews and booking details." },
      { property: "og:title", content: 'Artist Profile — Swazi Artistry' },
      { property: "og:description", content: "View this artist's portfolio, reviews and booking details." },
    ],
  }),
  component: ArtistProfile,
});
