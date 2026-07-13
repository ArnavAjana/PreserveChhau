import Link from "next/link";
import { bookPages } from "@/content/book-pages";

const partDescriptions: Record<string, string> = {
  "How I Found Chhau":
    "The performance, the habit, and the questions that led me to build this book.",
  "Three Traditions, One Family":
    "Meet Mayurbhanj, Seraikella, and Purulia without flattening their differences.",
  "Many Roots, No Single Beginning":
    "Follow martial, seasonal, community, and courtly layers without forcing one origin story.",
  "Mayurbhanj: Place, Festival, and Patronage":
    "Enter Baripada, Chaitra Parva, the Bhanj patrons, and the networks that carried the form.",
  "The Body Without a Mask":
    "See how a visible face and a fully organised body work together in Mayurbhanj.",
  "Movement Grammar":
    "Approach chauk, dharan, chali, topka, ufli, and bhangi with clear source boundaries.",
  "Nature and Daily Life":
    "Notice how animals, water, landscape, and ordinary work can become movement imagery.",
  "Rhythm and Music":
    "Listen for drums, reed instruments, tempo, phrasing, and arrival.",
  "Story and Repertoire":
    "Follow epic, natural, abstract, historical, and contemporary subjects.",
  "Costume, Props, and Masks":
    "Study silhouette and character while keeping makers and regional craft visible.",
  "Performance, Festival, and Community":
    "Meet the wider network that makes a performance possible.",
  "Learning With Care":
    "Look closely, explore safely, and leave formal training to practitioners.",
  "A Living Tradition":
    "Consider access, change, rights, credit, and what responsible preservation asks of us.",
  "Words, Timeline, and Library":
    "Use plain-language terms, a qualified timeline, open questions, and the source shelf.",
  "I Am Still Learning":
    "End where this project began: with curiosity, humility, and more to learn.",
};

function getBookParts() {
  return bookPages
    .filter((page) => page.pageType === "section")
    .map((page) => {
      const title = page.title.includes(" — ")
        ? page.title.split(" — ").slice(1).join(" — ")
        : page.title;
      const label = page.title.includes(" — ")
        ? page.title.split(" — ")[0]
        : page.id === "foreword"
          ? "My starting point"
          : page.id === "end"
            ? "Closing"
            : "Reference";

      return {
        description: partDescriptions[title] ?? "",
        id: page.id,
        label,
        title,
      };
    });
}

const traditions = [
  {
    description:
      "The unmasked tradition at the centre of this eBook, where stance, torso, travel, rhythm, focus, and group design carry the story.",
    name: "Mayurbhanj Chhau",
    region: "Odisha",
  },
  {
    description:
      "A masked tradition with important court histories, where head angle, body design, timing, and stillness change how a fixed face is read.",
    name: "Seraikella Chhau",
    region: "Jharkhand",
  },
  {
    description:
      "A masked, festival-scale tradition with bold silhouettes, maker-led craft, vigorous movement, and strong village-troupe networks.",
    name: "Purulia Chhau",
    region: "West Bengal",
  },
];

const discoverySteps = [
  ["01", "A performance", "I met Chhau while preparing a form I had never tried for an international dance competition."],
  ["02", "A habit", "After the performance, my school group kept returning to its movements during rehearsals."],
  ["03", "A set of questions", "I wanted to understand the unmasked body, the three traditions, the music, and the vocabulary."],
  ["04", "This eBook", "I began connecting reliable starting points for another first-time learner."],
] as const;

