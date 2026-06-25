import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const syne   = { fontFamily: "'Syne', sans-serif" }
const dmSans = { fontFamily: "'DM Sans', sans-serif" }

// ── How long reaction bubbles stay visible ────────────────────────
const REACTION_MS = 5000

// ── Section data ──────────────────────────────────────────────────
const sections = [
  { id:'home-hero',          label:'Welcome',      line1:'A warm welcome to the future of robotics education.',      line2:'Scroll to explore the full Nimo Labs experience.',           accent:'#FF6B35' },
  { id:'home-services',      label:'Services',     line1:'Hands-on workshops, demos, and program design for curious minds.', line2:'Practical experiences that make innovation feel real.',      accent:'#A855F7' },
  { id:'home-summer',        label:'Summer Camp',  line1:'A high-energy camp where ideas become working robots.',    line2:'Build, test, and learn from the ground up.',                  accent:'#FF006E' },
  { id:'home-robots',        label:'Robots',       line1:'See the machines our students build, code, and control.',   line2:'From Arduino bots to autonomous systems.',                    accent:'#00F5FF' },
  { id:'home-training',      label:'Training',     line1:'Structured pathways from beginner fundamentals to advanced builds.', line2:'Learn with real projects, mentors, and hands-on momentum.', accent:'#FF6B35' },
  { id:'home-events',        label:'Events',       line1:'Live showcases, team challenges, and STEM experiences in motion.', line2:'Watch ideas turn into action in front of you.',               accent:'#00F5FF' },
  { id:'home-achievements',  label:'Achievements', line1:'Milestones, awards, and impact stories that keep momentum growing.', line2:'A closer look at the journeys behind every win.',             accent:'#FF006E' },
  { id:'home-partners',      label:'Partners',     line1:'Trusted by schools, colleges, and innovation-focused teams.', line2:'A growing network of mentors, collaborators, and changemakers.', accent:'#8B31E8' },
  { id:'home-lab-setup',     label:'Lab Setup',    line1:'Turn classrooms into future-ready robotics spaces.',        line2:'We help institutions build hands-on systems that last.',      accent:'#00F5FF' },
  { id:'home-testimonials',  label:'Voices',       line1:'Students and educators share what makes the experience memorable.', line2:'Real stories from real learning journeys.',                 accent:'#FF6B35' },
  { id:'home-blog',          label:'Stories',      line1:'Behind-the-scenes updates, ideas, and learning insights.',  line2:'Explore the thinking behind our workshop floor and beyond.', accent:'#A855F7' },
  { id:'home-contact',       label:'Connect',      line1:'Bring robotics to your campus, club, or next big event.',   line2:'Let’s start a conversation about your next program.',         accent:'#FF6B35' },
  { id:'home-faq',           label:'FAQ',          line1:'Clear answers for families, schools, and teams exploring robotics.', line2:'Everything you need to know before you begin.',             accent:'#A855F7' },
]

const sectionPresets = [
  { eyes: { x: 1, y: 0.8 }, head: { z: 0.06 }, arms: { left: { z: -0.22, x: -0.06 }, right: { z: 0.22, x: 0.06 } }, pivot: { y: 0.08, x: -0.02 }, light: 2.8 },
  { eyes: { x: 1.03, y: 0.76 }, head: { z: 0.04 }, arms: { left: { z: -0.4, x: -0.05 }, right: { z: 0.22, x: 0.03 } }, pivot: { y: 0.04, x: -0.03 }, light: 3.2 },
  { eyes: { x: 1.22, y: 0.68 }, head: { z: 0.11 }, arms: { left: { z: -0.72, x: -0.12 }, right: { z: 0.72, x: 0.12 } }, pivot: { y: 0.16, x: -0.01 }, light: 4.2 },
  { eyes: { x: 1.14, y: 0.72 }, head: { z: -0.05 }, arms: { left: { z: -0.2, x: -0.05 }, right: { z: 0.2, x: 0.05 } }, pivot: { y: 0.1, x: 0.08 }, light: 3.8 },
  { eyes: { x: 1.02, y: 0.78 }, head: { z: 0.08 }, arms: { left: { z: -0.55, x: -0.16 }, right: { z: 0.35, x: 0.08 } }, pivot: { y: 0.12, x: 0.06 }, light: 3.4 },
  { eyes: { x: 1.18, y: 0.7 }, head: { z: -0.08 }, arms: { left: { z: -0.9, x: -0.15 }, right: { z: 0.9, x: 0.15 } }, pivot: { y: 0.18, x: -0.02 }, light: 4.6 },
  { eyes: { x: 0.96, y: 0.88 }, head: { z: 0.12 }, arms: { left: { z: -0.28, x: -0.05 }, right: { z: 0.28, x: 0.05 } }, pivot: { y: 0.08, x: -0.04 }, light: 3.5 },
  { eyes: { x: 1.04, y: 0.84 }, head: { z: 0.02 }, arms: { left: { z: -0.36, x: -0.08 }, right: { z: 0.16, x: 0.04 } }, pivot: { y: 0.05, x: 0.02 }, light: 3.1 },
  { eyes: { x: 1.08, y: 0.74 }, head: { z: -0.03 }, arms: { left: { z: -0.12, x: -0.02 }, right: { z: 0.12, x: 0.02 } }, pivot: { y: 0.06, x: -0.06 }, light: 3.6 },
  { eyes: { x: 0.98, y: 0.86 }, head: { z: 0.05 }, arms: { left: { z: -0.18, x: -0.04 }, right: { z: 0.18, x: 0.04 } }, pivot: { y: 0.07, x: 0.03 }, light: 3.1 },
  { eyes: { x: 1.02, y: 0.82 }, head: { z: 0.03 }, arms: { left: { z: -0.24, x: -0.06 }, right: { z: 0.24, x: 0.06 } }, pivot: { y: 0.06, x: -0.03 }, light: 3.2 },
  { eyes: { x: 1.1, y: 0.76 }, head: { z: 0.09 }, arms: { left: { z: -0.54, x: -0.12 }, right: { z: 0.42, x: 0.08 } }, pivot: { y: 0.11, x: 0.04 }, light: 3.7 },
  { eyes: { x: 1.06, y: 0.78 }, head: { z: 0.06 }, arms: { left: { z: -0.3, x: -0.08 }, right: { z: 0.3, x: 0.08 } }, pivot: { y: 0.09, x: -0.02 }, light: 3.3 },
]

