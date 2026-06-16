# Numerology calculator

A single-page React app for numerology calculations. Enter a full birth name and
date of birth to compute core numbers, a Chaldean name-reduction pyramid, and the
four pinnacle and challenge life cycles. All logic runs client-side — no network calls.

## What it calculates

- **Life path** — from the digits of the date of birth.
- **Expression (destiny)** — Pythagorean values of every letter in the name.
- **Soul urge** — Pythagorean values of the vowels only.
- **Personality** — Pythagorean values of the consonants only.
- **Chaldean name pyramid** — letters at the base with their Chaldean values; each row
  sums adjacent values and reduces to a single digit, up to a single peak.
- **Pinnacle & challenge cycles** — four life periods, each shown as a diamond with its
  pinnacle number (top) and challenge number (bottom).

### Method notes

- Core numbers and pinnacles retain master numbers **11, 22, 33**.
- Pinnacles and challenges are derived from the **single-digit** reductions of the birth
  month, day and year (master numbers are not retained in the components); only the final
  pinnacle sum may be a master number. Challenge numbers are always single digits and can
  legitimately be 0.

## Run locally

```bash
npm install
npm run dev
```

Then open the printed local URL. Build a production bundle with `npm run build`.

## Stack

Vite + React + Tailwind CSS.
