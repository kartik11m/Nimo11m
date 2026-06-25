import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useOwnerAuth } from '../context/OwnerAuthContext'
import CardActions from '../components/CardActions'

const bebasNeue = { fontFamily: "'Bebas Neue', sans-serif" }
const syne      = { fontFamily: "'Syne', sans-serif" }
const dmSans    = { fontFamily: "'DM Sans', sans-serif" }

// ── FALLBACK DATA (if API fails) ──────────────────────────────────
const FALLBACK_LABS = [
  { id:1, name:'Robotics Lab', icon:'🤖', color:'#FF6B35', rgb:'255,107,53', tagline:'Build. Program. Compete.', desc:'End-to-end robotics infrastructure featuring workstations, robot kits, and a dedicated competition floor.', area:'400–800 sq ft', capacity:'24–32 Students', timeline:'4–6 Weeks', equipment:['Arduino & ESP32 kits','Robotic arm units','Sensor arrays','PCB fabrication tools','Competition arena'], suited:['school','institution','government','private'], tier:'Core' },
  { id:2, name:'AI & ML Lab', icon:'🧠', color:'#00F5FF', rgb:'0,245,255', tagline:'Train models. Deploy intelligence.', desc:'GPU-enabled workstations with pre-loaded AI frameworks, vision systems, and edge compute devices.', area:'300–600 sq ft', capacity:'20–28 Students', timeline:'3–5 Weeks', equipment:['GPU workstations','Raspberry Pi clusters','USB cameras & sensors','TFLite deployment kits','Cloud subscriptions'], suited:['institution','government','private'], tier:'Advanced' },
  { id:3, name:'ATL Lab', icon:'🔬', color:'#A855F7', rgb:'168,85,247', tagline:'AIM-compliant. Fully certified.', desc:'Atal Tinkering Lab setup aligned with NITI Aayog guidelines — documentation, equipment, and program support included.', area:'500–1000 sq ft', capacity:'30–40 Students', timeline:'6–8 Weeks', equipment:['3D printer','Electronics workbench','IoT dev kits','VR headsets','AIM-compliant materials'], suited:['school','government'], tier:'Government', badge:'AIM Compliant' },
  { id:4, name:'IoT Lab', icon:'📡', color:'#FF006E', rgb:'255,0,110', tagline:'Connect. Monitor. Control.', desc:'Smart device ecosystems with WiFi/Bluetooth hubs, cloud integration, and real-time sensor dashboards for environmental monitoring and home automation projects.', area:'250–500 sq ft', capacity:'16–24 Students', timeline:'3–4 Weeks', equipment:['ESP32 & NodeMCU boards','Wi-Fi & Bluetooth modules','Temperature & humidity sensors','Cloud server setup','MQTT brokers'], suited:['school','institution','private'], tier:'Core' },
  { id:5, name:'3D Design & Printing Lab', icon:'🖨️', color:'#00F5FF', rgb:'0,245,255', tagline:'Design. Prototype. Iterate.', desc:'CAD workstations with Fusion 360, SolidWorks training, and multi-material 3D printers for rapid prototyping and production-ready parts.', area:'350–700 sq ft', capacity:'18–28 Students', timeline:'4–6 Weeks', equipment:['3D printers (FDM & SLA)','CAD software licenses','Filament & resin supplies','Finishing tools & materials','Design tablets'], suited:['institution','government','private'], tier:'Advanced' },
  { id:6, name:'Embedded Systems Lab', icon:'⚙️', color:'#A855F7', rgb:'168,85,247', tagline:'Program hardware. Debug firmware.', desc:'RISC-V, ARM microcontroller programming with oscilloscopes, logic analyzers, and JTAG debuggers for low-level system development and real-time processing.', area:'320–620 sq ft', capacity:'20–26 Students', timeline:'5–7 Weeks', equipment:['RISC-V dev boards','ARM Cortex-M boards','Oscilloscopes & analyzers','JTAG debuggers','Real-time RTOS setup'], suited:['institution','government'], tier:'Advanced' },
  { id:7, name:'Drone & Drone Swarm Lab', icon:'🛸', color:'#FF6B35', rgb:'255,107,53', tagline:'Fly. Swarm. Innovate.', desc:'Multi-copter design, autonomous flight programming, and swarm coordination using ROS2 for drone racing, mapping, and autonomous missions.', area:'600–1200 sq ft', capacity:'24–40 Students', timeline:'6–8 Weeks', equipment:['Racing drones (DJI)','Custom build kits','Flight simulators','GPS & RTK modules','Swarm coordination software'], suited:['institution','government','private'], tier:'Advanced', badge:'Specialized' },
  { id:8, name:'Biotech & Biorobotics Lab', icon:'🧬', color:'#FF006E', rgb:'255,0,110', tagline:'Bio meets Bytes.', desc:'DNA sequencing, bioreactors, microfluidics, and bio-inspired robot design for exploring intersection of life sciences and robotics engineering.', area:'400–800 sq ft', capacity:'16–20 Students', timeline:'8–10 Weeks', equipment:['PCR machines','Microfluidic devices','Bioreactor systems','Microscopy setup','Bio-modeling software'], suited:['institution','government'], tier:'Government', badge:'STEM Research' },
]

const FALLBACK_PROCESS = [
  { step:'01', title:'Site Assessment', icon:'📐', color:'#FF6B35', rgb:'255,107,53', desc:'Our engineers visit your campus. We evaluate space dimensions, power infrastructure, connectivity, and student flow to recommend the optimal lab layout.' },
  { step:'02', title:'Custom Blueprint', icon:'📋', color:'#00F5FF', rgb:'0,245,255', desc:'A detailed floor plan, equipment manifest, curriculum alignment document, and phased installation plan — tailored to your institution.' },
  { step:'03', title:'Professional Installation', icon:'🔧', color:'#A855F7', rgb:'168,85,247', desc:'Our certified technicians handle all hardware setup, software configuration, network integration, and safety compliance.' },
  { step:'04', title:'Faculty Certification', icon:'👨‍🏫', color:'#FF006E', rgb:'255,0,110', desc:'40-hour hands-on training for your teachers — lab operation, safety protocols, curriculum delivery, and student project guidance.' },
  { step:'05', title:'Ongoing AMC & Support', icon:'🛡️', color:'#FF6B35', rgb:'255,107,53', desc:'Annual Maintenance Contract covering equipment servicing, curriculum updates, remote support, and student program management.' },
]

const FALLBACK_PACKAGES = [
  { name:'Starter', subtitle:'For schools getting started', color:'#FF6B35', rgb:'255,107,53', price:'₹8–15 Lakhs', includes:['1 Lab Type','Basic Equipment Set','Site Assessment','20-hr Teacher Training','6-month AMC','Curriculum Kit'], suited:'Small schools, government primary schools', highlight:false },
  { name:'Standard', subtitle:'For institutions scaling up', color:'#00F5FF', rgb:'0,245,255', price:'₹15–35 Lakhs', includes:['2 Lab Types','Full Equipment Set','Custom Blueprint','40-hr Teacher Certification','1-year AMC','Digital Curriculum','Student Program Support'], suited:'Secondary schools, junior colleges', highlight:true },
  { name:'Premium', subtitle:'For centres of excellence', color:'#A855F7', rgb:'168,85,247', price:'₹35 Lakhs+', includes:['3+ Lab Types','Premium Equipment','Innovation Center Design','Full Faculty Certification','2-year AMC','Curriculum Co-development','Competition Program','Dedicated Lab Manager'], suited:'Universities, group institutions, government centres', highlight:false },
]

const FALLBACK_WHYUS = [
  { icon:'🔬', title:'End-to-End Ownership', color:'#FF6B35', rgb:'255,107,53', body:'We dont just supply equipment. We design, install, train, and support — one partner for the entire lab lifecycle.' },
  { icon:'📋', title:'Curriculum-First Design', color:'#00F5FF', rgb:'0,245,255', body:'Every lab is designed around a working curriculum, not just a hardware catalogue. Students use every piece of equipment from day one.' },
  { icon:'🏛️', title:'Government Compliant', color:'#A855F7', rgb:'168,85,247', body:'ATL, NEP 2020, and CBSE STEM guidelines fully covered. We handle documentation, reporting, and AIM compliance paperwork.' },
  { icon:'🛡️', title:'Long-Term AMC', color:'#FF006E', rgb:'255,0,110', body:'Our Annual Maintenance Contracts ensure your lab never sits idle. Remote diagnostics, on-site visits, and replacement parts on call.' },
]

const audiences = [
  { key: 'all',         label: 'All Solutions', icon: '⚡' },
  { key: 'school',      label: 'Schools',        icon: '🏫' },
  { key: 'institution', label: 'Institutions',   icon: '🎓' },
  { key: 'government',  label: 'Government',     icon: '🏛️' },
  { key: 'private',     label: 'Private Orgs',   icon: '🏢' },
]

const stats = [
  { num: '40+', label: 'Labs Installed',     color: '#FF6B35' },
  { num: '12+', label: 'States Reached',     color: '#00F5FF' },
  { num: '80+', label: 'Institutions',       color: '#A855F7' },
  { num: '8',   label: 'Lab Types',          color: '#FF006E' },
]

