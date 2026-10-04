import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route=createFileRoute("/rate-contracts/$contractId")({component:()=> <Outlet/>});