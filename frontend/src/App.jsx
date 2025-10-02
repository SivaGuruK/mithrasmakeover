import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './components/sections/About'
import Services from './components/sections/Services'
import Gallery from './components/sections/Gallery'
import Contact from './components/sections/Contact'
import BookingForm from './pages/BookingForm'
import AdminDashboard from './pages/Admin/AdminDashboard'
import AdminLogin from './pages/Admin/AdminLogin'
import AdminLayout from './pages/Admin/AdminLayout'
import AdminTestimonials from './pages/Admin/AdminTestimonials'
// import AdminUsers from './pages/Admin/AdminUsers'
// import AdminAnalytics from './pages/Admin/AdminAnalytics'
// import AdminSocialMedia from './pages/Admin/AdminSocialMedia'
import AdminServices from './pages/Admin/AdminServices'
import AdminBookings from './pages/Admin/AdminBookings'
import AdminGallery from './pages/Admin/AdminGallery'
import AdminContent from './pages/Admin/AdminContent'
import TestimonialForm from './components/TestmonialForm'

function AppContent() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  return (
    <>
      {/* Render Navbar only if NOT admin route */}
      {!isAdminRoute && <Navbar />}

      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/book-appointment" element={<BookingForm />} />
          <Route path="/submit-testimonial" element={<TestimonialForm />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="content" element={<AdminContent />} />
            {/* <Route path="users" element={<AdminUsers />} /> */}
            {/* <Route path="analytics" element={<AdminAnalytics />} /> */}
            {/* <Route path="social-media" element={<AdminSocialMedia />} /> */}
          </Route>
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
      <Toaster position="top-right" />
    </>
  )
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <AppContent />
      </div>
    </Router>
  )
}

export default App
