"use client";

import { gsap } from "gsap";
import { useEffect, useRef } from "react";

type ArtifactType =
  | "notebook" | "paper" | "badge" | "schematic" | "circuit" | "robotHand"
  | "component" | "venuePlan" | "note" | "usb" | "ruler"
  | "coffee" | "pencil" | "photo" | "network" | "chip" | "sensor"
  | "waveform" | "equation" | "globe" | "tracing" | "paperclip";

type MotionProfile = "paper" | "technical" | "fragment" | "heavy" | "floating";

type DeskObject = {
  type: ArtifactType;
  profile: MotionProfile;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  scale: number;
  depth: number;
  opacity: number;
  phase: number;
  bob: number;
  bobSpeed: number;
  tween: ReturnType<typeof gsap.timeline> | null;
};

const BLUE = "#1453a6";
const INK = "#171717";
const PAPER = "#f0ece2";
const artifactTypes: ArtifactType[] = [
  "notebook", "paper", "badge", "schematic", "circuit", "robotHand", "component",
  "venuePlan", "note", "usb", "ruler", "coffee", "pencil", "photo",
  "network", "chip", "sensor", "waveform", "equation", "globe", "tracing", "paperclip",
];

const range = (min: number, max: number) => min + Math.random() * (max - min);
const choose = <T,>(items: T[]) => items[Math.floor(Math.random() * items.length)];

function artifactProfile(type: ArtifactType): MotionProfile {
  if (["paper", "notebook", "venuePlan", "equation"].includes(type)) return "paper";
  if (["badge", "coffee", "component"].includes(type)) return "heavy";
  if (["note", "usb", "pencil", "paperclip", "sensor"].includes(type)) return "fragment";
  if (["tracing", "photo", "robotHand"].includes(type)) return "floating";
  return "technical";
}

function artifactSize(type: ArtifactType) {
  if (["notebook", "paper", "venuePlan", "schematic", "equation", "tracing"].includes(type)) return [190, 138];
  if (["badge", "robotHand", "photo"].includes(type)) return [116, 148];
  if (["coffee", "globe", "network"].includes(type)) return [94, 94];
  if (["pencil", "ruler"].includes(type)) return [154, 30];
  if (["circuit", "waveform", "chip"].includes(type)) return [132, 86];
  return [84, 64];
}

function paper(ctx: CanvasRenderingContext2D, width: number, height: number, alpha = 1) {
  ctx.fillStyle = `rgba(66, 54, 38, ${0.09 * alpha})`;
  ctx.fillRect(5, 6, width, height);
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = `rgba(20, 83, 166, ${0.52 * alpha})`;
  ctx.lineWidth = 1;
  ctx.strokeRect(0.5, 0.5, width - 1, height - 1);
}

function label(ctx: CanvasRenderingContext2D, value: string, x: number, y: number, size = 7, color = BLUE) {
  ctx.fillStyle = color;
  ctx.font = `600 ${size}px ui-monospace, monospace`;
  ctx.fillText(value, x, y);
}

function line(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color = INK, alpha = 0.55) {
  ctx.strokeStyle = color;
  ctx.globalAlpha *= alpha;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.globalAlpha /= alpha;
}

