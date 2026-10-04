import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/rate-contracts")({
  component: RateContractsLayout,
});

function RateContractsLayout() {
  return <Outlet />;
}
