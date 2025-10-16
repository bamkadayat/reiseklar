<div align="center">

# Reiseklar

**Smart Commute Planner for Norway**

[![Live Demo](https://img.shields.io/badge/demo-reiseklar.dev-blue?style=for-the-badge)](https://reiseklar.dev)
[![API](https://img.shields.io/badge/api-api.reiseklar.dev-green?style=for-the-badge)](https://api.reiseklar.dev)

*Reiseklar* ("ready to travel" in Norwegian) helps commuters in Norway plan daily routes using real-time data from **Entur** and weather insights from **MET Norway**.

Built with **Next.js 14**, **TypeScript**, and modern best practices.

[Features](#features) • [Tech Stack](#tech-stack) • [Getting Started](#getting-started) • [Architecture](#architecture) • [Database Schema](#database-schema)

</div>

---

## Features

### Smart Route Planning
- Real-time journey search powered by **Entur API**
- Filter by transport mode, accessibility needs, and departure time
- Interactive map with stop markers and route visualization (Kartverket tiles)

### Weather-Aware Routing
- Live precipitation and wind data from **MET Norway**
- Smart recommendations to leave earlier during bad weather
- Weather overlays on route maps

### Personalization
- **Saved Places** — Store frequently used locations (home, work, etc.)
- **Saved Trips** — Store frequent routes between saved places with accessibility preferences
- **Departure Alerts** — Get notified when it's time to go based on saved trips
- **Recent Searches** — Synced across devices when logged in

### Progressive Web App
- Installable on mobile and desktop
- Offline access to your last trips
- Push notifications for departure reminders

### Multilingual & Accessible
- Norwegian (Bokmal) and English language support
- Full keyboard navigation and WCAG-compliant
- Step-free journey filters for accessibility

---

## Tech Stack

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

## Getting Started

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

## Architecture

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
| Search routes              | Yes              | Yes             |
| Interactive map            | Yes              | Yes             |
| Step-by-step directions    | Yes              | Yes             |
| Recent searches (local)    | Yes (localStorage) | Yes (Synced)  |
| **Save favorite places**   | No (Login required) | Yes          |
| **Save favorite trips**    | No (Login required) | Yes          |
| **Departure alerts**       | No (Login required) | Yes          |
| PWA offline mode           | Yes              | Yes             |
| Cross-device sync          | No               | Yes             |

---

## Database Schema

The application uses PostgreSQL with Prisma ORM. Key models include:

### User Model
- **id**: Unique identifier (CUID)
- **email**: Unique email address
- **name**: Optional user name
- **passwordHash**: Hashed password (optional for OAuth users)
- **emailVerifiedAt**: Email verification timestamp
- **role**: USER or ADMIN
- **OAuth fields**: googleId, provider, avatar
- **Relations**: trips, alerts, tokens, email verifications, password resets, places

### Place Model
- **id**: Unique identifier (CUID)
- **userId**: Owner of the place
- **label**: Custom label (e.g., "Home", "Work")
- **lat/lon**: Geographic coordinates
- **address**: Human-readable address
- **Relations**: Can be used as origin or destination in trips

### Trip Model
- **id**: Unique identifier (CUID)
- **userId**: Owner of the trip
- **originId**: Reference to saved place (origin)
- **destinationId**: Reference to saved place (destination)
- **accessibility**: Accessibility preference (default: "none")
- **Relations**: User, origin place, destination place, alerts

### Alert Model
- **id**: Unique identifier (CUID)
- **userId**: Owner of the alert
- **tripId**: Reference to saved trip
- **thresholdMin**: Minutes before departure to alert (default: 5)
- **channel**: Notification channel (e.g., email, push)
- **Relations**: User, trip

### Supporting Models
- **RefreshToken**: JWT refresh token management with revocation support
- **EmailVerification**: 4-digit PIN verification with attempt tracking and expiry
- **PasswordReset**: Secure password reset token management

---

## Authentication Flow

1. **Sign Up** — Email + password registration
2. **Verification** — 4-digit PIN sent to email (10-min expiry, attempt tracking)
3. **Login** — JWT access token (15 min) + refresh token (7 days)
4. **Auto-refresh** — Silent token renewal before expiry
5. **OAuth Support** — Google OAuth integration available

---

## Deployment

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

## Testing

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

---

## Database Management

### Prisma Studio
View and manage your database with Prisma Studio:
```bash
npx prisma studio
```

### Common Prisma Commands
```bash
# Generate Prisma Client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev

# Reset database
pnpm prisma migrate reset

# View database schema
pnpm prisma db pull
```

---

## License

MIT © [Bam Kadayat]

---

<div align="center">

Made in Norway

</div>
