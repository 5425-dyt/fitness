"""
可选本地 Agent 服务。启动后在前端「语音」侧栏填入 http://localhost:8766/agent

  pip install fastapi uvicorn
  python src/backend/agent_server.py
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi import UploadFile, File, Form
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path
import json
import re
import uuid

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


class ChatRequest(BaseModel):
    message: str
    context: dict = {}
    session: str = "fitness-train"


@app.post("/agent")
def chat(req: ChatRequest):
    msg = req.message.strip()
    ctx = req.context or {}
    exercise = ctx.get("exercise", "当前动作")
    tip = ctx.get("tip", "注意动作标准")
    pose_match = ctx.get("poseMatch", 0)

    if any(k in msg for k in ("累", "疲", "不行")):
        reply = "慢一点没关系，调整呼吸，我陪你做完这一组。"
    elif any(k in msg for k in ("怎么", "标准", "动作")):
        reply = f"关于{exercise}：{tip}"
    elif any(k in msg for k in ("同步", "跟上", "相似")):
        reply = f"当前同步率约 {pose_match}%，继续保持节奏。"
    else:
        reply = f"收到。咱们专注{exercise}，{tip}"

    return {"reply": reply}


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


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8766)
