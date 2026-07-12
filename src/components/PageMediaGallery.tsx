"use client";

import { useState } from "react";
import type { BookPageGalleryImage } from "@/content/book-pages";

/**
 * Image gallery for book pages — masks, costumes, training spaces,
 * performance moments. Pages opt in through the `gallery` field in
 * book-pages.ts; the first image opens large with thumbnails below.
 */
export function PageMediaGallery({ images }: { images: BookPageGalleryImage[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[Math.min(activeIndex, images.length - 1)];

  if (!active) return null;

  return (
    <figure className="my-8">
      <div className="overflow-hidden rounded-sm border border-[#8a6a3d]/35 bg-[#1a1410] shadow-lg">
        {/* Gallery sources are curated local assets defined in book-pages.ts */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={active.alt}
          className="mx-auto max-h-[60vh] w-auto object-contain"
          src={active.src}
        />
      </div>
      {active.caption ? (
        <figcaption className="mt-2 text-xs leading-relaxed text-[#2a1609]/60 italic">
          {active.caption}
        </figcaption>
      ) : null}

      {images.length > 1 ? (
        <div className="mt-3 flex flex-wrap gap-2" role="tablist" aria-label="Gallery images">
          {images.map((image, index) => (
            <button
              aria-label={`View image ${index + 1}: ${image.alt}`}
              aria-selected={index === activeIndex}
              className={`h-14 w-14 overflow-hidden rounded-sm border-2 transition ${
                index === activeIndex
                  ? "border-[#9b2f22]"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
              key={image.src}
              onClick={() => setActiveIndex(index)}
              role="tab"
              type="button"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="" className="h-full w-full object-cover" src={image.src} />
            </button>
          ))}
        </div>
      ) : null}
    </figure>
  );
}
