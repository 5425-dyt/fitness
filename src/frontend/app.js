const WORKOUTS = {
  "fat-burn": {
    easy: [
      { name: "开合跳热身", duration: "2 分钟", icon: "🦘", tip: "保持呼吸均匀，膝盖微屈" },
      { name: "高抬腿", duration: "2 分钟", icon: "🦵", tip: "抬至髋部高度即可" },
      { name: "深蹲", duration: "3 分钟", icon: "🏋️", tip: "膝盖不要超过脚尖" },
      { name: "平板支撑", duration: "1 分钟", icon: "🧱", tip: "核心收紧，身体成一条线" },
      { name: "拉伸放松", duration: "2 分钟", icon: "🧘", tip: "缓慢深呼吸，放松肌肉" },
    ],
    medium: [
      { name: "动态热身", duration: "3 分钟", icon: "🔥", tip: "活动关节，提升心率" },
      { name: "波比跳", duration: "3 分钟", icon: "💥", tip: "动作连贯，落地轻柔" },
      { name: "登山跑", duration: "3 分钟", icon: "⛰️", tip: "臀部不要翘太高" },
      { name: "深蹲跳", duration: "3 分钟", icon: "🚀", tip: "落地时屈膝缓冲" },
      { name: "核心训练", duration: "2 分钟", icon: "💪", tip: "感受腹部发力" },
      { name: "拉伸冷却", duration: "2 分钟", icon: "🧘", tip: "心率逐渐降低" },
    ],
    hard: [
      { name: "高强度热身", duration: "3 分钟", icon: "🔥", tip: "快速进入状态" },
      { name: "波比跳 ×3 组", duration: "5 分钟", icon: "💥", tip: "组间休息 15 秒" },
      { name: "深蹲跳 ×3 组", duration: "4 分钟", icon: "🚀", tip: "保持节奏稳定" },
      { name: "平板交替触肩", duration: "3 分钟", icon: "🧱", tip: "髋部尽量不动" },
      { name: "高抬腿冲刺", duration: "3 分钟", icon: "⚡", tip: "最后 30 秒全力" },
      { name: "深度拉伸", duration: "3 分钟", icon: "🧘", tip: "充分放松" },
    ],
  },
  flexibility: {
    easy: [
      { name: "颈部环绕", duration: "2 分钟", icon: "🔄", tip: "动作缓慢轻柔" },
      { name: "肩部拉伸", duration: "3 分钟", icon: "🤸", tip: "不要弹震式拉伸" },
      { name: "猫牛式", duration: "3 分钟", icon: "🐱", tip: "配合呼吸节奏" },
      { name: "坐姿前屈", duration: "3 分钟", icon: "🙇", tip: "膝盖可微弯" },
      { name: "放松冥想", duration: "2 分钟", icon: "🧘", tip: "关注身体感受" },
    ],
    medium: [
      { name: "全身热身", duration: "3 分钟", icon: "🔥", tip: "提升肌肉温度" },
      { name: "战士一式", duration: "3 分钟", icon: "🥋", tip: "后腿伸直，前膝 90°" },
      { name: "下犬式", duration: "3 分钟", icon: "🐕", tip: "脚跟尽量贴地" },
      { name: "鸽子式", duration: "3 分钟", icon: "🕊️", tip: "髋部保持水平" },
      { name: "脊柱扭转", duration: "2 分钟", icon: "🌀", tip: "呼气时加深扭转" },
      { name: "摊尸式放松", duration: "2 分钟", icon: "😌", tip: "完全放松" },
    ],
    hard: [
      { name: "流瑜伽热身", duration: "4 分钟", icon: "🌊", tip: "呼吸带动动作" },
      { name: "站立前屈", duration: "3 分钟", icon: "🙇", tip: "从髋部折叠" },
      { name: "侧角伸展", duration: "3 分钟", icon: "📐", tip: "胸腔打开" },
      { name: "轮式准备", duration: "3 分钟", icon: "🌉", tip: "量力而行" },
      { name: "深度开髋", duration: "4 分钟", icon: "🦋", tip: "不要勉强" },
      { name: "冥想收尾", duration: "3 分钟", icon: "🧘", tip: "感受身心变化" },
    ],
  },
  cardio: {
    easy: [
      { name: "原地踏步", duration: "3 分钟", icon: "👟", tip: "逐渐提升速度" },
      { name: "摆臂跳跃", duration: "2 分钟", icon: "🦘", tip: "手臂自然摆动" },
      { name: "侧步走", duration: "2 分钟", icon: "↔️", tip: "保持半蹲姿势" },
      { name: "踢腿操", duration: "3 分钟", icon: "🦵", tip: "核心保持稳定" },
      { name: "慢走冷却", duration: "2 分钟", icon: "🚶", tip: "心率逐步下降" },
    ],
    medium: [
      { name: "慢跑热身", duration: "3 分钟", icon: "🏃", tip: "鼻吸口呼" },
      { name: "开合跳", duration: "3 分钟", icon: "⭐", tip: "落地轻柔" },
      { name: "高抬腿", duration: "3 分钟", icon: "⚡", tip: "保持上身直立" },
      { name: "跳绳模拟", duration: "3 分钟", icon: "🪢", tip: "前脚掌着地" },
      { name: "冲刺间歇", duration: "2 分钟", icon: "🏁", tip: "30 秒快 30 秒慢" },
      { name: "拉伸冷却", duration: "2 分钟", icon: "🧘", tip: "放松小腿和大腿" },
    ],
    hard: [
      { name: "动态热身", duration: "3 分钟", icon: "🔥", tip: "充分活动关节" },
      { name: "波比跳", duration: "4 分钟", icon: "💥", tip: "保持高质量动作" },
      { name: "高抬腿冲刺", duration: "4 分钟", icon: "⚡", tip: "摆臂有力" },
      { name: "登山跑", duration: "4 分钟", icon: "⛰️", tip: "核心收紧" },
      { name: "Tabata 间歇", duration: "4 分钟", icon: "⏱️", tip: "20 秒全力 10 秒休息" },
      { name: "恢复拉伸", duration: "3 分钟", icon: "🧘", tip: "充分恢复" },
    ],
  },
};

const AI_RESPONSES = {
  warm: {
    greeting: "嗨！我是小伴，今天也要一起加油哦～",
    encourage: ["太棒了！继续保持这个节奏 💪", "你做得很好，呼吸不要忘～", "休息一下吧，喝口水，马上继续！"],
    tired: "累了就慢一点没关系，重要的是坚持到场。",
    done: "今日训练完成！你比昨天更强大了 🎉",
    default: "我在呢，有什么需要随时告诉我～",
  },
  coach: {
    greeting: "训练开始。注意动作标准，不要偷懒。",
    encourage: ["核心收紧！", "动作再标准一点！", "很好，保持这个频率。"],
    tired: "疲劳是成长的一部分，再坚持一组。",
    done: "训练结束。记录数据，明天继续。",
    default: "专注训练，少说话多流汗。",
  },
  fun: {
    greeting: "嘿！今天不练的话，沙发会想念你的 😄",
    encourage: ["哇哦！你是健身操界的 MVP！", "这动作帅到发光 ✨", "连 AI 都被你卷到了！"],
    tired: "累了？那咱们换个更帅的招牌动作！",
    done: "收工！今晚奖励自己一块西瓜 🍉",
    default: "有啥事？先做完这组再说～",
  },
};

const TRAINING_LIBRARY = [
  { id: "fat-burn", title: "燃脂操", meta: "15 分钟 · 有氧出汗", goal: "fat-burn", level: "medium", desc: "适合日常燃脂，节奏清晰，适合单人训练或房间共跳。" },
  { id: "cardio", title: "心肺有氧", meta: "16 分钟 · 节奏更快", goal: "cardio", level: "medium", desc: "开合跳、高抬腿、模拟跳绳组合，适合多人一起提气氛。" },
  { id: "flexibility", title: "拉伸放松", meta: "12 分钟 · 低强度", goal: "flexibility", level: "easy", desc: "适合休息日、睡前或社群放松房间。" },
];

