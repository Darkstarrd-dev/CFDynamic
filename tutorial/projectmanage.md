```markdown
# 人类与大语言模型协作进行软件工程开发的最佳实践指南

> 本文档整理自一次完整的探讨对话，涵盖问题分析、协作策略、完整项目推演及会话管理方法。

---

## 目录

1. [背景与问题](#1-背景与问题)
2. [问题本质分析](#2-问题本质分析)
3. [核心协作策略](#3-核心协作策略)
4. [案例复盘：图片浏览器项目](#4-案例复盘图片浏览器项目)
5. [完整项目推演](#5-完整项目推演)
6. [会话管理策略](#6-会话管理策略)
7. [总结与速查](#7-总结与速查)

---

## 1. 背景与问题

### 1.1 开发场景

- **项目类型**：个人项目，涵盖 Web、后端、本地应用
- **项目规模**：小型工具到中型软件工程，无大型工程
- **核心痛点**：随着项目增长，LLM 生成质量线性下降

### 1.2 典型问题表现

| 阶段 | 表现 |
|------|------|
| 项目初期 | LLM 完成度高，结果惊艳 |
| 需求增加后 | 修复一个问题，又冒出其他问题 |
| 持续迭代后 | 新增功能导致已修复的功能失效 |
| 最终状态 | 项目陷入混乱，无法继续推进 |

### 1.3 曾尝试的方法

1. **传统方式**：提出需求 → LLM 制定计划 → 分步执行 → 第五步左右崩溃
2. **单问题模式**：逐个问题让 LLM 分析，人工修改 → 效率过低，项目放弃

---

## 2. 问题本质分析

### 2.1 质量下降曲线

```
项目复杂度 ────────────────────────────►
     │
质量 │  ████████
     │        ████████
     │              ████████
     │                    ████████
     │                          ████ ← 崩溃点
     └─────────────────────────────────────
         初期惊艳    中期勉强    后期失控
```

### 2.2 LLM 的根本局限

| 局限 | 具体表现 |
|------|----------|
| **无状态** | 每次对话"失忆"，需要重新理解项目 |
| **上下文窗口** | 即使 200K tokens，也无法真正理解复杂代码库的所有关联 |
| **局部视角** | 倾向于解决眼前问题，缺乏全局架构感知 |
| **无法运行验证** | 不知道改动的实际影响，只能"猜测" |

### 2.3 人类角色的重新定位

**传统思维**：人类写代码，LLM 辅助

**应该转变为**：人类做架构守护者，LLM 做受控的执行者

```
┌─────────────────────────────────────────────────┐
│                    人类职责                       │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐      │
│  │ 架构设计   │ │ 边界守护   │ │ 质量验证   │      │
│  └─────┬─────┘ └─────┬─────┘ └─────┬─────┘      │
│        │             │             │            │
│        ▼             ▼             ▼            │
│  ┌─────────────────────────────────────────┐   │
│  │              约束与上下文                  │   │
│  └─────────────────────┬───────────────────┘   │
└────────────────────────┼────────────────────────┘
                         ▼
              ┌─────────────────────┐
              │    LLM 受控生成      │
              └─────────────────────┘
```

---

## 3. 核心协作策略

### 3.1 策略一：模块隔离 — 限制 LLM 的作用域

**问题**：让 LLM 看到整个项目 → 它会"好心"地改动不该改的地方

**解决**：每次只让 LLM 在一个模块内工作

```
❌ 错误方式：
"这是我的整个项目，帮我添加用户认证功能"

✅ 正确方式：
"这是 auth 模块的接口定义和现有代码。
 只修改 auth/ 目录下的文件。
 不要改动 database.py 的接口。
 新增登录功能，返回 JWT token。"
```

**人类需要做的**：
- 项目初期就定义清晰的模块边界
- 每个模块有明确的接口（输入/输出）
- 给 LLM 任务时，明确"禁区"

### 3.2 策略二：上下文工程 — 精心准备最小有效上下文

与其把所有代码丢给 LLM，不如准备一个**最小有效上下文包**：

```markdown
## 本次任务上下文

### 1. 要修改的文件
[粘贴具体代码]

### 2. 相关接口定义（只需签名，不需实现）
```python
# database.py - 不要修改此文件
def get_user(user_id: str) -> User | None: ...
def save_user(user: User) -> bool: ...
```

### 3. 约束条件
- 使用现有的 logger 实例，不要创建新的
- 错误处理统一抛出 AppException
- 所有异步函数用 async/await

### 4. 本次目标
添加用户邮箱验证功能
```

### 3.3 策略三：测试作为安全网

这是防止"修一个坏两个"的唯一可靠方法。

**协作模式**：

```
第一步：人类写/审核测试
         ↓
第二步：LLM 写实现
         ↓
第三步：运行测试验证
         ↓
第四步：测试失败 → 带着失败信息让 LLM 修复
         ↓
第五步：全部通过 → 提交
```

**有效的 prompt 模板**：

```
现有测试用例：
[粘贴测试代码]

当前实现：
[粘贴实现代码]

测试失败信息：
[粘贴错误]

请修复实现，使测试通过。不要修改测试。
```

### 3.4 策略四：维护项目规范文档

创建一个 `LLM_CONTEXT.md` 文件，每次交给 LLM 任务时附带：

```markdown
# 项目规范（给 LLM）

## 技术栈
- Python 3.11, FastAPI, SQLAlchemy 2.0
- 异步优先

## 代码规范
- 类型注解必须
- 函数不超过 30 行
- 使用 dataclass 而非 dict 传递数据

## 架构规则
- Controller → Service → Repository 分层
- 跨层调用必须通过接口
- 不允许循环依赖

## 已知陷阱
- User.email 已有唯一索引，新增用户需捕获 IntegrityError
- config 是单例，不要重复初始化
```

### 3.5 策略五：小步提交，频繁验证

```
❌ 危险模式：
    需求 ──────────────────────► 一次性完成
    （中间无验证，最后发现一堆问题混在一起）

✅ 安全模式：
    需求 ──► 拆解 ──► 完成A ──► 验证 ──► 提交
                         │
                         ▼
                    完成B ──► 验证 ──► 提交
                         │
                         ▼
                    完成C ──► 验证 ──► 提交
