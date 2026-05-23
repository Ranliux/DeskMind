const defaultImage = "assets/sample-desk.png";

const signals = [
  {
    id: "coffee",
    label: "咖啡/能量饮料",
    weights: { stress: 9, focus: 4, health: 4, share: 4 },
    scene: "饮品靠近键盘，推测存在长时间连续学习或工作。",
    behavior: "续航方式偏刺激型，容易把精力管理外包给咖啡因。",
    advice: "把咖啡固定在上午或午后早段，晚间改成温水或无糖茶。",
    shopping: "带刻度水杯"
  },
  {
    id: "meds",
    label: "药品/维生素",
    weights: { stress: 10, health: 10, share: 2 },
    scene: "健康相关物品出现在工作区，说明身体状态已经参与桌面系统。",
    behavior: "近期可能在硬扛疲劳、过敏、肠胃或睡眠问题。",
    advice: "把药品移到独立收纳区，并设置明确服用提醒；报告不替代医学诊断。",
    shopping: "分格药盒"
  },
  {
    id: "keyboard",
    label: "机械键盘",
    weights: { focus: 6, share: 3 },
    scene: "键盘是桌面中心物，输入密度高。",
    behavior: "你更像执行型选手，靠敲字推进任务。",
    advice: "键盘前方保留一条 8 到 12 厘米腕部缓冲区，降低疲劳。",
    shopping: "低矮腕托"
  },
  {
    id: "multiScreen",
    label: "双屏/多屏",
    weights: { focus: 8, stress: 4, share: 5 },
    scene: "多屏布局带来明显信息流分区。",
    behavior: "任务切换能力强，但也容易被消息和参考资料分心。",
    advice: "主屏只放当前产出，副屏固定资料或通讯，不要混放。",
    shopping: "显示器支架"
  },
  {
    id: "books",
    label: "课程书/资料",
    weights: { focus: 7, stress: 5, share: 3 },
    scene: "纸质材料占据可见空间，学习任务具备实体痕迹。",
    behavior: "处于输入期，知识吸收量大，阶段性压力偏高。",
    advice: "把正在读的资料和待归档资料分成两叠，减少视觉噪音。",
    shopping: "竖立文件架"
  },
  {
    id: "snacks",
    label: "零食",
    weights: { stress: 4, health: 6, share: 4 },
    scene: "即时奖励物靠近工作区。",
    behavior: "压力释放方式偏即时满足，容易越学越想补一口。",
    advice: "把零食移到伸手不可及的位置，只保留一份定量。",
    shopping: "密封零食盒"
  },
  {
    id: "takeout",
    label: "外卖盒",
    weights: { stress: 7, health: 8, share: 5 },
    scene: "用餐和工作边界重叠，桌面出现生活功能挤占。",
    behavior: "节奏可能被截止日期推着走，吃饭也变成任务间隙。",
    advice: "每天至少固定一顿离桌吃饭，让大脑知道有真正的休息段。",
    shopping: "桌面清洁湿巾"
  },
  {
    id: "smoke",
    label: "烟/打火机",
    weights: { stress: 10, health: 12, share: 3 },
    scene: "高压缓冲物和学习工作区重叠。",
    behavior: "压力自我调节成本偏高，需要更温和的替代动作。",
    advice: "把烟具移出桌面视线，建立 3 分钟站立伸展替代流程。",
    shopping: "计时器"
  },
  {
    id: "water",
    label: "水杯",
    weights: { focus: 3, health: -5, stress: -2 },
    scene: "补水物品处在触手可及的位置。",
    behavior: "你仍然保留了一点自救意识，这点很重要。",
    advice: "把水杯放在非惯用手一侧，降低打翻风险，也能提醒休息。",
    shopping: "防泼杯垫"
  },
  {
    id: "lamp",
    label: "台灯",
    weights: { focus: 5, stress: 2, health: -1 },
    scene: "局部照明出现，夜间学习或精细阅读概率上升。",
    behavior: "你能为专注布置环境，但要小心光线反差带来的眼疲劳。",
    advice: "台灯照向纸面或墙面反射，屏幕亮度与环境亮度保持接近。",
    shopping: "可调色温台灯"
  },
  {
    id: "trash",
    label: "垃圾/废纸",
    weights: { stress: 8, health: 4, focus: -5, share: 6 },
    scene: "废弃物进入主工作面，桌面维护周期偏长。",
    behavior: "你不是懒，是系统没有给清理动作留入口。",
    advice: "设置一个 30 秒桌面收尾动作：垃圾、杯子、纸张各归一次位。",
    shopping: "桌边小垃圾桶"
  },
  {
    id: "bedDesk",
    label: "床桌混用",
    weights: { stress: 6, health: 9, focus: -6, share: 5 },
    scene: "休息区与工作区边界不清。",
    behavior: "大脑可能分不清什么时候该冲刺、什么时候该睡觉。",
    advice: "把床只留给休息，至少用一张小桌垫制造工作边界。",
    shopping: "折叠桌垫"
  },
  {
    id: "cables",
    label: "线缆混乱",
    weights: { stress: 5, focus: -4, share: 4 },
    scene: "线缆成为桌面视觉主角之一。",
    behavior: "你的效率被一些很小的摩擦偷偷扣分。",
    advice: "把常用线固定在桌沿，临时线放进一只透明收纳盒。",
    shopping: "理线夹"
  },
  {
    id: "sticky",
    label: "便签/Todo",
    weights: { focus: 7, stress: 5, share: 3 },
    scene: "任务外化到桌面，说明你在主动管理压力。",
    behavior: "适合清单驱动，但清单过多会从工具变成噪音。",
    advice: "只保留今日三件事，其余任务移到数字列表或本子背页。",
    shopping: "周计划便签"
  },
  {
    id: "anime",
    label: "手办/贴纸",
    weights: { share: 8, focus: 2, stress: -1 },
    scene: "个人兴趣物品占据可见区域。",
    behavior: "你需要一点精神充电物，审美是桌面系统的一部分。",
    advice: "保留一个视觉锚点即可，其他收藏转移到侧边展示区。",
    shopping: "小型展示架"
  },
  {
    id: "plant",
    label: "绿植",
    weights: { health: -4, stress: -4, focus: 2, share: 3 },
    scene: "自然元素进入工作区，空间有恢复性线索。",
    behavior: "你在给高压环境留呼吸口，这是成熟的布置。",
    advice: "让绿植靠近自然光，但不要挤占鼠标和书写区域。",
    shopping: "防水托盘"
  },
  {
    id: "storage",
    label: "收纳盒",
    weights: { focus: 5, stress: -3, health: -2 },
    scene: "物品已经有归属容器，桌面可恢复性较好。",
    behavior: "你不是极简主义者，但你知道秩序能换回脑容量。",
    advice: "把收纳盒分成高频、低频、补给三类，不要混装。",
    shopping: "标签贴"
  },
  {
    id: "gamepad",
    label: "游戏手柄",
    weights: { share: 5, focus: -2, stress: -2 },
    scene: "娱乐设备与任务设备共处一桌。",
    behavior: "你需要奖励机制，但边界感决定它是回血还是分心。",
    advice: "完成一个番茄钟后再把手柄移到桌面中央，形成奖励仪式。",
    shopping: "抽屉分隔盒"
  }
];

