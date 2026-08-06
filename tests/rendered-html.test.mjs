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

test("server-renders the finished ISCICPS experience", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>ISCICPS &#x27;27 — Computational Intelligence for Cyber-Physical Systems<\/title>/i);
  assert.match(html, /COMPUTATIONAL/);
  assert.match(html, /INTELLIGENCE/);
  assert.match(html, /PHYSICAL SYSTEMS/);
  assert.match(html, /21—22/);
  assert.match(html, /APRIL 2027/);
  assert.match(html, /THE ROAD TO ISCICPS/);
  assert.match(html, /RESEARCH UNIVERSE/);
  assert.match(html, /Trustworthy &amp; Explainable AI/);
  assert.match(html, /href="https:\/\/cmt3\.research\.microsoft\.com\/"/);
  assert.match(html, /href="mailto:ieeescicps@gmail\.com"/);
  assert.match(html, /<meta name="twitter:card" content="summary_large_image"\/>/);
  assert.match(html, /<meta property="og:image" content="https:\/\/iscicps\.in\/og\.png"\/>/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/);
});

test("keeps motion, interaction and accessibility behavior intentional", async () => {
  const [experience, css, page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/symposium-experience.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(experience, /<canvas ref=\{canvasRef\}/);
  assert.match(experience, /import\("gsap"\)/);
  assert.match(experience, /import\("gsap\/ScrollTrigger"\)/);
  assert.match(experience, /prefers-reduced-motion: reduce/);
  assert.match(experience, /aria-pressed=\{activeArea === area\.id\}/);
  assert.match(experience, /aria-expanded=\{activeTrack === index\}/);
  assert.match(experience, /className="skip-link"/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /@media \(max-width: 760px\)/);
  assert.match(page, /SymposiumExperience/);
  assert.match(layout, /og\.png/);
  assert.match(packageJson, /"gsap": "\^3\.13\.0"/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await access(new URL("../public/og.png", import.meta.url));
});
