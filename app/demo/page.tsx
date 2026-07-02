"use client";

import { IconPlusMedium } from "@central-icons-react/round-filled-radius-2-stroke-2/IconPlusMedium";
import { useRef, useState } from "react";
import { CoverArt } from "../components/cover-art";
import { site } from "../content";

/* Promotional still. The cover's living bubble field under the wordmark and
   nothing else — no magazine, no nav — so a single frame can be grabbed as a
   PNG. Framed at the OG ratio (1200 x 630) for drop-in use. The same art
   controls as the magazine ride underneath: blow a bubble in, spin the hue. */

const FIRST_BUBBLES = ["#c23b2a", "#de5397", "#d9a23b"];
const BUBBLE_POOL = ["#3467c4", "#58a09a", "#7b5ea7", "#8d9a72", "#c23b2a", "#de5397", "#d9a23b"];
const MAX_BUBBLES = 7;

export default function Demo() {
  const [bubbles, setBubbles] = useState<string[]>(FIRST_BUBBLES);
  const [hue, setHue] = useState(0);
  const blown = useRef(0);

  const addBubble = () => {
    const color = BUBBLE_POOL[blown.current % BUBBLE_POOL.length];
    blown.current += 1;
    setBubbles((prev) =>
      prev.length >= MAX_BUBBLES ? [...prev.slice(1), color] : [...prev, color],
    );
  };

  return (
    <main className="flex min-h-svh w-full flex-col items-center justify-center gap-6 bg-wall p-6">
      <div className="aspect-[1200/630] w-full max-w-5xl bg-pink p-[1cqi] shadow-sheet">
        <div className="@container relative flex h-full w-full items-center justify-center overflow-hidden bg-ink">
          <CoverArt bubbles={bubbles} className="absolute inset-0" hue={hue} />
          <p className="relative z-10 font-display text-[12cqi] leading-none text-paper">
            {site.wordmark[0]}
            <span aria-hidden className="px-[0.14em] text-pink">
              ·
            </span>
            {site.wordmark[1]}
          </p>
        </div>
      </div>

      {/* On-screen art controls: blow a bubble in, spin the hue */}
      <div className="control-bar relative z-20 flex items-center gap-3 rounded-full p-1.5 pr-4">
        <button
          aria-label="Add a bubble to the cover art"
          className="grain-btn flex size-10 cursor-pointer items-center justify-center rounded-full text-paper/90 focus-visible:outline-paper"
          type="button"
          onClick={addBubble}
        >
          <IconPlusMedium size={18} />
        </button>
        <input
          aria-label="Shift the cover art hue"
          className="hue-range focus-visible:outline-paper"
          max={360}
          min={0}
          type="range"
          value={hue}
          onChange={(event) => setHue(Number(event.target.value))}
        />
      </div>
    </main>
  );
}
