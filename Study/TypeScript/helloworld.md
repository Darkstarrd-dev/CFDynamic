# TypeScript 入门总结

## 什么是 TypeScript

TypeScript = JavaScript + 静态类型检查

类型检查**只在开发阶段**，编译后变成普通 JavaScript。

---

## 环境搭建

```bash
# 安装
npm install -g typescript

# 编译运行
tsc index.ts
node index.js

# 或直接运行（需 Node 22+）
tsx index.ts
```

---

## 基础语法

### 变量类型

```typescript
let name: string = "Tom";
let age: number = 25;
let isStudent: boolean = true;
let data: any = "anything";    // 任意类型
```

### 数组

```typescript
let nums: number[] = [1, 2, 3];
let names: string[] = ["a", "b"];
```

### 函数

```typescript
function add(a: number, b: number): number {
    return a + b;
}
```

### 接口（定义对象结构）

```typescript
interface User {
    name: string;
    age: number;
    email?: string;  // 可选属性
}

let user: User = { name: "Tom", age: 25 };
```

### 类型别名

```typescript
type Status = 'pending' | 'paid' | 'shipped';
let orderStatus: Status = 'pending';
```

---

## 类型检查示例

```typescript
function greet(name: string): string {
    return "hello " + name;
}

greet("Tom");   // ✅ 正确
greet(123);     // ❌ 编译报错
```

---

## 编译前后对比

**TypeScript:**
```typescript
function greet(name: string): string {
    return "hello " + name;
}
```

**编译后 JavaScript:**
```javascript
function greet(name) {
    return "hello " + name;
}
```

类型注解全部消失。

---

## 核心要点

- 类型是**开发辅助**，不是运行时必须
- 帮助发现错误、提供智能提示、代码即文档
- 最终产物是普通 JavaScript
