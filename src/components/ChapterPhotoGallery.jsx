import { useState, useEffect, useCallback, useRef } from 'react'

const bebasNeue = { fontFamily: "'Bebas Neue', sans-serif" }
const syne      = { fontFamily: "'Syne', sans-serif" }
const dmSans    = { fontFamily: "'DM Sans', sans-serif" }

// ── Mosaic layout patterns (repeating every 8 photos) ─────────────
// colSpan: 1 | 2,  rowSpan: 1 | 2
const LAYOUT_PATTERN = [
  { col: 2, row: 2 }, // big hero
  { col: 1, row: 1 },
  { col: 1, row: 1 },
  { col: 1, row: 1 },
  { col: 1, row: 2 }, // tall portrait
  { col: 2, row: 1 }, // wide landscape
  { col: 1, row: 1 },
  { col: 1, row: 1 },
]

// ── Single mosaic cell ─────────────────────────────────────────────
function MosaicCell({ photo, layout, chapterColor, chapterRgb, index, total, onClick }) {
  const [hov, setHov] = useState(false)

  return (
    <div
      className="relative overflow-hidden cursor-pointer"
      style={{
        gridColumn: `span ${layout.col}`,
        gridRow:    `span ${layout.row}`,
        minHeight:  layout.row === 2 ? 320 : 160,
        border:     `1px solid ${hov ? `rgba(${chapterRgb},.5)` : 'rgba(255,255,255,.07)'}`,
        boxShadow:  hov ? `0 0 36px rgba(${chapterRgb},.18), 0 20px 48px rgba(0,0,0,.6)` : 'none',
        transform:  hov ? 'scale(1.012)' : 'scale(1)',
        transition: 'transform .45s cubic-bezier(.23,1,.32,1), box-shadow .4s ease, border-color .3s ease',
        zIndex:     hov ? 2 : 1,
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onClick(index)}
    >
      {/* Photo */}
      <img
        src={photo.src}
        alt={photo.caption}
        className="w-full h-full object-cover"
        style={{
          transform:  hov ? 'scale(1.06)' : 'scale(1)',
          transition: 'transform .6s cubic-bezier(.23,1,.32,1)',
        }}
        loading="lazy"
      />

      {/* Dark scrim — fades out on hover to reveal photo */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: hov
          ? 'linear-gradient(to top,rgba(5,5,8,.75) 0%,transparent 55%)'
          : 'linear-gradient(to top,rgba(5,5,8,.88) 0%,rgba(5,5,8,.28) 100%)',
        transition: 'background .4s ease',
      }} />

      {/* Accent bar — slides in on hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] z-10" style={{
        background: chapterColor,
        transform:  hov ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: 'left',
        transition: 'transform .45s ease',
      }} />

      {/* Corner TL */}
      <div className="absolute top-0 left-0 w-5 h-5 z-10 pointer-events-none" style={{
        borderTop:  `1px solid ${chapterColor}`,
        borderLeft: `1px solid ${chapterColor}`,
        opacity:    hov ? 1 : 0,
        transition: 'opacity .3s ease',
      }} />
      {/* Corner BR */}
      <div className="absolute bottom-0 right-0 w-5 h-5 z-10 pointer-events-none" style={{
        borderBottom: `1px solid rgba(${chapterRgb},.4)`,
        borderRight:  `1px solid rgba(${chapterRgb},.4)`,
        opacity:    hov ? 1 : 0,
        transition: 'opacity .3s ease',
      }} />

      {/* Index badge — top right */}
      <div
        className="absolute top-3 right-3 z-10 px-2 py-0.5"
        style={{
          background: 'rgba(5,5,8,.75)',
          border: `1px solid rgba(${chapterRgb},.25)`,
          opacity: hov ? 1 : 0,
          transition: 'opacity .3s ease',
        }}
      >
        <span className="text-[8px] font-bold tracking-[.12em]"
          style={{ ...dmSans, color: chapterColor }}>
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>

      {/* Caption + tag — bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-4 py-3">
        <div
          className="text-[7px] font-bold tracking-[.38em] uppercase mb-0.5"
          style={{ ...syne, color: `rgba(${chapterRgb},.9)`, opacity: hov ? 1 : 0, transition: 'opacity .3s ease' }}
        >
          {photo.tag}
        </div>
        <div
          className="text-[13px] font-bold leading-tight text-[#F0EAD6]/90"
          style={{ ...syne, opacity: hov ? 1 : 0.6, transition: 'opacity .3s ease' }}
        >
          {photo.caption}
        </div>
      </div>

      {/* Center expand icon */}
      <div
        className="absolute inset-0 z-10 flex items-center justify-center"
        style={{ opacity: hov ? 1 : 0, transition: 'opacity .3s ease' }}
      >
        <div
          className="w-11 h-11 flex items-center justify-center backdrop-blur-sm"
          style={{
            background: `rgba(${chapterRgb},.15)`,
            border: `1px solid rgba(${chapterRgb},.5)`,
            boxShadow: `0 0 20px rgba(${chapterRgb},.25)`,
          }}
        >
          <span className="text-sm text-white/80">⊕</span>
        </div>
      </div>
    </div>
  )
}

