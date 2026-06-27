import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useOwnerAuth } from '../context/OwnerAuthContext'

const bebasNeue = { fontFamily: "'Bebas Neue', sans-serif" }
const syne      = { fontFamily: "'Syne', sans-serif" }
const dmSans    = { fontFamily: "'DM Sans', sans-serif" }

// ── Nimo Images Pool ──────────────────────────────────────────────
const nimoImages = [
  '/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.01 PM.jpeg',
  '/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.01 PM (1).jpeg',
  '/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.01 PM (2).jpeg',
  '/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.11 PM.jpeg',
  '/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.12 PM.jpeg',
  '/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.12 PM (1).jpeg',
  '/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.15 PM.jpeg',
  '/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.15 PM (1).jpeg',
  '/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.25 PM.jpeg',
  '/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.27 PM.jpeg',
  '/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.27 PM (1).jpeg',
  '/Nimo-images/WhatsApp Image 2026-06-05 at 9.17.28 PM.jpeg',
]

const getImageForPost = (id) => nimoImages[(id - 1) % nimoImages.length]

// ── DATA ──────────────────────────────────────────────────────────
const fallbackPosts = [
  {
    id: 1,
    tag: 'Tutorial',
    category: 'Hardware',
    title: 'Building a PID Controller on Arduino From Absolute Zero',
    excerpt:
      'PID looks scary on paper. We break it down with real code, an oscilloscope trace, and a motor that actually behaves. No maths degree required.',
    date: 'May 14, 2025',
    readTime: '8 min',
    color: '#FF6B35',
    rgb: '255,107,53',
    featured: true,
    img: getImageForPost(1),
  },
  {
    id: 2,
    tag: 'Deep Dive',
    category: 'IoT',
    title: 'ESP-NOW vs MQTT: Which Protocol Wins for Your Robot?',
    excerpt:
      'We ran both protocols on identical hardware and measured latency, range, and reliability. The results might surprise you.',
    date: 'May 8, 2025',
    readTime: '6 min',
    color: '#00F5FF',
    rgb: '0,245,255',
    featured: false,
    img: getImageForPost(2),
  },
  {
    id: 3,
    tag: 'Project',
    category: 'Edge AI',
    title: 'Running TFLite Object Detection at 30fps on a Raspberry Pi 4',
    excerpt:
      'Step-by-step: quantize a MobileNet model, deploy it on RPi, and stream live inference video. All offline, zero cloud.',
    date: 'April 29, 2025',
    readTime: '11 min',
    color: '#A855F7',
    rgb: '168,85,247',
    featured: false,
    img: getImageForPost(3),
  },
  {
    id: 4,
    tag: 'Guide',
    category: 'PCB',
    title: "Your First PCB in KiCad: Schematic to Gerber in One Afternoon",
    excerpt:
      'A practical walkthrough that skips the theory and gets you to a manufacturable board as fast as possible.',
    date: 'April 21, 2025',
    readTime: '9 min',
    color: '#FF006E',
    rgb: '255,0,110',
    featured: false,
    img: getImageForPost(4),
  },
]

// ── Tag badge ──────────────────────────────────────────────────────
function TagBadge({ tag, color, rgb }) {
  return (
    <div
      className="inline-flex items-center gap-1.5 px-2.5 py-[5px] border"
      style={{
        background:  `rgba(${rgb},.08)`,
        borderColor: `rgba(${rgb},.28)`,
      }}
    >
      <span className="w-[5px] h-[5px] rounded-full" style={{ background: color }} />
      <span className="text-[7px] font-bold tracking-[.38em] uppercase"
        style={{ ...syne, color }}>{tag}</span>
    </div>
  )
}

