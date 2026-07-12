"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const ChauModelViewer = dynamic(
  () =>
    import("@/components/ChauModelViewer").then(
      (module) => module.ChauModelViewer,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        className="grid h-full min-h-[360px] w-full place-items-center rounded-2xl bg-midnight-950 text-sm font-medium text-midnight-300"
        role="status"
      >
        <p className="animate-pulse tracking-widest uppercase">Loading 3D</p>
      </div>
    ),
  },
);

type GalleryModel = {
  label: string;
  modelUrl: string;
  description: string;
};

type GalleryGroup = {
  name: string;
  blurb: string;
  models: GalleryModel[];
};

const galleryGroups: GalleryGroup[] = [
  {
    name: "Dancers & ensembles",
    blurb: "Performance figures from solo dancers to full village troupes.",
    models: [
      {
        label: "Traditional dancer",
        modelUrl: "/models/chhau-web-assets/traditional-dancer.glb",
        description:
          "A Chhau dancer in full costume — the figure that opens the eBook's introduction to the form.",
      },
      {
        label: "Traditional dancer II",
        modelUrl: "/models/chhau-web-assets/traditional-dancer-copy.glb",
        description:
          "A second study of the costumed dancer, caught in a different moment of the movement phrase.",
      },
      {
        label: "Dancer character",
        modelUrl: "/models/chhau-web-assets/dancer-character.glb",
        description:
          "A character study — in Chhau, the dancer disappears into a god, demon, animal, or archetype.",
      },
      {
        label: "Performing dancers",
        modelUrl: "/models/chhau-web-assets/performing-dancers.glb",
        description:
          "Dancers mid-performance. Chhau is danced in open arenas with the audience on all sides.",
      },
      {
        label: "Dance troupe",
        modelUrl: "/models/chhau-web-assets/dance-troupe.glb",
        description:
          "A troupe in formation — group choreography and entrances are central to festival performances.",
      },
      {
        label: "Chhau group",
        modelUrl: "/models/chhau-web-assets/chhau-group-1.glb",
        description:
          "An ensemble grouping from the book's performance chapters.",
      },
    ],
  },
  {
    name: "The martial root",
    blurb:
      "Chhau grew from parikhanda — sword-and-shield training. These figures hold its core vocabulary.",
    models: [
      {
        label: "Uflis / base",
        modelUrl: "/models/chhau-web-assets/martial-artist.glb",
        description:
          "The base position for uflis, the springing jumps that punctuate Chhau choreography.",
      },
      {
        label: "Topka / attack",
        modelUrl: "/models/chhau-web-assets/martial-artist-copy.glb",
        description:
          "A topka attack posture — the strike vocabulary inherited from martial drill.",
      },
      {
        label: "Chaali / gait",
        modelUrl: "/models/chhau-web-assets/martial-artist-copy-2.glb",
        description:
          "A chaali, one of the characteristic walks modeled on animals, birds, and warriors.",
      },
      {
        label: "Martial artist study",
        modelUrl: "/models/chhau-web-assets/martial-artist-2.glb",
        description: "A further study of the martial stance work behind Chhau.",
      },
      {
        label: "Combat duo",
        modelUrl: "/models/chhau-web-assets/martial-artist-duo.glb",
        description:
          "Paired combat — mock duels remain a staple of Purulia and Mayurbhanj repertoire.",
      },
      {
        label: "Warrior with sword",
        modelUrl: "/models/chhau-web-assets/martial-artist-with-sword.glb",
        description:
          "The warrior figure with sword — Chhau's battlefield ancestry made visible.",
      },
    ],
  },
  {
    name: "Props & weapons",
    blurb: "The sword and shield of parikhanda practice, studied up close.",
    models: [
      {
        label: "Longsword",
        modelUrl: "/models/chhau-web-assets/longsword.glb",
        description:
          "The longsword used in parikhanda exercise and in warrior roles on stage.",
      },
      {
        label: "Round shield",
        modelUrl: "/models/chhau-web-assets/round-shield.glb",
        description:
          "The round shield that pairs with the sword in Chhau's martial drills.",
      },
    ],
  },
  {
    name: "Figure studies",
    blurb: "Neutral body studies used to examine stance, line, and balance.",
    models: [
      {
        label: "Body figure",
        modelUrl: "/models/chhau-web-assets/human-figure.glb",
        description:
          "A neutral figure for studying the Chhau body — bent knees, wide base, lifted chest.",
      },
      {
        label: "Stance figure",
        modelUrl: "/models/chhau-web-assets/human-figure-copy.glb",
        description:
          "A stance study — weight low, spine alive, ready to spring.",
      },
      {
        label: "Chhau figure study",
        modelUrl: "/models/chhau-web-assets/chhau-figure-5a81ddf6.glb",
        description: "A standalone Chhau figure study from the book's assets.",
      },
    ],
  },
];

export function ModelGallery() {
  const [selected, setSelected] = useState<GalleryModel>(
    galleryGroups[0].models[0],
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_24rem]">
      <div className="relative h-[28rem] sm:h-[34rem]">
        <ChauModelViewer
          className="h-full"
          modelUrl={selected.modelUrl}
          modelScale={1}
        />
      </div>

      <div>
        <div className="rounded-2xl border border-laterite-900/10 bg-white p-6">
          <h2 className="font-display text-2xl font-bold text-laterite-900">
            {selected.label}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-midnight-800">
            {selected.description}
          </p>
          <p className="mt-4 text-xs text-midnight-600">
            Drag to rotate · scroll to zoom · use the toolbar for shading,
            lighting, and fullscreen.
          </p>
        </div>

        <nav aria-label="3D models" className="mt-6 space-y-5">
          {galleryGroups.map((group) => (
            <div key={group.name}>
              <h3 className="text-xs font-semibold tracking-widest text-marigold-700 uppercase">
                {group.name}
              </h3>
              <p className="mt-1 text-xs text-midnight-600">{group.blurb}</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {group.models.map((model) => {
                  const active = model.modelUrl === selected.modelUrl;
                  return (
                    <li key={model.modelUrl}>
                      <button
                        aria-pressed={active}
                        onClick={() => setSelected(model)}
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                          active
                            ? "bg-laterite-700 text-ivory"
                            : "bg-laterite-100 text-laterite-900 hover:bg-laterite-200"
                        }`}
                        type="button"
                      >
                        {model.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
