# Personal Website Frontend

A clean, modern React + TypeScript frontend for your personal website with backend integration, styled with TailwindCSS.

## What's Included

- **Clean Design**: Modern, responsive layout with smooth animations
- **TailwindCSS**: Utility-first CSS framework for rapid UI development
- **Backend Integration**: Ready-to-use API service for connecting to your backend
- **TypeScript**: Full type safety for better development experience
- **Responsive**: Mobile-friendly design that works on all devices

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **Fetch API** for backend integration
- **ESLint** for code quality

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

## TailwindCSS Setup

This project uses TailwindCSS for styling with a custom configuration:

### Custom Theme
- **Primary Colors**: Blue palette (primary-50 to primary-900)
- **Font Family**: Inter as the default sans-serif font
- **Custom breakpoints**: Responsive design utilities

### Customizing Styles

**Option 1: Use Tailwind Utility Classes**
```jsx
<div className="bg-primary-600 text-white p-4 rounded-lg hover:bg-primary-700 transition-colors">
  Button
</div>
```

**Option 2: Create Custom Components with @apply**
```css
@layer components {
  .btn-primary {
    @apply bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors;
  }
}
```

**Option 3: Extend the Theme in tailwind.config.js**
```js
theme: {
  extend: {
    colors: {
      'custom-blue': '#1e40af',
    }
  }
}
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
├── index.css          # Global styles + Tailwind directives
└── main.tsx           # Application entry point
```

## Customization

### Colors
Update colors in `tailwind.config.js`:
```js
colors: {
  primary: {
    // Your custom color palette
  }
}
```

### Components
All components use Tailwind utility classes. Key design patterns:
- **Cards**: `bg-white rounded-xl p-6 shadow-lg hover:shadow-xl`
- **Buttons**: `bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700`
- **Sections**: `py-16 md:py-24` for consistent spacing

### Content
Modify sections in `App.tsx` to match your personal information.

## Development Tips

1. **Use Tailwind IntelliSense**: Install the Tailwind CSS IntelliSense VS Code extension
2. **Responsive Design**: Use `sm:`, `md:`, `lg:`, `xl:` prefixes for responsive styles
3. **Custom Components**: Add reusable components in `@layer components` in CSS files
4. **Dark Mode**: TailwindCSS supports dark mode with `dark:` prefix (not implemented yet)

## Next Steps

1. **Start your backend server** (from the backend directory)
2. **Uncomment the API call** in `App.tsx` useEffect to load goals on page load
3. **Customize content** to match your personal information
4. **Add authentication** using the provided user API methods
5. **Extend styling** with additional Tailwind components as needed
