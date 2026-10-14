# Stellies Removals — Paarl Landing Page

A single-scroll, conversion-driven landing page for Stellies Removals, targeting
furniture-removal customers in Paarl and the surrounding Boland. Every "quote"
CTA scrolls to the on-page enquiry form; phone links stay direct `tel:` links.

Built with [Astro](https://astro.build), on Vercel's adapter in `hybrid`
output: every page stays static/prerendered except the enquiry form's API
route, which runs as a small serverless function.

## Getting started

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # type-check + build
npm run preview  # preview the production build
```

## Project structure

```
src/
  assets/images/       source photos, optimized at build time via astro:assets
  components/          one component per section of the page (Header, Hero, ...)
  components/icons/    shared inline SVG icons (send, phone)
  layouts/Layout.astro  <head>, fonts, structured data, global click tracking
  lib/contact.ts       single source of truth for phone number / services list
  pages/index.astro    assembles the page from section components
  pages/api/enquiry.ts  serverless endpoint the enquiry form posts to
  styles/global.css    design tokens (color, type), base reset, form-field styles
```

## Lead capture: form, not WhatsApp

**As of the `staging` branch, WhatsApp has been removed as a contact
channel** — every CTA on the page (`Get a Quote`, `Get My Free Quote`, the
service-card links, the closing banner, the mobile sticky bar) scrolls to
`#enquiry`, a real form (`EnquiryForm.astro`), instead of opening a `wa.me`
chat. This was a deliberate switch: WhatsApp leads were hard to track and
account for reliably; a submitted form is not.

- **`src/pages/api/enquiry.ts`** validates the submission (name + phone
  required; a hidden honeypot field for spam), logs every lead to Vercel's
  function logs regardless of what happens next, and forwards it by email via
  [FormSubmit.co](https://formsubmit.co) — a zero-signup relay used here
  **as a staging placeholder**, not a final choice. Swap it for the client's
  preferred provider/CRM webhook before this goes live for real.
  - **FormSubmit needs a one-time activation**: its first-ever delivery to
    `info@stelliesremovals.com` only sends that inbox a confirmation link —
    it won't actually forward a lead until someone clicks it. Do that before
    trusting a "no leads arriving" report on this branch.
- The form works with JavaScript disabled too (a real `<form method="post"
  action="/api/enquiry">`, handled by the same route) — with JS, submission
  happens via `fetch` with no page reload and inline success/error state.
- **Lead tracking**: a successful submit fires a GA4-style `generate_lead`
  event (`gtag` + `dataLayer`). There's no dedicated Google Ads *conversion*
  for form submits yet — only the existing "Phone Call" one — so it isn't
  counted as an Ads conversion until the client creates that action and its
  label gets wired in the same way `tel:` clicks are.
- Clicking a service card's "Get a quote →" pre-selects that service in the
  form's dropdown before scrolling to it, replacing the old per-card WhatsApp
  message.

## Design source

Recreated from the `design_handoff_paarl_landing` handoff (Claude Design,
"Modernist" design system). See that bundle's `README.md` for the full spec:
color/type tokens, section-by-section layout, copy, and interaction notes.
The WhatsApp-specific parts of that spec (the "no forms" framing, the chat
panel, wa.me deep links) were superseded by the change above — the design
system tokens (Archivo, zero border radius, 2px rules, brand colors) still
apply throughout, including to the new form.

Key decisions:

- **One phone number, everywhere.** `072 500 8900`, centralized in
  `src/lib/contact.ts` as the single source of truth.
- **Zero border radius, 2px rules, flush-left type** — enforced globally in
  `global.css`, including the form fields.
- **Responsive behavior** was undefined in the source design (desktop-only
  1200px reference) and has been implemented per the handoff's suggested
  approach: single-column grids below ~900px, hero image moves above the
  copy, service cards stack, and a fixed bottom CTA bar appears on mobile
  (≤640px).
- **CTA-click analytics**: every button that scrolls to the form carries a
  `data-cta-source` attribute and pushes a `cta_click` event (with that
  source) to `window.dataLayer` — a breadcrumb for which position gets
  people to the form, separate from the `generate_lead` conversion event
  fired on actual submit.
- **Photography kept as supplied** — the six client photos (including the
  COVID-era shots with masks) are used as-is, no grayscale filter applied.
  Confirmed with the client; no further action needed.

## Open items for the client

- **Confirm the FormSubmit.co staging setup is acceptable, or name a
  preferred lead destination** (email API, CRM webhook, Zapier/Make, etc.)
  before this goes live — see "Lead capture" above.
- **Create a "Lead Form" conversion action in Google Ads** if form
  submissions should count toward Ads reporting separately from phone calls.
- Confirm the trading hours ("Weekdays 07:00–18:00, Saturdays 08:00–13:00")
  and the trust-bar estate list still apply to the Paarl operation.
