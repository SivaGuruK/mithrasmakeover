import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import axios from 'axios'
import { getToken } from "../../utils/auth"

const AdminServices = () => {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [selectedFiles, setSelectedFiles] = useState([])  // New state for files

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm()

  const token = getToken();
  console.log(token);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/services`)
        setServices(response.data.data)
      } catch (error) {
        console.error('Error fetching services:', error)
        toast.error('Failed to load services')
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  const handleAddService = () => {
    setEditingService(null)
    reset()
    setSelectedFiles([]) // Clear files when adding new
    setModalOpen(true)
  }

  const handleEditService = (service) => {
    setEditingService(service)
    setValue('title', service.title)
    setValue('description', service.description)
    setValue('price', service.price)
    setValue('duration', service.duration)
    setValue('category', service.category)
    setValue('icon', service.icon)
    setSelectedFiles([]) // Clear files; optionally preload existing images if you want
    setModalOpen(true)
  }

  const handleToggleStatus = async (serviceId, currentStatus) => {
    try {
      await axios.put(`${API_BASE}/api/services/${serviceId}`, { isActive: !currentStatus },
      {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }})

      setServices(services.map(service => 
        service._id === serviceId 
          ? { ...service, isActive: !currentStatus }
          : service
      ))
      toast.success(`Service ${!currentStatus ? 'activated' : 'deactivated'} successfully`)
    } catch (error) {
      toast.error('Failed to update service status')
    }
  }

  const handleDeleteService = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await axios.delete(`${API_BASE}/api/services/${serviceId}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        })

        setServices(services.filter(service => service._id !== serviceId))
        toast.success('Service deleted successfully')
      } catch (error) {
        toast.error('Failed to delete service')
      }
    }
  }

  // Handle files input change, save files in state
  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files)
    setSelectedFiles(files)
  }

  const onSubmit = async (data) => {
    try {
      const formData = new FormData()

      // Append text fields
      formData.append('title', data.title)
      formData.append('description', data.description)
      formData.append('price', Number(data.price))
      formData.append('duration', Number(data.duration))
      formData.append('category', data.category)
      formData.append('icon', data.icon)

      // Append files from selectedFiles state
      selectedFiles.forEach((file) => {
        formData.append('images', file)
      })

      let response;

      if (editingService) {
        response = await axios.put(
          `${API_BASE}/api/services/${editingService._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        )

        setServices(services.map(s => (s._id === editingService._id ? response.data.data : s)))
        toast.success('Service updated successfully')
      } else {
        response = await axios.post(`${API_BASE}/api/services/`, formData, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'multipart/form-data',
          },
        })

        setServices([...services, response.data.data])
        toast.success('Service created successfully')
      }

      setModalOpen(false)
      reset()
      setSelectedFiles([])
    } catch (error) {
      console.error('Error saving service:', error)
      toast.error('Failed to save service')
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
          Services Management
        </h1>
        <button
          onClick={handleAddService}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Service</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(services) && services.map((service, index) => (
          <motion.div
            key={service._id}
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-secondary-900">{service.title}</h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleToggleStatus(service._id, service.isActive)}
                  className={`p-2 rounded-lg transition-colors ${
                    service.isActive
                      ? 'bg-green-100 text-green-600 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={service.isActive ? 'Active' : 'Inactive'}
                >
                  {service.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => handleEditService(service)}
                  className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteService(service._id)}
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="text-secondary-600 mb-4">{service.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <span className="text-sm text-secondary-500">Price</span>
                <div className="text-lg font-semibold text-primary-600">₹{service.price.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-sm text-secondary-500">Duration</span>
                <div className="text-lg font-semibold text-secondary-900">{service.duration} min</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm capitalize">
                {service.category}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                service.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {service.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold text-secondary-900 mb-6">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" encType="multipart/form-data">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Service Title *
                  </label>
                  <input
                    {...register('title', { required: 'Title is required' })}
                    type="text"
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter service title"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    {...register('description', { required: 'Description is required' })}
                    rows={3}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter service description"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Price (₹) *
                    </label>
                    <input
                      {...register('price', {
                        required: 'Price is required',
                        valueAsNumber: true,
                        min: { value: 0, message: 'Price must be positive' }
                      })}
                      type="number"
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter price"
                      min={0}
                      step="0.01"
                    />
                    {errors.price && (
                      <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Duration (minutes) *
                    </label>
                    <input
                      {...register('duration', {
                        required: 'Duration is required',
                        valueAsNumber: true,
                        min: { value: 1, message: 'Duration must be at least 1 minute' }
                      })}
                      type="number"
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Enter duration"
                      min={1}
                    />
                    {errors.duration && (
                      <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Category *
                  </label>
                  <select
                    {...register('category', { required: 'Category is required' })}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select category
                    </option>
                    <option value="">Select category</option>
                       <option value="makeup">Makeup</option>
                       <option value="mehndi">Mehndi</option>
                       <option value="hair">Hair</option>
                       <option value="skincare">Skincare</option>
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                  )}
                </div>

                 <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Icon *
                    </label>
                    <select
                      {...register('icon', { required: 'Icon is required' })}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select icon</option>
                      <option value="heart">Heart</option>
                      <option value="sparkles">Sparkles</option>
                      <option value="palette">Palette</option>
                      <option value="scissors">Scissors</option>
                    </select>
                    {errors.icon && (
                      <p className="text-red-500 text-sm mt-1">{errors.icon.message}</p>
                    )}
                  </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Upload Images/Videos
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFilesChange}
                    className="w-full"
                  />
                  {selectedFiles.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-3 max-h-40 overflow-y-auto">
                      {selectedFiles.map((file, idx) => {
                        const url = URL.createObjectURL(file)
                        const isVideo = file.type.startsWith('video')
                        return (
                          <div key={idx} className="relative w-20 h-20 rounded-md overflow-hidden border border-gray-300">
                            {isVideo ? (
                              <video
                                src={url}
                                className="w-full h-full object-cover"
                                controls
                              />
                            ) : (
                              <img
                                src={url}
                                alt={file.name}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setModalOpen(false)
                      reset()
                      setSelectedFiles([])
                    }}
                    className="px-6 py-3 rounded-lg border border-gray-300 text-secondary-700 hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white transition"
                  >
                    {editingService ? 'Update Service' : 'Add Service'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AdminServices
