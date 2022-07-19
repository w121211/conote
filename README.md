# Quickstart

Adopt monorepo style through yarn workspace, see https://github.com/vercel/next.js/tree/canary/examples/with-yarn-workspaces

- / --- root
  - /packages --- packages used by apps, independent, not dependes on each other
  - /apps --- web app and browser app, depends on packages
  - /k8s --- deployment configs

```sh
# From project-root, sync packages versions in order to share dependencies
# see https://github.com/JamieMason/syncpack/
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
# From project-root
docker-sync start

# Use arm64 config instead, eg Mac M1 chip
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

- Create a GKE cluster, @see https://cloud.google.com/kubernetes-engine/docs/tutorials/hello-app
- Enable google cloud build api, @see https://cloud.google.com/build/docs/build-push-docker-image https://cloud.google.com/build/docs/deploying-builds/deploy-cloud-run
- Create a google cloud artifact registry, eg 'conote-docker-repo', @see https://cloud.google.com/artifact-registry/docs/docker/quickstart
- Setup gke ingress with http, enable `HttpLoadBalancing`, @see https://cloud.google.com/kubernetes-engine/docs/how-to/load-balance-ingress?hl=en#http-add-on
- Setup Google-managed SSL certificates, `external ip` @see https://cloud.google.com/kubernetes-engine/docs/how-to/managed-certs?hl=en
- Modiy .env.local url (corresponding GKE's external IP）

- Install postgresql on gke through helm

```sh
# Switch context to cloud cluster
kubectl config get-contexts
kubectl config use-context ...

# Change repo name based on google cloud artifact registry https://cloud.google.com/artifact-registry/docs/docker/quickstart
skaffold dev --profile=gcb --default-repo='us-central1-docker.pkg.dev/conote-web-project/conote-docker-repo' --port-forward

# Build & deploy
skaffold run --profile=gcb --default-repo='us-central1-docker.pkg.dev/conote-web-project/conote-docker-repo' --tail

# Deploy only (no build)
skaffold deploy --default-repo='us-central1-docker.pkg.dev/conote-web-project/conote-docker-repo' --images='conote-webapp-image:latest' --tail

# Remove deployment
skaffold delete

# View logs
kubectl get pods
kubectl logs -f ${name_of_pod}
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
\l # List databases
\c prisma # Change to prisma database
\dt # List tables
SELECT * FROM "User";

# Dump from local docker
docker exec -i ${pg_container_id} sh -c "PGPASSWORD=postgrespassword pg_dump -U postgresuser -d prisma -p 5432 -Ft" > local_prisma_dump-$(date +%Y%m%d).tar

# Dump from k8s
kubectl exec -i conote-release-postgresql-client -- pg_dump --host conote-release-postgresql -U postgresuser -d prisma -p 5432 -Ft > gke_conote_prisma_dump-$(date +%Y%m%d).tar
```

Dump to CSV, JSON? Use dump & restore, then access pgadmin and export to csv, json.

#### Restore

```sh
# Restore to k8s

# (Not require)
$(psql) CREATE DATABASE prisma;

# !!!Use carefully!!!, for case require to drop database,
$(psql) DROP DATABASE prisma;

# Restore to k8s
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

v0.2.1

- optimize
  - avoid rerender if possible
  - use SSR if possible
  - consider switch to https://typegraphql.com/
- auth
  - [x] improve login, logout stablility -> useMe()
  - [x] update login page
  - [next] switch to next-firebase-auth once it is upport for firebase v9 (token-based)
    - for now, use firebase official example, cookie-based, no csrf
    - require both server (useMe) & firebase to logged-in, if server-side not logged in, should also revoke client-side firebase token so client-side check not remained logged-in
      - next-firebase-auth: auth token in header, support SSR, not support firebase v9 yet
      - CSRF, if use auth token in header, no need to consider this, also in line with firebase
      - token based apollo (similar to JWT?)
        - https://github.com/gladly-team/next-firebase-auth/discussions/100#discussioncomment-1215068
  - [] web-based token (jwt)
- user
  - [x] (req) user-page, include user's notes, rates, interested fields
  - (?) anonymous user
- link
  - try to exclude url search-params by comparing html page @ref
    https://stackoverflow.com/questions/49582276/php-compare-urls-is-shown-page-the-same
    https://stackoverflow.com/questions/456302/how-to-determine-if-two-web-pages-are-the-same
- editor
  - inline-poll
  - inline filtertag `#filter-tag`
  - inline url, eg https://arxiv.org/abs/2112.00114
  - [x] inline-comment `- some input // here is a comment, ignores using '...' when exceeding one line`
  - [?] root li without bullet icon?
  - [pending] 中文全形對輸入 symbol 不方便，eg 「「xxx」」（（xxx）） -> 自動轉換
  - [x] labels @eg #new-note #fisrt-commit
  - (req) show doc diff
  - (req) easy to reference sourc url -> eg copy url button, @url
  - (req) show keyword as hints (optional disable by setting)
  - (req) function panel, eg '/'
  - (req) '##' -> cursor jumps to middle, #OOO# + ENTER, jumps out cursor, eg 純純寫作
  - get is doc modified
  - if not saved, jump warning before leaving
  - edit source directly (for fixing bugs)
  - [x] (req) auto complete support selection, eg selection 'twitter' + key '[' => [twitter]
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
  - [x] greedy rate samples from cnyes news
  - [working@chi] training on greedy samples
    - train ner -> entities, subj/obj
    - train classifier -> rate (long, short, hold)
