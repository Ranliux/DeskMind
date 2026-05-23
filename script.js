// ─── Constants ──────────────────────────────────────────────────────────────

const defaultImage = "assets/sample-desk.png";

const LOADING_STEPS = [
  "正在识别桌面物品…",
  "构建 Scene Graph…",
  "推理行为模式…",
  "生成人格画像…",
  "撰写改造方案…",
  "整理购买清单…",
];

const signals = [
  {
    id: "coffee",
    label: "咖啡/能量饮料",
    weights: { moyu: -10, guolao: 15, xuming: -6 },
    scene: "饮品靠近键盘，推测存在长时间连续学习或工作。",
    behavior: "续航方式偏刺激型，容易把精力管理外包给咖啡因。",
    advice: "把咖啡固定在上午或午后早段，晚间改成温水或无糖茶。",
    shopping: "带刻度水杯"
  },
  {
    id: "meds",
    label: "药品/维生素",
    weights: { guolao: 14, xuming: -10 },
    scene: "健康相关物品出现在工作区，说明身体状态已经参与桌面系统。",
    behavior: "近期可能在硬扛疲劳、过敏、肠胃或睡眠问题。",
    advice: "把药品移到独立收纳区，并设置明确服用提醒；报告不替代医学诊断。",
    shopping: "分格药盒"
  },
  {
    id: "keyboard",
    label: "机械键盘",
    weights: { moyu: -6, guolao: 4 },
    scene: "键盘是桌面中心物，输入密度高。",
    behavior: "你更像执行型选手，靠敲字推进任务。",
    advice: "键盘前方保留一条 8 到 12 厘米腕部缓冲区，降低疲劳。",
    shopping: "低矮腕托"
  },
  {
    id: "multiScreen",
    label: "双屏/多屏",
    weights: { moyu: -4, guolao: 5 },
    scene: "多屏布局带来明显信息流分区。",
    behavior: "任务切换能力强，但也容易被消息和参考资料分心。",
    advice: "主屏只放当前产出，副屏固定资料或通讯，不要混放。",
    shopping: "显示器支架"
  },
  {
    id: "books",
    label: "课程书/资料",
    weights: { moyu: -8, guolao: 6, xuming: 2 },
    scene: "纸质材料占据可见空间，学习任务具备实体痕迹。",
    behavior: "处于输入期，知识吸收量大，阶段性压力偏高。",
    advice: "把正在读的资料和待归档资料分成两叠，减少视觉噪音。",
    shopping: "竖立文件架"
  },
  {
    id: "snacks",
    label: "零食",
    weights: { moyu: 10, guolao: 2, xuming: -3 },
    scene: "即时奖励物靠近工作区。",
    behavior: "压力释放方式偏即时满足，容易越学越想补一口。",
    advice: "把零食移到伸手不可及的位置，只保留一份定量。",
    shopping: "密封零食盒"
  },
  {
    id: "takeout",
    label: "外卖盒",
    weights: { moyu: 6, guolao: 8, xuming: -10 },
    scene: "用餐和工作边界重叠，桌面出现生活功能挤占。",
    behavior: "节奏可能被截止日期推着走，吃饭也变成任务间隙。",
    advice: "每天至少固定一顿离桌吃饭，让大脑知道有真正的休息段。",
    shopping: "桌面清洁湿巾"
  },
  {
    id: "smoke",
    label: "烟/打火机",
    weights: { guolao: 14, xuming: -18 },
    scene: "高压缓冲物和学习工作区重叠。",
    behavior: "压力自我调节成本偏高，需要更温和的替代动作。",
    advice: "把烟具移出桌面视线，建立 3 分钟站立伸展替代流程。",
    shopping: "计时器"
  },
  {
    id: "water",
    label: "水杯",
    weights: { moyu: -2, guolao: -3, xuming: 14 },
    scene: "补水物品处在触手可及的位置。",
    behavior: "你仍然保留了一点自救意识，这点很重要。",
    advice: "把水杯放在非惯用手一侧，降低打翻风险，也能提醒休息。",
    shopping: "防泼杯垫"
  },
  {
    id: "lamp",
    label: "台灯",
    weights: { guolao: 5, xuming: -2 },
    scene: "局部照明出现，夜间学习或精细阅读概率上升。",
    behavior: "你能为专注布置环境，但要小心光线反差带来的眼疲劳。",
    advice: "台灯照向纸面或墙面反射，屏幕亮度与环境亮度保持接近。",
    shopping: "可调色温台灯"
  },
  {
    id: "trash",
    label: "垃圾/废纸",
    weights: { moyu: 8, guolao: 8, xuming: -8 },
    scene: "废弃物进入主工作面，桌面维护周期偏长。",
    behavior: "你不是懒，是系统没有给清理动作留入口。",
    advice: "设置一个 30 秒桌面收尾动作：垃圾、杯子、纸张各归一次位。",
    shopping: "桌边小垃圾桶"
  },
  {
    id: "bedDesk",
    label: "床桌混用",
    weights: { moyu: 8, guolao: 6, xuming: -10 },
    scene: "休息区与工作区边界不清。",
    behavior: "大脑可能分不清什么时候该冲刺、什么时候该睡觉。",
    advice: "把床只留给休息，至少用一张小桌垫制造工作边界。",
    shopping: "折叠桌垫"
  },
  {
    id: "cables",
    label: "线缆混乱",
    weights: { moyu: 4, guolao: 4 },
    scene: "线缆成为桌面视觉主角之一。",
    behavior: "你的效率被一些很小的摩擦偷偷扣分。",
    advice: "把常用线固定在桌沿，临时线放进一只透明收纳盒。",
    shopping: "理线夹"
  },
  {
    id: "sticky",
    label: "便签/Todo",
    weights: { moyu: -5, guolao: 6 },
    scene: "任务外化到桌面，说明你在主动管理压力。",
    behavior: "适合清单驱动，但清单过多会从工具变成噪音。",
    advice: "只保留今日三件事，其余任务移到数字列表或本子背页。",
    shopping: "周计划便签"
  },
  {
    id: "anime",
    label: "手办/贴纸",
    weights: { moyu: 8, guolao: -2, xuming: 5 },
    scene: "个人兴趣物品占据可见区域。",
    behavior: "你需要一点精神充电物，审美是桌面系统的一部分。",
    advice: "保留一个视觉锚点即可，其他收藏转移到侧边展示区。",
    shopping: "小型展示架"
  },
  {
    id: "plant",
    label: "绿植",
    weights: { moyu: 2, guolao: -4, xuming: 12 },
    scene: "自然元素进入工作区，空间有恢复性线索。",
    behavior: "你在给高压环境留呼吸口，这是成熟的布置。",
    advice: "让绿植靠近自然光，但不要挤占鼠标和书写区域。",
    shopping: "防水托盘"
  },
  {
    id: "storage",
    label: "收纳盒",
    weights: { moyu: -4, guolao: -2, xuming: 6 },
    scene: "物品已经有归属容器，桌面可恢复性较好。",
    behavior: "你不是极简主义者，但你知道秩序能换回脑容量。",
    advice: "把收纳盒分成高频、低频、补给三类，不要混装。",
    shopping: "标签贴"
  },
  {
    id: "gamepad",
    label: "游戏手柄",
    weights: { moyu: 20, guolao: -4, xuming: 3 },
    scene: "娱乐设备与任务设备共处一桌。",
    behavior: "你需要奖励机制，但边界感决定它是回血还是分心。",
    advice: "完成一个番茄钟后再把手柄移到桌面中央，形成奖励仪式。",
    shopping: "抽屉分隔盒"
  }
];

