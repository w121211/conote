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
skaffold dev --port-forward

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

# change conote-try to corresponding project name
skaffold dev --default-repo=gcr.io/conote-try --port-forward

# deploy
skaffold run --default-repo=gcr.io/conote-try --tail
skaffold delete # remove deploy
```

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

### with Okteto

Sample app: https://github.com/okteto/movies

```sh
# install okteto, see: https://okteto.com/docs/getting-started
...

# dev
cd .../conote/src/web
okteto up --build

# in terminal
yarn run start:okteto

# access
kubectl get pods
kubectl exec -it conote-backend-7875dc7fd8-tzdvl zsh

# from project root folder
cd .../conote
okteto pipeline deploy
okteto pipeline destroy
```

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

# Dev

v0.2

- author page
- discuss modal
- card-digest add card emojis
- /Index -> SSR

v0.1.1

- Card-meta-form
  - [v]field width
  - [v]keywords broken
  - (req) card-meta-form field should not memorize value
- (bug) doc-index tree fail when removing parent docs
- (bug) child doc-index-panel hidden delete not show
- [v]Doc-index title/symbol display
  - Webpage -> symbol, title
  - Ticker -> $BA Google -> Alphabet Boeing 波音
  - Topic -> symbol
  - $2350-TW (title) @http:// @author [[topic]]
  - meta
- [v] (bug) digests load more
- (bug) editor cmd+z need twice to perform correctly
- (req) able to change card symbol name
