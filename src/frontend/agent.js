/**
 * 语音 Agent：Web Speech API + 可配置后端 Agent 接口
 */
const VoiceAgent = (() => {
  const STORAGE_ENDPOINT = "fitness-agent-endpoint";

  let listening = false;
  let recognition = null;
  let onReply = null;
  let contextProvider = () => ({});

  function getEndpoint() {
    return localStorage.getItem(STORAGE_ENDPOINT) || "";
  }

  function setEndpoint(url) {
    if (url) localStorage.setItem(STORAGE_ENDPOINT, url);
    else localStorage.removeItem(STORAGE_ENDPOINT);
  }

  function initSpeech() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return false;
    recognition = new SR();
    recognition.lang = "zh-CN";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      handleUserMessage(text);
    };
    recognition.onend = () => {
      listening = false;
      updateMicUI(false);
    };
    recognition.onerror = () => {
      listening = false;
      updateMicUI(false);
    };
    return true;
  }

  function speak(text) {
    if (!window.speechSynthesis || !text) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "zh-CN";
    u.rate = 1.05;
    window.speechSynthesis.speak(u);
  }

  function localReply(message, ctx) {
    const m = message.trim();
    if (/累|疲|不行|坚持不住/.test(m)) {
      return ctx.style === "coach"
        ? "再坚持一组，你可以的。"
        : "累了就慢一点，我陪你调整节奏。";
    }
    if (/完成|结束|好了/.test(m)) return "太棒了！记得拉伸放松。";
    if (/下一个|换动作/.test(m)) return `下一个动作：${ctx.exercise || "继续跟练"}。`;
    if (/怎么|动作|标准/.test(m)) return ctx.tip || "注意核心收紧，动作放慢做标准。";
    if (/相似|同步|跟上了/.test(m)) {
      const s = ctx.poseMatch ?? 0;
      return s >= 75 ? `同步率 ${s}%，跟得很好！` : `同步率 ${s}%，可以再加大动作幅度。`;
    }
    return ctx.style === "fun"
      ? "收到！咱们继续跳起来～"
      : "我在呢，跟着我的节奏一起练。";
  }

  async function callAgent(message, context) {
    const endpoint = getEndpoint();
    if (endpoint) {
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message,
            context,
            session: "fitness-train",
          }),
        });
        if (res.ok) {
          const data = await res.json();
          return data.reply || data.message || data.content;
        }
      } catch (err) {
        console.warn("Agent API 不可用，使用本地回复:", err);
      }
    }
    return localReply(message, context);
  }

  async function handleUserMessage(text) {
    appendLog("user", text);
    const ctx = contextProvider();
    const reply = await callAgent(text, ctx);
    appendLog("ai", reply);
    speak(reply);
    onReply?.(reply, text);
  }

  function appendLog(role, text) {
    const box = document.getElementById("voice-log");
    if (!box) return;
    const div = document.createElement("div");
    div.className = `voice-log__item voice-log__item--${role}`;
    div.textContent = text;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
  }

  function updateMicUI(active) {
    const btn = document.getElementById("btn-voice-talk");
    if (!btn) return;
    btn.classList.toggle("voice-btn--active", active);
    btn.textContent = active ? "聆听中…" : "按住说话";
  }

  function startListening() {
    if (!recognition) {
      appendLog("ai", "当前浏览器不支持语音识别，请使用 Chrome/Edge。");
      return;
    }
    if (listening) return;
    listening = true;
    updateMicUI(true);
    try {
      recognition.start();
    } catch (_) {
      listening = false;
      updateMicUI(false);
    }
  }

  function stopListening() {
    if (recognition && listening) recognition.stop();
    listening = false;
    updateMicUI(false);
  }

  function bindUI() {
    const btn = document.getElementById("btn-voice-talk");
    const endpointInput = document.getElementById("agent-endpoint");
    if (endpointInput) endpointInput.value = getEndpoint();

    endpointInput?.addEventListener("change", (e) => setEndpoint(e.target.value.trim()));

    if (!btn) return;

    btn.addEventListener("mousedown", startListening);
    btn.addEventListener("mouseup", stopListening);
    btn.addEventListener("mouseleave", stopListening);
    btn.addEventListener("touchstart", (e) => { e.preventDefault(); startListening(); });
    btn.addEventListener("touchend", (e) => { e.preventDefault(); stopListening(); });

    document.getElementById("btn-voice-speak-tip")?.addEventListener("click", () => {
      const ctx = contextProvider();
      const tip = ctx.tip || "准备好啦，我们一起开始！";
      speak(tip);
      appendLog("ai", tip);
    });
  }

  function init(options = {}) {
    onReply = options.onReply || null;
    contextProvider = options.contextProvider || (() => ({}));
    initSpeech();
    bindUI();
  }

  // 上传照片并调用后端生成 2D 动画占位方法
  async function uploadPhoto(file, poseSequence = []) {
    if (!file) return { ok: false, error: "no file" };

    const endpoints = location.protocol === "file:"
      ? ["http://localhost:8766/animate"]
      : ["/animate", "http://localhost:8766/animate"];

    let lastError = "";
    for (const endpoint of endpoints) {
      try {
        const body = new FormData();
        body.append("file", file, file.name);
        body.append("pose_sequence", JSON.stringify(poseSequence));
        const res = await fetch(endpoint, { method: "POST", body });
        if (!res.ok) {
          lastError = res.statusText || `HTTP ${res.status}`;
          continue;
        }
        const data = await res.json();
        if (data.preview_url?.startsWith("/") && endpoint.startsWith("http")) {
          data.preview_url = new URL(data.preview_url, endpoint).href;
        }
        if (data.animation_url?.startsWith("/") && endpoint.startsWith("http")) {
          data.animation_url = new URL(data.animation_url, endpoint).href;
        }
        return { ok: true, data };
      } catch (err) {
        lastError = err.message;
      }
    }

    return { ok: false, error: lastError || "上传接口不可用" };
  }

  return {
    init,
    speak,
    callAgent,
    appendLog,
    getEndpoint,
    setEndpoint,
    uploadPhoto,
    isListening: () => listening,
  };
})();
