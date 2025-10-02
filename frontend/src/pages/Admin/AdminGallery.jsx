import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Upload, Edit, Trash2, Plus, X, Filter } from 'lucide-react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import axios from 'axios'
import { getToken } from "../../utils/auth"


const AdminGallery = () => {
  const [galleryItems, setGalleryItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [previewImage, setPreviewImage] = useState(null)
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm()
  const [imageFile, setImageFile] = useState(null);


  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await axios.get('/api/gallery',{
                        headers: {
                          Authorization: `Bearer ${getToken()}`
                        }})
        setGalleryItems(response.data.data)
      } catch (error) {
        console.error('Error fetching gallery:', error)
        toast.error('Failed to load gallery')
      } finally {
        setLoading(false)
      }
    }

    fetchGallery()
  }, [])

  const categories = ['all', 'bridal', 'party', 'mehndi', 'hair', 'behind-scenes']
  const filteredItems = selectedCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory)

  const handleAddImage = () => {
    setEditingItem(null)
    reset()
    setPreviewImage(null)
    setModalOpen(true)
    setImageFile(null);
  }

  const handleEditImage = (item) => {
    setEditingItem(item)
    setValue('title', item.title)
    setValue('description', item.description)
    setValue('category', item.category)
    setValue('tags', item.tags.join(', '))
    setPreviewImage(item.mediaUrl)
    setModalOpen(true)
    setImageFile(null)
  }

  const handleDeleteImage = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this Media?')) {
      try {
        await axios.delete(`/api/gallery/${itemId}`,{
                        headers: {
                          Authorization: `Bearer ${getToken()}`
                        }})
        
        setGalleryItems(galleryItems.filter(item => item._id !== itemId))
        toast.success('Media deleted successfully')
      } catch (error) {
        toast.error('Failed to delete Media')
      }
    }
  }

const handleMediaUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (file.size > 50 * 1024 * 1024) { 
      toast.error('File size should be less than 50MB');
      return;
    }

    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      toast.error('Please select a valid image or video file');
      return;
    }

    setImageFile(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewImage(e.target.result);
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('video/')) {
      const videoUrl = URL.createObjectURL(file);
      setPreviewImage(videoUrl);
    }
  }
};

  const onSubmit = async (data) => {
  try {
    if (!imageFile && !editingItem) {
      toast.error('Please select an Media');
      return;
    }

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('category', data.category);
    formData.append('tags', data.tags || '');

    if (imageFile) {
      formData.append('image', imageFile); 
    }

    if (editingItem) {
      await axios.put(
        `/api/gallery/${editingItem._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      toast.success('Media updated successfully');
    } else {
      const response = await axios.post(
        '/api/gallery',
        formData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      const newItem = response.data.data;
      setGalleryItems([newItem, ...galleryItems]);
      toast.success('Media uploaded successfully');
    }

    setModalOpen(false);
    reset();
    setPreviewImage(null);
    setImageFile(null);
  } catch (error) {
    console.error(error);
    toast.error('Failed to save Media');
  }
};

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
          Gallery Management
        </h1>
        <button
          onClick={handleAddImage}
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Media</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Total Media's</p>
              <p className="text-2xl font-bold text-secondary-900">{galleryItems.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Bridal</p>
              <p className="text-2xl font-bold text-pink-600">
                {galleryItems.filter(item => item.category === 'bridal').length}
              </p>
            </div>
            <div className="bg-pink-100 p-3 rounded-lg">
              <svg className="h-6 w-6 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Party</p>
              <p className="text-2xl font-bold text-purple-600">
                {galleryItems.filter(item => item.category === 'party').length}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Mehndi</p>
              <p className="text-2xl font-bold text-orange-600">
                {galleryItems.filter(item => item.category === 'mehndi').length}
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-lg">
              <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
              selectedCategory === category
                ? 'bg-primary-600 text-white'
                : 'bg-secondary-100 text-secondary-700 hover:bg-primary-100'
            }`}
          >
            {category.replace('-', ' ')}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item, index) => (
          <motion.div
            key={item._id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="relative aspect-square">
            { item.mediaType === 'video' ? (
                 <video
                    src={item.mediaUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={item.mediaUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                )}

              <div className="absolute top-2 right-2 flex space-x-1">
                <button
                  onClick={() => handleEditImage(item)}
                  className="p-2 bg-white/90 text-blue-600 rounded-lg hover:bg-white transition-colors"
                  title="Edit"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteImage(item._id)}
                  className="p-2 bg-white/90 text-red-600 rounded-lg hover:bg-white transition-colors"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-secondary-900 mb-2 truncate">{item.title}</h3>
              <p className="text-sm text-secondary-600 mb-3 line-clamp-2">{item.description}</p>
              
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-medium capitalize">
                  {item.category}
                </span>
                <span className="text-xs text-secondary-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
              
              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="px-2 py-1 bg-secondary-100 text-secondary-600 rounded text-xs">
                      #{tag}
                    </span>
                  ))}
                  {item.tags.length > 3 && (
                    <span className="px-2 py-1 bg-secondary-100 text-secondary-600 rounded text-xs">
                      +{item.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <svg className="h-12 w-12 text-secondary-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <div className="text-secondary-400 text-lg">No Media found</div>
          <p className="text-secondary-500 mt-2">
            {selectedCategory === 'all' 
              ? 'Upload your first Media to get started' 
              : `No ${selectedCategory.replace('-', ' ')} Media found`}
          </p>
        </div>
      )}

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
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-secondary-900">
                  {editingItem ? 'Edit Media' : 'Add New Media'}
                </h2>
                <button
                  onClick={() => {
                    setModalOpen(false);
                    setImageFile(null);
                  }}
                  className="text-secondary-400 hover:text-secondary-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Media *
                  </label>
                  {previewImage ? (
                      <div className="relative">
                        {imageFile?.type?.startsWith('video/') ? (
                          <video
                            src={previewImage}
                            controls
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        ) : (
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        )}

                      <button
                        type="button"
                        onClick={() => setPreviewImage(null)}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-secondary-300 rounded-lg p-6 text-center">
                      <Upload className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
                      <label className="cursor-pointer">
                        <span className="text-primary-600 hover:text-primary-700 font-medium">
                          Click to upload
                        </span>
                        <input
                          type="file"
                          accept="image/*,video/*"
                          onChange={handleMediaUpload}
                          className="hidden"
                        />
                      </label>
                      <p className="text-sm text-secondary-500 mt-2">PNG, JPG, JPEG, WebP ,Video's upto 5MB</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Title *
                  </label>
                  <input
                    {...register('title', { required: 'Title is required' })}
                    type="text"
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter Media title"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Description
                  </label>
                  <textarea
                    {...register('description')}
                    rows={3}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter Media description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Category *
                    </label>
                    <select
                      {...register('category', { required: 'Category is required' })}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Select category</option>
                      <option value="bridal">Bridal</option>
                      <option value="party">Party</option>
                      <option value="mehndi">Mehndi</option>
                      <option value="hair">Hair</option>
                      <option value="behind-scenes">Behind Scenes</option>
                    </select>
                    {errors.category && (
                      <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-2">
                      Tags (comma-separated)
                    </label>
                    <input
                      {...register('tags')}
                      type="text"
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="tag1, tag2, tag3"
                    />
                    <p className="text-xs text-secondary-500 mt-1">
                      Separate tags with commas (e.g., bridal, elegant, traditional)
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                    setModalOpen(false);
                    setImageFile(null);
                  }}
                    className="px-6 py-3 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    {editingItem ? 'Update Media' : 'Upload Media'}
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

export default AdminGallery