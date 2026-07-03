import { WordmarkMasthead } from "./components/route-shell";

export default function HomeLoading() {
  return (
    <main
      aria-busy="true"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-4 py-14"
    >
      <div className="absolute top-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5">
        <div aria-hidden className="size-8 rounded-full bg-wall-ink/8" />
        <WordmarkMasthead />
      </div>

      <div
        aria-hidden
        className="aspect-[3/4] w-[min(72vw,22rem)] rounded-sm bg-wall-ink/6 shadow-sheet"
      />
    </main>
  );
}
