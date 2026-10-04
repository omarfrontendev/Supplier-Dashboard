import { createFileRoute } from "@tanstack/react-router";
import { DecisionView } from "@/components/agreement/decision-view";

export const Route = createFileRoute("/change-rejected")({
  head: () => ({
    meta: [
      { title: "Change request not approved · Hoteliana Supplier Portal" },
      {
        name: "description",
        content:
          "See why Hoteliana did not approve your company change request and what evidence to send next.",
      },
      {
        property: "og:title",
        content: "Change request not approved · Hoteliana Supplier Portal",
      },
      {
        property: "og:description",
        content: "The registered company record stays unchanged until new evidence is verified.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <DecisionView outcome="rejected" />,
});
