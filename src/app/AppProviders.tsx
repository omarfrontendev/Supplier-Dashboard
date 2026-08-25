import { ReduxProvider } from "./providers/ReduxProvider";
import { ReactQueryProvider } from "./providers/ReactQueryProvider";
import { ThemeProvider } from "next-themes";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <ReactQueryProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {/* <ThemeProvider> */}
          {children}
          {/* </ThemeProvider> */}
        </ThemeProvider>
      </ReactQueryProvider>
    </ReduxProvider>
  );
}

// 💡 Now Redux + React Query + Theme are available globally
