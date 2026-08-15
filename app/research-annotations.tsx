"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

type AnnotationScene = "loader" | "home" | "about" | "research" | "casefile" | "timeline" | "venue" | "register" | "footer";

type AnnotationPosition = {
  x: number;
  y: number;
  opacity?: number;
};

type ResearchAnnotationConfig = {
  id: string;
  code: string;
  meaning: string;
  section: AnnotationScene[];
  desktopPosition: Partial<Record<AnnotationScene, AnnotationPosition>>;
  mobilePosition: Partial<Record<AnnotationScene, AnnotationPosition>>;
  enterProgress: number;
  exitProgress: number;
  rotation: number;
  opacity: number;
};

type ResearchAnnotationsProps = {
  loaded: boolean;
  activeSection: string;
  activeTrack: number;
  selectedTrack: number | null;
};

const annotations: ResearchAnnotationConfig[] = [
  {
    id: "annotation-cf3",
    code: "CF3",
    meaning: "Computational Framework",
    section: ["loader", "home", "about", "research", "casefile"],
    desktopPosition: { loader: { x: 14, y: 22 }, home: { x: 14, y: 22 }, about: { x: 6, y: 30 }, research: { x: 8, y: 73 }, casefile: { x: 7, y: 24 } },
    mobilePosition: { loader: { x: 8, y: 19 }, home: { x: 8, y: 19 }, about: { x: 7, y: 28 }, research: { x: 6, y: 71 }, casefile: { x: 7, y: 21 } },
    enterProgress: 20,
    exitProgress: 100,
    rotation: -1,
    opacity: 0.78,
  },
  {
    id: "annotation-ps2",
    code: "PS2",
    meaning: "Physical System",
    section: ["loader", "home", "about", "research", "casefile", "venue"],
    desktopPosition: { loader: { x: 78, y: 68 }, home: { x: 78, y: 68 }, about: { x: 86, y: 43 }, research: { x: 82, y: 62 }, casefile: { x: 84, y: 38 }, venue: { x: 8, y: 67 } },
    mobilePosition: { loader: { x: 78, y: 66 }, home: { x: 78, y: 66 }, research: { x: 80, y: 64 }, casefile: { x: 78, y: 38 }, venue: { x: 7, y: 70 } },
    enterProgress: 35,
    exitProgress: 100,
    rotation: 1,
    opacity: 0.72,
  },
  {
    id: "annotation-sn4",
    code: "SN4",
    meaning: "Sensor Network",
    section: ["loader", "home", "research", "casefile", "timeline", "venue"],
    desktopPosition: { loader: { x: 72, y: 28 }, home: { x: 72, y: 28 }, research: { x: 91, y: 34 }, casefile: { x: 76, y: 76 }, timeline: { x: 86, y: 23 }, venue: { x: 88, y: 28 } },
    mobilePosition: { research: { x: 82, y: 31 }, casefile: { x: 79, y: 72 }, timeline: { x: 78, y: 26 } },
    enterProgress: 50,
    exitProgress: 100,
    rotation: 0,
    opacity: 0.56,
  },
  {
    id: "annotation-dt1",
    code: "DT1",
    meaning: "Digital Twin",
    section: ["loader", "home", "research", "casefile", "timeline", "venue"],
    desktopPosition: { loader: { x: 86, y: 44 }, home: { x: 86, y: 44 }, research: { x: 67, y: 23 }, casefile: { x: 62, y: 18 }, timeline: { x: 12, y: 72 }, venue: { x: 83, y: 74 } },
    mobilePosition: { research: { x: 72, y: 29 }, casefile: { x: 68, y: 18 }, timeline: { x: 9, y: 72 }, venue: { x: 79, y: 76 } },
    enterProgress: 80,
    exitProgress: 100,
    rotation: -1,
    opacity: 0.46,
  },
  {
    id: "annotation-ex5",
    code: "EX5",
    meaning: "Explainability",
    section: ["about", "research", "casefile", "register"],
    desktopPosition: { about: { x: 79, y: 76 }, research: { x: 75, y: 79 }, casefile: { x: 72, y: 68 }, register: { x: 11, y: 34 } },
    mobilePosition: { about: { x: 77, y: 78 }, research: { x: 76, y: 78 }, casefile: { x: 77, y: 67 }, register: { x: 7, y: 34 } },
    enterProgress: 100,
    exitProgress: 100,
    rotation: 1,
    opacity: 0.64,
  },
  {
    id: "annotation-au3",
    code: "AU3",
    meaning: "Autonomous Unit",
    section: ["loader", "home", "about", "research", "casefile"],
    desktopPosition: { loader: { x: 22, y: 72 }, home: { x: 22, y: 72 }, about: { x: 18, y: 64 }, research: { x: 20, y: 31 }, casefile: { x: 18, y: 72 } },
    mobilePosition: { loader: { x: 16, y: 74 }, home: { x: 16, y: 74 }, research: { x: 14, y: 34 }, casefile: { x: 15, y: 72 } },
    enterProgress: 65,
    exitProgress: 100,
    rotation: 0,
    opacity: 0.7,
  },
  {
    id: "annotation-tr2",
    code: "TR2",
    meaning: "Trust Layer",
    section: ["about", "research", "casefile", "register", "footer"],
    desktopPosition: { about: { x: 10, y: 84 }, research: { x: 88, y: 74 }, casefile: { x: 89, y: 25 }, register: { x: 87, y: 42 }, footer: { x: 18, y: 26 } },
    mobilePosition: { about: { x: 8, y: 85 }, research: { x: 79, y: 72 }, casefile: { x: 82, y: 25 }, register: { x: 81, y: 40 }, footer: { x: 11, y: 24 } },
    enterProgress: 100,
    exitProgress: 100,
    rotation: -1,
    opacity: 0.68,
  },
  {
    id: "annotation-ed4",
    code: "ED4",
    meaning: "Edge Device",
    section: ["research", "casefile", "timeline"],
    desktopPosition: { research: { x: 13, y: 59 }, casefile: { x: 12, y: 42 }, timeline: { x: 77, y: 78 } },
    mobilePosition: { research: { x: 8, y: 57 }, casefile: { x: 8, y: 43 } },
    enterProgress: 100,
    exitProgress: 100,
    rotation: 1,
    opacity: 0.72,
  },
  {
    id: "annotation-nf3",
    code: "NF3",
    meaning: "Network Fabric",
    section: ["research", "casefile", "timeline", "register"],
    desktopPosition: { research: { x: 57, y: 84 }, casefile: { x: 55, y: 82 }, timeline: { x: 8, y: 36 }, register: { x: 81, y: 75 } },
    mobilePosition: { research: { x: 68, y: 79 }, casefile: { x: 66, y: 81 }, timeline: { x: 7, y: 36 }, register: { x: 78, y: 75 } },
    enterProgress: 100,
    exitProgress: 100,
    rotation: 0,
    opacity: 0.48,
  },
  {
    id: "annotation-cp5",
    code: "CP5",
    meaning: "Cyber-Physical Process",
    section: ["loader", "home", "about", "research", "casefile", "timeline", "register", "footer"],
    desktopPosition: { loader: { x: 59, y: 84 }, home: { x: 59, y: 84 }, about: { x: 88, y: 18 }, research: { x: 41, y: 20 }, casefile: { x: 44, y: 16 }, timeline: { x: 83, y: 66 }, register: { x: 17, y: 78 }, footer: { x: 82, y: 71 } },
    mobilePosition: { loader: { x: 61, y: 83 }, home: { x: 61, y: 83 }, research: { x: 44, y: 20 }, casefile: { x: 45, y: 17 }, register: { x: 14, y: 78 }, footer: { x: 78, y: 70 } },
    enterProgress: 95,
    exitProgress: 100,
    rotation: 1,
    opacity: 0.78,
  },
];

