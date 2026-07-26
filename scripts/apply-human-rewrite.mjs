import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const bookPagesPath = path.join(repositoryRoot, "src/content/book-pages.ts");
const readerPath = path.join(
  repositoryRoot,
  "src/components/InteractiveEbookInterface.tsx",
);
const overridesDirectory = path.join(scriptDirectory, "human-book-overrides");

function readOverrides() {
  const files = fs
    .readdirSync(overridesDirectory)
    .filter((file) => file.endsWith(".json"))
    .sort();

  return files.reduce((allOverrides, file) => {
    const filePath = path.join(overridesDirectory, file);
    const parsed = JSON.parse(fs.readFileSync(filePath, "utf8"));
    return Object.assign(allOverrides, parsed);
  }, {});
}

function patchGeneratedBookPages(overrides) {
  let source = fs.readFileSync(bookPagesPath, "utf8");
  const exportedDeclaration = "export const bookPages: BookPage[] = [";
  const internalDeclaration = "const generatedBookPages: BookPage[] = [";

  if (!source.includes(exportedDeclaration)) {
    throw new Error(
      "Could not find the generated bookPages declaration. Run the canonical builder first.",
    );
  }

  source = source.replace(exportedDeclaration, internalDeclaration);
  source = source.replace(
    "A collective name for three related regional dance traditions: Mayurbhanj, Seraikella, and Purulia. The shared name does not make their movement, masks, music, histories, or teaching identical.",
    "The collective name for three regional dance traditions of eastern India: Mayurbhanj, Seraikella, and Purulia Chhau.",
  );

  source += `\n\n// HUMAN_REWRITE_OVERRIDES\nconst humanBookPageOverrides: Record<string, Partial<BookPage>> = ${JSON.stringify(
    overrides,
    null,
    2,
  )};\n\nexport const bookPages: BookPage[] = generatedBookPages.map((page) => ({\n  ...page,\n  ...humanBookPageOverrides[page.id],\n}));\n`;

  fs.writeFileSync(bookPagesPath, source);
}

function patchReaderInterface() {
  let source = fs.readFileSync(readerPath, "utf8");

  source = source.replaceAll(
    "/^(Chapter [^:]+|Reference):\\s+(.+)$/",
    "/^(Chapter [^:]+|Part \\d+|Reference):\\s+(.+)$/",
  );

  source = source.replace(
    '<p className="reader-kicker text-laterite-700">An evidence-led interactive eBook</p>',
    '<p className="reader-kicker text-laterite-700">A dancer’s questions, explored through body, rhythm, masks, and place</p>',
  );

  source = source.replace(
    /<p className="reader-cover-deck">[\s\S]*?<\/p>\n        <div className="mx-auto mt-10/,
    '<p className="reader-cover-deck">I learned the choreography before I understood the dance. This book is my attempt to go back and look again.</p>\n        <div className="mx-auto mt-10',
  );

  source = source.replace(
    "Researched and written by",
    "Written and explored by",
  );

  fs.writeFileSync(readerPath, source);
}

const overrides = readOverrides();
const forbiddenIds = Object.keys(overrides).filter((id) =>
  id.startsWith("chapter-six") || id.startsWith("chapter-seven"),
);

if (forbiddenIds.length > 0) {
  throw new Error(
    `The scoped rewrite must stop before Chapter 6. Remove: ${forbiddenIds.join(", ")}`,
  );
}

patchGeneratedBookPages(overrides);
patchReaderInterface();
console.log(
  `Applied human rewrite overrides to ${Object.keys(overrides).length} pages, ending with Chapter 5.`,
);
