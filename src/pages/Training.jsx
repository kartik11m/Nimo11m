import { useState, useEffect, useRef, useCallback, Fragment } from "react";
import { useOwnerAuth } from '../context/OwnerAuthContext';
import AddCourseButton from '../components/AddCourseButton';
import EditCourseButton from '../components/EditCourseButton';
import EditableText from '../components/EditableText';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// ── Font helpers (only for values Tailwind can't handle) ──────────
const bebasNeue = { fontFamily: "'Bebas Neue', sans-serif" };
const syne      = { fontFamily: "'Syne', sans-serif" };
const dmSans    = { fontFamily: "'DM Sans', sans-serif" };

// ── CONSTANTS ────────────────────────────────────────────────────

const lvlMap = {
  beginner:     { color: "#00F5FF", rgb: "0,245,255",   bg: "rgba(0,245,255,.1)",   border: "rgba(0,245,255,.25)",   label: "Beginner"     },
  intermediate: { color: "#FF6B35", rgb: "255,107,53",  bg: "rgba(255,107,53,.1)",  border: "rgba(255,107,53,.25)",  label: "Intermediate" },
  advanced:     { color: "#A855F7", rgb: "168,85,247",  bg: "rgba(168,85,247,.1)",  border: "rgba(168,85,247,.25)",  label: "Advanced"     },
};

const catMap = {
  hardware: "hardware",
  software: "software",
  robotics: "robotics",
};

const filterTabs = [
  { cat: "all",      label: "All Courses"    },
  { cat: "hardware", label: "Hardware"       },
  { cat: "software", label: "Software & AI"  },
  { cat: "robotics", label: "Robotics"       },
];

const stats = [
  { num: "6K+",  label: "Students",  color: "#FF6B35" },
  { num: "6",    label: "Courses",   color: "#00F5FF" },
  { num: "100%", label: "Certified", color: "#A855F7" },
  { num: "3",    label: "Tracks",    color: "#FF006E" },
];

const pathSteps = [
  { icon: "🌱", tag: "Track 01", title: "Beginner",     sub: "Arduino · Python AI",          color: "#00F5FF", rgb: "0,245,255"   },
  { icon: "⚡", tag: "Track 02", title: "Intermediate", sub: "ESP32 · Raspberry Pi · PCB",   color: "#FF6B35", rgb: "255,107,53"  },
  { icon: "🚀", tag: "Track 03", title: "Advanced",     sub: "ROS2 · Autonomous Systems",    color: "#A855F7", rgb: "168,85,247"  },
  { icon: "🏆", tag: "Outcome",  title: "Certified",    sub: "Industry-ready engineer",       color: "#FF006E", rgb: "255,0,110"   },
];

// ── HELPER COMPONENTS ─────────────────────────────────────────────

function StatBox({ num, label, color, numId, labelId }) {
  return (
    <div className="relative px-5 py-4 min-w-[110px] bg-white/[.03] border border-white/[.07] backdrop-blur-lg overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[1.5px]" style={{ background: color }} />
      <div className="leading-none" style={{ ...bebasNeue, fontSize: "2rem", color }}><EditableText contentId={numId}>{num}</EditableText></div>
      <div className="text-[8px] font-bold tracking-[.32em] uppercase text-[#F0EAD6]/30 mt-1" style={syne}><EditableText contentId={labelId}>{label}</EditableText></div>
    </div>
  );
}

