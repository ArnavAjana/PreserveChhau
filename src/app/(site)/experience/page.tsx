import type { Metadata } from "next";
import Link from "next/link";
import { ModelGallery } from "@/components/ModelGallery";

export const metadata: Metadata = {
  title: "3D Model Gallery",
  description:
    "Explore the eBook's 3D models — dancers, martial figures, swords, and shields from the Chhau tradition — in an interactive viewer.",
};

export default function ExperiencePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-sm font-semibold tracking-[0.25em] text-marigold-700 uppercase">
        Interactive Experience
      </p>
      <h1 className="mt-4 font-display text-4xl font-bold text-laterite-900 sm:text-5xl">
        The 3D Model Gallery
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-midnight-800">
        Every 3D figure from the interactive eBook, gathered in one place.
        Turn dancers and warriors in your hands, switch shading styles from
        clay to hologram, and study the stances that connect Chhau to its
        martial roots.
      </p>

      <div className="mt-12">
        <ModelGallery />
      </div>

      <p className="mt-12 text-sm text-midnight-700">
        These models appear throughout{" "}
        <Link
          href="/ebook"
          className="font-semibold text-laterite-700 underline decoration-marigold-400 underline-offset-4 hover:text-laterite-600"
        >
          the interactive eBook
        </Link>
        , where each one sits beside the chapter it illustrates.
      </p>
    </div>
  );
}
