# Third-party notices

This document records the third-party static components that PreserveChhau
redistributes directly. It is a notice file, not a licence for PreserveChhau as
a whole. Exact per-file hashes and provenance are recorded in
[`ASSET_RIGHTS_PROVENANCE.json`](ASSET_RIGHTS_PROVENANCE.json).

## Project licence status

No broad licence has been selected for the project’s original code, writing,
design, or other original material. Public visibility on GitHub allows people
to view and fork a repository under GitHub’s Terms of Service; it does not, by
itself, grant a general right to reproduce, distribute, or create derivative
works. GitHub’s official guidance explains that default copyright law applies
when a repository has no licence:

- <https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository>

All rights are reserved where a rights holder is established. Where authorship
or ownership is not yet confirmed, reuse permission is undetermined and is not
granted. The third-party components listed below remain governed by their own
licences.

## Draco glTF decoder

Bundled files:

- `public/draco/gltf/draco_decoder.js`
- `public/draco/gltf/draco_decoder.wasm`
- `public/draco/gltf/draco_wasm_wrapper.js`

Creator/project: Google Draco project contributors.

Provenance: the three files are unmodified, byte-for-byte copies from
`three@0.184.0`, under `examples/jsm/libs/draco/gltf/`. Their SHA-256 values
match the published npm package and are recorded in the asset manifest.

- Draco project: <https://github.com/google/draco>
- three.js r184 distribution directory: <https://github.com/mrdoob/three.js/tree/r184/examples/jsm/libs/draco/gltf>
- three.js r184 decoder notice: <https://github.com/mrdoob/three.js/blob/r184/examples/jsm/libs/draco/README.md>
- Published package: <https://www.npmjs.com/package/three/v/0.184.0>
- Upstream licence: <https://github.com/google/draco/blob/main/LICENSE>

Licence: Apache License 2.0. The complete licence text distributed with this
repository is [`THIRD_PARTY_LICENSES/Apache-2.0.txt`](THIRD_PARTY_LICENSES/Apache-2.0.txt).
The files have not been modified.

## Basis Universal transcoder

Bundled files:

- `public/basis/basis_transcoder.js`
- `public/basis/basis_transcoder.wasm`

Creator/project: Binomial LLC and Basis Universal contributors.

Copyright notice: Copyright © 2016–2026 Binomial LLC.

Provenance: both files are unmodified, byte-for-byte copies from
`three@0.184.0`, under `examples/jsm/libs/basis/`. Their SHA-256 values match
the published npm package and are recorded in the asset manifest.

- Basis Universal project: <https://github.com/BinomialLLC/basis_universal>
- three.js r184 distribution directory: <https://github.com/mrdoob/three.js/tree/r184/examples/jsm/libs/basis>
- three.js r184 transcoder notice: <https://github.com/mrdoob/three.js/blob/r184/examples/jsm/libs/basis/README.md>
- Published package: <https://www.npmjs.com/package/three/v/0.184.0>
- Upstream licence: <https://github.com/BinomialLLC/basis_universal/blob/master/LICENSE>

Licence: Apache License 2.0. The complete licence text distributed with this
repository is [`THIRD_PARTY_LICENSES/Apache-2.0.txt`](THIRD_PARTY_LICENSES/Apache-2.0.txt).
The files have not been modified. The repository also carries the upstream
attribution notice verbatim in
[`THIRD_PARTY_LICENSES/Basis-Universal-NOTICE.txt`](THIRD_PARTY_LICENSES/Basis-Universal-NOTICE.txt).

## Natural Earth country geometry

Bundled source file:

- `map-of-chhau/public/data/countries.geojson`

Generated deployment copy:

- `public/map-of-chhau/data/countries.geojson`

Dataset: Natural Earth 1:110m Admin 0 countries. Natural Earth states that its
vector and raster map data are in the public domain. The project obtained the
source bytes from the `three-globe@2.45.2` country-polygons example, retained
only each feature's type, `ADMIN` property, and geometry, and serialized the
result as compact JSON with a final newline. The source and transformed
SHA-256 values, npm integrity, and modification note are recorded in
`ASSET_RIGHTS_PROVENANCE.json`.

- Natural Earth dataset: <https://www.naturalearthdata.com/downloads/110m-cultural-vectors/110m-admin-0-countries/>
- Natural Earth terms: <https://www.naturalearthdata.com/about/terms-of-use/>
- Published package: <https://www.npmjs.com/package/three-globe/v/2.45.2>

## User-supplied author photographs

### Horse portrait

Bundled file: `public/images/arnav-ajana-about.jpg`

Subject and supplier: Arnav Ajana, the project owner and pictured subject.

Creator: Wahyu M.

Permission record: Arnav Ajana supplied the file and explicitly instructed the
project to publish it in the About Me and author sections on 14 July 2026. Its
use is limited to the PreserveChhau About Me and author-profile presentation.
The displayed credit is “Photograph by Wahyu M.” No standalone or
general reuse licence is granted. All rights are reserved.

