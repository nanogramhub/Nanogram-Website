import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_privateLayout/community")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_privateLayout/community"!</div>;
}
