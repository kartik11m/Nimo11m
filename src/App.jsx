import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import LoadingScreen from './components/LoadingScreen'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Robots from './pages/Robots'
import Training from './pages/Training'
import Events from './pages/Events'
import Book from './pages/Book'
import Explore from './pages/Explore'
import HallOfMakers from './pages/Achievements'
import AboutPage from './pages/AboutPage'
import LabSetupEnquirePage from './components/LabSetupEnquirePage'
import NotFoundPage from './pages/NotFoundPage'
import CompetitionsPage from './pages/CompetitionsPage'
import PrivacyPage from './pages/PrivacyPage'
import TermsPage from './pages/TermsPage'
import ContactPage from './pages/ContactPage'
import OwnerLoginPage from './pages/OwnerLoginPage'

// Owner Auth
import { OwnerAuthProvider } from './context/OwnerAuthContext'

export default function App() {
  const [loaded, setLoaded] = useState(false)

  if (!loaded) {
    return <LoadingScreen onComplete={() => setLoaded(true)} />
  }

  return (
    <OwnerAuthProvider>
      <Routes>
        <Route path="/owner-login" element={<OwnerLoginPage />} />
        <Route
          path="*"
          element={
            <>
              <Navbar />
              <main className="pt-16">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/robots" element={<Robots />} />
                  <Route path="/training" element={<Training />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/book" element={<Book />} />
                  <Route path="/lab-setup" element={<Explore />} />
                  <Route path="/lab-setup/enquire" element={<LabSetupEnquirePage />} />
                  <Route path="/achievement" element={<HallOfMakers />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/competitions" element={<CompetitionsPage />} />
                  <Route path="/*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
            </>
          }
        />
      </Routes>
    </OwnerAuthProvider>
  )
}
