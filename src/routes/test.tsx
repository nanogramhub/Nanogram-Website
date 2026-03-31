import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "@/lib/appwrite/api";

export const Route = createFileRoute("/test")({
  component: RouteComponent,
});

function RouteComponent() {
  async function run() {
    const data = await api.public.getCoreMembers({});
    console.log(data);
  }
  return (
    <div>
      <Button onClick={run}>Click me</Button>
    </div>
  );
}
