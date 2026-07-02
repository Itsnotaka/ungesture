"use client";

import { IconPlusMedium } from "@central-icons-react/round-filled-radius-2-stroke-2/IconPlusMedium";
import { IconX } from "@central-icons-react/round-filled-radius-2-stroke-2/IconX";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { magazine, site } from "../content";
import { Cover } from "./cover";
import { InsidePage } from "./inside-page";
import { useCoverFlip } from "./use-cover-flip";

/* The art opens with three bubbles; each press of the control blows another
   in from the room palette. The shader holds seven, oldest drifts out first. */
const FIRST_BUBBLES = ["#c23b2a", "#de5397", "#d9a23b"];
const BUBBLE_POOL = ["#3467c4", "#58a09a", "#7b5ea7", "#8d9a72", "#c23b2a", "#de5397", "#d9a23b"];
const MAX_BUBBLES = 7;

export function Magazine() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [bubbles, setBubbles] = useState<string[]>(FIRST_BUBBLES);
  const [hue, setHue] = useState(0);
  const blown = useRef(0);
  const stageRef = useRef<HTMLElement>(null);

  const { toggle, coverHandlers, stageHandlers } = useCoverFlip({
    stageRef,
    onSettle: setIsOpen,
    onDragChange: setIsDragging,
  });

  const toggleFromKeyboard = (event: MouseEvent) => {
    if (event.detail === 0) toggle();
  };

  const addBubble = () => {
    const color = BUBBLE_POOL[blown.current % BUBBLE_POOL.length];
    blown.current += 1;
    setBubbles((prev) =>
      prev.length >= MAX_BUBBLES ? [...prev.slice(1), color] : [...prev, color],
    );
  };

  useEffect(() => {
    if (!isOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") toggle(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isOpen]);

  return (
    <>
      <section
        ref={stageRef}
        className="stage relative flex min-h-svh touch-pan-y flex-col items-center justify-center overflow-hidden px-4 py-14"
        data-dragging={isDragging}
        data-open={isOpen}
        {...stageHandlers}
      >
        <p className="absolute top-6 left-1/2 z-20 -translate-x-1/2 font-display text-xl text-wall-ink">
          {site.wordmark[0]}
          <span aria-hidden className="px-[0.14em] text-pink">
            ·
          </span>
          {site.wordmark[1]}
        </p>

        <div className="spread">
          <div className="page-recto">
            <InsidePage />
          </div>

          <div className="cover touch-pan-y" {...coverHandlers}>
            <div className="cover-face cover-front">
              <Cover bubbles={bubbles} hue={hue} />
              {!isOpen && (
                <button
                  aria-label={magazine.openLabel}
                  className="absolute inset-0 z-10 h-full w-full"
                  type="button"
                  onClick={toggleFromKeyboard}
                />
              )}
            </div>

            <div className="cover-face cover-back" />
          </div>
        </div>

        {/* On-screen art controls: blow a bubble in, spin the hue */}
        <div className="control-bar relative z-20 mt-6 flex items-center gap-3 rounded-full p-1.5 pr-4">
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

        <a
          className="absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 font-sans text-xs tracking-[0.14em] text-wall-ink/55 transition hover:text-wall-ink"
          href={site.social.href}
          rel="noreferrer"
          target="_blank"
        >
          <IconX size={14} />
          {site.social.handle}
        </a>
      </section>
    </>
  );
}
