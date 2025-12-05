# 默认话题

## 🧑‍💻 User

不需要了，这里有几个问题需要问的。
第一，获取的链接为什么直接打开会显示404？
但是通过fech获取返回码是200。

第二，像这种网页加载之后，直接输入它的类名，就可以获取它对应的里面的数据是吗？

---
## 🤖 Assistant

这两个问题都很好！让我来解答：

## 问题一：为什么链接直接打开显示 404，但 fetch 返回 200？

这是**防盗链（Referer 检查）**机制。

### 原理

当你用不同方式请求图片时，请求头中的 `Referer` 字段不同：

| 方式 | Referer | 结果 |
|------|---------|------|
| 在 hitomi.la 页面的控制台执行 fetch | `https://hitomi.la/...` | ✅ 200 |
| 直接在地址栏打开 | 无 Referer 或来自空白页 | ❌ 404 |
| 从其他网站链接过去 | 其他网站的地址 | ❌ 404 |

### 验证方法

在控制台试试这个：

```javascript
// 模拟"无 Referer"的请求
fetch(finalUrl, {
  referrerPolicy: "no-referrer"
}).then(r => console.log("无Referer时的状态码:", r.status));
```

你应该会看到返回 403 或 404。

### 如何正常查看图片？

在 hitomi.la 页面的控制台里执行：

```javascript
// 在当前页面创建一个img元素来显示图片
let img = document.createElement('img');
img.src = finalUrl;
img.style.maxWidth = '500px';
document.body.prepend(img);
```

因为 `<img>` 标签的请求会自动带上当前页面作为 Referer。

---

## 问题二：直接输入类名就能获取数据？

不完全是这样，这取决于**变量是否被定义在全局作用域**。

### 这个网站的情况

Hitomi.la 的开发者**故意**把这些变量定义在了全局作用域（`window` 对象上）：

```javascript
// 网站的代码大概是这样写的
var galleryid = "3669332";
var galleryinfo = { title: "...", files: [...] };
var gg = { b: "...", s: function(){...}, m: function(){...} };
```

用 `var` 在最外层定义的变量会自动成为 `window` 的属性。

### 验证

```javascript
// 这两种写法是等价的
console.log(galleryid);
console.log(window.galleryid);

// 检查是否真的是 window 的属性
console.log(window.hasOwnProperty('galleryinfo'));  // true
```

### 大多数网站不是这样

现代网站通常会用模块化开发，变量被封装在闭包或模块内部，你无法直接访问：

```javascript
// 现代写法 - 外部无法访问
(function() {
  const secretData = { ... };
  // 只在这个函数内部可用
})();

// 或者 ES6 模块
// 每个模块有自己的作用域
```

### 怎么找到隐藏的数据？

如果变量没有暴露在全局，你可以：

1. **看 Network 面板** - 找 API 请求，数据通常从服务器返回
2. **打断点调试** - 在 Sources 面板设置断点，查看局部变量
3. **搜索源代码** - 用 `Ctrl+Shift+F` 全局搜索关键词

---

### 总结

| 问题 | 原因 |
|------|------|
| 直接打开链接 404 | 服务器检查 Referer 防盗链 |
| 能直接访问 galleryinfo | 这个网站故意把数据放在全局变量里 |

这个网站对爬虫/下载器比较"友好"，把数据都暴露出来了。很多其他网站会做更多保护。

---
## 🧑‍💻 User

那像这种直接打开链接404的情况下，我如果想通过curl之类的方式，在命令行下下载，应该如何处理？

---
## 🤖 Assistant

很简单，手动指定 `Referer` 请求头即可。

## curl 下载方法

```bash
curl -H "Referer: https://hitomi.la/" -o image.webp "图片URL"
```

### 完整示例

```bash
curl -H "Referer: https://hitomi.la/" \
     -o test.webp \
     "https://w2.gold-usergeneratedcontent.net/1764889202/671/xxxxx.webp"
```

### 参数说明

| 参数 | 作用 |
|------|------|
| `-H "Referer: https://hitomi.la/"` | 设置请求头，伪装成从 hitomi.la 页面发起的请求 |
| `-o filename` | 指定输出文件名 |

## wget 下载方法

```bash
wget --referer="https://hitomi.la/" -O image.webp "图片URL"
```

## 验证是否有效

你可以先在控制台获取一个真实的 URL：

```javascript
// 在 hitomi.la 页面的控制台执行
console.log(buildImageUrl(galleryinfo.files[0].hash));
```

然后复制这个 URL 到命令行测试。

## 批量下载脚本示例

如果你想批量下载，可以先在控制台导出所有 URL：

```javascript
// 在控制台生成所有URL并复制
let urls = galleryinfo.files.map((f, i) => {
  let url = buildImageUrl(f.hash);
  let filename = String(i + 1).padStart(3, '0') + '.webp';
  return `curl -H "Referer: https://hitomi.la/" -o "${filename}" "${url}"`;
});

console.log(urls.join('\n'));
```

然后把输出的内容保存成 `.sh` 脚本运行，或者逐条执行。

