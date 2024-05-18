# 本地部署前后端分离项目

前端使用React，后端使用Express

## 前端项目

使用`Vite`快速创建项目，直接选择执行命令，依次选择即可。

```bash
npm create vite@latest
```

直接修改`App.tsx`文件，添加一个请求来获取用户数据

```tsx
const App = () => {
  const fetchData = async () => {
    const res = await fetch('http://localhost:3000/getUserInfo')
    const userArr = await res.json()
    setData(userArr)
  }
  return (
    <div className="card">
      <button onClick={fetchData}>fetchData</button>
      <p>
        Edit <code>src/App.tsx</code> and save to test HMR
      </p>
    </div>
  )
}

export default App
```

## 后端项目

使用`Express`启动一个服务

```bash
npm init -y
```

安装 `Express` 、`Cors`

```bash
npm i express cors
```

创建 `app.js` 文件并编写如下代码，监听3000端口，并提供一个接口`getUserInfo`

```js
const express = require('express')
const cors = require('cors')
const app = express()
const port = 3000

app.use(cors())

app.get('/', (req, res) => {
  res.send('你好，世界！')
})

const users = [
  { id: 1, name: 'User 1', age: 25 },
  { id: 2, name: 'User 2', age: 30 },
  { id: 3, name: 'User 3', age: 28 }
]

// 定义 getUserInfo 接口
app.get('/getUserInfo', (req, res) => {
  res.json(users)
})

// 启动服务器
app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`)
})
```

启动前、后端服务，如果顺利，在前端的页面上点击按钮，会请求接口并展示用户名称

```bash
npm run dev
node app.js
```

现在两个服务在本地是可以通信的，下面来将服务部署到k8s中进行通信。

## 编写 Dockerfile

提前在`hub.docker`上创建相应的仓库。前端：`pengmmm/node-frontend` ，后端：`pengmmm/node-backend`

### 前端

前端的dockerfile文件大致流程为：先使用node镜像来构建项目，然后将构建后的文件放置nginx服务器上
，最后启动服务即可。整体上也是一个分段式构建

```dockerfile
FROM node AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY  . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;" ]
```

构建镜像

```bash
docker build -t pengmmm/node-frontend:latest .
```

上传

```bash
docker push pengmmm/node-frontend:latest
```

### 后端

后端服务即需要node作为运行环境即可

```dockerfile
FROM node

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]
```

构建镜像

```bash
docker build -t pengmmm/node-backend:latest .
```

上传

```bash
docker push pengmmm/node-backend:latest
```

## 编写k8s文件

首先编写后端的k8s文件，先验证服务的可用性

### 后端

先是`deployment.yaml`文件

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: node-backend
  labels:
    app: node-backend-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: node-backend-app
  template:
    metadata:
      labels:
        app: node-backend-app
    spec:
      containers:
        - name: node-backend
          image: pengmmm/node-backend:latest
          ports:
            - containerPort: 3000
```

然后是 `service.yaml` 文件，使用8448去映射内部的3000

```yaml
apiVersion: v1
kind: Service
metadata:
  name: node-backend
spec:
  selector:
    app: node-backend-app
  ports:
    - protocol: TCP
      port: 8448
      targetPort: 3000
      nodePort: 32217
  type: NodePort
```

执行两个文件

```bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
```

检测对应的pod是否是`running`状态

查看后端服务，浏览器打印`你好，世界！`即部署成功

```bash
minikube service node-backend
```

### 前端

第一步以前端页面能正常访问为主。

deployment、service文件和后端的差不多，如下：

`deployment.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: node-frontend-app
spec:
  selector:
    matchLabels:
      app: node-frontend-app
  template:
    metadata:
      labels:
        app: node-frontend-app
    spec:
      containers:
        - name: node-frontend-app
          image: pengmmm/node-frontend:latest
          resources:
            limits:
              memory: '128Mi'
              cpu: '500m'
          ports:
            - containerPort: 80
```

`service`

```yaml
apiVersion: v1
kind: Service
metadata:
  name: node-frontend
spec:
  selector:
    app: node-frontend-app
  ports:
    - port: 8884
      targetPort: 80
  type: NodePort
```

同样执行创建和访问命令

```bash
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
minikube service node-backend
```

如果顺利的话，页面会正常呈现

## 前后端通信

