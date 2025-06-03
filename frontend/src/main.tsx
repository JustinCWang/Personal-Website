/**
 * Main entry point for the Personal Website frontend
 * Initializes the React application and renders it to the DOM
 * Uses React 18's createRoot API for optimal performance
 */

// Import React dependencies
import { StrictMode } from 'react'           // React's strict mode for development warnings
import { createRoot } from 'react-dom/client'  // React 18's new root API
import './index.css'                         // Global CSS styles
import App from './App.tsx'                 // Main App component

// Initialize React application and render to DOM
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
