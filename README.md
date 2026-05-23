# DeskMind

「AI 看穿你的桌面」的可交互原型。用户上传或拍摄桌面照片，选择视觉线索后，系统生成桌面人格报告、行为推理、效率/健康指标和改造方案。

## 当前版本

- 静态 Web 应用，无需安装依赖。
- 支持桌面照片预览、移动端拍摄入口、桌面线索选择。
- 生成「桌面人格」、AI 锐评、Scene Graph、行为推理、改造方案、购买清单。
- 支持复制报告和导出分享卡。
- 默认使用本地启发式 Agent 逻辑，后续可接入真实 VLM。

## 本地运行

直接用浏览器打开 `index.html` 即可。

如果想通过本地服务预览，可以在项目目录运行：

```bash
python -m http.server 8080
```

然后打开 `http://localhost:8080`。

## 技术结构

```text
Camera / Upload
  -> VLM Signals (prototype: manual scene clues)
  -> Scene Graph
  -> Agent Planner
  -> Persona Report + Advice
  -> Share Card
```

## 后续方向

- 接入 OpenAI 视觉模型，自动识别咖啡、药品、多屏、课程书、零食、外卖、烟、水杯、灯光、垃圾等桌面物体。
- 把物体关系转成可查询的 Scene Graph。
- 增加连续对话，让用户追问「怎么改造」「先买什么」「怎么安排学习节奏」。
- 增加 TTS 语音点评和短视频分享模板。