const defaultSelected = ["coffee", "keyboard", "books", "water", "lamp", "cables", "sticky"];

// ─── Persona Definitions ──────────────────────────────────────────────────────
// 每个人格对应 assets/ 中的图片，match 按顺序优先匹配。

const personas = [
  {
    id: "youxi",
    badge: "游戏牢玩家",
    title: "肝游戏比上班还认真",
    image: "assets/游戏牢玩家.png",
    match: (sel) => sel.has("gamepad") && sel.has("multiScreen"),
    roasts: {
      sharp: "双屏+手柄+零食一字排开，你的桌面是个电竞训练营。攻略背得比课本还熟，段位还没毕业证好看。",
      gentle: "沉浸式的热情是很宝贵的特质，把这股劲分一点给现实任务，你会所向无敌的。",
      coach: "把游戏时间设为每日目标完成后的奖励，效率会神奇地提升。"
    }
  },
  {
    id: "zhuixing",
    badge: "追星狂热粉",
    title: "爱豆是我的续命良药",
    image: "assets/追星狂热粉.png",
    match: (sel) => sel.has("anime") && (sel.has("snacks") || sel.has("sticky")),
    roasts: {
      sharp: "桌面一半是应援物料，一半是还没做的作业，爱豆的新专给了你活下去的勇气——但作业还是要交的。",
      gentle: "热爱是你的能量来源，把这份热情分一点给当前任务，你会惊喜的。",
      coach: "完成一项任务就给自己一点追星时间，把热情变成最强激励机制。"
    }
  },
  {
    id: "erciyan",
    badge: "二次元御宅族",
    title: "二次元永远的神",
    image: "assets/二次元御宅族.png",
    match: (sel) => sel.has("anime"),
    roasts: {
      sharp: "手办站满桌，爱好和功课争地盘，爱好完胜。你的二次元老婆比作业更有吸引力，AI表示理解。",
      gentle: "把热爱放在桌面上，说明你有自己的精神角落，这比什么都珍贵。",
      coach: "把手办移到视野边缘当完成任务的奖励，完成一件事才能看它一眼。"
    }
  },
  {
    id: "ddl",
    badge: "DDL冲锋侠",
    title: "截止日期是我的闹钟",
    image: "assets/DDL冲锋侠.png",
    match: (sel, scores, goal) =>
      (sel.has("coffee") && sel.has("sticky")) ||
      (sel.has("books") && scores.guolao >= 65 && goal !== "rest"),
    roasts: {
      sharp: "你的桌面是战场废墟：咖啡是弹药，便签是遗书，线缆是战壕铁丝网。DDL不是在追你，你已经被追上了。",
      gentle: "你很拼，桌面上每一样东西都是你努力的证明。记得在冲刺间隙给自己留一口气。",
      coach: "DDL 前 12 小时：关掉所有通知，只保留当前任务，你能冲的。"
    }
  },
  {
    id: "aoyeyangshen",
    badge: "熬夜养生矛盾体",
    title: "一边熬夜一边喝枸杞",
    image: "assets/熬夜养生矛盾体.png",
    match: (sel) => sel.has("lamp") && (sel.has("coffee") || sel.has("meds")) && sel.has("water"),
    roasts: {
      sharp: "台灯亮到凌晨三点，水杯里泡着枸杞，保温杯旁放着咖啡——你的养生和熬夜在赛跑，目前熬夜遥遥领先。",
      gentle: "你在用力照顾自己，只是时间表有点混乱。试着把灯熄得早一点，从今晚开始？",
      coach: "最有效的养生：睡前1小时关屏幕，比任何保健品都管用，还免费。"
    }
  },
  {
    id: "shanggan",
    badge: "上岸突击手",
    title: "不上岸誓不罢休",
    image: "assets/上岸突击手.png",
    match: (sel, scores, goal) =>
      sel.has("books") && sel.has("water") && scores.moyu <= 22 && goal === "study",
    roasts: {
      sharp: "资料摞到天花板，水杯还在，说明你还没放弃。上岸之前先别沉没，记得抬头换换气。",
      gentle: "你的备考状态很稳，桌面在告诉所有人：你是认真的。坚持就是答案。",
      coach: "备考建议：每 90 分钟强制离桌 5 分钟，不是休息，是对大脑的投资。"
    }
  },
  {
    id: "moyu",
    badge: "摸鱼大师",
    title: "工作是副业，摸鱼才是主业",
    image: "assets/摸鱼大师.png",
    match: (sel, scores) => scores.moyu >= 55,
    roasts: {
      sharp: "你的桌面告诉我：你上班时在摸鱼，摸鱼时在想上班。你已经进入量子叠加态，薛定谔的打工人。",
      gentle: "适当放松是生产力的一部分，不要太苛责自己——但也别让任务等太久。",
      coach: "试试番茄工作法：25 分钟专注，5 分钟合法摸鱼。把摸鱼变成制度化奖励。"
    }
  },
  {
    id: "xueba",
    badge: "学霸绝缘体",
    title: "书买了就等于看了",
    image: "assets/学霸绝缘体.png",
    match: (sel, scores) =>
      sel.has("books") && scores.moyu >= 30 && !sel.has("anime"),
    roasts: {
      sharp: "书买了，荧光笔备好了，知识愣是没进脑子。你在表演学习，还是学习表演？桌面看不出区别。",
      gentle: "你愿意备好所有工具，说明你有意愿。找到让你真正投入的方法，就差最后一步。",
      coach: "试试主动回忆法：合上书，在纸上写下刚才记住的，效率直接提升 50%。"
    }
  },
  {
    id: "lanren",
    badge: "懒人摆烂党",
    title: "躺着也能摆出花",
    image: "assets/懒人摆烂党.png",
    match: (sel) => sel.has("trash") || sel.has("takeout"),
    roasts: {
      sharp: "你的桌面是摆烂的艺术品，外卖盒和垃圾构成了今日的装置艺术。AI向你的放弃治疗表示崇高敬意。",
      gentle: "有时候放松也是一种充电。但如果明天有事，今晚先清一下桌面？",
      coach: "先做一件事：把垃圾扔掉。就这一件。剩下的事情会自动变容易，信我。"
    }
  },
  {
    id: "tangping",
    badge: "躺平随缘人",
    title: "随缘就是最强的力量",
    image: "assets/躺平随缘人.png",
    match: (sel, scores) => sel.has("bedDesk") || scores.guolao <= 25,
    roasts: {
      sharp: "你和床合并成了一个工作单元，这不叫工作，叫卧薪尝胆——薪柴就是被窝，胆是闹钟。",
      gentle: "放慢脚步也是一种选择，你的桌面透露出一种别人羡慕的从容。随缘也是一种哲学。",
      coach: "哪怕只是把床和桌子的边界分开，你的效率就会有可见提升，试试看。"
    }
  }
];

