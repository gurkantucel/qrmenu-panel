import SimpleLayout from 'layout/SimpleLayout'
import React from 'react'
import ComboPage from 'sections/landing/Combo'
import FaqLandingPage from 'sections/landing/Faq'
import FeaturesPage from 'sections/landing/Features'
import Hero from 'sections/landing/Hero'
import PriceLandingPage from 'sections/landing/Price'

const Landing = () => {
  return (
    <SimpleLayout>
        <Hero />
        <FeaturesPage />
        <PriceLandingPage />
        <FaqLandingPage />
        <ComboPage />
    </SimpleLayout>
  )
}

export default Landing