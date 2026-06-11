import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'

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

// ── ALL POSTS ─────────────────────────────────────────────────────
const allPosts = [
  {
    id: 1, tag: 'Tutorial',  cat: 'hardware',
    title: 'Building a PID Controller on Arduino From Absolute Zero',
    excerpt: 'PID looks scary on paper. We break it down with real code, an oscilloscope trace, and a motor that actually behaves. No maths degree required.',
    date: 'May 14, 2025', readTime: '8 min', color: '#FF6B35', rgb: '255,107,53',
    img: getImageForPost(1), featured: true,
  },
  {
    id: 2, tag: 'Deep Dive', cat: 'iot',
    title: 'ESP-NOW vs MQTT: Which Protocol Wins for Your Robot?',
    excerpt: 'We ran both protocols on identical hardware and measured latency, range, and reliability. The results might surprise you.',
    date: 'May 8, 2025', readTime: '6 min', color: '#00F5FF', rgb: '0,245,255',
    img: getImageForPost(2), featured: false,
  },
  {
    id: 3, tag: 'Project',   cat: 'ai',
    title: 'Running TFLite Object Detection at 30fps on a Raspberry Pi 4',
    excerpt: 'Step-by-step: quantize a MobileNet model, deploy it on RPi, and stream live inference video. All offline, zero cloud.',
    date: 'April 29, 2025', readTime: '11 min', color: '#A855F7', rgb: '168,85,247',
    img: getImageForPost(3), featured: false,
  },
  {
    id: 4, tag: 'Guide',     cat: 'hardware',
    title: "Your First PCB in KiCad: Schematic to Gerber in One Afternoon",
    excerpt: 'A practical walkthrough that skips the theory and gets you to a manufacturable board as fast as possible.',
    date: 'April 21, 2025', readTime: '9 min', color: '#FF006E', rgb: '255,0,110',
    img: getImageForPost(4), featured: false,
  },
  {
    id: 5, tag: 'Tutorial',  cat: 'robotics',
    title: 'SLAM in 30 Minutes: Mapping a Room with a Raspberry Pi and RPLidar',
    excerpt: 'Set up ROS2, hook up the LiDAR, and watch your robot draw a real-time map of its environment. Fewer steps than you think.',
    date: 'April 12, 2025', readTime: '14 min', color: '#A855F7', rgb: '168,85,247',
    img: getImageForPost(5), featured: false,
  },
  {
    id: 6, tag: 'Explainer', cat: 'hardware',
    title: 'I2C vs SPI vs UART: When to Use Each Protocol on Arduino',
    excerpt: 'Three serial protocols, three use cases, zero confusion. We show real wiring, real code, and when each protocol will save or wreck your project.',
    date: 'April 5, 2025', readTime: '7 min', color: '#FF6B35', rgb: '255,107,53',
    img: getImageForPost(6), featured: false,
  },
  {
    id: 7, tag: 'Project',   cat: 'iot',
    title: 'Building a Smart Lab Monitor with ESP32, DHT22, and Grafana',
    excerpt: 'Temperature, humidity, and CO₂ data streamed to a live Grafana dashboard over MQTT. A weekend build that actually runs in our lab.',
    date: 'March 28, 2025', readTime: '10 min', color: '#00F5FF', rgb: '0,245,255',
    img: getImageForPost(7), featured: false,
  },
  {
    id: 8, tag: 'Guide',     cat: 'ai',
    title: 'Training a Custom Gesture Classifier with TensorFlow and Your Webcam',
    excerpt: 'Collect your own dataset, train in Colab, quantize with TFLite, and deploy to a Pi in an afternoon. Real model, real gestures.',
    date: 'March 20, 2025', readTime: '12 min', color: '#A855F7', rgb: '168,85,247',
    img: getImageForPost(8), featured: false,
  },
  {
    id: 9, tag: 'Deep Dive', cat: 'robotics',
    title: 'ROS2 Node Communication Patterns You Actually Need',
    excerpt: 'Topics, services, actions — most tutorials explain what they are. We explain when to use which, with architecture diagrams from real student projects.',
    date: 'March 10, 2025', readTime: '9 min', color: '#FF6B35', rgb: '255,107,53',
    img: getImageForPost(9), featured: false,
  },
]

const PAGE_SIZE = 6

const filterTabs = [
  { key: 'all',      label: 'All Posts'    },
  { key: 'hardware', label: 'Hardware'     },
  { key: 'iot',      label: 'IoT'          },
  { key: 'robotics', label: 'Robotics'     },
  { key: 'ai',       label: 'AI & Vision'  },
]

