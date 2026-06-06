# Library: Design Foundations
> The principles that hold true regardless of which design system is in use. `design-system-architect` consults this library to ground its component-selection and system-composition decisions. Where a design system tells you "what's available," this library tells you "what makes ANY design choice good." The floor below the system.

---

## THE CORE TRUTH

> **Good design is the resolved tension between clarity and emotion.**

Clarity without emotion is sterile (no one wants to act). Emotion without clarity is noise (no one knows what to do). Every design decision is an attempt to hold both at once — make the path obvious AND make the experience feel like something.

The 8 foundations below are the levers. Most "bad design" is one foundation being violated. Most "great design" is several foundations working in tension on purpose.

---

## FOUNDATION 1 — HIERARCHY

> **What the viewer must understand first must be visually loudest. Period.**

Everything else flows from this. If the hero promise isn't the visually loudest element on the page, the buyer's eye lands somewhere else and the message is lost.

Hierarchy is created by:
- **Size** — biggest = most important
- **Weight** — bold/heavy = more important
- **Colour** — saturated/contrasted = more important
- **Position** — top-left and centre attract first attention (in left-to-right languages)
- **White space** — isolation amplifies importance (a single line surrounded by whitespace dominates)

**The hierarchy test:** Squint at the design. The element you can still read clearly is the dominant one. Is that the element you WANTED to dominate?

**Common violations:**
- All-bold treatment (nothing is bold if everything is)
- Multiple competing CTAs at equal weight
- Logo/menu attention-grabbing when the offer should
- Decorative imagery louder than the headline

---

## FOUNDATION 2 — TYPE

> **Type is the voice of the brand in shape form. It says more before the words are read than the words say after.**

### Typeface choice signals tone

| Vibe | Typical typeface family |
|------|-------------------------|
| Authoritative, established | Serif (transitional or modern serif) — e.g., Times, Garamond, Tiempos |
| Modern, neutral, scalable | Sans serif (grotesque or geometric) — Inter, Helvetica, Geist |
| Editorial, sophisticated | Old-style or transitional serif — e.g., Mercury, Caslon |
| Friendly, approachable | Humanist sans — Avenir, Source Sans, Inter |
| Tech-forward, startup | Geometric or mono — Geist, Söhne, JetBrains Mono |
| Premium, refined | Display serif or carefully kerned humanist sans |
| Playful, consumer | Rounded sans — Nunito, Quicksand |

### Hierarchy through type

- **Body:** 16–18px web, 14pt print. Line height 1.4–1.6. Line length 50–80 chars.
- **H1:** 2.5–4× body size. Tight line height (1.0–1.2). Used ONCE per page/asset.
- **H2:** 1.5–2× body size.
- **H3:** 1.15–1.3× body size.
- **Captions / metadata:** 0.75–0.85× body.

### Type rules that hold across systems

- One serif + one sans = readable system. Two serifs or two sans require expert pairing.
- Maximum 3 weights in a single layout (e.g., regular + medium + bold). More = visual noise.
- Letter-spacing (tracking) tightens for display (-2% to -5% at H1 sizes), opens slightly for caps (+5% to +10%).
- Avoid centered body text. Centered headlines are fine; centered paragraphs are unreadable past 2 lines.

---

## FOUNDATION 3 — COLOUR

> **Colour is meaning, not decoration. Every colour decision tells the buyer something — make sure it's telling them the right thing.**

### Functional colour roles

Every design system needs these roles defined:

- **Primary brand colour** — the carrier of brand identity
- **Action colour** — used ONLY for clickable elements (CTAs, links). If your action colour appears on a non-clickable element, the user is being lied to.
- **Surface colour** — backgrounds, cards, neutral space
- **Text colour** — primary body text + secondary (lighter) variants
- **Status colours** — success (green), warning (amber), error (red), info (blue) — leave room for accessibility variants
- **Accent / highlight** — used sparingly for visual interest

