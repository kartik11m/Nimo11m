import Navbar             from '../components/Navbar'
import HeroSection         from '../components/HeroSection'
import SummerCampBanner    from '../components/SummerCampBanner'
import ServiceHighlights   from '../components/ServiceHighlights'
import RobotsPreview       from '../components/RobotsPreview'
import TrainingPreview     from '../components/TrainingPreview'
import EventHighlights     from '../components/EventHighlights'
// import ScrollVideoSection from '../components/ScrollVideoSection'
import ScrollVideoSection1 from '../components/ScrollVideoSection1'
import ScrollRobotGuide    from '../components/ScrollRobotGuide'
import Footer from '../components/Footer'
import Testimonial from '../components/Testimonials'
import StudentAchievements from '../components/StudentAchievements'
import LabSetupPreview from '../components/LabSetupPreview'
import ContactSection from '../components/ContactSection'
import BlogPreview from '../components/BlogPreview'
import FAQSection from '../components/FAQSection'
import PartnersStrip from '../components/PartnersStrip'
import CookieBanner from '../components/CookieBanner'
import { useState, useEffect } from 'react'
import { useOwnerAuth } from '../context/OwnerAuthContext'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function Home() {
  const { isOwner, updateContent } = useOwnerAuth()
  const [showSummerCamp, setShowSummerCamp] = useState(true)

  useEffect(() => {
    const fetchSummerCampVisibility = async () => {
      try {
        const res = await fetch(`${API_URL}/content`)
        const data = await res.json()
        if (data.success) {
          const visibility = data.content.find(c => c.key === 'summer-camp.visible')
          if (visibility) {
            setShowSummerCamp(visibility.content !== 'false')
          }
        }
      } catch (error) {
        console.error('Error fetching summer camp visibility:', error)
      }
    }
    fetchSummerCampVisibility()
  }, [])
  return (
    <main className="bg-bg text-white overflow-x-hidden">
      <ScrollRobotGuide />

      <section id="home-hero">
        <HeroSection />
      </section>

      <section id="home-services">
        <ServiceHighlights />
      </section>

      {showSummerCamp && (
        <section id="home-summer">
          <SummerCampBanner />
        </section>
      )}

      {!showSummerCamp && isOwner && (
        <div className="py-16 px-4 text-center border-t border-white/10">
          <p className="text-white/50 mb-4">Summer Camp section is hidden</p>
          <button
            onClick={() => {
              updateContent('summer-camp.visible', 'true').then(() => {
                setShowSummerCamp(true)
              })
            }}
            className="px-6 py-2 bg-orange/20 text-orange border border-orange/40 rounded-lg hover:bg-orange/30 transition-colors font-medium"
            style={{
              backgroundColor: 'rgba(255,98,48,.15)',
              color: '#FF6230',
              borderColor: 'rgba(255,98,48,.4)'
            }}
          >
            + Add Summer Camp Section
          </button>
        </div>
      )}

      <section id="home-robots">
        {/* <RobotsPreview /> */}
        <ScrollVideoSection1 />
      </section>

      <section id="home-training">
        <TrainingPreview />
      </section>

      <section id="home-events">
        <EventHighlights />
      </section>

      <CookieBanner/>

      <section id="home-achievements">
        <StudentAchievements/>
      </section>

      <section id="home-partners">
        <PartnersStrip/>
      </section>

      <section id="home-lab-setup">
        <LabSetupPreview/>
      </section>

      <section id="home-testimonials">
        <Testimonial/>
      </section>

      <section id="home-blog">
        <BlogPreview/>
      </section>

      <section id="home-contact">
        <ContactSection/>
      </section>

      <section id="home-faq">
        <FAQSection/>
      </section>

      {/* <ScrollVideoSection /> */}
      
    </main>
  )
}
