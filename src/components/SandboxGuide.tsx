"use client";

import dynamic from "next/dynamic";

const ChhauModelViewer = dynamic(
  () =>
    import("@/components/ChhauModelViewer").then(
      (module) => module.ChhauModelViewer,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="grid min-h-[460px] place-items-center rounded-2xl border border-[#6f3a28]/15 bg-[#171a18] text-sm font-medium text-[#efe7d0]/65">
        Preparing viewer controls…
      </div>
    ),
  },
);

const guideItems = [
  {
    number: "01",
    title: "Turn the study",
    text: "Drag to rotate. Use the visible + and − controls to zoom without trapping the page scroll.",
  },
  {
    number: "02",
    title: "Choose a viewpoint",
    text: "Open View to compare front, three-quarter, side, and back positions from the same distance.",
  },
  {
    number: "03",
    title: "Separate form from surface",
    text: "Texture preserves the approved model. Clay clarifies mass. Structure reveals construction without novelty effects.",
  },
  {
    number: "04",
    title: "Study movement slowly",
    text: "Approved animated models add a named clip, timeline, loop control, and quarter-, half-, or normal-speed playback.",
  },
] as const;

export function SandboxGuide() {
  return (
    <section
      aria-labelledby="sandbox-guide-title"
      className="mt-10 overflow-hidden rounded-3xl border border-[#6f3a28]/15 bg-[#f3eadc] shadow-[0_18px_60px_rgba(52,30,18,0.10)]"
    >
      <div className="border-b border-[#6f3a28]/12 px-5 py-5 sm:px-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9b402a]">
              First-use guide
            </p>
            <h2
              className="mt-2 font-display text-2xl font-semibold text-[#271913] sm:text-3xl"
              id="sandbox-guide-title"
            >
              How to use a 3D study
            </h2>
          </div>
          <span className="rounded-full border border-[#9b402a]/20 bg-white/55 px-3 py-1.5 text-xs font-semibold text-[#6f3a28]">
            Controls preview · no cultural model loaded
          </span>
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[#4c382f]">
          The object below is deliberately abstract. It lets you learn the interface without presenting an unreviewed figure as Chhau.
        </p>
      </div>

      <div className="p-4 sm:p-6">
        <div className="h-[min(62vh,560px)] min-h-[460px] overflow-hidden rounded-2xl">
          <ChhauModelViewer
            className="h-full"
            modelLabel="viewer controls preview"
            modelScale={1}
            modelUrl={null}
            showFallbackScene
          />
        </div>

        <ol className="mt-5 grid gap-3 sm:grid-cols-2">
          {guideItems.map((item) => (
            <li
              className="rounded-2xl border border-[#6f3a28]/12 bg-white/55 p-4"
              key={item.number}
            >
              <div className="flex gap-3">
                <span className="font-mono text-xs font-bold text-[#ad4c31]">
                  {item.number}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-[#271913]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-[#594238]">
                    {item.text}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
