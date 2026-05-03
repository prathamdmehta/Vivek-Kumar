import React, { useState } from "react"
import { motion } from "framer-motion"
import { Mail, MapPin, Send, Github, Linkedin, Twitter, ArrowLeft } from "lucide-react"
import ThankYouModal from "../ui/ThankYouModal"

const ContactPage = ({ onNavigateHome }) => {
  const [formData, setFormData] = useState({ name: "", email: "", number: "", message: "" })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [thankYouOpen, setThankYouOpen] = useState(false)

  const socialLinks = [
    { Icon: Github, href: "https://github.com/stevenkumar" },
    { Icon: Linkedin, href: "https://www.linkedin.com/in/vivek-kumar-733552317/" },
    { Icon: Twitter, href: "https://x.com/Vivek9653" },
  ]

  const validate = () => {
    const newErrors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const nameRegex = /^[a-zA-Z\s]*$/

    if (!formData.name.trim()) newErrors.name = "Name is required"
    else if (!nameRegex.test(formData.name)) newErrors.name = "Names cannot contain numbers or symbols"

    if (!emailRegex.test(formData.email)) newErrors.email = "Please enter a valid email"

    if (formData.number && formData.number.length !== 10) newErrors.number = "Number must be exactly 10 digits"

    const wordCount = formData.message.trim().split(/\s+/).filter(Boolean).length
    if (wordCount < 1) newErrors.message = "Message cannot be empty"
    else if (wordCount > 1000) newErrors.message = "Message limit is 1000 words"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError("")
    if (!validate()) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data?.message || 'Unable to send message.')
      setSuccessMessage(data.message)
      setThankYouOpen(true)
      setFormData({ name: '', email: '', number: '', message: '' })
      setErrors({})
    } catch (error) {
      setSubmitError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  return (
    <section className="py-24 bg-slate-950 text-white min-h-screen flex items-center">
      <ThankYouModal
        isOpen={thankYouOpen}
        onClose={() => setThankYouOpen(false)}
        message={successMessage || "Got it! I'll get back to you faster than a Mumbai local reaches Dadar! 🚉"}
      />
      <div className="max-w-6xl mx-auto px-6">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="space-y-8">
            <div>
              <h2 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Let's Connect</h2>
              <p className="text-slate-400 text-lg">Have a project in mind? Reach out and let's build something amazing together.</p>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-4 group">
                <div className="p-4 bg-slate-900 rounded-2xl group-hover:bg-blue-600 transition-colors">
                  <Mail className="text-blue-400 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Email Me</p>
                  <p className="text-lg font-medium">vkvseri@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="p-4 bg-slate-900 rounded-2xl group-hover:bg-purple-600 transition-colors">
                  <MapPin className="text-purple-400 group-hover:text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Location</p>
                  <p className="text-lg font-medium">Mumbai, India</p>
                </div>
              </div>
            </div>
            <div className="flex gap-4 pt-8">
              {socialLinks.map((item, i) => {
                const Icon = item.Icon
                return (
                  <motion.a key={i} href={item.href} target="_blank" rel="noopener noreferrer" whileHover={{ y: -5, scale: 1.1 }} className="p-3 bg-slate-900 rounded-full border border-slate-800 hover:border-blue-500 transition-colors">
                    <Icon size={20} />
                  </motion.a>
                )
              })}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-2xl">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Name</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" className={`w-full bg-slate-800 border ${errors.name ? 'border-red-500' : 'border-slate-700'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`} />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400">Email</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your Email" className={`w-full bg-slate-800 border ${errors.email ? 'border-red-500' : 'border-slate-700'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`} />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-slate-400">Phone Number (Optional)</label>
                  <input type="text" name="number" value={formData.number} onChange={handleChange} maxLength={10} placeholder="Your Phone Number" className={`w-full bg-slate-800 border ${errors.number ? 'border-red-500' : 'border-slate-700'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`} />
                  {errors.number && <p className="text-red-500 text-xs mt-1">{errors.number}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400">Message</label>
                <textarea rows="5" name="message" value={formData.message} onChange={handleChange} placeholder="Tell me about your project..." className={`w-full bg-slate-800 border ${errors.message ? 'border-red-500' : 'border-slate-700'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`} />
                <div className="flex justify-between">
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                  <p className="text-xs text-slate-500 ml-auto">{formData.message.trim().split(/\s+/).filter(Boolean).length}/1000 words</p>
                </div>
              </div>
              {submitError && <p className="text-red-400 text-sm">{submitError}</p>}
              <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={isSubmitting} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60">
                <Send size={18} /> {isSubmitting ? 'Sending...' : 'Send Message'}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ContactPage
