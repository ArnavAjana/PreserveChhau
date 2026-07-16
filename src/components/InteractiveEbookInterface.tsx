"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
  type RefObject,
} from "react";
import { bookPages, type BookPage } from "@/content/book-pages";
import { AboutAuthorProfile } from "@/components/AboutAuthorProfile";
import { PageEmbed } from "@/components/PageEmbed";
import { SandboxGuide } from "@/components/SandboxGuide";

type CitationContextValue = {
  onCiteClick: (citationNumber: number) => void;
};

type IconProps = {
  className?: string;
};

type TocPage = {
  index: number;
  page: BookPage;
};

type TocGroup = {
  id: string;
  label: string;
  pages: TocPage[];
};

type NavigateOptions = {
  focusHeading?: boolean;
  replace?: boolean;
};

type ModelOption = {
  label: string;
  description: string;
  modelUrl: string;
  modelScale?: number;
};

type ReaderViewMode = "spread" | "single";

const CitationContext = createContext<CitationContextValue | null>(null);

const LIBRARY_PAGE_ID = "library";
const SPREAD_MEDIA_QUERY =
  "(min-width: 1400px) and (min-height: 760px) and (orientation: landscape)";
const STUDY_ANCHOR_PATTERN =
  /^>\s+(?:\*\*)?(Sandbox|3D sandbox|3D prototype)\b/i;
const LIBRARY_ENTRY_PATTERN = /^(?:\*\*)?\[(\d+)\](?:\*\*)?\s*/;

const REFERENCE_IDS = new Set<string>([
  "glossary-place-people",
  "glossary-movement",
  "glossary-music-performance",
  "timeline",
  "questions-still-open",
  "library",
]);

const MODEL_LABELS: Record<string, string> = {
  "asar-akhada-diorama.glb": "Performance arena and training-ground study",
  "chhau-three-styles-lineup.glb": "Three-tradition comparison",
  "costume-comparison.glb": "Regional costume comparison",
  "group-formation-pack.glb": "Group pathways and formations",
  "instrument-pack.glb": "Region-labelled instrument study",
  "mask-comparison.glb": "Seraikella and Purulia mask comparison",
  "mayurbhanj-chamka.glb": "Mayurbhanj rhythm-and-movement study",
  "mayurbhanj-core.glb": "Mayurbhanj foundational movement study",
  "mayurbhanj-jumps.glb": "Mayurbhanj aerial movement key poses",
  "mayurbhanj-repertoire.glb": "Mayurbhanj repertoire study",
  "mayurbhanj-topkas.glb":
    "Planned Mayurbhanj topka study. Practitioner review pending.",
  "mayurbhanj-uflis.glb":
    "Planned Mayurbhanj ufli study. Practitioner review pending.",
  "prop-pack.glb": "Region-labelled performance props",
  "purulia-durga.glb": "Purulia Durga study",
  "purulia-ganesha.glb": "Purulia Ganesha study",
  "purulia-lion-vahana.glb": "Purulia lion-vahana study",
  "purulia-mahishasura.glb": "Purulia Mahishasura study",
  "purulia-mask-layers.glb":
    "Planned Purulia mask-construction study. Maker review pending.",
  "purulia-masked-core.glb": "Purulia masked movement study",
  "purulia-technique.glb": "Purulia movement-grammar study",
  "seraikella-expression.glb": "Seraikella mask-and-body expression study",
  "seraikella-ratri.glb": "Seraikella Ratri study",
  "seraikella-second-exemplar.glb": "Second Seraikella repertoire study",
};

function useCitationOnClick(): (citationNumber: number) => void {
  const context = useContext(CitationContext);
  return context?.onCiteClick ?? (() => {});
}

function getChapterEyebrow(page: BookPage): string | null {
  const sectionMatch = page.title.match(/^(Chapter [^:]+|Reference):\s+(.+)$/);
  if (sectionMatch) {
    return sectionMatch[1];
  }

  const pageIndex = bookPages.findIndex((candidate) => candidate.id === page.id);
  for (let index = pageIndex - 1; index >= 0; index -= 1) {
    const section = bookPages[index];
    if (section.pageType !== "section") continue;
    return section.title.match(/^(Chapter [^:]+|Reference):\s+(.+)$/)?.[1]
      ?? section.title;
  }

  return null;
}

function getChapterTitle(page: BookPage): string {
  return page.title.match(/^(Chapter [^:]+|Reference):\s+(.+)$/)?.[2]
    ?? page.title;
}

function getTocGroups(): TocGroup[] {
  const groups: TocGroup[] = [];
  let currentGroup: TocGroup = {
    id: "opening",
    label: "Opening",
    pages: [],
  };

  bookPages.forEach((page, index) => {
    if (page.pageType === "section") {
      if (currentGroup.pages.length > 0) groups.push(currentGroup);
      currentGroup = {
        id: page.id,
        label: getChapterTitle(page),
        pages: [],
      };
    }
    currentGroup.pages.push({ index, page });
  });

  if (currentGroup.pages.length > 0) groups.push(currentGroup);
  return groups;
}

const TOC_GROUPS = getTocGroups();

function getCurrentGroupLabel(pageIndex: number): string {
  return (
    TOC_GROUPS.find((group) =>
      group.pages.some((entry) => entry.index === pageIndex),
    )?.label ?? "Opening"
  );
}

