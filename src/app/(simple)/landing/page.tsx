import React from 'react'
import FaqLandingPage from 'sections/landing/Faq'
import FeaturesPage from 'sections/landing/Features'
import Hero from 'sections/landing/Hero'
import PriceLandingPage from 'sections/landing/Price'

const LandingPage = () => {
  return (
   <>
     <Hero />
     <FeaturesPage />
     <PriceLandingPage />
     <FaqLandingPage />
   </>
  )
}

export default LandingPage