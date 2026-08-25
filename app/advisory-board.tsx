"use client";

import { useEffect, useRef, type CSSProperties } from "react";

type BoardMember = {
  name: string;
  profession: string;
  institution: string;
  country: string;
};

type BoardGroup = {
  code: string;
  title: string;
  note: string;
  members: BoardMember[];
};

const boardGroups: BoardGroup[] = [
  {
    code: "NAT",
    title: "National Advisory Committee",
    note: "Academic leadership across India",
    members: [
      { name: "Dr. Nickolas S.", profession: "Professor", institution: "NIT Tiruchirappalli", country: "India" },
      { name: "Dr. R. Eswari", profession: "Assistant Professor, Grade I", institution: "NIT Tiruchirappalli", country: "India" },
      { name: "Dr. C. Pandian", profession: "Academic Faculty", institution: "University College of Engineering Ramanathapuram", country: "India" },
      { name: "Pankaj Kumar", profession: "Assistant Professor, Computer Science & Engineering", institution: "Maulana Azad NIT Bhopal", country: "India" },
      { name: "Deepak Mishra", profession: "Professor & Head, Avionics", institution: "Indian Institute of Space Science and Technology", country: "India" },
      { name: "Dr. Subramanya Sarma S.", profession: "Dean Academics & Professor", institution: "Ramachandra College of Engineering", country: "India" },
      { name: "Dr. K. Srujan Raju", profession: "Professor & Dean (R&D)", institution: "CMR Technical Campus", country: "India" },
      { name: "Dr. Chitra S.", profession: "Associate Professor", institution: "Anna University, Chennai", country: "India" },
      { name: "Dr. D. Sumathi", profession: "Professor, CSE (Cyber Security)", institution: "Dayananda Sagar University", country: "India" },
      { name: "Dr. T. Subha", profession: "Associate Professor, Educational Media and Technology", institution: "NITTTR Chennai", country: "India" },
    ],
  },
  {
    code: "INT",
    title: "International Advisory Committee",
    note: "Perspectives from a global research network",
    members: [
      { name: "Alexandre Bernardino", profession: "Associate Professor, Electrical and Computer Engineering", institution: "Instituto Superior Técnico, University of Lisbon", country: "Portugal" },
      { name: "Prof. Srinath Doss", profession: "Professor & Dean, Engineering and Technology", institution: "Botho University", country: "Botswana" },
      { name: "Prof. Satya Subrahmanyam", profession: "Professor & Assistant Dean for Research", institution: "Holy Spirit University of Kaslik (USEK)", country: "Lebanon" },
      { name: "Ts. Dr. Iskandar Ishak", profession: "Associate Professor & Deputy Dean", institution: "Universiti Putra Malaysia", country: "Malaysia" },
      { name: "Dr. Thinagaran Perumal", profession: "Associate Professor & Head, Computer Science", institution: "Universiti Putra Malaysia", country: "Malaysia" },
      { name: "Dr. Wilfred Blessing", profession: "Senior Lecturer, Information Technology", institution: "University of Technology and Applied Sciences–Ibri", country: "Oman" },
      { name: "Dr. Prosun Bhattacharya", profession: "Professor of Groundwater Chemistry", institution: "KTH Royal Institute of Technology", country: "Sweden" },
      { name: "Dr. Paromita Chakraborty", profession: "Professor, Chemical Engineering", institution: "SRM Institute of Science and Technology", country: "India" },
      { name: "Dr. Nikita Hari", profession: "Head of Teaching and Design Support", institution: "University of Oxford", country: "United Kingdom" },
    ],
  },
  {
    code: "IND",
    title: "Industry Advisory Committee",
    note: "Practice, infrastructure and applied technology",
    members: [
      { name: "Dr. Adithya Pothan Raj V.", profession: "Lead Architect – Technology", institution: "Cognizant", country: "Canada" },
      { name: "Mr. Kumaresan M.", profession: "Cloud Architect", institution: "Google", country: "India" },
      { name: "Mr. Murali R.", profession: "Automation Engineer", institution: "Applied Systems", country: "Canada" },
      { name: "Mr. Koushik Sundar", profession: "Vice President · Global Tech Lead Architect", institution: "Citibank N.A.", country: "USA" },
      { name: "Dr. A. Vasanthi", profession: "Senior Consultant & AWS Cloud Architect", institution: "Slalom", country: "Australia" },
    ],
  },
];