const trackAnnotationCodes = [
  ["ED4", "SN4", "CF3"],
  ["AU3", "PS2", "CP5"],
  ["DT1", "NF3", "CF3"],
  ["TR2", "SN4", "CP5"],
  ["EX5", "TR2", "CF3"],
] as const;

const siteScenes = new Set<AnnotationScene>(["home", "about", "research", "timeline", "venue", "register"]);

export function ResearchAnnotations({ loaded, activeSection, activeTrack, selectedTrack }: ResearchAnnotationsProps) {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 700px)");
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (loaded) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduced ? 380 : 3600;
    let frame = 0;
    let start = 0;
    let lastProgress = -1;

    const update = (time: number) => {
      if (!start) start = time;
      const progress = Math.min(100, Math.floor(((time - start) / duration) * 100));
      if (progress !== lastProgress) {
        lastProgress = progress;
        setLoadingProgress(progress);
      }
      if (progress < 100) frame = window.requestAnimationFrame(update);
    };

    frame = window.requestAnimationFrame(update);
    return () => window.cancelAnimationFrame(frame);
  }, [loaded]);

  useEffect(() => {
    if (!loaded) return;
    const footer = document.querySelector<HTMLElement>(".site-footer");
    if (!footer) return;
    const observer = new IntersectionObserver(([entry]) => setFooterVisible(entry.isIntersecting), { threshold: 0.16 });
    observer.observe(footer);
    return () => observer.disconnect();
  }, [loaded]);

  useEffect(() => {
    if (!loaded || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const layer = layerRef.current;
    if (!layer) return;
    let frame = 0;

    const update = () => {
      const available = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, window.scrollY / available);
      layer.style.setProperty("--annotation-document-shift", `${progress * -10}px`);
      frame = 0;
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [loaded]);

  const sectionScene = siteScenes.has(activeSection as AnnotationScene) ? activeSection as AnnotationScene : "home";
  const scene: AnnotationScene = !loaded ? "loader" : selectedTrack !== null ? "casefile" : footerVisible ? "footer" : sectionScene;
  const trackIndex = selectedTrack ?? activeTrack;
  const relevantTrackCodes: readonly string[] = trackAnnotationCodes[Math.max(0, Math.min(trackAnnotationCodes.length - 1, trackIndex))];

  return (
    <div className="research-annotations" data-scene={scene} data-dialog={selectedTrack !== null} ref={layerRef} aria-hidden="true">
      {annotations.map((annotation) => {
        const positions = isMobile ? annotation.mobilePosition : annotation.desktopPosition;
        const position = positions[scene];
        const isTrackScene = scene === "research" || scene === "casefile";
        const isRelevantTrackCode = relevantTrackCodes.includes(annotation.code);
        const isContextCode = annotation.code === "CF3" || annotation.code === "CP5";
        const loaderStrength = Math.min(1, Math.max(0, (loadingProgress - annotation.enterProgress) / 6));
        const visibleByLoader = scene === "loader" && loadingProgress >= annotation.enterProgress && loadingProgress <= annotation.exitProgress;
        const visibleBySection = scene !== "loader" && Boolean(position);
        const trackStrength = isTrackScene ? isRelevantTrackCode ? 1 : isContextCode ? 0.16 : 0 : 1;
        const isVisible = Boolean(position) && (visibleByLoader || visibleBySection) && trackStrength > 0;
        const opacity = isVisible
          ? annotation.opacity * (position?.opacity ?? 1) * (scene === "loader" ? loaderStrength : trackStrength)
          : 0;
        const style = {
          "--annotation-x": `${position?.x ?? 50}vw`,
          "--annotation-y": `${position?.y ?? 104}svh`,
          "--annotation-opacity": opacity,
          "--annotation-rotation": `${annotation.rotation}deg`,
          "--annotation-offset": isVisible ? "0px" : "6px",
          "--annotation-scale": isVisible ? 1 : 0.96,
        } as CSSProperties;

        return (
          <span
            className={`research-annotation ${isVisible ? "is-visible" : ""} ${isRelevantTrackCode && isTrackScene ? "is-relevant" : ""}`}
            data-code={annotation.code}
            data-meaning={annotation.meaning}
            id={annotation.id}
            style={style}
            key={annotation.id}
          >
            {annotation.code}
          </span>
        );
      })}
    </div>
  );
}
