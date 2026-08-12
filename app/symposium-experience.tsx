"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const imageSources = [
  "/images/iscicps-hero-sculpture.png",
  "/images/hero-researcher.png",
  "/images/srm-campus-aerial.jpg",
  "/images/srm-auditorium-1920.jpg",
  "/images/srm-research-day.webp",
  "/images/tracks/edge-ai.webp",
  "/images/tracks/autonomous-systems.webp",
  "/images/tracks/smart-energy.webp",
  "/images/tracks/security-resilience.webp",
  "/images/tracks/trustworthy-ai.webp",
];

const navItems = [
  ["home", "Home"],
  ["about", "About"],
  ["research", "Tracks"],
  ["timeline", "Timeline"],
  ["venue", "Venue"],
  ["register", "Contact"],
] as const;

const researchTracks = [
  {
    number: "01",
    title: "Edge AI & Embedded Intelligence",
    preview: "Computational intelligence operating close to the physical processes it observes.",
    introduction: "This track examines how computational intelligence can operate close to the physical processes it observes. It connects hardware-aware neural acceleration with on-device learning so embedded platforms can act without depending on distant cloud infrastructure.",
    areas: ["Hardware-aware neural acceleration", "On-device learning", "IoT and microcontrollers", "Embedded intelligence", "Low-latency decisions", "Edge computing"],
    why: "Local inference reduces communication delay and supports responsive behavior where timing, energy and hardware limits matter. The focus is not AI in isolation, but intelligence designed for the device that must execute it.",
    applications: ["Embedded vision", "Industrial monitoring", "Environmental sensing", "Wearable systems"],
    image: "/images/tracks/edge-ai.webp",
    position: "center center",
  },
  {
    number: "02",
    title: "Autonomous Systems & Robotics",
    preview: "Machines that perceive, decide and act inside changing physical environments.",
    introduction: "Autonomous physical systems must perceive their environment, locate themselves, decide under uncertainty and coordinate action in real time. This track brings those layers together across self-driving vehicles, drones, mobile robots and multi-agent systems.",
    areas: ["Real-time perception", "Localization and SLAM", "Decision and control", "Mobile robotics", "Multi-agent coordination", "Swarm intelligence"],
    why: "Reliable autonomy depends on the continuous connection between sensing and physical action. Research here studies how robots remain adaptive, coordinated and aware while operating beyond tightly controlled conditions.",
    applications: ["Self-driving vehicles", "Aerial drones", "Mobile inspection", "Cooperative robot teams"],
    image: "/images/tracks/autonomous-systems.webp",
    position: "center center",
  },
  {
    number: "03",
    title: "Smart Energy & Industrial Infrastructure",
    preview: "Intelligent control for energy systems, industrial assets and critical infrastructure.",
    introduction: "This track focuses on computational intelligence within energy and industrial systems. Intelligent control, predictive maintenance and resource optimization connect sensing and automation to the operation of smart grids, microgrids and manufacturing environments.",
    areas: ["Smart-grid control", "Microgrids", "Predictive maintenance", "Industry 4.0", "Resource optimization", "Industrial automation"],
    why: "Infrastructure becomes more efficient when it can anticipate demand, identify degradation and adjust operations before failure. The research links energy intelligence with the realities of large physical assets and industrial processes.",
    applications: ["Energy management", "Manufacturing systems", "Equipment health", "Demand-aware control"],
    image: "/images/tracks/smart-energy.webp",
    position: "center center",
  },
  {
    number: "04",
    title: "Security, Privacy & Resilience in CPS",
    preview: "Protection for connected systems where digital events can create physical consequences.",
    introduction: "Cyber-physical security protects systems in which a digital compromise can produce a physical consequence. The track spans threat detection, zero-trust IoT, physical-layer security and adversarial defense alongside fault-tolerant control.",
    areas: ["Threat detection", "Zero-trust architectures", "IoT security", "Physical-layer security", "Fault-tolerant control", "Adversarial defense", "Safety-critical AI"],
    why: "Security cannot be separated from control, safety or continuity of operation. Resilient CPS must detect hostile or faulty conditions while preserving safe physical behavior under stress.",
    applications: ["Industrial control", "Connected infrastructure", "Safety-critical autonomy", "Secure sensing"],
    image: "/images/tracks/security-resilience.webp",
    position: "center center",
  },
  {
    number: "05",
    title: "Trustworthy & Explainable AI for Physical Systems",
    preview: "Learning-enabled systems that remain understandable, verifiable and safe to supervise.",
    introduction: "This track studies how learning-enabled physical systems can remain understandable, verifiable and constrained by safety requirements. It connects explainable AI and human oversight with machine learning that acts inside autonomous infrastructure.",
    areas: ["Verifiable machine learning", "Safety-constrained ML", "Explainable AI", "Human-in-the-loop control", "Ethical considerations", "Autonomous infrastructure"],
    why: "When intelligent systems influence the physical world, performance alone is not enough. Designers and operators also need evidence, transparency and meaningful ways to supervise consequential decisions.",
    applications: ["Assisted control", "Explainable autonomy", "Safety assurance", "Operator decision support"],
    image: "/images/tracks/trustworthy-ai.webp",
    position: "center center",
  },
];