const defaultSelected = ["coffee", "keyboard", "books", "water", "lamp", "cables", "sticky"];

const personas = [
  {
    id: "deadline",
    badge: "DDL 燃烧流",
    title: "凌晨型 DDL 战士",
    match: (selected, scores, goal) =>
      selected.has("coffee") && (selected.has("sticky") || selected.has("books")) && scores.stress >= 58 && goal !== "rest",
    roasts: {
      sharp: "你的桌面像一台正在超频的学习机器：咖啡负责点火，便签负责焦虑，线缆负责制造剧情。",
      gentle: "你把很多任务都扛在桌面上了。它确实努力，但也在提醒你该给自己留一点缓冲。",
      coach: "当前桌面适合短冲刺，不适合长续航。把任务收束成三件事，效率会明显提升。"
    }
  },
  {
    id: "research",
    badge: "科研工程战士",
    title: "INTJ 型科研战士",
    match: (selected) => selected.has("multiScreen") && selected.has("keyboard") && selected.has("books"),
    roasts: {
      sharp: "你的桌面不像桌面，像一个小型控制台。下一步可能不是整理，是给自己发工牌。",
      gentle: "你很擅长把复杂任务摊开处理，只要减少切屏诱惑，就会更稳。",
      coach: "多屏价值在于分区。主屏产出、副屏参考、手机远离，是你这套系统的最优解。"
    }
  },
  {
    id: "minimal",
    badge: "极简效率流",
    title: "冷静型效率玩家",
    match: (selected, scores) =>
      selected.has("storage") && selected.has("water") && !selected.has("trash") && !selected.has("takeout") && scores.focus >= 70,
    roasts: {
      sharp: "你这桌面干净得像刚结束一场产品发布会，唯一的问题是别人会觉得你没有生活。",
      gentle: "你的桌面秩序感很强，适合持续产出，也有恢复空间。",
      coach: "继续保留低干扰布局，把高频物品压缩到一臂范围内即可。"
    }
  },
  {
    id: "health",
    badge: "高压续航型",
    title: "健康警报边缘人",
    match: (selected, scores) => selected.has("meds") || selected.has("smoke") || scores.health >= 70,
    roasts: {
      sharp: "你的桌面已经不是学习状态，是身体在给项目开风险会。",
      gentle: "桌面上出现了不少疲劳信号。先照顾身体，任务才有长期胜算。",
      coach: "优先做健康降噪：补水、离桌吃饭、固定睡前 30 分钟收尾。"
    }
  },
  {
    id: "escape",
    badge: "兴趣回血型",
    title: "二次元逃避型创作家",
    match: (selected) => selected.has("anime") || selected.has("gamepad"),
    roasts: {
      sharp: "你的桌面一半在学习，一半在给大脑递逃生通道。",
      gentle: "兴趣物品不是问题，它们是能量来源。关键是给它们合适的位置。",
      coach: "把兴趣物当作完成任务后的视觉奖励，而不是任务开始前的注意力入口。"
    }
  },
  {
    id: "takeout",
    badge: "外卖陪跑型",
    title: "生活工作混流选手",
    match: (selected) => selected.has("takeout") || selected.has("bedDesk"),
    roasts: {
      sharp: "你的桌面正在兼职餐桌、床头柜和战场，工资还一分没有。",
      gentle: "你最近可能真的很忙。先把吃饭和休息从任务里救出来。",
      coach: "建立空间边界会立刻提升专注：吃饭离桌，休息离屏，工作区只留当前任务。"
    }
  }
];

