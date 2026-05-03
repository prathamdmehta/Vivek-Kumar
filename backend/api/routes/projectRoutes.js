import express from 'express'
import { getProjects } from '../controllers/projectController.js'
import { cacheProjects } from '../middleware/cacheMiddleware.js'

const router = express.Router()

router.get('/', cacheProjects, getProjects)

export default router
