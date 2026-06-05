import { useEffect, useState } from 'react'

// ── Countdown hook ────────────────────────────────────────────────
function useCountdown(target) {
  const calc = () => {
    if (!target) return { days: 0, hours: 0, mins: 0, secs: 0 }
    const diff = target - Date.now()
    if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0 }
    return {
      days:  Math.floor(diff / 86_400_000),
      hours: Math.floor((diff % 86_400_000) / 3_600_000),
      mins:  Math.floor((diff % 3_600_000)  / 60_000),
      secs:  Math.floor((diff % 60_000)     / 1_000),
    }
  }
  const [t, setT] = useState(calc)
  useEffect(() => {
    if (!target) return
    const id = setInterval(() => setT(calc()), 1000)
    return () => clearInterval(id)
  }, []) // eslint-disable-line
  return t
}

// ── Data ─────────────────────────────────────────────────────────
const FEATURED = {
  type:       'Workshop',
  typeClass:  'text-brand-orange border-brand-orange/30 bg-brand-orange/[.07]',
  status:     'Open',
  statusClass:'text-[#4ade80] border-[#4ade80]/30 bg-[#4ade80]/[.06]',
  title:      'Arduino for Absolute Beginners',
  sub:        'Build your first robot in a single day — no experience needed.',
  day:        '18',
  month:      'MAY',
  year:       '2025',
  time:       '10:00 AM – 4:00 PM',
  venue:      'Nimo Labs HQ, Bhopal',
  seats:      20,
  filled:     13,
  price:      '₹999',
  accent:     '#FF6230',
  target:     new Date('2025-05-18T10:00:00'),
}

const UPCOMING = [
  {
    id: 'e2',
    type: 'Summer Camp',
    typeClass: 'text-brand-cyan border-brand-cyan/30 bg-brand-cyan/[.06]',
    status: 'Filling Fast',
    statusClass: 'text-brand-orange border-brand-orange/30 bg-brand-orange/[.07]',
    title: 'Robotics Summer Camp 2025',
    day: '02', month: 'JUN',
    venue: 'Nimo Labs HQ, Bhopal',
    seats: 40, filled: 28,
    accent: '#00DFFF',
    price: '₹3,499',
  },
  {
    id: 'e3',
    type: 'Workshop',
    typeClass: 'text-brand-orange border-brand-orange/30 bg-brand-orange/[.07]',
    status: 'Open',
    statusClass: 'text-[#4ade80] border-[#4ade80]/30 bg-[#4ade80]/[.06]',
    title: 'ESP32 & IoT Masterclass',
    day: '22', month: 'JUN',
    venue: 'Nimo Labs HQ, Bhopal',
    seats: 15, filled: 5,
    accent: '#FF6230',
    price: '₹1,299',
  },
  {
    id: 'e4',
    type: 'Competition',
    typeClass: 'text-brand-pink border-brand-pink/30 bg-brand-pink/[.06]',
    status: 'Coming Soon',
    statusClass: 'text-white/35 border-white/[.12] bg-white/[.03]',
    title: 'NimoBot Challenge 2025',
    day: '15', month: 'AUG',
    venue: 'TBA — Bhopal City',
    seats: 60, filled: 0,
    accent: '#E0357A',
    price: '₹499/team',
  },
]

// ── Countdown unit box ────────────────────────────────────────────
function CDUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="relative w-[48px] h-[48px] flex items-center justify-center bg-white/[.03] border border-white/[.09]"
        style={{ boxShadow: 'inset 0 0 10px rgba(255,98,48,.06)' }}
      >
        <div className="absolute bottom-0 left-0 right-0 h-[1.5px]"
          style={{ background: 'linear-gradient(90deg,transparent,#FF6230,transparent)' }} />
        <span className="font-display text-[22px] leading-none text-white/90 tabular-nums">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="font-condensed font-normal text-[7px] tracking-[.38em] uppercase text-white/28">
        {label}
      </span>
    </div>
  )
}

