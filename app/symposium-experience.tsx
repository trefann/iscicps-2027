"use client";

import { useEffect, useRef, useState } from "react";

const imageSources = [
  "/images/srm-campus-aerial.jpg",
  "/images/srm-auditorium-1920.jpg",
  "/images/srm-research-day.webp",
];

const researchTracks = [
  {
    number: "01",
    label: "EDGE INTELLIGENCE",
    title: "Thinking where the world happens.",
    copy: "Hardware-aware learning, embedded intelligence and low-latency decisions for connected physical environments.",
    keywords: ["ON-DEVICE AI", "EMBEDDED SYSTEMS", "IoT"],
    image: "/images/srm-campus-aerial.jpg",
    position: "center center",
  },
  {
    number: "02",
    label: "AUTONOMOUS SYSTEMS",
    title: "Machines that sense, decide and move.",
    copy: "Robotics, perception, localization and coordinated intelligence for systems operating beyond the screen.",
    keywords: ["ROBOTICS", "SLAM", "MULTI-AGENT SYSTEMS"],
    image: "/images/srm-auditorium-1920.jpg",
    position: "center 72%",
  },
  {
    number: "03",
    label: "CYBER SECURITY",
    title: "Trust is part of the architecture.",
    copy: "Resilient control, threat detection and privacy for infrastructures where a digital failure can become physical.",
    keywords: ["RESILIENCE", "ZERO TRUST", "PRIVACY"],
    image: "/images/srm-research-day.webp",
    position: "center center",
  },
  {
    number: "04",
    label: "SMART INFRASTRUCTURE",
    title: "Intelligence at the scale of a city.",
    copy: "Adaptive energy, mobility and industrial systems designed to learn from complex environments in real time.",
    keywords: ["SMART ENERGY", "INDUSTRY 4.0", "OPTIMIZATION"],
    image: "/images/srm-campus-aerial.jpg",
    position: "center 65%",
  },
];

const milestones = [
  ["31 OCT 2026", "Paper submission"],
  ["15 NOV 2026", "Acceptance notification"],
  ["15 JAN 2027", "Author registration"],
  ["21—22 APR 2027", "ISCICPS '27"],
];

function LoadingExperience({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const startedAt = Date.now();
    let current = 0;
    const ticker = window.setInterval(() => {
      current = Math.min(92, current + Math.max(1, Math.round((94 - current) * 0.09)));
      setProgress(current);
    }, 65);

    const preload = Promise.all(
      imageSources.map(
        (source) =>
          new Promise<void>((resolve) => {
            const image = new Image();
            image.onload = () => resolve();
            image.onerror = () => resolve();
            image.src = source;
          }),
      ),
    );

    Promise.all([
      preload,
      new Promise((resolve) => window.setTimeout(resolve, Math.max(0, 1050 - (Date.now() - startedAt)))),
    ]).then(() => {
      window.clearInterval(ticker);
      setProgress(100);
      window.setTimeout(() => setClosing(true), 180);
      window.setTimeout(onComplete, 620);
    });

    return () => window.clearInterval(ticker);
  }, [onComplete]);

  return (
    <div
      className={`loader ${closing ? "is-closing" : ""}`}
      style={{ "--load": progress } as React.CSSProperties}
      role="status"
      aria-live="polite"
      aria-label={`Loading ISCICPS experience, ${progress} percent`}
    >
      <div className="loader-wall" aria-hidden="true">
        {Array.from({ length: 8 }, (_, index) => (
          <span key={index}>ISCICPS / INTELLIGENCE IN MOTION /</span>
        ))}
      </div>
      <div className="loader-terminal">
        <div className="terminal-bar"><i /><i /><i /><span>ISCICPS_BOOT</span></div>
        <div className="terminal-body">
          <span>INITIALIZING PHYSICAL INTELLIGENCE</span>
          <strong>{String(progress).padStart(3, "0")}%</strong>
          <div className="terminal-progress"><i /></div>
        </div>
      </div>
    </div>
  );
}

