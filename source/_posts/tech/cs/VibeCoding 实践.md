---
title: VibeCoding 思想与实践
categories: cs-basics
abbrlink: 20260128
date: 2026-01-28 00:00:00
---

## 哲学/思想

在 React 的世界中，有一个经典的哲学公式：**UI = f(State, Props)**，它用函数式的思维定义了用户界面的本质。而在 AI 编程时代，我们可以推导出一个类似的公式：

**Code = AI(Context, Prompt)**

这个公式揭示了 AI 编程的核心范式：

- **Context（上下文）** 是 AI 理解问题的基础，包括代码库结构、技术栈、业务逻辑、设计规范等
- **Prompt（提示词）** 是人类向 AI 传达的另类 Props，包括传统意义上的提示词、MCP、Skill 等
- **AI** 是将上下文和提示词转化为代码的"函数"，包括底层 LLM 模型和延伸出来的 Agent 等

### Vibe Coding 核心理念

"Vibe Coding" 这一概念由 Open AI 的 Andrej Karpathy 在 2025 年初提出，它强调一种 **对话式、迭代式** 的编程方式——用自然语言描述需求，让 AI 生成代码，然后通过反馈循环不断调优。

#### 🧭 道（Philosophy）- 思想

- **AI 优先**：凡是 AI 可完成的工作，优先交由 AI 执行（效率第一原则）
- **上下文至上**：上下文是 Vibe Coding 的第一性要素，遵循 "垃圾进，垃圾出" 的底层逻辑
- **目的导向**：开发全流程的所有动作均围绕核心目标展开，避免无意义的试错
- **结构先行**：先明确整体框架再落地代码实现，从源头规避技术债累积

#### 🧩 法（Methodology）- 方法论

- 用一句话清晰定义目标与非目标，明确需求边界
- 保持功能正交性，避免模块职责重叠与功能冗余
- **复用优先**：不重复造轮子，优先通过 AI 检索适配的开源仓库或成熟方案
- 按职责拆分模块，先定义接口再补充实现，保证架构合理性
- 单次变更仅聚焦一个模块，严格控制变更范围，降低出错概率
- **文档即上下文**：文档并非事后补充，而是编程过程的核心组成部分

#### 🛠️ 术（Techniques）- 技巧

- 向 AI 提需求时，明确标注可修改范围与不可触碰边界
- 调试场景下，仅向 AI 提供核心信息：预期结果 vs 实际结果 + 最小复现案例
- 测试代码可交由 AI 生成，但核心断言逻辑需人工审核确认
- 代码量较大时及时切换新会话，避免上下文污染导致理解偏差

#### 📋 器（Tools）- 拓展工具

详见下文「AI 生态发展状况 - 系统能力」部分。

## AI 生态发展状况

### 系统能力

**MCP**（Model Context Protocol）是 Anthropic 于 2024 年发布的开放协议，被称为 AI 界的"USB-C 接口"；**Skill** 是将领域专业知识封装为可复用指令集的机制。

| 维度           | MCP                                    | Skill                                  |
| -------------- | -------------------------------------- | -------------------------------------- |
| **本质**       | 标准化协议——AI 与外部系统的通信标准    | 知识封装——领域专业知识的结构化指令集   |
| **作用**       | 连接外部工具和数据源（GitHub、设计稿） | 定义任务执行流程（代码审查、日报生成） |
| **类比**       | USB-C 接口，即插即用                   | App，基于接口实现具体功能              |
| **复用范围**   | 跨场景通用                             | 垂直领域专用                           |
| **配置方式**   | JSON Server 配置                       | Markdown 文件（SKILL.md）              |
| **Token 消耗** | 工具定义可能占用大量 token             | 按需加载，脚本执行结果才返回           |

### 产品载体演进

AI 产品的交互载体经历了明显的代际演进，每一代都代表着人机协作模式的变革：