```

每个"完成→验证→提交"是一个安全检查点，出问题可以精确定位和回滚。

### 3.6 任务类型的分工建议

| 任务类型 | 主导方 | 原因 |
|---------|-------|------|
| 新建独立模块 | LLM | 无历史包袱，可以发挥 |
| 已有代码小修改 | LLM + 人类审核 | 需验证不破坏现有功能 |
| 跨模块重构 | 人类主导 | LLM 难以把控全局影响 |
| 架构决策 | 人类 | LLM 缺乏项目长期视角 |
| Bug 定位 | 人类 | LLM 不能运行调试 |
| Bug 修复 | LLM | 定位后修复相对明确 |
| 写测试 | 协作 | LLM 写初稿，人类补边界情况 |

---

## 4. 案例复盘：图片浏览器项目

### 4.1 项目背景

一个基于网页的图片浏览器，使用 File System Access API 访问用户本地数据。

### 4.2 原计划与执行情况

| 步骤 | 内容 | 结果 |
|------|------|------|
| 第一步 | 基本页面框架 | ✓ 完成 |
| 第二步 | File System Access API 测试 | ✓ 完成（解决了跨域问题） |
| 第三步 | 图片加载 + 多格式 + 文件夹遍历 + 压缩包 + 翻页 + 缩放 + 全屏 + 自动播放 | ⚠️ 功能堆积 |
| 第四步 | 单页 → 双页 | ⚠️ 状态分裂 |
| 第五步 | 两边独立控制 | ❌ 崩溃，项目放弃 |

### 4.3 问题根源分析

```
功能复杂度
    │
    │                            ┌─── 第五步：双页独立状态
    │                         ┌──┤    两个播放速度
    │                    ┌────┤  └─── 修复导致连锁反应
    │               ┌────┤    │
    │          ┌────┤    │    └────── 第四步：状态开始分裂
    │     ┌────┤    │    │
    │     │    │    │    └─────────── 压缩包当文件夹展开
    │     │    │    └──────────────── 自动遍历 + 列表
    │     │    └───────────────────── 翻页/缩放/全屏/自动播放
    │     └────────────────────────── 第三步：功能爆炸点 ⚠️
    │─────────────────────────────────
    └──────────────────────────────────────────────► 步骤
         1      2         3              4     5
        框架  API测试   功能爆炸      分页   崩溃
```

**最致命的问题是第三步**：给 LLM 的是一个功能清单，而不是可验证的单元。

| 步骤 | 发生了什么 | 问题本质 |
|-----|-----------|---------|
| 第三步 | 一次性要求 7+ 个功能点 | **需求堆积** |
| 第四步 | 单页 → 双页 | **状态分裂**：从 1 套状态变成 2 套 |
| 第五步 | 两边独立控制 | **状态耦合**：LLM 已分不清哪个状态属于哪个面板 |

### 4.4 正确的步骤拆分

原来的第三步（一次性）：
```
图片格式 + 文件夹 + 压缩包 + 翻页 + 缩放 + 全屏 + 自动播放
```

应该拆分为 8 个独立步骤：
```
3a. 加载并显示单张图片（硬编码路径）
3b. 翻页（上一张/下一张）
3c. 缩放功能
3d. 全屏功能  
3e. 自动播放
3f. 文件夹选择 + 遍历
3g. 压缩包读取（独立模块）
3h. 压缩包集成到文件列表
```

---

## 5. 完整项目推演

以下是图片浏览器项目的完整正确推演过程。

### 5.1 阶段 0：需求澄清

#### 第一次对话

**人类应该这样开始**：

```
我想做一个本地图片浏览器，基于网页技术。

大概的需求：
- 能选择本地文件夹，浏览里面的图片
- 支持常见图片格式
- 能打开压缩包，像文件夹一样浏览里面的图片
- 基本的浏览功能：翻页、缩放、全屏、自动播放
- 可能需要同时显示两个面板，分别浏览不同内容

请先帮我梳理需求，确认我是否遗漏了什么，或者有什么需要我澄清的。
```

> **要点**：不要一开始就要求"做计划"或"开始做"，先让 LLM 帮你发现需求中的模糊地带。

#### LLM 的澄清问题

**核心功能确认**：

| 功能点 | 需要确认 |
|-------|---------|
| 文件夹选择 | 是选择后显示所有图片列表，还是只显示当前图片+翻页？ |
| 压缩包支持 | 哪些格式？zip/rar/7z？是否需要支持嵌套压缩包？ |
| 图片格式 | jpg/png/gif/webp？gif 需要动画播放吗？ |
| 自动播放 | 播放间隔可调吗？范围是多少？ |
| 双面板 | 是"一定需要"还是"以后可能需要"？两个面板独立操作还是联动？ |

**使用场景问题**：
- 图片数量级？几十张 vs 几千张
- 图片尺寸？普通照片 vs 超大漫画扫描图
- 需要记住上次浏览位置吗？

**边界问题**：
- 需要图片编辑功能吗？
- 需要收藏/标记功能吗？
- 需要幻灯片之外的排序方式吗？

#### 人类的回应示例

```
逐个回答：

文件夹选择：显示列表 + 当前图片
压缩包：先只支持 zip，不需要嵌套
图片格式：jpg/png/gif/webp，gif 需要动画
自动播放：可调，1-30秒
双面板：一定需要，独立操作

使用场景：
- 几百到几千张
- 会有大尺寸图片（漫画扫描）
- 需要记住位置

边界 - 都不需要：
- 不要编辑
- 不要收藏
- 排序先按文件名就行
```

### 5.2 阶段 1：创建项目规范文档

#### 初始版本：`LLM_CONTEXT.md`

```markdown
# 图片浏览器项目 - LLM 协作上下文

## 项目概述
本地图片浏览器，基于 Web 技术，通过本地服务器访问文件系统。

## 需求边界

### 必须实现
- [ ] 选择本地文件夹，显示图片列表
- [ ] 浏览图片：翻页、缩放、全屏
- [ ] 自动播放（1-30秒可调）
- [ ] 支持 zip 压缩包（作为虚拟文件夹）
- [ ] 双面板独立浏览
- [ ] 记住上次浏览位置
- [ ] 支持格式：jpg, png, gif(动画), webp
- [ ] 支持大尺寸图片（漫画扫描级别）
- [ ] 支持几千张图片规模

### 明确不做
- ✗ 图片编辑（裁剪、旋转等）
- ✗ 收藏/标记功能
- ✗ 复杂排序（只按文件名）
- ✗ 嵌套压缩包
- ✗ zip 之外的压缩格式

