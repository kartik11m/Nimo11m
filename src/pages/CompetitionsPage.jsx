import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useOwnerAuth } from '../context/OwnerAuthContext'
import CardActions from '../components/CardActions'

const bebasNeue = { fontFamily: "'Bebas Neue', sans-serif" }
const syne      = { fontFamily: "'Syne', sans-serif" }
const dmSans    = { fontFamily: "'DM Sans', sans-serif" }

// ══ DATA ══════════════════════════════════════════════════════════
const competitions = [
  {
    id: 'wro',
    name: 'World Robot Olympiad',
    shortName: 'WRO',
    icon: '🤖',
    color: '#FF6B35', rgb: '255,107,53',
    tagline: 'Building robots that compete on the world stage.',
    description: 'WRO is the largest robotics competition globally. Nimo Labs teams have competed at state, national, and international levels since 2021 — designing, programming, and fielding autonomous robots that solve real-world problem themes.',
    stats: { entries: 28, awards: 22, national: 5, international: 2 },
    years: [2021, 2022, 2023, 2024, 2025],
    achievements: [
      {
        id: 'wro-1',
        year: 2024,
        event: 'WRO India National Championship',
        award: 'First Place',
        medal: 'gold',
        level: 'National',
        category: 'Regular Category — Senior',
        students: [
          { name: 'Aanya Verma',    age: 16, city: 'Bhopal'  },
          { name: 'Rohan Kulkarni', age: 17, city: 'Indore'  },
        ],
        project: 'Smart Waste Segregation Robot',
        projectDesc: 'An autonomous robot using computer vision and a conveyor mechanism to sort dry, wet, and recyclable waste at 94% accuracy — addressing India\'s urban solid waste challenge.',
        img: '/images/competitions/wro-2024-national.jpg',
        video: '/videos/competitions/wro-2024.mp4',
        quote: 'We built this in six weeks. Every failure was a lesson. Every lesson made the robot better.',
        quoteBy: 'Aanya Verma',
      },
      {
        id: 'wro-2',
        year: 2024,
        event: 'WRO Asia-Pacific Open',
        award: 'Third Place',
        medal: 'bronze',
        level: 'International',
        category: 'Future Innovators',
        students: [
          { name: 'Divya Nair',  age: 18, city: 'Bhopal' },
          { name: 'Kabir Singh', age: 17, city: 'Bhopal' },
        ],
        project: 'AquaGuard — Water Quality Monitor',
        projectDesc: 'Sensor-fused water quality monitoring robot with pH, turbidity, and dissolved oxygen sensors, transmitting data to a live cloud dashboard.',
        img: '/images/competitions/wro-2024-asia.jpg',
        video: '/videos/competitions/wro-2024-asia.mp4',
        quote: 'Competing internationally showed us exactly where to improve.',
        quoteBy: 'Divya Nair',
      },
      {
        id: 'wro-3',
        year: 2023,
        event: 'WRO MP State Championship',
        award: 'First Place',
        medal: 'gold',
        level: 'State',
        category: 'Regular Category — Elementary',
        students: [
          { name: 'Priya Sharma', age: 14, city: 'Bhopal' },
          { name: 'Arjun Patel',  age: 13, city: 'Bhopal' },
        ],
        project: 'Bridge Bot — Structural Inspection Robot',
        projectDesc: 'A climbing robot designed to inspect bridge structural integrity, using ultrasonic sensors to detect cracks and hollow spots in concrete pillars.',
        img: '/images/competitions/wro-2023-state.jpg',
        video: null,
        quote: 'We were the youngest team at state. We still won.',
        quoteBy: 'Priya Sharma',
      },
    ],
    photos: [
      { id:'wp1', src:'/images/competitions/wro-gallery-1.jpg', caption:'National finals, 2024',            tag:'WRO 2024' },
      { id:'wp2', src:'/images/competitions/wro-gallery-2.jpg', caption:'Asia-Pacific open preparation',    tag:'WRO 2024' },
      { id:'wp3', src:'/images/competitions/wro-gallery-3.jpg', caption:'Team debug session, 2023',          tag:'WRO 2023' },
      { id:'wp4', src:'/images/competitions/wro-gallery-4.jpg', caption:'State championship award ceremony', tag:'WRO 2023' },
    ],
  },

  {
    id: 'tye',
    name: 'TiE Young Entrepreneurs',
    shortName: 'TYE',
    icon: '💡',
    color: '#00F5FF', rgb: '0,245,255',
    tagline: 'Where student engineers become student founders.',
    description: 'TYE is an entrepreneurship competition where students develop a business plan around a real product. Nimo Labs students have pitched robotics and IoT ventures to panels of investors, winning regional and national recognition.',
    stats: { entries: 14, awards: 9, national: 2, international: 0 },
    years: [2022, 2023, 2024],
    achievements: [
      {
        id: 'tye-1',
        year: 2024,
        event: 'TYE India — National Finale',
        award: 'Runner-Up',
        medal: 'silver',
        level: 'National',
        category: 'Hardware & DeepTech',
        students: [
          { name: 'Yash Tiwari',  age: 17, city: 'Bhopal'  },
          { name: 'Sneha Mishra', age: 16, city: 'Sehore'   },
          { name: 'Rahul Das',    age: 17, city: 'Bhopal'  },
        ],
        project: 'SafeSense — Industrial Safety Wearable',
        projectDesc: 'An IoT-enabled hard hat with real-time gas detection, fall sensing, and GPS — targeting India\'s 45-lakh factory worker market. Pitched as a ₹2.5Cr seed ask.',
        img: '/images/competitions/tye-2024-national.jpg',
        video: '/videos/competitions/tye-2024.mp4',
        quote: 'Building the tech was the easy part. Learning to pitch it — that changed everything.',
        quoteBy: 'Yash Tiwari',
      },
      {
        id: 'tye-2',
        year: 2023,
        event: 'TYE Bhopal Chapter — Regional Finals',
        award: 'First Place',
        medal: 'gold',
        level: 'Regional',
        category: 'EdTech & STEM',
        students: [
          { name: 'Aanya Verma',  age: 15, city: 'Bhopal' },
          { name: 'Kabir Singh',  age: 14, city: 'Bhopal' },
        ],
        project: 'RoboKit — Affordable Robotics Learning Kit',
        projectDesc: 'A ₹499 robotics starter kit targeting tier-2 school students, bundled with bilingual Hindi-English curriculum. 300 units pre-sold before competition day.',
        img: '/images/competitions/tye-2023.jpg',
        video: null,
        quote: 'We didn\'t just pitch a product. We pitched a movement.',
        quoteBy: 'Kabir Singh',
      },
    ],
    photos: [
      { id:'tp1', src:'/images/competitions/tye-gallery-1.jpg', caption:'Pitch rehearsal, national finale', tag:'TYE 2024' },
      { id:'tp2', src:'/images/competitions/tye-gallery-2.jpg', caption:'Product demo to judges',           tag:'TYE 2024' },
      { id:'tp3', src:'/images/competitions/tye-gallery-3.jpg', caption:'Regional championship win',        tag:'TYE 2023' },
    ],
  },

  {
    id: 'science',
    name: 'Science Exhibitions',
    shortName: 'SCI-EX',
    icon: '🔬',
    color: '#A855F7', rgb: '168,85,247',
    tagline: 'Applying science to solve the problems around us.',
    description: 'From district-level INSPIRE exhibitions to the National Children\'s Science Congress, Nimo Labs students present projects that blend robotics with real scientific investigation — consistently winning at state and national stages.',
    stats: { entries: 42, awards: 36, national: 6, international: 1 },
    years: [2021, 2022, 2023, 2024, 2025],
    achievements: [
      {
        id: 'sci-1',
        year: 2024,
        event: 'National Children\'s Science Congress',
        award: 'Best Project Award',
        medal: 'gold',
        level: 'National',
        category: 'Environment & Sustainable Development',
        students: [
          { name: 'Meera Joshi',   age: 15, city: 'Bhopal'  },
          { name: 'Aryan Gupta',   age: 16, city: 'Bhopal'  },
        ],
        project: 'SoilBot — Autonomous Soil Health Monitor',
        projectDesc: 'A solar-powered rover that autonomously samples soil moisture, NPK content, and pH across farmland — generating a field map for precision irrigation decisions.',
        img: '/images/competitions/science-2024-national.jpg',
        video: '/videos/competitions/science-2024.mp4',
        quote: 'Science without application is just theory. We wanted to build something a farmer could actually use.',
        quoteBy: 'Meera Joshi',
      },
      {
        id: 'sci-2',
        year: 2024,
        event: 'INSPIRE District Science Exhibition',
        award: 'First Place',
        medal: 'gold',
        level: 'District',
        category: 'Health & Hygiene',
        students: [
          { name: 'Riya Sharma', age: 14, city: 'Vidisha' },
        ],
        project: 'AutoSanitise — IoT Hand Sanitiser Compliance System',
        projectDesc: 'PIR + proximity sensor system that tracks hand sanitiser compliance in hospital wards, alerting staff with audio and dashboard notification on missed sanitisation events.',
        img: '/images/competitions/science-2024-district.jpg',
        video: null,
        quote: 'I built the prototype in a weekend. The science behind it took months to understand.',
        quoteBy: 'Riya Sharma',
      },
      {
        id: 'sci-3',
        year: 2023,
        event: 'MP State Science Exhibition',
        award: 'Second Place',
        medal: 'silver',
        level: 'State',
        category: 'Transport & Communication',
        students: [
          { name: 'Rohan Kulkarni', age: 16, city: 'Indore' },
          { name: 'Arjun Patel',    age: 15, city: 'Bhopal' },
        ],
        project: 'SmartCrossing — Adaptive Traffic Signal for Ambulances',
        projectDesc: 'ESP32-based system that detects ambulance sirens using ML audio classification and preemptively clears intersections — reducing average ambulance delay by 40% in simulation.',
        img: '/images/competitions/science-2023-state.jpg',
        video: '/videos/competitions/science-2023.mp4',
        quote: 'Every second an ambulance waits is a life at risk. We had to solve this.',
        quoteBy: 'Rohan Kulkarni',
      },
    ],
    photos: [
      { id:'sp1', src:'/images/competitions/science-gallery-1.jpg', caption:'National Congress project display',  tag:'SCI-EX 2024' },
      { id:'sp2', src:'/images/competitions/science-gallery-2.jpg', caption:'INSPIRE district award ceremony',    tag:'SCI-EX 2024' },
      { id:'sp3', src:'/images/competitions/science-gallery-3.jpg', caption:'State exhibition judging round',      tag:'SCI-EX 2023' },
      { id:'sp4', src:'/images/competitions/science-gallery-4.jpg', caption:'Lab prep session before nationals',   tag:'SCI-EX 2023' },
    ],
  },

  {
    id: 'drone',
    name: 'Drone Competitions',
    shortName: 'DRONE',
    icon: '🚁',
    color: '#FF006E', rgb: '255,0,110',
    tagline: 'Flying fast, flying smart, flying autonomous.',
    description: 'From FPV racing to autonomous mission competitions, Nimo Labs drone teams have pushed the limits of what students can build and fly. Our drone lab trains pilots and engineers simultaneously.',
    stats: { entries: 16, awards: 11, national: 3, international: 0 },
    years: [2023, 2024, 2025],
    achievements: [
      {
        id: 'drone-1',
        year: 2025,
        event: 'Drone Olympiad India — Autonomous Category',
        award: 'First Place',
        medal: 'gold',
        level: 'National',
        category: 'Autonomous Mission',
        students: [
          { name: 'Kabir Singh',  age: 18, city: 'Bhopal' },
          { name: 'Yash Tiwari', age: 17, city: 'Bhopal' },
          { name: 'Rahul Das',   age: 17, city: 'Bhopal' },
        ],
        project: 'PathFinder — Autonomous Search & Rescue Drone',
        projectDesc: 'A fully autonomous quadcopter with thermal imaging and A* pathfinding that locates and marks simulated missing-person positions in a disaster zone course.',
        img: '/images/competitions/drone-2025-national.jpg',
        video: '/videos/competitions/drone-2025.mp4',
        quote: 'When the drone found all three targets on the first run, we couldn\'t believe it. Six months of work paid off in 90 seconds.',
        quoteBy: 'Kabir Singh',
      },
      {
        id: 'drone-2',
        year: 2024,
        event: 'MP Drone Racing Championship',
        award: 'Second Place — FPV Racing',
        medal: 'silver',
        level: 'State',
        category: 'FPV Racing',
        students: [
          { name: 'Arjun Patel', age: 16, city: 'Bhopal' },
        ],
        project: 'Custom 5" FPV Racer — Carbon Frame Build',
        projectDesc: 'Self-built 5" FPV racing quadcopter with custom ESC tuning and Betaflight configuration. Completed the championship course in 38.4 seconds — state record for junior class.',
        img: '/images/competitions/drone-2024-racing.jpg',
        video: '/videos/competitions/drone-2024.mp4',
        quote: 'I built every part myself. The track doesn\'t care about your age.',
        quoteBy: 'Arjun Patel',
      },
    ],
    photos: [
      { id:'dp1', src:'/images/competitions/drone-gallery-1.jpg', caption:'Autonomous mission run, nationals',  tag:'Drone 2025' },
      { id:'dp2', src:'/images/competitions/drone-gallery-2.jpg', caption:'FPV race preparation',               tag:'Drone 2024' },
      { id:'dp3', src:'/images/competitions/drone-gallery-3.jpg', caption:'Team reviewing flight logs',         tag:'Drone 2025' },
    ],
  },

  {
    id: 'innovation',
    name: 'Innovation Challenges',
    shortName: 'INNOV',
    icon: '🏆',
    color: '#FF6B35', rgb: '255,107,53',
    tagline: 'Hackathons, sprints, and challenges that push limits.',
    description: 'Smart India Hackathon, ISRO Space Apps, and various corporate innovation challenges. Nimo Labs students regularly enter and win multi-day hackathons that require building real products under extreme time pressure.',
    stats: { entries: 31, awards: 19, national: 7, international: 3 },
    years: [2021, 2022, 2023, 2024, 2025],
    achievements: [
      {
        id: 'innov-1',
        year: 2024,
        event: 'Smart India Hackathon — Hardware Edition',
        award: 'Winner — Grand Finale',
        medal: 'gold',
        level: 'National',
        category: 'Health & Biomedical',
        students: [
          { name: 'Meera Joshi',   age: 16, city: 'Bhopal' },
          { name: 'Yash Tiwari',  age: 17, city: 'Bhopal' },
          { name: 'Sneha Mishra', age: 16, city: 'Sehore'  },
          { name: 'Rohan Kulkarni',age:17, city: 'Indore'  },
        ],
        project: 'NeoBreath — Neonatal Respiratory Monitor',
        projectDesc: '36-hour build: a low-cost respiratory rate and SpO₂ monitor for NICU wards in rural hospitals. Using ESP32, MAX30102 sensor, and a custom alert algorithm. Cost: ₹480 per unit.',
        img: '/images/competitions/sih-2024.jpg',
        video: '/videos/competitions/sih-2024.mp4',
        quote: '36 hours. 4 people. 1 device that could save premature babies. That\'s what Nimo Labs trains you for.',
        quoteBy: 'Meera Joshi',
      },
      {
        id: 'innov-2',
        year: 2024,
        event: 'NASA Space Apps Challenge',
        award: 'Global Nominee',
        medal: 'silver',
        level: 'International',
        category: 'Earth & Space',
        students: [
          { name: 'Aryan Gupta', age: 16, city: 'Bhopal' },
          { name: 'Divya Nair',  age: 18, city: 'Bhopal' },
          { name: 'Kabir Singh', age: 17, city: 'Bhopal' },
        ],
        project: 'CROPSAT — Satellite-Guided Crop Health Dashboard',
        projectDesc: 'A Raspberry Pi-based ground station + web dashboard that ingests Sentinel-2 satellite NDVI data and overlays it on local farm maps, providing actionable crop stress alerts.',
        img: '/images/competitions/nasa-2024.jpg',
        video: '/videos/competitions/nasa-2024.mp4',
        quote: 'We were competing against university teams from 50 countries. We were school kids from Bhopal.',
        quoteBy: 'Aryan Gupta',
      },
      {
        id: 'innov-3',
        year: 2023,
        event: 'ISRO Robotics Challenge',
        award: 'Second Place',
        medal: 'silver',
        level: 'National',
        category: 'Space Robotics',
        students: [
          { name: 'Aanya Verma', age: 15, city: 'Bhopal' },
          { name: 'Arjun Patel', age: 15, city: 'Bhopal' },
        ],
        project: 'Crater Explorer — Terrain-Adaptive Lunar Rover',
        projectDesc: 'A 6-wheel rocker-bogie chassis rover with obstacle detection and autonomous navigation — designed to traverse simulated lunar crater terrain for sample collection.',
        img: '/images/competitions/isro-2023.jpg',
        video: null,
        quote: 'ISRO engineers gave us feedback in person. That alone was worth everything.',
        quoteBy: 'Aanya Verma',
      },
    ],
    photos: [
      { id:'ip1', src:'/images/competitions/innov-gallery-1.jpg', caption:'SIH 2024 — 36 hour build',          tag:'SIH 2024'  },
      { id:'ip2', src:'/images/competitions/innov-gallery-2.jpg', caption:'NASA Space Apps team submission',    tag:'NASA 2024' },
      { id:'ip3', src:'/images/competitions/innov-gallery-3.jpg', caption:'ISRO rover terrain test',            tag:'ISRO 2023' },
      { id:'ip4', src:'/images/competitions/innov-gallery-4.jpg', caption:'Hackathon final presentation',       tag:'SIH 2024'  },
    ],
  },
]

