# PPT 生成器 - 前后端分离项目

## 项目结构

```
ppt-generator/
├── server.js                 # Node.js 后端服务
├── workflow_api.json         # ComfyUI 工作流配置
├── package.json              # 依赖配置
├── public/
│   └── index.html            # 前端界面
└── temp/                     # 临时文件目录（自动创建）
```

## 安装和运行

```bash
# 1. 创建项目目录
mkdir ppt-generator
cd ppt-generator

# 2. 初始化项目
npm init -y

# 3. 安装依赖
npm install express pptxgenjs uuid

# 4. 创建 public 目录
mkdir public

# 5. 确保 ComfyUI 已启动（端口 8188）

# 6. 运行服务
node server.js

# 7. 访问 http://localhost:5000
```

---

## server.js

```javascript
const express = require('express');
const PptxGenJS = require('pptxgenjs');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

// 配置
const COMFYUI_URL = 'http://127.0.0.1:8188';
const TEMP_DIR = path.join(__dirname, 'temp');

// 确保临时目录存在
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// 加载 ComfyUI 工作流
function loadWorkflow() {
    const workflowPath = path.join(__dirname, 'workflow_api.json');
    if (!fs.existsSync(workflowPath)) {
        throw new Error('workflow_api.json 不存在，请先从 ComfyUI 导出工作流');
    }
    return JSON.parse(fs.readFileSync(workflowPath, 'utf8'));
}

// ===== ComfyUI 图片生成 =====

// 使用 ComfyUI 生成图片
async function generateImageWithComfyUI(description, negativePrompt = '') {
    console.log(`[ComfyUI] 开始生成图片: "${description.substring(0, 50)}..."`);
  
    const workflow = loadWorkflow();
  
    // 修改工作流中的提示词节点（需根据实际工作流调整）
    // 正向提示词 - 通常是 CLIPTextEncode 节点
    for (const nodeId in workflow) {
        const node = workflow[nodeId];
        if (node.class_type === 'CLIPTextEncode') {
            // 检查是否连接到正向输入
            if (node.inputs.text !== undefined) {
                // 简单判断：第一个 CLIPTextEncode 作为正向
                if (!node._assigned) {
                    node.inputs.text = description;
                    node._assigned = 'positive';
                    console.log(`[ComfyUI] 设置正向提示词到节点 ${nodeId}`);
                }
            }
        }
    }
  
    // 如果有特定的节点 ID，可以直接设置
    if (workflow['6']?.inputs?.text !== undefined) {
        workflow['6'].inputs.text = description;
    }
    if (workflow['7']?.inputs?.text !== undefined) {
        workflow['7'].inputs.text = negativePrompt || 'low quality, blurry, distorted';
    }
    if (workflow['3']?.inputs?.seed !== undefined) {
        workflow['3'].inputs.seed = Math.floor(Math.random() * 1e15);
    }
  
    // 提交任务到 ComfyUI
    const response = await fetch(`${COMFYUI_URL}/prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: workflow })
    });
  
    const result = await response.json();
  
    if (result.error) {
        throw new Error(`ComfyUI 错误: ${JSON.stringify(result.error)}`);
    }
  
    if (result.node_errors && Object.keys(result.node_errors).length > 0) {
        throw new Error(`节点错误: ${JSON.stringify(result.node_errors)}`);
    }
  
    const promptId = result.prompt_id;
    console.log(`[ComfyUI] 任务已提交, prompt_id: ${promptId}`);
  
    // 等待生成完成并获取图片
    const imageData = await waitForComfyUIResult(promptId);
    return imageData;
}

// 等待 ComfyUI 生成结果
async function waitForComfyUIResult(promptId, timeout = 300000) {
    const start = Date.now();
  
    while (Date.now() - start < timeout) {
        const historyRes = await fetch(`${COMFYUI_URL}/history/${promptId}`);
        const history = await historyRes.json();
      
        if (history[promptId]) {
            const status = history[promptId].status?.status_str;
          
            if (status === 'error') {
                throw new Error('ComfyUI 生成失败');
            }
          
            if (status === 'success' || history[promptId].outputs) {
                const outputs = history[promptId].outputs;
              
                // 查找输出的图片
                for (const nodeId in outputs) {
                    const images = outputs[nodeId].images;
                    if (images && images.length > 0) {
                        const img = images[0];
                      
                        // 获取图片数据
                        const imageUrl = `${COMFYUI_URL}/view?filename=${encodeURIComponent(img.filename)}&subfolder=${encodeURIComponent(img.subfolder || '')}&type=${img.type}`;
                        const imageRes = await fetch(imageUrl);
                        const imageBuffer = await imageRes.arrayBuffer();
                      
                        // 转换为 base64
                        const base64 = Buffer.from(imageBuffer).toString('base64');
                        const mimeType = imageRes.headers.get('content-type') || 'image/png';
                      
                        console.log(`[ComfyUI] 图片生成完成: ${img.filename}`);
                        return `data:${mimeType};base64,${base64}`;
                    }
                }
            }
        }
      
        // 等待 1 秒后重试
        await new Promise(r => setTimeout(r, 1000));
    }
  
    throw new Error('ComfyUI 生成超时');
}

// ===== PPT 生成器类 =====

class PPTGenerator {
    constructor() {
        this.pptx = null;
        this.imageCache = new Map();
    }
  
