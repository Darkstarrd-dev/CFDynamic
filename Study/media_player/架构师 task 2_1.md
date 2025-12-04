# 架构师 task 2.1

## 🧑‍💻 User

你是架构师，负责一个前后端分离的图片视频浏览器项目的整体设计和任务规划。

## 你的职责

1. 设计模块化、低耦合的系统架构
2. 将项目拆解为独立的功能模块
3. 将每个模块拆解为原子任务（每个任务改动不超过2-3个文件）
4. 为每个任务定义明确的验收标准
5. 设计模块之间的接口
6. 根据我的执行反馈调整计划

## 你的约束

- 每个原子任务必须能独立完成和测试
- 优先保证模块独立性，宁可有少量重复代码也不要紧耦合
- 考虑到我会频繁清空AI上下文，所有设计决策必须记录在文档中 (/docs/project-summary.md)
- 文档仅更新必要片段，给出上下文以便定位
- 每个任务给出完整代码和验收标准

## 输出格式要求

- 架构设计用Markdown文档形式
- 任务清单用checklist形式，包含验收标准
- 模块接口用TypeScript类型声明

## 项目当前状态

后端已全部完成（阶段0和阶段1），现在开始前端开发（阶段2）。

技术栈：
- 前端：原生TypeScript + HTML + CSS，不用框架
- 使用esbuild打包
- 共享类型定义在 @media-browser/shared

=== docs/project-summary.md ===
# 媒体浏览器项目文档

> 最后更新: Task 1.7 完成后
> 当前阶段: 后端开发完成，即将开始前端开发

---

## 1. 项目架构概览

### 1.1 项目简介

基于网页的本地图片和视频浏览器，前后端分离架构，支持缩略图预览和分页浏览。

### 1.2 目录结构

```
media-browser/
├── package.json                 # 根目录，workspace配置
├── .gitignore
├── docs/
│   └── project-summary.md       # 项目文档（本文件）
├── shared/                      # 前后端共享代码
│   ├── package.json
│   ├── tsconfig.json
│   └── types.ts                 # 共享类型定义
├── server/                      # 后端
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts             # 服务器入口
│       ├── api/                 # API路由层
│       │   ├── index.ts         # 路由注册和公共函数
│       │   ├── media.ts         # 媒体列表API
│       │   ├── thumbnail.ts     # 缩略图API
│       │   └── file.ts          # 原始文件API
│       ├── services/            # 业务逻辑层
│       │   ├── file-scanner.ts  # 文件扫描服务
│       │   └── thumbnail-generator.ts  # 缩略图生成服务
│       └── utils/
│           └── mime-types.ts    # MIME类型工具
└── client/                      # 前端
    ├── package.json
    ├── tsconfig.json
    ├── index.html
    └── src/
        ├── index.ts             # 前端入口（待实现）
        ├── api/                 # API客户端（待实现）
        ├── components/          # UI组件（待实现）
        └── styles/
            └── main.css         # 样式文件（待实现）
```

### 1.3 模块划分及职责

#### 后端模块

| 模块 | 文件 | 职责 |
|------|------|------|
| **shared** | `shared/types.ts` | 前后端共享的TypeScript类型定义 |
| **api** | `server/src/api/*` | HTTP路由，请求解析，响应格式化 |
| **file-scanner** | `server/src/services/file-scanner.ts` | 扫描目录，过滤媒体文件，返回文件信息 |
| **thumbnail** | `server/src/services/thumbnail-generator.ts` | 生成图片/视频缩略图 |
| **utils** | `server/src/utils/mime-types.ts` | MIME类型判断工具 |

#### 前端模块（待实现）

| 模块 | 文件 | 职责 |
|------|------|------|
| **api-client** | `client/src/api/client.ts` | 封装后端API调用 |
| **path-input** | `client/src/components/path-input.ts` | 路径输入组件 |
| **gallery** | `client/src/components/gallery.ts` | 缩略图网格展示 |
| **lightbox** | `client/src/components/lightbox.ts` | 全屏预览组件 |
| **pagination** | `client/src/components/pagination.ts` | 分页控制组件 |

### 1.4 技术栈

| 层级 | 技术选型 | 说明 |
|------|----------|------|
| **前端** | 原生TypeScript + HTML/CSS | 不使用框架，保持轻量 |
| **后端** | Node.js + TypeScript | 使用原生http模块 |
| **图片处理** | sharp | 高性能图片缩放裁切 |
| **视频处理** | fluent-ffmpeg + FFmpeg | 视频帧提取 |
| **构建工具** | esbuild | 前端打包 |
| **包管理** | npm workspaces | monorepo管理 |

---

## 2. 已完成的任务清单

### 阶段0：项目初始化

| 任务 | 描述 | 状态 |
|------|------|------|
| Task 0.1 | 创建项目结构和配置文件 | ✅ 完成 |
| Task 0.2 | 创建共享类型定义 | ✅ 完成 |

### 阶段1：后端核心

| 任务 | 描述 | 状态 |
|------|------|------|
| Task 1.1 | 实现HTTP服务器骨架 | ✅ 完成 |
| Task 1.2 | 实现文件扫描服务 | ✅ 完成 |
| Task 1.3 | 实现媒体列表API | ✅ 完成 |
| Task 1.4 | 实现图片缩略图生成 | ✅ 完成 |
| Task 1.5 | 实现视频缩略图生成 | ✅ 完成 |
| Task 1.6 | 实现缩略图API | ✅ 完成 |
| Task 1.7 | 实现原始文件API | ✅ 完成 |

### 阶段2：前端核心（待开始）

| 任务 | 描述 | 状态 |
|------|------|------|
| Task 2.1 | 创建HTML骨架和入口 | ⏳ 待开始 |
| Task 2.2 | 实现API客户端 | ⏳ 待开始 |
| Task 2.3 | 实现路径输入组件 | ⏳ 待开始 |
| Task 2.4 | 实现缩略图网格组件 | ⏳ 待开始 |
| Task 2.5 | 实现分页组件 | ⏳ 待开始 |
| Task 2.6 | 实现灯箱组件（图片） | ⏳ 待开始 |
| Task 2.7 | 扩展灯箱组件（视频） | ⏳ 待开始 |
| Task 2.8 | 整合所有组件 | ⏳ 待开始 |

### 阶段3：完善（待开始）

| 任务 | 描述 | 状态 |
|------|------|------|
| Task 3.1 | 添加加载状态和错误处理UI | ⏳ 待开始 |
| Task 3.2 | 缩略图懒加载 | ⏳ 待开始 |

---

## 3. 后端API接口汇总

### 3.1 接口列表

| 方法 | 路径 | 功能 | 参数 |
|------|------|------|------|
| GET | `/api/health` | 健康检查 | 无 |
| GET | `/api/media` | 获取媒体列表 | path, page, pageSize |
| GET | `/api/thumbnail` | 获取缩略图 | path |
| GET | `/api/file` | 获取原始文件 | path |

### 3.2 接口详细说明

#### GET /api/health

健康检查接口。

**请求参数**: 无

**成功响应**:
```json
{
  "status": "ok",
  "timestamp": "2025-12-03T14:00:00.000Z"
}
```

---

#### GET /api/media

获取指定目录的媒体文件列表（分页）。

**请求参数**:

| 参数 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| path | string | 是 | - | 文件夹绝对路径 |
| page | number | 否 | 1 | 页码，从1开始 |
| pageSize | number | 否 | 50 | 每页数量，最大200 |

**成功响应**:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "name": "photo.jpg",
        "path": "X:\\TestFolder\\photo.jpg",
        "type": "image",
        "size": 25420,
        "modifiedAt": "2025-11-26T11:33:13.957Z"
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 50,
    "totalPages": 2
  }
}
```

**错误响应**:

| 状态码 | 错误信息 | 说明 |
|--------|----------|------|
| 400 | Missing required parameter: path | 缺少path参数 |
| 400 | Path is not a directory | 路径不是目录 |
| 404 | Directory not found | 目录不存在 |
| 403 | Permission denied | 无权限访问 |

---

#### GET /api/thumbnail

获取指定文件的缩略图（200x200 JPEG）。

**请求参数**:

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| path | string | 是 | 文件绝对路径 |

**成功响应**:
- Content-Type: `image/jpeg`
- Body: 缩略图二进制数据
- Cache-Control: `public, max-age=86400`

**错误响应**:

| 状态码 | 错误信息 | 说明 |
|--------|----------|------|
| 400 | Missing required parameter: path | 缺少path参数 |
| 400 | Unsupported file type | 不支持的文件类型 |
| 404 | File not found | 文件不存在 |
| 500 | FFmpeg not found | FFmpeg未安装（视频） |

---

#### GET /api/file

获取原始媒体文件（支持Range请求）。

**请求参数**:

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| path | string | 是 | 文件绝对路径 |

**请求头**（可选）:
- `Range`: 如 `bytes=0-1023`

**成功响应**（完整文件）:
- 状态码: 200
- Content-Type: 根据文件类型
- Accept-Ranges: bytes
- Cache-Control: `public, max-age=86400`

**成功响应**（Range请求）:
- 状态码: 206
- Content-Type: 根据文件类型
- Content-Range: `bytes 0-1023/25420`
- Accept-Ranges: bytes

**错误响应**:

| 状态码 | 错误信息 | 说明 |
|--------|----------|------|
| 400 | Missing required parameter: path | 缺少path参数 |
| 400 | Unsupported file type | 不支持的文件类型 |
| 404 | File not found | 文件不存在 |
| 403 | Permission denied | 无权限访问 |
| 416 | - | 无效的Range请求 |

---

## 4. 共享类型定义汇总

### 4.1 媒体类型

```typescript
/** 媒体文件类型 */
type MediaType = 'image' | 'video';

/** 支持的图片扩展名 */
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'] as const;

/** 支持的视频扩展名 */
const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mkv', '.avi', '.mov'] as const;
```

### 4.2 媒体文件信息

```typescript
/** 单个媒体文件信息 */
interface MediaItem {
  /** 文件名（含扩展名，不含路径） */
  name: string;
  /** 文件完整路径 */
  path: string;
  /** 媒体类型 */
  type: MediaType;
  /** 文件大小（字节） */
  size: number;
  /** 修改时间（ISO 8601 字符串） */
  modifiedAt: string;
}
```

### 4.3 分页类型

```typescript
/** 分页请求参数 */
interface PaginationParams {
  /** 页码，从 1 开始 */
  page: number;
  /** 每页数量 */
  pageSize: number;
}

/** 分页响应数据 */
interface PaginatedResponse<T> {
  /** 当前页的数据项 */
  items: T[];
  /** 总数据量 */
  total: number;
  /** 当前页码 */
  page: number;
  /** 每页数量 */
  pageSize: number;
  /** 总页数 */
  totalPages: number;
}
```

### 4.4 API响应类型

```typescript
/** API 成功响应 */
interface ApiSuccessResponse<T> {
  success: true;
  data: T;
}

/** API 错误响应 */
interface ApiErrorResponse {
  success: false;
  error: string;
}

/** API 响应（联合类型） */
type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
```

### 4.5 工具函数

```typescript
/** 根据文件扩展名判断媒体类型 */
function getMediaType(filename: string): MediaType | null;

/** 判断文件是否为支持的媒体文件 */
function isMediaFile(filename: string): boolean;
```

---

## 5. 重要技术决策记录

### 5.1 使用原生http模块而非Express

**决策**: 使用Node.js原生`http`模块实现服务器

**原因**:
- 项目需求明确要求"尽量少用第三方依赖"
- API接口简单，仅4个GET接口
- 原生模块足够满足需求，无需框架额外功能

**影响**:
- 需要手动实现路由匹配
- 需要手动解析URL参数
- 代码量略多但更可控

---

### 5.2 Node.js实验性类型剥离的限制

**问题**: Node.js 22的`--experimental-strip-types`功能有以下限制：

1. **不支持TypeScript参数属性语法**
```typescript
   // ❌ 不支持
   constructor(public readonly code: string) {}
 
   // ✅ 需要改写为
   public readonly code: string;
   constructor(code: string) {
     this.code = code;
   }
   ```

2. **命名导入类型可能失败**
   ```typescript
   // ❌ 可能报错
   import { MediaItem, ApiResponse } from '@media-browser/shared/types';
 
   // ✅ 使用命名空间导入
   import * as shared from '@media-browser/shared/types';
   const item: shared.MediaItem = { ... };
   ```

**解决方案**:
- 避免使用参数属性语法
- 统一使用命名空间导入方式引用shared模块

---

### 5.3 TypeScript项目配置

**问题**: 跨workspace引用shared模块时的配置问题

**解决方案**:
- 移除`rootDir`限制
- 在`include`中添加`../shared/**/*`
- 设置`noEmit: true`（使用esbuild/node直接运行）
- 在shared的`package.json`中配置`exports`

**最终配置** (`server/tsconfig.json`):
```json
{
"compilerOptions": {
 "target": "ES2022",
 "module": "NodeNext",
 "moduleResolution": "NodeNext",
 "esModuleInterop": true,
 "strict": true,
 "skipLibCheck": true,
 "declaration": false,
 "resolveJsonModule": true,
 "noEmit": true,
 "allowImportingTsExtensions": true
},
"include": ["src/**/*", "../shared/**/*"]
}
```

---

### 5.4 shared模块的包配置

**问题**: Node.js无法正确解析shared模块的导出

**解决方案** (`shared/package.json`):
```json
{
"name": "@media-browser/shared",
"version": "1.0.0",
"private": true,
"type": "module",
"exports": {
 "./types": {
 "types": "./types.ts",
 "default": "./types.ts"
 }
}
}
```

---

### 5.5 端口占用问题

**问题**: 开发时频繁出现`EADDRINUSE: address already in use`

**原因**: 之前的Node.js进程未正确关闭

**解决方案**:
```powershell
# 查找占用端口的进程
netstat -ano | findstr :3000

# 关闭进程
taskkill /PID <进程ID> /F
```

---

### 5.6 Windows符号链接与版本控制

**问题**: jj（版本控制工具）无法读取npm workspaces创建的符号链接

**解决方案**: 创建`.gitignore`文件忽略`node_modules`：
```gitignore
node_modules/
dist/
*.log
```

---

## 6. 开发命令速查

### 启动后端开发服务器
```bash
cd server
npm run dev
# 或从根目录
npm run dev:server
```

### 构建前端
```bash
cd client
npm run build
# 或从根目录
npm run build --workspace=client
```

### TypeScript类型检查
```bash
npx tsc --noEmit
```

### 安装依赖
```bash
# 根目录执行，安装所有workspace依赖
npm install
```

---

## 7. 下一步计划

开始阶段2：前端核心开发

1. Task 2.1: 创建HTML骨架和入口
2. Task 2.2: 实现API客户端
3. Task 2.3: 实现路径输入组件
4. Task 2.4: 实现缩略图网格组件
5. Task 2.5: 实现分页组件
6. Task 2.6: 实现灯箱组件（图片）
7. Task 2.7: 扩展灯箱组件（视频）
8. Task 2.8: 整合所有组件


以下是后端已实现的API接口和index.ts代码，前端需要调用这些接口：

=== server/src/index.ts ===
import { createServer } from 'node:http';
import { handleRequest, setupRoutes } from './api/index.ts';

const PORT = 3000;
const HOST = 'localhost';

// 注册路由
setupRoutes();

// 创建服务器
const server = createServer((req, res) => {
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

if (req.method === 'OPTIONS') {
 res.writeHead(204);
 res.end();
 return;
}

handleRequest(req, res).catch((error) => {
 console.error('Unhandled error:', error);
 res.writeHead(500, { 'Content-Type': 'application/json' });
 res.end(JSON.stringify({ success: false, error: 'Internal server error' }));
});
});

server.listen(PORT, HOST, () => {
console.log(`Server running at http://${HOST}:${PORT}`);
console.log('Available endpoints:');
console.log(` GET http://${HOST}:${PORT}/api/health`);
console.log(` GET http://${HOST}:${PORT}/api/media?path=<dirPath>&page=1&pageSize=50`);
console.log(` GET http://${HOST}:${PORT}/api/thumbnail?path=<filePath>`);
console.log(` GET http://${HOST}:${PORT}/api/file?path=<filePath>`);
});

=== server/src/api/index.ts ===
import { IncomingMessage, ServerResponse } from 'node:http';
import { getMediaList } from './media.ts';
import { getThumbnail } from './thumbnail.ts';
import { getFile } from './file.ts';

/** 路由处理函数类型 */
export type RouteHandler = (
req: IncomingMessage,
res: ServerResponse,
params: URLSearchParams
) => Promise<void> | void;

/** 路由表类型 */
interface Route {
method: string;
pattern: string;
handler: RouteHandler;
}

/** 已注册的路由列表 */
const routes: Route[] = [];

/**
 * 注册路由
*/
export function registerRoute(method: string, pattern: string, handler: RouteHandler): void {
routes.push({ method: method.toUpperCase(), pattern, handler });
}

/**
 * 发送 JSON 响应
*/
export function sendJson(res: ServerResponse, data: unknown, statusCode: number = 200): void {
res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
res.end(JSON.stringify(data));
}

/**
 * 发送错误响应
*/
export function sendError(res: ServerResponse, message: string, statusCode: number = 500): void {
sendJson(res, { success: false, error: message }, statusCode);
}

/**
 * 处理请求的主路由函数
*/
export async function handleRequest(req: IncomingMessage, res: ServerResponse): Promise<void> {
const url = new URL(req.url || '/', `http://${req.headers.host}`);
const method = req.method?.toUpperCase() || 'GET';
const pathname = url.pathname;
const params = url.searchParams;

// 查找匹配的路由
for (const route of routes) {
 if (route.method === method && route.pattern === pathname) {
 try {
 await route.handler(req, res, params);
 return;
 } catch (error) {
 console.error('Route handler error:', error);
 sendError(res, 'Internal server error', 500);
 return;
 }
 }
}

// 未匹配到路由
sendError(res, 'Not found', 404);
}

/**
 * 注册所有 API 路由
*/
export function setupRoutes(): void {
// 健康检查
registerRoute('GET', '/api/health', (_req, res) => {
 sendJson(res, { status: 'ok', timestamp: new Date().toISOString() });
});

// 媒体列表
registerRoute('GET', '/api/media', getMediaList);

// 缩略图
registerRoute('GET', '/api/thumbnail', getThumbnail);

// 原始文件
registerRoute('GET', '/api/file', getFile);
}

=== server/src/api/media.ts ===
import { IncomingMessage, ServerResponse } from 'node:http';
import { sendJson, sendError } from './index.ts';
import { scanDirectorySorted, ScanError } from '../services/file-scanner.ts';
import * as shared from '@media-browser/shared/types';

/**
 * GET /api/media
 * 获取指定目录的媒体文件列表（分页）
*
 * Query 参数:
 * - path: 文件夹绝对路径（必需）
 * - page: 页码，从1开始（默认1）
 * - pageSize: 每页数量（默认50）
*/
export async function getMediaList(
_req: IncomingMessage,
res: ServerResponse,
params: URLSearchParams
): Promise<void> {
// 解析参数
const dirPath = params.get('path');
const page = parseInt(params.get('page') || '1', 10);
const pageSize = parseInt(params.get('pageSize') || '50', 10);

// 验证必需参数
if (!dirPath) {
 sendError(res, 'Missing required parameter: path', 400);
 return;
}

// 验证分页参数
if (isNaN(page) || page < 1) {
 sendError(res, 'Invalid parameter: page must be a positive integer', 400);
 return;
}

if (isNaN(pageSize) || pageSize < 1 || pageSize > 200) {
 sendError(res, 'Invalid parameter: pageSize must be between 1 and 200', 400);
 return;
}

// 扫描目录
let allItems: shared.MediaItem[];
try {
 allItems = await scanDirectorySorted(dirPath);
} catch (error) {
 if (error instanceof ScanError) {
 const statusCode = error.code === 'NOT_FOUND' ? 404
 : error.code === 'NOT_DIRECTORY' ? 400
 : error.code === 'PERMISSION_DENIED' ? 403
 : 500;
 sendError(res, error.message, statusCode);
 return;
 }
 throw error;
}

// 计算分页
const total = allItems.length;
const totalPages = Math.ceil(total / pageSize);
const startIndex = (page - 1) * pageSize;
const endIndex = startIndex + pageSize;
const items = allItems.slice(startIndex, endIndex);

// 构造响应
const response: shared.ApiResponse<shared.PaginatedResponse<shared.MediaItem>> = {
 success: true,
 data: {
 items,
 total,
 page,
 pageSize,
 totalPages,
 },
};

sendJson(res, response);
}


=== server/src/api/thumbnail.ts ===
import { IncomingMessage, ServerResponse } from 'node:http';
import { sendError } from './index.ts';
import { generateThumbnail, ThumbnailError } from '../services/thumbnail-generator.ts';
import * as shared from '@media-browser/shared/types';

/**
 * GET /api/thumbnail
 * 获取指定文件的缩略图
*
 * Query 参数:
 * - path: 文件绝对路径（必需）
*/
export async function getThumbnail(
_req: IncomingMessage,
res: ServerResponse,
params: URLSearchParams
): Promise<void> {
// 解析参数
const filePath = params.get('path');

// 验证必需参数
if (!filePath) {
 sendError(res, 'Missing required parameter: path', 400);
 return;
}

// 判断媒体类型
const mediaType = shared.getMediaType(filePath);
if (mediaType === null) {
 sendError(res, 'Unsupported file type', 400);
 return;
}

// 生成缩略图
try {
 const thumbnail = await generateThumbnail(filePath, mediaType);

 // 返回图片
 res.writeHead(200, {
 'Content-Type': 'image/jpeg',
 'Content-Length': thumbnail.length,
 'Cache-Control': 'public, max-age=86400', // 缓存24小时
 });
 res.end(thumbnail);
} catch (error) {
 if (error instanceof ThumbnailError) {
 const statusCode = error.code === 'NOT_FOUND' ? 404
 : error.code === 'FFMPEG_NOT_FOUND' ? 500
 : error.code === 'UNSUPPORTED_FORMAT' ? 400
 : 500;
 sendError(res, error.message, statusCode);
 return;
 }
 throw error;
}
}


=== server/src/api/file.ts ===
import { IncomingMessage, ServerResponse } from 'node:http';
import * as fs from 'node:fs';
import * as fsPromises from 'node:fs/promises';
import { sendError } from './index.ts';
import { getMimeType } from '../utils/mime-types.ts';
import * as shared from '@media-browser/shared/types';

/**
 * GET /api/file
 * 获取原始媒体文件（支持 Range 请求）
*
 * Query 参数:
 * - path: 文件绝对路径（必需）
*/
export async function getFile(
req: IncomingMessage,
res: ServerResponse,
params: URLSearchParams
): Promise<void> {
// 解析参数
const filePath = params.get('path');

// 验证必需参数
if (!filePath) {
 sendError(res, 'Missing required parameter: path', 400);
 return;
}

// 验证是否为支持的媒体文件
const mediaType = shared.getMediaType(filePath);
if (mediaType === null) {
 sendError(res, 'Unsupported file type', 400);
 return;
}

// 获取文件信息
let stat;
try {
 stat = await fsPromises.stat(filePath);
} catch (error: unknown) {
 if (error instanceof Error && 'code' in error) {
 const nodeError = error as NodeJS.ErrnoException;
 if (nodeError.code === 'ENOENT') {
 sendError(res, `File not found: ${filePath}`, 404);
 return;
 }
 if (nodeError.code === 'EACCES') {
 sendError(res, `Permission denied: ${filePath}`, 403);
 return;
 }
 }
 throw error;
}

if (!stat.isFile()) {
 sendError(res, 'Path is not a file', 400);
 return;
}

const fileSize = stat.size;
const mimeType = getMimeType(filePath);
const rangeHeader = req.headers.range;

// 处理 Range 请求
if (rangeHeader) {
 const range = parseRange(rangeHeader, fileSize);

 if (range === null) {
 // 无效的 Range 请求
 res.writeHead(416, {
 'Content-Range': `bytes */${fileSize}`,
 });
 res.end();
 return;
 }

 const { start, end } = range;
 const contentLength = end - start + 1;

 res.writeHead(206, {
 'Content-Type': mimeType,
 'Content-Length': contentLength,
 'Content-Range': `bytes ${start}-${end}/${fileSize}`,
 'Accept-Ranges': 'bytes',
 'Cache-Control': 'public, max-age=86400',
 });

 const stream = fs.createReadStream(filePath, { start, end });
 stream.pipe(res);
 stream.on('error', (err) => {
 console.error('Stream error:', err);
 res.end();
 });
} else {
 // 普通请求，返回整个文件
 res.writeHead(200, {
 'Content-Type': mimeType,
 'Content-Length': fileSize,
 'Accept-Ranges': 'bytes',
 'Cache-Control': 'public, max-age=86400',
 });

 const stream = fs.createReadStream(filePath);
 stream.pipe(res);
 stream.on('error', (err) => {
 console.error('Stream error:', err);
 res.end();
 });
}
}

