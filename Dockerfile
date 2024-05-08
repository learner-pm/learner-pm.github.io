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

# 清空 ./vitepress/dist 目录下的内容
RUN rm -rf /app/docs/vitepress/dist/*

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