---
## 🧑‍💻 User

也就是说，其实按这个网站的这种设计，它基本上没有什么反扒机制，很轻易的就可以通过脚本来批量获取他的数据。

---
## 🤖 Assistant

是的，你的理解完全正确。

## 这个网站的"防护"现状

| 方面 | 实际情况 |
|------|----------|
| 数据暴露 | `galleryinfo`、`gg` 等全部放在全局变量 |
| 防盗链 | 只检查 Referer，随便伪造 |
| 速率限制 | 基本没有，1秒1张只是"礼貌性"建议 |
| 验证码 | 无 |
| 登录要求 | 无 |
| URL 混淆 | 算法完全公开在 `gg.js` 里 |

## 对比真正有防护的网站

```
严格防护的网站会这样做：

1. 数据加密
   - API 返回加密数据，前端解密
   - 解密逻辑混淆在 JS 里

2. 请求签名
   - 每个请求需要带 token/sign
   - 签名算法隐藏在混淆的 JS 中

3. 行为检测
   - 检测鼠标移动、点击模式
   - 检测是否在真实浏览器环境

4. 速率限制
   - 请求过快直接封 IP
   - 需要解验证码

5. 动态渲染
   - 数据不在源码里
   - 需要执行 JS 才能拿到
```

## 为什么这个网站不做防护？

可能的原因：

1. **成本考虑** - 防护机制开发维护成本高
2. **用户体验** - 严格防护会影响正常用户
3. **内容性质** - 本身就是分享性质的站点
4. **猫鼠游戏** - 防了也会被破解，干脆不防

## 结论

这个网站几乎是"开放"状态，写个下载脚本的难度很低。你现在已经掌握了核心原理，完全可以自己写一个完整的下载工具。

---
## 🧑‍💻 User

我想再重头来进行一次练习
假如这一次我并不知道他的这些定义的idea这些东西。我打开这个网站，我现在能看得到的，只有上面显示的图片，以及通过这个F12控制台来看它每一个元素对应的内容。从这里开始，我应该如何一步一步的往下进行。

---
## 🤖 Assistant

好的，我们从零开始，假装什么都不知道。

## 第一步：观察页面

你打开了一个图片浏览页面，看到很多图片。

**现在你的目标是：** 下载这些图片。

---

## 第二步：最直接的尝试

在任意一张图片上右键 → 复制图片地址 → 新标签页打开

**结果：** 404 或 403

这说明图片有某种保护机制。

---

## 第三步：打开 F12 开发者工具

现在你有几个方向可以探索：

### 方向 A：Elements 面板
查看图片的 HTML 结构，找 `<img>` 标签的 `src` 属性

### 方向 B：Network 面板
刷新页面，看实际加载了哪些资源

### 方向 C：Sources 面板
看网站加载了哪些 JS 文件

---

**你想先从哪个方向开始？** 告诉我，我会引导你下一步。

（这样一步步来，你会更清楚整个分析思路是怎么形成的）

---
## 🧑‍💻 User

在第二步，新标签页打开的话打开的只是一个预览的缩略图 比需要点击进入到画栏内
此时是大图，但是此时右键的话，在新标签也打开的功能不生效。
而且下载下来的是.PNG的图。
并不是之前按照脚本从计算出来的网址获取的webP的图片。

---
## 🤖 Assistant

很好的观察！这说明你已经发现了几个关键线索。

## 当前发现总结

| 操作 | 结果 |
|------|------|
| 缩略图右键 | 只是小图，不是原图 |
| 进入画廊大图 | 右键无法"在新标签页打开" |
| 直接下载 | 得到 PNG，不是 WebP |

这些现象本身就是重要信息。

---

## 第三步：分析大图页面

你现在在大图浏览页面，右键行为异常。

**问几个问题：**

1. 右键是完全没反应，还是弹出菜单但没有"在新标签页打开图片"选项？

2. 你下载得到的 PNG 文件，大小大概多少？和你预期的原图相比如何？

3. 在大图页面按 F12，切到 Elements 面板，找到显示图片的那个元素，它是 `<img>` 标签还是其他东西（比如 `<canvas>` 或 `<div>` 背景图）？

---

先回答这几个问题，我们根据你观察到的现象继续分析。

---
## 🧑‍💻 User

就是在新标签页打开，选项是灰色的，不可选。 复制图片地址不可选
但是这里很奇怪的是，图片另存为以及复制图片选项可选。
这样的话不是就没有意义了吗？
下载得到的PNG文件应该就是没有经过压缩的，大小比起webp大了大几十倍。
下载的时候提供webP，我感觉是某种为了节省资源的一个做法。
但是在画廊里提供原图，感觉也是挺没有意义的。

图片的元素是img的标签 通过一个<picture></picture>的标签来包裹
顺便也为我讲解一下这个标签，我还没有见过picture的这个标签，这个是原生的一个定义吗？

---
## 🤖 Assistant

非常好的观察和思考！

## 关于 `<picture>` 标签

