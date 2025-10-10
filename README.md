<div align="center">

# 🚆 Reiseklar

**Smart Commute Planner for Norway**

[![Live Demo](https://img.shields.io/badge/demo-reiseklar.dev-blue?style=for-the-badge)](https://reiseklar.dev)
[![API](https://img.shields.io/badge/api-api.reiseklar.dev-green?style=for-the-badge)](https://api.reiseklar.dev)

*Reiseklar* ("ready to travel" in Norwegian) helps commuters in Norway plan daily routes using real-time data from **Entur** and weather insights from **MET Norway**.

Built with **Next.js 14**, **TypeScript**, and modern best practices.

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Architecture](#-architecture)

</div>

---

## ✨ Features

### 🗺️ Smart Route Planning
- Real-time journey search powered by **Entur API**
- Filter by transport mode, accessibility needs, and departure time
- Interactive map with stop markers and route visualization (Kartverket tiles)

### 🌦️ Weather-Aware Routing
- Live precipitation and wind data from **MET Norway**
- Smart recommendations to leave earlier during bad weather
- Weather overlays on route maps

### 💾 Personalization
- **Saved Trips** — Store frequent routes (home → work, etc.)
- **Leave-by Alerts** — Get notified when it's time to go
- **Recent Searches** — Synced across devices when logged in

### 📱 Progressive Web App
- Installable on mobile and desktop
- Offline access to your last trips
- Push notifications for departure reminders

### 🌍 Multilingual & Accessible
- 🇳🇴 Norwegian (Bokmål) and 🇬🇧 English
- ♿ Full keyboard navigation and WCAG-compliant
- Step-free journey filters for accessibility

---

## 🛠️ Tech Stack

<table>
<tr>
<td>

**Frontend**
- [Next.js 14](https://nextjs.org/) (App Router)
- TypeScript
- TailwindCSS + shadcn/ui
- Redux Toolkit + React Query
- Leaflet / MapLibre

</td>
<td>

**Backend**
- Node.js + Express
- PostgreSQL + Prisma ORM
- JWT Auth (access + refresh tokens)
- Email verification (4-digit PIN)
- Cloud Run (GCP)

</td>
</tr>
<tr>
<td>

**APIs & Integrations**
- Entur (Norway public transport)
- MET Norway (Weather)
- Kartverket (Maps)
- Mailgun (Transactional email)

</td>
<td>

**DevOps & Tooling**
- PNPM Monorepo + Turborepo
- GitHub Actions + Cloud Build
- Vercel (Frontend)
- Docker + GCR
- Vitest + Playwright

</td>
</tr>
</table>

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- PNPM 8+
- PostgreSQL

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/reiseklar.git
cd reiseklar

# Install dependencies
pnpm install

# Set up environment variables
cp apps/frontend/.env.example apps/frontend/.env.local
cp apps/backend/.env.example apps/backend/.env

# Run database migrations
cd apps/backend
pnpm prisma migrate dev

# Start development servers
pnpm dev
```

Frontend will be available at `http://localhost:3000`
Backend API at `http://localhost:8080`

---

## 📁 Architecture

### Monorepo Structure

```
reiseklar/
├── apps/
│   ├── backend/              # Express API
│   │   ├── src/
│   │   │   ├── routes/       # API endpoints
│   │   │   ├── middleware/   # Auth, error handling
│   │   │   └── services/     # Business logic
│   │   ├── prisma/           # Database schema
│   │   └── package.json
│   │
│   └── frontend/             # Next.js App
│       ├── app/              # App Router pages
│       ├── components/       # React components
│       ├── lib/              # Utils, hooks, stores
│       ├── public/           # Static assets
│       └── package.json
│
├── packages/
│   ├── shared/               # Shared types & utils
│   └── config/               # ESLint, TS configs
│
├── .github/workflows/        # CI/CD pipelines
├── Dockerfile                # Backend container
├── cloudbuild.yaml           # GCP Cloud Build
├── turbo.json                # Turborepo config
└── pnpm-workspace.yaml       # PNPM workspaces
```

### User Experience Matrix

| Feature                    | Anonymous Users  | Logged-in Users |
|----------------------------|------------------|-----------------|
| Search routes              | ✅               | ✅              |
| Interactive map            | ✅               | ✅              |
| Step-by-step directions    | ✅               | ✅              |
| Recent searches (local)    | ✅ localStorage  | ✅ Synced       |
| **Save favorite trips**    | ❌ Login required | ✅             |
| **Departure alerts**       | ❌ Login required | ✅             |
| PWA offline mode           | ✅               | ✅              |
| Cross-device sync          | ❌               | ✅              |

---

## 🔐 Authentication Flow

1. **Sign Up** — Email + password registration
2. **Verification** — 4-digit PIN sent to email (10-min expiry)
3. **Login** — JWT access token (15 min) + refresh token (7 days)
4. **Auto-refresh** — Silent token renewal before expiry

---

## 🌐 Deployment

### Frontend (Vercel)
```bash
vercel --prod
```

### Backend (Cloud Run)
```bash
# Via Cloud Build trigger
git push origin production

# Or manually
gcloud builds submit --config cloudbuild.yaml
```

---

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Unit tests (Vitest)
pnpm test:unit

# E2E tests (Playwright)
pnpm test:e2e

# Type checking
pnpm typecheck

# Linting
pnpm lint
```
## Run PRISMA STUDIO
```
npx prisma studio
```
---

## 📝 License

MIT © [Bam Kadayat]

---

<div align="center">

Made with ❤️ in Norway

</div>
