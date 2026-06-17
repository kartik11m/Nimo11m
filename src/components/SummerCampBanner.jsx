import { useEffect, useState } from "react";
import EditableText from './EditableText';
import { useOwnerAuth } from '../context/OwnerAuthContext';

// ── Cinematic theme fonts (matching Beyond The Horizon) ──────────
const bebasNeue  = { fontFamily: "'Bebas Neue', cursive" };
const barlowCond = { fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 300 };
const barlow     = { fontFamily: "'Barlow', sans-serif", fontWeight: 300 };

// ── Cinematic theme palette ──────────────────────────────────────
const C = {
  bg:     "#020203",
  orange: "#FF6230",
  pink:   "#E0357A",
  purple: "#8B31E8",
  cyan:   "#00DFFF",
};

// ── Default camp date (fallback) ──────────────────────────────────
const DEFAULT_CAMP_DATE = "2025-06-02T09:00:00";

const rows = [
  { icon: "📅", label: "Date",      value: "June 2 – 6, 2025"        },
  { icon: "📍", label: "Location",  value: "Nimo Labs HQ, Bhopal"     },
  { icon: "👥", label: "Age Group", value: "10 – 18 Years"            },
  { icon: "🤖", label: "Focus",     value: "Arduino · Sensors · Build"},
];

const features = [
  { icon: "⚡", text: "Build 3 fully working robots from scratch"  },
  { icon: "🧠", text: "Learn Arduino programming & C++ basics"     },
  { icon: "🏆", text: "Compete & present at the final showcase"    },
];

const techBadges = [
  { label: "Arduino UNO",        color: C.orange },
  { label: "Servo Motors",       color: C.pink   },
  { label: "Ultrasonic Sensors", color: C.purple },
  { label: "C++ Coding",         color: C.cyan   },
  { label: "3D Printing",        color: C.orange },
  { label: "Line Following",     color: C.pink   },
];

// ── Countdown hook (accepts date string to avoid dependency issues) ────────
function useCountdown(dateString) {
  const calc = () => {
    const targetDate = new Date(dateString);
    const diff = targetDate - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, mins: 0, secs: 0 };
    return {
      days:  Math.floor(diff / 86_400_000),
      hours: Math.floor((diff % 86_400_000) / 3_600_000),
      mins:  Math.floor((diff % 3_600_000)  / 60_000),
      secs:  Math.floor((diff % 60_000)     / 1_000),
    };
  };
  const [t, setT] = useState(calc);
  useEffect(() => {
    setT(calc());
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, [dateString]);
  return t;
}

// ── Countdown digit cell ──────────────────────────────────────────
function CountdownUnit({ value, label }) {
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="relative w-[54px] h-[54px] flex items-center justify-center"
        style={{
          background: "rgba(255,255,255,.03)",
          border:     "1px solid rgba(255,255,255,.09)",
          boxShadow:  "inset 0 0 14px rgba(255,98,48,.05)",
        }}
      >
        {/* Bottom rule — mirrors card-rule gradient */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height:     "1.5px",
            background: `linear-gradient(90deg,transparent,${C.orange},transparent)`,
          }}
        />
        <span
          className="text-[28px] leading-none text-white/90 tabular-nums"
          style={bebasNeue}
        >
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span
        style={{
          ...barlowCond,
          fontWeight:    400,
          fontSize:      "7px",
          letterSpacing: ".42em",
          textTransform: "uppercase",
          color:         "rgba(255,255,255,.28)",
        }}
      >
        {label}
      </span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────
