# Reference: https://github.com/vercel/next.js/tree/canary/examples/with-docker
# 
# $ docker build --progress=plain . # for testing

# Install dependencies only when needed
FROM node:18-bullseye

# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine 
# to understand why libc6-compat might be needed.
# RUN apk add --no-cache libc6-compat
# RUN apk add --no-cache libc6-compat python3 make g++ 

WORKDIR /workspace
# COPY package.json yarn.lock tsconfig.base.json ./
COPY package.json tsconfig.base.json ./
COPY packages/docdiff ./packages/docdiff
# COPY packages/editor ./packages/editor
COPY packages/scraper ./packages/scraper
COPY apps/web ./apps/web

# Require dev environment also use AMD64 architecture for yarn.lock to work, otherwise build may fail
# RUN yarn install --frozen-lockfile  
RUN yarn install

RUN yarn build-packages
RUN cd /workspace/apps/web && yarn build

WORKDIR /workspace/apps/web

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

USER nextjs

EXPOSE 3000

ENV PORT 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
# ENV NEXT_TELEMETRY_DISABLED 1

# CMD ["node", "server.js"]
ENTRYPOINT ["yarn", "start"]