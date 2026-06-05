import { useState } from 'react'
import { Link } from 'react-router-dom'

const bebasNeue = { fontFamily: "'Bebas Neue', sans-serif" }
const syne      = { fontFamily: "'Syne', sans-serif" }
const dmSans    = { fontFamily: "'DM Sans', sans-serif" }

const labOptions = [
  { id: 'robotics',   label: 'Robotics Lab',         icon: '🤖', color: '#FF6B35', rgb: '255,107,53' },
  { id: 'ai',         label: 'AI & ML Lab',           icon: '🧠', color: '#00F5FF', rgb: '0,245,255'  },
  { id: 'atl',        label: 'ATL Lab',               icon: '🔬', color: '#A855F7', rgb: '168,85,247' },
  { id: 'drone',      label: 'Drone Lab',             icon: '🚁', color: '#FF006E', rgb: '255,0,110'  },
  { id: 'stem',       label: 'STEM Lab',              icon: '⚗️', color: '#FF6B35', rgb: '255,107,53' },
  { id: 'innovation', label: 'Innovation Center',     icon: '💡', color: '#00F5FF', rgb: '0,245,255'  },
  { id: 'infra',      label: 'School Tech Infra',     icon: '🏫', color: '#A855F7', rgb: '168,85,247' },
  { id: 'training',   label: 'Teacher Training',      icon: '👨‍🏫', color: '#FF006E', rgb: '255,0,110'  },
]

const institutionTypes = ['School', 'Junior College', 'Degree College', 'University', 'Government Body', 'Private Organization', 'Education Group', 'Other']
const budgetRanges     = ['< ₹8 Lakhs', '₹8–15 Lakhs', '₹15–35 Lakhs', '₹35–75 Lakhs', '₹75 Lakhs+', 'Need Guidance']
const timelines        = ['ASAP (1–2 months)', '3–6 months', '6–12 months', 'Next academic year', 'Just exploring']

// ── Styled select ──────────────────────────────────────────────────
function StyledSelect({ label, value, onChange, options, required }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-[8px] font-bold tracking-[.38em] uppercase transition-colors duration-200"
          style={{ ...syne, color: focused ? '#FF6B35' : 'rgba(240,234,214,.28)' }}>
          {label}{required && <span style={{ color: '#FF6B35' }}> *</span>}
        </label>
        <div className="w-1.5 h-1.5 rounded-full transition-all duration-300"
          style={{ background: focused ? '#FF6B35' : 'rgba(255,255,255,.12)', boxShadow: focused ? '0 0 8px rgba(255,107,53,.5)' : 'none' }} />
      </div>
      <select
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', background: focused ? 'rgba(255,255,255,.04)' : 'rgba(255,255,255,.025)',
          border: `1px solid ${focused ? '#FF6B35' : 'rgba(255,255,255,.09)'}`,
          boxShadow: focused ? '0 0 0 2px rgba(255,107,53,.12)' : 'none',
          padding: '12px 16px', color: value ? '#F0EAD6' : 'rgba(240,234,214,.3)',
          outline: 'none', cursor: 'pointer',
          transition: 'border-color .25s ease, box-shadow .25s ease, background .25s ease',
          ...dmSans, fontSize: 13,
        }}
      >
        <option value="" disabled style={{ background: '#0d0d10' }}>Select…</option>
        {options.map(opt => (
          <option key={opt} value={opt} style={{ background: '#0d0d10', color: '#F0EAD6' }}>{opt}</option>
        ))}
      </select>
    </div>
  )
}

// ── Styled input ───────────────────────────────────────────────────
function StyledInput({ label, type = 'text', value, onChange, placeholder, required }) {
  const [focused, setFocused] = useState(false)
  const valid = value.trim().length > 1
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-[8px] font-bold tracking-[.38em] uppercase transition-colors duration-200"
          style={{ ...syne, color: focused ? '#FF6B35' : 'rgba(240,234,214,.28)' }}>
          {label}{required && <span style={{ color: '#FF6B35' }}> *</span>}
        </label>
        <div className="w-1.5 h-1.5 rounded-full transition-all duration-300"
          style={{
            background: valid ? '#00F5FF' : focused ? '#FF6B35' : 'rgba(255,255,255,.12)',
            boxShadow:  valid ? '0 0 8px rgba(0,245,255,.5)' : focused ? '0 0 8px rgba(255,107,53,.5)' : 'none',
          }} />
      </div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%', background: focused ? 'rgba(255,255,255,.04)' : 'rgba(255,255,255,.025)',
          border: `1px solid ${focused ? '#FF6B35' : 'rgba(255,255,255,.09)'}`,
          boxShadow: focused ? '0 0 0 2px rgba(255,107,53,.12)' : 'none',
          padding: '12px 16px', color: '#F0EAD6', outline: 'none',
          transition: 'border-color .25s ease, box-shadow .25s ease, background .25s ease',
          ...dmSans, fontSize: 13,
        }}
      />
    </div>
  )
}

