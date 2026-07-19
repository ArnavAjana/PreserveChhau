import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const manuscriptPath = path.join(projectRoot, "Chhau_eBook_Content.md");
const outputPath = path.join(projectRoot, "src/content/book-pages.ts");

const markerPattern = /<!-- BOOK_PAGE (\{[^\n]+\}) -->/g;

const glossaryPageCategories = new Map([
  ["glossary-place-people", "place-people"],
  ["glossary-movement", "movement"],
  ["glossary-music-performance", "music-performance"],
]);

const glossaryAliasOverrides = {
  Akhara: ["Akharas"],
  "Guru / Ustad": ["Gurus", "Ustads"],
  "Paika / Rukmar / Pharikhanda": ["Parikhanda"],
  Raga: ["Ragas"],
  Repertoire: ["Repertoires"],
  Sahi: ["Sahis"],
  "Seraikella Chhau": ["Saraikela Chhau", "Saraikala Chhau"],
};

function parsePages(source) {
  const matches = [...source.matchAll(markerPattern)];
  if (matches.length === 0) {
    throw new Error(
      "No BOOK_PAGE markers found. Expected one-line JSON metadata comments.",
    );
  }

  const pages = matches.map((match, index) => {
    const metadata = JSON.parse(match[1]);
    const bodyStart = match.index + match[0].length;
    const bodyEnd = matches[index + 1]?.index ?? source.length;
    const body = source.slice(bodyStart, bodyEnd).trim();

    if (!metadata.id || !metadata.title || !metadata.pageType) {
      throw new Error(
        `Page marker ${index + 1} must include id, title, and pageType.`,
      );
    }
    if (!["cover", "section", "content"].includes(metadata.pageType)) {
      throw new Error(`Unsupported pageType on ${metadata.id}.`);
    }
    if ("audioTracks" in metadata) {
      throw new Error(
        `audioTracks is disabled on ${metadata.id}; restore audio only with an approved rights record and reviewed player implementation.`,
      );
    }

    return { ...metadata, body };
  });

  const duplicateIds = pages
    .map((page) => page.id)
    .filter((id, index, ids) => ids.indexOf(id) !== index);
  if (duplicateIds.length > 0) {
    throw new Error(`Duplicate page ids: ${[...new Set(duplicateIds)].join(", ")}`);
  }
  if (!pages.some((page) => page.id === "library")) {
    throw new Error('A page with id "library" is required for citation navigation.');
  }

  return pages;
}

