"use client";

import dynamic from "next/dynamic";
import { getImageProps } from "next/image";
import Link from "next/link";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { bookPages, type BookPage } from "@/content/book-pages";
import { PageAudioPlayer } from "@/components/PageAudioPlayer";
import { PageEmbed } from "@/components/PageEmbed";
import { PageMediaGallery } from "@/components/PageMediaGallery";
import { PageVideo } from "@/components/PageVideo";
import { SandboxGuide } from "@/components/SandboxGuide";

type CitationContextValue = {
  onCiteClick: (citationNumber: number) => void;
};

const CitationContext = createContext<CitationContextValue | null>(null);

function useCitationOnClick(): (n: number) => void {
  const ctx = useContext(CitationContext);
  return ctx?.onCiteClick ?? (() => {});
}

const LIBRARY_PAGE_ID = "library";
const SANDBOX_ANCHOR_PATTERN =
  /^>\s+\*\*(Sandbox|3D sandbox|Video|Audio|Image gallery|Image|Caption|Listen|Watch)\b/i;
const LIBRARY_ENTRY_PATTERN = /^\*\*\[(\d+)\]\*\*\s*/;

const MAYURBHANJ_IDS = new Set<string>([
  "entering-mayurbhanj-chhau",
  "mayurbhanj-patrons",
  "mayurbhanj-traditions",
  "mayurbhanj-movement-techniques",
  "mayurbhanj-evolution-and-pioneers",
  "mayurbhanj-performance-lab",
]);
const SERAIKELLA_IDS = new Set<string>([
  "entering-seraikella-chhau",
  "seraikella-patrons",
  "seraikella-traditions",
  "seraikella-movement-techniques",
  "seraikella-evolution-and-pioneers",
  "seraikella-performance-lab",
]);
const PURULIA_IDS = new Set<string>([
  "entering-purulia-chhau",
  "purulia-patrons",
  "purulia-traditions",
  "purulia-movement-techniques",
  "purulia-evolution-and-pioneers",
  "purulia-performance-lab",
]);
const WORLD_IDS = new Set<string>([
  "what-is-chhau",
  "origins-etymology-and-historical-layers",
  "the-chhau-body",
  "movement-vocabulary-and-formations",
  "storytelling-and-archetypes",
  "expressions",
  "music-rhythm-and-instruments",
  "costumes-and-colour",
  "masks",
  "props",
  "performance-space-training-and-community",
]);
const REFERENCE_IDS = new Set<string>([
  "glossary",
  "index-of-people-places-and-institutions",
  "library",
]);

function getChapterEyebrow(page: BookPage): string | null {
  if (page.title.includes(" — ")) {
    return page.title.split(" — ")[0];
  }
  if (MAYURBHANJ_IDS.has(page.id)) return "Mayurbhanj";
  if (SERAIKELLA_IDS.has(page.id)) return "Seraikella";
  if (PURULIA_IDS.has(page.id)) return "Purulia";
  if (WORLD_IDS.has(page.id)) return "The World of Chhau";
  if (REFERENCE_IDS.has(page.id)) return "Reference";
  return null;
}

function getChapterTitle(page: BookPage): string {
  if (page.title.includes(" — ")) {
    return page.title.split(" — ").slice(1).join(" — ");
  }
  return page.title;
}

// Return a Part label to render above the *first* chapter of each section
// in the sidebar. Returns null otherwise.
function getSidebarPartLabel(page: BookPage, index: number): string | null {
  if (index === 0) return "Front matter";
  const prev = bookPages[index - 1];
  if (page.pageType === "section") return null; // section pages already carry their own label
  // Look back: find the most recent section page; if it's exactly the
  // previous page, emit its label group.
  if (prev && prev.pageType === "section") {
    const t = prev.title;
    if (t.includes(" — ")) return t.split(" — ").slice(1).join(" — ");
    return t;
  }
  return null;
}

type ViewerLayout = "hero" | "side-right" | "side-left" | "stacked";

type ViewerPlacement = {
  layout: ViewerLayout;
  anchorBlockIndex: number | null;
};

function decideViewerPlacement(
  page: BookPage,
  modelCount: number,
): ViewerPlacement {
  const body = page.body;
  const blocks = body.split(/\n{2,}/);
  const anchorIndex = blocks.findIndex((b) => {
    const t = b.trim();
    return SANDBOX_ANCHOR_PATTERN.test(t);
  });

  const wordCount = body.trim().split(/\s+/).filter(Boolean).length;

  let layout: ViewerLayout;
  if (wordCount < 220) {
    layout = "hero";
  } else if (modelCount > 1 && wordCount < 600) {
    layout = "stacked";
  } else if (page.pageNumber % 2 === 0) {
    layout = "side-right";
  } else {
    layout = "side-left";
  }

  return {
    layout,
    anchorBlockIndex: anchorIndex >= 0 ? anchorIndex : null,
  };
}

const ChauModelViewer = dynamic(
  () =>
    import("@/components/ChauModelViewer").then(
      (module) => module.ChauModelViewer,
    ),
  {
    loading: () => <ViewerLoading />,
    ssr: false,
  },
);

type IconProps = {
  className?: string;
};

