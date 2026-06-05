import { useState, useRef, useEffect, useCallback } from 'react'

const bebasNeue = { fontFamily: "'Bebas Neue', sans-serif" }
const syne      = { fontFamily: "'Syne', sans-serif" }
const dmSans    = { fontFamily: "'DM Sans', sans-serif" }

const TABLE_ROTATIONS = [-3.5, 2.1, -1.8, 4.3, -2.7, 1.5, -4.1, 3.2]

const CARD_W = 340
const CARD_H = 210
const GAP    = 20
const STEP   = CARD_W + GAP
const SPEED  = 0.5

// ── Carousel Card ─────────────────────────────────────────────────
function CarouselCard({ video, onPause, onResume }) {
  const vidRef  = useRef(null)
  const [hov,   setHov]   = useState(false)
  const [play,  setPlay]  = useState(false)

  const enter = () => { setHov(true);  onPause()  }
  const leave = () => {
    setHov(false); setPlay(false)
    if (vidRef.current) { vidRef.current.pause(); vidRef.current.currentTime = 0 }
    onResume()
  }
  const togglePlay = (e) => {
    e.stopPropagation()
    const v = vidRef.current; if (!v) return
    if (play) { v.pause(); setPlay(false) }
    else       { v.play().catch(() => {}); setPlay(true) }
  }

  return (
    <div
      className="relative mt-3 flex-shrink-0 overflow-hidden group"
      style={{
        width:      CARD_W,
        height:     CARD_H,
        border:     `1px solid ${hov ? `rgba(${video.rgb},.55)` : 'rgba(255,255,255,.07)'}`,
        boxShadow:  hov ? `0 0 40px rgba(${video.rgb},.22),0 24px 50px rgba(0,0,0,.55)` : 'none',
        transform:  hov ? 'scale(1.05) translateY(-8px)' : 'scale(1) translateY(0)',
        transition: 'transform .45s cubic-bezier(.23,1,.32,1),box-shadow .4s ease,border-color .3s ease',
        cursor:     'pointer',
      }}
      onMouseEnter={enter}
      onMouseLeave={leave}
    >
      {/* Accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] z-10" style={{
        background: video.color, transformOrigin: 'left',
        transform: hov ? 'scaleX(1)' : 'scaleX(0)',
        transition: 'transform .45s ease',
      }} />
      {/* Corner TL */}
      <div className="absolute top-0 left-0 w-5 h-5 z-10 pointer-events-none" style={{
        borderTop: `1px solid ${video.color}`, borderLeft: `1px solid ${video.color}`,
        opacity: hov ? 1 : 0, transition: 'opacity .3s ease',
      }} />
      {/* Corner BR */}
      <div className="absolute bottom-0 right-0 w-5 h-5 z-10 pointer-events-none" style={{
        borderBottom: `1px solid rgba(${video.rgb},.35)`, borderRight: `1px solid rgba(${video.rgb},.35)`,
        opacity: hov ? 1 : 0, transition: 'opacity .3s ease',
      }} />

      {/* Video */}
      <video ref={vidRef} className="w-full h-full object-cover"
        src={video.src} muted loop playsInline preload="metadata" />

      {/* Overlay */}
      <div className="absolute inset-0 z-[1] pointer-events-none" style={{
        background: play
          ? 'linear-gradient(to top,rgba(5,5,8,.88) 0%,transparent 45%)'
          : 'linear-gradient(to top,rgba(5,5,8,.93) 0%,rgba(5,5,8,.35) 100%)',
        transition: 'background .3s ease',
      }} />

      {/* Play button */}
      <div className="absolute inset-0 z-[2] flex items-center justify-center"
        style={{ opacity: hov ? 1 : 0, transition: 'opacity .3s ease' }}
        onClick={togglePlay}
      >
        <div className="w-12 h-12 flex items-center justify-center backdrop-blur-sm transition-all duration-200"
          style={{
            background: `rgba(${video.rgb},.18)`,
            border: `1px solid rgba(${video.rgb},.55)`,
            boxShadow: `0 0 22px rgba(${video.rgb},.28)`,
          }}>
          <span className="text-lg" style={{ marginLeft: play ? 0 : 3 }}>
            {play ? '❚❚' : '▶'}
          </span>
        </div>
      </div>

      {/* Duration badge */}
      <div className="absolute top-3 right-3 z-[3] px-2 py-0.5"
        style={{
          background: 'rgba(5,5,8,.7)', border: `1px solid rgba(${video.rgb},.3)`,
          opacity: hov ? 1 : 0, transition: 'opacity .3s ease',
        }}>
        <span className="text-[9px] font-bold tracking-[.08em]" style={{ ...dmSans, color: video.color }}>
          {video.duration}
        </span>
      </div>

      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 z-[3] px-4 py-3">
        <div className="text-[7px] font-bold tracking-[.38em] uppercase mb-0.5"
          style={{ ...syne, color: `rgba(${video.rgb},.95)` }}>{video.tag}</div>
        <div className="text-[13px] font-bold leading-tight text-[#F0EAD6]/90" style={syne}>
          {video.title}
        </div>
      </div>
    </div>
  )
}

