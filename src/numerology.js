// Client-side numerology calculations.
// Pythagorean values are used for the core name numbers; Chaldean values
// drive the name-reduction pyramid.

export const PYTHAGOREAN = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8,
}

export const CHALDEAN = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 8, G: 3, H: 5, I: 1,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 7, P: 8, Q: 1, R: 2,
  S: 3, T: 4, U: 6, V: 6, W: 6, X: 5, Y: 1, Z: 7,
}

const VOWELS = new Set(['A', 'E', 'I', 'O', 'U'])

// Reduce to a single digit, but keep master numbers 11, 22, 33.
export function reduceMaster(n) {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split('').reduce((a, d) => a + Number(d), 0)
  }
  return n
}

// Reduce all the way to a single digit (no master numbers retained).
export function reduceSingle(n) {
  while (n > 9) {
    n = String(n).split('').reduce((a, d) => a + Number(d), 0)
  }
  return n
}

const letters = (name) => name.toUpperCase().split('').filter((c) => c >= 'A' && c <= 'Z')

export function lifePath(dob) {
  const digits = dob.replace(/-/g, '').split('').map(Number)
  return reduceMaster(digits.reduce((a, b) => a + b, 0))
}

export function expression(name) {
  const sum = letters(name).reduce((a, c) => a + (PYTHAGOREAN[c] || 0), 0)
  return reduceMaster(sum)
}

export function soulUrge(name) {
  const sum = letters(name)
    .filter((c) => VOWELS.has(c))
    .reduce((a, c) => a + (PYTHAGOREAN[c] || 0), 0)
  return reduceMaster(sum)
}

export function personality(name) {
  const sum = letters(name)
    .filter((c) => !VOWELS.has(c))
    .reduce((a, c) => a + (PYTHAGOREAN[c] || 0), 0)
  return reduceMaster(sum)
}

// Build the Chaldean reduction pyramid. Returns rows from base (letters)
// upward; each successive row sums adjacent values and reduces to a single
// digit. The base row holds { letter, value } objects; higher rows hold
// plain numbers.
export function chaldeanPyramid(name) {
  const ls = letters(name)
  if (!ls.length) return []
  const rows = [ls.map((c) => ({ letter: c, value: CHALDEAN[c] || 0 }))]
  let current = rows[0].map((x) => x.value)
  while (current.length > 1) {
    current = current.slice(0, -1).map((_, i) => reduceSingle(current[i] + current[i + 1]))
    rows.push(current)
  }
  return rows
}

// Four pinnacle cycles and their matching challenge numbers.
// Standard method: reduce month, day and year to single digits FIRST,
// then sum. Pinnacles retain master numbers; challenges are always single
// digits (and can legitimately be 0).
export function pinnacles(dob, lifePathNumber) {
  const [year, month, day] = dob.split('-').map(Number)
  const m = reduceSingle(month)
  const d = reduceSingle(day)
  const y = reduceSingle(year)

  const p1 = reduceMaster(m + d)
  const p2 = reduceMaster(d + y)
  const p3 = reduceMaster(reduceSingle(p1) + reduceSingle(p2))
  const p4 = reduceMaster(m + y)

  const c1 = reduceSingle(Math.abs(m - d))
  const c2 = reduceSingle(Math.abs(d - y))
  const c3 = reduceSingle(Math.abs(c1 - c2))
  const c4 = reduceSingle(Math.abs(m - y))

  // The pinnacle age boundaries use the single-digit life path, even when the
  // life path itself is a master number (e.g. 11 -> 2, giving a boundary of 34).
  const firstEnd = 36 - reduceSingle(lifePathNumber)

  return [
    { title: 'First', pinnacle: p1, challenge: c1, a: m, b: d, aLabel: 'month', bLabel: 'day', start: 0, end: firstEnd },
    { title: 'Second', pinnacle: p2, challenge: c2, a: d, b: y, aLabel: 'day', bLabel: 'year', start: firstEnd, end: firstEnd + 9 },
    { title: 'Third', pinnacle: p3, challenge: c3, a: p1, b: p2, aLabel: 'P1', bLabel: 'P2', start: firstEnd + 9, end: firstEnd + 18, compound: { c1, c2 } },
    { title: 'Fourth', pinnacle: p4, challenge: c4, a: m, b: y, aLabel: 'month', bLabel: 'year', start: firstEnd + 18, end: null },
  ]
}

export const NUMBER_MEANING = {
  1: 'Leader, pioneer, independent spirit.',
  2: 'Diplomat, intuitive, seeks harmony.',
  3: 'Creative, expressive, joyful communicator.',
  4: 'Builder, practical, disciplined, reliable.',
  5: 'Adventurer, freedom-seeker, versatile.',
  6: 'Nurturer, responsible, family-centred.',
  7: 'Seeker, analytical, spiritual depth.',
  8: 'Achiever, powerful, material mastery.',
  9: 'Humanitarian, compassionate, wise.',
  11: 'Master intuitive — heightened sensitivity and spiritual gifts.',
  22: 'Master builder — turns grand visions into reality.',
  33: 'Master teacher — devoted to uplifting others.',
}

export const NUMBER_TAG = {
  1: 'The leader', 2: 'The peacemaker', 3: 'The creator', 4: 'The builder',
  5: 'The freedom seeker', 6: 'The nurturer', 7: 'The seeker', 8: 'The powerhouse',
  9: 'The humanitarian', 11: 'Master 11', 22: 'Master 22', 33: 'Master 33',
}

export const PINNACLE_MEANING = {
  1: 'New beginnings, self-reliance, forging your own path.',
  2: 'Cooperation, patience, meaningful partnerships.',
  3: 'Creative expression, joy, social connection.',
  4: 'Hard work, discipline, building solid foundations.',
  5: 'Change, freedom, embracing the unexpected.',
  6: 'Responsibility, family, nurturing relationships.',
  7: 'Introspection, learning, spiritual seeking.',
  8: 'Ambition, material achievement, personal authority.',
  9: 'Completion, service, letting go of the past.',
  11: 'Heightened intuition, inspiration, spiritual illumination.',
  22: 'Ambitious building on a grand scale with lasting impact.',
  33: 'Deep compassion, creative mastery, service to humanity.',
}

export const CHALLENGE_MEANING = {
  0: 'No specific obstacle — face all challenges; great potential and responsibility.',
  1: "Building self-reliance and confidence independent of others' approval.",
  2: 'Developing patience and decisiveness without over-sensitivity.',
  3: 'Focusing scattered creative energy and overcoming self-doubt.',
  4: 'Embracing discipline without feeling trapped by limitation.',
  5: 'Overcoming fear of change and finding healthy freedom.',
  6: 'Accepting responsibility without controlling others.',
  7: 'Trusting others and overcoming isolation or scepticism.',
  8: 'Balancing ambition and integrity; avoiding misuse of power.',
}
