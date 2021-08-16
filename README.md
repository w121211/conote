# Use Docker

Install [docker-sync](https://github.com/EugenMayer/docker-sync) for much better performance

```
# from project-root
docker-sync start
```

Run vscode devcontainer: Vscode remote-container extension, specify in `./.devcontainer`, cmd+shift+p > rebuild & open in container

```
sudo docker exec -it <container_app> zsh
```

# K8s Dev & Deploy

kubectl Cheat Sheet: https://kubernetes.io/docs/reference/kubectl/cheatsheet/

### Skafford: dev locally

```
# install skaffold, helm
brew install skaffold, helm...

# 確認context是在local
kubectl config get-contexts
kubectl config use-context docker-desktop

# 用 helm 裝postgres chart
helm repo add ...
helm repo update
helm install ...

# from project root folder, first test dockerfile works
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

步驟

- 在 cloud 建立 k8s cluster https://cloud.google.com/kubernetes-engine/docs/tutorials/hello-app
-

```
# switch context to cloud cluster
kubectl config get-contexts
kubectl config use-context ...

# dev, conote-try需換成對應的project name
skaffold dev --default-repo=gcr.io/conote-try --port-forward

# deploy
skaffold run --tail --profile=dev --default-repo=gcr.io/conote-try
skaffold delete # remove deploy
```

### Postgresql backup, dump, restore

See:

https://gist.github.com/ricjcosme/cf576d3d4272cc35de1335a98c547da6
https://cwienczek.com/2020/06/simple-backup-of-postgres-database-in-kubernetes/
https://simplebackups.io/blog/postgresql-pgdump-and-pgrestore-guide-examples/#summary-of-the-pg_restore-command
https://github.com/rinormaloku/postgre-backup-container

Naive dump & restore

```
# 先開一個 postgres client （不要關）
export POSTGRES_PASSWORD=$(kubectl get secret --namespace default postgres-release-postgresql -o jsonpath="{.data.postgresql-password}" | base64 --decode)
kubectl run postgres-release-postgresql-client --rm --tty -i --restart='Never' --namespace default --image docker.io/bitnami/postgresql:11.12.0-debian-10-r44 --env="PGPASSWORD=$POSTGRES_PASSWORD" --command -- psql --host postgres-release-postgresql -U postgres -d postgres -p 5432

# dump
kubectl exec -i postgres-release-postgresql-client -- pg_dump --host postgres-release-postgresql -U postgres -d prisma -p 5432 -Ft > prisma_dump.tar

# restore
kubectl exec postgres-release-postgresql-client -i -- pg_restore --host postgres-release-postgresql -U postgres -d prisma -p 5432 -Ft --clean --if-exists < prisma_dump.tar
```

Troubleshoots:

- postgres 密碼錯誤，無法登入？ 若重裝 postgres chart，需要另外刪除 pvc
  ```
  kubectl get pvc
  kubectl delete pvc ...
  ```
  https://github.com/bitnami/charts/issues/2061

### with Okteto

Sample app: https://github.com/okteto/movies

```
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

```
# 當修改了 editor 時，需要先 build、更新 package 才能導入（只有 frontend/web 需要，backend 可同步編譯）
# Build lib
cd src/lib/editor
yarn run build

# Update lib
cd src/frontend/web
yarn upgrade @conote/editor
```

# Install & Setup

### 安裝 Docker & VScode

1. 安裝 docker, vscode（包含 remote dev pack [安裝方法](https://code.visualstudio.com/docs/remote/containers)）, github-desktop
2. clone 這個 project
3. 用 vscode 打開 project folder，會自動詢"open and build in container?"，選`yes`，等待 vscode 自動 build 好並開啟

### 啟動開發環境

```bash
# 用terminal進入container-bash
sudo docker ps -a
# 找到fullstack-tutorial的id（下面的範例為32ae50cd95fc），並將他替換
sudo docker exec -it 32ae50cd95fc zsh
```

### 安裝 server-app, client-app

1. 安裝 server-app（只有第一次需要）

```bash
cd /workspace/fullstack-tutorial/app/server
npm install
```

2. 設定 Postgres（只有第一次需要）

- 登入 pgadmin4，網址：http://localhost:5050/，帳密:參考`./.devcontainer/docker-compose.yml`
- 點選`Add New Server`, Name(隨意取):`pg`, HostName:`pg`, Username/Password:參考`./.devcontainer/docker-compose.yml`
- 連線成功後，在 pg-database 點右鍵 > Create Database，Database:`prisma`

```bash
# 初始化資料庫table（利用prisma）
cd /workspace/fullstack-tutorial/app/server
npm run migrate
npm run migrateup

# 將dummy資料(seed)寫入資料庫
npm run seed

# 生成prisma-client code
npm run gen:prisma
```

3. 啟動 server-app

```bash
npm run dev
# 啟動後可試graphql：http://localhost:4000/graphql
```

4. 安裝&啟動 client-app

```bash
cd /workspace/fullstack-tutorial/app/client

# 安裝libraries（只有第一次需要）
npm install

# 啟動，需要一段時間....
npm run start
```

### Client playground

1. 啟動後用瀏覽器打開：http://localhost:3010/，即可看到網站
2. login 帳號: aaa@aaa.com 密碼: aaa
3. vscode 打開 fullstack-tutorial/app/client/src/pages/stage.tsx，找到`const demo = (...)`，依下面指示編輯後存檔

```
const demo = (
    <>
        <h1>hello world</h1>  # 加入此行
        ...
    </>
)
```

4. 瀏覽器會自動更新頁面資訊

### Deployment

1. 有兩個 project 需要同時啟用（使用兩個不同的 docker-compose)

- twint (爬蟲)，包括 elasticsearch
- fullstack (這個)，包括 postgres

```bash
cd .../fullstack
sudo docker-compose up -f .devcontainer/docker-compose.yml

# 進入app container
sudo docker exec -it OOOOOOOO zsh
# 測試elasticsearch連線(external container)
curl http://es:9200
# 測試pgadmin連線(internal container)
curl http://pgadmin:80
```

### Deployment - DigitalOcean

1. Git push
2. ssh cloud
3. install tmux
4. increase file watch
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
5. git pull && docker-compose up
   sudo docker-compose -f .devcontainer/docker-compose.yml up -d
6. install package & build
7. prisma migrate & import data to db
8. 修 client 的 graphql uri & 修 server 的 CORS
9. run client, server
