import { magazine } from "../content";
import { CoverArt } from "./cover-art";

/** The one cover: a thin pink trim around a dark field, the bubble art
    bleeding edge to edge under the stacked masthead and feature list. */
export function Cover({ bubbles, hue }: { bubbles: string[]; hue: number }) {
  const c = magazine.cover;
  const [feature, ...more] = c.features;
  return (
    <div className="flex h-full flex-col bg-pink p-[1.4cqi]">
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-ink p-[5cqi] text-paper">
        <CoverArt bubbles={bubbles} className="absolute inset-0" hue={hue} />
        <div className="relative flex min-h-0 flex-1 flex-col">
          <div className="flex items-start justify-between pl-[2cqi]">
            <p className="font-display text-[8.5cqi] leading-[0.85]">{c.masthead[0]}</p>
            <p className="pt-[1.6cqi] font-sans text-[1.9cqi] tracking-[0.3em] text-paper/65">
              {c.date}
            </p>
          </div>
          <p className="-mt-[2.6cqi] pl-[10cqi] font-display text-[15.5cqi] leading-[0.95]">
            {c.masthead[1]}
          </p>
          <p className="text-right font-display text-[3.2cqi] text-pink italic">{c.subtitle}</p>

          <div className="min-h-0 flex-1" />

          <div className="mt-[3.4cqi] flex flex-col items-start gap-[1.6cqi] text-left">
            <div>
              <p className="font-display text-[4.8cqi] leading-[1.02]">{feature.title}</p>
              <p className="mt-[0.7cqi] font-sans text-[1.8cqi] tracking-[0.24em] text-paper/55">
                {feature.ref}
              </p>
            </div>
            <span aria-hidden className="font-display text-[5.5cqi] leading-[0.7] text-paper/90">
              +
            </span>
            {more.map((f) => (
              <div key={f.title}>
                <p className="font-display text-[3.1cqi] leading-[1.1]">{f.title}</p>
                <p className="mt-[0.5cqi] font-sans text-[1.7cqi] tracking-[0.24em] text-paper/55">
                  {f.ref}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
