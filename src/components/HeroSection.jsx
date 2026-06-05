import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function HeroSection() {
  const wrapRef    = useRef(null)
  const stickyRef  = useRef(null)
  const canvasRef  = useRef(null)
  const videoRef   = useRef(null)
  const overlayRef = useRef(null)
  const wlineRef   = useRef(null)
  const nimoRef    = useRef(null)
  const labsRef    = useRef(null)
  const taglineRef = useRef(null)
  const ctaRef     = useRef(null)
  const shintRef   = useRef(null)

  /* ── animated canvas background ── */
  useEffect(() => {
    const cv  = canvasRef.current
    const ctx = cv.getContext('2d')
    let W, H, t = 0, rafId

    const resize = () => { W = cv.width = window.innerWidth; H = cv.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    const orbs = [
      { r:300, hu:205, sp:0.00025, ph:0.0 },
      { r:360, hu:218, sp:0.00032, ph:1.3 },
      { r:260, hu:195, sp:0.00028, ph:2.7 },
      { r:220, hu:210, sp:0.00040, ph:4.1 },
      { r:240, hu:200, sp:0.00035, ph:5.5 },
    ]

    const frame = () => {
      t += 0.012
      ctx.fillStyle = '#010408'
      ctx.fillRect(0, 0, W, H)
      orbs.forEach((o, i) => {
        const ox = W * (0.15 + i * 0.18) + Math.sin(t * o.sp * 100 + o.ph) * W * 0.12
        const oy = H * (0.25 + i * 0.12) + Math.cos(t * o.sp * 80  + o.ph) * H * 0.10
        const gr = ctx.createRadialGradient(ox, oy, 0, ox, oy, o.r)
        gr.addColorStop(0, `hsla(${o.hu},70%,20%,0.22)`)
        gr.addColorStop(1, 'transparent')
        ctx.fillStyle = gr
        ctx.fillRect(0, 0, W, H)
      })
      rafId = requestAnimationFrame(frame)
    }
    frame()
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(rafId) }
  }, [])

  /* ── GSAP scroll reveal ── */
  useEffect(() => {
    const ctx = gsap.context(() => {

      /* build letter spans */
      const mkSpans = (el, text) => {
        el.innerHTML = ''
        text.split('').forEach(ch => {
          const sp = document.createElement('span')
          sp.className   = 'hero-letter'
          sp.textContent = ch === ' ' ? '\u00A0' : ch
          el.appendChild(sp)
        })
        return el.querySelectorAll('.hero-letter')
      }

      const wL = mkSpans(wlineRef.current, 'WELCOME TO')
      const nL = mkSpans(nimoRef.current,  'NIMO')
      const lL = mkSpans(labsRef.current,  'LABS')

      gsap.set(wL,          { opacity:0, y:24 })
      gsap.set(nL,          { opacity:0, y:50 })
      gsap.set(lL,          { opacity:0, y:50 })
      gsap.set(taglineRef.current, { opacity:0, y:16 })
      gsap.set(ctaRef.current,     { opacity:0, y:14 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapRef.current,
          start:   'top top',
          end:     '+=150%',
          pin:     stickyRef.current,
          scrub:   0.7,
          anticipatePin: 1,
        },
      })

      tl.to(overlayRef.current, { opacity:0.72, duration:1, ease:'none'                          }, 0   )
      tl.to(canvasRef.current,  { scale:1.07,   duration:4, ease:'none'                          }, 0   )
      tl.to(videoRef.current,   { scale:1.07,   duration:4, ease:'none'                          }, 0   )
      tl.to(shintRef.current,   { opacity:0,    duration:0.3                                     }, 0   )
      tl.to(wL,                 { opacity:1, y:0, stagger:0.05, duration:0.9, ease:'power3.out'  }, 0.5 )
      tl.to(nL,                 { opacity:1, y:0, stagger:0.09, duration:1.1, ease:'expo.out'    }, 1.2 )
      tl.to(lL,                 { opacity:1, y:0, stagger:0.09, duration:1.1, ease:'expo.out'    }, 1.65)
      tl.to(taglineRef.current, { opacity:1, y:0, duration:0.8, ease:'power2.out'                }, 2.5 )
      tl.to(ctaRef.current,     { opacity:1, y:0, duration:0.7, ease:'power2.out'                }, 3.0 )

    }, wrapRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={wrapRef} className="relative" style={{ height:'250vh' }}>
      <div ref={stickyRef} className="w-full overflow-hidden" style={{ height:'100vh' }}>

        {/* canvas bg */}
        <canvas ref={canvasRef} className="absolute inset-0 z-0 w-full h-full" />

        {/* video (drop your video at /public/videos/hero.mp4) */}
        <video ref={videoRef} className="absolute inset-0 z-[1] w-full h-full object-cover"
          src="/videos/nimo 2 draft..mp4" autoPlay muted loop playsInline
          onError={e => { e.target.style.display = 'none' }} />

        {/* overlay */}
        <div ref={overlayRef} className="absolute inset-0 z-[2] opacity-30"
          style={{ background:'linear-gradient(to bottom,rgba(1,4,8,.5) 0%,rgba(1,4,8,.05) 40%,rgba(1,4,8,.85) 100%)' }} />

        {/* fades */}
        <div className="absolute top-0 left-0 right-0 h-24 z-[3] pointer-events-none"
          style={{ background:'linear-gradient(to bottom,#010408,transparent)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-36 z-[3] pointer-events-none"
          style={{ background:'linear-gradient(to top,#010408,transparent)' }} />

        {/* grain */}
        <div className="grain absolute inset-0 z-[3] pointer-events-none opacity-[.03]" />

        {/* hero text */}
        <div className="absolute inset-0 z-[10] flex flex-col items-center justify-center
          text-center pointer-events-none select-none">

          {/* WELCOME TO */}
          <div ref={wlineRef}
            className="flex font-mono tracking-[.55em] uppercase text-white/65 mb-3"
            style={{ fontSize:'clamp(11px,1.6vw,18px)' }} />

          {/* NIMO LABS */}
          <div className="leading-[.9]">
            <div ref={nimoRef} className="flex justify-center"
              style={{
                fontSize:'clamp(56px,13vw,190px)', fontWeight:900, fontFamily:'monospace',
                letterSpacing:'-.02em', color:'transparent',
                WebkitTextStroke:'1.5px rgba(255,255,255,.88)',
                textShadow:'0 0 80px rgba(0,245,255,.2)',
              }} />
            <div ref={labsRef} className="flex justify-center"
              style={{
                fontSize:'clamp(56px,13vw,190px)', fontWeight:900, fontFamily:'monospace',
                letterSpacing:'-.02em', color:'transparent',
                WebkitTextStroke:'1.5px rgba(0,245,255,.9)',
                textShadow:'0 0 60px rgba(0,245,255,.6)',
              }} />
          </div>

          {/* tagline */}
          <div ref={taglineRef}
            className="mt-7 font-mono uppercase text-white/42"
            style={{ fontSize:'clamp(10px,1.2vw,14px)', letterSpacing:'.42em' }}>
            Robotics &nbsp;·&nbsp; Innovation &nbsp;·&nbsp; Education
          </div>

          {/* CTA */}
          <div ref={ctaRef} className="mt-8 flex gap-4 flex-wrap justify-center pointer-events-auto">
            <button className="font-mono text-[11px] tracking-[3px] uppercase font-bold
              bg-cyan text-bg border-none px-8 py-3.5 cursor-pointer
              shadow-[0_0_24px_rgba(0,245,255,.3)] hover:bg-white hover:shadow-[0_0_50px_rgba(0,245,255,.5)]
              transition-all duration-300">
              Explore Now
            </button>
            <button className="font-mono text-[11px] tracking-[3px] uppercase
              border border-white/25 text-white/75 bg-transparent px-8 py-3.5 cursor-pointer
              hover:border-cyan/60 hover:text-cyan transition-all duration-300 backdrop-blur-sm">
              Book Workshop
            </button>
          </div>
        </div>

        {/* scroll hint */}
        <div ref={shintRef}
          className="absolute bottom-9 left-1/2 -translate-x-1/2 z-[15]
            flex flex-col items-center gap-1.5 text-white/32 pointer-events-none">
          <p className="font-mono text-[9px] tracking-[4px] uppercase">Scroll</p>
          <div className="w-px h-11 animate-sLine"
            style={{ background:'linear-gradient(to bottom,rgba(255,255,255,.32),transparent)' }} />
          <svg className="animate-sChev" width="14" height="8" viewBox="0 0 14 8" fill="none">
            <path d="M1 1L7 7L13 1" stroke="rgba(255,255,255,.32)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>

        {/* corner data */}
        <div className="absolute bottom-8 left-9 z-[15] pointer-events-none hidden md:block">
          <p className="font-mono text-[9px] tracking-[3px] uppercase text-white/22">Est. 2025</p>
          <p className="font-mono text-[9px] tracking-[3px] uppercase text-white/14 mt-1">Udaipur, India</p>
        </div>
        <div className="absolute bottom-8 right-9 z-[15] pointer-events-none hidden md:block text-right">
          <p className="font-mono text-[9px] tracking-[3px] uppercase text-white/22">Nimo Labs</p>
          <div className="flex items-center justify-end gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse2 opacity-70" />
            <p className="font-mono text-[9px] tracking-[2px] uppercase text-cyan/45">Live</p>
          </div>
        </div>

      </div>
    </div>
  )
}
