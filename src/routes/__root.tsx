import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { AppwriteException } from "appwrite";
import { useState } from "react";

import { PerformanceProvider } from "@/components/shared/performance/performance-provider";
import UserProfileDialog from "@/components/shared/profile/user-profile-dialog";
import { ThemeProvider } from "@/components/shared/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProfileContextProvider } from "@/context/profile-context";
import { ensureAuth } from "@/lib/auth";

const RootLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <PerformanceProvider
        defaultPreference={false}
        storageKey="nanogram-performance"
      >
        <TooltipProvider delay={100}>
          <ProfileContextProvider value={{ open, setOpen }}>
            <div className="bg-background text-foreground">
              <Outlet />
            </div>
          </ProfileContextProvider>
          <UserProfileDialog open={open} setOpen={setOpen} />
          <TanStackRouterDevtools position="bottom-right" />
        </TooltipProvider>
        <Toaster />
      </PerformanceProvider>
    </ThemeProvider>
  );
};

export const Route = createRootRoute({
  component: RootLayout,
  loader: async () => {
    try {
      await ensureAuth();
    } catch (error) {
      if (error instanceof AppwriteException) {
        if (error.type === "general_unauthorized_scope")
          console.log("unauthorized scope");
      }
    }
  },
  pendingComponent: () => <Outlet />,
});