const fallbackPersona = {
  badge: "混合生存流",
  title: "多线程桌面玩家",
  image: "assets/sample-desk.png",
  roasts: {
    sharp: "你的桌面不是乱，是很多个你同时在线还没开会同步。AI 看不透你，给你封神了。",
    gentle: "这个桌面透着一股多元化的气质，啥都有，啥都不完整，但你在努力。",
    coach: "先分出产出区、资料区、补给区，其他优化都可以排在后面。"
  }
};

// ─── Persona Image Map (for AI mode badge→image lookup) ───────────────────────

function getPersonaImage(badge) {
  const imageMap = {
    "DDL冲锋侠": "assets/DDL冲锋侠.png",
    "上岸突击手": "assets/上岸突击手.png",
    "二次元御宅族": "assets/二次元御宅族.png",
    "学霸绝缘体": "assets/学霸绝缘体.png",
    "懒人摆烂党": "assets/懒人摆烂党.png",
    "摸鱼大师": "assets/摸鱼大师.png",
    "游戏牢玩家": "assets/游戏牢玩家.png",
    "熬夜养生矛盾体": "assets/熬夜养生矛盾体.png",
    "躺平随缘人": "assets/躺平随缘人.png",
    "追星狂热粉": "assets/追星狂热粉.png",
  };
  return imageMap[badge] || "assets/sample-desk.png";
}

// ─── State ───────────────────────────────────────────────────────────────────

let uploadedImageBase64 = null;
let loadingStepTimer = null;

// ─── DOM refs ────────────────────────────────────────────────────────────────

const deskPreview = document.querySelector("#deskPreview");
const imageInput = document.querySelector("#deskImageInput");
const resetImageButton = document.querySelector("#resetImageButton");
const signalGrid = document.querySelector("#signalGrid");
const analyzeButton = document.querySelector("#analyzeButton");
const randomizeButton = document.querySelector("#randomizeButton");
const exportCardButton = document.querySelector("#exportCardButton");
const copyReportButton = document.querySelector("#copyReportButton");
const toast = document.querySelector("#toast");

const loadingOverlay = document.querySelector("#loadingOverlay");
const loadingStepEl = document.querySelector("#loadingStep");
const loadingBar = document.querySelector("#loadingBar");

const configModal = document.querySelector("#configModal");
const apiConfigButton = document.querySelector("#apiConfigButton");
const apiDot = document.querySelector("#apiDot");
const apiStatusLabel = document.querySelector("#apiStatusLabel");
const aiModeBadge = document.querySelector("#aiModeBadge");
const aiModeLabel = document.querySelector("#aiModeLabel");

// ─── Config ──────────────────────────────────────────────────────────────────

const CONFIG_KEY = "deskmind_config";
const DEFAULT_CONFIG = {
  apiBase: "https://ark.cn-beijing.volces.com/api/v3",
  apiKey: "ark-0bb85c76-10e8-471e-9439-b889f1402d45-b10c7",
  model: "doubao-seed-2-0-lite-260428",
};

function loadConfig() {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      if (!saved.apiKey) saved.apiKey = DEFAULT_CONFIG.apiKey;
      return { ...DEFAULT_CONFIG, ...saved };
    }
    return { ...DEFAULT_CONFIG };
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