const COMMUNITY_POSTS = [
  {
    id: "p1",
    author: "泡泡队长",
    type: "编舞分享",
    title: "8 拍入门燃脂小组合",
    body: "开合跳 2 组 + 高抬腿 2 组，适合新手房间一起跳。",
    likes: 26,
    comments: ["这个节奏很好跟！", "晚上想开一个房间试试。"],
  },
  {
    id: "p2",
    author: "奶糖",
    type: "内容分享",
    title: "拉伸房间更适合下班后",
    body: "今天试了 12 分钟拉伸，虚拟领操员动作慢一点更舒服。",
    likes: 18,
    comments: ["求房间号", "我也想加这个训练库。"],
  },
  {
    id: "p3",
    author: "闪电狐",
    type: "共跳片段",
    title: "接力共跳挑战",
    body: "每个人 30 秒即兴，最后团队同步率 82%。",
    likes: 42,
    comments: ["这个玩法可以做周榜！"],
  },
];

const SOCIAL_MODE_LABEL = {
  "free-jump": "自由共跳",
  "library-jump": "训练库共跳",
  "relay-jump": "接力共跳",
  "group-choreo": "集体编舞",
};

const PROFILE_STORAGE_KEY = "fitness-user-profile";
const DEFAULT_PROFILE = {
  name: "健身达人",
  gender: "none",
  age: "",
  height: "",
  weight: "",
  goal: "fat-burn",
  level: "medium",
  weeklyTarget: "3",
  bio: "今天也要动起来！",
};

function loadUserProfile() {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    return raw ? { ...DEFAULT_PROFILE, ...JSON.parse(raw) } : { ...DEFAULT_PROFILE };
  } catch (_) {
    return { ...DEFAULT_PROFILE };
  }
}

function saveUserProfile(profile) {
  try {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch (_) {
    // ignore storage errors
  }
}

const state = {
  goal: "fat-burn",
  level: "medium",
  workout: [],
  currentStep: 0,
  points: 120,
  streak: 3,
  minutes: 25,
  checkedIn: localStorage.getItem("fitness-home-checked-in") === "1",
  selectedTrainingId: localStorage.getItem("fitness-selected-training") || "fat-burn",
  aiStyle: "warm",
  profile: loadUserProfile(),
  social: {
    userId: localStorage.getItem("fitness-social-user-id") || "",
    userName: localStorage.getItem("fitness-social-user-name") || loadUserProfile().name || "健身达人",
    rooms: [],
    currentRoom: null,
    relayIndex: -1,
    choreographyDraft: [],
    recording: false,
  },
};

let socialWs = null;
let socialStream = null;
let socialRaf = 0;
let socialLastShoulderY = null;
let socialJumpCount = 0;
let socialMotion = 0;
let socialLastMotionSendTs = 0;
let socialLastJumpTs = 0;
let socialPrevFrame = null;
let socialFallbackPhase = 0;
let socialLastLandmarks = null;
let socialRecorder = null;
let socialRecordedChunks = [];

function showToast(msg) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("toast--show");
  setTimeout(() => toast.classList.remove("toast--show"), 2500);
}

function getWorkout() {
  return WORKOUTS[state.goal][state.level];
}

function switchTab(tab) {
  document.querySelectorAll(".nav-btn[data-tab]").forEach((btn) => {
    btn.classList.toggle("nav-btn--active", btn.dataset.tab === tab);
  });
  document.querySelectorAll(".panel").forEach((panel) => {
    panel.classList.toggle("panel--active", panel.id === `panel-${tab}`);
  });
  if (tab === "profile") renderProfilePanel();
  if (tab !== "social") stopSocialCamera();
}

function renderWorkoutPreview() {
  const list = document.getElementById("workout-preview");
  if (!list) return;
  const workout = getWorkout();
  list.innerHTML = workout
    .slice(0, 4)
    .map(
      (item) => `
      <li>
        <span class="workout-list__icon">${item.icon}</span>
        <span>${item.name}</span>
        <span class="workout-list__duration">${item.duration}</span>
      </li>`
    )
    .join("");
  if (workout.length > 4) {
    list.innerHTML += `<li style="color:var(--text-muted);font-size:0.8rem">还有 ${workout.length - 4} 个动作…</li>`;
  }
}

function renderCheckinReminder() {
  const card = document.getElementById("home-checkin-reminder");
  const copy = document.getElementById("home-checkin-copy");
  const btn = document.getElementById("btn-home-checkin");
  if (!card || !btn) return;
  card.classList.toggle("checkin-reminder--done", state.checkedIn);
  if (copy) {
    copy.textContent = state.checkedIn
      ? "今日已完成打卡，继续保持你的节奏。"
      : "完成一次训练或共跳后，来这里打卡记录你的坚持。";
  }
  btn.textContent = state.checkedIn ? "已打卡" : "立即打卡";
  btn.disabled = state.checkedIn;
}

function doHomeCheckin() {
  if (state.checkedIn) return;
  state.checkedIn = true;
  state.points += 10;
  state.streak += 1;
  localStorage.setItem("fitness-home-checked-in", "1");
  updateStats();
  renderCheckinReminder();
  showToast("打卡成功，积分 +10");
}

function renderCommunityFeed() {
  const container = document.getElementById("community-feed");
  if (!container) return;
  container.innerHTML = COMMUNITY_POSTS.map((post) => `
    <article class="community-post" data-post-id="${post.id}">
      <div class="community-post__top">
        <span class="community-post__avatar">${post.author.slice(0, 1)}</span>
        <div>
          <strong>${post.author}</strong>
          <p>${post.type}</p>
        </div>
      </div>
      <h3>${post.title}</h3>
      <p class="community-post__body">${post.body}</p>
      <div class="community-post__actions">
        <button class="btn btn--secondary btn--sm" data-like-post="${post.id}" type="button">赞 ${post.likes}</button>
        <span>${post.comments.length} 条评论</span>
      </div>
      <div class="community-comments">
        ${post.comments.map((c) => `<p>${c}</p>`).join("")}
      </div>
      <form class="community-comment-form" data-comment-form="${post.id}">
        <input type="text" placeholder="写评论..." maxlength="40" />
        <button class="btn btn--primary btn--sm" type="submit">发送</button>
      </form>
    </article>
  `).join("");

  container.querySelectorAll("[data-like-post]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const post = COMMUNITY_POSTS.find((x) => x.id === btn.dataset.likePost);
      if (!post) return;
      post.likes += 1;
      renderCommunityFeed();
    });
  });

  container.querySelectorAll("[data-comment-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const post = COMMUNITY_POSTS.find((x) => x.id === form.dataset.commentForm);
      const input = form.querySelector("input");
      const text = input?.value.trim();
      if (!post || !text) return;
      post.comments.push(text);
      renderCommunityFeed();
    });
  });
}

