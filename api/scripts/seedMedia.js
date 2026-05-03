/**
 * api/scripts/seedMedia.js
 * ─────────────────────────────────────────────────────────────────────────────
 * One-time script to copy all existing images from public/home and public/
 * into api/uploads and register them in MongoDB.
 *
 * Usage (from the project root):
 *   npm run seed:media
 *
 * Or hit the API endpoint after logging in as admin:
 *   POST /api/admin/media/seed
 *   Authorization: Bearer <token>
 * ─────────────────────────────────────────────────────────────────────────────
 */

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// .env lives in api/, scripts/ is one level deeper
dotenv.config({ path: path.join(__dirname, '..', '.env') })

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads')
const PUBLIC_HOME = path.join(__dirname, '..', '..', 'public', 'home')
const PUBLIC_ROOT = path.join(__dirname, '..', '..', 'public')

const { default: Media } = await import('../models/Media.js')

const mimeMap = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  svg: 'image/svg+xml',
  gif: 'image/gif',
  webp: 'image/webp',
  avif: 'image/avif',
}

const guessCategory = (filename, folder) => {
  const name = filename.toLowerCase()
  if (name.includes('viv.png') || name.includes('hero')) return 'hero'
  if (name.includes('vivekimg') || name.includes('profile') || name.includes('avatar')) return 'profile'
  if (/\.(svg)$/i.test(filename)) return 'svg'
  if (folder === PUBLIC_ROOT) return 'svg'
  return 'photo'
}

const seedDir = async (dir, baseUrl) => {
  if (!fs.existsSync(dir)) return 0
  const files = fs.readdirSync(dir).filter(f => /\.(png|jpg|jpeg|svg|gif|webp|avif)$/i.test(f))
  let count = 0

  for (const file of files) {
    const src = path.join(dir, file)
    const dest = path.join(UPLOADS_DIR, file)

    if (!fs.existsSync(dest)) fs.copyFileSync(src, dest)

    const stat = fs.statSync(dest)
    const ext = path.extname(file).toLowerCase().slice(1)

    const existing = await Media.findOne({ filename: file })
    if (!existing) {
      await Media.create({
        filename: file,
        originalName: file,
        mimeType: mimeMap[ext] || 'application/octet-stream',
        size: stat.size,
        url: `${baseUrl}/uploads/${file}`,
        category: guessCategory(file, dir),
        caption: file.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
      })
      console.log(`  ✅ Seeded: ${file} (${guessCategory(file, dir)})`)
      count++
    } else {
      console.log(`  ⏭  Skipped (already in DB): ${file}`)
    }
  }
  return count
}

;(async () => {
  console.log('\n🌱 Starting media seed...\n')

  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI not set in api/.env')
    process.exit(1)
  }

  if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true })

  await mongoose.connect(process.env.MONGO_URI)
  console.log('✅ Connected to MongoDB\n')

  const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000'

  console.log('📁 Seeding public/home...')
  const count1 = await seedDir(PUBLIC_HOME, backendUrl)

  console.log('\n📁 Seeding public/ (SVGs)...')
  const count2 = await seedDir(PUBLIC_ROOT, backendUrl)

  console.log(`\n✅ Done! Seeded ${count1 + count2} new file(s) into uploads + MongoDB.\n`)

  await mongoose.disconnect()
  process.exit(0)
})()
