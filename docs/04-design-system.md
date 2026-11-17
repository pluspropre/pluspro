# 04 — Design system & motion

Source: `docs/design-reference/Main.dc.html` (desktop home mockup, 1440 px artboard, with responsive rules down to
420 px). Values below are extracted from its `<style>` block and its logic class. **Replicate values, not markup.**
Inner pages have no mockup: build them from the same tokens and section components (see `05`).

To view the mockup: `cd docs/design-reference && python3 -m http.server 8000` → `http://localhost:8000/Main.dc.html`.

## 1. Brand direction

- Fresh, clean, confident. Large uppercase **Inter Tight** headlines with one *Instrument Serif italic* accent word in
  teal ("Nos *services*", "Pourquoi *+Propre* ?").
- Mint → cream gradients, generous white space, rounded 24–40 px cards, pill buttons, glassy floating chips.
- Signature motifs: the **plus sign** (logo, eyebrows, placeholders, watermark), **soap bubbles**
  (hero, cursor, process line), **"dirty → clean" wipes** (service images, before/after, final CTA).
- Logo in header: blue `#2346C2` plus icon (stroke 4.2, round caps, 22 px) + "PROPRE" in Inter Tight 800 22 px, letter-
  spacing −0.03em. Replace with the client's vector logo when received; keep the same footprint.

## 2. Tokens

Define in `src/app/globals.css` with Tailwind v4 `@theme` so they generate utilities (`bg-ink`, `text-teal-ink`…).

### Colours

| Token | Value | Use |
|---|---|---|
| `ink` | `#0B1B3F` | Headings, primary text on light, dark buttons, dark card |
| `body` | `#3A4660` | Body text |
| `blue` | `#2346C2` | Logo, focus ring, links hover |
| `teal` | `#1FA39A` | Hero semicircle, progress bar, quote icon, accents (non-text or large text) |
| `teal-ink` | `#158F87` | Serif accent words in headings (large text only — 4.0:1 on white) |
| `teal-dk` | `#0F766E` | Small teal text (tags, links, step numbers) — passes AA |
| `green` | `#3BB273` | Primary CTA background (with **ink** text, never white), active dots, FAQ open icon |
| `green-h` | `#2E9A60` | Primary CTA hover |
| `mint` | `#EAF8F5` | Soft section/card backgrounds, rating card, tags |
| `cream` | `#F7F9EF` | Sectors section background |
| `dark` | `#0A1020` | Footer, page background behind rounded hero |
| `line` | `rgba(11,27,63,.12)` | Hairlines, card borders |
| `surface-2` | `#F1F4F3` | Stats section |
| `field` | `#F3F6F5` | Form field background |
| `label` | `#56627A` | Field labels, meta text |
| `muted` | `#6B7690` | Counters "/ 06" |
| `star` | `#E0A100` | Rating stars |
| `cta-accent` | `#8BE7DC` | Serif word + icons on the dark final CTA |
| `periwinkle` | `#9DB2F5` | Decorative hand-drawn arrow, chip dot |

Shadows: `--sh: 0 20px 60px -20px rgba(11,27,63,.15)`; large `0 30px 80px -34px rgba(11,27,63,.38)` (quote bar),
cards `0 30px 80px -40px rgba(11,27,63,.3)`; nav `0 12px 40px -24px rgba(11,27,63,.35)`.

Easing: `--ease: cubic-bezier(.19,1,.22,1)` (≈ GSAP `expo.out`) for CSS transitions.

### Typography

Load with `next/font/google`, `subsets: ['latin']`, `display: 'swap'`, exposed as CSS variables:

- **Inter** 400, 500, 600 (+ italic 400/500) — body. Base 17 px / 1.6 (16 px under 768 px).
- **Inter Tight** 500, 600, 700, 800 — headings, numbers, buttons, nav logo.
- **Instrument Serif** italic 400 — accent words only (`.serif` → `<em className="accent">`).

