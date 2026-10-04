// import { useSelector } from "react-redux";
import { getToken } from "@/api/auth/token";
import { Navigate } from "@tanstack/react-router";
import type { ReactNode } from "react";

// 💡 Protect routes and redirect if not authenticated
export function ProtectedAuth({ children }: { children: ReactNode }) {
  const token = getToken();

  if (token) {
    return <Navigate to="/getting-started" replace />;
  }

  return children;
}
