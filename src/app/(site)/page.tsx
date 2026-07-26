import Link from "next/link";
import { MotionReveal } from "@/components/MotionReveal";

const routes = [
  {
    href: "/about",
    index: "01",
    label: "How this began",
    text: "The competition, the rehearsal habit, and the moment I realised I had performed a form I could not yet explain.",
  },
  {
    href: "/ebook#chhau",
    index: "02",
    label: "Enter the book",
    text: "Begin with the body, the rhythm, and the questions that made me return to Chhau after the performance ended.",
  },
  {
    href: "/experience",
    index: "03",
    label: "See what is missing",
    text: "The movement videos, sound recordings, and practitioner voices the first five chapters still need.",
  },
] as const;

const traditions = [
  {
    centre: "Mayurbhanj, Odisha",
    name: "Mayurbhanj",
    note: "The face is uncovered, but the body still leads through weight, rhythm, direction, and held form.",
  },
  {
    centre: "Seraikella, Jharkhand",
    name: "Seraikella",
    note: "A fixed mask changes as the dancer alters the head, torso, timing, focus, and space around it.",
  },
  {
    centre: "Purulia, West Bengal",
    name: "Purulia",
    note: "Mask, crown, costume, music, and broad movement meet the scale of an open festival ground.",
  },
] as const;

const readingPaths = [
  ["Part 1", "How I found Chhau", "/ebook#foreword"],
  ["Chapter 1", "Three traditions, one shared name", "/ebook#chapter-one"],
  ["Chapter 2", "Why there is no single origin story", "/ebook#chapter-two"],
  ["Chapter 3", "Entering Mayurbhanj", "/ebook#chapter-three"],
  ["Chapter 4", "What the body is actually doing", "/ebook#chapter-four"],
  ["Chapter 5", "How movement becomes language", "/ebook#chapter-five"],
] as const;

export default function HomePage() {
  return (
    <>
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero-grid">
          <MotionReveal className="home-hero-intro">
            <p className="editorial-kicker text-marigold-300">
              An interactive book by Arnav Ajana
            </p>
            <h1 id="home-title" className="home-hero-title">
              The Science of Chhau Dance
            </h1>
            <p className="home-hero-deck">
              I learned the choreography before I understood the dance. This is
              my attempt to go back, look again, and find out what Chhau is doing
              inside the body, the music, the mask, and the space.
            </p>
          </MotionReveal>

          <MotionReveal className="home-hero-note" delay={0.12}>
            <p className="home-hero-note-index">The question that started it</p>
            <p className="home-hero-note-copy">
              After the competition, my friends and I kept returning to the
              movements during other rehearsals. The form had stayed in our
              bodies, even though I still could not properly explain it.
            </p>
            <div className="home-hero-actions">
              <Link className="editorial-button editorial-button-light" href="/ebook#chhau">
                Begin the book
              </Link>
              <Link className="editorial-text-link text-ivory" href="/about">
                Read how it began
              </Link>
            </div>
          </MotionReveal>

          <div className="home-hero-foot" aria-label="What the book explores">
            <span>Watch the body</span>
            <span>Hear the rhythm</span>
            <span>Meet three traditions</span>
          </div>
        </div>
      </section>

      <section className="home-entry" aria-labelledby="entry-title">
        <MotionReveal className="home-section-heading">
          <p className="editorial-kicker text-laterite-700">Begin with a real question</p>
          <h2 id="entry-title">I performed Chhau. Then I had to ask what I had performed.</h2>
          <p>
            The website now begins with that experience instead of asking you to
            understand the research system before you care about the dance.
          </p>
        </MotionReveal>

        <div className="home-route-grid">
          {routes.map((route, index) => (
            <MotionReveal delay={index * 0.08} key={route.href}>
              <Link className="home-route-card" href={route.href}>
                <span className="home-route-index">{route.index}</span>
                <span className="home-route-title">{route.label}</span>
                <span className="home-route-copy">{route.text}</span>
                <span className="home-route-action">Open</span>
              </Link>
            </MotionReveal>
          ))}
        </div>
      </section>

      <section className="home-traditions" aria-labelledby="traditions-title">
        <div className="home-traditions-inner">
          <MotionReveal className="home-section-heading home-section-heading-light">
            <p className="editorial-kicker text-marigold-300">The first thing to understand</p>
            <h2 id="traditions-title">Chhau is not one style.</h2>
            <p>
              Mayurbhanj, Seraikella, and Purulia share a name and a region of
              connection. Each has its own way of organising the body, mask,
              music, character, and performance space.
            </p>
          </MotionReveal>

          <ol className="home-tradition-list">
            {traditions.map((tradition, index) => (
              <li key={tradition.name}>
                <MotionReveal delay={index * 0.07}>
                  <div className="home-tradition-row">
                    <span className="home-tradition-number">0{index + 1}</span>
                    <span>
                      <span className="home-tradition-name">{tradition.name}</span>
                      <span className="home-tradition-centre">{tradition.centre}</span>
                    </span>
                    <span className="home-tradition-note">{tradition.note}</span>
                  </div>
                </MotionReveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="home-reading" aria-labelledby="reading-title">
        <MotionReveal className="home-section-heading">
          <p className="editorial-kicker text-laterite-700">The rewritten journey</p>
          <h2 id="reading-title">The opening and first five chapters.</h2>
          <p>
            This edition deliberately stops its editorial rebuild at Chapter 5.
            Chapters 6 onward remain outside this round of changes.
          </p>
        </MotionReveal>

        <nav className="home-reading-list" aria-label="Rewritten chapters">
          {readingPaths.map(([label, title, href], index) => (
            <Link className="home-reading-row" href={href} key={href}>
              <span className="home-reading-number">{String(index + 1).padStart(2, "0")}</span>
              <span className="home-reading-label">{label}</span>
              <span className="home-reading-title">{title}</span>
              <span className="home-reading-action">Read</span>
            </Link>
          ))}
        </nav>
      </section>

      <section className="home-method" aria-labelledby="method-title">
        <MotionReveal className="home-method-copy">
          <p className="editorial-kicker text-marigold-300">What the book needs next</p>
          <h2 id="method-title">A dance book should move, sound, and include the people who know it.</h2>
          <p>
            The first five chapters now mark the exact places where real
            practitioner demonstrations, rhythm recordings, spoken terms, and
            multiple camera angles are needed. A prototype will no longer be
            allowed to pretend it is a lesson.
          </p>
        </MotionReveal>
        <MotionReveal className="home-method-links" delay={0.1}>
          <Link className="editorial-button editorial-button-gold" href="/experience">
            Open the movement room
          </Link>
        </MotionReveal>
      </section>
    </>
  );
}
