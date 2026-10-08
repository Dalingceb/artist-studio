import { createFileRoute } from "@tanstack/react-router";
import Messages from "@/views/Messages";

export const Route = createFileRoute("/messages")({
  head: () => ({
    meta: [
      { title: 'Messages — Swazi Artistry' },
      { name: "description", content: 'Chat with artists and clients.' },
      { property: "og:title", content: 'Messages — Swazi Artistry' },
      { property: "og:description", content: 'Chat with artists and clients.' },
    ],
  }),
  ssr: false,
  component: Messages,
});