function saveConfig(config) {
  localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
}

function hasApiKey() {
  return Boolean(loadConfig().apiKey.trim());
}

function updateApiStatusUI() {
  const configured = hasApiKey();
  apiDot.classList.toggle("active", configured);
  apiStatusLabel.textContent = configured ? "AI 已配置" : "API 配置";
}

function updateAiModeUI() {
  const ready = uploadedImageBase64 && hasApiKey();
  aiModeBadge.classList.toggle("ai-ready", ready);
  if (ready) {
    aiModeLabel.textContent = "AI 分析模式（已上传图片 + API Key）";
  } else if (uploadedImageBase64 && !hasApiKey()) {
    aiModeLabel.textContent = "已上传图片，点击「API 配置」填写 Key 以启用 AI 分析";
  } else if (!uploadedImageBase64 && hasApiKey()) {
    aiModeLabel.textContent = "上传桌面照片后将使用 AI 真实分析";
  } else {
    aiModeLabel.textContent = "本地模式（上传图片 + 配置 API 后启用 AI 分析）";
  }
}

// ─── Config Modal ────────────────────────────────────────────────────────────

function openConfigModal() {
  const config = loadConfig();
  document.querySelector("#cfgApiBase").value = config.apiBase || DEFAULT_CONFIG.apiBase;
  document.querySelector("#cfgApiKey").value = config.apiKey || "";
  document.querySelector("#cfgModel").value = config.model || DEFAULT_CONFIG.model;
  configModal.showModal();
}

function saveConfigFromModal() {
  const config = {
    apiBase: document.querySelector("#cfgApiBase").value.trim() || DEFAULT_CONFIG.apiBase,
    apiKey: document.querySelector("#cfgApiKey").value.trim(),
    model: document.querySelector("#cfgModel").value.trim() || DEFAULT_CONFIG.model,
  };
  saveConfig(config);
  configModal.close();
  updateApiStatusUI();
  updateAiModeUI();
  showToast(config.apiKey ? "API 配置已保存 ✓" : "配置已保存（未填 API Key）");
}

apiConfigButton.addEventListener("click", openConfigModal);

document.querySelector("#configSaveBtn").addEventListener("click", saveConfigFromModal);
document.querySelector("#configCancelBtn").addEventListener("click", () => configModal.close());

document.querySelector("#toggleKeyVisibility").addEventListener("click", () => {
  const input = document.querySelector("#cfgApiKey");
  input.type = input.type === "password" ? "text" : "password";
});

document.querySelectorAll(".preset-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector("#cfgApiBase").value = btn.dataset.base;
    document.querySelector("#cfgModel").value = btn.dataset.model;
  });
});

configModal.addEventListener("click", (e) => {
  if (e.target === configModal) configModal.close();
});

// ─── Loading Overlay ─────────────────────────────────────────────────────────

function showLoadingOverlay() {
  loadingOverlay.hidden = false;
  analyzeButton.disabled = true;
  let stepIndex = 0;

  function nextStep() {
    loadingStepEl.textContent = LOADING_STEPS[stepIndex % LOADING_STEPS.length];
    stepIndex++;
  }

  nextStep();
  loadingStepTimer = setInterval(nextStep, 1800);
}

function hideLoadingOverlay() {
  loadingOverlay.hidden = true;
  analyzeButton.disabled = false;
  if (loadingStepTimer) {
    clearInterval(loadingStepTimer);
    loadingStepTimer = null;
  }
}

// ─── Utilities ───────────────────────────────────────────────────────────────

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 2800);
}

// ─── Block Bar Renderer ───────────────────────────────────────────────────────

function blockBarText(value) {
  const total = 10;
  const filled = Math.round(clamp(value) / 10);
  return "█".repeat(filled) + "░".repeat(total - filled) + " " + value + "%";
}

function setBlockBar(barId, value) {
  const el = document.querySelector(barId);
  if (el) el.textContent = blockBarText(value);
}

// ─── Signal Controls ─────────────────────────────────────────────────────────

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

// ─── Local Analysis ───────────────────────────────────────────────────────────

function calculateScores(selected) {
  const base = { moyu: 35, guolao: 30, xuming: 55 };

  selected.forEach((id) => {
    const signal = getSignal(id);
    if (!signal) return;
    Object.entries(signal.weights).forEach(([key, value]) => {
      if (key in base) base[key] += value;
    });
  });

  const count = selected.size;
  base.guolao += Math.max(0, count - 8) * 3;
  base.moyu += Math.max(0, count - 10) * 2;

  return {
    moyu: clamp(base.moyu),
    guolao: clamp(base.guolao),
    xuming: clamp(base.xuming),
  };
}

function pickPersona(selected, scores, goal) {
  return personas.find((p) => p.match(selected, scores, goal)) || fallbackPersona;
}