// ── Mini event card ───────────────────────────────────────────────
function MiniCard({ event }) {
  const pct = event.seats < 900 ? Math.round((event.filled / event.seats) * 100) : 5
  return (
    <div className="group relative flex flex-col bg-white/[.025] border border-white/[.07] hover:border-brand-orange/30 hover:-translate-y-1 hover:shadow-[0_6px_28px_rgba(255,98,48,.09)] transition-all duration-300 p-5">
      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-brand-orange opacity-40 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-brand-purple/35 group-hover:border-brand-purple/60 transition-all duration-300" />

      {/* Top accent on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg,${event.accent},#E0357A,transparent)` }}
      />

      {/* Date + Type row */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-display leading-none mb-0.5" style={{ fontSize: '2.2rem', color: event.accent }}>
            {event.day}
          </div>
          <div className="font-condensed font-normal text-[8px] tracking-[.32em] uppercase" style={{ color: event.accent }}>
            {event.month}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className={`font-condensed font-normal text-[7px] tracking-[.3em] uppercase border px-2 py-0.5 ${event.typeClass}`}>
            {event.type}
          </span>
          <span className={`font-condensed font-normal text-[7px] tracking-[.3em] uppercase border px-2 py-0.5 ${event.statusClass}`}>
            {event.status}
          </span>
        </div>
      </div>

      {/* Title */}
      <h4
        className="font-display text-white leading-[.9] mb-2 flex-1"
        style={{ fontSize: 'clamp(1.1rem,2vw,1.4rem)', letterSpacing: '.02em' }}
      >
        {event.title}
      </h4>

      {/* Venue */}
      <div className="flex items-center gap-1.5 mb-3">
        <span className="w-[4px] h-[4px] rounded-full bg-brand-orange/60 shrink-0" />
        <span className="font-condensed font-normal text-[8.5px] tracking-[.22em] uppercase text-white/32 truncate">
          {event.venue}
        </span>
      </div>

      {/* Seats bar */}
      {event.seats < 900 && (
        <div className="mb-3">
          <div className="flex justify-between mb-1">
            <span className="font-condensed font-normal text-[7px] tracking-[.3em] uppercase text-white/22">Seats</span>
            <span className="font-condensed font-normal text-[8px]" style={{ color: event.accent }}>
              {event.seats - event.filled} left
            </span>
          </div>
          <div className="h-px bg-white/[.07] overflow-hidden">
            <div className="h-full" style={{ width: `${pct}%`, background: `linear-gradient(90deg,${event.accent},#E0357A)` }} />
          </div>
        </div>
      )}

      {/* Price + Register */}
      <div className="flex items-center justify-between mt-auto">
        <span className="font-condensed font-normal text-[11px] tracking-[.04em]" style={{ color: event.accent }}>
          {event.price}
        </span>
        <a
          href="/events"
          className="group/r flex items-center gap-1.5 font-condensed font-normal text-[8px] tracking-[.32em] uppercase text-white/40 hover:text-brand-orange transition-colors duration-300 no-underline"
        >
          <span
            className="h-px w-3 group-hover/r:w-6 transition-all duration-300 shrink-0"
            style={{ background: `linear-gradient(to right,${event.accent},#E0357A)` }}
          />
          Register
        </a>
      </div>
    </div>
  )
}

// ── Main section ──────────────────────────────────────────────────
export default function EventsPreviewSection() {
  const { days, hours, mins, secs } = useCountdown(FEATURED.target)
  const pct = Math.round((FEATURED.filled / FEATURED.seats) * 100)

  useEffect(() => {
    const link = document.createElement('link')
    link.rel   = 'stylesheet'
    link.href  =
      'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@300;400&family=Barlow:wght@300&display=swap'
    document.head.appendChild(link)
    return () => document.head.removeChild(link)
  }, [])

  return (
    <section
      className="relative overflow-hidden bg-brand-bg py-24"
      style={{ borderTop: '1px solid rgba(255,255,255,.055)' }}
    >
      {/* ── Atmosphere ── */}
      <div aria-hidden="true" className="absolute -top-[160px] -left-[100px] w-[600px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse,rgba(255,98,48,.13) 0%,transparent 70%)' }} />
      <div aria-hidden="true" className="absolute -bottom-[180px] -right-[80px] w-[560px] h-[460px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse,rgba(139,49,232,.11) 0%,transparent 70%)' }} />
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
        style={{ background: 'repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(0,0,0,.065) 3px,rgba(0,0,0,.065) 4px)' }} />
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(rgba(255,98,48,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,98,48,.02) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-[.022]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23g)'/%3E%3C/svg%3E\")" }} />

      <div className="relative z-[2] max-w-[1200px] mx-auto px-8">

        {/* ── Section header ── */}
        <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
          <div>
            {/* Ghost number */}
            <div aria-hidden="true" className="font-display leading-none select-none pointer-events-none -mb-4"
              style={{ fontSize: 'clamp(5rem,10vw,8rem)', color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,.04)', letterSpacing: '-.01em' }}>
              05
            </div>

            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-[7px] mb-4 bg-brand-orange/[.07] border border-brand-orange/25">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
              <span className="font-condensed font-normal text-[9px] tracking-[.42em] uppercase text-brand-orange">
                Events &amp; Workshops
              </span>
            </div>

            {/* Title */}
            <div>
              <span className="font-display block leading-[.88]"
                style={{ fontSize: 'clamp(2.5rem,5.5vw,5rem)', letterSpacing: '.025em', color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,.28)' }}>
                WHAT'S
              </span>
              <span className="font-display block leading-[.88] text-grad-accent"
                style={{ fontSize: 'clamp(2.5rem,5.5vw,5rem)', letterSpacing: '.025em', filter: 'drop-shadow(0 0 22px rgba(255,98,48,.22))' }}>
                HAPPENING
              </span>
              <span className="font-condensed font-normal block text-brand-cyan tracking-[.2em] uppercase mt-2"
                style={{ fontSize: 'clamp(10px,1.4vw,14px)' }}>
                Workshops · Camps · School Visits · Competitions
              </span>
            </div>
          </div>

          {/* View all CTA */}
          <a
            href="/events"
            className="group/va inline-flex items-center gap-3 font-condensed font-normal text-[9px] tracking-[.4em] uppercase text-white/45 hover:text-brand-orange transition-colors duration-300 no-underline shrink-0"
          >
            <span className="block h-px w-6 group-hover/va:w-12 transition-all duration-300 shrink-0"
              style={{ background: 'linear-gradient(to right,#FF6230,#E0357A)' }} />
            View All Events
          </a>
        </div>

        {/* ── Featured event (full-width spotlight) ── */}
        <div className="relative border border-brand-orange/30 bg-white/[.02] flex flex-wrap lg:flex-nowrap mb-6">
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right:0 right-0 h-[1.5px]"
            style={{ background: 'linear-gradient(90deg,#FF6230,#E0357A,#8B31E8,transparent)' }} />
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-brand-orange" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-brand-purple/50" />

          {/* NEXT badge */}
          <div className="absolute top-3 right-4 flex items-center gap-2 px-3 py-1.5 bg-brand-orange/[.1] border border-brand-orange/28">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
            <span className="font-condensed font-normal text-[7.5px] tracking-[.38em] uppercase text-brand-orange">
              Up Next
            </span>
          </div>

          {/* Left: date + countdown */}
          <div
            className="lg:w-[260px] shrink-0 flex flex-col items-center justify-center gap-5 p-8 border-b lg:border-b-0 lg:border-r border-white/[.06]"
            style={{ background: 'radial-gradient(ellipse at 50% 40%,rgba(255,98,48,.09) 0%,transparent 70%)' }}
          >
            <div className="text-center">
              <div className="font-display leading-none text-white/92 tabular-nums"
                style={{ fontSize: '4.5rem' }}>{FEATURED.day}</div>
              <div className="font-condensed font-normal text-[10px] tracking-[.4em] uppercase text-brand-orange mt-1">
                {FEATURED.month}
              </div>
              <div className="font-condensed font-normal text-[8px] tracking-[.28em] text-white/25 mt-0.5">
                {FEATURED.year}
              </div>
            </div>

            <div className="w-8 h-px" style={{ background: 'linear-gradient(to right,transparent,#FF6230,transparent)' }} />

            {/* Countdown */}
            <div>
              <div className="font-condensed font-normal text-[7px] tracking-[.42em] uppercase text-white/28 text-center mb-2.5">
                Starts In
              </div>
              <div className="flex items-end gap-2">
                <CDUnit value={days}  label="Days" />
                <CDUnit value={hours} label="Hrs"  />
                <CDUnit value={mins}  label="Min"  />
                <CDUnit value={secs}  label="Sec"  />
              </div>
            </div>
          </div>

          {/* Right: details */}
          <div className="flex-1 p-7 flex flex-col gap-4 min-w-0">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className={`font-condensed font-normal text-[7.5px] tracking-[.32em] uppercase border px-2.5 py-1 ${FEATURED.typeClass}`}>
                {FEATURED.type}
              </span>
              <span className={`font-condensed font-normal text-[7.5px] tracking-[.32em] uppercase border px-2.5 py-1 ${FEATURED.statusClass}`}>
                {FEATURED.status}
              </span>
              <span className="font-condensed font-normal text-[9px] tracking-[.05em] text-brand-orange ml-1">
                {FEATURED.price}
              </span>
            </div>

            {/* Title */}
            <div>
              <h3
                className="font-display text-white leading-[.9] mb-2"
                style={{ fontSize: 'clamp(1.8rem,3.5vw,3rem)', letterSpacing: '.025em' }}
              >
                {FEATURED.title}
              </h3>
              <p className="font-condensed font-normal text-[10px] tracking-[.2em] uppercase text-brand-cyan">
                {FEATURED.sub}
              </p>
            </div>

            {/* Gradient rule */}
            <div className="w-12 h-[1.5px]"
              style={{ background: 'linear-gradient(to right,#FF6230,#E0357A,transparent)' }} />

            {/* Meta */}
            <div className="flex flex-wrap gap-4">
              {[
                { dot: '#FF6230', val: FEATURED.time },
                { dot: '#8B31E8', val: FEATURED.venue },
              ].map(({ dot, val }) => (
                <div key={val} className="flex items-center gap-1.5">
                  <span className="w-[4px] h-[4px] rounded-full shrink-0" style={{ background: dot }} />
                  <span className="font-condensed font-normal text-[9px] tracking-[.22em] uppercase text-white/35">{val}</span>
                </div>
              ))}
            </div>

            {/* Seats + CTA */}
            <div className="flex flex-wrap items-end justify-between gap-4 mt-auto">
              <div className="flex-1 min-w-[160px] max-w-[240px]">
                <div className="flex justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-brand-orange animate-pulse" />
                    <span className="font-condensed font-normal text-[7px] tracking-[.38em] uppercase text-white/28">Seats</span>
                  </div>
                  <span className="font-condensed font-normal text-[9px] text-brand-orange">
                    {FEATURED.seats - FEATURED.filled} / {FEATURED.seats} left
                  </span>
                </div>
                <div className="h-[2px] bg-white/[.07] overflow-hidden rounded-full">
                  <div className="h-full rounded-full"
                    style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#FF6230,#E0357A)', boxShadow: '0 0 8px rgba(255,98,48,.5)' }} />
                </div>
              </div>
              <div className="flex gap-3">
                <button className="font-condensed font-normal text-[9px] tracking-[.4em] uppercase text-white bg-brand-orange border-none px-6 py-3 cursor-pointer shadow-[0_0_18px_rgba(255,98,48,.28)] hover:bg-[#ff7a4a] hover:shadow-[0_0_34px_rgba(255,98,48,.5)] hover:-translate-y-px transition-all duration-300">
                  Register Now →
                </button>
                <button className="font-condensed font-normal text-[9px] tracking-[.4em] uppercase text-white/38 bg-white/[.03] border border-white/[.1] px-6 py-3 cursor-pointer hover:border-brand-cyan hover:text-brand-cyan hover:bg-brand-cyan/[.04] transition-all duration-300">
                  Details
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── 3 upcoming cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {UPCOMING.map((ev) => (
            <MiniCard key={ev.id} event={ev} />
          ))}
        </div>

        {/* ── View all events CTA strip ── */}
        <div className="relative flex flex-wrap items-center justify-between gap-5 px-7 py-5 border border-white/[.07] bg-white/[.02]">
          <div className="absolute top-0 left-0 right-0 h-[1.5px]"
            style={{ background: 'linear-gradient(90deg,#FF6230,#E0357A,#8B31E8,transparent)' }} />
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-brand-orange" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-brand-purple/40" />

          <div>
            <span className="font-display block leading-none text-grad-accent mb-1"
              style={{ fontSize: 'clamp(1.4rem,3vw,2rem)', letterSpacing: '.03em' }}>
              More Events Coming Up
            </span>
            <span className="font-body text-[12.5px] text-white/35 tracking-[.02em]">
              Workshops, school visits, camps and competitions — see the full calendar.
            </span>
          </div>
          <a
            href="/events"
            className="font-condensed font-normal text-[9px] tracking-[.4em] uppercase text-white bg-brand-orange border-none px-7 py-3.5 cursor-pointer shadow-[0_0_18px_rgba(255,98,48,.25)] hover:bg-[#ff7a4a] hover:shadow-[0_0_34px_rgba(255,98,48,.5)] hover:-translate-y-px transition-all duration-300 no-underline shrink-0"
          >
            View All Events →
          </a>
        </div>

      </div>
    </section>
  )
}
