"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { ResearchDeskCanvas } from "./research-desk-canvas";
import { TimelineSection } from "./timeline-section";
import { TrackCaseFile, type ResearchTrackCase } from "./track-case-file";
import { LoadingScreen } from "./loading-screen";
import { ResearchAnnotations } from "./research-annotations";
import { AdvisoryBoard } from "./advisory-board";

const navItems = [
  ["home", "Home"],
  ["about", "About"],
  ["research", "Tracks"],
  ["timeline", "Timeline"],
  ["board", "Board"],
  ["venue", "Venue"],
  ["register", "Participate"],
] as const;

const researchTracks: ResearchTrackCase[] = [
  {
    number: "01",
    title: "Edge AI & Embedded Intelligence",
    caption: "Intelligence at the edge — fast, local, precise.",
    layout: "left",
    preview: "Computational intelligence operating close to the physical processes it observes.",
    introduction: "This track examines how computational intelligence can operate close to the physical processes it observes. It connects hardware-aware neural acceleration with on-device learning so embedded platforms can act without depending on distant cloud infrastructure.",
    areas: ["Hardware-aware neural acceleration", "On-device learning", "IoT and microcontrollers", "Embedded intelligence", "Low-latency decisions", "Edge computing"],
    why: "Local inference reduces communication delay and supports responsive behavior where timing, energy and hardware limits matter. The focus is not AI in isolation, but intelligence designed for the device that must execute it.",
    applications: ["Embedded vision", "Industrial monitoring", "Environmental sensing", "Wearable systems"],
    image: "/images/tracks-sketch/edge-ai.png",
    photo: "/images/tracks/edge-ai.webp",
    position: "center center",
    statement: "Intelligence must live where decisions happen.",
    questions: ["How much intelligence can move closer to the machine?", "How can low-latency decisions remain efficient within embedded hardware limits?"],
  },
  {
    number: "02",
    title: "Autonomous Systems & Robotics",
    caption: "Precision, decision and action in the real world.",
    layout: "right",
    preview: "Machines that perceive, decide and act inside changing physical environments.",
    introduction: "Autonomous physical systems must perceive their environment, locate themselves, decide under uncertainty and coordinate action in real time. This track brings those layers together across self-driving vehicles, drones, mobile robots and multi-agent systems.",
    areas: ["Real-time perception", "Localization and SLAM", "Decision and control", "Mobile robotics", "Multi-agent coordination", "Swarm intelligence"],
    why: "Reliable autonomy depends on the continuous connection between sensing and physical action. Research here studies how robots remain adaptive, coordinated and aware while operating beyond tightly controlled conditions.",
    applications: ["Self-driving vehicles", "Aerial drones", "Mobile inspection", "Cooperative robot teams"],
    image: "/images/tracks-sketch/autonomous-systems.png",
    photo: "/images/tracks/autonomous-systems.webp",
    position: "center center",
    statement: "Perception becomes consequential when it becomes action.",
    questions: ["How can autonomous systems decide safely under uncertainty?", "How can coordinated machines remain adaptive beyond controlled environments?"],
  },
  {
    number: "03",
    title: "Smart Energy & Industrial Infrastructure",
    caption: "Powering sustainable, intelligent systems.",
    layout: "left",
    preview: "Intelligent control for energy systems, industrial assets and critical infrastructure.",
    introduction: "This track focuses on computational intelligence within energy and industrial systems. Intelligent control, predictive maintenance and resource optimization connect sensing and automation to the operation of smart grids, microgrids and manufacturing environments.",
    areas: ["Smart-grid control", "Microgrids", "Predictive maintenance", "Industry 4.0", "Resource optimization", "Industrial automation"],
    why: "Infrastructure becomes more efficient when it can anticipate demand, identify degradation and adjust operations before failure. The research links energy intelligence with the realities of large physical assets and industrial processes.",
    applications: ["Energy management", "Manufacturing systems", "Equipment health", "Demand-aware control"],
    image: "/images/tracks-sketch/smart-energy.png",
    photo: "/images/tracks/smart-energy.webp",
    position: "center center",
    statement: "Infrastructure must learn before failure arrives.",
    questions: ["How can physical infrastructure anticipate demand and degradation?", "How can intelligent control improve efficiency without compromising continuity?"],
  },
  {
    number: "04",
    title: "Security, Privacy & Resilience in CPS",
    caption: "Secure, resilient and trustworthy by design.",
    layout: "right",
    preview: "Protection for connected systems where digital events can create physical consequences.",
    introduction: "Cyber-physical security protects systems in which a digital compromise can produce a physical consequence. The track spans threat detection, zero-trust IoT, physical-layer security and adversarial defense alongside fault-tolerant control.",
    areas: ["Threat detection", "Zero-trust architectures", "IoT security", "Physical-layer security", "Fault-tolerant control", "Adversarial defense", "Safety-critical AI"],
    why: "Security cannot be separated from control, safety or continuity of operation. Resilient CPS must detect hostile or faulty conditions while preserving safe physical behavior under stress.",
    applications: ["Industrial control", "Connected infrastructure", "Safety-critical autonomy", "Secure sensing"],
    image: "/images/tracks-sketch/security-resilience.png",
    photo: "/images/tracks/security-resilience.webp",
    position: "center center",
    statement: "A digital breach can become a physical consequence.",
    questions: ["How can a system preserve safe behavior while under attack?", "How should security, control and continuity respond as one system?"],
  },
  {
    number: "05",
    title: "Trustworthy & Explainable AI for Physical Systems",
    caption: "Transparent intelligence for critical systems.",
    layout: "left",
    preview: "Learning-enabled systems that remain understandable, verifiable and safe to supervise.",
    introduction: "This track studies how learning-enabled physical systems can remain understandable, verifiable and constrained by safety requirements. It connects explainable AI and human oversight with machine learning that acts inside autonomous infrastructure.",
    areas: ["Verifiable machine learning", "Safety-constrained ML", "Explainable AI", "Human-in-the-loop control", "Ethical considerations", "Autonomous infrastructure"],
    why: "When intelligent systems influence the physical world, performance alone is not enough. Designers and operators also need evidence, transparency and meaningful ways to supervise consequential decisions.",
    applications: ["Assisted control", "Explainable autonomy", "Safety assurance", "Operator decision support"],
    image: "/images/tracks-sketch/trustworthy-ai.png",
    photo: "/images/tracks/trustworthy-ai.webp",
    position: "center center",
    statement: "Performance alone is not enough.",
    questions: ["What evidence makes a learning-enabled physical system worthy of trust?", "How can human oversight remain meaningful inside autonomous infrastructure?"],
  },
];

