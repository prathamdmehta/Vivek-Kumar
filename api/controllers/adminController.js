import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import Project from '../models/Project.js'
import Contact from '../models/Contact.js'
import AdminUser from '../models/AdminUser.js'
import { sendMail } from '../utils/mailer.js'

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Ensures the admin user exists in MongoDB.
 * On first run it seeds from ADMIN_EMAIL / ADMIN_PASSWORD in .env.
 */
const getOrCreateAdmin = async () => {
  const email = process.env.ADMIN_EMAIL || 'admin@portfolio.com'
  let admin = await AdminUser.findOne({ email })
  if (!admin) {
    const plain = process.env.ADMIN_PASSWORD || 'ChangeMe123!'
    const passwordHash = await bcrypt.hash(plain, 12)
    admin = await AdminUser.create({ email, passwordHash })
    console.log('✅ Admin user seeded from .env into MongoDB.')
  }
  return admin
}

// ─── Login ────────────────────────────────────────────────────────────────────

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' })
    }

    const admin = await getOrCreateAdmin()

    if (email.toLowerCase() !== admin.email) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' })
    }

    const match = await admin.comparePassword(password)
    if (!match) {
      return res.status(401).json({ success: false, message: 'Invalid credentials.' })
    }

    const token = jwt.sign(
      { email: admin.email },
      process.env.JWT_SECRET || 'default_jwt_secret',
      { expiresIn: '8h' }
    )

    res.json({ success: true, token })
  } catch (error) {
    next(error)
  }
}

// ─── Forgot Password ──────────────────────────────────────────────────────────

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' })
    }

    // Always return 200 so attackers can't enumerate admin email
    const admin = await AdminUser.findOne({ email: email.toLowerCase() })
    if (!admin) {
      return res.json({ success: true, message: 'If that email is registered, a reset link has been sent.' })
    }

    // Generate a secure 32-byte hex token
    const rawToken = crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex')

    admin.resetToken = hashedToken
    admin.resetTokenExpiry = new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
    await admin.save()

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173'
    const resetUrl = `${clientUrl}/#admin?reset=${rawToken}`

    await sendMail({
      to: admin.email,
      subject: '🔐 Admin Password Reset — Vivek Kumar Portfolio',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; background: #0f172a; color: #e2e8f0; border-radius: 16px; padding: 40px;">
          <h2 style="color: #38bdf8; margin-bottom: 8px;">Password Reset Request</h2>
          <p style="color: #94a3b8; margin-bottom: 24px;">You requested a password reset for your portfolio admin panel. Click the button below to set a new password.</p>
          <a href="${resetUrl}" style="display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 10px; font-weight: bold; margin-bottom: 24px;">
            Reset My Password
          </a>
          <p style="color: #64748b; font-size: 13px;">This link expires in <strong style="color: #f97316;">30 minutes</strong>. If you didn't request this, ignore this email.</p>
          <hr style="border-color: #1e293b; margin: 24px 0;" />
          <p style="color: #475569; font-size: 12px;">Or copy this link:<br/><span style="color: #38bdf8; word-break: break-all;">${resetUrl}</span></p>
        </div>
      `,
    })

    res.json({ success: true, message: 'If that email is registered, a reset link has been sent.' })
  } catch (error) {
    next(error)
  }
}

// ─── Reset Password ───────────────────────────────────────────────────────────

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params
    const { password } = req.body

    if (!token || !password) {
      return res.status(400).json({ success: false, message: 'Token and new password are required.' })
    }
    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' })
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    const admin = await AdminUser.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: new Date() }, // not expired
    })

    if (!admin) {
      return res.status(400).json({ success: false, message: 'Reset link is invalid or has expired.' })
    }

    admin.passwordHash = await bcrypt.hash(password, 12)
    admin.resetToken = null
    admin.resetTokenExpiry = null
    await admin.save()

    res.json({ success: true, message: 'Password updated successfully. You can now log in.' })
  } catch (error) {
    next(error)
  }
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export const createProject = async (req, res, next) => {
  try {
    const { title, description, tags, repoLink, liveLink, imageUrl } = req.body
    if (!title || !description || !repoLink || !liveLink || !imageUrl) {
      return res.status(400).json({ success: false, message: 'Missing required project fields.' })
    }
    const project = await Project.create({
      title, description,
      tags: Array.isArray(tags) ? tags : [],
      repoLink, liveLink, imageUrl,
    })
    res.status(201).json({ success: true, data: project })
  } catch (error) {
    next(error)
  }
}

export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' })
    res.json({ success: true, data: project })
  } catch (error) {
    next(error)
  }
}

export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id)
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' })
    res.json({ success: true, message: 'Project deleted successfully.' })
  } catch (error) {
    next(error)
  }
}

// ─── Contacts ─────────────────────────────────────────────────────────────────

export const getContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 })
    res.json({ success: true, data: contacts })
  } catch (error) {
    next(error)
  }
}

export const markContactRead = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { read: true }, { new: true })
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found.' })
    res.json({ success: true, data: contact })
  } catch (error) {
    next(error)
  }
}
