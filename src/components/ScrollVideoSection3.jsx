import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import AnimatedTextCard from './AnimatedTextCard'
import VideoUploader from './VideoUploader'
import { useOwnerAuth } from '../context/OwnerAuthContext'

gsap.registerPlugin(ScrollTrigger)

const bebasNeue = { fontFamily: "'Bebas Neue', sans-serif" }
const syne      = { fontFamily: "'Syne', sans-serif" }
const dmSans    = { fontFamily: "'DM Sans', sans-serif" }

const sections = [
  {
    id: 'c3-1',
    num: '01',
    chapter: 'Chapter Three · I',
    title: 'Machines That',
    titleAccent: 'Understand',
    subtitle: 'Computer Vision',
    body: 'OpenCV pipelines running on Raspberry Pi classify objects, track faces, and read QR codes at 30 fps. Vision modules plug straight into your robot\'s decision layer.',
    accent: '#00F5FF',
    rgb: '0,245,255',
  },
  {
    id: 'c3-2',
    num: '02',
    chapter: 'Chapter Three · II',
    title: 'Navigate',
    titleAccent: 'The Unknown',
    subtitle: 'Path Planning',
    body: 'A* and Dijkstra algorithms on embedded hardware. Give your robot a map — or let it build one with SLAM. Autonomous navigation that works in real, unstructured spaces.',
    accent: '#FF6B35',
    rgb: '255,107,53',
  },
  {
    id: 'c3-3',
    num: '03',
    chapter: 'Chapter Three · III',
    title: 'Intelligence',
    titleAccent: 'At The Source',
    subtitle: 'Edge AI',
    body: 'TensorFlow Lite models quantized to run entirely on-device. No cloud dependency, no latency. Gesture recognition, voice commands, anomaly detection — all offline.',
    accent: '#A855F7',
    rgb: '168,85,247',
  },
  {
    id: 'c3-4',
    num: '04',
    chapter: 'Chapter Three · IV',
    title: 'Your Robot.',
    titleAccent: 'Your Rules.',
    subtitle: 'The Build',
    body: 'Every concept taught across this program converges in a single capstone build. Students ship a fully autonomous robot from CAD sketch to competition-ready prototype.',
    accent: '#FF006E',
    rgb: '255,0,110',
  },
]

export default function ScrollVideoSection3() {
  const sectionRef      = useRef(null)
  const videoRef        = useRef(null)
  const videoDuration   = useRef(1)
  const videoTargetTime = useRef(0)
  const videoFrame      = useRef(null)
  const cardRefs        = useRef([])
  const tlRef           = useRef(null)

  const { isOwner } = useOwnerAuth()

  const [activeChapter, setActiveChapter] = useState(0)
  const [chapterLabel,  setChapterLabel]  = useState('Chapter Three')
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
        const res = await fetch('/api/videos/page/chapter-three')
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
        { opacity: 0, y: 68, filter: 'blur(14px)' },
        { opacity: 1, y: 0,  filter: 'blur(0px)', ease: 'power3.out', duration: 0.10 },
        s,
      )
      if (rule) {
        tl.fromTo(
          rule,
          { scaleX: 0, transformOrigin: 'left center' },
          { scaleX: 1, ease: 'power2.out', duration: 0.09 },
          s + 0.03,
        )
      }
      if (!isMobile && i < sections.length - 1) {
        tl.to(
          card,
          { opacity: 0, y: -55, filter: 'blur(12px)', ease: 'power2.in', duration: 0.10 },
          (i + 1) * 0.25,
        )
      }
    })

    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: isMobile ? '+=1400' : '+=2000',
      scrub: 1.2,
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
        if (Math.abs(delta) > 0.03)      video.currentTime = current + delta * 0.09
        else if (Math.abs(delta) > 5e-4) video.currentTime = desired
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
              <AnimatedTextCard
                data={sections[0]}
                staticMode
                ref={(el) => { cardRefs.current[0] = el }}
              />
            </div>
          </div>
        ) : (
          <div className="relative flex h-full overflow-hidden">
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
                <div className="absolute top-8 left-10 z-20">
                  <VideoUploader sectionId="chapter-three" onUploadSuccess={handleVideoUploadSuccess} />
                </div>
              )}

              <div
                className="absolute inset-0 pointer-events-none z-[2]"
                style={{
                  background:
                    'linear-gradient(to right, #050508 0%, transparent 25%, transparent 75%, #050508 100%), linear-gradient(to bottom, #050508 0%, transparent 12%, transparent 88%, #050508 100%)',
                }}
              />

              <div className="absolute bottom-8 right-8 z-20">
                <button
                  type="button"
                  onClick={() => setAutoplayEnabled((v) => !v)}
                  aria-label={autoplayEnabled ? 'Pause autoplay' : 'Enable autoplay'}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white transition duration-300 hover:bg-[#FF6B35]/90"
                >
                  <span className="text-xl">{autoplayEnabled ? '❚❚' : '↻'}</span>
                </button>
              </div>

              <div className="absolute left-8 top-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
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

            <div className="relative w-[45%] h-full pl-8 pr-16">
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
          </div>
        )}
      </section>

      {isMobile ? (
        <div className="bg-[#020203] px-4 py-12">
          <div className="mx-auto max-w-6xl space-y-6">
            {staticSections.map((section) => (
              <AnimatedTextCard key={section.id} data={section} staticMode />
            ))}
          </div>
        </div>
      ) : null}
    </>
  )
}