    async generate(jsonData, onProgress) {
        const pptData = jsonData.presentation || jsonData;
      
        // 创建 PPT 实例
        this.pptx = new PptxGenJS();
      
        // 设置演示文稿属性
        if (pptData.title) this.pptx.title = pptData.title;
        if (pptData.author) this.pptx.author = pptData.author;
        this.pptx.layout = 'LAYOUT_16x9';
      
        const slides = pptData.slides || [];
        const totalSlides = slides.length;
      
        // 第一步：收集所有需要生成的图片
        const imagesToGenerate = [];
        for (let i = 0; i < slides.length; i++) {
            const slideData = slides[i];
            const elements = slideData.elements || [];
          
            for (const element of elements) {
                if (element.element_type === 'image') {
                    const content = element.content || {};
                    if (content.source === 'ai_generate' || 
                        (!content.value && content.description)) {
                        imagesToGenerate.push({
                            slideIndex: i,
                            elementId: element.element_id,
                            description: content.description || content.alt_text || 'image',
                            element: element
                        });
                    }
                }
            }
        }
      
        // 第二步：生成所有 AI 图片
        if (imagesToGenerate.length > 0) {
            onProgress?.({ 
                stage: 'generating_images', 
                message: `正在生成 ${imagesToGenerate.length} 张图片...`,
                total: imagesToGenerate.length,
                current: 0
            });
          
            for (let i = 0; i < imagesToGenerate.length; i++) {
                const imgInfo = imagesToGenerate[i];
              
                onProgress?.({ 
                    stage: 'generating_images', 
                    message: `正在生成图片 ${i + 1}/${imagesToGenerate.length}: ${imgInfo.description.substring(0, 30)}...`,
                    total: imagesToGenerate.length,
                    current: i
                });
              
                try {
                    const imageData = await generateImageWithComfyUI(imgInfo.description);
                    this.imageCache.set(imgInfo.elementId, imageData);
                    console.log(`[PPT] 图片 ${i + 1}/${imagesToGenerate.length} 生成完成`);
                } catch (error) {
                    console.error(`[PPT] 图片生成失败: ${error.message}`);
                    // 标记为失败，后续渲染时会显示占位符
                    this.imageCache.set(imgInfo.elementId, null);
                }
            }
        }
      
        // 第三步：渲染所有幻灯片
        onProgress?.({ 
            stage: 'rendering_slides', 
            message: '正在渲染幻灯片...',
            total: totalSlides,
            current: 0
        });
      
        for (let i = 0; i < slides.length; i++) {
            const slideData = slides[i];
            const slide = this.pptx.addSlide();
          
            onProgress?.({ 
                stage: 'rendering_slides', 
                message: `正在渲染第 ${i + 1}/${totalSlides} 页...`,
                total: totalSlides,
                current: i
            });
          
            // 设置背景
            if (slideData.background) {
                if (slideData.background.type === 'color') {
                    slide.background = { color: slideData.background.value.replace('#', '') };
                }
            }
          
            // 处理元素
            const elements = slideData.elements || [];
            for (const element of elements) {
                await this.renderElement(slide, element, pptData.theme);
            }
        }
      
        // 第四步：生成文件
        onProgress?.({ 
            stage: 'finalizing', 
            message: '正在生成 PPT 文件...'
        });
      
        // 生成文件名
        const fileName = pptData.title ? 
            `${pptData.title.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '_')}.pptx` : 
            'presentation.pptx';
      
        // 生成为 base64
        const pptxBase64 = await this.pptx.write({ outputType: 'base64' });
      
        return {
            fileName,
            data: pptxBase64,
            mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        };
    }
  
    async renderElement(slide, element, theme) {
        const pos = element.position || {};
        const style = element.style || {};
      
        const x = pos.x || 0;
        const y = pos.y || 0;
        const w = pos.width || pos.w || 5;
        const h = pos.height || pos.h || 1;
      
        switch (element.element_type) {
            case 'text':
                this.renderText(slide, element, x, y, w, h, style);
                break;
            case 'image':
                await this.renderImage(slide, element, x, y, w, h, style);
                break;
            case 'table':
                this.renderTable(slide, element, x, y, w, h);
                break;
            case 'shape':
                this.renderShape(slide, element, x, y, w, h, style);
                break;
            case 'chart':
                this.renderChart(slide, element, x, y, w, h);
                break;
            case 'list':
                this.renderList(slide, element, x, y, w, h, style);
                break;
        }
    }
  
    renderText(slide, element, x, y, w, h, style) {
        const textOptions = {
            x, y, w, h,
            fontSize: style.font_size || 18,
            fontFace: style.font_family || 'Microsoft YaHei',
            color: (style.color || '#333333').replace('#', ''),
            align: style.text_align || 'left',
            valign: 'top',
            wrap: true
        };
      
        if (style.font_weight === 'bold') textOptions.bold = true;
        if (style.font_style === 'italic') textOptions.italic = true;
        if (style.line_height) textOptions.lineSpaceMult = style.line_height;
      
        slide.addText(element.content || '', textOptions);
    }
  
    async renderImage(slide, element, x, y, w, h, style) {
        const content = element.content || {};
        let imageData = null;
      
        // 检查是否有缓存的 AI 生成图片
        if (this.imageCache.has(element.element_id)) {
            imageData = this.imageCache.get(element.element_id);
        } else if (content.value && content.source !== 'ai_generate') {
            imageData = content.value;
        }
      
        if (!imageData) {
            // 添加占位符
            slide.addShape('rect', {
                x, y, w, h,
                fill: { color: 'F0F0F0' },
                line: { color: 'CCCCCC', width: 1 }
            });
            slide.addText(content.alt_text || content.description || '图片生成失败', {
                x, y, w, h,
                fontSize: 12,
                color: '999999',
                align: 'center',
                valign: 'middle'
            });
            return;
        }
      
        try {
            const imgOptions = { x, y, w, h };
          
            if (imageData.startsWith('data:')) {
                imgOptions.data = imageData;
            } else if (imageData.startsWith('http')) {
                // 对于 URL，需要先下载
                const response = await fetch(imageData);
                const buffer = await response.arrayBuffer();
                const base64 = Buffer.from(buffer).toString('base64');
                const mimeType = response.headers.get('content-type') || 'image/png';
                imgOptions.data = `data:${mimeType};base64,${base64}`;
            } else {
                imgOptions.data = imageData;
            }
          
            slide.addImage(imgOptions);
        } catch (e) {
            console.error('图片添加失败:', e);
            slide.addShape('rect', {
                x, y, w, h,
                fill: { color: 'FFEEEE' },
                line: { color: 'FF0000', width: 1 }
            });
            slide.addText('图片加载失败', {
                x, y, w, h,
                fontSize: 12,
                color: 'FF0000',
                align: 'center',
                valign: 'middle'
            });
        }
    }
  
