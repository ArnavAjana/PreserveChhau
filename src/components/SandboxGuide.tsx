"use client";

import dynamic from "next/dynamic";

const ChauModelViewer = dynamic(
  () =>
    import("@/components/ChauModelViewer").then(
      (module) => module.ChauModelViewer,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="grid h-[460px] w-full place-items-center rounded-sm border border-yellow-900/30 bg-[#1a1410] text-sm font-medium text-[#efe7d0]/75">
        Loading 3D
      </div>
    ),
  },
);

const GUIDE_MODEL_URL = "/models/chhau-web-assets/traditional-dancer.glb";

type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

const callouts: Array<{
  corner: Corner;
  number: number;
  title: string;
  text: string;
}> = [
  {
    corner: "top-left",
    number: 1,
    title: "Rotate & zoom",
    text: "Drag anywhere on the figure to turn it. Scroll or pinch to move closer. You cannot break anything — explore freely.",
  },
  {
    corner: "top-right",
    number: 2,
    title: "Camera tools",
    text: "Zoom in and out, reset the camera to its home position with the target button, or go fullscreen for a closer look.",
  },
  {
    corner: "bottom-left",
    number: 3,
    title: "Viewer settings",
    text: "The sliders button opens auto-rotate speed, lighting presets, background colour, and pan.",
  },
  {
    corner: "bottom-right",
    number: 4,
    title: "Shading modes",
    text: "The coloured dots re-skin the figure — standard, clay, wireframe, sketch, hologram, and more. Try clay to study pure form.",
  },
];

/**
 * Annotation arrows that extend from each callout card into the sandbox,
 * pointing at the control they describe. Drawn with a parchment halo so
 * they stay readable as they cross onto the dark canvas.
 */
function GuideArrow({ corner }: { corner: Corner }) {
  // Each path starts at the card's side of the boundary and curves to an
  // arrowhead on the control it points at, inside the viewer.
  const paths: Record<Corner, { d: string; className: string }> = {
    "top-left": {
      // From the rotate/zoom card down into the open canvas.
      d: "M 12 6 C 22 44, 46 64, 78 86",
      className: "left-[16%] -top-4 h-28 w-24",
    },
    "top-right": {
      // From the camera card to the top-right toolbar pill.
      d: "M 78 6 C 70 30, 56 40, 30 48",
      className: "right-[148px] -top-4 h-20 w-24",
    },
    "bottom-left": {
      // From the settings card up to the gear in the bottom pill.
      d: "M 12 90 C 26 60, 50 50, 80 40",
      className: "bottom-[-14px] left-[calc(50%-220px)] h-24 w-24",
    },
    "bottom-right": {
      // From the shading card up to the swatch row in the bottom pill.
      d: "M 86 90 C 72 60, 48 50, 20 42",
      className: "bottom-[-14px] right-[calc(50%-200px)] h-24 w-24",
    },
  };

  const { d, className } = paths[corner];
  const markerId = `guide-arrowhead-${corner}`;

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute z-30 hidden lg:block ${className}`}
      viewBox="0 0 100 100"
      fill="none"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <marker
          id={markerId}
          markerWidth="8"
          markerHeight="8"
          refX="4"
          refY="4"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 8 4 L 0 8 z" fill="#c84a30" />
        </marker>
      </defs>
      <path d={d} stroke="#fff8df" strokeWidth="6" strokeLinecap="round" opacity="0.55" />
      <path
        d={d}
        stroke="#c84a30"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="1 7"
        markerEnd={`url(#${markerId})`}
      />
    </svg>
  );
}

function CalloutCard({
  number,
  title,
  text,
}: {
  number: number;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-sm border border-[#8a6a3d]/35 bg-[#fff8df]/80 p-3.5 shadow-sm">
      <p className="flex items-center gap-2 font-reader text-[11px] font-bold tracking-[0.14em] text-[#7e261e] uppercase">
        <span
          aria-hidden="true"
          className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#9b2f22] font-mono text-[10px] text-[#fff8df]"
        >
          {number}
        </span>
        {title}
      </p>
      <p className="mt-1.5 text-[13px] leading-relaxed text-[#2a1609]">{text}</p>
    </div>
  );
}

/**
 * The guided 3D sandbox on "How to Use this Interactive eBook" — a live
 * viewer with labelled arrows pointing at each of its controls.
 */
export function SandboxGuide() {
  const top = callouts.filter((c) => c.corner.startsWith("top"));
  const bottom = callouts.filter((c) => c.corner.startsWith("bottom"));

  return (
    <section aria-label="Guided tour of the 3D sandbox" className="my-8">
      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:gap-x-32">
        {top.map((c) => (
          <CalloutCard key={c.number} number={c.number} title={c.title} text={c.text} />
        ))}
      </div>

      <div className="relative">
        <GuideArrow corner="top-left" />
        <GuideArrow corner="top-right" />
        <div className="relative z-10 h-[460px] overflow-hidden rounded-sm shadow-lg ring-1 ring-black/5">
          <ChauModelViewer className="h-full" modelScale={1} modelUrl={GUIDE_MODEL_URL} />
        </div>
        <GuideArrow corner="bottom-left" />
        <GuideArrow corner="bottom-right" />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:gap-x-32">
        {bottom.map((c) => (
          <CalloutCard key={c.number} number={c.number} title={c.title} text={c.text} />
        ))}
      </div>

      <p className="mt-4 text-center font-reader text-[11px] font-medium tracking-[0.16em] text-[#2a1609]/55 uppercase">
        A live sandbox — the same controls appear on every 3D figure in this book
      </p>
    </section>
  );
}
