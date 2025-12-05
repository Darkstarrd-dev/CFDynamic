# Hitomi.la 下载功能技术规范文档

> 本文档既是人类可读的流程说明，也是可直接用于生成下载脚本的技术规范。

---

## 1. 概述

当用户访问 Hitomi.la 的画廊页面时，页面会加载图片元数据（不是图片本身）。点击下载按钮后，脚本根据元数据中的 `hash` 值，通过特定算法计算出每张图片的真实CDN地址，然后以每秒不超过1张的速度下载，最终打包为ZIP文件。

**核心流程：**
```
页面加载 → 获取元数据 → 计算图片URL → 节流下载 → 打包ZIP → 保存文件
```

---

## 2. 数据来源

页面加载完成后，以下**全局变量**可直接访问：

| 变量名 | 类型 | 说明 |
|--------|------|------|
| `galleryid` | String | 画廊唯一ID，如 `"3669332"` |
| `galleryinfo` | Object | 画廊完整信息，包含标题和文件列表 |
| `gg` | Object | CDN配置对象，包含 `gg.b`、`gg.m()`、`gg.s()` |

**获取方式（油猴脚本）：**
```javascript
// 直接访问页面全局变量
const id = window.galleryid;
const info = window.galleryinfo;
const ggConfig = window.gg;
```

---

## 3. 数据结构定义

### 3.1 galleryinfo 结构

```typescript
interface GalleryInfo {
  title: string;              // 英文标题
  japanese_title?: string;    // 日文标题（可选，优先用于文件名）
  files: ImageFile[];         // 图片列表
}

interface ImageFile {
  name: string;      // 原始文件名，如 "001.jpg"
  hash: string;      // 64位十六进制哈希，如 "61ba4f...c5d69f2"
  width: number;     // 图片宽度
  height: number;    // 图片高度
  hasavif?: number;  // 是否有AVIF格式 (1=有)
  haswebp?: number;  // 是否有WebP格式 (1=有)
}
```

### 3.2 gg 配置对象结构

```typescript
interface GGConfig {
  b: string;              // 基础路径前缀，如 "1764889202/"
  s: (hash: string) => string;  // hash转目录数字
  m: (g: number) => number;     // 负载均衡，返回0或1
}
```

**注意：** `gg.b` 和 `gg.m()` 的内容会**定期变化**，必须从页面实时获取或从 `gg.js` 文件解析。

---

## 4. URL构建算法

### 4.1 算法流程图

```
输入: hash, format(webp/avif)
         │
         ▼
┌─────────────────────────────┐
│ Step 1: 计算目录数字         │
│ dir_num = gg.s(hash)        │
└─────────────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ Step 2: 构建完整路径         │
│ path = gg.b + dir_num + "/" │
│        + hash               │
└─────────────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ Step 3: 计算CDN子域名        │
│ subdomain = prefix +        │
│   (1 + gg.m(g))            │
└─────────────────────────────┘
         │
         ▼
输出: https://{subdomain}.gold-usergeneratedcontent.net/{path}.{format}
```

### 4.2 算法伪代码（可直接转换为代码）

```javascript
/**
 * 主函数：根据图片信息生成下载URL
 * @param {string} hash - 64位十六进制哈希
 * @param {string} format - 格式: "webp" 或 "avif"
 * @param {object} gg - 页面的gg配置对象
 * @returns {string} 完整的图片URL
 */
function buildImageUrl(hash, format, gg) {
  const DOMAIN = "gold-usergeneratedcontent.net";
  
  // Step 1: 计算目录数字
  const dirNum = gg.s(hash);
  
  // Step 2: 构建路径
  const fullPath = gg.b + dirNum + "/" + hash;
  
  // Step 3: 计算子域名
  const subdomain = calcSubdomain(hash, format, gg);
  
  // Step 4: 组装最终URL
  return `https://${subdomain}.${DOMAIN}/${fullPath}.${format}`;
}

/**
 * 计算CDN子域名
 */
function calcSubdomain(hash, format, gg) {
  // 格式前缀: webp→"w", avif→"a"
  const prefix = format === "webp" ? "w" : "a";
  
  // 从hash计算负载均衡数字
  // hash是64位，取最后3位字符
  const match = hash.match(/(..)(.)$/);
  const g = parseInt(match[2] + match[1], 16);
  
  // 服务器编号 = 1 + gg.m(g)，结果为 1 或 2
  const serverNum = 1 + gg.m(g);
  
  return prefix + serverNum;  // 如 "w1" 或 "w2"
}
```

### 4.3 gg.s() 函数实现

```javascript
// gg.s 的完整实现
function gg_s(hash) {
  // 提取hash最后3个字符，重新排列后转为10进制
  const match = hash.match(/(..)(.)$/);
  // match[1] = 倒数第2-3位, match[2] = 最后1位
  return parseInt(match[2] + match[1], 16).toString(10);
}

// 示例：
// hash = "...abc9f2"
// match[1] = "9f", match[2] = "2"
// 结果 = parseInt("29f", 16).toString(10) = "671"
```

### 4.4 完整示例

```
输入:
  hash = "61ba4fcf5c1df1c4d2e3a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d69f2"
  format = "webp"
  gg.b = "1764889202/"

