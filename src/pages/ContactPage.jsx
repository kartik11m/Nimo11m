import { useState } from 'react'

/* ─────────────────────────────────────────────────────────────────
   THEME
───────────────────────────────────────────────────────────────── */
const C   = { bg:'#020203', o:'#FF6230', p:'#E0357A', pu:'#8B31E8', cy:'#00DFFF' }
const bb  = { fontFamily:"'Bebas Neue', cursive" }
const bc  = { fontFamily:"'Barlow Condensed', sans-serif", fontWeight:400 }
const bar = { fontFamily:"'Barlow', sans-serif", fontWeight:300 }
const gradOP = { background:`linear-gradient(90deg,${C.o},${C.p})`,  WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }
const gradCP = { background:`linear-gradient(90deg,${C.cy},${C.pu})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }

/* ─────────────────────────────────────────────────────────────────
   CSS  — rendered as JSX so keyframes exist on frame 1
   FIX: was in useEffect → animations never started on first paint
───────────────────────────────────────────────────────────────── */
const PAGE_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@300;400&family=Barlow:wght@300;400&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  /* keyframes */
  @keyframes cpPulse   { 0%,100%{opacity:.5} 50%{opacity:1} }
  @keyframes cpSpin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes cpTicker  { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes cpFadeUp  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes cpSpinBtn { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

  /* Utility classes — replace inline grid so @media can override */
  .cp-split {
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: 520px;
    position: relative;
    z-index: 2;
  }
  .cp-form-info {
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 52px;
    align-items: start;
  }
  .cp-half {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .cp-quick {
    display: grid;
    grid-template-columns: repeat(3,1fr);
    gap: 14px;
  }
  .cp-ticker-track {
    display: flex;
    white-space: nowrap;
    width: max-content;           /* FIX: was missing — track must be wider than viewport */
    animation: cpTicker 24s linear infinite;
  }
  .cp-orbit-ring {
    position: absolute;
    border-radius: 50%;
  }
  .cp-pulse  { animation: cpPulse   2s   ease-in-out infinite; }
  .cp-spin-a { animation: cpSpin    16s  linear infinite; }
  .cp-spin-b { animation: cpSpin    10s  linear infinite reverse; }
  .cp-spin-c { animation: cpSpin    7s   linear infinite; }
  .cp-spinbtn{ animation: cpSpinBtn .7s  linear infinite; }

  /* Responsive overrides */
  @media (max-width: 960px) {
    .cp-split        { grid-template-columns: 1fr !important; }
    .cp-form-info    { grid-template-columns: 1fr !important; gap: 36px; }
    .cp-quick        { grid-template-columns: 1fr !important; }
    .cp-orbit-panel  { display: none; }         /* hide orbit on mobile */
  }
  @media (max-width: 600px) {
    .cp-half { grid-template-columns: 1fr !important; }
  }
`

/* ─────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────── */
const SERVICES = [
  'Arduino Fundamentals Workshop',
  'ESP32 & IoT Masterclass',
  'Robotics Summer Camp',
  'Python for Makers',
  '3D Design & Printing',
  'AI & Edge Computing',
  'School / College Demo Visit',
  'Custom Workshop',
  'Just a General Enquiry',
]

const CONTACT_CARDS = [
  { icon:'📍', label:'Address', accent:C.o,  val:'Nimo Labs HQ, Bhopal',   sub:'Madhya Pradesh, India 462001' },
  { icon:'📞', label:'Phone',   accent:C.cy, val:'+91 98765 43210',         sub:'Mon – Sat · 9AM to 7PM'       },
  { icon:'✉️', label:'Email',   accent:C.p,  val:'hello@nimolabs.in',       sub:'We reply within 24 hours'     },
  { icon:'🤖', label:'Social',  accent:C.pu, val:'@nimolabs',              sub:'Instagram · YouTube · X'      },
]

const HOURS = [
  ['Monday – Friday', '9:00 AM – 7:00 PM', false],
  ['Saturday',        '10:00 AM – 5:00 PM', false],
  ['Sunday',          'Closed',              true ],
]

const QUICK = [
  { icon:'📱', grad:gradCP, accentLine:`linear-gradient(90deg,#25D366,${C.cy})`, title:'WhatsApp Us',      body:'Quick questions? Message us on WhatsApp for the fastest response possible.',          cta:'Open WhatsApp →'  },
  { icon:'📅', grad:gradOP, accentLine:`linear-gradient(90deg,${C.o},${C.p})`,   title:'Book a Free Call', body:'Not sure which program fits? Book a 30-minute free consultation with our team.',      cta:'Schedule a Call →' },
  { icon:'🏫', grad:gradCP, accentLine:`linear-gradient(90deg,${C.pu},${C.cy})`, title:'School Visit',     body:'Want us at your campus? Book a live robot demo for your students, any day.',           cta:'Book Visit →'     },
]

const FAQS = [
  { q:'Do I need prior experience to join a workshop?',
    a:"No — our Beginner level workshops are designed for absolute beginners. We start from the very basics and build up through hands-on projects." },
  { q:'What age group are the programs for?',
    a:"Our programs are designed for students aged 10–18. We tailor complexity to the age group. Adults are welcome on a case-by-case basis — contact us to discuss." },
  { q:'What do students take home after a workshop?',
    a:"Every student takes home the project they built — a line-following robot, a 3D-printed part, or a working IoT dashboard. Plus a digital certificate and session notes." },
  { q:'Can you visit our school or college?',
    a:"Yes — our school visit program brings live robot demos, coding intros, and mini-challenges to your campus. Select 'School / College Demo Visit' in the form above." },
  { q:'What is the refund / cancellation policy?',
    a:"Full refund if you cancel 5+ days before. 50% refund 2–5 days before. No refund within 48 hours. If Nimo Labs cancels, you receive a full refund or free rescheduling." },
  { q:'Are there discounts for groups or schools?',
    a:"Groups of 5+ students from the same institution get 15% off. Schools booking a full workshop get a custom quote. Contact us directly for institutional pricing." },
]

/* ─────────────────────────────────────────────────────────────────
   ATOMS
───────────────────────────────────────────────────────────────── */
function Atm() {
  return (
    <>
      <div aria-hidden style={{ position:'absolute', top:'-160px', left:'-120px', width:'640px', height:'520px', borderRadius:'50%', pointerEvents:'none', background:'radial-gradient(ellipse,rgba(255,98,48,.14) 0%,transparent 70%)' }} />
      <div aria-hidden style={{ position:'absolute', bottom:'-140px', right:'-80px', width:'540px', height:'440px', borderRadius:'50%', pointerEvents:'none', background:'radial-gradient(ellipse,rgba(139,49,232,.11) 0%,transparent 70%)' }} />
      <div aria-hidden style={{ position:'absolute', inset:0, pointerEvents:'none', background:'repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(0,0,0,.065) 3px,rgba(0,0,0,.065) 4px)' }} />
      <div aria-hidden style={{ position:'absolute', inset:0, pointerEvents:'none', backgroundImage:'linear-gradient(rgba(255,98,48,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,98,48,.02) 1px,transparent 1px)', backgroundSize:'48px 48px' }} />
    </>
  )
}

function SecLabel({ text }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
      <div style={{ width:32, height:'1.5px', flexShrink:0, background:`linear-gradient(to right,${C.o},${C.p})` }} />
      <span style={{ ...bc, fontSize:9, letterSpacing:'.42em', textTransform:'uppercase', color:'rgba(255,255,255,.3)' }}>{text}</span>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
   FORM FIELDS
───────────────────────────────────────────────────────────────── */
const fieldBase = (focused) => ({
  fontSize:13, color:'rgba(255,255,255,.75)',
  background:'rgba(255,255,255,.04)',
  border:`1px solid ${focused ? 'rgba(255,98,48,.5)' : 'rgba(255,255,255,.09)'}`,
  padding:'11px 14px', outline:'none',
  transition:'border-color .3s, box-shadow .3s',
  letterSpacing:'.02em',
  boxShadow: focused ? '0 0 0 3px rgba(255,98,48,.08)' : 'none',
  width:'100%',
  ...bar,
})

function Field({ label, type='text', name, value, onChange, placeholder, required }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
      <label style={{ ...bc, fontSize:8, letterSpacing:'.42em', textTransform:'uppercase', color:'rgba(255,255,255,.28)' }}>
        {label}{required && <span style={{ color:C.o, marginLeft:3 }}>*</span>}
      </label>
      <input type={type} name={name} value={value} onChange={onChange}
        placeholder={placeholder} required={required}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={fieldBase(focused)} />
    </div>
  )
}

function SelectField({ label, name, value, onChange, required }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
      <label style={{ ...bc, fontSize:8, letterSpacing:'.42em', textTransform:'uppercase', color:'rgba(255,255,255,.28)' }}>
        {label}{required && <span style={{ color:C.o, marginLeft:3 }}>*</span>}
      </label>
      <select name={name} value={value} onChange={onChange} required={required}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          ...fieldBase(focused),
          background:'rgba(2,2,3,.98)',
          cursor:'pointer', appearance:'none',
          /* custom arrow */
          backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='7'%3E%3Cpath d='M1 1l5 5 5-5' stroke='rgba(255,255,255,.3)' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
          backgroundRepeat:'no-repeat', backgroundPosition:'right 12px center',
          paddingRight:34,
        }}>
        <option value="" style={{ background:'#020203' }}>Select a service</option>
        {SERVICES.map(s => <option key={s} value={s} style={{ background:'#020203' }}>{s}</option>)}
      </select>
    </div>
  )
}

