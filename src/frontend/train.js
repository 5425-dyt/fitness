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

  function bindPhotoAnimate() {
    const zone = document.getElementById('photo-upload-zone');
    const input = document.getElementById('photo-file-input');
    const preview = document.getElementById('photo-preview');
    const status = document.getElementById('photo-status');
    const btnGen = document.getElementById('btn-generate-animate');
    const btnClear = document.getElementById('btn-clear-animate');
    let lastFile = null;
    let photoUrl = null;

    zone?.addEventListener('click', () => input?.click());
    input?.addEventListener('change', (e) => {
      const f = e.target.files?.[0];
      if (!f) return;
      lastFile = f;
      if (photoUrl) URL.revokeObjectURL(photoUrl);
      photoUrl = URL.createObjectURL(f);
      if (preview) { preview.src = photoUrl; preview.hidden = false; }
      Avatar.setPhoto(photoUrl);
      if (status) status.textContent = '已选择照片，训练时会实时跟随你的动作';
      showToast('照片形象已启用');
    });

    btnGen?.addEventListener('click', async () => {
      if (!lastFile) { showToast('请先选择照片'); return; }
      if (status) status.textContent = '正在提交后端生成任务…';
      const res = await VoiceAgent.uploadPhoto(lastFile, getMotionSequence());
      if (!res.ok) {
        showToast('后端暂不可用，已使用本地 2D 跟练');
        status.textContent = `本地 2D 跟练已启用；后端未连接：${res.error || '上传失败'}`;
        return;
      }

      const data = res.data || {};
      status.textContent = data.message || '已提交姿态驱动生成任务；当前继续使用本地实时预览';
      if (data.animation_url) {
        Avatar.play2DAnimation(data.animation_url);
        showToast('MagicAnimate 动画已加载');
      } else if (data.task_id) {
        showToast('MagicAnimate 输入已提交');
      } else if (data.preview_url) {
        Avatar.setPhoto(data.preview_url);
        showToast('后端已保存参考图和动作序列');
      } else {
        showToast('已提交后端，当前使用本地 2D 跟练');
      }
    });

    btnClear?.addEventListener('click', () => {
      if (preview) { preview.hidden = true; preview.src = ''; }
      const stage = document.getElementById('avatar-stage');
      const old = stage?.querySelector('.avatar-2d-anim');
      if (old) old.remove();
      if (photoUrl) {
        URL.revokeObjectURL(photoUrl);
        photoUrl = null;
      }
      Avatar.clearPhoto();
      if (status) status.textContent = '已清除';
      lastFile = null;
      if (input) input.value = "";
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
    bindPhotoAnimate();

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
