# DeskMind — AI 看穿你的桌面

> 拍张桌面照片，AI 秒出人格报告 + 改造方案。极强传播型项目。

## 快速启动

### 1. 安装依赖

```bash
pip install -r requirements.txt
```

### 2. 配置 API Key

```bash
# 复制模板
copy .env.example .env
```

打开 `.env`，填入你的 API Key：

```env
# 豆包 / 火山方舟（推荐）
API_KEY=ark-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
MODEL=doubao-seed-2-0-lite-260428
API_BASE=https://ark.cn-beijing.volces.com/api/v3

# 或通义千问 VL
# API_KEY=sk-xxx
# MODEL=qwen-vl-max
# API_BASE=https://dashscope.aliyuncs.com/compatible-mode/v1
```

> 也可以不配置 `.env`，启动后在网页右上角「API 配置」按钮中填写。

### 3. 启动服务

```bash
python server.py
```

浏览器打开 **http://localhost:8000**

---

## 使用流程

```
1. 拍桌面照片 / 上传图片
2. 选择点评口吻（毒舌 / 温柔 / 教练）
3. 选择分析目标（学习 / 工作 / 作息）
4. 点击「生成桌面人格报告」
5. AI 自动分析 → 生成人格类型 + 改造方案
6. 导出分享卡，发朋友圈 / 小红书
```

---

## 支持的 VLM 接口

| 接口 | 协议 | 模型推荐 | API Base |
|------|------|----------|----------|
| **豆包 / 火山方舟** | ARK Responses API | `doubao-seed-2-0-lite-260428` | `https://ark.cn-beijing.volces.com/api/v3` |
| 通义千问（DashScope） | OpenAI Chat Completions | `qwen-vl-max` | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| OpenAI | OpenAI Chat Completions | `gpt-4o` | `https://api.openai.com/v1` |
| 其他 OpenAI 兼容接口 | OpenAI Chat Completions | 按文档填写 | 按文档填写 |

> 豆包使用火山方舟 `/v3/responses` 格式（`input_image` + `input_text`），后端自动识别并切换请求格式，无需手动配置。

---

## 技术架构

```
用户上传桌面照片
       ↓
FastAPI 后端 (server.py)
       ↓
VLM API（Qwen2.5-VL / GPT-4o）
       ↓
结构化 JSON（persona + scores + scene + advice）
       ↓
前端渲染人格报告 + 分享卡导出
```

### 分析维度

- **Scene Graph**：目标检测 + 空间关系理解
- **行为推理**：熬夜概率 / 压力指数 / 专注度 / 健康风险
- **人格类型**：DDL燃烧流 / 科研战士 / 极简效率流 / 二次元逃避型…
- **改造方案**：灯光 / 收纳 / 学习节奏 / 健康提醒
- **购买清单**：自动生成桌面改造所需物品

### 降级模式

未上传图片或未配置 API 时，自动切换到**本地分析模式**（通过桌面线索勾选计算），完整体验不中断。

---

## 文件结构

```
DeskMind/
├── server.py          # FastAPI 后端，代理 VLM API 调用
├── index.html         # 单页应用入口
├── script.js          # 前端逻辑（API 调用 + 本地分析 + 导出）
├── styles.css         # 样式
├── assets/            # 静态资源（默认桌面样片等）
├── requirements.txt   # Python 依赖
├── .env.example       # 环境变量模板
└── .env               # 你的本地配置（不提交 git）
```

---

## 传播玩法建议

- **小红书**：「AI 说我是凌晨型DDL战士哈哈哈哈」配截图
- **朋友圈**：导出分享卡，一键发布
- **群聊**：「来测测你的桌面人格」互动话题
- **B站**：桌面改造前后对比视频
