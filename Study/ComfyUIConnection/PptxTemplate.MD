# PPT 结构化 JSON 模板定义

## 完整模板结构

```json
{
  "presentation": {
    "title": "演示文稿标题",
    "author": "作者",
    "created_date": "2024-01-01",
    "theme": {
      "primary_color": "#1a73e8",
      "secondary_color": "#ffffff",
      "font_family": "微软雅黑"
    },
    "slides": [
      {
        "slide_id": 1,
        "slide_type": "title_slide | content_slide | section_slide",
        "background": {
          "type": "color | image | gradient",
          "value": "#ffffff"
        },
        "elements": []
      }
    ]
  }
}
```

---

## 元素类型定义

### 1. 文本元素 (text)

```json
{
  "element_type": "text",
  "element_id": "text_001",
  "position": {
    "x": 100,
    "y": 50,
    "width": 800,
    "height": 100,
    "unit": "px",
    "z_index": 1
  },
  "content": "这是文本内容",
  "style": {
    "font_family": "微软雅黑",
    "font_size": 24,
    "font_weight": "normal | bold",
    "font_style": "normal | italic",
    "color": "#333333",
    "text_align": "left | center | right | justify",
    "line_height": 1.5,
    "text_decoration": "none | underline | line-through"
  },
  "animation": {
    "type": "fade_in | slide_in | zoom_in | none",
    "duration": 0.5,
    "delay": 0
  }
}
```

### 2. 图片元素 (image)

```json
{
  "element_type": "image",
  "element_id": "image_001",
  "position": {
    "x": 500,
    "y": 200,
    "width": 400,
    "height": 300,
    "unit": "px",
    "z_index": 2
  },
  "content": {
    "source": "url | base64 | file_path | ai_generate",
    "value": "https://example.com/image.png",
    "alt_text": "图片描述文字",
    "description": "详细描述：这张图片展示的内容"
  },
  "style": {
    "border_radius": 8,
    "border": {
      "width": 0,
      "color": "#000000",
      "style": "solid"
    },
    "opacity": 1,
    "shadow": {
      "enabled": false,
      "offset_x": 2,
      "offset_y": 2,
      "blur": 4,
      "color": "rgba(0,0,0,0.3)"
    }
  },
  "animation": {
    "type": "fade_in | slide_in | zoom_in | none",
    "duration": 0.5,
    "delay": 0
  }
}
```

### 3. 表格元素 (table)

```json
{
  "element_type": "table",
  "element_id": "table_001",
  "position": {
    "x": 100,
    "y": 200,
    "width": 800,
    "height": 400,
    "unit": "px",
    "z_index": 1
  },
  "structure": {
    "rows": 4,
    "columns": 3,
    "has_header": true
  },
  "style": {
    "border_color": "#dddddd",
    "border_width": 1,
    "header_bg_color": "#1a73e8",
    "header_text_color": "#ffffff",
    "row_bg_color": "#ffffff",
    "alternate_row_color": "#f5f5f5",
    "cell_padding": 10,
    "font_size": 14
  },
  "data": [
    {
      "row": 0,
      "is_header": true,
      "cells": [
        {"col": 0, "content": "列标题1", "colspan": 1, "rowspan": 1},
        {"col": 1, "content": "列标题2", "colspan": 1, "rowspan": 1},
        {"col": 2, "content": "列标题3", "colspan": 1, "rowspan": 1}
      ]
    },
    {
      "row": 1,
      "is_header": false,
      "cells": [
        {"col": 0, "content": "数据1-1", "colspan": 1, "rowspan": 1},
        {"col": 1, "content": "数据1-2", "colspan": 1, "rowspan": 1},
        {"col": 2, "content": "数据1-3", "colspan": 1, "rowspan": 1}
      ]
    }
  ],
  "animation": {
    "type": "fade_in | none",
    "duration": 0.5,
    "delay": 0
  }
}
```

### 4. 形状元素 (shape)

```json
{
  "element_type": "shape",
  "element_id": "shape_001",
  "position": {
    "x": 100,
    "y": 100,
    "width": 200,
    "height": 200,
    "unit": "px",
    "z_index": 0,
    "rotation": 0
  },
  "shape_type": "rectangle | circle | triangle | arrow | line | custom",
  "style": {
    "fill_color": "#1a73e8",
    "stroke_color": "#000000",
    "stroke_width": 2,
    "opacity": 1,
    "border_radius": 0
  },
  "text_overlay": {
    "enabled": false,
    "content": "",
    "style": {}
  }
}
```

### 5. 图表元素 (chart)

