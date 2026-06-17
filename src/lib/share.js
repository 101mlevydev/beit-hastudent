// Sharing helpers. Builds a shareable URL for the current deployment and opens
// a WhatsApp share intent (wa.me) with a pre-filled message. SHARE_URL_OVERRIDE
// lets us hard-code a canonical URL if the app is ever embedded elsewhere.

const SHARE_URL_OVERRIDE = '';

export const shareUrl = (extra = '') =>
  (SHARE_URL_OVERRIDE || (location.origin + location.pathname)) + extra;

export const shareWhatsApp = (msg) =>
  window.open('https://wa.me/?text=' + encodeURIComponent(msg + ' ' + shareUrl()), '_blank');
