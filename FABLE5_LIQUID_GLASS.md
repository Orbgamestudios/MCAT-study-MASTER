# Experimental UI (Fable 5)

A redesigned look for the MCAT app — cleaner visual refresh + an optional "Apple liquid
glass" skin — shipped behind a **single Experimental UI toggle in Settings**. When the
toggle is off, the app renders exactly as it does today. If anything breaks, flip it off
and you're back to normal. Design/build work driven by Fable 5.

Status: **planning** · Owner: cgsli · Created: 2026-06-10

---

## The safety model (most important part)

One master flag, `mcat:experimentalUI`, gates **all** new visuals.

- **Off (default):** zero change. No new CSS applies, no new render paths. Current app.
- **On:** the refreshed design activates via a single `data-exp="on"` attribute on
  `<html>` (same mechanism as `data-theme`). All experimental CSS is scoped under
  `:root[data-exp="on"]`, so it physically cannot affect the default look.
- **Liquid glass** is a nested sub-toggle that only appears (and only applies) when
  Experimental UI is on — like how the blur slider only shows when Dynamic background is on.

So the two design pieces live under one switch:
1. **Clean visual refresh** — tighter type/spacing/surfaces (on whenever Experimental UI is on).
2. **Liquid glass** — frosted translucent skin (optional sub-toggle).

Non-goals: new mascot, Higgsfield backgrounds. Those are separate efforts.

---

## Part 1 — Clean visual refresh

Quiet polish so the app reads "designed," not cluttered. Same components and layouts —
just consistency. All rules scoped under `:root[data-exp="on"]`, reusing existing CSS vars.

- **Typography rhythm:** one type scale (12 / 14 / 16 / 20 / 28), consistent line-height,
  tighter heading weights. Most clutter comes from too many sizes/weights.
- **Spacing system:** standardize padding/gaps to a 4px scale; remove one-off margins.
- **Consistent surfaces:** one card radius (`rounded-2xl`), one border weight, one soft
  shadow — instead of mixed `rounded-xl`/`rounded-lg`/no-border.
- **Calmer color:** accent used *sparingly* for action/active only; the rest in
  `--text` / `--text-muted` / `--text-faint`. Fewer competing colors = cleaner.
- **Quieter borders:** prefer `--border-soft` + subtle elevation over hard lines.
- **Touch targets & alignment:** 44px min tap height, aligned edges, baseline-aligned icons.

---

## Part 2 — Liquid glass (nested sub-toggle)

Frosted cards, hairline highlights, soft depth — layered on the refreshed look. Scoped
under `:root[data-exp="on"][data-glass="on"]`. Applies:
`backdrop-filter: blur(20px) saturate(180%)`, a 1px top highlight, soft inner shadow,
and slightly lower card-bg alpha. CSS only — no per-component JS edits.

**Risks (decide before building):**
- **Legibility:** glass over a busy background hurts contrast → raise card alpha / nudge `bgBlur`.
- **iOS Safari perf:** `backdrop-filter` is GPU-heavy → apply to top-level cards only.
- **A11y:** respect `prefers-reduced-transparency` → fall back to solid cards.

---

## How it plugs into the current code

React + Tailwind + Babel via CDN, single `app.js` (~680KB), no build step. The toggles
follow the existing `tropicalBg` / `bgBlur` pattern exactly:

| Concern            | Existing reference (copy this pattern)                          |
|--------------------|-----------------------------------------------------------------|
| Storage keys       | `KEYS` map — `app.js:32` (add `experimentalUI`, `glass`)       |
| Persisted-key list | `app.js:49` (add `mcat:experimentalUI`, `mcat:glass`)         |
| State + setters    | `app.js:4701` (`tropicalBg` useState + `storage.set`)          |
| Apply side-effect  | `app.js:4768-4785` (set `data-exp` / `data-glass` on `<html>`) |
| Context provider   | `app.js:5272` / `5285` (expose `experimentalUI`, `glass` + setters) |
| Cross-device sync   | `app.js:5112`, `5139` (merge + debounced push)                |
| Settings UI         | `app.js:12505-12540` (the "Dynamic background" toggle block)   |
| Theme CSS vars      | `index.html:76-444` (per-theme `--bg-card`, `--border`, etc.)  |
| Cache-bust          | `index.html:553` (`app.js?v=`)                                 |

**Build order (each step reversible):**
1. Add `experimentalUI` + `glass` to `KEYS` and the persisted-keys array.
2. Add state + storage + context for both; mirror into sync merge/push.
3. Apply-effect sets `data-exp` / `data-glass` on `<html>` (off = attributes absent).
4. Add the two toggles to `SettingsPanel` Appearance (glass nested under experimental).
5. Write `:root[data-exp="on"]` refresh CSS in `index.html`.
6. Write `:root[data-exp="on"][data-glass="on"]` glass CSS.
7. Bump `app.js?v=`.