// ── Atmosphere layer ───────────────────────────────────────────────
function Atmosphere({ color = '255,107,53' }) {
  return (
    <>
      <div className="absolute -top-[100px] -left-[60px] w-[520px] h-[400px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(ellipse,rgba(${color},.11) 0%,transparent 70%)` }} />
      <div className="absolute -bottom-[80px] -right-[40px] w-[460px] h-[360px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse,rgba(168,85,247,.09) 0%,transparent 70%)' }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(0,0,0,.055) 3px,rgba(0,0,0,.055) 4px)',
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(${color},.02) 1px,transparent 1px),linear-gradient(90deg,rgba(${color},.02) 1px,transparent 1px)`,
        backgroundSize: '48px 48px',
      }} />
    </>
  )
}

// ── Lab spec card ──────────────────────────────────────────────────
function LabCard({ lab, filtered, showEditDelete, isOwner }) {
  const [hov, setHov]    = useState(false)
  const [open, setOpen]  = useState(false)
  const dimmed = !filtered
  const data = lab.data || lab

  return (
    <div
      className="relative flex flex-col overflow-hidden transition-all duration-500 cursor-pointer"
      style={{
        background:  hov && !dimmed ? 'rgba(255,255,255,.04)' : 'rgba(255,255,255,.02)',
        border:      `1px solid ${hov && !dimmed ? `rgba(${data.rgb},.52)` : dimmed ? 'rgba(255,255,255,.04)' : 'rgba(255,255,255,.07)'}`,
        boxShadow:   hov && !dimmed ? `0 0 44px rgba(${data.rgb},.16), 0 24px 48px rgba(0,0,0,.5)` : 'none',
        transform:   hov && !dimmed ? 'translateY(-6px)' : 'none',
        opacity:     dimmed ? 0.3 : 1,
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => !dimmed && setOpen(o => !o)}
    >
      {/* Accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{
        background: data.color,
        transform: hov && !dimmed ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: 'left', transition: 'transform .45s ease',
      }} />
      {/* Corner TL */}
      <div className="absolute top-0 left-0 w-5 h-5" style={{
        borderTop: `1px solid ${data.color}`, borderLeft: `1px solid ${data.color}`,
        opacity: hov && !dimmed ? 1 : 0, transition: 'opacity .3s ease',
      }} />
      {/* Badge (moved down to avoid tier overlap) */}
      {data.badge && (
        <div className="absolute top-10 right-3"
          style={{ background: `rgba(${data.rgb},.12)`, border: `1px solid rgba(${data.rgb},.3)`, padding: '2px 8px' }}>
          <span className="text-[7px] font-bold tracking-[.3em] uppercase" style={{ ...syne, color: data.color }}>
            {data.badge}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="px-6 pt-6 pb-5 border-b border-white/[.055]">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="w-12 h-12 flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: `rgba(${data.rgb},.1)`, border: `1px solid rgba(${data.rgb},.22)` }}>
            {data.icon}
          </div>
          <div className="text-[8px] font-bold tracking-[.32em] uppercase text-right"
            style={{ ...syne, color: `rgba(${data.rgb},.6)` }}>
            {data.tier}
          </div>
        </div>
        <div className="text-[10px] font-bold tracking-[.3em] uppercase mb-1.5"
          style={{ ...syne, color: data.color }}>{data.tagline}</div>
        <h3 className="text-[20px] font-bold text-[#F0EAD6]/90 mb-2 leading-tight" style={syne}>
          {data.name}
        </h3>
        <p className="text-[12px] font-light text-[#F0EAD6]/45 leading-[1.7]" style={dmSans}>
          {data.desc}
        </p>
      </div>

      {/* Specs grid */}
      <div className="grid grid-cols-3 border-b border-white/[.055]">
        {[
          { label: 'Area',     value: data.area     },
          { label: 'Capacity', value: data.capacity  },
          { label: 'Timeline', value: data.timeline  },
        ].map((s, i) => (
          <div key={s.label}
            className={`px-4 py-3 text-center ${i < 2 ? 'border-r border-white/[.055]' : ''}`}>
            <div className="text-[7px] font-bold tracking-[.35em] uppercase text-[#F0EAD6]/[.25] mb-1" style={syne}>
              {s.label}
            </div>
            <div className="text-[11px] font-bold text-[#F0EAD6]/75" style={dmSans}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Equipment list — expandable */}
      <div className="px-6 py-5 flex-1">
        <div className="text-[7px] font-bold tracking-[.38em] uppercase text-[#F0EAD6]/[.25] mb-3" style={syne}>
          Key Equipment
        </div>
        <ul className="space-y-1.5">
          {(open ? data.equipment : data.equipment.slice(0, 3)).map(eq => (
            <li key={eq} className="flex items-center gap-2 text-[11px] font-light text-[#F0EAD6]/55" style={dmSans}>
              <span className="text-[8px] flex-shrink-0" style={{ color: data.color }}>›</span>
              {eq}
            </li>
          ))}
          {!open && data.equipment.length > 3 && (
            <li className="text-[10px] font-bold tracking-[.2em] uppercase mt-1"
              style={{ ...syne, color: `rgba(${data.rgb},.6)` }}>
              +{data.equipment.length - 3} more
            </li>
          )}
        </ul>
      </div>

      {/* Footer CTA or CardActions */}
      <div className="px-6 pb-6">
        {showEditDelete && isOwner ? (
          <CardActions
            cardId={lab._id}
            cardType="lab"
            cardData={lab.data || lab}
            showEditDelete={true}
            showAddButton={false}
          />
        ) : (
          <Link
            to="/lab-setup/enquire"
            onClick={e => e.stopPropagation()}
            className="block w-full text-center text-[9px] font-bold tracking-[.3em] uppercase no-underline py-3 border transition-all duration-200"
            style={{
              ...syne,
              color:        data.color,
              borderColor:  `rgba(${data.rgb},.3)`,
              background:   `rgba(${data.rgb},.06)`,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = `rgba(${data.rgb},.15)`
              e.currentTarget.style.boxShadow  = `0 0 18px rgba(${data.rgb},.22)`
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = `rgba(${data.rgb},.06)`
              e.currentTarget.style.boxShadow  = 'none'
            }}
          >
            Get a Quote →
          </Link>
        )}
      </div>
    </div>
  )
}

// ── Process step ───────────────────────────────────────────────────
function ProcessStep({ step, isLast, isOwner, onEdit, onDelete }) {
  const [hov, setHov] = useState(false)
  const data = step.data || step
  
  return (
    <div className="flex gap-6 relative group"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}>
      {/* Left: line + dot */}
      <div className="flex flex-col items-center flex-shrink-0 w-14">
        <div className="w-11 h-11 flex items-center justify-center text-lg flex-shrink-0 transition-all duration-400"
          style={{
            background:  hov ? `rgba(${data.rgb},.18)` : `rgba(${data.rgb},.08)`,
            border:      `1px solid rgba(${data.rgb},.${hov ? 5 : 2})`,
            boxShadow:   hov ? `0 0 20px rgba(${data.rgb},.3)` : 'none',
          }}>
          {data.icon}
        </div>
        {!isLast && (
          <div className="w-px flex-1 mt-2"
            style={{ background: `linear-gradient(to bottom,rgba(${data.rgb},.3),rgba(255,255,255,.05))` }} />
        )}
      </div>
      {/* Content */}
      <div className="pb-10 flex-1">
        <div className="flex items-center gap-3 mb-2">
          <span className="leading-none" style={{ ...bebasNeue, fontSize: '1.1rem', color: data.color }}>
            {data.step}
          </span>
          <div className="w-4 h-px" style={{ background: `rgba(${data.rgb},.4)` }} />
          <span className="text-[8px] font-bold tracking-[.35em] uppercase"
            style={{ ...syne, color: hov ? data.color : 'rgba(240,234,214,.28)' }}>
            Step
          </span>
        </div>
        <h3 className="text-[17px] font-bold text-[#F0EAD6]/88 mb-1.5 transition-colors duration-300"
          style={{ ...syne, color: hov ? data.color : undefined }}>
          {data.title}
        </h3>
        <p className="text-[12px] font-light text-[#F0EAD6]/45 leading-[1.75] max-w-[480px]" style={dmSans}>
          {data.desc}
        </p>
      </div>
      {/* Edit/Delete buttons for owner */}
      {isOwner && hov && (
        <div className="flex gap-2 absolute -right-12 top-0">
          <button onClick={onEdit} className="text-lg hover:scale-110 transition-transform">✎</button>
          <button onClick={onDelete} className="text-lg hover:scale-110 transition-transform">🗑</button>
        </div>
      )}
    </div>
  )
}

// ── Package card ───────────────────────────────────────────────────
function PackageCard({ pkg, isOwner, refreshPackages }) {
  const [hov, setHov] = useState(false)
  const data = pkg.data || pkg
  
  return (
    <div
      className="relative flex flex-col overflow-hidden group"
      style={{
        background:  hov ? 'rgba(255,255,255,.045)' : data.highlight ? 'rgba(255,255,255,.035)' : 'rgba(255,255,255,.02)',
        border:      `1px solid ${hov ? `rgba(${data.rgb},.52)` : data.highlight ? `rgba(${data.rgb},.28)` : 'rgba(255,255,255,.07)'}`,
        boxShadow:   hov ? `0 0 44px rgba(${data.rgb},.18), 0 24px 48px rgba(0,0,0,.5)` :
                     data.highlight ? `0 0 30px rgba(${data.rgb},.1)` : 'none',
        transform:   hov ? 'translateY(-6px)' : 'none',
        transition:  'all .45s cubic-bezier(.23,1,.32,1)',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {isOwner && (
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <CardActions
            cardType="package"
            cardId={pkg._id}
            cardData={pkg.data}
            showEditDelete={true}
            onCardAdded={refreshPackages}
            onCardDeleted={refreshPackages}
          />
        </div>
      )}
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: data.color, opacity: data.highlight || hov ? 1 : 0.4 }} />
      {/* Popular badge */}
      {data.highlight && (
        <div className="absolute top-11 right-4"
          style={{ background: `rgba(${data.rgb},.12)`, border: `1px solid rgba(${data.rgb},.3)`, padding: '3px 10px' }}>
          <span className="text-[7px] font-bold tracking-[.35em] uppercase" style={{ ...syne, color: data.color }}>
            Most Popular
          </span>
        </div>
      )}
      {/* Corner TL */}
      <div className="absolute top-0 left-0 w-5 h-5"
        style={{ borderTop: `1px solid ${data.color}`, borderLeft: `1px solid ${data.color}` }} />

      {/* Header */}
      <div className="px-7 pt-7 pb-6 border-b border-white/[.055]">
        <div className="text-[8px] font-bold tracking-[.38em] uppercase mb-1.5"
          style={{ ...syne, color: data.color }}>{data.subtitle}</div>
        <div className="leading-none mb-3" style={{ ...bebasNeue, fontSize: '2rem', color: '#F0EAD6' }}>
          {data.name}
        </div>
        <div className="leading-none" style={{ ...bebasNeue, fontSize: '1.5rem', color: data.color }}>
          {data.price}
        </div>
        <div className="text-[10px] font-light text-[#F0EAD6]/30 mt-1 tracking-[.04em]" style={dmSans}>
          Estimated project value
        </div>
      </div>

      {/* Includes */}
      <div className="px-7 py-6 flex-1">
        <div className="text-[7px] font-bold tracking-[.38em] uppercase text-[#F0EAD6]/[.25] mb-4" style={syne}>
          Includes
        </div>
        <ul className="space-y-2.5 mb-5">
          {data.includes.map(item => (
            <li key={item} className="flex items-center gap-2.5 text-[12px] font-light text-[#F0EAD6]/60" style={dmSans}>
              <span className="text-[9px] flex-shrink-0" style={{ color: data.color }}>✓</span>
              {item}
            </li>
          ))}
        </ul>
        <div className="text-[10px] font-light text-[#F0EAD6]/28 leading-[1.6]" style={dmSans}>
          Suited for: {data.suited}
        </div>
      </div>

      {/* CTA */}
      <div className="px-7 pb-7">
        <Link
          to="/lab-setup/enquire"
          className="block w-full text-center text-[10px] font-bold tracking-[.3em] uppercase no-underline py-3.5 text-white transition-all duration-300"
          style={{
            ...syne,
            background: data.highlight ? data.color : `rgba(${data.rgb},.1)`,
            border: data.highlight ? 'none' : `1px solid rgba(${data.rgb},.3)`,
            color: data.highlight ? '#050508' : data.color,
            boxShadow: data.highlight ? `0 0 24px rgba(${data.rgb},.3)` : 'none',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.filter = 'brightness(1.12)'
            e.currentTarget.style.boxShadow = `0 0 36px rgba(${data.rgb},.45)`
          }}
          onMouseLeave={e => {
            e.currentTarget.style.filter = 'none'
            e.currentTarget.style.boxShadow = data.highlight ? `0 0 24px rgba(${data.rgb},.3)` : 'none'
          }}
        >
          Request Proposal →
        </Link>
      </div>
    </div>
  )
}

// ── Why us card ────────────────────────────────────────────────────
function WhyCard({ item, isOwner, onEdit, onDelete }) {
  const [hov, setHov] = useState(false)
  const data = item.data || item
  
  return (
    <div
      className="relative overflow-hidden p-6 cursor-default"
      style={{
        background:  hov ? `rgba(${data.rgb},.06)` : 'rgba(255,255,255,.02)',
        border:      `1px solid ${hov ? `rgba(${data.rgb},.4)` : 'rgba(255,255,255,.06)'}`,
        transform:   hov ? 'translateY(-4px)' : 'none',
        transition:  'all .4s cubic-bezier(.23,1,.32,1)',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{
        background: data.color,
        transform: hov ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: 'left', transition: 'transform .4s ease',
      }} />
      <div className="w-11 h-11 flex items-center justify-center text-xl mb-5"
        style={{ background: `rgba(${data.rgb},.1)`, border: `1px solid rgba(${data.rgb},.22)` }}>
        {data.icon}
      </div>
      <h3 className="text-[15px] font-bold mb-2.5 text-[#F0EAD6]/90" style={syne}>{data.title}</h3>
      <p className="text-[12px] font-light leading-[1.8] text-[#F0EAD6]/45" style={dmSans}>{data.body}</p>
      {isOwner && hov && (
        <div className="flex gap-2 mt-4">
          <button onClick={onEdit} className="text-lg hover:scale-110 transition-transform">✎</button>
          <button onClick={onDelete} className="text-lg hover:scale-110 transition-transform">🗑</button>
        </div>
      )}
    </div>
  )
}

export default function LabSetupPage() {
  const { getCards, isOwner, deleteCard } = useOwnerAuth()
  const [audience, setAudience] = useState('all')
  const [labsData, setLabsData] = useState(FALLBACK_LABS.map((l, idx) => ({ _id:`lab-${idx}`, data:l })))
  const [processData, setProcessData] = useState(FALLBACK_PROCESS.map((p, idx) => ({ _id:`process-${idx}`, data:p })))
  const [packagesData, setPackagesData] = useState(FALLBACK_PACKAGES.map((pkg, idx) => ({ _id:`package-${idx}`, data:pkg })))
  const [whyUsData, setWhyUsData] = useState(FALLBACK_WHYUS.map((w, idx) => ({ _id:`whyus-${idx}`, data:w })))

  const loadPackages = useCallback(async () => {
    try {
      const packages = await getCards('package', 'explore')
      if (packages?.length > 0) setPackagesData(packages)
    } catch (error) {
      console.error('Failed to load packages:', error)
    }
  }, [getCards])

  useEffect(() => {
    const loadExploreData = async () => {
      try {
        const [labs, process, packages, whyus] = await Promise.all([
          getCards('lab', 'explore'),
          getCards('process', 'explore'),
          getCards('package', 'explore'),
          getCards('whyus', 'explore'),
        ])
        
        if (labs?.length > 0) setLabsData(labs)
        if (process?.length > 0) setProcessData(process)
        if (packages?.length > 0) setPackagesData(packages)
        if (whyus?.length > 0) setWhyUsData(whyus)
      } catch (error) {
        console.error('Failed to load explore data:', error)
      }
    }
    
    loadExploreData()
  }, [getCards])

  const isFiltered = (labObj) => {
    const lab = labObj.data || labObj
    return audience === 'all' || lab.suited.includes(audience)
  }

  return (
    <main className="bg-[#050508] text-[#F0EAD6] overflow-x-hidden" style={dmSans}>

      {/* ══ HERO ═════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-12 pt-[140px] pb-24 border-b border-white/[.055]">
        <Atmosphere />

        <div className="relative z-[2] max-w-[1100px] mx-auto">
          <div className="flex items-end justify-between gap-12 flex-wrap">
            <div className="max-w-[600px]">
              {/* Division badge */}
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-[7px] bg-[#FF6B35]/[.07] border border-[#FF6B35]/[.22]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse" />
                  <span className="text-[9px] font-bold tracking-[.42em] uppercase text-[#FF6B35]" style={syne}>
                    Nimo Labs
                  </span>
                </div>
                <span className="text-[8px] font-bold tracking-[.35em] uppercase text-[#F0EAD6]/[.25]" style={syne}>
                  Division B
                </span>
              </div>

              <div className="mb-5">
                <span className="block leading-[.88] tracking-[-0.01em]" style={{
                  ...bebasNeue, fontSize: 'clamp(52px,10vw,104px)',
                  WebkitTextStroke: '1px rgba(240,234,214,.35)', color: 'transparent',
                }}>LAB SETUP</span>
                <span className="block leading-[.88] tracking-[-0.01em] text-[#FF6B35]" style={{
                  ...bebasNeue, fontSize: 'clamp(52px,10vw,104px)',
                  textShadow: '0 0 50px rgba(255,107,53,.38)',
                }}>DIVISION</span>
                <span className="block mt-2 font-bold tracking-[.18em] uppercase text-[#00F5FF]"
                  style={{ ...syne, fontSize: 'clamp(11px,1.5vw,16px)' }}>
                  STEM Infrastructure · Innovation Labs · Smart Campuses
                </span>
              </div>

              <div className="w-14 h-px mb-6" style={{ background: 'linear-gradient(90deg,#FF6B35,transparent)' }} />
              <p className="font-light leading-[1.9] text-[#F0EAD6]/50 max-w-[500px] mb-8"
                style={{ ...dmSans, fontSize: 'clamp(13px,1.3vw,16px)' }}>
                We design, build, equip, and support world-class STEM labs for schools,
                institutions, and government bodies — from a single Robotics Lab to a
                full-campus innovation ecosystem.
              </p>

              <div className="flex gap-3 flex-wrap">
                <a href="#solutions"
                  className="text-[10px] font-bold tracking-[.32em] uppercase text-white bg-[#FF6B35] px-7 py-3.5 no-underline shadow-[0_0_24px_rgba(255,107,53,.25)] hover:bg-[#ff8040] hover:shadow-[0_0_40px_rgba(255,107,53,.5)] hover:-translate-y-px transition-all duration-300 inline-block"
                  style={syne}>Explore Solutions</a>
                <Link to="/lab-setup/enquire"
                  className="text-[10px] font-semibold tracking-[.32em] uppercase text-[#F0EAD6]/50 bg-white/[.03] border border-white/10 px-7 py-3.5 no-underline hover:border-[#00F5FF] hover:text-[#00F5FF] hover:bg-[#00F5FF]/[.04] transition-all duration-300 inline-block"
                  style={syne}>Book Site Visit →</Link>
              </div>
            </div>

            {/* Stats card */}
            <div className="relative bg-white/[.03] border border-white/[.07] p-8 flex-shrink-0">
              <div className="absolute top-0 left-0 w-7 h-7 border-t border-l border-[#FF6B35]" />
              <div className="absolute bottom-0 right-0 w-7 h-7 border-b border-r border-purple-500/50" />
              <div className="absolute top-0 left-0 right-0 h-[1.5px]"
                style={{ background: 'linear-gradient(90deg,#FF6B35,rgba(168,85,247,.4),transparent)' }} />

              <div className="grid grid-cols-2 gap-6">
                {stats.map(s => (
                  <div key={s.label} className="text-center">
                    <div className="leading-none mb-1" style={{ ...bebasNeue, fontSize: '2.2rem', color: s.color }}>
                      {s.num}
                    </div>
                    <div className="text-[8px] font-bold tracking-[.3em] uppercase text-[#F0EAD6]/[.25]" style={syne}>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-white/[.07]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse" />
                  <span className="text-[8px] font-bold tracking-[.35em] uppercase text-[#FF6B35]" style={syne}>
                    Government Empanelled
                  </span>
                </div>
                <p className="text-[11px] font-light text-[#F0EAD6]/35 leading-[1.6]" style={dmSans}>
                  AIM ATL · NEP 2020 · CBSE STEM compliant
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SOLUTIONS ════════════════════════════════════════════ */}
      <section id="solutions" className="relative overflow-hidden px-12 py-20 border-b border-white/[.055]">
        <Atmosphere color="0,245,255" />

        <div className="relative z-[2] max-w-[1100px] mx-auto">
          {/* Header */}
          <div className="flex items-end justify-between gap-8 flex-wrap mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-[7px] bg-[#FF6B35]/[.07] border border-[#FF6B35]/[.22] mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse" />
                <span className="text-[9px] font-bold tracking-[.42em] uppercase text-[#FF6B35]" style={syne}>
                  8 Lab Types
                </span>
              </div>
              <span className="block leading-[.9]" style={{
                ...bebasNeue, fontSize: 'clamp(36px,5.5vw,60px)',
                WebkitTextStroke: '1px rgba(240,234,214,.35)', color: 'transparent',
              }}>OUR</span>
              <span className="block leading-[.9] text-[#FF6B35]" style={{
                ...bebasNeue, fontSize: 'clamp(36px,5.5vw,60px)',
                textShadow: '0 0 30px rgba(255,107,53,.35)',
              }}>SOLUTIONS</span>
              <div className="w-14 h-px mt-5" style={{ background: 'linear-gradient(90deg,#FF6B35,transparent)' }} />
            </div>
            <p className="font-light text-[#F0EAD6]/40 max-w-[340px] text-[13px] leading-[1.7]" style={dmSans}>
              Select your institution type below to see the most relevant lab solutions for you.
            </p>
          </div>

          {/* Audience filter */}
          <div className="flex items-center gap-2 flex-wrap mb-10">
            <span className="text-[8px] font-bold tracking-[.38em] uppercase text-[#F0EAD6]/[.25] mr-2" style={syne}>
              I am a
            </span>
            {audiences.map(a => {
              const active = audience === a.key
              return (
                <button
                  key={a.key}
                  onClick={() => setAudience(a.key)}
                  className="inline-flex items-center gap-2 text-[9px] font-bold tracking-[.28em] uppercase px-4 py-2 border cursor-pointer transition-all duration-300"
                  style={{
                    ...syne,
                    background:   active ? 'rgba(255,107,53,.1)' : 'transparent',
                    borderColor:  active ? 'rgba(255,107,53,.45)' : 'rgba(255,255,255,.1)',
                    color:        active ? '#FF6B35' : 'rgba(240,234,214,.4)',
                    boxShadow:    active ? '0 0 18px rgba(255,107,53,.18)' : 'none',
                    transform:    active ? 'translateY(-2px)' : 'none',
                  }}
                >
                  <span>{a.icon}</span>
                  {a.label}
                </button>
              )
            })}
          </div>

          {/* Labs grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Add Lab Button */}
            {isOwner && (
              <div className="relative flex flex-col overflow-hidden border border-dashed border-white/[.2] hover:border-[#FF6B35] transition-all duration-300 group cursor-pointer">
                <CardActions
                  cardType="lab"
                  cardData={{ name:'', icon:'', color:'#FF6B35', rgb:'255,107,53', tagline:'', desc:'', area:'', capacity:'', timeline:'', equipment:[], suited:[], tier:'Core' }}
                  showAddButton={true}
                  showEditDelete={false}
                />
              </div>
            )}
            {labsData.map(lab => (
              <LabCard 
                key={lab._id} 
                lab={lab} 
                filtered={isFiltered(lab)}
                showEditDelete={true}
                isOwner={isOwner}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══ PROCESS ══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-12 py-20 border-b border-white/[.055]">
        <Atmosphere color="168,85,247" />

        <div className="relative z-[2] max-w-[1100px] mx-auto">
          <div className="flex items-end justify-between gap-10 flex-wrap mb-14">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-[7px] bg-[#FF6B35]/[.07] border border-[#FF6B35]/[.22] mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse" />
                <span className="text-[9px] font-bold tracking-[.42em] uppercase text-[#FF6B35]" style={syne}>
                  How It Works
                </span>
              </div>
              <span className="block leading-[.9]" style={{
                ...bebasNeue, fontSize: 'clamp(36px,5.5vw,60px)',
                WebkitTextStroke: '1px rgba(240,234,214,.35)', color: 'transparent',
              }}>FROM VISIT</span>
              <span className="block leading-[.9] text-[#FF6B35]" style={{
                ...bebasNeue, fontSize: 'clamp(36px,5.5vw,60px)',
                textShadow: '0 0 30px rgba(255,107,53,.35)',
              }}>TO LIVE LAB</span>
              <div className="w-14 h-px mt-5" style={{ background: 'linear-gradient(90deg,#FF6B35,transparent)' }} />
            </div>
            <p className="font-light text-[#F0EAD6]/40 max-w-[320px] text-[13px] leading-[1.7]" style={dmSans}>
              Every lab we build follows the same proven 5-step process — transparent, on-schedule, and fully documented.
            </p>
          </div>

          <div className="max-w-[680px]">
            {processData.map((step, i) => (
              <ProcessStep 
                key={step._id} 
                step={step} 
                isLast={i === processData.length - 1}
                isOwner={isOwner}
                onEdit={() => console.log('Edit process step')}
                onDelete={() => deleteCard(step._id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHY US ═══════════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-12 py-20 border-b border-white/[.055]">
        <Atmosphere />
        <div className="relative z-[2] max-w-[1100px] mx-auto">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-[7px] bg-[#FF6B35]/[.07] border border-[#FF6B35]/[.22] mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse" />
              <span className="text-[9px] font-bold tracking-[.42em] uppercase text-[#FF6B35]" style={syne}>
                Why Nimo Labs
              </span>
            </div>
            <span className="block leading-[.9]" style={{
              ...bebasNeue, fontSize: 'clamp(36px,5.5vw,60px)',
              WebkitTextStroke: '1px rgba(240,234,214,.35)', color: 'transparent',
            }}>WHAT MAKES</span>
            <span className="block leading-[.9] text-[#FF6B35]" style={{
              ...bebasNeue, fontSize: 'clamp(36px,5.5vw,60px)',
              textShadow: '0 0 30px rgba(255,107,53,.35)',
            }}>US DIFFERENT</span>
            <div className="w-14 h-px mt-5" style={{ background: 'linear-gradient(90deg,#FF6B35,transparent)' }} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {whyUsData.map(item => (
              <WhyCard 
                key={item._id} 
                item={item}
                isOwner={isOwner}
                onEdit={() => console.log('Edit why us')}
                onDelete={() => deleteCard(item._id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══ PACKAGES ═════════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-12 py-20 border-b border-white/[.055]">
        <Atmosphere color="0,245,255" />
        <div className="relative z-[2] max-w-[1100px] mx-auto">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-[7px] bg-[#FF6B35]/[.07] border border-[#FF6B35]/[.22] mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse" />
              <span className="text-[9px] font-bold tracking-[.42em] uppercase text-[#FF6B35]" style={syne}>
                Pricing
              </span>
            </div>
            <span className="block leading-[.9]" style={{
              ...bebasNeue, fontSize: 'clamp(36px,5.5vw,60px)',
              WebkitTextStroke: '1px rgba(240,234,214,.35)', color: 'transparent',
            }}>LAB</span>
            <span className="block leading-[.9] text-[#FF6B35]" style={{
              ...bebasNeue, fontSize: 'clamp(36px,5.5vw,60px)',
              textShadow: '0 0 30px rgba(255,107,53,.35)',
            }}>PACKAGES</span>
            <div className="w-14 h-px mt-5" style={{ background: 'linear-gradient(90deg,#FF6B35,transparent)' }} />
          </div>
          <div className="mb-8">
            {isOwner && (
              <CardActions
                cardType="package"
                showAddButton={true}
                onCardAdded={loadPackages}
              />
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {packagesData.map(pkg => (
              <PackageCard 
                key={pkg._id} 
                pkg={pkg}
                isOwner={isOwner}
                refreshPackages={loadPackages}
              />
            ))}
          </div>
          <p className="text-center text-[11px] font-light text-[#F0EAD6]/25 mt-6 leading-[1.6]" style={dmSans}>
            All prices are indicative. Final quote depends on lab type, area, equipment selection, and location.
            Government and bulk institution pricing available on request.
          </p>
        </div>
      </section>

      {/* ══ CLOSING CTA ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-12 py-24">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse,rgba(255,107,53,.09) 0%,transparent 70%)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,107,53,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,107,53,.018) 1px,transparent 1px)',
          backgroundSize: '48px 48px',
        }} />

        <div className="relative z-[2] max-w-[1100px] mx-auto text-center">
          <div className="h-[1.5px] mb-10"
            style={{ background: 'linear-gradient(90deg,transparent,#FF6B35,#A855F7,transparent)' }} />
          <div className="inline-flex items-center gap-2 px-3.5 py-[7px] bg-[#FF6B35]/[.07] border border-[#FF6B35]/[.22] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse" />
            <span className="text-[9px] font-bold tracking-[.42em] uppercase text-[#FF6B35]" style={syne}>
              Free Site Assessment
            </span>
          </div>
          <span className="block leading-[.88]" style={{
            ...bebasNeue, fontSize: 'clamp(40px,7vw,80px)',
            WebkitTextStroke: '1px rgba(240,234,214,.35)', color: 'transparent',
          }}>READY TO BUILD</span>
          <span className="block leading-[.88] text-[#FF6B35]" style={{
            ...bebasNeue, fontSize: 'clamp(40px,7vw,80px)',
            textShadow: '0 0 50px rgba(255,107,53,.4)',
          }}>YOUR LAB?</span>
          <div className="w-14 h-px mx-auto my-7"
            style={{ background: 'linear-gradient(90deg,transparent,#FF6B35,transparent)' }} />
          <p className="font-light text-[#F0EAD6]/45 max-w-[500px] mx-auto mb-10 leading-[1.9]"
            style={{ ...dmSans, fontSize: 'clamp(13px,1.3vw,15px)' }}>
            Book a free site assessment. Our team visits your campus, evaluates your space, and delivers a
            detailed proposal — no commitment required.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link to="/lab-setup/enquire"
              className="text-[10px] font-bold tracking-[.32em] uppercase text-white bg-[#FF6B35] px-9 py-4 no-underline shadow-[0_0_24px_rgba(255,107,53,.28)] hover:bg-[#ff8040] hover:shadow-[0_0_44px_rgba(255,107,53,.5)] hover:-translate-y-px transition-all duration-300 inline-block"
              style={syne}>Book a Site Visit</Link>
            <a href="mailto:labs@nimolabs.in"
              className="text-[10px] font-semibold tracking-[.32em] uppercase text-[#F0EAD6]/50 bg-white/[.03] border border-white/10 px-9 py-4 no-underline hover:border-[#00F5FF] hover:text-[#00F5FF] hover:bg-[#00F5FF]/[.04] transition-all duration-300 inline-block"
              style={syne}>Email Us →</a>
          </div>
        </div>
      </section>
    </main>
  )
}
