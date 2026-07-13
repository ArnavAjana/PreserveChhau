# Map of Chhau source

This is the maintainable source for Arnav's original interactive world globe.
The eBook embeds the generated build at `/map-of-chhau/index.html`.

## Commands

- `npm run build:map` rebuilds only the globe.
- `npm run build:content` regenerates the eBook pages and rebuilds the globe.
- `npm run dev` and `npm run build` run `build:content` automatically.

The source-controlled country geometry and starfield live in this directory's
`public/` folder. Vite copies them alongside a fresh HTML/CSS/JavaScript bundle
in the ignored root-level `public/map-of-chhau/` output directory. That output
is regenerated before local development, verification, and production builds.

## Data and publication status

The three Chhau heartlands are the atlas's anchors. Wider stage, archive,
institution, and diaspora nodes are research leads; they must not be presented
as proof of a resident Chhau tradition until each entry has a publishable
source. The interface labels that distinction visibly.

`public/data/countries.geojson` is the Natural Earth 1:110m Admin 0 example
dataset retained from the original globe's dependency tree. Natural Earth data
is public domain. `public/images/night-sky.png` is the starfield retained from
the original `three-globe` example used by the project; confirm its asset-level
publication terms before a formal public release.

Remote Wikimedia reference images are optional. When a request fails, the map
falls back to a text card so the atlas remains usable.
