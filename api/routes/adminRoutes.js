import express from 'express'
import { login, createProject, updateProject, deleteProject, getContacts, markContactRead, forgotPassword, resetPassword } from '../controllers/adminController.js'
import { uploadMedia, deleteMedia, seedMediaFromPublic, upload } from '../controllers/mediaController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router()

// ─── Auth ────────────────────────────────────────────────────────────────────
router.post('/login', login)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword)

// ─── Projects (protected) ────────────────────────────────────────────────────
router.post('/projects', authMiddleware, createProject)
router.put('/projects/:id', authMiddleware, updateProject)
router.delete('/projects/:id', authMiddleware, deleteProject)

// ─── Contacts (protected) ────────────────────────────────────────────────────
router.get('/contacts', authMiddleware, getContacts)
router.patch('/contacts/:id/read', authMiddleware, markContactRead)

// ─── Media (protected) ───────────────────────────────────────────────────────
// Upload: supports multiple files, field name "files", with optional body: { category, caption }
router.post('/media', authMiddleware, upload.array('files', 20), uploadMedia)
router.delete('/media/:id', authMiddleware, deleteMedia)

// Seed existing public/home images into the backend uploads folder (one-time)
router.post('/media/seed', authMiddleware, seedMediaFromPublic)

export default router