/**
 * 解析 Range 请求头
 * @param rangeHeader Range 头的值，如 "bytes=0-1023"
 * @param fileSize 文件总大小
 * @returns 解析后的范围，无效时返回 null
*/
function parseRange(
rangeHeader: string,
fileSize: number
): { start: number; end: number } | null {
const match = rangeHeader.match(/bytes=(\d*)-(\d*)/);
if (!match) {
 return null;
}

const startStr = match[^1];
const endStr = match[^2];

let start: number;
let end: number;

if (startStr === '' && endStr !== '') {
 // 格式: bytes=-500 (最后500字节)
 const suffix = parseInt(endStr, 10);
 start = Math.max(0, fileSize - suffix);
 end = fileSize - 1;
} else if (startStr !== '' && endStr === '') {
 // 格式: bytes=500- (从500到结尾)
 start = parseInt(startStr, 10);
 end = fileSize - 1;
} else if (startStr !== '' && endStr !== '') {
 // 格式: bytes=0-1023
 start = parseInt(startStr, 10);
 end = parseInt(endStr, 10);
} else {
 return null;
}

// 验证范围有效性
if (isNaN(start) || isNaN(end) || start < 0 || end >= fileSize || start > end) {
 return null;
}

return { start, end };
}

## 现在请你做

基于以上API接口，给出 Task 2.1（创建HTML骨架和入口）的详细描述。

---
## 🤖 Assistant

# Task 2.1: 创建HTML骨架和前端入口

## 任务目标

创建前端项目的基础结构，包括HTML页面、TypeScript入口文件、CSS样式文件，以及esbuild构建配置。

## 涉及文件

| 文件 | 操作 | 说明 |
|------|------|------|
| `client/package.json` | 修改 | 添加构建脚本和依赖 |
| `client/tsconfig.json` | 修改 | 配置TypeScript编译选项 |
| `client/index.html` | 创建 | HTML页面骨架 |
| `client/src/index.ts` | 创建 | 前端入口文件 |
| `client/src/styles/main.css` | 创建 | 全局样式 |
| `client/build.mjs` | 创建 | esbuild构建脚本 |

## 详细实现

### 1. client/package.json

```json
{
  "name": "@media-browser/client",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "node build.mjs",
    "watch": "node build.mjs --watch",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@media-browser/shared": "*"
  },
  "devDependencies": {
    "esbuild": "^0.24.0",
    "typescript": "^5.6.0"
  }
}
```

### 2. client/tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "declaration": false,
    "noEmit": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"]
  },
  "include": ["src/**/*", "../shared/**/*"]
}
```

### 3. client/index.html

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>媒体浏览器</title>
  <link rel="stylesheet" href="styles/main.css">
</head>
<body>
  <div id="app">
    <!-- 路径输入区域 -->
    <header class="header">
      <h1 class="header__title">媒体浏览器</h1>
      <div id="path-input" class="path-input-container">
        <!-- 路径输入组件将挂载到这里 -->
      </div>
    </header>

    <!-- 主内容区域 -->
    <main class="main">
      <!-- 缩略图网格 -->
      <div id="gallery" class="gallery">
        <!-- 缩略图网格组件将挂载到这里 -->
        <p class="gallery__placeholder">请输入文件夹路径以浏览媒体文件</p>
      </div>
    </main>

    <!-- 分页区域 -->
    <footer class="footer">
      <div id="pagination" class="pagination-container">
        <!-- 分页组件将挂载到这里 -->
      </div>
    </footer>

    <!-- 灯箱（全屏预览） -->
    <div id="lightbox" class="lightbox lightbox--hidden">
      <!-- 灯箱组件将挂载到这里 -->
    </div>
  </div>

  <script src="dist/bundle.js"></script>
</body>
</html>
```

### 4. client/src/index.ts

```typescript
/**
 * 媒体浏览器前端入口
 */

// 应用状态类型
interface AppState {
  currentPath: string;
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
}

// 全局应用状态
const state: AppState = {
  currentPath: '',
  currentPage: 1,
  pageSize: 50,
  isLoading: false,
};

/**
 * 获取DOM元素，如果不存在则抛出错误
 */
function getElement<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Element with id "${id}" not found`);
  }
  return element as T;
}

/**
 * 初始化应用
 */
function initApp(): void {
  console.log('媒体浏览器已启动');
  
  // 验证必要的DOM元素存在
  const requiredElements = ['app', 'path-input', 'gallery', 'pagination', 'lightbox'];
  
  for (const id of requiredElements) {
    try {
      getElement(id);
      console.log(`✓ 元素 #${id} 已就绪`);
    } catch (error) {
      console.error(`✗ 元素 #${id} 未找到`);
    }
  }
  
  // TODO: 后续任务将在这里初始化各个组件
  // - Task 2.3: 初始化路径输入组件
  // - Task 2.4: 初始化缩略图网格组件
  // - Task 2.5: 初始化分页组件
  // - Task 2.6/2.7: 初始化灯箱组件
}

// DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', initApp);

// 导出状态和工具函数供其他模块使用
export { state, getElement };
export type { AppState };
```

### 5. client/src/styles/main.css

```css
/* ===== CSS变量 ===== */
:root {
  /* 颜色 */
  --color-bg: #1a1a1a;
  --color-bg-secondary: #2a2a2a;
  --color-bg-hover: #3a3a3a;
  --color-text: #ffffff;
  --color-text-secondary: #aaaaaa;
  --color-border: #444444;
  --color-primary: #4a9eff;
  --color-primary-hover: #6ab0ff;
  
  /* 间距 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* 圆角 */
  --radius-sm: 4px;
  --radius-md: 8px;
  
  /* 缩略图尺寸 */
  --thumbnail-size: 200px;
  
  /* 过渡 */
  --transition-fast: 0.15s ease;
  --transition-normal: 0.25s ease;
}

/* ===== 重置样式 ===== */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* ===== 基础样式 ===== */
html {
  font-size: 16px;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: var(--color-bg);
  color: var(--color-text);
  line-height: 1.5;
  min-height: 100vh;
}

/* ===== 应用容器 ===== */
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* ===== 头部 ===== */
.header {
  background-color: var(--color-bg-secondary);
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header__title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: var(--spacing-md);
}

/* ===== 路径输入容器 ===== */
.path-input-container {
  display: flex;
  gap: var(--spacing-sm);
}

/* ===== 主内容区域 ===== */
.main {
  flex: 1;
  padding: var(--spacing-lg);
}

/* ===== 缩略图网格 ===== */
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--thumbnail-size), 1fr));
  gap: var(--spacing-md);
  justify-items: center;
}

.gallery__placeholder {
  grid-column: 1 / -1;
  text-align: center;
  color: var(--color-text-secondary);
  padding: var(--spacing-xl);
}

/* ===== 底部分页区域 ===== */
.footer {
  background-color: var(--color-bg-secondary);
  padding: var(--spacing-md) var(--spacing-lg);
  border-top: 1px solid var(--color-border);
  position: sticky;
  bottom: 0;
}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-sm);
}

/* ===== 灯箱 ===== */
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.95);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox--hidden {
  display: none;
}

/* ===== 通用按钮样式 ===== */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text);
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background-color var(--transition-fast), border-color var(--transition-fast);
}

.btn:hover {
  background-color: var(--color-bg-hover);
  border-color: var(--color-primary);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn--primary {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.btn--primary:hover {
  background-color: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}

/* ===== 通用输入框样式 ===== */
.input {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: 1rem;
  color: var(--color-text);
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  outline: none;
  transition: border-color var(--transition-fast);
}

.input:focus {
  border-color: var(--color-primary);
}

.input::placeholder {
  color: var(--color-text-secondary);
}

/* ===== 加载状态 ===== */
.loading {
  opacity: 0.6;
  pointer-events: none;
}

/* ===== 错误状态 ===== */
.error-message {
  color: #ff6b6b;
  padding: var(--spacing-md);
  text-align: center;
}
```

### 6. client/build.mjs

```javascript
import * as esbuild from 'esbuild';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isWatch = process.argv.includes('--watch');

/** @type {esbuild.BuildOptions} */
const buildOptions = {
  entryPoints: [path.join(__dirname, 'src/index.ts')],
  bundle: true,
  outfile: path.join(__dirname, 'dist/bundle.js'),
  format: 'iife',
  platform: 'browser',
  target: ['es2022'],
  sourcemap: true,
  minify: !isWatch,
  logLevel: 'info',
};

async function build() {
  try {
    if (isWatch) {
      // 监听模式
      const ctx = await esbuild.context(buildOptions);
      await ctx.watch();
      console.log('Watching for changes...');
    } else {
      // 单次构建
      await esbuild.build(buildOptions);
      console.log('Build complete!');
    }
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

build();
```

## 验收标准

### 检查清单

- [ ] **文件创建**: 所有6个文件都已创建/修改
- [ ] **依赖安装**: 在根目录运行 `npm install` 成功
- [ ] **类型检查**: 在 client 目录运行 `npm run typecheck` 无错误
- [ ] **构建成功**: 在 client 目录运行 `npm run build` 生成 `dist/bundle.js`
- [ ] **页面加载**: 浏览器打开 `client/index.html`，页面正常显示
- [ ] **控制台输出**: 浏览器控制台显示初始化日志，无报错

### 验收测试步骤

1. **安装依赖**
```bash
   # 在项目根目录
   npm install
   ```

2. **类型检查**
   ```bash
   cd client
   npm run typecheck
   # 应该无错误输出
   ```

3. **构建前端**
   ```bash
   cd client
   npm run build
   # 应该输出 "Build complete!"
   # 检查 client/dist/bundle.js 文件存在
   ```

4. **启动后端服务器**（用于后续测试，此任务可选）
   ```bash
   cd server
   npm run dev
   ```

5. **浏览器验证**
   - 直接用浏览器打开 `client/index.html`
   - 页面应显示：
     - 标题 "媒体浏览器"
     - 路径输入区域（空的容器）
     - 提示文字 "请输入文件夹路径以浏览媒体文件"
   - 打开浏览器开发者工具（F12），控制台应显示：
     ```
     媒体浏览器已启动
     ✓ 元素 #app 已就绪
     ✓ 元素 #path-input 已就绪
     ✓ 元素 #gallery 已就绪
     ✓ 元素 #pagination 已就绪
     ✓ 元素 #lightbox 已就绪
     ```
   - 控制台无红色错误信息

### 预期页面效果

- 深色背景（#1a1a1a）
- 顶部有标题和路径输入区域（目前为空）
- 中间显示占位提示文字
- 底部有分页区域（目前为空）
- 响应式布局，缩放窗口时网格自动调整

---

## 文档更新

完成此任务后，需要更新 `docs/project-summary.md` 的以下部分：

### 更新任务清单状态

```markdown
### 阶段2：前端核心

| 任务 | 描述 | 状态 |
|------|------|------|
| Task 2.1 | 创建HTML骨架和入口 | ✅ 完成 |
| Task 2.2 | 实现API客户端 | ⏳ 待开始 |
...
```

### 添加前端开发命令

在 "6. 开发命令速查" 部分添加：

```markdown
### 构建前端
```bash
cd client
npm run build
```

### 前端监听模式（开发用）
```bash
cd client
npm run watch
```

### 前端类型检查
```bash
cd client
npm run typecheck
```
```

---
## 🧑‍💻 User

main.css:1 Failed to load resource: net::ERR_FILE_NOT_FOUND
index.ts:36 媒体浏览器已启动
index.ts:44 ✓ 元素 #app 已就绪
index.ts:44 ✓ 元素 #path-input 已就绪
index.ts:44 ✓ 元素 #gallery 已就绪
index.ts:44 ✓ 元素 #pagination 已就绪
index.ts:44 ✓ 元素 #lightbox 已就绪

---
## 🤖 Assistant

CSS 文件路径问题。HTML 中引用的是 `styles/main.css`，但实际文件在 `src/styles/main.css`。

## 问题分析

```
client/
├── index.html          # 引用 href="styles/main.css"
├── dist/
│   └── bundle.js
└── src/
    └── styles/
        └── main.css    # 实际位置
```

## 解决方案

有两种方案，推荐方案A（更符合前端项目惯例）：

### 方案A：将 CSS 移到正确位置（推荐）

创建 `client/styles/` 目录，将 CSS 文件移动到那里：

```bash
# 在 client 目录下执行
mkdir styles
mv src/styles/main.css styles/main.css
rmdir src/styles
```

最终目录结构：
```
client/
├── index.html          # href="styles/main.css" ✓
├── styles/
│   └── main.css        # 移动到这里
├── dist/
│   └── bundle.js
└── src/
    └── index.ts
```

### 方案B：修改 HTML 引用路径

如果希望保持 CSS 在 `src/` 下，修改 `client/index.html`：

```html
<!-- 修改这一行 -->
<link rel="stylesheet" href="src/styles/main.css">
```

---

## 推荐方案A

执行以下操作：

**1. 创建目录并移动文件**

```bash
cd client
mkdir styles
mv src/styles/main.css styles/
rmdir src/styles
```

**2. 验证**

刷新浏览器，控制台应该没有 CSS 加载错误了。

---

## 更新目录结构文档

完成后，更新 `docs/project-summary.md` 中的目录结构：

```markdown
└── client/                      # 前端
    ├── package.json
    ├── tsconfig.json
    ├── index.html
    ├── build.mjs
    ├── styles/
    │   └── main.css             # 全局样式
    ├── dist/                    # 构建输出（gitignore）
    │   └── bundle.js
    └── src/
        ├── index.ts             # 前端入口
        ├── api/                 # API客户端（待实现）
        └── components/          # UI组件（待实现）
```

---
## 🧑‍💻 User

所有测试均已通过，现在我将保存当前版本为任务2.1。

---
## 🤖 Assistant

很好！Task 2.1 已完成并保存。

## 任务状态更新

### 已完成: Task 2.1 - 创建HTML骨架和入口 ✅

**完成内容：**
- `client/package.json` - 构建脚本和依赖
- `client/tsconfig.json` - TypeScript配置
- `client/index.html` - HTML页面骨架
- `client/src/index.ts` - 前端入口文件
- `client/styles/main.css` - 全局样式
- `client/build.mjs` - esbuild构建脚本

---

## 下一个任务: Task 2.2 - 实现API客户端

准备好后请告诉我，我将提供 Task 2.2 的详细实现方案。

**Task 2.2 预览：**
- 创建 `client/src/api/client.ts`
- 封装对后端4个API的调用
- 使用 `@media-browser/shared` 的类型定义
- 提供类型安全的请求/响应处理

---
## 🧑‍💻 User

继续 Task 2.2：实现API客户端

要求：
1. 创建 client/src/api/client.ts
2. 封装后端的4个API调用（health、media、thumbnail、file）
3. 使用 fetch API
4. 正确处理错误响应
5. 使用 shared 模块的类型定义
6. 给出验收标准（包括如何测试）

注意：
- 后端运行在 http://localhost:3000
- 缩略图和文件API返回二进制数据，不是JSON
- 给出完整代码，不要省略
- 在该阶段验收完成之前，不需要更新项目文档。

---
## 🤖 Assistant

# Task 2.2: 实现API客户端

## 任务目标

创建封装后端API调用的客户端模块，提供类型安全的接口供其他前端组件使用。

## 涉及文件

| 文件 | 操作 | 说明 |
|------|------|------|
| `client/src/api/client.ts` | 创建 | API客户端实现 |

## 完整代码

### client/src/api/client.ts

```typescript
/**
 * 媒体浏览器 API 客户端
 * 封装对后端 API 的所有调用
 */

import type {
  ApiResponse,
  MediaItem,
  PaginatedResponse,
} from '@media-browser/shared/types';

/** API 基础地址 */
const API_BASE_URL = 'http://localhost:3000';

/** 健康检查响应类型 */
export interface HealthResponse {
  status: string;
  timestamp: string;
}

/** API 客户端错误 */
export class ApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly endpoint: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * 构建带查询参数的 URL
 */
function buildUrl(endpoint: string, params?: Record<string, string | number>): string {
  const url = new URL(endpoint, API_BASE_URL);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

/**
 * 发送 JSON API 请求
 */
async function fetchJson<T>(endpoint: string, params?: Record<string, string | number>): Promise<T> {
  const url = buildUrl(endpoint, params);
  
  let response: Response;
  try {
    response = await fetch(url);
  } catch (error) {
    throw new ApiError(
      `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      0,
      endpoint
    );
  }

  // 尝试解析 JSON
  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new ApiError(
      `Invalid JSON response from server`,
      response.status,
      endpoint
    );
  }

  // 检查 HTTP 状态码
  if (!response.ok) {
    const errorMessage = isApiErrorResponse(data) ? data.error : `HTTP ${response.status}`;
    throw new ApiError(errorMessage, response.status, endpoint);
  }

  return data as T;
}

/**
 * 类型守卫：检查是否为 API 错误响应
 */
function isApiErrorResponse(data: unknown): data is { success: false; error: string } {
  return (
    typeof data === 'object' &&
    data !== null &&
    'success' in data &&
    (data as Record<string, unknown>).success === false &&
    'error' in data &&
    typeof (data as Record<string, unknown>).error === 'string'
  );
}

/**
 * 健康检查
 * GET /api/health
 */
export async function checkHealth(): Promise<HealthResponse> {
  return fetchJson<HealthResponse>('/api/health');
}

/**
 * 获取媒体列表参数
 */
export interface GetMediaListParams {
  /** 文件夹绝对路径 */
  path: string;
  /** 页码，从1开始，默认1 */
  page?: number;
  /** 每页数量，默认50 */
  pageSize?: number;
}

/**
 * 获取媒体列表
 * GET /api/media
 */
export async function getMediaList(params: GetMediaListParams): Promise<PaginatedResponse<MediaItem>> {
  const queryParams: Record<string, string | number> = {
    path: params.path,
  };
  
  if (params.page !== undefined) {
    queryParams.page = params.page;
  }
  
  if (params.pageSize !== undefined) {
    queryParams.pageSize = params.pageSize;
  }

  const response = await fetchJson<ApiResponse<PaginatedResponse<MediaItem>>>('/api/media', queryParams);
  
  if (!response.success) {
    throw new ApiError(response.error, 400, '/api/media');
  }
  
  return response.data;
}

/**
 * 获取缩略图 URL
 * 不发起请求，仅构建 URL 供 <img> 标签使用
 */
export function getThumbnailUrl(filePath: string): string {
  return buildUrl('/api/thumbnail', { path: filePath });
}

/**
 * 获取缩略图（二进制数据）
 * GET /api/thumbnail
 */
export async function getThumbnail(filePath: string): Promise<Blob> {
  const url = buildUrl('/api/thumbnail', { path: filePath });
  
  let response: Response;
  try {
    response = await fetch(url);
  } catch (error) {
    throw new ApiError(
      `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      0,
      '/api/thumbnail'
    );
  }

  if (!response.ok) {
    // 尝试解析错误信息
    let errorMessage = `HTTP ${response.status}`;
    try {
      const data = await response.json();
      if (isApiErrorResponse(data)) {
        errorMessage = data.error;
      }
    } catch {
      // 忽略 JSON 解析错误
    }
    throw new ApiError(errorMessage, response.status, '/api/thumbnail');
  }

  return response.blob();
}

/**
 * 获取原始文件 URL
 * 不发起请求，仅构建 URL 供 <img>/<video> 标签使用
 */
export function getFileUrl(filePath: string): string {
  return buildUrl('/api/file', { path: filePath });
}

/**
 * 获取原始文件（二进制数据）
 * GET /api/file
 * 注意：大文件建议使用 getFileUrl() 配合 <img>/<video> 标签，而非此方法
 */
export async function getFile(filePath: string): Promise<Blob> {
  const url = buildUrl('/api/file', { path: filePath });
  
  let response: Response;
  try {
    response = await fetch(url);
  } catch (error) {
    throw new ApiError(
      `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      0,
      '/api/file'
    );
  }

  if (!response.ok) {
    // 尝试解析错误信息
    let errorMessage = `HTTP ${response.status}`;
    try {
      const data = await response.json();
      if (isApiErrorResponse(data)) {
        errorMessage = data.error;
      }
    } catch {
      // 忽略 JSON 解析错误
    }
    throw new ApiError(errorMessage, response.status, '/api/file');
  }

  return response.blob();
}

/**
 * API 客户端对象，汇总所有方法
 */
export const apiClient = {
  checkHealth,
  getMediaList,
  getThumbnail,
  getThumbnailUrl,
  getFile,
  getFileUrl,
};

export default apiClient;
```

## 验收标准

### 检查清单

- [ ] **文件创建**: `client/src/api/client.ts` 已创建
- [ ] **类型检查**: 运行 `npm run typecheck` 无错误
- [ ] **构建成功**: 运行 `npm run build` 成功
- [ ] **API测试**: 所有4个API端点调用正常

### 验收测试步骤

#### 1. 类型检查

```bash
cd client
npm run typecheck
# 应该无错误输出
```

#### 2. 构建

```bash
cd client
npm run build
# 应该输出 "Build complete!"
```

#### 3. 功能测试

为了测试 API 客户端，临时修改 `client/src/index.ts` 添加测试代码：

**修改 client/src/index.ts:**

```typescript
/**
 * 媒体浏览器前端入口
 */

import { apiClient, ApiError } from './api/client.ts';

// 应用状态类型
interface AppState {
  currentPath: string;
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
}

// 全局应用状态
const state: AppState = {
  currentPath: '',
  currentPage: 1,
  pageSize: 50,
  isLoading: false,
};

/**
 * 获取DOM元素，如果不存在则抛出错误
 */
function getElement<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Element with id "${id}" not found`);
  }
  return element as T;
}

/**
 * 测试 API 客户端
 */
async function testApiClient(): Promise<void> {
  console.log('\n===== API 客户端测试 =====\n');

  // 测试 1: 健康检查
  console.log('测试 1: 健康检查 (GET /api/health)');
  try {
    const health = await apiClient.checkHealth();
    console.log('✓ 健康检查成功:', health);
  } catch (error) {
    console.error('✗ 健康检查失败:', error);
  }

  // 测试 2: 获取媒体列表（需要有效路径）
  console.log('\n测试 2: 获取媒体列表 (GET /api/media)');
  // 请将此路径替换为你电脑上实际存在的包含图片/视频的文件夹
  const testPath = 'C:\\Users\\Public\\Pictures';
  try {
    const mediaList = await apiClient.getMediaList({ path: testPath, page: 1, pageSize: 5 });
    console.log('✓ 媒体列表获取成功:');
    console.log('  - 总数:', mediaList.total);
    console.log('  - 当前页:', mediaList.page);
    console.log('  - 总页数:', mediaList.totalPages);
    console.log('  - 本页项目数:', mediaList.items.length);
    if (mediaList.items.length > 0) {
      console.log('  - 第一个文件:', mediaList.items[0].name);
    }
  } catch (error) {
    if (error instanceof ApiError) {
      console.error('✗ 媒体列表获取失败:', error.message, `(状态码: ${error.statusCode})`);
    } else {
      console.error('✗ 媒体列表获取失败:', error);
    }
  }

  // 测试 3: 获取媒体列表（无效路径，测试错误处理）
  console.log('\n测试 3: 获取媒体列表 - 无效路径（测试错误处理）');
  try {
    await apiClient.getMediaList({ path: 'Z:\\NonExistent\\Path' });
    console.error('✗ 应该抛出错误但没有');
  } catch (error) {
    if (error instanceof ApiError) {
      console.log('✓ 正确捕获错误:', error.message, `(状态码: ${error.statusCode})`);
    } else {
      console.error('✗ 错误类型不正确:', error);
    }
  }

  // 测试 4: 缩略图 URL 生成
  console.log('\n测试 4: 缩略图 URL 生成');
  const thumbnailUrl = apiClient.getThumbnailUrl('C:\\test\\image.jpg');
  console.log('✓ 缩略图 URL:', thumbnailUrl);

  // 测试 5: 文件 URL 生成
  console.log('\n测试 5: 文件 URL 生成');
  const fileUrl = apiClient.getFileUrl('C:\\test\\video.mp4');
  console.log('✓ 文件 URL:', fileUrl);

  console.log('\n===== API 客户端测试完成 =====\n');
}

/**
 * 初始化应用
 */
function initApp(): void {
  console.log('媒体浏览器已启动');
  
  // 验证必要的DOM元素存在
  const requiredElements = ['app', 'path-input', 'gallery', 'pagination', 'lightbox'];
  
  for (const id of requiredElements) {
    try {
      getElement(id);
      console.log(`✓ 元素 #${id} 已就绪`);
    } catch (error) {
      console.error(`✗ 元素 #${id} 未找到`);
    }
  }
  
  // 运行 API 测试
  testApiClient();
}

// DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', initApp);

// 导出状态和工具函数供其他模块使用
export { state, getElement };
export type { AppState };
```

#### 4. 运行测试

1. **启动后端服务器**（新终端窗口）：
```bash
   cd server
   npm run dev
   ```

2. **重新构建前端**：
   ```bash
   cd client
   npm run build
   ```

3. **打开浏览器测试**：
   - 打开 `client/index.html`
   - 打开开发者工具（F12）查看控制台
   - 应该看到类似以下输出：

   ```
   媒体浏览器已启动
   ✓ 元素 #app 已就绪
   ✓ 元素 #path-input 已就绪
   ✓ 元素 #gallery 已就绪
   ✓ 元素 #pagination 已就绪
   ✓ 元素 #lightbox 已就绪

   ===== API 客户端测试 =====

   测试 1: 健康检查 (GET /api/health)
   ✓ 健康检查成功: {status: 'ok', timestamp: '2025-...'}

   测试 2: 获取媒体列表 (GET /api/media)
   ✓ 媒体列表获取成功:
     - 总数: X
     - 当前页: 1
     - 总页数: X
     - 本页项目数: X
     - 第一个文件: xxx.jpg

   测试 3: 获取媒体列表 - 无效路径（测试错误处理）
   ✓ 正确捕获错误: Directory not found (状态码: 404)

   测试 4: 缩略图 URL 生成
   ✓ 缩略图 URL: http://localhost:3000/api/thumbnail?path=C%3A%5Ctest%5Cimage.jpg

   测试 5: 文件 URL 生成
   ✓ 文件 URL: http://localhost:3000/api/file?path=C%3A%5Ctest%5Cvideo.mp4

   ===== API 客户端测试完成 =====
   ```

#### 5. 测试完成后还原 index.ts

测试通过后，将 `client/src/index.ts` 还原为简洁版本：

```typescript
/**
 * 媒体浏览器前端入口
*/

// 应用状态类型
interface AppState {
currentPath: string;
currentPage: number;
pageSize: number;
isLoading: boolean;
}

// 全局应用状态
const state: AppState = {
currentPath: '',
currentPage: 1,
pageSize: 50,
isLoading: false,
};

/**
 * 获取DOM元素，如果不存在则抛出错误
*/
function getElement<T extends HTMLElement>(id: string): T {
const element = document.getElementById(id);
if (!element) {
 throw new Error(`Element with id "${id}" not found`);
}
return element as T;
}

/**
 * 初始化应用
*/
function initApp(): void {
console.log('媒体浏览器已启动');

// 验证必要的DOM元素存在
const requiredElements = ['app', 'path-input', 'gallery', 'pagination', 'lightbox'];

for (const id of requiredElements) {
 try {
 getElement(id);
 console.log(`✓ 元素 #${id} 已就绪`);
 } catch (error) {
 console.error(`✗ 元素 #${id} 未找到`);
 }
}

// TODO: 后续任务将在这里初始化各个组件
}

// DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', initApp);

// 导出状态和工具函数供其他模块使用
export { state, getElement };
export type { AppState };
```

然后重新构建：

```bash
cd client
npm run build
```

### 预期结果

- 所有5个测试项目显示 ✓
- 健康检查返回正确的状态和时间戳
- 有效路径能获取媒体列表
- 无效路径正确抛出 `ApiError`
- URL 生成函数返回正确格式的 URL

---
## 🧑‍💻 User

所有测试项目均通过，我将保存当前项目进度为任务2.2，请为我更新完整的项目文档。

---
## 🧑‍💻 User

Task 2.2 已完成，继续 Task 2.3：实现路径输入组件

要求：
1. 创建 client/src/components/path-input.ts
2. 组件功能：
 - 输入框让用户输入文件夹路径
 - "浏览"按钮触发加载
 - 回车键也能触发加载
 - 加载时显示禁用状态
3. 组件接口：
 - 挂载到 #path-input 容器
 - 通过回调函数通知外部路径变化
4. 需要在 main.css 中添加相关样式（如果需要）
5. 暂时不需要修改 index.ts 集成（Task 2.8 统一集成）
6. 给出验收标准（包括独立测试方法）

注意：
- 组件要能独立测试，不依赖其他组件
- 给出完整代码，不要省略
- 验收测试通过之前，不要更新项目文档。

---
## 🤖 Assistant

# Task 2.3: 实现路径输入组件

## 任务目标

创建路径输入组件，允许用户输入文件夹路径并触发加载操作。

## 涉及文件

| 文件 | 操作 | 说明 |
|------|------|------|
| `client/src/components/path-input.ts` | 创建 | 路径输入组件 |
| `client/styles/main.css` | 修改 | 添加组件样式 |

## 完整代码

### 1. client/src/components/path-input.ts

```typescript
/**
 * 路径输入组件
 * 提供文件夹路径输入和加载触发功能
 */

/** 路径输入组件配置 */
export interface PathInputConfig {
  /** 挂载容器元素或选择器 */
  container: HTMLElement | string;
  /** 路径提交回调 */
  onSubmit: (path: string) => void | Promise<void>;
  /** 初始路径（可选） */
  initialPath?: string;
  /** 占位符文本（可选） */
  placeholder?: string;
}

/** 路径输入组件类 */
export class PathInput {
  private container: HTMLElement;
  private inputElement: HTMLInputElement;
  private buttonElement: HTMLButtonElement;
  private onSubmit: (path: string) => void | Promise<void>;
  private isLoading: boolean = false;

  constructor(config: PathInputConfig) {
    // 解析容器
    if (typeof config.container === 'string') {
      const el = document.querySelector(config.container);
      if (!el) {
        throw new Error(`Container not found: ${config.container}`);
      }
      this.container = el as HTMLElement;
    } else {
      this.container = config.container;
    }

    this.onSubmit = config.onSubmit;

    // 创建DOM结构
    this.inputElement = this.createInput(config.placeholder, config.initialPath);
    this.buttonElement = this.createButton();

    // 渲染到容器
    this.render();

    // 绑定事件
    this.bindEvents();
  }

  /**
   * 创建输入框元素
   */
  private createInput(placeholder?: string, initialValue?: string): HTMLInputElement {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'path-input__input input';
    input.placeholder = placeholder || '请输入文件夹路径，例如: C:\\Pictures';
    if (initialValue) {
      input.value = initialValue;
    }
    return input;
  }

  /**
   * 创建按钮元素
   */
  private createButton(): HTMLButtonElement {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'path-input__button btn btn--primary';
    button.textContent = '浏览';
    return button;
  }

  /**
   * 渲染组件到容器
   */
  private render(): void {
    // 清空容器
    this.container.innerHTML = '';

    // 创建包装器
    const wrapper = document.createElement('div');
    wrapper.className = 'path-input';

    // 添加元素
    wrapper.appendChild(this.inputElement);
    wrapper.appendChild(this.buttonElement);

    this.container.appendChild(wrapper);
  }

  /**
   * 绑定事件处理
   */
  private bindEvents(): void {
    // 按钮点击
    this.buttonElement.addEventListener('click', () => {
      this.handleSubmit();
    });

    // 回车键提交
    this.inputElement.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        this.handleSubmit();
      }
    });
  }

  /**
   * 处理提交
   */
  private async handleSubmit(): Promise<void> {
    if (this.isLoading) {
      return;
    }

    const path = this.inputElement.value.trim();
    if (!path) {
      this.inputElement.focus();
      return;
    }

    try {
      this.setLoading(true);
      await this.onSubmit(path);
    } finally {
      this.setLoading(false);
    }
  }

  /**
   * 设置加载状态
   */
  public setLoading(loading: boolean): void {
    this.isLoading = loading;
    this.inputElement.disabled = loading;
    this.buttonElement.disabled = loading;

    if (loading) {
      this.buttonElement.textContent = '加载中...';
      this.buttonElement.classList.add('btn--loading');
    } else {
      this.buttonElement.textContent = '浏览';
      this.buttonElement.classList.remove('btn--loading');
    }
  }

  /**
   * 获取当前路径值
   */
  public getValue(): string {
    return this.inputElement.value.trim();
  }

  /**
   * 设置路径值
   */
  public setValue(path: string): void {
    this.inputElement.value = path;
  }

  /**
   * 聚焦输入框
   */
  public focus(): void {
    this.inputElement.focus();
  }

  /**
   * 销毁组件
   */
  public destroy(): void {
    this.container.innerHTML = '';
  }
}

/**
 * 创建路径输入组件的工厂函数
 */
export function createPathInput(config: PathInputConfig): PathInput {
  return new PathInput(config);
}
```

### 2. client/styles/main.css（添加以下内容到文件末尾）

```css
/* ===== 路径输入组件 ===== */
.path-input {
  display: flex;
  gap: var(--spacing-sm);
  width: 100%;
  max-width: 800px;
}

.path-input__input {
  flex: 1;
  min-width: 0; /* 允许收缩 */
  font-family: 'Consolas', 'Monaco', monospace;
}

.path-input__button {
  flex-shrink: 0;
  min-width: 100px;
}

/* 加载状态按钮 */
.btn--loading {
  position: relative;
  color: transparent !important;
}

.btn--loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 16px;
  height: 16px;
  margin: -8px 0 0 -8px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.btn--loading::before {
  content: '加载中...';
  color: var(--color-text);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 输入框禁用状态 */
.path-input__input:disabled {
  background-color: var(--color-bg-secondary);
  cursor: not-allowed;
  opacity: 0.7;
}

/* 按钮禁用状态增强 */
.path-input__button:disabled {
  background-color: var(--color-bg-hover);
  border-color: var(--color-border);
  cursor: not-allowed;
}
```

## 验收标准

### 检查清单

- [ ] **文件创建**: `client/src/components/path-input.ts` 已创建
- [ ] **样式更新**: `client/styles/main.css` 已添加组件样式
- [ ] **类型检查**: 运行 `npm run typecheck` 无错误
- [ ] **构建成功**: 运行 `npm run build` 成功
- [ ] **功能测试**: 所有交互功能正常

### 验收测试步骤

#### 1. 类型检查

```bash
cd client
npm run typecheck
# 应该无错误输出
```

#### 2. 构建

```bash
cd client
npm run build
# 应该输出 "Build complete!"
```

#### 3. 功能测试

为了独立测试组件，临时修改 `client/src/index.ts`：

```typescript
/**
 * 媒体浏览器前端入口
 * Task 2.3 测试版本
 */

import { createPathInput, PathInput } from './components/path-input.ts';

// 应用状态类型
interface AppState {
  currentPath: string;
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
}

// 全局应用状态
const state: AppState = {
  currentPath: '',
  currentPage: 1,
  pageSize: 50,
  isLoading: false,
};

/**
 * 获取DOM元素，如果不存在则抛出错误
 */
function getElement<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Element with id "${id}" not found`);
  }
  return element as T;
}

/**
 * 模拟异步加载（用于测试）
 */
function simulateLoading(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 测试路径输入组件
 */
function testPathInput(): void {
  console.log('\n===== 路径输入组件测试 =====\n');

  // 创建组件
  const pathInput = createPathInput({
    container: '#path-input',
    initialPath: '',
    placeholder: '请输入文件夹路径，例如: C:\\Pictures',
    onSubmit: async (path: string) => {
      console.log('提交路径:', path);
      
      // 模拟加载延迟
      console.log('开始加载...');
      await simulateLoading(2000);
      console.log('加载完成!');
      
      // 更新状态
      state.currentPath = path;
      console.log('当前状态:', state);
    },
  });

  // 导出到全局以便控制台测试
  (window as unknown as Record<string, unknown>).pathInput = pathInput;

  console.log('✓ 路径输入组件已创建');
  console.log('');
  console.log('测试说明:');
  console.log('1. 在输入框中输入路径，点击"浏览"按钮');
  console.log('2. 观察按钮变为"加载中..."状态，输入框禁用');
  console.log('3. 2秒后恢复正常状态');
  console.log('4. 也可以输入路径后按回车键触发');
  console.log('5. 空路径不会触发提交');
  console.log('');
  console.log('控制台命令:');
  console.log('  pathInput.getValue()     - 获取当前值');
  console.log('  pathInput.setValue("X:") - 设置值');
  console.log('  pathInput.setLoading(true/false) - 手动切换加载状态');
  console.log('  pathInput.focus()        - 聚焦输入框');
}

/**
 * 初始化应用
 */
function initApp(): void {
  console.log('媒体浏览器已启动');
  
  // 验证必要的DOM元素存在
  const requiredElements = ['app', 'path-input', 'gallery', 'pagination', 'lightbox'];
  
  for (const id of requiredElements) {
    try {
      getElement(id);
      console.log(`✓ 元素 #${id} 已就绪`);
    } catch (error) {
      console.error(`✗ 元素 #${id} 未找到`);
    }
  }
  
  // 测试路径输入组件
  testPathInput();
}

// DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', initApp);

// 导出状态和工具函数供其他模块使用
export { state, getElement };
export type { AppState };
```

#### 4. 运行测试

1. **重新构建前端**：
```bash
   cd client
   npm run build
   ```

2. **打开浏览器测试**：
   - 打开 `client/index.html`
   - 打开开发者工具（F12）查看控制台

3. **测试交互功能**：

   | 测试项 | 操作 | 预期结果 |
   |--------|------|----------|
   | 初始状态 | 页面加载 | 显示输入框和"浏览"按钮 |
   | 空提交 | 不输入内容，点击按钮 | 无反应，输入框获得焦点 |
   | 按钮提交 | 输入路径，点击"浏览" | 按钮变"加载中..."，输入框禁用，2秒后恢复 |
   | 回车提交 | 输入路径，按回车 | 同上 |
   | 加载中再点击 | 加载过程中点击按钮 | 无反应（防重复提交） |
   | 控制台API | 执行 `pathInput.getValue()` | 返回当前输入值 |
   | 控制台API | 执行 `pathInput.setValue('D:\\Test')` | 输入框显示新值 |
   | 控制台API | 执行 `pathInput.setLoading(true)` | 进入加载状态 |

4. **控制台预期输出**：
   ```
   媒体浏览器已启动
   ✓ 元素 #app 已就绪
   ✓ 元素 #path-input 已就绪
   ✓ 元素 #gallery 已就绪
   ✓ 元素 #pagination 已就绪
   ✓ 元素 #lightbox 已就绪

   ===== 路径输入组件测试 =====

   ✓ 路径输入组件已创建

   测试说明:
   1. 在输入框中输入路径，点击"浏览"按钮
   2. 观察按钮变为"加载中..."状态，输入框禁用
   3. 2秒后恢复正常状态
   4. 也可以输入路径后按回车键触发
   5. 空路径不会触发提交

   控制台命令:
     pathInput.getValue()     - 获取当前值
     pathInput.setValue("X:") - 设置值
     pathInput.setLoading(true/false) - 手动切换加载状态
     pathInput.focus()        - 聚焦输入框
   ```

5. **输入测试路径并提交后**：
   ```
   提交路径: C:\Pictures
   开始加载...
   加载完成!
   当前状态: {currentPath: 'C:\\Pictures', currentPage: 1, pageSize: 50, isLoading: false}
   ```

#### 5. 测试完成后还原 index.ts

测试通过后，将 `client/src/index.ts` 还原为简洁版本：

```typescript
/**
 * 媒体浏览器前端入口
*/

// 应用状态类型
interface AppState {
currentPath: string;
currentPage: number;
pageSize: number;
isLoading: boolean;
}

// 全局应用状态
const state: AppState = {
currentPath: '',
currentPage: 1,
pageSize: 50,
isLoading: false,
};

/**
 * 获取DOM元素，如果不存在则抛出错误
*/
function getElement<T extends HTMLElement>(id: string): T {
const element = document.getElementById(id);
if (!element) {
 throw new Error(`Element with id "${id}" not found`);
}
return element as T;
}

/**
 * 初始化应用
*/
function initApp(): void {
console.log('媒体浏览器已启动');

// 验证必要的DOM元素存在
const requiredElements = ['app', 'path-input', 'gallery', 'pagination', 'lightbox'];

for (const id of requiredElements) {
 try {
 getElement(id);
 console.log(`✓ 元素 #${id} 已就绪`);
 } catch (error) {
 console.error(`✗ 元素 #${id} 未找到`);
 }
}

// TODO: 后续任务将在这里初始化各个组件
}

// DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', initApp);

// 导出状态和工具函数供其他模块使用
export { state, getElement };
export type { AppState };
```

然后重新构建：

```bash
cd client
npm run build
```

### 预期视觉效果

- 输入框占据大部分宽度，等宽字体显示路径
- "浏览"按钮为蓝色主色调
- 加载时按钮显示旋转动画
- 禁用状态时输入框和按钮变暗

---
## 🧑‍💻 User

测试均已通过，请给我完整的更新项目文档内容。

---
## 🧑‍💻 User

Task 2.3 已完成，继续 Task 2.4：实现缩略图网格组件

要求：
1. 创建 client/src/components/gallery.ts
2. 组件功能：
 - 接收 MediaItem[] 数据，渲染缩略图网格
 - 每个缩略图显示：图片预览、文件名、类型图标（图片/视频）
 - 点击缩略图触发回调（用于打开灯箱）
 - 支持空状态和加载状态显示
 - 缩略图URL通过 API 客户端的 getThumbnailUrl() 生成
3. 组件接口：
 - 挂载到 #gallery 容器
 - setItems(items: MediaItem[]) - 设置数据
 - setLoading(loading: boolean) - 设置加载状态
 - onClick 回调通知点击了哪个 MediaItem
4. 需要在 main.css 中添加缩略图卡片样式
5. 给出独立测试方法（用模拟数据）

注意：
- 使用 Task 2.2 创建的 apiClient.getThumbnailUrl(path)
- 需要导入 shared 模块的 MediaItem 类型
- 给出完整代码，不要省略
- 测试验收之前，不需要更新项目文档。

---
## 🤖 Assistant

# Task 2.4: 实现缩略图网格组件

## 任务目标

创建缩略图网格组件，展示媒体文件列表，支持点击交互。

## 涉及文件

| 文件 | 操作 | 说明 |
|------|------|------|
| `client/src/components/gallery.ts` | 创建 | 缩略图网格组件 |
| `client/styles/main.css` | 修改 | 添加缩略图卡片样式 |

## 完整代码

### 1. client/src/components/gallery.ts

```typescript
/**
 * 缩略图网格组件
 * 展示媒体文件列表，支持点击预览
 */

import type { MediaItem } from '@media-browser/shared/types';
import { getThumbnailUrl } from '../api/client.ts';

/** 缩略图网格组件配置 */
export interface GalleryConfig {
  /** 挂载容器元素或选择器 */
  container: HTMLElement | string;
  /** 点击缩略图回调 */
  onClick?: (item: MediaItem, index: number) => void;
  /** 空状态提示文本 */
  emptyText?: string;
  /** 加载状态提示文本 */
  loadingText?: string;
}

/** 缩略图网格组件类 */
export class Gallery {
  private container: HTMLElement;
  private items: MediaItem[] = [];
  private isLoading: boolean = false;
  private onClick?: (item: MediaItem, index: number) => void;
  private emptyText: string;
  private loadingText: string;

  constructor(config: GalleryConfig) {
    // 解析容器
    if (typeof config.container === 'string') {
      const el = document.querySelector(config.container);
      if (!el) {
        throw new Error(`Container not found: ${config.container}`);
      }
      this.container = el as HTMLElement;
    } else {
      this.container = config.container;
    }

    this.onClick = config.onClick;
    this.emptyText = config.emptyText || '请输入文件夹路径以浏览媒体文件';
    this.loadingText = config.loadingText || '加载中...';

    // 初始渲染
    this.render();
  }

  /**
   * 设置媒体项目列表
   */
  public setItems(items: MediaItem[]): void {
    this.items = items;
    this.render();
  }

  /**
   * 获取当前项目列表
   */
  public getItems(): MediaItem[] {
    return this.items;
  }

  /**
   * 设置加载状态
   */
  public setLoading(loading: boolean): void {
    this.isLoading = loading;
    this.render();
  }

  /**
   * 获取加载状态
   */
  public getLoading(): boolean {
    return this.isLoading;
  }

  /**
   * 清空列表
   */
  public clear(): void {
    this.items = [];
    this.render();
  }

  /**
   * 渲染组件
   */
  private render(): void {
    this.container.innerHTML = '';

    // 加载状态
    if (this.isLoading) {
      this.renderLoading();
      return;
    }

    // 空状态
    if (this.items.length === 0) {
      this.renderEmpty();
      return;
    }

    // 渲染缩略图网格
    this.renderGrid();
  }

  /**
   * 渲染加载状态
   */
  private renderLoading(): void {
    const loading = document.createElement('div');
    loading.className = 'gallery__status gallery__status--loading';
    loading.innerHTML = `
      <div class="gallery__spinner"></div>
      <p class="gallery__status-text">${this.loadingText}</p>
    `;
    this.container.appendChild(loading);
  }

  /**
   * 渲染空状态
   */
  private renderEmpty(): void {
    const empty = document.createElement('div');
    empty.className = 'gallery__status gallery__status--empty';
    empty.innerHTML = `
      <svg class="gallery__empty-icon" viewBox="0 0 24 24" width="48" height="48">
        <path fill="currentColor" d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z"/>
      </svg>
      <p class="gallery__status-text">${this.emptyText}</p>
    `;
    this.container.appendChild(empty);
  }

  /**
   * 渲染缩略图网格
   */
  private renderGrid(): void {
    const grid = document.createElement('div');
    grid.className = 'gallery__grid';

    this.items.forEach((item, index) => {
      const card = this.createCard(item, index);
      grid.appendChild(card);
    });

    this.container.appendChild(grid);
  }

  /**
   * 创建单个缩略图卡片
   */
  private createCard(item: MediaItem, index: number): HTMLElement {
    const card = document.createElement('div');
    card.className = 'gallery__card';
    card.dataset.index = String(index);

    // 缩略图容器
    const thumbnailWrapper = document.createElement('div');
    thumbnailWrapper.className = 'gallery__thumbnail-wrapper';

    // 缩略图图片
    const thumbnail = document.createElement('img');
    thumbnail.className = 'gallery__thumbnail';
    thumbnail.src = getThumbnailUrl(item.path);
    thumbnail.alt = item.name;
    thumbnail.loading = 'lazy';

    // 图片加载错误处理
    thumbnail.onerror = () => {
      thumbnail.style.display = 'none';
      thumbnailWrapper.classList.add('gallery__thumbnail-wrapper--error');
    };

    // 类型图标
    const typeIcon = document.createElement('div');
    typeIcon.className = `gallery__type-icon gallery__type-icon--${item.type}`;
    typeIcon.innerHTML = item.type === 'video' ? this.getVideoIcon() : this.getImageIcon();

    thumbnailWrapper.appendChild(thumbnail);
    thumbnailWrapper.appendChild(typeIcon);

    // 文件信息
    const info = document.createElement('div');
    info.className = 'gallery__info';

    const name = document.createElement('p');
    name.className = 'gallery__name';
    name.textContent = item.name;
    name.title = item.name;

    const meta = document.createElement('p');
    meta.className = 'gallery__meta';
    meta.textContent = this.formatFileSize(item.size);

    info.appendChild(name);
    info.appendChild(meta);

    card.appendChild(thumbnailWrapper);
    card.appendChild(info);

    // 点击事件
    card.addEventListener('click', () => {
      if (this.onClick) {
        this.onClick(item, index);
      }
    });

    return card;
  }

  /**
   * 获取视频图标 SVG
   */
  private getVideoIcon(): string {
    return `<svg viewBox="0 0 24 24" width="20" height="20">
      <path fill="currentColor" d="M8 5v14l11-7z"/>
    </svg>`;
  }

  /**
   * 获取图片图标 SVG
   */
  private getImageIcon(): string {
    return `<svg viewBox="0 0 24 24" width="20" height="20">
      <path fill="currentColor" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
    </svg>`;
  }

  /**
   * 格式化文件大小
   */
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  /**
   * 销毁组件
   */
  public destroy(): void {
    this.container.innerHTML = '';
    this.items = [];
  }
}

/**
 * 创建缩略图网格组件的工厂函数
 */
export function createGallery(config: GalleryConfig): Gallery {
  return new Gallery(config);
}
```

### 2. client/styles/main.css（添加以下内容到文件末尾）

```css
/* ===== 缩略图网格组件 ===== */
.gallery__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--thumbnail-size), 1fr));
  gap: var(--spacing-md);
  justify-items: center;
  width: 100%;
}

/* 状态显示（加载中、空状态） */
.gallery__status {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl) var(--spacing-md);
  color: var(--color-text-secondary);
  width: 100%;
  min-height: 300px;
}

.gallery__status-text {
  margin-top: var(--spacing-md);
  font-size: 1rem;
  text-align: center;
}

.gallery__empty-icon {
  opacity: 0.5;
}

