import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AnimatedTextCard1 from './AnimatedTextCard1'
import VideoUploader from './VideoUploader'
import { useOwnerAuth } from '../context/OwnerAuthContext'

gsap.registerPlugin(ScrollTrigger)

const bebasNeue = { fontFamily: "'Bebas Neue', sans-serif" }
const syne      = { fontFamily: "'Syne', sans-serif" }
const dmSans    = { fontFamily: "'DM Sans', sans-serif" }

const sections = [
  {
    id: 'c2-1',
    num: '01',
    chapter: 'Chapter Two · I',
    title: 'Eyes That',
    titleAccent: 'See Everything',
    subtitle: 'Sensor Fusion',
    body: 'Ultrasonic, IR, and LiDAR sensors fused into a single perception layer. Your robot doesn\'t just detect obstacles — it maps, predicts, and adapts in real time.',
    accent: '#00F5FF',
    rgb: '0,245,255',
  },
  {
    id: 'c2-2',
    num: '02',
    chapter: 'Chapter Two · II',
    title: 'Precision',
    titleAccent: 'In Motion',
    subtitle: 'Motor Control',
    body: 'PID-tuned motor drivers and encoder feedback give robots silky-smooth, repeatable movement. From differential drive to mecanum wheels — full control.',
    accent: '#FF6B35',
    rgb: '255,107,53',
  },
  {
    id: 'c2-3',
    num: '03',
    chapter: 'Chapter Two · III',
    title: 'Command',
    titleAccent: 'From Anywhere',
    subtitle: 'Wireless Link',
    body: 'ESP-NOW, BLE, and WiFi protocols keep your robot connected — latency under 12 ms. Build remote dashboards, live telemetry feeds, and OTA updates.',
    accent: '#A855F7',
    rgb: '168,85,247',
  },
  {
    id: 'c2-4',
    num: '04',
    chapter: 'Chapter Two · IV',
    title: 'Run Longer,',
    titleAccent: 'Work Harder',
    subtitle: 'Power Systems',
    body: 'LiPo battery management, voltage regulation, and deep-sleep scheduling extend runtime by up to 3×. Smart power = more time doing, less time charging.',
    accent: '#FF006E',
    rgb: '255,0,110',
  },
]

