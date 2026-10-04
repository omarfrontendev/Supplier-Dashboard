import { toast } from "sonner";

type Options = {
  description?: string;
  action?: { label: string; onClick: () => void };
  duration?: number;
};

/**
 * Design-system toasts. Each variant carries its own class group so the
 * Toaster in __root can style it with portal tokens.
 */
export const notify = {
  success: (title: string, options?: Options) =>
    toast.success(title, { ...options, className: "hl-toast hl-toast-success" }),
  error: (title: string, options?: Options) =>
    toast.error(title, { ...options, className: "hl-toast hl-toast-error" }),
  warning: (title: string, options?: Options) =>
    toast.warning(title, { ...options, className: "hl-toast hl-toast-warning" }),
  info: (title: string, options?: Options) =>
    toast.info(title, { ...options, className: "hl-toast hl-toast-info" }),
  loading: (title: string, options?: Options) =>
    toast.loading(title, { ...options, className: "hl-toast" }),
  dismiss: (id?: string | number) => toast.dismiss(id),
  promise: <T,>(
    work: Promise<T>,
    messages: { loading: string; success: string; error: string }
  ) =>
    toast.promise(work, {
      loading: messages.loading,
      success: () => messages.success,
      error: () => messages.error,
      className: "hl-toast",
    }),
};

/** Small helper so demo actions can show a realistic pending state. */
export function wait(ms = 700) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
