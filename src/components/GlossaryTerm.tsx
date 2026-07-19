"use client";

import { createPortal } from "react-dom";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import type { BookGlossaryEntry } from "@/content/book-pages";

const CATEGORY_LABELS = {
  "place-people": "Place and people",
  movement: "Body and movement",
  "music-performance": "Music and performance",
} as const;

const CATEGORY_COLOURS = {
  "place-people": "#405960",
  movement: "#683429",
  "music-performance": "#3d5f52",
} as const;

const TERM_COLOURS: Record<string, string> = {
  "mayurbhanj-chhau": "#84620f",
  "purulia-chhau": "#91432e",
  "seraikella-chhau": "#356864",
};

type TooltipPosition = {
  left: number;
  maxHeight: number;
  placement: "above" | "below";
  top: number;
  width: number;
};

export function GlossaryTerm({
  children,
  entry,
}: {
  children: string;
  entry: BookGlossaryEntry;
}) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const descriptionId = useId();
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [position, setPosition] = useState<TooltipPosition>({
    left: 0,
    maxHeight: 320,
    placement: "below",
    top: 0,
    width: 320,
  });

  const accent = TERM_COLOURS[entry.id] ?? CATEGORY_COLOURS[entry.category];
  const style = { "--glossary-accent": accent } as CSSProperties;

  const updatePosition = useCallback(() => {
    const button = buttonRef.current;
    if (!button || typeof window === "undefined") return;

    const rect = button.getBoundingClientRect();
    const edge = 16;
    const width = Math.min(336, Math.max(236, window.innerWidth - edge * 2));
    const halfWidth = width / 2;
    const left = Math.min(
      Math.max(rect.left + rect.width / 2, edge + halfWidth),
      window.innerWidth - edge - halfWidth,
    );
    const roomAbove = Math.max(96, rect.top - edge - 10);
    const roomBelow = Math.max(
      96,
      window.innerHeight - rect.bottom - edge - 10,
    );
    const naturalHeight = tooltipRef.current?.scrollHeight ?? 240;
    const placement =
      naturalHeight <= roomBelow || roomBelow >= roomAbove ? "below" : "above";
    const maxHeight = placement === "above" ? roomAbove : roomBelow;

    setPosition({
      left,
      maxHeight,
      placement,
      top: placement === "above" ? rect.top - 10 : rect.bottom + 10,
      width,
    });
  }, []);

  const showTooltip = useCallback(() => {
    updatePosition();
    setOpen(true);
  }, [updatePosition]);

  const closeTooltip = useCallback(() => {
    setOpen(false);
    setPinned(false);
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const reposition = () => updatePosition();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      closeTooltip();
      buttonRef.current?.focus();
    };
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (
        !pinned ||
        buttonRef.current?.contains(event.target as Node) ||
        tooltipRef.current?.contains(event.target as Node)
      ) {
        return;
      }
      closeTooltip();
    };

    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOnOutsidePointer);
    return () => {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
    };
  }, [closeTooltip, open, pinned, updatePosition]);

  useLayoutEffect(() => {
    if (open) updatePosition();
  }, [entry.definition, open, updatePosition]);

  return (
    <dfn className="glossary-term" style={style}>
      <button
        aria-describedby={descriptionId}
        className="glossary-term-button"
        onBlur={closeTooltip}
        onClick={() => {
          if (pinned) {
            closeTooltip();
            buttonRef.current?.blur();
            return;
          }
          updatePosition();
          setPinned(true);
          setOpen(true);
        }}
        onFocus={showTooltip}
        onPointerEnter={showTooltip}
        onPointerLeave={() => {
          if (!pinned && document.activeElement !== buttonRef.current) {
            setOpen(false);
          }
        }}
        ref={buttonRef}
        type="button"
      >
        {children}
      </button>
      <span className="sr-only" id={descriptionId}>
        {entry.definition}
      </span>
      {open && typeof document !== "undefined"
        ? createPortal(
            <span
              aria-hidden="true"
              className="glossary-tooltip"
              data-placement={position.placement}
              data-pinned={pinned ? "true" : "false"}
              ref={tooltipRef}
              style={
                {
                  "--glossary-accent": accent,
                  left: position.left,
                  maxHeight: position.maxHeight,
                  top: position.top,
                  width: position.width,
                } as CSSProperties
              }
            >
              <span className="glossary-tooltip-category">
                {CATEGORY_LABELS[entry.category]}
              </span>
              <span className="glossary-tooltip-term">{entry.label}</span>
              <span className="glossary-tooltip-definition">
                {entry.definition}
              </span>
            </span>,
            document.body,
          )
        : null}
    </dfn>
  );
}
