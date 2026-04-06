import { createFileRoute } from "@tanstack/react-router";

import { EventsPage } from "@/components/routes/events";

export const Route = createFileRoute("/_defaultLayout/events")({
  component: RouteComponent,
});

function RouteComponent() {
  return <EventsPage />;
}
