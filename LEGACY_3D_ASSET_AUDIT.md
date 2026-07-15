# Recovered 3D asset audit

Audit date: 14 July 2026

## Decision

None of the 17 recovered GLB files should appear on a public eBook page.

Every file loads in the project viewer. Loading is not approval. All 17 are
static Tripo-generated meshes with no recorded source pose, prompt, operator,
performer, maker, licence, permission, regional attribution, or practitioner
review. Appearance alone does not support a Mayurbhanj, Seraikella, Purulia,
movement, costume, mask, character, or prop label.

The recovered filenames also do not match the planned filenames in
`CHHAU_3D_MODEL_ASSET_REQUEST.md`. Renaming a generic model to match a reviewed
study would create a false factual claim.

## Technical result

- 17 files and 509 MiB of downloads
- about 17.24 million triangles in total
- one welded mesh and one material per file
- three embedded 4096 by 4096 JPEG textures per file
- zero rigs, skins, joints, morph targets, or animation clips
- about 277 to 309 MiB estimated GPU memory per loaded file
- close to 4.8 GiB estimated GPU memory for the full set
- no geometry or texture compression

One model would place phone and laptop performance at risk. Several models in
one reading session would compound memory use. The files also cannot perform
the interactions promised by the manuscript. They cannot play chali, topka,
ufli, entry, jump, or musical-cue clips. They cannot isolate a mask, garment,
prop, performer, or pathway.

## File review

| File | Visible subject | Public decision |
| --- | --- | --- |
| `chhau-figure-5a81ddf6.glb` | Generic unmasked figure in a wide bent-knee pose | Do not call it chauk or Mayurbhanj. Private camera test only after rights review. |
| `chhau-group-1.glb` | Fused group tableau | No documented troupe, formation, place, or regional identity. Quarantine. |
| `dance-troupe.glb` | Fused line of figures with unidentified curved objects | Private wide-camera stress test only after rights review. |
| `dancer-character.glb` | Ornate figure in an extreme balance | No documented character, work, costume, or style. Quarantine. |
| `human-figure-copy.glb` | Generic crossed-foot pose | No documented movement or source. Private controls test only after rights review. |
| `human-figure.glb` | Generic folded-forward pose | Do not label it as daily work, readiness, or Chhau. Quarantine. |
| `longsword.glb` | Generated fantasy-like blade | No maker, scale, source object, or Chhau link. Quarantine. |
| `martial-artist-2.glb` | Masked or helmeted warrior with blade and shield | Do not present as Seraikella or Purulia. Quarantine. |
| `martial-artist-copy-2.glb` | Generic raised-sword figure | No documented phrase, practitioner, or region. Quarantine. |
| `martial-artist-copy.glb` | Generic standing sword figure | No Chhau stance, dress, or object record. Quarantine. |
| `martial-artist-duo.glb` | Two fused sword-and-shield figures | No documented phrase or regional source. Quarantine. |
| `martial-artist-with-sword.glb` | Generic overhead-sword pose | Private framing test only after rights review. |
| `martial-artist.glb` | Ambiguous warrior with staff and shield | Do not assign a character, mask, story, or region. Quarantine. |
| `performing-dancers.glb` | Fused repeated group | No documented formation or performance. Quarantine. |
| `round-shield.glb` | Dense generated circular prop | No maker, construction, scale, or Chhau link. Quarantine. |
| `traditional-dancer-copy.glb` | Two fused ornate airborne figures | Do not present as a regional jump or comparison. Quarantine. |
| `traditional-dancer.glb` | Ornate dancer with unidentified circular form | No documented work, costume, prop, or style. Quarantine. |

## Page allocation

Public eBook allocation: zero recovered files.

The only defensible short-term allocation is an unlisted development route
after provenance and rights review:

| Development test | Possible recovered file | Limit |
| --- | --- | --- |
| Rotation, zoom, light, and reset | `human-figure-copy.glb` | Generic static viewer test. Never a Chhau pose. |
| Prop close view | `longsword.glb`, `round-shield.glb` | Generic generated objects. Never documented Chhau props. |
| Wide responsive framing | `dance-troupe.glb` | Fused generated group. Never a troupe, arena, or formation record. |

Do not place these tests on `chali-character-walk`, `readiness-weight-chauk`,
`topka-and-ufli`, `movement-unit-to-bhangi`, `map-of-chhau`, or any
region-specific page. Their appearance supplies no evidence for those claims.

## Optimisation gate for any private test

- repair geometry errors and remove floating fragments
- reduce a prop to about 20,000 to 30,000 triangles
- reduce a single static figure to about 60,000 to 100,000 triangles
- reduce textures to 1024 or 2048 where measured screen coverage allows
- convert textures to KTX2 and geometry to Meshopt or Draco
- put the floor origin at the feet and record scale
- test peak memory, load time, and frame rate on a mid-range phone

This gate improves performance. It does not solve rights or cultural accuracy.

## Release gate for a future public study

Every public model needs:

- exact eBook page and learning purpose
- regional tradition and named subject where relevant
- performer, source object, maker, teacher, lineage, or troupe
- source images, video, scan, or motion-capture record
- creator, operator, and AI generation workflow where relevant
- written permission, licence, and required credit
- named practitioner, maker, or musician reviewer
- review date, result, and changes made after review
- known reconstruction choices and errors
- rig, clips, and motion sources when movement is claimed
- mobile performance test and accessible description

Until this record is complete, the interface state remains `Planned study`.
