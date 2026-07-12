import type { Metadata } from "next";
import { InteractiveEbookInterface } from "@/components/InteractiveEbookInterface";

export const metadata: Metadata = {
  title: "Chhau — The Interactive eBook",
  description:
    "A 12-chapter, Mayurbhanj-centred introduction to the Mayurbhanj, Seraikella, and Purulia Chhau traditions, with music, source-linked reading, safe learning prompts, and 3D studies awaiting practitioner and rights review. By Arnav Ajana.",
};

export default function EbookPage() {
  return <InteractiveEbookInterface />;
}
