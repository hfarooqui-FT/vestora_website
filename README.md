# Vestora Website

Marketing and calculator landing page for [Vestora](https://www.vestora.ae) — a UAE End-of-Service Benefit (EOSB/gratuity) investment platform.

## Local Development

**Prerequisites:** Node.js 20+

```bash
npm install
cp .env.example .env.local   # then set GEMINI_API_KEY
npm run dev                  # http://localhost:3000
```

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server on port 3000 |
| `npm run build` | Production build → `dist/` |
| `npm run lint` | TypeScript type-check |
| `npm run preview` | Preview production build locally |

---

## Code Structure

### Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `src/App.tsx` | Primary landing page |
| `/v2` | `src/LandingV2.tsx` | Alternate landing version |

### Shared Components (`Assets /`)

> The folder is named `Assets ` with a **trailing space**. All imports must include it: `import Navbar from '../Assets /Navbar'`.

| File | Description |
|------|-------------|
| `Navbar.tsx` | Fixed top nav with scroll-aware background, dark mode toggle, mobile drawer, and "Get Early Access" CTA |
| `Footer.tsx` | Site footer with platform, company, and legal link columns |

### `src/App.tsx` — Page Sections

The primary page is composed of self-contained section components rendered in this order:

| Component | Section ID | Description |
|-----------|-----------|-------------|
| `Hero` | — | Parallax hero with headline, sub-copy, and CTA buttons |
| `UrgencyBanner` | — | Full-width announcement strip |
| `TrustBar` | — | Scrolling ticker of UAE company logos |
| `EOSCalculator` | `#calculator` | Interactive EOSB calculator (see below) |
| `ProblemSection` | — | Problem framing copy block |
| `HowItWorks` | `#how-it-works` | Step-by-step process explanation |
| `ValueProposition` | — | Feature/benefit grid |
| `PlatformShowcase` | `#platform` | Product screenshots or mockups |
| `SecuritySection` | `#security` | Trust and compliance messaging |
| `CTA` | — | Bottom conversion section |

### EOS Calculator (`EOSCalculator`)

The calculator has two modes toggled by the user:

**Employee mode** — inputs: monthly salary, years + months of tenure, fund selection. Outputs:
- Statutory gratuity (`calcGratuity`) under UAE Labour Law Decree-Law No. 33 of 2021
- Projected invested value (`calcInvestedEOSB`) if contributions are invested
- Gain vs. statutory gratuity, with a bar chart projected over tenure

**Employer mode** — inputs: average salary per employee or total monthly salary bill, number of employees, average tenure. Outputs:
- Monthly and annual EOSB liability
- 5-year projected fund value across Conservative / Balanced / Growth scenarios

Both modes are **email-gated**: results are hidden behind an email capture form (`isUnlocked` state) until a valid address is submitted.

**Financial formulas** (in `src/App.tsx`):

```ts
// UAE gratuity — 21 days/year for first 5 years, 30 days/year thereafter
calcGratuity(monthlySalary, totalMonths)

// Future value of monthly EOSB contributions compounded at annualRate
calcInvestedEOSB(monthlySalary, totalMonths, annualRate)
```

Fund options and rates:

| Fund | Annual Rate |
|------|-------------|
| Conservative | 8% |
| Balanced | 10% |
| Growth | 12% |

### Design Tokens

Tailwind CSS v4 custom colors defined as CSS variables in `src/index.css`:

| Token | Hex | Usage |
|-------|-----|-------|
| `vestora-forest` | `#0B422B` | Primary brand / buttons |
| `vestora-growth` | `#56A861` | Dark mode primary / accents |
| `vestora-sage` | `#8CA095` | Borders, muted text |
| `vestora-charcoal` | `#1C2520` | Body text (light mode) |
| `vestora-neutral` | `#F8FAF9` | Page background (light mode) |
| `vestora-white` | `#FFFFFF` | Card backgrounds |

Dark mode is toggled via `document.documentElement.classList` (no `prefers-color-scheme` — user-controlled only).

### Animation

All motion uses `motion/react` (Framer Motion v12). Reusable primitives in `src/App.tsx`:

- `FadeIn` — wraps children in a fade-up entrance animation with configurable `delay`
- `FloatingParticles` — decorative animated dots
- `RippleBackground` — animated ring effect
- `AbstractGradient` — blurred gradient blobs for hero backgrounds

---

## GCP Infrastructure Setup

Production runs on Google Cloud Run behind a Global HTTPS Load Balancer.

### Prerequisites

- [gcloud CLI](https://cloud.google.com/sdk/docs/install) installed and authenticated
- GCP project created (this project uses `vestora-website`)
- Billing enabled on the project

### 1. Enable Required APIs

```bash
gcloud services enable \
  run.googleapis.com \
  cloudbuild.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com \
  compute.googleapis.com \
  --project vestora-website
```

### 2. Create Artifact Registry Repository

```bash
gcloud artifacts repositories create vestora \
  --repository-format=docker \
  --location=europe-west3 \
  --project vestora-website
```

### 3. Store Gemini API Key in Secret Manager

```bash
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets create GEMINI_API_KEY \
  --data-file=- \
  --project vestora-website
```

To update the secret later:
```bash
echo -n "NEW_KEY" | gcloud secrets versions add GEMINI_API_KEY \
  --data-file=- \
  --project vestora-website
```

### 4. Grant Cloud Build Permissions

```bash
PROJECT_NUMBER=$(gcloud projects describe vestora-website --format="value(projectNumber)")

# Cloud Build service account
gcloud projects add-iam-policy-binding vestora-website \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding vestora-website \
  --member="serviceAccount:${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# Compute service account (used by Cloud Build workers)
gcloud projects add-iam-policy-binding vestora-website \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/artifactregistry.writer"

gcloud projects add-iam-policy-binding vestora-website \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

gcloud projects add-iam-policy-binding vestora-website \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/logging.logWriter"
```

### 5. Deploy via Cloud Build

```bash
COMMIT=$(git rev-parse --short HEAD)
gcloud builds submit \
  --config cloudbuild.yaml \
  --project vestora-website \
  --substitutions=COMMIT_SHA=$COMMIT \
  .
```

> **Note:** `COMMIT_SHA` must be passed explicitly when submitting manually — it is only auto-populated by Cloud Build triggers, not `gcloud builds submit`.

---

## HTTPS Load Balancer Setup

This is a one-time setup to expose Cloud Run behind a global HTTPS load balancer with a static IP.

### 1. Reserve a Static IP

```bash
gcloud compute addresses create vestora-ip \
  --network-tier=PREMIUM \
  --ip-version=IPV4 \
  --global \
  --project vestora-website
```

### 2. Create Serverless NEG

```bash
gcloud compute network-endpoint-groups create vestora-neg \
  --region=europe-west3 \
  --network-endpoint-type=serverless \
  --cloud-run-service=vestora-website \
  --project vestora-website
```

### 3. Create Backend Service

```bash
gcloud compute backend-services create vestora-backend \
  --load-balancing-scheme=EXTERNAL_MANAGED \
  --global \
  --project vestora-website

gcloud compute backend-services add-backend vestora-backend \
  --global \
  --network-endpoint-group=vestora-neg \
  --network-endpoint-group-region=europe-west3 \
  --project vestora-website
```

### 4. Create URL Map and HTTPS Proxy

```bash
gcloud compute url-maps create vestora-urlmap \
  --default-service=vestora-backend \
  --project vestora-website

gcloud compute ssl-certificates create vestora-cert \
  --domains=www.vestora.ae \
  --global \
  --project vestora-website

gcloud compute target-https-proxies create vestora-https-proxy \
  --url-map=vestora-urlmap \
  --ssl-certificates=vestora-cert \
  --project vestora-website

gcloud compute forwarding-rules create vestora-https-rule \
  --load-balancing-scheme=EXTERNAL_MANAGED \
  --network-tier=PREMIUM \
  --address=vestora-ip \
  --target-https-proxy=vestora-https-proxy \
  --global \
  --ports=443 \
  --project vestora-website
```

### 5. HTTP → HTTPS Redirect

```bash
gcloud compute url-maps import vestora-http-redirect \
  --global \
  --project vestora-website \
  --source /dev/stdin <<'EOF'
name: vestora-http-redirect
defaultUrlRedirect:
  redirectResponseCode: MOVED_PERMANENTLY_DEFAULT
  httpsRedirect: true
EOF

gcloud compute target-http-proxies create vestora-http-proxy \
  --url-map=vestora-http-redirect \
  --project vestora-website

gcloud compute forwarding-rules create vestora-http-rule \
  --load-balancing-scheme=EXTERNAL_MANAGED \
  --network-tier=PREMIUM \
  --address=vestora-ip \
  --target-http-proxy=vestora-http-proxy \
  --global \
  --ports=80 \
  --project vestora-website
```

### 6. Configure DNS

Point your domain registrar's DNS to the static IP:

| Type | Name | Value |
|------|------|-------|
| A | www | `8.228.227.168` |

SSL certificate provisioning activates automatically once DNS resolves. This can take up to 24 hours.

---

## Architecture

```
Browser
  └─ www.vestora.ae (DNS → 8.228.227.168)
       └─ Global Load Balancer (HTTPS, Google-managed SSL)
            └─ Cloud Run: vestora-website (europe-west3)
                 └─ nginx:alpine serving React SPA (dist/)
```

The React app is a fully static SPA — nginx serves `index.html` for all routes (SPA fallback). The `GEMINI_API_KEY` is baked into the bundle at build time via Vite's `define`, sourced from Secret Manager during Cloud Build.