function getPageIndexFromHash(): number {
  if (typeof window === "undefined") return -1;
  const id = decodeURIComponent(window.location.hash.replace(/^#/, ""));
  if (!id) return -1;
  return bookPages.findIndex((page) => page.id === id);
}

function formatModelLabel(filename: string): string {
  const knownLabel = MODEL_LABELS[filename];
  if (knownLabel) return knownLabel;
  const words = filename
    .replace(/\.glb$/i, "")
    .split("-")
    .filter(Boolean)
    .join(" ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function getModelOptionsForPage(page: BookPage): ModelOption[] {
  if (page.modelOptions?.length) return page.modelOptions;
  if (!page.modelUrl) return [];
  return [
    {
      label: "3D study",
      description:
        "A rotatable study for this page. Its subject, source, permissions, and review status must be recorded before publication.",
      modelScale: page.modelScale,
      modelUrl: page.modelUrl,
    },
  ];
}

function isFeaturePage(page: BookPage): boolean {
  return (
    page.pageType !== "content" ||
    page.id === "about-me" ||
    REFERENCE_IDS.has(page.id) ||
    Boolean(
      page.embedUrl ||
        page.interactive ||
        page.modelUrl ||
        page.modelOptions?.length,
    )
  );
}

function createSpreadPlan(pages: BookPage[]): number[][] {
  const spreads: number[][] = [];

  for (let index = 0; index < pages.length; ) {
    const page = pages[index];
    const nextPage = pages[index + 1];

    if (isFeaturePage(page)) {
      spreads.push([index]);
      index += 1;
      continue;
    }

    if (nextPage && !isFeaturePage(nextPage)) {
      spreads.push([index, index + 1]);
      index += 2;
      continue;
    }

    spreads.push([index]);
    index += 1;
  }

  return spreads;
}

const BOOK_SPREADS = createSpreadPlan(bookPages);

function subscribeToSpreadSupport(onChange: () => void): () => void {
  const media = window.matchMedia(SPREAD_MEDIA_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function getSpreadSupport(): boolean {
  return window.matchMedia(SPREAD_MEDIA_QUERY).matches;
}

function getStudyPrompt(body: string): string | null {
  const block = body
    .split(/\n{2,}/)
    .map((candidate) => candidate.trim())
    .find((candidate) => STUDY_ANCHOR_PATTERN.test(candidate));

  if (!block) return null;
  return block
    .replace(
      /^>\s+(?:\*\*)?(?:Sandbox|3D sandbox|3D prototype):?(?:\*\*)?\s*/i,
      "",
    )
    .replace(/^>\s?/gm, "")
    .trim();
}

const ChhauModelViewer = dynamic(
  () =>
    import("@/components/ChhauModelViewer").then(
      (module) => module.ChhauModelViewer,
    ),
  {
    loading: () => <ViewerLoading />,
    ssr: false,
  },
);

export function InteractiveEbookInterface() {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [readerViewMode, setReaderViewMode] =
    useState<ReaderViewMode>("spread");
  const supportsSpread = useSyncExternalStore(
    subscribeToSpreadSupport,
    getSpreadSupport,
    () => false,
  );
  const [selectedModelIndexes, setSelectedModelIndexes] = useState<
    Record<string, number>
  >({});
  const [tocOpen, setTocOpen] = useState(false);
  const [tocQuery, setTocQuery] = useState("");
  const [pendingCitation, setPendingCitation] = useState<number | null>(null);

  const pageHeadingRef = useRef<HTMLHeadingElement>(null);
  const tocDialogRef = useRef<HTMLDivElement>(null);
  const tocSearchRef = useRef<HTMLInputElement>(null);
  const tocTriggerRef = useRef<HTMLButtonElement>(null);
  const shouldFocusHeadingRef = useRef(false);

  const currentPage = bookPages[currentChapter] ?? bookPages[0];
  const currentGroupLabel = getCurrentGroupLabel(currentChapter);
  const isSpread = readerViewMode === "spread" && supportsSpread;
  const activeSpreadIndex = Math.max(
    0,
    BOOK_SPREADS.findIndex((spread) => spread.includes(currentChapter)),
  );
  const visiblePageIndexes = isSpread
    ? BOOK_SPREADS[activeSpreadIndex] ?? [currentChapter]
    : [currentChapter];
  const visiblePages = visiblePageIndexes.map((index) => bookPages[index]);
  const visibleNextPage = visiblePages[1];
  const visibleEndIndex = visiblePageIndexes.at(-1) ?? currentChapter;
  const previousTargetIndex = isSpread
    ? BOOK_SPREADS[activeSpreadIndex - 1]?.[0]
    : currentChapter > 0
      ? currentChapter - 1
      : undefined;
  const nextTargetIndex = isSpread
    ? BOOK_SPREADS[activeSpreadIndex + 1]?.[0]
    : currentChapter + 1 < bookPages.length
      ? currentChapter + 1
      : undefined;

  const libraryPageIndex = useMemo(
    () => bookPages.findIndex((page) => page.id === LIBRARY_PAGE_ID),
    [],
  );

  const modelOptions = useMemo<ModelOption[]>(
    () => getModelOptionsForPage(currentPage),
    [currentPage],
  );

  const selectedModelIndex = Math.min(
    selectedModelIndexes[currentPage.id] ?? 0,
    Math.max(modelOptions.length - 1, 0),
  );
  const selectedModel = modelOptions[selectedModelIndex];
  const shouldShowViewer = Boolean(selectedModel);

  const navigateTo = useCallback(
    (requestedIndex: number, options: NavigateOptions = {}) => {
      const index = Math.min(
        bookPages.length - 1,
        Math.max(0, requestedIndex),
      );
      const { focusHeading = true, replace = false } = options;
      const nextHash = `#${encodeURIComponent(bookPages[index].id)}`;

      shouldFocusHeadingRef.current = focusHeading;
      setCurrentChapter(index);
      if (index !== libraryPageIndex) setPendingCitation(null);

      if (typeof window !== "undefined" && window.location.hash !== nextHash) {
        const method = replace ? "replaceState" : "pushState";
        window.history[method](null, "", nextHash);
      }

      if (index === currentChapter) {
        window.scrollTo({ top: 0, behavior: "auto" });
        if (focusHeading) {
          window.requestAnimationFrame(() =>
            pageHeadingRef.current?.focus({ preventScroll: true }),
          );
        }
      }
    },
    [currentChapter, libraryPageIndex],
  );

  const handleCitationClick = useCallback(
    (citationNumber: number) => {
      if (libraryPageIndex < 0) return;
      navigateTo(libraryPageIndex, { focusHeading: false });
      setPendingCitation(citationNumber);
    },
    [libraryPageIndex, navigateTo],
  );

  const citationContextValue = useMemo<CitationContextValue>(
    () => ({ onCiteClick: handleCitationClick }),
    [handleCitationClick],
  );

  useEffect(() => {
    function syncFromLocation() {
      const index = getPageIndexFromHash();
      if (index < 0) return;
      shouldFocusHeadingRef.current = false;
      setCurrentChapter(index);
      setPendingCitation(null);
    }

    syncFromLocation();
    window.addEventListener("hashchange", syncFromLocation);
    window.addEventListener("popstate", syncFromLocation);
    return () => {
      window.removeEventListener("hashchange", syncFromLocation);
      window.removeEventListener("popstate", syncFromLocation);
    };
  }, []);

  const changeReaderView = useCallback((mode: ReaderViewMode) => {
    setReaderViewMode(mode);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    document.title = `${getChapterTitle(currentPage)} · Chhau by Arnav Ajana`;

    if (shouldFocusHeadingRef.current) {
      window.requestAnimationFrame(() => {
        pageHeadingRef.current?.focus({ preventScroll: true });
        shouldFocusHeadingRef.current = false;
      });
    }
  }, [currentChapter, currentPage]);

  useEffect(() => {
    if (pendingCitation === null || currentChapter !== libraryPageIndex) return;

    const target = document.getElementById(`cite-${pendingCitation}`);
    if (!target) {
      const frame = window.requestAnimationFrame(() =>
        setPendingCitation(null),
      );
      return () => window.cancelAnimationFrame(frame);
    }

    target.setAttribute("tabindex", "-1");
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    target.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "center",
    });
    target.focus({ preventScroll: true });
    target.classList.add("cite-flash");
    const timeout = window.setTimeout(
      () => {
        target.classList.remove("cite-flash");
        setPendingCitation(null);
      },
      1500,
    );
    return () => {
      window.clearTimeout(timeout);
      target.classList.remove("cite-flash");
    };
  }, [pendingCitation, currentChapter, libraryPageIndex]);

  useEffect(() => {
    if (!tocOpen) return;

    const fallbackTrigger = tocTriggerRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => tocSearchRef.current?.focus());

    function handleDialogKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setTocOpen(false);
        return;
      }
      if (event.key !== "Tab" || !tocDialogRef.current) return;

      const focusable = Array.from(
        tocDialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), summary, [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleDialogKeyDown);
    return () => {
      document.removeEventListener("keydown", handleDialogKeyDown);
      document.body.style.overflow = previousOverflow;
      fallbackTrigger?.focus();
    };
  }, [tocOpen]);

  useEffect(() => {
    if (tocOpen) return;

    function handlePageKeys(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const target = event.target as HTMLElement | null;
      if (
        target?.closest(
          "input, textarea, select, button, a, summary, [contenteditable='true']",
        )
      ) {
        return;
      }

      if (event.key === "ArrowLeft" && previousTargetIndex !== undefined) {
        event.preventDefault();
        navigateTo(previousTargetIndex);
      }
      if (
        event.key === "ArrowRight" &&
        nextTargetIndex !== undefined
      ) {
        event.preventDefault();
        navigateTo(nextTargetIndex);
      }
    }

    document.addEventListener("keydown", handlePageKeys);
    return () => document.removeEventListener("keydown", handlePageKeys);
  }, [navigateTo, nextTargetIndex, previousTargetIndex, tocOpen]);

  function setSelectedModelIndex(index: number) {
    setSelectedModelIndexes((previousIndexes) => ({
      ...previousIndexes,
      [currentPage.id]: index,
    }));
  }

  const viewer = useMemo(
    () =>
      shouldShowViewer ? (
        <ChhauModelViewer
          key={`${currentPage.id}:${selectedModel?.modelUrl ?? currentPage.modelUrl ?? "none"}`}
          modelLabel={selectedModel?.label ?? "3D study"}
          modelScale={selectedModel?.modelScale ?? currentPage.modelScale}
          modelUrl={selectedModel?.modelUrl ?? currentPage.modelUrl}
        />
      ) : null,
    [currentPage, selectedModel, shouldShowViewer],
  );

  const filteredGroups = useMemo(() => {
    const query = tocQuery.trim().toLocaleLowerCase();
    if (!query) return TOC_GROUPS;

    return TOC_GROUPS.map((group) => ({
      ...group,
      pages: group.pages.filter(({ page }) =>
        `${group.label} ${page.title}`.toLocaleLowerCase().includes(query),
      ),
    })).filter((group) => group.pages.length > 0);
  }, [tocQuery]);

  const progress = Math.round(
    ((visibleEndIndex + 1) / Math.max(bookPages.length, 1)) * 100,
  );

  return (
    <CitationContext.Provider value={citationContextValue}>
      <div className="reader-shell min-h-screen">
        <p aria-live="polite" className="sr-only">
          {pendingCitation !== null
            ? `Opening source ${pendingCitation}`
            : visibleNextPage
              ? `${visiblePages.map((page) => getChapterTitle(page)).join(" and ")}, pages ${visiblePageIndexes.map((index) => index + 1).join(" and ")} of ${bookPages.length}`
              : `${getChapterTitle(currentPage)}, page ${currentChapter + 1} of ${bookPages.length}`}
        </p>

        {tocOpen ? (
          <div className="reader-toc-layer fixed inset-0 z-[120] flex" role="presentation">
            <button
              aria-label="Close contents"
              className="absolute inset-0 bg-ink/55 backdrop-blur-[2px]"
              onClick={() => setTocOpen(false)}
              tabIndex={-1}
              type="button"
            />
            <div
              aria-labelledby="contents-title"
              aria-modal="true"
              className="reader-toc-panel relative z-10 flex w-[min(28rem,calc(100vw-1rem))] flex-col"
              ref={tocDialogRef}
              role="dialog"
            >
              <div className="flex items-start justify-between gap-4 border-b border-ivory/10 px-5 pb-4 pt-[max(1.25rem,env(safe-area-inset-top))] sm:px-6">
                <div>
                  <p className="reader-kicker text-marigold-300">The eBook</p>
                  <h2 className="mt-1 text-xl font-semibold text-ivory" id="contents-title">
                    Contents
                  </h2>
                  <p className="mt-1 text-sm text-ivory/60">
                    {bookPages.length} pages. Twelve chapters.
                  </p>
                </div>
                <button
                  aria-label="Close contents"
                  className="reader-icon-button reader-icon-button-dark"
                  onClick={() => setTocOpen(false)}
                  type="button"
                >
                  <CloseIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="border-b border-ivory/10 p-4 sm:px-6">
                <label className="reader-search-field">
                  <SearchIcon className="h-4 w-4 shrink-0" />
                  <span className="sr-only">Search the contents</span>
                  <input
                    autoComplete="off"
                    onChange={(event) => setTocQuery(event.target.value)}
                    placeholder="Search page titles"
                    ref={tocSearchRef}
                    type="search"
                    value={tocQuery}
                  />
                </label>
              </div>

              <nav
                aria-label="eBook contents"
                className="min-h-0 flex-1 overflow-y-auto px-3 py-3 sm:px-4"
              >
                {filteredGroups.length > 0 ? (
                  filteredGroups.map((group) => {
                    const containsCurrentPage = group.pages.some(
                      ({ index }) => index === currentChapter,
                    );
                    return (
                      <details
                        className="reader-toc-group"
                        key={group.id}
                        open={Boolean(tocQuery) || containsCurrentPage}
                      >
                        <summary>
                          <span>{group.label}</span>
                          <span>{group.pages.length}</span>
                        </summary>
                        <div className="space-y-1 pb-2">
                          {group.pages.map(({ index, page }) => (
                            <button
                              aria-current={
                                index === currentChapter ? "page" : undefined
                              }
                              className={`reader-toc-link ${
                                index === currentChapter ? "is-current" : ""
                              }`}
                              key={page.id}
                              onClick={() => {
                                navigateTo(index);
                                setTocOpen(false);
                                setTocQuery("");
                              }}
                              type="button"
                            >
                              <span className="reader-toc-number">
                                {String(index + 1).padStart(2, "0")}
                              </span>
                              <span>{getChapterTitle(page)}</span>
                            </button>
                          ))}
                        </div>
                      </details>
                    );
                  })
                ) : (
                  <p className="px-3 py-8 text-center text-sm text-ivory/65">
                    No page title matches “{tocQuery}”.
                  </p>
                )}
              </nav>

              <div className="border-t border-ivory/10 px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6 sm:pb-[max(1.5rem,env(safe-area-inset-bottom))]">
                <Link
                  className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-ivory/15 px-4 text-sm font-semibold text-ivory transition hover:border-marigold-300/60 hover:text-marigold-200"
                  href="/"
                >
                  <HomeIcon className="h-4 w-4" />
                  Return to project home
                </Link>
              </div>
            </div>
          </div>
        ) : null}

        <div
          className="reader-background"
          inert={tocOpen ? true : undefined}
        >
          <header className="reader-top-rail">
            <div className="reader-rail-inner mx-auto flex min-h-[4.5rem] max-w-[1920px] items-center gap-3 px-4 sm:px-6">
              <button
                aria-expanded={tocOpen}
                aria-haspopup="dialog"
                className="reader-rail-button"
                onClick={() => setTocOpen(true)}
                ref={tocTriggerRef}
                type="button"
              >
                <MenuIcon className="h-4 w-4" />
                <span>Book contents</span>
              </button>

              <Link
                aria-label="PreserveChhau home"
                className="hidden shrink-0 text-sm font-bold tracking-tight text-ink sm:block"
                href="/"
              >
                Preserve<span className="text-laterite-700">Chhau</span>
              </Link>

              <div
                aria-label="Page layout"
                className="reader-view-toggle"
                role="group"
              >
                <button
                  aria-pressed={readerViewMode === "spread"}
                  className={readerViewMode === "spread" ? "is-active" : ""}
                  onClick={() => changeReaderView("spread")}
                  type="button"
                >
                  Two pages
                </button>
                <button
                  aria-pressed={readerViewMode === "single"}
                  className={readerViewMode === "single" ? "is-active" : ""}
                  onClick={() => changeReaderView("single")}
                  type="button"
                >
                  One page
                </button>
              </div>

              <div className="min-w-0 flex-1 text-center">
                <p className="reader-kicker truncate text-laterite-700">
                  {currentGroupLabel}
                </p>
                <p className="mt-0.5 hidden truncate text-sm font-medium text-ink/75 md:block">
                  {getChapterTitle(currentPage)}
                </p>
              </div>

              <span className="shrink-0 text-xs font-semibold tabular-nums text-ink/70">
                {visibleNextPage
                  ? visiblePageIndexes.map((index) => index + 1).join(" and ")
                  : currentChapter + 1}
                /{bookPages.length}
              </span>
            </div>
            <div
              aria-label={`Reading progress: ${progress}%`}
              aria-valuemax={100}
              aria-valuemin={0}
              aria-valuenow={progress}
              className="reader-progress"
              role="progressbar"
            >
              <span style={{ width: `${progress}%` }} />
            </div>
          </header>

          <main className="reader-main" id="main-content">
            <BookContent
              currentChapter={currentChapter}
              headingRef={pageHeadingRef}
              isSpread={isSpread}
              modelOptions={modelOptions}
              nextTargetIndex={nextTargetIndex}
              onNavigate={navigateTo}
              page={currentPage}
              previousTargetIndex={previousTargetIndex}
              selectedModelIndex={selectedModelIndex}
              setSelectedModelIndex={setSelectedModelIndex}
              visiblePageIndexes={visiblePageIndexes}
              viewer={viewer}
            />
          </main>
        </div>
      </div>
    </CitationContext.Provider>
  );
}

function ViewerLoading() {
  return (
    <div className="grid h-full min-h-80 w-full place-items-center rounded-xl bg-ink text-sm font-medium text-ivory/75">
      Loading the 3D study...
    </div>
  );
}

function BookContent({
  currentChapter,
  headingRef,
  isSpread,
  modelOptions,
  nextTargetIndex,
  onNavigate,
  page,
  previousTargetIndex,
  selectedModelIndex,
  setSelectedModelIndex,
  visiblePageIndexes,
  viewer,
}: {
  currentChapter: number;
  headingRef: RefObject<HTMLHeadingElement | null>;
  isSpread: boolean;
  modelOptions: ModelOption[];
  nextTargetIndex?: number;
  onNavigate: (index: number, options?: NavigateOptions) => void;
  page: BookPage;
  previousTargetIndex?: number;
  selectedModelIndex: number;
  setSelectedModelIndex: (index: number) => void;
  visiblePageIndexes: number[];
  viewer?: ReactNode;
}) {
  const previousPage =
    previousTargetIndex === undefined
      ? undefined
      : bookPages[previousTargetIndex];
  const nextPage =
    nextTargetIndex === undefined ? undefined : bookPages[nextTargetIndex];

  return (
    <div className="reader-stage page-enter-minimal" key={`${page.id}-${isSpread}`}>
      <div
        className="reader-spread"
        data-layout={visiblePageIndexes.length === 2 ? "pair" : "single"}
      >
        {visiblePageIndexes.map((pageIndex) => {
          const visiblePage = bookPages[pageIndex];
          const isActive = pageIndex === currentChapter;
          const visibleModelOptions = isActive
            ? modelOptions
            : getModelOptionsForPage(visiblePage);

          return (
            <BookSheet
              active={isActive}
              headingRef={isActive ? headingRef : undefined}
              key={visiblePage.id}
              modelOptions={visibleModelOptions}
              page={visiblePage}
              pageNumber={pageIndex + 1}
              selectedModelIndex={isActive ? selectedModelIndex : 0}
              setSelectedModelIndex={
                isActive ? setSelectedModelIndex : () => undefined
              }
              viewer={isActive ? viewer : undefined}
            />
          );
        })}
      </div>

      <nav aria-label="Page navigation" className="reader-page-navigation">
        {previousPage && previousTargetIndex !== undefined ? (
          <button
            className="reader-adjacent-link reader-adjacent-previous"
            onClick={() => onNavigate(previousTargetIndex)}
            type="button"
          >
            <ChevronLeftIcon className="h-5 w-5 shrink-0" />
            <span>
              <span className="reader-adjacent-label">
                {isSpread ? "Previous pages" : "Previous"}
              </span>
              <span className="reader-adjacent-title">
                {getChapterTitle(previousPage)}
              </span>
            </span>
          </button>
        ) : null}

        {nextPage && nextTargetIndex !== undefined ? (
          <button
            className={`reader-adjacent-link reader-adjacent-next ${
              previousPage ? "" : "sm:col-start-2"
            }`}
            onClick={() => onNavigate(nextTargetIndex)}
            type="button"
          >
            <span>
              <span className="reader-adjacent-label">
                {isSpread ? "Next pages" : "Next"}
              </span>
              <span className="reader-adjacent-title">
                {getChapterTitle(nextPage)}
              </span>
            </span>
            <ChevronRightIcon className="h-5 w-5 shrink-0" />
          </button>
        ) : null}
      </nav>
    </div>
  );
}

function BookSheet({
  active,
  headingRef,
  modelOptions,
  page,
  pageNumber,
  selectedModelIndex,
  setSelectedModelIndex,
  viewer,
}: {
  active: boolean;
  headingRef?: RefObject<HTMLHeadingElement | null>;
  modelOptions: ModelOption[];
  page: BookPage;
  pageNumber: number;
  selectedModelIndex: number;
  setSelectedModelIndex: (index: number) => void;
  viewer?: ReactNode;
}) {
  return (
    <article
      aria-current={active ? "page" : undefined}
      className="heritage-paper reader-page"
      data-active={active ? "true" : "false"}
      data-about={page.id === "about-me" ? "true" : undefined}
      data-embed={page.embedUrl ? "true" : undefined}
      data-feature={isFeaturePage(page) ? "true" : "false"}
    >
      <div className="reader-page-inner">
        {page.pageType === "cover" ? (
          <CoverPage headingRef={headingRef} />
        ) : page.pageType === "section" ? (
          <SectionPage headingRef={headingRef} page={page} />
        ) : (
          <ContentPageBody
            chapter={page}
            headingRef={headingRef}
            modelOptions={modelOptions}
            selectedModelIndex={selectedModelIndex}
            setSelectedModelIndex={setSelectedModelIndex}
            viewer={viewer}
          />
        )}
      </div>
      <footer aria-label={`Page ${pageNumber}`} className="reader-page-folio">
        {String(pageNumber).padStart(2, "0")}
      </footer>
    </article>
  );
}

function CoverPage({
  headingRef,
}: {
  headingRef?: RefObject<HTMLHeadingElement | null>;
}) {
  return (
    <section className="reader-cover" aria-labelledby="book-cover-title">
      <div aria-hidden="true" className="reader-cover-lines">
        <span />
        <span />
        <span />
      </div>
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <p className="reader-kicker text-marigold-700">An interactive eBook</p>
        <h1
          className="reader-cover-title"
          id="book-cover-title"
          ref={headingRef}
          tabIndex={-1}
        >
          Chhau
        </h1>
        <p className="reader-cover-deck">
          I met Chhau through one performance. My questions led into
          Mayurbhanj Chhau and its wider family.
        </p>
        <div className="mx-auto mt-10 h-px w-20 bg-laterite-700/35" />
        <p className="mt-8 text-sm font-semibold tracking-[0.14em] text-ink/65 uppercase">
          Researched and written by
        </p>
        <p className="mt-2 text-2xl font-semibold text-laterite-800">
          Arnav Ajana
        </p>
      </div>
    </section>
  );
}

function SectionPage({
  headingRef,
  page,
}: {
  headingRef?: RefObject<HTMLHeadingElement | null>;
  page: BookPage;
}) {
  const eyebrow = page.title.match(/^(Chapter [^:]+|Reference):\s+(.+)$/)?.[1]
    ?? "Part";

  return (
    <section className="section-cover">
      <div className="relative z-10 max-w-3xl">
        <p className="reader-kicker text-laterite-700">{eyebrow}</p>
        <h1
          className="section-cover-title"
          ref={headingRef}
          tabIndex={-1}
        >
          {getChapterTitle(page)}
        </h1>
        <div aria-hidden="true" className="mx-auto mt-8 flex w-28 gap-2">
          <span className="h-1 flex-1 rounded-full bg-laterite-700" />
          <span className="h-1 flex-1 rounded-full bg-marigold-500" />
          <span className="h-1 flex-1 rounded-full bg-ink" />
        </div>
        {page.body.trim() ? (
          <div className="mt-8 [&_.book-prose]:text-center">
            <MarkdownContent page={page} />
          </div>
        ) : null}
      </div>
    </section>
  );
}

function ContentPageBody({
  chapter,
  headingRef,
  modelOptions,
  selectedModelIndex,
  setSelectedModelIndex,
  viewer,
}: {
  chapter: BookPage;
  headingRef?: RefObject<HTMLHeadingElement | null>;
  modelOptions: ModelOption[];
  selectedModelIndex: number;
  setSelectedModelIndex: (index: number) => void;
  viewer?: ReactNode;
}) {
  const blocks = chapter.body.split(/\n{2,}/);
  const anchorBlockIndex = blocks.findIndex((block) =>
    STUDY_ANCHOR_PATTERN.test(block.trim()),
  );
  const hasStudyAnchor = anchorBlockIndex >= 0;
  const studyPrompt = getStudyPrompt(chapter.body);
  const hasPlannedStudy = Boolean(chapter.plannedModels?.length || hasStudyAnchor);
  const selectedModel = modelOptions[selectedModelIndex] ?? modelOptions[0];
  const viewerBlock = viewer ? (
    <div className="reader-study-breakout space-y-3">
      <ModelChoiceTabs
        modelOptions={modelOptions}
        selectedModelIndex={selectedModelIndex}
        setSelectedModelIndex={setSelectedModelIndex}
      />
      <div className="reader-model-study">
        <div className="reader-model-viewport">{viewer}</div>
        {selectedModel ? (
          <aside
            aria-live="polite"
            className="reader-model-description"
            key={selectedModel.modelUrl}
          >
            <p className="reader-kicker text-laterite-700">3D prototype</p>
            <h2>{selectedModel.label}</h2>
            <p>{selectedModel.description}</p>
          </aside>
        ) : null}
      </div>
      <p className="reader-media-caption">
        Drag to rotate. Use + and − to zoom. Full screen adds pinch and pan.
      </p>
    </div>
  ) : null;

  const plannedStudy = !viewer && hasPlannedStudy ? (
    <PlannedStudyCard
      filenames={chapter.plannedModels ?? []}
      prompt={studyPrompt}
    />
  ) : null;

  const studyNode = viewerBlock ?? plannedStudy;
  const isAboutPage = chapter.id === "about-me";
  const isEmbeddedPage = Boolean(chapter.embedUrl);

  return (
    <>
      <section
        className={[
          "reader-editorial-grid",
          isAboutPage ? "reader-about-layout" : null,
          isEmbeddedPage ? "reader-embed-layout" : null,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <header className="reader-title-column">
          {getChapterEyebrow(chapter) ? (
            <p className="reader-kicker text-laterite-700">
              {getChapterEyebrow(chapter)}
            </p>
          ) : null}
          <h1
            className="reader-content-title"
            ref={headingRef}
            tabIndex={-1}
          >
            {getChapterTitle(chapter)}
          </h1>
          {isAboutPage ? <AboutAuthorProfile /> : null}
        </header>

        <div className="reader-copy-column">
          {!hasStudyAnchor && studyNode ? (
            <div className="reader-study-breakout mb-8">{studyNode}</div>
          ) : null}

          {chapter.body.trim() ? (
            <MarkdownContent
              anchorBlockIndex={hasStudyAnchor ? anchorBlockIndex : null}
              page={chapter}
              studyNode={studyNode}
            />
          ) : null}
        </div>
      </section>

      {chapter.interactive === "sandbox-guide" ? (
        <div className="reader-media-breakout">
          <SandboxGuide />
        </div>
      ) : null}

      {chapter.embedUrl ? (
        <div className="reader-embed-breakout">
          <PageEmbed
            caption={chapter.embedCaption}
            height={chapter.embedHeight}
            src={chapter.embedUrl}
            title={chapter.embedTitle ?? chapter.title}
          />
        </div>
      ) : null}

    </>
  );
}

function PlannedStudyCard({
  filenames,
  prompt,
}: {
  filenames: string[];
  prompt: string | null;
}) {
  return (
    <aside className="planned-study-card" aria-label="3D study in preparation">
      <div className="flex items-start gap-4">
        <span aria-hidden="true" className="planned-study-icon">
          <CubeIcon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="reader-kicker text-laterite-700">
            3D study in preparation
          </p>
          <h2 className="mt-2 text-lg font-semibold text-ink">
            What to look for in this study
          </h2>
          {prompt ? <p className="mt-3 text-sm leading-7 text-ink/75">{prompt}</p> : null}

          {filenames.length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Planned studies">
              {filenames.map((filename) => (
                <li className="planned-study-chip" key={filename}>
                  {formatModelLabel(filename)}
                </li>
              ))}
            </ul>
          ) : null}

          <p className="mt-4 border-t border-laterite-900/10 pt-4 text-xs leading-6 text-ink/60">
            Publication waits for review of the movement, regional details,
            credits, permissions, and learning notes.
          </p>
        </div>
      </div>
    </aside>
  );
}

function ModelChoiceTabs({
  modelOptions,
  selectedModelIndex,
  setSelectedModelIndex,
}: {
  modelOptions: ModelOption[];
  selectedModelIndex: number;
  setSelectedModelIndex: (index: number) => void;
}) {
  if (modelOptions.length <= 1) return null;

  return (
    <div aria-label="Choose a 3D study" className="flex flex-wrap gap-2" role="group">
      {modelOptions.map((option, index) => (
        <button
          aria-pressed={selectedModelIndex === index}
          className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
            selectedModelIndex === index
              ? "border-laterite-700 bg-laterite-700 text-ivory"
              : "border-laterite-900/15 bg-white text-ink hover:border-laterite-500"
          }`}
          key={option.modelUrl}
          onClick={() => setSelectedModelIndex(index)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function MarkdownContent({
  anchorBlockIndex,
  leadNode,
  page,
  studyNode,
}: {
  anchorBlockIndex?: number | null;
  leadNode?: ReactNode;
  page: BookPage;
  studyNode?: ReactNode;
}) {
  const blocks = page.body.split(/\n{2,}/);
  const className = [
    "reader-prose heritage-text space-y-5",
    REFERENCE_IDS.has(page.id) ? null : "book-prose",
    leadNode ? "about-author-prose" : null,
  ]
    .filter(Boolean)
    .join(" ");

  const renderBlocks = (entries: string[], startIndex = 0) =>
    entries
      .map((block, index) =>
        renderMarkdownBlock(block, `${page.id}-${startIndex + index}`),
      )
      .filter(Boolean);

  if (
    studyNode &&
    anchorBlockIndex !== null &&
    anchorBlockIndex !== undefined &&
    anchorBlockIndex >= 0
  ) {
    const before = renderBlocks(blocks.slice(0, anchorBlockIndex));
    const after = renderBlocks(
      blocks.slice(anchorBlockIndex + 1),
      anchorBlockIndex + 1,
    );

    return (
      <>
        {before.length > 0 ? <div className={className}>{before}</div> : null}
        <div className="reader-study-breakout my-8" key={`${page.id}-study`}>
          {studyNode}
        </div>
        {after.length > 0 ? <div className={className}>{after}</div> : null}
      </>
    );
  }

  return (
    <div className={className}>
      {leadNode}
      {renderBlocks(blocks)}
    </div>
  );
}

function renderMarkdownBlock(block: string, key: string) {
  const trimmedBlock = block.trim();
  if (!trimmedBlock) return null;

  if (trimmedBlock.startsWith("### ")) {
    return (
      <h2 className="reader-subheading" key={key}>
        {renderInlineMarkdown(trimmedBlock.slice(4))}
      </h2>
    );
  }

  if (trimmedBlock.startsWith("> ")) {
    return (
      <blockquote className="reader-callout" key={key}>
        {renderInlineMarkdown(trimmedBlock.replace(/^>\s?/gm, ""))}
      </blockquote>
    );
  }

  const listItems = trimmedBlock.split("\n");
  if (listItems.every((line) => line.startsWith("- "))) {
    return (
      <ul className="reader-list" key={key}>
        {listItems.map((line, index) => (
          <li key={`${line}-${index}`}>{renderInlineMarkdown(line.slice(2))}</li>
        ))}
      </ul>
    );
  }

  const libraryEntryMatch = trimmedBlock.match(LIBRARY_ENTRY_PATTERN);
  if (libraryEntryMatch) {
    const citationNumber = libraryEntryMatch[1];
    const rest = trimmedBlock.replace(LIBRARY_ENTRY_PATTERN, "");
    return (
      <p
        className="library-entry"
        data-cite-number={citationNumber}
        id={`cite-${citationNumber}`}
        key={key}
      >
        {renderInlineMarkdown(rest)}
      </p>
    );
  }

  return (
    <p className="whitespace-pre-wrap" key={key}>
      {renderInlineMarkdown(trimmedBlock)}
    </p>
  );
}

function renderInlineMarkdown(text: string): ReactNode[] {
  const pieces = text.split(
    /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\(#[A-Za-z0-9-]+\)|(?:\[\d+\])+|https?:\/\/[^\s]+)/g,
  );

  return pieces.map((piece, index) => {
    if (piece.startsWith("**") && piece.endsWith("**")) {
      return <strong key={`${piece}-${index}`}>{piece.slice(2, -2)}</strong>;
    }

    if (piece.startsWith("*") && piece.endsWith("*")) {
      return <em key={`${piece}-${index}`}>{piece.slice(1, -1)}</em>;
    }

    const internalLink = piece.match(/^\[([^\]]+)\]\((#[A-Za-z0-9-]+)\)$/);
    if (internalLink) {
      return (
        <a
          className="font-semibold text-laterite-700 underline decoration-laterite-300 underline-offset-4 transition-colors hover:text-laterite-900"
          href={internalLink[2]}
          key={`${piece}-${index}`}
        >
          {internalLink[1]}
        </a>
      );
    }

    if (/^(\[\d+\])+$/.test(piece)) {
      const numbers = Array.from(piece.matchAll(/\[(\d+)\]/g)).map((match) =>
        Number.parseInt(match[1], 10),
      );
      return <CitationGroup key={`${piece}-${index}`} numbers={numbers} />;
    }

    if (/^https?:\/\//.test(piece)) {
      const [url, terminalPunctuation] = splitUrlTerminalPunctuation(piece);
      return (
        <span key={`${piece}-${index}`}>
          <a
            className="break-words font-medium text-laterite-700 underline decoration-laterite-300 underline-offset-4 transition-colors hover:text-laterite-900"
            href={url}
            rel="noreferrer"
            target="_blank"
          >
            {url}
          </a>
          {terminalPunctuation}
        </span>
      );
    }

    return <span key={`${piece}-${index}`}>{piece}</span>;
  });
}

function splitUrlTerminalPunctuation(url: string): [string, string] {
  let end = url.length;

  while (end > 0 && /[.,;:!?]/.test(url[end - 1])) end -= 1;

  const trimUnmatchedCloser = (open: string, close: string) => {
    const candidate = url.slice(0, end);
    const openCount = candidate.split(open).length - 1;
    const closeCount = candidate.split(close).length - 1;
    if (candidate.endsWith(close) && closeCount > openCount) end -= 1;
  };

  trimUnmatchedCloser("(", ")");
  trimUnmatchedCloser("[", "]");

  return [url.slice(0, end), url.slice(end)];
}

function CitationGroup({ numbers }: { numbers: number[] }) {
  const onCiteClick = useCitationOnClick();

  return (
    <sup className="ml-1 inline-flex gap-1 text-[0.68em] font-semibold">
      {numbers.map((number, index) => (
        <button
          aria-label={`Jump to source ${number}`}
          className="citation-button"
          key={`${number}-${index}`}
          onClick={() => onCiteClick(number)}
          type="button"
        >
          {number}
        </button>
      ))}
    </sup>
  );
}

function HomeIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="m3 11 9-8 9 8M5 9.5V21h5v-6h4v6h5V9.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function MenuIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function CloseIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path
        d="m6 6 12 12M18 6 6 18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function SearchIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="m16.5 16.5 4 4" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  );
}

function ChevronLeftIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path d="m15 18-6-6 6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function ChevronRightIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path d="m9 18 6-6-6-6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

function CubeIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} fill="none" viewBox="0 0 24 24">
      <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
      <path d="m4.5 7.5 7.5 4 7.5-4M12 11.5V21" stroke="currentColor" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}
