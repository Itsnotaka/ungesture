"use client";

import {
  IconApps,
  IconDices,
  IconFileDownload,
  IconPause,
  IconPlay,
} from "@central-icons-react/round-filled-radius-2-stroke-2";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LogoMark, type MarkApi } from "../components/logo-mark";
import { mark, site } from "../content";

/* The specimen room. One case in the middle of the wall; press it and the
   lab grows another. The instrument bar underneath holds a specimen still,
   turns the case, resizes the cell, shifts its palette, previews it as an
   app icon, and saves the chosen frame as a PNG. */

export function LogoLab() {
  const [seed, setSeed] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [pose, setPose] = useState<number | null>(null);
  const [size, setSize] = useState(1);
  const [hue, setHue] = useState(0);
  const [tile, setTile] = useState(false);
  const markApi = useRef<MarkApi | null>(null);

  useEffect(() => {
    setSeed(Math.random());
  }, []);

  const grow = () => {
    setSeed(Math.random());
    setPose(null);
  };

  const number = seed === null ? "····" : String(1000 + Math.floor(seed * 9000));

  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center gap-7 px-6 py-20">
      <Link
        aria-label={mark.backLabel}
        className="absolute top-6 left-1/2 -translate-x-1/2 font-display text-xl text-wall-ink"
        href="/"
        prefetch
      >
        {site.wordmark[0]}
        <span aria-hidden className="px-[0.14em] text-pink">
          ·
        </span>
        {site.wordmark[1]}
      </Link>

      <button
        aria-label={mark.growLabel}
        className="size-[min(64vmin,24rem)] cursor-pointer transition-transform duration-200 active:scale-[0.985]"
        type="button"
        onClick={grow}
      >
        <div
          className={
            tile
              ? "h-full w-full rounded-[22%] bg-ink p-[9%] text-paper shadow-card"
              : "h-full w-full"
          }
        >
          {seed !== null && (
            <LogoMark
              apiRef={markApi}
              className="h-full w-full"
              hue={hue}
              lineColor={tile ? "#f7f1e3" : undefined}
              paused={paused}
              pose={pose ?? undefined}
              seed={seed}
              size={size}
            />
          )}
        </div>
      </button>

      <div className="text-center">
        <p className="font-sans text-xs tracking-[0.3em] text-wall-ink/55 uppercase">
          {mark.specimenLabel} № {number}
        </p>
        <p className="mt-2 max-w-md font-display text-lg text-wall-ink italic">{mark.caption}</p>
      </div>

      {/* Instrument bar: hold, reroll, icon preview, save — then the dials */}
      <div className="control-bar relative z-20 flex max-w-[min(92vw,48rem)] flex-wrap items-center justify-center gap-x-4 gap-y-3 rounded-[1.75rem] p-2 px-4">
        <div className="flex items-center gap-2">
          <button
            aria-label={paused ? mark.playLabel : mark.pauseLabel}
            className="grain-btn flex size-10 cursor-pointer items-center justify-center rounded-full text-paper/90 focus-visible:outline-paper"
            type="button"
            onClick={() => setPaused((value) => !value)}
          >
            {paused ? <IconPlay size={18} /> : <IconPause size={18} />}
          </button>
          <button
            aria-label={mark.growLabel}
            className="grain-btn flex size-10 cursor-pointer items-center justify-center rounded-full text-paper/90 focus-visible:outline-paper"
            type="button"
            onClick={grow}
          >
            <IconDices size={18} />
          </button>
          <button
            aria-label={mark.tileLabel}
            aria-pressed={tile}
            className="grain-btn flex size-10 cursor-pointer items-center justify-center rounded-full text-paper/90 focus-visible:outline-paper"
            type="button"
            onClick={() => setTile((value) => !value)}
          >
            <IconApps size={18} />
          </button>
          <button
            aria-label={mark.downloadLabel}
            className="grain-btn flex size-10 cursor-pointer items-center justify-center rounded-full text-paper/90 focus-visible:outline-paper"
            type="button"
            onClick={() =>
              markApi.current?.exportPNG({
                pixels: 1024,
                tile,
                fileName: `ungesture-specimen-${number}${tile ? "-icon" : ""}.png`,
              })
            }
          >
            <IconFileDownload size={18} />
          </button>
        </div>

        <label className="flex items-center gap-2">
          <span className="font-sans text-[10px] tracking-[0.22em] text-paper/45 uppercase">
            {mark.poseLabel}
          </span>
          <input
            className="lab-range focus-visible:outline-paper"
            max={120}
            min={0}
            step={0.1}
            type="range"
            value={pose ?? 0}
            onChange={(event) => setPose(Number(event.target.value))}
          />
        </label>

        <label className="flex items-center gap-2">
          <span className="font-sans text-[10px] tracking-[0.22em] text-paper/45 uppercase">
            {mark.sizeLabel}
          </span>
          <input
            className="lab-range focus-visible:outline-paper"
            max={1.25}
            min={0.7}
            step={0.01}
            type="range"
            value={size}
            onChange={(event) => setSize(Number(event.target.value))}
          />
        </label>

        <label className="flex items-center gap-2">
          <span className="font-sans text-[10px] tracking-[0.22em] text-paper/45 uppercase">
            {mark.hueLabel}
          </span>
          <input
            className="hue-range focus-visible:outline-paper"
            max={360}
            min={0}
            type="range"
            value={hue}
            onChange={(event) => setHue(Number(event.target.value))}
          />
        </label>
      </div>
    </main>
  );
}
