"use client";

/**
 * Embedded interactive page — used for self-contained experiences served
 * from public/, like the local, schematic Map of Chhau. Pages opt in through
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
    <figure className="my-10">
      <div
        className="overflow-hidden rounded-2xl border border-[#7e3b2d]/20 bg-[#f2e8d4] shadow-[0_18px_50px_rgba(45,24,15,0.12)]"
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
      <figcaption className="mt-3 flex flex-wrap items-baseline justify-between gap-3 px-1">
        {caption ? (
          <span className="max-w-2xl text-xs leading-relaxed text-[#402820]/65">
            {caption}
          </span>
        ) : (
          <span />
        )}
        <a
          className="shrink-0 text-[11px] font-bold tracking-[0.12em] text-[#7e3b2d] uppercase underline decoration-[#d9993d]/70 underline-offset-4 hover:text-[#9b4e37] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d9993d]"
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
