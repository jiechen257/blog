---
title: 为何不推荐 Sass 作为 css 预处理
categories: [tech, front-end]
tags: [front-end, engineering]
abbrlink: 50630
date: 2023-07-04 20:47:50
---

## 背景
我 `npm install` 又双叒叕遇到 `sass` 报错了！！！

痛心疾首，下定决心写一个 `sass` 避坑指南 :)

> [Sass](https://sass-lang.com/guide) 是成熟、稳定、强大的专业级 CSS 扩展语言。它兼容 CSS、功能丰富、社区庞大，为业界认可，被广泛应用

本文将根据使用 Sass 存在的痛点，以及更好的替代品，来陈述个人观点：**不推荐使用 scss 作为 css 预处理器**，更倾向于使用 [Less](http://lesscss.org/) 或 [Stylus](https://stylus.bootcss.com/)
## Sass Vs Scss

Sass 有两种语法：
- 第一个被称为 SCSS（Sassy CSS），在本参考文献中一直使用，它是 CSS 语法的扩展。这意味着每个有效的 CSS 样式表，都是具有相同含义的有效 SCSS 文件，两者完全兼容。下文描述的 Sass 功能增强了此语法。使用此语法的文件扩展名为 **.scss**。
- 第二种或**更旧的语法**称为缩进语法（有时也称为“ Sass”），提供了一种更为简洁的 CSS 编写方式。它使用缩进而不是方括号来表示选择器的嵌套，并使用换行符而不是分号来分隔属性。使用此语法的**文件**扩展名为 **.sass**

以上出自 [Sass 官网对两者的解释](https://sass-lang.com/documentation/syntax)。因为 scss 完全兼容 css，目前一般常用的是 scss；但 scss 也是 Sass 语法一部分，因此就以此为标题；言下之意，无论是 `.scss` 还是 `.sass` 皆不推荐使用。
## 不推荐使用的理由
Sass 是采用 Ruby 语言编写的一款 CSS 预处理语言，如果安装并`单独使用` sass，这并无什么问题；

```bash
# 安装 sass
npm install -g sass

# 使用 sass
sass source/stylesheets/index.scss build/stylesheets/index.css
```

但在工程化项目中，就另当别论了；，需要借助 [node-sass](https://github.com/sass/node-sass)。它虽然能够以惊人的速度，通过连接中间件自动将 `.scss` 文件本地编译为 `css`，但同时存在很多问题，导致在有的时候引发巨大痛点，这便是“不推荐使用 Sass 作为 css 预处理器”主要理由。

> Node-sass is a library that provides binding for Node.js to [LibSass](https://github.com/sass/libsass), the C version of the popular stylesheet preprocessor, Sass.

### node-sass 存在的痛点

- **node 版本与 node-sass 版本不兼容**

node-sass 与 Node.js 版本相关联；这就导致，一旦本地 Node.js 升级，就会出现 node-sass 无法工作的情况，如下报错：

> Module build failed: ModuleBuildError: Module build failed: Error: Node Sass does not yet support your current environment:  
> This usually happens because your environment has changed since running npm install. Run npm rebuild node-sass to build the binding for your current environment.

> Module build failed (from ./node_modules/sass-loader/index.js):Error: Missing binding /.../xxx/node_modules/node-sass/vendor/darwin-x64-64/binding.node  
> Node Sass could not find a binding for your current environment: OS X 64-bit with Node.js 10.x

通常遇见类似问题，你就需要通过 rebuild 或重新安装 node-sass 来解决，徒增烦恼；当然，也可以借助 `nvm` 来切换至 node-sass 对应 Node.js 版本；
```bash
npm rebuild node-sass

# Or
npm uninstall node-sass
npm install node-sass

# Or
nvm use [node-sass 对用的 Node 版本]
```

- **需要 node-gyp 作为先决条件**

`node-sass` 需要 node-gyp 作为先决条件，而 `node-gyp` 又需要您安装了兼容版本的 Python，啧啧，这真是，不出问题还好；出现就得好一番折腾（而且其报错并不是很友好，就需要定位排查、查阅各种资料来修复）。

> `node-gyp` requires that you have installed a compatible version of Python, one of: v2.7, v3.5, v3.6, v3.7, or v3.8. If you have multiple Python versions installed ......

先前因为需要，在 Mac 上，需要将 Python2 升级至 Python3，之后就导致各种 `node-sass` 问题，好一番折腾才修复。

> gyp verb check python checking for Python executable "python" in the PATH  
> gyp verb `which` succeeded python /usr/local/bin/python  
> gyp ERR! configure error  
> gyp ERR! stack Error: Command failed: /usr/local/bin/python -c import sys; print "%s.%s.%s" % sys.version_info[:3];  
> gyp ERR! stack File "", line 1  
> gyp ERR! stack import sys; print "%s.%s.%s" % sys.version_info[:3];  
> gyp ERR! stack ^  
> gyp ERR! stack SyntaxError: invalid syntax  

> /Users/xxx/.node-gyp/12.13.0/include/node/v8.h:3039:5: note: candidate constructor not  
> viable: requires 2 arguments, but 1 was provided  
> Utf8Value(Isolate* isolate, Local[v8::Value](v8::Value) obj);>

- **binding.node 源无法访问或速度慢**

实际上 node-sass 依赖了一个二进制文件 binding.node，从 npm 源安装完本体后还会从 github（默认源） 下载 binding.node；这就导致默认情况下，下载 node-sass 依赖很迟缓。

以上，SASS 不仅需要额外安装 node-sass （很慢），而且跟本地开发环境（Node.js，Python）高度挂钩，容易出现各种诡异问题，故而不推荐使用；而且，SASS 所提供的常用功能，Less、Stylus 也同样具备；而且 Less、Stylus 易于安装，使用便捷，何乐不为？
## 推荐使用 [Less](http://lesscss.org)或 [Stylus](www.stylus.com) 或 [dart-sass](https://github.com/sass/dart-sass)

- [Less](http://lesscss.org/)：Less 是一门 CSS 预处理语言，它扩展了 CSS 语言，增加了变量、Mixin、函数等特性，使 CSS 更易维护和扩展。Less 可以运行在 Node 或浏览器端
- [Stylus](https://stylus.bootcss.com/)：Stylus 是一种创新的样式表语言，可编译为 CSS。受 SASS 的启发，Stylus 是用 node.js 构建的，并能够在本交互式教程中说明的浏览器中运行

## 转载
- [为何不推荐使用 Sass 作为 css 预处理器](https://quickapp.lovejade.cn/why-sass-is-not-recommended-as-a-css-preprocessor/)