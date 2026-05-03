import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const ProfileModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 w-full max-w-md relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
        
        <div className="space-y-4">
           {/* Simulation of profile editing features */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 bg-zinc-800 rounded-full mb-4 flex items-center justify-center border-2 border-dashed border-zinc-600 cursor-pointer hover:border-white transition">
               <span className="text-sm text-zinc-400">Change Photo</span>
            </div>
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-2">Display Name</label>
            <input 
              type="text" 
              defaultValue="Bazil"
              className="w-full bg-zinc-800 border border-zinc-700 rounded p-3 text-white focus:outline-none focus:border-accent"
            />
          </div>
           <button className="w-full bg-white text-black font-bold py-3 rounded mt-4 hover:bg-gray-200 transition">
              Save Changes
           </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileModal;