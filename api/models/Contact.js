import mongoose from 'mongoose'

const ContactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    number: { type: String, trim: true, default: '' },
    message: { type: String, required: true, trim: true },
    read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Contact || mongoose.model('Contact', ContactSchema)
