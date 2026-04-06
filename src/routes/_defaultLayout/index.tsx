import { createFileRoute } from "@tanstack/react-router";

import { RootPage } from "@/components/routes/root";

export const Route = createFileRoute("/_defaultLayout/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <RootPage />;
}
