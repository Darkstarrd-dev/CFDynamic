# ComfyUI Node.js API 项目文档

## 项目概述

通过 Node.js 后端服务连接 ComfyUI，实现图片生成 API。用户通过 Web 界面输入提示词，后端调用 ComfyUI 生成图片并返回。

## 技术架构

```
浏览器 → Node.js (Express :5000) → ComfyUI (:8188) → 返回图片
```

## ComfyUI 端配置

### 1. 导出工作流

在 ComfyUI 界面：
- 点击 **设置齿轮** → 启用 **Dev mode Options**
- 点击 **Save (API Format)** 导出 JSON 文件
- 将文件保存为 `workflow_api.json`

### 2. 必要设置

ComfyUI 桌面版默认监听 `127.0.0.1:8188`，无需额外配置。

## 项目文件结构

```
comfyui-api/
├── server.js           # 主服务器
├── workflow_api.json   # ComfyUI 工作流（API格式）
├── package.json        # 依赖配置
└── public/
    └── index.html      # 前端界面
```

## 安装步骤

### 1. 创建项目

```bash
mkdir comfyui-api
cd comfyui-api
npm init -y
npm install express
```

### 2. 核心文件

**server.js**
```javascript
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const COMFYUI_URL = 'http://127.0.0.1:8188';

// 加载工作流
function loadWorkflow() {
    return JSON.parse(fs.readFileSync('workflow_api.json', 'utf8'));
}

// 生成图片 API
app.post('/api/generate', async (req, res) => {
    try {
        const { prompt, negativePrompt = '', seed } = req.body;
        const workflow = loadWorkflow();
      
        // 查找并修改节点（需根据实际工作流调整节点ID）
        // 正向提示词节点
        if (workflow['6']?.inputs?.text !== undefined) {
            workflow['6'].inputs.text = prompt;
        }
        // 负向提示词节点
        if (workflow['7']?.inputs?.text !== undefined) {
            workflow['7'].inputs.text = negativePrompt;
        }
        // 种子节点
        if (workflow['3']?.inputs?.seed !== undefined) {
            workflow['3'].inputs.seed = seed || Math.floor(Math.random() * 1e15);
        }
      
        // 提交任务
        const response = await fetch(`${COMFYUI_URL}/prompt`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: workflow })
        });
      
        const result = await response.json();
        if (result.error) {
            return res.status(400).json({ error: result.error });
        }
      
        // 轮询等待结果
        const promptId = result.prompt_id;
        const image = await waitForResult(promptId);
      
        res.json({ success: true, image });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 等待生成结果
async function waitForResult(promptId, timeout = 300000) {
    const start = Date.now();
  
    while (Date.now() - start < timeout) {
        const historyRes = await fetch(`${COMFYUI_URL}/history/${promptId}`);
        const history = await historyRes.json();
      
        if (history[promptId]) {
            const status = history[promptId].status?.status_str;
          
            if (status === 'success') {
                const outputs = history[promptId].outputs;
                for (const nodeId in outputs) {
                    const images = outputs[nodeId].images;
                    if (images?.length > 0) {
                        const img = images[0];
                        return `/comfyui/view?filename=${img.filename}&subfolder=${img.subfolder || ''}&type=${img.type}`;
                    }
                }
            }
          
            if (status === 'error') {
                throw new Error('ComfyUI 生成失败');
            }
        }
      
        await new Promise(r => setTimeout(r, 1000));
    }
  
    throw new Error('生成超时');
}

// 代理图片请求
app.get('/comfyui/view', async (req, res) => {
    const { filename, subfolder, type } = req.query;
    const url = `${COMFYUI_URL}/view?filename=${filename}&subfolder=${subfolder || ''}&type=${type}`;
  
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
  
    res.set('Content-Type', response.headers.get('content-type'));
    res.send(Buffer.from(buffer));
});

// 调试接口
app.get('/api/workflow/debug', (req, res) => {
    res.json(loadWorkflow());
});

app.listen(5000, () => console.log('服务运行在 http://localhost:5000'));
```

