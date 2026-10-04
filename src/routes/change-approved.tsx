import { createFileRoute } from "@tanstack/react-router";
import { DecisionView } from "@/components/agreement/decision-view";

export const Route = createFileRoute("/change-approved")({
  head: () => ({
    meta: [
      { title: "Change request approved · Hoteliana Supplier Portal" },
      {
        name: "description",
        content:
          "Hoteliana approved your company change request and updated the registered supplier record.",
      },
      {
        property: "og:title",
        content: "Change request approved · Hoteliana Supplier Portal",
      },
      {
        property: "og:description",
        content: "Your approved company details are now visible to selling agents.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <DecisionView outcome="approved" />,
});
