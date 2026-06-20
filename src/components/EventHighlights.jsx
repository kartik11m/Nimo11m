import { useEffect, useState, useMemo } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

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
    setT(calc())
    const id = setInterval(() => setT(calc()), 1000)
    return () => clearInterval(id)
  }, [target])
  return t
}

// ── Type styles ──────────────────────────────────────────────────
const TYPE_STYLES = {
  'Workshop': { accent: '#FF6230', text: 'text-brand-orange', border: 'border-brand-orange/30', bg: 'bg-brand-orange/[.07]' },
  'Summer Camp': { accent: '#00DFFF', text: 'text-brand-cyan', border: 'border-brand-cyan/30', bg: 'bg-brand-cyan/[.06]' },
  'Competition': { accent: '#E0357A', text: 'text-brand-pink', border: 'border-brand-pink/30', bg: 'bg-brand-pink/[.06]' },
  'School Visit': { accent: '#8B31E8', text: 'text-brand-purple', border: 'border-brand-purple/30', bg: 'bg-brand-purple/[.06]' },
}

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
  const ts = TYPE_STYLES[event.type] || TYPE_STYLES['Workshop']
  
  const getStatusClass = (status) => {
    const statusMap = {
      'Open': 'text-[#4ade80] border-[#4ade80]/30 bg-[#4ade80]/[.06]',
      'Filling Fast': 'text-brand-orange border-brand-orange/30 bg-brand-orange/[.07]',
      'Booking Open': 'text-brand-cyan border-brand-cyan/30 bg-brand-cyan/[.06]',
      'Coming Soon': 'text-white/35 border-white/[.12] bg-white/[.03]',
    }
    return statusMap[status] || statusMap['Open']
  }

  const pct = event.seats < 900 ? Math.round((event.filled / event.seats) * 100) : 5
  return (
    <div className="group relative flex flex-col bg-white/[.025] border border-white/[.07] hover:border-brand-orange/30 hover:-translate-y-1 hover:shadow-[0_6px_28px_rgba(255,98,48,.09)] transition-all duration-300 p-5">
      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-brand-orange opacity-40 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-brand-purple/35 group-hover:border-brand-purple/60 transition-all duration-300" />

      {/* Top accent on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg,${ts.accent},#E0357A,transparent)` }}
      />

      {/* Date + Type row */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-display leading-none mb-0.5" style={{ fontSize: '2.2rem', color: ts.accent }}>
            {event.day}
          </div>
          <div className="font-condensed font-normal text-[8px] tracking-[.32em] uppercase" style={{ color: ts.accent }}>
            {event.month}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className={`font-condensed font-normal text-[7px] tracking-[.3em] uppercase border px-2 py-0.5 ${ts.text} ${ts.border} ${ts.bg}`}>
            {event.type}
          </span>
          <span className={`font-condensed font-normal text-[7px] tracking-[.3em] uppercase border px-2 py-0.5 ${getStatusClass(event.status)}`}>
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
        <span className="w-[4px] h-[4px] rounded-full shrink-0" style={{ background: `${ts.accent}60` }} />
        <span className="font-condensed font-normal text-[8.5px] tracking-[.22em] uppercase text-white/32 truncate">
          {event.venue}
        </span>
      </div>

      {/* Seats bar */}
      {event.seats < 900 && (
        <div className="mb-3">
          <div className="flex justify-between mb-1">
            <span className="font-condensed font-normal text-[7px] tracking-[.3em] uppercase text-white/22">Seats</span>
            <span className="font-condensed font-normal text-[8px]" style={{ color: ts.accent }}>
              {event.seats - event.filled} left
            </span>
          </div>
          <div className="h-px bg-white/[.07] overflow-hidden">
            <div className="h-full" style={{ width: `${pct}%`, background: `linear-gradient(90deg,${ts.accent},#E0357A)` }} />
          </div>
        </div>
      )}

      {/* Price + Register */}
      <div className="flex items-center justify-between mt-auto">
        <span className="font-condensed font-normal text-[11px] tracking-[.04em]" style={{ color: ts.accent }}>
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
  const [featured, setFeatured] = useState(null)
  const [upcoming, setUpcoming] = useState([])
  const [loading, setLoading] = useState(true)

  // Call hooks unconditionally first
  const ts = featured ? (TYPE_STYLES[featured.type] || TYPE_STYLES['Workshop']) : TYPE_STYLES['Workshop']
  const targetDate = useMemo(() => featured?.target ? new Date(featured.target) : null, [featured?.target])
  const { days, hours, mins, secs } = useCountdown(targetDate)
  const pct = featured ? Math.round((featured.filled / featured.seats) * 100) : 0

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API_URL}/events/upcoming`)
        const data = await res.json()
        if (data.success) {
          const events = data.events.sort((a, b) => a.order - b.order)
          const feat = events.find(e => e.featured)
          const upcoming = events.filter(e => !e.featured).slice(0, 3)
          setFeatured(feat)
          setUpcoming(upcoming)
        }
      } catch (error) {
        console.error('Error fetching events:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // Helper function to get status color class
  const getStatusClass = (status) => {
    const statusMap = {
      'Open': 'text-[#4ade80] border-[#4ade80]/30 bg-[#4ade80]/[.06]',
      'Filling Fast': 'text-brand-orange border-brand-orange/30 bg-brand-orange/[.07]',
      'Booking Open': 'text-brand-cyan border-brand-cyan/30 bg-brand-cyan/[.06]',
      'Coming Soon': 'text-white/35 border-white/[.12] bg-white/[.03]',
    }
    return statusMap[status] || statusMap['Open']
  }

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
        {featured && (
        <div className="relative border flex flex-wrap lg:flex-nowrap mb-6"
          style={{ borderColor: `${ts.accent}30`, background: `${ts.accent}05` }}>
          {/* Top accent line */}
          <div className="absolute top-0 left-0 right:0 right-0 h-[1.5px]"
            style={{ background: `linear-gradient(90deg,${ts.accent},#E0357A,#8B31E8,transparent)` }} />
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2" style={{ borderColor: ts.accent }} />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2" style={{ borderColor: `${ts.accent}80` }} />

          {/* NEXT badge */}
          <div className="absolute top-3 right-4 flex items-center gap-2 px-3 py-1.5" style={{ background: `${ts.accent}10`, borderColor: `${ts.accent}28` }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: ts.accent }} />
            <span className="font-condensed font-normal text-[7.5px] tracking-[.38em] uppercase" style={{ color: ts.accent }}>
              Featured
            </span>
          </div>

          {/* Left: date + countdown */}
          <div
            className="lg:w-[260px] shrink-0 flex flex-col items-center justify-center gap-5 p-8 border-b lg:border-b-0 lg:border-r border-white/[.06]"
            style={{ background: `radial-gradient(ellipse at 50% 40%,${ts.accent}09 0%,transparent 70%)` }}
          >
            <div className="text-center">
              <div className="font-display leading-none text-white/92 tabular-nums"
                style={{ fontSize: '4.5rem' }}>{featured.day}</div>
              <div className="font-condensed font-normal text-[10px] tracking-[.4em] uppercase mt-1" style={{ color: ts.accent }}>
                {featured.month}
              </div>
              <div className="font-condensed font-normal text-[8px] tracking-[.28em] text-white/25 mt-0.5">
                {featured.year}
              </div>
            </div>

            <div className="w-8 h-px" style={{ background: `linear-gradient(to right,transparent,${ts.accent},transparent)` }} />

            {/* Countdown */}
            {featured.target && (
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
            )}
          </div>

          {/* Right: details */}
          <div className="flex-1 p-7 flex flex-col gap-4 min-w-0">
            {/* Badges */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className={`font-condensed font-normal text-[7.5px] tracking-[.32em] uppercase border px-2.5 py-1 ${ts.text} ${ts.border} ${ts.bg}`}>
                {featured.type}
              </span>
              <span className={`font-condensed font-normal text-[7.5px] tracking-[.32em] uppercase border px-2.5 py-1 ${getStatusClass(featured.status)}`}>
                {featured.status}
              </span>
              <span className="font-condensed font-normal text-[9px] tracking-[.05em] mt-1" style={{ color: ts.accent }}>
                {featured.price}
              </span>
            </div>

            {/* Title */}
            <div>
              <h3
                className="font-display text-white leading-[.9] mb-2"
                style={{ fontSize: 'clamp(1.8rem,3.5vw,3rem)', letterSpacing: '.025em' }}
              >
                {featured.title}
              </h3>
              <p className="font-condensed font-normal text-[10px] tracking-[.2em] uppercase text-brand-cyan">
                {featured.sub}
              </p>
            </div>

            {/* Gradient rule */}
            <div className="w-12 h-[1.5px]"
              style={{ background: `linear-gradient(to right,${ts.accent},#E0357A,transparent)` }} />

            {/* Meta */}
            <div className="flex flex-wrap gap-4">
              {[
                { dot: ts.accent, val: featured.time },
                { dot: '#8B31E8', val: featured.venue },
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
                    <span className="w-1 h-1 rounded-full animate-pulse" style={{ background: ts.accent }} />
                    <span className="font-condensed font-normal text-[7px] tracking-[.38em] uppercase text-white/28">Seats</span>
                  </div>
                  <span className="font-condensed font-normal text-[9px]" style={{ color: ts.accent }}>
                    {featured.seats - featured.filled} / {featured.seats} left
                  </span>
                </div>
                <div className="h-[2px] bg-white/[.07] overflow-hidden rounded-full">
                  <div className="h-full rounded-full"
                    style={{ width: `${pct}%`, background: `linear-gradient(90deg,${ts.accent},#E0357A)`, boxShadow: `0 0 8px ${ts.accent}80` }} />
                </div>
              </div>
              <div className="flex gap-3">
                <button className="font-condensed font-normal text-[9px] tracking-[.4em] uppercase text-white border-none px-6 py-3 cursor-pointer hover:-translate-y-px transition-all duration-300"
                  style={{ background: ts.accent, boxShadow: `0 0 18px ${ts.accent}45`, color: 'white' }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = `0 0 34px ${ts.accent}70`}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = `0 0 18px ${ts.accent}45`}>
                  Register Now →
                </button>
                <button className="font-condensed font-normal text-[9px] tracking-[.4em] uppercase text-white/38 bg-white/[.03] border border-white/[.1] px-6 py-3 cursor-pointer hover:border-brand-cyan hover:text-brand-cyan hover:bg-brand-cyan/[.04] transition-all duration-300">
                  Details
                </button>
              </div>
            </div>
          </div>
        </div>
        )}

        {/* ── 3 upcoming cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {upcoming.map((ev) => (
            <MiniCard key={ev.eventId} event={ev} />
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
