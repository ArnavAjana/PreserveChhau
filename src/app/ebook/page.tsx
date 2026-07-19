import type { Metadata } from "next";
import { InteractiveEbookInterface } from "@/components/InteractiveEbookInterface";

export const metadata: Metadata = {
  title: "The Science of Chhau Dance",
  description:
    "Arnav Ajana’s 12-chapter, 76-page, Mayurbhanj-centred interactive eBook on Mayurbhanj, Seraikella, and Purulia Chhau, with linked sources and clearly marked review limits.",
};

export default function EbookPage() {
  return <InteractiveEbookInterface />;
}
