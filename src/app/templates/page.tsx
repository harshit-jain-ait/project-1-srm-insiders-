import { Metadata } from "next";
import { TemplateGalleryView } from "@/components/templates/template-gallery-view";

export const metadata: Metadata = {
  title: "Template Gallery | Portfolify",
  description:
    "Explore, filter, and preview verified, responsive portfolio templates built on the canonical data model.",
};

export default function TemplatesPage() {
  return <TemplateGalleryView />;
}