const milestones = [
  { day: "31", month: "OCT", year: "2026", iso: "2026-10-31", title: "Paper submission" },
  { day: "15", month: "NOV", year: "2026", iso: "2026-11-15", title: "Acceptance" },
  { day: "15", month: "JAN", year: "2027", iso: "2027-01-15", title: "Registration" },
  { day: "21—22", month: "APR", year: "2027", iso: "2027-04-21", title: "ISCICPS '27" },
];

function LoadingExperience({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    let frame = 0;
    let assetsReady = false;
    let finished = false;
    const startedAt = performance.now();
    const minimumDuration = 4200;

    Promise.all(
      imageSources.map(
        (source) =>
          new Promise<void>((resolve) => {
            const image = new Image();
            image.onload = () => resolve();
            image.onerror = () => resolve();
            image.src = source;
          }),
      ),
    ).then(() => {
      assetsReady = true;
    });

    const tick = (now: number) => {
      const elapsed = now - startedAt;
      const timed = Math.min(96, Math.floor((elapsed / minimumDuration) * 96));
      const waiting = elapsed > minimumDuration
        ? Math.min(99, 96 + Math.floor((1 - Math.exp(-(elapsed - minimumDuration) / 1800)) * 3))
        : timed;
      setProgress(waiting);

      if (!finished && assetsReady && elapsed >= minimumDuration) {
        finished = true;
        setProgress(100);
        window.setTimeout(() => setClosing(true), 250);
        window.setTimeout(onComplete, 1190);
        return;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [onComplete]);

  return (
    <div
      className={`loader ${closing ? "is-closing" : ""}`}
      style={{ "--load": progress } as React.CSSProperties}
      role="status"
      aria-live="polite"
      aria-label={`Loading ISCICPS experience, ${progress} percent`}
    >
      <div className="loader-stage" aria-hidden="true">
        <div className="loader-intro">
          <span className="loader-note loader-note-a">CI / 27</span>
          <span className="loader-note loader-note-b">Δt</span>
          <span className="loader-note loader-note-c">Nf3</span>
          <img className="loader-intro-person" src="/images/hero-researcher.png" alt="" />
        </div>
        <div className="loader-assembly">
          <div className="loader-kicker">International Symposium</div>
          <div className="loader-word">
            <span>INTELLIGENT</span>
            <span>CYBER-PHYSICAL</span>
            <span>SYSTEMS</span>
          </div>
          <img className="loader-sculpture" src="/images/iscicps-hero-sculpture.png" alt="" />
          <img className="loader-hero-person" src="/images/hero-researcher.png" alt="" />
        </div>
        <div className="loader-status">
          <span>ISCICPS_BOOT</span>
          <strong>{String(progress).padStart(2, "0")}%</strong>
          <i><b /></i>
        </div>
      </div>
    </div>
  );
}

function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor || window.matchMedia("(pointer: coarse)").matches) return;

    let frame = 0;
    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;

    const draw = () => {
      currentX += (targetX - currentX) * 0.2;
      currentY += (targetY - currentY) * 0.2;
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      frame = requestAnimationFrame(draw);
    };
    const move = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      cursor.classList.add("is-visible");
    };
    const over = (event: PointerEvent) => {
      const target = (event.target as HTMLElement).closest<HTMLElement>("[data-cursor], a, button");
      if (!target) return;
      const label = target.dataset.cursor ?? "";
      cursor.dataset.label = label;
      cursor.classList.toggle("has-label", Boolean(label));
      cursor.classList.add("is-active");
    };
    const out = (event: PointerEvent) => {
      const target = (event.target as HTMLElement).closest<HTMLElement>("[data-cursor], a, button");
      if (!target) return;
      cursor.dataset.label = "";
      cursor.classList.remove("has-label", "is-active");
    };

    frame = requestAnimationFrame(draw);
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over);
    document.addEventListener("pointerout", out);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.removeEventListener("pointerout", out);
    };
  }, []);

  return <div ref={cursorRef} className="custom-cursor" aria-hidden="true" />;
}