// ── Table Card (View All) ─────────────────────────────────────────
function TableCard({ video, rotation, onSelect }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      className="relative overflow-hidden cursor-pointer"
      style={{
        aspectRatio: '16/9',
        transform:   hov ? 'rotate(0deg) translateY(-14px) scale(1.06)' : `rotate(${rotation}deg)`,
        boxShadow:   hov
          ? `0 32px 64px rgba(0,0,0,.85),0 0 40px rgba(${video.rgb},.3)`
          : '0 10px 30px rgba(0,0,0,.7)',
        border:      `1px solid ${hov ? `rgba(${video.rgb},.45)` : 'rgba(255,255,255,.08)'}`,
        transition:  'transform .55s cubic-bezier(.23,1,.32,1),box-shadow .4s ease,border-color .3s ease',
        zIndex:      hov ? 10 : 1,
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onSelect(video)}
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] z-10" style={{
        background: video.color, transformOrigin: 'left',
        transform: hov ? 'scaleX(1)' : 'scaleX(0)', transition: 'transform .45s ease',
      }} />
      <video className="w-full h-full object-cover" src={video.src} muted playsInline preload="metadata" />
      <div className="absolute inset-0 z-[1] pointer-events-none" style={{
        background: hov
          ? 'linear-gradient(to top,rgba(5,5,8,.85) 0%,transparent 55%)'
          : 'linear-gradient(to top,rgba(5,5,8,.93) 0%,rgba(5,5,8,.45) 100%)',
        transition: 'background .3s ease',
      }} />
      <div className="absolute inset-0 z-[2] flex items-center justify-center"
        style={{ opacity: hov ? 1 : 0, transition: 'opacity .3s ease' }}>
        <div className="w-10 h-10 flex items-center justify-center"
          style={{ background: `rgba(${video.rgb},.18)`, border: `1px solid rgba(${video.rgb},.55)`, boxShadow: `0 0 18px rgba(${video.rgb},.3)` }}>
          <span className="text-base" style={{ marginLeft: 3 }}>▶</span>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-[3] px-3 py-2.5">
        <div className="text-[7px] font-bold tracking-[.35em] uppercase mb-0.5"
          style={{ ...syne, color: `rgba(${video.rgb},.9)` }}>{video.tag}</div>
        <div className="text-sm font-bold text-[#F0EAD6]/90" style={syne}>{video.title}</div>
      </div>
      <div className="absolute top-0 left-0 w-4 h-4 z-10 pointer-events-none" style={{
        borderTop: `1px solid ${video.color}`, borderLeft: `1px solid ${video.color}`,
        opacity: hov ? 1 : 0, transition: 'opacity .3s ease',
      }} />
    </div>
  )
}

// ── Video Player ───────────────────────────────────────────────────
function VideoPlayer({ video, onClose }) {
  const vidRef = useRef(null)
  useEffect(() => {
    vidRef.current?.play().catch(() => {})
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div
      className="fixed inset-0 z-[950] flex items-center justify-center p-8 bg-[#050508]/96 backdrop-blur-2xl"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{ animation: 'cvgSlideUp .35s cubic-bezier(.16,1,.3,1)' }}
    >
      <div className="relative w-full max-w-4xl">
        <div className="h-[2px]" style={{ background: `linear-gradient(90deg,${video.color},rgba(${video.rgb},.2),transparent)` }} />
        <div className="absolute top-0 left-0 w-7 h-7 z-10"
          style={{ borderTop: `1px solid ${video.color}`, borderLeft: `1px solid ${video.color}` }} />
        <video ref={vidRef} className="w-full block" style={{ aspectRatio: '16/9', objectFit: 'cover' }}
          src={video.src} controls playsInline />
        <div className="flex items-center justify-between gap-6 px-6 py-4 bg-white/[.03] border-x border-b border-white/[.07]">
          <div>
            <div className="text-[8px] font-bold tracking-[.38em] uppercase mb-1"
              style={{ ...syne, color: video.color }}>{video.tag}</div>
            <div className="text-[18px] font-bold text-[#F0EAD6]/90" style={syne}>{video.title}</div>
          </div>
          <button onClick={onClose}
            className="text-[9px] font-bold tracking-[.28em] uppercase border px-5 py-2.5 transition-all duration-200"
            style={{ ...syne, borderColor: 'rgba(255,255,255,.12)', color: 'rgba(240,234,214,.4)', background: 'transparent' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = video.color; e.currentTarget.style.color = video.color }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.12)'; e.currentTarget.style.color = 'rgba(240,234,214,.4)' }}
          >✕ Close</button>
        </div>
        <div className="absolute bottom-0 right-0 w-7 h-7"
          style={{ borderBottom: '1px solid rgba(168,85,247,.5)', borderRight: '1px solid rgba(168,85,247,.5)' }} />
      </div>
    </div>
  )
}