function buildBehavior(selected, scores, goal) {
  const lines = [];

  if (scores.guolao >= 70) {
    lines.push("过劳指数爆表，桌面正在替你承载所有未关闭的任务，快去喝点水歇一歇。");
  } else if (scores.guolao <= 30) {
    lines.push("过劳信号可控，当前桌面更像一个稳定产出场，节奏不错，继续保持。");
  } else {
    lines.push("过劳程度中等，适当整理一下桌面能换回不少注意力。");
  }

  if (scores.moyu <= 20) {
    lines.push("摸鱼指数极低，你已进入高强度专注模式，记得给自己留点喘息空间。");
  } else if (scores.moyu >= 60) {
    lines.push("摸鱼指数偏高，桌面上有太多让你分心的东西，任务在等你回来。");
  } else {
    lines.push("专注力有基础，但需要减少边缘物品的视觉拉扯，才能真正沉下去。");
  }

  if (scores.xuming <= 40) {
    lines.push("续命能力告急！健康风险值得重视，优先处理睡眠、补水、用餐和眼疲劳。");
  } else if (scores.xuming >= 70) {
    lines.push("续命能力在线，你的桌面有不少自我维护的痕迹，继续保持。");
  } else {
    lines.push("续命能力一般，记得补水和偶尔离桌活动，身体是最后的生产力。");
  }

  if (selected.has("multiScreen") || selected.has("keyboard")) {
    lines.push(goal === "work" ? "专业倾向偏创作/技术执行，你是能把想法变成现实的那种人。" : "专业倾向偏信息密集型学习，书山有路但脑容量有限。");
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
    priority.push("建立休息边界：床上只休息，桌面只处理当前任务，大脑需要空间切换。");
  }
  if (selected.has("sticky") || selected.has("books")) {
    priority.push("把任务缩成今日三件事，资料按正在用、稍后用、归档分区，减少选择焦虑。");
  }
  if (selected.has("lamp")) {
    priority.push("调整光源角度，让台灯照亮纸面或墙面，避免直射屏幕伤眼睛。");
  }
  if (scores.guolao >= 60) {
    priority.push("加入每 45 分钟一次的离桌动作：喝水、站立、远眺，身体会感谢你的。");
  }

  const goalAdvice = {
    study: "学习模式建议 35 分钟输入 + 10 分钟输出，不让阅读停在「看过」这个层级。",
    work: "工作模式建议用主屏产出、侧边参考、手机静音的三分区节奏，效率倍增。",
    rest: "作息模式建议睡前 30 分钟把桌面收尾，给大脑一个明确的关机信号。"
  };

  priority.push(goalAdvice[goal]);

  return [...new Set(priority)].slice(0, 5);
}

// ─── Shopping Links ───────────────────────────────────────────────────────────

async function fetchShoppingLinks(items) {
  if (!items || items.length === 0) return;
  const config = loadConfig();
  const spinner = document.querySelector("#shoppingSpinner");
  spinner.hidden = false;

  try {
    const response = await fetch("/api/shopping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items,
        api_key: config.apiKey,
        model: config.model || DEFAULT_CONFIG.model,
        api_base: config.apiBase || DEFAULT_CONFIG.apiBase,
      }),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const results = await response.json();
    renderShoppingLinks(results);
  } catch (err) {
    renderShoppingLinks(
      items.map((name) => ({
        name,
        desc: "点击搜索",
        platform: "淘宝",
        link: `https://s.taobao.com/search?q=${encodeURIComponent(name)}`,
        price: "",
      }))
    );
  } finally {
    spinner.hidden = true;
  }
}

function renderShoppingLinks(results) {
  const list = document.querySelector("#shoppingList");
  if (!results || results.length === 0) {
    list.innerHTML = "<li>暂无推荐商品。</li>";
    return;
  }
  list.innerHTML = results
    .map(
      (item) => `
      <li class="shopping-item">
        <a class="shopping-link" href="${item.link}" target="_blank" rel="noopener">
          <span class="shopping-name">${item.name}</span>
          <span class="shopping-meta">
            ${item.price ? `<span class="shopping-price">${item.price}</span>` : ""}
            <span class="shopping-platform">${item.platform}</span>
          </span>
          ${item.desc ? `<span class="shopping-desc">${item.desc}</span>` : ""}
        </a>
      </li>`
    )
    .join("");
}

// ─── Render Helpers ───────────────────────────────────────────────────────────

function renderList(selector, items) {
  const target = document.querySelector(selector);
  target.innerHTML = items.map((item) => `<li>${item}</li>`).join("");
}

// ─── AI API Call ──────────────────────────────────────────────────────────────

async function callAnalyzeAPI(imageBase64, intent, tone, goal) {
  const config = loadConfig();

  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      image_base64: imageBase64,
      intent: intent,
      tone: tone,
      goal: goal,
      api_key: config.apiKey,
      model: config.model || DEFAULT_CONFIG.model,
      api_base: config.apiBase || DEFAULT_CONFIG.apiBase,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(err.detail || `HTTP ${response.status}`);
  }

  return response.json();
}

// ─── Render AI Result ────────────────────────────────────────────────────────

function renderAIResult(result) {
  const { persona, scores, scene, behavior, advice, shopping, detected_signals } = result;

  const aibadge = persona.badge || "AI 分析";
  document.querySelector("#personaBadge").textContent = aibadge;
  document.querySelector("#personaNameBig").textContent = aibadge;
  document.querySelector("#personaTitle").textContent = persona.title || "桌面人格";
  document.querySelector("#roastText").textContent = persona.roast || "AI 正在思考…";

  // Update persona image
  const imgEl = document.querySelector("#personaImage");
  imgEl.src = getPersonaImage(persona.badge || "");
  imgEl.alt = (persona.badge || "人格") + " 角色图";

  setBlockBar("#moyuBar", scores.moyu ?? 40);
  setBlockBar("#guolaoBar", scores.guolao ?? 50);
  setBlockBar("#xumingBar", scores.xuming ?? 55);

  renderList("#sceneList", scene?.length ? scene : ["AI 未识别到物品，请检查图片质量。"]);
  renderList("#behaviorList", behavior?.length ? behavior : ["暂无行为推理。"]);
  renderList("#adviceList", advice?.length ? advice : ["暂无改造建议。"]);

  const detectedSet = new Set(detected_signals || []);
  signalGrid.querySelectorAll("input").forEach((input) => {
    input.checked = detectedSet.has(input.value);
  });

  document.querySelector("#shoppingList").innerHTML = "";
  fetchShoppingLinks(shopping?.length ? shopping : []);

  document.querySelector(".share-card").classList.add("ai-analyzed");
  setTimeout(() => document.querySelector(".share-card").classList.remove("ai-analyzed"), 1200);
}

// ─── Render Local Result ──────────────────────────────────────────────────────

