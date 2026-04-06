import { createFileRoute } from "@tanstack/react-router";

import { AboutUsPage } from "@/components/routes/about-us";

export const Route = createFileRoute("/_defaultLayout/about-us")({
  component: RouteComponent,
});

function RouteComponent() {
  return <AboutUsPage />;
}