function renderTimeline() {
  const container = document.getElementById("workout-timeline");
  if (!container) return;
  const workout = state.workout.length ? state.workout : getWorkout();
  state.workout = workout;

  container.innerHTML = workout
    .map((item, i) => {
      let cls = "timeline-item";
      if (i < state.currentStep) cls += " timeline-item--done";
      else if (i === state.currentStep) cls += " timeline-item--active";
      const mark = i < state.currentStep ? "✓" : i + 1;
      return `
        <div class="${cls}">
          <span class="timeline-item__step">${mark}</span>
          <div>
            <div class="timeline-item__name">${item.icon} ${item.name}</div>
            <div class="timeline-item__detail">${item.tip}</div>
          </div>
          <span class="timeline-item__time">${item.duration}</span>
        </div>`;
    })
    .join("");

  const total = workout.length;
  const done = state.currentStep;
  const pct = total ? (done / total) * 100 : 0;
  const progressFill = document.getElementById("progress-fill");
  const progressText = document.getElementById("progress-text");
  if (progressFill) progressFill.style.width = `${pct}%`;
  if (progressText) progressText.textContent = done >= total ? "全部完成！🎉" : `${done} / ${total} 动作完成`;

  const btn = document.getElementById("btn-complete-step");
  if (btn) {
    btn.disabled = done >= total;
    btn.textContent = done >= total ? "训练已完成" : "完成当前动作";
  }

  const current = workout[state.currentStep];
  if (current && typeof Camera !== "undefined") {
    Camera.setExerciseTip(`当前动作：${current.name} — ${current.tip}`);
  }
  if (current && typeof Avatar !== "undefined" && !PoseEngine.isTeaching()) {
    Avatar.setPose(Avatar.getPoseFromExercise(current.name));
  } else if (done >= total && typeof Avatar !== "undefined") {
    Avatar.setPose("stretch");
  }
  if (typeof TrainMode !== "undefined") TrainMode.onExerciseChange();
}

function regenerateWorkout() {
  state.workout = getWorkout();
  state.currentStep = 0;
  renderWorkoutPreview();
  renderTimeline();
  showToast("已根据目标重新生成训练计划");
  addAiMessage(getAiLine("encourage"), "ai");
}

function getSelectedTraining() {
  return TRAINING_LIBRARY.find((x) => x.id === state.selectedTrainingId) || TRAINING_LIBRARY[0];
}

function applySelectedTraining(trainingId, showMsg = false) {
  const item = TRAINING_LIBRARY.find((x) => x.id === trainingId) || TRAINING_LIBRARY[0];
  state.selectedTrainingId = item.id;
  state.goal = item.goal;
  state.level = item.level;
  state.workout = getWorkout();
  state.currentStep = 0;
  localStorage.setItem("fitness-selected-training", item.id);
  renderTrainingLibrary();
  renderWorkoutPreview();
  renderTimeline();
  if (showMsg) showToast(`已选择：${item.title}`);
}

function renderTrainingLibrary() {
  const container = document.getElementById("training-library");
  if (!container) return;
  container.innerHTML = TRAINING_LIBRARY.map((item) => `
    <button class="training-card ${item.id === state.selectedTrainingId ? "training-card--active" : ""}" data-training-id="${item.id}" type="button">
      <strong>${item.title}</strong>
      <span>${item.meta}</span>
      <small>${item.desc}</small>
    </button>
  `).join("");
  container.querySelectorAll("[data-training-id]").forEach((btn) => {
    btn.addEventListener("click", () => applySelectedTraining(btn.dataset.trainingId, true));
  });
  const selected = getSelectedTraining();
  const title = document.getElementById("train-selected-title");
  const desc = document.getElementById("train-selected-desc");
  if (title) title.textContent = `已选择：${selected.title}`;
  if (desc) desc.textContent = selected.desc;
}

function bindTrainPageVideoUpload() {
  const zone = document.getElementById("train-page-video-zone");
  const input = document.getElementById("train-page-video-input");
  const preview = document.getElementById("train-page-video-preview");
  const info = document.getElementById("train-page-video-info");
  const progress = document.getElementById("train-page-video-progress");
  let url = "";

  async function handleFile(file) {
    if (!file) return;
    if (url) URL.revokeObjectURL(url);
    url = URL.createObjectURL(file);
    if (preview) {
      preview.src = url;
      preview.hidden = false;
    }
    if (info) info.textContent = "正在加载姿态模型...";
    if (progress) progress.style.width = "0%";
    await PoseEngine.init();
    try {
      const frames = await PoseEngine.extractFromVideo(file, (pct) => {
        if (progress) progress.style.width = `${pct}%`;
        if (info) info.textContent = `正在拆解视频 ${pct}%`;
      });
      const segments = PoseEngine.analyzeKeyframes(frames);
      if (info) info.textContent = `拆解完成：${frames.length} 帧 · ${segments.length} 个动作段。进入训练后可直接跟练。`;
      showToast("视频已拆解，可进入训练跟练");
    } catch (err) {
      if (info) info.textContent = err.message || "视频拆解失败";
      showToast("视频拆解失败");
    }
  }

  zone?.addEventListener("click", () => input?.click());
  input?.addEventListener("change", (e) => handleFile(e.target.files?.[0]));
  zone?.addEventListener("dragover", (e) => {
    e.preventDefault();
    zone.classList.add("video-upload-zone--dragover");
  });
  zone?.addEventListener("dragleave", () => zone.classList.remove("video-upload-zone--dragover"));
  zone?.addEventListener("drop", (e) => {
    e.preventDefault();
    zone.classList.remove("video-upload-zone--dragover");
    handleFile(e.dataTransfer?.files?.[0]);
  });
}

function completeStep() {
  const workout = state.workout;
  if (state.currentStep >= workout.length) return;

  state.currentStep++;
  state.points += 15;
  state.minutes += 3;
  updateStats();

  const responses = AI_RESPONSES[state.aiStyle].encourage;
  const msg = responses[Math.floor(Math.random() * responses.length)];
  addAiMessage(msg, "ai");
  const home = document.getElementById("ai-message-home");
  if (home) home.textContent = msg;

  if (state.currentStep >= workout.length) {
    showToast("恭喜完成今日训练！");
    addAiMessage(AI_RESPONSES[state.aiStyle].done, "ai");
    if (typeof Avatar !== "undefined") Avatar.setPose("stretch");
  }

  renderTimeline();
}

function updateStats() {
  document.querySelectorAll('[data-stat="points"]').forEach((el) => {
    el.textContent = state.points;
  });
  const streak = document.getElementById("stat-streak");
  const minutes = document.getElementById("stat-minutes");
  if (streak) streak.textContent = state.streak;
  if (minutes) minutes.textContent = state.minutes;
  renderProfilePanel();
}

const PROFILE_GOAL_LABELS = {
  "fat-burn": "燃脂塑形",
  flexibility: "柔韧拉伸",
  cardio: "心肺提升",
};

const PROFILE_LEVEL_LABELS = {
  easy: "初学者",
  medium: "进阶",
  hard: "挑战",
};

function renderProfilePanel() {
  const streak = document.getElementById("profile-streak");
  const points = document.getElementById("profile-points");
  const minutes = document.getElementById("profile-minutes");
  if (streak) streak.textContent = `${state.streak} 天`;
  if (points) points.textContent = `${state.points} 分`;
  if (minutes) minutes.textContent = `${state.minutes} 分钟`;

  const p = state.profile;
  const name = p.name || "健身达人";
  const desc = `目标：${PROFILE_GOAL_LABELS[p.goal] || "燃脂塑形"} · 当前等级：${PROFILE_LEVEL_LABELS[p.level] || "进阶"}`;
  const displayName = document.getElementById("profile-display-name");
  const displayDesc = document.getElementById("profile-display-desc");
  const badge = document.getElementById("profile-avatar-badge");
  if (displayName) displayName.textContent = name;
  if (displayDesc) displayDesc.textContent = desc;
  if (badge) badge.textContent = name.slice(0, 1).toUpperCase();
  document.querySelectorAll(".header__name").forEach((el) => { el.textContent = name; });
  document.querySelectorAll(".header__avatar").forEach((el) => {
    if (el.id !== "profile-avatar-badge") el.textContent = name.slice(0, 1).toUpperCase();
  });
}

function syncProfileForm() {
  const p = state.profile;
  const map = {
    "profile-name": p.name,
    "profile-gender": p.gender,
    "profile-age": p.age,
    "profile-height": p.height,
    "profile-weight": p.weight,
    "profile-goal": p.goal,
    "profile-level": p.level,
    "profile-weekly-target": p.weeklyTarget,
    "profile-bio": p.bio,
  };
  Object.entries(map).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.value = value ?? "";
  });
}

