/**
 * 全屏沉浸训练模式编排
 */
const TrainMode = (() => {
  let open = false;
  let poseLoopId = null;
  let teachLandmarks = null;
  let teachVideoUrl = null;
  let matchScore = 0;
  let trainStartTime = 0;
  let timerInterval = null;
  const poseBuffer = [];

  const immersive = () => document.getElementById("train-immersive");

  function formatTime(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  function updateTimer() {
    if (!trainStartTime) return;
    const el = document.getElementById("immersive-timer");
    if (el) el.textContent = formatTime(Math.floor((Date.now() - trainStartTime) / 1000));
  }

  function updateMatchUI(score) {
    matchScore = score;
    const el = document.getElementById("stat-match");
    if (el) el.textContent = `${score}%`;
    const bar = document.getElementById("match-fill");
    if (bar) bar.style.width = `${score}%`;
  }

  function getCurrentExercise() {
    if (typeof state === "undefined") return null;
    return state.workout?.[state.currentStep] || null;
  }

  function updateImmersiveHeader() {
    const ex = getCurrentExercise();
    const nameEl = document.getElementById("immersive-step-name");
    const metaEl = document.getElementById("immersive-step-meta");
    if (nameEl) nameEl.textContent = ex?.name || "训练完成";
    if (metaEl) metaEl.textContent = ex ? `${ex.duration} · ${ex.tip}` : "做得好！";
  }

  function simplifyLandmarks(landmarks) {
    return landmarks.map((p) => ({
      x: Number(p.x.toFixed(5)),
      y: Number(p.y.toFixed(5)),
      z: Number((p.z || 0).toFixed(5)),
      visibility: Number((p.visibility ?? 1).toFixed(3)),
    }));
  }

  function recordPoseFrame(landmarks) {
    if (!landmarks) return;
    poseBuffer.push({
      t: Date.now(),
      landmarks: simplifyLandmarks(landmarks),
    });
    while (poseBuffer.length > 90) poseBuffer.shift();
  }

  function getMotionSequence() {
    if (poseBuffer.length) return [...poseBuffer];
    const last = PoseEngine.getLastLandmarks?.();
    return last ? [{ t: Date.now(), landmarks: simplifyLandmarks(last) }] : [];
  }

  async function poseLoop() {
    if (!open) return;
    const video = document.getElementById("camera-video");
    const overlay = document.getElementById("camera-pose-canvas");

    if (video && overlay && Camera.isActive() && PoseEngine.isReady()) {
      const lm = PoseEngine.detect(video, performance.now());
      const rect = overlay.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      overlay.width = rect.width * dpr;
      overlay.height = rect.height * dpr;
      overlay.style.width = `${rect.width}px`;
      overlay.style.height = `${rect.height}px`;
      const ctx = overlay.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (lm) {
        SkeletonAvatar.draw(ctx, lm, rect.width, rect.height, { mirror: true, wireframe: true });
        recordPoseFrame(lm);
        if (!PoseEngine.isTeaching()) {
          Avatar.setLandmarks(lm);
        }
        const target = teachLandmarks || null;
        if (target) {
          const score = PoseEngine.similarity(lm, target);
          updateMatchUI(score);
        }
      } else {
        ctx.clearRect(0, 0, rect.width, rect.height);
      }
    }

    poseLoopId = requestAnimationFrame(poseLoop);
  }

  function bindSidebarTabs() {
    document.querySelectorAll(".sidebar-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".sidebar-tab").forEach((t) => t.classList.remove("sidebar-tab--active"));
        document.querySelectorAll(".sidebar-panel").forEach((p) => p.classList.remove("sidebar-panel--active"));
        tab.classList.add("sidebar-tab--active");
        document.getElementById(`sidebar-${tab.dataset.sidebar}`)?.classList.add("sidebar-panel--active");
      });
    });
  }

  function bindVideoTeaching() {
    const zone = document.getElementById("video-upload-zone");
    const input = document.getElementById("video-file-input");
    const progressFill = document.getElementById("teach-progress-fill");
    const progressText = document.getElementById("teach-progress-text");
    const segmentsEl = document.getElementById("teach-segments");
    const preview = document.getElementById("teach-video-preview");
    const info = document.getElementById("teach-video-info");

    function resetUploadState() {
      progressFill.style.width = "0%";
      segmentsEl.innerHTML = "";
      if (info) info.textContent = "等待上传";
      if (preview) {
        preview.hidden = true;
        if (teachVideoUrl) {
          URL.revokeObjectURL(teachVideoUrl);
          teachVideoUrl = null;
        }
        preview.src = "";
      }
    }

    function updateUploadInfo(file) {
      if (!info) return;
      const seconds = file.duration ?? 0;
      const label = seconds
        ? `${file.name} · ${Math.round(seconds)}s` 
        : file.name;
      info.textContent = label;
    }

    async function handleFile(file) {
      if (!file) return;
      resetUploadState();
      if (preview) {
        teachVideoUrl = URL.createObjectURL(file);
        preview.src = teachVideoUrl;
        preview.hidden = false;
        preview.onloadedmetadata = () => updateUploadInfo(preview);
      }

      progressText.textContent = "正在加载姿态模型…";
      await PoseEngine.init();

      try {
        progressText.textContent = "正在拆解动作…";
        const frames = await PoseEngine.extractFromVideo(file, (pct) => {
          progressFill.style.width = `${pct}%`;
          progressText.textContent = `拆解中 ${pct}%`;
        });

        const segments = PoseEngine.analyzeKeyframes(frames);
        segmentsEl.innerHTML = segments
          .map((s) => `<li>动作 ${s.index}：${s.from.toFixed(1)}s - ${s.to.toFixed(1)}s</li>`)
          .join("");

        progressText.textContent = `拆解完成，共 ${frames.length} 帧 · ${segments.length} 个动作段`;
        if (info) info.textContent += ` · ${segments.length} 段`;
        showToast("视频动作已拆解，虚拟伙伴可开始带练");
        VoiceAgent.speak(`已学会 ${segments.length} 个动作，点击开始带练`);
      } catch (err) {
        progressText.textContent = err.message || "拆解失败";
        showToast("视频拆解失败");
      }
    }

    zone?.addEventListener("click", () => input?.click());
    zone?.addEventListener("dragover", (e) => {
      e.preventDefault();
      zone.classList.add("video-upload-zone--dragover");
    });
    zone?.addEventListener("dragleave", () => {
      zone.classList.remove("video-upload-zone--dragover");
    });
    zone?.addEventListener("drop", (e) => {
      e.preventDefault();
      zone.classList.remove("video-upload-zone--dragover");
      const file = e.dataTransfer?.files?.[0];
      if (file) handleFile(file);
    });

    input?.addEventListener("change", async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      await handleFile(file);
    });

    document.getElementById("btn-teach-start")?.addEventListener("click", () => {
      const ok = PoseEngine.playTeaching((landmarks, done) => {
        if (done) {
          teachLandmarks = null;
          Avatar.setLandmarks(null);
          Avatar.setPose("stretch");
          VoiceAgent.speak("跟练结束，做得很棒！");
          return;
        }
        teachLandmarks = landmarks;
        Avatar.setLandmarks(landmarks);
        const score = PoseEngine.getTeachProgress();
        progressFill.style.width = `${score}%`;
        progressText.textContent = `带练播放 ${score}%`;
      });
      if (ok) {
        VoiceAgent.speak("开始带练，跟着我的动作一起跳");
        showToast("虚拟伙伴开始带练");
      } else {
        showToast("请先上传运动视频");
      }
    });

    document.getElementById("btn-teach-stop")?.addEventListener("click", () => {
      PoseEngine.stopTeaching();
      teachLandmarks = null;
      Avatar.setLandmarks(null);
      progressText.textContent = "带练已停止";
      if (info) info.textContent = "已停止带练";
    });

    resetUploadState();
  }

  // 固定的运动伙伴库：用户从中挑选一个组合，不再走「AI 生成」
  const FIXED_CHARACTERS = [
    {
      id: "tiaotiao", name: "小跃", emoji: "🏃‍♀️", animal: "human", outfit: "tracksuit", hairStyle: "ponytail",
      style: "energetic", personality: "energetic", tag: "元气运动套装",
      colors: { fur: "#e2ad86", ear: "#3c2720", top: "#ff5d52", belly: "#253552", shoe: "#ffffff" },
      blurb: "红色运动外套与深色长裤。",
    },
    {
      id: "shandian", name: "阿拓", emoji: "⛹️‍♂️", animal: "human", outfit: "basketball", hairStyle: "short",
      style: "sporty", personality: "strict", tag: "篮球训练服",
      colors: { fur: "#9b6648", ear: "#171717", top: "#5c45e8", belly: "#29234f", shoe: "#f4f0ff" },
      blurb: "无袖球衣、运动短裤与球鞋。",
    },
    {
      id: "paopao", name: "青禾", emoji: "🧘‍♀️", animal: "human", outfit: "yoga", hairStyle: "ponytail",
      style: "healing", personality: "warm", tag: "瑜伽套装",
      colors: { fur: "#f0c5a7", ear: "#5a392d", top: "#68b89a", belly: "#315f59", shoe: "#eaf7f2" },
      blurb: "轻量上衣与包覆式瑜伽长裤。",
    },
    {
      id: "coco", name: "可可", emoji: "🏃‍♂️", animal: "human", outfit: "hoodie", hairStyle: "curly",
      style: "healing", personality: "warm", tag: "休闲连帽装",
      colors: { fur: "#744a32", ear: "#201713", top: "#e6a54b", belly: "#344255", shoe: "#fff4df" },
      blurb: "宽松连帽衫与束脚运动裤。",
    },
    {
      id: "naitang", name: "夏柠", emoji: "🎾", animal: "human", outfit: "tennis", hairStyle: "ponytail",
      style: "cute", personality: "funny", tag: "网球穿搭",
      colors: { fur: "#f2c7aa", ear: "#9b5a38", top: "#fff5e6", belly: "#ef7794", shoe: "#ffffff" },
      blurb: "运动 Polo、短裙与轻量球鞋。",
    },
    {
      id: "momo", name: "墨川", emoji: "🕺", animal: "human", outfit: "techwear", hairStyle: "short",
      style: "minimal", personality: "steady", tag: "机能训练装",
      colors: { fur: "#c78f6b", ear: "#161a20", top: "#222a37", belly: "#111827", shoe: "#71ead6" },
      blurb: "深色机能服与荧光关节线条。",
    },
  ];

  const SELECTED_CHARACTER_KEY = "fitness-selected-character";

  function characterToConfig(char) {
    return {
      name: char.name,
      presetKey: char.id,
      species: char.animal,
      style: char.style || "cute",
      personality: char.personality || "warm",
      colors: {
        fur: char.colors.fur,
        ears: char.colors.ear,
        belly: char.colors.belly,
        clothes: char.colors.top,
        shoes: char.colors.shoe,
      },
      clothes: { type: char.outfit, color: char.colors.top },
      outfit: char.outfit,
      hairStyle: char.hairStyle,
      animationStyle: "bouncy",
    };
  }

  function applyCharacterToAvatar(char) {
    Avatar.setConfig({
      name: char.name,
      animal: char.animal,
      skin: char.colors.fur,
      hairColor: char.colors.ear,
      topColor: char.colors.top,
      bottomColor: char.colors.belly,
      shoeColor: char.colors.shoe,
      outfit: char.outfit,
      hairStyle: char.hairStyle,
    });
  }

  function getSelectedCharacterId() {
    return localStorage.getItem(SELECTED_CHARACTER_KEY)
      || CharacterProfileStore.getCharacter?.()?.presetKey
      || "";
  }

  function bindCharacterGallery() {
    const gallery = document.getElementById("character-gallery");
    const status = document.getElementById("character-select-status");
    if (!gallery) return;

    function renderStatus(char) {
      if (!status) return;
      status.textContent = char
        ? `当前伙伴：${char.name} · ${char.tag}`
        : "尚未选择伙伴，点一个开始吧";
    }

    function renderGallery() {
      const selectedId = getSelectedCharacterId();
      gallery.innerHTML = FIXED_CHARACTERS.map((c) => `
        <button type="button" class="character-card ${c.id === selectedId ? "character-card--active" : ""}" data-character-id="${c.id}"
          style="--c-fur:${c.colors.fur};--c-ear:${c.colors.ear};--c-top:${c.colors.top};--c-belly:${c.colors.belly}">
          <span class="character-card__figure character-card__figure--${c.outfit}" aria-hidden="true">
            <i class="character-card__head"></i>
            <i class="character-card__torso"></i>
            <i class="character-card__arm character-card__arm--left"></i>
            <i class="character-card__arm character-card__arm--right"></i>
            <i class="character-card__leg character-card__leg--left"></i>
            <i class="character-card__leg character-card__leg--right"></i>
          </span>
          <strong class="character-card__name">${c.name}</strong>
          <span class="character-card__tag">${c.tag}</span>
          <small class="character-card__blurb">${c.blurb}</small>
        </button>
      `).join("");
      gallery.querySelectorAll("[data-character-id]").forEach((btn) => {
        btn.addEventListener("click", () => selectCharacter(btn.getAttribute("data-character-id")));
      });
      const selected = FIXED_CHARACTERS.find((c) => c.id === selectedId) || null;
      if (selected) applyCharacterToAvatar(selected);
      renderStatus(selected);
    }

    function selectCharacter(charId) {
      const char = FIXED_CHARACTERS.find((c) => c.id === charId);
      if (!char) return;
      const config = characterToConfig(char);
      applyCharacterToAvatar(char);
      // 立即本地保存，保证离线 / file:// 下也可用
      CharacterProfileStore.save({ character_id: `fixed-${char.id}`, character: config });
      localStorage.setItem(SELECTED_CHARACTER_KEY, char.id);
      renderGallery();
      showToast(`已选择伙伴：${char.name}`);
      VoiceAgent.speak?.(`你选择了${char.name}，接下来我陪你一起运动。`);
      // 后端可用时同步一份 Current Character（best-effort）
      VoiceAgent.createCharacterProfile?.(config)
        .then((res) => {
          if (res?.ok) {
            CharacterProfileStore.save({ character_id: res.data.character_id, character: res.data.character });
          }
        })
        .catch(() => { /* 后端不可用则忽略，本地已保存 */ });
    }

    renderGallery();
  }

  async function enter() {
    open = true;
    immersive()?.classList.remove("hidden");
    document.body.classList.add("body--immersive");
    updateImmersiveHeader();
    trainStartTime = Date.now();
    timerInterval = setInterval(updateTimer, 1000);

    await PoseEngine.init();
    poseLoop();

    if (!Camera.isActive()) {
      await Camera.start();
    }

    const ex = getCurrentExercise();
    if (ex && typeof Avatar !== "undefined") {
      Avatar.setPose(Avatar.getPoseFromExercise(ex.name));
    }

    VoiceAgent.speak(`${Avatar.getName()}已就位，准备好就开始吧`);
    requestAnimationFrame(() => SkeletonAvatar.renderAll());
  }

  function exit() {
    open = false;
    immersive()?.classList.add("hidden");
    document.body.classList.remove("body--immersive");
    if (poseLoopId) cancelAnimationFrame(poseLoopId);
    poseLoopId = null;
    if (timerInterval) clearInterval(timerInterval);
    PoseEngine.stopTeaching();
    teachLandmarks = null;
    Camera.stop();
  }

  async function init() {
    await CharacterProfileStore.syncFromBackend?.();
    bindSidebarTabs();
    bindVideoTeaching();
    bindCharacterGallery();
    if (!getSelectedCharacterId()) {
      showToast("可在“我的”里挑选一个运动伙伴形象");
    }

    document.getElementById("btn-enter-immersive")?.addEventListener("click", enter);
    document.getElementById("btn-exit-immersive")?.addEventListener("click", exit);

    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.dataset.tab !== "train" && open) exit();
      });
    });
  }

  function onExerciseChange() {
    updateImmersiveHeader();
    const ex = getCurrentExercise();
    if (!ex) return;
    if (PoseEngine.isTeaching()) return;
    Avatar.setPose(Avatar.getPoseFromExercise(ex.name));
    Camera.setExerciseTip(`${ex.name} — ${ex.tip}`);
    VoiceAgent.speak(`下一个动作：${ex.name}`);
  }

  function isOpen() {
    return open;
  }

  return { init, enter, exit, onExerciseChange, isOpen, updateMatchUI };
})();
