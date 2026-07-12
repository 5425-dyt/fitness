from __future__ import annotations

from pathlib import Path
from typing import Any, Dict, List
import json
import random
import time
import uuid

CHARACTER_DIR_NAME = "character"
CURRENT_CHARACTER_FILE = "current_character.json"


def _default_character() -> Dict[str, Any]:
    return {
        "id": "",
        "name": "",
        "presetKey": "",
        "species": "bunny",
        "style": "cute",
        "colors": {
            "fur": "#f5c6a0",
            "belly": "#ffe8d6",
            "ears": "#e8a87c",
            "nose": "#e88f8f",
            "paws": "#f7d8be",
            "tail": "#f3c2a0",
            "eyes": "#2a2018",
            "clothes": "#ff6b4a",
            "accessory": "#5b7cfa",
        },
        "body": {
            "ears": "long",
            "tail": "fluffy",
            "size": "standard",
            "eyes": "round",
        },
        "clothes": {
            "type": "sportswear",
            "color": "#ff6b4a",
        },
        "accessories": {
            "hat": "none",
            "scarf": "none",
            "glasses": "none",
            "headband": "none",
            "headphones": "none",
            "backpack": "none",
            "wristband": "none",
        },
        "personality": "warm",
        "voice": {
            "provider": "reserved",
            "voiceId": "",
            "style": "warm",
        },
        "animationStyle": "bouncy",
        "promptTemplate": "",
        "seed": 42,
        "identityLock": True,
        "createdAt": "",
    }


PRESETS: Dict[str, Dict[str, Any]] = {
    "tiaotiao": {
        "name": "跳跳（运动兔）",
        "species": "bunny",
        "style": "sporty",
        "personality": "energetic",
        "body": {"ears": "long", "tail": "fluffy", "size": "standard", "eyes": "big"},
        "clothes": {"type": "sportswear", "color": "#ff6b4a"},
    },
    "paopao": {
        "name": "泡泡（治愈熊猫）",
        "species": "panda",
        "style": "healing",
        "personality": "calm",
        "body": {"ears": "short", "tail": "short", "size": "round", "eyes": "round"},
        "clothes": {"type": "hoodie", "color": "#7cc6ff"},
    },
    "shandian": {
        "name": "闪电（运动狐狸）",
        "species": "fox",
        "style": "sporty",
        "personality": "strict",
        "body": {"ears": "short", "tail": "fluffy", "size": "fit", "eyes": "almond"},
        "clothes": {"type": "basketball", "color": "#ff9f43"},
    },
    "naitang": {
        "name": "奶糖（小猫）",
        "species": "cat",
        "style": "cute",
        "personality": "funny",
        "body": {"ears": "short", "tail": "long", "size": "small", "eyes": "big"},
        "clothes": {"type": "tshirt", "color": "#ffd166"},
    },
    "duole": {
        "name": "多乐（机器人）",
        "species": "robot",
        "style": "sci-fi",
        "personality": "steady",
        "body": {"ears": "short", "tail": "short", "size": "fit", "eyes": "half"},
        "clothes": {"type": "minimal", "color": "#7a8cff"},
    },
    "coco": {
        "name": "Coco（小狗）",
        "species": "dog",
        "style": "healing",
        "personality": "warm",
        "body": {"ears": "droopy", "tail": "long", "size": "round", "eyes": "round"},
        "clothes": {"type": "hoodie", "color": "#6bcf95"},
    },
}


def merge_character_config(raw: Dict[str, Any]) -> Dict[str, Any]:
    base = _default_character()
    merged = {**base, **{k: v for k, v in raw.items() if k in base}}
    for section in ["colors", "body", "clothes", "accessories", "voice"]:
        val = raw.get(section, {})
        if isinstance(val, dict):
            merged[section] = {**base[section], **val}
    merged["identityLock"] = True
    return merged


class CharacterConfigStore:
    def __init__(self, root_dir: Path):
        self.root_dir = Path(root_dir)
        self.dir = self.root_dir / CHARACTER_DIR_NAME
        self.dir.mkdir(parents=True, exist_ok=True)
        self.current_path = self.dir / CURRENT_CHARACTER_FILE

    def has_current(self) -> bool:
        return self.current_path.exists()

    def get_current(self) -> Dict[str, Any]:
        if not self.current_path.exists():
            raise FileNotFoundError("current character not found")
        return json.loads(self.current_path.read_text(encoding="utf-8"))

    def save_current(self, character: Dict[str, Any]) -> Dict[str, Any]:
        payload = merge_character_config(character)
        if not payload.get("id"):
            payload["id"] = uuid.uuid4().hex
        if not payload.get("createdAt"):
            payload["createdAt"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        self.current_path.write_text(
            json.dumps(payload, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
        return payload

    def create_from_preset(self, preset_id: str) -> Dict[str, Any]:
        preset = PRESETS.get(preset_id)
        if not preset:
            raise KeyError(preset_id)
        character = merge_character_config(preset)
        character["seed"] = random.randint(1, 999999)
        return self.save_current(character)


def list_presets() -> List[Dict[str, Any]]:
    items = []
    for pid, val in PRESETS.items():
        items.append({"id": pid, **val})
    return items