const fallbackPersona = {
  badge: "混合生存流",
  title: "多线程桌面玩家",
  roasts: {
    sharp: "你的桌面不是乱，是很多个你同时在线，只是还没开会同步。",
    gentle: "这个桌面能看出你在努力处理多件事。稍微分区后，会轻松很多。",
    coach: "先分出产出区、资料区、补给区，其他优化都可以排在后面。"
  }
};

const deskPreview = document.querySelector("#deskPreview");
const imageInput = document.querySelector("#deskImageInput");
const resetImageButton = document.querySelector("#resetImageButton");
const signalGrid = document.querySelector("#signalGrid");
const analyzeButton = document.querySelector("#analyzeButton");
const randomizeButton = document.querySelector("#randomizeButton");
const exportCardButton = document.querySelector("#exportCardButton");
const copyReportButton = document.querySelector("#copyReportButton");
const toast = document.querySelector("#toast");

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function createSignalControls() {
  signalGrid.innerHTML = signals
    .map(
      (signal) => `
        <label class="signal-pill">
          <input type="checkbox" value="${signal.id}" ${defaultSelected.includes(signal.id) ? "checked" : ""} />
          <span>${signal.label}</span>
        </label>
      `
    )
    .join("");
}

function getSelectedSignals() {
  return new Set(
    [...signalGrid.querySelectorAll("input:checked")].map((input) => input.value)
  );
}

