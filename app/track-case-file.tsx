"use client";

import { useEffect, type RefObject } from "react";

export type ResearchTrackCase = {
  number: string;
  title: string;
  caption: string;
  layout: string;
  preview: string;
  introduction: string;
  areas: string[];
  why: string;
  applications: string[];
  image: string;
  photo: string;
  position: string;
  statement: string;
  questions: string[];
};

type TrackCaseFileProps = {
  track: ResearchTrackCase;
  index: number;
  total: number;
  dialogRef: RefObject<HTMLDivElement | null>;
  instant?: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

export function TrackCaseFile({
  track,
  index,
  total,
  dialogRef,
  instant = false,
  onClose,
  onNavigate,
}: TrackCaseFileProps) {
  const previousIndex = (index - 1 + total) % total;
  const nextIndex = (index + 1) % total;
  const paddedTotal = String(total).padStart(2, "0");

  useEffect(() => {
    const root = dialogRef.current;
    if (!root) return;
    root.scrollTop = 0;
    root.parentElement?.style.setProperty("--case-scroll", "0");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let cancelled = false;
    let cleanup = () => {};

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, scrollModule]) => {
      if (cancelled || !dialogRef.current) return;
      const gsap = gsapModule.gsap;
      const ScrollTrigger = scrollModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const context = gsap.context(() => {
        const reveals = Array.from(root.querySelectorAll<HTMLElement>("[data-case-reveal]"));
        reveals.forEach((element) => {
          gsap.fromTo(
            element,
            { opacity: 0, transform: "translate3d(0, 26px, 0)" },
            {
              opacity: 1,
              transform: "translate3d(0, 0, 0)",
              duration: 0.72,
              ease: "power3.out",
              scrollTrigger: { trigger: element, scroller: root, start: "top 88%", once: true },
            },
          );
        });

        const depthObjects = Array.from(root.querySelectorAll<HTMLElement>("[data-case-depth]"));
        depthObjects.forEach((element) => {
          const depth = Number(element.dataset.caseDepth ?? 1);
          gsap.fromTo(
            element,
            { transform: `translate3d(0, ${depth * 18}px, 0)` },
            {
              transform: `translate3d(0, ${depth * -22}px, 0)`,
              ease: "none",
              scrollTrigger: {
                trigger: element,
                scroller: root,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.8,
              },
            },
          );
        });

        root.querySelectorAll<HTMLElement>("[data-blueprint-line]").forEach((line) => {
          gsap.fromTo(
            line,
            { transform: "scaleX(0)" },
            {
              transform: "scaleX(1)",
              transformOrigin: "left center",
              ease: "none",
              scrollTrigger: { trigger: line, scroller: root, start: "top 86%", end: "top 42%", scrub: 0.7 },
            },
          );
        });
      }, root);

      cleanup = () => context.revert();
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [dialogRef, track.number]);

  return (
    <div
      className="casefile-backdrop"
      data-instant={instant ? "true" : undefined}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="casefile-frame">
        <article
          ref={dialogRef}
          className={`track-casefile track-casefile--${track.layout}`}
          data-track={track.number}
          data-lenis-prevent
          role="dialog"
          aria-modal="true"
          aria-labelledby="casefile-title"
          onScroll={(event) => {
            const element = event.currentTarget;
            const distance = element.scrollHeight - element.clientHeight;
            element.parentElement?.style.setProperty("--case-scroll", String(distance > 0 ? element.scrollTop / distance : 0));
          }}
        >
        <button className="casefile-close" type="button" onClick={onClose} aria-label="Close track case file">
          CLOSE <span aria-hidden="true">×</span>
        </button>

        <header className="dossier-header">
          <div className="dossier-folio" data-case-reveal>
            <strong>{track.number} / {paddedTotal}</strong>
            <span>RESEARCH TRACK</span>
            <small>ARCHIVE / CPS—27—{track.number}</small>
          </div>
          <div className="dossier-heading">
            <p>ISCICPS&apos;27 · RESEARCH ARCHIVE</p>
            <h2 id="casefile-title">{track.title}</h2>
            <span>{track.caption}</span>
          </div>
          <div className="dossier-orbit" aria-hidden="true"><i /><b /><span>{track.number}</span></div>
        </header>

        <div className="dossier-body">
          <section className="dossier-collage" aria-label="Research case overview">
            <div className="dossier-sketchboard" data-case-depth="0.55" aria-hidden="true">
              <div className="dossier-sketch-sheet dossier-sketch-sheet--system">
                <span>PLATE {track.number}.01 / SYSTEM STUDY</span>
                <div className="dossier-machine-sketch" data-sketch={track.number}>
                  <i className="sketch-axis sketch-axis--x" />
                  <i className="sketch-axis sketch-axis--y" />
                  <i className="sketch-orbit sketch-orbit--one" />
                  <i className="sketch-orbit sketch-orbit--two" />
                  <b className="sketch-core">{track.number}</b>
                  {track.areas.slice(0, 4).map((area, areaIndex) => (
                    <em className={`sketch-node sketch-node--${areaIndex + 1}`} key={area}>{String(areaIndex + 1).padStart(2, "0")}</em>
                  ))}
                </div>
                <small>COMPUTATION / SIGNAL / PHYSICAL RESPONSE</small>
              </div>

              <div className="dossier-sketch-sheet dossier-sketch-sheet--detail">
                <span>DETAIL {track.number}.B</span>
                <div className="dossier-ring-sketch"><i /><i /><b /><em>Δt</em></div>
                <small>{track.areas[0]}</small>
              </div>

              <div className="dossier-data-scrap">
                <span>OBSERVATION</span>
                <b>x(t) → ŷ → u(t)</b>
                <small>LOOP / {track.number} / LIVE</small>
              </div>

              <div className="dossier-coordinate-scrap">
                <span>ARCHIVE COORD.</span>
                <b>13.0827° N</b>
                <b>80.2707° E</b>
              </div>
            </div>

            <div className="dossier-introduction" data-case-reveal>
              <span>01 — CASE NOTE</span>
              <p>{track.introduction}</p>
            </div>

            <aside className="dossier-field-note" data-case-reveal>
              <span>[ FIELD NOTE {track.number} ]</span>
              <strong>{track.preview}</strong>
              <small>FILED / RESEARCH DESK / 2027</small>
            </aside>

            <aside className="dossier-signal-note" data-case-reveal>
              <span>ILLUSTRATION / {track.number}.02</span>
              <b>{track.areas[1] ?? track.areas[0]}</b>
              <i aria-hidden="true" />
              <small>MEASURE → INTERPRET → ACT</small>
            </aside>

            <div className="dossier-blueprint" aria-hidden="true">
              <span>SENSOR</span><i data-blueprint-line /><b />
              <span>INFERENCE</span><i data-blueprint-line /><b />
              <span>CONTROL</span><i data-blueprint-line /><b />
              <span>ACTUATION</span>
            </div>
          </section>

          <blockquote className="dossier-statement" data-case-reveal>
            <span>WORKING PRINCIPLE / TRACK {track.number}</span>
            {track.statement}
          </blockquote>

          <section className="dossier-research" aria-labelledby="dossier-research-title">
            <header data-case-reveal><span>02 — RESEARCH NOTES</span><h3 id="dossier-research-title">Archive index</h3></header>
            <div>
              {track.areas.map((area, areaIndex) => (
                <article key={area} data-case-reveal>
                  <span>{String(areaIndex + 1).padStart(2, "0")}</span>
                  <h4>{area}</h4>
                </article>
              ))}
            </div>
          </section>

          <section className="dossier-context">
            <div className="dossier-question" data-case-reveal>
              <span>03 — WHY IT MATTERS</span>
              <p>{track.why}</p>
            </div>

            <div className="dossier-applications" data-case-reveal>
              <span>04 — IN THE PHYSICAL WORLD</span>
              {track.applications.map((application, applicationIndex) => (
                <p key={application}><small>{String(applicationIndex + 1).padStart(2, "0")}</small>{application}</p>
              ))}
            </div>

            <aside className="dossier-questions" data-case-reveal>
              <span>OPEN QUESTIONS</span>
              {track.questions.map((question, questionIndex) => <p key={question}><small>Q{questionIndex + 1}</small>{question}</p>)}
            </aside>
          </section>
        </div>

        <footer className="dossier-footer">
          <nav aria-label="Track case file navigation">
            <button type="button" onClick={() => onNavigate(previousIndex)}><span aria-hidden="true">←</span> TRACK {String(previousIndex + 1).padStart(2, "0")}</button>
            <span>{track.number} / {paddedTotal}</span>
            <button type="button" onClick={() => onNavigate(nextIndex)}>TRACK {String(nextIndex + 1).padStart(2, "0")} <span aria-hidden="true">→</span></button>
          </nav>
          </footer>
        </article>

        <aside className="casefile-archive-rail" aria-hidden="true">
          <span>N</span>
          <i><b /></i>
          <span>S</span>
        </aside>
      </div>
    </div>
  );
}
