import Unauthorized from "@/components/error-boundaries/unauthorized";
import { UnauthorizedException } from "@/exceptions";
import { ensureAuth } from "@/lib/auth";
import { useAuthStore } from "@/store/use-auth-store";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppwriteException } from "appwrite";

export const Route = createFileRoute("/_adminLayout")({
  component: RouteComponent,
  loader: async ({ location }) => {
    try {
      await ensureAuth();
    } catch (error) {
      if (error instanceof AppwriteException) {
        if (error.type === "general_unauthorized_scope")
          throw redirect({
            to: "/login",
            search: {
              redirectTo: location.pathname,
            },
          });
        throw error;
      }
    }
    const { currentUser, isAdmin } = useAuthStore.getState();
    if (!currentUser) {
      throw redirect({
        to: "/login",
        search: {
          redirectTo: location.pathname,
        },
      });
    }
    if (!isAdmin) {
      throw new UnauthorizedException(
        "You are not authorized to access this page",
      );
    }
  },
  errorComponent: (error) => {
    if (error.error instanceof UnauthorizedException) {
      return <Unauthorized />;
    }
    return <div>Error</div>;
  },
});

function RouteComponent() {
  return <Outlet />;
}
