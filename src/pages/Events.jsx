import { useEffect, useState, useRef } from 'react'

// ── Countdown hook ───────────────────────────────────────────────
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
const TYPE_STYLES = {
  'Workshop':     { text: 'text-brand-orange', border: 'border-brand-orange/30', bg: 'bg-brand-orange/[.07]', accent: '#FF6230' },
  'Summer Camp':  { text: 'text-brand-cyan',   border: 'border-brand-cyan/30',   bg: 'bg-brand-cyan/[.06]',   accent: '#00DFFF' },
  'School Visit': { text: 'text-brand-purple', border: 'border-brand-purple/30', bg: 'bg-brand-purple/[.07]', accent: '#8B31E8' },
  'Competition':  { text: 'text-brand-pink',   border: 'border-brand-pink/30',   bg: 'bg-brand-pink/[.06]',   accent: '#E0357A' },
}

const STATUS_STYLES = {
  'Open':          'text-[#4ADE80] border-[#4ADE80]/30 bg-[#4ADE80]/[.06]',
  'Filling Fast':  'text-brand-orange border-brand-orange/30 bg-brand-orange/[.07]',
  'Booking Open':  'text-[#4ADE80] border-[#4ADE80]/30 bg-[#4ADE80]/[.06]',
  'Coming Soon':   'text-white/35 border-white/[.12] bg-white/[.03]',
}

const FILTERS = ['All', 'Workshop', 'Summer Camp', 'School Visit', 'Competition']

const EVENTS = [
  {
    id: 'e1', type: 'Workshop', featured: true, status: 'Open',
    title: 'Arduino for Absolute Beginners',
    sub: 'Build your first circuit and program your first robot in one day.',
    desc: "Dive straight into electronics and microcontrollers. You'll wire components, read sensors, and write real C++ code — then take your project home.",
    day: '18', month: 'MAY', year: '2025', monthFull: 'May 2025',
    time: '10:00 AM – 4:00 PM', duration: '6 Hours',
    venue: 'Nimo Labs HQ, Bhopal',
    seats: 20, filled: 13,
    target: new Date('2025-05-18T10:00:00'),
    tags: ['Beginner Friendly', 'Take-Home Kit', 'Certificate'],
    price: '₹999',
    num: '01',
  },
  {
    id: 'e2', type: 'Summer Camp', featured: false, status: 'Filling Fast',
    title: 'Robotics Summer Camp 2025',
    sub: '5 immersive days — build 3 robots, code, compete.',
    desc: 'The flagship summer experience. Students build a line follower, obstacle avoider, and freestyle robot, then compete in a final showcase.',
    day: '02', month: 'JUN', year: '2025', monthFull: 'June 2025',
    time: '9:00 AM – 5:00 PM', duration: '5 Days',
    venue: 'Nimo Labs HQ, Bhopal',
    seats: 40, filled: 28,
    target: new Date('2025-06-02T09:00:00'),
    tags: ['Ages 10–18', '3 Robots', 'Certificate'],
    price: '₹3,499',
    num: '02',
  },
  {
    id: 'e3', type: 'Workshop', featured: false, status: 'Open',
    title: 'ESP32 & IoT Masterclass',
    sub: 'Build connected devices and deploy to the cloud.',
    desc: 'For students who know Arduino basics. Covers Wi-Fi, MQTT, cloud dashboards, and real sensor deployments on ESP32.',
    day: '22', month: 'JUN', year: '2025', monthFull: 'June 2025',
    time: '10:00 AM – 5:00 PM', duration: '7 Hours',
    venue: 'Nimo Labs HQ, Bhopal',
    seats: 15, filled: 5,
    target: new Date('2025-06-22T10:00:00'),
    tags: ['Intermediate', 'Cloud Dashboards', 'Take-Home'],
    price: '₹1,299',
    num: '03',
  },
  {
    id: 'e4', type: 'School Visit', featured: false, status: 'Booking Open',
    title: 'Robotics Demo at Your Campus',
    sub: 'We bring live robots to your school or college.',
    desc: 'A 2–3 hour immersive demo session — live robots, coding intro, and a hands-on challenge for the class. Flexible scheduling, any day.',
    day: 'ANY', month: 'DATE', year: '2025', monthFull: 'Flexible',
    time: 'Flexible', duration: '2–3 Hours',
    venue: 'Your School / College',
    seats: 999, filled: 0,
    target: null,
    tags: ['All Ages', 'Free Consultation', 'Custom Schedule'],
    price: 'Contact Us',
    num: '04',
  },
  {
    id: 'e5', type: 'Competition', featured: false, status: 'Coming Soon',
    title: 'NimoBot Challenge 2025',
    sub: 'Inter-school robot battle — speed, accuracy, creativity.',
    desc: 'Three categories: Line Follower Speed Run, Obstacle Course, and Freestyle Build. Open to all school and college teams. Cash prizes for top 3.',
    day: '15', month: 'AUG', year: '2025', monthFull: 'August 2025',
    time: '9:00 AM – 6:00 PM', duration: 'Full Day',
    venue: 'TBA — Bhopal City',
    seats: 60, filled: 0,
    target: new Date('2025-08-15T09:00:00'),
    tags: ['Teams of 3', 'Cash Prizes', 'All Schools'],
    price: '₹499 / team',
    num: '05',
  },
  {
    id: 'e6', type: 'Workshop', featured: false, status: 'Open',
    title: '3D Design & Printing Bootcamp',
    sub: 'Design your own robot part — then print it.',
    desc: 'Learn Fusion 360 basics, design a custom robot enclosure or chassis part, and take the physical 3D print home at the end of the session.',
    day: '12', month: 'JUL', year: '2025', monthFull: 'July 2025',
    time: '10:00 AM – 3:00 PM', duration: '5 Hours',
    venue: 'Nimo Labs HQ, Bhopal',
    seats: 12, filled: 3,
    target: new Date('2025-07-12T10:00:00'),
    tags: ['Intermediate', 'Physical Takeaway', 'Software Included'],
    price: '₹1,499',
    num: '06',
  },
]

