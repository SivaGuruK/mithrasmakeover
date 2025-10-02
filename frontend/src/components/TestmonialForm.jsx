import React, { useState } from 'react'
import { Star, Send, Upload, X } from 'lucide-react'

const TestimonialForm = () => {
  const [formData, setFormData] = useState({
    clientName: '',
    service: '',
    review: ''
  })
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [errors, setErrors] = useState({})

  const services = [
    'Bridal Makeup',
    'Party Makeup',
    'Engagement Makeup',
    'Pre-Wedding Shoot',
    'Reception Makeup',
    'Traditional Makeup',
    'HD Makeup',
    'Airbrush Makeup'
  ]

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImagePreview(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Name is required'
    }
    
    if (!formData.service) {
      newErrors.service = 'Please select a service'
    }
    
    if (!formData.review.trim()) {
      newErrors.review = 'Review is required'
    } else if (formData.review.trim().length < 20) {
      newErrors.review = 'Review must be at least 20 characters'
    }
    
    if (rating === 0) {
      newErrors.rating = 'Please select a rating'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

const handleSubmit = async () => {
  if (!validateForm()) return;

  setLoading(true);

  try {
    const formDataToSend = new FormData();
    formDataToSend.append('clientName', formData.clientName);
    formDataToSend.append('service', formData.service);
    formDataToSend.append('review', formData.review);
    formDataToSend.append('rating', rating);

    // Only append image if exists
    if (imagePreview) {
      const blob = await (await fetch(imagePreview)).blob();
      const file = new File([blob], 'testimonial-image.jpg', { type: blob.type });
      formDataToSend.append('clientImage', file);
    }

    const response = await fetch('/api/testimonials', {
      method: 'POST',
      body: formDataToSend,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Something went wrong');
    }

    alert('Thank you! Your testimonial has been submitted for review.');

    // Reset form
    setFormData({ clientName: '', service: '', review: '' });
    setRating(0);
    setImagePreview(null);
    setErrors({});
  } catch (error) {
    console.error('Submission error:', error);
    alert('Failed to submit testimonial. Please try again later.');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Share Your Experience</h2>
        <p className="text-gray-600 mb-6">We'd love to hear about your experience with our services</p>
        
        <div className="space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Name *
            </label>
            <input
              name="clientName"
              value={formData.clientName}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              placeholder="Enter your name"
            />
            {errors.clientName && (
              <p className="text-red-500 text-sm mt-1">{errors.clientName}</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Photo (Optional)
            </label>
            <div className="flex items-center space-x-4">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-24 h-24 rounded-full object-cover border-4 border-pink-100"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-md"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <label className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded-full cursor-pointer hover:border-pink-500 hover:bg-pink-50 transition-all">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Upload className="h-8 w-8 text-gray-400" />
                </label>
              )}
              <div className="flex-1">
                <p className="text-sm text-gray-600 font-medium">
                  Upload your photo for a more personal testimonial
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Max size: 5MB • Formats: JPG, PNG
                </p>
              </div>
            </div>
          </div>

          {/* Service Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service *
            </label>
            <select
              name="service"
              value={formData.service}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all bg-white"
            >
              <option value="">Select a service</option>
              {services.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
            {errors.service && (
              <p className="text-red-500 text-sm mt-1">{errors.service}</p>
            )}
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating *
            </label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => {
                    setRating(star)
                    if (errors.rating) {
                      setErrors(prev => ({ ...prev, rating: '' }))
                    }
                  }}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-9 w-9 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {errors.rating && (
              <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
            )}
          </div>

          {/* Review Textarea */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Review *
            </label>
            <textarea
              name="review"
              value={formData.review}
              onChange={handleInputChange}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all resize-none"
              placeholder="Tell us about your experience... (minimum 20 characters)"
            />
            <div className="flex justify-between items-center mt-1">
              {errors.review ? (
                <p className="text-red-500 text-sm">{errors.review}</p>
              ) : (
                <p className="text-gray-500 text-xs">
                  {formData.review.length} characters
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white py-4 rounded-lg font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span>Submit Testimonial</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TestimonialForm  