计算过程:
  1. dirNum = gg.s(hash)
     - hash末尾3位: "9f2"
     - parseInt("2" + "9f", 16) = 671
     - dirNum = "671"
  
  2. fullPath = "1764889202/" + "671/" + hash
     = "1764889202/671/61ba4fc...9f2"
  
  3. subdomain:
     - prefix = "w" (webp格式)
     - g = parseInt("29f", 16) = 671
     - gg.m(671) = 1 (假设不在case列表中)
     - serverNum = 1 + 1 = 2
     - subdomain = "w2"

输出:
  https://w2.gold-usergeneratedcontent.net/1764889202/671/61ba4fc...9f2.webp
```

---

## 5. gg.js 动态配置

### 5.1 配置文件位置

```
https://ltn.gold-usergeneratedcontent.net/gg.js
```

### 5.2 配置内容结构

```javascript
// gg.js 文件内容示例
var gg = {
  // 基础路径（会定期变化）
  b: '1764889202/',
  
  // hash转目录数字
  s: function(h) {
    var m = /(..)(.)$/.exec(h);
    return parseInt(m[2]+m[1], 16).toString(10);
  },
  
  // 负载均衡（case列表会变化）
  m: function(g) {
    var o = 1;
    switch(g) {
      case 863:
      case 1057:
      // ... 数百个case
      case 750:
        o = 0; break;
    }
    return o;
  }
}
```

### 5.3 获取方式

**方式A - 页面上下文（推荐）：**
```javascript
// 油猴脚本直接使用页面的gg对象
const gg = window.gg;
```

**方式B - 动态获取并解析：**
```javascript
async function fetchGGConfig() {
  const response = await fetch("https://ltn.gold-usergeneratedcontent.net/gg.js");
  const text = await response.text();
  // 使用eval或正则解析（注意安全性）
  eval(text);
  return gg;
}
```

---

## 6. 下载流程

### 6.1 节流控制

```javascript
const THROTTLE_MS = 1000;  // 每次下载间隔1秒
let lastDownloadTime = 0;

async function throttledDownload(url) {
  const now = Date.now();
  const waitTime = Math.max(0, lastDownloadTime + THROTTLE_MS - now);
  
  if (waitTime > 0) {
    await sleep(waitTime);
  }
  
  lastDownloadTime = Date.now();
  return fetch(url).then(r => r.arrayBuffer());
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

### 6.2 下载与打包流程

```javascript
async function downloadGallery(galleryinfo, gg) {
  const zip = new JSZip();
  const files = galleryinfo.files;
  const title = galleryinfo.japanese_title || galleryinfo.title;
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    // 1. 构建URL
    const url = buildImageUrl(file.hash, "webp", gg);
    
    // 2. 节流下载
    const data = await throttledDownload(url);
    
    // 3. 添加到ZIP
    const filename = file.name.replace(/\.[^.]+$/, ".webp");
    zip.file(filename, data);
    
    // 4. 更新进度
    console.log(`下载进度: ${i + 1}/${files.length}`);
  }
  
  // 5. 生成并保存ZIP
  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `${title}.zip`);
}
```

### 6.3 重试机制

```javascript
async function fetchWithRetry(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return response.arrayBuffer();
      }
    } catch (error) {
      console.warn(`尝试 ${i + 1}/${maxRetries} 失败:`, error);
    }
    
    if (i < maxRetries - 1) {
      await sleep(1000 * (i + 1));  // 递增等待时间
    }
  }
  throw new Error(`下载失败: ${url}`);
}
```

---

## 7. 脚本实现要点

### 7.1 依赖库

| 库 | 用途 | CDN |
|----|------|-----|
| JSZip | 创建ZIP文件 | `https://cdn.jsdelivr.net/npm/jszip@3/dist/jszip.min.js` |
| FileSaver | 保存文件 | `https://cdn.jsdelivr.net/npm/file-saver@2/dist/FileSaver.min.js` |

### 7.2 油猴脚本头部模板

```javascript
// ==UserScript==
// @name         Hitomi Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  优化的Hitomi下载脚本
// @match        https://hitomi.la/*
// @require      https://cdn.jsdelivr.net/npm/jszip@3/dist/jszip.min.js
// @require      https://cdn.jsdelivr.net/npm/file-saver@2/dist/FileSaver.min.js
// @grant        none
// ==/UserScript==
```

### 7.3 关键实现检查清单

- [ ] 获取页面 `galleryid`、`galleryinfo`、`gg` 对象
- [ ] 实现 `buildImageUrl()` 函数
- [ ] 实现节流下载（间隔 ≥ 1秒）
- [ ] 实现重试机制（建议3次）
- [ ] 使用 JSZip 打包
- [ ] 使用 FileSaver 保存
- [ ] 显示下载进度
- [ ] 处理错误情况

---

## 8. 快速参考卡片

```
┌────────────────────────────────────────────────────────────────┐
│                    Hitomi 下载 URL 构建公式                      │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  URL = https://{subdomain}.gold-usergeneratedcontent.net/      │
│        {gg.b}{gg.s(hash)}/{hash}.{format}                      │
│                                                                │
│  其中:                                                          │
│  - subdomain = ("w"|"a") + (1 + gg.m(g))                       │
│  - g = parseInt(hash[63] + hash[61..62], 16)                   │
│  - gg.s(hash) = parseInt(hash[63] + hash[61..62], 16)         │
│                 .toString(10)                                   │
│                                                                │
│  示例:                                                          │
│  hash末尾 "9f2" → g=671 → gg.s="671" → subdomain="w2"          │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

此文档可作为开发下载脚本的完整技术规范。如需生成实际脚本，只需按照上述结构实现各个函数即可。