const pinnedMembers = boardGroups.flatMap((group, groupIndex) =>
  group.members.map((member, memberIndex) => ({
    ...member,
    groupCode: group.code,
    groupTitle: group.title,
    memberCode: `${String(groupIndex + 1).padStart(2, "0")}.${String(memberIndex + 1).padStart(2, "0")}`,
  })),
);

function initialsFor(name: string) {
  return name
    .replace(/^(?:Ts\.\s*)?(?:Dr\.|Prof\.|Mr\.)\s*/i, "")
    .split(/[\s.-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function BoardCard({ member, index }: { member: (typeof pinnedMembers)[number]; index: number }) {
  const style = {
    "--board-col": index % 6,
    "--board-row": Math.floor(index / 6),
    "--board-tilt": `${[-1.6, 1.1, -0.7, 1.7, -1.05, 0.65][index % 6]}deg`,
  } as CSSProperties;

  return (
    <li
      className={`board-card board-card--${member.groupCode.toLowerCase()}`}
      data-board-card
      style={style}
    >
      <i className="board-pin" aria-hidden="true" />
      <div className="board-photo" aria-hidden="true">
        <span>{initialsFor(member.name)}</span>
        <small>PORTRAIT / PENDING</small>
      </div>
      <div className="board-card-copy">
        <span>{member.groupCode} / {member.memberCode}</span>
        <strong className="board-card-designation">{member.profession}</strong>
        <h3>{member.name}</h3>
        <p>{member.institution}</p>
        <small>{member.country}</small>
      </div>
    </li>
  );
}

export function AdvisoryBoard() {
  const boardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const board = boardRef.current;
    if (!board || window.matchMedia("(max-width: 800px), (prefers-reduced-motion: reduce)").matches) return;
    let cancelled = false;
    let context: { revert: () => void } | undefined;

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([gsapModule, scrollModule]) => {
      if (cancelled || !boardRef.current) return;
      const gsap = gsapModule.gsap;
      const ScrollTrigger = scrollModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      context = gsap.context(() => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-board-card]");
        const sequence = gsap.timeline({
          scrollTrigger: {
            trigger: board,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.32,
            invalidateOnRefresh: true,
          },
        });

        sequence.fromTo(".board-heading", { opacity: 0.25, y: 24 }, { opacity: 1, y: 0, duration: 0.12, ease: "power2.out" }, 0);

        cards.forEach((card, index) => {
          const rotation = [-1.6, 1.1, -0.7, 1.7, -1.05, 0.65][index % 6];
          const arrival = 0.055 + index * 0.036;
          sequence.fromTo(
            card,
            {
              autoAlpha: 0,
              x: index % 2 === 0 ? -34 : 34,
              y: 64 + Math.floor(index / 6) * 8,
              scale: 1.12,
              rotation: rotation + (index % 2 === 0 ? -3 : 3),
            },
            {
              autoAlpha: 1,
              x: 0,
              y: 0,
              scale: 1,
              rotation,
              duration: 0.115,
              ease: "power3.out",
            },
            arrival,
          );
          sequence.fromTo(
            card.querySelector(".board-pin"),
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.045, ease: "back.out(1.4)" },
            arrival + 0.07,
          );
        });
      }, board);
    });

    return () => {
      cancelled = true;
      context?.revert();
    };
  }, []);

  return (
    <section ref={boardRef} id="board" className="board" aria-labelledby="board-title">
      <div className="board-stage">
        <div className="board-grid-layer" aria-hidden="true" />
        <header className="board-heading">
          <div>
            <p className="board-index">GOVERNANCE / 24</p>
            <h2 id="board-title">Advisory <span>Board</span></h2>
          </div>
          <div className="board-heading-copy">
            <span>EDITORIAL BOARD · ISCICPS ’27</span>
            <p>As the board holds its place, every perspective joins the system.</p>
          </div>
        </header>

        <div className="board-canvas">
          <div className="board-drafting-meta" aria-hidden="true">
            <span>PINBOARD / REV 01</span>
            <span>24 MEMBERS · 03 REGISTERS</span>
          </div>
          <div className="board-legend" aria-label="Board categories">
            {boardGroups.map((group) => (
              <span className={`board-legend-item board-legend-item--${group.code.toLowerCase()}`} key={group.code}>
                <i aria-hidden="true" />{group.code} · {String(group.members.length).padStart(2, "0")}
              </span>
            ))}
          </div>
          <ol className="board-card-field">
            {pinnedMembers.map((member, index) => <BoardCard member={member} index={index} key={`${member.groupCode}-${member.name}`} />)}
          </ol>
        </div>

      </div>
    </section>
  );
}
