FROM node:22-slim AS base
RUN corepack enable pnpm

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/core/package.json packages/core/
COPY packages/web/package.json packages/web/
RUN pnpm install --frozen-lockfile

FROM base AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/core/node_modules ./packages/core/node_modules
COPY --from=deps /app/packages/web/node_modules ./packages/web/node_modules
COPY packages/core packages/core
COPY packages/web packages/web
COPY templates templates
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
RUN pnpm --filter @netrock/web build

FROM nginx:alpine
COPY packages/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/packages/web/build /usr/share/nginx/html
EXPOSE 8080
