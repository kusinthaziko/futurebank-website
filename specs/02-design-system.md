# Design System

## Color Tokens
```css
--navy:       #060D1A  /* page background */
--surface:    #0D1B30  /* section backgrounds */
--card:       #122040  /* cards */
--border:     #1E3A5F  /* borders */
--blue:       #1A56DB  /* primary */
--blue-light: #4D7FE8  /* primary hover */
--blue-mid:   #0D2F6E  /* gradient start */
--gold:       #D4A017  /* accent */
--gold-light: #E8C547  /* accent hover */
--muted:      #8BA5D4  /* secondary text */
--subtle:     #4D6B9A  /* tertiary text */
```

## Typography
- Font: System stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui`)
- No Google Fonts (performance on campus WiFi)
- Hero h1: clamp(36px, 8vw, 72px), weight 800, tracking -2px
- Section h2: clamp(28px, 5vw, 48px), weight 800, tracking -1px
- Body: 16px, weight 400, line-height 1.6

## Spacing
- Section padding: 80px top/bottom desktop, 48px mobile
- Max content width: 1100px
- Card padding: 28px desktop, 20px mobile

## Border Radius
- Cards: 24px
- Buttons: 50px (pill)
- Icons: 14px
- Badges: 50px (pill)

## Shadows
- Card glow: `0 0 0 1px var(--border), 0 8px 32px rgba(0,0,0,0.4)`
- Blue glow: `0 8px 32px rgba(26,86,219,0.4)`
- Gold glow: `0 4px 20px rgba(212,160,23,0.3)`

## Animations
- Fade up on scroll: `opacity 0 → 1, translateY 32px → 0, duration 0.6s`
- Button press: `scale(0.97)`, transition 100ms
- Button hover: `translateY(-2px)`, glow intensifies
- 3D phone: floating loop, 4s ease-in-out
- Grid background: slow pan, opacity 0.15
