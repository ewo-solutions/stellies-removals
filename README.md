# Stellies Removals — Paarl Landing Page

A single-scroll, conversion-driven landing page for Stellies Removals, targeting
furniture-removal customers in Paarl and the surrounding Boland. Every call to
action opens a pre-filled WhatsApp chat — there is no contact form.

Built with [Astro](https://astro.build) as a static site: no server-side logic
or form backend is needed for this page.

## Getting started

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # type-check + build to dist/
npm run preview  # preview the production build
```

## Project structure

```
src/
  assets/images/     source photos, optimized at build time via astro:assets
  components/         one component per section of the page (Header, Hero, ...)
  components/icons/   shared inline SVG icons (WhatsApp, phone)
  layouts/Layout.astro  <head>, fonts, structured data, global click tracking
  lib/contact.ts      single source of truth for phone number / WhatsApp links
  pages/index.astro   assembles the page from section components
  styles/global.css   design tokens (color, type) and base reset
```

## Design source

Recreated from the `design_handoff_paarl_landing` handoff (Claude Design,
"Modernist" design system). See that bundle's `README.md` for the full spec:
color/type tokens, section-by-section layout, copy, and interaction notes.

Key decisions carried over from the handoff:

- **One phone/WhatsApp number, everywhere.** `072 500 8900` is the same
  number for the parent business and the Paarl operation — no per-branch
  number, confirmed with the client. It's still centralized in
  `src/lib/contact.ts` as the single source of truth, so any future change
  only needs to happen in one place.
- **No client state** — the page is fully static; every interaction is a link
  (`wa.me/...` or `tel:`).
- **Zero border radius, 2px rules, flush-left type** — enforced globally in
  `global.css`.
- **Responsive behavior** was undefined in the source design (desktop-only
  1200px reference) and has been implemented per the handoff's suggested
  approach: single-column grids below ~900px, hero image moves above the
  copy, service cards stack, and a fixed bottom WhatsApp bar appears on
  mobile (≤640px). Revisit with the client if this doesn't match intent.
- **WhatsApp click analytics**: every CTA carries a `data-wa-source`
  attribute and pushes a `whatsapp_click` event (with that source) to
  `window.dataLayer` — wire up GTM/GA4 to capture which position converts.
- **Photography kept as supplied** — the six client photos (including the
  COVID-era shots with masks) are used as-is, no grayscale filter applied.
  Confirmed with the client; no further action needed.

## Open items for the client (from the design handoff)

- Confirm the trading hours in the chat card ("Weekdays 07:00–18:00,
  Saturdays 08:00–13:00") and the trust-bar estate list still apply to the
  Paarl operation.
