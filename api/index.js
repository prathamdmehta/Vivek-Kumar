import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'
import projectRoutes from './routes/projectRoutes.js'
import contactRoutes from './routes/contactRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import mediaRoutes from './routes/mediaRoutes.js'
import { errorHandler } from './middleware/errorHandler.js'
import { UPLOADS_DIR } from './controllers/mediaController.js'

// Load .env from the backend folder
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '.env') })

const app = express()
const PORT = process.env.PORT || 5000
const clientOrigin = process.env.CLIENT_URL || 'http://localhost:5173'

// Middleware to connect to MongoDB on Vercel/production if not already connected
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState >= 1) return next()
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI must be configured in api/.env')
    }
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Connected to MongoDB via middleware')
    next()
  } catch (err) {
    next(err)
  }
})

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
})

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }, // allow images to be served cross-origin
}))
app.use(cors({ origin: clientOrigin }))
app.use(express.json())
app.use(limiter)

// ─── Serve uploaded files as static assets ───────────────────────────────────
// Accessible at: http://localhost:5000/uploads/<filename>
app.use('/uploads', express.static(UPLOADS_DIR, {
  maxAge: '7d',
  setHeaders: (res) => {
    res.set('Access-Control-Allow-Origin', '*')
  }
}))

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/projects', projectRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/media', mediaRoutes)

app.get('/api/health', (req, res) => res.json({ success: true, status: 'ok' }))

app.use(errorHandler)

// ─── Start ────────────────────────────────────────────────────────────────────
const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI must be configured in api/.env')
    }
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET must be configured in api/.env')
    }

    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ Connected to MongoDB')

    const server = app.listen(PORT, () => {
      console.log(`🚀 Backend running on http://localhost:${PORT}`)
      console.log(`📁 Uploads served at http://localhost:${PORT}/uploads`)
    })

    const shutdown = (signal) => {
      console.log(`\n${signal} received — shutting down gracefully...`)
      server.close(async () => {
        await mongoose.disconnect()
        console.log('MongoDB disconnected. Bye! 👋')
        process.exit(0)
      })
    }

    process.on('SIGTERM', () => shutdown('SIGTERM'))
    process.on('SIGINT', () => shutdown('SIGINT'))
  } catch (error) {
    console.error('❌ Server failed to start:', error.message)
    process.exit(1)
  }
}

if (!process.env.VERCEL) {
  startServer()
}

export default app
