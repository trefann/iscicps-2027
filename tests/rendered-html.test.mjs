import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("https://iscicps.in/", {
      headers: { accept: "text/html", host: "iscicps.in" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the refined editorial ISCICPS experience", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>ISCICPS &#x27;27 .* Computational Intelligence for Cyber-Physical Systems<\/title>/i);
  assert.match(html, /COMPUTATIONAL/);
  assert.match(html, /INTELLIGENCE/);
  assert.match(html, /CYBER-PHYSICAL/);
  assert.match(html, /21.*22/);
  assert.match(html, /APRIL 2027/);
  assert.match(html, /INTELLIGENCE[\s\S]*MEETS[\s\S]*PHYSICAL[\s\S]*SYSTEMS/);
  assert.match(html, /THE PHYSICAL[\s\S]*WORLD/);
  assert.match(html, /BECOMES[\s\S]*COMPUTATIONAL/);
  assert.match(html, /RESEARCH[\s\S]*FIELDS/);
  assert.match(html, /Edge AI &amp; Embedded Intelligence/);
  assert.match(html, /Autonomous Systems &amp; Robotics/);
  assert.match(html, /Smart Energy &amp; Industrial Infrastructure/);
  assert.match(html, /Security, Privacy &amp; Resilience in CPS/);
  assert.match(html, /Trustworthy &amp; Explainable AI for Physical Systems/);
  assert.match(html, /EXPLORE TRACK/);
  assert.match(html, /Computational intelligence operating close to the physical processes it observes/);
  assert.doesNotMatch(html, /WHY IT MATTERS/);
  assert.doesNotMatch(html, /EXAMPLES \/ APPLICATIONS/);
  assert.match(html, /IMPORTANT DATES/);
  assert.match(html, /KATTAN/);
  assert.match(html, /SUBMIT[\s\S]*YOUR[\s\S]*RESEARCH/);
  assert.match(html, /SUBMIT PAPER/);
  assert.match(html, /REGISTER/);
  assert.match(html, /href="https:\/\/cmt3\.research\.microsoft\.com\/"/);
  assert.match(html, /href="mailto:ieeescicps@gmail\.com"/);
  assert.match(html, /<meta name="twitter:card" content="summary_large_image"\/>/);
  assert.match(html, /<meta property="og:image" content="https:\/\/iscicps\.in\/og\.png"\/>/);
  assert.doesNotMatch(html, /Where intelligence leaves/i);
  assert.doesNotMatch(html, /Scroll to enter/i);
  assert.doesNotMatch(html, /THE SYSTEM NEEDS YOUR QUESTION/i);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/);
});

test("keeps motion, imagery and accessibility intentional", async () => {
  const [experience, css, page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/symposium-experience.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(experience, /className=\{`loader/);
  assert.match(experience, /ISCICPS_BOOT/);
  assert.match(experience, /className="custom-cursor"/);
  assert.match(experience, /className=\{`nav-control/);
  assert.match(experience, /className="nav-layer"/);
  assert.match(experience, /className="menu-trigger"/);
  assert.match(experience, /aria-label=\{menuOpen \? "Close navigation" : "Open navigation"\}/);
  assert.match(experience, /className="menu-link-frame"/);
  assert.match(experience, /className="hero-visual"/);
  assert.match(experience, /className="hero-image hero-image-negative"/);
  assert.match(experience, /className="global-host"/);
  assert.match(experience, /srm-seal\.png/);
  assert.match(experience, /className={`track-card/);
  assert.match(experience, /className="track-dialog"/);
  assert.match(experience, /className="footer-reveal"/);
  assert.match(experience, /KEY RESEARCH AREAS/);
  assert.match(experience, /WHY IT MATTERS/);
  assert.match(experience, /data-cursor=/);
  assert.match(experience, /srm-campus-aerial\.jpg/);
  assert.match(experience, /srm-auditorium-1920\.jpg/);
  assert.match(experience, /srm-research-day\.webp/);
  assert.match(experience, /edge-ai\.webp/);
  assert.match(experience, /autonomous-systems\.webp/);
  assert.match(experience, /smart-energy\.webp/);
  assert.match(experience, /security-resilience\.webp/);
  assert.match(experience, /trustworthy-ai\.webp/);
  assert.match(experience, /import\("gsap"\)/);
  assert.match(experience, /import\("gsap\/ScrollTrigger"\)/);
  assert.match(experience, /prefers-reduced-motion: reduce/);
  assert.match(experience, /aria-current=\{navSection === id/);
  assert.match(experience, /className="skip-link"/);
  assert.match(css, /--black: #050505/);
  assert.match(css, /--navy: #080b2f/);
  assert.match(css, /--white: #f4f4f0/);
  assert.match(css, /--blue: #6674ff/);
  assert.match(css, /--cyan: #4cc9f0/);
  assert.doesNotMatch(css, /--dark-blue|mobile-menu/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /@media \(max-width: 800px\)/);
  assert.match(css, /@media \(max-width: 540px\)/);
  assert.doesNotMatch(css, /#[fF][fF]4[5-9]00|#[eE][fF][4-9]4[4-9]4[4-9]/);
  assert.match(page, /SymposiumExperience/);
  assert.match(layout, /Space_Grotesk/);
  assert.match(layout, /og\.png/);
  assert.match(packageJson, /"gsap": "\^3\.13\.0"/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await access(new URL("../public/og.png", import.meta.url));
  await access(new URL("../public/images/srm-campus-aerial.jpg", import.meta.url));
  await access(new URL("../public/images/srm-seal.png", import.meta.url));
  await access(new URL("../public/images/srm-auditorium-1920.jpg", import.meta.url));
  await access(new URL("../public/images/srm-research-day.webp", import.meta.url));
  await access(new URL("../public/images/tracks/edge-ai.webp", import.meta.url));
  await access(new URL("../public/images/tracks/autonomous-systems.webp", import.meta.url));
  await access(new URL("../public/images/tracks/smart-energy.webp", import.meta.url));
  await access(new URL("../public/images/tracks/security-resilience.webp", import.meta.url));
  await access(new URL("../public/images/tracks/trustworthy-ai.webp", import.meta.url));
});
