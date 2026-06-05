import { useEffect, useRef, useState } from 'react'

/* ─────────────────────────────────────────────────────────────────
   THEME TOKENS  (inline style helpers — match cinematic theme)
───────────────────────────────────────────────────────────────── */
const C = {
  bg:     '#020203',
  orange: '#FF6230',
  pink:   '#E0357A',
  purple: '#8B31E8',
  cyan:   '#00DFFF',
}

const bb  = { fontFamily: "'Bebas Neue', cursive" }
const bc  = { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 400 }
const bar = { fontFamily: "'Barlow', sans-serif",           fontWeight: 300 }

const gradOrangePink = {
  background: `linear-gradient(90deg,${C.orange},${C.pink})`,
  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
}
const gradCyanPurple = {
  background: `linear-gradient(90deg,${C.cyan},${C.purple})`,
  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
}
const gradPurpleCyan = {
  background: `linear-gradient(90deg,${C.purple},${C.cyan})`,
  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
}
const gradPinkPurple = {
  background: `linear-gradient(90deg,${C.pink},${C.purple})`,
  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
}

/* ─────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────── */
const TIMELINE = [
  {
    year: '2022', accentColor: C.orange, yearGrad: gradOrangePink,
    title: 'The Beginning — A Borrowed Soldering Iron',
    body:  "Arjun starts Nimo Labs in his mother's spare room with ₹40,000 in savings and five students. The first session: a line-following robot. The first outcome: five children who believed in themselves for the first time.",
    tags:  ['5 First Students', '1 Workshop', 'Bhopal, MP'],
  },
  {
    year: '2023', accentColor: C.cyan, yearGrad: gradCyanPurple,
    title: 'First Summer Camp — Something Changed',
    body:  '30 students. 5 days. 3 robots each. The first Nimo Labs Summer Camp runs out of a rented workshop and sells out by word of mouth alone. One student wins a state-level science fair with a robot built here.',
    tags:  ['30 Students', 'First Camp', '3 Robots Each', 'State Science Fair Win'],
  },
  {
    year: '2024', accentColor: C.pink, yearGrad: gradPinkPurple,
    title: 'City-Wide Reach — The Lab Grows Up',
    body:  'Nimo Labs expands across Bhopal. School partnership program launches — 10+ schools visited. A full-time team of 4 joins. The first NimoBot Challenge sees 18 student teams compete. 120 attendees. Local press. A waiting list forms.',
    tags:  ['10+ Schools', 'NimoBot Challenge', '18 Teams', 'Team of 4', 'Media Coverage'],
  },
  {
    year: '2025', accentColor: C.purple, yearGrad: gradPurpleCyan,
    title: 'Beyond The Horizon — What Comes Next',
    body:  "New curriculum: Arduino, ESP32, AI on embedded devices, 3D design. College partnerships across Bhopal. Robot catalogue grows to 6 in-house designs. 500+ students trained. And we're just getting started.",
    tags:  ['500+ Students', '6 Robot Designs', 'College Partnerships', 'Online Platform', 'AI Curriculum'],
  },
]

