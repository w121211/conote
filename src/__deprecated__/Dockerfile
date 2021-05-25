FROM node:14-buster AS base
# Copy whole app to workspace
COPY ./tsconfig.base.json /workspace/
WORKDIR /workspace/src/lib/editor
COPY ./src/lib/editor/package.json ./src/lib/editor/yarn.lock ./
RUN yarn
COPY ./src/lib/editor ./
RUN yarn build

FROM base AS backend
WORKDIR /workspace/src/backend
COPY ./src/backend/package.json ./src/backend/yarn.lock ./
RUN yarn
COPY ./src/backend ./
RUN yarn build
# Entry point for target:backend
# TODO: Use pm2 https://pm2.io/ instead
ENTRYPOINT ["yarn", "start"]

FROM base AS frontend-build
WORKDIR /workspace/src/frontend/web
COPY ./src/frontend/web/package.json ./src/frontend/web/yarn.lock ./
RUN yarn
COPY ./src/frontend/web ./
RUN yarn build

FROM nginx:1.17.0-alpine AS frontend
COPY --from=frontend-build /workspace/src/frontend/web/build /var/www/
COPY ./src/frontend/web/configs/nginx.conf /etc/nginx/nginx.conf
# Expose port 80
EXPOSE 80
# Entry point for target:frontend
ENTRYPOINT ["nginx","-g","daemon off;"]