- give & take
  - share cards
  - credit
- [pending] testing
  - assign leader
  - testin user experience, max 10 users, free note writing -> [[conote dev]], feedbacks/improves
- prisma
  - [-] add a short id and not use cuid in front-end
- [-] doc
  - [-] check note-copy is in sync with the latest note
    - [-] update note-meta should first check is the latest card
- [@hsuan] invite code
- [@lisa] i18n https://react.i18next.com/
- [@lisa] storybook & nextjs
  - layout
    - nav-bar
      - ui: searchbox
      - gql: searchSymbol
    - side-bar
      - gql: myNoteDraftEntries
  - pages
    - home, /
      - [x] ui
      - gql: discussEntriesLatest, ratesLates (pending), noteDocsMergedLatest, noteDocsToMergeLatest
    - note, /note/[symbol]?draft_id=OOO
      - ui
        - editor
        - content-head-form
        - doc-page need to change to editor-page
        - don't create draft if not yet clicked
        - view-only
      - gql: noteEmojis, myNoteEmojiLike,
    - doc-diff, /note/[symbol]/doc/[doc_id]
      - gql: noteDoc
    - commit, /commit/[commit_id]
      - gql: commit, createCommit
    - discuss, /discuss/[discuss_id]
      - [x] ui
      - gql: discuss, createDiscussPost
    - poll for merge, /poll/[poll_id]
      - ui: similar to discuss, add poll
      - gql: poll, createVote
    - user
      - [x] ui
      - [x] gql: commitsByUser, discussesByUser, ratesByUser@pending
    - settings
      - [] ui
      - [] gql: ???
    - login
      - [] ui
        - Logged in case
      - gql:
  - basic components (build blocks)
    - badge
    - tag
    - button
    - button-no-frame (text like button)
    - link
    - alert
    - tile
    - list
    - symbol-link (button), eg [[Hello world]]
  - components
    - [x] global search
    - loading -> static icon
  - discuss
    - [x] gql
    - [x] discuss-modal -> input should not fixed in the bottom
  - block-editor
    - block-el
      - [x] selected block
      - [] block drag-drop
      - [] textarea decorate: similar to code highlight
      - inline item: create, view in modal, alert if not created
        - [x] inline-symbol
        - [] inline-discuss
        - [] inline-url
    - doc-el
      - [] doc-placeholder, doc-template
    - editor-el
      - [x] modal editor
      - [x] save & drop
    - [x] parse-render-el
    - [x] search-panel
    - sidebar-el
      - theme button -> move to profile page
      - smaller arrow @see https://docs.google.com/document/d/1jvREEWUAgH0HUX_u0vEDQoaA9P7SpnR4SqswnKFJAj4/edit
    - commit panel
- [@chi] block-editor
  - block
    - [x] (bug) unexpected behavior on block merge, split
    - [x] (bug) key-down 'enter' on block-start unexpected behavior
  - modal editor
    - [x] basic
    - [x] switch between titles or close
  - template
    - [] create a template
  - inline items
    - [x] decorate (render-token)
    - [x] inline-symbol
  - auto complete / inline search
    - [x] inline search topic
    - [x] inline search discuss
    - [prior] inline search with key-down support
    - [] if search-hits returns empty array, need also got some feed-back
  - redo/undo
    - [x] basic redo/undo through elf/history
    - [urgent] (issue) unable to redo while editing
    - [] (issue) caret lost after undo
    - [50%] textarea value undo, redo -> undo manager
    - [] textarea value lost after undo
  - copy and paste
    - [] external
    - [] internal -> really need this?
  - select
    - [x] mouse select
      - [] (bug) not works on firefox
    - [x] keyboard select
      - [x] left, right arrow key can trigger deselect
      - [x] (bug) select + bksp/delete -> error
      - [pending] (bug) cursor on second line + shift + up-key, won't trigger to select the whole block when hit the top line (vice versa is working normally)
        => it is caused by onKeyDownEvent.currentTarget.selectionEnd not reflect the real caret position, need to use onKeyUp event to tackle this special case
      - [] (issue) select + delete -> cursor lost
    - [pending] rewrite findSelectedItems
  - drag and drop
    - [x] basic drag & drop (not fully tested, not works on firefox)
  - doc store
    - [] seperated blocks store for each doc
  - doc save
    - [x] save note-draft
    - [] periodically save
    - [] jump warnning if not saved yet (?)
  - commit docs
  - remove 'ts-closure-library' dependency
