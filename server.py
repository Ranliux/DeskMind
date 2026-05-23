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


SYSTEM_PROMPT = """你是 DeskMind，一个毒舌幽默的桌面人格分析 AI，文案风格有梗、接地气、带互联网黑话。
你会分析用户桌面照片，识别物品、推理行为模式，生成人格报告和改造建议。

你必须只返回一个严格的 JSON 对象，不要有任何其他文字、代码块标记或解释：

{
  "persona": {
    "badge": "人格标签（必须从下方列表精确选一个，如：DDL冲锋侠）",
    "title": "人格副标题（8-16字，幽默有梗，如：截止日期是我的闹钟）",
    "roast": "AI犀利点评（40-100字，根据指定口吻调整语气，要幽默有梗）"
  },
  "scores": {
    "moyu": 0到100的整数（摸鱼指数，越高越摸鱼），
    "guolao": 0到100的整数（过劳指数，越高越过劳），
    "xuming": 0到100的整数（续命能力，越高越能扛）
  },
  "scene": ["场景观察1（描述看到的物品及空间关系）", "场景观察2", "场景观察3", "场景观察4", "场景观察5"],
  "behavior": ["行为模式推理1（幽默表达）", "行为模式推理2", "行为模式推理3", "行为模式推理4"],
  "advice": ["具体改造建议1", "具体改造建议2", "具体改造建议3", "具体改造建议4", "具体改造建议5"],
  "shopping": ["推荐购买物品1（简短品类名）", "推荐购买物品2", "推荐购买物品3", "推荐购买物品4"],
  "detected_signals": ["从以下列表中选择识别到的物品id"]
}

detected_signals 只能从以下 id 列表中选择（选你在图中真正看到或推断存在的）：
coffee, meds, keyboard, multiScreen, books, snacks, takeout, smoke, water, lamp, trash, bedDesk, cables, sticky, anime, plant, storage, gamepad

评分标准：
- moyu（摸鱼指数）：游戏手柄、零食、手办、外卖、床桌混用、垃圾 → 高分；书、便签、键盘、水杯 → 低分
- guolao（过劳指数）：咖啡、药品、烟、外卖、便签堆叠、垃圾、线缆混乱 → 高分；整洁+绿植+收纳 → 低分
- xuming（续命能力）：水杯、绿植、收纳整洁、台灯合理 → 高分；烟、药品、无水杯、外卖、床桌混用 → 低分

人格类型（badge 字段只能从这10个中精确选一个，一字不差）：
- DDL冲锋侠：咖啡+便签+高压截止日期
- 上岸突击手：备考资料+水+专注+低摸鱼
- 二次元御宅族：手办/贴纸+二次元周边
- 学霸绝缘体：书多但容易分心、效率偏低
- 懒人摆烂党：外卖盒/垃圾+无组织迹象
- 摸鱼大师：高摸鱼指数、分心设备多
- 游戏牢玩家：游戏手柄+多屏+沉浸式娱乐
- 熬夜养生矛盾体：台灯+咖啡或药品+水杯（养生与熬夜并存）
- 躺平随缘人：床桌混用或整体过劳指数极低
- 追星狂热粉：手办/周边+零食或便签（追星应援氛围）

如果图中线索不明确，优先选最接近的，不要自创新类型。"""


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
    analysis["persona"].setdefault("badge", "摸鱼大师")
    analysis["persona"].setdefault("title", "神秘桌面主人")
    analysis["persona"].setdefault("roast", "AI 暂时看不透你的桌面，但你的摸鱼技术已经炉火纯青。")
    analysis.setdefault("scores", {"moyu": 45, "guolao": 50, "xuming": 55})
    analysis["scores"].setdefault("moyu", 45)
    analysis["scores"].setdefault("guolao", 50)
    analysis["scores"].setdefault("xuming", 55)
    analysis.setdefault("scene", [])
    analysis.setdefault("behavior", [])
    analysis.setdefault("advice", [])
    analysis.setdefault("shopping", [])
    analysis.setdefault("detected_signals", [])

    # Clamp scores to 0-100
    for key in ["moyu", "guolao", "xuming"]:
        val = analysis["scores"].get(key, 50)
        analysis["scores"][key] = max(0, min(100, int(val)))

    return analysis


