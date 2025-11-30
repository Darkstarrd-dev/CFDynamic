这份文档为您总结了从零开始搭建**全栈免费开发环境**的所有核心步骤。

我们将打通：**WispByte (后端容器)** + **DigitalPlat (免费域名)** + **Cloudflare (DNS解析/Worker/前端)** 的完整链路。

-----

# 🚀 全栈免费环境搭建指南

**项目目标**：搭建一个 Node.js 后端，配置自定义域名，并通过 Cloudflare Worker 实现安全的中转和前端访问。

**核心资源信息**：

  * **后端主机**：[WispByte](https://wispbyte.com/) (端口: `9552`, IP: `217.154.212.66`)
  * **域名注册**：[DigitalPlat](https://dash.domain.digitalplat.org/) (域名: `darkstarrd.dpdns.org`)
  * **DNS 托管**：Cloudflare (NS: `daisy.ns.cloudflare.com`, `hal.ns.cloudflare.com`)

-----

## 第一阶段：后端服务器配置 (WispByte)

### 1\. 创建与环境设置

1.  登录 WispByte 面板，创建一个 **Node.js** 服务器。
2.  进入 **"Startup" (启动)** 页面：
      * **Startup Command**: 确保指向你的入口文件（例如 `node index.js`）。
      * **Additional Packages**: 如果用到 `express` 等库，在此处填入包名（空格分隔），系统会自动安装。

### 2\. 部署后端代码

在 **Files** 页面创建或上传 `index.js`。
**关键修改**：必须监听 `0.0.0.0` 且优先使用环境变量端口。

```javascript
// index.js 示例
const http = require('http');

// ⚠️ 必须优先读取环境变量 SERVER_PORT，否则无法被外网访问
const port = process.env.SERVER_PORT || 9552;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello from WispByte Backend! Domain connected.\n');
});

// ⚠️ 必须监听 '0.0.0.0'
server.listen(port, '0.0.0.0', () => {
  console.log(`Server running at port ${port}`);
});
```

### 3\. 启动

  * 进入 **Console** 页面，点击 **Start**。
  * 等待出现 `Server running at port 9552`。

-----

## 第二阶段：域名配置 (DigitalPlat & Cloudflare)

### 1\. Cloudflare 添加站点

1.  登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)。
2.  点击 **Add a site**，输入域名：`darkstarrd.dpdns.org`。
3.  选择 **Free Plan (免费计划)**。
4.  Cloudflare 会分配给你两个 Nameservers (NS)。**根据你的记录，它们是**：
      * `daisy.ns.cloudflare.com`
      * `hal.ns.cloudflare.com`

### 2\. 修改域名 NS 记录

1.  登录 [DigitalPlat 控制台](https://dash.domain.digitalplat.org/)。
2.  找到你的域名 `darkstarrd.dpdns.org`，点击管理/Checkout。
3.  在 **Name Server** 栏位填入上面 Cloudflare 给你的那两个地址。
4.  保存。等待几分钟到几小时生效（收到 Cloudflare 邮件即为生效）。

### 3\. 配置 DNS 解析 (让域名指向服务器)

回到 Cloudflare 的 **DNS -\> Records** 页面，添加记录：

  * **记录类型 (Type)**: `A`
  * **名称 (Name)**: `api` (或者 `backend`，这将生成 `api.darkstarrd.dpdns.org`)
  * **内容 (Content)**: `217.154.212.66` (WispByte 的 IP)
  * **代理状态 (Proxy status)**: **关闭 (DNS Only / 灰色云朵)**
      * *原因：WispByte 使用非标准端口 9552，Cloudflare 代理默认只支持 80/443。开启橙色云朵会导致连接失败。*

-----

## 第三阶段：Cloudflare Worker 开发与部署 (中转层)

这一步是为了解决前端（HTTPS）无法访问后端（HTTP非标端口）的问题，并解决跨域 (CORS) 问题。

### 1\. 本地项目准备

在 VS Code 中打开你的 Worker 项目（`desktop-backend`）。

### 2\. 编写代码 (`src/index.js`)

将后端请求封装在 Worker 中。

```javascript
export default {
  async fetch(request, env, ctx) {
    // ⚠️ 这里填写你刚才在 DNS 里配置的域名 + 端口
    // 不要使用 IP，否则会报错 Error 1003
    const targetUrl = 'http://api.darkstarrd.dpdns.org:9552'; 

    try {
      // 转发请求给后端
      const response = await fetch(targetUrl, {
        method: request.method,
        headers: request.headers
      });

      // 创建新响应，添加 CORS 头，允许前端访问
      const newResponse = new Response(response.body, response);
      newResponse.headers.set("Access-Control-Allow-Origin", "*"); 
      newResponse.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
      
      return newResponse;

    } catch (e) {
      return new Response(`连接后端失败: ${e.message}`, { status: 502 });
    }
  },
};
```

### 3\. 本地测试

在 VS Code 终端运行：

```bash
npm start
# 或 npx wrangler dev
```

按 `B` 打开浏览器测试，如果看到后端返回的 "Hello"，说明链路打通。

### 4\. 发布上线

在 VS Code 终端运行：

```bash
npm run deploy
# 或 npx wrangler deploy
```

获得最终的 Worker URL（如 `https://desktop-backend.yourname.workers.dev`）。

-----

## 第四阶段：前端集成与架构总结

现在你有了一套完整的系统，请按照以下架构进行前端开发：

### 1\. 域名规划 (建议)

利用你的 `darkstarrd.dpdns.org`，在 Cloudflare DNS 里配置不同的前缀：

| 子域名 | 类型 | 指向 (Target) | 用途 |
| :--- | :--- | :--- | :--- |
| `api` | A 记录 | `217.154.212.66` (灰色云朵) | **原始后端** (仅供 Worker 调用) |
| `www` | CNAME | `你的项目.pages.dev` | **前端页面** (用户访问入口) |

### 2\. 前端调用

在你的 Cloudflare Pages (前端代码) 中，**不要**直接 fetch `api.darkstarrd.dpdns.org:9552`。
**应该 fetch 你的 Worker 地址**：
`fetch('https://desktop-backend.yourname.workers.dev')`

-----

## 📅 维护与保号 (重要\!)

1.  **域名续期 (DigitalPlat)**:

      * **规则**：剩余有效期小于 **180天** 时可以免费续期。
      * **当前到期日**：2026年11月30日。
      * **操作时间**：**2026年6月之后**，记得登录 DigitalPlat 点击 Renew。
      * **建议**：设置手机日历提醒。

2.  **主机保活 (WispByte)**:

      * 虽然宣称不删机，但建议每隔几天访问一下你的 Worker 地址，产生一点流量，避免被判定为僵尸账户。

3.  **数据备份**:

      * 免费主机没有 SLA 保障，请务必将代码保存在本地或 GitHub。




**Cloudflare 关键设置**、**自定义域名绑定策略** 以及 **前端 Pages 与 后端 Worker 的协同架构**。

-----

# 📘 全栈免费开发环境搭建指南 (完整版)

**项目目标**：利用免费资源搭建一套完整的 Web 应用环境。
**核心架构**：

  * **域名**：`darkstarrd.dpdns.org` (作为统一入口)
  * **前端**：Cloudflare Pages (绑定 `www` 子域名)
  * **中转/逻辑层**：Cloudflare Worker (绑定 `api` 子域名，解决跨域/HTTPS问题)
  * **原始后端**：WispByte 容器 (运行 Node.js，端口 9552)

-----

## 🛠 第一阶段：后端服务器配置 (WispByte)

### 1\. 部署代码

  * **位置**：WispByte 面板 -\> Files。
  * **核心要求**：必须监听 `0.0.0.0`，且必须优先使用环境变量端口。
  * **参考代码 (`index.js`)**：
    ```javascript
    const http = require('http');
    const port = process.env.SERVER_PORT || 9552; // WispByte 分配的端口

    const server = http.createServer((req, res) => {
      // 简单日志，方便在 Console 看到请求
      console.log(`收到请求: ${req.method} ${req.url}`);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('Hello from WispByte Backend!\n');
    });

    server.listen(port, '0.0.0.0', () => {
      console.log(`Server running at port ${port}`);
    });
    ```

### 2\. 启动配置

  * **位置**：Startup 页面。
  * **命令**：`node index.js`。
  * **操作**：去 Console 点击 **Start**，确保显示 `Server running at port 9552`。

-----

## 🌐 第二阶段：域名接管与基础 DNS

### 1\. 域名注册 (DigitalPlat)

  * **当前域名**：`darkstarrd.dpdns.org`
  * **到期时间**：2026-11-30 (剩余 \<180 天时需登录官网免费续期)。

### 2\. 移交 DNS (DigitalPlat -\> Cloudflare)

  * 在 DigitalPlat 后台，将 **Nameservers** 修改为 Cloudflare 分配的地址：
      * `daisy.ns.cloudflare.com`
      * `hal.ns.cloudflare.com`

-----

## ⚙️ 第三阶段：Cloudflare 关键设置 (必做\!)

**概念说明**：所谓的“免费 CDN”和“免费 SSL”指的就是 Cloudflare 的基础服务。接管域名后，需进行以下配置以适应开发环境。

### 1\. 安全性设置 (Security)

  * **Bot Fight Mode (机器人战斗模式)**：
      * **位置**：Security -\> Bots。
      * **动作**：✅ **开启 (On)**。
      * **理由**：拦截恶意扫描脚本，保护只有 512M 内存的 WispByte 后端不被刷爆。

### 2\. SSL/HTTPS 设置

  * **加密模式**：
      * **位置**：SSL/TLS -\> Overview。
      * **动作**：✅ 选择 **Flexible (灵活)**。
      * **理由**：因为 WispByte 后端没有 SSL 证书 (HTTP)，选 Strict 会导致连接失败。
  * **强制 HTTPS**：
      * **位置**：SSL/TLS -\> Edge Certificates。
      * **动作**：✅ 开启 **Always Use HTTPS**。

### 3\. 性能设置 (Performance)

  * **Speed Optimizations (速度优化/预取)**：
      * **位置**：Speed -\> Optimization。
      * **动作**：❌ **关闭 (Off)**。
      * **理由**：开发调试阶段，为了避免缓存导致代码修改不生效，以及避免“预取功能”对后端发起幽灵请求，建议关闭。

-----

## 🏗️ 第四阶段：架构规划与域名绑定 (核心)

我们将使用 **一个域名，多个前缀** 的策略，让前端和后端共享 Cookie，便于开发。

### 1\. DNS 记录规划表 (Cloudflare -\> DNS -\> Records)

| 子域名 (Name) | 类型 | 指向 (Target) | 代理状态 (Proxy) | 用途 |
| :--- | :--- | :--- | :--- | :--- |
| `origin` | **A** | `217.154.212.66` | **☁️ 灰色 (DNS Only)** | **原始后端直连**。因为 9552 非标准端口，必须关闭 CDN 才能连通。仅供 Worker 调用。 |
| `www` | **CNAME** | (自动生成) | **☁️ 橙色 (Proxied)** | **前端页面**。在 Pages 设置里绑定后自动生成。 |
| `api` | **Worker** | (自动生成) | **☁️ 橙色 (Proxied)** | **后端逻辑接口**。在 Worker 设置里绑定后自动生成。 |

### 2\. 绑定前端 (Cloudflare Pages)

1.  进入 Cloudflare Dashboard -\> **Workers & Pages** -\> 选择你的前端项目。
2.  点击 **Custom domains** -\> **Set up a custom domain**。
3.  输入：`www.darkstarrd.dpdns.org`。
4.  点击 **Activate**。
5.  *注：Pages Functions 依然可用，且拥有同域权限。*

### 3\. 绑定中转层 (Cloudflare Worker)

1.  进入 **Workers & Pages** -\> 选择你的 Worker 项目 (例如 `desktop-backend`)。
2.  点击 **Settings** -\> **Triggers** -\> **Custom Domains**。
3.  点击 **Add Custom Domain**。
4.  输入：`api.darkstarrd.dpdns.org`。
5.  *注：这将成为你前端代码调用的正式接口地址。*

-----

## 💻 第五阶段：Worker 中转代码 (连接前后端)

这是整个链路的桥梁：**前端 (HTTPS) -\> Worker -\> 原始后端 (HTTP:9552)**。

在你的 Worker 项目 (`src/index.js`) 中使用以下代码：

```javascript
export default {
  async fetch(request, env, ctx) {
    // 1. 定义目标：指向我们在 DNS 里设置的“灰色云朵”原始后端记录
    // 格式：http:// + origin子域名 + 端口
    const backendUrl = 'http://origin.darkstarrd.dpdns.org:9552'; 

    try {
      // 2. 转发请求 (Fetch)
      // Worker 允许 HTTPS 环境请求 HTTP 后端，完美解决混合内容问题
      const response = await fetch(backendUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body
      });

      // 3. 处理响应与跨域 (CORS)
      // 虽然同域名下不需要 CORS，但为了保险起见或本地调试，建议保留
      const newResponse = new Response(response.body, response);
      newResponse.headers.set("Access-Control-Allow-Origin", "*"); 
      
      return newResponse;

    } catch (e) {
      return new Response(`Backend Error: ${e.message}`, { status: 502 });
    }
  },
};
```

### 部署 Worker

在本地 VS Code 终端运行：

```bash
npm run deploy
```

-----

## ✅ 最终使用方式

完成以上所有步骤后，你的开发环境如下：

1.  **用户访问前端**：打开 `https://www.darkstarrd.dpdns.org`
2.  **前端代码请求接口**：
    ```javascript
    // 在前端代码中
    fetch('https://api.darkstarrd.dpdns.org/users')
    ```
3.  **数据流向**：
    用户 -\> `api.darkstarrd...` (Cloudflare CDN/SSL) -\> Worker 脚本 -\> `origin.darkstarrd...:9552` (WispByte) -\> 返回数据。
