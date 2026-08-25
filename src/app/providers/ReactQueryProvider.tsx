import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // 💡 Disable auto refetch on window focus
      retry: 1, // 💡 Retry failed queries once
    },
  },
});

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  // 💡 Wrap your app with QueryClientProvider to use React Query globally
}
