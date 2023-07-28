---
title: Git 从 0 到 1
date: 2022-02-14 10:13:54
modify: 2022-06-30 17:50:59
tags: Git
categories: library
---


# 介绍
Git (/ɡɪt/) 是一个分布式版本控制软件，于 2005 年以 GPL 协议发布，最初的目的是为了更好管理 Linux 内核开发而设计

参考：[Git - Wikipedia](https://en.wikipedia.org/wiki/Git)
## 特点
1. 版本控制：Git 允许开发团队追踪和管理项目代码的版本。每次代码更改都会被记录，并且可以轻松地回滚到之前的版本
2. 分布式：Git是一种分布式版本控制系统，每个开发者都有完整的代码仓库副本，可以在没有网络连接的情况下工作，并在需要时将更改推送到共享的中央仓库
3. 分支管理：Git鼓励使用分支来组织工作流程。你可以创建、合并和删除分支，从而允许并行开发和独立的特性开发
4. 快速和高效：Git是一个快速和高效的版本控制系统。大多数操作都在本地执行，因此速度很快
5. 合作协作：多人协作开发时，Git使得代码的合并和冲突解决变得更容易
6. 开源和免费：Git是一个开源免费的版本控制系统，可以免费使用，并且有广泛的社区支持

![image-20210707193910645](https://cdn.jsdelivr.net/gh/jiechen257/gallery@main/img/202307282123654.png)

# 使用
Git 工具最常用的命令包括：
- `git init`：在项目目录中初始化一个新的Git仓库
- `git clone`：从远程仓库克隆一个副本到本地
- `git add`：将更改添加到暂存区
- `git commit`：将暂存区的更改提交到本地仓库
- `git push`：将本地仓库的更改推送到远程仓库
- `git pull`：从远程仓库拉取并合并更改到本地仓库
- `git branch`：管理分支，创建、查看和删除分支
- `git merge`：合并分支
- `git status`：查看仓库状态，显示已修改、已暂存等信息
- `git log`：查看提交历史记录

建议根据场景来学习使用，以下是几种常见场景

## 新建项目上传 GitHub
```shell
git init // 本地目录会出现 .git 文件夹，用以存储 git 环境操作

// 查看本地用户,确认 git 环境存在
git config user.name
git config user.email

// 链接 GitHub 仓库源
git remote add origin "your repository url"

// 查看本地源
git remote config -v

对文件进行增删改

// 将文件转入暂存区
git add .

// 转入版本库
git commit -m "commit msg"

// 推送版本到远程
git push --set-upstream-to origin [branch-name] // 第一次推送需要明确推送的远程分支是哪个
// 简写版本 git push -u origin master

查看 GitHub 仓库改动情况
```

## 在同一分支协作开发
```shell
// 缓存本地更改，不加 msg 则直接置入栈顶
git stash [--save [save-message]]

git pull

// 将栈顶缓存 pop 或者应用相应的 stash
git stash pop 或者 git stash apply [stash index]

解决冲突

git commit -m "merge(xxx): xxx"

git push
```

## 遇到问题需要回退分支
回到某个版本
```shell
// 定位回退版本，查看 commit-hash
git log --oneline

// 回退选项有 soft、mixed、hard 几种，推荐 soft 保留更改
git reset [commit-hash] --soft
```

撤销某次提交则使用 `git revert [commit-hash]`

# 扩展
## msg 规范

```shell
// 提交信息的格式通常采用如下形式：

<type>(<scope>): <subject>

<body>

<footer>

- `<type>`：表示提交的类型，比如"feat"（新功能）、"fix"（修复bug）、"docs"（文档更新）等。
- `<scope>`：表示本次提交的影响范围，可以是模块名、文件名等。
- `<subject>`：简要描述本次提交的主题。
- `<body>`：详细描述本次提交的正文内容（可选）。
- `<footer>`：脚注信息，包含一些附加信息（可选）
```

-   feat：新功能 feature
-   bug：测试反馈 bug 列表中的 bug 号
-   fix： 修复 bug
-   ui：更新UI；
-   docs： 文档注释变更
-   style： 代码格式(不影响代码运行的变动)；
-   refactor： 重构、优化(既不增加新功能，也不是修复bug)；
-   perf： 性能优化;
-   release：发布；
-   deploy：部署；
-   test： 增加测试
-   chore： 构建过程或辅助工具的变动
-   revert： 回退
-   build： 打包

## 其他操作
```shell
// 设置全局 git 用户
git config --global user.name "username"
git config --global user.email "email"

// 验证连接，常用于判断 ssh 连接是否被墙
git -T git@github.com

// git使用远程分支
git checkout -b <branch-name> origin/<branch-name>

// 用来丢弃工作区修改，回退到上一次commit
git checkout -- <file>
git checkout .  // 注意有“.” 舍弃工作区当前全部改动

// 将文件从缓存区取出，不设置file则默认全部取出
git reset HEAD <file>

// 不删除工作区的改动，撤销commit，将内容存放在暂存区（add 之后）
git reset --soft HEAD^

// 删除 untracked 的文件和目录
git clean -fd

// 删除已经在暂存区的文件
git rm <file>
```

![img](https://www.runoob.com/wp-content/uploads/2015/02/011500266295799.jpg)


## 多邮箱管理
参考：[如何给某一类项目统一设置用户名和邮箱](https://juejin.cn/post/7135362569895673893)

修改 git 的全局配置文件，一般是用户主目录下的 `.gitconfig` 文件

打开文件添加如下配置
```ini
[includeIf "gitdir:/Users/lee/ent/code/"]
  path = .entconfig
```

这段配置表示的是所有存放在 `/Users/lee/ent/code/` 的仓库将会使用 `.entconfig` 这个文件里的配置

那么就新建 `.entconfig` 文件来配置用户名邮箱，甚至其它的一些 git 配置都是可以的，示例如下
```ini
[user]
  name = entname
  email = name@ent.cn
```

这样就完成了相应的配置，只需要将代码仓库放在指定目录下就可以了

## 图形化工具
插件：
- vscode —— GitLens 插件
- Jetbrains 系产品 —— GitBox

软件：
- SourceTree ![](https://cdn.jsdelivr.net/gh/jiechen257/gallery@main/img/202307282128620.png)

# 进阶

## git rebase 和 git merge
### 优缺点
-   git merge
    -   优点：不会破坏原分支的提交记录。
    -   缺点：会产生额外的提交记录，并进行两条分支线的合并。
-   git rebase
    -   优点：无需新增提交记录到目标分支，reabse后可以直接将对象分支的提交历史加到目标分支上，形成线性提交历史记录，更加直观。
    -   缺点：不能在一个共享分支上进行reabse操作，会带来分支安全问题

git merge
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/43fa962402d6494c936d53f0e545ccd4~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)


git rebase（git rebase --continue）
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/aa84b664cc1c4b63971c479fad8c1355~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)

### 正确使用
-   合代码到公共分支的时候使用**git merge**，书写正确规范的**merge commits**留下记录。
-   合代码到个人分支的时候使用**git rebase**，可以不污染分支的历史提交记录，形成简介的线性记录

### rebase后的push问题
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b33ccb8ab10d468f847f7caad2a5900b~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.awebp?)

> push命令假设你的本地分支和远端分支的唯一区别是你本地有几个新的commit，而远端没有

但是由于进行了rebase操作，现在本地的**feat-a分支**多了一个之前从没见过的commit，这种情况下是不能进行fast-forwad模式的合并操作的，所以当执行 `git push origin feat-a` 命令时会报错误。

要解决这个问题必须确保当前`feat-a`分支只有你自己在开发，没有其他成员的操作，如果符合这一条件，那么可以直接进行强制推送，执行命令： `git push --force origin feat-a` 

## git switch和git restore
不同于gitcheckout切换commit直接提供commithash，使用switch切换commit时需要加-d标志
`git switch -d f8c540805b7e16753c65619ca3d7514178353f39`

同时切换并新增一个本地分支时需要加-c标志
`git checkout -b new_branch`
`git switch -c new_branch`

可以将文件的状态恢复到指定的git版本(默认为当前分支)

`git restore --test.txt`

## git revert和git reset
`git revert` 是撤销某次操作，此次操作之前或之后的commit都会被保留
`git reset` 是撤销某次提交，此次之后的修改都会被退回到暂存区

-   reset是彻底回退到指定的commit版本，该commit后的所有commit都将被清除，包括提交历史记录；
-   revert仅仅是撤销指定commit的修改，并不影响后续的commit，但所撤销的commit被后续的commit修改了同一地方则会产生冲突；
-   reset执行后不会产生记录，revert执行后会产生记录；
-   reset执行后无法再次恢复，revert执行后因为不会清除记录，并且会产生新纪录，所以文件不会丢失，你可以多次执行revert恢复到某次改变之前的状态；
-   reset执行后HEAD会后移，而revert的HEAD则一直是向前的；

详情参考：[一文彻底搞清git reset和revert区别 - 掘金](https://juejin.cn/post/7021320176998023182)

### reset --hard和reset --soft
一般我们在使用 reset 命令时，`git reset --hard` 会被提及的比较多，它能让 commit 记录强制回溯到某一个节点。而 `git reset --soft` 的作用正如其名，`--soft` (柔软的) 除了回溯节点外，还会保留节点的修改内容。

## git tag
打标签的作用，就是给项目的开发节点，加上语义化的名字，也即功能版本的别名。 打上标签名的同时，写上附带信息，可以方便项目日后维护过程中的回溯和复查
另外，也可以通过标签记录，大致了解当前项目的向下兼容性、API的修改和迭代情况

### 打标签
```shell
// 命令格式
git tag -a 标签名 -m "附注信息"

// 示例
git tag -a v0.1.0 -m "完成了文章a和文章b的撰写，耗费时间2h，感觉棒棒的！"

// 为某个commit后的版本打tag
git tag -a <标签名> <commitId> -m '标签内容文字描述' 
```

### 版本基本控制规范
版本号基本的规范是Major.Minor.Patch，也就是Major 是主版本号、Minor是次版本号、而 Patch 为修订号。每个元素必须以数值来递增。
例如：1.9.1 -> 1.10.0 -> 1.11.0。只有三个号

详情查看：[语义化版本 2.0.0 | Semantic Versioning](https://semver.org/lang/zh-CN/)

## git wotktree
```shell
# 添加工作树（工作区）
git worktree add [<options>] <path> [<commit-ish>]
# 查看工作树列表
git worktree list [<options>]
# 锁定工作区（防止移动或删除）
git worktree lock [<options>] <path>
# 移动工作区
git worktree move <worktree> <new-path>
# 清空被删除的工作区信息
git worktree prune [<options>]
# 删除工作区
git worktree remove [<options>] <worktree>
# 修复工作区（例：当主工作区移动，副工作区无法连接等情况）
git worktree repair [<path>...]
# 解锁工作区（对应lock锁定工作区）
git worktree unlock <path>
```

## git flow
版本规范其实有许多种工作流形式，**有 Git flow，有集中式工作流，有功能分支工作流**；

> Git Flow是构建在Git之上的一个组织软件开发活动的模型，是在Git之上构建的一项软件开发最佳实践

![](http://cdn.becase.top/20221201165915.png)

主分支：master、develop
辅助分支：feature、release、hotfix

## .gitignore不生效
 .gitignore 只能忽略那些原来没有被track的文件，如果某些文件已经被纳入了版本管理中，则修改.gitignore是无效的。
 
 那么解决方法就是先把本地缓存删除（改变成未track状态），然后再提交
```shell
git rm -r --cached .

git add .

git commit -m 'update .gitignore'
```

## 修改已经提交的commit msg
参考：[git 修改 Commit Message - 拾月凄辰 - 博客园](https://www.cnblogs.com/FengZeng666/p/15394612.html)

```bash
git log --oneline

git rebase -i [父级commit-id]

选择r模式进行替换，然后进入对应窗口修改msg

:wq保存退出
```

# 参考
- [Git - Wikipedia](https://en.wikipedia.org/wiki/Git)
- [A successful Git branching model » nvie.com](https://nvie.com/posts/a-successful-git-branching-model/)
- [如何利用 Git 中的 tag 管理项目版本号 ](https://juejin.cn/post/6844903518751424525)
- [Git、GitHub、GitLab Flow，傻傻分不清？一图看懂各种分支管理模型](https://juejin.cn/post/7047529253428002830)