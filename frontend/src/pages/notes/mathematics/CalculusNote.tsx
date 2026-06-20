/**
 * Calculus Notes Page
 * A comprehensive overview of calculus topics
 * Demonstrates the use of NoteTypography, MathBlock, DiagramBlock, and Mafs graph components
 */

import { useState, type CSSProperties } from 'react';
import { NotesLayout } from '../../../components/notes/NotesLayout';
import { MathBlock, InlineMath, NoteHeader, NoteSectionTitle, NoteSubSectionTitle, NoteParagraph, NoteTopicGroup, NoteTopicBlock, DiagramBlock, InteractiveBlock, CodeBlock } from '../../../components/notes';
import { Mafs, Coordinates, Plot, Theme, Line, Circle, Polygon, Point, Vector } from 'mafs';
import 'mafs/core.css';
import 'mafs/font.css';
import { useDarkMode } from '../../../hooks/useDarkMode';
import { getRunnerPlayLabel, toggleOrReplayRunner, useAutoRunner } from '../../../components/notes/useAutoRunner';

const formatCalcNumber = (value: number, digits = 3) => {
  const rounded = Number(value.toFixed(digits));
  return Number.isInteger(rounded) ? String(rounded) : String(rounded).replace(/0+$/, '').replace(/\.$/, '');
};

const newtonMethodCode = `
def newton(f, df, x0, tol=1e-8, max_iter=12):
    x = x0
    for k in range(max_iter):
        fx = f(x)
        slope = df(x)
        if abs(slope) < 1e-12:
            raise ZeroDivisionError("flat tangent")
        x_next = x - fx / slope
        yield k, x, fx, x_next
        if abs(f(x_next)) < tol or abs(x_next - x) < tol:
            break
        x = x_next
`;

const gradientDescentCode = `
def fit_line_with_gradient_descent(points, eta=0.04, tol=1e-3, max_iter=90):
    m, b = -1.0, 3.0
    n = len(points)
    for k in range(max_iter):
        errors = [(m * x + b) - y for x, y in points]
        loss = sum(e * e for e in errors) / n
        grad_m = 2 * sum(e * x for e, (x, y) in zip(errors, points)) / n
        grad_b = 2 * sum(errors) / n
        yield k, m, b, loss, grad_m, grad_b
        if (grad_m * grad_m + grad_b * grad_b) ** 0.5 < tol:
            break
        m -= eta * grad_m
        b -= eta * grad_b
`;

function NewtonMethodRunner() {
  const { isDarkMode } = useDarkMode();
  const [start, setStart] = useState(3.2);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const f = (x: number) => x ** 3 - 2 * x - 5;
  const derivative = (x: number) => 3 * x * x - 2;
  const steps = (() => {
    const result: { x: number; y: number; nextX: number; residual: number; delta: number }[] = [];
    let x = start;
    for (let index = 0; index < 12; index += 1) {
      const y = f(x);
      const nextX = x - y / derivative(x);
      result.push({ x, y, nextX, residual: Math.abs(f(nextX)), delta: Math.abs(nextX - x) });
      if (Math.abs(f(nextX)) < 1e-8 || Math.abs(nextX - x) < 1e-8) break;
      x = nextX;
    }
    return result;
  })();
  const boundedStep = Math.min(stepIndex, steps.length - 1);
  const current = steps[boundedStep];
  const converged = current.residual < 1e-6 || current.delta < 1e-6;
  const atEnd = boundedStep === steps.length - 1 || converged;
  const xMin = 1;
  const xMax = 3.6;
  const yMin = -8;
  const yMax = 32;
  const width = 440;
  const height = 260;
  const left = 44;
  const top = 18;
  const plotWidth = 360;
  const plotHeight = 202;
  const xCoord = (x: number) => left + ((x - xMin) / (xMax - xMin)) * plotWidth;
  const yCoord = (y: number) => top + plotHeight - ((y - yMin) / (yMax - yMin)) * plotHeight;
  const curvePoints = Array.from({ length: 140 }, (_, index) => {
    const x = xMin + ((xMax - xMin) * index) / 139;
    return `${xCoord(x)},${yCoord(f(x))}`;
  }).join(' ');
  const tangentStartX = Math.max(xMin, current.x - 1.25);
  const tangentEndX = Math.min(xMax, current.x + 1.25);
  const tangentY = (x: number) => current.y + derivative(current.x) * (x - current.x);
  const axisColor = isDarkMode ? '#86efac66' : '#94a3b8';
  const textColor = isDarkMode ? '#bbf7d0' : '#334155';
  const primaryColor = isDarkMode ? '#4ade80' : '#2563eb';
  const secondaryColor = isDarkMode ? '#fb923c' : '#ea580c';
  const labelFill = isDarkMode ? '#052e16' : '#ffffff';
  const subtlePanelClass = isDarkMode
    ? 'bg-green-500/5 border-green-500/20 text-green-100'
    : 'bg-slate-50 border-slate-200 text-slate-700';
  const buttonClass = isDarkMode
    ? 'rounded-md border border-green-500/30 bg-black/30 px-3 py-2 text-sm font-bold text-green-200 transition-colors hover:bg-green-500/10 disabled:cursor-not-allowed disabled:opacity-40'
    : 'rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40';

  useAutoRunner({
    playing,
    canAdvance: !atEnd,
    delay: 700,
    onAdvance: () => setStepIndex((step) => Math.min(steps.length - 1, step + 1)),
    onStop: () => setPlaying(false),
  });

  return (
    <InteractiveBlock title="Newton's Method Runner">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(250px,310px)_minmax(0,1fr)]">
        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 flex justify-between gap-3 text-sm font-bold" htmlFor="newton-start">
            <span>Start x0</span>
            <span>{formatCalcNumber(start, 1)}</span>
          </label>
          <input
            id="newton-start"
            type="range"
            min="1.4"
            max="3.4"
            step="0.1"
            value={start}
            onChange={(event) => {
              setPlaying(false);
              setStart(Number(event.target.value));
              setStepIndex(0);
            }}
            className="w-full"
          />
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className={buttonClass} onClick={() => toggleOrReplayRunner(atEnd, setPlaying, () => setStepIndex(0))}>
              {getRunnerPlayLabel(playing, atEnd)}
            </button>
            <button type="button" className={buttonClass} onClick={() => { setPlaying(false); setStepIndex(0); }} disabled={boundedStep === 0}>
              Reset
            </button>
            <button type="button" className={buttonClass} onClick={() => { setPlaying(false); setStepIndex((step) => Math.max(0, step - 1)); }} disabled={boundedStep === 0}>
              Back
            </button>
            <button
              type="button"
              className={buttonClass}
              onClick={() => { setPlaying(false); setStepIndex((step) => Math.min(steps.length - 1, step + 1)); }}
              disabled={atEnd}
            >
              Step
            </button>
          </div>
          <div className="mt-4 grid gap-2 text-sm">
            <div className={`rounded-md border p-3 ${isDarkMode ? 'border-green-500/20 bg-black/20' : 'border-slate-200 bg-white/75'}`}>
              <InlineMath math={`x_${boundedStep}=${formatCalcNumber(current.x)}`} />
            </div>
            <div className={`rounded-md border p-3 ${isDarkMode ? 'border-green-500/20 bg-black/20' : 'border-slate-200 bg-white/75'}`}>
              <InlineMath math={`x_${boundedStep + 1}=${formatCalcNumber(current.nextX)}`} />
            </div>
            <div className={`rounded-md border p-3 ${isDarkMode ? 'border-green-500/20 bg-black/20' : 'border-slate-200 bg-white/75'}`}>
              residual <InlineMath math="|f(x_{k+1})|" />: <strong>{formatCalcNumber(current.residual, 6)}</strong>
            </div>
          </div>
        </div>

        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <svg viewBox={`0 0 ${width} ${height}`} className="h-72 w-full" role="img" aria-label="Newton method tangent line steps for a cubic equation">
            <line x1={left} y1={yCoord(0)} x2={left + plotWidth} y2={yCoord(0)} stroke={axisColor} strokeWidth="2" />
            <line x1={left} y1={top} x2={left} y2={top + plotHeight} stroke={axisColor} strokeWidth="2" />
            <polyline points={curvePoints} fill="none" stroke={primaryColor} strokeWidth="3" />
            <line
              x1={xCoord(tangentStartX)}
              y1={yCoord(tangentY(tangentStartX))}
              x2={xCoord(tangentEndX)}
              y2={yCoord(tangentY(tangentEndX))}
              stroke={secondaryColor}
              strokeWidth="2.5"
              strokeDasharray="7 5"
            />
            <line x1={xCoord(current.x)} y1={yCoord(current.y)} x2={xCoord(current.x)} y2={yCoord(0)} stroke={secondaryColor} strokeWidth="1.5" strokeDasharray="4 4" />
            <circle cx={xCoord(current.x)} cy={yCoord(current.y)} r="5" fill={secondaryColor} />
            <circle cx={xCoord(current.nextX)} cy={yCoord(0)} r="5" fill={primaryColor} />
            <rect x={xCoord(current.nextX) - 26} y={yCoord(0) + 8} width="52" height="17" rx="4" fill={labelFill} fillOpacity="0.88" />
            <text x={xCoord(current.nextX)} y={yCoord(0) + 20} textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>next x</text>
          </svg>
          <MathBlock math={String.raw`f(x)=x^3-2x-5,\qquad x_{k+1}=x_k-\frac{f(x_k)}{f'(x_k)}`} />
        </div>
      </div>
      <CodeBlock language="python" code={newtonMethodCode} />
    </InteractiveBlock>
  );
}

