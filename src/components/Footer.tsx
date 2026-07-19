import Link from "next/link";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-grid">
        <div>
          <p className="font-display text-lg font-semibold text-ivory">
            The Science of Chhau Dance
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed">
            PreserveChhau · researched, written, and directed by Arnav Ajana.
            A source-linked student edition for first-time readers.
          </p>
        </div>

        <nav aria-label="Footer navigation">
          <p className="font-mono text-xs text-ivory/70">
            Edition index
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/about" className="hover:text-laterite-200">
                About Arnav
              </Link>
            </li>
            <li>
              <Link href="/ebook#chhau" className="hover:text-laterite-200">
                Read the book
              </Link>
            </li>
            <li>
              <Link href="/ebook#map-of-chhau" className="hover:text-laterite-200">
                Open the atlas
              </Link>
            </li>
            <li>
              <Link href="/experience" className="hover:text-laterite-200">
                3D study roadmap
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <p className="font-mono text-xs text-ivory/70">
            Scope note
          </p>
          <p className="mt-3 text-sm leading-relaxed">
            The book keeps Mayurbhanj, Seraikella, and Purulia distinct. Chhau
            was inscribed on UNESCO’s Representative List of the Intangible
            Cultural Heritage of Humanity in 2010.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-ivory/55">
            Independent student project. This draft does not use the UNESCO
            emblem. UNESCO inscription does not endorse this project.
          </p>
        </div>
      </div>
      <div className="site-footer-notice">
        Independent student research edition. Arnav Ajana led the concept,
        research assembly, personal narrative, and creative direction; AI
        supported drafting and technical implementation under his direction.
        Source rights stay with their authors and publishers. Practitioners and
        communities remain the authorities on their traditions.
      </div>
    </footer>
  );
}
