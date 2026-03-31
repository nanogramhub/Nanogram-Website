import { RootPage } from "@/components/routes/root";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_defaultLayout/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <RootPage />;
}
