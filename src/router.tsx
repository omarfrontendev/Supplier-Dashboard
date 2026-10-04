import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { NotFound } from "./components/system/not-found";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    /* The root's own screen handles an unmatched URL, including BR-07-05's
       redirect from a page Flow 12 removed. */
    defaultNotFoundComponent: NotFound,
  });

  return router;
};