const PAST = [
  { title: 'Arduino Day 2024',        type: 'Workshop',     date: 'Mar 2024', attendees: 45,  highlight: 'Sold out in 48 hours' },
  { title: 'Robotics Summer Camp',    type: 'Summer Camp',  date: 'Jun 2024', attendees: 38,  highlight: '38 students, 6 robots built' },
  { title: 'Circuit Tour — 8 Schools',type: 'School Visit', date: 'Aug 2024', attendees: 320, highlight: '320 students across 8 schools' },
  { title: 'NimoBot Challenge 2024',  type: 'Competition',  date: 'Sep 2024', attendees: 120, highlight: '18 teams, 3 categories' },
  { title: 'Sensors & Actuators WS',  type: 'Workshop',     date: 'Nov 2024', attendees: 28,  highlight: 'Fully hands-on, 0% lecture' },
  { title: 'Python for Makers',       type: 'Workshop',     date: 'Dec 2024', attendees: 22,  highlight: 'Pi-powered automation demos' },
]

const PAGE_CSS = `
  .events-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .events-scrollbar::-webkit-scrollbar { display: none; height: 0; }
  .events-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .events-scrollbar::-webkit-scrollbar-thumb { background: transparent; }

  .filter-btn { transition: all .25s ease; }

  .event-card-appear {
    animation: card-appear .4s cubic-bezier(.4,0,.2,1) both;
  }

  @keyframes card-appear {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0);    }
  }

  .cd-unit {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
  }
  .cd-box {
    width: 62px;
    height: 62px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255,255,255,.03);
    border: 1px solid rgba(255,255,255,.09);
    position: relative;
  }
  .cd-box::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 1.5px;
    background: linear-gradient(90deg,transparent,#FF6230,transparent);
  }
  .cd-num {
    font-size: 28px;
    line-height: 1;
    color: rgba(255,255,255,.92);
    font-variant-numeric: tabular-nums;
  }
  .cd-label {
    font-size: 7px;
    letter-spacing: .42em;
    text-transform: uppercase;
    color: rgba(255,255,255,.28);
    font-weight: 400;
  }

  .atm-scanlines {
    background: repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(0,0,0,.065) 3px,rgba(0,0,0,.065) 4px);
  }
  .atm-grid {
    background-image:
      linear-gradient(rgba(255,98,48,.02) 1px,transparent 1px),
      linear-gradient(90deg,rgba(255,98,48,.02) 1px,transparent 1px);
    background-size: 48px 48px;
  }
`