export function SymposiumExperience() {
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [activeTrack, setActiveTrack] = useState(0);
  const [revealedTrack, setRevealedTrack] = useState<number | null>(null);
  const [selectedTrack, setSelectedTrack] = useState<number | null>(null);
  const [activeMilestone, setActiveMilestone] = useState(0);
  const rootRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const trackDialogRef = useRef<HTMLDivElement>(null);
  const menuLayerRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const completeLoading = useCallback(() => setLoaded(true), []);
  const navigateFromMenu = useCallback((event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    event.preventDefault();
    setMenuOpen(false);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        window.history.pushState(null, "", `#${id}`);
        document.getElementById(id)?.scrollIntoView();
      });
    });
  }, []);
  const navSection = navItems.some(([id]) => id === activeSection) ? activeSection : "home";
  const navSectionIndex = navItems.findIndex(([id]) => id === navSection);

  useEffect(() => {
    if (selectedTrack === null) return;
    const body = document.body;
    const dialog = trackDialogRef.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    body.classList.add("track-dialog-is-open");
    window.requestAnimationFrame(() => dialog?.querySelector<HTMLButtonElement>(".track-dialog-close")?.focus());

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedTrack(null);
    };
    window.addEventListener("keydown", handleKeydown);
    return () => {
      body.classList.remove("track-dialog-is-open");
      window.removeEventListener("keydown", handleKeydown);
      window.requestAnimationFrame(() => previousFocus?.focus());
    };
  }, [selectedTrack]);

  useEffect(() => {
    if (!menuOpen) return;

    const body = document.body;
    body.classList.add("menu-is-open");

    return () => {
      body.classList.remove("menu-is-open");
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen || !menuLayerRef.current) return;
    const layer = menuLayerRef.current;
    const focusable = [
      menuButtonRef.current,
      ...Array.from(layer.querySelectorAll<HTMLElement>("a[href]")),
    ].filter((element): element is HTMLElement => Boolean(element));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const handleMenuKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
        window.requestAnimationFrame(() => menuButtonRef.current?.focus());
        return;
      }
      if (event.key !== "Tab" || focusable.length === 0) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    window.addEventListener("keydown", handleMenuKeydown);
    return () => {
      window.removeEventListener("keydown", handleMenuKeydown);
    };
  }, [menuOpen]);

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
    if (!loaded || !footerRef.current) return;
    const footer = footerRef.current;
    let cancelled = false;
    let cleanup = () => {};

    import("gsap").then(({ gsap }) => {
      if (cancelled) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const rect = footer.getBoundingClientRect();
      gsap.set(footer, {
        "--mask-x": `${rect.width * 0.5}px`,
        "--mask-y": `${rect.height * 0.5}px`,
        "--mask-size": reduce ? "180px" : "0px",
      });
      const xTo = gsap.quickTo(footer, "--mask-x", { duration: reduce ? 0.01 : 0.42, ease: "power3.out" });
      const yTo = gsap.quickTo(footer, "--mask-y", { duration: reduce ? 0.01 : 0.42, ease: "power3.out" });
      const sizeTo = gsap.quickTo(footer, "--mask-size", { duration: reduce ? 0.01 : 0.52, ease: "power3.out" });

      const move = (event: PointerEvent) => {
        const bounds = footer.getBoundingClientRect();
        xTo(event.clientX - bounds.left);
        yTo(event.clientY - bounds.top);
        sizeTo(Math.min(300, Math.max(190, window.innerWidth * 0.2)));
      };
      const leave = () => sizeTo(coarse || window.innerWidth <= 800 ? 150 : 0);
      footer.addEventListener("pointermove", move, { passive: true });
      footer.addEventListener("pointerdown", move, { passive: true });
      footer.addEventListener("pointerleave", leave, { passive: true });
      cleanup = () => {
        footer.removeEventListener("pointermove", move);
        footer.removeEventListener("pointerdown", move);
        footer.removeEventListener("pointerleave", leave);
        gsap.killTweensOf(footer);
      };
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [loaded]);

  useEffect(() => {
    if (!loaded) return;
    const timeline = document.querySelector<HTMLElement>(".timeline");
    const entries = Array.from(document.querySelectorAll<HTMLElement>(".timeline li"));
    if (!timeline || entries.length === 0) return;

    let frame = 0;
    const updateMilestone = () => {
      frame = 0;
      const viewportHeight = window.innerHeight;
      let nextMilestone = 0;

      if (window.innerWidth <= 540) {
        const activationLine = viewportHeight * 0.44;
        nextMilestone = entries.reduce((closestIndex, entry, index) => {
          const entryRect = entry.getBoundingClientRect();
          const closestRect = entries[closestIndex].getBoundingClientRect();
          const entryDistance = Math.abs(entryRect.top + entryRect.height * 0.34 - activationLine);
          const closestDistance = Math.abs(closestRect.top + closestRect.height * 0.34 - activationLine);
          return entryDistance < closestDistance ? index : closestIndex;
        }, 0);
      } else {
        const timelineRect = timeline.getBoundingClientRect();
        const startLine = viewportHeight * 0.72;
        const scrollRange = Math.max(1, timelineRect.height - viewportHeight * 0.38);
        const progress = Math.min(1, Math.max(0, (startLine - timelineRect.top) / scrollRange));
        nextMilestone = Math.round(progress * (entries.length - 1));
      }

      setActiveMilestone((current) => current === nextMilestone ? current : nextMilestone);
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(updateMilestone);
    };

    updateMilestone();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [loaded]);

  useEffect(() => {
    const layer = menuLayerRef.current;
    if (!loaded || !layer) return;
    let cancelled = false;
    let timeline: GSAPTimeline | undefined;
    import("gsap").then(({ gsap }) => {
      if (cancelled) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const duration = reduce ? 0.01 : menuOpen ? 0.46 : 0.36;
      timeline = gsap.timeline({ defaults: { ease: "power4.inOut" } });

      if (menuOpen) {
        gsap.set(layer, { pointerEvents: "auto" });
        timeline
          .to(".content-shell", { transform: reduce ? "none" : "translateY(1.5vh) scale(0.985)", opacity: 0.18, duration }, 0)
          .fromTo(layer, { clipPath: "inset(0 0 0 100%)" }, { clipPath: "inset(0 0% 0 0)", duration }, 0)
          .fromTo(".menu-link", { transform: reduce ? "none" : "translateY(62%)", opacity: 0 }, { transform: "translateY(0%)", opacity: 1, stagger: 0.04, duration: reduce ? 0.01 : 0.32, ease: "power4.out" }, 0.1)
          .fromTo(".menu-register", { transform: reduce ? "none" : "translateX(18px)", opacity: 0 }, { transform: "translateX(0px)", opacity: 1, duration: reduce ? 0.01 : 0.24, ease: "power3.out" }, 0.24);
      } else {
        timeline
          .to(".menu-link", { transform: reduce ? "none" : "translateY(24%)", opacity: 0, stagger: { each: 0.022, from: "end" }, duration: reduce ? 0.01 : 0.2, ease: "power2.in" }, 0)
          .to(layer, {
            clipPath: "inset(0 0 0 100%)",
            duration,
            onComplete: () => {
              gsap.set(layer, { pointerEvents: "none" });
            },
          }, 0.12)
          .to(".content-shell", { transform: "translateY(0) scale(1)", opacity: 1, duration }, 0.08);
      }
    });
    return () => {
      cancelled = true;
      timeline?.kill();
    };
  }, [loaded, menuOpen]);

  useEffect(() => {
    if (!loaded || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let context: { revert: () => void } | undefined;
    let cancelled = false;

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, scrollModule]) => {
      if (cancelled) return;
      const gsap = gsapModule.gsap;
      const ScrollTrigger = scrollModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);
      context = gsap.context(() => {
        const entrance = gsap.timeline({ defaults: { ease: "power4.out" } });
        entrance
          .from(".menu-trigger", { opacity: 0, transform: "translateY(-12px)", duration: 0.42 })
          .from(".global-host", { opacity: 0, transform: "translate(-50%, -12px)", duration: 0.5 }, 0.02)
          .fromTo(".hero-visual", { opacity: 0, transform: "scale(1.015)" }, { opacity: 1, transform: "scale(1)", duration: 0.72, ease: "power3.out" }, 0.03)
          .from(".hero-kicker", { opacity: 0, transform: "translateY(12px)", duration: 0.4 }, 0.12)
          .from(".hero-line", { opacity: 0, transform: "translateY(12%)", stagger: 0.055, duration: 0.55 }, 0.2)
          .from(".hero-researcher", { opacity: 0, transform: "translateY(8px)", duration: 0.42 }, 0.32)
          .from(".hero-annotation", { opacity: 0, stagger: 0.045, duration: 0.3 }, 0.38)
          .from(".hero-meta span", { opacity: 0, transform: "translateY(8px)", stagger: 0.045, duration: 0.32 }, 0.42);

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

        gsap.from(".track-card", {
          opacity: 0,
          transform: "translateY(44px)",
          stagger: 0.09,
          duration: 0.78,
          ease: "power3.out",
          scrollTrigger: { trigger: ".track-deck", start: "top 84%", once: true },
        });

        const heroScroll = gsap.timeline({
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom bottom", scrub: 0.7 },
        });
        heroScroll
          .to(".hero-visual", { transform: "scale(1.035) translateY(2%)", ease: "none" }, 0)
          .fromTo(".hero-image img", { transform: "scale(1.01) translateY(-1%)" }, { transform: "scale(1.075) translateY(3%) rotate(0.5deg)", ease: "none" }, 0)
          .to(".hero-title", { scale: 0.97, ease: "none" }, 0)
          .to(".hero-line-one", { transform: "translateX(-1.6%)", opacity: 0.46, ease: "none" }, 0)
          .to(".hero-line-two", { transform: "translateX(1.2%)", ease: "none" }, 0)
          .to(".hero-line-three", { transform: "translateY(18%)", opacity: 0.62, ease: "none" }, 0)
          .to(".hero-researcher", { transform: "translateY(-12%)", ease: "none" }, 0)
          .to(".hero-annotation", { opacity: 0, stagger: 0.03, ease: "none" }, 0);

        gsap.fromTo(
          ".matter-word",
          { opacity: 0.14, transform: "translateX(-4%)" },
          {
            opacity: 1,
            transform: "translateX(0%)",
            stagger: 0.16,
            ease: "none",
            scrollTrigger: { trigger: ".matter-title", start: "top 77%", end: "bottom 35%", scrub: 0.45 },
          },
        );

        gsap.utils.toArray<HTMLImageElement>(".about-image img, .venue-image img").forEach((image) => {
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

        gsap.fromTo(
          ".timeline-progress i",
          { scaleX: 0 },
          { scaleX: 1, ease: "none", scrollTrigger: { trigger: ".timeline", start: "top 68%", end: "bottom 52%", scrub: 0.45 } },
        );

        gsap.fromTo(
          ".cta-pattern",
          { transform: "translateX(-7%)" },
          { transform: "translateX(0%)", ease: "none", scrollTrigger: { trigger: ".register", start: "top bottom", end: "bottom top", scrub: 0.5 } },
        );
      }, rootRef);
    });

    return () => {
      cancelled = true;
      context?.revert();
    };
  }, [loaded]);

  return (
    <main ref={rootRef} className={`experience ${loaded ? "is-ready" : ""} section-${navSection}`}>
      {!loaded && <LoadingExperience onComplete={completeLoading} />}
      <CustomCursor />
      <a className="global-host" href="https://www.srmist.edu.in/" target="_blank" rel="noreferrer" aria-label="Visit SRM Institute of Science and Technology">
        <img className="global-host-crest" src="/images/srm-seal.png" alt="SRM Institute of Science and Technology crest" />
        <span className="global-host-name" aria-hidden="true">
          <strong>SRMIST</strong>
          <small>Learn · Leap · Lead</small>
        </span>
      </a>
      <a className="skip-link" href="#main-content">Skip to content</a>

      <nav className="side-nav" aria-label="Section navigation">
        {navItems.map(([id, label]) => (
          <a className={navSection === id ? "is-active" : ""} href={`#${id}`} aria-current={navSection === id ? "location" : undefined} key={id}>
            <span>{label}</span><i aria-hidden="true" />
          </a>
        ))}
      </nav>
      <div className="side-date" aria-hidden="true">21—22 APR 2027</div>

      <aside className={`nav-control ${menuOpen ? "is-open" : ""}`} aria-label="Navigation control">
        <button
          ref={menuButtonRef}
          className="menu-trigger"
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="navigation-layer"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="menu-line" aria-hidden="true" />
          <span className="menu-line" aria-hidden="true" />
          <span className="menu-line" aria-hidden="true" />
        </button>
      </aside>

      <div ref={menuLayerRef} id="navigation-layer" className="nav-layer" role="dialog" aria-modal="true" aria-label="Site navigation" aria-hidden={!menuOpen}>
        <div className="nav-layer-meta"><span>ISCICPS &apos;27</span><span>CURRENT / {String(navSectionIndex + 1).padStart(2, "0")}</span></div>
        <nav aria-label="Primary navigation">
          {navItems.map(([id, label], index) => (
            <div className="menu-link-frame" key={id}>
              <a
                className={`menu-link ${navSection === id ? "is-active" : ""}`}
                href={`#${id}`}
                aria-current={navSection === id ? "location" : undefined}
                tabIndex={menuOpen ? 0 : -1}
                onClick={(event) => navigateFromMenu(event, id)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span><strong>{label}</strong>
              </a>
            </div>
          ))}
        </nav>
        <a className="menu-register" href="#register" tabIndex={menuOpen ? 0 : -1} onClick={(event) => navigateFromMenu(event, "register")} data-cursor="ENTER ↗">
          <span>CALL FOR PAPERS</span><strong>REGISTER</strong><span aria-hidden="true">↗</span>
        </a>
      </div>

      <div className="content-shell">
        <section id="home" className="hero" aria-labelledby="hero-heading">
          <div id="main-content" className="hero-stage">
            <div className="hero-kicker">International Symposium</div>
            <div className="hero-meta">
              <span>IEEE ISCICPS &apos;27</span>
              <span>21—22 APRIL 2027</span>
              <span>SRMIST · CHENNAI</span>
            </div>
            <div className="hero-visual" data-cursor="EXPLORE ↗">
              <div className="hero-image hero-image-base">
                <img src="/images/iscicps-hero-sculpture.png" alt="A cobalt mechanical hand holding a graphite sphere encircled by a circuit ribbon" fetchPriority="high" decoding="async" />
              </div>
              <span className="hero-annotation hero-annotation-a" aria-hidden="true">CI / 27</span>
              <span className="hero-annotation hero-annotation-b" aria-hidden="true">SENSE → THINK → ACT</span>
              <span className="hero-annotation hero-annotation-c" aria-hidden="true">Δt &lt; 10ms</span>
              <img className="hero-researcher" src="/images/hero-researcher.png" alt="A hand-drawn researcher working on a laptop" decoding="async" />
            </div>
            <h1 id="hero-heading" className="hero-title">
              <span className="hero-line hero-line-one">INTELLIGENT</span>
              <span className="hero-line hero-line-two">CYBER-PHYSICAL</span>
              <span className="hero-line hero-line-three">SYSTEMS</span>
            </h1>
            <a className="hero-cta" href="#about" data-cursor="SCROLL ↓">
              <span>Discover the symposium</span><i aria-hidden="true">↓</i>
            </a>
          </div>
        </section>

        <section className="matter" aria-labelledby="matter-title">
          <div className="section-note" data-reveal><span>00</span><span>SYSTEM STATE</span></div>
          <h2 id="matter-title" className="matter-title">
            <span className="matter-word">THE PHYSICAL</span>
            <span className="matter-word">WORLD</span>
            <span className="matter-word small">BECOMES</span>
            <span className="matter-word signal">COMPUTATIONAL.</span>
          </h2>
        </section>

        <section id="about" className="about" aria-labelledby="about-title">
          <div className="section-note" data-reveal><span>01</span><span>ABOUT</span></div>
          <div className="about-copy">
            <h2 id="about-title" data-reveal>INTELLIGENCE<br />MEETS<br /><span>PHYSICAL</span><br />SYSTEMS.</h2>
            <p data-reveal>
              IEEE ISCICPS is an international symposium for researchers, engineers and industry practitioners exploring computational intelligence inside connected physical systems.
            </p>
          </div>
          <figure className="about-image" data-mask data-cursor="VIEW ↗">
            <img loading="lazy" src="/images/srm-research-day.webp" alt="Researchers and institutional leaders gathered at SRMIST Research Day" />
            <figcaption>SRMIST RESEARCH DAY · KATTANKULATHUR</figcaption>
          </figure>
        </section>

        <section id="research" className="research" aria-labelledby="research-title">
          <div className="section-note" data-reveal><span>02</span><span>RESEARCH</span></div>
          <h2 id="research-title" data-reveal>RESEARCH<br /><span>FIELDS</span></h2>
          <div className="track-signal" style={{ "--track-index": activeTrack } as React.CSSProperties} aria-hidden="true"><i /></div>
          <div className="track-deck" aria-label="Five symposium research tracks">
            {researchTracks.map((track, index) => (
              <article
                className={`track-card ${activeTrack === index ? "is-active" : ""} ${revealedTrack === index ? "is-revealed" : ""}`}
                data-index={index}
                data-cursor="EXPLORE"
                key={track.number}
                onPointerEnter={() => setActiveTrack(index)}
                onFocus={() => setActiveTrack(index)}
                onClick={() => {
                  setActiveTrack(index);
                  setRevealedTrack(index);
                }}
                tabIndex={0}
              >
                <img className="track-card-image" src={track.image} alt="" style={{ objectPosition: track.position }} loading="lazy" />
                <div className="track-card-shade" aria-hidden="true" />
                <div className="track-card-head">
                  <span>/{track.number}</span><span>RESEARCH TRACK</span>
                </div>
                <div className="track-card-content">
                  <h3>{track.title}</h3>
                  <div className="track-card-reveal">
                    <p>{track.preview}</p>
                    <ul aria-label="Featured research areas">
                      {track.areas.slice(0, 3).map((area) => <li key={area}>{area}</li>)}
                    </ul>
                    <button
                      className="track-explore"
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedTrack(index);
                      }}
                    >
                      EXPLORE TRACK <span aria-hidden="true">↗</span>
                    </button>
                  </div>
                </div>
                <span className="track-card-count">{String(index + 1).padStart(2, "0")} / 05</span>
              </article>
            ))}
          </div>
        </section>

        <section id="timeline" className="timeline" aria-labelledby="timeline-title">
          <div className="section-note" data-reveal><span>03</span><span>IMPORTANT DATES</span></div>
          <h2 id="timeline-title" data-reveal>THE SYSTEM<br /><span>PROGRESSES.</span></h2>
          <div className="timeline-progress" aria-hidden="true"><i /></div>
          <ol>
            {milestones.map((milestone, index) => (
              <li
                className={activeMilestone === index ? "is-active" : ""}
                data-index={index}
                key={milestone.iso}
                tabIndex={0}
                aria-current={activeMilestone === index ? "date" : undefined}
                onMouseEnter={() => setActiveMilestone(index)}
                onFocus={() => setActiveMilestone(index)}
              >
                <time dateTime={milestone.iso}>
                  <strong>{milestone.day}</strong>
                  <span>{milestone.month}<br />{milestone.year}</span>
                </time>
                <p>{milestone.title}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="venue" className="venue" aria-labelledby="venue-title">
          <div className="venue-image" data-mask data-cursor="VIEW ↗">
            <img loading="lazy" src="/images/srm-auditorium-1920.jpg" alt="Dr T. P. Ganesan Auditorium at SRMIST" />
          </div>
          <div className="venue-meta"><span>04 / VENUE</span><span>CHENNAI, INDIA</span></div>
          <div className="venue-copy">
            <p>SRM INSTITUTE OF SCIENCE AND TECHNOLOGY</p>
            <h2 id="venue-title">SRMIST<br /><span>KATTAN—</span><br />KULATHUR</h2>
            <a href="https://maps.google.com/?q=SRM+Institute+of+Science+and+Technology+Kattankulathur" target="_blank" rel="noreferrer">
              LOCATE CAMPUS <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>

        <section id="register" className="register" aria-labelledby="register-title">
          <div className="cta-pattern" aria-hidden="true">
            {Array.from({ length: 4 }, (_, index) => <div key={index}>ISCICPS&nbsp; ISCICPS&nbsp; ISCICPS&nbsp; ISCICPS</div>)}
          </div>
          <div className="section-note"><span>05</span><span>PARTICIPATE</span></div>
          <h2 id="register-title" data-reveal>SUBMIT<br />YOUR<br /><span>RESEARCH.</span></h2>
          <div className="register-links">
            <a href="https://cmt3.research.microsoft.com/" target="_blank" rel="noreferrer" data-cursor="ENTER ↗">
              <span>SUBMIT PAPER</span><span aria-hidden="true">↗</span>
            </a>
            <a href="https://cmt3.research.microsoft.com/" target="_blank" rel="noreferrer" data-cursor="ENTER ↗">
              <span>REGISTER</span><span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>

        <footer ref={footerRef} className="site-footer">
          <div className="footer-reveal" aria-hidden="true"><img loading="lazy" src="/images/srm-campus-aerial.jpg" alt="" /></div>
          <div className="footer-signal" aria-hidden="true"><i /></div>
          <a className="footer-mark" href="#home">ISCICPS <sup>&apos;27</sup></a>
          <p>INTERNATIONAL SYMPOSIUM ON<br />COMPUTATIONAL INTELLIGENCE FOR<br />CYBER-PHYSICAL SYSTEMS</p>
          <div className="footer-contact"><a href="mailto:ieeescicps@gmail.com">ieeescicps@gmail.com</a><span>SRMIST · KATTANKULATHUR</span></div>
          <small>© 2026 ISCICPS</small>
        </footer>
      </div>

      {selectedTrack !== null && (
        <div className="track-dialog-backdrop" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setSelectedTrack(null);
        }}>
          <div ref={trackDialogRef} className="track-dialog" role="dialog" aria-modal="true" aria-labelledby="track-dialog-title">
            <button className="track-dialog-close" type="button" onClick={() => setSelectedTrack(null)} aria-label="Close track details">CLOSE ×</button>
            <div className="track-dialog-visual">
              <img src={researchTracks[selectedTrack].image} alt="" style={{ objectPosition: researchTracks[selectedTrack].position }} />
              <span>/{researchTracks[selectedTrack].number}</span>
            </div>
            <div className="track-dialog-copy">
              <span>RESEARCH TRACK {researchTracks[selectedTrack].number}</span>
              <h2 id="track-dialog-title">{researchTracks[selectedTrack].title}</h2>
              <p>{researchTracks[selectedTrack].introduction}</p>
              <div className="track-dialog-grid">
                <div><h3>KEY RESEARCH AREAS</h3><ul>{researchTracks[selectedTrack].areas.map((area) => <li key={area}>{area}</li>)}</ul></div>
                <div><h3>WHY IT MATTERS</h3><p>{researchTracks[selectedTrack].why}</p></div>
                <div><h3>APPLICATIONS</h3><ul>{researchTracks[selectedTrack].applications.map((application) => <li key={application}>{application}</li>)}</ul></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