## 技术选型
（待定）

## 架构设计
（待定）

## 代码规范
（待定）

## 模块清单
（待定）

## 开发日志
- YYYY-MM-DD: 项目启动，需求确认完成
```

### 5.3 阶段 2：技术选型

#### 人类的请求

```
需求确认完成。现在请帮我进行技术选型。

我的背景：
- 熟悉 HTML/CSS/JavaScript
- 了解 Vue（或 React）
- 没有用过 File System Access API

请给我技术选型建议，说明理由，我来做最终决定。
```

#### LLM 的建议

**前端框架**：

| 选项 | 推荐度 | 理由 |
|-----|-------|------|
| 原生 JS | ⭐⭐ | 最简单，但状态管理会变复杂 |
| Vue 3 | ⭐⭐⭐⭐ | 响应式状态管理适合双面板场景 |
| React | ⭐⭐⭐ | 可以，但学习成本略高 |

**建议：Vue 3 + 组合式 API**

**文件访问方案**：

| 选项 | 推荐度 | 理由 |
|-----|-------|------|
| File System Access API | ⭐⭐ | 浏览器原生，但兼容性问题多 |
| 本地服务器 | ⭐⭐⭐⭐ | 稳定可控，解决跨域问题 |
| Electron | ⭐⭐⭐ | 完整桌面应用，但复杂度高 |

**建议：本地 Node.js 服务器**

**综合建议**：

```
前端：Vue 3 + Vite
后端：Node.js + Express（简单服务器）
压缩包：后端 adm-zip
通信：REST API
```

#### 更新文档

```markdown
## 技术选型

### 前端
- Vue 3（组合式 API）
- Vite 构建

### 后端
- Node.js
- Express

### 关键库
- adm-zip（压缩包处理，后端）

### 通信方式
- REST API（前后端分离）
```

### 5.4 阶段 3：架构设计

#### 整体架构图

```
┌─────────────────────────────────────────────────────────────┐
│                         前端 (Vue 3)                         │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                    App.vue                           │    │
│  │  ┌─────────────────────┐ ┌─────────────────────┐    │    │
│  │  │     PanelA          │ │      PanelB         │    │    │
│  │  │  ┌──────────────┐   │ │  ┌──────────────┐   │    │    │
│  │  │  │ ImageViewer  │   │ │  │ ImageViewer  │   │    │    │
│  │  │  └──────────────┘   │ │  └──────────────┘   │    │    │
│  │  │  ┌──────────────┐   │ │  ┌──────────────┐   │    │    │
│  │  │  │ FileList     │   │ │  │ FileList     │   │    │    │
│  │  │  └──────────────┘   │ │  └──────────────┘   │    │    │
│  │  │  ┌──────────────┐   │ │  ┌──────────────┐   │    │    │
│  │  │  │ Controls     │   │ │  │ Controls     │   │    │    │
│  │  │  └──────────────┘   │ │  └──────────────┘   │    │    │
│  │  └─────────────────────┘ └─────────────────────┘    │    │
│  └─────────────────────────────────────────────────────┘    │
│                              │                               │
│  ┌───────────────────────────┼───────────────────────────┐  │
│  │                     状态管理                            │  │
│  │   panelStore(A)          panelStore(B)                │  │
│  └───────────────────────────────────────────────────────┘  │
│                              │                               │
│  ┌───────────────────────────┴───────────────────────────┐  │
│  │                     API 服务层                         │  │
│  │   fileService.js（封装所有后端 API 调用）              │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                               │
                               ▼ HTTP
┌─────────────────────────────────────────────────────────────┐
│                       后端 (Express)                         │
│  ┌─────────────────┐ ┌─────────────────┐ ┌───────────────┐  │
│  │  文件夹路由     │ │   图片路由       │ │  压缩包路由    │  │
│  │  /api/folder    │ │   /api/image    │ │  /api/archive │  │
│  └────────┬────────┘ └────────┬────────┘ └───────┬───────┘  │
│           │                   │                   │          │
│  ┌────────┴───────────────────┴───────────────────┴───────┐ │
│  │                     文件服务层                          │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

#### 模块职责定义

**前端组件**：

| 组件 | 职责 | 状态 |
|-----|------|------|
| `App.vue` | 布局，管理两个面板 | 无自身状态 |
| `Panel.vue` | 面板容器，组合子组件 | 持有 panelStore 引用 |
| `ImageViewer.vue` | 显示图片，缩放交互 | 无状态，纯展示 |
| `FileList.vue` | 显示文件列表 | 无状态，纯展示 |
| `Controls.vue` | 播放控制按钮 | 无状态，纯展示 |

> **关键设计**：展示组件无状态，所有状态在 Store 中

**状态结构**：

```javascript
// 每个面板一个独立的 store 实例
function createPanelStore(panelId) {
  return {
    panelId,
    
    // 文件相关
    currentPath: '',        // 当前文件夹/压缩包路径
    fileList: [],           // 文件列表
    currentIndex: 0,        // 当前显示索引
    
    // 显示相关
    zoom: 100,              // 缩放百分比
    isFullscreen: false,
    
    // 播放相关
    isPlaying: false,
    playSpeed: 3,           // 秒
  }
}
```

**后端 API**：

| 端点 | 方法 | 功能 |
|-----|------|------|
| `/api/folder/list` | POST | 列出文件夹内容 |
| `/api/folder/select` | GET | 打开文件夹选择对话框 |
| `/api/image/:path` | GET | 获取图片内容 |
| `/api/archive/list` | POST | 列出压缩包内容 |
| `/api/archive/extract` | POST | 提取压缩包中的图片 |

#### 更新文档

```markdown
## 架构设计

### 前端组件结构
- App.vue：布局容器
- Panel.vue：面板容器（复用两次）
- ImageViewer.vue：图片显示（无状态）
- FileList.vue：文件列表（无状态）
- Controls.vue：播放控制（无状态）

### 状态管理
- 使用 panelStore 工厂函数
- 每个面板独立的状态实例
- 展示组件不持有状态

### 后端 API
- /api/folder/* - 文件夹操作
- /api/image/* - 图片获取
- /api/archive/* - 压缩包操作

### 目录结构
```
project/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Panel.vue
│   │   │   ├── ImageViewer.vue
│   │   │   ├── FileList.vue
│   │   │   └── Controls.vue
│   │   ├── stores/
│   │   │   └── panelStore.js
│   │   ├── services/
│   │   │   └── fileService.js
│   │   ├── App.vue
│   │   └── main.js
│   └── ...
├── backend/
│   ├── routes/
│   │   ├── folder.js
│   │   ├── image.js
│   │   └── archive.js
│   ├── services/
│   │   └── fileService.js
│   └── server.js
└── LLM_CONTEXT.md
```
```

