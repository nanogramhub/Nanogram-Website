import { GalleryPage } from "@/components/routes/gallery";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_defaultLayout/gallery")({
  component: RouteComponent,
});

function RouteComponent() {
  return <GalleryPage />;
}
