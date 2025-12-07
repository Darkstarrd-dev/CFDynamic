## 🤖 Assistant

# TypeScript Hello World 完整教学

---

## 第一部分：环境准备

### 1.1 前提条件

在学习 TypeScript 之前，你需要已经安装好 Node.js。

**为什么需要 Node.js？**

| 原因 | 解释 |
|------|------|
| TypeScript 编译器用 Node.js 运行 | tsc 命令本身是一个 Node.js 程序 |
| npm 用于安装 TypeScript | npm 是 Node.js 的包管理器 |
| 执行编译后的 JS 文件 | 我们用 Node.js 运行最终的 JavaScript |

**验证 Node.js 是否已安装：**

```bash
node --version
```

如果显示版本号（如 `v20.10.0`），说明已安装。

---

### 1.2 创建项目文件夹

```bash
mkdir my-first-typescript
cd my-first-typescript
```

| 命令 | 含义 |
|------|------|
| `mkdir` | make directory，创建文件夹 |
| `my-first-typescript` | 文件夹名称（可自定义） |
| `cd` | change directory，进入该文件夹 |

---

### 1.3 初始化 Node.js 项目

```bash
npm init -y
```

**逐部分解释：**

| 部分 | 含义 |
|------|------|
| `npm` | Node Package Manager，Node.js 的包管理工具 |
| `init` | initialize（初始化），创建一个新项目 |
| `-y` | yes，自动接受所有默认设置，跳过交互式问答 |

**这个命令做了什么？**

在当前目录创建了一个 `package.json` 文件，内容类似：

```json
{
  "name": "my-first-typescript",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": ""
}
```

**package.json 是什么？**

它是项目的"身份证"和"配置清单"：

| 字段 | 含义 |
|------|------|
| `name` | 项目名称 |
| `version` | 项目版本 |
| `main` | 项目入口文件 |
| `scripts` | 可运行的脚本命令 |
| `dependencies` | 生产环境依赖（运行时需要） |
| `devDependencies` | 开发环境依赖（仅开发时需要） |

---

### 1.4 配置模块类型（重要！）

打开 `package.json`，添加 `"type": "module"`：

```json
{
  "name": "my-first-typescript",
  "version": "1.0.0",
  "type": "module",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": ""
}
```

**为什么需要这个配置？**

| `type` 的值 | 含义 | 输出格式 |
|------------|------|---------|
| 没有设置 | 默认当作 CommonJS | `require`/`exports` |
| `"commonjs"` | 明确指定 CommonJS | `require`/`exports` |
| `"module"` | ES Module（现代标准） | `import`/`export` |

**CommonJS vs ES Module 的区别：**

```javascript
// CommonJS 格式（旧）
const fs = require('fs');
module.exports = { something };

// ES Module 格式（新，推荐）
import fs from 'fs';
export { something };
```

**⚠️ 注意：确保 `type` 字段只出现一次！**

JSON 中如果同一个键出现多次，后面的值会覆盖前面的值。

---

## 第二部分：安装 TypeScript

### 2.1 安装命令

```bash
npm install typescript --save-dev
```

**逐部分解释：**

| 部分 | 含义 |
|------|------|
| `npm` | 包管理工具 |
| `install` | 安装一个包 |
| `typescript` | 要安装的包的名称 |
| `--save-dev` | 保存为开发依赖 |

**什么是开发依赖？**

| 依赖类型 | 标志 | 用途 | 示例 |
|---------|------|------|------|
| 生产依赖 | `--save` | 运行时需要 | express, lodash |
| 开发依赖 | `--save-dev` | 仅开发时需要 | typescript, eslint |

TypeScript 只在开发时用于编译代码，运行时只需要编译后的 JavaScript，所以是开发依赖。

### 2.2 安装后的变化

**package.json 变化：**

```json
{
  "devDependencies": {
    "typescript": "^5.9.3"
  }
}
```

| 符号 | 含义 |
|------|------|
| `^` | 允许安装兼容的新版本（主版本号不变） |
| `5.9.3` | 安装时的具体版本 |

**新增的文件/文件夹：**

| 名称 | 说明 |
|------|------|
| `node_modules/` | 存放所有安装的包 |
| `package-lock.json` | 锁定所有依赖的精确版本 |

### 2.3 验证安装

```bash
npx tsc --version
```

**逐部分解释：**

| 部分 | 含义 |
|------|------|
| `npx` | Node Package Execute，执行本地安装的包 |
| `tsc` | TypeScript Compiler，TypeScript 编译器 |
| `--version` | 显示版本号 |

