export function reportError(
  error: Error,
  context?: Record<string, unknown>
) {
  // Placeholder for error reporting integration.
  // In production this can forward to an observability endpoint.
  if (typeof window !== "undefined" && (window as unknown as { __app_debug?: boolean }).__app_debug) {
    console.error("[App Error]", error, context);
  }
}
