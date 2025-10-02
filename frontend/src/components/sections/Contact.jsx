import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Instagram, Youtube, Facebook } from 'lucide-react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { FaWhatsapp } from 'react-icons/fa'

const Contact = () => {

  const [contactInfo, setContactInfo] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await axios.get('/api/content/contact')
        setContactInfo(response.data.data.data)
      } catch (error) {
        console.error('Error fetching contact info:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchContactInfo()
  }, [])

  // Show loading state
  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="section-container">
          <div className="text-center">Loading...</div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-white">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-secondary-900 mb-6">
                Get In Touch
              </h2>
              <p className="text-xl text-secondary-600 leading-relaxed">
                Ready to transform your look? Book your appointment today and let's create 
                something beautiful together.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-primary-100 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-secondary-900">Phone</h4>
                  <p className="text-secondary-600">{contactInfo?.phone || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-primary-100 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-secondary-900">Email</h4>
                  <p className="text-secondary-600">{contactInfo?.email || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-primary-100 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-secondary-900">Studio</h4>
                  <p className="text-secondary-600">{contactInfo?.address || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              {contactInfo?.socialMedia?.instagram && (
                <a 
                  href={contactInfo.socialMedia.instagram} 
                  className="bg-primary-100 hover:bg-primary-200 p-3 rounded-full transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="h-6 w-6 text-primary-600" />
                </a>
              )}
              {contactInfo?.socialMedia?.youtube && (
                <a 
                  href={contactInfo.socialMedia.youtube} 
                  className="bg-primary-100 hover:bg-primary-200 p-3 rounded-full transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Youtube className="h-6 w-6 text-primary-600" />
                </a>
              )}
              {contactInfo?.socialMedia?.whatsapp && (
                <a 
                  href={contactInfo.socialMedia.whatsapp} 
                  className="bg-primary-100 hover:bg-primary-200 p-3 rounded-full transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaWhatsapp className="h-6 w-6 text-primary-600" />
                </a>
              )}
            </div>
          </motion.div>

          {/* Booking Section */}
          <motion.div 
            className="bg-primary-50 rounded-2xl p-8"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-display font-bold text-secondary-900 mb-6">
              Book Appointment
            </h3>
            
            <div className="space-y-6">
              <p className="text-secondary-700">
                Ready for your transformation? Click below to book your appointment 
                and choose from our range of professional services.
              </p>
              
              <div className="bg-white p-6 rounded-lg">
                <h4 className="font-semibold text-secondary-900 mb-4">Popular Services</h4>
                <ul className="space-y-2">
                  <li className="flex justify-between text-sm">
                    <span>Bridal Makeup</span>
                    <span className="text-primary-600 font-semibold">₹15,000</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span>Party Makeup</span>
                    <span className="text-primary-600 font-semibold">₹8,000</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span>Mehndi Design</span>
                    <span className="text-primary-600 font-semibold">₹5,000</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span>Hair Styling</span>
                    <span className="text-primary-600 font-semibold">₹4,000</span>
                  </li>
                </ul>
              </div>
              
              <Link to="/book-appointment" className="btn-primary w-full text-center block">
                Book Your Appointment
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Contact