function drawArtifact(ctx: CanvasRenderingContext2D, object: DeskObject) {
  const w = object.width;
  const h = object.height;
  ctx.lineWidth = 1;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  switch (object.type) {
    case "notebook": {
      paper(ctx, w, h);
      line(ctx, 24, 0, 24, h, BLUE, 0.55);
      for (let y = 26; y < h; y += 18) line(ctx, 0, y, w, y, BLUE, 0.2);
      for (let y = 12; y < h; y += 18) {
        ctx.strokeStyle = INK;
        ctx.beginPath(); ctx.arc(w - 3, y, 6, Math.PI * 0.5, Math.PI * 1.5); ctx.stroke();
      }
      label(ctx, "FIELD NOTES / ICPS 27", 34, 20, 8);
      label(ctx, "observe", 36, 52, 8, INK); label(ctx, "connect", 36, 75, 8, INK); label(ctx, "build", 36, 98, 8, INK);
      break;
    }
    case "paper":
    case "equation": {
      paper(ctx, w, h);
      label(ctx, object.type === "paper" ? "MANUSCRIPT / 027" : "SYSTEM MODEL / x(t)", 12, 16, 7);
      label(ctx, object.type === "paper" ? "INTELLIGENT PHYSICAL SYSTEMS" : "ẋ = Ax + Bu", 12, 38, 9, INK);
      for (let y = 54; y < h - 18; y += 12) line(ctx, 12, y, w - range(18, 52), y, INK, 0.25);
      if (object.type === "equation") { label(ctx, "Σ wᵢfᵢ(x) → u(t)", 18, h - 18, 9); }
      break;
    }
    case "badge": {
      paper(ctx, w, h);
      line(ctx, w * 0.35, 0, w * 0.44, 20, INK, 0.55); line(ctx, w * 0.65, 0, w * 0.56, 20, INK, 0.55);
      ctx.strokeStyle = BLUE; ctx.beginPath(); ctx.arc(w / 2, 47, 17, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(w / 2, 42, 5, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(w / 2, 56, 9, Math.PI, Math.PI * 2); ctx.stroke();
      label(ctx, "ISCICPS ’27", 18, 78, 8); label(ctx, "RESEARCHER", 16, 99, 10, INK); label(ctx, "SRMIST · INDIA", 18, 122, 6);
      break;
    }
    case "schematic":
    case "venuePlan": {
      paper(ctx, w, h, object.type === "venuePlan" ? 0.8 : 1);
      label(ctx, object.type === "schematic" ? "TECHNICAL SECTION A—A" : "VENUE PLAN / KTR", 10, 14, 7);
      ctx.strokeStyle = BLUE; ctx.globalAlpha *= 0.18;
      for (let x = 10; x < w; x += 16) line(ctx, x, 22, x, h - 10, BLUE, 1);
      for (let y = 22; y < h; y += 16) line(ctx, 10, y, w - 10, y, BLUE, 1);
      ctx.globalAlpha /= 0.18;
      ctx.strokeStyle = INK; ctx.globalAlpha *= 0.65;
      ctx.beginPath(); ctx.moveTo(14, h - 18); ctx.lineTo(40, h - 50); ctx.lineTo(72, h - 50); ctx.lineTo(72, h - 82); ctx.lineTo(112, h - 82); ctx.lineTo(150, h - 28); ctx.lineTo(w - 14, h - 18); ctx.stroke();
      ctx.globalAlpha /= 0.65;
      break;
    }
    case "circuit":
    case "network": {
      if (object.type === "circuit") paper(ctx, w, h, 0.8);
      const nodes = [[12, 15], [w * 0.42, 12], [w * 0.66, h * 0.48], [w - 14, 19], [w * 0.28, h - 14], [w - 20, h - 12]];
      [[0,1],[1,2],[2,3],[0,4],[4,2],[2,5]].forEach(([a,b]) => line(ctx, nodes[a][0], nodes[a][1], nodes[b][0], nodes[b][1], BLUE, 0.65));
      nodes.forEach(([x,y], index) => { ctx.fillStyle = index % 2 ? BLUE : PAPER; ctx.strokeStyle = BLUE; ctx.beginPath(); ctx.arc(x,y,4,0,Math.PI*2); ctx.fill(); ctx.stroke(); });
      break;
    }
    case "robotHand": {
      paper(ctx, w, h, 0.7); label(ctx, "ROBOTIC END EFFECTOR", 8, 14, 6);
      ctx.strokeStyle = BLUE; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(w * 0.38, h - 12); ctx.lineTo(w * 0.43, h * 0.62); ctx.lineTo(w * 0.32, h * 0.44); ctx.lineTo(w * 0.39, h * 0.38); ctx.lineTo(w * 0.52, h * 0.57); ctx.lineTo(w * 0.52, h * 0.25); ctx.lineTo(w * 0.6, h * 0.24); ctx.lineTo(w * 0.64, h * 0.56); ctx.lineTo(w * 0.73, h * 0.3); ctx.lineTo(w * 0.8, h * 0.34); ctx.lineTo(w * 0.72, h * 0.68); ctx.lineTo(w * 0.58, h * 0.78); ctx.lineTo(w * 0.55, h - 12); ctx.stroke();
      [0.43,0.57,0.7].forEach((x) => { ctx.beginPath(); ctx.arc(w*x,h*0.61,3,0,Math.PI*2); ctx.stroke(); });
      break;
    }
    case "component":
    case "chip":
    case "sensor": {
      const bw = w * 0.72, bh = h * 0.68, x = (w - bw) / 2, y = (h - bh) / 2;
      ctx.fillStyle = PAPER; ctx.strokeStyle = INK; ctx.fillRect(x,y,bw,bh); ctx.strokeRect(x,y,bw,bh);
      for (let px = x + 8; px < x + bw; px += 12) { line(ctx, px, y - 7, px, y, INK, 0.65); line(ctx, px, y + bh, px, y + bh + 7, INK, 0.65); }
      for (let py = y + 8; py < y + bh; py += 12) { line(ctx, x - 7, py, x, py, INK, 0.65); line(ctx, x + bw, py, x + bw + 7, py, INK, 0.65); }
      ctx.strokeStyle = BLUE; ctx.strokeRect(x+10,y+10,bw-20,bh-20); label(ctx, object.type.toUpperCase(), x+14, y+bh/2+3, 7);
      break;
    }
    case "note": {
      ctx.fillStyle = "#e6dfc9"; ctx.fillRect(0,0,w,h); ctx.strokeStyle = "rgba(20,83,166,.45)"; ctx.strokeRect(.5,.5,w-1,h-1);
      label(ctx, "what if", 10, 20, 8, INK); label(ctx, "the system listened?", 10, 39, 8, BLUE);
      break;
    }
    case "usb": {
      ctx.fillStyle = "#d9d2c5"; ctx.strokeStyle = INK; ctx.fillRect(16,8,w-18,h-16); ctx.strokeRect(16,8,w-18,h-16); ctx.fillRect(0,18,18,h-36); ctx.strokeRect(0,18,18,h-36); label(ctx,"DATA",28,h/2,7);
      break;
    }
    case "globe": {
      ctx.strokeStyle = BLUE; ctx.beginPath(); ctx.arc(w/2,h/2,Math.min(w,h)*0.38,0,Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(w/2,h/2,w*.13,h*.38,0,0,Math.PI*2); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(w/2,h/2,w*.38,h*.13,0,0,Math.PI*2); ctx.stroke();
      line(ctx,w/2,4,w/2,h-4,INK,.45); line(ctx,4,h/2,w-4,h/2,INK,.45); label(ctx,"CPS",w/2-3,8,7);
      break;
    }
    case "ruler": {
      ctx.fillStyle = "rgba(232,224,207,.82)"; ctx.strokeStyle = INK; ctx.fillRect(0,0,w,h); ctx.strokeRect(.5,.5,w-1,h-1);
      for (let x=8;x<w;x+=8) line(ctx,x,0,x,x%32===0?h*.7:h*.4,INK,.55);
      break;
    }
    case "coffee": {
      ctx.fillStyle = "rgba(76,58,38,.16)"; ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(w*.46,h*.5,w*.31,0,Math.PI*2); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = BLUE; ctx.beginPath(); ctx.arc(w*.46,h*.5,w*.22,0,Math.PI*2); ctx.stroke();
      ctx.strokeStyle = INK; ctx.beginPath(); ctx.arc(w*.78,h*.52,w*.15,-Math.PI/2,Math.PI/2); ctx.stroke();
      break;
    }
    case "pencil": {
      ctx.fillStyle = "#ded6c6"; ctx.strokeStyle = INK; ctx.beginPath(); ctx.moveTo(0,h/2); ctx.lineTo(15,3); ctx.lineTo(w-10,3); ctx.lineTo(w,h/2); ctx.lineTo(w-10,h-3); ctx.lineTo(15,h-3); ctx.closePath(); ctx.fill(); ctx.stroke();
      line(ctx,15,3,15,h-3,BLUE,.7); line(ctx,w-22,3,w-22,h-3,BLUE,.7);
      break;
    }
    case "photo": {
      paper(ctx,w,h); ctx.fillStyle = "rgba(20,83,166,.12)"; ctx.fillRect(9,9,w-18,h-35);
      ctx.strokeStyle = BLUE; ctx.beginPath(); ctx.moveTo(14,h-35); ctx.lineTo(w*.4,h*.48); ctx.lineTo(w*.57,h*.63); ctx.lineTo(w-14,h*.37); ctx.stroke(); label(ctx,"KATTANKULATHUR",12,h-11,6);
      break;
    }
    case "waveform": {
      paper(ctx,w,h,.7); label(ctx,"SIGNAL / t",8,13,6); ctx.strokeStyle = BLUE; ctx.beginPath();
      for(let x=8;x<w-8;x+=2){const y=h/2+Math.sin(x*.18)*10*Math.sin(x*.045); if(x===8)ctx.moveTo(x,y);else ctx.lineTo(x,y);} ctx.stroke(); line(ctx,8,h/2,w-8,h/2,INK,.25);
      break;
    }
    case "tracing": {
      ctx.fillStyle = "rgba(240,236,226,.52)"; ctx.fillRect(0,0,w,h); ctx.strokeStyle = "rgba(20,83,166,.42)"; ctx.strokeRect(.5,.5,w-1,h-1);
      ctx.setLineDash([4,5]); ctx.beginPath(); ctx.moveTo(10,h-12); ctx.bezierCurveTo(w*.28,10,w*.65,h*.82,w-10,16); ctx.stroke(); ctx.setLineDash([]); label(ctx,"TRACE / 04",10,15,6);
      break;
    }
    case "paperclip": {
      ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(w/2,h/2,w*.22,h*.42,.25,0,Math.PI*2); ctx.stroke(); ctx.lineWidth=1; ctx.beginPath(); ctx.ellipse(w/2+3,h/2,w*.12,h*.3,.25,0,Math.PI*2); ctx.stroke();
      break;
    }
  }
}

export function ResearchDeskCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stage = { width: 0, height: 0, dpr: 1 };
    const objects: DeskObject[] = [];
    const pointer = { targetX: 0, targetY: 0, x: 0, y: 0 };

    const makeObject = (index: number): DeskObject => {
      const type = artifactTypes[index % artifactTypes.length];
      const [width, height] = artifactSize(type);
      return { type, profile: artifactProfile(type), x: 0, y: 0, width, height, rotation: 0, scale: 1, depth: 0.5, opacity: 1, phase: range(0, Math.PI * 2), bob: 2, bobSpeed: 0.001, tween: null };
    };

    const laneY = (depth: number, renderedHeight: number) => {
      const minimumY = 12;
      const maximumY = Math.max(minimumY, stage.height - renderedHeight - 12);
      const edgeLane = Math.random() > 0.46;
      if (!edgeLane && depth < 0.45) return range(Math.min(maximumY, stage.height * 0.28), Math.min(maximumY, stage.height * 0.62));
      const topMaximum = Math.min(maximumY, stage.height * 0.24);
      const bottomMinimum = Math.min(maximumY, Math.max(minimumY, stage.height * 0.64));
      return Math.random() > 0.5 ? range(minimumY, topMaximum) : range(bottomMinimum, maximumY);
    };

    const spawn = (object: DeskObject, initialize = false) => {
      object.tween?.kill();
      object.type = choose(artifactTypes);
      object.profile = artifactProfile(object.type);
      const [baseWidth, baseHeight] = artifactSize(object.type);
      object.depth = range(0.12, 1);
      const profileScale = object.profile === "fragment" ? range(0.55, 0.82) : object.profile === "heavy" ? range(0.88, 1.2) : range(0.68, 1.05);
      object.scale = profileScale * (0.76 + object.depth * 0.42);
      object.width = baseWidth;
      object.height = baseHeight;
      object.opacity = range(0.55, 0.86) + object.depth * 0.1;
      object.rotation = range(-0.09, 0.09);
      object.phase = range(0, Math.PI * 2);
      object.bob = range(0.8, object.profile === "heavy" ? 2 : 4);
      object.bobSpeed = range(0.00035, 0.0008);
      const direction = Math.random() > 0.5 ? 1 : -1;
      const renderedWidth = object.width * object.scale;
      object.x = direction > 0 ? -renderedWidth - 30 : stage.width + renderedWidth + 30;
      object.y = laneY(object.depth, object.height * object.scale);
      const endX = direction > 0 ? stage.width + renderedWidth + 30 : -renderedWidth - 30;
      const rawDrift = object.profile === "floating" ? range(-stage.height * 0.12, stage.height * 0.12) : range(-18, 18);
      const endY = Math.min(stage.height - object.height * object.scale - 12, Math.max(12, object.y + rawDrift));
      const profileSpeed = { paper: 26, technical: 36, fragment: 48, heavy: 22, floating: 31 }[object.profile];
      const speed = profileSpeed * (0.78 + object.depth * 0.58);
      const duration = Math.abs(endX - object.x) / speed;
      object.tween = gsap.timeline({ onComplete: () => spawn(object) })
        .to(object, { x: endX, y: endY, rotation: object.rotation + range(-0.035, 0.035), duration, ease: "none" });
      if (initialize) object.tween.progress(Math.random());
    };

    const arrangeStill = () => {
      const placements = [[.04,.08],[.72,.08],[.12,.7],[.69,.72],[.34,.08],[.43,.76],[.06,.43],[.82,.42],[.27,.3],[.62,.28],[.18,.18],[.77,.25]];
      objects.forEach((object, index) => {
        object.tween?.kill();
        object.type = artifactTypes[(index * 2) % artifactTypes.length];
        object.profile = artifactProfile(object.type);
        const [w,h] = artifactSize(object.type); object.width=w; object.height=h;
        object.depth = range(.2,1); object.scale = range(.58,.92); object.opacity = range(.58,.9); object.rotation = range(-.08,.08);
        const place = placements[index % placements.length]; object.x = stage.width*place[0]; object.y = stage.height*place[1];
      });
    };

    const resize = () => {
      stage.width = canvas.clientWidth;
      stage.height = canvas.clientHeight;
      stage.dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(stage.width * stage.dpr);
      canvas.height = Math.round(stage.height * stage.dpr);
      const targetCount = reducedMotion
        ? (stage.width < 560 ? 8 : 12)
        : stage.width < 560 ? 12 : stage.width < 900 ? 20 : 32;
      objects.forEach((object) => object.tween?.kill());
      objects.length = 0;
      for (let index = 0; index < targetCount; index += 1) objects.push(makeObject(index));
      if (reducedMotion) arrangeStill(); else objects.forEach((object) => spawn(object, true));
      objects.sort((a, b) => a.depth - b.depth);
    };

    const render = (time: number) => {
      context.setTransform(stage.dpr, 0, 0, stage.dpr, 0, 0);
      context.clearRect(0, 0, stage.width, stage.height);
      pointer.x += (pointer.targetX - pointer.x) * 0.06;
      pointer.y += (pointer.targetY - pointer.y) * 0.06;
      objects.forEach((object) => {
        const parallax = object.depth < 0.34 ? 2 : object.depth < 0.72 ? 5 : 8;
        const bob = reducedMotion ? 0 : Math.sin(time * object.bobSpeed + object.phase) * object.bob;
        context.save();
        context.globalAlpha = object.opacity;
        context.translate(object.x + pointer.x * parallax, object.y + pointer.y * parallax + bob);
        context.rotate(object.rotation);
        context.scale(object.scale, object.scale);
        drawArtifact(context, object);
        context.restore();
      });
    };

    const onPointerMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      pointer.targetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    };
    const onPointerLeave = () => { pointer.targetX = 0; pointer.targetY = 0; };
    const onVisibility = () => objects.forEach((object) => document.hidden ? object.tween?.pause() : object.tween?.resume());
    const onResize = () => {
      resize();
      if (reducedMotion) render(performance.now());
    };
    const observer = new IntersectionObserver(([entry]) => canvas.toggleAttribute("data-visible", entry.isIntersecting), { threshold: 0.08 });

    resize();
    observer.observe(canvas);
    window.addEventListener("resize", onResize);
    if (reducedMotion) {
      render(performance.now());
    } else {
      gsap.ticker.add(render);
      canvas.addEventListener("pointermove", onPointerMove, { passive: true });
      canvas.addEventListener("pointerleave", onPointerLeave, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
    }
    return () => {
      observer.disconnect();
      gsap.ticker.remove(render);
      objects.forEach((object) => object.tween?.kill());
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="research-desk-canvas" role="img" aria-label="Animated editorial illustration of a researcher's desk with symposium papers, technical drawings, instruments, and research objects" />;
}
