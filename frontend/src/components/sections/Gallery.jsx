// import React, { useState, useEffect, useRef } from 'react'
// import { motion } from 'framer-motion'
// import { ChevronLeft, ChevronRight } from 'lucide-react'
// import axios from 'axios'

// const Gallery = () => {
//   const [selectedCategory, setSelectedCategory] = useState('all')
//   const [galleryItems, setGalleryItems] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [currentSlide, setCurrentSlide] = useState(0)
//   const sliderRef = useRef(null)

//   const categories = ['all', 'bridal', 'party', 'mehndi', 'hair', 'behind-scenes']

//   const filteredItems = selectedCategory === 'all' 
//     ? galleryItems 
//     : galleryItems.filter(item => item.category === selectedCategory)

//   useEffect(() => {
//     const fetchGallery = async () => {
//       try {
//         const response = await axios.get(`/api/gallery${selectedCategory !== 'all' ? `?category=${selectedCategory}` : ''}`)
//         // Filter out invalid items
//         const validItems = response.data.data.filter(item => 
//           (item.mediaUrl || item.imageUrl || item.videoUrl) && item.mediaType
//         )
//         setGalleryItems(validItems)
//       } catch (error) {
//         console.error('Error fetching gallery:', error)
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchGallery()
//     setCurrentSlide(0) // Reset slider when category changes
//   }, [selectedCategory])

//   // Mobile slider navigation
//   const nextSlide = () => {
//     if (currentSlide < filteredItems.length - 1) {
//       setCurrentSlide(prev => prev + 1)
//     }
//   }

//   const prevSlide = () => {
//     if (currentSlide > 0) {
//       setCurrentSlide(prev => prev - 1)
//     }
//   }

//   // Auto-scroll slider on mobile
//   useEffect(() => {
//     if (sliderRef.current) {
//       const slideWidth = sliderRef.current.offsetWidth
//       sliderRef.current.scrollTo({
//         left: currentSlide * slideWidth,
//         behavior: 'smooth'
//       })
//     }
//   }, [currentSlide])

//   if (loading) {
//     return (
//       <section className="py-20 bg-white">
//         <div className="section-container flex justify-center items-center min-h-[400px]">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
//         </div>
//       </section>
//     )
//   }

//   return (
//     <section className="py-20 bg-white">
//       <div className="section-container">
//         <motion.div 
//           className="text-center mb-16"
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.8 }}
//           viewport={{ once: true }}
//         >
//           <h2 className="text-4xl md:text-5xl font-display font-bold text-secondary-900 mb-6">
//             Gallery & Reels
//           </h2>
//           <p className="text-xl text-secondary-600 max-w-3xl mx-auto mb-8">
//             Explore our latest work and behind-the-scenes content
//           </p>

//           {/* Category Filter */}
//           <div className="flex flex-wrap justify-center gap-4">
//             {categories.map(category => (
//               <button
//                 key={category}
//                 onClick={() => setSelectedCategory(category)}
//                 className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
//                   selectedCategory === category
//                     ? 'bg-primary-600 text-white'
//                     : 'bg-secondary-100 text-secondary-700 hover:bg-primary-100'
//                 }`}
//               >
//                 {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
//               </button>
//             ))}
//           </div>
//         </motion.div>

//         {/* Desktop Slider - 2 rows x 4 columns, draggable */}
//         <div className="hidden md:block overflow-hidden">
//           <motion.div 
//             className="grid grid-cols-4 gap-6 mb-8 cursor-grab active:cursor-grabbing"
//             drag="x"
//             dragConstraints={{ left: 0, right: 0 }}
//             dragElastic={0.2}
//             whileTap={{ cursor: 'grabbing' }}
//           >
//             {filteredItems.slice(0, 8).map((item, index) => (
//               <motion.div 
//                 key={item._id || index}
//                 className="group relative overflow-hidden rounded-xl bg-secondary-100 shadow-lg hover:shadow-xl transition-shadow"
//                 initial={{ opacity: 0, scale: 0.8 }}
//                 whileInView={{ opacity: 1, scale: 1 }}
//                 transition={{ duration: 0.5, delay: index * 0.05 }}
//                 viewport={{ once: true }}
//               >
//                 <div className="aspect-square">
//                   {item.mediaType === 'video' ? (
//                     <video
//                       src={item.mediaUrl || item.videoUrl}
//                       controls
//                       className="w-full h-full object-cover"
//                       poster={item.thumbnail}
//                     />
//                   ) : (
//                     <img
//                       src={item.mediaUrl || item.imageUrl}
//                       alt={item.title || 'Gallery image'}
//                       className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
//                       onError={(e) => {
//                         e.target.src = 'https://via.placeholder.com/400?text=Image+Not+Found'
//                       }}
//                     />
//                   )}
//                 </div>
                