const MILESTONES = [
  { icon: '👨‍🎓', raw: 500,  display: '500+', suffix: '+', label: 'Students Trained',   sub: 'Across all programs since 2022',         grad: gradOrangePink },
  { icon: '🏫',  raw: 20,   display: '20+',  suffix: '+', label: 'Schools Reached',    sub: 'Live demo sessions and workshops',        grad: gradCyanPurple },
  { icon: '🤖',  raw: 50,   display: '50+',  suffix: '+', label: 'Robots Designed',    sub: 'All built in-house in Bhopal',            grad: gradPinkPurple },
  { icon: '📅',  raw: 3,    display: '3+',   suffix: '+', label: 'Years Running',      sub: 'From spare room to full lab since 2022',  grad: gradOrangePink },
  { icon: '⭐',  raw: 98,   display: '98%',  suffix: '%', label: 'Satisfaction Rate',  sub: 'Student & parent post-program surveys',   grad: { background: `linear-gradient(90deg,${C.orange},${C.cyan})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' } },
  { icon: '🏆',  raw: 12,   display: '12+',  suffix: '+', label: 'Competitions Won',   sub: 'State & national level by our students',  grad: gradPurpleCyan },
]

const DIFF_ROWS = [
  { feat: 'Learning Style',      trad: 'Theory first. Practice maybe never.',      nimo: 'Build first. Theory explains what you just made.'     },
  { feat: 'Equipment',           trad: 'Software simulators and diagrams.',         nimo: 'Real Arduino boards, sensors, wires, motors.'         },
  { feat: 'Class Size',          trad: '30–60 students per batch.',                nimo: 'Max 20 students. Every student gets mentor time.'      },
  { feat: 'Age Range',           trad: 'Primarily 16+ and college-level.',         nimo: 'Ages 10–18. We meet you where you are.'               },
  { feat: 'What You Leave With', trad: 'A certificate and notes.',                 nimo: 'A working robot you built yourself.'                   },
  { feat: 'Success Measure',     trad: 'Exam scores and percentages.',             nimo: "Does your robot work? Did you build it yourself?"      },
]

const DIFF_CARDS = [
  { icon: '⚡', title: 'Project-First Learning', accent: C.orange, accentDim: 'rgba(255,98,48,.07)', accentBorder: 'rgba(255,98,48,.28)', titleGrad: gradOrangePink,
    body: "Every session starts with a goal: build something. Theory is introduced only when it answers a question the project just raised. Students retain 3× more when they experience before they memorise." },
  { icon: '🔧', title: 'Real Components',        accent: C.cyan,   accentDim: 'rgba(0,223,255,.06)', accentBorder: 'rgba(0,223,255,.28)',  titleGrad: gradCyanPurple,
    body: "No simulations. No theory labs. Every student handles real hardware — Arduino, breadboards, servo motors, ultrasonic sensors. If it breaks, you fix it. That's how engineers learn." },
  { icon: '🏆', title: 'Competition Ready',      accent: C.pink,   accentDim: 'rgba(224,53,122,.06)',accentBorder: 'rgba(224,53,122,.28)', titleGrad: gradPinkPurple,
    body: "Our programs build robots that enter real competitions. We've had students place at state and national level within months of their first session." },
  { icon: '👥', title: 'Small Batches',          accent: C.purple, accentDim: 'rgba(139,49,232,.07)',accentBorder: 'rgba(139,49,232,.28)', titleGrad: gradPurpleCyan,
    body: "We cap every batch at 20 students. That means your child gets actual mentorship, not a seat in a lecture hall. Every question is answered. No exceptions." },
  { icon: '📍', title: 'Locally Rooted',         accent: C.orange, accentDim: 'rgba(255,98,48,.07)', accentBorder: 'rgba(255,98,48,.28)', titleGrad: gradOrangePink,
    body: "We're from Bhopal, built for Bhopal students. Our pricing, scheduling, and curriculum is designed around what works for local families and schools." },
  { icon: '🚀', title: 'Lifelong Community',     accent: C.cyan,   accentDim: 'rgba(0,223,255,.06)', accentBorder: 'rgba(0,223,255,.28)',  titleGrad: gradCyanPurple,
    body: "Once a Nimo Labs student, always part of the community. Alumni get access to advanced programs, competition teams, and our robot lab — forever." },
]

/* ─────────────────────────────────────────────────────────────────
   SHARED LAYOUT ATOMS
───────────────────────────────────────────────────────────────── */
function Atmosphere() {
  return (
    <>
      <div aria-hidden style={{ position:'absolute', top:'-160px', left:'-120px', width:'640px', height:'520px', borderRadius:'50%', pointerEvents:'none', background:'radial-gradient(ellipse,rgba(255,98,48,.13) 0%,transparent 70%)' }} />
      <div aria-hidden style={{ position:'absolute', bottom:'-160px', right:'-80px', width:'560px', height:'460px', borderRadius:'50%', pointerEvents:'none', background:'radial-gradient(ellipse,rgba(139,49,232,.11) 0%,transparent 70%)' }} />
      <div aria-hidden style={{ position:'absolute', inset:0, pointerEvents:'none', background:'repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(0,0,0,.065) 3px,rgba(0,0,0,.065) 4px)' }} />
      <div aria-hidden style={{ position:'absolute', inset:0, pointerEvents:'none', backgroundImage:'linear-gradient(rgba(255,98,48,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,98,48,.02) 1px,transparent 1px)', backgroundSize:'48px 48px' }} />
      <div aria-hidden style={{ position:'absolute', inset:0, pointerEvents:'none', opacity:.022, backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23g)'/%3E%3C/svg%3E\")" }} />
    </>
  )
}

function SectionLabel({ text }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:28 }}>
      <div style={{ width:32, height:'1.5px', flexShrink:0, background:`linear-gradient(to right,${C.orange},${C.pink})` }} />
      <span style={{ ...bc, fontSize:9, letterSpacing:'.42em', textTransform:'uppercase', color:'rgba(255,255,255,.3)' }}>{text}</span>
    </div>
  )
}

function GhostNum({ children, color }) {
  return (
    <div aria-hidden style={{ ...bb, fontSize:'clamp(5rem,10vw,8.5rem)', lineHeight:1, color:'transparent', WebkitTextStroke:`1px ${color||'rgba(255,255,255,.04)'}`, letterSpacing:'-.01em', userSelect:'none', pointerEvents:'none', marginBottom:'-1.2rem' }}>
      {children}
    </div>
  )
}

function Eyebrow({ children }) {
  return (
    <div style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'7px 14px', background:'rgba(255,98,48,.07)', border:'1px solid rgba(255,98,48,.25)', marginBottom:20 }}>
      <span style={{ width:6, height:6, borderRadius:'50%', background:C.orange, display:'block', flexShrink:0, animation:'pulse 2s ease-in-out infinite' }} />
      <span style={{ ...bc, fontSize:9, letterSpacing:'.42em', textTransform:'uppercase', color:C.orange }}>{children}</span>
    </div>
  )
}

function GradRule({ width = 56 }) {
  return <div style={{ width, height:'1.5px', background:`linear-gradient(to right,${C.orange},${C.pink},transparent)`, margin:'20px 0' }} />
}

function BtnPrimary({ children, style }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ ...bc, fontSize:9, letterSpacing:'.4em', textTransform:'uppercase', color:'#fff', background: hov ? '#ff7a4a' : C.orange, border:'none', padding:'13px 28px', cursor:'pointer', boxShadow: hov ? `0 0 38px rgba(255,98,48,.55)` : `0 0 20px rgba(255,98,48,.28)`, transform: hov ? 'translateY(-1px)' : 'none', transition:'all .3s', ...style }}
    >{children}</button>
  )
}

function BtnGhost({ children }) {
  const [hov, setHov] = useState(false)
  return (
    <button
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ ...bc, fontSize:9, letterSpacing:'.4em', textTransform:'uppercase', color: hov ? C.cyan : 'rgba(255,255,255,.42)', background: hov ? 'rgba(0,223,255,.04)' : 'rgba(255,255,255,.03)', border:`1px solid ${hov ? C.cyan : 'rgba(255,255,255,.12)'}`, padding:'13px 28px', cursor:'pointer', transition:'all .3s' }}
    >{children}</button>
  )
}

/* ─────────────────────────────────────────────────────────────────
   MILESTONE CARD  (own component so hook is always called)
───────────────────────────────────────────────────────────────── */
function MilestoneCard({ m, visible }) {
  const [count, setCount] = useState(0)
  const [hov,   setHov]   = useState(false)

  useEffect(() => {
    if (!visible) return
    let cur = 0
    const id = setInterval(() => {
      cur += m.raw / 40
      if (cur >= m.raw) { setCount(m.raw); clearInterval(id) } else setCount(Math.floor(cur))
    }, 1800 / 40)
    return () => clearInterval(id)
  }, [visible, m.raw])

  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ position:'relative', padding:'32px 28px', background: hov ? 'rgba(255,255,255,.015)' : C.bg, transition:'background .3s', cursor:'default' }}
    >
      {hov && <div style={{ position:'absolute', top:0, left:0, width:14, height:14, borderTop:`1px solid ${C.orange}`, borderLeft:`1px solid ${C.orange}` }} />}
      <div style={{ fontSize:22, marginBottom:12 }}>{m.icon}</div>
      <div style={{ ...bb, ...m.grad, fontSize:'clamp(2.5rem,4vw,3.5rem)', lineHeight:1, letterSpacing:'.02em', marginBottom:6 }}>
        {visible ? count : 0}{m.suffix}
      </div>
      <div style={{ ...bc, fontSize:10, letterSpacing:'.32em', textTransform:'uppercase', color:'rgba(255,255,255,.58)', marginBottom:6 }}>{m.label}</div>
      <div style={{ ...bar, fontSize:12, color:'rgba(255,255,255,.28)', lineHeight:1.65, letterSpacing:'.02em' }}>{m.sub}</div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
   DIFFERENTIATOR CARD
───────────────────────────────────────────────────────────────── */
function DiffCard({ c }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ position:'relative', padding:24, border:`1px solid ${hov ? 'rgba(255,98,48,.3)' : 'rgba(255,255,255,.07)'}`, background: hov ? 'rgba(255,255,255,.02)' : 'rgba(255,255,255,.025)', transform: hov ? 'translateY(-3px)' : 'none', boxShadow: hov ? '0 8px 32px rgba(255,98,48,.1)' : 'none', transition:'all .3s' }}
    >
      {hov && <>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:'1.5px', background:`linear-gradient(90deg,${c.accent},transparent)` }} />
        <div style={{ position:'absolute', top:0, left:0, width:14, height:14, borderTop:`1px solid ${c.accent}`, borderLeft:`1px solid ${c.accent}` }} />
      </>}
      <div style={{ width:40, height:40, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, border:`1px solid ${c.accentBorder}`, background:c.accentDim, marginBottom:16 }}>{c.icon}</div>
      <h4 style={{ ...bb, ...c.titleGrad, fontSize:'1.55rem', letterSpacing:'.03em', lineHeight:.92, marginBottom:10 }}>{c.title}</h4>
      <p style={{ ...bar, fontSize:12.5, lineHeight:1.78, color:'rgba(255,255,255,.4)', letterSpacing:'.02em' }}>{c.body}</p>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────────── */
export default function AboutPage() {
  const msRef = useRef(null)
  const [msVis, setMsVis] = useState(false)

  useEffect(() => {
    /* Load fonts */
    const link = document.createElement('link')
    link.rel   = 'stylesheet'
    link.href  = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@300;400&family=Barlow:wght@300;400&display=swap'
    document.head.appendChild(link)

    /* Pulse keyframe */
    const style = document.createElement('style')
    style.textContent = `@keyframes pulse{0%,100%{opacity:.5}50%{opacity:1}}`
    document.head.appendChild(style)

    return () => { document.head.removeChild(link); document.head.removeChild(style) }
  }, [])

  useEffect(() => {
    const el = msRef.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setMsVis(true); obs.disconnect() } }, { threshold: 0.15 })
    obs.observe(el); return () => obs.disconnect()
  }, [])

  /* shared section wrapper */
  const Sec = ({ children, id }) => (
    <section id={id} style={{ position:'relative', overflow:'hidden', borderBottom:'1px solid rgba(255,255,255,.055)' }}>
      <Atmosphere />
      <div style={{ position:'relative', zIndex:2, maxWidth:1100, margin:'0 auto', padding:'72px 40px' }}>
        {children}
      </div>
    </section>
  )

  return (
    <div style={{ background:C.bg, color:'#fff', minHeight:'100vh', overflow:'hidden' }}>

      {/* ══ 1. HERO ═══════════════════════════════════════════════ */}
      <Sec id="about-hero">
        {/* Orbit rings */}
        {[500,340,180].map((s,i) => (
          <div key={s} aria-hidden style={{ position:'absolute', borderRadius:'50%', pointerEvents:'none', right:'-80px', top:'50%', transform:'translateY(-50%)', width:s, height:s, border:`1px solid ${i===2?'rgba(255,98,48,.06)':'rgba(255,255,255,.025)'}`, marginLeft:-s/2, marginTop:-s/2 }} />
        ))}

        <GhostNum>00</GhostNum>
        <Eyebrow>Our Story</Eyebrow>

        <span style={{ ...bb, fontSize:'clamp(3.2rem,9vw,7.5rem)', letterSpacing:'.025em', display:'block', lineHeight:.88, color:'transparent', WebkitTextStroke:'1px rgba(255,255,255,.25)' }}>BEYOND THE</span>
        <span style={{ ...bb, ...gradOrangePink, fontSize:'clamp(3.2rem,9vw,7.5rem)', letterSpacing:'.025em', display:'block', lineHeight:.88, filter:'drop-shadow(0 0 30px rgba(255,98,48,.22))' }}>CLASSROOM</span>
        <p style={{ ...bc, fontSize:'clamp(11px,1.5vw,15px)', letterSpacing:'.2em', textTransform:'uppercase', color:C.cyan, marginTop:10, marginBottom:28 }}>Bhopal's First Hands-On Robotics Education Lab</p>

        <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
          {[
            { dot:C.orange, t:'Est. 2022'              },
            { dot:C.cyan,   t:'Bhopal, Madhya Pradesh' },
            { dot:C.purple, t:'500+ Students'          },
            { dot:C.pink,   t:'20+ Schools'            },
          ].map(c => (
            <div key={c.t} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 16px', border:'1px solid rgba(255,255,255,.08)', background:'rgba(255,255,255,.03)' }}>
              <span style={{ width:5, height:5, borderRadius:'50%', background:c.dot, display:'block', flexShrink:0 }} />
              <span style={{ ...bc, fontSize:9, letterSpacing:'.35em', textTransform:'uppercase', color:'rgba(255,255,255,.42)' }}>{c.t}</span>
            </div>
          ))}
        </div>
      </Sec>

      {/* ══ 2. VISION & MISSION ═══════════════════════════════════ */}
      <Sec id="about-vm">
        <SectionLabel text="Vision & Mission" />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:1, background:'rgba(255,255,255,.06)' }}>

          {/* Vision */}
          {[
            { num:'01', label:'Our Vision', grad:gradOrangePink, accent:C.orange, topLine:`linear-gradient(90deg,${C.orange},${C.pink},transparent)`,
              heading:'Make Robotics The Language Every Indian Student Speaks',
              body:"We envision a future where every student — regardless of city, school, or background — has access to world-class hands-on robotics education. Where building a robot is as natural as solving a math problem." },
            { num:'02', label:'Our Mission', grad:gradPurpleCyan, accent:C.purple, topLine:`linear-gradient(90deg,${C.purple},${C.cyan},transparent)`,
              heading:'Provide Hands-On Education That Turns Curiosity Into Creation',
              body:"We deliver project-based robotics programs where students don't just learn about technology — they build it. Every session ends with something real in your hands and a new skill in your head." },
          ].map((vm,i) => (
            <div key={vm.num} style={{ position:'relative', padding:'48px 40px', background:C.bg }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:'1.5px', background:vm.topLine }} />
              <div style={{ position:'absolute', top:0, left:0, width:20, height:20, borderTop:`1px solid ${vm.accent}`, borderLeft:`1px solid ${vm.accent}` }} />
              <div style={{ ...bb, fontSize:'7rem', lineHeight:1, color:'transparent', WebkitTextStroke:'1px rgba(255,255,255,.04)', userSelect:'none', marginBottom:'-1.5rem' }}>{vm.num}</div>
              <span style={{ ...bc, fontSize:8.5, letterSpacing:'.45em', textTransform:'uppercase', color:'rgba(255,255,255,.28)', display:'block', marginBottom:16 }}>{vm.label}</span>
              <h3 style={{ ...bb, ...vm.grad, fontSize:'clamp(2rem,3.5vw,3rem)', letterSpacing:'.02em', lineHeight:.92, marginBottom:20 }}>{vm.heading}</h3>
              <p style={{ ...bar, fontSize:13.5, lineHeight:1.85, color:'rgba(255,255,255,.42)', letterSpacing:'.02em', maxWidth:'46ch' }}>{vm.body}</p>
              <div style={{ width:44, height:'1.5px', marginTop:24, background:`linear-gradient(to right,${vm.accent},transparent)` }} />
            </div>
          ))}
        </div>
      </Sec>

      {/* ══ 3. FOUNDER STORY ══════════════════════════════════════ */}
      <Sec id="about-founder">
        <SectionLabel text="Founder Story" />
        <div style={{ display:'flex', flexWrap:'wrap', gap:56, alignItems:'flex-start' }}>

          {/* Avatar column */}
          <div style={{ flexShrink:0, width:260 }}>
            {/* Photo placeholder */}
            <div style={{ position:'relative', width:240, height:280, marginBottom:24 }}>
              <div style={{ width:'100%', height:'100%', border:'1px solid rgba(255,255,255,.08)', background:'rgba(255,255,255,.03)', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', position:'relative' }}>
                <div style={{ position:'absolute', inset:0, opacity:.06, backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 20px,rgba(255,98,48,.5) 20px,rgba(255,98,48,.5) 21px),repeating-linear-gradient(90deg,transparent,transparent 20px,rgba(255,98,48,.5) 20px,rgba(255,98,48,.5) 21px)' }} />
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', position:'relative', zIndex:1 }}>
                  <div style={{ width:90, height:90, borderRadius:'50%', background:'linear-gradient(145deg,#d0d0d0,#a0a0a0)', boxShadow:'0 8px 32px rgba(0,0,0,.5)' }} />
                  <div style={{ width:140, height:70, borderRadius:'80px 80px 0 0', background:'linear-gradient(to bottom,#b0b0b0,#888)', marginTop:-2 }} />
                </div>
                <div style={{ position:'absolute', bottom:0, left:0, right:0, height:56, background:'linear-gradient(to top,rgba(255,98,48,.12),transparent)' }} />
              </div>
              <div style={{ position:'absolute', top:0, left:0, width:20, height:20, borderTop:`2px solid ${C.orange}`, borderLeft:`2px solid ${C.orange}` }} />
              <div style={{ position:'absolute', bottom:0, right:0, width:20, height:20, borderBottom:'2px solid rgba(139,49,232,.5)', borderRight:'2px solid rgba(139,49,232,.5)' }} />
              <div style={{ position:'absolute', bottom:-12, left:16, display:'flex', alignItems:'center', gap:6, padding:'5px 12px', background:'rgba(255,98,48,.12)', border:'1px solid rgba(255,98,48,.3)' }}>
                <span style={{ width:5, height:5, borderRadius:'50%', background:C.orange, display:'block', animation:'pulse 2s infinite' }} />
                <span style={{ ...bc, fontSize:7.5, letterSpacing:'.38em', textTransform:'uppercase', color:C.orange }}>Founder</span>
              </div>
            </div>

            {/* Name & creds */}
            <div style={{ marginTop:8 }}>
              <div style={{ ...bb, fontSize:'1.6rem', color:'rgba(255,255,255,.92)', letterSpacing:'.04em', lineHeight:1 }}>Nitin Purohit</div>
              <div style={{ ...bc, fontSize:9, letterSpacing:'.38em', textTransform:'uppercase', color:C.orange, marginTop:4 }}>Founder & Head of Education</div>
              <div style={{ ...bc, fontSize:9, letterSpacing:'.28em', textTransform:'uppercase', color:'rgba(255,255,255,.28)', marginTop:6 }}>📍 Bhopal, Madhya Pradesh</div>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:20 }}>
              {[['🎓','B.E. Electronics, RGPV'],['⚡','8+ Years in Robotics'],['🏆','National Robotics Finalist']].map(([ic,lb]) => (
                <div key={lb} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 12px', border:'1px solid rgba(255,255,255,.07)', background:'rgba(255,255,255,.02)' }}>
                  <span style={{ fontSize:14 }}>{ic}</span>
                  <span style={{ ...bc, fontSize:8, letterSpacing:'.25em', textTransform:'uppercase', color:'rgba(255,255,255,.35)' }}>{lb}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Story column */}
          <div style={{ flex:1, minWidth:280 }}>
            <blockquote style={{ ...bb, fontSize:'clamp(1.6rem,3vw,2.6rem)', letterSpacing:'.02em', lineHeight:.92, borderLeft:`3px solid ${C.orange}`, paddingLeft:20, marginBottom:8 }}>
              "I watched brilliant students lose interest in engineering because school made it feel like a formula sheet — not a superpower."
            </blockquote>
            <cite style={{ ...bc, fontSize:9, letterSpacing:'.38em', textTransform:'uppercase', color:C.orange, paddingLeft:20, display:'block', marginBottom:28 }}>— Arjun Sharma, Founder</cite>

            <GradRule />

            {[
              "It started with frustration. After graduating from RGPV with an electronics degree, Arjun took a job teaching at a local coaching centre. He had one problem: his students could solve any circuit theory question on paper — but couldn't wire a simple LED. Something was deeply wrong.",
              "In 2022, with ₹40,000 in savings, a borrowed soldering iron, and his mother's spare room as a workshop, Arjun started Nimo Labs. The first session had five students. They were 12 and 13 years old. By the end of the day, all five had built a working robot that followed a line across the floor. One of them cried — not because it was hard, but because he'd never believed he could do something like that.",
              "That moment became the mission. Not certificates. Not exam scores. That look on a student's face when something they built with their own hands actually works.",
              "Today, Nimo Labs has trained over 500 students across Bhopal. The borrowed soldering iron has been replaced by a full electronics lab. But the mission hasn't changed — make every student feel like the engineer they already are.",
            ].map((p,i) => (
              <p key={i} style={{ ...bar, fontSize:14, lineHeight:1.88, color:'rgba(255,255,255,.45)', letterSpacing:'.02em', marginBottom:16 }}>{p}</p>
            ))}

            <div style={{ display:'flex', gap:12, marginTop:28, flexWrap:'wrap' }}>
              <BtnPrimary>Book a Workshop →</BtnPrimary>
              <BtnGhost>Read Full Story</BtnGhost>
            </div>
          </div>
        </div>
      </Sec>

      {/* ══ 4. JOURNEY TIMELINE ═══════════════════════════════════ */}
      <Sec id="about-timeline">
        <SectionLabel text="Our Journey" />
        <div style={{ position:'relative', paddingLeft:40 }}>
          {/* Spine */}
          <div style={{ position:'absolute', left:0, top:0, bottom:0, width:1, background:`linear-gradient(to bottom,${C.orange},${C.pink},${C.purple},rgba(255,255,255,.06))` }} />

          {TIMELINE.map((m,i) => (
            <div key={m.year} style={{ position:'relative', paddingLeft:40, paddingBottom: i < TIMELINE.length-1 ? 52 : 0 }}>
              {/* Dot */}
              <div style={{ position:'absolute', left:'-44px', top:6, width:10, height:10, borderRadius:'50%', border:`2px solid ${m.accentColor}`, background:`${m.accentColor}30`, boxShadow:`0 0 8px ${m.accentColor}60`, zIndex:1 }} />

              <div style={{ ...bb, ...m.yearGrad, fontSize:'clamp(2.5rem,4vw,3.2rem)', letterSpacing:'.03em', lineHeight:1, marginBottom:4 }}>{m.year}</div>
              <div style={{ ...bc, fontSize:10, letterSpacing:'.42em', textTransform:'uppercase', color:m.accentColor, marginBottom:12 }}>{m.title}</div>
              <p style={{ ...bar, fontSize:13.5, lineHeight:1.85, color:'rgba(255,255,255,.42)', letterSpacing:'.02em', maxWidth:'62ch', marginBottom:14 }}>{m.body}</p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {m.tags.map(t => (
                  <span key={t} style={{ ...bc, fontSize:8, letterSpacing:'.22em', textTransform:'uppercase', padding:'4px 10px', border:'1px solid rgba(255,255,255,.08)', color:'rgba(255,255,255,.32)', background:'rgba(255,255,255,.03)' }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Sec>

      {/* ══ 5. MILESTONES ════════════════════════════════════════ */}
      <div ref={msRef}>
        <Sec id="about-milestones">
          <SectionLabel text="Milestones" />
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:1, background:'rgba(255,255,255,.06)' }}>
            {MILESTONES.map(m => <MilestoneCard key={m.label} m={m} visible={msVis} />)}
          </div>
        </Sec>
      </div>

      {/* ══ 6. WHY DIFFERENT ════════════════════════════════════ */}
      <section style={{ position:'relative', overflow:'hidden' }}>
        <Atmosphere />
        <div style={{ position:'relative', zIndex:2, maxWidth:1100, margin:'0 auto', padding:'72px 40px' }}>
          <SectionLabel text="Why Nimo Labs" />

          {/* Heading */}
          <div style={{ marginBottom:48 }}>
            <span style={{ ...bb, fontSize:'clamp(2rem,5vw,4rem)', letterSpacing:'.025em', display:'block', lineHeight:.88, color:'transparent', WebkitTextStroke:'1px rgba(255,255,255,.28)' }}>NOT JUST ANOTHER</span>
            <span style={{ ...bb, ...gradOrangePink, fontSize:'clamp(2rem,5vw,4rem)', letterSpacing:'.025em', display:'block', lineHeight:.88, filter:'drop-shadow(0 0 22px rgba(255,98,48,.22))' }}>COACHING CLASS</span>
          </div>

          {/* Comparison table */}
          <div style={{ overflowX:'auto', marginBottom:52 }}>
            <table style={{ width:'100%', borderCollapse:'collapse', minWidth:560 }}>
              <thead>
                <tr>
                  <th style={{ ...bc, textAlign:'left', padding:'14px 20px', border:'1px solid rgba(255,255,255,.07)', background:'rgba(255,255,255,.03)', fontSize:8, letterSpacing:'.38em', textTransform:'uppercase', color:'rgba(255,255,255,.28)', width:180 }}>Feature</th>
                  <th style={{ ...bc, textAlign:'left', padding:'14px 20px', border:'1px solid rgba(255,255,255,.07)', background:'rgba(255,255,255,.02)', fontSize:9, letterSpacing:'.28em', textTransform:'uppercase', color:'rgba(255,255,255,.35)' }}>Traditional Coaching</th>
                  <th style={{ ...bb, textAlign:'left', padding:'14px 20px', border:'1px solid rgba(255,98,48,.25)', background:'rgba(255,98,48,.08)', fontSize:'1.1rem', letterSpacing:'.04em', color:C.orange }}>NIMO LABS</th>
                </tr>
              </thead>
              <tbody>
                {DIFF_ROWS.map((r,i) => (
                  <tr key={r.feat}>
                    <td style={{ ...bc, padding:'14px 20px', border:'1px solid rgba(255,255,255,.06)', fontSize:8.5, letterSpacing:'.3em', textTransform:'uppercase', color:'rgba(255,255,255,.28)', background:'rgba(255,255,255,.02)' }}>{r.feat}</td>
                    <td style={{ ...bar, padding:'14px 20px', border:'1px solid rgba(255,255,255,.06)', fontSize:12.5, color:'rgba(255,255,255,.3)', lineHeight:1.6, letterSpacing:'.02em' }}>{r.trad}</td>
                    <td style={{ ...bar, padding:'14px 20px', border:'1px solid rgba(255,98,48,.15)', fontSize:12.5, color:'rgba(255,255,255,.82)', lineHeight:1.6, letterSpacing:'.02em', background:'rgba(255,98,48,.03)' }}>
                      <span style={{ color:C.orange, marginRight:6, fontWeight:'bold' }}>✦</span>{r.nimo}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Differentiator cards */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, marginBottom:52 }}>
            {DIFF_CARDS.map(c => <DiffCard key={c.title} c={c} />)}
          </div>

          {/* Final CTA */}
          <div style={{ position:'relative', display:'flex', flexWrap:'wrap', alignItems:'center', justifyContent:'space-between', gap:20, padding:40, background:'rgba(255,255,255,.02)', border:'1px solid rgba(255,255,255,.07)' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:'1.5px', background:`linear-gradient(90deg,${C.orange},${C.pink},${C.purple},transparent)` }} />
            <div style={{ position:'absolute', top:0, left:0, width:22, height:22, borderTop:`2px solid ${C.orange}`, borderLeft:`2px solid ${C.orange}` }} />
            <div style={{ position:'absolute', bottom:0, right:0, width:22, height:22, borderBottom:'2px solid rgba(139,49,232,.5)', borderRight:'2px solid rgba(139,49,232,.5)' }} />
            <div>
              <span style={{ ...bb, ...gradOrangePink, fontSize:'clamp(2rem,4vw,3.2rem)', letterSpacing:'.03em', lineHeight:.92, display:'block', marginBottom:8 }}>Ready To Build Something Real?</span>
              <span style={{ ...bar, fontSize:13.5, color:'rgba(255,255,255,.38)', letterSpacing:'.02em' }}>Join 500+ students who chose to learn by doing — not by memorising.</span>
            </div>
            <div style={{ display:'flex', gap:12, flexWrap:'wrap', flexShrink:0 }}>
              <BtnPrimary>Book a Workshop →</BtnPrimary>
              <BtnGhost>View Programs</BtnGhost>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
