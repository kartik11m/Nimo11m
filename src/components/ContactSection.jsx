import { useState, useEffect, useRef } from 'react'

const bebasNeue = { fontFamily: "'Bebas Neue', sans-serif" }
const syne      = { fontFamily: "'Syne', sans-serif" }
const dmSans    = { fontFamily: "'DM Sans', sans-serif" }

// ── Subject chips ──────────────────────────────────────────────────
const subjects = [
  { label: 'General Query',   icon: '💬', color: '#FF6B35', rgb: '255,107,53'  },
  { label: 'Book Workshop',   icon: '🔧', color: '#00F5FF', rgb: '0,245,255'   },
  { label: 'School / College',icon: '🏫', color: '#A855F7', rgb: '168,85,247'  },
  { label: 'Course Enquiry',  icon: '📚', color: '#FF006E', rgb: '255,0,110'   },
]

// ── Typewriter prompts cycling in message placeholder ─────────────
const messagePlaceholders = [
  'Tell us about your school and student group...',
  'Ask anything about our Summer Camp 2025...',
  'Want a custom robotics workshop? Describe it...',
  'Questions about a specific course? Go ahead...',
  'Need a quote for your institution? Ask here...',
]

function useTypedPlaceholder(strings, speed = 55, pause = 2200) {
  const [display, setDisplay] = useState('')
  const [idx,     setIdx]     = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting,setDeleting]= useState(false)
  const timerRef              = useRef(null)

  useEffect(() => {
    const current = strings[idx]
    const tick = () => {
      if (!deleting && charIdx < current.length) {
        setDisplay(current.slice(0, charIdx + 1))
        setCharIdx((c) => c + 1)
        timerRef.current = setTimeout(tick, speed)
      } else if (!deleting && charIdx === current.length) {
        timerRef.current = setTimeout(() => setDeleting(true), pause)
      } else if (deleting && charIdx > 0) {
        setDisplay(current.slice(0, charIdx - 1))
        setCharIdx((c) => c - 1)
        timerRef.current = setTimeout(tick, speed / 2.2)
      } else {
        setDeleting(false)
        setIdx((i) => (i + 1) % strings.length)
        timerRef.current = setTimeout(tick, 300)
      }
    }
    timerRef.current = setTimeout(tick, 120)
    return () => clearTimeout(timerRef.current)
  }, [charIdx, deleting, idx, strings, speed, pause])

  return display
}

// ── Animated input ─────────────────────────────────────────────────
function Field({ label, type = 'text', value, onChange, required, accentColor = '#FF6B35', accentRgb = '255,107,53', multiline = false }) {
  const [focused,  setFocused]  = useState(false)
  const [touched,  setTouched]  = useState(false)
  const valid = value.trim().length > (type === 'email' ? 5 : 1)
  const showValid = touched && valid

  const baseStyle = {
    width:        '100%',
    background:   focused ? 'rgba(255,255,255,.04)' : 'rgba(255,255,255,.025)',
    border:       `1px solid ${focused ? accentColor : showValid ? 'rgba(0,245,255,.35)' : 'rgba(255,255,255,.09)'}`,
    boxShadow:    focused ? `0 0 0 2px rgba(${accentRgb},.12)` : 'none',
    padding:      multiline ? '14px 16px' : '12px 16px',
    color:        '#F0EAD6',
    outline:      'none',
    transition:   'border-color .25s ease, background .25s ease, box-shadow .25s ease',
    resize:       'none',
    ...dmSans,
    fontSize:     13,
  }

  return (
    <div className="relative">
      {/* Label */}
      <div className="flex items-center justify-between mb-1.5">
        <label
          className="text-[8px] font-bold tracking-[.38em] uppercase transition-colors duration-200"
          style={{
            ...syne,
            color: focused
              ? accentColor
              : 'rgba(240,234,214,.28)',
          }}
        >
          {label}{required && <span style={{ color: accentColor }}> *</span>}
        </label>
        {/* Validation dot */}
        <div
          className="w-1.5 h-1.5 rounded-full transition-all duration-300"
          style={{
            background:  showValid  ? '#00F5FF' : focused ? accentColor : 'rgba(255,255,255,.12)',
            boxShadow:   showValid  ? '0 0 8px rgba(0,245,255,.6)' : focused ? `0 0 8px rgba(${accentRgb},.5)` : 'none',
          }}
        />
      </div>

      {multiline ? (
        <textarea
          rows={5}
          value={value}
          onChange={onChange}
          style={baseStyle}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); setTouched(true) }}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          style={baseStyle}
          onFocus={() => setFocused(true)}
          onBlur={() => { setFocused(false); setTouched(true) }}
        />
      )}
    </div>
  )
}

