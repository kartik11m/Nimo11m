import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import * as THREE from 'three'

// ── Constants ────────────────────────────────────────────────────
const N = 2200

// Pre-seeded random values — computed once at module load, never change.
const RNG = new Float32Array(N * 4)
for (let i = 0; i < N * 4; i++) RNG[i] = Math.random()

// Per-particle palette bias (0 or 1) — also fixed.
const BIAS = new Uint8Array(N)
for (let i = 0; i < N; i++) BIAS[i] = RNG[i * 4 + 3] < 0.5 ? 0 : 1

// Color palettes: each entry = [color-A [r,g,b], color-B [r,g,b]] normalized 0-1
const PALETTES = [
  [[1.0, 0.384, 0.188], [0.878, 0.208, 0.478]], // orange → pink
  [[1.0, 0.52,  0.0  ], [1.0,   0.85,  0.1  ]], // orange → gold
  [[0.0, 0.875, 1.0  ], [0.545, 0.192, 0.91 ]], // cyan   → purple
  [[0.545,0.192, 0.91], [0.878, 0.208, 0.478]], // purple → pink
]

// Chapter labels passed back to parent via onChapterChange
const CHAPTERS = ['Chapter One', 'Chapter Two', 'Chapter Three', 'Chapter Four']

// ── Build particle formations (module-level, run once) ───────────
function buildFormations() {
  const fSphere = new Float32Array(N * 3)
  const fTorus  = new Float32Array(N * 3)
  const fHelix  = new Float32Array(N * 3)
  const fBurst  = new Float32Array(N * 3)

  for (let i = 0; i < N; i++) {
    // Fibonacci sphere
    const phi   = Math.acos(1 - 2 * (i + 0.5) / N)
    const theta = Math.PI * (1 + Math.sqrt(5)) * i
    const rs    = 22 + RNG[i * 4] * 5
    fSphere[i*3]   = rs * Math.sin(phi) * Math.cos(theta)
    fSphere[i*3+1] = rs * Math.sin(phi) * Math.sin(theta)
    fSphere[i*3+2] = rs * Math.cos(phi)

    // Torus
    const t2 = (i / N) * Math.PI * 2
    const b  = RNG[i*4+1] * Math.PI * 2
    const R  = 18, rr = 6 + RNG[i*4+2] * 4
    fTorus[i*3]   = (R + rr * Math.cos(b)) * Math.cos(t2)
    fTorus[i*3+1] = (R + rr * Math.cos(b)) * Math.sin(t2)
    fTorus[i*3+2] = rr * Math.sin(b)

    // Triple helix
    const t3     = (i / N) * Math.PI * 12
    const strand = (i % 3) * (Math.PI * 2 / 3)
    fHelix[i*3]   = 13 * Math.cos(t3 + strand)
    fHelix[i*3+1] = (i / N) * 58 - 29
    fHelix[i*3+2] = 13 * Math.sin(t3 + strand)

    // Burst
    const rb = 10 + RNG[i*4] * 25
    const th = RNG[i*4+1] * Math.PI * 2
    const ph = Math.acos(2 * RNG[i*4+2] - 1)
    fBurst[i*3]   = rb * Math.sin(ph) * Math.cos(th)
    fBurst[i*3+1] = rb * Math.sin(ph) * Math.sin(th)
    fBurst[i*3+2] = rb * Math.cos(ph)
  }

  return [fSphere, fTorus, fHelix, fBurst]
}

const FORMATIONS = buildFormations()

// Smoothstep easing
function ss(t) { return t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t) }

// ── Component ────────────────────────────────────────────────────
/**
 * BackgroundEffects
 *
 * Renders a Three.js particle scene inside a <canvas>.
 * Exposes `updateScene(progress: 0-1)` via imperative ref so the
 * parent ScrollVideoSection can drive it from GSAP ScrollTrigger.
 *
 * Props:
 *   onChapterChange(index, label) — called when the active chapter changes
 */
