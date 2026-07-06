/**
 * MediaPipe 姿态引擎：摄像头/视频姿态检测、序列拆解、相似度计算
 */
const PoseEngine = (() => {
  const MODEL_URL =
    "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task";
  const WASM_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm";
  const ESM_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/+esm";

  const CORE_INDICES = [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28];

  let landmarker = null;
  let ready = false;
  let loading = false;
  let lastLandmarks = null;
  let teachSequence = [];
  let teachIndex = 0;
  let teachPlaying = false;
  let teachTimer = null;

  async function init() {
    if (ready || loading) return ready;
    loading = true;
    try {
      const vision = await import(ESM_URL);
      const fileset = await vision.FilesetResolver.forVisionTasks(WASM_URL);
      landmarker = await vision.PoseLandmarker.createFromOptions(fileset, {
        baseOptions: { modelAssetPath: MODEL_URL, delegate: "GPU" },
        runningMode: "VIDEO",
        numPoses: 1,
      });
      ready = true;
    } catch (err) {
      console.warn("PoseEngine 初始化失败，将使用基础模式:", err);
      ready = false;
    }
    loading = false;
    return ready;
  }

  function cloneLandmarks(lm) {
    return lm.map((p) => ({ x: p.x, y: p.y, z: p.z, visibility: p.visibility ?? 1 }));
  }

  function detect(video, timestampMs) {
    if (!ready || !landmarker || !video || video.readyState < 2) return null;
    try {
      const result = landmarker.detectForVideo(video, timestampMs);
      if (result.landmarks?.[0]) {
        lastLandmarks = cloneLandmarks(result.landmarks[0]);
        return lastLandmarks;
      }
    } catch (_) { /* ignore frame errors */ }
    return null;
  }

  function getLastLandmarks() {
    return lastLandmarks;
  }

  function similarity(a, b) {
    if (!a || !b || a.length < 29 || b.length < 29) return 0;
    let sum = 0;
    let count = 0;
    for (const i of CORE_INDICES) {
      const va = a[i].visibility ?? 1;
      const vb = b[i].visibility ?? 1;
      if (va < 0.3 || vb < 0.3) continue;
      const dx = a[i].x - b[i].x;
      const dy = a[i].y - b[i].y;
      sum += Math.hypot(dx, dy);
      count++;
    }
    if (!count) return 0;
    const avg = sum / count;
    return Math.round(Math.max(0, Math.min(100, (1 - avg * 4.5) * 100)));
  }

  function waitVideoSeek(video, time) {
    return new Promise((resolve) => {
      const onSeeked = () => {
        video.removeEventListener("seeked", onSeeked);
        resolve();
      };
      if (Math.abs(video.currentTime - time) < 0.05) {
        resolve();
        return;
      }
      video.addEventListener("seeked", onSeeked);
      video.currentTime = time;
    });
  }

  async function extractFromVideo(file, onProgress) {
    await init();
    if (!ready) throw new Error("姿态模型未加载，请检查网络后重试");

    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.src = url;
    video.muted = true;
    video.playsInline = true;

    await new Promise((res, rej) => {
      video.onloadedmetadata = () => res();
      video.onerror = () => rej(new Error("视频无法读取"));
    });

    const duration = video.duration;
    const step = 0.1;
    const frames = [];
    let t = 0;

    while (t <= duration) {
      await waitVideoSeek(video, t);
      const lm = detect(video, performance.now());
      if (lm) frames.push({ time: t, landmarks: cloneLandmarks(lm) });
      t += step;
      onProgress?.(Math.min(100, Math.round((t / duration) * 100)));
    }

    URL.revokeObjectURL(url);
    teachSequence = frames;
    teachIndex = 0;
    return frames;
  }

  function getTeachSequence() {
    return teachSequence;
  }

  function stopTeaching() {
    teachPlaying = false;
    if (teachTimer) {
      clearInterval(teachTimer);
      teachTimer = null;
    }
  }

  function playTeaching(onFrame, fps = 10) {
    if (!teachSequence.length) return false;
    stopTeaching();
    teachPlaying = true;
    teachIndex = 0;
    const interval = 1000 / fps;

    teachTimer = setInterval(() => {
      if (!teachPlaying || teachIndex >= teachSequence.length) {
        stopTeaching();
        onFrame?.(null, true);
        return;
      }
      const frame = teachSequence[teachIndex];
      onFrame?.(frame.landmarks, false, frame.time);
      teachIndex++;
    }, interval);

    return true;
  }

  function getTeachProgress() {
    if (!teachSequence.length) return 0;
    return Math.round((teachIndex / teachSequence.length) * 100);
  }

  function isTeaching() {
    return teachPlaying;
  }

  function analyzeKeyframes(frames) {
    if (!frames.length) return [];
    const segments = [];
    let segStart = 0;
    for (let i = 1; i < frames.length; i++) {
      const sim = similarity(frames[i - 1].landmarks, frames[i].landmarks);
      if (sim < 72) {
        segments.push({
          from: frames[segStart].time,
          to: frames[i - 1].time,
          index: segments.length + 1,
        });
        segStart = i;
      }
    }
    segments.push({
      from: frames[segStart].time,
      to: frames[frames.length - 1].time,
      index: segments.length + 1,
    });
    return segments;
  }

  return {
    init,
    isReady: () => ready,
    detect,
    getLastLandmarks,
    similarity,
    extractFromVideo,
    getTeachSequence,
    playTeaching,
    stopTeaching,
    getTeachProgress,
    isTeaching,
    analyzeKeyframes,
    CORE_INDICES,
  };
})();
