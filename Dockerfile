# @see https://github.com/vercel/next.js/tree/canary/examples/with-docker

# Install dependencies only when needed
FROM node:14-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat gettext
COPY tsconfig.base.json /app/
WORKDIR /app/src/packages
COPY src/packages ./
WORKDIR /app/src/packages/editor
RUN yarn install --frozen-lockfile
WORKDIR /app/src/packages/docdiff
RUN yarn install --frozen-lockfile
WORKDIR /app/src/packages/scraper
RUN yarn install --frozen-lockfile
WORKDIR /app/src/web
COPY src/web/package.json src/web/yarn.lock ./
RUN yarn install --frozen-lockfile
# WORKDIR /app/src/packages/editor
# COPY src/packages/editor ./
# RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:14-alpine AS builder
COPY --from=deps /app/src/packages /app/src/packages
COPY --from=deps /app/src/web/node_modules /app/src/web/node_modules
COPY tsconfig.base.json /app/
WORKDIR /app/src/web
COPY src/web ./
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