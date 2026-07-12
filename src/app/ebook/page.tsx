import type { Metadata } from "next";
import { InteractiveEbookInterface } from "@/components/InteractiveEbookInterface";

export const metadata: Metadata = {
  title: "Chhau — The Interactive eBook",
  description:
    "An interactive introduction to the Mayurbhanj, Seraikella, and Purulia Chhau traditions — with 3D sandboxes, music, and a full source library. By Arnav Ajana.",
};

export default function EbookPage() {
  return <InteractiveEbookInterface />;
}