export default function HomePage() {
  const bookParts = getBookParts();

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-ivory">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(207,139,24,0.18),transparent_28%),radial-gradient(circle_at_15%_85%,rgba(129,55,37,0.32),transparent_34%)]"
        />
        <div className="relative mx-auto grid max-w-6xl gap-14 px-6 py-20 sm:py-28 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)] lg:items-end">
          <div>
            <p className="text-xs font-extrabold tracking-[0.2em] text-marigold-300 uppercase">
              A student-led interactive eBook
            </p>
            <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[1.02] font-medium tracking-[-0.035em] text-balance sm:text-6xl lg:text-7xl">
              Hi, I’m Arnav. I first encountered Chhau through one
              performance—and kept returning to it.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-ivory/72 sm:text-xl">
              I’m an IB Diploma student, actor, and dancer. What began as
              preparation for an international competition became a habit, then
              a set of questions, and finally this Mayurbhanj-centred journey
              into the wider Chhau family.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                className="inline-flex min-h-12 items-center rounded-full bg-marigold-400 px-6 py-3 text-sm font-bold text-ink transition hover:bg-marigold-300"
                href="/ebook#about-me"
              >
                Start with my story
              </Link>
              <Link
                className="inline-flex min-h-12 items-center rounded-full border border-ivory/25 px-6 py-3 text-sm font-bold text-ivory transition hover:border-marigold-300/70 hover:text-marigold-200"
                href="#chapters"
              >
                Explore the chapters
              </Link>
            </div>
          </div>

          <aside className="rounded-2xl border border-ivory/10 bg-ivory/[0.055] p-6 backdrop-blur-sm">
            <p className="text-xs font-extrabold tracking-[0.18em] text-marigold-300 uppercase">
              My starting point
            </p>
            <p className="mt-4 font-display text-2xl leading-snug text-ivory">
              “I did not begin with a campaign or a claim that I could save a
              tradition.”
            </p>
            <p className="mt-4 text-sm leading-7 text-ivory/65">
              I began with something I had performed and wanted to understand.
              My role here is to ask carefully, keep disagreements visible, and
              point towards the people who know more than I do.
            </p>
          </aside>
        </div>
      </section>

      <section aria-labelledby="discovery-title" className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <div>
            <p className="text-xs font-extrabold tracking-[0.18em] text-laterite-700 uppercase">
              How it became a project
            </p>
            <h2 id="discovery-title" className="mt-3 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
              Performance first. Preservation much later.
            </h2>
            <p className="mt-5 leading-7 text-midnight-700">
              The connection felt organic because I was not searching for a
              cause. I was trying to understand why this form had stayed with
              me after the stage lights were gone.
            </p>
          </div>

          <ol className="grid gap-px overflow-hidden rounded-2xl border border-laterite-900/10 bg-laterite-900/10 sm:grid-cols-2">
            {discoverySteps.map(([number, title, description]) => (
              <li className="bg-white p-6" key={number}>
                <span className="text-xs font-extrabold tracking-[0.16em] text-marigold-700">
                  {number}
                </span>
                <h3 className="mt-3 font-display text-2xl font-medium text-ink">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-midnight-700">
                  {description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="traditions-title" className="border-y border-laterite-900/10 bg-laterite-50">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <div className="max-w-3xl">
            <p className="text-xs font-extrabold tracking-[0.18em] text-laterite-700 uppercase">
              The subject
            </p>
            <h2 id="traditions-title" className="mt-3 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
              Three related traditions. Not one interchangeable style.
            </h2>
            <p className="mt-5 leading-7 text-midnight-700">
              This book looks most closely at Mayurbhanj because that is the
              form through which I entered Chhau. Seraikella and Purulia stay in
              view so that connection never erases difference.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {traditions.map((tradition, index) => (
              <article className="rounded-2xl border border-laterite-900/10 bg-white p-7 shadow-sm" key={tradition.name}>
                <div aria-hidden="true" className="flex gap-1.5">
                  <span className={`h-1 w-8 rounded-full ${index === 0 ? "bg-laterite-700" : "bg-laterite-200"}`} />
                  <span className={`h-1 w-8 rounded-full ${index === 1 ? "bg-marigold-500" : "bg-marigold-200"}`} />
                  <span className={`h-1 w-8 rounded-full ${index === 2 ? "bg-ink" : "bg-midnight-200"}`} />
                </div>
                <p className="mt-6 text-xs font-extrabold tracking-[0.15em] text-marigold-700 uppercase">
                  {tradition.region}
                </p>
                <h3 className="mt-2 font-display text-2xl font-medium text-ink">
                  {tradition.name}
                </h3>
                <p className="mt-4 text-sm leading-7 text-midnight-700">
                  {tradition.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="chapters-title" className="mx-auto max-w-6xl px-6 py-20 sm:py-24" id="chapters">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-3xl">
            <p className="text-xs font-extrabold tracking-[0.18em] text-laterite-700 uppercase">
              {bookPages.length} interactive pages
            </p>
            <h2 id="chapters-title" className="mt-3 font-display text-4xl font-medium tracking-tight text-ink sm:text-5xl">
              Enter where your curiosity begins.
            </h2>
            <p className="mt-5 leading-7 text-midnight-700">
              Read in sequence or open one subject directly. Every card now
              leads to its exact place in the book.
            </p>
          </div>
          <Link
            className="inline-flex min-h-12 items-center rounded-full bg-laterite-700 px-6 py-3 text-sm font-bold text-ivory transition hover:bg-laterite-600"
            href="/ebook#chhau"
          >
            Open the full eBook
          </Link>
        </div>

        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bookParts.map((part) => (
            <li key={part.id}>
              <Link
                className="group block h-full rounded-xl border border-laterite-900/10 bg-white p-5 transition hover:-translate-y-0.5 hover:border-laterite-400 hover:shadow-md"
                href={`/ebook#${part.id}`}
              >
                <span className="text-xs font-extrabold tracking-[0.12em] text-marigold-700 uppercase">
                  {part.label}
                </span>
                <span className="mt-2 block font-display text-xl font-medium text-ink group-hover:text-laterite-800">
                  {part.title}
                </span>
                {part.description ? (
                  <span className="mt-3 block text-sm leading-6 text-midnight-700">
                    {part.description}
                  </span>
                ) : null}
                <span className="mt-5 inline-block text-xs font-bold text-laterite-700">
                  Open this part →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="purpose-title" className="bg-ink text-ivory">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 sm:py-24 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-xs font-extrabold tracking-[0.18em] text-marigold-300 uppercase">
              What I am trying to do
            </p>
            <h2 id="purpose-title" className="mt-3 font-display text-4xl font-medium tracking-tight sm:text-5xl">
              Make the first step clearer—not claim the last word.
            </h2>
          </div>
          <div className="space-y-5 text-base leading-8 text-ivory/70">
            <p>
              A screen cannot replace a dancer, guru, musician, maker, or live
              performance. It can connect the body, sound, history, story, and
              place so a new reader knows what to notice and where to look next.
            </p>
            <p>
              That is why sources remain visible, uncertainty stays visible,
              and every planned 3D study waits for movement, credit, permission,
              and practitioner review before publication.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link className="font-bold text-marigold-300 underline decoration-marigold-500/50 underline-offset-4 hover:text-marigold-200" href="/ebook#credits-review-status">
                See the review status
              </Link>
              <Link className="font-bold text-ivory underline decoration-ivory/30 underline-offset-4 hover:text-marigold-200" href="/experience">
                See the 3D study roadmap
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
