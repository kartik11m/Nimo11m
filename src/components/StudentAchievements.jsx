import { useState, useEffect, useRef, useCallback } from 'react'
import { useOwnerAuth } from '../context/OwnerAuthContext'

const bebasNeue = { fontFamily: "'Bebas Neue', cursive" }
const barlowCond = { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 300 }
const barlow     = { fontFamily: "'Barlow', sans-serif", fontWeight: 300 }
const syne      = { fontFamily: "'Syne', sans-serif" }
const dmSans    = { fontFamily: "'DM Sans', sans-serif" }

// ── Cinematic theme palette ──────────────────────────────────────
const C = {
  bg:     "#020203",
  orange: "#FF6230",
  pink:   "#E0357A",
  purple: "#8B31E8",
  cyan:   "#00DFFF",
}

// ── Data ─────────────────────────────────────────────────────────

const stats = [
  { end: 6200, suffix: '+', label: 'Students Trained',   color: '#FF6B35', rgb: '255,107,53'  },
  { end: 340,  suffix: '+', label: 'Robots Built',        color: '#00F5FF', rgb: '0,245,255'   },
  { end: 48,   suffix: '',  label: 'Competition Wins',    color: '#A855F7', rgb: '168,85,247'  },
  { end: 100,  suffix: '%', label: 'Certification Rate',  color: '#FF006E', rgb: '255,0,110'   },
]

const typeMap = {
  competition:   { label: 'Competition Win',     color: '#FF6B35', rgb: '255,107,53',  icon: '🏆' },
  project:       { label: 'Project Showcase',    color: '#A855F7', rgb: '168,85,247',  icon: '🤖' },
  certification: { label: 'Certification',       color: '#00F5FF', rgb: '0,245,255',   icon: '🎓' },
  special:       { label: 'Special Recognition', color: '#FF006E', rgb: '255,0,110',   icon: '⭐' },
}

const levelColor = { Beginner: '#00F5FF', Intermediate: '#FF6B35', Advanced: '#A855F7' }

const fallbackAchievements = [
  {
    id: 0, initial: 'AS', student: 'Arjun Sharma', city: 'Bhopal',
    robot: 'AutoPilot V3', type: 'competition',
    title: '1st Place — National Robotics Championship',
    subtitle: 'Autonomous Navigation Category · New Delhi 2025',
    quote: "Nimo Labs gave me the tools and confidence to compete at a national level. The ROS2 curriculum was a complete game-changer.",
    tags: ['ROS2', 'SLAM', 'Computer Vision'], level: 'Advanced', date: 'Mar 2025',
  },
  {
    id: 1, initial: 'PM', student: 'Priya Mehta', city: 'Indore',
    robot: 'AgroBot 2.0', type: 'project',
    title: 'Best Innovation — Bhopal Science Expo',
    subtitle: 'Smart agriculture monitoring system using ESP32',
    quote: "I built something I never thought possible. The IoT training completely changed how I see engineering.",
    tags: ['ESP32', 'IoT', 'Sensors'], level: 'Intermediate', date: 'Feb 2025',
  },
  {
    id: 2, initial: 'RV', student: 'Rahul Verma', city: 'Bhopal',
    robot: 'LineTracer X', type: 'certification',
    title: 'Advanced ROS2 Certification — Top of Batch',
    subtitle: 'Scored 98% — Highest in entire Batch 14 cohort',
    quote: "The structured curriculum made complex topics feel approachable. Every module built perfectly on the last.",
    tags: ['ROS2', 'Python', 'Navigation'], level: 'Advanced', date: 'Jan 2025',
  },
  {
    id: 3, initial: 'SP', student: 'Sneha Patel', city: 'Bhopal',
    robot: 'MediBot', type: 'special',
    title: 'Youngest Project Lead — Age 13',
    subtitle: 'Led a team of 4 to build a hospital assistance robot',
    quote: "Age is just a number. With the right guidance and the right team, anything is possible.",
    tags: ['Arduino', 'Leadership', 'Innovation'], level: 'Beginner', date: 'Dec 2024',
  },
]