### 5.5 阶段 4：任务拆分

#### 实施步骤清单

```
阶段 A：基础骨架
  A1. 项目初始化（前后端目录、依赖）
  A2. 后端服务器启动 + CORS 配置
  A3. 前端空白页面 + 能访问后端

阶段 B：单图片显示（最小功能闭环）
  B1. 后端：硬编码返回一张测试图片
  B2. 前端：ImageViewer 组件显示这张图片
  B3. 图片加载状态（loading/error）

阶段 C：文件夹浏览
  C1. 后端：读取指定文件夹，返回图片列表
  C2. 前端：FileList 组件显示列表
  C3. 点击列表项 → 显示对应图片
  C4. 后端：文件夹选择对话框
  C5. 前端：选择文件夹按钮

阶段 D：基础浏览功能
  D1. 翻页（上一张/下一张）
  D2. 键盘快捷键（左右箭头）
  D3. 缩放功能
  D4. 全屏功能

阶段 E：自动播放
  E1. 播放/暂停
  E2. 速度调节

阶段 F：压缩包支持
  F1. 后端：解析 zip 文件列表
  F2. 后端：提取 zip 中的图片
  F3. 前端：把压缩包当作文件夹处理

阶段 G：双面板
  G1. panelStore 工厂函数 + 单面板正常
  G2. UI 双面板布局
  G3. 两面板独立操作

阶段 H：持久化
  H1. 记住每个面板的上次位置
  H2. 启动时恢复
```

#### 单步规格示例

**A1. 项目初始化**

```
目标：创建项目目录结构，安装依赖

产出物：
- frontend/ 目录（Vite + Vue 3 初始化完成）
- backend/ 目录（Express 初始化完成）

验收标准：
- cd frontend && npm run dev → 看到 Vite 默认页面
- cd backend && npm start → 控制台输出 "Server running on 3001"

无需实现任何业务功能
```

**B2. ImageViewer 组件**

```
目标：创建图片显示组件

创建文件：frontend/src/components/ImageViewer.vue

Props 接口：
{
  src: string,      // 图片 URL
  loading: boolean, // 是否加载中
  error: string,    // 错误信息
}

验收标准：
- 传入有效 src → 显示图片，居中，保持比例
- loading=true → 显示加载动画
- error 有值 → 显示错误提示

禁止事项：
- 不要实现缩放
- 不要实现翻页逻辑
- 不要创建其他文件
```

### 5.6 阶段 5-8：具体实施

#### 步骤 A1：项目初始化

**创建目录结构**：

```bash
mkdir image-viewer
cd image-viewer
mkdir frontend backend
```

**初始化前端**：

```bash
cd frontend
npm create vite@latest . -- --template vue
npm install
```

**初始化后端**：

```bash
cd ../backend
npm init -y
npm install express
```

**创建后端入口文件**：

```javascript
// backend/server.js
const express = require('express');
const app = express();
const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
```

#### 步骤 A2：后端 CORS 配置

```javascript
// backend/server.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors({
  origin: 'http://localhost:5173',
}));

app.use(express.json());

app.get('/api/ping', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
```

#### 步骤 A3：前后端联通

```vue
<!-- frontend/src/App.vue -->
<template>
  <div class="app">
    <h1>图片浏览器</h1>
    <p>后端状态: {{ backendStatus }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const backendStatus = ref('检测中...');

onMounted(async () => {
  try {
    const res = await fetch('http://localhost:3001/api/ping');
    const data = await res.json();
    backendStatus.value = data.status === 'ok' ? '已连接 ✓' : '异常';
  } catch (e) {
    backendStatus.value = '连接失败 ✗';
  }
});
</script>
```

#### 步骤 B1：测试图片 API

```javascript
// backend/server.js - 添加

const path = require('path');
const fs = require('fs');

app.get('/api/image', (req, res) => {
  const imagePath = req.query.path;
  
  if (!imagePath) {
    return res.status(400).json({ error: '缺少 path 参数' });
  }
  
  const normalizedPath = path.normalize(imagePath);
  
  if (!fs.existsSync(normalizedPath)) {
    return res.status(404).json({ error: '文件不存在' });
  }
  
  const ext = path.extname(normalizedPath).toLowerCase();
  const mimeTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
  };
  
  res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
  fs.createReadStream(normalizedPath).pipe(res);
});
```

#### 步骤 B2：ImageViewer 组件

```vue
<!-- frontend/src/components/ImageViewer.vue -->
<template>
  <div class="image-viewer">
    <div v-if="loading" class="loading">
      <span class="spinner"></span>
      <p>加载中...</p>
    </div>
    
    <div v-else-if="error" class="error">
      <p>⚠️ {{ error }}</p>
    </div>
    
    <img
      v-else
      :src="src"
      @load="onLoad"
      @error="onError"
      class="image"
    />
  </div>
</template>

<script setup>
defineProps({
  src: { type: String, required: true },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
});

const emit = defineEmits(['load', 'error']);

function onLoad() {
  emit('load');
}

function onError() {
  emit('error', '图片加载失败');
}
</script>

<style scoped>
.image-viewer {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a1a1a;
}

.image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.loading, .error {
  color: #888;
  text-align: center;
}

.spinner {
  display: inline-block;
  width: 30px;
  height: 30px;
  border: 3px solid #333;
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
```

#### 步骤 C1-C5：文件夹浏览

**后端 API**：

