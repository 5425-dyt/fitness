/**
 * Current Character 单例缓存（全项目共享）
 */
const CharacterProfileStore = (() => {
  const STORAGE_KEY = "fitness-current-character";
  if (!window.__currentCharacterCache) {
    window.__currentCharacterCache = { value: null };
  }
  const cache = window.__currentCharacterCache;

  function save(record) {
    if (!record) return;
    cache.value = record;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    } catch (_) { /* ignore */ }
  }

  function load() {
    if (cache.value) return cache.value;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      cache.value = raw ? JSON.parse(raw) : null;
      return cache.value;
    } catch (_) {
      cache.value = null;
      return null;
    }
  }

  async function syncFromBackend() {
    const endpoints = location.protocol === "file:"
      ? ["http://localhost:8766/character/current"]
      : ["/character/current", "http://localhost:8766/character/current"];
    for (const endpoint of endpoints) {
      try {
        const res = await fetch(endpoint);
        if (!res.ok) continue;
        const data = await res.json();
        const record = {
          character_id: data.character_id,
          character: data.character,
        };
        save(record);
        return record;
      } catch (_) {
        // try next endpoint
      }
    }
    return load();
  }

  function clear() {
    cache.value = null;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) { /* ignore */ }
  }

  function getProfileId() {
    return load()?.character_id || "";
  }

  function getProfile() {
    return load()?.character || null;
  }

  function getCharacter() {
    return getProfile();
  }

  async function saveCharacter(character, presetId = "") {
    const endpoints = location.protocol === "file:"
      ? ["http://localhost:8766/character/config"]
      : ["/character/config", "http://localhost:8766/character/config"];
    for (const endpoint of endpoints) {
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            config: character,
            preset_id: presetId || "",
          }),
        });
        if (!res.ok) continue;
        const data = await res.json();
        const record = {
          character_id: data.character_id,
          character: data.character,
        };
        save(record);
        return { ok: true, data: record };
      } catch (_) {
        // try next endpoint
      }
    }
    return { ok: false, error: "save character failed" };
  }

  async function fetchPresets() {
    const endpoints = location.protocol === "file:"
      ? ["http://localhost:8766/character/presets"]
      : ["/character/presets", "http://localhost:8766/character/presets"];
    for (const endpoint of endpoints) {
      try {
        const res = await fetch(endpoint);
        if (!res.ok) continue;
        const data = await res.json();
        return data.presets || [];
      } catch (_) {
        // try next endpoint
      }
    }
    return [];
  }

  return {
    save,
    load,
    syncFromBackend,
    clear,
    getProfileId,
    getProfile,
    getCharacter,
    saveCharacter,
    fetchPresets,
  };
})();
