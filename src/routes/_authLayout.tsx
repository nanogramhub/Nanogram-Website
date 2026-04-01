import { ensureAuth } from "@/lib/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppwriteException } from "appwrite";

export const Route = createFileRoute("/_authLayout")({
  component: RouteComponent,
  loader: async () => {
    try {
      await ensureAuth();
    } catch (error) {
      if (error instanceof AppwriteException) {
        if (error.type === "general_unauthorized_scope")
          console.log("unauthorized scope");
        return;
      }
    }
    const { currentUser } = useAuthStore.getState();
    if (currentUser) {
      throw redirect({
        to: "/",
      });
    }
  },
  pendingComponent: () => <div>Loading...</div>,
});

function RouteComponent() {
  return <Outlet />;
}