是的，这是原生 HTML5 标签。它的作用是**响应式图片**，让浏览器根据条件选择最合适的图片源。

```html
<picture>
  <source srcset="image.webp" type="image/webp">
  <source srcset="image.png" type="image/png">
  <img src="image.png" alt="fallback">
</picture>
```

### 工作原理

浏览器从上往下检查 `<source>` 标签：
- 如果支持 WebP → 加载 WebP
- 如果不支持 → 继续往下找
- 都不行 → 用最后的 `<img>` 作为兜底

---

## 你的发现解释了很多

现在我们知道为什么：

| 现象 | 原因 |
|------|------|
| 右键"在新标签页打开"灰色 | `<picture>` 内的图片，浏览器右键行为不同于普通 `<img>` |
| 下载得到 PNG | 浏览器"另存为"选择了兜底格式 |
| WebP 更小 | 你说得对，就是为了节省带宽 |

---

## 下一步分析

现在请在 F12 的 Elements 面板里，展开这个 `<picture>` 标签，看看里面具体结构：

1. 有几个 `<source>` 标签？
2. 每个 `<source>` 的 `srcset` 属性值是什么？
3. 最后的 `<img>` 的 `src` 是什么？

把你看到的结构贴上来，我们分析一下它到底是怎么组织不同格式图片的。

---
## 🧑‍💻 User

<picture><source srcset="data:image/png;base64,......" type="image/avif"><img class="lillie" src="https://w1.gold-usergeneratedcontent.net/1764900002/997/b7f512f4972ff22819bb72bbc2cf38daf556b80371a7e92548e034013513ce53.webp" style="cursor: none;"></picture>
它是这么一个形式，PNG是作为一个编码，直接内容完全写在这个网页当中的。也就是有没有可能它这个PNG并不是原生的PNG，而是通过底下的这个实际的webP的文件来转换以后放在这个网页当中。

---
## 🤖 Assistant

太精彩了！你的推理完全正确！

## 你发现了什么

```html
<picture>
  <source srcset="data:image/png;base64,..." type="image/avif">
  <img src="https://...webp">
</picture>
```

这个结构很奇怪：

| 标签 | 内容 | 疑点 |
|------|------|------|
| `<source>` | Base64 编码的 PNG | 声称是 AVIF 格式，但实际是 PNG？ |
| `<img>` | 真正的 WebP URL | 这才是实际图片来源 |

---

## 你的推测验证

没错！这个 PNG 很可能是：

1. 浏览器先加载 WebP
2. JavaScript 将 WebP 转换成 PNG
3. 编码成 Base64 嵌入页面

**目的是什么？** 就是阻止你直接右键获取原始 URL。

因为右键"另存为"时，浏览器保存的是已经在内存中解码的图片数据（那个 Base64 PNG），而不是原始文件。

---

## 但是你已经看到了真正的 URL

就是 `<img>` 标签的 `src`：

```
https://w1.gold-usergeneratedcontent.net/1764900002/997/b7f512f4972ff22819bb72bbc2cf38daf556b80371a7e92548e034013513ce53.webp
```

**问题：** 这个 URL 能直接访问吗？还是会 403/404？

试试在新标签页直接打开这个链接，告诉我结果。

---
## 🧑‍💻 User

是无法打开的，会返回404
另外，之之所以无法在新标签页中打开，以及无法复制图片链接，就是因为在作为一个直接加载的b64的这个图片信息，它此时是等于是一种处于一种保存在内存里。然后它的地址是一个虚拟地址的这么一个状态，所以才没有办法新标签打开，也没有办法复制连接，这么理解，对吗？

---
## 🤖 Assistant

完全正确！你的理解非常准确。

## 总结一下

```
右键行为          指向的是什么
─────────────────────────────────
在新标签页打开    ❌ 灰色，因为 Base64 没有 URL
复制图片地址      ❌ 灰色，同上
图片另存为        ✅ 保存内存中解码后的 PNG
复制图片          ✅ 复制内存中的位图数据
```

Base64 数据就像是：
- 不是"网上的一个文件"
- 而是"直接写在 HTML 里的一堆字符"
- 浏览器解码后放在内存里显示
- 没有真正的网络地址可言

---

## 那么真正的 WebP 地址为什么 404？

`<img src="https://...webp">` 这个链接返回 404，可能的原因：

1. **需要特定的请求头**（Referer、Cookie 等）
2. **URL 有时效性**，过期了
3. **服务器检测到直接访问就拒绝**

---

## 继续分析

你之前说的"计算出来的网址获取的 WebP 图片"是可以下载的对吧？

那个能用的 URL 和这个 404 的 URL，结构上有什么区别吗？可以对比贴出来看看。

---
## 🧑‍💻 User

能用的UL感觉应该是通过它的这个服务器来进行的一种解读。它并不是一个实际的网址。
https://hitomi.la/reader/3669380.html#5 这个是通过网站打开显示这一张图片的网址。
截图的是实际的网址，可以看到它上面是他实际的地址，然后底下有一个当前的地址，而当前的地址就是一个base64的这么一个形式。

