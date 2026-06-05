import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'

/* ─────────────────────────────────────────────
   LoadingScreen
   Props:
     onComplete — called when loading finishes
───────────────────────────────────────────── */
export default function LoadingScreen({ onComplete }) {
  const bgCanvasRef    = useRef(null)
  const robotCanvasRef = useRef(null)
  const speechRef      = useRef(null)
  const progressFill   = useRef(null)
  const progressPct    = useRef(null)
  const progressLabel  = useRef(null)
  const progressBlock  = useRef(null)
  const brandLine      = useRef(null)
  const cornerBadge    = useRef(null)
  const outroRef       = useRef(null)
  const stepRefs       = [useRef(null), useRef(null), useRef(null), useRef(null)]

  /* ── Particle Background ── */
  useEffect(() => {
    const canvas = bgCanvasRef.current
    const ctx    = canvas.getContext('2d')
    let W, H, animId
    const pts = []

    const resize = () => {
      W = canvas.width  = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    class Particle {
      constructor() { this.reset(true) }
      reset(init) {
        this.x  = Math.random() * W
        this.y  = init ? Math.random() * H : H + 4
        this.vx = (Math.random() - 0.5) * 0.3
        this.vy = -(Math.random() * 0.4 + 0.1)
        this.r  = Math.random() * 1.5 + 0.3
        this.a  = Math.random() * 0.6 + 0.1
      }
      update() { this.x += this.vx; this.y += this.vy; if (this.y < -4) this.reset(false) }
      draw()   { ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(0,245,255,${this.a})`; ctx.fill() }
    }

    for (let i = 0; i < 120; i++) pts.push(new Particle())

    const frame = () => {
      ctx.clearRect(0, 0, W, H)
      pts.forEach(p => { p.update(); p.draw() })
      animId = requestAnimationFrame(frame)
    }
    frame()

    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(animId) }
  }, [])

  /* ── Three.js Robot + GSAP ── */
  useEffect(() => {
    /* ── Renderer ── */
    const renderer = new THREE.WebGLRenderer({
      canvas:    robotCanvasRef.current,
      antialias: true,
      alpha:     true,
    })
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    renderer.setSize(innerWidth, innerHeight)

    const scene  = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100)
    camera.position.set(0, 0.4, 5.5)

    const handleResize = () => {
      camera.aspect = innerWidth / innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(innerWidth, innerHeight)
    }
    window.addEventListener('resize', handleResize)

    /* ── Lights ── */
    scene.add(new THREE.AmbientLight(0x001122, 2))
    const keyLight = new THREE.DirectionalLight(0x00f5ff, 6)
    keyLight.position.set(-3, 4, 4)
    scene.add(keyLight)
    const rimLight = new THREE.DirectionalLight(0x0066ff, 4)
    rimLight.position.set(4, 2, -3)
    scene.add(rimLight)
    const fillLight = new THREE.PointLight(0xff6b00, 3, 12)
    fillLight.position.set(2, -1, 3)
    scene.add(fillLight)

    /* ── Materials ── */
    const bodyMat   = new THREE.MeshStandardMaterial({ color: 0x0a1a2e, metalness: 0.9, roughness: 0.15 })
    const accentMat = new THREE.MeshStandardMaterial({ color: 0x00f5ff, emissive: 0x00f5ff, emissiveIntensity: 0.8, metalness: 0.3, roughness: 0.2 })
    const eyeMat    = new THREE.MeshStandardMaterial({ color: 0x00f5ff, emissive: 0x00f5ff, emissiveIntensity: 2 })
    const darkMat   = new THREE.MeshStandardMaterial({ color: 0x050e1a, metalness: 0.7, roughness: 0.3 })
    const orangeMat = new THREE.MeshStandardMaterial({ color: 0xff6b00, emissive: 0xff6b00, emissiveIntensity: 1.2 })

    /* ── Helpers ── */
    const box = (w, h, d, mat, x = 0, y = 0, z = 0) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d, 2, 2, 2), mat)
      m.position.set(x, y, z)
      return m
    }
    const cyl = (rt, rb, h, mat, x = 0, y = 0, z = 0) => {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, 16), mat)
      m.position.set(x, y, z)
      return m
    }
    const sph = (r, mat, x = 0, y = 0, z = 0) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(r, 24, 24), mat)
      m.position.set(x, y, z)
      return m
    }

    /* ── Robot ── */
    const robot = new THREE.Group()
    scene.add(robot)
    robot.position.y = -3.5

    // Head
    const head = new THREE.Group()
    robot.add(head)
    head.add(box(2, 1.7, 1.8, bodyMat))
    head.add(box(1.6, 0.18, 1.4, darkMat, 0, 0.94, 0))
    head.add(box(1.65, 0.08, 0.04, accentMat, 0, 0.55, 0.91))
    head.add(box(1.75, 1.3, 0.08, darkMat, 0, -0.05, 0.92))

    // Eyes
    const eyeL    = sph(0.18, eyeMat, -0.42, 0.15, 1.02)
    const eyeR    = sph(0.18, eyeMat, 0.42, 0.15, 1.02)
    const eyeRingL = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.03, 8, 24), accentMat)
    const eyeRingR = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.03, 8, 24), accentMat)
    eyeRingL.position.set(-0.42, 0.15, 1.0)
    eyeRingR.position.set(0.42, 0.15, 1.0)
    head.add(eyeL, eyeR, eyeRingL, eyeRingR)

    // Mouth
    head.add(box(0.9, 0.07, 0.04, accentMat, 0, -0.32, 0.96))
    for (let i = -2; i <= 2; i++) {
      head.add(sph(0.04, i === 0 ? orangeMat : accentMat, i * 0.14, -0.32, 0.99))
    }

    // Cheek vents
    for (const s of [-1, 1]) {
      head.add(box(0.04, 0.3, 0.5, darkMat, s * 1.02, -0.1, 0.1))
      for (let i = -2; i <= 2; i++) head.add(box(0.02, 0.03, 0.35, accentMat, s * 1.04, -0.1 + i * 0.055, 0.1))
    }

    // Antenna + side lights
    head.add(sph(0.07, orangeMat, -1.05, 0.7, 0.2))
    head.add(sph(0.07, accentMat, 1.05, 0.7, 0.2))
    head.add(cyl(0.025, 0.035, 0.55, accentMat, 0, 1.22, 0))
    head.add(sph(0.07, orangeMat, 0, 1.52, 0))

    // Ears
    for (const s of [-1, 1]) {
      head.add(box(0.12, 0.8, 0.9, darkMat, s * 1.1, 0.1, -0.1))
      for (const j of [0.2, 0, -0.2]) head.add(box(0.06, 0.12, 0.12, accentMat, s * 1.14, j, 0.1))
    }

    // Neck
    const neck = new THREE.Group()
    robot.add(neck)
    neck.position.y = -0.9
    neck.add(cyl(0.22, 0.28, 0.4, bodyMat))
    neck.add(cyl(0.3, 0.3, 0.1, darkMat, 0, -0.22, 0))

    // Shoulders / Chest
    const shoulders = new THREE.Group()
    robot.add(shoulders)
    shoulders.position.y = -1.55
    shoulders.add(box(2.2, 0.5, 1.4, bodyMat, 0, 0.05, 0))
    shoulders.add(box(0.55, 0.55, 0.5, bodyMat, -1.3, 0.1, 0))
    shoulders.add(box(0.55, 0.55, 0.5, bodyMat, 1.3, 0.1, 0))
    shoulders.add(box(1.6, 0.04, 0.04, accentMat, 0, 0.28, 0.72))
    const logoRing = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.05, 8, 24), accentMat)
    logoRing.position.set(0, -0.05, 0.72)
    shoulders.add(logoRing)
    shoulders.add(sph(0.15, orangeMat, 0, -0.05, 0.74))

    // Holo rings
    const holoRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.6, 0.02, 8, 80),
      new THREE.MeshBasicMaterial({ color: 0x00f5ff, transparent: true, opacity: 0.4 })
    )
    holoRing.rotation.x = Math.PI / 2.2
    holoRing.position.y = -0.2
    robot.add(holoRing)

    const holoRing2 = new THREE.Mesh(
      new THREE.TorusGeometry(1.9, 0.015, 8, 80),
      new THREE.MeshBasicMaterial({ color: 0x0066ff, transparent: true, opacity: 0.25 })
    )
    holoRing2.rotation.x = Math.PI / 2.4
    holoRing2.rotation.z = 0.3
    holoRing2.position.y = -0.2
    robot.add(holoRing2)

    // Floating cubes
    const cubes = []
    const cubeMat  = new THREE.MeshStandardMaterial({ color: 0x00f5ff, emissive: 0x00f5ff, emissiveIntensity: 0.6, transparent: true, opacity: 0.7 })
    const cubeWire = new THREE.MeshBasicMaterial({ color: 0x00f5ff, wireframe: true, transparent: true, opacity: 0.35 })
    for (let i = 0; i < 8; i++) {
      const size  = Math.random() * 0.12 + 0.06
      const cube  = new THREE.Group()
      cube.add(new THREE.Mesh(new THREE.BoxGeometry(size, size, size), i % 2 === 0 ? cubeMat : cubeWire))
      const angle  = (i / 8) * Math.PI * 2
      const radius = 2.8 + Math.random() * 0.5
      cube.position.set(Math.cos(angle) * radius, (Math.random() - 0.5) * 2, Math.sin(angle) * radius - 1)
      cube.userData = { angle, radius, speed: Math.random() * 0.004 + 0.002, yOff: Math.random() * Math.PI * 2 }
      scene.add(cube)
      cubes.push(cube)
    }

    /* ── Mouse parallax ── */
    let mx = 0, my = 0
    const onMouseMove = e => {
      mx = (e.clientX / innerWidth - 0.5) * 2
      my = (e.clientY / innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', onMouseMove)

    /* ── Render loop ── */
    let t = 0, rafId
    const animate = () => {
      rafId = requestAnimationFrame(animate)
      t += 0.016

      robot.position.y = robot.userData.baseY !== undefined
        ? robot.userData.baseY + Math.sin(t * 0.9) * 0.06
        : robot.position.y

      head.rotation.y  = mx * 0.25 + Math.sin(t * 0.6) * 0.04
      head.rotation.x  = -my * 0.15
      robot.rotation.y = mx * 0.08

      const ep = 0.5 + 0.5 * Math.sin(t * 2.2)
      eyeL.material.emissiveIntensity = 1.5 + ep * 1.2
      eyeR.material.emissiveIntensity = 1.5 + ep * 1.2
      eyeRingL.material.emissiveIntensity = 0.6 + ep * 0.5
      eyeRingR.material.emissiveIntensity = 0.6 + ep * 0.5

      holoRing.rotation.z  += 0.008
      holoRing2.rotation.z -= 0.005

      cubes.forEach(c => {
        c.userData.angle += c.userData.speed
        c.position.x = Math.cos(c.userData.angle) * c.userData.radius
        c.position.z = Math.sin(c.userData.angle) * c.userData.radius - 1
        c.position.y += Math.sin(t + c.userData.yOff) * 0.003
        c.rotation.x += 0.01
        c.rotation.y += 0.012
      })

      fillLight.intensity = 2 + Math.sin(t * 1.8) * 1
      renderer.render(scene, camera)
    }
    animate()

    /* ── GSAP Timeline ── */
    const tl = gsap.timeline({ delay: 0.4 })

    tl.to(robot.position, {
      y: -0.1,
      duration: 1.4,
      ease: 'back.out(1.4)',
      onUpdate: () => { robot.userData.baseY = robot.position.y },
    })

    tl.to(cornerBadge.current, { opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.6')
    tl.to(speechRef.current,   { opacity: 1, y: '-220%', duration: 0.6, ease: 'back.out(1.6)' }, '-=0.3')
    tl.to(progressBlock.current, { opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.1')
    tl.to(brandLine.current,   { opacity: 1, duration: 0.6, ease: 'power2.out' }, '+=0.1')

    /* ── Progress simulation ── */
    const labels    = ['Booting Core Systems…', 'Loading Assets…', 'Calibrating Modules…', 'Almost Ready…', 'Complete!']
    const milestones = [0, 25, 55, 82, 100]
    let   current   = 0

    const runProgress = () => {
      if (current >= 4) return
      const target = milestones[current + 1]
      const stepEl = stepRefs[current].current
      if (stepEl) stepEl.classList.add('!text-cyan')

      gsap.to({ v: parseInt(progressPct.current.textContent) }, {
        v: target,
        duration: [1.1, 1.4, 1.2, 1.0][current],
        ease: 'power1.inOut',
        onUpdate() {
          const val = Math.round(this.targets()[0].v)
          if (progressPct.current)   progressPct.current.textContent   = val + '%'
          if (progressFill.current)  progressFill.current.style.width  = val + '%'
          if (progressLabel.current) progressLabel.current.textContent = labels[current]
        },
        onComplete() {
          if (stepEl) {
            stepEl.classList.remove('!text-cyan')
            stepEl.classList.add('!text-cyan/50')
          }
          current++
          if (current < 4) {
            setTimeout(runProgress, 200)
          } else {
            const subText = speechRef.current?.querySelector('.sub-text')
            if (subText) subText.textContent = "All systems go! Let's learn!"
            setTimeout(exitScene, 1200)
          }
        },
      })
    }

    tl.add(() => setTimeout(runProgress, 300))

    /* ── Exit ── */
    const exitScene = () => {
      gsap.to(head.rotation, { y: 0.4, duration: 0.4, ease: 'power2.inOut' })
      gsap.to(speechRef.current, { opacity: 0, y: '-240%', duration: 0.5, ease: 'power2.in', delay: 0.2 })
      gsap.to(robot.position, { y: robot.userData.baseY - 6, duration: 1.2, delay: 0.4, ease: 'power3.in' })
      gsap.to(outroRef.current, {
        opacity: 1, duration: 0.8, delay: 1, ease: 'power2.inOut',
        onComplete: () => { if (onComplete) onComplete() },
      })
    }

    /* ── Cleanup ── */
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', onMouseMove)
      renderer.dispose()
      gsap.killTweensOf('*')
    }
  }, [onComplete])

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-bg">

      {/* Particle background */}
      <canvas ref={bgCanvasRef} className="fixed inset-0 z-0" />

      {/* Grid overlay */}
      <div className="grid-bg fixed inset-0 z-[1] pointer-events-none" />

      {/* Three.js canvas */}
      <canvas ref={robotCanvasRef} className="fixed inset-0 z-[2]" />

      {/* Vignette */}
      <div className="fixed inset-0 z-[3] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, transparent 45%, #020408 100%)' }} />

      {/* Scanlines */}
      <div className="scanlines fixed inset-0 z-[4] pointer-events-none animate-scanFlicker" />

      {/* Corner badge */}
      <div
        ref={cornerBadge}
        className="fixed top-8 left-10 z-[11] flex items-center gap-2.5 opacity-0"
      >
        <span className="w-2 h-2 rounded-full bg-cyan shadow-[0_0_12px_#00f5ff] animate-pulse2" />
        <span className="font-orbitron text-[11px] tracking-[3px] uppercase text-cyan">
          Nimo Labs
        </span>
      </div>

      {/* Speech bubble */}
      <div
        ref={speechRef}
        className="speech-tail fixed top-1/2 left-1/2 z-[12] opacity-0 max-w-[340px]
          bg-[rgba(0,20,40,0.85)] border border-cyan/25 rounded-2xl rounded-bl-sm
          px-7 py-4 backdrop-blur-xl
          shadow-[0_0_40px_rgba(0,245,255,0.08),inset_0_1px_0_rgba(255,255,255,0.06)]"
        style={{ transform: 'translate(-10%, -200%)' }}
      >
        <div className="font-orbitron text-[28px] font-black text-cyan leading-none mb-1.5"
          style={{ textShadow: '0 0 24px #00f5ff' }}>
          Hi there!
        </div>
        <div className="sub-text font-rajdhani text-sm font-light text-white/60 tracking-wide leading-relaxed">
          Please wait while we load our content for you…
        </div>
      </div>

      {/* Bottom UI */}
      <div className="fixed inset-0 z-[10] flex flex-col items-center justify-end pb-16 pointer-events-none">

        {/* Progress block */}
        <div ref={progressBlock} className="w-[min(480px,80vw)] opacity-0">

          {/* Header */}
          <div className="flex justify-between items-center mb-2.5">
            <span ref={progressLabel} className="font-orbitron text-[10px] tracking-[3px] uppercase text-dim">
              Initialising Systems
            </span>
            <span ref={progressPct} className="font-orbitron text-[13px] font-bold text-cyan">
              0%
            </span>
          </div>

          {/* Track */}
          <div className="w-full h-[3px] bg-cyan/[0.08] rounded-full overflow-hidden relative">
            <div
              ref={progressFill}
              className="progress-fill h-full w-0 rounded-full relative transition-[width] duration-100 linear"
              style={{
                background:  'linear-gradient(90deg, #0066ff, #00f5ff)',
                boxShadow:   '0 0 12px #00f5ff',
              }}
            />
          </div>

          {/* Steps */}
          <div className="flex justify-between mt-2.5">
            {['Booting Core', 'Loading Assets', 'Calibrating', 'Almost Ready'].map((label, i) => (
              <span
                key={label}
                ref={stepRefs[i]}
                className="font-rajdhani text-[11px] tracking-wide text-dim transition-colors duration-300"
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Brand tagline */}
        <div ref={brandLine} className="mt-9 text-center opacity-0">
          <p className="font-orbitron text-[11px] tracking-[6px] uppercase text-dim">
            Where Robotics Meets Education
          </p>
        </div>
      </div>

      {/* Outro fade overlay */}
      <div ref={outroRef} className="fixed inset-0 z-50 bg-bg opacity-0 pointer-events-none" />
    </div>
  )
}
