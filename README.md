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
  links, audio, a local regional map, safe learning prompts, deep links,
  searchable contents, and honest placeholders for planned 3D studies
- `/experience` — the complete 23-model production roadmap, grouped by release
  priority and written for human review rather than as a raw file list
- `public/map-of-chhau/` — a self-contained, accessible regional map with no
  runtime network dependency
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
cp .env.example .env.local
npm run dev
```

Open <http://localhost:3000>. `NEXT_PUBLIC_SITE_URL` is only needed for correct
absolute sitemap and robots URLs; change it in `.env.local` before deployment.

## Verification and production

```bash
npm run verify
npm run build
npm run start
```

`npm run verify` regenerates the book data, runs strict TypeScript checking,
and lints the full authored tree. `npm run build` also regenerates the book
before creating a production build.

## Content workflow

`Chhau_eBook_Content.md` is the canonical manuscript. Each screen begins with a
`BOOK_PAGE` metadata marker. Do not hand-edit the generated body text in
`src/content/book-pages.ts`.

```bash
npm run build:book
```

The generator validates the manuscript and rebuilds all 76 runtime pages. Page
metadata can opt into:

- `audioTracks` — shared audio player
- `gallery` — media gallery
- `videoUrl` and `videoCaption` — video study
- `embedUrl`, `embedTitle`, and `embedCaption` — local interactive embed
- `interactive: "sandbox-guide"` — the guided 3D controls preview
- `plannedModels` — reviewed model filenames that remain visible as preparation
  cards until a real asset is approved and deliberately bound

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

`public/models/chhau-web-assets/` contains 17 unique, uncredited prototype GLBs
from the original upload. They are not used by the application and are not part
of the release plan. They remain only to avoid destroying potentially useful
source work without a deliberate archival decision.

## Project structure

```text
Chhau_eBook_Content.md             canonical manuscript
CHHAU_3D_MODEL_ASSET_REQUEST.md   model production and approval brief
scripts/build-book-pages.mjs      manuscript validator and generator
src/app/                          Next.js routes and global styles
src/components/                   reader, media, map embed, and 3D UI
src/content/book-pages.ts         generated runtime content
public/audio/                     web audio used by the reader
public/map-of-chhau/              fully local interactive map
public/draco/                     local Draco decoder
public/basis/                     local KTX2 transcoder
public/models/chhau-approved/     reviewed release models
public/models/chhau-web-assets/   unbound legacy prototypes
```

## Stack

- Next.js 16 and React 19
- TypeScript 5 in strict mode
- Tailwind CSS 4
- Three.js, React Three Fiber, and Drei
- npm with a committed lockfile for reproducible installs

The repository intentionally does not commit `node_modules`, build output,
exploded package contents, or duplicate map/audio/source bundles.