function getSignal(id) {
  return signals.find((signal) => signal.id === id);
}

function calculateScores(selected) {
  const base = { focus: 58, stress: 34, health: 28, share: 44 };

  selected.forEach((id) => {
    const signal = getSignal(id);
    Object.entries(signal.weights).forEach(([key, value]) => {
      base[key] += value;
    });
  });

  const selectedCount = selected.size;
  base.stress += Math.max(0, selectedCount - 8) * 3;
  base.focus -= Math.max(0, selectedCount - 10) * 3;

  return {
    focus: clamp(base.focus),
    stress: clamp(base.stress),
    health: clamp(base.health),
    share: clamp(base.share)
  };
}

function pickPersona(selected, scores, goal) {
  return personas.find((persona) => persona.match(selected, scores, goal)) || fallbackPersona;
}

function buildBehavior(selected, scores, goal) {
  const lines = [];

  if (scores.stress >= 70) {
    lines.push("压力指数偏高，桌面正在替你承载过多未关闭任务。");
  } else if (scores.stress <= 42) {
    lines.push("压力信号可控，当前桌面更像稳定产出场。");
  } else {
    lines.push("压力处于中段，适合通过小整理换回注意力。");
  }

  if (scores.focus >= 72) {
    lines.push("专注线索强，适合深度阅读、写作、编程或备考。");
  } else if (scores.focus <= 48) {
    lines.push("专注度被环境摩擦削弱，容易开始很多事却难以收束。");
  } else {
    lines.push("专注力有基础，但需要减少边缘物品的视觉拉扯。");
  }

  if (scores.health >= 64) {
    lines.push("健康风险值得关注，优先处理睡眠、补水、用餐和眼疲劳。");
  } else {
    lines.push("健康风险暂时不高，继续保留补水和光线管理。");
  }

  if (selected.has("multiScreen") || selected.has("keyboard")) {
    lines.push(goal === "work" ? "专业倾向偏创作/技术执行。" : "专业倾向偏信息密集型学习。");
  }

  return lines;
}

function buildAdvice(selected, scores, goal) {
  const priority = [];

  if (selected.has("trash") || selected.has("takeout")) {
    priority.push("清空桌面食物和废弃物，把工作面恢复成单一任务空间。");
  }
  if (selected.has("cables")) {
    priority.push("把线缆固定到桌沿或桌后，减少视觉混乱和拿取阻力。");
  }
  if (selected.has("bedDesk")) {
    priority.push("建立休息边界：床上只休息，桌面只处理当前任务。");
  }
  if (selected.has("sticky") || selected.has("books")) {
    priority.push("把任务缩成今日三件事，资料按正在用、稍后用、归档分区。");
  }
  if (selected.has("lamp")) {
    priority.push("调整光源角度，让台灯照亮纸面或墙面，避免直射屏幕。");
  }
  if (scores.health >= 58) {
    priority.push("加入每 45 分钟一次的离桌动作：喝水、站立、远眺。");
  }

  const goalAdvice = {
    study: "学习模式建议 35 分钟输入 + 10 分钟输出，不让阅读停在“看过”。",
    work: "工作模式建议用主屏产出、侧边参考、手机静音的三分区节奏。",
    rest: "作息模式建议睡前 30 分钟把桌面收尾，给大脑一个关机信号。"
  };

  priority.push(goalAdvice[goal]);

  return [...new Set(priority)].slice(0, 5);
}

