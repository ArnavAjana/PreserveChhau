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

The public dataset contains 14 verified records. Three mark eastern Indian
heartland anchors. One marks the venue of UNESCO's 2010 inscription decision.
Ten mark named performance venues supported by a Chhau-specific venue,
institution, performer, event, or post-event record. Every record includes its
evidence type, source title, source URL, record date, verification date, and the
basis of any venue, campus, or town-level map point.

The venue layer is called `Documented Performance Venues`. It is not presented
as a complete world performance history. Three parallel research passes covered
India, Europe and the Americas, and Asia-Pacific, Africa, and the Middle East.
Only records naming both Chhau and a specific venue entered the map. A tour
country, city, festival, university, workshop, training activity, or generic
Indian-arts programme did not qualify by itself. The full acceptance and
exclusion record is in `VENUE_RESEARCH_REGISTER.md`.

The Nairobi marker records a committee decision venue, not a Chhau performance
or resident tradition. The Baripada marker uses Mayurbhanj's district
headquarters only as a map anchor and makes no origin claim. Kharsawan, Bamnia,
Palma, and generic international arts or diaspora locations stay unpublished.
Their previous entries did not meet this standard.

### Primary source register

- [UNESCO fifth-session record](https://ich.unesco.org/en/5com) and the
  [UNESCO Chhau element record](https://ich.unesco.org/en/RL/chhau-dance-00337)
- [Purulia District Administration: Folk & Culture](https://purulia.gov.in/folk-culture/)
- [Seraikela-Kharsawan District Administration: Culture & Heritage](https://seraikela.nic.in/culture-heritage/)
- [Mayurbhanj District Administration: Culture & Heritage](https://mayurbhanj.odisha.gov.in/en/tourism/culture-Heritage)
  and its [district-headquarters record](https://mayurbhanj.odisha.gov.in/en)
- [Trinetra Chhau Dance Centre: biography of Gopal Prasad Dubey](https://trinetrachhaudancecentre.org/biography/Bio_1)
- [Free Press Journal: Chhau Porbo-2 at Ravindra Natya Mandir](https://www.freepressjournal.in/mumbai/purulia-chhau-dancers-mesmerise-mumbai-as-vibgyor-unveils-2026-calendar-at-chhau-porbo-2)
- [Patna Press: VIRASAT 2025 at Nalanda University](https://patnapress.com/bihar-nalanda-university-purulia-chhau-virasat-2025/)
- [The New Indian Express: Naatki 2026 at Rabindra Mandap](https://www.newindianexpress.com/states/odisha/2026/Jul/13/national-mayurbhanj-chhau-fest-enthrals-bhubaneswar-audience)
- [IEEE event record: Purulia Chhau at KS Auditorium](https://events.vtools.ieee.org/m/369030)
- [The Times of India: Chhau at MICA's auditorium](https://timesofindia.indiatimes.com/city/ahmedabad/chhau-performance-enthralls-all-at-mica/articleshow/5039934.cms)
- [Delhi-Fun-Dos: Hare Rama at Triveni Amphitheatre](https://delhi-fun-dos.com/events/magic-of-chhau-dance-at-triveni-kala-sangam-hare-rama/)

The record-level `verifiedAt` value is `2026-07-16`.

`public/data/countries.geojson` is derived from the Natural Earth 1:110m Admin
0 country dataset distributed in the `three-globe@2.45.2` country-polygons
example. The local transformation retained each feature's type, `ADMIN`
property, and geometry. It removed other properties and serialized compact JSON
with a final newline. Natural Earth places its map data in the public domain. The
exact source/distribution versions, hashes, transformation, and terms URL are
recorded in the root `ASSET_RIGHTS_PROVENANCE.json`. Detail cards use text only.
The atlas performs no Wikipedia, Wikimedia Commons, or other remote image
lookup.