---

## Fable 5 To-Do

> Check off as they land.

**Wiring (do first — the safety harness)** ✅ DONE 2026-06-10
- [x] Add `experimentalUI` + `glass` flags end-to-end (KEYS → state → context → sync).
- [x] Set `data-exp` / `data-glass` on `<html>` from the apply-effect.
- [x] Add "Experimental UI" toggle to Settings, with "Liquid glass" nested under it.
- [x] Confirm: toggle OFF renders the app identically to today (the fallback works).
      Verified in preview: off → no attributes on `<html>`; on → `data-exp="on"`
      (+`data-glass="on"`); app mounts cleanly both ways; values persist across reload.

**Part 1 — Clean refresh (under `:root[data-exp="on"]`)**
- [x] Audit current screens; list inconsistent radii / spacing / type sizes.
      Findings (2026-06-10):
      · Type: 11 sizes in use — `text-[10px]`×46, `text-[11px]`×41, xs×234, sm×217,
        base×21, lg×8, xl×6, 2xl×10, 3xl×3, 4xl×4 (+5xl, +7/8px periodic table).
      · Radii: cards consistently `rounded-2xl` (75); controls split across bare
        `rounded` 4px (142), `rounded-lg` (93), stray `rounded-sm`/`md` (2).
      · Weights: medium×97 / semibold×82 / bold×12.
      · Shadows: essentially none (3 uses total) — cards are flat.
      · Borders: cards use `--border-soft`, but ~30 containers use hard `--border`.
      · `--accent-soft` alpha drifts 10–18% across the 11 theme palettes.
- [x] Lock one type scale + spacing scale; apply to home/dashboard first.
      Landed as scoped utility overrides in `index.html` (applies app-wide, one
      place to revert): scale 12/14/16/20/28 + display tier (4xl/5xl numerals
      untouched, periodic-table 7/8px exempt); `sm:` variants re-asserted so
      responsive sizing survives the higher-specificity scope. p-6 cards step
      down to 20px → card padding is 16px mobile / 20px desktop everywhere.
- [x] Normalize cards to one radius + border + shadow.
      4px tier (`rounded`/`rounded-sm`/`rounded-md`) joins 8px; one soft shadow
      on `rounded-2xl` (deeper variant for dark themes); container `--border`
      steps down to `--border-soft` (buttons/inputs keep `--border`); `font-bold`
      folds into 600; 44px min tap height on the tab bar.
- [ ] Pull back accent overuse; route secondary text through muted/faint vars.
      Partial: `--accent-soft` normalized to one tint (color-mix 10% light /
      14% dark). Full pullback needs per-screen className edits — next pass.
- [ ] Verify each refreshed screen in-browser (light + dark).
      So far (preview, computed styles — screenshots wouldn't capture):
      OFF reverts pixel-identical to baseline (radius/weight/shadow/vars all
      match pre-change values); ON verified on Home + Settings in light, dark,
      darkwarm. Still to eyeball with real data: Stats, quiz runner, Lessons,
      Bank, CARS.

**Part 2 — Liquid glass (under `[data-exp="on"][data-glass="on"]`)**
- [x] Author glass CSS (cards, highlights, shadows, alpha tuning per palette).
      v2 ("clear glass", after feedback that v1 read frosted-plastic): cards
      drop to blur(10px) + lower alpha (58/76/48% of each theme's own card
      alpha via color-mix); every glass surface gets a gradient hairline ring
      (::before), diagonal specular sheen + corner bloom (::after), and a
      refractive inner edge glow. Header goes properly transparent (52% of
      --bg); active nav tab, header buttons, and accent CTAs become
      translucent glass chips with specular top edges. Real refraction
      (feDisplacementMap via backdrop-filter: url(#lg-dist)) is Chromium-only
      and software-composited, so it's @supports-gated off Apple browsers and
      limited to small surfaces (header chips + accent buttons) — cards fake
      it with the static optics. Nested boxes stay solid for iOS GPU headroom.
- [x] Add `prefers-reduced-transparency` fallback (solid `--bg-card-strong`,
      blur off; browsers without the media feature keep glass).
- [ ] Verify legibility on a CARS reading passage; check iOS Safari perf.
      Legibility verified in preview: CARS passage ~16:1 (runner overlays solid
      `--bg`, so glass never sits on the busy canvas there); dark mode card over
      the dynamic night background ≈13:1. iOS Safari perf still needs an
      on-device check.

- [ ] Bump `app.js?v=` cache-bust.

## Open questions

- Liquid glass: one global intensity, or a slider like `bgBlur`?
- Frost the nav/header too, or cards only for v1?
- Does Experimental UI auto-enable the dynamic background, or stay independent?
