import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import axios from 'axios'

const Testimonials = () => {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const sliderRef = useRef(null)

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/testimonials`)
        setTestimonials(response.data.data)
      } catch (error) {
        console.error('Error fetching testimonials:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTestimonials()
  }, [])

  // Mobile scroll sync
  useEffect(() => {
    if (sliderRef.current) {
      const slideWidth = sliderRef.current.offsetWidth
      sliderRef.current.scrollTo({
        left: currentSlide * slideWidth,
        behavior: 'smooth'
      })
    }
  }, [currentSlide])

  const nextSlide = () => {
    if (currentSlide < testimonials.length - 1) {
      setCurrentSlide(prev => prev + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1)
    }
  }

  return (
    <section className="py-20 gradient-bg">
      <div className="section-container">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-secondary-900 mb-6">
            Client Love
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            What our beautiful clients say about us
          </p>
        </motion.div>

        {/* Desktop view: Horizontal drag scroll with 3 visible cards */}
        <div className="hidden md:block overflow-hidden">
          <motion.div
            className="flex gap-6 cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ 
              left: -((testimonials.length - 3) * 360), 
              right: 0 
            }}
            dragElastic={0.1}
            whileTap={{ cursor: 'grabbing' }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={testimonial.id}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 flex-shrink-0"
                style={{ width: '350px' }}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.clientImage}
                    alt={testimonial.clientName}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-secondary-900">{testimonial.clientName}</h4>
                    <div className="flex items-center space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <Quote className="absolute top-0 left-0 h-8 w-8 text-primary-200 -translate-x-2 -translate-y-2" />
                  <p className="text-secondary-700 italic leading-relaxed pl-6">
                    "{testimonial.review}"
                  </p>
                </div>
                
                <div className="mt-4 text-sm text-primary-600 font-medium">
                  - {testimonial.service}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Mobile View: Horizontal scroll like gallery */}
        <div className="md:hidden relative">
          <div 
            ref={sliderRef}
            className="overflow-x-auto snap-x snap-mandatory scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <div className="flex gap-4 px-4">
              {testimonials.map((testimonial, index) => (
                <motion.div 
                  key={testimonial.id}
                  className="bg-white rounded-xl p-6 shadow-lg flex-shrink-0 snap-center"
                  style={{ width: 'calc(100vw - 3rem)' }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.clientImage}
                      alt={testimonial.clientName}
                      className="w-10 h-10 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-semibold text-secondary-900 text-base">{testimonial.clientName}</h4>
                      <div className="flex items-center space-x-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <Quote className="absolute top-0 left-0 h-6 w-6 text-primary-200 -translate-x-2 -translate-y-2" />
                    <p className="text-secondary-700 italic leading-relaxed pl-6 text-sm">
                      "{testimonial.review}"
                    </p>
                  </div>

                  <div className="mt-3 text-sm text-primary-600 font-medium">
                    - {testimonial.service}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          {testimonials.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className={`absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all z-10 ${
                  currentSlide === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
                }`}
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5 text-secondary-900" />
              </button>
              
              <button
                onClick={nextSlide}
                disabled={currentSlide === testimonials.length - 1}
                className={`absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all z-10 ${
                  currentSlide === testimonials.length - 1 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
                }`}
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5 text-secondary-900" />
              </button>

              {/* Slide Indicators */}
              <div className="flex justify-center gap-2 mt-4">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      currentSlide === index 
                        ? 'w-8 bg-primary-600' 
                        : 'w-2 bg-secondary-300'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  )
}

export default Testimonials
