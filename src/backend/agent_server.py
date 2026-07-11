"""
健身操运动陪伴系统 - 后端服务

可选本地 Agent 服务。启动后在前端「语音」侧栏填入 http://localhost:8766/agent

  pip install fastapi uvicorn openai python-dotenv
  python src/backend/agent_server.py
"""
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi import UploadFile, File, Form
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import json
import re
import uuid
import asyncio
import random
import string
import time
import os
from typing import Any, Dict, List, Optional
from dotenv import load_dotenv
from openai import OpenAI
from character_profile import (
    CharacterConfigStore,
    build_generation_payload,
    build_final_prompt,
    build_scene_prompt,
    evaluate_identity_similarity,
    merge_character_config,
    list_presets,
)

# ── 环境配置 ─────────────────────────────────────────────
load_dotenv()
KIMI_API_KEY = os.getenv("KIMI_API_KEY", "")
KIMI_MODEL = os.getenv("KIMI_MODEL", "moonshot-v1-8k")

# OpenAI 兼容客户端（指向 Kimi / Moonshot）
kimi_client = None
if KIMI_API_KEY and KIMI_API_KEY != "your_key_here":
    kimi_client = OpenAI(
        api_key=KIMI_API_KEY,
        base_url="https://api.moonshot.cn/v1",
    )

# 会话历史：{ session_id: [{"role":..., "content":...}, ...] }
SESSION_HISTORY: Dict[str, List[Dict[str, str]]] = {}
MAX_HISTORY = 20  # 保留最近 20 条消息

app = FastAPI(title="Fitness Agent")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

ROOT_DIR = Path(__file__).resolve().parents[1]
UPLOADS_DIR = ROOT_DIR / "uploads"
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")
character_store = CharacterConfigStore(ROOT_DIR)


class ChatRequest(BaseModel):
    message: str
    context: dict = {}
    session: str = "fitness-train"


class GenerateRequest(BaseModel):
    profile_id: str = ""
    scene: str = ""
    action: str = ""
    lighting: str = ""
    camera: str = ""
    mood: str = ""
    outfit: str = ""
    mode: str = "image"


class CharacterConfigRequest(BaseModel):
    config: dict
    preset_id: str = ""


class SocialRoomCreateRequest(BaseModel):
    name: str = "元气共跳房"
    mode: str = "free-jump"
    max_members: int = 6
    user_name: str = "健身达人"
    user_id: str = ""


class SocialJoinRequest(BaseModel):
    user_name: str = "健身达人"
    user_id: str = ""


class SocialLeaveRequest(BaseModel):
    user_id: str


class SocialRelayRequest(BaseModel):
    user_id: str


class SocialChoreoRequest(BaseModel):
    user_id: str
    steps: List[Dict[str, Any]] = []


SOCIAL_ROOMS: Dict[str, Dict[str, Any]] = {}
SOCIAL_SOCKETS: Dict[str, Dict[str, WebSocket]] = {}
SOCIAL_LOCK = asyncio.Lock()

API_CONTRACTS = {
    "camera": {
        "frontend_call": "CameraAPI.start({ videoId, facingMode, onFrame, onStatus })",
        "frame_output": {
            "landmarks": "MediaPipe pose landmarks or null",
            "motionLevel": "0-1 normalized motion score",
            "timestamp": "DOMHighResTimeStamp",
            "source": "mediapipe | motion-fallback",
        },
        "status_output": {
            "state": "loading | live | fallback | error",
            "message": "human readable camera/pose status",
        },
    },
    "social_motion": {
        "websocket": "/social/ws/{room_id}/{user_id}",
        "event": "motion_update",
        "payload": {
            "motion_level": "0-1 normalized motion score",
            "jump_count": "integer accumulated jump/action count",
            "pose": "idle | run | jump | stretch | raise",
            "skeleton": "normalized key joints for 2D avatar fallback",
            "landmarks": "full normalized pose landmarks for high fidelity avatar",
        },
    },
    "movement_report": {
        "trigger": "training completed or social room left",
        "fields": ["durationSec", "completed", "sync", "warmupTip", "stretchTip", "advice"],
    },
    "companion_blueprint": {
        "new_user": "profile capture + photo/preset 2D avatar + direct movement square entry",
        "returning_user": "reuse frequent plan + historical avatar + AI regeneration on demand",
        "during_workout": "voice-first prompts, pose correction, rest reminders",
        "after_workout": "standard report + stretch guidance + next-plan memory",
    },
}