| Style | Font | Size | Line-height | Letter-spacing | Transform |
|---|---|---|---|---|---|
| H1 (hero) | Inter Tight 800 | `clamp(44px, 6.6vw, 96px)` | 1 | −0.04em | none |
| H2 (section) | Inter Tight 800 | `clamp(40px, 6vw, 84px)` | 0.98 | −0.035em | uppercase, `text-wrap: balance` |
| Serif accent | Instrument Serif italic 400 | 1.08em (1.14em in H1) | 0.88 in H1 | −0.01em | none, colour `teal-ink` |
| H3 card (why) | Inter Tight 800 | `clamp(32px, 3.4vw, 48px)` | 1.02 | −0.035em | uppercase |
| H3 small | Inter Tight 700 | 24 px | 1.15–1.22 | −0.02em | none |
| Eyebrow | Inter 600 | 12 px | — | 0.12em | uppercase, with 14 px green plus icon |
| Lead | Inter 400 | 18–19 px | 1.55 | — | `text-wrap: pretty` |
| Big numbers | Inter Tight 800 | `clamp(56px, 7.4vw, 108px)` | 0.95 | −0.045em | — |

Keep only **one H1 per page**; headings must follow a logical outline (the visual size can differ from the level).

### Layout

- Container `.wrap`: max-width 1280 px, padding-inline 48 px (32 px ≤ 1024, 20 px ≤ 767).
- Section vertical padding 140 px (96 px ≤ 767). Sections following a heading-only section use `pt-10`.
- Section head: 2 columns `1.35fr / 1fr`, gap 48, aligned bottom; lead max 420 px right-aligned; stacks ≤ 1024.
- Radii: hero/CTA/why cards 40 px (28 px mobile); cards & images 24 px; pills 999 px.
- Breakpoints used by the mockup: 1180, 1024, **900 (burger menu)**, **767 (mobile layout)**, 420. Map to Tailwind
  custom breakpoints in `@theme` (`--breakpoint-sm: 420px`, `md: 768px`, `nav: 900px`, `lg: 1024px`, `xl: 1180px`).

## 3. Components (build once, reuse everywhere)

| Component | Spec |
|---|---|
| `Button` | Pill, min-height 56 px, 16 px/600. Variants: `green` (bg green, text ink, hover green-h), `ghost` (white 60 % + blur 16, border ink/18 %, hover border ink), `dark` (bg ink, text white, 52 px, icon circle white). Primary variants include an **arrow icon circle** (38 px) whose two arrows swap diagonally on hover (`.a1` exits to top-right, `.a2` enters from bottom-left, 0.5 s `--ease`). Renders `<a>` (Next `Link`) or `<button>`. |
| `Eyebrow` | Plus icon + uppercase label. |
| `SectionHeading` | Eyebrow + H2 with optional accent word + optional lead. Prop `as` to choose heading level. |
| `Badge` | Glass pill with pulsing green dot (`ping` keyframe 1.8 s). |
| `Chip` (hero) | Glass pill, italic 16 px, coloured dot, floating animation. |
| `Media` | Wraps `next/image` with rounded corners and hover zoom. **Fallback**: branded gradient placeholder (`.ph-img` g1–g6 gradients + diagonal light stripes + big translucent "+") with an optional label. Use for any missing photo — never stock images. |
| `BeforeAfter` | Range-input slider: two stacked images, the "before" layer clipped with `clip-path: inset(0 calc(100% - var(--p)) 0 0)`, white 2 px handle, 68 px white knob with double-arrow icon, "Avant"/"Après" tags, thumbnails to switch examples. Keyboard: native `<input type="range">` (arrow keys), visible focus ring on knob, `aria-label="Comparer avant et après"`, `aria-valuetext="{n} % après"`. **Aspect ratio follows the photos**: most client photos are portrait → desktop layout = slider (4:5) left + project list/description right; landscape pairs (oven) can use the 16:8 full-width version. |
| `Stars` | 5 stars, fill clipped to rating (supports 4.6), `role="img"` + `aria-label="Note : 4,8 sur 5"`. |
| `Accordion` (FAQ) | Button inside `<h3>`, `aria-expanded`, `aria-controls`; answer always **in the DOM** (animated with `grid-template-rows: 0fr → 1fr`, 0.7 s); + icon rotates 45° and turns green. First item open by default. |
| `Carousel` (reviews) | Track translated with GSAP; prev/next buttons (54 px circles) + counter "1 / N"; drag/swipe (pointer events, 60 px threshold); all cards in the DOM; `aria-roledescription="carrousel"`, slides `role="group"` with `aria-label="Avis 1 sur N"`; respects reduced motion (no tween). |
| `Field` / `Select` | Pill fields on `field` background, 11 px uppercase label above value, focus: white bg + teal border + 4 px teal/20 % ring. |
| `Breadcrumbs` | On all inner pages; matches `BreadcrumbList` JSON-LD. |

