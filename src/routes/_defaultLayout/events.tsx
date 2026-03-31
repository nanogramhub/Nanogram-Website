import { EventsPage } from "@/components/routes/events";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_defaultLayout/events")({
  component: RouteComponent,
});

function RouteComponent() {
  return <EventsPage />;
}
