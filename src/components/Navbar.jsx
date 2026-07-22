import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useOwnerAuth } from '../context/OwnerAuthContext'

const links = [
  { label: 'About',    to: '/about'    },
  { label: 'Robots',   to: '/robots'    },
  { label: 'Training', to: '/training'  },
  { label: 'Events',   to: '/events'    },
  { label: 'Achievements', to: '/achievement'},
  { label: 'Explore',  to: '/lab-setup'   },
  { label: 'Competitions', to: '/competitions'}
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const { isOwner, logout } = useOwnerAuth()

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between
      px-10 py-[18px] backdrop-blur-lg"
      style={{ background: 'linear-gradient(to bottom,rgba(2,4,8,.95),transparent)' }}>

      {/* Logo */}
      <Link to="/" className="font-mono text-sm font-bold tracking-[4px] uppercase text-white">
        Nimo<span className="text-cyan">.</span>Labs
      </Link>

      {/* Desktop links */}
      <ul className="hidden md:flex gap-7 list-none">
        {links.map(l => (
          <li key={l.label}>
            <Link to={l.to}
              className={`text-[11px] tracking-[2px] uppercase transition-colors duration-300 no-underline
                ${pathname === l.to ? 'text-cyan' : 'text-white/50 hover:text-cyan'}`}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Book button + Owner button */}
      <div className="hidden md:flex gap-4 items-center">
        <Link to="/book"
          className="font-mono text-[10px] tracking-[3px] uppercase
            border border-cyan/40 text-cyan px-5 py-2.5 no-underline
            hover:bg-cyan hover:text-bg transition-all duration-300">
          Book Now
        </Link>
        {isOwner ? (
          <button onClick={logout}
            className="font-mono text-[10px] tracking-[3px] uppercase
              border border-[#FF6B35]/40 text-[#FF6B35] px-5 py-2.5
              hover:bg-[#FF6B35] hover:text-bg transition-all duration-300 bg-transparent cursor-pointer">
            Logout
          </button>
        ) : (
          <Link to="/owner-login" state={{ fromInternalNav: true }}
            className="font-mono text-[10px] tracking-[3px] uppercase
              border border-[#FF6B35]/40 text-[#FF6B35] px-5 py-2.5 no-underline
              hover:bg-[#FF6B35] hover:text-bg transition-all duration-300">
            Owner Login
          </Link>
        )}
      </div>

      {/* Mobile hamburger */}
      <button className="md:hidden flex flex-col gap-[5px] cursor-pointer bg-transparent border-none p-0"
        onClick={() => setOpen(!open)}>
        <span className={`block w-6 h-[1.5px] bg-white/70 transition-all duration-300
          ${open ? 'rotate-45 translate-y-[6.5px]' : ''}`} />
        <span className={`block w-6 h-[1.5px] bg-white/70 transition-all duration-300
          ${open ? 'opacity-0' : ''}`} />
        <span className={`block w-6 h-[1.5px] bg-white/70 transition-all duration-300
          ${open ? '-rotate-45 -translate-y-[6.5px]' : ''}`} />
      </button>

      {/* Mobile menu */}
      {open && (
        <div className="absolute top-full left-0 right-0 bg-bg/95 backdrop-blur-xl
          border-t border-cyan/10 flex flex-col p-6 gap-4 md:hidden">
          {links.map(l => (
            <Link key={l.label} to={l.to} onClick={() => setOpen(false)}
              className="text-[11px] tracking-[3px] uppercase text-white/60
                hover:text-cyan transition-colors duration-300 no-underline">
              {l.label}
            </Link>
          ))}
          <Link to="/book" onClick={() => setOpen(false)}
            className="mt-2 font-mono text-[10px] tracking-[3px] uppercase
              border border-cyan/40 text-cyan px-5 py-2.5 text-center no-underline
              hover:bg-cyan hover:text-bg transition-all duration-300">
            Book Now
          </Link>
        </div>
      )}
    </nav>
  )
}