// ── Reaction pools ────────────────────────────────────────────────
const REACTIONS = {
  wave:  ["Hi there! 👋",     "Hello! 😊",          "I'm EVE! 🤖"],
  spin:  ["Wheeeee! 💫",      "Spin! 🌀",            "Woooo! ⭐"],
  dance: ["Boogie! 🕺",       "Let's dance! 🎵",     "Groove! 🎶"],
  fly:   ["To infinity! 🚀",  "Wheeeee! 🛸",         "Watch me! ✨"],
  throw: ["I'm flying! ✈️",   "Wheeeee! 🌪️",         "Throwing me?! 🚀", "Woooah! 😲"],
  land:  ["I'm back! 😊",     "That was fun! 🤖",    "Again! 🔄",         "Home sweet home! 🏠"],
}

// ── EVE-style 3-D robot ──────────────────────────────────────────
function buildEVE() {
  const eve = new THREE.Group()
  const wM = new THREE.MeshStandardMaterial({ color:0xf0f0f5, roughness:.06, metalness:.18 })
  const dM = new THREE.MeshStandardMaterial({ color:0x060810, roughness:.95, metalness:0 })
  const eM = new THREE.MeshStandardMaterial({ color:0x00c8ff, emissive:new THREE.Color(0x00f5ff), emissiveIntensity:3.5, roughness:0, metalness:.4 })
  const gM = new THREE.MeshStandardMaterial({ color:0x00f5ff, emissive:new THREE.Color(0x00f5ff), emissiveIntensity:1.2, transparent:true, opacity:.28, roughness:0 })

  const add = (geo, mat, props={}) => {
    const m = new THREE.Mesh(geo, mat)
    Object.entries(props).forEach(([k,v]) => {
      if (k==='position') m.position.set(...v)
      else if (k==='scale') m.scale.set(...v)
      else if (k==='name') m.name = v
    })
    eve.add(m); return m
  }

  add(new THREE.SphereGeometry(1,64,64),    wM, { position:[0,1.4,0],   scale:[1.55,1.05,1.05], name:'head'      })
  add(new THREE.SphereGeometry(.94,64,64),  dM, { position:[0,1.4,.98], scale:[1.48,.9,.14]                      })
  const eb = new THREE.BoxGeometry(.54,.2,.1)
  add(eb, eM, { position:[-.44,1.4,1.06], name:'leftEye'   })
  add(eb, eM, { position:[ .44,1.4,1.06], name:'rightEye'  })
  const gb = new THREE.BoxGeometry(.62,.3,.06)
  add(gb, gM, { position:[-.44,1.4,1.03], name:'leftGlow'  })
  add(gb, gM, { position:[ .44,1.4,1.03], name:'rightGlow' })
  add(new THREE.CylinderGeometry(.16,.22,.3,32),    wM, { position:[0,.63,0]    })
  add(new THREE.CylinderGeometry(.52,.84,1.25,40),  wM, { position:[0,-.28,0]   })
  add(new THREE.SphereGeometry(.52,40,20,0,Math.PI*2,0,Math.PI*.5),          wM, { position:[0,.345,0]   })
  add(new THREE.SphereGeometry(.84,40,20,0,Math.PI*2,Math.PI*.5,Math.PI*.5), wM, { position:[0,-.905,0]  })
  const ag = new THREE.SphereGeometry(.26,32,32)
  add(ag, wM, { position:[-.92,-.14,.04], scale:[.52,1.35,.52], name:'leftArm'  })
  add(ag, wM, { position:[ .92,-.14,.04], scale:[.52,1.35,.52], name:'rightArm' })
  const el = new THREE.PointLight(0x00f5ff, 2.5, 4.5)
  el.position.set(0,1.4,1.8); el.name='eyeLight'; eve.add(el)
  return eve
}

// ── Helper: get all four eye scale objects ────────────────────────
function eyeScales(eve) {
  return ['leftEye','rightEye','leftGlow','rightGlow']
    .map(n => eve?.getObjectByName(n)?.scale)
    .filter(Boolean)
}