function buildAgentPlan(selected) {
  const plan = [
    "VLM：识别桌面物体、光线、空间关系和混用区域。",
    "Scene Graph：把物体关系转成可推理节点，例如咖啡靠近键盘、资料压住书写区。",
    "Agent Planner：按健康、效率、传播性生成报告与行动清单。"
  ];

  if (selected.has("meds") || selected.has("smoke")) {
    plan.push("Safety Agent：对健康相关内容降级为提醒，不输出诊断结论。");
  }

  return plan;
}

function renderList(selector, items) {
  const target = document.querySelector(selector);
  target.innerHTML = items.map((item) => `<li>${item}</li>`).join("");
}

function setMeter(scoreId, meterId, value) {
  document.querySelector(scoreId).textContent = value;
  document.querySelector(meterId).style.width = `${value}%`;
}

function getReportText() {
  const title = document.querySelector("#personaTitle").textContent;
  const roast = document.querySelector("#roastText").textContent;
  const focus = document.querySelector("#focusScore").textContent;
  const stress = document.querySelector("#stressScore").textContent;
  const health = document.querySelector("#healthScore").textContent;
  const advice = [...document.querySelectorAll("#adviceList li")]
    .map((item, index) => `${index + 1}. ${item.textContent}`)
    .join("\n");

  return `DeskMind 桌面人格报告\n\n${title}\n${roast}\n\n专注度：${focus}\n压力指数：${stress}\n健康风险：${health}\n\n桌面改造方案：\n${advice}`;
}

function analyzeDesk() {
  const selected = getSelectedSignals();
  const goal = document.querySelector("#goalSelect").value;
  const tone = document.querySelector("#toneSelect").value;
  const scores = calculateScores(selected);
  const persona = pickPersona(selected, scores, goal);
  const selectedSignals = [...selected].map(getSignal).filter(Boolean);

  document.querySelector("#personaBadge").textContent = persona.badge;
  document.querySelector("#personaTitle").textContent = persona.title;
  document.querySelector("#roastText").textContent = persona.roasts[tone];

  setMeter("#focusScore", "#focusMeter", scores.focus);
  setMeter("#stressScore", "#stressMeter", scores.stress);
  setMeter("#healthScore", "#healthMeter", scores.health);

  renderList(
    "#sceneList",
    selectedSignals.length
      ? selectedSignals.slice(0, 5).map((signal) => signal.scene)
      : ["未选择桌面线索，当前报告使用默认人格模板。"]
  );
  renderList("#behaviorList", buildBehavior(selected, scores, goal));
  renderList("#adviceList", buildAdvice(selected, scores, goal));
  renderList(
    "#shoppingList",
    [...new Set(selectedSignals.map((signal) => signal.shopping))].slice(0, 5)
  );
  renderList("#agentList", buildAgentPlan(selected));

  showToast("报告已生成");
}

function randomizeSignals() {
  const inputs = [...signalGrid.querySelectorAll("input")];
  const count = 6 + Math.floor(Math.random() * 5);
  const pool = [...signals].sort(() => Math.random() - 0.5).slice(0, count);
  const selectedIds = new Set(pool.map((signal) => signal.id));

  inputs.forEach((input) => {
    input.checked = selectedIds.has(input.value);
  });

  analyzeDesk();
}

function handleImageUpload(event) {
  const [file] = event.target.files;
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    deskPreview.src = reader.result;
    deskPreview.alt = `${file.name} 的桌面预览`;
    showToast("桌面照片已载入");
  });
  reader.readAsDataURL(file);
}

async function copyReport() {
  const text = getReportText();

  try {
    await navigator.clipboard.writeText(text);
    showToast("报告已复制");
  } catch {
    showToast("浏览器限制了复制权限，请手动选中文本");
  }
}

