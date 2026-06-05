import { useState, useRef, useCallback, useEffect, Fragment } from "react";
import { Link } from "react-router-dom";

const bebasNeue = { fontFamily: "'Bebas Neue', sans-serif" };
const syne      = { fontFamily: "'Syne', sans-serif" };
const dmSans    = { fontFamily: "'DM Sans', sans-serif" };

const previewCourses = [
  {
    title: "Arduino Masterclass",
    sub: "Embedded Systems",
    level: "beginner",
    desc: "From zero to hero with Arduino. Learn microcontroller basics, sensor interfacing, and build 10+ real-world projects.",
    duration: "8 Weeks",
    sessions: "24 Sessions",
    price: "₹2,999",
    icon: "⚙️",
  },
  {
    title: "ESP32 & IoT Dev",
    sub: "Internet of Things",
    level: "intermediate",
    desc: "Master WiFi/BLE programming, cloud connectivity, MQTT, and build smart home & industrial monitoring systems.",
    duration: "10 Weeks",
    sessions: "30 Sessions",
    price: "₹3,999",
    icon: "📡",
  },
  {
    title: "Robotics with ROS",
    sub: "Robot Operating System",
    level: "advanced",
    desc: "Industry-standard ROS2 for autonomous robots. Covers SLAM, navigation, robot perception, and Gazebo simulation.",
    duration: "14 Weeks",
    sessions: "42 Sessions",
    price: "₹6,999",
    icon: "🤖",
  },
];

const lvlMap = {
  beginner:     { color: "#00F5FF", rgb: "0,245,255",  bg: "rgba(0,245,255,.08)",  border: "rgba(0,245,255,.22)",  label: "Beginner"     },
  intermediate: { color: "#FF6B35", rgb: "255,107,53", bg: "rgba(255,107,53,.08)", border: "rgba(255,107,53,.22)", label: "Intermediate" },
  advanced:     { color: "#A855F7", rgb: "168,85,247", bg: "rgba(168,85,247,.08)", border: "rgba(168,85,247,.22)", label: "Advanced"     },
};

const stats = [
  { num: "6K+",  label: "Students",  color: "#FF6B35" },
  { num: "6",    label: "Courses",   color: "#00F5FF" },
  { num: "100%", label: "Certified", color: "#A855F7" },
];