const BackgroundEffects = forwardRef(function BackgroundEffects(
  { onChapterChange },
  ref
) {
  const canvasRef = useRef(null)
  // Holds the live updateScene function so GSAP can call it
  const updateFnRef = useRef(null)

  // Expose updateScene to parent
  useImperativeHandle(ref, () => ({
    updateScene: (progress) => updateFnRef.current?.(progress),
  }))

  useEffect(() => {
    const canvas  = canvasRef.current
    const panelEl = canvas.parentElement

    // ── Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    renderer.setClearColor(0x020203, 1)
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))

    // ── Scene + Camera
    const scene = new THREE.Scene()
    const cam   = new THREE.PerspectiveCamera(72, 1, 0.1, 1000)
    cam.position.z = 65

    function resize() {
      const w = panelEl.clientWidth
      const h = panelEl.clientHeight
      renderer.setSize(w, h, false)
      cam.aspect = w / h
      cam.updateProjectionMatrix()
    }
    resize()

    // Use ResizeObserver so the canvas tracks its panel on layout changes
    const ro = new ResizeObserver(resize)
    ro.observe(panelEl)

    // ── Mutable GPU buffers
    const aPos = new Float32Array(N * 3)
    const aCol = new Float32Array(N * 3)
    aPos.set(FORMATIONS[0])

    function colorize(pa, pb, t) {
      for (let i = 0; i < N; i++) {
        const b  = BIAS[i]
        const ca = pa[b], cb = pb[b]
        aCol[i*3]   = ca[0] + (cb[0] - ca[0]) * t
        aCol[i*3+1] = ca[1] + (cb[1] - ca[1]) * t
        aCol[i*3+2] = ca[2] + (cb[2] - ca[2]) * t
      }
    }
    colorize(PALETTES[0], PALETTES[0], 0)

    // ── Geometry + Material
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(aPos, 3))
    geo.setAttribute('color',    new THREE.BufferAttribute(aCol, 3))

    const mat = new THREE.PointsMaterial({
      size: 0.38,
      vertexColors: true,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const pts = new THREE.Points(geo, mat)
    scene.add(pts)

    // Soft ambient orb at center
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0xFF6230,
      transparent: true,
      opacity: 0.055,
    })
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(4, 8, 8), glowMat))

    // ── Update function — called by ScrollTrigger via imperative ref
    let lastSec    = -1
    let scrollProg = 0

    updateFnRef.current = (progress) => {
      scrollProg = progress

      const raw   = Math.min(progress * 4, 3.9999)
      const sec   = Math.floor(raw)
      const local = ss(raw - sec)
      const next  = Math.min(3, sec + 1)

      // Morph particle positions between two formations
      const fA = FORMATIONS[sec], fB = FORMATIONS[next]
      for (let i = 0; i < N * 3; i++) {
        aPos[i] = fA[i] + (fB[i] - fA[i]) * local
      }
      geo.attributes.position.needsUpdate = true

      // Morph colors between two palettes
      colorize(PALETTES[sec], PALETTES[next], local)
      geo.attributes.color.needsUpdate = true

      // Update glow orb color
      const ca = PALETTES[sec][0], cb = PALETTES[next][0]
      glowMat.color.setRGB(
        ca[0] + (cb[0] - ca[0]) * local,
        ca[1] + (cb[1] - ca[1]) * local,
        ca[2] + (cb[2] - ca[2]) * local,
      )

      // Notify parent when section changes
      if (sec !== lastSec) {
        onChapterChange?.(sec, CHAPTERS[sec])
        lastSec = sec
      }
    }

    // ── Render loop (always running, rotation driven by time + scroll)
    let tic   = 0
    let rafId = null

    function loop() {
      rafId = requestAnimationFrame(loop)
      tic += 0.004
      pts.rotation.y = tic * 0.14 + scrollProg * Math.PI * 0.5
      pts.rotation.x = Math.sin(tic * 0.07) * 0.1
      cam.position.x = Math.sin(tic * 0.1)  * 3.5
      cam.position.y = Math.cos(tic * 0.08) * 2
      cam.lookAt(0, 0, 0)
      renderer.render(scene, cam)
    }
    loop()

    // ── Cleanup on unmount
    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
      updateFnRef.current = null
      renderer.dispose()
      geo.dispose()
      mat.dispose()
      glowMat.dispose()
    }
  }, []) // onChapterChange is stable (useCallback) so safe to omit

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block"
    />
  )
})

export default BackgroundEffects
