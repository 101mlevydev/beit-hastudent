# Content & Copy Review — בית הסטודנט (Step 12 gate artifact)

> ⛔ **THIS IS A GATE.** Everything below is a careful first draft authored by the
> build agent. It must be reviewed by the **owner / a native Hebrew speaker** before
> final acceptance. Two things gate here: (1) the **seed benchmark ranges + walk-times**,
> and (2) **every Hebrew string** (verdict lines, red-flag question phrasings, the legal
> disclaimers, and the WhatsApp negotiation templates). The negotiation message must read
> like a real, savvy student wrote it and be **sendable as-is**.
>
> **Status: AWAITING OWNER / NATIVE-SPEAKER APPROVAL.** Mark items ✅ / ✏️ (edit) / ❌.

---

## 1. Seed benchmark ranges (`public/benchmarks.json`)

`dataDate: 2026-06` · labeled *"טווחים מקומיים משוערים לעיון בלבד — לא מדד מחירים רשמי. ניתן לעריכה."*
These are **placeholder rough local reference** values — confirm against real local knowledge.

| Area (key) | name | ₪/room min–typical–max | walk min–max |
|---|---|---|---|
| gimel | שכונה ג' | 1,400 · 1,600 · 1,750 | 6–16 |
| dalet | שכונה ד' | 1,300 · 1,500 · 1,650 | 10–22 |
| ringelblum | רינגלבלום | 1,300 · 1,450 · 1,600 | 12–25 |
| masada | מצדה | 1,350 · 1,500 · 1,650 | 8–18 |
| old-city | העיר העתיקה | 1,250 · 1,450 · 1,650 | 10–20 |
| fallback | סטודנטים בבאר שבע (כללי) | 1,250 · 1,500 · 1,750 | 8–25 |

**Review questions:** Are these per-room ranges realistic for 2026? Walk-times from the
main BGU gate? Any neighborhood to add/split? Notes for old-city ("מבנים ישנים") OK?

---

## 2. Scoring "feel" (`public/scoring-config.json`)

Re-balance against the engine fixtures (`src/lib/engine/__tests__/fixtures.test.mjs`).
Current fixture outcomes (must still *feel fair* after any edit):

