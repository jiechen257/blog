---
title: 用简单的方式理解 Durable AgentHarness
copyright: false
categories:
  - tech
tags:
  - AI
  - Agent
  - Coding Agent
  - Harness Engineering
abbrlink: 63817
date: 2026-08-26 00:00:00
---

## 一句话

它要设计一个“不会因为程序崩溃就忘记工作的 AI 管家”。

你给 AI 一个任务后，即使电脑突然关机，重新打开后它也知道：

- 任务做到哪一步了；
- 哪些工具已经执行；
- 哪些消息还没处理；
- 是否应该重试、继续、取消或报告失败。

## 把它想成一个餐厅

### Harness：餐厅经理

你对 AI 说：

> “帮我修复这个 bug。”

请求先交给 Harness。它负责安排整个过程：

1. 接收任务；
2. 记录任务；
3. 调用大模型；
4. 执行工具；
5. 保存每一步结果；
6. 崩溃后恢复现场；
7. 把进度告诉 UI。

Harness 本身不一定亲自做事情，它更像一个可靠的调度中心。

## 图中的每个方框是什么

```text
Application / UI
        ↓
      Harness
     ↙   ↓   ↘
Extensions  Lanes  Session
             ↓       ↓
       Step primitives  Storage
          ↙      ↘
       LLM      Tools
```

对应关系是：

- **Application / UI**：用户界面，发送 prompt、停止任务、修改配置；
- **Harness**：总调度器；
- **Extensions**：扩展功能，通过 hooks 和 events 接入；
- **Lanes**：并行工作通道；
- **Step primitives**：最小执行步骤，例如请求模型、执行工具；
- **LLM provider**：大模型服务；
- **Tools**：Shell、文件编辑、搜索等工具；
- **Session**：保存完整会话状态；
- **memory / JSONL / SQLite**：保存数据的不同存储方式；
- **Observability**：日志、trace、监控和成本统计。

## 为什么要有这么多 Record

Record 可以理解成“工作收据”。

在执行工具前，先写一张收据：

```text
准备执行：运行测试
工具：npm test
结果 id：result-123
```

工具执行完成后，再写结果：

```text
result-123：测试通过
```

如果中途崩溃，系统看到“有收据但没有结果”，就知道：

> 这件事已经答应要做，但还没有确认做完。

于是可以选择：

- 安全地重试；
- 写一个“执行被中断”的结果；
- 等待恢复；
- 把整个任务标记为失败。

这就是文档里的核心规则：

> 做副作用之前记录意图，做完之后记录结果。

## 崩溃时会发生什么

例如 AI 正在执行工具：

```text
AI 生成工具调用
写入 tool_started
开始执行工具
程序崩溃
```

重新启动后：

- 如果工具声明“可以安全重试”，就重新执行；
- 如果工具可能产生重复副作用，就不重试，写入 `interrupted`；
- 如果结果已经保存，就跳过，不重复执行。

因此系统不会简单地“从头再来”，而是根据最后留下的记录继续。

## 为什么要有队列

AI 工作过程中，用户可能突然补充消息：

> “等等，重点检查测试，不要改生产代码。”

这叫 `steer`，相当于给正在工作的 AI 改方向。

还有两种消息：

- `followUp`：当前任务完成后继续做；
- `nextRun`：留给下一次任务。

这些消息也必须先持久化，否则程序崩溃后用户的补充指令就会丢失。

## 为什么中途不能直接插入消息

假设模型正在处理：

```text
用户消息 U → AI 回复 A
```

此时用户又发来消息 M。

如果直接插入：

```text
用户消息 U → 用户消息 M → AI 回复 A
```

就会造成一个问题：

> A 实际生成时还没看到 M，但历史看起来像是 A 看到了 M。

而且模型的 KV cache 也可能失效，增加成本。

所以新消息要先放到 deferred write，等当前步骤完成后，在 checkpoint 统一追加。

## Compaction 是什么

模型上下文不能无限增长。

当历史太长时，系统会把旧对话压缩成摘要：

```text
很长的历史对话
        ↓
“用户想修复登录问题，已经完成数据库检查，当前正在补测试”
```

这样可以继续工作，又不需要把全部历史重新塞给模型。

但文档强调：

- Compaction 本身也必须可恢复；
- 压缩前后的状态要能从记录中判断；
- 如果因为上下文溢出失败，最多自动恢复一次，避免无限循环。

## Deferred request 是什么

有些模型请求不会马上返回结果，而是先返回一个 handle：

```text
请求已提交，handle = abc-123
```

这时 Lane 会进入 `Suspended`。

之后恢复时：

- 结果还没好：继续挂起；
- 结果好了：接着运行；
- 请求过期或失败：记录错误并结束。

它不会因为进程重启，就重新发起一次可能收费的请求。

## Hooks、Events、Telemetry 的区别

这三个概念容易混在一起：

### Hooks：可以改变行为

例如：

- 调用工具前修改参数；
- 阻止危险工具执行；
- 在压缩前提供自定义摘要；
- 在运行结束前做检查。

Hooks 像“审批员”。

### Events：只观察，不改变行为

例如：

- operation started；
- tool started；
- tool finished；
- operation completed。

Events 像“摄像头记录”。

### Telemetry：做监控和统计

例如：

- 一个请求耗时多久；
- 花了多少 token；
- 哪个工具最慢；
- 重试了几次；
- 哪条链路失败了。

Telemetry 像“运营仪表盘”。

## 这份文档真正要解决的问题

它不是在设计“如何让 AI 变聪明”，而是在设计：

> 如何让一个 AI Agent 像可靠的数据库任务一样运行。

核心要求是：

1. 任务不会因为崩溃而丢失；
2. 工具不会无意中重复执行；
3. 多个子任务可以并行；
4. 对话内容和内部执行记录分离；
5. 所有状态都可以从持久化记录中恢复；
6. 测试可以精确模拟每一个崩溃点；
7. memory、JSONL、SQLite 三种存储表现一致。

## Manual 模式

### 每一步都暂停

```text
纯文本

准备写入
暂停
准备请求模型
暂停
准备执行工具
暂停
```

测试可以逐步释放动作。

这样可以测试各种极端情况：

- 每一步之后都崩溃；
- 工具执行一半时 abort；
- 写入成功但结果还没写入；
- queue 和 finish 同时发生；
- 恢复两次是否会重复执行。

## 最后用一句更直白的话总结

普通 Agent 像这样：

> 收到任务 → 做事情 → 希望别崩溃。

`AgentHarness` 想做到的是：

> 收到任务先记账；每一步都留收据；做完再记结果；中途崩溃后根据收据继续工作。

这也是为什么原文同时讨论了 Lane、Record、Recovery、Storage、Hooks、Telemetry、Compaction 和 Testing——它们共同组成了一个“可恢复的 AI 工作操作系统”。

## 原文引用

[pi GitHub：Durable AgentHarness design](https://github.com/earendil-works/pi/blob/harness-v2/j4/packages/agent/docs/harness-v2.md)

