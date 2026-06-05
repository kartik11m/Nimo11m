import { useState, useRef, useEffect } from 'react'

const bebasNeue = { fontFamily: "'Bebas Neue', sans-serif" }
const syne      = { fontFamily: "'Syne', sans-serif" }
const dmSans    = { fontFamily: "'DM Sans', sans-serif" }

// ── DATA ──────────────────────────────────────────────────────────
const categories = [
  { key: 'training',  label: 'Training',    color: '#FF6B35', rgb: '255,107,53'  },
  { key: 'camp',      label: 'Summer Camp', color: '#00F5FF', rgb: '0,245,255'   },
  { key: 'labsetup',  label: 'Lab Setup',   color: '#A855F7', rgb: '168,85,247'  },
  { key: 'general',   label: 'General',     color: '#FF006E', rgb: '255,0,110'   },
]

const faqs = [
  // ── Training ──────────────────────────────────────────────────
  {
    cat: 'training',
    q: 'Do I need any prior experience to join a course?',
    a: 'None at all. Our Arduino Masterclass and Python for AI courses are designed for complete beginners. You don\'t need to know any electronics or programming — we start from the very first principle. Intermediate and advanced tracks like ESP32 and ROS2 do have prerequisites, which are clearly listed on each course page.',
  },
  {
    cat: 'training',
    q: 'What is included in the course fee?',
    a: 'Everything you need: access to lab equipment during sessions, all component kits for projects, printed curriculum workbooks, instructor support, and a Nimo Labs certification on successful completion. For some courses, a small materials deposit is collected separately for components you take home.',
  },
  {
    cat: 'training',
    q: 'How are courses structured — online or offline?',
    a: 'All courses are primarily in-person at Nimo Labs HQ in Bhopal, with sessions available in morning and evening batches. Some courses offer a hybrid option where theory is delivered online (recorded) and practical sessions are in-person. Full online delivery is not currently available for hands-on tracks.',
  },
  {
    cat: 'training',
    q: 'What certification do I receive on completion?',
    a: 'You receive a Nimo Labs course certificate that includes your name, the course completed, the number of hours, project outcomes, and an instructor signature. Certificates are verified online via a QR code and are recognised by colleges and tech firms across Madhya Pradesh.',
  },
  {
    cat: 'training',
    q: 'Can I switch batches or reschedule sessions?',
    a: 'Yes — up to two session reschedules per course are allowed without penalty. Batch switches are subject to seat availability. Contact our team at least 48 hours before the session you wish to reschedule.',
  },

  // ── Summer Camp ────────────────────────────────────────────────
  {
    cat: 'camp',
    q: 'What age group is the Summer Camp designed for?',
    a: 'Summer Camp is open to students aged 10 to 18. No prior experience is required — the curriculum is calibrated so beginners and curious first-timers can jump straight in and still build a working robot by the end of the week.',
  },
  {
    cat: 'camp',
    q: 'What will my child actually build during the 5-day camp?',
    a: 'Students design, assemble, wire, and program a complete autonomous robot over 5 days. The exact build varies by cohort, but past projects include line-following bots, obstacle-avoiders, and sensor-fused wheeled vehicles. Every student takes their robot home at the end.',
  },
  {
    cat: 'camp',
    q: 'What are the timings and is lunch provided?',
    a: 'Camp runs from 9:00 AM to 5:00 PM, Monday to Friday. A structured lunch break is included. Meals are not catered by the lab — students bring a packed lunch or can use nearby food options. We provide snacks and water throughout the day.',
  },
  {
    cat: 'camp',
    q: 'How many seats are available and how do I register?',
    a: 'Each Summer Camp cohort has 40 seats. Registration is first-come, first-served via the Book page on this site. A seat is confirmed only after the registration fee is paid. Waitlist spots are available if seats are full.',
  },

  // ── Lab Setup ─────────────────────────────────────────────────
  {
    cat: 'labsetup',
    q: 'Which types of labs does Nimo Labs set up?',
    a: 'We design and install eight lab types: Robotics Labs, AI & ML Labs, ATL Labs (AIM-compliant), Drone Labs, STEM Labs, Innovation Centers, School Technology Infrastructure, and we also run Teacher Training Programs. Each is tailored to your institution\'s space, budget, and curriculum needs.',
  },
  {
    cat: 'labsetup',
    q: 'Is the site assessment really free?',
    a: 'Yes — completely free, no commitment required. Our engineers visit your campus, evaluate your available space, power infrastructure, connectivity, and student capacity, then deliver a detailed proposal within 5 working days. You only pay when you approve and sign the project.',
  },
  {
    cat: 'labsetup',
    q: 'Do you handle ATL Lab documentation for government schools?',
    a: 'Yes. We have experience with the full AIM ATL documentation process — proposal submission, compliance reporting, equipment lists, and utilisation reports. We handle the paperwork alongside the physical setup so your team doesn\'t have to manage both simultaneously.',
  },
  {
    cat: 'labsetup',
    q: 'What does the Annual Maintenance Contract (AMC) cover?',
    a: 'Our AMC covers all equipment servicing, component replacements due to normal wear, remote technical support (response within 4 hours), quarterly on-site visits, curriculum update packages, and access to our student program support team. AMC duration starts at 1 year and can be extended.',
  },
  {
    cat: 'labsetup',
    q: 'Can we get a lab installed in phases if our budget is limited?',
    a: 'Absolutely. Many institutions choose a phased approach — Phase 1 might be a basic STEM lab, Phase 2 adds robotics workstations, and Phase 3 brings in an AI computing cluster. We design the initial layout with future phases in mind so upgrades are seamless.',
  },

  // ── General ───────────────────────────────────────────────────
  {
    cat: 'general',
    q: 'Where is Nimo Labs located?',
    a: 'Nimo Labs HQ is in Bhopal, Madhya Pradesh. The lab is open Monday to Saturday, 9:00 AM to 8:00 PM. The exact address is shared after registration or on request — reach us at hello@nimolabs.in or on WhatsApp.',
  },
  {
    cat: 'general',
    q: 'Do you offer group discounts for schools enrolling students?',
    a: 'Yes. Schools that enrol groups of 5 or more students in a single cohort receive a group discount. Institutions partnering for multiple cohorts across the academic year get further pricing benefits. Contact our team for a custom quote.',
  },
  {
    cat: 'general',
    q: 'Is there a refund policy if I have to drop out?',
    a: 'Refunds are available on a sliding scale: full refund if cancelled more than 7 days before the course starts, 50% refund between 3–7 days, no refund within 3 days of the start date. Summer Camp fees are fully refundable up to 14 days before camp begins. Detailed terms are provided at registration.',
  },
  {
    cat: 'general',
    q: 'Can Nimo Labs come to our school or college campus?',
    a: 'Yes — we conduct outreach workshops, demo days, and orientation sessions on campus. These are separate from our core Lab Setup division. Contact us with your school name, location, and preferred date and we\'ll schedule a visit.',
  },
]

