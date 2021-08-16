# See https://github.com/vercel/next.js/tree/canary/examples/with-docker

# Install dependencies only when needed
FROM node:14-alpine AS packages-deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat gettext
COPY tsconfig.base.json /app/

WORKDIR /app/src/packages/editor
COPY src/packages/editor ./
# COPY src/lib/editor/package.json src/lib/editor/yarn.lock ./
RUN yarn install --frozen-lockfile
RUN yarn build

WORKDIR /app/src/packages/fetcher
COPY src/packages/fetcher ./
RUN yarn install --frozen-lockfile
RUN yarn build

# Rebuild the source code only when needed
FROM node:14-alpine AS deps
COPY tsconfig.base.json /app/
COPY --from=packages-deps /app/src/packages/editor /app/src/packages/editor
COPY --from=packages-deps /app/src/packages/fetcher /app/src/packages/fetcher
WORKDIR /app/src/web
COPY src/web ./
RUN yarn install --frozen-lockfile

FROM deps AS builder
WORKDIR /app/src/web
RUN yarn build

# Only use for okteto dev
# FROM deps AS okteto-builder
# WORKDIR /app/src/web
# RUN envsubst < ".env.template" > ".env"  

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
COPY --from=builder /app/src/web/apollo/type-defs.graphqls ./apollo/type-defs.graphqls
COPY --from=builder /app/src/web/apollo/query.graphql ./apollo/query.graphql

USER nextjs

EXPOSE 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
# ENV NEXT_TELEMETRY_DISABLED 1

ENTRYPOINT ["yarn", "start"]