// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { motion } from 'framer-motion';
// import { Award, Users, Clock, Star } from 'lucide-react';

// const About = () => {
//   const [aboutData, setAboutData] = useState(null);

//   useEffect(() => {
//     const fetchAbout = async () => {
//       try {
//         const res = await axios.get('/api/content/about');
//         setAboutData(res.data.data?.data);
//       } catch (err) {
//         console.error('Failed to fetch about content', err);
//       }
//     };
//     fetchAbout();
//   }, []);

//   if (!aboutData) return null; // or a loading spinner

//   const stats = [
//     { icon: Users, label: 'Happy Brides', value: aboutData.stats?.happyBrides, color: 'text-pink-500' },
//     { icon: Clock, label: 'Years Experience', value: aboutData.stats?.yearsExperience, color: 'text-purple-500' },
//     { icon: Award, label: aboutData.stats?.certification, value: '✔️', color: 'text-indigo-500' },
//     { icon: Star, label: 'Ratings', value: aboutData.stats?.specialization, color: 'text-yellow-500' },
    
//   ];

//   return (
//     <section className="py-20 bg-white">
//       <div className="section-container">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
//           {/* Image */}
//           <motion.div
//             className="relative"
//             initial={{ opacity: 0, x: -50 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8 }}
//             viewport={{ once: true }}
//           >
//             <div className="relative rounded-lg overflow-hidden">
//               <img
//                 src={aboutData?.image || 'https://via.placeholder.com/500'}
//                 alt="Mithra's Makeover"
//                 className="w-full h-[500px] object-cover"
//               />
//               <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-transparent"></div>
//             </div>
//           </motion.div>

//           {/* Content */}
//           <motion.div
//             className="space-y-8"
//             initial={{ opacity: 0, x: 50 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             transition={{ duration: 0.8, delay: 0.2 }}
//             viewport={{ once: true }}
//           >
//             <div>
//               <h2 className="text-4xl md:text-5xl font-display font-bold text-secondary-900 mb-6">
//                 {aboutData?.title}
//               </h2>
//               <p className="text-lg text-secondary-600 leading-relaxed">
//                 {aboutData?.description}
//               </p>
//             </div>

//             <div className="grid grid-cols-2 gap-6">
//               {stats.map((stat, index) => {
//                 const Icon = stat.icon;
//                 return (
//                   <motion.div
//                     key={index}
//                     className="text-center p-6 rounded-lg bg-secondary-50"
//                     initial={{ opacity: 0, y: 20 }}
//                     whileInView={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.5, delay: index * 0.1 }}
//                     viewport={{ once: true }}
//                   >
//                     <Icon className={`h-8 w-8 mx-auto mb-3 ${stat.color}`} />
//                     <div className="text-2xl font-bold text-secondary-900">{stat.value}</div>
//                     <div className="text-sm text-secondary-600">{stat.label}</div>
//                   </motion.div>
//                 );
//               })}
//             </div>

//             <div className="bg-primary-50 p-6 rounded-lg border-l-4 border-primary-500">
//               <div className="flex items-center mb-2">
//                 <Star className="h-5 w-5 text-primary-500 mr-2" />
//                 <span className="font-semibold text-primary-700">
//                   {aboutData.stats?.certification}
//                 </span>
//               </div>
//               <p className="text-primary-600">
//                  Licensed makeup artist and mehndi specialist with certifications 
//                 from top beauty academies.
//               </p>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default About;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Award, Users, Clock, Star } from 'lucide-react';

const About = () => {
  const [aboutData, setAboutData] = useState(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await axios.get('/api/content/about');
        setAboutData(res.data.data?.data);
      } catch (err) {
        console.error('Failed to fetch about content', err);
      }
    };
    fetchAbout();
  }, []);

  if (!aboutData) return null; // Or a loading spinner

  const stats = [
    { icon: Users, label: 'Happy Brides', value: aboutData.stats?.happyBrides, color: 'text-pink-500' },
    { icon: Clock, label: 'Years Experience', value: aboutData.stats?.yearsExperience, color: 'text-purple-500' },
    { icon: Award, label: aboutData.stats?.certification, value: '✔️', color: 'text-indigo-500' },
    { icon: Star, label: 'Ratings', value: aboutData.stats?.specialization, color: 'text-yellow-500' },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Content */}
          <motion.div
            className="space-y-8 order-1 lg:order-2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-secondary-900 mb-6">
                {aboutData?.title}
              </h2>
              <p className="text-lg text-secondary-600 leading-relaxed">
                {aboutData?.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    className="text-center p-6 rounded-lg bg-secondary-50"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Icon className={`h-8 w-8 mx-auto mb-3 ${stat.color}`} />
                    <div className="text-2xl font-bold text-secondary-900">{stat.value}</div>
                    <div className="text-sm text-secondary-600">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>

            <div className="bg-primary-50 p-6 rounded-lg border-l-4 border-primary-500">
              <div className="flex items-center mb-2">
                <Star className="h-5 w-5 text-primary-500 mr-2" />
                <span className="font-semibold text-primary-700">
                  {aboutData.stats?.certification}
                </span>
              </div>
              <p className="text-primary-600">
                Licensed makeup artist and mehndi specialist with certifications
                from top beauty academies.
              </p>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            className="relative order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={aboutData?.image || 'https://via.placeholder.com/500'}
                alt="Mithra's Makeover"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600/10 to-transparent"></div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;
