import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

// Tailwind v4 is wired via PostCSS (postcss.config.mjs) because
// @tailwindcss/vite is incompatible with Astro 6's bundled rolldown-vite.
// See: https://github.com/withastro/astro/issues/16542
// https://astro.build/config
export default defineConfig({
  site: "https://tristantarpley.com",
  output: "static",
  integrations: [react(), sitemap()],
});
