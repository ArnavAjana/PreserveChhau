import type { Metadata } from "next";
import Link from "next/link";
import { MotionReveal } from "@/components/MotionReveal";

export const metadata: Metadata = {
  title: "Movement Room",
  description:
    "The filming, sound, practitioner, and 3D plan for the opening and first five chapters of The Science of Chhau Dance.",
};

type ExperienceItem = {
  name: string;
  status: string;
  purpose: string;
};

type ExperienceGroup = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  items: ExperienceItem[];
};

const experienceGroups: ExperienceGroup[] = [
  {
    id: "watch-the-movement",
    eyebrow: "Watch",
    title: "Show movement through time, not as a frozen pose",
    description:
      "The first five chapters now state what each demonstration must show before it can be treated as part of the book.",
    items: [
      {
        name: "Chauk and dharan",
        status: "Filming needed",
        purpose:
          "Front and side views, preparation, breathing, weight shifts, the route in and out, and a practitioner correcting the stance.",
      },
      {
        name: "Chali",
        status: "Filming needed",
        purpose:
          "Full-body travel, floor pathway, rhythm or counts, normal speed, slow motion, and the final arrival into character.",
      },
      {
        name: "Topka and ufli comparison",
        status: "Practitioner selection needed",
        purpose:
          "One approved example of each, with the demonstrator explaining the terminology, lineage, rhythm, and source of the image.",
      },
      {
        name: "Movement unit to bhangi",
        status: "Filming needed",
        purpose:
          "Preparation, individual unit, connection, phrase, and finish—without looping only the most spectacular frame.",
      },
      {
        name: "Three-tradition entrances",
        status: "Rights and regional review needed",
        purpose:
          "Comparable entrances from Mayurbhanj, Seraikella, and Purulia, studied through weight, tempo, direction, scale, and head-torso relationship.",
      },
    ],
  },
  {
    id: "hear-the-movement",
    eyebrow: "Listen",
    title: "Let the musician explain what the dancer is hearing",
    description:
      "An instrument sample is useful, but the important relationship appears when rhythm and movement are recorded together.",
    items: [
      {
        name: "Rehearsal cue",
        status: "Musician session needed",
        purpose:
          "A cue repeated with a dancer, followed by both people explaining what they are waiting for and how the action lands on the rhythm.",
      },
      {
        name: "Open-ground performance sound",
        status: "Rights-cleared field recording needed",
        purpose:
          "The call, crowd, entrance, drums, reed instruments, and the way sound gathers attention across a festival space.",
      },
      {
        name: "Spoken movement terms",
        status: "Lineage confirmation needed",
        purpose:
          "A practitioner pronounces chauk, dharan, chali, topka, ufli, bhangi, dumka, dian, palta, and chamka as used in their own teaching context.",
      },
      {
        name: "Chamka and dhumsa",
        status: "Joint dancer-musician review needed",
        purpose:
          "A sharp chest or shoulder accent shown beside the sound that cues or completes it, with the relationship explained rather than guessed.",
      },
    ],
  },
  {
    id: "turn-and-compare",
    eyebrow: "Look closer",
    title: "Use 3D only where turning the object teaches something",
    description:
      "A model should answer a visual question that video or photography cannot answer as clearly. It should never stand in for a practitioner demonstration.",
    items: [
      {
        name: "Mask and head-angle study",
        status: "Maker and practitioner review needed",
        purpose:
          "Turn a documented Seraikella or Purulia mask with the body to study how angle, scale, visibility, and silhouette change the image.",
      },
      {
        name: "Costume and base-of-support study",
        status: "Reference and permission needed",
        purpose:
          "Compare how costume width, headgear, ornaments, and stance alter the visible centre and the space around the dancer.",
      },
      {
        name: "Akhara and festival ground",
        status: "Local layout review needed",
        purpose:
          "Map one named place with musicians, dancers, audience, entry paths, and performance boundary instead of presenting a generic heritage arena.",
      },
      {
        name: "Floor pathway overlay",
        status: "Motion capture or traced footage needed",
        purpose:
          "Show how chali and a longer phrase use space. A rotating body alone cannot explain travel.",
      },
    ],
  },
];

export default function ExperiencePage() {
  return (
    <>
      <section className="experience-hero" aria-labelledby="experience-title">
        <MotionReveal className="experience-hero-inner">
          <p className="editorial-kicker text-marigold-300">Movement room</p>
          <h1 id="experience-title">A dance book should move and sound like a dance.</h1>
          <p className="experience-hero-deck">
            The first version leaned too heavily on text and prototype 3D files.
            This page now records the real work still needed for the opening and
            Chapters 1–5: practitioner demonstrations, musical explanation,
            spoken terminology, permissions, and only then carefully chosen 3D.
          </p>
          <div className="experience-stats" aria-label="Current rebuild scope">
            <p><strong>05</strong><span>chapters in this rebuild</span></p>
            <p><strong>09</strong><span>movement and sound priorities</span></p>
            <p><strong>00</strong><span>prototypes treated as lessons</span></p>
          </div>
        </MotionReveal>
      </section>

      <div className="experience-groups">
        {experienceGroups.map((group) => (
          <MotionReveal key={group.id}>
            <section className="experience-group" aria-labelledby={`${group.id}-heading`}>
              <div className="experience-group-intro">
                <p className="editorial-kicker text-laterite-700">
                  {group.eyebrow}
                </p>
                <h2 id={`${group.id}-heading`}>{group.title}</h2>
                <p>{group.description}</p>
              </div>

              <ol className="experience-study-list">
                {group.items.map((item, index) => (
                  <li className="experience-study" key={item.name}>
                    <span className="experience-study-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3>{item.name}</h3>
                      <p>{item.purpose}</p>
                    </div>
                    <code>{item.status}</code>
                  </li>
                ))}
              </ol>
            </section>
          </MotionReveal>
        ))}
      </div>

      <aside className="experience-gate" aria-labelledby="experience-gate-title">
        <MotionReveal>
          <p className="editorial-kicker text-marigold-300">The non-negotiable rule</p>
          <h2 id="experience-gate-title">No file appears without the people and evidence behind it.</h2>
          <p>
            A movement clip needs its demonstrator, practitioner or lineage,
            regional tradition, terminology, rhythm, permission, and credit. A
            mask or costume model needs the maker, source object, region,
            permission, modeller, and reviewer. Until those records exist, the
            page will say what is missing instead of presenting a placeholder as
            knowledge.
          </p>
          <div className="experience-gate-actions">
            <Link
              className="editorial-button editorial-button-gold"
              href="/ebook#chapter-four"
            >
              Read the body chapter
            </Link>
          </div>
        </MotionReveal>
      </aside>
    </>
  );
}
