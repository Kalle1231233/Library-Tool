# AGENTS.md

## Cursor Cloud specific instructions

### Overview

Component Library Manager (CLM) — a client-side React SPA for managing UI component libraries. No backend, no database; all state persists in browser LocalStorage via Zustand.

### Tech Stack

- React 19 + TypeScript + Vite 8
- Zustand (state management, persisted to LocalStorage key `clm-library-storage-v1`)
- Tailwind CSS 4 + PostCSS
- Monaco Editor (code editing in variants)
- Package manager: **npm** (lockfile: `package-lock.json`)
- Required Node.js: v22+

### Development Commands

See `package.json` scripts and `README.md` for standard commands:

- `npm run dev` — starts Vite dev server on port 5173
- `npm run build` — runs `tsc -b && vite build` (type-check + production build)
- `npm run preview` — serves production build locally

### Notes

- **No test framework configured.** There are no unit/integration tests. Validation is manual browser testing only.
- **No linter configured.** No ESLint or similar in `devDependencies`. The TypeScript compiler (`tsc -b`) is the primary static check.
- **Live preview depends on CDN.** The iframe preview loads React 18, Babel, Vue 3, and Tailwind CSS from `unpkg.com` / `cdn.tailwindcss.com`. Internet access is required for preview to work.
- **UI language is German.** All labels and descriptions in the app are in German.
- The Vite dev server supports HMR; code changes are reflected immediately in the browser without restart.