---
## 🤖 Assistant

非常清晰的截图！现在真相大白了。

## 截图揭示的关键信息

| 属性 | 值 |
|------|------|
| img src (HTML里的) | `https://w2.gold-usergeneratedcontent.net/1764900002/1557/8b891f78bb3c84dac1a8945caec64d33f908443813ecf2874a4e64...` |
| Intrinsic size | 1280 × 1808 px（原始尺寸）|
| File size | **2.1 MB** |
| Current source | `data:image/png;base64,...`（Base64）|

---

## 现在逻辑完全清楚了

```
流程：
1. HTML 里写着真实的 WebP URL（img src）
2. 浏览器请求这个 URL，下载 WebP 文件
3. JavaScript 拦截，把 WebP 转成 PNG
4. 转换后的 PNG 编码成 Base64
5. 替换成 Current source 显示

结果：
- 你看到的是 Base64 PNG（2.1MB，很大）
- 真实 URL 直接访问返回 404（需要特殊条件）
- 右键只能保存已转换的 PNG
```

---

## 但是...

你之前用脚本计算出来的 URL 可以直接下载 WebP 对吧？

那个脚本计算出的 URL 和截图里 `img src` 的这个 URL，格式一样吗？

我猜脚本是根据某种规则**重新构造**了一个可用的 URL，绕过了防护。能把脚本计算 URL 的那部分逻辑贴出来吗？

---
## 🧑‍💻 User

我猜测这里这个重新构造的就是用之前你跟我讲解过的那个模式，根据它画廊的1个ID然后它有一个哈希值，根据这个哈希值重新计算出它的这个对应的路径的这么一个做法。我把单独的这个花廊每页的网页内容也贴给你看一下。我把其中base64这部分的移除了。先帮我解析一下，然后再为我进行讲解。

---
## 🤖 Assistant

非常好！这个 HTML 文件揭示了很多关键信息。让我来解析：

---

## 1. 页面结构

```
Gallery ID: 3669380
标题: Inaka de! Boshi Kōbi | In the Countryside! Mother-Son Mating【Chinese】
总页数: 16 页
```

---

## 2. 关键脚本文件

```html
<script src="//ltn.gold-usergeneratedcontent.net/common.js"></script>
<script src="//ltn.gold-usergeneratedcontent.net/gg.js"></script>        <!-- 核心！-->
<script src="//ltn.gold-usergeneratedcontent.net/reader.js"></script>
...
<script src="//ltn.gold-usergeneratedcontent.net/decode_webp.js"></script> <!-- 转换用 -->
```

**`gg.js`** - 这个就是计算图片服务器路径的核心脚本！
**`decode_webp.js`** - 这个负责把 WebP 转成 Base64 PNG

---

## 3. 图片元素分析

```html
<div id="comicImages">
    <picture>
        <source srcset="" type="image/avif" />  <!-- 空的，可能是备用 -->
        <img class="lillie"
             src="https://w2.gold-usergeneratedcontent.net/1764900002/1557/8b891f78bb3c84dac1a8945caec64d33f908443813ecf2874a4e6479263e4156.webp"
        />
    </picture>
</div>

<div id="preload">  <!-- 预加载下一张 -->
    <picture>
        <source srcset="" type="image/avif" />
        <img class="lillie"
             src="https://w2.gold-usergeneratedcontent.net/1764900002/211/7e7b84a2b328d5847aefe070875a04878ddfe631d2ab21a73eb6a39436cb3d30.webp"
        />
    </picture>
</div>
```

---

## 4. URL 结构解析

```
https://w2.gold-usergeneratedcontent.net/1764900002/1557/8b891f78bb3c84dac1a8945caec64d33f908443813ecf2874a4e6479263e4156.webp
       │                                 │          │    │
       │                                 │          │    └── 图片的 hash 值
       │                                 │          └── 通过 gg.js 计算出的子目录
       │                                 └── 某种 ID（可能是时间戳或分区）
       └── 服务器编号 (w2)
```

---

## 5. 防护机制总结

| 层级 | 方法 | 作用 |
|------|------|------|
| 1 | `decode_webp.js` | 把 WebP 转成 Base64 PNG 嵌入页面 |
| 2 | `cursor: none` | 隐藏鼠标，干扰操作 |
| 3 | `class="lillie"` | 配合广告脚本，点击触发弹窗 |
| 4 | 动态子目录 | `/1557/` 这个路径是 `gg.js` 计算出来的 |

---

## 6. 核心问题

你说直接访问这个 URL 返回 404，但脚本计算的可以用。

我猜测 **`gg.js`** 里面有一个函数，根据：
- 图片的 hash
- 当前时间或某个变量
- Gallery ID

计算出正确的子目录（如 `/1557/`）和服务器编号（如 `w2`）。

---

## 下一步

要不要我用浏览器工具去抓取 `gg.js` 的内容？那里面应该有计算 URL 的核心逻辑。



太棒了！找到了核心代码！让我解析这个 `gg.js`：

---

## gg.js 核心结构

```javascript
'use strict';
gg = {
    // 函数 m: 根据数字决定返回 0 还是 1
    m: function(g) {
        var o = 1;  // 默认返回 1
        switch (g) {
            case 422:
            case 1747:
            case 3446:
            // ... 很长的列表 ...
            case 1871:
                o = 0;  // 这些特定值返回 0
                break;
        }
        return o;
    },
    
    // 函数 s: 从 hash 提取并转换子目录
    s: function(h) {
        var m = /(..)(.)$/.exec(h);  // 取 hash 最后3位
        return parseInt(m[2] + m[1], 16).toString(10);
        // 例: hash 末尾是 "156" → 取 "15" 和 "6" → "615" → 十六进制转十进制
    },
    
    // 基础路径
    b: '1764900002/'
};
```

---

## 工作原理解析

### 1. `gg.b` - 基础路径
```
'1764900002/'
```
这是当前的基础ID，所有图片 URL 都以此开头。

### 2. `gg.s(hash)` - 计算子目录

```javascript
s: function(h) {
    var m = /(..)(.)$/.exec(h);  // 正则: 取最后3个字符
    return parseInt(m[2] + m[1], 16).toString(10);
}
```

**举例**：
```
hash = "8b891f78bb3c84dac1a8945caec64d33f908443813ecf2874a4e6479263e4156"
                                                                      ^^^
最后3位: "156"
m[1] = "15", m[2] = "6"
拼接: "6" + "15" = "615"
十六进制转十进制: parseInt("615", 16) = 1557
```

**这就是为什么 URL 里有 `/1557/`！**

### 3. `gg.m(g)` - 决定服务器

这个函数根据 `gg.s()` 的结果决定用哪个服务器：
- 返回 `0` → 使用某个服务器（可能是 `w1`）
- 返回 `1` → 使用另一个服务器（可能是 `w2`）

---

## 完整 URL 构造流程

```
1. 获取图片 hash: "8b891f78bb...4156"
2. 计算子目录: gg.s(hash) → 1557
3. 决定服务器: gg.m(1557) → 查表得到 0 或 1
4. 组合 URL:
   https://w{服务器号}.gold-usergeneratedcontent.net/{gg.b}{子目录}/{hash}.webp
   https://w2.gold-usergeneratedcontent.net/1764900002/1557/8b891...4156.webp
```

---

## 关键发现

| 组件 | 来源 | 示例值 |
|------|------|--------|
| 服务器 | `gg.m()` 返回值决定 | `w2` |
| 基础ID | `gg.b` | `1764900002` |
| 子目录 | `gg.s(hash)` 计算 | `1557` |
| 文件名 | 图片原始 hash | `8b891f78...4156.webp` |

这就是为什么直接复制的 URL 会 404 —— 因为 **子目录是动态计算的**，而且 `gg.js` 会定期更新！

---
## 🧑‍💻 User

它里面的这个用于把图片解码为base64的这个函数，纯粹是作为一种防护措施吗？现代网页应该是可以直接加载webP的。
另外这个GG.JS里面一大堆的这个case，像这种样的机制常见吗？

---
## 🤖 Assistant

你问了两个非常好的问题！

---

## 问题一：decode_webp.js 纯粹是防护措施吗？

**基本上是的**，但可能还有一点历史原因：

### 现代浏览器 WebP 支持情况

| 浏览器 | WebP 支持 |
|--------|----------|
| Chrome | ✅ 2014年起 |
| Firefox | ✅ 2019年起 |
| Safari | ✅ 2020年起 (iOS 14/macOS Big Sur) |
| Edge | ✅ 支持 |

**2020年之后，主流浏览器都支持 WebP 了**，所以现在完全没必要转换。

### 那为什么还要转成 Base64 PNG？

```
目的                        效果
─────────────────────────────────────────
1. 防止右键保存             ✅ 右键只能保存已转换的 PNG
2. 防止复制图片链接         ✅ 没有真实 URL 可复制
3. 防止直接访问原图         ✅ 原图 URL 被隐藏
4. 增加爬虫难度             ✅ 需要执行 JS 才能看到图
5. 文件变大（2.1MB vs 更小） ⚠️ 这是副作用，实际上是缺点
```

### 历史原因的可能性

也许这个网站很早就有这个机制（2019年之前），当时确实需要兼容不支持 WebP 的 Safari。但现在保留它主要就是**防护目的**。

---

## 问题二：gg.js 里一堆 case 的机制常见吗？

```javascript
switch (g) {
    case 422:
    case 1747:
    case 3446:
    // ... 几百个 case ...
    case 1871:
        o = 0;
        break;
}
return o;
```

### 这种模式的本质

这是一个**硬编码的查找表（lookup table）**，用 switch-case 实现。

### 常见吗？

**不算常见**，但在特定场景下会看到：

| 场景 | 用途 |
|------|------|
| 负载均衡 | 决定哪些 ID 去哪个服务器 |
| 分片存储 | 决定数据存在哪个分区 |
| 灰度发布 | 决定哪些用户看新版本 |
| 反爬虫 | 让逻辑难以被简单逆向 |

