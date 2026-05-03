import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Plus, Minus } from 'lucide-react'; // Optional: npm i lucide-react

const services = [
  {
    id: "01",
    title: "UI/UX Design",
    tags: ["Mobile App", "User Research", "Prototyping"],
    img: "https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "02",
    title: "Application Design",
    tags: ["Cross-Platform", "PWA", "Wireframing", "Custom Themes"],
    img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "03",
    title: "Website Design",
    tags: ["Landing Page", "E-commerce", "Portfolio"],
    img: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "04",
    title: "Design System",
    tags: ["Style Guides", "Components", "Tokens"],
    img: "https://images.unsplash.com/photo-1613909209432-d9d05d33045e?q=80&w=1000&auto=format&fit=crop",
  }
];

export default function ProjectSlider({ onNavigateToProjects }) {
  const [activeId, setActiveId] = useState(null);

  return (
    <div className="bg-gray-900 min-h-screen py-20 px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-orange-600 font-medium flex items-center gap-2">
              <span className="w-8 h-[2px] bg-orange-600 inline-block"></span> My Specialization
            </p>
            <h2 className="text-5xl font-bold mt-2">Services <span className="text-gray-400">|</span> I Provide</h2>
          </div>
          <p className="text-gray-500 max-w-xs text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.
          </p>
        </div>

        {/* Accordion List */}
        <div className="flex flex-col gap-4">
          {services.map((service) => (
            <div 
              key={service.id}
              className={`rounded-3xl transition-all duration-500 overflow-hidden cursor-pointer ${
                activeId === service.id ? 'bg-black text-white' : 'bg-gray-50 text-black hover:bg-gray-100'
              }`}
              onMouseEnter={() => setActiveId(service.id)}
              onClick={() => setActiveId(activeId === service.id ? null : service.id)}
            >
              {/* Header Row */}
              <div className="flex items-center justify-between p-8">
                <div className="flex items-center gap-12">
                  <span className="text-xl font-bold">{service.id}.</span>
                  <h3 className="text-2xl font-semibold">{service.title}</h3>
                </div>
                <div className={`p-2 rounded-full transition-colors ${activeId === service.id ? 'bg-orange-600' : 'bg-white border'}`}>
                  {activeId === service.id ? <ArrowUpRight size={20} /> : <Plus size={20} />}
                </div>
              </div>

              {/* Expanding Content */}
              <AnimatePresence>
                {activeId === service.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                  >
                    <div className="px-28 pb-12">
                      <div className="flex flex-wrap gap-2 mb-6">
                        {service.tags.map(tag => (
                          <span key={tag} className="px-4 py-1 border border-gray-700 rounded-full text-xs text-gray-400">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="text-gray-400 mb-8 max-w-md">
                        Tailored solutions for your digital needs. We build high-performing applications with seamless user experiences.
                      </p>
                      
                      {/* Image Preview Window (The "Slider" effect) */}
                      <div className="relative w-full h-[300px] rounded-2xl overflow-hidden bg-gray-900 group">
                         <motion.img 
                           initial={{ y: 50, opacity: 0 }}
                           animate={{ y: 0, opacity: 1 }}
                           src={service.img} 
                           alt={service.title}
                           className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                         />
                         {/* Optional Overlay */}
                         <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-12 flex justify-center">
            <button 
                onClick={onNavigateToProjects}
                className="group flex items-center bg-orange-600 text-white rounded-full pl-6 pr-2 py-2 font-medium hover:bg-orange-700 transition-all"
            >
                View All Projects
                <div className="ml-4 bg-white rounded-full p-2 text-black group-hover:rotate-45 transition-transform">
                    <ArrowUpRight size={20} />
                </div>
            </button>
        </div>
      </div>
    </div>
  );
}