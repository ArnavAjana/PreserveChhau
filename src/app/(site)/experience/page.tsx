import type { Metadata } from "next";
import Link from "next/link";
import { MotionReveal } from "@/components/MotionReveal";

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
    eyebrow: "Release one: 9 studies",
    title: "Start with clear comparisons",
    description:
      "These studies introduce the three traditions, Mayurbhanj movement, masked expression, instruments, and one paired story.",
    studies: [
      {
        name: "Three-style line-up",
        file: "chhau-three-styles-lineup.glb",
        purpose:
          "Compare neutral figures from Mayurbhanj, Seraikella, and Purulia. Practitioners still need to review every regional label and form.",
      },
      {
        name: "Mayurbhanj foundations",
        file: "mayurbhanj-core.glb",
        purpose:
          "Study chauk, dharan, and chali on one proposed rig. A named Mayurbhanj practitioner still needs to review it.",
      },
      {
        name: "Mayurbhanj topkas",
        file: "mayurbhanj-topkas.glb",
        purpose:
          "Place named topkas on the same rig. Practitioners have not confirmed the selection, spelling, or motion.",
      },
      {
        name: "Seraikella mask and body",
        file: "seraikella-expression.glb",
        purpose:
          "Read one fixed mask through changes in the body. A Seraikella practitioner and mask maker still need to approve the references.",
      },
      {
        name: "Purulia masked figure",
        file: "purulia-masked-core.glb",
        purpose:
          "Study one proposed character. Headgear, costume, cloth motion, maker credit, and permissions remain unconfirmed.",
      },
      {
        name: "Durga",
        file: "purulia-durga.glb",
        purpose:
          "Present a troupe-specific Durga address and phrase. The troupe still needs to select and review the reference.",
      },
      {
        name: "Mahishasura",
        file: "purulia-mahishasura.glb",
        purpose:
          "Pair an entrance, confrontation, and controlled fall. Troupe, movement, and safety review remain pending.",
      },
      {
        name: "Mask comparison",
        file: "mask-comparison.glb",
        purpose:
          "Place Seraikella and Purulia masks beside an unmasked Mayurbhanj figure. Maker permissions and regional review remain pending.",
      },
      {
        name: "Instrument collection",
        file: "instrument-pack.glb",
        purpose:
          "Show region-labelled drums, smaller percussion, and reed instruments. Musicians still need to review every label and form.",
      },
    ],
  },
  {
    id: "movement-making-performance-space",
    eyebrow: "Release two: 10 studies",
    title: "Add movement, making, and space",
    description:
      "These studies add regional terms, repertoire, costume construction, props, and performance spaces.",
    studies: [
      {
        name: "Mayurbhanj uflis",
        file: "mayurbhanj-uflis.glb",
        purpose:
          "Choose Mayurbhanj examples from source-specific lists. Practitioner selection and review remain pending.",
      },
      {
        name: "Mayurbhanj chamka",
        file: "mayurbhanj-chamka.glb",
        purpose:
          "Match chest and shoulder accents to a beat marker. Practitioner and musician review remain pending.",
      },
      {
        name: "Mayurbhanj repertoire",
        file: "mayurbhanj-repertoire.glb",
        purpose:
          "Choose one excerpt with a practitioner. Piece-specific movement, costume, props, and permissions remain pending.",
      },
      {
        name: "Seraikella Ratri",
        file: "seraikella-ratri.glb",
        purpose:
          "Study one passage from Ratri. Its version, movement, mask, costume, and permissions still need verification.",
      },
      {
        name: "Purulia technique",
        file: "purulia-technique.glb",
        purpose:
          "Study chal, pirkiti, chhok, and ulfa. A Purulia practitioner still needs to review the terms, motion, and landing.",
      },
      {
        name: "Purulia Ganesha",
        file: "purulia-ganesha.glb",
        purpose:
          "Study an invocation entry. The exact mask, costume, entry, maker credit, and permissions still need approval.",
      },
      {
        name: "Purulia mask layers",
        file: "purulia-mask-layers.glb",
        purpose:
          "Show the stages in one named Charida maker’s process. Work starts only with the maker’s participation and permission.",
      },
      {
        name: "Costume comparison",
        file: "costume-comparison.glb",
        purpose:
          "Turn three figures for comparison. Every piece-specific or troupe-specific dress detail still needs review and permission.",
      },
      {
        name: "Performance props",
        file: "prop-pack.glb",
        purpose:
          "Use source-based props instead of generic fantasy objects. Piece-specific practitioner and maker review remain pending.",
      },
      {
        name: "Arena and akhara",
        file: "asar-akhada-diorama.glb",
        purpose:
          "Map source-based performance layouts with musicians, entry paths, and spectators. Local review remains pending.",
      },
    ],
  },
  {
    id: "reference-work-in-progress",
    eyebrow: "Later release: 4 studies",
    title: "Wait for stronger references",
    description:
      "Aerial movement, paired costumes, and lineage-specific repertoire need stronger motion, safety, or visual review first.",
    studies: [
      {
        name: "Mayurbhanj jumps",
        file: "mayurbhanj-jumps.glb",
        purpose:
          "Study dumka and dian only after a guru selects the examples and a qualified specialist reviews their representation.",
      },
      {
        name: "Second Seraikella exemplar",
        file: "seraikella-second-exemplar.glb",
        purpose:
          "Choose Ardhanarishvara or Mayura with a consultant. Build the study only after approval of piece-specific references.",
      },
      {
        name: "Purulia lion vahana",
        file: "purulia-lion-vahana.glb",
        purpose:
          "Study a two-person lion costume. Troupe-specific costume, movement, and permission records remain pending.",
      },
      {
        name: "Group formations",
        file: "group-formation-pack.glb",
        purpose:
          "Show schematic transitions. Their link to named repertoire remains pending practitioner review.",
      },
    ],
  },
];