def _social_color(user_id: str) -> str:
    palette = [
        "#6ea8fe", "#7fd3c7", "#f7a35b", "#eb6f92", "#9d7dfd",
        "#5ac8fa", "#8ddf71", "#ff7b72", "#d2a8ff", "#58d3b3",
    ]
    if not user_id:
        return palette[0]
    idx = sum(ord(ch) for ch in user_id) % len(palette)
    return palette[idx]


def _social_room_id() -> str:
    return "".join(random.choices(string.ascii_uppercase + string.digits, k=4))


def _social_member(user_id: str, user_name: str) -> Dict[str, Any]:
    return {
        "user_id": user_id,
        "name": user_name[:12] or "用户",
        "motion_level": 0.0,
        "jump_count": 0,
        "pose": "idle",
        "skeleton": {},
        "landmarks": [],
        "color": _social_color(user_id),
        "joined_at": time.time(),
        "last_seen": time.time(),
    }


def _serialize_room(room: Dict[str, Any]) -> Dict[str, Any]:
    members = sorted(room["members"].values(), key=lambda m: m["joined_at"])
    return {
        "id": room["id"],
        "name": room["name"],
        "mode": room["mode"],
        "max_members": room["max_members"],
        "member_count": len(members),
        "created_at": room["created_at"],
        "status": room.get("status", "idle"),
        "relay_index": room.get("relay_index", 0),
        "choreography": room.get("choreography", []),
        "members": members,
    }


async def _broadcast_room(room_id: str):
    room = SOCIAL_ROOMS.get(room_id)
    if not room:
        return
    snapshot = json.dumps({"type": "room_update", "room": _serialize_room(room)}, ensure_ascii=False)
    conns = SOCIAL_SOCKETS.get(room_id, {})
    stale = []
    for uid, ws in conns.items():
        try:
            await ws.send_text(snapshot)
        except Exception:
            stale.append(uid)
    for uid in stale:
        conns.pop(uid, None)


@app.get("/api/contracts")
def api_contracts():
    return {"contracts": API_CONTRACTS}


@app.post("/agent")
def chat(req: ChatRequest):
    """AI 聊天 Agent：调用 Kimi API（兼容 OpenAI 格式）"""
    msg = req.message.strip() or "你好"
    ctx = req.context or {}
    session = req.session or "fitness-train"

    # 构建系统提示词，融入当前运动上下文
    exercise = ctx.get("exercise", "当前动作")
    tip = ctx.get("tip", "注意动作标准")
    pose_match = ctx.get("poseMatch", 0)
    style = ctx.get("style", "coach")

    system_prompt = (
        "你是「元气共跳」健身操运动陪伴系统的 AI 教练。"
        "你的风格是友善、鼓励、简洁，说话像一位充满活力的健身伙伴。"
        "回复控制在 80 字以内，多用鼓励的语气。\n\n"
        f"当前运动：{exercise}\n"
        f"训练提示：{tip}\n"
        f"动作同步率：{pose_match}%\n"
        f"风格模式：{'🧘 教练模式（专业鼓励）' if style == 'coach' else '🎉 娱乐模式（活泼有趣）'}"
    )

    # 获取 / 初始化会话历史
    history = SESSION_HISTORY.setdefault(session, [])
    if not history:
        history.append({"role": "system", "content": system_prompt})
    else:
        # 更新 system prompt（最新的上下文）
        history[0] = {"role": "system", "content": system_prompt}

    history.append({"role": "user", "content": msg})

    # 如果未配置 API Key，降级到本地回复
    if not kimi_client:
        reply = local_chat_reply(msg, ctx)
        history.append({"role": "assistant", "content": reply})
        if len(history) > MAX_HISTORY:
            # 保留 system 和最近的消息
            history[:] = [history[0]] + history[-(MAX_HISTORY - 1):]
        return {"reply": reply, "provider": "local", "session": session}

    # 调用 Kimi API
    try:
        resp = kimi_client.chat.completions.create(
            model=KIMI_MODEL,
            messages=history,
            temperature=0.7,
            max_tokens=300,
        )
        reply = resp.choices[0].message.content or ""
    except Exception as e:
        reply = f"（AI 暂时走神了，让我用本地知识回复你）"
        print(f"[Kimi API Error] {e}")

    history.append({"role": "assistant", "content": reply})
    # 裁剪历史，防止过长
    if len(history) > MAX_HISTORY:
        history[:] = [history[0]] + history[-(MAX_HISTORY - 1):]

    return {"reply": reply, "provider": "kimi", "model": KIMI_MODEL, "session": session}


