# Mobile Experience Spec

## Principle
On mobile, the site must feel like a native app — not a scaled-down website.

## Navigation
- Mobile: bottom tab bar (Home, Features, Docs, Ask)
- Desktop: top horizontal nav
- Both: "Download" always visible as primary CTA

## Scroll Behavior
- Mobile: `scroll-snap-type: y mandatory` on home page
- Each section: `scroll-snap-align: start`
- Prevents partial section views

## Sticky Bottom Bar (mobile only)
- Fixed to bottom, full width
- Shows on all pages except /ask
- Content: "Download futureBank" primary button
- Hides when download section is in view
- Height: 72px + safe area inset

## Touch Targets
- All buttons: min 48px height
- Nav items: min 48px tap area
- Cards: entire card is tappable where relevant

## Typography Scaling
- Hero h1: 36px on mobile (clamp)
- Section h2: 28px on mobile
- Body: 15px on mobile

## Three.js on Mobile
- Reduced particle count (60 → 20) for performance
- Phone canvas: 350px height on mobile
- Disable heavy post-processing on mobile

## Gestures
- Swipe up/down: scroll snap between sections
- No horizontal swipe (avoid conflicts with browser gestures)
