import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react';

const skeletonItems = Array.from({ length: 6 });

const PhotosSection = () => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/media?category=photo');
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || 'Failed to load photos.');
        setPhotos(data.data || []);
      } catch (err) {
        setError(err.message || 'Unable to fetch photos.');
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, []);

  useEffect(() => {
    if (lightbox === null) return;
    const handler = (e) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight') setLightbox((i) => (i + 1) % photos.length);
      if (e.key === 'ArrowLeft') setLightbox((i) => (i - 1 + photos.length) % photos.length);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox, photos.length]);

  return (
    <section id="photos" className="py-24 bg-slate-950 text-white min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-12">
          <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800">
            <ImageIcon className="text-blue-400" size={28} />
          </div>
          <div>
            <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Photography</h2>
            <p className="text-slate-400">A glimpse into my world behind the lens.</p>
          </div>
        </div>

        {error && <div className="mb-8 rounded-3xl border border-red-500 bg-red-950/40 p-6 text-red-200">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? skeletonItems.map((_, i) => <div key={i} className="aspect-square rounded-3xl bg-slate-900 border border-slate-800 animate-pulse" />)
            : photos.length === 0
            ? (
              <div className="col-span-3 text-center py-20 text-slate-500">
                <ImageIcon size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg">No photos yet. Upload some via the admin panel.</p>
              </div>
            )
            : photos.map((photo, index) => (
              <motion.div
                key={photo._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setLightbox(index)}
                className="relative group aspect-square overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 cursor-pointer"
              >
                <img src={photo.url} alt={photo.caption || photo.originalName} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <p className="text-lg font-semibold text-white">{photo.caption || photo.originalName}</p>
                </div>
              </motion.div>
            ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && photos[lightbox] && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" onClick={() => setLightbox(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }} className="relative max-w-4xl w-full max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              <img src={photos[lightbox].url} alt={photos[lightbox].caption || photos[lightbox].originalName} className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl" />
              <p className="text-center text-slate-300 mt-3 text-sm">
                {photos[lightbox].caption || photos[lightbox].originalName}
                <span className="text-slate-500 ml-2">({lightbox + 1}/{photos.length})</span>
              </p>
              <button onClick={() => setLightbox(null)} className="absolute -top-4 -right-4 bg-slate-800 hover:bg-red-600 transition-colors rounded-full p-2"><X size={20} /></button>
              <button onClick={() => setLightbox((i) => (i - 1 + photos.length) % photos.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 rounded-full p-2 transition-colors"><ChevronLeft size={24} /></button>
              <button onClick={() => setLightbox((i) => (i + 1) % photos.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 rounded-full p-2 transition-colors"><ChevronRight size={24} /></button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PhotosSection;
