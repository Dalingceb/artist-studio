import { createFileRoute } from "@tanstack/react-router";
import UserProfile from "@/views/UserProfile";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: 'My Profile — Swazi Artistry' },
      { name: "description", content: 'Manage your profile, bookings and portfolio.' },
      { property: "og:title", content: 'My Profile — Swazi Artistry' },
      { property: "og:description", content: 'Manage your profile, bookings and portfolio.' },
    ],
  }),
  ssr: false,
  component: UserProfile,
});
