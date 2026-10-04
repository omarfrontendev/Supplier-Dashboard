import { createFileRoute, Outlet } from "@tanstack/react-router";
export const Route = createFileRoute("/bookings/change-requests/$requestId")({ component: Outlet });
