# PreserveChhau

PreserveChhau publishes **The Science of Chhau Dance**, Arnav Ajana’s
student-led, source-linked interactive eBook. It introduces three related dance
and dance-theatre traditions from eastern India. Arnav enters through
Mayurbhanj Chhau and keeps Mayurbhanj, Seraikella, and Purulia connected without
treating them as interchangeable.

This repository contains a working manuscript and application. Arnav formed
the project idea and supplied or assembled the first research corpus. His
personal story, judgement, and creative direction guide the work. AI supported
drafting and code under his direction. Source rights stay with their authors
and publishers.

An editorial release still requires a final author pass, practitioner
consultation, source checks, permissions review, pediatric movement and safety
review, and approval of cultural models.

## Quick start on a Mac

Double-click `Start-PreserveChhau.command`. The launcher checks Node.js,
installs the exact packages from `package-lock.json` when needed, then starts
the site at <http://localhost:3000>.

If macOS blocks the first launch, open Terminal in this folder and run:

```bash
bash Start-PreserveChhau.command
```

The package install matters. Running `npm run dev` before `npm ci` produces a
`vite: command not found` error because downloaded project archives do not
include `node_modules`.

## What is included

- `/`: a focused opening with three primary routes and six question-led paths
- `/about`: Arnav’s full project story, position, and working method
- `/ebook`: **The Science of Chhau Dance**, a responsive 76-screen reader with a wide-screen two-page spread,
  a broad one-page mode, 12 chapters, source links, a 14-record atlas with 10
  documented performance venues,
  unvalidated adult-guided activity drafts, deep links, searchable contents,
  17 load-on-demand recovered 3D prototypes spread across eight relevant
  pages, model-specific descriptions beside each viewer, and placeholders for
  planned source-based 3D studies
- `/experience`: the 23-model production roadmap, grouped by release priority
  and written for review
- `map-of-chhau/`: maintainable React and Vite source for the interactive globe,
  including local public-domain country geometry
- `public/map-of-chhau/`: an ignored deployment bundle rebuilt from the atlas
  source before development, verification, and production builds
- `src/components/ChhauModelViewer.tsx`: the reusable GLB study sandbox with
  skeleton-safe animation, clip selection, pause/scrub, playback speed, camera,
  appearance, lighting, zoom, reset, and fullscreen controls
- `CHHAU_AUDIO_ACQUISITION.md`: region-specific instrument lists, exact archive
  leads, rights decisions, and a clean original-recording brief
- `LEGACY_3D_ASSET_AUDIT.md`: technical and editorial review of all 17 recovered
  GLBs, their current page allocation, and the limits on what they represent

The recovered GLBs appear only as generic visual prototypes. Each file loads
after the reader chooses it. A description beside the viewer identifies the
visible digital form, suggests a limited observation task, and states what the
mesh does not document.

## Run locally

Use Node.js `22.12` or newer. Node `20.19` is the minimum supported version. The
repository includes `.nvmrc` for compatible Node version managers.

```bash
git clone https://github.com/ArnavAjana/PreserveChhau.git
cd PreserveChhau
npm ci
npm run dev
```

Open <http://localhost:3000>. Local use needs no environment file. For
deployment, create `.env.local` and set `NEXT_PUBLIC_SITE_URL` to the public
origin. This keeps sitemap and robots URLs correct.

The `predev` hook runs `npm run build:content`. It refreshes the eBook pages and
globe bundle before Next.js starts. Open the globe directly at
<http://localhost:3000/map-of-chhau/index.html>.

## Verification and production

```bash
npm run build:content
npm run verify
npm run build
npm run start
```

`npm run build:content` rebuilds the book data and globe bundle. `npm run verify`
rebuilds both, runs strict TypeScript checks, and lints the authored tree.
`npm run build` rebuilds both outputs before creating the production app.

## eBook content workflow

`Chhau_eBook_Content.md` is the canonical manuscript. Each screen begins with a
`BOOK_PAGE` metadata marker. Do not hand-edit the generated body text in
`src/content/book-pages.ts`.

