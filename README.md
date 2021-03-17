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

# Use Skaffold, Okteto for k8s deployment

Skafford: deploy k8s locally

```
# from project root folder
skaffold dev --port-forward

# 確認ingress有沒有安裝
kubectl describe ingress
# 如果出現 <error: endpoints "default-http-backend" not found>，表示沒安裝
# 用helm安裝ingress
helm install --namespace kube-system nginx ingress-nginx --repo https://kubernetes.github.io/ingress-nginx


```

Okteto: deploy k8s online

```
# from project root folder
okteto pipeline
```
