import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import Features from "../components/Features"
import DashboardPreview from "../components/DashboardPreview"
import HowItWorks from "../components/HowItWorks"
import CallToAction from "../components/CallToAction"
import Footer from "../components/Footer"

function Landing() {
  return (
    <div className="bg-gradient-to-b from-[#020617] via-[#07182F] to-[#020617] text-white overflow-hidden">

      <Navbar />

      <Hero />

      <Features />

      <DashboardPreview />

      <HowItWorks />

      <CallToAction />

      <Footer />

    </div>
  )
}

export default Landing