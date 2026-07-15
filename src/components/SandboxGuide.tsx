import Link from "next/link";

const guideItems = [
  {
    number: "01",
    title: "Turn the study",
    text: "Drag to rotate a loaded model. Zoom stays deliberate so the page does not fight your scroll.",
  },
  {
    number: "02",
    title: "Hold one viewpoint",
    text: "Compare front, three-quarter, side, and back views from the same distance.",
  },
  {
    number: "03",
    title: "Separate surface from form",
    text: "Texture shows the generated surface. Clay shows mass. Structure reveals the model geometry.",
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
          No model loads on this page. Three pages in the eBook hold the
          recovered files as static generated prototypes. Each file loads only
          after you choose it.
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
          The current prototypes help test digital form and camera controls.
          They do not document Chhau. Source-based studies remain on the roadmap.
        </p>
        <Link href="/experience">See the 23-study roadmap</Link>
      </div>
    </section>
  );
}