function readProfileForm() {
  return {
    name: (document.getElementById("profile-name")?.value || "健身达人").trim().slice(0, 12) || "健身达人",
    gender: document.getElementById("profile-gender")?.value || "none",
    age: document.getElementById("profile-age")?.value || "",
    height: document.getElementById("profile-height")?.value || "",
    weight: document.getElementById("profile-weight")?.value || "",
    goal: document.getElementById("profile-goal")?.value || "fat-burn",
    level: document.getElementById("profile-level")?.value || "medium",
    weeklyTarget: document.getElementById("profile-weekly-target")?.value || "3",
    bio: (document.getElementById("profile-bio")?.value || "").trim().slice(0, 36),
  };
}

function applyUserProfile(profile, showMsg = false) {
  state.profile = { ...DEFAULT_PROFILE, ...profile };
  state.goal = state.profile.goal;
  state.level = state.profile.level;
  state.social.userName = state.profile.name || "健身达人";
  localStorage.setItem("fitness-social-user-name", state.social.userName);
  saveUserProfile(state.profile);
  syncProfileForm();
  renderProfilePanel();
  state.workout = getWorkout();
  state.currentStep = 0;
  renderWorkoutPreview();
  renderTimeline();
  if (showMsg) showToast("个人资料已保存");
}

function bindProfileForm() {
  syncProfileForm();
  renderProfilePanel();
  document.getElementById("profile-form")?.addEventListener("input", () => {
    state.profile = { ...state.profile, ...readProfileForm() };
    renderProfilePanel();
  });
  document.getElementById("btn-profile-save")?.addEventListener("click", () => {
    applyUserProfile(readProfileForm(), true);
  });
}

function getAiLine(type) {
  const style = AI_RESPONSES[state.aiStyle];
  if (type === "encourage") {
    const arr = style.encourage;
    return arr[Math.floor(Math.random() * arr.length)];
  }
  return style[type] || style.default;
}

function addAiMessage(text, role = "ai") {
  const container = document.getElementById("chat-messages");
  if (!container) return;
  const div = document.createElement("div");
  div.className = `chat-msg chat-msg--${role}`;
  div.textContent = text;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function handleChatInput(text) {
  if (!text.trim()) return;
  addAiMessage(text.trim(), "user");

  let reply;
  if (/累|疲|不行|坚持不住/.test(text)) {
    reply = AI_RESPONSES[state.aiStyle].tired;
  } else if (/完成|结束|好了/.test(text)) {
    reply = AI_RESPONSES[state.aiStyle].done;
  } else if (/加油|鼓励|棒/.test(text)) {
    reply = getAiLine("encourage");
  } else {
    reply = AI_RESPONSES[state.aiStyle].default;
  }

  setTimeout(() => addAiMessage(reply, "ai"), 360);
}

function socialApiCandidates(path) {
  if (location.protocol === "file:") {
    return [`http://localhost:8766${path}`];
  }
  return [`http://${location.hostname}:8766${path}`, path];
}

async function socialFetch(path, options = {}) {
  let lastErr = null;
  for (const url of socialApiCandidates(path)) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) {
        const txt = await res.text();
        lastErr = new Error(txt || `HTTP ${res.status}`);
        continue;
      }
      return await res.json();
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr || new Error("social api unavailable");
}

function socialWsUrl(roomId, userId) {
  const protocol = location.protocol === "https:" ? "wss" : "ws";
  return `${protocol}://${location.hostname}:8766/social/ws/${roomId}/${userId}`;
}

function renderSocialRoomList() {
  const list = document.getElementById("social-room-list");
  if (!list) return;
  if (!state.social.rooms.length) {
    list.innerHTML = `<li><div class="social-room-item__meta">还没有房间，快创建一个吧～</div></li>`;
    return;
  }
  list.innerHTML = state.social.rooms
    .map((room) => `
      <li>
        <strong>${room.name}</strong>
        <div class="social-room-item__meta">
          房间号 ${room.id} · ${SOCIAL_MODE_LABEL[room.mode] || room.mode} · ${room.member_count}/${room.max_members} 人
        </div>
        <button class="btn btn--secondary btn--sm" data-join-room="${room.id}" type="button">加入房间</button>
      </li>
    `)
    .join("");

  list.querySelectorAll("[data-join-room]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await joinSocialRoom(btn.getAttribute("data-join-room"));
    });
  });
}

async function refreshSocialRooms(showMsg = false) {
  try {
    const data = await socialFetch("/social/rooms");
    state.social.rooms = data.rooms || [];
    renderSocialRoomList();
    if (showMsg) showToast("房间列表已刷新");
  } catch (_) {
    showToast("社交服务暂不可用");
  }
}

function renderSocialStats(room) {
  if (!room) return;
  const members = room.members || [];
  const me = members.find((m) => m.user_id === state.social.userId);
  const avgMotion = members.length
    ? members.reduce((sum, x) => sum + (x.motion_level || 0), 0) / members.length
    : 0;
  const relayName = members[room.relay_index]?.name || "-";

  const selfMotion = document.getElementById("social-self-motion");
  const selfJumps = document.getElementById("social-self-jumps");
  const teamSync = document.getElementById("social-team-sync");
  const relay = document.getElementById("social-relay-index");
  if (selfMotion) selfMotion.textContent = `${Math.round((me?.motion_level || 0) * 100)}%`;
  if (selfJumps) selfJumps.textContent = `${me?.jump_count || socialJumpCount || 0}`;
  if (teamSync) teamSync.textContent = `${Math.round(avgMotion * 100)}%`;
  if (relay) relay.textContent = relayName;
}

function renderSocialChoreo(steps) {
  const list = document.getElementById("social-choreo-list");
  if (!list) return;
  const data = steps?.length ? steps : state.social.choreographyDraft;
  if (!data.length) {
    list.innerHTML = `<li><span>尚未添加动作</span><span>--</span></li>`;
    return;
  }
  list.innerHTML = data
    .map((item, i) => `<li><span>${i + 1}. ${item.action}</span><span>${item.duration}s</span></li>`)
    .join("");
}

const SOCIAL_FALLBACK_SKELETONS = {
  idle: {
    nose: [0.5, 0.12],
    leftShoulder: [0.38, 0.28],
    rightShoulder: [0.62, 0.28],
    leftElbow: [0.32, 0.48],
    rightElbow: [0.68, 0.48],
    leftWrist: [0.34, 0.66],
    rightWrist: [0.66, 0.66],
    leftHip: [0.42, 0.56],
    rightHip: [0.58, 0.56],
    leftKnee: [0.4, 0.76],
    rightKnee: [0.6, 0.76],
    leftAnkle: [0.38, 0.94],
    rightAnkle: [0.62, 0.94],
  },
  jump: {
    nose: [0.5, 0.1],
    leftShoulder: [0.38, 0.26],
    rightShoulder: [0.62, 0.26],
    leftElbow: [0.26, 0.16],
    rightElbow: [0.74, 0.16],
    leftWrist: [0.18, 0.06],
    rightWrist: [0.82, 0.06],
    leftHip: [0.42, 0.56],
    rightHip: [0.58, 0.56],
    leftKnee: [0.32, 0.74],
    rightKnee: [0.68, 0.74],
    leftAnkle: [0.22, 0.92],
    rightAnkle: [0.78, 0.92],
  },
  squat: {
    nose: [0.5, 0.16],
    leftShoulder: [0.38, 0.32],
    rightShoulder: [0.62, 0.32],
    leftElbow: [0.3, 0.5],
    rightElbow: [0.7, 0.5],
    leftWrist: [0.32, 0.66],
    rightWrist: [0.68, 0.66],
    leftHip: [0.42, 0.62],
    rightHip: [0.58, 0.62],
    leftKnee: [0.32, 0.76],
    rightKnee: [0.68, 0.76],
    leftAnkle: [0.24, 0.94],
    rightAnkle: [0.76, 0.94],
  },
  run: {
    nose: [0.52, 0.12],
    leftShoulder: [0.4, 0.28],
    rightShoulder: [0.64, 0.3],
    leftElbow: [0.3, 0.4],
    rightElbow: [0.74, 0.42],
    leftWrist: [0.36, 0.54],
    rightWrist: [0.66, 0.58],
    leftHip: [0.43, 0.58],
    rightHip: [0.6, 0.58],
    leftKnee: [0.34, 0.74],
    rightKnee: [0.7, 0.72],
    leftAnkle: [0.28, 0.94],
    rightAnkle: [0.58, 0.94],
  },
  plank: {
    nose: [0.22, 0.48],
    leftShoulder: [0.34, 0.5],
    rightShoulder: [0.38, 0.56],
    leftElbow: [0.3, 0.66],
    rightElbow: [0.36, 0.72],
    leftWrist: [0.26, 0.86],
    rightWrist: [0.34, 0.88],
    leftHip: [0.58, 0.5],
    rightHip: [0.62, 0.56],
    leftKnee: [0.76, 0.54],
    rightKnee: [0.78, 0.6],
    leftAnkle: [0.94, 0.58],
    rightAnkle: [0.94, 0.66],
  },
};

