/**
 * 摄像头跟练模块：getUserMedia + 画面叠加 + 基础动作幅度检测
 */
const Camera = (() => {
  let stream = null;
  let active = false;
  let rafId = null;
  let prevFrame = null;
  let motionLevel = 0;
  let currentTip = "站在画面中央，全身入镜效果更佳";
  let onMotionFeedback = null;

  const video = () => document.getElementById("camera-video");
  const overlay = () => document.getElementById("camera-overlay");
  const placeholder = () => document.getElementById("camera-placeholder");
  const liveBadge = () => document.getElementById("camera-live-badge");
  const toggleBtn = () => document.getElementById("btn-camera-toggle");
  const statusText = () => document.getElementById("camera-status-text");
  const statusDot = () => document.querySelector("#camera-status .status-dot");
  const tipEl = () => document.getElementById("camera-tip");
  const motionFill = () => document.getElementById("motion-fill");
  const detectionLabel = () => document.getElementById("detection-label");

  function setStatus(mode, text) {
    const dot = statusDot();
    if (dot) {
      dot.className = `status-dot status-dot--${mode}`;
    }
    if (statusText()) statusText().textContent = text;
  }

  function resizeCanvas() {
    const v = video();
    const c = overlay();
    if (!v || !c) return;
    const rect = v.getBoundingClientRect();
    c.width = rect.width;
    c.height = rect.height;
  }

  function drawGuide(ctx, w, h) {
    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = "rgba(61, 217, 196, 0.45)";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 4]);
    const padX = w * 0.2;
    const padY = h * 0.08;
    ctx.strokeRect(padX, padY, w - padX * 2, h - padY * 2);
    ctx.setLineDash([]);

    const cx = w / 2;
    const headY = h * 0.18;
    const shoulderY = h * 0.28;
    const hipY = h * 0.52;
    const kneeY = h * 0.72;
    const footY = h * 0.88;
    const shoulderW = w * 0.14;
    const hipW = w * 0.1;

    ctx.strokeStyle = motionLevel > 0.35 ? "rgba(255, 107, 74, 0.85)" : "rgba(61, 217, 196, 0.7)";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.arc(cx, headY, w * 0.045, 0, Math.PI * 2);
    ctx.stroke();

    const joints = [
      [cx, headY + w * 0.05],
      [cx, shoulderY],
      [cx - shoulderW, shoulderY + h * 0.08],
      [cx - shoulderW - w * 0.04, shoulderY + h * 0.18],
      [cx + shoulderW, shoulderY + h * 0.08],
      [cx + shoulderW + w * 0.04, shoulderY + h * 0.18],
      [cx, hipY],
      [cx - hipW, kneeY],
      [cx - hipW, footY],
      [cx + hipW, kneeY],
      [cx + hipW, footY],
    ];

    const lines = [
      [0, 1], [1, 2], [2, 3], [1, 4], [4, 5],
      [1, 6], [6, 7], [7, 8], [6, 9], [9, 10],
    ];

    lines.forEach(([a, b]) => {
      ctx.beginPath();
      ctx.moveTo(joints[a][0], joints[a][1]);
      ctx.lineTo(joints[b][0], joints[b][1]);
      ctx.stroke();
    });

    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.font = `600 ${Math.max(11, w * 0.028)}px "Noto Sans SC", sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText("请对准引导轮廓", cx, h * 0.06);
  }

  function sampleMotion() {
    const v = video();
    if (!v || v.readyState < 2) return 0;

    const sample = document.createElement("canvas");
    const sw = 80;
    const sh = Math.round((v.videoHeight / v.videoWidth) * sw) || 60;
    sample.width = sw;
    sample.height = sh;
    const sctx = sample.getContext("2d", { willReadFrequently: true });
    sctx.drawImage(v, 0, 0, sw, sh);
    const data = sctx.getImageData(0, 0, sw, sh).data;

    if (!prevFrame) {
      prevFrame = new Uint8ClampedArray(data);
      return 0;
    }

    let diff = 0;
    for (let i = 0; i < data.length; i += 4) {
      const dr = Math.abs(data[i] - prevFrame[i]);
      const dg = Math.abs(data[i + 1] - prevFrame[i + 1]);
      const db = Math.abs(data[i + 2] - prevFrame[i + 2]);
      diff += (dr + dg + db) / 3;
    }
    prevFrame.set(data);

    const avg = diff / (data.length / 4);
    return Math.min(1, avg / 28);
  }

  function updateFeedback() {
    const smooth = motionLevel * 0.85 + sampleMotion() * 0.15;
    motionLevel = smooth;

    if (motionFill()) {
      motionFill().style.width = `${Math.round(motionLevel * 100)}%`;
    }
    const motionText = document.getElementById("motion-fill-text");
    if (motionText) motionText.textContent = `${Math.round(motionLevel * 100)}%`;

    let label = "等待动作";
    let tip = currentTip;

    if (motionLevel > 0.5) {
      label = "动作活跃 ✓";
      tip = "节奏不错！保持当前动作标准";
    } else if (motionLevel > 0.2) {
      label = "检测中";
      tip = currentTip;
    } else if (motionLevel > 0.05) {
      label = "动作偏小";
      tip = "试试加大动作幅度，让摄像头捕捉更清晰";
    } else {
      label = "未检测到动作";
      tip = "请站在画面中央开始跟练";
    }

    if (detectionLabel()) detectionLabel().textContent = label;
    if (tipEl()) tipEl().textContent = tip;

    if (onMotionFeedback && motionLevel > 0.45) {
      onMotionFeedback({ level: motionLevel, label, tip });
    }
  }

  function loop() {
    if (!active) return;
    resizeCanvas();
    const immersive = typeof TrainMode !== "undefined" && TrainMode.isOpen();
    if (!immersive) {
      const c = overlay();
      const ctx = c?.getContext("2d");
      if (ctx) drawGuide(ctx, c.width, c.height);
    }
    updateFeedback();
    rafId = requestAnimationFrame(loop);
  }

  async function start() {
    if (active) return true;

    if (!navigator.mediaDevices?.getUserMedia) {
      setStatus("error", "浏览器不支持摄像头");
      return false;
    }

    try {
      setStatus("loading", "正在请求权限…");
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      const v = video();
      v.srcObject = stream;
      await v.play();

      active = true;
      prevFrame = null;
      motionLevel = 0;

      placeholder()?.classList.add("camera-placeholder--hidden");
      liveBadge()?.removeAttribute("hidden");
      toggleBtn().textContent = "关闭摄像头";
      toggleBtn().classList.add("btn--danger");
      setStatus("live", "摄像头已开启 · 实时检测中");

      loop();
      return true;
    } catch (err) {
      const msg =
        err.name === "NotAllowedError"
          ? "摄像头权限被拒绝，请在浏览器设置中允许"
          : err.name === "NotFoundError"
            ? "未检测到摄像头设备"
            : "无法开启摄像头";
      setStatus("error", msg);
      return false;
    }
  }

  function stop() {
    active = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      stream = null;
    }
    const v = video();
    if (v) v.srcObject = null;
    prevFrame = null;
    motionLevel = 0;

    placeholder()?.classList.remove("camera-placeholder--hidden");
    liveBadge()?.setAttribute("hidden", "");
    toggleBtn().textContent = "开启摄像头";
    toggleBtn().classList.remove("btn--danger");
    setStatus("idle", "摄像头未开启");
    if (motionFill()) motionFill().style.width = "0%";
    if (detectionLabel()) detectionLabel().textContent = "—";
    if (tipEl()) tipEl().textContent = currentTip;

    const c = overlay();
    c?.getContext("2d")?.clearRect(0, 0, c.width, c.height);
  }

  async function toggle() {
    if (active) {
      stop();
      return false;
    }
    return start();
  }

  function setExerciseTip(tip) {
    currentTip = tip || currentTip;
    if (!active && tipEl()) tipEl().textContent = currentTip;
  }

  function init(options = {}) {
    onMotionFeedback = options.onMotionFeedback || null;

    toggleBtn()?.addEventListener("click", toggle);

    window.addEventListener("resize", () => {
      if (active) resizeCanvas();
    });

    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.dataset.tab !== "train" && active) stop();
      });
    });
  }

  return {
    init,
    start,
    stop,
    toggle,
    setExerciseTip,
    isActive: () => active,
    getMotionLevel: () => motionLevel,
  };
})();
