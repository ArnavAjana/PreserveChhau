// .design-sync/stubs/next-link.tsx
import React from "react";
var Link = React.forwardRef(
  function Link2({ href, prefetch: _prefetch, children, ...rest }, ref) {
    return /* @__PURE__ */ React.createElement("a", { href, ref, ...rest }, children);
  }
);
Link.displayName = "Link";
var next_link_default = Link;

// .design-sync/stubs/next-navigation.ts
function usePathname() {
  return "/";
}

// chau-web/src/components/Header.tsx
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var links = [
  { href: "/", label: "Home" },
  { href: "/ebook", label: "eBook" },
  { href: "/experience", label: "3D Gallery" }
];
function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = (href) => href === "/" ? pathname === "/" : pathname.startsWith(href);
  return /* @__PURE__ */ jsxs("header", { className: "sticky top-0 z-50 border-b border-laterite-900/10 bg-ivory/90 backdrop-blur", children: [
    /* @__PURE__ */ jsxs(
      "nav",
      {
        "aria-label": "Main navigation",
        className: "mx-auto flex max-w-6xl items-center justify-between px-6 py-4",
        children: [
          /* @__PURE__ */ jsxs(
            next_link_default,
            {
              href: "/",
              className: "font-display text-xl font-bold tracking-tight text-laterite-800",
              children: [
                "Preserve",
                /* @__PURE__ */ jsx("span", { className: "text-marigold-600", children: "Chhau" })
              ]
            }
          ),
          /* @__PURE__ */ jsx("ul", { className: "hidden items-center gap-8 sm:flex", children: links.map((link) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
            next_link_default,
            {
              href: link.href,
              "aria-current": isActive(link.href) ? "page" : void 0,
              className: `text-sm font-medium transition-colors hover:text-laterite-700 ${isActive(link.href) ? "text-laterite-700 underline decoration-marigold-400 decoration-2 underline-offset-8" : "text-midnight-900"}`,
              children: link.label
            }
          ) }, link.href)) }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: "rounded p-2 text-midnight-900 hover:bg-laterite-100 sm:hidden",
              "aria-expanded": open,
              "aria-controls": "mobile-menu",
              "aria-label": open ? "Close menu" : "Open menu",
              onClick: () => setOpen((value) => !value),
              children: /* @__PURE__ */ jsx(
                "svg",
                {
                  width: "22",
                  height: "22",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  "aria-hidden": "true",
                  children: open ? /* @__PURE__ */ jsx("path", { d: "M6 6l12 12M18 6L6 18" }) : /* @__PURE__ */ jsx("path", { d: "M4 7h16M4 12h16M4 17h16" })
                }
              )
            }
          )
        ]
      }
    ),
    open && /* @__PURE__ */ jsx(
      "ul",
      {
        id: "mobile-menu",
        className: "border-t border-laterite-900/10 px-6 pb-4 sm:hidden",
        children: links.map((link) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
          next_link_default,
          {
            href: link.href,
            "aria-current": isActive(link.href) ? "page" : void 0,
            onClick: () => setOpen(false),
            className: `block py-3 text-sm font-medium ${isActive(link.href) ? "text-laterite-700" : "text-midnight-900"}`,
            children: link.label
          }
        ) }, link.href))
      }
    )
  ] });
}

