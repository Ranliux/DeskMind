import os
import json
import re
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional
import httpx
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="DeskMind API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ARK_HOSTS = ("volces.com", "ark.cn-beijing")


def is_ark_api(api_base: str) -> bool:
    return any(h in api_base for h in ARK_HOSTS)


def extract_ark_text(result: dict) -> str:
    """Extract text content from ARK Responses API response."""
    for item in result.get("output", []):
        if item.get("type") == "message":
            for part in item.get("content", []):
                if part.get("type") == "output_text":
                    return part.get("text", "")
    # Fallback: try top-level output_text
    return result.get("output_text", "")


SYSTEM_PROMPT = """你是 DeskMind，一个专业的桌面人格分析 AI。
你会分析用户桌面照片，识别物品、推理行为模式，生成人格报告和改造建议。

你必须只返回一个严格的 JSON 对象，不要有任何其他文字、代码块标记或解释：

{
  "persona": {
    "badge": "简短标签（4-8字，如：DDL燃烧流）",
    "title": "人格标题（8-15字，如：凌晨型DDL战士）",
    "roast": "AI犀利点评（30-80字，根据指定口吻调整语气）"
  },
  "scores": {
    "focus": 0到100的整数,
    "stress": 0到100的整数,
    "health": 0到100的整数
  },
  "scene": ["场景观察1（描述看到的物品及空间关系）", "场景观察2", "场景观察3", "场景观察4", "场景观察5"],
  "behavior": ["行为模式推理1", "行为模式推理2", "行为模式推理3", "行为模式推理4"],
  "advice": ["具体改造建议1", "具体改造建议2", "具体改造建议3", "具体改造建议4", "具体改造建议5"],
  "shopping": ["推荐购买物品1（简短品类名）", "推荐购买物品2", "推荐购买物品3", "推荐购买物品4"],
  "detected_signals": ["从以下列表中选择识别到的物品id"]
}

detected_signals 只能从以下 id 列表中选择（选你在图中真正看到或推断存在的）：
coffee, meds, keyboard, multiScreen, books, snacks, takeout, smoke, water, lamp, trash, bedDesk, cables, sticky, anime, plant, storage, gamepad

评分标准：
- focus（专注度）：桌面整洁、物品专一、无干扰 → 高分；杂乱、娱乐物品多 → 低分
- stress（压力指数）：药品、咖啡、外卖、便签堆叠、垃圾 → 高分；整洁有序 → 低分
- health（健康风险）：烟、药品、外卖、床桌混用、无水杯 → 高分；有水杯、绿植 → 低分

人格类型参考（可原创）：
- DDL燃烧流：咖啡+便签+高压
- 科研工程战士：多屏+键盘+资料
- 极简效率流：整洁+收纳+专注
- 高压续航型：药品/烟+疲劳信号
- 二次元逃避型：手办+游戏设备
- 外卖陪跑型：外卖+床桌混用
- 夜猫创作型：台灯+多屏+晚间氛围
- 咖啡因战士：多杯咖啡+高强度工作痕迹"""


class AnalyzeRequest(BaseModel):
    image_base64: str
    intent: str = ""
    tone: str = "sharp"
    goal: str = "study"
    api_key: Optional[str] = None
    model: str = "doubao-seed-2-0-lite-260428"
    api_base: str = "https://ark.cn-beijing.volces.com/api/v3"


TONE_MAP = {
    "sharp": "毒舌犀利，幽默讽刺，一针见血但有建设性",
    "gentle": "温柔鼓励，治愈系，像老朋友聊天",
    "coach": "效率教练风格，专业简练，直接给行动方案",
}

GOAL_MAP = {
    "study": "学习/备考场景，关注专注度和记忆效率",
    "work": "工作/创作场景，关注产出效率和创意空间",
    "rest": "健康作息场景，关注睡眠质量和身体恢复",
}


