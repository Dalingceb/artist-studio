import { createFileRoute } from "@tanstack/react-router";
import Signup from "@/views/Signup";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: 'Sign Up — Swazi Artistry' },
      { name: "description", content: 'Create your Swazi Artistry account to book or showcase talent.' },
      { property: "og:title", content: 'Sign Up — Swazi Artistry' },
      { property: "og:description", content: 'Create your Swazi Artistry account to book or showcase talent.' },
    ],
  }),
  ssr: false,
  component: Signup,
});
