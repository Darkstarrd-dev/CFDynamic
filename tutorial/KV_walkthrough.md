这是为您更新后的 **Cloudflare KV & Pages Functions 全栈开发指南 (v6.0)**。

本次更新在 **第 3 章：开发工具与配置** 中，在 **3.1 绑定** 之后新增了 **3.2 查询项目列表**，详细说明了如何在命令行中查看 Pages 和 Workers 项目，后续小节序号已顺延。

-----

# Cloudflare KV & Pages Functions 全栈开发指南 (v6.0)

**学习目标：** 掌握 Cloudflare Pages Functions（无服务器后端）与 Workers KV（键值数据库）的结合使用，精通 Wrangler 高级用法，能够处理复杂 JSON 数据及环境问题。

-----

## 1\. 核心机制与适用场景

### 1.1 KV 的本质

KV 不是传统的关系型数据库（如 MySQL），而是一个**分布在全球的、巨大的字典**。

  * **结构：** 只有 Key（键）和 Value（值）。
  * **核心特性：** **最终一致性 (Eventual Consistency)**。
      * *比喻：* 像全球 300 个教室的黑板。在一个教室写字，同步到其他教室需要时间（约 60 秒）。
      * *结果：* 写入后，其他地区的用户可能在短时间内读到旧数据。

### 1.2 适用性判断

| 适合场景 (✅) | 不适合场景 (❌) |
| :--- | :--- |
| **读多写少** | **写多读少** / **高频写入** |
| 网站配置、文章内容、重定向规则 | 实时库存扣减、银行转账 |
| 用户存档（非实时）、缓存 | 实时在线人数计数器 |

-----

## 2\. 架构限制与成本 (Free Tier)

**重要：** 架构设计必须基于“天花板”来考虑。

### 2.1 免费版额度 (每天)

  * **读取 (Read):** 100,000 次 (非常宽裕)
  * **写入 (Write):** **1,000 次** (非常紧张 ⚠️)
  * **删除 (Delete):** 1,000 次
  * **列出 (List):** 1,000 次

### 2.2 物理限制 (钱解决不了的)

  * **写入频率：** 同一个 Key 每秒只能写 1 次。
  * **Key 长度：** 512 Bytes。
  * **Value 大小：** 25 MB。
  * **不支持：** 复杂查询（如 SQL `WHERE`），也不支持通过 Value 反查 Key。

### 2.3 应对策略 (破局之道)

  * **自动过期 (TTL)：** 既然删除也消耗额度，就在写入时设置 **TTL (Time To Live)**，让数据到期自动消失，不消耗删除额度。
    ```javascript
    await context.env.MY_KV.put(key, value, { expirationTtl: 5184000 });
    ```
  * **反向索引：** 若需通过 Email 查用户，需建立组合键索引：`Key: "index_Email_Username"`, `Value: "UserID"`。

-----

## 3\. 开发工具与配置 (Wrangler)

### 3.1 绑定 (Binding)：代码如何找到数据库

绑定是连接代码变量（`MY_KV`）与真实数据库 ID 的桥梁。

**方式 A：使用 `wrangler.toml` (推荐 ✅)**
适用于本地开发与自动部署，保证环境一致性。

```toml
# wrangler.toml
name = "my-project"
[[kv_namespaces]]
binding = "MY_KV"      # 代码里用的变量名
id = "xxxxxxxxxxxxx"   # KV 的真实 ID (通过创建指令获取)
```

### 3.2 [新增] 查询项目列表

在 Monorepo 或多项目管理中，确认当前账号下的资源名称。

  * **列出 Pages 项目 (网页/全栈):**
    此指令会列出所有已部署的 Pages 项目名称、生产环境域名及 Git 状态。

    ```bash
    npx wrangler pages project list
    ```

  * **列出 Workers 项目 (纯后端):**
    Wrangler 对 Workers 的管理是基于当前目录的，全局列表支持较弱。

      * **查看当前项目历史:** `npx wrangler deployments list` (查看当前 Worker 部署记录)
      * **查看当前登录账号:** `npx wrangler whoami` (确认 Account Name 和 ID)
      * **建议:** 查看所有 Worker 列表，建议直接访问 Cloudflare Dashboard 网页端。

### 3.3 命令行管理 (CLI) - 基础操作

