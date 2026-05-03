import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import Media from '../models/Media.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const UPLOADS_DIR = path.join(__dirname, '..', 'uploads')

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true })
}

// ─── Multer Storage Config ───────────────────────────────────────────────────

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, `${uniqueSuffix}${ext}`)
  },
})

const fileFilter = (_req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|svg|webp|avif|bmp|ico|pdf/
  const ext = path.extname(file.originalname).toLowerCase().slice(1)
  if (allowed.test(ext)) {
    cb(null, true)
  } else {
    cb(new Error(`File type .${ext} is not allowed. Allowed: jpg, png, gif, svg, webp, avif, pdf`))
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB max
})

// ─── Helpers ─────────────────────────────────────────────────────────────────

const buildUrl = (req, filename) => {
  const host = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`
  return `${host}/uploads/${filename}`
}

// ─── Controllers ─────────────────────────────────────────────────────────────

/** GET /api/media — list all (optionally filter by ?category=photo) */
export const listMedia = async (req, res, next) => {
  try {
    const filter = {}
    if (req.query.category) filter.category = req.query.category
    const media = await Media.find(filter).sort({ createdAt: -1 })
    res.json({ success: true, data: media })
  } catch (error) {
    next(error)
  }
}

/** GET /api/media/file/:filename — redirect to static file */
export const getMediaFile = async (req, res, next) => {
  try {
    const filePath = path.join(UPLOADS_DIR, req.params.filename)
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'File not found.' })
    }
    res.sendFile(filePath)
  } catch (error) {
    next(error)
  }
}

/** POST /api/admin/media — upload one or more files (admin protected) */
export const uploadMedia = async (req, res, next) => {
  try {
    const files = req.files
    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded.' })
    }

    const category = req.body.category || 'photo'
    const caption = req.body.caption || ''

    const savedMedia = await Promise.all(
      files.map((file) =>
        Media.create({
          filename: file.filename,
          originalName: file.originalname,
          mimeType: file.mimetype,
          size: file.size,
          url: buildUrl(req, file.filename),
          category,
          caption,
        })
      )
    )

    res.status(201).json({ success: true, data: savedMedia })
  } catch (error) {
    next(error)
  }
}

/** DELETE /api/admin/media/:id — delete file from disk + DB (admin protected) */
export const deleteMedia = async (req, res, next) => {
  try {
    const media = await Media.findByIdAndDelete(req.params.id)
    if (!media) {
      return res.status(404).json({ success: false, message: 'Media not found.' })
    }

    // Remove physical file
    const filePath = path.join(UPLOADS_DIR, media.filename)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    res.json({ success: true, message: 'File deleted successfully.' })
  } catch (error) {
    next(error)
  }
}

/** POST /api/admin/media/seed — seed existing public/home files into DB */
export const seedMediaFromPublic = async (req, res, next) => {
  try {
    const publicDir = path.join(__dirname, '..', '..', 'public', 'home')
    if (!fs.existsSync(publicDir)) {
      return res.status(404).json({ success: false, message: 'public/home directory not found.' })
    }

    const files = fs.readdirSync(publicDir).filter(f => /\.(png|jpg|jpeg|svg|gif|webp)$/i.test(f))
    const results = []

    for (const file of files) {
      const src = path.join(publicDir, file)
      const dest = path.join(UPLOADS_DIR, file)

      // Copy to uploads if not already there
      if (!fs.existsSync(dest)) {
        fs.copyFileSync(src, dest)
      }

      const stat = fs.statSync(dest)
      const ext = path.extname(file).toLowerCase().slice(1)
      const mimeMap = { png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', svg: 'image/svg+xml', gif: 'image/gif', webp: 'image/webp' }

      // Upsert into DB
      const existing = await Media.findOne({ filename: file })
      if (!existing) {
        const doc = await Media.create({
          filename: file,
          originalName: file,
          mimeType: mimeMap[ext] || 'image/jpeg',
          size: stat.size,
          url: buildUrl(req, file),
          category: file.includes('Viv.png') ? 'hero' : file.includes('Vivekimg') ? 'profile' : 'photo',
          caption: file.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
        })
        results.push(doc)
      }
    }

    res.json({ success: true, message: `Seeded ${results.length} file(s).`, data: results })
  } catch (error) {
    next(error)
  }
}