```bash
npm run build:book
```

The generator validates the manuscript and rebuilds all 76 runtime pages. Page
metadata supports:

- `embedUrl`, `embedTitle`, and `embedCaption`: local interactive embed
- `interactive: "sandbox-guide"`: text guide for the reviewed 3D controls
- `modelOptions`: selectable published GLB studies, with a visible label and URL
- `plannedModels`: planned filenames shown as preparation cards until a real
  asset passes practitioner review, rights clearance, approval, and deliberate
  binding

## Interactive globe workflow

`map-of-chhau/` holds the standalone source application. Edit React components,
styles, node data, and `public/` source assets there. Do not hand-edit the
ignored output in `public/map-of-chhau/`.

```bash
npm run build:map
```

Vite copies `map-of-chhau/public/data/countries.geojson` beside a deployable
`index.html` and hashed CSS/JavaScript bundle in `public/map-of-chhau/`. Next.js
serves the generated output inside the eBook iframe or as a full-screen page.
The globe uses a code-authored background and does not request remote map tiles,
background images, Wikipedia, or Wikimedia Commons media.

To refresh both authored outputs in their required order, run:

```bash
npm run build:content
```

This command runs before `npm run dev`, before `npm run build`, and during
`npm run verify`.

## 3D asset workflow

Read `CHHAU_3D_MODEL_ASSET_REQUEST.md` before adding models. Approved web-ready
files go in:

```text
public/models/chhau-approved/
```

Every model needs a sidecar credit and review record covering its
lineage, movement or character, modeller, reference performer, practitioner
reviewer, maker or troupe, source material, permission, licence, and required
credit line. A matching filename alone is not approval.

The viewer supports Draco-compressed geometry and KTX2 textures through local
files in `public/draco/` and `public/basis/`. It does not fetch decoders from a
third-party CDN.

The original upload’s 17 generated prototype GLBs are restored under
`public/models/chhau-web-assets/`. They occupy roughly 510 MB and contain no
animation clips. The eBook distributes them across eight relevant non-regional
study pages, labels every option as a prototype, describes each model beside
its sandbox, and loads one file only after the reader requests it.
They do not replace the planned source-based studies in
`CHHAU_3D_MODEL_ASSET_REQUEST.md`.

## Rights and provenance

No broad project licence has been selected. GitHub’s Terms of Service permit
viewing and forking on GitHub. They do not grant general reproduction,
distribution, or derivative rights. Default copyright rules apply. All rights
are reserved where a rights holder is established. Reuse is not granted where
ownership remains undetermined.
[GitHub’s official licensing guidance](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository)
explains this distinction.

The current public build includes the author photograph supplied by Arnav Ajana
for the About Me and author sections. Its photographer was not identified in
the supplied record, no general reuse licence is granted, and its exact hash and
permission scope are recorded in `ASSET_RIGHTS_PROVENANCE.json`. The two audio
files and atlas starfield remain omitted because their creator, source,
permission, and reuse records were incomplete. The atlas performs no Wikimedia
Commons image lookup. The eight formerly referenced attribution-required
Commons files are recorded individually as not distributed. Retained Draco and
Basis decoder files, plus the public-domain Natural Earth geometry, have exact
package-version, source, modification, hash, and licence records in
`ASSET_RIGHTS_PROVENANCE.json`. See
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
public/models/chhau-web-assets/   recovered generic visual prototypes
```

## Stack

- Next.js 16 and React 19
- Motion for restrained, reduced-motion-aware interface transitions
- TypeScript 5 in strict mode
- Tailwind CSS 4
- Three.js, React Three Fiber, and Drei
- Vite and react-globe.gl for the standalone atlas
- npm with a committed lockfile for reproducible installs

The repository does not commit dependencies, framework output, compiled globe
bundles, raw production masters, unknown model files, or duplicate assets. The
maintained source reproduces every runtime output.
