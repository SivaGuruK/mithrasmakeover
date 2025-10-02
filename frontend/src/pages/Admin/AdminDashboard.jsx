
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  Calendar, 
  Heart, 
  TrendingUp, 
  Eye, 
  DollarSign,
  Clock,
  Star
} from 'lucide-react'
import { useNavigate } from 'react-router-dom';

import axios from 'axios'
import { getToken } from "../../utils/auth"


const AdminDashboard = () => {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({
    overview: {
      totalUsers: 0,
      totalBookings: 0,
      totalServices: 0,
      pendingBookings: 0,
      monthlyRevenue: 0,
      weeklyPageViews: 0
    },
    recentBookings: []
  })

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/admin/dashboard`, {
          headers: { Authorization: `Bearer ${getToken()}` }
        })
        setDashboardData(response.data.data)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const statsCards = [
    {
      title: 'Total Bookings',
      value: dashboardData.overview.totalBookings,
      icon: Calendar,
      color: 'bg-green-500',
    },
    {
      title: 'Active Services',
      value: dashboardData.overview.totalServices,
      icon: Heart,
      color: 'bg-pink-500',
    },
    {
      title: 'Pending Bookings',
      value: dashboardData.overview.pendingBookings,
      icon: Clock,
      color: 'bg-orange-500',
    },
    {
      title: 'Monthly Revenue',
      value: `₹${dashboardData.overview.monthlyRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-purple-500',
    },
    {
      title: 'Weekly Views',
      value: dashboardData.overview.weeklyPageViews,
      icon: Eye,
      color: 'bg-indigo-500',
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
  <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold text-secondary-900">
          Dashboard Overview
        </h1>
        <div className="text-sm text-secondary-600">
          Last updated: {new Date().toLocaleString()}
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
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <IconComponent className="h-6 w-6 text-white" />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Recent Bookings */}
      <motion.div
        className="bg-white rounded-xl shadow-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-secondary-900">Recent Bookings</h2>
          <button className="text-primary-600 hover:text-primary-700 font-medium">
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-secondary-200">
                <th className="text-left py-3 px-4 font-medium text-secondary-600">Customer</th>
                <th className="text-left py-3 px-4 font-medium text-secondary-600">Date</th>
                <th className="text-left py-3 px-4 font-medium text-secondary-600">Status</th>
                <th className="text-left py-3 px-4 font-medium text-secondary-600">Amount</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.recentBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-secondary-100">
                  <td className="py-4 px-4">
                    <div>
                      <div className="font-medium text-secondary-900">{booking.customer.name}</div>
                      <div className="text-sm text-secondary-600">{booking.customer.email}</div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-secondary-700">
                    {new Date(booking.appointmentDate).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : booking.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-medium text-secondary-900">
                    ₹{booking.totalAmount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <button className="bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-lg font-medium transition-colors"  onClick={() => navigate('/admin/services')}>
          Add New Service
        </button>
        <button className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg font-medium transition-colors"  onClick={() => navigate('/admin/bookings')}>
          View Bookings
        </button>
        <button className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg font-medium transition-colors"  onClick={() => navigate('/admin/gallery')}>
          Update Gallery
        </button>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-lg font-medium transition-colors"  onClick={() => navigate('/admin/content')}>
          Update Content
        </button>
      </motion.div>
    </div>
  )
}

export default AdminDashboard