## 4. Global layout pieces

### Header / navigation

- Fixed floating pill: `top: 44px`, width `min(1232px, 100% - 96px)`, 3-column grid (logo | links | CTA), glass
  (white 50 %, `backdrop-filter: blur(16px) saturate(140%)`, white 75 % border).
- On scroll > 80 px: `top: 14px`, tighter padding, more opaque (white 74 %, blur 26). On scroll down > 320 px: hides
  (`translateY(-170%)`); reappears on scroll up. 2 px teal **scroll progress bar** at the bottom edge.
- Links: Accueil · Services ▾ · Réalisations · À propos · Actualités. Active link has a white pill; a sliding white
  indicator follows hover/focus (GSAP `expo.out` 0.55 s) and returns to the active link on mouse leave.
  **Active state comes from `usePathname()`** (fixes audit A11) and sets `aria-current="page"`.
- **Services ▾** opens a mega-menu panel (glass card) with two columns: *Secteurs* (6 links) and *Prestations
  ponctuelles* (3 links), plus a link "Tous nos services". Must open on click and keyboard (Enter/Space/ArrowDown),
  close on Escape and outside click; hover-open on desktop pointer is optional.
- Right: dark CTA "Demander un devis" (icon only ≤ 767 px). Optionally a phone icon link `tel:+33765551111`.
- ≤ 900 px: burger (48 px circle) → full-width glass dropdown panel with all links (services as an expandable group),
  phone and CTA. Lock body scroll while open; focus trap; Escape closes.
- Include a **skip link** ("Aller au contenu") before the header.

### Footer (dark `#0A1020`)

- 3 columns: brand (logo white, tagline, social circles 46 px: Instagram, LinkedIn, Facebook) · Contact (phone, email,
  address "7 Rue de Koenigshoffen, 67000 Strasbourg", hours when known) · Liens (Services, Réalisations, Actualités,
  Devis, Mentions légales, Politique de confidentialité, **Gestion des cookies** button).
  Add a 4th column "Services" with the 9 service links on ≥ 1024 px (internal linking; fixes audit A13).
- Bottom bar: "© {year} +Propre · Nettoyage professionnel à Strasbourg" + "Retour en haut".
- Giant watermark "+PROPRE" (26vw, Inter Tight 800, white, "+" in teal) with cleaning-product SVG illustrations rising
  from the bottom (copy the `.prods` SVGs from the mockup). Letters slide up on enter. `aria-hidden`.

## 5. Home page sections (order and behaviour)

