// HallOfMakers.jsx
// Requires: Tailwind CSS v3+, gsap + @gsap/react (or just gsap)
// Fonts: Add to your index.html or _document.jsx:
//   <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap" rel="stylesheet" />
// GSAP: npm install gsap

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─── CSS-in-JS for things Tailwind can't do (keyframes, custom selectors) ─── */
const globalStyles = `
  :root {
    --o: #FF6B35; --p: #A855F7; --c: #00F5FF; --pk: #FF006E; --cr: #F0EAD6;
  }
  .font-bebas { font-family: 'Bebas Neue', sans-serif; }
  .font-syne  { font-family: 'Syne', sans-serif; }
  .font-dm    { font-family: 'DM Sans', sans-serif; }

  @keyframes pd   { 0%,100%{box-shadow:0 0 0 0 rgba(255,107,53,.6)} 50%{box-shadow:0 0 0 5px rgba(255,107,53,0)} }
  @keyframes filmR{ from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes filmL{ from{transform:translateX(-50%)} to{transform:translateX(0)} }
  @keyframes spinR{ from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

  .anim-pd    { animation: pd 2s ease infinite; }
  .anim-filmR { animation: filmR 40s linear infinite; }
  .anim-filmL { animation: filmL 40s linear infinite; }
  .anim-spinR { animation: spinR 10s linear infinite; }

  .film-row-outer::-webkit-scrollbar { display: none; }
  .robot-rail::-webkit-scrollbar { height: 3px; }
  .robot-rail::-webkit-scrollbar-track { background: rgba(255,255,255,.04); }
  .robot-rail::-webkit-scrollbar-thumb { background: #FF6B35; border-radius: 2px; }

  .ac-bar { transform: scaleX(0); transform-origin: left; transition: transform .45s cubic-bezier(.16,1,.3,1); }
  .ac:hover .ac-bar { transform: scaleX(1); }
  .ac-tl, .ac-br { opacity: 0; transition: opacity .3s; }
  .ac:hover .ac-tl, .ac:hover .ac-br { opacity: 1; }

  .scard-av::after {
    content: ''; position: absolute; inset: -3px; border-radius: 50%;
    border: 1px solid currentColor; opacity: .25;
    animation: spinR 10s linear infinite;
  }

  .gbg {
    position: absolute; inset: 0; pointer-events: none;
    background-image: linear-gradient(rgba(255,107,53,.02) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,107,53,.02) 1px, transparent 1px);
    background-size: 48px 48px;
  }
  .scanl {
    position: absolute; inset: 0; pointer-events: none;
    background: repeating-linear-gradient(to bottom, transparent 0, transparent 3px, rgba(0,0,0,.05) 3px, rgba(0,0,0,.05) 4px);
  }
  .pbg::after {
    content: ''; position: absolute; inset: 0;
    background-image: linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px);
    background-size: 18px 18px; opacity: .4;
  }
  .rcard-viz::after {
    content: ''; position: absolute; inset: 0;
    background-image: linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px);
    background-size: 14px 14px;
  }
  .ski-fill { width: 0; transition: width 1.6s cubic-bezier(.16,1,.3,1); }
`;

/* ─── DATA ─────────────────────────────────────────────────────────────────── */
const TM = {
  competition:   { label: "Competition Win",     color: "#FF6B35", rgb: "255,107,53",  icon: "🏆" },
  certification: { label: "Certification",       color: "#00F5FF", rgb: "0,245,255",   icon: "🎓" },
  project:       { label: "Project Showcase",    color: "#A855F7", rgb: "168,85,247",  icon: "🤖" },
  special:       { label: "Special Recognition", color: "#FF006E", rgb: "255,0,110",   icon: "⭐" },
};
const LC = { Beginner: "#00F5FF", Intermediate: "#FF6B35", Advanced: "#A855F7" };

const ACHS = [
  { id:0, init:"AS", name:"Arjun Sharma",   city:"Bhopal",   robot:"AutoPilot V3",  type:"competition",   title:"1st Place — National Robotics Championship", sub:"Autonomous Navigation · New Delhi 2025",    quote:"The ROS2 curriculum was a complete game-changer for me.",         tags:["ROS2","SLAM","Vision"],    level:"Advanced",     date:"Mar 2025" },
  { id:1, init:"PM", name:"Priya Mehta",    city:"Indore",   robot:"AgroBot 2.0",   type:"project",       title:"Best Innovation — Bhopal Science Expo",      sub:"Smart agriculture robot using ESP32",        quote:"I built something I never thought possible at my age.",           tags:["ESP32","IoT","Sensors"],   level:"Intermediate", date:"Feb 2025" },
  { id:2, init:"RV", name:"Rahul Verma",    city:"Bhopal",   robot:"LineTracer X",  type:"certification", title:"Advanced ROS2 Certification — Top of Batch", sub:"Scored 98% — Highest in Batch 14",          quote:"Every module built perfectly on the previous one.",               tags:["ROS2","Python","Nav"],     level:"Advanced",     date:"Jan 2025" },
  { id:3, init:"SP", name:"Sneha Patel",    city:"Bhopal",   robot:"MediBot",       type:"special",       title:"Youngest Project Lead — Age 13",             sub:"Led team of 4 to build a hospital robot",   quote:"Age is just a number with the right guidance.",                   tags:["Arduino","Leadership"],   level:"Beginner",     date:"Dec 2024" },
  { id:4, init:"KT", name:"Karan Trivedi",  city:"Jabalpur", robot:"PCBTrack v2",   type:"certification", title:"PCB Design & Electronics — Distinction",    sub:"Completed with distinction, Batch 11",      quote:"Designing my own PCB felt like actual engineering.",               tags:["KiCad","PCB","SMD"],       level:"Intermediate", date:"Nov 2024" },
  { id:5, init:"AR", name:"Aisha Rawat",    city:"Bhopal",   robot:"VisionBot",     type:"competition",   title:"2nd Place — MP State Robowar 2024",          sub:"Computer vision autonomous combat robot",   quote:"Competing at state level showed me what's possible.",             tags:["OpenCV","RPi","Vision"],   level:"Advanced",     date:"Oct 2024" },
  { id:6, init:"VK", name:"Vikram Kaur",    city:"Bhopal",   robot:"EcoSense",      type:"project",       title:"Smart City Challenge — Finalist",            sub:"Air quality monitoring IoT network",         quote:"Real-world impact from a school project — surreal.",               tags:["ESP32","Cloud","API"],     level:"Intermediate", date:"Sep 2024" },
  { id:7, init:"NK", name:"Naina Kapoor",   city:"Bhopal",   robot:"ChemBot",       type:"special",       title:"Girls in STEM Recognition Award",            sub:"Inspired 40+ girls to join robotics",       quote:"I want every girl to know — robotics is for us too.",             tags:["Arduino","Advocacy"],     level:"Beginner",     date:"Aug 2024" },
  { id:8, init:"RM", name:"Rajan Mishra",   city:"Sagar",    robot:"AutoDriveX",    type:"certification", title:"Python for AI & ML — 95% Score",            sub:"Top performer across all Python batches",   quote:"AI stopped feeling like magic and started feeling like maths.",   tags:["Python","ML","AI"],        level:"Advanced",     date:"Jul 2024" },
];

