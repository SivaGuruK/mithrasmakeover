import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Calendar, 
  DollarSign,
  Star,
  ArrowUp,
  ArrowDown,
  RefreshCw
} from 'lucide-react'
import axios from 'axios'
import { getToken } from "../../utils/auth"

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [timeframe, setTimeframe] = useState('30')

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(
          `/api/analytics/dashboard?timeframe=${timeframe}`,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`
            }
          }
        );
        setAnalytics(response.data.data)
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [timeframe])

  const totalPageViews = analytics?.pageViews.reduce((sum, day) => sum + day.views, 0) || 0
  const totalBookings = analytics?.bookingStats.reduce((sum, stat) => sum + stat.count, 0) || 0
  const totalRevenue = analytics?.bookingStats.reduce((sum, stat) => sum + stat.totalRevenue, 0) || 0
  const avgDailyViews = Math.round(totalPageViews / (analytics?.pageViews.length || 1))

  const statsCards = [
    {
      title: 'Total Page Views',
      value: totalPageViews.toLocaleString(),
      icon: Eye,
      color: 'bg-blue-500',
      change: '+23%',
      trend: 'up'
    },
    {
      title: 'Total Bookings',
      value: totalBookings,
      icon: Calendar,
      color: 'bg-green-500',
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'Total Revenue',
      value: `₹${(totalRevenue / 100000).toFixed(1)}L`,
      icon: DollarSign,
      color: 'bg-purple-500',
      change: '+18%',
      trend: 'up'
    },
    {
      title: 'Avg Daily Views',
      value: avgDailyViews,
      icon: TrendingUp,
      color: 'bg-orange-500',
      change: '+15%',
      trend: 'up'
    },
    {
      title: 'Total Users',
      value: analytics?.totalUsers || 0,
      icon: Users,
      color: 'bg-indigo-500',
      change: '+8%',
      trend: 'up'
    },
    {
      title: 'Conversion Rate',
      value: `${((totalBookings / totalPageViews) * 100).toFixed(1)}%`,
      icon: Star,
      color: 'bg-pink-500',
      change: '+5%',
      trend: 'up'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 -mt-[700px]">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold text-secondary-900">
          Analytics Dashboard
        </h1>
        
        <div className="flex items-center space-x-4">
          {/* Timeframe Selector */}
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          
          <button
            onClick={() => window.location.reload()}
            className="p-2 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => {
          const IconComponent = stat.icon
          return (
            <motion.div
              key={stat.title}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-secondary-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-secondary-900 mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.trend === 'up' ? (
                      <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-secondary-500 ml-2">vs last period</span>
                  </div>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Page Views Chart */}
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-secondary-900 mb-6">Page Views Trend</h2>
          <div className="space-y-4">
            {analytics?.pageViews.map((day, index) => (
              <div key={day._id} className="flex items-center justify-between">
                <span className="text-sm text-secondary-600">
                  {new Date(day._id).toLocaleDateString()}
                </span>
                <div className="flex items-center space-x-3 flex-1 mx-4">
                  <div className="flex-1 bg-secondary-100 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${(day.views / Math.max(...analytics.pageViews.map(d => d.views))) * 100}%` 
                      }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-secondary-900 w-8">
                    {day.views}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Popular Services */}
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-xl font-semibold text-secondary-900 mb-6">Popular Services</h2>
          <div className="space-y-4">
            {analytics?.popularServices.map((service, index) => (
              <div key={service._id} className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-secondary-900">{service.service.title}</h3>
                  <p className="text-sm text-secondary-600">{service.bookings} bookings</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-primary-600">
                    ₹{(service.revenue / 1000).toFixed(0)}K
                  </div>
                  <div className="text-sm text-secondary-500">revenue</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Booking Status Distribution */}
      <motion.div
        className="bg-white rounded-xl shadow-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h2 className="text-xl font-semibold text-secondary-900 mb-6">Booking Status Distribution</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {analytics?.bookingStats.map((stat, index) => {
            const colors = {
              confirmed: { bg: 'bg-green-100', text: 'text-green-800', accent: 'bg-green-500' },
              pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', accent: 'bg-yellow-500' },
              completed: { bg: 'bg-blue-100', text: 'text-blue-800', accent: 'bg-blue-500' },
              cancelled: { bg: 'bg-red-100', text: 'text-red-800', accent: 'bg-red-500' }
            }
            const color = colors[stat._id] || colors.pending
            
            return (
              <div key={stat._id} className={`${color.bg} rounded-lg p-4`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-sm font-medium ${color.text} capitalize`}>
                    {stat._id}
                  </span>
                  <div className={`w-3 h-3 ${color.accent} rounded-full`} />
                </div>
                <div className={`text-2xl font-bold ${color.text}`}>
                  {stat.count}
                </div>
                <div className={`text-sm ${color.text} opacity-75`}>
                  ₹{(stat.totalRevenue / 1000).toFixed(0)}K revenue
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Quick Insights */}
      <motion.div
        className="bg-gradient-to-r from-primary-500 to-purple-600 rounded-xl shadow-lg p-6 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-xl font-semibold mb-4">Quick Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium text-primary-100">Best Performing Day</h3>
            <p className="text-lg font-semibold">
              {analytics?.pageViews.length > 0 && 
                new Date(
                  analytics.pageViews.reduce((max, day) => 
                    day.views > max.views ? day : max
                  )._id
                ).toLocaleDateString()
              }
            </p>
            <p className="text-sm text-primary-100">
              {analytics?.pageViews.length > 0 && 
                Math.max(...analytics.pageViews.map(d => d.views))
              } page views
            </p>
          </div>
          <div>
            <h3 className="font-medium text-primary-100">Top Service</h3>
            <p className="text-lg font-semibold">
              {analytics?.popularServices[0]?.service.title}
            </p>
            <p className="text-sm text-primary-100">
              {analytics?.popularServices[0]?.bookings} bookings
            </p>
          </div>
          <div>
            <h3 className="font-medium text-primary-100">Revenue Growth</h3>
            <p className="text-lg font-semibold">+18.5%</p>
            <p className="text-sm text-primary-100">vs previous period</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminAnalytics