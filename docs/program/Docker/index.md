# Docker

## Docker 的基本概念

### Docker 是什么

Docker 是一个开源的容器化平台，用于开发、交付和运行应用程序。它允许开发人员将应用程序及其所有依赖项打包到一个成为容器的独立运行环境中。Docker 简化了应用程序的部署和管理过程，提高了开发和运维的效率。使用 Docker 可以实现跨平台、一致性和可重复性，同时还能够更高效地利用服务器资源

### 什么是容器化，容器和虚拟机的区别

容器是一种虚拟化技术，用于将应用程序及其依赖项打包到一个独立的运行环境汇总，称为容器。与传统的虚拟机相比，容器化更加轻量级和快速。

由于容器共享主机操作系统的内核，因此启动速度更快，占用资源更少，相比于虚拟机的庞大不可移植性，容器更具有可移植性和可伸缩性，使得应用程序可以在不同的环境中以相同的方式运行

### Docker 镜像是什么， 容器如何被创建

Docker 镜像是一个模板，包含了容器运行所需要的所有文件和依赖。它包含了一个完整的文件系统，包括应用程序、库、环境变量、配置文件等。

Docker 容器是从镜像中创建的运行实例。当启动容器时，会从镜像上创建一个可写的容器层，并在上面添加任何修改和新增的文件，这个过程称为容器启动的`写时复制`（Copy-on-Write），这种机制可以使得容器之间使用基础的镜像，又可以在运行时保持独立和隔离。

## 安装 Docker

去[官网](https://www.docker.com/)安装即可

## 实例

### 构建镜像

首先在项目根目录下创建`Dockerfile`文件。表明要构建得得内容。

当前 docs 项目得文件如下，先使用 node 镜像构建项目，在使用 nginx 来提供 web 服务器

```dockerfile
# 使用 Node.js 官方提供的 Node 镜像作为基础镜像来构建项目
FROM node:14-alpine AS build

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json 文件到工作目录
COPY package*.json ./

# 安装依赖
RUN npm install

# 复制所有文件到工作目录
COPY . .

# 构建项目
RUN npm run docs:build

# 使用 Nginx 官方提供的 Nginx 镜像作为基础镜像
FROM nginx:alpine

# 将构建后的项目文件复制到 Nginx 默认的静态文件目录
COPY --from=build /app/docs/.vitepress/dist /usr/share/nginx/html

# 暴露 Nginx 的默认端口
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]
```

在当前目录下执行如下命令，-t docs-1 指定镜像名为 `docs-1`，`.` 表示 Dockerfile 得路径，当前就是根目录。执行后 docker 会按照 Dockerfile 文件构建镜像

```bash
docker build -t docs-1 .
```

### 容器

拥有镜像后就可以启动一个容器了，执行下面命令。 `-p 8080:80` 表明将容器得`80`端口映射到主机得`8080`端口上，docs-1 即是刚刚创建得镜像。执行后就可以在浏览器输入`localhost:8080`访问项目

```bash
docker run -p 8080:80 docs-1
```

## 忽略文件

`.dockerignore`文件时 docker 得忽略文件，在镜像构建可以忽略要 COPY 得文件。书写格式同`gitignore`。

```git
node_modules
.temp
cache
dist
```

## 分段构建

Docker 得分段构建指在 Dockerfile 文件中定义多个构建阶段，每个阶段可以使用不同得基础镜像，同时可以共享文件。这样可以减少最终镜像得大小，在构建过程中丢弃不需要得文件和依赖项。

比如上面的 Dockerfile 文件就包含了两个构建阶段，第一阶段使用 node 镜像来构建本项目，第二阶段使用 nginx 镜像来作为 web 服务器。最终构建的镜像就只包含 nginx 和构建后的文件，没有 node 镜像和相关工具，减少了镜像的大小和安全性。

::: tip 提示
未完待续
:::