export default function ExperiencePage() {
  return (
    <>
      <section className="experience-hero" aria-labelledby="experience-title">
        <MotionReveal className="experience-hero-inner">
          <p className="editorial-kicker text-marigold-300">3D study roadmap</p>
          <h1 id="experience-title">Twenty-three studies. Zero shortcuts.</h1>
          <p className="experience-hero-deck">
            The viewer is ready. The cultural models are not. Each study waits
            for a named source, clear rights, full credit, regional accuracy,
            and review by the right practitioner, musician, or maker.
          </p>
          <div className="experience-stats" aria-label="Roadmap totals">
            <p><strong>09</strong><span>first comparisons</span></p>
            <p><strong>10</strong><span>movement, making, and space</span></p>
            <p><strong>04</strong><span>held for stronger references</span></p>
          </div>
        </MotionReveal>
      </section>

      <div className="experience-groups">
        {releaseGroups.map((group) => (
          <MotionReveal key={group.id}>
            <section className="experience-group" aria-labelledby={`${group.id}-heading`}>
              <div className="experience-group-intro">
                <p className="editorial-kicker text-laterite-700">
                  {group.eyebrow}
                </p>
                <h2
                  id={`${group.id}-heading`}
                >
                  {group.title}
                </h2>
                <p>{group.description}</p>
              </div>

              <ol className="experience-study-list">
                {group.studies.map((study, index) => (
                  <li className="experience-study" key={study.file}>
                    <span className="experience-study-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3>{study.name}</h3>
                      <p>{study.purpose}</p>
                    </div>
                    <code>{study.file}</code>
                  </li>
                ))}
              </ol>
            </section>
          </MotionReveal>
        ))}
      </div>

      <aside className="experience-gate" aria-labelledby="experience-gate-title">
        <MotionReveal>
          <p className="editorial-kicker text-marigold-300">The release gate</p>
          <h2 id="experience-gate-title">What must travel with every model.</h2>
          <p>
            Send the lineage, named movement or character, modeller, reference
            performer, practitioner reviewer, maker or troupe, source material,
            permission, licence, credit line, and approval record. The file is
            only one part of the study.
          </p>
          <div className="experience-gate-actions">
          <Link
            className="editorial-button editorial-button-gold"
            href="/ebook#how-to-use-this-book"
          >
            Try the sandbox controls
          </Link>
          </div>
        </MotionReveal>
      </aside>
    </>
  );
}
