import { Link } from 'react-router-dom'

const bebasNeue = { fontFamily: "'Bebas Neue', sans-serif" }
const syne      = { fontFamily: "'Syne', sans-serif" }
const dmSans    = { fontFamily: "'DM Sans', sans-serif" }

const sections = [
  {
    title: 'Acceptance of Terms',
    color: '#FF6B35', rgb: '255,107,53',
    body: 'By accessing or using the Nimo Labs website (nimolabs.in), registering for a course, attending a workshop, or enrolling in Summer Camp, you agree to be bound by these Terms of Use. If you do not agree, please do not use our services.',
  },
  {
    title: 'Services',
    color: '#00F5FF', rgb: '0,245,255',
    body: 'Nimo Labs provides robotics and technology education through in-person courses, workshop programs, summer camps, and STEM lab infrastructure services for institutions. Course content, schedules, fees, and instructors are subject to change at our discretion with reasonable notice.',
  },
  {
    title: 'Registrations & Payments',
    color: '#A855F7', rgb: '168,85,247',
    body: 'A seat in any program is confirmed only after full payment of the registration fee. Nimo Labs reserves the right to cancel or reschedule programs due to insufficient enrolments, instructor unavailability, or circumstances beyond our control. In such cases, a full refund or equivalent credit will be offered.',
  },
  {
    title: 'Refund Policy',
    color: '#FF006E', rgb: '255,0,110',
    body: 'Refunds for courses and workshops: full refund if cancelled more than 7 days before the program starts; 50% refund between 3–7 days; no refund within 3 days of the start date. Summer Camp: full refund up to 14 days before the start date; 50% refund between 7–14 days; no refund within 7 days. Lab Setup projects: refund terms are governed by the individual project agreement signed at the time of engagement.',
  },
  {
    title: 'Intellectual Property',
    color: '#FF6B35', rgb: '255,107,53',
    body: 'All course materials, curriculum documents, website content, code samples, and project templates provided by Nimo Labs are the intellectual property of Nimo Labs and may not be reproduced, distributed, or used commercially without written permission. Student projects created during programs belong to the students. Nimo Labs may photograph, video, and publish student work for promotional purposes unless a written opt-out is received.',
  },
  {
    title: 'Student Conduct',
    color: '#00F5FF', rgb: '0,245,255',
    body: 'Students are expected to treat instructors, lab equipment, and fellow students with respect. Nimo Labs reserves the right to remove any student from a program without refund for disruptive, harmful, or dishonest behaviour. All lab equipment must be used responsibly; damage caused by negligence may be charged to the responsible party.',
  },
  {
    title: 'Limitation of Liability',
    color: '#A855F7', rgb: '168,85,247',
    body: 'Nimo Labs\' liability for any claim arising from our services is limited to the fees paid for the specific program in question. We are not liable for any indirect, incidental, or consequential damages. Participation in hands-on robotics and electronics sessions carries inherent physical risk; students and guardians acknowledge this risk upon enrolment.',
  },
  {
    title: 'Lab Setup Services',
    color: '#FF006E', rgb: '255,0,110',
    body: 'Lab setup, installation, and training services for institutions are governed by separate project agreements. These Terms of Use apply to the general use of our website and inquiry processes. Specific warranties, timelines, deliverables, and payment terms are set out in the project agreement signed by both parties.',
  },
  {
    title: 'Changes to Terms',
    color: '#FF6B35', rgb: '255,107,53',
    body: 'We may update these Terms of Use from time to time. The current version will always be available at nimolabs.in/terms with the effective date shown at the top. Continued use of our services after any update constitutes acceptance of the revised terms.',
  },
  {
    title: 'Governing Law',
    color: '#00F5FF', rgb: '0,245,255',
    body: 'These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Bhopal, Madhya Pradesh.',
  },
]

function TermSection({ section, index }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <span className="leading-none flex-shrink-0"
          style={{ ...bebasNeue, fontSize: '1.1rem', color: section.color }}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="flex-1 h-px" style={{ background: `rgba(${section.rgb},.2)` }} />
        <h2 className="text-[15px] font-bold text-[#F0EAD6]/90 flex-shrink-0" style={syne}>
          {section.title}
        </h2>
      </div>
      <div className="pl-8 relative">
        <div className="absolute left-0 top-0 bottom-0 w-[2px]"
          style={{ background: `rgba(${section.rgb},.2)` }} />
        <p className="text-[13px] font-light text-[#F0EAD6]/55 leading-[1.85]" style={dmSans}>
          {section.body}
        </p>
      </div>
    </div>
  )
}