function renderLocalResult(selected, goal, tone) {
  const scores = calculateScores(selected);
  const persona = pickPersona(selected, scores, goal);
  const selectedSignals = [...selected].map(getSignal).filter(Boolean);

  document.querySelector("#personaBadge").textContent = persona.badge;
  document.querySelector("#personaNameBig").textContent = persona.badge;
  document.querySelector("#personaTitle").textContent = persona.title;
  document.querySelector("#roastText").textContent = persona.roasts[tone] || persona.roasts.sharp;

  // Update persona image
  const imgEl = document.querySelector("#personaImage");
  imgEl.src = persona.image || "assets/sample-desk.png";
  imgEl.alt = persona.badge + " 角色图";

  setBlockBar("#moyuBar", scores.moyu);
  setBlockBar("#guolaoBar", scores.guolao);
  setBlockBar("#xumingBar", scores.xuming);

  renderList(
    "#sceneList",
    selectedSignals.length
      ? selectedSignals.slice(0, 5).map((s) => s.scene)
      : ["未选择桌面线索，当前报告使用默认人格模板。"]
  );
  renderList("#behaviorList", buildBehavior(selected, scores, goal));
  renderList("#adviceList", buildAdvice(selected, scores, goal));

  const shoppingItems = [...new Set(selectedSignals.map((s) => s.shopping))].slice(0, 6);
  document.querySelector("#shoppingList").innerHTML = "";
  fetchShoppingLinks(shoppingItems);
}

// ─── Main Analyze Entry Point ─────────────────────────────────────────────────

async function analyzeDesk() {
  const selected = getSelectedSignals();
  const goal = document.querySelector("#goalSelect").value;
  const tone = document.querySelector("#toneSelect").value;
  const intent = document.querySelector("#intentInput").value.trim();

  const useAI = uploadedImageBase64 && hasApiKey();

  if (useAI) {
    showLoadingOverlay();
    try {
      const result = await callAnalyzeAPI(uploadedImageBase64, intent, tone, goal);
      hideLoadingOverlay();
      renderAIResult(result);
      showToast("AI 报告已生成 ✓");
      document.querySelector(".result-panel").scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (err) {
      hideLoadingOverlay();
      showToast(`AI 分析失败，已切换本地模式：${err.message}`);
      renderLocalResult(selected, goal, tone);
    }
  } else {
    if (uploadedImageBase64 && !hasApiKey()) {
      showToast("请先配置 API Key（右上角 → API 配置）");
    }
    renderLocalResult(selected, goal, tone);
    if (!uploadedImageBase64) showToast("报告已生成（本地模式）");
  }
}

// ─── Randomize ───────────────────────────────────────────────────────────────

function randomizeSignals() {
  const inputs = [...signalGrid.querySelectorAll("input")];
  const count = 6 + Math.floor(Math.random() * 5);
  const pool = [...signals].sort(() => Math.random() - 0.5).slice(0, count);
  const selectedIds = new Set(pool.map((s) => s.id));

  inputs.forEach((input) => {
    input.checked = selectedIds.has(input.value);
  });

  renderLocalResult(selectedIds, document.querySelector("#goalSelect").value, document.querySelector("#toneSelect").value);
  showToast("已随机生成桌面（本地模式）");
}

// ─── Image Upload ─────────────────────────────────────────────────────────────

function handleImageUpload(event) {
  const [file] = event.target.files;
  if (!file) return;

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    deskPreview.src = reader.result;
    deskPreview.alt = `${file.name} 的桌面预览`;
    uploadedImageBase64 = reader.result;
    updateAiModeUI();
    showToast("桌面照片已载入 — 点击「生成报告」开始 AI 分析");
  });
  reader.readAsDataURL(file);
}

// ─── Export / Copy ────────────────────────────────────────────────────────────

function getReportText() {
  const badge = document.querySelector("#personaBadge").textContent;
  const title = document.querySelector("#personaTitle").textContent;
  const roast = document.querySelector("#roastText").textContent;
  const moyu = document.querySelector("#moyuBar").textContent;
  const guolao = document.querySelector("#guolaoBar").textContent;
  const xuming = document.querySelector("#xumingBar").textContent;
  const advice = [...document.querySelectorAll("#adviceList li")]
    .map((item, index) => `${index + 1}. ${item.textContent}`)
    .join("\n");

  return `DeskMind 桌面人格报告\n\n【${badge}】${title}\n${roast}\n\n🐟 摸鱼指数  ${moyu}\n🔥 过劳指数  ${guolao}\n💊 续命能力  ${xuming}\n\n桌面改造方案：\n${advice}\n\n— AI 看穿你的桌面 · DeskMind`;
}

async function copyReport() {
  const text = getReportText();
  try {
    await navigator.clipboard.writeText(text);
    showToast("报告已复制 ✓");
  } catch {
    showToast("浏览器限制了复制权限，请手动选中文本");
  }
}

// ─── Canvas Export Helpers ────────────────────────────────────────────────────

function _roundedPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function _roundedFill(ctx, x, y, w, h, r, color) {
  ctx.fillStyle = color;
  _roundedPath(ctx, x, y, w, h, r);
  ctx.fill();
}

