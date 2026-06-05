import { useState, useEffect, useRef, useCallback } from "react";

const syne      = { fontFamily: "'Syne', sans-serif" };
const bebasNeue = { fontFamily: "'Bebas Neue', cursive" };
const barlowCond = { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 300 };
const barlow     = { fontFamily: "'Barlow', sans-serif", fontWeight: 300 };
const dmSans    = { fontFamily: "'DM Sans', sans-serif" };

// ── Cinematic theme palette ──────────────────────────────────────
const C = {
  bg:     "#020203",
  orange: "#FF6230",
  pink:   "#E0357A",
  purple: "#8B31E8",
  cyan:   "#00DFFF",
};

const services = [
  {
    title: "School Workshops",
    description: "Interactive robotics sessions tailored for middle and high school students.",
    detail: "Curriculum-aligned sessions covering basic electronics, sensor programming, and robot assembly. Perfect for science fairs and STEM days.",
    icon: "🏫", accent: "#FF6B35", tag: "01",
  },
  {
    title: "College Programs",
    description: "Advanced campus training for engineering and STEM clubs.",
    detail: "Deep-dive workshops on ESP32, computer vision, and autonomous systems. Ideal for hackathons and technical societies.",
    icon: "🎓", accent: "#A855F7", tag: "02",
  },
  {
    title: "Event Demonstrations",
    description: "Live robotics showcases and STEM fairs for young audiences.",
    detail: "High-energy live demos featuring line followers, maze solvers, and gesture-controlled bots that keep audiences captivated.",
    icon: "⭐", accent: "#00F5FF", tag: "03",
  },
  {
    title: "Custom Learning Paths",
    description: "Build a workshop around Arduino, ESP32, or full robot builds.",
    detail: "Fully bespoke curriculum designed around your institution's timeline, hardware availability, and learning goals.",
    icon: "🛠️", accent: "#FF006E", tag: "04",
  },
];

