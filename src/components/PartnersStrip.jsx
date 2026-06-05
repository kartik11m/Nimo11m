import { useState } from 'react'

const syne  = { fontFamily: "'Syne', sans-serif" }
const dmSans = { fontFamily: "'DM Sans', sans-serif" }
const bebasNeue = { fontFamily: "'Bebas Neue', sans-serif" }

// ── Partner data ──────────────────────────────────────────────────
const partners = [
  { name: 'Sagar Public School',        city: 'Sagar',    type: 'Robotics Lab',     color: '#FF6B35', rgb: '255,107,53'  },
  { name: 'Saraswati Vidhya Mandir',    city: 'Bhopal',   type: 'STEM Lab',          color: '#00F5FF', rgb: '0,245,255'   },
  { name: 'Govt. Boys HSS',             city: 'Vidisha',  type: 'ATL Lab',           color: '#A855F7', rgb: '168,85,247'  },
  { name: 'St. Xavier\'s School',       city: 'Bhopal',   type: 'Innovation Center', color: '#FF006E', rgb: '255,0,110'   },
  { name: 'Kendriya Vidyalaya',         city: 'Raisen',   type: 'Robotics Lab',     color: '#FF6B35', rgb: '255,107,53'  },
  { name: 'LNCT College',               city: 'Bhopal',   type: 'AI & ML Lab',      color: '#00F5FF', rgb: '0,245,255'   },
  { name: 'Govt. Engineering College',  city: 'Ujjain',   type: 'Drone Lab',        color: '#A855F7', rgb: '168,85,247'  },
  { name: 'Navodaya Vidyalaya',         city: 'Sehore',   type: 'ATL Lab',          color: '#FF006E', rgb: '255,0,110'   },
  { name: 'DPS Bhopal',                 city: 'Bhopal',   type: 'School Tech Infra', color: '#FF6B35', rgb: '255,107,53'  },
  { name: 'Tagore Public School',       city: 'Indore',   type: 'STEM Lab',         color: '#00F5FF', rgb: '0,245,255'   },
  { name: 'IIT Indore',                 city: 'Indore',   type: 'Innovation Center', color: '#A855F7', rgb: '168,85,247'  },
  { name: 'Millennium School',          city: 'Jabalpur', type: 'Robotics Lab',     color: '#FF006E', rgb: '255,0,110'   },
]

// Shuffle slightly for row 2
const partnersRow2 = [...partners.slice(6), ...partners.slice(0, 6)]

// ── Partner chip ───────────────────────────────────────────────────
function PartnerChip({ partner }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      className="inline-flex items-center gap-3 px-5 py-3 flex-shrink-0 transition-all duration-300"
      style={{
        background:  hov ? `rgba(${partner.rgb},.1)` : 'rgba(255,255,255,.03)',
        border:      `1px solid ${hov ? `rgba(${partner.rgb},.42)` : 'rgba(255,255,255,.07)'}`,
        transform:   hov ? 'translateY(-3px)' : 'none',
        boxShadow:   hov ? `0 0 20px rgba(${partner.rgb},.18)` : 'none',
        cursor:      'default',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Color dot */}
      <div
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{
          background: partner.color,
          boxShadow:  hov ? `0 0 8px rgba(${partner.rgb},.8)` : 'none',
          transition: 'box-shadow .3s ease',
        }}
      />

      <div>
        <div
          className="text-[11px] font-bold leading-tight whitespace-nowrap"
          style={{ ...syne, color: hov ? '#F0EAD6' : 'rgba(240,234,214,.65)' }}
        >
          {partner.name}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span
            className="text-[7px] font-bold tracking-[.3em] uppercase whitespace-nowrap"
            style={{ ...syne, color: hov ? partner.color : `rgba(${partner.rgb},.55)` }}
          >
            {partner.type}
          </span>
          <span className="w-px h-2.5 bg-white/[.15]" />
          <span
            className="text-[8px] font-light tracking-[.04em] text-[#F0EAD6]/28 whitespace-nowrap"
            style={dmSans}
          >
            {partner.city}
          </span>
        </div>
      </div>
    </div>
  )
}

