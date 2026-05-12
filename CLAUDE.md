# CLAUDE.MD — CodeWatch Design & Brand System
**Version 1.0 | One-page cinematic scroll experience**

---

## 1. The Product in One Line

CodeWatch is the AI-powered code quality layer for the vibe-coding era — a multi-specialist review engine that catches what your AI code generator misses, before it reaches production.

It is simultaneously:
- A **security fortress** (vulnerability detection, silent failure scanning)
- A **quality intelligence layer** (production-grade humanisation of AI-generated code)
- A **developer co-pilot** (specialist reviewers running in parallel)
- A **code autopsy tool** (finds what's broken and why, with business context)

The brand does not choose one angle. It holds all four. The website communicates mastery through restraint.

---

## 2. Brand Philosophy

**The core tension CodeWatch resolves:**
Founders and developers are building faster than ever using AI. But speed without oversight creates invisible debt. CodeWatch is the oversight layer — calm, intelligent, authoritative. It does not panic. It watches.

**Brand personality:**
- Calm authority, not aggression
- Precision over noise
- Clinical intelligence with a human edge
- Feels like the smartest person in the room — who never raises their voice

**What this is NOT:**
- Not a security product that screams danger (no red sirens, no hackathon aesthetic)
- Not another dark-mode AI tool
- Not generic SaaS beige
- Not loud or flashy

**One-word brand truth:** WATCHFUL

---

## 3. Logo System

### Concept: The Eye of the Commit
The logomark is an abstract "eye" composed of two arcs forming an aperture shape, with a small geometric diamond (◆) at the centre — referencing both a camera aperture (watchful, focused) and a code diff marker (the `<>` of review).

```
   ╭──────╮
  ╱    ◆   ╲
 ╲           ╱
  ╰──────────╯
```

**Construction:**
- Two mirror-curved strokes forming a lens/eye shape
- Filled diamond centred inside — acts as the "pupil" and references `<>` brackets
- Stroke weight: 1.5px, slightly heavier than typical to convey weight and permanence
- The diamond can subtly animate (scale pulse: 1.0 → 1.08 → 1.0) on hover

**Wordmark:**
- Typeface: **Instrument Serif** (italic) for "Code" + **DM Sans** (500 weight, tracked +0.02em) for "Watch"
- "Code" in serif italic = the human craft of writing code
- "Watch" in clean sans = the mechanical, watchful intelligence
- The contrast between the two weights/styles IS the brand story

**Full lockup:**
```
[aperture mark]  Code Watch
```

**Minimum size:** 24px mark height

**Logo variations:**
1. Full horizontal lockup (default)
2. Mark only (favicons, loading states, app icon)
3. Stacked (mark above wordmark) — for square contexts

---

## 4. Color System

### Philosophy
No black background. No purple gradient on white (the most overused AI palette alive). Instead: **warm off-white base with deep ink tones** — like a premium editorial publication that happens to be a dev tool. Think: the Financial Times meets Linear.

### Core Palette

```
BACKGROUND SYSTEM
─────────────────────────────────────────────────────
--cw-bg-primary:      #F5F2EE   /* warm parchment — the base */
--cw-bg-secondary:    #EDE9E3   /* subtle section differentiation */
--cw-bg-surface:      #FDFAF7   /* cards, elevated elements */
--cw-bg-ink:          #1A1714   /* near-black, warm undertone — not cold */

BRAND TONES
─────────────────────────────────────────────────────
--cw-ink-primary:     #1A1714   /* main text, headings */
--cw-ink-secondary:   #4A4540   /* body text */
--cw-ink-tertiary:    #8C8580   /* muted labels, captions */

ACCENT — EMBER
─────────────────────────────────────────────────────
--cw-ember:           #C8440A   /* primary accent — a deep, rich red-orange */
--cw-ember-light:     #F0EAE5   /* ember tint backgrounds */
--cw-ember-glow:      rgba(200, 68, 10, 0.12) /* glow for highlights */

ACCENT — SIGNAL
─────────────────────────────────────────────────────
--cw-signal-critical: #C8440A   /* HIGH severity vulnerabilities */
--cw-signal-warn:     #B07A20   /* MEDIUM severity */
--cw-signal-pass:     #2A6B3C   /* PASS / clean checks */
--cw-signal-info:     #2060A0   /* info / LOW severity */

SPECIALIST REVIEWER COLOURS (for UI pill tags)
─────────────────────────────────────────────────────
--cw-security:        #C8440A   /* Security reviewer */
--cw-reliability:     #2060A0   /* Reliability reviewer */
--cw-performance:     #7040B0   /* Performance reviewer */
--cw-quality:         #2A6B3C   /* Quality reviewer */
--cw-logic:           #B07A20   /* Business Logic reviewer */
```

### Usage Rules
- Background is always warm, never pure white (#FFFFFF) or pure black
- Ember accent is used sparingly — CTAs, the logomark, active states, critical alerts
- Body text is always `--cw-ink-secondary`, never pure black
- Severity colours mirror a physical sense of heat: red = hot = critical, blue = cold = informational
- No purple in the product UI (reserved for Performance reviewer only, very limited use)

---

## 5. Typography

### Type System

**Display / Hero Headlines**
- Font: **Instrument Serif** (Italic variant for impact)
- Sizes: 72px (hero), 52px (section), 36px (sub-section)
- Weight: 400 (the italic does the work)
- Color: `--cw-ink-primary`
- Usage: "Your code doesn't break in the IDE. It breaks in production."

**Body / UI**
- Font: **DM Sans**
- Sizes: 18px (lead), 16px (body), 14px (UI), 12px (labels)
- Weight: 400 (body), 500 (emphasis), 600 (UI labels only)
- Tracking: 0 (normal), +0.04em (all-caps labels)
- Color: `--cw-ink-secondary`

**Code / Terminal**
- Font: **JetBrains Mono**
- Sizes: 13px (inline), 12px (code blocks)
- Color: `--cw-ink-secondary` on `--cw-bg-ink` surface
- Usage: vulnerability annotations, code diff overlays, reviewer output

**Pairing rationale:**
Instrument Serif (italic) gives humanity and provocation to the big statements. DM Sans gives clarity and professionalism to everything functional. JetBrains Mono grounds the product in actual code, never losing its technical identity.

### Type Scale
```
--type-hero:    clamp(48px, 6vw, 80px)  / Instrument Serif Italic
--type-h1:      clamp(36px, 4vw, 56px)  / Instrument Serif Italic
--type-h2:      clamp(28px, 3vw, 42px)  / Instrument Serif Italic
--type-h3:      20px                    / DM Sans 600
--type-lead:    18px                    / DM Sans 400
--type-body:    16px                    / DM Sans 400
--type-ui:      14px                    / DM Sans 500
--type-label:   12px                    / DM Sans 600, tracking +0.06em, uppercase
--type-code:    13px                    / JetBrains Mono
```

---

## 6. Motion & Animation Principles

This is where CodeWatch separates from every generic AI SaaS. The animation vocabulary must feel:
- **Deliberate** — nothing moves without a reason
- **Precise** — like a scalpel, not a paintbrush
- **Surgical** — revealing information, never decorating it

### Motion Tokens
```
--ease-out-expo:    cubic-bezier(0.16, 1, 0.3, 1)   /* most transitions */
--ease-in-out:      cubic-bezier(0.65, 0, 0.35, 1)  /* state changes */
--ease-spring:      cubic-bezier(0.34, 1.56, 0.64, 1) /* hover pops */

--duration-instant: 100ms   /* micro: checkbox, toggle */
--duration-fast:    200ms   /* hover states, button feedback */
--duration-medium:  400ms   /* panel reveals, accordion */
--duration-slow:    700ms   /* page transitions, hero entrance */
--duration-cinematic: 1200ms /* scroll-triggered section reveals */
```

### Animation Techniques by Section

**Hero Section**
- Technique: Lenis smooth scroll + GSAP ScrollTrigger
- Headline words animate in with a clip-path reveal (from bottom, staggered 60ms per word)
- Background: animated SVG mesh of thin grid lines (like a code graph paper) that slowly drift — canvas-based, very subtle
- The aperture logo mark does a single rotation from 0° to 360° on load (800ms, ease-out-expo), then rests
- CTA button has a contained "pulse" border animation on idle (not glow — a precise 1px border that travels around the perimeter)

**Code Review Visualiser (Product Demo Section)**
- The centrepiece of the page — a "live" code review animation
- Uses WebGL (Three.js or raw WebGL canvas) for:
  - A floating 3D code panel (tilted ~15° in perspective)
  - Annotation lines that "draw themselves" from left to right onto specific code lines
  - Severity pill tags that pop in with a spring scale animation
  - The panel has a subtle depth-of-field blur at the edges
- Five specialist reviewers animate in sequentially (Security → Reliability → Logic → Performance → Quality), each revealing their findings like a typewriter but instant (not character-by-character — full line reveals with 0ms delay but staggered by 200ms)

**Stats / Social Proof Section**
- Large counter numbers count up when scrolled into view (GSAP CountTo)
- The count animation eases out — fast start, slow finish — the opposite of a clock

**Features Grid**
- Cards appear on scroll with a staggered clip-path reveal (from bottom)
- On hover: card lifts 4px (translateY), border transitions from `--cw-bg-secondary` to `--cw-ember-glow`, and a faint ember-tinted shadow appears
- No generic scale effects — movement is vertical only

**Scrollytelling Section (How It Works)**
- Lenis-driven sticky panel with content that changes as user scrolls
- Three states: Submit code → Specialists analyse → Report delivered
- Each state transition uses a crossfade + upward slide (200ms)
- The code window on the right updates in sync with the left panel text

**Footer**
- Simple fade-up reveal
- The aperture mark in the footer subtly rotates on hover (15° turn, spring ease)

### Scroll Behaviour
- Lenis (smooth scroll) throughout — target scroll speed: 1.1 (slightly faster than default)
- Scroll progress indicator: thin 1px ember line at top of viewport
- All scroll-triggered animations use Intersection Observer as fallback for Lenis failures

---

## 7. Page Architecture — One-Page Cinematic Scroll

### Section Order
```
01  NAV
02  HERO
03  SOCIAL PROOF BAR (logos / stats)
04  PRODUCT DEMO (WebGL code review visualiser)
05  HOW IT WORKS (scrollytelling, sticky)
06  FEATURES GRID
07  REVIEWER SPECIALISTS (animated cards)
08  SEVERITY SYSTEM (visual explainer)
09  PRICING (three tiers)
10  TESTIMONIALS
11  FINAL CTA
12  FOOTER
```

---

## 8. Section Specifications

### 01 — Navigation
- Sticky, blur-backdrop (`backdrop-filter: blur(20px)`)
- Background: `--cw-bg-primary` at 85% opacity on scroll (transparent at top)
- Logo left, links centre, CTA right
- Links: DM Sans 14px, `--cw-ink-secondary`, hover → `--cw-ink-primary` (200ms)
- CTA: "Start for free" — ember-filled button, 14px DM Sans 600
- On mobile: hamburger → full-screen overlay with staggered link reveals
- Border-bottom: 0.5px solid `--cw-bg-secondary`, appears only after 80px scroll

### 02 — Hero
**Layout:** Full viewport height (100svh), centered content

**Above the fold:**
```
[small label tag]   AI Code Review · Now in Open Beta

[headline — Instrument Serif Italic, 72px]
Your code doesn't break
in the IDE. It breaks
in production.

[sub-headline — DM Sans 18px, --cw-ink-secondary]
CodeWatch runs five specialist AI reviewers on every
paste of code — catching vulnerabilities, reliability gaps,
and logic errors before they reach your users.

[two CTAs]
[Start for free →]  [Watch it review code  ▶]

[trust line — 12px]
No credit card required · Works with any AI-generated code
```

**Background treatment:**
- Animated canvas: thin grid lines (1px, `--cw-ink-tertiary` at 8% opacity) in an isometric perspective that very slowly scroll parallax
- Two soft radial gradients: one ember-warm top-left, one cooler stone bottom-right — both very low opacity (10-15%) — creates depth without distraction
- NOT a mesh gradient, NOT a moving blob — these are overdone

**Animation on load (staggered, 0 → 700ms):**
1. Nav fades in (0ms)
2. Label tag clip-path reveals (100ms)
3. Headline words clip-path reveal, staggered by word (200ms start, 60ms per word)
4. Subheadline fade-up (500ms)
5. CTAs fade-up with slight scale from 0.96 (600ms)
6. Trust line fade-in (700ms)

### 03 — Social Proof Bar
- Single row: "Trusted by founders, developers, and agencies building with AI"
- Logos in --cw-ink-tertiary (desaturated) at 40% opacity, hover → 100%
- Separator: thin vertical lines between logos
- Auto-scrolling marquee on mobile (Lenis-compatible)
- Alternatively: 3 large counter stats ("10,000+ issues caught · 500+ codebases reviewed · 98% accuracy rate")

### 04 — Product Demo (HERO FEATURE — Maximum craft here)
**This section earns or loses the user. Design it like a cinema screen.**

**Layout:**
- Full-width dark panel (`--cw-bg-ink`) — the only truly dark section on the page
- Contrast from the warm off-white sections makes it feel like entering a theatre
- Left: code editor panel (fake but realistic — JetBrains Mono, line numbers, syntax colours)
- Right: animated reviewer output panel

**WebGL / Canvas element:**
The code panel is rendered slightly in 3D perspective (Three.js PlaneGeometry with subtle rotation), lit from top-left with a soft directional light. As specialist annotations appear, thin geometric lines are drawn from annotations to the code line they reference (like surgery incisions on the code). These lines use a custom shader for the draw-on effect.

**Reviewer animation sequence (auto-plays, loops):**
1. Code appears (typewriter, fast — 300ms total)
2. Brief pause (500ms)
3. "Security Analyst" badge appears top-right of reviewer panel
4. Three findings reveal sequentially, each with a clip-path line reveal
5. Crossfade to "Reliability Engineer" — different badge colour
6. ...and so on through all five specialists
7. Summary score appears at bottom: "7 issues found · 2 critical"
8. Brief reset pause, loop

**Colour in the dark section:**
- Code: standard syntax highlighting (amber keywords, teal strings, grey comments)
- Security findings: `--cw-signal-critical` (#C8440A)
- Reliability findings: `--cw-signal-info` (blue)
- Performance findings: purple tint
- Line annotation highlights: very thin, 1px, the specialist's colour

### 05 — How It Works (Scrollytelling)
**Sticky section height: 300vh (three scroll "beats")**

Left panel text changes at each beat. Right panel shows the corresponding product state.

**Beat 1: "Paste your code"**
- Right: Empty editor, cursor blinking
- Copy: "Drop in any AI-generated code. Python, JavaScript, TypeScript, whatever your vibe-coding session produced."

**Beat 2: "Five specialists review it simultaneously"**
- Right: The five reviewer badges animate in one by one, each finding its position
- Copy: "Security. Reliability. Performance. Business Logic. Quality. Five specialist AI reviewers work in parallel — not sequentially."

**Beat 3: "Get a structured report"**
- Right: Full report with severity breakdown, downloadable badge
- Copy: "A structured report you can act on. Prioritised by severity. Export as PDF or markdown. Share with your team."

### 06 — Features Grid
**Layout:** 2×3 asymmetric grid (one feature card spans full width)

**Feature cards:**
Each card has:
- Icon (custom SVG, not generic icon library)
- Headline (DM Sans 600, 18px)
- Body (DM Sans 400, 15px, --cw-ink-secondary)
- No CTA per card — the whole page has one CTA

**The six features:**
1. **Five Parallel Specialists** — Security, Reliability, Logic, Performance, Quality
2. **Business Context Injection** — Tell it your domain rules; it reviews accordingly
3. **Severity Triage** — Critical, High, Medium, Low — not everything is an emergency
4. **Humanisation Layer** — Transforms AI code patterns into production-grade standards
5. **Downloadable Reports** — PDF/Markdown, shareable, branded
6. **Prompt Protection** — Proprietary review logic is obfuscated; no IP leakage

**The full-width feature card (top of grid):**
A visual showing the five specialist badges side by side, with a animated count of issues found per specialist. This is the most visually dense card — but contained.

### 07 — Reviewer Specialists
**Five cards, horizontal scroll on mobile, grid on desktop**

Each specialist card:
- Coloured top-border accent (their brand colour)
- Specialist "avatar" — a geometric abstract shape unique to each (not a face)
- Name: e.g. "Security Analyst"
- What they look for: 3 bullet points max
- Example finding (a short fake code snippet + the finding)

**Order:**
1. Security Analyst (ember/red)
2. Reliability Engineer (blue)
3. Business Logic Reviewer (amber)
4. Performance Analyst (purple)
5. Quality Inspector (green)

### 08 — Severity System
**A visual explainer — not a feature list**

A single large diagram showing:
- Severity scale (Critical → High → Medium → Low → Pass)
- Example finding for each level
- The visual metaphor: a "signal strength" style bar where Critical fills all bars with ember, Pass shows full green bars

This builds trust — it shows CodeWatch thinks in priorities, not just volume.

### 09 — Pricing
**Three tiers on a warm `--cw-bg-secondary` background**

| Tier | Price | For |
|------|-------|-----|
| Starter | Free | Solo builders, open source |
| Pro | $29/mo | Founders, freelancers, small teams |
| Scale | $99/mo | Agencies, larger codebases |

**Design rules:**
- Pro tier has a thin ember border (1.5px) — NOT a dramatic glow
- Annual toggle (saves 20%) — smooth height animation on toggle, not a jump
- No "MOST POPULAR" badge — instead, Pro card is subtly elevated (2px higher translateY)
- Feature comparison: inline in each card, not a separate table

### 10 — Testimonials
**Three cards, quote-first layout**

- Quote in Instrument Serif italic, large (22px)
- Attribution below: name, role, company
- No star ratings — CodeWatch is too premium for that aesthetic
- Background: back to `--cw-bg-primary`

### 11 — Final CTA
**Full-width cinematic section**

```
[centered, generous whitespace]

[Instrument Serif Italic, 56px]
Stop shipping your AI's mistakes.

[DM Sans 16px, --cw-ink-secondary]
CodeWatch catches what your AI code generator misses.
Every time. Before production.

[ember button, large]
Start reviewing for free →

[trust line]
Free tier — no credit card — up and running in 60 seconds
```

Background: animated version of the hero grid canvas, slightly more active

### 12 — Footer
- 4-column grid: Logo + tagline | Product | Company | Legal
- Bottom row: copyright + "Built for founders who build fast"
- The aperture mark in the logo subtly rotates 15° on hover (spring ease)
- Social links: GitHub, Twitter/X, LinkedIn — icon only

---

## 9. Micro-interactions & Detail System

### Button System
```
PRIMARY (ember fill):
  background: --cw-ember
  color: #FDFAF7
  border-radius: 6px
  padding: 12px 24px
  font: DM Sans 600 14px
  transition: all 200ms ease-out-expo
  hover: brightness(1.08), translateY(-1px)
  active: scale(0.98), translateY(0)
  focus: 3px offset ring, --cw-ember at 40%

SECONDARY (outline):
  background: transparent
  border: 1px solid --cw-ink-primary at 20%
  color: --cw-ink-primary
  hover: background --cw-bg-secondary, border opacity 40%

GHOST (text link style):
  no border, no background
  color: --cw-ink-primary
  hover: color --cw-ember, underline
  [right arrow icon that moves 3px right on hover]
```

### Card Hover States
```
DEFAULT:
  background: --cw-bg-surface
  border: 0.5px solid --cw-bg-secondary
  border-radius: 12px
  box-shadow: none

HOVER (200ms ease-out-expo):
  translateY(-4px)
  border-color: --cw-ember at 20%
  box-shadow: 0 12px 32px rgba(26, 23, 20, 0.08)
```

### Severity Pills
```
CRITICAL: bg --cw-signal-critical at 10%, text --cw-signal-critical, border 0.5px same
HIGH:     bg #7B2A1A at 10%, text #7B2A1A
MEDIUM:   bg --cw-signal-warn at 10%, text --cw-signal-warn
LOW:      bg --cw-signal-info at 10%, text --cw-signal-info
PASS:     bg --cw-signal-pass at 10%, text --cw-signal-pass
```

### Link Animation
All text links (nav, footer, inline) use an underline that draws from left to right on hover using a CSS clip-path or pseudo-element technique — not the default underline toggle.

---

## 10. Tech Stack

### Core Framework
```
Next.js 14+ (App Router)
React 18
TypeScript
```

### Styling
```
Tailwind CSS (utility layer)
CSS Custom Properties (design tokens — defined in :root)
PostCSS
```

### Animation Stack
```
GSAP (ScrollTrigger, SplitText, CountTo, DrawSVGPlugin)
Lenis (smooth scroll — pairs with GSAP ScrollTrigger natively)
Motion (Framer Motion) — for React component-level animations
Three.js — for the WebGL code panel in the product demo section
```

### Fonts
```
Google Fonts / self-hosted:
  - Instrument Serif (400, 400 italic)
  - DM Sans (400, 500, 600)
  - JetBrains Mono (400, 500)

next/font — zero layout shift font loading
```

### Performance
```
Lighthouse target: 95+ (Performance), 100 (A11y), 100 (Best Practices)
next/image for all images
Dynamic import for Three.js (heavy — lazy load)
Prefers-reduced-motion media query wraps ALL animations
```

### Hosting & Deployment
```
Vercel (recommended — Next.js native)
Environment: Node.js 20+
```

### Analytics & Tracking (optional)
```
Posthog (open source, GDPR-friendly)
Or: Vercel Analytics (zero config)
```

### Dependency List
```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "gsap": "^3.12.0",
    "@gsap/react": "^2.1.0",
    "lenis": "^1.1.0",
    "framer-motion": "^11.0.0",
    "three": "^0.165.0",
    "@react-three/fiber": "^8.17.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.3.0"
  },
  "devDependencies": {
    "@types/three": "^0.165.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "typescript": "^5.4.0"
  }
}
```

---

## 11. File Structure

```
codewatch-web/
├── app/
│   ├── layout.tsx           # Root layout, font loading, Lenis provider
│   ├── page.tsx             # Main one-page component
│   └── globals.css          # CSS custom properties, base styles
├── components/
│   ├── nav/
│   │   └── Nav.tsx
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── SocialProof.tsx
│   │   ├── ProductDemo.tsx   # Three.js WebGL code panel
│   │   ├── HowItWorks.tsx    # Scrollytelling sticky section
│   │   ├── Features.tsx
│   │   ├── Specialists.tsx
│   │   ├── Severity.tsx
│   │   ├── Pricing.tsx
│   │   ├── Testimonials.tsx
│   │   ├── FinalCTA.tsx
│   │   └── Footer.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── SeverityPill.tsx
│       ├── ReviewerBadge.tsx
│       └── Logo.tsx          # SVG aperture mark + wordmark
├── lib/
│   ├── gsap.ts              # GSAP plugin registration
│   ├── lenis.ts             # Lenis instance + GSAP integration
│   └── animations.ts        # Shared animation configs
├── public/
│   ├── fonts/               # Self-hosted font files
│   └── og-image.png         # Social sharing preview
└── tailwind.config.ts
```

---

## 12. Design Rules — The Non-Negotiables

1. **No pure white (#FFFFFF) backgrounds** — always `--cw-bg-primary` (#F5F2EE) or warmer
2. **No pure black text** — always `--cw-ink-primary` (#1A1714)
3. **Ember accent is rationed** — maximum 3 ember elements above the fold at any time
4. **No stock photography** — code visuals only. If a human face is needed, use abstract geometric avatars
5. **No gradient meshes or colour blobs** — the animated grid is the only background texture
6. **Typography hierarchy must never collapse** — if you can't tell if something is a heading, body, or label, the size/weight contrast is wrong
7. **Every animation must respect `prefers-reduced-motion`** — wrap all GSAP/Lenis triggers
8. **One primary CTA per section maximum** — never two filled buttons in the same viewport
9. **The dark section (Product Demo) is the only dark section** — everything else stays warm/light
10. **Mobile is not an afterthought** — design mobile layout before desktop for sections 04, 05, 06

---

## 13. Content Voice & Tone

**For headlines (Instrument Serif Italic):**
Provocative, precise, slightly uncomfortable truths. No filler.
- ✓ "Your code doesn't break in the IDE. It breaks in production."
- ✓ "Five experts reviewed your last commit. They found seven problems."
- ✗ "The best AI code review platform" (generic, no tension)

**For body copy (DM Sans):**
Direct, clear, no jargon padding. Speak to the anxiety of shipping AI code.
- ✓ "CodeWatch doesn't slow you down. It just makes sure what you ship actually works."
- ✗ "Leveraging advanced AI capabilities to enhance code quality..."

**For UI labels:**
Functional, not clever. Labels should describe, not sell.
- ✓ "Security Analyst", "2 critical issues", "Download report"
- ✗ "AI-Powered Security Guardian"

---

## 14. What Awwwards-Level Actually Means Here

It does not mean: maximum visual complexity.

It means:
- Every element has a reason to exist
- The scroll tells a story — beginning, middle, end
- The product demo shows the product doing actual work
- Typography is doing creative heavy-lifting (the serif/sans pairing IS the design)
- The animation enhances comprehension, not just wow factor
- It looks and feels like a real product that earns trust

The reference points to carry in mind:
- **Linear.app** — precision, restraint, dark sections used sparingly
- **Vercel.com** — grid discipline, generous whitespace, light mode not apologising for itself
- **Raycast.com** — product demo as hero, the tool itself is the star
- **Resend.com** — editorial typography doing the heavy lifting, not gradients

CodeWatch borrows the editorial confidence of all four — on a warm, parchment-toned foundation that no competitor has claimed.

---

## 15. Additional Sections (Retained from Original — Style to Match Brand)

These sections exist in the current codebase and are intentionally kept.
They must be restyled to match the CLAUDE.MD brand system but their
content and structure can remain.

### FAQ
- Background: --cw-bg-secondary (#EDE9E3)
- Question font: DM Sans 600, 16px, --cw-ink-primary
- Answer font: DM Sans 400, 15px, --cw-ink-secondary
- Accordion open indicator: thin ember left border (3px, --cw-ember)
- No icons — text only, clean and editorial

### Comparison Table
- Background: --cw-bg-surface (#FDFAF7)
- Header row: DM Sans 600 uppercase labels, --cw-ink-tertiary
- CodeWatch column: ember-tinted header (#F5E8E3), --cw-ember text
- Checkmarks: --cw-signal-pass green. Cross marks: --cw-ink-tertiary at 40%
- No gradients, no glows — the data should speak

### Security Section
- Treat as a feature deep-dive, not a standalone hero
- Background alternates with adjacent sections (--cw-bg-primary or secondary)
- Headline: Instrument Serif italic
- Any code snippets: JetBrains Mono on --cw-bg-ink surface
- Severity pills use the signal color system from §4

### Problem Section
- Reframe as the emotional setup before the Hero CTA
- Stats move to §03 Social Proof Bar
- Copy tone: provocative, Instrument Serif italic for the pull quote
- Background: --cw-bg-primary

### Ticker / Marquee
- Content: specialist reviewer names or feature names
- Text: DM Sans 600 uppercase, --cw-ink-tertiary, letter-spacing 0.08em
- Separator: small ember diamond (◆) between items
- Speed: slow and continuous, not jarring

### UniqueFeatures Accordion
- Rebuild visual style only — keep the accordion interaction
- Open state: 3px ember left border, --cw-bg-surface background
- Closed state: --cw-bg-primary, hover → --cw-bg-secondary
- Feature name: DM Sans 600, --cw-ink-primary → --cw-ember when open
- Pull quote inside: Instrument Serif italic, 3px ember left border

---

## 16. Design Reference — trymeridian.com (Dealbreaker Standard)

This is the benchmark. Every section of CodeWatch must meet or exceed
this quality bar. Study it carefully before building anything.

### What Meridian Does That We Must Match

**Hero treatment:**
- Bold, short, declarative headline — no fluff, no sub-clauses
- "Win your market in AI search" — 6 words, immediately understood
- Two CTAs side by side: primary filled + secondary ghost ("Get started" + "Talk to sales")
- The hero does NOT try to explain everything — it provokes curiosity then gets out of the way

**Social proof bar:**
- Continuous auto-scrolling logo marquee, immediately below the hero
- Logos are monochrome/desaturated — the brand doesn't compete with the client logos
- No headings, no labels — the logos speak for themselves
- This must appear on CodeWatch within the first scroll viewport

**Product demo / visualisation:**
- The centrepiece is a live-looking dashboard panel showing real data states
- Multiple rotating "query cards" with Visibility / Sentiment / Position metrics
- Each card shows a real-world query ("Most popular dating apps in Canada") with
  competitor brand logos below — immediately tangible and specific
- This is not a screenshot. It feels interactive and alive even if it isn't.
- For CodeWatch: the equivalent is a rotating live code review panel showing
  real findings from the five specialists — same energy, same specificity

**Section rhythm:**
- Sections alternate between light and slightly-off-white backgrounds — never jarring
- Each section has ONE job. It does not try to do two things.
- Generous whitespace between sections — breathing room IS the premium signal
- No section feels rushed or compressed

**Typography discipline:**
- Headlines are short and punchy — never more than 8 words at display size
- Body copy is concise — 2-3 sentences maximum per block
- Sub-section labels ("Brand analytics", "Improvement actions") are small,
  uppercase, muted — they orient without competing
- Zero decorative text. Every word earns its place.

**Feature presentation:**
- Features shown as UI cards / product screenshots, not icon grids
- Each feature has a visual proof element — an actual UI state, not an illustration
- Features are named functionally ("Brand analytics", "Product-level tracking")
  not cleverly — clarity beats cleverness at this level

**"How it works" section:**
- Three steps, numbered simply: Get started → Take Action → Results
- Each step is one sentence. Not a paragraph. One sentence.
- No diagrams, no arrows — the simplicity IS the message

**CTA sections:**
- The final CTA section is generous with whitespace and very short on copy
- One headline, one supporting line, one button — nothing else
- The button does not glow, pulse, or animate aggressively —
  it is confident and still

**Trust signals:**
- "Proof, not promises" framing — every claim is tied to a measurable outcome
- Visual proof elements (progress bars, metric cards) used sparingly but precisely
- No testimonial star ratings — social proof comes from logo density and
  specificity of claims

### What Meridian Does That We Should Adapt (Not Copy)

- Their rotating query cards → CodeWatch equivalent: rotating specialist
  review cards showing real-looking findings per specialist
- Their "Q1 +54% Visibility Gain" callout overlay → CodeWatch equivalent:
  "7 issues found · 2 critical" summary badge on the code panel
- Their alternating feature layout (text left / visual right, then flip) →
  use the same pattern for CodeWatch's feature deep-dives

### The Core Lesson

Meridian looks premium because it shows the product doing real work,
with real numbers, against real scenarios. It never asks you to imagine
what the product does — it shows you.

CodeWatch must do the same. Every section should answer:
"What does this actually look like when it runs?"

---

*CLAUDE.MD v1.0 — CodeWatch Design System*
*Built for: one-page cinematic scroll, self-serve SaaS, light background, Awwwards-calibre execution*
