---
title: Harness Engineering：把 Coding Agent 变成可控开发系统
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

> Harness Engineering 是 AI 编程从“会话技巧”进入“开发系统设计”之后出现的工程实践
> 
> 目标直接：让 Coding Agent 在项目规则、质量门禁和反馈回路中持续产出可验收的软件变更

- 开发流程本身是工程对象
  - 人类负责定义目标、边界、规则、验证和决策点
  - Agent 负责在这些约束中探索、规划、实现、检查和修复
- 工具、插件、skills、workflow、agent teams 都是实现材料
  - 真正要设计的是一套能稳定运转的开发控制系统

## 1. 概念边界：两种 Harness 指向两层问题

`harness` 在 AI Coding 语境里同时被 Agent 开发者、插件开发者、Skills 作者和 Coding Agent 用户使用，因此被拉大到接近“模型之外的一切”

概念变大之后，讨论容易出现三种层级错位：

1. 有人在讨论 Agent 怎么构成
2. 有人在讨论开发流程怎么设计
3. 有人在讨论哪个套件更好用

把边界划清，核心差异很明确

<figure style="margin: 24px 0; width: 100%;">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1120 720" width="100%" height="auto" preserveAspectRatio="xMidYMid meet" style="display: block; width: 100%; max-width: 100%; height: auto;" role="img" aria-labelledby="harness-layers-title harness-layers-desc">
  <title id="harness-layers-title">Harness Engineering 分层模型</title>
  <desc id="harness-layers-desc">展示 Agent Harnesses 的构件层、Harness Engineering 的工程控制层，以及从工具层到交付层的成熟度推进。</desc>
  <defs>
    <marker id="harness-layers-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
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
    .node-sub { font-size: 12px; fill: #4f4f4f; }
    .small { font-size: 11px; fill: #5a5a5a; }
    .edge { fill: none; stroke: #5a5a5a; stroke-width: 2; marker-end: url(#harness-layers-arrow); }
    .soft-edge { fill: none; stroke: #8f8a82; stroke-width: 1.6; stroke-dasharray: 6 6; marker-end: url(#harness-layers-arrow); }
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
  <rect x="520" y="238" width="80" height="24" rx="10" fill="#fffdf8" stroke="#d9d3ca"/>
  <text x="560" y="255" class="small" text-anchor="middle">组合进入</text>
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

> 这张图把两个层级放在一起看：Agent Harnesses 是构件层，Harness Engineering 是工程控制层
> 
> 构件层决定 Agent 有什么能力，控制层决定这些能力如何进入可验收的开发流程

| 维度 | Agent Harnesses | Harness Engineering |
| --- | --- | --- |
| 主要关注对象 | harness 本身 | engineering 实践 |
| 核心问题 | Agent 怎样被构成 | Coding Agent 怎样被驾驭为开发流程 |
| 典型构件 | system prompts、tools、MCP、skills、hooks、subagents、memory、context compaction、sandbox、approval、model routing | AGENTS.md、项目文档、spec / plan、runbook、任务编排、质量门禁、测试验证、代码审查、上下文治理、技术债治理 |
| 层级 | Agent 内部与外部扩展 | 项目级开发系统 |
| 成熟标志 | Agent 具备工具、状态和约束 | 开发过程具备控制面、执行面、集成面、反馈回路和验收标准 |

Agent Harnesses 关注 Agent 的构件

一个常见抽象是：

> Agent = Model + Harness

- Agent 由模型和 harness 共同构成
  - 模型之外的提示词、状态、工具、执行逻辑、反馈回路和约束系统都属于 harness
  - 原始模型具备语言和推理能力
  - harness 给它状态、工具、权限、执行路径、上下文管理和反馈机制
  - 这些构件让模型成为可以做事的 Agent

Agent Harnesses 可以拆成三层：

1. **内置 harness**
   - 构成 Agent 的基础能力
   - 典型能力包括系统提示词处理、工具调用、MCP 接入、容错、上下文压缩、记忆、沙箱、审批和子代理调度
2. **嵌入式外部 harness**
   - 以插件、Skills 集或规则包形式增强 Coding Agent
   - 典型项目包括 Superpowers、everything-claude-code、oh-my-opencode、oh-my-claudecode、oh-my-codex、BMAD、gstack
3. **包裹式外部 harness**
   - 把 Coding Agent 包在更大的协作系统内，或与 Coding Agent 互嵌
   - 典型形态包括 Trellis、Routa 这类 workspace-first 多 Agent 协调系统

Harness Engineering 关注这些构件如何进入真实开发流程：

- 系统上下文如何写
- 文档如何组织
- 任务如何切分
- 进度如何跟踪
- 上下文如何换手
- 验证如何自动化
- 质量如何验收
- 技术债如何回收

> 判断一个系统是否进入 Harness Engineering 范围，看它是否形成闭环

- 单个 skill 是工具
- 多个 skill 串成流程是 workflow
- workflow 引入状态记录、失败分支、验证门禁、人工决策点和持续清理机制之后，才成为 harness 的一部分

这个区分直接影响选型

- 缺工具能力
  - 补 MCP、skill、hook 或子代理
- 缺工程稳定性
  - 补任务边界、质量门禁、runbook、控制面和验收标准
- 把两类问题分开
  - 能减少很多“为什么套件功能很多，结果仍然不稳”的困惑

## 2. 工程重心演进：从 prompt 到 context，再到 project loop

> AI 编程的工作重心经历了三次上移

| 阶段 | 交互尺度 | 人类主要职责 | AI 主要职责 | 关键产物 | 主要风险 |
| --- | --- | --- | --- | --- | --- |
| 提示词工程 | 单次交互 | 写清 prompt | 响应局部请求 | prompt、片段代码、局部解释 | 输出不稳定、上下文不足 |
| 上下文工程 | 会话级别 | 组织上下文 | 执行一段任务 | 会话上下文、文件选择、短计划 | 上下文污染、记忆断裂 |
| Harness 工程 | 项目级别 | 定规则、设门禁、控反馈 | 自主推进开发 | AGENTS.md、spec、plan、runbook、tracker、review、test gates | 控制面失真、任务粒度漂移、验证不足、token 投入产出比低 |

1. 第一阶段更接近 IDE 插件时代
   - AI 像高级代码补全和开发助手，主要处理代码行、函数和局部问题
   - 开发者对输出质量的主要影响来自 prompt 和局部上下文

2. 第二阶段开始出现项目级上下文理解
   - Cursor 等工具让 AI 可以读多个文件、回答项目问题、做小范围多文件改动
   - 这个阶段的关键能力是“让模型看到正确的东西”
   - 上下文选择、文件摘要、会话压缩、相关代码定位会明显影响输出质量

3. 第三阶段出现在 Coding Agent 能够长时间运行、多文件修改、调用工具、派发子任务之后
   - Claude Code、Windsurf、Cursor、TRAE、Codex、OpenCode、Gemini CLI 等工具逐步把 Agent 能力带到开发流程里
   - Agent 可以连续工作 5 分钟、30 分钟、几小时，甚至跨会话推进任务

交互频率降低之后，问题随之变化
开发者不再只关心“怎么让 AI 写出一段代码”，还要关心：

- 它是否理解项目规则
- 它是否在正确分支和目录里修改
- 它是否知道任务边界
- 它是否运行真实验证
- 它是否把自报成功和实际完成混在一起
- 它是否把过期上下文当成当前事实
- 它是否在长任务里不断放大早期错误

Harness Engineering 就是在这个压力下出现的

- 模型能力越强
  - 单次错误的影响范围越大
- Agent 执行越久
  - 早期偏差累积越严重
- 自动化程度越高
  - 质量门禁越需要提前定义

Harness Engineering 的工程对象是项目级开发闭环，涵盖这些工程动作：

- 多 Agent 协作
- 质量门控
- 架构评审
- 上下文腐败治理
- 控制面与集成面分离
- 系统提示词持续优化
- 项目文档维护
- 技术债治理

## 3. 控制系统：控制面、执行面、集成面和反馈回路

> 一套可运行的 Harness Engineering 系统，核心是形成“事实读取 → 任务选择 → 执行 → 验证 → 修复 → 合入 → 状态更新”的闭环
> 
> 角色名和 workflow 复杂度，只在服务这个闭环时有价值

最有解释力的结构是三层工作面：

- **控制面**：维护 orchestration、tracker、prompts、交接文档、任务状态、阻塞项、解锁条件和编排真相
- **执行面**：每个任务从集成面当前 HEAD 新建 worktree / branch，执行代码修改、测试和验证
- **集成面**：所有任务完成后的本地合并目标，承载最新可验证代码事实

<figure style="margin: 24px 0; width: 100%;">
<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="auto" viewBox="0 0 1120 620" preserveAspectRatio="xMidYMid meet" style="display: block; width: 100%; max-width: 100%; height: auto;" role="img" aria-labelledby="control-loop-title control-loop-desc">
  <title id="control-loop-title">Harness Engineering 控制回路</title>
  <desc id="control-loop-desc">控制面、执行面、集成面和验证反馈构成 Coding Agent 开发闭环。</desc>
  <defs>
    <marker id="control-loop-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="#2563eb"/>
    </marker>
    <style>
      .bg { fill: #f8fafc; }
      .lane { fill: #ffffff; stroke: #cbd5e1; stroke-width: 1.5; }
      .card { fill: #fefefe; stroke: #334155; stroke-width: 1.4; rx: 12; }
      .control { fill: #e0f2fe; }
      .execution { fill: #fef3c7; }
      .integration { fill: #dcfce7; }
      .verify { fill: #fce7f3; }
      .title { font: 700 28px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #0f172a; }
      .lane-title { font: 700 18px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #334155; }
      .text { font: 500 17px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #0f172a; }
      .small { font: 400 14px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; fill: #475569; }
      .line { fill: none; stroke: #2563eb; stroke-width: 2.4; marker-end: url(#control-loop-arrow); }
      .muted-line { fill: none; stroke: #64748b; stroke-width: 1.8; stroke-dasharray: 6 6; marker-end: url(#control-loop-arrow); }
    </style>
  </defs>
  <rect class="bg" x="0" y="0" width="1120" height="620"/>
  <text class="title" x="48" y="56">Harness Engineering 控制回路</text>
  <text class="small" x="48" y="86">控制面定义事实和规则，执行面完成切片，集成面承载可验证代码，验证反馈回到控制面。</text>
  <rect class="lane" x="48" y="120" width="1024" height="110" rx="16"/>
  <rect class="lane" x="48" y="260" width="1024" height="110" rx="16"/>
  <rect class="lane" x="48" y="400" width="1024" height="110" rx="16"/>
  <text class="lane-title" x="72" y="154">控制面</text>
  <text class="lane-title" x="72" y="294">执行面</text>
  <text class="lane-title" x="72" y="434">集成与验证</text>
  <rect class="card control" x="190" y="142" width="180" height="64" rx="12"/>
  <text class="text" x="216" y="169">读取真相</text>
  <text class="small" x="216" y="192">orchestration / tracker</text>
  <rect class="card control" x="430" y="142" width="180" height="64" rx="12"/>
  <text class="text" x="456" y="169">选择任务切片</text>
  <text class="small" x="456" y="192">unlocked / blocked</text>
  <rect class="card execution" x="310" y="282" width="180" height="64" rx="12"/>
  <text class="text" x="336" y="309">派发实现</text>
  <text class="small" x="336" y="332">worktree / subagent</text>
  <rect class="card execution" x="560" y="282" width="180" height="64" rx="12"/>
  <text class="text" x="586" y="309">修复问题</text>
  <text class="small" x="586" y="332">失败分支回流</text>
  <rect class="card integration" x="250" y="422" width="180" height="64" rx="12"/>
  <text class="text" x="276" y="449">合入集成面</text>
  <text class="small" x="276" y="472">latest code truth</text>
  <rect class="card verify" x="510" y="422" width="180" height="64" rx="12"/>
  <text class="text" x="536" y="449">验证与审查</text>
  <text class="small" x="536" y="472">test / build / review</text>
  <rect class="card control" x="760" y="142" width="180" height="64" rx="12"/>
  <text class="text" x="786" y="169">更新控制面</text>
  <text class="small" x="786" y="192">handoff / next task</text>
  <path class="line" d="M370 174 H430"/>
  <path class="line" d="M520 206 V244 H405 V282"/>
  <path class="line" d="M400 346 V386 H342 V422"/>
  <path class="line" d="M430 454 H510"/>
  <path class="line" d="M690 454 H760 V346 H732"/>
  <path class="muted-line" d="M650 282 V234 H850 V206"/>
  <path class="line" d="M690 422 H850 V206"/>
  <path class="line" d="M850 142 V106 H280 V142"/>
  <text class="small" x="792" y="258">通过验证：吸收事实</text>
  <text class="small" x="735" y="356">验证失败：返回修复</text>
  <text class="small" x="500" y="544">完成标准来自真实命令输出、diff、审查结果和人工决策点。</text>
</svg>
<figcaption>Harness Engineering 控制回路</figcaption>
</figure>

> 这套结构把“控制信息”和“代码事实”分开

- 控制面记录应该如何推进
- 集成面记录代码实际状态
- 执行面承载本次准备改变的切片
- Agent 可以读控制面选择下一步
- Agent 必须回到集成面确认真实代码状态

一次完整循环通常包含这些动作：

1. 读取控制面事实
2. 对照集成面状态
3. 选择已解锁任务
4. 派发探索和边界确认
5. 切出执行面
6. 派发实现
7. 运行 focused tests / lint / typecheck / build
8. 审查 diff 和越界风险
9. 合入集成面或返回修复
10. 更新 tracker 和编排状态
11. 重新计算下一批可执行任务

这套流程里有几个容易被忽略的事实

> **长期运行能力本身只能证明系统可以持续执行**

公开实践里，一个 8 合 1 的大型重构计划可以让 OMO 持续运行数小时甚至接近 24 小时，但长期运行会放大任务切分过碎、上下文腐败、子代理累计限制、DAG 死结、测试数据缺失等问题

> **控制面成本会吞噬产出**

一次 24 小时左右的记录里，集成面涉及 38 个文件、约 670 行改动；控制面涉及 17 个文件、约 4933 行改动
设计、协调和进度记录远大于实际代码产出
控制面当然必要，但过程文件过厚时，开发系统会变成“记录很多，产出很少”

> **任务切片粒度直接决定 token 投入产出比**

一次 32 小时左右的自动运行记录显示，48 个文件产生约 3333 行改动，token 消耗超过 10 亿级别
追查后发现，交接提示词里混入了“最小可执行单元”倾向，导致每个 worktree 只做 1–3 个文件、几行到几十行改动

针对这三个问题的修正集中在五件事：

1. **统一术语**
   - 编排文档里的最小条目称为任务
   - 基于任务拆出的实际工作称为切片
   - 减少 lane、batch、slice 等自造词混杂
2. **控制面瘦身**
   - 清理过程噪音
   - 只保留任务依赖、完成状态、阻塞项和当前事实
3. **Truth-first**
   - 判断真实代码状态时以集成面为准
   - 控制面承担记录和决策，不承担代码事实
4. **贪婪切片**
   - 同模块、同类型工作尽量合并推进
   - 一个任务原则上在少数几次切片内完成
   - 避免 token 被细碎门禁消耗
5. **验证纪律**
   - 每个切片都需要 focused tests、模块级验证、构建或 fence 验证
   - 完成判断以真实命令输出为准

调整后，9 小时左右完成 65 个文件、约 1539 行总改动，估算 token 约 2.2 亿，时间效率和 token 产出效率明显改善
结论是：任务粒度需要根据模型能力和 harness 成本动态设定，门禁越重，切片越需要足够大

> **跨模型协作需要把文档当作 API**

- 高阶模型适合高层方向判断、架构偏差识别和实验策略
- Claude Code / Codex 适合跨文件代码执行
- Gemini 类模型适合长对话压缩和大纲提炼
- Amp 这类工具适合依赖分析和架构图生成
- Cursor 适合单文件精修和人工介入

跨模型协作的关键是结构化文档传递
杂乱执行记录直接进入决策模型会污染判断
文档在这里承担 API 作用：

| 文档 | 生产者 | 消费者 | 作用 |
| --- | --- | --- | --- |
| 历史大纲摘要 | 压缩模型或整理 Agent | 高阶决策模型 | 去噪、保留关键状态、节省上下文 |
| AGENTS.md | 人类或高阶模型 | 执行 Agent | 固化项目规则和领域知识 |
| 版本开发报告 | 执行 Agent | 人类和其他模型 | 固化本轮迭代踩坑、设计变化和未完成项 |
| 可视化图表 / 数据 | 脚本或诊断工具 | 决策模型 | 把复杂系统状态降维为可判断对象 |

文档同时承担人类备忘录和 Agent 工程接口，负责传递状态、规则和判断依据

> 文档越像 API，越需要稳定字段、稳定术语和可验证事实

## 4. 实践方法：从轻量纪律扩展到完整 harness

> 个人或小团队可以从一套轻量 harness 开始
> 
> 最小系统不需要重型多 Agent 平台，只需要可执行规则、真实验证和清晰交接

1. **写项目级规则**
   - AGENTS.md 或同类文件应该包含项目边界、目录语义、禁止事项、危险操作确认规则、默认验证命令、提交规范和完成标准
   - 它承担地图功能，让 Agent 快速知道“这里怎样工作”

2. **准备控制面目录**
   - 只保存会反复影响执行的信息：架构图、关键设计、spec、plan、runbook、tracker、交接模板、历史决策和已知坑
   - 过程噪音定期清理，控制面只保留当前事实、阻塞项和可执行判断

3. **为任务类型定义默认流程**
   - bug 修复需要复现、根因、修复、回归
   - 新功能需要需求边界、设计、实现、测试
   - 重构需要行为保持、验证覆盖和分阶段合并
   - 文档任务需要来源链路和过期信息清理
   - 不同任务共用一套最小门禁，不同风险等级叠加不同验证

4. **准备真实验收材料**
   - AI 自生成测试可以补充边界
   - 关键回归集需要来自真实业务、历史 bug、线上数据或人工定义的验收用例
   - 长任务尤其需要里程碑检查点
   - 无人值守时间越长，早期误差越需要通过中间门禁截断

5. **调整任务切片粒度**
   - 模型能力强、门禁成本高时，切片应该更贪婪
   - 同模块、同类型、同验证路径的工作适合合并推进
   - 切片过碎会让 planning、review、handoff 和验证反复吞掉 token
   - 切片过大会让跑偏成本上升
   - 每个切片要足够小到能验证，也要足够大到值得跑完整门禁

一套最小目录可以这样落地：

```text
AGENTS.md
docs/architecture.md
docs/runbooks/dev-test.md
docs/plans/current.md
docs/tracker.md
docs/handoff-template.md
```

每次执行结束只要求五项完成证明：改了什么、为什么这样改、跑了什么验证、还有什么风险、下一步是否需要人类决策

对于微服务或复杂系统，最关键的基础设施是联调 runbook
AI 需要能够按照 runbook 编译、配置、运行、测试
架构差异会改变 runbook 内容，但 Harness Engineering 的基本问题通用：

- 如何让 Agent 找到服务边界
- 如何让 Agent 知道依赖启动顺序
- 如何让 Agent 运行真实集成验证
- 如何让 Agent 在失败时收集日志、定位边界、回到修复循环
- 如何在关键设计、危险操作和验收处插入人类决策点

> workflow 和 harness 的关系可以用门禁来判断

数据库设计、后端逻辑、前端页面、模块集成既可以顺序推进，也可以并行推进部分任务
关键不在顺序，在于门禁：

1. B 到 C 之间需要后端接口或契约检查
2. C 到 D 之间需要 E2E 或页面流程检查
3. D 之后需要 CodeReview 和集成验证
4. 失败后需要自动修复分支或人工决策点

带有门禁、状态、失败分支和反馈回路的 workflow 构成 harness 的一部分；步骤列表是流程模板

外部套件可以按重量、粒度、可控性和适配性来选：

| 套件 / 方法 | 阶段性判断 | 适合方向 |
| --- | --- | --- |
| Superpowers | 相对轻量，TDD 流程偏重，brainstorming 有价值；粒度细，跑偏容易纠正 | 局部实现、需求澄清、细粒度质量门禁 |
| OMO | 编排重，Sisyphus 擅长长任务；长任务成本和跑偏成本也高 | 目标明确、计划充分、可长时间运行的大块工作 |
| GSD | 偏重 workflow，命令好记，社区反馈积极 | 想要强流程但降低命令复杂度的场景 |
| Trellis | 轻量、易自定义，强调代码规范积累 | 需要把团队规则沉淀进轻量控制系统的场景 |
| CodeStable | 理念偏简洁，可能缓解 OMO 过重的问题 | 需要更低控制面成本的场景 |
| gstack / BMAD | 工作闭环更宽，部分项目超出纯代码构建 | 产品交付、团队角色和更大范围协作 |

用这张表的方法是先定位自身痛点，再选套件：

- 痛点在需求澄清，强化 brainstorming
- 痛点在长任务无人值守，强化编排和交接
- 痛点在质量不可控，强化测试集、review、runbook 和验收门禁
- 痛点在 token 浪费，降低控制面噪音并调大切片粒度

Harness Engineering 可以按成熟度分层推进：

1. **工具层**
   - 零散 prompt、单个 skill、单个 MCP、局部脚本
2. **流程层**
   - brainstorm → spec → plan → implement → verify 这类可重复 workflow
3. **状态层**
   - tracker、orchestration、handoff、blocked / unlocked、worktree discipline
4. **控制层**
   - 控制面、执行面、集成面分离
   - 自动验证、审查、失败分支和合并纪律形成闭环
5. **交付层**
   - 把 bug 修复、功能开发、重构、技术债治理、文档维护和回归测试都纳入统一开发系统

多数个人实践不需要一步到第五层
有效路径是从当前最大痛点补一层：

- 上下文混乱，补文档索引和交接模板
- 质量不稳，补门禁和测试集
- 长任务跑偏，补里程碑和控制面
- 效率低，补切片粒度和噪音治理

## 5. 采用边界、判断清单与引用材料

Harness Engineering 适合三类场景：

- 多文件变更频繁
- 质量门禁明确
- 任务需要跨会话推进

它对这些任务尤其有价值：

- 大型重构
- 长期 feature
- 复杂 bug 排查
- 多 Agent 协作

三类场景里需要保持克制：

- 需求仍然混乱
- 验证材料不足
- 项目规则本身过期

此时增加 workflow 会放大噪音
增加 agent teams 会放大分歧
增加自动化会放大错误传播

> 更稳的做法是先把需求、runbook、测试数据和完成标准补齐

几个需要持续注意的边界：

- 视觉设计、用户体验和复杂产品判断难以量化，仍需要人工评审
- AI 自生成测试容易只覆盖自己理解到的路径，真实回归集需要人类提供
- 长任务必须插入里程碑检查点，无人值守时间越长，早期误差放大越严重
- 重型 harness 的控制面成本不可忽视，门禁越多，切片越需要足够大
- 外部套件迭代快，最佳实践需要持续校正

一套有效的 Harness Engineering 实践需要同时回答这些问题：

- 项目里哪些信息必须长期稳定？
- Agent 做事前需要读什么？
- Agent 能在哪些目录和分支写文件？
- 什么任务可以并行，什么任务必须串行？
- 哪些命令构成完成证明？
- 哪些失败交给 Agent 自动修，哪些失败交给人类决策？
- 如何在长期运行后清理上下文和控制面噪音？
- 如何把 bug 修复、功能开发、重构、文档维护和技术债治理纳入同一套系统？

> 有效的判断顺序是：先定义自己的项目缺什么，再选择外部 harness 如何补位
> 
> 外部套件是标准件和参考实现，工程师要设计的是适合自己项目、模型、预算、风险和工作习惯的控制系统

### 引用材料

- Linux.DO 原始长期讨论：[想开一个 harness engineering 实践的长期帖子，大家一起分享实践经验](https://linux.do/t/topic/1791588)
- 阶段性总结：[概念边界与方法论](https://linux.do/t/topic/1791588/150?u=jiechen257)
- 长任务实践：[近乎 24 小时 OMO 自动运行实践](https://linux.do/t/topic/1791588/59)
- 控制面优化：[控制面瘦身与任务切分粒度修正](https://linux.do/t/topic/1791588/101)
- 大跨度重构复盘：[大型重构实践后的问题归因](https://linux.do/t/topic/1791588/123)
- 方法论反思：[Trellis 和 CodeStable 引起的反思](https://linux.do/t/topic/1791588/157)
- OpenAI：[Harness Engineering: Leveraging Codex in an Agent-First World](https://openai.com/zh-Hans-CN/index/harness-engineering/)
- Anthropic：[Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- LangChain：[The Anatomy of an Agent Harness](https://www.langchain.com/blog/the-anatomy-of-an-agent-harness)
- Martin Fowler：[Harness engineering for coding agent users](https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html)
