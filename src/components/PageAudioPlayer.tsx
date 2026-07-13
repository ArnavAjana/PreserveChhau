"use client";

import { useEffect, useRef, useState } from "react";

export type PageAudioPlayerProps = {
  src: string;
  title?: string;
  caption?: string;
  loop?: boolean;
  /** "paper" sits on the heritage page; "dark" sits on the cover photo. */
  tone?: "paper" | "dark";
  className?: string;
};

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * The eBook's shared audio player — used for drum patterns, musical
 * phrases, and theme audio on any page. Pages opt in through the
 * `audioTracks` (or legacy `audioUrl`) fields in book-pages.ts.
 */
export function PageAudioPlayer({
  src,
  title,
  caption,
  loop = false,
  tone = "paper",
  className = "",
}: PageAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.8);

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

  function seek(value: number) {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return;
    audio.currentTime = value;
    setCurrentTime(value);
  }

  const onDark = tone === "dark";
  const frame = onDark
    ? "border-yellow-100/20 bg-black/55 text-[#fff8df] backdrop-blur"
    : "border-[#8a6a3d]/35 bg-[#fff8df]/75 text-[#2a1609]";
  const subtle = onDark ? "text-[#fff8df]/80" : "text-[#2a1609]/75";

  return (
    <figure className={`rounded-sm border p-4 shadow-sm ${frame} ${className}`}>
      <audio
        loop={loop}
        onEnded={() => setPlaying(false)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onPause={() => setPlaying(false)}
        onPlay={() => setPlaying(true)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
        preload="metadata"
        ref={audioRef}
        src={src}
      />

      {title ? (
        <p className="mb-2.5 font-reader text-[11px] font-semibold tracking-[0.16em] uppercase">
          <span aria-hidden="true" className="mr-2">
            ♪
          </span>
          {title}
        </p>
      ) : null}

      <div className="page-audio-controls flex items-center gap-3">
        <button
          aria-label={playing ? "Pause audio" : "Play audio"}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#7e261e] bg-[#9b2f22] text-[#fff8df] transition hover:bg-[#84271d]"
          onClick={togglePlay}
          type="button"
        >
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 5v14M15 5v14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5.5v13l11-6.5-11-6.5Z" />
            </svg>
          )}
        </button>

        <span className={`w-10 shrink-0 text-right font-mono text-[11px] tabular-nums ${subtle}`}>
          {formatTime(currentTime)}
        </span>

        <input
          aria-label="Seek audio"
          className="h-1.5 min-w-0 flex-1 cursor-pointer accent-[#9b2f22]"
          max={duration || 0}
          min={0}
          onChange={(e) => seek(Number(e.target.value))}
          step={0.1}
          type="range"
          value={Math.min(currentTime, duration || 0)}
        />

        <span className={`w-10 shrink-0 font-mono text-[11px] tabular-nums ${subtle}`}>
          {formatTime(duration)}
        </span>

        <label className="hidden shrink-0 items-center gap-1.5 sm:flex">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className={subtle}
          >
            <path d="M4 9v6h4l5 4V5L8 9H4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
            <path d="M16 9.5a4 4 0 0 1 0 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="sr-only">Volume</span>
          <input
            aria-label="Audio volume"
            className="h-1 w-16 cursor-pointer accent-[#9b2f22]"
            max={1}
            min={0}
            onChange={(e) => setVolume(Number(e.target.value))}
            step={0.01}
            type="range"
            value={volume}
          />
        </label>
      </div>

      {caption ? (
        <figcaption className={`mt-2.5 text-xs leading-relaxed italic ${subtle}`}>
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
