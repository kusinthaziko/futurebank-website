# Component Architecture

## Folder Structure
```
app/
  (marketing)/
    page.tsx                — / home
    features/page.tsx       — /features
    security/page.tsx       — /security
  docs/
    page.tsx                — /docs index
    [slug]/page.tsx         — /docs/[slug]
  ask/
    page.tsx                — /ask AI chat
  api/
    ask/route.ts            — AI proxy endpoint
  components/
    three/
      PhoneCanvas.tsx       — 3D animated phone
      GridBackground.tsx    — animated grid lines
    ui/
      Nav.tsx               — top navigation
      Footer.tsx            — site footer
      BottomBar.tsx         — mobile sticky CTA
    sections/
      Hero.tsx
      SocialProof.tsx       — scrolling university ticker
      Problem.tsx
      Features.tsx          — bento grid
      HowItWorks.tsx
      AiSpotlight.tsx       — animated AI coach demo
      Security.tsx
      Founders.tsx
      Download.tsx
    docs/
      DocLayout.tsx         — sidebar + content
      DocSearch.tsx         — search input
      TableOfContents.tsx
  lib/
    docs.ts                 — load and parse markdown
    ai.ts                   — AI chat helpers
  content/
    docs/
      getting-started.md
      accounts.md
      transfers.md
      loans.md
      ai-coach.md
      security.md
      faq.md
globals.css
layout.tsx
```

## Rules
- Every section = its own component file
- No component file > 150 lines
- Three.js components always `"use client"` + dynamic import with `ssr: false`
- Framer Motion variants defined at top of each file
- No inline styles except CSS variables