// ── Post card ─────────────────────────────────────────────────────
function PostCard({ post, large = false }) {
  const [hov, setHov] = useState(false)

  return (
    <Link
      to={`/blog/${post.id}`}
      className={`relative flex flex-col overflow-hidden no-underline h-full ${large ? '' : ''}`}
      style={{
        background:  hov ? 'rgba(255,255,255,.04)' : 'rgba(255,255,255,.025)',
        border:      `1px solid ${hov ? `rgba(${post.rgb},.5)` : 'rgba(255,255,255,.07)'}`,
        boxShadow:   hov ? `0 0 40px rgba(${post.rgb},.14), 0 24px 48px rgba(0,0,0,.5)` : 'none',
        transform:   hov ? 'translateY(-5px)' : 'none',
        transition:  'all .45s cubic-bezier(.23,1,.32,1)',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] z-10" style={{
        background: post.color, transform: hov ? 'scaleX(1)' : 'scaleX(0)',
        transformOrigin: 'left', transition: 'transform .45s ease',
      }} />
      {/* Corner TL */}
      <div className="absolute top-0 left-0 w-5 h-5 z-10" style={{
        borderTop: `1px solid ${post.color}`, borderLeft: `1px solid ${post.color}`,
        opacity: hov ? 1 : 0, transition: 'opacity .3s ease',
      }} />
      {/* Corner BR */}
      <div className="absolute bottom-0 right-0 w-5 h-5 z-10" style={{
        borderBottom: '1px solid rgba(168,85,247,.38)', borderRight: '1px solid rgba(168,85,247,.38)',
        opacity: hov ? 1 : 0, transition: 'opacity .3s ease',
      }} />

      {/* Thumbnail */}
      <div className="relative overflow-hidden flex-shrink-0" style={{ height: large ? 260 : 180 }}>
        <img src={post.img} alt={post.title}
          className="w-full h-full object-cover"
          style={{ transform: hov ? 'scale(1.06)' : 'scale(1)', transition: 'transform .6s ease' }}
        />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: hov
            ? 'linear-gradient(to top,rgba(5,5,8,.9) 0%,transparent 55%)'
            : 'linear-gradient(to top,rgba(5,5,8,.94) 0%,rgba(5,5,8,.3) 100%)',
          transition: 'background .4s ease',
        }} />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        {/* Tag + read time */}
        <div className="flex items-center gap-3 mb-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-[5px] border"
            style={{ background: `rgba(${post.rgb},.08)`, borderColor: `rgba(${post.rgb},.28)` }}>
            <span className="w-[5px] h-[5px] rounded-full" style={{ background: post.color }} />
            <span className="text-[7px] font-bold tracking-[.38em] uppercase"
              style={{ ...syne, color: post.color }}>{post.tag}</span>
          </div>
          <span className="text-[8px] font-light text-[#F0EAD6]/28 tracking-[.04em]" style={dmSans}>
            {post.readTime} read
          </span>
        </div>

        {/* Title */}
        <h3
          className="leading-[1.15] mb-3 flex-1"
          style={{
            ...syne,
            fontSize: large ? 'clamp(17px,2vw,22px)' : '15px',
            fontWeight: 700,
            color: hov ? post.color : 'rgba(240,234,214,.88)',
            transition: 'color .3s ease',
          }}
        >
          {post.title}
        </h3>

        {large && (
          <p className="text-[12px] font-light text-[#F0EAD6]/45 leading-[1.8] mb-4" style={dmSans}>
            {post.excerpt}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[.055] mt-auto">
          <span className="text-[10px] font-light text-[#F0EAD6]/28 tracking-[.03em]" style={dmSans}>
            {post.date}
          </span>
          <span className="text-[9px] font-bold tracking-[.28em] uppercase transition-colors duration-300"
            style={{ ...syne, color: hov ? post.color : 'rgba(240,234,214,.3)' }}>
            Read →
          </span>
        </div>
      </div>
    </Link>
  )
}