// ── Lightbox ───────────────────────────────────────────────────────
function Lightbox({ photos, startIndex, chapterColor, chapterRgb, chapter, onClose }) {
  const [idx, setIdx]           = useState(startIndex)
  const [direction, setDir]     = useState(null) // 'left' | 'right'
  const [animating, setAnim]    = useState(false)
  const [zoomed, setZoomed]     = useState(false)
  const imgRef                  = useRef(null)

  const go = useCallback((next) => {
    if (animating) return
    setDir(next > idx ? 'right' : 'left')
    setAnim(true)
    setZoomed(false)
    setTimeout(() => {
      setIdx(next)
      setDir(null)
      setAnim(false)
    }, 280)
  }, [animating, idx])

  const prev = () => go((idx - 1 + photos.length) % photos.length)
  const next = () => go((idx + 1) % photos.length)

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape')      onClose()
      if (e.key === 'ArrowLeft')   prev()
      if (e.key === 'ArrowRight')  next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [idx, animating])

  const photo = photos[idx]

  const imgStyle = {
    opacity:   animating ? 0 : 1,
    transform: animating
      ? `translateX(${direction === 'right' ? '-40px' : '40px'}) scale(.97)`
      : 'translateX(0) scale(1)',
    transition: 'opacity .28s ease, transform .28s ease',
  }

  return (
    <div
      className="fixed inset-0 z-[950] flex flex-col bg-[#050508]/97 backdrop-blur-2xl"
      style={{ animation: 'pgSlideUp .35s cubic-bezier(.16,1,.3,1)' }}
    >
      {/* Atmosphere */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(${chapterRgb},.018) 1px,transparent 1px),linear-gradient(90deg,rgba(${chapterRgb},.018) 1px,transparent 1px)`,
        backgroundSize: '48px 48px',
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(0,0,0,.055) 3px,rgba(0,0,0,.055) 4px)',
      }} />

      {/* Top gradient bar */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] z-10"
        style={{ background: `linear-gradient(90deg,${chapterColor},rgba(168,85,247,.5),transparent)` }} />

      {/* ── Top bar ── */}
      <div className="relative z-[2] flex items-center justify-between px-10 py-5 border-b border-white/[.07] flex-shrink-0">
        <div className="flex items-center gap-4">
          {/* Chapter badge */}
          <div className="inline-flex items-center gap-2 px-3 py-[6px] border"
            style={{ background: `rgba(${chapterRgb},.07)`, borderColor: `rgba(${chapterRgb},.28)` }}>
            <span className="w-1 h-1 rounded-full" style={{ background: chapterColor }} />
            <span className="text-[8px] font-bold tracking-[.4em] uppercase"
              style={{ ...syne, color: chapterColor }}>{chapter}</span>
          </div>
          {/* Photo title */}
          <div>
            <div className="text-[7px] font-bold tracking-[.35em] uppercase text-[#F0EAD6]/[.28] mb-0.5" style={syne}>
              {photo.tag}
            </div>
            <div className="text-[14px] font-bold text-[#F0EAD6]/85" style={syne}>{photo.caption}</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Counter */}
          <div className="text-[#F0EAD6]/30 tracking-[.06em]" style={{ ...dmSans, fontSize: '12px' }}>
            <span style={{ color: chapterColor, fontWeight: 700 }}>{String(idx + 1).padStart(2, '0')}</span>
            {' '}/ {String(photos.length).padStart(2, '0')}
          </div>

          {/* Zoom toggle */}
          <button
            onClick={() => setZoomed(v => !v)}
            className="w-8 h-8 flex items-center justify-center border transition-all duration-200 text-sm"
            style={{
              borderColor: zoomed ? chapterColor : 'rgba(255,255,255,.12)',
              background:  zoomed ? `rgba(${chapterRgb},.12)` : 'transparent',
              color:       zoomed ? chapterColor : 'rgba(240,234,214,.4)',
            }}
            title="Toggle zoom"
          >⊕</button>

          {/* Close */}
          <button
            onClick={onClose}
            className="text-[9px] font-bold tracking-[.28em] uppercase border px-5 py-2 transition-all duration-200"
            style={{ ...syne, borderColor: 'rgba(255,255,255,.12)', color: 'rgba(240,234,214,.4)', background: 'transparent' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = chapterColor; e.currentTarget.style.color = chapterColor }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,.12)'; e.currentTarget.style.color = 'rgba(240,234,214,.4)' }}
          >✕ Close</button>
        </div>
      </div>

      {/* ── Main image area ── */}
      <div className="relative z-[2] flex-1 flex items-center justify-center px-20 py-6 overflow-hidden">

        {/* Prev arrow */}
        <button
          onClick={prev}
          className="absolute left-6 z-10 w-12 h-12 flex items-center justify-center text-xl border transition-all duration-200"
          style={{
            borderColor: 'rgba(255,255,255,.1)', background: 'rgba(5,5,8,.7)',
            color: 'rgba(240,234,214,.5)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = chapterColor
            e.currentTarget.style.color = chapterColor
            e.currentTarget.style.boxShadow = `0 0 18px rgba(${chapterRgb},.3)`
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)'
            e.currentTarget.style.color = 'rgba(240,234,214,.5)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >‹</button>

        {/* Image */}
        <div
          className="relative max-w-5xl w-full"
          style={{
            cursor: zoomed ? 'zoom-out' : 'zoom-in',
          }}
          onClick={() => setZoomed(v => !v)}
        >
          {/* Accent top line */}
          <div className="h-[2px]" style={{ background: `linear-gradient(90deg,${chapterColor},rgba(${chapterRgb},.2),transparent)` }} />

          {/* Corner TL */}
          <div className="absolute top-[2px] left-0 w-7 h-7 z-10"
            style={{ borderTop: `1px solid ${chapterColor}`, borderLeft: `1px solid ${chapterColor}` }} />
          {/* Corner TR */}
          <div className="absolute top-[2px] right-0 w-7 h-7 z-10"
            style={{ borderTop: `1px solid rgba(${chapterRgb},.3)`, borderRight: `1px solid rgba(${chapterRgb},.3)` }} />

          <div style={{ overflow: 'hidden' }}>
            <img
              ref={imgRef}
              src={photo.src}
              alt={photo.caption}
              className="w-full block"
              style={{
                ...imgStyle,
                maxHeight: zoomed ? 'none' : '65vh',
                objectFit: zoomed ? 'contain' : 'cover',
                transform: [imgStyle.transform, zoomed ? 'scale(1.5)' : ''].filter(Boolean).join(' '),
              }}
              draggable={false}
            />
          </div>

          {/* Corner BL */}
          <div className="absolute bottom-0 left-0 w-7 h-7 z-10"
            style={{ borderBottom: `1px solid rgba(${chapterRgb},.3)`, borderLeft: `1px solid rgba(${chapterRgb},.3)` }} />
          {/* Corner BR */}
          <div className="absolute bottom-0 right-0 w-7 h-7 z-10"
            style={{ borderBottom: '1px solid rgba(168,85,247,.5)', borderRight: '1px solid rgba(168,85,247,.5)' }} />
        </div>

        {/* Next arrow */}
        <button
          onClick={next}
          className="absolute right-6 z-10 w-12 h-12 flex items-center justify-center text-xl border transition-all duration-200"
          style={{
            borderColor: 'rgba(255,255,255,.1)', background: 'rgba(5,5,8,.7)',
            color: 'rgba(240,234,214,.5)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = chapterColor
            e.currentTarget.style.color = chapterColor
            e.currentTarget.style.boxShadow = `0 0 18px rgba(${chapterRgb},.3)`
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)'
            e.currentTarget.style.color = 'rgba(240,234,214,.5)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >›</button>
      </div>

      {/* ── Thumbnail strip ── */}
      <div className="relative z-[2] border-t border-white/[.07] px-10 py-4 flex-shrink-0">
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {photos.map((p, i) => (
            <button
              key={p.id}
              onClick={() => go(i)}
              className="relative flex-shrink-0 overflow-hidden transition-all duration-200"
              style={{
                width:  72,
                height: 48,
                border: `1px solid ${i === idx ? chapterColor : 'rgba(255,255,255,.08)'}`,
                opacity: i === idx ? 1 : 0.45,
                boxShadow: i === idx ? `0 0 12px rgba(${chapterRgb},.4)` : 'none',
                transform: i === idx ? 'scale(1.08)' : 'scale(1)',
              }}
            >
              <img src={p.src} alt={p.caption} className="w-full h-full object-cover" />
              {/* Active top bar */}
              {i === idx && (
                <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: chapterColor }} />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── MAIN EXPORT ────────────────────────────────────────────────────
export default function ChapterPhotoGallery({
  photos        = [],
  chapter       = 'Chapter',
  sectionTitle  = ['MOMENTS THAT', 'DEFINED US'],
  sectionSub    = 'Behind the Scenes · Lab Sessions · Milestones',
  chapterColor  = '#FF6B35',
  chapterRgb    = '255,107,53',
}) {
  const [lightboxIndex, setLightboxIndex] = useState(null)

  // Assign layout pattern per photo
  const withLayout = photos.map((p, i) => ({
    ...p,
    layout: LAYOUT_PATTERN[i % LAYOUT_PATTERN.length],
  }))

  return (
    <>
      <style>{`
        @keyframes pgSlideUp {
          from { opacity:0; transform:translateY(24px) }
          to   { opacity:1; transform:translateY(0)    }
        }
      `}</style>

      <section
        className="relative overflow-hidden py-[80px] bg-[#050508]"
        style={{
          borderTop:    `1px solid rgba(${chapterRgb},.1)`,
          borderBottom: '1px solid rgba(255,255,255,.055)',
        }}
      >
        {/* ── Atmosphere ── */}
        <div className="absolute -top-[80px] -right-[40px] w-[480px] h-[360px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(ellipse,rgba(${chapterRgb},.1) 0%,transparent 70%)` }} />
        <div className="absolute -bottom-[80px] -left-[40px] w-[420px] h-[340px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse,rgba(168,85,247,.09) 0%,transparent 70%)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(0,0,0,.055) 3px,rgba(0,0,0,.055) 4px)',
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `linear-gradient(rgba(${chapterRgb},.018) 1px,transparent 1px),linear-gradient(90deg,rgba(${chapterRgb},.018) 1px,transparent 1px)`,
          backgroundSize:  '48px 48px',
        }} />

        <div className="relative z-[2] max-w-[1100px] mx-auto px-12">

          {/* ── Header ── */}
          <div className="flex items-end justify-between gap-8 flex-wrap mb-12">
            <div>
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-5">
                <div className="inline-flex items-center gap-2 px-3 py-[6px] border"
                  style={{ background: `rgba(${chapterRgb},.06)`, borderColor: `rgba(${chapterRgb},.28)` }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: chapterColor }} />
                  <span className="text-[8px] font-bold tracking-[.42em] uppercase"
                    style={{ ...syne, color: chapterColor }}>{chapter}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-6 h-px" style={{ background: `rgba(${chapterRgb},.3)` }} />
                  <span className="text-[8px] font-bold tracking-[.35em] uppercase text-[#F0EAD6]/[.28]" style={syne}>
                    Photo Journal
                  </span>
                </div>
              </div>

              {/* Title */}
              <div>
                <span className="block leading-[.9] tracking-[-0.01em]" style={{
                  ...bebasNeue,
                  fontSize: 'clamp(36px,5.5vw,64px)',
                  WebkitTextStroke: '1px rgba(240,234,214,.35)',
                  color: 'transparent',
                }}>{sectionTitle[0]}</span>
                <span className="block leading-[.9] tracking-[-0.01em]" style={{
                  ...bebasNeue,
                  fontSize: 'clamp(36px,5.5vw,64px)',
                  color: chapterColor,
                  textShadow: `0 0 40px rgba(${chapterRgb},.35)`,
                }}>{sectionTitle[1]}</span>
                <span className="block mt-1.5 font-bold tracking-[.18em] uppercase text-[#00F5FF]"
                  style={{ ...syne, fontSize: 'clamp(9px,1.2vw,13px)' }}>{sectionSub}</span>
              </div>

              {/* Rule */}
              <div className="w-14 h-px mt-5"
                style={{ background: `linear-gradient(90deg,${chapterColor},transparent)` }} />
            </div>

            {/* Photo count + hint */}
            <div className="text-right">
              <div className="leading-none mb-1"
                style={{ ...bebasNeue, fontSize: '2.4rem', color: chapterColor }}>
                {String(photos.length).padStart(2, '0')}
              </div>
              <div className="text-[8px] font-bold tracking-[.35em] uppercase text-[#F0EAD6]/[.28]" style={syne}>
                Photographs
              </div>
              <div className="text-[11px] font-light text-[#F0EAD6]/25 mt-2 tracking-[.03em]" style={dmSans}>
                Click any photo to open gallery
              </div>
            </div>
          </div>

          {/* ── Mosaic Grid ── */}
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: 'repeat(3, 1fr)',
              gridAutoRows:        '160px',
            }}
          >
            {withLayout.map((photo, i) => (
              <MosaicCell
                key={photo.id}
                photo={photo}
                layout={photo.layout}
                chapterColor={chapterColor}
                chapterRgb={chapterRgb}
                index={i}
                total={photos.length}
                onClick={setLightboxIndex}
              />
            ))}
          </div>

          {/* ── Bottom strip ── */}
          <div className="mt-10">
            <div className="h-[1.5px]"
              style={{ background: `linear-gradient(90deg,${chapterColor},rgba(168,85,247,.5),transparent)` }} />
            <div className="pt-5 flex items-center justify-between gap-4 flex-wrap">
              <p className="text-[12px] font-light text-[#F0EAD6]/30 leading-[1.7] max-w-[400px]" style={dmSans}>
                Every photo captured during real lab sessions — no staging, no filters.
                This is what building robots actually looks like.
              </p>
              <button
                onClick={() => setLightboxIndex(0)}
                className="text-[9px] font-bold tracking-[.32em] uppercase border px-6 py-2.5 transition-all duration-200 hover:-translate-y-px"
                style={{
                  ...syne,
                  borderColor: `rgba(${chapterRgb},.35)`,
                  color: chapterColor,
                  background: `rgba(${chapterRgb},.06)`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `rgba(${chapterRgb},.14)`
                  e.currentTarget.style.boxShadow  = `0 0 20px rgba(${chapterRgb},.25)`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `rgba(${chapterRgb},.06)`
                  e.currentTarget.style.boxShadow  = 'none'
                }}
              >
                Browse All Photos →
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          photos={photos}
          startIndex={lightboxIndex}
          chapterColor={chapterColor}
          chapterRgb={chapterRgb}
          chapter={chapter}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  )
}
