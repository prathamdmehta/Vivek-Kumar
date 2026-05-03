
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Twitter, Linkedin, Copy, Check, ArrowUpRight } from 'lucide-react';

const Footer = () => {
  const [time, setTime] = useState("");
  const [copied, setCopied] = useState(false);
  const email = "vkvseri@gmail.com";

  // Real-time Clock Logic
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit' 
      }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="w-full p-10 px-6 bg-transparent font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* The Main Container */}
        <motion.div 
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="relative grid grid-cols-1 md:grid-cols-3 items-center gap-6 p-3 rounded-[2.5rem] border border-white/10 bg-zinc-900/50 backdrop-blur-2xl shadow-2xl"
        >
          
          {/* 1. Availability & Email Section */}
          <div className="flex items-center gap-4 pl-4">
            <div className="relative h-2 w-2">
              <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative block h-2 w-2 rounded-full bg-emerald-500"></span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-tighter text-zinc-500 font-bold">Status</span>
              <span className="text-sm text-zinc-200 font-medium">Available for hire</span>
            </div>
          </div>

          {/* 2. Interactive Center Social Dock */}
          <div className="flex justify-self-center items-center bg-zinc-800/50 border border-white/5 p-1.5 rounded-full">
            {[
              { icon: <Github size={18} />, href: "https://github.com/stevenkumar" },
              { icon: <Twitter size={18} />, href: "https://x.com/Vivek9653" },
              { icon: <Linkedin size={18} />, href: "https://www.linkedin.com/in/vivek-kumar-733552317/" }
            ].map((social, i) => (
              <motion.a
                key={i}
                href={social.href}
                whileHover={{ y: -3, scale: 1.1, backgroundColor: "rgba(255,255,255,0.05)" }}
                className="p-3 rounded-full text-zinc-400 hover:text-white transition-all"
              >
                {social.icon}
              </motion.a>
            ))}
            <div className="w-px h-4 bg-zinc-700 mx-2" />
            <motion.button
              onClick={handleCopy}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-zinc-300 hover:text-white"
            >
              <AnimatePresence mode="wait">
                {copied ? (
                  <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Check size={16} className="text-emerald-400" />
                  </motion.span>
                ) : (
                  <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Copy size={16} />
                  </motion.span>
                )}
              </AnimatePresence>
              {copied ? "Copied!" : "Email"}
            </motion.button>
          </div>

          {/* 3. High-Action Button */}
          <div className="justify-self-center md:justify-self-end pr-2">
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white pl-6 pr-3 py-3 rounded-full text-sm font-bold transition-all shadow-lg shadow-indigo-500/20"
            >
              START A PROJECT
              <div className="bg-indigo-400/30 rounded-full p-1.5 group-hover:rotate-45 transition-transform">
                <ArrowUpRight size={18} />
              </div>
            </motion.a>
          </div>
        </motion.div>

        {/* Info Bar */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center px-8 gap-4">
          <div className="flex gap-8 text-[11px] font-bold text-zinc-500 uppercase tracking-[0.15em]">
            <p>© {new Date().getFullYear()}</p>
            <p>Made By Vivek Kumar</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[9px] uppercase text-zinc-600 font-black leading-none">Local Time</span>
              <span className="text-sm font-mono text-zinc-400">{time}</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;