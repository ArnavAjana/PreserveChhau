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
            I learned Chhau for a performance, then returned to understand what
            the movement, rhythm, masks, and three regional traditions were
            actually asking me to see.
          </p>
        </div>

        <nav aria-label="Footer navigation">
          <p className="font-mono text-xs text-ivory/70">Continue</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/about" className="hover:text-laterite-200">
                How I found Chhau
              </Link>
            </li>
            <li>
              <Link href="/ebook#foreword" className="hover:text-laterite-200">
                Begin Part 1
              </Link>
            </li>
            <li>
              <Link href="/ebook#map-of-chhau" className="hover:text-laterite-200">
                Find the three traditions
              </Link>
            </li>
            <li>
              <Link href="/experience" className="hover:text-laterite-200">
                Movement and sound plan
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <p className="font-mono text-xs text-ivory/70">A necessary note</p>
          <p className="mt-3 text-sm leading-relaxed">
            I am a student and dancer, not a Chhau guru or historian.
            Practitioners, musicians, makers, troupes, researchers, and
            communities remain the authorities on their traditions.
          </p>
          <p className="mt-3 text-xs leading-relaxed text-ivory/55">
            Independent student project. The UNESCO inscription of Chhau does
            not imply UNESCO endorsement of this website.
          </p>
        </div>
      </div>
      <div className="site-footer-notice">
        Written and directed by Arnav Ajana. AI supported drafting and technical
        implementation, but the project must be reviewed, corrected, credited,
        and completed with the people whose knowledge it discusses. Source and
        media rights remain with their respective owners.
      </div>
    </footer>
  );
}