// ── Lab type chip ──────────────────────────────────────────────────
function LabChip({ lab, selected, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex items-center gap-2 px-3.5 py-2 border cursor-pointer transition-all duration-250"
      style={{
        background:   selected ? `rgba(${lab.rgb},.14)` : 'rgba(255,255,255,.03)',
        borderColor:  selected ? `rgba(${lab.rgb},.55)` : 'rgba(255,255,255,.09)',
        color:        selected ? lab.color : 'rgba(240,234,214,.4)',
        boxShadow:    selected ? `0 0 16px rgba(${lab.rgb},.2)` : 'none',
        transform:    selected ? 'translateY(-2px)' : 'none',
        ...syne, fontSize: 9, fontWeight: 700, letterSpacing: '.28em', textTransform: 'uppercase',
      }}
    >
      <span>{lab.icon}</span>
      {lab.label}
      {selected && <span style={{ color: lab.color, marginLeft: 2 }}>✓</span>}
    </button>
  )
}

// ── MAIN PAGE ─────────────────────────────────────────────────────
export default function LabSetupEnquirePage() {
  // Form state
  const [institutionName, setInstitutionName] = useState('')
  const [institutionType, setInstitutionType] = useState('')
  const [city,            setCity]            = useState('')
  const [contactName,     setContactName]     = useState('')
  const [contactEmail,    setContactEmail]    = useState('')
  const [contactPhone,    setContactPhone]    = useState('')
  const [designation,     setDesignation]     = useState('')
  const [selectedLabs,    setSelectedLabs]    = useState([])
  const [students,        setStudents]        = useState('')
  const [area,            setArea]            = useState('')
  const [budget,          setBudget]          = useState('')
  const [timeline,        setTimeline]        = useState('')
  const [notes,           setNotes]           = useState('')
  const [submitState,     setSubmitState]     = useState('idle') // idle | sending | done

  const toggleLab = (id) =>
    setSelectedLabs(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id])

  const canSubmit = institutionName && institutionType && city && contactName &&
                    contactEmail && contactPhone && selectedLabs.length > 0 && budget && timeline

  const handleSubmit = () => {
    if (!canSubmit) return
    setSubmitState('sending')
    setTimeout(() => setSubmitState('done'), 2000)
  }

  return (
    <main className="bg-[#050508] text-[#F0EAD6] overflow-x-hidden" style={dmSans}>

      {/* ══ HERO ════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-12 pt-[140px] pb-16 border-b border-white/[.055]">
        <div className="absolute -top-[100px] -left-[60px] w-[520px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse,rgba(255,107,53,.12) 0%,transparent 70%)' }} />
        <div className="absolute -bottom-[80px] -right-[40px] w-[460px] h-[360px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse,rgba(168,85,247,.1) 0%,transparent 70%)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,107,53,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,107,53,.022) 1px,transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(0,0,0,.055) 3px,rgba(0,0,0,.055) 4px)',
        }} />

        <div className="relative z-[2] max-w-[1100px] mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8">
            <Link to="/lab-setup" className="text-[8px] font-bold tracking-[.35em] uppercase text-[#FF6B35]/60 no-underline hover:text-[#FF6B35] transition-colors" style={syne}>
              Lab Setup Division
            </Link>
            <span className="text-[#F0EAD6]/20">›</span>
            <span className="text-[8px] font-bold tracking-[.35em] uppercase text-[#F0EAD6]/40" style={syne}>
              Enquiry Form
            </span>
          </div>

          <div className="flex items-end justify-between gap-10 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-[7px] bg-[#FF6B35]/[.07] border border-[#FF6B35]/[.22] mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse" />
                <span className="text-[9px] font-bold tracking-[.42em] uppercase text-[#FF6B35]" style={syne}>
                  Free Site Assessment Included
                </span>
              </div>
              <span className="block leading-[.88]" style={{
                ...bebasNeue, fontSize: 'clamp(44px,8vw,88px)',
                WebkitTextStroke: '1px rgba(240,234,214,.35)', color: 'transparent',
              }}>REQUEST</span>
              <span className="block leading-[.88] text-[#FF6B35]" style={{
                ...bebasNeue, fontSize: 'clamp(44px,8vw,88px)',
                textShadow: '0 0 50px rgba(255,107,53,.38)',
              }}>A PROPOSAL</span>
              <span className="block mt-2 font-bold tracking-[.18em] uppercase text-[#00F5FF]"
                style={{ ...syne, fontSize: 'clamp(11px,1.4vw,15px)' }}>
                Lab Setup Division · Nimo Labs
              </span>
              <div className="w-14 h-px mt-5" style={{ background: 'linear-gradient(90deg,#FF6B35,transparent)' }} />
            </div>

            {/* Promise card */}
            <div className="relative bg-white/[.03] border border-white/[.07] p-6 flex-shrink-0 min-w-[260px]">
              <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-[#FF6B35]" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-purple-500/50" />
              <div className="absolute top-0 left-0 right-0 h-[1.5px]"
                style={{ background: 'linear-gradient(90deg,#FF6B35,rgba(168,85,247,.4),transparent)' }} />
              <div className="space-y-4">
                {[
                  { icon: '⚡', text: 'Response within 4 business hours', color: '#FF6B35' },
                  { icon: '📐', text: 'Free site assessment visit', color: '#00F5FF' },
                  { icon: '📋', text: 'Detailed proposal in 5 working days', color: '#A855F7' },
                  { icon: '🔒', text: 'No commitment required', color: '#FF006E' },
                ].map(p => (
                  <div key={p.text} className="flex items-center gap-3">
                    <div className="w-7 h-7 flex items-center justify-center text-sm flex-shrink-0"
                      style={{ background: `rgba(255,107,53,.08)`, border: `1px solid rgba(255,107,53,.2)` }}>
                      {p.icon}
                    </div>
                    <span className="text-[11px] font-light text-[#F0EAD6]/55" style={dmSans}>{p.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FORM ════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-12 py-16">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,107,53,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,107,53,.018) 1px,transparent 1px)',
          backgroundSize: '48px 48px',
        }} />

        <div className="relative z-[2] max-w-[1100px] mx-auto">

          {submitState === 'done' ? (
            /* ── Success ── */
            <div className="max-w-[560px] mx-auto text-center py-16">
              <div className="relative bg-white/[.03] border border-white/[.07] p-12">
                <div className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ background: 'linear-gradient(90deg,#00F5FF,rgba(0,245,255,.2),transparent)' }} />
                <div className="absolute top-0 left-0 w-7 h-7"
                  style={{ borderTop: '1px solid #00F5FF', borderLeft: '1px solid #00F5FF' }} />
                <div className="absolute bottom-0 right-0 w-7 h-7"
                  style={{ borderBottom: '1px solid rgba(168,85,247,.5)', borderRight: '1px solid rgba(168,85,247,.5)' }} />

                <div className="w-16 h-16 flex items-center justify-center text-3xl mb-6 mx-auto"
                  style={{ background: 'rgba(0,245,255,.08)', border: '1px solid rgba(0,245,255,.3)', boxShadow: '0 0 30px rgba(0,245,255,.15)' }}>
                  ✓
                </div>
                <div className="leading-none mb-3" style={{ ...bebasNeue, fontSize: '2rem', color: '#00F5FF' }}>
                  ENQUIRY RECEIVED
                </div>
                <div className="w-10 h-px mb-5 mx-auto"
                  style={{ background: 'linear-gradient(90deg,transparent,#00F5FF,transparent)' }} />
                <p className="text-[13px] font-light text-[#F0EAD6]/50 max-w-[360px] mx-auto leading-[1.8] mb-2" style={dmSans}>
                  Thank you, <strong style={{ color: '#F0EAD6' }}>{contactName}</strong>. Our Lab Setup team will
                  reach out to <strong style={{ color: '#F0EAD6' }}>{contactEmail}</strong> within 4 business hours
                  to schedule your free site assessment.
                </p>
                <p className="text-[11px] font-light text-[#F0EAD6]/30 mb-8" style={dmSans}>
                  Reference: NL-LAB-{Math.random().toString(36).slice(2,8).toUpperCase()}
                </p>
                <div className="flex gap-3 justify-center flex-wrap">
                  <Link to="/lab-setup"
                    className="text-[9px] font-bold tracking-[.3em] uppercase text-white bg-[#FF6B35] px-6 py-3 no-underline transition-all hover:bg-[#ff8040]"
                    style={syne}>Back to Solutions</Link>
                  <Link to="/"
                    className="text-[9px] font-semibold tracking-[.3em] uppercase text-[#F0EAD6]/45 border border-white/10 px-6 py-3 no-underline hover:border-[#00F5FF] hover:text-[#00F5FF] transition-all"
                    style={syne}>Go to Home</Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10">

              {/* ── LEFT: Form ── */}
              <div className="relative bg-white/[.025] border border-white/[.07] p-10">
                <div className="absolute top-0 left-0 w-7 h-7"
                  style={{ borderTop: '1px solid #FF6B35', borderLeft: '1px solid #FF6B35' }} />
                <div className="absolute bottom-0 right-0 w-7 h-7"
                  style={{ borderBottom: '1px solid rgba(168,85,247,.45)', borderRight: '1px solid rgba(168,85,247,.45)' }} />
                <div className="absolute top-0 left-0 right-0 h-[1.5px]"
                  style={{ background: 'linear-gradient(90deg,#FF6B35,rgba(168,85,247,.4),transparent)' }} />

                <div className="flex flex-col gap-6">

                  {/* Section 1: Institution */}
                  <div>
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-5 h-5 flex items-center justify-center text-xs"
                        style={{ background: 'rgba(255,107,53,.1)', border: '1px solid rgba(255,107,53,.25)' }}>
                        <span style={{ ...bebasNeue, color: '#FF6B35', fontSize: '11px' }}>1</span>
                      </div>
                      <span className="text-[9px] font-bold tracking-[.38em] uppercase text-[#FF6B35]" style={syne}>
                        Institution Details
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <StyledInput label="Institution Name" value={institutionName}
                          onChange={e => setInstitutionName(e.target.value)}
                          placeholder="St. Xavier's School, Bhopal" required />
                      </div>
                      <StyledSelect label="Institution Type" value={institutionType}
                        onChange={e => setInstitutionType(e.target.value)}
                        options={institutionTypes} required />
                      <StyledInput label="City / District" value={city}
                        onChange={e => setCity(e.target.value)}
                        placeholder="Bhopal, MP" required />
                    </div>
                  </div>

                  <div className="h-px bg-white/[.06]" />

                  {/* Section 2: Contact */}
                  <div>
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-5 h-5 flex items-center justify-center text-xs"
                        style={{ background: 'rgba(0,245,255,.08)', border: '1px solid rgba(0,245,255,.22)' }}>
                        <span style={{ ...bebasNeue, color: '#00F5FF', fontSize: '11px' }}>2</span>
                      </div>
                      <span className="text-[9px] font-bold tracking-[.38em] uppercase text-[#00F5FF]" style={syne}>
                        Contact Person
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <StyledInput label="Full Name" value={contactName}
                        onChange={e => setContactName(e.target.value)}
                        placeholder="Dr. Priya Sharma" required />
                      <StyledInput label="Designation" value={designation}
                        onChange={e => setDesignation(e.target.value)}
                        placeholder="Principal / Director" />
                      <StyledInput label="Email Address" type="email" value={contactEmail}
                        onChange={e => setContactEmail(e.target.value)}
                        placeholder="principal@school.edu.in" required />
                      <StyledInput label="Phone / WhatsApp" type="tel" value={contactPhone}
                        onChange={e => setContactPhone(e.target.value)}
                        placeholder="+91 98765 43210" required />
                    </div>
                  </div>

                  <div className="h-px bg-white/[.06]" />

                  {/* Section 3: Lab Requirements */}
                  <div>
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-5 h-5 flex items-center justify-center text-xs"
                        style={{ background: 'rgba(168,85,247,.08)', border: '1px solid rgba(168,85,247,.22)' }}>
                        <span style={{ ...bebasNeue, color: '#A855F7', fontSize: '11px' }}>3</span>
                      </div>
                      <span className="text-[9px] font-bold tracking-[.38em] uppercase text-[#A855F7]" style={syne}>
                        Lab Requirements
                      </span>
                    </div>

                    <div className="mb-5">
                      <div className="text-[8px] font-bold tracking-[.38em] uppercase text-[#F0EAD6]/[.28] mb-3" style={syne}>
                        Labs Interested In <span style={{ color: '#FF6B35' }}>*</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {labOptions.map(lab => (
                          <LabChip key={lab.id} lab={lab}
                            selected={selectedLabs.includes(lab.id)}
                            onToggle={() => toggleLab(lab.id)} />
                        ))}
                      </div>
                      {selectedLabs.length > 0 && (
                        <div className="mt-2 text-[9px] font-light text-[#F0EAD6]/30" style={dmSans}>
                          {selectedLabs.length} lab{selectedLabs.length > 1 ? 's' : ''} selected
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <StyledInput label="Number of Students (approx.)" value={students}
                        onChange={e => setStudents(e.target.value)}
                        placeholder="e.g. 300 students" />
                      <StyledInput label="Available Area (sq ft)" value={area}
                        onChange={e => setArea(e.target.value)}
                        placeholder="e.g. 500–800 sq ft" />
                      <StyledSelect label="Budget Range" value={budget}
                        onChange={e => setBudget(e.target.value)}
                        options={budgetRanges} required />
                      <StyledSelect label="Expected Timeline" value={timeline}
                        onChange={e => setTimeline(e.target.value)}
                        options={timelines} required />
                    </div>
                  </div>

                  <div className="h-px bg-white/[.06]" />

                  {/* Section 4: Notes */}
                  <div>
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-5 h-5 flex items-center justify-center text-xs"
                        style={{ background: 'rgba(255,0,110,.08)', border: '1px solid rgba(255,0,110,.22)' }}>
                        <span style={{ ...bebasNeue, color: '#FF006E', fontSize: '11px' }}>4</span>
                      </div>
                      <span className="text-[9px] font-bold tracking-[.38em] uppercase text-[#FF006E]" style={syne}>
                        Additional Notes
                      </span>
                    </div>
                    <div>
                      <div className="text-[8px] font-bold tracking-[.38em] uppercase text-[#F0EAD6]/[.28] mb-1.5" style={syne}>
                        Anything else we should know?
                      </div>
                      <textarea
                        rows={4}
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        placeholder="Government grants, existing infrastructure, specific curriculum needs, ATL documentation requirements..."
                        style={{
                          width: '100%', background: 'rgba(255,255,255,.025)',
                          border: '1px solid rgba(255,255,255,.09)',
                          padding: '12px 16px', color: '#F0EAD6', outline: 'none',
                          resize: 'none', ...dmSans, fontSize: 13,
                        }}
                        onFocus={e => { e.target.style.borderColor = '#FF6B35'; e.target.style.background = 'rgba(255,255,255,.04)' }}
                        onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,.09)'; e.target.style.background = 'rgba(255,255,255,.025)' }}
                      />
                    </div>
                  </div>

                  {/* Submit */}
                  <div style={{ opacity: canSubmit ? 1 : 0.45, transition: 'opacity .3s ease' }}>
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={!canSubmit || submitState === 'sending'}
                      className="relative w-full overflow-hidden text-[10px] font-bold tracking-[.32em] uppercase text-white border-none py-4 transition-all duration-300"
                      style={{
                        ...syne,
                        background: '#FF6B35',
                        cursor: canSubmit ? 'pointer' : 'not-allowed',
                        boxShadow: canSubmit ? '0 0 28px rgba(255,107,53,.28)' : 'none',
                      }}
                      onMouseEnter={e => canSubmit && (e.currentTarget.style.background = '#ff8040')}
                      onMouseLeave={e => (e.currentTarget.style.background = '#FF6B35')}
                    >
                      {submitState === 'sending' ? 'Submitting Enquiry...' : 'Submit Proposal Request →'}
                    </button>
                    <p className="text-[10px] font-light text-[#F0EAD6]/20 text-center mt-3 leading-[1.6]" style={dmSans}>
                      By submitting you agree to be contacted by our Lab Setup team. No spam — ever.
                    </p>
                  </div>
                </div>
              </div>

              {/* ── RIGHT: Info sidebar ── */}
              <div className="flex flex-col gap-5">

                {/* What happens next */}
                <div className="relative bg-white/[.025] border border-white/[.07] p-7">
                  <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-[#FF6B35]" />
                  <div className="absolute top-0 left-0 right-0 h-[1.5px]"
                    style={{ background: 'linear-gradient(90deg,#FF6B35,transparent)' }} />

                  <div className="text-[8px] font-bold tracking-[.38em] uppercase text-[#FF6B35] mb-5" style={syne}>
                    What Happens Next
                  </div>
                  {[
                    { icon: '📞', label: 'Day 1',    text: 'Our team calls you to confirm details and schedule the site visit.' },
                    { icon: '📐', label: 'Day 2–3',  text: 'Site assessment — our engineers visit your campus.' },
                    { icon: '📋', label: 'Day 5',    text: 'Detailed proposal delivered with floor plan, equipment list & cost.' },
                    { icon: '🚀', label: 'Day 7+',   text: 'Project kick-off on your approval — timelines confirmed.' },
                  ].map(step => (
                    <div key={step.label} className="flex gap-3.5 mb-5 last:mb-0">
                      <div className="w-8 h-8 flex items-center justify-center text-sm flex-shrink-0"
                        style={{ background: 'rgba(255,107,53,.08)', border: '1px solid rgba(255,107,53,.2)' }}>
                        {step.icon}
                      </div>
                      <div>
                        <div className="text-[8px] font-bold tracking-[.3em] uppercase text-[#FF6B35] mb-0.5" style={syne}>
                          {step.label}
                        </div>
                        <p className="text-[11px] font-light text-[#F0EAD6]/45 leading-[1.65]" style={dmSans}>
                          {step.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Contact alternate */}
                <div className="relative bg-white/[.025] border border-white/[.07] p-6">
                  <div className="text-[8px] font-bold tracking-[.38em] uppercase text-[#F0EAD6]/[.25] mb-4" style={syne}>
                    Prefer to Call?
                  </div>
                  {[
                    { icon: '📱', label: 'WhatsApp',  value: '+91 98765 43210', href: 'https://wa.me/919876543210', color: '#A855F7' },
                    { icon: '✉️', label: 'Email',      value: 'labs@nimolabs.in', href: 'mailto:labs@nimolabs.in', color: '#00F5FF' },
                  ].map(c => (
                    <a key={c.label} href={c.href} target="_blank" rel="noreferrer"
                      className="flex items-center gap-3 mb-3 last:mb-0 no-underline group">
                      <div className="w-8 h-8 flex items-center justify-center text-sm flex-shrink-0"
                        style={{ background: `rgba(${c.color === '#A855F7' ? '168,85,247' : '0,245,255'},.08)`, border: `1px solid rgba(${c.color === '#A855F7' ? '168,85,247' : '0,245,255'},.2)` }}>
                        {c.icon}
                      </div>
                      <div>
                        <div className="text-[7px] font-bold tracking-[.35em] uppercase mb-0.5"
                          style={{ ...syne, color: c.color }}>{c.label}</div>
                        <div className="text-[12px] font-medium text-[#F0EAD6]/65 group-hover:text-[#F0EAD6] transition-colors"
                          style={dmSans}>{c.value}</div>
                      </div>
                    </a>
                  ))}
                </div>

                {/* Compliances */}
                <div className="relative bg-[#FF6B35]/[.04] border border-[#FF6B35]/[.18] p-5">
                  <div className="absolute top-0 left-0 right-0 h-[1.5px]"
                    style={{ background: 'linear-gradient(90deg,#FF6B35,transparent)' }} />
                  <div className="text-[8px] font-bold tracking-[.38em] uppercase text-[#FF6B35] mb-3" style={syne}>
                    Government Compliant
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['AIM ATL', 'NEP 2020', 'CBSE STEM', 'NITI Aayog', 'Samagra Shiksha'].map(tag => (
                      <span key={tag} className="text-[7px] font-bold tracking-[.28em] uppercase px-2.5 py-1"
                        style={{ ...syne, color: '#FF6B35', background: 'rgba(255,107,53,.08)', border: '1px solid rgba(255,107,53,.22)' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
