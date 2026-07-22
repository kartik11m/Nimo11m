import { forwardRef } from 'react'
import EditableText from './EditableText'

/**
 * AnimatedTextCard
 * Rendered absolutely inside the right panel of ScrollVideoSection.
 * All animation (opacity, y, filter, card-rule scaleX) is driven externally
 * by GSAP in ScrollVideoSection — this component just provides the DOM.
 */
const AnimatedTextCard2 = forwardRef(function AnimatedTextCard({ data, staticMode = false, inline = false }, ref) {
  // Ensure data.id is used correctly - it should be 0, 1, 2, 3
  const sectionId = data?.id ?? 0
  
  // Debug logging
  if (process.env.NODE_ENV !== 'production') {
    console.log(`AnimatedTextCard rendered with sectionId: ${sectionId}, data:`, data)
  }

  const wrapperClassName = staticMode || inline
    ? 'relative w-full flex flex-col justify-center opacity-100 px-4 py-10 sm:px-0'
    : 'absolute inset-y-0 left-10 right-14 flex flex-col justify-center opacity-0'

  return (
    <div
      ref={ref}
      data-chapter={sectionId}
      className={wrapperClassName}
      style={{ willChange: 'transform, opacity, filter' }}
    >
      {/* Ghost chapter number */}
      <span
        className="font-display text-[5rem] leading-none -mb-3 tracking-[-0.01em] select-none"
        aria-hidden="true"
      >
        <EditableText
          contentId={`section-${sectionId}.chapter-number`}
          textColor="rgba(255,255,255,.05)"
        >
          {data.num}
        </EditableText>
      </span>

      {/* Chapter badge */}
      <div
        className="font-condensed font-light text-[.7rem] tracking-[.45em] uppercase px-3 py-1 self-start mb-4 border"
        style={{
          color: data.accent,
          borderColor: `rgba(${data.rgb},.3)`,
          background: `rgba(${data.rgb},.07)`,
        }}
      >
        <EditableText
          contentId={`section-${sectionId}.chapter-label`}
          textColor={data.accent}
        >
          {data.chapter}
        </EditableText>
      </div>

      {/* Heading */}
      <h2
        className="font-display leading-[.9] tracking-[.025em] mb-5"
        style={{ fontSize: 'clamp(2.8rem, 4.5vw, 5rem)' }}
      >
        <span className="block text-white">
          <EditableText
            contentId={`section-${sectionId}.title`}
            textColor="rgba(255,255,255,1)"
          >
            {data.title}
          </EditableText>
        </span>
        <span className="block" style={{ color: data.accent }}>
          <EditableText
            contentId={`section-${sectionId}.title-accent`}
            textColor={data.accent}
          >
            {data.titleAccent}
          </EditableText>
        </span>
      </h2>

      {/* Subtitle */}
      <p className="font-condensed font-light text-[.95rem] tracking-[.12em] uppercase text-white/50 mb-5">
        <EditableText
          contentId={`section-${sectionId}.subtitle`}
          textColor="rgba(255,255,255,.5)"
        >
          {data.subtitle}
        </EditableText>
      </p>

      {/* Animated rule — GSAP drives scaleX 0 → 1 */}
      <div
        className="card-rule w-14 h-[1.5px] mb-6 origin-left"
        style={{ background: `linear-gradient(to right, ${data.accent}, rgba(${data.rgb},.4))` }}
      />

      {/* Body copy */}
      <p className="font-light text-[.9rem] leading-[1.85] text-white/45 max-w-[33ch]">
        <EditableText
          contentId={`section-${sectionId}.body`}
          textColor="rgba(255,255,255,.45)"
        >
          {data.body}
        </EditableText>
      </p>
    </div>
  )
})

export default AnimatedTextCard2
