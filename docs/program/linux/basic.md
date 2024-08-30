# 入门

## 服务器

可以去阿里云或腾讯云等厂商上购买一台轻量级的云服务器作为使用，系统一般选择Linux的发行版本。

## 安装Docker

以腾讯为例，在购买服务器后。使用`Xshell`工具登录到服务器上，以此执行如下命令：

```bash
yum update -y
yum install -y curl wget
yum install -y yum-utils
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
yum install -y docker-ce docker-ce-cli containerd.io
systemctl start docker
systemctl enable docker
docker --version

```
