FROM node:22.1.0-alpine as base
# RUN apk add --no-cache libc6-compat

# Install pnpm
RUN corepack enable pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /_app

COPY package.json pnpm-lock.yaml ./

FROM base AS deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY . .

FROM deps as migrate
CMD ["pnpm", "nx", "run", "web:drizzle-migrate"]

FROM deps as build

ENV NODE_ENV=production
RUN pnpm nx run web:build

FROM base AS final

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=build /_app/apps/web/public ./apps/web/public

COPY --from=build --chown=nextjs:nodejs /_app/apps/web/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /_app/apps/web/.next/static ./apps/web/.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "apps/web/server.js"]