/* ─── Single card ─────────────────────────────── */
function ServiceCard({ s, i, active, onToggle }) {
  const shellRef  = useRef(null);
  const cardRef   = useRef(null);
  const rafRef    = useRef(null);
  const stateRef  = useRef({
    currentRX: 0, currentRY: 0,
    targetRX:  0, targetRY:  0,
    isHovered: false,
  });

  // Per-card visual state that changes on mouse move (box-shadow, border, glow pos)
  const [glowPos,  setGlowPos]  = useState({ x: 50, y: 50 });
  const [glowOn,   setGlowOn]   = useState(false);
  const [shadow,   setShadow]   = useState("");
  const [border,   setBorder]   = useState("rgba(255,255,255,.07)");
  const [lit,      setLit]      = useState(false);

  const lerp = (a, b, t) => a + (b - a) * t;

  const tick = useCallback(() => {
    const st = stateRef.current;
    st.currentRX = lerp(st.currentRX, st.targetRX, 0.1);
    st.currentRY = lerp(st.currentRY, st.targetRY, 0.1);

    if (cardRef.current) {
      const z = st.isHovered ? 10 : 0;
      cardRef.current.style.transform =
        `rotateX(${st.currentRX}deg) rotateY(${st.currentRY}deg) translateZ(${z}px)`;
    }

    const moving =
      Math.abs(st.currentRX - st.targetRX) > 0.01 ||
      Math.abs(st.currentRY - st.targetRY) > 0.01;

    if (moving || st.isHovered) {
      rafRef.current = requestAnimationFrame(tick);
    }
  }, []);

  const handleMouseMove = useCallback((e) => {
    const rect = shellRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top)  / rect.height;

    stateRef.current.targetRY = (x - 0.5) * 18;
    stateRef.current.targetRX = (0.5 - y) * 14;

    const ox = (x - 0.5) * 2 * 28;
    const oy = (y - 0.5) * 2 * 22;

    setGlowPos({ x: x * 100, y: y * 100 });
    setShadow(`${ox}px ${oy}px 40px ${s.accent}28, 0 0 20px ${s.accent}14`);
    setBorder(`${s.accent}55`);
  }, [s.accent]);

  const handleMouseEnter = useCallback(() => {
    stateRef.current.isHovered = true;
    if (cardRef.current) cardRef.current.style.transition = "none";
    setLit(true);
    setGlowOn(true);
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const handleMouseLeave = useCallback(() => {
    stateRef.current.isHovered = false;
    stateRef.current.targetRX  = 0;
    stateRef.current.targetRY  = 0;

    if (cardRef.current) {
      cardRef.current.style.transition = "transform .7s cubic-bezier(.23,1,.32,1)";
      cardRef.current.style.transform  = "rotateX(0deg) rotateY(0deg) translateZ(0px)";
    }

    setGlowOn(false);
    if (!active) {
      setLit(false);
      setShadow("");
      setBorder("rgba(255,255,255,.07)");
    }

    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);
  }, [active, tick]);

  // Keep lit in sync when active state changes externally
  useEffect(() => {
    if (active) {
      setLit(true);
      setBorder(`${s.accent}66`);
      setShadow(`0 0 48px ${s.accent}25, inset 0 0 32px ${s.accent}08`);
    } else if (!stateRef.current.isHovered) {
      setLit(false);
      setBorder("rgba(255,255,255,.07)");
      setShadow("");
    }
  }, [active, s.accent]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <div
      ref={shellRef}
      style={{ perspective: "900px", cursor: "pointer" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onToggle(i)}
    >
      {/* Card — 3D tilt target */}
      <div
        ref={cardRef}
        style={{ position: "relative", transformStyle: "preserve-3d", willChange: "transform" }}
      >
        {/* Border glow layer — radial follows mouse */}
        <div
          style={{
            position:   "absolute", inset: -1,
            pointerEvents: "none", zIndex: 0,
            background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, ${s.accent}60 0%, ${s.accent}15 30%, transparent 65%)`,
            opacity:    glowOn ? 1 : 0,
            transition: "opacity .3s ease",
          }}
        />

        {/* Card surface */}
        <div
          style={{
            position:       "relative", zIndex: 1,
            background:     lit ? "rgba(255,255,255,.045)" : "rgba(255,255,255,.03)",
            border:         `1px solid ${border}`,
            backdropFilter: "blur(16px)",
            boxShadow:      shadow,
            padding:        "28px",
            overflow:       "hidden",
            transition:     "background .3s ease, border-color .3s ease, box-shadow .3s ease",
          }}
        >
          {/* Top accent bar */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 2,
            background: s.accent,
            transform: lit ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: "left",
            transition: "transform .45s cubic-bezier(.16,1,.3,1)",
          }} />

          {/* Corner TL */}
          <div style={{
            position: "absolute", top: 0, left: 0, width: 18, height: 18,
            borderTop: `1px solid ${s.accent}`, borderLeft: `1px solid ${s.accent}`,
            opacity: lit ? 1 : 0, transition: "opacity .3s ease",
          }} />

          {/* Corner BR */}
          <div style={{
            position: "absolute", bottom: 0, right: 0, width: 18, height: 18,
            borderBottom: `1px solid ${s.accent}40`, borderRight: `1px solid ${s.accent}40`,
            opacity: lit ? 1 : 0, transition: "opacity .3s ease",
          }} />

          {/* Tag */}
          <div className="text-[8px] font-bold tracking-[.35em] uppercase text-[#F0EAD6]/[.2] mb-5" style={syne}>
            {s.tag} / 04
          </div>

          {/* Icon */}
          <div
            className="inline-flex items-center justify-center w-11 h-11 rounded-full text-lg mb-5"
            style={{
              background:  `${s.accent}18`,
              boxShadow:   lit
                ? `0 0 20px ${s.accent}50, 0 0 0 1px ${s.accent}55`
                : `0 0 0 1px ${s.accent}22`,
              transition:  "box-shadow .3s ease",
            }}
          >
            {s.icon}
          </div>

          {/* Title */}
          <h3
            className="text-[15px] font-bold tracking-[.02em] mb-2.5 leading-[1.3]"
            style={{ ...syne, color: lit ? s.accent : "#F0EAD6", transition: "color .3s ease" }}
          >
            {s.title}
          </h3>

          {/* Description */}
          <p
            className="text-[12.5px] font-light leading-[1.75]"
            style={{
              ...dmSans,
              color:      lit ? "rgba(240,234,214,.65)" : "rgba(240,234,214,.45)",
              transition: "color .3s ease",
            }}
          >
            {s.description}
          </p>

          {/* Expandable detail */}
          <div style={{
            maxHeight:  active ? "120px" : "0",
            opacity:    active ? 1 : 0,
            overflow:   "hidden",
            transition: "max-height .4s cubic-bezier(.16,1,.3,1), opacity .3s ease",
          }}>
            <div className="h-px bg-white/[.07] my-3.5" />
            <p className="text-[12px] font-light leading-[1.7] text-[#F0EAD6]/50" style={dmSans}>
              {s.detail}
            </p>
          </div>

          {/* Hover arrow */}
          <div
            className="absolute bottom-6 right-6 text-[11px] font-bold tracking-[.15em]"
            style={{
              ...syne, color: s.accent,
              opacity:   lit && !active ? 1 : 0,
              transform: lit && !active ? "translateX(0)" : "translateX(-6px)",
              transition: "opacity .3s ease, transform .3s ease",
            }}
          >
            Explore →
          </div>

        </div>
      </div>
    </div>
  );
}

/* ─── Section ─────────────────────────────────── */
export default function ServiceHighlights() {
  const [active, setActive] = useState(null);

  useEffect(() => {
    const link  = document.createElement("link");
    link.rel    = "stylesheet";
    link.href   = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const handleToggle = (i) => setActive((prev) => (prev === i ? null : i));

  return (
    <section className="relative overflow-hidden px-10 py-[72px] bg-[#050508]">

      {/* Atmosphere */}
      <div className="absolute -top-[100px] -left-[80px] w-[500px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse,rgba(255,107,53,.09) 0%,transparent 70%)" }} />
      <div className="absolute -bottom-[100px] -right-[60px] w-[450px] h-[350px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse,rgba(168,85,247,.08) 0%,transparent 70%)" }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: "linear-gradient(rgba(255,107,53,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,107,53,.02) 1px,transparent 1px)",
        backgroundSize: "48px 48px",
      }} />

      <div className="relative z-[2] max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-12 max-w-2xl">
          {/* Label badge — mirrors cc-label from AnimatedTextCard */}
          <div className="inline-flex items-center gap-2 px-3.5 py-[7px] mb-6"
            style={{
              background: `rgba(${parseInt(C.orange.slice(1,3),16)},${parseInt(C.orange.slice(3,5),16)},${parseInt(C.orange.slice(5,7),16)},.07)`,
              border: `1px solid rgba(${parseInt(C.orange.slice(1,3),16)},${parseInt(C.orange.slice(3,5),16)},${parseInt(C.orange.slice(5,7),16)},.25)`,
            }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: C.orange }} />
            <span style={{
              ...barlowCond,
              fontWeight: 400,
              fontSize: "9px",
              letterSpacing: ".42em",
              textTransform: "uppercase",
              color: C.orange,
            }}>
              What We Do
            </span>
          </div>

          {/* Title — ghost outline top line + gradient fill bottom */}
          <div className="mb-5">
            <span className="block leading-[.88]"
              style={{
                ...bebasNeue,
                fontSize: "clamp(42px,7vw,76px)",
                letterSpacing: ".025em",
                color: "transparent",
                WebkitTextStroke: "1px rgba(255,255,255,.32)",
              }}>
              WORKSHOPS &amp;
            </span>
            <span className="block leading-[.88]"
              style={{
                ...bebasNeue,
                fontSize: "clamp(42px,7vw,76px)",
                letterSpacing: ".025em",
                background: `linear-gradient(90deg,${C.orange},${C.pink})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 28px rgba(255,98,48,.28))",
              }}>
              PROGRAMS
            </span>
          </div>

          {/* Cyan sub-label — mirrors cc-sub from AnimatedTextCard */}
            <span
              className="block mt-2"
              style={{
                ...barlowCond,
                fontWeight:    400,
                fontSize:      "clamp(13px,1.7vw,17px)",
                letterSpacing: ".2em",
                textTransform: "uppercase",
                color:         C.cyan,
              }}
            >
              Robotics &amp; Innovation
            </span>

          {/* Gradient rule — identical to card-rule in AnimatedTextCard */}
          <div className="w-14 mb-6"
            style={{
              height: "1.5px",
              background: `linear-gradient(to right,${C.orange},${C.pink},transparent)`,
            }} />

          {/* Body copy — Barlow light, white/45 */}
          <p className="leading-[1.85] max-w-[420px] mb-5"
            style={{
              ...barlow,
              fontSize: "clamp(13px,1.3vw,15px)",
              color: "rgba(255,255,255,.45)",
              letterSpacing: ".02em",
            }}>
            We help institutions book the right program, register students for events,
            and promote summer camps with high-energy hands-on sessions.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((s, i) => (
            <ServiceCard
              key={s.title}
              s={s} i={i}
              active={active === i}
              onToggle={handleToggle}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
