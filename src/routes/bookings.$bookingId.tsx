import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/bookings/$bookingId")({ component: BookingLayout });
function BookingLayout() { return <Outlet />; }