// ── Featured (large) card ──────────────────────────────────────────
function FeaturedCard({ post }) {
  const [hov, setHov] = useState(false)

  return (
    <Link
      to={`/blog/${post.id}`}
      className="relative flex flex-col overflow-hidden no-underline h-full"
      style={{
        background:  hov ? 'rgba(255,255,255,.04)' : 'rgba(255,255,255,.025)',
        border:      `1px solid ${hov ? `rgba(${post.rgb},.5)` : 'rgba(255,255,255,.07)'}`,
        boxShadow:   hov ? `0 0 50px rgba(${post.rgb},.15), 0 28px 56px rgba(0,0,0,.55)` : 'none',
        transform:   hov ? 'translateY(-5px)' : 'none',
        transition:  'all .5s cubic-bezier(.23,1,.32,1)',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] z-10" style={{
        background: post.color,
        transform: hov ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: 'left',
        transition: 'transform .5s ease',
      }} />
      {/* Corner TL */}
      <div className="absolute top-0 left-0 w-6 h-6 z-10" style={{
        borderTop: `1px solid ${post.color}`, borderLeft: `1px solid ${post.color}`,
        opacity: hov ? 1 : 0, transition: 'opacity .3s ease',
      }} />
      {/* Corner BR */}
      <div className="absolute bottom-0 right-0 w-6 h-6 z-10" style={{
        borderBottom: 'rgba(168,85,247,.4) 1px solid',
        borderRight: 'rgba(168,85,247,.4) 1px solid',
        opacity: hov ? 1 : 0, transition: 'opacity .3s ease',
      }} />

      {/* Thumbnail */}
      <div className="relative overflow-hidden flex-shrink-0" style={{ height: 240 }}>
        <img
          src={post.img}
          alt={post.title}
          className="w-full h-full object-cover"
          style={{
            transform: hov ? 'scale(1.06)' : 'scale(1)',
            transition: 'transform .6s cubic-bezier(.23,1,.32,1)',
          }}
        />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: hov
            ? 'linear-gradient(to top,rgba(5,5,8,.92) 0%,transparent 55%)'
            : 'linear-gradient(to top,rgba(5,5,8,.96) 0%,rgba(5,5,8,.35) 100%)',
          transition: 'background .4s ease',
        }} />
        {/* Featured label */}
        <div className="absolute top-4 left-4 z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-[5px]"
            style={{ background: 'rgba(5,5,8,.8)', border: `1px solid rgba(${post.rgb},.35)` }}>
            <span className="w-1 h-1 rounded-full animate-pulse" style={{ background: post.color }} />
            <span className="text-[7px] font-bold tracking-[.38em] uppercase"
              style={{ ...syne, color: post.color }}>Featured</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-7">
        <div className="flex items-center gap-3 mb-4">
          <TagBadge tag={post.tag} color={post.color} rgb={post.rgb} />
          <span className="text-[8px] font-bold tracking-[.3em] uppercase text-[#F0EAD6]/[.25]" style={syne}>
            {post.category}
          </span>
        </div>

        <h2 className="mb-3 leading-[1.1] text-[#F0EAD6]/90" style={{
          ...bebasNeue,
          fontSize: 'clamp(22px,2.5vw,32px)',
          color: hov ? post.color : '#F0EAD6',
          transition: 'color .35s ease',
        }}>
          {post.title}
        </h2>

        <div className="w-8 h-px mb-4"
          style={{ background: `linear-gradient(90deg,${post.color},transparent)` }} />

        <p className="text-[13px] font-light text-[#F0EAD6]/50 leading-[1.8] flex-1 mb-5" style={dmSans}>
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-white/[.055]">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-light text-[#F0EAD6]/30 tracking-[.04em]" style={dmSans}>
              {post.date}
            </span>
            <span className="w-px h-3 bg-white/[.15]" />
            <span className="text-[10px] font-light text-[#F0EAD6]/30 tracking-[.04em]" style={dmSans}>
              {post.readTime} read
            </span>
          </div>
          <span
            className="text-[9px] font-bold tracking-[.28em] uppercase transition-all duration-300"
            style={{
              ...syne,
              color: hov ? post.color : 'rgba(240,234,214,.35)',
            }}
          >
            Read →
          </span>
        </div>
      </div>
    </Link>
  )
}

