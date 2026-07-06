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

const FRIENDS = [
  { name: "小明", avatar: "明", action: "完成了 20 分钟燃脂训练", time: "10 分钟前" },
  { name: "小红", avatar: "红", action: "打卡第 7 天，获得徽章", time: "30 分钟前" },
  { name: "阿杰", avatar: "杰", action: "邀请你加入联机房间", time: "1 小时前" },
];

const LEADERBOARD = [
  { name: "小红", points: 580 },
  { name: "你", points: 420 },
  { name: "小明", points: 390 },
  { name: "阿杰", points: 310 },
];

const state = {
  goal: "fat-burn",
  level: "medium",
  workout: [],
  currentStep: 0,
  points: 120,
  streak: 3,
  minutes: 25,
  checkedIn: false,
  aiStyle: "warm",
};

function getWorkout() {
  return WORKOUTS[state.goal][state.level];
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("toast--show");
  setTimeout(() => toast.classList.remove("toast--show"), 2500);
}

function switchTab(tab) {
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.toggle("nav-btn--active", btn.dataset.tab === tab);
  });
  document.querySelectorAll(".panel").forEach((panel) => {
    panel.classList.toggle("panel--active", panel.id === `panel-${tab}`);
  });
}

function renderWorkoutPreview() {
  const list = document.getElementById("workout-preview");
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

function renderTimeline() {
  const container = document.getElementById("workout-timeline");
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
  document.getElementById("progress-fill").style.width = `${pct}%`;
  document.getElementById("progress-text").textContent =
    done >= total ? "全部完成！🎉" : `${done} / ${total} 动作完成`;

  const btn = document.getElementById("btn-complete-step");
  btn.disabled = done >= total;
  btn.textContent = done >= total ? "训练已完成" : "完成当前动作";

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
  if (typeof Avatar !== "undefined") {
    const first = state.workout[0];
    Avatar.setPose(first ? Avatar.getPoseFromExercise(first.name) : "idle");
  }
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
  document.getElementById("ai-message-home").textContent = msg;

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
  document.getElementById("stat-streak").textContent = state.streak;
  document.getElementById("stat-minutes").textContent = state.minutes;
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
  const div = document.createElement("div");
  div.className = `chat-msg chat-msg--${role}`;
  div.textContent = text;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function handleChatInput(text) {
  if (!text.trim()) return;
  addAiMessage(text.trim(), "user");

  const lower = text.toLowerCase();
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

  setTimeout(() => addAiMessage(reply, "ai"), 400);
}

function doCheckin() {
  if (state.checkedIn) {
    showToast("今天已经打过卡啦");
    return;
  }
  state.checkedIn = true;
  state.points += 10;
  state.streak += 1;
  updateStats();

  const card = document.querySelector(".checkin-card");
  card.classList.add("checkin-card--done");
  document.getElementById("checkin-status").textContent = "今日已打卡 ✓ 继续保持！";
  document.getElementById("btn-checkin").disabled = true;
  document.getElementById("btn-checkin").textContent = "已打卡";
  showToast("打卡成功！+10 积分");
}

function renderFriends() {
  document.getElementById("friend-feed").innerHTML = FRIENDS.map(
    (f) => `
    <li>
      <span class="friend-feed__avatar">${f.avatar}</span>
      <div>
        <strong>${f.name}</strong>
        <div style="color:var(--text-muted);font-size:0.8rem">${f.action}</div>
      </div>
      <span class="friend-feed__time">${f.time}</span>
    </li>`
  ).join("");
}

function renderLeaderboard() {
  const sorted = [...LEADERBOARD].sort((a, b) => b.points - a.points);
  document.getElementById("leaderboard").innerHTML = sorted
    .map(
      (item) => `
      <li>
        <span>${item.name}</span>
        <span class="leaderboard__points">${item.points} 分</span>
      </li>`
    )
    .join("");
}

function init() {
  state.workout = getWorkout();
  renderWorkoutPreview();
  renderTimeline();
  renderFriends();
  renderLeaderboard();
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

  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });

  document.getElementById("btn-start")?.addEventListener("click", () => {
    switchTab("train");
    setTimeout(() => TrainMode?.enter(), 150);
  });

  document.getElementById("goal-select").addEventListener("change", (e) => {
    state.goal = e.target.value;
    regenerateWorkout();
  });

  document.getElementById("level-select").addEventListener("change", (e) => {
    state.level = e.target.value;
    regenerateWorkout();
  });

  document.getElementById("btn-regenerate").addEventListener("click", regenerateWorkout);
  document.getElementById("btn-complete-step").addEventListener("click", completeStep);

  document.getElementById("chat-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = document.getElementById("chat-input");
    handleChatInput(input.value);
    input.value = "";
  });

  document.querySelectorAll(".style-tag").forEach((tag) => {
    tag.addEventListener("click", () => {
      document.querySelectorAll(".style-tag").forEach((t) => t.classList.remove("style-tag--active"));
      tag.classList.add("style-tag--active");
      state.aiStyle = tag.dataset.style;
      addAiMessage(AI_RESPONSES[state.aiStyle].greeting, "ai");
    });
  });

  document.getElementById("btn-checkin").addEventListener("click", doCheckin);
}

init();