type BookContentProps = {
  currentChapter: number;
  modelOptions: Array<{
    label: string;
    modelUrl: string;
    modelScale?: number;
  }>;
  page: BookPage;
  selectedModelIndex: number;
  setSelectedModelIndex: (index: number) => void;
  setCurrentChapter: (chapter: number) => void;
  viewer?: ReactNode;
};

const pageAnimationClasses: Record<BookPage["animationStyle"], string> = {
  "page-turn-soft": "page-enter",
  "page-turn-minimal": "page-enter-minimal",
  "paper-slide": "paper-slide-enter",
  "sheet-glide": "sheet-glide-enter",
  "chapter-fade": "chapter-fade-enter",
  "chapter-slide": "chapter-slide-enter",
  "spread-open": "spread-open-enter",
  "spread-close": "spread-close-enter",
  "paper-lift": "paper-lift-enter",
  "paper-settle": "paper-settle-enter",
};

const hasAnyViewer = bookPages.some(
  (page) => page.modelUrl || page.modelOptions?.length || page.showFallbackScene,
);

const THEME_AUDIO_URL = "/audio/main-theme-ebook.mp3";
const THEME_START_VOLUME = 0.28;

export function InteractiveEbookInterface() {
  const [viewMode, setViewMode] = useState<"text" | "3d">("text");
  const [currentChapter, setCurrentChapter] = useState(0);
  const [selectedModelIndexes, setSelectedModelIndexes] = useState<
    Record<string, number>
  >({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pendingCitation, setPendingCitation] = useState<number | null>(null);
  const [themePlaying, setThemePlaying] = useState(false);
  const [themeVolume, setThemeVolume] = useState(THEME_START_VOLUME);
  const desktopPageScrollRef = useRef<HTMLDivElement>(null);
  const mobilePageScrollRef = useRef<HTMLDivElement>(null);
  const chapterButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const themeAudioRef = useRef<HTMLAudioElement>(null);

  const libraryPageIndex = useMemo(
    () => bookPages.findIndex((p) => p.id === LIBRARY_PAGE_ID),
    [],
  );

  const handleCitationClick = useCallback(
    (citationNumber: number) => {
      if (libraryPageIndex < 0) return;
      setCurrentChapter(libraryPageIndex);
      setPendingCitation(citationNumber);
    },
    [libraryPageIndex],
  );

  const citationContextValue = useMemo<CitationContextValue>(
    () => ({ onCiteClick: handleCitationClick }),
    [handleCitationClick],
  );

  useEffect(() => {
    if (pendingCitation === null) return;
    if (currentChapter !== libraryPageIndex) return;

    const id = `cite-${pendingCitation}`;
    let attempts = 0;

    function tryScroll() {
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "center" });
        target.classList.add("cite-flash");
        window.setTimeout(() => {
          target.classList.remove("cite-flash");
        }, 1800);
        setPendingCitation(null);
        return;
      }
      attempts += 1;
      if (attempts < 20) {
        window.setTimeout(tryScroll, 60);
      } else {
        setPendingCitation(null);
      }
    }

    window.setTimeout(tryScroll, 80);
  }, [pendingCitation, currentChapter, libraryPageIndex]);
  const currentPage = bookPages[currentChapter] ?? bookPages[0];
  const modelOptions = useMemo(
    () =>
      currentPage.modelOptions?.length
        ? currentPage.modelOptions
        : currentPage.modelUrl
          ? [
              {
                label: "3D model",
                modelScale: currentPage.modelScale,
                modelUrl: currentPage.modelUrl,
              },
            ]
          : [],
    [currentPage],
  );
  const selectedModelIndex = Math.min(
    selectedModelIndexes[currentPage.id] ?? 0,
    Math.max(modelOptions.length - 1, 0),
  );
  const selectedModel = modelOptions[selectedModelIndex];
  const shouldShowViewer = Boolean(selectedModel || currentPage.showFallbackScene);
  const effectiveViewMode = shouldShowViewer ? viewMode : "text";

  function setSelectedModelIndex(index: number) {
    setSelectedModelIndexes((previousIndexes) => ({
      ...previousIndexes,
      [currentPage.id]: index,
    }));
  }

  useEffect(() => {
    desktopPageScrollRef.current?.scrollTo({ top: 0 });
    mobilePageScrollRef.current?.scrollTo({ top: 0 });
  }, [currentChapter]);

  useEffect(() => {
    if (!sidebarOpen) {
      return;
    }

    chapterButtonRefs.current[currentChapter]?.scrollIntoView({
      block: "nearest",
    });
  }, [currentChapter, sidebarOpen]);

  useEffect(() => {
    if (themeAudioRef.current) {
      themeAudioRef.current.volume = themeVolume;
    }
  }, [themeVolume]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Leave browser/system shortcuts (Alt+Arrow history nav, etc.) alone.
      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      const target = event.target as HTMLElement | null;
      const targetTagName = target?.tagName;

      if (
        targetTagName &&
        ["INPUT", "TEXTAREA", "SELECT"].includes(targetTagName)
      ) {
        return;
      }

      if (event.key === "Escape") {
        setSidebarOpen(false);
        return;
      }

      if (event.key === "ArrowRight") {
        setCurrentChapter((chapter) =>
          Math.min(chapter + 1, bookPages.length - 1),
        );
        return;
      }

      if (event.key === "ArrowLeft") {
        setCurrentChapter((chapter) => Math.max(chapter - 1, 0));
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function goToNextChapter() {
    if (currentChapter < bookPages.length - 1) {
      setCurrentChapter(currentChapter + 1);
    }
  }

  function goToPreviousChapter() {
    if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1);
    }
  }

  async function toggleThemeMusic() {
    const audio = themeAudioRef.current;
    if (!audio) return;

    if (themePlaying) {
      audio.pause();
      setThemePlaying(false);
      return;
    }

    try {
      audio.volume = themeVolume;
      await audio.play();
      setThemePlaying(true);
    } catch {
      setThemePlaying(false);
    }
  }

  const viewer = useMemo(
    () =>
      shouldShowViewer ? (
        <ChauModelViewer
          className={`rounded-sm ${currentPage.modelFrameStyle}`}
          modelScale={selectedModel?.modelScale ?? currentPage.modelScale}
          modelUrl={selectedModel?.modelUrl ?? currentPage.modelUrl}
          showFallbackScene={currentPage.showFallbackScene}
        />
      ) : null,
    [currentPage, selectedModel, shouldShowViewer],
  );

  const readingProgress = useMemo(() => {
    const denominator = Math.max(bookPages.length - 1, 1);
    const pct = (currentChapter / denominator) * 100;
    return Math.min(100, Math.max(0, pct));
  }, [currentChapter]);

  return (
    <CitationContext.Provider value={citationContextValue}>
    <div className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#050606_0%,#10201f_46%,#190b09_100%)] font-reader text-yellow-50">
      <audio
        loop
        onPause={() => setThemePlaying(false)}
        onPlay={() => setThemePlaying(true)}
        preload="auto"
        ref={themeAudioRef}
        src={THEME_AUDIO_URL}
      />
      <div aria-hidden="true" className="reading-progress">
        <div
          className="reading-progress-fill"
          style={{ ["--progress" as string]: `${readingProgress}%` }}
        />
      </div>
      {sidebarOpen ? (
        <button
          aria-label="Close chapter navigation"
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-[1px] md:hidden"
          onClick={() => setSidebarOpen(false)}
          type="button"
        />
      ) : null}

      <aside
        aria-label="Chapter navigation"
        className="fixed left-0 top-0 z-40 h-full w-[min(20rem,calc(100vw-1.5rem))] transition-transform duration-300 ease-out"
        onMouseLeave={() => setSidebarOpen(false)}
        style={{
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        }}
      >
        <div className="flex h-full min-h-0 flex-col border-r border-teal-900/40 bg-[#050807]/95 p-5 shadow-2xl backdrop-blur-xl">
          <div className="mb-4 flex shrink-0 items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#efe7d0]">
                Chapters
              </h3>
              <p className="mt-1 text-xs text-[#efe7d0]/45">
                {bookPages.length} pages
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                aria-label="Back to PreserveChhau home"
                className="grid h-9 w-9 place-items-center rounded-sm border border-teal-700/45 bg-teal-900/45 text-[#efe7d0] transition hover:bg-teal-800/65"
                href="/"
              >
                <HomeIcon className="h-4 w-4" />
              </Link>
              <button
                aria-label="Close chapter navigation"
                className="grid h-9 w-9 place-items-center rounded-sm border border-teal-700/45 bg-teal-900/45 text-[#efe7d0] transition hover:bg-teal-800/65"
                onClick={() => setSidebarOpen(false)}
                type="button"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          <ThemeMusicControls
            isPlaying={themePlaying}
            onToggle={toggleThemeMusic}
            onVolumeChange={setThemeVolume}
            volume={themeVolume}
          />

          <div className="-mr-2 min-h-0 flex-1 overflow-y-auto pr-2">
            <nav className="pb-4">
              {bookPages.map((chapter, index) => {
                const partLabel = getSidebarPartLabel(chapter, index);
                return (
                  <div key={chapter.id}>
                    {partLabel ? (
                      <div className="sidebar-part-label">{partLabel}</div>
                    ) : null}
                    <button
                      aria-current={
                        index === currentChapter ? "page" : undefined
                      }
                      className={`mb-1 flex w-full items-start gap-2.5 rounded-sm px-3 py-2 text-left transition ${
                        index === currentChapter
                          ? "bg-teal-700 text-[#fff8df]"
                          : "text-[#efe7d0]/65 hover:bg-teal-700/20 hover:text-[#fff8df]"
                      }`}
                      onClick={() => {
                        setCurrentChapter(index);
                        setSidebarOpen(false);
                      }}
                      ref={(element) => {
                        chapterButtonRefs.current[index] = element;
                      }}
                      type="button"
                    >
                      <span
                        aria-hidden="true"
                        className={`mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full ${
                          index === currentChapter
                            ? "bg-[#fff8df]"
                            : chapter.pageType === "section"
                              ? "bg-[#c84a30]/70"
                              : "bg-[#efe7d0]/30"
                        }`}
                      />
                      <span className="block flex-1">
                        <span className="block font-mono text-[10px] opacity-60">
                          Page {chapter.pageNumber + 1}
                        </span>
                        <span className="block text-sm leading-snug">
                          {getNavTitle(chapter.title)}
                        </span>
                      </span>
                    </button>
                  </div>
                );
              })}
            </nav>
          </div>

          <div className="shrink-0 space-y-2 border-t border-teal-900/40 pt-4">
            <button
              className="flex h-11 w-full items-center justify-center gap-2 rounded-sm border border-teal-700/45 bg-teal-900/45 px-3 text-sm font-semibold text-[#efe7d0] transition hover:bg-teal-800/65 disabled:cursor-not-allowed disabled:opacity-30"
              disabled={currentChapter === 0}
              onClick={goToPreviousChapter}
              type="button"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              Previous
            </button>
            <button
              className="flex h-11 w-full items-center justify-center gap-2 rounded-sm border border-[#7e261e] bg-[#9b2f22] px-3 text-sm font-semibold text-[#fff8df] transition hover:bg-[#84271d] disabled:cursor-not-allowed disabled:opacity-30"
              disabled={currentChapter === bookPages.length - 1}
              onClick={goToNextChapter}
              type="button"
            >
              Next
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <button
        aria-label="Open chapter navigation"
        className="fixed left-0 top-0 z-50 hidden h-full w-3 cursor-pointer md:block"
        onClick={() => setSidebarOpen(true)}
        onFocus={() => setSidebarOpen(true)}
        onMouseEnter={() => setSidebarOpen(true)}
        type="button"
      />
      {!sidebarOpen ? (
        <div className="fixed left-3 top-3 z-50 flex gap-2">
          <button
            aria-expanded={sidebarOpen}
            aria-label="Open chapter navigation"
            className="grid h-11 w-11 place-items-center rounded-sm border border-teal-700/45 bg-[#050807]/90 text-[#efe7d0] shadow-2xl backdrop-blur transition hover:bg-teal-900/80"
            onClick={() => setSidebarOpen(true)}
            type="button"
          >
            <MenuIcon className="h-5 w-5" />
          </button>
          <Link
            aria-label="Back to PreserveChhau home"
            className="grid h-11 w-11 place-items-center rounded-sm border border-teal-700/45 bg-[#050807]/90 text-[#efe7d0] shadow-2xl backdrop-blur transition hover:bg-teal-900/80"
            href="/"
          >
            <HomeIcon className="h-5 w-5" />
          </Link>
          <button
            aria-label={themePlaying ? "Pause theme music" : "Play theme music"}
            className="grid h-11 w-11 place-items-center rounded-sm border border-teal-700/45 bg-[#050807]/90 text-[#efe7d0] shadow-2xl backdrop-blur transition hover:bg-teal-900/80"
            onClick={toggleThemeMusic}
            type="button"
          >
            {themePlaying ? (
              <PauseIcon className="h-5 w-5" />
            ) : (
              <MusicIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      ) : null}

      <main
        className="relative flex min-h-screen w-full flex-col overflow-hidden"
        id="main-content"
      >
        <div className="hidden min-h-screen p-3 md:block">
          <div
            className="relative h-[calc(100vh-1.5rem)] overflow-y-auto scroll-smooth"
            ref={desktopPageScrollRef}
          >
            <BookContent
              currentChapter={currentChapter}
              modelOptions={modelOptions}
              page={currentPage}
              selectedModelIndex={selectedModelIndex}
              setSelectedModelIndex={setSelectedModelIndex}
              setCurrentChapter={setCurrentChapter}
              viewer={viewer}
            />

            <button
              aria-label="Previous chapter"
              className="absolute bottom-0 left-0 top-0 z-10 w-20 transition hover:bg-white/5 disabled:pointer-events-none"
              disabled={currentChapter === 0}
              onClick={goToPreviousChapter}
              type="button"
            />
            <button
              aria-label="Next chapter"
              className="absolute bottom-0 right-0 top-0 z-10 w-20 transition hover:bg-white/5 disabled:pointer-events-none"
              disabled={currentChapter === bookPages.length - 1}
              onClick={goToNextChapter}
              type="button"
            />
          </div>
        </div>

        <div className="flex min-h-screen flex-col md:hidden">
          <div className="flex shrink-0 justify-center gap-2 bg-black/45 p-4 pl-16">
            <button
              aria-label="View text"
              className={`grid h-10 w-10 place-items-center rounded-sm transition ${
                effectiveViewMode === "text"
                  ? "bg-teal-700 text-[#fff8df]"
                  : "border border-teal-700/45 bg-teal-900/45 text-[#efe7d0] hover:bg-teal-800/65"
              }`}
              onClick={() => setViewMode("text")}
              type="button"
            >
              <BookOpenIcon className="h-5 w-5" />
            </button>
            {hasAnyViewer ? (
              <button
                aria-label="View 3D"
                className={`grid h-10 w-10 place-items-center rounded-sm transition ${
                  effectiveViewMode === "3d"
                    ? "bg-teal-700 text-[#fff8df]"
                    : "border border-teal-700/45 bg-teal-900/45 text-[#efe7d0] hover:bg-teal-800/65 disabled:cursor-not-allowed disabled:opacity-35"
                }`}
                disabled={!shouldShowViewer}
                onClick={() => setViewMode("3d")}
                type="button"
              >
                <CubeIcon className="h-5 w-5" />
              </button>
            ) : null}
          </div>

          {effectiveViewMode === "text" ? (
            <div
              className="min-h-0 flex-1 overflow-y-auto scroll-smooth p-4"
              ref={mobilePageScrollRef}
            >
              <BookContent
                currentChapter={currentChapter}
                modelOptions={modelOptions}
                page={currentPage}
                selectedModelIndex={selectedModelIndex}
                setSelectedModelIndex={setSelectedModelIndex}
                setCurrentChapter={setCurrentChapter}
              />
            </div>
          ) : null}

          {effectiveViewMode === "3d" ? (
            <div className="min-h-0 flex-1 overflow-hidden p-4">
              <div className="h-full overflow-hidden rounded-sm border border-yellow-900/30 shadow-2xl">
                {viewer}
              </div>
            </div>
          ) : null}
        </div>
      </main>
    </div>
    </CitationContext.Provider>
  );
}

function ViewerLoading() {
  return (
    <div className="grid h-full min-h-[320px] w-full place-items-center rounded-sm border border-yellow-900/30 bg-[#1a1410] text-sm font-medium text-[#efe7d0]/75">
      Loading 3D
    </div>
  );
}

function ThemeMusicControls({
  isPlaying,
  onToggle,
  onVolumeChange,
  volume,
}: {
  isPlaying: boolean;
  onToggle: () => void;
  onVolumeChange: (volume: number) => void;
  volume: number;
}) {
  return (
    <div className="mb-4 shrink-0 rounded-sm border border-teal-900/45 bg-black/20 p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#efe7d0]/45">
            Theme music
          </p>
          <p className="truncate text-xs font-semibold text-[#efe7d0]">
            Main Theme eBook
          </p>
        </div>
        <button
          aria-label={isPlaying ? "Pause theme music" : "Play theme music"}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-sm border border-teal-700/45 bg-teal-900/45 text-[#efe7d0] transition hover:bg-teal-800/65"
          onClick={onToggle}
          type="button"
        >
          {isPlaying ? (
            <PauseIcon className="h-4 w-4" />
          ) : (
            <MusicIcon className="h-4 w-4" />
          )}
        </button>
      </div>
      <label className="mt-3 flex items-center gap-2 text-[#efe7d0]/70">
        <VolumeIcon className="h-4 w-4 shrink-0" />
        <span className="sr-only">Theme music volume</span>
        <input
          aria-label="Theme music volume"
          className="music-volume-slider"
          max="1"
          min="0"
          onChange={(event) => onVolumeChange(Number(event.target.value))}
          step="0.01"
          type="range"
          value={volume}
        />
      </label>
    </div>
  );
}

function BookContent({
  currentChapter,
  modelOptions,
  page,
  selectedModelIndex,
  setSelectedModelIndex,
  setCurrentChapter,
  viewer,
}: BookContentProps) {
  const [isFlipping, setIsFlipping] = useState(false);
  const chapter = page;
  const enterAnimationClass =
    pageAnimationClasses[chapter.animationStyle] ?? "page-enter";

  function goToNextChapter() {
    if (currentChapter < bookPages.length - 1) {
      setIsFlipping(true);
      window.setTimeout(() => {
        setCurrentChapter(currentChapter + 1);
        setIsFlipping(false);
      }, 360);
    }
  }

  function goToPreviousChapter() {
    if (currentChapter > 0) {
      setIsFlipping(true);
      window.setTimeout(() => {
        setCurrentChapter(currentChapter - 1);
        setIsFlipping(false);
      }, 360);
    }
  }

  return (
    <article
      className="heritage-paper relative min-h-full rounded-sm"
      style={{ background: chapter.backgroundStyle }}
    >
      <div
        className={`relative min-h-full p-6 transition duration-300 sm:p-8 md:p-10 ${
          isFlipping ? "page-exit" : enterAnimationClass
        }`}
      >
        {chapter.coverImageUrl ? (
          <CoverPage page={chapter} />
        ) : chapter.pageType === "section" ? (
          <SectionPage page={chapter} />
        ) : (
          <ContentPageBody
            chapter={chapter}
            modelOptions={modelOptions}
            selectedModelIndex={selectedModelIndex}
            setSelectedModelIndex={setSelectedModelIndex}
            viewer={viewer}
          />
        )}

        <div className="mt-10 flex items-center justify-between gap-3">
          <button
            className="h-11 rounded-sm border border-yellow-900/30 px-4 text-sm font-semibold text-[#2a1609] disabled:cursor-not-allowed disabled:opacity-40"
            disabled={currentChapter === 0}
            onClick={goToPreviousChapter}
            type="button"
          >
            Previous
          </button>
          <span className="font-reader text-xs font-semibold uppercase tracking-[0.16em] text-[#2a1609]/55">
            Page {currentChapter + 1} of {bookPages.length}
          </span>
          <button
            className="h-11 rounded-sm bg-orange-800 px-4 text-sm font-semibold text-yellow-50 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={currentChapter === bookPages.length - 1}
            onClick={goToNextChapter}
            type="button"
          >
            Next
          </button>
        </div>
      </div>
    </article>
  );
}

type ContentPageBodyProps = {
  chapter: BookPage;
  modelOptions: BookContentProps["modelOptions"];
  selectedModelIndex: number;
  setSelectedModelIndex: (index: number) => void;
  viewer?: ReactNode;
};

function ContentPageBody({
  chapter,
  modelOptions,
  selectedModelIndex,
  setSelectedModelIndex,
  viewer,
}: ContentPageBodyProps) {
  const placement = useMemo(
    () => decideViewerPlacement(chapter, modelOptions.length),
    [chapter, modelOptions.length],
  );

  const viewerBlock = viewer ? (
    <div className="space-y-3">
      <ModelChoiceTabs
        align="start"
        modelOptions={modelOptions}
        selectedModelIndex={selectedModelIndex}
        setSelectedModelIndex={setSelectedModelIndex}
      />
      <div
        className="relative z-10 overflow-hidden rounded-sm shadow-lg ring-1 ring-black/5"
        style={{
          background: chapter.modelViewerBackground,
          height: chapter.modelViewerHeight,
          minHeight: 360,
        }}
      >
        {viewer}
      </div>
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#2a1609]/55">
        Drag to rotate · scroll to zoom · open the toolbar to switch modes
      </p>
    </div>
  ) : null;

  const showHero =
    viewerBlock && placement.layout === "hero" && placement.anchorBlockIndex === null;
  const showStacked =
    viewerBlock && placement.layout === "stacked" && placement.anchorBlockIndex === null;
  const sideClass =
    placement.layout === "side-left"
      ? "md:float-left md:mr-6 md:w-[46%]"
      : "md:float-right md:ml-6 md:w-[46%]";
  const useSideFloat =
    viewerBlock &&
    (placement.layout === "side-right" || placement.layout === "side-left") &&
    placement.anchorBlockIndex === null;

  const inlineViewerNode =
    viewerBlock && placement.anchorBlockIndex !== null ? (
      <div className="rounded-sm">{viewerBlock}</div>
    ) : null;

  return (
    <>
      {showHero ? (
        <div className="mb-6 mx-auto max-w-3xl">{viewerBlock}</div>
      ) : null}

      {(() => {
        const eyebrow = getChapterEyebrow(chapter);
        const title = getChapterTitle(chapter);
        return (
          <header className="mb-6">
            {eyebrow ? (
              <div className="chapter-eyebrow">{eyebrow}</div>
            ) : null}
            <h1
              className="chapter-title heritage-text text-3xl font-bold leading-[1.08] text-[#2a1609] sm:text-5xl"
              style={{
                color: chapter.textStyle.headingColor,
                fontStyle: chapter.textStyle.fontStyle,
              }}
            >
              {title}
            </h1>
          </header>
        );
      })()}

      {showStacked ? (
        <div className="mb-6">{viewerBlock}</div>
      ) : null}

      {useSideFloat ? (
        <div className={`relative z-10 mb-6 ${sideClass}`}>{viewerBlock}</div>
      ) : null}

      {chapter.body.trim().length > 0 ? (
        <MarkdownContent
          anchorBlockIndex={inlineViewerNode ? placement.anchorBlockIndex : null}
          page={chapter}
          viewerNode={inlineViewerNode}
        />
      ) : null}

      <div className="clear-both" />

      {chapter.interactive === "sandbox-guide" ? <SandboxGuide /> : null}

      {chapter.embedUrl ? (
        <PageEmbed
          caption={chapter.embedCaption}
          height={chapter.embedHeight}
          src={chapter.embedUrl}
          title={chapter.embedTitle ?? chapter.title}
        />
      ) : null}

      {chapter.videoUrl ? (
        <PageVideo caption={chapter.videoCaption} src={chapter.videoUrl} />
      ) : null}

      {chapter.gallery?.length ? <PageMediaGallery images={chapter.gallery} /> : null}

      {chapter.audioTracks?.length ? (
        <div className="mt-6 space-y-4">
          {chapter.audioTracks.map((track) => (
            <PageAudioPlayer
              caption={track.caption}
              key={track.src}
              loop={track.loop}
              src={track.src}
              title={track.title}
            />
          ))}
        </div>
      ) : null}

      <PageAudio page={chapter} />
    </>
  );
}

function ModelChoiceTabs({
  align = "end",
  modelOptions,
  selectedModelIndex,
  setSelectedModelIndex,
}: {
  align?: "start" | "end";
  modelOptions: BookContentProps["modelOptions"];
  selectedModelIndex: number;
  setSelectedModelIndex: (index: number) => void;
}) {
  if (modelOptions.length <= 1) {
    return null;
  }

  const alignClass = align === "start" ? "justify-start" : "md:justify-end";

  return (
    <div className={`relative z-20 flex flex-wrap gap-2 ${alignClass}`}>
      {modelOptions.map((option, index) => (
        <button
          className={`rounded-sm border px-3 py-1.5 font-reader text-xs font-semibold transition ${
            selectedModelIndex === index
              ? "border-[#7e261e] bg-[#9b2f22] text-[#fff8df]"
              : "border-[#8a6a3d]/35 bg-[#fff8df]/55 text-[#2a1609] hover:bg-[#fff8df]/85"
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

function SectionPage({ page }: { page: BookPage }) {
  const eyebrow = page.title.includes(" — ")
    ? page.title.split(" — ")[0]
    : null;
  const display = page.title.includes(" — ")
    ? page.title.split(" — ").slice(1).join(" — ")
    : page.title;

  return (
    <div className="section-cover">
      <div aria-hidden="true" className="section-cover-frame">
        <span />
      </div>
      <div className="relative z-10 max-w-2xl">
        {eyebrow ? (
          <div className="chapter-eyebrow justify-center">{eyebrow}</div>
        ) : null}
        <h1
          className="heritage-text chapter-title text-4xl font-bold leading-[1.05] sm:text-6xl"
          style={{
            color: page.textStyle.headingColor,
            fontStyle: page.textStyle.fontStyle,
          }}
        >
          {display}
        </h1>
        <div className="section-cover-fleuron">❦</div>
      </div>
    </div>
  );
}

type MarkdownContentProps = {
  page: BookPage;
  viewerNode?: ReactNode;
  anchorBlockIndex?: number | null;
};

function MarkdownContent({
  page,
  viewerNode,
  anchorBlockIndex,
}: MarkdownContentProps) {
  const blocks = page.body.split(/\n{2,}/);
  const nodes: ReactNode[] = [];

  // First paragraph (non-blockquote, non-heading, non-list) gets drop cap.
  let firstParagraphIndex = -1;
  for (let i = 0; i < blocks.length; i++) {
    const t = blocks[i].trim();
    if (t.length === 0) continue;
    if (t.startsWith("###") || t.startsWith(">") || t.startsWith("- ")) continue;
    firstParagraphIndex = i;
    break;
  }

  blocks.forEach((block, index) => {
    if (
      viewerNode &&
      anchorBlockIndex !== null &&
      anchorBlockIndex !== undefined &&
      index === anchorBlockIndex
    ) {
      nodes.push(
        <div className="my-6" key={`${page.id}-viewer-anchor`}>
          {viewerNode}
        </div>,
      );
    }
    const trimmed = block.trim();
    // Render a fleuron BEFORE every ### subheading (except the very first
    // block, where it would float above with no preceding content).
    if (index > 0 && trimmed.startsWith("### ")) {
      nodes.push(
        <Fleuron key={`${page.id}-fleuron-${index}`} />,
      );
    }
    const rendered = renderMarkdownBlock(
      block,
      `${page.id}-${index}`,
      page,
      index === firstParagraphIndex,
    );
    if (rendered) {
      nodes.push(rendered);
    }
  });

  const isReferencePage = REFERENCE_IDS.has(page.id);
  const className = isReferencePage
    ? "heritage-text space-y-4"
    : "book-prose heritage-text space-y-4";

  return <div className={className}>{nodes}</div>;
}

function Fleuron() {
  return (
    <div aria-hidden="true" className="fleuron">
      <span className="fleuron-line" />
      <span className="fleuron-glyph">❦</span>
      <span className="fleuron-line" />
    </div>
  );
}

function renderMarkdownBlock(
  block: string,
  key: string,
  page: BookPage,
  isFirstParagraph: boolean,
) {
  const trimmedBlock = block.trim();

  if (trimmedBlock.length === 0) {
    return null;
  }

  if (trimmedBlock.startsWith("### ")) {
    return (
      <h2
        className="mt-8 text-xl font-semibold leading-tight sm:text-2xl"
        key={key}
        style={{ color: page.textStyle.headingColor }}
      >
        {renderInlineMarkdown(trimmedBlock.slice(4))}
      </h2>
    );
  }

  if (trimmedBlock.startsWith("> ")) {
    return (
      <blockquote
        className="my-6 rounded-r-sm border-l-[3px] border-[#7e261e]/50 bg-[#fff4d6]/40 px-5 py-3 text-sm italic leading-7 text-[#4d2d18] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] sm:text-base"
        key={key}
      >
        {renderInlineMarkdown(trimmedBlock.replace(/^>\s?/gm, ""))}
      </blockquote>
    );
  }

  const listItems = trimmedBlock.split("\n");
  if (listItems.every((line) => line.startsWith("- "))) {
    return (
      <ul
        className="ml-5 list-disc space-y-2 text-sm leading-7 sm:text-base sm:leading-8"
        key={key}
        style={{ color: page.textStyle.bodyTextColor }}
      >
        {listItems.map((line) => (
          <li key={line}>{renderInlineMarkdown(line.slice(2))}</li>
        ))}
      </ul>
    );
  }

  const libraryEntryMatch = trimmedBlock.match(LIBRARY_ENTRY_PATTERN);
  if (libraryEntryMatch) {
    const num = libraryEntryMatch[1];
    const rest = trimmedBlock.replace(LIBRARY_ENTRY_PATTERN, "");
    return (
      <p
        className="library-entry text-sm leading-7 text-[#2a1609] sm:text-base sm:leading-8"
        data-cite-number={num}
        id={`cite-${num}`}
        key={key}
        style={{
          color: page.textStyle.bodyTextColor,
          lineHeight: page.textStyle.lineHeight,
        }}
      >
        {renderInlineMarkdown(rest)}
      </p>
    );
  }

  return (
    <p
      className={`whitespace-pre-wrap text-sm leading-7 text-[#2a1609] sm:text-base sm:leading-8 ${isFirstParagraph ? "first-paragraph" : ""}`}
      key={key}
      style={{
        color: page.textStyle.bodyTextColor,
        fontStyle: page.textStyle.fontStyle,
        lineHeight: page.textStyle.lineHeight,
      }}
    >
      {renderInlineMarkdown(trimmedBlock)}
    </p>
  );
}

function renderInlineMarkdown(text: string): ReactNode[] {
  const pieces = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|(?:\[\d+\])+)/g);

  return pieces.map((piece, index) => {
    if (piece.startsWith("**") && piece.endsWith("**")) {
      return <strong key={`${piece}-${index}`}>{piece.slice(2, -2)}</strong>;
    }

    if (piece.startsWith("*") && piece.endsWith("*")) {
      return <em key={`${piece}-${index}`}>{piece.slice(1, -1)}</em>;
    }

    if (/^(\[\d+\])+$/.test(piece)) {
      const numbers = Array.from(piece.matchAll(/\[(\d+)\]/g)).map((m) =>
        Number.parseInt(m[1], 10),
      );
      return (
        <CitationGroup
          key={`${piece}-${index}`}
          numbers={numbers}
        />
      );
    }

    return <span key={`${piece}-${index}`}>{piece}</span>;
  });
}

function CitationGroup({ numbers }: { numbers: number[] }) {
  const onCiteClick = useCitationOnClick();

  return (
    <sup className="ml-0.5 inline-flex gap-0.5 text-[0.62em] font-semibold tracking-tight">
      {numbers.map((n, i) => (
        <button
          aria-label={`Jump to source ${n}`}
          className="inline-flex h-[1.6em] items-center rounded-[3px] border border-[#7e261e]/40 bg-[#fff8df]/85 px-1 leading-none text-[#7e261e] no-underline transition hover:bg-[#9b2f22] hover:text-[#fff8df]"
          key={`${n}-${i}`}
          onClick={() => onCiteClick(n)}
          type="button"
        >
          {n}
        </button>
      ))}
    </sup>
  );
}

function CoverPage({ page }: { page: BookPage }) {
  if (!page.coverImageUrl) {
    return null;
  }

  // A single <picture> with a media-query source, so each device downloads
  // only its own cover art (two CSS-hidden <Image priority> elements would
  // fetch both crops on every visit).
  const alt = page.coverImageAlt ?? page.title;
  const common = { alt, fill: true as const, sizes: "100vw", priority: true };
  const { props: desktopProps } = getImageProps({
    ...common,
    src: page.coverImageLargeUrl ?? page.coverImageUrl,
  });
  const {
    props: { alt: mobileAlt, ...mobileProps },
  } = getImageProps({ ...common, src: page.coverImageUrl });

  return (
    <div className="relative min-h-[calc(100vh-13rem)] overflow-hidden rounded-sm bg-black md:min-h-[calc(100vh-11rem)]">
      <picture>
        <source media="(min-width: 768px)" srcSet={desktopProps.srcSet} />
        <img {...mobileProps} alt={mobileAlt} className="object-contain" />
      </picture>
      <div className="absolute bottom-4 left-1/2 z-20 w-[min(28rem,calc(100%-2rem))] -translate-x-1/2">
        <PageAudio className="w-full" page={page} tone="dark" />
      </div>
    </div>
  );
}

function PageAudio({
  className = "mt-6 w-full",
  page,
  tone = "paper",
}: {
  className?: string;
  page: BookPage;
  tone?: "paper" | "dark";
}) {
  if (!page.audioUrl) {
    return null;
  }

  return (
    <PageAudioPlayer
      className={className}
      loop={page.audioLoop}
      src={page.audioUrl}
      tone={tone}
    />
  );
}

function getNavTitle(title: string) {
  const [, ...rest] = title.split(": ");

  return rest.length > 0 ? rest.join(": ") : title;
}

function HomeIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
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
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function CloseIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="m6 6 12 12M18 6 6 18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function MusicIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M9 18V5l11-2v13"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M9 18a3 3 0 1 1-2-2.83M20 16a3 3 0 1 1-2-2.83M9 9l11-2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function PauseIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M10 5v14M14 5v14"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function VolumeIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M4 9v6h4l5 4V5L8 9H4Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M16 9.5a4 4 0 0 1 0 5M18.5 7a7.5 7.5 0 0 1 0 10"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function ChevronLeftIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="m15 18-6-6 6-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function ChevronRightIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="m9 18 6-6-6-6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function BookOpenIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M12 6.5v13M12 6.5A2.5 2.5 0 0 0 9.5 4H3v14h6.5a2.5 2.5 0 0 1 2.5 2.5m0-14A2.5 2.5 0 0 1 14.5 4H21v14h-6.5a2.5 2.5 0 0 0-2.5 2.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function CubeIcon({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="m12 2 8 4.5v9L12 20l-8-4.5v-9L12 2Zm0 0v9m8-4.5-8 4.5m-8-4.5 8 4.5m0 9v-9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}
