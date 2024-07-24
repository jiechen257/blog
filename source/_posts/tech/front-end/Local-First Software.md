---
title: Local-First 应用
categories: front-end
tags: ["local-first"]
abbrlink: 20270708
date: 2024-07-08
---

## 出发点

> 我们使用 Google Docs 来协作处理文档、电子表格和演示文稿；在 Figma 中，我们可以多人进行用户界面设计；我们使用 Slack 与同事沟通；我们在 Trello 中跟踪任务

我们大量使用云应用进行协作，这些应用通过网络浏览器或移动 App 访问，数据存储在远程服务器上。

优势：

- 无缝协作
- 跨设备访问数据
  局限：
- 数据访问受限于服务器
- 用户对数据的所有权不完全

_There is no cloud, it's just someone else's computer._

> 在网络应用出现之前，我们有一些我们可以称之为 “老式”的应用：在你的本地计算机上运行的程序，在本地磁盘上读写文件
>
> 今天我们仍然在使用这种类型的应用程序：文本编辑器和集成开发环境、Git 和其他版本控制系统，以及许多专业软件，如图形应用程序或 CAD 软件都属于这种类型

传统的本地应用程序将数据存储在用户的设备上，赋予用户对数据的完全控制权。用户可以自由地存档、备份、编辑或删除这些数据，无需依赖外部服务。

我们既希望有云应用提供的方便的跨设备访问和实时协作，也希望有 “老式”软件体现的对你自己数据的拥有权

## 下定义

我们相信，数据所有权和实时协作并不相悖。我们有可能创建具有云应用所有优点的软件，同时也允许你保留对你创建的数据、文档和文件的完全所有权。

我们把这种类型的软件称为本地优先软件 `Local-first software` ，因为它优先使用本地存储（你的电脑中内置的磁盘）和本地网络（如你的家庭 WiFi）而不是远程数据中心的服务器。

- 在云计算应用程序中，服务器上的数据被视为数据的主要的、权威的副本；
- 如果客户端有一份数据的副本，它只是一个从属于服务器的缓冲区。任何数据修改都必须发送到服务器上，否则就 “没有发生”
- 在本地优先的应用程序中，我们交换了这些角色：我们把你本地设备上的数据副本—你的笔记本电脑、平板电脑或手机—视为主要副本。服务器仍然存在，但它们持有你的数据的次要副本，以协助从多个设备访问

## 技术体现

#### 数据所有权

数据所有权的核心是将用户数据存储在本地设备上。这通常通过嵌入式数据库实现，如 SQLite 或 LevelDB。这些数据库直接集成到应用程序中，允许高效的本地数据存储和检索

数据同步是另一个关键。这通常采用双向同步协议，如 CouchDB 使用的协议。同步过程中，客户端和服务器交换数据差异，而不是整个数据集

这种方法既高效又能处理网络中断

#### CRDT 技术

