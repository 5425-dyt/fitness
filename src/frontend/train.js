/**
 * 全屏沉浸训练模式编排
 */
const TrainMode = (() => {
  let open = false;
  let poseLoopId = null;
  let teachLandmarks = null;
  let matchScore = 0;
  let trainStartTime = 0;
  let timerInterval = null;

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

    zone?.addEventListener("click", () => input?.click());

    input?.addEventListener("change", async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

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
        showToast("视频动作已拆解，可开始跟练教学");
        VoiceAgent.speak(`已学会 ${segments.length} 个动作，点击开始带练`);
      } catch (err) {
        progressText.textContent = err.message || "拆解失败";
        showToast("视频拆解失败");
      }
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
    });
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

  function init() {
    bindSidebarTabs();
    bindVideoTeaching();

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
