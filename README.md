# PreserveChhau

PreserveChhau is Arnav Ajana’s student-led interactive eBook about Chhau: a
family of three related dance and dance-theatre traditions from eastern India.
The project begins with Arnav’s own entry through Mayurbhanj Chhau, then keeps
Mayurbhanj, Seraikella, and Purulia connected without treating them as
interchangeable.

This public repository contains a working draft of the manuscript and technical
implementation, developed through an AI-assisted process under Arnav’s
direction. Arnav originated the project concept and supplied or assembled the
initial research corpus; the underlying rights in those sources remain with
their respective authors and publishers. His personal narrative, judgement,
and creative direction shape the project. A final line-by-line authorial pass,
practitioner consultation, source checking, permissions review, pediatric
movement/safety review, and cultural-model approval are required before an
editorially complete release.

## What is included

- `/` — an Arnav-first introduction and direct links into every section
- `/ebook` — a responsive 76-screen reader containing 12 chapters, source
  links, Arnav’s evidence-first four-record globe, unvalidated adult-guided
  activity drafts, deep links, searchable contents, and honest placeholders
  for planned 3D studies
- `/experience` — the complete 23-model production roadmap, grouped by release
  priority and written for human review rather than as a raw file list
- `map-of-chhau/` — the maintainable React/Vite source for Arnav’s interactive
  globe, including its local public-domain country geometry
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

- `embedUrl`, `embedTitle`, and `embedCaption` — local interactive embed
- `interactive: "sandbox-guide"` — the guided 3D controls preview
- `plannedModels` — planned model filenames that remain visible as preparation
  cards until a real asset is practitioner-reviewed, rights-cleared, approved,
  and deliberately bound

## Interactive globe workflow

`map-of-chhau/` is the standalone, maintainable source application for the
world globe. Edit its React components, styles, node dataset, or `public/`
source assets there; never hand-edit the ignored deployment output in
`public/map-of-chhau/`.

```bash
npm run build:map
```

Vite copies `map-of-chhau/public/data/countries.geojson` beside a deployable
`index.html` and hashed CSS/JavaScript bundle in `public/map-of-chhau/`. Next.js
serves that generated output inside the eBook iframe or as a full-screen page.
The globe uses a code-authored background and does not request remote map tiles,
background images, Wikipedia, or Wikimedia Commons media.

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

## Rights and provenance

No broad project licence has been selected. Public GitHub visibility allows
viewing and forking under GitHub’s Terms of Service, but it does not grant a
general right to reproduce, distribute, or create derivative works. Default
copyright rules apply; all rights are reserved where a rights holder is
established, and reuse is not granted where ownership remains undetermined.
[GitHub’s official licensing guidance](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository)
explains this distinction.

The current public build omits the two audio files, author photograph, and atlas
starfield that lacked complete creator, source, permission, and reuse records.
The atlas also performs no Wikimedia Commons image lookup; the eight formerly
referenced attribution-required Commons files are recorded individually as not
distributed. Retained Draco and Basis decoder files, plus the public-domain
Natural Earth geometry, have exact package-version, source, modification, hash,
and licence records in `ASSET_RIGHTS_PROVENANCE.json`. See
`THIRD_PARTY_NOTICES.md` and the complete local Apache 2.0 text in
`THIRD_PARTY_LICENSES/Apache-2.0.txt` before redistributing those components.

## Project structure

```text
Chhau_eBook_Content.md             canonical manuscript
CHHAU_3D_MODEL_ASSET_REQUEST.md   model production and approval brief
ASSET_RIGHTS_PROVENANCE.json      per-file rights, source, version, and hashes
THIRD_PARTY_NOTICES.md            third-party attribution and project status
THIRD_PARTY_LICENSES/             complete third-party licence texts
scripts/build-book-pages.mjs      manuscript validator and generator
src/app/                          Next.js routes and global styles
src/components/                   reader, media, map embed, and 3D UI
src/content/book-pages.ts         generated runtime content
map-of-chhau/                     maintainable React/Vite globe source
map-of-chhau/public/              local globe source assets copied by Vite
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