```javascript
// backend/server.js - 添加

const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

function isImageFile(filename) {
  const ext = path.extname(filename).toLowerCase();
  return SUPPORTED_FORMATS.includes(ext);
}

app.post('/api/folder/list', (req, res) => {
  const { folderPath } = req.body;
  
  if (!folderPath) {
    return res.status(400).json({ error: '缺少 folderPath' });
  }
  
  const normalizedPath = path.normalize(folderPath);
  
  if (!fs.existsSync(normalizedPath)) {
    return res.status(404).json({ error: '文件夹不存在' });
  }
  
  try {
    const entries = fs.readdirSync(normalizedPath, { withFileTypes: true });
    
    const items = entries
      .filter(entry => {
        if (entry.isDirectory()) return true;
        if (entry.isFile() && isImageFile(entry.name)) return true;
        if (entry.isFile() && entry.name.endsWith('.zip')) return true;
        return false;
      })
      .map(entry => ({
        name: entry.name,
        path: path.join(normalizedPath, entry.name),
        type: entry.isDirectory() ? 'folder' : 
              entry.name.endsWith('.zip') ? 'archive' : 'image',
      }))
      .sort((a, b) => {
        if (a.type === 'folder' && b.type !== 'folder') return -1;
        if (a.type !== 'folder' && b.type === 'folder') return 1;
        return a.name.localeCompare(b.name);
      });
    
    res.json({ path: normalizedPath, items });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
```

**前端服务层**：

```javascript
// frontend/src/services/fileService.js
const API_BASE = 'http://localhost:3001/api';

export async function listFolder(folderPath) {
  const res = await fetch(`${API_BASE}/folder/list`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folderPath }),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || '请求失败');
  }
  
  return res.json();
}

export function getImageUrl(imagePath) {
  return `${API_BASE}/image?path=${encodeURIComponent(imagePath)}`;
}
```

**FileList 组件**：

```vue
<!-- frontend/src/components/FileList.vue -->
<template>
  <div class="file-list">
    <div class="header">
      <span class="path">{{ currentPath || '未选择文件夹' }}</span>
      <span class="count" v-if="items.length">{{ items.length }} 项</span>
    </div>
    
    <div class="list">
      <div
        v-for="(item, index) in items"
        :key="item.path"
        :class="['item', { active: index === activeIndex }]"
        @click="$emit('select', item, index)"
      >
        <span class="icon">
          {{ item.type === 'folder' ? '📁' : item.type === 'archive' ? '📦' : '🖼️' }}
        </span>
        <span class="name">{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: { type: Array, default: () => [] },
  currentPath: { type: String, default: '' },
  activeIndex: { type: Number, default: -1 },
});

defineEmits(['select']);
</script>
```

#### 步骤 D1-D4：浏览控制

**Controls 组件**：

```vue
<!-- frontend/src/components/Controls.vue -->
<template>
  <div class="controls">
    <button @click="$emit('prev')" :disabled="!canPrev">◀ 上一张</button>
    <span class="position">{{ current }} / {{ total }}</span>
    <button @click="$emit('next')" :disabled="!canNext">下一张 ▶</button>
  </div>
</template>

<script setup>
defineProps({
  current: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  canPrev: { type: Boolean, default: false },
  canNext: { type: Boolean, default: false },
});

defineEmits(['prev', 'next']);
</script>
```

**键盘快捷键**：

```javascript
// App.vue 中添加
import { onMounted, onUnmounted } from 'vue';

function handleKeydown(e) {
  if (e.key === 'ArrowLeft') goPrev();
  else if (e.key === 'ArrowRight') goNext();
  else if (e.key === 'f' || e.key === 'F') toggleFullscreen();
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
```

#### 步骤 D3 问题模拟：缩放功能

**问题描述**：

```
现象：缩放确实生效了，但是图片放大后超出容器，无法滚动查看
```

**单问题模式回应**：

```
问题原因：
transform: scale() 只是视觉缩放，不改变元素实际尺寸，所以容器不会出现滚动条。

修复方案：
改用 width 控制缩放，并让容器支持滚动。

具体修改：
```

```vue
<template>
  <div class="image-scroll-container">
    <img
      :src="src"
      :class="{ 'fit-mode': zoom === 0 }"
      :style="zoom > 0 ? { width: zoom + '%' } : {}"
      class="image"
    />
  </div>
</template>

<style scoped>
.image-scroll-container {
  width: 100%;
  height: 100%;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image.fit-mode {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
</style>
```

> **记录到文档**：zoom=0 表示适应容器模式

#### 步骤 E1-E2：自动播放

```vue
<!-- Controls.vue 扩展 -->
<template>
  <div class="controls">
    <button @click="$emit('prev')" :disabled="!canPrev">◀</button>
    
    <button @click="$emit('toggle-play')">
      {{ isPlaying ? '⏸' : '▶' }}
    </button>
    
    <button @click="$emit('next')" :disabled="!canNext">▶</button>
    
    <span class="position">{{ current }} / {{ total }}</span>
    
    <div class="speed-control">
      <label>速度:</label>
      <input
        type="range"
        :value="playSpeed"
        @input="$emit('update:playSpeed', Number($event.target.value))"
        min="1"
        max="30"
      />
      <span>{{ playSpeed }}s</span>
    </div>
  </div>
</template>
```

#### 步骤 F1-F3：压缩包支持

**后端 API**：

```javascript
// backend/server.js
const AdmZip = require('adm-zip');

app.post('/api/archive/list', (req, res) => {
  const { archivePath } = req.body;
  
  try {
    const zip = new AdmZip(archivePath);
    const entries = zip.getEntries();
    
    const items = entries
      .filter(entry => !entry.isDirectory && isImageFile(entry.entryName))
      .map(entry => ({
        name: entry.entryName.split('/').pop(),
        path: entry.entryName,
        type: 'image',
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
    
    res.json({ path: archivePath, items });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/archive/image', (req, res) => {
  const { archivePath, entryPath } = req.query;
  
  try {
    const zip = new AdmZip(archivePath);
    const entry = zip.getEntry(entryPath);
    
    if (!entry) {
      return res.status(404).json({ error: '文件不存在' });
    }
    
    const buffer = entry.getData();
    const ext = path.extname(entryPath).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
    };
    
    res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
    res.send(buffer);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
```

#### 步骤 G1-G3：双面板（架构变更）

**panelStore 工厂函数**：

