/**
 * Notes Index Page
 * The landing page for the digital notes section
 * Serves as a guide showcasing all available custom note components
 */

import { NotesLayout } from '../../components/notes/NotesLayout';
import { NoteTitle, NoteParagraph } from '../../components/notes';
import { useDarkMode } from '../../hooks/useDarkMode';

/**
 * Renders the index/welcome page for notes
 * @returns {JSX.Element} Welcome page for the digital notes section
 */
export default function NotesIndex() {
  const { isDarkMode } = useDarkMode();

  return (
    <NotesLayout>
      <div className="flex flex-col items-center justify-center text-center mt-12 mb-8">
        <svg className={`w-24 h-24 mb-6 ${isDarkMode ? 'text-green-500/50' : 'text-slate-300'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>

        <NoteTitle>My Notes</NoteTitle>
        <p className={`text-xl font-mono max-w-2xl ${isDarkMode ? 'text-green-300' : 'text-slate-500'}`}>
          A personal repository of my Math and Computer Science knowledge.
        </p>
      </div>

      <div className={`p-8 rounded-2xl mb-8 border font-mono ${isDarkMode ? 'bg-black/40 border-green-500/30 text-green-100' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
        <h2 className={`text-xl font-bold mb-4 uppercase tracking-wider ${isDarkMode ? 'text-green-400' : 'text-slate-900'}`}>Preface</h2>
        <p className="leading-relaxed mb-4">
          There is so much to learn, especially in today's world, and it can be difficult to keep track of everything one learns.
          I've found taking notes in a teaching manner is one of the best ways to solidify your own understanding.
          In these notes, I share my personal explanations and intuition for the topics that I have learned.
        </p>
        <p className="leading-relaxed mb-4">
          My hope is that maybe my intuition and explanations can benefit not just myself, but others who find themselves curious with the world of CS and Math.
        </p>
        <p className="leading-relaxed">
          This is not meant to dive deep into any one subject, but instead provide a comprehensive view for understanding. ~Enjoy!
        </p>
      </div>

      <NoteParagraph className="text-center">
        Please select a topic from the sidebar on the left to get started. <br />
        If you want to see how these pages are built, click the info button (ⓘ).
      </NoteParagraph>
    </NotesLayout >
  );
}
