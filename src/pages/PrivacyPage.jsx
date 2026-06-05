import { Link } from 'react-router-dom'

const bebasNeue = { fontFamily: "'Bebas Neue', sans-serif" }
const syne      = { fontFamily: "'Syne', sans-serif" }
const dmSans    = { fontFamily: "'DM Sans', sans-serif" }

const sections = [
  {
    title: 'Information We Collect',
    color: '#FF6B35', rgb: '255,107,53',
    items: [
      { heading: 'Contact & Enquiry Data', body: 'When you fill in our contact form, book a workshop, or submit a lab setup enquiry, we collect your name, email address, phone number, institution name, and city. This information is used solely to respond to your request.' },
      { heading: 'Usage Data', body: 'We use Plausible Analytics — a privacy-first, GDPR-compliant analytics tool that collects no personal data, sets no cookies, and does not track you across websites. We see aggregate page views and referral sources only.' },
      { heading: 'Communication History', body: 'If you contact us via WhatsApp, email, or our forms, we retain that correspondence to provide consistent support and follow up on your enquiry.' },
    ],
  },
  {
    title: 'How We Use It',
    color: '#00F5FF', rgb: '0,245,255',
    items: [
      { heading: 'Responding to Enquiries', body: 'The primary use of your contact data is to respond to course enquiries, workshop bookings, lab setup requests, and general queries.' },
      { heading: 'Marketing Communications', body: 'We may send you information about new courses, upcoming cohorts, or Summer Camp registration — only if you have opted in. You can unsubscribe at any time via the link in any email we send.' },
      { heading: 'Service Improvement', body: 'Aggregate analytics data (no personal data) helps us understand which pages are most useful and improve the site accordingly.' },
    ],
  },
  {
    title: 'Data Sharing',
    color: '#A855F7', rgb: '168,85,247',
    items: [
      { heading: 'No Sale of Data', body: 'We do not sell, rent, or trade your personal information to any third party under any circumstances.' },
      { heading: 'Service Providers', body: 'We use a small number of trusted third-party services to operate the site — email delivery (for transactional emails), and WhatsApp (for direct communication). These services have their own privacy policies.' },
      { heading: 'Legal Requirements', body: 'We may disclose your information if required to do so by law or in response to valid legal process.' },
    ],
  },
  {
    title: 'Data Retention',
    color: '#FF006E', rgb: '255,0,110',
    items: [
      { heading: 'Contact Records', body: 'We retain contact and enquiry data for up to 3 years to support ongoing relationships. You may request deletion at any time.' },
      { heading: 'Student Records', body: 'Certified student records (name, course, completion date) are retained indefinitely for certification verification purposes.' },
    ],
  },
  {
    title: 'Your Rights',
    color: '#FF6B35', rgb: '255,107,53',
    items: [
      { heading: 'Access & Correction', body: 'You have the right to request a copy of the personal data we hold about you and to correct any inaccuracies.' },
      { heading: 'Deletion', body: 'You may request deletion of your personal data at any time by emailing privacy@nimolabs.in. We will action deletion requests within 30 days.' },
      { heading: 'Opt-Out', body: 'You may opt out of marketing communications at any time by clicking "Unsubscribe" in any email or by contacting us directly.' },
    ],
  },
  {
    title: 'Cookies',
    color: '#00F5FF', rgb: '0,245,255',
    items: [
      { heading: 'Essential Cookies', body: 'We set a single session cookie (nimo_loaded) to manage the loading screen experience. This contains no personal data and expires when you close your browser.' },
      { heading: 'Consent Cookie', body: 'We store your cookie consent preference (nimo_cookie_consent) in localStorage so we don\'t ask you again on every visit. This contains only your consent choice and timestamp.' },
      { heading: 'No Tracking Cookies', body: 'We do not set any advertising, tracking, or third-party cookies. Our analytics tool (Plausible) is cookieless.' },
    ],
  },
]

function PolicySection({ section, index }) {
  return (
    <div className="mb-12">
      {/* Section heading */}
      <div className="flex items-center gap-3 mb-6">
        <span className="leading-none flex-shrink-0"
          style={{ ...bebasNeue, fontSize: '1.1rem', color: section.color }}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="flex-1 h-px" style={{ background: `rgba(${section.rgb},.25)` }} />
        <h2 className="text-[16px] font-bold text-[#F0EAD6]/90 flex-shrink-0" style={syne}>
          {section.title}
        </h2>
      </div>

      {/* Items */}
      <div className="flex flex-col gap-5 pl-8">
        {section.items.map(item => (
          <div key={item.heading} className="relative pl-5">
            {/* Left dot */}
            <div className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full"
              style={{ background: section.color, boxShadow: `0 0 6px rgba(${section.rgb},.5)` }} />
            <h3 className="text-[13px] font-bold text-[#F0EAD6]/85 mb-1.5" style={syne}>
              {item.heading}
            </h3>
            <p className="text-[13px] font-light text-[#F0EAD6]/55 leading-[1.8]" style={dmSans}>
              {item.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function PrivacyPage() {
  return (
    <main className="bg-[#050508] text-[#F0EAD6] overflow-x-hidden" style={dmSans}>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden px-12 pt-[140px] pb-16 border-b border-white/[.055]">
        <div className="absolute -top-[80px] -left-[60px] w-[480px] h-[380px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse,rgba(255,107,53,.1) 0%,transparent 70%)' }} />
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
              Last Updated: May 2025
            </span>
          </div>
          <div>
            <span className="block leading-[.88]" style={{
              ...bebasNeue, fontSize: 'clamp(40px,7vw,80px)',
              WebkitTextStroke: '1px rgba(240,234,214,.35)', color: 'transparent',
            }}>PRIVACY</span>
            <span className="block leading-[.88] text-[#FF6B35]" style={{
              ...bebasNeue, fontSize: 'clamp(40px,7vw,80px)',
              textShadow: '0 0 40px rgba(255,107,53,.38)',
            }}>POLICY</span>
          </div>
          <div className="w-14 h-px my-6" style={{ background: 'linear-gradient(90deg,#FF6B35,transparent)' }} />
          <p className="font-light text-[#F0EAD6]/50 leading-[1.8] max-w-[560px]"
            style={{ ...dmSans, fontSize: 'clamp(13px,1.3vw,15px)' }}>
            Nimo Labs ("we", "us") operates nimolabs.in. This policy explains what data we
            collect, how we use it, and how you can control it. We keep it plain — no legalese.
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
            <PolicySection key={section.title} section={section} index={i} />
          ))}

          {/* Contact */}
          <div className="relative bg-white/[.025] border border-white/[.07] p-7 mt-8">
            <div className="absolute top-0 left-0 w-5 h-5"
              style={{ borderTop: '1px solid #FF6B35', borderLeft: '1px solid #FF6B35' }} />
            <div className="absolute top-0 left-0 right-0 h-[1.5px]"
              style={{ background: 'linear-gradient(90deg,#FF6B35,transparent)' }} />
            <div className="text-[8px] font-bold tracking-[.38em] uppercase text-[#FF6B35] mb-3" style={syne}>
              Questions?
            </div>
            <p className="text-[13px] font-light text-[#F0EAD6]/55 leading-[1.8] mb-4" style={dmSans}>
              If you have any questions about this privacy policy or how we handle your data,
              contact us at{' '}
              <a href="mailto:privacy@nimolabs.in" className="text-[#FF6B35] no-underline hover:underline">
                privacy@nimolabs.in
              </a>{' '}
              or via our{' '}
              <Link to="/contact" className="text-[#FF6B35] no-underline hover:underline">contact page</Link>.
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
