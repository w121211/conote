# Quickstart

Adopt monorepo style through yarn workspace, see https://github.com/vercel/next.js/tree/canary/examples/with-yarn-workspaces

- / --- root
  - /packages --- packages used by apps, independent, not dependes on each other
  - /apps --- web app and browser app, depends on packages
  - /k8s --- deployment configs

```sh
# from project-root, sync packages versions in order to share dependencies, @see https://github.com/JamieMason/syncpack/
npx syncpack list-mismatches --source "packages/*/package.json" --source "apps/*/package.json"
npx syncpack fix-mismatches --source "packages/*/package.json" --source "apps/*/package.json"

# install all packages
yarn install

# compile & build side-packages so apps can import
yarn run build-packages
```

# Dev with Docker

Install [docker-sync](https://github.com/EugenMayer/docker-sync) for much better performance

```sh
# from project-root
docker-sync start

# use arm64 config, eg Mac M1 chip
docker-sync start --config=docker-sync.arm64.yml
```

Run vscode devcontainer: Vscode remote-container extension, specify in `./.devcontainer`, cmd+shift+p > rebuild & open in container

```sh
sudo docker exec -it <container_app> zsh
```

# Deploy with Kubernetes

kubectl Cheat Sheet: https://kubernetes.io/docs/reference/kubectl/cheatsheet/

### Skaffold: dev locally

```sh
# install minikube, skaffold, helm
brew install minikube, skaffold, helm...

minikube start # start minikube cluster
kubectl get pods -A

# check is context in localk
kubectl config get-contexts
kubectl config use-context minikube

# from project root folder, test dockerfile works first
docker build --progress=plain .

# dev
skaffold dev --profile=minikube --port-forward

### Debug ###

# ensure ingress is installed, <error: endpoints "default-http-backend" not found> means not installed yet
kubectl describe ingress

# use helm to install ingress
helm install --namespace kube-system nginx ingress-nginx --repo https://kubernetes.github.io/ingress-nginx
```

### Skafford: deploy to google cloud

GCP Samples

- https://github.com/GoogleCloudPlatform/microservices-demo
- https://github.com/GoogleCloudPlatform/solutions-modern-cicd-anthos
- https://github.com/GoogleCloudPlatform/python-docs-samples

Steps:

- create a GKE cluster, @see https://cloud.google.com/kubernetes-engine/docs/tutorials/hello-app
- enable google cloud build api, @see https://cloud.google.com/build/docs/build-push-docker-image https://cloud.google.com/build/docs/deploying-builds/deploy-cloud-run
- create a google cloud artifact registry, eg 'conote-docker-repo', @see https://cloud.google.com/artifact-registry/docs/docker/quickstart
- setup gke ingress with http, enable `HttpLoadBalancing`, @see https://cloud.google.com/kubernetes-engine/docs/how-to/load-balance-ingress?hl=en#http-add-on
- setup Google-managed SSL certificates, `external ip` @see https://cloud.google.com/kubernetes-engine/docs/how-to/managed-certs?hl=en
- modiy .env.local url (corresponding GKE's external IP）

- install postgresql on gke through helm

```sh
# switch context to cloud cluster
kubectl config get-contexts
kubectl config use-context ...

# change repo name based on google cloud artifact registry https://cloud.google.com/artifact-registry/docs/docker/quickstart
skaffold dev --profile=gcb --default-repo='us-central1-docker.pkg.dev/conote-web-project/conote-docker-repo' --port-forward

# build & deploy
skaffold run --profile=gcb --default-repo='us-central1-docker.pkg.dev/conote-web-project/conote-docker-repo' --tail

# deploy only (no build)
skaffold deploy --default-repo='us-central1-docker.pkg.dev/conote-web-project/conote-docker-repo' --images='conote-webapp-image:latest'

# remove deployment
skaffold delete
```

Setup external-ip

- Google cloud VPC network
  - firewall -> open port
  - external ip

#### GKE guide

How to connect my domain to pod?

How to setup https?

How to resize gke boot disk?

- TLDR, add another node pool (and set boot disk size) and delete the current

### Postgresql install, dump, restore

See:

https://gist.github.com/ricjcosme/cf576d3d4272cc35de1335a98c547da6
https://cwienczek.com/2020/06/simple-backup-of-postgres-database-in-kubernetes/
https://simplebackups.io/blog/postgresql-pgdump-and-pgrestore-guide-examples/#summary-of-the-pg_restore-command
https://github.com/rinormaloku/postgre-backup-container

#### Install postgres chart

```sh
# use helm to install postgres chart, https://bitnami.com/stack/postgresql/helm
helm repo add ...
helm repo update
helm install conote-release --set global.postgresql.auth.username=postgresuser bitnami/postgresql

# delete chart, also needs to delete PVC
helm list
helm delete ...
kubectl get pvc
kubectl delete pvc ...

# get the password for "postgres"
export POSTGRES_ADMIN_PASSWORD=$(kubectl get secret --namespace default conote-release-postgresql -o jsonpath="{.data.postgres-password}" | base64 --decode)

# get the password for "postgresuser"
export POSTGRES_PASSWORD=$(kubectl get secret --namespace default conote-release-postgresql -o jsonpath="{.data.password}" | base64 --decode)

# open a psql client called conote-release-postgresql-client, and keeps it alive for dump/restore
kubectl run conote-release-postgresql-client --rm --tty -i --restart='Never' --namespace default \
  --image docker.io/bitnami/postgresql:14.2.0-debian-10-r14 --env="PGPASSWORD=$POSTGRES_PASSWORD" \
  --command -- psql --host conote-release-postgresql -U postgresuser -d postgres -p 5432

# connect database from outside the cluster
kubectl port-forward --namespace default svc/conote-release-postgresql 5432:5432 \
  & PGPASSWORD="$POSTGRES_PASSWORD" psql --host 127.0.0.1 -U postgresuser -d postgres -p 5432

# after finish dump/restore, delete the pod
kubectl get pods -o wide
kubectl delete pod conote-release-postgresql-client
```

#### Dump

```sh
# psql commands
\l # list databases
\c prisma # change to prisma database
\dt # list tables
SELECT * FROM "User";

# dump from local docker
docker exec -i ${pg_container_id} sh -c "PGPASSWORD=postgrespassword pg_dump -U postgresuser -d prisma -p 5432 -Ft" > local_prisma_dump-$(date +%Y%m%d).tar

# dump from k8s
kubectl exec -i conote-release-postgresql-client -- pg_dump --host conote-release-postgresql -U postgresuser -d prisma -p 5432 -Ft > gke_conote_prisma_dump-$(date +%Y%m%d).tar
```

Dump to CSV, JSON? Use dump & restore, then access pgadmin and export to csv, json.

#### Restore

```sh
# Restore to k8s
# create database if not exist in psql
$(psql) CREATE DATABASE prisma;

# For case require to drop database, !!! use carefully !!!
$(psql) DROP DATABASE prisma;

# restore to k8s
kubectl exec -i conote-release-postgresql-client -- pg_restore --host conote-release-postgresql -C -d postgres -v -p 5432 -U postgresuser -Ft < ${prisma_dump_file.tar}

# restore to local docker
#  '-d postgres' means connect to database 'postgres' (otherwise will throw connection fail),
#  the 'prisma' database will be created during running the restore-script
docker exec -i ${pg_container_id} sh -c "PGPASSWORD=postgrespassword pg_restore -C -d postgres -v -p 5432 -U postgresuser -Ft" < ${prisma_dump_file.tar}
```

Troubleshoots:

- if reinstall postgres chart, also require delete pvc, otherwise will not able to login to the postgresql
  ```sh
  kubectl get pvc
  kubectl delete pvc ...
  ```
  https://github.com/bitnami/charts/issues/2061

#### Migrate

Migration flow:

1. Dump cloud database to local machine
2. Restore the database to local for testing
3. (Optional) Delete `_prisma` table to ignore previous migrations and create `prisma.schema` from the exisiting database
4. Use `prisma migrate dev` to write migrations, data may loss
5. Restore the database to local again, use `prisma migrate resolve` and then `prisma migrate deploy` to apply migrations
6. Dump the local database which applied migrations
7. Restore the after-migrate-database to cloud

See

- https://www.prisma.io/docs/guides/database/developing-with-prisma-migrate/add-prisma-migrate-to-a-project

```sh
# (optional) generate prisma.schema from exisiting database
yarn dotenv -e .env.local prisma migrate db pull

# alter sql first then apply
yarn run migrate --create-only
yarn dotenv -e .env.local prisma migrate dev

# exclude initial script
yarn dotenv -e .env.local prisma migrate resolve
```

# Todos

v-discuss

- [?] 同一事件在不同新聞網頁報導時，如何統整筆記？@eg $RBLX - #$RBLX 暴跌 25%# -> suggest similar pages
- [?] note without bulletin
- [?] remove bullet emoji -> easier & better for co-editing, note contribution calculated by counting words/lines

v-0.2.1

- optimize
  - avoid rerender if possible
  - use SSR if possible
  - consider switch to https://typegraphql.com/
- auth
  - [v] improve login, logout stablility -> useMe()
  - [next] switch to next-firebase-auth once it is upport for firebase v9 (token-based)
    - for now, use firebase official example, cookie-based, no csrf
    - require both server (useMe) & firebase to logged-in, if server-side not logged in, should also revoke client-side firebase token so client-side check not remained logged-in
      - next-firebase-auth: auth token in header, support SSR, not support firebase v9 yet
      - CSRF, if use auth token in header, no need to consider this, also in line with firebase
      - token based apollo (similar to JWT?)
        - https://github.com/gladly-team/next-firebase-auth/discussions/100#discussioncomment-1215068
- user
  - [prior] (req) user-page, include user's notes, rates, interested fields
  - (?) anonymous user
- link
  - try to exclude url search-params by comparing html page @ref
    https://stackoverflow.com/questions/49582276/php-compare-urls-is-shown-page-the-same
    https://stackoverflow.com/questions/456302/how-to-determine-if-two-web-pages-are-the-same
- editor
  - inline-poll
  - inline filtertag `#filter-tag`
  - inline url, eg https://arxiv.org/abs/2112.00114
  - [v] inline-comment `- some input // here is a comment, ignores using '...' when exceeding one line`
  - [?] root li without bullet icon?
  - [pending] 中文全形對輸入 symbol 不方便，eg 「「xxx」」（（xxx）） -> 自動轉換
  - [v@lisa] labels @eg #new-note #fisrt-commit
  - (req) show doc diff
  - (req) easy to reference sourc url -> eg copy url button, @url
  - (req) show keyword as hints (optional disable by setting)
  - (req) function panel, eg '/'
  - (req) '##' -> cursor jumps to middle, #OOO# + ENTER, jumps out cursor, eg 純純寫作
  - get is doc modified
  - if not saved, jump warning before leaving
  - edit source directly (for fixing bugs)
  - [v] (req) auto complete support selection, eg selection 'twitter' + key '[' => [twitter]
  - (req) suggest similar topics for newly created note, eg [[twitter]] (new), suggest [[Twitter]]
- author
  - support author and its ogranization, eg 楊惠宇分析師*永誠國際投顧* -> @楊惠宇(永誠國際投顧分析師) @永誠國際投顧
- note
  - (?) add [[topic:heading]], eg [[人身保險:比較]]
  - (req) report, eg private page, @eg https://domains.google.com/registrar/konote.one/dns?_ga=2.252326218.217399875.1644890899-434669085.1641528541&ci=1
  - mentions in notes
  - redirect, eg $BA -> [[Boeing]]
- digest
  - (?) discuss first?
  - (?) new topics/urls
  - (ui) able to show full title, eg hover
  - (ui) clear distinguish between webpage
  - (ui) emphasize wenpage domain
- settings
  - enable/disable auto fill keywords for webpage-note
- /rate
  - [prior] gql create ticker
  - [prior] ticker & [[topic]] should bind together
  - (ui) create ticker form
  - rate form with annotate
  - user can also rate
- fetcher
  - rewrite fetcher
- DNS
  - http redirect to https
  - redirect konote.one to www.konote.one
- [@hsuan] nlp
  - [v] greedy rate samples from cnyes news
  - [working@chi] training on greedy samples
    - train ner -> entities, subj/obj
    - train classifier -> rate (long, short, hold)
- give & take
  - share cards
  - credit
- testing
  - assign leader
  - testin user experience, max 10 users, free note writing -> [[conote dev]], feedbacks/improves
- prisma
  - add a short id and not use cuid in front-end
- doc
  - check note-copy is in sync with the latest note
    - update note-meta should first check is the latest card
- [@hsuan] invite code
- [@lisa] storybook
  - [] user-page
  - block-editor
    - block
      - [] selected block
      - [] block drag-drop indicator
    - doc
      - [] doc-template (easy test bed for parse-render), include inline-items: discuss, symbol, url, comment
    - editor
      - [] modal editor
    - [] search-panel
    - [] inline
  - loading -> static icon
- [@chi] block-editor
  - modal editor
    - [v] basic
    - [] switch between titles or close
  - [] inline items
  - [v] auto complete
  - redo/undo
    - [v] basic redo/undo through elf/history
    - [] (issue) caret lost after undo
    - [] textarea value undo, redo
    - [] textarea value lost after undo
  - select
    - [] mouse select
    - [] keyboard select
  - [] drag and drop
  - [] copy and paste
  - doc store
    - [] seperated blocks store for each doc
  - doc save

v0.2

- /index
  - [v] announcement
- naming
  - [v] 'card' to 'note'
- /author
  - [v] gql create/update author
  - [prior@lisa] edit author meta (ie intro)
  - [v] (ui) add @ mark on author
  - [v] author rates <- gql rates by author
  - [pending] author articles <- gql links by author <- similar to rates
- /editor
  - [v] auto-complete brackets, eg [[]], (()), ←, → , ##
  - [v] (req) a save button
  - [pending] (req) a setting button
  - [v] (req) search panel, including ticker, topic, discuss
  - [prior] (req) web-note with keyword hints -> auto fill the note (optional)
  - [prior@lisa] (req) auto fill template (optional)
- discuss `#a discussion topic here#` @eg https://github.com/prisma/prisma/discussions https://github.com/discourse/discourse/tree/main/app/models
  - [v] editor parser, inline element
  - [v] (bk) prisma model, graphql api, resolvers
  - [v] (ui) modal
  - [@lisa] action button for delete, edit, report
- note
  - [prior@lisa] add note emoji :wish (or :watch), eg intersted on this topic and wish someone to fill
  - [prior@lisa] note emoji :up, :down cannnot both be checked -> check at frontend, server will not check
- note-digest
  - [pending] add note emojis
- note search panel
  - [v] newly added symbol should be searchable
  - [v] graphql add search author, ticker with id
  - [v] switch search discuss select to panel
  - search panel with keyboard support
- browser extension
  - [v] (ui) remove scss
  - [working@chi] add inline-rate
  - [pending] deploy to chrome/firefox store -> require to fill tons of info
- database
  - [v] migrate table
  - [pending] script for couting words/notes of an user -> use user instead
- branch
  - [prior@hsuan] design channel database schema
  - (req) subdomain/channel, eg [[dev/Browser Extension]]
  - switch commit to channel base, @eg @user/some_topic -> @all/some_topic
  - handle doc conflict -> git mechanism
- note-meta
  - should keep user update record -> (?) allow update card-meta without commit note?

v0.1.1

- [v] (bug) digests load more
- card-meta-form
  - [v] (ui) field width align -> keywords
  - [v] (bug) keywords broken
  - [v] (req) card-meta-form field should not memorize value
  - fields
    - title -> 1. [[title]], 2. HTML title
    - redirect
    - url, cannot modify
    - keywords
  - if card is existed (ie got id), able to update note meta instantly without commit
- doc-index
  - [v] (bug) doc-index tree fail when removing parent docs -> remove parent doc also remove children
  - [v] (bug) child doc-index-panel hidden delete not show
  - [v] (ui) doc-index title/symbol display, Webpage -> symbol, title, Ticker -> symbol + title, eg $BA 波音, Topic -> symbol only
- /index
  - [v] (ui) search input box width not full, eg https://www.mobile01.com/topicdetail.php?f=793&t=6520838
  - [v] (ui) fit differnt window width
  - [pending] (bug) search box: 'home', 'end' key has no effect
- /card?url
  - (req) a better error message and report
  - [v] (req) if url is not reachable (eg 503), still create a card, eg https://www.fantom.foundation/
- card-head
  - [v] (ui) card-emojis horizontal display
  - [v] (ui) card-emoji pin should not display count
  - [v] (req) change card symbol name
  - [pending] change card symbol name -> note's reverse-link will fail -> store sym-id in the card-state
- editor
  - [v] (bug) webpage card create error: https://www.mobile01.com/topicdetail.php?f=793&t=6520838
  - [x] (ui) modal editor scroll bar
  - [v] (bug) 'delete-key' error at the end of string followed by 1. inlines, 2. nested, cases: 1. -a --b 2. -a -$X
  - [v] (bug) require cmd+z twice to redo
  - [v] (ui) min width -> left/right margin
  - [v] (ui) line space
  - [pending] (req) parse lc use 'wrapNoe()' instead of 'removeNodes() & insertNodes()' <- keeps original strucutre & avoid undo bug
  - [v] (ui) :pin emoji should not have count
  - [v] (ui) :pin emoji color -> gray (unclick)
  - [pending@lisa] (ui) conote -> konote & when on-hover button add some feedback
  - [v] (bug) while not logged in can still typing in the editor
- workspace
  - [v] (bug) (critical) modal editor open another modal editor, the previous note was not automatically saved
  - [v] (bug) delete note will not work if that note is opening in the editor -> use disabled (raise warning to prevent deletion)
- link
  - [pending] (bug) URL failed: https://www.mobile01.com/topicdetail.php?f=803&t=6541514 -> fail only on server, possibly caused by cloudflare guard
- [v] (req) domain name
- [v] browser extension window popup
- login
  - [v] (bug) unable to logout, possbily caused by client-side token not deleted -> add client-side logout
