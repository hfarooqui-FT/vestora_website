# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # install dependencies
npm run dev          # dev server on http://localhost:3000
npm run build        # production build (outputs to dist/)
npm run preview      # preview production build
npm run lint         # type-check only (tsc --noEmit), no ESLint configured
npm run clean        # remove dist/
```

Requires `GEMINI_API_KEY` set in `.env.local` before running.

## Stack

- **React 19** + **TypeScript** — strict mode via `tsconfig.json`
- **Vite 6** — build tool; `@` alias resolves to the repo root
- **Tailwind CSS v4** — loaded as a Vite plugin (`@tailwindcss/vite`), no `tailwind.config.js`
- **motion/react** — animations (Framer Motion v12 rebranded)
- **react-router-dom v7** — client-side routing; routes defined in `src/main.tsx`
- **recharts** — chart components
- **lucide-react** — icons
- **@google/genai** — Gemini AI SDK; API key injected via `process.env.GEMINI_API_KEY` at build time (defined in `vite.config.ts`)

## Routes

| Path | Component |
|------|-----------|
| `/` | `src/App.tsx` — primary landing page |
| `/v2` | `src/LandingV2.tsx` — alternate landing version |

## Structure

```
src/
  main.tsx        # entry point + router
  App.tsx         # primary landing page; contains all business logic
  LandingV2.tsx   # alternate landing version
  index.css       # global styles + Tailwind import
Assets /          # shared components (folder name has a trailing space)
  Navbar.tsx
  Footer.tsx
  vestore-v1-blk.svg
  vestore-v1-white.svg
public/
  logo.png
  _redirects      # Netlify SPA catch-all (legacy; production runs on Cloud Run)
```

**Important:** The shared components folder is named `Assets ` (with a trailing space). Imports must match exactly: `import Navbar from '../Assets /Navbar'`.

## Domain

Vestora is a UAE End-of-Service Benefit (EOSB/gratuity) investment platform. Key business logic lives in `src/App.tsx`:

- `calcGratuity()` — UAE Labour Law gratuity formula (Decree-Law No. 33 of 2021)
- `calcInvestedEOSB()` — future value of monthly contributions if invested
- Three fund options: Conservative (8%), Balanced (10%), Growth (12%)
- Interactive calculator lets employees input salary + tenure to see projected EOSB value

## Deployment

Production runs on **Google Cloud Run** (`europe-west3`, project `vestora-website`) behind a Global Load Balancer at `www.vestora.ae`. The static IP is `8.228.227.168`.

To deploy manually:
```bash
COMMIT=$(git rev-parse --short HEAD)
gcloud builds submit --config cloudbuild.yaml --project vestora-website --substitutions=COMMIT_SHA=$COMMIT .
```

The build pipeline (`cloudbuild.yaml`):
1. Docker builds the image with `GEMINI_API_KEY` injected from Secret Manager
2. Pushes to Artifact Registry (`europe-west3-docker.pkg.dev/vestora-website/vestora/vestora-website`)
3. Deploys to Cloud Run

**Note:** `COMMIT_SHA` must be passed as an explicit substitution when submitting manually — it is not auto-populated by `gcloud builds submit` (only by Cloud Build triggers).
