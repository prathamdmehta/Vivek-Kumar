const cache = {
  projects: null,
  expiresAt: 0,
}

/**
 * Middleware: serves cached projects if still fresh, otherwise
 * intercepts res.json to cache the response on the way out.
 */
export const cacheProjects = (req, res, next) => {
  const now = Date.now()
  if (cache.projects && cache.expiresAt > now) {
    return res.json({ success: true, data: cache.projects })
  }

  res.sendResponse = res.json
  res.json = (body) => {
    if (body && body.success && Array.isArray(body.data)) {
      cache.projects = body.data
      cache.expiresAt = Date.now() + 1000 * 60 * 30 // 30 minutes
    }
    res.sendResponse(body)
  }
  next()
}

/**
 * Call this after any create / update / delete to immediately
 * invalidate the cached project list.
 */
export const invalidateCache = () => {
  cache.projects = null
  cache.expiresAt = 0
}
