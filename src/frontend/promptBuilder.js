/**
 * Prompt Builder: 仅构建场景参数，不再描述人物本身
 */
const PromptBuilder = (() => {
  const FORBIDDEN = /(woman|man|girl|boy|young|old|long hair|short hair|beautiful|handsome|female|male)/i;

  function sanitize(text) {
    const t = String(text || "").trim();
    if (!t) return "";
    return t.replace(FORBIDDEN, "").trim();
  }

  function buildSceneSpec(input = {}) {
    const scene = sanitize(input.scene || input.userPrompt || "studio floor");
    const action = sanitize(input.action || "stand naturally");
    const lighting = sanitize(input.lighting || "soft natural light");
    const camera = sanitize(input.camera || "eye-level medium shot");
    const mood = sanitize(input.mood || "focused");
    const outfit = sanitize(input.outfit || "sportswear");
    return { scene, action, lighting, camera, mood, outfit };
  }

  return { buildSceneSpec };
})();
