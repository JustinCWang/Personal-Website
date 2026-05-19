/**
 * Calculus Notes Page
 * A comprehensive overview of limits, derivatives, and integrals
 * Demonstrates the use of NoteTypography, MathBlock, and CodeBlock components
 */

import { NotesLayout } from '../../components/notes/NotesLayout';
import { MathBlock, InlineMath, NoteHeader, NoteSectionTitle, NoteSubSectionTitle, NoteParagraph, DiagramBlock } from '../../components/notes';
import { Mafs, Coordinates, Plot, Theme, Line, Circle } from "mafs";
import "mafs/core.css";
import "mafs/font.css";
import { useDarkMode } from '../../hooks/useDarkMode';

/**
 * Renders the Calculus notes content
 * @returns {JSX.Element} Structured calculus notes page
 */
export default function CalculusNote() {
  const { isDarkMode } = useDarkMode();

  const mafsStyle = isDarkMode ? {
    '--mafs-fg': '#4ade80',
    '--mafs-bg': 'transparent',
    '--mafs-line-color': '#22c55e40',
    '--mafs-origin-color': '#4ade80'
  } as React.CSSProperties : {
    '--mafs-fg': '#1e293b',
    '--mafs-bg': 'transparent',
    '--mafs-line-color': '#cbd5e1',
    '--mafs-origin-color': '#64748b'
  } as React.CSSProperties;
  const dottedMafsStyle = {
    ...mafsStyle,
    '--mafs-line-stroke-dash-style': '1, 8',
  } as React.CSSProperties;

  const graphListClassName = `list-disc pl-6 mb-8 font-mono text-sm space-y-2 [&_span]:!text-inherit [&_.katex]:!text-inherit ${isDarkMode ? 'text-green-100/80' : 'text-slate-700'}`;
  const graphColors = {
    foreground: isDarkMode ? '#4ade80' : '#1e293b',
    red: '#f11d0e',
    orange: '#f14e0e',
    yellow: '#ffe44a',
    green: '#15e272',
    blue: '#58a6ff',
    violet: '#ae58ff',
    asymptote: '#9ca3af',
  };

  return (
    <NotesLayout>
      <NoteHeader
        title="Calculus"
        subtitle="The beginning of all things regarding change..."
      />

      {/* 1. FUNCTIONS SECTION */}
      <NoteSectionTitle id="functions">1. Functions</NoteSectionTitle>

      <NoteSubSectionTitle id="function-basics">1.1 Function Basics</NoteSubSectionTitle>
      <NoteParagraph>
        We can think of functions as some box that takes in some input and spits out some output.
      </NoteParagraph>
      <DiagramBlock chart={`graph LR
       X(("$$x$$")) --> F["$$f(x)$$"]
       F --> Y(("$$y$$"))`} />
      <NoteParagraph>
        What the function does itself can stay an abstraction, but it does have an important guideline.
        A function cannot give two different outputs for the same input, or graphically, functions pass the <strong>vertical line test</strong>.
      </NoteParagraph>

      <NoteSubSectionTitle id="domain-and-range">1.2 Domain and Range</NoteSubSectionTitle>
      <NoteParagraph>
        All functions have a <strong>domain</strong> and <strong>range</strong>. The domain dictates the set of allowed inputs and
        the range dictates the set of all possible outputs. One should always consider what both of these are before anything else.
      </NoteParagraph>

      <NoteSubSectionTitle id="composition-of-functions">1.3 Composition of Functions</NoteSubSectionTitle>
      <NoteParagraph>
        Functions are just building blocks. When combining them together, we create a <strong>composition of functions</strong>.
        We denote such a composition of functions like so:
        <MathBlock math="(f ∘ g)(x) = f(g(x))" />
        Note that the we always evaluate the inside function first and work outwards!
      </NoteParagraph>

      <NoteSubSectionTitle id="inverse-functions">1.4 Inverse Functions</NoteSubSectionTitle>
      <NoteParagraph>
        If we can modify an input with a function, then naturally we might want to also <strong>undo</strong> our changes.
        This is called the <strong>inverse</strong> of the function. Of course, a function's inverse only exists if it is
        <strong>one-to-one</strong> or <strong>injective</strong>. If this was false, then clearly we can't find the
        inverse since we can't tell what the original input was! Visually, we can check with the <strong>horizontal line test</strong>.
        We commonly denote the inverse of a function as:
        <MathBlock math="f^{-1}(x)" />

      </NoteParagraph>

      <NoteSubSectionTitle id="graph-transformations">1.5 Graph Transformations</NoteSubSectionTitle>
      <NoteParagraph>
        Diving a bit deeper, we can easily <strong>transform</strong> the shape or position of a function <InlineMath math="y = f(x)" /> into whatever
        we desire. Most commonly, we use <InlineMath math="a" /> as a scalar and <InlineMath math="c" /> as a constant.
      </NoteParagraph>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-start mb-8">
        <div>
          <ul className={graphListClassName}>
            <li><InlineMath math="f(x)" />: original function</li>
            <li><InlineMath math="f(x) + c" />: shift up <InlineMath math="c" /></li>
            <li><InlineMath math="f(x) - c" />: shift down <InlineMath math="c" /></li>
            <li><InlineMath math="f(x - c)" />: shift right <InlineMath math="c" /></li>
            <li><InlineMath math="f(x + c)" />: shift left <InlineMath math="c" /></li>
            <li><InlineMath math="-c \cdot f(x)" />: reflect and stretch vertically</li>
            <li><InlineMath math="f(-x)" />: reflect across y-axis</li>
            <li><InlineMath math="-f(x) + c" />: reflect across x-axis and shift up</li>
            <li><InlineMath math="a \cdot f(x)" />: vertical stretch/compression</li>
            <li><InlineMath math="f(ax)" />: horizontal compression/stretch</li>
          </ul>
          <NoteParagraph>
            The graph shows some basic transformations applied to <InlineMath math="f(x) = x^2" />.
          </NoteParagraph>
        </div>

        <div className={`p-1 rounded-xl border ${isDarkMode ? 'bg-black/50 border-green-500/30' : 'bg-slate-50 border-slate-200'}`}>
          <div className="rounded-lg overflow-hidden" style={mafsStyle}>
            <Mafs viewBox={{ x: [-4, 4], y: [-1, 4] }} height={300} zoom>
              <Coordinates.Cartesian />
              <Plot.OfX y={(x) => x ** 2} color={Theme.foreground} />
              <Plot.OfX y={(x) => x ** 2 + 2} color={Theme.green} />
              <Plot.OfX y={(x) => (x - 2) ** 2} color={Theme.red} />
              <Plot.OfX y={(x) => -(x ** 2) + 2} color={Theme.orange} />
              <Plot.OfX y={(x) => 4 * (x ** 2)} color={Theme.violet} />
            </Mafs>
          </div>
        </div>
      </div>

      <NoteSubSectionTitle id="polynomial-functions">1.6 Polynomial Functions</NoteSubSectionTitle>
      <NoteParagraph>
        Polynomial functions are continuous everywhere and built from powers of <InlineMath math="x"/> with non-negative integer exponents. You 
        have probably seen a function like <InlineMath math="f(x) = x^3 + 2x^2 + 4"/>. This is a basic polynomial function of <strong>degree 3</strong>, 
        denoted by the highest power of the polynomial. I find the most intuitive way to understand polynomial functions is to just look at them.  
      </NoteParagraph>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-start mb-8">
        <div>
          <ul className={graphListClassName}>
            <li style={{ color: graphColors.foreground }}><InlineMath math="f(x) = x"/></li>
            <li style={{ color: graphColors.green }}><InlineMath math="f(x) = x^2" /></li>
            <li style={{ color: graphColors.red }}><InlineMath math="f(x) = x^3" /></li>
            <li style={{ color: graphColors.orange }}><InlineMath math="f(x) = x^{4}\ +\ 2x^{3}" /></li>
            <li style={{ color: graphColors.violet }}><InlineMath math="f(x) = x^{5}-5x^{3}+4x" /></li>
            <li style={{ color: graphColors.blue }}><InlineMath math="f(x) = \frac{1}{2}x^{6}-\frac{15}{4}x^{4}+6x^{2}" /></li>
          </ul>
          <NoteParagraph>
            The graph shows basic polynomial functions of degree 1-6 with coefficients to highlight some patterns with polynomial functions. 
            Notice that for <strong>degree n</strong>, there are at most <strong>n-1 critical points</strong>. Additionally, it may be useful to 
            keep in mind the relationship between the parity of the degree and end behavior of the function! 
          </NoteParagraph>
        </div>

        <div className={`p-1 rounded-xl border ${isDarkMode ? 'bg-black/50 border-green-500/30' : 'bg-slate-50 border-slate-200'}`}>
          <div className="rounded-lg overflow-hidden" style={mafsStyle}>
            <Mafs viewBox={{ x: [-3, 3], y: [-3, 3] }} height={300} zoom>
              <Coordinates.Cartesian />
              <Plot.OfX y={(x) => x} color={Theme.foreground} />
              <Plot.OfX y={(x) => x ** 2} color={Theme.green} />
              <Plot.OfX y={(x) => x ** 3} color={Theme.red} />
              <Plot.OfX y={(x) => x ** 4 + 2 *x ** 3} color={Theme.orange} />
              <Plot.OfX y={(x) => x ** 5 - 5 * x ** 3 + 4 * x} color={Theme.violet} />
              <Plot.OfX y={(x) => 1/2 *x ** 6 - 15/4 * x ** 4 + 6 * x ** 2} color={Theme.blue} />
            </Mafs>
          </div>
        </div>
      </div>

      <NoteSubSectionTitle id="rational-functions">1.7 Rational Functions</NoteSubSectionTitle>
      <NoteParagraph>
        Rational functions are a ratio of two polynomials. Because we have a denominator, it can't be zero or else it would be undefined.
        This results in behavior that we call <strong>asymptotes.</strong>. Additionally, factors of the polynomials can cancel resulting in what
        we call a <strong>hole</strong>. This results in a domain restriction which we can see in the examples below.
      </NoteParagraph>    
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-start mb-8">
        <div>
          <ul className={graphListClassName}>
            <li style={{ color: graphColors.blue }}><InlineMath math="f(x) = \frac{x+3}{x+2}, x \in \mathbb{R} \setminus \{-2\}" /></li>
            <li style={{ color: graphColors.green }}><InlineMath math="f(x) = \frac{2-x}{x-1}, x \in \mathbb{R} \setminus \{1\}" /></li>
            <li style={{ color: graphColors.red }}><InlineMath math="f(x) = \frac{x^2 - 2x - 2}{x - 3}, x \in \mathbb{R} \setminus \{3\}" /></li>
            <li style={{ color: graphColors.violet }}><InlineMath math="f(x) = \frac{(x-1)(x+3)}{x+3}, x \in \mathbb{R} \setminus \{-3\}" /></li>
          </ul>
          <NoteParagraph>
            We denote the vertical, horizontal, and slant asymptotes with dotted gray lines. The open circle marks the <strong>hole</strong>.
            Notice the restrictions upon the domain that this family of functions induces. In a more practical sense, it might be useful to 
            think of the asymptotes and holes as modeling the <strong>limitations</strong> of reality, where the theory doesn't quite match up 
            with practicality.  
          </NoteParagraph>
        </div>

        <div className={`p-1 rounded-xl border ${isDarkMode ? 'bg-black/50 border-green-500/30' : 'bg-slate-50 border-slate-200'}`}>
          <div className="rounded-lg overflow-hidden" style={dottedMafsStyle}>
            <Mafs viewBox={{ x: [-4, 4], y: [-5, 6], padding: 0 }} height={300} zoom>
              <Coordinates.Cartesian />

              <Plot.OfX y={(x) => (x + 3) / (x + 2)} domain={[4, 100]} color={Theme.blue} />
              <Plot.OfX y={(x) => (x + 3) / (x + 2)} domain={[-4, -2.0000001]} color={Theme.blue} />
              <Plot.OfX y={(x) => (x + 3) / (x + 2)} domain={[-1.999999, 4]} color={Theme.blue} />
              <Plot.OfX y={(x) => (x + 3) / (x + 2)} domain={[-100, -4]} color={Theme.blue} />

              <Plot.OfX y={(x) => (2 - x) / (x - 1)} domain={[4, 100]} color={Theme.green} />
              <Plot.OfX y={(x) => (2 - x) / (x - 1)} domain={[-4, 0.999999]} color={Theme.green} />
              <Plot.OfX y={(x) => (2 - x) / (x - 1)} domain={[1.000001, 4]} color={Theme.green} />
              <Plot.OfX y={(x) => (2 - x) / (x - 1)} domain={[-100, -4]} color={Theme.green} />

              <Plot.OfX y={(x) => (x ** 2 - 2 * x - 2) / (x - 3)} domain={[4, 100]} color={Theme.red} />
              <Plot.OfX y={(x) => (x ** 2 - 2 * x - 2) / (x - 3)} domain={[-4, 2.999999]} color={Theme.red} />
              <Plot.OfX y={(x) => (x ** 2 - 2 * x - 2) / (x - 3)} domain={[3.000001, 4]} color={Theme.red} />
              <Plot.OfX y={(x) => (x ** 2 - 2 * x - 2) / (x - 3)} domain={[-100, -4]} color={Theme.red} />

              <Plot.OfX y={(x) => x - 1} color={Theme.violet} />

              <Line.ThroughPoints point1={[-2, -5]} point2={[-2, 6]} color={graphColors.asymptote} style="dashed" opacity={0.9} />
              <Line.ThroughPoints point1={[1, -5]} point2={[1, 6]} color={graphColors.asymptote} style="dashed" opacity={0.9} />
              <Line.ThroughPoints point1={[3, -5]} point2={[3, 6]} color={graphColors.asymptote} style="dashed" opacity={0.9} />
              <Line.PointSlope point={[0, 1]} slope={0} color={graphColors.asymptote} style="dashed" opacity={0.9} />
              <Line.PointSlope point={[0, -1]} slope={0} color={graphColors.asymptote} style="dashed" opacity={0.9} />
              <Line.PointSlope point={[0, 1]} slope={1} color={graphColors.asymptote} style="dashed" opacity={0.9} />

              <Circle center={[-3, -4]} radius={0.12} color={Theme.violet} fillOpacity={0} strokeOpacity={1} weight={3} />
            </Mafs>
          </div>
        </div>
      </div>                                                                  

      <NoteSubSectionTitle id="exponential-functions">1.8 Exponential Functions</NoteSubSectionTitle>
      <NoteParagraph>
        Exponential functions have the variable in the exponent, modeling repeated multiplication. A basic exponential
        function has the form <InlineMath math="f(x) = a^x" />, where <InlineMath math="a > 0" /> and <InlineMath math="a \ne 1" />.
        When <InlineMath math="a > 1" />, the function <strong>grows</strong> and when <InlineMath math="0 < a < 1" />, the function <strong>decays</strong>.
      </NoteParagraph>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-start mb-8">
        <div>
          <ul className={graphListClassName}>
            <li style={{ color: graphColors.blue }}><InlineMath math="f(x) = 2^x" /></li>
            <li style={{ color: graphColors.green }}><InlineMath math="f(x) = \left(\frac{1}{2}\right)^x" /></li>
            <li style={{ color: graphColors.red }}><InlineMath math="f(x) = e^x" /></li>
            <li style={{ color: graphColors.violet }}><InlineMath math="f(x) = 2^x - 2" /></li>
            <li style={{ color: graphColors.orange }}><InlineMath math="f(x) = 2^{x-1} - 2" /></li>
          </ul>
          <NoteParagraph>
            Unlike rational functions, exponential functions have domain <InlineMath math="\mathbb{R}"/>. However, as seen from the examples, the range is now 
            limited by their horizontal asymptote, controlled by the <strong>vertical shift</strong> of the function. Practically, we see exponential functions
            as a very good fit for modeling a variety of fields from finance to biology. 
          </NoteParagraph>
        </div>

        <div className={`p-1 rounded-xl border ${isDarkMode ? 'bg-black/50 border-green-500/30' : 'bg-slate-50 border-slate-200'}`}>
          <div className="rounded-lg overflow-hidden" style={dottedMafsStyle}>
            <Mafs viewBox={{ x: [-4, 4], y: [-3, 6], padding: 0 }} height={300} zoom>
              <Coordinates.Cartesian />

              <Plot.OfX y={(x) => 2 ** x} color={Theme.blue} />
              <Plot.OfX y={(x) => (1 / 2) ** x} color={Theme.green} />
              <Plot.OfX y={(x) => Math.E ** x} color={Theme.red} />
              <Plot.OfX y={(x) => 2 ** x - 2} color={Theme.violet} />
              <Plot.OfX y={(x) => 2 ** (x - 1) - 2} color={Theme.orange} />

              <Line.PointSlope point={[0, 0]} slope={0} color={graphColors.asymptote} style="dashed" opacity={0.9} />
              <Line.PointSlope point={[0, -2]} slope={0} color={graphColors.asymptote} style="dashed" opacity={0.9} />
            </Mafs>
          </div>
        </div>
      </div>

      <NoteSubSectionTitle id="logarithmic-functions">1.9 Logarithmic Functions</NoteSubSectionTitle>
      <NoteParagraph>
        Logarithmic functions can be thought of as the inverses of exponential functions. A basic logarithmic function answers the question:
        what exponent gives this input? Because logs can only take positive inputs, the inside of the logarithm determines the domain.
      </NoteParagraph>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-start mb-8">
        <div>
          <ul className={graphListClassName}>
            <li style={{ color: graphColors.blue }}><InlineMath math="f(x) = \log_2(x), x > 0" /></li>
            <li style={{ color: graphColors.red }}><InlineMath math="f(x) = \ln(x), x > 0" /></li>
            <li style={{ color: graphColors.green }}><InlineMath math="f(x) = -\log_2(x), x > 0" /></li>
            <li style={{ color: graphColors.violet }}><InlineMath math="f(x) = \log_2(x - 1), x > 1" /></li>
          </ul>
          <NoteParagraph>
            Of the example functions, one should take note of <InlineMath math="ln(x) = \log_e(x)" /> which denotes the <strong>natural log</strong>. 
            This special log is seen everywhere and should be remembered. Intuitively, logarithmic functions should be thought of solving for extreme 
            scales. Just looking at the graph, as the <InlineMath math="x"/> value grows, the <InlineMath math="y"/> value grows much slower, but still grows 
            unboundedly nonetheless. 
          </NoteParagraph>
        </div>

        <div className={`p-1 rounded-xl border ${isDarkMode ? 'bg-black/50 border-green-500/30' : 'bg-slate-50 border-slate-200'}`}>
          <div className="rounded-lg overflow-hidden" style={dottedMafsStyle}>
            <Mafs viewBox={{ x: [-1, 6], y: [-4, 4], padding: 0 }} height={300} zoom>
              <Coordinates.Cartesian />

              <Plot.OfX y={(x) => Math.log2(x)} color={Theme.blue} />
              <Plot.OfX y={(x) => Math.log(x)} color={Theme.red} />
              <Plot.OfX y={(x) => -Math.log2(x)} color={Theme.green} />
              <Plot.OfX y={(x) => Math.log2(x - 1)} color={Theme.violet} />

              <Line.ThroughPoints point1={[0, -4]} point2={[0, 4]} color={graphColors.asymptote} style="dashed" opacity={0.9} />
              <Line.ThroughPoints point1={[1, -4]} point2={[1, 4]} color={graphColors.asymptote} style="dashed" opacity={0.9} />
            </Mafs>
          </div>
        </div>
      </div>

      <NoteSubSectionTitle id="trigonometric-functions">1.10 Trigonometric Functions</NoteSubSectionTitle>
      <NoteParagraph>
        Trigonometric functions connect angles to ratios on the <strong>unit circle</strong>. The sine and cosine functions are <strong>periodic</strong> and bounded,
        while tangent is periodic but has <strong>vertical asymptotes</strong> wherever cosine is zero. That is to say, this family of functions model waves.  
      </NoteParagraph>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-start mb-8">
        <div>
          <ul className={graphListClassName}>
            <li style={{ color: graphColors.blue }}><InlineMath math="f(x) = \sin(x - 1)" /></li>
            <li style={{ color: graphColors.green }}><InlineMath math="f(x) = \cos(x) + 2" /></li>
            <li style={{ color: graphColors.red }}><InlineMath math="f(x) = \tan(x), x \ne \frac{\pi}{2} + k\pi" /></li>
            <li style={{ color: graphColors.violet }}><InlineMath math="f(x) = 2\sin(x)" /></li>
          </ul>
          <NoteParagraph>
            Every trigonometric function has the following properties: period, amplitude, phase shift, and vertical shift. The <strong>period</strong> is how long it 
            takes for the function to repeat itself, the <strong>amplitude</strong> is how far the function goes from its center line, the <strong>phase shift</strong> is 
            how much the function is shifted horizontally, and the <strong>vertical shift</strong> is how much the function is shifted vertically.
          </NoteParagraph>
        </div>

        <div className={`p-1 rounded-xl border ${isDarkMode ? 'bg-black/50 border-green-500/30' : 'bg-slate-50 border-slate-200'}`}>
          <div className="rounded-lg overflow-hidden" style={dottedMafsStyle}>
            <Mafs viewBox={{ x: [-2 * Math.PI, 2 * Math.PI], y: [-3, 3], padding: 0 }} height={300} zoom>
              <Coordinates.Cartesian />

              <Plot.OfX y={(x) => Math.sin(x - 1)} color={Theme.blue} />
              <Plot.OfX y={(x) => Math.cos(x) + 2} color={Theme.green} />
              <Plot.OfX y={(x) => Math.tan(x)} domain={[-2 * Math.PI, -1.5 * Math.PI - 0.05]} color={Theme.red} />
              <Plot.OfX y={(x) => Math.tan(x)} domain={[-1.5 * Math.PI + 0.05, -0.5 * Math.PI - 0.05]} color={Theme.red} />
              <Plot.OfX y={(x) => Math.tan(x)} domain={[-0.5 * Math.PI + 0.05, 0.5 * Math.PI - 0.05]} color={Theme.red} />
              <Plot.OfX y={(x) => Math.tan(x)} domain={[0.5 * Math.PI + 0.05, 1.5 * Math.PI - 0.05]} color={Theme.red} />
              <Plot.OfX y={(x) => Math.tan(x)} domain={[1.5 * Math.PI + 0.05, 2 * Math.PI]} color={Theme.red} />
              <Plot.OfX y={(x) => 2 * Math.sin(x)} color={Theme.violet} />

              <Line.ThroughPoints point1={[-1.5 * Math.PI, -3]} point2={[-1.5 * Math.PI, 3]} color={graphColors.asymptote} style="dashed" opacity={0.9} />
              <Line.ThroughPoints point1={[-0.5 * Math.PI, -3]} point2={[-0.5 * Math.PI, 3]} color={graphColors.asymptote} style="dashed" opacity={0.9} />
              <Line.ThroughPoints point1={[0.5 * Math.PI, -3]} point2={[0.5 * Math.PI, 3]} color={graphColors.asymptote} style="dashed" opacity={0.9} />
              <Line.ThroughPoints point1={[1.5 * Math.PI, -3]} point2={[1.5 * Math.PI, 3]} color={graphColors.asymptote} style="dashed" opacity={0.9} />
            </Mafs>
          </div>
        </div>
      </div>

      <NoteSubSectionTitle id="algebra-review">1.11 Algebra Review</NoteSubSectionTitle>
      <NoteParagraph>
        While most of algebra is mostly common sense, there are a few concepts worth remembering before diving into calculus. 
      </NoteParagraph>
      <div className="space-y-5 mb-8">
        <div className={`border-l-2 pl-4 ${isDarkMode ? 'border-green-500/40' : 'border-slate-300'}`}>
          <h4 className={`font-mono font-bold mb-2 ${isDarkMode ? 'text-green-300' : 'text-slate-800'}`}>Factoring</h4>
          <NoteParagraph>
            Factoring rewrites an expression as a product. I've seen many ways factoring has been taught, but I find the fastest and most intuitive way
            is to just look at the coefficients for the first and last term see what combination of factors result in the middle terms. If this is not possible,
            then you can always use the <strong>quadratic formula</strong>. 
          </NoteParagraph>
          <MathBlock math="x^2 + 5x + 6 = (x + 2)(x + 3)" />
        </div>

        <div className={`border-l-2 pl-4 ${isDarkMode ? 'border-green-500/40' : 'border-slate-300'}`}>
          <h4 className={`font-mono font-bold mb-2 ${isDarkMode ? 'text-green-300' : 'text-slate-800'}`}>Expanding</h4>
          <NoteParagraph>
            In a similar sense, expanding rewrites a product as a sum. While this is fairly trivial, we will see later on that it is quite mathematically convenient to 
            expand before doing anything else. 
          </NoteParagraph>
          <MathBlock math="(x + h)^2 = x^2 + 2xh + h^2" />
        </div>

        <div className={`border-l-2 pl-4 ${isDarkMode ? 'border-green-500/40' : 'border-slate-300'}`}>
          <h4 className={`font-mono font-bold mb-2 ${isDarkMode ? 'text-green-300' : 'text-slate-800'}`}>Rationalizing</h4>
          <NoteParagraph>
            Rationalizing uses a <strong>conjugate</strong> to remove a square root expression from a difference. We find it useful to rationalize to simplify the 
            expression and for mathematical convenience.
          </NoteParagraph>
          <MathBlock math="\frac{\sqrt{x} - 2}{1} \cdot \frac{\sqrt{x} + 2}{\sqrt{x} + 2} = \frac{x - 4}{\sqrt{x} + 2}" />
          <NoteParagraph className="mb-0">
            Used in limits when direct substitution creates an indeterminate form like <InlineMath math="0/0" />.
          </NoteParagraph>
        </div>

        <div className={`border-l-2 pl-4 ${isDarkMode ? 'border-green-500/40' : 'border-slate-300'}`}>
          <h4 className={`font-mono font-bold mb-2 ${isDarkMode ? 'text-green-300' : 'text-slate-800'}`}>Exponent Rules</h4>
          <NoteParagraph>
            Exponents come with their own little set of rules that allow us to modify and simplify expressions. 
          </NoteParagraph>
          <MathBlock math="x^a x^b = x^{a+b} \qquad \frac{x^a}{x^b} = x^{a-b} \qquad (x^a)^b = x^{ab}" />
        </div>

        <div className={`border-l-2 pl-4 ${isDarkMode ? 'border-green-500/40' : 'border-slate-300'}`}>
          <h4 className={`font-mono font-bold mb-2 ${isDarkMode ? 'text-green-300' : 'text-slate-800'}`}>Fraction Rules</h4>
          <NoteParagraph>
            Similarly, fractions also come with their own set of handy rules. 
          </NoteParagraph>
          <MathBlock math="\frac{a}{b} + \frac{c}{d} = \frac{ad + bc}{bd} \qquad \frac{\frac{a}{b}}{\frac{c}{d}} = \frac{ad}{bc}" />
        </div>
      </div>

      <NoteSubSectionTitle id="trig-identities">1.12 Trig Identities</NoteSubSectionTitle>
      <NoteParagraph>
        Trig identities also constantly come up and are worth remembering the most common ones. 
      </NoteParagraph>
      <div className="space-y-5 mb-8">
        <div className={`border-l-2 pl-4 ${isDarkMode ? 'border-green-500/40' : 'border-slate-300'}`}>
          <h4 className={`font-mono font-bold mb-2 ${isDarkMode ? 'text-green-300' : 'text-slate-800'}`}>Pythagorean Identities</h4>
          <MathBlock math="\sin^2(x) + \cos^2(x) = 1" />
          <MathBlock math="1 + \tan^2(x) = \sec^2(x) \qquad 1 + \cot^2(x) = \csc^2(x)" />
        </div>

        <div className={`border-l-2 pl-4 ${isDarkMode ? 'border-green-500/40' : 'border-slate-300'}`}>
          <h4 className={`font-mono font-bold mb-2 ${isDarkMode ? 'text-green-300' : 'text-slate-800'}`}>Quotient and Reciprocal Identities</h4>
          <MathBlock math="\tan(x) = \frac{\sin(x)}{\cos(x)} \qquad \cot(x) = \frac{\cos(x)}{\sin(x)}" />
          <MathBlock math="\sec(x) = \frac{1}{\cos(x)} \qquad \csc(x) = \frac{1}{\sin(x)} \qquad \cot(x) = \frac{1}{\tan(x)}" />
        </div>

        <div className={`border-l-2 pl-4 ${isDarkMode ? 'border-green-500/40' : 'border-slate-300'}`}>
          <h4 className={`font-mono font-bold mb-2 ${isDarkMode ? 'text-green-300' : 'text-slate-800'}`}>Even and Odd Identities</h4>
          <MathBlock math="\sin(-x) = -\sin(x) \qquad \cos(-x) = \cos(x) \qquad \tan(-x) = -\tan(x)" />
        </div>

        <div className={`border-l-2 pl-4 ${isDarkMode ? 'border-green-500/40' : 'border-slate-300'}`}>
          <h4 className={`font-mono font-bold mb-2 ${isDarkMode ? 'text-green-300' : 'text-slate-800'}`}>Double-Angle Identities</h4>
          <MathBlock math="\sin(2x) = 2\sin(x)\cos(x)" />
          <MathBlock math="\cos(2x) = \cos^2(x) - \sin^2(x)" />
        </div>

        <div className={`border-l-2 pl-4 ${isDarkMode ? 'border-green-500/40' : 'border-slate-300'}`}>
          <h4 className={`font-mono font-bold mb-2 ${isDarkMode ? 'text-green-300' : 'text-slate-800'}`}>Power-Reduction Identities</h4>
          <MathBlock math="\sin^2(x) = \frac{1 - \cos(2x)}{2} \qquad \cos^2(x) = \frac{1 + \cos(2x)}{2}" />
        </div>
      </div>

      {/* 2. LIMITS SECTION */}
      <NoteSectionTitle id="limits">2. Limits</NoteSectionTitle>
      <NoteParagraph>Content for 2. Limits goes here.</NoteParagraph>

      <NoteSubSectionTitle id="intuitive-limits">2.1 Intuitive Limits</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Intuitive Limits.
      </NoteParagraph>

      <NoteSubSectionTitle id="one-sided-limits">2.2 One-Sided Limits</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on One-Sided Limits.
      </NoteParagraph>

      <NoteSubSectionTitle id="infinite-limits">2.3 Infinite Limits</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Infinite Limits.
      </NoteParagraph>

      <NoteSubSectionTitle id="limits-at-infinity">2.4 Limits at Infinity</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Limits at Infinity.
      </NoteParagraph>

      <NoteSubSectionTitle id="continuity">2.5 Continuity</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Continuity.
      </NoteParagraph>

      <NoteSubSectionTitle id="discontinuities">2.6 Discontinuities</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Discontinuities.
      </NoteParagraph>

      <NoteSubSectionTitle id="intermediate-value-theorem">2.7 Intermediate Value Theorem</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Intermediate Value Theorem.
      </NoteParagraph>

      <NoteSubSectionTitle id="epsilon-delta-definition">2.8 Epsilon-Delta Definition</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Epsilon-Delta Definition.
      </NoteParagraph>

      {/* 3. DERIVATIVES SECTION */}
      <NoteSectionTitle id="derivatives">3. Derivatives</NoteSectionTitle>
      <NoteParagraph>Content for 3. Derivatives goes here.</NoteParagraph>

      <NoteSubSectionTitle id="derivative-definition">3.1 Derivative Definition</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Derivative Definition.
      </NoteParagraph>

      <NoteSubSectionTitle id="tangent-lines">3.2 Tangent Lines</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Tangent Lines.
      </NoteParagraph>

      <NoteSubSectionTitle id="rates-of-change">3.3 Rates of Change</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Rates of Change.
      </NoteParagraph>

      <NoteSubSectionTitle id="power-rule">3.4 Power Rule</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Power Rule.
      </NoteParagraph>

      <NoteSubSectionTitle id="product-rule">3.5 Product Rule</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Product Rule.
      </NoteParagraph>

      <NoteSubSectionTitle id="quotient-rule">3.6 Quotient Rule</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Quotient Rule.
      </NoteParagraph>

      <NoteSubSectionTitle id="chain-rule">3.7 Chain Rule</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Chain Rule.
      </NoteParagraph>

      <NoteSubSectionTitle id="trig-derivatives">3.8 Trig Derivatives</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Trig Derivatives.
      </NoteParagraph>

      <NoteSubSectionTitle id="exponential-derivatives">3.9 Exponential Derivatives</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Exponential Derivatives.
      </NoteParagraph>

      <NoteSubSectionTitle id="logarithmic-derivatives">3.10 Logarithmic Derivatives</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Logarithmic Derivatives.
      </NoteParagraph>

      <NoteSubSectionTitle id="implicit-differentiation">3.11 Implicit Differentiation</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Implicit Differentiation.
      </NoteParagraph>

      <NoteSubSectionTitle id="inverse-function-derivatives">3.12 Inverse Function Derivatives</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Inverse Function Derivatives.
      </NoteParagraph>

      <NoteSubSectionTitle id="higher-order-derivatives">3.13 Higher-Order Derivatives</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Higher-Order Derivatives.
      </NoteParagraph>

      {/* 4. DERIVATIVE APPLICATIONS SECTION */}
      <NoteSectionTitle id="derivative-applications">4. Derivative Applications</NoteSectionTitle>
      <NoteParagraph>Content for 4. Derivative Applications goes here.</NoteParagraph>

      <NoteSubSectionTitle id="linear-approximation">4.1 Linear Approximation</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Linear Approximation.
      </NoteParagraph>

      <NoteSubSectionTitle id="related-rates">4.2 Related Rates</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Related Rates.
      </NoteParagraph>

      <NoteSubSectionTitle id="optimization">4.3 Optimization</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Optimization.
      </NoteParagraph>

      <NoteSubSectionTitle id="motion-problems">4.4 Motion Problems</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Motion Problems.
      </NoteParagraph>

      <NoteSubSectionTitle id="increasing-and-decreasing-functions">4.5 Increasing and Decreasing Functions</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Increasing and Decreasing Functions.
      </NoteParagraph>

      <NoteSubSectionTitle id="concavity">4.6 Concavity</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Concavity.
      </NoteParagraph>

      <NoteSubSectionTitle id="inflection-points">4.7 Inflection Points</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Inflection Points.
      </NoteParagraph>

      <NoteSubSectionTitle id="mean-value-theorem">4.8 Mean Value Theorem</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Mean Value Theorem.
      </NoteParagraph>

      <NoteSubSectionTitle id="l-h-pital-s-rule">4.9 L’Hôpital’s Rule</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on L’Hôpital’s Rule.
      </NoteParagraph>

      <NoteSubSectionTitle id="curve-sketching">4.10 Curve Sketching</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Curve Sketching.
      </NoteParagraph>

      {/* 5. INTEGRALS SECTION */}
      <NoteSectionTitle id="integrals">5. Integrals</NoteSectionTitle>
      <NoteParagraph>Content for 5. Integrals goes here.</NoteParagraph>

      <NoteSubSectionTitle id="antiderivatives">5.1 Antiderivatives</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Antiderivatives.
      </NoteParagraph>

      <NoteSubSectionTitle id="riemann-sums">5.2 Riemann Sums</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Riemann Sums.
      </NoteParagraph>

      <NoteSubSectionTitle id="definite-integrals">5.3 Definite Integrals</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Definite Integrals.
      </NoteParagraph>

      <NoteSubSectionTitle id="indefinite-integrals">5.4 Indefinite Integrals</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Indefinite Integrals.
      </NoteParagraph>

      <NoteSubSectionTitle id="accumulation-functions">5.5 Accumulation Functions</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Accumulation Functions.
      </NoteParagraph>

      <NoteSubSectionTitle id="fundamental-theorem-of-calculus">5.6 Fundamental Theorem of Calculus</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Fundamental Theorem of Calculus.
      </NoteParagraph>

      <NoteSubSectionTitle id="basic-substitution">5.7 Basic Substitution</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Basic Substitution.
      </NoteParagraph>

      {/* 6. INTEGRATION TECHNIQUES SECTION */}
      <NoteSectionTitle id="integration-techniques">6. Integration Techniques</NoteSectionTitle>
      <NoteParagraph>Content for 6. Integration Techniques goes here.</NoteParagraph>

      <NoteSubSectionTitle id="u-substitution">6.1 u-Substitution</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on u-Substitution.
      </NoteParagraph>

      <NoteSubSectionTitle id="integration-by-parts">6.2 Integration by Parts</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Integration by Parts.
      </NoteParagraph>

      <NoteSubSectionTitle id="trig-integrals">6.3 Trig Integrals</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Trig Integrals.
      </NoteParagraph>

      <NoteSubSectionTitle id="trig-substitution">6.4 Trig Substitution</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Trig Substitution.
      </NoteParagraph>

      <NoteSubSectionTitle id="partial-fractions">6.5 Partial Fractions</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Partial Fractions.
      </NoteParagraph>

      <NoteSubSectionTitle id="improper-integrals">6.6 Improper Integrals</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Improper Integrals.
      </NoteParagraph>

      <NoteSubSectionTitle id="numerical-integration">6.7 Numerical Integration</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Numerical Integration.
      </NoteParagraph>

      {/* 7. INTEGRAL APPLICATIONS SECTION */}
      <NoteSectionTitle id="integral-applications">7. Integral Applications</NoteSectionTitle>
      <NoteParagraph>Content for 7. Integral Applications goes here.</NoteParagraph>

      <NoteSubSectionTitle id="area-under-a-curve">7.1 Area Under a Curve</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Area Under a Curve.
      </NoteParagraph>

      <NoteSubSectionTitle id="area-between-curves">7.2 Area Between Curves</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Area Between Curves.
      </NoteParagraph>

      <NoteSubSectionTitle id="average-value">7.3 Average Value</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Average Value.
      </NoteParagraph>

      <NoteSubSectionTitle id="volumes-by-slicing">7.4 Volumes by Slicing</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Volumes by Slicing.
      </NoteParagraph>

      <NoteSubSectionTitle id="disk-method">7.5 Disk Method</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Disk Method.
      </NoteParagraph>

      <NoteSubSectionTitle id="washer-method">7.6 Washer Method</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Washer Method.
      </NoteParagraph>

      <NoteSubSectionTitle id="shell-method">7.7 Shell Method</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Shell Method.
      </NoteParagraph>

      <NoteSubSectionTitle id="arc-length">7.8 Arc Length</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Arc Length.
      </NoteParagraph>

      <NoteSubSectionTitle id="surface-area">7.9 Surface Area</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Surface Area.
      </NoteParagraph>

      <NoteSubSectionTitle id="work">7.10 Work</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Work.
      </NoteParagraph>

      <NoteSubSectionTitle id="motion-with-integrals">7.11 Motion with Integrals</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Motion with Integrals.
      </NoteParagraph>

      {/* 8. DIFFERENTIAL EQUATIONS SECTION */}
      <NoteSectionTitle id="differential-equations">8. Differential Equations</NoteSectionTitle>
      <NoteParagraph>Content for 8. Differential Equations goes here.</NoteParagraph>

      <NoteSubSectionTitle id="differential-equation-basics">8.1 Differential Equation Basics</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Differential Equation Basics.
      </NoteParagraph>

      <NoteSubSectionTitle id="verifying-solutions">8.2 Verifying Solutions</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Verifying Solutions.
      </NoteParagraph>

      <NoteSubSectionTitle id="slope-fields">8.3 Slope Fields</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Slope Fields.
      </NoteParagraph>

      <NoteSubSectionTitle id="separable-equations">8.4 Separable Equations</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Separable Equations.
      </NoteParagraph>

      <NoteSubSectionTitle id="exponential-growth-and-decay">8.5 Exponential Growth and Decay</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Exponential Growth and Decay.
      </NoteParagraph>

      <NoteSubSectionTitle id="logistic-growth">8.6 Logistic Growth</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Logistic Growth.
      </NoteParagraph>

      <NoteSubSectionTitle id="first-order-equations">8.7 First-Order Equations</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on First-Order Equations.
      </NoteParagraph>

      <NoteSubSectionTitle id="second-order-linear-equations">8.8 Second-Order Linear Equations</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Second-Order Linear Equations.
      </NoteParagraph>

      <NoteSubSectionTitle id="characteristic-equations">8.9 Characteristic Equations</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Characteristic Equations.
      </NoteParagraph>

      <NoteSubSectionTitle id="laplace-transforms">8.10 Laplace Transforms</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Laplace Transforms.
      </NoteParagraph>

      {/* 9. PARAMETRIC EQUATIONS SECTION */}
      <NoteSectionTitle id="parametric-equations">9. Parametric Equations</NoteSectionTitle>
      <NoteParagraph>Content for 9. Parametric Equations goes here.</NoteParagraph>

      <NoteSubSectionTitle id="parametric-curves">9.1 Parametric Curves</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Parametric Curves.
      </NoteParagraph>

      <NoteSubSectionTitle id="eliminating-the-parameter">9.2 Eliminating the Parameter</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Eliminating the Parameter.
      </NoteParagraph>

      <NoteSubSectionTitle id="parametric-derivatives">9.3 Parametric Derivatives</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Parametric Derivatives.
      </NoteParagraph>

      <NoteSubSectionTitle id="tangent-lines-1">9.4 Tangent Lines</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Tangent Lines.
      </NoteParagraph>

      <NoteSubSectionTitle id="parametric-arc-length">9.5 Parametric Arc Length</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Parametric Arc Length.
      </NoteParagraph>

      <NoteSubSectionTitle id="motion-with-parametric-equations">9.6 Motion with Parametric Equations</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Motion with Parametric Equations.
      </NoteParagraph>

      {/* 10. POLAR COORDINATES SECTION */}
      <NoteSectionTitle id="polar-coordinates">10. Polar Coordinates</NoteSectionTitle>
      <NoteParagraph>Content for 10. Polar Coordinates goes here.</NoteParagraph>

      <NoteSubSectionTitle id="polar-coordinates-1">10.1 Polar Coordinates</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Polar Coordinates.
      </NoteParagraph>

      <NoteSubSectionTitle id="converting-between-polar-and-cartesian">10.2 Converting Between Polar and Cartesian</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Converting Between Polar and Cartesian.
      </NoteParagraph>

      <NoteSubSectionTitle id="polar-graphs">10.3 Polar Graphs</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Polar Graphs.
      </NoteParagraph>

      <NoteSubSectionTitle id="polar-derivatives">10.4 Polar Derivatives</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Polar Derivatives.
      </NoteParagraph>

      <NoteSubSectionTitle id="area-in-polar-coordinates">10.5 Area in Polar Coordinates</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Area in Polar Coordinates.
      </NoteParagraph>

      <NoteSubSectionTitle id="arc-length-in-polar-coordinates">10.6 Arc Length in Polar Coordinates</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Arc Length in Polar Coordinates.
      </NoteParagraph>

      {/* 11. VECTOR-VALUED FUNCTIONS SECTION */}
      <NoteSectionTitle id="vector-valued-functions">11. Vector-Valued Functions</NoteSectionTitle>
      <NoteParagraph>Content for 11. Vector-Valued Functions goes here.</NoteParagraph>

      <NoteSubSectionTitle id="vector-valued-functions-1">11.1 Vector-Valued Functions</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Vector-Valued Functions.
      </NoteParagraph>

      <NoteSubSectionTitle id="position-velocity-and-acceleration">11.2 Position, Velocity, and Acceleration</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Position, Velocity, and Acceleration.
      </NoteParagraph>

      <NoteSubSectionTitle id="unit-tangent-vector">11.3 Unit Tangent Vector</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Unit Tangent Vector.
      </NoteParagraph>

      <NoteSubSectionTitle id="unit-normal-vector">11.4 Unit Normal Vector</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Unit Normal Vector.
      </NoteParagraph>

      <NoteSubSectionTitle id="curvature">11.5 Curvature</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Curvature.
      </NoteParagraph>

      <NoteSubSectionTitle id="motion-in-the-plane">11.6 Motion in the Plane</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Motion in the Plane.
      </NoteParagraph>

      <NoteSubSectionTitle id="arc-length-for-vector-functions">11.7 Arc Length for Vector Functions</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Arc Length for Vector Functions.
      </NoteParagraph>

      {/* 12. SERIES SECTION */}
      <NoteSectionTitle id="series">12. Series</NoteSectionTitle>
      <NoteParagraph>Content for 12. Series goes here.</NoteParagraph>

      <NoteSubSectionTitle id="sequences">12.1 Sequences</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Sequences.
      </NoteParagraph>

      <NoteSubSectionTitle id="infinite-series">12.2 Infinite Series</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Infinite Series.
      </NoteParagraph>

      <NoteSubSectionTitle id="geometric-series">12.3 Geometric Series</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Geometric Series.
      </NoteParagraph>

      <NoteSubSectionTitle id="nth-term-test">12.4 nth-Term Test</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on nth-Term Test.
      </NoteParagraph>

      <NoteSubSectionTitle id="p-series">12.5 p-Series</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on p-Series.
      </NoteParagraph>

      <NoteSubSectionTitle id="integral-test">12.6 Integral Test</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Integral Test.
      </NoteParagraph>

      <NoteSubSectionTitle id="comparison-test">12.7 Comparison Test</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Comparison Test.
      </NoteParagraph>

      <NoteSubSectionTitle id="limit-comparison-test">12.8 Limit Comparison Test</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Limit Comparison Test.
      </NoteParagraph>

      <NoteSubSectionTitle id="alternating-series-test">12.9 Alternating Series Test</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Alternating Series Test.
      </NoteParagraph>

      <NoteSubSectionTitle id="ratio-test">12.10 Ratio Test</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Ratio Test.
      </NoteParagraph>

      <NoteSubSectionTitle id="root-test">12.11 Root Test</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Root Test.
      </NoteParagraph>

      <NoteSubSectionTitle id="power-series">12.12 Power Series</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Power Series.
      </NoteParagraph>

      <NoteSubSectionTitle id="taylor-series">12.13 Taylor Series</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Taylor Series.
      </NoteParagraph>

      <NoteSubSectionTitle id="maclaurin-series">12.14 Maclaurin Series</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Maclaurin Series.
      </NoteParagraph>

      {/* 13. MULTIVARIABLE BASICS SECTION */}
      <NoteSectionTitle id="multivariable-basics">13. Multivariable Basics</NoteSectionTitle>
      <NoteParagraph>Content for 13. Multivariable Basics goes here.</NoteParagraph>

      <NoteSubSectionTitle id="vectors">13.1 Vectors</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Vectors.
      </NoteParagraph>

      <NoteSubSectionTitle id="3d-coordinates">13.2 3D Coordinates</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on 3D Coordinates.
      </NoteParagraph>

      <NoteSubSectionTitle id="dot-product">13.3 Dot Product</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Dot Product.
      </NoteParagraph>

      <NoteSubSectionTitle id="cross-product">13.4 Cross Product</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Cross Product.
      </NoteParagraph>

      <NoteSubSectionTitle id="lines-and-planes">13.5 Lines and Planes</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Lines and Planes.
      </NoteParagraph>

      <NoteSubSectionTitle id="multivariable-functions">13.6 Multivariable Functions</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Multivariable Functions.
      </NoteParagraph>

      <NoteSubSectionTitle id="level-curves">13.7 Level Curves</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Level Curves.
      </NoteParagraph>

      <NoteSubSectionTitle id="level-surfaces">13.8 Level Surfaces</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Level Surfaces.
      </NoteParagraph>

      <NoteSubSectionTitle id="vector-fields">13.9 Vector Fields</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Vector Fields.
      </NoteParagraph>

      {/* 14. MULTIVARIABLE DERIVATIVES SECTION */}
      <NoteSectionTitle id="multivariable-derivatives">14. Multivariable Derivatives</NoteSectionTitle>
      <NoteParagraph>Content for 14. Multivariable Derivatives goes here.</NoteParagraph>

      <NoteSubSectionTitle id="partial-derivatives">14.1 Partial Derivatives</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Partial Derivatives.
      </NoteParagraph>

      <NoteSubSectionTitle id="higher-order-partial-derivatives">14.2 Higher-Order Partial Derivatives</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Higher-Order Partial Derivatives.
      </NoteParagraph>

      <NoteSubSectionTitle id="gradient">14.3 Gradient</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Gradient.
      </NoteParagraph>

      <NoteSubSectionTitle id="directional-derivatives">14.4 Directional Derivatives</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Directional Derivatives.
      </NoteParagraph>

      <NoteSubSectionTitle id="tangent-planes">14.5 Tangent Planes</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Tangent Planes.
      </NoteParagraph>

      <NoteSubSectionTitle id="linear-approximation-1">14.6 Linear Approximation</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Linear Approximation.
      </NoteParagraph>

      <NoteSubSectionTitle id="chain-rule-1">14.7 Chain Rule</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Chain Rule.
      </NoteParagraph>

      <NoteSubSectionTitle id="jacobian">14.8 Jacobian</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Jacobian.
      </NoteParagraph>

      {/* 15. MULTIVARIABLE DERIVATIVE APPLICATIONS SECTION */}
      <NoteSectionTitle id="multivariable-derivative-applications">15. Multivariable Derivative Applications</NoteSectionTitle>
      <NoteParagraph>Content for 15. Multivariable Derivative Applications goes here.</NoteParagraph>

      <NoteSubSectionTitle id="critical-points">15.1 Critical Points</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Critical Points.
      </NoteParagraph>

      <NoteSubSectionTitle id="local-maxima-and-minima">15.2 Local Maxima and Minima</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Local Maxima and Minima.
      </NoteParagraph>

      <NoteSubSectionTitle id="saddle-points">15.3 Saddle Points</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Saddle Points.
      </NoteParagraph>

      <NoteSubSectionTitle id="second-derivative-test">15.4 Second Derivative Test</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Second Derivative Test.
      </NoteParagraph>

      <NoteSubSectionTitle id="constrained-optimization">15.5 Constrained Optimization</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Constrained Optimization.
      </NoteParagraph>

      <NoteSubSectionTitle id="lagrange-multipliers">15.6 Lagrange Multipliers</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Lagrange Multipliers.
      </NoteParagraph>

      {/* 16. MULTIVARIABLE INTEGRALS SECTION */}
      <NoteSectionTitle id="multivariable-integrals">16. Multivariable Integrals</NoteSectionTitle>
      <NoteParagraph>Content for 16. Multivariable Integrals goes here.</NoteParagraph>

      <NoteSubSectionTitle id="double-integrals">16.1 Double Integrals</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Double Integrals.
      </NoteParagraph>

      <NoteSubSectionTitle id="triple-integrals">16.2 Triple Integrals</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Triple Integrals.
      </NoteParagraph>

      <NoteSubSectionTitle id="iterated-integrals">16.3 Iterated Integrals</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Iterated Integrals.
      </NoteParagraph>

      <NoteSubSectionTitle id="region-setup">16.4 Region Setup</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Region Setup.
      </NoteParagraph>

      <NoteSubSectionTitle id="change-of-variables">16.5 Change of Variables</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Change of Variables.
      </NoteParagraph>

      <NoteSubSectionTitle id="jacobian-determinant">16.6 Jacobian Determinant</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Jacobian Determinant.
      </NoteParagraph>

      <NoteSubSectionTitle id="polar-coordinates-in-double-integrals">16.7 Polar Coordinates in Double Integrals</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Polar Coordinates in Double Integrals.
      </NoteParagraph>

      <NoteSubSectionTitle id="cylindrical-coordinates">16.8 Cylindrical Coordinates</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Cylindrical Coordinates.
      </NoteParagraph>

      <NoteSubSectionTitle id="spherical-coordinates">16.9 Spherical Coordinates</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Spherical Coordinates.
      </NoteParagraph>

      <NoteSubSectionTitle id="line-integrals">16.10 Line Integrals</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Line Integrals.
      </NoteParagraph>

      <NoteSubSectionTitle id="surface-integrals">16.11 Surface Integrals</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Surface Integrals.
      </NoteParagraph>

      {/* 17. VECTOR CALCULUS THEOREMS SECTION */}
      <NoteSectionTitle id="vector-calculus-theorems">17. Vector Calculus Theorems</NoteSectionTitle>
      <NoteParagraph>Content for 17. Vector Calculus Theorems goes here.</NoteParagraph>

      <NoteSubSectionTitle id="conservative-vector-fields">17.1 Conservative Vector Fields</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Conservative Vector Fields.
      </NoteParagraph>

      <NoteSubSectionTitle id="fundamental-theorem-for-line-integrals">17.2 Fundamental Theorem for Line Integrals</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Fundamental Theorem for Line Integrals.
      </NoteParagraph>

      <NoteSubSectionTitle id="green-s-theorem">17.3 Green’s Theorem</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Green’s Theorem.
      </NoteParagraph>

      <NoteSubSectionTitle id="curl">17.4 Curl</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Curl.
      </NoteParagraph>

      <NoteSubSectionTitle id="divergence">17.5 Divergence</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Divergence.
      </NoteParagraph>

      <NoteSubSectionTitle id="flux">17.6 Flux</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Flux.
      </NoteParagraph>

      <NoteSubSectionTitle id="stokes-theorem">17.7 Stokes’ Theorem</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Stokes’ Theorem.
      </NoteParagraph>

      <NoteSubSectionTitle id="divergence-theorem">17.8 Divergence Theorem</NoteSubSectionTitle>
      <NoteParagraph>
        Notes on Divergence Theorem.
      </NoteParagraph>

    </NotesLayout>
  );
}
