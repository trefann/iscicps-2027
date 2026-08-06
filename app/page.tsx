import type { Metadata } from "next";
import { SymposiumExperience } from "./symposium-experience";

export const metadata: Metadata = {
  title: { absolute: "ISCICPS '27 — Computational Intelligence for Cyber-Physical Systems" },
  description:
    "International Symposium on Computational Intelligence for Cyber-Physical Systems, 21–22 April 2027 at SRMIST, Kattankulathur.",
};

export default function Home() {
  return <SymposiumExperience />;
}
