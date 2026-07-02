"use client";

import { GrainGradient } from "@paper-design/shaders-react";

const BACK = "#211d16";

/** The cover's bubble field: shader blobs the reader can extend and re-hue. */
export function CoverArt({
  bubbles,
  hue,
  className,
}: {
  bubbles: string[];
  hue: number;
  className?: string;
}) {
  return (
    <div aria-hidden className={className} style={{ filter: `hue-rotate(${hue}deg)` }}>
      <GrainGradient
        className="absolute! inset-0 h-full w-full"
        colorBack={BACK}
        colors={bubbles}
        intensity={0.45}
        noise={0.4}
        shape="blob"
        softness={0.55}
        speed={0.5}
      />
    </div>
  );
}
