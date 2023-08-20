---
title: ClashX的增强模式
date: 2023-08-19 21:47:50
tags: clash
categories: config
---
## 背景
记录下被 ClashX 的【增强模式】坑惨的一天

## git 问题
一直用的好好的 git，今天却在提交代码时，报错：
```shell
ssh: connect to host github.com port 22: Connection timed out
fatal: Could not read from remote repository.
```

在连接 github 时，执行”ssh -T git@github.com” 命令时，出现：
```shell
$ ssh -T git@github.com
ssh: connect to host github.com port 22: Connection timed out
```
## git 问题定位
### 网络问题？
第一时间觉得是梯子的问题，然后去切换了好几个节点，甚至用上了公司的 VPN

还是不行
### ssh 秘钥过期？

然后又觉得是 ssh 秘钥过期了，然后去 github 上查看：

![image.png](https://cdn.jsdelivr.net/gh/jiechen257/gallery@main/img/202308202200584.png)

显示正常呀，然后自己又生成了个新的 rsa 上传，还是不对

## git 解决办法
在多次 google 后的解决办法中，成功实验了一种
在存放公钥私钥 (id_rsa 和 id_rsa. pub) 的同级文件夹中，有一个 config 文本（没有则新建一个），我原先的内容如下：

```shell
# GitHub
Host github.com
Hostname ssh.github.com
IdentityFile ~/.ssh/id_rsa_github
User 1487503910@qq.com
```

然后发现网上资料还有两行：
```shell
# GitHub
Host github.com
Hostname ssh.github.com
IdentityFile ~/.ssh/id_rsa_github
User 1487503910@qq.com
Port 443 # this
PreferredAuthentications publickey # this
```

猜测是网络层需要指定某种校验规则

再次执行”ssh -T git@github.com” 时，这时验证就可以通过。

```shell
$ ssh -T git@github.com
Hi jiechen257! You've successfully authenticated, but GitHub does not provide shell access.
```
## 又现图床问题
解决完 git 的问题，发现我的图床又不可以用了 :(

![](https://cdn.jsdelivr.net/gh/jiechen257/gallery@main/img/202308202217560.png)

我图床是用 github + jsdelivr + PicGo 实现的

## 图床问题定位
跟git 的思考逻辑一样，这是网络问题？token 过期问题？还是我 picgo 配置问题？

然后又捣鼓捣鼓好久，发现都不是，然后在 picgo 仓库的中发现一个 issues


![](https://cdn.jsdelivr.net/gh/jiechen257/gallery@main/img/202308202220991.png)

心想这不就是我的问题吗 :P

然后给作者发 issues，把错误日志发过去，然后被告知我这就是单纯的网络问题

我人肯定蒙了呀，但作者大大的话肯定是有依据的，我又排查自己的网络，看这个梯子到底有没有生效

上 youtube 不再当作依据，我直接 ping 国外网址
![](https://cdn.jsdelivr.net/gh/jiechen257/gallery@main/img/202308202246285.png)

好家伙，感情我是被 ClashX 演了呀 =_=

然后琢磨 ClashX 的配置项，发现个【增强模式】，果然一开就 ping 通了

## 又现 Mac 安装 App 问题
想必每个 mac 拥有者都遇到过:
![](https://cdn.jsdelivr.net/gh/jiechen257/gallery@main/img/202308202228810.png)

我在测试 picgo 的配置时，删了原有的版本，在重下一个新的包时，就一直报这个错

google 解决办法都是开启 【运行任何来源】
![](https://cdn.jsdelivr.net/gh/jiechen257/gallery@main/img/202308202231539.png)

但依然无效果

## mac 问题再解决

最后还是在技术网站找到了解决方案：
`sudo xattr -r -d com.apple.quarantine /Applications/PicGo.app`

通过 ChatGPT 查到，这段代码的作用是移除文件或文件夹的"com.apple.quarantine"属性，该属性通常与从互联网下载的文件相关联

具体而言，命令中的各个部分的含义如下:

- xattr: 这是macOS中的一个命令，用于操作文件或文件夹的扩展属性（extended attributes）。扩展属性是文件系统中与文件相关联的额外元数据，不同于文件内容或基本属性（如权限、创建日期等）。

- -r: 这是一个选项，表示递归地处理指定目录下的所有文件和子目录。

- -d com.apple.quarantine: 这是一个选项和参数的组合，用于删除指定文件或文件夹的名为"com.apple.quarantine"的扩展属性。这将移除与该文件相关的下载来源警告

执行完命令后，再安装就成功了

## ClashX 的增强模式
最后，回到 ClashX 本身，这个功能有什么用，不开会怎样？

这里就要明确`代理`的含义了
> SS、SSR、V2ray等软件工具属于代理(proxy)，不是VPN。这意味着在电脑上(PC端)，开启这些上网工具后，浏览器可以顺利上外网，但命令行、其他工具的流量可能并不会走代理

如果想实现其他软件也走代理，那就是全局代理，类比之下，也就是 ClashX 的【增强模式】

所以我在一开始定位网络问题时，能在浏览器上 youtube 等国外网站，但在终端中是没有代理效果的...

## 最后
真是充zhe实mo的一天！