function socialPoint(skeleton, name, fallbackName) {
  const p = skeleton?.[name];
  if (p && typeof p.x === "number" && typeof p.y === "number") {
    return [p.x, p.y];
  }
  return fallbackName?.[name] || SOCIAL_FALLBACK_SKELETONS.idle[name];
}

function socialLine(a, b, cls = "") {
  return `<line class="${cls}" x1="${a[0] * 100}" y1="${a[1] * 100}" x2="${b[0] * 100}" y2="${b[1] * 100}" />`;
}

function socialJoint(p, name) {
  return `<circle class="social-skeleton__joint social-skeleton__joint--${name}" cx="${p[0] * 100}" cy="${p[1] * 100}" r="2.8" />`;
}

function renderSocialCharacter(m, idx, count) {
  const pose = SOCIAL_FALLBACK_SKELETONS[m.pose] ? m.pose : "idle";
  const fallback = SOCIAL_FALLBACK_SKELETONS[pose];
  const skeleton = m.skeleton || {};
  const points = {};
  Object.keys(SOCIAL_FALLBACK_SKELETONS.idle).forEach((name) => {
    points[name] = socialPoint(skeleton, name, fallback);
  });

  const left = ((idx + 1) / (count + 1)) * 100;
  const lift = Math.round((m.motion_level || 0) * 30);
  const color = m.color || "#6ea8fe";
  const meCls = m.user_id === state.social.userId ? " social-character--me" : "";
  const lines = [
    socialLine(points.leftShoulder, points.rightShoulder, "social-skeleton__torso"),
    socialLine(points.leftShoulder, points.leftHip, "social-skeleton__torso"),
    socialLine(points.rightShoulder, points.rightHip, "social-skeleton__torso"),
    socialLine(points.leftHip, points.rightHip, "social-skeleton__torso"),
    socialLine(points.leftShoulder, points.leftElbow, "social-skeleton__limb"),
    socialLine(points.leftElbow, points.leftWrist, "social-skeleton__limb"),
    socialLine(points.rightShoulder, points.rightElbow, "social-skeleton__limb"),
    socialLine(points.rightElbow, points.rightWrist, "social-skeleton__limb"),
    socialLine(points.leftHip, points.leftKnee, "social-skeleton__limb"),
    socialLine(points.leftKnee, points.leftAnkle, "social-skeleton__limb"),
    socialLine(points.rightHip, points.rightKnee, "social-skeleton__limb"),
    socialLine(points.rightKnee, points.rightAnkle, "social-skeleton__limb"),
  ].join("");
  const joints = Object.entries(points).map(([name, p]) => socialJoint(p, name)).join("");
  const head = `<circle class="social-skeleton__head" cx="${points.nose[0] * 100}" cy="${points.nose[1] * 100 + 5}" r="7" />`;

  return `
    <div class="social-character${meCls}" style="left:calc(${left}% - 45px);bottom:${12 + (idx % 2) * 7}%;transform:translateY(-${lift}px);--member-color:${color};">
      <span class="social-character__name">${m.name}</span>
      <svg class="social-skeleton" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-label="${m.name} 的 MediaPipe 骨架">
        ${lines}
        ${head}
        ${joints}
      </svg>
      <span class="social-character__score">${Math.round((m.motion_level || 0) * 100)}%</span>
    </div>
  `;
}

function renderSocialStage(room) {
  const stage = document.getElementById("social-stage");
  if (!stage || !room) return;

  const roomName = document.getElementById("social-room-name");
  const roomCode = document.getElementById("social-room-code");
  const roomMode = document.getElementById("social-room-mode");
  if (roomName) roomName.textContent = room.name;
  if (roomCode) roomCode.textContent = room.id;
  if (roomMode) roomMode.textContent = SOCIAL_MODE_LABEL[room.mode] || room.mode;

  if (!document.getElementById("social-stage-pose-canvas")) {
    stage.innerHTML = `
      <span class="social-pane-label social-pane-label--plaza">训练同款 MediaPipe 广场</span>
      <canvas id="social-stage-pose-canvas" aria-hidden="true"></canvas>
    `;
  }

  renderSocialStats(room);
  renderSocialChoreo(room.choreography || []);
  drawSocialStagePoseCanvas(room);
}

function setSocialRoomVisible(inRoom) {
  document.getElementById("social-lobby")?.classList.toggle("hidden", inRoom);
  document.getElementById("social-room")?.classList.toggle("hidden", !inRoom);
  document.body.classList.toggle("body--social-room", inRoom);
  if (inRoom) {
    requestSocialLandscape();
  }
}

async function requestSocialLandscape() {
  try {
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen();
    }
    await screen.orientation?.lock?.("landscape");
  } catch (_) {
    // iOS/部分浏览器不允许锁定方向，CSS 会给出横屏提示。
  }
}

async function exitSocialLandscape() {
  try {
    await screen.orientation?.unlock?.();
  } catch (_) {
    // ignore
  }
  try {
    if (document.fullscreenElement && document.exitFullscreen) {
      await document.exitFullscreen();
    }
  } catch (_) {
    // ignore
  }
}

function ensureSocialUser() {
  if (!state.social.userName) {
    state.social.userName = `用户${Math.floor(Math.random() * 900 + 100)}`;
    localStorage.setItem("fitness-social-user-name", state.social.userName);
  }
}

function disconnectSocialSocket() {
  if (!socialWs) return;
  try {
    socialWs.close();
  } catch (_) {
    // ignore
  }
  socialWs = null;
}

function connectSocialSocket(roomId, userId) {
  disconnectSocialSocket();
  const url = socialWsUrl(roomId, userId);
  socialWs = new WebSocket(url);
  socialWs.onmessage = (evt) => {
    try {
      const data = JSON.parse(evt.data || "{}");
      if (data.type === "room_snapshot" || data.type === "room_update") {
        state.social.currentRoom = data.room;
        renderSocialStage(data.room);
      }
    } catch (_) {
      // ignore malformed message
    }
  };
  socialWs.onclose = () => {
    socialWs = null;
  };
}

function sendSocialSocket(payload) {
  if (socialWs && socialWs.readyState === WebSocket.OPEN) {
    socialWs.send(JSON.stringify(payload));
  }
}

