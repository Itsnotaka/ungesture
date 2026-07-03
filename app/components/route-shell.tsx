import { site } from "../content";

export function WordmarkMasthead({ className }: { className?: string }) {
  return (
    <p className={className ?? "font-display text-xl text-wall-ink"}>
      {site.wordmark[0]}
      <span aria-hidden className="px-[0.14em] text-pink">
        ·
      </span>
      {site.wordmark[1]}
    </p>
  );
}
