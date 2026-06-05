import { useEffect } from "react";

const bebasNeue = { fontFamily: "'Bebas Neue', sans-serif" };
const syne      = { fontFamily: "'Syne', sans-serif" };
const dmSans    = { fontFamily: "'DM Sans', sans-serif" };

const infoCards = [
  { label: "Workshops", value: "Arduino · ESP32 · Robotics" },
  { label: "Formats",   value: "Summer camp · In-school · Hybrid" },
];

export default function Book() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel  = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const inputClass = {
    display: "block",
    width: "100%",
    marginTop: "8px",
    background: "rgba(255,255,255,.03)",
    border: "1px solid rgba(255,255,255,.1)",
    padding: "12px 16px",
    color: "#F0EAD6",
    outline: "none",
    ...dmSans,
    fontSize: "13px",
    letterSpacing: "0.02em",
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = "#FF6B35";
    e.target.style.boxShadow   = "0 0 0 2px rgba(255,107,53,.15)";
  };
  const handleBlur = (e) => {
    e.target.style.borderColor = "rgba(255,255,255,.1)";
    e.target.style.boxShadow   = "none";
  };

  return (
    <main
      className="relative min-h-screen overflow-hidden text-white"
      style={{ background: "#050508" }}
    >

      {/* ── Atmosphere ── */}
      <div
        className="absolute -top-[120px] -right-[80px] w-[560px] h-[440px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse,rgba(255,107,53,.13) 0%,transparent 70%)" }}
      />
      <div
        className="absolute -bottom-[140px] -left-[60px] w-[500px] h-[400px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse,rgba(168,85,247,.11) 0%,transparent 70%)" }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[200px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse,rgba(0,245,255,.04) 0%,transparent 70%)" }}
      />

      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(0,0,0,.06) 3px,rgba(0,0,0,.06) 4px)",
        }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,107,53,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,107,53,.025) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
        style={{ background: "linear-gradient(to top,#050508,transparent)" }}
      />

      {/* ── Content ── */}
      <section className="relative z-[2] px-8 pt-28 pb-28 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">

            {/* ── LEFT ── */}
            <div>

              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-[7px] bg-[#FF6B35]/[.07] border border-[#FF6B35]/[.22] mb-[22px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse" />
                <span
                  className="text-[9px] font-bold tracking-[.38em] uppercase text-[#FF6B35]"
                  style={syne}
                >
                  Book a Workshop
                </span>
              </div>

              {/* Title */}
              <div className="mb-[18px]">
                <span
                  className="block leading-[.9] tracking-[-0.01em]"
                  style={{
                    ...bebasNeue,
                    fontSize: "clamp(38px,6vw,68px)",
                    WebkitTextStroke: "1px rgba(240,234,214,.4)",
                    color: "transparent",
                  }}
                >
                  DESIGN YOUR NEXT
                </span>
                <span
                  className="block leading-[.9] tracking-[-0.01em] text-[#FF6B35]"
                  style={{
                    ...bebasNeue,
                    fontSize: "clamp(38px,6vw,68px)",
                    textShadow: "0 0 40px rgba(255,107,53,.35)",
                  }}
                >
                  ROBOTICS WORKSHOP
                </span>
                <span
                  className="block mt-1.5 font-bold tracking-[.18em] uppercase text-[#00F5FF]"
                  style={{ ...syne, fontSize: "clamp(11px,1.6vw,16px)" }}
                >
                  Summer Camp · Campus Event · In-School
                </span>
              </div>

              {/* Rule */}
              <div
                className="w-14 h-px my-5"
                style={{ background: "linear-gradient(90deg,#FF6B35,transparent)" }}
              />

              {/* Body */}
              <p
                className="font-light leading-[1.8] text-[#F0EAD6]/50 max-w-[420px] mb-8 tracking-[.02em]"
                style={{ ...dmSans, fontSize: "clamp(13px,1.3vw,15px)" }}
              >
                Share your student group, location and learning goals, and we'll
                build a program that fits your school, college or STEM event.
              </p>

              {/* Info cards */}
              <div className="grid gap-4 sm:grid-cols-2">
                {infoCards.map((card) => (
                  <div
                    key={card.label}
                    className="relative bg-white/[.03] border border-white/[.07] p-5"
                  >
                    {/* corner brackets */}
                    <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-[#FF6B35] pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-purple-500/50 pointer-events-none" />

                    <p
                      className="text-[8px] font-bold tracking-[.35em] uppercase text-[#F0EAD6]/[.28] mb-2"
                      style={syne}
                    >
                      {card.label}
                    </p>
                    <p
                      className="text-[13px] font-medium tracking-[.04em] text-[#F0EAD6]/70"
                      style={dmSans}
                    >
                      {card.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── RIGHT — FORM CARD ── */}
            <div className="relative bg-white/[.03] border border-white/[.07] backdrop-blur-xl p-8">

              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-7 h-7 border-t border-l border-[#FF6B35] pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-7 h-7 border-b border-r border-purple-500/50 pointer-events-none" />

              {/* Form header */}
              <div className="mb-7">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FF6B35]/[.07] border border-[#FF6B35]/[.2] mb-5">
                  <span
                    className="text-[8px] font-bold tracking-[.38em] uppercase text-[#FF6B35]"
                    style={syne}
                  >
                    Request Details
                  </span>
                </div>
                <h2
                  className="text-[#F0EAD6]/90 font-bold tracking-[-0.01em]"
                  style={{ ...syne, fontSize: "clamp(18px,2vw,22px)" }}
                >
                  Start your booking request
                </h2>
              </div>

              {/* Form */}
              <div className="grid gap-5">

                {/* Name */}
                <label>
                  <span
                    className="block text-[9px] font-bold tracking-[.35em] uppercase text-[#F0EAD6]/[.28] mb-1"
                    style={syne}
                  >
                    Your Name
                  </span>
                  <input
                    style={inputClass}
                    placeholder="Ayesha"
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </label>

                {/* Email */}
                <label>
                  <span
                    className="block text-[9px] font-bold tracking-[.35em] uppercase text-[#F0EAD6]/[.28] mb-1"
                    style={syne}
                  >
                    Email Address
                  </span>
                  <input
                    type="email"
                    style={inputClass}
                    placeholder="hello@example.com"
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </label>

                {/* Organization */}
                <label>
                  <span
                    className="block text-[9px] font-bold tracking-[.35em] uppercase text-[#F0EAD6]/[.28] mb-1"
                    style={syne}
                  >
                    Organization
                  </span>
                  <input
                    style={inputClass}
                    placeholder="School / College"
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </label>

                {/* Program */}
                <label>
                  <span
                    className="block text-[9px] font-bold tracking-[.35em] uppercase text-[#F0EAD6]/[.28] mb-1"
                    style={syne}
                  >
                    Preferred Program
                  </span>
                  <select
                    style={{ ...inputClass, cursor: "pointer" }}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  >
                    <option style={{ background: "#0d0d10" }}>Arduino Workshop</option>
                    <option style={{ background: "#0d0d10" }}>ESP32 Bootcamp</option>
                    <option style={{ background: "#0d0d10" }}>Robotics Showcase</option>
                    <option style={{ background: "#0d0d10" }}>Custom Program</option>
                  </select>
                </label>

                {/* Message */}
                <label>
                  <span
                    className="block text-[9px] font-bold tracking-[.35em] uppercase text-[#F0EAD6]/[.28] mb-1"
                    style={syne}
                  >
                    Message / Event Details
                  </span>
                  <textarea
                    rows={5}
                    style={{ ...inputClass, resize: "none" }}
                    placeholder="Tell us the grade, dates, expected number of students, and location."
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </label>

                {/* Submit */}
                <button
                  type="submit"
                  className="
                    w-full text-[10px] font-bold tracking-[.32em] uppercase text-white
                    bg-[#FF6B35] border-none px-6 py-4 cursor-pointer
                    shadow-[0_0_24px_rgba(255,107,53,.25)]
                    hover:bg-[#ff8040] hover:shadow-[0_0_40px_rgba(255,107,53,.5)] hover:-translate-y-px
                    transition-all duration-300
                  "
                  style={syne}
                >
                  Submit Request
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
