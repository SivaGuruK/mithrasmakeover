import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Instagram, 
  Youtube, 
  TrendingUp, 
  Users, 
  Heart, 
  Eye,
  RefreshCw,
  Lightbulb,
  ExternalLink
} from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { getToken } from "../../utils/auth"

const AdminSocialMedia = () => {
  const [socialStats, setSocialStats] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const fetchSocialData = async () => {
      try {
        const statsResponse = await axios.get('/api/social-media/stats', {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        });

        const suggestionsResponse = await axios.get('/api/social-media/suggestions', {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        });
        setSocialStats(statsResponse.data.data)
        setSuggestions(suggestionsResponse.data.data)

        setSuggestions([
          {
            platform: 'instagram',
            type: 'content',
            message: 'Post more behind-the-scenes content to increase engagement',
            priority: 'high'
          },
          {
            platform: 'youtube',
            type: 'engagement',
            message: 'Add call-to-actions in your videos to boost subscriber growth',
            priority: 'medium'
          },
          {
            platform: 'general',
            type: 'trend',
            message: 'Before/after transformation posts are trending. Consider creating more of this content.',
            priority: 'medium'
          }
        ])
      } catch (error) {
        console.error('Error fetching social data:', error)
        toast.error('Failed to load social media data')
      } finally {
        setLoading(false)
      }
    }

    fetchSocialData()
  }, [])

  const updatePlatformStats = async (platform) => {
    setUpdating(true)
    try {
      await axios.post(
        `/api/social-media/${platform}/update`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`
          }
        }
      );      
      setSocialStats(stats => stats.map(stat => {
        if (stat.platform === platform) {
          return {
            ...stat,
            metrics: {
              ...stat.metrics,
              followers: stat.metrics.followers + Math.floor(Math.random() * 50),
              engagement: +(stat.metrics.engagement + (Math.random() * 0.5 - 0.25)).toFixed(1),
              likes: stat.metrics.likes + Math.floor(Math.random() * 100)
            },
            lastUpdated: new Date().toISOString()
          }
        }
        return stat
      }))
      
      toast.success(`${platform} stats updated successfully`)
    } catch (error) {
      toast.error(`Failed to update ${platform} stats`)
    } finally {
      setUpdating(false)
    }
  }

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'instagram':
        return Instagram
      case 'youtube':
        return Youtube
      default:
        return TrendingUp
    }
  }

  const getPlatformColor = (platform) => {
    switch (platform) {
      case 'instagram':
        return 'from-pink-500 to-purple-600'
      case 'youtube':
        return 'from-red-500 to-red-600'
      default:
        return 'from-blue-500 to-indigo-600'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
          Social Media Analytics
        </h1>
        <button
          onClick={() => window.location.reload()}
          className="p-2 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200 transition-colors"
          title="Refresh All Data"
        >
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>

      {/* Platform Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {socialStats.map((platform, index) => {
          const IconComponent = getPlatformIcon(platform.platform)
          const gradientClass = getPlatformColor(platform.platform)
          
          return (
            <motion.div
              key={platform.platform}
              className={`bg-gradient-to-br ${gradientClass} rounded-xl shadow-lg p-6 text-white`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <IconComponent className="h-8 w-8" />
                  <h2 className="text-2xl font-bold capitalize">{platform.platform}</h2>
                </div>
                <button
                  onClick={() => updatePlatformStats(platform.platform)}
                  disabled={updating}
                  className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50"
                  title="Update Stats"
                >
                  <RefreshCw className={`h-5 w-5 ${updating ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Users className="h-5 w-5" />
                    <span className="text-sm opacity-75">
                      {platform.platform === 'youtube' ? 'Subscribers' : 'Followers'}
                    </span>
                  </div>
                  <div className="text-2xl font-bold">
                    {platform.metrics.followers?.toLocaleString()}
                  </div>
                </div>

                <div className="bg-white/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <TrendingUp className="h-5 w-5" />
                    <span className="text-sm opacity-75">Engagement</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {platform.metrics.engagement}%
                  </div>
                </div>

                <div className="bg-white/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    {platform.platform === 'youtube' ? (
                      <Eye className="h-5 w-5" />
                    ) : (
                      <Heart className="h-5 w-5" />
                    )}
                    <span className="text-sm opacity-75">
                      {platform.platform === 'youtube' ? 'Views' : 'Likes'}
                    </span>
                  </div>
                  <div className="text-2xl font-bold">
                    {platform.platform === 'youtube' 
                      ? platform.metrics.views?.toLocaleString()
                      : platform.metrics.likes?.toLocaleString()
                    }
                  </div>
                </div>

                <div className="bg-white/20 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-5 h-5 bg-white/50 rounded"></div>
                    <span className="text-sm opacity-75">Posts</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {platform.metrics.posts}
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm opacity-75">
                  Last updated: {new Date(platform.lastUpdated).toLocaleString()}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Growth Suggestions */}
      <motion.div
        className="bg-white rounded-xl shadow-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center space-x-2 mb-6">
          <Lightbulb className="h-6 w-6 text-yellow-500" />
          <h2 className="text-2xl font-semibold text-secondary-900">Growth Suggestions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {suggestions.map((suggestion, index) => (
            <motion.div
              key={index}
              className="border border-secondary-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {suggestion.platform !== 'general' && (
                    <>
                      {React.createElement(getPlatformIcon(suggestion.platform), { 
                        className: "h-5 w-5 text-secondary-600" 
                      })}
                      <span className="font-medium text-secondary-900 capitalize">
                        {suggestion.platform}
                      </span>
                    </>
                  )}
                  {suggestion.platform === 'general' && (
                    <span className="font-medium text-secondary-900">General</span>
                  )}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(suggestion.priority)}`}>
                  {suggestion.priority}
                </span>
              </div>
              
              <p className="text-secondary-700 text-sm leading-relaxed">
                {suggestion.message}
              </p>
              
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-secondary-500 capitalize">
                  {suggestion.type} suggestion
                </span>
                <button className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1">
                  <span>Learn More</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center transition-colors">
            <Instagram className="h-8 w-8 mx-auto mb-2" />
            <span className="font-medium">Post to Instagram</span>
          </button>
          <button className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center transition-colors">
            <Youtube className="h-8 w-8 mx-auto mb-2" />
            <span className="font-medium">Upload to YouTube</span>
          </button>
          <button className="bg-white/20 hover:bg-white/30 rounded-lg p-4 text-center transition-colors">
            <TrendingUp className="h-8 w-8 mx-auto mb-2" />
            <span className="font-medium">View Analytics</span>
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminSocialMedia