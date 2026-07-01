import { useMemo, useState } from 'react'
import {
  lifePath, expression, soulDesire, selfImage, legacy,
  namePyramid, pinnacles, SYSTEMS,
  NUMBER_MEANING, NUMBER_TAG, PINNACLE_MEANING, CHALLENGE_MEANING,
} from './numerology.js'

const CORE = [
  { key: 'lifePath', label: 'Life path', sub: 'from date of birth', color: '#534AB7', tagBg: '#EEEDFE', tagText: '#3C3489' },
  { key: 'expression', label: 'Expression', sub: 'all letters', color: '#0F6E56', tagBg: '#E1F5EE', tagText: '#085041' },
  { key: 'soulDesire', label: 'Soul desire', sub: 'vowels', color: '#993C1D', tagBg: '#FAECE7', tagText: '#712B13' },
  { key: 'selfImage', label: 'Self-image', sub: 'consonants', color: '#854F0B', tagBg: '#FAEEDA', tagText: '#633806' },
  { key: 'legacy', label: 'Legacy', sub: 'last digit of birth year', color: '#185FA5', tagBg: '#E6F1FB', tagText: '#0C447C' },
]

function Pyramid({ rows }) {
  // rows[0] is the base of { letter, value } objects; rows[1..] are numeric.
  // Render the numeric rows top-down, then the letter base row separately.
  const numericRows = rows.slice(1).reverse()
  return (
    <div className="overflow-x-auto pb-1">
      <div className="min-w-fit mx-auto">
        {numericRows.map((row, ri) => {
          const isTop = ri === numericRows.length - 1
          return (
            <div key={ri} className="flex justify-center gap-1.5 mb-1.5">
              {row.map((v, i) => (
                <div
                  key={i}
                  className={
                    isTop
                      ? 'w-11 h-11 rounded-md flex items-center justify-center text-lg font-medium text-lilac bg-royal'
                      : 'w-9 h-9 rounded-md flex items-center justify-center text-[13px] font-medium text-[#3C3489] bg-lilac border border-lilacEdge'
                  }
                >
                  {v}
                </div>
              ))}
            </div>
          )
        })}
        <div className="flex justify-center gap-1.5">
          {rows[0].map((cell, i) => (
            <div key={i} className="w-9 h-9 rounded-md flex flex-col items-center justify-center bg-white border border-black/10">
              <span className="text-[11px] font-medium leading-none">{cell.letter}</span>
              <span className="text-[9px] text-gray-500">{cell.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Diamond({ p }) {
  const compNote = p.compound
  return (
    <svg viewBox="0 0 200 182" className="w-full block">
      <line x1="100" y1="28" x2="28" y2="90" stroke="#D3D1C7" strokeWidth="1" />
      <line x1="100" y1="28" x2="172" y2="90" stroke="#D3D1C7" strokeWidth="1" />
      <line x1="28" y1="90" x2="100" y2="152" stroke="#D3D1C7" strokeWidth="1" />
      <line x1="172" y1="90" x2="100" y2="152" stroke="#D3D1C7" strokeWidth="1" />
      <text x="100" y="58" textAnchor="middle" fill="#D3D1C7" fontSize="11">+</text>
      <text x="100" y="130" textAnchor="middle" fill="#D3D1C7" fontSize="10">|−|</text>
      <text x="100" y="9" textAnchor="middle" fill="#888780" fontSize="9">pinnacle</text>
      <circle cx="100" cy="28" r="19" fill="#534AB7" />
      <text x="100" y="33" textAnchor="middle" fill="#EEEDFE" fontSize="15" fontWeight="500">{p.pinnacle}</text>
      <circle cx="28" cy="90" r="17" fill="#EEEDFE" stroke="#AFA9EC" strokeWidth="0.5" />
      <text x="28" y="95" textAnchor="middle" fill="#3C3489" fontSize="12" fontWeight="500">{p.a}</text>
      <text x="28" y="124" textAnchor="middle" fill="#888780" fontSize="8">{p.aLabel}</text>
      <circle cx="172" cy="90" r="17" fill="#EEEDFE" stroke="#AFA9EC" strokeWidth="0.5" />
      <text x="172" y="95" textAnchor="middle" fill="#3C3489" fontSize="12" fontWeight="500">{p.b}</text>
      <text x="172" y="124" textAnchor="middle" fill="#888780" fontSize="8">{p.bLabel}</text>
      {compNote && (
        <>
          <text x="28" y="115" textAnchor="middle" fill="#B4B2A9" fontSize="7.5">c1={compNote.c1}</text>
          <text x="172" y="115" textAnchor="middle" fill="#B4B2A9" fontSize="7.5">c2={compNote.c2}</text>
        </>
      )}
      <text x="100" y="174" textAnchor="middle" fill="#888780" fontSize="9">challenge</text>
      <circle cx="100" cy="152" r="19" fill="#FAECE7" stroke="#F0997B" strokeWidth="0.5" />
      <text x="100" y="157" textAnchor="middle" fill="#712B13" fontSize="15" fontWeight="500">{p.challenge}</text>
    </svg>
  )
}

export default function App() {
  const [name, setName] = useState('')
  const [dob, setDob] = useState('')
  const [system, setSystem] = useState('pythagorean')
  const [submitted, setSubmitted] = useState(null)

  const calculate = () => {
    if (!name.trim() || !dob) return
    setSubmitted({ name: name.trim(), dob })
  }

  // Recompute whenever the submitted inputs or the active system change, so the
  // Chaldean/Pythagorean toggle updates the name numbers and pyramid live.
  const result = useMemo(() => {
    if (!submitted) return null
    const { name: n, dob: d } = submitted
    const lp = lifePath(d)
    return {
      name: n,
      dob: d,
      core: {
        lifePath: lp,
        expression: expression(n, system),
        soulDesire: soulDesire(n, system),
        selfImage: selfImage(n, system),
        legacy: legacy(d),
      },
      pyramid: namePyramid(n, system),
      pinnacles: pinnacles(d, lp),
    }
  }, [submitted, system])

  const nowAge = useMemo(() => {
    if (!result) return null
    return new Date().getFullYear() - Number(result.dob.split('-')[0])
  }, [result])

  const segColors = ['#EEEDFE', '#E1F5EE', '#FAECE7', '#FAEEDA']

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-medium text-ink mb-1">Numerology calculator</h1>
      <p className="text-sm text-gray-500 mb-6">Enter your full birth name and date of birth.</p>

      <div className="bg-white rounded-xl border border-black/10 p-5 mb-6">
        <label className="block text-[13px] text-gray-500 mb-1.5">Full birth name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Maria Anne Santos"
          className="w-full mb-4 px-3 py-2 rounded-md border border-black/10 outline-none focus:border-royal"
        />
        <label className="block text-[13px] text-gray-500 mb-1.5">Date of birth</label>
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="w-full mb-4 px-3 py-2 rounded-md border border-black/10 outline-none focus:border-royal"
        />
        <label className="block text-[13px] text-gray-500 mb-1.5">Name calculation system</label>
        <div className="flex gap-1 mb-4 p-1 bg-gray-100 rounded-md">
          {Object.entries(SYSTEMS).map(([key, s]) => (
            <button
              key={key}
              type="button"
              onClick={() => setSystem(key)}
              className={
                'flex-1 py-1.5 rounded text-sm font-medium transition-colors ' +
                (system === key ? 'bg-white text-ink shadow-sm' : 'text-gray-500 hover:text-ink')
              }
            >
              {s.label}
            </button>
          ))}
        </div>
        <button
          onClick={calculate}
          className="w-full py-2.5 rounded-md bg-royal text-white font-medium hover:bg-ink transition-colors"
        >
          Calculate my numbers
        </button>
      </div>

      {result && (
        <div>
          <div className="flex items-baseline justify-between mb-3">
            <h2 className="text-base font-medium">Core numbers</h2>
            <span className="text-[11px] text-gray-400">Name numbers use {SYSTEMS[system].label}</span>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-8">
            {CORE.map((c) => {
              const n = result.core[c.key]
              return (
                <div key={c.key} className="bg-white rounded-md border border-black/5 p-4 text-center">
                  <div className="text-4xl font-medium leading-none mb-1" style={{ color: c.color }}>{n}</div>
                  <div className="text-xs text-gray-500">{c.label}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{c.sub}</div>
                  {NUMBER_TAG[n] && (
                    <div
                      className="inline-block text-[11px] px-2 py-0.5 rounded-md mt-1"
                      style={{ background: c.tagBg, color: c.tagText }}
                    >
                      {NUMBER_TAG[n]}
                    </div>
                  )}
                  {NUMBER_MEANING[n] && (
                    <div className="text-[11px] text-gray-400 mt-1.5 leading-snug">{NUMBER_MEANING[n]}</div>
                  )}
                </div>
              )
            })}
          </div>

          <h2 className="text-base font-medium mb-3 text-center">{SYSTEMS[system].label} name pyramid</h2>
          <Pyramid rows={result.pyramid} />
          {(() => {
            const top = result.pyramid[result.pyramid.length - 1][0]
            const peak = typeof top === 'object' ? top.value : top
            return (
              <p className="text-[11px] text-gray-400 text-center mt-2.5">
                Pyramid peak: {peak} — {NUMBER_MEANING[peak]}
              </p>
            )
          })()}

          <h2 className="text-base font-medium mb-3 mt-8">Pinnacle &amp; challenge cycles</h2>
          <div className="flex h-1.5 rounded-full overflow-hidden mb-1 bg-gray-100">
            {result.pinnacles.map((p, i) => {
              const span = (p.end ?? p.start + 36) - p.start
              return <div key={i} style={{ flex: span, background: segColors[i] }} />
            })}
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 mb-6">
            {result.pinnacles.map((p) => <span key={p.title}>Age {p.start}</span>)}
            <span>{result.pinnacles[3].start}+</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {result.pinnacles.map((p) => {
              const isCur = nowAge >= p.start && (p.end === null || nowAge < p.end)
              const ageStr = p.end ? `Ages ${p.start}–${p.end}` : `Age ${p.start}+`
              return (
                <div
                  key={p.title}
                  className={`rounded-xl p-3 bg-white border ${isCur ? 'border-royal border-[1.5px]' : 'border-black/10'}`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-medium">
                      {p.title}
                      {isCur && <span className="text-[9px] bg-lilac text-[#3C3489] rounded-md px-1.5 py-0.5 ml-1">now</span>}
                    </span>
                    <span className="text-[10px] text-gray-400">{ageStr}</span>
                  </div>
                  <Diamond p={p} />
                  <div className="mt-1">
                    <div className="flex gap-1.5 items-start mt-1.5">
                      <span className="text-[9px] font-medium px-1.5 rounded-md bg-lilac text-[#3C3489] mt-0.5">P</span>
                      <span className="text-[10px] text-gray-400 leading-snug">{PINNACLE_MEANING[p.pinnacle]}</span>
                    </div>
                    <div className="flex gap-1.5 items-start mt-1.5">
                      <span className="text-[9px] font-medium px-1.5 rounded-md bg-coralFill text-[#712B13] mt-0.5">C</span>
                      <span className="text-[10px] text-gray-400 leading-snug">{CHALLENGE_MEANING[p.challenge]}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