export default function SummerCampBanner() {
  const { isOwner, updateContent } = useOwnerAuth();
  const [campDateString, setCampDateString] = useState(DEFAULT_CAMP_DATE);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [tempDateInput, setTempDateInput] = useState(DEFAULT_CAMP_DATE);
  
  const { days, hours, mins, secs } = useCountdown(campDateString);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Fetch countdown date from database on mount
  useEffect(() => {
    const fetchCountdownDate = async () => {
      try {
        const res = await fetch(`${API_URL}/content`);
        const data = await res.json();
        if (data.success) {
          const found = data.content.find(c => c.key === 'summer-camp.countdown-date');
          if (found && found.content && found.content.length >= 16) {
            setCampDateString(found.content);
            setTempDateInput(found.content.slice(0, 16));
          }
        }
      } catch (error) {
        console.error('Error fetching countdown date:', error);
      }
    };
    fetchCountdownDate();
  }, []);

  const handleSaveCountdownDate = async () => {
    // Format the date string properly: YYYY-MM-DDTHH:MM:SS
    let dateToSave = tempDateInput;
    
    // If input is from datetime-local (format: YYYY-MM-DDTHH:MM), add seconds
    if (tempDateInput && tempDateInput.length === 16) {
      dateToSave = tempDateInput + ':00';
    }

    // Validate date format
    const testDate = new Date(dateToSave);
    if (isNaN(testDate)) {
      alert('Invalid date format. Please use the date picker.');
      return;
    }

    try {
      await updateContent('summer-camp.countdown-date', dateToSave);
      setCampDateString(dateToSave);
      setIsEditingDate(false);
    } catch (error) {
      alert('Error saving countdown date: ' + error.message);
    }
  };

  useEffect(() => {
    const link = document.createElement("link");
    link.rel   = "stylesheet";
    link.href  =
      "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@300;400&family=Barlow:wght@300;400&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  return (
    <div
      className="relative overflow-hidden px-12 py-[72px]"
      style={{
        background:   C.bg,
        borderTop:    "1px solid rgba(255,255,255,.055)",
        borderBottom: "1px solid rgba(255,255,255,.055)",
      }}
    >

      {/* ══ Atmosphere — mirrors Hero / Outro section glows ═══════ */}

      {/* Orange — top-left */}
      <div
        className="absolute -top-[140px] -left-[100px] w-[600px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse,rgba(255,98,48,.15) 0%,transparent 70%)" }}
      />
      {/* Purple — bottom-right */}
      <div
        className="absolute -bottom-[160px] -right-[80px] w-[520px] h-[440px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse,rgba(139,49,232,.13) 0%,transparent 70%)" }}
      />
      {/* Pink — centre */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[200px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse,rgba(224,53,122,.05) 0%,transparent 70%)" }}
      />

      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(0,0,0,.065) 3px,rgba(0,0,0,.065) 4px)",
        }}
      />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,98,48,.022) 1px,transparent 1px)," +
            "linear-gradient(90deg,rgba(255,98,48,.022) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Film grain — same as the cinematic site's body::after */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.025,
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23g)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ══ Content ══════════════════════════════════════════════ */}
      <div className="relative z-[2] max-w-5xl mx-auto flex items-start justify-between gap-14 flex-wrap">

        {/* ════ LEFT ════ */}
        <div className="flex-1 min-w-[300px]">

          {/* Ghost session number — echoes cc-num from AnimatedTextCard */}
          <span
            aria-hidden="true"
            className="block leading-none select-none"
            style={{
              ...bebasNeue,
              fontSize:        "clamp(5rem,9vw,8rem)",
              color:           "transparent",
              WebkitTextStroke: "1px rgba(255,255,255,.05)",
              letterSpacing:   "-0.01em",
              marginBottom:    "-1.2rem",
            }}
          >
            05
          </span>

          {/* Eyebrow tag — mirrors cc-label border pill */}
          <div
            className="inline-flex items-center gap-2 px-3.5 py-[7px] mb-5"
            style={{
              background: "rgba(255,98,48,.07)",
              border:     "1px solid rgba(255,98,48,.25)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: C.orange }}
            />
            <span
              style={{
                ...barlowCond,
                fontWeight:    400,
                fontSize:      "9px",
                letterSpacing: ".42em",
                textTransform: "uppercase",
                color:         C.orange,
              }}
            >
              <EditableText contentId="summer-camp.eyebrow" textColor={C.orange}>
                Now Enrolling · Summer 2025
              </EditableText>
            </span>
          </div>

          {/* Title — ghost outline top line + gradient fill bottom, same as hero */}
          <div className="mb-5">
            <span
              className="block leading-[.88]"
              style={{
                ...bebasNeue,
                fontSize:        "clamp(42px,7vw,76px)",
                letterSpacing:   ".025em",
                color:           "transparent",
                WebkitTextStroke: "1px rgba(255,255,255,.32)",
              }}
            >
              <EditableText contentId="summer-camp.title-line1" textColor="rgba(255,255,255,.32)">
                NIMO LABS
              </EditableText>
            </span>
            <div
              style={{
                ...bebasNeue,
                fontSize:             "clamp(42px,7vw,76px)",
                letterSpacing:        ".025em",
                filter:               "drop-shadow(0 0 28px rgba(255,98,48,.28))",
              }}
            >
              <EditableText 
                contentId="summer-camp.title-line2" 
                textColor={C.orange}
                className="block leading-[.88]"
                hasGradient={true}
              >
                SUMMER CAMP
              </EditableText>
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
              <EditableText contentId="summer-camp.subtitle" textColor={C.cyan}>
                Robotics &amp; Innovation
              </EditableText>
            </span>
          </div>

          {/* Gradient rule — identical to card-rule in AnimatedTextCard */}
          <div
            className="w-14 mb-6"
            style={{
              height:     "1.5px",
              background: `linear-gradient(to right,${C.orange},${C.pink},transparent)`,
            }}
          />

          {/* Body copy — Barlow light, white/45, matches cc-body */}
          <p
            className="leading-[1.85] max-w-[420px] mb-5"
            style={{
              ...barlow,
              fontSize:      "clamp(13px,1.3vw,15px)",
              color:         "rgba(255,255,255,.45)",
              letterSpacing: ".02em",
            }}
          >
            <EditableText contentId="summer-camp.description" textColor="rgba(255,255,255,.45)">
              An immersive 5-day robotics bootcamp where students aged 10–18
              design, build, and program their own robots from scratch. No prior
              experience needed — just curiosity and ambition.
            </EditableText>
          </p>

          {/* Feature bullets */}
          <div className="flex flex-col gap-2.5 mb-6">
            {features.map((f, idx) => (
              <div key={f.text} className="flex items-center gap-3">
                <span
                  className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-[11px]"
                  style={{
                    background: "rgba(255,98,48,.08)",
                    border:     "1px solid rgba(255,98,48,.22)",
                  }}
                >
                  {f.icon}
                </span>
                <span
                  style={{
                    ...barlow,
                    fontSize:      "12.5px",
                    color:         "rgba(255,255,255,.55)",
                    letterSpacing: ".03em",
                  }}
                >
                  <EditableText contentId={`summer-camp.feature${idx}`} textColor="rgba(255,255,255,.55)">
                    {f.text}
                  </EditableText>
                </span>
              </div>
            ))}
          </div>

          {/* Tech stack badges */}
          <div className="flex flex-wrap gap-2 mb-8">
            {techBadges.map((b, idx) => (
              <span
                key={b.label}
                style={{
                  ...barlowCond,
                  fontWeight:    400,
                  fontSize:      "8.5px",
                  letterSpacing: ".3em",
                  textTransform: "uppercase",
                  color:         b.color,
                  border:        `1px solid ${b.color}38`,
                  background:    `${b.color}0c`,
                  padding:       "5px 10px",
                }}
              >
                <EditableText contentId={`summer-camp.tech${idx}`} textColor={b.color}>
                  {b.label}
                </EditableText>
              </span>
            ))}
          </div>

          {/* CTAs — primary mirrors ou-btn fill, secondary mirrors ghost border */}
          <div className="flex gap-3 flex-wrap items-center">
            <button
              className="cursor-pointer transition-all duration-300 hover:-translate-y-px"
              style={{
                ...barlowCond,
                fontWeight:    400,
                fontSize:      "10px",
                letterSpacing: ".42em",
                textTransform: "uppercase",
                color:         "#fff",
                background:    C.orange,
                border:        "none",
                padding:       "14px 28px",
                boxShadow:     "0 0 24px rgba(255,98,48,.28)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#ff7a4a";
                e.currentTarget.style.boxShadow  = "0 0 44px rgba(255,98,48,.55)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = C.orange;
                e.currentTarget.style.boxShadow  = "0 0 24px rgba(255,98,48,.28)";
              }}
            >
              <EditableText contentId="summer-camp.button-primary" textColor="#fff">
                Register Now →
              </EditableText>
            </button>

            <button
              className="cursor-pointer transition-all duration-300"
              style={{
                ...barlowCond,
                fontWeight:    400,
                fontSize:      "10px",
                letterSpacing: ".42em",
                textTransform: "uppercase",
                color:         "rgba(255,255,255,.45)",
                background:    "rgba(255,255,255,.03)",
                border:        "1px solid rgba(255,255,255,.12)",
                padding:       "14px 28px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = C.cyan;
                e.currentTarget.style.color       = C.cyan;
                e.currentTarget.style.background  = "rgba(0,223,255,.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,.12)";
                e.currentTarget.style.color       = "rgba(255,255,255,.45)";
                e.currentTarget.style.background  = "rgba(255,255,255,.03)";
              }}
            >
              <EditableText contentId="summer-camp.button-secondary" textColor="rgba(255,255,255,.45)">
                Learn More
              </EditableText>
            </button>
          </div>
        </div>

        {/* ════ RIGHT ════ */}
        <div className="flex flex-col gap-4 flex-shrink-0 min-w-[260px] max-w-[290px] w-full">

          {/* ── Countdown card ── */}
          <div
            className="relative p-5"
            style={{
              background:     "rgba(255,255,255,.03)",
              border:         "1px solid rgba(255,255,255,.08)",
              backdropFilter: "blur(16px)",
            }}
          >
            {/* Top gradient accent line */}
            <div
              className="absolute top-0 left-0 right-0"
              style={{
                height:     "1.5px",
                background: `linear-gradient(90deg,${C.orange},${C.pink},transparent)`,
              }}
            />
            {/* TL corner bracket */}
            <div
              className="absolute top-0 left-0 w-5 h-5"
              style={{ borderTop: `1px solid ${C.orange}`, borderLeft: `1px solid ${C.orange}` }}
            />
            {/* TR corner bracket */}
            <div
              className="absolute top-0 right-0 w-5 h-5"
              style={{ borderTop: "1px solid rgba(255,98,48,.22)", borderRight: "1px solid rgba(255,98,48,.22)" }}
            />

            {/* Label */}
            <div
              className="flex items-center gap-1.5 mb-4"
              style={{
                ...barlowCond,
                fontWeight:    400,
                fontSize:      "8px",
                letterSpacing: ".42em",
                textTransform: "uppercase",
                color:         "rgba(255,255,255,.28)",
              }}
            >
              <span
                className="w-1 h-1 rounded-full animate-pulse"
                style={{ background: C.orange }}
              />
              <EditableText contentId="summer-camp.countdown-label" textColor="rgba(255,255,255,.28)">
                Camp Starts In
              </EditableText>
            </div>

            <div className="flex items-end gap-2.5">
              <CountdownUnit value={days}  label="Days" />
              <CountdownUnit value={hours} label="Hrs"  />
              <CountdownUnit value={mins}  label="Min"  />
              <CountdownUnit value={secs}  label="Sec"  />
            </div>

            {/* Edit countdown date button for owner */}
            {isOwner && (
              <div className="mt-4 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,.06)" }}>
                {isEditingDate ? (
                  <div className="flex flex-col gap-2">
                    <label style={{ fontSize: "10px", color: "rgba(255,255,255,.5)" }}>
                      Change countdown date:
                    </label>
                    <input
                      type="datetime-local"
                      value={tempDateInput && tempDateInput.length >= 16 ? tempDateInput.slice(0, 16) : ''}
                      onChange={(e) => setTempDateInput(e.target.value)}
                      style={{
                        padding: "8px",
                        borderRadius: "4px",
                        border: `1px solid ${C.orange}`,
                        backgroundColor: "rgba(0,0,0,.5)",
                        color: "#fff",
                        fontFamily: "'Barlow', sans-serif",
                        fontSize: "12px",
                      }}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveCountdownDate}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: C.orange,
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: "bold",
                          cursor: "pointer",
                        }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingDate(false);
                          if (campDateString && campDateString.length >= 16) {
                            setTempDateInput(campDateString.slice(0, 16));
                          }
                        }}
                        style={{
                          padding: "6px 12px",
                          backgroundColor: "rgba(255,255,255,.1)",
                          color: "#fff",
                          border: "1px solid rgba(255,255,255,.2)",
                          borderRadius: "4px",
                          fontSize: "11px",
                          cursor: "pointer",
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsEditingDate(true);
                      // Ensure tempDateInput is properly formatted
                      if (campDateString && campDateString.length >= 16) {
                        setTempDateInput(campDateString.slice(0, 16));
                      }
                    }}
                    style={{
                      width: "100%",
                      padding: "8px",
                      backgroundColor: "rgba(255,98,48,.1)",
                      color: C.orange,
                      border: `1px solid ${C.orange}40`,
                      borderRadius: "4px",
                      fontSize: "11px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    ✏️ Edit Countdown Date
                  </button>
                )}
              </div>
            )}
          </div>

          {/* ── Info card — corner bracket style matches AnimatedTextCard */}
          <div
            className="relative p-6"
            style={{
              background:     "rgba(255,255,255,.03)",
              border:         "1px solid rgba(255,255,255,.07)",
              backdropFilter: "blur(16px)",
            }}
          >
            {/* TL bracket — orange */}
            <div
              className="absolute top-0 left-0 w-5 h-5"
              style={{ borderTop: `1px solid ${C.orange}`, borderLeft: `1px solid ${C.orange}` }}
            />
            {/* BR bracket — purple */}
            <div
              className="absolute bottom-0 right-0 w-5 h-5"
              style={{
                borderBottom: "1px solid rgba(139,49,232,.45)",
                borderRight:  "1px solid rgba(139,49,232,.45)",
              }}
            />

            {/* Info rows */}
            {rows.map((row, idx) => (
              <div key={row.label} className="flex items-start gap-3 mb-4 last:mb-0">
                <span className="text-[14px] mt-0.5 opacity-70">{row.icon}</span>
                <div>
                  <div
                    style={{
                      ...barlowCond,
                      fontWeight:    400,
                      fontSize:      "7.5px",
                      letterSpacing: ".42em",
                      textTransform: "uppercase",
                      color:         "rgba(255,255,255,.28)",
                      marginBottom:  "3px",
                    }}
                  >
                    <EditableText contentId={`summer-camp.info${idx}.label`} textColor="rgba(255,255,255,.28)">
                      {row.label}
                    </EditableText>
                  </div>
                  <div
                    style={{
                      ...barlow,
                      fontSize:      "13px",
                      letterSpacing: ".04em",
                      color:         "rgba(255,255,255,.78)",
                    }}
                  >
                    <EditableText contentId={`summer-camp.info${idx}.value`} textColor="rgba(255,255,255,.78)">
                      {row.value}
                    </EditableText>
                  </div>
                </div>
              </div>
            ))}

            {/* Seats bar */}
            <div
              className="mt-5 pt-4"
              style={{ borderTop: "1px solid rgba(255,255,255,.06)" }}
            >
              <div className="flex items-center justify-between mb-2.5">
                <div
                  className="flex items-center gap-1.5"
                  style={{
                    ...barlowCond,
                    fontWeight:    400,
                    fontSize:      "7.5px",
                    letterSpacing: ".4em",
                    textTransform: "uppercase",
                    color:         "rgba(255,255,255,.28)",
                  }}
                >
                  <span
                    className="w-1 h-1 rounded-full animate-pulse"
                    style={{ background: C.orange }}
                  />
                  <EditableText contentId="summer-camp.seats-label" textColor="rgba(255,255,255,.28)">
                    Seats Filling
                  </EditableText>
                </div>
                <span
                  style={{
                    ...barlowCond,
                    fontWeight:    400,
                    fontSize:      "11px",
                    letterSpacing: ".04em",
                    color:         C.orange,
                  }}
                >
                  <EditableText contentId="summer-camp.seats-count" textColor={C.orange}>
                    28 / 40
                  </EditableText>
                </span>
              </div>

              {/* Progress — orange → pink gradient matches card-rule */}
              <div
                className="overflow-hidden mb-2"
                style={{ height: "1.5px", background: "rgba(255,255,255,.07)" }}
              >
                <div
                  style={{
                    height:     "100%",
                    width:      "70%",
                    background: `linear-gradient(90deg,${C.orange},${C.pink})`,
                    boxShadow:  "0 0 8px rgba(255,98,48,.5)",
                  }}
                />
              </div>

              <div
                style={{
                  ...barlow,
                  fontSize:      "10.5px",
                  letterSpacing: ".03em",
                  color:         "rgba(255,255,255,.28)",
                }}
              >
                <EditableText contentId="summer-camp.seats-message" textColor="rgba(255,255,255,.28)">
                  Only 12 spots remaining out of 40
                </EditableText>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
