# Map of Chhau source

This directory holds the maintained source for Arnav's interactive world globe.
The eBook embeds the generated build at `/map-of-chhau/index.html`.

## Commands

- `npm run build:map` rebuilds only the globe.
- `npm run build:content` regenerates the eBook pages and rebuilds the globe.
- `npm run dev` and `npm run build` run `build:content` automatically.

Source-controlled country geometry lives in this directory's `public/` folder.
Vite copies it beside a fresh HTML, CSS, and JavaScript bundle in the ignored
root-level `public/map-of-chhau/` output directory. CSS gradients draw the star
field. No background-image licence applies. Each development, verification,
and production build regenerates the output.

## Data and publication status

The public dataset contains four verified records. Three mark eastern Indian
heartland anchors. One marks the venue of UNESCO's 2010 inscription decision. Every
record includes its evidence type, source title, source URL, record date, and
verification date. The published map excludes unsourced stage, institution,
archive, and diaspora leads.

The source policy is narrow. Each public marker needs a Chhau-specific primary
record from UNESCO or a government cultural authority. The
Nairobi marker records a committee decision venue, not a resident Chhau
tradition. The Baripada marker uses Mayurbhanj's district headquarters only as
a map anchor and makes no origin claim. Kharsawan, Bamnia, Palma, and generic
international arts or diaspora locations stay unpublished. Their previous
entries did not meet this standard.

### Primary source register

- [UNESCO fifth-session record](https://ich.unesco.org/en/5com) and the
  [UNESCO Chhau element record](https://ich.unesco.org/en/RL/chhau-dance-00337)
- [Purulia District Administration: Folk & Culture](https://purulia.gov.in/folk-culture/)
- [Seraikela-Kharsawan District Administration: Culture & Heritage](https://seraikela.nic.in/culture-heritage/)
- [Mayurbhanj District Administration: Culture & Heritage](https://mayurbhanj.odisha.gov.in/en/tourism/culture-Heritage)
  and its [district-headquarters record](https://mayurbhanj.odisha.gov.in/en)

The record-level `verifiedAt` value is `2026-07-14`.

`public/data/countries.geojson` is derived from the Natural Earth 1:110m Admin
0 country dataset distributed in the `three-globe@2.45.2` country-polygons
example. The local transformation retained each feature's type, `ADMIN`
property, and geometry. It removed other properties and serialized compact JSON
with a final newline. Natural Earth places its map data in the public domain. The
exact source/distribution versions, hashes, transformation, and terms URL are
recorded in the root `ASSET_RIGHTS_PROVENANCE.json`. Detail cards use text only.
The atlas performs no Wikipedia, Wikimedia Commons, or other remote image
lookup.