// ── View All Modal ─────────────────────────────────────────────────
function ViewAllModal({ videos, chapter, chapterColor, chapterRgb, onClose }) {
  const [playerVideo, setPlayerVideo] = useState(null)
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') { if (playerVideo) setPlayerVideo(null); else onClose() } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, playerVideo])

  return (
    <div className="fixed inset-0 z-[900] flex flex-col bg-[#050508]/97 backdrop-blur-2xl overflow-hidden"
      style={{ animation: 'cvgSlideUp .35s cubic-bezier(.16,1,.3,1)' }}>

      {/* Atmosphere */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(ellipse,rgba(${chapterRgb},.1) 0%,transparent 70%)` }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(${chapterRgb},.018) 1px,transparent 1px),linear-gradient(90deg,rgba(${chapterRgb},.018) 1px,transparent 1px)`,
        backgroundSize: '48px 48px',
      }} />

      {/* Header */}
      <div className="relative flex-shrink-0 px-12 py-7 border-b border-white/[.07] overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1.5px]"
          style={{ background: `linear-gradient(90deg,${chapterColor},rgba(168,85,247,.5),transparent)` }} />
        <div className="flex items-center justify-between relative z-[1]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-[6px] bg-white/[.04] border mb-3"
              style={{ borderColor: `rgba(${chapterRgb},.3)` }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: chapterColor }} />
              <span className="text-[8px] font-bold tracking-[.42em] uppercase"
                style={{ ...syne, color: chapterColor }}>{chapter} · All Recordings</span>
            </div>
            <div>
              <span className="block leading-[.88]" style={{
                ...bebasNeue, fontSize: 'clamp(28px,5vw,52px)',
                WebkitTextStroke: '1px rgba(240,234,214,.4)', color: 'transparent',
              }}>ALL</span>
              <span className="block leading-[.88]" style={{
                ...bebasNeue, fontSize: 'clamp(28px,5vw,52px)',
                color: chapterColor, textShadow: `0 0 30px rgba(${chapterRgb},.35)`,
              }}>VIDEOS</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-light text-[#F0EAD6]/30 tracking-[.04em]" style={dmSans}>
              {videos.length} recordings
            </span>
            <button onClick={onClose}
              className="text-[9px] font-bold tracking-[.28em] uppercase border px-6 py-2.5 transition-all duration-200"
              style={{ ...syne, borderColor: 'rgba(255,255,255,.12)', color: 'rgba(240,234,214,.4)', background: 'transparent' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = chapterColor; e.currentTarget.style.color = chapterColor }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.12)'; e.currentTarget.style.color = 'rgba(240,234,214,.4)' }}
            >✕ Close</button>
          </div>
        </div>
      </div>

      {/* Cards on table */}
      <div className="flex-1 overflow-y-auto px-12 py-14" style={{ perspective: '1400px' }}>
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
          style={{ transformStyle: 'preserve-3d' }}>
          {videos.map((video, i) => (
            <TableCard key={video.id} video={video}
              rotation={TABLE_ROTATIONS[i % TABLE_ROTATIONS.length]}
              onSelect={setPlayerVideo} />
          ))}
        </div>
      </div>

      {playerVideo && <VideoPlayer video={playerVideo} onClose={() => setPlayerVideo(null)} />}
    </div>
  )
}

