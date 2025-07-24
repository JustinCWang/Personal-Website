# Personal Website Frontend

React + TypeScript frontend for a personal website with backend integration and TailwindCSS styling.

---

## Purpose
Frontend for managing and displaying projects, skills, and personal information. Integrates with an Express.js backend.

---

## Tech Stack
- React 18 + TypeScript
- Vite
- TailwindCSS
- Fetch API
- ESLint

---

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

---

## Project Structure
```
src/
├── components/        # UI components
├── contexts/          # React contexts
├── hooks/             # Custom hooks
├── services/          # API integration (api.ts)
├── App.tsx            # Main app component
├── index.css          # Global styles
└── main.tsx           # Entry point
```

---

## TailwindCSS
- Utility-first CSS framework
- Custom colors and breakpoints configured in `tailwind.config.js`
- Use utility classes in components for styling

---

## Backend Integration
- API base URL: `http://localhost:5000` (development)
- All API methods in `src/services/api.ts`
- Supports project and skill CRUD, user authentication

---

## Customization
- Edit `src/components/LandingPage.tsx` for personal info
- Update colors in `tailwind.config.js` as needed
- Add or modify components in `src/components/`

---

## Development Notes
- Use Tailwind IntelliSense for class suggestions
- Responsive design via Tailwind's breakpoint prefixes
- Extend or override styles in `index.css` or via Tailwind config

---

## Usage
- Start backend server before using frontend
- Update API endpoints in `api.ts` if backend URL changes
- Customize content and components as needed