接下来就是进行服务的访问，点击按钮后能发送请求并且拿到后端的数据。简单分析下：目前后端的服务能够正常访问，路径为`http://127.0.0.1:xxxx`,如果把前端的请求路径换成这个路径后即可访问。

```tsx
const res = await fetch('http://127.0.0.1:xxxx/getUserInfo')
```

然后重新构建、上传、删除原有pod，访问服务。如果正常，点击页面上的按钮即可获取数据。

不过这种方式不具有稳定性，由于在windows上启动服务获取的端口都是随机的，在下次启动后端服务后在再前端页面上点击按钮，则不会成功发送请求，如果要成功发送请求，则需要重复上面的步骤，这比较麻烦。

因此需求换一次请求方式，上面的请求都是基于k8s外部进行操作的，请求的都是`127.0.0.1:xxx`这种接口，因此可以改为在集群内部进行访问，即是在前端的容器内发送的请求会自动去后端的容器进行请求。

先在前端的容器内请求后端容器的接口，看能不能成功

执行如下命令进去pod内部

```bash
kubectl exec -it <pod-name>  sh
```

再在内部执行curl命令

```sh
curl podIp:3000
```

其中podIp是后端容器的IP，可以通过如下命令查看

```bash
kubectl get pod <pod-name> -o wide
```

如果顺利，控制台会正常打印`你好，世界！`

目前pod之前的通信是没有问题的，主要的功夫则可以发在项目上，这里对前端前端项目进行改造。

由于前端使用了`nginx`服务器，这样的话就可以使用`nginx`的反向代理来进行服务的访问。书写`nginx.conf`文件

主要是反向代理这部分，将`/api/xxx`的路径映射为`http://node-backend:8448/xxx`，其中`http://node-backend:8448`中的`node-backend`是k8s中的后端服务service名字，`8448`是该服务的端口，这样修改即可将请求转发到k8s中的后端服务上

```config

user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    access_log /var/log/nginx/access.log combined;

    server {
        listen 80;  # 监听的端口号

        server_name 127.0.0.1;  # 域名或 IP 地址

        # 静态文件服务，可根据需要配置
        location / {
            root /usr/share/nginx/html;  # 静态文件目录
            index index.html;
        }

        # 反向代理配置
        location /api/ {
            rewrite ^/api(/.*) $1 break;
            proxy_pass http://node-backend:8448;  # 后端服务地址
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # 其他配置项...
    }
}

```

修改前端请求方式

```tsx
const res = await fetch('/api/getUserInfo')
```

修改dockerfile文件，添加`nginx.conf`文件，在拉取nginx镜像后进行配置文件的修改

```dockerfile
COPY nginx.conf /etc/nginx/nginx.conf
```

然后进行前端服务的构建、上传、重建pod等操作，如果顺利，在页面上点击按钮即可显示用户名称。

相比于直接修改api的方式，这种反向代理的方式比较稳定，优雅。

## 使用 Ingress

通过`Ingress`来进行服务的访问，不直接访问前端服务的地址

编写如下文件，主要是使用前后端Service

1、前端服务 (node-frontend-app):

- URL: http://node.backend/
- 服务: node-frontend-app
- 端口: 8884

2、后端服务 (node-backend):

- URL: http://node.backend/backend
- 服务: node-backend
- 端口: 8448

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: node-backend-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
    - host: node.backend
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: node-frontend-app
                port:
                  number: 8884
          - path: /backend
            pathType: Prefix
            backend:
              service:
                name: node-backend
                port:
                  number: 8448
```

执行文件

```bash
kubectl apply -f ingress.yaml
```

查看ingress

```bash
kubectl get ingress
```

接着修改本机host文件，增加一行映射

```
<ingressIp> node.backend
```

在浏览器输入`http://node.backend/`即可访问，但是windows上会提示访问失败，主要是`minikube`在非`Linux`上不能通过ip+端口进行访问。可这样改，看[这里](https://stackoverflow.com/questions/66275458/could-not-access-kubernetes-ingress-in-browser-on-windows-home-with-minikube)

在windows上进行下修改以达到访问的目的：

1、启动tunnel

```bash
minikube tunnel
```

2、通过ssh进行访问

```bash
minikube ssh
```

```bash
# 正常下能够显示前端信息
curl http://node.backend/
```

3、修改host文件，将之前的映射修改如下

```
127.0.0.1 node.backend
```

完成上面三步后即可在浏览器输入`http://node.backend/`进行服务的访问
