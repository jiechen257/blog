---
title: windows 系统的包管理器
categories: new-power
tags: 包管理器
date: 2023-01-17
---

> 大家都听说过 linux 的 apt、yum 等，MacOS 的 homebrew，那 windows 系统的包管理器呢？
> windows 有没有包管理器，有的话为什么没多少人用？

## 什么是包管理器

> 包管理器又称**软件包管理系统**，它是在电脑中**自动安装、配置、卸载和升级**软件包的工具组合，在各种系统软件和应用软件的安装管理中均有广泛应用。

如果你用过 [Python](https://sspai.com/link?target=https%3A%2F%2Fbaike.baidu.com%2Fitem%2FPython) ，那么对 pip 一定不陌生，Python 对所有第三方库的查找、下载、安装、卸载等都可以通过 pip 来完成的。需要哪个库，`pip install`帮你安装；不需要了，`pip uninstall`一键就能卸载。简单省事、方便快捷。不少编程语言均有各自对应的包管理器，比如 Nodejs 的 npm 等。

其实在操作系统上，包管理器应用就更广泛了，尤其是 Linux 系统和 macOS 系统已经相当成熟了。比如 Ubuntu 的 apt、CentOS 的 yum、 macOS 系统下的 Homebrew 等

Windows 平台的包管理器因为 ` 支持下载的软件包少 `、` 国内下载速度慢 `、` 社区不完善 ` 等问题仍受诟病，因此使用的人数很少，以至于有些人都没听说过 windows 系统也有包管理器

Windows 系统上常见的包管理器主要有 **Chocolatey**、**winget** 和 **Scoop**。
### 包管理器的作用
- 降低安装维护软件的成本
- 避免安装大量软件造成的路径污染
- 不必查找和安装软件的其他依赖项
- 避免捆绑和垃圾软件
- 彻底地卸载
## Chocolatey 的安装使用
### 环境要求
在安装之前，必须要保证自己电脑满足以下标准：

- Windows 7+ / Windows Server 2003+
- PowerShell v2+
- .NET Framework 4+
### 安装
右键开始菜单，选择用管理员权限打开 **Windows Powershell(管理员)(A)** 

![](https://cdn.jsdelivr.net/gh/jiechen257/gallery@main/img/202312041410936.png)

```bash
Set-ExecutionPolicy Bypass -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
```

等待安装完成，之后可以使用 `choco -v` 查看安装结果,也可以使用 `choco -?` 查看帮助文档

### 使用
**Chocolatey **的默认下载地址是在**C 盘**，如果你想更改默认下载位置，可以通过修改电脑的环境变量来实现

- `choco list/search [应用名]`
    搜索应用
- `choco info [应用名]`
    列出应用的详细信息
- `choco install [软件包名]`
    显然就是来安装软件的
    _`-y` 选项来默认确认安装_
- `choco list/search -l`
    查看本地安装的所有应用
- `choco list/search [应用名] --by-id-only`
    只返回 id 中含有关键字的应用
- `choco uninstall [应用名]`
    自动卸载应用（一个或多个）
- `choco outdated`
    **检查**一下哪些应用需要更新
- `choco update all`
    更新所有的软件
    _当然你也可以直接用 `choco upgrade [应用名]` 更新某一个软件_

除了命令行界面，还有 ChocolateyGUI 图形界面以供使用
## winget 的安装和使用
WinGet（Windows 程序包管理器：Windows Package Manager）是微软为 win10 开发的一款开源的软件包管理器，于 2020 年 5 月的 Microsoft Build 开发者大会上 [首宣](https://sspai.com/link?target=https%3A%2F%2Fzh.wikipedia.org%2Fwiki%2FWindows%25E7%25A8%258B%25E5%25BA%258F%25E5%258C%2585%25E7%25AE%25A1%25E7%2590%2586%25E5%2599%25A8) 。

前提：**Windows 10** 1709 及以上版本

当前 WinGet 支持的安装程序类型尚不多，除了 EXE、MSIX、MSI 三种之外，还能够在自定义配置后下载部分微软应用商店的程序

### 安装
你可以在 [Github Release](https://sspai.com/link?target=https%3A%2F%2Fgithub.com%2Fmicrosoft%2Fwinget-cli%2Freleases) 下载`.appxbundle`格式的文件，双击打开并运行（官方 [GitHub 主页](https://sspai.com/link?target=https%3A%2F%2Fgithub.com%2Fmicrosoft%2Fwinget-cli) 和 [Microsoft Docs](https://sspai.com/link?target=https%3A%2F%2Fdocs.microsoft.com%2Fzh-cn%2Fwindows%2Fpackage-manager%2Fwinget%2F) 里有 WinGet 更详细配置信息）

### 基本使用
- 显示简略帮助文档：`winget -?`（-?可选）；查看特定命令的详细帮助文档：`winget [<命令>] -?`，如 `winget install -?`
- 显示软件详细信息：`winget show <包名>`
- 搜索软件：`winget search <包名>`
- 安装软件：`winget install <包名>`
## Scoop
 [Scoop](https://sspai.com/link?target=https%3A%2F%2Fscoop.sh%2F) 功能更全面、可配置性更高
### 下载安装
前提：

- Windows 7 SP1+ / Windows Server 2008
- PowerShell 5+（include [PowerShell Core](https://sspai.com/link?target=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fpowershell%2Fscripting%2Finstall%2Finstalling-powershell-core-on-windows%3Fview%3Dpowershell-6) and [.NET Framework 4.5](https://sspai.com/link?target=https%3A%2F%2Fwww.microsoft.com%2Fnet%2Fdownload) ）
#### 安装
管理员身份运行 `PowerShell`，输入以下两条命令，待安装完成之后，输入 `scoop` 显示帮助文档即说明安装成功。
```
Set-ExecutionPolicy RemoteSigned -scope CurrentUser
iwr -useb get.scoop.sh | iex
```

注：Scoop 支持利用 `aria2` 进行多线程下载。所以可先 `scoop install aria2` 下载 aria2，之后所有的下载任务就均可以调用 aria2 多线程下载来提高速度了

### 使用
![](http://cdn.becase.top/20230117171708.png)

### 换源
要改善 Scoop 的下载速度，详细可以参照 [Scoop | Gitee 版](https://sspai.com/link?target=https%3A%2F%2Fgitee.com%2Fsquallliu%2Fscoop%23install-scoop-to-a-custom-directory-by-changing-scoop) 的说明更换下载源。换源之后的Scoop，速度提升不是一星半点儿。

- 更换 Scoop 源
```shell
scoop config SCOOP_REPO https://gitee.com/squallliu/scoop

scoop update
```

- 更换 bucket 源
```shell
scoop install git

# 注意：引号里面换成自己的路径，如果是默认路径则为${Env:USERPROFILE}\scoop\buckets\<bucket_name>

git -C "D:\Scoop\buckets\main" remote set-url origin https://hub.fastgit.org/ScoopInstaller/Main.git

git -C "D:\Scoop\buckets\extras" remote set-url origin https://hub.fastgit.org/lukesampson
```

## 参考
 [Chocolatey Software | Chocolatey - The package manager for Windows](https://chocolatey.org/)
 [Windows 系统缺失的包管理器：Chocolatey、WinGet 和 Scoop](https://sspai.com/post/65933)
