import { createFileRoute } from "@tanstack/react-router";

import { GalleryPage } from "@/components/routes/gallery";

export const Route = createFileRoute("/_defaultLayout/gallery")({
  component: RouteComponent,
});

function RouteComponent() {
  return <GalleryPage />;
}
