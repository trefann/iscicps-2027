"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type ResearchArea = {
  id: string;
  short: string;
  title: string;
  description: string;
  keywords: string[];
  x: number;
  y: number;
};

const researchAreas: ResearchArea[] = [
  {
    id: "edge",
    short: "EDGE AI",
    title: "Edge AI & Embedded Intelligence",
    description:
      "Hardware-aware acceleration, on-device learning and low-latency decisions at the edge.",
    keywords: ["ACCELERATORS", "ON-DEVICE LEARNING", "IOT"],
    x: 50,
    y: 8,
  },
  {
    id: "robotics",
    short: "ROBOTICS",
    title: "Autonomous Systems & Robotics",
    description:
      "Mobile robotics, multi-agent coordination and real-time perception, localization and mapping.",
    keywords: ["SLAM", "SWARMS", "AUTONOMY"],
    x: 8,
    y: 42,
  },
  {
    id: "energy",
    short: "SMART ENERGY",
    title: "Smart Energy & Industrial Infrastructure",
    description:
      "Intelligent control for energy systems, predictive maintenance and resource optimization.",
    keywords: ["MICROGRIDS", "INDUSTRY 4.0", "OPTIMIZATION"],
    x: 50,
    y: 82,
  },
  {
    id: "security",
    short: "SECURITY",
    title: "Security, Privacy & Resilience",
    description:
      "Threat detection, zero-trust IoT, physical-layer security and fault-tolerant control.",
    keywords: ["ZERO TRUST", "RESILIENCE", "ADVERSARIAL DEFENSE"],
    x: 83,
    y: 42,
  },
  {
    id: "xai",
    short: "XAI",
    title: "Trustworthy & Explainable AI",
    description:
      "Verifiable learning, human-in-the-loop explanation and safety-constrained intelligence.",
    keywords: ["VERIFICATION", "EXPLAINABILITY", "ETHICS"],
    x: 82,
    y: 78,
  },
];

const milestones = [
  {
    month: "OCT",
    day: "31",
    year: "2026",
    title: "Paper submission",
    detail: "Last date for paper submission through the CMT portal.",
  },
  {
    month: "NOV",
    day: "15",
    year: "2026",
    title: "Acceptance",
    detail: "Intimation of acceptance will be sent to authors by email.",
  },
  {
    month: "JAN",
    day: "15",
    year: "2027",
    title: "Registration",
    detail: "Registration milestone for selected papers.",
  },
  {
    month: "APR",
    day: "21—22",
    year: "2027",
    title: "ISCICPS '27",
    detail: "Two days of computational intelligence and cyber-physical systems research.",
  },
];

const tracks = researchAreas.map((area, index) => ({
  ...area,
  number: String(index + 1).padStart(2, "0"),
}));