**为什么用 npx 而不是直接 tsc？**

| 命令 | 行为 |
|------|------|
| `tsc` | 在系统全局路径中查找 tsc |
| `npx tsc` | 在项目本地的 node_modules 中查找 tsc |

使用 `npx` 确保使用的是项目本地安装的版本，避免版本冲突。

---

## 第三部分：配置 TypeScript

### 3.1 创建配置文件

```bash
npx tsc --init
```

**这个命令做了什么？**

创建了一个 `tsconfig.json` 文件，这是 TypeScript 编译器的配置文件。

### 3.2 理解并修改配置

初始生成的文件包含大量注释和选项。这是一个推荐的基础配置：

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "sourceMap": true
  },
  "include": ["src/**/*.ts"]
}
```

### 3.3 配置项逐一详解

#### target

```json
"target": "esnext"
```

| 项目 | 说明 |
|------|------|
| 作用 | 指定编译输出的 JavaScript 版本 |
| `esnext` | 最新的 ECMAScript 标准 |

**不同 target 的编译差异示例：**

源代码：
```typescript
const message: string = "Hello";
```

| target | 输出 |
|--------|------|
| `es3`（默认） | `var message = "Hello";` |
| `es5` | `var message = "Hello";` |
| `es6`/`es2015` | `const message = "Hello";` |
| `esnext` | `const message = "Hello";` |

#### module

```json
"module": "nodenext"
```

| 项目 | 说明 |
|------|------|
| 作用 | 指定输出的模块系统格式 |
| `nodenext` | 使用 Node.js 最新的模块解析方式 |

**重要：`nodenext` 会根据 package.json 的 `type` 字段决定实际输出格式**

| package.json 的 type | 输出格式 |
|---------------------|---------|
| 没有设置 | CommonJS |
| `"commonjs"` | CommonJS |
| `"module"` | ES Module |

#### moduleResolution

```json
"moduleResolution": "nodenext"
```

| 项目 | 说明 |
|------|------|
| 作用 | 告诉编译器如何查找 import 的模块 |
| `nodenext` | 使用 Node.js 最新的模块查找规则 |

#### strict

```json
"strict": true
```

| 项目 | 说明 |
|------|------|
| 作用 | 开启所有严格类型检查 |
| 效果 | 更早发现潜在错误 |

#### esModuleInterop

```json
"esModuleInterop": true
```

| 项目 | 说明 |
|------|------|
| 作用 | 改善 ES Module 与 CommonJS 的互操作性 |
| 效果 | 可以用 `import x from 'y'` 导入 CommonJS 模块 |

#### skipLibCheck

```json
"skipLibCheck": true
```

| 项目 | 说明 |
|------|------|
| 作用 | 跳过 `.d.ts` 声明文件的类型检查 |
| 效果 | 加快编译速度 |

#### forceConsistentCasingInFileNames

```json
"forceConsistentCasingInFileNames": true
```

| 项目 | 说明 |
|------|------|
| 作用 | 强制文件名大小写一致 |
| 效果 | 避免跨平台问题（Windows 不区分大小写，Linux 区分） |

#### outDir 和 rootDir

```json
"outDir": "./dist",
"rootDir": "./src"
```

| 选项 | 作用 | 示例 |
|------|------|------|
| `rootDir` | 源代码目录 | `./src` |
| `outDir` | 编译输出目录 | `./dist` |

**目录结构示例：**

```
my-first-typescript/
├── src/              ← rootDir（你写代码的地方）
│   └── hello.ts
├── dist/             ← outDir（编译产物的地方）
│   ├── hello.js
│   ├── hello.js.map
│   └── hello.d.ts
├── package.json
└── tsconfig.json
```

#### declaration

```json
"declaration": true
```

| 项目 | 说明 |
|------|------|
| 作用 | 生成 `.d.ts` 类型声明文件 |
| 用途 | 供其他 TypeScript 项目使用你的代码时获得类型提示 |

#### sourceMap

```json
"sourceMap": true
```

| 项目 | 说明 |
|------|------|
| 作用 | 生成 `.js.map` 文件 |
| 用途 | 调试时将错误位置映射回原始 .ts 文件 |

#### include

```json
"include": ["src/**/*.ts"]
```

| 项目 | 说明 |
|------|------|
| 作用 | 指定要编译的文件 |
| `src/**/*.ts` | src 目录及所有子目录下的 .ts 文件 |

**通配符解释：**

| 模式 | 含义 |
|------|------|
| `*` | 匹配任意文件名 |
| `**` | 匹配任意层级的目录 |
| `*.ts` | 当前目录下的所有 .ts 文件 |
| `src/**/*.ts` | src 及其子目录下的所有 .ts 文件 |

**为什么需要 include？**

| 情况 | 行为 |
|------|------|
| 没有 `include` | 编译当前目录及子目录下的**所有** .ts 文件 |
| 有 `include` | 只编译指定的文件 |

---

## 第四部分：创建项目结构

### 4.1 创建源代码目录

```bash
mkdir src
```

### 4.2 创建第一个 TypeScript 文件

创建 `src/hello.ts`：

```typescript
const message: string = "Hello, TypeScript!";
console.log(message);
```

**代码逐部分解释：**

```typescript
const message: string = "Hello, TypeScript!";
```

| 部分 | 含义 |
|------|------|
| `const` | 声明一个常量（值不可重新赋值） |
| `message` | 变量名 |
| `: string` | 类型注解，声明这个变量是字符串类型 |
| `=` | 赋值运算符 |
| `"Hello, TypeScript!"` | 字符串值 |
| `;` | 语句结束符 |

**`: string` 是 TypeScript 的核心特性**

| 对比 | 写法 | 类型检查 |
|------|------|---------|
| JavaScript | `const message = "Hello"` | 无 |
| TypeScript | `const message: string = "Hello"` | 有 |

如果你尝试：
```typescript
const message: string = 123;  // 错误！
```
TypeScript 会报错：`Type 'number' is not assignable to type 'string'`

---

## 第五部分：编译和运行

### 5.1 编译 TypeScript

```bash
npx tsc
```

**这个命令做了什么？**

1. 读取 `tsconfig.json` 配置
2. 找到 `include` 指定的所有 `.ts` 文件
3. 进行类型检查
4. 将 TypeScript 编译成 JavaScript
5. 输出到 `outDir` 指定的目录

### 5.2 编译产物解析

编译后 `dist/` 目录下会有三个文件：

#### hello.js（主要产物）

```javascript
const message = "Hello, TypeScript!";
console.log(message);
export {};
//# sourceMappingURL=hello.js.map
```

**逐行解释：**

| 行 | 内容 | 说明 |
|----|------|------|
| 1 | `const message = "Hello, TypeScript!";` | 你的代码（类型注解被移除） |
| 2 | `console.log(message);` | 你的代码（保持不变） |
| 3 | `export {};` | TypeScript 自动添加的模块标记 |
| 4 | `//# sourceMappingURL=hello.js.map` | 指向 source map 的注释 |

