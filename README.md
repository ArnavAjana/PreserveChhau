# PreserveChhau

PreserveChhau is Arnav Ajana’s student-led interactive eBook about Chhau: a
family of three related dance and dance-theatre traditions from eastern India.
The project begins with Arnav’s own entry through Mayurbhanj Chhau, then keeps
Mayurbhanj, Seraikella, and Purulia connected without treating them as
interchangeable.

The complete working manuscript and technical implementation were developed
through an AI-assisted process under Arnav’s direction. Arnav owns the project
concept, initial research corpus, personal narrative, judgement, and creative
direction. A final line-by-line authorial pass, practitioner consultation,
source checking, permissions review, and cultural-model approval are required
before public release.

## What is included

- `/` — an Arnav-first introduction and direct links into every section
- `/ebook` — a responsive 76-screen reader containing 12 chapters, source
  links, audio, Arnav’s restored 48-node world globe, safe learning prompts,
  deep links, searchable contents, and honest placeholders for planned 3D
  studies
- `/experience` — the complete 23-model production roadmap, grouped by release
  priority and written for human review rather than as a raw file list
- `map-of-chhau/` — the maintainable React/Vite source for Arnav’s interactive
  globe, including its local country geometry and starfield source assets
- `public/map-of-chhau/` — an ignored deployment bundle regenerated from that
  source before development, verification, and production builds
- `src/components/ChhauModelViewer.tsx` — the reusable GLB study sandbox with
  skeleton-safe animation, clip selection, pause/scrub, playback speed, camera,
  appearance, lighting, zoom, reset, and fullscreen controls

The viewer’s fallback object demonstrates the controls only. It is explicitly
not presented as a Chhau dancer, pose, mask, or costume.

## Run locally

Use Node.js **22.12 or newer** (recommended). Node 20.19 or newer is the minimum
supported version. The repository includes `.nvmrc` for compatible Node version
managers.

```bash
git clone https://github.com/ArnavAjana/PreserveChhau.git
cd PreserveChhau
npm ci
npm run dev
```

Open <http://localhost:3000>. No environment file is required for local use.
Create `.env.local` only for deployment, when `NEXT_PUBLIC_SITE_URL` should be
set to the real public origin for correct absolute sitemap and robots URLs.
The `predev` hook runs `npm run build:content`, so both the eBook pages and globe
bundle are refreshed before the Next.js development server starts. The globe
can also be opened directly at <http://localhost:3000/map-of-chhau/index.html>.

## Verification and production

```bash
npm run build:content
npm run verify
npm run build
npm run start
```

`npm run build:content` regenerates the book data and the globe deployment
bundle. `npm run verify` does the same, then runs strict TypeScript checking and
lints the full authored tree. `npm run build` also rebuilds both content outputs
before creating the production application.

## eBook content workflow

`Chhau_eBook_Content.md` is the canonical manuscript. Each screen begins with a
`BOOK_PAGE` metadata marker. Do not hand-edit the generated body text in
`src/content/book-pages.ts`.

```bash
npm run build:book
```

The generator validates the manuscript and rebuilds all 76 runtime pages. Page
metadata can opt into:

- `audioTracks` — shared audio player
- `embedUrl`, `embedTitle`, and `embedCaption` — local interactive embed
- `interactive: "sandbox-guide"` — the guided 3D controls preview
- `plannedModels` — reviewed model filenames that remain visible as preparation
  cards until a real asset is approved and deliberately bound

## Interactive globe workflow

`map-of-chhau/` is the standalone, maintainable source application for the
world globe. Edit its React components, styles, node dataset, or `public/`
source assets there; never hand-edit the ignored deployment output in
`public/map-of-chhau/`.

```bash
npm run build:map
```

Vite copies `map-of-chhau/public/data/countries.geojson` and
`map-of-chhau/public/images/night-sky.png` beside a deployable `index.html` and
hashed CSS/JavaScript bundle in `public/map-of-chhau/`. Next.js serves that
generated output inside the eBook iframe or as a full-screen page. The core
globe therefore does not depend on a remote map tile or background service.
Optional reference thumbnails may be requested from Wikimedia/Wikipedia after
a node is selected; the text card and globe remain usable when those images are
unavailable.

To refresh both authored outputs in their required order, run:

```bash
npm run build:content
```

This is also run automatically before `npm run dev`, `npm run build`, and as
part of `npm run verify`.

## 3D asset workflow

Read `CHHAU_3D_MODEL_ASSET_REQUEST.md` before adding models. Approved web-ready
files go in:

```text
public/models/chhau-approved/
```

Every model must arrive with a sidecar credit and review record covering its
lineage, movement or character, modeller, reference performer, practitioner
reviewer, maker or troupe, source material, permission, licence, and required
credit line. A matching filename alone is not approval.

The viewer supports Draco-compressed geometry and KTX2 textures through local
files in `public/draco/` and `public/basis/`; it does not fetch decoders from a
third-party CDN.

The original upload’s 17 uncredited prototype GLBs were removed from the
current repository. They occupied roughly 510 MB, contained no animation clips,
and lacked the lineage, performer, maker, source, permission, and review records
required for this project.

## Project structure

```text
Chhau_eBook_Content.md             canonical manuscript
CHHAU_3D_MODEL_ASSET_REQUEST.md   model production and approval brief
scripts/build-book-pages.mjs      manuscript validator and generator
src/app/                          Next.js routes and global styles
src/components/                   reader, media, map embed, and 3D UI
src/content/book-pages.ts         generated runtime content
map-of-chhau/                     maintainable React/Vite globe source
map-of-chhau/public/              local globe source assets copied by Vite
public/audio/                     web audio used by the reader
public/map-of-chhau/              ignored, generated globe deployment output
public/draco/                     local Draco decoder
public/basis/                     local KTX2 transcoder
public/models/chhau-approved/     reviewed release models
```

## Stack

- Next.js 16 and React 19
- TypeScript 5 in strict mode
- Tailwind CSS 4
- Three.js, React Three Fiber, and Drei
- Vite and react-globe.gl for the standalone atlas
- npm with a committed lockfile for reproducible installs

The repository intentionally does not commit dependencies, framework output,
compiled globe bundles, raw production masters, unreviewed models, or duplicate
assets. All runtime outputs are reproducible from the maintained source.
