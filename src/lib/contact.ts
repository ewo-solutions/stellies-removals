// Central source of truth for contact details.
// If the Paarl operation gets its own number, update it here only —
// every CTA on the site is built from these constants.

export const PHONE_DISPLAY = '072 500 8900';
export const PHONE_INTL_DISPLAY = '(+27) 072 500 8900';
export const PHONE_TEL = '+27725008900';
export const EMAIL = 'info@stelliesremovals.com';

// The list of services shown on the site and offered as options in the
// enquiry form's "what do you need?" field. Keep this the one place both
// read from so the two stay in sync.
export const SERVICES = ['Home removals', 'Office relocations', 'Packing', 'Hoisting'] as const;