const PHOTOS1 = [
  { src:"/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.01 PM.jpeg", label:"Build Kickoff Session",  date:"Apr 2025", tag:"Workshop" },
  { src:"/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.01 PM (1).jpeg", label:"Chassis Assembly",     date:"Mar 2025", tag:"Build" },
  { src:"/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.01 PM (2).jpeg", label:"Electronics Integration",   date:"Jun 2024", tag:"Lab" },
  { src:"/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.11 PM.jpeg", label:"Motor Configuration",          date:"Feb 2025", tag:"Build" },
  { src:"/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.12 PM.jpeg", label:"Sensor Integration",   date:"Mar 2025", tag:"Testing" },
  { src:"/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.12 PM (1).jpeg", label:"PCB Soldering Session",        date:"Jan 2025", tag:"Lab" },
];
const PHOTOS2 = [
  { src:"/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.15 PM.jpeg", label:"Wiring Installation",       date:"Dec 2024", tag:"Integration" },
  { src:"/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.15 PM (1).jpeg", label:"Power System Setup",    date:"Feb 2025", tag:"Testing" },
  { src:"/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.25 PM.jpeg", label:"Field Testing Phase",date:"Jan 2025",tag:"Validation" },
  { src:"/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.27 PM.jpeg", label:"Deployment Ready",            date:"Apr 2025", tag:"Complete" },
  { src:"/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.27 PM (1).jpeg", label:"Team Success Moment",      date:"Nov 2024", tag:"Milestone" },
  { src:"/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.28 PM.jpeg", label:"Final Robot Showcase",  date:"Oct 2024", tag:"Success" },
];

const ROBOTS = [
  { emoji:"🚗", color:"#FF6B35", rgb:"255,107,53",  type:"Line Follower / Maze Solver",   name:"AutoBot V1",    built:"1,200+ students", level:"Beginner",
    desc:"The first robot every beginner builds. Sensors detect the line, motors follow. Simple concept — deeply satisfying result.",
    specs:["Arduino Mega + IR Sensor Array","L298N Dual Motor Driver","4WD Chassis — 200 RPM","PID Control Loop"] },
  { emoji:"📡", color:"#00F5FF", rgb:"0,245,255",    type:"IoT Environmental Monitor",     name:"SensorBot Pro", built:"640+ students",   level:"Intermediate",
    desc:"Monitors temperature, humidity, air quality and streams live data to a cloud dashboard accessible from any phone.",
    specs:["ESP32 Wi-Fi + BLE","DHT22 + MQ135 Sensors","OLED 128×64 Display","AWS IoT Core Integration"] },
  { emoji:"🦾", color:"#A855F7", rgb:"168,85,247",   type:"Autonomous Navigation Robot",   name:"AutonomBot X",  built:"120+ students",   level:"Advanced",
    desc:"Self-navigates unknown environments using LIDAR, builds a real-time map, and avoids obstacles with zero human input.",
    specs:["Raspberry Pi 4 + Ubuntu 22","RPLiDAR A1M8 360°","ROS2 Humble + Nav2 Stack","TensorFlow Lite Vision"] },
  { emoji:"✋", color:"#FF006E", rgb:"255,0,110",     type:"Gesture-Controlled Robot",      name:"GestureBot",    built:"280+ students",   level:"Intermediate",
    desc:"Controlled entirely by hand gestures via flex sensors in a custom glove. No joystick, no app — just intuition.",
    specs:["Arduino Nano + Flex × 5","NRF24L01 Wireless Module","Custom Glove Controller","Real-time Response < 20ms"] },
  { emoji:"👁️", color:"#FF6B35", rgb:"255,107,53",   type:"Computer Vision Platform",      name:"VisionBot V2",  built:"95+ students",    level:"Advanced",
    desc:"Detects faces, reads QR codes, and tracks coloured objects in real time using OpenCV running on Raspberry Pi.",
    specs:["Raspberry Pi 4 + Pi Camera v2","OpenCV 4.8 + Python 3.11","Custom Flask Web Dashboard","Object Tracking @ 30 FPS"] },
];

const STARS = [
  { init:"AS", name:"Arjun Sharma",  city:"Bhopal",   spec:"ROS2 & Autonomous Systems",   color:"#A855F7", achs:4, tags:["National Champion","Advanced Cert"] },
  { init:"PM", name:"Priya Mehta",   city:"Indore",   spec:"IoT & ESP32 Engineering",      color:"#FF6B35", achs:3, tags:["Science Expo Win","Best Innovation"] },
  { init:"RV", name:"Rahul Verma",   city:"Bhopal",   spec:"Python AI & Machine Learning", color:"#00F5FF", achs:3, tags:["Top of Batch","98% Score"] },
  { init:"SP", name:"Sneha Patel",   city:"Bhopal",   spec:"Arduino & Team Leadership",    color:"#FF006E", achs:2, tags:["Youngest Lead","Girls in STEM"] },
  { init:"KT", name:"Karan Trivedi", city:"Jabalpur", spec:"PCB Design & Electronics",     color:"#FF6B35", achs:2, tags:["PCB Certified","Distinction"] },
  { init:"AR", name:"Aisha Rawat",   city:"Bhopal",   spec:"Computer Vision & RPi",        color:"#A855F7", achs:3, tags:["State 2nd Place","Vision Expert"] },
];

