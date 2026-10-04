import { createFileRoute } from "@tanstack/react-router";
import { ContractBuilder } from "@/components/contracts/contract-builder";

export const Route = createFileRoute("/rate-contracts/new")({
  validateSearch: (search: Record<string, unknown>) => ({ source: typeof search["source"] === "string" ? search["source"] : undefined }),
  head: () => ({
    meta: [
      { title: "Create supply contract · Hoteliana Supplier Portal" },
      { name: "description", content: "Create a Hoteliana hotel supply contract with rooms, prices, policies and inventory." },
      { property: "og:title", content: "Create supply contract · Hoteliana Supplier Portal" },
      { property: "og:description", content: "Set hotel rooms, prices, policies and inventory in a new supply contract." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: NewContract,
});

function NewContract(){const {source}=Route.useSearch();return source?<ContractBuilder sourceId={source}/>:<ContractBuilder/>;}