**public/index.html**
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>AI 图片生成</title>
    <style>
        body { font-family: Arial; max-width: 800px; margin: 50px auto; padding: 20px; }
        textarea { width: 100%; height: 100px; margin: 10px 0; }
        button { padding: 10px 30px; font-size: 16px; cursor: pointer; }
        #result { margin-top: 20px; }
        #result img { max-width: 100%; }
        .loading { color: #666; }
        .error { color: red; }
    </style>
</head>
<body>
    <h1>AI 图片生成</h1>
    <div>
        <label>正向提示词：</label>
        <textarea id="prompt">a cat</textarea>
    </div>
    <div>
        <label>负向提示词：</label>
        <textarea id="negative"></textarea>
    </div>
    <button onclick="generate()">生成图片</button>
    <div id="result"></div>

    <script>
        async function generate() {
            const result = document.getElementById('result');
            result.innerHTML = '<p class="loading">生成中，请稍候...</p>';
          
            try {
                const res = await fetch('/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        prompt: document.getElementById('prompt').value,
                        negativePrompt: document.getElementById('negative').value
                    })
                });
              
                const data = await res.json();
              
                if (data.success) {
                    result.innerHTML = `<img src="${data.image}">`;
                } else {
                    result.innerHTML = `<p class="error">错误: ${data.error}</p>`;
                }
            } catch (e) {
                result.innerHTML = `<p class="error">请求失败: ${e.message}</p>`;
            }
        }
    </script>
</body>
</html>
```

### 3. 运行

```bash
# 确保 ComfyUI 已启动
node server.js
# 访问 http://localhost:5000
```

## 工作流节点 ID 映射

**重要：** 需根据实际 `workflow_api.json` 修改节点 ID。

常见节点类型及查找方式：
```javascript
// 在浏览器控制台分析工作流
const wf = await fetch('/api/workflow/debug').then(r=>r.json());
for(let id in wf) {
    console.log(`节点 ${id}: ${wf[id].class_type}`, wf[id].inputs);
}
```

典型节点对应：
| 功能 | class_type | 修改字段 |
|------|------------|----------|
| 正向提示词 | CLIPTextEncode | inputs.text |
| 负向提示词 | CLIPTextEncode | inputs.text |
| 采样器 | KSampler | inputs.seed |

## 常见问题及解决

### 1. 提交任务返回 `node_errors`

**原因：** 工作流节点 ID 与代码中不匹配
**解决：** 检查 workflow_api.json 中实际的节点 ID，修改 server.js 中的映射

### 2. `OSError: [Errno 22] Invalid argument` 在 VaeGGUF

**原因：** ComfyUI-Manager 日志系统 bug
**解决：** 重启 ComfyUI

### 3. 生成超时

**原因：** 
- ComfyUI 未启动
- 首次加载模型耗时较长

**解决：** 
- 确认 ComfyUI 运行中
- 首次使用先在 ComfyUI 界面手动运行一次

### 4. 图片无法显示

**原因：** 跨域问题
**解决：** 使用 `/comfyui/view` 代理接口而非直接访问 ComfyUI

## 调试命令

```javascript
// 在 ComfyUI 界面控制台测试工作流
const wf = await fetch('http://localhost:5000/api/workflow/debug').then(r=>r.json());
const res = await fetch('/prompt', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({prompt: wf})
}).then(r=>r.json());
console.log(res);

// 检查任务状态
const h = await fetch(`/history/${res.prompt_id}`).then(r=>r.json());
console.log(h[res.prompt_id]?.status);
```

## 扩展建议

1. **WebSocket 实时进度**：监听 ComfyUI WebSocket 获取生成进度
2. **多参数支持**：扩展 API 支持修改更多参数（尺寸、步数等）
3. **队列管理**：添加任务队列避免并发问题
