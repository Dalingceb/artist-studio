import { createFileRoute } from "@tanstack/react-router";
import ForgotPassword from "@/views/ForgotPassword";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: 'Forgot Password — Swazi Artistry' },
      { name: "description", content: 'Reset your Swazi Artistry password.' },
      { property: "og:title", content: 'Forgot Password — Swazi Artistry' },
      { property: "og:description", content: 'Reset your Swazi Artistry password.' },
    ],
  }),
  ssr: false,
  component: ForgotPassword,
});