export function SymposiumExperience() {
  const [loaded, setLoaded] = useState(false);
  const [compactNav, setCompactNav] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setCompactNav(window.scrollY > 72);
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
      { rootMargin: "-28% 0px -58%", threshold: [0, 0.15, 0.4] },
    );
    sections.forEach((section) => observer.observe(section));
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
            { opacity: 0, y: 42 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
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
              duration: 1.25,
              ease: "power4.inOut",
              scrollTrigger: { trigger: element, start: "top 84%", once: true },
            },
          );
        });

        gsap.to(".hero-title", {
          transform: "translateY(-6vh) scale(0.965)",
          opacity: 0.5,
          ease: "none",
          scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom 20%", scrub: 0.7 },
        });

        gsap.utils.toArray<HTMLImageElement>("[data-parallax]").forEach((image) => {
          gsap.fromTo(
            image,
            { transform: "scale(1.08) translateY(-2%)" },
            {
              transform: "scale(1.08) translateY(5%)",
              ease: "none",
              scrollTrigger: { trigger: image.parentElement, start: "top bottom", end: "bottom top", scrub: 0.8 },
            },
          );
        });

        gsap.fromTo(
          ".timeline-line i",
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: { trigger: ".dates", start: "top 65%", end: "bottom 55%", scrub: 0.5 },
          },
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
    ["people", "People"],
    ["venue", "Venue"],
  ];

  return (
    <main ref={rootRef} className={loaded ? "experience is-ready" : "experience"}>
      {!loaded && <LoadingExperience onComplete={() => setLoaded(true)} />}

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
          <span>{menuOpen ? "Close" : "Menu"}</span><i aria-hidden="true" />
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
        <div id="main-content" className="hero-frame">
          <div className="hero-meta">
            <span>INTERNATIONAL SYMPOSIUM</span>
            <span>21—22 APRIL 2027</span>
            <span>CHENNAI, INDIA</span>
          </div>
          <h1 id="hero-heading" className="hero-title">
            <span>COMPUTATIONAL</span>
            <span>INTELLIGENCE</span>
            <span className="hero-small">FOR</span>
            <span className="hero-indent">CYBER—PHYSICAL</span>
            <span className="hero-indent">SYSTEMS</span>
          </h1>
          <div className="hero-foot">
            <p>Where intelligence leaves the screen<br />and enters the physical world.</p>
            <a href="#about">Scroll to enter <span aria-hidden="true">↓</span></a>
          </div>
        </div>
        <div className="hero-index" aria-hidden="true">ISCICPS / 2027 / SRMIST</div>
      </section>

      <section id="about" className="opening" aria-labelledby="about-title">
        <div className="editorial-label" data-reveal><span>01</span><span>WHAT IS ISCICPS?</span></div>
        <h2 id="about-title" data-reveal>A CONVERSATION BETWEEN <em>CODE</em> AND THE WORLD IT CHANGES.</h2>
        <div className="opening-grid">
          <p data-reveal>
            ISCICPS is an international meeting for researchers, engineers and industry practitioners exploring computational intelligence inside connected physical systems.
          </p>
          <div className="opening-image image-reveal" data-mask>
            <img src="/images/srm-research-day.webp" alt="SRMIST researchers and leaders at Research Day" data-parallax />
            <span>SRMIST RESEARCH DAY / KATTANKULATHUR</span>
          </div>
        </div>
      </section>

      <section className="matter" aria-labelledby="matter-title">
        <div className="matter-image image-reveal" data-mask>
          <img src="/images/srm-campus-aerial.jpg" alt="Aerial view of the SRMIST Kattankulathur campus" data-parallax />
        </div>
        <div className="matter-overlay">
          <div className="editorial-label inverse" data-reveal><span>02</span><span>WHY IT MATTERS</span></div>
          <h2 id="matter-title" data-reveal>THE PHYSICAL WORLD IS BECOMING <em>COMPUTATIONAL.</em></h2>
          <p data-reveal>Energy grids anticipate demand. Robots perceive uncertainty. Infrastructure detects failure. Intelligence is no longer an interface—it is becoming an environment.</p>
        </div>
      </section>

      <section id="research" className="research-intro" aria-labelledby="research-title">
        <div className="editorial-label" data-reveal><span>03</span><span>RESEARCH UNIVERSE</span></div>
        <h2 id="research-title" data-reveal>FOUR FIELDS.<br />ONE <em>LIVING</em> SYSTEM.</h2>
        <p data-reveal>Scroll through the questions shaping intelligence beyond the screen.</p>
      </section>

      <div className="research-stories">
        {researchTracks.map((track) => (
          <article className="research-story" key={track.number}>
            <div className="story-image">
              <img src={track.image} alt="" aria-hidden="true" style={{ objectPosition: track.position }} data-parallax />
            </div>
            <div className="story-scrim" aria-hidden="true" />
            <div className="story-copy">
              <div className="story-meta" data-reveal><span>{track.number} / 04</span><span>{track.label}</span></div>
              <h3 data-reveal>{track.title}</h3>
              <div className="story-detail" data-reveal>
                <p>{track.copy}</p>
                <ul>{track.keywords.map((keyword) => <li key={keyword}>{keyword}</li>)}</ul>
              </div>
            </div>
          </article>
        ))}
      </div>

      <section id="people" className="people" aria-labelledby="people-title">
        <div className="people-photo image-reveal" data-mask>
          <img src="/images/srm-research-day.webp" alt="Researchers gathered on stage at SRMIST Research Day" data-parallax />
        </div>
        <div className="people-copy">
          <div className="editorial-label inverse" data-reveal><span>04</span><span>PEOPLE</span></div>
          <h2 id="people-title" data-reveal>RESEARCH IS A <em>HUMAN</em> EXCHANGE.</h2>
          <p data-reveal>Two days for ideas to move between disciplines, institutions and industries—and for new collaborations to begin.</p>
          <ul data-reveal>
            <li>Researchers</li><li>Engineers</li><li>Doctoral scholars</li><li>Industry leaders</li>
          </ul>
        </div>
      </section>

      <section className="dates" aria-labelledby="dates-title">
        <div className="editorial-label" data-reveal><span>05</span><span>THE ROAD TO ISCICPS</span></div>
        <h2 id="dates-title" data-reveal>FROM IDEA<br />TO <em>IMPACT.</em></h2>
        <div className="timeline-line" aria-hidden="true"><i /></div>
        <ol>
          {milestones.map(([date, title], index) => (
            <li key={date} data-reveal>
              <span>0{index + 1}</span><time>{date}</time><strong>{title}</strong>
            </li>
          ))}
        </ol>
      </section>

      <section id="venue" className="venue" aria-labelledby="venue-title">
        <div className="venue-image image-reveal" data-mask>
          <img src="/images/srm-auditorium-1920.jpg" alt="Dr T. P. Ganesan Auditorium at SRMIST in Chennai" data-parallax />
        </div>
        <div className="venue-top" data-reveal>
          <span>06 / VENUE</span><span>12.8231° N · 80.0442° E</span>
        </div>
        <div className="venue-copy">
          <p data-reveal>SRM INSTITUTE OF SCIENCE AND TECHNOLOGY</p>
          <h2 id="venue-title" data-reveal>KATTAN—<br />KULATHUR.</h2>
          <a data-reveal href="https://maps.google.com/?q=SRM+Institute+of+Science+and+Technology+Kattankulathur" target="_blank" rel="noreferrer">Locate the campus <span aria-hidden="true">↗</span></a>
        </div>
        <p className="image-credit">DR T. P. GANESAN AUDITORIUM / SRMIST</p>
      </section>

      <section id="register" className="register" aria-labelledby="register-title">
        <div className="editorial-label inverse" data-reveal><span>07</span><span>PARTICIPATE</span></div>
        <p className="register-kicker" data-reveal>THE SYSTEM NEEDS YOUR QUESTION.</p>
        <h2 id="register-title" data-reveal>BRING YOUR<br />RESEARCH <em>INTO</em><br />THE WORLD.</h2>
        <div className="register-actions" data-reveal>
          <a href="https://cmt3.research.microsoft.com/" target="_blank" rel="noreferrer"><span>Submit a paper</span><span aria-hidden="true">↗</span></a>
          <a href="https://cmt3.research.microsoft.com/" target="_blank" rel="noreferrer"><span>Register</span><span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <footer className="site-footer">
        <a className="footer-mark" href="#home">ISCICPS <sup>'27</sup></a>
        <p>INTERNATIONAL SYMPOSIUM ON<br />COMPUTATIONAL INTELLIGENCE FOR<br />CYBER-PHYSICAL SYSTEMS</p>
        <div><a href="mailto:ieeescicps@gmail.com">ieeescicps@gmail.com</a><span>SRMIST · KATTANKULATHUR</span></div>
        <small>© 2026 ISCICPS / INTELLIGENCE MEETS THE PHYSICAL WORLD</small>
      </footer>
    </main>
  );
}
