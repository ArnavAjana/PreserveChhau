"use client";

/**
 * Embedded interactive page — used for self-contained experiences served
 * from public/, like the Map of Chhau globe atlas. Pages opt in through
 * the `embedUrl` / `embedTitle` / `embedCaption` fields in book-pages.ts.
 */
export function PageEmbed({
  src,
  title,
  caption,
  height = "70vh",
}: {
  src: string;
  title: string;
  caption?: string;
  height?: string;
}) {
  return (
    <figure className="my-8">
      <div
        className="overflow-hidden rounded-sm border border-[#8a6a3d]/35 bg-[#0b0e14] shadow-lg ring-1 ring-black/5"
        style={{ height, minHeight: 420 }}
      >
        <iframe
          allowFullScreen
          className="h-full w-full border-0"
          loading="lazy"
          src={src}
          title={title}
        />
      </div>
      <figcaption className="mt-2 flex flex-wrap items-baseline justify-between gap-2">
        {caption ? (
          <span className="text-xs leading-relaxed text-[#2a1609]/60 italic">
            {caption}
          </span>
        ) : (
          <span />
        )}
        <a
          className="shrink-0 font-reader text-[11px] font-semibold tracking-[0.14em] text-[#7e261e] uppercase underline decoration-[#c84a30]/50 underline-offset-4 hover:text-[#9b2f22]"
          href={src}
          rel="noopener noreferrer"
          target="_blank"
        >
          Open full screen ↗
        </a>
      </figcaption>
    </figure>
  );
}
