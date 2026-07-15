"use client";

import type { CSSProperties } from "react";

/**
 * Embedded interactive page used for self-contained experiences served
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
  const preferredHeight = height.replace(/vh\b/g, "svh");
  const frameStyle = {
    height: preferredHeight,
  } as CSSProperties;

  return (
    <figure className="page-embed">
      <div className="page-embed-toolbar">
        <div>
          <p className="reader-kicker text-marigold-700">Interactive atlas</p>
          <h2>{title}</h2>
        </div>
        <a
          className="page-embed-open"
          href={src}
          rel="noopener noreferrer"
          target="_blank"
        >
          Open full screen
        </a>
      </div>
      <div
        className="page-embed-frame"
        style={frameStyle}
      >
        <iframe
          allowFullScreen
          className="block h-full w-full border-0"
          loading="lazy"
          scrolling="no"
          src={src}
          title={title}
        />
      </div>
      <figcaption className="page-embed-caption">
        {caption ? (
          <span>
            {caption}
          </span>
        ) : null}
      </figcaption>
    </figure>
  );
}
