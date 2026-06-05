import { forwardRef } from 'react'

/**
 * AnimatedTextCard
 * Rendered absolutely inside the right panel of ScrollVideoSection.
 * All animation (opacity, y, filter, card-rule scaleX) is driven externally
 * by GSAP in ScrollVideoSection — this component just provides the DOM.
 */
const AnimatedTextCard = forwardRef(function AnimatedTextCard({ data }, ref) {
  return (
    <div
      ref={ref}
      /* opacity-0 is the resting state; GSAP animates it in */
      className="absolute inset-y-0 left-10 right-14 flex flex-col justify-center opacity-0"
      style={{ willChange: 'transform, opacity, filter' }}
    >
      {/* Ghost chapter number */}
      <span
        className="font-display text-[5rem] leading-none text-white/[.05] -mb-3 tracking-[-0.01em] select-none"
        aria-hidden="true"
      >
        {data.num}
      </span>

      {/* Chapter badge */}
      <span
        className="font-condensed font-light text-[.7rem] tracking-[.45em] uppercase px-3 py-1 self-start mb-4 border"
        style={{
          color: data.accent,
          borderColor: `rgba(${data.rgb},.3)`,
          background: `rgba(${data.rgb},.07)`,
        }}
      >
        {data.chapter}
      </span>

      {/* Heading */}
      <h2
        className="font-display leading-[.9] tracking-[.025em] mb-5"
        style={{ fontSize: 'clamp(2.8rem, 4.5vw, 5rem)' }}
      >
        <span className="block text-white">{data.title}</span>
        <span className="block" style={{ color: data.accent }}>{data.titleAccent}</span>
      </h2>

      {/* Subtitle */}
      <p className="font-condensed font-light text-[.95rem] tracking-[.12em] uppercase text-white/50 mb-5">
        {data.subtitle}
      </p>

      {/* Animated rule — GSAP drives scaleX 0 → 1 */}
      <div
        className="card-rule w-14 h-[1.5px] mb-6"
        style={{ background: `linear-gradient(to right, ${data.accent}, rgba(${data.rgb},.4))` }}
      />

      {/* Body copy */}
      <p className="font-light text-[.9rem] leading-[1.85] text-white/45 max-w-[33ch]">
        {data.body}
      </p>
    </div>
  )
})

export default AnimatedTextCard
