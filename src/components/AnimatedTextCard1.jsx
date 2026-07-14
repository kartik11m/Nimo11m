import { forwardRef } from 'react'
import EditableText from './EditableText'

/**
 * AnimatedTextCard1
 * Rendered absolutely inside ScrollVideoSection2.
 * All animation (opacity, y, filter, card-rule scaleX) is driven externally
 * by GSAP — this component provides the DOM with editable content.
 */
const AnimatedTextCard1 = forwardRef(function AnimatedTextCard1({ data, staticMode = false, inline = false }, ref) {
  const sectionId = data?.id ?? 0
  console.log(`AnimatedTextCard1 rendered with sectionId: ${sectionId}, data:`, data)

  const wrapperClassName = staticMode || inline
    ? 'relative w-full flex flex-col justify-center opacity-100 px-4 py-10 sm:px-0'
    : 'absolute inset-y-0 right-12 flex flex-col justify-center opacity-0'

  return (
    <div
      ref={ref}
      data-chapter={sectionId}
      className={wrapperClassName}
      style={{ willChange: 'transform, opacity, filter' }}
    >
      {/* Ghost chapter number */}
      <EditableText
        contentId={`${sectionId}.chapter-number`}
        textColor="rgba(255,255,255,.05)"
        className="font-display text-[5rem] leading-none -mb-3 tracking-[-0.01em] select-none block"
        accent={data.accent}
      >
        {data.num}
      </EditableText>

      {/* Chapter badge */}
      <EditableText
        contentId={`${sectionId}.chapter-label`}
        textColor={data.accent}
        className="font-condensed font-light text-[.7rem] tracking-[.45em] uppercase px-3 py-1 self-start mb-4 border inline-block"
        accent={data.accent}
        style={{
          borderColor: `rgba(${data.rgb},.3)`,
          background: `rgba(${data.rgb},.07)`,
        }}
      >
        {data.chapter}
      </EditableText>

      {/* Title Main */}
      <EditableText
        contentId={`${sectionId}.title`}
        textColor="rgba(255,255,255,1)"
        className="font-display leading-[.9] tracking-[.025em] mb-1"
        style={{ fontSize: 'clamp(2.8rem, 4.5vw, 5rem)', display: 'block' }}
        accent={data.accent}
      >
        {data.title}
      </EditableText>

      {/* Title Accent */}
      <EditableText
        contentId={`${sectionId}.title-accent`}
        textColor={data.accent}
        className="font-display leading-[.9] tracking-[.025em] mb-5"
        style={{ fontSize: 'clamp(2.8rem, 4.5vw, 5rem)', display: 'block' }}
        accent={data.accent}
      >
        {data.titleAccent}
      </EditableText>

      {/* Subtitle */}
      <EditableText
        contentId={`${sectionId}.subtitle`}
        textColor="rgba(255,255,255,.5)"
        className="font-condensed font-light text-[.95rem] tracking-[.12em] uppercase mb-5"
        accent={data.accent}
      >
        {data.subtitle}
      </EditableText>

      {/* Animated rule — GSAP drives scaleX 0 → 1 */}
      <div
        className="card-rule w-14 h-[1.5px] mb-6"
        style={{ background: `linear-gradient(to right, ${data.accent}, rgba(${data.rgb},.4))` }}
      />

      {/* Body copy */}
      <EditableText
        contentId={`${sectionId}.body`}
        textColor="rgba(255,255,255,.45)"
        className="font-light text-[.9rem] leading-[1.85] max-w-[33ch]"
        accent={data.accent}
      >
        {data.body}
      </EditableText>
    </div>
  )
})

export default AnimatedTextCard1
