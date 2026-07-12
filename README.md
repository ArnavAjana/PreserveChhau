# PreserveChhau

A platform celebrating Chhau dance — the masked martial dance of eastern
India, inscribed on UNESCO's Representative List of the Intangible Cultural
Heritage of Humanity in 2010 — built around the interactive eBook *Chhau*,
researched and written by Arnav Ajana.

## What's inside

- **Landing experience** (`/`) — an introduction to Chhau, the three
  traditions, and the preservation mission
- **The Interactive eBook** (`/ebook`) — the full 44-page book in an
  immersive reader: heritage-paper pages, page-turn animations, a chapter
  sidebar, theme music, clickable citations that jump to the source
  library, and 3D sandboxes embedded beside the chapters they illustrate
- **3D Model Gallery** (`/experience`) — every GLB figure from the book in
  one viewer, with shading modes (clay, wireframe, sketch, hologram…),
  lighting presets, and fullscreen

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| UI | React 19 |
| 3D | Three.js + React Three Fiber + Drei |
| Styling | Tailwind CSS 4 |
| Language | TypeScript 5 (strict) |

## Commands

```bash
npm install
npm run dev      # development server on http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint     # ESLint
```

## Architecture notes

- `src/content/book-pages.ts` — the book itself: every page's text, type
  (cover / section / content), 3D model bindings, and appearance. This is
  the single source of truth for `/ebook`, and the landing page derives
  its part overview from it. Inline `[N]` citations jump to the Library
  page, which closes with a "Sources Referred, Chapter by Chapter"
  bibliography recording each chapter's sources.
- Any page can opt into interactive layers through optional fields:
  `audioTracks` (rendered with the shared `PageAudioPlayer`), `gallery`
  (`PageMediaGallery`), `videoUrl`/`videoCaption` (`PageVideo`),
  `embedUrl`/`embedTitle`/`embedCaption` (`PageEmbed` — used for the Map
  of Chhau globe atlas served from `public/map-of-chhau/`), and
  `interactive: "sandbox-guide"` (the annotated 3D tour used on the
  How-to page).
- `src/components/InteractiveEbookInterface.tsx` — the reader.
- `src/components/ChauModelViewer.tsx` — the GLB viewer (shading modes,
  lighting rigs, camera controls); reused by both the reader and the
  gallery.
- `src/app/(site)/` — pages with the site header/footer chrome. The reader
  at `src/app/ebook/` deliberately renders without chrome and provides its
  own Home button.
- `public/models/chhau-web-assets/` — the 17 GLB figures referenced by the
  book. Note: files with `-copy` in the name are distinct models (different
  poses), not duplicates.
- `Chhau_eBook_Content.md` — the book's manuscript source.
- `Chau_Web_Assets/` — non-served source material (reference PDF, raw
  audio masters).

## Configuration

- Set `NEXT_PUBLIC_SITE_URL` in `.env.local` to the production URL so the
  sitemap and robots files emit correct absolute links.
- Site palette and fonts live in the `@theme` block of
  `src/app/globals.css`; the reader's heritage styles are in the same file
  under the "Interactive eBook reader" banner.

## Deployment

Deploy to [Vercel](https://vercel.com) for zero-config Next.js hosting, or
run `npm run build && npm start` on any Node.js 18+ host. The `public/`
model assets total ~535 MB — ensure your host serves large static files
(or move the GLBs to object storage/CDN and update the URLs in
`book-pages.ts`).
