import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ScrollVideoSection1   from '../components/ScrollVideoSection1'
import ScrollVideoSection2   from '../components/ScrollVideoSection2'
import ScrollVideoSection3   from '../components/ScrollVideoSection3'
import ChapterVideoGallery   from '../components/ChapterVideoGallery'
import ChapterPhotoGallery   from '../components/ChapterPhotoGallery'
import ChapterHeader        from '../components/ChapterHeader'
import AddChapterButton     from '../components/AddChapterButton'
import EditableText         from '../components/EditableText'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const DEFAULT_CHAPTERS = [
  { chapterId: 'ch1', order: 1 },
  { chapterId: 'ch2', order: 2 },
  { chapterId: 'ch3', order: 3 },
]

const bebasNeue = { fontFamily: "'Bebas Neue', sans-serif" }
const syne      = { fontFamily: "'Syne', sans-serif" }
const dmSans    = { fontFamily: "'DM Sans', sans-serif" }

const chapterIndex = [
  { num: '01', title: 'Build',    sub: 'Chassis · Drive · Power',      color: '#FF6B35', rgb: '255,107,53' },
  { num: '02', title: 'Connect',  sub: 'Sensors · Wireless · Control',  color: '#00F5FF', rgb: '0,245,255'  },
  { num: '03', title: 'Automate', sub: 'Vision · AI · Autonomy',        color: '#A855F7', rgb: '168,85,247' },
]

// ── Chapter 1 — videos ─────────────────────────────────────────────
const ch1Videos = [
  { id:'c1-v1', src:'/Nimo-videos/WhatsApp Video 2026-06-05 at 9.18.15 PM.mp4', title:'Nimo Build 1', tag:'Mechanical Build', color:'#FF6B35', rgb:'255,107,53', duration:'0:45' },
  { id:'c1-v2', src:'/Nimo-videos/WhatsApp Video 2026-06-05 at 9.18.20 PM.mp4', title:'Nimo Build 2', tag:'Electronics', color:'#FF6B35', rgb:'255,107,53', duration:'0:52' },
  { id:'c1-v3', src:'/Nimo-videos/WhatsApp Video 2026-06-05 at 9.18.25 PM.mp4', title:'Nimo Build 3', tag:'Embedded Systems', color:'#FF006E', rgb:'255,0,110', duration:'0:38' },
  { id:'c1-v4', src:'/Nimo-videos/WhatsApp Video 2026-06-05 at 9.18.25 PM (1).mp4', title:'Nimo Build 4', tag:'Circuit Design', color:'#FF6B35', rgb:'255,107,53', duration:'0:41' },
  { id:'c1-v5', src:'/Nimo-videos/WhatsApp Video 2026-06-05 at 9.18.27 PM.mp4', title:'Nimo Build 5', tag:'Testing & Debug', color:'#00F5FF', rgb:'0,245,255', duration:'0:55' },
  { id:'c1-v6', src:'/Nimo-videos/WhatsApp Video 2026-06-05 at 9.18.27 PM (1).mp4', title:'Nimo Build 6', tag:'Hardware Engineering', color:'#A855F7', rgb:'168,85,247', duration:'0:47' },
]

