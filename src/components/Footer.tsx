import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-grid">
        <div>
          <p className="font-display text-lg font-semibold text-ivory">
            Preserve<span className="text-marigold-400">Chhau</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed">
            I built this student project to give first-time readers a clear,
            source-linked way into Chhau.
          </p>
        </div>

        <nav aria-label="Footer navigation">
          <p className="text-sm font-semibold tracking-wide text-ivory uppercase">
            Explore
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/about" className="rounded-sm hover:text-marigold-300">
                About Arnav
              </Link>
            </li>
            <li>
              <Link href="/ebook#chhau" className="rounded-sm hover:text-marigold-300">
                Read the eBook
              </Link>
            </li>
            <li>
              <Link href="/ebook#map-of-chhau" className="rounded-sm hover:text-marigold-300">
                Map of Chhau
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
            Intangible Cultural Heritage of Humanity in 2010. I keep its three
            regional traditions distinct throughout this project.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-ivory/55">
            Independent student project. This draft does not use the UNESCO
            emblem. UNESCO inscription does not endorse this project.
          </p>
        </div>
      </div>
      <div className="site-footer-notice">
        Arnav Ajana led the project concept, research assembly, personal
        narrative, and creative direction. AI supported drafting and technical
        implementation under his direction. Source rights stay with their
        authors and publishers. Practitioners and communities remain the
        authorities on their traditions.
      </div>
    </footer>
  );
}
