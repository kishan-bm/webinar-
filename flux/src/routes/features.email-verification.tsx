import { createFileRoute } from "@tanstack/react-router";
import { FeaturePage } from "@/components/features/FeaturePage";
import { getCategory } from "@/data/suite";

export const Route = createFileRoute("/features/email-verification")({
  head: () => {
    const category = getCategory("email-verification")!;
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
  return <FeaturePage category={getCategory("email-verification")!} />;
}