// ── Aggregate stats ────────────────────────────────────────────────
const totalStats = {
  gold:          competitions.flatMap(c => c.achievements).filter(a => a.medal === 'gold').length,
  silver:        competitions.flatMap(c => c.achievements).filter(a => a.medal === 'silver').length,
  bronze:        competitions.flatMap(c => c.achievements).filter(a => a.medal === 'bronze').length,
  national:      competitions.reduce((s,c) => s + c.stats.national, 0),
  international: competitions.reduce((s,c) => s + c.stats.international, 0),
  totalAwards:   competitions.reduce((s,c) => s + c.stats.awards, 0),
}

// Hall of fame — students appearing in 2+ achievements
const allStudents = competitions.flatMap(c =>
  c.achievements.flatMap(a =>
    a.students.map(s => ({ ...s, competition: c.name, compColor: c.color, compRgb: c.rgb, project: a.project, award: a.award, medal: a.medal, year: a.year }))
  )
)
const studentMap = {}
allStudents.forEach(s => {
  if (!studentMap[s.name]) studentMap[s.name] = { ...s, wins: [] }
  studentMap[s.name].wins.push({ competition: s.competition, award: s.award, medal: s.medal, year: s.year, color: s.compColor, rgb: s.compRgb })
})
const hallOfFame = Object.values(studentMap)
  .filter(s => s.wins.length >= 2)
  .sort((a, b) => b.wins.length - a.wins.length)
  .slice(0, 6)