class ShoppingRequest(BaseModel):
    items: list
    api_key: Optional[str] = None
    model: str = "doubao-seed-2-0-lite-260428"
    api_base: str = "https://ark.cn-beijing.volces.com/api/v3"


def _build_fallback_items(items: list) -> list:
    """Generate search-URL items when AI call is unavailable."""
    from urllib.parse import quote
    result = []
    platforms = [
        ("淘宝", "https://s.taobao.com/search?q={}"),
        ("京东", "https://search.jd.com/Search?keyword={}"),
        ("拼多多", "https://mobile.pinduoduo.com/search_result.html?search_key={}"),
    ]
    for i, item in enumerate(items[:8]):
        plat_name, url_tmpl = platforms[i % len(platforms)]
        result.append({
            "name": item,
            "desc": "点击搜索同类商品",
            "platform": plat_name,
            "link": url_tmpl.format(quote(item)),
            "price": "",
        })
    return result


@app.post("/api/shopping")
async def shopping(req: ShoppingRequest):
    api_key = req.api_key or os.getenv("API_KEY", "")
    if not api_key:
        raise HTTPException(status_code=400, detail="未配置 API Key。")

    items_str = "、".join(req.items[:8])
    prompt = f"""你是购物推荐助手。请根据以下桌面改善商品品类，给出购买建议。

商品列表：{items_str}

对每个商品，返回一个 JSON 数组（不要有任何其他文字）：

[
  {{
    "name": "商品品类名（简短，与输入一致）",
    "desc": "10字内买点说明",
    "platform": "淘宝 或 京东 或 拼多多",
    "search_keyword": "推荐搜索关键词（更精准的搜索词）",
    "price": "大概价格区间，如 ¥20–50"
  }}
]

只返回 JSON 数组，不要解释。"""

    api_base = req.api_base.rstrip("/")
    model = req.model

    if is_ark_api(api_base):
        api_url = f"{api_base}/responses"
        payload = {
            "model": model,
            "input": [
                {
                    "role": "user",
                    "content": [{"type": "input_text", "text": prompt}],
                }
            ],
        }
    else:
        api_url = f"{api_base}/chat/completions"
        payload = {
            "model": model,
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 800,
            "temperature": 0.3,
        }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                api_url,
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
                json=payload,
            )
    except (httpx.TimeoutException, httpx.RequestError):
        return _build_fallback_items(req.items)

    if response.status_code != 200:
        return _build_fallback_items(req.items)

    result = response.json()
    if is_ark_api(api_base):
        content = extract_ark_text(result).strip()
    else:
        content = result["choices"][0]["message"]["content"].strip()

    content = re.sub(r"^```(?:json)?\s*", "", content)
    content = re.sub(r"\s*```$", "", content)

    arr_match = re.search(r"\[[\s\S]*\]", content)
    if not arr_match:
        return _build_fallback_items(req.items)

    try:
        items_out = json.loads(arr_match.group())
    except json.JSONDecodeError:
        return _build_fallback_items(req.items)

    from urllib.parse import quote
    cleaned = []
    for it in items_out[:8]:
        if not isinstance(it, dict):
            continue
        name = it.get("name", "商品")
        keyword = it.get("search_keyword") or name
        platform = it.get("platform", "淘宝")
        if "京东" in platform:
            link = f"https://search.jd.com/Search?keyword={quote(keyword)}"
        elif "拼多多" in platform:
            link = f"https://mobile.pinduoduo.com/search_result.html?search_key={quote(keyword)}"
        else:
            link = f"https://s.taobao.com/search?q={quote(keyword)}"
        cleaned.append({
            "name": name,
            "desc": it.get("desc", ""),
            "platform": platform,
            "link": link,
            "price": it.get("price", ""),
        })

    return cleaned if cleaned else _build_fallback_items(req.items)


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
