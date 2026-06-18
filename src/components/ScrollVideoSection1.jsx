import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AnimatedTextCard from './AnimatedTextCard'
import VideoUploader from './VideoUploader'
import { sections } from '../data/sections'
import { useOwnerAuth } from '../context/OwnerAuthContext'

gsap.registerPlugin(ScrollTrigger)

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function ScrollVideoSection1() {
  const { isOwner } = useOwnerAuth()
  const sectionRef      = useRef(null)
  const videoRef        = useRef(null)
  const videoDuration   = useRef(1)
  const videoTargetTime = useRef(0)
  const videoFrame      = useRef(null)
  const cardRefs        = useRef([])         // array of card DOM nodes for GSAP
  const tlRef           = useRef(null)       // GSAP timeline ref

  const [activeChapter, setActiveChapter] = useState(0)
  const [chapterLabel,  setChapterLabel]  = useState('Chapter One')
  const [autoplayEnabled, setAutoplayEnabled] = useState(false)
  const autoplayEnabledRef = useRef(false)
  const [videoUrl, setVideoUrl] = useState('/videos/nikki1.mp4')
  const [videoKey] = useState('section-1')

  // Fetch video from database on mount
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await fetch(`${API_URL}/videos/${videoKey}`)
        const data = await res.json()
        if (data.success && data.video) {
          setVideoUrl(data.video.url)
        }
      } catch (error) {
        console.error('Error fetching video:', error)
      }
    }
    fetchVideo()
  }, [videoKey])

  const handleVideoUploadSuccess = (video) => {
    setVideoUrl(video.url)
    // Reset video player
    if (videoRef.current) {
      videoRef.current.src = video.url
      videoRef.current.load()
    }
  }

  useEffect(() => {
    autoplayEnabledRef.current = autoplayEnabled
    const video = videoRef.current
    if (!video || video.readyState < 2) return
    if (autoplayEnabled) {
      video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [autoplayEnabled])

  useEffect(() => {
    const cards = cardRefs.current
    let currentChapter = 0

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
      end: '+=2000',
      scrub: 1.2,
      pin: true,
      anticipatePin: 1,
      onUpdate(self) {
        tl.progress(self.progress)

        const chapterIndex = Math.min(sections.length - 1, Math.floor(self.progress * sections.length))
        if (chapterIndex !== currentChapter) {
          currentChapter = chapterIndex
          setActiveChapter(chapterIndex)
          setChapterLabel(sections[chapterIndex].chapter)
        }

        const clipProgress = Math.min(Math.max(self.progress, 0), 1)
        videoTargetTime.current = clipProgress * videoDuration.current
      },
    })

    const animateVideo = () => {
      const video = videoRef.current
      if (video?.readyState >= 2 && !autoplayEnabledRef.current) {
        const desired = videoTargetTime.current
        const current = video.currentTime
        const delta = desired - current
        if (Math.abs(delta) > 0.03) {
          video.currentTime = current + delta * 0.09
        } else if (Math.abs(delta) > 0.0005) {
          video.currentTime = desired
        }
      }
      videoFrame.current = requestAnimationFrame(animateVideo)
    }

    animateVideo()

    return () => {
      cancelAnimationFrame(videoFrame.current)
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
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full "
          src={videoUrl}
          muted
          playsInline
          preload="auto"
          onLoadedMetadata={() => {
            const video = videoRef.current
            if (!video) return
            videoDuration.current = video.duration || 1
            video.currentTime = 0
          }}
        />

        {/* Gradient vignette — fades canvas edges into the bg */}
        <div className="canvas-vignette absolute inset-0 pointer-events-none z-[2]" />
        
        {/* Video upload button for owner */}
        {isOwner && (
          <div className="absolute top-8 right-8 z-20">
            <VideoUploader sectionId="section-1" onUploadSuccess={handleVideoUploadSuccess} />
          </div>
        )}
        <div className="absolute bottom-8 right-8 z-20">
          <button
            type="button"
            onClick={() => setAutoplayEnabled((value) => !value)}
            aria-label={autoplayEnabled ? 'Pause autoplay' : 'Enable autoplay'}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white transition duration-300 hover:bg-cyan/90 hover:text-slate-950"
          >
            <span className="text-xl">
              {autoplayEnabled ? '❚❚' : '↻'}
            </span>
          </button>
        </div>

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
          <div
            key={section.id}
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: activeChapter === i ? 'auto' : 'none',
              zIndex: activeChapter === i ? 10 : 0
            }}
          >
            <AnimatedTextCard
              data={section}
              ref={(el) => { cardRefs.current[i] = el }}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