function createGlossaryId(label) {
  return label
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function cleanGlossaryDefinition(definition) {
  return definition
    .replace(/(?:\[\d+\])+/g, "")
    .replace(/[*_]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseGlossary(pages) {
  const entries = [];
  const aliasesByNormalizedValue = new Map();

  for (const page of pages) {
    const category = glossaryPageCategories.get(page.id);
    if (!category) continue;

    const blocks = page.body.split(/\n{2,}/).map((block) => block.trim());
    for (const block of blocks) {
      if (!block || block.startsWith("These are working definitions")) continue;

      const match = block.match(/^([^:\n]{1,180}):\s+([\s\S]+)$/);
      if (!match) {
        throw new Error(
          `Malformed glossary entry on ${page.id}: ${JSON.stringify(block.slice(0, 120))}`,
        );
      }

      const label = match[1].trim();
      const definition = match[2].trim();
      const sourceNumbers = [...definition.matchAll(/\[(\d+)\]/g)].map(
        (sourceMatch) => Number.parseInt(sourceMatch[1], 10),
      );
      const aliases = [
        label,
        ...label.split(/\s+\/\s+|\s+and\s+/i),
        ...(glossaryAliasOverrides[label] ?? []),
      ]
        .map((alias) => alias.trim())
        .filter(Boolean)
        .filter((alias, index, values) =>
          values.findIndex(
            (candidate) => candidate.toLocaleLowerCase("en") === alias.toLocaleLowerCase("en"),
          ) === index,
        );

      const entry = {
        id: createGlossaryId(label),
        label,
        aliases,
        definition: cleanGlossaryDefinition(definition),
        category,
        glossaryPageId: page.id,
        sourceNumbers: [...new Set(sourceNumbers)],
      };

      for (const alias of aliases) {
        const normalizedAlias = alias.toLocaleLowerCase("en");
        const existingEntry = aliasesByNormalizedValue.get(normalizedAlias);
        if (existingEntry && existingEntry !== entry.id) {
          throw new Error(
            `Duplicate glossary alias ${JSON.stringify(alias)} on ${existingEntry} and ${entry.id}.`,
          );
        }
        aliasesByNormalizedValue.set(normalizedAlias, entry.id);
      }

      entries.push(entry);
    }
  }

  if (entries.length < 40) {
    throw new Error(`Expected at least 40 glossary entries, found ${entries.length}.`);
  }

  return entries;
}

function serialize(value) {
  return JSON.stringify(value, null, 2)
    .split("\n")
    .map((line, index) => (index === 0 ? line : `    ${line}`))
    .join("\n");
}

function optionalLine(key, value) {
  if (value === undefined || value === null) return "";
  return `    ${key}: ${serialize(value)},\n`;
}

function buildPage(page) {
  const modelUrl = page.modelUrl ?? null;
  return `  {
    id: ${JSON.stringify(page.id)},
    pageType: ${JSON.stringify(page.pageType)},
    title: ${JSON.stringify(page.title)},
    body: ${JSON.stringify(page.body)},
    modelUrl: ${JSON.stringify(modelUrl)},
    modelScale: ${page.modelScale ?? 1},
${optionalLine("modelOptions", page.modelOptions)}${optionalLine("plannedModels", page.plannedModels)}${optionalLine("interactive", page.interactive)}${optionalLine("embedUrl", page.embedUrl)}${optionalLine("embedTitle", page.embedTitle)}${optionalLine("embedCaption", page.embedCaption)}${optionalLine("embedHeight", page.embedHeight)}  }`;
}

function generateTypeScript(pages, glossaryEntries) {
  const renderedPages = pages
    .map((page) => buildPage(page))
    .join(",\n");

  return `// Generated by scripts/build-book-pages.mjs from Chhau_eBook_Content.md.
// Edit the manuscript, then run: npm run build:book

export type BookPageType = "cover" | "section" | "content";

export type BookPageModelOption = {
  label: string;
  description: string;
  modelUrl: string;
  modelScale?: number;
};

export type BookPageInteractive = "sandbox-guide";

export type BookGlossaryCategory =
  | "place-people"
  | "movement"
  | "music-performance";

export type BookGlossaryEntry = {
  id: string;
  label: string;
  aliases: string[];
  definition: string;
  category: BookGlossaryCategory;
  glossaryPageId: string;
  sourceNumbers: number[];
};

export type BookPage = {
  id: string;
  pageType: BookPageType;
  title: string;
  body: string;
  modelUrl: string | null;
  modelScale: number;
  modelOptions?: BookPageModelOption[];
  /** Approved asset filenames planned for this page, not loaded until modelUrl is set. */
  plannedModels?: string[];
  interactive?: BookPageInteractive;
  embedUrl?: string | null;
  embedTitle?: string;
  embedCaption?: string;
  embedHeight?: string;
};

export const bookPages: BookPage[] = [
${renderedPages},
];

export const bookGlossary: BookGlossaryEntry[] = ${serialize(glossaryEntries)};
`;
}

const manuscript = await readFile(manuscriptPath, "utf8");
const pages = parsePages(manuscript);
const glossaryEntries = parseGlossary(pages);
const generated = generateTypeScript(pages, glossaryEntries);
await writeFile(outputPath, generated);
console.log(
  `Generated ${pages.length} eBook pages and ${glossaryEntries.length} glossary entries from ${path.basename(manuscriptPath)}.`,
);