// ── Component ────────────────────────────────────────────────────
export default function ScrollRobotGuide() {

  /* DOM */
  const wrapperRef = useRef(null)
  const canvasRef  = useRef(null)
  const bubbleRef  = useRef(null)

  /* Three.js */
  const rafRef   = useRef(null)
  const clockRef = useRef(new THREE.Clock())
  const bobRef   = useRef(null)
  const pivotRef = useRef(null)
  const eveRef   = useRef(null)

  /* Interaction flags */
  const isAnimRef       = useRef(false)
  const isIdleRef       = useRef(false)
  const isThrowingRef   = useRef(false)
  const idleTimerRef    = useRef(null)
  const blinkTimerRef   = useRef(null)   // ← random blink scheduler
  const idleTlRef       = useRef(null)
  const returnTlRef     = useRef(null)
  const loopTlRef       = useRef(null)
  const lastInteractRef = useRef(Date.now())
  const clickTimerRef   = useRef(null)
  const clickCountRef   = useRef(0)
  const lookRef         = useRef({ x:0, y:0 })
  const hintShownRef    = useRef(false)

  /* Drag tracking */
  const isDraggingRef  = useRef(false)
  const dragStartRef   = useRef({ x:0, y:0 })
  const dragInitPosRef = useRef({ x:0, y:0 })
  const dragDistRef    = useRef(0)
  const velHistRef     = useRef([])

  /* React state */
  const [activeIdx, setActiveIdx] = useState(0)
  const [fading,    setFading]    = useState(false)
  const [mounted,   setMounted]   = useState(false)
  const [minimized, setMinimized] = useState(false)
  const [isWaving,  setIsWaving]  = useState(false)
  const [reaction,  setReaction]  = useState(null)
  const [showHint,  setShowHint]  = useState(false)
  const [isDragging,setIsDragging]= useState(false)

  const active = sections[activeIdx]

  /* ── Reaction bubble ──────────────────────────────────────── */
  const flash = useCallback((type) => {
    const pool = REACTIONS[type]
    setReaction({ text: pool[Math.floor(Math.random() * pool.length)], key: Date.now() })
    setTimeout(() => setReaction(null), REACTION_MS)
  }, [])

  const playSectionMood = useCallback((index) => {
    const eve = eveRef.current
    const pivot = pivotRef.current
    const preset = sectionPresets[index] || sectionPresets[0]
    if (!eve || !pivot) return

    if (loopTlRef.current) {
      loopTlRef.current.kill()
      loopTlRef.current = null
    }

    const sc = eyeScales(eve)
    const head = eve.getObjectByName('head')
    const leftArm = eve.getObjectByName('leftArm')
    const rightArm = eve.getObjectByName('rightArm')
    const el = eve.getObjectByName('eyeLight')

    gsap.killTweensOf([pivot.position, pivot.rotation, sc, head?.rotation, leftArm?.rotation, rightArm?.rotation, el])
    gsap.set(pivot.rotation, { x: 0, y: 0, z: 0 })
    gsap.set(pivot.position, { y: 0 })
    if (head) gsap.set(head.rotation, { z: 0 })
    if (leftArm) gsap.set(leftArm.rotation, { z: 0, x: 0 })
    if (rightArm) gsap.set(rightArm.rotation, { z: 0, x: 0 })

    const tl = gsap.timeline()
    tl.to(sc, { x: preset.eyes.x, y: preset.eyes.y, duration: 0.2, ease: 'power2.out' }, 0)
      .to(pivot.position, { y: preset.pivot.y, duration: 0.2, ease: 'power2.out' }, 0)
      .to(pivot.rotation, { x: preset.pivot.x, y: preset.pivot.x * 0.6, duration: 0.24, ease: 'power2.out' }, 0)
      .to(el || {}, { intensity: preset.light, duration: 0.2, ease: 'power2.out' }, 0)

    if (head) tl.to(head.rotation, { z: preset.head.z, duration: 0.22, ease: 'power2.out' }, 0.02)
    if (leftArm) tl.to(leftArm.rotation, { z: preset.arms.left.z, x: preset.arms.left.x, duration: 0.24, ease: 'power2.out' }, 0.02)
    if (rightArm) tl.to(rightArm.rotation, { z: preset.arms.right.z, x: preset.arms.right.x, duration: 0.24, ease: 'power2.out' }, 0.02)

    tl.to(pivot.position, { y: 0, duration: 0.34, ease: 'bounce.out' }, 0.24)

    if (index === 6) {
      loopTlRef.current = gsap.timeline({ repeat: -1, yoyo: true, repeatRefresh: true })
        .to(pivot.position, { y: 0.16, duration: 0.38, ease: 'sine.inOut' }, 0)
        .to(head?.rotation || {}, { z: 0.12, duration: 0.28, ease: 'sine.inOut' }, 0)
        .to(leftArm?.rotation || {}, { z: -0.72, x: -0.14, duration: 0.28, ease: 'sine.inOut' }, 0)
        .to(rightArm?.rotation || {}, { z: 0.72, x: 0.14, duration: 0.28, ease: 'sine.inOut' }, 0)
        .to(sc, { x: 1.16, y: 0.9, duration: 0.24, ease: 'power2.inOut' }, 0)
        .to(el || {}, { intensity: 6.4, duration: 0.2, ease: 'sine.inOut' }, 0)
    }

    if (index === 5) {
      loopTlRef.current = gsap.timeline({ repeat: -1, yoyo: true, repeatRefresh: true })
        .to(pivot.position, { y: 0.14, duration: 0.3, ease: 'sine.inOut' }, 0)
        .to(pivot.rotation, { x: 0.1, y: 0.12, duration: 0.3, ease: 'sine.inOut' }, 0)
        .to(head?.rotation || {}, { z: -0.08, duration: 0.24, ease: 'sine.inOut' }, 0)
        .to(leftArm?.rotation || {}, { z: -1.02, x: -0.18, duration: 0.24, ease: 'sine.inOut' }, 0)
        .to(rightArm?.rotation || {}, { z: 1.02, x: 0.18, duration: 0.24, ease: 'sine.inOut' }, 0)
        .to(sc, { x: 1.12, y: 0.72, duration: 0.22, ease: 'power2.inOut' }, 0)
        .to(el || {}, { intensity: 7.2, duration: 0.18, ease: 'sine.inOut' }, 0)
    }

    if (index === 11 || index === 12) {
      loopTlRef.current = gsap.timeline({ repeat: -1, yoyo: true, repeatRefresh: true })
        .to(pivot.position, { y: 0.08, duration: 0.55, ease: 'sine.inOut' }, 0)
        .to(head?.rotation || {}, { z: 0.05, duration: 0.45, ease: 'sine.inOut' }, 0)
        .to(leftArm?.rotation || {}, { z: -0.28, x: -0.06, duration: 0.45, ease: 'sine.inOut' }, 0)
        .to(rightArm?.rotation || {}, { z: 0.28, x: 0.06, duration: 0.45, ease: 'sine.inOut' }, 0)
        .to(sc, { x: 1.03, y: 0.84, duration: 0.4, ease: 'power2.inOut' }, 0)
        .to(el || {}, { intensity: 3.4, duration: 0.32, ease: 'sine.inOut' }, 0)
    }
  }, [])

  /* ── Reset idle ───────────────────────────────────────────── */
  const resetIdle = useCallback(() => {
    lastInteractRef.current = Date.now()
    if (!isIdleRef.current) return
    isIdleRef.current = false; setIsWaving(false)
    if (idleTlRef.current) { idleTlRef.current.kill(); idleTlRef.current = null }
    const eve = eveRef.current; if (!eve) return
    // ✅ FIX: THREE.Vector3 uses .y / .x — not scaleY / scaleX
    gsap.to(eyeScales(eve), { y:1, x:1, duration:.4, ease:'back.out(1.4)' })
    const la = eve.getObjectByName('leftArm')
    if (la) gsap.to(la.rotation, { z:0, x:0, duration:.4, ease:'back.out(1.4)' })
    isAnimRef.current = false
  }, [])

  /* ══════════════════════════════════════════════════════════
     ANIMATIONS
  ══════════════════════════════════════════════════════════ */

  const playWave = useCallback((fromIdle=false) => {
    const eve = eveRef.current; const pivot = pivotRef.current
    if (!eve||!pivot) return
    if (!fromIdle && isAnimRef.current) return
    isAnimRef.current = true
    if (fromIdle) { isIdleRef.current=true; setIsWaving(true) }

    const sc   = eyeScales(eve)
    const head = eve.getObjectByName('head')
    const lArm = eve.getObjectByName('leftArm')
    const el   = eve.getObjectByName('eyeLight')

    const tl = gsap.timeline({ onComplete:() => {
      isAnimRef.current = false
      if (fromIdle) { isIdleRef.current=false; setIsWaving(false); idleTlRef.current=null }
      // ✅ FIX: restore using .y / .x
      gsap.to(sc, { y:1, x:1, duration:.35, ease:'back.out' })
      if (lArm) gsap.to(lArm.rotation, { z:0, x:0, duration:.4, ease:'back.out(1.4)' })
    }})
    if (fromIdle) idleTlRef.current = tl

    // ✅ FIX: happy squint → .y (scaleY axis)
    tl.to(sc, { y:.35, duration:.28, ease:'power2.out' }, 0)
    if (el) tl.to(el, { intensity:9, duration:.15 }, 0).to(el, { intensity:2.5, duration:.6 }, .15)
    if (head) {
      tl.to(head.rotation, { z:.18, duration:.3,  ease:'back.out(2)'  }, .1)
        .to(head.rotation, { z:-.12, duration:.4, ease:'sine.inOut'   }, .55)
        .to(head.rotation, { z:0,   duration:.35, ease:'back.out'     }, 1.1)
    }
    tl.to(pivot.position, { y:.32, duration:.22, ease:'power2.out' }, .12)
      .to(pivot.position, { y:0,   duration:.45, ease:'bounce.out'  }, .34)
    if (lArm) {
      tl.to(lArm.rotation, { z:-1.1, x:-.2, duration:.3, ease:'power2.out' }, .05)
        .to(lArm.rotation, { z:-.6, duration:.18, ease:'sine.inOut', yoyo:true, repeat:5 }, .35)
        .to(lArm.rotation, { z:0, x:0, duration:.4, ease:'back.out(1.2)' }, 1.45)
    }
    tl.to(pivot.position, { y:.18, duration:.18, ease:'power2.out' }, 1.2)
      .to(pivot.position, { y:0,   duration:.35, ease:'bounce.out'  }, 1.38)
    if (!fromIdle) flash('wave')
  }, [flash])

  const playSpin = useCallback(() => {
    const pivot=pivotRef.current, eve=eveRef.current
    if (!pivot||!eve||isAnimRef.current) return
    isAnimRef.current = true
    const el  = eve.getObjectByName('eyeLight')
    const le  = eve.getObjectByName('leftEye')
    const re  = eve.getObjectByName('rightEye')
    const lg  = eve.getObjectByName('leftGlow')
    const rg  = eve.getObjectByName('rightGlow')
    const tl  = gsap.timeline({ onComplete:()=>{ isAnimRef.current=false } })
    tl.to(pivot.position, { y:.5, duration:.28, ease:'power3.out' }, 0)
      .to(pivot.position, { y:0,  duration:.6,  ease:'bounce.out'  }, .28)
    tl.to(pivot.rotation, { y:`+=${Math.PI*2}`, duration:.8, ease:'power2.inOut' }, 0)
    if (el) tl.to(el, { intensity:8, duration:.2 }, 0).to(el, { intensity:2.5, duration:.5 }, .3)
    // ✅ FIX: wide eyes using .x (scaleX axis)
    const eyeParts = [le?.scale, re?.scale, lg?.scale, rg?.scale].filter(Boolean)
    if (eyeParts.length) tl.to(eyeParts, { x:1.3, duration:.2, yoyo:true, repeat:1 }, 0)
    flash('spin')
  }, [flash])

  const playDance = useCallback(() => {
    const wrapper=wrapperRef.current, eve=eveRef.current, pivot=pivotRef.current
    if (!wrapper||!eve||!pivot||isAnimRef.current) return
    isAnimRef.current = true
    const lArm=eve.getObjectByName('leftArm'), rArm=eve.getObjectByName('rightArm')
    const head=eve.getObjectByName('head'),    el=eve.getObjectByName('eyeLight')
    const tl = gsap.timeline({ onComplete:() => {
      isAnimRef.current = false
      gsap.set(wrapper, { x:0 })
      if (lArm) gsap.set(lArm.rotation, { z:0 })
      if (rArm) gsap.set(rArm.rotation, { z:0 })
      if (head) gsap.set(head.rotation, { z:0 })
    }})
    tl.to(wrapper, { x:-14, duration:.12, ease:'sine.inOut', yoyo:true, repeat:9 }, 0)
    if (lArm) tl.to(lArm.rotation, { z:-.75, duration:.12, ease:'sine.inOut', yoyo:true, repeat:9 }, 0)
    if (rArm) tl.to(rArm.rotation, { z:.75,  duration:.12, ease:'sine.inOut', yoyo:true, repeat:9, delay:.06 }, 0)
    if (head) tl.to(head.rotation, { z:.15,  duration:.18, ease:'sine.inOut', yoyo:true, repeat:6 }, 0)
    if (el)   tl.to(el, { intensity:7, duration:.12, yoyo:true, repeat:9 }, 0)
    tl.to(pivot.position, { y:.22, duration:.15, ease:'power2.out', yoyo:true, repeat:3 }, .18)
    flash('dance')
  }, [flash])

  const flyAcross = useCallback(() => {
    const wrapper=wrapperRef.current, pivot=pivotRef.current, eve=eveRef.current
    if (!wrapper||!pivot||!eve||isAnimRef.current) return
    isAnimRef.current = true
    const el = eve.getObjectByName('eyeLight')
    const sc = eyeScales(eve)
    const tl = gsap.timeline({ onComplete:() => {
      isAnimRef.current=false; pivot.rotation.y=0; pivot.rotation.x=0; pivot.position.y=0
      // ✅ FIX: restore .y / .x
      gsap.to(sc, { y:1, x:1, duration:.35, ease:'back.out' })
    }})
    // ✅ FIX: squint using .y
    tl.to(sc, { y:.35, duration:.2 }, 0)
    if (el) tl.to(el, { intensity:12, duration:.15 }, 0).to(el, { intensity:2.5, duration:.8 }, .2)
    tl.to(wrapper, { bottom:'62vh', right:'58vw', duration:.62, ease:'power3.out'  }, 0)
      .to(wrapper, { bottom:'70vh', right:'80vw', duration:.5,  ease:'sine.inOut'  }, .62)
      .to(wrapper, { bottom:'44vh', right:'42vw', duration:.38, ease:'power2.in'   }, 1.12)
      .to(wrapper, { bottom:24,     right:20,     duration:.75, ease:'bounce.out'  }, 1.5)
    tl.to(pivot.rotation, { y:`+=${Math.PI*4}`, duration:1.55, ease:'power1.inOut' }, 0)
    tl.to(pivot.rotation, { x:.18, duration:.35, ease:'sine.inOut', yoyo:true, repeat:3 }, .2)
    tl.to(pivot.position, { y:.28, duration:.2,  ease:'power2.out' }, 1.5)
      .to(pivot.position, { y:0,   duration:.5,  ease:'bounce.out'  }, 1.7)
    flash('fly')
  }, [flash])

  /* ══════════════════════════════════════════════════════════
     DRAG-AND-THROW
  ══════════════════════════════════════════════════════════ */

  const handleCanvasMouseDown = useCallback((e) => {
    if (e.button !== 0) return
    if (returnTlRef.current) {
      returnTlRef.current.kill(); returnTlRef.current = null
      isThrowingRef.current = false; isAnimRef.current = false
    }
    isDraggingRef.current = true
    setIsDragging(true)
    dragStartRef.current  = { x: e.clientX, y: e.clientY }
    dragInitPosRef.current = {
      x: gsap.getProperty(wrapperRef.current, 'x') || 0,
      y: gsap.getProperty(wrapperRef.current, 'y') || 0,
    }
    dragDistRef.current = 0
    velHistRef.current  = [{ x: e.clientX, y: e.clientY, t: Date.now() }]
    document.body.style.cursor     = 'grabbing'
    document.body.style.userSelect = 'none'
    gsap.to(wrapperRef.current, { scale:1.07, duration:.15, ease:'power2.out' })
    // ✅ FIX: widen eyes → .y (height scale)
    const eve = eveRef.current
    if (eve) gsap.to(eyeScales(eve), { y:1.4, x:1.15, duration:.15 })
  }, [])

  const handleClick = useCallback(() => {
    if (dragDistRef.current > 12) return
    resetIdle()
    clickCountRef.current++
    if (clickTimerRef.current) clearTimeout(clickTimerRef.current)
    clickTimerRef.current = setTimeout(() => {
      const n = clickCountRef.current; clickCountRef.current = 0
      if (n >= 2) flyAcross()
      else [playWave, playSpin, playDance][Math.floor(Math.random()*3)]()
    }, 260)
  }, [resetIdle, flyAcross, playWave, playSpin, playDance])

  const handleMouseMove = useCallback((e) => {
    if (isDraggingRef.current) return
    const rect = canvasRef.current?.getBoundingClientRect(); if (!rect) return
    const x = ((e.clientX - rect.left) / rect.width  - .5) * 2
    const y = ((e.clientY - rect.top)  / rect.height - .5) * 2
    lookRef.current = { x: x * .32, y: -y * .18 }
  }, [])

  const handleEnter = useCallback(() => {
    if (!hintShownRef.current) {
      hintShownRef.current = true
      setShowHint(true)
      setTimeout(() => setShowHint(false), 2500)
    }
  }, [])

  const handleLeave = useCallback(() => { lookRef.current = { x:0, y:0 } }, [])

  /* ══════════════════════════════════════════════════════════
     THREE.JS INIT + GSAP + BLINK
  ══════════════════════════════════════════════════════════ */
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const W = 160, H = 230

    const scene  = new THREE.Scene(); scene.background = null
    const camera = new THREE.PerspectiveCamera(44, W/H, .1, 60)
    camera.position.set(0,.4,7.2); camera.lookAt(0,.3,0)

    const renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H, false)
    renderer.outputColorSpace = THREE.SRGBColorSpace

    scene.add(new THREE.AmbientLight(0xffffff,.65))
    const sun  = new THREE.DirectionalLight(0xffffff,2.0); sun.position.set(3,5,5);   scene.add(sun)
    const fill = new THREE.DirectionalLight(0x8899ff,.45); fill.position.set(-4,1,2); scene.add(fill)
    const rim  = new THREE.DirectionalLight(0xff6b35,.3);  rim.position.set(0,-3,-5); scene.add(rim)

    const bob   = new THREE.Group(); scene.add(bob)
    const pivot = new THREE.Group(); bob.add(pivot)
    const eve   = buildEVE();        pivot.add(eve)
    bobRef.current=bob; pivotRef.current=pivot; eveRef.current=eve

    const el = eve.getObjectByName('eyeLight')

    /* ── Render loop ─────────────────────────────────────── */
    const tick = () => {
      rafRef.current = requestAnimationFrame(tick)
      const t = clockRef.current.getElapsedTime()
      if (!isAnimRef.current && !isDraggingRef.current) {
        const idlePulse = Math.sin(t * 1.7) * 0.012
        bob.position.y = Math.sin(t*1.3)*.09 + idlePulse
        bob.rotation.z = Math.sin(t*.85)*.022
        const la=eve.getObjectByName('leftArm'), ra=eve.getObjectByName('rightArm')
        if (la) la.rotation.z =  Math.sin(t*1.1)*.06 + idlePulse * 0.4
        if (ra) ra.rotation.z = -Math.sin(t*1.1)*.06 - idlePulse * 0.4
        pivot.rotation.y += (lookRef.current.x - pivot.rotation.y)*.08
        pivot.rotation.x += (lookRef.current.y - pivot.rotation.x)*.08
      }
      if (el) el.intensity = 2.5 + Math.sin(t*2.2)*.6 + Math.sin(t*1.1)*0.12
      renderer.render(scene, camera)
    }
    tick()

    /* ── Random blink ────────────────────────────────────── */
    // EVE blinks every 2.5–6 seconds when idle
    function scheduleBlink() {
      const delay = 2500 + Math.random() * 3500
      blinkTimerRef.current = setTimeout(() => {
        if (!isAnimRef.current && !isThrowingRef.current && !isDraggingRef.current) {
          const sc = eyeScales(eve)
          // Quick close → open
          gsap.timeline({ onComplete: scheduleBlink })
            .to(sc, { y: 0.06, duration:.07, ease:'power3.in'  })
            .to(sc, { y: 1,    duration:.11, ease:'power2.out' })
        } else {
          scheduleBlink() // retry after next interval
        }
      }, delay)
    }
    scheduleBlink()

    /* ── ScrollTriggers ──────────────────────────────────── */
    const triggers = sections.map((sec,i) =>
      ScrollTrigger.create({
        trigger:`#${sec.id}`, start:'top 48%',
        onEnter:     () => onSection(i),
        onEnterBack: () => onSection(i),
      })
    )

    function onSection(i) {
      resetIdle(); setFading(true)
      // Double-blink on section change (feels expressive)
      const sc = eyeScales(eve)
      gsap.timeline()
        .to(sc, { y:.1, duration:.06, ease:'power3.in'  })
        .to(sc, { y:1,  duration:.1,  ease:'power2.out' })
        .to(sc, { y:.1, duration:.06, ease:'power3.in'  }, '+=.08')
        .to(sc, { y:1,  duration:.1,  ease:'power2.out' })

      if (bubbleRef.current) {
        gsap.to(bubbleRef.current, {
          opacity: 0,
          y: 10,
          scale: 0.97,
          filter: 'blur(3px)',
          duration: 0.2,
          ease: 'power2.in',
          overwrite: true,
        })
      }

      playSectionMood(i)

      gsap.timeline({ onComplete:()=>{ 
        setActiveIdx(i)
        setFading(false)
        if (bubbleRef.current) {
          gsap.fromTo(bubbleRef.current, { opacity: 0, y: 10, scale: 0.97, filter: 'blur(3px)' }, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.28, ease: 'power2.out', overwrite: true })
        }
      }})
        .to(pivot.rotation, { y:(i/(sections.length-1)-.5)*.55, x:-.06, duration:.65, ease:'back.out(1.6)' }, 0)
        .to(pivot.position, { y:.28, duration:.20, ease:'power2.out' }, 0)
        .to(pivot.position, { y:0,   duration:.50, ease:'bounce.out'  }, .2)
        .to(el||{}, { intensity:7, duration:.12, yoyo:true, repeat:1 }, 0)
        .to({}, { duration:.22 }, 0)
    }

    /* ── Idle check ──────────────────────────────────────── */
    idleTimerRef.current = setInterval(() => {
      if (Date.now()-lastInteractRef.current >= 6000 && !isIdleRef.current && !isAnimRef.current && !isThrowingRef.current)
        playWave(true)
    }, 1500)

    /* ── Global interaction reset ────────────────────────── */
    let _lt=0
    const onInteract = () => {
      const now=Date.now(); if(now-_lt>400){ _lt=now; resetIdle() }
    }
    window.addEventListener('scroll',    onInteract, { passive:true })
    window.addEventListener('keydown',   onInteract)

    /* ── Drag-and-throw window listeners ─────────────────── */
    function onWinMouseMove(e) {
      if (!isDraggingRef.current) return
      const dx = e.clientX - dragStartRef.current.x
      const dy = e.clientY - dragStartRef.current.y
      dragDistRef.current = Math.sqrt(dx*dx + dy*dy)
      gsap.set(wrapperRef.current, {
        x: dragInitPosRef.current.x + dx,
        y: dragInitPosRef.current.y + dy,
      })
      if (pivot && !isAnimRef.current) {
        pivot.rotation.z = Math.max(-.35, Math.min(.35, -(dx * 0.0022)))
        pivot.rotation.x = Math.max(-.2,  Math.min(.2,   dy * 0.0015))
      }
      velHistRef.current.push({ x:e.clientX, y:e.clientY, t:Date.now() })
      if (velHistRef.current.length > 7) velHistRef.current.shift()
    }

    function onWinMouseUp() {
      if (!isDraggingRef.current) return
      isDraggingRef.current = false
      setIsDragging(false)
      document.body.style.cursor     = ''
      document.body.style.userSelect = ''

      gsap.to(wrapperRef.current, { scale:1, duration:.2, ease:'power2.out' })
      if (pivot) gsap.to(pivot.rotation, { z:0, x:0, duration:.4, ease:'back.out(1.4)' })
      // ✅ FIX: restore eyes → .y / .x
      gsap.to(eyeScales(eve), { y:1, x:1, duration:.2 })

      const dist = dragDistRef.current
      if (dist < 12) return

      // Velocity
      const hist = velHistRef.current
      let vx=0, vy=0
      if (hist.length >= 2) {
        const last=hist[hist.length-1], old=hist[Math.max(0,hist.length-5)], dt=last.t-old.t
        if (dt>8) { vx=(last.x-old.x)/dt; vy=(last.y-old.y)/dt }
      }

      const startX = gsap.getProperty(wrapperRef.current,'x') || 0
      const startY = gsap.getProperty(wrapperRef.current,'y') || 0
      const MULT   = 330
      const maxX   = window.innerWidth  * 0.44
      const maxY   = window.innerHeight * 0.44
      const throwX = Math.max(-maxX, Math.min(maxX, startX + vx*MULT))
      const throwY = Math.max(-maxY, Math.min(maxY, startY + vy*MULT))
      const speed  = Math.sqrt(vx*vx + vy*vy)
      const flyDur = Math.max(.28, Math.min(.72, speed*.12 + .3))
      const spin   = vx >= 0 ? 1 : -1

      isThrowingRef.current = true
      isAnimRef.current     = true

      const sc       = eyeScales(eve)
      const eveLight = eve.getObjectByName('eyeLight')

      // Throw reaction
      const throwLines = REACTIONS.throw
      setReaction({ text:throwLines[Math.floor(Math.random()*throwLines.length)], key:Date.now() })
      const rt = setTimeout(() => setReaction(null), REACTION_MS)

      const tl = gsap.timeline({
        onComplete:() => { isThrowingRef.current=false; isAnimRef.current=false }
      })
      returnTlRef.current = tl

      // 1. ✅ Wide surprise eyes → .y / .x
      tl.to(sc, { y:1.5, x:1.2, duration:.1 }, 0)
      if (eveLight) tl.to(eveLight, { intensity:14, duration:.1 }, 0)

      // 2. Fly
      tl.to(wrapperRef.current, { x:throwX, y:throwY, duration:flyDur, ease:'power2.out' }, 0)

      // 3. Tumble
      tl.to(pivot.rotation, { y:`+=${Math.PI*3*spin}`, z:spin*0.5, duration:flyDur+.12, ease:'power1.out' }, 0)
      tl.to(pivot.rotation, { x:spin*.3, duration:flyDur*.5, ease:'sine.inOut', yoyo:true, repeat:1 }, 0)

      // 4. ✅ Excited squint mid-air → .y / .x
      tl.to(sc, { y:.45, x:1.1, duration:.2 }, flyDur*.45)
      if (eveLight) tl.to(eveLight, { intensity:4.5, duration:.6 }, flyDur*.45)

      // 5. Float 2.2 s
      tl.to({}, { duration:2.2 })

      // 6. Land reaction
      tl.add(() => {
        clearTimeout(rt)
        const landLines = REACTIONS.land
        setReaction({ text:landLines[Math.floor(Math.random()*landLines.length)], key:Date.now() })
        setTimeout(() => setReaction(null), REACTION_MS)
      })

      // 7. Return home
      tl.to(wrapperRef.current, { x:0, y:0, duration:.92, ease:'back.out(1.4)' })
      tl.to(pivot.rotation, { y:0, z:0, x:0, duration:.7, ease:'back.out(1.2)' }, '-=.92')

      // 8. ✅ Eyes back → .y / .x
      tl.to(sc, { y:1, x:1, duration:.3, ease:'back.out' }, '-=.52')
      if (eveLight) tl.to(eveLight, { intensity:2.5, duration:.4 }, '-=.42')

      // 9. Landing bounce
      tl.to(pivot.position, { y:.24, duration:.15, ease:'power2.out' })
        .to(pivot.position, { y:0,   duration:.52, ease:'bounce.out'  })

      // 10. ✅ Happy landing squint → open → .y
      tl.to(sc, { y:.42, duration:.18, ease:'power2.out' }, '-=.28')
        .to(sc, { y:1,   duration:.4,  ease:'back.out'   }, '+=.3')
    }

    window.addEventListener('mousemove', onWinMouseMove)
    window.addEventListener('mouseup',   onWinMouseUp)

    setTimeout(() => setMounted(true), 400)

    return () => {
      cancelAnimationFrame(rafRef.current)
      clearInterval(idleTimerRef.current)
      clearTimeout(blinkTimerRef.current)
      if (idleTlRef.current)   idleTlRef.current.kill()
      if (returnTlRef.current) returnTlRef.current.kill()
      if (loopTlRef.current)   loopTlRef.current.kill()
      triggers.forEach(t=>t.kill())
      renderer.dispose()
      window.removeEventListener('scroll',    onInteract)
      window.removeEventListener('keydown',   onInteract)
      window.removeEventListener('mousemove', onWinMouseMove)
      window.removeEventListener('mouseup',   onWinMouseUp)
      document.body.style.cursor     = ''
      document.body.style.userSelect = ''
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /* ══════════════════════════════════════════════════════════
     JSX
  ══════════════════════════════════════════════════════════ */
  return (
    <div
      ref={wrapperRef}
      className="hidden md:flex items-end gap-3 pointer-events-none"
      style={{
        position:'fixed', bottom:24, right:20, zIndex:50,
        opacity:    mounted ? 1 : 0,
        transform:  mounted ? 'translateY(0)' : 'translateY(24px)',
        transition: 'opacity .7s ease, transform .7s ease',
        userSelect: isDragging ? 'none' : 'auto',
      }}
    >

      {/* ── Speech bubble ──────────────────────────────────── */}
      <div className="relative mb-6 pointer-events-auto flex flex-col items-end gap-2">

        {/* Full bubble */}
        <div ref={bubbleRef} style={{
          maxHeight: minimized ? 0 : 320, width:230,
          opacity:   minimized ? 0 : fading ? 0 : 1,
          transform: minimized ? 'translateY(10px) scale(.95)' : fading ? 'translateY(5px) scale(.97)' : 'translateY(0) scale(1)',
          overflow:'hidden', pointerEvents: minimized ? 'none' : 'auto',
          transition:'max-height .4s cubic-bezier(.16,1,.3,1), opacity .25s ease, transform .25s ease, filter .25s ease',
          willChange:'transform, opacity, filter',
          filter: fading ? 'blur(3px)' : 'blur(0px)',
        }}>
          <div className="relative p-4 overflow-hidden" style={{
            background:'rgba(5,5,8,.92)', border:'1px solid rgba(255,255,255,.08)',
            backdropFilter:'blur(20px)', boxShadow:'0 24px 64px rgba(0,0,0,.5)',
          }}>
            <div className="absolute top-0 left-0 right-0 h-[1.5px] transition-all duration-500"
              style={{ background:`linear-gradient(90deg,${active.accent},transparent)` }} />
            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l transition-all duration-500"
              style={{ borderColor:active.accent }} />

            {/* Minimise */}
            <button onClick={() => setMinimized(true)}
              className="absolute top-2.5 right-2.5 w-[22px] h-[22px] flex items-center justify-center transition-all hover:bg-white/10"
              style={{ background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.1)', color:'rgba(240,234,214,.45)', cursor:'pointer', ...syne, fontSize:10 }}
            >─</button>

            <div className="text-[8px] font-bold tracking-[.42em] uppercase mb-2 pr-6 flex items-center gap-1.5 transition-all duration-500"
              style={{ ...syne, color:active.accent }}>
              {active.label}
              {isWaving && <span className="animate-bounce inline-block text-[10px]">👋</span>}
            </div>

            <p className="text-[12px] leading-[1.65] text-[#F0EAD6]/85 mb-1" style={dmSans}>{active.line1}</p>
            <p className="text-[11px] leading-[1.65] text-[#F0EAD6]/45 font-light" style={dmSans}>{active.line2}</p>

            <div className="mt-3 pt-2.5 border-t border-white/[.06]">
              <span className="text-[7.5px] text-[#F0EAD6]/22 tracking-[.2em] uppercase" style={syne}>
                Click · Double-click · Drag &amp; throw
              </span>
            </div>

            <div className="flex items-center gap-1.5 mt-2.5">
              {sections.map((_,i) => (
                <span key={i} className="block rounded-full" style={{
                  width: i===activeIdx?18:4, height:4,
                  background: i===activeIdx?active.accent:'rgba(255,255,255,.14)',
                  transition:'width .4s ease, background .4s ease',
                }} />
              ))}
            </div>
          </div>
          <div className="absolute right-[-9px] bottom-[28px]"
            style={{ width:0,height:0, borderTop:'7px solid transparent', borderBottom:'7px solid transparent', borderLeft:'9px solid rgba(5,5,8,.92)' }} />
        </div>

        {/* Minimised pill */}
        <div className="flex items-center gap-2 cursor-pointer" style={{
          opacity:       minimized?1:0,
          transform:     minimized?'translateY(0) scale(1)':'translateY(8px) scale(.94)',
          pointerEvents: minimized?'auto':'none',
          transition:    `opacity .35s ease ${minimized?'.2s':'0s'}, transform .35s ease ${minimized?'.2s':'0s'}`,
        }} onClick={()=>{ setMinimized(false); resetIdle() }}>
          <div className="flex items-center gap-2 px-3 py-1.5" style={{
            background:'rgba(5,5,8,.92)', border:`1px solid ${active.accent}44`,
            backdropFilter:'blur(16px)', boxShadow:`0 0 16px ${active.accent}22`,
          }}>
            <span className="block rounded-full animate-pulse flex-shrink-0" style={{ width:6,height:6,background:active.accent }} />
            <span className="text-[9px] font-bold tracking-[.32em] uppercase" style={{ ...syne, color:active.accent }}>{active.label}</span>
            <span className="text-[10px] ml-0.5" style={{ color:'rgba(240,234,214,.4)', ...syne }}>↑</span>
          </div>
          <div style={{ width:0,height:0, borderTop:'5px solid transparent', borderBottom:'5px solid transparent', borderLeft:'7px solid rgba(5,5,8,.92)' }} />
        </div>
      </div>

      {/* ── Canvas + overlays ──────────────────────────────── */}
      <div className="relative flex-shrink-0 pointer-events-auto">

        {/* Reaction bubble — duration matches REACTION_MS via CSS animation */}
        {reaction && (
          <div key={reaction.key}
            className="absolute left-1/2 whitespace-nowrap pointer-events-none"
            style={{
              bottom:240, transform:'translateX(-50%)', zIndex:60,
              // ✅ FIX: animation duration = REACTION_MS so it fades out exactly when React removes it
              animation:`reactionPop ${REACTION_MS/1000}s cubic-bezier(.16,1,.3,1) forwards`,
              background:'rgba(5,5,8,.92)',
              border:`1px solid ${active.accent}55`,
              backdropFilter:'blur(12px)',
              boxShadow:`0 0 20px ${active.accent}33`,
              padding:'6px 14px',
            }}>
            <span className="text-[12px] font-bold tracking-[.12em]" style={{ ...syne, color:active.accent }}>
              {reaction.text}
            </span>
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-[8px]"
              style={{ width:0,height:0, borderLeft:'6px solid transparent', borderRight:'6px solid transparent', borderTop:'8px solid rgba(5,5,8,.92)' }} />
          </div>
        )}

        {/* First-hover hint */}
        {showHint && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none"
            style={{ animation:'hintFade 2.5s ease forwards', zIndex:60 }}>
            <div className="text-center">
              <span className="text-[10px] font-bold tracking-[.18em] uppercase block"
                style={{ ...syne, color:'rgba(240,234,214,.6)' }}>Drag &amp; throw me! 🤏</span>
              <span className="text-[9px] tracking-[.14em] block mt-0.5"
                style={{ ...syne, color:'rgba(240,234,214,.3)' }}>or click to play</span>
            </div>
          </div>
        )}

        {/* Drag glow ring */}
        {isDragging && (
          <div className="absolute inset-0 rounded-full pointer-events-none" style={{
            boxShadow:`0 0 40px rgba(0,245,255,.35), 0 0 80px rgba(0,245,255,.12)`,
            animation:'dragPulse .5s ease-in-out infinite alternate',
          }} />
        )}

        {/* Three.js canvas */}
        <canvas
          ref={canvasRef}
          onMouseDown={handleCanvasMouseDown}
          onClick={handleClick}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
          title="Drag to throw · Click · Double-click to fly!"
          style={{
            width:'160px', height:'230px',
            display:'block', background:'transparent',
            cursor: isDragging ? 'grabbing' : 'grab',
            filter: isDragging
              ? 'drop-shadow(0 0 36px rgba(0,245,255,.45)) drop-shadow(0 8px 32px rgba(0,0,0,.4))'
              : isWaving
              ? 'drop-shadow(0 0 28px rgba(0,245,255,.38)) drop-shadow(0 8px 32px rgba(0,0,0,.4))'
              : 'drop-shadow(0 0 18px rgba(0,245,255,.14)) drop-shadow(0 8px 32px rgba(0,0,0,.4))',
            transition:'filter .4s ease',
          }}
        />
      </div>

      {/* Keyframes */}
      <style>{`
        @keyframes reactionPop {
          from { opacity:0; transform:translate(-50%,10px)  scale(.85); }
          18%  { opacity:1; transform:translate(-50%,0)     scale(1.05); }
          78%  { opacity:1; transform:translate(-50%,0)     scale(1);    }
          to   { opacity:0; transform:translate(-50%,-8px)  scale(.92); }
        }
        @keyframes hintFade {
          0%   { opacity:0; transform:translate(-50%, 5px); }
          14%  { opacity:1; transform:translate(-50%, 0);   }
          78%  { opacity:1; transform:translate(-50%, 0);   }
          100% { opacity:0; transform:translate(-50%,-5px); }
        }
        @keyframes dragPulse {
          from { opacity:.6; } to { opacity:1; }
        }
      `}</style>
    </div>
  )
}
