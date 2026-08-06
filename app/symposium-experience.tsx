"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const imageSources = [
  "/images/srm-campus-aerial.jpg",
  "/images/srm-auditorium-1920.jpg",
  "/images/srm-research-day.webp",
];

const researchTracks = [
  {
    number: "01",
    title: "Edge Intelligence",
    description: "Hardware-aware acceleration, on-device learning and low-latency decisions at the edge.",
    keywords: ["ON-DEVICE AI", "EMBEDDED SYSTEMS", "IoT"],
    image: "/images/srm-campus-aerial.jpg",
    position: "center center",
  },
  {
    number: "02",
    title: "Autonomous Systems",
    description: "Robotics, multi-agent coordination and real-time perception, localization and mapping.",
    keywords: ["ROBOTICS", "SLAM", "SWARM INTELLIGENCE"],
    image: "/images/srm-auditorium-1920.jpg",
    position: "center 70%",
  },
  {
    number: "03",
    title: "Cyber Security",
    description: "Threat detection, zero-trust IoT, physical-layer security and fault-tolerant control.",
    keywords: ["ZERO TRUST", "RESILIENCE", "PRIVACY"],
    image: "/images/srm-research-day.webp",
    position: "center center",
  },
  {
    number: "04",
    title: "Smart Infrastructure",
    description: "Intelligent control for energy systems, predictive maintenance and resource optimization.",
    keywords: ["SMART ENERGY", "INDUSTRY 4.0", "OPTIMIZATION"],
    image: "/images/srm-campus-aerial.jpg",
    position: "center 62%",
  },
];

const milestones = [
  { day: "31", month: "OCT", year: "2026", title: "Paper submission" },
  { day: "15", month: "NOV", year: "2026", title: "Acceptance" },
  { day: "15", month: "JAN", year: "2027", title: "Registration" },
  { day: "21—22", month: "APR", year: "2027", title: "ISCICPS '27" },
];

