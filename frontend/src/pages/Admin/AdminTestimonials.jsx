import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, Eye, EyeOff, Check, X, User } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { getToken } from "../../utils/auth"

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') 
  const [selectedTestimonial, setSelectedTestimonial] = useState(null)

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await axios.get('/api/testimonials/all',{
                                headers: {
                                  Authorization: `Bearer ${getToken()}`
                                }})
        setTestimonials(response.data.data)
      } catch (error) {
        console.error('Error fetching testimonials:', error)
        toast.error('Failed to load testimonials')
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  const handleApprove = async (testimonialId) => {
    try {
      await axios.put(`/api/testimonials/${testimonialId}/approve`,{},{
                              headers: {
                                Authorization: `Bearer ${getToken()}`
                              }})
      
      setTestimonials(testimonials.map(testimonial => 
        testimonial._id === testimonialId 
          ? { ...testimonial, isApproved: true }
          : testimonial
      ))
      toast.success('Testimonial approved successfully')
    } catch (error) {
      toast.error('Failed to approve testimonial')
    }
  }

  const handleReject = async (testimonialId) => {
    if (window.confirm('Are you sure you want to reject this testimonial?')) {
      try {
        await axios.delete(`/api/testimonials/${testimonialId}`,{
                                headers: {
                                  Authorization: `Bearer ${getToken()}`
                                }})
        
        setTestimonials(testimonials.filter(testimonial => testimonial._id !== testimonialId))
        toast.success('Testimonial rejected successfully')
      } catch (error) {
        toast.error('Failed to reject testimonial')
      }
    }
  }

  const handleToggleVisibility = async (testimonialId, currentStatus) => {
    try {
      await axios.put(
        `/api/testimonials/${testimonialId}`,
        { isActive: !currentStatus },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      );

            
      setTestimonials(testimonials.map(testimonial => 
        testimonial._id === testimonialId 
          ? { ...testimonial, isActive: !currentStatus }
          : testimonial
      ))
      toast.success(`Testimonial ${!currentStatus ? 'shown' : 'hidden'} successfully`)
    } catch (error) {
      toast.error('Failed to update testimonial visibility')
    }
  }

  const filteredTestimonials = testimonials.filter(testimonial => {
    switch (filter) {
      case 'pending':
        return !testimonial.isApproved
      case 'approved':
        return testimonial.isApproved
      default:
        return true
    }
  })

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold text-secondary-900">
          Testimonials Management
        </h1>
        
        {/* Filter Buttons */}
        <div className="flex space-x-2">
          {['all', 'pending', 'approved'].map(filterOption => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                filter === filterOption
                  ? 'bg-primary-600 text-white'
                  : 'bg-secondary-100 text-secondary-700 hover:bg-primary-100'
              }`}
            >
              {filterOption}
              {filterOption === 'pending' && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {testimonials.filter(t => !t.isApproved).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTestimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial._id}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                {testimonial.clientImage ? (
                  <img
                    src={`${testimonial.clientImage}?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80`}
                    alt={testimonial.clientName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-secondary-200 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-secondary-600" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-secondary-900">{testimonial.clientName}</h3>
                  <div className="flex items-center space-x-1">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
              </div>
              
              {/* Status badges */}
              <div className="flex flex-col items-end space-y-1">
                {testimonial.isApproved ? (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                    Approved
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                    Pending
                  </span>
                )}
                {testimonial.isActive ? (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                    Visible
                  </span>
                ) : (
                  <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                    Hidden
                  </span>
                )}
              </div>
            </div>

            {/* Review */}
            <p className="text-secondary-700 text-sm leading-relaxed mb-4 line-clamp-4">
              "{testimonial.review}"
            </p>

            {/* Service */}
            <div className="mb-4">
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium">
                {testimonial.service.title}
              </span>
            </div>

            {/* Date */}
            <p className="text-xs text-secondary-500 mb-4">
              {new Date(testimonial.createdAt).toLocaleDateString()}
            </p>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-secondary-200">
              <button
                onClick={() => setSelectedTestimonial(testimonial)}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                View Full
              </button>
              
              <div className="flex items-center space-x-2">
                {/* Visibility Toggle */}
                <button
                  onClick={() => handleToggleVisibility(testimonial._id, testimonial.isActive)}
                  className={`p-2 rounded-lg transition-colors ${
                    testimonial.isActive
                      ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={testimonial.isActive ? 'Hide' : 'Show'}
                >
                  {testimonial.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>

                {/* Approval Actions */}
                {!testimonial.isApproved && (
                  <>
                    <button
                      onClick={() => handleApprove(testimonial._id)}
                      className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                      title="Approve"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleReject(testimonial._id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      title="Reject"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredTestimonials.length === 0 && (
        <div className="text-center py-12">
          <div className="text-secondary-400 text-lg">No testimonials found</div>
          <p className="text-secondary-500 mt-2">
            {filter === 'pending' 
              ? 'No pending testimonials to review' 
              : filter === 'approved'
              ? 'No approved testimonials yet'
              : 'No testimonials have been submitted yet'}
          </p>
        </div>
      )}

      {/* Full Testimonial Modal */}
      {selectedTestimonial && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-secondary-900">Testimonial Details</h2>
                <button
                  onClick={() => setSelectedTestimonial(null)}
                  className="text-secondary-400 hover:text-secondary-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Client Info */}
              <div className="flex items-center space-x-4 mb-6">
                {selectedTestimonial.clientImage ? (
                  <img
                    src={`${selectedTestimonial.clientImage}?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80`}
                    alt={selectedTestimonial.clientName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-secondary-200 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-secondary-600" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-semibold text-secondary-900">{selectedTestimonial.clientName}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center space-x-1">
                      {renderStars(selectedTestimonial.rating)}
                    </div>
                    <span className="text-sm text-secondary-600">({selectedTestimonial.rating}/5)</span>
                  </div>
                </div>
              </div>

              {/* Service */}
              <div className="mb-6">
                <h4 className="font-medium text-secondary-900 mb-2">Service:</h4>
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                  {selectedTestimonial.service.title}
                </span>
              </div>

              {/* Review */}
              <div className="mb-6">
                <h4 className="font-medium text-secondary-900 mb-2">Review:</h4>
                <div className="bg-secondary-50 p-4 rounded-lg">
                  <p className="text-secondary-700 leading-relaxed">
                    "{selectedTestimonial.review}"
                  </p>
                </div>
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h4 className="font-medium text-secondary-900 mb-1">Status:</h4>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedTestimonial.isApproved 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedTestimonial.isApproved ? 'Approved' : 'Pending'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedTestimonial.isActive 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedTestimonial.isActive ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-secondary-900 mb-1">Submitted:</h4>
                  <p className="text-secondary-600">
                    {new Date(selectedTestimonial.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-4 pt-4 border-t border-secondary-200">
                <button
                  onClick={() => handleToggleVisibility(selectedTestimonial._id, selectedTestimonial.isActive)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedTestimonial.isActive
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
                >
                  {selectedTestimonial.isActive ? 'Hide' : 'Show'}
                </button>
                
                {!selectedTestimonial.isApproved && (
                  <>
                    <button
                      onClick={() => {
                        handleReject(selectedTestimonial._id)
                        setSelectedTestimonial(null)
                      }}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => {
                        handleApprove(selectedTestimonial._id)
                        setSelectedTestimonial(null)
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Approve
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AdminTestimonials