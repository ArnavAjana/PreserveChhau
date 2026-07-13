"use client";

/**
 * Video block for book pages — short observational clips with a caption
 * that tells the reader what to watch for. Pages opt in through the
 * `videoUrl` / `videoCaption` fields in book-pages.ts.
 */
export function PageVideo({
  src,
  caption,
  poster,
}: {
  src: string;
  caption?: string;
  poster?: string;
}) {
  return (
    <figure className="my-8">
      <div className="aspect-video overflow-hidden rounded-sm border border-[#8a6a3d]/35 bg-black shadow-lg">
        <video
          className="h-full w-full object-contain"
          controls
          playsInline
          poster={poster}
          preload="metadata"
          src={src}
        />
      </div>
      {caption ? (
        <figcaption className="mt-2 text-xs leading-relaxed text-[#2a1609]/75 italic">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
