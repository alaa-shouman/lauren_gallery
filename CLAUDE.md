# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev        # start dev server with HMR
yarn build      # type-check then bundle for production (tsc -b && vite build)
yarn lint       # run ESLint
yarn preview    # serve the production build locally

# Add a shadcn component (e.g. button)
npx shadcn@latest add button
```

## Stack

- **React 19** with TypeScript 6, bundled by **Vite 8**
- **Tailwind CSS v4** — configured as a Vite plugin (`@tailwindcss/vite`); no `tailwind.config.*` file needed
- **shadcn/ui** — component library using Radix primitives; config at `components.json`
- **Sanity** — CMS backend (schemas, queries, and client live in `src/sanity/`)
- Path alias `@` resolves to `src/`

## Design tokens — colours, fonts, radius

**All** colours, fonts, and border-radius values are defined as CSS custom properties in `src/index.css` and mapped into Tailwind via the `@theme inline` block. Never hardcode values — always reference them through Tailwind utilities (`bg-primary`, `text-muted-foreground`, `font-serif`, `rounded-lg`, etc.) or the CSS variables directly.

To change a colour, font, or radius, edit the `:root` / `.dark` blocks in `src/index.css`. No other file needs to change.

Key variables:

| Variable | Purpose |
|---|---|
| `--background` / `--foreground` | Page background and body text |
| `--primary` / `--primary-foreground` | Brand primary |
| `--muted` / `--muted-foreground` | Subdued backgrounds and labels |
| `--font-sans` | Default body font (Inter) |
| `--font-serif` | Display / heading font (Playfair Display) |
| `--radius` | Base border radius (all `rounded-*` variants derive from it) |

## Component folder structure — Atomic Design

```
src/components/
  atoms/        # smallest indivisible elements (Button, Icon, Badge, Input…)
  molecules/    # atoms composed together (SearchBar, NavLink, Card…)
  organisms/    # complex sections (Header, Gallery, Sidebar…)
  templates/    # page-level layouts that wire organisms together
  ui/           # shadcn auto-generated components (do not edit by hand)
```

Rules:
- A layer may only import from layers below it (`organisms` → `molecules` → `atoms`).
- `ui/` is owned by shadcn — copy a component out of `ui/` into the appropriate atom layer if you need to customise it, and import the custom version everywhere.
- Each folder has a barrel `index.ts`; add exports there when you create a component.

## Sanity

Sanity content lives under `src/sanity/`:

```
src/sanity/
  lib/          # client.ts (sanity client instance), image.ts (urlFor helper)
  schemas/      # document and object schema definitions
  queries/      # GROQ query strings (one file per document type)
```

Best practices:
- Always use the typed client (`createClient` with `useCdn: true` for reads, `useCdn: false` for mutations).
- Define all GROQ queries in `src/sanity/queries/` — never inline query strings in components.
- Use `@sanity/image-url` for image URLs; never construct asset URLs manually.
- Prefer `sanityFetch` or a thin wrapper over the raw client so token and dataset are never imported piecemeal across the app.
- Schema types go in `src/sanity/schemas/` and must be registered in the schema index file.
- Before writing schema or query code, check the Sanity docs via the MCP Sanity tools available in this workspace.

## shadcn usage

- Run `npx shadcn@latest add <component>` to add a component — it lands in `src/components/ui/`.
- The `cn()` helper is at `@/lib/utils` — use it for all conditional class merging.
- `components.json` controls shadcn's code-gen paths; do not rename the alias targets without updating it.
