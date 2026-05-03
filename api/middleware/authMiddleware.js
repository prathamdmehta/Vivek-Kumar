import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authorization header missing.' })
  }

  const token = authHeader.split(' ')[1]
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'default_jwt_secret')
    next()
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token.' })
  }
}