// ── Contact info card ──────────────────────────────────────────────
function InfoCard({ icon, label, value, color, rgb, link }) {
  const [hov, setHov] = useState(false)
  const Tag = link ? 'a' : 'div'
  return (
    <Tag
      href={link}
      className="relative flex items-center gap-4 px-5 py-4 no-underline transition-all duration-300 group"
      style={{
        background:   hov ? `rgba(${rgb},.06)` : 'rgba(255,255,255,.02)',
        border:       `1px solid ${hov ? `rgba(${rgb},.38)` : 'rgba(255,255,255,.06)'}`,
        transform:    hov ? 'translateX(4px)' : 'none',
        cursor:       link ? 'pointer' : 'default',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Left color bar */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] transition-all duration-300"
        style={{ background: color, opacity: hov ? 1 : 0.35, boxShadow: hov ? `0 0 8px rgba(${rgb},.5)` : 'none' }} />
      {/* Icon */}
      <div className="w-9 h-9 flex items-center justify-center text-base flex-shrink-0"
        style={{ background: `rgba(${rgb},.1)`, border: `1px solid rgba(${rgb},.2)` }}>
        {icon}
      </div>
      <div>
        <div className="text-[7px] font-bold tracking-[.38em] uppercase mb-0.5" style={{ ...syne, color }}>{label}</div>
        <div className="text-[12px] font-medium text-[#F0EAD6]/70" style={dmSans}>{value}</div>
      </div>
    </Tag>
  )
}

// ── Lab status indicator ───────────────────────────────────────────
function LabStatus() {
  // simple day/time check – in a real app, this would come from an API
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const d = new Date()
    const h = d.getHours(), day = d.getDay()
    setOpen(day >= 1 && day <= 6 && h >= 9 && h < 20)
  }, [])

  return (
    <div className="flex items-center gap-2.5 px-4 py-2.5"
      style={{ background: open ? 'rgba(0,245,255,.05)' : 'rgba(255,107,53,.05)', border: `1px solid ${open ? 'rgba(0,245,255,.22)' : 'rgba(255,107,53,.22)'}` }}>
      <span
        className="w-2 h-2 rounded-full flex-shrink-0"
        style={{
          background: open ? '#00F5FF' : '#FF6B35',
          boxShadow:  open ? '0 0 8px rgba(0,245,255,.7)' : '0 0 8px rgba(255,107,53,.7)',
          animation:  'pulse 2s ease-in-out infinite',
        }}
      />
      <span className="text-[8px] font-bold tracking-[.35em] uppercase"
        style={{ ...syne, color: open ? '#00F5FF' : '#FF6B35' }}>
        Lab is {open ? 'Open · Visit us today' : 'Closed · Opens 9 AM Mon–Sat'}
      </span>
    </div>
  )
}

// ── Submit button states ───────────────────────────────────────────
function SubmitButton({ state, color, rgb, onClick }) {
  // state: 'idle' | 'sending' | 'done'
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={state === 'sending' || state === 'done'}
      className="relative w-full overflow-hidden text-[10px] font-bold tracking-[.32em] uppercase text-white border-none cursor-pointer transition-all duration-300"
      style={{
        ...syne,
        padding:    '15px 24px',
        background: state === 'done' ? 'rgba(0,245,255,.15)' : color,
        border:     state === 'done' ? '1px solid rgba(0,245,255,.4)' : 'none',
        boxShadow:  state === 'idle' ? `0 0 24px rgba(${rgb},.28)` : 'none',
      }}
    >
      {/* Progress bar fill (sending state) */}
      {state === 'sending' && (
        <div
          className="absolute inset-0"
          style={{
            background: `rgba(${rgb},.35)`,
            animation: 'ctaSend 1.6s ease-in-out forwards',
            transformOrigin: 'left',
          }}
        />
      )}

      <span className="relative z-[1]" style={{ color: state === 'done' ? '#00F5FF' : 'white' }}>
        {state === 'idle'    && 'Send Message →'}
        {state === 'sending' && 'Transmitting...'}
        {state === 'done'    && '✓ Message Received'}
      </span>
    </button>
  )
}

