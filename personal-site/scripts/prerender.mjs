import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const data = {};
  for (const line of match[1].split("\n")) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const val = line
      .slice(colon + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    if (key) data[key] = val;
  }
  return data;
}

function esc(str) {
  return (str ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function injectMeta(template, { title, description }) {
  const fullTitle = title ? `${title} — Tristan HQ` : "Tristan HQ";
  const desc = esc(description ?? "");
  const escapedTitle = esc(fullTitle);

  const metaTags = [
    `<title>${fullTitle}</title>`,
    `<meta name="description" content="${desc}" />`,
    `<meta property="og:title" content="${escapedTitle}" />`,
    `<meta property="og:description" content="${desc}" />`,
    `<meta property="og:type" content="article" />`,
    `<meta name="twitter:card" content="summary" />`,
    `<meta name="twitter:title" content="${escapedTitle}" />`,
    `<meta name="twitter:description" content="${desc}" />`,
  ].join("\n    ");

  // Replace existing <title> and inject OG tags before </head>
  return template
    .replace(/<title>[^<]*<\/title>/, "")
    .replace("</head>", `    ${metaTags}\n  </head>`);
}

function writeRoute(html, routePath) {
  const filePath =
    routePath === "/"
      ? path.join(distDir, "index.html")
      : path.join(distDir, ...routePath.replace(/^\//, "").split("/"), "index.html");
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, html, "utf-8");
  console.log(`  ✓  ${routePath}`);
}

const template = fs.readFileSync(path.join(distDir, "index.html"), "utf-8");

const essaysDir = path.join(root, "src/essays");
const essays = fs
  .readdirSync(essaysDir)
  .filter((f) => f.endsWith(".md"))
  .map((f) => {
    const raw = fs.readFileSync(path.join(essaysDir, f), "utf-8");
    const data = parseFrontmatter(raw);
    return { slug: f.replace(".md", ""), ...data };
  })
  .sort((a, b) => new Date(b.date ?? 0) - new Date(a.date ?? 0));

console.log("\n[prerender] Writing static HTML...\n");

writeRoute(
  injectMeta(template, {
    title: null,
    description: "Home of tinkerings, musings, and happenings.",
  }),
  "/"
);

writeRoute(
  injectMeta(template, {
    title: "Stuff I Wrote",
    description: "Essays and musings by Tristan Tarpley.",
  }),
  "/essays"
);

for (const essay of essays) {
  writeRoute(
    injectMeta(template, {
      title: essay.title,
      description: essay.description,
    }),
    `/essays/${essay.slug}`
  );
}

console.log(`\n[prerender] Done — ${2 + essays.length} routes\n`);
