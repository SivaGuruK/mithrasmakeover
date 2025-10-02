import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, Phone, Mail, MessageSquare, CreditCard } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'

const BookingForm = () => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm()
  const location = useLocation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
    const [services, setServices] = useState([])


const rawSelectedServices = watch('services') || [];
const selectedServices = Array.isArray(rawSelectedServices)
  ? rawSelectedServices
  : [rawSelectedServices];
const totalAmount = selectedServices.reduce((total, serviceId) => {
  const service = services.find(s => s._id === parseInt(serviceId))
  return total + (service ? service.price : 0)
}, 0)
  useEffect(() => {
    if (location.state?.serviceId) {
      setValue('services', [location.state.serviceId.toString()])
    }
  }, [location.state, setValue])

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('/api/services')
        setServices(response.data.data)
      } catch (error) {
        console.error('Error fetching services:', error)
      }
    }
    fetchServices()
  }, [])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      console.log('Booking data:', {
        customer: {
          name: data.name,
          email: data.email,
          phone: data.phone
        },
      services: (Array.isArray(data.services) ? data.services : [data.services])
        .map(serviceId => ({ service: serviceId })),
        appointmentDate: data.appointmentDate,
        appointmentTime: data.appointmentTime,
        notes: data.notes
      })
      
      const response = await axios.post('/api/bookings', {
        customer: {
          name: data.name,
          email: data.email,
          phone: data.phone
        },
      services: (Array.isArray(data.services) ? data.services : [data.services])
        .map(serviceId => ({ service: serviceId })),
        appointmentDate: data.appointmentDate,
        appointmentTime: data.appointmentTime,
        notes: data.notes
      })
      
      toast.success('Booking request sent successfully! We will contact you soon.')
      navigate('/', { state: { bookingSuccess: true } })
    } catch (error) {
      console.error('Booking error:', error)
      toast.error('Failed to send booking request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen gradient-bg py-20">
      <div className="section-container">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-secondary-900 mb-6">
              Book Your Appointment
            </h1>
            <p className="text-xl text-secondary-600">
              Let's create something beautiful together
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <form onSubmit={handleSubmit(onSubmit)} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-secondary-900 flex items-center">
                    <User className="h-5 w-5 mr-2 text-primary-600" />
                    Personal Information
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      type="text"
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      type="email"
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      {...register('phone', { required: 'Phone number is required' })}
                      type="tel"
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="+91 9876543210"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-secondary-900 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary-600" />
                    Appointment Details
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Preferred Date *
                    </label>
                    <input
                      {...register('appointmentDate', { required: 'Date is required' })}
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {errors.appointmentDate && (
                      <p className="text-red-500 text-sm mt-1">{errors.appointmentDate.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Preferred Time *
                    </label>
                    <select
                      {...register('appointmentTime', { required: 'Time is required' })}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select time</option>
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="03:00 PM">03:00 PM</option>
                      <option value="04:00 PM">04:00 PM</option>
                      <option value="05:00 PM">05:00 PM</option>
                    </select>
                    {errors.appointmentTime && (
                      <p className="text-red-500 text-sm mt-1">{errors.appointmentTime.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Services Selection */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-secondary-900 mb-6">
                  Select Services *
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {services.map((service) => (
                    <label 
                      key={service._id}
                      className="flex items-center p-4 border border-secondary-200 rounded-lg hover:border-primary-300 cursor-pointer transition-colors"
                    >
                      <input
                        {...register('services', { required: 'Please select at least one service' })}
                        type="checkbox"
                        value={service._id}
                        className="w-5 h-5 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-secondary-900">{service.title}</span>
                          <span className="text-primary-600 font-semibold">₹{service.price.toLocaleString()}</span>
                        </div>
                        <span className="text-sm text-secondary-600">{service.duration} minutes</span>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.services && (
                  <p className="text-red-500 text-sm mt-2">{errors.services.message}</p>
                )}
              </div>

              {/* Additional Notes */}
              <div className="mt-8">
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  <MessageSquare className="h-4 w-4 inline mr-1" />
                  Special Requirements or Notes
                </label>
                <textarea
                  {...register('notes')}
                  rows={4}
                  className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Any special requests, allergies, or preferences..."
                />
              </div>

              {/* Total Amount */}
              {totalAmount > 0 && (
                <div className="mt-8 bg-primary-50 p-6 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-secondary-900">Total Amount:</span>
                    <span className="text-2xl font-bold text-primary-600">₹{totalAmount.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-secondary-600 mt-2">
                    * Final price may vary based on specific requirements
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <div className="mt-8 text-center">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary px-12 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    'Book Appointment'
                  )}
                </button>
                <p className="text-sm text-secondary-600 mt-4">
                  We'll contact you within 24 hours to confirm your appointment
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default BookingForm