// ── MAIN EXPORT ────────────────────────────────────────────────────
export default function ChapterVideoGallery({
  videos,
  chapter        = 'Chapter',
  chapterNum     = '01',
  sectionTitle   = ['OUR HARD WORK', 'MADE IT POSSIBLE'],
  sectionSub     = 'Real Builds · Real Students · Real Impact',
  chapterColor   = '#FF6B35',
  chapterRgb     = '255,107,53',
  stats          = [],
}) {
  const [showAll,    setShowAll]    = useState(false)
  const [modalVideo, setModalVideo] = useState(null)

  const trackRef  = useRef(null)
  const posRef    = useRef(0)
  const pausedRef = useRef(false)
  const rafRef    = useRef(null)
  const loopWidth = videos.length * STEP
  const doubled   = [...videos, ...videos]

  const animate = useCallback(() => {
    if (!pausedRef.current && trackRef.current) {
      posRef.current += SPEED
      if (posRef.current >= loopWidth) posRef.current -= loopWidth
      trackRef.current.style.transform = `translateX(-${posRef.current}px)`
    }
    rafRef.current = requestAnimationFrame(animate)
  }, [loopWidth])

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [animate])

  const handlePrev = () => {
    posRef.current = ((posRef.current - STEP) + loopWidth) % loopWidth
    if (trackRef.current)
      trackRef.current.style.transform = `translateX(-${posRef.current}px)`
  }
  const handleNext = () => {
    posRef.current = (posRef.current + STEP) % loopWidth
    if (trackRef.current)
      trackRef.current.style.transform = `translateX(-${posRef.current}px)`
  }

  return (
    <>
      <style>{`
        @keyframes cvgSlideUp {
          from { opacity:0; transform:translateY(28px) }
          to   { opacity:1; transform:translateY(0)    }
        }
      `}</style>

      <section className="relative overflow-hidden py-[80px] bg-[#050508]"
        style={{ borderTop: `1px solid rgba(${chapterRgb},.12)`, borderBottom: '1px solid rgba(255,255,255,.055)' }}>

        {/* ── Atmosphere ── */}
        <div className="absolute -top-[100px] -left-[60px] w-[500px] h-[380px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(ellipse,rgba(${chapterRgb},.12) 0%,transparent 70%)` }} />
        <div className="absolute -bottom-[100px] -right-[40px] w-[460px] h-[360px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse,rgba(168,85,247,.1) 0%,transparent 70%)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[250px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(ellipse,rgba(${chapterRgb},.04) 0%,transparent 70%)` }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(0,0,0,.055) 3px,rgba(0,0,0,.055) 4px)',
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(${chapterRgb},.02) 1px,transparent 1px),linear-gradient(90deg,rgba(${chapterRgb},.02) 1px,transparent 1px)`,
          backgroundSize: '48px 48px',
        }} />

        {/* ── Header ── */}
        <div className="relative z-[2] max-w-[1100px] mx-auto px-12 mb-12">
          <div className="flex items-end justify-between gap-8 flex-wrap">

            {/* Left */}
            <div>
              {/* Chapter + eyebrow */}
              <div className="flex items-center gap-3 mb-5">
                <div className="inline-flex items-center gap-2 px-3 py-[6px] bg-white/[.04] border"
                  style={{ borderColor: `rgba(${chapterRgb},.28)` }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: chapterColor }} />
                  <span className="text-[8px] font-bold tracking-[.42em] uppercase"
                    style={{ ...syne, color: chapterColor }}>{chapter}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-6 h-px" style={{ background: `rgba(${chapterRgb},.3)` }} />
                  <span className="text-[8px] font-bold tracking-[.35em] uppercase text-[#F0EAD6]/[.28]"
                    style={syne}>Student Recordings</span>
                </div>
              </div>

              {/* Title */}
              <div>
                <span className="block leading-[.9] tracking-[-0.01em]" style={{
                  ...bebasNeue,
                  fontSize: 'clamp(38px,6vw,68px)',
                  WebkitTextStroke: '1px rgba(240,234,214,.35)',
                  color: 'transparent',
                }}>
                  {sectionTitle[0]}
                </span>
                <span className="block leading-[.9] tracking-[-0.01em]" style={{
                  ...bebasNeue,
                  fontSize: 'clamp(38px,6vw,68px)',
                  color: chapterColor,
                  textShadow: `0 0 40px rgba(${chapterRgb},.35)`,
                }}>
                  {sectionTitle[1]}
                </span>
                <span className="block mt-1.5 font-bold tracking-[.18em] uppercase text-[#00F5FF]"
                  style={{ ...syne, fontSize: 'clamp(10px,1.3vw,13px)' }}>
                  {sectionSub}
                </span>
              </div>

              {/* Rule */}
              <div className="w-14 h-px mt-5"
                style={{ background: `linear-gradient(90deg,${chapterColor},transparent)` }} />
            </div>

            {/* Right — counter + nav + view all */}
            <div className="flex flex-col items-end gap-4">
              <span className="text-[10px] font-light text-[#F0EAD6]/25 tracking-[.06em]" style={dmSans}>
                {videos.length} recordings in chapter
              </span>
              <div className="flex items-center gap-3">
                {/* Prev */}
                <button onClick={handlePrev}
                  className="w-10 h-10 flex items-center justify-center text-lg border bg-white/[.03] text-[#F0EAD6]/50 transition-all duration-200"
                  style={{ borderColor: 'rgba(255,255,255,.1)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = chapterColor
                    e.currentTarget.style.color = chapterColor
                    e.currentTarget.style.background = `rgba(${chapterRgb},.07)`
                    e.currentTarget.style.boxShadow = `0 0 16px rgba(${chapterRgb},.22)`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)'
                    e.currentTarget.style.color = 'rgba(240,234,214,.5)'
                    e.currentTarget.style.background = 'rgba(255,255,255,.03)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >‹</button>
                {/* Next */}
                <button onClick={handleNext}
                  className="w-10 h-10 flex items-center justify-center text-lg border bg-white/[.03] text-[#F0EAD6]/50 transition-all duration-200"
                  style={{ borderColor: 'rgba(255,255,255,.1)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = chapterColor
                    e.currentTarget.style.color = chapterColor
                    e.currentTarget.style.background = `rgba(${chapterRgb},.07)`
                    e.currentTarget.style.boxShadow = `0 0 16px rgba(${chapterRgb},.22)`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)'
                    e.currentTarget.style.color = 'rgba(240,234,214,.5)'
                    e.currentTarget.style.background = 'rgba(255,255,255,.03)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >›</button>

                <div className="w-px h-8 bg-white/[.1]" />

                {/* View All */}
                <button onClick={() => setShowAll(true)}
                  className="text-[9px] font-bold tracking-[.32em] uppercase text-white px-5 py-2.5 border-none cursor-pointer transition-all duration-300 hover:-translate-y-px"
                  style={{
                    ...syne,
                    background: chapterColor,
                    boxShadow: `0 0 20px rgba(${chapterRgb},.25)`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.filter = 'brightness(1.15)'
                    e.currentTarget.style.boxShadow = `0 0 36px rgba(${chapterRgb},.5)`
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = 'none'
                    e.currentTarget.style.boxShadow = `0 0 20px rgba(${chapterRgb},.25)`
                  }}
                >
                  View All →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Carousel ── */}
        <div className="relative z-[2] overflow-hidden">
          {/* Edge fades */}
          <div className="absolute left-0 top-0 bottom-0 w-28 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to right,#050508,transparent)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-28 z-10 pointer-events-none"
            style={{ background: 'linear-gradient(to left,#050508,transparent)' }} />

          <div ref={trackRef} className="flex" style={{ gap: GAP, paddingLeft: 48, paddingRight: 48, willChange: 'transform' }}>
            {doubled.map((video, i) => (
              <CarouselCard
                key={`${video.id}-${i}`}
                video={video}
                onPause={() => { pausedRef.current = true }}
                onResume={() => { pausedRef.current = false }}
              />
            ))}
          </div>
        </div>

        {/* ── Bottom strip ── */}
        {stats.length > 0 && (
          <div className="relative z-[2] max-w-[1100px] mx-auto px-12 mt-12">
            <div className="h-[1.5px] mb-7"
              style={{ background: `linear-gradient(90deg,${chapterColor},rgba(168,85,247,.5),transparent)` }} />
            <div className="flex items-center justify-between gap-6 flex-wrap">
              {stats.map((s) => (
                <div key={s.label} className="flex items-baseline gap-2">
                  <span className="leading-none" style={{ ...bebasNeue, fontSize: '1.7rem', color: s.color }}>
                    {s.num}
                  </span>
                  <span className="text-[8px] font-bold tracking-[.3em] uppercase text-[#F0EAD6]/28" style={syne}>
                    {s.label}
                  </span>
                </div>
              ))}
              <p className="text-[12px] font-light text-[#F0EAD6]/30 max-w-[280px] leading-[1.7] ml-auto" style={dmSans}>
                Every clip filmed and edited by our students. No scripts, no actors.
              </p>
            </div>
          </div>
        )}

      </section>

      {/* Modals */}
      {showAll && (
        <ViewAllModal
          videos={videos}
          chapter={chapter}
          chapterColor={chapterColor}
          chapterRgb={chapterRgb}
          onClose={() => setShowAll(false)}
        />
      )}
      {modalVideo && (
        <VideoPlayer video={modalVideo} onClose={() => setModalVideo(null)} />
      )}
    </>
  )
}
