/**
 * The screen an unmatched URL lands on — and, before that, BR-07-05's
 * redirect table.
 *
 * Flow 12 removed the running account and the old payments pages. "أي لينك
 * كان رايح لشاشة اتشالت بيتحوّل كده": a bookmark or an old email should
 * arrive at the page that replaced the screen, not at a dead end.
 */

import { Link, Navigate, useRouterState } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { removedRoutes } from "@/components/layout/finance-mega-menu";

export function NotFound() {
  const path = useRouterState({ select: (state) => state.location.pathname });
  const moved = removedRoutes[path];

  /* Nothing of the 404 is drawn first - a flash of it reads as the answer. */
  if (moved) return <Navigate to={moved} replace />;

  /*
   * UI 07.6 was a page per payment, and Flow 12 removed it: a payment's own
   * page is now its remittance advice, OV 07.11, on UI 07.32. An old link
   * keeps the payment it named and opens that.
   */
  const payment = /^\/finance\/payments\/([A-Za-z0-9-]+)\/?$/.exec(path);
  if (payment?.[1]) {
    return (
      <Navigate
        to="/finance/payments"
        search={{ advice: payment[1] }}
        replace
      />
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-canvas px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-text-primary">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-text-primary">
          Page not found
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link to="/">
            <Button>Go home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
