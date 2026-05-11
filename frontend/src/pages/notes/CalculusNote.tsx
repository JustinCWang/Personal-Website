import { NotesLayout } from '../../components/notes/NotesLayout';
import { MathBlock, InlineMath, CodeBlock } from '../../components/notes';
import { useDarkMode } from '../../hooks/useDarkMode';

export default function CalculusNote() {
  const { isDarkMode } = useDarkMode();

  return (
    <NotesLayout>
      <div className={`mb-12 border-b pb-8 ${isDarkMode ? 'border-green-500/30' : 'border-slate-200'}`}>
        <h1 className={`text-4xl font-extrabold tracking-tight sm:text-5xl mb-4 font-mono ${isDarkMode ? 'text-green-400' : 'text-slate-900'}`}>
          Calculus
        </h1>
        <p className={`text-xl font-mono ${isDarkMode ? 'text-green-300' : 'text-slate-500'}`}>
          The beginning of all things regarding change...
        </p>
      </div>

      {/* LIMITS SECTION */}
      <h2 id="limits" className={`text-2xl font-bold mt-12 mb-4 font-mono scroll-mt-24 ${isDarkMode ? 'text-green-400' : 'text-slate-900'}`}>
        1. Limits
      </h2>
      <p className={`font-mono mb-4 leading-relaxed ${isDarkMode ? 'text-green-100' : 'text-slate-700'}`}>
        A limit tells us the value that a function approaches as that function's inputs get closer and closer to some number.
        It is the fundamental concept that allows calculus to exist without dividing by zero!
      </p>

      <MathBlock math="\lim_{x \to a} f(x) = L" />

      <p className={`font-mono mb-4 leading-relaxed ${isDarkMode ? 'text-green-100' : 'text-slate-700'}`}>
        For example, consider the function <InlineMath math="f(x) = \frac{x^2 - 1}{x - 1}" />.
        If we evaluate it directly at <InlineMath math="x = 1" />, we get <InlineMath math="\frac{0}{0}" /> (undefined).
        However, if we take the limit as <InlineMath math="x" /> approaches 1:
      </p>

      <MathBlock math="\lim_{x \to 1} \frac{x^2 - 1}{x - 1} = \lim_{x \to 1} \frac{(x-1)(x+1)}{x-1} = \lim_{x \to 1} (x+1) = 2" />

      {/* DERIVATIVES SECTION */}
      <h2 id="derivatives" className={`text-2xl font-bold mt-16 mb-4 font-mono scroll-mt-24 ${isDarkMode ? 'text-green-400' : 'text-slate-900'}`}>
        2. Derivatives
      </h2>
      <p className={`font-mono mb-4 leading-relaxed ${isDarkMode ? 'text-green-100' : 'text-slate-700'}`}>
        The derivative represents the rate of change of a function at any given point.
        Graphically, it is the slope of the tangent line to the function's curve.
        It is formally defined using the concept of a limit:
      </p>

      <MathBlock math="f'(x) = \lim_{h \to 0} \frac{f(x+h) - f(x)}{h}" />

      <p className={`font-mono mt-6 mb-4 leading-relaxed ${isDarkMode ? 'text-green-100' : 'text-slate-700'}`}>
        In computer science, we often approximate derivatives numerically since we don't always have analytical formulas.
        We use a small finite value for <InlineMath math="h" />:
      </p>

      <CodeBlock
        language="python"
        code={`def numerical_derivative(f, x, h=1e-5):
    """
    Computes the derivative of f at point x using the 
    finite difference approximation.
    """
    return (f(x + h) - f(x)) / h

# Example: derivative of f(x) = x^2 at x = 3
f = lambda x: x**2
slope = numerical_derivative(f, 3)
print(f"Slope at x=3 is ~{slope:.2f}")  # Output: ~6.00`}
      />

      {/* INTEGRALS SECTION */}
      <h2 id="integrals" className={`text-2xl font-bold mt-16 mb-4 font-mono scroll-mt-24 ${isDarkMode ? 'text-green-400' : 'text-slate-900'}`}>
        3. Integrals
      </h2>
      <p className={`font-mono mb-4 leading-relaxed ${isDarkMode ? 'text-green-100' : 'text-slate-700'}`}>
        An integral assigns numbers to functions in a way that describes displacement, area, volume, and other concepts that arise by combining infinitesimal data.
        The definite integral represents the signed area under the curve of <InlineMath math="f(x)" /> from <InlineMath math="x=a" /> to <InlineMath math="x=b" />.
      </p>

      <MathBlock math="\int_a^b f(x) \, dx" />

      <p className={`font-mono mt-6 mb-4 leading-relaxed ${isDarkMode ? 'text-green-100' : 'text-slate-700'}`}>
        The <strong>Fundamental Theorem of Calculus</strong> links derivatives and integrals, showing they are essentially inverse operations. If <InlineMath math="F(x)" /> is the antiderivative of <InlineMath math="f(x)" />:
      </p>

      <MathBlock math="\int_a^b f(x) \, dx = F(b) - F(a)" />

      <p className={`font-mono mt-6 mb-4 leading-relaxed ${isDarkMode ? 'text-green-100' : 'text-slate-700'}`}>
        Programmatically, we can estimate an integral by summing up the area of small rectangles under the curve (Riemann Sum):
      </p>

      <CodeBlock
        language="python"
        code={`def riemann_integral(f, a, b, n=1000):
    """
    Approximates the definite integral of f from a to b
    using a left Riemann sum with n rectangles.
    """
    width = (b - a) / n
    total_area = 0
    for i in range(n):
        x = a + i * width
        total_area += f(x) * width
    return total_area

# Example: integral of f(x) = 2x from x=0 to x=3 (Area of triangle = 9)
f = lambda x: 2 * x
area = riemann_integral(f, 0, 3)
print(f"Area is ~{area:.2f}")`}
      />

    </NotesLayout>
  );
}