### Contrast for accessibility (WCAG 2.1)

- **Normal text on background:** 4.5:1 minimum contrast ratio
- **Large text (24px+ or 18px+ bold):** 3:1 minimum
- **UI elements / icons:** 3:1 minimum

If a colour pair fails contrast, the design fails accessibility regardless of how it looks.

### Colour psychology (rough heuristics, not law)

| Colour family | Common emotional associations (Western/global commerce defaults) |
|---------------|-----------------------------------------------------------------|
| Blue | Trust, calm, professionalism, institutional |
| Green | Growth, money, health, go |
| Red | Urgency, energy, alarm, appetite |
| Yellow | Attention, optimism, caution |
| Orange | Friendliness, energy, value |
| Purple | Premium, creative, transformative |
| Black | Luxury, gravity, sophistication |
| White | Cleanliness, simplicity, premium minimalism |
| Pink | Approachable, feminine-coded (handle carefully), playful |
| Brown / Earth | Organic, grounded, heritage |

These are starting points, not rules. Brand context, cultural context, and category context override the defaults.

### Palette structure

A workable palette has:
- 1 primary brand colour
- 1 action / accent colour (distinct from primary)
- 1 neutral family (5–7 shades from near-white to near-black)
- 4 status colours
- Total ≤ 12 named colours. More than 12 = systemic decay.

---

## FOUNDATION 4 — SPACING

> **White space isn't empty space. It's the breathing room that makes the rest of the design legible.**

### The spacing scale

Use a consistent geometric scale. The most common:

- **4-point grid:** 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128
- **8-point grid:** 8 / 16 / 24 / 32 / 48 / 64 / 96 / 128 (simpler, less granular)

Pick one. Stick to it. Spacing that doesn't fit the scale is the most common reason a design feels "off" without anyone being able to say why.

### Spacing rules

- **Related elements are closer together than unrelated ones.** This is the Gestalt proximity principle and it does more for clarity than any other single rule.
- **Vertical rhythm:** body text uses consistent line height; section spacing is a multiple of body line height.
- **Above-the-fold breathing room:** ~120–200px of whitespace below the hero headline before the next element. Crowded heroes underperform.
- **Card padding:** match internal padding to the card's hierarchy weight. Hero card: 48–64px. Standard card: 24–32px. Compact: 12–16px.

---

## FOUNDATION 5 — GRID & ALIGNMENT

> **Alignment is invisible. Misalignment is loud.**

Every element on a page should align to something. Random horizontal positions create subconscious noise.

### Grids that hold up

- **12-column grid** — standard for marketing pages. Allows 1, 2, 3, 4, 6, 12-column layouts.
- **8-column grid** — narrower, used for editorial.
- **4-column mobile grid** — required for mobile.
- **Off-grid usage:** breaking the grid intentionally (one element offset) is a strong design move. Breaking it accidentally is sloppiness.

### Alignment rules

- Left-align body text (centred body is unreadable beyond 2 lines)
- Centred display text is fine for hero headlines, taglines, callouts
- Mixed-alignment within a single screen = chaos. Pick one alignment per section.

---

## FOUNDATION 6 — IMAGERY & VISUAL REGISTER

> **The first emotion a buyer feels comes from the imagery, before any word is read.**

### Photography registers (pick one per campaign)

- **Editorial / cinematic** — narrow depth of field, dramatic lighting, restrained composition. Premium, gravity.
- **Documentary / candid** — natural light, real environments, unposed people. Trust, authenticity.
- **Product-isolated** — clean background, controlled lighting, focus on the object. Modern, considered.
- **Lifestyle** — staged but feeling natural, people using product. Aspirational, approachable.
- **Brutalist / raw** — high contrast, harsh lighting, intentional roughness. Direct, contrarian.
- **Hand-shot / phone-shot** — looks like a user took it. UGC aesthetic. Trust, native-feeling.

