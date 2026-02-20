---
title: Markdown的前生今世
categories: [tech, engineering]
tags: [engineering, tooling]
abbrlink: 32679
date: 2023-12-17 21:47:50
---

> 如果你是一位笔记爱好者，同时又从事编程相关工作，那自然听说或使用过 Markdown
>
> 笔者在刚接触编程时，有专门分析过 Markdown 的技术实现，时间转眼过去一两年，已经是一名深度的 Markdown 使用用户，所有的文档笔记和 ssg 博客内容都是出自于 Markdown...
>
> 现在回过头来看，不禁想挖掘 Markdown 的发展历史，顺便将以前的技术分析统一成文，方便后续思考

## 主要人物

### 作者 - John Gruber

**[John Gruber](https://daringfireball.net/)** 出生于费城，获得了德雷克赛尔大学计算机科学学士学位，曾先后供职于  [Bare Bones Software](https://www.barebones.com/)  和 [Joyent](https://www.joyent.com/)。John Gruber 在 2002 年创建了个人博客  [Daring Fireball](https://daringfireball.net/)，核心内容是关于苹果公司的各类信息。

![image.png](https://cdn.jsdelivr.net/gh/jiechen257/gallery@main/img/202312191519158.png)

> 关于这位老哥的故事还可以多说几句，他自 2006 年开始全职经营博客。他同时主持一档名为  [The Talk Show](https://daringfireball.net/thetalkshow/)  的播客节目。最近几年的 WWDC 大会期间，The Talk Show 都会邀请到苹果高管进行面对面。苹果高级副总裁  [Phil Schiller](https://en.wikipedia.org/wiki/Phil_Schiller) 、[Eddy Cue](https://en.wikipedia.org/wiki/Eddy_Cue) 、 [Craig Federighi](https://en.wikipedia.org/wiki/Craig_Federighi)，苹果 AR 负责人 Mike Rockwell，销售主管 Greg Joswiak 在 WWDC 2015 - 2018 期间先后在 The Talk Show 上亮相

John Gruber 在  [Daring Fireball: Dive Into Markdown](https://daringfireball.net/2004/03/dive_into_Markdown)  中写到在还没有 Markdown 的当年，用 BBEdit 编辑和预览 HTML 并拷贝到  [Movable Type](https://movabletype.com/)  发布的不愉快经历。这种不爽的体验促使他做出改变，为了更好地进行博客写作，两年后（2004 年）他发布了一个叫 Markdown 的工具

### 布道者 - Jeff Atwood

**[Jeff Atwood](https://en.wikipedia.org/wiki/Jeff_Atwood)**  软件工程师。先后创建了著名的编程问答网站  [Stack Overflow](https://stackoverflow.com/)  和开源论坛软件  [Discourse](https://www.discourse.org/)
前者是程序员解决问题三大件之一，另外两个是 Google 和 Github；而后者是目前首选的架设论坛的开源软件

Jeff 在 Markdown 发布的同一年开始自己的博客  [Coding Horror](https://blog.codinghorror.com/)。再该博客中，他表示自己是 Markdown 忠实铁粉，记录了他如何在早期的 Stack Overflow 使用 Markdown 的语法用于书写问题和答案（Discourse 的也是集成 Markdown
![image.png](https://cdn.jsdelivr.net/gh/jiechen257/gallery@main/img/202312191530985.png)

## 发展历史

### 2004 - Markdown 起源

2004 年 3 月，John Grube 发表了第一篇关于 Markdown 文章  [Daring Fireball: Introducing Markdown](https://daringfireball.net/2004/03/introducing_Markdown)，开始公开测试 Markdown

同年 8 月正式发布 Markdown 1.0

在 2004 年 12 月更新到 1.0.1 版本，修复了一些缺陷。同时把 license 由 1.0 版本的 GPL 修改为更宽松的 BSD-style license

自此，John Gruber 再也没有更新过 Markdown ，不论是用 Perl 编写用于转换为 HTML 的工具，还是 Markdown 的语法规则

### 2007 - ## Pandoc

[Pandoc](http://pandoc.org/)  是 John MacFarlane 开发的一款万能文档转换工具。Pandoc 可以在几十种文档格式之间相互转换。Pandoc 早期就加入对 Markdown 格式的支持。这使得会有更多早期的用户尝试 Markdown 工具写作

### 2008 - Stack Overflow

2008 年，[Stack Overflow](https://stackoverflow.com/)  的联合创始人  [Jeff Atwood](https://blog.codinghorror.com/about-me/)  选定 Markdown 作为 Stack Overflow 用户编写和回答问题的语法方案。经过一年半的实践，Jeff Atwood 在  [Responsible Open Source Code Parenting](https://blog.codinghorror.com/responsible-open-source-code-parenting/) 说到:

> I’m a big fan of John Gruber’s Markdown. When it comes to humane markup languages for the web, I don’t think anyone’s quite nailed it like Mr. Gruber. His philosophy was clear from the outset. 我是 Markdown 的忠实铁粉。说到网页人性化的标记语言时，我认为没有人可以像 Gruber 先生那样优秀。在一开始他的思路就非常明确。

> With a year and a half of real world Markdown experience under our belts on Stack Overflow, we’ve been quite happy. **I’d say that Markdown is the worst form of markup except for all the other forms of markup that I’ve tried.** Stack Overflow 线上使用 Markdown 一年半之后，我们感到相当满意。我必须得说， Markdown 是最糟糕的标记形式，除了其他所有我已经试过的。

> On 15 Mar 2008, at 02:55, John Gruber wrote: I despise what you’ve done with Text::Markdown, which is to more or less make it an alias for MultiMarkdown, almost every part of which I disagree with in terms of syntax additions.

John Gruber 对 Markdown 社区的态度极其冷淡。Jeff Atwood 对此感到非常失望

Jeff Atwood 是最热心的 Markdown 布道者，用他的影响力不断地向世人阐述使用 Markdown 的好处；同时 Jeff Atwood 埋怨 John Gruber 对 Markdown 的发展毫不关心

因 Stack Overflow 的影响力，Markdown 逐渐开始在程序员的世界里流行起来。

### 2009 - Github Flavored Markdown

Github 大约在 2009 年开始使用 Markdown 1.0 的派生版本  [GitHub Flavored Markdown (GFM)](http://github.github.com/github-flavored-Markdown/)。其中最主要区别在于以下两点：

1. 段落换行的界定：Github 认为一个换行符（回车键）即为新起一个段落更符合人们的预期。Markdown 1.0 则需要一行空白行（两个回车键）。我深刻理解 Github 的努力，因为我第一次使用 Stack Overflow 时也为此感到困惑过。
2. 下划线用来分割多个单词表示一个整体时，不应该处理为斜体

![image.png](https://cdn.jsdelivr.net/gh/jiechen257/gallery@main/img/202312191526517.png)

### 2012 - who’s with me?

Jeff 在  [The Future of Markdown](https://blog.codinghorror.com/the-future-of-Markdown/)  中提议 Stack Exchange、GitHub、Meteor 和 Reddit 等其他有一定访问量的网站一起努力制定出 Markdown 标准规范和用于测试 Markdown 实现的标准测试用例。Jeff 希望这个标准规范主要内容包含：

1. 把 John Gruber 的 Markdown 文档用正式的语言规范进行标准化；
2. 提供三个可选项，且给予更稳妥的默认值：a) 默认关闭在单词内部的强调标记；b) 默认打开自动添加超链接；c) 默认打开回车键即换行；
3. 验证 Markdown 实现的一组测试用例；
4. 对 Markdown 中存在边界模糊的情况进行清理和调整；
5. 对 Markdown 不同流行版本的处理。

Jeff 便在这个时候开始组建工作小组，成员列表如下：

- John MacFarlane, [jgm@berkeley.edu](mailto:jgm@berkeley.edu)
- David Greenspan, [david@meteor.com](mailto:david@meteor.com)
- Vicent Marti, [vicent@github.com](mailto:vicent@github.com)
- Neil Williams, [neil@reddit.com](mailto:neil@reddit.com)
- Benjamin Dumke-von der Ehe, [ben@stackexchange.com](mailto:ben@stackexchange.com)
- Jeff Atwood, [jatwood@codinghorror.com](mailto:jatwood@codinghorror.com)

### 2014 - Standard Markdown & CommonMark

Jeff 所组建的工作小组经过两年的努力，在 2014 年 9 月发布名为  [Standard Markdown](http://standardMarkdown.com/)  的项目。因 John Gruber [反对这个名称](https://blog.codinghorror.com/standard-Markdown-is-now-common-Markdown/)，Jeff 将这个项目名称修改为  [CommonMark](http://commonmark.org/)。CommonMark 规范主要由 Pandoc 的作者 John MacFarlane 编写，其中包含了 624 个测试用例，C 和 JavaScript 的规范实现。

### 2016 - text/Markdown

互联网技术标准制定机构 IETF 发布  [RFC 7763 - The text/Markdown Media Type](https://tools.ietf.org/html/rfc7763)  和  [RFC 7764 - Guidance on Markdown](https://tools.ietf.org/html/rfc7764)  两份征求意见稿，收录 Markdown 格式作为互联网媒体标准格式 text/Markdown。同时为了区分不同 Markdown 版本，提供一个可选参数 variant=Identifer。RFC7764 中收录了不同 Markdown 版本 Identifier 的值，同时指出不同版本之间的区别：

1. `text/Markdown`  或  `text/Markdown; variant=Original` John Gruber 发布的最原始版本；
2. `text/Markdown; variant=MultiMarkdown` MultiMarkdown；
3. `text/Markdown; variant=GFM` GitHub Flavored Markdown；
4. `text/Markdown; variant=pandoc` Pandoc；
5. `text/Markdown; variant=Fountain` Fountain；
6. `text/Markdown; variant=CommonMark` CommonMark；
7. `text/Markdown; variant=kramdown-rfc2629` Markdown for RFCs；
8. `text/Markdown; variant=rfc7328` Pandoc2rfc；
9. `text/Markdown; variant=Extra` PHP Markdown Extra。

### 2017 - GitHub Flavored Markdown Spec

GitHub Flavored Markdown 基于 CommonMark Spec 发布了自己 spec，支持表格、任务列表和删除线，禁止 HTML 原始标签。测试用例从 624 个增加到 651 个。

### 现在

Markdown 已经是事实上的无处不在。也是诸多笔记和写作软件首选支持的格式

John Gruber 为了方便更新他的博客，发布了 Markdown。但在此后的 10 多年里，他再也没有更新 Markdown，他的博客里在这之后也几乎看不到关于 Markdown 的只言片语

而另外一个人，却十年如一日地爱着 Markdown，在他的 Stack Overflow 和 Discourse 中使用 Markdown，并长期有组织地推广 Markdown。

我们记住 Markdown 的创造者 John Gruber 的同时，也一并铭记 Jeff Atwood 为 Markdown 做出的巨大努力。

## 技术原理

就当下的 Markdown 主流版本做的分析

### typora

大家都知道在 md 界中一个叫 typora 的软件，以其实时预览的功能广各位 coder 欢迎，typora 如何使用不再过多介绍

核心技术点：Electron + node 技术栈

> Electron 是一个使用 JavaScript、HTML 和 CSS 构建桌面应用程序的框架。 嵌入 Chromium 和 Node.js 到 二进制的 Electron 允许您保持一个 JavaScript 代码代码库并创建 在 Windows 上运行的跨平台应用 macOS 和 Linux——不需要本地开发 经验。
> 参考：[简介 | Electron](https://www.electronjs.org/zh/docs/latest/)

如上所说 typora 的显示，其实本质上还是以 html 网页的形式呈现，但是因为 electron 的技术实现，使得在 app 底座上能够显示 html 的内容

### vscode 的 md 功能

本质上与 typora 一样，因为 vscode 本身也是用 `typescript + electron` 实现的桌面端 app

#### 预览

通过 vscode.window.createWebviewPanel 创建一个 webview，指定在侧边打开，之后通过该 panel 对象的 webview.html 属性来设置 html。

html 是通过编辑器的 Markdown 内容生成的， 编辑器内容通过 editor.document.getText() 拿到，然后调用第三方的 Markdown 转 html 的库来生成。

这样就完成了 Markdown 的预览。

#### 编辑+更新

预览之后需要更新，监听 vscode.workspace.onDidSaveTextDocument 和 vscode.workspace.onDidChangeTextDocument 的事件，在文档更新和保存的时候，拿到编辑器的内容，重新生成 html，然后设置到 webview。

webviewPanel 支持 webview.postMessage(message); 的方式传递消息，支持 updateHTML 等一系列 command，可以通过传递消息来触发。

> 但是怎么知道哪个文档更新哪个 webview 呢？

可以维护一个 map，在创建 webviewPanel 的时候记录到 map 中，key 为文件路径，这样更新的时候就能查找到对应的 webview 进行更新。

这样，就完成了 Markdown 内容的更新。


### 实时预览

这里把 typora 的实时预览单独拿出来介绍下，毕竟 typora 的大火除了其自身界面简介友好，还有其实时预览的功能

实时预览就是用 md 语法写完一个语法块，页面内容就能渲染出来

实现思路：

1. 监听 input 输入
2. 在 debounce 处理（防抖）之后调用 md parser 进行实时解析
3. 渲染到对应位置上

其实实现思路也很直观，并不是什么惊奇的 idea

## 参考

- [Markdown - Wikipedia](https://en.wikipedia.org/wiki/Markdown)
- [Markdown 发展史](https://lin.am/blog/2018-11-15-markdown-history/)
- [The Markdown Movement](http://aaronbeveridge.com/markdown/index.html)
- [John Gruber - Wikipedia](https://en.wikipedia.org/wiki/John_Gruber)
- [Jeff Atwood - Wikipedia](https://en.wikipedia.org/wiki/Jeff_Atwood)
- [vscode 中 markdown 预览的实现原理 ](https://www.yisu.com/zixun/609942.html)
- [markdown-it-analysis · GitHub](https://github.com/theniceangel/markdown-it-analysis/issues/1)
