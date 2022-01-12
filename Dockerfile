# @see https://github.com/vercel/next.js/tree/canary/examples/with-docker
# $ docker build --progress=plain . # testing

# Install dependencies only when needed
FROM node:16-alpine AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock tsconfig.base.json ./
COPY packages/docdiff ./packages/docdiff
COPY packages/editor ./packages/editor
COPY packages/scraper ./packages/scraper
COPY packages/app-web ./packages/app-web
# RUN echo Yarn version: $(yarn --version)
RUN yarn install --frozen-lockfile
RUN yarn build
WORKDIR /app/packages/app-web
RUN yarn build

# Production image, copy all the files and run next
FROM node:16-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/packages/app-web/public ./public
COPY --from=builder /app/packages/app-web/package.json ./package.json

# Automatically leverage output traces to reduce image size 
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/packages/app-web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/packages/app-web/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
# ENV NEXT_TELEMETRY_DISABLED 1

CMD ["node", "server.js"]