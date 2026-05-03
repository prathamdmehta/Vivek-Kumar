import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const AdminUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    resetToken: { type: String, default: null },
    resetTokenExpiry: { type: Date, default: null },
  },
  { timestamps: true }
)

// Compare a plain-text password against the stored hash
AdminUserSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash)
}

export default mongoose.models.AdminUser || mongoose.model('AdminUser', AdminUserSchema)
