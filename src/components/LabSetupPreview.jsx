import { useState } from 'react'
import { Link } from 'react-router-dom'

const bebasNeue = { fontFamily: "'Bebas Neue', sans-serif" }
const syne      = { fontFamily: "'Syne', sans-serif" }
const dmSans    = { fontFamily: "'DM Sans', sans-serif" }

const labTypes = [
  { icon: '🤖', name: 'Robotics Lab',      color: '#FF6B35', rgb: '255,107,53', area: '400–800 sq ft', cap: '24–32 Students' },
  { icon: '🧠', name: 'AI & ML Lab',        color: '#00F5FF', rgb: '0,245,255',  area: '300–600 sq ft', cap: '20–28 Students' },
  { icon: '🔬', name: 'ATL Lab',            color: '#A855F7', rgb: '168,85,247', area: '500–1000 sq ft',cap: '30–40 Students', badge: 'AIM Compliant' },
  { icon: '🚁', name: 'Drone Lab',          color: '#FF006E', rgb: '255,0,110',  area: '800–2000 sq ft',cap: '16–24 Students' },
  { icon: '⚗️', name: 'STEM Lab',           color: '#FF6B35', rgb: '255,107,53', area: '300–500 sq ft', cap: '24–36 Students' },
  { icon: '💡', name: 'Innovation Center',  color: '#00F5FF', rgb: '0,245,255',  area: '1000–3000 sq ft',cap: '40–60 People'   },
  { icon: '🏫', name: 'School Tech Infra',  color: '#A855F7', rgb: '168,85,247', area: 'Whole Campus',  cap: 'Entire School'  },
  { icon: '👨‍🏫', name: 'Teacher Training',   color: '#FF006E', rgb: '255,0,110',  area: 'Training Room', cap: '15–25 Educators'},
]

const audience = [
  { icon: '🏫', label: 'Schools',       color: '#FF6B35', rgb: '255,107,53' },
  { icon: '🎓', label: 'Institutions',  color: '#00F5FF', rgb: '0,245,255'  },
  { icon: '🏛️', label: 'Government',    color: '#A855F7', rgb: '168,85,247' },
  { icon: '🏢', label: 'Private Orgs',  color: '#FF006E', rgb: '255,0,110'  },
]