async function createSocialRoom() {
  ensureSocialUser();
  requestSocialLandscape();
  const name = (document.getElementById("social-create-name")?.value || "").trim() || "元气共跳房";
  const mode = document.getElementById("social-create-mode")?.value || "free-jump";
  const workoutId = document.getElementById("social-create-workout")?.value || "improv";
  const maxMembers = parseInt(document.getElementById("social-create-max")?.value || "6", 10);

  try {
    const data = await socialFetch("/social/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        mode,
        max_members: maxMembers,
        user_name: state.social.userName,
        user_id: state.social.userId || "",
      }),
    });
    state.social.userId = data.user_id;
    localStorage.setItem("fitness-social-user-id", data.user_id);
    if (workoutId !== "improv") {
      const lib = TRAINING_LIBRARY.find((x) => x.id === workoutId) || TRAINING_LIBRARY[0];
      state.social.choreographyDraft = WORKOUTS[lib.goal][lib.level].map((x) => ({
        action: x.name,
        duration: parseInt(x.duration, 10) * 60 || 60,
      }));
      try {
        await socialFetch(`/social/rooms/${data.room.id}/choreography`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: data.user_id,
            steps: state.social.choreographyDraft,
          }),
        });
        data.room.choreography = state.social.choreographyDraft;
        data.room.mode = "library-jump";
      } catch (_) {
        // Room still works as an impromptu room if choreography publish fails.
      }
    } else {
      state.social.choreographyDraft = [];
    }
    setSocialRoomVisible(true);
    state.social.currentRoom = data.room;
    renderSocialStage(data.room);
    connectSocialSocket(data.room.id, data.user_id);
    showToast("房间创建成功，已加入共跳");
    await refreshSocialRooms();
  } catch (_) {
    showToast("创建房间失败");
  }
}

async function joinSocialRoom(roomId) {
  if (!roomId) return;
  ensureSocialUser();
  requestSocialLandscape();
  try {
    const data = await socialFetch(`/social/rooms/${roomId}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_name: state.social.userName,
        user_id: state.social.userId || "",
      }),
    });
    state.social.userId = data.user_id;
    localStorage.setItem("fitness-social-user-id", data.user_id);
    setSocialRoomVisible(true);
    state.social.currentRoom = data.room;
    renderSocialStage(data.room);
    connectSocialSocket(roomId, data.user_id);
    showToast("加入房间成功");
  } catch (_) {
    showToast("加入房间失败或房间已满");
  }
}

async function leaveSocialRoom() {
  const room = state.social.currentRoom;
  if (!room || !state.social.userId) return;
  try {
    await socialFetch(`/social/rooms/${room.id}/leave`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: state.social.userId }),
    });
  } catch (_) {
    // ignore network error when leaving
  }
  disconnectSocialSocket();
  stopSocialCamera();
  state.social.currentRoom = null;
  state.social.relayIndex = -1;
  setSocialRoomVisible(false);
  await exitSocialLandscape();
  showToast("已退出房间");
  await refreshSocialRooms();
}

function socialPoseTag(landmarks) {
  if (!landmarks || landmarks.length < 29) return "idle";
  const leftWristUp = landmarks[15]?.y < landmarks[11]?.y;
  const rightWristUp = landmarks[16]?.y < landmarks[12]?.y;
  if (leftWristUp && rightWristUp) return "jump";
  const squat = landmarks[23]?.y > 0.62 && landmarks[24]?.y > 0.62;
  if (squat) return "squat";
  return "run";
}

function socialSkeletonFromLandmarks(landmarks) {
  if (!landmarks || landmarks.length < 29) return {};
  const map = {
    nose: 0,
    leftShoulder: 11,
    rightShoulder: 12,
    leftElbow: 13,
    rightElbow: 14,
    leftWrist: 15,
    rightWrist: 16,
    leftHip: 23,
    rightHip: 24,
    leftKnee: 25,
    rightKnee: 26,
    leftAnkle: 27,
    rightAnkle: 28,
  };
  const skeleton = {};
  Object.entries(map).forEach(([name, idx]) => {
    const p = landmarks[idx];
    if (!p || (p.visibility ?? 1) < 0.2) return;
    skeleton[name] = {
      x: Math.max(0, Math.min(1, p.x)),
      y: Math.max(0, Math.min(1, p.y)),
    };
  });
  return skeleton;
}

function simplifySocialLandmarks(landmarks) {
  if (!landmarks) return [];
  return landmarks.map((p) => ({
    x: Number(Math.max(0, Math.min(1, p.x)).toFixed(5)),
    y: Number(Math.max(0, Math.min(1, p.y)).toFixed(5)),
    z: Number((p.z || 0).toFixed(5)),
    visibility: Number((p.visibility ?? 1).toFixed(3)),
  }));
}

function setSocialDetectBadge(text, mode = "idle") {
  const badge = document.getElementById("social-detect-badge");
  if (!badge) return;
  badge.textContent = text;
  badge.className = `social-detect-badge social-detect-badge--${mode}`;
}

function drawSocialLocalPose(landmarks) {
  const video = document.getElementById("social-local-video");
  const canvas = document.getElementById("social-local-pose-canvas");
  if (!video || !canvas) return;
  const rect = video.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, rect.width, rect.height);
  if (landmarks) {
    SkeletonAvatar.draw(ctx, landmarks, rect.width, rect.height, { mirror: true, wireframe: true });
  }
}

function sampleSocialVideoMotion(video) {
  if (!video || video.readyState < 2 || !video.videoWidth) return 0;
  const sample = document.createElement("canvas");
  const sw = 72;
  const sh = Math.max(40, Math.round((video.videoHeight / video.videoWidth) * sw) || 54);
  sample.width = sw;
  sample.height = sh;
  const ctx = sample.getContext("2d", { willReadFrequently: true });
  if (!ctx) return 0;
  try {
    ctx.drawImage(video, 0, 0, sw, sh);
    const data = ctx.getImageData(0, 0, sw, sh).data;
    if (!socialPrevFrame) {
      socialPrevFrame = new Uint8ClampedArray(data);
      return 0;
    }
    let diff = 0;
    for (let i = 0; i < data.length; i += 4) {
      diff += (
        Math.abs(data[i] - socialPrevFrame[i]) +
        Math.abs(data[i + 1] - socialPrevFrame[i + 1]) +
        Math.abs(data[i + 2] - socialPrevFrame[i + 2])
      ) / 3;
    }
    socialPrevFrame.set(data);
    return Math.min(1, diff / (data.length / 4) / 28);
  } catch (_) {
    return 0;
  }
}

function animatedSocialFallbackSkeleton(pose, motionLevel) {
  const base = SOCIAL_FALLBACK_SKELETONS[pose] || SOCIAL_FALLBACK_SKELETONS.run;
  socialFallbackPhase += 0.22 + motionLevel * 0.24;
  const sway = Math.sin(socialFallbackPhase) * 0.035 * Math.max(0.25, motionLevel);
  const bounce = Math.abs(Math.sin(socialFallbackPhase)) * 0.055 * motionLevel;
  const skeleton = {};
  Object.entries(base).forEach(([key, val]) => {
    let [x, y] = val;
    const isLeft = key.startsWith("left");
    const isRight = key.startsWith("right");
    const limb = /Elbow|Wrist|Knee|Ankle/.test(key);
    if (limb) {
      x += isLeft ? -sway : isRight ? sway : 0;
      y -= bounce * (key.includes("Wrist") || key.includes("Ankle") ? 1 : 0.5);
    } else {
      y -= bounce * 0.35;
    }
    skeleton[key] = {
      x: Math.max(0.02, Math.min(0.98, x)),
      y: Math.max(0.02, Math.min(0.98, y)),
    };
  });
  return skeleton;
}

function drawSocialStageStickFigure(ctx, skeleton, x, y, w, h, color, name, score) {
  const fallback = animatedSocialFallbackSkeleton("idle", 0);
  const p = (key) => {
    const point = skeleton?.[key] || fallback[key];
    return [x + point.x * w, y + point.y * h];
  };
  const lines = [
    ["leftShoulder", "rightShoulder"], ["leftShoulder", "leftHip"], ["rightShoulder", "rightHip"], ["leftHip", "rightHip"],
    ["leftShoulder", "leftElbow"], ["leftElbow", "leftWrist"], ["rightShoulder", "rightElbow"], ["rightElbow", "rightWrist"],
    ["leftHip", "leftKnee"], ["leftKnee", "leftAnkle"], ["rightHip", "rightKnee"], ["rightKnee", "rightAnkle"],
  ];
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(4, w * 0.055);
  lines.forEach(([a, b]) => {
    const pa = p(a);
    const pb = p(b);
    ctx.beginPath();
    ctx.moveTo(pa[0], pa[1]);
    ctx.lineTo(pb[0], pb[1]);
    ctx.stroke();
  });
  const nose = p("nose");
  ctx.fillStyle = color;
  ctx.strokeStyle = "rgba(255,255,255,.75)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(nose[0], nose[1] + h * 0.045, Math.max(9, w * 0.08), 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  Object.keys(fallback).forEach((key) => {
    const point = p(key);
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(point[0], point[1], Math.max(3, w * 0.025), 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });
  ctx.fillStyle = "rgba(8,12,18,.72)";
  ctx.strokeStyle = "rgba(125,241,223,.35)";
  ctx.beginPath();
  ctx.roundRect(x + w * 0.2, y - 24, w * 0.6, 20, 10);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "#eaf4ff";
  ctx.font = "700 11px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(name, x + w / 2, y - 10);
  ctx.fillStyle = "#7df1df";
  ctx.font = "700 10px sans-serif";
  ctx.fillText(`${score}%`, x + w / 2, y + h + 14);
  ctx.restore();
}

function drawSocialStagePoseCanvas(room) {
  const stage = document.getElementById("social-stage");
  const canvas = document.getElementById("social-stage-pose-canvas");
  if (!stage || !canvas || !room) return;
  const rect = stage.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, rect.width, rect.height);

  if (room.choreography?.length) {
    const leaderStep = room.choreography[Math.floor(Date.now() / 2500) % room.choreography.length];
    const poseName = Avatar.getPoseFromExercise?.(leaderStep.action) || "run";
    const leaderSkeleton = animatedSocialFallbackSkeleton(poseName, 0.72);
    drawSocialStageStickFigure(
      ctx,
      leaderSkeleton,
      rect.width * 0.5 - 58,
      rect.height * 0.06,
      116,
      Math.min(170, rect.height * 0.42),
      "#d59b38",
      "虚拟领操员",
      100
    );
    ctx.save();
    ctx.fillStyle = "rgba(47, 82, 55, .78)";
    ctx.font = "700 12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`当前领跳：${leaderStep.action}`, rect.width / 2, rect.height * 0.06 + Math.min(190, rect.height * 0.46));
    ctx.restore();
  }

  const members = room.members || [];
  const count = Math.max(1, members.length);
  members.forEach((m, idx) => {
    const slotW = Math.min(190, Math.max(112, rect.width / (count + 1) * 0.88));
    const slotH = Math.min(rect.height * 0.74, slotW * 1.55);
    const x = ((idx + 1) / (count + 1)) * rect.width - slotW / 2;
    const y = rect.height * 0.16 + (idx % 2) * 16 - (m.motion_level || 0) * 24;
    const score = Math.round((m.motion_level || 0) * 100);
    const realLandmarks = m.user_id === state.social.userId && socialLastLandmarks
      ? socialLastLandmarks
      : (Array.isArray(m.landmarks) && m.landmarks.length >= 29 ? m.landmarks : null);
    if (realLandmarks) {
      ctx.save();
      ctx.translate(x, y);
      SkeletonAvatar.draw(ctx, realLandmarks, slotW, slotH, { mirror: true, wireframe: true });
      ctx.restore();
      ctx.save();
      ctx.fillStyle = m.user_id === state.social.userId ? "#7df1df" : (m.color || "#eaf4ff");
      ctx.font = "700 12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${m.name} · ${score}%`, x + slotW / 2, y - 10);
      ctx.restore();
      return;
    }
    const pose = SOCIAL_FALLBACK_SKELETONS[m.pose] ? m.pose : "idle";
    const skeleton = Object.keys(m.skeleton || {}).length ? m.skeleton : animatedSocialFallbackSkeleton(pose, m.motion_level || 0);
    const color = m.user_id === state.social.userId ? "#7df1df" : (m.color || "#6ea8fe");
    drawSocialStageStickFigure(ctx, skeleton, x, y, slotW, slotH, color, m.name, score);
  });
}

