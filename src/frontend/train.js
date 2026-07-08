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
    const status = document.getElementById('photo-status');
    const stepLabel = document.getElementById("avatar-wizard-step");
    const prevBtn = document.getElementById("btn-wizard-prev");
    const nextBtn = document.getElementById("btn-wizard-next");
    const btnGen = document.getElementById('btn-generate-animate');
    const btnClear = document.getElementById('btn-clear-animate');
    const steps = Array.from(document.querySelectorAll(".wizard-step"));
    let step = 1;

    function setStep(v) {
      step = Math.min(Math.max(v, 1), 8);
      steps.forEach((el, idx) => { el.hidden = idx !== step - 1; });
      if (stepLabel) stepLabel.textContent = `Step ${step} / 8`;
      if (prevBtn) prevBtn.disabled = step === 1;
      if (nextBtn) nextBtn.disabled = step === 8;
    }

    function readWizardConfig() {
      return {
        species: document.getElementById("wizard-species")?.value || "bunny",
        style: document.getElementById("wizard-style")?.value || "cute",
        colors: {
          fur: document.getElementById("wizard-color-fur")?.value || "#f5c6a0",
          belly: document.getElementById("wizard-color-belly")?.value || "#ffe8d6",
          ears: document.getElementById("wizard-color-ears")?.value || "#e8a87c",
          nose: document.getElementById("wizard-color-nose")?.value || "#e88f8f",
          paws: document.getElementById("wizard-color-paws")?.value || "#f7d8be",
          tail: document.getElementById("wizard-color-tail")?.value || "#f3c2a0",
          eyes: document.getElementById("wizard-color-eyes")?.value || "#2a2018",
          clothes: document.getElementById("wizard-clothes-color")?.value || "#ff6b4a",
        },
        body: {
          ears: document.getElementById("wizard-ears")?.value || "long",
          tail: document.getElementById("wizard-tail")?.value || "fluffy",
          size: document.getElementById("wizard-size")?.value || "standard",
          eyes: document.getElementById("wizard-eyes-shape")?.value || "round",
        },
        clothes: {
          type: document.getElementById("wizard-clothes-type")?.value || "sportswear",
          color: document.getElementById("wizard-clothes-color")?.value || "#ff6b4a",
        },
        accessories: {
          hat: document.getElementById("wizard-acc-hat")?.value || "none",
          scarf: document.getElementById("wizard-acc-scarf")?.value || "none",
          glasses: document.getElementById("wizard-acc-glasses")?.value || "none",
          headband: document.getElementById("wizard-acc-headband")?.value || "none",
          headphones: document.getElementById("wizard-acc-headphones")?.value || "none",
          backpack: document.getElementById("wizard-acc-backpack")?.value || "none",
          wristband: document.getElementById("wizard-acc-wristband")?.value || "none",
        },
        personality: document.getElementById("wizard-personality")?.value || "warm",
        voice: { provider: "reserved", style: document.getElementById("wizard-voice-style")?.value || "reserved" },
        animationStyle: "bouncy",
        promptTemplate: "",
      };
    }

    function applyCharacterPreview(config) {
      Avatar.setConfig({
        animal: config.species === "robot" ? "bear" : (["bunny", "cat", "bear"].includes(config.species) ? config.species : "bunny"),
        skin: config.colors.fur,
        hairColor: config.colors.ears,
        topColor: config.colors.clothes,
        bottomColor: config.colors.belly,
      });
    }

    function setWizardFromCharacter(character) {
      if (!character) return;
      const set = (id, val) => {
        const el = document.getElementById(id);
        if (el && val != null) el.value = val;
      };
      set("wizard-species", character.species);
      set("wizard-style", character.style);
      set("wizard-color-fur", character.colors?.fur);
      set("wizard-color-belly", character.colors?.belly);
      set("wizard-color-ears", character.colors?.ears);
      set("wizard-color-nose", character.colors?.nose);
      set("wizard-color-paws", character.colors?.paws);
      set("wizard-color-tail", character.colors?.tail);
      set("wizard-color-eyes", character.colors?.eyes);
      set("wizard-ears", character.body?.ears);
      set("wizard-tail", character.body?.tail);
      set("wizard-size", character.body?.size);
      set("wizard-eyes-shape", character.body?.eyes);
      set("wizard-clothes-type", character.clothes?.type);
      set("wizard-clothes-color", character.clothes?.color || character.colors?.clothes);
      set("wizard-acc-hat", character.accessories?.hat);
      set("wizard-acc-scarf", character.accessories?.scarf);
      set("wizard-acc-glasses", character.accessories?.glasses);
      set("wizard-acc-headband", character.accessories?.headband);
      set("wizard-acc-headphones", character.accessories?.headphones);
      set("wizard-acc-backpack", character.accessories?.backpack);
      set("wizard-acc-wristband", character.accessories?.wristband);
      set("wizard-personality", character.personality);
      set("wizard-voice-style", character.voice?.style);
    }

    function wireWizardLivePreview() {
      document.querySelectorAll(".wizard-step input, .wizard-step select").forEach((el) => {
        el.addEventListener("input", () => applyCharacterPreview(readWizardConfig()));
        el.addEventListener("change", () => applyCharacterPreview(readWizardConfig()));
      });
    }

    prevBtn?.addEventListener("click", () => setStep(step - 1));
    nextBtn?.addEventListener("click", () => setStep(step + 1));
    setStep(1);
    wireWizardLivePreview();
    const existingCharacter = CharacterProfileStore.getCharacter?.();
    if (existingCharacter) setWizardFromCharacter(existingCharacter);
    applyCharacterPreview(readWizardConfig());

    btnGen?.addEventListener('click', async () => {
      const existingProfile = CharacterProfileStore.load();
      const config = readWizardConfig();
      applyCharacterPreview(config);

      if (status) status.textContent = '正在创建并保存角色配置…';
      const profileRes = await VoiceAgent.createCharacterProfile(config);
      if (!profileRes.ok) {
        showToast('角色创建失败');
        status.textContent = `后端未连接：${profileRes.error || 'character config 接口不可用'}`;
        return;
      }

      const profileRecord = {
        character_id: profileRes.data.character_id,
        character: profileRes.data.character || {},
      };
      CharacterProfileStore.save(profileRecord);

      const sceneSpec = PromptBuilder.buildSceneSpec({
        scene: "training studio",
        action: "standing with relaxed posture",
        lighting: "soft key light",
        camera: "medium shot",
        mood: "energetic",
        outfit: "sportswear",
      });
      if (status) status.textContent = '角色已保存，正在使用新角色进行首次生成…';
      const genRes = await VoiceAgent.generateWithProfile(profileRecord.character_id, sceneSpec);
      if (!genRes.ok) {
        showToast('角色生成失败');
        status.textContent = `角色已保存，但生成接口不可用：${genRes.error || 'unknown'}`;
      } else {
        status.textContent = `角色已保存（ID: ${profileRecord.character_id.slice(0, 8)}，一致性 ${genRes.data.identity_similarity || "--"}%）。`;
        showToast('AI 陪伴角色创建成功');
      }
    });

    btnClear?.addEventListener('click', () => {
      const stage = document.getElementById('avatar-stage');
      const old = stage?.querySelector('.avatar-2d-anim');
      if (old) old.remove();
      Avatar.clearPhoto();
      CharacterProfileStore.clear();
      if (status) status.textContent = '已重置角色创建流程';
      setStep(1);
      applyCharacterPreview(readWizardConfig());
    });

    document.querySelectorAll("[data-preset]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const presetId = btn.getAttribute("data-preset");
        if (!presetId) return;
        if (status) status.textContent = `正在套用模板 ${presetId}...`;
        const res = await VoiceAgent.createCharacterProfile({}, presetId);
        if (!res.ok) {
          showToast("模板应用失败");
          status.textContent = `模板失败：${res.error || "接口不可用"}`;
          return;
        }
        const record = { character_id: res.data.character_id, character: res.data.character || {} };
        CharacterProfileStore.save(record);
        setWizardFromCharacter(record.character);
        applyCharacterPreview({
          species: record.character.species || "bunny",
          colors: {
            fur: record.character.colors?.fur || "#f5c6a0",
            ears: record.character.colors?.ears || "#e8a87c",
            belly: record.character.colors?.belly || "#ffe8d6",
            clothes: record.character.colors?.clothes || "#ff6b4a",
          },
        });
        status.textContent = `模板已应用：${presetId}（ID: ${record.character_id.slice(0, 8)}）`;
        showToast("模板角色创建成功");
      });
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

  async function init() {
    await CharacterProfileStore.syncFromBackend?.();
    bindSidebarTabs();
    bindVideoTeaching();
    bindPhotoAnimate();
    if (!CharacterProfileStore.getProfileId?.()) {
      document.querySelector('.sidebar-tab[data-tab="ai"]')?.click();
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
