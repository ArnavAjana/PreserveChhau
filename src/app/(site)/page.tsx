import Link from "next/link";
import { bookPages } from "@/content/book-pages";
import { MotionReveal } from "@/components/MotionReveal";

const routes = [
  {
    href: "/about",
    index: "01",
    label: "Meet Arnav",
    text: "Start with the performance which led to the questions behind this project.",
  },
  {
    href: "/ebook#chhau",
    index: "02",
    label: "Read the eBook",
    text: "Move through 75 short pages on place, body, music, history, and practice.",
  },
  {
    href: "/ebook#map-of-chhau",
    index: "03",
    label: "Open the atlas",
    text: "Begin with the three heartlands, then inspect the evidence behind each marker.",
  },
] as const;

const traditions = [
  {
    centre: "Mayurbhanj, Odisha",
    name: "Mayurbhanj",
    note: "Unmasked. The face remains visible, while stance, torso, focus, and rhythm carry the phrase.",
  },
  {
    centre: "Seraikella, Jharkhand",
    name: "Seraikella",
    note: "Masked. Small changes in angle, timing, and body shape alter how a fixed face reads.",
  },
  {
    centre: "Purulia, West Bengal",
    name: "Purulia",
    note: "Masked. Costume, scale, music, and movement meet the energy of open festival grounds.",
  },
] as const;

const readingPaths = [
  ["New to Chhau", "Start with the three traditions", "/ebook#one-name-not-one-style"],
  ["Interested in movement", "Read how the body carries meaning", "/ebook#chapter-four"],
  ["Listening for the music", "Meet drums, reeds, rhythm, and cues", "/ebook#mayurbhanj-sound-world"],
  ["Checking the history", "Follow sources and visible disagreements", "/ebook#chapter-two"],
  ["Working with 3D", "See the study and review roadmap", "/experience"],
  ["Looking for evidence", "Open the library and research notes", "/ebook#library"],
] as const;

export default function HomePage() {
  return (
    <>
      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero-grid">
          <MotionReveal className="home-hero-intro">
            <p className="editorial-kicker text-marigold-300">
              A student-led field guide
            </p>
            <h1 id="home-title" className="home-hero-title">
              Chhau
            </h1>
            <p className="home-hero-deck">
              One performance left me with questions. This is where those
              questions led.
            </p>
          </MotionReveal>

          <MotionReveal className="home-hero-note" delay={0.12}>
            <p className="home-hero-note-index">Arnav Ajana, student researcher</p>
            <p className="home-hero-note-copy">
              I met Mayurbhanj Chhau while rehearsing for a competition. I did
              not set out to speak for a tradition. I wanted to understand what
              I had performed, then make the first step clearer for the next
              learner.
            </p>
            <div className="home-hero-actions">
              <Link className="editorial-button editorial-button-light" href="/ebook#chhau">
                Begin reading
              </Link>
              <Link className="editorial-text-link text-ivory" href="/about">
                Read my story
              </Link>
            </div>
          </MotionReveal>

          <div className="home-hero-foot" aria-label="Project scope">
            <span>{bookPages.length} eBook pages</span>
            <span>Three regional traditions</span>
            <span>Sources kept in view</span>
          </div>
        </div>
      </section>

      <section className="home-entry" aria-labelledby="entry-title">
        <MotionReveal className="home-section-heading">
          <p className="editorial-kicker text-laterite-700">Choose your way in</p>
          <h2 id="entry-title">Start with the part you care about.</h2>
          <p>
            You do not need to read from page one. The story, the book, and the
            atlas meet in the same research trail.
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
            <p className="editorial-kicker text-marigold-300">One name, three traditions</p>
            <h2 id="traditions-title">Related does not mean identical.</h2>
            <p>
              Geography links Mayurbhanj, Seraikella, and Purulia. Regional
              history, practice, masks, music, and movement keep them distinct.
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
          <p className="editorial-kicker text-laterite-700">Six reading paths</p>
          <h2 id="reading-title">Follow a question, not a menu.</h2>
        </MotionReveal>

        <nav className="home-reading-list" aria-label="Reading paths">
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
          <p className="editorial-kicker text-marigold-300">How I handle the evidence</p>
          <h2 id="method-title">Sources stay visible. Uncertainty stays visible too.</h2>
          <p>
            When accounts conflict, I name the conflict. When a movement belongs
            to one tradition, I do not move it into another.
          </p>
        </MotionReveal>
        <MotionReveal className="home-method-links" delay={0.1}>
          <Link className="editorial-button editorial-button-gold" href="/ebook#library">
            Open the source library
          </Link>
        </MotionReveal>
      </section>
    </>
  );
}
