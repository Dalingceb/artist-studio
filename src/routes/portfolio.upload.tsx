import { createFileRoute } from "@tanstack/react-router";
import PortfolioUpload from "@/views/PortfolioUpload";

export const Route = createFileRoute("/portfolio/upload")({
  head: () => ({
    meta: [
      { title: 'Upload to Portfolio — Swazi Artistry' },
      { name: "description", content: 'Add new work to your artist portfolio.' },
      { property: "og:title", content: 'Upload to Portfolio — Swazi Artistry' },
      { property: "og:description", content: 'Add new work to your artist portfolio.' },
    ],
  }),
  ssr: false,
  component: PortfolioUpload,
});