//                 {/* Overlay - Only for images, not videos */}
//                 {item.mediaType !== 'video' && (
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//                     <div className="absolute bottom-0 left-0 right-0 p-4">
//                       {item.title && (
//                         <h3 className="text-white font-semibold text-lg mb-1">{item.title}</h3>
//                       )}
//                       {item.category && (
//                         <p className="text-white/90 text-sm capitalize">{item.category}</p>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </motion.div>
//             ))}
//           </motion.div>
//         </div>

//         {/* Mobile Slider - Single row with navigation */}
//         <div className="md:hidden relative">
//           <div 
//             ref={sliderRef}
//             className="overflow-x-auto snap-x snap-mandatory"
//             style={{
//               scrollbarWidth: 'none',
//               msOverflowStyle: 'none',
//               WebkitOverflowScrolling: 'touch'
//             }}
//           >
//             <div className="flex gap-4 px-4">
//               {filteredItems.map((item, index) => (
//                 <motion.div 
//                   key={item._id || index}
//                   className="group relative overflow-hidden rounded-xl bg-secondary-100 shadow-lg flex-shrink-0 snap-center"
//                   style={{ width: 'calc(100vw - 3rem)' }}
//                   initial={{ opacity: 0, scale: 0.8 }}
//                   whileInView={{ opacity: 1, scale: 1 }}
//                   transition={{ duration: 0.5 }}
//                   viewport={{ once: true }}
//                 >
//                   <div className="aspect-square">
//                     {item.mediaType === 'video' ? (
//                       <video
//                         src={item.mediaUrl || item.videoUrl}
//                         controls
//                         className="w-full h-full object-cover"
//                         poster={item.thumbnail}
//                       />
//                     ) : (
//                       <img
//                         src={item.mediaUrl || item.imageUrl}
//                         alt={item.title || 'Gallery image'}
//                         className="w-full h-full object-cover"
//                         onError={(e) => {
//                           e.target.src = 'https://via.placeholder.com/400?text=Image+Not+Found'
//                         }}
//                       />
//                     )}
//                   </div>
                  
//                   {/* Mobile Overlay - Always visible */}
//                   <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
//                     {item.title && (
//                       <h3 className="text-white font-semibold text-lg mb-1">{item.title}</h3>
//                     )}
//                     {item.category && (
//                       <p className="text-white/90 text-sm capitalize">{item.category}</p>
//                     )}
//                   </div>
//                 </motion.div>
//               ))}
//             </div>
//           </div>

//           {/* Navigation Buttons */}
//           {filteredItems.length > 1 && (
//             <>
//               <button
//                 onClick={prevSlide}
//                 disabled={currentSlide === 0}
//                 className={`absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all z-10 ${
//                   currentSlide === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
//                 }`}
//                 aria-label="Previous slide"
//               >
//                 <ChevronLeft className="w-6 h-6 text-secondary-900" />
//               </button>
              
//               <button
//                 onClick={nextSlide}
//                 disabled={currentSlide === filteredItems.length - 1}
//                 className={`absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all z-10 ${
//                   currentSlide === filteredItems.length - 1 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
//                 }`}
//                 aria-label="Next slide"
//               >
//                 <ChevronRight className="w-6 h-6 text-secondary-900" />
//               </button>

//               {/* Slide Indicators */}
//               <div className="flex justify-center gap-2 mt-4">
//                 {filteredItems.map((_, index) => (
//                   <button
//                     key={index}
//                     onClick={() => setCurrentSlide(index)}
//                     className={`h-2 rounded-full transition-all ${
//                       currentSlide === index 
//                         ? 'w-8 bg-primary-600' 
//                         : 'w-2 bg-secondary-300'
//                     }`}
//                     aria-label={`Go to slide ${index + 1}`}
//                   />
//                 ))}
//               </div>
//             </>
//           )}
//         </div>

//         {/* Empty State */}
//         {filteredItems.length === 0 && (
//           <div className="text-center py-20">
//             <svg className="h-16 w-16 text-secondary-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
//             </svg>
//             <p className="text-secondary-500 text-lg">
//               {selectedCategory === 'all' 
//                 ? 'No images available yet' 
//                 : `No ${selectedCategory.replace('-', ' ')} images found`}
//             </p>
//           </div>
//         )}
//       </div>

//       {/* <style>{`
//         .scrollbar-hide::-webkit-scrollbar {
//           display: none;
//         }
//         .scrollbar-hide {
//           -ms-overflow-style: none;
//           scrollbar-width: none;
//         }
//       `}</style> */}
//     </section>
//   )
// }

