#!/bin/bash

echo "开始构建 Docker 镜像"
docker build -t pengmmm/docs .

echo "推送 Docker 镜像"
docker push pengmmm/docs

echo "执行deployment"
kubectl apply -f k8s/deployment.yaml

echo "执行service"
kubectl apply -f k8s/service.yaml

# 获取服务的 IP 地址和端口
minikube service docs-8-service --url