| 代际      | 产品形态      | 代表产品                 | 交互模式              | 核心特征                           | 局限性                         |
| --------- | ------------- | ------------------------ | --------------------- | ---------------------------------- | ------------------------------ |
| **Gen 1** | ChatBox       | ChatGPT, Claude.ai       | 纯对话式 Q&A          | 单轮/多轮对话，知识问答            | 无法操作外部系统，输出仅限文本 |
| **Gen 2** | IDE 集成      | GitHub Copilot, Cursor   | 代码补全 + 内联对话   | 上下文感知，实时代码建议           | 被动响应，缺乏主动规划能力     |
| **Gen 3** | CLI/GUI Agent | Claude Code, Windsurf    | 命令行/图形化 Agent   | 自主执行多步任务，操作文件系统     | 仍需人工频繁确认，连续性受限   |
| **Gen 4** | 自主代理      | Manus, Devin             | 高度自主的任务执行    | 端到端完成复杂任务，最小化人工干预 | 成本高，可控性存疑，调试困难   |
| **Gen 5** | 环境原生      | Claude Desktop, ClawdBot | 融入操作系统/通讯工具 | 跨应用协作，无缝集成工作流         | 生态碎片化，隐私安全挑战       |

#### 演进趋势分析

| 演进维度       | 早期（Gen 1-2）   | 当前（Gen 3-4）   | 未来（Gen 5+）    |
| -------------- | ----------------- | ----------------- | ----------------- |
| **人机分工**   | AI 辅助，人类主导 | AI 执行，人类监督 | AI 自主，人类审批 |
| **上下文范围** | 单文件/单对话     | 项目级/仓库级     | 组织级/跨系统     |
| **执行边界**   | 仅生成文本        | 操作文件和终端    | 操作任意软件      |
| **持久性**     | 会话级记忆        | 项目级记忆        | 长期记忆 + 学习   |
| **协作模式**   | 1 人 1 AI         | 1 人 N Agent      | N 人 N Agent      |

### 思想钢印：AI 系统在自我进化

这是一个需要提前"押注"的信念 —— 我们正处于 AI 能力指数级增长的时期，相信 AI 会演变成**一个自我优化的递归系统**，不仅能执行任务，还能持续改进执行任务的方式本身

自我优化的递归系统：

1. **启动 (Bootstrap)**：通过 AI 生成初始的 "生成器提示词" 与 "优化器提示词"
2. **自省进化**：利用优化器提示词迭代改进生成器提示词的质量
3. **任务生成**：基于进化后的生成器，生成目标场景的所有提示词与 Skill 指令集
4. **循环飞跃**：将新生成的产物反馈至系统，启动持续的自我进化循环

## Vibe Coding 次佳实践

