import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "3D Study Roadmap",
  description:
    "Planned 3D studies for the PreserveChhau interactive eBook, all awaiting named practitioner, maker, and rights review.",
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
          "A proposed neutral comparison of Mayurbhanj, Seraikella, and Purulia figures; regional labels and forms remain pending practitioner review.",
      },
      {
        name: "Mayurbhanj foundations",
        file: "mayurbhanj-core.glb",
        purpose:
          "One proposed rig for chauk, dharan, and chali studies, pending a named Mayurbhanj practitioner’s review.",
      },
      {
        name: "Mayurbhanj topkas",
        file: "mayurbhanj-topkas.glb",
        purpose:
          "A candidate set of named topkas on the same rig; selection, spelling, and motion are not yet practitioner-confirmed.",
      },
      {
        name: "Seraikella mask and body",
        file: "seraikella-expression.glb",
        purpose:
          "A planned study of one fixed mask read through the body, pending Seraikella practitioner and mask-maker reference approval.",
      },
      {
        name: "Purulia masked figure",
        file: "purulia-masked-core.glb",
        purpose:
          "A proposed character study whose headgear, costume, cloth motion, maker credit, and permissions remain to be confirmed.",
      },
      {
        name: "Durga",
        file: "purulia-durga.glb",
        purpose:
          "A planned troupe-specific Durga address and phrase, pending selection and review with that troupe.",
      },
      {
        name: "Mahishasura",
        file: "purulia-mahishasura.glb",
        purpose:
          "A proposed paired entrance, confrontation, and fall, pending troupe, movement, and safety review.",
      },
      {
        name: "Mask comparison",
        file: "mask-comparison.glb",
        purpose:
          "A planned view of Seraikella and Purulia masks beside an unmasked Mayurbhanj figure; maker permissions and regional review are pending.",
      },
      {
        name: "Instrument collection",
        file: "instrument-pack.glb",
        purpose:
          "Proposed region-labelled drums, smaller percussion, and reed instruments, pending musician review of every label and form.",
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
          "Candidate Mayurbhanj examples drawn from source-specific lists; practitioner selection and review are still pending.",
      },
      {
        name: "Mayurbhanj chamka",
        file: "mayurbhanj-chamka.glb",
        purpose:
          "A proposed chest-and-shoulder accent study with a beat marker, pending practitioner and musician review.",
      },
      {
        name: "Mayurbhanj repertoire",
        file: "mayurbhanj-repertoire.glb",
        purpose:
          "One candidate excerpt to be chosen with a practitioner; piece-specific movement, costume, props, and permissions remain pending.",
      },
      {
        name: "Seraikella Ratri",
        file: "seraikella-ratri.glb",
        purpose:
          "A candidate passage from Ratri whose version, movement, mask, costume, and permissions still require verification.",
      },
      {
        name: "Purulia technique",
        file: "purulia-technique.glb",
        purpose:
          "Proposed chal, pirkiti, chhok, and ulfa studies; terminology, motion, and landing remain pending Purulia practitioner review.",
      },
      {
        name: "Purulia Ganesha",
        file: "purulia-ganesha.glb",
        purpose:
          "A planned invocation study whose exact mask, costume, entry, maker credit, and permissions remain to be approved.",
      },
      {
        name: "Purulia mask layers",
        file: "purulia-mask-layers.glb",
        purpose:
          "A proposed exploded view of one named Charida maker’s process, to be developed only with that maker’s participation and permission.",
      },
      {
        name: "Costume comparison",
        file: "costume-comparison.glb",
        purpose:
          "Three proposed turntable figures; every piece- or troupe-specific dress detail remains pending review and permission.",
      },
      {
        name: "Performance props",
        file: "prop-pack.glb",
        purpose:
          "Proposed source-based props—not generic fantasy objects—pending piece-specific practitioner and maker review.",
      },
      {
        name: "Arena and akhara",
        file: "asar-akhada-diorama.glb",
        purpose:
          "Proposed source-based performance layouts with musicians, entry paths, and spectators, pending local review.",
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
          "A future dumka and dian study only after a guru selects the examples and a qualified specialist reviews their representation.",
      },
      {
        name: "Second Seraikella exemplar",
        file: "seraikella-second-exemplar.glb",
        purpose:
          "Ardhanarishvara or Mayura, to be chosen with a consultant and built only after piece-specific references are approved.",
      },
      {
        name: "Purulia lion vahana",
        file: "purulia-lion-vahana.glb",
        purpose:
          "A proposed two-person lion-costume study, pending troupe-specific costume, movement, and permission records.",
      },
      {
        name: "Group formations",
        file: "group-formation-pack.glb",
        purpose:
          "Proposed schematic transitions whose relationship to any named repertoire remains pending practitioner review.",
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
          Twenty-three planned models—none yet approved
        </h1>
        <p className="mt-6 text-lg leading-8 text-midnight-800">
          The sandbox itself is built, but these entries are specifications—not
          finished or approved models. Each study must name its
          regional style, reference performer, practitioner reviewer, maker where
          relevant, and permission status before it appears beside the book.
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
          advanced studies held until qualified review is arranged
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
          modeller, reference performer, proposed practitioner reviewer, maker
          or troupe, source material, permission, licence, required credit line,
          and current approval status. The repository’s asset brief contains the
          full technical and approval checklist.
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
