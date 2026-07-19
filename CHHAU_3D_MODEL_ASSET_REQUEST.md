# The Science of Chhau Dance: 3D Model Asset Request

This brief lists the models planned beside the text. Add approved files to:

`public/models/chhau-approved/`

Only optimised, approved GLBs should be served by the eBook. Keep raw Blender files, motion-capture takes, and uncompressed texture masters outside the deploy repository or in separate archival storage.

## What to supply first: P0

These nine packages are enough for the first coherent 3D release.

| Filename | Required subject and clips | Used beside |
| --- | --- | --- |
| `chhau-three-styles-lineup.glb` | Three proposed full-figure studies. Show unmasked Mayurbhanj, masked Seraikella, and masked Purulia. Complete regional verification before binding the file into the eBook. Use neutral comparison poses with clear front and side views. | Map and first look, Chapter 1 comparison |
| `mayurbhanj-core.glb` | One validated Mayurbhanj rig in verified practice clothing. Include a neutral pose and named clips for chauk hold, dharan weight shift, and chali entry. Keep each repertoire costume in a separate, clearly named skin or package linked to one piece. | Chapters 3 to 5 and beginner observation pages |
| `mayurbhanj-topkas.glb` | Same rig and costume. Separate clips for sada, lahara, dheu or dhew, uska, and baga or bog topka. A current Mayurbhanj guru must confirm the version first. | Movement Grammar |
| `seraikella-expression.glb` | One maker- or troupe-referenced Seraikella mask and costume. Show how lifted, lowered, turned, and paused body positions change the reading of one fixed mask. | Three-style comparison, mask-body expression |
| `purulia-masked-core.glb` | One maker-credited Purulia character with complete mask, headgear, costume, and secondary cloth motion. Include entrance, steady walk or chal, held stance, and mask-facing turn clips. | Three-style comparison, mask and costume chapters |
| `purulia-durga.glb` | Maker-credited Durga mask/costume/props. Validated address pose and one short phrase. | Repertoire and Purulia comparison |
| `purulia-mahishasura.glb` | Maker-credited Mahishasura mask/costume. Entrance, confrontation, and controlled fall timed to work with the Durga package. | Repertoire and performance lab |
| `mask-comparison.glb` | Separate, named Seraikella and Purulia masks shown from front, side, and back. Label Mayurbhanj as unmasked. Do not invent a mask. | Mask chapter |
| `instrument-pack.glb` | Individually named meshes for dhol, dhumsa or dhamsa, chadchadi or kadka or charchari, mahuri or mohuri, and shehnai or pepti. Keep regional variants separate instead of averaging them into one object. | Rhythm and Music |

## Second release: P1

| Filename | Required subject and clips | Used beside |
| --- | --- | --- |
| `mayurbhanj-uflis.glb` | A named Mayurbhanj practitioner must select and confirm three examples. Aim for one daily-life image, one nature or animal image, and one spatial phrase. Do not build from prose alone. | Nature, daily life, and bhangi |
| `mayurbhanj-chamka.glb` | Chest and shoulder accents against a visible beat marker. | Body and rhythm relationship |
| `mayurbhanj-repertoire.glb` | One short, authentic excerpt chosen and demonstrated by a practitioner. Prefer Mayur or Nataraja. Use the exact piece-specific costume and props. | Mayurbhanj performance lab |
| `seraikella-ratri.glb` | One verified passage from Ratri, with the exact mask and costume for the selected version. | Story and repertoire |
| `purulia-technique.glb` | Validated Purulia chal, pirkiti, chhok, and one ulfa with a controlled landing. Do not rename these as Mayurbhanj topka or dian. | Regional movement comparison |
| `purulia-ganesha.glb` | Exact Ganesha mask and costume. Use a grounded invocation entry. Add acrobatics only with practitioner-led motion reference. | Repertoire and festival context |
| `purulia-mask-layers.glb` | Exploded educational view of one Charida maker’s documented process: mould, paper/clay layers, reinforcement, paint, hair/fibre, wire halo, and decoration. | Mask making |
| `costume-comparison.glb` | Three turntable mannequins, one verified costume from each lineage. Every costume must be labelled as piece- or troupe-specific rather than universal. | Costume chapter |
| `prop-pack.glb` | Performance-referenced sword/shield pair, trident, bow, damaru, and flute. No generic fantasy weapons. | Props and character identification |
| `asar-akhada-diorama.glb` | Open arena, entry path, musicians, and spectator zones. Provide toggles or variants for documented Mayurbhanj, Seraikella, and Purulia layouts. | Festival, space, and community |