// ── Medal badge ────────────────────────────────────────────────────
const MEDAL = {
  gold:   { icon: '🥇', color: '#FFD700', rgb: '255,215,0',   label: 'Gold'   },
  silver: { icon: '🥈', color: '#C0C0C0', rgb: '192,192,192', label: 'Silver' },
  bronze: { icon: '🥉', color: '#CD7F32', rgb: '205,127,50',  label: 'Bronze' },
}

function MedalBadge({ type, size = 'sm' }) {
  const m = MEDAL[type]
  const big = size === 'lg'
  return (
    <div className="inline-flex items-center gap-1.5"
      style={{
        padding: big ? '5px 12px' : '3px 8px',
        background: `rgba(${m.rgb},.1)`,
        border: `1px solid rgba(${m.rgb},.35)`,
        boxShadow: `0 0 ${big ? 16 : 8}px rgba(${m.rgb},.3)`,
      }}>
      <span style={{ fontSize: big ? 16 : 12 }}>{m.icon}</span>
      <span className="font-bold uppercase" style={{
        ...syne,
        fontSize: big ? '9px' : '7px',
        letterSpacing: '.3em',
        color: m.color,
      }}>{m.label}</span>
    </div>
  )
}

function LevelBadge({ level, color, rgb }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 border"
      style={{ background: `rgba(${rgb},.08)`, borderColor: `rgba(${rgb},.28)` }}>
      <span className="w-[5px] h-[5px] rounded-full" style={{ background: color }} />
      <span className="text-[7px] font-bold tracking-[.35em] uppercase"
        style={{ ...syne, color }}>{level}</span>
    </div>
  )
}