function LoadingExperience({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    let frame = 0;
    let assetsReady = false;
    let finished = false;
    const startedAt = performance.now();
    const minimumDuration = 2700;

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
      const timedProgress = Math.min(96, Math.floor((elapsed / minimumDuration) * 96));
      const waitingProgress = elapsed > minimumDuration
        ? Math.min(99, 96 + Math.floor((1 - Math.exp(-(elapsed - minimumDuration) / 1800)) * 3))
        : timedProgress;
      setProgress(waitingProgress);

      if (!finished && assetsReady && elapsed >= minimumDuration) {
        finished = true;
        setProgress(100);
        window.setTimeout(() => setClosing(true), 220);
        window.setTimeout(onComplete, 1120);
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
      <div className="loader-pattern" aria-hidden="true">
        {Array.from({ length: 13 }, (_, index) => (
          <div key={index}>ISCICPS&nbsp; ISCICPS&nbsp; ISCICPS&nbsp; ISCICPS&nbsp; ISCICPS&nbsp; ISCICPS</div>
        ))}
      </div>
      <div className="loader-terminal">
        <div className="terminal-head"><span>ISCICPS_BOOT</span><i /></div>
        <div className="terminal-count">{String(progress).padStart(2, "0")}%</div>
        <div className="terminal-track"><i /></div>
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
    let x = -100;
    let y = -100;

    const draw = () => {
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      frame = 0;
    };
    const move = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      cursor.classList.add("is-visible");
      if (!frame) frame = requestAnimationFrame(draw);
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

  return <div ref={cursorRef} className="custom-cursor" aria-hidden="true"><i /><span /></div>;
}

export function SymposiumExperience() {
  const [loaded, setLoaded] = useState(false);
  const [compactNav, setCompactNav] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [activeTrack, setActiveTrack] = useState(0);
  const rootRef = useRef<HTMLElement>(null);
  const completeLoading = useCallback(() => setLoaded(true), []);

  useEffect(() => {
    const onScroll = () => setCompactNav(window.scrollY > 64);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section[id]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-28% 0px -60%", threshold: [0, 0.15, 0.4] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [loaded]);

  useEffect(() => {
    if (!loaded) return;
    const entries = Array.from(document.querySelectorAll<HTMLElement>(".research-entry"));
    const observer = new IntersectionObserver(
      (observed) => {
        const active = observed.find((entry) => entry.isIntersecting);
        if (active) setActiveTrack(Number((active.target as HTMLElement).dataset.index ?? 0));
      },
      { rootMargin: "-38% 0px -38%", threshold: 0.01 },
    );
    entries.forEach((entry) => observer.observe(entry));
    return () => observer.disconnect();
  }, [loaded]);

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
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
          gsap.fromTo(
            element,
            { opacity: 0, transform: "translateY(32px)" },
            {
              opacity: 1,
              transform: "translateY(0px)",
              duration: 0.9,
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
              duration: 1.15,
              ease: "power4.inOut",
              scrollTrigger: { trigger: element, start: "top 86%", once: true },
            },
          );
        });

        const heroTimeline = gsap.timeline({
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom bottom", scrub: 0.75 },
        });
        heroTimeline
          .fromTo(".hero-image", { clipPath: "inset(18% 48% 18% 48%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut" }, 0)
          .fromTo(".hero-image img", { transform: "scale(1.18) translateY(-3%)" }, { transform: "scale(1.04) translateY(3%)", ease: "none" }, 0)
          .to(".hero-computational", { transform: "translateY(-42%)", opacity: 0.26, ease: "none" }, 0)
          .to(".hero-intelligence", { transform: "translateX(8%)", ease: "none" }, 0)
          .fromTo(".hero-for", { opacity: 0.25 }, { opacity: 1, ease: "none" }, 0.15)
          .to(".hero-cyber", { transform: "translateX(-7%)", ease: "none" }, 0)
          .to(".hero-systems", { transform: "translateX(9%)", ease: "none" }, 0);

        gsap.fromTo(
          ".matter-support span",
          { opacity: 0.12 },
          {
            opacity: 1,
            stagger: 0.16,
            ease: "none",
            scrollTrigger: { trigger: ".matter-support", start: "top 76%", end: "bottom 50%", scrub: 0.4 },
          },
        );

        gsap.utils.toArray<HTMLImageElement>(".about-image img, .people-image img, .venue-image img").forEach((image) => {
          gsap.fromTo(
            image,
            { transform: "scale(1.05) translateY(-2%)" },
            {
              transform: "scale(1.07) translateY(4%)",
              ease: "none",
              scrollTrigger: { trigger: image.parentElement, start: "top bottom", end: "bottom top", scrub: 0.8 },
            },
          );
        });

        gsap.fromTo(
          ".timeline-progress i",
          { scaleX: 0 },
          { scaleX: 1, ease: "none", scrollTrigger: { trigger: ".timeline", start: "top 65%", end: "bottom 60%", scrub: 0.5 } },
        );
      }, rootRef);
    });

    return () => {
      cancelled = true;
      context?.revert();
    };
  }, [loaded]);

  const navItems = [
    ["about", "About"],
    ["research", "Research"],
    ["timeline", "Timeline"],
    ["venue", "Venue"],
  ];

  return (
    <main ref={rootRef} className={`experience ${loaded ? "is-ready" : ""}`}>
      {!loaded && <LoadingExperience onComplete={completeLoading} />}
      <CustomCursor />
      <a className="skip-link" href="#main-content">Skip to content</a>

      <header className={`site-nav ${compactNav ? "is-compact" : ""}`}>
        <a className="wordmark" href="#home" aria-label="ISCICPS 2027 home">ISCICPS <sup>'27</sup></a>
        <button
          className="nav-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "Close" : "Menu"}<i aria-hidden="true" />
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
        <a className="nav-cta" href="#register">Register <span aria-hidden="true">↗</span></a>
      </header>

      <section id="home" className="hero" aria-labelledby="hero-heading">
        <div id="main-content" className="hero-stage">
          <div className="hero-meta">
            <span>ISCICPS '27</span>
            <span>INTERNATIONAL SYMPOSIUM</span>
            <span>21—22 APRIL 2027</span>
            <span>SRMIST · CHENNAI</span>
          </div>
          <div className="hero-image" data-cursor="VIEW ↗">
            <img src="/images/srm-campus-aerial.jpg" alt="Aerial view of the SRMIST Kattankulathur campus" />
          </div>
          <h1 id="hero-heading" className="hero-title">
            <span className="hero-computational">COMPUTATIONAL</span>
            <span className="hero-intelligence">INTELLIGENCE</span>
            <span className="hero-for">FOR</span>
            <span className="hero-cyber">CYBER-PHYSICAL</span>
            <span className="hero-systems">SYSTEMS</span>
          </h1>
        </div>
      </section>

      <section id="about" className="about" aria-labelledby="about-title">
        <div className="section-note" data-reveal><span>01</span><span>ABOUT ISCICPS</span></div>
        <h2 id="about-title" data-reveal>
          ISCICPS IS AN INTERNATIONAL MEETING FOR RESEARCHERS, ENGINEERS AND INDUSTRY PRACTITIONERS EXPLORING COMPUTATIONAL INTELLIGENCE INSIDE CONNECTED PHYSICAL SYSTEMS.
        </h2>
        <figure className="about-image image-reveal" data-mask data-cursor="VIEW ↗">
          <img src="/images/srm-research-day.webp" alt="Researchers and institutional leaders gathered at SRMIST Research Day" />
          <figcaption>SRMIST RESEARCH DAY · KATTANKULATHUR</figcaption>
        </figure>
      </section>

      <section className="matter" aria-labelledby="matter-title">
        <div className="section-note" data-reveal><span>02</span><span>WHY IT MATTERS</span></div>
        <h2 id="matter-title">
          <span data-reveal>THE PHYSICAL</span>
          <span data-reveal>WORLD IS</span>
          <span data-reveal>BECOMING</span>
          <span className="accent" data-reveal>COMPUTATIONAL.</span>
        </h2>
        <p className="matter-support" aria-label="Energy grids anticipate demand. Robots perceive uncertainty. Infrastructure detects failure.">
          <span>ENERGY GRIDS ANTICIPATE DEMAND.</span>
          <span>ROBOTS PERCEIVE UNCERTAINTY.</span>
          <span>INFRASTRUCTURE DETECTS FAILURE.</span>
        </p>
      </section>

      <section id="research" className="research" aria-labelledby="research-title">
        <div className="section-note" data-reveal><span>03</span><span>RESEARCH</span></div>
        <h2 id="research-title" data-reveal>RESEARCH<br />FIELDS</h2>
        <div className="research-layout">
          <div className="research-list">
            {researchTracks.map((track, index) => (
              <article
                className={`research-entry ${activeTrack === index ? "is-active" : ""}`}
                data-index={index}
                data-cursor="EXPLORE"
                key={track.number}
                onMouseEnter={() => setActiveTrack(index)}
                onFocus={() => setActiveTrack(index)}
                tabIndex={0}
              >
                <span>{track.number}</span>
                <h3>{track.title}</h3>
                <p>{track.description}</p>
                <ul>{track.keywords.map((keyword) => <li key={keyword}>{keyword}</li>)}</ul>
              </article>
            ))}
          </div>
          <div className="research-visual" aria-live="polite" data-cursor="VIEW ↗">
            {researchTracks.map((track, index) => (
              <img
                className={activeTrack === index ? "is-active" : ""}
                src={track.image}
                alt={activeTrack === index ? `${track.title} research at ISCICPS` : ""}
                aria-hidden={activeTrack !== index}
                style={{ objectPosition: track.position }}
                key={track.number}
              />
            ))}
            <span>{researchTracks[activeTrack].number} / 04</span>
          </div>
        </div>
      </section>

      <section className="people" aria-labelledby="people-title">
        <div className="people-image image-reveal" data-mask data-cursor="VIEW ↗">
          <img src="/images/srm-research-day.webp" alt="Research community on stage at SRMIST" />
        </div>
        <div className="people-copy">
          <div className="section-note" data-reveal><span>04</span><span>PEOPLE</span></div>
          <h2 id="people-title" data-reveal>RESEARCHERS.<br />ENGINEERS.<br />INDUSTRY.</h2>
          <p data-reveal>Two days of exchange across disciplines and institutions.</p>
        </div>
      </section>

      <section id="timeline" className="timeline" aria-labelledby="timeline-title">
        <div className="section-note" data-reveal><span>05</span><span>IMPORTANT DATES</span></div>
        <h2 id="timeline-title" data-reveal>FROM IDEA<br />TO IMPACT.</h2>
        <div className="timeline-progress" aria-hidden="true"><i /></div>
        <ol>
          {milestones.map((milestone) => (
            <li key={`${milestone.day}-${milestone.month}`} data-reveal>
              <time dateTime={`${milestone.year}-${milestone.month}-${milestone.day}`}>
                <strong>{milestone.day}</strong><span>{milestone.month}<br />{milestone.year}</span>
              </time>
              <p>{milestone.title}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="venue" className="venue" aria-labelledby="venue-title">
        <div className="venue-image" data-cursor="VIEW ↗">
          <img src="/images/srm-auditorium-1920.jpg" alt="Dr T. P. Ganesan Auditorium at SRMIST" />
        </div>
        <div className="venue-meta" data-reveal><span>06 / VENUE</span><span>CHENNAI, INDIA</span></div>
        <div className="venue-copy">
          <p data-reveal>SRM INSTITUTE OF SCIENCE AND TECHNOLOGY</p>
          <h2 id="venue-title" data-reveal>KATTAN—<br />KULATHUR</h2>
          <a data-reveal href="https://maps.google.com/?q=SRM+Institute+of+Science+and+Technology+Kattankulathur" target="_blank" rel="noreferrer">Locate campus <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <section id="register" className="register" aria-label="Participate in ISCICPS 2027">
        <a href="https://cmt3.research.microsoft.com/" target="_blank" rel="noreferrer">
          <span>SUBMIT PAPER</span><span aria-hidden="true">↗</span>
        </a>
        <a href="https://cmt3.research.microsoft.com/" target="_blank" rel="noreferrer">
          <span>REGISTER</span><span aria-hidden="true">↗</span>
        </a>
      </section>

      <footer className="site-footer">
        <a className="footer-mark" href="#home">ISCICPS <sup>'27</sup></a>
        <p>INTERNATIONAL SYMPOSIUM ON<br />COMPUTATIONAL INTELLIGENCE FOR<br />CYBER-PHYSICAL SYSTEMS</p>
        <div><a href="mailto:ieeescicps@gmail.com">ieeescicps@gmail.com</a><span>SRMIST · KATTANKULATHUR</span></div>
        <small>© 2026 ISCICPS</small>
      </footer>
    </main>
  );
}