const aboutManifesto = "Cyber-physical systems begin when computation leaves the screen and enters the world, sensing movement, interpreting uncertainty, and turning intelligence into physical action. Yet meaningful progress demands more than speed: it requires machines that remain safe, resilient, explainable, and worthy of human trust. ISCICPS brings researchers together to shape that future. These systems learn from the environments they inhabit, coordinating sensors, machines, energy and people as one responsive whole. From autonomous robots to intelligent infrastructure, each decision must remain timely, transparent and safe. The symposium is where researchers test how that balance becomes possible.";
const aboutWords = aboutManifesto.split(" ");

const participationPaths = [
  {
    number: "01",
    role: "PARTICIPANT",
    title: "ATTEND",
    symbol: "◎",
    copy: "Join the symposium, exchange ideas, and expand your international research network.",
    note: "Bring a question. Leave with a network.",
    action: "REGISTER",
    href: "https://cmt3.research.microsoft.com/",
    field: "DELEGATE / ATTENDEE",
    affiliation: "ACADEMIA · INDUSTRY",
  },
  {
    number: "02",
    role: "RESEARCHER",
    title: "PRESENT",
    symbol: "▤",
    copy: "Submit original research and share your breakthroughs with a focused technical community.",
    note: "Put your work into the conversation.",
    action: "CALL FOR PAPERS",
    href: "https://cmt3.research.microsoft.com/",
    field: "AUTHOR / PRESENTER",
    affiliation: "RESEARCH INSTITUTION",
  },
  {
    number: "03",
    role: "INDUSTRY",
    title: "COLLABORATE",
    symbol: "⌂",
    copy: "Partner with innovators, connect research to practice, and build the future together.",
    note: "Let’s build what comes next.",
    action: "PARTNER WITH US",
    href: "mailto:ieeescicps@gmail.com?subject=ISCICPS%202027%20Partnership",
    field: "PARTNER / EXHIBITOR",
    affiliation: "INDUSTRY · R&D",
  },
] as const;

