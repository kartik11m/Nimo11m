import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

const bebasNeue = { fontFamily: "'Bebas Neue', sans-serif" }
const syne      = { fontFamily: "'Syne', sans-serif" }
const dmSans    = { fontFamily: "'DM Sans', sans-serif" }

const quickLinks = [
  { label: 'Home',     to: '/',         color: '#FF6B35', rgb: '255,107,53'  },
  { label: 'Robots',   to: '/robots',   color: '#00F5FF', rgb: '0,245,255'   },
  { label: 'Training', to: '/training', color: '#A855F7', rgb: '168,85,247'  },
  { label: 'Book',     to: '/book',     color: '#FF006E', rgb: '255,0,110'   },
]

export default function NotFoundPage() {
  const navigate            = useNavigate()
  const [countdown, setCountdown] = useState(10)

  useEffect(() => {
    const iv = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(iv); navigate('/'); return 0 }
        return c - 1
      })
    }, 1000)
    return () => clearInterval(iv)
  }, [navigate])

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050508] text-[#F0EAD6] px-12">

      {/* Atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse,rgba(255,107,53,.1) 0%,transparent 70%)' }} />
      <div className="absolute -bottom-[80px] -right-[40px] w-[440px] h-[360px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse,rgba(168,85,247,.1) 0%,transparent 70%)' }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(0,0,0,.055) 3px,rgba(0,0,0,.055) 4px)',
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,107,53,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,107,53,.022) 1px,transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      <div className="relative z-[2] text-center max-w-[600px]">

        {/* Giant 404 */}
        <div className="relative mb-4">
          <span
            className="block leading-none tracking-[-0.04em] select-none"
            style={{
              ...bebasNeue,
              fontSize: 'clamp(120px,22vw,220px)',
              WebkitTextStroke: '2px rgba(255,107,53,.2)',
              color: 'transparent',
            }}
          >
            404
          </span>
          {/* Overlay tinted */}
          <span
            className="absolute inset-0 flex items-center justify-center leading-none tracking-[-0.04em] select-none"
            style={{
              ...bebasNeue,
              fontSize: 'clamp(120px,22vw,220px)',
              color: 'rgba(255,107,53,.07)',
            }}
          >
            404
          </span>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-[7px] bg-[#FF6B35]/[.07] border border-[#FF6B35]/[.22] mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse" />
          <span className="text-[9px] font-bold tracking-[.42em] uppercase text-[#FF6B35]" style={syne}>
            Signal Lost
          </span>
        </div>

        <h1 className="leading-[.9] mb-3" style={{
          ...bebasNeue, fontSize: 'clamp(32px,5vw,52px)',
          WebkitTextStroke: '1px rgba(240,234,214,.35)', color: 'transparent',
        }}>
          PAGE NOT
        </h1>
        <h1 className="leading-[.9] mb-5 text-[#FF6B35]" style={{
          ...bebasNeue, fontSize: 'clamp(32px,5vw,52px)',
          textShadow: '0 0 30px rgba(255,107,53,.38)',
        }}>
          FOUND
        </h1>

        <div className="w-14 h-px mx-auto mb-6"
          style={{ background: 'linear-gradient(90deg,transparent,#FF6B35,transparent)' }} />

        <p className="font-light text-[#F0EAD6]/45 mb-2 leading-[1.8]"
          style={{ ...dmSans, fontSize: 'clamp(13px,1.3vw,15px)' }}>
          This page doesn't exist — or has been moved. Redirecting you to home in{' '}
          <span style={{ color: '#FF6B35', fontWeight: 700 }}>{countdown}</span>s.
        </p>

        {/* Countdown bar */}
        <div className="w-48 h-px mx-auto mb-8 overflow-hidden bg-white/[.07]">
          <div
            className="h-full"
            style={{
              width: `${(countdown / 10) * 100}%`,
              background: 'linear-gradient(90deg,#FF6B35,rgba(255,107,53,.4))',
              transition: 'width 1s linear',
            }}
          />
        </div>

        {/* Quick links */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {quickLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="text-[9px] font-bold tracking-[.3em] uppercase no-underline border px-5 py-2.5 transition-all duration-200 hover:-translate-y-px"
              style={{
                ...syne,
                background:   `rgba(${link.rgb},.06)`,
                borderColor:  `rgba(${link.rgb},.25)`,
                color:         link.color,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = `rgba(${link.rgb},.14)`
                e.currentTarget.style.boxShadow  = `0 0 16px rgba(${link.rgb},.22)`
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = `rgba(${link.rgb},.06)`
                e.currentTarget.style.boxShadow  = 'none'
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
