import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { ThemeProvider } from "@/components/shared/theme/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";

const RootLayout = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider delay={100}>
        <Outlet />
        <TanStackRouterDevtools position="bottom-right" />
      </TooltipProvider>
    </ThemeProvider>
  );
};

export const Route = createRootRoute({ component: RootLayout });
