import React, { useEffect, useState } from 'react'
import { Outlet, Navigate, useNavigate, Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  Heart, 
  Calendar, 
  Image, 
  MessageSquare, 
  FileText, 
  Users, 
  BarChart3, 
  Share2, 
  LogOut, 
  Menu, 
  X,
  Sparkles 
} from 'lucide-react'
import { isAuthenticated, removeToken } from '../../utils/auth'
import toast from 'react-hot-toast'

const AdminLayout = () => {
  
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/admin/login')
    }
  }, [navigate])

  const handleLogout = () => {
    removeToken()
    toast.success('Logged out successfully')
    navigate('/admin/login')
  }

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin', exact: true },
    { icon: Heart, label: 'Services', path: '/admin/services' },
    { icon: Calendar, label: 'Bookings', path: '/admin/bookings' },
    { icon: Image, label: 'Gallery', path: '/admin/gallery' },
    { icon: MessageSquare, label: 'Testimonials', path: '/admin/testimonials' },
    { icon: FileText, label: 'Content', path: '/admin/content' },
    // { icon: Users, label: 'Users', path: '/admin/users' },
    // { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
    // { icon: Share2, label: 'Social Media', path: '/admin/social-media' },
  ]

  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Mobile Header - Only visible on mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white shadow-md">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-secondary-600 hover:bg-secondary-100"
          >
            <Menu className="h-6 w-6" />
          </button>
          <Link to="/" className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-primary-600" />
            <span className="text-lg font-display font-bold text-primary-600">
              Mithra's Makeover
            </span>
          </Link>
          <div className="w-10" />
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed position for both mobile and desktop */}
      <aside 
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white shadow-xl transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-secondary-200">
          <Link to="/" className="flex items-center space-x-2">
            <Sparkles className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-display font-bold text-primary-600">
              Mithra's Makeover
            </span>
          </Link>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6 space-y-2 overflow-y-auto h-[calc(100vh-180px)]">
          {menuItems.map((item) => {
            const IconComponent = item.icon
            const isActive = item.exact 
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path) && item.path !== '/admin'
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                    : 'text-secondary-700 hover:bg-secondary-100'
                }`}
              >
                <IconComponent className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Logout - Fixed at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-secondary-200 bg-white">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 w-full transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:ml-64">
        {/* Mobile top spacing - only on mobile */}
        <div className="lg:hidden h-16" />
        
        {/* Page Content */}
        <main className="p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout