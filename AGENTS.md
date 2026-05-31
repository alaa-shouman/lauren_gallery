# Agent Instructions

Use this file to get productive fast. For deeper details, see [CLAUDE.md](CLAUDE.md).

## Quickstart
- Run: `yarn dev`, `yarn build`, `yarn lint`, `yarn preview`.
- No tests configured yet.

## Project Rules
- **Design tokens**: All colors, fonts, and radius live in [src/index.css](src/index.css). Never hardcode values; use Tailwind utilities (e.g., `bg-primary`, `text-muted-foreground`, `font-serif`, `rounded-lg`).
- **Tailwind v4**: No `tailwind.config.*` file; tokens map via `@theme inline` in [src/index.css](src/index.css).
- **Components**: Atomic design in [src/components/](src/components/). Layers can only import from lower layers. `ui/` is shadcn-generated; copy to an atom/molecule before customizing.
- **Sanity**: Queries live in [src/sanity/queries](src/sanity/queries) (never inline GROQ). Use `sanityFetch()` and `urlFor()` from [src/sanity/lib](src/sanity/lib).
- **Env vars**: Sanity requires `SANITY_PROJECT_ID` / `SANITY_DATASET` and Vite vars per [.env.example](.env.example).

## Files to Know
- [CLAUDE.md](CLAUDE.md) for full repo guidance.
- [src/index.css](src/index.css) for tokens + theme mapping.
- [src/sanity/](src/sanity/) for client, queries, schemas.
