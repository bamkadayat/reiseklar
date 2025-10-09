# Base image (glibc) — Prisma friendly
FROM node:20-bookworm-slim AS base
WORKDIR /app

# Dependencies (cacheable)
FROM base AS deps
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/
COPY packages ./packages
RUN pnpm fetch

# Build
FROM base AS build
RUN corepack enable
COPY --from=deps /root/.local/share/pnpm/store /root/.local/share/pnpm/store
COPY . .
RUN pnpm install --offline --frozen-lockfile
# Build shared package first (dependency of backend)
RUN cd packages/shared && pnpm build
# ✅ Generate Prisma client while dev deps (prisma CLI) are present
RUN cd apps/backend && pnpm prisma generate
# Build backend
RUN cd apps/backend && pnpm build

# Prune to production deps
FROM base AS prune
ENV NODE_ENV=production
RUN corepack enable
RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
COPY --from=build /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=build /app/apps/backend/package.json ./apps/backend/
COPY --from=build /app/apps/backend/prisma ./apps/backend/prisma
COPY --from=build /app/packages ./packages
COPY --from=build /app/node_modules ./node_modules
RUN pnpm --filter=backend --prod deploy pruned

# Copy the generated Prisma client from build stage .pnpm store
# The client is generated in the .pnpm store, not in apps/backend/node_modules
COPY --from=build /app/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/.prisma ./pruned/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/.prisma
COPY --from=build /app/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma ./pruned/node_modules/.pnpm/@prisma+client@5.22.0_prisma@5.22.0/node_modules/@prisma

# Runtime
FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates openssl && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/apps/backend/dist ./dist
COPY --from=build /app/apps/backend/prisma ./prisma
COPY --from=build /app/packages/shared/dist ./packages/shared/dist
COPY --from=build /app/packages/shared/package.json ./packages/shared/package.json
COPY --from=prune /app/pruned/node_modules ./node_modules
COPY --from=prune /app/pruned/package.json ./package.json

USER 1001
ENV PORT=8080
EXPOSE 8080
CMD ["node", "dist/index.js"]