/* 加载动画 */
.gallery__spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* 缩略图卡片 */
.gallery__card {
  width: var(--thumbnail-size);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.gallery__card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.gallery__card:active {
  transform: translateY(-2px);
}

/* 缩略图容器 */
.gallery__thumbnail-wrapper {
  position: relative;
  width: 100%;
  height: var(--thumbnail-size);
  background-color: var(--color-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.gallery__thumbnail-wrapper--error {
  background-color: var(--color-bg-hover);
}

.gallery__thumbnail-wrapper--error::after {
  content: '加载失败';
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

/* 缩略图图片 */
.gallery__thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-normal);
}

.gallery__card:hover .gallery__thumbnail {
  transform: scale(1.05);
}

/* 类型图标 */
.gallery__type-icon {
  position: absolute;
  top: var(--spacing-xs);
  right: var(--spacing-xs);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.9;
}

.gallery__type-icon--image {
  background-color: rgba(74, 158, 255, 0.9);
  color: white;
}

.gallery__type-icon--video {
  background-color: rgba(255, 107, 107, 0.9);
  color: white;
}

/* 文件信息 */
.gallery__info {
  padding: var(--spacing-sm);
}

.gallery__name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: var(--spacing-xs);
}

.gallery__meta {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}
```

## 验收标准

### 检查清单

- [ ] **文件创建**: `client/src/components/gallery.ts` 已创建
- [ ] **样式更新**: `client/styles/main.css` 已添加组件样式
- [ ] **类型检查**: 运行 `npm run typecheck` 无错误
- [ ] **构建成功**: 运行 `npm run build` 成功
- [ ] **功能测试**: 空状态、加载状态、网格显示、点击事件均正常

### 验收测试步骤

#### 1. 类型检查

```bash
cd client
npm run typecheck
# 应该无错误输出
```

#### 2. 构建

```bash
cd client
npm run build
# 应该输出 "Build complete!"
```

#### 3. 功能测试

为了独立测试组件，临时修改 `client/src/index.ts`：

```typescript
/**
 * 媒体浏览器前端入口
 * Task 2.4 测试版本
 */

import { createGallery, Gallery } from './components/gallery.ts';
import type { MediaItem } from '@media-browser/shared/types';

// 应用状态类型
interface AppState {
  currentPath: string;
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
}

// 全局应用状态
const state: AppState = {
  currentPath: '',
  currentPage: 1,
  pageSize: 50,
  isLoading: false,
};

/**
 * 获取DOM元素，如果不存在则抛出错误
 */
function getElement<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Element with id "${id}" not found`);
  }
  return element as T;
}

/**
 * 创建模拟数据
 */
function createMockItems(): MediaItem[] {
  return [
    {
      name: 'photo1.jpg',
      path: 'C:\\Pictures\\photo1.jpg',
      type: 'image',
      size: 1024 * 1024 * 2.5, // 2.5 MB
      modifiedAt: '2025-01-01T10:00:00.000Z',
    },
    {
      name: 'vacation_video.mp4',
      path: 'C:\\Pictures\\vacation_video.mp4',
      type: 'video',
      size: 1024 * 1024 * 150, // 150 MB
      modifiedAt: '2025-01-02T15:30:00.000Z',
    },
    {
      name: 'screenshot_2025_very_long_filename_that_should_be_truncated.png',
      path: 'C:\\Pictures\\screenshot_2025_very_long_filename_that_should_be_truncated.png',
      type: 'image',
      size: 1024 * 500, // 500 KB
      modifiedAt: '2025-01-03T09:15:00.000Z',
    },
    {
      name: 'family_gathering.mp4',
      path: 'C:\\Pictures\\family_gathering.mp4',
      type: 'video',
      size: 1024 * 1024 * 80, // 80 MB
      modifiedAt: '2025-01-04T18:00:00.000Z',
    },
    {
      name: 'sunset.webp',
      path: 'C:\\Pictures\\sunset.webp',
      type: 'image',
      size: 1024 * 300, // 300 KB
      modifiedAt: '2025-01-05T20:00:00.000Z',
    },
    {
      name: 'birthday.gif',
      path: 'C:\\Pictures\\birthday.gif',
      type: 'image',
      size: 1024 * 1024 * 5, // 5 MB
      modifiedAt: '2025-01-06T12:00:00.000Z',
    },
  ];
}

/**
 * 模拟异步加载
 */
function simulateLoading(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 测试缩略图网格组件
 */
function testGallery(): void {
  console.log('\n===== 缩略图网格组件测试 =====\n');

  // 创建组件
  const gallery = createGallery({
    container: '#gallery',
    emptyText: '没有找到媒体文件',
    loadingText: '正在加载媒体文件...',
    onClick: (item, index) => {
      console.log(`点击了第 ${index + 1} 个项目:`, item.name);
      console.log('  类型:', item.type);
      console.log('  路径:', item.path);
      console.log('  大小:', (item.size / 1024 / 1024).toFixed(2), 'MB');
    },
  });

  // 导出到全局以便控制台测试
  (window as unknown as Record<string, unknown>).gallery = gallery;
  (window as unknown as Record<string, unknown>).mockItems = createMockItems();

  console.log('✓ 缩略图网格组件已创建');
  console.log('');
  console.log('当前状态: 空状态（显示提示文本）');
  console.log('');
  console.log('测试命令:');
  console.log('  1. gallery.setLoading(true)     - 显示加载状态');
  console.log('  2. gallery.setLoading(false)    - 恢复空状态');
  console.log('  3. gallery.setItems(mockItems)  - 显示模拟数据');
  console.log('  4. gallery.clear()              - 清空列表');
  console.log('  5. gallery.getItems()           - 获取当前项目');
  console.log('');
  console.log('点击任意缩略图卡片，观察控制台输出');
  console.log('');
  console.log('自动测试流程（3秒后开始）...');

  // 自动测试流程
  setTimeout(async () => {
    console.log('\n--- 自动测试开始 ---\n');

    // 测试加载状态
    console.log('1. 设置加载状态...');
    gallery.setLoading(true);
    await simulateLoading(1500);

    // 测试显示数据
    console.log('2. 加载模拟数据...');
    gallery.setItems(createMockItems());
    gallery.setLoading(false);
    console.log('   已显示', gallery.getItems().length, '个项目');
    await simulateLoading(2000);

    // 测试清空
    console.log('3. 清空列表...');
    gallery.clear();
    await simulateLoading(1000);

    // 恢复数据
    console.log('4. 恢复数据显示...');
    gallery.setItems(createMockItems());

    console.log('\n--- 自动测试完成 ---');
    console.log('现在可以手动测试点击功能');
  }, 3000);
}

/**
 * 初始化应用
 */
function initApp(): void {
  console.log('媒体浏览器已启动');
  
  // 验证必要的DOM元素存在
  const requiredElements = ['app', 'path-input', 'gallery', 'pagination', 'lightbox'];
  
  for (const id of requiredElements) {
    try {
      getElement(id);
      console.log(`✓ 元素 #${id} 已就绪`);
    } catch (error) {
      console.error(`✗ 元素 #${id} 未找到`);
    }
  }
  
  // 测试缩略图网格组件
  testGallery();
}

// DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', initApp);

// 导出状态和工具函数供其他模块使用
export { state, getElement };
export type { AppState };
```

#### 4. 运行测试

1. **启动后端服务器**（新终端窗口，用于加载真实缩略图）：
```bash
   cd server
   npm run dev
   ```

2. **重新构建前端**：
   ```bash
   cd client
   npm run build
   ```

3. **打开浏览器测试**：
   - 打开 `client/index.html`
   - 打开开发者工具（F12）查看控制台

4. **观察自动测试流程**：

   | 阶段 | 时间 | 预期效果 |
   |------|------|----------|
   | 初始 | 0s | 显示空状态提示 "没有找到媒体文件" |
   | 加载 | 3s | 显示加载动画和 "正在加载媒体文件..." |
   | 数据 | 4.5s | 显示6个缩略图卡片（图片显示加载失败是正常的，因为路径是模拟的） |
   | 清空 | 6.5s | 回到空状态 |
   | 恢复 | 7.5s | 再次显示6个缩略图卡片 |

5. **手动测试**：

   | 测试项 | 操作 | 预期结果 |
   |--------|------|----------|
   | 点击卡片 | 点击任意缩略图 | 控制台输出文件信息 |
   | 悬停效果 | 鼠标悬停卡片 | 卡片上浮，图片轻微放大 |
   | 长文件名 | 查看第3个卡片 | 文件名被截断，显示省略号 |
   | 类型图标 | 查看卡片右上角 | 图片蓝色图标，视频红色图标 |
   | 文件大小 | 查看卡片底部 | 显示格式化的文件大小 |

6. **控制台命令测试**：
   ```javascript
   // 获取当前项目数量
   gallery.getItems().length  // 应返回 6

   // 手动设置加载状态
   gallery.setLoading(true)   // 显示加载动画
   gallery.setLoading(false)  // 显示空状态（因为items被清空了）

   // 重新设置数据
   gallery.setItems(mockItems) // 显示6个卡片
   ```

#### 5. 使用真实数据测试（可选）

如果想测试真实缩略图加载，可以修改测试代码中的路径为实际存在的图片路径：

```typescript
function createMockItems(): MediaItem[] {
return [
 {
 name: 'real_photo.jpg',
 path: 'C:\\Users\\Public\\Pictures\\Sample Pictures\\Chrysanthemum.jpg', // Windows示例图片
 type: 'image',
 size: 1024 * 1024,
 modifiedAt: '2025-01-01T10:00:00.000Z',
 },
 // ... 更多真实路径
];
}
```

#### 6. 测试完成后还原 index.ts

测试通过后，将 `client/src/index.ts` 还原为简洁版本：

```typescript
/**
 * 媒体浏览器前端入口
*/

// 应用状态类型
interface AppState {
currentPath: string;
currentPage: number;
pageSize: number;
isLoading: boolean;
}

// 全局应用状态
const state: AppState = {
currentPath: '',
currentPage: 1,
pageSize: 50,
isLoading: false,
};

/**
 * 获取DOM元素，如果不存在则抛出错误
*/
function getElement<T extends HTMLElement>(id: string): T {
const element = document.getElementById(id);
if (!element) {
 throw new Error(`Element with id "${id}" not found`);
}
return element as T;
}

/**
 * 初始化应用
*/
function initApp(): void {
console.log('媒体浏览器已启动');

// 验证必要的DOM元素存在
const requiredElements = ['app', 'path-input', 'gallery', 'pagination', 'lightbox'];

for (const id of requiredElements) {
 try {
 getElement(id);
 console.log(`✓ 元素 #${id} 已就绪`);
 } catch (error) {
 console.error(`✗ 元素 #${id} 未找到`);
 }
}

// TODO: 后续任务将在这里初始化各个组件
}

// DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', initApp);

// 导出状态和工具函数供其他模块使用
export { state, getElement };
export type { AppState };
```

然后重新构建：

```bash
cd client
npm run build
```

### 预期视觉效果

- **空状态**: 居中显示文件夹图标和提示文字
- **加载状态**: 居中显示旋转的加载动画
- **网格布局**: 响应式网格，自动适应窗口宽度
- **卡片样式**: 深色背景，圆角，悬停时上浮带阴影
- **缩略图**: 填充整个预览区域，悬停时轻微放大
- **类型图标**: 右上角圆形图标，图片蓝色/视频红色
- **文件信息**: 底部显示文件名（截断）和大小

---
## 🧑‍💻 User

请为我完整的更新项目文档

---
## 🧑‍💻 User

Task 2.4 已完成，继续 Task 2.5：实现分页组件

要求：
1. 创建 client/src/components/pagination.ts
2. 组件功能：
 - 显示当前页码、总页数、总数量
 - 上一页/下一页按钮
 - 首页/末页按钮
 - 页码按钮（显示当前页附近的几页）
 - 第一页时"上一页"禁用，最后一页时"下一页"禁用
3. 组件接口：
 - 挂载到 #pagination 容器
 - update(page, totalPages, total) - 更新分页状态
 - onPageChange 回调通知页码变化
 - 总页数为0或1时隐藏分页
4. 需要在 main.css 中添加分页样式
5. 给出独立测试方法

注意：
- 组件要能独立测试，不依赖其他组件
- 给出完整代码，不要省略
- 测试完成前，不需要更新项目文档。

---
## 🤖 Assistant

# Task 2.5: 实现分页组件

## 任务目标

创建分页控制组件，支持页码导航和状态显示。

## 涉及文件

| 文件 | 操作 | 说明 |
|------|------|------|
| `client/src/components/pagination.ts` | 创建 | 分页组件 |
| `client/styles/main.css` | 修改 | 添加分页样式 |

## 完整代码

### 1. client/src/components/pagination.ts

```typescript
/**
 * 分页组件
 * 提供页码导航和状态显示
 */

/** 分页组件配置 */
export interface PaginationConfig {
  /** 挂载容器元素或选择器 */
  container: HTMLElement | string;
  /** 页码变化回调 */
  onPageChange: (page: number) => void;
  /** 显示的页码按钮数量（默认5） */
  visiblePages?: number;
}

/** 分页状态 */
export interface PaginationState {
  /** 当前页码 */
  page: number;
  /** 总页数 */
  totalPages: number;
  /** 总数据量 */
  total: number;
}

/** 分页组件类 */
export class Pagination {
  private container: HTMLElement;
  private onPageChange: (page: number) => void;
  private visiblePages: number;
  private state: PaginationState = {
    page: 1,
    totalPages: 0,
    total: 0,
  };

  constructor(config: PaginationConfig) {
    // 解析容器
    if (typeof config.container === 'string') {
      const el = document.querySelector(config.container);
      if (!el) {
        throw new Error(`Container not found: ${config.container}`);
      }
      this.container = el as HTMLElement;
    } else {
      this.container = config.container;
    }

    this.onPageChange = config.onPageChange;
    this.visiblePages = config.visiblePages || 5;

    // 初始渲染
    this.render();
  }

  /**
   * 更新分页状态
   */
  public update(page: number, totalPages: number, total: number): void {
    this.state = { page, totalPages, total };
    this.render();
  }

  /**
   * 获取当前状态
   */
  public getState(): PaginationState {
    return { ...this.state };
  }

  /**
   * 跳转到指定页
   */
  public goToPage(page: number): void {
    if (page < 1 || page > this.state.totalPages || page === this.state.page) {
      return;
    }
    this.onPageChange(page);
  }

  /**
   * 上一页
   */
  public prevPage(): void {
    this.goToPage(this.state.page - 1);
  }

  /**
   * 下一页
   */
  public nextPage(): void {
    this.goToPage(this.state.page + 1);
  }

  /**
   * 首页
   */
  public firstPage(): void {
    this.goToPage(1);
  }

  /**
   * 末页
   */
  public lastPage(): void {
    this.goToPage(this.state.totalPages);
  }

  /**
   * 渲染组件
   */
  private render(): void {
    this.container.innerHTML = '';

    const { page, totalPages, total } = this.state;

    // 总页数为0或1时隐藏分页
    if (totalPages <= 1) {
      this.container.style.display = 'none';
      return;
    }

    this.container.style.display = '';

    // 创建分页容器
    const wrapper = document.createElement('div');
    wrapper.className = 'pagination';

    // 信息显示
    const info = document.createElement('span');
    info.className = 'pagination__info';
    info.textContent = `共 ${total} 项，第 ${page}/${totalPages} 页`;
    wrapper.appendChild(info);

    // 按钮组
    const buttons = document.createElement('div');
    buttons.className = 'pagination__buttons';

    // 首页按钮
    buttons.appendChild(this.createButton('«', () => this.firstPage(), page === 1, '首页'));

    // 上一页按钮
    buttons.appendChild(this.createButton('‹', () => this.prevPage(), page === 1, '上一页'));

    // 页码按钮
    const pageNumbers = this.calculatePageNumbers();
    for (const num of pageNumbers) {
      if (num === -1) {
        // 省略号
        const ellipsis = document.createElement('span');
        ellipsis.className = 'pagination__ellipsis';
        ellipsis.textContent = '…';
        buttons.appendChild(ellipsis);
      } else {
        const isActive = num === page;
        const btn = this.createButton(
          String(num),
          () => this.goToPage(num),
          false,
          `第 ${num} 页`
        );
        if (isActive) {
          btn.classList.add('pagination__btn--active');
        }
        buttons.appendChild(btn);
      }
    }

    // 下一页按钮
    buttons.appendChild(this.createButton('›', () => this.nextPage(), page === totalPages, '下一页'));

    // 末页按钮
    buttons.appendChild(this.createButton('»', () => this.lastPage(), page === totalPages, '末页'));

    wrapper.appendChild(buttons);
    this.container.appendChild(wrapper);
  }

  /**
   * 创建按钮
   */
  private createButton(
    text: string,
    onClick: () => void,
    disabled: boolean,
    title: string
  ): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pagination__btn';
    btn.textContent = text;
    btn.title = title;
    btn.disabled = disabled;

    if (!disabled) {
      btn.addEventListener('click', onClick);
    }

    return btn;
  }

  /**
   * 计算要显示的页码
   * 返回页码数组，-1 表示省略号
   */
  private calculatePageNumbers(): number[] {
    const { page, totalPages } = this.state;
    const visible = this.visiblePages;

    // 页数较少，全部显示
    if (totalPages <= visible + 2) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: number[] = [];
    const half = Math.floor(visible / 2);

    // 计算中间页码的起始和结束
    let start = page - half;
    let end = page + half;

    // 调整边界
    if (start < 2) {
      start = 2;
      end = start + visible - 1;
    }
    if (end > totalPages - 1) {
      end = totalPages - 1;
      start = end - visible + 1;
    }

    // 确保 start 不小于 2
    start = Math.max(2, start);
    end = Math.min(totalPages - 1, end);

    // 第一页
    pages.push(1);

    // 左侧省略号
    if (start > 2) {
      pages.push(-1);
    }

    // 中间页码
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // 右侧省略号
    if (end < totalPages - 1) {
      pages.push(-1);
    }

    // 最后一页
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  }

  /**
   * 销毁组件
   */
  public destroy(): void {
    this.container.innerHTML = '';
  }
}

/**
 * 创建分页组件的工厂函数
 */
export function createPagination(config: PaginationConfig): Pagination {
  return new Pagination(config);
}
```

### 2. client/styles/main.css（添加以下内容到文件末尾）

```css
/* ===== 分页组件 ===== */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.pagination__info {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  white-space: nowrap;
}

.pagination__buttons {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.pagination__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  padding: 0 var(--spacing-sm);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  user-select: none;
}

.pagination__btn:hover:not(:disabled) {
  background-color: var(--color-bg-hover);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.pagination__btn:active:not(:disabled) {
  transform: scale(0.95);
}

.pagination__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination__btn--active {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.pagination__btn--active:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
  color: white;
}

.pagination__ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  user-select: none;
}

/* 响应式调整 */
@media (max-width: 600px) {
  .pagination {
    gap: var(--spacing-sm);
  }

  .pagination__info {
    width: 100%;
    text-align: center;
    order: -1;
  }

  .pagination__btn {
    min-width: 32px;
    height: 32px;
    font-size: 0.8125rem;
  }

  .pagination__ellipsis {
    width: 24px;
  }
}
```

## 验收标准

### 检查清单

- [ ] **文件创建**: `client/src/components/pagination.ts` 已创建
- [ ] **样式更新**: `client/styles/main.css` 已添加分页样式
- [ ] **类型检查**: 运行 `npm run typecheck` 无错误
- [ ] **构建成功**: 运行 `npm run build` 成功
- [ ] **功能测试**: 所有分页功能正常

### 验收测试步骤

#### 1. 类型检查

```bash
cd client
npm run typecheck
# 应该无错误输出
```

#### 2. 构建

```bash
cd client
npm run build
# 应该输出 "Build complete!"
```

#### 3. 功能测试

为了独立测试组件，临时修改 `client/src/index.ts`：

```typescript
/**
 * 媒体浏览器前端入口
 * Task 2.5 测试版本
 */

import { createPagination, Pagination } from './components/pagination.ts';

// 应用状态类型
interface AppState {
  currentPath: string;
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
}

// 全局应用状态
const state: AppState = {
  currentPath: '',
  currentPage: 1,
  pageSize: 50,
  isLoading: false,
};

/**
 * 获取DOM元素，如果不存在则抛出错误
 */
function getElement<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Element with id "${id}" not found`);
  }
  return element as T;
}

/**
 * 测试分页组件
 */
function testPagination(): void {
  console.log('\n===== 分页组件测试 =====\n');

  // 创建组件
  const pagination = createPagination({
    container: '#pagination',
    visiblePages: 5,
    onPageChange: (page) => {
      console.log(`页码变化: ${page}`);
      state.currentPage = page;
      // 模拟更新分页状态
      pagination.update(page, pagination.getState().totalPages, pagination.getState().total);
    },
  });

  // 导出到全局以便控制台测试
  (window as unknown as Record<string, unknown>).pagination = pagination;

  console.log('✓ 分页组件已创建');
  console.log('');
  console.log('当前状态: 隐藏（总页数为0）');
  console.log('');
  console.log('测试命令:');
  console.log('  pagination.update(1, 10, 500)  - 设置为第1页，共10页，500项');
  console.log('  pagination.update(5, 10, 500)  - 设置为第5页');
  console.log('  pagination.update(1, 1, 50)    - 单页（隐藏分页）');
  console.log('  pagination.update(1, 0, 0)     - 无数据（隐藏分页）');
  console.log('  pagination.update(1, 20, 1000) - 20页测试省略号');
  console.log('  pagination.goToPage(3)         - 跳转到第3页');
  console.log('  pagination.nextPage()          - 下一页');
  console.log('  pagination.prevPage()          - 上一页');
  console.log('  pagination.firstPage()         - 首页');
  console.log('  pagination.lastPage()          - 末页');
  console.log('  pagination.getState()          - 获取当前状态');
  console.log('');

  // 自动测试流程
  console.log('自动测试流程（2秒后开始）...');

  setTimeout(async () => {
    console.log('\n--- 自动测试开始 ---\n');

    // 测试1: 基本分页
    console.log('1. 设置基本分页 (第1页，共5页，250项)');
    pagination.update(1, 5, 250);
    await delay(1500);

    // 测试2: 下一页
    console.log('2. 点击下一页');
    pagination.nextPage();
    await delay(1000);

    // 测试3: 跳转到末页
    console.log('3. 跳转到末页');
    pagination.lastPage();
    await delay(1000);

    // 测试4: 上一页（应该可用）
    console.log('4. 点击上一页');
    pagination.prevPage();
    await delay(1000);

    // 测试5: 多页省略号
    console.log('5. 设置多页分页 (第10页，共20页，1000项)');
    pagination.update(10, 20, 1000);
    await delay(1500);

    // 测试6: 跳转到首页
    console.log('6. 跳转到首页');
    pagination.firstPage();
    await delay(1000);

    // 测试7: 跳转到末页附近
    console.log('7. 跳转到第18页');
    pagination.goToPage(18);
    await delay(1000);

    // 测试8: 单页隐藏
    console.log('8. 设置单页 (应该隐藏分页)');
    pagination.update(1, 1, 30);
    await delay(1000);

    // 测试9: 恢复显示
    console.log('9. 恢复多页显示');
    pagination.update(3, 10, 500);

    console.log('\n--- 自动测试完成 ---');
    console.log('现在可以手动测试点击功能');
  }, 2000);
}

/**
 * 延迟函数
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 初始化应用
 */
function initApp(): void {
  console.log('媒体浏览器已启动');
  
  // 验证必要的DOM元素存在
  const requiredElements = ['app', 'path-input', 'gallery', 'pagination', 'lightbox'];
  
  for (const id of requiredElements) {
    try {
      getElement(id);
      console.log(`✓ 元素 #${id} 已就绪`);
    } catch (error) {
      console.error(`✗ 元素 #${id} 未找到`);
    }
  }
  
  // 测试分页组件
  testPagination();
}

// DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', initApp);

// 导出状态和工具函数供其他模块使用
export { state, getElement };
export type { AppState };
```

#### 4. 运行测试

1. **重新构建前端**：
```bash
   cd client
   npm run build
   ```

2. **打开浏览器测试**：
   - 打开 `client/index.html`
   - 打开开发者工具（F12）查看控制台

3. **观察自动测试流程**：

   | 阶段 | 时间 | 预期效果 |
   |------|------|----------|
   | 初始 | 0s | 分页隐藏（总页数为0） |
   | 测试1 | 2s | 显示分页：« ‹ [1] 2 3 4 5 › » |
   | 测试2 | 3.5s | 当前页变为2：« ‹ 1 [2] 3 4 5 › » |
   | 测试3 | 4.5s | 当前页变为5：« ‹ 1 2 3 4 [5] › » |
   | 测试4 | 5.5s | 当前页变为4 |
   | 测试5 | 6.5s | 显示省略号：« ‹ 1 … 8 9 [10] 11 12 … 20 › » |
   | 测试6 | 8s | 当前页变为1 |
   | 测试7 | 9s | 当前页变为18 |
   | 测试8 | 10s | 分页隐藏 |
   | 测试9 | 11s | 分页恢复显示 |

4. **手动测试**：

   | 测试项 | 操作 | 预期结果 |
   |--------|------|----------|
   | 页码点击 | 点击页码数字 | 切换到对应页，控制台输出页码 |
   | 首页禁用 | 在第1页时 | « 和 ‹ 按钮变灰，不可点击 |
   | 末页禁用 | 在最后一页时 | › 和 » 按钮变灰，不可点击 |
   | 当前页样式 | 观察当前页码 | 蓝色背景高亮显示 |
   | 悬停效果 | 鼠标悬停按钮 | 按钮边框和文字变蓝 |
   | 省略号 | 设置20页 | 中间显示 … 省略号 |

5. **控制台命令测试**：
   ```javascript
   // 获取当前状态
   pagination.getState()
   // 返回 {page: 3, totalPages: 10, total: 500}

   // 直接跳转
   pagination.goToPage(7)

   // 边界测试
   pagination.goToPage(0)   // 无效，不跳转
   pagination.goToPage(100) // 无效，不跳转

   // 测试隐藏
   pagination.update(1, 0, 0)  // 隐藏
   pagination.update(1, 1, 10) // 隐藏（单页）
   pagination.update(1, 2, 100) // 显示
   ```

#### 5. 测试完成后还原 index.ts

测试通过后，将 `client/src/index.ts` 还原为简洁版本：

```typescript
/**
 * 媒体浏览器前端入口
*/

// 应用状态类型
interface AppState {
currentPath: string;
currentPage: number;
pageSize: number;
isLoading: boolean;
}

// 全局应用状态
const state: AppState = {
currentPath: '',
currentPage: 1,
pageSize: 50,
isLoading: false,
};

/**
 * 获取DOM元素，如果不存在则抛出错误
*/
function getElement<T extends HTMLElement>(id: string): T {
const element = document.getElementById(id);
if (!element) {
 throw new Error(`Element with id "${id}" not found`);
}
return element as T;
}

