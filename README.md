# Reiseklar — Smart Commute Planner for Norway

**Live Demo:** [https://reiseklar.dev](https://reiseklar.dev)  
**API:** [https://api.reiseklar.dev](https://api.reiseklar.dev)

Reiseklar ("ready to travel" in Norwegian) is a modern web app that helps commuters in Norway plan daily routes using real-time data from **Entur** and weather insights from **MET Norway**.

Built with **Next.js 14 (App Router)**, **React 18**, **TypeScript**, and **TailwindCSS**, it showcases best practices in performance, accessibility, and modern frontend development.

---

## Core Features

- ** Smart Route Planner**
  - Search journeys between two locations using live Entur data.
  - Filter by transport mode, accessibility, or departure time.
- ** Weather-Aware Routing**
  - Integrates MET Norway API for live precipitation and wind data.
  - Advises if you should leave earlier due to bad weather.
- ** Interactive Map**
  - Visualize routes with stop markers and path overlays (Kartverket tiles).
- ** Saved Trips**
  - Store frequent routes (e.g., home → work) in your profile.
- ** Leave-by Alerts**
  - Get notified when it’s time to go, based on delay + weather.
- ** Progressive Web App**
  - Installable, offline access to last trips, and push notifications.
- ** Multilingual**
  - Bokmål 🇳🇴 and English 🇬🇧 support.
- **♿ Accessibility-first**
  - Keyboard navigation, focus management, and step-free filters.

---

## 🧰 Tech Stack

| Category | Technology |
|-----------|-------------|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS + shadcn/ui |
| State/Data | Redux Toolkit (UI state) | React Query (Server state & caching) |
| Data Fetching | Next.js Server Components+ REST API (Entur & MET Norway) |
| Auth | Custom JWT auth (access + refresh) with email verification (4-digit PIN) |
| Maps | Leaflet / MapLibre + Kartverket vector tiles |
| Deployment | [Vercel](https://vercel.com) |
| API | Reiseklar Backend (Node + Express on Cloud Run) |
| Database | PostgreSQL (GCP VM) + Prisma |
| DevOps | PNPM Monorepo, Turborepo, GitHub Actions |
| Testing | Vitest, RTL, Playwright |

---

## ⚙️ Project Structure | Minimal Monorepo

reiseklar/
├── apps/
│   ├── backend/
│   │   ├── index.ts
│   │   ├── routes/
│   │   │   └── users.ts
│   │   ├── middleware/
│   │   │   └── errorHandler.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── frontend/
│       ├── layout.tsx
│       ├── page.tsx
│       ├── api/
│       │   └── users/
│       │       └── route.ts
│       ├── package.json
│       ├── tsconfig.json
│       └── next.config.js
├── packages/
│   ├── shared/
│   │   ├── index.ts
│   │   ├── types/
│   │   │   └── user.ts
│   │   ├── utils/
│   │   │   └── formatDate.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── config/
│       ├── eslint/
│       │   └── base.js
│       └── typescript/
│           ├── base.json
│           ├── nextjs.json
│           └── node.json
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
├── Dockerfile
├── cloudbuild.yaml
├── vercel.json
├── turbo.json
├── package.json
├── pnpm-workspace.yaml
├── .gitignore
└── README.md

## Anonymous vs logged-in behavior
| Feature                  | Logged-out       | Logged-in  |
| ------------------------ | ---------------- | ---------- |
| Search routes            | ✅                | ✅          |
| Map + step-by-step       | ✅                | ✅          |
| Recent searches (device) | ✅ (localStorage) | ✅ (synced) |
| Save trips / alerts      | ❌ (login modal)  | ✅          |
| PWA offline last trip    | ✅                | ✅          |
| Cross-device sync        | ❌                | ✅          |
