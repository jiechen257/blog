---
title: 关于 NPM 包的安全性实践
categories: [tech, front-end]
tags: [front-end, security]
abbrlink: 2025101001
date: 2025-10-10 21:47:50
reprinted: true
reprinted_url: https://github.com/bodadotsh/npm-security-best-practices
---

在现代 JavaScript 开发中，NPM 生态系统为我们提供了丰富的包资源，但同时也带来了安全风险，包括但不限于：数据入侵、供应链攻击、恶意软件、垃圾邮件、网络钓鱼等

本文将介绍一系列 NPM 包安全最佳实践，帮助开发者保护项目免受供应链攻击、恶意软件和其他安全威胁。


## 📦 开发者安全实践

### 1. 锁定依赖版本

在 `npm` 上，默认情况下，新依赖项将使用插入符号 `^` 操作符安装。此操作符安装最新的 `次要` 或 `补丁` 版本。例如，`^1.2.3` 将安装 `1.2.3`、`1.6.2` 等。

**在各种包管理器中锁定精确版本的方法**：

```bash
npm install --save-exact react
pnpm add --save-exact react
yarn add --save-exact react
bun add --exact react
```

我们也可以在配置文件中更新此设置（例如，[.npmrc](https://github.com/bodadotsh/npm-security-best-practices/blob/main/.npmrc)），使用 [save-exact](https://docs.npmjs.com/cli/v11/using-npm/config#save-exact) 或 [save-prefix](https://docs.npmjs.com/cli/v11/using-npm/config#save-prefix) 键值对：

```bash
npm config set save-exact=true
pnpm config set save-exact true
yarn config set defaultSemverRangePrefix ""
```

对于 `bun`，配置文件是 `bunfig.toml`，相应的配置是：

```toml
[install]
exact = true
```

#### 覆盖传递依赖

**然而**，我们的直接依赖也有它们自己的依赖（*传递*依赖）。即使我们锁定了直接依赖，它们的传递依赖可能仍使用宽泛版本范围操作符（如 `^` 或 `~`）。解决方案是覆盖传递依赖：[https://docs.npmjs.com/cli/v11/configuring-npm/package-json#overrides](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#overrides)

在 `package.json` 中，如果我们有以下 `overrides` 字段：

```json
{
  "dependencies": {
    "library-a": "^3.0.0"
  },
  "overrides": {
    "lodash": "4.17.21"
  }
}
```

* 假设 `library-a` 的 `package.json` 依赖于 `"lodash": "^4.17.0"`
* 没有 `overrides` 部分，`npm` 可能会安装 `lodash@4.17.22`（或任何最新的 `4.x.x` 版本）作为 `library-a` 的传递依赖
* 但是，通过添加 `"overrides": { "lodash": "4.17.21" }`，我们告诉 `npm`，在依赖树中的任何地方出现 `lodash`，都必须解析为精确版本 `4.17.21`

对于 `pnpm`，我们也可以在 `pnpm-workspace.yaml` 文件中定义 `overrides` 字段：[https://pnpm.io/settings#overrides](https://pnpm.io/settings#overrides)

对于 `yarn`，`resolutions` 字段在 `overrides` 字段之前引入，它也提供类似功能：[https://yarnpkg.com/configuration/manifest#resolutions](https://yarnpkg.com/configuration/manifest#resolutions)

```json
{
  "resolutions": {
    "lodash": "4.17.21"
  }
}
```

```bash
# yarn 也提供 cli 来设置解析：https://yarnpkg.com/cli/set/resolution
yarn set resolution <descriptor> <resolution>
```

对于 `bun`，它支持 `overrides` 字段或 `resolutions` 字段：[https://bun.com/docs/install/overrides](https://bun.com/docs/install/overrides)

### 2. 包含锁文件

确保将包管理器锁文件提交到 `git` 并在不同环境之间共享。不同的锁文件是：`package-lock.json` 用于 `npm`，`pnpm-lock.yaml` 用于 `pnpm`，`bun.lock` 用于 `bun`，`yarn.lock` 用于 `yarn`。

在自动化环境（如持续集成和部署）中，我们应该安装锁文件中定义的精确依赖：

```bash
npm ci
bun install --frozen-lockfile
yarn install --frozen-lockfile
```

> 💡 **提示**：当处理锁文件中的合并冲突时，*不*需要删除锁文件。当依赖项（包括传递依赖）使用版本范围操作符（`^`、`~` 等）定义时，从头开始重建锁文件可能导致意外更新。
> 
> 现代包管理器有内置的冲突解决机制，只需切换到主分支并重新运行安装。`pnpm` 还允许 [Git 分支锁文件](https://pnpm.io/git#merge-conflicts)，它根据分支名称创建新的锁文件，稍后自动合并回主锁文件。

### 3. 禁用生命周期脚本

生命周期脚本是在 `pre<event>`、`post<event>` 和 `<event>` 脚本之外发生的特殊脚本。例如，`preinstall` 在 `install` 运行之前运行，`postinstall` 在 `install` 运行之后运行。

生命周期脚本是恶意行为者的常见策略。例如，"Shai-Hulud" 蠕虫编辑 `package.json` 文件以添加 `postinstall` 脚本，然后窃取凭据。

```bash
npm config set ignore-scripts true --global
yarn config set enableScripts false
```

对于 `bun` 和 `pnpm`，它们默认禁用。

> ⚠️ **注意**：对于 `bun`，默认允许前 500 个 npm 包的生命周期脚本。

> 💡 **提示**：我们可以结合上面的许多标志。例如，以下 `npm` 命令将只安装锁文件中定义的生产依赖项并忽略生命周期脚本：
> `npm ci --omit=dev --ignore-scripts`

### 4. 设置最小发布年龄

我们可以设置延迟以避免安装新发布的包。这适用于所有依赖项，包括传递依赖。例如，`pnpm v10.16` 引入了 `minimumReleaseAge` 选项：[https://pnpm.io/settings#minimumreleaseage](https://pnpm.io/settings#minimumreleaseage)，它定义了版本发布后必须经过的最小分钟数，pnpm 才会安装它。如果 `minimumReleaseAge` 设置为 `1440`，那么 pnpm 不会安装发布不到 24 小时的版本。

```bash
pnpm config set minimumReleaseAge <minutes>
# 只安装至少 1 天前发布的包
npm install --before="$(date -v -1d)"                               # 对于 Mac 或 BSD 用户
npm install --before="$(date -d '1 days ago' +%Y-%m-%dT%H:%M:%S%z)" # 对于 Linux 用户
yarn config set npmMinimalAgeGate <minutes>
```

对于 `pnpm`，还有一个 `minimumReleaseAgeExclude` 选项来排除某些包的最小发布年龄。

对于 `npm`，有 [一个提案](https://github.com/npm/statusboard/issues/597) 添加 `minimumReleaseAge` 选项和 `minimumReleaseAgeExclude` 选项。

对于 `yarn`，配置选项 `npmMinimalAgeGate` 和 `npmPreapprovedPackages` 自 [v4.10.0](https://github.com/yarnpkg/berry/pull/6298) 起实现。

对于 `bun`，这里讨论：[oven-sh/bun#22679](https://github.com/oven-sh/bun/issues/22679)

提供类似功能的其他工具示例：
* npm-check-updates ([https://github.com/raineorshine/npm-check-updates](https://github.com/raineorshine/npm-check-updates)) 有 `--cooldown` 标志。
* Renovate CLI ([https://github.com/renovatebot/renovate](https://github.com/renovatebot/renovate)) 有 [minimumReleaseAge](https://github.com/renovatebot/renovate/blob/main/docs/configuration-options.md#minimumreleaseage) 配置选项。
* Step Security ([https://www.stepsecurity.io](https://www.stepsecurity.io)) 有 [NPM Package Cooldown Check](https://github.com/step-security/harden-runner/blob/main/docs/npm-package-cooldown-check.md) 功能。

### 5. 权限模型

在最新的 `nodejs` LTS 版本中，我们可以使用权限模型来控制进程可以访问哪些系统资源或进程可以对这些资源采取哪些操作。**然而**，这在存在恶意代码的情况下不提供安全保证。恶意代码仍然可以绕过权限模型并在没有权限模型施加的限制的情况下执行任意代码。

阅读关于 Node.js 权限模型：[https://nodejs.org/docs/latest/api/permissions.html](https://nodejs.org/docs/latest/api/permissions.html)

```bash
# 默认情况下，授予完全访问权限
node index.js
# 限制对所有可用权限的访问
node --permission index.js
# 启用特定权限
node --permission --allow-fs-read=* --allow-fs-write=* index.js
# 将权限模型与 `npx` 一起使用
npx --node-options="--permission" <package-name>
```

对于 Bun，权限模型目前正在 [这里](https://github.com/oven-sh/bun/issues/22679) 和 [这里](https://github.com/oven-sh/bun/issues/22679) 讨论。

### 6. 减少外部依赖

因为 `npm` 发布包的门槛很低，生态系统迅速增长成为最大的包注册表，至今有超过 500 万个包。但并非所有包都是平等的。有一些小型实用程序包，当我们自己可以编写它们时却被下载为依赖项，这引发了"我们是否忘记了如何编码？"的问题

在 `nodejs` 和 `bun` 之间，开发者可以使用它们的许多现代功能，而不是依赖第三方库。原生模块可能不会提供相同级别的功能，但应尽可能考虑它们。这里有几个例子：

| NPM 库 | 内置模块 |
|--------|----------|
| `axios`, `node-fetch`, `got`, 等 | 原生 `fetch` API |
| `jest`, `mocha`, `ava`, 等 | `node:test`, `node:assert`, `bun test` |
| `nodemon`, `chokidar`, 等 | `node --watch`, `bun --watch` |
| `dotenv`, `dotenv-expand`, 等 | `node --env-file`, `bun --env-file` |
| `typescript`, `ts-node`, 等 | `node --experimental-strip-types`, `bun` 原生支持 |
| `esbuild`, `rollup`, 等 | `bun build` |
| `prettier`, `eslint`, 等 | `bun fmt`, `bun lint` |

这里有一些您可能会觉得有用的资源：
* [https://obsidian.md/blog/less-is-safer](https://obsidian.md/blog/less-is-safer)
* [https://kashw1n.com/blog/nodejs-2025](https://kashw1n.com/blog/nodejs-2025)
* [https://lyra.horse/blog/2025/08/you-dont-need-js](https://lyra.horse/blog/2025/08/you-dont-need-js)
* [https://blog.greenroots.info/10-lesser-known-web-apis-you-may-want-to-use](https://blog.greenroots.info/10-lesser-known-web-apis-you-may-want-to-use)
* [https://github.com/you-dont-need/You-Dont-Need-Momentjs](https://github.com/you-dont-need/You-Dont-Need-Momentjs)
* 可视化 NPM 依赖：[https://npmgraph.js.org](https://npmgraph.js.org)
* Knip（移除未使用的依赖）：[https://github.com/webpro-nl/knip](https://github.com/webpro-nl/knip)

## 🔧 维护者安全实践

### 7. 启用 2FA

[https://docs.npmjs.com/about-two-factor-authentication](https://docs.npmjs.com/about-two-factor-authentication)

双因素认证 (2FA) 为您的 `npm` 账户添加了额外的认证层。2FA 默认不是必需的，但启用它是一个好习惯。

```bash
# 确保 2FA 已启用用于认证和写入（这是默认设置）
npm profile enable-2fa auth-and-writes
```

| 自动化级别 | 包发布访问 |
|------------|------------|
| 手动 | 将每个包访问设置为 `需要 2FA` 和 `禁用令牌` |
| 自动 | 将每个包访问设置为 `需要双因素认证` 或 `单因素自动化令牌` 或 `单因素 granular 访问令牌` |

> ⚠️ **重要**：建议配置支持 [WebAuthn](https://github.com/blog/security/supply-chain-security/our-plan-for-a-more-secure-npm-supply-chain) 的安全密钥，而不是基于时间的一次性密码 (TOTP)

### 8. 创建有限访问令牌

[https://docs.npmjs.com/about-access-tokens#about-granular-access-tokens](https://docs.npmjs.com/about-access-tokens#about-granular-access-tokens)

访问令牌是使用 API 或 `npm` CLI 时向 `npm` 进行身份验证的常见方式。

```bash
npm token create # 用于读取和发布令牌
npm token create --read-only # 用于只读令牌
npm token create --cidr=[list] # 用于 CIDR 限制的读取和发布令牌
npm token create --read-only --cidr=[list] # 用于 CIDR 限制的只读令牌
```

> ⚠️ **重要**：应使用 Granular Access Tokens 而不是 Legacy Tokens。Legacy tokens 无法限定范围且不会自动过期。使用它们被认为是危险的。

* 限制令牌到特定包、范围和组织
* 设置令牌过期日期（例如，每年）
* 基于 IP 地址范围限制令牌访问（CIDR 表示法）
* 在只读或读写访问之间选择
* 不要对多个用途使用相同令牌
* 使用描述性令牌名称

### 9. 生成来源声明

[https://docs.npmjs.com/generating-provenance-statements](https://docs.npmjs.com/generating-provenance-statements)

*来源证明*通过公开提供包源代码和构建环境的链接来建立。这允许开发者在下载之前验证包的构建位置和方式。

*发布证明*由注册表在授权用户发布包时生成。当 npm 包与来源一起发布时，它由 Sigstore 公共服务器签名并记录在公共透明账本中，用户可以在其中查看此信息。

例如，这是 `vue` 包页面上的来源声明看起来像的样子：[https://www.npmjs.com/package/vue#provenance](https://www.npmjs.com/package/vue#provenance)

要建立来源，使用支持的 CI/CD 提供商（例如，GitHub Actions）并使用正确的标志发布：

```bash
npm publish --provenance
```

要在不调用 `npm publish` 命令的情况下发布，我们可以执行以下操作之一：
* 在 CI/CD 环境中设置 `NPM_CONFIG_PROVENANCE` 为 `true`
* 将 `provenance=true` 添加到 `.npmrc` 文件
* 将 `publishConfig` 块添加到 `package.json`

```json
"publishConfig": {
  "provenance": true
}
```

> 对于那些对 [可重现构建](https://reproducible-builds.org/) 感兴趣的人，请查看 OSS Rebuild ([https://github.com/google/oss-rebuild](https://github.com/google/oss-rebuild)) 和软件工件供应链级别 (SLSA) 框架 ([https://slsa.dev](https://slsa.dev))。

#### 受信任发布

当使用 OpenID Connect (OIDC) 身份验证时，可以*无需* npm 令牌发布包，并获得*自动*来源。这称为**受信任发布**，请在此处阅读 GitHub 公告：[https://github.blog/changelog/2025-07-31-npm-trusted-publishing-with-oidc-is-generally-available/](https://github.blog/changelog/2025-07-31-npm-trusted-publishing-with-oidc-is-generally-available/) 和 [https://docs.npmjs.com/trusted-publishers](https://docs.npmjs.com/trusted-publishers)

> ⚠️ **重要**：建议使用受信任发布代替令牌。

相关工具：
* [https://github.com/antfu/open-packages-on-npm](https://github.com/antfu/open-packages-on-npm) (CLI 为 monorepo 包设置受信任发布者)
* [https://github.com/sxzz/userscripts/blob/main/src/npm-trusted-publisher.md](https://github.com/sxzz/userscripts/blob/main/src/npm-trusted-publisher.md) (Userscript 在 npmjs.com 上填写受信任发布者的表单)

### 10. 审查发布文件

限制 npm 包中的文件有助于通过减少攻击面来防止恶意软件，并避免意外泄露敏感数据。

`package.json` 中的 `files` 字段用于指定应包含在发布包中的文件。某些文件总是包含在内，请参阅：[https://docs.npmjs.com/cli/v11/configuring-npm/package-json#files](https://docs.npmjs.com/cli/v11/configuring-npm/package-json#files) 了解更多详细信息。

```json
{
  "name": "my-package",
  "version": "1.0.0",
  "main": "dist/index.js",
  "files": ["dist", "LICENSE", "README.md"]
}
```

> 💡 **提示**：`.npmignore` 文件也可用于从发布包中排除文件。它不会覆盖 `"files"` 字段，但在子目录中会。
> 
> `.npmignore` 文件就像 `.gitignore` 一样工作。如果有 `.gitignore` 文件，而 `.npmignore` 缺失，则将使用 `.gitignore` 的内容。

运行 `npm pack --dry-run` 或 `npm publish --dry-run` 查看运行 pack 或 publish 命令时会发生什么。

```bash
> npm pack --dry-run
npm notice Tarball Contents
npm notice 1.1kB LICENSE
npm notice 1.9kB README.md
npm notice 108B index.js
npm notice 700B package.json
npm notice Tarball Details
```

## 🛡️ 高级安全策略

### 11. NPM 组织

[https://docs.npmjs.com/organizations](https://docs.npmjs.com/organizations)

在组织级别，最佳实践是：
* 在组织级别启用 `需要 2FA`
* 最小化 `npm` 组织成员数量
* 如果同一组织中有多个包团队，将所有包的 `开发人员` 团队权限设置为 `读取`
* 创建单独的团队来管理每个包的权限

### 12. 替代注册表

#### JSR

JSR 是一个现代 JavaScript/TypeScript 包注册表，与 npm 向后兼容。

> ⚠️ **注意**：并非所有 npm 包都在 JSR 上！

访问 [https://jsr.io](https://jsr.io) 查看包是否可用并阅读 [npm 限制](https://jsr.io/docs/npm) 文档。

```bash
deno add jsr:<package-name>
pnpm add jsr:<package-name> # pnpm 10.9+
yarn add jsr:<package-name> # yarn 4.9+
# npm, bun 和旧版本 yarn 或 pnpm
npx jsr add <package-name> # 将 npx 替换为 yarn dlx, pnpm dlx 或 bunx
```

#### 私有注册表

私有包注册表是组织管理自己依赖项的好方法，作为公共 `npm` 注册表的代理，并在项目中使用之前强制执行安全策略。

这里有一些您可能会觉得有用的私有注册表：
* GitHub Packages [https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
* Verdaccio [https://github.com/verdaccio/verdaccio](https://github.com/verdaccio/verdaccio)
  + 参见 Verdaccio 最佳实践：[https://verdaccio.org/docs/best/](https://verdaccio.org/docs/best/)
* Vlt [https://www.vlt.sh/](https://www.vlt.sh/)
  + [vlt 的 Serverless Registry](https://vlt.sh/blog/introducing-vlt-serverless-registry) (VSR) 可以在几分钟内部署到 Cloudflare Workers。
* JFrog Artifactory [https://jfrog.com/integrations/npm-registry](https://jfrog.com/integrations/npm-registry)
* Sonatype: [https://help.sonatype.com/en/npm-registry.html](https://help.sonatype.com/en/npm-registry.html)

### 13. 审计、监控和安全工具

#### 审计

许多包管理器提供审计功能来扫描项目依赖项中的已知安全漏洞，显示报告并推荐修复它们的最佳方法。

```bash
npm audit # 审计依赖项
npm audit fix # 自动安装任何兼容的更新
npm audit signatures # 验证依赖项的签名
pnpm audit
pnpm audit --fix
bun audit
yarn npm audit
yarn npm audit --recursive # 审计传递依赖项
```

#### GitHub

[https://github.com/security](https://github.com/security)

GitHub 提供几种可以帮助保护免受 `npm` 恶意软件侵害的服务，包括：
* [Dependabot](https://docs.github.com/en/code-security/dependabot/dependabot-security-updates/about-dependabot-security-updates)：此工具自动扫描项目依赖项（包括 `npm` 包）的已知漏洞。
* [软件物料清单 (SBOMs)](https://docs.github.com/en/code-security/supply-chain-security/understanding-your-software-supply-chain/about-the-software-bill-of-materials)：GitHub 允许您直接从其依赖图导出存储库的 SBOM。SBOM 提供项目所有依赖项的全面列表，包括传递依赖项（依赖项的依赖项）。
* [代码扫描](https://docs.github.com/en/code-security/code-scanning/automatically-scanning-your-code-for-vulnerabilities-and-errors/about-code-scanning)：代码扫描也可以帮助识别潜在漏洞或可疑模式，这些可能来自集成受损的 `npm` 包。

> ⚠️ **警告**：如果您在 NPM 或 GitHub 中发现漏洞或问题，请使用以下链接报告：
> * [https://docs.npmjs.com/reporting-malware-in-an-npm-package](https://docs.npmjs.com/reporting-malware-in-an-npm-package)
> * [https://docs.github.com/en/communities/maintaining-your-safety-on-github/reporting-abuse-or-spam#reporting-a-repository](https://docs.github.com/en/communities/maintaining-your-safety-on-github/reporting-abuse-or-spam#reporting-a-repository)

#### OpenSSF Scorecard

[https://securityscorecards.dev](https://securityscorecards.dev) 和 [https://github.com/ossf/scorecard](https://github.com/ossf/scorecard)

免费开源自动化工具，评估与软件安全相关的重要启发式方法（"检查"），并为每个检查分配 0-10 分的分数。本仓库中提到的几个风险作为检查的一部分包含在内：固定依赖项、令牌权限、打包、签名发布等...

运行检查：
1. 在您拥有的代码上自动使用 [GitHub Action](https://github.com/marketplace/actions/oss-scorecard-action)
2. 通过 [命令行](https://github.com/ossf/scorecard/blob/main/docs/checks.md#command-line) 手动在您的（或别人的）项目上

#### Socket.dev

[https://socket.dev](https://socket.dev)

Socket.dev 是一个安全平台，保护代码免受漏洞和恶意依赖项的侵害。它提供各种工具，如 [GitHub App](https://socket.dev/github) 扫描拉取请求、[CLI 工具](https://socket.dev/cli)、[web 扩展](https://socket.dev/browser-extension)、[VSCode 扩展](https://socket.dev/vscode) 等。这是他们关于 [2025 年 1 月大规模 AI 驱动恶意软件狩猎](https://socket.dev/blog/ai-powered-malware-hunting-at-scale) 的演讲。

[Socket Firewall](https://socket.dev/blog/introducing-the-socket-firewall) 是在安装时阻止恶意包的免费工具：

```bash
npm i -g sfw
# 适用于 `npm`, `yarn`, `pnpm`
sfw npm install <package-name>
# 示例：在 zsh 中将 `npm` 别名为 `sfw npm`
echo "alias npm='sfw npm'" >> ~/.zshrc
```

#### Snyk

[https://snyk.io](https://snyk.io)

Snyk 提供一套工具来修复开源依赖项中的漏洞，包括 CLI 在本地计算机上运行漏洞扫描、IDE 集成嵌入开发环境以及 API 以编程方式与 Snyk 集成。例如，您可以 [在使用前测试公共 npm 包](https://snyk.io/vuln/npm:axios) 或 [为已知漏洞创建自动 PR](https://snyk.io/blog/open-source-and-dependency-management-at-scale-with-snyk-and-github-dependabot/)。

### 14. 支持 OSS

维护者倦怠是开源社区中的一个重要问题。许多流行的 `npm` 包由志愿者在业余时间维护，通常没有任何补偿。随着时间的推移，这会导致疲惫和缺乏动力，使他们更容易受到社会工程学的影响，恶意行为者假装成为有用的贡献者并最终注入恶意代码。

2018 年，`event-stream` 包因维护者给予恶意行为者访问权限而被攻破。JavaScript 生态系统之外的另一个例子是 2024 年的 XZ Utils 事件，恶意行为者工作了三年多才获得信任地位。

OSS 捐赠也有助于为开源开发创建更可持续的模式。基金会可以帮助支持数百个开源项目背后的业务、营销、法律、技术援助和直接支持，许多人依赖这些项目。

在 JavaScript 生态系统中，OpenJS Foundation ([https://openjsf.org](https://openjsf.org)) 于 2019 年由 JS Foundation 和 Node.js Foundation 合并成立，以支持一些最重要的 JS 项目。下面列出了几个其他平台，您可以在那里捐赠和支持每天使用的 OSS：

* GitHub Sponsors [https://github.com/sponsors](https://github.com/sponsors)
* Open Collective [https://opencollective.com](https://opencollective.com)
* Thanks.dev [https://thanks.dev](https://thanks.dev)
* Open Source Pledge [https://opensourcepledge.com](https://opensourcepledge.com)
* Ecosystem Funds: [https://funds.ecosyste.ms](https://funds.ecosyste.ms)

## 📝 配置文件示例

以下是一个示例 `.npmrc` 文件，包含下面提到的配置选项：

```ini
ignore-scripts=true
provenance=true
save-exact=true
save-prefix=''
```

其他配置文件示例：
* [bunfig.toml](https://github.com/bodadotsh/npm-security-best-practices/blob/main/bunfig.toml)
* [pnpm-workspace.yaml](https://github.com/bodadotsh/npm-security-best-practices/blob/main/pnpm-workspace.yaml)
* [.yarnrc.yml](https://github.com/bodadotsh/npm-security-best-practices/blob/main/.yarnrc.yml)

## 🎯 结论

NPM 生态系统虽然强大，但也存在安全风险。通过实施这些最佳实践——从锁定依赖版本、禁用生命周期脚本到启用 2FA 和使用来源声明——开发者可以显著提高其项目的安全性。

记住，安全性是一个持续的过程，而不是一次性的任务。定期审计依赖项、保持更新并支持开源维护者，这些都有助于构建更安全的 JavaScript 生态系统。

> 🛡️ **安全提示**：如果您在 NPM 或 GitHub 中发现漏洞或问题，请使用以下链接报告：
> - [https://docs.npmjs.com/reporting-malware-in-an-npm-package](https://docs.npmjs.com/reporting-malware-in-an-npm-package)
> - [https://docs.github.com/en/communities/maintaining-your-safety-on-github/reporting-abuse-or-spam#reporting-a-repository](https://docs.github.com/en/communities/maintaining-your-safety-on-github/reporting-abuse-or-spam#reporting-a-repository)