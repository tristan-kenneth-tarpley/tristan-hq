# tristan-hq

Personal site for [Tristan Tarpley](https://tristantarpley.com) — home of tinkerings, musings, and happenings.

## Stack

| Layer | Technology |
|---|---|
| Framework | [Astro 6](https://astro.build) (static site generator) |
| UI | [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) via PostCSS |
| Animations | [Framer Motion](https://www.framer.com/motion) |
| Icons | [Lucide](https://lucide.dev) |
| Analytics | [PostHog](https://posthog.com) |
| Deployment | Static output (Vercel, Netlify, etc.) |

## Site

- **Homepage** — Profile, navigation, and links to educational experiments
- **Essays** — Blog posts in content collections with slug-based routing
- **Educational Lab** — Interactive visualizations of transformer concepts:
  - **Self-Attention** — How transformers compute attention over a single sequence
  - **Attention Lab** — Interactive exploration of the attention mechanism
  - **Ring Attention** — How ring communication enables long-context scaling across GPU nodes

The Ring Attention page uses a dual-mode "story vs. tech" interactive to explain the algorithm through both a narrative metaphor (a mystery at The Manor House) and the actual math (online softmax, KV cache, ring communication).

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Type check
npm run check

# Lint
npm run lint
```

## Project Structure

```
src/
├── components/          # Reusable Astro + React components
│   ├── Navbar, Footer, Profile, SiteNav
│   ├── LabExperiments   # Educational page launcher
│   ├── lab/             # RingAttention, SelfAttention, AttentionLab
│   └── icons/           # LinkedIn, GitHub
├── content/essays/      # Blog posts (MD with frontmatter)
├── pages/               # Astro file-based routing
│   ├── index.astro      # Homepage
│   ├── essays/[slug].   # Dynamic essay pages
│   ├── self-attention.  # Educational page
│   ├── attention.       # Educational page
│   └── ring-attention.  # Educational page
├── layouts/             # BaseLayout
└── constants.ts         # Shared data (story/tech narratives, metaphors)
```

## Content Collections

Essays use Astro's content collections API with a simple schema:

```ts
{
  title: string;
  date: Date;
  description?: string;
}
```

Add new posts by dropping `.md` files into `src/content/essays/`.

## Site

Live at [tristantarpley.com](https://tristantarpley.com)