不运行代码，直接以管理员身份操作数据库。

  * **创建新 KV 库：** `npx wrangler kv:namespace create "库的名字"` (旧版语法)
  * **删除 KV 库 (高危):** `npx wrangler kv:namespace delete --namespace-id <ID>`
  * **列出所有库：** `npx wrangler kv:namespace list`
  * **写入数据：** `npx wrangler kv:key put --binding MY_KV "key" "value"`
  * **读取数据：** `npx wrangler kv:key get --binding MY_KV "key"`
  * **删除数据：** `npx wrangler kv:key delete --binding MY_KV "key"`
  * **列出数据 (List):** `npx wrangler kv:key list --binding MY_KV`
      * ⚠️ **分页注意：** 命令行模式**不是**交互式的。要查看下一页，必须手动复制上一页结果中的 `cursor` 字符串，并使用 `--cursor "xxxx"` 参数再次运行命令。

### 3.4 Wrangler 版本语法差异

Wrangler 在不同版本中对指令格式有不同的要求，混用可能导致 `Unknown arguments` 错误。

| 特性 | **旧版语法 (v1/v2)** | **新版语法 (v3/v4+)** | 备注 |
| :--- | :--- | :--- | :--- |
| **分隔符** | **冒号 (`:`)** | **空格 (`     `)** | 这是最大的区别 |
| **指令示例** | `kv:namespace create` | `kv namespace create` | 新版推荐写法 |
| **指令示例** | `kv:key put` | `kv key put` | |
| **现状** | 仍然被大量文档引用 | 官方推荐，更加标准 | 遇到冒号报错时，请改为空格 |

-----

### 3.5 高级 CLI 操作：JSON 数据的读写

KV 本质上存储的是**字符串**。要在 CLI 中直接操作 JSON，需要注意 Shell 的转义规则。

#### **A. 写入 JSON (Put)**

**痛点：** JSON 内部含有双引号 `"`，直接在命令行输入容易被 Shell 解析错误。

  * **方法 1：使用单引号 (Linux/macOS/PowerShell)**
    推荐做法。用单引号 `'` 包裹整个 JSON 字符串，通常不需要转义内部的双引号。

    ```bash
    npx wrangler kv key put --binding ApiSecret freeAPI '{"name":["cherry","zed"],"endpoint":["https://api.a4f.co"]}'
    ```

  * **方法 2：从文件读取 (Windows CMD / 复杂长 JSON)** ✅ **最稳妥**
    如果 JSON 很长或包含特殊字符，建议先存入文件，再通过指令读取。

    ```bash
    # 1. 先创建文件 data.json
    # 2. 运行指令 (Unix/PowerShell)
    npx wrangler kv key put --binding ApiSecret freeAPI "$(cat data.json)"

    # Windows CMD 用户推荐直接用 type 管道或文件重定向方式
    ```

#### **B. 读取并解析 JSON (Get)**

**痛点：** `get` 命令输出的是原生字符串，阅读体验差。

  * **Linux / macOS (使用 `jq`):**
    ```bash
    npx wrangler kv key get --binding ApiSecret freeAPI | jq
    ```
  * **Windows PowerShell (使用 `ConvertFrom-Json`):**
    ```powershell
    npx wrangler kv key get --binding ApiSecret freeAPI | ConvertFrom-Json | ConvertTo-Json -Depth 10
    ```

-----

### 3.6 故障排查：JSON 解析报错 "Unexpected character"

**现象：**
在 PowerShell 中运行解析命令时报错：
`ConvertFrom-Json: Conversion from JSON failed with error: Unexpected character encountered while parsing value: P.`

**原因：**
Wrangler 在输出 JSON 数据之前，输出了额外的日志信息（例如 `Proxy environment variables detected...`）。这些非 JSON 的文本也被管道（Pipe）传给了 JSON 解析器，导致解析失败。

**解决方案：**

**方案 1：跳过日志行 (Skip)**
如果日志只在第一行，可以手动跳过。