```javascript
// frontend/src/stores/panelStore.js
import { reactive, computed, watch } from 'vue';
import { listFolder, listArchive, getImageUrl, getArchiveImageUrl } from '../services/fileService';

export function createPanelStore(panelId) {
  const state = reactive({
    panelId,
    currentPath: '',
    currentArchive: '',
    fileList: [],
    currentIndex: -1,
    loading: false,
    error: '',
    zoom: 0,
    isPlaying: false,
    playSpeed: 3,
  });
  
  let playTimer = null;
  
  const imageItems = computed(() => 
    state.fileList.filter(item => item.type === 'image')
  );
  
  const imageCount = computed(() => imageItems.value.length);
  
  const currentImageIndex = computed(() => {
    if (state.currentIndex < 0) return -1;
    const currentItem = state.fileList[state.currentIndex];
    return imageItems.value.findIndex(item => item.path === currentItem?.path);
  });
  
  const canGoPrev = computed(() => currentImageIndex.value > 0);
  const canGoNext = computed(() => 
    currentImageIndex.value >= 0 && currentImageIndex.value < imageCount.value - 1
  );
  
  const currentImageUrl = computed(() => {
    if (state.currentIndex < 0) return '';
    const item = state.fileList[state.currentIndex];
    if (item?.type !== 'image') return '';
    
    if (state.currentArchive) {
      return getArchiveImageUrl(state.currentArchive, item.path);
    }
    return getImageUrl(item.path);
  });
  
  async function loadFolder(folderPath) {
    try {
      state.loading = true;
      state.error = '';
      const result = await listFolder(folderPath);
      state.currentPath = result.path;
      state.currentArchive = '';
      state.fileList = result.items;
      
      const firstImageIndex = result.items.findIndex(item => item.type === 'image');
      state.currentIndex = firstImageIndex >= 0 ? firstImageIndex : -1;
    } catch (e) {
      state.error = e.message;
    } finally {
      state.loading = false;
    }
  }
  
  function goPrev() {
    if (!canGoPrev.value) return;
    const prevImage = imageItems.value[currentImageIndex.value - 1];
    const index = state.fileList.findIndex(item => item.path === prevImage.path);
    state.currentIndex = index;
  }
  
  function goNext() {
    if (!canGoNext.value) return;
    const nextImage = imageItems.value[currentImageIndex.value + 1];
    const index = state.fileList.findIndex(item => item.path === nextImage.path);
    state.currentIndex = index;
  }
  
  function togglePlay() {
    state.isPlaying = !state.isPlaying;
    if (state.isPlaying) {
      startAutoPlay();
    } else {
      stopAutoPlay();
    }
  }
  
  function startAutoPlay() {
    stopAutoPlay();
    playTimer = setInterval(() => {
      if (canGoNext.value) {
        goNext();
      } else {
        state.isPlaying = false;
        stopAutoPlay();
      }
    }, state.playSpeed * 1000);
  }
  
  function stopAutoPlay() {
    if (playTimer) {
      clearInterval(playTimer);
      playTimer = null;
    }
  }
  
  function dispose() {
    stopAutoPlay();
  }
  
  return {
    state,
    imageCount,
    currentImageIndex,
    canGoPrev,
    canGoNext,
    currentImageUrl,
    loadFolder,
    goPrev,
    goNext,
    togglePlay,
    dispose,
  };
}
```

**Panel 组件**：

```vue
<!-- frontend/src/components/Panel.vue -->
<template>
  <div class="panel">
    <FolderInput @open="store.loadFolder" />
    
    <div class="panel-main">
      <aside class="panel-sidebar">
        <FileList
          :items="store.state.fileList"
          :current-path="store.state.currentPath"
          :active-index="store.state.currentIndex"
          @select="store.selectItem"
        />
      </aside>
      
      <div class="panel-content">
        <div class="panel-viewer">
          <ImageViewer
            :src="store.currentImageUrl.value"
            :loading="store.state.loading"
            :error="store.state.error"
            :zoom="store.state.zoom"
          />
        </div>
        
        <Controls
          :current="store.currentImageIndex.value + 1"
          :total="store.imageCount.value"
          :can-prev="store.canGoPrev.value"
          :can-next="store.canGoNext.value"
          :is-playing="store.state.isPlaying"
          :play-speed="store.state.playSpeed"
          @prev="store.goPrev"
          @next="store.goNext"
          @toggle-play="store.togglePlay"
          @update:play-speed="v => store.state.playSpeed = v"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import ImageViewer from './ImageViewer.vue';
import FileList from './FileList.vue';
import FolderInput from './FolderInput.vue';
import Controls from './Controls.vue';
import { createPanelStore } from '../stores/panelStore';

const props = defineProps({
  panelId: { type: String, required: true },
});

const store = createPanelStore(props.panelId);

onUnmounted(() => {
  store.dispose();
});
</script>
```

**App 双面板布局**：

```vue
<!-- frontend/src/App.vue -->
<template>
  <div class="app">
    <header class="toolbar">
      <h1>图片浏览器</h1>
    </header>
    
    <div class="panels">
      <Panel panel-id="A" />
      <Panel panel-id="B" />
    </div>
  </div>
</template>

<script setup>
import Panel from './components/Panel.vue';
</script>

<style>
.panels {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.panels > * {
  flex: 1;
}
</style>
```

#### 步骤 H1-H2：持久化

```javascript
// frontend/src/utils/storage.js
const STORAGE_KEY = 'image-viewer-state';

export function saveState(panelId, state) {
  const all = loadAllStates();
  all[panelId] = {
    currentPath: state.currentPath,
    currentArchive: state.currentArchive,
    currentIndex: state.currentIndex,
    playSpeed: state.playSpeed,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function loadState(panelId) {
  const all = loadAllStates();
  return all[panelId] || null;
}

function loadAllStates() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}
```

### 5.7 最终项目规范文档

```markdown
# 图片浏览器项目 - 完成状态

> 完成日期：YYYY-MM-DD

## 功能清单

### 已实现
- [x] 选择本地文件夹，显示图片列表
- [x] 浏览图片：翻页、缩放、全屏
- [x] 自动播放（1-30秒可调）
- [x] 支持 zip 压缩包
- [x] 双面板独立浏览
- [x] 记住上次浏览位置
- [x] 格式：jpg, png, gif, webp

### 明确不做
- ✗ 图片编辑
- ✗ 收藏/标记
- ✗ 复杂排序
- ✗ 嵌套压缩包
- ✗ 其他压缩格式

## 技术栈
- 前端：Vue 3 + Vite
- 后端：Node.js + Express
- 压缩包：adm-zip

## 项目结构

```
image-viewer/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Panel.vue
│   │   │   ├── ImageViewer.vue
│   │   │   ├── FileList.vue
│   │   │   ├── Controls.vue
│   │   │   └── FolderInput.vue
│   │   ├── stores/
│   │   │   └── panelStore.js
│   │   ├── services/
│   │   │   └── fileService.js
│   │   ├── utils/
│   │   │   └── storage.js
│   │   ├── App.vue
│   │   └── main.js
│   └── package.json
├── backend/
│   ├── server.js
│   └── package.json
└── LLM_CONTEXT.md
```

## API 端点

| 端点 | 方法 | 功能 |
|-----|------|------|
| /api/ping | GET | 测试连接 |
| /api/image | GET | 获取图片 |
| /api/folder/list | POST | 列出文件夹 |
| /api/archive/list | POST | 列出压缩包 |
| /api/archive/image | GET | 获取压缩包图片 |

## 快捷键

| 按键 | 功能 |
|-----|------|
| ← | 上一张 |
| → | 下一张 |
| F | 全屏切换 |

## 组件接口

### ImageViewer
```
Props: { src, loading, error, zoom }
Events: load, error
注意: zoom=0 表示适应容器模式
```

### FileList
```
Props: { items, currentPath, activeIndex }
Events: select(item, index)
```

### Controls
```
Props: { current, total, canPrev, canNext, isPlaying, playSpeed, isFullscreen }
Events: prev, next, toggle-play, update:playSpeed, fullscreen
```

## 已知问题与解决方案

### D3 缩放问题
问题：transform: scale() 不会触发滚动
解决：使用 width 百分比 + overflow: auto
注意：zoom=0 表示适应容器模式
```

