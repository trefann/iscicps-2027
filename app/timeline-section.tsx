import { timelineItems, type TimelineItem } from "./timeline-data";

function TimelineHeader() {
  return (
    <header className="timeline-header">
      <p className="timeline-index">03 / 05</p>
      <h2 id="timeline-title">THE ROAD TO<br />THE <span>SYMPOSIUM</span></h2>
      <p className="timeline-deck">Key milestones leading to<br />the International Symposium.</p>
    </header>
  );
}

function TimelineGrid() {
  return <div className="timeline-grid-layer" aria-hidden="true" />;
}

function TimelineAxis() {
  return (
    <div className="timeline-axis" aria-hidden="true">
      <div className="timeline-axis-meta"><span>T-LINE</span><span>VER 1.0</span></div>
      <svg className="timeline-axis-svg timeline-axis-svg--desktop" viewBox="0 0 1000 64" preserveAspectRatio="none">
        <defs>
          <mask id="timeline-reveal-desktop" maskUnits="userSpaceOnUse" x="0" y="0" width="1000" height="64">
            <path className="timeline-axis-mask" d="M 100 32 H 960" />
          </mask>
        </defs>
        <path className="timeline-axis-ghost" d="M 100 32 H 960" />
        <path className="timeline-axis-path" d="M 100 32 H 960" mask="url(#timeline-reveal-desktop)" />
        <path className="timeline-axis-arrow" d="M 942 22 L 960 32 L 942 42" />
      </svg>
      <svg className="timeline-axis-svg timeline-axis-svg--mobile" viewBox="0 0 64 1000" preserveAspectRatio="none">
        <defs>
          <mask id="timeline-reveal-mobile" maskUnits="userSpaceOnUse" x="0" y="0" width="64" height="1000">
            <path className="timeline-axis-mask" d="M 32 20 V 980" />
          </mask>
        </defs>
        <path className="timeline-axis-ghost" d="M 32 20 V 980" />
        <path className="timeline-axis-path" d="M 32 20 V 980" mask="url(#timeline-reveal-mobile)" />
        <path className="timeline-axis-arrow" d="M 22 962 L 32 980 L 42 962" />
      </svg>
    </div>
  );
}

function TimelineMilestone({ item, index }: { item: TimelineItem; index: number }) {
  return (
    <li className={`timeline-milestone${index === 0 ? " is-active" : ""}`} data-timeline-index={index} tabIndex={0} aria-current={index === 0 ? "date" : undefined}>
      <div className="timeline-node" aria-hidden="true"><span>{item.number}</span></div>
      <div className="timeline-date-wrap">
        <time className="timeline-date" dateTime={item.dateTime}>
          <strong>{item.day}</strong>
          <span>{item.month}</span>
          <small>{item.year}</small>
        </time>
      </div>
      <h3>{item.title}</h3>
      <i className="timeline-title-rule" aria-hidden="true" />
      <p>{item.description}</p>
      <span className="timeline-code" aria-hidden="true">{item.code}</span>
      <span className="timeline-hand" aria-hidden="true">{item.annotation}</span>
    </li>
  );
}

function TimelineAnnotations() {
  return (
    <div className="timeline-annotations" aria-hidden="true">
      <span className="timeline-crosshair timeline-crosshair--a" />
      <span className="timeline-crosshair timeline-crosshair--b" />
      <span className="timeline-hatch"><i /><i /><i /><i /></span>
      <span className="timeline-compass"><i>N</i><b /><i>S</i></span>
      <span className="timeline-coordinate">x̂(t) → u(t)</span>
      <span className="timeline-footer-note">TIME IS OUR<br />SHARED INFRASTRUCTURE.</span>
    </div>
  );
}

function TechnicalIllustration() {
  return (
    <figure className="timeline-technical-art" aria-hidden="true">
      <img src="/images/tracks-sketch/edge-ai.png" alt="" loading="lazy" />
      <figcaption>CPS / SIGNAL MAP 03</figcaption>
    </figure>
  );
}

export function TimelineSection() {
  return (
    <section id="timeline" className="timeline" aria-labelledby="timeline-title">
      <div className="timeline-stage">
        <TimelineGrid />
        <TimelineHeader />
        <p className="timeline-margin-note" aria-hidden="true">Great systems begin<br />with time, trust and<br />shared purpose.<i /></p>
        <TechnicalIllustration />
        <TimelineAxis />
        <ol className="timeline-milestones">
          {timelineItems.map((item, index) => <TimelineMilestone item={item} index={index} key={item.dateTime} />)}
        </ol>
        <TimelineAnnotations />
      </div>
    </section>
  );
}
