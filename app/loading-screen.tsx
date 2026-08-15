"use client";

import { useEffect, useRef, useState } from "react";

type LoadingScreenProps = {
  onComplete: () => void;
};

type EditorialStage = "observe" | "interact" | "study" | "respond" | "release" | "ready";

function getEditorialStage(progress: number): EditorialStage {
  if (progress < 20) return "observe";
  if (progress < 40) return "interact";
  if (progress < 60) return "study";
  if (progress < 75) return "respond";
  if (progress < 90) return "release";
  return "ready";
}

const stageLabels: Record<EditorialStage, string> = {
  observe: "AUTONOMOUS SYSTEM / 01",
  interact: "HUMAN INPUT / ACTIVE",
  study: "RESPONSE / OBSERVED",
  respond: "PHYSICAL SYSTEM / ACTIVE",
  release: "CONTROL / RELEASED",
  ready: "SYSTEM READY",
};

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"active" | "hold" | "exiting">("active");
  const stageRef = useRef<HTMLDivElement>(null);
  const completeRef = useRef(onComplete);
  const editorialStage = getEditorialStage(progress);

  useEffect(() => {
    completeRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduce ? 380 : 3600;
    const hold = reduce ? 80 : 420;
    const exit = reduce ? 180 : 650;
    const body = document.body;
    let animationFrame = 0;
    let holdTimer = 0;
    let exitTimer = 0;
    let start = 0;

    body.classList.add("loader-is-active");
    window.scrollTo({ top: 0, behavior: "auto" });

    const update = (time: number) => {
      if (!start) start = time;
      const ratio = Math.min(1, (time - start) / duration);
      setProgress(Math.min(100, Math.floor(ratio * 100)));

      if (ratio < 1) {
        animationFrame = window.requestAnimationFrame(update);
        return;
      }

      setProgress(100);
      setPhase("hold");
      holdTimer = window.setTimeout(() => setPhase("exiting"), hold);
      exitTimer = window.setTimeout(() => completeRef.current(), hold + exit);
    };

    animationFrame = window.requestAnimationFrame(update);
    return () => {
      body.classList.remove("loader-is-active");
      window.cancelAnimationFrame(animationFrame);
      window.clearTimeout(holdTimer);
      window.clearTimeout(exitTimer);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches) return;
    const stage = stageRef.current;
    if (!stage) return;

    let frame = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const render = () => {
      currentX += (targetX - currentX) * 0.065;
      currentY += (targetY - currentY) * 0.065;
      stage.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      frame = window.requestAnimationFrame(render);
    };
    const handlePointer = (event: PointerEvent) => {
      targetX = (event.clientX / window.innerWidth - 0.5) * 4;
      targetY = (event.clientY / window.innerHeight - 0.5) * 3;
    };

    window.addEventListener("pointermove", handlePointer, { passive: true });
    frame = window.requestAnimationFrame(render);
    return () => {
      window.removeEventListener("pointermove", handlePointer);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="editorial-loader" data-phase={phase} data-editorial-stage={editorialStage}>
      <header className="editorial-loader__masthead" aria-hidden="true">
        <strong>ISCICPS &apos;27</strong>
        <span>HUMAN × PHYSICAL SYSTEM</span>
      </header>

      <div className="editorial-loader__stage" ref={stageRef} aria-hidden="true">
        <figure className="editorial-loader__plate">
          {/* These WebP plates are pre-optimized and crossfade as one controlled editorial state change. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="editorial-loader__scene editorial-loader__scene--interact" src="/images/loader-editorial-interact-transparent.webp" alt="" fetchPriority="high" decoding="async" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="editorial-loader__scene editorial-loader__scene--autonomous" src="/images/loader-editorial-autonomous-transparent.webp" alt="" fetchPriority="high" decoding="async" />

          <span className="editorial-loader__sensor" />
          <span className="editorial-loader__actuator"><i /></span>
          <span className="editorial-loader__motion-mark editorial-loader__motion-mark--one" />
          <span className="editorial-loader__motion-mark editorial-loader__motion-mark--two" />

          <span className="editorial-loader__scribble editorial-loader__scribble--one" />
          <span className="editorial-loader__scribble editorial-loader__scribble--two" />
        </figure>
      </div>

      <div className="editorial-loader__readout">
        <div
          className="editorial-loader__percentage"
          role="progressbar"
          aria-label="Preparing autonomous physical system"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <strong aria-hidden="true">{String(progress).padStart(2, "0")}%</strong>
        </div>
        <span>{stageLabels[editorialStage]}</span>
      </div>

      <div className="editorial-loader__folio" aria-hidden="true">
        <span>RESEARCH NOTE / CPS–27</span>
        <span>PLATE 01</span>
      </div>
    </div>
  );
}