    renderTable(slide, element, x, y, w, h) {
        const data = element.data || [];
        const style = element.style || {};
      
        const tableData = data.map(row => {
            return (row.cells || []).map(cell => ({
                text: cell.content || '',
                options: {
                    colspan: cell.colspan || 1,
                    rowspan: cell.rowspan || 1
                }
            }));
        });
      
        if (tableData.length === 0) return;
      
        const tableOptions = {
            x, y, w, h,
            fontFace: 'Microsoft YaHei',
            fontSize: style.font_size || 12,
            color: '333333',
            border: { 
                type: 'solid', 
                pt: 1, 
                color: (style.border_color || '#DDDDDD').replace('#', '') 
            },
            align: 'center',
            valign: 'middle'
        };
      
        if (element.structure?.has_header && data.length > 0) {
            tableOptions.firstRow = {
                fill: { color: (style.header_bg_color || '#1a73e8').replace('#', '') },
                color: (style.header_text_color || '#FFFFFF').replace('#', ''),
                bold: true
            };
        }
      
        if (style.alternate_row_color) {
            tableOptions.rowAlt = {
                fill: { color: style.alternate_row_color.replace('#', '') }
            };
        }
      
        slide.addTable(tableData, tableOptions);
    }
  
    renderShape(slide, element, x, y, w, h, style) {
        const shapeTypes = {
            'rectangle': 'rect',
            'rect': 'rect',
            'circle': 'ellipse',
            'ellipse': 'ellipse',
            'triangle': 'triangle',
            'arrow': 'rightArrow',
            'line': 'line'
        };
      
        const shapeType = shapeTypes[element.shape_type] || 'rect';
      
        const shapeOptions = {
            x, y, w, h,
            fill: { color: (style.fill_color || '#1a73e8').replace('#', '') }
        };
      
        if (style.stroke_color || style.stroke_width) {
            shapeOptions.line = {
                color: (style.stroke_color || '#000000').replace('#', ''),
                width: style.stroke_width || 1
            };
        }
      
        slide.addShape(shapeType, shapeOptions);
    }
  
    renderChart(slide, element, x, y, w, h) {
        const chartTypeMap = {
            'bar': this.pptx.ChartType.bar,
            'line': this.pptx.ChartType.line,
            'pie': this.pptx.ChartType.pie,
            'doughnut': this.pptx.ChartType.doughnut,
            'area': this.pptx.ChartType.area
        };
      
        const chartType = chartTypeMap[element.chart_type] || this.pptx.ChartType.bar;
        const data = element.data || {};
      
        const chartData = (data.datasets || []).map((ds, idx) => ({
            name: ds.label || `数据 ${idx + 1}`,
            labels: data.labels || [],
            values: ds.values || []
        }));
      
        if (chartData.length === 0) return;
      
        const chartColors = (data.datasets || []).map(ds => 
            (ds.color || '#1a73e8').replace('#', '')
        );
      
        const chartOptions = {
            x, y, w, h,
            chartColors: chartColors,
            showLegend: element.options?.show_legend !== false,
            legendPos: element.options?.legend_position === 'top' ? 't' : 'b'
        };
      
        if (element.title) {
            chartOptions.title = element.title;
            chartOptions.showTitle = true;
        }
      
        slide.addChart(chartType, chartData, chartOptions);
    }
  
    renderList(slide, element, x, y, w, h, style) {
        const items = element.items || [];
        const listType = element.list_type || 'bullet';
      
        const textItems = items.map(item => ({
            text: item.content || '',
            options: {
                bullet: listType === 'numbered' ? { type: 'number' } : { code: '2022' },
                indentLevel: item.level || 0,
                fontSize: style.font_size || 16,
                color: (style.font_color || '#333333').replace('#', ''),
                paraSpaceAfter: 6
            }
        }));
      
        slide.addText(textItems, {
            x, y, w, h,
            fontFace: 'Microsoft YaHei',
            valign: 'top'
        });
    }
}

// ===== API 路由 =====

// 生成 PPT
app.post('/api/generate-ppt', async (req, res) => {
    const taskId = uuidv4();
    const { jsonData } = req.body;
  
    if (!jsonData) {
        return res.status(400).json({ error: '缺少 JSON 数据' });
    }
  
    // 存储任务状态
    tasks.set(taskId, {
        status: 'processing',
        progress: { stage: 'starting', message: '开始处理...' },
        result: null,
        error: null
    });
  
    // 异步处理
    processTask(taskId, jsonData);
  
    res.json({ taskId, status: 'processing' });
});

// 任务状态存储
const tasks = new Map();

// 异步处理任务
async function processTask(taskId, jsonData) {
    const task = tasks.get(taskId);
  
    try {
        const generator = new PPTGenerator();
      
        const result = await generator.generate(jsonData, (progress) => {
            task.progress = progress;
        });
      
        // 保存文件到临时目录
        const filePath = path.join(TEMP_DIR, `${taskId}.pptx`);
        const buffer = Buffer.from(result.data, 'base64');
        fs.writeFileSync(filePath, buffer);
      
        task.status = 'completed';
        task.result = {
            fileName: result.fileName,
            filePath: filePath,
            downloadUrl: `/api/download/${taskId}`
        };
      
        console.log(`[Task ${taskId}] 完成`);
      
        // 10 分钟后清理
        setTimeout(() => {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            tasks.delete(taskId);
        }, 10 * 60 * 1000);
      
    } catch (error) {
        console.error(`[Task ${taskId}] 错误:`, error);
        task.status = 'error';
        task.error = error.message;
    }
}

// 查询任务状态
app.get('/api/task/:taskId', (req, res) => {
    const { taskId } = req.params;
    const task = tasks.get(taskId);
  
    if (!task) {
        return res.status(404).json({ error: '任务不存在' });
    }
  
    res.json({
        status: task.status,
        progress: task.progress,
        result: task.result,
        error: task.error
    });
});

// 下载 PPT
app.get('/api/download/:taskId', (req, res) => {
    const { taskId } = req.params;
    const task = tasks.get(taskId);
  
    if (!task || task.status !== 'completed') {
        return res.status(404).json({ error: '文件不存在' });
    }
  
    const filePath = task.result.filePath;
    const fileName = task.result.fileName;
  
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: '文件已过期' });
    }
  
    res.download(filePath, fileName);
});

// ComfyUI 状态检查
app.get('/api/comfyui/status', async (req, res) => {
    try {
        const response = await fetch(`${COMFYUI_URL}/system_stats`);
        if (response.ok) {
            const stats = await response.json();
            res.json({ status: 'online', stats });
        } else {
            res.json({ status: 'error', message: '无法连接' });
        }
    } catch (error) {
        res.json({ status: 'offline', message: error.message });
    }
});

