import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";

import GenericError from "./components/error-boundaries/generic-error";
import NotFound from "./components/error-boundaries/not-found";
import { routeTree } from "./routeTree.gen";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
    },
  },
});

export const router = createRouter({
  routeTree,
  context: { queryClient },
  scrollRestoration: true,
  defaultPreload: "intent",
  defaultNotFoundComponent: NotFound,
  defaultErrorComponent: GenericError,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
