# Recovered 3D asset audit

Audit date: 15 July 2026

## Decision

All 17 recovered GLB files now appear as user-directed generic visual
prototypes. Each file loads only after the reader chooses it.

All 17 are static Tripo-generated meshes with no recorded source pose, prompt,
operator, performer, maker, licence, regional attribution, or practitioner
review. Their public labels describe visible form only. Appearance alone does
not support a Mayurbhanj, Seraikella, Purulia, movement, costume, mask,
character, formation, performance, or prop claim.

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

| File | Visible subject | Published limit |
| --- | --- | --- |
| `chhau-figure-5a81ddf6.glb` | Generic unmasked figure in a wide bent-knee pose | Bent knee silhouette prototype. Never chauk or Mayurbhanj evidence. |
| `chhau-group-1.glb` | Fused group tableau | Group framing prototype. No troupe, formation, place, or regional identity. |
| `dance-troupe.glb` | Fused line of figures with unidentified curved objects | Wide framing prototype. No troupe, arena, or event claim. |
| `dancer-character.glb` | Ornate figure in an extreme balance | Balance figure prototype. No character, work, costume, or style claim. |
| `human-figure-copy.glb` | Generic crossed-foot pose | Figure prototype. No named movement or source claim. |
| `human-figure.glb` | Generic folded-forward pose | Figure prototype. Never daily work, readiness, or Chhau evidence. |
| `longsword.glb` | Generated fantasy-like blade | Generated blade prototype. No maker, scale, source object, or Chhau link. |
| `martial-artist-2.glb` | Masked or helmeted warrior with blade and shield | Martial image prototype. Never Seraikella or Purulia evidence. |
| `martial-artist-copy-2.glb` | Generic raised-sword figure | Martial image prototype. No documented phrase or region. |
| `martial-artist-copy.glb` | Generic standing sword figure | Martial image prototype. No Chhau stance, dress, or object claim. |
| `martial-artist-duo.glb` | Two fused sword-and-shield figures | Pair framing prototype. No documented phrase or regional source. |
| `martial-artist-with-sword.glb` | Generic overhead-sword pose | Martial image prototype. No technique claim. |
| `martial-artist.glb` | Ambiguous warrior with staff and shield | Martial image prototype. No character, mask, story, or region. |
| `performing-dancers.glb` | Fused repeated group | Group framing prototype. No documented formation or performance. |
| `round-shield.glb` | Dense generated circular prop | Generated circular-object prototype. No maker, construction, scale, or Chhau link. |
| `traditional-dancer-copy.glb` | Two fused ornate airborne figures | Airborne pair prototype. No regional jump or comparison claim. |
| `traditional-dancer.glb` | Ornate dancer with unidentified circular form | Solo figure prototype. No documented work, costume, prop, or style. |

## Page allocation

Public eBook allocation: all 17 recovered files, each used once.

| Page | Files | Learning purpose |
| --- | --- | --- |
| `first-look` | Six solo and ensemble prototypes | Test silhouette, spacing, camera angle, and group framing before assigning a name. |
| `martial-inheritance` | Six martial figures, one generated blade, and one generated shield | Test viewpoint and broad martial imagery without claiming a Chhau technique or object. |
| `body-carries-story` | Three generic figure prototypes | Practise reading support, direction, and held shape without naming a movement or character. |

The release checker requires each recovered file to appear exactly once. It
also rejects labels which assign Chhau, a regional identity, or a named movement
to these models.

## Optimisation work still needed

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

The source-based studies remain `Planned study`. These recovered prototypes do
not fill those slots.