**Mixing registers within one campaign = visual confusion.** Pick one register. Stick to it.

### Illustration vs. photography

- **Photography** carries truth-claims. Use when the buyer needs to believe a result is real.
- **Illustration** carries metaphor and explanation. Use when the concept is abstract or the photographic version would be boring/cliché.
- Many brands use BOTH but for different purposes (photography for testimonials, illustration for concepts).

### Image quality minimums

- Web hero images: 2400px wide at minimum (for Retina displays)
- Compress to ≤200kb for hero, ≤80kb for inline
- Use WebP or AVIF for modern browsers; fall back to JPEG
- Always provide 2× and 3× versions for Retina

---

## FOUNDATION 7 — MOTION

> **Motion guides attention and reinforces meaning. Used badly, it's a tax on every interaction.**

### Motion principles

- **Easing:** never use linear easing. ease-out for entrances, ease-in for exits, ease-in-out for two-state transitions.
- **Duration:** 150–300ms for most UI feedback. 400–700ms for hero animations. Anything over 1s should serve a story beat, not a transition.
- **Purpose:** every motion should answer a question for the user (where did this come from? where did it go? is this connected to that?). Decorative motion is friction.
- **Reduced motion:** respect `prefers-reduced-motion` system setting. Many users disable motion for medical reasons.

### Motion in ads

- Open frame of any video should make sense as a static image. Not all viewers see the motion.
- Critical text appears in frame 1, not via reveal animation. Reveals delay the hook.
- Motion graphics should reinforce the spoken word, not compete with it.

---

## FOUNDATION 8 — ACCESSIBILITY

> **A design that excludes users from acting on it is a broken design, regardless of how it looks.**

### Accessibility floor (non-negotiable)

- Colour contrast meets WCAG AA (see Foundation 3)
- All interactive elements have visible focus states
- All images have alt text (or are explicitly marked decorative)
- Form fields have visible labels (not placeholder-only)
- Touch targets ≥44×44px on mobile
- No information conveyed by colour alone (use icon + colour, or text + colour)
- Page is keyboard-navigable (tab order makes sense)
- Headings used semantically (H1, H2, H3 — not styled divs)

### Why this matters beyond ethics

- Accessibility = SEO. Search engines reward accessible structure.
- Accessibility = conversion. Confusing forms convert worse for everyone, not just people using assistive tech.
- Accessibility = legal. ADA / EAA / equivalent regional regulations are increasingly enforced.

---

## THE 8-POINT DESIGN AUDIT

For any design output, score each foundation:

```
1. HIERARCHY:           [✓ honoured / ⚠ inconsistent / ✗ violated]
2. TYPE:                [...]
3. COLOUR:              [...]
4. SPACING:             [...]
5. GRID / ALIGNMENT:    [...]
6. IMAGERY / REGISTER:  [...]
7. MOTION:              [...] (N/A for static)
8. ACCESSIBILITY:       [...]

Overall: [✓ ship / ⚠ revise / ✗ rebuild]
Specific notes: [...]
```

3 or more ⚠ = revise. Any ✗ on hierarchy or accessibility = rebuild.

---

## DOWNSTREAM SKILL INTEGRATION

This library is consumed by:
- **design-system-architect** — uses foundations to vet candidate design systems and to compose components from multiple systems
- **creative-interrogator** — Phase 6 (Art Direction Audit) uses these foundations as the rubric
- **cinematic-prompt-architect** — Visual prompts honour the chosen register from Foundation 6
- **lp-copy-generator** — LP structure decisions respect hierarchy and spacing rules
- **library-art-direction** — pairs with this library; library-art-direction is the campaign-level creative philosophy, library-design-foundations is the per-asset craft floor

---

> **First principle:** Design systems give you components. These foundations tell you whether the components are being used well. Any campaign produced from this pipeline should pass the 8-point audit before shipping. If it doesn't, fix the foundation that's failing — don't add more polish on top of broken fundamentals.
