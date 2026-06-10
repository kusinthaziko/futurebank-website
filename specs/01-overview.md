# Overview

## Product
futureBank marketing website — converts visitors to app downloads, builds investor trust.

## URL
https://getfuturebank.vercel.app

## Pages
- `/` — Home (marketing)
- `/features` — Full features breakdown
- `/security` — Security & trust deep-dive
- `/docs` — Knowledge base index
- `/docs/[slug]` — Individual doc pages
- `/ask` — AI chat assistant

## Stack
- Next.js 16 (App Router)
- Tailwind CSS v4
- Three.js + @react-three/fiber + @react-three/drei
- Framer Motion
- Vercel AI SDK (for /ask)

## Design Principles
- Mobile-first — feels like an app on phone
- Dark mode only
- Every animation explains the product, not just decorates
- Stripe-level clarity: what it is, who it's for, why trust it — in 5 seconds
- No external fonts, no images — CSS + SVG + Three.js only
- Target load: <2s on 3G