| # | Section | Layout & content | Motion (desktop, motion allowed) |
|---|---|---|---|
| 1 | **Hero** | Rounded card (40 px radius, teal/35 % border, mint→cream gradient + radial highlights, big white circle bottom-left), padding-top 176 px. Centered: badge "Nettoyage professionnel à Strasbourg" · H1 "La propreté, *notre* engagement." · sub (max 660 px) · CTAs [green "Obtenir mon devis" → `/devis`] [ghost "Découvrir nos services" → `#services`]. Stage (520 px high): pale white→mint semicircle 760×380 with inner arc, 5 thin concentric arcs, **vector illustration of two agents** (transparent WebP, contain-fit, standing on a pale mint semicircle with a teal hairline), 3 green/teal sparks, hand-drawn periwinkle arrow, social-proof pill left (avatars + "+120 sites suivis chaque année"), 3 floating chips right ("Produits écolabellisés", "Équipe formée et assurée", "Interventions 7j/7"), floating soap bubbles (2 depth layers). | Timeline after preloader: badge fade-up; H1 words rise from `yPercent:115` with blur; accent word revealed by clip-path wipe + white shine sweep; sub & CTAs fade-up; semicircle scales up from bottom; arcs draw (stroke-dashoffset); person rises (`back.out`); sparks pop; chips pop (`elastic.out`); proof slides in; arrow draws. Bubbles rise continuously (CSS). Pointer parallax on `[data-depth]` layers. On scroll: card scales to 0.92 and radius → 80, copy fades up, person sinks, bubbles drift (scrubbed). Chips float (CSS `float` 5–6.6 s). |
| 2 | **Quote bar** | White pill overlapping the hero bottom (−60 px), glow under it. Label "VOTRE DEVIS EN 24H" + 3 selects (Type de locaux · Surface · Fréquence) + green submit. Mobile: stacked card. | Rises in with the hero timeline. |
| 4 | **Services** `#services` | Eyebrow "Ce que nous faisons", H2 "Nos *services*", lead. 12-col asymmetric grid: card 1 (span 4, 360 px image) Bureaux & open-spaces; card 2 (span 8, 480 px) Cabinets médicaux; card 3 (span 7, 400 px) Copropriétés & parties communes; tile 4 (span 4, square mint card) "6 univers, *une même* exigence" + 68 px green round arrow → `/services`. Caption row: serif number "01/", uppercase name, 44 px round arrow. Each card links to its service page. | Images reveal with a diagonal clip-path **wipe + white light band** (1.4 s `power3.inOut`), inner image scales 1.15 → 1. Hover: image zoom 1.05, number shifts 10 px, arrow rotates 45° and fills green. Mobile: simple fade-up. |
| 5 | **Pourquoi +Propre** `#pourquoi` | 3 **sticky stacked cards** (top 120/144/168 px), each 2 columns photo | text, min-height 540: (01) Interlocuteur unique — white; (02) Équipe stable et formée — mint; (03) Hygiène renforcée — ink with white text. Giant outline number in the corner. | Pure CSS sticky overlap: each card slides over the previous one; no scrubbed scale/brightness (it read as a bad fade). Illustrations (contain-fit) on tinted panels. Mobile: not sticky, stacked. |
| 6 | **Stats** | Section on `#F1F4F3` with slanted top edge (`clip-path: polygon(0 90px,100% 0,100% 100%,0 100%)`). Centered H2 "Une exigence *qui se mesure*". 4 rows (number+label · description · round photo or green arrow): **+120** sites suivis chaque année · **24h** pour recevoir votre devis · **7j/7** plages d'intervention · **100%** équipe déclarée et assurée. (Only validated figures — see `01` §4.) | Numbers count up from 0 (2 s `expo.out`); hairline rules draw from left; round photos pop (`back.out(2)`). Server HTML must contain the **final numbers** (count-up starts after hydration). |
| 7 | **Avant / après** | H2 "Le *avant*, le *après*" — fix French: "**L'avant, l'après**". Lead "Faites glisser le curseur : la différence se voit." `BeforeAfter` with 3–4 featured projects from Supabase (`is_featured`). | Slider auto-demos once when 60 % in view (50 → 20 → 80 → 50). |
| 8 | **Méthode** | H2 "Comment ça *se passe*". 3 steps with 58 px numbered dots on a horizontal line: Vous décrivez vos locaux → Visite et proposition sur mesure (devis sous 24h) → Lancement et suivi régulier. Mobile: vertical list. | Line fills green (scrubbed) with a bubble travelling on its tip; dots turn green as reached. |
| 9 | **Secteurs** `#metiers` | Cream background. H2 "Une page pour *chaque* métier". Wrapped grid of all sector cards (3 columns ≥1025 px, 2 columns ≥640 px, 1 below): 4:3 photo, number tag, title, one-liner, round ink arrow → service page (whole card clickable). | Same image **wipe + light band** as the services grid, staggered by column (0 / 0.12 / 0.24 s). Hover: card lifts 6 px, image zooms, arrow rotates. |
| 10 | **Avis clients** | 2 columns: left H2 "Ils nous font *confiance*" + rating card (mint, big "5,0", stars, "N avis · Google, Facebook…" + link "Laisser un avis") + prev/next controls; right: carousel of review cards (quote icon, text, avatar initials, name, context, platform badge). Data from Supabase. | Cards fly in from a stacked/rotated pile; stars fill one by one (clip-path). Drag to navigate. |
| 11 | **Actualités** `#actualites` | H2 "Nos *actualités*" + ghost "Tous les articles". 3 latest posts: 4:3 image, category tag + date, title with animated underline on hover, reading time. Hidden if no published posts. | Staggered fade-up. |
| 12 | **FAQ** | 2 columns: sticky left (H2 "Questions *fréquentes*", lead with phone link); right accordion (4–6 questions). | Accordion height transition. |
| 13 | **Final CTA** | Rounded 40 px panel, min-height 660, photo background (dark shade), eyebrow "Devis gratuit sous 24h", H2 "Un espace *+Propre* commence ici.", green button, phone + email links. | **Real before → after** wipe: the "avant" photo of a +Propre job (parking-abords) is wiped diagonally by scroll to reveal the "après" photo, which saturates; light band sweeps (scrubbed). Without JS only the "après" photo shows. |
| 14 | Footer | See §4. | Watermark letters rise; product illustrations pop up. |

