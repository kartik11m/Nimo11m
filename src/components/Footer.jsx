import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const C = {
  bg:     "#020203",
  orange: "#FF6230",
  pink:   "#E0357A",
  purple: "#8B31E8",
  cyan:   "#00DFFF",
};

const COLUMNS = [
  {
    heading: "Programs",
    links: ["Summer Camp 2025", "Robotics Bootcamp", "Arduino Workshop", "Advanced Build Lab", "Weekend Sessions"],
  },
  {
    heading: "Company",
    links: ["About Nimo Labs", "Our Team", "Careers", "Press Kit", "Partners"],
  },
  {
    heading: "Resources",
    links: ["Student Portal", "Project Gallery", "Blog", "FAQ", "Scholarships"],
  },
];

const SOCIAL = [
  { label: "Instagram",   short: "IG", color: C.pink   },
  { label: "YouTube",     short: "YT", color: C.orange },
  { label: "X / Twitter", short: "X",  color: C.cyan   },
  { label: "LinkedIn",    short: "LI", color: C.purple },
];

function FooterLink({ label }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href="#"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center no-underline transition-colors duration-300"
      style={{
        fontFamily:    "'Barlow', sans-serif",
        fontWeight:    300,
        fontSize:      "13px",
        letterSpacing: ".03em",
        gap:           "0.5rem",
        paddingBottom: "2px",
        color:         hovered ? "rgba(255,255,255,.75)" : "rgba(255,255,255,.35)",
        borderBottom:  hovered ? "1px solid rgba(255,98,48,.25)" : "1px solid transparent",
      }}
    >
      {hovered && (
        <span
          className="block shrink-0"
          style={{ width:"10px", height:"1px", background:`linear-gradient(to right,${C.orange},${C.pink})` }}
        />
      )}
      {label}
    </a>
  );
}

function SocialIcon({ item }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href="#"
      aria-label={item.label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center justify-center no-underline transition-all duration-300"
      style={{
        width:     "38px",
        height:    "38px",
        background: hovered ? `${item.color}18` : "rgba(255,255,255,.03)",
        border:    `1px solid ${hovered ? item.color + "55" : "rgba(255,255,255,.08)"}`,
        transform: hovered ? "translateY(-2px)" : "none",
      }}
    >
      <span
        className="transition-colors duration-300"
        style={{
          fontFamily:    "'Barlow Condensed', sans-serif",
          fontWeight:    400,
          fontSize:      "8.5px",
          letterSpacing: ".15em",
          color:         hovered ? item.color : "rgba(255,255,255,.35)",
        }}
      >
        {item.short}
      </span>
    </a>
  );
}

