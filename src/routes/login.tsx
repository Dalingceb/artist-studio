import { createFileRoute } from "@tanstack/react-router";
import Login from "@/views/Login";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: 'Log In — Swazi Artistry' },
      { name: "description", content: 'Sign in to your Swazi Artistry account.' },
      { property: "og:title", content: 'Log In — Swazi Artistry' },
      { property: "og:description", content: 'Sign in to your Swazi Artistry account.' },
    ],
  }),
  ssr: false,
  component: Login,
});
