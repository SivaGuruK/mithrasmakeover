import React from 'react'
import { Sparkles, Phone, Mail, MapPin, Instagram, Youtube } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa';


const Footer = () => {
  return (
    <footer className="bg-secondary-900 text-white">
      <div className="section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="h-8 w-8 text-primary-400" />
              <span className="text-2xl font-display font-bold text-primary-400">
                MITHRA'S MAKEOVER
              </span>
            </div>
            <p className="text-secondary-300 mb-6">
              Transform your special moments with professional makeup artistry and 
              intricate mehndi designs that celebrate your unique beauty.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/mithrasmakeover/" className="text-secondary-300 hover:text-primary-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.youtube.com/@mithrasmakeover" className="text-secondary-300 hover:text-primary-400 transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="https://wa.me/918608107011" className="text-secondary-300 hover:text-primary-400 transition-colors">
                <FaWhatsapp className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/services" className="text-secondary-300 hover:text-primary-400 transition-colors">Services</a></li>
              <li><a href="/gallery" className="text-secondary-300 hover:text-primary-400 transition-colors">Gallery</a></li>
              <li><a href="/about" className="text-secondary-300 hover:text-primary-400 transition-colors">About</a></li>
              <li><a href="/contact" className="text-secondary-300 hover:text-primary-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-primary-400" />
                <span className="text-secondary-300">+91 86081 07011</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-primary-400" />
                <span className="text-secondary-300">mithrasmakeover28@gmail.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-primary-400" />
                <span className="text-secondary-300">Coonoor,Tamil Nadu,India</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-secondary-700 mt-8 pt-8 text-center">
          <p className="text-secondary-400">
            © 2025 Mithra's Makeover All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer