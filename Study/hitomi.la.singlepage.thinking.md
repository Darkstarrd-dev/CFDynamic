I'll analyze these two document records and summarize their content for you.


# Hitomi.la 网站图片下载机制分析总结

根据两份记录文档的内容，以下是对该网站技术机制的归纳整理：

---

## 一、核心技术架构

### 1. 全局变量暴露
网站将关键数据定义在全局作用域（`window`对象），可直接在浏览器控制台访问：

| 变量名 | 内容 |
|--------|------|
| `galleryid` | 画廊ID（如 `"3669332"`） |
| `galleryinfo` | 画廊完整信息，包含 `title`、`files` 数组等 |
| `gg` | CDN配置对象，包含 `b`（基础路径）、`s()`、`m()` 函数 |

### 2. 图片URL构建算法（gg.js）

**URL结构**：
```
https://{服务器}.gold-usergeneratedcontent.net/{gg.b}{子目录}/{hash}.webp
```

**计算流程**：
1. `gg.s(hash)` — 从hash最后3位计算子目录
   - 例：hash末尾 `"156"` → 取 `"15"` 和 `"6"` → 拼接 `"615"` → 十六进制转十进制 = `1557`
2. `gg.m(g)` — 通过switch-case查找表决定服务器编号（返回0或1）
3. `gg.b` — 基础路径ID（如 `'1764900002/'`）
4. 服务器前缀：WebP用 `w1/w2`，AVIF用 `a1/a2`

---

## 二、防护机制层级

### 第一层：Referer防盗链
- 直接访问图片URL返回 **404**
- 需要携带正确的 `Referer: https://hitomi.la/` 请求头
- 绕过方法：`curl -H "Referer: https://hitomi.la/" -o image.webp "图片URL"`

### 第二层：Base64图片转换
- 使用 `<picture>` 标签包裹图片
- 将图片转换为Base64 PNG嵌入页面
- 效果：右键"在新标签页打开"和"复制图片地址"变灰不可用

### 第三层：广告拦截器检测
| 状态 | 图片格式 | 右键行为 |
|------|----------|----------|
| 拦截器开启 | Base64 PNG | 可保存但是转换后的 |
| 拦截器关闭 | AVIF/WebP URL | 触发广告跳转 |

### 第四层：行为检测
- 检测到点击行为后触发翻页
- 翻页后新图片自动转为Base64
- 判定逻辑：用户点击 → 可能想保存 → 降级处理

---

## 三、关键脚本分析

### gg.js
- **作用**：动态计算图片URL路径
- **特点**：使用硬编码switch-case查找表（数百个case），而非算法公式
- **目的**：灵活控制服务器分配 + 增加逆向难度

### decode_webp.js
- **实际作用**：WebP格式的Polyfill（兼容性填充）
- **工作逻辑**：
  - 检测浏览器是否支持WebP
  - 支持 → 什么都不做，断开监听
  - 不支持 → 加载webp.js库转换为PNG
- **结论**：这是兼容旧浏览器的方案，**并非防护机制**

---

## 四、HTML结构特点

### `<picture>` 标签
```html
<picture>
  <source srcset="data:image/png;base64,..." type="image/avif">
  <img class="lillie" src="https://...webp">
</picture>
```
- 原生HTML5响应式图片标签
- 浏览器按顺序选择支持的格式
- `class="lillie"` 配合广告脚本实现点击劫持

---

## 五、下载方法总结

### 命令行下载
```bash
# curl
curl -H "Referer: https://hitomi.la/" -o image.webp "图片URL"

# wget
wget --referer="https://hitomi.la/" -O image.webp "图片URL"
```

### 控制台批量导出
```javascript
let urls = galleryinfo.files.map((f, i) => {
  let url = buildImageUrl(f.hash);
  let filename = String(i + 1).padStart(3, '0') + '.webp';
  return `curl -H "Referer: https://hitomi.la/" -o "${filename}" "${url}"`;
});
console.log(urls.join('\n'));
```

---

## 六、网站防护评估

| 方面 | 实际情况 | 评价 |
|------|----------|------|
| 数据暴露 | 全局变量完全可访问 | ⚠️ 弱 |
| 防盗链 | 仅检查Referer，可伪造 | ⚠️ 弱 |
| URL混淆 | 算法公开在gg.js | ⚠️ 弱 |
| 速率限制 | 基本没有 | ⚠️ 弱 |
| 行为检测 | 有多层响应机制 | ✅ 中等 |
| 验证码/登录 | 无 | ⚠️ 无 |

**总体结论**：该网站防护机制设计较为复杂，有多层动态响应，但核心数据和算法都暴露在前端，技术上较容易绑过。