function BottomLink({ label, to }) {
  const [hovered, setHovered] = useState(false);
  
  // If it's an internal route, use Link component
  if (to) {
    return (
      <Link
        to={to}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="uppercase no-underline transition-colors duration-300"
        style={{
          fontFamily:    "'Barlow Condensed', sans-serif",
          fontWeight:    400,
          fontSize:      "9px",
          letterSpacing: ".3em",
          color:         hovered ? "rgba(255,255,255,.55)" : "rgba(255,255,255,.25)",
        }}
      >
        {label}
      </Link>
    );
  }
  
  // Otherwise, use regular anchor tag
  return (
    <a
      href="#"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="uppercase no-underline transition-colors duration-300"
      style={{
        fontFamily:    "'Barlow Condensed', sans-serif",
        fontWeight:    400,
        fontSize:      "9px",
        letterSpacing: ".3em",
        color:         hovered ? "rgba(255,255,255,.55)" : "rgba(255,255,255,.25)",
      }}
    >
      {label}
    </a>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const link = document.createElement("link");
    link.rel  = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@300;400&family=Barlow:wght@300;400&display=swap";
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setStatus("error");
      setMessage("Please enter your email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Subscription failed.");
      }

      setStatus("success");
      setMessage(data.message || "You’re subscribed!");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <footer
      role="contentinfo"
      className="relative overflow-hidden border-t"
      style={{ background: C.bg, borderColor: "rgba(255,255,255,.06)" }}
    >
      {/* Atmosphere */}
      <div aria-hidden="true" className="absolute pointer-events-none rounded-full"
        style={{ bottom:"-120px", left:"-80px", width:"500px", height:"400px",
          background:"radial-gradient(ellipse,rgba(255,98,48,.12) 0%,transparent 70%)" }} />
      <div aria-hidden="true" className="absolute pointer-events-none rounded-full"
        style={{ top:"-100px", right:"-60px", width:"460px", height:"380px",
          background:"radial-gradient(ellipse,rgba(139,49,232,.1) 0%,transparent 70%)" }} />
      <div aria-hidden="true" className="absolute pointer-events-none rounded-full"
        style={{ top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:"280px", height:"160px",
          background:"radial-gradient(ellipse,rgba(0,223,255,.03) 0%,transparent 70%)" }} />
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
        style={{ background:"repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(0,0,0,.06) 3px,rgba(0,0,0,.06) 4px)" }} />
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage:"linear-gradient(rgba(255,98,48,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,98,48,.018) 1px,transparent 1px)", backgroundSize:"48px 48px" }} />
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none"
        style={{ opacity:.022, backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23g)'/%3E%3C/svg%3E\")" }} />

      {/* Body */}
      <div className="relative z-10 mx-auto px-8" style={{ maxWidth:"1200px" }}>

        {/* Upper row: brand + columns */}
        <div className="flex flex-wrap items-start justify-between"
          style={{ gap:"4rem", padding:"5rem 0 4rem" }}>

          {/* Brand */}
          <div style={{ minWidth:"260px", maxWidth:"320px", flex:"1 1 260px" }}>

            <div aria-hidden="true" className="leading-none select-none"
              style={{ fontFamily:"'Bebas Neue',cursive", fontSize:"clamp(5rem,10vw,9rem)",
                color:"transparent", WebkitTextStroke:"1px rgba(255,255,255,.04)",
                letterSpacing:"-0.01em", marginBottom:"-1.4rem" }}>
              2025
            </div>

            <div className="flex items-center" style={{ gap:".65rem", marginBottom:"1.25rem" }}>
              <div className="relative flex items-center justify-center shrink-0 overflow-hidden rounded-lg p-0.5"
                style={{ width:"44px", height:"44px", background:"rgba(255,98,48,.07)", border:`1px solid ${C.orange}44` }}>
                <div className="absolute top-0 left-0"
                  style={{ width:"10px", height:"10px", borderTop:`1px solid ${C.orange}`, borderLeft:`1px solid ${C.orange}` }} />
                <div className="absolute bottom-0 right-0"
                  style={{ width:"10px", height:"10px", borderBottom:"1px solid rgba(139,49,232,.5)", borderRight:"1px solid rgba(139,49,232,.5)" }} />
                <img src="/nimo_logo.jpeg" alt="Nimo Labs Logo" className="w-full h-full object-cover rounded" />
              </div>
              <div>
                <span className="block leading-none"
                  style={{ fontFamily:"'Bebas Neue',cursive", fontSize:"24px", letterSpacing:".05em",
                    background:`linear-gradient(90deg,${C.orange},${C.pink})`,
                    WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
                    filter:"drop-shadow(0 0 10px rgba(255,98,48,.2))" }}>
                  NIMO LABS
                </span>
                <span className="block uppercase"
                  style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:400,
                    fontSize:"7.5px", letterSpacing:".45em", color:C.cyan, marginTop:"3px", lineHeight:1 }}>
                  Robotics &amp; Innovation
                </span>
              </div>
            </div>

            <p style={{ fontFamily:"'Barlow',sans-serif", fontWeight:300, fontSize:"13.5px",
              lineHeight:1.8, color:"rgba(255,255,255,.38)", letterSpacing:".02em",
              marginBottom:"1.75rem", maxWidth:"28ch" }}>
              Shaping the next generation of builders, coders, and innovators
              through hands-on robotics education.
            </p>

            <div style={{ height:"1.5px", width:"3.5rem", marginBottom:"1.75rem",
              background:`linear-gradient(to right,${C.orange},${C.pink})` }} />

            <div className="flex" style={{ gap:".5rem" }}>
              {SOCIAL.map((s) => <SocialIcon key={s.label} item={s} />)}
            </div>
          </div>

          {/* Link columns */}
          <div className="flex flex-wrap justify-between pt-20" style={{ gap:"3rem", flex:"1 1 auto" }}>
            {COLUMNS.map((col) => (
              <div key={col.heading} style={{ minWidth:"140px" }}>
                <span className="block uppercase"
                  style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:400,
                    fontSize:"9px", letterSpacing:".45em", color:C.orange, marginBottom:"6px" }}>
                  {col.heading}
                </span>
                <div style={{ height:"1px", width:"2rem", marginBottom:"1.25rem",
                  background:`linear-gradient(to right,${C.orange},transparent)` }} />
                <nav aria-label={col.heading} className="flex flex-col" style={{ gap:".75rem" }}>
                  {col.links.map((lbl) => <FooterLink key={lbl} label={lbl} />)}
                </nav>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="flex items-center justify-between flex-wrap"
          style={{ gap:"1.5rem", padding:"2rem 0", marginBottom:"2.5rem",
            borderTop:"1px solid rgba(255,255,255,.055)",
            borderBottom:"1px solid rgba(255,255,255,.055)" }}>
          <div>
            <span className="block leading-none"
              style={{ fontFamily:"'Bebas Neue',cursive", fontSize:"clamp(1.4rem,3vw,2rem)",
                letterSpacing:".04em", marginBottom:"4px",
                background:`linear-gradient(90deg,${C.orange},${C.pink})`,
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              Stay In The Loop
            </span>
            <span style={{ fontFamily:"'Barlow',sans-serif", fontWeight:300,
              fontSize:"12.5px", color:"rgba(255,255,255,.35)", letterSpacing:".03em" }}>
              Camp updates, project showcases, and early-bird offers.
            </span>
          </div>
          <form className="flex shrink-0 flex-wrap gap-3" onSubmit={handleSubscribe}>
            <div className="flex flex-col">
              <div className="flex">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status !== "idle") setStatus("idle");
                  }}
                  placeholder="your@email.com"
                  className="outline-none"
                  style={{ fontFamily:"'Barlow',sans-serif", fontWeight:300, fontSize:"12px",
                    color:"rgba(255,255,255,.7)", background:"rgba(255,255,255,.04)",
                    border:"1px solid rgba(255,255,255,.1)", borderRight:"none",
                    padding:"11px 18px", width:"220px", letterSpacing:".03em" }}
                />
                <button
                  type="submit"
                  className="cursor-pointer border-0 text-white uppercase whitespace-nowrap shrink-0"
                  style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:400,
                    fontSize:"9px", letterSpacing:".4em", background:C.orange,
                    padding:"11px 22px", boxShadow:"0 0 18px rgba(255,98,48,.22)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#ff7a4a"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = C.orange; }}
                >
                  {status === "loading" ? "Submitting..." : "Subscribe →"}
                </button>
              </div>
              {message ? (
                <div
                  className="mt-2 flex items-start gap-2 rounded-xl border px-3 py-2"
                  style={{
                    fontFamily:"'Barlow',sans-serif",
                    fontWeight:300,
                    fontSize:"12px",
                    background: status === "success"
                      ? "rgba(124, 255, 178, 0.12)"
                      : "rgba(255, 155, 123, 0.12)",
                    borderColor: status === "success"
                      ? "rgba(124, 255, 178, 0.25)"
                      : "rgba(255, 155, 123, 0.25)",
                    color: status === "success" ? "#7CFFB2" : "#ff9b7b",
                    boxShadow: status === "success"
                      ? "0 0 20px rgba(124,255,178,0.12)"
                      : "0 0 20px rgba(255,155,123,0.12)",
                    animation: "fadeInUp 0.35s ease-out",
                  }}
                >
                  <span
                    className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full"
                    style={{
                      background: status === "success" ? "rgba(124,255,178,0.18)" : "rgba(255,155,123,0.18)",
                      color: status === "success" ? "#7CFFB2" : "#ff9b7b",
                      fontSize: "10px",
                    }}
                  >
                    {status === "success" ? "✓" : "!"}
                  </span>
                  <span>{message}</span>
                </div>
              ) : null}
            </div>
          </form>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between flex-wrap" style={{ gap:"1rem", paddingBottom:"2.5rem" }}>
          <div className="flex items-center" style={{ gap:".75rem" }}>
            <span className="block rounded-full shrink-0"
              style={{ width:"5px", height:"5px", background:C.orange,
                boxShadow:`0 0 6px ${C.orange}`, animation:"pulse 2s ease-in-out infinite" }} />
            <span style={{ fontFamily:"'Barlow',sans-serif", fontWeight:300,
              fontSize:"11.5px", color:"rgba(255,255,255,.22)", letterSpacing:".04em" }}>
              © 2025 Nimo Labs · All rights reserved.
            </span>
          </div>
          <div className="flex items-center" style={{ gap:"1.5rem" }}>
            {[
              { label: "Privacy Policy", to: "/privacy" },
              { label: "Terms of Use", to: "/terms" },
              { label: "Contact", to: "/contact" },
            ].map((item) => (
              <BottomLink key={item.label} label={item.label} to={item.to} />
            ))}
          </div>
        </div>
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:1} }
      @keyframes fadeInUp { from { opacity:0; transform:translateY(4px);} to { opacity:1; transform:translateY(0);} }`}</style>
    </footer>
  );
}
