import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Eye, Edit, Globe } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import axios from 'axios'
import { getToken } from "../../utils/auth"


const AdminContent = () => {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
  const [selectedSection, setSelectedSection] = useState('hero')
  const [content, setContent] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm()

  const sections = [
    { key: 'hero', label: 'Hero Section', icon: '🏠', description: 'Main landing page content' },
    { key: 'about', label: 'About Section', icon: '👤', description: 'About Mithra and stats' },
    { key: 'contact', label: 'Contact Info', icon: '📞', description: 'Phone, email, address' },
    { key: 'services', label: 'Services Intro', icon: '💄', description: 'Services section headers' },
    { key: 'testimonials', label: 'Testimonials Intro', icon: '💬', description: 'Client reviews headers' }
  ]

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/content`,{
                                headers: {
                                  Authorization: `Bearer ${getToken()}`
                                }})
        const contentData = {}
        response.data.data.forEach(item => {
          contentData[item.section] = item.data
        })
        setContent(contentData)
      } catch (error) {
        console.error('Error fetching content:', error)
        toast.error('Failed to load content')
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [])

  useEffect(() => {
    if (content[selectedSection]) {
      const sectionData = content[selectedSection]
       if (sectionData.image) {
  setValue('image', sectionData.image);
}
      reset()
      Object.keys(sectionData).forEach(key => {
        if (typeof sectionData[key] === 'object' && sectionData[key] !== null) {
          Object.keys(sectionData[key]).forEach(subKey => {
            setValue(`${key}.${subKey}`, sectionData[key][subKey])
          })
        } else {
          setValue(key, sectionData[key])
        }
      })
    }
  }, [selectedSection, content, setValue, reset])

const onSubmit = async (formValues) => {
  setSaving(true);
  const formData = new FormData();

  // Determine which section is active
  const section = selectedSection;

  // 🔁 Handle section-specific fields - ONLY send fields for the current section
  if (section === 'hero') {
    formData.append('title', formValues.title || '');
    formData.append('subtitle', formValues.subtitle || '');
    formData.append('primaryButton', formValues.primaryButton || '');
    formData.append('secondaryButton', formValues.secondaryButton || '');
    
    // Handle image for hero section
    if (formValues.image instanceof File) {
      formData.append('image', formValues.image);
    } else if (typeof formValues.image === 'string') {
      formData.append('existingImage', formValues.image);
    }
  }
  else if (section === 'about') {
    formData.append('title', formValues.title || '');
    formData.append('description', formValues.description || '');
    formData.append('stats[happyBrides]', formValues.stats?.happyBrides || '');
    formData.append('stats[yearsExperience]', formValues.stats?.yearsExperience || '');
    formData.append('stats[certification]', formValues.stats?.certification || '');
    formData.append('stats[specialization]', formValues.stats?.specialization || '');
    
    // Handle image for about section
    if (formValues.image instanceof File) {
      formData.append('image', formValues.image);
    } else if (typeof formValues.image === 'string') {
      formData.append('existingImage', formValues.image);
    }
  }
  else if (section === 'contact') {
    formData.append('phone', formValues.phone || '');
    formData.append('email', formValues.email || '');
    formData.append('address', formValues.address || '');
    formData.append('socialMedia[instagram]', formValues.socialMedia?.instagram || '');
    formData.append('socialMedia[youtube]', formValues.socialMedia?.youtube || '');
    formData.append('socialMedia[whatsapp]', formValues.socialMedia?.whatsapp || '');
  }
  else if (section === 'services' || section === 'testimonials') {
    formData.append('title', formValues.title || '');
    formData.append('subtitle', formValues.subtitle || '');
  }

  try {
    const res = await axios.put(`${API_BASE}/api/content/${section}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${getToken()}`,
      },
    });

    console.log(`${section} content updated:`, res.data);
    
    // Update local content state
    setContent(prev => ({
      ...prev,
      [section]: res.data.data.data
    }));
    
    toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} section updated successfully!`);
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || 'Update failed!');
  } finally {
    setSaving(false);
  }
};
  const renderSectionForm = () => {
    switch (selectedSection) {
      case 'hero':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="text-blue-800 font-medium mb-2">Hero Section</h4>
              <p className="text-blue-700 text-sm">
                This content appears on the main landing page and is the first thing visitors see.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Main Title *
              </label>
              <input
                {...register('title', { required: 'Title is required' })}
                type="text"
                className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Beauty That Captivates"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
              <p className="text-xs text-secondary-500 mt-1">
                This appears as the large heading on your homepage
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Subtitle *
              </label>
              <textarea
                {...register('subtitle', { required: 'Subtitle is required' })}
                rows={3}
                className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Transform your special moments with professional makeup artistry..."
              />
              {errors.subtitle && (
                <p className="text-red-500 text-sm mt-1">{errors.subtitle.message}</p>
              )}
              <p className="text-xs text-secondary-500 mt-1">
                Descriptive text that appears below the main title
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Primary Button Text
                </label>
                <input
                  {...register('primaryButton')}
                  type="text"
                  className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Book Appointment"
                />
                <p className="text-xs text-secondary-500 mt-1">Main call-to-action button</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Secondary Button Text
                </label>
                <input
                  {...register('secondaryButton')}
                  type="text"
                  className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="View Portfolio"
                />
                <p className="text-xs text-secondary-500 mt-1">Secondary action button</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Hero Image
                </label>
                {watch('image') && typeof watch('image') === 'string' && (
                      <div className="mb-4">
                        <p className="text-sm text-secondary-700 mb-1">Current Image:</p>
                        <img
                          src={watch('image')}
                          alt="Current"
                          className="w-full max-w-xs rounded-lg border border-secondary-200"
                        />
                      </div>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setValue('image', file);
                        }
                      }}
                      className="w-full"
                    />

                <p className="text-xs text-secondary-500 mt-1">Upload homepage hero image</p>
              </div>

            </div>
          </div>
        )

      case 'about':
        return (
          <div className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="text-green-800 font-medium mb-2">About Section</h4>
              <p className="text-green-700 text-sm">
                Information about you, your experience, and your achievements.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Section Title *
              </label>
              <input
                {...register('title', { required: 'Title is required' })}
                type="text"
                className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Meet Mithra"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                About Description *
              </label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                rows={4}
                className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="With over 8 years of experience in the beauty industry..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
              )}
              <p className="text-xs text-secondary-500 mt-1">
                Your professional background and expertise
              </p>
            </div>

            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold text-secondary-900 mb-4">Statistics</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Happy Brides Count
                  </label>
                  <input
                    {...register('stats.happyBrides')}
                    type="text"
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="500+"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Years Experience
                  </label>
                  <input
                    {...register('stats.yearsExperience')}
                    type="text"
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="8+"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Certification Title
                  </label>
                  <input
                    {...register('stats.certification')}
                    type="text"
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Certified Professional"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Specialization
                  </label>
                  <input
                    {...register('stats.specialization')}
                    type="text"
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Licensed makeup artist and mehndi specialist"
                  />
                </div>
                <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      About Image
                    </label>
                    {watch('image') && typeof watch('image') === 'string' && (
                              <div className="mb-4">
                                <p className="text-sm text-secondary-700 mb-1">Current Image:</p>
                                <img
                                  src={watch('image')}
                                  alt="Current"
                                  className="w-full max-w-xs rounded-lg border border-secondary-200"
                                />
                              </div>
                            )}

                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  setValue('image', file);
                                }
                              }}
                              className="w-full"
                            />

                    <p className="text-xs text-secondary-500 mt-1">Upload an image for the about section</p>
                  </div>
              </div>
            </div>
          </div>
        )

      case 'contact':
        return (
          <div className="space-y-6">
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h4 className="text-purple-800 font-medium mb-2">Contact Information</h4>
              <p className="text-purple-700 text-sm">
                Your contact details that appear on the website and in the footer.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Phone Number *
                </label>
                <input
                  {...register('phone', { required: 'Phone is required' })}
                  type="tel"
                  className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="+91 98765 43210"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Email Address *
                </label>
                <input
                  {...register('email', { required: 'Email is required' })}
                  type="email"
                  className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="hello@mithrasmakeover.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Studio Address *
              </label>
              <textarea
                {...register('address', { required: 'Address is required' })}
                rows={2}
                className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Coonoor,Tamil Nadu"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
              )}
            </div>

            <div className="border-t pt-6">
              <h4 className="text-lg font-semibold text-secondary-900 mb-4">Social Media Links</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Instagram URL
                  </label>
                  <input
                    {...register('socialMedia.instagram')}
                    type="url"
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="https://instagram.com/mithrasmakeover"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    YouTube URL
                  </label>
                  <input
                    {...register('socialMedia.youtube')}
                    type="url"
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="https://youtube.com/mithrasmakeover"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    WhatsAPP
                  </label>
                  <input
                    {...register('socialMedia.whatsapp')}
                    type="url"
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="https://wa.me/918608107011"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 'services':
      case 'testimonials':
        return (
          <div className="space-y-6">
            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <h4 className="text-orange-800 font-medium mb-2">
                {selectedSection === 'services' ? 'Services' : 'Testimonials'} Section Headers
              </h4>
              <p className="text-orange-700 text-sm">
                The title and subtitle that appear at the top of the {selectedSection} section.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Section Title *
              </label>
              <input
                {...register('title', { required: 'Title is required' })}
                type="text"
                className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder={selectedSection === 'services' ? 'Our Services' : 'Client Love'}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Section Subtitle *
              </label>
              <textarea
                {...register('subtitle', { required: 'Subtitle is required' })}
                rows={3}
                className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder={
                  selectedSection === 'services' 
                    ? 'Professional beauty services tailored to make your special moments unforgettable' 
                    : 'What our beautiful clients say about us'
                }
              />
              {errors.subtitle && (
                <p className="text-red-500 text-sm mt-1">{errors.subtitle.message}</p>
              )}
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center py-12">
            <Edit className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
            <p className="text-secondary-600">Select a section to edit</p>
          </div>
        )
    }
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
          Content Management
        </h1>
        <button
          onClick={() => window.open('/', '_blank')}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
        >
          <Globe className="h-4 w-4" />
          <span>Preview Website</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sections Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-4 sticky top-4">
            <h2 className="text-lg font-semibold text-secondary-900 mb-4">Website Sections</h2>
            <div className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.key}
                  onClick={() => setSelectedSection(section.key)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    selectedSection === section.key
                      ? 'bg-primary-100 text-primary-700 border border-primary-200'
                      : 'text-secondary-700 hover:bg-secondary-100'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-xl">{section.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{section.label}</div>
                      <div className="text-xs text-secondary-500 mt-1">{section.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Editor */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-lg">
            <div className="p-6 border-b border-secondary-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-secondary-900">
                  Edit {sections.find(s => s.key === selectedSection)?.label}
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-secondary-600">
                    Last saved: {new Date().toLocaleTimeString()}
                  </span>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6">
              {renderSectionForm()}

              <div className="flex items-center justify-between pt-8 border-t border-secondary-200 mt-8">
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => reset()}
                    className="px-4 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors"
                  >
                    Reset Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => window.open('/', '_blank')}
                    className="flex items-center space-x-2 px-4 py-2 bg-secondary-100 text-secondary-700 rounded-lg hover:bg-secondary-200 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Preview</span>
                  </button>
                </div>
                
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminContent