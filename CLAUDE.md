# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev        # start dev server with HMR
yarn build      # type-check then bundle for production (tsc -b && vite build)
yarn lint       # run ESLint
yarn preview    # serve the production build locally
```

## Stack

- **React 19** with TypeScript 6, bundled by **Vite 8**
- **Tailwind CSS v4** — configured as a Vite plugin (`@tailwindcss/vite`); no `tailwind.config.*` file needed. Import styles once in `src/index.css` via `@import "tailwindcss"`.
- Path alias `@` resolves to `src/` (configured in `vite.config.ts` and `tsconfig.app.json`).

## Known issue

`vite.config.ts` imports from `path/win32` instead of `path`. On macOS/Linux this will break `path.resolve` — change the import to `import path from 'path'` before adding any path-dependent config.
