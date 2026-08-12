import type { Metadata } from "next";
import { InteractiveEbookInterface } from "@/components/InteractiveEbookInterface";

export const metadata: Metadata = {
  title: "Read the eBook",
  description:
    "Begin with Arnav Ajana’s first encounter with Chhau, then explore the three traditions, their histories, Mayurbhanj, body mechanics, and movement grammar through Chapter 5.",
};

export default function EbookPage() {
  return <InteractiveEbookInterface />;
}