- **Demo (שכונה ג', ₪3,770 true / ₪1,885 per-room, floor 4 no-elevator, deposit 3mo + cash + pressure):** value **56** (amber "סביר — אפשר לנסות לשפר."), risk **גבוה**.
- **Great deal (שכונה ד', ₪1,275 per-room, furnished, clean):** value **91** ("עסקה טובה."), risk **נמוך**.
- **Over-market (מצדה, ₪2,850 per-room):** value **40** ("עדיף לוותר."), risk נמוך.
- **Trap (רינגלבלום, floor 6 no-elevator, deposit-before-viewing + cash + no-contract ad):** value 50, risk **גבוה** (5 flags).

> Note: the original spec illustration mentioned "ציון 64" for the demo; the honest rubric
> currently yields **56** (same amber band + same verdict). Tune `scoring-config.json` if a
> specific number is desired — it is a data edit, no code change.

---

## 3. Verdict bands (`public/scoring-config.json` → `valueBands`)

| score | verdict line |
|---|---|
| ≤ 40 | עדיף לוותר. |
| 41–70 | סביר — אפשר לנסות לשפר. |
| 71+ | עסקה טובה. |

Verdict **subline** is generated from the breakdown, e.g. *"המחיר והקומה מורידים את הערך."*

---

## 4. Risk labels & sublines (`src/lib/copy.js` → RISK)

| level | label | subline |
|---|---|---|
| low | נמוך | תנאי העסקה נראים תקינים |
| med | בינוני | יש כמה דברים ששווה לוודא |
| high | גבוה | בתנאי העסקה יש דגלים אדומים |

---

## 5. Red-flag question phrasings (`public/red-flags.json`)

Each worded as a **question to ask**, never an accusation.

| code | label | ask (question to ask) | severity |
|---|---|---|---|
| deposit_high | פיקדון גבוה (3 חודשים ומעלה) | בקשו לעגן בחוזה את גובה הפיקדון ואת מועד ההחזר המלא בסוף השכירות. | high |
| deposit_early | פיקדון נדרש עוד לפני שראיתם את הדירה | אל תעבירו כסף לפני שראיתם את הדירה בעיניים וחתמתם על חוזה. | high |
| cash_only | תשלום במזומן בלבד | בקשו לשלם בהעברה בנקאית ולקבל קבלה על כל תשלום. | high |
| no_contract | ללא חוזה שכירות כתוב | התעקשו על חוזה שכירות כתוב וחתום לפני כל תשלום. | high |
| no_receipts | אין קבלות על תשלומים | בקשו קבלה מסודרת על דמי השכירות והפיקדון — זו ההוכחה שלכם. | medium |
| refuses_viewing | סירוב להראות את הדירה לפני סגירה | בקשו לראות את הדירה עצמה — לא רק תמונות — לפני שמתחייבים. | high |
| pressure | לחץ לסגור מהר | קחו זמן לעבור על התנאים בנחת — לחץ לסגור 'עכשיו' הוא דגל אדום. | medium |
| too_good | מחיר נמוך בצורה חריגה מהמקובל | מחיר טוב מדי? ודאו שהדירה והבעלים אמיתיים לפני כל תשלום. | medium |

Ad-text keyword triggers: "מזומן בלבד", "רק מזומן", "ללא חוזה", "מיידי", "יש המון מתעניינים", "נחטף", "בלי לראות", …

---

## 6. Legal disclaimers (`src/lib/copy.js` → DISCLAIMER) — on EVERY risk surface

- **full:** מדריך זהירות — אינו ייעוץ משפטי או פיננסי. אלו שאלות לבדוק מול בעל הדירה, לא קביעה על אדם או מודעה.
- **short:** מדריך זהירות — אינו ייעוץ משפטי. נוסח לעריכה חופשית לפני שליחה.
- **ranges:** מדריך זהירות — אינו ייעוץ משפטי או פיננסי. הטווחים מקומיים ומשוערים, לעיון בלבד.

---

## 7. Negotiation-script templates (`src/lib/engine/negotiation.js`) — THE signature copy

Clause library (selected by findings, filled with numbers). Must read as a real student & be sendable as-is.

- **Intro:** היי 🙂 ראיתי את המודעה לדירה ב{שכונה} ומאוד התעניינתי.
- **Price (above range):** עשיתי קצת שיעורי בית — טווח השכירות המקובל ב{שכונה} הוא בערך ₪{min}–{max} לחדר, וכאן עם הארנונה וועד הבית זה יוצא בערך ₪{perRoom} לחדר — מעט מעל הטווח.
- **Price (fair/below):** המחיר נראה לי הוגן ביחס לאזור, אז מבחינתי זה נשמע מעניין מאוד.
- **Floor:** שמתי לב שמדובר בקומה {floor} ללא מעלית, מה שקצת משפיע בשבילי.
- **Counter-offer:** אשמח אם נוכל לדבר על שכר דירה של ₪{counter} לחודש — נראה לי הוגן לשני הצדדים.
- **Deposit:** ולגבי הפיקדון — אשמח לעגן בחוזה את גובהו ואת מועד ההחזר המלא בסוף השכירות.
- **Contract:** חשוב לי שנעבוד עם חוזה שכירות כתוב וחתום — זה מסדר את הציפיות לשנינו.
- **Cash:** לגבי התשלומים, אני מעדיף/ה העברה בנקאית עם קבלה — ככה לשנינו יש תיעוד מסודר.
- **Outro:** תודה רבה, ואשמח לתאם צפייה! 🙂

> Example assembled message for the demo listing is in the fixtures output (Fixture A).
> **Open question:** gender — currently uses neutral forms + one "מעדיף/ה". Confirm preferred register.

---

## 8. UI strings (`src/lib/copy.js` → UI) — buttons, labels

המשך › · ‹ חזרה · מחשבים… · ✍️ כתוב לי הודעה למשא ומתן · שמור דירה · בדוק דירה אחרת ·
📋 העתק הודעה · ✓ הועתק — אפשר להדביק בוואטסאפ · שלח בוואטסאפ · ⚖️ השווה את הדירות ·
+ בדוק דירה חדשה · הדירות שלי · נתונים משוערים · איפה ירד הערך? · עלות חודשית אמיתית ·
מחיר לחדר מול השכונה · דגלים אדומים — שאלות לשאול · לא זוהו דגלים אדומים בתנאים שהוזנו · טווח מקובל

---

### Sign-off
- [ ] Benchmark ranges + walk-times approved (or corrected)
- [ ] `scoring-config.json` balance approved against fixtures
- [ ] All Hebrew strings read natural / native (not AI)
- [ ] Negotiation message sendable as-is; gender register confirmed
- [ ] Disclaimers approved for every risk surface
