# Quickstart

Adopt monorepo style through yarn workspace, see https://github.com/vercel/next.js/tree/canary/examples/with-yarn-workspaces

```sh
/           # root
- /packages # packages used by apps, independent, not dependes on each other
- /apps # web app and browser app, depends on packages
- /k8s # deployment configs
```

```sh
# from project-root, sync packages versions in order to share dependencies, @see https://github.com/JamieMason/syncpack/
npx syncpack list-mismatches --source "packages/*/package.json" --source "apps/*/package.json"
npx syncpack fix-mismatches --source "packages/*/package.json" --source "apps/*/package.json"

yarn install  # install all packages
yarn run build-pkgs  # compile & build side-packages so apps can import
```

# Use Docker

Install [docker-sync](https://github.com/EugenMayer/docker-sync) for much better performance

```sh
# from project-root
docker-sync start
```

Run vscode devcontainer: Vscode remote-container extension, specify in `./.devcontainer`, cmd+shift+p > rebuild & open in container

```sh
sudo docker exec -it <container_app> zsh
```

# K8s Dev & Deploy

kubectl Cheat Sheet: https://kubernetes.io/docs/reference/kubectl/cheatsheet/

### Skaffold: dev locally

```sh
# install minikube, skaffold, helm
brew install minikube, skaffold, helm...

minikube start # start minikube cluster
kubectl get pods -A

# check is context in local
kubectl config get-contexts
kubectl config use-context minikube

# from project root folder, test dockerfile works first
docker build --progress=plain .

# dev
skaffold dev --profile=minikube --port-forward

### Debug ###

# 確認 ingress 有沒有安裝，如果出現 <error: endpoints "default-http-backend" not found> 表示沒安裝
kubectl describe ingress

# 用 helm 安裝ingress
helm install --namespace kube-system nginx ingress-nginx --repo https://kubernetes.github.io/ingress-nginx
```

### Skafford: deploy to google cloud

GCP Samples

- https://github.com/GoogleCloudPlatform/microservices-demo
- https://github.com/GoogleCloudPlatform/solutions-modern-cicd-anthos
- https://github.com/GoogleCloudPlatform/python-docs-samples

Steps:

- create a GKE cluster https://cloud.google.com/kubernetes-engine/docs/tutorials/hello-app
- modiy .env.local url (corresponding GKE's external IP）
- change URL on auth0 website

```sh
# switch context to cloud cluster
kubectl config get-contexts
kubectl config use-context ...

# change repo name based on google cloud artifact registry https://cloud.google.com/artifact-registry/docs/docker/quickstart
skaffold dev --profile=gcb --default-repo='us-central1-docker.pkg.dev/conote-try/conote-docker-repo' --port-forward

# deploy
# skaffold run --default-repo=gcr.io/conote-try --tail
skaffold run --profile=gcb --default-repo='us-central1-docker.pkg.dev/conote-try/conote-docker-repo' --tail
skaffold delete # remove deploy
```

Setup external-ip

- Google cloud VPC Network
  - firewall -> open port
  - external ip

### Postgresql install, dump, restore

See:

https://gist.github.com/ricjcosme/cf576d3d4272cc35de1335a98c547da6
https://cwienczek.com/2020/06/simple-backup-of-postgres-database-in-kubernetes/
https://simplebackups.io/blog/postgresql-pgdump-and-pgrestore-guide-examples/#summary-of-the-pg_restore-command
https://github.com/rinormaloku/postgre-backup-container

#### Install postgres chart

```sh
# 用 helm 裝 postgres chart https://bitnami.com/stack/postgresql/helm
helm repo add ...
helm repo update
helm install conote-release --set postgresqlUsername=postgresuser bitnami/postgresql

# 刪除 chart，需另外刪掉 PVC
helm list
helm delete ...
kubectl get pvc
kubectl delete pvc ...

export POSTGRES_ADMIN_PASSWORD=$(kubectl get secret --namespace default conote-release-postgresql -o jsonpath="{.data.postgresql-postgres-password}" | base64 --decode)

export POSTGRES_PASSWORD=$(kubectl get secret --namespace default conote-release-postgresql -o jsonpath="{.data.postgresql-password}" | base64 --decode)

# open a psql client called conote-release-postgresql-client, and keeps it alive for dump/restore
kubectl run conote-release-postgresql-client --rm --tty -i --restart='Never' --namespace default --image docker.io/bitnami/postgresql:11.14.0-debian-10-r18 --env="PGPASSWORD=$POSTGRES_PASSWORD" --command -- psql --host conote-release-postgresql -U postgresuser -d postgres -p 5432
```

#### Dump

```sh
# psql commands
\l # list databases
\c prisma # change to prisma database
\dt # list tables
SELECT * FROM "User";

# dump from local docker
docker exec -i 8ac632cf6317 sh -c "PGPASSWORD=postgrespassword pg_dump -U postgresuser -d prisma -p 5432 -Ft" > prisma_dump.tar

# dump from k8s
kubectl exec -i conote-release-postgresql-client -- pg_dump --host conote-release-postgresql -U postgresuser -d prisma -p 5432 -Ft > gke_conote_prisma_dump-$(date +%Y%m%d).tar
```

#### Restore

```sh
# Restore to k8s
# create database if not exist in psql
$(psql) CREATE DATABASE prisma;  # DROP DATABASE prisma;

# restore to k8s
kubectl exec -i conote-release-postgresql-client -- pg_restore --host conote-release-postgresql -U postgresuser -d prisma -p 5432 -Ft --clean --if-exists < gke_conote_prisma_dump-$(date +%Y%m%d).tar

# restore to local docker
docker exec -i ${container_id} sh -c "PGPASSWORD=postgrespassword pg_dump -U postgresuser -d prisma -p 5432 -Ft" > gke_conote_prisma_dump-${date}.tar
```

Troubleshoots:

- postgres 密碼錯誤，無法登入？ 若重裝 postgres chart，需要另外刪除 pvc
  ```sh
  kubectl get pvc
  kubectl delete pvc ...
  ```
  https://github.com/bitnami/charts/issues/2061

# Hints

```sh
# 當修改了 editor 時，需要先 build、更新 package 才能導入（只有 frontend/web 需要，backend 可同步編譯）
# Build lib
cd src/lib/editor
yarn run build

# Update lib
cd src/frontend/web
yarn upgrade @conote/editor
```

# NLP Todos

v0.1.0

- [v] greedy rate samples from cnyes news
- training on greedy samples

# Todos

v-next

- inline-poll
- optimize react
  - avoid rerender if possible

v0.2

- /index
  - [v] announcement
  - SSR
- /author
- card-meta
  - support author and its company, eg 楊惠宇分析師*永誠國際投顧* -> @楊惠宇(永誠國際投顧分析師) @永誠國際投顧
- card-digest
  - [pending] add card emojis
- /editor
  - parse url, eg https://arxiv.org/abs/2112.00114
  - auto-complete brackets, eg [[]], (()), ->, ##
  - 中文全形對輸入 symbol 不方便，eg 「「xxx」」（（xxx）） -> 自動轉換
  - (dsq) root li without bullet icon?
- inline-discuss `#a discussion topic here#`
  - editor parser, inline element
  - modal
- inline-comment `- some input // here is a comment followed by '//', ignores using '...' when exceeding one line`
- inline-rate
  - user can also rate
-

- browser
  - add inline-rate
- add card emoji :wish (or :watch), eg intersted on this topic and wish someone to fill
- (?) add [[topic:sub-title]], eg [[人身保險:比較]]
- give & take

v0.1.1

- [v] (bug) digests load more

- card-meta-form
  - [v] (ui) field width align -> keywords
  - [v] (bug) keywords broken
  - [v] (req) card-meta-form field should not memorize value
- doc-index
  - (bug) doc-index tree fail when removing parent docs
  - [v] (bug) child doc-index-panel hidden delete not show
  - [v] (ui) doc-index title/symbol display
    - Webpage -> symbol, title
    - Ticker -> symbol + title, eg $BA 波音
    - Topic -> symbol only
- /index
  - [v] (ui) search input box width not full, eg https://www.mobile01.com/topicdetail.php?f=793&t=6520838
- /card?url
  - (req) a better error message and report
- card-head
  - [v] (ui) card-emojis horizontal display
  - [v] (ui) card-emoji pin should not display count
  - [investigating] (req) change card symbol name
- editor
  - [v] (bug) webpage card create error: https://www.mobile01.com/topicdetail.php?f=793&t=6520838
  - [x] (ui) modal editor scroll bar
  - [working] (bug) 'delete-key' error at the end of string followed by 1. inlines, 2. nested
    - 1. -a -\t b 2. -a -$X
  - [pending] (bug) require cmd+z twice to redo
  - [v] (ui) min width -> left/right margin
  - [v] (ui) line space
-

- (req) domain name
- (req) browser extension
- search box
  - (bug) 'home', 'end' key has no effect
- (?) testin user experience, max 10 users, free note writing -> [[conote dev]], feedbacks/improves
