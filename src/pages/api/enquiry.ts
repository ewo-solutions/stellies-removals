import type { APIRoute } from 'astro';

// Runs as a Vercel serverless function (output: 'hybrid' + prerender=false
// below) — every other page on the site stays static.
export const prerender = false;

interface EnquiryPayload {
  name?: string;
  phone?: string;
  email?: string;
  movingFrom?: string;
  movingTo?: string;
  moveDate?: string;
  service?: string;
  message?: string;
  website?: string; // honeypot — real visitors never fill this in
}

const MAX_FIELD_LENGTH = 500;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, MAX_FIELD_LENGTH);
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

// No-JS fallback: a plain <form method="post"> submit lands here instead
// of the fetch() handler in EnquiryForm.astro's script, and expects a full
// page back rather than JSON. Minimal, on-brand, no dependency on the rest
// of the site's stylesheet since this route doesn't render through Astro.
function htmlResponse(opts: { title: string; message: string; isError?: boolean }, status = 200): Response {
  const accent = opts.isError ? '#9c1150' : '#128c7e';
  const html = `<!doctype html>
<html lang="en-ZA">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${opts.title} — Stellies Removals</title>
<style>
  body { margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
    background: #ffffff; color: #201e1d; font-family: Arial, sans-serif; padding: 32px; box-sizing: border-box; }
  .card { max-width: 480px; border: 2px solid #201e1d; padding: 40px; }
  h1 { margin: 0 0 12px; font-size: 24px; color: ${accent}; }
  p { margin: 0 0 24px; font-size: 16px; line-height: 1.5; color: #46433f; }
  a { display: inline-block; font-weight: 700; text-transform: uppercase; letter-spacing: 0.02em;
    color: #ffffff; background: #128c7e; padding: 14px 24px; text-decoration: none; }
</style>
</head>
<body>
  <div class="card">
    <h1>${opts.title}</h1>
    <p>${opts.message}</p>
    <a href="/#enquiry">Back to the site</a>
  </div>
</body>
</html>`;
  return new Response(html, { status, headers: { 'content-type': 'text/html; charset=utf-8' } });
}

export const POST: APIRoute = async ({ request }) => {
  const wantsJson = (request.headers.get('accept') || '').includes('application/json');
  const contentType = request.headers.get('content-type') || '';

  let payload: EnquiryPayload;
  try {
    if (contentType.includes('application/json')) {
      payload = await request.json();
    } else {
      const formData = await request.formData();
      payload = Object.fromEntries(formData.entries()) as unknown as EnquiryPayload;
    }
  } catch {
    const message = 'We could not read that submission — please try again.';
    return wantsJson ? jsonResponse({ ok: false, error: message }, 400) : htmlResponse({ title: 'Something went wrong', message, isError: true }, 400);
  }

  // Honeypot: bots tend to fill in every field, real visitors never see
  // this one (it's visually hidden and skipped in tab order). Pretend
  // success so we don't tip them off, but skip the actual forward.
  if (clean(payload.website)) {
    return wantsJson
      ? jsonResponse({ ok: true })
      : htmlResponse({ title: 'Thanks!', message: "We've got your details and will be in touch." });
  }

  const name = clean(payload.name);
  const phone = clean(payload.phone);
  const email = clean(payload.email);
  const movingFrom = clean(payload.movingFrom);
  const movingTo = clean(payload.movingTo);
  const moveDate = clean(payload.moveDate);
  const service = clean(payload.service) || 'General enquiry';
  const message = clean(payload.message);

  if (!name || !phone) {
    const error = 'Name and phone number are required.';
    return wantsJson ? jsonResponse({ ok: false, error }, 400) : htmlResponse({ title: 'Almost there', message: error, isError: true }, 400);
  }
  if (email && !EMAIL_RE.test(email)) {
    const error = 'That email address doesn’t look right.';
    return wantsJson ? jsonResponse({ ok: false, error }, 400) : htmlResponse({ title: 'Almost there', message: error, isError: true }, 400);
  }

  const lead = {
    name,
    phone,
    email: email || undefined,
    movingFrom: movingFrom || undefined,
    movingTo: movingTo || undefined,
    moveDate: moveDate || undefined,
    service,
    message: message || undefined,
    submittedAt: new Date().toISOString(),
  };

  // This is the system of record: every lead lands in Vercel's function
  // logs here regardless of what happens with email delivery below, so
  // nothing is ever lost to a downstream integration hiccup.
  console.log('[enquiry] lead received', JSON.stringify(lead));

  // Email notification (FormSubmit.co) intentionally does NOT happen here.
  // It sits behind Cloudflare bot protection that blocks server-to-server
  // calls — confirmed in production: this route's own attempt to call it
  // got a 403 challenge page back, never FormSubmit itself. Their intended
  // integration is a real browser request, so that call now happens
  // client-side instead, in EnquiryForm.astro's submit handler, as a
  // best-effort notification on top of the record kept here. A no-JS
  // submission (this route's <form> fallback) therefore has no email
  // notification path — only this log — until a JS-independent delivery
  // method replaces FormSubmit.co (see README).
  return wantsJson
    ? jsonResponse({ ok: true })
    : htmlResponse({ title: 'Thanks!', message: "We've got your details and will be in touch same working day." });
};
