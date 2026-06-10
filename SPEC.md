# futureBank Website — Full Spec v2

## URL
https://getfuturebank.vercel.app

## Goal
1. Convert students → app downloads
2. Impress investors (Stripe-level quality)
3. Self-serve docs so users don't need support

## Pages (Multi-page)

### / — Home (marketing)
### /features — Full features breakdown
### /security — Security & trust deep-dive
### /docs — Knowledge base (how to use the app)
### /docs/[slug] — Individual doc pages
### /ask — AI chat assistant (answers questions about futureBank)

---

## Design Philosophy
- **NOT generic AI aesthetic** (no random glowing particles for no reason)
- Every animation EXPLAINS the product, not just decorates
- Stripe-level clarity: what it is, who it's for, why trust it — in 5 seconds
- Mobile = app-like (scroll snap, bottom nav, full-screen sections)
- Dark mode only

## Tech Stack
- Next.js 16 App Router
- Tailwind CSS v4
- Three.js + @react-three/fiber + @react-three/drei
- Framer Motion (scroll + micro-animations)
- Vercel AI SDK + backend GraphQL (for /ask page)

---

## HOME PAGE Sections

### 1. Hero (100dvh)
- BIG headline: "Your campus. Your bank."
- Sub: "The financial super-app for African university students."
- 2 CTAs: "Download Free" + "See how it works"
- Three.js: floating 3D phone showing real app UI — balance card, quick actions
- Background: deep navy, subtle animated grid lines (like Linear/Vercel homepage)
- Mobile: phone on top, text below

### 2. Social proof bar
- Scrolling ticker: "Available at UNIMA · MZUNI · Lilongwe University · Polytechnic..."
- Subtle, fast, auto-scroll

### 3. Problem
- "Campus students in Africa deserve real banking tools"
- 3 pain points: No savings account / No credit access / No financial guidance
- Each with a number stat (e.g. "73% of students have no formal bank account")

### 4. Features Bento Grid
- 6 cards, 2 wide
- Hover: border glow, lift, icon animates

### 5. How It Works
- 3 animated steps
- Connecting animated line

### 6. AI Coach Spotlight (NEW — unique differentiator)
- Full-width dark section
- Animated chat bubble demo showing AI coach conversation
- "Ask anything about your finances"

### 7. Security
- "Your money is safe" with 4 security pills

### 8. Founders
- 2 cards with X handles

### 9. Download CTA
- Full screen, big, architecture-detecting buttons

---

## /features PAGE
- Detailed breakdown of every feature
- Each feature: icon, title, description, mini screenshot/mockup

## /security PAGE  
- Deep dive: biometrics, blockchain KYC, certificate pinning, encryption
- Trust badges, compliance info

## /docs PAGE (Knowledge Base)
- Searchable
- Categories: Getting Started, Accounts, Transfers, Loans, AI Coach, Security
- Each doc: markdown rendered, table of contents
- Docs stored in /content/docs/*.md files

## /ask PAGE (AI Assistant)
- Chat interface
- Calls backend: POST /api/ask → proxies to Gemini/Cerebras with futureBank context
- System prompt includes all docs + FAQ
- Suggested questions on load
- "Powered by futureBank AI"

---

## Component Structure
```
app/
  (marketing)/
    page.tsx              — Home
    features/page.tsx
    security/page.tsx
  docs/
    page.tsx              — Docs index
    [slug]/page.tsx       — Individual doc
  ask/
    page.tsx              — AI chat
  api/
    ask/route.ts          — AI proxy endpoint
  components/
    three/PhoneCanvas.tsx
    three/GridBackground.tsx
    ui/Nav.tsx
    ui/Footer.tsx
    ui/BottomBar.tsx      — Mobile sticky CTA
    sections/Hero.tsx
    sections/Problem.tsx
    sections/Features.tsx
    sections/HowItWorks.tsx
    sections/AiSpotlight.tsx
    sections/Security.tsx
    sections/Founders.tsx
    sections/Download.tsx
  lib/
    docs.ts               — Load markdown docs
content/
  docs/
    getting-started.md
    accounts.md
    transfers.md
    loans.md
    ai-coach.md
    security.md
```

## Mobile App-Like Feel
- `scroll-snap-type: y mandatory` on mobile
- Sticky bottom bar: "Download futureBank" always visible on mobile
- Full-screen sections (100dvh)
- No horizontal overflow
- Touch targets ≥ 48px

## Performance
- No external fonts (system stack)
- No images (CSS + Three.js + SVG only)
- Static pages except /ask (needs API)
- Target: <2s load on 3G

## Design Tokens
```css
--navy:        #060D1A
--surface:     #0D1B30
--card:        #122040
--border:      #1E3A5F
--blue:        #1A56DB
--blue-light:  #4D7FE8
--blue-mid:    #0D2F6E
--gold:        #D4A017
--gold-light:  #E8C547
--muted:       #8BA5D4
--subtle:      #4D6B9A
```