```powershell
(npx wrangler kv key get --binding ApiSecret freeAPI | Select-Object -Skip 1) -join "`n" | ConvertFrom-Json
```

**方案 2：正则提取 (推荐)**
只提取以 `{` 或 `[` 开头的行，过滤掉所有日志干扰。

```powershell
$json = npx wrangler kv key get --binding ApiSecret freeAPI | Where-Object { $_ -match '^\s*[\{\[]' } | Out-String
$json | ConvertFrom-Json
```

**方案 3：文件中转**
先把输出（包含脏日志）写入文件，手动或脚本清理后再解析。

```powershell
npx wrangler kv key get --binding ApiSecret freeAPI > out.json
# 然后读取 out.json 内容进行处理
```

-----

## 4\. 后端开发：Pages Functions (Middleware)

**核心作用：** 充当“保镖”。前端请求后端，后端验证后操作数据库。

### 4.1 常用接口代码实现

**(前提：必须已在 `wrangler.toml` 配置好 `binding = "MY_KV"`)**

#### **1. 写入 (Put)**

```javascript
// functions/api/add.js
export async function onRequestPost(context) {
    const body = await context.request.json();
    await context.env.MY_KV.put(body.key, body.value);
    return new Response("保存成功");
}
```

#### **2. 读取 (Get)**

```javascript
// functions/api/get.js
export async function onRequest(context) {
    const url = new URL(context.request.url);
    const value = await context.env.MY_KV.get(url.searchParams.get("key"));
    return value ? new Response(value) : new Response("没找到", {status: 404});
}
```

#### **3. 删除 (Delete)**

```javascript
// functions/api/del.js
export async function onRequestDelete(context) {
    const url = new URL(context.request.url);
    await context.env.MY_KV.delete(url.searchParams.get("key"));
    return new Response("已删除");
}
```

#### **4. 列出 (List)**

```javascript
// functions/api/list.js
export async function onRequest(context) {
  // ⚠️ 注意：数据量大时需将 cursor 返回给前端，实现翻页
  const list = await context.env.MY_KV.list();
  return new Response(JSON.stringify(list));
}
```

-----

## 5\. 前端调用示例 (index.html)

前端 HTML **不直接连接 KV**，而是通过 `fetch` 调用上面的后端接口。

```javascript
// 写入
await fetch('/api/add', { method: 'POST', body: JSON.stringify({ key: "u1", value: "v1" }) });

// 读取
const res = await fetch('/api/get?key=u1');

// 删除
await fetch('/api/del?key=u1', { method: 'DELETE' });
```

-----

## 6\. 架构核心：为什么必须经过后端？

**❌ 错误做法：前端直接连接 KV**
有些开发者试图在前端 JS 中直接使用 `fetch` 调用 Cloudflare API 读写数据。

**⚠️ 致命风险：**

1.  **Token 裸奔：** 为了调用 API，必须在前端代码 Header 里写 `Authorization: Bearer <API_TOKEN>`。任何用户只要“查看网页源代码”或打开控制台 Network 面板，就能拿到你的 Token，进而**控制甚至清空你的数据库**。
2.  **CORS 拦截：** 浏览器会拦截从前端域名（如 `mygame.com`）发往管理 API（`api.cloudflare.com`）的跨域请求，导致调用失败。

**✅ 正确架构：Pages Functions 充当“中间人”**

1.  **用户** 向 **后端 (Pages Functions)** 发起请求（无需携带数据库 Token）。
2.  **后端** 运行在服务器内部，持有隐形的、安全的 Token（Binding）。
3.  **后端** 验证请求合法性后，代理操作 KV 数据库，并将结果返回给用户。

**结论：** 凡是涉及 Token、密钥、密码的操作，**必须**且**只能**在后端完成。前端对用户是完全透明的，藏不住任何秘密。

-----

## 7\. 其他安全与部署

### 7.1 GitHub 安全性

  * **`wrangler.toml`** 可以安全提交。里面的 `ID` 只是“门牌号”。
  * **API Token** 绝对不要提交。它是“钥匙”，应存在本地或 GitHub Secrets 中。

### 7.2 翻页体验策略

  * **后端：** 不要用 `while` 循环遍历所有数据（会超时）。
  * **前端：** 采用“点击加载更多”的方式，将 `cursor` 传给后端获取下一页。

-----

## 8\. 常用术语速查

  * **Binding (绑定):** 变量名到数据库 ID 的映射。
  * **TTL (Time To Live):** 数据生存时间，到期自动删除。
  * **Serialize (序列化):** 对象 -\> 字符串 (`JSON.stringify`)。
  * **Parse (解析):** 字符串 -\> 对象 (`JSON.parse`)。
  * **Monorepo:** 前后端代码在同一个仓库中管理（如 `backend/` 和 `frontend/` 同级）。
  * **Eventual Consistency (最终一致性):** 写入不一定立即可读，需等待全球同步。