// ── Sub-components ────────────────────────────────────────────────
function Atmosphere() {
  return (
    <>
      <div aria-hidden="true" className="absolute -top-[160px] -left-[120px] w-[640px] h-[520px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse,rgba(255,98,48,.13) 0%,transparent 70%)' }} />
      <div aria-hidden="true" className="absolute top-[30%] -right-[100px] w-[520px] h-[440px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse,rgba(139,49,232,.11) 0%,transparent 70%)' }} />
      <div aria-hidden="true" className="absolute -bottom-[140px] left-[30%] w-[400px] h-[300px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse,rgba(0,223,255,.04) 0%,transparent 70%)' }} />
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none atm-scanlines" />
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none atm-grid" />
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none opacity-[.022]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23g)'/%3E%3C/svg%3E\")" }} />
    </>
  )
}

function CountdownUnit({ value, label }) {
  return (
    <div className="cd-unit">
      <div className="cd-box">
        <span className="cd-num font-display">{String(value).padStart(2, '0')}</span>
      </div>
      <span className="cd-label font-condensed">{label}</span>
    </div>
  )
}

// ── Featured event spotlight ──────────────────────────────────────
function FeaturedEvent({ event }) {
  const { days, hours, mins, secs } = useCountdown(event.target)
  const ts = TYPE_STYLES[event.type] ?? TYPE_STYLES['Workshop']
  const pct = Math.round((event.filled / event.seats) * 100)

  return (
    <div className="relative overflow-hidden border border-white/[.08] bg-white/[.02] mb-5">
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px]"
        style={{ background: `linear-gradient(90deg,${ts.accent},#E0357A,#8B31E8,transparent)` }} />
      {/* TL bracket */}
      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2" style={{ borderColor: ts.accent }} />
      {/* BR bracket */}
      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2" style={{ borderColor: `${ts.accent}80` }} />

      {/* FEATURED label */}
      <div className="absolute top-4 right-6 z-10">
        <div
          className="flex items-center gap-2 px-3 py-1.5 border"
          style={{ background: `${ts.accent}12`, borderColor: `${ts.accent}30` }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: ts.accent }} />
          <span className="font-condensed font-normal text-[8px] tracking-[.4em] uppercase" style={{ color: ts.accent }}>
            Featured
          </span>
        </div>
      </div>

      <div className="flex flex-wrap lg:flex-nowrap">

        {/* Left — date + countdown */}
        <div
          className="lg:w-[300px] shrink-0 flex flex-col items-center justify-center gap-6 p-10 border-b lg:border-b-0 lg:border-r border-white/[.06]"
          style={{ background: `radial-gradient(ellipse at 50% 40%,${ts.accent}10 0%,transparent 70%)` }}
        >
          {/* Date display */}
          <div className="text-center">
            <div className="font-display leading-none mb-1"
              style={{
                fontSize:             'clamp(4rem,8vw,6rem)',
                background:           `linear-gradient(180deg,#ffffff,rgba(255,255,255,.65))`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor:  'transparent',
                backgroundClip:       'text',
              }}>
              {event.day}
            </div>
            <div className="font-condensed font-normal text-[11px] tracking-[.4em] uppercase mb-0.5"
              style={{ color: ts.accent }}>
              {event.month}
            </div>
            <div className="font-condensed font-normal text-[9px] tracking-[.3em] text-white/28">
              {event.year}
            </div>
          </div>

          {/* Divider */}
          <div className="w-10 h-px" style={{ background: `linear-gradient(to right,transparent,${ts.accent},transparent)` }} />

          {/* Countdown */}
          {event.target && (
            <div>
              <div className="font-condensed font-normal text-[7.5px] tracking-[.42em] uppercase text-white/28 text-center mb-3">
                Starts In
              </div>
              <div className="flex items-end gap-2">
                <CountdownUnit value={days}  label="Days" />
                <CountdownUnit value={hours} label="Hrs"  />
                <CountdownUnit value={mins}  label="Min"  />
                <CountdownUnit value={secs}  label="Sec"  />
              </div>
            </div>
          )}
        </div>

        {/* Right — event details */}
        <div className="flex-1 p-8 flex flex-col justify-between gap-6">
          <div>
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className={`font-condensed font-normal text-[7.5px] tracking-[.35em] uppercase border px-2.5 py-1 ${ts.text} ${ts.border} ${ts.bg}`}>
                {event.type}
              </span>
              <span className={`font-condensed font-normal text-[7.5px] tracking-[.35em] uppercase border px-2.5 py-1 ${STATUS_STYLES[event.status]}`}>
                {event.status}
              </span>
              <span className="font-condensed font-normal text-[7.5px] tracking-[.28em] uppercase text-white/28">
                {event.price}
              </span>
            </div>

            {/* Title */}
            <h2
              className="font-display leading-[.88] mb-3"
              style={{
                fontSize:             'clamp(2rem,4.5vw,3.8rem)',
                letterSpacing:        '.02em',
                background:           'linear-gradient(90deg,#ffffff,rgba(255,255,255,.8))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor:  'transparent',
                backgroundClip:       'text',
              }}>
              {event.title}
            </h2>

            {/* Sub */}
            <p className="font-condensed font-normal text-[11px] tracking-[.18em] uppercase text-brand-cyan mb-4">
              {event.sub}
            </p>

            {/* Rule */}
            <div className="w-12 h-[1.5px] mb-4"
              style={{ background: `linear-gradient(to right,${ts.accent},#E0357A,transparent)` }} />

            {/* Desc */}
            <p className="font-body text-[13.5px] leading-[1.85] text-white/42 tracking-[.02em] max-w-[55ch] mb-5">
              {event.desc}
            </p>

            {/* Meta row */}
            <div className="flex flex-wrap gap-5 mb-5">
              {[
                { dot: '#FF6230', val: event.time },
                { dot: '#8B31E8', val: event.venue },
                { dot: '#00DFFF', val: event.duration },
              ].map(({ dot, val }) => (
                <div key={val} className="flex items-center gap-1.5">
                  <span className="w-[5px] h-[5px] rounded-full shrink-0" style={{ background: dot }} />
                  <span className="font-condensed font-normal text-[10px] tracking-[.22em] uppercase text-white/40">{val}</span>
                </div>
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {event.tags.map((t) => (
                <span key={t} className="font-condensed font-normal text-[8px] tracking-[.22em] uppercase px-2.5 py-1 border border-white/[.09] text-white/38 bg-white/[.03]">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom: seats bar + CTAs */}
          <div className="flex flex-wrap items-end justify-between gap-5">
            {/* Seats */}
            <div className="flex-1 min-w-[180px] max-w-[260px]">
              <div className="flex justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: ts.accent }} />
                  <span className="font-condensed font-normal text-[7.5px] tracking-[.38em] uppercase text-white/28">
                    Seats
                  </span>
                </div>
                <span className="font-condensed font-normal text-[10px] tracking-[.04em]" style={{ color: ts.accent }}>
                  {event.seats - event.filled} / {event.seats} left
                </span>
              </div>
              <div className="h-[2px] bg-white/[.07] overflow-hidden rounded-full">
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, background: `linear-gradient(90deg,${ts.accent},#E0357A)`, boxShadow: `0 0 8px ${ts.accent}40` }} />
              </div>
            </div>

            {/* CTAs */}
            <div className="flex gap-3">
              <button className="font-condensed font-normal text-[9px] tracking-[.4em] uppercase text-white bg-brand-orange border-none px-7 py-3.5 cursor-pointer shadow-[0_0_22px_rgba(255,98,48,.28)] hover:bg-[#ff7a4a] hover:shadow-[0_0_40px_rgba(255,98,48,.55)] hover:-translate-y-px transition-all duration-300">
                Register Now →
              </button>
              <button className="font-condensed font-normal text-[9px] tracking-[.4em] uppercase text-white/40 bg-white/[.03] border border-white/[.1] px-7 py-3.5 cursor-pointer hover:border-brand-cyan hover:text-brand-cyan hover:bg-brand-cyan/[.04] transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Regular event card ────────────────────────────────────────────
function EventCard({ event, index }) {
  const ts  = TYPE_STYLES[event.type] ?? TYPE_STYLES['Workshop']
  const pct = event.seats < 900 ? Math.round((event.filled / event.seats) * 100) : 5

  return (
    <div
      className="group event-card-appear relative flex bg-white/[.025] border border-white/[.07] hover:-translate-y-0.5 transition-all duration-300"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Corner brackets */}
      <div
        className="absolute top-0 left-0 w-4 h-4 border-t border-l opacity-40 group-hover:opacity-100 transition-opacity duration-300"
        style={{ borderColor: `${ts.accent}60` }}
      />
      <div
        className="absolute bottom-0 right-0 w-4 h-4 border-b border-r transition-all duration-300"
        style={{ borderColor: `${ts.accent}40` }}
      />

      {/* Top accent on hover */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg,${ts.accent},#E0357A,transparent)` }} />

      {/* Date column */}
      <div
        className="shrink-0 w-[70px] flex flex-col items-center justify-center py-5 border-r border-white/[.06]"
        style={{ background: `linear-gradient(180deg,${ts.accent}0c,transparent)` }}
      >
        <span className="font-display text-[2.2rem] leading-none text-white/88 tabular-nums">{event.day}</span>
        <span className="font-condensed font-normal text-[8px] tracking-[.3em] uppercase mt-0.5" style={{ color: ts.accent }}>
          {event.month}
        </span>
        <span className="font-condensed font-normal text-[7px] tracking-[.2em] text-white/22 mt-0.5">{event.year}</span>
      </div>

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col gap-3 min-w-0">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={`font-condensed font-normal text-[7px] tracking-[.32em] uppercase border px-2 py-0.5 ${ts.text} ${ts.border} ${ts.bg}`}>
            {event.type}
          </span>
          <span className={`font-condensed font-normal text-[7px] tracking-[.32em] uppercase border px-2 py-0.5 ${STATUS_STYLES[event.status]}`}>
            {event.status}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display text-white leading-[.9] truncate"
          style={{ fontSize: 'clamp(1.1rem,2vw,1.45rem)', letterSpacing: '.02em' }}>
          {event.title}
        </h3>

        {/* Sub */}
        <p className="font-body text-[11.5px] text-white/38 leading-[1.6] line-clamp-2 tracking-[.02em]">
          {event.sub}
        </p>

        {/* Meta */}
        <div className="flex flex-wrap gap-3">
          {[event.time, event.venue].map((v) => (
            <div key={v} className="flex items-center gap-1.5">
              <span className="w-[4px] h-[4px] rounded-full shrink-0" style={{ backgroundColor: `${ts.accent}99` }} />
              <span className="font-condensed font-normal text-[8px] tracking-[.2em] uppercase text-white/30 truncate max-w-[160px]">{v}</span>
            </div>
          ))}
        </div>

        {/* Seats bar */}
        {event.seats < 900 && (
          <div>
            <div className="flex justify-between mb-1">
              <span className="font-condensed font-normal text-[7px] tracking-[.32em] uppercase text-white/22">Seats</span>
              <span className="font-condensed font-normal text-[8px] text-brand-orange">{event.seats - event.filled} left</span>
            </div>
            <div className="h-px bg-white/[.06] overflow-hidden">
              <div className="h-full" style={{ width: `${pct}%`, background: `linear-gradient(90deg,${ts.accent},#E0357A)` }} />
            </div>
          </div>
        )}
      </div>

      {/* CTA column */}
      <div className="shrink-0 flex flex-col items-center justify-center gap-2 p-4 pl-0">
        <span className="font-condensed text-[9px] tracking-[.1em] font-medium" style={{ color: ts.accent }}>
          {event.price}
        </span>
        <button
          className="font-condensed font-normal text-[8px] tracking-[.32em] uppercase text-white border-none px-4 py-2.5 cursor-pointer transition-all duration-300 whitespace-nowrap"
          style={{ backgroundColor: ts.accent, boxShadow: `0 0 14px ${ts.accent}40` }}
        >
          Register →
        </button>
        <button className="font-condensed font-normal text-[8px] tracking-[.32em] uppercase text-white/28 bg-transparent border border-white/[.08] px-4 py-2.5 cursor-pointer transition-all duration-300 whitespace-nowrap"
          style={{ borderColor: `${ts.accent}30` }}
        >
          Details
        </button>
      </div>
    </div>
  )
}

// ── Past event card ───────────────────────────────────────────────
function PastCard({ event }) {
  const ts = TYPE_STYLES[event.type] ?? TYPE_STYLES['Workshop']
  return (
    <div className="relative shrink-0 w-[220px] p-5 border border-white/[.06] bg-white/[.02] hover:-translate-y-0.5 transition-all duration-300 group"
      style={{ borderColor: `${ts.accent}25` }}
    >
      <div
        className="absolute top-0 left-0 w-4 h-4 border-t border-l opacity-30 group-hover:opacity-70 transition-opacity duration-300"
        style={{ borderColor: ts.accent }}
      />

      <span className={`font-condensed font-normal text-[7px] tracking-[.32em] uppercase border px-2 py-0.5 mb-3 inline-block ${ts.text} ${ts.border} ${ts.bg}`}>
        {event.type}
      </span>
      <h4 className="font-display text-white/80 leading-[.92] mb-2"
        style={{ fontSize: '1.2rem', letterSpacing: '.02em' }}>
        {event.title}
      </h4>
      <p className="font-body text-[11px] text-white/32 mb-3 leading-[1.6]">
        {event.highlight}
      </p>
      <div className="flex items-center justify-between">
        <span className="font-condensed font-normal text-[8px] tracking-[.25em] uppercase text-white/22">{event.date}</span>
        <div className="flex items-center gap-1">
          <span className="w-[4px] h-[4px] rounded-full" style={{ backgroundColor: `${ts.accent}50` }} />
          <span className="font-condensed font-normal text-[8px] tracking-[.2em]" style={{ color: `${ts.accent}80` }}>{event.attendees}</span>
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────
export default function EventsPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [filterKey,    setFilterKey]    = useState(0)
  const pastRef = useRef(null)

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = PAGE_CSS
    document.head.appendChild(style)
    const link = document.createElement('link')
    link.rel   = 'stylesheet'
    link.href  = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@300;400&family=Barlow:wght@300&display=swap'
    document.head.appendChild(link)
    return () => {
      document.head.removeChild(style)
      document.head.removeChild(link)
    }
  }, [])

  const handleFilter = (f) => {
    setActiveFilter(f)
    setFilterKey((k) => k + 1)
  }

  const featured   = EVENTS.find((e) => e.featured)
  const others     = EVENTS.filter((e) => !e.featured && (activeFilter === 'All' || e.type === activeFilter))

  return (
    <div className="relative min-h-screen bg-brand-bg overflow-x-hidden">

      {/* ═══════════════════════════════════════
          PAGE HERO
      ═══════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-16 pb-16" style={{ borderBottom: '1px solid rgba(255,255,255,.055)' }}>
        <Atmosphere />

        {/* Decorative calendar grid (background) */}
        <div className="absolute right-0 top-0 bottom-0 w-[42%] pointer-events-none overflow-hidden opacity-[.025]" aria-hidden="true">
          <div className="grid grid-cols-7 gap-px p-6 h-full content-start">
            {['S','M','T','W','T','F','S'].map((d, i) => (
              <div key={i} className="text-center font-display text-[.65rem] tracking-[.2em] text-white pb-2">{d}</div>
            ))}
            {Array.from({ length: 35 }).map((_, i) => (
              <div key={i} className="aspect-square border border-white/10 flex items-center justify-center">
                {[3,8,17,22,26].includes(i) && (
                  <div className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-[2] max-w-[1200px] mx-auto px-8">
          {/* Ghost number */}
          <div aria-hidden="true" className="font-display leading-none select-none -mb-4 pointer-events-none"
            style={{ fontSize: 'clamp(5rem,10vw,9rem)', color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,.04)', letterSpacing: '-.01em' }}>
            05
          </div>

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-[7px] mb-6 bg-brand-orange/[.07] border border-brand-orange/25">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-pulse" />
            <span className="font-condensed font-normal text-[9px] tracking-[.42em] uppercase text-brand-orange">
              Events &amp; Workshops
            </span>
          </div>

          {/* Title */}
          <div className="mb-6">
            <span className="block font-display leading-[.88]"
              style={{ fontSize: 'clamp(3rem,8vw,7rem)', letterSpacing: '.025em', color: 'transparent', WebkitTextStroke: '1px rgba(255,255,255,.28)' }}>
              WHAT'S
            </span>
            <span className="block font-display leading-[.88] text-grad-accent"
              style={{ fontSize: 'clamp(3rem,8vw,7rem)', letterSpacing: '.025em', filter: 'drop-shadow(0 0 28px rgba(255,98,48,.24))' }}>
              HAPPENING
            </span>
            <span className="block font-condensed font-normal text-brand-cyan tracking-[.2em] uppercase mt-2"
              style={{ fontSize: 'clamp(11px,1.5vw,15px)' }}>
              Workshops · Summer Camps · School Visits · Competitions
            </span>
          </div>

          {/* Stats strip */}
          <div className="flex flex-wrap gap-0 border border-white/[.06] w-fit mb-8">
            {[
              { num: '12+', label: 'Events This Year' },
              { num: '20+', label: 'Schools Visited'  },
              { num: '800+', label: 'Students Reached' },
            ].map((s, i) => (
              <div key={s.label}
                className={`px-7 py-4 text-center ${i > 0 ? 'border-l border-white/[.06]' : ''}`}>
                <div className="font-display leading-none mb-0.5"
                  style={{ fontSize: '1.8rem', letterSpacing: '.03em', background: 'linear-gradient(90deg,#FF6230,#E0357A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {s.num}
                </div>
                <div className="font-condensed font-normal text-[8px] tracking-[.35em] uppercase text-white/28">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CONTENT
      ═══════════════════════════════════════ */}
      <div className="relative max-w-[1200px] mx-auto px-8 py-12">
        <Atmosphere />
        <div className="relative z-[2]">

          {/* ── Featured event ── */}
          {featured && (
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-[1.5px]" style={{ background: 'linear-gradient(to right,#FF6230,#E0357A)' }} />
                <span className="font-condensed font-normal text-[9px] tracking-[.42em] uppercase text-white/30">
                  Featured Event
                </span>
              </div>
              <FeaturedEvent event={featured} />
            </div>
          )}

          {/* ── Filter tabs ── */}
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="font-condensed font-normal text-[8px] tracking-[.4em] uppercase text-white/25 mr-1">
              Filter:
            </span>
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => handleFilter(f)}
                className={`filter-btn font-condensed font-normal text-[9px] tracking-[.32em] uppercase px-4 py-2 border cursor-pointer
                  ${activeFilter === f
                    ? 'bg-brand-orange text-white border-brand-orange shadow-[0_0_18px_rgba(255,98,48,.3)]'
                    : 'text-white/40 border-white/[.1] bg-white/[.02] hover:border-brand-orange/35 hover:text-white/70'
                  }`}
              >
                {f}
              </button>
            ))}
            <span className="font-condensed font-normal text-[8px] tracking-[.28em] uppercase text-white/20 ml-2">
              {others.length} {activeFilter === 'All' ? 'upcoming' : activeFilter.toLowerCase()} events
            </span>
          </div>

          {/* ── Events list ── */}
          <div key={filterKey} className="flex flex-col gap-3 mb-16">
            {others.length > 0
              ? others.map((e, i) => <EventCard key={e.id} event={e} index={i} />)
              : (
                <div className="flex items-center justify-center py-16 border border-white/[.06] bg-white/[.02]">
                  <p className="font-condensed font-normal text-[10px] tracking-[.42em] uppercase text-white/22">
                    No {activeFilter} events currently scheduled
                  </p>
                </div>
              )
            }
          </div>

          {/* ── Past events ── */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-5 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-[1.5px]" style={{ background: 'linear-gradient(to right,#FF6230,#E0357A)' }} />
                <span className="font-condensed font-normal text-[9px] tracking-[.42em] uppercase text-white/30">
                  Past Events
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => pastRef.current?.scrollBy({ left: -240, behavior: 'smooth' })}
                  className="w-8 h-8 border border-white/[.1] bg-white/[.03] hover:border-brand-orange/40 hover:bg-brand-orange/[.07] transition-all duration-300 flex items-center justify-center font-condensed text-white/40 hover:text-brand-orange text-sm cursor-pointer">
                  ‹
                </button>
                <button onClick={() => pastRef.current?.scrollBy({ left: 240, behavior: 'smooth' })}
                  className="w-8 h-8 border border-white/[.1] bg-white/[.03] hover:border-brand-orange/40 hover:bg-brand-orange/[.07] transition-all duration-300 flex items-center justify-center font-condensed text-white/40 hover:text-brand-orange text-sm cursor-pointer">
                  ›
                </button>
              </div>
            </div>
            <div ref={pastRef} className="flex gap-4 overflow-x-auto pb-2 events-scrollbar scroll-smooth">
              {PAST.map((p) => <PastCard key={p.title} event={p} />)}
            </div>
          </div>

          {/* ── School booking CTA ── */}
          <div className="relative flex flex-wrap items-center justify-between gap-6 p-8 bg-white/[.02] border border-white/[.07]">
            <div className="absolute top-0 left-0 right-0 h-[1.5px]"
              style={{ background: 'linear-gradient(90deg,#FF6230,#E0357A,#8B31E8,transparent)' }} />
            <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-brand-orange" />
            <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-brand-purple/45" />

            {/* Ghost school icon */}
            <div aria-hidden="true" className="absolute right-8 top-1/2 -translate-y-1/2 font-display text-[6rem] leading-none select-none pointer-events-none opacity-[.04]"
              style={{ color: 'transparent', WebkitTextStroke: '1px white', letterSpacing: '-.01em' }}>
              🏫
            </div>

            <div className="relative z-10">
              <span className="font-display block leading-none mb-1.5 text-grad-accent"
                style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', letterSpacing: '.03em' }}>
                Bring Us To Your Campus
              </span>
              <span className="font-body text-[13.5px] text-white/38 tracking-[.02em]">
                We run robotics workshops and live demos at schools and colleges across Bhopal.
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0 flex-wrap relative z-10">
              <button className="font-condensed font-normal text-[9px] tracking-[.4em] uppercase text-white bg-brand-orange border-none px-7 py-3.5 cursor-pointer shadow-[0_0_22px_rgba(255,98,48,.28)] hover:bg-[#ff7a4a] hover:shadow-[0_0_40px_rgba(255,98,48,.55)] hover:-translate-y-px transition-all duration-300">
                Book a Session →
              </button>
              <button className="font-condensed font-normal text-[9px] tracking-[.4em] uppercase text-white/42 bg-white/[.03] border border-white/[.12] px-7 py-3.5 cursor-pointer hover:border-brand-cyan hover:text-brand-cyan hover:bg-brand-cyan/[.04] transition-all duration-300">
                Download Brochure
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
