import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MotionReveal } from "@/components/MotionReveal";

export const metadata: Metadata = {
  title: "About Arnav",
  description:
    "How student, actor, and dancer Arnav Ajana encountered Mayurbhanj Chhau and developed The Science of Chhau Dance as a source-linked guide for new learners.",
};

const workingPrinciples = [
  ["Ask before claiming", "I start with a question and follow the strongest source I have. I do not turn a gap into a confident story."],
  ["Keep the three styles distinct", "A movement, mask, instrument, or history stays with the region named by its source."],
  ["Credit the people", "Dancers, teachers, musicians, makers, writers, and communities are part of the knowledge, not material around it."],
  ["Leave room for correction", "This book records open questions because a public project should show where work remains."],
] as const;

export default function AboutPage() {
  return (
    <>
      <section className="about-hero" aria-labelledby="about-title">
        <div className="about-hero-inner">
          <MotionReveal className="about-hero-copy">
            <p className="editorial-kicker text-marigold-300">About the author</p>
            <h1 id="about-title">Hi, I’m Arnav.</h1>
            <p className="about-hero-deck">
              I am an IB Diploma student, actor, dancer, and the person behind
              PreserveChhau and <cite>The Science of Chhau Dance</cite>. I met
              Chhau through a performance. The questions stayed long after the
              competition ended.
            </p>
            <div className="about-hero-meta">
              <span>Student researcher</span>
              <span>Performer</span>
              <span>Project author</span>
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
                src="/images/arnav-ajana-about.jpg"
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
          <p className="editorial-kicker text-laterite-700">How this began</p>
          <h2 id="story-title">One rehearsal became a longer investigation.</h2>
        </MotionReveal>

        <MotionReveal className="about-story-prose" delay={0.08}>
          <p className="about-story-lead">
            I first encountered Chhau while preparing for an international
            dance competition. I wanted to perform a form I had never tried.
            My mentor had trained in Mayurbhanj Chhau, and he introduced me to
            it.
          </p>
          <p>
            At first, Chhau belonged to one performance. Then it kept coming
            back. During school rehearsals, our group returned to its movements
            for fun, even when we were meant to practise something else. The
            form had stayed in our bodies.
          </p>
          <p>
            I wanted to know what I had performed. Why was Mayurbhanj Chhau
            unmasked? How did it relate to Seraikella and Purulia? What were the
            drums telling the dancer? Where did the movement words come from?
          </p>
          <p>
            The answers rarely sat in one place. A book explained history. A
            paper discussed movement. A video showed a performance without
            naming what I was watching. As a beginner, I often needed the right
            question before I found a useful answer.
          </p>
          <p>
            This project grew from those searches. I did not begin with a
            campaign or a claim I would save a tradition. I began with one
            performance, then a habit, then a long list of questions. I wanted
            to build the introduction I had needed.
          </p>
          <p>
            Acting taught me to take direction and notice small choices in
            gesture, focus, and timing. Dance made those choices physical.
            School research taught me to record where an answer came from and
            to say when the evidence did not settle a question.
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
            src="/images/arnav-ajana-dance.png"
            width={1094}
          />
        </MotionReveal>
      </section>

      <section className="about-public-work" aria-labelledby="public-work-title">
        <MotionReveal className="about-public-work-heading">
          <p className="editorial-kicker text-laterite-700">Public work</p>
          <h2 id="public-work-title">Arts research, built for a screen.</h2>
        </MotionReveal>
        <MotionReveal className="about-public-work-copy" delay={0.08}>
          <p>
            <cite>The Science of Chhau Dance</cite>, published through
            PreserveChhau, is one part of how I work. I also built IB E-Source,
            a public arts-reference project for IB students covering visual
            arts, theatre, music, and dance. Both projects ask the same simple
            question. How do you make a difficult first step clearer without
            flattening the subject?
          </p>
          <div className="about-public-links">
            <a
              href="https://github.com/ArnavAjana/PreserveChhau"
              rel="noreferrer"
              target="_blank"
            >
              PreserveChhau on GitHub
            </a>
            <a
              href="https://github.com/ArnavAjana/ArnavAjana"
              rel="noreferrer"
              target="_blank"
            >
              IB E-Source on GitHub
            </a>
          </div>
        </MotionReveal>
      </section>

      <section className="about-position" aria-labelledby="position-title">
        <MotionReveal className="about-position-statement">
          <p className="editorial-kicker text-marigold-300">Where I stand</p>
          <h2 id="position-title">Curious. Responsible. Still learning.</h2>
          <p>
            I am not a Chhau guru, historian, or hereditary practitioner. I do
            not speak above the dancers, teachers, musicians, mask makers,
            researchers, and communities whose knowledge makes this work
            possible.
          </p>
        </MotionReveal>

        <MotionReveal className="about-position-detail" delay={0.1}>
          <p>
            My role is specific. I compare sources, point out disagreement,
            design a clear path for beginners, and state what still needs
            review. A screen cannot replace training, a live performance, or
            time with a practitioner.
          </p>
          <p>
            Preservation begins with accurate names, consent, credit, and
            access. This book tries to support those habits without pretending
            ownership of the tradition.
          </p>
        </MotionReveal>
      </section>

      <section className="about-principles" aria-labelledby="principles-title">
        <MotionReveal className="home-section-heading">
          <p className="editorial-kicker text-laterite-700">My working method</p>
          <h2 id="principles-title">Four rules behind every page.</h2>
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
          <h2 id="about-next-title">See what the questions became.</h2>
          <div className="about-next-actions">
            <Link className="editorial-button editorial-button-gold" href="/ebook#chhau">
              Open The Science of Chhau Dance
            </Link>
            <Link className="editorial-text-link text-ivory" href="/ebook#promise-to-the-reader">
              Read my promise to you
            </Link>
          </div>
        </MotionReveal>
      </section>
    </>
  );
}
