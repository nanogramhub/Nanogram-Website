import { SidebarLeft } from "@/components/shared/sidebar";
import { ModeToggle } from "@/components/shared/theme/mode-toggle";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { ensureAuth } from "@/lib/auth";
import { capitalize, kebabCasetoTitleCase } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { Link } from "@tanstack/react-router";
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
  pendingComponent: () => (
    <div className="flex h-dvh w-full">
      <div className="w-[16rem] bg-sidebar h-full p-2">
        <div className="p-2 h-8">
          <Link to="/" className="flex gap-2 h-4">
            <img
              src="/assets/images/nanogram_logo-no-bg.svg"
              alt="logo"
              className="aspect-square"
            />
            <span className="font-bold text-[12px] font-blanka">Nanogram</span>
          </Link>
        </div>
        <Skeleton className="w-full h-8 mt-4" />
        <Skeleton className="w-full h-8 mt-2" />
        <Skeleton className="w-full h-8 mt-2" />
        <Skeleton className="w-full h-8 mt-2" />
        <Skeleton className="w-full h-8 mt-2" />
        <Skeleton className="w-full h-8 mt-2" />
      </div>
      <div className="h-12 w-full flex items-center">
        <Outlet />
      </div>
    </div>
  ),
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
            {kebabCasetoTitleCase(
              location.pathname.split("/").at(1) || "Community",
            )}
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