```json
{
  "element_type": "chart",
  "element_id": "chart_001",
  "position": {
    "x": 100,
    "y": 150,
    "width": 600,
    "height": 400,
    "unit": "px",
    "z_index": 1
  },
  "chart_type": "bar | line | pie | doughnut | scatter | area",
  "title": "图表标题",
  "data": {
    "labels": ["一月", "二月", "三月", "四月"],
    "datasets": [
      {
        "label": "销售额",
        "values": [100, 200, 150, 300],
        "color": "#1a73e8"
      },
      {
        "label": "利润",
        "values": [50, 80, 60, 120],
        "color": "#34a853"
      }
    ]
  },
  "options": {
    "show_legend": true,
    "legend_position": "bottom | top | left | right",
    "show_grid": true,
    "show_values": false
  }
}
```

### 6. 列表元素 (list)

```json
{
  "element_type": "list",
  "element_id": "list_001",
  "position": {
    "x": 100,
    "y": 200,
    "width": 500,
    "height": 300,
    "unit": "px",
    "z_index": 1
  },
  "list_type": "bullet | numbered | checkbox",
  "items": [
    {
      "level": 0,
      "content": "第一级项目",
      "checked": false
    },
    {
      "level": 1,
      "content": "第二级子项目",
      "checked": false
    }
  ],
  "style": {
    "font_size": 18,
    "font_color": "#333333",
    "bullet_color": "#1a73e8",
    "line_spacing": 1.8,
    "indent": 30
  }
}
```

---

## 完整示例：一页完整的幻灯片

```json
{
  "presentation": {
    "title": "2024年度销售报告",
    "author": "张三",
    "created_date": "2024-01-15",
    "theme": {
      "primary_color": "#1a73e8",
      "secondary_color": "#ffffff",
      "font_family": "微软雅黑"
    },
    "slides": [
      {
        "slide_id": 1,
        "slide_type": "content_slide",
        "background": {
          "type": "color",
          "value": "#ffffff"
        },
        "elements": [
          {
            "element_type": "text",
            "element_id": "title_001",
            "position": {"x": 50, "y": 30, "width": 900, "height": 60, "unit": "px", "z_index": 1},
            "content": "第一季度销售数据分析",
            "style": {
              "font_family": "微软雅黑",
              "font_size": 36,
              "font_weight": "bold",
              "color": "#1a73e8",
              "text_align": "left"
            }
          },
          {
            "element_type": "image",
            "element_id": "image_001",
            "position": {"x": 550, "y": 120, "width": 400, "height": 250, "unit": "px", "z_index": 2},
            "content": {
              "source": "ai_generate",
              "value": "",
              "alt_text": "销售增长趋势图",
              "description": "一张展示销售额上升趋势的商业图表，蓝色主色调，现代简约风格"
            }
          },
          {
            "element_type": "table",
            "element_id": "table_001",
            "position": {"x": 50, "y": 120, "width": 450, "height": 200, "unit": "px", "z_index": 1},
            "structure": {"rows": 4, "columns": 3, "has_header": true},
            "style": {
              "border_color": "#dddddd",
              "header_bg_color": "#1a73e8",
              "header_text_color": "#ffffff",
              "font_size": 14
            },
            "data": [
              {"row": 0, "is_header": true, "cells": [
                {"col": 0, "content": "月份"},
                {"col": 1, "content": "销售额"},
                {"col": 2, "content": "同比增长"}
              ]},
              {"row": 1, "cells": [
                {"col": 0, "content": "1月"},
                {"col": 1, "content": "¥120万"},
                {"col": 2, "content": "+15%"}
              ]},
              {"row": 2, "cells": [
                {"col": 0, "content": "2月"},
                {"col": 1, "content": "¥135万"},
                {"col": 2, "content": "+22%"}
              ]},
              {"row": 3, "cells": [
                {"col": 0, "content": "3月"},
                {"col": 1, "content": "¥158万"},
                {"col": 2, "content": "+28%"}
              ]}
            ]
          },
          {
            "element_type": "list",
            "element_id": "list_001",
            "position": {"x": 50, "y": 350, "width": 450, "height": 150, "unit": "px", "z_index": 1},
            "list_type": "bullet",
            "items": [
              {"level": 0, "content": "整体销售额同比增长21.6%"},
              {"level": 0, "content": "新客户贡献率达到35%"},
              {"level": 1, "content": "线上渠道增长最为显著"}
            ],
            "style": {"font_size": 16, "bullet_color": "#1a73e8"}
          }
        ]
      }
    ]
  }
}
```

---

## 使用说明

当你需要我生成PPT内容时，请告诉我：

1. **主题/标题** - 演示文稿的主题
2. **页数** - 需要多少页幻灯片
3. **内容要点** - 每页大概需要什么内容
4. **风格偏好** - 商务/简约/创意等

我会按照这个JSON格式返回完整的结构化数据，你可以直接用于程序解析生成PPT。

---

**确认这个模板是否满足你的需求？或者需要我增加/修改某些字段？**