function ComputationalField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const field = fieldRef.current;
    if (!canvas || !field) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const pointer = { x: -1000, y: -1000 };
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = true;
    let nodes: Array<{ x: number; y: number; ox: number; oy: number; phase: number }> = [];

    const makeNodes = () => {
      const count = coarsePointer ? 22 : 46;
      nodes = Array.from({ length: count }, (_, index) => {
        const column = index % (coarsePointer ? 5 : 8);
        const row = Math.floor(index / (coarsePointer ? 5 : 8));
        const ox = ((column + 0.5) / (coarsePointer ? 5 : 8)) * width + Math.sin(index * 8.2) * 24;
        const oy = ((row + 0.6) / Math.ceil(count / (coarsePointer ? 5 : 8))) * height + Math.cos(index * 5.4) * 22;
        return { x: ox, y: oy, ox, oy, phase: index * 0.73 };
      });
    };

    const resize = () => {
      const rect = field.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      makeNodes();
    };

    const draw = (time = 0) => {
      context.clearRect(0, 0, width, height);
      const seconds = time / 1000;

      nodes.forEach((node) => {
        const dx = node.x - pointer.x;
        const dy = node.y - pointer.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        const influence = Math.max(0, 1 - distance / 170);
        const driftX = reducedMotion ? 0 : Math.sin(seconds * 0.45 + node.phase) * 5;
        const driftY = reducedMotion ? 0 : Math.cos(seconds * 0.36 + node.phase) * 4;
        node.x += (node.ox + driftX + (dx / distance) * influence * 20 - node.x) * 0.055;
        node.y += (node.oy + driftY + (dy / distance) * influence * 20 - node.y) * 0.055;
      });

      for (let a = 0; a < nodes.length; a += 1) {
        for (let b = a + 1; b < nodes.length; b += 1) {
          const dx = nodes[a].x - nodes[b].x;
          const dy = nodes[a].y - nodes[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 138) {
            context.beginPath();
            context.moveTo(nodes[a].x, nodes[a].y);
            context.lineTo(nodes[b].x, nodes[b].y);
            context.strokeStyle = `rgba(22, 169, 232, ${0.18 * (1 - distance / 138)})`;
            context.lineWidth = 0.7;
            context.stroke();
          }
        }
      }

      nodes.forEach((node, index) => {
        const pulse = reducedMotion ? 1 : 0.86 + Math.sin(seconds * 0.8 + node.phase) * 0.14;
        context.beginPath();
        context.arc(node.x, node.y, index % 9 === 0 ? 3.2 * pulse : 1.6 * pulse, 0, Math.PI * 2);
        context.fillStyle = index % 9 === 0 ? "rgba(7, 19, 31, .82)" : "rgba(22, 169, 232, .72)";
        context.fill();
      });

      if (!reducedMotion && visible) frame = requestAnimationFrame(draw);
    };

    const move = (event: PointerEvent) => {
      const rect = field.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };
    const leave = () => {
      pointer.x = -1000;
      pointer.y = -1000;
    };
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !reducedMotion && !frame) frame = requestAnimationFrame(draw);
      if (!visible && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    const observer = new ResizeObserver(resize);

    resize();
    draw();
    observer.observe(field);
    visibility.observe(field);
    if (!coarsePointer && !reducedMotion) {
      field.addEventListener("pointermove", move);
      field.addEventListener("pointerleave", leave);
    }

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      visibility.disconnect();
      field.removeEventListener("pointermove", move);
      field.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={fieldRef} className="computational-field" aria-hidden="true">
      <canvas ref={canvasRef} />
      <div className="field-orbit orbit-one" />
      <div className="field-orbit orbit-two" />
      <span className="field-label label-input">INPUT / 00</span>
      <span className="field-label label-output">PHYSICAL / 01</span>
    </div>
  );
}

function TrackVisual({ variant }: { variant: string }) {
  return (
    <div className={`track-visual visual-${variant}`} aria-hidden="true">
      <div className="visual-core" />
      {Array.from({ length: 12 }, (_, index) => (
        <span key={index} style={{ "--i": index } as React.CSSProperties} />
      ))}
    </div>
  );
}