const marqueeItems = [
  { icon: '🏆', text: 'Arjun S. — National Robotics Champion 2025'        },
  { icon: '🎓', text: 'Batch 14 — 100% Certification Rate'                },
  { icon: '🤖', text: 'Priya M. — Best Innovation Award, Science Expo'    },
  { icon: '⭐', text: 'Sneha P. — Youngest Project Lead, Age 13'          },
  { icon: '🏆', text: 'Robowar Finals — 2nd Place, MP State Level'         },
  { icon: '🎓', text: 'ROS2 Advanced — 8 New Certifications, March 2025'  },
  { icon: '🤖', text: 'Rahul V. — Top Scorer, Batch 14 Cohort'            },
  { icon: '⭐', text: '6,200+ Students Trained Across MP Region'           },
]

const stars = [
  { initial: 'AS', name: 'Arjun S.',  city: 'Bhopal',    spec: 'ROS2 & Autonomy',      color: '#A855F7' },
  { initial: 'PM', name: 'Priya M.',  city: 'Indore',    spec: 'IoT & ESP32',           color: '#FF6B35' },
  { initial: 'RV', name: 'Rahul V.',  city: 'Bhopal',    spec: 'Python & AI',           color: '#00F5FF' },
  { initial: 'SP', name: 'Sneha P.',  city: 'Bhopal',    spec: 'Arduino & Innovation',  color: '#FF006E' },
  { initial: 'KT', name: 'Karan T.',  city: 'Jabalpur',  spec: 'PCB Design',            color: '#FF6B35' },
  { initial: 'AR', name: 'Aisha R.',  city: 'Bhopal',    spec: 'Computer Vision',       color: '#A855F7' },
]

// ── Counter hook ─────────────────────────────────────────────────
function useCounter(end, duration = 2200, active = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    let raf
    const t0 = performance.now()
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setCount(Math.round(eased * end))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [end, duration, active])
  return count
}

