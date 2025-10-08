# Base image (glibc) — Prisma friendly
FROM node:20-bookworm-slim AS base
WORKDIR /app
ENV NODE_ENV=production

# Dependencies (cacheable)
FROM base AS deps
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm fetch

# Build
FROM base AS build
RUN corepack enable
COPY --from=deps /root/.local/share/pnpm/store /root/.local/share/pnpm/store
COPY . .
RUN pnpm install --offline
RUN pnpm prisma generate
RUN pnpm build

# Prune to production deps
FROM base AS prune
RUN corepack enable
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
RUN pnpm prune --prod

# Runtime
FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates openssl && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=prune /app/node_modules ./node_modules
COPY --from=prune /app/package.json ./package.json
# (Optional) Prisma engines if needed:
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma 2>/dev/null || true

USER 1001
ENV PORT=8080
EXPOSE 8080
CMD ["node", "dist/index.js"]
