# 使用官方 Python 运行时作为基础镜像
FROM python:3.8-slim

# 设置工作目录为 /app
WORKDIR /app

# 将当前目录下的所有文件复制到镜像的 /app 目录中
COPY . .

# 安装 Flask
RUN pip install Flask

# 设置 Flask 环境变量
ENV FLASK_APP=app:create_app

# 暴露端口 8488
EXPOSE 8488

# 运行应用
CMD ["flask", "run", "--host=0.0.0.0", "--port=8488", "--no-reload"]