### Movement photograph

Bundled file: `public/images/arnav-ajana-dance.png`

Arnav Ajana supplied the second photograph and explicitly instructed the
project to publish it in the About Me and author sections on 19 July 2026.
The photographer was not identified in the supplied record. No visible byline
is displayed at Arnav Ajana's request. Its use is limited to PreserveChhau, and
no standalone or general reuse licence is granted.

The exact hashes and permission records for both photographs are preserved in
`ASSET_RIGHTS_PROVENANCE.json`.

## Recovered generated 3D prototypes

Bundled directory:

- `public/models/chhau-web-assets/`

The directory contains 17 static GLB files recovered byte for byte from project
commit `27c346b7d6612360c84df56b5ab69d8d260ecb96`. The recovered project record
identifies them as Tripo-generated. It does not identify the operator, prompt,
training inputs, source pose, modeller, performer, maker, or a general reuse
licence.

Arnav Ajana directed their publication inside PreserveChhau on 15 July 2026.
The eBook presents them as generic visual prototypes and loads each file only
after a reader requests it. They are not evidence of a named Chhau movement,
regional tradition, costume, character, instrument, prop, troupe, formation,
or performance setting.

The exact path, size, SHA-256, Git blob SHA-1, publication instruction, reuse
status, cultural limit, and technical status are recorded in
`ASSET_RIGHTS_PROVENANCE.json`. No standalone or general reuse licence is
granted by this notice.

## Removed or withheld media

The following media is not part of the current public build because its rights
record was incomplete:

- two audio files whose creator, source, and publication permission were not
  documented;
- the atlas starfield, whose creator, source, and reuse terms were not
  documented.

The atlas no longer requests Wikipedia or Wikimedia Commons images. Therefore,
no Commons image is currently bundled or loaded by the application, and no
per-file Commons attribution is being implied by this notice.

For an explicit audit trail, these eight attribution-required Commons files
were formerly returned by the remote lookup and are now recorded as
**not distributed**:

| File | Creator | Licence |
| --- | --- | --- |
| [`Performance of Chhau dance of Purulia.jpg`](https://commons.wikimedia.org/wiki/File:Performance_of_Chhau_dance_of_Purulia.jpg) | Skasish | CC BY-SA 4.0 |
| [`Chhau Dance of Purulia, West bengal.jpg`](https://commons.wikimedia.org/wiki/File:Chhau_Dance_of_Purulia,_West_bengal.jpg) | Samar prasad | CC BY-SA 4.0 |
| [`Chhau Dancers of Purulia.jpg`](https://commons.wikimedia.org/wiki/File:Chhau_Dancers_of_Purulia.jpg) | Samar prasad | CC BY-SA 4.0 |
| [`Radha Khrisna in Seraikella Chhau Dance.jpg`](https://commons.wikimedia.org/wiki/File:Radha_Khrisna_in_Seraikella_Chhau_Dance.jpg) | Ramesh Lalwani | CC BY 2.0 |
| [`Chhau dancer from Jharkhand.jpg`](https://commons.wikimedia.org/wiki/File:Chhau_dancer_from_Jharkhand.jpg) | Anupmahato | CC BY-SA 4.0 |
| [`Mayurbhanj Chhau.jpg`](https://commons.wikimedia.org/wiki/File:Mayurbhanj_Chhau.jpg) | Ramesh Lalwani | CC BY 2.0 |
| [`Chhau - The Dance of the Masks 01.jpg`](https://commons.wikimedia.org/wiki/File:Chhau_-_The_Dance_of_the_Masks_01.jpg) | Bharath chandra badavath | CC BY-SA 4.0 |
| [`The Esplanade – Theatres on the Bay.jpg`](https://commons.wikimedia.org/wiki/File:The_Esplanade_%E2%80%93_Theatres_on_the_Bay.jpg) | William Cho | CC BY-SA 2.0 |

Their individual source-page and licence URLs are preserved in
`ASSET_RIGHTS_PROVENANCE.json`. They must not be restored through a generic
Wikipedia thumbnail endpoint: any future use requires a deliberate per-file
credit, licence link, and compliance review.

## Installed JavaScript dependencies

Packages installed through npm remain governed by the licence metadata and
licence files in their respective distributions. `package-lock.json` pins the
resolved package versions and integrity values. Those dependency licences do
not grant a licence for PreserveChhau original material.

The interface imports `motion@12.42.2`. Its React entrypoint includes
`framer-motion@12.42.2`, `motion-dom@12.42.2`, and `motion-utils@12.39.0`.
These packages are published by the Motion project under the MIT licence.
The copyright notices and complete licence texts distributed with this project
are in `THIRD_PARTY_LICENSES/Motion-MIT.txt` and
`THIRD_PARTY_LICENSES/Framer-Motion-MIT.txt`.
