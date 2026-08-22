import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage } from "@/components/features/FeaturePage";
import { getCategory } from "@/data/suite";

export const Route = createFileRoute("/features/lead-databases")({
  head: () => {
    const category = getCategory("lead-databases")!;
    return ({
    meta: [
      { title: category.metaTitle },
      { name: "description", content: category.metaDescription },
      { property: "og:title", content: category.metaTitle },
      { property: "og:description", content: category.metaDescription },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  });
  },
  component: FeatureRoute,
});

function FeatureRoute() {
  return <FeaturePage category={getCategory("lead-databases")!} />;
}