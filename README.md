# Personal Website

A full-stack MERN (MongoDB, Express.js, React, Node.js) portfolio and project management web application. Provides project and skill management, customizable landing page, and secure authentication with a fun UI.

---

## Purpose
A web application for managing and showcasing projects and skills, with a customizable landing page and secure user authentication.

---

## Tech Stack
- **Frontend:** React, Vite, TypeScript, TailwindCSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (local or Atlas)
- **ORM:** Mongoose
- **Authentication:** JWT (localStorage)
- **Other Tools:** Nodemon, ESLint, Vercel

---

## Features
- User authentication (register, login, logout; JWT-based)
- Project CRUD (create, read, update, delete)
- Project data: title, description, technologies, GitHub/demo URLs, status, featured flag, dates, images, tags, team size, content sections
- Skills CRUD with categories
- Admin dashboard for project and skill management
- Customizable landing page (personal info, featured projects, skills, hobbies, social links)
- Responsive UI, dark mode, animations

---

## File Structure
```
Personal-Website/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   └── services/
│   └── ...
├── README.md
├── vercel.json
└── ...
```

---

## Setup & Usage

### Prerequisites
- Node.js v14+
- MongoDB (local or Atlas)
- Git

### Backend
```bash
cd backend
npm install
# .env file required:
# NODE_ENV=development
# PORT=5000
# MONGO_URI=mongodb+srv://myDatabaseUser:D1fficultP%40ssw0rd@cluster0.example.mongodb.net/?retryWrites=true&w=majority
# JWT_SECRET=your-super-secret-jwt-key-min-32-chars
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Runs at http://localhost:5173
```

---

## Deployment (Vercel)
1. Push code to GitHub
2. Create MongoDB Atlas cluster and user
3. Deploy to Vercel, set environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
4. Update CORS origins in `backend/server.js` for Vercel domain
5. Test deployed site and API

---

## Customization
- Edit `frontend/src/components/LandingPage.tsx` (`PERSONAL_INFO`) for name, title, bio, image, hobbies, social links
- Place image in `frontend/public/professionalpic.jpg` or use external URL
- Mark projects as "Featured" in dashboard to show on landing page
- Skills are categorized; manage in dashboard
- Add sections or social links by editing `LandingPage.tsx`
- Add meta tags in `frontend/index.html` for SEO

---

## API Endpoints

### Projects
- `GET /api/projects/featured` — Public: featured projects
- `GET /api/projects` — Auth: all user projects
- `POST /api/projects` — Auth: create project
- `PUT /api/projects/:id` — Auth: update project
- `DELETE /api/projects/:id` — Auth: delete project

### Skills
- `GET /api/skills` — Public: all skills
- `GET /api/skills/category/:category` — Public: skills by category
- `POST /api/skills` — Auth: add skill
- `PUT /api/skills/:id` — Auth: update skill
- `DELETE /api/skills/:id` — Auth: delete skill

### Users
- `POST /api/users` — Register
- `POST /api/users/login` — Login
- `GET /api/users/me` — Auth: user info

---

## Data Models

### Project
- `title` (string, required)
- `description` (string, required)
- `technologies` (string[])
- `githubUrl`, `demoUrl` (string)
- `status` (Planning, In Progress, Completed, On Hold)
- `featured` (boolean)
- `startDate`, `endDate` (Date)
- `images` (string[])
- `body1`, `body2`, `body3` (string)
- `tags` (string[])
- `teamSize` (number)

### Skill
- `name` (string, required)
- `category` (enum: Programming Languages, Frontend, Backend, AI/ML, DevOps & Tools, Additional Tools)

### User
- `name` (string, required)
- `email` (string, required, unique)
- `password` (string, required, hashed)

---

## Troubleshooting
- Backend: Check MongoDB connection, .env config, CORS
- Frontend: Ensure API URL in `frontend/src/services/api.ts`
- Auth: JWT token in localStorage; clear if login issues
- Deployment: Check Vercel build logs, browser console, function logs, environment variables