- check
  - [working@chi] seed
  - [x] discuss emoji, note emoji test add-with-auto-remove -> backend like unlinke return mutations
  - [x] discuss post
  - discuss -> inline-discuss
  - rate & create author
- [@chi] mock data
- [@hsuan] git-style commit -> add branch, domain
  - [x] database schema
  - [x] graphql schema
  - [-] (req) subdomain/channel, eg [[dev/Browser Extension]] -> use domain instead
  - [x] commit drafts
  - merge/reject doc
  - query note (include head-doc)
  - query draft
  - handle doc conflict -> git mechanism

v0.2

- /index
  - [x] announcement
- naming
  - [x] 'card' to 'note'
- /author
  - [x] gql create/update author
  - [prior@lisa] edit author meta (ie intro)
  - [x] (ui) add @ mark on author
  - [x] author rates <- gql rates by author
  - [pending] author articles <- gql links by author <- similar to rates
- /editor
  - [x] auto-complete brackets, eg [[]], (()), ←, → , ##
  - [x] (req) a save button
  - [pending] (req) a setting button
  - [x] (req) search panel, including ticker, topic, discuss
  - [prior] (req) web-note with keyword hints -> auto fill the note (optional)
  - [prior@lisa] (req) auto fill template (optional)
- discuss `#a discussion topic here#` @eg https://github.com/prisma/prisma/discussions https://github.com/discourse/discourse/tree/main/app/models
  - [x] editor parser, inline element
  - [x] (bk) prisma model, graphql api, resolvers
  - [x] (ui) modal
  - [@lisa] action button for delete, edit, report
- note
  - [prior@lisa] add note emoji :wish (or :watch), eg intersted on this topic and wish someone to fill
  - [prior@lisa] note emoji :up, :down cannnot both be checked -> check at frontend, server will not check
- note-digest
  - [pending] add note emojis
- note search panel
  - [x] newly added symbol should be searchable
  - [x] graphql add search author, ticker with id
  - [x] switch search discuss select to panel
  - search panel with keyboard support
- browser extension
  - [x] (ui) remove scss
  - [working@chi] add inline-rate
  - [pending] deploy to chrome/firefox store -> require to fill tons of info
- database
  - [x] migrate table
  - [pending] script for couting words/notes of an user -> use user instead
- note-meta
  - [-] should keep user update record -> (?) allow update card-meta without commit note?

v0.1.1

- [x] (bug) digests load more
- card-meta-form
  - [x] (ui) field width align -> keywords
  - [x] (bug) keywords broken
  - [x] (req) card-meta-form field should not memorize value
  - fields
    - title -> 1. [[title]], 2. HTML title
    - redirect
    - url, cannot modify
    - keywords
  - if card is existed (ie got id), able to update note meta instantly without commit
- doc-index
  - [x] (bug) doc-index tree fail when removing parent docs -> remove parent doc also remove children
  - [x] (bug) child doc-index-panel hidden delete not show
  - [x] (ui) doc-index title/symbol display, Webpage -> symbol, title, Ticker -> symbol + title, eg $BA 波音, Topic -> symbol only
- /index
  - [x] (ui) search input box width not full, eg https://www.mobile01.com/topicdetail.php?f=793&t=6520838
  - [x] (ui) fit differnt window width
  - [pending] (bug) search box: 'home', 'end' key has no effect
- /card?url
  - (req) a better error message and report
  - [x] (req) if url is not reachable (eg 503), still create a card, eg https://www.fantom.foundation/
- card-head
  - [x] (ui) card-emojis horizontal display
  - [x] (ui) card-emoji pin should not display count
  - [x] (req) change card symbol name
  - [pending] change card symbol name -> note's reverse-link will fail -> store sym-id in the card-state
- editor
  - [x] (bug) webpage card create error: https://www.mobile01.com/topicdetail.php?f=793&t=6520838
  - [x] (ui) modal editor scroll bar
  - [x] (bug) 'delete-key' error at the end of string followed by 1. inlines, 2. nested, cases: 1. -a --b 2. -a -$X
  - [x] (bug) require cmd+z twice to redo
  - [x] (ui) min width -> left/right margin
  - [x] (ui) line space
  - [pending] (req) parse lc use 'wrapNoe()' instead of 'removeNodes() & insertNodes()' <- keeps original strucutre & avoid undo bug
  - [x] (ui) :pin emoji should not have count
  - [x] (ui) :pin emoji color -> gray (unclick)
  - [pending@lisa] (ui) conote -> konote & when on-hover button add some feedback
  - [x] (bug) while not logged in can still typing in the editor
- workspace
  - [x] (bug) (critical) modal editor open another modal editor, the previous note was not automatically saved
  - [x] (bug) delete note will not work if that note is opening in the editor -> use disabled (raise warning to prevent deletion)
- link
  - [pending] (bug) URL failed: https://www.mobile01.com/topicdetail.php?f=803&t=6541514 -> fail only on server, possibly caused by cloudflare guard
- [x] (req) domain name
- [x] browser extension window popup
- login
  - [x] (bug) unable to logout, possbily caused by client-side token not deleted -> add client-side logout
