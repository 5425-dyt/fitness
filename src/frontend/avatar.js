/**
 * 虚拟伙伴：人形角色与运动穿搭配置
 */
const Avatar = (() => {
  const STORAGE_KEY = "fitness-avatar-config";

  const DEFAULT = {
    name: "小跃",
    skin: "#d9a17c",
    hairColor: "#36261f",
    hairStyle: "short",
    topColor: "#ff6b4a",
    bottomColor: "#263754",
    shoeColor: "#f5f5f5",
    outfit: "tracksuit",
    animal: "human",
  };

  let config = { ...DEFAULT };
  let currentPose = "idle";
  let photoUrl = "";

  const POSE_LABELS = {
    idle: "待机蹦跶",
    jump: "蹦蹦跳",
    squat: "深蹲蹲",
    stretch: "伸懒腰",
    run: "快跑呀",
    plank: "趴趴练",
  };

  const ANIMAL_NAMES = { human: "人形伙伴", bunny: "小兔", cat: "小猫", bear: "小熊" };

  function applySkeletonConfig() {
    SkeletonAvatar.setConfig({
      fur: config.skin,
      ear: config.hairColor,
      accent: config.topColor,
      belly: config.bottomColor,
      lower: config.bottomColor,
      shoe: config.shoeColor,
      outfit: config.outfit,
      hairStyle: config.hairStyle,
      animal: config.animal,
    });
  }

  function updateNameLabels() {
    document.querySelectorAll("[data-avatar-name]").forEach((el) => {
      el.textContent = config.name;
    });
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (_) { /* ignore */ }
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) config = { ...DEFAULT, ...JSON.parse(raw) };
    } catch (_) {
      config = { ...DEFAULT };
    }
  }

  function setConfig(partial) {
    config = { ...config, ...partial };
    save();
    applySkeletonConfig();
    updateNameLabels();
    syncForm();
  }

  function setPose(pose) {
    const valid = ["idle", "jump", "squat", "stretch", "run", "plank"];
    currentPose = valid.includes(pose) ? pose : "idle";
    SkeletonAvatar.setPresetPose(currentPose);
    if (!PoseEngine?.isTeaching?.()) {
      SkeletonAvatar.clearLandmarks();
    }
    const label = document.getElementById("duo-pose-label");
    if (label) label.textContent = POSE_LABELS[currentPose] || "待机";
  }

  function setLandmarks(lm) {
    if (lm) {
      SkeletonAvatar.setLandmarks(lm);
    } else {
      SkeletonAvatar.clearLandmarks();
      SkeletonAvatar.setPresetPose(currentPose);
    }
  }

  function setPhoto(url) {
    photoUrl = url || "";
    // Character Identity 模式下，上传照片仅用于后端角色建模，不再直接贴图到虚拟形象
    document.getElementById("avatar-stage")?.querySelector(".avatar-2d-anim")?.remove();
    document.getElementById("avatar-preview")?.querySelector(".avatar-2d-anim")?.remove();
  }

  function clearPhoto() {
    photoUrl = "";
    setPose(currentPose);
  }

  function getPoseFromExercise(name) {
    if (/开合跳|跳跃|波比|深蹲跳|摆臂跳/.test(name)) return "jump";
    if (/深蹲|半蹲|侧步/.test(name)) return "squat";
    if (/拉伸|前屈|瑜伽|放松|猫牛|下犬|鸽子|扭转|冥想|摊尸|开髋|轮式/.test(name)) return "stretch";
    if (/高抬腿|登山|踏步|慢跑|冲刺|间歇|跳绳|热身|流瑜伽/.test(name)) return "run";
    if (/平板|支撑|触肩|核心/.test(name)) return "plank";
    return "idle";
  }

  function syncForm() {
    const map = {
      "avatar-name": config.name,
      "avatar-skin": config.skin,
      "avatar-hair-color": config.hairColor,
      "avatar-top": config.topColor,
      "avatar-bottom": config.bottomColor,
    };
    Object.entries(map).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el) el.value = val;
    });
    const animalSelect = document.getElementById("avatar-animal");
    if (animalSelect) animalSelect.value = config.animal;
  }

  function bindCustomizer() {
    const form = document.getElementById("avatar-form");
    if (!form) return;

    form.addEventListener("input", (e) => {
      const t = e.target;
      if (!t.id?.startsWith("avatar-")) return;
      const updates = {};
      switch (t.id) {
        case "avatar-name": updates.name = t.value.slice(0, 8) || DEFAULT.name; break;
        case "avatar-skin": updates.skin = t.value; break;
        case "avatar-hair-color": updates.hairColor = t.value; break;
        case "avatar-animal": updates.animal = t.value; break;
        case "avatar-top": updates.topColor = t.value; break;
        case "avatar-bottom": updates.bottomColor = t.value; break;
        default: return;
      }
      setConfig(updates);
    });

    document.getElementById("btn-avatar-reset")?.addEventListener("click", () => {
      config = { ...DEFAULT };
      save();
      applySkeletonConfig();
      updateNameLabels();
      syncForm();
    });
  }

  function mount(selector, options) {
    SkeletonAvatar.mount(selector, options);
  }

  function init() {
    load();
    if (!config.name || config.name === "小伴") config.name = DEFAULT.name;
    applySkeletonConfig();
    mount("#avatar-stage", { mirror: false });
    mount("#avatar-preview", { mirror: false });
    updateNameLabels();
    syncForm();
    bindCustomizer();
    clearPhoto();
    setPose("idle");
  }

  // 支持加载 2D 动画（后端生成的视频或 gif），在 avatar-stage 小角落播放
  function play2DAnimation(url) {
    const stage = document.getElementById("avatar-stage");
    if (!stage) return;
    // 移除旧的动画
    const old = stage.querySelector('.avatar-2d-anim');
    if (old) old.remove();

    const el = document.createElement('video');
    el.className = 'avatar-2d-anim';
    el.src = url;
    el.autoplay = true;
    el.loop = true;
    el.muted = true;
    el.style.width = '100%';
    el.style.height = '100%';
    el.style.objectFit = 'cover';
    stage.appendChild(el);
  }

  return {
    init,
    mount,
    setPose,
    setLandmarks,
    setPhoto,
    clearPhoto,
    setConfig,
    getConfig: () => ({ ...config }),
    getName: () => config.name,
    getAnimalLabel: () => ANIMAL_NAMES[config.animal] || "小伙伴",
    getPoseFromExercise,
    getCurrentPose: () => currentPose,
    play2DAnimation,
  };
})();
