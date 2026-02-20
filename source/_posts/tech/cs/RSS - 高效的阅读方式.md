---
title: RSS - 高效率的阅读方式
categories: [tech, computer-science]
tags: [computer-science, productivity]
abbrlink: 37499
date: 2023-11-30 00:00:00
---
## 背景
如果你经常逛一些博客网站，会发现他们的头部 tab 常常带有一个 `RSS` 的内容区域，长这样
![image.png](https://cdn.jsdelivr.net/gh/jiechen257/gallery@main/img/202312011023347.png)

如：[mdhweekly.com/weekly](https://mdhweekly.com/weekly)
![image.png](https://cdn.jsdelivr.net/gh/jiechen257/gallery@main/img/202312011006370.png)

再如： [云原生实验室](https://icloudnative.io/)
![image.png](https://cdn.jsdelivr.net/gh/jiechen257/gallery@main/img/202312011007378.png)

点进去一看，就是满满的一屏又一屏的 `xml文件`
![image.png](https://cdn.jsdelivr.net/gh/jiechen257/gallery@main/img/202312011010492.png)

这是什么东西？用来做什么？

## 介绍
先看维基百科：[RSS](https://zh.wikipedia.org/wiki/RSS)

> **RSS**（英文全称：[RDF]( https://zh.wikipedia.org/wiki/Resource_Description_Framework "Resource Description Framework") Site Summary 或 Really Simple Syndication），中文译作**简易信息聚合，也称**聚合内容**，是一种[消息来源]( https://zh.wikipedia.org/wiki/%E6%B6%88%E6%81%AF%E4%BE%86%E6%BA%90 "消息来源")格式规范，用以聚合多个网站更新的内容并自动通知网站订阅者。使用 RSS 后，网站订阅者便无需再手动查看网站是否有新的内容，同时 RSS 可将多个网站更新的内容进行整合，以摘要的形式呈现，有助于订阅者快速获取重要信息，并选择性地点阅查看

通俗来说，就是一个网站支持 RSS，就意味着每当它新发布一篇新文章，就会往一个位于特定网址的文件中，以特定的语法（具体而言是 XML 标记语言或 JSON）增加一条记录，列明这篇文章的标题、作者、发表时间和内容（可以是全文，也可以是摘要）等信息

这样，用户只要搜集所有他感兴趣的网站提供的这种文件的网址，并不时检查这些文件内容的更新，就能知道这些网站是否、何时发布了什么内容

比如，当我关注的某个人在知乎、或者在博客上回答了一个问题、写了一篇新文章，我马上就能收到推送。当我关注的人变多了，我不必一一点开知乎、简书、甚至翻看博客去主动获取更新，而是在一个统一的终端内阅读

## 如何（获取 or 制作）网站的 RSS
如何判断一个网站有无 RSS，首先在网站里寻找这个标识：

![image.png](https://cdn.jsdelivr.net/gh/jiechen257/gallery@main/img/202312011023347.png)

如果有的话，可以直接拷贝链接订阅。 没有标识呢？也可能是有 RSS 的，不过藏得比较深。

简单的方法是：直接在主域名后加 `/feed` ， `/rss` 或 `/atom.xml` 比如博客：[yxrct.com](https://sspai.com/link?target=https%3A%2F%2Fyxrct.com%2F) 在后面加 `/feed` 变为 [yxrct.com/feed](https://sspai.com/link?target=https%3A%2F%2Fyxrct.com%2Ffeed) ，如果能刷出来一个`xml`页面，那么只需添加这个链接到 RSS 阅读器中，即可订阅。 但一些网站并不用普通的后缀，这时候我们需要用到 RSS+ 浏览器插件。

RSS+ 浏览器插件：
- 先安装 [油猴插件](https://sspai.com/link?target=https%3A%2F%2Fchrome.google.com%2Fwebstore%2Fdetail%2Ftampermonkey%2Fdhdgffkkebhmkfjojejmpbldmpobfkfo) ，这里需要科学上网。
- 再安装 [RSS+ 脚本](https://sspai.com/link?target=https%3A%2F%2Fgreasyfork.org%2Fzh-CN%2Fscripts%2F373252-rss-show-site-all-rss)
- 此时，如果网站有 RSS，可在右下角小圆圈里发现。

对无 RSS 的网站，需要自己制作 RSS，这里推荐几个工具：
- [feed43](https://sspai.com/link?target=http%3A%2F%2Ffeed43.com%2F)
- [RSSHub](https://sspai.com/link?target=https%3A%2F%2Fdocs.rsshub.app%2F%23%25E5%25BE%25AE%25E5%258D%259A)
- [FeedOcean](https://sspai.com/link?target=https%3A%2F%2Ffeedocean.com%2F%3Flang%3Dzh-CN)

以上的工具，不仅可以订阅无 RSS 的博客，还能直接订阅知乎专栏、公众号、微博、贴吧、即刻等；具体方法参见文档
## 如何使用 RSS
从直观上来看这就是一连串的 `xml标签`，所以通常是借助工具来转译成可阅读文本，这种工具统称为 `RSS阅读器`

### Inoreader
[Inoreader](https://www.inoreader.com/) 
免费版基础功能完善，抓取时间大概15分钟，符合要求。有网页版、iOS、Android 版本。

添加 RSS 地址后，便能直接抓取内容转为可阅读内容
![image.png](https://cdn.jsdelivr.net/gh/jiechen257/gallery@main/img/202312011021591.png)

![image.png](https://cdn.jsdelivr.net/gh/jiechen257/gallery@main/img/202312011022561.png)

### Reabble
[Reabble](https://reabble.com/)
基于 Inoreader 的 API 开发，为 Kindle 而生。建议升级收费版（年费 ¥21，免费版 7 篇文章 / 天，且不支持推送） 我设置每天 9 点定时推送新文章至 Kindle 阅读，也方便标注 & 导出书摘。 若想在电脑上阅读，也可以直接打开 [reabble.com](https://sspai.com/post/reabble.com) ，创建桌面快捷方式，界面比 Inoreader 简洁且无广告。

详细使用略..

## 关于 RSS 的一些思考
RSS 并不适合订阅新闻类网站，刷新太快、内容繁琐反而导致阅读体验不佳

所以 RSS 更适合订阅**高质量博客**之类的网站。订阅源并不是越多越好，应该小而精。过多的订阅源会引起「信息过载」，你会发现自己每天都收到数以百计的新资讯，却无暇阅读

> 在网上获取信息时，可以中二一点把自己想象成古代听取群臣意见的帝王。对于皇帝来说，最危险和最不该做的事情就是暴露自己的喜好，这是被臣下蒙蔽乃至最后被夺权篡位的基础。英明的皇帝会保持内心的虚静无为（客观中立），坚持单独听取各方意见而不暴露自己的感想，并将各方意见与客观事实一一验证来确认各自的可信度。这也是几千年后每个人获取信息时应该坚守的原则。挑选信息来源也是最值得花时间的地方

## 参考
- [RSS - 维基百科，自由的百科全书](https://zh.wikipedia.org/wiki/RSS)
- [RSS - 高效率的阅读方式](https://sspai.com/post/56198)