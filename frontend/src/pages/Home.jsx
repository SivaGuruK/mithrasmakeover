import React from 'react'
import Hero from '../components/sections/Hero'
import About from '../components/sections/About'
import Services from '../components/sections/Services'
import Gallery from '../components/sections/Gallery'
import Testimonials from '../components/sections/Testimonials'
import Contact from '../components/sections/Contact'

const Home = () => {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <Gallery />
      <Testimonials />
      <Contact />
    </>
  )
}

export default Home