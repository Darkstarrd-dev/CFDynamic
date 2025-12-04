# 最简 TypeScript 服务器工程指南

## 一、项目结构

```
my-server/
├── src/
│   └── index.ts       # 入口文件
├── package.json       # 项目配置
└── tsconfig.json      # TypeScript 配置
```

---

## 二、初始化步骤

### 1. 创建项目目录

```bash
mkdir my-server
cd my-server
```

### 2. 初始化 package.json

```bash
npm init -y
```

### 3. 安装依赖

```bash
npm install typescript tsx @types/node -D
```

| 依赖 | 作用 |
|------|------|
| `typescript` | TypeScript 编译器 |
| `tsx` | 直接运行 .ts 文件的工具 |
| `@types/node` | Node.js 的类型声明 |

### 4. 初始化 tsconfig.json

```bash
npx tsc --init
```

### 5. 配置 package.json 脚本

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts"
  }
}
```

---

## 三、服务器代码

### src/index.ts

```typescript
import http from "http";

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello World");
});

server.listen(3000, () => {
  console.log("服务器运行在 http://localhost:3000");
});
```

---

## 四、运行项目

```bash
npm run dev
```

访问 `http://localhost:3000` 即可看到响应。

---

## 五、核心概念解析

### 1. http 模块

Node.js 内置模块，用于：
- 创建服务器（接收请求）
- 发送请求（作为客户端）

### 2. createServer 执行流程

```
启动脚本
    ↓
http.createServer(回调函数) → 注册回调，创建实例
    ↓
server.listen(3000) → 开始监听端口
    ↓
等待请求...（回调函数尚未执行）
    ↓
有用户访问
    ↓
Node.js 创建 req 和 res 对象
    ↓
调用回调函数(req, res)
    ↓
执行回调函数内的代码
```

### 3. 代码逐行解析

```typescript
import http from "http";
```
从 Node.js 内置模块中导入 `http`。

---

```typescript
const server = http.createServer((req, res) => {
```
调用 `createServer` 方法创建服务器实例。

参数是一个**回调函数**，此时只是注册，**不会立即执行**。

| 参数 | 类型 | 含义 |
|------|------|------|
| `req` | `IncomingMessage` | 请求对象，包含访问者信息 |
| `res` | `ServerResponse` | 响应对象，用于返回数据 |

---

```typescript
  res.statusCode = 200;
```
设置 HTTP 状态码为 200（表示成功）。

常见状态码：

| 状态码 | 含义 |
|--------|------|
| 200 | 成功 |
| 404 | 未找到 |
| 500 | 服务器错误 |

---

```typescript
  res.setHeader("Content-Type", "text/plain");
```
设置响应头，告诉浏览器返回的是纯文本。

常见 Content-Type：

| 值 | 含义 |
|----|------|
| `text/plain` | 纯文本 |
| `text/html` | HTML 页面 |
| `application/json` | JSON 数据 |

---

```typescript
  res.end("Hello World");
```
发送响应内容并**结束本次响应**。

`end()` 必须调用，否则浏览器会一直等待。

---

```typescript
});
```
回调函数结束。

---

```typescript
server.listen(3000, () => {
```
让服务器开始监听 3000 端口。

第二个参数是**可选的回调函数**，监听成功后执行。

---

```typescript
  console.log("服务器运行在 http://localhost:3000");
});
```
在终端打印提示信息，表示服务器已启动。

---

### 4. req 对象（请求信息）

由**浏览器自动生成**，我们只需读取：

| 属性 | 含义 | 示例 |
|------|------|------|
| `req.url` | 请求路径 | `"/about"` |
| `req.method` | 请求方法 | `"GET"` |
| `req.headers` | 请求头 | `{ host: "localhost:3000" }` |

### 5. res 对象（响应工具）

由**Node.js 提供**，我们用来返回数据：

| 方法/属性 | 作用 |
|-----------|------|
| `res.statusCode` | 设置状态码 |
| `res.setHeader()` | 设置响应头 |
| `res.end()` | 发送响应内容并结束 |

---

## 六、请求响应流程图

```
浏览器                              Node.js 服务器
  │                                       │
  │   GET http://localhost:3000/about     │
  │ ─────────────────────────────────────>│
  │   (浏览器自动携带请求信息)               │
  │                                       │
  │                                创建 req 对象
  │                                创建 res 对象
  │                                调用回调函数
  │                                       │
  │            HTTP 200 "About"           │
  │ <─────────────────────────────────────│
  │                                       │
```

---

## 七、实际开发建议

原生 http 模块写法较为繁琐，实际项目中推荐使用框架：

| 用途 | 推荐工具 |
|------|----------|
| 创建服务器 | Hono / Express |
| 发送请求 | fetch / axios |

---

## 八、常用命令汇总

| 命令 | 作用 |
|------|------|
| `npm init -y` | 初始化 package.json |
| `npm install xxx -D` | 安装开发依赖 |
| `npx tsc --init` | 初始化 tsconfig.json |
| `npm run dev` | 运行开发脚本 |
