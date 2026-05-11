import { NotesLayout } from '../../components/notes/NotesLayout';
import { useDarkMode } from '../../hooks/useDarkMode';

export default function CSNote() {
  const { isDarkMode } = useDarkMode();

  return (
    <NotesLayout>
      <div className={`mb-12 border-b pb-8 ${isDarkMode ? 'border-green-500/30' : 'border-slate-200'}`}>
        <h1 className={`text-4xl font-extrabold tracking-tight sm:text-5xl mb-4 font-mono ${isDarkMode ? 'text-green-400' : 'text-slate-900'
          }`}>
          Computer Science Notes
        </h1>
        <p className={`text-xl font-mono ${isDarkMode ? 'text-green-300' : 'text-slate-500'
          }`}>
          A collection of computer science algorithms and topics.
        </p>
      </div>

      <h2 id="data-structures" className={`text-2xl font-bold mt-12 mb-4 font-mono scroll-mt-24 ${isDarkMode ? 'text-green-400' : 'text-slate-900'}`}>
        Data Structures
      </h2>
      <p className={`font-mono mb-8 ${isDarkMode ? 'text-green-100' : 'text-slate-700'}`}>
        Data Structures notes go here. Use the components guide to start building!
      </p>

      <h2 id="sorting" className={`text-2xl font-bold mt-12 mb-4 font-mono scroll-mt-24 ${isDarkMode ? 'text-green-400' : 'text-slate-900'}`}>
        Sorting Algorithms
      </h2>
      <p className={`font-mono mb-8 ${isDarkMode ? 'text-green-100' : 'text-slate-700'}`}>
        Sorting Algorithms notes go here. Use the components guide to start building!
      </p>
    </NotesLayout>
  );
}
