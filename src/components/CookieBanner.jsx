import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const syne  = { fontFamily: "'Syne', sans-serif" }
const dmSans = { fontFamily: "'DM Sans', sans-serif" }

const STORAGE_KEY = 'nimo_cookie_consent'

export default function CookieBanner() {
  const [visible,  setVisible]  = useState(false)
  const [leaving,  setLeaving]  = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [prefs, setPrefs] = useState({ analytics: true, marketing: false })

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      const t = setTimeout(() => setVisible(true), 2000)
      return () => clearTimeout(t)
    }
  }, [])

  const dismiss = (accepted) => {
    setLeaving(true)
    setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        accepted,
        prefs: accepted ? prefs : { analytics: false, marketing: false },
        timestamp: Date.now(),
      }))
      setVisible(false)
    }, 380)
  }

  if (!visible) return null

  return (
    <>
      <style>{`
        @keyframes cbSlideUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes cbSlideDown { from{opacity:1;transform:translateY(0)} to{opacity:0;transform:translateY(24px)} }
      `}</style>

      <div
        className="fixed bottom-5 left-5 z-[480] max-w-[420px] w-[calc(100vw-40px)]"
        style={{ animation: leaving ? 'cbSlideDown .38s cubic-bezier(.4,0,1,1) forwards' : 'cbSlideUp .45s cubic-bezier(.16,1,.3,1)' }}
      >
        <div className="relative overflow-hidden"
          style={{ background:'rgba(5,5,8,.97)', border:'1px solid rgba(255,107,53,.22)', backdropFilter:'blur(24px)' }}>

          {/* Top accent bar */}
          <div className="h-[2px]" style={{ background:'linear-gradient(90deg,#FF6B35,rgba(168,85,247,.5),transparent)' }} />
          {/* Corner TL */}
          <div className="absolute top-0 left-0 w-5 h-5"
            style={{ borderTop:'1px solid #FF6B35', borderLeft:'1px solid #FF6B35' }} />
          {/* Corner BR */}
          <div className="absolute bottom-0 right-0 w-5 h-5"
            style={{ borderBottom:'1px solid rgba(168,85,247,.4)', borderRight:'1px solid rgba(168,85,247,.4)' }} />

          <div className="px-5 py-5">
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">🍪</span>
              <span className="text-[10px] font-bold tracking-[.32em] uppercase text-[#FF6B35]" style={syne}>
                Cookie Preferences
              </span>
            </div>

            {/* Body */}
            <p className="text-[12px] font-light text-[#F0EAD6]/55 leading-[1.7] mb-4" style={dmSans}>
              We use cookies to personalise your experience and understand how you use Nimo Labs.
              You can customise your preferences or{' '}
              <Link to="/privacy" className="text-[#FF6B35] no-underline hover:underline">read our policy</Link>.
            </p>

            {/* Expandable preferences */}
            {expanded && (
              <div className="mb-4 space-y-3 border-t border-white/[.07] pt-4">
                {[
                  { key:'analytics', label:'Analytics Cookies', desc:'Help us understand how visitors use the site (Plausible — privacy-first, no personal data).', locked:false },
                  { key:'marketing', label:'Marketing Cookies', desc:'Used to personalise ads on external platforms. Disabled by default.', locked:false },
                  { key:'essential', label:'Essential Cookies',  desc:'Required for the site to function. Cannot be disabled.', locked:true  },
                ].map(pref => (
                  <div key={pref.key} className="flex items-start gap-3">
                    {/* Toggle */}
                    <button
                      disabled={pref.locked}
                      onClick={() => !pref.locked && setPrefs(p => ({ ...p, [pref.key]: !p[pref.key] }))}
                      className="relative flex-shrink-0 mt-0.5 w-9 h-5 border-none cursor-pointer transition-all duration-300"
                      style={{
                        background: pref.locked || (prefs[pref.key] ?? true)
                          ? '#FF6B35'
                          : 'rgba(255,255,255,.1)',
                        opacity: pref.locked ? 0.5 : 1,
                        cursor: pref.locked ? 'not-allowed' : 'pointer',
                        borderRadius: 99,
                        padding: 0,
                      }}
                    >
                      <div style={{
                        position:'absolute', top:3, left:3,
                        width:14, height:14,
                        background:'white',
                        borderRadius:'50%',
                        transition:'transform .25s ease',
                        transform: pref.locked || (prefs[pref.key] ?? true) ? 'translateX(16px)' : 'none',
                      }} />
                    </button>
                    <div>
                      <div className="text-[10px] font-bold text-[#F0EAD6]/80 mb-0.5" style={syne}>{pref.label}</div>
                      <div className="text-[10px] font-light text-[#F0EAD6]/38 leading-[1.6]" style={dmSans}>{pref.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => dismiss(true)}
                className="text-[9px] font-bold tracking-[.28em] uppercase text-[#050508] border-none cursor-pointer px-5 py-2.5 flex-1 transition-all duration-200 hover:brightness-110"
                style={{ ...syne, background:'#FF6B35', boxShadow:'0 0 16px rgba(255,107,53,.3)' }}
              >
                Accept All
              </button>

              <button
                onClick={() => dismiss(false)}
                className="text-[9px] font-semibold tracking-[.28em] uppercase border cursor-pointer px-4 py-2.5 transition-all duration-200"
                style={{
                  ...syne,
                  color:'rgba(240,234,214,.5)',
                  borderColor:'rgba(255,255,255,.12)',
                  background:'transparent',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(255,255,255,.28)'; e.currentTarget.style.color='rgba(240,234,214,.75)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(255,255,255,.12)'; e.currentTarget.style.color='rgba(240,234,214,.5)' }}
              >
                Decline
              </button>

              <button
                onClick={() => setExpanded(e => !e)}
                className="text-[9px] font-semibold tracking-[.28em] uppercase border cursor-pointer px-4 py-2.5 transition-all duration-200"
                style={{
                  ...syne,
                  color:'rgba(0,245,255,.7)',
                  borderColor:'rgba(0,245,255,.22)',
                  background:'rgba(0,245,255,.04)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(0,245,255,.1)' }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(0,245,255,.04)' }}
              >
                {expanded ? 'Hide ↑' : 'Manage ↓'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
