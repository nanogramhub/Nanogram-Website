import { SidebarLeft } from "@/components/shared/sidebar";
import { ModeToggle } from "@/components/shared/theme/mode-toggle";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ensureAuth } from "@/lib/auth";
import { capitalize } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { AppwriteException } from "appwrite";

export const Route = createFileRoute("/_privateLayout")({
  component: RouteComponent,
  loader: async () => {
    try {
      await ensureAuth();
    } catch (error) {
      if (error instanceof AppwriteException) {
        if (error.type === "general_unauthorized_scope")
          throw redirect({
            to: "/login",
            search: {
              redirectTo: location.pathname + location.search,
            },
          });
        throw error;
      }
    }
    const { currentUser } = useAuthStore.getState();
    if (!currentUser) {
      throw redirect({
        to: "/login",
        search: {
          redirectTo: location.pathname + location.search,
        },
      });
    }
  },
  pendingComponent: () => <div>Loading...</div>,
});

function RouteComponent() {
  return (
    <SidebarProvider>
      <SidebarLeft collapsible="icon" />
      <SidebarInset>
        <header className="bg-background sticky top-0 flex h-14 shrink-0 items-center gap-2 z-1">
          <div className="flex flex-1 items-center gap-2 px-3">
            <SidebarTrigger className="cursor-pointer" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4 mt-1"
            />
            {capitalize(location.pathname.split("/").at(1) || "Community")}
          </div>
          <div className="flex items-center gap-2 px-3">
            <ModeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
