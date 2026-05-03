import mongoose from 'mongoose'

const MediaSchema = new mongoose.Schema(
  {
    filename: { type: String, required: true, unique: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true },
    // category lets you group: 'photo', 'profile', 'hero', 'svg', 'project', 'other'
    category: { type: String, default: 'photo', trim: true },
    caption: { type: String, default: '', trim: true },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Media || mongoose.model('Media', MediaSchema)
