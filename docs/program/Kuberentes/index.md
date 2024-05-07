# kuberentes

Kuberentes 简称“k8s”，是一个容器管理工具。记录一些命令。

学习和使用k8s

## 部署应用

### minikube

采用`minikube`在本地部署一个单节点的集群

在项目下建两个文件`yaml`文件

### deployment.yaml

该文件定义了一个 Deployment，其中包含一个名为 docs-8 的 Pod 模板，该 Pod 中运行一个名为 docs-8-test 的容器。此容器使用 pengmmm/docs:latest 镜像，并在容器内部暴露了端口80

其中 `penngmmm/docs:latest` 镜像是提前上传到 hub.docker 上的

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: docs-8
spec:
  replicas: 1
  selector:
    matchLabels:
      app: docs-8
  template:
    metadata:
      labels:
        app: docs-8
    spec:
      containers:
        - name: docs-8-test
          image: pengmmm/docs:latest
          ports:
            - containerPort: 80 ## 暴露的端口
```

可以看出这一步是定义好容器

执行可以使用如下命令

```bash
kubectl apply -f deployment.yaml
```

执行完后生成对应的容器

再次执行如下命令进行查看容器，其中status为Running即代表容器正在运行中，下一步即是访问容器

```bash
kubectl get pods

console
---
NAME                      READY   STATUS    RESTARTS   AGE
docs-8-54d9fb54d6-mzxmv   1/1     Running   0          56m
```

### service.yml

创建一个 Service 来公开该容器的端口

```bash
apiVersion: v1
kind: Service
metadata:
  name: docs-8-service
spec:
  selector:
    app: docs-8
  ports:
    - protocol: TCP
      port: 8080 ## service暴露的端口
      targetPort: 80 ## 容器的短裤
      nodePort: 32215 ## 指定访问的端口
  type: NodePort
```

等同于deployment的执行，执行如下命令

```bash
kubectl apply -f service.yaml
```

执行后可以执行如下命令查看service

```bash
kubectl get services

console
---
NAME             TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
docs-8-service   NodePort    10.97.154.202   <none>        8080:32215/TCP   5h16m
kubernetes       ClusterIP   10.96.0.1       <none>        443/TCP          14d
```

这时就可以通过 minikube ip + 32215 去访问了，不过我当时并不能成功访问，执行如下命令后复制url才能访问

```bash
minikube service docs-8-service --url

minikube service docs-8-service # 直接打开页面

console
---
http://127.0.0.1:49779
❗  因为你正在使用 windows 上的 Docker 驱动程序，所以需要打开终端才能运行它。
```

可以看到能访问的url并不是 `minikube ip + 32215`，具体见[官网](https://minikube.sigs.k8s.io/docs/start/)

## kubectl面板

安装

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.4.0/aio/deploy/recommended.yaml
```

新开一个bash启动 dashboard

```bash
kubectl proxy
```

在浏览器输入如下地址即可进入面板的登录界面，有两个登录选项，区别就是token的操作访问小于config，采用使用token的方式进行登录

```bash
http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/
```

接下来生成token

首先书写一个配置文件来配置一个账户，主要作用是创建一个admin-user的服务账户，同时将cluster-admin的角色绑定到这个账户上，赋予其管理员的权限

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: admin-user
  namespace: kubernetes-dashboard
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: admin-user
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: cluster-admin
subjects:
  - kind: ServiceAccount
    name: admin-user
    namespace: kubernetes-dashboard
```

执行这个文件

```bash
kubectl apply -f dashboard-user.yaml
```

再次执行如下命令即可生成 token ，复制命令行的 token 至页面上后即可登录

```bash
kubectl -n kubernetes-dashboard create token admin-user
```

查看账户的命令，`sa` 是 `serviceaccount` 的简写

```bash
kubectl get sa -n kubernetes-dashboard
```

## Action

启动单节点集群，其中`minikube`是一个启动集群的工具，[官方](https://minikube.sigs.k8s.io/docs/start/)下载

```bash
minikube start
```

查看容器

```bash
kubectl get pods

kubectl get pods -o widekubectl get pods -o wide
```

查看节点

```bash
kubectl get nodes
```

查看日志

```bash
kubectl logs <pod-name>
```

将资源配置文件应用到集群中，`-f`是文件的简称。

create 用来通过yaml文件进行创建资源，apply也有相同的效果，不过可以进行更新操作。

```bash
kubectl create -f xxx.yaml
kubectl apply -f xxx.yaml
```
