import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [heroData, setHeroData] = useState(null);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await axios.get('/api/content/hero');
        setHeroData(res.data.data?.data);
      } catch (err) {
        console.error('Failed to fetch hero content', err);
      }
    };
    fetchHero();
  }, []);

  if (!heroData) return null; // or loading spinner

  return (
    <section className="gradient-bg min-h-screen flex items-center">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold text-secondary-900">
              {heroData?.title?.split(' ')[0]}{' '}
              <span className="text-primary-600 block">
                {heroData?.title?.split(' ').slice(1).join(' ')}
              </span>
            </h1>

            <p className="text-xl text-secondary-600 leading-relaxed">
              {heroData?.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/book-appointment" className="btn-primary">
                {heroData?.primaryButton || 'Book Appointment'}
              </Link>
              <Link to="/gallery" className="btn-secondary">
                {heroData?.secondaryButton || 'View Portfolio'}
              </Link>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative rounded-full overflow-hidden w-96 h-96 mx-auto">
              <img
                src={heroData?.image || 'https://via.placeholder.com/400'}
                alt="MITHRA'S MAKEOVER"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-600/30 to-transparent"></div>
            </div>

            {/* Floating elements (static or dynamic if needed) */}
            <motion.div 
              className="absolute top-10 right-10 bg-white p-4 rounded-lg shadow-lg"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="text-primary-600 font-semibold">8+ Years</div>
              <div className="text-sm text-secondary-600">Experience</div>
            </motion.div>

            <motion.div 
              className="absolute bottom-10 left-10 bg-white p-4 rounded-lg shadow-lg"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              <div className="text-primary-600 font-semibold">500+</div>
              <div className="text-sm text-secondary-600">Happy Brides</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
