# Project Structure Guide

This project has been restructured into a clear **Frontend** and **Backend** separation for better organization and understanding.

## 📁 Folder Structure

```
Vivek-Kumar/
│
├── 📂 frontend/                 # React + Vite frontend application
│   ├── src/                     # React source code
│   │   ├── components/          # React components
│   │   ├── assets/              # Images, fonts, etc.
│   │   ├── data/                # Frontend data (projects, etc.)
│   │   ├── hooks/               # Custom React hooks
│   │   ├── lib/                 # Utility libraries
│   │   ├── App.jsx              # Main App component
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── public/                  # Static files served directly
│   ├── dist/                    # Build output (generated)
│   ├── package.json             # Frontend dependencies
│   ├── vite.config.js           # Vite configuration
│   ├── tsconfig.json            # TypeScript config
│   ├── index.html               # HTML template
│   └── eslint.config.js         # ESLint config
│
├── 📂 backend/                  # Express.js backend API
│   ├── api/
│   │   ├── index.js             # Main server file
│   │   ├── controllers/         # Route handlers/business logic
│   │   ├── models/              # Mongoose schemas
│   │   ├── routes/              # API route definitions
│   │   ├── middleware/          # Express middleware
│   │   ├── utils/               # Utility functions (mailer, etc.)
│   │   ├── scripts/             # Database seeding scripts
│   │   └── uploads/             # Uploaded files storage
│   ├── package.json             # Backend dependencies
│   ├── .env.example             # Environment variables template
│   └── .env                     # Environment variables (local development)
│
├── package.json                 # Root package.json (project orchestration)
├── vercel.json                  # Deployment configuration
└── README.md                    # Project documentation

```

## 🚀 Running the Project

### Option 1: Run Frontend & Backend Separately

**Frontend (from root or frontend folder):**
```bash
# From root
npm run dev

# Or from frontend folder
cd frontend
npm run dev
```

**Backend (from root or backend folder):**
```bash
# From root
npm run backend:dev

# Or from backend folder
cd backend
npm run dev
```

### Option 2: Run Both Together
```bash
# From root - runs frontend and backend concurrently
npm run dev:all
```

## 🔧 Frontend-Backend Synchronization

### API Communication
- **Frontend** is served on: `http://localhost:5173`
- **Backend API** is served on: `http://localhost:5000`
- **Proxy Configuration**: Frontend's `vite.config.js` proxies `/api/*` requests to `http://localhost:5000`

### Key Sync Points

1. **API Routes** (`frontend/src/` → `backend/api/routes/`)
   - Frontend components make requests to `/api/*` endpoints
   - Backend routes are defined in `backend/api/routes/`

2. **Data Models** (`backend/api/models/` → `frontend/src/components/`)
   - Backend Mongoose models define data structure
   - Frontend components display and interact with this data

3. **Authentication** (`backend/api/middleware/authMiddleware.js` → `frontend/hooks/`)
   - Backend validates JWT tokens from requests
   - Frontend stores and sends tokens with authenticated requests

4. **File Uploads** (`backend/api/controllers/mediaController.js` → `frontend/src/components/`)
   - Frontend handles file input and sends to `/api/media`
   - Backend saves files in `backend/api/uploads/`
   - Backend serves files from `/uploads/` endpoint

## 📦 Installing Dependencies

After restructuring, install dependencies in each folder:

```bash
# Install root dependencies (for concurrently, if needed)
npm install

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && npm install
```

## ⚙️ Environment Setup

1. **Backend Configuration**:
   - Copy `backend/.env.example` to `backend/.env`
   - Fill in your MongoDB URI, JWT secret, email credentials, etc.

2. **Frontend Configuration**:
   - Frontend should work as-is after dependencies are installed
   - The proxy in `vite.config.js` handles backend communication

## 🔄 Build & Deployment

### Build Frontend
```bash
cd frontend
npm run build
```

### Build for Deployment
The `vercel.json` is configured to deploy both frontend and backend to Vercel.

---

**Summary**: All frontend code is in `frontend/`, all backend code is in `backend/`. The root `package.json` orchestrates running both together. API endpoints are prefixed with `/api/` and proxied from frontend to backend.
