---
title: esbuild 为什么快
categories: [tech, front-end]
tags: [front-end, tooling]
abbrlink: 33235
date: 2022-11-18 20:47:50
---

大多数其他打包工具都是用 JavaScript 编写的，但是对于 JIT-compiled（just-in-time compiled，也叫做 run-time compilations、运行时编译，或者也叫做 dynamic translation 动态编译）语言来说，命令行应用程序的性能是最差的。

每次运行打包器时，Javascript VM 都是第一次看到打包器的代码，没有任何优化提示

当 esbuild 忙于解析你的 JavaScript 时，node 正忙于解析你的打包器的 JavaScript 代码。当 node 完成你的打包器代码的解析时，esbuild 可能已经退出并且你的打包器甚至还没有开始打包。

也就是说其他打包器因为使用 JavaScript 编写，于是每次编译开始需要先解析打包器的代码，然后再去实际编译 JavaScript 代码，这样就会更慢。而 Go 不属于[动态编译的语言](https://en.wikipedia.org/wiki/Dynamic_programming_language)，省去了这个步骤
## 速度快的原因
esbuild 内部打包速度优化的四个原因：

1.  esbuild 是用 Go 语言写的，并且编译为 native code
2.  大量使用并行，充分利用多核 CPU
3.  esbuild 中的所有内容都是从头编写的，没有使用第三方库
4.  内存得到有效利用

下面我们分别来介绍一下：

### 1. esbuild 是用 Go 语言写的，并且编译为 native code
其他大多数打包器，因为使用 JavaScript 编写，于是每次编译开始需要先解析打包器的代码，然后再去实际编译 JavaScript 代码，这样就会更慢。而 Go 不属于[动态编译的语言](https://link.juejin.cn/?target=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FDynamic_programming_language)，省去了这个步骤。

另外，Go 语言的核心是并行性，JavaScript 不是。Go 可以在线程直接共享内存，JavaScript 需要在线程之间序列化数据。Go 和 JavaScript 都有并行的垃圾收集器，但是 Go 的堆在所有线程间共享，JavaScript 每个线程都有单独的堆。根据测试，这似乎使 JavaScript 的并行性减少了一半，可能是因为 CPU 的内核，一半正在忙着为另一半进行垃圾收集。

### 2. 大量使用并行
esbuild 内部使用算法保证充分利用多核 CPU，编译过程有三个阶段：解析（parsing）、链接（linking）和代码生成（code generation），解析和代码生成这两个阶段包括了大部分工作，并且可以完全可以并行去做的（大部分情况下，链接是一个串行的任务）。

由于上面提到的，所有线程都可以共享内存。当从不同的入口点，打包相同的 JavaScript 库时，任务可以轻松的被共享。大多数计算机都有多核，于是并行性会是一个非常大的优势。

### 3. esbuild 中的所有内容都是从头编写的
esbuild 没有使用第三方库，内容都是自己从头编写的，这样会使架构更加的可扩展，并拥有性能优势

举个例子，很多打包工具使用了 Typescript 官网的编译器作为解析器，但是 Typescript 官方的解析器并没有把性能当作一个首要的考虑点。

他们的代码内大量使用了[megamorphic object shapes](https://mrale.ph/blog/2015/01/11/whats-up-with-monomorphism.html)和不必要的[dynamic property accesses](https://github.com/microsoft/TypeScript/issues/39247)(这两者会使 JavaScript 的运行速度减慢)
而且在 Typescript 解析器的类型检查被禁用的情况下，貌似还是会执行类型检查。

esbuild 自定义了 Typescript 的解析器

### 4. 内存得到有效利用
理想情况下，编译器的复杂度时 O(n)，所以如果你在处理大量的数据，内存的访问速度可能会严重影响性能。修改数据的次数越少，编译器运行的速度就会越快。

举例来说，esbuild 只涉及三次整个 JavaScript AST

- 1.  用于词法分析、解析、作用域设置和符号声明
- 2.  绑定符号、最小化语法、把 JSX/TS 编译为 JS、把 ES-next 编译为 ES-2015
- 3.  最小化标识符、最小化空格、生成代码和 source map

可以最大程度的重复利用 AST，其他打包器将这些步骤分开进行的，不是交叉进行