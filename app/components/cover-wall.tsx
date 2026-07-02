import type { CSSProperties } from "react";

const PALETTE = [
  { bg: "bg-red", tone: "text-paper" },
  { bg: "bg-pink", tone: "text-paper" },
  { bg: "bg-mustard", tone: "text-ink" },
  { bg: "bg-cobalt", tone: "text-paper" },
  { bg: "bg-sage", tone: "text-ink" },
  { bg: "bg-violet", tone: "text-paper" },
  { bg: "bg-teal", tone: "text-ink" },
  { bg: "bg-paper-dim", tone: "text-ink" },
];

// Seeded PRNG: the wall is randomized once at module load and renders
// identically on server and client, so hydration never disagrees.
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260702);

type Mini = {
  palette: (typeof PALETTE)[number];
  style: CSSProperties;
  bars: number[];
};

const MINIS: Mini[] = Array.from({ length: 180 }, () => {
  const palette = PALETTE[Math.floor(rand() * PALETTE.length)];
  const rotate = (rand() * 2 - 1) * 7;
  const dx = (rand() * 2 - 1) * 16;
  const dy = (rand() * 2 - 1) * 16;
  const scale = 0.7 + rand() * 0.5;
  return {
    palette,
    style: { transform: `translate(${dx}%, ${dy}%) rotate(${rotate}deg) scale(${scale})` },
    bars: Array.from({ length: 2 + Math.floor(rand() * 3) }, () => 35 + rand() * 50),
  };
});

export function CoverWall() {
  return (
    <div aria-hidden className="wall-of-covers absolute inset-0 overflow-hidden select-none">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] gap-8 p-8">
        {MINIS.map((mini, i) => (
          <div
            key={i}
            className={`aspect-[3/4] ${mini.palette.bg} ${mini.palette.tone} shadow-card`}
            style={mini.style}
          >
            <div className="mx-auto mt-[12%] h-1 w-[60%] bg-current opacity-80" />
            <div className="mt-[16%] flex flex-col gap-1 px-[14%]">
              {mini.bars.map((w, j) => (
                <div key={j} className="h-0.5 bg-current opacity-40" style={{ width: `${w}%` }} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
