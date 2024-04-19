---
title: T3-Stack组合拳
categories: front-end
tags: t3-stack
abbrlink: 37761
date: 2023-10-07 16:53:39
---

## 背景
在今年上半年 React 推出了 RSC，当时推特上一片谩骂（讽刺其梦回 PHP 时代），但同时，也间接的反映出 React 技术的发展自从 hooks 时代后一直没有什么声响

> 虽然 React 一直在发展，但直到现在，twitter 上每天喷 React 的 useEffect 调用两次的 post 依然数不胜数 :P

也是在那期间，横空出世的一套组合拳 `T3 Stack` 开始被广大 web dev 得知

## 它是什么
_“T3 Stack”_ 是由 [Theo↗](https://twitter.com/t3dotgg) 创建的一个 web 开发技术栈，专注于简单性、模块化和全栈类型安全

项目结构：
```shell
.
├── README.md
├── next-env.d.ts
├── next.config.mjs
├── package.json
├── pnpm-lock.yaml
├── postcss.config.cjs
├── prettier.config.mjs
├── prisma
│   └── schema.prisma
├── public
│   └── favicon.ico
├── src
│   ├── env.mjs
│   ├── pages
│   │   ├── _app.tsx
│   │   ├── api
│   │   │   ├── auth
│   │   │   │   └── [...nextauth].ts
│   │   │   └── trpc
│   │   │       └── [trpc].ts
│   │   └── index.tsx
│   ├── server
│   │   ├── api
│   │   │   ├── root.ts
│   │   │   ├── routers
│   │   │   │   └── example.ts
│   │   │   └── trpc.ts
│   │   ├── auth.ts
│   │   └── db.ts
│   ├── styles
│   │   └── globals.css
│   └── utils
│       └── api.ts
├── tailwind.config.ts
└── tsconfig.json
```

技术栈包括：
- 核心部分是 [**Next.js**↗](https://nextjs.org/) 和 [**TypeScript**↗](https://typescriptlang.org/)
-  [**Tailwind CSS**↗](https://tailwindcss.com/) 作为 css 框架
- [**tRPC**↗](https://trpc.io/)、[**Prisma**↗](https://prisma.io/) 和 [**NextAuth.js**↗](https://next-auth.js.org/) 作为服务端技术内嵌其中

对于这种上来就给你内嵌了几个轮子的框架，值得让人去思考这些轮子的意义 (为什么需要 -> 解决了什么问题 or 带来了什么帮助）

本篇博客就是通过对这些技术栈的介绍，来分析其背后的意义

## 老生常谈的哥三儿
### TypeScript
~~类型安全有多重要，懂的自然懂，不懂的...~~

### Tailwind CSS
~~原子化 CSS，懂的自然懂，不懂的...~~

### Next. js
Next. js 本身是一门 SSR（服务端） 技术栈，反映了对 CSR（客户端渲染） 的优劣取舍

作为 React 体系的 full-stack Web applications 代表作，Next. js 支持服务器渲染、静态生成和动态路由等功能，使开发人员能够构建高性能的 Web 应用程序

常与 Next. js 摆在桌面上论道的是 Vue 体系的 Nuxt. js（且不说二者的实际开发体验，但就二者的官方文档比较来看，我单方面宣布 Next. js 胜出 dog.emoji）

## 后起之秀
### Prisma —— 优化数据库的对接问题
> [!NOTE]
> 对象关系映射（ORM）最早由 Java 中的 Hibernate 框架引入
> 
> 对象关系映射的最初目标是解决 Java 类和关系型数据库表之间的所谓阻抗不匹配问题。从这个想法发展出了更广泛的雄心勃勃的概念，即为应用程序提供一个通用的持久化层
> 
> Prisma 是 Java ORM 层的现代 JavaScript 演进

如果有过服务端开发经验自然对 ORM (Object-relational mapping) 并不陌生，而 Prisma 正是一个 TypeScript 写的 ORM 工具

它相比传统 ORM 工具最大的优势在于：自动生成的模型和查询构建器（这意味着你不必手动编写查询语句或模型类，而是可以使用自动生成的 API 进行数据库操作）

![image.png](https://cdn.jsdelivr.net/gh/jiechen257/gallery@main/img/202310071653399.png)

此外，支持多个数据库、现代异步 API、自动迁移和模式演化等等也是它众多的优点之一

### tRPC —— 保证前后端调用时的类型安全
> RPC（Remote Procedure Call）是一种通信协议和编程模型，用于实现分布式系统中不同计算机或进程之间的远程调用。它允许一个计算机程序调用另一个地址空间（通常是在远程机器上运行的）的过程或函数，就像调用本地过程一样，而不需要开发者显式处理网络通信和数据传输的细节

正如同 tRPC 官网所说：`The client below is **not** importing any code from the server, only its type declarations.`
![image](https://cdn.jsdelivr.net/gh/jiechen257/gallery@main/img/202310072044066.png)

相比于普通 RPC，tRPC 则是与 TypeScript 强绑定的一类 RPC
- 类型安全：通过 tRPC，在编译和运行时，您可以确保输入和输出与您的 TypeScript 类型匹配。避免因参数改变而导致运行时崩溃是非常重要的。
- 简易性：相比GraphQL，您不需要任何schemas或代码生成。您可以像平常一样编写函数，tRPC会顺利地处理其余部分。
- 轻量级：tRPC是一个简单轻量的库，不会给您的应用程序增加过多的负担。它还支持以最小的延迟来流式传输数据

#### 对比 REST 范式
REST 优势：
- 熟悉性：你应该很熟悉 REST 吧？它是一种简单的 HTTP 协议，已经广为人知很长时间了。它是经典的网页开发协议。
- 兼容性：REST可以与支持HTTP请求的任何语言或平台简单地配合使用。它也与现有的工具和框架（如Swagger或Postman）很好地集成。
- 简单性：REST不需要任何特殊的语法或库来使用。你只需要遵循一些命名URL和方法的约定即可

REST 劣势：
- 容易冗长：你是否曾经处理过复杂或嵌套的数据结构？你可能需要进行多次请求或在网络上发送不必要的数据。
- 不一致性：由于它没有标准的方式来定义或文档化API模式，这可能很快变得麻烦。如果你不是独立工作，你的同事可能会使用不同的样式或格式来编写他们的API，导致混乱或错误。
- 效率低下：没有方便的过滤、排序或分页功能。你可能需要为每个用例创建新的端点或参数，这可能会增加API的复杂性


### NextAuth . js —— 集成在 Next. js 中的身份验证中间件
> NextAuth. js is a complete open-source authentication solution for [Next.js](http://nextjs.org/) applications.
>
> It is designed from the ground up to support Next. js and Serverless.

NextAuth. js 简化了身份验证和授权流程的开发，提供了一种快速、安全和灵活的方式来添加用户认证功能到 Next. js 应用程序中

初始化注入：
```ts
// init.ts
import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // ...add more providers here
  ],
}

export default NextAuth(authOptions)

// provider.ts
import { SessionProvider } from "next-auth/react"

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
```

使用：
```ts
// front-end
import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}

// back-end
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"

export default async (req, res) => {
  const session = await getServerSession(req, res, authOptions)

  if (session) {
    res.send({
      content:
        "This is protected content. You can access this content because you are signed in.",
    })
  } else {
    res.send({
      error: "You must be signed in to view the protected content on this page.",
    })
  }
}
```

### Zod——消除重复的类型声明
Zod 本身也是在 T3-Stack 中的一项技术，虽然它在开头并未提及:(

>Zod 被设计成对开发者尽可能友好。其目的是消除重复的类型声明。使用 Zod，你只需声明 _一次_ 验证器，Zod 就会自动推断出静态 TypeScript 类型。它很容易将较简单的类型组成复杂的数据结构。

#### 类型验证
类型验证是验证数据结构是否符合特定类型的过程。您可以使用它来确保输入数据的有效性，以及记录和执行代码的数据结构。

使用类型验证有两个主要好处：

- 运行时的数据完整性：确保数据以正确的格式输入您的系统有助于避免错误并保持数据一致性。虽然 TypeScript 可以帮助您在编译时确保类型安全，但当您处理来自未知数据（例如服务器或用户输入）的数据时，类型验证在运行时会大放异彩。
- 文档：一个好的类型验证库将为您使用的数据结构提供准确的类型定义。类型定义可用于为您的项目生成静态文档。

#### Zod 示例
假设我们要验证用户输入的密码。我们希望密码是一个非空字符串，长度至少为 8 个字符，最多为 32 个字符：
```ts
import { z } from "zod";
const stringSchema = z.string().nonempty().min(8).max(32);
stringSchema.parse("");
stringSchema.parse(""); // throws an exception
stringSchema.parse("I am a valid password"); // returns "I am a valid password"
```

当你运行上面的代码时，你会看到 parse 方法抛出了一个异常。异常将包含一个对象数组，其中包含 `ZodError` 错误的详细描述：
```json
    [
      {
      "code": "too_small",
      "minimum": 1,
      "type": "string",
      "inclusive": true,
      "message": "Should be at least 1 characters",
      "path": []
      },
      {
      "code": "too_small",
      "minimum": 8,
      "type": "string",
      "inclusive": true,
      "message": "Should be at least 8 characters",
      "path": []
      }
    ]
```
当您尝试解析有效字符串时，`parse` 将简单地返回其值

## 最后
总的来说，`T3 Stack` 旨在提供一个全面的开发技术栈，使开发人员能够构建现代、高性能、类型安全的 Web 应用程序，同时减少开发过程中的**摩擦和复杂性**

这个技术栈的组件和工具被精心选择，以满足各种 Web 开发需求

## 参考
-  [Create T3 App](https://create.t3.gg/)
- [tRPC - Move Fast and Break Nothing. End-to-end typesafe APIs made easy. | tRPC](https://trpc.io/)
- [tRPC与REST和GraphQL 服务对比](https://juejin.cn/post/7262317630307221560)
