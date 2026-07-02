import { magazine } from "../content";

/** The right-hand page revealed when the cover lifts. Kept deliberately spare:
    a masthead note, a single justified paragraph, and the two studies named —
    an editorial page, not a landing page. Sizes are in cqi so the whole spread
    scales as one object with the page it sits on. */
export function InsidePage() {
  const { kicker, headline, intro, projects } = magazine.inside;
  return (
    <div className="flex h-full flex-col justify-between px-[11cqi] py-[10cqi] text-ink">
      <header className="text-center">
        <p className="font-sans text-[1.8cqi] tracking-[0.34em] text-ink-soft uppercase">
          {kicker}
        </p>
        <h2 className="mt-[4.5cqi] font-display text-[8cqi] leading-[0.98] italic">
          {headline[0]}
          <br />
          {headline[1]}
        </h2>
      </header>

      <p className="text-justify font-body text-[3cqi] leading-[1.55] text-ink-soft [text-wrap:pretty]">
        {intro}
      </p>

      <div className="flex flex-col gap-[4.5cqi]">
        {projects.map((project, index) => (
          <div key={project.name} className="flex items-baseline gap-[3cqi]">
            <span className="pt-[0.6cqi] font-sans text-[1.7cqi] tracking-[0.24em] text-ink-soft/60">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="font-display text-[5.4cqi] leading-none">{project.name}</p>
              <p className="mt-[1cqi] font-body text-[2.6cqi] leading-[1.35] text-ink-soft italic">
                {project.line}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
