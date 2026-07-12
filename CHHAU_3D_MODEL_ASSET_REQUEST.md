# Chhau eBook — 3D Model Asset Request

This is the production request for the models that will sit beside the rewritten text. Add approved files to:

`public/models/chhau-approved/`

Only optimised, approved GLBs should be served by the eBook. Keep raw Blender files, motion-capture takes, and uncompressed texture masters outside the deploy repository or in separate archival storage.

## What to supply first — P0

These nine packages are enough for the first coherent 3D release.

| Filename | Required subject and clips | Used beside |
| --- | --- | --- |
| `chhau-three-styles-lineup.glb` | Three accurately labelled full figures: unmasked Mayurbhanj, masked Seraikella, masked Purulia. Neutral comparison poses; front/side readability matters more than drama. | Map/first look; Chapter 1 comparison |
| `mayurbhanj-core.glb` | One validated Mayurbhanj rig in verified practice clothing. Neutral pose plus named clips for **chauk hold**, **dharan weight shift**, and **chali entry**. Any repertoire costume must be a separate, clearly named skin or package tied to a specific piece. | Chapters 3–5 and beginner observation pages |
| `mayurbhanj-topkas.glb` | Same rig and costume. Separate clips for **sada**, **lahara**, **dheu/dhew**, **uska**, and **baga/bog topka**, only after a current Mayurbhanj guru confirms the version. | Movement Grammar |
| `seraikella-expression.glb` | One maker- or troupe-referenced Seraikella mask and costume. Show the same fixed mask read through lifted, lowered, turned, and paused body arrangements. | Three-style comparison; mask-body expression |
| `purulia-masked-core.glb` | One maker-credited Purulia character with complete mask, headgear, costume, and secondary cloth motion. Clips: entrance, steady walk/chal, held stance, and mask-facing turn. | Three-style comparison; mask and costume chapters |
| `purulia-durga.glb` | Maker-credited Durga mask/costume/props. Validated address pose and one short phrase. | Repertoire and Purulia comparison |
| `purulia-mahishasura.glb` | Maker-credited Mahishasura mask/costume. Entrance, confrontation, and controlled fall timed to work with the Durga package. | Repertoire and performance lab |
| `mask-comparison.glb` | Separate, named Seraikella and Purulia masks shown from front, side, and back. Mayurbhanj must be labelled **unmasked**, not given an invented mask. | Mask chapter |
| `instrument-pack.glb` | Individually named meshes for **dhol**, **dhumsa/dhamsa**, **chadchadi/kadka/charchari**, **mahuri/mohuri**, and **shehnai/pepti**. Regional variants must stay separate rather than being averaged into one object. | Rhythm and Music |

## Second release — P1

| Filename | Required subject and clips | Used beside |
| --- | --- | --- |
| `mayurbhanj-uflis.glb` | Three practitioner-selected examples—ideally one daily-life image, one nature/animal image, and one spatial phrase. Do not build from prose alone. | Nature, daily life, and bhangi |
| `mayurbhanj-chamka.glb` | Chest and shoulder accents against a visible beat marker. | Body and rhythm relationship |
| `mayurbhanj-repertoire.glb` | One short, authentic excerpt chosen and demonstrated by a practitioner—preferably *Mayur* or *Nataraja*. Exact piece-specific costume and props. | Mayurbhanj performance lab |
| `seraikella-ratri.glb` | One verified passage from *Ratri*, with the exact mask and costume for that version. | Story and repertoire |
| `purulia-technique.glb` | Validated Purulia chal, pirkiti, chhok, and one ulfa with a controlled landing. Do not rename these as Mayurbhanj topka or dian. | Regional movement comparison |
| `purulia-ganesha.glb` | Exact Ganesha mask and costume; grounded invocation entry. Add any acrobatics only with practitioner-led motion reference. | Repertoire and festival context |
| `purulia-mask-layers.glb` | Exploded educational view of one Charida maker’s documented process: mould, paper/clay layers, reinforcement, paint, hair/fibre, wire halo, and decoration. | Mask making |
| `costume-comparison.glb` | Three turntable mannequins, one verified costume from each lineage. Every costume must be labelled as piece- or troupe-specific rather than universal. | Costume chapter |
| `prop-pack.glb` | Performance-referenced sword/shield pair, trident, bow, damaru, and flute. No generic fantasy weapons. | Props and character identification |
| `asar-akhada-diorama.glb` | Open arena, entry path, musicians, and spectator zones. Provide toggles or variants for documented Mayurbhanj, Seraikella, and Purulia layouts. | Festival, space, and community |

## Later depth — P2

| Filename | Required subject and clips | Why it waits |
| --- | --- | --- |
| `mayurbhanj-jumps.glb` | One guru-selected dumka and one dian with preparation, full landing, and slow-motion clip. | Watch-only movement requiring stronger motion and safety review |
| `seraikella-second-exemplar.glb` | *Ardhanarishvara* or *Mayura*, selected by the consultant. | Needs piece-specific iconography and mask review |
| `purulia-lion-vahana.glb` | Documented two-person lion costume and synchronised walk. | More complex rig and troupe-specific design |
| `group-formation-pack.glb` | Schematic line, circle, opposing groups, and central-character formation transitions. | Useful after the core figures and spatial chapter are approved |

## Technical delivery requirements

- GLB 2.0, metres, Y-up, floor origin between the feet.
- Embedded or reliably packaged textures; no missing external texture paths.
- One reusable rig per lineage. Give clips clear names such as `chauk_hold`, `dharan_shift`, and `chali_entry`.
- Supply both in-place and root-motion versions for travelling clips when possible.
- Separate named meshes for mask, headgear, costume layers, and props.
- Meshopt or Draco geometry compression and KTX2 textures.
- Target roughly **4–10 MB per dressed character** and **under 2–3 MB per prop or instrument**.
- Aim for roughly **100,000–250,000 triangles** per dressed web character unless a documented costume genuinely requires more.
- Avoid a baked floor on character files; place the feet at Y=0.
- Include normal-speed and slow-motion clips for movement study.
- Keep masks and costume colours faithful to the specific maker, troupe, character, and reference used.
- For paired Durga and Mahishasura animation, use a shared origin, scale, facing direction, and 30 fps timebase. Matching confrontation clips must have identical durations and named event markers for approach, encounter, reaction, controlled fall, and resolution in the sidecar metadata.

The current viewer supports skeleton-safe cloning, named animation clips, play/pause, looping, timeline scrubbing, 0.25×/0.5×/1× playback, camera presets, appearance modes, lighting presets, explicit zoom, and fullscreen study. Draco-compressed geometry and KTX2 textures use local decoder files, so the sandbox does not depend on a third-party CDN. The manuscript records each intended filename under `plannedModels`; a page remains an honest “3D study in preparation” card until its reviewed file is deliberately bound.

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
- child-safety tier: observation only, supervised exploration, or low-risk self-guided prompt
- contributor agreement and compensation status
- notes on any interpretive reconstruction

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

The existing 17 generic prototype GLBs are not reliable reference models: their filenames do not identify lineage, costume, character, pose, performer, or source, none contains animation clips, and together they occupy roughly 510 MB. They remain unbound and outside the release plan. Remove or archive them only after confirming that no original source work is needed from those unique files.
