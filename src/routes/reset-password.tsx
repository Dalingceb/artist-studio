import { createFileRoute } from "@tanstack/react-router";
import ResetPassword from "@/views/ResetPassword";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: 'Set New Password — Swazi Artistry' },
      { name: "description", content: 'Choose a new password for your account.' },
      { property: "og:title", content: 'Set New Password — Swazi Artistry' },
      { property: "og:description", content: 'Choose a new password for your account.' },
    ],
  }),
  ssr: false,
  component: ResetPassword,
});
