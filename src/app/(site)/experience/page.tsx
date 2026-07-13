import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "3D Study Roadmap",
  description:
    "The practitioner-reviewed 3D studies planned for the PreserveChhau interactive eBook.",
};

type ModelStudy = {
  name: string;
  file: string;
  purpose: string;
};

type ReleaseGroup = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  studies: ModelStudy[];
};

const releaseGroups: ReleaseGroup[] = [
  {
    id: "essential-comparison-set",
    eyebrow: "First release · 9 studies",
    title: "The essential comparison set",
    description:
      "These establish the three traditions, Mayurbhanj’s core movement, masked expression, instruments, and one paired story study.",
    studies: [
      {
        name: "Three-style line-up",
        file: "chhau-three-styles-lineup.glb",
        purpose:
          "Accurately labelled Mayurbhanj, Seraikella, and Purulia figures in neutral comparison poses.",
      },
      {
        name: "Mayurbhanj foundations",
        file: "mayurbhanj-core.glb",
        purpose:
          "One validated rig with chauk, dharan, and chali studies.",
      },
      {
        name: "Mayurbhanj topkas",
        file: "mayurbhanj-topkas.glb",
        purpose:
          "A practitioner-confirmed set of named topkas on the same rig.",
      },
      {
        name: "Seraikella mask and body",
        file: "seraikella-expression.glb",
        purpose:
          "One fixed, maker-referenced mask read through changes in the body.",
      },
      {
        name: "Purulia masked figure",
        file: "purulia-masked-core.glb",
        purpose:
          "One maker-credited character with complete headgear, costume, and cloth motion.",
      },
      {
        name: "Durga",
        file: "purulia-durga.glb",
        purpose:
          "A troupe-specific Durga address and short movement phrase.",
      },
      {
        name: "Mahishasura",
        file: "purulia-mahishasura.glb",
        purpose:
          "A compatible entrance, confrontation, and controlled fall for the Durga study.",
      },
      {
        name: "Mask comparison",
        file: "mask-comparison.glb",
        purpose:
          "Credited Seraikella and Purulia masks from front, side, and back; Mayurbhanj labelled unmasked.",
      },
      {
        name: "Instrument collection",
        file: "instrument-pack.glb",
        purpose:
          "Region-labelled drums, smaller percussion, and reed instruments as separate meshes.",
      },
    ],
  },
  {
    id: "movement-making-performance-space",
    eyebrow: "Second release · 10 studies",
    title: "Movement, making, and performance space",
    description:
      "These add regional vocabulary, repertoire, costume construction, props, and the wider performance environment.",
    studies: [
      {
        name: "Mayurbhanj uflis",
        file: "mayurbhanj-uflis.glb",
        purpose:
          "Practitioner-selected examples drawn from daily life, nature, and spatial phrasing.",
      },
      {
        name: "Mayurbhanj chamka",
        file: "mayurbhanj-chamka.glb",
        purpose: "Chest and shoulder accents shown against a visible beat marker.",
      },
      {
        name: "Mayurbhanj repertoire",
        file: "mayurbhanj-repertoire.glb",
        purpose:
          "One short, authentic excerpt with exact piece-specific costume and props.",
      },
      {
        name: "Seraikella Ratri",
        file: "seraikella-ratri.glb",
        purpose:
          "A verified passage from Ratri with the mask and costume used for that version.",
      },
      {
        name: "Purulia technique",
        file: "purulia-technique.glb",
        purpose:
          "Validated chal, pirkiti, chhok, and one ulfa with a controlled landing.",
      },
      {
        name: "Purulia Ganesha",
        file: "purulia-ganesha.glb",
        purpose:
          "An exact mask and costume paired with a grounded invocation entry.",
      },
      {
        name: "Purulia mask layers",
        file: "purulia-mask-layers.glb",
        purpose:
          "An exploded educational view of one Charida maker’s documented process.",
      },
      {
        name: "Costume comparison",
        file: "costume-comparison.glb",
        purpose:
          "Three turntable figures with verified, piece- or troupe-specific dress.",
      },
      {
        name: "Performance props",
        file: "prop-pack.glb",
        purpose:
          "Reference-based sword, shield, trident, bow, damaru, and flute—not generic fantasy objects.",
      },
      {
        name: "Arena and akhara",
        file: "asar-akhada-diorama.glb",
        purpose:
          "Documented performance layouts with musicians, entry paths, and spectators.",
      },
    ],
  },
  {
    id: "reference-work-in-progress",
    eyebrow: "Later depth · 4 studies",
    title: "Studies that need more reference work",
    description:
      "These wait because aerial movement, paired costumes, and lineage-specific repertoire need stronger motion, safety, or iconographic review.",
    studies: [
      {
        name: "Mayurbhanj jumps",
        file: "mayurbhanj-jumps.glb",
        purpose:
          "One guru-selected dumka and one dian with preparation, landing, and slow motion.",
      },
      {
        name: "Second Seraikella exemplar",
        file: "seraikella-second-exemplar.glb",
        purpose:
          "Ardhanarishvara or Mayura, chosen with a consultant and built from piece-specific references.",
      },
      {
        name: "Purulia lion vahana",
        file: "purulia-lion-vahana.glb",
        purpose:
          "A documented two-person lion costume with a synchronised walk.",
      },
      {
        name: "Group formations",
        file: "group-formation-pack.glb",
        purpose:
          "Schematic transitions between line, circle, opposing groups, and a central character.",
      },
    ],
  },
];

