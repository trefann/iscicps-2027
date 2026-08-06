"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const imageSources = [
  "/images/srm-campus-aerial.jpg",
  "/images/srm-auditorium-1920.jpg",
  "/images/srm-research-day.webp",
];

const navItems = [
  ["home", "Home"],
  ["about", "About"],
  ["research", "Research"],
  ["timeline", "Timeline"],
  ["venue", "Venue"],
] as const;

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
    const minimumDuration = 2750;

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
      <div className="loader-pattern" aria-hidden="true">
        {Array.from({ length: 13 }, (_, index) => (
          <div key={index}>ISCICPS&nbsp; ISCICPS&nbsp; ISCICPS&nbsp; ISCICPS&nbsp; ISCICPS</div>
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
  const [activeMilestone, setActiveMilestone] = useState(0);
  const rootRef = useRef<HTMLElement>(null);
  const indicatorRef = useRef<HTMLSpanElement>(null);
  const completeLoading = useCallback(() => setLoaded(true), []);
  const navSection = navItems.some(([id]) => id === activeSection) ? activeSection : "venue";
  const navSectionIndex = navItems.findIndex(([id]) => id === navSection);

  useEffect(() => {
    document.body.classList.toggle("menu-is-open", menuOpen);
    return () => document.body.classList.remove("menu-is-open");
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
    if (!loaded) return;
    const entries = Array.from(document.querySelectorAll<HTMLElement>(".research-entry"));
    const observer = new IntersectionObserver(
      (observed) => {
        const visible = observed.find((entry) => entry.isIntersecting);
        if (visible) setActiveTrack(Number((visible.target as HTMLElement).dataset.index ?? 0));
      },
      { rootMargin: "-39% 0px -39%", threshold: 0.01 },
    );
    entries.forEach((entry) => observer.observe(entry));
    return () => observer.disconnect();
  }, [loaded]);

  useEffect(() => {
    if (!loaded) return;
    const entries = Array.from(document.querySelectorAll<HTMLElement>(".timeline li"));
    const observer = new IntersectionObserver(
      (observed) => {
        const visible = observed.find((entry) => entry.isIntersecting);
        if (visible) setActiveMilestone(Number((visible.target as HTMLElement).dataset.index ?? 0));
      },
      { rootMargin: "-35% 0px -48%", threshold: 0.01 },
    );
    entries.forEach((entry) => observer.observe(entry));
    return () => observer.disconnect();
  }, [loaded]);

  useEffect(() => {
    if (!loaded || !indicatorRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    let tween: { kill: () => void } | undefined;
    import("gsap").then(({ gsap }) => {
      if (cancelled) return;
      const target = document.querySelector<HTMLElement>(`.side-nav a[href="#${navSection}"]`);
      if (!target || !indicatorRef.current) return;
      tween = gsap.to(indicatorRef.current, {
        transform: `translateY(${target.offsetTop}px)`,
        height: target.offsetHeight,
        duration: 0.42,
        ease: "power3.out",
      });
    });
    return () => {
      cancelled = true;
      tween?.kill();
    };
  }, [navSection, loaded]);

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
          .from(".side-brand", { opacity: 0, transform: "translateY(22px)", duration: 0.55 })
          .from(".hero-kicker", { opacity: 0, transform: "translateY(20px)", duration: 0.45 }, 0.08)
          .from(".hero-computational", { opacity: 0, transform: "translateY(105%)", duration: 0.78 }, 0.12)
          .from(".hero-intelligence", { opacity: 0, transform: "translateX(-11%)", duration: 0.78 }, 0.23)
          .from(".hero-for", { opacity: 0, duration: 0.3 }, 0.46)
          .from(".hero-cyber", { clipPath: "inset(0 100% 0 0)", duration: 0.8 }, 0.39)
          .from(".hero-systems", { opacity: 0, transform: "scale(0.94)", duration: 0.65 }, 0.55)
          .from(".hero-meta span", { opacity: 0, transform: "translateY(10px)", stagger: 0.055, duration: 0.35 }, 0.58);

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

        const heroScroll = gsap.timeline({
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom bottom", scrub: 0.7 },
        });
        heroScroll
          .fromTo(".hero-image", { clipPath: "inset(42% 46% 42% 46%)" }, { clipPath: "inset(0% 0% 0% 0%)", ease: "power3.inOut" }, 0)
          .fromTo(".hero-image img", { transform: "scale(1.22) translateY(-3%)" }, { transform: "scale(1.05) translateY(4%)", ease: "none" }, 0)
          .to(".hero-computational", { transform: "translateY(-38%)", opacity: 0.18, ease: "none" }, 0)
          .to(".hero-intelligence", { transform: "translateX(9%)", ease: "none" }, 0)
          .to(".hero-cyber", { transform: "translateX(-7%)", ease: "none" }, 0)
          .to(".hero-systems", { transform: "translateX(7%)", ease: "none" }, 0);

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
    <main ref={rootRef} className={`experience ${loaded ? "is-ready" : ""}`}>
      {!loaded && <LoadingExperience onComplete={completeLoading} />}
      <CustomCursor />
      <a className="skip-link" href="#main-content">Skip to content</a>

      <aside className="side-nav" aria-label="Primary navigation">
        <a className="side-brand" href="#home" aria-label="ISCICPS 2027 home">
          <strong>ISCICPS</strong><span>'27</span>
        </a>
        <nav>
          <span ref={indicatorRef} className="nav-indicator" aria-hidden="true" />
          {navItems.map(([id, label], index) => (
            <a
              key={id}
              href={`#${id}`}
              className={navSection === id ? "is-active" : ""}
              aria-current={navSection === id ? "location" : undefined}
            >
              <span>{String(index + 1).padStart(2, "0")}</span><strong>{label}</strong>
            </a>
          ))}
        </nav>
        <div className="side-foot">
          <span>{String(navSectionIndex + 1).padStart(2, "0")} / 05</span>
          <a href="#register" data-cursor="ENTER ↗">REGISTER <i aria-hidden="true">↗</i></a>
        </div>
      </aside>

      <header className="mobile-nav">
        <a href="#home" aria-label="ISCICPS 2027 home">ISCICPS <sup>'27</sup></a>
        <button type="button" aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? "CLOSE" : "MENU"}<i aria-hidden="true" />
        </button>
      </header>

      <div id="mobile-menu" className={`mobile-menu ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
        <nav aria-label="Mobile navigation">
          {navItems.map(([id, label], index) => (
            <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>
              <span>{String(index + 1).padStart(2, "0")}</span>{label}
            </a>
          ))}
          <a className="mobile-register" href="#register" onClick={() => setMenuOpen(false)}>REGISTER <span>↗</span></a>
        </nav>
      </div>

      <div className="content-shell">
        <section id="home" className="hero" aria-labelledby="hero-heading">
          <div id="main-content" className="hero-stage">
            <div className="hero-kicker">ISCICPS '27</div>
            <div className="hero-meta">
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
                  loading="lazy"
                  key={track.number}
                />
              ))}
              <span>{researchTracks[activeTrack].number} / 04</span>
            </div>
          </div>
        </section>

        <section id="timeline" className="timeline" aria-labelledby="timeline-title">
          <div className="section-note" data-reveal><span>03</span><span>IMPORTANT DATES</span></div>
          <h2 id="timeline-title" data-reveal>THE SYSTEM<br /><span>PROGRESSES.</span></h2>
          <div className="timeline-progress" aria-hidden="true"><i /></div>
          <ol>
            {milestones.map((milestone, index) => (
              <li className={activeMilestone === index ? "is-active" : ""} data-index={index} key={milestone.iso}>
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

        <footer className="site-footer">
          <a className="footer-mark" href="#home">ISCICPS <sup>'27</sup></a>
          <p>INTERNATIONAL SYMPOSIUM ON<br />COMPUTATIONAL INTELLIGENCE FOR<br />CYBER-PHYSICAL SYSTEMS</p>
          <div><a href="mailto:ieeescicps@gmail.com">ieeescicps@gmail.com</a><span>SRMIST · KATTANKULATHUR</span></div>
          <small>© 2026 ISCICPS</small>
        </footer>
      </div>
    </main>
  );
}
