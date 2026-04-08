import Unauthorized from "@/components/error-boundaries/unauthorized";
import PageBreadcrumb from "@/components/routes/page-breadcrumb";
import { PerformanceToggle } from "@/components/shared/performance/performance-toggle";
import UserAvatar from "@/components/shared/profile/user-avatar";
import { ModeToggle } from "@/components/shared/theme/mode-toggle";
import { Button } from "@/components/ui/button";
import { UnauthorizedException } from "@/exceptions";
import { useProfile } from "@/hooks/use-profile";
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
  const currentUser = useAuthStore((s) => s.currentUser);
  const { open, setOpen } = useProfile();
  if (!currentUser) return null;
  return (
    <>
      <header className="bg-background sticky top-0 flex h-14 shrink-0 items-center gap-2 z-1">
        <div className="flex flex-1 items-center gap-2 px-3">
          <PageBreadcrumb />
        </div>
        <div className="flex items-center gap-2 px-3">
          <PerformanceToggle />
          <ModeToggle />
          <Button
            size="icon-lg"
            className="rounded-full"
            onClick={() => setOpen(!open)}
          >
            <UserAvatar
              name={currentUser.name}
              imageUrl={currentUser.imageUrl}
            />
          </Button>
        </div>
      </header>
      <div className="flex flex-1 h-dvh flex-col">
        <Outlet />
      </div>
    </>
  );
}
