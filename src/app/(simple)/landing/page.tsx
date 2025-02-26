import React from 'react'
import FaqLandingPage from 'sections/landing/Faq'
import FeaturesPage from 'sections/landing/Features'
import Hero from 'sections/landing/Hero'
import PriceLandingPage from 'sections/landing/Price'
import { getHomeFaq, getHomeMembershipPackages } from './actions'

const LandingPage = async () => {
  const result = await getHomeMembershipPackages();
  const faqResult = await getHomeFaq();
  return (
    <>
      <Hero />
      <FeaturesPage page='home' />
      <PriceLandingPage result={result} />
      <FaqLandingPage page='home' result={faqResult} />
    </>
  )
}

export default LandingPage