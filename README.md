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

# K8s Deployment

### with skaffold

kubectl Cheat Sheet: https://kubernetes.io/docs/reference/kubectl/cheatsheet/

Skafford: deploy k8s locally

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
skaffold dev --port-forward

# use skaffold profile
# skaffold run -p dev

# Debug
# 確認ingress有沒有安裝
kubectl describe ingress
# 如果出現 <error: endpoints "default-http-backend" not found>，表示沒安裝
# 用helm安裝ingress
helm install --namespace kube-system nginx ingress-nginx --repo https://kubernetes.github.io/ingress-nginx

```

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
