"""
可选本地 Agent 服务。启动后在前端「语音」侧栏填入 http://localhost:8766/agent

  pip install fastapi uvicorn
  python src/backend/agent_server.py
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="Fitness Agent")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


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


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8766)
