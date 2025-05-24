import React from 'react'
import HeroSection from './_components/hero-section'
import Features from './_components/features-section'
import Faqs from './_components/Faqs'
import LogoTicker from './_components/LogoTicker'
const page = () => {
  return (
    <div className='bg-slate-100'>
      <HeroSection />
      <LogoTicker />
      <Features />
      <Faqs />
    </div>
  )
}

export default page