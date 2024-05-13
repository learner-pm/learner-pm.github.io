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

可以看到能访问的url并不是 `minikube ip + 32215`，具体见[这儿](https://github.com/kubernetes/minikube/issues/7344)

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

## NameSpace

设置`kind` 为`Namespace`可生成命名空间

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: dev
```

查看命名空间

```bash
kubectl get namespace
```

将 pod 加到指定的 namespace 下，如下

```bash
kubectl apply -f deployment.yaml -n dev
```

## configMap

`configMap` 可以将配置数据和应用程序分开，比如在存在多个命名空间的情况下， 不同的命名空间下的某些变量不同，比如版本号，数据库相关信息等，这时就可以使用configMap 来进行处理。

### 配置数据

如下，将生成一个configMap，名字为docs-config，值有`VERSION`

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: docs-config
data:
  VERSION: '1.0.1'
```

### 使用数据

如下添加`env`，`name`表示代码可以从环境变量中获取变量`VERSION`，`valueFrom`如同字面意思，表示数据从哪来，`configMapKeyRef`意思从name为`docs-config`的map中取key为`VERSION`的值

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: docs-test-pod
spec:
  containers:
    - name: docs-test-pod
      image: pengmmm/docs:latest
      env:
        - name: VERSION
          valueFrom:
            configMapKeyRef:
              name: docs-config
              key: VERSION
```

## 探针

探针时k8s 用于检测容器健康状态，并且可以采取相应措施的一个方式。

探针有三种类型：存活探针、就绪探针、启动探针

### 存活探针

存活探针主要用于检测容器是否处于运行状态。如果探针失败，那么k8s就会删除容器，并尝试重新启动容器，这样可以确保容器的正常工作。

::: tip 提示
错误的存活探针可能会导致级联故障。 这会导致在高负载下容器重启；例如由于应用无法扩展，导致客户端请求失败；以及由于某些 Pod 失败而导致剩余 Pod 的工作负载增加。了解就绪探针和存活探针之间的区别， 以及何时为应用配置使用它们非常重要。
:::

如下，存活探针的检测方式是一个http的get请求，`periodSeconds`定义每间隔三秒检一次。`initialDelaySeconds`定义首次探针检测的前的等待时间为两秒，容器启动后
kubelet会向容器内运行的服务（服务监听3000接口）发送一个http get 请求，

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: docs-test-pod
spec:
  containers:
    - name: docs-test-pod
      image: pengmmm/docs:latest
      livenessProbe:
        httpGet:
          path: /getInfo
          port: 3000
        initialDelaySeconds: 2
        periodSeconds: 3
```

::: tip 提示
返回大于或等于 200 并且小于 400 的任何代码都标示成功，其它返回代码都标示失败。
:::

针对TCP的探针，这个探针会在容器启动后15秒后进行第一次存活探针，存活探针会尝试连接容器的8080端口，失败则会重启

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: docs-test-pod
spec:
  containers:
    - name: docs-test-pod
      image: pengmmm/docs:latest
      livenessProbe:
        tcpSocket:
          port: 8080
        initialDelaySeconds: 15
        periodSeconds: 20
```

### 启动探针

顾名思义，启动探针和容器的启动有关。当容器的启动比较耗费时间时，就可以使用启动探针来进行保护。启动探针用于确定容器是否已经成功启动。

针对 HTTP 或 TCP 检测，可以通过将 failureThreshold \* periodSeconds 参数设置为足够长的时间来应对比较长的启动时间

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: docs-test-pod
spec:
  containers:
    - name: docs-test-pod
      image: pengmmm/docs:latest
      startupProbe:
        httpGet:
          path: /getInfo
          port: 3000
        initialDelaySeconds: 20
        periodSeconds: 10
```

### 就绪探针

针对应用暂时无法为请求提供服务，或时启动后会依赖外部服务等情况下，既不想杀死应用，也不想它发送请求，就可使用就绪探针。如果就绪探针失败，Kubernetes 将会从 Service 的负载均衡器中将容器剔除，直到探针成功为止。这可以确保只有在容器已经准备好处理请求时，才将流量发送到该容器。就绪探针通常用于等待应用程序初始化或加载必要的数据

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: docs-test-pod
spec:
  containers:
    - name: docs-test-pod
      image: pengmmm/docs:latest
      readinessProbe:
        httpGet:
          path: /getInfo
          port: 3000
        initialDelaySeconds: 20
        periodSeconds: 10
```

:::tip 提示
就绪探针在容器的整个生命周期中保持运行状态。
:::

TCP的探针，结合存和探针使用。

首先k8s会在容器启动10秒后发送一个就绪探针，尝试连接容器的87080端口。连接成功就会标记容器为就绪状态，每间隔2秒就会发送一次探测，失败就会被k8s从`service`的负载均衡中被剔除，不会在接收到请求。
存活探针会尝试连接容器的8080端口，失败则重启容器，成功则5秒间隔探测一次

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: docs-test-pod
spec:
  containers:
    - name: docs-test-pod
      image: pengmmm/docs:latest
      readinessProbe:
        tcpSocket:
          port: 8080
        initialDelaySeconds: 10
        periodSeconds: 2
      livenessProbe:
        tcpSocket:
          port: 8080
        initialDelaySeconds: 10
        periodSeconds: 5
```

三种类型的探针都使用的一个pod

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: docs-test-pod
spec:
  containers:
    - name: docs-test-pod
      image: pengmmm/docs:latest
      readinessProbe:
        httpGet:
          path: /getInfo
          port: 3000
        initialDelaySeconds: 20
        periodSeconds: 10
      livenessProbe:
        httpGet:
          path: /health
          port: 3000
        initialDelaySeconds: 30
        periodSeconds: 15
      startupProbe:
        httpGet:
          path: /ready
          port: 3000
        initialDelaySeconds: 15
        periodSeconds: 20
```

- 就绪探针（readinessProbe）:
  - 使用 HTTP GET 方法检查路径 /getInfo，端口为 3000。
  - 初始延迟 20 秒：Pod 启动后等待 20 秒开始进行就绪探针的检查。-每隔 10 秒进行一次检查：每隔 10 秒检查一次容器的就绪状态。
  - 如果成功：连续一次成功探测（successThreshold = 1），Pod 将被标记为就绪。
  - 如果失败：连续三次失败探测（failureThreshold = 3），Pod 将被标记为未就绪，并从 Service 的负载均衡器中移除。
- 存活探针（livenessProbe）:
  - 使用 HTTP GET 方法检查路径 /health，端口为 3000。
  - 初始延迟 30 秒：Pod 启动后等待 30 秒开始进行存活探针的检查。
  - 每隔 15 秒进行一次检查：每隔 15 秒检查一次容器的存活状态。
  - 如果成功：连续一次成功探测（successThreshold = 1），容器将被标记为存活。
  - 如果失败：连续三次失败探测（failureThreshold = 3），Kubernetes 将杀死容器，并尝试重新启动。
- 启动探针（startupProbe）:
  - 使用 HTTP GET 方法检查路径 /ready，端口为 3000。
  - 初始延迟 15 秒：Pod 启动后等待 15 秒开始进行启动探针的检查。
  - 每隔 20 秒进行一次检查：每隔 20 秒检查一次容器的启动状态。
  - 如果成功：连续一次成功探测（successThreshold = 1），容器将被标记为已启动并且可以正常运行。
  - 如果失败：连续三次失败探测（failureThreshold = 3），Kubernetes 将杀死容器，并尝试重新启动。

## 字段

kind用户描述资源类型。

- Pod: 一个或多个容器的组合
  - 重新执行`kubectl apply -f xx.yaml`，如果有改动，需要先删除pod
- Deployment: 创建容器的副本
  - 这个类型下的pod，在删除后会自动新建
- Service: 访问Pod的方式，通过标签选择器请求到相应的Pod中
- ConfigMap: 定义非机密的数据配置，便于和Pod分离，在不重新构建镜像的情况下做到修改
- Secret: 以base64的形式存储比较敏感的数据如密码等
- Namespace: 通过声明不同的命名空间，用于对k8s中的资源进行逻辑隔离，便于多人或团队开发

```yaml
kind: Pod | Deployment | Service | ConfigMap | Secret | Namespace
```

metadata 描述一些基本信息

```yaml
metadata:
  name: my-pod # 描述这个类型的名字
  namespace: default # 所处的命名空间
  labels:
    app: my-app # 标签
    tier: backend #标签
  annotations: #资源对象的额外信息
    description: 'This is my Pod for backend service.'
    owner: 'John Doe'
```

spec 描述描述资源的规范，根据kind类型具有不同的要求

1. Pod

```yaml
spec:
  containers:
    - name: nginx #容器名
      image: nginx:latest #拉取的镜像，从hub.docker.com 上拉取
      ports:
        - containerPort: 80 # 容器内部暴露的端口
```

2. Deployment

```yaml
spec:
  replicas: 3 # 副本数量
  selector: # 选择器，用于选择要管理的 Pod
    matchLabels: # 标签
      app: my-app
  template: # Pod 模板，可以看作Pod下的定义
    metadata:
      labels:
        app: my-app
    spec:
      containers:  容器定义
        - name: my-container
          image: my-image:latest
          ports:
            - containerPort: 8080
```

3. Service

```yaml
spec:
  selector: # 选择器，用于选择要关联的 Pod#
    app: my-app
  ports: # 端口配置
    - protocol: TCP
      port: 80 # 服务监听的端口
      targetPort: 8080 # 将流量转发到 Pod 中的端口
      nodePort: 32216 ## 指定访问的端口
  type: NodePort #该类型会在每个 Node 上开放一个固定的端口
  ---
  type: NodePort # 默认类型。该类型将 Service 分配一个集群内部的虚拟 IP 地址，并仅在集群内部可访问
```

4. ConfigMap

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: my-configmap
data:
  key1: value1
  key2: value2
```

5. Secret

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: my-secret
type: Opaque
data:
  username: dXNlcm5hbWU=
  password: cGFzc3dvcmQ=
```

6. Namespaces

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: dev

---
apiVersion: v1
kind: Namespace
metadata:
  name: test
```

## Action

启动单节点集群，其中`minikube`是一个启动集群的工具，[官方](https://minikube.sigs.k8s.io/docs/start/)下载

```bash
minikube start
```

查看容器

```bash
kubectl get pods

kubectl get pods <pod-name> # pod信息

kubectl get pods <pod-name> -o wide # pod信息

kubectl describe pod <pod-name> # 更详细的 Pod 信息
```

查看节点

```bash
kubectl get nodes
```

查看Service

```bash
kubectl get services
```

查看日志

```bash
kubectl logs <pod-name>
```

将资源配置文件应用到集群中，`-f`是文件的简称。create 用来通过yaml文件进行创建资源，apply也有相同的效果，不过可以进行更新操作。

```bash
kubectl create -f xxx.yaml
kubectl apply -f xxx.yaml
```

删除 Pod、Service

```bash
kubectl delete  pod <pod-name>
kubectl delete service <service-name>
```
