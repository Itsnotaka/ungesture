"use client";

import type { PointerEvent } from "react";
import { volumeCard, type Volume } from "../content";

function leanToward(event: PointerEvent<HTMLElement>) {
  const rect = event.currentTarget.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
  event.currentTarget.style.setProperty("--lean-x", x.toFixed(2));
  event.currentTarget.style.setProperty("--lean-y", y.toFixed(2));
}

function leanBack(event: PointerEvent<HTMLElement>) {
  event.currentTarget.style.setProperty("--lean-x", "0");
  event.currentTarget.style.setProperty("--lean-y", "0");
}

function ArtZone({ volume }: { volume: Volume }) {
  switch (volume.gesture) {
    case "lean":
      return (
        <div aria-hidden className="relative h-full">
          <div className="absolute top-[30%] left-[38%] h-[45%] w-[24%] origin-bottom rotate-12 border-2 border-current" />
          <div className="absolute bottom-[18%] left-[20%] h-px w-[60%] bg-current" />
        </div>
      );
    case "handoff":
      return (
        <div aria-hidden className="relative h-full">
          <div className="handoff-line absolute top-[42%] left-[12%] h-[16%] w-[26%] border-2 border-current" />
          <div className="absolute top-[50%] right-[12%] left-[12%] h-px bg-current opacity-40" />
        </div>
      );
    case "pause":
      return (
        <div aria-hidden className="flex h-full items-center justify-center gap-[6%]">
          <span className="pause-caret block h-[45%] w-[6%] bg-current" />
          <span className="block size-[7%] rounded-full bg-current opacity-30" />
          <span className="block size-[7%] rounded-full bg-current opacity-30" />
          <span className="block size-[7%] rounded-full bg-current opacity-30" />
        </div>
      );
    case "nudge":
      return (
        <div aria-hidden className="flex h-full items-center justify-center">
          <p className="font-display text-[2rem] italic opacity-80">{volumeCard.artText.nudge}</p>
        </div>
      );
    case "echo":
      return (
        <div aria-hidden className="flex h-full items-center justify-center">
          <p
            className="echo-title font-display text-[2.6rem] italic"
            data-echo={volumeCard.artText.echo}
          >
            {volumeCard.artText.echo}
          </p>
        </div>
      );
    case "breath":
      return (
        <div aria-hidden className="flex h-full items-center justify-center">
          <div className="breath-art size-[52%] rounded-full border-2 border-current" />
        </div>
      );
  }
}

export function VolumeCover({ volume, tilt }: { volume: Volume; tilt: string }) {
  const isLean = volume.gesture === "lean";
  return (
    <article
      className={`volume relative flex aspect-[3/4] flex-col p-5 shadow-card ${tilt} ${volume.cover} ${volume.text}`}
      data-gesture={volume.gesture}
      onPointerLeave={isLean ? leanBack : undefined}
      onPointerMove={isLean ? leanToward : undefined}
    >
      <div
        className={`flex items-baseline justify-between border-b pb-2 font-sans text-[0.6rem] tracking-[0.25em] ${volume.border}`}
      >
        <span>{volumeCard.label}</span>
        <span>
          {volumeCard.volPrefix} {volume.number}
        </span>
      </div>
      <h3 className="mt-3 font-display text-3xl leading-none">{volume.name}</h3>
      <div className="min-h-0 flex-1 py-2">
        <ArtZone volume={volume} />
      </div>
      <p className="font-display text-sm/[1.35] italic">&ldquo;{volume.analogy}&rdquo;</p>
      <p
        className={`mt-2 border-t pt-2 font-sans text-[0.7rem]/[1.45] opacity-80 ${volume.border}`}
      >
        {volume.line}
      </p>
    </article>
  );
}