// ── Animated accordion item ────────────────────────────────────────
function FAQItem({ item, isOpen, onToggle, color, rgb }) {
  const bodyRef    = useRef(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (!bodyRef.current) return
    setHeight(isOpen ? bodyRef.current.scrollHeight : 0)
  }, [isOpen])

  return (
    <div
      className="relative overflow-hidden"
      style={{
        background:  isOpen ? `rgba(${rgb},.04)` : 'rgba(255,255,255,.02)',
        border:      `1px solid ${isOpen ? `rgba(${rgb},.38)` : 'rgba(255,255,255,.06)'}`,
        transition:  'background .35s ease, border-color .35s ease',
      }}
    >
      {/* Active left glow bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] transition-all duration-400"
        style={{
          background:  color,
          opacity:     isOpen ? 1 : 0,
          boxShadow:   isOpen ? `0 0 12px rgba(${rgb},.7)` : 'none',
        }}
      />

      {/* Question row */}
      <button
        className="w-full flex items-center justify-between gap-6 px-6 py-5 text-left bg-transparent border-none cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Index number */}
          <span
            className="flex-shrink-0 leading-none transition-colors duration-300"
            style={{
              ...bebasNeue,
              fontSize: '1.1rem',
              color: isOpen ? color : 'rgba(240,234,214,.2)',
            }}
          >
            {/* shown via CSS counter via inline */}
          </span>

          <span
            className="text-[14px] font-bold leading-[1.4] transition-colors duration-300"
            style={{
              ...syne,
              color: isOpen ? '#F0EAD6' : 'rgba(240,234,214,.65)',
            }}
          >
            {item.q}
          </span>
        </div>

        {/* Toggle icon */}
        <div
          className="flex-shrink-0 w-7 h-7 flex items-center justify-center border transition-all duration-350"
          style={{
            borderColor: isOpen ? `rgba(${rgb},.5)` : 'rgba(255,255,255,.12)',
            background:  isOpen ? `rgba(${rgb},.1)` : 'transparent',
            transform:   isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
        >
          <span
            className="text-sm font-bold leading-none"
            style={{ color: isOpen ? color : 'rgba(240,234,214,.35)' }}
          >
            +
          </span>
        </div>
      </button>

      {/* Answer — animated height */}
      <div
        style={{
          height:   height,
          overflow: 'hidden',
          transition: 'height .4s cubic-bezier(.23,1,.32,1)',
        }}
      >
        <div ref={bodyRef}>
          <div
            className="px-6 pb-6 pt-0"
            style={{ borderTop: `1px solid rgba(${rgb},.1)` }}
          >
            <div className="w-8 h-px mb-4 mt-4"
              style={{ background: `linear-gradient(90deg,${color},transparent)` }} />
            <p
              className="font-light leading-[1.85] text-[#F0EAD6]/55"
              style={{ ...dmSans, fontSize: '13px' }}
            >
              {item.a}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── MAIN EXPORT ───────────────────────────────────────────────────
export default function FAQSection() {
  const [activeCategory, setActiveCategory] = useState('training')
  const [openIdx,        setOpenIdx]        = useState(0)

  const activeCat  = categories.find(c => c.key === activeCategory)
  const filtered   = faqs.filter(f => f.cat === activeCategory)

  const handleCategoryChange = (key) => {
    setActiveCategory(key)
    setOpenIdx(0)
  }

  return (
    <section className="relative overflow-hidden py-[84px] bg-[#050508] border-y border-white/[.055]">

      {/* ── Atmosphere ── */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full pointer-events-none transition-all duration-1000"
        style={{ background: `radial-gradient(ellipse,rgba(${activeCat.rgb},.07) 0%,transparent 70%)` }}
      />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(0,0,0,.055) 3px,rgba(0,0,0,.055) 4px)',
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(${activeCat.rgb},.02) 1px,transparent 1px),linear-gradient(90deg,rgba(${activeCat.rgb},.02) 1px,transparent 1px)`,
        backgroundSize: '48px 48px',
        transition: 'background-image 1s ease',
      }} />

      <div className="relative z-[2] max-w-[1100px] mx-auto px-12">

        {/* ── Header ── */}
        <div className="flex items-end justify-between gap-10 flex-wrap mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-[7px] bg-[#FF6B35]/[.07] border border-[#FF6B35]/[.22] mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse" />
              <span className="text-[9px] font-bold tracking-[.42em] uppercase text-[#FF6B35]" style={syne}>
                Got Questions?
              </span>
            </div>
            <div>
              <span className="block leading-[.9] tracking-[-0.01em]" style={{
                ...bebasNeue,
                fontSize: 'clamp(38px,6vw,68px)',
                WebkitTextStroke: '1px rgba(240,234,214,.35)',
                color: 'transparent',
              }}>FREQUENTLY</span>
              <span
                className="block leading-[.9] tracking-[-0.01em] transition-all duration-700"
                style={{
                  ...bebasNeue,
                  fontSize: 'clamp(38px,6vw,68px)',
                  color: activeCat.color,
                  textShadow: `0 0 40px rgba(${activeCat.rgb},.38)`,
                }}
              >ASKED</span>
            </div>
            <div className="w-14 h-px mt-5"
              style={{ background: `linear-gradient(90deg,${activeCat.color},transparent)`, transition: 'background .7s ease' }} />
          </div>

          {/* Contact nudge */}
          <div className="relative bg-white/[.025] border border-white/[.07] p-6 flex-shrink-0 max-w-[280px]">
            <div className="absolute top-0 left-0 w-5 h-5"
              style={{ borderTop: `1px solid ${activeCat.color}`, borderLeft: `1px solid ${activeCat.color}`, transition: 'border-color .7s ease' }} />
            <p className="text-[12px] font-light text-[#F0EAD6]/45 leading-[1.7] mb-4" style={dmSans}>
              Can't find your answer here? Our team responds within 4 hours.
            </p>
            <a
              href="mailto:hello@nimolabs.in"
              className="text-[9px] font-bold tracking-[.3em] uppercase no-underline border px-4 py-2 inline-block transition-all duration-200"
              style={{
                ...syne,
                color:       activeCat.color,
                borderColor: `rgba(${activeCat.rgb},.3)`,
                background:  `rgba(${activeCat.rgb},.06)`,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = `rgba(${activeCat.rgb},.14)`
                e.currentTarget.style.boxShadow  = `0 0 14px rgba(${activeCat.rgb},.22)`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = `rgba(${activeCat.rgb},.06)`
                e.currentTarget.style.boxShadow  = 'none'
              }}
            >
              Ask a Question →
            </a>
          </div>
        </div>

        {/* ── Layout: category sidebar + FAQ list ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8">

          {/* Category sidebar */}
          <div className="flex lg:flex-col gap-2 flex-wrap">
            <div className="text-[7px] font-bold tracking-[.42em] uppercase text-[#F0EAD6]/[.22] mb-1 w-full" style={syne}>
              Topic
            </div>
            {categories.map(cat => {
              const active = activeCategory === cat.key
              return (
                <button
                  key={cat.key}
                  onClick={() => handleCategoryChange(cat.key)}
                  className="relative text-left px-4 py-3 border cursor-pointer transition-all duration-300 overflow-hidden"
                  style={{
                    background:   active ? `rgba(${cat.rgb},.1)` : 'rgba(255,255,255,.02)',
                    borderColor:  active ? `rgba(${cat.rgb},.45)` : 'rgba(255,255,255,.07)',
                    boxShadow:    active ? `0 0 18px rgba(${cat.rgb},.18)` : 'none',
                  }}
                >
                  {/* Active left indicator */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-[2.5px] transition-all duration-300"
                    style={{ background: cat.color, opacity: active ? 1 : 0.2 }}
                  />

                  <span
                    className="text-[10px] font-bold tracking-[.25em] uppercase transition-colors duration-300"
                    style={{
                      ...syne,
                      color: active ? cat.color : 'rgba(240,234,214,.45)',
                    }}
                  >
                    {cat.label}
                  </span>

                  {active && (
                    <div className="text-[8px] font-light text-[#F0EAD6]/30 mt-0.5 tracking-[.04em]" style={dmSans}>
                      {faqs.filter(f => f.cat === cat.key).length} questions
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* FAQ accordion */}
          <div className="flex flex-col gap-2">
            {filtered.map((item, i) => (
              <FAQItem
                key={activeCategory + i}
                item={item}
                isOpen={openIdx === i}
                onToggle={() => setOpenIdx(openIdx === i ? null : i)}
                color={activeCat.color}
                rgb={activeCat.rgb}
              />
            ))}
          </div>

        </div>

        {/* ── Bottom strip ── */}
        <div className="mt-12">
          <div className="h-[1.5px]"
            style={{ background: `linear-gradient(90deg,${activeCat.color},rgba(168,85,247,.5),transparent)`, transition: 'background .7s ease' }} />
          <div className="pt-6 flex items-center justify-between gap-6 flex-wrap">
            <div className="flex gap-3 flex-wrap">
              {categories.map(cat => (
                <div key={cat.label} className="flex items-baseline gap-2">
                  <span className="leading-none" style={{ ...bebasNeue, fontSize: '1.2rem', color: cat.color }}>
                    {faqs.filter(f => f.cat === cat.key).length}
                  </span>
                  <span className="text-[7px] font-bold tracking-[.3em] uppercase text-[#F0EAD6]/25" style={syne}>
                    {cat.label}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[11px] font-light text-[#F0EAD6]/30 max-w-[340px] leading-[1.7]" style={dmSans}>
              Still have questions? Our team is online Mon–Sat, 9 AM–8 PM.
              Average response time: 2 hours.
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}
