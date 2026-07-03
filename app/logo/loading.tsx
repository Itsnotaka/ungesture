import { WordmarkMasthead } from "../components/route-shell";

export default function LogoLoading() {
  return (
    <main
      aria-busy="true"
      className="relative flex min-h-svh flex-col items-center justify-center gap-7 px-6 py-20"
    >
      <WordmarkMasthead className="absolute top-6 left-1/2 -translate-x-1/2 font-display text-xl text-wall-ink" />

      <div
        aria-hidden
        className="size-[min(64vmin,24rem)] rounded-full bg-wall-ink/6 shadow-card"
      />

      <div aria-hidden className="space-y-2 text-center">
        <div className="mx-auto h-3 w-36 rounded-full bg-wall-ink/8" />
        <div className="mx-auto h-4 w-56 max-w-md rounded-full bg-wall-ink/6" />
      </div>
    </main>
  );
}
