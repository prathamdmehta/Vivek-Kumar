# Portfolio Backend Setup

## Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- Gmail account for email notifications

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/portfolio?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
EMAIL_USER=your.email@gmail.com
EMAIL_PASS=your_app_password_or_email_password
EMAIL_TO=vkvseri@gmail.com
ADMIN_EMAIL=admin@portfolio.com
ADMIN_PASSWORD=ChangeMe123!
```

## Running the Application

1. Start the backend server:
```bash
npm run backend
```

2. In a separate terminal, start the frontend:
```bash
npm run dev
```

## API Endpoints

### Projects
- `GET /api/projects` - Fetch all projects
- `POST /api/admin/projects` - Create project (admin only)
- `PUT /api/admin/projects/:id` - Update project (admin only)

### Contact
- `POST /api/contact` - Send contact message

### Admin
- `POST /api/admin/login` - Admin login

## Features Implemented

✅ Backend Architecture (Node.js/Express + MongoDB)
✅ Database: MongoDB Atlas connection with Project schema
✅ API Endpoints: GET /api/projects, POST /api/contact
✅ Security: JWT authentication, Bcrypt hashing, Helmet.js
✅ Nodemailer: Email notifications to vkvseri@gmail.com
✅ Performance: Image optimization, caching, rate limiting
✅ UX: Skeleton loaders, Framer Motion animations, Thank You modal
✅ Production Ready: Environment variables, MVC structure

## Testing

1. Visit `http://localhost:5173` for the frontend
2. Backend runs on `http://localhost:5000`
3. Test contact form submission
4. Check project loading with skeleton animation

## Deployment

For production deployment:
1. Set up MongoDB Atlas cluster
2. Configure environment variables
3. Deploy backend to services like Heroku, Vercel, or Railway
4. Deploy frontend to Netlify or Vercel with proxy configuration