function exportShareCard() {
  const canvas = document.createElement("canvas");
  const width = 1200;
  const height = 1600;
  const ctx = canvas.getContext("2d");
  const persona = document.querySelector("#personaTitle").textContent;
  const badge = document.querySelector("#personaBadge").textContent;
  const roast = document.querySelector("#roastText").textContent;
  const scores = [
    ["专注度", document.querySelector("#focusScore").textContent, "#4c956c"],
    ["压力指数", document.querySelector("#stressScore").textContent, "#e85d4f"],
    ["健康风险", document.querySelector("#healthScore").textContent, "#f0b429"]
  ];

  canvas.width = width;
  canvas.height = height;

  ctx.fillStyle = "#fbfbf7";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#0f8b8d";
  ctx.fillRect(0, 0, width, 220);
  ctx.fillStyle = "#e85d4f";
  ctx.fillRect(0, 220, width, 18);
  ctx.fillStyle = "#17201d";
  ctx.fillRect(72, 1040, width - 144, 2);

  ctx.fillStyle = "#ffffff";
  ctx.font = "700 44px Microsoft YaHei, sans-serif";
  ctx.fillText("DeskMind Report", 72, 110);
  ctx.font = "800 36px Microsoft YaHei, sans-serif";
  ctx.fillText(badge, 72, 172);

  ctx.fillStyle = "#17201d";
  ctx.font = "900 76px Microsoft YaHei, sans-serif";
  wrapText(ctx, persona, 72, 330, width - 144, 90);

  ctx.fillStyle = "#34413e";
  ctx.font = "400 34px Microsoft YaHei, sans-serif";
  wrapText(ctx, roast, 72, 520, width - 144, 54);

  scores.forEach(([label, value, color], index) => {
    const x = 72 + index * 352;
    ctx.fillStyle = "#ffffff";
    roundedRect(ctx, x, 820, 310, 150, 18);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.font = "900 58px Microsoft YaHei, sans-serif";
    ctx.fillText(value, x + 28, 890);
    ctx.fillStyle = "#64706d";
    ctx.font = "700 26px Microsoft YaHei, sans-serif";
    ctx.fillText(label, x + 28, 936);
  });

  ctx.fillStyle = "#17201d";
  ctx.font = "800 40px Microsoft YaHei, sans-serif";
  ctx.fillText("桌面改造方案", 72, 1120);
  ctx.font = "400 30px Microsoft YaHei, sans-serif";
  const advice = [...document.querySelectorAll("#adviceList li")]
    .map((item, index) => `${index + 1}. ${item.textContent}`)
    .join("  ");
  wrapText(ctx, advice, 72, 1190, width - 144, 46);

  ctx.fillStyle = "#0f8b8d";
  ctx.font = "800 30px Microsoft YaHei, sans-serif";
  ctx.fillText("AI 看穿你的桌面", 72, 1510);

  const link = document.createElement("a");
  link.download = "deskmind-report.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
  showToast("分享卡已导出");
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const chars = [...text];
  let line = "";
  let cursorY = y;

  chars.forEach((char) => {
    const testLine = line + char;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      ctx.fillText(line, x, cursorY);
      line = char;
      cursorY += lineHeight;
    } else {
      line = testLine;
    }
  });

  if (line) {
    ctx.fillText(line, x, cursorY);
  }
}

function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

createSignalControls();
analyzeDesk();

imageInput.addEventListener("change", handleImageUpload);
resetImageButton.addEventListener("click", () => {
  deskPreview.src = defaultImage;
  deskPreview.alt = "DeskMind 默认桌面样片";
  imageInput.value = "";
  showToast("已恢复默认样片");
});
analyzeButton.addEventListener("click", analyzeDesk);
randomizeButton.addEventListener("click", randomizeSignals);
copyReportButton.addEventListener("click", copyReport);
exportCardButton.addEventListener("click", exportShareCard);