function loopSocialMotion() {
  if (!socialStream) return;
  const video = document.getElementById("social-local-video");
  if (!video || video.readyState < 2) {
    socialRaf = requestAnimationFrame(loopSocialMotion);
    return;
  }

  let lm = null;
  const frameMotion = sampleSocialVideoMotion(video);
  try {
    lm = PoseEngine.detect(video, performance.now());
  } catch (_) {
    lm = null;
  }

  if (lm && lm.length > 16) {
    socialLastLandmarks = lm;
    drawSocialLocalPose(lm);
    const y1 = lm[11]?.y;
    const y2 = lm[12]?.y;
    if (typeof y1 === "number" && typeof y2 === "number") {
      const y = (y1 + y2) / 2;
      if (socialLastShoulderY !== null) {
        const delta = socialLastShoulderY - y;
        const now = Date.now();
        if (delta > 0.028 && now - socialLastJumpTs > 300) {
          socialJumpCount++;
          socialLastJumpTs = now;
        }
        const instant = Math.min(1, Math.abs(delta) * 20 + frameMotion * 0.65 + 0.08);
        socialMotion = socialMotion * 0.78 + instant * 0.22;
      }
      socialLastShoulderY = y;
    }
    setSocialDetectBadge("MediaPipe 骨架识别中", "live");
  } else {
    drawSocialLocalPose(null);
    const now = Date.now();
    if (frameMotion > 0.42 && now - socialLastJumpTs > 420) {
      socialJumpCount++;
      socialLastJumpTs = now;
    }
    socialMotion = socialMotion * 0.82 + frameMotion * 0.18;
    setSocialDetectBadge(frameMotion > 0.08 ? "基础动作识别中" : "等待动作", frameMotion > 0.08 ? "fallback" : "idle");
  }

  if (state.social.currentRoom) {
    drawSocialStagePoseCanvas(state.social.currentRoom);
  }

  if (Date.now() - socialLastMotionSendTs > 180) {
    socialLastMotionSendTs = Date.now();
    const pose = lm ? socialPoseTag(lm) : (socialMotion > 0.35 ? "jump" : socialMotion > 0.12 ? "run" : "idle");
    const mediaPipeSkeleton = socialSkeletonFromLandmarks(lm);
    const skeleton = Object.keys(mediaPipeSkeleton).length
      ? mediaPipeSkeleton
      : animatedSocialFallbackSkeleton(pose, socialMotion);
    sendSocialSocket({
      type: "motion_update",
      motion_level: Number(socialMotion.toFixed(3)),
      jump_count: socialJumpCount,
      pose,
      skeleton,
      landmarks: simplifySocialLandmarks(lm),
    });
  }

  socialRaf = requestAnimationFrame(loopSocialMotion);
}

async function startSocialCamera() {
  if (socialStream) return true;
  try {
    setSocialDetectBadge("正在打开摄像头", "idle");
    socialStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user", width: { ideal: 720 }, height: { ideal: 1280 } },
      audio: false,
    });
    const video = document.getElementById("social-local-video");
    if (video) {
      video.srcObject = socialStream;
      await video.play();
    }
    document.getElementById("social-video-placeholder")?.classList.add("hidden");
    await PoseEngine.init();
    socialLastShoulderY = null;
    socialJumpCount = 0;
    socialMotion = 0;
    socialPrevFrame = null;
    socialFallbackPhase = 0;
    setSocialDetectBadge(PoseEngine.isReady?.() ? "MediaPipe 准备就绪" : "基础识别模式", PoseEngine.isReady?.() ? "live" : "fallback");
    if (socialRaf) cancelAnimationFrame(socialRaf);
    socialRaf = requestAnimationFrame(loopSocialMotion);
    return true;
  } catch (_) {
    setSocialDetectBadge("摄像头不可用", "error");
    showToast("开启社交摄像头失败，请检查权限");
    return false;
  }
}

