# Editorial rewrite scope

This branch rebuilds the reader-facing voice of **The Science of Chhau Dance** without changing the eBook after Chapter 5.

## Included

- The public homepage
- The author page
- The movement and 3D roadmap page
- Website navigation, footer, and metadata
- The eBook cover and opening pages
- Chapter 1: Three Traditions, One Shared Name
- Chapter 2: Many Roots, No Single Beginning
- Chapter 3: Entering Mayurbhanj
- Chapter 4: What the Body Is Actually Doing
- Chapter 5: How Movement Becomes Language
- The short glossary definition of Chhau
- The missing `Part 1` label

## Excluded

**Chapter 6, “Nature and Daily Life,” and every page after it remain unchanged in this branch.**

The build step enforces this boundary with an exact allowlist of 34 page IDs. It fails if an override is missing or if an out-of-scope page is added.

## Why the rewrite is applied as an override

`src/content/book-pages.ts` is generated from `Chhau_eBook_Content.md` during every development and production build. Direct edits to the generated file would be overwritten.

The scoped copy therefore lives in:

- `scripts/human-book-overrides/00-opening.json`
- `scripts/human-book-overrides/01-chapter-one.json`
- `scripts/human-book-overrides/02-chapter-two.json`
- `scripts/human-book-overrides/03-chapter-three.json`
- `scripts/human-book-overrides/04-chapter-four.json`
- `scripts/human-book-overrides/05-chapter-five.json`

`scripts/apply-human-rewrite.mjs` applies those overrides after the canonical book generator runs. It also corrects the eBook cover wording, supports the `Part 1` section label, and shortens the Chhau glossary definition.

## Media principle

The revised movement pages do not claim that a static 3D figure teaches movement. They identify the practitioner-approved footage still required, including:

- front and side views
- normal speed and slow motion
- spoken terminology
- rhythm or counts
- preparation, action, landing, recovery, and finish
- demonstrator, teacher or lineage, regional tradition, permission, and credit

No placeholder is presented as a completed lesson.
