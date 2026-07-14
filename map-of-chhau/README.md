# Map of Chhau source

This is the maintainable source for Arnav's original interactive world globe.
The eBook embeds the generated build at `/map-of-chhau/index.html`.

## Commands

- `npm run build:map` rebuilds only the globe.
- `npm run build:content` regenerates the eBook pages and rebuilds the globe.
- `npm run dev` and `npm run build` run `build:content` automatically.

The source-controlled country geometry lives in this directory's `public/`
folder. Vite copies it alongside a fresh HTML/CSS/JavaScript bundle in the
ignored root-level `public/map-of-chhau/` output directory. The star field is
made from CSS gradients, so the atlas has no background-image licence burden.
The output is regenerated before local development, verification, and
production builds.

## Data and publication status

The public dataset contains four verified records: three eastern-Indian
heartland anchors and the venue of UNESCO's 2010 inscription decision. Every
record includes its evidence type, source title, source URL, record date, and
verification date. Unsourced stage, institution, archive, and diaspora leads
are excluded from the published map.

The source policy is deliberately narrow: public markers require a Chhau-
specific primary record from UNESCO or a government cultural authority. The
Nairobi marker records a committee decision venue, not a resident Chhau
tradition. The Baripada marker uses Mayurbhanj's district headquarters only as
a map anchor and makes no origin claim. Kharsawan, Bamnia, Palma, and generic
international arts or diaspora locations are not published because the prior
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
example. This project retained each feature's type, `ADMIN` property, and
geometry, removed the other properties, and serialized compact JSON with a
final newline. Natural Earth places its map data in the public domain. The
exact source/distribution versions, hashes, transformation, and terms URL are
recorded in the root `ASSET_RIGHTS_PROVENANCE.json`. Detail cards are text-only:
the atlas performs no Wikipedia, Wikimedia Commons, or other remote image
lookup.