// ── MAIN EXPORT ───────────────────────────────────────────────────
export default function PartnersStrip() {
  return (
    <section className="relative overflow-hidden py-16 bg-[#050508] border-y border-white/[.055]">

      {/* Atmosphere */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(0,0,0,.055) 3px,rgba(0,0,0,.055) 4px)',
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,107,53,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,107,53,.018) 1px,transparent 1px)',
        backgroundSize:  '48px 48px',
      }} />

      {/* ── Header ── */}
      <div className="relative z-[2] max-w-[1100px] mx-auto px-12 mb-10">
        <div className="flex items-center justify-between gap-8 flex-wrap">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-[6px] bg-[#FF6B35]/[.07] border border-[#FF6B35]/[.22] mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse" />
              <span className="text-[8px] font-bold tracking-[.42em] uppercase text-[#FF6B35]" style={syne}>
                Trusted By
              </span>
            </div>
            <div>
              <span className="block leading-[.9]" style={{
                ...bebasNeue,
                fontSize: 'clamp(28px,4vw,48px)',
                WebkitTextStroke: '1px rgba(240,234,214,.35)',
                color: 'transparent',
              }}>80+ SCHOOLS &</span>
              <span className="block leading-[.9] text-[#FF6B35]" style={{
                ...bebasNeue,
                fontSize: 'clamp(28px,4vw,48px)',
                textShadow: '0 0 28px rgba(255,107,53,.35)',
              }}>INSTITUTIONS</span>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex gap-6 flex-wrap">
            {[
              { num: '12+', label: 'States',         color: '#FF6B35' },
              { num: '80+', label: 'Institutions',   color: '#00F5FF' },
              { num: '8',   label: 'Lab Types',      color: '#A855F7' },
              { num: '40+', label: 'Labs Installed', color: '#FF006E' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="leading-none" style={{ ...bebasNeue, fontSize: '1.6rem', color: s.color }}>
                  {s.num}
                </div>
                <div className="text-[7px] font-bold tracking-[.3em] uppercase text-[#F0EAD6]/25 mt-0.5" style={syne}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Marquee rows ── */}
      <div className="relative z-[2] flex flex-col gap-3">

        {/* Left edge fade */}
        <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right,#050508,transparent)' }} />
        {/* Right edge fade */}
        <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left,#050508,transparent)' }} />

        {/* Row 1 — scrolls left */}
        <div className="overflow-hidden">
          <div
            className="flex gap-3"
            style={{ animation: 'partnersLeft 38s linear infinite', width: 'max-content' }}
          >
            {[...partners, ...partners].map((p, i) => (
              <PartnerChip key={`r1-${i}`} partner={p} />
            ))}
          </div>
        </div>

        {/* Row 2 — scrolls right */}
        <div className="overflow-hidden">
          <div
            className="flex gap-3"
            style={{ animation: 'partnersRight 42s linear infinite', width: 'max-content' }}
          >
            {[...partnersRow2, ...partnersRow2].map((p, i) => (
              <PartnerChip key={`r2-${i}`} partner={p} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom: trust indicators ── */}
      <div className="relative z-[2] max-w-[1100px] mx-auto px-12 mt-10">
        <div className="h-[1.5px] mb-7"
          style={{ background: 'linear-gradient(90deg,#FF6B35,rgba(168,85,247,.5),transparent)' }} />
        <div className="flex items-center gap-8 flex-wrap">
          {[
            { icon: '🏛️', text: 'AIM ATL Compliant',      color: '#FF6B35' },
            { icon: '📋', text: 'NEP 2020 Aligned',        color: '#00F5FF' },
            { icon: '🏆', text: 'CBSE STEM Recognised',    color: '#A855F7' },
            { icon: '🛡️', text: 'ISO Quality Practices',   color: '#FF006E' },
            { icon: '⭐', text: '4.9 / 5 Client Rating',   color: '#FF6B35' },
          ].map(t => (
            <div key={t.text} className="flex items-center gap-2">
              <span className="text-sm">{t.icon}</span>
              <span
                className="text-[9px] font-bold tracking-[.28em] uppercase"
                style={{ ...syne, color: t.color }}
              >
                {t.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes partnersLeft  { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes partnersRight { from{transform:translateX(-50%)} to{transform:translateX(0)} }
      `}</style>
    </section>
  )
}
