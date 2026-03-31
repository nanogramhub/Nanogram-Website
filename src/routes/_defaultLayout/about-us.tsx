import { AboutUsPage } from "@/components/routes/about-us";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_defaultLayout/about-us")({
  component: RouteComponent,
});

function RouteComponent() {
  return <AboutUsPage />;
}