// ── Mini Course Card ──────────────────────────────────────────────
function PreviewCard({ course }) {
  const lv       = lvlMap[course.level];
  const shellRef = useRef(null);
  const cardRef  = useRef(null);
  const rafRef   = useRef(null);
  const st       = useRef({ cRX: 0, cRY: 0, tRX: 0, tRY: 0, hovering: false });

  const [hovered,   setHovered]   = useState(false);
  const [glowPos,   setGlowPos]   = useState({ x: 50, y: 50 });
  const [glowOn,    setGlowOn]    = useState(false);
  const [dynBorder, setDynBorder] = useState("rgba(255,255,255,.07)");
  const [dynShadow, setDynShadow] = useState("");

  const lerp = (a, b, t) => a + (b - a) * t;

  const tick = useCallback(() => {
    const s = st.current;
    s.cRX = lerp(s.cRX, s.tRX, 0.1);
    s.cRY = lerp(s.cRY, s.tRY, 0.1);
    if (cardRef.current) {
      cardRef.current.style.transform =
        `rotateX(${s.cRX}deg) rotateY(${s.cRY}deg) translateZ(${s.hovering ? 10 : 0}px)`;
    }
    const moving = Math.abs(s.cRX - s.tRX) > 0.01 || Math.abs(s.cRY - s.tRY) > 0.01;
    if (moving || s.hovering) rafRef.current = requestAnimationFrame(tick);
  }, []);

  const handleMouseMove = useCallback((e) => {
    const r = shellRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top)  / r.height;
    st.current.tRY = (x - 0.5) * 16;
    st.current.tRX = (0.5 - y) * 12;
    const ox = (x - 0.5) * 48;
    const oy = (y - 0.5) * 36;
    setGlowPos({ x: x * 100, y: y * 100 });
    setDynShadow(`${ox}px ${oy}px 36px rgba(${lv.rgb},.24), 0 0 14px rgba(${lv.rgb},.12)`);
    setDynBorder(`rgba(${lv.rgb},.4)`);
  }, [lv.rgb]);

  const handleMouseEnter = useCallback(() => {
    st.current.hovering = true;
    if (cardRef.current) cardRef.current.style.transition = "none";
    setHovered(true); setGlowOn(true);
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const handleMouseLeave = useCallback(() => {
    st.current.hovering = false;
    st.current.tRX = 0; st.current.tRY = 0;
    if (cardRef.current) {
      cardRef.current.style.transition = "transform .7s cubic-bezier(.23,1,.32,1)";
      cardRef.current.style.transform  = "rotateX(0deg) rotateY(0deg) translateZ(0px)";
    }
    setHovered(false); setGlowOn(false);
    setDynShadow(""); setDynBorder("rgba(255,255,255,.07)");
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <div
      ref={shellRef}
      style={{ perspective: "900px", cursor: "pointer" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div ref={cardRef} style={{ position: "relative", transformStyle: "preserve-3d", willChange: "transform" }}>

        {/* Radial glow border */}
        <div style={{
          position: "absolute", inset: -1, pointerEvents: "none", zIndex: 0,
          background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(${lv.rgb},.5) 0%, rgba(${lv.rgb},.1) 28%, transparent 60%)`,
          opacity: glowOn ? 1 : 0, transition: "opacity .3s ease",
        }} />

        <div
          className="relative z-[1] overflow-hidden backdrop-blur-lg"
          style={{
            background: hovered ? "rgba(255,255,255,.045)" : "rgba(255,255,255,.03)",
            border:     `1px solid ${dynBorder}`,
            boxShadow:  dynShadow,
            transition: "background .3s ease",
          }}
        >
          {/* Top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px]" style={{
            background: lv.color,
            transform: hovered ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: "left",
            transition: "transform .45s cubic-bezier(.16,1,.3,1)",
          }} />

          {/* Corner TL */}
          <div className="absolute top-0 left-0 w-[18px] h-[18px]" style={{
            borderTop: `1px solid ${lv.color}`, borderLeft: `1px solid ${lv.color}`,
            opacity: hovered ? 1 : 0, transition: "opacity .3s ease",
          }} />
          {/* Corner BR */}
          <div className="absolute bottom-0 right-0 w-[18px] h-[18px]" style={{
            borderBottom: `1px solid rgba(${lv.rgb},.3)`, borderRight: `1px solid rgba(${lv.rgb},.3)`,
            opacity: hovered ? 1 : 0, transition: "opacity .3s ease",
          }} />

          {/* Header */}
          <div className="px-6 pt-6 pb-5 border-b border-white/[.055]">
            <div className="flex items-start justify-between gap-3 mb-4">
              {/* Level pill */}
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-1 border text-[8px] font-bold tracking-[.3em] uppercase"
                style={{ ...syne, background: lv.bg, borderColor: lv.border, color: lv.color }}
              >
                <span className="w-[5px] h-[5px] rounded-full flex-shrink-0" style={{ background: lv.color }} />
                {lv.label}
              </div>
              {/* Icon */}
              <div
                className="w-10 h-10 flex items-center justify-center text-lg flex-shrink-0"
                style={{ background: `rgba(${lv.rgb},.08)`, border: `1px solid rgba(${lv.rgb},.18)` }}
              >
                {course.icon}
              </div>
            </div>

            <h3
              className="leading-[.92] tracking-[-0.01em] mb-1"
              style={{
                ...bebasNeue, fontSize: 26,
                color: hovered ? lv.color : "#F0EAD6",
                transition: "color .3s ease",
              }}
            >
              {course.title}
            </h3>
            <div className="text-[8px] font-bold tracking-[.3em] uppercase text-[#F0EAD6]/30" style={syne}>
              {course.sub}
            </div>
          </div>

          {/* Body */}
          <div className="px-6 py-5">
            <p
              className="text-[13px] font-light leading-[1.7] mb-5"
              style={{
                ...dmSans,
                color: hovered ? "rgba(240,234,214,.65)" : "rgba(240,234,214,.45)",
                transition: "color .3s ease",
              }}
            >
              {course.desc}
            </p>

            {/* Meta */}
            <div className="flex gap-4 mb-5">
              {[
                { icon: "⏱", text: course.duration },
                { icon: "📅", text: course.sessions },
              ].map((m) => (
                <div key={m.text} className="flex items-center gap-1.5 text-[11px] font-light text-[#F0EAD6]/35" style={dmSans}>
                  <span className="opacity-70">{m.icon}</span>
                  {m.text}
                </div>
              ))}
            </div>

            {/* Footer row */}
            <div className="flex items-center justify-between pt-4 border-t border-white/[.055]">
              <div>
                <div className="leading-none tracking-[.06em]"
                  style={{ ...bebasNeue, fontSize: "1.4rem", color: lv.color }}>
                  {course.price}
                </div>
                <div className="text-[10px] font-light text-[#F0EAD6]/30 mt-0.5" style={dmSans}>
                  / per person
                </div>
              </div>
              <Link
                to="/training"
                className="text-[9px] font-bold tracking-[.28em] uppercase px-[16px] py-2 border cursor-pointer transition-opacity duration-200 hover:opacity-80"
                style={{
                  ...syne,
                  background: `rgba(${lv.rgb},.1)`,
                  color:       lv.color,
                  border:      `1px solid rgba(${lv.rgb},.3)`,
                }}
                onClick={(e) => e.stopPropagation()}
              >
                Learn More →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MAIN EXPORT ───────────────────────────────────────────────────
export default function TrainingPreview() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel   = "stylesheet";
    link.href  = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  return (
    <section className="relative overflow-hidden px-12 py-[80px] bg-[#050508] border-y border-white/[.055]">

      {/* ── Atmosphere ── */}
      <div className="absolute -top-[100px] -left-[60px] w-[500px] h-[380px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse,rgba(255,107,53,.11) 0%,transparent 70%)" }} />
      <div className="absolute -bottom-[100px] -right-[40px] w-[460px] h-[360px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse,rgba(168,85,247,.1) 0%,transparent 70%)" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[200px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse,rgba(0,245,255,.04) 0%,transparent 70%)" }} />
      {/* Scanlines */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(0,0,0,.06) 3px,rgba(0,0,0,.06) 4px)",
      }} />
      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(255,107,53,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,107,53,.022) 1px,transparent 1px)",
        backgroundSize:  "48px 48px",
      }} />

      <div className="relative z-[2] max-w-[1100px] mx-auto">

        {/* ── Section Header ── */}
        <div className="flex items-end justify-between gap-8 flex-wrap mb-12">
          <div>
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-[7px] bg-[#FF6B35]/[.07] border border-[#FF6B35]/[.22] mb-[22px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse" />
              <span className="text-[9px] font-bold tracking-[.4em] uppercase text-[#FF6B35]" style={syne}>
                Skill Development
              </span>
            </div>

            {/* Title */}
            <div>
              <span className="block leading-[.9] tracking-[-0.01em]"
                style={{
                  ...bebasNeue, fontSize: "clamp(38px,6vw,64px)",
                  WebkitTextStroke: "1px rgba(240,234,214,.4)", color: "transparent",
                }}>
                TRAINING
              </span>
              <span className="block leading-[.9] tracking-[-0.01em] text-[#FF6B35]"
                style={{
                  ...bebasNeue, fontSize: "clamp(38px,6vw,64px)",
                  textShadow: "0 0 40px rgba(255,107,53,.35)",
                }}>
                PROGRAMS
              </span>
              <span className="block mt-1.5 font-bold tracking-[.18em] uppercase text-[#00F5FF]"
                style={{ ...syne, fontSize: "clamp(10px,1.4vw,14px)" }}>
                Embedded · IoT · Robotics · AI
              </span>
            </div>

            {/* Rule */}
            <div className="w-14 h-px mt-5"
              style={{ background: "linear-gradient(90deg,#FF6B35,transparent)" }} />
          </div>

          {/* Stats + CTA */}
          <div className="flex flex-col items-end gap-5">
            {/* Stats row */}
            <div className="flex gap-3">
              {stats.map((s) => (
                <div key={s.label}
                  className="relative px-4 py-3 min-w-[90px] bg-white/[.03] border border-white/[.07] overflow-hidden text-center"
                >
                  <div className="absolute top-0 left-0 right-0 h-[1.5px]" style={{ background: s.color }} />
                  <div className="leading-none" style={{ ...bebasNeue, fontSize: "1.6rem", color: s.color }}>{s.num}</div>
                  <div className="text-[8px] font-bold tracking-[.3em] uppercase text-[#F0EAD6]/30 mt-1" style={syne}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Link
              to="/training"
              className="
                text-[10px] font-bold tracking-[.32em] uppercase text-white
                bg-[#FF6B35] px-7 py-3.5 cursor-pointer
                shadow-[0_0_24px_rgba(255,107,53,.25)]
                hover:bg-[#ff8040] hover:shadow-[0_0_40px_rgba(255,107,53,.5)] hover:-translate-y-px
                transition-all duration-300 inline-block
              "
              style={syne}
            >
              View All Courses →
            </Link>
          </div>
        </div>

        {/* ── Cards Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {previewCourses.map((c) => (
            <PreviewCard key={c.title} course={c} />
          ))}
        </div>

        {/* ── Bottom strip: learning path ── */}
        <div className="border border-white/[.07] bg-white/[.015] overflow-hidden">
          {/* Top line */}
          <div className="h-[1.5px]" style={{ background: "linear-gradient(90deg,#FF6B35,#A855F7,transparent)" }} />

          <div className="px-8 py-5 flex items-center justify-between gap-4 flex-wrap">
            <div className="text-[8px] font-bold tracking-[.38em] uppercase text-[#F0EAD6]/[.28] flex-shrink-0" style={syne}>
              Learning Path
            </div>

            {[
              { tag: "Track 01", title: "Beginner",     color: "#00F5FF", rgb: "0,245,255",   icon: "🌱" },
              { tag: "Track 02", title: "Intermediate",  color: "#FF6B35", rgb: "255,107,53",  icon: "⚡" },
              { tag: "Track 03", title: "Advanced",      color: "#A855F7", rgb: "168,85,247",  icon: "🚀" },
              { tag: "Outcome",  title: "Certified",     color: "#FF006E", rgb: "255,0,110",   icon: "🏆" },
            ].map((step, i, arr) => (
              <Fragment key={step.title}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 flex items-center justify-center text-sm flex-shrink-0"
                    style={{ background: `rgba(${step.rgb},.1)`, border: `1px solid rgba(${step.rgb},.2)` }}>
                    {step.icon}
                  </div>
                  <div>
                    <div className="text-[7px] font-bold tracking-[.35em] uppercase mb-0.5"
                      style={{ ...syne, color: step.color }}>{step.tag}</div>
                    <div className="text-[12px] font-bold text-[#F0EAD6]/80" style={syne}>{step.title}</div>
                  </div>
                </div>
                {i < arr.length - 1 && (
                  <span className="text-[#F0EAD6]/[.15] text-base flex-shrink-0">›</span>
                )}
              </Fragment>
            ))}

            <Link
              to="/training"
              className="text-[9px] font-semibold tracking-[.28em] uppercase text-[#F0EAD6]/40 bg-transparent border border-white/10 px-5 py-2 flex-shrink-0 hover:border-[#00F5FF] hover:text-[#00F5FF] hover:bg-[#00F5FF]/[.04] transition-all duration-300 inline-block"
              style={syne}
            >
              Start Path →
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