**关于 `export {}`：**

| 问题 | 答案 |
|------|------|
| 为什么会出现？ | 源代码没有 import/export，需要标记为 ES Module |
| 它做了什么？ | 导出空对象，仅作为模块标记 |
| 什么时候不会出现？ | 源代码本身有 import 或 export 时 |

**ES Module 的识别规则：**

| 文件特征 | JavaScript 引擎的判断 |
|---------|---------------------|
| 包含 `import` 或 `export` | ES Module |
| 不包含 `import`/`export` | 普通脚本 |

#### hello.d.ts（类型声明文件）

```typescript
declare const message: string;
```

| 用途 | 说明 |
|------|------|
| 给其他 TypeScript 项目提供类型信息 | 当别人导入你的代码时，能获得类型提示 |

#### hello.js.map（源码映射文件）

```json
{"version":3,"file":"hello.js","sourceRoot":"","sources":["../src/hello.ts"],"names":[],"mappings":"AAAA,MAAM,OAAO,GAAW,oBAAoB,CAAC;AAC7C,OAAO,CAAC,GAAG,CAAC,OAAO,CAAC,CAAC"}
```

| 用途 | 说明 |
|------|------|
| 调试时定位原始代码 | 浏览器/Node.js 报错时显示 .ts 文件的行号 |

### 5.3 编译产物对比（不同配置）

根据配置不同，输出会有差异：

| 配置 | 输出特征 |
|------|---------|
| `type: "commonjs"` | 包含 `"use strict"` 和 `Object.defineProperty(exports, ...)` |
| `type: "module"` | 干净的 ES Module 语法，可能有 `export {}` |
| `target: "es5"` | `const` 变成 `var` |
| `target: "esnext"` | 保持 `const` |
| `sourceMap: true` | 包含 `//# sourceMappingURL=...` 注释 |

### 5.4 运行编译后的代码

```bash
node dist/hello.js
```

**输出：**
```
Hello, TypeScript!
```

### 5.5 重要：编译命令的差异（必读！）

#### ⚠️ 核心规则

