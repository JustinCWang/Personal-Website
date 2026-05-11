import { NotesLayout } from '../../components/notes/NotesLayout';
import { MathBlock, InlineMath, CodeBlock, DiagramBlock, InteractiveBlock } from '../../components/notes';
import { useDarkMode } from '../../hooks/useDarkMode';

export default function NotesIndex() {
  const { isDarkMode } = useDarkMode();

  return (
    <NotesLayout>
      <div className={`mb-12 border-b pb-8 ${isDarkMode ? 'border-green-500/30' : 'border-slate-200'}`}>
        <h1 className={`text-4xl font-extrabold tracking-tight sm:text-5xl mb-4 font-mono ${isDarkMode ? 'text-green-400' : 'text-slate-900'
          }`}>
          Digital Notes Guide
        </h1>
        <p className={`text-xl font-mono ${isDarkMode ? 'text-green-300' : 'text-slate-500'
          }`}>
          Welcome! Here is a guide on how to use all the components we built to construct your Math and Computer Science notes.
        </p>
      </div>

      <h2 className={`text-2xl font-bold mt-12 mb-4 font-mono ${isDarkMode ? 'text-green-400' : 'text-slate-900'
        }`}>
        1. Using Math Blocks
      </h2>
      <p className={`leading-relaxed mb-4 font-mono ${isDarkMode ? 'text-green-100' : 'text-slate-700'
        }`}>
        You can use <code className={`px-1.5 py-0.5 rounded-md text-sm ${isDarkMode ? 'bg-black/50 text-green-300 border border-green-500/30' : 'bg-slate-100 text-slate-800'}`}>{'<InlineMath math="..." />'}</code> for inline equations like <InlineMath math="F" />, and <code className={`px-1.5 py-0.5 rounded-md text-sm ${isDarkMode ? 'bg-black/50 text-green-300 border border-green-500/30' : 'bg-slate-100 text-slate-800'}`}>{'<MathBlock math="..." />'}</code> for block equations:
      </p>

      {/* Render Math Block */}
      <MathBlock math="\int_a^b f(x) \, dx = F(b) - F(a)" />

      <h2 className={`text-2xl font-bold mt-12 mb-4 font-mono ${isDarkMode ? 'text-green-400' : 'text-slate-900'
        }`}>
        2. Using Code Blocks
      </h2>
      <p className={`leading-relaxed mb-4 font-mono ${isDarkMode ? 'text-green-100' : 'text-slate-700'
        }`}>
        Use <code className={`px-1.5 py-0.5 rounded-md text-sm ${isDarkMode ? 'bg-black/50 text-green-300 border border-green-500/30' : 'bg-slate-100 text-slate-800'}`}>{'<CodeBlock language="..." code={`...`} />'}</code> to highlight code snippets properly:
      </p>

      {/* Render Code Block */}
      <CodeBlock
        language="python"
        code={`
def estimate_derivative(f, x, h=1e-5):
    """
    Numerically estimate the derivative of function f at point x.
    """
    return (f(x + h) - f(x)) / h
        `}
      />

      <h2 className={`text-2xl font-bold mt-12 mb-4 font-mono ${isDarkMode ? 'text-green-400' : 'text-slate-900'
        }`}>
        3. Using Diagram Blocks
      </h2>
      <p className={`leading-relaxed mb-4 font-mono ${isDarkMode ? 'text-green-100' : 'text-slate-700'
        }`}>
        Use <code className={`px-1.5 py-0.5 rounded-md text-sm ${isDarkMode ? 'bg-black/50 text-green-300 border border-green-500/30' : 'bg-slate-100 text-slate-800'}`}>{'<DiagramBlock chart={`...`} />'}</code> with Mermaid syntax to draw flowchart diagrams:
      </p>

      {/* Render Diagram Block */}
      <DiagramBlock
        chart={`
graph LR
    A[Position s] -->|Derivative| B(Velocity v)
    B -->|Derivative| C(Acceleration a)
        `}
      />

      <h2 className={`text-2xl font-bold mt-12 mb-4 font-mono ${isDarkMode ? 'text-green-400' : 'text-slate-900'
        }`}>
        4. Using Interactive Blocks
      </h2>
      <p className={`leading-relaxed mb-4 font-mono ${isDarkMode ? 'text-green-100' : 'text-slate-700'
        }`}>
        Use <code className={`px-1.5 py-0.5 rounded-md text-sm ${isDarkMode ? 'bg-black/50 text-green-300 border border-green-500/30' : 'bg-slate-100 text-slate-800'}`}>{'<InteractiveBlock title="...">...</InteractiveBlock>'}</code> to wrap your custom interactive React components!
      </p>

      {/* Interactive Wrapper Block */}
      <InteractiveBlock title="Custom Component Wrapper">
        <div className={`h-32 border-2 border-dashed rounded-lg flex items-center justify-center font-mono ${isDarkMode ? 'border-green-500/50 text-green-500/80' : 'border-slate-600 text-slate-500'
          }`}>
          <p>Put interactive tools here!</p>
        </div>
      </InteractiveBlock>

    </NotesLayout>
  );
}
