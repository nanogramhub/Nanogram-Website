import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { ThemeProvider } from "@/components/shared/theme/theme-provider";
import { PerformanceProvider } from "@/components/shared/performance/performance-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { AppwriteException } from "appwrite";
import { ensureAuth } from "@/lib/auth";

const RootLayout = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <PerformanceProvider
        defaultPreference={false}
        storageKey="nanogram-performance"
      >
        <TooltipProvider delay={100}>
          <Outlet />
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