// export default Gallery
import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import axios from 'axios'

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [galleryItems, setGalleryItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const sliderRef = useRef(null)

  const categories = ['all', 'bridal', 'party', 'mehndi', 'hair', 'behind-scenes']

  const filteredItems = selectedCategory === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory)

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await axios.get(`/api/gallery${selectedCategory !== 'all' ? `?category=${selectedCategory}` : ''}`)
        // Filter out invalid items
        const validItems = response.data.data.filter(item => 
          (item.mediaUrl || item.imageUrl || item.videoUrl) && item.mediaType
        )
        setGalleryItems(validItems)
      } catch (error) {
        console.error('Error fetching gallery:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchGallery()
    setCurrentSlide(0) // Reset slider when category changes
  }, [selectedCategory])

  // Mobile slider navigation
  const nextSlide = () => {
    if (currentSlide < filteredItems.length - 1) {
      setCurrentSlide(prev => prev + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1)
    }
  }

  // Auto-scroll slider on mobile
  useEffect(() => {
    if (sliderRef.current) {
      const slideWidth = sliderRef.current.offsetWidth
      sliderRef.current.scrollTo({
        left: currentSlide * slideWidth,
        behavior: 'smooth'
      })
    }
  }, [currentSlide])

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="section-container flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-white">
      <div className="section-container">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-secondary-900 mb-6">
            Gallery & Reels
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto mb-8">
            Explore our latest work and behind-the-scenes content
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-secondary-100 text-secondary-700 hover:bg-primary-100'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Desktop Slider - draggable horizontal scroll */}
        <div className="hidden md:block overflow-hidden mb-8">
          <motion.div 
            className="flex gap-6 cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ 
              left: -((Math.ceil(filteredItems.length / 2) * 320) - (typeof window !== 'undefined' ? window.innerWidth - 200 : 1000)), 
              right: 0 
            }}
            dragElastic={0.1}
            whileTap={{ cursor: 'grabbing' }}
          >
            {/* Create pairs for 2-row layout */}
            {Array.from({ length: Math.ceil(filteredItems.length / 2) }).map((_, pairIndex) => (
              <div key={pairIndex} className="flex flex-col gap-6 flex-shrink-0" style={{ width: '300px' }}>
                {filteredItems.slice(pairIndex * 2, pairIndex * 2 + 2).map((item, index) => (
                  <motion.div 
                    key={item._id || `${pairIndex}-${index}`}
                    className="group relative overflow-hidden rounded-xl bg-secondary-100 shadow-lg hover:shadow-xl transition-shadow"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <div className="aspect-square">
                      {item.mediaType === 'video' ? (
                        <video
                          src={item.mediaUrl || item.videoUrl}
                          controls
                          className="w-full h-full object-cover"
                          poster={item.thumbnail}
                        />
                      ) : (
                        <img
                          src={item.mediaUrl || item.imageUrl}
                          alt={item.title || 'Gallery image'}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/400?text=Image+Not+Found'
                          }}
                        />
                      )}
                    </div>
                    
                    {/* Overlay - Only for images, not videos */}
                    {item.mediaType !== 'video' && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          {item.title && (
                            <h3 className="text-white font-semibold text-lg mb-1">{item.title}</h3>
                          )}
                          {item.category && (
                            <p className="text-white/90 text-sm capitalize">{item.category}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Mobile Slider - Single row with navigation */}
        <div className="md:hidden relative">
          <div 
            ref={sliderRef}
            className="overflow-x-auto snap-x snap-mandatory scrollbar-hide"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            <div className="flex gap-4 px-4">
              {filteredItems.map((item, index) => (
                <motion.div 
                  key={item._id || index}
                  className="group relative overflow-hidden rounded-xl bg-secondary-100 shadow-lg flex-shrink-0 snap-center"
                  style={{ width: 'calc(100vw - 3rem)' }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="aspect-square">
                    {item.mediaType === 'video' ? (
                      <video
                        src={item.mediaUrl || item.videoUrl}
                        controls
                        className="w-full h-full object-cover"
                        poster={item.thumbnail}
                      />
                    ) : (
                      <img
                        src={item.mediaUrl || item.imageUrl}
                        alt={item.title || 'Gallery image'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400?text=Image+Not+Found'
                        }}
                      />
                    )}
                  </div>
                  
                  {/* Mobile Overlay - Always visible, but not for videos */}
                  {item.mediaType !== 'video' && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4">
                      {item.title && (
                        <h3 className="text-white font-semibold text-lg mb-1">{item.title}</h3>
                      )}
                      {item.category && (
                        <p className="text-white/90 text-sm capitalize">{item.category}</p>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          {filteredItems.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className={`absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all z-10 ${
                  currentSlide === 0 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
                }`}
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-6 h-6 text-secondary-900" />
              </button>
              
              <button
                onClick={nextSlide}
                disabled={currentSlide === filteredItems.length - 1}
                className={`absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all z-10 ${
                  currentSlide === filteredItems.length - 1 ? 'opacity-50 cursor-not-allowed' : 'opacity-100'
                }`}
                aria-label="Next slide"
              >
                <ChevronRight className="w-6 h-6 text-secondary-900" />
              </button>

              {/* Slide Indicators */}
              <div className="flex justify-center gap-2 mt-4">
                {filteredItems.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      currentSlide === index 
                        ? 'w-8 bg-primary-600' 
                        : 'w-2 bg-secondary-300'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <svg className="h-16 w-16 text-secondary-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-secondary-500 text-lg">
              {selectedCategory === 'all' 
                ? 'No images available yet' 
                : `No ${selectedCategory.replace('-', ' ')} images found`}
            </p>
          </div>
        )}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  )
}

export default Gallery