function TextareaField({ label, name, value, onChange, placeholder, required, rows=4 }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
      <label style={{ ...bc, fontSize:8, letterSpacing:'.42em', textTransform:'uppercase', color:'rgba(255,255,255,.28)' }}>
        {label}{required && <span style={{ color:C.o, marginLeft:3 }}>*</span>}
      </label>
      <textarea name={name} value={value} onChange={onChange}
        placeholder={placeholder} required={required} rows={rows}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ ...fieldBase(focused), resize:'none' }} />
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
   FAQ ITEM
───────────────────────────────────────────────────────────────── */
function FaqItem({ faq, index, isOpen, onToggle }) {
  return (
    <div style={{ border:`1px solid ${isOpen?'rgba(255,98,48,.32)':'rgba(255,255,255,.07)'}`, background:isOpen?'rgba(255,98,48,.04)':'rgba(255,255,255,.02)', transition:'border-color .3s, background .3s', overflow:'hidden' }}>
      <button onClick={onToggle}
        style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, padding:'18px 22px', cursor:'pointer', background:'none', border:'none', textAlign:'left' }}>
        <span style={{ ...bb, fontSize:'1.1rem', letterSpacing:'.03em', flexShrink:0, color:isOpen?C.o:'rgba(255,255,255,.25)', transition:'color .3s' }}>
          {String(index + 1).padStart(2,'0')}
        </span>
        <span style={{ ...bc, fontSize:12, letterSpacing:'.12em', color:'rgba(255,255,255,.75)', flex:1 }}>{faq.q}</span>
        <span style={{ width:24, height:24, border:`1px solid ${isOpen?C.o:'rgba(255,255,255,.12)'}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, color:isOpen?C.o:'rgba(255,255,255,.3)', flexShrink:0, transform:isOpen?'rotate(45deg)':'none', transition:'transform .3s, border-color .3s, color .3s', ...bc, lineHeight:1 }}>
          +
        </span>
      </button>
      {/* FIX: use max-height transition for smooth accordion — maxHeight needs explicit value, not just 0/200 */}
      <div style={{ maxHeight:isOpen ? 240 : 0, overflow:'hidden', transition:'max-height .42s cubic-bezier(.4,0,.2,1)' }}>
        <div style={{ padding:'0 22px 20px', paddingLeft:'calc(22px + 1.4rem + 16px)' }}>
          <p style={{ ...bar, fontSize:13, lineHeight:1.85, color:'rgba(255,255,255,.45)', letterSpacing:'.02em' }}>{faq.a}</p>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
   QUICK ACTION CARD
───────────────────────────────────────────────────────────────── */
function QuickCard({ item }) {
  const [hov, setHov] = useState(false)
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ position:'relative', padding:24, border:`1px solid ${hov?'rgba(255,98,48,.3)':'rgba(255,255,255,.07)'}`, background:hov?'rgba(255,255,255,.02)':'rgba(255,255,255,.025)', transform:hov?'translateY(-3px)':'none', boxShadow:hov?'0 8px 28px rgba(255,98,48,.09)':'none', transition:'all .3s', cursor:'pointer', overflow:'hidden' }}>
      {hov && (
        <>
          <div style={{ position:'absolute', top:0, left:0, right:0, height:'1.5px', background:item.accentLine }} />
          <div style={{ position:'absolute', top:0, left:0, width:14, height:14, borderTop:`1px solid ${C.o}`, borderLeft:`1px solid ${C.o}` }} />
        </>
      )}
      <div style={{ fontSize:26, marginBottom:14 }}>{item.icon}</div>
      <div style={{ ...bb, ...item.grad, fontSize:'1.5rem', letterSpacing:'.025em', lineHeight:.92, marginBottom:8 }}>{item.title}</div>
      <p style={{ ...bar, fontSize:12.5, lineHeight:1.75, color:'rgba(255,255,255,.38)', letterSpacing:'.02em', marginBottom:16 }}>{item.body}</p>
      <div style={{ display:'flex', alignItems:'center', gap:7, ...bc, fontSize:9, letterSpacing:'.32em', textTransform:'uppercase', color:hov?C.o:'rgba(255,255,255,.35)', transition:'color .3s' }}>
        <span style={{ display:'block', height:1, width:hov?22:12, background:item.accentLine, transition:'width .3s', flexShrink:0 }} />
        {item.cta}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
   INFO CARD
───────────────────────────────────────────────────────────────── */
function InfoCard({ card }) {
  const [hov, setHov] = useState(false)
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ position:'relative', padding:18, border:`1px solid ${hov?'rgba(255,98,48,.25)':'rgba(255,255,255,.07)'}`, background:'rgba(255,255,255,.025)', transform:hov?'translateY(-1px)':'none', transition:'all .3s', cursor:'default', overflow:'hidden' }}>
      {hov && <div style={{ position:'absolute', top:0, left:0, right:0, height:'1.5px', background:`linear-gradient(90deg,${card.accent},transparent)` }} />}
      <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
        <span style={{ fontSize:18, flexShrink:0 }}>{card.icon}</span>
        <span style={{ ...bc, fontSize:8, letterSpacing:'.38em', textTransform:'uppercase', color:card.accent }}>{card.label}</span>
      </div>
      <div style={{ ...bar, fontSize:13.5, color:'rgba(255,255,255,.78)', letterSpacing:'.02em', marginBottom:2 }}>{card.val}</div>
      <div style={{ ...bar, fontSize:11.5, color:'rgba(255,255,255,.3)', letterSpacing:'.02em' }}>{card.sub}</div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────────── */
export default function ContactPageV2() {
  const [form,      setForm]      = useState({ name:'', email:'', phone:'', service:'', school:'', students:'', message:'' })
  const [submitted, setSubmitted] = useState(false)
  const [sending,   setSending]   = useState(false)
  const [openFaq,   setOpenFaq]   = useState(null)

  /* FIX: removed useEffect font/style injection entirely.
     Fonts and keyframes now live in <style> below, guaranteed
     to exist on frame 1. */

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setSending(true)
    await new Promise(r => setTimeout(r, 1800))
    setSending(false)
    setSubmitted(true)
  }

  const resetForm = () => {
    setSubmitted(false)
    setSending(false)
    setForm({ name:'', email:'', phone:'', service:'', school:'', students:'', message:'' })
  }

  return (
    <div style={{ background:C.bg, color:'#fff', minHeight:'100vh', overflow:'hidden' }}>

      {/* ── Inline <style> so keyframes & fonts are synchronous ── */}
      <style>{PAGE_CSS}</style>

      {/* ══ 1. HERO — SPLIT SCREEN ══════════════════════════════ */}
      <section style={{ position:'relative', overflow:'hidden', borderBottom:'1px solid rgba(255,255,255,.055)' }}>
        <Atm />

        {/* Split grid — uses .cp-split class for responsive override */}
        <div className="cp-split">

          {/* Left */}
          <div style={{ position:'relative', display:'flex', flexDirection:'column', justifyContent:'center', padding:'72px 48px 72px 40px', borderRight:'1px solid rgba(255,255,255,.055)' }}>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'7px 14px', background:'rgba(255,98,48,.07)', border:'1px solid rgba(255,98,48,.25)', marginBottom:22, width:'fit-content' }}>
              {/* FIX: use className for cpPulse animation */}
              <span className="cp-pulse" style={{ width:6, height:6, borderRadius:'50%', background:C.o, flexShrink:0, display:'block' }} />
              <span style={{ ...bc, fontSize:9, letterSpacing:'.42em', textTransform:'uppercase', color:C.o }}>Get In Touch</span>
            </div>
            <span style={{ ...bb, fontSize:'clamp(3.2rem,8vw,7rem)', letterSpacing:'.025em', display:'block', lineHeight:.86, color:'transparent', WebkitTextStroke:'1px rgba(255,255,255,.25)' }}>LET'S</span>
            <span style={{ ...bb, fontSize:'clamp(3.2rem,8vw,7rem)', letterSpacing:'.025em', display:'block', lineHeight:.86, color:'transparent', WebkitTextStroke:'1px rgba(255,255,255,.25)' }}>BUILD</span>
            <span style={{ ...bb, ...gradOP, fontSize:'clamp(3.2rem,8vw,7rem)', letterSpacing:'.025em', display:'block', lineHeight:.86, filter:'drop-shadow(0 0 28px rgba(255,98,48,.24))' }}>SOMETHING</span>
            <p style={{ ...bc, fontSize:'clamp(10px,1.4vw,14px)', letterSpacing:'.2em', textTransform:'uppercase', color:C.cy, marginTop:10, marginBottom:24 }}>
              Register · Book a Visit · Ask a Question
            </p>
            <p style={{ ...bar, fontSize:13.5, lineHeight:1.85, color:'rgba(255,255,255,.42)', letterSpacing:'.02em', maxWidth:'44ch' }}>
              Whether you want to book a workshop, bring us to your school, or just have a question — we'll reply within 24 hours.
            </p>
          </div>

          {/* Right — orbit widget */}
          {/* FIX: className="cp-orbit-panel" so it hides on mobile */}
          <div className="cp-orbit-panel" style={{ position:'relative', display:'flex', alignItems:'center', justifyContent:'center', background:'radial-gradient(ellipse at 50% 50%,rgba(255,98,48,.06) 0%,transparent 70%)' }}>
            <div style={{ position:'relative', width:240, height:240, display:'flex', alignItems:'center', justifyContent:'center' }}>

              {/* FIX: use className for spin animations instead of inline animation prop */}
              <div className="cp-orbit-ring cp-spin-a"
                style={{ width:240, height:240, border:'1px solid rgba(255,98,48,.14)' }}>
                <div style={{ position:'absolute', width:8, height:8, borderRadius:'50%', background:C.o, boxShadow:`0 0 8px ${C.o}`, top:-4, left:'calc(50% - 4px)' }} />
              </div>

              <div className="cp-orbit-ring cp-spin-b"
                style={{ width:170, height:170, border:'1px solid rgba(139,49,232,.18)' }}>
                <div style={{ position:'absolute', width:8, height:8, borderRadius:'50%', background:C.pu, boxShadow:`0 0 8px ${C.pu}`, top:-4, left:'calc(50% - 4px)' }} />
              </div>

              <div className="cp-orbit-ring cp-spin-c"
                style={{ width:100, height:100, border:'1px solid rgba(0,223,255,.14)' }}>
                <div style={{ position:'absolute', width:8, height:8, borderRadius:'50%', background:C.cy, boxShadow:`0 0 8px ${C.cy}`, top:-4, left:'calc(50% - 4px)' }} />
              </div>

              <div style={{ ...bb, ...gradOP, fontSize:'1.4rem', letterSpacing:'.04em', textAlign:'center', lineHeight:1.1, position:'relative', zIndex:1 }}>
                REACH<br/>OUT
              </div>
            </div>

            {/* Side pills */}
            <div style={{ position:'absolute', right:32, top:'50%', transform:'translateY(-50%)', display:'flex', flexDirection:'column', gap:10 }}>
              {[['24hr','Response'],['Free','Consultation'],['Bhopal','Based']].map(([v,l]) => (
                <div key={l} style={{ padding:'8px 12px', border:'1px solid rgba(255,255,255,.07)', background:'rgba(255,255,255,.03)', textAlign:'right' }}>
                  <span style={{ ...bb, fontSize:'1rem', letterSpacing:'.04em', color:'rgba(255,255,255,.82)', display:'block' }}>{v}</span>
                  <span style={{ ...bc, fontSize:7.5, letterSpacing:'.32em', textTransform:'uppercase', color:'rgba(255,255,255,.28)' }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ticker — FIX: use .cp-ticker-track for width:max-content + animation */}
        <div style={{ height:48, borderTop:'1px solid rgba(255,255,255,.055)', overflow:'hidden', display:'flex', alignItems:'center', background:'rgba(255,98,48,.04)', position:'relative', zIndex:2 }}>
          <div className="cp-ticker-track">
            {['BOOK A WORKSHOP','SCHOOL VISIT AVAILABLE','FREE CONSULTATION','24HR REPLY GUARANTEE','BHOPAL · MADHYA PRADESH','GROUP DISCOUNTS AVAILABLE',
              'BOOK A WORKSHOP','SCHOOL VISIT AVAILABLE','FREE CONSULTATION','24HR REPLY GUARANTEE','BHOPAL · MADHYA PRADESH','GROUP DISCOUNTS AVAILABLE']
              .map((t,i) => (
                <span key={i} style={{ ...bc, fontSize:9, letterSpacing:'.4em', textTransform:'uppercase', color:'rgba(255,98,48,.55)', padding:'0 28px', flexShrink:0 }}>
                  {i % 2 === 1 ? '✦' : t}
                </span>
              ))}
          </div>
        </div>
      </section>

      {/* ══ 2. FORM + INFO ══════════════════════════════════════ */}
      <section style={{ position:'relative', overflow:'hidden', borderBottom:'1px solid rgba(255,255,255,.055)', padding:'72px 0' }}>
        <Atm />
        <div style={{ position:'relative', zIndex:2, maxWidth:1100, margin:'0 auto', padding:'0 40px' }}>
          <div className="cp-form-info">

            {/* ── FORM ── */}
            <div>
              <SecLabel text="Booking & Enquiry Form" />

              {!submitted ? (
                <form onSubmit={handleSubmit}>
                  <div style={{ position:'relative', padding:36, border:'1px solid rgba(255,255,255,.07)', background:'rgba(255,255,255,.02)', display:'flex', flexDirection:'column', gap:16 }}>
                    <div style={{ position:'absolute', top:0, left:0, right:0, height:'1.5px', background:`linear-gradient(90deg,${C.o},${C.p},${C.pu},transparent)` }} />
                    <div style={{ position:'absolute', top:0, left:0, width:20, height:20, borderTop:`1.5px solid ${C.o}`, borderLeft:`1.5px solid ${C.o}` }} />
                    <div style={{ position:'absolute', bottom:0, right:0, width:20, height:20, borderBottom:'1.5px solid rgba(139,49,232,.5)', borderRight:'1.5px solid rgba(139,49,232,.5)' }} />

                    <div className="cp-half">
                      <Field label="Full Name"      name="name"  value={form.name}  onChange={handleChange} placeholder="Your full name"    required />
                      <Field label="Email Address"  type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@email.com" required />
                    </div>
                    <div className="cp-half">
                      <Field label="Phone Number"   type="tel"   name="phone"    value={form.phone}    onChange={handleChange} placeholder="+91 XXXXX XXXXX" />
                      <SelectField label="I'm Interested In" name="service" value={form.service} onChange={handleChange} required />
                    </div>
                    <div className="cp-half">
                      <Field label="School / College Name" name="school"   value={form.school}   onChange={handleChange} placeholder="For institutional bookings" />
                      <Field label="No. of Students" type="number" name="students" value={form.students} onChange={handleChange} placeholder="Approximate count" />
                    </div>
                    <TextareaField label="Your Message" name="message" value={form.message} onChange={handleChange}
                      placeholder="Preferred dates, age group, specific goals, questions..." required rows={4} />

                    <p style={{ ...bar, fontSize:11, color:'rgba(255,255,255,.22)', lineHeight:1.7, letterSpacing:'.02em' }}>
                      Your information is kept private and never shared. We use it only to respond to your enquiry.
                    </p>

                    <button type="submit" disabled={sending}
                      style={{ ...bc, fontSize:9, letterSpacing:'.42em', textTransform:'uppercase', color:'#fff', background:sending?'rgba(255,98,48,.5)':C.o, border:'none', padding:14, cursor:sending?'not-allowed':'pointer', boxShadow:sending?'none':'0 0 22px rgba(255,98,48,.28)', transition:'background .3s, box-shadow .3s' }}>
                      {sending ? (
                        <span style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                          {/* FIX: className for spinBtn animation */}
                          <span className="cp-spinbtn" style={{ width:14, height:14, border:'2px solid rgba(255,255,255,.3)', borderTopColor:'white', borderRadius:'50%', display:'inline-block' }} />
                          Sending...
                        </span>
                      ) : 'Send Message →'}
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{ position:'relative', padding:48, border:'1px solid rgba(255,98,48,.35)', background:'rgba(255,98,48,.04)', textAlign:'center' }}>
                  <div style={{ position:'absolute', top:0, left:0, right:0, height:'1.5px', background:`linear-gradient(90deg,${C.o},${C.p},transparent)` }} />
                  <div style={{ position:'absolute', top:0, left:0, width:20, height:20, borderTop:`2px solid ${C.o}`, borderLeft:`2px solid ${C.o}` }} />
                  <div style={{ fontSize:'3rem', marginBottom:16 }}>✅</div>
                  <div style={{ ...bb, ...gradOP, fontSize:'2.2rem', letterSpacing:'.03em', marginBottom:12 }}>Message Sent!</div>
                  <p style={{ ...bar, fontSize:13.5, lineHeight:1.85, color:'rgba(255,255,255,.45)', maxWidth:'36ch', margin:'0 auto 24px' }}>
                    Thanks for reaching out. We'll reply within 24 hours. Check your email for a confirmation.
                  </p>
                  <button onClick={resetForm}
                    style={{ ...bc, fontSize:9, letterSpacing:'.4em', textTransform:'uppercase', color:'rgba(255,255,255,.4)', background:'transparent', border:'1px solid rgba(255,255,255,.12)', padding:'10px 22px', cursor:'pointer' }}>
                    Send Another
                  </button>
                </div>
              )}
            </div>

            {/* ── INFO COLUMN ── */}
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <SecLabel text="Contact Info" />
              {CONTACT_CARDS.map(c => <InfoCard key={c.label} card={c} />)}

              {/* Office hours */}
              <div style={{ position:'relative', padding:18, border:'1px solid rgba(255,255,255,.07)', background:'rgba(255,255,255,.02)', overflow:'hidden' }}>
                <div style={{ position:'absolute', top:0, left:0, right:0, height:'1.5px', background:`linear-gradient(to right,${C.o},${C.p},transparent)` }} />
                <div style={{ position:'absolute', top:0, left:0, width:14, height:14, borderTop:`1px solid ${C.o}`, borderLeft:`1px solid ${C.o}` }} />
                <div style={{ ...bc, fontSize:8, letterSpacing:'.42em', textTransform:'uppercase', color:'rgba(255,255,255,.28)', marginBottom:12 }}>Office Hours</div>
                {HOURS.map(([day, hrs, closed]) => (
                  <div key={day} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,.04)' }}>
                    <span style={{ ...bc, fontSize:10, letterSpacing:'.15em', color:'rgba(255,255,255,.4)' }}>{day}</span>
                    <span style={{ ...bc, fontSize:10, letterSpacing:'.1em', color:closed?'rgba(255,255,255,.28)':'rgba(255,255,255,.65)' }}>{hrs}</span>
                  </div>
                ))}
              </div>

              {/* Map placeholder */}
              <div style={{ height:160, border:'1px solid rgba(255,255,255,.07)', position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,98,48,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,98,48,.06) 1px,transparent 1px)', backgroundSize:'22px 22px' }} />
                <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 50% 50%,rgba(255,98,48,.08) 0%,rgba(2,2,3,.9) 70%)' }} />
                <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
                  <div className="cp-pulse" style={{ width:14, height:14, borderRadius:'50%', background:C.o, boxShadow:'0 0 16px rgba(255,98,48,.8)' }} />
                  <span style={{ ...bc, fontSize:8, letterSpacing:'.3em', textTransform:'uppercase', color:C.o }}>Nimo Labs HQ</span>
                  <span style={{ ...bc, fontSize:7.5, letterSpacing:'.22em', textTransform:'uppercase', color:'rgba(255,255,255,.28)' }}>Bhopal, MP</span>
                </div>
                <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'1.5px', background:`linear-gradient(90deg,${C.o},${C.p},transparent)` }} />
                <div style={{ position:'absolute', top:0, left:0, width:14, height:14, borderTop:`1px solid ${C.o}`, borderLeft:`1px solid ${C.o}` }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 3. QUICK ACTIONS ════════════════════════════════════ */}
      <section style={{ position:'relative', overflow:'hidden', borderBottom:'1px solid rgba(255,255,255,.055)', padding:'64px 0' }}>
        <Atm />
        <div style={{ position:'relative', zIndex:2, maxWidth:1100, margin:'0 auto', padding:'0 40px' }}>
          <div className="cp-quick">
            {QUICK.map(item => <QuickCard key={item.title} item={item} />)}
          </div>
        </div>
      </section>

      {/* ══ 4. FAQ ══════════════════════════════════════════════ */}
      <section style={{ position:'relative', overflow:'hidden', padding:'80px 0' }}>
        <Atm />
        <div style={{ position:'relative', zIndex:2, maxWidth:1100, margin:'0 auto', padding:'0 40px' }}>

          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:20, marginBottom:36 }}>
            <div>
              <div style={{ ...bb, fontSize:'clamp(5rem,10vw,8rem)', lineHeight:1, color:'transparent', WebkitTextStroke:'1px rgba(255,255,255,.04)', letterSpacing:'-.01em', userSelect:'none', marginBottom:'-1.2rem' }}>FAQ</div>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:8 }}>
                <div style={{ width:32, height:'1.5px', background:`linear-gradient(to right,${C.o},${C.p})`, flexShrink:0 }} />
                <span style={{ ...bc, fontSize:9, letterSpacing:'.42em', textTransform:'uppercase', color:'rgba(255,255,255,.3)' }}>Frequently Asked</span>
              </div>
              <span style={{ ...bb, ...gradOP, fontSize:'clamp(2rem,4vw,3.5rem)', letterSpacing:'.025em', lineHeight:.88, display:'block' }}>Got Questions?</span>
            </div>
            <p style={{ ...bar, fontSize:13.5, lineHeight:1.85, color:'rgba(255,255,255,.38)', maxWidth:'36ch', letterSpacing:'.02em' }}>
              Answers to what we hear most. If yours isn't here, drop us a message above.
            </p>
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {FAQS.map((faq, i) => (
              <FaqItem key={i} faq={faq} index={i}
                isOpen={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)} />
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
