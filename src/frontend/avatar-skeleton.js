/**
 * 可爱小动物虚拟伙伴（Canvas 渲染 + 姿态驱动 + 程序化动画）
 */
const SkeletonAvatar = (() => {
  const BONES = [
    [11, 12], [11, 13], [13, 15], [12, 14], [14, 16],
    [11, 23], [12, 24], [23, 24], [23, 25], [25, 27], [24, 26], [26, 28],
  ];
  const MAJOR_JOINTS = [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28];
  const JOINT_LABELS = {
    11: "L肩", 12: "R肩",
    13: "L肘", 14: "R肘",
    15: "L腕", 16: "R腕",
    23: "L髋", 24: "R髋",
    25: "L膝", 26: "R膝",
    27: "L踝", 28: "R踝",
  };

  const DEFAULT_CONFIG = {
    fur: "#f5c6a0",
    belly: "#ffe8d6",
    ear: "#e8a87c",
    accent: "#ff6b4a",
    animal: "bunny",
  };

  let config = { ...DEFAULT_CONFIG };
  const mounts = new Map();
  let currentLandmarks = null;
  let presetPose = "idle";
  let photoAvatar = null;
  let rafId = null;
  let blinkTimer = 0;

  function cloneLm(lm) {
    return lm.map((p) => ({ ...p }));
  }

  function toPoint(lm, i, w, h, mirror) {
    const p = lm[i];
    if (!p || (p.visibility ?? 1) < 0.25) return null;
    return { x: (mirror ? 1 - p.x : p.x) * w, y: p.y * h };
  }

  function defaultLandmarks() {
    const t = performance.now() / 1000;
    const b = Math.sin(t * 2.5) * 0.008;
    return Array.from({ length: 33 }, (_, i) => {
      const base = { x: 0.5, y: 0.5, z: 0, visibility: 1 };
      if (i === 0) return { ...base, y: 0.22 + b };
      if (i === 11) return { ...base, x: 0.42, y: 0.36 };
      if (i === 12) return { ...base, x: 0.58, y: 0.36 };
      if (i === 13) return { ...base, x: 0.34, y: 0.48 };
      if (i === 14) return { ...base, x: 0.66, y: 0.48 };
      if (i === 15) return { ...base, x: 0.28, y: 0.58 };
      if (i === 16) return { ...base, x: 0.72, y: 0.58 };
      if (i === 23) return { ...base, x: 0.44, y: 0.58 };
      if (i === 24) return { ...base, x: 0.56, y: 0.58 };
      if (i === 25) return { ...base, x: 0.42, y: 0.74 };
      if (i === 26) return { ...base, x: 0.58, y: 0.74 };
      if (i === 27) return { ...base, x: 0.4, y: 0.9 };
      if (i === 28) return { ...base, x: 0.6, y: 0.9 };
      return base;
    });
  }

  function applyPreset(lm, pose) {
    const p = cloneLm(lm);
    const t = performance.now() / 1000;
    const s = Math.sin(t * 4);
    const c = Math.cos(t * 4);

    switch (pose) {
      case "jump":
        p[0].y -= 0.1 + Math.abs(s) * 0.04;
        p[15].y -= 0.14; p[16].y -= 0.14;
        p[13].y -= 0.08; p[14].y -= 0.08;
        p[27].y -= 0.08; p[28].y -= 0.08;
        p[27].x -= 0.05; p[28].x += 0.05;
        break;
      case "squat":
        p[0].y += 0.08; p[11].y += 0.06; p[12].y += 0.06;
        p[23].y += 0.08; p[24].y += 0.08;
        p[25].y += 0.1; p[26].y += 0.1;
        p[27].y += 0.06; p[28].y += 0.06;
        p[15].y += 0.04; p[16].y += 0.04;
        break;
      case "stretch":
        p[15].y -= 0.16 + s * 0.02; p[16].y -= 0.16 + s * 0.02;
        p[13].y -= 0.1; p[14].y -= 0.1;
        p[0].y -= 0.04;
        break;
      case "run":
        p[25].y -= 0.05 + s * 0.03; p[26].y += 0.05 - s * 0.03;
        p[27].y -= 0.06 + Math.max(0, s) * 0.04;
        p[28].y += 0.02 - Math.max(0, s) * 0.04;
        p[15].x -= s * 0.04; p[16].x += s * 0.04;
        p[0].y -= 0.03 + Math.abs(s) * 0.02;
        break;
      case "plank":
        p[0].y += 0.2; p[11].y += 0.15; p[12].y += 0.15;
        p[23].y += 0.12; p[24].y += 0.12;
        p[15].y += 0.1; p[16].y += 0.1;
        p[27].y += 0.05; p[28].y += 0.05;
        break;
      default:
        p[0].y += Math.sin(t * 2.2) * 0.015;
        p[15].y += s * 0.012; p[16].y -= s * 0.012;
        p[27].y += c * 0.008; p[28].y -= c * 0.008;
        break;
    }
    return p;
  }

  function lmToAnimalModel(lm, w, h, mirror) {
    const nose = toPoint(lm, 0, w, h, mirror);
    const ls = toPoint(lm, 11, w, h, mirror);
    const rs = toPoint(lm, 12, w, h, mirror);
    const lh = toPoint(lm, 23, w, h, mirror);
    const rh = toPoint(lm, 24, w, h, mirror);
    const lw = toPoint(lm, 15, w, h, mirror);
    const rw = toPoint(lm, 16, w, h, mirror);
    const la = toPoint(lm, 27, w, h, mirror);
    const ra = toPoint(lm, 28, w, h, mirror);
    const lk = toPoint(lm, 25, w, h, mirror);
    const rk = toPoint(lm, 26, w, h, mirror);

    if (!nose || !ls || !rs || !lh || !rh) return null;

    const hipX = (lh.x + rh.x) / 2;
    const hipY = (lh.y + rh.y) / 2;
    const shoulderX = (ls.x + rs.x) / 2;
    const shoulderY = (ls.y + rs.y) / 2;
    const torsoH = Math.hypot(hipX - shoulderX, hipY - shoulderY);
    const scale = Math.max(0.55, Math.min(1.35, torsoH / (h * 0.22)));

    return {
      headX: nose.x,
      headY: nose.y - scale * h * 0.04,
      bodyX: (hipX + shoulderX) / 2,
      bodyY: (hipY + shoulderY) / 2,
      scale,
      paws: [
        lw || { x: ls.x - scale * 30, y: shoulderY + scale * 40 },
        rw || { x: rs.x + scale * 30, y: shoulderY + scale * 40 },
        la || lk || { x: lh.x - scale * 15, y: hipY + scale * 55 },
        ra || rk || { x: rh.x + scale * 15, y: hipY + scale * 55 },
      ],
      lean: (shoulderX - hipX) * 0.015,
    };
  }

  function drawRoundRect(ctx, x, y, rw, rh, r) {
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") {
      ctx.roundRect(x, y, rw, rh, r);
    } else {
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + rw, y, x + rw, y + rh, r);
      ctx.arcTo(x + rw, y + rh, x, y + rh, r);
      ctx.arcTo(x, y + rh, x, y, r);
      ctx.arcTo(x, y, x + rw, y, r);
      ctx.closePath();
    }
    ctx.fill();
  }

  function drawImageCover(ctx, image, x, y, w, h) {
    const scale = Math.max(w / image.naturalWidth, h / image.naturalHeight);
    const sw = w / scale;
    const sh = h / scale;
    const sx = (image.naturalWidth - sw) / 2;
    const sy = (image.naturalHeight - sh) / 2;
    ctx.drawImage(image, sx, sy, sw, sh, x, y, w, h);
  }

  function drawPhotoLimb(ctx, from, to, width, color, jointColor = color) {
    if (!from || !to) return;
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    const len = Math.hypot(to.x - from.x, to.y - from.y);

    ctx.save();
    ctx.translate(from.x, from.y);
    ctx.rotate(angle);

    const grad = ctx.createLinearGradient(0, 0, len, 0);
    grad.addColorStop(0, color);
    grad.addColorStop(1, jointColor);
    ctx.fillStyle = grad;
    drawRoundRect(ctx, 0, -width / 2, len, width, width / 2);
    ctx.restore();
  }

  function drawSoftJoint(ctx, p, radius, color) {
    if (!p) return;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawPhotoCapsule(ctx, center, w, h, radius, image) {
    ctx.save();
    drawRoundRect(ctx, center.x - w / 2, center.y - h / 2, w, h, radius);
    ctx.clip();
    drawImageCover(ctx, image, center.x - w / 2, center.y - h / 2, w, h);
    ctx.restore();
  }

  function drawPhotoPlaceholder(ctx, w, h) {
    const sc = Math.min(w, h) / 390;
    const cx = w * 0.5;
    const cy = h * 0.55;
    ctx.save();
    ctx.globalAlpha = 0.92;
    ctx.fillStyle = "rgba(255,255,255,0.1)";
    drawRoundRect(ctx, cx - 44 * sc, cy - 68 * sc, 88 * sc, 130 * sc, 26 * sc);
    ctx.fillStyle = config.accent;
    ctx.beginPath();
    ctx.arc(cx, cy - 116 * sc, 42 * sc, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function averageImageColor(image, sx, sy, sw, sh, fallback) {
    const canvas = document.createElement("canvas");
    const size = 24;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(image, sx, sy, sw, sh, 0, 0, size, size);
    const data = ctx.getImageData(0, 0, size, size).data;
    let r = 0;
    let g = 0;
    let b = 0;
    let count = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] < 20) continue;
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }
    if (!count) return fallback;
    return `rgb(${Math.round(r / count)}, ${Math.round(g / count)}, ${Math.round(b / count)})`;
  }

  function samplePhotoPalette(image) {
    const w = image.naturalWidth;
    const h = image.naturalHeight;
    return {
      head: averageImageColor(image, w * 0.28, h * 0.08, w * 0.44, h * 0.28, config.fur),
      torso: averageImageColor(image, w * 0.22, h * 0.3, w * 0.56, h * 0.42, config.accent),
      lower: averageImageColor(image, w * 0.2, h * 0.62, w * 0.6, h * 0.3, "#4fa994"),
      shade: averageImageColor(image, w * 0.1, h * 0.1, w * 0.8, h * 0.8, config.ear),
    };
  }

  function drawTorsoPath(ctx, cx, cy, shoulderW, hipW, bodyH, radius) {
    const top = cy - bodyH / 2;
    const bottom = cy + bodyH / 2;
    ctx.beginPath();
    ctx.moveTo(cx - shoulderW / 2 + radius, top);
    ctx.quadraticCurveTo(cx - shoulderW / 2, top, cx - shoulderW / 2, top + radius);
    ctx.lineTo(cx - hipW / 2, bottom - radius);
    ctx.quadraticCurveTo(cx - hipW / 2, bottom, cx - hipW / 2 + radius, bottom);
    ctx.lineTo(cx + hipW / 2 - radius, bottom);
    ctx.quadraticCurveTo(cx + hipW / 2, bottom, cx + hipW / 2, bottom - radius);
    ctx.lineTo(cx + shoulderW / 2, top + radius);
    ctx.quadraticCurveTo(cx + shoulderW / 2, top, cx + shoulderW / 2 - radius, top);
    ctx.closePath();
  }

  function drawPaw(ctx, x, y, size, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = config.fur;
    drawRoundRect(ctx, -size * 0.35, -size * 0.2, size * 0.7, size * 0.55, size * 0.25);
    ctx.fillStyle = config.belly;
    ctx.beginPath();
    ctx.ellipse(0, size * 0.05, size * 0.22, size * 0.18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawEar(ctx, x, y, size, angle, inner) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.fillStyle = config.fur;
    ctx.beginPath();
    if (config.animal === "cat") {
      ctx.moveTo(0, 0);
      ctx.lineTo(-size * 0.35, -size);
      ctx.lineTo(size * 0.35, -size);
    } else if (config.animal === "bear") {
      ctx.arc(0, -size * 0.35, size * 0.45, 0, Math.PI * 2);
    } else {
      ctx.ellipse(0, -size * 0.45, size * 0.32, size * 0.85, 0, 0, Math.PI * 2);
    }
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = inner;
    ctx.beginPath();
    ctx.ellipse(0, -size * 0.4, size * 0.14, size * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function drawTail(ctx, bodyX, bodyY, scale, t, pose) {
    const wag = Math.sin(t * 6) * (pose === "run" || pose === "jump" ? 0.45 : 0.25);
    ctx.save();
    ctx.translate(bodyX + scale * 42, bodyY + scale * 10);
    ctx.rotate(-0.6 + wag);
    ctx.fillStyle = config.fur;
    if (config.animal === "cat") {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(scale * 25, -scale * 15, scale * 8, -scale * 55);
      ctx.quadraticCurveTo(scale * -5, -scale * 30, 0, 0);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.ellipse(scale * 15, 0, scale * 22, scale * 12, 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawFace(ctx, hx, hy, r, t, pose, blinking) {
    const eyeY = hy - r * 0.05;
    const eyeOff = r * 0.32;

    if (blinking) {
      ctx.strokeStyle = "#3a2a22";
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(hx - eyeOff - 6, eyeY);
      ctx.lineTo(hx - eyeOff + 6, eyeY);
      ctx.moveTo(hx + eyeOff - 6, eyeY);
      ctx.lineTo(hx + eyeOff + 6, eyeY);
      ctx.stroke();
    } else {
      ctx.fillStyle = "#2a2018";
      ctx.beginPath();
      ctx.ellipse(hx - eyeOff, eyeY, r * 0.13, r * 0.17, 0, 0, Math.PI * 2);
      ctx.ellipse(hx + eyeOff, eyeY, r * 0.13, r * 0.17, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.arc(hx - eyeOff + 3, eyeY - 3, r * 0.05, 0, Math.PI * 2);
      ctx.arc(hx + eyeOff + 3, eyeY - 3, r * 0.05, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "#ffb4b4";
    ctx.globalAlpha = 0.45;
    ctx.beginPath();
    ctx.ellipse(hx - r * 0.5, hy + r * 0.2, r * 0.12, r * 0.08, 0, 0, Math.PI * 2);
    ctx.ellipse(hx + r * 0.5, hy + r * 0.2, r * 0.12, r * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.fillStyle = "#e88";
    ctx.beginPath();
    ctx.ellipse(hx, hy + r * 0.18, r * 0.09, r * 0.07, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#8a5a4a";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    if (pose === "stretch") {
      ctx.beginPath();
      ctx.arc(hx, hy + r * 0.38, r * 0.18, 0.1 * Math.PI, 0.9 * Math.PI);
      ctx.stroke();
    } else if (pose === "jump" || pose === "run") {
      ctx.beginPath();
      ctx.moveTo(hx - r * 0.12, hy + r * 0.38);
      ctx.lineTo(hx + r * 0.12, hy + r * 0.38);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(hx, hy + r * 0.35, r * 0.12, 0.15 * Math.PI, 0.85 * Math.PI);
      ctx.stroke();
    }

    if (pose === "run" || pose === "jump") {
      ctx.fillStyle = "rgba(100,180,255,0.7)";
      ctx.beginPath();
      ctx.ellipse(hx + r * 0.75, hy - r * 0.5, r * 0.1, r * 0.14, -0.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawScarf(ctx, bodyX, bodyY, scale) {
    ctx.fillStyle = config.accent;
    ctx.beginPath();
    ctx.ellipse(bodyX, bodyY - scale * 38, scale * 38, scale * 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(bodyX + scale * 20, bodyY - scale * 32);
    ctx.lineTo(bodyX + scale * 32, bodyY - scale * 10);
    ctx.lineTo(bodyX + scale * 14, bodyY - scale * 8);
    ctx.closePath();
    ctx.fill();
  }

  function drawLearningOverlay(ctx, lm, w, h, mirror) {
    const points = {};
    for (const i of MAJOR_JOINTS) {
      points[i] = toPoint(lm, i, w, h, mirror);
    }

    // 主骨架连线：让身体结构连贯，便于模仿学习
    ctx.save();
    ctx.strokeStyle = "rgba(61, 217, 196, 0.55)";
    ctx.lineWidth = Math.max(2, Math.min(w, h) * 0.009);
    ctx.lineCap = "round";
    BONES.forEach(([a, b]) => {
      const pa = points[a];
      const pb = points[b];
      if (!pa || !pb) return;
      ctx.beginPath();
      ctx.moveTo(pa.x, pa.y);
      ctx.lineTo(pb.x, pb.y);
      ctx.stroke();
    });

    // 关键关节高亮：肩肘腕、髋膝踝
    const r = Math.max(4, Math.min(w, h) * 0.012);
    for (const i of MAJOR_JOINTS) {
      const p = points[i];
      if (!p) continue;
      ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
      ctx.beginPath();
      ctx.arc(p.x, p.y, r * 0.55, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 107, 74, 0.95)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 小标签：帮助快速识别核心关节
    ctx.font = `${Math.max(10, Math.min(w, h) * 0.025)}px "Noto Sans SC", sans-serif`;
    ctx.fillStyle = "rgba(232, 237, 244, 0.9)";
    for (const i of [11, 12, 13, 14, 23, 24, 25, 26]) {
      const p = points[i];
      if (!p) continue;
      ctx.fillText(JOINT_LABELS[i], p.x + 6, p.y - 6);
    }
    ctx.restore();
  }

  function drawCuteAnimal(ctx, w, h, lm, pose) {
    const t = performance.now() / 1000;
    blinkTimer += 1;
    const blinking = blinkTimer % 180 > 174;

    const model = lmToAnimalModel(lm, w, h, false);
    const cx = model?.bodyX ?? w * 0.5;
    const cy = model?.bodyY ?? h * 0.58;
    const sc = (model?.scale ?? 1) * Math.min(w, h) / 380;
    const bounce = pose === "idle" ? Math.sin(t * 2.8) * 8 * sc : Math.sin(t * 4) * 12 * sc * (pose === "jump" ? 1.5 : 0.6);

    const bodyX = cx + (model?.lean ?? 0) * 20;
    const bodyY = cy + bounce;
    const headR = 52 * sc;
    const headX = model?.headX ?? bodyX;
    const headY = (model?.headY ?? bodyY - headR * 1.35) + bounce * 0.5;

    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.25)";
    ctx.shadowBlur = 18 * sc;
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.beginPath();
    ctx.ellipse(bodyX, bodyY + 75 * sc, 55 * sc, 12 * sc, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    drawTail(ctx, bodyX, bodyY, sc, t, pose);

    const pawSize = 28 * sc;
    const paws = model?.paws || [
      { x: bodyX - 45 * sc, y: bodyY - 10 * sc },
      { x: bodyX + 45 * sc, y: bodyY - 10 * sc },
      { x: bodyX - 30 * sc, y: bodyY + 65 * sc },
      { x: bodyX + 30 * sc, y: bodyY + 65 * sc },
    ];
    const pawAngles = pose === "jump" ? [-0.8, 0.8, -0.3, 0.3]
      : pose === "stretch" ? [-1.4, 1.4, -0.2, 0.2]
      : pose === "run" ? [Math.sin(t * 8) * 0.5, -Math.sin(t * 8) * 0.5, -Math.sin(t * 8) * 0.4, Math.sin(t * 8) * 0.4]
      : [Math.sin(t * 2) * 0.15, -Math.sin(t * 2) * 0.15, 0.1, -0.1];

    [2, 3, 0, 1].forEach((i) => drawPaw(ctx, paws[i].x, paws[i].y, pawSize, pawAngles[i]));

    ctx.fillStyle = config.fur;
    ctx.beginPath();
    ctx.ellipse(bodyX, bodyY, 62 * sc, 52 * sc, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = config.belly;
    ctx.beginPath();
    ctx.ellipse(bodyX, bodyY + 12 * sc, 38 * sc, 32 * sc, 0, 0, Math.PI * 2);
    ctx.fill();

    drawScarf(ctx, bodyX, bodyY, sc);

    const earWag = Math.sin(t * 3.5) * 0.08;
    drawEar(ctx, headX - headR * 0.55, headY - headR * 0.5, headR * 0.55, -0.2 + earWag, config.ear);
    drawEar(ctx, headX + headR * 0.55, headY - headR * 0.5, headR * 0.55, 0.2 - earWag, config.ear);

    ctx.fillStyle = config.fur;
    ctx.beginPath();
    ctx.arc(headX, headY, headR, 0, Math.PI * 2);
    ctx.fill();

    drawFace(ctx, headX, headY, headR, t, pose, blinking);
    ctx.restore();
  }

  function drawPhotoCharacter(ctx, w, h, lm, mirror) {
    const img = photoAvatar?.image;
    if (!img?.complete || !img.naturalWidth) {
      drawPhotoPlaceholder(ctx, w, h);
      return;
    }

    const model = lmToAnimalModel(lm, w, h, mirror);
    const points = {};
    for (const i of [0, 11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28]) {
      points[i] = toPoint(lm, i, w, h, mirror);
    }

    const cx = model?.bodyX ?? w * 0.5;
    const cy = model?.bodyY ?? h * 0.56;
    const sc = (model?.scale ?? 1) * Math.min(w, h) / 390;
    const detectedHead = points[0] || { x: cx, y: cy - 120 * sc };
    const shoulder = points[11] && points[12]
      ? { x: (points[11].x + points[12].x) / 2, y: (points[11].y + points[12].y) / 2 }
      : { x: cx, y: cy - 70 * sc };
    const hip = points[23] && points[24]
      ? { x: (points[23].x + points[24].x) / 2, y: (points[23].y + points[24].y) / 2 }
      : { x: cx, y: cy + 35 * sc };

    const shoulderW = Math.max(72 * sc, Math.abs((points[11]?.x ?? cx - 40 * sc) - (points[12]?.x ?? cx + 40 * sc)) * 1.35);
    const hipW = Math.max(54 * sc, Math.abs((points[23]?.x ?? cx - 30 * sc) - (points[24]?.x ?? cx + 30 * sc)) * 1.35);
    const bodyW = Math.max(74 * sc, (shoulderW + hipW) * 0.58);
    const bodyH = Math.max(112 * sc, Math.hypot(hip.x - shoulder.x, hip.y - shoulder.y) * 1.42);
    const headR = Math.max(34 * sc, Math.min(58 * sc, bodyW * 0.43));
    const limbW = Math.max(14, 20 * sc);
    const palette = photoAvatar.palette || {};
    const skin = palette.head || config.fur || "#f5c6a0";
    const shade = palette.shade || config.ear || "#e8a87c";
    const cloth = palette.torso || config.accent || "#ff6b4a";
    const lower = palette.lower || "#4fa994";
    const head = {
      x: shoulder.x + (detectedHead.x - shoulder.x) * 0.55,
      y: Math.min(
        Math.max(detectedHead.y - headR * 0.35, shoulder.y - headR * 1.85),
        shoulder.y - headR * 0.95
      ),
    };

    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.28)";
    ctx.shadowBlur = 18 * sc;
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.beginPath();
    ctx.ellipse(cx, hip.y + 70 * sc, bodyW * 0.55, 12 * sc, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    drawPhotoLimb(ctx, points[11], points[13], limbW * 1.03, cloth, skin);
    drawPhotoLimb(ctx, points[13], points[15], limbW * 0.84, skin, shade);
    drawPhotoLimb(ctx, points[12], points[14], limbW * 1.03, cloth, skin);
    drawPhotoLimb(ctx, points[14], points[16], limbW * 0.84, skin, shade);
    drawPhotoLimb(ctx, points[23], points[25], limbW * 1.18, cloth, lower);
    drawPhotoLimb(ctx, points[25], points[27], limbW * 0.94, lower, skin);
    drawPhotoLimb(ctx, points[24], points[26], limbW * 1.18, cloth, lower);
    drawPhotoLimb(ctx, points[26], points[28], limbW * 0.94, lower, skin);

    ctx.save();
    ctx.translate(cx, (shoulder.y + hip.y) / 2);
    ctx.rotate((shoulder.x - hip.x) * 0.008);
    drawTorsoPath(ctx, 0, 0, shoulderW * 0.86, hipW * 0.78, bodyH, 22 * sc);
    ctx.fillStyle = cloth;
    ctx.fill();
    ctx.clip();
    drawImageCover(ctx, img, -bodyW / 2, -bodyH / 2, bodyW, bodyH);
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = cloth;
    ctx.fillRect(-bodyW / 2, bodyH * 0.05, bodyW, bodyH * 0.42);
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(head.x, head.y, headR, 0, Math.PI * 2);
    ctx.clip();
    drawImageCover(ctx, img, head.x - headR, head.y - headR, headR * 2, headR * 2);
    ctx.restore();

    ctx.strokeStyle = "rgba(255,255,255,0.82)";
    ctx.lineWidth = Math.max(2, 3 * sc);
    ctx.beginPath();
    ctx.arc(head.x, head.y, headR, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = skin;
    [15, 16, 27, 28].forEach((i) => {
      const p = points[i];
      if (!p) return;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(7, 10 * sc), 0, Math.PI * 2);
      ctx.fill();
    });

    [13, 14, 25, 26].forEach((i) => drawSoftJoint(ctx, points[i], Math.max(5, 7 * sc), "rgba(255,255,255,0.18)"));

    ctx.restore();
  }

  function draw(ctx, landmarks, w, h, options = {}) {
    const mirror = options.mirror ?? false;
    const wireframe = options.wireframe ?? false;
    const lm = landmarks || applyPreset(defaultLandmarks(), presetPose);

    ctx.clearRect(0, 0, w, h);

    if (wireframe) {
      BONES.forEach(([a, b]) => {
        const pa = toPoint(lm, a, w, h, mirror);
        const pb = toPoint(lm, b, w, h, mirror);
        if (!pa || !pb) return;
        ctx.strokeStyle = "rgba(61, 217, 196, 0.85)";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      });
      for (const i of [0, 11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28]) {
        const p = toPoint(lm, i, w, h, mirror);
        if (!p) continue;
        ctx.fillStyle = "#3dd9c4";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      return;
    }

    const grad = ctx.createRadialGradient(w * 0.5, h * 0.7, 20, w * 0.5, h * 0.5, h * 0.6);
    grad.addColorStop(0, "rgba(61,217,196,0.08)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    if (photoAvatar) {
      drawPhotoCharacter(ctx, w, h, lm, mirror);
    } else {
      drawCuteAnimal(ctx, w, h, lm, presetPose);
      drawLearningOverlay(ctx, lm, w, h, mirror);
    }
  }

  function renderMount(entry) {
    const { canvas, mirror, wireframe } = entry;
    const parent = canvas.parentElement;
    if (!parent) return;

    const w = parent.clientWidth;
    const h = parent.clientHeight;
    if (w < 2 || h < 2) return;

    const dpr = window.devicePixelRatio || 1;
    if (entry.lastW !== w || entry.lastH !== h) {
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      entry.lastW = w;
      entry.lastH = h;
    }

    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const lm = currentLandmarks
      ? currentLandmarks
      : applyPreset(defaultLandmarks(), presetPose);
    draw(ctx, lm, w, h, { mirror, wireframe });
  }

  function observeMount(entry) {
    const parent = entry.canvas.parentElement;
    if (!parent || entry.observer) return;
    entry.observer = new ResizeObserver(() => {
      entry.lastW = 0;
      entry.lastH = 0;
    });
    entry.observer.observe(parent);
  }

  function renderAll() {
    mounts.forEach((entry) => renderMount(entry));
  }

  function loop() {
    renderAll();
    rafId = requestAnimationFrame(loop);
  }

  function mount(selector, options = {}) {
    const el = typeof selector === "string" ? document.querySelector(selector) : selector;
    if (!el) return;
    el.innerHTML = `<canvas class="skeleton-canvas"></canvas>`;
    const canvas = el.querySelector("canvas");
    const mountEntry = { canvas, mirror: options.mirror ?? false, wireframe: options.wireframe ?? false, lastW: 0, lastH: 0 };
    mounts.set(el, mountEntry);
    observeMount(mountEntry);
    if (!rafId) loop();
    renderMount(mountEntry);
  }

  function setLandmarks(lm) {
    currentLandmarks = lm ? cloneLm(lm) : null;
  }

  function setPresetPose(pose) {
    presetPose = pose || "idle";
  }

  function clearLandmarks() {
    currentLandmarks = null;
  }

  function setConfig(partial) {
    if (partial.skin) partial.fur = partial.skin;
    if (partial.hair) partial.ear = partial.hair;
    if (partial.top) partial.accent = partial.top;
    if (partial.bottom) partial.belly = partial.bottom;
    if (partial.hairColor) partial.ear = partial.hairColor;
    if (partial.topColor) partial.accent = partial.topColor;
    if (partial.bottomColor) partial.belly = partial.bottomColor;
    config = { ...config, ...partial };
  }

  function setPhoto(url) {
    if (!url) {
      photoAvatar = null;
      return;
    }
    const image = new Image();
    photoAvatar = { image, ready: false, url };
    image.onload = () => {
      if (photoAvatar?.url === url) {
        photoAvatar.palette = samplePhotoPalette(image);
        photoAvatar.ready = true;
        renderAll();
      }
    };
    image.onerror = () => {
      if (photoAvatar?.url === url) photoAvatar = null;
    };
    image.src = url;
  }

  function clearPhoto() {
    photoAvatar = null;
    renderAll();
  }

  function getConfig() {
    return { ...config };
  }

  return {
    mount,
    draw,
    setLandmarks,
    setPresetPose,
    clearLandmarks,
    setConfig,
    setPhoto,
    clearPhoto,
    getConfig,
    defaultLandmarks,
    renderAll,
  };
})();