function stopSocialCamera() {
  if (socialRaf) {
    cancelAnimationFrame(socialRaf);
    socialRaf = 0;
  }
  if (socialStream) {
    socialStream.getTracks().forEach((t) => t.stop());
    socialStream = null;
  }
  const video = document.getElementById("social-local-video");
  if (video) video.srcObject = null;
  socialPrevFrame = null;
  socialLastShoulderY = null;
  setSocialDetectBadge("等待识别", "idle");
  document.getElementById("social-video-placeholder")?.classList.remove("hidden");
}

async function toggleSocialRecord() {
  const btn = document.getElementById("btn-social-record");
  if (!state.social.recording) {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
      socialRecordedChunks = [];
      socialRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });
      socialRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) socialRecordedChunks.push(e.data);
      };
      socialRecorder.onstop = () => {
        const blob = new Blob(socialRecordedChunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `cojump_${Date.now()}.webm`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        stream.getTracks().forEach((t) => t.stop());
      };
      socialRecorder.start();
      state.social.recording = true;
      if (btn) btn.textContent = "停止录屏";
      showToast("录屏中…");
    } catch (_) {
      showToast("录屏启动失败");
    }
    return;
  }

  socialRecorder?.stop();
  state.social.recording = false;
  if (btn) btn.textContent = "开始录屏";
  showToast("录屏已保存");
}

function addChoreographyStep() {
  const action = document.getElementById("social-choreo-action")?.value || "jump";
  const duration = parseInt(document.getElementById("social-choreo-duration")?.value || "12", 10);
  state.social.choreographyDraft.push({
    action,
    duration: Math.max(4, Math.min(60, duration)),
  });
  renderSocialChoreo();
}

async function publishChoreography() {
  const room = state.social.currentRoom;
  if (!room) {
    showToast("请先加入房间");
    return;
  }
  if (!state.social.choreographyDraft.length) {
    showToast("请先添加编舞动作");
    return;
  }
  try {
    await socialFetch(`/social/rooms/${room.id}/choreography`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: state.social.userId,
        steps: state.social.choreographyDraft,
      }),
    });
    showToast("编舞已发布到房间");
  } catch (_) {
    showToast("发布编舞失败");
  }
}

async function triggerRelayNext() {
  const room = state.social.currentRoom;
  if (!room) {
    showToast("请先加入房间");
    return;
  }
  try {
    await socialFetch(`/social/rooms/${room.id}/relay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: state.social.userId }),
    });
  } catch (_) {
    showToast("接力切换失败");
  }
}

async function bindSocialSquare() {
  await refreshSocialRooms();
  setSocialRoomVisible(false);
  renderSocialChoreo([]);

  const modeSelect = document.getElementById("social-create-mode");
  const workoutSelect = document.getElementById("social-create-workout");
  modeSelect?.addEventListener("change", () => {
    if (modeSelect.value === "library-jump" && workoutSelect?.value === "improv") {
      workoutSelect.value = state.selectedTrainingId || "fat-burn";
    }
    if (modeSelect.value === "free-jump" && workoutSelect) {
      workoutSelect.value = "improv";
    }
  });
  workoutSelect?.addEventListener("change", () => {
    if (workoutSelect.value !== "improv" && modeSelect) modeSelect.value = "library-jump";
    if (workoutSelect.value === "improv" && modeSelect) modeSelect.value = "free-jump";
  });

  document.getElementById("btn-social-refresh")?.addEventListener("click", () => refreshSocialRooms(true));
  document.getElementById("btn-social-create")?.addEventListener("click", createSocialRoom);
  document.getElementById("btn-social-leave")?.addEventListener("click", leaveSocialRoom);
  document.getElementById("btn-social-start")?.addEventListener("click", async () => {
    if (!state.social.currentRoom) {
      showToast("请先加入房间");
      return;
    }
    const ok = await startSocialCamera();
    if (ok) {
      sendSocialSocket({ type: "room_action", action: "start_cojump" });
      showToast("共跳已开始");
    }
  });
  document.getElementById("btn-social-relay")?.addEventListener("click", triggerRelayNext);
  document.getElementById("btn-social-record")?.addEventListener("click", toggleSocialRecord);
  document.getElementById("btn-social-add-choreo")?.addEventListener("click", addChoreographyStep);
  document.getElementById("btn-social-publish-choreo")?.addEventListener("click", publishChoreography);
}

function init() {
  state.goal = state.profile.goal;
  state.level = state.profile.level;
  state.social.userName = state.profile.name || state.social.userName || "健身达人";
  applySelectedTraining(state.selectedTrainingId, false);
  state.workout = getWorkout();
  renderWorkoutPreview();
  renderTimeline();
  bindProfileForm();
  renderProfilePanel();
  renderCheckinReminder();
  renderCommunityFeed();
  renderTrainingLibrary();
  bindTrainPageVideoUpload();
  addAiMessage(AI_RESPONSES.warm.greeting, "ai");

  if (typeof Camera !== "undefined") Camera.init();
  if (typeof Avatar !== "undefined") Avatar.init();
  if (typeof TrainMode !== "undefined") TrainMode.init();

  if (typeof VoiceAgent !== "undefined") {
    VoiceAgent.init({
      contextProvider: () => {
        const ex = state.workout?.[state.currentStep];
        return {
          exercise: ex?.name,
          tip: ex?.tip,
          style: state.aiStyle,
          userProfile: state.profile,
          avatarName: Avatar?.getName?.(),
          poseMatch: (() => {
            const t = document.getElementById("stat-match")?.textContent || "";
            const n = parseInt(t, 10);
            return Number.isNaN(n) ? 0 : n;
          })(),
          motionLevel: Camera.getMotionLevel?.() ?? 0,
        };
      },
      onReply: (reply) => {
        const home = document.getElementById("ai-message-home");
        if (home) home.textContent = reply;
      },
    });
  }

  document.querySelectorAll(".nav-btn[data-tab]").forEach((btn) => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });
  document.getElementById("btn-ai-go-profile")?.addEventListener("click", () => switchTab("profile"));

  document.getElementById("btn-start")?.addEventListener("click", () => {
    switchTab("train");
    setTimeout(() => TrainMode?.enter(), 150);
  });
  document.getElementById("btn-start-social")?.addEventListener("click", () => switchTab("social"));
  document.getElementById("btn-home-checkin")?.addEventListener("click", doHomeCheckin);

  document.getElementById("goal-select")?.addEventListener("change", (e) => {
    state.goal = e.target.value;
    regenerateWorkout();
  });

  document.getElementById("level-select")?.addEventListener("change", (e) => {
    state.level = e.target.value;
    regenerateWorkout();
  });

  document.getElementById("btn-regenerate")?.addEventListener("click", regenerateWorkout);
  document.getElementById("btn-complete-step")?.addEventListener("click", completeStep);

  document.getElementById("chat-form")?.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("chat-input");
    handleChatInput(input?.value || "");
    if (input) input.value = "";
  });

  document.querySelectorAll(".style-tag").forEach((tag) => {
    tag.addEventListener("click", () => {
      document.querySelectorAll(".style-tag").forEach((t) => t.classList.remove("style-tag--active"));
      tag.classList.add("style-tag--active");
      state.aiStyle = tag.dataset.style;
      addAiMessage(AI_RESPONSES[state.aiStyle].greeting, "ai");
    });
  });

  bindSocialSquare();
}

init();
