import React from 'react';
import { motion } from 'framer-motion';
import { FileDown, CheckCircle } from 'lucide-react';

const DownloadCV = () => {
  const handleDownload = () => {
    // Optional: You can add logic here to track downloads 
    // or trigger a "Thank you" toast notification.
    console.log("Downloading CV...");
  };

  return (
    <motion.a
      href="./Vivek_Resume_2026.pdf" // Path to your file in the 'public' folder
      download="Vivek_Resume_2026.pdf" // The name the file will have when downloaded
      onClick={handleDownload}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0px 0px 20px rgba(59, 130, 246, 0.5)" 
      }}
      whileTap={{ scale: 0.95 }}
      className="inline-flex items-center gap-3 px-8 py-4 border text-white font-bold rounded-2xl transition-all shadow-lg group"
    >
      <motion.span
        animate={{ y: [0, 2, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <FileDown size={22} className="group-hover:translate-y-1 transition-transform" />
      </motion.span>
      
      Download CV
      
      {/* Decorative Shine Effect */}
      <div className="absolute inset-0 w-full h-full bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 rounded-2xl" />
    </motion.a>
  );
};

export default DownloadCV;