// 工作流调试
app.get('/api/workflow/debug', (req, res) => {
    try {
        const workflow = loadWorkflow();
        res.json(workflow);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 启动服务
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════╗
║         PPT 生成器服务已启动                    ║
╠════════════════════════════════════════════════╣
║  地址: http://localhost:${PORT}                   ║
║  ComfyUI: ${COMFYUI_URL}                  ║
╚════════════════════════════════════════════════╝
    `);
});
```

---

## public/index.html

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PPT 生成器 - AI 图片增强版</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
        }

        .header {
            text-align: center;
            color: white;
            margin-bottom: 30px;
        }

        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }

        .header p {
            font-size: 1.1rem;
            opacity: 0.9;
        }

        .status-bar {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin-bottom: 20px;
        }

        .status-item {
            background: rgba(255,255,255,0.2);
            padding: 8px 16px;
            border-radius: 20px;
            color: white;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .status-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
        }

        .status-dot.online { background: #4ade80; }
        .status-dot.offline { background: #f87171; }
        .status-dot.checking { background: #fbbf24; animation: pulse 1s infinite; }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }

        .main-card {
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }

        .toolbar {
            background: #f8f9fa;
            padding: 15px 20px;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            align-items: center;
        }

        .btn {
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }

        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .btn-primary:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
        }

        .btn-secondary {
            background: #e9ecef;
            color: #495057;
        }

        .btn-secondary:hover:not(:disabled) {
            background: #dee2e6;
        }

        .btn-success {
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
            color: white;
        }

        .btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .editor-container {
            display: flex;
            height: 500px;
        }

        .editor-section {
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        .editor-section:first-child {
            border-right: 1px solid #e9ecef;
        }

        .section-header {
            background: #f8f9fa;
            padding: 12px 20px;
            font-weight: 600;
            color: #495057;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .section-header span {
            font-size: 12px;
            color: #6c757d;
            font-weight: normal;
        }

        textarea {
            flex: 1;
            border: none;
            padding: 20px;
            font-family: 'Fira Code', 'Consolas', monospace;
            font-size: 13px;
            line-height: 1.6;
            resize: none;
            outline: none;
        }

        .preview-section {
            background: #1e1e1e;
            color: #d4d4d4;
            overflow: auto;
        }

        .preview-section pre {
            padding: 20px;
            margin: 0;
            font-family: 'Fira Code', 'Consolas', monospace;
            font-size: 13px;
            line-height: 1.6;
            white-space: pre-wrap;
            word-break: break-all;
        }

        .progress-container {
            display: none;
            padding: 30px;
            text-align: center;
        }

        .progress-container.show {
            display: block;
        }

        .progress-bar-wrapper {
            background: #e9ecef;
            border-radius: 10px;
            height: 20px;
            overflow: hidden;
            margin: 20px 0;
        }

        .progress-bar {
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 10px;
            transition: width 0.3s ease;
            position: relative;
        }

        .progress-bar::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
                90deg,
                transparent,
                rgba(255,255,255,0.3),
                transparent
            );
            animation: shimmer 1.5s infinite;
        }

        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }

        .progress-text {
            font-size: 14px;
            color: #666;
            margin-top: 10px;
        }

        .progress-stage {
            font-size: 18px;
            font-weight: 600;
            color: #333;
            margin-bottom: 10px;
        }

        .result-container {
            display: none;
            padding: 40px;
            text-align: center;
        }

        .result-container.show {
            display: block;
        }

        .result-icon {
            font-size: 64px;
            margin-bottom: 20px;
        }

        .result-title {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 10px;
        }

        .result-message {
            color: #666;
            margin-bottom: 30px;
        }

        .footer-status {
            background: #f8f9fa;
            padding: 12px 20px;
            border-top: 1px solid #e9ecef;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 13px;
            color: #6c757d;
        }

        .toast {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 10px;
            color: white;
            font-weight: 500;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            transform: translateX(400px);
            transition: transform 0.3s ease;
            z-index: 1000;
        }

        .toast.show { transform: translateX(0); }
        .toast.success { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
        .toast.error { background: linear-gradient(135deg, #eb3349 0%, #f45c43 100%); }
        .toast.info { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }

        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.5);
            display: none;
            justify-content: center;
            align-items: center;
            z-index: 999;
        }

        .modal-overlay.show { display: flex; }

        .modal {
            background: white;
            border-radius: 16px;
            padding: 30px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }

        .modal h3 {
            margin-bottom: 20px;
            color: #333;
        }

        .template-list {
            display: grid;
            gap: 10px;
        }

        .template-item {
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            border: 2px solid transparent;
        }

        .template-item:hover {
            background: #e9ecef;
            border-color: #667eea;
        }

        .template-item h4 {
            font-size: 15px;
            margin-bottom: 5px;
            color: #333;
        }

        .template-item p {
            font-size: 13px;
            color: #666;
            margin: 0;
        }

        .template-item .badge {
            display: inline-block;
            background: #667eea;
            color: white;
            font-size: 11px;
            padding: 2px 8px;
            border-radius: 10px;
            margin-top: 8px;
        }

        .info-card {
            background: linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 100%);
            border-radius: 12px;
            padding: 20px;
            margin-top: 20px;
        }

        .info-card h4 {
            color: #667eea;
            margin-bottom: 10px;
            font-size: 14px;
        }

        .info-card ul {
            font-size: 13px;
            color: #555;
            padding-left: 20px;
        }

        .info-card li {
            margin-bottom: 5px;
        }

        .info-card code {
            background: rgba(102, 126, 234, 0.1);
            padding: 2px 6px;
            border-radius: 4px;
            font-family: monospace;
        }

        @media (max-width: 768px) {
            .editor-container {
                flex-direction: column;
            }
          
            .editor-section {
                min-height: 250px;
            }
          
            .editor-section:first-child {
                border-right: none;
                border-bottom: 1px solid #e9ecef;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 PPT 生成器</h1>
            <p>支持 AI 图片生成 · 粘贴 JSON 即可生成专业演示文稿</p>
        </div>

        <div class="status-bar">
            <div class="status-item">
                <div class="status-dot checking" id="comfyuiStatus"></div>
                <span>ComfyUI: <span id="comfyuiStatusText">检查中...</span></span>
            </div>
            <div class="status-item">
                <div class="status-dot online"></div>
                <span>后端服务: 在线</span>
            </div>
        </div>

        <div class="main-card">
            <div class="toolbar">
                <button class="btn btn-primary" onclick="generatePPT()" id="generateBtn">
                    <span>🚀</span> 生成 PPT
                </button>
                <button class="btn btn-secondary" onclick="validateJSON()">
                    <span>✅</span> 验证 JSON
                </button>
                <button class="btn btn-secondary" onclick="formatJSON()">
                    <span>📝</span> 格式化
                </button>
                <button class="btn btn-secondary" onclick="showTemplates()">
                    <span>📋</span> 示例模板
                </button>
                <button class="btn btn-secondary" onclick="clearEditor()">
                    <span>🗑️</span> 清空
                </button>
            </div>

            <div id="editorView">
                <div class="editor-container">
                    <div class="editor-section">
                        <div class="section-header">
                            JSON 输入
                            <span id="charCount">0 字符</span>
                        </div>
                        <textarea 
                            id="jsonInput" 
                            placeholder='粘贴 JSON 数据...

提示：图片元素使用 source: "ai_generate" 时，
系统会自动调用 ComfyUI 根据 description 生成图片。

示例:
{
  "element_type": "image",
  "content": {
    "source": "ai_generate",
    "description": "一只可爱的橘猫"
  }
}'
                            oninput="updatePreview()"
                        ></textarea>
                    </div>
                    <div class="editor-section preview-section">
                        <div class="section-header" style="background: #252526; color: #d4d4d4; border-bottom-color: #3c3c3c;">
                            解析预览
                            <span id="slideCount">0 页幻灯片 · 0 张 AI 图片</span>
                        </div>
                        <pre id="preview">等待输入 JSON 数据...</pre>
                    </div>
                </div>
            </div>

            <div class="progress-container" id="progressView">
                <div class="progress-stage" id="progressStage">准备中...</div>
                <div class="progress-bar-wrapper">
                    <div class="progress-bar" id="progressBar" style="width: 0%"></div>
                </div>
                <div class="progress-text" id="progressText">正在初始化...</div>
            </div>

            <div class="result-container" id="resultView">
                <div class="result-icon" id="resultIcon">✅</div>
                <div class="result-title" id="resultTitle">生成完成！</div>
                <div class="result-message" id="resultMessage">您的 PPT 已准备好下载</div>
                <button class="btn btn-success" id="downloadBtn" onclick="downloadPPT()">
                    <span>⬇️</span> 下载 PPT
                </button>
                <button class="btn btn-secondary" onclick="resetView()" style="margin-left: 10px;">
                    <span>🔄</span> 重新开始
                </button>
            </div>

            <div class="footer-status">
                <div>
                    <span id="statusText">准备就绪</span>
                </div>
                <div>
                    <span id="lastAction">等待操作</span>
                </div>
            </div>
        </div>

        <div class="info-card">
            <h4>💡 AI 图片生成说明</h4>
            <ul>
                <li>在图片元素中设置 <code>"source": "ai_generate"</code> 启用 AI 生成</li>
                <li>使用 <code>"description"</code> 字段描述想要生成的图片内容</li>
                <li>支持中英文描述，建议使用详细的描述以获得更好的效果</li>
                <li>确保 ComfyUI 服务已启动且状态为"在线"</li>
                <li>图片生成可能需要 10-60 秒，取决于模型和硬件</li>
            </ul>
        </div>
    </div>

    <div class="toast" id="toast"></div>

    <div class="modal-overlay" id="templateModal">
        <div class="modal">
            <h3>📋 选择示例模板</h3>
            <div class="template-list">
                <div class="template-item" onclick="loadTemplate('simple')">
                    <h4>简单文本模板</h4>
                    <p>包含标题和文本内容的基础模板</p>
                </div>
                <div class="template-item" onclick="loadTemplate('withImage')">
                    <h4>AI 图片模板</h4>
                    <p>包含 AI 生成图片的演示模板</p>
                    <span class="badge">🤖 AI 图片</span>
                </div>
                <div class="template-item" onclick="loadTemplate('report')">
                    <h4>数据报告模板</h4>
                    <p>包含表格、图表和 AI 图片的完整报告</p>
                    <span class="badge">🤖 AI 图片</span>
                </div>
                <div class="template-item" onclick="loadTemplate('chart')">
                    <h4>图表展示模板</h4>
                    <p>多种图表类型的数据可视化模板</p>
                </div>
            </div>
            <div style="text-align: right; margin-top: 20px;">
                <button class="btn btn-secondary" onclick="closeModal()">关闭</button>
            </div>
        </div>
    </div>

    <script>
        // ===== 模板数据 =====
        const templates = {
            simple: {
                presentation: {
                    title: "简单演示",
                    slides: [{
                        slide_id: 1,
                        elements: [
                            {
                                element_type: "text",
                                position: { x: 0.5, y: 2, width: 9, height: 1.5 },
                                content: "欢迎使用 PPT 生成器",
                                style: { font_size: 44, font_weight: "bold", color: "#1a73e8", text_align: "center" }
                            },
                            {
                                element_type: "text",
                                position: { x: 0.5, y: 3.5, width: 9, height: 0.8 },
                                content: "快速将 JSON 转换为专业演示文稿",
                                style: { font_size: 24, color: "#666666", text_align: "center" }
                            }
                        ]
                    }]
                }
            },

            withImage: {
                presentation: {
                    title: "AI 图片演示",
                    slides: [
                        {
                            slide_id: 1,
                            background: { type: "color", value: "#1a73e8" },
                            elements: [
                                {
                                    element_type: "text",
                                    position: { x: 0.5, y: 2.2, width: 9, height: 1 },
                                    content: "AI 图片生成演示",
                                    style: { font_size: 48, font_weight: "bold", color: "#ffffff", text_align: "center" }
                                }
                            ]
                        },
                        {
                            slide_id: 2,
                            elements: [
                                {
                                    element_type: "text",
                                    position: { x: 0.5, y: 0.3, width: 9, height: 0.6 },
                                    content: "自动生成的 AI 图片",
                                    style: { font_size: 32, font_weight: "bold", color: "#333" }
                                },
                                {
                                    element_type: "image",
                                    element_id: "ai_image_1",
                                    position: { x: 0.5, y: 1.2, width: 4.5, height: 3.5 },
                                    content: {
                                        source: "ai_generate",
                                        description: "A cute orange cat sitting on a windowsill, soft natural lighting, photorealistic, high quality",
                                        alt_text: "可爱的橘猫"
                                    }
                                },
                                {
                                    element_type: "list",
                                    position: { x: 5.3, y: 1.2, width: 4.2, height: 3.5 },
                                    list_type: "bullet",
                                    items: [
                                        { level: 0, content: "自动调用 ComfyUI 生成" },
                                        { level: 0, content: "支持详细的文字描述" },
                                        { level: 0, content: "无缝嵌入 PPT 中" },
                                        { level: 0, content: "支持多张图片生成" }
                                    ],
                                    style: { font_size: 18, bullet_color: "#1a73e8" }
                                }
                            ]
                        }
                    ]
                }
            },

            report: {
                presentation: {
                    title: "2024年度报告",
                    author: "数据分析团队",
                    slides: [
                        {
                            slide_id: 1,
                            background: { type: "color", value: "#1a73e8" },
                            elements: [
                                {
                                    element_type: "text",
                                    position: { x: 0.5, y: 2, width: 9, height: 1.2 },
                                    content: "2024 年度数据报告",
                                    style: { font_size: 48, font_weight: "bold", color: "#ffffff", text_align: "center" }
                                },
                                {
                                    element_type: "text",
                                    position: { x: 0.5, y: 3.5, width: 9, height: 0.6 },
                                    content: "数据分析团队 | 2024年12月",
                                    style: { font_size: 20, color: "#ffffff", text_align: "center" }
                                }
                            ]
                        },
                        {
                            slide_id: 2,
                            elements: [
                                {
                                    element_type: "text",
                                    position: { x: 0.5, y: 0.3, width: 9, height: 0.6 },
                                    content: "业绩概览",
                                    style: { font_size: 32, font_weight: "bold", color: "#1a73e8" }
                                },
                                {
                                    element_type: "image",
                                    element_id: "growth_chart_img",
                                    position: { x: 5.2, y: 1, width: 4.3, height: 3 },
                                    content: {
                                        source: "ai_generate",
                                        description: "Business growth chart with upward trend, blue and green colors, modern minimalist style, professional corporate infographic",
                                        alt_text: "增长趋势图"
                                    }
                                },
                                {
                                    element_type: "table",
                                    position: { x: 0.5, y: 1, width: 4.5, height: 2 },
                                    structure: { rows: 4, columns: 3, has_header: true },
                                    style: { header_bg_color: "#1a73e8", header_text_color: "#ffffff" },
                                    data: [
                                        { row: 0, is_header: true, cells: [
                                            { col: 0, content: "指标" },
                                            { col: 1, content: "数值" },
                                            { col: 2, content: "增长" }
                                        ]},
                                        { row: 1, cells: [
                                            { col: 0, content: "总营收" },
                                            { col: 1, content: "¥1,250万" },
                                            { col: 2, content: "+28%" }
                                        ]},
                                        { row: 2, cells: [
                                            { col: 0, content: "用户数" },
                                            { col: 1, content: "52,000" },
                                            { col: 2, content: "+45%" }
                                        ]},
                                        { row: 3, cells: [
                                            { col: 0, content: "满意度" },
                                            { col: 1, content: "96%" },
                                            { col: 2, content: "+8%" }
                                        ]}
                                    ]
                                },
                                {
                                    element_type: "chart",
                                    position: { x: 0.5, y: 3.2, width: 9, height: 2.2 },
                                    chart_type: "bar",
                                    data: {
                                        labels: ["Q1", "Q2", "Q3", "Q4"],
                                        datasets: [
                                            { label: "2023", values: [200, 250, 280, 310], color: "#90caf9" },
                                            { label: "2024", values: [280, 340, 390, 450], color: "#1a73e8" }
                                        ]
                                    },
                                    options: { show_legend: true }
                                }
                            ]
                        },
                        {
                            slide_id: 3,
                            elements: [
                                {
                                    element_type: "text",
                                    position: { x: 0.5, y: 0.3, width: 9, height: 0.6 },
                                    content: "产品展示",
                                    style: { font_size: 32, font_weight: "bold", color: "#1a73e8" }
                                },
                                {
                                    element_type: "image",
                                    element_id: "product_img_1",
                                    position: { x: 0.5, y: 1.1, width: 2.8, height: 2.2 },
                                    content: {
                                        source: "ai_generate",
                                        description: "Modern smartphone with colorful screen display, floating in air with soft shadow, clean white background, product photography style",
                                        alt_text: "智能手机"
                                    }
                                },
                                {
                                    element_type: "image",
                                    element_id: "product_img_2",
                                    position: { x: 3.6, y: 1.1, width: 2.8, height: 2.2 },
                                    content: {
                                        source: "ai_generate",
                                        description: "Sleek laptop computer with thin bezels, open at angle showing screen, minimalist studio lighting, professional product shot",
                                        alt_text: "笔记本电脑"
                                    }
                                },
                                {
                                    element_type: "image",
                                    element_id: "product_img_3",
                                    position: { x: 6.7, y: 1.1, width: 2.8, height: 2.2 },
                                    content: {
                                        source: "ai_generate",
                                        description: "Modern wireless earbuds in charging case, premium design, soft studio lighting, clean product photography",
                                        alt_text: "无线耳机"
                                    }
                                },
                                {
                                    element_type: "text",
                                    position: { x: 0.5, y: 3.5, width: 9, height: 0.6 },
                                    content: "我们的产品线涵盖智能手机、笔记本电脑和智能穿戴设备",
                                    style: { font_size: 18, color: "#666", text_align: "center" }
                                }
                            ]
                        },
                        {
                            slide_id: 4,
                            background: { type: "color", value: "#1a73e8" },
                            elements: [
                                {
                                    element_type: "text",
                                    position: { x: 0.5, y: 2.2, width: 9, height: 1 },
                                    content: "感谢您的关注",
                                    style: { font_size: 48, font_weight: "bold", color: "#ffffff", text_align: "center" }
                                },
                                {
                                    element_type: "text",
                                    position: { x: 0.5, y: 3.5, width: 9, height: 0.5 },
                                    content: "期待与您合作共创未来",
                                    style: { font_size: 20, color: "#ffffff", text_align: "center" }
                                }
                            ]
                        }
                    ]
                }
            },

            chart: {
                presentation: {
                    title: "数据可视化",
                    slides: [{
                        slide_id: 1,
                        elements: [
                            {
                                element_type: "text",
                                position: { x: 0.5, y: 0.3, width: 9, height: 0.6 },
                                content: "销售数据分析",
                                style: { font_size: 28, font_weight: "bold", color: "#333" }
                            },
                            {
                                element_type: "chart",
                                position: { x: 0.3, y: 1, width: 4.5, height: 3 },
                                chart_type: "bar",
                                title: "季度对比",
                                data: {
                                    labels: ["Q1", "Q2", "Q3", "Q4"],
                                    datasets: [
                                        { label: "销售额", values: [120, 150, 180, 220], color: "#1a73e8" }
                                    ]
                                }
                            },
                            {
                                element_type: "chart",
                                position: { x: 5, y: 1, width: 4.5, height: 3 },
                                chart_type: "pie",
                                title: "市场份额",
                                data: {
                                    labels: ["产品A", "产品B", "产品C", "其他"],
                                    datasets: [{ values: [35, 28, 22, 15] }]
                                }
                            },
                            {
                                element_type: "chart",
                                position: { x: 0.3, y: 4.2, width: 9.2, height: 2 },
                                chart_type: "line",
                                title: "增长趋势",
                                data: {
                                    labels: ["1月", "2月", "3月", "4月", "5月", "6月"],
                                    datasets: [
                                        { label: "用户增长", values: [100, 150, 200, 280, 350, 450], color: "#34a853" }
                                    ]
                                }
                            }
                        ]
                    }]
                }
            }
        };

        // ===== 状态变量 =====
        let currentTaskId = null;
        let downloadUrl = null;
        let pollingInterval = null;

        // ===== 初始化 =====
        document.addEventListener('DOMContentLoaded', () => {
            checkComfyUIStatus();
            setInterval(checkComfyUIStatus, 30000);
        });

        // ===== ComfyUI 状态检查 =====
        async function checkComfyUIStatus() {
            const dot = document.getElementById('comfyuiStatus');
            const text = document.getElementById('comfyuiStatusText');
          
            dot.className = 'status-dot checking';
            text.textContent = '检查中...';
          
            try {
                const res = await fetch('/api/comfyui/status');
                const data = await res.json();
              
                if (data.status === 'online') {
                    dot.className = 'status-dot online';
                    text.textContent = '在线';
                } else {
                    dot.className = 'status-dot offline';
                    text.textContent = '离线';
                }
            } catch (e) {
                dot.className = 'status-dot offline';
                text.textContent = '无法连接';
            }
        }

        // ===== 工具函数 =====
        function showToast(message, type = 'info') {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.className = `toast ${type} show`;
            setTimeout(() => toast.classList.remove('show'), 3000);
        }

        function updatePreview() {
            const input = document.getElementById('jsonInput');
            const preview = document.getElementById('preview');
            const charCount = document.getElementById('charCount');
            const slideCount = document.getElementById('slideCount');

            charCount.textContent = `${input.value.length} 字符`;

            if (!input.value.trim()) {
                preview.textContent = '等待输入 JSON 数据...';
                slideCount.textContent = '0 页幻灯片 · 0 张 AI 图片';
                return;
            }

            try {
                const data = JSON.parse(input.value);
                preview.innerHTML = syntaxHighlight(JSON.stringify(data, null, 2));
              
                const slides = data.presentation?.slides || data.slides || [];
              
                // 统计 AI 图片数量
                let aiImageCount = 0;
                slides.forEach(slide => {
                    (slide.elements || []).forEach(el => {
                        if (el.element_type === 'image') {
                            const content = el.content || {};
                            if (content.source === 'ai_generate' || (!content.value && content.description)) {
                                aiImageCount++;
                            }
                        }
                    });
                });
              
                slideCount.textContent = `${slides.length} 页幻灯片 · ${aiImageCount} 张 AI 图片`;
            } catch (e) {
                preview.textContent = `解析错误: ${e.message}`;
                slideCount.textContent = '解析失败';
            }
        }

        function syntaxHighlight(json) {
            json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                let cls = 'color: #b5cea8;';
                if (/^"/.test(match)) {
                    if (/:$/.test(match)) {
                        cls = 'color: #9cdcfe;';
                    } else {
                        cls = 'color: #ce9178;';
                    }
                } else if (/true|false/.test(match)) {
                    cls = 'color: #569cd6;';
                } else if (/null/.test(match)) {
                    cls = 'color: #569cd6;';
                }
                return '<span style="' + cls + '">' + match + '</span>';
            });
        }

        // ===== 按钮功能 =====
        function validateJSON() {
            const input = document.getElementById('jsonInput').value;
            if (!input.trim()) {
                showToast('请先输入 JSON 数据', 'error');
                return false;
            }
            try {
                const data = JSON.parse(input);
                if (!data.presentation && !data.slides) {
                    showToast('JSON 有效，但缺少 presentation 或 slides 字段', 'error');
                    return false;
                }
                showToast('JSON 格式验证通过！', 'success');
                return true;
            } catch (e) {
                showToast(`JSON 格式错误: ${e.message}`, 'error');
                return false;
            }
        }

        function formatJSON() {
            const input = document.getElementById('jsonInput');
            try {
                const data = JSON.parse(input.value);
                input.value = JSON.stringify(data, null, 2);
                updatePreview();
                showToast('格式化完成', 'success');
            } catch (e) {
                showToast('JSON 格式错误，无法格式化', 'error');
            }
        }

        function clearEditor() {
            document.getElementById('jsonInput').value = '';
            updatePreview();
            showToast('已清空', 'info');
        }

        function showTemplates() {
            document.getElementById('templateModal').classList.add('show');
        }

        function closeModal() {
            document.getElementById('templateModal').classList.remove('show');
        }

        function loadTemplate(name) {
            const template = templates[name];
            if (template) {
                document.getElementById('jsonInput').value = JSON.stringify(template, null, 2);
                updatePreview();
                closeModal();
                showToast('模板加载成功', 'success');
            }
        }

        // ===== 视图切换 =====
        function showView(viewName) {
            document.getElementById('editorView').style.display = viewName === 'editor' ? 'block' : 'none';
            document.getElementById('progressView').classList.toggle('show', viewName === 'progress');
            document.getElementById('resultView').classList.toggle('show', viewName === 'result');
        }

        function resetView() {
            showView('editor');
            document.getElementById('generateBtn').disabled = false;
        }

        // ===== PPT 生成 =====
        async function generatePPT() {
            if (!validateJSON()) return;

            const jsonData = JSON.parse(document.getElementById('jsonInput').value);
          
            // 检查是否有 AI 图片
            const slides = jsonData.presentation?.slides || jsonData.slides || [];
            let hasAIImages = false;
            slides.forEach(slide => {
                (slide.elements || []).forEach(el => {
                    if (el.element_type === 'image') {
                        const content = el.content || {};
                        if (content.source === 'ai_generate' || (!content.value && content.description)) {
                            hasAIImages = true;
                        }
                    }
                });
            });

            // 如果有 AI 图片，检查 ComfyUI 状态
            if (hasAIImages) {
                const statusDot = document.getElementById('comfyuiStatus');
                if (!statusDot.classList.contains('online')) {
                    showToast('ComfyUI 未连接，无法生成 AI 图片', 'error');
                    return;
                }
            }

            document.getElementById('generateBtn').disabled = true;
            showView('progress');
            updateProgress('starting', '正在提交任务...', 0);

            try {
                // 提交任务
                const response = await fetch('/api/generate-ppt', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ jsonData })
                });

                const result = await response.json();

                if (result.error) {
                    throw new Error(result.error);
                }

                currentTaskId = result.taskId;
              
                // 开始轮询状态
                startPolling();

            } catch (error) {
                showError(error.message);
            }
        }

        function startPolling() {
            if (pollingInterval) clearInterval(pollingInterval);
          
            pollingInterval = setInterval(async () => {
                try {
                    const res = await fetch(`/api/task/${currentTaskId}`);
                    const task = await res.json();

                    if (task.status === 'completed') {
                        clearInterval(pollingInterval);
                        downloadUrl = task.result.downloadUrl;
                        showSuccess(task.result.fileName);
                    } else if (task.status === 'error') {
                        clearInterval(pollingInterval);
                        showError(task.error);
                    } else {
                        // 更新进度
                        const progress = task.progress || {};
                        let percent = 0;
                      
                        if (progress.stage === 'generating_images') {
                            percent = 10 + (progress.current / progress.total) * 60;
                        } else if (progress.stage === 'rendering_slides') {
                            percent = 70 + (progress.current / progress.total) * 20;
                        } else if (progress.stage === 'finalizing') {
                            percent = 95;
                        }
                      
                        updateProgress(progress.stage, progress.message, percent);
                    }
                } catch (e) {
                    console.error('轮询错误:', e);
                }
            }, 1000);
        }

        function updateProgress(stage, message, percent) {
            const stageNames = {
                'starting': '🚀 开始处理',
                'generating_images': '🎨 生成 AI 图片',
                'rendering_slides': '📄 渲染幻灯片',
                'finalizing': '📦 生成文件'
            };

            document.getElementById('progressStage').textContent = stageNames[stage] || stage;
            document.getElementById('progressText').textContent = message || '';
            document.getElementById('progressBar').style.width = `${Math.min(percent, 100)}%`;
        }

        function showSuccess(fileName) {
            showView('result');
            document.getElementById('resultIcon').textContent = '✅';
            document.getElementById('resultTitle').textContent = '生成完成！';
            document.getElementById('resultMessage').textContent = `文件: ${fileName}`;
            document.getElementById('downloadBtn').style.display = 'inline-flex';
            document.getElementById('statusText').textContent = '生成完成';
            document.getElementById('lastAction').textContent = `完成时间: ${new Date().toLocaleTimeString()}`;
            showToast('PPT 生成成功！', 'success');
        }

        function showError(message) {
            showView('result');
            document.getElementById('resultIcon').textContent = '❌';
            document.getElementById('resultTitle').textContent = '生成失败';
            document.getElementById('resultMessage').textContent = message;
            document.getElementById('downloadBtn').style.display = 'none';
            document.getElementById('generateBtn').disabled = false;
            showToast(`生成失败: ${message}`, 'error');
        }

        function downloadPPT() {
            if (downloadUrl) {
                window.location.href = downloadUrl;
                showToast('开始下载...', 'success');
            }
        }

        // ===== 事件监听 =====
        document.getElementById('templateModal').addEventListener('click', function(e) {
            if (e.target === this) closeModal();
        });

        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'Enter') {
                generatePPT();
            }
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    </script>
</body>
</html>
```

---

## package.json

```json
{
  "name": "ppt-generator",
  "version": "1.0.0",
  "description": "PPT Generator with AI Image Generation",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "pptxgenjs": "^3.12.0",
    "uuid": "^9.0.0"
  }
}
```

---

## workflow_api.json (示例)

请从 ComfyUI 导出你自己的工作流，以下是一个参考结构：

```json
{
  "3": {
    "class_type": "KSampler",
    "inputs": {
      "seed": 12345,
      "steps": 20,
      "cfg": 7,
      "sampler_name": "euler",
      "scheduler": "normal",
      "denoise": 1,
      "model": ["4", 0],
      "positive": ["6", 0],
      "negative": ["7", 0],
      "latent_image": ["5", 0]
    }
  },
  "4": {
    "class_type": "CheckpointLoaderSimple",
    "inputs": {
      "ckpt_name": "你的模型.safetensors"
    }
  },
  "5": {
    "class_type": "EmptyLatentImage",
    "inputs": {
      "width": 512,
      "height": 512,
      "batch_size": 1
    }
  },
  "6": {
    "class_type": "CLIPTextEncode",
    "inputs": {
      "text": "positive prompt",
      "clip": ["4", 1]
    }
  },
  "7": {
    "class_type": "CLIPTextEncode",
    "inputs": {
      "text": "negative prompt",
      "clip": ["4", 1]
    }
  },
  "8": {
    "class_type": "VAEDecode",
    "inputs": {
      "samples": ["3", 0],
      "vae": ["4", 2]
    }
  },
  "9": {
    "class_type": "SaveImage",
    "inputs": {
      "filename_prefix": "ComfyUI",
      "images": ["8", 0]
    }
  }
}
```

---

## 功能说明

### 1. AI 图片自动生成

在 JSON 中的图片元素设置 `source: "ai_generate"`，系统会自动：
- 提取 `description` 字段作为提示词
- 调用 ComfyUI 生成图片
- 将生成的图片嵌入 PPT

### 2. 异步任务处理

- 提交任务后返回 `taskId`
- 前端轮询获取任务状态
- 支持实时进度显示

### 3. 完整元素支持

- 文本 (text)
- 图片 (image) - 支持 URL、Base64、AI 生成
- 表格 (table)
- 图表 (chart)
- 形状 (shape)
- 列表 (list)