// ── Stat counter box ─────────────────────────────────────────────
function StatBox({ end, suffix, label, color, rgb, active }) {
  const count = useCounter(end, 2200, active)
  return (
    <div
      className="relative flex-1 min-w-[130px] px-6 py-5 overflow-hidden backdrop-blur-lg"
      style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)' }}
    >
      {/* top accent */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px]" style={{ background: color }} />
      {/* corner bracket */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l" style={{ borderColor: color }} />

      <div className="leading-none mb-1" style={{ ...bebasNeue, fontSize: 'clamp(2rem,4vw,3rem)', color }}>
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-[8px] font-bold tracking-[.35em] uppercase text-[#F0EAD6]/35" style={syne}>
        {label}
      </div>

      {/* subtle bg glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse at 10% 50%, rgba(${rgb},.07) 0%, transparent 70%)`,
      }} />
    </div>
  )
}

// ── Tilt wrapper hook ─────────────────────────────────────────────
function useTilt(accentRgb, strength = 16) {
  const shellRef = useRef(null)
  const cardRef  = useRef(null)
  const rafRef   = useRef(null)
  const st = useRef({ cRX:0, cRY:0, tRX:0, tRY:0, on:false })

  const [hovered,   setHovered]   = useState(false)
  const [glowPos,   setGlowPos]   = useState({ x:50, y:50 })
  const [glowOn,    setGlowOn]    = useState(false)
  const [dynShadow, setDynShadow] = useState('')
  const [dynBorder, setDynBorder] = useState('rgba(255,255,255,.07)')

  const lerp = (a,b,t) => a+(b-a)*t

  const tick = useCallback(() => {
    const s = st.current
    s.cRX = lerp(s.cRX, s.tRX, .1)
    s.cRY = lerp(s.cRY, s.tRY, .1)
    if (cardRef.current)
      cardRef.current.style.transform = `rotateX(${s.cRX}deg) rotateY(${s.cRY}deg) translateZ(${s.on?10:0}px)`
    if (Math.abs(s.cRX-s.tRX)>.01 || Math.abs(s.cRY-s.tRY)>.01 || s.on)
      rafRef.current = requestAnimationFrame(tick)
  }, [])

  const onMove = useCallback((e) => {
    const r = shellRef.current?.getBoundingClientRect(); if (!r) return
    const x = (e.clientX-r.left)/r.width, y = (e.clientY-r.top)/r.height
    st.current.tRY = (x-.5)*strength; st.current.tRX = (.5-y)*(strength*.75)
    const ox=(x-.5)*56, oy=(y-.5)*44
    setGlowPos({ x:x*100, y:y*100 })
    setDynShadow(`${ox}px ${oy}px 40px rgba(${accentRgb},.28), 0 0 18px rgba(${accentRgb},.14)`)
    setDynBorder(`rgba(${accentRgb},.44)`)
  }, [accentRgb, strength])

  const onEnter = useCallback(() => {
    st.current.on = true
    if (cardRef.current) cardRef.current.style.transition = 'none'
    setHovered(true); setGlowOn(true)
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(tick)
  }, [tick])

  const onLeave = useCallback(() => {
    st.current.on = false; st.current.tRX=0; st.current.tRY=0
    if (cardRef.current) {
      cardRef.current.style.transition = 'transform .7s cubic-bezier(.23,1,.32,1)'
      cardRef.current.style.transform  = 'rotateX(0deg) rotateY(0deg) translateZ(0px)'
    }
    setHovered(false); setGlowOn(false); setDynShadow(''); setDynBorder('rgba(255,255,255,.07)')
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(tick)
  }, [tick])

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  return { shellRef, cardRef, hovered, glowPos, glowOn, dynShadow, dynBorder, onMove, onEnter, onLeave }
}

// ── Featured card (large) ─────────────────────────────────────────
function FeaturedCard({ ach, visible }) {
  const tm = typeMap[ach.type]
  const { shellRef, cardRef, hovered, glowPos, glowOn, dynShadow, dynBorder, onMove, onEnter, onLeave } = useTilt(tm.rgb, 12)

  return (
    <div ref={shellRef} style={{ perspective:'900px', height:'100%' }}
      onMouseMove={onMove} onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <div ref={cardRef} style={{ transformStyle:'preserve-3d', willChange:'transform', height:'100%',
        opacity: visible?1:0, transform: visible?'translateY(0)':'translateY(16px)',
        transition:'opacity .35s ease, transform .35s ease',
      }}>

        {/* Glow layer */}
        <div style={{ position:'absolute', inset:-1, pointerEvents:'none', zIndex:0,
          background:`radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(${tm.rgb},.5) 0%, rgba(${tm.rgb},.12) 30%, transparent 62%)`,
          opacity: glowOn?1:0, transition:'opacity .3s ease' }} />

        {/* Card surface */}
        <div className="relative z-[1] h-full overflow-hidden backdrop-blur-xl flex flex-col" style={{
          background: hovered ? 'rgba(255,255,255,.045)' : 'rgba(255,255,255,.03)',
          border:`1px solid ${dynBorder}`, boxShadow:dynShadow,
          transition:'background .3s ease',
        }}>
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{
            background:tm.color, transform:hovered?'scaleX(1)':'scaleX(0)',
            transformOrigin:'left', transition:'transform .45s cubic-bezier(.16,1,.3,1)',
          }} />
          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-5 h-5" style={{ borderTop:`1px solid ${tm.color}`, borderLeft:`1px solid ${tm.color}`, opacity:hovered?1:0, transition:'opacity .3s' }} />
          <div className="absolute bottom-0 right-0 w-5 h-5" style={{ borderBottom:`1px solid rgba(${tm.rgb},.35)`, borderRight:`1px solid rgba(${tm.rgb},.35)`, opacity:hovered?1:0, transition:'opacity .3s' }} />

          {/* Large background initial — decorative */}
          <div className="absolute -right-4 -bottom-6 leading-none select-none pointer-events-none" style={{
            ...bebasNeue, fontSize:'11rem', color:`rgba(${tm.rgb},.05)`, lineHeight:1,
          }}>{ach.initial}</div>

          {/* Content */}
          <div className="relative z-[2] p-7 flex flex-col h-full">

            {/* Type pill + date */}
            <div className="flex items-center justify-between mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 border text-[8px] font-bold tracking-[.32em] uppercase"
                style={{ ...syne, background:`rgba(${tm.rgb},.1)`, borderColor:`rgba(${tm.rgb},.28)`, color:tm.color }}>
                <span>{tm.icon}</span>{tm.label}
              </div>
              <span className="text-[8px] font-bold tracking-[.32em] uppercase text-[#F0EAD6]/30" style={syne}>{ach.date}</span>
            </div>

            {/* Student avatar + name */}
            <div className="flex items-center gap-4 mb-5">
              <div className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg relative"
                style={{ ...syne, background:`rgba(${tm.rgb},.12)`, border:`1px solid rgba(${tm.rgb},.3)`, color:tm.color,
                  boxShadow:`0 0 24px rgba(${tm.rgb},.25)` }}>
                {ach.initial}
                {/* Pulse ring */}
                <div className="absolute inset-0 rounded-full animate-ping opacity-[.15]"
                  style={{ background:`rgba(${tm.rgb},.4)`, animationDuration:'2.5s' }} />
              </div>
              <div>
                <div className="text-[15px] font-bold tracking-[.04em] text-[#F0EAD6]" style={syne}>{ach.student}</div>
                <div className="text-[10px] font-light text-[#F0EAD6]/40 mt-0.5" style={dmSans}>{ach.city} · {ach.robot}</div>
              </div>
              {/* Level badge */}
              <div className="ml-auto flex-shrink-0 px-2.5 py-1 border text-[8px] font-bold tracking-[.28em] uppercase"
                style={{ ...syne, borderColor:`${levelColor[ach.level]}44`, color:levelColor[ach.level], background:`rgba(${tm.rgb},.06)` }}>
                {ach.level}
              </div>
            </div>

            {/* Achievement title */}
            <h3 className="leading-[.92] tracking-[-0.01em] mb-2" style={{
              ...bebasNeue, fontSize:'clamp(1.6rem,3vw,2.4rem)',
              color: hovered ? tm.color : '#F0EAD6', transition:'color .3s ease',
            }}>{ach.title}</h3>
            <div className="text-[9px] font-bold tracking-[.3em] uppercase text-[#F0EAD6]/35 mb-5" style={syne}>
              {ach.subtitle}
            </div>

            {/* Divider */}
            <div className="h-px mb-5" style={{ background:`linear-gradient(90deg,${tm.color}44,transparent)` }} />

            {/* Quote */}
            <p className="text-[13px] font-light leading-[1.8] text-[#F0EAD6]/60 italic flex-1" style={dmSans}>
              "{ach.quote}"
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-5">
              {ach.tags.map(tag => (
                <span key={tag} className="px-2.5 py-1 text-[9px] font-bold tracking-[.22em] uppercase"
                  style={{ ...syne, background:`rgba(${tm.rgb},.08)`, border:`1px solid rgba(${tm.rgb},.2)`, color:`rgba(${tm.rgb===tm.rgb?tm.color:tm.color},0.8)` }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Small achievement card ────────────────────────────────────────
function SmallCard({ ach, isActive, onClick }) {
  const tm = typeMap[ach.type]
  const { shellRef, cardRef, hovered, glowPos, glowOn, dynShadow, dynBorder, onMove, onEnter, onLeave } = useTilt(tm.rgb, 14)
  const lit = hovered || isActive

  return (
    <div ref={shellRef} style={{ perspective:'900px', cursor:'pointer' }}
      onMouseMove={onMove} onMouseEnter={onEnter} onMouseLeave={onLeave} onClick={onClick}>
      <div ref={cardRef} style={{ transformStyle:'preserve-3d', willChange:'transform' }}>

        {/* Glow layer */}
        <div style={{ position:'absolute', inset:-1, pointerEvents:'none', zIndex:0,
          background:`radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(${tm.rgb},.5) 0%, rgba(${tm.rgb},.1) 28%, transparent 60%)`,
          opacity:glowOn||isActive?1:0, transition:'opacity .3s ease' }} />

        {/* Surface */}
        <div className="relative z-[1] overflow-hidden backdrop-blur-lg" style={{
          background: lit ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.025)',
          border:`1px solid ${isActive ? tm.color+'66' : dynBorder}`,
          boxShadow: isActive ? `0 0 32px rgba(${tm.rgb},.22), inset 0 0 20px rgba(${tm.rgb},.06)` : dynShadow,
          transition:'background .3s, border-color .3s, box-shadow .3s',
          padding:'18px 20px',
        }}>
          {/* Active top bar */}
          <div className="absolute top-0 left-0 right-0 h-[1.5px]" style={{
            background:tm.color, transform:lit?'scaleX(1)':'scaleX(0)',
            transformOrigin:'left', transition:'transform .4s cubic-bezier(.16,1,.3,1)',
          }} />
          {/* TL corner */}
          <div className="absolute top-0 left-0 w-4 h-4" style={{
            borderTop:`1px solid ${tm.color}`, borderLeft:`1px solid ${tm.color}`,
            opacity:lit?1:0, transition:'opacity .3s',
          }} />

          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm"
              style={{ background:`rgba(${tm.rgb},.12)`, boxShadow:`0 0 0 1px rgba(${tm.rgb},.25)` }}>
              {tm.icon}
            </div>
            <div className="min-w-0 flex-1">
              {/* Type */}
              <div className="text-[7px] font-bold tracking-[.32em] uppercase mb-1 transition-colors duration-300"
                style={{ ...syne, color: lit ? tm.color : 'rgba(240,234,214,.3)' }}>
                {tm.label}
              </div>
              {/* Title */}
              <div className="text-[13px] font-bold leading-[1.25] text-[#F0EAD6] mb-1 transition-colors duration-300"
                style={{ ...syne, color: lit ? tm.color : '#F0EAD6', fontSize:13 }}>
                {ach.student}
              </div>
              <div className="text-[11px] font-light leading-[1.5] text-[#F0EAD6]/45 line-clamp-2" style={dmSans}>
                {ach.title}
              </div>
            </div>
            {/* Date */}
            <div className="flex-shrink-0 text-[8px] font-bold tracking-[.22em] uppercase text-[#F0EAD6]/25 mt-0.5" style={syne}>
              {ach.date}
            </div>
          </div>

          {/* "Make featured" hint */}
          {!isActive && (
            <div className="mt-3 pt-2.5 border-t border-white/[.05] flex items-center justify-between">
              <span className="text-[7px] font-bold tracking-[.28em] uppercase text-[#F0EAD6]/20" style={syne}>
                Click to feature
              </span>
              <span className="text-[10px]" style={{ color:`rgba(${tm.rgb},.4)`, opacity: hovered?1:0, transition:'opacity .3s' }}>→</span>
            </div>
          )}
          {isActive && (
            <div className="mt-3 pt-2.5 border-t border-white/[.05] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background:tm.color }} />
              <span className="text-[7px] font-bold tracking-[.28em] uppercase" style={{ ...syne, color:tm.color }}>
                Currently Featured
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Rising star chip ──────────────────────────────────────────────
function StarChip({ s }) {
  const [hov, setHov] = useState(false)
  return (
    <div className="flex-shrink-0 flex items-center gap-3 px-4 py-3 cursor-default backdrop-blur-lg"
      style={{
        background: hov ? 'rgba(255,255,255,.05)' : 'rgba(255,255,255,.025)',
        border:`1px solid ${hov ? s.color+'44' : 'rgba(255,255,255,.07)'}`,
        boxShadow: hov ? `0 0 20px rgba(${s.color},.1)` : 'none',
        transition:'all .3s ease',
      }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {/* Avatar */}
      <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold"
        style={{ ...syne, border:`1px solid ${s.color}44`, color:s.color, background:`rgba(0,0,0,.3)`, boxShadow: hov?`0 0 14px ${s.color}44`:'' }}>
        {s.initial}
      </div>
      <div>
        <div className="text-[12px] font-bold text-[#F0EAD6]" style={syne}>{s.name}</div>
        <div className="text-[9px] text-[#F0EAD6]/35 font-light" style={dmSans}>{s.spec}</div>
      </div>
      <div className="ml-2 flex-shrink-0">
        <span className="w-1.5 h-1.5 rounded-full block" style={{ background:s.color }} />
      </div>
    </div>
  )
}

// ── Main section ──────────────────────────────────────────────────
export default function StudentAchievements() {
  const { getCards } = useOwnerAuth()
  const [featuredIdx, setFeaturedIdx] = useState(0)
  const [statsOn,     setStatsOn]     = useState(false)
  const [changing,    setChanging]    = useState(false)
  const [achievementData, setAchievementData] = useState(fallbackAchievements)
  const [loadingAchievements, setLoadingAchievements] = useState(true)
  const sectionRef = useRef(null)

  // Trigger counter when section enters viewport
  useEffect(() => {
    const el = sectionRef.current; if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsOn(true) },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    let active = true

    const loadAchievements = async () => {
      try {
        const cards = await getCards('achievement', 'achievements')
        const mapped = (cards || [])
          .filter((card) => card?.data)
          .map((card, index) => {
            const data = card.data || {}
            const initials = data.initial || (data.student ? data.student.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() : 'ST')
            return {
              id: card._id || index,
              initial: initials,
              student: data.student || data.name || 'Student',
              city: data.city || 'Bhopal',
              robot: data.robot || data.project || 'Project',
              type: data.type || 'competition',
              title: data.title || data.headline || 'Achievement',
              subtitle: data.subtitle || data.sub || 'Student achievement',
              quote: data.quote || 'A student success story.',
              tags: Array.isArray(data.tags) ? data.tags : (data.tag ? [data.tag] : []),
              level: data.level || 'Intermediate',
              date: data.date || 'Recently updated',
            }
          })

        if (active && mapped.length > 0) {
          setAchievementData(mapped)
          setFeaturedIdx(0)
        }
      } catch (error) {
        console.error('Error loading achievements preview:', error)
      } finally {
        if (active) setLoadingAchievements(false)
      }
    }

    loadAchievements()
    return () => { active = false }
  }, [getCards])

  const handleSwap = (idx) => {
    if (idx === featuredIdx) return
    setChanging(true)
    setTimeout(() => { setFeaturedIdx(idx); setChanging(false) }, 320)
  }

  const achievements = achievementData.length > 0 ? achievementData : fallbackAchievements
  const featured = achievements[featuredIdx] || achievements[0]
  const others   = achievements.filter((_, i) => i !== featuredIdx)
  const previewStats = [
    { end: Math.max(6200, achievements.length * 1200), suffix: '+', label: 'Students Trained', color: '#FF6B35', rgb: '255,107,53' },
    { end: Math.max(340, achievements.length * 80), suffix: '+', label: 'Robots Built', color: '#00F5FF', rgb: '0,245,255' },
    { end: Math.max(48, achievements.length * 10), suffix: '', label: 'Competition Wins', color: '#A855F7', rgb: '168,85,247' },
    { end: 100, suffix: '%', label: 'Certification Rate', color: '#FF006E', rgb: '255,0,110' },
  ]

  return (
    <section
      ref={sectionRef}
      id="home-achievements"
      className="relative overflow-hidden px-12 py-[80px] bg-[#050508]"
    >
      {/* ── Atmosphere ──────────────────────────────────────── */}
      <div className="absolute -top-[100px] -right-[60px] w-[500px] h-[400px] rounded-full pointer-events-none"
        style={{ background:'radial-gradient(ellipse,rgba(255,107,53,.09) 0%,transparent 70%)' }} />
      <div className="absolute -bottom-[80px] -left-[60px] w-[450px] h-[350px] rounded-full pointer-events-none"
        style={{ background:'radial-gradient(ellipse,rgba(168,85,247,.08) 0%,transparent 70%)' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
        style={{ background:'radial-gradient(ellipse,rgba(0,245,255,.03) 0%,transparent 70%)' }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage:'linear-gradient(rgba(255,107,53,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,107,53,.02) 1px,transparent 1px)',
        backgroundSize:'48px 48px',
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background:'repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(0,0,0,.05) 3px,rgba(0,0,0,.05) 4px)',
      }} />

      <div className="relative z-[2] max-w-[1100px] mx-auto">

        {/* ── Section header ──────────────────────────────── */}
        <div className="mb-12 max-w-2xl">
          {/* Label badge — mirrors cc-label from AnimatedTextCard */}
          <div className="inline-flex items-center gap-2 px-3.5 py-[7px] mb-6"
            style={{
              background: `rgba(${parseInt(C.orange.slice(1,3),16)},${parseInt(C.orange.slice(3,5),16)},${parseInt(C.orange.slice(5,7),16)},.07)`,
              border: `1px solid rgba(${parseInt(C.orange.slice(1,3),16)},${parseInt(C.orange.slice(3,5),16)},${parseInt(C.orange.slice(5,7),16)},.25)`,
            }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: C.orange }} />
            <span style={{
              ...barlowCond,
              fontWeight: 400,
              fontSize: "9px",
              letterSpacing: ".42em",
              textTransform: "uppercase",
              color: C.orange,
            }}>
              Hall of Makers
            </span>
          </div>

          {/* Title — ghost outline top line + gradient fill bottom */}
          <div className="mb-5">
            <span className="block leading-[.88]"
              style={{
                ...bebasNeue,
                fontSize: "clamp(42px,7vw,76px)",
                letterSpacing: ".025em",
                color: "transparent",
                WebkitTextStroke: "1px rgba(255,255,255,.32)",
              }}>
              STUDENT
            </span>
            <span className="block leading-[.88]"
              style={{
                ...bebasNeue,
                fontSize: "clamp(42px,7vw,76px)",
                letterSpacing: ".025em",
                background: `linear-gradient(90deg,${C.orange},${C.pink})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 28px rgba(255,98,48,.28))",
              }}>
              ACHIEVEMENTS
            </span>
          </div>

          {/* Gradient rule — identical to card-rule in AnimatedTextCard */}
          <div className="w-14 mb-6"
            style={{
              height: "1.5px",
              background: `linear-gradient(to right,${C.orange},${C.pink},transparent)`,
            }} />

          {/* Body copy — Barlow light, white/45 */}
          <p className="leading-[1.85] max-w-[420px] mb-5"
            style={{
              ...barlow,
              fontSize: "clamp(13px,1.3vw,15px)",
              color: "rgba(255,255,255,.45)",
              letterSpacing: ".02em",
            }}>
            Real students, real robots, real results. Every achievement here was built
            with curiosity, code, and a lot of late-night debugging.
          </p>
        </div>

        {/* ── Animated stat counters ──────────────────────── */}
        <div className="flex gap-4 flex-wrap mb-12">
          {previewStats.map(s => (
            <StatBox key={s.label} {...s} active={statsOn} />
          ))}
        </div>

        {/* ── Main grid: featured + small stack ───────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5 mb-5">

          {/* Featured card */}
          <div style={{ minHeight: 420 }}>
            {!loadingAchievements && featured ? (
              <FeaturedCard ach={featured} visible={!changing} />
            ) : (
              <div className="h-full flex items-center justify-center rounded border border-white/[.08] bg-white/[.02] text-[#F0EAD6]/40" style={{ minHeight: 420 }}>
                Loading achievements…
              </div>
            )}
          </div>

          {/* Small cards stack */}
          <div className="flex flex-col gap-4">
            {/* Label */}
            <div className="flex items-center gap-3">
              <span className="text-[8px] font-bold tracking-[.4em] uppercase text-[#F0EAD6]/28" style={syne}>
                More Achievements
              </span>
              <div className="flex-1 h-px bg-white/[.06]" />
            </div>

            {others.map(ach => (
              <SmallCard
                key={ach.id}
                ach={ach}
                isActive={ach.id === featuredIdx}
                onClick={() => handleSwap(ach.id)}
              />
            ))}

            {/* View all CTA */}
            <button className="mt-auto flex items-center justify-between px-5 py-3.5 border border-white/[.08] bg-white/[.02] hover:border-[#FF6B35]/40 hover:bg-[#FF6B35]/[.04] transition-all duration-300 group"
              style={{ cursor:'pointer' }}>
              <span className="text-[9px] font-bold tracking-[.32em] uppercase text-[#F0EAD6]/45 group-hover:text-[#FF6B35] transition-colors" style={syne}>
                View All Achievements
              </span>
              <span className="text-[#F0EAD6]/25 group-hover:text-[#FF6B35] transition-colors">→</span>
            </button>
          </div>
        </div>

        {/* ── Scrolling marquee ────────────────────────────── */}
        <div className="relative overflow-hidden border-y border-white/[.055] mb-10"
          style={{ background:'rgba(255,255,255,.015)' }}>
          <div className="flex" style={{ animation:'marqueeScroll 32s linear infinite', width:'max-content' }}>
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-8 py-3.5 border-r border-white/[.055] flex-shrink-0">
                <span className="text-base">{item.icon}</span>
                <span className="text-[11px] font-light text-[#F0EAD6]/55 whitespace-nowrap tracking-[.04em]" style={dmSans}>
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Rising stars ─────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-4 mb-5">
            <div className="inline-flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#A855F7] animate-pulse" />
              <span className="text-[8px] font-bold tracking-[.4em] uppercase text-[#F0EAD6]/35" style={syne}>
                Rising Stars
              </span>
            </div>
            <div className="flex-1 h-px bg-white/[.06]" />
            <span className="text-[8px] font-bold tracking-[.35em] uppercase text-[#F0EAD6]/20" style={syne}>
              Class of 2025
            </span>
          </div>

          <div className="flex gap-3 flex-wrap">
            {stars.map(s => <StarChip key={s.name} s={s} />)}
          </div>
        </div>
      </div>

      {/* ── Keyframes ─────────────────────────────────────── */}
      <style>{`
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}