// ── MAIN PAGE ─────────────────────────────────────────────────────
export default function BlogPage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [page,         setPage]         = useState(1)

  const filtered = useMemo(() => {
    const base = activeFilter === 'all' ? allPosts : allPosts.filter(p => p.cat === activeFilter)
    return base
  }, [activeFilter])

  const visible  = filtered.slice(0, page * PAGE_SIZE)
  const hasMore  = visible.length < filtered.length

  const featured = allPosts.find(p => p.featured)
  const rest     = allPosts.filter(p => !p.featured)

  return (
    <main className="bg-[#050508] text-[#F0EAD6] overflow-x-hidden" style={dmSans}>

      {/* ══ HERO ═════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-12 pt-[140px] pb-20 border-b border-white/[.055]">
        <div className="absolute -top-[100px] -left-[60px] w-[520px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse,rgba(255,107,53,.12) 0%,transparent 70%)' }} />
        <div className="absolute -bottom-[80px] -right-[40px] w-[460px] h-[360px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse,rgba(168,85,247,.1) 0%,transparent 70%)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,107,53,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,107,53,.022) 1px,transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(0,0,0,.055) 3px,rgba(0,0,0,.055) 4px)',
        }} />

        <div className="relative z-[2] max-w-[1100px] mx-auto">
          <div className="flex items-end justify-between gap-10 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-[7px] bg-[#FF6B35]/[.07] border border-[#FF6B35]/[.22] mb-[22px]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse" />
                <span className="text-[9px] font-bold tracking-[.4em] uppercase text-[#FF6B35]" style={syne}>
                  From The Lab
                </span>
              </div>
              <div className="mb-5">
                <span className="block leading-[.88]" style={{
                  ...bebasNeue, fontSize: 'clamp(50px,9vw,96px)',
                  WebkitTextStroke: '1px rgba(240,234,214,.35)', color: 'transparent',
                }}>BLOG &</span>
                <span className="block leading-[.88] text-[#FF6B35]" style={{
                  ...bebasNeue, fontSize: 'clamp(50px,9vw,96px)',
                  textShadow: '0 0 50px rgba(255,107,53,.38)',
                }}>TUTORIALS</span>
                <span className="block mt-2 font-bold tracking-[.18em] uppercase text-[#00F5FF]"
                  style={{ ...syne, fontSize: 'clamp(11px,1.5vw,16px)' }}>
                  Guides · Projects · Deep Dives · Explainers
                </span>
              </div>
              <div className="w-14 h-px mb-6" style={{ background: 'linear-gradient(90deg,#FF6B35,transparent)' }} />
              <p className="font-light leading-[1.9] text-[#F0EAD6]/50 max-w-[480px]"
                style={{ ...dmSans, fontSize: 'clamp(13px,1.3vw,15px)' }}>
                Real tutorials written by the same instructors who teach our courses.
                No filler, no ads — just the things that actually help you build.
              </p>
            </div>

            {/* Post count card */}
            <div className="relative bg-white/[.03] border border-white/[.07] p-7 flex-shrink-0">
              <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-[#FF6B35]" />
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-purple-500/50" />
              <div className="absolute top-0 left-0 right-0 h-[1.5px]"
                style={{ background: 'linear-gradient(90deg,#FF6B35,rgba(168,85,247,.4),transparent)' }} />
              <div className="space-y-4">
                {[
                  { num: `${allPosts.length}+`, label: 'Articles Published', color: '#FF6B35' },
                  { num: '4',    label: 'New Posts / Month', color: '#00F5FF' },
                  { num: 'Free', label: 'Always Free to Read', color: '#A855F7' },
                ].map(s => (
                  <div key={s.label}>
                    <div className="text-[8px] font-bold tracking-[.35em] uppercase text-[#F0EAD6]/[.25] mb-0.5" style={syne}>
                      {s.label}
                    </div>
                    <div className="leading-none" style={{ ...bebasNeue, fontSize: '1.6rem', color: s.color }}>
                      {s.num}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ FEATURED POST ════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-12 py-14 border-b border-white/[.055]">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,107,53,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,107,53,.018) 1px,transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        <div className="relative z-[2] max-w-[1100px] mx-auto">
          <div className="flex items-center gap-3 mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse" />
            <span className="text-[8px] font-bold tracking-[.42em] uppercase text-[#FF6B35]" style={syne}>
              Featured Post
            </span>
          </div>
          <div className="max-w-3xl">
            <PostCard post={featured} large />
          </div>
        </div>
      </section>

      {/* ══ FILTER + GRID ════════════════════════════════════════ */}
      <section className="relative overflow-hidden px-12 py-14">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,107,53,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,107,53,.018) 1px,transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(0,0,0,.055) 3px,rgba(0,0,0,.055) 4px)',
        }} />

        <div className="relative z-[2] max-w-[1100px] mx-auto">

          {/* Filter tabs */}
          <div className="flex items-center gap-2 flex-wrap mb-10">
            <span className="text-[8px] font-bold tracking-[.38em] uppercase text-[#F0EAD6]/[.25] mr-2" style={syne}>
              Filter
            </span>
            {filterTabs.map(tab => {
              const active = activeFilter === tab.key
              return (
                <button
                  key={tab.key}
                  onClick={() => { setActiveFilter(tab.key); setPage(1) }}
                  className="text-[9px] font-bold tracking-[.3em] uppercase px-5 py-2 border cursor-pointer transition-all duration-200"
                  style={{
                    ...syne,
                    background:   active ? 'rgba(255,107,53,.08)' : 'transparent',
                    borderColor:  active ? 'rgba(255,107,53,.4)' : 'rgba(255,255,255,.1)',
                    color:        active ? '#FF6B35' : 'rgba(240,234,214,.4)',
                    boxShadow:    active ? '0 0 16px rgba(255,107,53,.15)' : 'none',
                  }}
                >
                  {tab.label}
                </button>
              )
            })}
            <span className="ml-auto text-[10px] font-light text-[#F0EAD6]/25 tracking-[.04em]" style={dmSans}>
              {filtered.length} posts
            </span>
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-[8px] font-bold tracking-[.4em] uppercase text-[#F0EAD6]/[.25] mb-3" style={syne}>
                No posts yet
              </div>
              <p className="text-[13px] font-light text-[#F0EAD6]/35" style={dmSans}>
                Check back soon — we publish 4+ posts a month.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {visible.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {/* Load more */}
          {hasMore && (
            <div className="text-center">
              <button
                onClick={() => setPage(p => p + 1)}
                className="text-[9px] font-bold tracking-[.32em] uppercase border px-8 py-3 transition-all duration-200 cursor-pointer"
                style={{
                  ...syne,
                  borderColor: 'rgba(255,255,255,.12)',
                  color: 'rgba(240,234,214,.45)',
                  background: 'transparent',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = '#FF6B35'
                  e.currentTarget.style.color = '#FF6B35'
                  e.currentTarget.style.background = 'rgba(255,107,53,.06)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,.12)'
                  e.currentTarget.style.color = 'rgba(240,234,214,.45)'
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                Load More Posts ({filtered.length - visible.length} remaining)
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ══ NEWSLETTER CTA ══════════════════════════════════════ */}
      <section className="relative overflow-hidden px-12 py-16 border-t border-white/[.055]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse,rgba(255,107,53,.08) 0%,transparent 70%)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,107,53,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,107,53,.018) 1px,transparent 1px)',
          backgroundSize: '48px 48px',
        }} />

        <div className="relative z-[2] max-w-[1100px] mx-auto">
          <div className="h-[1.5px] mb-10"
            style={{ background: 'linear-gradient(90deg,transparent,#FF6B35,#A855F7,transparent)' }} />
          <div className="flex items-center justify-between gap-10 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-[6px] bg-[#FF6B35]/[.07] border border-[#FF6B35]/[.22] mb-4">
                <span className="w-1 h-1 rounded-full bg-[#FF6B35]" />
                <span className="text-[8px] font-bold tracking-[.42em] uppercase text-[#FF6B35]" style={syne}>
                  Stay Sharp
                </span>
              </div>
              <span className="block leading-[.9]" style={{
                ...bebasNeue, fontSize: 'clamp(28px,4.5vw,52px)',
                WebkitTextStroke: '1px rgba(240,234,214,.35)', color: 'transparent',
              }}>NEW TUTORIALS</span>
              <span className="block leading-[.9] text-[#FF6B35]" style={{
                ...bebasNeue, fontSize: 'clamp(28px,4.5vw,52px)',
                textShadow: '0 0 30px rgba(255,107,53,.35)',
              }}>IN YOUR INBOX</span>
              <div className="w-12 h-px mt-4" style={{ background: 'linear-gradient(90deg,#FF6B35,transparent)' }} />
            </div>
            <div className="flex gap-0 w-full sm:w-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 sm:w-[280px] bg-white/[.03] border border-white/[.09] border-r-0 px-4 py-3.5 text-[#F0EAD6] text-[13px] outline-none focus:border-[#FF6B35]/50 placeholder:text-[#F0EAD6]/20 transition-colors"
                style={dmSans}
              />
              <button
                className="text-[9px] font-bold tracking-[.3em] uppercase text-white bg-[#FF6B35] px-6 py-3.5 border-none cursor-pointer transition-all hover:bg-[#ff8040] hover:shadow-[0_0_20px_rgba(255,107,53,.35)]"
                style={syne}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}
