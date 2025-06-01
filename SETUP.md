# Personal Website Projects Setup Guide

This guide will help you set up your personal website with the new projects functionality.

## Prerequisites

1. **Node.js** (v14 or higher)
2. **MongoDB** (local installation or MongoDB Atlas)
3. **Git**

## Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment variables:**
   Create a `.env` file in the backend directory with:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/personal-website
   JWT_SECRET=your-super-secret-jwt-key-min-32-chars
   ```

   **For MongoDB Atlas (if using cloud):**
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/personal-website
   ```

4. **Start MongoDB locally (if using local MongoDB):**
   ```bash
   mongod
   ```

5. **Start the backend server:**
   ```bash
   npm start
   ```

   You should see:
   ```
   MongoDB Connected: [your-connection]
   Server started on port 5000
   ```

## Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`

## Features

### ✅ **Implemented Features**

- **User Authentication:** Register, login, logout with JWT tokens
- **Project Management:** Full CRUD operations (Create, Read, Update, Delete)
- **Rich Project Data:**
  - Title and description
  - Technology tags
  - GitHub repository URL
  - Live demo URL
  - Project status (Planning, In Progress, Completed, On Hold)
- **Security:** All project operations are user-authenticated
- **Modern UI:** Responsive design with status indicators and action buttons

### 🎯 **How to Use**

1. **Register/Login:** Create an account or login with existing credentials
2. **Add Projects:** Use the "Add New Project" form to create projects
3. **Edit Projects:** Click the edit icon on any project card
4. **Delete Projects:** Click the delete icon to remove projects
5. **View Projects:** All your projects are displayed in a clean portfolio layout

### 🔧 **Project Fields**

- **Title:** Project name (required)
- **Description:** Detailed project description (required)
- **Technologies:** Array of technologies used (optional)
- **GitHub URL:** Link to your repository (optional)
- **Demo URL:** Link to live demo (optional)
- **Status:** Current project status with color-coded badges

## Troubleshooting

### Backend Issues

1. **MongoDB Connection Error:**
   - Ensure MongoDB is running locally or check your Atlas connection string
   - Verify the `MONGO_URI` in your `.env` file

2. **JWT Token Issues:**
   - Make sure `JWT_SECRET` is set in your `.env` file
   - Use a strong secret (minimum 32 characters)

3. **Port Already in Use:**
   - Change the `PORT` in your `.env` file
   - Update the frontend API URL in `frontend/src/services/api.ts`

### Frontend Issues

1. **API Connection Error:**
   - Verify the backend is running on port 5000
   - Check the `API_BASE_URL` in `frontend/src/services/api.ts`

2. **Authentication Not Working:**
   - Clear browser localStorage and try logging in again
   - Check browser console for error messages

### Database Issues

1. **Projects Not Saving:**
   - Check browser console for API errors
   - Verify you're logged in and have a valid token
   - Check backend logs for validation errors

## Project Structure

```
Personal-Website/
├── backend/                 # Express.js API server
│   ├── config/             # Database configuration
│   ├── controllers/        # API route handlers
│   ├── middleware/         # Authentication middleware
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   └── server.js          # Entry point
├── frontend/              # React.js application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   └── services/      # API service functions
│   └── ...
└── SETUP.md              # This file
```

## API Endpoints

### Authentication
- `POST /api/users` - Register user
- `POST /api/users/login` - Login user
- `GET /api/users/me` - Get current user

### Projects (Protected)
- `GET /api/projects` - Get user's projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

## Security Features

- All project endpoints require authentication
- Users can only access their own projects
- JWT tokens for secure authentication
- Input validation on both frontend and backend
- CORS configured for frontend origin

## Next Steps

Your personal website is now ready to showcase your projects! You can:

1. Add your existing projects
2. Customize the UI styling to match your brand
3. Add project images/screenshots
4. Deploy to production (Vercel, Netlify, Heroku, etc.)
5. Add project filtering and search functionality

Happy coding! 🚀 