/**
 * 初始化应用
*/
function initApp(): void {
console.log('媒体浏览器已启动');

// 验证必要的DOM元素存在
const requiredElements = ['app', 'path-input', 'gallery', 'pagination', 'lightbox'];

for (const id of requiredElements) {
 try {
 getElement(id);
 console.log(`✓ 元素 #${id} 已就绪`);
 } catch (error) {
 console.error(`✗ 元素 #${id} 未找到`);
 }
}

// TODO: 后续任务将在这里初始化各个组件
}

// DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', initApp);

// 导出状态和工具函数供其他模块使用
export { state, getElement };
export type { AppState };
```

然后重新构建：

```bash
cd client
npm run build
```

### 预期视觉效果

- **信息显示**: 左侧显示"共 X 项，第 Y/Z 页"
- **按钮组**: 右侧显示导航按钮
- **当前页**: 蓝色背景高亮
- **禁用状态**: 首页时首页/上一页按钮变灰，末页时下一页/末页按钮变灰
- **省略号**: 页数较多时中间显示省略号
- **响应式**: 窄屏时信息显示在上方，按钮在下方
- **悬停效果**: 按钮悬停时边框和文字变为主色调蓝色

---
## 🧑‍💻 User

请为我完整的更新项目文档

---
## 🧑‍💻 User

Task 2.5 已完成，继续 Task 2.6：实现灯箱组件（图片）

要求：
1. 创建 client/src/components/lightbox.ts
2. 组件功能：
 - 全屏显示原始图片
 - 显示文件名和基本信息
 - 关闭按钮（点击或按 ESC 关闭）
 - 上一张/下一张导航（按钮 + 左右方向键）
 - 点击背景关闭
3. 组件接口：
 - 挂载到 #lightbox 容器
 - open(items: MediaItem[], startIndex: number) - 打开灯箱
 - close() - 关闭灯箱
 - onClose 回调
4. 图片URL通过 apiClient.getFileUrl(path) 生成
5. 需要在 main.css 中添加灯箱样式
6. 给出独立测试方法

注意：
- 本任务只处理图片，视频支持在 Task 2.7 添加
- 需要处理键盘事件（ESC、左右方向键）
- 给出完整代码，不要省略

---
## 🤖 Assistant

# Task 2.6: 实现灯箱组件（图片）

## 任务目标

创建全屏预览灯箱组件，支持图片浏览和导航。

## 涉及文件

| 文件 | 操作 | 说明 |
|------|------|------|
| `client/src/components/lightbox.ts` | 创建 | 灯箱组件 |
| `client/styles/main.css` | 修改 | 添加灯箱样式 |

## 完整代码

### 1. client/src/components/lightbox.ts

```typescript
/**
 * 灯箱组件
 * 全屏预览图片，支持导航
 */

import type { MediaItem } from '@media-browser/shared/types';
import { getFileUrl } from '../api/client.ts';

/** 灯箱组件配置 */
export interface LightboxConfig {
  /** 挂载容器元素或选择器 */
  container: HTMLElement | string;
  /** 关闭回调 */
  onClose?: () => void;
  /** 索引变化回调 */
  onIndexChange?: (index: number) => void;
}

/** 灯箱组件类 */
export class Lightbox {
  private container: HTMLElement;
  private items: MediaItem[] = [];
  private currentIndex: number = 0;
  private isOpen: boolean = false;
  private onClose?: () => void;
  private onIndexChange?: (index: number) => void;

  // DOM 元素
  private overlay: HTMLElement | null = null;
  private content: HTMLElement | null = null;
  private mediaContainer: HTMLElement | null = null;
  private infoBar: HTMLElement | null = null;
  private prevButton: HTMLButtonElement | null = null;
  private nextButton: HTMLButtonElement | null = null;
  private closeButton: HTMLButtonElement | null = null;

  // 绑定的事件处理函数（用于移除事件监听）
  private boundHandleKeyDown: (e: KeyboardEvent) => void;

  constructor(config: LightboxConfig) {
    // 解析容器
    if (typeof config.container === 'string') {
      const el = document.querySelector(config.container);
      if (!el) {
        throw new Error(`Container not found: ${config.container}`);
      }
      this.container = el as HTMLElement;
    } else {
      this.container = config.container;
    }

    this.onClose = config.onClose;
    this.onIndexChange = config.onIndexChange;

    // 绑定键盘事件处理函数
    this.boundHandleKeyDown = this.handleKeyDown.bind(this);

    // 初始渲染
    this.render();
  }

  /**
   * 打开灯箱
   */
  public open(items: MediaItem[], startIndex: number = 0): void {
    if (items.length === 0) {
      return;
    }

    this.items = items;
    this.currentIndex = Math.max(0, Math.min(startIndex, items.length - 1));
    this.isOpen = true;

    // 显示灯箱
    this.container.classList.remove('lightbox--hidden');
    document.body.style.overflow = 'hidden';

    // 添加键盘事件监听
    document.addEventListener('keydown', this.boundHandleKeyDown);

    // 显示当前项
    this.showCurrentItem();
  }

  /**
   * 关闭灯箱
   */
  public close(): void {
    if (!this.isOpen) {
      return;
    }

    this.isOpen = false;
    this.container.classList.add('lightbox--hidden');
    document.body.style.overflow = '';

    // 移除键盘事件监听
    document.removeEventListener('keydown', this.boundHandleKeyDown);

    // 清空媒体内容
    if (this.mediaContainer) {
      this.mediaContainer.innerHTML = '';
    }

    // 触发关闭回调
    if (this.onClose) {
      this.onClose();
    }
  }

  /**
   * 显示上一张
   */
  public prev(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.showCurrentItem();
      this.notifyIndexChange();
    }
  }

  /**
   * 显示下一张
   */
  public next(): void {
    if (this.currentIndex < this.items.length - 1) {
      this.currentIndex++;
      this.showCurrentItem();
      this.notifyIndexChange();
    }
  }

  /**
   * 跳转到指定索引
   */
  public goTo(index: number): void {
    if (index >= 0 && index < this.items.length && index !== this.currentIndex) {
      this.currentIndex = index;
      this.showCurrentItem();
      this.notifyIndexChange();
    }
  }

  /**
   * 获取当前索引
   */
  public getCurrentIndex(): number {
    return this.currentIndex;
  }

  /**
   * 获取当前项
   */
  public getCurrentItem(): MediaItem | null {
    return this.items[this.currentIndex] || null;
  }

  /**
   * 是否打开状态
   */
  public getIsOpen(): boolean {
    return this.isOpen;
  }

  /**
   * 渲染组件结构
   */
  private render(): void {
    this.container.innerHTML = '';
    this.container.className = 'lightbox lightbox--hidden';

    // 创建遮罩层
    this.overlay = document.createElement('div');
    this.overlay.className = 'lightbox__overlay';
    this.overlay.addEventListener('click', () => this.close());

    // 创建内容区域
    this.content = document.createElement('div');
    this.content.className = 'lightbox__content';

    // 关闭按钮
    this.closeButton = document.createElement('button');
    this.closeButton.type = 'button';
    this.closeButton.className = 'lightbox__close';
    this.closeButton.innerHTML = this.getCloseIcon();
    this.closeButton.title = '关闭 (ESC)';
    this.closeButton.addEventListener('click', () => this.close());

    // 上一张按钮
    this.prevButton = document.createElement('button');
    this.prevButton.type = 'button';
    this.prevButton.className = 'lightbox__nav lightbox__nav--prev';
    this.prevButton.innerHTML = this.getPrevIcon();
    this.prevButton.title = '上一张 (←)';
    this.prevButton.addEventListener('click', (e) => {
      e.stopPropagation();
      this.prev();
    });

    // 下一张按钮
    this.nextButton = document.createElement('button');
    this.nextButton.type = 'button';
    this.nextButton.className = 'lightbox__nav lightbox__nav--next';
    this.nextButton.innerHTML = this.getNextIcon();
    this.nextButton.title = '下一张 (→)';
    this.nextButton.addEventListener('click', (e) => {
      e.stopPropagation();
      this.next();
    });

    // 媒体容器
    this.mediaContainer = document.createElement('div');
    this.mediaContainer.className = 'lightbox__media';

    // 信息栏
    this.infoBar = document.createElement('div');
    this.infoBar.className = 'lightbox__info';

    // 组装结构
    this.content.appendChild(this.closeButton);
    this.content.appendChild(this.prevButton);
    this.content.appendChild(this.nextButton);
    this.content.appendChild(this.mediaContainer);
    this.content.appendChild(this.infoBar);

    this.container.appendChild(this.overlay);
    this.container.appendChild(this.content);
  }

  /**
   * 显示当前项
   */
  private showCurrentItem(): void {
    const item = this.items[this.currentIndex];
    if (!item || !this.mediaContainer || !this.infoBar) {
      return;
    }

    // 清空媒体容器
    this.mediaContainer.innerHTML = '';

    // 根据类型显示内容
    if (item.type === 'image') {
      this.showImage(item);
    } else {
      // 视频支持将在 Task 2.7 添加
      this.showUnsupported(item);
    }

    // 更新信息栏
    this.updateInfoBar(item);

    // 更新导航按钮状态
    this.updateNavButtons();
  }

  /**
   * 显示图片
   */
  private showImage(item: MediaItem): void {
    if (!this.mediaContainer) return;

    // 创建加载指示器
    const loader = document.createElement('div');
    loader.className = 'lightbox__loader';

    // 创建图片元素
    const img = document.createElement('img');
    img.className = 'lightbox__image';
    img.alt = item.name;

    // 图片加载完成后移除加载指示器
    img.onload = () => {
      loader.remove();
      img.classList.add('lightbox__image--loaded');
    };

    // 图片加载失败
    img.onerror = () => {
      loader.remove();
      const error = document.createElement('div');
      error.className = 'lightbox__error';
      error.textContent = '图片加载失败';
      this.mediaContainer?.appendChild(error);
    };

    // 设置图片源
    img.src = getFileUrl(item.path);

    this.mediaContainer.appendChild(loader);
    this.mediaContainer.appendChild(img);
  }

  /**
   * 显示不支持的类型
   */
  private showUnsupported(item: MediaItem): void {
    if (!this.mediaContainer) return;

    const message = document.createElement('div');
    message.className = 'lightbox__unsupported';
    message.textContent = `暂不支持预览 ${item.type} 类型文件`;
    this.mediaContainer.appendChild(message);
  }

  /**
   * 更新信息栏
   */
  private updateInfoBar(item: MediaItem): void {
    if (!this.infoBar) return;

    const index = this.currentIndex + 1;
    const total = this.items.length;
    const size = this.formatFileSize(item.size);

    this.infoBar.innerHTML = `
      <span class="lightbox__filename" title="${item.path}">${item.name}</span>
      <span class="lightbox__meta">
        <span class="lightbox__size">${size}</span>
        <span class="lightbox__counter">${index} / ${total}</span>
      </span>
    `;
  }

  /**
   * 更新导航按钮状态
   */
  private updateNavButtons(): void {
    if (this.prevButton) {
      this.prevButton.disabled = this.currentIndex === 0;
    }
    if (this.nextButton) {
      this.nextButton.disabled = this.currentIndex === this.items.length - 1;
    }
  }

  /**
   * 处理键盘事件
   */
  private handleKeyDown(e: KeyboardEvent): void {
    if (!this.isOpen) return;

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        this.close();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        this.prev();
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.next();
        break;
    }
  }

  /**
   * 通知索引变化
   */
  private notifyIndexChange(): void {
    if (this.onIndexChange) {
      this.onIndexChange(this.currentIndex);
    }
  }

  /**
   * 格式化文件大小
   */
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  /**
   * 获取关闭图标
   */
  private getCloseIcon(): string {
    return `<svg viewBox="0 0 24 24" width="24" height="24">
      <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    </svg>`;
  }

  /**
   * 获取上一张图标
   */
  private getPrevIcon(): string {
    return `<svg viewBox="0 0 24 24" width="32" height="32">
      <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
    </svg>`;
  }

  /**
   * 获取下一张图标
   */
  private getNextIcon(): string {
    return `<svg viewBox="0 0 24 24" width="32" height="32">
      <path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
    </svg>`;
  }

  /**
   * 销毁组件
   */
  public destroy(): void {
    this.close();
    this.container.innerHTML = '';
    this.items = [];
  }
}

/**
 * 创建灯箱组件的工厂函数
 */
export function createLightbox(config: LightboxConfig): Lightbox {
  return new Lightbox(config);
}
```

### 2. client/styles/main.css（添加以下内容到文件末尾）

```css
/* ===== 灯箱组件 ===== */
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox--hidden {
  display: none;
}

/* 遮罩层 */
.lightbox__overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.95);
  cursor: pointer;
}

/* 内容区域 */
.lightbox__content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: var(--spacing-xl);
  pointer-events: none;
}

.lightbox__content > * {
  pointer-events: auto;
}

/* 关闭按钮 */
.lightbox__close {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: background-color var(--transition-fast);
  z-index: 10;
}

.lightbox__close:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

/* 导航按钮 */
.lightbox__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: background-color var(--transition-fast), opacity var(--transition-fast);
  z-index: 10;
}

.lightbox__nav:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.2);
}

.lightbox__nav:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.lightbox__nav--prev {
  left: var(--spacing-md);
}

.lightbox__nav--next {
  right: var(--spacing-md);
}

/* 媒体容器 */
.lightbox__media {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: calc(100% - 120px);
  max-height: calc(100% - 100px);
  position: relative;
}

/* 图片 */
.lightbox__image {
  max-width: 100%;
  max-height: calc(100vh - 150px);
  object-fit: contain;
  opacity: 0;
  transition: opacity var(--transition-normal);
  user-select: none;
  -webkit-user-drag: none;
}

.lightbox__image--loaded {
  opacity: 1;
}

/* 加载指示器 */
.lightbox__loader {
  position: absolute;
  width: 48px;
  height: 48px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* 错误提示 */
.lightbox__error {
  color: #ff6b6b;
  font-size: 1rem;
  padding: var(--spacing-lg);
  text-align: center;
}

/* 不支持的类型 */
.lightbox__unsupported {
  color: var(--color-text-secondary);
  font-size: 1rem;
  padding: var(--spacing-lg);
  text-align: center;
}

/* 信息栏 */
.lightbox__info {
  position: absolute;
  bottom: var(--spacing-md);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: var(--radius-md);
  color: white;
  font-size: 0.875rem;
  max-width: calc(100% - var(--spacing-xl) * 2);
}

.lightbox__filename {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 400px;
}

.lightbox__meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.lightbox__counter {
  font-weight: 500;
  color: var(--color-primary);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .lightbox__content {
    padding: var(--spacing-md);
  }

  .lightbox__nav {
    width: 44px;
    height: 44px;
  }

  .lightbox__nav--prev {
    left: var(--spacing-xs);
  }

  .lightbox__nav--next {
    right: var(--spacing-xs);
  }

  .lightbox__media {
    max-width: calc(100% - 60px);
  }

  .lightbox__image {
    max-height: calc(100vh - 120px);
  }

  .lightbox__info {
    flex-direction: column;
    gap: var(--spacing-xs);
    text-align: center;
  }

  .lightbox__filename {
    max-width: 100%;
  }
}
```

## 验收标准

### 检查清单

- [ ] **文件创建**: `client/src/components/lightbox.ts` 已创建
- [ ] **样式更新**: `client/styles/main.css` 已添加灯箱样式
- [ ] **类型检查**: 运行 `npm run typecheck` 无错误
- [ ] **构建成功**: 运行 `npm run build` 成功
- [ ] **功能测试**: 所有灯箱功能正常

### 验收测试步骤

#### 1. 类型检查

```bash
cd client
npm run typecheck
# 应该无错误输出
```

#### 2. 构建

```bash
cd client
npm run build
# 应该输出 "Build complete!"
```

#### 3. 功能测试

为了独立测试组件，临时修改 `client/src/index.ts`：

```typescript
/**
 * 媒体浏览器前端入口
 * Task 2.6 测试版本
 */

import { createLightbox, Lightbox } from './components/lightbox.ts';
import type { MediaItem } from '@media-browser/shared/types';

// 应用状态类型
interface AppState {
  currentPath: string;
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
}

// 全局应用状态
const state: AppState = {
  currentPath: '',
  currentPage: 1,
  pageSize: 50,
  isLoading: false,
};

/**
 * 获取DOM元素，如果不存在则抛出错误
 */
function getElement<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Element with id "${id}" not found`);
  }
  return element as T;
}

/**
 * 创建模拟图片数据
 * 注意：请将路径替换为你电脑上实际存在的图片路径
 */
function createMockItems(): MediaItem[] {
  // Windows 示例图片路径（请根据实际情况修改）
  return [
    {
      name: 'Chrysanthemum.jpg',
      path: 'C:\\Users\\Public\\Pictures\\Sample Pictures\\Chrysanthemum.jpg',
      type: 'image',
      size: 879394,
      modifiedAt: '2025-01-01T10:00:00.000Z',
    },
    {
      name: 'Desert.jpg',
      path: 'C:\\Users\\Public\\Pictures\\Sample Pictures\\Desert.jpg',
      type: 'image',
      size: 845941,
      modifiedAt: '2025-01-02T10:00:00.000Z',
    },
    {
      name: 'Hydrangeas.jpg',
      path: 'C:\\Users\\Public\\Pictures\\Sample Pictures\\Hydrangeas.jpg',
      type: 'image',
      size: 595284,
      modifiedAt: '2025-01-03T10:00:00.000Z',
    },
    {
      name: 'Jellyfish.jpg',
      path: 'C:\\Users\\Public\\Pictures\\Sample Pictures\\Jellyfish.jpg',
      type: 'image',
      size: 775702,
      modifiedAt: '2025-01-04T10:00:00.000Z',
    },
    {
      name: 'Koala.jpg',
      path: 'C:\\Users\\Public\\Pictures\\Sample Pictures\\Koala.jpg',
      type: 'image',
      size: 780831,
      modifiedAt: '2025-01-05T10:00:00.000Z',
    },
    {
      name: 'test_video.mp4',
      path: 'C:\\Videos\\test.mp4',
      type: 'video',
      size: 1024 * 1024 * 50,
      modifiedAt: '2025-01-06T10:00:00.000Z',
    },
  ];
}

/**
 * 测试灯箱组件
 */
function testLightbox(): void {
  console.log('\n===== 灯箱组件测试 =====\n');

  const mockItems = createMockItems();

  // 创建组件
  const lightbox = createLightbox({
    container: '#lightbox',
    onClose: () => {
      console.log('灯箱已关闭');
    },
    onIndexChange: (index) => {
      console.log('当前索引:', index, '文件:', mockItems[index]?.name);
    },
  });

  // 导出到全局以便控制台测试
  (window as unknown as Record<string, unknown>).lightbox = lightbox;
  (window as unknown as Record<string, unknown>).mockItems = mockItems;

  console.log('✓ 灯箱组件已创建');
  console.log('');
  console.log('测试命令:');
  console.log('  lightbox.open(mockItems, 0)  - 打开灯箱，从第1张开始');
  console.log('  lightbox.open(mockItems, 2)  - 打开灯箱，从第3张开始');
  console.log('  lightbox.close()             - 关闭灯箱');
  console.log('  lightbox.next()              - 下一张');
  console.log('  lightbox.prev()              - 上一张');
  console.log('  lightbox.goTo(3)             - 跳转到第4张');
  console.log('  lightbox.getCurrentIndex()   - 获取当前索引');
  console.log('  lightbox.getCurrentItem()    - 获取当前项');
  console.log('  lightbox.getIsOpen()         - 是否打开');
  console.log('');
  console.log('键盘操作（灯箱打开时）:');
  console.log('  ESC        - 关闭灯箱');
  console.log('  ←（左箭头）- 上一张');
  console.log('  →（右箭头）- 下一张');
  console.log('');
  console.log('鼠标操作:');
  console.log('  点击背景   - 关闭灯箱');
  console.log('  点击 X     - 关闭灯箱');
  console.log('  点击 < >   - 上/下一张');
  console.log('');

  // 在 gallery 区域创建测试按钮
  const gallery = getElement('gallery');
  gallery.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 16px; padding: 20px;">
      <h3 style="color: white;">灯箱组件测试</h3>
      <p style="color: #aaa;">点击下方按钮打开灯箱，或在控制台使用命令测试</p>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button id="btn-open-0" class="btn btn--primary">打开第1张图片</button>
        <button id="btn-open-2" class="btn btn--primary">打开第3张图片</button>
        <button id="btn-open-last" class="btn btn--primary">打开最后一张（视频）</button>
      </div>
      <p style="color: #888; font-size: 14px;">
        注意：需要启动后端服务器 (npm run dev) 才能加载真实图片。<br>
        如果图片路径不存在，会显示"图片加载失败"。
      </p>
    </div>
  `;

  // 绑定按钮事件
  document.getElementById('btn-open-0')?.addEventListener('click', () => {
    console.log('打开灯箱，从第1张开始');
    lightbox.open(mockItems, 0);
  });

  document.getElementById('btn-open-2')?.addEventListener('click', () => {
    console.log('打开灯箱，从第3张开始');
    lightbox.open(mockItems, 2);
  });

  document.getElementById('btn-open-last')?.addEventListener('click', () => {
    console.log('打开灯箱，显示视频（暂不支持）');
    lightbox.open(mockItems, mockItems.length - 1);
  });
}

/**
 * 初始化应用
 */
function initApp(): void {
  console.log('媒体浏览器已启动');
  
  // 验证必要的DOM元素存在
  const requiredElements = ['app', 'path-input', 'gallery', 'pagination', 'lightbox'];
  
  for (const id of requiredElements) {
    try {
      getElement(id);
      console.log(`✓ 元素 #${id} 已就绪`);
    } catch (error) {
      console.error(`✗ 元素 #${id} 未找到`);
    }
  }
  
  // 测试灯箱组件
  testLightbox();
}

// DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', initApp);

// 导出状态和工具函数供其他模块使用
export { state, getElement };
export type { AppState };
```

#### 4. 运行测试

1. **启动后端服务器**（新终端窗口）：
```bash
   cd server
   npm run dev
   ```

2. **重新构建前端**：
   ```bash
   cd client
   npm run build
   ```

3. **打开浏览器测试**：
   - 打开 `client/index.html`
   - 打开开发者工具（F12）查看控制台

4. **功能测试**：

   | 测试项 | 操作 | 预期结果 |
   |--------|------|----------|
   | 打开灯箱 | 点击"打开第1张图片"按钮 | 灯箱全屏显示，显示图片或加载失败提示 |
   | 关闭-背景 | 点击黑色背景区域 | 灯箱关闭，控制台输出"灯箱已关闭" |
   | 关闭-按钮 | 点击右上角 X 按钮 | 灯箱关闭 |
   | 关闭-ESC | 按 ESC 键 | 灯箱关闭 |
   | 下一张-按钮 | 点击右侧 > 按钮 | 切换到下一张，索引变化 |
   | 下一张-键盘 | 按右箭头键 | 切换到下一张 |
   | 上一张-按钮 | 点击左侧 < 按钮 | 切换到上一张 |
   | 上一张-键盘 | 按左箭头键 | 切换到上一张 |
   | 边界-首张 | 在第1张时点击上一张 | 按钮禁用，无响应 |
   | 边界-末张 | 在最后一张时点击下一张 | 按钮禁用，无响应 |
   | 信息栏 | 查看底部信息 | 显示文件名、大小、当前索引/总数 |
   | 视频提示 | 打开最后一张（视频） | 显示"暂不支持预览 video 类型文件" |

5. **控制台命令测试**：
   ```javascript
   // 打开灯箱
   lightbox.open(mockItems, 0)

   // 导航
   lightbox.next()
   lightbox.prev()
   lightbox.goTo(3)

   // 获取状态
   lightbox.getCurrentIndex()  // 返回当前索引
   lightbox.getCurrentItem()   // 返回当前 MediaItem
   lightbox.getIsOpen()        // 返回 true

   // 关闭
   lightbox.close()
   lightbox.getIsOpen()        // 返回 false
   ```

#### 5. 使用真实图片测试

如果 Windows 示例图片路径不存在，请修改 `createMockItems()` 中的路径为你电脑上实际存在的图片：

```typescript
function createMockItems(): MediaItem[] {
return [
 {
 name: 'my_photo.jpg',
 path: 'D:\\Photos\\my_photo.jpg', // 修改为实际路径
 type: 'image',
 size: 1024000,
 modifiedAt: '2025-01-01T10:00:00.000Z',
 },
 // ...
];
}
```

#### 6. 测试完成后还原 index.ts

测试通过后，将 `client/src/index.ts` 还原为简洁版本：

```typescript
/**
 * 媒体浏览器前端入口
*/

// 应用状态类型
interface AppState {
currentPath: string;
currentPage: number;
pageSize: number;
isLoading: boolean;
}

// 全局应用状态
const state: AppState = {
currentPath: '',
currentPage: 1,
pageSize: 50,
isLoading: false,
};

/**
 * 获取DOM元素，如果不存在则抛出错误
*/
function getElement<T extends HTMLElement>(id: string): T {
const element = document.getElementById(id);
if (!element) {
 throw new Error(`Element with id "${id}" not found`);
}
return element as T;
}

