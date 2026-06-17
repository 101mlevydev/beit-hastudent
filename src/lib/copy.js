// ============================================================================
// Central Hebrew copy. ONE voice, ONE place to edit.
//
// ⚠️ CONTENT-GATE NOTE (Step 12): the Hebrew below is a careful first draft by
// the author, meant to read like a real, savvy BGU student — NOT final. It is
// awaiting the native-speaker / owner review at the Step 12 content & copy gate
// (verdict sublines, red-flag phrasings, disclaimers, negotiation templates).
// Negotiation-script templates live in lib/engine/negotiation.js; verdict band
// headlines live in public/scoring-config.json. This module holds UI strings,
// the legal disclaimers, and the descriptive sublines.
// ============================================================================

export const APP = {
  name: 'בית הסטודנט',
  tagline: 'בודקים דירה לפני שחותמים',
};

// The standing legal line — must appear on EVERY risk surface (results flags,
// negotiation, compare). Risk scores terms/listings, never a named person.
export const DISCLAIMER = {
  full: 'מדריך זהירות — אינו ייעוץ משפטי או פיננסי. אלו שאלות לבדוק מול בעל הדירה, לא קביעה על אדם או מודעה.',
  short: 'מדריך זהירות — אינו ייעוץ משפטי. נוסח לעריכה חופשית לפני שליחה.',
  ranges: 'מדריך זהירות — אינו ייעוץ משפטי או פיננסי. הטווחים מקומיים ומשוערים, לעיון בלבד.',
};

// Risk level → label + a short, non-alarmist subline (terms, not people).
export const RISK = {
  low: { label: 'נמוך', emoji: '🛡️', sub: 'תנאי העסקה\nנראים תקינים' },
  med: { label: 'בינוני', emoji: '⚠️', sub: 'יש כמה דברים\nששווה לוודא' },
  high: { label: 'גבוה', emoji: '⚠️', sub: 'בתנאי העסקה\nיש דגלים אדומים' },
};

// Where your ₪/room sits vs the neighborhood range.
export const POSITION = {
  below: { label: 'מתחת לטווח', tone: 'below' },
  within: { label: 'בתוך הטווח', tone: 'within' },
  above: { label: 'מעל הטווח', tone: 'above' },
};

// Furnished options.
export const FURNISHED = {
  full: 'מרוהטת',
  partial: 'חלקי',
  none: 'לא מרוהטת',
};

// Deposit timing options.
export const DEPOSIT_TIMING = {
  before_viewing: 'לפני צפייה בדירה',
  before_signing: 'לפני חתימת חוזה',
  on_signing: 'במעמד החתימה',
};

// Generic UI strings.
export const UI = {
  continue: 'המשך ›',
  back: '‹ חזרה',
  calculating: 'מחשבים…',
  toNegotiation: '✍️ כתוב לי הודעה למשא ומתן',
  save: 'שמור דירה',
  checkAnother: 'בדוק דירה אחרת',
  copy: '📋 העתק הודעה',
  copied: '✓ הועתק — אפשר להדביק בוואטסאפ',
  sendWa: 'שלח בוואטסאפ',
  compare: '⚖️ השווה את הדירות',
  newListing: '+ בדוק דירה חדשה',
  myListings: 'הדירות שלי',
  approximate: 'נתונים משוערים',
  whereValueDropped: 'איפה ירד הערך?',
  trueCost: 'עלות חודשית אמיתית',
  perRoomVsHood: 'מחיר לחדר מול השכונה',
  flagsTitle: 'דגלים אדומים — שאלות לשאול',
  noFlags: 'לא זוהו דגלים אדומים בתנאים שהוזנו',
  rangeLabel: 'טווח מקובל',
};
