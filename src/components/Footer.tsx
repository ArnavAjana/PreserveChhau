import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-laterite-900/10 bg-midnight-950 text-midnight-200">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:grid-cols-3">
        <div>
          <p className="font-display text-lg font-bold text-ivory">
            Preserve<span className="text-marigold-400">Chhau</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed">
            Honoring an ancient dance of eastern India through storytelling,
            scholarship, and modern technology.
          </p>
        </div>

        <nav aria-label="Footer navigation">
          <p className="text-sm font-semibold tracking-wide text-ivory uppercase">
            Explore
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/ebook" className="hover:text-marigold-300">
                Read the eBook
              </Link>
            </li>
            <li>
              <Link href="/experience" className="hover:text-marigold-300">
                3D Model Gallery
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <p className="text-sm font-semibold tracking-wide text-ivory uppercase">
            Heritage
          </p>
          <p className="mt-3 text-sm leading-relaxed">
            Chhau dance was inscribed on the UNESCO Representative List of the
            Intangible Cultural Heritage of Humanity in 2010.
          </p>
        </div>
      </div>
      <div className="border-t border-midnight-900 py-5 text-center text-xs text-midnight-400">
        eBook researched and written by Arnav Ajana. Built with respect for
        the dancers, drummers, and mask makers of the Chhau tradition.
      </div>
    </footer>
  );
}