export function SymposiumExperience() {
  const [loaded, setLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [activeTrack, setActiveTrack] = useState(0);
  const [selectedTrack, setSelectedTrack] = useState<number | null>(null);
  const [trackOpenInstant, setTrackOpenInstant] = useState(false);
  const [activeParticipation, setActiveParticipation] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const researchRef = useRef<HTMLElement>(null);
  const researchStageRef = useRef<HTMLDivElement>(null);
  const researchCanvasRef = useRef<HTMLCanvasElement>(null);
  const origamiRef = useRef<HTMLDivElement>(null);
  const researchScrollRef = useRef<{ start: number; end: number } | null>(null);
  const trackDialogRef = useRef<HTMLDivElement>(null);
  const navSection = navItems.some(([id]) => id === activeSection) ? activeSection : "home";
  const navigateToTrack = useCallback((index: number) => {
    const nextIndex = Math.max(0, Math.min(researchTracks.length - 1, index));
    const trigger = researchScrollRef.current;
    if (trigger) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const progress = nextIndex === researchTracks.length - 1
        ? (nextIndex + 0.5) / researchTracks.length
        : nextIndex / researchTracks.length;
      window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * progress, behavior: reduce ? "auto" : "smooth" });
      return;
    }
    document.querySelector<HTMLElement>(`[data-track-scene="${nextIndex}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(query.matches);
    updatePreference();
    query.addEventListener("change", updatePreference);
    return () => query.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (!loaded || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    let cleanup = () => {};

    Promise.all([import("@studio-freight/lenis"), import("gsap"), import("gsap/ScrollTrigger")]).then(([lenisModule, gsapModule, scrollModule]) => {
      if (cancelled) return;
      const Lenis = lenisModule.default;
      const gsap = gsapModule.gsap;
      const ScrollTrigger = scrollModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        duration: 1.2,
        wheelMultiplier: 0.85,
        smoothWheel: true,
        touchMultiplier: 1.05,
      });
      const updateScrollTrigger = () => ScrollTrigger.update();
      const driveLenis = (time: number) => lenis.raf(time * 1000);

      lenis.on("scroll", updateScrollTrigger);
      gsap.ticker.add(driveLenis);
      gsap.ticker.lagSmoothing(0);

      cleanup = () => {
        lenis.off("scroll", updateScrollTrigger);
        gsap.ticker.remove(driveLenis);
        gsap.ticker.lagSmoothing(500, 33);
        lenis.destroy();
      };
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [loaded]);

  const trackCaseOpen = selectedTrack !== null;

  useEffect(() => {
    if (!trackCaseOpen) return;
    const body = document.body;
    const dialog = trackDialogRef.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    body.classList.add("track-dialog-is-open");
    window.requestAnimationFrame(() => dialog?.querySelector<HTMLButtonElement>(".casefile-close")?.focus());

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedTrack(null);
        return;
      }
      if (event.key !== "Tab" || !dialog) return;
      const focusable = Array.from(dialog.querySelectorAll<HTMLElement>("button:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])"));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => {
      body.classList.remove("track-dialog-is-open");
      window.removeEventListener("keydown", handleKeydown);
      window.requestAnimationFrame(() => previousFocus?.focus());
    };
  }, [trackCaseOpen]);

  useEffect(() => {
    if (!loaded) return;
    const sections = Array.from(document.querySelectorAll<HTMLElement>(".content-shell section[id]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-30% 0px -58%", threshold: [0, 0.1, 0.35] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [loaded]);

  useEffect(() => {
    if (!loaded || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let context: { revert: () => void } | undefined;
    let cancelled = false;
    let manifestoWords: HTMLElement[] = [];
    let manifestoDoodles: HTMLElement[] = [];
    let clearResearchJourney = () => {};

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, scrollModule]) => {
      if (cancelled) return;
      const gsap = gsapModule.gsap;
      const ScrollTrigger = scrollModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      context = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
          gsap.fromTo(
            element,
            { opacity: 0, transform: "translateY(38px)" },
            {
              opacity: 1,
              transform: "translateY(0px)",
              duration: 0.85,
              ease: "power3.out",
              scrollTrigger: { trigger: element, start: "top 88%", once: true },
            },
          );
        });

        gsap.utils.toArray<HTMLElement>("[data-mask]").forEach((element) => {
          gsap.fromTo(
            element,
            { clipPath: "inset(0 0 100% 0)" },
            {
              clipPath: "inset(0 0 0% 0)",
              duration: 1.05,
              ease: "power4.inOut",
              scrollTrigger: { trigger: element, start: "top 86%", once: true },
            },
          );
        });

        const matterTitle = document.querySelector<HTMLElement>(".matter-title");
        const matterWords = gsap.utils.toArray<HTMLElement>(".matter-word");
        if (matterTitle && matterWords.length) {
          gsap.fromTo(
            matterWords,
            { opacity: 0.14, transform: "translateX(-4%)" },
            {
              opacity: 1,
              transform: "translateX(0%)",
              stagger: 0.16,
              ease: "none",
              scrollTrigger: { trigger: matterTitle, start: "top 77%", end: "bottom 35%", scrub: 0.45 },
            },
          );
        }

        manifestoWords = gsap.utils.toArray<HTMLElement>(".about-word");
        manifestoDoodles = gsap.utils.toArray<HTMLElement>(".about-doodle");
        if (manifestoWords.length) {
          ScrollTrigger.create({
            trigger: ".about-manifesto",
            start: "top 72%",
            end: () => window.innerWidth <= 800 ? "bottom 32%" : "top -15%",
            invalidateOnRefresh: true,
            scrub: true,
            onUpdate: ({ progress }) => {
              const cursor = progress * (manifestoWords.length + 2.6);
              manifestoWords.forEach((word, index) => {
                const strength = Math.min(1, Math.max(0, (cursor - index) / 2.6));
                const red = Math.round(174 + (21 - 174) * strength);
                const green = Math.round(174 + (25 - 174) * strength);
                const blue = Math.round(171 + (34 - 171) * strength);
                word.style.color = `rgb(${red}, ${green}, ${blue})`;
              });
              manifestoDoodles.forEach((doodle) => {
                const index = Number(doodle.dataset.aboutIndex ?? 0);
                const strength = Math.min(1, Math.max(0, (cursor - index) / 2.6));
                doodle.style.opacity = String(0.24 + strength * 0.76);
              });
            },
          });
        }

        const researchSection = researchRef.current;
        const researchStage = researchStageRef.current;
        const researchCanvas = researchCanvasRef.current;
        const origami = origamiRef.current;
        const trackScenes = gsap.utils.toArray<HTMLElement>(".track-scene");
        if (researchSection && researchStage && researchCanvas && origami && trackScenes.length === researchTracks.length) {
          const context2d = researchCanvas.getContext("2d");
          const sheet = origami.querySelector<HTMLElement>(".origami-sheet");
          const leftWing = origami.querySelector<HTMLElement>(".origami-wing--left");
          const rightWing = origami.querySelector<HTMLElement>(".origami-wing--right");
          const spine = origami.querySelector<HTMLElement>(".origami-spine");
          const clamp = (value: number) => Math.min(1, Math.max(0, value));
          const smoothstep = (start: number, end: number, value: number) => {
            const unit = clamp((value - start) / Math.max(0.0001, end - start));
            return unit * unit * (3 - 2 * unit);
          };
          const desktopRoutes = [
            [[0.22, 0.63], [0.48, 0.2], [0.79, 0.43]],
            [[0.78, 0.6], [0.54, 0.84], [0.21, 0.47]],
            [[0.22, 0.64], [0.52, 0.17], [0.79, 0.4]],
            [[0.79, 0.6], [0.5, 0.23], [0.2, 0.43]],
          ];
          const mobileRoutes = [
            [[0.18, 0.68], [0.6, 0.25], [0.82, 0.48]],
            [[0.82, 0.68], [0.48, 0.84], [0.18, 0.47]],
            [[0.18, 0.68], [0.56, 0.23], [0.82, 0.48]],
            [[0.82, 0.68], [0.48, 0.25], [0.18, 0.48]],
          ];

          const renderJourney = (progress: number) => {
            const transitionCount = researchTracks.length - 1;
            const rawProgress = clamp(progress) * transitionCount;
            const segment = Math.min(transitionCount - 1, Math.floor(rawProgress));
            const localProgress = progress >= 1 ? 1 : rawProgress - segment;
            const exit = smoothstep(0, 0.15, localProgress);
            const enter = smoothstep(0.86, 1, localProgress);
            const nextTrack = Math.min(researchTracks.length - 1, segment + 1);
            const activeIndex = localProgress >= 0.86 ? nextTrack : segment;
            setActiveTrack((current) => current === activeIndex ? current : activeIndex);

            trackScenes.forEach((scene, index) => {
              let opacity = 0;
              let clip = "inset(50% 50% 50% 50%)";
              let scale = 0.985;
              if (index === segment) {
                opacity = 1 - exit;
                clip = `inset(0 ${exit * 48}% 0 ${exit * 48}%)`;
                scale = 1 - exit * 0.018;
              } else if (index === nextTrack) {
                opacity = enter;
                clip = `inset(${(1 - enter) * 50}% ${(1 - enter) * 50}% ${(1 - enter) * 50}% ${(1 - enter) * 50}%)`;
                scale = 0.985 + enter * 0.015;
              }
              gsap.set(scene, { opacity, clipPath: clip, scale, pointerEvents: opacity > 0.72 && index === activeIndex ? "auto" : "none" });
              scene.inert = !(opacity > 0.72 && index === activeIndex);
            });

            if (!context2d) return;
            const bounds = researchStage.getBoundingClientRect();
            const density = Math.min(2, window.devicePixelRatio || 1);
            const pixelWidth = Math.max(1, Math.round(bounds.width * density));
            const pixelHeight = Math.max(1, Math.round(bounds.height * density));
            if (researchCanvas.width !== pixelWidth || researchCanvas.height !== pixelHeight) {
              researchCanvas.width = pixelWidth;
              researchCanvas.height = pixelHeight;
            }
            researchCanvas.style.width = `${bounds.width}px`;
            researchCanvas.style.height = `${bounds.height}px`;
            context2d.setTransform(density, 0, 0, density, 0, 0);
            context2d.clearRect(0, 0, bounds.width, bounds.height);

            const routes = bounds.width <= 800 ? mobileRoutes : desktopRoutes;
            const route = routes[segment];
            const start = { x: route[0][0] * bounds.width, y: route[0][1] * bounds.height };
            const control = { x: route[1][0] * bounds.width, y: route[1][1] * bounds.height };
            const end = { x: route[2][0] * bounds.width, y: route[2][1] * bounds.height };
            const routeProgress = smoothstep(0.25, 0.72, localProgress);
            const routeOpacity = smoothstep(0.2, 0.31, localProgress) * (1 - smoothstep(0.75, 0.88, localProgress));
            context2d.save();
            context2d.globalAlpha = routeOpacity;
            context2d.strokeStyle = "#0d4fa7";
            context2d.lineWidth = 1.35;
            context2d.setLineDash([8, 10]);
            context2d.lineDashOffset = -routeProgress * 28;
            context2d.beginPath();
            for (let step = 0; step <= 72; step += 1) {
              const pointProgress = (step / 72) * routeProgress;
              const inverse = 1 - pointProgress;
              const x = inverse * inverse * start.x + 2 * inverse * pointProgress * control.x + pointProgress * pointProgress * end.x;
              const y = inverse * inverse * start.y + 2 * inverse * pointProgress * control.y + pointProgress * pointProgress * end.y;
              if (step === 0) context2d.moveTo(x, y); else context2d.lineTo(x, y);
            }
            context2d.stroke();
            context2d.restore();

            const fold = smoothstep(0.15, 0.35, localProgress);
            const flight = smoothstep(0.35, 0.72, localProgress);
            const inverseFlight = 1 - flight;
            const x = inverseFlight * inverseFlight * start.x + 2 * inverseFlight * flight * control.x + flight * flight * end.x;
            const y = inverseFlight * inverseFlight * start.y + 2 * inverseFlight * flight * control.y + flight * flight * end.y;
            const dx = 2 * inverseFlight * (control.x - start.x) + 2 * flight * (end.x - control.x);
            const dy = 2 * inverseFlight * (control.y - start.y) + 2 * flight * (end.y - control.y);
            const angle = Math.atan2(dy, dx) * 180 / Math.PI;
            const paperOpacity = smoothstep(0.14, 0.2, localProgress) * (1 - smoothstep(0.74, 0.86, localProgress));
            origami.style.opacity = String(paperOpacity);
            origami.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) rotate(${angle}deg) scale(${0.78 + fold * 0.22})`;
            if (sheet) {
              sheet.style.opacity = String(1 - fold);
              sheet.style.transform = `rotate(45deg) scale(${1 - fold * 0.28})`;
            }
            if (leftWing) {
              leftWing.style.opacity = String(fold);
              leftWing.style.transform = `rotateY(${(1 - fold) * 84}deg) rotateZ(-5deg)`;
            }
            if (rightWing) {
              rightWing.style.opacity = String(fold);
              rightWing.style.transform = `rotateY(${(1 - fold) * -84}deg) rotateZ(5deg)`;
            }
            if (spine) spine.style.opacity = String(fold);
          };

          renderJourney(0);
          const researchTrigger = ScrollTrigger.create({
            trigger: researchSection,
            pin: researchStage,
            pinType: "transform",
            start: "top top",
            end: () => `+=${window.innerHeight * researchTracks.length}`,
            scrub: 0.15,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: ({ progress }) => renderJourney(Math.min(1, progress * researchTracks.length / (researchTracks.length - 1))),
            onRefresh: ({ progress }) => renderJourney(Math.min(1, progress * researchTracks.length / (researchTracks.length - 1))),
          });
          researchScrollRef.current = researchTrigger;
          clearResearchJourney = () => {
            researchScrollRef.current = null;
            researchTrigger.kill();
            context2d?.clearRect(0, 0, researchCanvas.width, researchCanvas.height);
            trackScenes.forEach((scene) => {
              scene.inert = false;
              gsap.set(scene, { clearProps: "opacity,clipPath,scale,pointerEvents" });
            });
            origami.removeAttribute("style");
            [sheet, leftWing, rightWing, spine].forEach((part) => part?.removeAttribute("style"));
          };
        }

        gsap.utils.toArray<HTMLImageElement>(".venue-image img").forEach((image) => {
          gsap.fromTo(
            image,
            { transform: "scale(1.08) translateY(-2%)" },
            {
              transform: "scale(1.12) translateY(4%)",
              ease: "none",
              scrollTrigger: { trigger: image.parentElement, start: "top bottom", end: "bottom top", scrub: 0.8 },
            },
          );
        });

        const timelineSection = document.querySelector<HTMLElement>(".timeline");
        const timelineMasks = gsap.utils.toArray<SVGPathElement>(".timeline-axis-mask");
        const timelineArrows = gsap.utils.toArray<SVGPathElement>(".timeline-axis-arrow");
        const timelineMilestones = gsap.utils.toArray<HTMLElement>(".timeline-milestone");
        if (timelineSection && timelineMasks.length && timelineMilestones.length) {
          timelineMasks.forEach((mask) => {
            const length = mask.getTotalLength();
            gsap.set(mask, { strokeDasharray: length, strokeDashoffset: length });
          });
          gsap.set(timelineArrows, { opacity: 0 });
          let currentTimelineMilestone = -1;
          const milestoneStops = [0, 0.25, 0.5, 0.75, 0.94];
          const timelineJourney = gsap.timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: {
              trigger: timelineSection,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.5,
              invalidateOnRefresh: true,
              onUpdate: ({ progress }) => {
                const nextIndex = milestoneStops.reduce((active, stop, index) => progress >= stop ? index : active, 0);
                if (nextIndex === currentTimelineMilestone) return;
                currentTimelineMilestone = nextIndex;
                timelineMilestones.forEach((milestone, index) => {
                  const active = index === nextIndex;
                  milestone.classList.toggle("is-active", active);
                  if (active) milestone.setAttribute("aria-current", "date"); else milestone.removeAttribute("aria-current");
                });
              },
            },
          });

          timelineJourney
            .to(timelineArrows, { opacity: 1, duration: 0.06, ease: "none" }, 0.94);
          timelineMasks.forEach((mask) => {
            timelineJourney.to(mask, { strokeDashoffset: 0, duration: 1, ease: "none" }, 0);
          });
          timelineMilestones.forEach((milestone, index) => {
            const at = milestoneStops[index];
            const node = milestone.querySelector(".timeline-node");
            const date = milestone.querySelector(".timeline-date");
            const title = milestone.querySelector("h3");
            const description = milestone.querySelector("p");
            const hand = milestone.querySelector(".timeline-hand");
            const initiallyVisible = index === 0;
            timelineJourney
              .fromTo(node, { opacity: initiallyVisible ? 1 : 0.38, scale: initiallyVisible ? 1 : 0.96 }, { opacity: 1, scale: 1, duration: 0.075 }, at)
              .fromTo(date, { opacity: initiallyVisible ? 1 : 0.34, transform: initiallyVisible ? "translateY(0px)" : "translateY(15px)" }, { opacity: 1, transform: "translateY(0px)", duration: 0.1 }, at)
              .fromTo(title, { opacity: initiallyVisible ? 1 : 0.34, transform: initiallyVisible ? "translateY(0px)" : "translateY(9px)" }, { opacity: 1, transform: "translateY(0px)", duration: 0.085 }, at + 0.018)
              .fromTo(description, { opacity: initiallyVisible ? 1 : 0.08, transform: initiallyVisible ? "translateY(0px)" : "translateY(8px)" }, { opacity: 1, transform: "translateY(0px)", duration: 0.09 }, at + 0.038)
              .fromTo(hand, { opacity: initiallyVisible ? 0.72 : 0, transform: initiallyVisible ? "translateY(0px) rotate(-3deg)" : "translateY(9px) rotate(-3deg)" }, { opacity: 0.72, transform: "translateY(0px) rotate(-3deg)", duration: 0.075 }, at + 0.055);
          });

          const parallaxRange = { trigger: timelineSection, start: "top bottom", end: "bottom top", scrub: 0.55 };
          gsap.fromTo(".timeline-grid-layer", { transform: "translate3d(0,-1.5%,0)" }, { transform: "translate3d(0,1.5%,0)", ease: "none", scrollTrigger: parallaxRange });
          gsap.fromTo(".timeline-date-wrap", { transform: "translate3d(0,18px,0)" }, { transform: "translate3d(0,-4px,0)", ease: "none", scrollTrigger: parallaxRange });
          gsap.fromTo(".timeline-technical-art", { transform: "translate3d(0,28px,0) rotate(2deg)" }, { transform: "translate3d(0,-6px,0) rotate(2deg)", ease: "none", scrollTrigger: parallaxRange });
          gsap.fromTo(".timeline-margin-note", { transform: "translate3d(0,34px,0) rotate(3deg)" }, { transform: "translate3d(0,-5px,0) rotate(3deg)", ease: "none", scrollTrigger: parallaxRange });
          gsap.fromTo(".timeline-annotations", { transform: "translate3d(0,20px,0)" }, { transform: "translate3d(0,-12px,0)", ease: "none", scrollTrigger: parallaxRange });
        }

      }, rootRef);
    });

    return () => {
      cancelled = true;
      clearResearchJourney();
      context?.revert();
      manifestoWords.forEach((word) => word.style.removeProperty("color"));
      manifestoDoodles.forEach((doodle) => doodle.style.removeProperty("opacity"));
    };
  }, [loaded]);

  return (
    <main ref={rootRef} className={`experience ${loaded ? "is-ready" : ""} section-${navSection}`}>
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      <ResearchAnnotations
        loaded={loaded}
        activeSection={activeSection}
        activeTrack={activeTrack}
        selectedTrack={selectedTrack}
      />
      <header className="global-header">
        <a className="global-host" href="https://www.srmist.edu.in/" target="_blank" rel="noreferrer" aria-label="Visit SRM Institute of Science and Technology">
          <img className="global-host-crest" src="/images/srm-seal.png" alt="SRM Institute of Science and Technology crest" />
          <span className="global-host-name" aria-hidden="true">
            <strong>SRM</strong>
            <small>Institute of Science &amp; Technology</small>
          </span>
        </a>

        <nav className="hero-primary-nav" aria-label="Primary navigation">
          {navItems.map(([id, label]) => (
            <a key={id} href={`#${id}`} className={navSection === id ? "is-active" : ""} aria-current={navSection === id ? "page" : undefined}>
              {label}
            </a>
          ))}
        </nav>

        <div className="conference-mark" aria-label="ISCICPS 2027">ISCICPS&apos;27</div>
      </header>
      <a className="skip-link" href="#main-content">Skip to content</a>

      <nav className="side-nav" aria-label="Section navigation">
        {navItems.map(([id, label]) => (
          <a className={navSection === id ? "is-active" : ""} href={`#${id}`} aria-current={navSection === id ? "location" : undefined} key={id}>
            <span>{label}</span><i aria-hidden="true" />
          </a>
        ))}
      </nav>
      <div className="side-date" aria-hidden="true">21—22 APR 2027</div>

      <div className="content-shell">
        <section id="home" className="hero" aria-labelledby="hero-heading">
          <div id="main-content" className="hero-stage">
            <div className="hero-kicker">International Symposium On</div>
            <div className="hero-visual" data-cursor="EXPLORE ↗">
              <div className="hero-researcher" role="img" aria-label="A hand-drawn researcher working on a laptop">
                <img className="hero-researcher-base" src="/images/hero-researcher-transparent.png" alt="" decoding="async" />
              </div>
            </div>
            <h1 id="hero-heading" className="hero-title">
              <span className="hero-line hero-line-one">INTELLIGENT</span>
              <span className="hero-line hero-line-two">CYBER-PHYSICAL</span>
              <span className="hero-line hero-line-three">SYSTEMS</span>
            </h1>
            <p className="hero-date-range" aria-label="21 to 22 April 2027">21–22 APRIL 2027</p>
          </div>
        </section>

        <section id="about" className="about" aria-labelledby="about-title">
          <h2 id="about-title" className="about-heading">Where intelligence enters the physical world</h2>
          <p className="about-manifesto" aria-label={aboutManifesto}>
            {aboutWords.map((word, index) => (
              <Fragment key={`${word}-${index}`}>
                {index === 7 ? (
                  <span className="about-doodle about-doodle--researcher" data-about-index="7" aria-hidden="true">
                    <img src="/images/hero-researcher-transparent.png" alt="" loading="lazy" />
                  </span>
                ) : null}
                {index === 17 ? (
                  <span className="about-doodle about-doodle--illustration about-doodle--chip" data-about-index="17" aria-hidden="true">
                    <img src="/images/tracks-sketch/edge-ai.png" alt="" loading="lazy" />
                  </span>
                ) : null}
                {index === 29 ? (
                  <span className="about-doodle about-doodle--system" data-about-index="29" aria-hidden="true">
                    <i /><b /><em>CPS</em>
                  </span>
                ) : null}
                {index === 35 ? (
                  <span className="about-doodle about-doodle--illustration about-doodle--shield" data-about-index="35" aria-hidden="true">
                    <img src="/images/tracks-sketch/security-resilience.png" alt="" loading="lazy" />
                  </span>
                ) : null}
                {index === 44 ? (
                  <span className="about-doodle about-doodle--illustration about-doodle--robot" data-about-index="44" aria-hidden="true">
                    <img src="/images/tracks-sketch/autonomous-systems.png" alt="" loading="lazy" />
                  </span>
                ) : null}
                {index === 55 ? (
                  <span className="about-doodle about-doodle--illustration about-doodle--energy" data-about-index="55" aria-hidden="true">
                    <img src="/images/tracks-sketch/smart-energy.png" alt="" loading="lazy" />
                  </span>
                ) : null}
                {index === 69 ? (
                  <span className="about-doodle about-doodle--illustration about-doodle--robot about-doodle--robot-wide" data-about-index="69" aria-hidden="true">
                    <img src="/images/tracks-sketch/autonomous-systems.png" alt="" loading="lazy" />
                  </span>
                ) : null}
                {index === 79 ? (
                  <span className="about-doodle about-doodle--illustration about-doodle--trust" data-about-index="79" aria-hidden="true">
                    <img src="/images/tracks-sketch/trustworthy-ai.png" alt="" loading="lazy" />
                  </span>
                ) : null}
                <span className="about-word" aria-hidden="true">{word}</span>{" "}
              </Fragment>
            ))}
          </p>

          <span className="about-annotation about-annotation--a" aria-hidden="true">S↔A</span>
          <span className="about-annotation about-annotation--b" aria-hidden="true">x̂(t)</span>
          <span className="about-annotation about-annotation--c" aria-hidden="true">∂C/∂t</span>
          <span className="about-annotation about-annotation--d" aria-hidden="true">01—∞</span>
        </section>

        <section ref={researchRef} id="research" className="research" aria-labelledby="research-title">
          <div ref={researchStageRef} className="research-stage">
            <div className="research-heading">
              <h2 id="research-title">FIVE RESEARCH TRACKS</h2>
              <span className="research-count" aria-live="polite" aria-atomic="true">
                {String(activeTrack + 1).padStart(2, "0")} <i>/</i> 05
              </span>
            </div>
            <p className="research-whisper" aria-hidden="true">Five domains.<br />One intelligent future.</p>
            <span className="research-formula research-formula--a" aria-hidden="true">x̂ → u</span>
            <span className="research-formula research-formula--b" aria-hidden="true">∑ / CPS</span>
            <canvas ref={researchCanvasRef} className="research-route" aria-hidden="true" />
            <div ref={origamiRef} className="origami-flight" aria-hidden="true">
              <span className="origami-sheet" />
              <span className="origami-wing origami-wing--left" />
              <span className="origami-wing origami-wing--right" />
              <span className="origami-spine" />
            </div>
            <div className="track-scenes" aria-label="Five symposium research tracks">
              {researchTracks.map((track, index) => (
                <article
                  className={`track-scene track-scene--${track.layout}`}
                  data-track-scene={index}
                  aria-hidden={!prefersReducedMotion && activeTrack !== index}
                  key={track.number}
                >
                  <div className="track-scene-copy">
                    <span className="track-number">{track.number}</span>
                    <p className="track-label">RESEARCH TRACK / {track.number}</p>
                    <h3>{track.title}</h3>
                    <p className="track-caption">{track.caption}</p>
                    <p className="track-preview">{track.preview}</p>
                    <button
                      className="track-explore"
                      type="button"
                      tabIndex={prefersReducedMotion || activeTrack === index ? 0 : -1}
                      onClick={(event) => {
                        setTrackOpenInstant(event.detail === 0);
                        setSelectedTrack(index);
                      }}
                      data-cursor="EXPLORE ↗"
                    >
                      EXPLORE TRACK <span aria-hidden="true">↗</span>
                    </button>
                  </div>
                  <figure className="track-scene-art">
                    <img src={track.image} alt={`${track.title} technical ink illustration`} loading="lazy" />
                    <figcaption>{track.areas.slice(0, 3).join(" · ")}</figcaption>
                  </figure>
                </article>
              ))}
            </div>
            <div className="research-controls" aria-label="Research track navigation">
              <button type="button" onClick={() => navigateToTrack(activeTrack - 1)} disabled={activeTrack === 0} aria-label="Previous research track">←</button>
              <span aria-hidden="true">SCROLL TO NAVIGATE</span>
              <button type="button" onClick={() => navigateToTrack(activeTrack + 1)} disabled={activeTrack === researchTracks.length - 1} aria-label="Next research track">→</button>
            </div>
          </div>
        </section>

        <TimelineSection />

        <AdvisoryBoard />

        <section id="venue" className="venue" aria-labelledby="venue-title">
          <div className="venue-meta"><span>SRMIST · KATTANKULATHUR</span></div>

          <header className="venue-heading">
            <img className="venue-seal" src="/images/srm-seal.png" alt="SRM Institute of Science and Technology seal" loading="lazy" />
            <p>SRM INSTITUTE OF SCIENCE AND TECHNOLOGY</p>
            <h2 id="venue-title">THE VENUE</h2>
          </header>

          <div className="venue-layout">
            <aside className="venue-side venue-side--left">
              <figure className="venue-image venue-image--auditorium" data-cursor="VIEW ↗">
                <img loading="lazy" src="/images/srm-auditorium-1920.jpg" alt="Dr T. P. Ganesan Auditorium at SRMIST" />
                <figcaption>Dr T. P. Ganesan Auditorium · Fig. 01</figcaption>
              </figure>
              <div className="venue-coordinate" aria-label="Campus coordinates">
                <span>SRMIST</span>
                <span>KATTANKULATHUR</span>
                <span>12°49′36″ N</span>
                <span>80°02′44″ E</span>
              </div>
            </aside>

            <div className="venue-copy">
              <p>
                ISCICPS ’27 will be hosted at <strong>SRM Institute of Science and Technology</strong>,
                Kattankulathur—a nationally recognised university and a vibrant centre for
                <em> research, innovation, and interdisciplinary learning.</em>
              </p>
              <p>
                Set within a connected academic campus near Chennai, the venue brings together
                <strong><em> advanced laboratories, collaborative spaces, modern auditoria,</em></strong>
                and the infrastructure needed for focused exchange between researchers,
                practitioners, and emerging scholars.
              </p>
              <p>
                Across two days, delegates will find an environment designed for
                <em> thoughtful conversation and new partnerships</em>—a place where ideas can move
                beyond presentation into <strong><em>future-shaping research and real-world impact.</em></strong>
              </p>
              <p className="venue-signoff"><em>Where research meets reality, and people shape what comes next.</em></p>
            </div>

            <aside className="venue-side venue-side--right">
              <p className="venue-margin-note"><em>Built for collaboration.<br />Designed to inspire.</em></p>
              <figure className="venue-image venue-image--campus" data-cursor="VIEW ↗">
                <img loading="lazy" src="/images/srm-campus-aerial.jpg" alt="Aerial view of the SRMIST Kattankulathur campus" />
                <figcaption>Kattankulathur campus · Fig. 02</figcaption>
              </figure>
              <div className="venue-facts">
                <dl>
                  <div><dt>FORMAT</dt><dd>IN-PERSON SYMPOSIUM</dd></div>
                  <div><dt>ACCESS</dt><dd>≈ 35 KM FROM AIRPORT</dd></div>
                  <div><dt>AIRPORT</dt><dd>CHENNAI INTERNATIONAL</dd></div>
                  <div><dt>CITY</dt><dd>CHENNAI, INDIA</dd></div>
                </dl>
                <a href="https://maps.google.com/?q=SRM+Institute+of+Science+and+Technology+Kattankulathur" target="_blank" rel="noreferrer">
                  LOCATE CAMPUS <span aria-hidden="true">↗</span>
                </a>
              </div>
            </aside>
          </div>
        </section>

        <section id="register" className="register" aria-label="Participation options">
          <div className="participate-meta"><span>ISCICPS 2027 · PARTICIPATION DESK</span></div>

          <header className="participate-heading">
            <p>Your work<br />belongs in<br />the <em>system.</em></p>
            <span aria-hidden="true">Bring a question.<br />Leave with<br />a network.</span>
          </header>

          <div className="participate-layout">
            <aside className="participate-intro">
              <div className="participate-orbit" aria-hidden="true"><i /><i /><i /></div>
              <h3>WHY PARTICIPATE?</h3>
              <p>Exchange ideas, showcase innovation, build collaborations, and help shape the <em>future</em> of intelligent systems.</p>
            </aside>

            <div className="participation-paths" role="list" aria-label="Ways to participate">
              {participationPaths.map((path, index) => (
                <a
                  className="participation-card"
                  data-active={activeParticipation === index}
                  href={path.href}
                  target={path.href.startsWith("http") ? "_blank" : undefined}
                  rel={path.href.startsWith("http") ? "noreferrer" : undefined}
                  role="listitem"
                  key={path.number}
                  onMouseEnter={() => setActiveParticipation(index)}
                  onFocus={() => setActiveParticipation(index)}
                  data-cursor="OPEN ↗"
                >
                  <span className="participation-card-tape" aria-hidden="true" />
                  <div className="participation-card-summary">
                    <div className="participation-card-top"><b>{path.number}</b><span>{path.role}</span></div>
                    <h3>{path.title}</h3>
                    <span aria-hidden="true">{activeParticipation === index ? "−" : "+"}</span>
                  </div>
                  <div className="participation-card-details">
                    <span className="participation-symbol" aria-hidden="true">{path.symbol}</span>
                    <p>{path.copy}</p>
                    <em>{path.note}</em>
                    <strong><span aria-hidden="true">→</span> {path.action}</strong>
                  </div>
                </a>
              ))}
            </div>

            <aside className="participant-manifest" aria-live="polite">
              <div className="manifest-sheet">
                <header>
                  <p>INTERNATIONAL SYMPOSIUM ON<br /><strong>INTELLIGENT CYBER-PHYSICAL SYSTEMS</strong></p>
                  <img src="/images/srm-seal.png" alt="" aria-hidden="true" />
                </header>
                <p className="manifest-participant">PARTICIPANT / <span>{participationPaths[activeParticipation].role}</span></p>
                <div className="manifest-intents">
                  <h3>I AM HERE TO</h3>
                  {participationPaths.map((path, index) => (
                    <span data-checked={activeParticipation === index} key={path.title}><i aria-hidden="true" />{path.title}</span>
                  ))}
                  <span data-checked={false}><i aria-hidden="true" />EXHIBIT</span>
                </div>
                <dl>
                  <div><dt>FIELD /</dt><dd>{participationPaths[activeParticipation].field}</dd></div>
                  <div><dt>AFFILIATION /</dt><dd>{participationPaths[activeParticipation].affiliation}</dd></div>
                  <div><dt>EMAIL /</dt><dd>ieeescicps@gmail.com</dd></div>
                </dl>
                <a href={participationPaths[activeParticipation].href} target={participationPaths[activeParticipation].href.startsWith("http") ? "_blank" : undefined} rel={participationPaths[activeParticipation].href.startsWith("http") ? "noreferrer" : undefined}>
                  <span aria-hidden="true">→</span> ENTER {participationPaths[activeParticipation].title}
                </a>
                <small>THANK YOU.<br />WE LOOK FORWARD TO MEETING YOU.</small>
              </div>
            </aside>
          </div>
        </section>

        <footer className="site-footer" aria-label="Symposium research desk closing scene">
          <ResearchDeskCanvas />
          <div className="footer-information">
            <div className="footer-identity">
              <span>INTERNATIONAL SYMPOSIUM / 2027</span>
              <a href="#home">ISCICPS <sup>&apos;27</sup></a>
              <p>Intelligent Cyber-Physical Systems</p>
            </div>
            <div className="footer-fact">
              <span>DATES</span>
              <strong>21–22 APRIL 2027</strong>
              <small>TWO DAYS · ONE SYSTEM</small>
            </div>
            <div className="footer-fact">
              <span>VENUE</span>
              <strong>SRMIST</strong>
              <small>KATTANKULATHUR · INDIA</small>
            </div>
            <address className="footer-fact footer-contact">
              <span>CONTACT</span>
              <a href="mailto:ieeescicps@gmail.com">ieeescicps@gmail.com</a>
              <a href="https://www.srmist.edu.in/" target="_blank" rel="noreferrer">VISIT SRMIST ↗</a>
            </address>
          </div>
          <div className="footer-deskline">
            <span>© 2026 ISCICPS</span>
            <a href="#home">RETURN TO THE TOP ↑</a>
          </div>
        </footer>
      </div>

      {selectedTrack !== null && (
        <TrackCaseFile
          track={researchTracks[selectedTrack]}
          index={selectedTrack}
          total={researchTracks.length}
          dialogRef={trackDialogRef}
          instant={trackOpenInstant}
          onClose={() => setSelectedTrack(null)}
          onNavigate={setSelectedTrack}
        />
      )}
    </main>
  );
}