export function SymposiumExperience() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [activeArea, setActiveArea] = useState("edge");
  const [activeMilestone, setActiveMilestone] = useState(0);
  const [activeTrack, setActiveTrack] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const rootRef = useRef<HTMLElement>(null);

  const selectedArea = useMemo(
    () => researchAreas.find((area) => area.id === activeArea) ?? researchAreas[0],
    [activeArea],
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section[id]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-30% 0px -58%", threshold: [0, 0.15, 0.4] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let animationContext: { revert: () => void } | undefined;
    let cancelled = false;

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([gsapModule, scrollModule]) => {
        if (cancelled) return;
        const gsap = gsapModule.gsap;
        const ScrollTrigger = scrollModule.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);
        animationContext = gsap.context(() => {
          gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
            gsap.fromTo(
              element,
              { y: 34, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.9,
                ease: "power3.out",
                scrollTrigger: { trigger: element, start: "top 88%", once: true },
              },
            );
          });
          gsap.to(".hero-title", {
            yPercent: -8,
            scale: 0.97,
            ease: "none",
            scrollTrigger: { trigger: "#home", start: "top top", end: "bottom top", scrub: 0.7 },
          });
          gsap.fromTo(
            ".timeline-progress",
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: { trigger: ".timeline-list", start: "top 75%", end: "bottom 60%", scrub: 0.5 },
            },
          );
        }, rootRef);
      },
    );

    return () => {
      cancelled = true;
      animationContext?.revert();
    };
  }, []);

  const navItems = [
    ["about", "About"],
    ["research", "Research"],
    ["timeline", "Timeline"],
    ["venue", "Venue"],
  ];

  return (
    <main ref={rootRef}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className={`site-nav ${scrolled ? "is-compact" : ""}`}>
        <a className="wordmark" href="#home" aria-label="ISCICPS 2027 home">
          ISCICPS <sup>&apos;27</sup>
        </a>
        <button
          className="nav-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span>{menuOpen ? "Close" : "Menu"}</span>
          <i aria-hidden="true" />
        </button>
        <nav id="primary-navigation" className={menuOpen ? "is-open" : ""} aria-label="Primary navigation">
          {navItems.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              className={activeSection === id ? "is-active" : ""}
              aria-current={activeSection === id ? "location" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
        </nav>
        <a className="nav-cta" href="https://cmt3.research.microsoft.com/" target="_blank" rel="noreferrer">
          Register <span aria-hidden="true">↗</span>
        </a>
      </header>

      <section id="home" className="hero" aria-labelledby="hero-heading">
        <ComputationalField />
        <div className="hero-grid" id="main-content">
          <div className="hero-meta top-meta">
            <span>INTERNATIONAL SYMPOSIUM</span>
            <span>SRMIST · KATTANKULATHUR</span>
          </div>
          <h1 id="hero-heading" className="hero-title" aria-label="Computational intelligence for cyber-physical systems">
            <span>COMPUTATIONAL</span>
            <span>INTELLIGENCE</span>
            <span className="title-indent">FOR CYBER—</span>
            <span className="title-indent">PHYSICAL SYSTEMS</span>
          </h1>
          <div className="hero-bottom">
            <div className="event-date">
              <span>21—22</span>
              <span>APRIL 2027</span>
            </div>
            <div className="system-sequence" aria-label="Artificial intelligence to the physical world">
              <span>AI</span><i />
              <span>COMPUTATION</span><i />
              <span>EDGE</span><i />
              <span>PHYSICAL WORLD</span>
            </div>
          </div>
        </div>
        <a className="scroll-explore" href="#about">
          <span>Scroll to explore</span>
          <span aria-hidden="true">↓</span>
        </a>
      </section>

      <section id="about" className="manifesto section-pad" aria-labelledby="manifesto-title">
        <div className="section-kicker" data-reveal>
          <span>01 / MANIFESTO</span>
          <span>INTELLIGENCE → MATTER</span>
        </div>
        <h2 id="manifesto-title" className="manifesto-title" data-reveal>
          INTELLIGENCE IS NO LONGER CONFINED TO THE <em>SCREEN.</em>
        </h2>
        <div className="manifesto-support" data-reveal>
          <p>
            ISCICPS explores what happens when artificial intelligence leaves the digital environment and begins interacting with the physical world.
          </p>
          <ul aria-label="Cyber-physical domains">
            <li>Machines.</li>
            <li>Robots.</li>
            <li>Energy systems.</li>
            <li>Infrastructure.</li>
            <li>Autonomous environments.</li>
          </ul>
        </div>
      </section>

      <section id="timeline" className="timeline section-pad" aria-labelledby="timeline-title">
        <div className="section-kicker inverse" data-reveal>
          <span>02 / EVENT</span>
          <span>THE ROAD TO ISCICPS</span>
        </div>
        <div className="timeline-layout">
          <div className="timeline-heading" data-reveal>
            <p className="eyebrow">IMPORTANT DATES</p>
            <h2 id="timeline-title">FROM IDEA<br />TO IMPACT.</h2>
            <p className="timeline-note">Select a milestone to read the event detail.</p>
          </div>
          <div className="timeline-list" role="list">
            <div className="timeline-rail" aria-hidden="true"><span className="timeline-progress" /></div>
            {milestones.map((milestone, index) => (
              <div key={milestone.title} role="listitem">
                <button
                  type="button"
                  className={`milestone ${activeMilestone === index ? "is-active" : ""}`}
                  aria-expanded={activeMilestone === index}
                  onClick={() => setActiveMilestone(index)}
                  onFocus={() => setActiveMilestone(index)}
                  onMouseEnter={() => setActiveMilestone(index)}
                >
                  <span className="milestone-date">
                    <b>{milestone.month}</b>
                    <strong>{milestone.day}</strong>
                    <small>{milestone.year}</small>
                  </span>
                  <span className="milestone-copy">
                    <b>{milestone.title}</b>
                    <span>{milestone.detail}</span>
                  </span>
                  <span className="milestone-index">0{index + 1}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="research" className="research section-pad" aria-labelledby="research-title">
        <div className="section-kicker" data-reveal>
          <span>03 / RESEARCH UNIVERSE</span>
          <span>FIVE CONNECTED FIELDS</span>
        </div>
        <div className="research-intro" data-reveal>
          <h2 id="research-title">A SYSTEM OF<br />SHARED QUESTIONS.</h2>
          <p>Choose a node to trace the research territory around ISCICPS.</p>
        </div>
        <div className="universe" data-reveal>
          <div className="universe-map" role="group" aria-label="Interactive research areas">
            <div className="universe-rings" aria-hidden="true"><i /><i /><i /></div>
            <div className="universe-center" aria-hidden="true"><span>ISCICPS</span><small>INTELLIGENCE / PHYSICAL</small></div>
            {researchAreas.map((area) => (
              <button
                key={area.id}
                type="button"
                className={`research-node ${activeArea === area.id ? "is-active" : ""}`}
                style={{ "--x": `${area.x}%`, "--y": `${area.y}%` } as React.CSSProperties}
                aria-pressed={activeArea === area.id}
                onClick={() => setActiveArea(area.id)}
                onFocus={() => setActiveArea(area.id)}
                onMouseEnter={() => setActiveArea(area.id)}
              >
                <i aria-hidden="true" />
                <span>{area.short}</span>
              </button>
            ))}
          </div>
          <div className="universe-detail" aria-live="polite">
            <span className="detail-number">{String(researchAreas.indexOf(selectedArea) + 1).padStart(2, "0")}</span>
            <h3>{selectedArea.title}</h3>
            <p>{selectedArea.description}</p>
            <ul>{selectedArea.keywords.map((keyword) => <li key={keyword}>{keyword}</li>)}</ul>
          </div>
        </div>
      </section>

      <section className="tracks section-pad" aria-labelledby="tracks-title">
        <div className="section-kicker" data-reveal>
          <span>04 / TRACKS</span>
          <span>CALL FOR RESEARCH</span>
        </div>
        <div className="tracks-header" data-reveal>
          <h2 id="tracks-title">FIVE TRACKS.<br />ONE LIVING SYSTEM.</h2>
          <p>Explore the symposium&apos;s core research areas. Each track follows intelligence into a different part of the physical world.</p>
        </div>
        <div className="tracks-index" data-reveal>
          <div className="track-list">
            {tracks.map((track, index) => (
              <button
                key={track.id}
                type="button"
                className={`track-row ${activeTrack === index ? "is-active" : ""}`}
                aria-expanded={activeTrack === index}
                aria-controls="track-detail"
                onClick={() => setActiveTrack(index)}
                onFocus={() => setActiveTrack(index)}
                onMouseEnter={() => setActiveTrack(index)}
              >
                <span className="track-number">{track.number}</span>
                <span className="track-title">{track.title}</span>
                <span className="track-symbol" aria-hidden="true">{activeTrack === index ? "—" : "+"}</span>
              </button>
            ))}
          </div>
          <div id="track-detail" className="track-detail" aria-live="polite">
            <TrackVisual variant={tracks[activeTrack].id} />
            <div>
              <span className="eyebrow">TRACK {tracks[activeTrack].number}</span>
              <p>{tracks[activeTrack].description}</p>
              <ul>{tracks[activeTrack].keywords.map((keyword) => <li key={keyword}>{keyword}</li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      <section className="institution section-pad" aria-labelledby="institution-title">
        <div className="section-kicker" data-reveal>
          <span>05 / ABOUT</span>
          <span>ACADEMIA × INDUSTRY</span>
        </div>
        <div className="institution-copy" data-reveal>
          <h2 id="institution-title">A MEETING POINT FOR INTELLIGENCE IN MOTION.</h2>
          <p>
            The IEEE International Symposium on Computational Intelligence for Cyber-Physical Systems is an academic event designed to foster collaboration among researchers, engineers and industry professionals working where AI and machine learning meet embedded physical infrastructure.
          </p>
        </div>
        <dl className="facts" data-reveal>
          <div><dt>HOST</dt><dd>SRMIST</dd></div>
          <div><dt>LOCATION</dt><dd>KATTANKULATHUR<br />TAMIL NADU, INDIA</dd></div>
          <div><dt>FOCUS</dt><dd>COMPUTATIONAL INTELLIGENCE<br />CYBER-PHYSICAL SYSTEMS</dd></div>
          <div><dt>FORMAT</dt><dd>INTERNATIONAL SYMPOSIUM</dd></div>
          <div><dt>PUBLICATION</dt><dd>ACCEPTED & PRESENTED PAPERS<br />PROCEEDINGS · SCOPUS INDEXING</dd></div>
        </dl>
      </section>

      <section id="venue" className="venue section-pad" aria-labelledby="venue-title">
        <div className="section-kicker inverse" data-reveal>
          <span>06 / VENUE</span>
          <span>12.8231° N · 80.0442° E</span>
        </div>
        <div className="venue-layout">
          <div className="venue-copy" data-reveal>
            <p className="eyebrow">SRM INSTITUTE OF SCIENCE AND TECHNOLOGY</p>
            <h2 id="venue-title">KATTAN—<br />KULATHUR.</h2>
            <p>SRM Nagar, Potheri, Kattankulathur, Tamil Nadu, India.</p>
            <a href="https://maps.google.com/?q=SRM+Institute+of+Science+and+Technology+Kattankulathur" target="_blank" rel="noreferrer">
              Locate campus <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="campus-map" aria-label="Abstract location diagram for the SRMIST Kattankulathur campus" role="img" data-reveal>
            <div className="map-grid" aria-hidden="true" />
            <div className="map-route route-one" aria-hidden="true" />
            <div className="map-route route-two" aria-hidden="true" />
            <div className="map-point" aria-hidden="true"><i /><span>SRMIST<br />KATTANKULATHUR</span></div>
            <span className="map-label map-label-a">CHENNAI REGION</span>
            <span className="map-label map-label-b">GST ROAD / NH 32</span>
          </div>
        </div>
      </section>

      <section className="actions" aria-labelledby="actions-title">
        <p className="eyebrow" data-reveal>07 / PARTICIPATE</p>
        <h2 id="actions-title" data-reveal>BRING YOUR<br />RESEARCH INTO<br /><em>THE SYSTEM.</em></h2>
        <div className="action-links" data-reveal>
          <a href="https://cmt3.research.microsoft.com/" target="_blank" rel="noreferrer">
            <span>Submit paper</span><span aria-hidden="true">↗</span>
          </a>
          <a href="https://cmt3.research.microsoft.com/" target="_blank" rel="noreferrer">
            <span>Register</span><span aria-hidden="true">↗</span>
          </a>
        </div>
        <p className="cmt-note">Submission and registration currently open through Microsoft CMT.</p>
      </section>

      <footer className="site-footer">
        <div className="footer-mark">ISCICPS <sup>&apos;27</sup></div>
        <div className="footer-title">INTERNATIONAL SYMPOSIUM ON<br />COMPUTATIONAL INTELLIGENCE<br />& CYBER-PHYSICAL SYSTEMS</div>
        <div className="footer-contact">
          <a href="mailto:ieeescicps@gmail.com">ieeescicps@gmail.com</a>
          <a href="tel:+919444803672">+91 94448 03672</a>
          <span>SRMIST · KATTANKULATHUR</span>
        </div>
        <div className="footer-bottom"><span>© 2026 ISCICPS</span><span>INTELLIGENCE MEETS THE PHYSICAL WORLD.</span></div>
      </footer>
    </main>
  );
}
