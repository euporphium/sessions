FROM node:22.1.0-alpine as base
# RUN apk add --no-cache libc6-compat
RUN corepack enable pnpm

WORKDIR /_app

COPY package.json pnpm-lock.yaml ./

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile
RUN ls -la

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

COPY . .
ENV NODE_ENV production
RUN pnpm dlx nx run web-sockets:build

FROM base AS final

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 socketio

COPY --from=prod-deps --chown=nextjs:socketio /_app/node_modules /node_modules
COPY --from=build --chown=nextjs:socketio /_app/apps/web-sockets/dist .

RUN rm package.json pnpm-lock.yaml

USER socketio

EXPOSE 3333
ENV PORT 3333
ENV NODE_ENV production
CMD ["node", "main.js"]
