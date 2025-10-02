// ===== SRC/PAGES/ADMIN/ADMINBOOKINGS.JSX (COMPLETE) =====
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, Phone, Mail, Eye, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { getToken } from "../../utils/auth"

const AdminBookings = () => {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${API_BASE}/api/bookings?status=${statusFilter}`,{
                headers: {
                  Authorization: `Bearer ${getToken()}`
                }})
        setBookings(response.data.data)
      } catch (error) {
        console.error('Error fetching bookings:', error)
        toast.error('Failed to load bookings')
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [statusFilter])

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await axios.put(`${API_BASE}/api/bookings/${bookingId}/status`, { status: newStatus },{
              headers: {
                Authorization: `Bearer ${getToken()}`
              }})
      
      setBookings(bookings.map(booking => 
        booking._id === bookingId 
          ? { ...booking, status: newStatus }
          : booking
      ))
      toast.success(`Booking ${newStatus} successfully`)
    } catch (error) {
      toast.error('Failed to update booking status')
    }
  }

  const filteredBookings = statusFilter === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === statusFilter)

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
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
          Bookings Management
        </h1>
        
        {/* Status Filter */}
        <div className="flex space-x-2">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                statusFilter === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-secondary-100 text-secondary-700 hover:bg-primary-100'
              }`}
            >
              {status}
              {status === 'pending' && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {bookings.filter(b => b.status === 'pending').length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Total Bookings</p>
              <p className="text-2xl font-bold text-secondary-900">{bookings.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {bookings.filter(b => b.status === 'pending').length}
              </p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Confirmed</p>
              <p className="text-2xl font-bold text-green-600">
                {bookings.filter(b => b.status === 'confirmed').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-secondary-600">Total Revenue</p>
              <p className="text-2xl font-bold text-primary-600">
                ₹{bookings.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + b.totalAmount, 0).toLocaleString()}
              </p>
            </div>
            <div className="text-primary-600">₹</div>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-50">
              <tr>
                <th className="text-left py-4 px-6 font-medium text-secondary-600">Customer</th>
                <th className="text-left py-4 px-6 font-medium text-secondary-600">Services</th>
                <th className="text-left py-4 px-6 font-medium text-secondary-600">Date & Time</th>
                <th className="text-left py-4 px-6 font-medium text-secondary-600">Status</th>
                <th className="text-left py-4 px-6 font-medium text-secondary-600">Amount</th>
                <th className="text-left py-4 px-6 font-medium text-secondary-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking, index) => (
                <motion.tr
                  key={booking._id}
                  className="border-b border-secondary-100 hover:bg-secondary-25"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-secondary-900">{booking.customer.name}</div>
                      <div className="text-sm text-secondary-600">{booking.customer.email}</div>
                      <div className="text-sm text-secondary-600">{booking.customer.phone}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      {booking.services.map((service, idx) => (
                        <div key={idx} className="text-sm">
<span className="font-medium">{service.service?.title || 'Untitled Service'}</span>
                          <span className="text-secondary-600"> - ₹{service.price.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2 text-secondary-700">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(booking.appointmentDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-secondary-600 text-sm mt-1">
                      <Clock className="h-4 w-4" />
                      <span>{booking.appointmentTime}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(booking.status)}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-secondary-900">
                      ₹{booking.totalAmount.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                            className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                            title="Confirm"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            title="Cancel"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => handleStatusUpdate(booking._id, 'completed')}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                          title="Mark Complete"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
            <div className="text-secondary-400 text-lg">No bookings found</div>
            <p className="text-secondary-500 mt-2">
              {statusFilter === 'all' 
                ? 'No bookings have been made yet' 
                : `No ${statusFilter} bookings found`}
            </p>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
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
                  Booking Details
                </h2>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-secondary-400 hover:text-secondary-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Customer Info */}
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-3">Customer Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-secondary-600" />
                      <span>{selectedBooking.customer.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-5 w-5 text-secondary-600" />
                      <span>{selectedBooking.customer.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-5 w-5 text-secondary-600" />
                      <span>{selectedBooking.customer.phone}</span>
                    </div>
                  </div>
                </div>

                {/* Appointment Details */}
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-3">Appointment Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-secondary-600" />
                      <span>{new Date(selectedBooking.appointmentDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-secondary-600" />
                      <span>{selectedBooking.appointmentTime}</span>
                    </div>
                  </div>
                </div>

                {/* Services */}
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-3">Services</h3>
                  <div className="space-y-2">
                    {selectedBooking.services.map((service, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-secondary-50 rounded-lg">
                        <span className="font-medium">{service.service.title}</span>
                        <span className="text-primary-600 font-semibold">₹{service.price.toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center p-3 bg-primary-50 rounded-lg font-bold">
                      <span>Total Amount</span>
                      <span className="text-primary-600">₹{selectedBooking.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedBooking.notes && (
                  <div>
                    <h3 className="text-lg font-semibold text-secondary-900 mb-3">Notes</h3>
                    <p className="text-secondary-700 bg-secondary-50 p-3 rounded-lg">
                      {selectedBooking.notes}
                    </p>
                  </div>
                )}

                {/* Status */}
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-3">Status</h3>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(selectedBooking.status)}
                    <span className={`px-4 py-2 rounded-full font-medium ${getStatusColor(selectedBooking.status)}`}>
                      {selectedBooking.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Meta Information */}
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-3">Booking Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-secondary-600">Booking ID:</span>
                      <div className="font-medium">#{selectedBooking._id}</div>
                    </div>
                    <div>
                      <span className="text-sm text-secondary-600">Created On:</span>
                      <div className="font-medium">
                        {new Date(selectedBooking.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-4 pt-4 border-t border-secondary-200">
                  {selectedBooking.status === 'pending' && (
                    <>
                      <button
                        onClick={() => {
                          handleStatusUpdate(selectedBooking._id, 'cancelled')
                          setSelectedBooking(null)
                        }}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        Cancel Booking
                      </button>
                      <button
                        onClick={() => {
                          handleStatusUpdate(selectedBooking._id, 'confirmed')
                          setSelectedBooking(null)
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Confirm Booking
                      </button>
                    </>
                  )}
                  
                  {selectedBooking.status === 'confirmed' && (
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedBooking._id, 'completed')
                        setSelectedBooking(null)
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Mark as Completed
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AdminBookings