/**
 * 初始化应用
*/
function initApp(): void {
console.log('媒体浏览器已启动');

// 验证必要的DOM元素存在
const requiredElements = ['app', 'path-input', 'gallery', 'pagination', 'lightbox'];

for (const id of requiredElements) {
 try {
 getElement(id);
 console.log(`✓ 元素 #${id} 已就绪`);
 } catch (error) {
 console.error(`✗ 元素 #${id} 未找到`);
 }
}

// TODO: 后续任务将在这里初始化各个组件
}

// DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', initApp);

// 导出状态和工具函数供其他模块使用
export { state, getElement };
export type { AppState };
```

然后重新构建：

```bash
cd client
npm run build
```

### 预期视觉效果

- **遮罩层**: 95%不透明黑色背景
- **关闭按钮**: 右上角圆形半透明按钮
- **导航按钮**: 左右两侧圆形半透明按钮，禁用时变暗
- **图片显示**: 居中显示，保持比例，带加载动画
- **信息栏**: 底部居中，显示文件名、大小、计数器
- **加载动画**: 白色旋转圆环
- **错误提示**: 红色文字"图片加载失败"
- **响应式**: 移动端按钮变小，信息栏垂直排列

---
## 🧑‍💻 User

请完整的更新项目文档

---
## 🤖 Assistant

# 项目文档更新

请将 `docs/project-summary.md` 更新为以下内容：

```markdown
# 媒体浏览器项目文档

> 最后更新: Task 2.6 完成后
> 当前阶段: 前端开发进行中

---

## 1. 项目架构概览

### 1.1 项目简介

基于网页的本地图片和视频浏览器，前后端分离架构，支持缩略图预览和分页浏览。

### 1.2 目录结构

```
media-browser/
├── package.json # 根目录，workspace配置
├── .gitignore
├── docs/
│ └── project-summary.md # 项目文档（本文件）
├── shared/ # 前后端共享代码
│ ├── package.json
│ ├── tsconfig.json
│ └── types.ts # 共享类型定义
├── server/ # 后端
│ ├── package.json
│ ├── tsconfig.json
│ └── src/
│ ├── index.ts # 服务器入口
│ ├── api/ # API路由层
│ │ ├── index.ts # 路由注册和公共函数
│ │ ├── media.ts # 媒体列表API
│ │ ├── thumbnail.ts # 缩略图API
│ │ └── file.ts # 原始文件API
│ ├── services/ # 业务逻辑层
│ │ ├── file-scanner.ts # 文件扫描服务
│ │ └── thumbnail-generator.ts # 缩略图生成服务
│ └── utils/
│ └── mime-types.ts # MIME类型工具
└── client/ # 前端
 ├── package.json
 ├── tsconfig.json
 ├── index.html # HTML页面
 ├── build.mjs # esbuild构建脚本
 ├── styles/
 │ └── main.css # 全局样式
 ├── dist/ # 构建输出（gitignore）
 │ └── bundle.js
 └── src/
 ├── index.ts # 前端入口
 ├── api/
 │ └── client.ts # API客户端 ✅
 └── components/
 ├── path-input.ts # 路径输入组件 ✅
 ├── gallery.ts # 缩略图网格组件 ✅
 ├── pagination.ts # 分页组件 ✅
 └── lightbox.ts # 灯箱组件 ✅
```

### 1.3 模块划分及职责

#### 后端模块

| 模块 | 文件 | 职责 |
|------|------|------|
| **shared** | `shared/types.ts` | 前后端共享的TypeScript类型定义 |
| **api** | `server/src/api/*` | HTTP路由，请求解析，响应格式化 |
| **file-scanner** | `server/src/services/file-scanner.ts` | 扫描目录，过滤媒体文件，返回文件信息 |
| **thumbnail** | `server/src/services/thumbnail-generator.ts` | 生成图片/视频缩略图 |
| **utils** | `server/src/utils/mime-types.ts` | MIME类型判断工具 |

#### 前端模块

| 模块 | 文件 | 职责 | 状态 |
|------|------|------|------|
| **api-client** | `client/src/api/client.ts` | 封装后端API调用 | ✅ 完成 |
| **path-input** | `client/src/components/path-input.ts` | 路径输入组件 | ✅ 完成 |
| **gallery** | `client/src/components/gallery.ts` | 缩略图网格展示 | ✅ 完成 |
| **pagination** | `client/src/components/pagination.ts` | 分页控制组件 | ✅ 完成 |
| **lightbox** | `client/src/components/lightbox.ts` | 全屏预览组件 | ✅ 完成（图片） |

### 1.4 技术栈

| 层级 | 技术选型 | 说明 |
|------|----------|------|
| **前端** | 原生TypeScript + HTML/CSS | 不使用框架，保持轻量 |
| **后端** | Node.js + TypeScript | 使用原生http模块 |
| **图片处理** | sharp | 高性能图片缩放裁切 |
| **视频处理** | fluent-ffmpeg + FFmpeg | 视频帧提取 |
| **构建工具** | esbuild | 前端打包 |
| **包管理** | npm workspaces | monorepo管理 |

---

## 2. 已完成的任务清单

### 阶段0：项目初始化

| 任务 | 描述 | 状态 |
|------|------|------|
| Task 0.1 | 创建项目结构和配置文件 | ✅ 完成 |
| Task 0.2 | 创建共享类型定义 | ✅ 完成 |

### 阶段1：后端核心

| 任务 | 描述 | 状态 |
|------|------|------|
| Task 1.1 | 实现HTTP服务器骨架 | ✅ 完成 |
| Task 1.2 | 实现文件扫描服务 | ✅ 完成 |
| Task 1.3 | 实现媒体列表API | ✅ 完成 |
| Task 1.4 | 实现图片缩略图生成 | ✅ 完成 |
| Task 1.5 | 实现视频缩略图生成 | ✅ 完成 |
| Task 1.6 | 实现缩略图API | ✅ 完成 |
| Task 1.7 | 实现原始文件API | ✅ 完成 |

### 阶段2：前端核心

| 任务 | 描述 | 状态 |
|------|------|------|
| Task 2.1 | 创建HTML骨架和入口 | ✅ 完成 |
| Task 2.2 | 实现API客户端 | ✅ 完成 |
| Task 2.3 | 实现路径输入组件 | ✅ 完成 |
| Task 2.4 | 实现缩略图网格组件 | ✅ 完成 |
| Task 2.5 | 实现分页组件 | ✅ 完成 |
| Task 2.6 | 实现灯箱组件（图片） | ✅ 完成 |
| Task 2.7 | 扩展灯箱组件（视频） | ⏳ 待开始 |
| Task 2.8 | 整合所有组件 | ⏳ 待开始 |

### 阶段3：完善（待开始）

| 任务 | 描述 | 状态 |
|------|------|------|
| Task 3.1 | 添加加载状态和错误处理UI | ⏳ 待开始 |
| Task 3.2 | 缩略图懒加载 | ⏳ 待开始 |

---

## 3. 后端API接口汇总

### 3.1 接口列表

| 方法 | 路径 | 功能 | 参数 |
|------|------|------|------|
| GET | `/api/health` | 健康检查 | 无 |
| GET | `/api/media` | 获取媒体列表 | path, page, pageSize |
| GET | `/api/thumbnail` | 获取缩略图 | path |
| GET | `/api/file` | 获取原始文件 | path |

### 3.2 接口详细说明

#### GET /api/health

健康检查接口。

**请求参数**: 无

**成功响应**:
```json
{
"status": "ok",
"timestamp": "2025-12-03T14:00:00.000Z"
}
```

---

#### GET /api/media

获取指定目录的媒体文件列表（分页）。

**请求参数**:

| 参数 | 类型 | 必需 | 默认值 | 说明 |
|------|------|------|--------|------|
| path | string | 是 | - | 文件夹绝对路径 |
| page | number | 否 | 1 | 页码，从1开始 |
| pageSize | number | 否 | 50 | 每页数量，最大200 |

**成功响应**:
```json
{
"success": true,
"data": {
 "items": [
 {
 "name": "photo.jpg",
 "path": "X:\\TestFolder\\photo.jpg",
 "type": "image",
 "size": 25420,
 "modifiedAt": "2025-11-26T11:33:13.957Z"
 }
 ],
 "total": 100,
 "page": 1,
 "pageSize": 50,
 "totalPages": 2
}
}
```

**错误响应**:

| 状态码 | 错误信息 | 说明 |
|--------|----------|------|
| 400 | Missing required parameter: path | 缺少path参数 |
| 400 | Path is not a directory | 路径不是目录 |
| 404 | Directory not found | 目录不存在 |
| 403 | Permission denied | 无权限访问 |

---

#### GET /api/thumbnail

获取指定文件的缩略图（200x200 JPEG）。

**请求参数**:

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| path | string | 是 | 文件绝对路径 |

**成功响应**:
- Content-Type: `image/jpeg`
- Body: 缩略图二进制数据
- Cache-Control: `public, max-age=86400`

**错误响应**:

| 状态码 | 错误信息 | 说明 |
|--------|----------|------|
| 400 | Missing required parameter: path | 缺少path参数 |
| 400 | Unsupported file type | 不支持的文件类型 |
| 404 | File not found | 文件不存在 |
| 500 | FFmpeg not found | FFmpeg未安装（视频） |

---

#### GET /api/file

获取原始媒体文件（支持Range请求）。

**请求参数**:

| 参数 | 类型 | 必需 | 说明 |
|------|------|------|------|
| path | string | 是 | 文件绝对路径 |

**请求头**（可选）:
- `Range`: 如 `bytes=0-1023`

**成功响应**（完整文件）:
- 状态码: 200
- Content-Type: 根据文件类型
- Accept-Ranges: bytes
- Cache-Control: `public, max-age=86400`

**成功响应**（Range请求）:
- 状态码: 206
- Content-Type: 根据文件类型
- Content-Range: `bytes 0-1023/25420`
- Accept-Ranges: bytes

**错误响应**:

| 状态码 | 错误信息 | 说明 |
|--------|----------|------|
| 400 | Missing required parameter: path | 缺少path参数 |
| 400 | Unsupported file type | 不支持的文件类型 |
| 404 | File not found | 文件不存在 |
| 403 | Permission denied | 无权限访问 |
| 416 | - | 无效的Range请求 |

---

## 4. 前端模块接口文档

### 4.1 API客户端 (client/src/api/client.ts)

#### 导出接口

```typescript
/** API 客户端错误类 */
export class ApiError extends Error {
constructor(
 message: string,
 public readonly statusCode: number,
 public readonly endpoint: string
);
}

/** 健康检查响应 */
export interface HealthResponse {
status: string;
timestamp: string;
}

/** 获取媒体列表参数 */
export interface GetMediaListParams {
path: string;
page?: number;
pageSize?: number;
}

/** 健康检查 */
export function checkHealth(): Promise<HealthResponse>;

/** 获取媒体列表 */
export function getMediaList(params: GetMediaListParams): Promise<PaginatedResponse<MediaItem>>;

/** 获取缩略图URL（不发起请求） */
export function getThumbnailUrl(filePath: string): string;

/** 获取缩略图二进制数据 */
export function getThumbnail(filePath: string): Promise<Blob>;

/** 获取原始文件URL（不发起请求） */
export function getFileUrl(filePath: string): string;

/** 获取原始文件二进制数据 */
export function getFile(filePath: string): Promise<Blob>;

/** API客户端对象（汇总所有方法） */
export const apiClient;
```

#### 使用示例

```typescript
import { apiClient, ApiError } from './api/client.ts';

// 获取媒体列表
try {
const result = await apiClient.getMediaList({
 path: 'C:\\Pictures',
 page: 1,
 pageSize: 50
});
console.log(result.items);
} catch (error) {
if (error instanceof ApiError) {
 console.error(`API错误: ${error.message} (${error.statusCode})`);
}
}

// 获取缩略图URL用于img标签
const thumbnailUrl = apiClient.getThumbnailUrl('C:\\Pictures\\photo.jpg');
img.src = thumbnailUrl;
```

---

### 4.2 路径输入组件 (client/src/components/path-input.ts)

#### 导出接口

```typescript
/** 路径输入组件配置 */
export interface PathInputConfig {
/** 挂载容器元素或选择器 */
container: HTMLElement | string;
/** 路径提交回调 */
onSubmit: (path: string) => void | Promise<void>;
/** 初始路径（可选） */
initialPath?: string;
/** 占位符文本（可选） */
placeholder?: string;
}

/** 路径输入组件类 */
export class PathInput {
constructor(config: PathInputConfig);

/** 设置加载状态 */
setLoading(loading: boolean): void;

/** 获取当前路径值 */
getValue(): string;

/** 设置路径值 */
setValue(path: string): void;

/** 聚焦输入框 */
focus(): void;

/** 销毁组件 */
destroy(): void;
}

/** 创建路径输入组件的工厂函数 */
export function createPathInput(config: PathInputConfig): PathInput;
```

#### 使用示例

```typescript
import { createPathInput } from './components/path-input.ts';

const pathInput = createPathInput({
container: '#path-input',
placeholder: '请输入文件夹路径',
onSubmit: async (path) => {
 console.log('用户提交路径:', path);
 await loadMediaList(path);
},
});

// 手动操作
pathInput.setValue('D:\\Photos');
pathInput.setLoading(true);
```

#### 组件特性

- 支持按钮点击和回车键触发提交
- 自动管理加载状态（禁用输入、显示加载动画）
- 空路径不触发提交
- 加载中防止重复提交

---

### 4.3 缩略图网格组件 (client/src/components/gallery.ts)

#### 导出接口

```typescript
/** 缩略图网格组件配置 */
export interface GalleryConfig {
/** 挂载容器元素或选择器 */
container: HTMLElement | string;
/** 点击缩略图回调 */
onClick?: (item: MediaItem, index: number) => void;
/** 空状态提示文本 */
emptyText?: string;
/** 加载状态提示文本 */
loadingText?: string;
}

/** 缩略图网格组件类 */
export class Gallery {
constructor(config: GalleryConfig);

/** 设置媒体项目列表 */
setItems(items: MediaItem[]): void;

/** 获取当前项目列表 */
getItems(): MediaItem[];

/** 设置加载状态 */
setLoading(loading: boolean): void;

/** 获取加载状态 */
getLoading(): boolean;

/** 清空列表 */
clear(): void;

/** 销毁组件 */
destroy(): void;
}

/** 创建缩略图网格组件的工厂函数 */
export function createGallery(config: GalleryConfig): Gallery;
```

#### 使用示例

```typescript
import { createGallery } from './components/gallery.ts';
import type { MediaItem } from '@media-browser/shared/types';

const gallery = createGallery({
container: '#gallery',
emptyText: '没有找到媒体文件',
loadingText: '正在加载...',
onClick: (item, index) => {
 console.log('点击了:', item.name);
 openLightbox(item);
},
});

// 设置数据
gallery.setItems(mediaItems);

// 加载状态
gallery.setLoading(true);
// ... 加载完成后
gallery.setLoading(false);
```

#### 组件特性

- 响应式网格布局，自动适应窗口宽度
- 支持空状态、加载状态、数据展示三种状态
- 缩略图懒加载（`loading="lazy"`）
- 缩略图加载失败时显示错误提示
- 显示文件类型图标（图片蓝色/视频红色）
- 显示文件名（超长截断）和文件大小
- 悬停动画效果（卡片上浮、图片放大）
- 点击回调返回完整的 MediaItem 和索引

---

### 4.4 分页组件 (client/src/components/pagination.ts)

#### 导出接口

```typescript
/** 分页组件配置 */
export interface PaginationConfig {
/** 挂载容器元素或选择器 */
container: HTMLElement | string;
/** 页码变化回调 */
onPageChange: (page: number) => void;
/** 显示的页码按钮数量（默认5） */
visiblePages?: number;
}

/** 分页状态 */
export interface PaginationState {
/** 当前页码 */
page: number;
/** 总页数 */
totalPages: number;
/** 总数据量 */
total: number;
}

/** 分页组件类 */
export class Pagination {
constructor(config: PaginationConfig);

/** 更新分页状态 */
update(page: number, totalPages: number, total: number): void;

/** 获取当前状态 */
getState(): PaginationState;

/** 跳转到指定页 */
goToPage(page: number): void;

/** 上一页 */
prevPage(): void;

/** 下一页 */
nextPage(): void;

/** 首页 */
firstPage(): void;

/** 末页 */
lastPage(): void;

/** 销毁组件 */
destroy(): void;
}

/** 创建分页组件的工厂函数 */
export function createPagination(config: PaginationConfig): Pagination;
```

#### 使用示例

```typescript
import { createPagination } from './components/pagination.ts';

const pagination = createPagination({
container: '#pagination',
visiblePages: 5,
onPageChange: (page) => {
 console.log('切换到第', page, '页');
 loadPage(page);
},
});

// 更新分页状态
pagination.update(1, 10, 500); // 第1页，共10页，500项

// 导航操作
pagination.nextPage();
pagination.goToPage(5);
```

#### 组件特性

- 显示当前页码、总页数、总数量信息
- 首页/上一页/下一页/末页导航按钮
- 页码按钮（显示当前页附近的页码）
- 页数较多时显示省略号
- 边界状态自动禁用对应按钮
- 总页数为0或1时自动隐藏
- 响应式布局适配移动端

---

### 4.5 灯箱组件 (client/src/components/lightbox.ts)

#### 导出接口

```typescript
/** 灯箱组件配置 */
export interface LightboxConfig {
/** 挂载容器元素或选择器 */
container: HTMLElement | string;
/** 关闭回调 */
onClose?: () => void;
/** 索引变化回调 */
onIndexChange?: (index: number) => void;
}

/** 灯箱组件类 */
export class Lightbox {
constructor(config: LightboxConfig);

/** 打开灯箱 */
open(items: MediaItem[], startIndex?: number): void;

/** 关闭灯箱 */
close(): void;

/** 显示上一张 */
prev(): void;

/** 显示下一张 */
next(): void;

/** 跳转到指定索引 */
goTo(index: number): void;

/** 获取当前索引 */
getCurrentIndex(): number;

/** 获取当前项 */
getCurrentItem(): MediaItem | null;

/** 是否打开状态 */
getIsOpen(): boolean;

/** 销毁组件 */
destroy(): void;
}

/** 创建灯箱组件的工厂函数 */
export function createLightbox(config: LightboxConfig): Lightbox;
```

#### 使用示例

```typescript
import { createLightbox } from './components/lightbox.ts';
import type { MediaItem } from '@media-browser/shared/types';

const lightbox = createLightbox({
container: '#lightbox',
onClose: () => {
 console.log('灯箱已关闭');
},
onIndexChange: (index) => {
 console.log('当前索引:', index);
},
});

// 打开灯箱（从第3张开始）
lightbox.open(mediaItems, 2);

// 导航
lightbox.next();
lightbox.prev();
lightbox.goTo(5);

// 关闭
lightbox.close();
```

#### 组件特性

- 全屏显示原始图片
- 显示文件名、文件大小、当前索引/总数
- 多种关闭方式：点击背景、点击X按钮、按ESC键
- 上一张/下一张导航：点击按钮或按左右方向键
- 边界状态自动禁用导航按钮
- 图片加载动画和错误处理
- 响应式布局适配移动端
- 打开时禁止页面滚动

#### 键盘快捷键

| 按键 | 功能 |
|------|------|
| ESC | 关闭灯箱 |
| ← (左箭头) | 上一张 |
| → (右箭头) | 下一张 |

---

## 5. 共享类型定义汇总

### 5.1 媒体类型

```typescript
/** 媒体文件类型 */
type MediaType = 'image' | 'video';

/** 支持的图片扩展名 */
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'] as const;

/** 支持的视频扩展名 */
const VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mkv', '.avi', '.mov'] as const;
```

### 5.2 媒体文件信息

```typescript
/** 单个媒体文件信息 */
interface MediaItem {
/** 文件名（含扩展名，不含路径） */
name: string;
/** 文件完整路径 */
path: string;
/** 媒体类型 */
type: MediaType;
/** 文件大小（字节） */
size: number;
/** 修改时间（ISO 8601 字符串） */
modifiedAt: string;
}
```

### 5.3 分页类型

```typescript
/** 分页请求参数 */
interface PaginationParams {
/** 页码，从 1 开始 */
page: number;
/** 每页数量 */
pageSize: number;
}

/** 分页响应数据 */
interface PaginatedResponse<T> {
/** 当前页的数据项 */
items: T[];
/** 总数据量 */
total: number;
/** 当前页码 */
page: number;
/** 每页数量 */
pageSize: number;
/** 总页数 */
totalPages: number;
}
```

### 5.4 API响应类型

```typescript
/** API 成功响应 */
interface ApiSuccessResponse<T> {
success: true;
data: T;
}

/** API 错误响应 */
interface ApiErrorResponse {
success: false;
error: string;
}

/** API 响应（联合类型） */
type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
```

### 5.5 工具函数

```typescript
/** 根据文件扩展名判断媒体类型 */
function getMediaType(filename: string): MediaType | null;

/** 判断文件是否为支持的媒体文件 */
function isMediaFile(filename: string): boolean;
```

---

## 6. 重要技术决策记录

### 6.1 使用原生http模块而非Express

**决策**: 使用Node.js原生`http`模块实现服务器

**原因**:
- 项目需求明确要求"尽量少用第三方依赖"
- API接口简单，仅4个GET接口
- 原生模块足够满足需求，无需框架额外功能

**影响**:
- 需要手动实现路由匹配
- 需要手动解析URL参数
- 代码量略多但更可控

---

### 6.2 Node.js实验性类型剥离的限制

**问题**: Node.js 22的`--experimental-strip-types`功能有以下限制：

1. **不支持TypeScript参数属性语法**
   ```typescript
   // ❌ 不支持
   constructor(public readonly code: string) {}
 
   // ✅ 需要改写为
   public readonly code: string;
   constructor(code: string) {
     this.code = code;
   }
   ```

2. **命名导入类型可能失败**
   ```typescript
   // ❌ 可能报错
   import { MediaItem, ApiResponse } from '@media-browser/shared/types';
 
   // ✅ 使用命名空间导入
   import * as shared from '@media-browser/shared/types';
   const item: shared.MediaItem = { ... };
   ```

**解决方案**:
- 避免使用参数属性语法
- 统一使用命名空间导入方式引用shared模块

---

### 6.3 TypeScript项目配置

**问题**: 跨workspace引用shared模块时的配置问题

**解决方案**:
- 移除`rootDir`限制
- 在`include`中添加`../shared/**/*`
- 设置`noEmit: true`（使用esbuild/node直接运行）
- 在shared的`package.json`中配置`exports`

**后端配置** (`server/tsconfig.json`):
```json
{
"compilerOptions": {
 "target": "ES2022",
 "module": "NodeNext",
 "moduleResolution": "NodeNext",
 "esModuleInterop": true,
 "strict": true,
 "skipLibCheck": true,
 "declaration": false,
 "resolveJsonModule": true,
 "noEmit": true,
 "allowImportingTsExtensions": true
},
"include": ["src/**/*", "../shared/**/*"]
}
```

**前端配置** (`client/tsconfig.json`):
```json
{
"compilerOptions": {
 "target": "ES2022",
 "module": "ESNext",
 "moduleResolution": "bundler",
 "esModuleInterop": true,
 "strict": true,
 "skipLibCheck": true,
 "declaration": false,
 "noEmit": true,
 "lib": ["ES2022", "DOM", "DOM.Iterable"]
},
"include": ["src/**/*", "../shared/**/*"]
}
```

---

### 6.4 shared模块的包配置

**问题**: Node.js无法正确解析shared模块的导出

**解决方案** (`shared/package.json`):
```json
{
"name": "@media-browser/shared",
"version": "1.0.0",
"private": true,
"type": "module",
"exports": {
 "./types": {
 "types": "./types.ts",
 "default": "./types.ts"
 }
}
}
```

---

### 6.5 前端API客户端设计决策

**决策**: 提供URL生成函数而非仅提供数据获取函数

**原因**:
- 缩略图和原始文件返回二进制数据
- 直接使用URL赋值给`<img>`/`<video>`标签更高效
- 浏览器自动处理缓存和请求

**实现**:
```typescript
// 获取URL供标签使用（推荐）
const url = apiClient.getThumbnailUrl(filePath);
img.src = url;

// 获取二进制数据（特殊场景）
const blob = await apiClient.getThumbnail(filePath);
```

---

### 6.6 前端组件设计模式

**决策**: 使用类+工厂函数模式

**原因**:
- 类封装组件状态和方法
- 工厂函数提供简洁的创建接口
- 支持配置对象传参，易于扩展
- 提供 `destroy()` 方法支持组件销毁

**模式示例**:
```typescript
// 组件类
export class PathInput {
constructor(config: PathInputConfig) { ... }
public setLoading(loading: boolean): void { ... }
public destroy(): void { ... }
}

// 工厂函数
export function createPathInput(config: PathInputConfig): PathInput {
return new PathInput(config);
}
```

---

### 6.7 缩略图加载策略

**决策**: 使用原生懒加载 + URL直接赋值

**实现**:
```typescript
thumbnail.src = getThumbnailUrl(item.path);
thumbnail.loading = 'lazy'; // 浏览器原生懒加载
```

**原因**:
- 浏览器原生懒加载性能好，无需额外库
- URL直接赋值让浏览器管理请求和缓存
- 后端设置了 `Cache-Control: public, max-age=86400`

