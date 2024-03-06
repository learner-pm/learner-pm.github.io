# CICD

其目的是通过`CICD`的手段来搭建一个自动发布代码的平台，简单理解就是：你只需要去编写业务代码，其他的`lint`检测、`build`构建、`deploy`发布等，你都可以不去关心，这个过程交给机器处理即可。

一般公司上通常使用`gitlab`来作为代码管理平台，其中有相关的自动部署化内容，写一些配置就可以完成一个简单的自动部署化动作。我们这里使用 GitHub 提供的[Actions](https://github.com/features/actions)来简单的实现一下。

## workflows 文件

首先我们需要在我们的根目录下面创建一个文件夹，路径为`/.github/workflows/`。该文件夹下存储构建相关的`yml`文件。在我们进行相关操作时，如提 pr 等，若提前编写了相关规则，就会触发 actions。

## yml 文件

以下是一个构建 yml 文件，这个文件就是我这个项目的部署文件中的一个。

其中`name`就是这个文件的名字。`on`编写触发 actions 的时机和作用分支，这里即是当代码被`push`到`main`分支的时候就会触发工作流。

紧接着的是`jobs`，就是一个工作，可以有多个`job`。这里就一个 job，整体就是构建代码和打包推送流程。`runs-on`选择要运行的机器。`steps`代表步骤，后面基本格式就是 `name: xxx run: xxx uses: xxx with:xxx`，name 就是这个步骤的名字，run 执行什么操作，uses 使用什么工具，with 跟在 uses 后面作为一些补充信息。比如 Deploy 步骤后的 with 就是补充文件源，token 等信息

```yml
# This is a basic workflow to help you get started with Actions

name: deploy-docs-website

# Controls when the workflow will run
on:
  # Triggers the workflow on push or pull request events but only for the "main" branch
  push:
    branches: ["main"]
  #   pull_request:
  #     branches: [ "main" ]

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# A workflow run is made up of one or more jobs that can run sequentially or in parallel
jobs:
  # This workflow contains a single job called "build"
  build:
    # The type of runner that the job will run on
    runs-on: ubuntu-latest

    # Steps represent a sequence of tasks that will be executed as part of the job
    steps:
      # Checks-out your repository under $GITHUB_WORKSPACE, so your job can access it
      - uses: actions/checkout@v2
      - name: install nodejs
        uses: actions/setup-node@v3.5.0
        with:
          node-version: "16.X"
      - name: install deps
        run: npm install
      - name: build app
        run: npm run docs:build
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          publish_dir: docs/.vuepress/dist
          github_token: ${{ secrets.ACTION_TOKEN }}
          commit_message: Deploy Success
```
