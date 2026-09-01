// Central source of truth for contact details and WhatsApp deep links.
// If the Paarl operation gets its own number, update it here only —
// every CTA on the site is built from these constants.

export const PHONE_DISPLAY = '072 500 8900';
export const PHONE_INTL_DISPLAY = '(+27) 072 500 8900';
export const PHONE_TEL = '+27725008900';
export const WHATSAPP_NUMBER = '27725008900';
export const EMAIL = 'info@stelliesremovals.com';

const WA_BASE = `https://wa.me/${WHATSAPP_NUMBER}`;

/** Build a wa.me link with an optional pre-filled, URL-encoded message. */
export function waLink(message?: string): string {
  if (!message) return WA_BASE;
  return `${WA_BASE}?text=${encodeURIComponent(message)}`;
}

export const WA_MESSAGE_DEFAULT = "Hi Stellies Removals, I'd like a quote for a move in Paarl.";

export const WA_MESSAGE_BY_SERVICE = {
  home: 'Hi, I need a quote for a home removal in Paarl.',
  office: 'Hi, I need a quote for an office relocation in Paarl.',
  packing: 'Hi, I need a quote for packing in Paarl.',
  hoisting: 'Hi, I need a quote for hoisting in Paarl.',
} as const;
