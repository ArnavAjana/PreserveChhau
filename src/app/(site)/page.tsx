import Link from "next/link";
import { bookPages } from "@/content/book-pages";

// The book's parts, drawn from its section pages (e.g. "Part One — The
// World of Chhau"), each described for the landing-page overview.
const partDescriptions: Record<string, string> = {
  Foreword: "Why this eBook exists, and how to read it.",
  "The World of Chhau":
    "The shared ground — origins, the Chhau body, music, masks, costume, and community.",
  Mayurbhanj:
    "The maskless tradition of Odisha, where the body itself becomes the mask.",
  Seraikella:
    "The lyrical masked style of Jharkhand, refined under royal performer-choreographers.",
  Purulia:
    "West Bengal's acrobatic, community-driven style with its towering sculptural masks.",
  "Glossary, Index, and Library":
    "Plain-language terms, an index, and every source behind the book.",
};

function getBookParts() {
  return bookPages
    .filter((page) => page.pageType === "section")
    .map((page) => {
      const title = page.title.includes(" — ")
        ? page.title.split(" — ").slice(1).join(" — ")
        : page.title;
      return {
        id: page.id,
        title,
        description: partDescriptions[title] ?? "",
      };
    });
}

const styles = [
  {
    name: "Seraikella Chhau",
    region: "Jharkhand",
    description:
      "The lyrical court style, shaped by royal performer-choreographers. Serene masks, poetic themes, and refined grace.",
  },
  {
    name: "Mayurbhanj Chhau",
    region: "Odisha",
    description:
      "The maskless style, where the dancer's whole body becomes the mask. Athletic, vigorous, and famously acrobatic.",
  },
  {
    name: "Purulia Chhau",
    region: "West Bengal",
    description:
      "The most theatrical of the three — towering masks, thundering drums, and all-night festival performances.",
  },
];

export default function HomePage() {
  const bookParts = getBookParts();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-midnight-950 text-ivory">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(244,157,12,0.18),transparent_60%)]"
        />
        <div className="relative mx-auto max-w-6xl px-6 py-24 sm:py-32">
          <p className="text-sm font-semibold tracking-[0.25em] text-marigold-400 uppercase">
            UNESCO Intangible Cultural Heritage
          </p>
          <h1 className="mt-6 max-w-3xl font-display text-5xl leading-tight font-bold sm:text-6xl">
            The dance of warriors,
            <span className="text-marigold-400"> gods</span>, and the turning
            seasons.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-midnight-200">
            Chhau is the masked martial dance of eastern India — born from the
            sword drills of foot soldiers, raised in village squares under
            torchlight, and alive today in three magnificent regional
            traditions. PreserveChhau brings its story to you.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/ebook"
              className="rounded-full bg-marigold-500 px-7 py-3 text-sm font-semibold text-midnight-950 transition-colors hover:bg-marigold-400"
            >
              Read the eBook
            </Link>
            <Link
              href="/experience"
              className="rounded-full border border-ivory/30 px-7 py-3 text-sm font-semibold text-ivory transition-colors hover:border-marigold-400 hover:text-marigold-300"
            >
              Explore the 3D Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* Three styles */}
      <section aria-labelledby="styles-heading" className="mx-auto max-w-6xl px-6 py-20">
        <h2
          id="styles-heading"
          className="font-display text-3xl font-bold text-laterite-900 sm:text-4xl"
        >
          Three traditions, one spirit
        </h2>
        <p className="mt-4 max-w-2xl text-midnight-800">
          Where West Bengal, Jharkhand, and Odisha meet, three styles of Chhau
          grew from a shared martial root — each with its own voice.
        </p>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {styles.map((style) => (
            <article
              key={style.name}
              className="rounded-2xl border border-laterite-900/10 bg-white p-7 shadow-sm transition-shadow hover:shadow-md"
            >
              <p className="text-xs font-semibold tracking-widest text-marigold-700 uppercase">
                {style.region}
              </p>
              <h3 className="mt-2 font-display text-xl font-bold text-laterite-900">
                {style.name}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-midnight-800">
                {style.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* eBook preview */}
      <section
        aria-labelledby="ebook-heading"
        className="border-y border-laterite-900/10 bg-laterite-50"
      >
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold tracking-widest text-marigold-700 uppercase">
                The Interactive eBook · {bookPages.length} pages
              </p>
              <h2
                id="ebook-heading"
                className="mt-3 font-display text-3xl font-bold text-laterite-900 sm:text-4xl"
              >
                Chhau — an interactive introduction
              </h2>
              <p className="mt-4 max-w-2xl text-midnight-800">
                Two years of research distilled into one immersive book by
                Arnav Ajana — with 3D sandboxes you can rotate, music, and a
                full source library. Built like a small museum: rooms you can
                wander between, in any order.
              </p>
            </div>
            <Link
              href="/ebook"
              className="rounded-full bg-laterite-700 px-7 py-3 text-sm font-semibold text-ivory transition-colors hover:bg-laterite-600"
            >
              Start reading
            </Link>
          </div>
          <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bookParts.map((part, index) => (
              <li key={part.id}>
                <Link
                  href="/ebook"
                  className="block h-full rounded-xl border border-laterite-900/10 bg-white p-5 transition-colors hover:border-marigold-400"
                >
                  <span className="font-display text-sm font-bold text-marigold-700">
                    {index === 0 ? "Front matter" : `Part ${index}`}
                  </span>
                  <span className="mt-1 block font-medium text-midnight-950">
                    {part.title}
                  </span>
                  {part.description ? (
                    <span className="mt-2 block text-sm leading-relaxed text-midnight-700">
                      {part.description}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Mission */}
      <section aria-labelledby="mission-heading" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="mission-heading"
            className="font-display text-3xl font-bold text-laterite-900 sm:text-4xl"
          >
            Why preservation matters
          </h2>
          <p className="mt-6 leading-relaxed text-midnight-800">
            Each master who passes without students takes choreography with
            him. Each festival that shortens its nights loses a story. Chhau
            has survived by adapting without surrendering — and this platform
            continues that work, carrying the tradition to new audiences
            through accessible storytelling and interactive technology.
          </p>
          <p className="mt-6 font-display text-xl text-laterite-800 italic">
            &ldquo;Tell the story. Keep the flame.&rdquo;
          </p>
        </div>
      </section>
    </>
  );
}
