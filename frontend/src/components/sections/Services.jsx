import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Sparkles, Palette, Scissors } from 'lucide-react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useState ,useEffect} from 'react';


const Services = () => {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/services`)
        setServices(response.data.data)
      } catch (error) {
        console.error('Error fetching services:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

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
            Our Services
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            Professional beauty services tailored to make your special moments unforgettable
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon
            return (
              <motion.div 
                key={service.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="relative h-48">
                  <img
                    src={service.images?.[0]}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 p-3 rounded-full">
                    <IconComponent className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-display font-semibold text-secondary-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-secondary-600 mb-4">
                    {service.description}
                  </p>
                  
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-primary-600">
                      ₹{service.price.toLocaleString()}
                    </span>
                    <span className="text-sm text-secondary-500">
                      {service.duration} mins
                    </span>
                  </div>
                  
                  <Link 
                    to="/book-appointment" 
                    state={{ serviceId: service.id }}
                    className="w-full btn-primary text-center block"
                  >
                    Book Now
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Services