| 命令 | 是否使用 tsconfig.json | 输出位置 |
|------|----------------------|---------|
| `npx tsc` | ✅ 是 | 按配置输出到 dist/ |
| `npx tsc 文件名` | ❌ 否（使用默认配置） | 源文件同目录 |

#### 对比演示

**使用 tsconfig.json（正确方式）：**

```bash
npx tsc
```

输出 `dist/hello.js`：
```javascript
const message = "Hello, TypeScript!";
console.log(message);
export {};
//# sourceMappingURL=hello.js.map
```

**指定文件名（忽略配置）：**

```bash
npx tsc ./src/hello.ts
```

输出 `src/hello.js`（注意：输出位置变了！）：
```javascript
var message = "Hello, TypeScript!";
console.log(message);
```

#### 为什么会有这种差异？

这是 **TypeScript 的设计决定**：

> 当你指定了具体文件，TypeScript 认为你想要"快速编译这个文件"，
> 所以跳过配置文件查找，使用最基础的默认设置。

#### TypeScript 的默认配置

当忽略 tsconfig.json 时，使用这些默认值：

| 配置项 | 默认值 | 效果 |
|--------|--------|------|
| `target` | `es3` | `const` → `var`，箭头函数 → 普通函数 |
| `module` | `commonjs` | CommonJS 格式输出 |
| `strict` | `false` | 不进行严格类型检查 |
| `sourceMap` | `false` | 不生成 .map 文件 |
| `outDir` | 无 | 输出到源文件同目录 |

#### 如何在指定文件时仍使用配置？

**方法 1：使用 --project 参数**

```bash
npx tsc -p tsconfig.json ./src/hello.ts
```

**方法 2：通过命令行指定配置**

```bash
npx tsc ./src/hello.ts --target esnext --module nodenext --sourceMap
```

**方法 3：始终使用 npx tsc（最佳实践）**

```bash
npx tsc
```

#### 最佳实践总结

| 场景 | 推荐命令 |
|------|---------|
| 日常开发 | `npx tsc` |
| 只想编译特定文件 | 修改 tsconfig.json 的 include，然后 `npx tsc` |
| 必须指定文件 | `npx tsc -p tsconfig.json ./src/hello.ts` |

**记住：永远优先使用 `npx tsc`，让配置文件来管理编译行为。**

---

## 第六部分：添加便捷脚本

### 6.1 修改 package.json

在 `scripts` 中添加便捷命令：

```json
{
  "name": "my-first-typescript",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/hello.js",
    "dev": "tsc && node dist/hello.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "devDependencies": {
    "typescript": "^5.9.3"
  }
}
```

### 6.2 scripts 详解

| 脚本名 | 命令 | 作用 |
|--------|------|------|
| `build` | `tsc` | 编译 TypeScript |
| `start` | `node dist/hello.js` | 运行编译后的程序 |
| `dev` | `tsc && node dist/hello.js` | 编译并运行 |

**为什么 scripts 里不需要 npx？**

| 位置 | 是否需要 npx |
|------|-------------|
| 命令行直接运行 | 需要（`npx tsc`） |
| package.json scripts 中 | 不需要（`tsc`） |

原因：npm 运行 scripts 时，会自动将 `node_modules/.bin` 加入 PATH。

### 6.3 使用脚本

```bash
# 编译
npm run build

# 运行
npm run start
# 或简写
npm start

# 编译并运行
npm run dev
```

**npm run 的简写规则：**

| 完整命令 | 简写 |
|---------|------|
| `npm run start` | `npm start` |
| `npm run test` | `npm test` |
| `npm run build` | 无（必须写 `npm run build`） |

---

## 第七部分：完整项目结构

最终的项目结构：

```
my-first-typescript/
├── src/                      ← 源代码目录
│   └── hello.ts              ← TypeScript 源文件
├── dist/                     ← 编译输出目录
│   ├── hello.js              ← 编译后的 JavaScript
│   ├── hello.js.map          ← Source Map
│   └── hello.d.ts            ← 类型声明文件
├── node_modules/             ← 依赖包目录
├── package.json              ← 项目配置
├── package-lock.json         ← 依赖版本锁定
└── tsconfig.json             ← TypeScript 配置
```

---

## 第八部分：完整配置文件参考

### package.json

```json
{
  "name": "my-first-typescript",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/hello.js",
    "dev": "tsc && node dist/hello.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "description": "",
  "devDependencies": {
    "typescript": "^5.9.3"
  }
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "sourceMap": true
  },
  "include": ["src/**/*.ts"]
}
```

