import { useState, useEffect, useRef, useCallback } from 'react'

const bebasNeue = { fontFamily: "'Bebas Neue', sans-serif" }
const syne      = { fontFamily: "'Syne', sans-serif" }
const dmSans    = { fontFamily: "'DM Sans', sans-serif" }

// ── DATA ──────────────────────────────────────────────────────────
const testimonials = [
  {
    id: 1,
    quote: "I came in not knowing what a resistor was. I left with a working line-follower robot and a PCB I designed myself. Nimo Labs completely changed what I thought I was capable of.",
    name: "Aanya Verma",
    age: 16,
    city: "Bhopal",
    course: "Arduino Masterclass",
    track: "Hardware",
    color: '#FF6B35',
    rgb: '255,107,53',
    rating: 5,
  },
  {
    id: 2,
    quote: "The ESP32 course broke my brain in the best way possible. MQTT, cloud dashboards, BLE — I built a smart home system in week 8 that my dad uses every day. That feeling is unbeatable.",
    name: "Rohan Kulkarni",
    age: 17,
    city: "Indore",
    course: "ESP32 & IoT Dev",
    track: "IoT",
    color: '#00F5FF',
    rgb: '0,245,255',
    rating: 5,
  },
  {
    id: 3,
    quote: "ROS2 felt impossible from the outside. The instructors at Nimo Labs made it click in week two. By the end I had an autonomous maze-solving robot running SLAM. I still can't believe I built that.",
    name: "Divya Nair",
    age: 18,
    city: "Bhopal",
    course: "Robotics with ROS",
    track: "Robotics",
    color: '#A855F7',
    rgb: '168,85,247',
    rating: 5,
  },
  {
    id: 4,
    quote: "The Summer Camp was 5 days of the most intense, most fun learning I've ever done. We built a sensor-fused obstacle avoider from scratch. I'm already registered for the advanced track.",
    name: "Kabir Singh",
    age: 14,
    city: "Bhopal",
    course: "Summer Camp 2024",
    track: "Camp",
    color: '#FF006E',
    rgb: '255,0,110',
    rating: 5,
  },
  {
    id: 5,
    quote: "Python for AI here taught me more in 12 weeks than a year of self-study YouTube videos. I trained my first real ML model and deployed it. The instructors answer every question — every single one.",
    name: "Sneha Mishra",
    age: 17,
    city: "Sehore",
    course: "Python for AI & ML",
    track: "Software & AI",
    color: '#00F5FF',
    rgb: '0,245,255',
    rating: 5,
  },
  {
    id: 6,
    quote: "PCB Design was the course that made me want to become a hardware engineer. I designed a 4-layer board, sent it to fab, and held something I created in my hands. That's Nimo Labs.",
    name: "Arjun Patel",
    age: 18,
    city: "Bhopal",
    course: "PCB Design & Electronics",
    track: "Hardware",
    color: '#FF6B35',
    rgb: '255,107,53',
    rating: 5,
  },
  {
    id: 7,
    quote: "My school doesn't teach any of this. Without Nimo Labs I would never have touched a soldering iron or written a line of embedded C. Now robotics is literally my plan for life.",
    name: "Priya Sharma",
    age: 15,
    city: "Bhopal",
    course: "Arduino Masterclass",
    track: "Hardware",
    color: '#A855F7',
    rgb: '168,85,247',
    rating: 5,
  },
  {
    id: 8,
    quote: "The Raspberry Pi course opened up computer vision for me. We ran OpenCV at 30fps on a Pi 4, built a Flask API, and by the end I had a smart camera that recognises faces. Mind-blowing.",
    name: "Yash Tiwari",
    age: 16,
    city: "Bhopal",
    course: "Raspberry Pi & Linux",
    track: "Edge AI",
    color: '#FF006E',
    rgb: '255,0,110',
    rating: 5,
  },
]

const DURATION = 5000 // ms per slide