const SKILLCATS = [
  { title:"Hardware", color:"#FF6B35", skills:[{n:"Arduino Programming",p:94},{n:"ESP32 & IoT",p:81},{n:"Sensor Integration",p:88},{n:"PCB Design (KiCad)",p:62},{n:"Motor Control",p:76}] },
  { title:"Software", color:"#00F5FF", skills:[{n:"Python",p:89},{n:"ROS2",p:58},{n:"OpenCV",p:65},{n:"Machine Learning",p:44},{n:"Cloud (AWS/GCP)",p:52}] },
  { title:"Robotics", color:"#A855F7", skills:[{n:"Autonomous Navigation",p:55},{n:"SLAM & Mapping",p:48},{n:"Computer Vision",p:61},{n:"Robot Kinematics",p:42},{n:"ROS2 Nav Stack",p:50}] },
];

const CERTS = [
  {icon:"🏅",txt:"Arduino Fundamentals",color:"#FF6B35"},{icon:"🏅",txt:"ESP32 & IoT",color:"#00F5FF"},
  {icon:"🏅",txt:"Python for AI",color:"#A855F7"},{icon:"🏅",txt:"ROS2 Advanced",color:"#FF006E"},
  {icon:"🏅",txt:"PCB Design",color:"#FF6B35"},{icon:"🏅",txt:"Computer Vision",color:"#A855F7"},
  {icon:"🏅",txt:"Raspberry Pi & Linux",color:"#00F5FF"},{icon:"🏅",txt:"Autonomous Systems",color:"#FF006E"},
];

const TESTIS = [
  { q:"Nimo Labs completely changed how I see engineering. I came in knowing nothing about electronics — six months later I won a national competition. The instructors here are world-class.", name:"Arjun Sharma",  role:"Student, Age 17 — National Champion 2025", color:"#FF6B35", init:"AS" },
  { q:"I was skeptical — my daughter was only 13. But watching her lead a team of four students to build a working hospital robot made me a true believer. This program is exceptional.",   name:"Kavitha Patel", role:"Parent of Sneha Patel",                    color:"#A855F7", init:"KP" },
  { q:"The hands-on approach is what sets Nimo Labs apart. No death-by-PowerPoint. You build on Day 1, you debug on Day 2. By Day 10 you have something real to show your parents.",        name:"Priya Mehta",   role:"Student, Age 16 — Science Expo Winner",   color:"#00F5FF", init:"PM" },
  { q:"My son went from gaming all day to spending weekends voluntarily in the lab. Whatever Nimo Labs is doing — more institutions in India need to do it.",                                name:"Ramesh Verma",  role:"Parent of Rahul Verma",                    color:"#FF006E", init:"RV" },
];

/* ─── REUSABLE SMALL COMPONENTS ─────────────────────────────────────────────── */
function Badge({ children }) {
  return (
    <div className="inline-flex items-center gap-2 px-[14px] py-[7px] mb-[22px]"
         style={{ background:"rgba(255,107,53,.07)", border:"1px solid rgba(255,107,53,.22)" }}>
      <span className="w-[6px] h-[6px] rounded-full bg-[#FF6B35] anim-pd" />
      <span className="font-syne text-[9px] font-bold tracking-[.42em] uppercase text-[#FF6B35]">{children}</span>
    </div>
  );
}

function Rule() {
  return <div className="h-px my-[18px] w-12" style={{ background:"linear-gradient(90deg,#FF6B35,transparent)" }} />;
}