// ── Chapter 1 — photos ─────────────────────────────────────────────
const ch1Photos = [
  { id:'c1-p1',  src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.01 PM.jpeg', caption:'Chassis Assembly', tag:'Mechanical' },
  { id:'c1-p2',  src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.01 PM (1).jpeg', caption:'Framework Build', tag:'Electronics' },
  { id:'c1-p3',  src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.01 PM (2).jpeg', caption:'Electronics Setup', tag:'Prototyping' },
  { id:'c1-p4',  src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.11 PM.jpeg', caption:'Motor Configuration', tag:'PCB Design' },
  { id:'c1-p5',  src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.12 PM.jpeg', caption:'Sensor Array', tag:'Firmware' },
  { id:'c1-p6',  src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.12 PM (1).jpeg', caption:'PCB Layout Review', tag:'Testing' },
  { id:'c1-p7',  src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.15 PM.jpeg', caption:'Wiring Integration', tag:'Iteration' },
  { id:'c1-p8',  src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.15 PM (1).jpeg', caption:'Power Distribution', tag:'Showcase' },
]

// ── Chapter 2 — videos ─────────────────────────────────────────────
const ch2Videos = [
  { id:'c2-v1', src:'/Nimo-videos/WhatsApp Video 2026-06-05 at 9.18.31 PM.mp4', title:'Sensor Array Rig', tag:'Sensor Fusion', color:'#00F5FF', rgb:'0,245,255', duration:'0:50' },
  { id:'c2-v2', src:'/Nimo-videos/WhatsApp Video 2026-06-05 at 9.18.31 PM (1).mp4', title:'PID Tuning Demo', tag:'Motor Control', color:'#FF6B35', rgb:'255,107,53', duration:'0:43' },
  { id:'c2-v3', src:'/Nimo-videos/WhatsApp Video 2026-06-05 at 9.18.32 PM.mp4', title:'ESP-NOW Latency Test', tag:'Wireless Link', color:'#A855F7', rgb:'168,85,247', duration:'0:39' },
  { id:'c2-v4', src:'/Nimo-videos/WhatsApp Video 2026-06-05 at 9.18.32 PM (1).mp4', title:'Live MQTT Dashboard', tag:'IoT Cloud', color:'#00F5FF', rgb:'0,245,255', duration:'0:48' },
]

// ── Chapter 2 — photos ─────────────────────────────────────────────
const ch2Photos = [
  { id:'c2-p1',  src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.25 PM.jpeg', caption:'Testing Phase', tag:'Hardware' },
  { id:'c2-p2',  src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.27 PM.jpeg', caption:'Field Deployment', tag:'Control Loop' },
  { id:'c2-p3',  src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.27 PM (1).jpeg', caption:'Team Assembly', tag:'RF Engineering' },
  { id:'c2-p4',  src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.28 PM.jpeg', caption:'Performance Test', tag:'IoT' },
  { id:'c2-p5',  src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.29 PM.jpeg', caption:'Component Detail', tag:'Power Systems' },
  { id:'c2-p6',  src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.30 PM.jpeg', caption:'Final Build', tag:'Web UI' },
  { id:'c2-p7',  src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.33 PM.jpeg', caption:'Documentation', tag:'Field Testing' },
  { id:'c2-p8',  src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.35 PM.jpeg', caption:'Nimo in Action', tag:'Showcase' },
]

// ── Chapter 3 — videos ─────────────────────────────────────────────
const ch3Videos = [
]

// ── Chapter 3 — photos ─────────────────────────────────────────────
const ch3Photos = [
]

// ── Nimo Robots — videos ──────────────────────────────────────
const nimoVideos = [
  { id:'nimo-v1', src:'/Nimo-videos/WhatsApp Video 2026-06-05 at 9.18.15 PM.mp4', title:'Nimo Demo 1', tag:'Field Testing', color:'#FF6B35', rgb:'255,107,53', duration:'0:45' },
  { id:'nimo-v2', src:'/Nimo-videos/WhatsApp Video 2026-06-05 at 9.18.20 PM.mp4', title:'Nimo Demo 2', tag:'Performance', color:'#00F5FF', rgb:'0,245,255', duration:'0:52' },
  { id:'nimo-v3', src:'/Nimo-videos/WhatsApp Video 2026-06-05 at 9.18.25 PM.mp4', title:'Nimo Demo 3', tag:'Build', color:'#A855F7', rgb:'168,85,247', duration:'0:38' },
  { id:'nimo-v4', src:'/Nimo-videos/WhatsApp Video 2026-06-05 at 9.18.25 PM (1).mp4', title:'Nimo Demo 4', tag:'Integration', color:'#FF006E', rgb:'255,0,110', duration:'0:41' },
  { id:'nimo-v5', src:'/Nimo-videos/WhatsApp Video 2026-06-05 at 9.18.27 PM.mp4', title:'Nimo Demo 5', tag:'Testing', color:'#FF6B35', rgb:'255,107,53', duration:'0:55' },
  { id:'nimo-v6', src:'/Nimo-videos/WhatsApp Video 2026-06-05 at 9.18.27 PM (1).mp4', title:'Nimo Demo 6', tag:'Calibration', color:'#00F5FF', rgb:'0,245,255', duration:'0:47' },
  { id:'nimo-v7', src:'/Nimo-videos/WhatsApp Video 2026-06-05 at 9.18.31 PM.mp4', title:'Nimo Demo 7', tag:'Challenge', color:'#A855F7', rgb:'168,85,247', duration:'0:50' },
  { id:'nimo-v8', src:'/Nimo-videos/WhatsApp Video 2026-06-05 at 9.18.31 PM (1).mp4', title:'Nimo Demo 8', tag:'Showcase', color:'#FF006E', rgb:'255,0,110', duration:'0:43' },
  { id:'nimo-v9', src:'/Nimo-videos/WhatsApp Video 2026-06-05 at 9.18.32 PM.mp4', title:'Nimo Demo 9', tag:'Live Demo', color:'#FF6B35', rgb:'255,107,53', duration:'0:39' },
  { id:'nimo-v10', src:'/Nimo-videos/WhatsApp Video 2026-06-05 at 9.18.32 PM (1).mp4', title:'Nimo Demo 10', tag:'Final Run', color:'#00F5FF', rgb:'0,245,255', duration:'0:48' },
]

// ── Nimo Robots — photos ──────────────────────────────────────
const nimoPhotos = [
  { id:'nimo-p1',  src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.01 PM.jpeg', caption:'Nimo Build Process', tag:'Build' },
  { id:'nimo-p2',  src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.01 PM (1).jpeg', caption:'Chassis Assembly', tag:'Mechanical' },
  { id:'nimo-p3',  src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.01 PM (2).jpeg', caption:'Electronics Integration', tag:'Hardware' },
  { id:'nimo-p4',  src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.11 PM.jpeg', caption:'Motor Mounting', tag:'Drive System' },
  { id:'nimo-p5',  src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.12 PM.jpeg', caption:'Sensor Configuration', tag:'Perception' },
  { id:'nimo-p6',  src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.12 PM (1).jpeg', caption:'PCB Installation', tag:'Electronics' },
  { id:'nimo-p7',  src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.15 PM.jpeg', caption:'Wiring Details', tag:'Integration' },
  { id:'nimo-p8',  src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.15 PM (1).jpeg', caption:'Power System', tag:'Power' },
  { id:'nimo-p9',  src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.25 PM.jpeg', caption:'Quality Testing', tag:'Validation' },
  { id:'nimo-p10', src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.27 PM.jpeg', caption:'Field Deployment', tag:'Demo' },
  { id:'nimo-p11', src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.27 PM (1).jpeg', caption:'Team Collaboration', tag:'Team' },
  { id:'nimo-p12', src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.28 PM.jpeg', caption:'Performance Testing', tag:'Testing' },
  { id:'nimo-p13', src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.29 PM.jpeg', caption:'Component Details', tag:'Engineering' },
  { id:'nimo-p14', src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.30 PM.jpeg', caption:'Complete Assembly', tag:'Showcase' },
  { id:'nimo-p15', src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.33 PM.jpeg', caption:'Documentation', tag:'Records' },
  { id:'nimo-p16', src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.35 PM.jpeg', caption:'Nimo in Action', tag:'Live Demo' },
  { id:'nimo-p17', src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.35 PM (1).jpeg', caption:'Team Success', tag:'Milestone' },
  { id:'nimo-p18', src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.37 PM.jpeg', caption:'Assembly Review', tag:'Building' },
  { id:'nimo-p19', src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.41 PM.jpeg', caption:'Component Check', tag:'QA' },
  { id:'nimo-p20', src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.42 PM.jpeg', caption:'Debug Session', tag:'Testing' },
  { id:'nimo-p21', src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.43 PM.jpeg', caption:'Final Robot', tag:'Complete' },
  { id:'nimo-p22', src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.52 PM.jpeg', caption:'Side Profile', tag:'Design' },
  { id:'nimo-p23', src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.55 PM.jpeg', caption:'Top View', tag:'Layout' },
  { id:'nimo-p24', src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.55 PM (1).jpeg', caption:'Component Layout', tag:'Planning' },
  { id:'nimo-p25', src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.57 PM.jpeg', caption:'Final Assembly Check', tag:'Verification' },
  { id:'nimo-p26', src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.57 PM (1).jpeg', caption:'Quality Inspection', tag:'QC' },
  { id:'nimo-p27', src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.18.00 PM.jpeg', caption:'Ready for Deployment', tag:'Launch' },
  { id:'nimo-p28', src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.18.01 PM.jpeg', caption:'Test Environment', tag:'Testing' },
  { id:'nimo-p29', src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.18.02 PM.jpeg', caption:'Live Operation', tag:'Demo' },
  { id:'nimo-p30', src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.18.03 PM.jpeg', caption:'Success Moment', tag:'Achievement' },
  { id:'nimo-p31', src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.18.12 PM.jpeg', caption:'Team Celebration', tag:'Success' },
  { id:'nimo-p32', src:'/Nimo-images/WhatsApp Image 2026-06-05 at 9.18.35 PM.jpeg', caption:'Final Product', tag:'Complete' },
]



export default function RobotsPage() {
  const [chapters, setChapters] = useState(DEFAULT_CHAPTERS)
  const [loading, setLoading] = useState(true)

  // Fetch chapters on mount
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const res = await fetch(`${API_URL}/chapters`)
        const data = await res.json()
        if (data.success && data.chapters && data.chapters.length > 0) {
          setChapters(data.chapters.sort((a, b) => a.order - b.order))
        }
      } catch (error) {
        console.error('Error fetching chapters:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchChapters()
  }, [])

  // Recalculate ScrollTrigger positions as images, fonts, and DOM layout settle on page refresh
  useEffect(() => {
    const handleRefresh = () => {
      ScrollTrigger.sort()
      ScrollTrigger.refresh()
    }

    window.addEventListener('load', handleRefresh)
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(handleRefresh)
    }

    let resizeObserver
    if (typeof ResizeObserver !== 'undefined') {
      let timeoutId
      resizeObserver = new ResizeObserver(() => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(handleRefresh, 100)
      })
      resizeObserver.observe(document.body)
    }

    const t1 = setTimeout(handleRefresh, 150)
    const t2 = setTimeout(handleRefresh, 600)
    const t3 = setTimeout(handleRefresh, 1500)
    const t4 = setTimeout(handleRefresh, 3000)

    return () => {
      window.removeEventListener('load', handleRefresh)
      if (resizeObserver) resizeObserver.disconnect()
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [chapters])

  // Handle chapter deletion from UI
  const handleChapterDelete = useCallback((chapterId) => {
    setChapters(chapters.filter(ch => ch.chapterId !== chapterId))
  }, [chapters])

  useEffect(() => {
    const link = document.createElement('link')
    link.rel   = 'stylesheet'
    link.href  = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap'
    document.head.appendChild(link)
    return () => document.head.removeChild(link)
  }, [])

  return (
    <main className="bg-[#050508] text-[#F0EAD6] overflow-x-hidden" style={dmSans}>

      {/* ══ HERO ═════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-12 pt-[140px] pb-24 border-b border-white/[.055]">
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
          <div className="flex items-end justify-between gap-12 flex-wrap">
            <div className="max-w-[580px]">
              <div className="inline-flex items-center gap-2 px-3.5 py-[7px] bg-[#FF6B35]/[.07] border border-[#FF6B35]/[.22] mb-[22px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse" />
                <span className="text-[9px] font-bold tracking-[.4em] uppercase text-[#FF6B35]" style={syne}>
                  <EditableText contentId="robots.hero.badge">Nimo Labs · Robotics Program</EditableText>
                </span>
              </div>
              <div className="mb-5">
                <span className="block leading-[.88] tracking-[-0.01em]" style={{
                  ...bebasNeue, fontSize: 'clamp(56px,10vw,108px)',
                  WebkitTextStroke: '1px rgba(240,234,214,.35)', color: 'transparent',
                }}><EditableText contentId="robots.hero.title-line1">BUILD</EditableText></span>
                <span className="block leading-[.88] tracking-[-0.01em] text-[#FF6B35]" style={{
                  ...bebasNeue, fontSize: 'clamp(56px,10vw,108px)',
                  textShadow: '0 0 50px rgba(255,107,53,.35)',
                }}><EditableText contentId="robots.hero.title-line2">ROBOTS</EditableText></span>
                <span className="block mt-2 font-bold tracking-[.2em] uppercase text-[#00F5FF]"
                  style={{ ...syne, fontSize: 'clamp(12px,1.6vw,17px)' }}>
                  <EditableText contentId="robots.hero.subtitle">From Circuit To Autonomous Machine</EditableText>
                </span>
              </div>
              <div className="w-14 h-px mb-6" style={{ background: 'linear-gradient(90deg,#FF6B35,transparent)' }} />
              <p className="font-light leading-[1.8] text-[#F0EAD6]/50 max-w-[440px] mb-8 tracking-[.02em]"
                style={{ ...dmSans, fontSize: 'clamp(13px,1.3vw,15px)' }}>
                <EditableText contentId="robots.hero.description">A three-chapter deep-dive into robotics engineering. Hardware, firmware, and intelligence — everything you need to take an idea from a blank PCB to a fully autonomous machine.</EditableText>
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link to="/book"
                  className="text-[10px] font-bold tracking-[.32em] uppercase text-white bg-[#FF6B35] px-7 py-3.5 no-underline shadow-[0_0_24px_rgba(255,107,53,.25)] hover:bg-[#ff8040] hover:shadow-[0_0_40px_rgba(255,107,53,.5)] hover:-translate-y-px transition-all duration-300 inline-block"
                  style={syne}><EditableText contentId="robots.hero.cta-primary">Book a Workshop</EditableText></Link>
                <Link to="/training"
                  className="text-[10px] font-semibold tracking-[.32em] uppercase text-[#F0EAD6]/50 bg-white/[.03] border border-white/10 px-7 py-3.5 no-underline hover:border-[#00F5FF] hover:text-[#00F5FF] hover:bg-[#00F5FF]/[.04] transition-all duration-300 inline-block"
                  style={syne}><EditableText contentId="robots.hero.cta-secondary">View Courses</EditableText></Link>
              </div>
            </div>

            {/* Chapter index cards */}
            <div className="flex flex-col gap-3 flex-shrink-0">
              {chapterIndex.map((ch) => (
                <div key={ch.num}
                  className="relative flex items-center gap-5 px-6 py-4 bg-white/[.03] border border-white/[.07] min-w-[260px] overflow-hidden group">
                  <div className="absolute left-0 top-0 bottom-0 w-[2px]" style={{ background: ch.color }} />
                  <div className="leading-none flex-shrink-0"
                    style={{ ...bebasNeue, fontSize: '2rem', color: ch.color }}>{ch.num}</div>
                  <div>
                    <div className="text-[13px] font-bold" style={syne}>{ch.title}</div>
                    <div className="text-[10px] font-light text-[#F0EAD6]/35 mt-0.5 tracking-[.04em]" style={dmSans}>
                      {ch.sub}
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ borderBottom: `1px solid rgba(${ch.rgb},.4)`, borderRight: `1px solid rgba(${ch.rgb},.4)` }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ OWNER CONTROLS ═══════════════════════════════════════════ */}
      <section className="px-12 py-12 bg-gradient-to-r from-white/[.05] to-white/[.02] border-b border-white/[.055]">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2" style={syne}><EditableText contentId="robots.manage.title">📚 Manage Your Chapters</EditableText></h2>
              <p className="text-base text-white/60" style={dmSans}><EditableText contentId="robots.manage.description">Create new chapters or edit existing ones to organize your robotics content</EditableText></p>
            </div>
            <div className="flex-shrink-0">
              <AddChapterButton />
            </div>
          </div>
        </div>
      </section>

      {/* ══ CHAPTER SECTIONS - Dynamically rendered ════════════════ */}
      {chapters.length === 0 && !loading && <p className="text-center text-white/50 py-8">No chapters available</p>}
      
      {chapters.find(ch => ch.chapterId === 'ch1') && (
        <>
          <ChapterHeader color="#FF6B35" label="Chapter One · Build · Chassis · Electronics · Firmware" chapterId="ch1" onChapterDelete={handleChapterDelete} />
          <ScrollVideoSection1 />
          <ChapterVideoGallery
            videos={nimoVideos.slice(0, 6)}
            chapter="Chapter One"
            chapterKey="ch1"
            sectionTitle={['OUR BUILDS', 'SPEAK LOUDEST']}
            sectionSub="Chassis · Electronics · Firmware · Real Student Work"
            chapterColor="#FF6B35"
            chapterRgb="255,107,53"
            stats={[
              { num: '6', label: 'Build Videos', color: '#FF6B35' },
              { num: '8', label: 'PCB Details', color: '#00F5FF' },
              { num: '100%', label: 'Student-Made', color: '#A855F7' },
            ]}
          />
          <ChapterPhotoGallery
            photos={nimoPhotos.slice(0, 8)}
            chapter="Chapter One"
            chapterKey="ch1"
            sectionTitle={['BUILT WITH', 'BARE HANDS']}
            sectionSub="Lab Sessions · Soldering · Assembly · Prototype Days"
            chapterColor="#FF6B35"
            chapterRgb="255,107,53"
          />
        </>
      )}

      {chapters.find(ch => ch.chapterId === 'ch2') && (
        <>
          <ChapterHeader color="#00F5FF" label="Chapter Two · Connect · Sensors · Wireless · Power" chapterId="ch2" onChapterDelete={handleChapterDelete} />
          <ScrollVideoSection2 />
          <ChapterVideoGallery
            videos={nimoVideos.slice(4, 10)}
            chapter="Chapter Two"
            chapterKey="ch2"
            sectionTitle={['WIRED IN,', 'SWITCHED ON']}
            sectionSub="Sensor Fusion · Wireless · IoT · Live Demos"
            chapterColor="#00F5FF"
            chapterRgb="0,245,255"
            stats={[
              { num: '6', label: 'Connection Tests', color: '#00F5FF' },
              { num: '4', label: 'Protocols', color: '#FF6B35' },
              { num: '3×', label: 'Performance Gain', color: '#A855F7' },
            ]}
          />
          <ChapterPhotoGallery
            photos={nimoPhotos.slice(8, 16)}
            chapter="Chapter Two"
            chapterKey="ch2"
            sectionTitle={['EVERY SIGNAL', 'COUNTS']}
            sectionSub="Sensor Rigs · Field Tests · Dashboard Sessions"
            chapterColor="#00F5FF"
            chapterRgb="0,245,255"
          />
        </>
      )}

      {chapters.find(ch => ch.chapterId === 'ch3') && (
        <>
          <ChapterHeader color="#A855F7" label="Chapter Three · Automate · Vision · Edge AI · Capstone" chapterId="ch3" onChapterDelete={handleChapterDelete} />
          <ScrollVideoSection3 />
          <ChapterVideoGallery
            videos={nimoVideos}
            chapter="Chapter Three"
            chapterKey="ch3"
            sectionTitle={['INTELLIGENT.', 'AUTONOMOUS.']}
            sectionSub="Computer Vision · Path Planning · Edge AI · Capstone"
            chapterColor="#A855F7"
            chapterRgb="168,85,247"
            stats={[
              { num: '10', label: 'Demo Videos', color: '#A855F7' },
              { num: '6', label: 'AI Models', color: '#FF6B35' },
              { num: '0', label: 'Cloud Dependency', color: '#00F5FF' },
            ]}
          />
          <ChapterPhotoGallery
            photos={nimoPhotos.slice(16, 32)}
            chapter="Chapter Three"
            chapterKey="ch3"
            sectionTitle={['MACHINES THAT', 'THINK FOR THEMSELVES']}
            sectionSub="Vision Labs · Algorithm Boards · Competition Day"
            chapterColor="#A855F7"
            chapterRgb="168,85,247"
          />
        </>
      )}

      {/* ══ CLOSING CTA ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-12 py-24 border-t border-white/[.055]">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,107,53,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,107,53,.02) 1px,transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(0,0,0,.055) 3px,rgba(0,0,0,.055) 4px)',
        }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse,rgba(255,107,53,.08) 0%,transparent 70%)' }} />

        <div className="relative z-[2] max-w-[1100px] mx-auto">
          <div className="h-[1.5px] mb-12"
            style={{ background: 'linear-gradient(90deg,#FF6B35,#A855F7,transparent)' }} />
          <div className="flex items-center justify-between gap-12 flex-wrap">
            <div>
              <div className="text-[9px] font-bold tracking-[.4em] uppercase text-[#FF6B35] mb-4" style={syne}>
                Ready to Build?
              </div>
              <h2 className="leading-[.9] tracking-[-0.01em] mb-4"
                style={{ ...bebasNeue, fontSize: 'clamp(32px,5vw,60px)' }}>
                Three chapters.<br />
                <span style={{ color: '#FF6B35', textShadow: '0 0 30px rgba(255,107,53,.3)' }}>
                  One complete engineer.
                </span>
              </h2>
              <p className="font-light leading-[1.8] text-[#F0EAD6]/45 max-w-[460px]"
                style={{ ...dmSans, fontSize: 'clamp(13px,1.2vw,15px)' }}>
                Enroll in the full Robotics Program or book a custom workshop
                for your school or college. Seats are limited every cohort.
              </p>
            </div>
            <div className="flex flex-col gap-3 flex-shrink-0">
              <Link to="/book"
                className="text-[10px] font-bold tracking-[.32em] uppercase text-white bg-[#FF6B35] px-10 py-4 no-underline shadow-[0_0_24px_rgba(255,107,53,.25)] hover:bg-[#ff8040] hover:shadow-[0_0_40px_rgba(255,107,53,.5)] hover:-translate-y-px transition-all duration-300 text-center inline-block"
                style={syne}>Book a Workshop →</Link>
              <Link to="/training"
                className="text-[10px] font-semibold tracking-[.32em] uppercase text-[#F0EAD6]/45 bg-white/[.03] border border-white/10 px-10 py-4 no-underline hover:border-[#00F5FF] hover:text-[#00F5FF] hover:bg-[#00F5FF]/[.04] transition-all duration-300 text-center inline-block"
                style={syne}>Explore Courses →</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
