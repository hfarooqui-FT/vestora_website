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

Requires `GEMINI_API_KEY` set in `.env.local` before running. No test runner is configured.

Set `DISABLE_HMR=true` to disable hot module replacement (used in AI Studio environments to prevent flickering during agent edits).

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
  App.tsx         # primary landing page; all section components + business logic
  LandingV2.tsx   # alternate landing version (independent, not sharing components with App.tsx)
  index.css       # global styles + Tailwind import + design token definitions
Assets /          # shared layout components (folder name has a trailing space)
  Navbar.tsx
  Footer.tsx
  vestore-v1-blk.svg
  vestore-v1-white.svg
```

**Important:** The shared components folder is named `Assets ` (with a trailing space). Imports must match exactly: `import Navbar from '../Assets /Navbar'`.

## Design System

Custom color tokens are defined in `src/index.css` using Tailwind v4's `@theme {}` block — there is no `tailwind.config.js`. All `vestora-*` classes come from there:

| Token | Hex | Use |
|-------|-----|-----|
| `vestora-forest` | `#0B422B` | Primary dark green (CTAs, accents) |
| `vestora-growth` | `#56A861` | Secondary bright green (dark mode CTAs, positive metrics) |
| `vestora-sage` | `#8CA095` | Muted green (borders, labels, secondary text) |
| `vestora-charcoal` | `#1C2520` | Primary text (light mode) |
| `vestora-neutral` | `#F8FAF9` | Background (light mode) / primary text (dark mode) |
| `vestora-white` | `#FFFFFF` | Card backgrounds (light mode) |

Custom shadows (`shadow-vestora`, `shadow-vestora-sm`) are also defined in `index.css`.

**Dark mode** is toggled manually by adding/removing the `dark` class on `document.documentElement` — not via system preference. The toggle lives in `Navbar.tsx:ThemeToggle`.

## Architecture

`src/App.tsx` is a single-file page — all section components (`Hero`, `EOSCalculator`, `HowItWorks`, etc.) are defined and composed in that file. They are **not** in separate files. Section order in `App` default export determines page layout.

**Section anchor IDs** used for scroll navigation: `#calculator`, `#product`, `#how-it-works`, `#security`, `#platform`, `#cta`.

**`Button` component** is duplicated: one copy in `App.tsx` and another in `Navbar.tsx`. They are identical but not shared.

**`FadeIn` wrapper** (`App.tsx:187`): uses `whileInView` for scroll-triggered animation by default. Pass `immediate` prop to switch to `animate` (used for above-the-fold elements in `Hero`).

**Email gate pattern** in `EOSCalculator`: results panel is blurred (`blur-sm`) and non-interactive until user submits a valid email. State: `isUnlocked` / `email` / `emailError`. The email is captured client-side only — no backend submission is wired up.

**Lead capture modal** in `CTA`: `showModal` state, form collects name/company/email. On submit, shows a success state. No backend submission is wired up.

## Domain

Vestora is a UAE End-of-Service Benefit (EOSB/gratuity) investment platform. Key business logic in `src/App.tsx`:

- `calcGratuity()` — UAE Labour Law gratuity formula (Decree-Law No. 33 of 2021): 21 days/year for first 5 years, 30 days/year thereafter; zero if tenure < 12 months
- `calcInvestedEOSB()` — future value of monthly EOS contributions if invested at `annualRate`; splits into two phases at the 60-month (5-year) boundary mirroring the gratuity formula
- Three fund options: Conservative (8%), Balanced (10%), Growth (12%)
- Calculator has two modes: **Employee** (individual) and **Employer/HR** (aggregate by headcount or salary bill)

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

### Rollback

Use `scripts/rollback.sh` to inspect or roll back the live Cloud Run revision.

```bash
scripts/rollback.sh status        # show revision serving 100% traffic
scripts/rollback.sh list [N]      # list latest N revisions (default 10)
scripts/rollback.sh prev          # shift 100% traffic to the revision just before current
scripts/rollback.sh to <revision> # shift 100% traffic to a specific revision name
scripts/rollback.sh pin           # pin 100% to current revision (blocks auto-promote)
scripts/rollback.sh unpin         # restore auto-promote (latest revision = 100%)
```

Rollback is instant — Cloud Run keeps previous revisions and their images in Artifact Registry, so flipping traffic does not require a rebuild. `pin` is useful before risky changes: pinning the current revision means a subsequent deploy creates a new revision but does not receive traffic until `unpin` (or an explicit `to`) is run.