**错误处理**:
```typescript
thumbnail.onerror = () => {
thumbnail.style.display = 'none';
thumbnailWrapper.classList.add('gallery__thumbnail-wrapper--error');
};
```

---

### 6.8 分页组件页码计算策略

**决策**: 显示当前页附近的固定数量页码，两端显示省略号

**算法**:
```typescript
// 配置：visiblePages = 5
// 第1页: [^1] 2 3 4 5 … 20
// 第5页: 1 … 3 4 [^5] 6 7 … 20
// 第10页: 1 … 8 9 [^10] 11 12 … 20
// 第20页: 1 … 16 17 18 19 [^20]
```

**原因**:
- 避免页码过多占用空间
- 始终显示首页和末页方便快速跳转
- 省略号明确表示有更多页码

---

### 6.9 灯箱组件键盘事件管理

**决策**: 仅在灯箱打开时监听键盘事件，关闭时移除监听

**实现**:
```typescript
// 打开时添加监听
public open(items: MediaItem[], startIndex: number = 0): void {
// ...
document.addEventListener('keydown', this.boundHandleKeyDown);
}

// 关闭时移除监听
public close(): void {
// ...
document.removeEventListener('keydown', this.boundHandleKeyDown);
}
```

**原因**:
- 避免灯箱关闭后仍然响应键盘事件
- 防止与页面其他键盘快捷键冲突
- 使用绑定的函数引用确保能正确移除监听器

---

### 6.10 灯箱组件滚动锁定

**决策**: 灯箱打开时禁止页面滚动

**实现**:
```typescript
// 打开时
document.body.style.overflow = 'hidden';

// 关闭时
document.body.style.overflow = '';
```

**原因**:
- 防止用户在查看灯箱时误操作滚动背景页面
- 提供更好的全屏预览体验

---

### 6.11 端口占用问题

**问题**: 开发时频繁出现`EADDRINUSE: address already in use`

**原因**: 之前的Node.js进程未正确关闭

**解决方案**:
```powershell
# 查找占用端口的进程
netstat -ano | findstr :3000

# 关闭进程
taskkill /PID <进程ID> /F
```

---

### 6.12 Windows符号链接与版本控制

**问题**: jj（版本控制工具）无法读取npm workspaces创建的符号链接

**解决方案**: 创建`.gitignore`文件忽略`node_modules`：
```gitignore
node_modules/
dist/
*.log
```

---

## 7. 开发命令速查

### 安装依赖
```bash
# 根目录执行，安装所有workspace依赖
npm install
```

### 启动后端开发服务器
```bash
cd server
npm run dev
# 或从根目录
npm run dev:server
```

### 构建前端
```bash
cd client
npm run build
```

### 前端监听模式（开发用）
```bash
cd client
npm run watch
```

### 前端类型检查
```bash
cd client
npm run typecheck
```

### TypeScript类型检查（后端）
```bash
cd server
npx tsc --noEmit
```

---

## 8. 下一步计划

继续阶段2：前端核心开发

**下一个任务**: Task 2.7 - 扩展灯箱组件（视频）

待完成任务：
1. Task 2.7: 扩展灯箱组件（视频）
2. Task 2.8: 整合所有组件
```

---

## 更新摘要

本次更新主要变更：

1. **更新时间戳**: Task 2.6 完成后
2. **目录结构**: 添加 `client/src/components/lightbox.ts`
3. **前端模块表**: 标记 lightbox 为已完成（图片）
4. **任务清单**: Task 2.6 标记为 ✅ 完成
5. **新增 4.5 节**: 灯箱组件接口文档（包含导出接口、使用示例、组件特性、键盘快捷键）
6. **新增技术决策 6.9**: 灯箱组件键盘事件管理
7. **新增技术决策 6.10**: 灯箱组件滚动锁定
8. **下一步计划**: 更新为 Task 2.7

---
## 🧑‍💻 User

Task 2.6 已完成，继续 Task 2.7：扩展灯箱组件（视频支持）

要求：
1. 修改 client/src/components/lightbox.ts
2. 新增功能：
 - 支持视频播放（使用 HTML5 video 元素）
 - 视频控件：播放/暂停、进度条、音量、全屏（使用浏览器原生 controls）
 - 切换到其他媒体时自动暂停当前视频
 - 关闭灯箱时停止视频播放
3. 视频 URL 通过 apiClient.getFileUrl(path) 生成（已支持 Range 请求）
4. 需要在 main.css 中添加视频相关样式
5. 给出独立测试方法（需要准备测试视频文件）

注意：
- 复用现有灯箱结构，只需添加视频渲染逻辑
- 根据 item.type 判断是图片还是视频
- 给出完整的 lightbox.ts 文件，不要只给修改片段

---
## 🤖 Assistant

# Task 2.7: 扩展灯箱组件（视频支持）

## 任务目标

扩展灯箱组件，添加视频播放支持。

## 涉及文件

| 文件 | 操作 | 说明 |
|------|------|------|
| `client/src/components/lightbox.ts` | 修改 | 添加视频播放支持 |
| `client/styles/main.css` | 修改 | 添加视频相关样式 |

## 完整代码

### 1. client/src/components/lightbox.ts

```typescript
/**
 * 灯箱组件
 * 全屏预览图片和视频，支持导航
 */

import type { MediaItem } from '@media-browser/shared/types';
import { getFileUrl } from '../api/client.ts';

/** 灯箱组件配置 */
export interface LightboxConfig {
  /** 挂载容器元素或选择器 */
  container: HTMLElement | string;
  /** 关闭回调 */
  onClose?: () => void;
  /** 索引变化回调 */
  onIndexChange?: (index: number) => void;
}

/** 灯箱组件类 */
export class Lightbox {
  private container: HTMLElement;
  private items: MediaItem[] = [];
  private currentIndex: number = 0;
  private isOpen: boolean = false;
  private onClose?: () => void;
  private onIndexChange?: (index: number) => void;

  // DOM 元素
  private overlay: HTMLElement | null = null;
  private content: HTMLElement | null = null;
  private mediaContainer: HTMLElement | null = null;
  private infoBar: HTMLElement | null = null;
  private prevButton: HTMLButtonElement | null = null;
  private nextButton: HTMLButtonElement | null = null;
  private closeButton: HTMLButtonElement | null = null;

  // 当前视频元素（用于切换时暂停）
  private currentVideo: HTMLVideoElement | null = null;

  // 绑定的事件处理函数（用于移除事件监听）
  private boundHandleKeyDown: (e: KeyboardEvent) => void;

  constructor(config: LightboxConfig) {
    // 解析容器
    if (typeof config.container === 'string') {
      const el = document.querySelector(config.container);
      if (!el) {
        throw new Error(`Container not found: ${config.container}`);
      }
      this.container = el as HTMLElement;
    } else {
      this.container = config.container;
    }

    this.onClose = config.onClose;
    this.onIndexChange = config.onIndexChange;

    // 绑定键盘事件处理函数
    this.boundHandleKeyDown = this.handleKeyDown.bind(this);

    // 初始渲染
    this.render();
  }

  /**
   * 打开灯箱
   */
  public open(items: MediaItem[], startIndex: number = 0): void {
    if (items.length === 0) {
      return;
    }

    this.items = items;
    this.currentIndex = Math.max(0, Math.min(startIndex, items.length - 1));
    this.isOpen = true;

    // 显示灯箱
    this.container.classList.remove('lightbox--hidden');
    document.body.style.overflow = 'hidden';

    // 添加键盘事件监听
    document.addEventListener('keydown', this.boundHandleKeyDown);

    // 显示当前项
    this.showCurrentItem();
  }

  /**
   * 关闭灯箱
   */
  public close(): void {
    if (!this.isOpen) {
      return;
    }

    // 停止当前视频
    this.stopCurrentVideo();

    this.isOpen = false;
    this.container.classList.add('lightbox--hidden');
    document.body.style.overflow = '';

    // 移除键盘事件监听
    document.removeEventListener('keydown', this.boundHandleKeyDown);

    // 清空媒体内容
    if (this.mediaContainer) {
      this.mediaContainer.innerHTML = '';
    }

    // 触发关闭回调
    if (this.onClose) {
      this.onClose();
    }
  }

  /**
   * 显示上一张
   */
  public prev(): void {
    if (this.currentIndex > 0) {
      this.stopCurrentVideo();
      this.currentIndex--;
      this.showCurrentItem();
      this.notifyIndexChange();
    }
  }

  /**
   * 显示下一张
   */
  public next(): void {
    if (this.currentIndex < this.items.length - 1) {
      this.stopCurrentVideo();
      this.currentIndex++;
      this.showCurrentItem();
      this.notifyIndexChange();
    }
  }

  /**
   * 跳转到指定索引
   */
  public goTo(index: number): void {
    if (index >= 0 && index < this.items.length && index !== this.currentIndex) {
      this.stopCurrentVideo();
      this.currentIndex = index;
      this.showCurrentItem();
      this.notifyIndexChange();
    }
  }

  /**
   * 获取当前索引
   */
  public getCurrentIndex(): number {
    return this.currentIndex;
  }

  /**
   * 获取当前项
   */
  public getCurrentItem(): MediaItem | null {
    return this.items[this.currentIndex] || null;
  }

  /**
   * 是否打开状态
   */
  public getIsOpen(): boolean {
    return this.isOpen;
  }

  /**
   * 停止当前视频播放
   */
  private stopCurrentVideo(): void {
    if (this.currentVideo) {
      this.currentVideo.pause();
      this.currentVideo.currentTime = 0;
      this.currentVideo = null;
    }
  }

  /**
   * 渲染组件结构
   */
  private render(): void {
    this.container.innerHTML = '';
    this.container.className = 'lightbox lightbox--hidden';

    // 创建遮罩层
    this.overlay = document.createElement('div');
    this.overlay.className = 'lightbox__overlay';
    this.overlay.addEventListener('click', () => this.close());

    // 创建内容区域
    this.content = document.createElement('div');
    this.content.className = 'lightbox__content';

    // 关闭按钮
    this.closeButton = document.createElement('button');
    this.closeButton.type = 'button';
    this.closeButton.className = 'lightbox__close';
    this.closeButton.innerHTML = this.getCloseIcon();
    this.closeButton.title = '关闭 (ESC)';
    this.closeButton.addEventListener('click', () => this.close());

    // 上一张按钮
    this.prevButton = document.createElement('button');
    this.prevButton.type = 'button';
    this.prevButton.className = 'lightbox__nav lightbox__nav--prev';
    this.prevButton.innerHTML = this.getPrevIcon();
    this.prevButton.title = '上一张 (←)';
    this.prevButton.addEventListener('click', (e) => {
      e.stopPropagation();
      this.prev();
    });

    // 下一张按钮
    this.nextButton = document.createElement('button');
    this.nextButton.type = 'button';
    this.nextButton.className = 'lightbox__nav lightbox__nav--next';
    this.nextButton.innerHTML = this.getNextIcon();
    this.nextButton.title = '下一张 (→)';
    this.nextButton.addEventListener('click', (e) => {
      e.stopPropagation();
      this.next();
    });

    // 媒体容器
    this.mediaContainer = document.createElement('div');
    this.mediaContainer.className = 'lightbox__media';

    // 信息栏
    this.infoBar = document.createElement('div');
    this.infoBar.className = 'lightbox__info';

    // 组装结构
    this.content.appendChild(this.closeButton);
    this.content.appendChild(this.prevButton);
    this.content.appendChild(this.nextButton);
    this.content.appendChild(this.mediaContainer);
    this.content.appendChild(this.infoBar);

    this.container.appendChild(this.overlay);
    this.container.appendChild(this.content);
  }

  /**
   * 显示当前项
   */
  private showCurrentItem(): void {
    const item = this.items[this.currentIndex];
    if (!item || !this.mediaContainer || !this.infoBar) {
      return;
    }

    // 清空媒体容器
    this.mediaContainer.innerHTML = '';

    // 根据类型显示内容
    if (item.type === 'image') {
      this.showImage(item);
    } else if (item.type === 'video') {
      this.showVideo(item);
    } else {
      this.showUnsupported(item);
    }

    // 更新信息栏
    this.updateInfoBar(item);

    // 更新导航按钮状态
    this.updateNavButtons();
  }

  /**
   * 显示图片
   */
  private showImage(item: MediaItem): void {
    if (!this.mediaContainer) return;

    // 创建加载指示器
    const loader = document.createElement('div');
    loader.className = 'lightbox__loader';

    // 创建图片元素
    const img = document.createElement('img');
    img.className = 'lightbox__image';
    img.alt = item.name;

    // 图片加载完成后移除加载指示器
    img.onload = () => {
      loader.remove();
      img.classList.add('lightbox__image--loaded');
    };

    // 图片加载失败
    img.onerror = () => {
      loader.remove();
      const error = document.createElement('div');
      error.className = 'lightbox__error';
      error.textContent = '图片加载失败';
      this.mediaContainer?.appendChild(error);
    };

    // 设置图片源
    img.src = getFileUrl(item.path);

    this.mediaContainer.appendChild(loader);
    this.mediaContainer.appendChild(img);
  }

  /**
   * 显示视频
   */
  private showVideo(item: MediaItem): void {
    if (!this.mediaContainer) return;

    // 创建视频容器
    const videoWrapper = document.createElement('div');
    videoWrapper.className = 'lightbox__video-wrapper';

    // 创建加载指示器
    const loader = document.createElement('div');
    loader.className = 'lightbox__loader';

    // 创建视频元素
    const video = document.createElement('video');
    video.className = 'lightbox__video';
    video.controls = true;
    video.preload = 'metadata';
    video.playsInline = true;

    // 视频可以播放时移除加载指示器
    video.oncanplay = () => {
      loader.remove();
      video.classList.add('lightbox__video--loaded');
    };

    // 视频加载失败
    video.onerror = () => {
      loader.remove();
      const error = document.createElement('div');
      error.className = 'lightbox__error';
      error.textContent = '视频加载失败';
      videoWrapper.appendChild(error);
    };

    // 设置视频源
    video.src = getFileUrl(item.path);

    // 保存当前视频引用
    this.currentVideo = video;

    videoWrapper.appendChild(loader);
    videoWrapper.appendChild(video);
    this.mediaContainer.appendChild(videoWrapper);
  }

  /**
   * 显示不支持的类型
   */
  private showUnsupported(item: MediaItem): void {
    if (!this.mediaContainer) return;

    const message = document.createElement('div');
    message.className = 'lightbox__unsupported';
    message.textContent = `暂不支持预览 ${item.type} 类型文件`;
    this.mediaContainer.appendChild(message);
  }

  /**
   * 更新信息栏
   */
  private updateInfoBar(item: MediaItem): void {
    if (!this.infoBar) return;

    const index = this.currentIndex + 1;
    const total = this.items.length;
    const size = this.formatFileSize(item.size);
    const typeLabel = item.type === 'video' ? '视频' : '图片';

    this.infoBar.innerHTML = `
      <span class="lightbox__filename" title="${item.path}">${item.name}</span>
      <span class="lightbox__meta">
        <span class="lightbox__type">${typeLabel}</span>
        <span class="lightbox__size">${size}</span>
        <span class="lightbox__counter">${index} / ${total}</span>
      </span>
    `;
  }

  /**
   * 更新导航按钮状态
   */
  private updateNavButtons(): void {
    if (this.prevButton) {
      this.prevButton.disabled = this.currentIndex === 0;
    }
    if (this.nextButton) {
      this.nextButton.disabled = this.currentIndex === this.items.length - 1;
    }
  }

  /**
   * 处理键盘事件
   */
  private handleKeyDown(e: KeyboardEvent): void {
    if (!this.isOpen) return;

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        this.close();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        this.prev();
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.next();
        break;
      case ' ':
        // 空格键控制视频播放/暂停
        if (this.currentVideo) {
          e.preventDefault();
          if (this.currentVideo.paused) {
            this.currentVideo.play();
          } else {
            this.currentVideo.pause();
          }
        }
        break;
    }
  }

  /**
   * 通知索引变化
   */
  private notifyIndexChange(): void {
    if (this.onIndexChange) {
      this.onIndexChange(this.currentIndex);
    }
  }

  /**
   * 格式化文件大小
   */
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }

  /**
   * 获取关闭图标
   */
  private getCloseIcon(): string {
    return `<svg viewBox="0 0 24 24" width="24" height="24">
      <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
    </svg>`;
  }

  /**
   * 获取上一张图标
   */
  private getPrevIcon(): string {
    return `<svg viewBox="0 0 24 24" width="32" height="32">
      <path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
    </svg>`;
  }

  /**
   * 获取下一张图标
   */
  private getNextIcon(): string {
    return `<svg viewBox="0 0 24 24" width="32" height="32">
      <path fill="currentColor" d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
    </svg>`;
  }

  /**
   * 销毁组件
   */
  public destroy(): void {
    this.close();
    this.container.innerHTML = '';
    this.items = [];
  }
}

/**
 * 创建灯箱组件的工厂函数
 */
export function createLightbox(config: LightboxConfig): Lightbox {
  return new Lightbox(config);
}
```

### 2. client/styles/main.css（在灯箱组件样式部分添加以下内容）

找到 `/* ===== 灯箱组件 ===== */` 部分，在 `.lightbox__image--loaded` 样式后添加视频相关样式：

```css
/* ===== 灯箱组件 - 视频支持 ===== */

/* 视频容器 */
.lightbox__video-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  max-width: 100%;
  max-height: 100%;
}

/* 视频元素 */
.lightbox__video {
  max-width: 100%;
  max-height: calc(100vh - 150px);
  background-color: #000;
  opacity: 0;
  transition: opacity var(--transition-normal);
  outline: none;
}

.lightbox__video--loaded {
  opacity: 1;
}

/* 视频控制栏样式增强 */
.lightbox__video::-webkit-media-controls-panel {
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
}

/* 信息栏类型标签 */
.lightbox__type {
  padding: 2px 8px;
  background-color: var(--color-primary);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
}
```

**完整的灯箱样式部分**（替换原有的灯箱样式）：

```css
/* ===== 灯箱组件 ===== */
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox--hidden {
  display: none;
}

/* 遮罩层 */
.lightbox__overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.95);
  cursor: pointer;
}

/* 内容区域 */
.lightbox__content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: var(--spacing-xl);
  pointer-events: none;
}

.lightbox__content > * {
  pointer-events: auto;
}

/* 关闭按钮 */
.lightbox__close {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: background-color var(--transition-fast);
  z-index: 10;
}

.lightbox__close:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

/* 导航按钮 */
.lightbox__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: background-color var(--transition-fast), opacity var(--transition-fast);
  z-index: 10;
}

.lightbox__nav:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.2);
}

.lightbox__nav:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.lightbox__nav--prev {
  left: var(--spacing-md);
}

.lightbox__nav--next {
  right: var(--spacing-md);
}

/* 媒体容器 */
.lightbox__media {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: calc(100% - 120px);
  max-height: calc(100% - 100px);
  position: relative;
}

/* 图片 */
.lightbox__image {
  max-width: 100%;
  max-height: calc(100vh - 150px);
  object-fit: contain;
  opacity: 0;
  transition: opacity var(--transition-normal);
  user-select: none;
  -webkit-user-drag: none;
}

.lightbox__image--loaded {
  opacity: 1;
}

/* 视频容器 */
.lightbox__video-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  max-width: 100%;
  max-height: 100%;
}

/* 视频元素 */
.lightbox__video {
  max-width: 100%;
  max-height: calc(100vh - 150px);
  background-color: #000;
  opacity: 0;
  transition: opacity var(--transition-normal);
  outline: none;
}

.lightbox__video--loaded {
  opacity: 1;
}

/* 视频控制栏样式增强 */
.lightbox__video::-webkit-media-controls-panel {
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
}

/* 加载指示器 */
.lightbox__loader {
  position: absolute;
  width: 48px;
  height: 48px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* 错误提示 */
.lightbox__error {
  color: #ff6b6b;
  font-size: 1rem;
  padding: var(--spacing-lg);
  text-align: center;
}

/* 不支持的类型 */
.lightbox__unsupported {
  color: var(--color-text-secondary);
  font-size: 1rem;
  padding: var(--spacing-lg);
  text-align: center;
}

/* 信息栏 */
.lightbox__info {
  position: absolute;
  bottom: var(--spacing-md);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: var(--radius-md);
  color: white;
  font-size: 0.875rem;
  max-width: calc(100% - var(--spacing-xl) * 2);
}

.lightbox__filename {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 400px;
}

.lightbox__meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.lightbox__type {
  padding: 2px 8px;
  background-color: var(--color-primary);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
  color: white;
}

.lightbox__counter {
  font-weight: 500;
  color: var(--color-primary);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .lightbox__content {
    padding: var(--spacing-md);
  }

  .lightbox__nav {
    width: 44px;
    height: 44px;
  }

  .lightbox__nav--prev {
    left: var(--spacing-xs);
  }

  .lightbox__nav--next {
    right: var(--spacing-xs);
  }

  .lightbox__media {
    max-width: calc(100% - 60px);
  }

  .lightbox__image,
  .lightbox__video {
    max-height: calc(100vh - 120px);
  }

  .lightbox__info {
    flex-direction: column;
    gap: var(--spacing-xs);
    text-align: center;
  }

  .lightbox__filename {
    max-width: 100%;
  }
}
```

## 验收标准

### 检查清单

- [ ] **文件修改**: `client/src/components/lightbox.ts` 已更新
- [ ] **样式更新**: `client/styles/main.css` 已添加视频样式
- [ ] **类型检查**: 运行 `npm run typecheck` 无错误
- [ ] **构建成功**: 运行 `npm run build` 成功
- [ ] **功能测试**: 图片和视频播放均正常

### 验收测试步骤

#### 1. 类型检查

```bash
cd client
npm run typecheck
# 应该无错误输出
```

#### 2. 构建

```bash
cd client
npm run build
# 应该输出 "Build complete!"
```

#### 3. 准备测试视频

在测试前，请准备一些测试视频文件（MP4格式最佳）。可以：
- 使用系统自带的示例视频
- 下载一些短视频用于测试
- 确保视频路径正确

#### 4. 功能测试

为了独立测试组件，临时修改 `client/src/index.ts`：

```typescript
/**
 * 媒体浏览器前端入口
 * Task 2.7 测试版本
 */

import { createLightbox, Lightbox } from './components/lightbox.ts';
import type { MediaItem } from '@media-browser/shared/types';

// 应用状态类型
interface AppState {
  currentPath: string;
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
}

// 全局应用状态
const state: AppState = {
  currentPath: '',
  currentPage: 1,
  pageSize: 50,
  isLoading: false,
};

/**
 * 获取DOM元素，如果不存在则抛出错误
 */
function getElement<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Element with id "${id}" not found`);
  }
  return element as T;
}

/**
 * 创建模拟数据
 * 注意：请将路径替换为你电脑上实际存在的文件路径
 */
function createMockItems(): MediaItem[] {
  return [
    // 图片文件（请替换为实际路径）
    {
      name: 'photo1.jpg',
      path: 'C:\\Users\\Public\\Pictures\\Sample Pictures\\Chrysanthemum.jpg',
      type: 'image',
      size: 879394,
      modifiedAt: '2025-01-01T10:00:00.000Z',
    },
    {
      name: 'photo2.jpg',
      path: 'C:\\Users\\Public\\Pictures\\Sample Pictures\\Desert.jpg',
      type: 'image',
      size: 845941,
      modifiedAt: '2025-01-02T10:00:00.000Z',
    },
    // 视频文件（请替换为实际路径）
    {
      name: 'sample_video.mp4',
      path: 'C:\\Users\\Public\\Videos\\Sample Videos\\Wildlife.wmv',  // Windows 示例视频
      type: 'video',
      size: 1024 * 1024 * 26,
      modifiedAt: '2025-01-03T10:00:00.000Z',
    },
    // 更多图片
    {
      name: 'photo3.jpg',
      path: 'C:\\Users\\Public\\Pictures\\Sample Pictures\\Hydrangeas.jpg',
      type: 'image',
      size: 595284,
      modifiedAt: '2025-01-04T10:00:00.000Z',
    },
    // 更多视频（请替换为实际路径）
    {
      name: 'test_video.mp4',
      path: 'D:\\Videos\\test.mp4',  // 请替换为你的视频路径
      type: 'video',
      size: 1024 * 1024 * 50,
      modifiedAt: '2025-01-05T10:00:00.000Z',
    },
    {
      name: 'photo4.jpg',
      path: 'C:\\Users\\Public\\Pictures\\Sample Pictures\\Jellyfish.jpg',
      type: 'image',
      size: 775702,
      modifiedAt: '2025-01-06T10:00:00.000Z',
    },
  ];
}

/**
 * 测试灯箱组件（含视频支持）
 */
function testLightbox(): void {
  console.log('\n===== 灯箱组件测试（含视频支持） =====\n');

  const mockItems = createMockItems();

  // 创建组件
  const lightbox = createLightbox({
    container: '#lightbox',
    onClose: () => {
      console.log('灯箱已关闭');
    },
    onIndexChange: (index) => {
      const item = mockItems[index];
      console.log(`切换到: [${index + 1}/${mockItems.length}] ${item?.name} (${item?.type})`);
    },
  });

  // 导出到全局以便控制台测试
  (window as unknown as Record<string, unknown>).lightbox = lightbox;
  (window as unknown as Record<string, unknown>).mockItems = mockItems;

  console.log('✓ 灯箱组件已创建');
  console.log('');
  console.log('测试数据包含:');
  mockItems.forEach((item, i) => {
    console.log(`  [${i}] ${item.name} (${item.type})`);
  });
  console.log('');
  console.log('测试命令:');
  console.log('  lightbox.open(mockItems, 0)  - 从第1个（图片）开始');
  console.log('  lightbox.open(mockItems, 2)  - 从第3个（视频）开始');
  console.log('  lightbox.close()             - 关闭灯箱');
  console.log('  lightbox.next() / prev()     - 导航');
  console.log('');
  console.log('键盘操作:');
  console.log('  ESC        - 关闭');
  console.log('  ← →        - 上一个/下一个');
  console.log('  空格       - 播放/暂停视频');
  console.log('');

  // 在 gallery 区域创建测试按钮
  const gallery = getElement('gallery');
  gallery.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 16px; padding: 20px;">
      <h3 style="color: white;">灯箱组件测试（含视频支持）</h3>
      <p style="color: #aaa;">点击下方按钮测试图片和视频预览</p>
      
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <button id="btn-open-image" class="btn btn--primary">打开图片</button>
        <button id="btn-open-video" class="btn btn--primary">打开视频</button>
        <button id="btn-open-all" class="btn">打开全部（从头开始）</button>
      </div>
      
      <div style="margin-top: 16px; padding: 16px; background: #2a2a2a; border-radius: 8px;">
        <h4 style="color: white; margin-bottom: 8px;">测试要点：</h4>
        <ul style="color: #aaa; font-size: 14px; line-height: 1.8; padding-left: 20px;">
          <li>图片应正常显示，支持左右导航</li>
          <li>视频应显示播放控件（播放/暂停、进度条、音量、全屏）</li>
          <li>切换到其他媒体时，视频应自动暂停</li>
          <li>关闭灯箱时，视频应停止播放</li>
          <li>按空格键可控制视频播放/暂停</li>
          <li>信息栏应显示"图片"或"视频"类型标签</li>
        </ul>
      </div>
      
      <p style="color: #888; font-size: 14px;">
        注意：需要启动后端服务器 (cd server && npm run dev) 才能加载文件。<br>
        如果文件路径不存在，请修改 index.ts 中的 createMockItems() 函数。
      </p>
    </div>
  `;

  // 绑定按钮事件
  document.getElementById('btn-open-image')?.addEventListener('click', () => {
    const imageIndex = mockItems.findIndex(item => item.type === 'image');
    console.log('打开图片，索引:', imageIndex);
    lightbox.open(mockItems, imageIndex >= 0 ? imageIndex : 0);
  });

  document.getElementById('btn-open-video')?.addEventListener('click', () => {
    const videoIndex = mockItems.findIndex(item => item.type === 'video');
    if (videoIndex >= 0) {
      console.log('打开视频，索引:', videoIndex);
      lightbox.open(mockItems, videoIndex);
    } else {
      console.log('没有找到视频文件');
      alert('测试数据中没有视频文件');
    }
  });

  document.getElementById('btn-open-all')?.addEventListener('click', () => {
    console.log('打开全部，从头开始');
    lightbox.open(mockItems, 0);
  });
}