// ── Mini card ──────────────────────────────────────────────────────
function MiniCard({ post }) {
  const [hov, setHov] = useState(false)

  return (
    <Link
      to={`/blog/${post.id}`}
      className="relative flex gap-5 overflow-hidden p-5 no-underline group"
      style={{
        background:  hov ? 'rgba(255,255,255,.04)' : 'rgba(255,255,255,.02)',
        border:      `1px solid ${hov ? `rgba(${post.rgb},.45)` : 'rgba(255,255,255,.06)'}`,
        transform:   hov ? 'translateX(4px)' : 'none',
        transition:  'all .4s cubic-bezier(.23,1,.32,1)',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Left color bar */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] transition-all duration-300"
        style={{
          background: post.color,
          opacity: hov ? 1 : 0.3,
          boxShadow: hov ? `0 0 10px rgba(${post.rgb},.5)` : 'none',
        }} />

      {/* Thumbnail */}
      <div className="relative overflow-hidden flex-shrink-0 w-[80px] h-[64px]">
        <img
          src={post.img}
          alt={post.title}
          className="w-full h-full object-cover"
          style={{
            transform: hov ? 'scale(1.08)' : 'scale(1)',
            transition: 'transform .5s ease',
          }}
        />
        <div className="absolute inset-0" style={{
          background: `rgba(${post.rgb},.12)`,
          opacity: hov ? 1 : 0,
          transition: 'opacity .3s ease',
        }} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[7px] font-bold tracking-[.35em] uppercase"
            style={{ ...syne, color: post.color }}>{post.tag}</span>
          <span className="w-px h-2.5 bg-white/[.12]" />
          <span className="text-[7px] font-light text-[#F0EAD6]/25 tracking-[.04em]" style={dmSans}>
            {post.readTime}
          </span>
        </div>

        <h3
          className="text-[13px] font-bold leading-[1.3] mb-1 line-clamp-2"
          style={{
            ...syne,
            color: hov ? post.color : 'rgba(240,234,214,.8)',
            transition: 'color .3s ease',
          }}
        >
          {post.title}
        </h3>

        <span className="text-[9px] font-light text-[#F0EAD6]/25 tracking-[.03em]" style={dmSans}>
          {post.date}
        </span>
      </div>
    </Link>
  )
}

// ── MAIN EXPORT ───────────────────────────────────────────────────
export default function BlogPreview() {
  const { getCards } = useOwnerAuth()
  const [posts, setPosts] = useState(fallbackPosts)
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!email.trim()) {
      setStatus('error')
      setMessage('Please enter your email address.')
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Subscription failed.')
      }

      setStatus('success')
      setMessage(data.message || 'You’re subscribed!')
      setEmail('')
    } catch (error) {
      setStatus('error')
      setMessage(error.message || 'Something went wrong. Please try again.')
    }
  }

  useEffect(() => {
    let active = true

    const loadPosts = async () => {
      try {
        const cards = await getCards('blog', 'explore')
        const mapped = (cards || [])
          .filter((card) => card?.data)
          .map((card, index) => {
            const data = card.data || {}
            return {
              id: card._id || index + 1,
              tag: data.tag || 'Tutorial',
              category: data.category || data.cat || 'General',
              title: data.title || 'Untitled article',
              excerpt: data.excerpt || data.description || 'A fresh article from the lab.',
              date: data.date || 'Recently updated',
              readTime: data.readTime || '5 min',
              color: data.color || '#FF6B35',
              rgb: data.rgb || '255,107,53',
              featured: Boolean(data.featured),
              img: data.img || data.src || getImageForPost(index + 1),
            }
          })

        if (active && mapped.length > 0) {
          setPosts(mapped)
        }
      } catch (error) {
        console.error('Error loading blog preview:', error)
      } finally {
        if (active) setLoadingPosts(false)
      }
    }

    loadPosts()
    return () => { active = false }
  }, [getCards])

  const featured  = posts.find((p) => p.featured) || posts[0]
  const secondary = posts.filter((p) => !p.featured)

  return (
    <section className="relative overflow-hidden py-[84px] bg-[#050508] border-y border-white/[.055]">

      {/* ── Atmosphere ── */}
      <div className="absolute -top-[100px] -right-[60px] w-[500px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse,rgba(255,107,53,.1) 0%,transparent 70%)' }} />
      <div className="absolute -bottom-[80px] -left-[40px] w-[440px] h-[360px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(ellipse,rgba(168,85,247,.09) 0%,transparent 70%)' }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(0,0,0,.055) 3px,rgba(0,0,0,.055) 4px)',
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,107,53,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,107,53,.02) 1px,transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      <div className="relative z-[2] max-w-[1100px] mx-auto px-12">

        {/* ── Header ── */}
        <div className="flex items-end justify-between gap-8 flex-wrap mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-[7px] bg-[#FF6B35]/[.07] border border-[#FF6B35]/[.22] mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse" />
              <span className="text-[9px] font-bold tracking-[.42em] uppercase text-[#FF6B35]" style={syne}>
                From The Lab
              </span>
            </div>
            <div>
              <span className="block leading-[.9] tracking-[-0.01em]" style={{
                ...bebasNeue,
                fontSize: 'clamp(38px,6vw,68px)',
                WebkitTextStroke: '1px rgba(240,234,214,.35)',
                color: 'transparent',
              }}>BLOG &</span>
              <span className="block leading-[.9] tracking-[-0.01em] text-[#FF6B35]" style={{
                ...bebasNeue,
                fontSize: 'clamp(38px,6vw,68px)',
                textShadow: '0 0 40px rgba(255,107,53,.35)',
              }}>TUTORIALS</span>
              <span className="block mt-1.5 font-bold tracking-[.18em] uppercase text-[#00F5FF]"
                style={{ ...syne, fontSize: 'clamp(9px,1.2vw,13px)' }}>
                Guides · Projects · Deep Dives
              </span>
            </div>
            <div className="w-14 h-px mt-5"
              style={{ background: 'linear-gradient(90deg,#FF6B35,transparent)' }} />
          </div>

          <Link
            to="/blog"
            className="text-[9px] font-bold tracking-[.32em] uppercase text-[#F0EAD6]/50 bg-white/[.03] border border-white/10 px-6 py-2.5 no-underline hover:border-[#FF6B35] hover:text-[#FF6B35] hover:bg-[#FF6B35]/[.06] transition-all duration-300 inline-block self-end"
            style={syne}
          >
            View All Posts →
          </Link>
        </div>

        {/* ── Magazine layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-5 mb-10">

          {/* Featured left */}
          <div className="h-full">
            <FeaturedCard post={featured} />
          </div>

          {/* Mini stack right */}
          <div className="flex flex-col gap-3">
            {loadingPosts && posts.length === fallbackPosts.length ? (
              <div className="rounded border border-white/[.08] bg-white/[.02] px-4 py-4 text-[11px] text-[#F0EAD6]/45">
                Loading latest posts…
              </div>
            ) : (
              secondary.map((post) => (
                <MiniCard key={post.id} post={post} />
              ))
            )}

            {/* Newsletter mini CTA */}
            <div className="relative overflow-hidden p-5 mt-auto"
              style={{ background: 'rgba(255,107,53,.04)', border: '1px solid rgba(255,107,53,.18)' }}>
              <div className="absolute top-0 left-0 right-0 h-[1.5px]"
                style={{ background: 'linear-gradient(90deg,#FF6B35,transparent)' }} />
              <div className="absolute top-0 left-0 w-4 h-4"
                style={{ borderTop: '1px solid #FF6B35', borderLeft: '1px solid #FF6B35' }} />
              <div className="text-[8px] font-bold tracking-[.38em] uppercase text-[#FF6B35] mb-2" style={syne}>
                Get new posts first
              </div>
              <p className="text-[11px] font-light text-[#F0EAD6]/40 mb-3 leading-[1.65]" style={dmSans}>
                Tutorials, project walkthroughs, and lab updates — straight to your inbox.
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <div className="flex gap-0">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (status !== 'idle') setStatus('idle')
                    }}
                    placeholder="your@email.com"
                    className="flex-1 bg-white/[.03] border border-white/[.09] border-r-0 px-3 py-2 text-[#F0EAD6] text-[11px] outline-none focus:border-[#FF6B35]/50 placeholder:text-[#F0EAD6]/20 transition-colors"
                    style={dmSans}
                  />
                  <button
                    type="submit"
                    className="text-[8px] font-bold tracking-[.28em] uppercase text-white bg-[#FF6B35] px-4 py-2 border-none cursor-pointer transition-all hover:bg-[#ff8040]"
                    style={syne}
                  >
                    {status === 'loading' ? 'Wait' : 'Sub'}
                  </button>
                </div>
                {message ? (
                  <div
                    className="rounded border px-2.5 py-2 text-[10px]"
                    style={{
                      background: status === 'success' ? 'rgba(124,255,178,0.12)' : 'rgba(255,155,123,0.12)',
                      borderColor: status === 'success' ? 'rgba(124,255,178,0.25)' : 'rgba(255,155,123,0.25)',
                      color: status === 'success' ? '#7CFFB2' : '#ff9b7b',
                      animation: 'fadeInUp 0.35s ease-out',
                    }}
                  >
                    {message}
                  </div>
                ) : null}
              </form>
            </div>
          </div>
        </div>

        {/* ── Category ticker ── */}
        <div className="border-t border-white/[.055] pt-7">
          <div className="h-[1.5px] mb-5"
            style={{ background: 'linear-gradient(90deg,#FF6B35,rgba(168,85,247,.5),transparent)' }} />
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[7px] font-bold tracking-[.42em] uppercase text-[#F0EAD6]/[.22] mr-2" style={syne}>
              Topics
            </span>
            {[
              { label: 'Arduino',       color: '#FF6B35', rgb: '255,107,53'  },
              { label: 'ESP32 & IoT',   color: '#00F5FF', rgb: '0,245,255'   },
              { label: 'ROS2',          color: '#A855F7', rgb: '168,85,247'  },
              { label: 'Edge AI',       color: '#FF006E', rgb: '255,0,110'   },
              { label: 'PCB Design',    color: '#FF6B35', rgb: '255,107,53'  },
              { label: 'Python',        color: '#00F5FF', rgb: '0,245,255'   },
              { label: 'Project Builds',color: '#A855F7', rgb: '168,85,247'  },
            ].map((cat) => (
              <Link
                key={cat.label}
                to="/blog"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border no-underline transition-all duration-200 hover:-translate-y-px"
                style={{
                  background:  `rgba(${cat.rgb},.06)`,
                  borderColor: `rgba(${cat.rgb},.22)`,
                  ...syne,
                  fontSize: '8px',
                  fontWeight: 700,
                  letterSpacing: '.3em',
                  textTransform: 'uppercase',
                  color: cat.color,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `rgba(${cat.rgb},.14)`
                  e.currentTarget.style.boxShadow = `0 0 14px rgba(${cat.rgb},.2)`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `rgba(${cat.rgb},.06)`
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <span className="w-1 h-1 rounded-full" style={{ background: cat.color }} />
                {cat.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
