import Contact from '../models/Contact.js'
import { sendMail } from '../utils/mailer.js'

export const sendContactMessage = async (req, res, next) => {
  try {
    const { name, email, number, message } = req.body

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email and message are required.' })
    }

    // 1. Save to MongoDB for admin retrieval
    await Contact.create({ name, email, number: number || '', message })

    // 2. Send email notification (non-blocking — if email fails, submission is still saved)
    const subject = `Portfolio Contact from ${name}`
    const text = `Name: ${name}\nEmail: ${email}\nPhone: ${number || 'N/A'}\n\nMessage:\n${message}`

    try {
      await sendMail({
        to: process.env.EMAIL_TO || process.env.ADMIN_EMAIL || 'vkvseri@gmail.com',
        subject,
        text,
      })
    } catch (mailError) {
      // Log the email error but don't fail the request — contact is already saved
      console.error('Email notification failed (contact still saved):', mailError.message)
    }

    res.json({
      success: true,
      message: "Got it! Your message is in my inbox. I'll get back to you faster than a Mumbai local reaches Dadar! 🚉",
    })
  } catch (error) {
    next(error)
  }
}
