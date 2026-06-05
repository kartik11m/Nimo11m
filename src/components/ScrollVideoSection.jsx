import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import BackgroundEffects from './BackgroundEffects'
import AnimatedTextCard from './AnimatedTextCard'
import { sections } from '../data/sections'

gsap.registerPlugin(ScrollTrigger)

export default function ScrollVideoSection() {
  const sectionRef = useRef(null)
  const bgRef      = useRef(null)       // imperative ref → BackgroundEffects.updateScene()
  const cardRefs   = useRef([])         // array of card DOM nodes for GSAP
  const tlRef      = useRef(null)       // GSAP timeline ref

  const [activeChapter, setActiveChapter] = useState(0)
  const [chapterLabel,  setChapterLabel]  = useState('Chapter One')

  // Stable callback — BackgroundEffects calls this when the active section changes
  const handleChapterChange = useCallback((idx, label) => {
    setActiveChapter(idx)
    setChapterLabel(label)
  }, [])

  useEffect(() => {
    const cards = cardRefs.current

    // ── Build GSAP timeline ──────────────────────────────────────
    //
    // Timeline positions are in seconds; GSAP normalises them when we
    // call tl.progress(0-1) from ScrollTrigger's onUpdate.
    //
    // Layout per card (each owns 0.25 of the total progress range):
    //   s + 0.00 → fade IN  starts  (duration 0.10)
    //   s + 0.03 → rule     expands (duration 0.09)
    //   s + 0.25 → fade OUT starts  (duration 0.10) — overlaps with next card IN
    //
    const tl = gsap.timeline({ paused: true })
    tlRef.current = tl

    cards.forEach((card, i) => {
      if (!card) return
      const s    = i * 0.25
      const rule = card.querySelector('.card-rule')

      // Fade in with blur
      tl.fromTo(
        card,
        { opacity: 0, y: 68, filter: 'blur(14px)' },
        { opacity: 1, y: 0,  filter: 'blur(0px)', ease: 'power3.out', duration: 0.10 },
        s,
      )

      // Rule line expands left → right
      if (rule) {
        tl.fromTo(
          rule,
          { scaleX: 0, transformOrigin: 'left center' },
          { scaleX: 1, ease: 'power2.out', duration: 0.09 },
          s + 0.03,
        )
      }

      // Crossfade out (starts at same time as next card's fade-in)
      if (i < sections.length - 1) {
        tl.to(
          card,
          { opacity: 0, y: -55, filter: 'blur(12px)', ease: 'power2.in', duration: 0.10 },
          (i + 1) * 0.25,
        )
      }
    })

    // ── ScrollTrigger ────────────────────────────────────────────
    //
    // • pin:true  — keeps the section stuck to the viewport
    // • end:+=5000 — 5 000 px of scroll drives the whole experience
    // • scrub:1.2  — playhead lags slightly for a cinematic feel
    //
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=5000',
      scrub: 1.2,
      pin: true,
      anticipatePin: 1,
      onUpdate(self) {
        tl.progress(self.progress)
        bgRef.current?.updateScene(self.progress)
      },
    })

    return () => {
      st.kill()
      tl.kill()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative h-screen flex overflow-hidden"
    >
      {/* ════════ LEFT — Three.js canvas panel ════════ */}
      <div className="relative w-[55%] h-full flex-shrink-0 overflow-hidden">

        <BackgroundEffects ref={bgRef} onChapterChange={handleChapterChange} />

        {/* Gradient vignette — fades canvas edges into the bg */}
        <div className="canvas-vignette absolute inset-0 pointer-events-none z-[2]" />

        {/* Vertical chapter dot-nav */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
          {sections.map((s, i) => (
            <div key={s.id} className="flex flex-col items-center">
              {i > 0 && (
                <div className="w-px h-5 bg-white/[.07]" />
              )}
              <div className={`nav-dot${activeChapter === i ? ' active' : ''}`} />
            </div>
          ))}
        </div>

        {/* Chapter label at bottom */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 whitespace-nowrap">
          <div
            className="w-8 h-px flex-shrink-0"
            style={{ background: '#FF6230' }}
          />
          <span className="font-condensed font-light text-[.68rem] tracking-[.45em] uppercase text-white/35 transition-all duration-500">
            {chapterLabel}
          </span>
        </div>
      </div>

      {/* ════════ RIGHT — Content cards ════════ */}
      <div className="relative w-[45%] h-full">
        {sections.map((section, i) => (
          <AnimatedTextCard
            key={section.id}
            data={section}
            ref={(el) => { cardRefs.current[i] = el }}
          />
        ))}
      </div>
    </section>
  )
}
