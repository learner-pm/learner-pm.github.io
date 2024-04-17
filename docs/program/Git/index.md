# Git

记录一些常见的 git 操作

## 提交代码

这部分是常用的内容。

添加文件到本地暂存区，如下添加全部文件

```bash
git add .
```

或者添加单独的文件

```bash
git add filexx
```

查看在暂存区的文件

```bash
git status
```

接着 commit 这次更改

```bash
git commit -m "xxxxx"
```

如果有落后，需要拉取下远端的最新分支，建议每次都这么操作下。如果有冲突则需要手动解决

pull 操作是 fetch 和 merge 的合并操作

```bash
git pull origin master
```

然后就可以推送到远程分支了，origin 代码的是一个远程 git 地址，master 代表要推送的分支，这样就把代码提交到 master 分支上去了

```bash
git push origin master
```

origin 关联了远程仓库地址，如果没有可以使用下面的命令添加，name 可以自定义

```bash
git remote add [name]  <远程仓库的地址>
```

## 常见操作

用来获取远程分支的最新提交记录。

```bash
git fetch -v
```

打印 commit 的哈希值

```bash
git log
```

git 提供的一种可以撤回 commit 的手段，而不是直接修改 git log，操作成功后新增一条 revert log，在后面添加 `HEAD`即是撤销上一次的提交

执行 git revert 后，Git 会打开一个编辑器，供你编写撤销提交的相关信息。完成信息输入后保存退出，Git 就会创建一个新的撤销提交，并将其添加到当前分支的历史记录中

如果有冲突需要手动解决

```bash
git revert <xxx hash>

git revert HEAD
```

reset 可以让当前分支指向一个固定的提交时刻

```bash
git reset --hard <commit-hash>
```

创建一个新的分支，加入 `-b` 即创建后切换到这个分支

```bash
git checkout new-branch
git checkout -b new-branch
```

切换到指定分支。

```bash
git checkout <分支名>
```

Git 2.23 版本之后可以使用 switch 来创建

```bash
git switch -c new-branch dev
```

rebase 也是一种同步目标分支提交记录的操作

```bash
git rebase <branch>
```

rebase 操作是将本地分支和目标分支进行比对，然后形成一条线性的提交记录，如果中间有冲突，则需要解决冲突，

使用`rebase --continue`后会提示输入 message，然后继续比对直到结束

```bash
git rebase --continue
```

对于`git pull`操作，rebase 操作后的 commit 没有 merge 操作。主要区别在于 git rebase 会改变提交历史并使其更线性，而 git pull 默认情况下会产生一个合并提交
