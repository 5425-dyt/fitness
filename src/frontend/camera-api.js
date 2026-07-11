/**
 * CameraAPI: standardized camera + pose stream adapter.
 *
 * Input:
 * - videoId: target <video> element id
 * - facingMode: "user" | "environment"
 * - onFrame({ landmarks, motionLevel, timestamp, source })
 * - onStatus({ state, message })
 *
 * Output frame dictionary:
 * {
 *   landmarks: MediaPipe PoseLandmarker landmarks | null,
 *   motionLevel: 0-1,
 *   timestamp: DOMHighResTimeStamp,
 *   source: "mediapipe" | "motion-fallback"
 * }
 */
const CameraAPI = (() => {
  const sessions = new Map();

  function emitStatus(session, state, message) {
    session.onStatus?.({ state, message });
  }

  function sampleMotion(video, session) {
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
      if (!session.prevFrame) {
        session.prevFrame = new Uint8ClampedArray(data);
        return 0;
      }
      let diff = 0;
      for (let i = 0; i < data.length; i += 4) {
        diff += (
          Math.abs(data[i] - session.prevFrame[i]) +
          Math.abs(data[i + 1] - session.prevFrame[i + 1]) +
          Math.abs(data[i + 2] - session.prevFrame[i + 2])
        ) / 3;
      }
      session.prevFrame.set(data);
      return Math.min(1, diff / (data.length / 4) / 28);
    } catch (_) {
      return 0;
    }
  }

  async function start(options = {}) {
    const videoId = options.videoId;
    const video = document.getElementById(videoId);
    if (!video) throw new Error(`CameraAPI: video element not found: ${videoId}`);
    if (sessions.has(videoId)) return sessions.get(videoId);

    const session = {
      videoId,
      video,
      stream: null,
      rafId: 0,
      prevFrame: null,
      motionLevel: 0,
      onFrame: options.onFrame,
      onStatus: options.onStatus,
      active: true,
    };
    sessions.set(videoId, session);

    emitStatus(session, "loading", "正在请求摄像头权限");
    session.stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: options.facingMode || "user",
        width: { ideal: options.width || 720 },
        height: { ideal: options.height || 1280 },
      },
      audio: Boolean(options.audio),
    });
    video.srcObject = session.stream;
    await video.play();

    emitStatus(session, "loading", "正在加载姿态识别模型");
    await PoseEngine.init();
    emitStatus(session, PoseEngine.isReady?.() ? "live" : "fallback", PoseEngine.isReady?.() ? "MediaPipe 已就绪" : "基础动作识别模式");

    function loop() {
      if (!session.active) return;
      const timestamp = performance.now();
      const frameMotion = sampleMotion(video, session);
      let landmarks = null;
      if (PoseEngine.isReady?.()) {
        try {
          landmarks = PoseEngine.detect(video, timestamp);
        } catch (_) {
          landmarks = null;
        }
      }
      session.motionLevel = session.motionLevel * 0.82 + frameMotion * 0.18;
      if (landmarks) session.motionLevel = Math.max(session.motionLevel, 0.12);
      session.onFrame?.({
        landmarks,
        motionLevel: Number(session.motionLevel.toFixed(3)),
        timestamp,
        source: landmarks ? "mediapipe" : "motion-fallback",
      });
      session.rafId = requestAnimationFrame(loop);
    }
    session.rafId = requestAnimationFrame(loop);
    return session;
  }

  function stop(videoId) {
    const session = sessions.get(videoId);
    if (!session) return;
    session.active = false;
    if (session.rafId) cancelAnimationFrame(session.rafId);
    session.stream?.getTracks?.().forEach((track) => track.stop());
    session.video.srcObject = null;
    sessions.delete(videoId);
  }

  function getSession(videoId) {
    return sessions.get(videoId) || null;
  }

  return { start, stop, getSession };
})();
