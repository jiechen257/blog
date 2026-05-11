---
title: Harness Engineering：驾驭 Coding Agent 的工程实践
copyright: false
categories:
  - tech
tags:
  - AI
  - Coding Agent
  - Harness Engineering
  - Workflow
  - Context Engineering
abbrlink: 55459
date: 2026-05-07 00:00:00
---

2025 年下半年开始，Coding Agent 的能力边界快速扩张
- Claude Code、Codex、Cursor、Windsurf 等工具让长时运行、多文件修改、子代理派发和 MCP 调用成为常见能力。
- 社区的讨论随之出现一种层级错位：有人在讨论 Agent 内部怎么构成，有人在讨论开发流程怎么设计，有人在比较哪个第三方套件更强——三组人各有道理，但很难对齐。

2026 年初，OpenAI 在一篇关于 Codex 的文章里首次使用 `Harness Engineering` 这个组合词，把 `harness` 从 Agent 构件的语境推进到使用者侧的工程实践。随后几周内，Anthropic 发表了长时运行 Agent 的 harness 设计指南，LangChain 做了 Agent Harness 的构件解剖；Linux\.DO 上一个持续数月的长帖则把这些概念带进了真实项目的实操验证。

这篇文章综合了上述材料和社区实践，围绕五个问题展开：Harness Engineering 是什么，它怎样运行，它解决什么问题，怎样优化它的成本，以及如何落地。

## 概念与边界

`harness` 这个词被用得很泛，接近"模型之外的一切"。拆开看，它指向两层不同的问题。

LangChain 给出的公式最简洁：

> Agent = Model + Harness

模型提供语言与推理，harness 提供状态、工具、执行路径、沙箱、上下文管理和反馈机制。

LangChain 的文章把这些构件分为六类：文件系统、bash 执行、沙箱与验证工具、记忆与搜索、上下文腐败对抗、长程自主执行所需的规划和自验证循环<sup id="fnref-1"><a href="#fn-1">[1]</a></sup>。

OpenAI 的文章把这个词推到使用者侧之后，`Harness Engineering` 成了一个独立的工程范式，关注 Coding Agent 怎样被组织进一个可以稳定产出可验收变更的开发流程。

| 维度 | Agent Harnesses | Harness Engineering |
| --- | --- | --- |
| 关注对象 | Agent 的构件 | 使用 Agent 的工程系统 |
| 核心问题 | 它由什么组成 | 它如何被驾驭成开发流程 |
| 典型材料 | system prompts、tools、MCP、memory、sandbox、subagents | `AGENTS.md`、spec、runbook、tracker、门禁、审查 |
| 成熟标志 | Agent 具备工具和约束 | 开发过程具备控制面、验证闭环和验收标准 |

