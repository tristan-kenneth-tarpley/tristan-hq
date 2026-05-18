import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");
const ssrTempDir = path.join(root, ".ssr-temp");

// --- Helpers ---

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const data = {};
  for (const line of match[1].split("\n")) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    const key = line.slice(0, colon).trim();
    const val = line.slice(colon + 1).trim().replace(/^["']|["']$/g, "");
    if (key) data[key] = val;
  }
  return data;
}

function esc(str) {
  return (str ?? "").replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function buildHtml(template, appHtml, { title, description }) {
  const fullTitle = title ? `${title} — Tristan HQ` : "Tristan HQ";
  const desc = esc(description ?? "");
  const t = esc(fullTitle);

  const metaTags = [
    `<title>${fullTitle}</title>`,
    `<meta name="description" content="${desc}" />`,
    `<meta property="og:title" content="${t}" />`,
    `<meta property="og:description" content="${desc}" />`,
    `<meta property="og:type" content="article" />`,
    `<meta name="twitter:card" content="summary" />`,
    `<meta name="twitter:title" content="${t}" />`,
    `<meta name="twitter:description" content="${desc}" />`,
  ].join("\n    ");

  return template
    .replace(/<title>[^<]*<\/title>/, "")
    .replace("</head>", `    ${metaTags}\n  </head>`)
    .replace(`<div id="root"></div>`, `<div id="root">${appHtml}</div>`);
}

function writeRoute(html, routePath) {
  const filePath =
    routePath === "/"
      ? path.join(distDir, "index.html")
      : path.join(
          distDir,
          ...routePath.replace(/^\//, "").split("/"),
          "index.html"
        );
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, html, "utf-8");
  console.log(`  ✓  ${routePath}`);
}

// --- Collect essays ---

const essaysDir = path.join(root, "src/essays");
const essays = fs
  .readdirSync(essaysDir)
  .filter((f) => f.endsWith(".md"))
  .map((f) => {
    const raw = fs.readFileSync(path.join(essaysDir, f), "utf-8");
    return { slug: f.replace(".md", ""), ...parseFrontmatter(raw) };
  })
  .sort((a, b) => new Date(b.date ?? 0) - new Date(a.date ?? 0));

// --- Build SSR bundle ---

console.log("\n[prerender] Building SSR bundle...\n");

await build({
  root,
  plugins: [react(), tailwindcss()],
  build: {
    ssr: true,
    rollupOptions: { input: path.join(root, "src/entry-server.tsx") },
    outDir: ssrTempDir,
    emptyOutDir: true,
  },
  logLevel: "warn",
});

// Find the built entry file
const ssrEntry = fs
  .readdirSync(ssrTempDir)
  .find((f) => f.startsWith("entry-server") && (f.endsWith(".js") || f.endsWith(".mjs")));

if (!ssrEntry) throw new Error("SSR build output not found in " + ssrTempDir);

const { render } = await import(path.join(ssrTempDir, ssrEntry));

// --- Render routes ---

const template = fs.readFileSync(path.join(distDir, "index.html"), "utf-8");

const routes = [
  { path: "/", title: null, description: "Home of tinkerings, musings, and happenings." },
  { path: "/essays", title: "Stuff I Wrote", description: "Essays and musings by Tristan Tarpley." },
  ...essays.map((e) => ({ path: `/essays/${e.slug}`, title: e.title, description: e.description })),
];

console.log(`[prerender] Rendering ${routes.length} routes...\n`);

for (const route of routes) {
  const appHtml = await render(route.path);
  writeRoute(buildHtml(template, appHtml, route), route.path);
}

// Cleanup
fs.rmSync(ssrTempDir, { recursive: true, force: true });

console.log(`\n[prerender] Done\n`);
