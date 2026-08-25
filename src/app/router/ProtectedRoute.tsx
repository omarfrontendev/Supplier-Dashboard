// import { useSelector } from "react-redux";
import { getToken } from "@/core/auth/token";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

// 💡 Protect routes and redirect if not authenticated
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = getToken();

  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
}
