# Docs / Knowledge Base Spec

## Purpose
Self-serve documentation so users don't need support.
Also feeds the /ask AI system prompt.

## Content Files
Stored in `/content/docs/*.md` — plain markdown.

### Files
- `getting-started.md` — Registration, KYC, first login
- `accounts.md` — Account types, balance, statements
- `transfers.md` — Send money, limits, fees
- `deposits.md` — How to deposit funds
- `loans.md` — Eligibility, application, repayment
- `ai-coach.md` — What the coach does, how to use it
- `health-score.md` — How the score is calculated
- `challenges.md` — Savings challenges, leaderboard
- `security.md` — Biometrics, KYC, auto-lock
- `faq.md` — Common questions

## /docs Index Page
- Search bar (client-side, searches titles + content)
- Category cards linking to each doc
- "Can't find what you need? Ask AI →" CTA linking to /ask

## /docs/[slug] Page
- Rendered markdown (use `next-mdx-remote` or `remark`)
- Left sidebar: all docs listed, current highlighted
- Right sidebar (desktop): table of contents
- Mobile: sidebar as drawer
- Previous/Next links at bottom

## Frontmatter Format
```md
---
title: Getting Started
description: How to register and set up your futureBank account
category: Getting Started
order: 1
---
```