export default function TermsPage() {
  return (
    <main className="bg-[#050508] text-[#F0EAD6] overflow-x-hidden" style={dmSans}>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden px-12 pt-[140px] pb-16 border-b border-white/[.055]">
        <div className="absolute -top-[80px] -right-[60px] w-[480px] h-[380px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse,rgba(0,245,255,.09) 0%,transparent 70%)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,107,53,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,107,53,.02) 1px,transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'repeating-linear-gradient(to bottom,transparent 0px,transparent 3px,rgba(0,0,0,.055) 3px,rgba(0,0,0,.055) 4px)',
        }} />

        <div className="relative z-[2] max-w-[760px] mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-[7px] bg-[#FF6B35]/[.07] border border-[#FF6B35]/[.22] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]" />
            <span className="text-[9px] font-bold tracking-[.42em] uppercase text-[#FF6B35]" style={syne}>
              Effective: May 2025
            </span>
          </div>
          <div>
            <span className="block leading-[.88]" style={{
              ...bebasNeue, fontSize: 'clamp(40px,7vw,80px)',
              WebkitTextStroke: '1px rgba(240,234,214,.35)', color: 'transparent',
            }}>TERMS OF</span>
            <span className="block leading-[.88] text-[#FF6B35]" style={{
              ...bebasNeue, fontSize: 'clamp(40px,7vw,80px)',
              textShadow: '0 0 40px rgba(255,107,53,.38)',
            }}>USE</span>
          </div>
          <div className="w-14 h-px my-6" style={{ background: 'linear-gradient(90deg,#FF6B35,transparent)' }} />
          <p className="font-light text-[#F0EAD6]/50 leading-[1.8] max-w-[560px]"
            style={{ ...dmSans, fontSize: 'clamp(13px,1.3vw,15px)' }}>
            These terms govern your use of the Nimo Labs website and participation in our
            programs. We've written them in plain language — no legal jargon where we can avoid it.
          </p>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="relative px-12 py-16">
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(rgba(255,107,53,.014) 1px,transparent 1px),linear-gradient(90deg,rgba(255,107,53,.014) 1px,transparent 1px)',
          backgroundSize: '48px 48px',
        }} />
        <div className="relative z-[2] max-w-[760px] mx-auto">

          {sections.map((section, i) => (
            <TermSection key={section.title} section={section} index={i} />
          ))}

          {/* Contact block */}
          <div className="relative bg-white/[.025] border border-white/[.07] p-7 mt-8">
            <div className="absolute top-0 left-0 w-5 h-5"
              style={{ borderTop: '1px solid #FF6B35', borderLeft: '1px solid #FF6B35' }} />
            <div className="absolute top-0 left-0 right-0 h-[1.5px]"
              style={{ background: 'linear-gradient(90deg,#FF6B35,transparent)' }} />
            <div className="text-[8px] font-bold tracking-[.38em] uppercase text-[#FF6B35] mb-3" style={syne}>
              Questions About These Terms?
            </div>
            <p className="text-[13px] font-light text-[#F0EAD6]/55 leading-[1.8] mb-4" style={dmSans}>
              Contact us at{' '}
              <a href="mailto:hello@nimolabs.in" className="text-[#FF6B35] no-underline hover:underline">
                hello@nimolabs.in
              </a>
              {' '}or visit our{' '}
              <Link to="/" className="text-[#FF6B35] no-underline hover:underline">homepage</Link>.
              Also see our{' '}
              <Link to="/privacy" className="text-[#FF6B35] no-underline hover:underline">Privacy Policy</Link>.
            </p>
            <Link to="/"
              className="text-[9px] font-bold tracking-[.3em] uppercase text-[#F0EAD6]/50 border border-white/10 px-5 py-2.5 no-underline hover:border-[#FF6B35] hover:text-[#FF6B35] transition-all duration-200 inline-block"
              style={syne}>
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}
