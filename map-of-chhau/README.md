# Map of Chhau source

This is the maintainable source for Arnav's original interactive world globe.
The eBook embeds the generated build at `/map-of-chhau/index.html`.

## Commands

- `npm run build:map` rebuilds only the globe.
- `npm run build:content` regenerates the eBook pages and rebuilds the globe.
- `npm run dev` and `npm run build` run `build:content` automatically.

The Vite build clears only the generated `public/map-of-chhau/index.html` and
`public/map-of-chhau/assets/` bundle. It deliberately preserves the single
runtime copies of `data/countries.geojson` and `images/night-sky.png`.

## Data and publication status

The three Chhau heartlands are the atlas's anchors. Wider stage, archive,
institution, and diaspora nodes are research leads; they must not be presented
as proof of a resident Chhau tradition until each entry has a publishable
source. The interface labels that distinction visibly.

`countries.geojson` is the Natural Earth 1:110m Admin 0 example dataset retained
from the original globe's dependency tree. Natural Earth data is public domain.
`night-sky.png` is the starfield retained from the original `three-globe`
example used by the project; confirm its asset-level publication terms before a
formal public release.

Remote Wikimedia reference images are optional. When a request fails, the map
falls back to a text card so the atlas remains usable.