Mockup content fixes to apply: "Le avant, le après" → "L'avant, l'après"; "Voir mon estimation" → "Continuer ma demande"
(no automatic price exists); the FAQ placeholder `[À COMPLÉTER…]` must be replaced before launch.

## 6. Global motion layer

| Element | Spec | Disabled when |
|---|---|---|
| Lenis smooth scroll | `lerp: 0.09`, `smoothWheel: true`, driven by `gsap.ticker`, `lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker.lagSmoothing(0)`. Use `lenis/react` `ReactLenis root`. Anchor links scroll via Lenis with header offset. | Reduced motion; admin area |
| Reveal on scroll | Elements with `data-reveal`: `y: 48 → 0`, `opacity 0 → 1`, 1.1 s `expo.out`, start `top 88%`, once. | Reduced motion → opacity-only 0.8 s, or none |
| Preloader | First visit per session only (`sessionStorage 'pp-intro'`): plus icon strokes draw, "PROPRE" letters rise, then a diagonal clip-path wipe with light band reveals the page (~1 s total). | Reduced motion, returning visit in session, **and never blocks content for no-JS** (render it only from a client component after hydration; keep total ≤ 1.0 s so it doesn't hurt LCP). Consider skipping on mobile if LCP suffers. |
| Bubble cursor | 84 px soap-bubble follower (`quickTo` 0.3 s); grows on interactive elements; becomes a dark disc with "Voir" on `[data-cursor="view"]` cards. **Keep the native cursor visible** (don't use `cursor: none`) for accessibility. | Touch / coarse pointer, reduced motion, < 768 px |
| Magnetic buttons | `.mag` elements follow the pointer (x × 0.3, y × 0.4, 0.6 s). | Touch, reduced motion |
| Page transitions | Use the View Transitions API (`<ViewTransition>` / `experimental.viewTransition` in Next 16) for a subtle fade/slide between routes, if stable in the installed version; otherwise a short fade on the `main` element. | Reduced motion |

### Implementation rules

- One `components/motion/gsap.ts` that imports `gsap`, `ScrollTrigger`, registers plugins once and exports them.
- Use `useGSAP(() => {…}, { scope: ref })` so contexts revert on unmount (route changes). Use `gsap.matchMedia()` with
  conditions `{ desk: '(min-width: 768px)', fine: '(pointer: fine)', reduce: '(prefers-reduced-motion: reduce)' }`.
- Call `ScrollTrigger.refresh()` after fonts load (`document.fonts.ready`) and after images in pinned sections load.
- **Server HTML = final state.** Initial hidden states are applied by JS (`gsap.from`) only after hydration, or via a
  `.js` class on `<html>` set by a tiny inline script — never via static CSS that hides content.
- Animate only `transform`, `opacity`, `clip-path`, `filter` (sparingly). No layout-thrashing properties.
- Pinning (Secteurs rail) and sticky stacking must not cause CLS: reserve heights.
- Test with Chrome DevTools "Emulate prefers-reduced-motion" and with JS disabled.
