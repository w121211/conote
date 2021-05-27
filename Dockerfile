# FROM node:14-buster AS base
# COPY ./tsconfig.base.json /workspace/
# WORKDIR /workspace/src/lib/editor
# COPY ./src/lib/editor/package.json ./src/lib/editor/yarn.lock ./
# RUN yarn
# COPY ./src/lib/editor ./
# RUN yarn build

# FROM base AS web
# WORKDIR /workspace/src/web
# COPY ./src/web/package.json ./src/web/yarn.lock ./
# RUN yarn
# COPY ./src/backend ./
# RUN yarn build
# ENTRYPOINT ["yarn", "start"]

# # FROM base AS frontend-build
# # WORKDIR /workspace/src/frontend/web
# # COPY ./src/frontend/web/package.json ./src/frontend/web/yarn.lock ./
# # RUN yarn
# # COPY ./src/frontend/web ./
# # RUN yarn build

# FROM nginx:1.17.0-alpine AS frontend
# COPY --from=frontend-build /workspace/src/frontend/web/build /var/www/
# COPY ./src/frontend/web/configs/nginx.conf /etc/nginx/nginx.conf
# # Expose port 80
# EXPOSE 80
# # Entry point for target:frontend
# ENTRYPOINT ["nginx","-g","daemon off;"]


# Install dependencies only when needed
FROM node:14-alpine AS lib-deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
COPY tsconfig.base.json /app/

WORKDIR /app/src/lib/editor
COPY src/lib/editor ./
# COPY src/lib/editor/package.json src/lib/editor/yarn.lock ./
RUN yarn install --frozen-lockfile
RUN yarn build

WORKDIR /app/src/lib/fetcher
COPY src/lib/fetcher ./
RUN yarn install --frozen-lockfile
RUN yarn build

# WORKDIR /app/src/web
# COPY src/web/package.json src/web/yarn.lock ./
# RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:14-alpine AS deps
COPY tsconfig.base.json /app/
COPY --from=lib-deps /app/src/lib/editor /app/src/lib/editor
COPY --from=lib-deps /app/src/lib/fetcher /app/src/lib/fetcher
WORKDIR /app/src/web
COPY src/web ./
RUN yarn install --frozen-lockfile

FROM deps AS builder
WORKDIR /app/src/web
RUN yarn build

# Production image, copy all the files and run next
FROM node:14-alpine AS runner
WORKDIR /app/src/web

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /app/src/web/next.config.js ./
COPY --from=builder /app/src/web/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/src/web/.next ./.next
COPY --from=builder /app/src/web/node_modules ./node_modules
COPY --from=builder /app/src/web/package.json ./package.json

USER nextjs

EXPOSE 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
# ENV NEXT_TELEMETRY_DISABLED 1

# CMD ["yarn", "start"]
ENTRYPOINT ["yarn", "-start"]