function ModalField({ label, type = "text", placeholder, value, onChange }) {
  return (
    <div className="mb-3.5">
      <label className="block text-[8px] font-bold tracking-[.32em] uppercase text-[#F0EAD6]/35 mb-1.5" style={syne}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-white/[.035] border border-white/[.09] text-[#F0EAD6] px-3 py-2.5 text-[13px] font-light outline-none focus:border-[#FF6B35]/40 transition-colors placeholder:text-[#F0EAD6]/20"
        style={dmSans}
      />
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[900] flex items-center justify-center p-6 bg-[#050508]/85 backdrop-blur-xl"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div
        className="relative bg-[#08080e] border border-white/[.09] p-9 w-full max-w-[440px]"
        style={{ animation: "slideUp .35s cubic-bezier(.16,1,.3,1)" }}
      >
        {/* Top gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: "linear-gradient(90deg,#FF6B35,#FF006E)" }} />
        {/* Corner bracket */}
        <div className="absolute top-0 left-0 w-[22px] h-[22px] border-t border-l border-[#FF6B35]" />
        {/* Close */}
        <button
          className="absolute top-3.5 right-4 text-[9px] font-bold tracking-[.25em] uppercase text-[#F0EAD6]/35 bg-transparent border-none cursor-pointer hover:text-[#F0EAD6] transition-colors"
          style={syne}
          onClick={onClose}
        >
          ✕ Close
        </button>
        {children}
      </div>
    </div>
  );
}

// ── COURSE CARD ───────────────────────────────────────────────────
function CourseCard({ course, onEnroll, onCourseUpdated, onCourseDeleted }) {
  const { isOwner } = useOwnerAuth()
  const lv        = lvlMap[course.level]
  const shellRef  = useRef(null);
  const cardRef   = useRef(null);
  const rafRef    = useRef(null);
  const st        = useRef({ cRX: 0, cRY: 0, tRX: 0, tRY: 0, hovering: false });

  const [hovered,    setHovered]    = useState(false);
  const [glowPos,    setGlowPos]    = useState({ x: 50, y: 50 });
  const [glowOn,     setGlowOn]     = useState(false);
  const [dynShadow,  setDynShadow]  = useState("");
  const [dynBorder,  setDynBorder]  = useState("rgba(255,255,255,.07)");

  const lerp = (a, b, t) => a + (b - a) * t;

  const tick = useCallback(() => {
    const s = st.current;
    s.cRX = lerp(s.cRX, s.tRX, 0.1);
    s.cRY = lerp(s.cRY, s.tRY, 0.1);
    if (cardRef.current) {
      cardRef.current.style.transform =
        `rotateX(${s.cRX}deg) rotateY(${s.cRY}deg) translateZ(${s.hovering ? 10 : 0}px)`;
    }
    const moving =
      Math.abs(s.cRX - s.tRX) > 0.01 ||
      Math.abs(s.cRY - s.tRY) > 0.01;
    if (moving || s.hovering) rafRef.current = requestAnimationFrame(tick);
  }, []);

  const handleMouseMove = useCallback((e) => {
    const r = shellRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top)  / r.height;
    st.current.tRY = (x - 0.5) * 18;
    st.current.tRX = (0.5 - y) * 14;
    const ox = (x - 0.5) * 56;
    const oy = (y - 0.5) * 44;
    setGlowPos({ x: x * 100, y: y * 100 });
    setDynShadow(`${ox}px ${oy}px 40px rgba(${lv.rgb},.28), 0 0 18px rgba(${lv.rgb},.14)`);
    setDynBorder(`rgba(${lv.rgb},.44)`);
  }, [lv.rgb]);

  const handleMouseEnter = useCallback(() => {
    st.current.hovering = true;
    if (cardRef.current) cardRef.current.style.transition = "none";
    setHovered(true);
    setGlowOn(true);
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const handleMouseLeave = useCallback(() => {
    st.current.hovering = false;
    st.current.tRX = 0;
    st.current.tRY = 0;
    if (cardRef.current) {
      cardRef.current.style.transition = "transform .7s cubic-bezier(.23,1,.32,1)";
      cardRef.current.style.transform  = "rotateX(0deg) rotateY(0deg) translateZ(0px)";
    }
    setHovered(false);
    setGlowOn(false);
    setDynShadow("");
    setDynBorder("rgba(255,255,255,.07)");
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <div
      ref={shellRef}
      className="group"
      style={{ perspective: "900px", cursor: "pointer" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* 3-D tilt wrapper */}
      <div ref={cardRef} style={{ position: "relative", transformStyle: "preserve-3d", willChange: "transform" }}>

        {/* Radial border-glow layer — follows mouse */}
        <div style={{
          position:   "absolute", inset: -1,
          pointerEvents: "none", zIndex: 0,
          background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(${lv.rgb},.55) 0%, rgba(${lv.rgb},.12) 28%, transparent 60%)`,
          opacity:    glowOn ? 1 : 0,
          transition: "opacity .3s ease",
        }} />

        {/* Card surface */}
        <div
          className="relative z-[1] overflow-hidden backdrop-blur-lg"
          style={{
            background:  hovered ? "rgba(255,255,255,.045)" : "rgba(255,255,255,.03)",
            border:      `1px solid ${dynBorder}`,
            boxShadow:   dynShadow,
            transition:  "background .3s ease",
          }}
        >
          {/* Edit button */}
          {isOwner && (
            <EditCourseButton 
              course={course}
              onCourseUpdated={onCourseUpdated}
              onCourseDeleted={onCourseDeleted}
            />
          )}
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{
            background:      lv.color,
            transform:       hovered ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: "left",
            transition:      "transform .45s cubic-bezier(.16,1,.3,1)",
          }} />

          {/* Corner TL */}
          <div className="absolute top-0 left-0 w-[18px] h-[18px]" style={{
            borderTop:   `1px solid ${lv.color}`,
            borderLeft:  `1px solid ${lv.color}`,
            opacity:     hovered ? 1 : 0,
            transition:  "opacity .3s ease",
          }} />

          {/* Corner BR */}
          <div className="absolute bottom-0 right-0 w-[18px] h-[18px]" style={{
            borderBottom: `1px solid rgba(${lv.rgb},.3)`,
            borderRight:  `1px solid rgba(${lv.rgb},.3)`,
            opacity:      hovered ? 1 : 0,
            transition:   "opacity .3s ease",
          }} />

          {/* ── Card Header ── */}
          <div className="px-[22px] pt-[22px] pb-[18px] border-b border-white/[.055]">
            {/* Level pill */}
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 mb-3.5 border text-[8px] font-bold tracking-[.3em] uppercase"
              style={{ ...syne, background: lv.bg, borderColor: lv.border, color: lv.color }}
            >
              <span className="w-[5px] h-[5px] rounded-full flex-shrink-0" style={{ background: lv.color }} />
              {lv.label}
            </div>

            {/* Title */}
            <h3
              className="leading-[.95] tracking-[-0.01em] mb-1"
              style={{
                ...bebasNeue, fontSize: 28,
                color:      hovered ? lv.color : "#F0EAD6",
                transition: "color .3s ease",
              }}
            >
              {course.title}
            </h3>

            {/* Sub */}
            <div className="text-[8px] font-bold tracking-[.3em] uppercase text-[#F0EAD6]/30" style={syne}>
              {course.sub}
            </div>
          </div>

          {/* ── Card Body ── */}
          <div className="px-[22px] py-[18px]">

            {/* Description */}
            <p
              className="text-[13px] font-light leading-[1.75] mb-4"
              style={{
                ...dmSans,
                color:      hovered ? "rgba(240,234,214,.65)" : "rgba(240,234,214,.5)",
                transition: "color .3s ease",
              }}
            >
              {course.description}
            </p>

            {/* Meta row */}
            <div className="flex gap-4 flex-wrap mb-4">
              {[
                { icon: "⏱", text: course.duration },
                { icon: "📅", text: course.sessions },
                { icon: "👥", text: course.students },
              ].map((m) => (
                <div key={m.text} className="flex items-center gap-1.5 text-[11px] font-light text-[#F0EAD6]/35" style={dmSans}>
                  <span className="opacity-70">{m.icon}</span>
                  {m.text}
                </div>
              ))}
            </div>

            {/* Modules list */}
            <ul className="list-none">
              {course.modules.map((mod) => (
                <li
                  key={mod}
                  className="flex items-center gap-2 py-1.5 text-[12px] font-light text-[#F0EAD6]/50 border-b border-white/[.045] last:border-b-0"
                  style={dmSans}
                >
                  <span className="text-[8px] flex-shrink-0" style={{ color: lv.color }}>›</span>
                  {mod}
                </li>
              ))}
            </ul>
          </div>

          {/* ── Card Footer ── */}
          <div className="px-[22px] py-[14px] border-t border-white/[.055] flex items-center justify-between">
            <div>
              <div className="leading-none tracking-[.06em]" style={{ ...bebasNeue, fontSize: "1.5rem", color: lv.color }}>
                {course.price}
              </div>
              <div className="text-[10px] font-light text-[#F0EAD6]/30 tracking-[.04em] mt-0.5" style={dmSans}>
                / per person
              </div>
            </div>
            <button
              className="text-[9px] font-bold tracking-[.28em] uppercase px-[18px] py-2 border cursor-pointer transition-opacity duration-200 hover:opacity-80"
              style={{
                ...syne,
                background: `rgba(${lv.rgb},.12)`,
                color:       lv.color,
                border:      `1px solid rgba(${lv.rgb},.35)`,
              }}
              onClick={(e) => { e.stopPropagation(); onEnroll(course.title); }}
            >
              Enroll Now →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────────
export default function TrainingPage() {
  const { isOwner } = useOwnerAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [enrollModal, setEnrollModal] = useState({ open: false, courseName: "" })
  const [enrollForm, setEnrollForm] = useState({ name: "", email: "", phone: "", experience: "Complete Beginner" })
  const [enrollError, setEnrollError] = useState("")
  const [submittingEnroll, setSubmittingEnroll] = useState(false)
  const [successModal, setSuccessModal] = useState(false)
  const [ctaModal, setCtaModal] = useState(false)

  // Fetch courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API_URL}/courses`)
        const data = await res.json()
        if (data.success) {
          setCourses(data.courses.sort((a, b) => a.order - b.order))
        }
      } catch (error) {
        console.error('Error fetching courses:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  // Handle course deletion from UI
  const handleCourseDeleted = useCallback((courseId) => {
    setCourses(courses.filter(c => c.courseId !== courseId))
  }, [courses])

  useEffect(() => {
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap"
    document.head.appendChild(link)
    return () => document.head.removeChild(link)
  }, [])

  const filtered = filter === "all" ? courses : courses.filter((c) => c.category === filter)
  const openEnroll = (name) => {
    setEnrollModal({ open: true, courseName: name })
    setEnrollForm({ name: "", email: "", phone: "", experience: "Complete Beginner" })
    setEnrollError("")
    setSubmittingEnroll(false)
  }

  const closeEnroll = () => {
    setEnrollModal({ open: false, courseName: "" })
    setEnrollError("")
    setSubmittingEnroll(false)
  }

  const submitEnroll = async () => {
    if (!enrollForm.name.trim() || !enrollForm.email.trim() || !enrollForm.phone.trim()) {
      setEnrollError("Please enter your name, email, and phone number.")
      return
    }

    setSubmittingEnroll(true)
    setEnrollError("")

    try {
      const response = await fetch(`${API_URL}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "Course Enrollment",
          name: enrollForm.name,
          email: enrollForm.email,
          phone: enrollForm.phone,
          service: enrollModal.courseName,
          message: `Experience level: ${enrollForm.experience}`,
        }),
      })

      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Enrollment request failed.")
      }

      closeEnroll()
      setTimeout(() => setSuccessModal(true), 200)
    } catch (error) {
      setEnrollError(error.message || "We could not submit your enrollment right now. Please try again.")
    } finally {
      setSubmittingEnroll(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050508] text-[#F0EAD6]" style={dmSans}>
      {/* ══ PAGE HERO ════════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-[140px] pb-20 px-12 border-b border-white/[.055]">

        {/* Atmosphere */}
        <div className="absolute -top-[80px] -left-[60px] w-[500px] h-[400px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse,rgba(255,107,53,.11) 0%,transparent 70%)" }} />
        <div className="absolute -bottom-[80px] -right-[40px] w-[450px] h-[350px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse,rgba(168,85,247,.1) 0%,transparent 70%)" }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(255,107,53,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,107,53,.022) 1px,transparent 1px)",
          backgroundSize:  "48px 48px",
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(0,0,0,.055) 3px,rgba(0,0,0,.055) 4px)",
        }} />

        <div className="relative z-[2] max-w-[1100px] mx-auto flex items-end justify-between gap-12 flex-wrap">

          {/* Left — heading */}
          <div className="max-w-[600px]">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-[7px] bg-[#FF6B35]/[.07] border border-[#FF6B35]/[.22] mb-[22px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse" />
              <span className="text-[9px] font-bold tracking-[.4em] uppercase text-[#FF6B35]" style={syne}>
                <EditableText contentId="training.hero.badge">Skill Development</EditableText>
              </span>
            </div>

            {/* Title */}
            <h1 className="leading-[.88] tracking-[-0.01em] mb-5" style={{
              ...bebasNeue,
              fontSize:             "clamp(52px,9vw,96px)",
              background:           "linear-gradient(160deg,#F0EAD6 0%,rgba(240,234,214,.35) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor:  "transparent",
              backgroundClip:       "text",
            }}>
              <EditableText contentId="training.hero.title-line1">Training</EditableText><br />
              <EditableText contentId="training.hero.title-line2">Programs</EditableText>
            </h1>

            {/* Rule */}
            <div className="w-12 h-px my-5" style={{ background: "linear-gradient(90deg,#FF6B35,transparent)" }} />

            {/* Sub */}
            <p className="font-light leading-[1.8] text-[#F0EAD6]/50 tracking-[.02em] max-w-[480px]"
              style={{ ...dmSans, fontSize: "clamp(13px,1.3vw,15px)" }}>
              <EditableText contentId="training.hero.description">From absolute beginner to advanced engineer — structured courses in embedded systems, IoT, and AI with live projects and certifications.</EditableText>
            </p>
          </div>

          {/* Right — stats */}
          <div className="flex flex-col gap-4 flex-shrink-0">
            <div className="flex gap-4">
              {stats.slice(0, 2).map((s, index) => <StatBox key={s.label} {...s} numId={`training.stats.${index}.num`} labelId={`training.stats.${index}.label`} />)}
            </div>
            <div className="flex gap-4">
              {stats.slice(2).map((s, index) => <StatBox key={s.label} {...s} numId={`training.stats.${index + 2}.num`} labelId={`training.stats.${index + 2}.label`} />)}
            </div>
          </div>
        </div>
      </section>

      {/* ══ LEARNING PATH ════════════════════════════════════════ */}
      <div className="px-12 py-8 bg-white/[.015] border-b border-white/[.07]">
        <div className="max-w-[1100px] mx-auto flex items-center">
          {pathSteps.map((step, i) => (
            <Fragment key={step.title}>
              <div className="flex-1 flex items-center gap-3.5 px-6 py-[18px] hover:bg-white/[.02] transition-colors duration-300 cursor-default">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-base flex-shrink-0"
                  style={{ background: `rgba(${step.rgb},.1)`, boxShadow: `0 0 0 1px rgba(${step.rgb},.2)` }}
                >
                  {step.icon}
                </div>
                <div>
                  <div className="text-[8px] font-bold tracking-[.35em] uppercase mb-0.5"
                    style={{ ...syne, color: step.color }}>
                    <EditableText contentId={`training.path.${i}.tag`}>{step.tag}</EditableText>
                  </div>
                  <div className="text-[13px] font-bold" style={syne}><EditableText contentId={`training.path.${i}.title`}>{step.title}</EditableText></div>
                  <div className="text-[11px] font-light text-[#F0EAD6]/40 mt-0.5" style={dmSans}><EditableText contentId={`training.path.${i}.sub`}>{step.sub}</EditableText></div>
                </div>
              </div>
              {i < pathSteps.length - 1 && (
                <span className="text-lg text-[#F0EAD6]/[.12] flex-shrink-0 -mx-2 z-[1]">›</span>
              )}
            </Fragment>
          ))}
        </div>
      </div>

      {/* ══ FILTER TABS ══════════════════════════════════════════ */}
      <div className="max-w-[1100px] mx-auto px-12 pt-10 pb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[8px] font-bold tracking-[.35em] uppercase text-[#F0EAD6]/[.28] mr-2" style={syne}>
            Filter
          </span>
          {filterTabs.map((f) => (
            <button
              key={f.cat}
              className={`text-[9px] font-bold tracking-[.3em] uppercase px-[18px] py-2 border cursor-pointer transition-all duration-200 ${
                filter === f.cat
                  ? "bg-[#FF6B35]/[.08] border-[#FF6B35]/40 text-[#FF6B35]"
                  : "bg-transparent border-white/10 text-[#F0EAD6]/40 hover:border-white/20 hover:text-[#F0EAD6]/70"
              }`}
              style={syne}
              onClick={() => setFilter(f.cat)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ══ MANAGE YOUR COURSES (Owner Only) ═════════════════════ */}
      {isOwner && (
        <div className="max-w-[1100px] mx-auto px-12 py-8 mb-6 relative overflow-hidden border border-[#A855F7]/[.22]" style={{ background: "rgba(168,85,247,.04)" }}>
          <div className="absolute top-0 left-0 right-0 h-[1.5px]" style={{ background: "linear-gradient(90deg, rgba(168,85,247,.5) 0%, transparent 100%)" }} />
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h3 className="text-lg font-bold text-[#A855F7] mb-1" style={bebasNeue}>Manage Your Courses</h3>
              <p className="text-[13px] text-[#F0EAD6]/60">Create new courses, edit existing ones, or remove courses from your catalog</p>
            </div>
            <AddCourseButton 
              onCourseAdded={() => {
                // Refresh courses from API
                fetch(`${API_URL}/courses`)
                  .then(res => res.json())
                  .then(data => {
                    if (data.success) {
                      setCourses(data.courses.sort((a, b) => a.order - b.order))
                    }
                  })
                  .catch(err => console.error('Error refreshing courses:', err))
              }}
            />
          </div>
        </div>
      )}

      {/* ══ COURSES GRID ═════════════════════════════════════════ */}
      <div className="max-w-[1100px] mx-auto px-12 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c) => (
            <CourseCard 
              key={c.courseId} 
              course={c} 
              onEnroll={openEnroll}
              onCourseUpdated={(updatedCourse) => {
                setCourses(courses.map(co => co.courseId === updatedCourse.courseId ? updatedCourse : co))
              }}
              onCourseDeleted={handleCourseDeleted}
            />
          ))}
        </div>
      </div>

      {/* ══ CTA BANNER ═══════════════════════════════════════════ */}
      <div
        className="mx-12 mb-20 relative overflow-hidden border border-[#FF6B35]/[.22] px-12 py-10 flex items-center justify-between gap-8 flex-wrap"
        style={{ background: "rgba(255,107,53,.04)" }}
      >
        {/* Top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px]"
          style={{ background: "linear-gradient(90deg,#FF6B35,#FF006E,transparent)" }} />
        {/* Corner */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-[#FF6B35]" />
        {/* Glow */}
        <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-[300px] h-[200px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse,rgba(255,107,53,.1) 0%,transparent 70%)" }} />

        <div className="relative z-[1]">
          <div className="text-[9px] font-bold tracking-[.35em] uppercase text-[#FF6B35] mb-2.5" style={syne}>
            <EditableText contentId="training.cta.badge">Custom Programs</EditableText>
          </div>
          <h2 className="leading-[.95] tracking-[-0.01em] mb-2.5" style={{ ...bebasNeue, fontSize: "clamp(28px,3.5vw,42px)" }}>
            <EditableText contentId="training.cta.title-line1">Need a tailored</EditableText><br />
            <EditableText contentId="training.cta.title-line2">training program?</EditableText>
          </h2>
          <p className="text-[13px] font-light text-[#F0EAD6]/45 leading-[1.7] max-w-[460px]" style={dmSans}>
            <EditableText contentId="training.cta.description">We design custom curricula for institutions, colleges, and corporate teams. Tell us your requirements and we'll build the perfect program.</EditableText>
          </p>
        </div>

        <button
          className="relative z-[1] text-[10px] font-bold tracking-[.32em] uppercase bg-[#FF6B35] text-white border-none px-8 py-3.5 cursor-pointer flex-shrink-0 shadow-[0_0_24px_rgba(255,107,53,.25)] hover:bg-[#ff8040] hover:shadow-[0_0_40px_rgba(255,107,53,.5)] hover:-translate-y-px transition-all duration-300"
          style={syne}
          onClick={() => setCtaModal(true)}
        >
          <EditableText contentId="training.cta.button">Book a Consultation →</EditableText>
        </button>
      </div>

      {/* ══ ENROLL MODAL ═════════════════════════════════════════ */}
      {enrollModal.open && (
        <Modal onClose={closeEnroll}>
          <div className="text-[2rem] mb-3.5">📚</div>
          <div className="leading-none tracking-[.04em] mb-1.5" style={{ ...bebasNeue, fontSize: "2rem" }}>Enroll Now</div>
          <div className="text-[9px] font-bold tracking-[.32em] uppercase text-[#FF6B35] mb-5" style={syne}>
            {enrollModal.courseName}
          </div>
          <p className="text-[13px] font-light text-[#F0EAD6]/45 mb-[22px] leading-[1.7]" style={dmSans}>
            Register your interest and we'll send you the full schedule, syllabus,
            and payment details within 24 hours.
          </p>
          <ModalField
            label="Full Name"
            type="text"
            placeholder="Your full name"
            value={enrollForm.name}
            onChange={(e) => setEnrollForm((prev) => ({ ...prev, name: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <ModalField
              label="Email"
              type="email"
              placeholder="you@email.com"
              value={enrollForm.email}
              onChange={(e) => setEnrollForm((prev) => ({ ...prev, email: e.target.value }))}
            />
            <ModalField
              label="Phone"
              type="tel"
              placeholder="+91 XXXXX XXXXX"
              value={enrollForm.phone}
              onChange={(e) => setEnrollForm((prev) => ({ ...prev, phone: e.target.value }))}
            />
          </div>
          <div className="mb-3.5">
            <label className="block text-[8px] font-bold tracking-[.32em] uppercase text-[#F0EAD6]/35 mb-1.5" style={syne}>
              Experience Level
            </label>
            <select
              value={enrollForm.experience}
              onChange={(e) => setEnrollForm((prev) => ({ ...prev, experience: e.target.value }))}
              className="w-full bg-white/[.035] border border-white/[.09] text-[#F0EAD6] px-3 py-2.5 text-[13px] font-light outline-none focus:border-[#FF6B35]/40 transition-colors"
              style={dmSans}
            >
              <option>Complete Beginner</option>
              <option>Some Experience</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
          {enrollError ? (
            <div className="mb-3 rounded border border-[#FF6B35]/30 bg-[#FF6B35]/[.08] px-3 py-2 text-[11px] text-[#ffb08a]" style={dmSans}>
              {enrollError}
            </div>
          ) : null}
          <div className="flex gap-2.5 mt-5">
            <button
              className="flex-1 text-[10px] font-bold tracking-[.28em] uppercase bg-[#FF6B35] text-white border-none py-3.5 cursor-pointer hover:bg-[#ff8040] hover:shadow-[0_0_28px_rgba(255,107,53,.4)] transition-all duration-300"
              style={syne}
              onClick={submitEnroll}
              disabled={submittingEnroll}
            >
              {submittingEnroll ? "Submitting..." : "Enroll Now"}
            </button>
            <button
              className="text-[10px] font-semibold tracking-[.28em] uppercase bg-transparent border border-white/10 text-[#F0EAD6]/40 px-5 py-3.5 cursor-pointer hover:border-white/20 hover:text-[#F0EAD6]/65 transition-all duration-200"
              style={syne}
              onClick={closeEnroll}
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}

      {/* ══ SUCCESS MODAL ════════════════════════════════════════ */}
      {successModal && (
        <Modal onClose={() => setSuccessModal(false)}>
          <div className="text-center">
            <span className="text-[2.5rem] mb-4 block">🎉</span>
            <div className="leading-none tracking-[.04em] mb-2.5" style={{ ...bebasNeue, fontSize: "2rem" }}>You're In!</div>
            <p className="text-[13px] font-light text-[#F0EAD6]/45 mb-6 leading-[1.7]" style={dmSans}>
              We've received your enrollment request. Our team will reach out within
              24 hours with the course schedule and next steps.
            </p>
            <button
              className="w-full text-[10px] font-bold tracking-[.28em] uppercase bg-[#FF6B35] text-white border-none py-3.5 cursor-pointer hover:bg-[#ff8040] transition-all duration-300"
              style={syne}
              onClick={() => setSuccessModal(false)}
            >
              Awesome, Thanks!
            </button>
          </div>
        </Modal>
      )}

      {/* ══ CONSULTATION MODAL ═══════════════════════════════════ */}
      {ctaModal && (
        <Modal onClose={() => setCtaModal(false)}>
          <div className="text-[2rem] mb-3.5">🤝</div>
          <div className="leading-none tracking-[.04em] mb-1.5" style={{ ...bebasNeue, fontSize: "2rem" }}>Book a Call</div>
          <div className="text-[9px] font-bold tracking-[.32em] uppercase text-[#00F5FF] mb-5" style={syne}>
            Custom Training Consultation
          </div>
          <p className="text-[13px] font-light text-[#F0EAD6]/45 mb-[22px] leading-[1.7]" style={dmSans}>
            Tell us about your institution and requirements. We'll design a program that fits perfectly.
          </p>
          <ModalField label="Contact Name"  type="text" placeholder="Your name" />
          <div className="grid grid-cols-2 gap-3">
            <ModalField label="Phone"       type="tel"  placeholder="+91 XXXXX XXXXX" />
            <ModalField label="Institution" type="text" placeholder="School / College" />
          </div>
          <ModalField label="City" type="text" placeholder="Your city" />
          <div className="flex gap-2.5 mt-5">
            <button
              className="flex-1 text-[10px] font-bold tracking-[.28em] uppercase bg-[#FF6B35] text-white border-none py-3.5 cursor-pointer hover:bg-[#ff8040] transition-all duration-300"
              style={syne}
              onClick={() => { setCtaModal(false); setTimeout(() => setSuccessModal(true), 200); }}
            >
              Submit Request
            </button>
            <button
              className="text-[10px] font-semibold tracking-[.28em] uppercase bg-transparent border border-white/10 text-[#F0EAD6]/40 px-5 py-3.5 cursor-pointer hover:border-white/20 hover:text-[#F0EAD6]/65 transition-all duration-200"
              style={syne}
              onClick={() => setCtaModal(false)}
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}

    </div>
  );
}