// ── Rating dots ───────────────────────────────────────────────────
function RatingDots({ count, color }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{
            background: i < count ? color : 'rgba(255,255,255,.12)',
            boxShadow:  i < count ? `0 0 6px rgba(${testimonials.find(t=>t.color===color)?.rgb || '255,107,53'},.6)` : 'none',
          }}
        />
      ))}
    </div>
  )
}

// ── Main Card ─────────────────────────────────────────────────────
function TestimonialCard({ t, visible, direction }) {
  return (
    <div
      className="absolute inset-0"
      style={{
        opacity:    visible ? 1 : 0,
        transform:  visible
          ? 'translateY(0) scale(1)'
          : direction === 'next'
            ? 'translateY(22px) scale(.98)'
            : 'translateY(-22px) scale(.98)',
        transition: 'opacity .55s cubic-bezier(.16,1,.3,1), transform .55s cubic-bezier(.16,1,.3,1)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <div
        className="relative h-full overflow-hidden"
        style={{
          background: 'rgba(255,255,255,.025)',
          border:     `1px solid rgba(${t.rgb},.28)`,
          boxShadow:  `0 0 60px rgba(${t.rgb},.1), inset 0 0 80px rgba(${t.rgb},.03)`,
        }}
      >
        {/* Accent top bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: `linear-gradient(90deg,${t.color},rgba(${t.rgb},.3),transparent)` }} />

        {/* Corner TL */}
        <div className="absolute top-0 left-0 w-7 h-7"
          style={{ borderTop: `1px solid ${t.color}`, borderLeft: `1px solid ${t.color}` }} />
        {/* Corner BR */}
        <div className="absolute bottom-0 right-0 w-7 h-7"
          style={{ borderBottom: '1px solid rgba(168,85,247,.45)', borderRight: '1px solid rgba(168,85,247,.45)' }} />

        {/* Scanlines inside card */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(0,0,0,.04) 3px,rgba(0,0,0,.04) 4px)',
        }} />

        {/* ── Layout: left initial + right content ── */}
        <div className="relative z-[1] h-full flex">

          {/* LEFT — decorative initial block */}
          <div
            className="hidden md:flex flex-col items-center justify-center flex-shrink-0 w-[180px] border-r"
            style={{ borderColor: `rgba(${t.rgb},.12)` }}
          >
            {/* Giant initial */}
            <div
              className="leading-none select-none"
              style={{
                ...bebasNeue,
                fontSize: '10rem',
                color: 'transparent',
                WebkitTextStroke: `2px rgba(${t.rgb},.22)`,
                lineHeight: 1,
              }}
            >
              {t.name.charAt(0)}
            </div>

            {/* Vertical label */}
            <div
              className="mt-4 text-[7px] font-bold tracking-[.4em] uppercase text-[#F0EAD6]/[.22] rotate-0 text-center px-4"
              style={syne}
            >
              {t.city} · Age {t.age}
            </div>
          </div>

          {/* RIGHT — content */}
          <div className="flex-1 flex flex-col justify-between p-10 md:p-12">

            {/* Top: course badge + rating */}
            <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
              <div
                className="inline-flex items-center gap-2 px-3 py-[6px] border"
                style={{
                  background:   `rgba(${t.rgb},.07)`,
                  borderColor:  `rgba(${t.rgb},.28)`,
                }}
              >
                <span className="w-1 h-1 rounded-full" style={{ background: t.color }} />
                <span className="text-[8px] font-bold tracking-[.38em] uppercase"
                  style={{ ...syne, color: t.color }}>{t.track}</span>
              </div>

              <div className="flex items-center gap-3">
                <RatingDots count={t.rating} color={t.color} />
                <span className="text-[9px] font-bold tracking-[.2em] text-[#F0EAD6]/30" style={syne}>
                  {t.rating}.0
                </span>
              </div>
            </div>

            {/* Quote mark */}
            <div
              className="leading-none mb-4 select-none"
              style={{
                ...bebasNeue,
                fontSize: '5rem',
                color: t.color,
                opacity: 0.25,
                lineHeight: 0.7,
              }}
            >
              "
            </div>

            {/* Quote text */}
            <blockquote
              className="font-light leading-[1.85] text-[#F0EAD6]/75 flex-1 mb-8"
              style={{ ...dmSans, fontSize: 'clamp(14px,1.4vw,17px)' }}
            >
              {t.quote}
            </blockquote>

            {/* Bottom: name + course */}
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                {/* Rule */}
                <div className="w-8 h-px mb-3"
                  style={{ background: `linear-gradient(90deg,${t.color},transparent)` }} />
                <div className="text-[17px] font-bold text-[#F0EAD6]/90 mb-0.5" style={syne}>
                  {t.name}
                </div>
                <div className="text-[10px] font-light text-[#F0EAD6]/35 tracking-[.06em]" style={dmSans}>
                  {t.course}
                </div>
              </div>

              {/* Closing quote */}
              <div
                className="leading-none select-none"
                style={{
                  ...bebasNeue,
                  fontSize: '5rem',
                  color: t.color,
                  opacity: 0.18,
                  lineHeight: 0.7,
                }}
              >
                "
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

// ── Sidebar mini cards ─────────────────────────────────────────────
function SideCard({ t, onClick, side }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      className="relative overflow-hidden p-4 cursor-pointer flex-shrink-0"
      style={{
        background:  hov ? 'rgba(255,255,255,.04)' : 'rgba(255,255,255,.02)',
        border:      `1px solid ${hov ? `rgba(${t.rgb},.4)` : 'rgba(255,255,255,.06)'}`,
        transform:   hov ? 'translateY(-3px)' : 'none',
        transition:  'all .35s cubic-bezier(.23,1,.32,1)',
        opacity:     0.55,
        width:       '100%',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
    >
      <div className="absolute top-0 left-0 right-0 h-[1.5px]"
        style={{ background: t.color, transform: hov ? 'scaleX(1)' : 'scaleX(0)', transformOrigin: 'left', transition: 'transform .35s ease' }} />

      <div className="text-[7px] font-bold tracking-[.35em] uppercase mb-2"
        style={{ ...syne, color: t.color }}>{t.track}</div>
      <p className="text-[11px] font-light text-[#F0EAD6]/50 leading-[1.65] mb-3 line-clamp-2" style={dmSans}>
        "{t.quote.slice(0, 72)}…"
      </p>
      <div className="text-[11px] font-bold text-[#F0EAD6]/60" style={syne}>{t.name}</div>
    </div>
  )
}

// ── MAIN EXPORT ───────────────────────────────────────────────────
export default function Testimonials() {
  const [idx,       setIdx]       = useState(0)
  const [direction, setDirection] = useState('next')
  const [paused,    setPaused]    = useState(false)
  const [progress,  setProgress]  = useState(0)

  const pausedRef   = useRef(false)
  const progressRef = useRef(0)
  const rafRef      = useRef(null)
  const lastRef     = useRef(null)

  const go = useCallback((nextIdx, dir = 'next') => {
    setDirection(dir)
    setIdx(nextIdx)
    progressRef.current = 0
    setProgress(0)
    lastRef.current = null
  }, [])

  const prev = () => go((idx - 1 + testimonials.length) % testimonials.length, 'prev')
  const next = useCallback(() => go((idx + 1) % testimonials.length, 'next'), [idx, go])

  // RAF-driven progress bar + auto-advance
  useEffect(() => {
    const tick = (ts) => {
      if (!lastRef.current) lastRef.current = ts
      if (!pausedRef.current) {
        const delta = ts - lastRef.current
        progressRef.current = Math.min(progressRef.current + (delta / DURATION) * 100, 100)
        setProgress(progressRef.current)
        if (progressRef.current >= 100) {
          progressRef.current = 0
          lastRef.current = ts
          setIdx((i) => {
            const next = (i + 1) % testimonials.length
            setDirection('next')
            return next
          })
        }
      }
      lastRef.current = pausedRef.current ? ts : ts
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  // Sync paused ref
  useEffect(() => { pausedRef.current = paused }, [paused])

  const current = testimonials[idx]
  const prevT   = testimonials[(idx - 1 + testimonials.length) % testimonials.length]
  const nextT   = testimonials[(idx + 1) % testimonials.length]

  return (
    <section
      className="relative overflow-hidden py-[88px] bg-[#050508] border-y border-white/[.055]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      {/* ── Atmosphere — shifts with testimonial color ── */}
      <div
        className="absolute -top-[120px] -left-[80px] w-[600px] h-[480px] rounded-full pointer-events-none transition-all duration-1000"
        style={{ background: `radial-gradient(ellipse,rgba(${current.rgb},.12) 0%,transparent 70%)` }}
      />
      <div
        className="absolute -bottom-[120px] -right-[60px] w-[560px] h-[440px] rounded-full pointer-events-none transition-all duration-1000"
        style={{ background: 'radial-gradient(ellipse,rgba(168,85,247,.1) 0%,transparent 70%)' }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[260px] rounded-full pointer-events-none transition-all duration-1000"
        style={{ background: `radial-gradient(ellipse,rgba(${current.rgb},.04) 0%,transparent 70%)` }}
      />
      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(0,0,0,.055) 3px,rgba(0,0,0,.055) 4px)',
      }} />
      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(${current.rgb},.02) 1px,transparent 1px),linear-gradient(90deg,rgba(${current.rgb},.02) 1px,transparent 1px)`,
        backgroundSize: '48px 48px',
        transition: 'background-image 1s ease',
      }} />

      <div className="relative z-[2] max-w-[1200px] mx-auto px-12">

        {/* ── Header ── */}
        <div className="flex items-end justify-between gap-8 flex-wrap mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-[7px] bg-[#FF6B35]/[.07] border border-[#FF6B35]/[.22] mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse" />
              <span className="text-[9px] font-bold tracking-[.42em] uppercase text-[#FF6B35]" style={syne}>
                What Students Say
              </span>
            </div>
            <div>
              <span className="block leading-[.9] tracking-[-0.01em]" style={{
                ...bebasNeue,
                fontSize: 'clamp(38px,6vw,68px)',
                WebkitTextStroke: '1px rgba(240,234,214,.35)',
                color: 'transparent',
              }}>STRAIGHT FROM</span>
              <span
                className="block leading-[.9] tracking-[-0.01em] transition-all duration-700"
                style={{
                  ...bebasNeue,
                  fontSize: 'clamp(38px,6vw,68px)',
                  color: current.color,
                  textShadow: `0 0 40px rgba(${current.rgb},.38)`,
                }}
              >THE BUILDERS</span>
            </div>
            <div className="w-14 h-px mt-5"
              style={{ background: `linear-gradient(90deg,${current.color},transparent)`, transition: 'background .7s ease' }} />
          </div>

          {/* Overall rating display */}
          <div className="relative bg-white/[.03] border border-white/[.07] p-6 flex-shrink-0">
            <div className="absolute top-0 left-0 w-5 h-5"
              style={{ borderTop: `1px solid ${current.color}`, borderLeft: `1px solid ${current.color}`, transition: 'border-color .7s ease' }} />
            <div className="absolute bottom-0 right-0 w-5 h-5"
              style={{ borderBottom: '1px solid rgba(168,85,247,.4)', borderRight: '1px solid rgba(168,85,247,.4)' }} />
            <div className="text-[8px] font-bold tracking-[.38em] uppercase text-[#F0EAD6]/[.28] mb-3" style={syne}>
              Overall Rating
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="leading-none" style={{ ...bebasNeue, fontSize: '2.8rem', color: current.color, transition: 'color .7s ease' }}>
                5.0
              </span>
              <span className="text-[10px] font-light text-[#F0EAD6]/30 tracking-[.04em]" style={dmSans}>
                / 5.0
              </span>
            </div>
            <div className="flex gap-1 mb-2">
              {Array.from({length:5}).map((_,i) => (
                <div key={i} className="w-2 h-2 rounded-full transition-all duration-700"
                  style={{ background: current.color, boxShadow: `0 0 8px rgba(${current.rgb},.6)` }} />
              ))}
            </div>
            <div className="text-[9px] font-light text-[#F0EAD6]/25 tracking-[.04em]" style={dmSans}>
              Based on {testimonials.length * 312}+ reviews
            </div>
          </div>
        </div>

        {/* ── Main layout: prev-card | featured | next-card ── */}
        <div className="flex gap-4 items-stretch mb-8">

          {/* Prev side card — desktop only */}
          <div className="hidden xl:flex flex-col justify-center w-[220px] flex-shrink-0">
            <SideCard t={prevT} onClick={prev} side="left" />
          </div>

          {/* Featured card */}
          <div className="flex-1 relative" style={{ minHeight: 340 }}>
            {/* Progress bar — top of the card area */}
            <div className="absolute -top-3 left-0 right-0 h-px z-10"
              style={{ background: 'rgba(255,255,255,.07)' }}>
              <div
                className="h-full transition-none"
                style={{
                  width:      `${progress}%`,
                  background: `linear-gradient(90deg,${current.color},rgba(${current.rgb},.5))`,
                  boxShadow:  `0 0 8px rgba(${current.rgb},.5)`,
                  transition: 'background .7s ease, box-shadow .7s ease',
                }}
              />
            </div>

            {/* Card stack */}
            <div className="relative w-full h-full" style={{ minHeight: 340 }}>
              {testimonials.map((t, i) => (
                <TestimonialCard
                  key={t.id}
                  t={t}
                  visible={i === idx}
                  direction={direction}
                />
              ))}
            </div>
          </div>

          {/* Next side card — desktop only */}
          <div className="hidden xl:flex flex-col justify-center w-[220px] flex-shrink-0">
            <SideCard t={nextT} onClick={next} side="right" />
          </div>
        </div>

        {/* ── Controls row ── */}
        <div className="flex items-center justify-between gap-6 mb-14">

          {/* Prev / Next buttons */}
          <div className="flex gap-2">
            {[{ label: '‹', fn: prev }, { label: '›', fn: next }].map(({ label, fn }) => (
              <button
                key={label}
                onClick={fn}
                className="w-10 h-10 flex items-center justify-center text-xl border bg-white/[.03] transition-all duration-200"
                style={{
                  borderColor: 'rgba(255,255,255,.1)',
                  color: 'rgba(240,234,214,.5)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = current.color
                  e.currentTarget.style.color = current.color
                  e.currentTarget.style.background = `rgba(${current.rgb},.07)`
                  e.currentTarget.style.boxShadow = `0 0 16px rgba(${current.rgb},.22)`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)'
                  e.currentTarget.style.color = 'rgba(240,234,214,.5)'
                  e.currentTarget.style.background = 'rgba(255,255,255,.03)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >{label}</button>
            ))}
          </div>

          {/* Dot navigation */}
          <div className="flex items-center gap-2">
            {testimonials.map((t, i) => (
              <button
                key={t.id}
                onClick={() => go(i, i > idx ? 'next' : 'prev')}
                className="transition-all duration-400"
                style={{
                  width:      i === idx ? 24 : 6,
                  height:     6,
                  background: i === idx ? current.color : 'rgba(255,255,255,.15)',
                  boxShadow:  i === idx ? `0 0 10px rgba(${current.rgb},.5)` : 'none',
                  border:     'none',
                  cursor:     'pointer',
                  padding:    0,
                }}
              />
            ))}
          </div>

          {/* Counter + pause indicator */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-light text-[#F0EAD6]/25 tracking-[.06em]" style={dmSans}>
              <span style={{ color: current.color, fontWeight: 700, transition: 'color .7s ease' }}>
                {String(idx + 1).padStart(2, '0')}
              </span>
              {' '}/ {String(testimonials.length).padStart(2, '0')}
            </span>
            {/* Pause indicator */}
            <div className="flex items-center gap-1.5">
              <span
                className="w-1 h-1 rounded-full"
                style={{ background: paused ? 'rgba(240,234,214,.25)' : current.color, transition: 'background .3s ease' }}
              />
              <span className="text-[8px] font-bold tracking-[.3em] uppercase text-[#F0EAD6]/20" style={syne}>
                {paused ? 'Paused' : 'Live'}
              </span>
            </div>
          </div>
        </div>

        {/* ── Scrolling name strip ── */}
        <div className="relative overflow-hidden border-t border-white/[.055] pt-8">
          <div className="text-[7px] font-bold tracking-[.45em] uppercase text-[#F0EAD6]/[.2] mb-4" style={syne}>
            Among our 6,000+ builders
          </div>

          {/* Marquee */}
          <div className="overflow-hidden">
            <div
              className="flex gap-0 whitespace-nowrap"
              style={{ animation: 'tmqScroll 32s linear infinite' }}
            >
              {[...testimonials, ...testimonials].map((t, i) => (
                <div
                  key={i}
                  className="inline-flex items-center gap-4 px-6 border-r border-white/[.055] flex-shrink-0"
                  style={{ cursor: 'default' }}
                >
                  {/* Avatar initial */}
                  <div
                    className="w-7 h-7 flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{
                      background: `rgba(${t.rgb},.1)`,
                      border: `1px solid rgba(${t.rgb},.25)`,
                      ...syne,
                      color: t.color,
                    }}
                  >
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-[#F0EAD6]/55 leading-none" style={syne}>
                      {t.name}
                    </div>
                    <div className="text-[8px] font-light text-[#F0EAD6]/25 mt-0.5 tracking-[.04em]" style={dmSans}>
                      {t.course}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Edge fades */}
          <div className="absolute left-0 top-8 bottom-0 w-16 pointer-events-none"
            style={{ background: 'linear-gradient(to right,#050508,transparent)' }} />
          <div className="absolute right-0 top-8 bottom-0 w-16 pointer-events-none"
            style={{ background: 'linear-gradient(to left,#050508,transparent)' }} />
        </div>

        {/* ── Bottom stats strip ── */}
        <div className="mt-10 border-t border-white/[.055] pt-8">
          <div className="h-[1.5px] mb-8"
            style={{ background: `linear-gradient(90deg,${current.color},rgba(168,85,247,.5),transparent)`, transition: 'background .7s ease' }} />
          <div className="flex items-center justify-between gap-8 flex-wrap">
            {[
              { num: '6,000+', label: 'Students Trained',    color: '#FF6B35' },
              { num: '4.9',    label: 'Avg Rating',           color: '#00F5FF' },
              { num: '100%',   label: 'Would Recommend',      color: '#A855F7' },
              { num: '2,500+', label: 'Five-Star Reviews',    color: '#FF006E' },
            ].map((s) => (
              <div key={s.label} className="flex items-baseline gap-2">
                <span className="leading-none" style={{ ...bebasNeue, fontSize: '1.8rem', color: s.color }}>
                  {s.num}
                </span>
                <span className="text-[8px] font-bold tracking-[.3em] uppercase text-[#F0EAD6]/25" style={syne}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes tmqScroll {
          from { transform: translateX(0) }
          to   { transform: translateX(-50%) }
        }
      `}</style>
    </section>
  )
}
