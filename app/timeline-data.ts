export type TimelineItem = {
  number: string;
  day: string;
  month: string;
  year: string;
  dateTime: string;
  title: string;
  description: string;
  annotation: string;
  code: string;
};

export const timelineItems: TimelineItem[] = [
  {
    number: "01",
    day: "31",
    month: "OCT",
    year: "2026",
    dateTime: "2026-10-31",
    title: "Paper submission",
    description: "Submit original work and place a new idea into the symposium's shared research record.",
    annotation: "idea enters the system",
    code: "NF3",
  },
  {
    number: "02",
    day: "15",
    month: "NOV",
    year: "2026",
    dateTime: "2026-11-15",
    title: "Acceptance notification",
    description: "Authors receive the programme committee's decision and begin preparing the final paper.",
    annotation: "first signal",
    code: "d6",
  },
  {
    number: "03",
    day: "15",
    month: "JAN",
    year: "2027",
    dateTime: "2027-01-15",
    title: "Registration",
    description: "Confirmed participants complete registration and the symposium community takes shape.",
    annotation: "plans take shape",
    code: "c5",
  },
  {
    number: "04",
    day: "21",
    month: "APR",
    year: "2027",
    dateTime: "2027-04-21",
    title: "Symposium opens",
    description: "Research, systems and people meet at SRMIST for the first day of ISCICPS '27.",
    annotation: "preparing for impact",
    code: "T-03",
  },
  {
    number: "05",
    day: "22",
    month: "APR",
    year: "2027",
    dateTime: "2027-04-22",
    title: "Final symposium day",
    description: "The programme resolves in shared findings, new collaborations and the next set of questions.",
    annotation: "we have arrived",
    code: "Ba4",
  },
];
