# UnGesture

Interface Research Lab — exploring how software can participate in human interaction rather than merely facilitate it.

## Stack

- **Next.js** 16.3.0-preview.5 with Turbopack
- **React** 19
- **Tailwind CSS** v4
- **TypeScript**
- **pnpm**

## Development

```bash
pnpm install
pnpm run dev    # Next.js dev server
```

## Commands

```bash
pnpm run lint      # oxlint
pnpm run fmt       # oxfmt --write
pnpm run fmt:check # oxfmt --check
pnpm run build     # next build (static export)
```

## Design Philosophy

This site is the interface for a research lab about invisible design. Every interaction should embody the principles it describes:

- **Removal over addition:** Less chrome, more content.
- **Social competence:** The interface reads the room.
- **Continuity of context:** Transitions feel like moving through a room.
- **Generous defaults:** Everything works without configuration.
- **Recovery, not error:** Graceful degradation everywhere.

## Structure

- `app/` — Pages and components
- `app/components/` — Reusable gesture demos and UI primitives
- `app/journal/` — Long-form essays
- `app/experiments/` — Interactive demonstrations
- `dist/` — Static export output

## Deployment

Static export is configured in `next.config.ts`. Deploy the `dist/` directory to any static host.
