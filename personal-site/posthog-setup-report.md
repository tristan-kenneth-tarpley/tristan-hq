<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your React Router v7 personal site. Here's a summary of all changes made:

**PostHog initialized** in `src/main.tsx` with `posthog-js` + `@posthog/react`, wrapping `RouterProvider` with `PostHogProvider`. Environment variables `VITE_PUBLIC_POSTHOG_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` are read from `.env`.

**Error boundary** added via `src/RootErrorBoundary.tsx`, wired to the root route in `src/App.tsx`. Unhandled route errors are automatically captured with `posthog.captureException()`.

**9 custom events** instrumented across 6 files, covering the full user journey from home page through interactive labs and essays.

| Event | Description | File |
|---|---|---|
| `lab_experiment_clicked` | User clicked a lab experiment card (Attention Lab or Essays) from the Home page | `src/components/LabExperiments.tsx` |
| `social_link_clicked` | User clicked a social link (LinkedIn or GitHub) from the Profile section | `src/components/Profile.tsx` |
| `essay_clicked` | User clicked on an essay from the Essays listing page | `src/pages/Essays.tsx` |
| `attention_experiment_selected` | User clicked on a specific attention experiment card (Self Attention or Ring Attention) | `src/pages/AttentionLab.tsx` |
| `visualizer_started` | User pressed play to start the Ring Attention or Self Attention visualizer | `src/components/Navbar.tsx` |
| `visualizer_mode_changed` | User toggled between Story and Tech mode in a visualizer | `src/components/Navbar.tsx` |
| `sequence_length_changed` | User adjusted the sequence length slider in a visualizer | `src/components/Navbar.tsx` |
| `network_overlap_toggled` | User toggled between Overlap Enabled and Sequential Pass in Ring Attention | `src/pages/RingAttention.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/1604026)
- [Content Discovery Funnel](/insights/u6NKlLOF) — Conversion from home page → experiment selection → visualizer play
- [Top Essays by Clicks](/insights/g4HzEiov) — Which essays are most popular, broken down by title
- [Social Link Clicks by Platform](/insights/uOtOejWi) — LinkedIn vs GitHub clicks from the profile section
- [Visualizer Play Rate Over Time](/insights/OHKr5SmA) — How often users engage with the interactive visualizers
- [Home Page CTA Clicks](/insights/vtjlbgyd) — Attention Lab vs Essays card clicks from home

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