### 更常见的做法

正常情况下，开发者会用**算法**而不是硬编码：

```javascript
// 正常做法：用算法
function getServer(id) {
    return id % 2;  // 奇偶分配
}

// 或者用哈希
function getServer(id) {
    return hash(id) % serverCount;
}
```

### 为什么 gg.js 用硬编码？

我猜测几个原因：

```
1. 服务器负载不均衡
   - 某些编号的图片特别热门
   - 需要手动调整分配
   
2. 存储迁移
   - 部分图片搬到了新服务器
   - case 列表就是"已迁移"的记录
   
3. 故意混淆
   - 让逆向者难以写出通用公式
   - 必须拿到完整的 case 列表才能计算
   
4. 灵活控制
   - 可以随时修改 gg.js 调整分配
   - 不需要改动其他代码
```

### 这样做的效果

```
优点：
✅ 灵活，可以随时调整任意 ID 的服务器
✅ 增加逆向难度
✅ 不需要数据库查询

缺点：
❌ gg.js 文件会很大
❌ 每次改动都要更新 JS 文件
❌ 浏览器需要加载这个大文件
```

---

## 总结

| 机制 | 主要目的 | 常见程度 |
|------|----------|----------|
| WebP → Base64 PNG | 防护（+历史兼容） | 不常见，算"过度防护" |
| switch-case 查找表 | 灵活分配 + 混淆 | 少见，通常用算法代替 |

这个网站的防护策略确实比较"重"，既有动态 URL 计算，又有图片格式转换，还有服务器分配混淆。这让自动化下载变得相当困难。

---
## 🧑‍💻 User

请帮我分析一下他这个将we部P解码为PNG的。

"use strict";

var observer = new MutationObserver(function(mutations) {
 mutations.forEach(function(mutation) {
 mutation.addedNodes.forEach(function(addedNode) {
 if (addedNode.nodeType !== 1 || !addedNode.parentNode) {
 return;
 }
 if (addedNode.tagName === 'IMG'
 && addedNode.src
 && /\.webp$/.test(addedNode.src)
 ) {
 decode_webp(addedNode);
 } else if (addedNode.tagName === 'PICTURE') {
 for (let i = 0; i < addedNode.children.length; i++) {
 if (addedNode.children[i].tagName === 'IMG'
 && addedNode.children[i].src
 && /\.webp$/.test(addedNode.children[i].src)
 ) {
 decode_webp(addedNode.children[i]);
 }
 }
 }
 });
 switch (mutation.type) {
 case "attributes":
 switch (mutation.attributeName) {
 case "src":
 if (/\.webp$/.test(mutation.target.src)) {
 decode_webp(mutation.target);
 }
 break;
 }
 break;
 }
 });
});

var tested_has_webp_support = false;
var cached_has_webp_support = true;
var webp;
async function check_webp_support() {
 if (tested_has_webp_support) {
 return cached_has_webp_support;
 }

const testImageSources = [
"UklGRjIAAABXRUJQVlA4ICYAAACyAgCdASoCAAEALmk0mk0iIiIiIgBoSygABc6zbAAA/v56QAAAAA==", //basic
//"UklGRh4AAABXRUJQVlA4TBEAAAAvAQAAAAfQ//73v/+BiOh/AAA=" //lossless
//"UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA" //animated - the shim can't decode animated webp
];

const testImage = (src) => {
return new Promise((resolve, reject) => {
var img = document.createElement("img");
img.onerror = error => resolve(false);
img.onload = () => resolve(true);
img.src = 'data:image/webp;base64,'+src;
});
};

const results = await Promise.all(testImageSources.map(testImage));

cached_has_webp_support = results.every(result => !!result);

if (!cached_has_webp_support) {
 const m = await import('https://ltn.gold-usergeneratedcontent.net/webp.js');
 webp = new m.Webp();
 webp.Module.doNotCaptureKeyboard = true;
}

tested_has_webp_support = true;

return cached_has_webp_support;
}

observer.observe(document.body, { subtree: true, childList: true, attributes: true });
check_webp_support().then((has_webp_support) => {
 if (has_webp_support) {
 observer.disconnect();
 } else {
 let images = document.querySelectorAll('img');
 images.forEach(function(img) {
 if (/\.webp$/.test(img.src)) {
 decode_webp(img);
 }
 });
 }
});


function loadBinaryData(url) {
return new Promise((resolve, reject) => {
const xhr = new XMLHttpRequest();
xhr.open("GET", url);
xhr.responseType = "arraybuffer";

xhr.onreadystatechange = () => {
if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					resolve(new Uint8Array(xhr.response));
				}
}
};

xhr.send();
});
}

function decode_webp(el) {
 check_webp_support().then((has_webp_support) => {
 if (has_webp_support) return;

 loadBinaryData(el.src).then((webpData) => {
 const canvas = document.createElement("canvas");
 webp.setCanvas(canvas);
 webp.webpToSdl(webpData, webpData.length);
 if (el) {
 el.src = canvas.toDataURL();
 }
 });
 });
}

---
## 🤖 Assistant

这段代码非常有意思！让我详细分析：

---

## 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                    decode_webp.js                           │
├─────────────────────────────────────────────────────────────┤
│  1. MutationObserver  - 监听 DOM 变化                       │
│  2. check_webp_support - 检测浏览器是否支持 WebP            │
│  3. loadBinaryData    - 下载图片二进制数据                  │
│  4. decode_webp       - 转换 WebP → PNG Base64              │
└─────────────────────────────────────────────────────────────┘
```

---

## 1. MutationObserver - DOM 监听器

```javascript
var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        // 监听新增节点
        mutation.addedNodes.forEach(function(addedNode) {
            if (addedNode.nodeType !== 1 || !addedNode.parentNode) {
                return;  // 不是元素节点就跳过
            }
            // 如果是 IMG 标签且 src 以 .webp 结尾
            if (addedNode.tagName === 'IMG' 
                && addedNode.src
                && /\.webp$/.test(addedNode.src)
            ) {
                decode_webp(addedNode);  // 转换它
            } 
            // 如果是 PICTURE 标签，检查里面的 IMG
            else if (addedNode.tagName === 'PICTURE') {
                // ... 遍历子元素找 IMG
            }
        });
        
        // 监听属性变化（比如 src 被修改）
        if (mutation.type === "attributes" && mutation.attributeName === "src") {
            if (/\.webp$/.test(mutation.target.src)) {
                decode_webp(mutation.target);
            }
        }
    });
});

// 开始监听整个 body
observer.observe(document.body, { 
    subtree: true,      // 监听所有后代
    childList: true,    // 监听子节点增删
    attributes: true    // 监听属性变化
});
```

**作用**：实时监控页面，任何新出现的 WebP 图片都会被自动转换。

---

## 2. check_webp_support - 浏览器检测

```javascript
async function check_webp_support() {
    if (tested_has_webp_support) {
        return cached_has_webp_support;  // 用缓存，避免重复检测
    }
    
    // 测试用的 Base64 WebP 图片
    const testImageSources = [
        "UklGRjIAAABXRUJQVlA4ICYAAACyAgCdASoCAAEALmk0mk0iIiIiIgBoSygABc6zbAAA/v56QAAAAA==",
    ];
    
    // 尝试加载测试图片
    const testImage = (src) => {
        return new Promise((resolve, reject) => {
            var img = document.createElement("img");
            img.onerror = error => resolve(false);  // 加载失败 = 不支持
            img.onload = () => resolve(true);       // 加载成功 = 支持
            img.src = 'data:image/webp;base64,' + src;
        });
    };

    const results = await Promise.all(testImageSources.map(testImage));
    cached_has_webp_support = results.every(result => !!result);
    
    // 如果不支持 WebP，加载解码库
    if (!cached_has_webp_support) {
        const m = await import('https://ltn.gold-usergeneratedcontent.net/webp.js');
        webp = new m.Webp();
        webp.Module.doNotCaptureKeyboard = true;
    }
    
    tested_has_webp_support = true;
    return cached_has_webp_support;
}
```

**逻辑流程**：
```
浏览器支持 WebP?
    ├── 是 → 什么都不做，observer.disconnect()
    └── 否 → 加载 webp.js 解码库，开始转换所有图片
```

---

## 3. 核心转换函数

```javascript
function loadBinaryData(url) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.responseType = "arraybuffer";  // 请求二进制数据
        
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                resolve(new Uint8Array(xhr.response));  // 返回字节数组
            }
        };
        xhr.send();
    });
}