function GradientDescentRunner() {
  const { isDarkMode } = useDarkMode();
  const [learningRate, setLearningRate] = useState(0.04);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const data: [number, number][] = [
    [-3, -4.4],
    [-2.4, -3.5],
    [-1.7, -2.1],
    [-1, -1.4],
    [-0.3, -0.4],
    [0.4, 0.8],
    [1.1, 1.6],
    [1.9, 3],
    [2.6, 4],
    [3.2, 5.1],
  ];
  const predict = (m: number, b: number, x: number) => m * x + b;
  const loss = (m: number, b: number) =>
    data.reduce((sum, [x, y]) => {
      const error = predict(m, b, x) - y;
      return sum + error * error;
    }, 0) / data.length;
  const gradient = (m: number, b: number): [number, number] => {
    const [gradM, gradB] = data.reduce(
      ([sumM, sumB], [x, y]) => {
        const error = predict(m, b, x) - y;
        return [sumM + error * x, sumB + error];
      },
      [0, 0],
    );
    return [(2 * gradM) / data.length, (2 * gradB) / data.length];
  };
  const trace = (() => {
    const result: { m: number; b: number; loss: number; gradM: number; gradB: number }[] = [];
    let m = -1;
    let b = 3;
    for (let index = 0; index < 90; index += 1) {
      const [gradM, gradB] = gradient(m, b);
      result.push({ m, b, loss: loss(m, b), gradM, gradB });
      if (Math.hypot(gradM, gradB) < 1e-3) break;
      m -= learningRate * gradM;
      b -= learningRate * gradB;
    }
    return result;
  })();
  const boundedStep = Math.min(stepIndex, trace.length - 1);
  const current = trace[boundedStep];
  const gradientNorm = Math.hypot(current.gradM, current.gradB);
  const converged = gradientNorm < 1e-3;
  const atEnd = boundedStep === trace.length - 1 || converged;
  const xMin = -3.4;
  const xMax = 3.4;
  const yMin = -5.7;
  const yMax = 6.6;
  const width = 460;
  const height = 300;
  const left = 44;
  const top = 18;
  const plotWidth = 372;
  const plotHeight = 238;
  const xCoord = (x: number) => left + ((x - xMin) / (xMax - xMin)) * plotWidth;
  const yCoord = (y: number) => top + plotHeight - ((y - yMin) / (yMax - yMin)) * plotHeight;
  const fittedLeft = predict(current.m, current.b, xMin);
  const fittedRight = predict(current.m, current.b, xMax);
  const lossChart = { width: 460, height: 110, left: 44, top: 12, plotWidth: 372, plotHeight: 68 };
  const visibleLosses = trace.slice(0, boundedStep + 1);
  const maxLoss = Math.max(...trace.map((state) => state.loss), 1);
  const minLoss = Math.min(...trace.map((state) => state.loss));
  const lossX = (index: number) => lossChart.left + (index / Math.max(1, trace.length - 1)) * lossChart.plotWidth;
  const lossY = (value: number) =>
    lossChart.top + lossChart.plotHeight - ((value - minLoss) / Math.max(1e-9, maxLoss - minLoss)) * lossChart.plotHeight;
  const lossPath = visibleLosses.map((state, index) => `${index === 0 ? 'M' : 'L'} ${lossX(index)} ${lossY(state.loss)}`).join(' ');
  const axisColor = isDarkMode ? '#86efac66' : '#94a3b8';
  const textColor = isDarkMode ? '#bbf7d0' : '#334155';
  const primaryColor = isDarkMode ? '#4ade80' : '#2563eb';
  const secondaryColor = isDarkMode ? '#fb923c' : '#ea580c';
  const subtlePanelClass = isDarkMode
    ? 'bg-green-500/5 border-green-500/20 text-green-100'
    : 'bg-slate-50 border-slate-200 text-slate-700';
  const buttonClass = isDarkMode
    ? 'rounded-md border border-green-500/30 bg-black/30 px-3 py-2 text-sm font-bold text-green-200 transition-colors hover:bg-green-500/10 disabled:cursor-not-allowed disabled:opacity-40'
    : 'rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40';

  useAutoRunner({
    playing,
    canAdvance: !atEnd,
    delay: 420,
    onAdvance: () => setStepIndex((step) => Math.min(trace.length - 1, step + 1)),
    onStop: () => setPlaying(false),
  });

  return (
    <InteractiveBlock title="Gradient Descent Line Fitting">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(250px,310px)_minmax(0,1fr)]">
        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 flex justify-between gap-3 text-sm font-bold" htmlFor="gd-rate">
            <span>Learning rate</span>
            <span>{formatCalcNumber(learningRate, 2)}</span>
          </label>
          <input
            id="gd-rate"
            type="range"
            min="0.01"
            max="0.10"
            step="0.01"
            value={learningRate}
            onChange={(event) => {
              setPlaying(false);
              setLearningRate(Number(event.target.value));
              setStepIndex(0);
            }}
            className="w-full"
          />
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className={buttonClass} onClick={() => toggleOrReplayRunner(atEnd, setPlaying, () => setStepIndex(0))}>
              {getRunnerPlayLabel(playing, atEnd)}
            </button>
            <button type="button" className={buttonClass} onClick={() => { setPlaying(false); setStepIndex(0); }} disabled={boundedStep === 0}>
              Reset
            </button>
            <button type="button" className={buttonClass} onClick={() => { setPlaying(false); setStepIndex((step) => Math.max(0, step - 1)); }} disabled={boundedStep === 0}>
              Back
            </button>
            <button
              type="button"
              className={buttonClass}
              onClick={() => { setPlaying(false); setStepIndex((step) => Math.min(trace.length - 1, step + 1)); }}
              disabled={atEnd}
            >
              Step
            </button>
          </div>
          <div className="mt-4 grid gap-2 text-sm">
            <div className={`rounded-md border p-3 ${isDarkMode ? 'border-green-500/20 bg-black/20' : 'border-slate-200 bg-white/75'}`}>
              iteration: <strong>{boundedStep}</strong> of <strong>{trace.length - 1}</strong>
            </div>
            <div className={`rounded-md border p-3 ${isDarkMode ? 'border-green-500/20 bg-black/20' : 'border-slate-200 bg-white/75'}`}>
              <InlineMath math={`\\hat y=${formatCalcNumber(current.m, 3)}x+${formatCalcNumber(current.b, 3)}`} />
            </div>
            <div className={`rounded-md border p-3 ${isDarkMode ? 'border-green-500/20 bg-black/20' : 'border-slate-200 bg-white/75'}`}>
              <InlineMath math={`\\|\\nabla f\\|=${formatCalcNumber(gradientNorm, 4)}`} />
            </div>
            <div className={`rounded-md border p-3 ${isDarkMode ? 'border-green-500/20 bg-black/20' : 'border-slate-200 bg-white/75'}`}>
              mean squared error: <strong>{formatCalcNumber(current.loss, 4)}</strong>
            </div>
          </div>
        </div>

        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <svg viewBox={`0 0 ${width} ${height}`} className="h-80 w-full" role="img" aria-label="Gradient descent fitting a line to data points">
            <line x1={left} y1={yCoord(0)} x2={left + plotWidth} y2={yCoord(0)} stroke={axisColor} strokeWidth="2" />
            <line x1={xCoord(0)} y1={top} x2={xCoord(0)} y2={top + plotHeight} stroke={axisColor} strokeWidth="2" />
            {data.map(([x, y]) => {
              const predicted = predict(current.m, current.b, x);
              return (
                <line
                  key={`residual-${x}-${y}`}
                  x1={xCoord(x)}
                  y1={yCoord(y)}
                  x2={xCoord(x)}
                  y2={yCoord(predicted)}
                  stroke={secondaryColor}
                  strokeWidth="1.6"
                  strokeDasharray="4 4"
                  opacity="0.7"
                />
              );
            })}
            <line x1={xCoord(xMin)} y1={yCoord(fittedLeft)} x2={xCoord(xMax)} y2={yCoord(fittedRight)} stroke={primaryColor} strokeWidth="3.5" strokeLinecap="round" />
            {data.map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={xCoord(x)} cy={yCoord(y)} r="5" fill={textColor} stroke={isDarkMode ? '#052e16' : '#ffffff'} strokeWidth="1.5" />
            ))}
            <text x={left + plotWidth - 4} y={top + plotHeight + 26} textAnchor="end" fontFamily="monospace" fontSize="12" fill={textColor}>feature x</text>
            <text x={left + 6} y={top + 16} fontFamily="monospace" fontSize="12" fill={textColor}>response y</text>
          </svg>
          <svg viewBox={`0 0 ${lossChart.width} ${lossChart.height}`} className="h-28 w-full" role="img" aria-label="Gradient descent loss history">
            <line x1={lossChart.left} y1={lossChart.top + lossChart.plotHeight} x2={lossChart.left + lossChart.plotWidth} y2={lossChart.top + lossChart.plotHeight} stroke={axisColor} strokeWidth="2" />
            <line x1={lossChart.left} y1={lossChart.top} x2={lossChart.left} y2={lossChart.top + lossChart.plotHeight} stroke={axisColor} strokeWidth="2" />
            <path d={lossPath} fill="none" stroke={secondaryColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={lossX(boundedStep)} cy={lossY(current.loss)} r="4" fill={secondaryColor} />
            <text x={lossChart.left} y={lossChart.height - 8} fontFamily="monospace" fontSize="12" fill={textColor}>iteration</text>
            <text x={lossChart.left + lossChart.plotWidth} y={lossChart.top + 12} textAnchor="end" fontFamily="monospace" fontSize="12" fill={textColor}>loss</text>
          </svg>
          <MathBlock math={String.raw`\theta_{k+1}=\theta_k-\eta\nabla L(\theta_k),\qquad L(m,b)=\frac1n\sum_i(mx_i+b-y_i)^2`} />
        </div>
      </div>
      <CodeBlock language="python" code={gradientDescentCode} />
    </InteractiveBlock>
  );
}

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
  } as CSSProperties : {
    '--mafs-fg': '#1e293b',
    '--mafs-bg': 'transparent',
    '--mafs-line-color': '#cbd5e1',
    '--mafs-origin-color': '#64748b'
  } as CSSProperties;
  const dottedMafsStyle = {
    ...mafsStyle,
    '--mafs-line-stroke-dash-style': '1, 8',
  } as CSSProperties;

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
  const conceptPanelClass = `my-8 rounded-lg border p-4 font-mono sm:p-5 ${
    isDarkMode ? 'border-green-500/25 bg-black/35 text-green-100' : 'border-slate-200 bg-white text-slate-700'
  }`;
  const conceptNodeClass = `flex min-h-24 flex-col justify-center rounded-lg border p-3 text-center text-sm leading-relaxed [&_.katex]:!text-inherit ${
    isDarkMode ? 'border-green-500/25 bg-green-500/5 text-green-100' : 'border-slate-200 bg-slate-50 text-slate-700'
  }`;
  const conceptArrowClass = `flex items-center justify-center text-sm font-bold ${
    isDarkMode ? 'text-green-300' : 'text-slate-500'
  }`;
  const conceptCaptionClass = `mt-4 text-sm leading-relaxed ${
    isDarkMode ? 'text-green-100/80' : 'text-slate-600'
  }`;

  return (
    <NotesLayout>
      <NoteHeader
        title="Calculus"
        subtitle="The beginning of all things regarding change..."
      />

      <NoteTopicGroup>
        <NoteTopicBlock title="How to Read the Notation">
          <ul className={graphListClassName}>
            <li><InlineMath math="\mathbb R" /> means the real numbers, the usual number line used for most calculus inputs and outputs.</li>
            <li><InlineMath math="f:A\to B" /> means the function takes inputs from <InlineMath math="A" /> and returns outputs in <InlineMath math="B" />.</li>
            <li><InlineMath math="\Delta" /> means a finite change, while <InlineMath math="d" /> appears in derivative and integral notation for infinitesimal change.</li>
            <li><InlineMath math="f'(x)" />, <InlineMath math="\frac{dy}{dx}" />, and <InlineMath math="\frac{d}{dx}f(x)" /> are derivative notations.</li>
            <li><InlineMath math="\int" /> means integrate, or accumulate; <InlineMath math="dx" /> tells which variable the accumulation uses.</li>
            <li><InlineMath math="\sum" /> means add indexed terms; <InlineMath math="\nabla" /> is the gradient operator; <InlineMath math="\partial" /> marks a partial derivative.</li>
            <li><InlineMath math="\approx" /> means approximately equal, and <InlineMath math="\|\vec v\|" /> means vector length.</li>
          </ul>
        </NoteTopicBlock>
      </NoteTopicGroup>

      {/* 1. FUNCTIONS SECTION */}
      <NoteSectionTitle id="functions">1. Functions</NoteSectionTitle>

      <NoteSubSectionTitle id="function-basics">1.1 Function Basics</NoteSubSectionTitle>
      <NoteParagraph>
        A function is an input-output rule. It takes each allowed input and assigns exactly one output. The rule can be a formula, a graph, a table,
        code, or a verbal description, but the one-output-per-input requirement is what makes it a function.
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
        All functions have a <strong>domain</strong>, a <strong>codomain</strong>, and a <strong>range</strong>. The domain is the set of allowed
        inputs. The codomain is the target set we agree outputs should live in. The range is the set of outputs the function actually hits. One
        should always consider these sets before doing algebra or reading a graph.
      </NoteParagraph>

      <NoteSubSectionTitle id="composition-of-functions">1.3 Composition of Functions</NoteSubSectionTitle>
      <NoteParagraph>
        Functions are just building blocks. When combining them together, we create a <strong>composition of functions</strong>.
        We denote such a composition of functions like so:
      </NoteParagraph>
      <MathBlock math="(f \circ g)(x) = f(g(x))" />
      <NoteParagraph>
        Note that we always evaluate the inside function first and work outwards!
      </NoteParagraph>

      <NoteSubSectionTitle id="inverse-functions">1.4 Inverse Functions</NoteSubSectionTitle>
      <NoteParagraph>
        If we can modify an input with a function, then naturally we might want to also <strong>undo</strong> our changes.
        This is called the <strong>inverse</strong> of the function. Of course, a function's inverse only exists as a function if it is{' '}
        <strong>one-to-one</strong> or <strong>injective</strong>, meaning different inputs always produce different outputs. If this was false,
        then the inverse would not know which original input to return.
        Visually, we can check with the <strong>horizontal line test</strong>.
        We commonly denote the inverse of a function as:
      </NoteParagraph>
      <MathBlock math="f^{-1}(x)" />

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
            <li><InlineMath math="-a \cdot f(x)" />: reflect across the x-axis and scale vertically</li>
            <li><InlineMath math="f(-x)" />: reflect across y-axis</li>
            <li><InlineMath math="-f(x) + c" />: reflect across x-axis and shift up</li>
            <li><InlineMath math="a \cdot f(x)" />: vertical stretch/compression</li>
            <li><InlineMath math="f(ax)" />: horizontal scale change, with larger <InlineMath math="|a|" /> making the graph narrower</li>
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
        Polynomial functions are continuous everywhere and built from powers of <InlineMath math="x" /> with non-negative integer exponents. You
        have probably seen a function like <InlineMath math="f(x) = x^3 + 2x^2 + 4" />. This is a basic polynomial function of <strong>degree 3</strong>,
        denoted by the highest power of the polynomial. I find the most intuitive way to understand polynomial functions is to just look at them.
      </NoteParagraph>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-start mb-8">
        <div>
          <ul className={graphListClassName}>
            <li style={{ color: graphColors.foreground }}><InlineMath math="f(x) = x" /></li>
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
              <Plot.OfX y={(x) => x ** 4 + 2 * x ** 3} color={Theme.orange} />
              <Plot.OfX y={(x) => x ** 5 - 5 * x ** 3 + 4 * x} color={Theme.violet} />
              <Plot.OfX y={(x) => 1 / 2 * x ** 6 - 15 / 4 * x ** 4 + 6 * x ** 2} color={Theme.blue} />
            </Mafs>
          </div>
        </div>
      </div>

      <NoteSubSectionTitle id="rational-functions">1.7 Rational Functions</NoteSubSectionTitle>
      <NoteParagraph>
        Rational functions are a ratio of two polynomials. Because we have a denominator, it can't be zero or else it would be undefined.
        This results in behavior that we call <strong>asymptotes</strong>. Additionally, factors of the polynomials can cancel resulting in what
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
            Unlike rational functions, exponential functions have domain <InlineMath math="\mathbb{R}" />. However, as seen from the examples, the range is now
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
            scales. Just looking at the graph, as the <InlineMath math="x" /> value grows, the <InlineMath math="y" /> value grows much slower, but still grows
            unboundedly nonetheless.
          </NoteParagraph>
        </div>

        <div className={`p-1 rounded-xl border ${isDarkMode ? 'bg-black/50 border-green-500/30' : 'bg-slate-50 border-slate-200'}`}>
          <div className="rounded-lg overflow-hidden" style={dottedMafsStyle}>
            <Mafs viewBox={{ x: [-1, 6], y: [-4, 4], padding: 0 }} height={300} zoom>
              <Coordinates.Cartesian />

              <Plot.OfX y={(x) => Math.log2(x)} domain={[0.001, 6]} color={Theme.blue} />
              <Plot.OfX y={(x) => Math.log(x)} domain={[0.001, 6]} color={Theme.red} />
              <Plot.OfX y={(x) => -Math.log2(x)} domain={[0.001, 6]} color={Theme.green} />
              <Plot.OfX y={(x) => Math.log2(x - 1)} domain={[1.001, 6]} color={Theme.violet} />

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
            Sine and cosine transformations are usually read through period, amplitude, phase shift, and vertical shift. The <strong>period</strong> is how long it
            takes for the function to repeat itself, the <strong>amplitude</strong> is how far a bounded wave goes from its center line, the <strong>phase shift</strong> is
            how much the function is shifted horizontally, and the <strong>vertical shift</strong> is how much the function is shifted vertically. Tangent has period
            and shifts too, but it is unbounded, so amplitude is not meaningful for it.
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
        Calculus uses a small set of algebra moves repeatedly, so it helps to keep the most common ones close at hand.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Factoring">
          <NoteParagraph>
            Factoring rewrites an expression as a product. For quadratics, we often look for two numbers whose product gives the constant term and whose sum gives
            the linear coefficient. If clean factors are not visible, the <strong>quadratic formula</strong> is the reliable fallback.
          </NoteParagraph>
          <MathBlock math="x^2 + 5x + 6 = (x + 2)(x + 3)" />
        </NoteTopicBlock>

        <NoteTopicBlock title="Expanding">
          <NoteParagraph>
            In a similar sense, expanding rewrites a product as a sum. While this is fairly trivial, we will see later on that it is quite mathematically convenient to
            expand before doing anything else.
          </NoteParagraph>
          <MathBlock math="(x + h)^2 = x^2 + 2xh + h^2" />
        </NoteTopicBlock>

        <NoteTopicBlock title="Rationalizing">
          <NoteParagraph>
            Rationalizing uses a <strong>conjugate</strong> to remove a square root expression from a difference. We find it useful to rationalize to simplify the
            expression and for mathematical convenience.
          </NoteParagraph>
          <MathBlock math="\frac{\sqrt{x} - 2}{1} \cdot \frac{\sqrt{x} + 2}{\sqrt{x} + 2} = \frac{x - 4}{\sqrt{x} + 2}" />
          <NoteParagraph className="mb-0">
            Used in limits when direct substitution creates an indeterminate form like <InlineMath math="0/0" />.
          </NoteParagraph>
        </NoteTopicBlock>

        <NoteTopicBlock title="Exponent Rules">
          <NoteParagraph>
            Exponents come with their own little set of rules that allow us to modify and simplify expressions.
          </NoteParagraph>
          <MathBlock math="x^a x^b = x^{a+b} \qquad \frac{x^a}{x^b} = x^{a-b} \qquad (x^a)^b = x^{ab}" />
        </NoteTopicBlock>

        <NoteTopicBlock title="Fraction Rules">
          <NoteParagraph>
            Similarly, fractions also come with their own set of handy rules.
          </NoteParagraph>
          <MathBlock math="\frac{a}{b} + \frac{c}{d} = \frac{ad + bc}{bd} \qquad \frac{\frac{a}{b}}{\frac{c}{d}} = \frac{ad}{bc}" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="trig-identities">1.12 Trig Identities</NoteSubSectionTitle>
      <NoteParagraph>
        Trig identities also constantly come up and are worth remembering the most common ones.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Pythagorean Identities">
          <MathBlock math="\sin^2(x) + \cos^2(x) = 1" />
          <MathBlock math="1 + \tan^2(x) = \sec^2(x) \qquad 1 + \cot^2(x) = \csc^2(x)" />
        </NoteTopicBlock>

        <NoteTopicBlock title="Quotient and Reciprocal Identities">
          <MathBlock math="\tan(x) = \frac{\sin(x)}{\cos(x)} \qquad \cot(x) = \frac{\cos(x)}{\sin(x)}" />
          <MathBlock math="\sec(x) = \frac{1}{\cos(x)} \qquad \csc(x) = \frac{1}{\sin(x)} \qquad \cot(x) = \frac{1}{\tan(x)}" />
        </NoteTopicBlock>

        <NoteTopicBlock title="Even and Odd Identities">
          <MathBlock math="\sin(-x) = -\sin(x) \qquad \cos(-x) = \cos(x) \qquad \tan(-x) = -\tan(x)" />
        </NoteTopicBlock>

        <NoteTopicBlock title="Double-Angle Identities">
          <MathBlock math="\sin(2x) = 2\sin(x)\cos(x)" />
          <MathBlock math="\cos(2x) = \cos^2(x) - \sin^2(x)" />
        </NoteTopicBlock>

        <NoteTopicBlock title="Power-Reduction Identities">
          <MathBlock math="\sin^2(x) = \frac{1 - \cos(2x)}{2} \qquad \cos^2(x) = \frac{1 + \cos(2x)}{2}" />
        </NoteTopicBlock>
      </NoteTopicGroup>


      {/* 2. LIMITS SECTION */}
      <NoteSectionTitle id="limits">2. Limits</NoteSectionTitle>
      <NoteParagraph>
        So far we have seen asymptotes, holes, and all kinds of weird function behavior. Sometimes being "close enough" is good enough. As we get <strong>infinitely</strong> close to a point, limits tell us what value the function is actually approaching.
      </NoteParagraph>
      <NoteParagraph>
        A limit does not ask what happens exactly at the point. It asks what the surrounding behavior is forcing us to believe.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Notation to Know">
          <NoteParagraph>
            In <InlineMath math="\lim_{x\to a} f(x)=L" />, the input <InlineMath math="x" /> is moving toward <InlineMath math="a" />,
            and the output <InlineMath math="f(x)" /> is moving toward <InlineMath math="L" />. The arrow means "approaches," not "equals."
          </NoteParagraph>
          <NoteParagraph className="mb-0">
            A superscript like <InlineMath math="a^-" /> means approach from the left, <InlineMath math="a^+" /> means approach from the right, and <InlineMath math="\infty" /> means unbounded growth rather than a normal number.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-start mb-8">
        <div>
          <ul className={graphListClassName}>
            <li style={{ color: graphColors.blue }}><InlineMath math="f(x)=x+1" /> around <InlineMath math="x=1" /></li>
            <li style={{ color: graphColors.violet }}>open circle: the value the graph approaches</li>
            <li style={{ color: graphColors.red }}>filled point: the value the function actually takes</li>
          </ul>
          <NoteParagraph>
            This is the point of limits. The graph can be missing or even disagree at a point, but the nearby behavior can still clearly point to a value.
            In the graph, <InlineMath math="f(1)" /> is not the same as <InlineMath math="\lim_{x \to 1} f(x)" />.
          </NoteParagraph>
        </div>

        <div className={`p-1 rounded-xl border ${isDarkMode ? 'bg-black/50 border-green-500/30' : 'bg-slate-50 border-slate-200'}`}>
          <div className="rounded-lg overflow-hidden" style={dottedMafsStyle}>
            <Mafs viewBox={{ x: [-2, 4], y: [-1, 5], padding: 0 }} height={300} zoom>
              <Coordinates.Cartesian />
              <Plot.OfX y={(x) => x + 1} domain={[-2, 0.999]} color={Theme.blue} />
              <Plot.OfX y={(x) => x + 1} domain={[1.001, 4]} color={Theme.blue} />
              <Line.ThroughPoints point1={[1, -1]} point2={[1, 5]} color={graphColors.asymptote} style="dashed" opacity={0.7} />
              <Circle center={[1, 2]} radius={0.12} color={Theme.violet} fillOpacity={0} strokeOpacity={1} weight={3} />
              <Point x={1} y={0} color={Theme.red} />
            </Mafs>
          </div>
        </div>
      </div>

      <NoteSubSectionTitle id="intuitive-limits">2.1 Intuitive Limits</NoteSubSectionTitle>
      <NoteParagraph>
        Intuitively, a limit is the value a function is being pulled toward. If the graph has a hole, the limit can still exist because the nearby points still agree on where the graph should have landed.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Useful Form">
          <NoteParagraph>
            We read this as: as <InlineMath math="x" /> gets close to <InlineMath math="a" />, <InlineMath math="f(x)" /> gets close to <InlineMath math="L" />.
          </NoteParagraph>
          <MathBlock math="\lim_{x \to a} f(x) = L" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="one-sided-limits">2.2 One-Sided Limits</NoteSubSectionTitle>
      <NoteParagraph>
        One-sided limits separate the two ways we can approach a point. The left side cares about values just smaller than the input, and the right side cares about values just larger than the input.
      </NoteParagraph>
      <NoteParagraph>
        A normal limit exists only when both sides are approaching the same value. If they disagree, the function has no single behavior at that point.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Agreement Check">
          <MathBlock math="\lim_{x \to a^-} f(x) = \lim_{x \to a^+} f(x) = L" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="infinite-limits">2.3 Infinite Limits</NoteSubSectionTitle>
      <NoteParagraph>
        An infinite limit describes the function shooting upward or downward without bound near a finite input. This is usually the language of vertical asymptotes.
      </NoteParagraph>
      <NoteParagraph>
        The important idea is not that the function "equals infinity". It does not. It means the output grows past any fixed number as the input gets close enough.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Vertical Asymptote Behavior">
          <MathBlock math="\lim_{x \to a} f(x) = \infty \qquad \text{or} \qquad \lim_{x \to a} f(x) = -\infty" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="limits-at-infinity">2.4 Limits at Infinity</NoteSubSectionTitle>
      <NoteParagraph>
        Limits at infinity ask about the long-term behavior of a function. Instead of zooming into a point, we zoom out and ask what the function settles toward as <InlineMath math="x" /> runs far left or far right.
      </NoteParagraph>
      <NoteParagraph>
        This is useful for end behavior, horizontal asymptotes, and understanding what part of a function dominates when the input becomes extremely large.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="End Behavior">
          <MathBlock math="\lim_{x \to \infty} f(x) = L \qquad \lim_{x \to -\infty} f(x) = M" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="continuity">2.5 Continuity</NoteSubSectionTitle>
      <NoteParagraph>
        Continuity means the graph behaves without surprise at a point. The function is defined there, the surrounding limit exists, and the actual value matches what the surrounding behavior predicts.
      </NoteParagraph>
      <NoteParagraph>
        A continuous function lets us safely move from local behavior to global conclusions because there are no hidden breaks in the graph.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Three-Part Check">
          <MathBlock math="f(a) \text{ exists} \qquad \lim_{x \to a} f(x) \text{ exists} \qquad \lim_{x \to a} f(x) = f(a)" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="discontinuities">2.6 Discontinuities</NoteSubSectionTitle>
      <NoteParagraph>
        Discontinuities are the places where a function breaks the normal expectation of smooth behavior. The most common types are holes, jumps, and infinite discontinuities.
      </NoteParagraph>
      <NoteParagraph>
        A removable discontinuity is like a missing dot. A jump is a disagreement between left and right. An infinite discontinuity is usually a vertical asymptote.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Classifying the Break">
          <NoteParagraph>
            Classifying the break tells us what went wrong: the value is missing, the sides disagree, or the output becomes unbounded.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="intermediate-value-theorem">2.7 Intermediate Value Theorem</NoteSubSectionTitle>
      <NoteParagraph>
        The Intermediate Value Theorem is a trust statement about continuous functions. If a continuous graph starts at one height and ends at another, it must pass through every height in between.
      </NoteParagraph>
      <NoteParagraph>
        This theorem is why continuity matters. Without a break, the graph cannot teleport over a value.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Core Idea">
          <MathBlock math="\text{If } f \text{ is continuous on } [a,b] \text{ and } N \text{ is between } f(a) \text{ and } f(b), \text{ then } f(c)=N" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="epsilon-delta-definition">2.8 Epsilon-Delta Definition</NoteSubSectionTitle>
      <NoteParagraph>
        The epsilon-delta definition is the formal version of "close inputs force close outputs." Epsilon measures how close we want the output to be, and delta measures how close the input needs to be.
      </NoteParagraph>
      <NoteParagraph>
        The definition feels technical because it has to work for every possible closeness demand. Intuitively, it is just a guarantee that local behavior can be controlled.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Formal Limit">
          <MathBlock math="\forall \epsilon > 0,\ \exists \delta > 0 \text{ such that } 0 < |x-a| < \delta \Rightarrow |f(x)-L| < \epsilon" />
          <NoteParagraph className="mb-0">
            Here <InlineMath math="\epsilon" /> is the allowed output error and <InlineMath math="\delta" /> is the input distance needed to guarantee it.
            The condition <InlineMath math="0<|x-a|" /> avoids using the exact point <InlineMath math="a" /> itself.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="limit-laws">2.9 Limit Laws</NoteSubSectionTitle>
      <NoteParagraph>
        Limit laws let us break complicated limits into simpler pieces when the surrounding behavior is well-behaved. They are the reason substitution works for continuous combinations of familiar functions.
      </NoteParagraph>
      <NoteParagraph>
        The main caution is that algebraic rules only help after the pieces have meaningful limits.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Algebra of Limits">
          <MathBlock math="\lim_{x\to a}(f+g)=\lim_{x\to a}f+\lim_{x\to a}g" />
          <MathBlock math="\lim_{x\to a}(fg)=\left(\lim_{x\to a}f\right)\left(\lim_{x\to a}g\right)" />
          <MathBlock math="\lim_{x\to a}\frac{f}{g}=\frac{\lim_{x\to a}f}{\lim_{x\to a}g}\qquad \text{if } \lim_{x\to a}g\ne0" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="squeeze-theorem">2.10 Squeeze Theorem</NoteSubSectionTitle>
      <NoteParagraph>
        The squeeze theorem is useful when a function is hard to understand directly, but it is trapped between two simpler functions with the same limit.
      </NoteParagraph>
      <NoteParagraph>
        Intuitively, if both walls close in on the same value, the trapped function has nowhere else to go.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Trapped Behavior">
          <MathBlock math="g(x)\le f(x)\le h(x),\quad \lim_{x\to a}g(x)=\lim_{x\to a}h(x)=L \Rightarrow \lim_{x\to a}f(x)=L" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="special-trig-limits">2.11 Special Trig Limits</NoteSubSectionTitle>
      <NoteParagraph>
        Special trig limits connect radians, circular motion, and local linear behavior. Near zero, sine behaves almost like its angle, while cosine barely moves away from one.
      </NoteParagraph>
      <NoteParagraph>
        These limits are small facts with large consequences: they anchor trig derivatives.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Core Small-Angle Limits">
          <MathBlock math="\lim_{x\to0}\frac{\sin x}{x}=1 \qquad \lim_{x\to0}\frac{1-\cos x}{x}=0" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      {/* 3. DERIVATIVES SECTION */}
      <NoteSectionTitle id="derivatives">3. Derivatives</NoteSectionTitle>
      <NoteParagraph>
        Derivatives measure change at a single instant. They turn the broad shape of a graph into local information about speed, direction, and steepness.
      </NoteParagraph>
      <NoteParagraph>
        I find it useful to think of the derivative as a microscope. The more you zoom into a differentiable curve, the more it starts to look like a line.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Notation to Know">
          <NoteParagraph>
            The notations <InlineMath math="f'(x)" />, <InlineMath math="\frac{dy}{dx}" />, and <InlineMath math="\frac{d}{dx}f(x)" /> all describe derivative ideas.
            The first is read "f prime of x," while <InlineMath math="\frac{dy}{dx}" /> emphasizes change in <InlineMath math="y" /> per change in <InlineMath math="x" />.
          </NoteParagraph>
          <NoteParagraph className="mb-0">
            The symbol <InlineMath math="\Delta" /> means a finite change, while <InlineMath math="d" /> means an infinitesimal change used in derivative notation.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-start mb-8">
        <div>
          <ul className={graphListClassName}>
            <li style={{ color: graphColors.blue }}><InlineMath math="f(x)=x^2" /></li>
            <li style={{ color: graphColors.orange }}>secant line: average change over an interval</li>
            <li style={{ color: graphColors.green }}>tangent line: instantaneous change at one point</li>
          </ul>
          <NoteParagraph>
            Derivatives are born from making the secant interval smaller and smaller. The tangent line is what remains when the two points collapse into one local direction.
          </NoteParagraph>
        </div>

        <div className={`p-1 rounded-xl border ${isDarkMode ? 'bg-black/50 border-green-500/30' : 'bg-slate-50 border-slate-200'}`}>
          <div className="rounded-lg overflow-hidden" style={mafsStyle}>
            <Mafs viewBox={{ x: [-1, 3], y: [-1, 5] }} height={300} zoom>
              <Coordinates.Cartesian />
              <Plot.OfX y={(x) => x ** 2} color={Theme.blue} />
              <Line.PointSlope point={[1, 1]} slope={2} color={Theme.green} opacity={0.9} />
              <Line.PointSlope point={[0.25, 0.0625]} slope={2.25} color={Theme.orange} opacity={0.9} />
              <Point x={1} y={1} color={Theme.green} />
              <Point x={0.25} y={0.0625} color={Theme.orange} />
              <Point x={2} y={4} color={Theme.orange} />
            </Mafs>
          </div>
        </div>
      </div>

      <NoteSubSectionTitle id="derivative-definition">3.1 Derivative Definition</NoteSubSectionTitle>
      <NoteParagraph>
        The derivative starts as an average rate of change over a tiny interval. As the interval shrinks to zero, the average rate becomes an instantaneous rate.
      </NoteParagraph>
      <NoteParagraph>
        This is the same limit idea from before, now applied to slopes.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Difference Quotient">
          <MathBlock math="f'(x) = \lim_{h \to 0} \frac{f(x+h)-f(x)}{h}" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="tangent-lines">3.2 Tangent Lines</NoteSubSectionTitle>
      <NoteParagraph>
        A tangent line is the line that best matches a curve near one point. It does not have to touch only once; what matters is that it captures the local direction.
      </NoteParagraph>
      <NoteParagraph>
        This turns a possibly complicated function into a simple local approximation.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Point-Slope Form">
          <MathBlock math="y - f(a) = f'(a)(x-a)" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="rates-of-change">3.3 Rates of Change</NoteSubSectionTitle>
      <NoteParagraph>
        Rates of change give derivatives their units. If position is measured in meters and time is measured in seconds, the derivative is measured in meters per second.
      </NoteParagraph>
      <NoteParagraph>
        The units often tell you what the derivative means before the algebra does.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Average to Instantaneous">
          <MathBlock math="\frac{\Delta y}{\Delta x} \longrightarrow \frac{dy}{dx}" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="power-rule">3.4 Power Rule</NoteSubSectionTitle>
      <NoteParagraph>
        The power rule is the first major shortcut. Powers of <InlineMath math="x" /> change predictably: the old exponent comes down as a multiplier, then the exponent decreases by one.
      </NoteParagraph>
      <NoteParagraph>
        Intuitively, higher powers have more aggressive growth, and the derivative lowers the degree because it measures how that growth is changing.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Power Rule">
          <MathBlock math="\frac{d}{dx} x^n = nx^{n-1}" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="product-rule">3.5 Product Rule</NoteSubSectionTitle>
      <NoteParagraph>
        When two changing quantities are multiplied, both pieces contribute to the total change. The product rule captures "first changes, second stays" plus "second changes, first stays."
      </NoteParagraph>
      <NoteParagraph>
        This is why we cannot just multiply the separate derivatives.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Product Rule">
          <MathBlock math="(fg)' = f'g + fg'" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="quotient-rule">3.6 Quotient Rule</NoteSubSectionTitle>
      <NoteParagraph>
        A quotient is a product with a reciprocal, but the quotient rule is often the cleanest way to remember the result. The denominator matters twice because it controls both scaling and sensitivity.
      </NoteParagraph>
      <NoteParagraph>
        A useful phrase is: low d-high minus high d-low, over low squared.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Quotient Rule">
          <MathBlock math="\left(\frac{f}{g}\right)' = \frac{f'g - fg'}{g^2}" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="chain-rule">3.7 Chain Rule</NoteSubSectionTitle>
      <NoteParagraph>
        The chain rule is the derivative rule for composition. If an outside function depends on an inside function, both layers of change matter.
      </NoteParagraph>
      <NoteParagraph>
        This is one of the most important ideas in calculus: change propagates through layers.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Chain Rule">
          <MathBlock math="\frac{d}{dx} f(g(x)) = f'(g(x))g'(x)" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="trig-derivatives">3.8 Trig Derivatives</NoteSubSectionTitle>
      <NoteParagraph>
        Trig derivatives reflect how circular motion changes. Sine and cosine cycle into each other because their rates are tied to motion around the unit circle.
      </NoteParagraph>
      <NoteParagraph>
        The signs matter because direction changes as the point moves around the circle.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Core Trig Derivatives">
          <MathBlock math="\frac{d}{dx}\sin x = \cos x \qquad \frac{d}{dx}\cos x = -\sin x" />
          <MathBlock math="\frac{d}{dx}\tan x = \sec^2 x" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="exponential-derivatives">3.9 Exponential Derivatives</NoteSubSectionTitle>
      <NoteParagraph>
        Exponential functions grow in proportion to their current size. That is the reason they model compounding, populations, and repeated scaling so naturally.
      </NoteParagraph>
      <NoteParagraph>
        The function <InlineMath math="e^x" /> is special because its rate of change is exactly itself.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Exponential Rules">
          <MathBlock math="\frac{d}{dx} e^x = e^x \qquad \frac{d}{dx} a^x = a^x \ln a" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="logarithmic-derivatives">3.10 Logarithmic Derivatives</NoteSubSectionTitle>
      <NoteParagraph>
        Logarithms grow slowly because they ask how many multiplicative steps were needed. Their derivatives shrink as <InlineMath math="x" /> grows because each additional unit matters less at larger scales.
      </NoteParagraph>
      <NoteParagraph>
        The natural log is the main one to remember because it is tied directly to <InlineMath math="e" />.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Log Rules">
          <MathBlock math="\frac{d}{dx}\ln x = \frac{1}{x} \qquad \frac{d}{dx}\log_a x = \frac{1}{x\ln a}" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="implicit-differentiation">3.11 Implicit Differentiation</NoteSubSectionTitle>
      <NoteParagraph>
        Implicit differentiation handles relationships where <InlineMath math="y" /> is not neatly solved as a function of <InlineMath math="x" />. We differentiate both sides and remember that <InlineMath math="y" /> changes with <InlineMath math="x" />.
      </NoteParagraph>
      <NoteParagraph>
        Every time we differentiate a term involving <InlineMath math="y" />, the chain rule quietly adds <InlineMath math="\frac{dy}{dx}" />.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Common Pattern">
          <MathBlock math="\frac{d}{dx}y^2 = 2y\frac{dy}{dx}" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="inverse-function-derivatives">3.12 Inverse Function Derivatives</NoteSubSectionTitle>
      <NoteParagraph>
        Inverse functions undo each other, so their slopes undo each other too. If a function is steep at a point, its inverse is shallow at the corresponding point.
      </NoteParagraph>
      <NoteParagraph>
        This reciprocal relationship is the intuition behind inverse trig derivatives as well.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Inverse Derivative">
          <MathBlock math="(f^{-1})'(a) = \frac{1}{f'(f^{-1}(a))}" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="higher-order-derivatives">3.13 Higher-Order Derivatives</NoteSubSectionTitle>
      <NoteParagraph>
        Higher-order derivatives repeat the same idea. The first derivative tracks change, the second derivative tracks how that change is changing, and later derivatives track deeper behavior.
      </NoteParagraph>
      <NoteParagraph>
        In motion, this means position, velocity, acceleration, and later derivatives such as jerk.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Notation">
          <MathBlock math="f''(x) = \frac{d^2f}{dx^2} \qquad f^{(n)}(x) = \frac{d^n f}{dx^n}" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="differentiability">3.14 Differentiability</NoteSubSectionTitle>
      <NoteParagraph>
        Differentiability means a function has a reliable local linear direction. Corners, cusps, vertical tangents, and discontinuities are common places where that direction breaks.
      </NoteParagraph>
      <NoteParagraph>
        A differentiable function must be continuous, but a continuous function does not have to be differentiable.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Relationship">
          <MathBlock math="f \text{ differentiable at } a \Rightarrow f \text{ continuous at } a" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="inverse-trig-derivatives">3.15 Inverse Trig Derivatives</NoteSubSectionTitle>
      <NoteParagraph>
        Inverse trig derivatives appear whenever a rate is constrained by circular geometry. The square roots come from the unit-circle relationships hiding behind the inverse functions.
      </NoteParagraph>
      <NoteParagraph>
        These are especially useful in integration because many radical expressions reverse back into inverse trig functions.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Core Inverse Trig Derivatives">
          <MathBlock math="\frac{d}{dx}\arcsin x=\frac{1}{\sqrt{1-x^2}} \qquad \frac{d}{dx}\arctan x=\frac{1}{1+x^2}" />
          <MathBlock math="\frac{d}{dx}\arccos x=-\frac{1}{\sqrt{1-x^2}}" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="logarithmic-differentiation">3.16 Logarithmic Differentiation</NoteSubSectionTitle>
      <NoteParagraph>
        Logarithmic differentiation turns products, quotients, powers, and variable exponents into sums and simpler factors before differentiating.
      </NoteParagraph>
      <NoteParagraph>
        The intuition is that logs translate multiplicative structure into additive structure, which derivatives handle more cleanly.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Useful Pattern">
          <MathBlock math="y=f(x)^{g(x)} \qquad \Rightarrow \qquad \ln y=g(x)\ln f(x)" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      {/* 4. DERIVATIVE APPLICATIONS SECTION */}
      <NoteSectionTitle id="derivative-applications">4. Derivative Applications</NoteSectionTitle>
      <NoteParagraph>
        Once derivatives exist, we can use them to read a function instead of just compute with it. The derivative tells us where a graph is moving, where it turns around, and how its shape bends.
      </NoteParagraph>
      <NoteParagraph>
        The goal in applications is usually translation: turn a real or graphical question into a derivative statement.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Notation to Know">
          <NoteParagraph>
            A critical point is where <InlineMath math="f'(x)=0" /> or where <InlineMath math="f'" /> does not exist; <InlineMath math="f'(x)=0" /> is the common case where first-order motion has paused. The notation <InlineMath math="f''(x)" /> is the second derivative,
            which tracks concavity, or how the slope itself changes.
          </NoteParagraph>
          <NoteParagraph className="mb-0">
            In motion notation, <InlineMath math="s(t)" /> is position, <InlineMath math="v(t)" /> is velocity, and <InlineMath math="a(t)" /> is acceleration.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-start mb-8">
        <div>
          <ul className={graphListClassName}>
            <li style={{ color: graphColors.blue }}><InlineMath math="f(x)=x^3-3x" /></li>
            <li style={{ color: graphColors.green }}>local maximum: derivative changes from positive to negative</li>
            <li style={{ color: graphColors.red }}>local minimum: derivative changes from negative to positive</li>
            <li style={{ color: graphColors.violet }}>inflection point: concavity changes</li>
          </ul>
          <NoteParagraph>
            Most derivative applications are about reading signs. The first derivative tells movement, and the second derivative tells bending.
          </NoteParagraph>
        </div>

        <div className={`p-1 rounded-xl border ${isDarkMode ? 'bg-black/50 border-green-500/30' : 'bg-slate-50 border-slate-200'}`}>
          <div className="rounded-lg overflow-hidden" style={mafsStyle}>
            <Mafs viewBox={{ x: [-3, 3], y: [-4, 4] }} height={300} zoom>
              <Coordinates.Cartesian />
              <Plot.OfX y={(x) => x ** 3 - 3 * x} color={Theme.blue} />
              <Point x={-1} y={2} color={Theme.green} />
              <Point x={1} y={-2} color={Theme.red} />
              <Point x={0} y={0} color={Theme.violet} />
            </Mafs>
          </div>
        </div>
      </div>

      <NoteSubSectionTitle id="linear-approximation">4.1 Linear Approximation</NoteSubSectionTitle>
      <NoteParagraph>
        Linear approximation uses the tangent line as a local stand-in for a function. Near the point of tangency, the curve and line are almost indistinguishable.
      </NoteParagraph>
      <NoteParagraph>
        This is useful because lines are much easier to reason with than curves.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Local Linearization">
          <MathBlock math="L(x) = f(a) + f'(a)(x-a)" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="related-rates">4.2 Related Rates</NoteSubSectionTitle>
      <NoteParagraph>
        Related rates problems connect multiple quantities that are changing with respect to the same variable, usually time. The equation gives the relationship; differentiation gives the relationship between the rates.
      </NoteParagraph>
      <NoteParagraph>
        The key is to differentiate before plugging in moment-specific values unless the value is truly constant.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Basic Flow">
          <NoteParagraph>
            Relate the quantities, differentiate with respect to time, substitute the known moment, then solve for the unknown rate.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="optimization">4.3 Optimization</NoteSubSectionTitle>
      <NoteParagraph>
        Optimization asks where something is largest or smallest. Derivatives help because extrema occur where the function stops increasing and starts decreasing, or at the endpoints of the domain.
      </NoteParagraph>
      <NoteParagraph>
        A derivative of zero is not automatically a maximum or minimum. It is a candidate that still needs context.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Candidate Points">
          <MathBlock math="f'(x)=0 \qquad \text{or} \qquad f'(x) \text{ does not exist}" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="motion-problems">4.4 Motion Problems</NoteSubSectionTitle>
      <NoteParagraph>
        Motion problems are derivative applications with physical names. Position changes into velocity, and velocity changes into acceleration.
      </NoteParagraph>
      <NoteParagraph>
        The sign matters as much as the size. Velocity tells direction of motion, while speed only tells how fast the object is moving.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Motion Chain">
          <MathBlock math="s'(t)=v(t) \qquad v'(t)=a(t) \qquad \text{speed}=|v(t)|" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="increasing-and-decreasing-functions">4.5 Increasing and Decreasing Functions</NoteSubSectionTitle>
      <NoteParagraph>
        The sign of the derivative tells us whether the function is moving upward or downward as we move left to right. Positive slope means increasing, negative slope means decreasing.
      </NoteParagraph>
      <NoteParagraph>
        This turns graph analysis into a sign chart.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Sign Reading">
          <MathBlock math="f'(x)>0 \Rightarrow f \text{ increasing} \qquad f'(x)<0 \Rightarrow f \text{ decreasing}" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="concavity">4.6 Concavity</NoteSubSectionTitle>
      <NoteParagraph>
        Concavity describes whether the graph bends upward or downward. It is controlled by the second derivative because the second derivative tells us whether the slope itself is increasing or decreasing.
      </NoteParagraph>
      <NoteParagraph>
        A graph can be increasing and still concave down if it is increasing more slowly.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Second Derivative Reading">
          <MathBlock math="f''(x)>0 \Rightarrow \text{concave up} \qquad f''(x)<0 \Rightarrow \text{concave down}" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="inflection-points">4.7 Inflection Points</NoteSubSectionTitle>
      <NoteParagraph>
        An inflection point is where concavity changes. It is not just where the second derivative equals zero; the bending behavior must actually switch.
      </NoteParagraph>
      <NoteParagraph>
        This distinction matters because zero can be a false alarm if the graph keeps bending the same way.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Check">
          <NoteParagraph>
            Find where <InlineMath math="f''(x)=0" /> or <InlineMath math="f''" /> is undefined, then verify that the sign of <InlineMath math="f''" /> changes.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="mean-value-theorem">4.8 Mean Value Theorem</NoteSubSectionTitle>
      <NoteParagraph>
        The Mean Value Theorem says that, under nice conditions, the instantaneous rate must equal the average rate somewhere. If you drove 60 miles in one hour, at some instant your speedometer had to read 60 mph.
      </NoteParagraph>
      <NoteParagraph>
        It connects global change over an interval to local derivative behavior inside the interval. The function must be continuous on the closed interval and differentiable inside it.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="The Statement">
          <MathBlock math="\exists c\in(a,b)\text{ such that } f'(c)=\frac{f(b)-f(a)}{b-a}" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="l-h-pital-s-rule">4.9 L'Hopital's Rule</NoteSubSectionTitle>
      <NoteParagraph>
        L'Hopital's Rule handles indeterminate quotients by comparing rates of change instead of the original values. If both top and bottom are collapsing to zero, their derivatives can reveal which collapses faster.
      </NoteParagraph>
      <NoteParagraph>
        It only applies to forms like <InlineMath math="0/0" /> or <InlineMath math="\infty/\infty" /> after checking the limit form, and the derivative quotient still needs its own limit.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Indeterminate Quotients">
          <MathBlock math="\lim_{x \to a}\frac{f(x)}{g(x)}=\lim_{x \to a}\frac{f'(x)}{g'(x)}" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="curve-sketching">4.10 Curve Sketching</NoteSubSectionTitle>
      <NoteParagraph>
        Curve sketching is the process of combining domain, intercepts, asymptotes, first derivative behavior, and second derivative behavior into one coherent picture.
      </NoteParagraph>
      <NoteParagraph>
        The goal is not artistic accuracy. The goal is to understand what the graph must do.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Good Order">
          <NoteParagraph>
            Start with domain and asymptotes, then use <InlineMath math="f'" /> for increasing/decreasing behavior and <InlineMath math="f''" /> for concavity.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="newtons-method">4.11 Newton's Method</NoteSubSectionTitle>
      <NoteParagraph>
        Newton's method uses tangent lines to approximate zeros of a function. Instead of searching blindly, it follows the local linear approximation to where the function should cross the axis.
      </NoteParagraph>
      <NoteParagraph>
        This is one of the clearest examples of calculus becoming an algorithm: local slope information drives an iterative numerical method.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Tangent-Line Update">
          <MathBlock math="x_{n+1}=x_n-\frac{f(x_n)}{f'(x_n)}" />
        </NoteTopicBlock>
      </NoteTopicGroup>
      <NewtonMethodRunner />

      {/* 5. INTEGRALS SECTION */}
      <NoteSectionTitle id="integrals">5. Integrals</NoteSectionTitle>
      <NoteParagraph>
        Integrals measure accumulation. If derivatives zoom in to find instant change, integrals zoom out to add up many tiny changes into a total.
      </NoteParagraph>
      <NoteParagraph>
        The surprising part of calculus is that these two ideas are inverses of each other.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Notation to Know">
          <NoteParagraph>
            The symbol <InlineMath math="\int" /> means integrate, or accumulate. In <InlineMath math="\int_a^b f(x)\,dx" />, the numbers <InlineMath math="a" /> and <InlineMath math="b" /> are the bounds, <InlineMath math="f(x)" /> is what is being accumulated, and <InlineMath math="dx" /> says the accumulation is happening with respect to <InlineMath math="x" />.
          </NoteParagraph>
          <NoteParagraph className="mb-0">
            In an indefinite integral, <InlineMath math="+C" /> represents the unknown vertical shift shared by all antiderivatives.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-start mb-8">
        <div>
          <ul className={graphListClassName}>
            <li style={{ color: graphColors.blue }}><InlineMath math="f(x)=\frac{1}{2}x^2+\frac{1}{2}" /></li>
            <li style={{ color: graphColors.green }}>shaded region: accumulated signed area</li>
            <li style={{ color: graphColors.orange }}>thin slices: the pieces being added</li>
          </ul>
          <NoteParagraph>
            An integral is not a mysterious new operation. It is just a disciplined way of adding many tiny pieces whose size changes across the interval.
          </NoteParagraph>
        </div>

        <div className={`p-1 rounded-xl border ${isDarkMode ? 'bg-black/50 border-green-500/30' : 'bg-slate-50 border-slate-200'}`}>
          <div className="rounded-lg overflow-hidden" style={mafsStyle}>
            <Mafs viewBox={{ x: [-0.5, 2.5], y: [-0.5, 3] }} height={300} zoom>
              <Coordinates.Cartesian />
              <Polygon
                points={[[0, 0], [0, 0.5], [0.5, 0.625], [1, 1], [1.5, 1.625], [2, 2.5], [2, 0]]}
                color={Theme.green}
                fillOpacity={0.25}
              />
              <Plot.OfX y={(x) => 0.5 * x ** 2 + 0.5} domain={[0, 2]} color={Theme.blue} />
              <Line.Segment point1={[0.5, 0]} point2={[0.5, 0.625]} color={Theme.orange} opacity={0.8} />
              <Line.Segment point1={[1, 0]} point2={[1, 1]} color={Theme.orange} opacity={0.8} />
              <Line.Segment point1={[1.5, 0]} point2={[1.5, 1.625]} color={Theme.orange} opacity={0.8} />
            </Mafs>
          </div>
        </div>
      </div>

      <NoteSubSectionTitle id="antiderivatives">5.1 Antiderivatives</NoteSubSectionTitle>
      <NoteParagraph>
        An antiderivative reverses differentiation. Instead of asking for the rate of change, we ask what original function could have produced that rate.
      </NoteParagraph>
      <NoteParagraph>
        The constant matters because many functions differ only by a vertical shift and therefore have the same derivative.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="General Antiderivative">
          <MathBlock math="\int f(x)\,dx = F(x)+C \qquad \text{where } F'(x)=f(x)" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="riemann-sums">5.2 Riemann Sums</NoteSubSectionTitle>
      <NoteParagraph>
        Riemann sums approximate accumulation by chopping a region into thin rectangles. More rectangles generally means a better approximation.
      </NoteParagraph>
      <NoteParagraph>
        This is the bridge from finite arithmetic to the definite integral.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Rectangle Sum">
          <MathBlock math="\sum_{i=1}^{n} f(x_i^*)\Delta x" />
          <NoteParagraph className="mb-0">
            The index <InlineMath math="i" /> labels each rectangle, <InlineMath math="n" /> is the number of rectangles, <InlineMath math="x_i^*" /> is the sample point in the <InlineMath math="i" />th rectangle, and <InlineMath math="\Delta x" /> is the width.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="definite-integrals">5.3 Definite Integrals</NoteSubSectionTitle>
      <NoteParagraph>
        A definite integral gives signed accumulation over an interval. Area above the axis counts positive, and area below the axis counts negative.
      </NoteParagraph>
      <NoteParagraph>
        This signed nature is why an integral is more general than just "area under the curve."
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Limit of Riemann Sums">
          <MathBlock math="\int_a^b f(x)\,dx = \lim_{n \to \infty}\sum_{i=1}^{n} f(x_i^*)\Delta x" />
          <NoteParagraph className="mb-0">
            This says a definite integral is the limit of better and better rectangle sums as the number of rectangles grows without bound.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="indefinite-integrals">5.4 Indefinite Integrals</NoteSubSectionTitle>
      <NoteParagraph>
        An indefinite integral is a family of antiderivatives. It has no bounds because it is not asking for a number; it is asking for a function.
      </NoteParagraph>
      <NoteParagraph>
        The <InlineMath math="+C" /> is not decoration. It represents every vertical shift that differentiates back to the same result.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Family of Functions">
          <MathBlock math="\int x^n\,dx = \frac{x^{n+1}}{n+1}+C \qquad (n \ne -1)" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="accumulation-functions">5.5 Accumulation Functions</NoteSubSectionTitle>
      <NoteParagraph>
        An accumulation function turns the upper bound into a variable. As that bound moves, the integral tracks how much has accumulated so far.
      </NoteParagraph>
      <NoteParagraph>
        This makes an integral behave like a function rather than a final total.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Accumulation Function">
          <MathBlock math="A(x)=\int_a^x f(t)\,dt" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="fundamental-theorem-of-calculus">5.6 Fundamental Theorem of Calculus</NoteSubSectionTitle>
      <NoteParagraph>
        The Fundamental Theorem of Calculus is the central connection: accumulation and rate of change undo each other.
      </NoteParagraph>
      <NoteParagraph>
        Part 1 says the derivative of accumulated change gives back the original rate. Part 2 says we can compute total accumulation using an antiderivative.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Two Forms">
          <MathBlock math="\frac{d}{dx}\int_a^x f(t)\,dt = f(x)" />
          <MathBlock math="\int_a^b f(x)\,dx = F(b)-F(a)" />
          <NoteParagraph className="mb-0">
            The variable <InlineMath math="t" /> is a placeholder inside the accumulation, while <InlineMath math="x" /> is the moving upper bound.
            In the second form, <InlineMath math="F" /> is any antiderivative of <InlineMath math="f" />.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="basic-substitution">5.7 Basic Substitution</NoteSubSectionTitle>
      <NoteParagraph>
        Basic substitution reverses the chain rule. If part of the integrand looks like the derivative of another part, substitution lets us rename the inside expression and simplify the integral.
      </NoteParagraph>
      <NoteParagraph>
        The intuition is that we are changing the unit of measurement before accumulating.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Substitution Pattern">
          <MathBlock math="\int f(g(x))g'(x)\,dx = \int f(u)\,du" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      {/* 6. INTEGRATION TECHNIQUES SECTION */}
      <NoteSectionTitle id="integration-techniques">6. Integration Techniques</NoteSectionTitle>
      <NoteParagraph>
        Integration techniques are mostly about recognizing structure. Unlike derivatives, integrals do not have one universal rule that always makes things easier.
      </NoteParagraph>
      <NoteParagraph>
        The practical skill is choosing the rewrite that reveals a familiar derivative in reverse.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Notation to Know">
          <NoteParagraph>
            In substitution, <InlineMath math="u" /> is a temporary name for an inside expression, and <InlineMath math="du" /> represents its derivative piece.
            In integration by parts, <InlineMath math="u" /> is the part we differentiate and <InlineMath math="dv" /> is the part we integrate.
          </NoteParagraph>
          <NoteParagraph className="mb-0">
            Symbols like <InlineMath math="A" /> and <InlineMath math="B" /> in partial fractions are unknown constants chosen so the decomposed fractions match the original expression.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>
      <DiagramBlock chart={`graph LR
        A["Integral looks like..."] --> B["Inside function + its derivative"]
        B --> C["Use u-substitution"]
        A --> D["Product where one part simplifies"]
        D --> E["Use integration by parts"]
        A --> F["Rational function"]
        F --> G["Factor and use partial fractions"]
        A --> H["Trig powers or radicals"]
        H --> I["Use identities or trig substitution"]`} />
      <NoteParagraph>
        Integration techniques are less about memorizing a long menu and more about recognizing the shape of the expression in front of you.
        The first useful question is usually: what derivative rule created something that looks like this?
      </NoteParagraph>

      <NoteSubSectionTitle id="u-substitution">6.1 u-Substitution</NoteSubSectionTitle>
      <NoteParagraph>
        u-Substitution is the chain rule run backward. It is the first technique to try when there is a clear inside function and its derivative nearby.
      </NoteParagraph>
      <NoteParagraph>
        For definite integrals, changing the bounds to <InlineMath math="u" /> values keeps the work cleaner.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Definite Form">
          <MathBlock math="\int_a^b f(g(x))g'(x)\,dx = \int_{g(a)}^{g(b)} f(u)\,du" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="integration-by-parts">6.2 Integration by Parts</NoteSubSectionTitle>
      <NoteParagraph>
        Integration by parts reverses the product rule. It is useful when an integrand is a product and differentiating one factor makes the problem simpler.
      </NoteParagraph>
      <NoteParagraph>
        A good choice of <InlineMath math="u" /> should usually become simpler after differentiation.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Parts Formula">
          <MathBlock math="\int u\,dv = uv - \int v\,du" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="trig-integrals">6.3 Trig Integrals</NoteSubSectionTitle>
      <NoteParagraph>
        Trig integrals rely on identities. The goal is often to rewrite powers of sine, cosine, tangent, or secant until a substitution becomes visible.
      </NoteParagraph>
      <NoteParagraph>
        Odd powers usually let us save one factor for <InlineMath math="du" />. Even powers often need power-reduction identities.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Common Identity">
          <MathBlock math="\sin^2 x + \cos^2 x = 1" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="trig-substitution">6.4 Trig Substitution</NoteSubSectionTitle>
      <NoteParagraph>
        Trig substitution uses right-triangle identities to simplify square roots involving expressions like <InlineMath math="a^2-x^2" />, <InlineMath math="a^2+x^2" />, or <InlineMath math="x^2-a^2" />.
      </NoteParagraph>
      <NoteParagraph>
        It works because trig identities can turn a messy radical into a simpler trig expression.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Common Substitutions">
          <MathBlock math="\sqrt{a^2-x^2}: x=a\sin\theta" />
          <MathBlock math="\sqrt{a^2+x^2}: x=a\tan\theta" />
          <MathBlock math="\sqrt{x^2-a^2}: x=a\sec\theta" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="partial-fractions">6.5 Partial Fractions</NoteSubSectionTitle>
      <NoteParagraph>
        Partial fractions turn one complicated rational function into several simpler rational functions. It is basically factoring for integration.
      </NoteParagraph>
      <NoteParagraph>
        The technique works best after the denominator is factored and the degree of the numerator is smaller than the degree of the denominator.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Simple Pattern">
          <MathBlock math="\frac{1}{(x-a)(x-b)} = \frac{A}{x-a}+\frac{B}{x-b}" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="improper-integrals">6.6 Improper Integrals</NoteSubSectionTitle>
      <NoteParagraph>
        Improper integrals extend definite integrals to infinite intervals or functions with infinite behavior. Because the usual bounds are not ordinary numbers, we use limits.
      </NoteParagraph>
      <NoteParagraph>
        The integral converges only if the limit settles to a finite value.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Limit Definition">
          <MathBlock math="\int_a^\infty f(x)\,dx = \lim_{b \to \infty}\int_a^b f(x)\,dx" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="numerical-integration">6.7 Numerical Integration</NoteSubSectionTitle>
      <NoteParagraph>
        Numerical integration approximates accumulation when an exact antiderivative is difficult or unnecessary. We replace the curve with simpler shapes whose areas are easy to compute.
      </NoteParagraph>
      <NoteParagraph>
        Midpoint and trapezoidal rules are both Riemann-sum ideas with smarter sample choices.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Trapezoidal Rule">
          <MathBlock math="\int_a^b f(x)\,dx \approx \frac{\Delta x}{2}\left(f(x_0)+2f(x_1)+\cdots+2f(x_{n-1})+f(x_n)\right)" />
          <NoteParagraph className="mb-0">
            The points <InlineMath math="x_0,\ldots,x_n" /> split the interval into equal pieces, and <InlineMath math="\Delta x" /> is the common width.
            The middle heights are doubled because each interior point belongs to two neighboring trapezoids.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="inverse-trig-antiderivatives">6.8 Inverse Trig Antiderivatives</NoteSubSectionTitle>
      <NoteParagraph>
        Some integrals turn into inverse trig functions because their denominators encode circle geometry. These forms are worth recognizing because substitution often only gets you to the doorway.
      </NoteParagraph>
      <NoteParagraph>
        The square root or quadratic expression tells you which inverse trig function is hiding underneath.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Common Forms">
          <MathBlock math="\int \frac{1}{\sqrt{a^2-x^2}}\,dx=\arcsin\left(\frac{x}{a}\right)+C" />
          <MathBlock math="\int \frac{1}{a^2+x^2}\,dx=\frac{1}{a}\arctan\left(\frac{x}{a}\right)+C" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="reduction-formulas">6.9 Reduction Formulas</NoteSubSectionTitle>
      <NoteParagraph>
        Reduction formulas turn a hard integral into a similar but simpler one. They are most useful when a family of integrals repeats with changing powers.
      </NoteParagraph>
      <NoteParagraph>
        The point is not to memorize every formula, but to notice when integration by parts can create a recurrence.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Recurrence Form">
          <MathBlock math="I_n=\int f_n(x)\,dx \qquad \Rightarrow \qquad I_n=\text{simpler terms involving } I_{n-1}\text{ or }I_{n-2}" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      {/* 7. INTEGRAL APPLICATIONS SECTION */}
      <NoteSectionTitle id="integral-applications">7. Integral Applications</NoteSectionTitle>
      <NoteParagraph>
        Integral applications all share the same structure: identify a tiny piece, write its contribution, then accumulate those pieces over the interval.
      </NoteParagraph>
      <NoteParagraph>
        This is why integrals show up in area, volume, work, motion, and average value. They are all total effects built from local pieces.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Notation to Know">
          <NoteParagraph>
            A formula like <InlineMath math="A(x)" /> or <InlineMath math="R(x)" /> means the area or radius depends on position.
            Uppercase <InlineMath math="R" /> usually means an outer radius, while lowercase <InlineMath math="r" /> often means an inner radius.
          </NoteParagraph>
          <NoteParagraph className="mb-0">
            For physical applications, <InlineMath math="F(x)" /> is force at position <InlineMath math="x" />, <InlineMath math="W" /> is work, and <InlineMath math="v(t)" /> is velocity as a function of time.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-start mb-8">
        <div>
          <ul className={graphListClassName}>
            <li style={{ color: graphColors.blue }}><InlineMath math="y=4-x^2" /></li>
            <li style={{ color: graphColors.red }}><InlineMath math="y=x+2" /></li>
            <li style={{ color: graphColors.green }}>shaded region: accumulated slice area</li>
            <li style={{ color: graphColors.orange }}>vertical slices: <InlineMath math="\text{top}-\text{bottom}" /></li>
            <li style={{ color: graphColors.violet }}>endpoints set the bounds</li>
          </ul>
          <NoteParagraph>
            Area between curves is easiest when we stop thinking of it as a whole shape and instead look at one vertical slice.
            Here the curves meet at <InlineMath math="x=-2" /> and <InlineMath math="x=1" />, and each slice has height <InlineMath math="(4-x^2)-(x+2)" />.
          </NoteParagraph>
        </div>

        <div className={`p-1 rounded-xl border ${isDarkMode ? 'bg-black/50 border-green-500/30' : 'bg-slate-50 border-slate-200'}`}>
          <div className="rounded-lg overflow-hidden" style={mafsStyle}>
            <Mafs viewBox={{ x: [-2.5, 1.5], y: [-0.5, 4.5] }} height={300} zoom>
              <Coordinates.Cartesian />
              <Polygon
                points={[[-2, 0], [-1.5, 1.75], [-1, 3], [-0.5, 3.75], [0, 4], [0.5, 3.75], [1, 3]]}
                color={Theme.green}
                fillOpacity={0.25}
              />
              <Plot.OfX y={(x) => 4 - x ** 2} domain={[-2, 1]} color={Theme.blue} />
              <Plot.OfX y={(x) => x + 2} domain={[-2, 1]} color={Theme.red} />
              <Line.Segment point1={[-1.5, 0.5]} point2={[-1.5, 1.75]} color={Theme.orange} opacity={0.9} />
              <Line.Segment point1={[-0.5, 1.5]} point2={[-0.5, 3.75]} color={Theme.orange} opacity={0.9} />
              <Line.Segment point1={[0.5, 2.5]} point2={[0.5, 3.75]} color={Theme.orange} opacity={0.9} />
              <Point x={-2} y={0} color={Theme.violet} />
              <Point x={1} y={3} color={Theme.violet} />
            </Mafs>
          </div>
        </div>
      </div>

      <NoteSubSectionTitle id="area-under-a-curve">7.1 Area Under a Curve</NoteSubSectionTitle>
      <NoteParagraph>
        Area under a curve is the most visual integral application. When the function is nonnegative, the definite integral matches ordinary area.
      </NoteParagraph>
      <NoteParagraph>
        When the function crosses the axis, the integral gives signed area, so total geometric area may require absolute value or splitting the interval.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Area">
          <MathBlock math="\text{Area} = \int_a^b f(x)\,dx \qquad \text{when } f(x) \ge 0" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="area-between-curves">7.2 Area Between Curves</NoteSubSectionTitle>
      <NoteParagraph>
        Area between curves accumulates vertical or horizontal slices. The slice length is top minus bottom, or right minus left, depending on the orientation.
      </NoteParagraph>
      <NoteParagraph>
        The hard part is often not the integral. It is deciding which function is on top and where the curves intersect.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Vertical Slices">
          <MathBlock math="\text{Area} = \int_a^b \left(\text{top}-\text{bottom}\right)\,dx" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="average-value">7.3 Average Value</NoteSubSectionTitle>
      <NoteParagraph>
        Average value spreads the total accumulation evenly across the interval. It asks what constant height would create the same integral.
      </NoteParagraph>
      <NoteParagraph>
        This is the integral version of an arithmetic average.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Average Value">
          <MathBlock math="f_{\text{avg}} = \frac{1}{b-a}\int_a^b f(x)\,dx" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="volumes-by-slicing">7.4 Volumes by Slicing</NoteSubSectionTitle>
      <NoteParagraph>
        Volumes by slicing work by stacking cross-sectional areas. Each thin slice has volume approximately area times thickness.
      </NoteParagraph>
      <NoteParagraph>
        Once we know the cross-sectional area as a function of position, the integral does the stacking.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Slice Volume">
          <MathBlock math="V = \int_a^b A(x)\,dx" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="disk-method">7.5 Disk Method</NoteSubSectionTitle>
      <NoteParagraph>
        The disk method finds volumes created by rotating a region around an axis. Each slice becomes a circular disk.
      </NoteParagraph>
      <NoteParagraph>
        The radius is the distance from the axis of rotation to the curve.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Disk Volume">
          <MathBlock math="V = \pi\int_a^b R(x)^2\,dx" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="washer-method">7.6 Washer Method</NoteSubSectionTitle>
      <NoteParagraph>
        The washer method is the disk method with a hole. Each slice rotates into a washer, so we subtract the inner disk from the outer disk.
      </NoteParagraph>
      <NoteParagraph>
        It is useful when the region does not touch the axis of rotation.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Washer Volume">
          <MathBlock math="V = \pi\int_a^b \left(R(x)^2-r(x)^2\right)\,dx" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="shell-method">7.7 Shell Method</NoteSubSectionTitle>
      <NoteParagraph>
        The shell method stacks cylindrical shells instead of disks. Each shell has circumference, height, and thickness.
      </NoteParagraph>
      <NoteParagraph>
        Shells are often cleaner when slices run parallel to the axis of rotation.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Shell Volume">
          <MathBlock math="V = 2\pi\int_a^b \left(\text{radius}\right)\left(\text{height}\right)\,dx" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="arc-length">7.8 Arc Length</NoteSubSectionTitle>
      <NoteParagraph>
        Arc length adds up tiny straight-line distances along a curve. The derivative appears because each small step has horizontal and vertical change.
      </NoteParagraph>
      <NoteParagraph>
        The formula is just the Pythagorean theorem applied infinitely many times.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Length of a Graph">
          <MathBlock math="L = \int_a^b \sqrt{1+\left(f'(x)\right)^2}\,dx" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="surface-area">7.9 Surface Area</NoteSubSectionTitle>
      <NoteParagraph>
        Surface area of revolution adds up tiny bands around a rotated curve. Each band behaves like circumference times arc length.
      </NoteParagraph>
      <NoteParagraph>
        The radius comes from the distance to the axis, while the arc length piece measures the slant of the curve.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Surface of Revolution">
          <MathBlock math="S = 2\pi\int_a^b r(x)\sqrt{1+\left(f'(x)\right)^2}\,dx" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="work">7.10 Work</NoteSubSectionTitle>
      <NoteParagraph>
        Work accumulates force over distance. If the force changes, we cannot use one simple multiplication, so we integrate the changing force.
      </NoteParagraph>
      <NoteParagraph>
        The small piece is force times a tiny displacement.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Variable Force">
          <MathBlock math="W = \int_a^b F(x)\,dx" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="motion-with-integrals">7.11 Motion with Integrals</NoteSubSectionTitle>
      <NoteParagraph>
        Integrals reverse the motion chain. Velocity accumulates into displacement, and speed accumulates into total distance traveled.
      </NoteParagraph>
      <NoteParagraph>
        This distinction matters: displacement remembers direction, while total distance does not.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Motion Accumulation">
          <MathBlock math="s(b)-s(a)=\int_a^b v(t)\,dt \qquad \text{distance}=\int_a^b |v(t)|\,dt" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      {/* 8. DIFFERENTIAL EQUATIONS SECTION */}
      <NoteSectionTitle id="differential-equations">8. Differential Equations</NoteSectionTitle>
      <NoteParagraph>
        A differential equation is an equation about an unknown function and its derivatives. Instead of describing a quantity directly, it describes how the quantity changes.
      </NoteParagraph>
      <NoteParagraph>
        This is why differential equations are so useful in modeling. A rule for change can determine an entire system.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Notation to Know">
          <NoteParagraph>
            A prime, as in <InlineMath math="y'" />, means derivative. The notation <InlineMath math="\frac{dy}{dt}" /> means the rate of change of <InlineMath math="y" /> with respect to time <InlineMath math="t" />, while <InlineMath math="\frac{dy}{dx}" /> means with respect to <InlineMath math="x" />.
          </NoteParagraph>
          <NoteParagraph className="mb-0">
            Constants like <InlineMath math="k" /> often control growth rate, <InlineMath math="L" /> often marks a carrying capacity, and <InlineMath math="\mu(x)" /> is commonly used for an integrating factor.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-start mb-8">
        <div>
          <ul className={graphListClassName}>
            <li style={{ color: graphColors.green }}><InlineMath math="\frac{dy}{dt}=y(1-\frac{y}{4})" /></li>
            <li style={{ color: graphColors.blue }}>solution curve following the slope field</li>
            <li style={{ color: graphColors.asymptote }}>equilibrium levels where change stops</li>
          </ul>
          <NoteParagraph>
            A differential equation does not first give us the curve. It gives us the local direction everywhere, and the solution curve follows those directions.
          </NoteParagraph>
        </div>

        <div className={`p-1 rounded-xl border ${isDarkMode ? 'bg-black/50 border-green-500/30' : 'bg-slate-50 border-slate-200'}`}>
          <div className="rounded-lg overflow-hidden" style={dottedMafsStyle}>
            <Mafs viewBox={{ x: [-4, 4], y: [-1, 5] }} height={300} zoom>
              <Coordinates.Cartesian />
              <Plot.VectorField xy={([, y]) => [1, y * (1 - y / 4)]} step={1} color={Theme.green} />
              <Plot.OfX y={(x) => 4 / (1 + 3 * Math.exp(-x))} color={Theme.blue} />
              <Line.PointSlope point={[0, 0]} slope={0} color={graphColors.asymptote} style="dashed" opacity={0.8} />
              <Line.PointSlope point={[0, 4]} slope={0} color={graphColors.asymptote} style="dashed" opacity={0.8} />
            </Mafs>
          </div>
        </div>
      </div>

      <NoteSubSectionTitle id="differential-equation-basics">8.1 Differential Equation Basics</NoteSubSectionTitle>
      <NoteParagraph>
        A differential equation asks us to find a function that makes a rate statement true. The solution is not usually a number; it is a whole function or family of functions.
      </NoteParagraph>
      <NoteParagraph>
        The order of the equation is the highest derivative that appears.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Example">
          <MathBlock math="\frac{dy}{dx}=3x^2 \qquad \Rightarrow \qquad y=x^3+C" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="verifying-solutions">8.2 Verifying Solutions</NoteSubSectionTitle>
      <NoteParagraph>
        Verifying a solution means substituting the proposed function and its derivatives back into the differential equation. If both sides agree, the function is a solution.
      </NoteParagraph>
      <NoteParagraph>
        This is often easier than solving because it only checks consistency.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Verification Step">
          <NoteParagraph>
            Differentiate the proposed solution, plug it in, and see whether the equation becomes true.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="slope-fields">8.3 Slope Fields</NoteSubSectionTitle>
      <NoteParagraph>
        Slope fields draw tiny line segments that show the derivative at many points. Each segment tells the direction a solution curve would follow if it passed through that point.
      </NoteParagraph>
      <NoteParagraph>
        They let us understand a differential equation visually before solving it exactly.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Visual Reading">
          <NoteParagraph>
            A solution curve should flow along the local slopes like a path through a direction map.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="separable-equations">8.4 Separable Equations</NoteSubSectionTitle>
      <NoteParagraph>
        A separable equation lets us move all <InlineMath math="y" /> terms to one side and all <InlineMath math="x" /> terms to the other. Then both sides can be integrated.
      </NoteParagraph>
      <NoteParagraph>
        This is one of the cleanest differential equation forms because it reduces solving to integration.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Separation">
          <MathBlock math="\frac{dy}{dx}=g(x)h(y) \qquad \Rightarrow \qquad \frac{1}{h(y)}\,dy = g(x)\,dx" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="exponential-growth-and-decay">8.5 Exponential Growth and Decay</NoteSubSectionTitle>
      <NoteParagraph>
        Exponential growth and decay happen when a quantity changes at a rate proportional to its current size. More current amount means more future change.
      </NoteParagraph>
      <NoteParagraph>
        The sign of the constant determines whether the system grows or decays.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Proportional Change">
          <MathBlock math="\frac{dy}{dt}=ky \qquad \Rightarrow \qquad y=Ce^{kt}" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="logistic-growth">8.6 Logistic Growth</NoteSubSectionTitle>
      <NoteParagraph>
        Logistic growth starts like exponential growth but slows as the quantity approaches a carrying capacity. The environment pushes back as the system gets crowded.
      </NoteParagraph>
      <NoteParagraph>
        This makes an S-shaped curve: fast growth in the middle, slow growth near the limit.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Carrying Capacity Model">
          <MathBlock math="\frac{dy}{dt}=ky\left(1-\frac{y}{L}\right)" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="first-order-equations">8.7 First-Order Equations</NoteSubSectionTitle>
      <NoteParagraph>
        First-order equations involve the first derivative but no higher derivatives. They model systems where the current rate depends on the current state and input.
      </NoteParagraph>
      <NoteParagraph>
        Linear first-order equations have a standard structure that can be solved with an integrating factor.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Linear Form">
          <MathBlock math="y' + p(x)y = q(x)" />
          <MathBlock math="\mu(x)=e^{\int p(x)\,dx}" />
          <NoteParagraph className="mb-0">
            The functions <InlineMath math="p(x)" /> and <InlineMath math="q(x)" /> are known functions of <InlineMath math="x" />.
            The integrating factor <InlineMath math="\mu(x)" /> is chosen to turn the left side into the derivative of a product.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="second-order-linear-equations">8.8 Second-Order Linear Equations</NoteSubSectionTitle>
      <NoteParagraph>
        Second-order linear equations involve a function, its first derivative, and its second derivative. They often describe systems with position, velocity, and acceleration all interacting.
      </NoteParagraph>
      <NoteParagraph>
        Springs, oscillations, and waves naturally lead to this kind of equation.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Common Form">
          <MathBlock math="ay''+by'+cy=g(x)" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="characteristic-equations">8.9 Characteristic Equations</NoteSubSectionTitle>
      <NoteParagraph>
        Characteristic equations turn certain differential equations into algebra problems. For constant-coefficient homogeneous equations, we guess exponential solutions and solve for the possible growth rates.
      </NoteParagraph>
      <NoteParagraph>
        The roots tell us the shape of the solution: exponential, repeated exponential, or oscillatory.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Homogeneous Constant Coefficients">
          <MathBlock math="ay''+by'+cy=0 \qquad \Rightarrow \qquad ar^2+br+c=0" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="laplace-transforms">8.10 Laplace Transforms</NoteSubSectionTitle>
      <NoteParagraph>
        Laplace transforms convert functions of time into functions of a new variable. The main benefit is that differentiation becomes algebra.
      </NoteParagraph>
      <NoteParagraph>
        This is especially useful for initial value problems, systems with sudden forcing, and equations where differentiation is easier to manage after transforming the problem.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Transform Definition">
          <MathBlock math="\mathcal{L}\{f(t)\}=\int_0^\infty e^{-st}f(t)\,dt" />
          <MathBlock math="\mathcal{L}\{f'(t)\}=sF(s)-f(0)" />
          <NoteParagraph className="mb-0">
            The notation <InlineMath math="\mathcal{L}\{\cdot\}" /> means "take the Laplace transform." If <InlineMath math="F(s)" /> appears, it means the transform of <InlineMath math="f(t)" />.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="eulers-method">8.11 Euler's Method</NoteSubSectionTitle>
      <NoteParagraph>
        Euler's method approximates a solution curve by repeatedly following the slope field for a small step. It is the tangent-line idea applied over and over.
      </NoteParagraph>
      <NoteParagraph>
        Smaller step sizes usually improve the approximation, and more refined numerical methods build on the same local-slope intuition.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Step Update">
          <MathBlock math="y_{n+1}=y_n+h\,f(t_n,y_n)" />
          <NoteParagraph className="mb-0">
            The pair <InlineMath math="(t_n,y_n)" /> is the current approximate point, <InlineMath math="h" /> is the step size, and <InlineMath math="f(t_n,y_n)" /> is the slope supplied by the differential equation.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="exact-differential-equations">8.12 Exact Differential Equations</NoteSubSectionTitle>
      <NoteParagraph>
        Exact equations hide a potential function. Instead of solving for a derivative directly, we look for a function whose total differential matches the equation.
      </NoteParagraph>
      <NoteParagraph>
        This connects differential equations to gradients: the equation is solvable by recovering the underlying potential.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Exactness Check">
          <MathBlock math="M(x,y)\,dx+N(x,y)\,dy=0 \qquad \frac{\partial M}{\partial y}=\frac{\partial N}{\partial x}" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="systems-and-phase-portraits">8.13 Systems and Phase Portraits</NoteSubSectionTitle>
      <NoteParagraph>
        Systems of differential equations track several quantities changing together. A phase portrait shows the direction of motion in state space instead of graphing one output against time.
      </NoteParagraph>
      <NoteParagraph>
        This is essential when feedback loops matter, because the current state of one variable can change the future of another.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Linear System">
          <MathBlock math="\vec{x}\,'=A\vec{x}" />
          <NoteParagraph className="mb-0">
            Here <InlineMath math="\vec{x}" /> is a vector of state variables, <InlineMath math="\vec{x}\,'" /> is its derivative, and <InlineMath math="A" /> is a matrix describing how the variables influence each other.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      {/* 9. PARAMETRIC EQUATIONS SECTION */}
      <NoteSectionTitle id="parametric-equations">9. Parametric Equations</NoteSectionTitle>
      <NoteParagraph>
        Parametric equations describe a curve by letting another variable, often time, control both coordinates. Instead of <InlineMath math="y" /> being directly tied to <InlineMath math="x" />, both are tied to <InlineMath math="t" />.
      </NoteParagraph>
      <NoteParagraph>
        This is a natural fit for motion because position in the plane is usually changing in more than one direction at once.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Notation to Know">
          <NoteParagraph>
            In <InlineMath math="x=x(t)" /> and <InlineMath math="y=y(t)" />, the parameter <InlineMath math="t" /> controls both coordinates.
            It is often time, but it can be any variable that traces the curve.
          </NoteParagraph>
          <NoteParagraph className="mb-0">
            The derivatives <InlineMath math="\frac{dx}{dt}" /> and <InlineMath math="\frac{dy}{dt}" /> are coordinate rates, while <InlineMath math="\frac{dy}{dx}" /> is the slope of the drawn curve.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-start mb-8">
        <div>
          <ul className={graphListClassName}>
            <li style={{ color: graphColors.blue }}><InlineMath math="\vec r(t)=\langle \cos t,\sin t\rangle" /></li>
            <li style={{ color: graphColors.green }}>position at a particular value of <InlineMath math="t" /></li>
            <li style={{ color: graphColors.orange }}>velocity direction along the path</li>
          </ul>
          <NoteParagraph>
            Parametric equations remember the path and how the path is traveled. A Cartesian equation can show the circle, but the parameter tells us direction and timing.
          </NoteParagraph>
        </div>

        <div className={`p-1 rounded-xl border ${isDarkMode ? 'bg-black/50 border-green-500/30' : 'bg-slate-50 border-slate-200'}`}>
          <div className="rounded-lg overflow-hidden" style={mafsStyle}>
            <Mafs viewBox={{ x: [-1.5, 1.5], y: [-1.5, 1.5] }} height={300} zoom>
              <Coordinates.Cartesian />
              <Plot.Parametric xy={(t) => [Math.cos(t), Math.sin(t)]} domain={[0, 2 * Math.PI]} color={Theme.blue} />
              <Point x={Math.SQRT1_2} y={Math.SQRT1_2} color={Theme.green} />
              <Vector
                tail={[Math.SQRT1_2, Math.SQRT1_2]}
                tip={[Math.SQRT1_2 - 0.55 * Math.SQRT1_2, Math.SQRT1_2 + 0.55 * Math.SQRT1_2]}
                color={Theme.orange}
              />
            </Mafs>
          </div>
        </div>
      </div>

      <NoteSubSectionTitle id="parametric-curves">9.1 Parametric Curves</NoteSubSectionTitle>
      <NoteParagraph>
        A parametric curve is traced as <InlineMath math="t" /> changes. Each value of <InlineMath math="t" /> gives a point <InlineMath math="(x(t),y(t))" />.
      </NoteParagraph>
      <NoteParagraph>
        The same geometric curve can be traced at different speeds or in different directions depending on the parameterization.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Parametric Form">
          <MathBlock math="x=x(t) \qquad y=y(t)" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="eliminating-the-parameter">9.2 Eliminating the Parameter</NoteSubSectionTitle>
      <NoteParagraph>
        Eliminating the parameter rewrites a parametric curve as a more familiar Cartesian equation. This helps identify the shape, but it can lose information about direction and timing.
      </NoteParagraph>
      <NoteParagraph>
        The graph is not just the equation; the parameter tells how the graph is traveled.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Example">
          <MathBlock math="x=t^2,\ y=t \qquad \Rightarrow \qquad x=y^2" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="parametric-derivatives">9.3 Parametric Derivatives</NoteSubSectionTitle>
      <NoteParagraph>
        For parametric curves, slope compares how <InlineMath math="y" /> changes with respect to <InlineMath math="t" /> against how <InlineMath math="x" /> changes with respect to <InlineMath math="t" />.
      </NoteParagraph>
      <NoteParagraph>
        This is a chain rule idea: <InlineMath math="dy/dx" /> is the rate of <InlineMath math="y" /> per unit <InlineMath math="x" />, even though both are moving through <InlineMath math="t" />.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Parametric Slope">
          <MathBlock math="\frac{dy}{dx}=\frac{dy/dt}{dx/dt}" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="tangent-lines-1">9.4 Tangent Lines</NoteSubSectionTitle>
      <NoteParagraph>
        A tangent line to a parametric curve uses the point at a given parameter value and the slope computed from the parametric derivative.
      </NoteParagraph>
      <NoteParagraph>
        If <InlineMath math="dx/dt=0" /> while <InlineMath math="dy/dt" /> is not zero, the tangent is vertical.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="At Time t = a">
          <MathBlock math="y-y(a)=\left.\frac{dy/dt}{dx/dt}\right|_{t=a}(x-x(a))" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="parametric-arc-length">9.5 Parametric Arc Length</NoteSubSectionTitle>
      <NoteParagraph>
        Parametric arc length adds up tiny motion steps. Since both <InlineMath math="x" /> and <InlineMath math="y" /> change with time, each small distance comes from the Pythagorean theorem.
      </NoteParagraph>
      <NoteParagraph>
        This is the same arc length idea, but written in terms of the parameter.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Length">
          <MathBlock math="L=\int_a^b \sqrt{\left(\frac{dx}{dt}\right)^2+\left(\frac{dy}{dt}\right)^2}\,dt" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="motion-with-parametric-equations">9.6 Motion with Parametric Equations</NoteSubSectionTitle>
      <NoteParagraph>
        Parametric equations turn position into a pair of functions. Velocity and acceleration are found by differentiating each coordinate with respect to time.
      </NoteParagraph>
      <NoteParagraph>
        Speed is the magnitude of the velocity vector, not just one coordinate's rate of change.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Planar Motion">
          <MathBlock math="\vec{v}(t)=\langle x'(t),y'(t)\rangle \qquad \text{speed}=\sqrt{(x'(t))^2+(y'(t))^2}" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="second-derivatives-for-parametric-curves">9.7 Second Derivatives for Parametric Curves</NoteSubSectionTitle>
      <NoteParagraph>
        The second derivative of a parametric curve measures how the Cartesian slope changes as the curve moves. Since slope is already a ratio of time rates, we differentiate it with respect to time and then convert back to change per unit <InlineMath math="x" />.
      </NoteParagraph>
      <NoteParagraph>
        This keeps concavity tied to the drawn curve rather than to the parameter itself.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Parametric Concavity">
          <MathBlock math="\frac{d^2y}{dx^2}=\frac{\frac{d}{dt}\left(\frac{dy}{dx}\right)}{dx/dt}" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="area-with-parametric-curves">9.8 Area with Parametric Curves</NoteSubSectionTitle>
      <NoteParagraph>
        Parametric area still accumulates height times horizontal change. The only difference is that horizontal change is controlled by <InlineMath math="dx/dt" />.
      </NoteParagraph>
      <NoteParagraph>
        Orientation matters: if the curve moves right-to-left, the signed area changes sign.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Parametric Area">
          <MathBlock math="A=\int y\,dx=\int_a^b y(t)x'(t)\,dt" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      {/* 10. POLAR COORDINATES SECTION */}
      <NoteSectionTitle id="polar-coordinates">10. Polar Coordinates</NoteSectionTitle>
      <NoteParagraph>
        Polar coordinates describe points by distance and angle instead of horizontal and vertical displacement. They are especially natural for circular or radial behavior.
      </NoteParagraph>
      <NoteParagraph>
        Instead of asking where the point is on an <InlineMath math="x" /> and <InlineMath math="y" /> grid, we ask how far it is from the origin and in what direction.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Notation to Know">
          <NoteParagraph>
            In <InlineMath math="(r,\theta)" />, <InlineMath math="r" /> is the signed distance from the origin and <InlineMath math="\theta" /> is the angle from the positive <InlineMath math="x" />-axis. The symbol <InlineMath math="\theta" /> is pronounced "theta."
          </NoteParagraph>
          <NoteParagraph className="mb-0">
            Bounds like <InlineMath math="\alpha" /> and <InlineMath math="\beta" /> are angle bounds. They play the same role as <InlineMath math="a" /> and <InlineMath math="b" /> in Cartesian integrals.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-start mb-8">
        <div>
          <ul className={graphListClassName}>
            <li style={{ color: graphColors.blue }}><InlineMath math="r=1+\cos\theta" /></li>
            <li style={{ color: graphColors.green }}>radius grows and shrinks as the angle moves</li>
          </ul>
          <NoteParagraph>
            Polar graphs are best read by watching the radius change with the angle. The same equation can feel strange in <InlineMath math="x,y" /> form but simple in radial language.
          </NoteParagraph>
        </div>

        <div className={`p-1 rounded-xl border ${isDarkMode ? 'bg-black/50 border-green-500/30' : 'bg-slate-50 border-slate-200'}`}>
          <div className="rounded-lg overflow-hidden" style={mafsStyle}>
            <Mafs viewBox={{ x: [-0.75, 2.25], y: [-1.5, 1.5] }} height={300} zoom>
              <Coordinates.Polar />
              <Plot.Parametric
                xy={(theta) => {
                  const r = 1 + Math.cos(theta);
                  return [r * Math.cos(theta), r * Math.sin(theta)];
                }}
                domain={[0, 2 * Math.PI]}
                color={Theme.blue}
              />
              <Vector tail={[0, 0]} tip={[Math.SQRT1_2 + 0.5, Math.SQRT1_2 + 0.5]} color={Theme.green} />
            </Mafs>
          </div>
        </div>
      </div>

      <NoteSubSectionTitle id="polar-coordinates-1">10.1 Polar Coordinates</NoteSubSectionTitle>
      <NoteParagraph>
        A polar point has the form <InlineMath math="(r,\theta)" />. The value <InlineMath math="r" /> gives distance from the origin, and <InlineMath math="\theta" /> gives the angle from the positive <InlineMath math="x" />-axis.
      </NoteParagraph>
      <NoteParagraph>
        Negative radius values move in the opposite direction of the angle, which is why polar graphs can have multiple representations for the same point.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Point Description">
          <MathBlock math="(r,\theta)" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="converting-between-polar-and-cartesian">10.2 Converting Between Polar and Cartesian</NoteSubSectionTitle>
      <NoteParagraph>
        Conversion comes from right-triangle relationships. Polar coordinates are just Cartesian coordinates viewed through radius and angle.
      </NoteParagraph>
      <NoteParagraph>
        These identities let us move between whichever coordinate system makes the problem easier.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Conversion Rules">
          <MathBlock math="x=r\cos\theta \qquad y=r\sin\theta \qquad r^2=x^2+y^2" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="polar-graphs">10.3 Polar Graphs</NoteSubSectionTitle>
      <NoteParagraph>
        A polar graph is traced by letting the angle move and allowing the radius to change with it. The graph often reveals symmetry because angles naturally wrap around the origin.
      </NoteParagraph>
      <NoteParagraph>
        The shape is best understood by asking how far from the origin the graph is at important angles.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Polar Function">
          <MathBlock math="r=f(\theta)" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="polar-derivatives">10.4 Polar Derivatives</NoteSubSectionTitle>
      <NoteParagraph>
        Polar derivatives treat a polar curve as a parametric curve in disguise. Since <InlineMath math="x" /> and <InlineMath math="y" /> both depend on <InlineMath math="\theta" />, we use the parametric slope idea.
      </NoteParagraph>
      <NoteParagraph>
        The derivative still means slope in the Cartesian plane.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Slope from Polar Form">
          <MathBlock math="\frac{dy}{dx}=\frac{\frac{dr}{d\theta}\sin\theta+r\cos\theta}{\frac{dr}{d\theta}\cos\theta-r\sin\theta}" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="area-in-polar-coordinates">10.5 Area in Polar Coordinates</NoteSubSectionTitle>
      <NoteParagraph>
        Polar area comes from adding tiny sectors instead of rectangles. A thin sector has area proportional to radius squared and angle width.
      </NoteParagraph>
      <NoteParagraph>
        This is why the formula has a factor of <InlineMath math="\frac{1}{2}" />.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Polar Area">
          <MathBlock math="A=\frac{1}{2}\int_\alpha^\beta r(\theta)^2\,d\theta" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="arc-length-in-polar-coordinates">10.6 Arc Length in Polar Coordinates</NoteSubSectionTitle>
      <NoteParagraph>
        Polar arc length combines radial change and angular sweep. A small movement can come from the radius changing, the angle changing, or both.
      </NoteParagraph>
      <NoteParagraph>
        The formula is another Pythagorean distance calculation written in polar language.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Polar Length">
          <MathBlock math="L=\int_\alpha^\beta \sqrt{r(\theta)^2+\left(\frac{dr}{d\theta}\right)^2}\,d\theta" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="polar-symmetry-and-intersections">10.7 Polar Symmetry and Intersections</NoteSubSectionTitle>
      <NoteParagraph>
        Polar curves can hit the same point in more than one way because angles wrap around and negative radii point backward. This makes intersections more subtle than simply setting two formulas equal.
      </NoteParagraph>
      <NoteParagraph>
        Symmetry checks help reduce the work and also explain why many polar graphs form petals, loops, and repeated shapes.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Same Point, Different Names">
          <MathBlock math="(r,\theta)=(-r,\theta+\pi)=(r,\theta+2\pi)" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      {/* 11. VECTOR-VALUED FUNCTIONS SECTION */}
      <NoteSectionTitle id="vector-valued-functions">11. Vector-Valued Functions</NoteSectionTitle>
      <NoteParagraph>
        Vector-valued functions output vectors instead of single numbers. They are a clean way to describe curves, motion, and changing positions in the plane or space.
      </NoteParagraph>
      <NoteParagraph>
        The derivative of a vector-valued function is found component by component, but the result has geometric meaning as direction and speed.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Notation to Know">
          <NoteParagraph>
            A symbol with an arrow, like <InlineMath math="\vec{r}" />, represents a vector. Angle brackets such as <InlineMath math="\langle x(t),y(t)\rangle" /> list the vector's components.
          </NoteParagraph>
          <NoteParagraph className="mb-0">
            Double bars <InlineMath math="\|\vec{v}\|" /> mean magnitude or length. The letters <InlineMath math="\vec{T}" />, <InlineMath math="\vec{N}" />, and <InlineMath math="\vec{B}" /> stand for tangent, normal, and binormal directions.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-start mb-8">
        <div>
          <ul className={graphListClassName}>
            <li style={{ color: graphColors.blue }}><InlineMath math="\vec r(t)=\langle t,\sin t\rangle" /></li>
            <li style={{ color: graphColors.orange }}>velocity vector tangent to the curve</li>
            <li style={{ color: graphColors.green }}>position at one moment</li>
          </ul>
          <NoteParagraph>
            Vector-valued functions let us treat a curve as motion. The derivative is not just a slope; it is the direction and speed of travel through the plane.
          </NoteParagraph>
        </div>

        <div className={`p-1 rounded-xl border ${isDarkMode ? 'bg-black/50 border-green-500/30' : 'bg-slate-50 border-slate-200'}`}>
          <div className="rounded-lg overflow-hidden" style={mafsStyle}>
            <Mafs viewBox={{ x: [-4, 4], y: [-2, 2] }} height={300} zoom>
              <Coordinates.Cartesian />
              <Plot.Parametric xy={(t) => [t, Math.sin(t)]} domain={[-Math.PI, Math.PI]} color={Theme.blue} />
              <Point x={1} y={Math.sin(1)} color={Theme.green} />
              <Vector tail={[1, Math.sin(1)]} tip={[1.8, Math.sin(1) + 0.8 * Math.cos(1)]} color={Theme.orange} />
            </Mafs>
          </div>
        </div>
      </div>

      <NoteSubSectionTitle id="vector-valued-functions-1">11.1 Vector-Valued Functions</NoteSubSectionTitle>
      <NoteParagraph>
        A vector-valued function packages coordinates into one object. Instead of writing separate equations for <InlineMath math="x" />, <InlineMath math="y" />, and maybe <InlineMath math="z" />, we write one vector function.
      </NoteParagraph>
      <NoteParagraph>
        This keeps the geometry and the motion together.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Vector Function">
          <MathBlock math="\vec{r}(t)=\langle x(t),y(t),z(t)\rangle" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="position-velocity-and-acceleration">11.2 Position, Velocity, and Acceleration</NoteSubSectionTitle>
      <NoteParagraph>
        Position gives location, velocity gives how location changes, and acceleration gives how velocity changes. Each derivative moves one step down this chain.
      </NoteParagraph>
      <NoteParagraph>
        Because these are vectors, direction matters as much as magnitude.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Motion Chain">
          <MathBlock math="\vec{v}(t)=\vec{r}'(t) \qquad \vec{a}(t)=\vec{v}'(t)=\vec{r}''(t)" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="unit-tangent-vector">11.3 Unit Tangent Vector</NoteSubSectionTitle>
      <NoteParagraph>
        The unit tangent vector keeps only the direction of motion and removes the speed. It points along the curve in the direction the particle is moving.
      </NoteParagraph>
      <NoteParagraph>
        Dividing by magnitude turns the velocity vector into a direction-only vector.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Unit Tangent">
          <MathBlock math="\vec{T}(t)=\frac{\vec{r}'(t)}{\|\vec{r}'(t)\|}" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="unit-normal-vector">11.4 Unit Normal Vector</NoteSubSectionTitle>
      <NoteParagraph>
        The unit normal vector points in the direction the curve is turning. While the tangent points forward, the normal points toward the bend.
      </NoteParagraph>
      <NoteParagraph>
        It is useful for separating motion into forward motion and turning motion.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Unit Normal">
          <MathBlock math="\vec{N}(t)=\frac{\vec{T}'(t)}{\|\vec{T}'(t)\|}" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="curvature">11.5 Curvature</NoteSubSectionTitle>
      <NoteParagraph>
        Curvature measures how sharply a curve turns. A straight line has curvature zero, while a tight circle has large curvature.
      </NoteParagraph>
      <NoteParagraph>
        It is not about speed. It is about how quickly the direction changes with respect to distance traveled.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Plane Curvature">
          <MathBlock math="\kappa=\frac{|x'y''-y'x''|}{\left((x')^2+(y')^2\right)^{3/2}}" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="motion-in-the-plane">11.6 Motion in the Plane</NoteSubSectionTitle>
      <NoteParagraph>
        Motion in the plane uses vector functions to track horizontal and vertical movement at the same time. This lets us describe speed, direction, acceleration, and path shape together.
      </NoteParagraph>
      <NoteParagraph>
        The same object can have positive speed while one coordinate is decreasing because motion is multidimensional.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Speed">
          <MathBlock math="\|\vec{v}(t)\|=\sqrt{(x'(t))^2+(y'(t))^2}" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="arc-length-for-vector-functions">11.7 Arc Length for Vector Functions</NoteSubSectionTitle>
      <NoteParagraph>
        Arc length for vector functions accumulates speed over time. Since speed is distance per time, integrating speed gives total distance traveled along the curve.
      </NoteParagraph>
      <NoteParagraph>
        This is the same idea as one-dimensional motion, now with vector speed.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Vector Arc Length">
          <MathBlock math="L=\int_a^b \|\vec{r}'(t)\|\,dt" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="frenet-frame-and-torsion">11.8 Frenet Frame and Torsion</NoteSubSectionTitle>
      <NoteParagraph>
        The Frenet frame describes motion along a space curve using three moving directions: forward along the curve, inward toward the bend, and sideways out of the bending plane.
      </NoteParagraph>
      <NoteParagraph>
        Curvature measures bending, while torsion measures twisting out of a plane.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Moving Frame">
          <MathBlock math="\vec{T}=\text{unit tangent} \qquad \vec{N}=\text{unit normal} \qquad \vec{B}=\vec{T}\times\vec{N}" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      {/* 12. SERIES SECTION */}
      <NoteSectionTitle id="series">12. Series</NoteSectionTitle>
      <NoteParagraph>
        Series ask what happens when we add infinitely many terms. The question is not whether we can finish the addition by hand, but whether the partial sums settle toward a finite value.
      </NoteParagraph>
      <NoteParagraph>
        This makes series a language for approximation. A function can be replaced by an infinite polynomial when the series behaves well.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Notation to Know">
          <NoteParagraph>
            The symbol <InlineMath math="\sum" /> means sum. In <InlineMath math="\sum_{n=1}^{\infty} a_n" />, <InlineMath math="n" /> is the index, <InlineMath math="a_n" /> is the <InlineMath math="n" />th term, and <InlineMath math="\infty" /> means the summing process continues without a final term.
          </NoteParagraph>
          <NoteParagraph className="mb-0">
            A partial sum stops at a finite index like <InlineMath math="N" />. Convergence means those partial sums approach one stable value.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-start mb-8">
        <div>
          <ul className={graphListClassName}>
            <li style={{ color: graphColors.blue }}>partial sums of <InlineMath math="\sum_{n=1}^{\infty}\frac{1}{2^n}" /></li>
            <li style={{ color: graphColors.asymptote }}>dashed line: value the series approaches</li>
          </ul>
          <NoteParagraph>
            A series converges when its running totals settle down. The individual terms matter, but the real object we watch is the sequence of partial sums.
          </NoteParagraph>
        </div>

        <div className={`p-1 rounded-xl border ${isDarkMode ? 'bg-black/50 border-green-500/30' : 'bg-slate-50 border-slate-200'}`}>
          <div className="rounded-lg overflow-hidden" style={dottedMafsStyle}>
            <Mafs viewBox={{ x: [0, 7], y: [0, 1.2] }} height={300} zoom>
              <Coordinates.Cartesian />
              <Line.PointSlope point={[0, 1]} slope={0} color={graphColors.asymptote} style="dashed" opacity={0.8} />
              <Point x={1} y={0.5} color={Theme.blue} />
              <Point x={2} y={0.75} color={Theme.blue} />
              <Point x={3} y={0.875} color={Theme.blue} />
              <Point x={4} y={0.9375} color={Theme.blue} />
              <Point x={5} y={0.96875} color={Theme.blue} />
              <Point x={6} y={0.984375} color={Theme.blue} />
            </Mafs>
          </div>
        </div>
      </div>

      <NoteSubSectionTitle id="sequences">12.1 Sequences</NoteSubSectionTitle>
      <NoteParagraph>
        A sequence is an ordered list of numbers. In calculus, we mostly care about its long-term behavior: does it settle down, grow without bound, or fail to approach anything?
      </NoteParagraph>
      <NoteParagraph>
        Series depend on sequences because a series is built from sequence terms.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Sequence Limit">
          <MathBlock math="\lim_{n \to \infty} a_n = L" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="infinite-series">12.2 Infinite Series</NoteSubSectionTitle>
      <NoteParagraph>
        An infinite series adds the terms of a sequence. We study the partial sums because they show what the infinite addition is approaching.
      </NoteParagraph>
      <NoteParagraph>
        If the partial sums converge, the series converges. If they do not settle, the series diverges.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Partial Sums">
          <MathBlock math="\sum_{n=1}^{\infty} a_n = \lim_{N \to \infty}\sum_{n=1}^{N} a_n" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="geometric-series">12.3 Geometric Series</NoteSubSectionTitle>
      <NoteParagraph>
        A geometric series repeatedly multiplies by the same ratio. If the ratio's magnitude is less than one, the pieces shrink fast enough to add to a finite total.
      </NoteParagraph>
      <NoteParagraph>
        If the ratio is too large, the terms never die out enough to settle.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Geometric Sum">
          <MathBlock math="\sum_{n=0}^{\infty} ar^n = \frac{a}{1-r} \qquad |r|<1" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="nth-term-test">12.4 nth-Term Test</NoteSubSectionTitle>
      <NoteParagraph>
        The nth-term test is the first filter. If the terms being added do not approach zero, the series cannot converge.
      </NoteParagraph>
      <NoteParagraph>
        If the terms do approach zero, that does not prove convergence. It only means the series survives the first obvious failure.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Divergence Test">
          <MathBlock math="\lim_{n \to \infty} a_n \ne 0 \Rightarrow \sum a_n \text{ diverges}" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="p-series">12.5 p-Series</NoteSubSectionTitle>
      <NoteParagraph>
        A p-series measures how quickly reciprocal powers shrink. Terms like <InlineMath math="1/n^2" /> shrink fast enough, while terms like <InlineMath math="1/n" /> shrink too slowly.
      </NoteParagraph>
      <NoteParagraph>
        The boundary is <InlineMath math="p=1" />.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="p-Series Rule">
          <MathBlock math="\sum_{n=1}^{\infty}\frac{1}{n^p} \text{ converges if } p>1 \text{ and diverges if } p\le 1" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="integral-test">12.6 Integral Test</NoteSubSectionTitle>
      <NoteParagraph>
        The integral test compares a positive decreasing series to the area under a curve. If the related improper integral converges, the series converges too.
      </NoteParagraph>
      <NoteParagraph>
        The intuition is that sums and integrals are both accumulation, just with rectangles versus continuous area. The matching function should be positive, continuous, and decreasing.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Integral Comparison">
          <MathBlock math="\sum_{n=1}^{\infty} a_n \text{ behaves like } \int_1^\infty f(x)\,dx \quad \text{when } a_n=f(n)" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="comparison-test">12.7 Comparison Test</NoteSubSectionTitle>
      <NoteParagraph>
        The comparison test uses a known series as a benchmark. A smaller positive series than a convergent one must converge; a larger positive series than a divergent one must diverge.
      </NoteParagraph>
      <NoteParagraph>
        This is useful when exact sums are hard but size relationships are clear.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Direct Comparison">
          <MathBlock math="0 \le a_n \le b_n,\ \sum b_n \text{ converges} \Rightarrow \sum a_n \text{ converges}" />
          <MathBlock math="0 \le b_n \le a_n,\ \sum b_n \text{ diverges} \Rightarrow \sum a_n \text{ diverges}" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="limit-comparison-test">12.8 Limit Comparison Test</NoteSubSectionTitle>
      <NoteParagraph>
        Limit comparison focuses on long-term similarity. If two positive series have terms that grow or shrink at comparable rates, they share convergence behavior.
      </NoteParagraph>
      <NoteParagraph>
        This is often cleaner than trying to force a direct inequality.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Long-Term Ratio">
          <MathBlock math="a_n,b_n>0,\quad \lim_{n \to \infty}\frac{a_n}{b_n}=c,\quad 0<c<\infty" />
          <NoteParagraph className="mb-0">
            Then <InlineMath math="\sum a_n" /> and <InlineMath math="\sum b_n" /> share the same convergence behavior.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="alternating-series-test">12.9 Alternating Series Test</NoteSubSectionTitle>
      <NoteParagraph>
        Alternating series can converge because positive and negative terms cancel each other. If the magnitudes shrink to zero, the partial sums get trapped closer and closer to the final value.
      </NoteParagraph>
      <NoteParagraph>
        This can produce conditional convergence, where the alternating series converges but the absolute-value series does not.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Alternating Test">
          <MathBlock math="\sum (-1)^n b_n \text{ converges if } b_n\ge0,\ b_n \text{ decreases, and } \lim_{n\to\infty}b_n=0" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="ratio-test">12.10 Ratio Test</NoteSubSectionTitle>
      <NoteParagraph>
        The ratio test looks at how each term compares to the previous term. It is especially useful for factorials and powers because those expressions simplify nicely in ratios.
      </NoteParagraph>
      <NoteParagraph>
        If the long-term ratio is less than one, the terms shrink geometrically. If the limit equals one, the test does not decide anything.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Ratio Test">
          <MathBlock math="L=\lim_{n \to \infty}\left|\frac{a_{n+1}}{a_n}\right| \quad L<1 \Rightarrow \text{absolutely converges},\ L>1 \Rightarrow \text{diverges}" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="root-test">12.11 Root Test</NoteSubSectionTitle>
      <NoteParagraph>
        The root test is useful when the entire term is raised to the <InlineMath math="n" />th power. Taking the <InlineMath math="n" />th root exposes the underlying growth factor.
      </NoteParagraph>
      <NoteParagraph>
        It has the same geometric intuition as the ratio test, including the same inconclusive case when <InlineMath math="L=1" />.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Root Test">
          <MathBlock math="L=\lim_{n \to \infty}\sqrt[n]{|a_n|} \quad L<1 \Rightarrow \text{absolutely converges},\ L>1 \Rightarrow \text{diverges}" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="power-series">12.12 Power Series</NoteSubSectionTitle>
      <NoteParagraph>
        A power series is an infinite polynomial centered at a point. It behaves like a function within its interval of convergence.
      </NoteParagraph>
      <NoteParagraph>
        The radius of convergence tells how far from the center the series remains reliable.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Power Series">
          <MathBlock math="\sum_{n=0}^{\infty} c_n(x-a)^n" />
          <NoteParagraph className="mb-0">
            The constants <InlineMath math="c_n" /> are coefficients, <InlineMath math="a" /> is the center, and powers of <InlineMath math="x-a" /> measure distance from that center.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="taylor-series">12.13 Taylor Series</NoteSubSectionTitle>
      <NoteParagraph>
        A Taylor series builds a function from derivative information at one point. Each derivative controls another layer of local behavior.
      </NoteParagraph>
      <NoteParagraph>
        The more terms we include, the more local shape information the polynomial remembers. When the series converges to the function, local derivative data becomes a usable approximation.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Taylor Series">
          <MathBlock math="f(x)=\sum_{n=0}^{\infty}\frac{f^{(n)}(a)}{n!}(x-a)^n" />
          <NoteParagraph className="mb-0">
            The notation <InlineMath math="f^{(n)}(a)" /> means the <InlineMath math="n" />th derivative evaluated at the center <InlineMath math="a" />.
            The factorial <InlineMath math="n!" /> means <InlineMath math="n(n-1)(n-2)\cdots1" />.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="maclaurin-series">12.14 Maclaurin Series</NoteSubSectionTitle>
      <NoteParagraph>
        A Maclaurin series is just a Taylor series centered at zero. It is common because many important functions behave nicely around the origin.
      </NoteParagraph>
      <NoteParagraph>
        The standard Maclaurin series for <InlineMath math="e^x" />, <InlineMath math="\sin x" />, and <InlineMath math="\cos x" /> are worth recognizing quickly.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Common Examples">
          <MathBlock math="e^x=\sum_{n=0}^{\infty}\frac{x^n}{n!}" />
          <MathBlock math="\sin x=\sum_{n=0}^{\infty}(-1)^n\frac{x^{2n+1}}{(2n+1)!}" />
          <MathBlock math="\cos x=\sum_{n=0}^{\infty}(-1)^n\frac{x^{2n}}{(2n)!}" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="absolute-and-conditional-convergence">12.15 Absolute and Conditional Convergence</NoteSubSectionTitle>
      <NoteParagraph>
        Absolute convergence means a series still converges after every term is made positive. Conditional convergence means cancellation is essential.
      </NoteParagraph>
      <NoteParagraph>
        This distinction matters because absolutely convergent series behave more stably under rearrangement and estimation.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Convergence Strength">
          <MathBlock math="\sum |a_n| \text{ converges} \Rightarrow \sum a_n \text{ converges}" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="taylor-remainder">12.16 Taylor Remainder</NoteSubSectionTitle>
      <NoteParagraph>
        A Taylor polynomial is useful only if we understand the error left behind. The remainder tells how much of the function has not been captured by the finite approximation.
      </NoteParagraph>
      <NoteParagraph>
        Intuitively, more terms add more local shape information, but the distance from the center still matters.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Lagrange Remainder">
          <MathBlock math="R_n(x)=\frac{f^{(n+1)}(c)}{(n+1)!}(x-a)^{n+1}" />
          <NoteParagraph className="mb-0">
            The point <InlineMath math="c" /> lies somewhere between <InlineMath math="a" /> and <InlineMath math="x" />.
            The remainder <InlineMath math="R_n(x)" /> is the error after stopping at degree <InlineMath math="n" />.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="uniform-convergence">12.17 Uniform Convergence</NoteSubSectionTitle>
      <NoteParagraph>
        Uniform convergence means a sequence of functions approaches its limit at the same pace across an entire interval. Pointwise convergence only checks one input at a time.
      </NoteParagraph>
      <NoteParagraph>
        The intuition is control: uniform convergence lets us pass limits through operations more safely because the approximation is globally reliable.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Uniform Control">
          <MathBlock math="\sup_{x\in E}|f_n(x)-f(x)|\to0" />
          <NoteParagraph className="mb-0">
            The expression <InlineMath math="\sup" /> means supremum, or the least upper bound. Here it measures the largest remaining error across the whole set <InlineMath math="E" />.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="fourier-series">12.18 Fourier Series</NoteSubSectionTitle>
      <NoteParagraph>
        Fourier series approximate periodic functions using sine and cosine waves. Instead of building from powers of <InlineMath math="x" />, they build from frequencies.
      </NoteParagraph>
      <NoteParagraph>
        This is central whenever periodic behavior appears because complicated repeating patterns can be decomposed into simpler wave components.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Frequency Expansion">
          <MathBlock math="f(x)\sim \frac{a_0}{2}+\sum_{n=1}^{\infty}\left(a_n\cos nx+b_n\sin nx\right)" />
          <NoteParagraph className="mb-0">
            The symbol <InlineMath math="\sim" /> means "is represented by" in this context. The coefficients <InlineMath math="a_n" /> and <InlineMath math="b_n" /> measure how much cosine and sine of frequency <InlineMath math="n" /> contribute.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      {/* 13. MULTIVARIABLE BASICS SECTION */}
      <NoteSectionTitle id="multivariable-basics">13. Multivariable Basics</NoteSectionTitle>
      <NoteParagraph>
        Multivariable calculus keeps the same core ideas from single-variable calculus, but the inputs and outputs now live in higher dimensions.
      </NoteParagraph>
      <NoteParagraph>
        The first challenge is visualization. We need vectors, coordinates, level sets, and fields before derivatives and integrals can make sense in space.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Notation to Know">
          <NoteParagraph>
            A point like <InlineMath math="(x,y,z)" /> gives coordinates in space. A vector like <InlineMath math="\vec{v}=\langle v_1,v_2,v_3\rangle" /> gives components of a directed quantity.
          </NoteParagraph>
          <NoteParagraph className="mb-0">
            A level set such as <InlineMath math="f(x,y)=c" /> means all input points where the output equals the constant <InlineMath math="c" />.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-start mb-8">
        <div>
          <ul className={graphListClassName}>
            <li style={{ color: graphColors.green }}><InlineMath math="f(x,y)=x^2+y^2" /> level curves</li>
            <li style={{ color: graphColors.orange }}>vectors point away from the origin</li>
          </ul>
          <NoteParagraph>
            Level curves are a way to flatten a surface into readable slices. For this example, equal heights form circles because every point the same distance from the origin has the same value.
          </NoteParagraph>
        </div>

        <div className={`p-1 rounded-xl border ${isDarkMode ? 'bg-black/50 border-green-500/30' : 'bg-slate-50 border-slate-200'}`}>
          <div className="rounded-lg overflow-hidden" style={mafsStyle}>
            <Mafs viewBox={{ x: [-3, 3], y: [-3, 3] }} height={300} zoom>
              <Coordinates.Cartesian />
              <Circle center={[0, 0]} radius={1} color={Theme.green} fillOpacity={0} strokeOpacity={0.9} />
              <Circle center={[0, 0]} radius={2} color={Theme.green} fillOpacity={0} strokeOpacity={0.65} />
              <Circle center={[0, 0]} radius={3} color={Theme.green} fillOpacity={0} strokeOpacity={0.4} />
              <Vector tail={[0, 0]} tip={[1.5, 1]} color={Theme.orange} />
              <Vector tail={[0, 0]} tip={[-1.5, 1]} color={Theme.orange} />
            </Mafs>
          </div>
        </div>
      </div>

      <NoteSubSectionTitle id="vectors">13.1 Vectors</NoteSubSectionTitle>
      <NoteParagraph>
        Vectors represent quantities with magnitude and direction. They are the natural language for displacement, velocity, force, and movement through space.
      </NoteParagraph>
      <NoteParagraph>
        A vector can be drawn as an arrow, but algebraically it is a package of components.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Vector Notation">
          <MathBlock math="\vec{v}=\langle v_1,v_2,v_3\rangle" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="3d-coordinates">13.2 3D Coordinates</NoteSubSectionTitle>
      <NoteParagraph>
        3D coordinates add a third axis, usually <InlineMath math="z" />, so a point needs three numbers instead of two.
      </NoteParagraph>
      <NoteParagraph>
        The main intuition is that surfaces replace curves as the graphs of many functions.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Point in Space">
          <MathBlock math="(x,y,z)" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="dot-product">13.3 Dot Product</NoteSubSectionTitle>
      <NoteParagraph>
        The dot product measures alignment. If two vectors point in the same direction, the dot product is large and positive. If they are perpendicular, it is zero.
      </NoteParagraph>
      <NoteParagraph>
        This makes it useful for projections, angles, and directional derivatives.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Dot Product">
          <MathBlock math="\vec{a}\cdot\vec{b}=|\vec{a}||\vec{b}|\cos\theta" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="cross-product">13.4 Cross Product</NoteSubSectionTitle>
      <NoteParagraph>
        The cross product produces a vector perpendicular to two given vectors. Its magnitude measures the area of the parallelogram they span.
      </NoteParagraph>
      <NoteParagraph>
        The direction comes from orientation, commonly remembered with the right-hand rule.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Magnitude">
          <MathBlock math="\|\vec{a}\times\vec{b}\|=|\vec{a}||\vec{b}|\sin\theta" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="lines-and-planes">13.5 Lines and Planes</NoteSubSectionTitle>
      <NoteParagraph>
        Lines in space need a point and a direction. Planes need a point and a normal vector, which tells which direction is perpendicular to the plane.
      </NoteParagraph>
      <NoteParagraph>
        Thinking in terms of vectors makes both descriptions much cleaner.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Plane Form">
          <MathBlock math="\vec{n}\cdot(\vec{x}-\vec{x}_0)=0" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="multivariable-functions">13.6 Multivariable Functions</NoteSubSectionTitle>
      <NoteParagraph>
        A multivariable function can take several inputs. For example, <InlineMath math="f(x,y)" /> takes a point in the plane and returns one output height.
      </NoteParagraph>
      <NoteParagraph>
        This creates a surface instead of a curve.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Scalar-Valued Function">
          <MathBlock math="z=f(x,y)" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="level-curves">13.7 Level Curves</NoteSubSectionTitle>
      <NoteParagraph>
        Level curves slice a surface at a fixed height and show where the function has that value. They are like contour lines on a topographic map.
      </NoteParagraph>
      <NoteParagraph>
        They let us understand a 3D surface using 2D curves.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Level Curve">
          <MathBlock math="f(x,y)=c" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="level-surfaces">13.8 Level Surfaces</NoteSubSectionTitle>
      <NoteParagraph>
        Level surfaces are the 3D version of level curves. A function of three variables has a level surface wherever the output is held constant.
      </NoteParagraph>
      <NoteParagraph>
        Instead of drawing height over a plane, we look at all points in space that satisfy the same value condition.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Level Surface">
          <MathBlock math="f(x,y,z)=c" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="vector-fields">13.9 Vector Fields</NoteSubSectionTitle>
      <NoteParagraph>
        A vector field assigns a vector to each point in space. It describes how something would move or push if placed at that point.
      </NoteParagraph>
      <NoteParagraph>
        Wind maps, force fields, and fluid flow are all natural examples.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Vector Field">
          <MathBlock math="\vec{F}(x,y)=\langle P(x,y),Q(x,y)\rangle" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="multivariable-limits-and-continuity">13.10 Multivariable Limits and Continuity</NoteSubSectionTitle>
      <NoteParagraph>
        Multivariable limits are stricter than single-variable limits because a point can be approached along infinitely many paths. Matching along a few paths is evidence, not proof.
      </NoteParagraph>
      <NoteParagraph>
        Continuity still means the function's value matches its nearby behavior, but nearby behavior now comes from every direction around the point.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Path Warning">
          <MathBlock math="\lim_{(x,y)\to(a,b)}f(x,y)=L" />
          <NoteParagraph className="mb-0">
            If two paths toward <InlineMath math="(a,b)" /> give different limiting values, the multivariable limit does not exist.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      {/* 14. MULTIVARIABLE DERIVATIVES SECTION */}
      <NoteSectionTitle id="multivariable-derivatives">14. Multivariable Derivatives</NoteSectionTitle>
      <NoteParagraph>
        In multivariable calculus, there is not just one direction to move. Derivatives have to answer how a function changes as we move in different directions.
      </NoteParagraph>
      <NoteParagraph>
        Partial derivatives, gradients, tangent planes, and Jacobians are all ways of organizing directional change.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Notation to Know">
          <NoteParagraph>
            The symbol <InlineMath math="\partial" /> means partial derivative: change one input while holding the others fixed.
            The symbol <InlineMath math="\nabla" />, pronounced "nabla" or "del," packages partial derivatives into gradient, divergence, or curl notation.
          </NoteParagraph>
          <NoteParagraph className="mb-0">
            A matrix like <InlineMath math="J" /> or <InlineMath math="H_f" /> stores many related derivatives so a multivariable function can be approximated locally by linear or quadratic data.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-start mb-8">
        <div>
          <ul className={graphListClassName}>
            <li style={{ color: graphColors.green }}>contours of equal output</li>
            <li style={{ color: graphColors.orange }}>gradient points across contours toward steepest increase</li>
            <li style={{ color: graphColors.blue }}>chosen direction only captures part of that increase</li>
          </ul>
          <NoteParagraph>
            The gradient is perpendicular to level curves. Directional derivatives are smaller when our chosen direction is not aligned with the gradient.
          </NoteParagraph>
        </div>

        <div className={`p-1 rounded-xl border ${isDarkMode ? 'bg-black/50 border-green-500/30' : 'bg-slate-50 border-slate-200'}`}>
          <div className="rounded-lg overflow-hidden" style={mafsStyle}>
            <Mafs viewBox={{ x: [-3, 3], y: [-3, 3] }} height={300} zoom>
              <Coordinates.Cartesian />
              <Circle center={[0, 0]} radius={1} color={Theme.green} fillOpacity={0} strokeOpacity={0.8} />
              <Circle center={[0, 0]} radius={2} color={Theme.green} fillOpacity={0} strokeOpacity={0.55} />
              <Point x={1.2} y={1.6} color={Theme.violet} />
              <Vector tail={[1.2, 1.6]} tip={[2.1, 2.8]} color={Theme.orange} />
              <Vector tail={[1.2, 1.6]} tip={[2.2, 1.6]} color={Theme.blue} />
            </Mafs>
          </div>
        </div>
      </div>

      <NoteSubSectionTitle id="partial-derivatives">14.1 Partial Derivatives</NoteSubSectionTitle>
      <NoteParagraph>
        A partial derivative changes one input while temporarily holding the others constant. It asks for the slope in one coordinate direction.
      </NoteParagraph>
      <NoteParagraph>
        This is like taking a slice of the surface and doing ordinary single-variable calculus on that slice.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Partial Notation">
          <MathBlock math="f_x=\frac{\partial f}{\partial x} \qquad f_y=\frac{\partial f}{\partial y}" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="higher-order-partial-derivatives">14.2 Higher-Order Partial Derivatives</NoteSubSectionTitle>
      <NoteParagraph>
        Higher-order partial derivatives repeat partial differentiation. They measure how slopes in one direction change as we move in the same or another direction.
      </NoteParagraph>
      <NoteParagraph>
        Mixed partials often match when the function is smooth enough.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Mixed Partials">
          <MathBlock math="f_{xy}=\frac{\partial}{\partial y}\left(\frac{\partial f}{\partial x}\right)" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="gradient">14.3 Gradient</NoteSubSectionTitle>
      <NoteParagraph>
        The gradient packages all first partial derivatives into one vector. It points in the direction of steepest increase.
      </NoteParagraph>
      <NoteParagraph>
        Its magnitude tells how fast the function increases in that steepest direction.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Gradient">
          <MathBlock math="\nabla f=\left\langle \frac{\partial f}{\partial x},\frac{\partial f}{\partial y},\frac{\partial f}{\partial z}\right\rangle" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="directional-derivatives">14.4 Directional Derivatives</NoteSubSectionTitle>
      <NoteParagraph>
        A directional derivative asks how fast a function changes if we move in a chosen unit direction. It is the dot product of the gradient with that direction.
      </NoteParagraph>
      <NoteParagraph>
        This makes sense because the dot product measures how aligned the movement direction is with steepest increase.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Directional Derivative">
          <MathBlock math="D_{\vec{u}}f=\nabla f\cdot\vec{u}" />
          <NoteParagraph className="mb-0">
            The vector <InlineMath math="\vec{u}" /> must be a unit vector. The dot product keeps only the part of the gradient pointing in that chosen direction.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="tangent-planes">14.5 Tangent Planes</NoteSubSectionTitle>
      <NoteParagraph>
        A tangent plane is the best local flat approximation to a surface. It generalizes the tangent line from single-variable calculus.
      </NoteParagraph>
      <NoteParagraph>
        Near the point, the surface behaves almost like this plane.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Plane Approximation">
          <MathBlock math="z=f(a,b)+f_x(a,b)(x-a)+f_y(a,b)(y-b)" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="linear-approximation-1">14.6 Linear Approximation</NoteSubSectionTitle>
      <NoteParagraph>
        Multivariable linear approximation uses the tangent plane to estimate nearby function values. It combines small changes in each input direction.
      </NoteParagraph>
      <NoteParagraph>
        The partial derivatives act like conversion rates from input movement to output movement.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Differential Form">
          <MathBlock math="df \approx f_x\,dx+f_y\,dy" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="chain-rule-1">14.7 Chain Rule</NoteSubSectionTitle>
      <NoteParagraph>
        The multivariable chain rule tracks how change flows through several dependent variables. Each path of dependency contributes to the total derivative.
      </NoteParagraph>
      <NoteParagraph>
        This is the same chain rule idea, but now there may be multiple routes from input to output.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Two-Variable Chain Rule">
          <MathBlock math="\frac{dz}{dt}=\frac{\partial z}{\partial x}\frac{dx}{dt}+\frac{\partial z}{\partial y}\frac{dy}{dt}" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="jacobian">14.8 Jacobian</NoteSubSectionTitle>
      <NoteParagraph>
        The Jacobian is a matrix of first partial derivatives. It describes the best local linear approximation to a multivariable transformation.
      </NoteParagraph>
      <NoteParagraph>
        For transformations, the Jacobian tells how small regions are stretched, rotated, or compressed locally.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Jacobian Matrix">
          <MathBlock math="J=\begin{bmatrix}\frac{\partial f_1}{\partial x_1}&\cdots&\frac{\partial f_1}{\partial x_n}\\ \vdots&\ddots&\vdots\\ \frac{\partial f_m}{\partial x_1}&\cdots&\frac{\partial f_m}{\partial x_n}\end{bmatrix}" />
          <NoteParagraph className="mb-0">
            The entries record how each output function <InlineMath math="f_i" /> changes with respect to each input variable <InlineMath math="x_j" />.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="hessian">14.9 Hessian</NoteSubSectionTitle>
      <NoteParagraph>
        The Hessian packages second partial derivatives into a matrix. If the gradient tells the direction of steepest first-order change, the Hessian describes local bending.
      </NoteParagraph>
      <NoteParagraph>
        This is why Hessians show up in optimization, second-order approximations, and algorithms that care about curvature.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Second-Derivative Matrix">
          <MathBlock math="H_f=\begin{bmatrix}f_{xx}&f_{xy}\\ f_{yx}&f_{yy}\end{bmatrix}" />
          <NoteParagraph className="mb-0">
            Subscripts show which variables were used for differentiation. For example, <InlineMath math="f_{xy}" /> means differentiate with respect to <InlineMath math="x" /> and then <InlineMath math="y" />.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="implicit-function-viewpoint">14.10 Implicit Function Viewpoint</NoteSubSectionTitle>
      <NoteParagraph>
        Implicit equations describe curves and surfaces as level sets rather than solved graphs. Locally, a level set can often be treated like a function if the relevant derivative does not vanish.
      </NoteParagraph>
      <NoteParagraph>
        The intuition is that a nonzero derivative gives enough local direction to solve for one variable in terms of the others.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Two-Variable Slope">
          <MathBlock math="F(x,y)=0 \qquad \Rightarrow \qquad \frac{dy}{dx}=-\frac{F_x}{F_y}\quad(F_y\ne0)" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      {/* 15. MULTIVARIABLE DERIVATIVE APPLICATIONS SECTION */}
      <NoteSectionTitle id="multivariable-derivative-applications">15. Multivariable Derivative Applications</NoteSectionTitle>
      <NoteParagraph>
        Derivative applications in multiple variables are about reading surfaces. Instead of peaks and valleys on a curve, we now look for peaks, valleys, and saddles on surfaces.
      </NoteParagraph>
      <NoteParagraph>
        Constraints add another layer: sometimes we only care about behavior along a path or surface inside a larger space.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Notation to Know">
          <NoteParagraph>
            In <InlineMath math="\nabla f=\lambda\nabla g" />, <InlineMath math="f" /> is the function being optimized, <InlineMath math="g(x,y)=c" /> is the constraint, and <InlineMath math="\lambda" /> is a multiplier that scales the constraint gradient.
          </NoteParagraph>
          <NoteParagraph className="mb-0">
            In gradient descent, <InlineMath math="\eta" /> is the step size, and <InlineMath math="\vec{x}_n" /> is the current point in the iterative process.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-start mb-8">
        <div>
          <ul className={graphListClassName}>
            <li style={{ color: graphColors.green }}>constraint curve</li>
            <li style={{ color: graphColors.orange }}>objective gradient</li>
            <li style={{ color: graphColors.violet }}>constraint gradient</li>
          </ul>
          <NoteParagraph>
            At a constrained optimum, moving along the constraint cannot improve the objective. This is why the gradients line up: the only direction of increase points directly off the allowed path.
          </NoteParagraph>
        </div>

        <div className={`p-1 rounded-xl border ${isDarkMode ? 'bg-black/50 border-green-500/30' : 'bg-slate-50 border-slate-200'}`}>
          <div className="rounded-lg overflow-hidden" style={mafsStyle}>
            <Mafs viewBox={{ x: [-2.5, 2.5], y: [-2, 2] }} height={300} zoom>
              <Coordinates.Cartesian />
              <Plot.Parametric xy={(t) => [2 * Math.cos(t), Math.sin(t)]} domain={[0, 2 * Math.PI]} color={Theme.green} />
              <Point x={Math.SQRT2} y={Math.SQRT1_2} color={Theme.red} />
              <Vector tail={[Math.SQRT2, Math.SQRT1_2]} tip={[Math.SQRT2 + 0.3, Math.SQRT1_2 + 0.6]} color={Theme.orange} />
              <Vector tail={[Math.SQRT2, Math.SQRT1_2]} tip={[Math.SQRT2 + 0.25, Math.SQRT1_2 + 0.5]} color={Theme.violet} />
            </Mafs>
          </div>
        </div>
      </div>

      <NoteSubSectionTitle id="critical-points">15.1 Critical Points</NoteSubSectionTitle>
      <NoteParagraph>
        A critical point occurs where the first-order change disappears or fails to exist. On a surface, this means there is no immediate uphill direction according to the gradient.
      </NoteParagraph>
      <NoteParagraph>
        Critical points are candidates for maxima, minima, or saddle points.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Critical Condition">
          <MathBlock math="\nabla f(a,b)=\vec{0}" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="local-maxima-and-minima">15.2 Local Maxima and Minima</NoteSubSectionTitle>
      <NoteParagraph>
        A local maximum is a nearby high point, and a local minimum is a nearby low point. The function only needs to win against points close to it, not the entire domain.
      </NoteParagraph>
      <NoteParagraph>
        In multiple variables, the surface can rise or fall in many directions, so checking one direction is not enough.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Local Idea">
          <NoteParagraph>
            A point is local extreme behavior only if nearby points in every direction are no better or no worse.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="saddle-points">15.3 Saddle Points</NoteSubSectionTitle>
      <NoteParagraph>
        A saddle point is flat in the first-derivative sense but not an extremum. The surface rises in some directions and falls in others.
      </NoteParagraph>
      <NoteParagraph>
        This is one of the main differences from single-variable intuition: zero gradient does not mean peak or valley.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Saddle Intuition">
          <NoteParagraph>
            Think of a mountain pass: locally high in one direction, locally low in another.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="second-derivative-test">15.4 Second Derivative Test</NoteSubSectionTitle>
      <NoteParagraph>
        The multivariable second derivative test uses the second partial derivatives to classify critical points. It checks the local bending structure of the surface.
      </NoteParagraph>
      <NoteParagraph>
        The determinant tells whether the bending is consistent or mixed. Then <InlineMath math="f_{xx}" /> tells whether consistent bending is upward or downward.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Discriminant">
          <MathBlock math="D=f_{xx}(a,b)f_{yy}(a,b)-\left(f_{xy}(a,b)\right)^2" />
          <MathBlock math="D>0,\ f_{xx}>0 \Rightarrow \text{local min} \qquad D>0,\ f_{xx}<0 \Rightarrow \text{local max}" />
          <MathBlock math="D<0 \Rightarrow \text{saddle} \qquad D=0 \Rightarrow \text{inconclusive}" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="constrained-optimization">15.5 Constrained Optimization</NoteSubSectionTitle>
      <NoteParagraph>
        Constrained optimization asks for maxima or minima while staying on a constraint. The function may want to move uphill, but the constraint limits where it is allowed to go.
      </NoteParagraph>
      <NoteParagraph>
        The geometry is about optimizing along the allowed path or surface, not across the whole space.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Constraint Language">
          <MathBlock math="g(x,y)=c" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="lagrange-multipliers">15.6 Lagrange Multipliers</NoteSubSectionTitle>
      <NoteParagraph>
        Lagrange multipliers find constrained extrema by comparing gradients. At an optimum on a smooth constraint, the gradient of the objective points parallel to the gradient of the constraint.
      </NoteParagraph>
      <NoteParagraph>
        Intuitively, there is no allowed direction along the constraint that still improves the objective.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Lagrange Condition">
          <MathBlock math="\nabla f=\lambda \nabla g \qquad g(x,y)=c" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="multiple-constraints">15.7 Multiple Constraints</NoteSubSectionTitle>
      <NoteParagraph>
        With multiple constraints, the objective gradient must be built from the gradients of all active constraints. Each constraint removes a direction of allowed movement.
      </NoteParagraph>
      <NoteParagraph>
        Geometrically, the objective cannot improve along any direction that remains inside all constraints.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Several Constraint Directions">
          <MathBlock math="\nabla f=\lambda_1\nabla g_1+\lambda_2\nabla g_2+\cdots+\lambda_k\nabla g_k" />
          <NoteParagraph className="mb-0">
            Each <InlineMath math="g_i" /> is a constraint and each <InlineMath math="\lambda_i" /> tells how much that constraint's gradient contributes to the objective gradient.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="gradient-descent">15.8 Gradient Descent</NoteSubSectionTitle>
      <NoteParagraph>
        Gradient descent uses the gradient as an algorithmic direction. Since the gradient points toward steepest increase, moving against it locally decreases the function.
      </NoteParagraph>
      <NoteParagraph>
        This is the calculus idea behind many numerical optimization routines.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Descent Step">
          <MathBlock math="\vec{x}_{n+1}=\vec{x}_n-\eta\nabla f(\vec{x}_n)" />
        </NoteTopicBlock>
      </NoteTopicGroup>
      <GradientDescentRunner />

      {/* 16. MULTIVARIABLE INTEGRALS SECTION */}
      <NoteSectionTitle id="multivariable-integrals">16. Multivariable Integrals</NoteSectionTitle>
      <NoteParagraph>
        Multivariable integrals accumulate over regions, volumes, curves, and surfaces. The main idea is still "tiny piece times many pieces," but the geometry of the tiny piece changes.
      </NoteParagraph>
      <NoteParagraph>
        Most difficulty comes from setting up the region correctly before integrating.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Notation to Know">
          <NoteParagraph>
            A region like <InlineMath math="R" /> usually lives in the plane, while a solid region like <InlineMath math="E" /> lives in space.
            The symbols <InlineMath math="dA" />, <InlineMath math="dV" />, and <InlineMath math="dS" /> mean tiny area, volume, and surface pieces.
          </NoteParagraph>
          <NoteParagraph className="mb-0">
            A curve <InlineMath math="C" /> is used for line integrals, a surface <InlineMath math="S" /> is used for surface integrals, and <InlineMath math="\vec{n}" /> usually denotes a normal vector perpendicular to a surface.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-start mb-8">
        <div>
          <ul className={graphListClassName}>
            <li style={{ color: graphColors.blue }}><InlineMath math="y=x^2" /></li>
            <li style={{ color: graphColors.red }}><InlineMath math="y=2" /></li>
            <li style={{ color: graphColors.green }}>region described by bounds</li>
          </ul>
          <NoteParagraph>
            Multivariable integrals are usually won or lost in the setup. The bounds are not just bookkeeping; they are the region written in algebra.
          </NoteParagraph>
        </div>

        <div className={`p-1 rounded-xl border ${isDarkMode ? 'bg-black/50 border-green-500/30' : 'bg-slate-50 border-slate-200'}`}>
          <div className="rounded-lg overflow-hidden" style={mafsStyle}>
            <Mafs viewBox={{ x: [-2, 2], y: [-0.5, 2.5] }} height={300} zoom>
              <Coordinates.Cartesian />
              <Polygon
                points={[[-1.414, 2], [-1, 1], [-0.5, 0.25], [0, 0], [0.5, 0.25], [1, 1], [1.414, 2]]}
                color={Theme.green}
                fillOpacity={0.25}
              />
              <Plot.OfX y={(x) => x ** 2} domain={[-1.5, 1.5]} color={Theme.blue} />
              <Plot.OfX y={() => 2} domain={[-1.5, 1.5]} color={Theme.red} />
            </Mafs>
          </div>
        </div>
      </div>

      <NoteSubSectionTitle id="double-integrals">16.1 Double Integrals</NoteSubSectionTitle>
      <NoteParagraph>
        A double integral accumulates a function over a two-dimensional region. If the function is height, the double integral gives volume under the surface.
      </NoteParagraph>
      <NoteParagraph>
        The tiny piece is an area element.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Double Integral">
          <MathBlock math="\iint_R f(x,y)\,dA" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="triple-integrals">16.2 Triple Integrals</NoteSubSectionTitle>
      <NoteParagraph>
        A triple integral accumulates over a three-dimensional region. If the function is density, the integral gives total mass.
      </NoteParagraph>
      <NoteParagraph>
        The tiny piece is now a volume element.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Triple Integral">
          <MathBlock math="\iiint_E f(x,y,z)\,dV" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="iterated-integrals">16.3 Iterated Integrals</NoteSubSectionTitle>
      <NoteParagraph>
        Iterated integrals compute multivariable accumulation one variable at a time. Each inner integral treats the other variables as temporarily constant.
      </NoteParagraph>
      <NoteParagraph>
        The bounds encode the geometry of the region.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Iterated Form">
          <MathBlock math="\int_a^b\int_{g_1(x)}^{g_2(x)} f(x,y)\,dy\,dx" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="region-setup">16.4 Region Setup</NoteSubSectionTitle>
      <NoteParagraph>
        Region setup is often the real problem. The integral bounds must describe exactly the points being accumulated over.
      </NoteParagraph>
      <NoteParagraph>
        Sketching the region usually saves more time than trying to guess the bounds algebraically.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Setup Question">
          <NoteParagraph>
            For each outer variable value, ask what range the inner variable is allowed to take.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="change-of-variables">16.5 Change of Variables</NoteSubSectionTitle>
      <NoteParagraph>
        Change of variables rewrites a region in a coordinate system where the geometry is simpler. It is the multivariable version of substitution.
      </NoteParagraph>
      <NoteParagraph>
        Because area and volume can stretch under a transformation, we must include a scaling factor.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Transformation Idea">
          <MathBlock math="(x,y)=T(u,v)" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="jacobian-determinant">16.6 Jacobian Determinant</NoteSubSectionTitle>
      <NoteParagraph>
        The Jacobian determinant measures local area or volume scaling under a transformation. It tells how much a tiny square or cube is stretched.
      </NoteParagraph>
      <NoteParagraph>
        This is why it appears in change-of-variables integrals.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Area Scaling">
          <MathBlock math="dA=\left|\frac{\partial(x,y)}{\partial(u,v)}\right|\,du\,dv" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="polar-coordinates-in-double-integrals">16.7 Polar Coordinates in Double Integrals</NoteSubSectionTitle>
      <NoteParagraph>
        Polar coordinates simplify double integrals over circular or radial regions. The area element changes because polar grid cells get wider as radius increases.
      </NoteParagraph>
      <NoteParagraph>
        That widening is why the extra factor <InlineMath math="r" /> appears.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Polar Area Element">
          <MathBlock math="dA=r\,dr\,d\theta" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="cylindrical-coordinates">16.8 Cylindrical Coordinates</NoteSubSectionTitle>
      <NoteParagraph>
        Cylindrical coordinates are polar coordinates with height added. They are useful for cylinders, tubes, and regions with rotational symmetry around an axis.
      </NoteParagraph>
      <NoteParagraph>
        The volume element keeps the same polar scaling factor.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Cylindrical Coordinates">
          <MathBlock math="x=r\cos\theta \qquad y=r\sin\theta \qquad z=z \qquad dV=r\,dr\,d\theta\,dz" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="spherical-coordinates">16.9 Spherical Coordinates</NoteSubSectionTitle>
      <NoteParagraph>
        Spherical coordinates describe points by distance from the origin and two angles. They are natural for spheres, balls, and radial symmetry in 3D.
      </NoteParagraph>
      <NoteParagraph>
        The volume element has two scaling factors because both angular directions stretch with radius. Here <InlineMath math="\phi" /> is measured down from the positive <InlineMath math="z" />-axis.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Spherical Volume Element">
          <MathBlock math="x=\rho\sin\phi\cos\theta \qquad y=\rho\sin\phi\sin\theta \qquad z=\rho\cos\phi" />
          <MathBlock math="dV=\rho^2\sin\phi\,d\rho\,d\phi\,d\theta" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="line-integrals">16.10 Line Integrals</NoteSubSectionTitle>
      <NoteParagraph>
        Line integrals accumulate along a curve. For scalar fields, they add up field values along arc length. For vector fields, they measure how much the field pushes along the path.
      </NoteParagraph>
      <NoteParagraph>
        The path matters, especially for vector fields that are not conservative.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Line Integral Forms">
          <MathBlock math="\int_C f\,ds" />
          <MathBlock math="\int_C \vec{F}\cdot d\vec{r}" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="surface-integrals">16.11 Surface Integrals</NoteSubSectionTitle>
      <NoteParagraph>
        Surface integrals accumulate over a surface. They can measure mass spread across a sheet or flux through a surface.
      </NoteParagraph>
      <NoteParagraph>
        The surface element accounts for how the parameter domain is stretched into the actual surface.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Surface Integral">
          <MathBlock math="\iint_S f\,dS" />
          <MathBlock math="\iint_S \vec{F}\cdot\vec{n}\,dS" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="mass-and-center-of-mass">16.12 Mass and Center of Mass</NoteSubSectionTitle>
      <NoteParagraph>
        When a function represents density, an integral turns local density into total mass. Moments then weight that mass by position to find a balancing point.
      </NoteParagraph>
      <NoteParagraph>
        This is the same accumulation idea, but the small pieces now carry physical or probabilistic meaning.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Density to Balance">
          <MathBlock math="m=\iint_R \rho(x,y)\,dA \qquad \bar{x}=\frac{1}{m}\iint_R x\rho(x,y)\,dA" />
          <NoteParagraph className="mb-0">
            The function <InlineMath math="\rho(x,y)" /> is density, <InlineMath math="m" /> is total mass, and <InlineMath math="\bar{x}" /> is the x-coordinate of the balancing point.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="probability-density-integrals">16.13 Probability Density Integrals</NoteSubSectionTitle>
      <NoteParagraph>
        Probability densities use integrals to measure likelihood over regions. The density itself is not probability at a point; probability comes from accumulating over a set.
      </NoteParagraph>
      <NoteParagraph>
        This viewpoint is important anywhere continuous uncertainty is modeled.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Probability over a Region">
          <MathBlock math="P((X,Y)\in R)=\iint_R f_{X,Y}(x,y)\,dA" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      {/* 17. VECTOR CALCULUS THEOREMS SECTION */}
      <NoteSectionTitle id="vector-calculus-theorems">17. Vector Calculus Theorems</NoteSectionTitle>
      <NoteParagraph>
        Vector calculus theorems are higher-dimensional versions of the Fundamental Theorem of Calculus. They turn accumulation over a region into accumulation over its boundary, or the other way around.
      </NoteParagraph>
      <NoteParagraph>
        The unifying idea is that local change inside a region leaves a measurable trace on the boundary.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Notation to Know">
          <NoteParagraph>
            A circle on an integral sign, as in <InlineMath math="\oint_C" />, means the curve is closed. The notation <InlineMath math="\partial S" /> means the boundary of the surface <InlineMath math="S" />, and <InlineMath math="\partial E" /> means the boundary of the solid region <InlineMath math="E" />.
          </NoteParagraph>
          <NoteParagraph className="mb-0">
            Curl <InlineMath math="\nabla\times\vec{F}" /> measures local rotation, divergence <InlineMath math="\nabla\cdot\vec{F}" /> measures local spreading, and flux measures flow through a boundary.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 items-start mb-8">
        <div>
          <ul className={graphListClassName}>
            <li style={{ color: graphColors.green }}><InlineMath math="\vec F=\langle -y,x\rangle" /></li>
            <li style={{ color: graphColors.blue }}>closed boundary curve</li>
            <li style={{ color: graphColors.orange }}>field circulates around the boundary</li>
          </ul>
          <NoteParagraph>
            Vector calculus theorems often translate between what happens along the boundary and what happens throughout the interior.
            A rotating field makes this idea visible: local swirl inside the region creates circulation around the edge.
          </NoteParagraph>
        </div>

        <div className={`p-1 rounded-xl border ${isDarkMode ? 'bg-black/50 border-green-500/30' : 'bg-slate-50 border-slate-200'}`}>
          <div className="rounded-lg overflow-hidden" style={mafsStyle}>
            <Mafs viewBox={{ x: [-3, 3], y: [-3, 3] }} height={300} zoom>
              <Coordinates.Cartesian />
              <Plot.VectorField xy={([x, y]) => [-y, x]} step={1} color={Theme.green} />
              <Circle center={[0, 0]} radius={2} color={Theme.blue} fillOpacity={0} strokeOpacity={1} weight={3} />
              <Vector tail={[2, 0]} tip={[2, 0.9]} color={Theme.orange} />
              <Vector tail={[0, 2]} tip={[-0.9, 2]} color={Theme.orange} />
            </Mafs>
          </div>
        </div>
      </div>

      <NoteSubSectionTitle id="conservative-vector-fields">17.1 Conservative Vector Fields</NoteSubSectionTitle>
      <NoteParagraph>
        A conservative vector field comes from a potential function. Moving through the field depends only on the start and end points, not the path taken.
      </NoteParagraph>
      <NoteParagraph>
        This is the vector-field version of having an antiderivative.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Potential Function">
          <MathBlock math="\vec{F}=\nabla f" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="fundamental-theorem-for-line-integrals">17.2 Fundamental Theorem for Line Integrals</NoteSubSectionTitle>
      <NoteParagraph>
        The Fundamental Theorem for Line Integrals says that integrating a gradient field along a path only cares about the endpoints.
      </NoteParagraph>
      <NoteParagraph>
        This mirrors the single-variable theorem: total change equals final potential minus initial potential.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Endpoint Rule">
          <MathBlock math="\int_C \nabla f\cdot d\vec{r}=f(\vec{r}(b))-f(\vec{r}(a))" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="green-s-theorem">17.3 Green's Theorem</NoteSubSectionTitle>
      <NoteParagraph>
        Green's Theorem connects circulation around a closed plane curve to curl-like behavior inside the region. It changes a boundary integral into a double integral.
      </NoteParagraph>
      <NoteParagraph>
        Intuitively, tiny rotations inside the region add up to the total circulation around the edge.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Circulation Form">
          <MathBlock math="\oint_C P\,dx+Q\,dy=\iint_R\left(\frac{\partial Q}{\partial x}-\frac{\partial P}{\partial y}\right)\,dA" />
          <NoteParagraph className="mb-0">
            For a plane field <InlineMath math="\vec{F}=\langle P,Q\rangle" />, <InlineMath math="P" /> is the horizontal component and <InlineMath math="Q" /> is the vertical component.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="curl">17.4 Curl</NoteSubSectionTitle>
      <NoteParagraph>
        Curl measures local rotation in a vector field. If a tiny paddle wheel placed in the field would spin, the field has curl there.
      </NoteParagraph>
      <NoteParagraph>
        The direction of curl gives the axis of rotation, and the magnitude gives rotational strength.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Curl">
          <MathBlock math="\nabla\times\vec{F}" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="divergence">17.5 Divergence</NoteSubSectionTitle>
      <NoteParagraph>
        Divergence measures local spreading or compressing. Positive divergence behaves like a source, while negative divergence behaves like a sink.
      </NoteParagraph>
      <NoteParagraph>
        It asks whether vectors are flowing out of a small region more than they flow in.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Divergence">
          <MathBlock math="\vec{F}=\langle P,Q,R\rangle,\qquad \nabla\cdot\vec{F}=\frac{\partial P}{\partial x}+\frac{\partial Q}{\partial y}+\frac{\partial R}{\partial z}" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="flux">17.6 Flux</NoteSubSectionTitle>
      <NoteParagraph>
        Flux measures how much a vector field passes through a curve or surface. It cares about the component of the field perpendicular to the boundary.
      </NoteParagraph>
      <NoteParagraph>
        If the field runs along the surface instead of through it, the flux is small or zero.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Flux Integral">
          <MathBlock math="\iint_S \vec{F}\cdot\vec{n}\,dS" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="stokes-theorem">17.7 Stokes' Theorem</NoteSubSectionTitle>
      <NoteParagraph>
        Stokes' Theorem is the 3D extension of Green's Theorem. It relates circulation around a boundary curve to curl across any surface spanning that boundary.
      </NoteParagraph>
      <NoteParagraph>
        The surface can bend through space, but the boundary circulation is controlled by the accumulated curl through it. The boundary direction and surface normal must use matching orientation.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Stokes">
          <MathBlock math="\oint_{\partial S}\vec{F}\cdot d\vec{r}=\iint_S(\nabla\times\vec{F})\cdot\vec{n}\,dS" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="divergence-theorem">17.8 Divergence Theorem</NoteSubSectionTitle>
      <NoteParagraph>
        The Divergence Theorem relates flux through a closed surface to divergence inside the volume. Sources inside the region account for net outward flow.
      </NoteParagraph>
      <NoteParagraph>
        It is the natural 3D statement that local spreading adds up to total outward flow through the boundary.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Divergence Theorem">
          <MathBlock math="\iint_{\partial E}\vec{F}\cdot\vec{n}\,dS=\iiint_E \nabla\cdot\vec{F}\,dV" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="conservative-field-tests">17.9 Conservative Field Tests</NoteSubSectionTitle>
      <NoteParagraph>
        Conservative fields are easiest to recognize when local rotation disappears and the domain has no holes. In that setting, zero curl means the field behaves like a gradient field.
      </NoteParagraph>
      <NoteParagraph>
        The domain condition matters because holes can hide global circulation even when the local curl is zero.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Curl-Free Test">
          <MathBlock math="\nabla\times\vec{F}=\vec{0}\quad \text{on a simply connected domain} \Rightarrow \vec{F}\text{ is conservative}" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="orientation-and-boundaries">17.10 Orientation and Boundaries</NoteSubSectionTitle>
      <NoteParagraph>
        Vector calculus theorems depend on consistent orientation. A boundary direction, normal vector, and region orientation must agree or the sign of the integral changes.
      </NoteParagraph>
      <NoteParagraph>
        Intuitively, the theorem is balancing two ways of measuring the same flow or rotation, so both measurements must face the same way.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Sign Awareness">
          <NoteParagraph className="mb-0">
            Reversing the orientation of a curve or surface reverses the sign of the corresponding line or flux integral.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      {/* 18. VARIATIONAL CALCULUS SECTION */}
      <NoteSectionTitle id="variational-calculus">18. Variational Calculus</NoteSectionTitle>
      <NoteParagraph>
        Variational calculus moves the optimization idea up one level. Instead of choosing a number or point that optimizes a function, we choose an entire function or path that optimizes a quantity.
      </NoteParagraph>
      <NoteParagraph>
        This is the calculus behind shortest paths, least action, optimal control, and many problems where the unknown object is a curve.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Notation to Know">
          <NoteParagraph>
            A functional like <InlineMath math="J[y]" /> takes an entire function <InlineMath math="y" /> as input and returns a number.
            The expression <InlineMath math="L(x,y,y')" /> is often called the Lagrangian, and it depends on the input, the function value, and the derivative.
          </NoteParagraph>
          <NoteParagraph className="mb-0">
            The symbol <InlineMath math="\delta" /> means variation, which is a tiny change to a whole function rather than a tiny change to a number.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>
      <div className={conceptPanelClass} aria-label="Variational calculus flow">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)_2rem_minmax(0,1fr)] md:items-stretch">
          <div className={conceptNodeClass}>
            <span className="font-bold">Candidate path</span>
            <span><InlineMath math="y(x)" /></span>
          </div>
          <div className={conceptArrowClass}>-&gt;</div>
          <div className={conceptNodeClass}>
            <span className="font-bold">Functional</span>
            <span><InlineMath math="J[y]=\int_a^b L(x,y,y')\,dx" /></span>
          </div>
          <div className={conceptArrowClass}>-&gt;</div>
          <div className={conceptNodeClass}>
            <span className="font-bold">Output number</span>
            <span>length, action, energy, or cost</span>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)] md:items-stretch">
          <div className={conceptNodeClass}>
            <span className="font-bold">Small variation</span>
            <span><InlineMath math="y+\epsilon\eta" /></span>
          </div>
          <div className={conceptArrowClass}>-&gt;</div>
          <div className={conceptNodeClass}>
            <span className="font-bold">Stationary check</span>
            <span><InlineMath math="\delta J=0" /></span>
          </div>
        </div>
        <p className={conceptCaptionClass}>
          Variational calculus changes an entire candidate path, then checks whether that small path-level change creates first-order change in the functional.
        </p>
      </div>

      <NoteSubSectionTitle id="functionals">18.1 Functionals</NoteSubSectionTitle>
      <NoteParagraph>
        A functional takes a function as input and returns a number. Ordinary functions eat points; functionals eat whole curves.
      </NoteParagraph>
      <NoteParagraph>
        This makes optimization feel different, but the intuition is familiar: change the input slightly and watch whether the output increases or decreases.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Typical Functional">
          <MathBlock math="J[y]=\int_a^b L(x,y,y')\,dx" />
          <NoteParagraph className="mb-0">
            The brackets in <InlineMath math="J[y]" /> emphasize that the input is the entire function <InlineMath math="y" />, not just one value of <InlineMath math="y" />.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="first-variation">18.2 First Variation</NoteSubSectionTitle>
      <NoteParagraph>
        The first variation is the derivative idea applied to a functional. It asks how the output changes when the entire candidate function is nudged.
      </NoteParagraph>
      <NoteParagraph>
        At an optimum, every allowed tiny variation should create no first-order change.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Stationary Condition">
          <MathBlock math="\delta J=0" />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="euler-lagrange-equation">18.3 Euler-Lagrange Equation</NoteSubSectionTitle>
      <NoteParagraph>
        The Euler-Lagrange equation is the differential equation that an optimizing path must satisfy. It turns an optimization-over-functions problem into a local equation.
      </NoteParagraph>
      <NoteParagraph>
        This mirrors ordinary optimization: derivative equals zero becomes a differential equation for the whole path.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Path Condition">
          <MathBlock math="\frac{\partial L}{\partial y}-\frac{d}{dx}\left(\frac{\partial L}{\partial y'}\right)=0" />
          <NoteParagraph className="mb-0">
            The term <InlineMath math="\frac{\partial L}{\partial y}" /> measures sensitivity to the path height, while <InlineMath math="\frac{\partial L}{\partial y'}" /> measures sensitivity to the path slope.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="constraints-in-variational-problems">18.4 Constraints in Variational Problems</NoteSubSectionTitle>
      <NoteParagraph>
        Variational problems often come with fixed endpoints, conserved quantities, or side conditions. These constraints decide which variations are allowed.
      </NoteParagraph>
      <NoteParagraph>
        The same geometric idea from constrained optimization remains: only changes that stay inside the rules count.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Boundary Condition">
          <NoteParagraph className="mb-0">
            Fixed endpoints mean variations vanish at the endpoints, so the interior path carries the optimization condition.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      {/* 19. COMPUTATIONAL CALCULUS SECTION */}
      <NoteSectionTitle id="computational-calculus">19. Computational Calculus</NoteSectionTitle>
      <NoteParagraph>
        Computational calculus asks how derivative and integral ideas are represented by algorithms. The concepts are the same, but approximation, error, and representation become part of the story.
      </NoteParagraph>
      <NoteParagraph>
        This is where calculus becomes a tool for simulation, optimization, graphics, and numerical science.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Notation to Know">
          <NoteParagraph>
            The symbol <InlineMath math="\approx" /> means approximately equal. In finite differences, <InlineMath math="h" /> is the chosen step size, not a value being pushed all the way to zero.
          </NoteParagraph>
          <NoteParagraph className="mb-0">
            In automatic differentiation, letters like <InlineMath math="L" />, <InlineMath math="z" />, <InlineMath math="y" />, and <InlineMath math="x" /> represent linked values in a computation graph, and the chain rule passes derivative information through those links.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>
      <div className={conceptPanelClass} aria-label="Computational calculus flow">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)_2rem_minmax(0,1fr)] md:items-stretch">
          <div className={conceptNodeClass}>
            <span className="font-bold">Calculus idea</span>
            <span>limit, derivative, integral, or gradient</span>
          </div>
          <div className={conceptArrowClass}>-&gt;</div>
          <div className={conceptNodeClass}>
            <span className="font-bold">Finite representation</span>
            <span>step size <InlineMath math="h" />, samples, or computation graph</span>
          </div>
          <div className={conceptArrowClass}>-&gt;</div>
          <div className={conceptNodeClass}>
            <span className="font-bold">Computed result</span>
            <span>approximate value or propagated derivative</span>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)] md:items-stretch">
          <div className={conceptNodeClass}>
            <span className="font-bold">Error check</span>
            <span>truncation, rounding, and stability</span>
          </div>
          <div className={conceptArrowClass}>-&gt;</div>
          <div className={conceptNodeClass}>
            <span className="font-bold">Refine the method</span>
            <span>change <InlineMath math="h" />, improve the rule, or restructure the computation</span>
          </div>
        </div>
        <p className={conceptCaptionClass}>
          Computational calculus turns a limiting idea into a finite process, then uses error behavior to decide whether the process is accurate enough.
        </p>
      </div>

      <NoteSubSectionTitle id="finite-differences">19.1 Finite Differences</NoteSubSectionTitle>
      <NoteParagraph>
        Finite differences approximate derivatives by using nearby sampled values. They are simple and useful, but the step size creates a tradeoff between approximation error and numerical error.
      </NoteParagraph>
      <NoteParagraph>
        The derivative is still a limiting idea; computation just chooses a small but nonzero step.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Derivative Approximation">
          <MathBlock math="f'(x)\approx \frac{f(x+h)-f(x)}{h}" />
          <NoteParagraph className="mb-0">
            This is the difference quotient with a small fixed <InlineMath math="h" />. It estimates the derivative instead of taking the full limit.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="automatic-differentiation">19.2 Automatic Differentiation</NoteSubSectionTitle>
      <NoteParagraph>
        Automatic differentiation computes derivatives of the executed operations by repeatedly applying the chain rule to the computation that produced the output.
      </NoteParagraph>
      <NoteParagraph>
        This is not symbolic algebra and not numerical differencing. It is calculus applied directly to a computation graph.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Chain Rule Through Code">
          <MathBlock math="\frac{dL}{dx}=\frac{dL}{dz}\frac{dz}{dy}\frac{dy}{dx}" />
          <NoteParagraph className="mb-0">
            Each factor is a local derivative between neighboring quantities. Multiplying them gives the effect of the original input on the final output.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="numerical-error">19.3 Numerical Error</NoteSubSectionTitle>
      <NoteParagraph>
        Numerical calculus always carries error from approximation, rounding, or discretization. A method is useful only when we understand how that error behaves.
      </NoteParagraph>
      <NoteParagraph>
        The intuition is that calculus gives the limiting truth, while computation asks how close a finite process gets to that truth.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Error Sources">
          <NoteParagraph className="mb-0">
            Smaller steps can reduce mathematical approximation error, but floating-point arithmetic and repeated operations can introduce their own instability.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>
    </NotesLayout>
  );
}