<figure style="margin: 24px 0; width: 100%;">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1120 720" role="img" aria-labelledby="harness-engineering-control-system-harness-layers-diagram-title harness-engineering-control-system-harness-layers-diagram-desc" width="100%" height="auto" preserveAspectRatio="xMidYMid meet" style="display: block; width: 100%; max-width: 100%; height: auto;">
  <title id="harness-engineering-control-system-harness-layers-diagram-title">Harness Engineering 分层模型</title>
  <desc id="harness-engineering-control-system-harness-layers-diagram-desc">展示 Agent Harnesses 的构件层、Harness Engineering 的工程控制层，以及从工具层到交付层的成熟度推进。</desc>
  <defs>
    <marker id="harness-engineering-control-system-harness-layers-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
      <polygon points="0 0, 7 3.5, 0 7" fill="#5a5a5a"/>
    </marker>
  </defs>
  <style>
    text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, "PingFang SC", "Microsoft YaHei", sans-serif; }
    .title { font-size: 28px; font-weight: 700; fill: #1a1a1a; }
    .subtitle { font-size: 14px; fill: #6a6a6a; }
    .section { fill: #fffdf8; stroke: #d9d3ca; stroke-width: 1.4; }
    .band-left { fill: #f4e4c1; stroke: #8f7350; stroke-width: 1.2; }
    .band-right { fill: #d8ece6; stroke: #4b7f72; stroke-width: 1.2; }
    .node { fill: #ffffff; stroke: #4a4a4a; stroke-width: 1.5; }
    .node-blue { fill: #dbeafe; stroke: #355c8a; stroke-width: 1.5; }
    .node-green { fill: #dcfce7; stroke: #3d7a4d; stroke-width: 1.5; }
    .node-amber { fill: #fef3c7; stroke: #8f7350; stroke-width: 1.5; }
    .node-pink { fill: #fce7f3; stroke: #8a4768; stroke-width: 1.5; }
    .chip { fill: #f8f6f3; stroke: #d9d3ca; stroke-width: 1; }
    .label { font-size: 13px; fill: #5a5a5a; }
    .node-title { font-size: 16px; font-weight: 700; fill: #1a1a1a; }
    .node-sub { font-size: 12px; fill: #5a5a5a; }
    .small { font-size: 11px; fill: #5a5a5a; }
    .edge { fill: none; stroke: #5a5a5a; stroke-width: 2; marker-end: url(#harness-engineering-control-system-harness-layers-arrow); }
    .soft-edge { fill: none; stroke: #8f8a82; stroke-width: 1.6; stroke-dasharray: 6 6; marker-end: url(#harness-engineering-control-system-harness-layers-arrow); }
  </style>
  <rect width="1120" height="720" fill="#f8f6f3"/>
  <rect x="28" y="24" width="1064" height="672" rx="20" fill="#fffdf8" stroke="#d9d3ca" stroke-width="1.4"/>
  <text x="60" y="68" class="title">Harness Engineering 分层模型</text>
  <text x="60" y="94" class="subtitle">构件层回答 Agent 由什么组成；控制层回答这些能力如何进入可验收的开发流程。</text>
  <rect x="60" y="132" width="480" height="256" rx="18" class="section"/>
  <rect x="80" y="116" width="154" height="30" rx="15" class="band-left"/>
  <text x="157" y="136" class="label" text-anchor="middle">构件层</text>
  <text x="92" y="178" class="node-title">Agent Harnesses</text>
  <text x="92" y="202" class="node-sub">让模型变成能执行任务的 Agent</text>
  <rect x="92" y="226" width="134" height="56" rx="12" class="node-amber"/>
  <text x="159" y="249" class="node-title" text-anchor="middle">内置能力</text>
  <text x="159" y="268" class="small" text-anchor="middle">tools / memory</text>
  <rect x="244" y="226" width="134" height="56" rx="12" class="node-amber"/>
  <text x="311" y="249" class="node-title" text-anchor="middle">外部增强</text>
  <text x="311" y="268" class="small" text-anchor="middle">skills / hooks</text>
  <rect x="396" y="226" width="112" height="56" rx="12" class="node-amber"/>
  <text x="452" y="249" class="node-title" text-anchor="middle">包裹系统</text>
  <text x="452" y="268" class="small" text-anchor="middle">team / workspace</text>
  <rect x="94" y="312" width="414" height="44" rx="12" class="chip"/>
  <text x="301" y="340" class="label" text-anchor="middle">给 Agent 状态、工具、权限、上下文和反馈机制</text>
  <rect x="580" y="132" width="480" height="256" rx="18" class="section"/>
  <rect x="600" y="116" width="172" height="30" rx="15" class="band-right"/>
  <text x="686" y="136" class="label" text-anchor="middle">工程控制层</text>
  <text x="612" y="178" class="node-title">Harness Engineering</text>
  <text x="612" y="202" class="node-sub">让 Agent 在项目规则里稳定交付</text>
  <rect x="612" y="226" width="132" height="56" rx="12" class="node-green"/>
  <text x="678" y="249" class="node-title" text-anchor="middle">规则</text>
  <text x="678" y="268" class="small" text-anchor="middle">AGENTS / docs</text>
  <rect x="762" y="226" width="132" height="56" rx="12" class="node-green"/>
  <text x="828" y="249" class="node-title" text-anchor="middle">流程</text>
  <text x="828" y="268" class="small" text-anchor="middle">spec / plan</text>
  <rect x="912" y="226" width="112" height="56" rx="12" class="node-green"/>
  <text x="968" y="249" class="node-title" text-anchor="middle">门禁</text>
  <text x="968" y="268" class="small" text-anchor="middle">test / review</text>
  <rect x="612" y="312" width="412" height="44" rx="12" class="chip"/>
  <text x="818" y="340" class="label" text-anchor="middle">给开发过程边界、状态、验证、审查和纠偏</text>
  <path d="M 540 260 H 580" class="edge"/>
  <rect x="520" y="268" width="80" height="22" rx="10" fill="#fffdf8" stroke="#d9d3ca"/>
  <text x="560" y="283" class="small" text-anchor="middle">组合进入</text>
  <rect x="60" y="430" width="1000" height="206" rx="18" class="section"/>
  <text x="92" y="470" class="node-title">成熟度推进</text>
  <text x="92" y="494" class="node-sub">从工具补丁到项目级交付系统，逐层补齐当前最大痛点。</text>
  <rect x="92" y="528" width="152" height="62" rx="14" class="node"/>
  <text x="168" y="552" class="node-title" text-anchor="middle">工具层</text>
  <text x="168" y="573" class="small" text-anchor="middle">prompt / skill</text>
  <rect x="278" y="528" width="152" height="62" rx="14" class="node-blue"/>
  <text x="354" y="552" class="node-title" text-anchor="middle">流程层</text>
  <text x="354" y="573" class="small" text-anchor="middle">spec / plan</text>
  <rect x="464" y="528" width="152" height="62" rx="14" class="node-green"/>
  <text x="540" y="552" class="node-title" text-anchor="middle">状态层</text>
  <text x="540" y="573" class="small" text-anchor="middle">tracker / handoff</text>
  <rect x="650" y="528" width="152" height="62" rx="14" class="node-amber"/>
  <text x="726" y="552" class="node-title" text-anchor="middle">控制层</text>
  <text x="726" y="573" class="small" text-anchor="middle">gates / worktree</text>
  <rect x="836" y="528" width="152" height="62" rx="14" class="node-pink"/>
  <text x="912" y="552" class="node-title" text-anchor="middle">交付层</text>
  <text x="912" y="573" class="small" text-anchor="middle">feature / debt</text>
  <path d="M 244 559 H 278" class="edge"/>
  <path d="M 430 559 H 464" class="edge"/>
  <path d="M 616 559 H 650" class="edge"/>
  <path d="M 802 559 H 836" class="edge"/>
  <path d="M 300 388 V 430" class="soft-edge"/>
  <path d="M 820 388 V 430" class="soft-edge"/>
  <text x="560" y="666" class="label" text-anchor="middle">采用顺序：先判断项目缺什么，再选择外部 harness 如何补位。</text>
</svg>
<figcaption>Harness Engineering 分层模型</figcaption>
</figure>

开发者与模型交互的粒度至少经历了三次跳跃：

| 阶段 | 交互尺度 | 主要失败来源 | 核心工程动作 |
| --- | --- | --- | --- |
| Prompt Engineering | 单次交互 | prompt 模糊、上下文缺失 | 改提示词 |
| Context Engineering | 会话级 | 上下文污染、记忆断裂 | 管理文件选择与压缩 |
| Harness Engineering | 项目级 | 控制面失真、任务漂移、验证不足 | 设计规则、门禁、反馈回路 |

这个边界直接影响诊断方向：Agent 产出不稳定时，先判断缺的是构件能力还是流程设计——缺构件补 MCP、skill、hook；缺流程补任务边界、质量门禁、runbook 和控制面纪律。

很多"为什么套件功能很多、结果仍然不稳"的困惑，根源在于把两类问题混在一起。

## 运行结构

把开发流程当作工程对象之后，核心结构是三层工作面：

- **控制面**：orchestration、tracker、prompts、交接文档、任务依赖与阻塞状态。
- **执行面**：每个任务从集成面切出的 worktree/branch，承载本次修改与定向验证。
- **集成面**：本地真实代码状态，所有任务完成后的合并目标。

<figure style="margin: 24px 0; width: 100%;">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1120 620" role="img" aria-labelledby="harness-engineering-control-system-control-loop-diagram-title harness-engineering-control-system-control-loop-diagram-desc" width="100%" height="auto" preserveAspectRatio="xMidYMid meet" style="display: block; width: 100%; max-width: 100%; height: auto;">
  <title id="harness-engineering-control-system-control-loop-diagram-title">Harness Engineering 控制回路</title>
  <desc id="harness-engineering-control-system-control-loop-diagram-desc">控制面、执行面、集成面和验证反馈构成 Coding Agent 开发闭环。</desc>
  <defs>
    <marker id="harness-engineering-control-system-control-loop-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
      <polygon points="0 0, 7 3.5, 0 7" fill="#5a5a5a"/>
    </marker>
  </defs>
  <style>
    text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, "PingFang SC", "Microsoft YaHei", sans-serif; }
    .title { font-size: 28px; font-weight: 700; fill: #1a1a1a; }
    .subtitle { font-size: 14px; fill: #6a6a6a; }
    .lane { fill: #ffffff; stroke: #d9d3ca; stroke-width: 1.4; }
    .lane-title { font-size: 17px; font-weight: 700; fill: #1a1a1a; }
    .node-title { font-size: 16px; font-weight: 700; fill: #1a1a1a; }
    .label { font-size: 13px; fill: #5a5a5a; }
    .small { font-size: 11px; fill: #5a5a5a; }
    .node-blue { fill: #dbeafe; stroke: #355c8a; stroke-width: 1.5; }
    .node-amber { fill: #fef3c7; stroke: #8f7350; stroke-width: 1.5; }
    .node-green { fill: #dcfce7; stroke: #3d7a4d; stroke-width: 1.5; }
    .node-pink { fill: #fce7f3; stroke: #8a4768; stroke-width: 1.5; }
    .edge { fill: none; stroke: #5a5a5a; stroke-width: 2; marker-end: url(#harness-engineering-control-system-control-loop-arrow); }
    .soft-edge { fill: none; stroke: #8f8a82; stroke-width: 1.6; stroke-dasharray: 6 6; marker-end: url(#harness-engineering-control-system-control-loop-arrow); }
  </style>
  <rect width="1120" height="620" fill="#f8f6f3"/>
  <rect x="28" y="24" width="1064" height="572" rx="20" fill="#fffdf8" stroke="#d9d3ca" stroke-width="1.4"/>
  <text x="60" y="68" class="title">Harness Engineering 控制回路</text>
  <text x="60" y="92" class="subtitle">控制面定义事实和规则，执行面完成切片，集成面承载可验证代码，验证反馈回到控制面。</text>
  <rect class="lane" x="48" y="120" width="1024" height="110" rx="16"/>
  <rect class="lane" x="48" y="260" width="1024" height="110" rx="16"/>
  <rect class="lane" x="48" y="400" width="1024" height="110" rx="16"/>
  <text class="lane-title" x="72" y="154">控制面</text>
  <text class="lane-title" x="72" y="294">执行面</text>
  <text class="lane-title" x="72" y="434">集成与验证</text>
  <rect class="node-blue" x="190" y="142" width="180" height="64" rx="12"/>
  <text class="node-title" x="216" y="169">读取真相</text>
  <text class="label" x="216" y="189">orchestration / tracker</text>
  <rect class="node-blue" x="430" y="142" width="180" height="64" rx="12"/>
  <text class="node-title" x="456" y="169">选择任务切片</text>
  <text class="label" x="456" y="189">unlocked / blocked</text>
  <rect class="node-blue" x="760" y="142" width="180" height="64" rx="12"/>
  <text class="node-title" x="786" y="169">更新控制面</text>
  <text class="label" x="786" y="189">handoff / next task</text>
  <rect class="node-amber" x="310" y="282" width="180" height="64" rx="12"/>
  <text class="node-title" x="336" y="309">派发实现</text>
  <text class="label" x="336" y="329">worktree / subagent</text>
  <rect class="node-amber" x="560" y="282" width="180" height="64" rx="12"/>
  <text class="node-title" x="586" y="309">修复问题</text>
  <text class="label" x="586" y="329">失败分支回流</text>
  <rect class="node-green" x="250" y="422" width="180" height="64" rx="12"/>
  <text class="node-title" x="276" y="449">合入集成面</text>
  <text class="label" x="276" y="469">latest code truth</text>
  <rect class="node-pink" x="510" y="422" width="180" height="64" rx="12"/>
  <text class="node-title" x="536" y="449">验证与审查</text>
  <text class="label" x="536" y="469">test / build / review</text>
  <path class="edge" d="M370 174 H430"/>
  <path class="edge" d="M520 206 V244 H405 V282"/>
  <path class="edge" d="M400 346 V386 H342 V422"/>
  <path class="edge" d="M430 454 H510"/>
  <path class="edge" d="M690 454 H760 V346 H732"/>
  <path class="soft-edge" d="M650 282 V234 H850 V206"/>
  <path class="edge" d="M690 422 H850 V206"/>
  <path class="edge" d="M850 142 V106 H280 V142"/>
  <text class="small" x="755" y="252">通过验证：吸收事实</text>
  <text class="small" x="700" y="374">验证失败：返回修复</text>
  <text class="label" x="500" y="560" text-anchor="middle">完成标准来自真实命令输出、diff、审查结果和人工决策点。</text>
</svg>
<figcaption>Harness Engineering 控制回路</figcaption>
</figure>

分离的核心目的是把"应当如何推进"和"代码实际是什么"拆开。

Agent 可以读控制面决定下一步做什么，但判断完成必须回到集成面看真实 diff、真实测试输出、真实构建结果——社区把这条纪律称为 Truth-first。

它反制的是一类具体失败：Agent 把 tracker 标记当成完成状态继续推进，旧 diff 被带入后续切片，错误在几轮交接后才暴露。

### 引导与检测

三层工作面定义了结构骨架，填充它的机制是引导和检测。Böckeler 在 Martin Fowler 站上用控制论框架对 harness 做了正交分解<sup id="fnref-2"><a href="#fn-2">[2]</a></sup>。

**第一个维度是方向:**
- `guides / 引导`在 Agent 行动前指明正确方向：`AGENTS.md`、architecture.md、skill 指令、LSP 集成、runbook。
- `sensors / 反馈`在 Agent 行动后检测和修正偏差：测试、lint、typecheck、code review、构建结果。

**第二个维度是执行方式:**
- `computational / 计算型`是确定性的 CPU 执行，成本低、结果可靠：lint、typecheck、ArchUnit、覆盖率检查。
- `inferential / 推理型`是 LLM/GPU 执行，成本高、非确定性，但能处理语义判断：`AGENTS.md` 指令、code review skill、AI judge。

|  | 引导（行动前） | 反馈（行动后检测） |
| --- | --- | --- |
| **计算型** | LSP、bootstrap 脚本、OpenRewrite | lint、typecheck、ArchUnit、覆盖率 |
| **推理型** | `AGENTS.md`、architecture skill、API 文档 | code review skill、AI judge、日志异常检测 |

引导和反馈相互配合：
- 只有反馈的系统让 Agent "反复犯同样的错误"——测试告诉它错了，但它不知道正确方向。
- 只有引导的系统"编码了规则却永远不知道规则是否生效"——`AGENTS.md` 写得再好，没有测试就无法闭环。
- harness 的设计工作就是沿着四个象限逐一补齐，并通过**转向循环**（steering loop）持续迭代。

### 文档作为模型间的 API

多模型协作时，不同模型的上下文容量、推理强度和响应形态各不相同。直接互读原始执行日志会造成上下文膨胀和判断污染。

解决方式是把文档当作模型间的 API：

| 文档类型 | 生产者 | 消费者 | 接口职责 |
| --- | --- | --- | --- |
| 历史大纲摘要 | 压缩模型 / 整理 Agent | 高阶决策模型 | 去噪、保留状态 |
| `AGENTS.md` | 人类 / 高阶模型 | 执行 Agent | 固化规则与边界 |
| 版本开发报告 | 执行 Agent | 人类 + 其他模型 | 固化踩坑和未完成项 |
| 进度文件 | 每轮 Agent | 下一轮 Agent | 跨上下文窗口的连续记忆 |

Anthropic 的指南把这个模式具象化：`claude-progress.txt` 跨会话维护，配合 `feature_list.json` 和 git log 构成启动信息。

每轮 Agent 的固定启动序列：`pwd` → 读进度文件 → 读功能清单 → `git log --oneline -20` → 运行 `init.sh` → 跑冒烟测试确认基线 → 开始工作。

LangChain 把 `AGENTS.md` 定义为一种**持续学习**机制——短期记忆固化为长期记忆的通道。

这是 harness 与传统 README 的实质分歧：harness 文档面向机器消费，字段稳定度和术语一致性比文笔重要。

`tracker.md` 里一个字段从 `blocked` 改成 `waiting` 可能让下游 Agent 判断逻辑失效——这是 API 层面的破坏性变更。

### 人类作为隐式 harness

Böckeler 指出：**人类本身就是一种隐式 harness**。人类开发者自带被吸收的编码规范、对复杂度的审美厌恶（"一个 300 行的函数看着就不对"）、社会问责（名字挂在 commit 上）、组织记忆，以及对"承重约定"与"习惯约定"的直觉区分。

Agent 缺少全部这些能力。harness 外显化了其中一部分。

## 解决什么问题

Anthropic 的长时运行指南列出了几种具名的失败模式：
- **one-shotting**：试图一次性完成所有工作，跑到一半上下文耗尽
- **premature victory declaration**：Agent 看到部分进展就宣布完成
- **dirty handoffs**：切片结束时留下未文档化的 bug 和半成品状态

这些失败模式都源自 harness 缺失。Anthropic 直接说明，即便是 Opus 4.5 在 Claude Agent SDK 的循环中跨多个上下文窗口运行，缺少 harness 模式的约束就"无法构建出生产级的 Web 应用"<sup id="fnref-3"><a href="#fn-3">[3]</a></sup>。

### 验证质量的天花板

Agent 自生成测试只覆盖模型自身理解到的路径，遗漏真实业务和历史 bug 走过的路径。局部实现里问题不大，重构场景里是系统性漏洞——重构要保持的恰恰是 Agent 没有理解到的行为。

Anthropic 的观察：Agent 会写单元测试、用 `curl` 打 dev server 端点，但仍然"无法识别端到端功能不工作"。引入浏览器自动化（Puppeteer MCP）做端到端验证后，"Agent 能够识别和修复仅从代码看不出来的 bug"。

Böckeler 的框架把这个问题定位到更大的缺口：**行为验证（functional correctness）是当前最难解决的维度**。代码风格有 lint，架构约束有 ArchUnit，可维护性有覆盖率——但"功能是否正确"主要依赖 AI 自生成测试和人工验收。

一种有前景但适用范围有限的模式是 **approved fixtures**——人类审批预期输出后将其固化为回归锚点。

门禁的测试集需要人工参与
- 关键路径的回归集必须来自既有系统、线上样本或人工定义的验收用例
- AI 自生成测试补边界，人工定义测试守核心行为。

## 成本与调优

长时运行 Agent 的典型故障是"跑得动但很贵"。Linux\.DO 社区的 OMO 实践数据可以作为机制信号：

- 某次约 24 小时的运行里，集成面输出约 38 个文件、670 行代码改动；同期控制面产出 17 个文件、约 4933 行记录。控制面产出在行数上是集成面的七倍多<sup id="fnref-4"><a href="#fn-4">[4]</a></sup>。
- 一次 32 小时长跑里，48 个文件产生约 3333 行代码，token 消耗超过 10 亿。追溯发现交接提示词里混入了"最小可执行单元"倾向，每个 worktree 只改 1–3 个文件、几行到几十行 diff。
- 统一术语、瘦身控制面、调整切片策略之后，9 小时完成 65 个文件、约 1539 行改动，token 约 2.2 亿。时间效率和 token 产出比都改善了一个量级。

### 贪婪切片

这组数据指向一个反直觉的结论：**任务粒度越细，单位产出的固定成本越高**。每个切片都要跑 planning、边界确认、handoff、实现、focused test、审查、merge、tracker 更新——这是一组几乎不随切片大小变化的固定开销。

直觉上"小批次、快反馈"在人类协作中成立，因为人类 review 成本近似线性于 diff 大小。Agent 的 review 成本是亚线性的——读 200 行和读 20 行在 token 消耗上量级接近。

最优切片粒度因此从"尽量小"变成"小到能通过验证，同时大到值得跑完整门禁"。社区把这个策略称为**贪婪切片**。

### Context rot 对策

与控制面熵增并行的另一个机制是 **context rot**——LangChain 的术语，指随着上下文窗口填满，模型的推理能力退化。三种对策：

- **compaction**：上下文临近容量时智能摘要和卸载
- **tool call offloading**：大块工具输出只保留首尾，全文写入文件系统按需读取
- **progressive disclosure**：用 skills 机制按需展开能力，启动时不加载全部工具定义<sup id="fnref-5"><a href="#fn-5">[5]</a></sup>

共同思路是把上下文当作稀缺资源管理。

### Harnessability

Böckeler 提出的 **harnessability** 概念：代码库被 harness 的难度差异很大。提升有效性的结构性属性：

- 强类型语言——类型检查本身就是内置 sensor
- 清晰的模块边界——支持架构约束规则
- 抽象框架如 Spring——隐式提高首次正确率

她把这些称为"环境可供性"（ambient affordances），结构性属性让环境本身对 Agent 可读、可导航、可操作。

遗留系统面临一个悖论：最需要 harness 的地方，恰恰是 harness 最难建的地方。

## 落地路径

<figure style="margin: 24px 0; width: 100%;">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1040 860" role="img" aria-labelledby="harness-engineering-control-system-harness-adoption-flow-diagram-title harness-engineering-control-system-harness-adoption-flow-diagram-desc" width="100%" height="auto" preserveAspectRatio="xMidYMid meet" style="display: block; width: 100%; max-width: 100%; height: auto;">
  <title id="harness-engineering-control-system-harness-adoption-flow-diagram-title">Harness Engineering 采用决策流程</title>
  <desc id="harness-engineering-control-system-harness-adoption-flow-diagram-desc">从痛点识别、基础条件判断、控制层选择，到执行闭环和度量反馈的流程图。</desc>
  <defs>
    <marker id="harness-engineering-control-system-harness-adoption-flow-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
      <polygon points="0 0, 7 3.5, 0 7" fill="#5a5a5a"/>
    </marker>
  </defs>
  <style>
    text { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, "PingFang SC", "Microsoft YaHei", sans-serif; }
    .title { font-size: 28px; font-weight: 700; fill: #1a1a1a; }
    .subtitle { font-size: 14px; fill: #6a6a6a; }
    .region-title { font-size: 16px; font-weight: 700; fill: #1a1a1a; }
    .node-title { font-size: 15px; font-weight: 700; fill: #1a1a1a; }
    .node-sub { font-size: 12px; fill: #5a5a5a; }
    .label { font-size: 13px; fill: #5a5a5a; }
    .small { font-size: 11px; fill: #5a5a5a; }
    .chip { fill: #f8f6f3; stroke: #d9d3ca; stroke-width: 1; }
    .chip-text { font-size: 11px; fill: #5a5a5a; }
    .edge { fill: none; stroke: #5a5a5a; stroke-width: 2; marker-end: url(#harness-engineering-control-system-harness-adoption-flow-arrow); }
    .soft-edge { fill: none; stroke: #8f8a82; stroke-width: 1.6; stroke-dasharray: 6 6; marker-end: url(#harness-engineering-control-system-harness-adoption-flow-arrow); }
    .start { fill: #dbeafe; stroke: #355c8a; stroke-width: 1.8; }
    .process { fill: #dcfce7; stroke: #3d7a4d; stroke-width: 1.8; }
    .decision { fill: #fef3c7; stroke: #8f7350; stroke-width: 1.8; }
    .output { fill: #e8e0f0; stroke: #6b5b8a; stroke-width: 1.8; }
    .repair { fill: #fce7f3; stroke: #8a4768; stroke-width: 1.8; }
    .rail { fill: #fffdf8; stroke: #d9d3ca; stroke-width: 1.4; }
    .frame { fill: #fffdf8; stroke: #d9d3ca; stroke-width: 1.4; }
  </style>
  <rect width="1040" height="860" fill="#f8f6f3"/>
  <rect x="24" y="24" width="992" height="812" rx="20" class="frame"/>
  <text x="64" y="70" class="title">Harness Engineering 采用决策流程</text>
  <text x="64" y="96" class="subtitle">先确认基础条件，再选择最小控制层，最后用真实验证和反馈数据修正流程。</text>
  <rect x="64" y="124" width="912" height="58" rx="14" class="rail"/>
  <text x="86" y="154" class="region-title">阅读顺序</text>
  <text x="190" y="154" class="label">痛点识别</text>
  <text x="300" y="154" class="label">基础条件</text>
  <text x="410" y="154" class="label">控制层选择</text>
  <text x="550" y="154" class="label">执行闭环</text>
  <text x="665" y="154" class="label">度量反馈</text>
  <text x="775" y="154" class="label">流程瘦身</text>
  <rect x="390" y="220" width="260" height="72" rx="24" class="start"/>
  <text x="520" y="251" text-anchor="middle" class="node-title">识别当前最大痛点</text>
  <text x="520" y="274" text-anchor="middle" class="node-sub">上下文、质量、长任务、token 成本</text>
  <path d="M 520 292 V 342" class="edge"/>
  <path d="M 520 342 L 660 420 L 520 498 L 380 420 Z" class="decision"/>
  <text x="520" y="414" text-anchor="middle" class="node-title">基础条件清楚？</text>
  <text x="520" y="436" text-anchor="middle" class="node-sub">需求、runbook</text>
  <text x="520" y="454" text-anchor="middle" class="node-sub">测试数据、完成标准</text>
  <path d="M 380 420 H 160 V 548" class="edge"/>
  <rect x="196" y="402" width="46" height="22" rx="7" class="chip"/>
  <text x="219" y="417" text-anchor="middle" class="chip-text">不清楚</text>
  <rect x="80" y="548" width="260" height="90" rx="14" class="repair"/>
  <text x="210" y="584" text-anchor="middle" class="node-title">先补基础材料</text>
  <text x="210" y="607" text-anchor="middle" class="node-sub">收敛需求，补 runbook</text>
  <text x="210" y="627" text-anchor="middle" class="node-sub">准备真实验收用例</text>
  <path d="M 520 498 V 548" class="edge"/>
  <rect x="536" y="510" width="34" height="22" rx="7" class="chip"/>
  <text x="553" y="525" text-anchor="middle" class="chip-text">清楚</text>
  <rect x="390" y="548" width="260" height="90" rx="14" class="process"/>
  <text x="520" y="583" text-anchor="middle" class="node-title">选择最小控制层</text>
  <text x="520" y="606" text-anchor="middle" class="node-sub">工具层、流程层、状态层、控制层</text>
  <text x="520" y="626" text-anchor="middle" class="node-sub">从当前痛点补一层</text>
  <path d="M 650 593 H 740" class="edge"/>
  <rect x="740" y="548" width="220" height="90" rx="14" class="output"/>
  <text x="850" y="583" text-anchor="middle" class="node-title">进入执行闭环</text>
  <text x="850" y="606" text-anchor="middle" class="node-sub">读事实，改代码，跑验证</text>
  <text x="850" y="626" text-anchor="middle" class="node-sub">修复失败，合入，更新状态</text>
  <path d="M 850 638 V 704 H 520 V 674" class="soft-edge"/>
  <rect x="724" y="688" width="92" height="22" rx="7" class="chip"/>
  <text x="770" y="703" text-anchor="middle" class="chip-text">反馈修正</text>
  <rect x="390" y="674" width="260" height="90" rx="14" class="process"/>
  <text x="520" y="709" text-anchor="middle" class="node-title">度量是否改善</text>
  <text x="520" y="732" text-anchor="middle" class="node-sub">交付速度、验证通过率、返工率</text>
  <text x="520" y="752" text-anchor="middle" class="node-sub">token 投入产出比</text>
  <path d="M 390 719 H 210 V 638" class="soft-edge"/>
  <rect x="250" y="702" width="94" height="22" rx="7" class="chip"/>
  <text x="297" y="717" text-anchor="middle" class="chip-text">证据不足</text>
  <rect x="696" y="220" width="264" height="194" rx="16" class="rail"/>
  <text x="724" y="254" class="region-title">执行时守住三条线</text>
  <text x="724" y="292" class="label">1. Truth-first：代码事实以集成面为准</text>
  <text x="724" y="326" class="label">2. 控制面瘦身：只保留当前事实</text>
  <text x="724" y="360" class="label">3. 贪婪切片：同模块同验证路径合并</text>
  <path d="M 650 256 H 696" class="edge"/>
</svg>
<figcaption>Harness Engineering 采用决策流程</figcaption>
</figure>

采用 harness engineering 的判断简化为三步：先看基础条件是否就绪（需求、runbook、测试数据、完成标准），再选择最小控制层补当前最大痛点，最后用真实交付数据修正系统。

个人或小团队起步不需要重型多 Agent 平台。一个可行的最小目录：

```text
AGENTS.md                   # 项目规则、禁止事项、默认验证命令、完成标准
docs/architecture.md        # 模块边界、数据流、外部依赖、高风险区域
docs/runbooks/dev-test.md   # 安装、启动、测试、联调、日志收集
docs/plans/current.md       # 当前任务目标、非目标、方案、验收标准
docs/tracker.md             # 任务状态、依赖、阻塞、完成证据
```

每轮执行结束只要求一份最小完成证明：改了什么、为什么这样改、跑了什么验证、还剩什么风险、下一步是否需要人类决策。

外部套件的选型应当倒着来——先定位自身痛点，再判断套件补的是哪一层：

| 痛点 | 对应的能力层 | 可参考的套件方向 |
| --- | --- | --- |
| 需求澄清不足 | 流程层前段 | Superpowers 的 brainstorming 和 TDD |
| 长任务无人值守 | 状态层 + 控制层 | OMO 的 orchestration |
| 命令多、难记 | 流程层 | GSD 的命令收敛 |
| 需要沉淀团队规则 | 静态设施 | Trellis 的规范积累 |
| 控制面成本过高 | 控制层 | CodeStable 的极简理念 |
| 跨产品、角色协作 | 交付层 | BMAD、gstack 的产品闭环 |

### 什么时候应当按兵不动

三种情况下应先补基础：

- 需求本身仍然混乱，验收标准没定
- 关键路径没有可用的回归测试或真实数据
- 项目规则已经过期，`AGENTS.md` 和代码事实不一致

在这种状态下加 workflow 会放大噪音，加 agent teams 会放大分歧，加自动化会放大错误传播。更稳的顺序是先把需求、runbook、测试数据和完成标准补齐。

衡量 harness 是否有效只需两个指标：返工率和验证通过率。两个指标持平或倒退，任何套件、角色、编排都只是控制面的装饰。

### 注释

1. <span id="fn-1"></span>LangChain 在 Terminal Bench 2.0 上的发现佐证了这一点：同一个 Opus 4.6 模型在不同 harness 中得分差异巨大。LangChain 的 coding agent 仅通过改进 harness（不换模型）就从排行榜第 30 名升至前 5 名。harness 的设计质量对产出的影响不亚于模型本身。 <a href="#fnref-1">↩</a>
2. <span id="fn-2"></span>这个框架的理论根基是控制论。Böckeler 引用了 Ashby 的必要多样性定律（Law of Requisite Variety）：调节器需要拥有至少与被调节系统一样多的多样性。Coding Agent 几乎可以生成任何代码——约束拓扑结构（技术栈、模块边界、命名规范）是一种品种削减动作，让 harness 的覆盖变得可行。 <a href="#fnref-2">↩</a>
3. <span id="fn-3"></span>Anthropic 为此设计了一套双 Agent 架构：Initializer Agent 在首次会话中建立项目脚手架、生成结构化功能清单（JSON 格式，因为模型"更不容易不恰当地修改 JSON 文件"），Coding Agent 在后续每次会话中读取已有状态、增量完成单个功能、测试并留下干净状态。两个 Agent 共享同一个 system prompt 和工具集——区别只是 user prompt 不同。 <a href="#fnref-3">↩</a>
4. <span id="fn-4"></span>这里的比例来自具体项目和套件，在多轮复盘里一致出现。 <a href="#fnref-4">↩</a>
5. <span id="fn-5"></span>其中 compaction 已被 Claude Agent SDK 内置，但 Anthropic 指出 compaction "并不总是能把足够清晰的指令传递给下一个 Agent"，因此仍需要外部持久化机制（进度文件、git log、结构化功能清单）作为补充。 <a href="#fnref-5">↩</a>