export default function ExperiencePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-14 sm:py-20">
      <div className="max-w-3xl">
        <p className="text-sm font-semibold tracking-[0.22em] text-marigold-700 uppercase">
          3D study roadmap
        </p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-laterite-900 sm:text-6xl">
          Twenty-three models—only when the references are ready
        </h1>
        <p className="mt-6 text-lg leading-8 text-midnight-800">
          The sandbox itself is built. The cultural models are deliberately not
          filled with generic dancers. Each study must name its regional style,
          reference performer, practitioner reviewer, maker where relevant, and
          permission status before it appears beside the book.
        </p>
      </div>

      <div className="mt-10 grid gap-4 border-y border-laterite-900/15 py-6 sm:grid-cols-3">
        <p className="text-sm leading-6 text-midnight-800">
          <strong className="block text-2xl text-laterite-900">9</strong>
          essential studies for the first coherent release
        </p>
        <p className="text-sm leading-6 text-midnight-800">
          <strong className="block text-2xl text-laterite-900">10</strong>
          second-release studies for greater depth
        </p>
        <p className="text-sm leading-6 text-midnight-800">
          <strong className="block text-2xl text-laterite-900">4</strong>
          advanced studies held for stronger review
        </p>
      </div>

      <div className="mt-16 space-y-20">
        {releaseGroups.map((group) => (
          <section aria-labelledby={`${group.id}-heading`} key={group.id}>
            <div className="grid gap-5 lg:grid-cols-[0.8fr_1.6fr] lg:gap-12">
              <div>
                <p className="text-xs font-bold tracking-[0.18em] text-marigold-700 uppercase">
                  {group.eyebrow}
                </p>
                <h2
                  className="mt-3 font-display text-3xl font-bold text-laterite-900"
                  id={`${group.id}-heading`}
                >
                  {group.title}
                </h2>
                <p className="mt-4 text-sm leading-6 text-midnight-800">
                  {group.description}
                </p>
              </div>

              <ol className="grid gap-px overflow-hidden rounded-2xl border border-laterite-900/15 bg-laterite-900/15 sm:grid-cols-2">
                {group.studies.map((study, index) => (
                  <li className="bg-[#fffaf0] p-5 sm:p-6" key={study.file}>
                    <div className="flex items-start gap-3">
                      <span
                        aria-hidden="true"
                        className="grid size-8 shrink-0 place-items-center rounded-full bg-marigold-100 text-xs font-bold text-laterite-800"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="font-display text-lg font-bold text-laterite-900">
                          {study.name}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-midnight-800">
                          {study.purpose}
                        </p>
                        <code className="mt-3 block break-all text-[11px] text-midnight-700">
                          {study.file}
                        </code>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        ))}
      </div>

      <aside className="mt-20 rounded-3xl border border-marigold-700/25 bg-marigold-50 p-6 sm:p-9">
        <p className="text-xs font-bold tracking-[0.18em] text-marigold-800 uppercase">
          What to send with every model
        </p>
        <p className="mt-3 max-w-3xl text-base leading-7 text-midnight-800">
          Include a sidecar record naming the lineage, movement or character,
          modeller, reference performer, practitioner reviewer, maker or troupe,
          source material, permission, licence, and required credit line. The
          repository’s asset brief contains the full technical and approval
          checklist.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            className="rounded-full bg-laterite-800 px-5 py-3 text-sm font-bold text-white transition hover:bg-laterite-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marigold-500"
            href="/ebook#how-to-use-this-book"
          >
            Try the sandbox controls
          </Link>
          <Link
            className="rounded-full border border-laterite-800/25 bg-white/70 px-5 py-3 text-sm font-bold text-laterite-900 transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-marigold-500"
            href="/ebook#credits-review-status"
          >
            Read credits and review status
          </Link>
        </div>
      </aside>
    </div>
  );
}