function _drawCoverImage(ctx, img, x, y, w, h) {
  const ir = img.naturalWidth / img.naturalHeight;
  const br = w / h;
  let sx, sy, sw, sh;
  if (ir > br) {
    sh = img.naturalHeight; sw = sh * br;
    sx = (img.naturalWidth - sw) / 2; sy = 0;
  } else {
    sw = img.naturalWidth; sh = sw / br;
    sx = 0; sy = 0;
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function _wrapLines(ctx, text, maxWidth) {
  const chars = [...text];
  const lines = [];
  let line = "";
  chars.forEach((ch) => {
    const test = line + ch;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = ch;
    } else {
      line = test;
    }
  });
  if (line) lines.push(line);
  return lines;
}

function _drawWrapped(ctx, text, x, y, maxWidth, lineHeight) {
  const lines = _wrapLines(ctx, text, maxWidth);
  lines.forEach((l, i) => ctx.fillText(l, x, y + i * lineHeight));
  return lines.length;
}

// ─── Export Share Card ────────────────────────────────────────────────────────

function exportShareCard() {
  const badge = document.querySelector("#personaBadge").textContent;
  const title = document.querySelector("#personaTitle").textContent;
  const roast = document.querySelector("#roastText").textContent;
  const moyuText = document.querySelector("#moyuBar").textContent;
  const guolaoText = document.querySelector("#guolaoBar").textContent;
  const xumingText = document.querySelector("#xumingBar").textContent;
  const personaImgSrc = document.querySelector("#personaImage").src;

  showToast("正在生成分享卡…");

  const img = new Image();
  const render = (loadedImg) => _drawExportCard(loadedImg, { badge, title, roast, moyuText, guolaoText, xumingText });
  img.onload = () => render(img);
  img.onerror = () => render(null);
  img.src = personaImgSrc;
}

function _drawExportCard(personaImg, { badge, title, roast, moyuText, guolaoText, xumingText }) {
  // ──────────────────────────────────────────────────────
  //  Card layout (top → bottom):
  //  [TEXT ZONE]   DeskMind brand → badge (big) → subtitle → roast (big+bold)
  //  [IMAGE ZONE]  character image, FULLY contained, no crop
  //  [METRIC ZONE] 3 compact metric cards
  //  [FOOTER]      branding
  //
  //  KEY: TEXT_H is computed by *simulating* the exact same y-advances
  //  used during drawing, so IMG_Y never overlaps text.
  // ──────────────────────────────────────────────────────
  const W = 1080;
  const PAD = 60;

  // Font specs (single source of truth used in both measure + draw passes)
  const F_BADGE   = `900 80px "Microsoft YaHei", sans-serif`;
  const F_TITLE   = `700 36px "Microsoft YaHei", sans-serif`;
  const F_ROAST   = `700 40px "Microsoft YaHei", sans-serif`;
  const LH_BADGE  = 94;
  const LH_TITLE  = 50;
  const LH_ROAST  = 58;
  const TEXT_W    = W - PAD * 2;

  // ── Pass 1: measure line counts using a scratch context ──
  const sc = document.createElement("canvas").getContext("2d");
  // badge and label are now on the same line, so no need for badgeN
  sc.font = F_TITLE;  const titleN  = _wrapLines(sc, title, TEXT_W).length;
  sc.font = F_ROAST;  const roastN  = _wrapLines(sc, roast, TEXT_W).length;

  // ── Simulate y to compute TEXT_H exactly ──
  // Each += here MUST mirror the exact same += in the drawing pass below.
  let sy = 80;
  sy += 44 + 54;                      // "DeskMind" (44) + tagline (54)
  sy += LH_BADGE + 24;                // combined "你的桌面人格 badge" line (single line) + gap
  sy += titleN  * LH_TITLE  + 24;    // subtitle block + gap
  sy += 22;                           // divider gap
  sy += roastN  * LH_ROAST;          // roast (last baseline)
  const TEXT_H = sy + 52;            // bottom padding below last roast line

  // ── Compute total canvas height ──
  const METRIC_H = 100;
  const FOOTER_H = 56;
  const IMAGE_H  = Math.max(620, 1620 - TEXT_H - METRIC_H - FOOTER_H);
  const H        = TEXT_H + IMAGE_H + METRIC_H + FOOTER_H;

  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d");

  // ── Background ──
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, "#0c2321");
  bg.addColorStop(0.55, "#112a27");
  bg.addColorStop(1, "#0a1918");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Subtle texture dots
  ctx.fillStyle = "rgba(15, 139, 141, 0.045)";
  for (let i = 0; i < 60; i++) {
    const px = (Math.sin(i * 53.1) * 0.5 + 0.5) * W;
    const py = (Math.cos(i * 37.9) * 0.5 + 0.5) * H;
    ctx.beginPath();
    ctx.arc(px, py, 1.5 + (i % 4), 0, Math.PI * 2);
    ctx.fill();
  }

  // ── Accent bar ──
  const barGrad = ctx.createLinearGradient(0, 0, W, 0);
  barGrad.addColorStop(0, "#0f8b8d");
  barGrad.addColorStop(1, "#4c956c");
  ctx.fillStyle = barGrad;
  ctx.fillRect(0, 0, W, 12);

  // ── Pass 2: draw text (same y-advances as simulation above) ──
  let y = 80;

  // DeskMind brand
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.font = `800 40px "Microsoft YaHei", sans-serif`;
  ctx.fillText("DeskMind", PAD, y);
  y += 44;
  ctx.fillStyle = "rgba(255,255,255,0.32)";
  ctx.font = `400 22px "Microsoft YaHei", sans-serif`;
  ctx.fillText("AI 桌面人格分析室", PAD, y);
  y += 54;

  // Combined line: "你的桌面人格" (44px, muted) + badge (80px, coral) — same baseline, centered as a unit
  const F_LABEL_LINE = `700 44px "Microsoft YaHei", sans-serif`;
  const COMBO_GAP = 26;
  ctx.font = F_LABEL_LINE;
  const labelLineW = ctx.measureText("你的桌面人格").width;
  ctx.font = F_BADGE;
  const badgeLineW = ctx.measureText(badge).width;
  const comboTotalW = labelLineW + COMBO_GAP + badgeLineW;
  const comboX = Math.max(PAD, (W - comboTotalW) / 2);

  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.font = F_LABEL_LINE;
  ctx.fillText("你的桌面人格", comboX, y);

  ctx.fillStyle = "#e85d4f";
  ctx.font = F_BADGE;
  ctx.fillText(badge, comboX + labelLineW + COMBO_GAP, y);

  y += LH_BADGE + 24; // matches sy += LH_BADGE + 24

  // Subtitle
  ctx.fillStyle = "rgba(80, 215, 215, 0.9)";
  ctx.font = F_TITLE;
  const titleLinesDrawn = _drawWrapped(ctx, title, PAD, y, TEXT_W, LH_TITLE);
  y += titleLinesDrawn * LH_TITLE + 24;

  // Divider line
  const dg = ctx.createLinearGradient(PAD, 0, PAD + 220, 0);
  dg.addColorStop(0, "#0f8b8d");
  dg.addColorStop(1, "rgba(15,139,141,0)");
  ctx.fillStyle = dg;
  ctx.fillRect(PAD, y, 220, 3);
  y += 22;

  // Roast — big, bold, high contrast
  ctx.fillStyle = "rgba(255,255,255,0.88)";
  ctx.font = F_ROAST;
  _drawWrapped(ctx, roast, PAD, y, TEXT_W, LH_ROAST);

  // ── IMAGE ZONE (starts exactly at TEXT_H) ──
  const IMG_Y = TEXT_H;

  // Subtle background fill for letterbox areas
  const imgZoneBg = ctx.createLinearGradient(0, IMG_Y, 0, IMG_Y + IMAGE_H);
  imgZoneBg.addColorStop(0, "rgba(10, 40, 36, 0.5)");
  imgZoneBg.addColorStop(0.5, "rgba(8, 32, 29, 0.3)");
  imgZoneBg.addColorStop(1, "rgba(10, 40, 36, 0.5)");
  ctx.fillStyle = imgZoneBg;
  ctx.fillRect(0, IMG_Y, W, IMAGE_H);

  if (personaImg) {
    // CONTAIN: compute dimensions so the full image fits without any cropping
    const ir = personaImg.naturalWidth / personaImg.naturalHeight; // image aspect
    const zr = W / IMAGE_H;                                         // zone aspect
    let dx, dy, dw, dh;
    if (ir >= zr) {
      // image wider than zone → fit width, center vertically, bottom-align
      dw = W; dh = W / ir;
      dx = 0; dy = IMG_Y + IMAGE_H - dh;   // sit at the bottom
    } else {
      // image taller/squarer → fit height, center horizontally
      dh = IMAGE_H; dw = IMAGE_H * ir;
      dx = (W - dw) / 2; dy = IMG_Y;
    }
    ctx.drawImage(personaImg, dx, dy, dw, dh);

    // Thin gradient fade at top of image zone (blends into text)
    const topFade = ctx.createLinearGradient(0, IMG_Y, 0, IMG_Y + 80);
    topFade.addColorStop(0, "rgba(11, 35, 33, 0.6)");
    topFade.addColorStop(1, "rgba(11, 35, 33, 0)");
    ctx.fillStyle = topFade;
    ctx.fillRect(0, IMG_Y, W, 80);

    // Thin gradient fade at bottom of image zone
    const btmFade = ctx.createLinearGradient(0, IMG_Y + IMAGE_H - 80, 0, IMG_Y + IMAGE_H);
    btmFade.addColorStop(0, "rgba(11, 35, 33, 0)");
    btmFade.addColorStop(1, "rgba(11, 35, 33, 0.55)");
    ctx.fillStyle = btmFade;
    ctx.fillRect(0, IMG_Y + IMAGE_H - 80, W, 80);
  } else {
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.font = `400 36px "Microsoft YaHei", sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("人格角色图", W / 2, IMG_Y + IMAGE_H / 2);
    ctx.textAlign = "left";
  }

  // ── COMPACT METRICS ZONE ──
  const MZ_Y = TEXT_H + IMAGE_H + 10;
  const MW = (W - PAD * 2 - 20) / 3;
  const MC_H = 90;
  [
    { label: "🐟 摸鱼指数", bar: moyuText, color: "#5d8ef5" },
    { label: "🔥 过劳指数", bar: guolaoText, color: "#e85d4f" },
    { label: "💊 续命能力", bar: xumingText, color: "#4c956c" },
  ].forEach(({ label, bar, color }, i) => {
    const mx = PAD + i * (MW + 10);
    _roundedFill(ctx, mx, MZ_Y, MW, MC_H, 12, "rgba(255,255,255,0.07)");
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 1;
    _roundedPath(ctx, mx, MZ_Y, MW, MC_H, 12);
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.46)";
    ctx.font = `600 20px "Microsoft YaHei", sans-serif`;
    ctx.fillText(label, mx + 14, MZ_Y + 34);
    ctx.fillStyle = color;
    ctx.font = `700 20px "Courier New", monospace`;
    ctx.fillText(bar, mx + 14, MZ_Y + 62);
  });

  // ── FOOTER ──
  const FT_Y = H - 30;
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  ctx.font = `500 22px "Microsoft YaHei", sans-serif`;
  ctx.fillText("由 DeskMind AI 生成 · 看穿你的桌面", PAD, FT_Y);
  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(255,255,255,0.1)";
  ctx.font = `400 18px "Microsoft YaHei", sans-serif`;
  ctx.fillText("deskmind.ai", W - PAD, FT_Y);
  ctx.textAlign = "left";

  const link = document.createElement("a");
  link.download = `deskmind-${badge}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
  showToast("分享卡已导出 ✓");
}

// ─── Init ─────────────────────────────────────────────────────────────────────

createSignalControls();
updateApiStatusUI();
updateAiModeUI();
renderLocalResult(new Set(defaultSelected), "study", "sharp");

imageInput.addEventListener("change", handleImageUpload);

resetImageButton.addEventListener("click", () => {
  deskPreview.src = defaultImage;
  deskPreview.alt = "DeskMind 默认桌面样片";
  imageInput.value = "";
  uploadedImageBase64 = null;
  updateAiModeUI();
  showToast("已恢复默认样片");
});

analyzeButton.addEventListener("click", analyzeDesk);
randomizeButton.addEventListener("click", randomizeSignals);
copyReportButton.addEventListener("click", copyReport);
exportCardButton.addEventListener("click", exportShareCard);
