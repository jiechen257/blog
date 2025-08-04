---
title: 了解 MCP
abbrlink: 2025032705
date: 2025-03-27
categories: AI
tags: mcp
---
## **什么是MCP**

### **MCP概念**

MCP（Model Context Protocol，模型上下文协议）是由 Anthropic 提出并于 2024 年 11 月开源的一种通信协议，旨在解决大型语言模型（LLM）与外部数据源及工具之间无缝集成的需求。

它通过标准化 AI 系统与数据源的交互方式，帮助模型获取更丰富的上下文信息，从而生成更准确、更相关的响应。

### **主要功能**

- `上下文共享`：应用程序可以通过 MCP 向模型提供所需的上下文信息（如文件内容、数据库记录等），增强模型的理解能力。
- `工具暴露`：MCP 允许应用程序将功能（如文件读写、API 调用）暴露给模型，模型可以调用这些工具完成复杂任务。
- `可组合的工作流`：开发者可以利用 MCP 集成多个服务和组件，构建灵活、可扩展的 AI 工作流。
- `安全性`：通过本地服务器运行，MCP 避免将敏感数据上传至第三方平台，确保数据隐私。

### **MCP架构**

MCP 采用客户端-服务器架构：

- `MCP 客户端（Client）`：通常是 AI 应用程序（如 Claude Desktop 或其他 LLM 工具），负责发起请求并与服务器通信。
- `MCP 服务器（Server）`：轻量级程序，负责暴露特定的数据源或工具功能，并通过标准化协议与客户端交互。

**通信格式**：基于 `JSON-RPC 2.0`，支持请求、响应和通知三种消息类型，确保通信的标准化和一致性。

## **MCP Servers主要功能**

MCP Servers 作为一个轻量级的本地服务，旨在为客户端提供数据访问和功能执行的接口。

**1. 资源暴露（Resource Exposure）**

资源是服务器提供给客户端的数据实体，可以是文件、数据库记录、内存中的对象等。

例如：

- 文件资源：`file:///home/user/report.txt`
- 内存资源：`memo://recent-insights`

**2. 工具提供（Tool Provisioning）**

工具是服务器暴露的可执行功能，客户端可以通过调用这些工具完成特定任务。

例如：

- 查询数据库：`query_database`（参数：SQL 语句，返回：查询结果）
- 文件写入：`write_file`（参数：文件路径、内容）

**3. 动态通知（Dynamic Notification）**

当资源发生变化时，服务器可以通过通知机制（如 notification 消息）主动推送更新到客户端。

**4. 会话管理（Session Management）**

处理客户端的连接初始化、能力协商和会话关闭。

### **自定义 MCP Servers**

1. 本地实现一个文件资源服务，创建 `mcp_server.py` 文件。

```python
import json
import sys

# 处理客户端请求
def handle_request(request):
    method = request.get("method")
    params = request.get("params", {})
    request_id = request.get("id")

    if method == "initialize":
        return {
            "jsonrpc": "2.0",
            "result": {"version": "1.0", "capabilities": ["resources", "tools"]},
            "id": request_id
        }
    elif method == "read_resource":
        uri = params.get("uri")
        with open(uri.replace("file:///", ""), "r") as f:
            content = f.read()
        return {"jsonrpc": "2.0", "result": content, "id": request_id}
    elif method == "call_tool":
        tool_name = params.get("name")
        if tool_name == "echo":
            return {"jsonrpc": "2.0", "result": params.get("message"), "id": request_id}
    else:
        return {"jsonrpc": "2.0", "error": {"code": -32601, "message": "Method not found"}, "id": request_id}

# 主循环：通过 Stdio 通信
def main():
    while True:
        # 从 stdin 读取请求
        raw_input = sys.stdin.readline().strip()
        if not raw_input:
            break
        request = json.loads(raw_input)

        # 处理请求并返回响应
        response = handle_request(request)
        sys.stdout.write(json.dumps(response) + "\n")
        sys.stdout.flush()

if __name__ == "__main__":
    main()

```

1. 通过 python 启动服务

```
python mcp_server.py

```

1. 在相同的目录下创建 `test.txt` 文件。

```
Hello, this is a test file!
```

1. 另外启动一个命令窗口，输入：

```
echo '{"jsonrpc": "2.0", "method": "read_resource", "params": {"uri": "/path/to/test.txt"}, "id": 2}' | python mcp_server.py

{"jsonrpc": "2.0", "result": "Hello, this is a test file!", "id": 2}
```