export default function ScrollVideoSection2() {
  const sectionRef      = useRef(null)
  const videoRef        = useRef(null)
  const videoDuration   = useRef(1)
  const videoTargetTime = useRef(0)
  const videoFrame      = useRef(null)
  const cardRefs        = useRef([])
  const tlRef           = useRef(null)

  const { isOwner } = useOwnerAuth()

  const [activeChapter, setActiveChapter] = useState(0)
  const [chapterLabel,  setChapterLabel]  = useState('Chapter Two')
  const [autoplayEnabled, setAutoplayEnabled] = useState(false)
  const [videoUrl, setVideoUrl] = useState('/videos/nikki1.mp4')
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : false)
  const autoplayEnabledRef = useRef(false)

  const staticSections = sections.slice(1)

  useEffect(() => {
    autoplayEnabledRef.current = autoplayEnabled
    const video = videoRef.current
    if (!video || video.readyState < 2) return
    if (autoplayEnabled) video.play().catch(() => {})
    else video.pause()
  }, [autoplayEnabled])

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await fetch('/api/videos/page/chapter-two')
        if (res.ok) {
          const data = await res.json()
          if (data.success && data.videos && data.videos.length > 0) {
            // Use base64 src data from first video
            setVideoUrl(data.videos[0].src)
          }
        }
      } catch (err) {
        console.error('Error fetching video:', err)
      }
    }
    fetchVideo()
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      videoDuration.current = video.duration || 1
      video.currentTime = 0
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.load()

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [videoUrl, isMobile])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 767px)')
    const handleMediaChange = (event) => setIsMobile(event.matches)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange)
    } else {
      mediaQuery.addListener(handleMediaChange)
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMediaChange)
      } else {
        mediaQuery.removeListener(handleMediaChange)
      }
    }
  }, [])

  const handleVideoUploadSuccess = (videoData) => {
    // Use base64 src data from uploaded video
    setVideoUrl(videoData.src)
    const video = videoRef.current
    if (video) {
      video.src = videoData.src
      video.load()
    }
  }

  useEffect(() => {
    const cards = isMobile ? [cardRefs.current[0]] : cardRefs.current
    let currentChapter = 0

    const tl = gsap.timeline({ paused: true })
    tlRef.current = tl

    cards.forEach((card, i) => {
      if (!card) return
      const s    = i * 0.25
      const rule = card.querySelector('.card-rule')

      tl.fromTo(
        card,
        { opacity: 0, y: 20, filter: 'blur(8px)' },
        { opacity: 1, y: 0,  filter: 'blur(0px)', ease: 'power2.out', duration: 0.12 },
        s,
      )
      if (rule) {
        tl.fromTo(
          rule,
          { scaleX: 0, transformOrigin: 'left center' },
          { scaleX: 1, ease: 'power2.out', duration: 0.1 },
          s + 0.04,
        )
      }
      if (!isMobile && i < sections.length - 1) {
        tl.to(
          card,
          { opacity: 0, y: -20, filter: 'blur(8px)', ease: 'power2.in', duration: 0.12 },
          (i + 1) * 0.25 - 0.12,
        )
      }
    })

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: isMobile ? '+=1400' : '+=2000',
      scrub: 1.0,
      pin: true,
      pinSpacing: true,
      pinType: 'fixed',
      anticipatePin: 1,
      onUpdate(self) {
        tl.progress(self.progress)
        const idx = Math.min(sections.length - 1, Math.floor(self.progress * sections.length))
        if (idx !== currentChapter) {
          currentChapter = idx
          setActiveChapter(idx)
          setChapterLabel(sections[idx].chapter)
        }
        videoTargetTime.current = Math.min(Math.max(self.progress, 0), 1) * videoDuration.current
      },
    })

    const animateVideo = () => {
      const video = videoRef.current
      if (video?.readyState >= 2 && !autoplayEnabledRef.current) {
        const desired = videoTargetTime.current
        const current = video.currentTime
        const delta   = desired - current
        if (Math.abs(delta) > 0.05)     video.currentTime = current + delta * 0.15
        else if (Math.abs(delta) > 0.01) video.currentTime = current + delta * 0.3
        else video.currentTime = desired
      }
      videoFrame.current = requestAnimationFrame(animateVideo)
    }
    animateVideo()

    return () => {
      cancelAnimationFrame(videoFrame.current)
      st.kill()
      tl.kill()
    }
  }, [isMobile])

  return (
    <>
      <section ref={sectionRef} className="relative min-h-screen h-screen flex flex-col overflow-hidden" style={{ zIndex: 0 }}>

        {isMobile ? (
          <div className="w-full flex flex-col">
            <div className="w-full h-[44vh] sm:h-[48vh] overflow-hidden relative">
              <video
                key="mobile-video"
                ref={videoRef}
                className="absolute inset-0 h-full w-full"
                src={videoUrl}
                muted
                playsInline
                preload="auto"
              />
            </div>

            <div className="w-full px-4 py-8 relative">
              <AnimatedTextCard1
                data={sections[0]}
                staticMode
                ref={(el) => { cardRefs.current[0] = el }}
              />
            </div>
          </div>
        ) : (
          <div className="relative flex h-full overflow-hidden">
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
                  <AnimatedTextCard1
                    data={section}
                    ref={(el) => { cardRefs.current[i] = el }}
                  />
                </div>
              ))}
            </div>

            <div className="relative w-[55%] h-full flex-shrink-0 overflow-hidden">
              <video
                key="desktop-video"
                ref={videoRef}
                className="absolute inset-0 h-full w-full"
                src={videoUrl}
                muted
                playsInline
                preload="auto"
              />

              {isOwner && (
                <div className="absolute top-8 right-10 z-20">
                  <VideoUploader sectionId="chapter-two" onUploadSuccess={handleVideoUploadSuccess} />
                </div>
              )}

              <div
                className="absolute inset-0 pointer-events-none z-[2]"
                style={{
                  background:
                    'linear-gradient(to right, #050508 0%, transparent 30%, transparent 70%, #050508 100%), linear-gradient(to bottom, #050508 0%, transparent 12%, transparent 88%, #050508 100%)',
                }}
              />

              <div className="absolute bottom-8 right-10 z-20">
                <button
                  type="button"
                  onClick={() => setAutoplayEnabled((v) => !v)}
                  aria-label={autoplayEnabled ? 'Pause autoplay' : 'Enable autoplay'}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white transition duration-300 hover:bg-[#FF6B35]/90"
                >
                  <span className="text-xl">{autoplayEnabled ? '❚❚' : '↻'}</span>
                </button>
              </div>

              <div className="absolute right-8 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                {sections.map((s, i) => (
                  <div key={s.id} className="flex flex-col items-center">
                    {i > 0 && <div className="w-px h-5 bg-white/[.07]" />}
                    <div
                      className="w-1.5 h-1.5 rounded-full border border-white/20 transition-all duration-500"
                      style={activeChapter === i
                        ? { background: sections[i].accent, borderColor: sections[i].accent, boxShadow: `0 0 8px ${sections[i].accent}` }
                        : { background: 'transparent' }
                      }
                    />
                  </div>
                ))}
              </div>

              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-3 whitespace-nowrap">
                <div className="w-8 h-px flex-shrink-0 transition-all duration-500" style={{ background: sections[activeChapter].accent }} />
                <span
                  className="font-light text-[.68rem] tracking-[.45em] uppercase text-white/35 transition-all duration-500"
                  style={syne}
                >
                  {chapterLabel}
                </span>
              </div>
            </div>
          </div>
        )}
      </section>

      {isMobile ? (
        <div className="bg-[#020203] px-4 py-12">
          <div className="mx-auto max-w-6xl space-y-6">
            {staticSections.map((section) => (
              <AnimatedTextCard1 key={section.id} data={section} staticMode />
            ))}
          </div>
        </div>
      ) : null}
    </>
  )
}