// chau-web/src/components/Footer.tsx
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
function Footer() {
  return /* @__PURE__ */ jsxs2("footer", { className: "border-t border-laterite-900/10 bg-midnight-950 text-midnight-200", children: [
    /* @__PURE__ */ jsxs2("div", { className: "mx-auto grid max-w-6xl gap-10 px-6 py-12 sm:grid-cols-3", children: [
      /* @__PURE__ */ jsxs2("div", { children: [
        /* @__PURE__ */ jsxs2("p", { className: "font-display text-lg font-bold text-ivory", children: [
          "Preserve",
          /* @__PURE__ */ jsx2("span", { className: "text-marigold-400", children: "Chhau" })
        ] }),
        /* @__PURE__ */ jsx2("p", { className: "mt-3 max-w-xs text-sm leading-relaxed", children: "Honoring an ancient dance of eastern India through storytelling, scholarship, and modern technology." })
      ] }),
      /* @__PURE__ */ jsxs2("nav", { "aria-label": "Footer navigation", children: [
        /* @__PURE__ */ jsx2("p", { className: "text-sm font-semibold tracking-wide text-ivory uppercase", children: "Explore" }),
        /* @__PURE__ */ jsxs2("ul", { className: "mt-3 space-y-2 text-sm", children: [
          /* @__PURE__ */ jsx2("li", { children: /* @__PURE__ */ jsx2(next_link_default, { href: "/ebook", className: "hover:text-marigold-300", children: "Read the eBook" }) }),
          /* @__PURE__ */ jsx2("li", { children: /* @__PURE__ */ jsx2(next_link_default, { href: "/experience", className: "hover:text-marigold-300", children: "3D Model Gallery" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs2("div", { children: [
        /* @__PURE__ */ jsx2("p", { className: "text-sm font-semibold tracking-wide text-ivory uppercase", children: "Heritage" }),
        /* @__PURE__ */ jsx2("p", { className: "mt-3 text-sm leading-relaxed", children: "Chhau dance was inscribed on the UNESCO Representative List of the Intangible Cultural Heritage of Humanity in 2010." })
      ] })
    ] }),
    /* @__PURE__ */ jsx2("div", { className: "border-t border-midnight-900 py-5 text-center text-xs text-midnight-400", children: "eBook researched and written by Arnav Ajana. Built with respect for the dancers, drummers, and mask makers of the Chhau tradition." })
  ] });
}

// chau-web/src/components/PageAudioPlayer.tsx
import { useEffect, useRef, useState as useState2 } from "react";
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}
function PageAudioPlayer({
  src,
  title,
  caption,
  loop = false,
  tone = "paper",
  className = ""
}) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState2(false);
  const [duration, setDuration] = useState2(0);
  const [currentTime, setCurrentTime] = useState2(0);
  const [volume, setVolume] = useState2(0.8);
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  async function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      return;
    }
    try {
      await audio.play();
    } catch {
      setPlaying(false);
    }
  }
  function seek(value) {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return;
    audio.currentTime = value;
    setCurrentTime(value);
  }
  const onDark = tone === "dark";
  const frame = onDark ? "border-yellow-100/20 bg-black/55 text-[#fff8df] backdrop-blur" : "border-[#8a6a3d]/35 bg-[#fff8df]/75 text-[#2a1609]";
  const subtle = onDark ? "text-[#fff8df]/65" : "text-[#2a1609]/60";
  return /* @__PURE__ */ jsxs3("figure", { className: `rounded-sm border p-4 shadow-sm ${frame} ${className}`, children: [
    /* @__PURE__ */ jsx3(
      "audio",
      {
        loop,
        onEnded: () => setPlaying(false),
        onLoadedMetadata: (e) => setDuration(e.currentTarget.duration),
        onPause: () => setPlaying(false),
        onPlay: () => setPlaying(true),
        onTimeUpdate: (e) => setCurrentTime(e.currentTarget.currentTime),
        preload: "metadata",
        ref: audioRef,
        src
      }
    ),
    title ? /* @__PURE__ */ jsxs3("p", { className: "mb-2.5 font-reader text-[11px] font-semibold tracking-[0.16em] uppercase", children: [
      /* @__PURE__ */ jsx3("span", { "aria-hidden": "true", className: "mr-2", children: "\u266A" }),
      title
    ] }) : null,
    /* @__PURE__ */ jsxs3("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx3(
        "button",
        {
          "aria-label": playing ? "Pause audio" : "Play audio",
          className: "grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#7e261e] bg-[#9b2f22] text-[#fff8df] transition hover:bg-[#84271d]",
          onClick: togglePlay,
          type: "button",
          children: playing ? /* @__PURE__ */ jsx3("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", children: /* @__PURE__ */ jsx3("path", { d: "M9 5v14M15 5v14", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round" }) }) : /* @__PURE__ */ jsx3("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true", children: /* @__PURE__ */ jsx3("path", { d: "M8 5.5v13l11-6.5-11-6.5Z" }) })
        }
      ),
      /* @__PURE__ */ jsx3("span", { className: `w-10 shrink-0 text-right font-mono text-[11px] tabular-nums ${subtle}`, children: formatTime(currentTime) }),
      /* @__PURE__ */ jsx3(
        "input",
        {
          "aria-label": "Seek audio",
          className: "h-1.5 min-w-0 flex-1 cursor-pointer accent-[#9b2f22]",
          max: duration || 0,
          min: 0,
          onChange: (e) => seek(Number(e.target.value)),
          step: 0.1,
          type: "range",
          value: Math.min(currentTime, duration || 0)
        }
      ),
      /* @__PURE__ */ jsx3("span", { className: `w-10 shrink-0 font-mono text-[11px] tabular-nums ${subtle}`, children: formatTime(duration) }),
      /* @__PURE__ */ jsxs3("label", { className: "hidden shrink-0 items-center gap-1.5 sm:flex", children: [
        /* @__PURE__ */ jsxs3(
          "svg",
          {
            width: "14",
            height: "14",
            viewBox: "0 0 24 24",
            fill: "none",
            "aria-hidden": "true",
            className: subtle,
            children: [
              /* @__PURE__ */ jsx3("path", { d: "M4 9v6h4l5 4V5L8 9H4Z", stroke: "currentColor", strokeWidth: "2", strokeLinejoin: "round" }),
              /* @__PURE__ */ jsx3("path", { d: "M16 9.5a4 4 0 0 1 0 5", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" })
            ]
          }
        ),
        /* @__PURE__ */ jsx3("span", { className: "sr-only", children: "Volume" }),
        /* @__PURE__ */ jsx3(
          "input",
          {
            "aria-label": "Audio volume",
            className: "h-1 w-16 cursor-pointer accent-[#9b2f22]",
            max: 1,
            min: 0,
            onChange: (e) => setVolume(Number(e.target.value)),
            step: 0.01,
            type: "range",
            value: volume
          }
        )
      ] })
    ] }),
    caption ? /* @__PURE__ */ jsx3("figcaption", { className: `mt-2.5 text-xs leading-relaxed italic ${subtle}`, children: caption }) : null
  ] });
}

// chau-web/src/components/PageVideo.tsx
import { jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
function PageVideo({
  src,
  caption,
  poster
}) {
  return /* @__PURE__ */ jsxs4("figure", { className: "my-8", children: [
    /* @__PURE__ */ jsx4("div", { className: "overflow-hidden rounded-sm border border-[#8a6a3d]/35 bg-black shadow-lg", children: /* @__PURE__ */ jsx4("video", { className: "max-h-[60vh] w-full", controls: true, poster, preload: "metadata", src }) }),
    caption ? /* @__PURE__ */ jsx4("figcaption", { className: "mt-2 text-xs leading-relaxed text-[#2a1609]/60 italic", children: caption }) : null
  ] });
}

// chau-web/src/components/PageEmbed.tsx
import { jsx as jsx5, jsxs as jsxs5 } from "react/jsx-runtime";
function PageEmbed({
  src,
  title,
  caption,
  height = "70vh"
}) {
  return /* @__PURE__ */ jsxs5("figure", { className: "my-8", children: [
    /* @__PURE__ */ jsx5(
      "div",
      {
        className: "overflow-hidden rounded-sm border border-[#8a6a3d]/35 bg-[#0b0e14] shadow-lg ring-1 ring-black/5",
        style: { height, minHeight: 420 },
        children: /* @__PURE__ */ jsx5(
          "iframe",
          {
            allowFullScreen: true,
            className: "h-full w-full border-0",
            loading: "lazy",
            src,
            title
          }
        )
      }
    ),
    /* @__PURE__ */ jsxs5("figcaption", { className: "mt-2 flex flex-wrap items-baseline justify-between gap-2", children: [
      caption ? /* @__PURE__ */ jsx5("span", { className: "text-xs leading-relaxed text-[#2a1609]/60 italic", children: caption }) : /* @__PURE__ */ jsx5("span", {}),
      /* @__PURE__ */ jsx5(
        "a",
        {
          className: "shrink-0 font-reader text-[11px] font-semibold tracking-[0.14em] text-[#7e261e] uppercase underline decoration-[#c84a30]/50 underline-offset-4 hover:text-[#9b2f22]",
          href: src,
          rel: "noopener noreferrer",
          target: "_blank",
          children: "Open full screen \u2197"
        }
      )
    ] })
  ] });
}

// chau-web/src/components/PageMediaGallery.tsx
import { useState as useState3 } from "react";
import { jsx as jsx6, jsxs as jsxs6 } from "react/jsx-runtime";
function PageMediaGallery({ images }) {
  const [activeIndex, setActiveIndex] = useState3(0);
  const active = images[Math.min(activeIndex, images.length - 1)];
  if (!active) return null;
  return /* @__PURE__ */ jsxs6("figure", { className: "my-8", children: [
    /* @__PURE__ */ jsx6("div", { className: "overflow-hidden rounded-sm border border-[#8a6a3d]/35 bg-[#1a1410] shadow-lg", children: /* @__PURE__ */ jsx6(
      "img",
      {
        alt: active.alt,
        className: "mx-auto max-h-[60vh] w-auto object-contain",
        src: active.src
      }
    ) }),
    active.caption ? /* @__PURE__ */ jsx6("figcaption", { className: "mt-2 text-xs leading-relaxed text-[#2a1609]/60 italic", children: active.caption }) : null,
    images.length > 1 ? /* @__PURE__ */ jsx6("div", { className: "mt-3 flex flex-wrap gap-2", role: "tablist", "aria-label": "Gallery images", children: images.map((image, index) => /* @__PURE__ */ jsx6(
      "button",
      {
        "aria-label": `View image ${index + 1}: ${image.alt}`,
        "aria-selected": index === activeIndex,
        className: `h-14 w-14 overflow-hidden rounded-sm border-2 transition ${index === activeIndex ? "border-[#9b2f22]" : "border-transparent opacity-70 hover:opacity-100"}`,
        onClick: () => setActiveIndex(index),
        role: "tab",
        type: "button",
        children: /* @__PURE__ */ jsx6("img", { alt: "", className: "h-full w-full object-cover", src: image.src })
      },
      image.src
    )) }) : null
  ] });
}
export {
  Footer,
  Header,
  PageAudioPlayer,
  PageEmbed,
  PageMediaGallery,
  PageVideo
};