@app.post("/api/analyze")
async def analyze(req: AnalyzeRequest):
    api_key = req.api_key or os.getenv("API_KEY", "")
    if not api_key:
        raise HTTPException(
            status_code=400,
            detail="未配置 API Key。请在页面右上角点击「API 配置」填写，或在 .env 文件中设置 API_KEY。",
        )

    tone_desc = TONE_MAP.get(req.tone, TONE_MAP["sharp"])
    goal_desc = GOAL_MAP.get(req.goal, GOAL_MAP["study"])

    user_text = f"""请分析这张桌面照片，生成完整的桌面人格报告。

用户意图：{req.intent or "全面分析桌面状态、学习效率、健康风险和性格倾向"}
点评口吻：{tone_desc}
分析重点：{goal_desc}

请仔细观察图中所有可见物品，分析空间布局，推理用户的生活状态和行为模式。
只返回 JSON，不要有其他文字。"""

    # Parse data URL or raw base64
    image_data = req.image_base64
    mime_type = "image/jpeg"
    if image_data.startswith("data:"):
        header, image_data = image_data.split(",", 1)
        mime_type = header.split(";")[0].split(":")[1]

    api_base = req.api_base.rstrip("/")
    model = req.model or os.getenv("MODEL", "doubao-seed-2-0-lite-260428")
    image_data_url = f"data:{mime_type};base64,{image_data}"

    if is_ark_api(api_base):
        # ── 豆包 / 火山方舟 Responses API ──────────────────────────────
        api_url = f"{api_base}/responses"
        payload = {
            "model": model,
            "input": [
                {
                    "role": "system",
                    "content": [{"type": "input_text", "text": SYSTEM_PROMPT}],
                },
                {
                    "role": "user",
                    "content": [
                        {"type": "input_image", "image_url": image_data_url},
                        {"type": "input_text", "text": user_text},
                    ],
                },
            ],
        }
    else:
        # ── OpenAI / 通义千问 / 其他兼容接口 Chat Completions ──────────
        api_url = f"{api_base}/chat/completions"
        payload = {
            "model": model,
            "messages": [
                {"role": "system", "content": SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "image_url",
                            "image_url": {"url": image_data_url},
                        },
                        {"type": "text", "text": user_text},
                    ],
                },
            ],
            "max_tokens": 1800,
            "temperature": 0.75,
        }

    try:
        async with httpx.AsyncClient(timeout=90.0) as client:
            response = await client.post(
                api_url,
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
                json=payload,
            )
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="AI 接口超时，请稍后重试。")
    except httpx.RequestError as e:
        raise HTTPException(status_code=502, detail=f"无法连接到 API：{str(e)}")

    if response.status_code != 200:
        err_body = response.text[:300]
        raise HTTPException(
            status_code=response.status_code,
            detail=f"API 返回错误 {response.status_code}：{err_body}",
        )

    result = response.json()

    # Extract text content — handle both response formats
    if is_ark_api(api_base):
        content = extract_ark_text(result).strip()
    else:
        content = result["choices"][0]["message"]["content"].strip()

    # Strip markdown code fences if present
    content = re.sub(r"^```(?:json)?\s*", "", content)
    content = re.sub(r"\s*```$", "", content)

    json_match = re.search(r"\{[\s\S]*\}", content)
    if not json_match:
        raise HTTPException(
            status_code=500,
            detail=f"AI 没有返回有效 JSON。原始输出：{content[:200]}",
        )

    try:
        analysis = json.loads(json_match.group())
    except json.JSONDecodeError as e:
        raise HTTPException(
            status_code=500, detail=f"JSON 解析失败：{str(e)}。内容：{content[:200]}"
        )

    # Validate and fill defaults
    analysis.setdefault("persona", {})
    analysis["persona"].setdefault("badge", "未知类型")
    analysis["persona"].setdefault("title", "神秘桌面主人")
    analysis["persona"].setdefault("roast", "AI 暂时看不透你的桌面。")
    analysis.setdefault("scores", {"focus": 60, "stress": 50, "health": 40})
    analysis["scores"].setdefault("focus", 60)
    analysis["scores"].setdefault("stress", 50)
    analysis["scores"].setdefault("health", 40)
    analysis.setdefault("scene", [])
    analysis.setdefault("behavior", [])
    analysis.setdefault("advice", [])
    analysis.setdefault("shopping", [])
    analysis.setdefault("detected_signals", [])

    # Clamp scores to 0-100
    for key in ["focus", "stress", "health"]:
        analysis["scores"][key] = max(0, min(100, int(analysis["scores"][key])))

    return analysis


@app.get("/api/health")
async def health():
    return {
        "status": "ok",
        "api_key_configured": bool(os.getenv("API_KEY")),
        "default_model": os.getenv("MODEL", "doubao-seed-2-0-lite-260428"),
        "default_api_base": os.getenv(
            "API_BASE", "https://ark.cn-beijing.volces.com/api/v3"
        ),
    }


# Serve static files — must be mounted last
app.mount("/", StaticFiles(directory=".", html=True), name="static")


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 8000))
    print(f"\nDeskMind started -> http://localhost:{port}\n")
    uvicorn.run("server:app", host="0.0.0.0", port=port, reload=True)
