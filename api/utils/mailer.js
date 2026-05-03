import nodemailer from 'nodemailer'

const createTransporter = () => {
  const user = process.env.EMAIL_USER
  const pass = process.env.EMAIL_PASS
  if (!user || !pass) {
    throw new Error('EMAIL_USER and EMAIL_PASS must be configured in the environment.')
  }
  return nodemailer.createTransport({ service: 'gmail', auth: { user, pass } })
}

export const sendMail = async ({ to, subject, text, html }) => {
  const transporter = createTransporter()
  const info = await transporter.sendMail({
    from: `"Vivek Kumar Portfolio" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    ...(html ? { html } : { text }),
  })
  return info
}
