import {
  bookGlossary,
  type BookGlossaryEntry,
} from "@/content/book-pages";

export type GlossaryMatch = {
  end: number;
  entry: BookGlossaryEntry;
  start: number;
  text: string;
};

const aliasLookup = new Map<string, BookGlossaryEntry>();

for (const entry of bookGlossary) {
  for (const alias of entry.aliases) {
    aliasLookup.set(alias.toLocaleLowerCase("en"), entry);
  }
}

const glossaryPattern = [...aliasLookup.keys()]
  .sort((left, right) => right.length - left.length)
  .map((alias) => alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
  .join("|");

export function findGlossaryMatches(
  text: string,
  seenEntryIds: Set<string>,
): GlossaryMatch[] {
  if (!text || !glossaryPattern) return [];

  const matcher = new RegExp(
    `(^|[^\\p{L}\\p{N}])(${glossaryPattern})(?=$|[^\\p{L}\\p{N}])`,
    "giu",
  );
  const matches: GlossaryMatch[] = [];

  for (const match of text.matchAll(matcher)) {
    const matchedText = match[2];
    const entry = aliasLookup.get(matchedText.toLocaleLowerCase("en"));
    if (!entry || seenEntryIds.has(entry.id)) continue;

    const prefixLength = match[1].length;
    const start = (match.index ?? 0) + prefixLength;
    seenEntryIds.add(entry.id);
    matches.push({
      end: start + matchedText.length,
      entry,
      start,
      text: matchedText,
    });
  }

  return matches;
}