基于 [everything-claude-code](https://github.com/affaan-m/everything-claude-code) 框架，融合实用 Skills，创建了一个可复用的配置仓库：ai-agent-config

### 仓库结构

```
ai-agent-config/
├── agents/                        # 专业化子代理（5 个）
│   ├── planner.md                # 功能规划代理
│   ├── code-reviewer.md          # 代码审查代理
│   ├── architect.md              # 架构设计代理
│   ├── security-reviewer.md      # 安全审查代理
│   └── build-error-resolver.md   # 构建错误解决代理
├── commands/                      # 快捷命令（6 个）
│   ├── daily.md                  # /daily - 生成日报
│   ├── plan.md                   # /plan - 实现规划
│   ├── review.md                 # /review - 代码审查
│   ├── tdd.md                    # /tdd - TDD 开发
│   ├── build-fix.md              # /build-fix - 修复构建错误
│   └── security.md               # /security - 安全审查
├── skills/                        # 工作流技能（16 个）
│   ├── aone-bug-context/         # Aone 缺陷上下文提取
│   ├── mastergo-design/          # MasterGo D2C 设计稿处理
│   ├── daily-report/             # 日报生成
│   ├── weekly-report/            # 周报生成
│   ├── code-review/              # 代码审查
│   ├── tdd-workflow/             # TDD 工作流
│   ├── react-typescript/         # React + TS 开发规范
│   ├── frontend-design/          # 前端设计指南
│   ├── webapp-testing/           # Playwright 测试
│   ├── knowledge-management/     # 知识管理决策
│   ├── docx/                     # Word 文档处理
│   ├── xlsx/                     # Excel 表格处理
│   ├── pptx/                     # PPT 演示文稿
│   ├── pdf/                      # PDF 文档处理
│   ├── drawio-architecture/      # Drawio 架构图
│   └── drawio-export/            # Drawio 导出
├── rules/                         # 始终遵循的规则
│   ├── security.md               # 安全规则
│   ├── coding-style.md           # 编码风格
│   ├── testing.md                # 测试规则
│   └── git-workflow.md           # Git 工作流
├── hooks/                         # 事件触发器
│   └── hooks.json                # Hook 配置
├── contexts/                      # 动态上下文
│   ├── dev.md                    # 开发模式
│   ├── review.md                 # 审查模式
│   └── research.md               # 研究模式
├── memory-bank/                   # 项目记忆库模板
│   ├── @architecture.md          # 架构文档模板
│   └── @decisions.md             # 决策记录模板
├── workflows/                     # 复用工作流
├── AGENTS.md                      # Skills 索引配置
└── GEMINI.md                      # AI Agent 配置文件
```

### 能力矩阵 (Agents & Commands & Skills)

### 快速参考表

| 我想要...      | 使用方式                           |
| -------------- | ---------------------------------- |
| 规划一个新功能 | `帮我规划 xxx` 或 `/plan`          |
| 审查代码质量   | `CR一下` 或 `/review`              |
| 设计系统架构   | `架构设计 xxx`                     |
| 安全检查       | `security review` 或 `/security`   |
| 修复编译错误   | `build error: xxx` 或 `/build-fix` |
| 生成日报       | `/daily`                           |
| TDD 开发       | `/tdd xxx`                         |
| 生成周报       | 使用 `weekly-report` skill         |

#### Daily Report 示例

**数据来源**：Git commit 历史 > 对话摘要 > 文件变更 > 用户输入

**产出示例**：

```markdown
# 日报 2026-01-28 (周二)

> **一句话总结**：完成 VibeCoding 文章撰写 + 创建 ai-agent-config 配置仓库

## 📋 完成任务

### 文档撰写

- **VibeCoding 实践文章**
  - 补全 AI 编程哲学、MCP/Skill 对比、最佳实践等章节
  - 产出：`source/_posts/tech/cs/VibeCoding 实践.md`

### Skill 开发

- **ai-agent-config 仓库**
  - 融合 everything-claude-code 框架与实用 Skills
  - 包含 daily-report、weekly-report、code-review 等技能

## 📦 产出物

| 类型 | 路径                 | 说明                      |
| ---- | -------------------- | ------------------------- |
| 文章 | `VibeCoding 实践.md` | 12000+ 字的 AI 编程方法论 |
| 仓库 | `ai-agent-config/`   | 可复用的 Agent 配置集合   |
```

## 思考/探索

### 当前的瓶颈/上限

回到这个公式：Code = AI(Context, Prompt) 来分析：

1. **Context（上下文）的转换率损耗**：在复杂的业务链路中，从原始需求到代码实现中间经历了多次“翻译”;每一层上下文的传递都可能伴随着信息熵的增加和有效信息的丢失
2. **Prompt（提示词）的语义鸿沟**：当需求复杂度提升时，Prompt 的长度和复杂度呈指数级增长，在编写 Prompt 时往往难以覆盖所有边缘情况，导致 AI 生成的代码在逻辑完备性上存在“最后一公里”的问题
3. **AI（模型/Agent）的逻辑上限**

#### 拿 D2C 场景举例

直观理解下 D2C 方案：设计稿上下文 => 代码
在具体业务场景下，这个链路可以补全为：设计规范 => 设计同学 => 设计稿上下文 => DSL => AI => 代码 => 页面效果

在完整的链路场景下，从一开始的设计规范到最后的页面，中间穿插着多轮的上下文转换（上游到下游的交互），不可避免的造成了上下文的冗余化和可读性变差

D2C 的众多解决方案，最终应该都是在优化这条链路上下文的转换率

### 可探索的应用新方向

- browser control：用以网页 devtools 调试

## 参考资料

- [vibe-coding-cn](https://github.com/2025Emma/vibe-coding-cn) - Vibe Coding 中文指南
- [everything-claude-code](https://github.com/affaan-m/everything-claude-code) - Claude Code 完整配置集合
- [Anthropic MCP 文档](https://anthropic.com/blog/mcp) - Model Context Protocol 官方介绍