// ── MAIN EXPORT ───────────────────────────────────────────────────
export default function ContactSection() {
  const [name,        setName]        = useState('')
  const [email,       setEmail]       = useState('')
  const [message,     setMessage]     = useState('')
  const [subject,     setSubject]     = useState(null)   // index of subjects[]
  const [submitState, setSubmitState] = useState('idle') // idle | sending | done

  const typedPlaceholder = useTypedPlaceholder(messagePlaceholders)
  const activeSubject    = subject !== null ? subjects[subject] : subjects[0]

  const handleSubmit = () => {
    if (!name || !email || !message) return
    setSubmitState('sending')
    setTimeout(() => setSubmitState('done'), 1800)
  }

  const canSubmit = name.trim() && email.trim() && message.trim()

  return (
    <section className="relative overflow-hidden py-[84px] bg-[#050508] border-y border-white/[.055]">

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes ctaSend {
          from { transform:scaleX(0) }
          to   { transform:scaleX(1) }
        }
        @keyframes successPop {
          0%   { opacity:0; transform:translateY(14px) scale(.97) }
          100% { opacity:1; transform:translateY(0)    scale(1)   }
        }
      `}</style>

      {/* ── Atmosphere ── */}
      <div className="absolute -top-[100px] -left-[60px] w-[520px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse,rgba(255,107,53,.11) 0%,transparent 70%)' }} />
      <div className="absolute -bottom-[80px] -right-[40px] w-[480px] h-[380px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse,rgba(168,85,247,.1) 0%,transparent 70%)' }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(0,0,0,.055) 3px,rgba(0,0,0,.055) 4px)',
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,107,53,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,107,53,.02) 1px,transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      <div className="relative z-[2] max-w-[1100px] mx-auto px-12">

        {/* ── Header ── */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-[7px] bg-[#FF6B35]/[.07] border border-[#FF6B35]/[.22] mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse" />
            <span className="text-[9px] font-bold tracking-[.42em] uppercase text-[#FF6B35]" style={syne}>
              Get In Touch
            </span>
          </div>
          <div>
            <span className="block leading-[.9] tracking-[-0.01em]" style={{
              ...bebasNeue,
              fontSize: 'clamp(42px,7vw,80px)',
              WebkitTextStroke: '1px rgba(240,234,214,.35)',
              color: 'transparent',
            }}>LET'S</span>
            <span className="block leading-[.9] tracking-[-0.01em] text-[#FF6B35]" style={{
              ...bebasNeue,
              fontSize: 'clamp(42px,7vw,80px)',
              textShadow: '0 0 50px rgba(255,107,53,.38)',
            }}>TALK</span>
          </div>
          <div className="w-14 h-px mt-5"
            style={{ background: 'linear-gradient(90deg,#FF6B35,transparent)' }} />
        </div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10">

          {/* ── LEFT — info panel ── */}
          <div className="flex flex-col gap-5">
            <p className="font-light leading-[1.9] text-[#F0EAD6]/50 text-[14px] mb-2" style={dmSans}>
              Whether you're a student, a school, or a corporate team — we're here.
              Average response time is under 4 hours on weekdays.
            </p>

            {/* Lab status */}
            <LabStatus />

            {/* Contact info cards */}
            <div className="flex flex-col gap-2.5">
              <InfoCard icon="📍" label="Visit Us"    color="#FF6B35" rgb="255,107,53" value="Nimo Labs HQ, Bhopal, MP 462001" />
              <InfoCard icon="✉️" label="Email"       color="#00F5FF" rgb="0,245,255"  value="hello@nimolabs.in" link="mailto:hello@nimolabs.in" />
              <InfoCard icon="📱" label="WhatsApp"    color="#A855F7" rgb="168,85,247" value="+91 98765 43210" link="https://wa.me/919876543210" />
              <InfoCard icon="🕐" label="Lab Hours"   color="#FF006E" rgb="255,0,110"  value="Mon–Sat · 9 AM – 8 PM" />
            </div>

            {/* Social links */}
            <div className="pt-2">
              <div className="text-[8px] font-bold tracking-[.38em] uppercase text-[#F0EAD6]/[.25] mb-3" style={syne}>
                Find Us Online
              </div>
              <div className="flex gap-2 flex-wrap">
                {[
                  { label: 'Instagram', color: '#FF6B35', rgb: '255,107,53', href: '#' },
                  { label: 'YouTube',   color: '#FF006E', rgb: '255,0,110',  href: '#' },
                  { label: 'LinkedIn',  color: '#00F5FF', rgb: '0,245,255',  href: '#' },
                  { label: 'GitHub',    color: '#A855F7', rgb: '168,85,247', href: '#' },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[8px] font-bold tracking-[.3em] uppercase no-underline px-3.5 py-2 border transition-all duration-200 hover:-translate-y-px"
                    style={{
                      ...syne,
                      color:       s.color,
                      borderColor: `rgba(${s.rgb},.25)`,
                      background:  `rgba(${s.rgb},.06)`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background  = `rgba(${s.rgb},.14)`
                      e.currentTarget.style.boxShadow   = `0 0 14px rgba(${s.rgb},.22)`
                      e.currentTarget.style.borderColor = `rgba(${s.rgb},.5)`
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background  = `rgba(${s.rgb},.06)`
                      e.currentTarget.style.boxShadow   = 'none'
                      e.currentTarget.style.borderColor = `rgba(${s.rgb},.25)`
                    }}
                  >{s.label}</a>
                ))}
              </div>
            </div>

            {/* Response time badge */}
            <div className="flex items-center gap-3 mt-auto pt-4">
              <div className="flex gap-1">
                {[1,2,3,4,5].map((b) => (
                  <div key={b} className="w-1 rounded-full"
                    style={{
                      height: `${8 + b * 4}px`,
                      background: '#FF6B35',
                      opacity: b <= 3 ? 1 : 0.2,
                    }} />
                ))}
              </div>
              <div>
                <div className="text-[8px] font-bold tracking-[.35em] uppercase text-[#FF6B35]" style={syne}>
                  Avg Response · 2–4 hrs
                </div>
                <div className="text-[10px] font-light text-[#F0EAD6]/25" style={dmSans}>
                  Mon–Sat during lab hours
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT — form ── */}
          <div className="relative">

            {submitState === 'done' ? (
              /* ── Success state ── */
              <div
                className="relative flex flex-col items-center justify-center text-center px-10 py-16 h-full border border-white/[.07]"
                style={{
                  background: 'rgba(255,255,255,.025)',
                  animation: 'successPop .5s cubic-bezier(.16,1,.3,1)',
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ background: 'linear-gradient(90deg,#00F5FF,rgba(0,245,255,.2),transparent)' }} />
                <div className="absolute top-0 left-0 w-7 h-7"
                  style={{ borderTop: '1px solid #00F5FF', borderLeft: '1px solid #00F5FF' }} />
                <div className="absolute bottom-0 right-0 w-7 h-7"
                  style={{ borderBottom: '1px solid rgba(168,85,247,.5)', borderRight: '1px solid rgba(168,85,247,.5)' }} />

                <div className="w-16 h-16 flex items-center justify-center text-3xl mb-6"
                  style={{ background: 'rgba(0,245,255,.08)', border: '1px solid rgba(0,245,255,.3)', boxShadow: '0 0 30px rgba(0,245,255,.15)' }}>
                  ✓
                </div>
                <div className="leading-none mb-3" style={{ ...bebasNeue, fontSize: '2.2rem', color: '#00F5FF' }}>
                  MESSAGE SENT
                </div>
                <div className="w-10 h-px mb-4 mx-auto"
                  style={{ background: 'linear-gradient(90deg,transparent,#00F5FF,transparent)' }} />
                <p className="text-[13px] font-light text-[#F0EAD6]/50 max-w-[320px] leading-[1.8] mb-6" style={dmSans}>
                  We've received your message and will get back to you within 2–4 hours on weekdays.
                </p>
                <button
                  onClick={() => { setSubmitState('idle'); setName(''); setEmail(''); setMessage(''); setSubject(null) }}
                  className="text-[9px] font-bold tracking-[.3em] uppercase border px-6 py-2.5 transition-all duration-200 hover:border-[#FF6B35] hover:text-[#FF6B35]"
                  style={{ ...syne, borderColor: 'rgba(255,255,255,.12)', color: 'rgba(240,234,214,.45)', background: 'transparent' }}
                >
                  Send Another →
                </button>
              </div>
            ) : (
              /* ── Form ── */
              <div
                className="relative p-8 lg:p-10"
                style={{ background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.07)' }}
              >
                {/* Card corner TL */}
                <div className="absolute top-0 left-0 w-7 h-7"
                  style={{ borderTop: '1px solid #FF6B35', borderLeft: '1px solid #FF6B35' }} />
                {/* Card corner BR */}
                <div className="absolute bottom-0 right-0 w-7 h-7"
                  style={{ borderBottom: '1px solid rgba(168,85,247,.45)', borderRight: '1px solid rgba(168,85,247,.45)' }} />
                {/* Top gradient bar */}
                <div className="absolute top-0 left-0 right-0 h-[1.5px]"
                  style={{ background: 'linear-gradient(90deg,#FF6B35,rgba(168,85,247,.4),transparent)' }} />

                <div className="flex flex-col gap-5">

                  {/* Subject chips */}
                  <div>
                    <div className="text-[8px] font-bold tracking-[.38em] uppercase text-[#F0EAD6]/[.28] mb-2.5" style={syne}>
                      What's this about? <span style={{ color: '#FF6B35' }}>*</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {subjects.map((s, i) => {
                        const active = subject === i
                        return (
                          <button
                            key={s.label}
                            type="button"
                            onClick={() => setSubject(active ? null : i)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 border text-[8px] font-bold tracking-[.28em] uppercase transition-all duration-200 cursor-pointer"
                            style={{
                              ...syne,
                              background:   active ? `rgba(${s.rgb},.14)` : 'rgba(255,255,255,.03)',
                              borderColor:  active ? `rgba(${s.rgb},.55)` : 'rgba(255,255,255,.09)',
                              color:        active ? s.color : 'rgba(240,234,214,.4)',
                              boxShadow:    active ? `0 0 16px rgba(${s.rgb},.2)` : 'none',
                              transform:    active ? 'translateY(-2px)' : 'none',
                            }}
                          >
                            <span>{s.icon}</span>
                            {s.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Name + Email row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field
                      label="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      accentColor={activeSubject.color}
                      accentRgb={activeSubject.rgb}
                    />
                    <Field
                      label="Email Address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      accentColor={activeSubject.color}
                      accentRgb={activeSubject.rgb}
                    />
                  </div>

                  {/* Message */}
                  <div className="relative">
                    <Field
                      label="Message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      multiline
                      accentColor={activeSubject.color}
                      accentRgb={activeSubject.rgb}
                    />
                    {/* Typewriter placeholder overlay — shown when field is empty */}
                    {!message && (
                      <div
                        className="absolute pointer-events-none"
                        style={{
                          ...dmSans,
                          fontSize: 13,
                          color: 'rgba(240,234,214,.18)',
                          top: 38,
                          left: 17,
                        }}
                      >
                        {typedPlaceholder}
                        <span style={{ animation: 'pulse 1s step-end infinite', color: activeSubject.color, opacity: 0.6 }}>|</span>
                      </div>
                    )}
                  </div>

                  {/* Character counter */}
                  <div className="flex items-center justify-between -mt-3">
                    <span className="text-[9px] font-light text-[#F0EAD6]/20" style={dmSans}>
                      {message.length} characters
                    </span>
                    {!canSubmit && (
                      <span className="text-[8px] font-light text-[#F0EAD6]/20" style={dmSans}>
                        All fields required
                      </span>
                    )}
                  </div>

                  {/* Submit */}
                  <div style={{ opacity: canSubmit || submitState !== 'idle' ? 1 : 0.4, transition: 'opacity .3s ease' }}>
                    <SubmitButton
                      state={submitState}
                      color={activeSubject.color}
                      rgb={activeSubject.rgb}
                      onClick={canSubmit ? handleSubmit : undefined}
                    />
                  </div>

                  {/* Privacy note */}
                  <p className="text-[10px] font-light text-[#F0EAD6]/20 text-center leading-[1.6]" style={dmSans}>
                    Your details are never shared with third parties.
                    We'll only use them to respond to your message.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}
