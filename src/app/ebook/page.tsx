import type { Metadata } from "next";
import { InteractiveEbookInterface } from "@/components/InteractiveEbookInterface";

export const metadata: Metadata = {
  title: "Chhau: The Interactive eBook",
  description:
    "Arnav Ajana’s 12-chapter, Mayurbhanj-centred guide to Mayurbhanj, Seraikella, and Purulia Chhau. Includes linked sources, unvalidated adult-guided activity drafts, and planned 3D studies awaiting practitioner and rights review.",
};

export default function EbookPage() {
  return <InteractiveEbookInterface />;
}
