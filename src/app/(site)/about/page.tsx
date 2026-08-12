import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MotionReveal } from "@/components/MotionReveal";
import { withBasePath } from "@/lib/site-path";

export const metadata: Metadata = {
  title: "How I Found Chhau",
  description:
    "Arnav Ajana tells the story of learning Chhau for a performance, realising how little he understood, and returning to investigate the dance more honestly.",
};

const workingPrinciples = [
  [
    "Let the body speak first",
    "When movement is the subject, I should show movement—not hide it inside paragraphs or replace it with a frozen model.",
  ],
  [
    "Name the tradition",
    "Mayurbhanj, Seraikella, and Purulia are connected, but a movement, mask, rhythm, or history must stay with the region that owns it.",
  ],
  [
    "Put people back in the page",
    "Teachers, dancers, musicians, makers, troupes, and communities should appear as people with names and knowledge, not as anonymous sources.",
  ],
  [
    "Admit what is unfinished",
    "A missing demonstration, uncertain date, or disputed term should remain visible instead of being covered by confident writing.",
  ],
] as const;

export default function AboutPage() {
  return (
    <>
      <section className="about-hero" aria-labelledby="about-title">
        <div className="about-hero-inner">
          <MotionReveal className="about-hero-copy">
            <p className="editorial-kicker text-marigold-300">How this began</p>
            <h1 id="about-title">I learned the steps first. The questions came later.</h1>
            <p className="about-hero-deck">
              I am Arnav Ajana—an IB Diploma student, actor, and dancer. I met
              Mayurbhanj Chhau while preparing for an international competition.
              The performance ended. The movement did not.
            </p>
            <div className="about-hero-meta">
              <span>Dancer</span>
              <span>Student</span>
              <span>Still learning</span>
            </div>
          </MotionReveal>

          <MotionReveal className="about-hero-portrait" delay={0.1}>
            <figure>
              <Image
                alt="Arnav Ajana standing beside a horse"
                className="about-hero-image"
                height={2048}
                priority
                sizes="(min-width: 900px) 38vw, 92vw"
                src={withBasePath("/images/arnav-ajana-about.jpg")}
                width={1839}
              />
              <figcaption className="about-hero-caption">
                Arnav Ajana. Photograph by Wahyu M.
              </figcaption>
            </figure>
          </MotionReveal>
        </div>
      </section>

      <section className="about-story" aria-labelledby="story-title">
        <MotionReveal className="about-story-heading">
          <p className="editorial-kicker text-laterite-700">The moment I returned</p>
          <h2 id="story-title">Chhau kept appearing in rehearsals where it did not belong.</h2>
        </MotionReveal>

        <MotionReveal className="about-story-prose" delay={0.08}>
          <p className="about-story-lead">
            For the competition, my job was simple: remember the choreography,
            hold the formation, arrive on the beat, and make the movement look
            convincing. I was concentrating on performance, not understanding.
          </p>
          <p>
            Later, during school rehearsals for completely different work, my
            friends and I kept slipping back into the Chhau movements. We did it
            for fun. The form had stayed in our bodies even though the original
            performance was over.
          </p>
          <p>
            That was when I realised I could perform the sequence but could not
            answer basic questions about it. Why was Mayurbhanj unmasked? What
            were the drums telling us? Were the words I had learned used by every
            teacher? Why did Seraikella and Purulia look so different if all
            three were called Chhau?
          </p>
          <p>
            I began searching. Books gave me history but could not show the
            movement. Videos gave me performances but did not always name what I
            was seeing. Lists of terms disagreed with one another. The more I
            found, the less honest it felt to write as though the answers were
            simple.
          </p>
          <p>
            This project grew from that gap. I wanted to build the introduction
            I had needed: one that lets a young reader see the body, hear the
            rhythm, meet the people, and then follow the evidence.
          </p>
        </MotionReveal>
      </section>

      <section
        aria-label="Arnav Ajana in movement"
        className="about-dance-moment"
      >
        <MotionReveal className="about-dance-moment-inner">
          <Image
            alt="Arnav Ajana holding a dance pose beneath carved stone arches"
            className="about-dance-moment-image"
            height={1166}
            sizes="(min-width: 900px) 46rem, 92vw"
            src={withBasePath("/images/arnav-ajana-dance.png")}
            width={1094}
          />
        </MotionReveal>
      </section>

      <section className="about-public-work" aria-labelledby="public-work-title">
        <MotionReveal className="about-public-work-heading">
          <p className="editorial-kicker text-laterite-700">Why make it interactive?</p>
          <h2 id="public-work-title">Because a dance cannot survive as text alone.</h2>
        </MotionReveal>
        <MotionReveal className="about-public-work-copy" delay={0.08}>
          <p>
            A movement needs time, direction, rhythm, preparation, and recovery.
            A mask needs a maker, a material, and a moving body beneath it. A drum
            needs to be heard beside the dancer it is cueing. The website should
            bring those relationships together instead of using technology as
            decoration.
          </p>
          <p>
            The first version did not always achieve that. It contained strong
            research, but too much of the reader-facing language sounded like a
            research interface explaining itself. The current rebuild begins by
            changing the opening and Chapters 1–5. It does not pretend the later
            chapters have already been fixed.
          </p>
          <div className="about-public-links">
            <a
              href="https://github.com/ArnavAjana/PreserveChhau"
              rel="noreferrer"
              target="_blank"
            >
              View the project on GitHub
            </a>
          </div>
        </MotionReveal>
      </section>

      <section className="about-position" aria-labelledby="position-title">
        <MotionReveal className="about-position-statement">
          <p className="editorial-kicker text-marigold-300">Where I stand</p>
          <h2 id="position-title">I am a learner, not the authority in the room.</h2>
          <p>
            I am not a Chhau guru, historian, hereditary practitioner, musician,
            or mask maker. The authority belongs to the people who train, teach,
            perform, make, remember, and continue these traditions.
          </p>
        </MotionReveal>

        <MotionReveal className="about-position-detail" delay={0.1}>
          <p>
            My role is to ask clear questions, compare what I find, show where
            sources disagree, and build a useful first encounter for another
            beginner.
          </p>
          <p>
            The best version of this project will not make my voice louder than
            everyone else’s. It will make room for practitioners to demonstrate,
            correct, disagree, and speak in their own names.
          </p>
        </MotionReveal>
      </section>

      <section className="about-principles" aria-labelledby="principles-title">
        <MotionReveal className="home-section-heading">
          <p className="editorial-kicker text-laterite-700">What I am trying to do better</p>
          <h2 id="principles-title">Four rules for the rebuild.</h2>
        </MotionReveal>
        <ol className="about-principle-grid">
          {workingPrinciples.map(([title, text], index) => (
            <li key={title}>
              <MotionReveal className="h-full" delay={index * 0.06}>
                <div className="about-principle-card">
                  <span className="about-principle-number">0{index + 1}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </MotionReveal>
            </li>
          ))}
        </ol>
      </section>

      <section className="about-next" aria-labelledby="about-next-title">
        <MotionReveal>
          <p className="editorial-kicker text-marigold-300">Continue from here</p>
          <h2 id="about-next-title">Begin with the performance I did not yet understand.</h2>
          <div className="about-next-actions">
            <Link className="editorial-button editorial-button-gold" href="/ebook#foreword">
              Read Part 1
            </Link>
            <Link className="editorial-text-link text-ivory" href="/experience">
              See the movement and sound plan
            </Link>
          </div>
        </MotionReveal>
      </section>
    </>
  );
}
