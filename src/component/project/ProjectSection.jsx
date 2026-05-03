import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Github, ExternalLink, ArrowLeft } from 'lucide-react'
import OptimizedImage from '../ui/OptimizedImage'

const skeletonCards = Array.from({ length: 6 })

const ProjectSection = ({ onNavigateHome }) => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await fetch('/api/projects')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data?.message || 'Failed to load projects.')
        }

        setProjects(data.data || [])
      } catch (err) {
        setError(err.message || 'Unable to fetch projects.')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return (
    <section className="py-28 bg-gray-950 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {onNavigateHome && (
          <motion.button
            onClick={onNavigateHome}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </motion.button>
        )}

        <motion.h2
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold mb-12 text-center text-white"
        >
          My Work
        </motion.h2>

        {error && (
          <div className="mb-8 rounded-3xl border border-red-500 bg-red-950/40 p-6 text-red-200">
            {error}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className={loading ? 'filter blur-sm transition duration-500' : 'transition duration-500'}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading
              ? skeletonCards.map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse rounded-xl bg-slate-900/80 p-6 shadow-lg border border-slate-700"
                  >
                    <div className="h-64 w-full rounded-3xl bg-slate-800" />
                    <div className="mt-6 space-y-4">
                      <div className="h-6 w-2/3 rounded-full bg-slate-800" />
                      <div className="h-4 w-full rounded-full bg-slate-800" />
                      <div className="h-4 w-5/6 rounded-full bg-slate-800" />
                      <div className="flex gap-3 pt-6">
                        <div className="h-10 w-24 rounded-full bg-slate-800" />
                        <div className="h-10 w-24 rounded-full bg-slate-800" />
                      </div>
                    </div>
                  </div>
                ))
              : projects.map((project, index) => (
                  <motion.div
                    key={project._id || index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 100, delay: index * 0.08 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                    className="relative overflow-hidden rounded-xl bg-slate-800 shadow-lg border border-slate-700"
                  >
                    <OptimizedImage
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-6 text-center opacity-0 transition-opacity duration-300"
                    >
                      <h3 className="text-white text-2xl font-bold mb-2">{project.title}</h3>
                      <p className="text-slate-300 text-sm mb-6">{project.description}</p>

                      <div className="flex gap-4 flex-wrap justify-center">
                        <motion.a
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                          href={project.repoLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 bg-white text-slate-900 px-5 py-2 rounded-full font-bold"
                        >
                          <Github size={18} /> Code
                        </motion.a>

                        <motion.a
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                          href={project.liveLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-full font-bold"
                        >
                          <ExternalLink size={18} /> Live
                        </motion.a>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ProjectSection