---

## 6. 会话管理策略

### 6.1 核心原则

```
不是"每步新会话"，也不是"一直用到崩溃"
而是"按阶段划分会话，按信号判断切换"
```

### 6.2 两种策略对比

| 策略 | 优点 | 缺点 |
|-----|------|------|
| **每步新会话** | 上下文干净，无累积错误 | 频繁重建上下文，效率低 |
| **一直继续** | 连贯性好，不用重复解释 | 质量劣化，错误延续 |

**实际答案：混合策略**

### 6.3 按阶段管理会话

```
会话 1                    会话 2                    会话 3
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│ 阶段 A: 基础骨架 │      │ 阶段 B-D:       │      │ 阶段 G: 双面板   │
│ A1 → A2 → A3    │      │ 核心功能        │      │ 架构重构        │
│                 │      │ B1→B2→B3        │      │ G1 → G2 → G3    │
│ (3步，简单)     │      │ C1→C2→...       │      │                 │
└────────┬────────┘      │ D1→D2→D3→D4     │      │ (架构变更，     │
         │               │ E1→E2           │      │  需要干净上下文) │
         ▼               │ F1→F2→F3        │      └─────────────────┘
    完成后新建会话        │                 │
                         │ (功能密集，      │
                         │  保持连贯性)     │
                         └────────┬────────┘
                                  │
                                  ▼
                           质量下降时新建会话
```

### 6.4 何时应该新建会话

#### 信号 1：阶段性边界

```
✓ 完成一个完整阶段（如 A阶段 → B阶段）
✓ 即将进行架构变更（如 G阶段的双面板重构）
✓ 技术栈切换（从后端转到前端）
```

#### 信号 2：质量劣化迹象

```
⚠️ LLM 开始重复之前的错误
⚠️ LLM 忘记了之前确定的约定（比如接口定义）
⚠️ 代码与之前的风格不一致
⚠️ LLM 开始"自由发挥"，改动没要求的地方
⚠️ 修复一个问题，又引入新问题（循环）
```

#### 信号 3：对话长度

```
粗略参考：
- 20轮对话以内：通常安全
- 20-40轮：开始关注质量信号
- 40轮以上：建议新建会话，除非进展顺利
```

#### 信号 4：主题漂移

```
如果对话从"实现功能"变成：
- 长时间 debug 同一个问题
- 反复讨论架构决策
- 大量修修补补

→ 停下来，整理文档，新建会话
```

### 6.5 新建会话的操作流程

**步骤 1：整理当前状态到文档**

```markdown
## 当前状态快照（YYYY-MM-DD）

### 已完成
- A1-A3 基础骨架 ✓
- B1-B3 单图片显示 ✓
- C1-C5 文件夹浏览 ✓

### 当前进度
D1 翻页功能 - 进行中

### 上个会话的关键决策
- ImageViewer 使用 zoom=0 表示适应模式
- fileService.js 封装所有 API 调用

### 待解决问题
（如果有未完成的问题，记录在这里）
```

**步骤 2：新会话的开场白**

```
我正在开发图片浏览器项目，继续之前的工作。

[粘贴完整的 LLM_CONTEXT.md]

当前要执行：步骤 D1 - 翻页功能

相关现有代码：
[粘贴 ImageViewer.vue]
[粘贴 App.vue]
```

**步骤 3：确认上下文**

```
👤: 请确认你理解了项目当前状态，然后执行 D1

🤖: 我理解当前状态：
    - 前端 Vue3 + 后端 Express
    - ImageViewer 组件已完成，接口为 {src, loading, error, zoom}
    - 现在需要添加翻页功能...
    
    开始执行 D1...
```

### 6.6 文档的关键作用

```
┌─────────────────────────────────────────────────────────────┐
│                    会话 A                                    │
│   隐性知识（在对话中积累）                                    │
│   - "我们决定用 zoom=0 表示适应模式"                          │
│   - "遇到过 CORS 问题，已解决"                                │
│   - "ImageViewer 接口已锁定，不要改"                          │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │    LLM_CONTEXT.md      │
              │    (显性化的知识)       │
              │                        │
              │  把隐性知识写进文档     │
              └────────────┬───────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    会话 B                                    │
│   通过文档恢复上下文                                          │
│   继续开发，不丢失之前的约定                                  │
└─────────────────────────────────────────────────────────────┘
```

#### 文档应该捕获的内容

| 类型 | 示例 | 为什么重要 |
|-----|------|-----------|
| **接口约定** | `ImageViewer: {src, loading, error, zoom}` | 防止 LLM 在新会话中改变接口 |
| **设计决策** | `zoom=0 表示适应模式` | 避免重新发明轮子 |
| **踩过的坑** | `transform:scale 不触发滚动` | 避免重复犯错 |
| **禁止事项** | `不要修改 ImageViewer 接口` | 明确边界 |
| **当前状态** | `D1 进行中，D2-D4 待做` | 快速恢复进度 |

### 6.7 图片浏览器项目的具体会话规划

```
会话 1: 需求澄清 + 技术选型 + 架构设计
        产出：完整的 LLM_CONTEXT.md 初版
        
        ↓ 新建会话（进入实施阶段）
        
会话 2: A1 → A3（基础骨架）
        简单步骤，一个会话搞定
        
        ↓ 可以继续，也可以新建
        
会话 3: B1 → C5（核心显示功能）
        这些步骤关联紧密，保持连贯
        
        ↓ 完成后新建会话
        
会话 4: D1 → E2（浏览控制功能）
        翻页、缩放、播放等
        
        ↓ 完成后新建会话
        
会话 5: F1 → F3（压缩包支持）
        独立功能模块
        
        ↓ 必须新建会话（架构变更）
        
会话 6: G1 → G3（双面板重构）
        这是架构变更，需要干净上下文
        
        ↓ 完成后新建
        
会话 7: H1 → H2（持久化）
        收尾功能
```

### 6.8 常见问题

**Q: 新会话时，需要把所有代码都发一遍吗？**

不需要。只发：
1. `LLM_CONTEXT.md`（必须）
2. 本次任务直接相关的文件（1-3个）
3. 相关的接口定义（可以是摘要）

**Q: 文档更新太频繁会不会很麻烦？**

建议的节奏：
- 每完成一个步骤：更新进度勾选 `[x]`
- 每遇到一个坑：添加到"已知问题"
- 每个会话结束前：整理关键决策

每次更新 1-2 分钟，换来的是下次会话的高效启动。

**Q: 如果中途遇到问题，在单问题模式下解决，算不算要换会话？**

单问题模式不需要换会话。它只是临时切换交互方式：

```
正常模式 → 遇到问题 → 单问题模式 → 解决 → 回到正常模式
         （同一个会话内）
```

只有当单问题模式也反复失败（3次以上），才考虑：
1. 停下来
2. 把问题详细记录到文档
3. 新会话，专门解决这个问题

### 6.9 实用口诀

```
顺利时继续，卡住时换新
阶段完成换，架构变更换
信号出现换，文档要跟上
```

---

## 7. 总结与速查

### 7.1 人类的核心职责

```
1. 需求边界守护 ─── 明确"做什么"和"不做什么"
2. 架构决策     ─── 预先设计模块和接口
3. 任务拆分     ─── 确保每步可独立验证
4. 即时验证     ─── 每步完成后测试
5. 文档维护     ─── 保持 LLM 上下文一致性
6. 问题诊断     ─── 出问题时精确定位，用单问题模式
```

### 7.2 正确的工作流

```
┌────────────────────────────────────────────────────────────┐
│                       一次开发迭代                          │
│                                                            │
│  ┌──────────┐                                              │
│  │ 准备阶段  │                                              │
│  │ (人类)   │                                              │
│  └────┬─────┘                                              │
│       │ 1. 更新 LLM_CONTEXT.md                              │
│       │ 2. 确定本次要完成的步骤                              │
│       ▼                                                    │
│  ┌──────────┐                                              │
│  │ 发起请求  │ "请执行步骤 X，附上规范文档"                   │
│  │ (人类)   │                                              │
│  └────┬─────┘                                              │
│       ▼                                                    │
│  ┌──────────┐                                              │
│  │ LLM 产出  │ 代码 + 验收步骤                              │
│  └────┬─────┘                                              │
│       ▼                                                    │
│  ┌──────────┐    失败     ┌───────────┐                    │
│  │ 验证     │───────────►│ 单问题模式 │◄─┐                  │
│  │ (人类)   │            └─────┬─────┘  │                  │
│  └────┬─────┘                  │        │                  │
│       │ 成功                    └────────┘                  │
│       ▼                         修复后再验证                │
│  ┌──────────┐                                              │
│  │ 提交     │ git commit                                   │
│  │ (人类)   │                                              │
│  └────┬─────┘                                              │
│       │                                                    │
│       ▼                                                    │
│  ┌──────────┐                                              │
│  │ 更新文档  │ 标记完成，记录问题                            │
│  │ (人类)   │                                              │
│  └──────────┘                                              │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### 7.3 关键对比

| 方面 | 错误的方式 | 正确的方式 |
|-----|-----------|-----------|
| 需求阶段 | 直接要求计划 | 先澄清，确定边界 |
| 步骤粒度 | 多个功能一起做 | 拆成独立可验证的小步骤 |
| 架构设计 | 边做边想 | 预先设计，锁定接口 |
| 状态管理 | 分散在组件中 | 集中在 Store，组件无状态 |
| 重大变更 | 直接改造 | 先重构再扩展 |
| 问题处理 | 丢整个项目让 LLM 修 | 单问题模式，精确定位 |
| 文档 | 无 | 持续更新，每次对话携带 |

### 7.4 单问题模式模板

```markdown
## 问题报告

### 当前步骤
D3 - 缩放功能

### 现象
点击放大按钮，图片不变化

### 相关代码
[只粘贴相关的那几行或那个函数]

### 已尝试
- 检查了按钮绑定，click 事件触发了
- console.log 显示 zoom 值确实变了

### 问题
为什么图片不变化？

### 要求
- 只告诉我问题原因和修复方案
- 不要重写整个组件
- 指出具体修改哪几行
```

### 7.5 LLM_CONTEXT.md 模板

```markdown
# 项目名称 - LLM 协作上下文

> 最后更新：YYYY-MM-DD
> 当前步骤：XX

## 项目概述
简要描述项目目标

## 需求边界

### 必须实现
- [ ] 功能1
- [ ] 功能2

### 明确不做
- ✗ 不需要的功能1
- ✗ 不需要的功能2

## 技术选型
- 前端：xxx
- 后端：xxx

## 架构设计
[架构图和模块说明]

## 代码规范
- 规范1
- 规范2

## 组件接口
[已锁定的接口定义]

## 实施步骤

### 当前进度
- [x] 已完成步骤
- [ ] 当前步骤 ← 当前
- [ ] 待做步骤

## 已知问题与解决方案
[踩过的坑和解决方法]

## 开发日志
- YYYY-MM-DD: 记录
```

---

## 结语

人类与 LLM 的协作开发，本质上是一个**分工与控制**的问题：

- **LLM 擅长**：在明确约束下生成代码、解决局部问题
- **人类擅长**：全局把控、架构决策、质量验证、边界守护

关键不在于让 LLM 做得更多，而在于**让 LLM 在正确的范围内做正确的事**。

通过：
1. 预先的架构设计
2. 清晰的任务拆分
3. 持续的文档维护
4. 即时的验证反馈

可以让项目在持续增长的同时，保持 LLM 输出的质量稳定。
```