### src/hello.ts

```typescript
const message: string = "Hello, TypeScript!";
console.log(message);
```

---

## 第九部分：常见问题排查

### 问题 1：编译输出包含 CommonJS 代码

**症状：**
```javascript
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
```

**原因：** package.json 缺少 `"type": "module"` 或设置为 `"type": "commonjs"`

**解决：** 确保 package.json 中有且只有一个 `"type": "module"`

---

### 问题 2：const 变成了 var

**症状：**
```javascript
var message = "Hello";
```

**可能原因 1：** target 设置为 es3 或 es5

**解决：** 设置 `"target": "esnext"` 或 `"target": "es6"`

**可能原因 2：** 使用了 `npx tsc 文件名` 的方式编译

**解决：** 使用 `npx tsc`（不带文件名）

---

### 问题 3：tsconfig.json 配置被忽略

**症状：** 编译结果与配置不符，输出文件位置不对

**原因：** 使用了 `npx tsc 文件名` 的方式编译

**解决：** 使用 `npx tsc`（不带文件名）

---

### 问题 4：编译了所有 .ts 文件

**症状：** 目录下所有 .ts 文件都被编译

**原因：** tsconfig.json 没有配置 `include`

**解决：** 添加 `"include": ["src/**/*.ts"]`

---

### 问题 5：找不到 tsc 命令

**症状：**
```
'tsc' is not recognized as an internal or external command
```

**原因：** TypeScript 没有安装或使用方式不对

**解决：**
1. 确认已安装：`npm install typescript --save-dev`
2. 使用 npx：`npx tsc`

---

### 问题 6：运行时报 ES Module 错误

**症状：**
```
SyntaxError: Cannot use import statement outside a module
```

**原因：** package.json 缺少 `"type": "module"`

**解决：** 在 package.json 中添加 `"type": "module"`

---

## 第十部分：快速命令参考

### 初始化项目（按顺序执行）

```bash
# 1. 创建并进入项目目录
mkdir my-first-typescript && cd my-first-typescript

# 2. 初始化 npm 项目
npm init -y

# 3. 安装 TypeScript
npm install typescript --save-dev

# 4. 初始化 TypeScript 配置
npx tsc --init

# 5. 创建源代码目录
mkdir src
```

### 日常开发命令

| 命令 | 作用 |
|------|------|
| `npx tsc` | 编译项目 |
| `npx tsc --watch` | 监听文件变化，自动编译 |
| `npm run build` | 编译项目（使用脚本） |
| `npm start` | 运行程序 |
| `npm run dev` | 编译并运行 |

---

## 第十一部分：下一步学习建议

### 基础类型

```typescript
// 字符串
const name: string = "Alice";

// 数字
const age: number = 25;

// 布尔值
const isStudent: boolean = true;

// 数组
const scores: number[] = [90, 85, 92];

// 对象
const person: { name: string; age: number } = {
  name: "Bob",
  age: 30
};
```

### 接口（Interface）

```typescript
interface Person {
  name: string;
  age: number;
  email?: string;  // 可选属性
}

const user: Person = {
  name: "Charlie",
  age: 28
};
```

### 类型别名（Type Alias）

```typescript
type ID = string | number;

const userId: ID = "abc123";
const productId: ID = 12345;
```

### 函数类型

```typescript
function greet(name: string): string {
  return `Hello, ${name}!`;
}

const add = (a: number, b: number): number => {
  return a + b;
};
```

### 推荐学习路径

1. **基础类型**：string, number, boolean, array, object
2. **接口（Interface）**：定义对象的结构
3. **类型别名（Type Alias）**：创建自定义类型
4. **联合类型与交叉类型**：组合多种类型
5. **泛型（Generics）**：创建可复用的类型安全代码
6. **类与继承**：面向对象编程
7. **模块系统**：import/export 的使用
8. **高级类型**：条件类型、映射类型等

---

## 总结

恭喜你完成了 TypeScript Hello World 教程！

**关键要点回顾：**

| 要点 | 内容 |
|------|------|
| TypeScript 是什么 | JavaScript 的超集，添加了类型系统 |
| 核心文件 | package.json（项目配置）+ tsconfig.json（TS配置） |
| 编译命令 | 始终使用 `npx tsc`，不要指定文件名 |
| 模块系统 | 推荐使用 ES Module（`"type": "module"`） |
| 项目结构 | 源码放 src/，产物放 dist/ |

**记住最重要的一点：**

> **永远使用 `npx tsc` 编译，让 tsconfig.json 来管理所有配置。**
