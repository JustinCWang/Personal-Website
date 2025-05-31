# Personal Website Frontend

A clean, modern React + TypeScript frontend for your personal website with backend integration.

## What's Included

- **Clean Design**: Modern, responsive layout with smooth animations
- **Backend Integration**: Ready-to-use API service for connecting to your backend
- **TypeScript**: Full type safety for better development experience
- **Responsive**: Mobile-friendly design that works on all devices

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

## Backend Integration

The frontend is configured to work with your Express.js backend running on `http://localhost:5000`.

### API Integration Features

- **Goals Management**: Fetch, create, update, and delete goals
- **User Authentication**: Login and registration (ready for implementation)
- **Error Handling**: Proper error states and user feedback
- **Loading States**: Visual feedback during API calls

### Using the API Service

The `src/services/api.ts` file contains all API methods:

```typescript
import { goalsAPI } from './services/api'

// Fetch all goals
const goals = await goalsAPI.getAll()

// Create a new goal
const newGoal = await goalsAPI.create({ title: 'Learn React', description: 'Master React fundamentals' })
```

## Project Structure

```
src/
├── services/          # API integration
│   └── api.ts         # Backend API calls
├── App.tsx            # Main application component
├── App.css            # Application styles
├── index.css          # Global styles
└── main.tsx           # Application entry point
```

## Customization

- **Colors**: Update the color scheme in `App.css` and `index.css`
- **Content**: Modify sections in `App.tsx` to match your personal information
- **API Base URL**: Change `API_BASE_URL` in `src/services/api.ts` for different environments

## Next Steps

1. **Start your backend server** (from the backend directory)
2. **Uncomment the API call** in `App.tsx` useEffect to load goals on page load
3. **Customize content** to match your personal information
4. **Add authentication** using the provided user API methods
