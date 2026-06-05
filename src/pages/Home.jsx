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


export default function Home() {
  return (
    <main className="bg-bg text-white overflow-x-hidden">
      <ScrollRobotGuide />

      <section id="home-hero">
        <HeroSection />
      </section>

      <section id="home-services">
        <ServiceHighlights />
      </section>

      <section id="home-summer">
        <SummerCampBanner />
      </section>

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

      <StudentAchievements/>

      <PartnersStrip/>

      <LabSetupPreview/>

      <Testimonial/>

      <BlogPreview/>

      <ContactSection/>

      <FAQSection/>

      {/* <ScrollVideoSection /> */}
      
    </main>
  )
}
