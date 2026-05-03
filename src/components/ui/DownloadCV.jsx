import React from 'react';
import { motion } from 'framer-motion';
import { FileDown } from 'lucide-react';

const DownloadCV = () => {
  const handleDownload = () => {
    console.log("Downloading CV...");
  };

  return (
    <motion.a
      href="./home/Vivek_ Resume_2026.pdf"
      download="Vivek_Resume_2026.pdf"
      onClick={handleDownload}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(59, 130, 246, 0.5)" }}
      whileTap={{ scale: 0.95 }}
      className="inline-flex items-center gap-3 px-8 py-4 border text-white font-bold rounded-2xl transition-all shadow-lg group relative overflow-hidden"
    >
      <motion.span animate={{ y: [0, 2, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
        <FileDown size={22} className="group-hover:translate-y-1 transition-transform" />
      </motion.span>
      Download CV
      <div className="absolute inset-0 w-full h-full bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500 rounded-2xl" />
    </motion.a>
  );
};

export default DownloadCV;
