# Pages Spec

## / — Home
Sections in order:
1. Hero — 3D phone, headline, CTAs
2. SocialProof — auto-scrolling university names ticker
3. Problem — 3 pain points with stats
4. Features — bento grid (6 cards)
5. HowItWorks — 3 animated steps
6. AiSpotlight — animated AI coach chat demo
7. Security — 4 security badges
8. Founders — Timothy + Redson cards with X handles
9. Download — architecture-detecting APK buttons

## /features
- Detailed breakdown of every feature
- Hero: title + sub
- Grid of feature cards (icon, title, description, visual)
- Features: Transfers, Savings, Loans, AI Coach, Health Score, Challenges, Social Groups, KYC

## /security
- Hero: "Your money is safe."
- 4 sections: Biometric Auth, Blockchain KYC, Certificate Pinning, Screenshot Prevention
- Each: how it works, why it matters
- Trust statement at bottom

## /docs
- Search bar at top
- Category grid: Getting Started, Accounts, Transfers, Loans, AI Coach, Security, FAQ
- Each category links to individual docs

## /docs/[slug]
- Sidebar with all docs listed
- Main content: rendered markdown
- Table of contents (right sidebar on desktop)
- Previous/Next navigation

## /ask
- Chat interface (full height)
- Suggested questions on load:
  - "How do I register?"
  - "How do transfers work?"
  - "How does the AI coach help me?"
  - "Is my money safe?"
- Input at bottom
- Messages stream from API
- "Powered by futureBank AI" footer
- Calls POST /api/ask → backend Gemini