CRDTs as `Conflict-free Replicated Data Types`，无冲突复制数据类型
![](https://cdn.jsdelivr.net/gh/jiechen257/personal-gallery@main/img/202407241714053.png)

两个设备最初拥有相同的待办事项列表。在设备 1 上，使用 .push() 方法将一个新的项目添加到列表中，该方法将新的项目附加到列表的末尾

同时，第一个项目在设备 2 上被标记为完成。在两个设备进行通信后，CRDT 自动合并状态，使两个变化都生效

#### 本地数据库与同步引擎结合的全栈响应式架构

全栈响应式架构的基础是响应式编程模型。这种模型将数据视为流，任何数据变化都会自动传播到系统的其他部分

在前端，这通常通过响应式状态管理库实现，如 RxJS 或 MobX。这些库提供了可观察的数据结构，UI 组件可以订阅这些结构的变化

后端同样采用响应式模式。响应式数据库（如 RxDB）提供了可观察的查询结果。当底层数据发生变化时，这些查询结果会自动更新

实时通信通常通过 WebSocket 或类似协议实现。这允许服务器主动推送数据到客户端，实现双向实时通信

整个系统采用事件驱动的架构。数据变化被视为事件，这些事件触发一系列反应，包括 UI 更新、数据同步和业务逻辑执行

## 代码实现

```js
class LocalFirstApp {
	constructor() {
		this.data = {};
		this.syncQueue = [];
		this.isOnline = navigator.onLine;
		this.lastSyncTime = 0;
		this.serverUrl = "https://api.example.com"; // 替换为实际的服务器URL
		this.user = null;

		window.addEventListener("online", () => this.handleOnline());
		window.addEventListener("offline", () => this.handleOffline());
	}

	// 创建或更新数据
	setItem(key, value) {
		this.data[key] = value;
		this.saveToLocalStorage();
		this.addToSyncQueue({ type: "set", key, value });
		if (this.isOnline) {
			this.sync();
		}
	}

	// 获取数据
	getItem(key) {
		return this.data[key];
	}

	// 删除数据
	removeItem(key) {
		delete this.data[key];
		this.saveToLocalStorage();
		this.addToSyncQueue({ type: "remove", key });
		if (this.isOnline) {
			this.sync();
		}
	}

	// 保存到本地存储
	saveToLocalStorage() {
		localStorage.setItem("appData", JSON.stringify(this.data));
	}

	// 从本地存储加载数据
	loadFromLocalStorage() {
		const storedData = localStorage.getItem("appData");
		if (storedData) {
			this.data = JSON.parse(storedData);
		}
	}

	// 改进同步队列
	addToSyncQueue(operation) {
		operation.timestamp = Date.now();
		operation.id = this.generateUniqueId();
		this.syncQueue.push(operation);
		this.saveToLocalStorage();
	}

	// 生成唯一ID
	generateUniqueId() {
		return Date.now().toString(36) + Math.random().toString(36).substr(2);
	}

	// 加密数据
	encryptData(data) {
		// 这里应该使用真正的加密算法，比如 AES
		// 为了演示，我们使用一个简单的 Base64 编码
		return btoa(JSON.stringify(data));
	}

	// 解密数据
	decryptData(encryptedData) {
		// 对应的解密操作
		return JSON.parse(atob(encryptedData));
	}

	// 保存到本地存储（加密版）
	saveToLocalStorage() {
		const encryptedData = this.encryptData({
			data: this.data,
			syncQueue: this.syncQueue,
			lastSyncTime: this.lastSyncTime,
		});
		localStorage.setItem("appData", encryptedData);
	}

	// 从本地存储加载数据（解密版）
	loadFromLocalStorage() {
		const encryptedData = localStorage.getItem("appData");
		if (encryptedData) {
			const decryptedData = this.decryptData(encryptedData);
			this.data = decryptedData.data;
			this.syncQueue = decryptedData.syncQueue;
			this.lastSyncTime = decryptedData.lastSyncTime;
		}
	}

	// 用户认证
	async login(username, password) {
		try {
			const response = await fetch(`${this.serverUrl}/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, password }),
			});
			if (response.ok) {
				const userData = await response.json();
				this.user = userData;
				this.saveToLocalStorage();
				return true;
			}
		} catch (error) {
			console.error("Login failed:", error);
		}
		return false;
	}

	// 注销
	logout() {
		this.user = null;
		this.data = {};
		this.syncQueue = [];
		this.saveToLocalStorage();
	}

	// 处理重新上线
	handleOnline() {
		this.isOnline = true;
		this.sync();
	}

	// 处理离线
	handleOffline() {
		this.isOnline = false;
	}

	// 初始化应用
	init() {
		this.loadFromLocalStorage();
		if (this.isOnline) {
			this.sync();
		}
	}
}
```

使用案例

```js
// 创建应用实例
const app = new LocalFirstApp();

// 初始化应用
app.init();

// 使用应用的异步函数
async function useApp() {
	// 用户登录
	const loggedIn = await app.login("username", "password");
	if (loggedIn) {
		console.log("登录成功");

		// 设置数据
		app.setItem("user_profile", {
			name: "Alice",
			age: 30,
			email: "alice@example.com",
		});

		// 获取数据
		const userProfile = app.getItem("user_profile");
		console.log("用户资料:", userProfile);

		// 更新数据
		app.setItem("user_profile", {
			...userProfile,
			age: 31,
		});

		// 添加新数据
		app.setItem("preferences", {
			theme: "dark",
			notifications: true,
		});

		// 删除数据
		app.removeItem("old_data");

		// 手动触发同步（通常不需要，因为设置和删除操作会自动触发同步）
		if (app.isOnline) {
			await app.sync();
		}

		// 注销
		app.logout();
		console.log("已注销");
	} else {
		console.log("登录失败");
	}
}

// 运行应用
useApp().catch(console.error);

// 监听在线状态变化
window.addEventListener("online", () => {
	console.log("设备重新上线，正在同步数据...");
});

window.addEventListener("offline", () => {
	console.log("设备离线，将在恢复连接后同步数据");
});
```