/**
 * 初始化应用
 */
function initApp(): void {
  console.log('媒体浏览器已启动');
  
  // 验证必要的DOM元素存在
  const requiredElements = ['app', 'path-input', 'gallery', 'pagination', 'lightbox'];
  
  for (const id of requiredElements) {
    try {
      getElement(id);
      console.log(`✓ 元素 #${id} 已就绪`);
    } catch (error) {
      console.error(`✗ 元素 #${id} 未找到`);
    }
  }
  
  // 测试灯箱组件
  testLightbox();
}

// DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', initApp);

// 导出状态和工具函数供其他模块使用
export { state, getElement };
export type { AppState };
```

#### 5. 运行测试

1. **启动后端服务器**（新终端窗口）：
```bash
   cd server
   npm run dev
   ```

2. **重新构建前端**：
   ```bash
   cd client
   npm run build
   ```

3. **打开浏览器测试**：
   - 打开 `client/index.html`
   - 打开开发者工具（F12）查看控制台

4. **功能测试**：

   | 测试项 | 操作 | 预期结果 |
   |--------|------|----------|
   | 打开图片 | 点击"打开图片"按钮 | 显示图片，信息栏显示"图片"标签 |
   | 打开视频 | 点击"打开视频"按钮 | 显示视频播放器，有控制栏 |
   | 视频控件 | 查看视频播放器 | 有播放/暂停、进度条、音量、全屏按钮 |
   | 播放视频 | 点击播放按钮 | 视频开始播放 |
   | 暂停视频 | 点击暂停按钮或按空格 | 视频暂停 |
   | 切换暂停 | 视频播放时切换到下一个 | 视频自动暂停 |
   | 关闭暂停 | 视频播放时关闭灯箱 | 视频停止，进度重置 |
   | 类型标签 | 查看信息栏 | 图片显示"图片"，视频显示"视频" |
   | 空格控制 | 视频模式下按空格 | 切换播放/暂停 |
   | 图片空格 | 图片模式下按空格 | 无反应（正常） |

5. **控制台命令测试**：
   ```javascript
   // 打开到视频
   lightbox.open(mockItems, 2)
   
   // 导航测试
   lightbox.next()  // 切换时视频应暂停
   lightbox.prev()
   
   // 获取当前项
   lightbox.getCurrentItem()  // 查看 type 字段
   ```

#### 6. 测试完成后还原 index.ts

测试通过后，将 `client/src/index.ts` 还原为简洁版本：

```typescript
/**
 * 媒体浏览器前端入口
*/

// 应用状态类型
interface AppState {
currentPath: string;
currentPage: number;
pageSize: number;
isLoading: boolean;
}

// 全局应用状态
const state: AppState = {
currentPath: '',
currentPage: 1,
pageSize: 50,
isLoading: false,
};

/**
 * 获取DOM元素，如果不存在则抛出错误
*/
function getElement<T extends HTMLElement>(id: string): T {
const element = document.getElementById(id);
if (!element) {
 throw new Error(`Element with id "${id}" not found`);
}
return element as T;
}

/**
 * 初始化应用
*/
function initApp(): void {
console.log('媒体浏览器已启动');

// 验证必要的DOM元素存在
const requiredElements = ['app', 'path-input', 'gallery', 'pagination', 'lightbox'];

for (const id of requiredElements) {
 try {
 getElement(id);
 console.log(`✓ 元素 #${id} 已就绪`);
 } catch (error) {
 console.error(`✗ 元素 #${id} 未找到`);
 }
}

// TODO: Task 2.8 将在这里整合所有组件
}

// DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', initApp);

// 导出状态和工具函数供其他模块使用
export { state, getElement };
export type { AppState };
```

然后重新构建：

```bash
cd client
npm run build
```

### 预期视觉效果

- **视频播放器**: 黑色背景，居中显示
- **控制栏**: 浏览器原生控制栏（播放/暂停、进度、音量、全屏）
- **类型标签**: 信息栏显示蓝色"视频"或"图片"标签
- **加载动画**: 视频加载时显示旋转加载器
- **错误提示**: 视频加载失败显示红色错误文字

### 新增键盘快捷键

| 按键 | 功能 |
|------|------|
| 空格 | 播放/暂停视频（仅视频模式） |

---
## 🧑‍💻 User

类型标签	查看信息栏	图片显示"图片"，视频显示"视频"
不清楚信息栏是什么，如果图片和视频都没有加载的话。
并没有看到什么位置，特别有标注。

---
## 🤖 Assistant

明白了，信息栏是灯箱底部的那个半透明黑色条，显示文件名、类型、大小和计数器。

让我解释一下并确认你是否看到了：

## 信息栏位置说明

信息栏位于灯箱底部居中位置，即使图片/视频加载失败也会显示。它应该显示：

```
[文件名]                    [图片/视频] [文件大小] [1 / 6]
```

## 检查步骤

1. 打开灯箱后，看屏幕**最底部中央**
2. 应该有一个半透明黑色背景的条
3. 里面显示文件信息

## 如果看不到信息栏

可能是样式没有正确应用。请确认 `client/styles/main.css` 中有以下样式：

```css
/* 信息栏 */
.lightbox__info {
  position: absolute;
  bottom: var(--spacing-md);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: var(--radius-md);
  color: white;
  font-size: 0.875rem;
  max-width: calc(100% - var(--spacing-xl) * 2);
}
```

## 快速验证

打开浏览器开发者工具（F12），在灯箱打开时：

1. 点击"Elements"（元素）标签
2. 搜索 `lightbox__info`
3. 查看该元素是否存在，以及它的样式

请告诉我：
1. 灯箱能正常打开吗？
2. 底部有没有看到任何文字信息？
3. 开发者工具中能找到 `.lightbox__info` 元素吗？

---
## 🧑‍💻 User

能找得到元素，也在样式表中搜索得到这个样式，但是在页面当中底部没有看到任何文字信息，除了看不到文字信息之外，其他都正常。

---
## 🤖 Assistant

让我检查一下问题。可能是 `pointer-events: none` 导致信息栏不可见，或者是层级问题。

请检查一下开发者工具中 `.lightbox__info` 元素的**计算样式**（Computed），看看：

1. `display` 是什么值？
2. `opacity` 是什么值？
3. `visibility` 是什么值？
4. `height` 是多少？

另外，请在开发者工具的 Elements 面板中，找到 `.lightbox__info` 元素，看看它的 **innerHTML 是否有内容**？

---

## 最可能的问题

我发现问题了！在 `.lightbox__content` 中设置了 `pointer-events: none`，然后子元素设置 `pointer-events: auto`。但信息栏是在内容区域内部的，可能被其他样式影响。

更可能的问题是：**信息栏被媒体容器遮挡了**，因为它们都是 `position: absolute`。

## 修复方案

请在 `client/styles/main.css` 中找到 `.lightbox__info` 样式，添加 `z-index`：

```css
/* 信息栏 */
.lightbox__info {
  position: absolute;
  bottom: var(--spacing-md);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: var(--radius-md);
  color: white;
  font-size: 0.875rem;
  max-width: calc(100% - var(--spacing-xl) * 2);
  z-index: 10;  /* 添加这一行 */
}
```

重新刷新页面后测试，信息栏应该就能显示了。

---
## 🧑‍💻 User

视频非全全屏的情况下，信息栏显示正常了。图片如果太大，全屏的话看不到信息栏。如果图片本身指向的地址，文件不存在的话，也看不到信息了。

---
## 🤖 Assistant

明白了，有两个问题：

1. **图片太大时遮挡信息栏** - 图片的 `max-height` 设置得太大
2. **图片加载失败时信息栏消失** - 可能是错误元素覆盖了信息栏

## 修复方案

修改 `client/styles/main.css` 中的相关样式：

```css
/* 图片 */
.lightbox__image {
  max-width: 100%;
  max-height: calc(100vh - 180px);  /* 从 150px 改为 180px，留更多空间给信息栏 */
  object-fit: contain;
  opacity: 0;
  transition: opacity var(--transition-normal);
  user-select: none;
  -webkit-user-drag: none;
}

/* 视频元素 */
.lightbox__video {
  max-width: 100%;
  max-height: calc(100vh - 180px);  /* 同样调整 */
  background-color: #000;
  opacity: 0;
  transition: opacity var(--transition-normal);
  outline: none;
}

/* 媒体容器 */
.lightbox__media {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: calc(100% - 120px);
  max-height: calc(100% - 120px);  /* 从 100px 改为 120px */
  position: relative;
}

/* 错误提示 - 确保不会撑大容器 */
.lightbox__error {
  color: #ff6b6b;
  font-size: 1rem;
  padding: var(--spacing-lg);
  text-align: center;
  position: absolute;  /* 添加：改为绝对定位 */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .lightbox__content {
    padding: var(--spacing-md);
  }

  .lightbox__nav {
    width: 44px;
    height: 44px;
  }

  .lightbox__nav--prev {
    left: var(--spacing-xs);
  }

  .lightbox__nav--next {
    right: var(--spacing-xs);
  }

  .lightbox__media {
    max-width: calc(100% - 60px);
  }

  .lightbox__image,
  .lightbox__video {
    max-height: calc(100vh - 160px);  /* 移动端也调整 */
  }

  .lightbox__info {
    flex-direction: column;
    gap: var(--spacing-xs);
    text-align: center;
  }

  .lightbox__filename {
    max-width: 100%;
  }
}
```

同时修改 `client/src/components/lightbox.ts` 中的 `showImage` 方法，确保错误提示不会影响布局：

找到 `showImage` 方法中的错误处理部分，修改为：

```typescript
/**
 * 显示图片
 */
private showImage(item: MediaItem): void {
  if (!this.mediaContainer) return;

  // 创建加载指示器
  const loader = document.createElement('div');
  loader.className = 'lightbox__loader';

  // 创建图片元素
  const img = document.createElement('img');
  img.className = 'lightbox__image';
  img.alt = item.name;

  // 图片加载完成后移除加载指示器
  img.onload = () => {
    loader.remove();
    img.classList.add('lightbox__image--loaded');
  };

  // 图片加载失败
  img.onerror = () => {
    loader.remove();
    img.style.display = 'none';  // 隐藏图片元素
    const error = document.createElement('div');
    error.className = 'lightbox__error';
    error.textContent = '图片加载失败';
    this.mediaContainer?.appendChild(error);
  };

  // 设置图片源
  img.src = getFileUrl(item.path);

  this.mediaContainer.appendChild(loader);
  this.mediaContainer.appendChild(img);
}
```

同样修改 `showVideo` 方法：

```typescript
/**
 * 显示视频
 */
private showVideo(item: MediaItem): void {
  if (!this.mediaContainer) return;

  // 创建视频容器
  const videoWrapper = document.createElement('div');
  videoWrapper.className = 'lightbox__video-wrapper';

  // 创建加载指示器
  const loader = document.createElement('div');
  loader.className = 'lightbox__loader';

  // 创建视频元素
  const video = document.createElement('video');
  video.className = 'lightbox__video';
  video.controls = true;
  video.preload = 'metadata';
  video.playsInline = true;

  // 视频可以播放时移除加载指示器
  video.oncanplay = () => {
    loader.remove();
    video.classList.add('lightbox__video--loaded');
  };

  // 视频加载失败
  video.onerror = () => {
    loader.remove();
    video.style.display = 'none';  // 隐藏视频元素
    const error = document.createElement('div');
    error.className = 'lightbox__error';
    error.textContent = '视频加载失败';
    videoWrapper.appendChild(error);
  };

  // 设置视频源
  video.src = getFileUrl(item.path);

  // 保存当前视频引用
  this.currentVideo = video;

  videoWrapper.appendChild(loader);
  videoWrapper.appendChild(video);
  this.mediaContainer.appendChild(videoWrapper);
}
```

## 验证

修改后重新构建并测试：

```bash
cd client
npm run build
```

测试以下场景：

| 场景 | 预期结果 |
|------|----------|
| 大图片 | 图片不会遮挡底部信息栏 |
| 图片加载失败 | 显示"图片加载失败"，信息栏正常显示 |
| 视频加载失败 | 显示"视频加载失败"，信息栏正常显示 |
| 正常视频 | 视频和信息栏都正常显示 |

---
## 🧑‍💻 User

给出到目前为止的完整的main.CSS。

---
## 🤖 Assistant

# 完整的 client/styles/main.css

```css
/* ===== CSS变量 ===== */
:root {
  /* 颜色 */
  --color-bg: #1a1a1a;
  --color-bg-secondary: #2a2a2a;
  --color-bg-hover: #3a3a3a;
  --color-text: #ffffff;
  --color-text-secondary: #aaaaaa;
  --color-border: #444444;
  --color-primary: #4a9eff;
  --color-primary-hover: #6ab0ff;
  
  /* 间距 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* 圆角 */
  --radius-sm: 4px;
  --radius-md: 8px;
  
  /* 缩略图尺寸 */
  --thumbnail-size: 200px;
  
  /* 过渡 */
  --transition-fast: 0.15s ease;
  --transition-normal: 0.25s ease;
}

/* ===== 重置样式 ===== */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* ===== 基础样式 ===== */
html {
  font-size: 16px;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: var(--color-bg);
  color: var(--color-text);
  line-height: 1.5;
  min-height: 100vh;
}

/* ===== 应用容器 ===== */
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* ===== 头部 ===== */
.header {
  background-color: var(--color-bg-secondary);
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header__title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: var(--spacing-md);
}

/* ===== 路径输入容器 ===== */
.path-input-container {
  display: flex;
  gap: var(--spacing-sm);
}

/* ===== 主内容区域 ===== */
.main {
  flex: 1;
  padding: var(--spacing-lg);
}

/* ===== 缩略图网格 ===== */
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--thumbnail-size), 1fr));
  gap: var(--spacing-md);
  justify-items: center;
}

.gallery__placeholder {
  grid-column: 1 / -1;
  text-align: center;
  color: var(--color-text-secondary);
  padding: var(--spacing-xl);
}

/* ===== 底部分页区域 ===== */
.footer {
  background-color: var(--color-bg-secondary);
  padding: var(--spacing-md) var(--spacing-lg);
  border-top: 1px solid var(--color-border);
  position: sticky;
  bottom: 0;
}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-sm);
}

/* ===== 通用按钮样式 ===== */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text);
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background-color var(--transition-fast), border-color var(--transition-fast);
}

.btn:hover {
  background-color: var(--color-bg-hover);
  border-color: var(--color-primary);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn--primary {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.btn--primary:hover {
  background-color: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}

/* ===== 通用输入框样式 ===== */
.input {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: 1rem;
  color: var(--color-text);
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  outline: none;
  transition: border-color var(--transition-fast);
}

.input:focus {
  border-color: var(--color-primary);
}

.input::placeholder {
  color: var(--color-text-secondary);
}

/* ===== 加载状态 ===== */
.loading {
  opacity: 0.6;
  pointer-events: none;
}

/* ===== 错误状态 ===== */
.error-message {
  color: #ff6b6b;
  padding: var(--spacing-md);
  text-align: center;
}

/* ===== 旋转动画 ===== */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ===== 路径输入组件 ===== */
.path-input {
  display: flex;
  gap: var(--spacing-sm);
  width: 100%;
  max-width: 800px;
}

.path-input__input {
  flex: 1;
  min-width: 0;
  font-family: 'Consolas', 'Monaco', monospace;
}

.path-input__button {
  flex-shrink: 0;
  min-width: 100px;
}

/* 加载状态按钮 */
.btn--loading {
  position: relative;
  color: transparent !important;
}

.btn--loading::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 16px;
  height: 16px;
  margin: -8px 0 0 -8px;
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.btn--loading::before {
  content: '加载中...';
  color: var(--color-text);
}

/* 输入框禁用状态 */
.path-input__input:disabled {
  background-color: var(--color-bg-secondary);
  cursor: not-allowed;
  opacity: 0.7;
}

/* 按钮禁用状态增强 */
.path-input__button:disabled {
  background-color: var(--color-bg-hover);
  border-color: var(--color-border);
  cursor: not-allowed;
}

/* ===== 缩略图网格组件 ===== */
.gallery__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--thumbnail-size), 1fr));
  gap: var(--spacing-md);
  justify-items: center;
  width: 100%;
}

/* 状态显示（加载中、空状态） */
.gallery__status {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl) var(--spacing-md);
  color: var(--color-text-secondary);
  width: 100%;
  min-height: 300px;
}

.gallery__status-text {
  margin-top: var(--spacing-md);
  font-size: 1rem;
  text-align: center;
}

.gallery__empty-icon {
  opacity: 0.5;
}

/* 加载动画 */
.gallery__spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* 缩略图卡片 */
.gallery__card {
  width: var(--thumbnail-size);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  transition: transform var(--transition-fast), box-shadow var(--transition-fast);
}

.gallery__card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.gallery__card:active {
  transform: translateY(-2px);
}

/* 缩略图容器 */
.gallery__thumbnail-wrapper {
  position: relative;
  width: 100%;
  height: var(--thumbnail-size);
  background-color: var(--color-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.gallery__thumbnail-wrapper--error {
  background-color: var(--color-bg-hover);
}

.gallery__thumbnail-wrapper--error::after {
  content: '加载失败';
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

/* 缩略图图片 */
.gallery__thumbnail {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-normal);
}

.gallery__card:hover .gallery__thumbnail {
  transform: scale(1.05);
}

/* 类型图标 */
.gallery__type-icon {
  position: absolute;
  top: var(--spacing-xs);
  right: var(--spacing-xs);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.9;
}

.gallery__type-icon--image {
  background-color: rgba(74, 158, 255, 0.9);
  color: white;
}

.gallery__type-icon--video {
  background-color: rgba(255, 107, 107, 0.9);
  color: white;
}

/* 文件信息 */
.gallery__info {
  padding: var(--spacing-sm);
}

.gallery__name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: var(--spacing-xs);
}

.gallery__meta {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

/* ===== 分页组件 ===== */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.pagination__info {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  white-space: nowrap;
}

.pagination__buttons {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.pagination__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  padding: 0 var(--spacing-sm);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  user-select: none;
}

.pagination__btn:hover:not(:disabled) {
  background-color: var(--color-bg-hover);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.pagination__btn:active:not(:disabled) {
  transform: scale(0.95);
}

.pagination__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination__btn--active {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.pagination__btn--active:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
  color: white;
}

.pagination__ellipsis {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  user-select: none;
}

/* 分页响应式调整 */
@media (max-width: 600px) {
  .pagination {
    gap: var(--spacing-sm);
  }

  .pagination__info {
    width: 100%;
    text-align: center;
    order: -1;
  }

  .pagination__btn {
    min-width: 32px;
    height: 32px;
    font-size: 0.8125rem;
  }

  .pagination__ellipsis {
    width: 24px;
  }
}

/* ===== 灯箱组件 ===== */
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox--hidden {
  display: none;
}

/* 遮罩层 */
.lightbox__overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.95);
  cursor: pointer;
}

/* 内容区域 */
.lightbox__content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: var(--spacing-xl);
  pointer-events: none;
}

.lightbox__content > * {
  pointer-events: auto;
}

/* 关闭按钮 */
.lightbox__close {
  position: absolute;
  top: var(--spacing-md);
  right: var(--spacing-md);
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: background-color var(--transition-fast);
  z-index: 10;
}

.lightbox__close:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

/* 导航按钮 */
.lightbox__nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  transition: background-color var(--transition-fast), opacity var(--transition-fast);
  z-index: 10;
}

.lightbox__nav:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.2);
}

.lightbox__nav:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.lightbox__nav--prev {
  left: var(--spacing-md);
}

.lightbox__nav--next {
  right: var(--spacing-md);
}

/* 媒体容器 */
.lightbox__media {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: calc(100% - 120px);
  max-height: calc(100% - 120px);
  position: relative;
}

/* 图片 */
.lightbox__image {
  max-width: 100%;
  max-height: calc(100vh - 180px);
  object-fit: contain;
  opacity: 0;
  transition: opacity var(--transition-normal);
  user-select: none;
  -webkit-user-drag: none;
}

.lightbox__image--loaded {
  opacity: 1;
}

/* 视频容器 */
.lightbox__video-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  max-width: 100%;
  max-height: 100%;
}

/* 视频元素 */
.lightbox__video {
  max-width: 100%;
  max-height: calc(100vh - 180px);
  background-color: #000;
  opacity: 0;
  transition: opacity var(--transition-normal);
  outline: none;
}

.lightbox__video--loaded {
  opacity: 1;
}

/* 视频控制栏样式增强 */
.lightbox__video::-webkit-media-controls-panel {
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
}

/* 加载指示器 */
.lightbox__loader {
  position: absolute;
  width: 48px;
  height: 48px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* 错误提示 */
.lightbox__error {
  color: #ff6b6b;
  font-size: 1rem;
  padding: var(--spacing-lg);
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 不支持的类型 */
.lightbox__unsupported {
  color: var(--color-text-secondary);
  font-size: 1rem;
  padding: var(--spacing-lg);
  text-align: center;
}

/* 信息栏 */
.lightbox__info {
  position: absolute;
  bottom: var(--spacing-md);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: rgba(0, 0, 0, 0.7);
  border-radius: var(--radius-md);
  color: white;
  font-size: 0.875rem;
  max-width: calc(100% - var(--spacing-xl) * 2);
  z-index: 10;
}

.lightbox__filename {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 400px;
}

.lightbox__meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  color: var(--color-text-secondary);
  white-space: nowrap;
}

.lightbox__type {
  padding: 2px 8px;
  background-color: var(--color-primary);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
  color: white;
}

.lightbox__counter {
  font-weight: 500;
  color: var(--color-primary);
}

/* 灯箱响应式调整 */
@media (max-width: 768px) {
  .lightbox__content {
    padding: var(--spacing-md);
  }

  .lightbox__nav {
    width: 44px;
    height: 44px;
  }

  .lightbox__nav--prev {
    left: var(--spacing-xs);
  }

  .lightbox__nav--next {
    right: var(--spacing-xs);
  }

  .lightbox__media {
    max-width: calc(100% - 60px);
  }

  .lightbox__image,
  .lightbox__video {
    max-height: calc(100vh - 160px);
  }

  .lightbox__info {
    flex-direction: column;
    gap: var(--spacing-xs);
    text-align: center;
  }

  .lightbox__filename {
    max-width: 100%;
  }
}
```
