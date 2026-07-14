import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-laterite-900/10 bg-ink text-ivory/70">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:grid-cols-3">
        <div>
          <p className="font-display text-lg font-semibold text-ivory">
            Preserve<span className="text-marigold-400">Chhau</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed">
            A student’s attempt to make the first encounter with Chhau clearer
            and more connected while working toward complete credit.
          </p>
        </div>

        <nav aria-label="Footer navigation">
          <p className="text-sm font-semibold tracking-wide text-ivory uppercase">
            Explore
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/ebook#about-me" className="rounded-sm hover:text-marigold-300">
                Read the eBook
              </Link>
            </li>
            <li>
              <Link href="/experience" className="rounded-sm hover:text-marigold-300">
                3D study roadmap
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <p className="text-sm font-semibold tracking-wide text-ivory uppercase">
            Heritage
          </p>
          <p className="mt-3 text-sm leading-relaxed">
            Chhau was inscribed on UNESCO’s Representative List of the
            Intangible Cultural Heritage of Humanity in 2010. This project
            keeps its three regional traditions distinct.
          </p>
        </div>
      </div>
      <div className="border-t border-ivory/10 px-6 py-5 text-center text-xs text-ivory/45">
        Project concept, research assembly, personal narrative, and creative
        direction by Arnav Ajana. Rights in the assembled sources remain with
        their authors and publishers. Drafting and technical implementation were
        AI-assisted under his direction. Practitioners and communities remain
        the authorities on their own traditions.
      </div>
    </footer>
  );
}
