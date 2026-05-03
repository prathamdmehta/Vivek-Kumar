import mongoose from 'mongoose'

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] },
    repoLink: { type: String, required: true, trim: true },
    liveLink: { type: String, required: true, trim: true },
    imageUrl: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
  }
)

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema)