function SectionTitle({ children, style }) {
  return (
    <h2 className="font-bebas leading-[.9] tracking-[-0.01em]"
        style={{ background:"linear-gradient(160deg,#F0EAD6 0%,rgba(240,234,214,.3) 100%)",
                 WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", ...style }}>
      {children}
    </h2>
  );
}

/* ─── HERO ───────────────────────────────────────────────────────────────────── */
function Counter({ end, suffix }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (started.current || !e.isIntersecting) return;
      started.current = true;
      const t0 = performance.now();
      const tick = (now) => {
        const p = Math.min((now - t0) / 2400, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(ease * end));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [end]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

const STAT_BOXES = [
  { end:6200, suf:"+", color:"#FF6B35", label:"Students" },
  { end:340,  suf:"+", color:"#00F5FF", label:"Robots Built" },
  { end:48,   suf:"",  color:"#A855F7", label:"Comp Wins" },
  { end:100,  suf:"%", color:"#FF006E", label:"Certified" },
];

function Hero() {
  return (
    <section id="hero" className="pt-[140px] pb-20 px-12 relative overflow-hidden"
             style={{ borderBottom:"1px solid rgba(255,255,255,.055)" }}>
      <div className="glo absolute top-[-80px] left-[-60px] w-[500px] h-[400px] rounded-full pointer-events-none"
           style={{ background:"radial-gradient(ellipse,rgba(255,107,53,.12) 0%,transparent 70%)" }} />
      <div className="glo absolute bottom-[-80px] right-[-40px] w-[480px] h-[380px] rounded-full pointer-events-none"
           style={{ background:"radial-gradient(ellipse,rgba(168,85,247,.1) 0%,transparent 70%)" }} />
      <div className="gbg" /><div className="scanl" />
      <div className="relative z-[2] max-w-[1100px] mx-auto flex items-end justify-between gap-12 flex-wrap">
        <div style={{ maxWidth:610 }}>
          <Badge>Hall of Makers · Class of 2025</Badge>
          <h1 className="font-bebas text-[clamp(60px,10vw,112px)] leading-[.86] tracking-[-0.02em] mb-4"
              style={{ background:"linear-gradient(160deg,#F0EAD6 0%,rgba(240,234,214,.28) 100%)",
                       WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
            Student<br />
            Achieve<span style={{ WebkitTextStroke:"1.5px rgba(240,234,214,.35)", WebkitTextFillColor:"transparent" }}>ments</span>
          </h1>
          <Rule />
          <p className="text-[clamp(13px,1.3vw,15px)] font-light leading-[1.8] tracking-[.02em] mt-4"
             style={{ color:"rgba(240,234,214,.48)", maxWidth:460 }}>
            Real students. Real robots. Real results. Every achievement here was earned with curiosity, code, and a lot of late-night debugging sessions in Bhopal.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 flex-shrink-0">
          {STAT_BOXES.map(s => (
            <div key={s.label} className="relative px-[22px] py-[18px] overflow-hidden min-w-[120px]"
                 style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", backdropFilter:"blur(12px)" }}>
              <div className="absolute top-0 left-0 right-0 h-[1.5px]" style={{ background:s.color }} />
              <div className="absolute top-0 left-0 w-[14px] h-[14px]" style={{ borderTop:`1px solid ${s.color}`, borderLeft:`1px solid ${s.color}` }} />
              <div className="font-bebas text-[clamp(1.8rem,3.5vw,2.8rem)] leading-none mb-1" style={{ color:s.color }}>
                <Counter end={s.end} suffix={s.suf} />
              </div>
              <div className="font-syne text-[8px] font-bold tracking-[.32em] uppercase" style={{ color:"rgba(240,234,214,.3)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FILM STRIP GALLERY ─────────────────────────────────────────────────────── */
function PhotoCard({ p }) {
  const [hovered, setHovered] = useState(false);
  const hasImage = !!p.src;
  return (
    <div className={`relative flex-shrink-0 w-[300px] h-[210px] cursor-pointer overflow-hidden transition-all duration-[400ms] pbg ${!hasImage ? p.cls : ''}`}
         style={{ border:"1.5px solid rgba(255,255,255,.07)", transform: hovered ? "scale(1.07) translateY(-5px)" : "scale(1)", zIndex: hovered ? 10 : 1,
                  boxShadow: hovered ? "0 24px 60px rgba(0,0,0,.65)" : "none", borderColor: hovered ? "rgba(255,255,255,.24)" : "rgba(255,255,255,.07)" }}
         onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {hasImage && (
        <img src={p.src} alt={p.label} className="absolute inset-0 w-full h-full object-cover" />
      )}
      <span className="absolute top-3 left-3 font-syne text-[7px] font-bold tracking-[.3em] uppercase px-2 py-0.5 z-10"
            style={{ background:"rgba(0,0,0,.55)", border:"1px solid rgba(255,255,255,.12)", color:"rgba(240,234,214,.7)" }}>{p.tag}</span>
      {p.icon && (
        <span className="absolute top-3 right-3.5 text-[1.4rem] opacity-75 z-10">{p.icon}</span>
      )}
      <div className="absolute inset-0 flex flex-col justify-end p-[14px] transition-opacity duration-300"
           style={{ background:"linear-gradient(to top,rgba(5,5,8,.9) 0%,rgba(5,5,8,.3) 60%,transparent 100%)", opacity: hovered ? 1 : 0 }}>
        <div className="font-syne text-[10px] font-bold tracking-[.28em] uppercase text-[#F0EAD6] mb-0.5">{p.label}</div>
        <div className="text-[11px] font-light" style={{ color:"rgba(240,234,214,.5)" }}>{p.date}</div>
      </div>
    </div>
  );
}

function Sprockets() {
  return (
    <div className="h-[28px] bg-black flex items-center gap-4 px-3 relative z-[4]">
      {Array.from({length:44}).map((_,i) => (
        <div key={i} className="w-4 h-4 rounded-[3px] flex-shrink-0" style={{ background:"#050508" }} />
      ))}
    </div>
  );
}

function Gallery() {
  return (
    <section id="gallery" className="overflow-hidden" style={{ background:"#020204" }}>
      <div className="px-12 pt-16 pb-10 max-w-[1100px] mx-auto relative z-[2]">
        <Badge>From The Lab</Badge>
        <SectionTitle style={{ fontSize:"clamp(36px,6vw,68px)" }}>Moments That<br />Define Makers</SectionTitle>
        <Rule />
        <p className="text-[13px] font-light leading-[1.8]" style={{ color:"rgba(240,234,214,.45)", maxWidth:440 }}>
          Hundreds of hours of building, soldering, debugging — and finally, making it work. Here's what that looks like.
        </p>
      </div>
      {/* Row 1 */}
      <div className="relative">
        <Sprockets />
        <div className="overflow-hidden film-row-outer" style={{ background:"#0a0a0e" }}>
          <div className="flex gap-2 py-2 anim-filmR" style={{ width:"max-content" }}>
            {[...PHOTOS1,...PHOTOS1].map((p,i) => <PhotoCard key={i} p={p} />)}
          </div>
        </div>
        <Sprockets />
      </div>
      {/* Divider */}
      <div className="flex items-center justify-center gap-5 py-3.5 bg-black relative z-[3]">
        <div className="flex-1 max-w-[100px] h-px" style={{ background:"rgba(255,255,255,.06)" }} />
        <span className="font-bebas text-[.8rem] tracking-[.55em]" style={{ color:"rgba(240,234,214,.18)" }}>Nimo Labs · Bhopal · 2024–2025</span>
        <div className="flex-1 max-w-[100px] h-px" style={{ background:"rgba(255,255,255,.06)" }} />
      </div>
      {/* Row 2 */}
      <div className="relative">
        <Sprockets />
        <div className="overflow-hidden film-row-outer" style={{ background:"#0a0a0e" }}>
          <div className="flex gap-2 py-2 anim-filmL" style={{ width:"max-content" }}>
            {[...PHOTOS2,...PHOTOS2].map((p,i) => <PhotoCard key={i} p={p} />)}
          </div>
        </div>
        <Sprockets />
      </div>
    </section>
  );
}

/* ─── ACHIEVEMENT CARD ───────────────────────────────────────────────────────── */
function AchCard({ a }) {
  const tm = TM[a.type];
  const lc = LC[a.level];
  const cardRef = useRef(null);
  const rafRef = useRef(null);
  const state = useRef({ cX:0, cY:0, tX:0, tY:0, on:false });

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const lrp = (a,b,t) => a + (b-a)*t;
    const tick = () => {
      const s = state.current;
      s.cX = lrp(s.cX, s.tX, .1);
      s.cY = lrp(s.cY, s.tY, .1);
      card.style.transform = `perspective(900px) rotateX(${s.cX}deg) rotateY(${s.cY}deg) translateZ(${s.on ? 10 : 0}px)`;
      if (Math.abs(s.cX-s.tX) > .01 || Math.abs(s.cY-s.tY) > .01 || s.on)
        rafRef.current = requestAnimationFrame(tick);
    };
    const onMove = (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX-r.left)/r.width, y = (e.clientY-r.top)/r.height;
      state.current.tY = (x-.5)*18; state.current.tX = (.5-y)*13;
      const ox=(x-.5)*56, oy=(y-.5)*44;
      card.style.boxShadow = `${ox}px ${oy}px 40px rgba(${tm.rgb},.28),0 0 16px rgba(${tm.rgb},.12)`;
      card.style.borderColor = `rgba(${tm.rgb},.44)`;
      card.style.background = "rgba(255,255,255,.048)";
    };
    const onEnter = () => {
      state.current.on = true; card.style.transition = "none";
      cancelAnimationFrame(rafRef.current); rafRef.current = requestAnimationFrame(tick);
    };
    const onLeave = () => {
      state.current.on = false; state.current.tX = 0; state.current.tY = 0;
      card.style.transition = "transform .7s cubic-bezier(.23,1,.32,1),background .3s,border-color .3s,box-shadow .3s";
      card.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)";
      card.style.boxShadow = ""; card.style.borderColor = "rgba(255,255,255,.07)"; card.style.background = "rgba(255,255,255,.03)";
      cancelAnimationFrame(rafRef.current); rafRef.current = requestAnimationFrame(tick);
    };
    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mouseleave", onLeave);
    return () => {
      card.removeEventListener("mousemove", onMove);
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, [tm.rgb]);

  return (
    <div ref={cardRef} className="ac relative overflow-hidden cursor-pointer"
         style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", backdropFilter:"blur(16px)" }}>
      <div className="ac-bar absolute top-0 left-0 right-0 h-0.5" style={{ background:tm.color }} />
      <div className="ac-tl absolute top-0 left-0 w-[18px] h-[18px]" style={{ borderTop:`1px solid ${tm.color}`, borderLeft:`1px solid ${tm.color}` }} />
      <div className="ac-br absolute bottom-0 right-0 w-[18px] h-[18px]" style={{ borderBottom:`1px solid ${tm.color}40`, borderRight:`1px solid ${tm.color}40` }} />
      <div className="absolute right-[-6px] bottom-[-14px] font-bebas text-[8rem] leading-none pointer-events-none select-none opacity-[.06] text-[#F0EAD6]">{a.init}</div>
      {/* Head */}
      <div className="px-[22px] pt-5 pb-[15px]" style={{ borderBottom:"1px solid rgba(255,255,255,.055)" }}>
        <div className="inline-flex items-center gap-[5px] px-[10px] py-1 mb-3 font-syne text-[8px] font-bold tracking-[.28em] uppercase"
             style={{ background:`rgba(${tm.rgb},.1)`, border:`1px solid rgba(${tm.rgb},.28)`, color:tm.color }}>
          {tm.icon} {tm.label}
        </div>
        <div className="font-bebas text-[25px] leading-[.95] mb-0.5 text-[#F0EAD6] transition-colors duration-300">{a.name}</div>
        <div className="font-syne text-[8px] font-semibold tracking-[.26em] uppercase" style={{ color:"rgba(240,234,214,.3)" }}>{a.robot} · {a.city}</div>
      </div>
      {/* Body */}
      <div className="px-[22px] py-[15px]">
        <p className="text-[12.5px] font-light leading-[1.75] italic mb-3 transition-colors duration-300" style={{ color:"rgba(240,234,214,.52)" }}>"{a.quote}"</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {a.tags.map(t => (
            <span key={t} className="px-2 py-0.5 font-syne text-[7.5px] font-bold tracking-[.2em] uppercase"
                  style={{ background:`rgba(${tm.rgb},.07)`, border:`1px solid rgba(${tm.rgb},.22)`, color:tm.color }}>{t}</span>
          ))}
        </div>
      </div>
      {/* Foot */}
      <div className="px-[22px] py-[11px] flex items-end justify-between" style={{ borderTop:"1px solid rgba(255,255,255,.055)" }}>
        <div className="font-syne text-[11px] font-bold leading-[1.3]" style={{ color:"rgba(240,234,214,.8)" }}>
          {a.title}<br />
          <span className="font-light text-[10px]" style={{ color:"rgba(240,234,214,.35)" }}>{a.sub}</span>
        </div>
        <div className="text-right flex-shrink-0 ml-2.5">
          <div className="font-syne text-[8px] font-semibold tracking-[.28em] uppercase" style={{ color:"rgba(240,234,214,.3)" }}>{a.date}</div>
          <div className="font-syne text-[8px] font-bold tracking-[.22em] uppercase mt-0.5" style={{ color:lc }}>{a.level}</div>
        </div>
      </div>
    </div>
  );
}

/* ─── ACHIEVEMENTS SECTION ───────────────────────────────────────────────────── */
function Achievements() {
  const [filter, setFilter] = useState("all");
  const gridRef = useRef(null);

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll(".ac-item");
    gsap.utils.toArray(cards).forEach((c, i) => {
      gsap.fromTo(c, { opacity:0, y:28 }, { opacity:1, y:0, duration:.65, ease:"power2.out",
        scrollTrigger:{ trigger:c, start:"top 90%" }, delay:(i%3)*.1 });
    });
  }, []);

  const visible = ACHS.filter(a => filter === "all" || a.type === filter);

  return (
    <section id="ach-section" className="py-20 px-12 relative overflow-hidden"
             style={{ borderTop:"1px solid rgba(255,255,255,.055)" }}>
      <div className="glo absolute top-[-60px] right-[-40px] w-[400px] h-[320px] rounded-full pointer-events-none"
           style={{ background:"radial-gradient(ellipse,rgba(255,107,53,.09) 0%,transparent 70%)" }} />
      <div className="gbg" /><div className="scanl" />
      <div className="relative z-[2] max-w-[1100px] mx-auto">
        <Badge>All Achievements</Badge>
        <div className="flex items-end justify-between flex-wrap gap-4 mb-5">
          <SectionTitle style={{ fontSize:"clamp(36px,5.5vw,68px)" }}>Every Win<br />Counts</SectionTitle>
          <p className="text-[13px] font-light leading-[1.8]" style={{ color:"rgba(240,234,214,.45)", maxWidth:340 }}>
            Click any card to explore the full story. Filter by category below.
          </p>
        </div>
        {/* Filter bar */}
        <div className="flex items-center gap-2 flex-wrap mb-9">
          <span className="font-syne text-[8px] font-bold tracking-[.35em] uppercase mr-1.5" style={{ color:"rgba(240,234,214,.28)" }}>Filter</span>
          {[["all","All"],["competition","Competitions"],["certification","Certifications"],["project","Projects"],["special","Special"]].map(([val,lbl]) => (
            <button key={val}
                    onClick={() => setFilter(val)}
                    className="font-syne text-[9px] font-bold tracking-[.28em] uppercase px-[18px] py-2 cursor-pointer transition-all duration-[250ms]"
                    style={{
                      border: filter === val ? "1px solid rgba(255,107,53,.42)" : "1px solid rgba(255,255,255,.1)",
                      background: filter === val ? "rgba(255,107,53,.08)" : "transparent",
                      color: filter === val ? "#FF6B35" : "rgba(240,234,214,.4)"
                    }}>{lbl}</button>
          ))}
        </div>
        <div ref={gridRef} className="grid grid-cols-3 gap-[18px] max-[900px]:grid-cols-2 max-[560px]:grid-cols-1">
          {visible.map(a => (
            <div key={a.id} className="ac-item"><AchCard a={a} /></div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── ROBOT RAIL ─────────────────────────────────────────────────────────────── */
function RobotCard({ r }) {
  const [hov, setHov] = useState(false);
  return (
    <div className="rcard w-[310px] flex-shrink-0 relative overflow-hidden cursor-pointer"
         style={{
           background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)",
           backdropFilter:"blur(16px)", transition:"border-color .3s,background .3s,transform .4s cubic-bezier(.16,1,.3,1)",
           transform: hov ? "translateY(-4px)" : "none",
           borderColor: hov ? `rgba(${r.rgb},.35)` : "rgba(255,255,255,.07)"
         }}
         onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <div className="h-[175px] flex items-center justify-center relative overflow-hidden rcard-viz"
           style={{ background:`linear-gradient(135deg,rgba(${r.rgb},.05) 0%,rgba(${r.rgb},.2) 100%)` }}>
        <div className="absolute inset-0" style={{ background:`radial-gradient(ellipse at 50% 80%,rgba(${r.rgb},.18) 0%,transparent 65%)` }} />
        <span className="text-[3.4rem] relative z-[2]" style={{ color:r.color, filter:`drop-shadow(0 0 18px ${r.color})` }}>{r.emoji}</span>
      </div>
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background:r.color }} />
      <div className="px-5 py-[18px]">
        <div className="font-syne text-[8px] font-bold tracking-[.32em] uppercase mb-1.5" style={{ color:r.color }}>{r.type}</div>
        <div className="font-bebas text-[1.55rem] leading-[.95] mb-2 text-[#F0EAD6]">{r.name}</div>
        <p className="text-[12px] font-light leading-[1.7] mb-3.5" style={{ color:"rgba(240,234,214,.48)" }}>{r.desc}</p>
        <div className="flex flex-col gap-[5px] mb-3.5">
          {r.specs.map(s => (
            <div key={s} className="flex items-center gap-1.5 text-[11px] font-light" style={{ color:"rgba(240,234,214,.4)" }}>
              <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background:r.color }} />{s}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-3" style={{ borderTop:"1px solid rgba(255,255,255,.06)" }}>
          <div>
            <div className="font-syne text-[7px] font-bold tracking-[.32em] uppercase mb-0.5" style={{ color:"rgba(240,234,214,.3)" }}>Built By</div>
            <div className="font-bebas text-[1.2rem]" style={{ color:r.color }}>{r.built}</div>
          </div>
          <div className="font-syne text-[8px] font-bold tracking-[.24em] uppercase px-[10px] py-0.5"
               style={{ border:`1px solid ${r.color}44`, color:r.color }}>{r.level}</div>
        </div>
      </div>
    </div>
  );
}

function Robots() {
  const wrapRef = useRef(null);
  const drag = useRef({ active:false, sx:0, sl:0 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const down = (e) => { drag.current = { active:true, sx:e.pageX-el.offsetLeft, sl:el.scrollLeft }; };
    const up   = () => { drag.current.active = false; };
    const move = (e) => {
      if (!drag.current.active) return;
      e.preventDefault();
      el.scrollLeft = drag.current.sl - (e.pageX - el.offsetLeft - drag.current.sx) * 1.6;
    };
    el.addEventListener("mousedown", down);
    el.addEventListener("mouseleave", up);
    el.addEventListener("mouseup", up);
    el.addEventListener("mousemove", move);
    return () => { el.removeEventListener("mousedown",down); el.removeEventListener("mouseleave",up); el.removeEventListener("mouseup",up); el.removeEventListener("mousemove",move); };
  }, []);

  return (
    <section id="robots" className="py-20" style={{ borderTop:"1px solid rgba(255,255,255,.055)" }}>
      <div className="px-12 max-w-[1148px] mx-auto mb-8">
        <Badge>Robot Roll of Honour</Badge>
        <div className="flex items-end justify-between flex-wrap gap-4">
          <SectionTitle style={{ fontSize:"clamp(32px,5vw,62px)" }}>Machines Our<br />Students Built</SectionTitle>
          <p className="text-[13px] font-light leading-[1.8]" style={{ color:"rgba(240,234,214,.45)", maxWidth:320 }}>Drag or scroll right to explore every robot ever built at Nimo Labs.</p>
        </div>
      </div>
      <div ref={wrapRef} className="robot-rail overflow-x-auto cursor-grab active:cursor-grabbing pb-2.5"
           style={{ scrollbarWidth:"thin" }}>
        <div className="flex gap-4 px-12" style={{ width:"max-content", padding:"4px 48px" }}>
          {ROBOTS.map((r,i) => <RobotCard key={i} r={r} />)}
        </div>
      </div>
    </section>
  );
}

/* ─── RISING STARS ───────────────────────────────────────────────────────────── */
function Stars() {
  return (
    <section id="stars" className="py-20 px-12 relative overflow-hidden"
             style={{ borderTop:"1px solid rgba(255,255,255,.055)" }}>
      <div className="glo absolute top-[-40px] right-0 w-[380px] h-[300px] rounded-full pointer-events-none"
           style={{ background:"radial-gradient(ellipse,rgba(168,85,247,.09) 0%,transparent 70%)" }} />
      <div className="gbg" />
      <div className="relative z-[2] max-w-[1100px] mx-auto">
        <Badge>Rising Stars</Badge>
        <SectionTitle style={{ fontSize:"clamp(32px,5vw,62px)", marginBottom:8 }}>Class of 2025</SectionTitle>
        <p className="text-[13px] font-light leading-[1.8] mb-9" style={{ color:"rgba(240,234,214,.45)", maxWidth:440 }}>
          These students went above and beyond — in the lab, in competitions, and in life.
        </p>
        <div className="grid grid-cols-3 gap-4 max-[900px]:grid-cols-1">
          {STARS.map((s,i) => (
            <div key={i} className="scard relative p-[26px] overflow-hidden transition-all duration-[350ms] cursor-default"
                 style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", backdropFilter:"blur(16px)" }}
                 onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,.048)"; e.currentTarget.style.transform="translateY(-4px)"; }}
                 onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,.03)";  e.currentTarget.style.transform="none"; }}>
              <div className="absolute top-0 left-0 right-0 h-[1.5px]" style={{ background:`linear-gradient(90deg,${s.color},transparent)` }} />
              <div className="absolute right-[-4px] top-[-10px] font-bebas text-[6rem] leading-none opacity-[.06] pointer-events-none select-none text-[#F0EAD6]">{s.init}</div>
              <div className="relative w-[50px] h-[50px] rounded-full flex items-center justify-center font-syne text-[14px] font-bold mb-3.5"
                   style={{ background:"rgba(0,0,0,.45)", border:`1px solid ${s.color}44`, color:s.color }}>
                {s.init}
                <span className="scard-av absolute inset-[-3px] rounded-full" style={{ border:`1px solid ${s.color}30` }} />
              </div>
              <div className="font-syne text-[15px] font-bold mb-0.5 text-[#F0EAD6]">{s.name}</div>
              <div className="text-[11px] font-light mb-2.5" style={{ color:"rgba(240,234,214,.38)" }}>{s.city} · {s.achs} Achievements</div>
              <div className="font-syne text-[9px] font-bold tracking-[.24em] uppercase mb-3" style={{ color:s.color }}>{s.spec}</div>
              <div className="flex flex-wrap gap-1.5">
                {s.tags.map(t => (
                  <span key={t} className="font-syne text-[7px] font-bold tracking-[.2em] uppercase px-2 py-0.5"
                        style={{ border:`1px solid ${s.color}33`, color:s.color, background:"rgba(0,0,0,.35)" }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── SKILLS ─────────────────────────────────────────────────────────────────── */
function SkillBar({ n, p, color }) {
  const fillRef = useRef(null);
  useEffect(() => {
    if (!fillRef.current) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { fillRef.current.style.width = p + "%"; obs.disconnect(); }
    }, { threshold: 0.2 });
    obs.observe(fillRef.current);
    return () => obs.disconnect();
  }, [p]);
  return (
    <div className="flex items-center justify-between mb-[13px]">
      <span className="text-[12px] font-light mr-2.5 whitespace-nowrap" style={{ color:"rgba(240,234,214,.65)" }}>{n}</span>
      <div className="flex-1 h-[3px] overflow-hidden" style={{ background:"rgba(255,255,255,.07)" }}>
        <div ref={fillRef} className="ski-fill h-full rounded-[2px]" style={{ background:`linear-gradient(90deg,${color},${color}77)` }} />
      </div>
      <span className="font-bebas text-[13px] tracking-[.08em] ml-2.5 min-w-[30px] text-right" style={{ color:"rgba(240,234,214,.4)" }}>{p}%</span>
    </div>
  );
}

function Skills() {
  return (
    <section id="skills" className="py-20 px-12 relative overflow-hidden"
             style={{ borderTop:"1px solid rgba(255,255,255,.055)" }}>
      <div className="glo absolute bottom-[-40px] left-0 w-[380px] h-[300px] rounded-full pointer-events-none"
           style={{ background:"radial-gradient(ellipse,rgba(255,107,53,.07) 0%,transparent 70%)" }} />
      <div className="gbg" />
      <div className="relative z-[2] max-w-[1100px] mx-auto">
        <Badge>Skills & Certifications</Badge>
        <SectionTitle style={{ fontSize:"clamp(32px,5vw,62px)", marginBottom:8 }}>What They<br />Learned</SectionTitle>
        <p className="text-[13px] font-light leading-[1.8] mb-9" style={{ color:"rgba(240,234,214,.45)", maxWidth:440 }}>
          Every skill listed here was earned through real projects — not just lectures.
        </p>
        <div className="grid grid-cols-3 gap-5 max-[900px]:grid-cols-1">
          {SKILLCATS.map(cat => (
            <div key={cat.title} className="relative p-6 overflow-hidden" style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", backdropFilter:"blur(16px)" }}>
              <div className="absolute top-0 left-0 right-0 h-[1.5px]" style={{ background:cat.color }} />
              <div className="font-syne text-[10px] font-bold tracking-[.32em] uppercase mb-[18px]" style={{ color:cat.color }}>{cat.title}</div>
              {cat.skills.map(sk => <SkillBar key={sk.n} n={sk.n} p={sk.p} color={cat.color} />)}
            </div>
          ))}
        </div>
        {/* Certs */}
        <div className="mt-11">
          <div className="font-syne text-[8px] font-bold tracking-[.38em] uppercase mb-4" style={{ color:"rgba(240,234,214,.28)" }}>Issued Certifications</div>
          <div className="flex flex-wrap gap-2.5">
            {CERTS.map(c => (
              <div key={c.txt} className="flex items-center gap-2 px-[14px] py-2 cursor-default transition-all duration-[250ms]"
                   style={{ border:`1px solid ${c.color}33`, background:"rgba(0,0,0,.3)" }}
                   onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,.05)"}
                   onMouseLeave={e => e.currentTarget.style.background="rgba(0,0,0,.3)"}>
                <span className="text-[1rem]">{c.icon}</span>
                <span className="font-syne text-[8px] font-bold tracking-[.24em] uppercase" style={{ color:c.color }}>{c.txt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── TESTIMONIALS ───────────────────────────────────────────────────────────── */
function Testimonials() {
  return (
    <section id="testi" className="py-20 px-12 relative overflow-hidden"
             style={{ borderTop:"1px solid rgba(255,255,255,.055)" }}>
      <div className="glo absolute top-[-40px] right-0 w-[380px] h-[280px] rounded-full pointer-events-none"
           style={{ background:"radial-gradient(ellipse,rgba(0,245,255,.05) 0%,transparent 70%)" }} />
      <div className="gbg" />
      <div className="relative z-[2] max-w-[1100px] mx-auto">
        <Badge>In Their Words</Badge>
        <SectionTitle style={{ fontSize:"clamp(32px,5vw,62px)", marginBottom:36 }}>What Students<br />&amp; Parents Say</SectionTitle>
        <div className="grid grid-cols-2 gap-4 max-[900px]:grid-cols-1">
          {TESTIS.map((t,i) => (
            <div key={i} className="relative p-7 overflow-hidden transition-all duration-[350ms]"
                 style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.07)", backdropFilter:"blur(16px)" }}
                 onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,.045)"; e.currentTarget.style.transform="translateY(-3px)"; }}
                 onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,.03)"; e.currentTarget.style.transform="none"; }}>
              <div className="absolute top-0 left-0 right-0 h-[1.5px]" style={{ background:`linear-gradient(90deg,${t.color},transparent)` }} />
              <div className="font-bebas text-[5rem] leading-none absolute top-[10px] right-[18px] opacity-[.06] text-[#F0EAD6] pointer-events-none">"</div>
              <p className="text-[14px] font-light leading-[1.85] italic mb-5 relative z-[1]" style={{ color:"rgba(240,234,214,.7)" }}>{t.q}</p>
              <div className="h-px mb-4" style={{ background:"rgba(255,255,255,.07)" }} />
              <div className="flex items-center gap-3">
                <div className="w-[38px] h-[38px] rounded-full flex items-center justify-center font-syne text-[11px] font-bold flex-shrink-0"
                     style={{ background:"rgba(0,0,0,.4)", border:`1px solid ${t.color}44`, color:t.color }}>{t.init}</div>
                <div>
                  <div className="font-syne text-[12px] font-bold mb-0.5 text-[#F0EAD6]">{t.name}</div>
                  <div className="text-[11px] font-light" style={{ color:"rgba(240,234,214,.38)" }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ────────────────────────────────────────────────────────────────────── */
function CTA() {
  return (
    <section id="cta" className="px-12 pb-20">
      <div className="relative overflow-hidden p-[56px_48px] flex items-center justify-between gap-10 flex-wrap"
           style={{ border:"1px solid rgba(255,107,53,.2)", background:"rgba(255,107,53,.04)" }}>
        <div className="absolute top-0 left-0 right-0 h-[1.5px]"
             style={{ background:"linear-gradient(90deg,#FF6B35,#FF006E,transparent)" }} />
        <div className="absolute top-0 left-0 w-6 h-6" style={{ borderTop:"1px solid #FF6B35", borderLeft:"1px solid #FF6B35" }} />
        <div className="absolute right-[-40px] top-1/2 -translate-y-1/2 w-[300px] h-[200px] rounded-full pointer-events-none"
             style={{ background:"radial-gradient(ellipse,rgba(255,107,53,.1) 0%,transparent 70%)" }} />
        <div className="relative z-[1]">
          <div className="font-syne text-[9px] font-bold tracking-[.38em] uppercase text-[#FF6B35] mb-3">Your Turn</div>
          <h2 className="font-bebas text-[clamp(28px,4vw,52px)] leading-[.92] tracking-[-0.01em] mb-3 text-[#F0EAD6]">
            Ready to build<br />your own robot?
          </h2>
          <p className="text-[14px] font-light leading-[1.75]" style={{ color:"rgba(240,234,214,.48)", maxWidth:440 }}>
            Every achievement on this page started with a single enrollment. Join 6,200+ students already building the future at Nimo Labs, Bhopal.
          </p>
        </div>
        <div className="flex gap-3 flex-wrap flex-shrink-0 relative z-[1]">
          <button className="font-syne text-[10px] font-bold tracking-[.32em] uppercase text-white border-none px-8 py-[14px] cursor-pointer transition-all duration-300"
                  style={{ background:"#FF6B35", boxShadow:"0 0 24px rgba(255,107,53,.25)" }}
                  onMouseEnter={e => { e.target.style.background="#ff8040"; e.target.style.boxShadow="0 0 40px rgba(255,107,53,.5)"; e.target.style.transform="translateY(-1px)"; }}
                  onMouseLeave={e => { e.target.style.background="#FF6B35"; e.target.style.boxShadow="0 0 24px rgba(255,107,53,.25)"; e.target.style.transform="none"; }}>
            Enroll Now →
          </button>
          <button className="font-syne text-[10px] font-semibold tracking-[.32em] uppercase px-7 py-[14px] cursor-pointer transition-all duration-300"
                  style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(255,255,255,.1)", color:"rgba(240,234,214,.5)" }}
                  onMouseEnter={e => { e.target.style.borderColor="#00F5FF"; e.target.style.color="#00F5FF"; e.target.style.background="rgba(0,245,255,.04)"; }}
                  onMouseLeave={e => { e.target.style.borderColor="rgba(255,255,255,.1)"; e.target.style.color="rgba(240,234,214,.5)"; e.target.style.background="rgba(255,255,255,.03)"; }}>
            View Courses
          </button>
        </div>
      </div>
    </section>
  );
}


/* ─── ROOT ───────────────────────────────────────────────────────────────────── */
export default function HallOfMakers() {
  return (
    <>
      <style>{globalStyles}</style>
      <div className="font-dm text-[#F0EAD6] overflow-x-hidden" style={{ background:"#050508" }}>
        <Hero />
        <Gallery />
        <Achievements />
        <Robots />
        <Stars />
        <Skills />
        <Testimonials />
        <CTA />
      </div>
    </>
  );
}