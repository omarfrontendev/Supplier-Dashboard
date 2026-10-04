import { createFileRoute } from "@tanstack/react-router";
import { DecisionView } from "@/components/agreement/decision-view";

export const Route = createFileRoute("/change-partly-approved")({
  head: () => ({
    meta: [
      { title: "Change request partly approved · Hoteliana Supplier Portal" },
      {
        name: "description",
        content:
          "Hoteliana approved part of your company change request; the rejected detail keeps its current value.",
      },
      {
        property: "og:title",
        content: "Change request partly approved · Hoteliana Supplier Portal",
      },
      {
        property: "og:description",
        content:
          "Two details were approved and one was rejected on change request CHG-00042.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <DecisionView outcome="partly" />,
});