function LabPill({ lab }) {
  const [hov, setHov] = useState(false)
  return (
    <Link
      to="/lab-setup"
      className="relative flex items-center gap-3 px-4 py-3 no-underline overflow-hidden transition-all duration-350"
      style={{
        background:  hov ? `rgba(${lab.rgb},.1)` : 'rgba(255,255,255,.03)',
        border:      `1px solid ${hov ? `rgba(${lab.rgb},.45)` : 'rgba(255,255,255,.07)'}`,
        transform:   hov ? 'translateX(4px)' : 'none',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Left bar */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] transition-all duration-300"
        style={{ background: lab.color, opacity: hov ? 1 : 0.3, boxShadow: hov ? `0 0 8px rgba(${lab.rgb},.6)` : 'none' }} />

      <span className="text-base flex-shrink-0">{lab.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-bold text-[#F0EAD6]/80 leading-tight" style={syne}>{lab.name}</div>
        <div className="text-[9px] font-light text-[#F0EAD6]/30 mt-0.5 tracking-[.03em]" style={dmSans}>
          {lab.area} · {lab.cap}
        </div>
      </div>
      {lab.badge && (
        <div className="px-2 py-0.5 flex-shrink-0"
          style={{ background: `rgba(${lab.rgb},.1)`, border: `1px solid rgba(${lab.rgb},.28)` }}>
          <span className="text-[6px] font-bold tracking-[.3em] uppercase"
            style={{ ...syne, color: lab.color }}>{lab.badge}</span>
        </div>
      )}
      <span className="text-[10px] text-[#F0EAD6]/20 flex-shrink-0 transition-colors duration-200"
        style={{ color: hov ? lab.color : undefined }}>›</span>
    </Link>
  )
}

export default function LabSetupPreview() {
  return (
    <section className="relative overflow-hidden py-[84px] bg-[#050508] border-y border-white/[.055]">

      {/* ── Atmosphere ── */}
      <div className="absolute -top-[100px] -right-[60px] w-[520px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse,rgba(255,107,53,.11) 0%,transparent 70%)' }} />
      <div className="absolute -bottom-[80px] -left-[40px] w-[460px] h-[360px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse,rgba(168,85,247,.09) 0%,transparent 70%)' }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(0,0,0,.055) 3px,rgba(0,0,0,.055) 4px)',
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,107,53,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,107,53,.02) 1px,transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      <div className="relative z-[2] max-w-[1100px] mx-auto px-12">

        {/* ── Top: division badge + title ── */}
        <div className="flex items-end justify-between gap-10 flex-wrap mb-12">
          <div>
            {/* Division identity */}
            <div className="flex items-center gap-3 mb-5">
              <div className="inline-flex items-center gap-2 px-3 py-[6px] bg-[#FF6B35]/[.07] border border-[#FF6B35]/[.22]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse" />
                <span className="text-[8px] font-bold tracking-[.42em] uppercase text-[#FF6B35]" style={syne}>
                  Nimo Labs
                </span>
              </div>
              <span className="text-[8px] font-bold tracking-[.35em] uppercase text-[#F0EAD6]/[.22]" style={syne}>
                Division B
              </span>
            </div>

            <div>
              <span className="block leading-[.9]" style={{
                ...bebasNeue, fontSize: 'clamp(40px,6.5vw,72px)',
                WebkitTextStroke: '1px rgba(240,234,214,.35)', color: 'transparent',
              }}>WE BUILD</span>
              <span className="block leading-[.9] text-[#FF6B35]" style={{
                ...bebasNeue, fontSize: 'clamp(40px,6.5vw,72px)',
                textShadow: '0 0 40px rgba(255,107,53,.38)',
              }}>YOUR LAB</span>
              <span className="block mt-1.5 font-bold tracking-[.18em] uppercase text-[#00F5FF]"
                style={{ ...syne, fontSize: 'clamp(9px,1.2vw,13px)' }}>
                Design · Install · Train · Support
              </span>
            </div>
            <div className="w-14 h-px mt-5" style={{ background: 'linear-gradient(90deg,#FF6B35,transparent)' }} />
          </div>

          {/* Right: description + CTA */}
          <div className="max-w-[380px]">
            <p className="font-light leading-[1.9] text-[#F0EAD6]/50 text-[13px] mb-6" style={dmSans}>
              Complete STEM lab infrastructure for schools, colleges, and government bodies.
              Robotics, AI, ATL, Drone labs — designed, installed, and supported end-to-end.
            </p>
            <Link to="/lab-setup"
              className="text-[10px] font-bold tracking-[.32em] uppercase text-white bg-[#FF6B35] px-7 py-3.5 no-underline shadow-[0_0_22px_rgba(255,107,53,.25)] hover:bg-[#ff8040] hover:shadow-[0_0_40px_rgba(255,107,53,.5)] hover:-translate-y-px transition-all duration-300 inline-block"
              style={syne}>Explore All Solutions →</Link>
          </div>
        </div>

        {/* ── Main: lab grid + audience ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">

          {/* Lab types grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {labTypes.map(lab => (
              <LabPill key={lab.name} lab={lab} />
            ))}
          </div>

          {/* Right: audience + stat card */}
          <div className="flex flex-col gap-4">

            {/* Audience card */}
            <div className="relative bg-white/[.03] border border-white/[.07] p-6 flex-1">
              <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-[#FF6B35]" />
              <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-purple-500/50" />
              <div className="absolute top-0 left-0 right-0 h-[1.5px]"
                style={{ background: 'linear-gradient(90deg,#FF6B35,rgba(168,85,247,.4),transparent)' }} />

              <div className="text-[8px] font-bold tracking-[.38em] uppercase text-[#F0EAD6]/[.25] mb-4" style={syne}>
                We Serve
              </div>

              <div className="space-y-2.5">
                {audience.map(a => (
                  <Link
                    key={a.label}
                    to="/lab-setup"
                    className="flex items-center gap-3 no-underline group"
                  >
                    <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 transition-all duration-200 group-hover:scale-110"
                      style={{ background: `rgba(${a.rgb},.08)`, border: `1px solid rgba(${a.rgb},.2)` }}>
                      <span className="text-sm">{a.icon}</span>
                    </div>
                    <span className="text-[12px] font-bold transition-colors duration-200"
                      style={{ ...syne, color: 'rgba(240,234,214,.65)' }}
                      onMouseEnter={e => e.currentTarget.style.color = a.color}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(240,234,214,.65)'}
                    >{a.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { num: '40+',  label: 'Labs Built',  color: '#FF6B35' },
                { num: '12+',  label: 'States',       color: '#00F5FF' },
                { num: '80+',  label: 'Institutions', color: '#A855F7' },
                { num: 'Free', label: 'Site Visit',   color: '#FF006E' },
              ].map(s => (
                <div key={s.label} className="px-4 py-4 relative overflow-hidden"
                  style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.06)' }}>
                  <div className="absolute top-0 left-0 right-0 h-[1.5px]" style={{ background: s.color }} />
                  <div className="leading-none" style={{ ...bebasNeue, fontSize: '1.5rem', color: s.color }}>{s.num}</div>
                  <div className="text-[7px] font-bold tracking-[.3em] uppercase text-[#F0EAD6]/[.25] mt-1" style={syne}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ── Process mini-strip ── */}
        <div className="mt-10 border-t border-white/[.055] pt-8">
          <div className="h-[1.5px] mb-7"
            style={{ background: 'linear-gradient(90deg,#FF6B35,rgba(168,85,247,.5),transparent)' }} />
          <div className="flex items-center gap-0 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {['Site Assessment', 'Custom Blueprint', 'Installation', 'Faculty Training', 'AMC & Support'].map((step, i, arr) => (
              <div key={step} className="flex items-center flex-shrink-0">
                <div className="flex items-center gap-2.5 px-4">
                  <div className="w-7 h-7 flex items-center justify-center flex-shrink-0"
                    style={{
                      background: `rgba(255,107,53,.1)`,
                      border: '1px solid rgba(255,107,53,.25)',
                    }}>
                    <span className="text-[9px] font-bold" style={{ ...bebasNeue, color: '#FF6B35' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold tracking-[.12em] text-[#F0EAD6]/55 whitespace-nowrap" style={syne}>
                    {step}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <div className="w-6 h-px flex-shrink-0" style={{ background: 'rgba(255,107,53,.25)' }} />
                )}
              </div>
            ))}
            <div className="flex-shrink-0 pl-4">
              <Link to="/lab-setup"
                className="text-[9px] font-bold tracking-[.28em] uppercase text-[#FF6B35] no-underline border border-[#FF6B35]/30 px-4 py-1.5 hover:bg-[#FF6B35]/[.08] transition-all duration-200 whitespace-nowrap"
                style={syne}>
                See Full Process →
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