function decode_webp(el) {
    check_webp_support().then((has_webp_support) => {
        if (has_webp_support) return;  // 浏览器支持就不转换
        
        loadBinaryData(el.src).then((webpData) => {
            const canvas = document.createElement("canvas");
            webp.setCanvas(canvas);
            webp.webpToSdl(webpData, webpData.length);  // WebP → Canvas
            if (el) {
                el.src = canvas.toDataURL();  // Canvas → Base64 PNG
            }
        });
    });
}
```

**转换流程**：
```
WebP URL → XHR 下载 → Uint8Array → webp.js 解码 → Canvas → toDataURL() → Base64 PNG
```

---

## 4. 关键发现：这不是防护机制！

```javascript
check_webp_support().then((has_webp_support) => {
    if (has_webp_support) {
        observer.disconnect();  // ← 支持 WebP 就停止监听！
    } else {
        // 不支持才转换
    }
});
```

**如果浏览器支持 WebP，这段代码什么都不做！**

---

## 5. 真相

| 情况 | 代码行为 |
|------|----------|
| 现代浏览器（支持 WebP） | `observer.disconnect()`，完全不转换 |
| 旧浏览器（不支持 WebP） | 加载 webp.js，转换为 PNG |

**所以这段代码的目的是**：

```
┌────────────────────────────────────────────────────┐
│  兼容性 Polyfill，不是防护措施！                   │
│                                                    │
│  为了让 2019 年之前的 Safari 等不支持 WebP         │
│  的浏览器也能显示图片                              │
└────────────────────────────────────────────────────┘
```

---

## 6. 那你之前看到的 Base64 是怎么回事？

根据这段代码的逻辑，**现代浏览器不应该看到 Base64**！

可能的解释：

1. **你用的浏览器/环境被判定为不支持 WebP**
 - 某些隐私模式或扩展可能干扰检测

2. **还有其他脚本在做转换**
 - 不是这个 `decode_webp.js`

3. **开发者工具显示的是中间状态**
 - 可能是调试时的缓存

---

## 总结

| 组件 | 目的 | 防护作用 |
|------|------|----------|
| `decode_webp.js` | 兼容旧浏览器 | ❌ 无 |
| `gg.js` | 计算图片 URL | ✅ 有（混淆路径） |
| 动态子目录 | 分散服务器负载 | ✅ 有（防直链） |

**真正的防护是 `gg.js` 的动态 URL 计算，不是 WebP 转换！**

---
## 🧑‍💻 User

你的判断是对的，我在把这个广告拦截器关闭之后，它这里的这个source仍然被进行了一个转换，但只是后缀变成了AVIF。
不过，关闭广告拦截器之后，右键的话将会打开新的标签页跳转到广告商。而无法在原来的图片这里进行一个保存，而且它的这个逻辑点击之后它会进行翻页。估计可能据此判断用户是想要保存。在翻页之后，他这个s又变回转换成base6色。

---
## 🤖 Assistant

非常精彩的观察！你发现了一个很巧妙的多层防护机制。让我整理一下：

---

## 完整防护逻辑

```
┌─────────────────────────────────────────────────────────────────┐
│                      用户想保存图片                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  第一层：广告拦截器检测                                          │
├─────────────────────────────────────────────────────────────────┤
│  有广告拦截器？                                                  │
│    ├── 是 → 图片转成 Base64（你之前看到的情况）                  │
│    └── 否 → 进入第二层                                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  第二层：点击劫持                                                │
├─────────────────────────────────────────────────────────────────┤
│  用户右键/点击图片？                                             │
│    → 触发 class="lillie" 的广告弹窗                             │
│    → 跳转到广告页面                                              │
│    → 无法正常保存                                                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  第三层：翻页触发转换                                            │
├─────────────────────────────────────────────────────────────────┤
│  检测到点击行为？                                                │
│    → 判定用户可能想保存                                          │
│    → 翻页                                                        │
│    → 新图片转成 Base64                                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 你观察到的现象对应

| 状态 | 图片格式 | 右键行为 |
|------|----------|----------|
| 广告拦截器开启 | Base64 PNG | 可以保存，但是转换后的 |
| 广告拦截器关闭（首次加载） | AVIF/WebP URL | 右键跳转广告 |
| 广告拦截器关闭（点击后翻页） | Base64 PNG | 可以保存，但是转换后的 |

---

## AVIF 的出现

```html
<picture>
    <source srcset="..." type="image/avif" />  <!-- 优先用 AVIF -->
    <img src="...webp" />                       <!-- 回退用 WebP -->
</picture>
```

AVIF 比 WebP 压缩率更高，这是正常的现代图片优化策略。

---

## 检测逻辑推测

```javascript
// 伪代码，推测他们的逻辑

// 检测广告拦截器
function hasAdBlocker() {
    // 尝试加载广告脚本，失败则有拦截器
    return !window.exoJsPop101;  // 或类似检测
}

// 页面加载时
if (hasAdBlocker()) {
    // 直接转换所有图片为 Base64
    convertAllToBase64();
} else {
    // 保持原始 URL，但设置点击陷阱
    setupClickTrap();
}

// 点击/翻页时
function onPageChange() {
    if (userClickedRecently()) {
        // 用户可能想保存，转换新图片
        convertCurrentToBase64();
    }
}
```

---

## 这个设计的目的

```
场景                          网站的应对
────────────────────────────────────────────────────
普通用户阅读                   正常显示 AVIF/WebP（高效）
用户想保存（有拦截器）         Base64（无法追踪来源）
用户想保存（无拦截器）         广告弹窗（赚钱）
用户绕过广告想保存             翻页 + Base64（惩罚性转换）
```

**核心目标**：
1. 正常用户体验好（AVIF 加载快）
2. 想保存的用户要么看广告，要么只能得到转换后的图
3. 无论如何都很难直接拿到原始高质量图片 URL

---

## 总结

这是一个**行为检测 + 动态响应**的防护系统：

| 层级 | 技术 | 防护目标 |
|------|------|----------|
| 1 | 广告拦截器检测 | 区分"普通用户"和"技术用户" |
| 2 | 点击劫持（lillie class） | 阻止右键保存，同时赚广告费 |
| 3 | 行为触发转换 | 检测到保存意图就降级为 Base64 |
| 4 | gg.js 动态 URL | 防止直接爬取原始链接 |

这个网站的防护设计确实很"用心"！