// ── Achievement card ───────────────────────────────────────────────
function AchievementCard({ ach, color, rgb, isOwner, onEdit, onDelete }) {
  const [hov,      setHov]      = useState(false)
  const [expanded, setExpanded] = useState(false)
  const m = MEDAL[ach.medal]

  return (
    <div
      className="relative overflow-hidden flex flex-col"
      style={{
        background:  hov ? 'rgba(255,255,255,.045)' : 'rgba(255,255,255,.025)',
        border:      `1px solid ${hov ? `rgba(${rgb},.5)` : 'rgba(255,255,255,.07)'}`,
        boxShadow:   hov ? `0 0 40px rgba(${rgb},.16), 0 20px 48px rgba(0,0,0,.5)` : 'none',
        transform:   hov ? 'translateY(-5px)' : 'none',
        transition:  'all .45s cubic-bezier(.23,1,.32,1)',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {isOwner && (
        <div className="absolute top-3 right-3 z-20 flex gap-2">
          <button
            onClick={e => { e.stopPropagation(); onEdit?.(ach) }}
            className="w-7 h-7 rounded-full border border-white/15 bg-[#050508]/80 text-[11px] text-[#F0EAD6]/80 hover:border-[#FF6B35] hover:text-[#FF6B35] transition-all"
            title="Edit achievement"
          >✎</button>
          <button
            onClick={e => { e.stopPropagation(); onDelete?.(ach) }}
            className="w-7 h-7 rounded-full border border-white/15 bg-[#050508]/80 text-[11px] text-[#F0EAD6]/80 hover:border-red-400 hover:text-red-400 transition-all"
            title="Delete achievement"
          >🗑</button>
        </div>
      )}

      {/* Medal glow strip */}
      <div className="absolute top-0 left-0 right-0 h-[3px]"
        style={{ background: `linear-gradient(90deg,${m.color},${color},transparent)` }} />
      {/* Corner TL */}
      <div className="absolute top-0 left-0 w-6 h-6"
        style={{ borderTop: `1px solid ${color}`, borderLeft: `1px solid ${color}`, opacity: hov ? 1 : 0, transition: 'opacity .3s' }} />
      {/* Corner BR */}
      <div className="absolute bottom-0 right-0 w-6 h-6"
        style={{ borderBottom: `1px solid rgba(${rgb},.35)`, borderRight: `1px solid rgba(${rgb},.35)`, opacity: hov ? 1 : 0, transition: 'opacity .3s' }} />

      {/* Photo */}
      {ach.img && (
        <div className="relative overflow-hidden flex-shrink-0" style={{ height: 180 }}>
          <img src={ach.img} alt={ach.project}
            className="w-full h-full object-cover"
            style={{ transform: hov ? 'scale(1.05)' : 'scale(1)', transition: 'transform .6s ease' }}
          />
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'linear-gradient(to top,rgba(5,5,8,.9) 0%,transparent 55%)',
          }} />
          {/* Year badge */}
          <div className="absolute top-3 left-3 z-10 px-2.5 py-1"
            style={{ background: 'rgba(5,5,8,.8)', border: `1px solid rgba(${rgb},.35)` }}>
            <span className="text-[8px] font-bold tracking-[.3em]"
              style={{ ...syne, color }}>{ach.year}</span>
          </div>
          {/* Level badge */}
          <div className="absolute top-3 right-3 z-10">
            <LevelBadge level={ach.level} color={color} rgb={rgb} />
          </div>
        </div>
      )}

      {/* Body */}
      <div className="flex flex-col flex-1 p-6">
        {/* Medal + award */}
        <div className="flex items-center gap-3 flex-wrap mb-4">
          <MedalBadge type={ach.medal} size="sm" />
          <span className="text-[8px] font-bold tracking-[.28em] uppercase text-[#F0EAD6]/35" style={syne}>
            {ach.category}
          </span>
        </div>

        {/* Project name */}
        <h3 className="leading-[1.1] mb-1.5 transition-colors duration-300"
          style={{ ...bebasNeue, fontSize: 'clamp(18px,2vw,24px)', color: hov ? color : '#F0EAD6' }}>
          {ach.project}
        </h3>

        {/* Event */}
        <div className="text-[10px] font-light text-[#F0EAD6]/35 mb-4 tracking-[.04em]" style={dmSans}>
          {ach.event}
        </div>

        {/* Students */}
        <div className="flex flex-wrap gap-2 mb-4">
          {ach.students.map(s => (
            <div key={s.name}
              className="flex items-center gap-2 px-3 py-1.5"
              style={{ background: `rgba(${rgb},.07)`, border: `1px solid rgba(${rgb},.2)` }}>
              <div className="w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: `rgba(${rgb},.15)`, color, ...syne }}>
                {s.name.charAt(0)}
              </div>
              <span className="text-[10px] font-bold text-[#F0EAD6]/75" style={syne}>{s.name}</span>
              <span className="text-[8px] font-light text-[#F0EAD6]/30" style={dmSans}>Age {s.age}</span>
            </div>
          ))}
        </div>

        {/* Project desc — expandable */}
        <div>
          <p className={`text-[12px] font-light text-[#F0EAD6]/50 leading-[1.75] ${!expanded ? 'line-clamp-2' : ''}`}
            style={dmSans}>
            {ach.projectDesc}
          </p>
          <button
            className="mt-2 text-[8px] font-bold tracking-[.3em] uppercase border-none bg-transparent cursor-pointer transition-colors duration-200"
            style={{ ...syne, color: `rgba(${rgb},.6)`, padding: 0 }}
            onClick={() => setExpanded(e => !e)}
            onMouseEnter={e => e.currentTarget.style.color = color}
            onMouseLeave={e => e.currentTarget.style.color = `rgba(${rgb},.6)`}
          >
            {expanded ? 'Show less ↑' : 'Read more →'}
          </button>
        </div>

        {/* Quote */}
        {ach.quote && (
          <div className="mt-5 pt-4 border-t border-white/[.055]">
            <p className="text-[11px] font-light text-[#F0EAD6]/45 leading-[1.7] italic mb-1.5" style={dmSans}>
              "{ach.quote}"
            </p>
            <div className="text-[8px] font-bold tracking-[.28em] uppercase" style={{ ...syne, color }}>
              — {ach.quoteBy}
            </div>
          </div>
        )}

        {/* Video CTA */}
        {ach.video && (
          <div className="mt-4">
            <button
              className="inline-flex items-center gap-2 text-[8px] font-bold tracking-[.3em] uppercase border px-4 py-2 cursor-pointer transition-all duration-200"
              style={{
                ...syne,
                borderColor: `rgba(${rgb},.3)`,
                color,
                background: `rgba(${rgb},.06)`,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = `rgba(${rgb},.14)`; e.currentTarget.style.boxShadow = `0 0 14px rgba(${rgb},.22)` }}
              onMouseLeave={e => { e.currentTarget.style.background = `rgba(${rgb},.06)`; e.currentTarget.style.boxShadow = 'none' }}
            >
              <span>▶</span> Watch Video
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Photo tile ───────────────────────────────────────────────────
function PhotoTile({ photo, index, color, rgb, isOwner, onEditPhoto, onDeletePhoto, onOpen }) {
  const [hov, setHov] = useState(false)

  return (
    <div
      className="relative overflow-hidden cursor-pointer aspect-square"
      style={{
        border: `1px solid ${hov ? `rgba(${rgb},.5)` : 'rgba(255,255,255,.07)'}`,
        transform: hov ? 'scale(1.03)' : 'scale(1)',
        boxShadow: hov ? `0 0 24px rgba(${rgb},.2)` : 'none',
        transition: 'all .4s cubic-bezier(.23,1,.32,1)',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onOpen(index)}
    >
      {isOwner && (
        <div className="absolute top-2 right-2 z-20 flex gap-1">
          <button
            onClick={e => { e.stopPropagation(); onEditPhoto?.(photo, index) }}
            className="w-7 h-7 rounded-full border border-white/15 bg-[#050508]/80 text-[11px] text-[#F0EAD6]/80 hover:border-[#FF6B35] hover:text-[#FF6B35] transition-all"
            title="Edit photo"
          >✎</button>
          <button
            onClick={e => { e.stopPropagation(); onDeletePhoto?.(index) }}
            className="w-7 h-7 rounded-full border border-white/15 bg-[#050508]/80 text-[11px] text-[#F0EAD6]/80 hover:border-red-400 hover:text-red-400 transition-all"
            title="Delete photo"
          >🗑</button>
        </div>
      )}
      <img src={photo.src} alt={photo.caption}
        className="w-full h-full object-cover"
        style={{ transform: hov ? 'scale(1.08)' : 'scale(1)', transition: 'transform .5s ease' }}
      />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: hov ? 'linear-gradient(to top,rgba(5,5,8,.8) 0%,transparent 60%)' : 'rgba(5,5,8,.25)' }} />
      <div className="absolute top-0 left-0 right-0 h-[1.5px]"
        style={{ background: color, transform: hov ? 'scaleX(1)' : 'scaleX(0)', transformOrigin:'left', transition:'transform .35s ease' }} />
      <div className="absolute bottom-0 left-0 right-0 px-3 py-2 z-10"
        style={{ opacity: hov ? 1 : 0, transition: 'opacity .3s ease' }}>
        <div className="text-[7px] font-bold tracking-[.3em] uppercase mb-0.5"
          style={{ ...syne, color }}>{photo.tag}</div>
        <div className="text-[10px] font-light text-[#F0EAD6]/75" style={dmSans}>{photo.caption}</div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center z-10"
        style={{ opacity: hov ? 1 : 0, transition: 'opacity .3s ease' }}>
        <div className="w-8 h-8 flex items-center justify-center"
          style={{ background: `rgba(${rgb},.18)`, border: `1px solid rgba(${rgb},.5)` }}>
          <span className="text-xs">⊕</span>
        </div>
      </div>
    </div>
  )
}

// ── Photo strip ────────────────────────────────────────────────────
function PhotoStrip({ photos, color, rgb, isOwner, onEditPhoto, onDeletePhoto }) {
  const [lightbox, setLightbox] = useState(null)
  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {photos.map((photo, i) => (
          <PhotoTile
            key={photo.id || `${photo.src}-${i}`}
            photo={photo}
            index={i}
            color={color}
            rgb={rgb}
            isOwner={isOwner}
            onEditPhoto={onEditPhoto}
            onDeletePhoto={onDeletePhoto}
            onOpen={setLightbox}
          />
        ))}
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-[950] flex items-center justify-center bg-[#050508]/97 backdrop-blur-2xl p-8"
          onClick={() => setLightbox(null)}>
          <div className="relative max-w-3xl w-full" onClick={e => e.stopPropagation()}>
            <div className="h-[2px] mb-0" style={{ background: `linear-gradient(90deg,${color},transparent)` }} />
            <img src={photos[lightbox].src} alt={photos[lightbox].caption}
              className="w-full block" style={{ maxHeight: '70vh', objectFit: 'cover' }} />
            <div className="flex items-center justify-between px-5 py-3 bg-white/[.03] border-x border-b border-white/[.07]">
              <div>
                <div className="text-[7px] font-bold tracking-[.35em] uppercase mb-0.5" style={{ ...syne, color }}>
                  {photos[lightbox].tag}
                </div>
                <div className="text-[13px] font-bold text-[#F0EAD6]/85" style={syne}>
                  {photos[lightbox].caption}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setLightbox(l => (l - 1 + photos.length) % photos.length)}
                  className="w-8 h-8 flex items-center justify-center border border-white/10 text-[#F0EAD6]/50 hover:border-[#FF6B35] hover:text-[#FF6B35] bg-transparent cursor-pointer transition-all">‹</button>
                <button onClick={() => setLightbox(l => (l + 1) % photos.length)}
                  className="w-8 h-8 flex items-center justify-center border border-white/10 text-[#F0EAD6]/50 hover:border-[#FF6B35] hover:text-[#FF6B35] bg-transparent cursor-pointer transition-all">›</button>
                <button onClick={() => setLightbox(null)}
                  className="w-8 h-8 flex items-center justify-center border border-white/10 text-[#F0EAD6]/50 hover:border-[#FF6B35] hover:text-[#FF6B35] bg-transparent cursor-pointer transition-all">✕</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// ── Competition section ────────────────────────────────────────────
function CompetitionSection({ comp, isOwner, refreshCompetitions, page }) {
  const { updateCard } = useOwnerAuth()
  const sectionId = comp.id || comp._id
  const [achievementDraft, setAchievementDraft] = useState(null)
  const [photoDraft, setPhotoDraft] = useState(null)

  const saveCompetitionUpdate = async (updatedData) => {
    if (!comp._id) return
    const { _id, ...cardData } = comp
    await updateCard(comp._id, { ...cardData, ...updatedData })
    await refreshCompetitions?.()
  }

  const openAchievementEditor = (achievement = null, index = null) => {
    setAchievementDraft({
      index,
      item: {
        id: achievement?.id || `ach-${Date.now()}`,
        year: achievement?.year || new Date().getFullYear(),
        event: achievement?.event || '',
        award: achievement?.award || '',
        medal: achievement?.medal || 'gold',
        level: achievement?.level || 'National',
        category: achievement?.category || '',
        students: achievement?.students || [],
        project: achievement?.project || '',
        projectDesc: achievement?.projectDesc || '',
        img: achievement?.img || '',
        video: achievement?.video || '',
        quote: achievement?.quote || '',
        quoteBy: achievement?.quoteBy || '',
      },
    })
  }

  const saveAchievement = async (e) => {
    e.preventDefault()
    const currentAchievements = Array.isArray(comp.achievements) ? [...comp.achievements] : []
    const nextAchievements = [...currentAchievements]
    if (achievementDraft.index === null || achievementDraft.index === undefined) {
      nextAchievements.push(achievementDraft.item)
    } else {
      nextAchievements[achievementDraft.index] = achievementDraft.item
    }
    await saveCompetitionUpdate({ achievements: nextAchievements })
    setAchievementDraft(null)
  }

  const handleAchievementImageSelection = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      setAchievementDraft(prev => prev ? ({ ...prev, item: { ...prev.item, img: result } }) : prev)
    }
    reader.readAsDataURL(file)
  }

  const deleteAchievement = async (achievement) => {
    const currentAchievements = Array.isArray(comp.achievements) ? [...comp.achievements] : []
    const nextAchievements = currentAchievements.filter(item => item.id !== achievement.id)
    await saveCompetitionUpdate({ achievements: nextAchievements })
  }

  const openPhotoEditor = (photo = null, index = null) => {
    setPhotoDraft({
      index,
      item: {
        id: photo?.id || `photo-${Date.now()}`,
        src: photo?.src || '',
        caption: photo?.caption || '',
        tag: photo?.tag || '',
      },
    })
  }

  const savePhoto = async (e) => {
    e.preventDefault()
    const currentPhotos = Array.isArray(comp.photos) ? [...comp.photos] : []
    const nextPhotos = [...currentPhotos]
    if (photoDraft.index === null || photoDraft.index === undefined) {
      nextPhotos.push(photoDraft.item)
    } else {
      nextPhotos[photoDraft.index] = photoDraft.item
    }
    await saveCompetitionUpdate({ photos: nextPhotos })
    setPhotoDraft(null)
  }

  const handlePhotoFileSelection = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : ''
      setPhotoDraft(prev => prev ? ({ ...prev, item: { ...prev.item, src: result } }) : prev)
    }
    reader.readAsDataURL(file)
  }

  const deletePhoto = async (index) => {
    const currentPhotos = Array.isArray(comp.photos) ? [...comp.photos] : []
    const nextPhotos = currentPhotos.filter((_, i) => i !== index)
    await saveCompetitionUpdate({ photos: nextPhotos })
  }

  return (
    <section
      id={sectionId}
      className="relative overflow-hidden border-b border-white/[.055]"
      style={{ borderTop: `2px solid rgba(${comp.rgb},.3)` }}
    >
      {/* Section atmosphere */}
      <div className="absolute -top-[80px] -right-[40px] w-[500px] h-[380px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(ellipse,rgba(${comp.rgb},.1) 0%,transparent 70%)` }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(${comp.rgb},.018) 1px,transparent 1px),linear-gradient(90deg,rgba(${comp.rgb},.018) 1px,transparent 1px)`,
        backgroundSize: '48px 48px',
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(0,0,0,.055) 3px,rgba(0,0,0,.055) 4px)',
      }} />

      <div className="relative z-[2] max-w-[1100px] mx-auto px-12 py-20">
        {isOwner && comp._id && (
          <div className="absolute top-6 right-6 z-20">
            <CardActions
              cardType="competition"
              cardId={comp._id}
              cardData={comp}
              showEditDelete={true}
              page={page}
              onCardAdded={refreshCompetitions}
              onCardDeleted={refreshCompetitions}
            />
          </div>
        )}

        {/* ── Section header ── */}
        <div className="flex items-start justify-between gap-10 flex-wrap mb-14">
          <div className="max-w-[580px]">
            {/* Competition identity */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-14 h-14 flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: `rgba(${comp.rgb},.1)`, border: `1px solid rgba(${comp.rgb},.3)` }}>
                {comp.icon}
              </div>
              <div>
                <div className="text-[8px] font-bold tracking-[.4em] uppercase mb-0.5"
                  style={{ ...syne, color: comp.color }}>{comp.shortName}</div>
                <div className="text-[8px] font-bold tracking-[.28em] uppercase text-[#F0EAD6]/[.22]"
                  style={syne}>{comp.years[0]}–{comp.years[comp.years.length - 1]}</div>
              </div>
            </div>

            <div>
              <span className="block leading-[.88]" style={{
                ...bebasNeue,
                fontSize: 'clamp(32px,5vw,60px)',
                WebkitTextStroke: '1px rgba(240,234,214,.35)',
                color: 'transparent',
              }}>
                {comp.name.split(' ').slice(0, Math.ceil(comp.name.split(' ').length/2)).join(' ')}
              </span>
              <span className="block leading-[.88]" style={{
                ...bebasNeue,
                fontSize: 'clamp(32px,5vw,60px)',
                color: comp.color,
                textShadow: `0 0 30px rgba(${comp.rgb},.38)`,
              }}>
                {comp.name.split(' ').slice(Math.ceil(comp.name.split(' ').length/2)).join(' ')}
              </span>
            </div>

            <div className="w-12 h-px my-5"
              style={{ background: `linear-gradient(90deg,${comp.color},transparent)` }} />

            <p className="font-light leading-[1.8] text-[#F0EAD6]/50 text-[13px]" style={dmSans}>
              {comp.description}
            </p>
          </div>

          {/* Stats card */}
          <div className="relative bg-white/[.03] border border-white/[.07] p-7 flex-shrink-0">
            <div className="absolute top-0 left-0 w-6 h-6"
              style={{ borderTop: `1px solid ${comp.color}`, borderLeft: `1px solid ${comp.color}` }} />
            <div className="absolute bottom-0 right-0 w-6 h-6"
              style={{ borderBottom: '1px solid rgba(168,85,247,.45)', borderRight: '1px solid rgba(168,85,247,.45)' }} />
            <div className="absolute top-0 left-0 right-0 h-[1.5px]"
              style={{ background: `linear-gradient(90deg,${comp.color},transparent)` }} />

            <div className="grid grid-cols-2 gap-5">
              {[
                { num: comp.stats.entries, label: 'Entries',       color: comp.color },
                { num: comp.stats.awards,  label: 'Awards Won',    color: '#FFD700'  },
                { num: comp.stats.national,label: 'National',      color: '#00F5FF'  },
                { num: comp.stats.international, label:'International', color:'#A855F7' },
              ].map(s => (
                <div key={s.label} className="text-center">
                  <div className="leading-none mb-0.5" style={{ ...bebasNeue, fontSize:'1.8rem', color: s.color }}>{s.num}</div>
                  <div className="text-[7px] font-bold tracking-[.3em] uppercase text-[#F0EAD6]/[.25]" style={syne}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Year dots */}
            <div className="mt-5 pt-4 border-t border-white/[.07]">
              <div className="text-[7px] font-bold tracking-[.38em] uppercase text-[#F0EAD6]/[.25] mb-2.5" style={syne}>
                Active Since
              </div>
              <div className="flex items-center gap-0">
                {comp.years.map((yr, i) => (
                  <div key={yr} className="flex items-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-2 h-2 rounded-full"
                        style={{ background: comp.color, boxShadow: `0 0 6px rgba(${comp.rgb},.6)` }} />
                      <span className="text-[7px] font-light text-[#F0EAD6]/25" style={dmSans}>{yr}</span>
                    </div>
                    {i < comp.years.length - 1 && (
                      <div className="w-8 h-px mb-4" style={{ background: `rgba(${comp.rgb},.25)` }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Achievement cards ── */}
        <div className="mb-14">
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: comp.color, boxShadow: `0 0 8px rgba(${comp.rgb},.7)` }} />
              <span className="text-[8px] font-bold tracking-[.42em] uppercase"
                style={{ ...syne, color: comp.color }}>Achievements</span>
            </div>
            {isOwner && (
              <button
                onClick={() => openAchievementEditor()}
                className="px-3 py-1.5 text-[8px] font-bold tracking-[.3em] uppercase border border-white/10 bg-white/[.03] text-[#F0EAD6]/70 hover:border-[#FF6B35] hover:text-[#FF6B35] transition-all"
              >+ Add</button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(comp.achievements || []).map(ach => (
              <AchievementCard key={ach.id} ach={ach} color={comp.color} rgb={comp.rgb} isOwner={isOwner} onEdit={achievement => openAchievementEditor(achievement, (comp.achievements || []).findIndex(item => item.id === achievement.id))} onDelete={deleteAchievement} />
            ))}
          </div>
        </div>

        {/* ── Photo gallery ── */}
        <div>
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: comp.color, boxShadow: `0 0 8px rgba(${comp.rgb},.7)` }} />
              <span className="text-[8px] font-bold tracking-[.42em] uppercase"
                style={{ ...syne, color: comp.color }}>Photo Gallery</span>
              <span className="text-[9px] font-light text-[#F0EAD6]/25 ml-1" style={dmSans}>
                Click to expand
              </span>
            </div>
            {isOwner && (
              <button
                onClick={() => openPhotoEditor()}
                className="px-3 py-1.5 text-[8px] font-bold tracking-[.3em] uppercase border border-white/10 bg-white/[.03] text-[#F0EAD6]/70 hover:border-[#FF6B35] hover:text-[#FF6B35] transition-all"
              >+ Add</button>
            )}
          </div>
          <PhotoStrip photos={comp.photos || []} color={comp.color} rgb={comp.rgb} isOwner={isOwner} onEditPhoto={photo => openPhotoEditor(photo, (comp.photos || []).findIndex(item => item.id === photo.id))} onDeletePhoto={deletePhoto} />
        </div>

        {achievementDraft && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-white/10 bg-[#0a0a0d] p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">{achievementDraft.index === null || achievementDraft.index === undefined ? 'Add Achievement' : 'Edit Achievement'}</h3>
                <button onClick={() => setAchievementDraft(null)} className="text-sm text-[#F0EAD6]/50 hover:text-white">✕</button>
              </div>
              <form onSubmit={saveAchievement} className="space-y-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <input className="rounded border border-white/10 bg-white/10 px-3 py-2 text-sm text-white" value={achievementDraft.item.year || ''} onChange={e => setAchievementDraft(prev => ({ ...prev, item: { ...prev.item, year: e.target.value } }))} placeholder="Year" />
                  <input className="rounded border border-white/10 bg-white/10 px-3 py-2 text-sm text-white" value={achievementDraft.item.event || ''} onChange={e => setAchievementDraft(prev => ({ ...prev, item: { ...prev.item, event: e.target.value } }))} placeholder="Event" />
                  <input className="rounded border border-white/10 bg-white/10 px-3 py-2 text-sm text-white" value={achievementDraft.item.award || ''} onChange={e => setAchievementDraft(prev => ({ ...prev, item: { ...prev.item, award: e.target.value } }))} placeholder="Award" />
                  <select className="rounded border border-white/10 bg-white/10 px-3 py-2 text-sm text-white" value={achievementDraft.item.medal || 'gold'} onChange={e => setAchievementDraft(prev => ({ ...prev, item: { ...prev.item, medal: e.target.value } }))}>
                    <option value="gold">Gold</option>
                    <option value="silver">Silver</option>
                    <option value="bronze">Bronze</option>
                  </select>
                  <input className="rounded border border-white/10 bg-white/10 px-3 py-2 text-sm text-white" value={achievementDraft.item.level || ''} onChange={e => setAchievementDraft(prev => ({ ...prev, item: { ...prev.item, level: e.target.value } }))} placeholder="Level" />
                  <input className="rounded border border-white/10 bg-white/10 px-3 py-2 text-sm text-white" value={achievementDraft.item.category || ''} onChange={e => setAchievementDraft(prev => ({ ...prev, item: { ...prev.item, category: e.target.value } }))} placeholder="Category" />
                  <input className="rounded border border-white/10 bg-white/10 px-3 py-2 text-sm text-white" value={achievementDraft.item.project || ''} onChange={e => setAchievementDraft(prev => ({ ...prev, item: { ...prev.item, project: e.target.value } }))} placeholder="Project" />
                  <input className="rounded border border-white/10 bg-white/10 px-3 py-2 text-sm text-white" value={achievementDraft.item.img || ''} onChange={e => setAchievementDraft(prev => ({ ...prev, item: { ...prev.item, img: e.target.value } }))} placeholder="Image URL" />
                  <input className="rounded border border-white/10 bg-white/10 px-3 py-2 text-sm text-white" value={achievementDraft.item.video || ''} onChange={e => setAchievementDraft(prev => ({ ...prev, item: { ...prev.item, video: e.target.value } }))} placeholder="Video URL" />
                  <input className="rounded border border-white/10 bg-white/10 px-3 py-2 text-sm text-white" value={achievementDraft.item.quoteBy || ''} onChange={e => setAchievementDraft(prev => ({ ...prev, item: { ...prev.item, quoteBy: e.target.value } }))} placeholder="Quote By" />
                </div>
                {achievementDraft.item.img && (
                  <div className="overflow-hidden rounded border border-white/10 bg-white/5">
                    <img src={achievementDraft.item.img} alt="Achievement preview" className="max-h-48 w-full object-cover" />
                  </div>
                )}
                <div className="rounded border border-white/10 bg-white/5 p-3">
                  <label className="mb-2 block text-sm font-semibold text-white">Upload achievement image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAchievementImageSelection}
                    className="w-full text-sm text-[#F0EAD6]/70 file:mr-3 file:rounded file:border-0 file:bg-[#FF6B35] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
                  />
                  <p className="mt-2 text-[11px] text-[#F0EAD6]/45">You can also paste an image URL below if you prefer.</p>
                </div>
                <input className="w-full rounded border border-white/10 bg-white/10 px-3 py-2 text-sm text-white" value={achievementDraft.item.img || ''} onChange={e => setAchievementDraft(prev => ({ ...prev, item: { ...prev.item, img: e.target.value } }))} placeholder="Or paste image URL" />
                <textarea className="min-h-24 w-full rounded border border-white/10 bg-white/10 px-3 py-2 text-sm text-white" value={achievementDraft.item.projectDesc || ''} onChange={e => setAchievementDraft(prev => ({ ...prev, item: { ...prev.item, projectDesc: e.target.value } }))} placeholder="Project description" />
                <textarea className="min-h-20 w-full rounded border border-white/10 bg-white/10 px-3 py-2 text-sm text-white" value={achievementDraft.item.quote || ''} onChange={e => setAchievementDraft(prev => ({ ...prev, item: { ...prev.item, quote: e.target.value } }))} placeholder="Quote" />
                <textarea className="min-h-24 w-full rounded border border-white/10 bg-white/10 px-3 py-2 text-sm text-white" value={JSON.stringify(achievementDraft.item.students || [], null, 2)} onChange={e => {
                  try { const parsed = JSON.parse(e.target.value); setAchievementDraft(prev => ({ ...prev, item: { ...prev.item, students: parsed } })) }
                  catch { setAchievementDraft(prev => ({ ...prev, item: { ...prev.item, students: [] } })) }
                }} placeholder='Students JSON array, e.g. [{"name":"A","age":16,"city":"Bhopal"}]' />
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setAchievementDraft(null)} className="rounded border border-white/10 px-4 py-2 text-sm text-[#F0EAD6]/70">Cancel</button>
                  <button type="submit" className="rounded bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {photoDraft && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4">
            <div className="w-full max-w-lg rounded-xl border border-white/10 bg-[#0a0a0d] p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">{photoDraft.index === null || photoDraft.index === undefined ? 'Add Photo' : 'Edit Photo'}</h3>
                <button onClick={() => setPhotoDraft(null)} className="text-sm text-[#F0EAD6]/50 hover:text-white">✕</button>
              </div>
              <form onSubmit={savePhoto} className="space-y-3">
                {photoDraft.item.src && (
                  <div className="overflow-hidden rounded border border-white/10 bg-white/5">
                    <img src={photoDraft.item.src} alt="Preview" className="max-h-48 w-full object-cover" />
                  </div>
                )}
                <div className="rounded border border-white/10 bg-white/5 p-3">
                  <label className="mb-2 block text-sm font-semibold text-white">Upload from your computer</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoFileSelection}
                    className="w-full text-sm text-[#F0EAD6]/70 file:mr-3 file:rounded file:border-0 file:bg-[#FF6B35] file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
                  />
                  <p className="mt-2 text-[11px] text-[#F0EAD6]/45">You can also paste an image URL below if you prefer.</p>
                </div>
                <input className="w-full rounded border border-white/10 bg-white/10 px-3 py-2 text-sm text-white" value={photoDraft.item.src || ''} onChange={e => setPhotoDraft(prev => ({ ...prev, item: { ...prev.item, src: e.target.value } }))} placeholder="Or paste image URL" />
                <input className="w-full rounded border border-white/10 bg-white/10 px-3 py-2 text-sm text-white" value={photoDraft.item.caption || ''} onChange={e => setPhotoDraft(prev => ({ ...prev, item: { ...prev.item, caption: e.target.value } }))} placeholder="Caption" />
                <input className="w-full rounded border border-white/10 bg-white/10 px-3 py-2 text-sm text-white" value={photoDraft.item.tag || ''} onChange={e => setPhotoDraft(prev => ({ ...prev, item: { ...prev.item, tag: e.target.value } }))} placeholder="Tag" />
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setPhotoDraft(null)} className="rounded border border-white/10 px-4 py-2 text-sm text-[#F0EAD6]/70">Cancel</button>
                  <button type="submit" className="rounded bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  )
}

// ── Hall of Fame card ──────────────────────────────────────────────
function HallCard({ student, isOwner, onEdit, onDelete }) {
  const [hov, setHov] = useState(false)
  const topWin = student.wins?.[0] || { color: '#FF6B35', rgb: '255,107,53' }
  return (
    <div
      className="relative overflow-hidden p-6 cursor-default"
      style={{
        background:  hov ? `rgba(${topWin.rgb},.07)` : 'rgba(255,255,255,.025)',
        border:      `1px solid ${hov ? `rgba(${topWin.rgb},.45)` : 'rgba(255,255,255,.07)'}`,
        transform:   hov ? 'translateY(-5px)' : 'none',
        boxShadow:   hov ? `0 0 32px rgba(${topWin.rgb},.18)` : 'none',
        transition:  'all .4s cubic-bezier(.23,1,.32,1)',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {isOwner && (
        <div className="absolute right-3 top-3 z-20 flex gap-2">
          <button
            onClick={() => onEdit?.(student)}
            className="w-7 h-7 rounded-full border border-white/15 bg-[#050508]/80 text-[11px] text-[#F0EAD6]/80 hover:border-[#FF6B35] hover:text-[#FF6B35] transition-all"
            title="Edit hall of fame entry"
          >✎</button>
          <button
            onClick={() => onDelete?.(student)}
            className="w-7 h-7 rounded-full border border-white/15 bg-[#050508]/80 text-[11px] text-[#F0EAD6]/80 hover:border-red-400 hover:text-red-400 transition-all"
            title="Delete hall of fame entry"
          >🗑</button>
        </div>
      )}
      <div className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: topWin.color, transform: hov ? 'scaleX(1)' : 'scaleX(0)', transformOrigin:'left', transition:'transform .4s ease' }} />

      {/* Avatar */}
      <div className="w-12 h-12 flex items-center justify-center mb-4 text-xl font-bold"
        style={{ background: `rgba(${topWin.rgb},.12)`, border: `1px solid rgba(${topWin.rgb},.28)`, ...bebasNeue, color: topWin.color }}>
        {student.name?.charAt(0) || 'S'}
      </div>

      <div className="text-[15px] font-bold text-[#F0EAD6]/90 mb-0.5" style={syne}>{student.name}</div>
      <div className="text-[10px] font-light text-[#F0EAD6]/35 mb-4 tracking-[.04em]" style={dmSans}>
        {student.city} · Age {student.age}
      </div>

      {/* Win list */}
      <div className="space-y-2">
        {(student.wins || []).map((win, i) => (
          <div key={i} className="flex items-center gap-2">
            <span style={{ fontSize: 12 }}>{MEDAL[win.medal]?.icon || '🏅'}</span>
            <div>
              <div className="text-[9px] font-bold text-[#F0EAD6]/60 leading-tight" style={syne}>{win.award}</div>
              <div className="text-[8px] font-light text-[#F0EAD6]/30 tracking-[.03em]" style={dmSans}>
                {win.competition} · {win.year}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-white/[.06] flex items-center gap-2">
        <span className="leading-none" style={{ ...bebasNeue, fontSize:'1.4rem', color: topWin.color }}>
          {(student.wins || []).length}
        </span>
        <span className="text-[7px] font-bold tracking-[.32em] uppercase text-[#F0EAD6]/25" style={syne}>
          Career Wins
        </span>
      </div>
    </div>
  )
}

// ── Sticky competition nav ─────────────────────────────────────────
function StickyNav({ active, sections }) {
  return (
    <div
      className="hidden xl:flex fixed left-6 top-1/2 -translate-y-1/2 flex-col gap-3 z-[100]"
    >
      {sections.map(c => {
        const sectionId = c.id || c._id
        const isActive = active === sectionId
        return (
          <a
            key={sectionId}
            href={`#${sectionId}`}
            className="flex items-center gap-2 no-underline group"
            style={{ textDecoration:'none' }}
          >
            <div
              className="transition-all duration-300"
              style={{
                width:      isActive ? 24 : 6,
                height:     isActive ? 24 : 6,
                background:  isActive ? c.color : 'rgba(255,255,255,.2)',
                boxShadow:   isActive ? `0 0 10px rgba(${c.rgb},.7)` : 'none',
                display:     'flex',
                alignItems:  'center',
                justifyContent: 'center',
                fontSize:    10,
              }}
            >
              {isActive && c.icon}
            </div>
            <span
              className="transition-all duration-300 text-[8px] font-bold tracking-[.3em] uppercase whitespace-nowrap"
              style={{
                ...syne,
                color:   isActive ? c.color : 'transparent',
                opacity: isActive ? 1 : 0,
                maxWidth: isActive ? 120 : 0,
                overflow: 'hidden',
              }}
            >
              {c.shortName}
            </span>
          </a>
        )
      })}
    </div>
  )
}

// ── MAIN PAGE ─────────────────────────────────────────────────────
export default function CompetitionsPage() {
  const { getCards, addCard, isOwner, getPageContent, savePageContent } = useOwnerAuth()
  const [competitionsData, setCompetitionsData] = useState(competitions)
  const [activeSection, setActiveSection] = useState(competitions[0].id)
  const [hallOfFameEntries, setHallOfFameEntries] = useState([])
  const [hallDraft, setHallDraft] = useState(null)

  const seedCompetitionCards = useCallback(async () => {
    if (!isOwner) return false
    try {
      const existingCards = await getCards('competition', 'explore')
      if (Array.isArray(existingCards) && existingCards.length > 0) return true

      for (const comp of competitions) {
        await addCard('competition', { ...comp, years: comp.years, achievements: comp.achievements, photos: comp.photos }, 'explore')
      }
      return true
    } catch (err) {
      console.error('Failed to seed competition cards:', err)
      return false
    }
  }, [addCard, getCards, isOwner])

  const loadCompetitionCards = useCallback(async () => {
    try {
      const cards = await getCards('competition', 'explore')
      if (Array.isArray(cards) && cards.length > 0) {
        const normalized = cards
          .map(card => ({ _id: card._id, index: card.index, ...card.data }))
          .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
        setCompetitionsData(normalized)
        const firstSectionId = normalized[0]?.id || normalized[0]?._id || competitions[0].id
        if (!normalized.some(c => (c.id || c._id) === activeSection)) {
          setActiveSection(firstSectionId)
        }
        return
      }

      if (isOwner) {
        const seeded = await seedCompetitionCards()
        if (seeded) {
          const refreshedCards = await getCards('competition', 'explore')
          if (Array.isArray(refreshedCards) && refreshedCards.length > 0) {
            const normalized = refreshedCards
              .map(card => ({ _id: card._id, index: card.index, ...card.data }))
              .sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
            setCompetitionsData(normalized)
            return
          }
        }
      }

      setCompetitionsData(competitions)
    } catch (err) {
      console.error('Failed to load competition cards:', err)
      setCompetitionsData(competitions)
    }
  }, [activeSection, getCards, isOwner, seedCompetitionCards])

  useEffect(() => {
    loadCompetitionCards()
  }, [loadCompetitionCards])

  // IntersectionObserver to track active section
  useEffect(() => {
    const observers = competitionsData.map(comp => {
      const sectionId = comp.id || comp._id
      const el = document.getElementById(sectionId)
      if (!el) return null
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(sectionId) },
        { threshold: 0.3 }
      )
      obs.observe(el)
      return obs
    })
    return () => observers.forEach(o => o?.disconnect())
  }, [competitionsData])

  const totalStats = {
    gold: competitionsData.flatMap(c => c.achievements || []).filter(a => a.medal === 'gold').length,
    silver: competitionsData.flatMap(c => c.achievements || []).filter(a => a.medal === 'silver').length,
    bronze: competitionsData.flatMap(c => c.achievements || []).filter(a => a.medal === 'bronze').length,
    national: competitionsData.reduce((s, c) => s + (c.stats?.national || 0), 0),
    international: competitionsData.reduce((s, c) => s + (c.stats?.international || 0), 0),
    totalAwards: competitionsData.reduce((s, c) => s + (c.stats?.awards || 0), 0),
  }

  const allStudents = competitionsData.flatMap(c =>
    (c.achievements || []).flatMap(a =>
      (a.students || []).map(s => ({ ...s, competition: c.name, compColor: c.color, compRgb: c.rgb, project: a.project, award: a.award, medal: a.medal, year: a.year }))
    )
  )
  const studentMap = {}
  allStudents.forEach(s => {
    if (!studentMap[s.name]) studentMap[s.name] = { ...s, wins: [] }
    studentMap[s.name].wins.push({ competition: s.competition, award: s.award, medal: s.medal, year: s.year, color: s.compColor, rgb: s.compRgb })
  })
  const hallOfFame = hallOfFameEntries.length > 0
    ? hallOfFameEntries
    : Object.values(studentMap)
        .filter(s => s.wins.length >= 2)
        .sort((a, b) => b.wins.length - a.wins.length)
        .slice(0, 6)

  useEffect(() => {
    let active = true
    const loadHallOfFame = async () => {
      try {
        const entries = await getPageContent('explore')
        const savedEntry = entries.find(entry => entry.key === 'explore-hall-of-fame')
        if (!savedEntry || !active) return

        const parsed = typeof savedEntry.content === 'string' ? JSON.parse(savedEntry.content) : savedEntry.content
        if (Array.isArray(parsed)) {
          setHallOfFameEntries(parsed)
        }
      } catch (error) {
        console.error('Failed to load hall of fame entries', error)
      }
    }

    loadHallOfFame()
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (hallOfFameEntries.length > 0 || !competitionsData.length) return
    const derived = Object.values(studentMap)
      .filter(s => s.wins.length >= 2)
      .sort((a, b) => b.wins.length - a.wins.length)
      .slice(0, 6)
    setHallOfFameEntries(derived)
  }, [competitionsData, hallOfFameEntries.length, studentMap])

  const activeComp = competitionsData.find(c => (c.id || c._id) === activeSection)

  const openHallEditor = (student = null, index = null) => {
    setHallDraft({
      index,
      item: {
        name: student?.name || '',
        city: student?.city || '',
        age: student?.age || '',
        wins: student?.wins || [],
      },
    })
  }

  const saveHallEntry = async (e) => {
    e.preventDefault()
    const nextEntries = [...hallOfFameEntries]
    if (hallDraft.index === null || hallDraft.index === undefined) {
      nextEntries.push(hallDraft.item)
    } else {
      nextEntries[hallDraft.index] = hallDraft.item
    }
    setHallOfFameEntries(nextEntries)
    if (isOwner) {
      await savePageContent('explore', 'explore-hall-of-fame', nextEntries, 'Hall of fame entries')
    }
    setHallDraft(null)
  }

  const deleteHallEntry = async (student) => {
    const nextEntries = hallOfFameEntries.filter(item => item.name !== student.name || item.city !== student.city)
    setHallOfFameEntries(nextEntries)
    if (isOwner) {
      await savePageContent('explore', 'explore-hall-of-fame', nextEntries, 'Hall of fame entries')
    }
  }

  return (
    <main className="bg-[#050508] text-[#F0EAD6] overflow-x-hidden" style={dmSans}>

      {/* Sticky nav */}
      <StickyNav active={activeSection} sections={competitionsData} />

      {/* ══ HERO ════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-12 pt-[140px] pb-20 border-b border-white/[.055]">
        <div className="absolute -top-[100px] -left-[60px] w-[560px] h-[440px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse,rgba(255,107,53,.12) 0%,transparent 70%)' }} />
        <div className="absolute -bottom-[80px] -right-[40px] w-[500px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse,rgba(168,85,247,.1) 0%,transparent 70%)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,107,53,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,107,53,.022) 1px,transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(0,0,0,.055) 3px,rgba(0,0,0,.055) 4px)',
        }} />

        <div className="relative z-[2] max-w-[1100px] mx-auto">
          <div className="flex items-end justify-between gap-12 flex-wrap">

            {/* Left */}
            <div className="max-w-[600px]">
              <div className="inline-flex items-center gap-2 px-3.5 py-[7px] bg-[#FF6B35]/[.07] border border-[#FF6B35]/[.22] mb-[22px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse" />
                <span className="text-[9px] font-bold tracking-[.4em] uppercase text-[#FF6B35]" style={syne}>
                  Award Record · 2021–2025
                </span>
              </div>

              <div className="mb-5">
                <span className="block leading-[.88]" style={{
                  ...bebasNeue, fontSize: 'clamp(52px,10vw,104px)',
                  WebkitTextStroke: '1px rgba(240,234,214,.35)', color: 'transparent',
                }}>OUR</span>
                <span className="block leading-[.88] text-[#FF6B35]" style={{
                  ...bebasNeue, fontSize: 'clamp(52px,10vw,104px)',
                  textShadow: '0 0 50px rgba(255,107,53,.38)',
                }}>CHAMPIONS</span>
                <span className="block mt-2 font-bold tracking-[.18em] uppercase text-[#00F5FF]"
                  style={{ ...syne, fontSize: 'clamp(11px,1.5vw,16px)' }}>
                  WRO · TYE · Science · Drone · Innovation
                </span>
              </div>

              <div className="w-14 h-px mb-6" style={{ background:'linear-gradient(90deg,#FF6B35,transparent)' }} />
              <p className="font-light leading-[1.9] text-[#F0EAD6]/50 max-w-[500px]"
                style={{ ...dmSans, fontSize:'clamp(13px,1.3vw,15px)' }}>
                Real students. Real robots. Real stages. This is the record of
                every competition Nimo Labs teams have entered — every award,
                every project, every student who made it happen.
              </p>

              {/* Competition quick-nav */}
              <div className="flex flex-wrap gap-2 mt-8">
                {competitionsData.map(c => {
                  const sectionId = c.id || c._id
                  return (
                    <a key={sectionId} href={`#${sectionId}`}
                      className="inline-flex items-center gap-2 px-3.5 py-2 border no-underline transition-all duration-200"
                      style={{
                        background:  `rgba(${c.rgb},.07)`,
                        borderColor: `rgba(${c.rgb},.28)`,
                        ...syne, fontSize:'9px', fontWeight:700, letterSpacing:'.3em',
                        textTransform:'uppercase', color: c.color,
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background=`rgba(${c.rgb},.15)`; e.currentTarget.style.transform='translateY(-2px)' }}
                      onMouseLeave={e => { e.currentTarget.style.background=`rgba(${c.rgb},.07)`; e.currentTarget.style.transform='none' }}
                    >
                      <span>{c.icon}</span>{c.shortName}
                    </a>
                  )
                })}
              </div>
            </div>
            {isOwner && (
              <div className="mt-8">
                <CardActions
                  cardType="competition"
                  showAddButton={true}
                  page="explore"
                  onCardAdded={loadCompetitionCards}
                />
              </div>
            )}

            {/* Medal tally card */}
            <div className="relative bg-white/[.03] border border-white/[.07] p-8 flex-shrink-0">
              <div className="absolute top-0 left-0 w-7 h-7 border-t border-l border-[#FF6B35]" />
              <div className="absolute bottom-0 right-0 w-7 h-7 border-b border-r border-purple-500/50" />
              <div className="absolute top-0 left-0 right-0 h-[1.5px]"
                style={{ background:'linear-gradient(90deg,#FFD700,#C0C0C0,#CD7F32,transparent)' }} />

              <div className="text-[8px] font-bold tracking-[.42em] uppercase text-[#F0EAD6]/[.28] mb-5" style={syne}>
                Total Medal Tally
              </div>

              <div className="flex gap-6 mb-6">
                {[
                  { label:'Gold',   num: totalStats.gold,   color:'#FFD700', rgb:'255,215,0',   icon:'🥇' },
                  { label:'Silver', num: totalStats.silver, color:'#C0C0C0', rgb:'192,192,192', icon:'🥈' },
                  { label:'Bronze', num: totalStats.bronze, color:'#CD7F32', rgb:'205,127,50',  icon:'🥉' },
                ].map(m => (
                  <div key={m.label} className="text-center">
                    <div className="text-2xl mb-1">{m.icon}</div>
                    <div className="leading-none mb-0.5"
                      style={{ ...bebasNeue, fontSize:'2rem', color:m.color, textShadow:`0 0 14px rgba(${m.rgb},.6)` }}>
                      {m.num}
                    </div>
                    <div className="text-[7px] font-bold tracking-[.3em] uppercase text-[#F0EAD6]/25" style={syne}>
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/[.07] pt-5 space-y-3">
                {[
                  { label:'Total Awards',    num: totalStats.totalAwards,   color:'#FF6B35' },
                  { label:'National Wins',   num: totalStats.national,      color:'#00F5FF' },
                  { label:'International',   num: totalStats.international, color:'#A855F7' },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between">
                    <span className="text-[9px] font-bold tracking-[.28em] uppercase text-[#F0EAD6]/30" style={syne}>{s.label}</span>
                    <span className="leading-none" style={{ ...bebasNeue, fontSize:'1.4rem', color:s.color }}>{s.num}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ COMPETITION SECTIONS ══════════════════════════════════ */}
      {competitionsData.map(comp => (
        <CompetitionSection
          key={comp._id || comp.id}
          comp={comp}
          isOwner={isOwner}
          refreshCompetitions={loadCompetitionCards}
          page="explore"
        />
      ))}

      {/* ══ HALL OF FAME ══════════════════════════════════════════ */}
      {hallOfFame.length > 0 && (
        <section className="relative overflow-hidden px-12 py-20 border-b border-white/[.055]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
            style={{ background:'radial-gradient(ellipse,rgba(255,215,0,.06) 0%,transparent 70%)' }} />
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage:'linear-gradient(rgba(255,107,53,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,107,53,.018) 1px,transparent 1px)',
            backgroundSize:'48px 48px',
          }} />

          <div className="relative z-[2] max-w-[1100px] mx-auto">
            <div className="mb-12 flex items-end justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-[7px] bg-[#FF6B35]/[.07] border border-[#FF6B35]/[.22] mb-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse" />
                  <span className="text-[9px] font-bold tracking-[.42em] uppercase text-[#FF6B35]" style={syne}>
                    Multi-Competition Champions
                  </span>
                </div>
                <span className="block leading-[.9]" style={{
                  ...bebasNeue, fontSize:'clamp(36px,5.5vw,60px)',
                  WebkitTextStroke:'1px rgba(240,234,214,.35)', color:'transparent',
                }}>HALL OF</span>
                <span className="block leading-[.9] text-[#FF6B35]" style={{
                  ...bebasNeue, fontSize:'clamp(36px,5.5vw,60px)',
                  textShadow:'0 0 30px rgba(255,107,53,.35)',
                }}>FAME</span>
                <div className="w-14 h-px mt-5" style={{ background:'linear-gradient(90deg,#FF6B35,transparent)' }} />
              </div>
              {isOwner && (
                <button
                  onClick={() => openHallEditor()}
                  className="px-3 py-1.5 text-[8px] font-bold tracking-[.3em] uppercase border border-white/10 bg-white/[.03] text-[#F0EAD6]/70 hover:border-[#FF6B35] hover:text-[#FF6B35] transition-all"
                >+ Add</button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {hallOfFame.map((student, index) => (
                <HallCard
                  key={`${student.name}-${index}`}
                  student={student}
                  isOwner={isOwner}
                  onEdit={entry => openHallEditor(entry, index)}
                  onDelete={deleteHallEntry}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {hallDraft && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-xl border border-white/10 bg-[#0a0a0d] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-white">{hallDraft.index === null || hallDraft.index === undefined ? 'Add Hall of Fame Entry' : 'Edit Hall of Fame Entry'}</h3>
              <button onClick={() => setHallDraft(null)} className="text-sm text-[#F0EAD6]/50 hover:text-white">✕</button>
            </div>
            <form onSubmit={saveHallEntry} className="space-y-3">
              <input className="w-full rounded border border-white/10 bg-white/10 px-3 py-2 text-sm text-white" value={hallDraft.item.name || ''} onChange={e => setHallDraft(prev => ({ ...prev, item: { ...prev.item, name: e.target.value } }))} placeholder="Student name" />
              <input className="w-full rounded border border-white/10 bg-white/10 px-3 py-2 text-sm text-white" value={hallDraft.item.city || ''} onChange={e => setHallDraft(prev => ({ ...prev, item: { ...prev.item, city: e.target.value } }))} placeholder="City" />
              <input className="w-full rounded border border-white/10 bg-white/10 px-3 py-2 text-sm text-white" value={hallDraft.item.age || ''} onChange={e => setHallDraft(prev => ({ ...prev, item: { ...prev.item, age: e.target.value } }))} placeholder="Age" />
              <textarea className="min-h-24 w-full rounded border border-white/10 bg-white/10 px-3 py-2 text-sm text-white" value={JSON.stringify(hallDraft.item.wins || [], null, 2)} onChange={e => {
                try {
                  const parsed = JSON.parse(e.target.value)
                  setHallDraft(prev => ({ ...prev, item: { ...prev.item, wins: parsed } }))
                } catch {
                  setHallDraft(prev => ({ ...prev, item: { ...prev.item, wins: [] } }))
                }
              }} placeholder='Wins JSON array, e.g. [{"competition":"WRO","award":"First Place","medal":"gold","year":2024}]' />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setHallDraft(null)} className="rounded border border-white/10 px-4 py-2 text-sm text-[#F0EAD6]/70">Cancel</button>
                <button type="submit" className="rounded bg-[#FF6B35] px-4 py-2 text-sm font-semibold text-white">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══ CLOSING CTA ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-12 py-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[360px] rounded-full pointer-events-none"
          style={{ background:'radial-gradient(ellipse,rgba(255,107,53,.09) 0%,transparent 70%)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage:'linear-gradient(rgba(255,107,53,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,107,53,.018) 1px,transparent 1px)',
          backgroundSize:'48px 48px',
        }} />
        <div className="relative z-[2] max-w-[1100px] mx-auto text-center">
          <div className="h-[1.5px] mb-10"
            style={{ background:'linear-gradient(90deg,transparent,#FF6B35,#A855F7,transparent)' }} />
          <div className="inline-flex items-center gap-2 px-3.5 py-[7px] bg-[#FF6B35]/[.07] border border-[#FF6B35]/[.22] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse" />
            <span className="text-[9px] font-bold tracking-[.42em] uppercase text-[#FF6B35]" style={syne}>
              Your Name Could Be Here
            </span>
          </div>
          <span className="block leading-[.88]" style={{
            ...bebasNeue, fontSize:'clamp(38px,7vw,76px)',
            WebkitTextStroke:'1px rgba(240,234,214,.35)', color:'transparent',
          }}>COMPETE AT THE</span>
          <span className="block leading-[.88] text-[#FF6B35]" style={{
            ...bebasNeue, fontSize:'clamp(38px,7vw,76px)',
            textShadow:'0 0 50px rgba(255,107,53,.4)',
          }}>HIGHEST LEVEL</span>
          <div className="w-14 h-px mx-auto my-7"
            style={{ background:'linear-gradient(90deg,transparent,#FF6B35,transparent)' }} />
          <p className="font-light text-[#F0EAD6]/45 max-w-[500px] mx-auto mb-10 leading-[1.9]"
            style={{ ...dmSans, fontSize:'clamp(13px,1.3vw,15px)' }}>
            Every student on this page started with zero experience.
            They came to Nimo Labs, built real skills, and went out and
            won on national stages. Enroll and let's get your name here.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link to="/training"
              className="text-[10px] font-bold tracking-[.32em] uppercase text-white bg-[#FF6B35] px-9 py-4 no-underline shadow-[0_0_24px_rgba(255,107,53,.28)] hover:bg-[#ff8040] hover:shadow-[0_0_44px_rgba(255,107,53,.55)] hover:-translate-y-px transition-all duration-300 inline-block"
              style={syne}>Start Training</Link>
            <Link to="/book"
              className="text-[10px] font-semibold tracking-[.32em] uppercase text-[#F0EAD6]/50 bg-white/[.03] border border-white/10 px-9 py-4 no-underline hover:border-[#00F5FF] hover:text-[#00F5FF] hover:bg-[#00F5FF]/[.04] transition-all duration-300 inline-block"
              style={syne}>Book Workshop →</Link>
          </div>
        </div>
      </section>

    </main>
  )
}