def local_chat_reply(message: str, ctx: dict) -> str:
    """本地降级回复（无 API Key 时使用）"""
    m = message.strip()
    exercise = ctx.get("exercise", "当前动作")
    tip = ctx.get("tip", "注意动作标准")
    pose_match = ctx.get("poseMatch", 0)
    style = ctx.get("style", "coach")

    if any(k in m for k in ("累", "疲", "不行", "坚持不住")):
        return "累了就慢一点，调整呼吸，我陪你做完这一组。"
    if any(k in m for k in ("完成", "结束", "好了")):
        return "太棒了！记得拉伸放松，明天继续加油！"
    if any(k in m for k in ("怎么", "标准", "动作")):
        return f"关于{exercise}：{tip}"
    if any(k in m for k in ("相似", "同步", "跟上")):
        return f"当前同步率约 {pose_match}%，继续保持节奏！"
    if any(k in m for k in ("加油", "鼓励", "棒")):
        return "干得漂亮！保持这个状态，你是最棒的！"
    if style == "fun":
        return "收到！咱们继续跳起来～ 💃"
    return "我在呢，跟着我的节奏一起练。💪"


@app.post("/animate")
async def animate(file: UploadFile = File(...), pose_sequence: str = Form("[]")):
    """接收用户上传照片，作为 MagicAnimate 推理管线的入口。

    当前版本先返回图片预览地址，前端会用浏览器 Canvas 做实时 2D 跟练。
    真实部署时可在这里把照片、动作序列、densepose/openpose 条件帧提交给
    MagicAnimate / SD1.5 服务，并返回 animation_url 或 task_id。
    """
    safe_name = re.sub(r"[^a-zA-Z0-9._-]+", "_", file.filename or "avatar.png")
    task_id = uuid.uuid4().hex
    fname = f"{task_id}_{safe_name}"
    path = UPLOADS_DIR / fname
    with path.open("wb") as f:
        f.write(await file.read())

    try:
        poses = json.loads(pose_sequence or "[]")
        if not isinstance(poses, list):
            poses = []
    except json.JSONDecodeError:
        poses = []

    pose_name = f"{task_id}_pose_sequence.json"
    pose_path = UPLOADS_DIR / pose_name
    pose_path.write_text(
        json.dumps({
            "format": "mediapipe_pose_landmarker",
            "fps_hint": 15,
            "frames": poses,
            "magic_animate_note": "Convert these landmarks to DensePose/OpenPose condition frames before MagicAnimate inference.",
        }, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    return JSONResponse({
        "status": "queued",
        "task_id": task_id,
        "file": fname,
        "preview_url": f"/uploads/{fname}",
        "pose_sequence_url": f"/uploads/{pose_name}",
        "pose_frames": len(poses),
        "message": f"已保存参考图和 {len(poses)} 帧动作序列；接入 MagicAnimate 后可返回 animation_url",
    })


@app.get("/character/presets")
def get_character_presets():
    return JSONResponse({"status": "ok", "presets": list_presets()})


@app.post("/character/config")
def create_character_from_config(req: CharacterConfigRequest):
    """
    基于可视化配置创建角色，不依赖上传照片。
    """
    if req.preset_id:
        try:
            saved = character_store.create_from_preset(req.preset_id)
        except KeyError:
            return JSONResponse({"error": "preset not found"}, status_code=404)
    else:
        merged = merge_character_config(req.config or {})
        saved = character_store.save_current(merged)

    return JSONResponse({
        "status": "ok",
        "character_id": saved["id"],
        "character": saved,
        "identityLock": True,
        "message": "已创建并保存 Current Character（配置驱动）。",
    })


@app.get("/character/config/{character_id}")
def get_character(character_id: str):
    try:
        data = character_store.get_current()
    except FileNotFoundError:
        return JSONResponse({"error": "character not found"}, status_code=404)
    if data.get("id") != character_id:
        return JSONResponse({"error": "character not found"}, status_code=404)
    return JSONResponse({"status": "ok", "character_id": data["id"], "character": data})


@app.get("/character/current")
def get_current_character():
    try:
        data = character_store.get_current()
    except FileNotFoundError:
        return JSONResponse({"error": "current character not found"}, status_code=404)
    return JSONResponse({"status": "ok", "character_id": data["id"], "character": data})


@app.put("/character/config/{character_id}")
def update_character(character_id: str, req: CharacterConfigRequest):
    try:
        current = character_store.get_current()
    except FileNotFoundError:
        return JSONResponse({"error": "character not found"}, status_code=404)
    if current.get("id") != character_id:
        return JSONResponse({"error": "character not found"}, status_code=404)
    patched = merge_character_config({**current, **(req.config or {}), "id": current["id"], "identityLock": True})
    data = character_store.save_current(patched)
    return JSONResponse({"status": "ok", "character_id": data["id"], "character": data})


@app.post("/character/generate")
def generate_with_profile(req: GenerateRequest):
    """
    统一生成入口：Scene Params + Current Character(identity lock) -> 生成
    不允许重新分析图片；仅使用 current_character.json
    """
    try:
        character = character_store.get_current()
    except FileNotFoundError:
        return JSONResponse({"error": "current character not found"}, status_code=404)

    if req.profile_id and req.profile_id != character.get("id"):
        return JSONResponse({"error": "character mismatch with Current Character"}, status_code=400)

    scene_payload = {
        "scene": req.scene,
        "action": req.action,
        "lighting": req.lighting,
        "camera": req.camera,
        "mood": req.mood,
        "outfit": req.outfit,
    }
    scene_prompt = build_scene_prompt(scene_payload)
    generation_payload = build_generation_payload(character, scene_prompt)
    final_prompt = build_final_prompt(character, scene_prompt)

    attempts = []
    accepted = None
    for attempt in range(1, 6):
        score = evaluate_identity_similarity(character, scene_prompt, attempt)
        attempts.append({"attempt": attempt, "identity_similarity": score})
        if score >= 95:
            accepted = {"attempt": attempt, "identity_similarity": score}
            break

    generation_task_id = uuid.uuid4().hex
    generation_record = {
        "task_id": generation_task_id,
        "character_id": character["id"],
        "mode": req.mode,
        "scene_prompt": scene_prompt,
        "generation_payload": generation_payload,
        "final_prompt": final_prompt,
        "identity_attempts": attempts,
        "accepted": accepted,
    }
    (UPLOADS_DIR / f"{generation_task_id}_generation.json").write_text(
        json.dumps(generation_record, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    if not accepted:
        return JSONResponse({
            "status": "failed",
            "task_id": generation_task_id,
            "character_id": character["id"],
            "identity_similarity": attempts[-1]["identity_similarity"],
            "message": "一致性评分连续重试后仍低于95%，已拒绝返回结果。",
        }, status_code=409)

    return JSONResponse({
        "status": "queued",
        "task_id": generation_task_id,
        "character_id": character["id"],
        "identityLock": True,
        "identity_similarity": accepted["identity_similarity"],
        "attempt": accepted["attempt"],
        "scene_prompt": scene_prompt,
        "generation_payload": generation_payload,
        "final_prompt": final_prompt,
        "message": "已基于 Current Character 生成（角色身份锁定）。",
    })


@app.get("/social/rooms")
async def social_rooms():
    async with SOCIAL_LOCK:
        rooms = sorted(
            (_serialize_room(room) for room in SOCIAL_ROOMS.values()),
            key=lambda x: x["created_at"],
            reverse=True,
        )
    return JSONResponse({"status": "ok", "rooms": rooms})


@app.post("/social/rooms")
async def create_social_room(req: SocialRoomCreateRequest):
    async with SOCIAL_LOCK:
        room_id = _social_room_id()
        while room_id in SOCIAL_ROOMS:
            room_id = _social_room_id()
        user_id = req.user_id or uuid.uuid4().hex[:8]
        mode = req.mode if req.mode in {"free-jump", "library-jump", "relay-jump", "group-choreo"} else "free-jump"
        room = {
            "id": room_id,
            "name": (req.name or "元气共跳房")[:20],
            "mode": mode,
            "max_members": max(2, min(req.max_members, 20)),
            "created_at": time.time(),
            "status": "idle",
            "relay_index": 0,
            "choreography": [],
            "members": {},
        }
        room["members"][user_id] = _social_member(user_id, req.user_name or "健身达人")
        SOCIAL_ROOMS[room_id] = room
        SOCIAL_SOCKETS.setdefault(room_id, {})
        data = _serialize_room(room)
    return JSONResponse({"status": "ok", "room": data, "user_id": user_id})


@app.post("/social/rooms/{room_id}/join")
async def join_social_room(room_id: str, req: SocialJoinRequest):
    async with SOCIAL_LOCK:
        room = SOCIAL_ROOMS.get(room_id)
        if not room:
            return JSONResponse({"error": "room not found"}, status_code=404)
        user_id = req.user_id or uuid.uuid4().hex[:8]
        if user_id not in room["members"] and len(room["members"]) >= room["max_members"]:
            return JSONResponse({"error": "room full"}, status_code=409)
        room["members"][user_id] = _social_member(user_id, req.user_name or "健身达人")
        data = _serialize_room(room)
    await _broadcast_room(room_id)
    return JSONResponse({"status": "ok", "room": data, "user_id": user_id})


@app.post("/social/rooms/{room_id}/leave")
async def leave_social_room(room_id: str, req: SocialLeaveRequest):
    async with SOCIAL_LOCK:
        room = SOCIAL_ROOMS.get(room_id)
        if not room:
            return JSONResponse({"error": "room not found"}, status_code=404)
        room["members"].pop(req.user_id, None)
        sock = SOCIAL_SOCKETS.get(room_id, {}).pop(req.user_id, None)
        if sock:
            try:
                await sock.close()
            except Exception:
                pass
        if not room["members"]:
            SOCIAL_ROOMS.pop(room_id, None)
            SOCIAL_SOCKETS.pop(room_id, None)
            return JSONResponse({"status": "ok", "deleted": True})
        room["relay_index"] = min(room.get("relay_index", 0), len(room["members"]) - 1)
        data = _serialize_room(room)
    await _broadcast_room(room_id)
    return JSONResponse({"status": "ok", "room": data})


@app.post("/social/rooms/{room_id}/relay")
async def relay_next(room_id: str, req: SocialRelayRequest):
    async with SOCIAL_LOCK:
        room = SOCIAL_ROOMS.get(room_id)
        if not room:
            return JSONResponse({"error": "room not found"}, status_code=404)
        member_count = len(room["members"])
        if member_count <= 0:
            return JSONResponse({"error": "room empty"}, status_code=409)
        room["relay_index"] = (room.get("relay_index", 0) + 1) % member_count
        room["status"] = "relay"
        data = _serialize_room(room)
    await _broadcast_room(room_id)
    return JSONResponse({"status": "ok", "room": data})


@app.post("/social/rooms/{room_id}/choreography")
async def publish_choreography(room_id: str, req: SocialChoreoRequest):
    async with SOCIAL_LOCK:
        room = SOCIAL_ROOMS.get(room_id)
        if not room:
            return JSONResponse({"error": "room not found"}, status_code=404)
        cleaned = []
        for item in req.steps[:30]:
            action = str(item.get("action", "jump"))[:16]
            try:
                duration = int(item.get("duration", 12))
            except Exception:
                duration = 12
            cleaned.append({"action": action, "duration": max(4, min(duration, 60))})
        room["choreography"] = cleaned
        room["status"] = "group-choreo"
        data = _serialize_room(room)
    await _broadcast_room(room_id)
    return JSONResponse({"status": "ok", "room": data})


@app.websocket("/social/ws/{room_id}/{user_id}")
async def social_room_ws(websocket: WebSocket, room_id: str, user_id: str):
    await websocket.accept()
    async with SOCIAL_LOCK:
        room = SOCIAL_ROOMS.get(room_id)
        if not room or user_id not in room["members"]:
            await websocket.send_text(json.dumps({"type": "error", "message": "room/user not found"}, ensure_ascii=False))
            await websocket.close()
            return
        SOCIAL_SOCKETS.setdefault(room_id, {})[user_id] = websocket
        await websocket.send_text(json.dumps({"type": "room_snapshot", "room": _serialize_room(room)}, ensure_ascii=False))

    try:
        while True:
            raw = await websocket.receive_text()
            try:
                msg = json.loads(raw)
            except Exception:
                continue
            changed = False
            async with SOCIAL_LOCK:
                room = SOCIAL_ROOMS.get(room_id)
                if not room:
                    break
                member = room["members"].get(user_id)
                if not member:
                    break
                typ = msg.get("type")
                if typ == "motion_update":
                    try:
                        level = float(msg.get("motion_level", 0))
                    except Exception:
                        level = 0.0
                    member["motion_level"] = max(0.0, min(level, 1.0))
                    try:
                        member["jump_count"] = int(msg.get("jump_count", member["jump_count"]))
                    except Exception:
                        pass
                    member["pose"] = str(msg.get("pose", member["pose"]))[:20]
                    skeleton = msg.get("skeleton")
                    if isinstance(skeleton, dict):
                        cleaned_skeleton = {}
                        for key in ("nose", "leftShoulder", "rightShoulder", "leftElbow", "rightElbow", "leftWrist", "rightWrist", "leftHip", "rightHip", "leftKnee", "rightKnee", "leftAnkle", "rightAnkle"):
                            point = skeleton.get(key)
                            if not isinstance(point, dict):
                                continue
                            try:
                                x = max(0.0, min(float(point.get("x", 0)), 1.0))
                                y = max(0.0, min(float(point.get("y", 0)), 1.0))
                            except Exception:
                                continue
                            cleaned_skeleton[key] = {"x": x, "y": y}
                        member["skeleton"] = cleaned_skeleton
                    landmarks = msg.get("landmarks")
                    if isinstance(landmarks, list):
                        cleaned_landmarks = []
                        for point in landmarks[:33]:
                            if not isinstance(point, dict):
                                continue
                            try:
                                cleaned_landmarks.append({
                                    "x": max(0.0, min(float(point.get("x", 0)), 1.0)),
                                    "y": max(0.0, min(float(point.get("y", 0)), 1.0)),
                                    "z": float(point.get("z", 0)),
                                    "visibility": max(0.0, min(float(point.get("visibility", 1)), 1.0)),
                                })
                            except Exception:
                                continue
                        member["landmarks"] = cleaned_landmarks
                    member["last_seen"] = time.time()
                    changed = True
                elif typ == "room_action":
                    action = str(msg.get("action", "live"))[:20]
                    room["status"] = action
                    changed = True
            if changed:
                await _broadcast_room(room_id)
    except WebSocketDisconnect:
        pass
    finally:
        async with SOCIAL_LOCK:
            conns = SOCIAL_SOCKETS.get(room_id, {})
            conns.pop(user_id, None)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8766)
