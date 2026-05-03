import Project from '../models/Project.js'
import { invalidateCache } from '../middleware/cacheMiddleware.js'

export const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 })
    res.json({ success: true, data: projects })
  } catch (error) {
    next(error)
  }
}

export const createProject = async (req, res, next) => {
  try {
    const { title, description, tags, repoLink, liveLink, imageUrl } = req.body

    if (!title || !description || !repoLink || !liveLink || !imageUrl) {
      return res.status(400).json({ success: false, message: 'Missing required project fields.' })
    }

    const project = await Project.create({
      title,
      description,
      tags: Array.isArray(tags) ? tags : [],
      repoLink,
      liveLink,
      imageUrl,
    })

    invalidateCache()
    res.status(201).json({ success: true, data: project })
  } catch (error) {
    next(error)
  }
}

export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const project = await Project.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    })

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' })
    }

    invalidateCache()
    res.json({ success: true, data: project })
  } catch (error) {
    next(error)
  }
}

export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params

    const project = await Project.findByIdAndDelete(id)

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found.' })
    }

    invalidateCache()
    res.json({ success: true, message: 'Project deleted successfully.' })
  } catch (error) {
    next(error)
  }
}
