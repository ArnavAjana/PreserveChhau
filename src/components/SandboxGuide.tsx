import Link from "next/link";

const guideItems = [
  {
    number: "01",
    title: "Turn the study",
    text: "Drag to rotate an approved model. Zoom stays deliberate so the page does not fight your scroll.",
  },
  {
    number: "02",
    title: "Hold one viewpoint",
    text: "Compare front, three-quarter, side, and back views from the same distance.",
  },
  {
    number: "03",
    title: "Separate surface from form",
    text: "Texture shows an approved surface. Clay shows mass. Structure reveals the model geometry.",
  },
  {
    number: "04",
    title: "Slow the movement",
    text: "Reviewed animated studies will name each clip and include pause, timeline, loop, and speed controls.",
  },
] as const;

export function SandboxGuide() {
  return (
    <section className="sandbox-guide" aria-labelledby="sandbox-guide-title">
      <header className="sandbox-guide-header">
        <div>
          <p className="reader-kicker text-laterite-700">First-use guide</p>
          <h2 id="sandbox-guide-title">How a 3D study will work.</h2>
        </div>
        <p>
          No cultural model loads on this page. The recovered legacy files stay
          outside the public eBook because their source, rights, regional
          identity, and practitioner review remain unresolved.
        </p>
      </header>

      <ol className="sandbox-guide-list">
        {guideItems.map((item) => (
          <li key={item.number}>
            <span>{item.number}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </li>
        ))}
      </ol>

      <div className="sandbox-guide-status">
        <p>
          A study appears only after its model, movement or object source,
          permissions, credits, and review record are complete.
        </p>
        <Link href="/experience">See the 23-study roadmap</Link>
      </div>
    </section>
  );
}
