我来为你总结从零开始探索网站、最终成功获取图片的完整过程。

---

# 从零开始的网站逆向分析流程

## 阶段一：初步观察与直接尝试

### 步骤1：观察页面
打开一个画廊页面，看到很多图片缩略图。

**目标**：下载这些图片的原图。

### 步骤2：最直接的尝试
- 在缩略图上右键 → 复制图片地址 → 新标签页打开
- **结果**：只是小的预览图，不是原图

### 步骤3：进入大图页面尝试
- 点击进入画廊内的大图浏览页面
- 尝试右键保存
- **发现的异常现象**：

| 操作 | 结果 |
|------|------|
| "在新标签页打开图片" | 灰色不可选 |
| "复制图片地址" | 灰色不可选 |
| "图片另存为" | 可用，但下载的是PNG |
| "复制图片" | 可用 |

**关键发现**：下载得到的PNG文件比预期大很多（几十倍），说明不是原始格式。

---

## 阶段二：使用开发者工具分析

### 步骤4：打开F12开发者工具
按 `F12` 或 `Ctrl+Shift+I` 打开开发者工具。

### 步骤5：在Elements面板检查图片元素
找到显示图片的HTML元素，发现结构：

```html
<picture>
  <source srcset="data:image/png;base64,..." type="image/avif">
  <img class="lillie" src="https://w1.gold-usergeneratedcontent.net/xxx/xxx.webp">
</picture>
```

**分析发现**：
1. `<picture>` 是HTML5原生标签，用于响应式图片
2. `<source>` 里是Base64编码的PNG数据
3. `<img>` 标签有真实的WebP URL

**理解为什么右键异常**：
- 浏览器显示的是Base64数据（内存中的虚拟数据）
- 没有真实URL可以"在新标签页打开"或"复制地址"
- "另存为"保存的是内存中已解码的PNG

### 步骤6：尝试直接访问img标签的URL
复制 `<img src="...">` 中的WebP地址，在新标签页打开。

**结果**：404错误

---

## 阶段三：探索全局变量

### 步骤7：在Console面板尝试访问变量
切换到控制台（Console），尝试输入可能的变量名：

```javascript
// 尝试输入
galleryid
```
**返回**：`"3669380"`（画廊ID）

```javascript
// 继续尝试
galleryinfo
```
**返回**：一个包含画廊信息的对象

### 步骤8：探索galleryinfo结构
```javascript
// 查看完整结构
galleryinfo

// 查看图片数量
galleryinfo.files.length  // 例如：16

// 查看第一张图片信息
galleryinfo.files[0]
```

**返回的文件对象结构**：
```javascript
{
  name: "001.jpg",
  hash: "b7f512f4972ff22819bb72bbc2cf38daf556b80371a7e92548e034013513ce53",
  haswebp: 1,
  hasavif: 1
}
```

### 步骤9：发现gg配置对象
```javascript
// 输入
gg
```

**返回结构**：
```javascript
{
  b: "1764900002/",        // 基础路径
  m: function(g){...},     // 服务器选择函数
  s: function(h){...}      // 子目录计算函数
}
```

---

## 阶段四：理解URL构建算法

### 步骤10：分析gg.s()函数
```javascript
// 用第一张图片的hash测试
let testHash = galleryinfo.files[0].hash;
gg.s(testHash)  // 返回例如：1557
```

**手动验证计算过程**：
```javascript
// hash最后3个字符的处理
let match = testHash.match(/(..)(.)$/);
console.log("倒数2-3位:", match[1]);  // 如 "15"
console.log("最后1位:", match[2]);    // 如 "6"

// 重新排列并转换
let combined = match[2] + match[1];   // "615"
let result = parseInt(combined, 16);  // 1557（十六进制转十进制）
```

### 步骤11：分析gg.m()函数
```javascript
// 获取g值
let g = parseInt(match[2] + match[1], 16);

// 调用gg.m()
gg.m(g)  // 返回0或1，决定使用哪个服务器
```

### 步骤12：构建完整URL
```javascript
// 组合所有部分
let dirNum = gg.s(testHash);           // 子目录
let serverNum = 1 + gg.m(g);            // 服务器编号（1或2）
let subdomain = "w" + serverNum;        // w1或w2

let fullUrl = `https://${subdomain}.gold-usergeneratedcontent.net/${gg.b}${dirNum}/${testHash}.webp`;

console.log(fullUrl);
```

---

## 阶段五：验证与解决404问题

### 步骤13：测试构建的URL
直接在新标签页打开构建的URL。

**结果**：仍然404

### 步骤14：在控制台用fetch测试
```javascript
fetch(fullUrl)
  .then(r => console.log("状态码:", r.status));
```

**结果**：状态码200！

**发现关键差异**：
- 控制台fetch → 200成功
- 直接打开 → 404失败

### 步骤15：理解Referer防盗链机制
```javascript
// 验证：无Referer时的请求
fetch(fullUrl, { referrerPolicy: "no-referrer" })
  .then(r => console.log("无Referer状态码:", r.status));
```

**结果**：403或404

**结论**：服务器检查Referer请求头，只允许来自hitomi.la的请求。

---

## 阶段六：实现下载

### 步骤16：封装URL构建函数
```javascript
function buildImageUrl(hash, format = "webp") {
  const dirNum = gg.s(hash);
  const match = hash.match(/(..)(.)$/);
  const g = parseInt(match[2] + match[1], 16);
  const serverNum = 1 + gg.m(g);
  const subdomain = (format === "webp" ? "w" : "a") + serverNum;
  
  return `https://${subdomain}.gold-usergeneratedcontent.net/${gg.b}${dirNum}/${hash}.${format}`;
}
```

### 步骤17：在控制台下载单张图片
```javascript
async function downloadImage(hash, filename) {
  const url = buildImageUrl(hash);
  const response = await fetch(url);
  const blob = await response.blob();
  
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

// 测试下载第一张
downloadImage(galleryinfo.files[0].hash, "001.webp");
```

### 步骤18：导出命令行下载命令
```javascript
// 生成curl命令列表
let commands = galleryinfo.files.map((f, i) => {
  let url = buildImageUrl(f.hash);
  let filename = String(i + 1).padStart(3, '0') + '.webp';
  return `curl -H "Referer: https://hitomi.la/" -o "${filename}" "${url}"`;
});

console.log(commands.join('\n'));
```

**输出示例**：
```bash
curl -H "Referer: https://hitomi.la/" -o "001.webp" "https://w2.gold-usergeneratedcontent.net/..."
curl -H "Referer: https://hitomi.la/" -o "002.webp" "https://w1.gold-usergeneratedcontent.net/..."
...
```

---

## 流程总结图

```
┌─────────────────────────────────────────────────────────────┐
│  第一阶段：直接尝试（失败）                                  │
│  右键保存 → 只能得到转换后的PNG                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  第二阶段：Elements面板分析                                  │
│  发现 <picture> 结构，找到真实WebP URL                       │
│  直接访问 → 404                                              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  第三阶段：Console探索全局变量                               │
│  发现 galleryid、galleryinfo、gg 对象                        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  第四阶段：分析URL构建算法                                   │
│  理解 gg.s() 和 gg.m() 的计算逻辑                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  第五阶段：发现Referer防盗链                                 │
│  fetch成功但直接访问失败 → 需要正确的Referer头               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  第六阶段：实现下载                                          │
│  控制台直接下载 或 导出curl命令在命令行执行                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 关键经验总结

| 步骤 | 方法 | 收获 |
|------|------|------|
| 观察异常行为 | 右键菜单选项异常 | 发现防护存在 |
| Elements检查 | 查看HTML结构 | 找到真实URL和Base64转换 |
| Console探索 | 尝试输入变量名 | 发现全局暴露的数据 |
| 对比测试 | fetch vs 直接访问 | 发现Referer检查机制 |
| 分析JS文件 | 阅读gg.js源码 | 理解URL计算算法 |