## Later depth: P2

| Filename | Required subject and clips | Why it waits |
| --- | --- | --- |
| `mayurbhanj-jumps.glb` | One guru-selected dumka and one dian with preparation, full landing, and slow-motion clip. | Watch-only movement requiring stronger motion and safety review |
| `seraikella-second-exemplar.glb` | Ardhanarishvara or Mayura, selected by the consultant. | Needs piece-specific iconography and mask review |
| `purulia-lion-vahana.glb` | Documented two-person lion costume and synchronised walk. | More complex rig and troupe-specific design |
| `group-formation-pack.glb` | Schematic line, circle, opposing groups, and central-character formation transitions. | Useful after the core figures and spatial chapter are approved |

## Technical delivery requirements

- GLB 2.0, metres, Y-up, floor origin between the feet.
- Embed or package textures reliably. Leave no missing external texture paths.
- One reusable rig per lineage. Give clips clear names such as `chauk_hold`, `dharan_shift`, and `chali_entry`.
- Supply both in-place and root-motion versions for travelling clips when possible.
- Separate named meshes for mask, headgear, costume layers, and props.
- Meshopt or Draco geometry compression and KTX2 textures.
- Target 4 to 10 MB per dressed character and under 2 to 3 MB per prop or instrument.
- Aim for 100,000 to 250,000 triangles per dressed web character unless a documented costume needs more.
- Avoid a baked floor on character files. Place the feet at Y=0.
- Include normal-speed and slow-motion clips for movement study.
- Keep masks and costume colours faithful to the specific maker, troupe, character, and reference used.
- For paired Durga and Mahishasura animation, use a shared origin, scale, facing direction, and 30 fps timebase. Matching confrontation clips must have identical durations and named event markers for approach, encounter, reaction, controlled fall, and resolution in the sidecar metadata.

The current viewer supports skeleton-safe cloning, named animation clips, play and pause, looping, timeline scrubbing, 0.25×, 0.5×, and 1× playback, camera presets, appearance modes, lighting presets, zoom, and fullscreen study. Draco-compressed geometry and KTX2 textures use local decoder files. The sandbox does not depend on a third-party CDN. The manuscript records each intended filename under `plannedModels`. A page remains an honest “3D study in preparation” card until its reviewed file is deliberately bound.

## Credit record required with every package

Alongside each GLB, add a JSON or Markdown sidecar with:

- model filename and version
- Chhau style and lineage
- character, pose, or movement name
- modeller
- reference dancer or performer
- guru/practitioner reviewer
- mask maker and village, when applicable
- troupe or institution
- musician(s), if motion was captured to live or recorded music
- location and date of the reference
- source photos/video and permission status
- licence and required credit line
- per-clip source, regional term, spelling, lineage, and version
- proposed child-safety tier pending specialist review: observation only, supervised exploration, or low-risk self-guided prompt
- contributor agreement and compensation status
- notes on any interpretive reconstruction

Do not treat the proposed tier as safety approval. A pediatric movement and
safety professional has not validated the age range or Chhau-specific guidance.

## Approval checklist

Before a model appears in the eBook, a current practitioner should confirm:

- transliteration and pronunciation
- stance, weight, and limb placement
- movement pathway and landing
- correct regional vocabulary
- mask angle and visibility
- costume, colour, ornament, and props
- instrument construction and playing position
- repertoire sequence and character identity
- whether the model is an authentic demonstration, a schematic study, or a clearly labelled reconstruction

The current repository includes the 17 generic prototype GLBs from the original
upload as load-on-demand interface studies. Their filenames do not identify
lineage, costume, character, pose, performer, or source. None contains animation
clips. Together they occupy roughly 510 MB. They are not reference material and
do not fill any model request in this brief. Source-based packages still need to
meet the requirements above.

The full technical and editorial decision record is in
`LEGACY_3D_ASSET_AUDIT.md`.
