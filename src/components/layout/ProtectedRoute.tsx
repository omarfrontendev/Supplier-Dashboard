// import { useSelector } from "react-redux";
import { getToken } from "@/api/auth/token";
import { Navigate } from "@tanstack/react-router";
import type { ReactNode } from "react";

// 💡 Protect routes and redirect if not authenticated
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
