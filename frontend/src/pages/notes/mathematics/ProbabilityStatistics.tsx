/**
 * Probability and Statistics Notes Page
 * A standalone overview of probability and statistics for computing.
 */

import { useMemo, useState, type ReactNode } from 'react';
import { NotesLayout } from '../../../components/notes/NotesLayout';
import {
  CodeBlock,
  InlineMath,
  InteractiveBlock,
  MathBlock,
  NoteHeader,
  NoteParagraph,
  NoteSectionTitle,
  NoteSubSectionTitle,
  NoteTopicBlock,
  NoteTopicGroup,
} from '../../../components/notes';
import { useDarkMode } from '../../../hooks/useDarkMode';
import { getRunnerPlayLabel, toggleOrReplayRunner, useAutoRunner } from '../../../components/notes/useAutoRunner';

type TableRow = ReactNode[];
type DistributionView = 'pmf' | 'pdf' | 'cdf';
type LegendItem = {
  label: ReactNode;
  color: string;
  hollow?: boolean;
};

const round = (value: number, digits = 3) => Number(value.toFixed(digits));
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const percent = (value: number, digits = 1) => `${round(value * 100, digits)}%`;
const reservoirStream = Array.from({ length: 24 }, (_, index) => String.fromCharCode(65 + index));

const couponCollectorCode = `
def collect_all_coupon_types(types, rng, max_draws=180):
    seen = set()
    yield 0, None, False, 0
    for draw in range(1, max_draws + 1):
        coupon = rng.randrange(types)
        is_new = coupon not in seen
        seen.add(coupon)
        yield draw, coupon, is_new, len(seen)
        if len(seen) == types:
            break
`;

const reservoirSamplingCode = `
def reservoir_sample(stream, k, rng):
    reservoir = []
    for i, item in enumerate(stream, start=1):
        if i <= k:
            reservoir.append(item)
        else:
            j = rng.randrange(i)
            if j < k:
                reservoir[j] = item
        yield i, item, list(reservoir)
`;

function pseudoUniform(index: number, seed = 0) {
  const raw = Math.sin((index + seed * 101) * 12.9898 + 78.233 + seed * 37.719) * 43758.5453;
  return raw - Math.floor(raw);
}

function choose(n: number, k: number) {
  if (k < 0 || k > n) return 0;
  const r = Math.min(k, n - k);
  let value = 1;
  for (let i = 1; i <= r; i += 1) {
    value = (value * (n - r + i)) / i;
  }
  return value;
}

function normalPdf(x: number) {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

function erfApprox(x: number) {
  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * absX);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const y = 1 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);
  return sign * y;
}

function normalCdf(z: number) {
  return 0.5 * (1 + erfApprox(z / Math.sqrt(2)));
}

function useProbabilityTheme() {
  const { isDarkMode } = useDarkMode();

  const subtlePanelClass = isDarkMode
    ? 'bg-green-500/5 border-green-500/20 text-green-100'
    : 'bg-slate-50 border-slate-200 text-slate-700';
  const listClass = `list-disc pl-6 mb-6 font-mono text-sm leading-relaxed space-y-2 ${
    isDarkMode ? 'text-green-100/90' : 'text-slate-700'
  }`;
  const tableClass = `w-full border-collapse overflow-hidden rounded-lg font-mono text-sm ${
    isDarkMode ? 'text-green-100' : 'text-slate-700'
  }`;
  const tableHeadClass = isDarkMode ? 'bg-green-500/15 text-green-300' : 'bg-slate-100 text-slate-800';
  const tableCellClass = isDarkMode ? 'border border-green-500/20' : 'border border-slate-200';
  const axisColor = isDarkMode ? '#86efac66' : '#94a3b8';
  const textColor = isDarkMode ? '#bbf7d0' : '#334155';
  const primaryColor = isDarkMode ? '#4ade80' : '#2563eb';
  const secondaryColor = isDarkMode ? '#fb923c' : '#ea580c';

  return {
    isDarkMode,
    subtlePanelClass,
    listClass,
    tableClass,
    tableHeadClass,
    tableCellClass,
    axisColor,
    textColor,
    primaryColor,
    secondaryColor,
  };
}

function BulletList({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { listClass } = useProbabilityTheme();
  return <ul className={`${listClass} ${className}`}>{children}</ul>;
}

function NoteTable({ headers, rows }: { headers: ReactNode[]; rows: TableRow[] }) {
  const { tableClass, tableHeadClass, tableCellClass } = useProbabilityTheme();

  return (
    <div className="mb-8 overflow-x-auto">
      <table className={tableClass}>
        <thead className={tableHeadClass}>
          <tr>
            {headers.map((header, index) => (
              <th key={index} className={`p-3 text-left ${tableCellClass}`}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className={`p-3 align-top ${tableCellClass}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function VisualLegend({ items }: { items: LegendItem[] }) {
  const { isDarkMode } = useProbabilityTheme();

  return (
    <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2 text-xs">
      {items.map((item, index) => (
        <span key={index} className="inline-flex items-center gap-2">
          <span
            className="h-3 w-3 shrink-0 rounded-sm border"
            style={{
              backgroundColor: item.hollow ? 'transparent' : item.color,
              borderColor: item.color,
              opacity: item.hollow ? 1 : isDarkMode ? 0.9 : 0.75,
            }}
          />
          <span>{item.label}</span>
        </span>
      ))}
    </div>
  );
}

function NotationGuide() {
  return (
    <NoteTopicGroup>
      <NoteTopicBlock title="Notation Used Throughout">
        <BulletList className="mb-0">
          <li><InlineMath math="\Omega" /> is the sample space, the set of all possible outcomes.</li>
          <li><InlineMath math="\omega" /> is one outcome, while events such as <InlineMath math="A" /> and <InlineMath math="B" /> are subsets of <InlineMath math="\Omega" />.</li>
          <li><InlineMath math="\Pr(A)" /> is the probability that event <InlineMath math="A" /> happens.</li>
          <li><InlineMath math="A^c" /> is the complement of <InlineMath math="A" />: all outcomes where <InlineMath math="A" /> does not happen.</li>
          <li><InlineMath math="A\cup B" />, <InlineMath math="A\cap B" />, and <InlineMath math="A\setminus B" /> mean union, intersection, and difference.</li>
          <li><InlineMath math="X:\Omega\to\mathbb R" /> means <InlineMath math="X" /> is a random variable, a function from outcomes to numbers.</li>
          <li>For discrete <InlineMath math="X" />, <InlineMath math="f_X(x)=\Pr(X=x)" /> is a PMF; for continuous <InlineMath math="X" />, <InlineMath math="f_X" /> is a PDF.</li>
          <li><InlineMath math="F_X(x)=\Pr(X\le x)" /> is the CDF, the accumulated probability up to <InlineMath math="x" />.</li>
          <li><InlineMath math="\mathbb E[X]" /> is expectation, <InlineMath math="\operatorname{Var}(X)" /> is variance, and <InlineMath math="\sigma_X" /> is standard deviation.</li>
          <li><InlineMath math="X\sim\operatorname{Binomial}(n,p)" /> means <InlineMath math="X" /> has the named distribution with parameters <InlineMath math="n,p" />.</li>
          <li><InlineMath math="\binom nk" /> counts ways to choose <InlineMath math="k" /> objects from <InlineMath math="n" /> without order.</li>
          <li><InlineMath math="\widehat p" /> is an estimator for an unknown population fraction <InlineMath math="p" />.</li>
        </BulletList>
      </NoteTopicBlock>
    </NoteTopicGroup>
  );
}

function SampleSpaceDiagram() {
  const { isDarkMode, subtlePanelClass, primaryColor, secondaryColor, axisColor, textColor } = useProbabilityTheme();
  const outcomes = ['HHH', 'HHT', 'HTH', 'HTT', 'THH', 'THT', 'TTH', 'TTT'];
  const eventOptions = [
    { label: 'Exactly one tail', description: 'exactly one tail', outcomes: ['HHT', 'HTH', 'THH'] },
    { label: 'At least two heads', description: 'at least two heads', outcomes: ['HHH', 'HHT', 'HTH', 'THH'] },
    { label: 'Starts with H', description: 'a first toss of heads', outcomes: ['HHH', 'HHT', 'HTH', 'HTT'] },
    { label: 'All same', description: 'all tosses matching', outcomes: ['HHH', 'TTT'] },
  ];
  const [selectedEventIndex, setSelectedEventIndex] = useState(0);
  const selectedEvent = eventOptions[selectedEventIndex];
  const event = new Set(selectedEvent.outcomes);
  const cellWidth = 78;
  const cellHeight = 42;
  const gap = 14;
  const left = 35;
  const top = 32;
  const buttonClass = (selected: boolean) =>
    `rounded-md border px-3 py-2 text-left text-xs font-bold transition-colors ${
      selected
        ? isDarkMode
          ? 'border-green-400 bg-green-400 text-black'
          : 'border-blue-500 bg-blue-500 text-white'
        : isDarkMode
          ? 'border-green-500/30 bg-black/30 text-green-200 hover:bg-green-500/10'
          : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-100'
    }`;

  return (
    <div className={`mb-8 rounded-lg border p-4 ${subtlePanelClass}`}>
      <p className="mb-3 text-sm font-bold uppercase tracking-wider">Sample space as cells</p>
      <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {eventOptions.map((option, index) => (
          <button key={option.label} type="button" className={buttonClass(index === selectedEventIndex)} onClick={() => setSelectedEventIndex(index)}>
            {option.label}
          </button>
        ))}
      </div>
      <svg viewBox="0 0 425 162" className="h-44 w-full" role="img" aria-label="Coin toss sample space with an event highlighted">
        <rect x="18" y="18" width="389" height="126" rx="8" fill="none" stroke={axisColor} strokeWidth="2" />
        {outcomes.map((outcome, index) => {
          const column = index % 4;
          const row = Math.floor(index / 4);
          const x = left + column * (cellWidth + gap);
          const y = top + row * (cellHeight + gap);
          const inEvent = event.has(outcome);

          return (
            <g key={outcome}>
              <rect
                x={x}
                y={y}
                width={cellWidth}
                height={cellHeight}
                rx="6"
                fill={inEvent ? secondaryColor : primaryColor}
                fillOpacity={inEvent ? 0.3 : 0.12}
                stroke={inEvent ? secondaryColor : axisColor}
                strokeWidth={inEvent ? 2.5 : 1.5}
              />
              <text x={x + cellWidth / 2} y={y + 26} textAnchor="middle" fontFamily="monospace" fontSize="15" fill={textColor}>
                {outcome}
              </text>
            </g>
          );
        })}
      </svg>
      <VisualLegend
        items={[
          { label: `event: ${selectedEvent.description}`, color: secondaryColor },
          { label: 'other outcomes', color: primaryColor },
          { label: <InlineMath math="\Omega" />, color: axisColor, hollow: true },
        ]}
      />
      <NoteParagraph className="mb-0 text-sm">
        The highlighted event is {selectedEvent.description}. In the uniform model its probability is{' '}
        <InlineMath math={`${selectedEvent.outcomes.length}/8`} /> because {selectedEvent.outcomes.length} of the eight equally likely outcomes
        are in the event.
      </NoteParagraph>
    </div>
  );
}

function ProbabilityRulesDiagram() {
  const { subtlePanelClass, primaryColor, secondaryColor, axisColor, textColor } = useProbabilityTheme();

  return (
    <div className={`mb-8 rounded-lg border p-4 ${subtlePanelClass}`}>
      <p className="mb-3 text-sm font-bold uppercase tracking-wider">Events as regions</p>
      <svg viewBox="0 0 430 160" className="h-48 w-full" role="img" aria-label="Venn diagram for union and intersection">
        <defs>
          <clipPath id="probability-rules-a">
            <circle cx="170" cy="82" r="56" />
          </clipPath>
        </defs>
        <rect x="18" y="18" width="394" height="124" rx="10" fill="none" stroke={axisColor} strokeWidth="2" />
        <circle cx="170" cy="82" r="56" fill={primaryColor} fillOpacity="0.26" stroke={primaryColor} strokeWidth="3" />
        <circle cx="245" cy="82" r="56" fill={secondaryColor} fillOpacity="0.28" stroke={secondaryColor} strokeWidth="3" />
        <g clipPath="url(#probability-rules-a)">
          <circle cx="245" cy="82" r="56" fill={secondaryColor} fillOpacity="0.42" />
        </g>
        <text x="130" y="86" textAnchor="middle" fontFamily="monospace" fontSize="18" fill={textColor}>A</text>
        <text x="286" y="86" textAnchor="middle" fontFamily="monospace" fontSize="18" fill={textColor}>B</text>
      </svg>
      <VisualLegend
        items={[
          { label: <InlineMath math="A" />, color: primaryColor },
          { label: <InlineMath math="B" />, color: secondaryColor },
          { label: <InlineMath math="A\cap B" />, color: secondaryColor },
          { label: <InlineMath math="\Omega" />, color: axisColor, hollow: true },
        ]}
      />
      <NoteParagraph className="mb-0 text-sm">
        Inclusion-exclusion is a visual bookkeeping rule: add the two event regions, then subtract the overlap that was counted twice.
      </NoteParagraph>
    </div>
  );
}

function ConditionalProbabilityDiagram() {
  const { subtlePanelClass, primaryColor, secondaryColor, axisColor, textColor } = useProbabilityTheme();

  return (
    <div className={`mb-8 rounded-lg border p-4 ${subtlePanelClass}`}>
      <p className="mb-3 text-sm font-bold uppercase tracking-wider">Conditioning shrinks the universe</p>
      <svg viewBox="0 0 520 215" className="h-64 w-full" role="img" aria-label="Conditioning changes the sample space from all outcomes to only event B">
        <defs>
          <clipPath id="conditional-left-b">
            <circle cx="142" cy="105" r="52" />
          </clipPath>
          <marker id="conditional-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="strokeWidth">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={axisColor} />
          </marker>
        </defs>

        <rect x="18" y="26" width="195" height="158" rx="10" fill="none" stroke={axisColor} strokeWidth="2" />
        <text x="30" y="50" fontFamily="monospace" fontSize="13" fill={textColor}>before</text>
        <text x="192" y="173" textAnchor="end" fontFamily="monospace" fontSize="13" fill={axisColor}>Omega</text>
        <circle cx="88" cy="105" r="52" fill={primaryColor} fillOpacity="0.18" stroke={primaryColor} strokeWidth="2.5" />
        <circle cx="142" cy="105" r="52" fill={secondaryColor} fillOpacity="0.2" stroke={secondaryColor} strokeWidth="2.5" />
        <g clipPath="url(#conditional-left-b)">
          <circle cx="88" cy="105" r="52" fill={primaryColor} fillOpacity="0.34" stroke="none" />
        </g>
        <text x="58" y="111" textAnchor="middle" fontFamily="monospace" fontSize="16" fill={textColor}>A</text>
        <text x="172" y="111" textAnchor="middle" fontFamily="monospace" fontSize="16" fill={textColor}>B</text>

        <line x1="235" y1="105" x2="286" y2="105" stroke={axisColor} strokeWidth="2.5" markerEnd="url(#conditional-arrow)" />
        <text x="260" y="89" textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>learn B</text>

        <rect x="310" y="26" width="195" height="158" rx="10" fill={secondaryColor} fillOpacity="0.08" stroke={secondaryColor} strokeWidth="3" />
        <text x="322" y="50" fontFamily="monospace" fontSize="13" fill={textColor}>after</text>
        <text x="486" y="173" textAnchor="end" fontFamily="monospace" fontSize="13" fill={secondaryColor}>new universe: B</text>
        <rect x="340" y="72" width="136" height="72" rx="8" fill={secondaryColor} fillOpacity="0.12" stroke={axisColor} strokeWidth="1.5" />
        <rect x="340" y="72" width="56" height="72" rx="8" fill={primaryColor} fillOpacity="0.34" stroke={primaryColor} strokeWidth="2.5" />
        <line x1="396" y1="73" x2="396" y2="143" stroke={primaryColor} strokeWidth="2" strokeDasharray="5 5" />
        <text x="368" y="112" textAnchor="middle" fontFamily="monospace" fontSize="13" fill={textColor}>{'A ∩ B'}</text>
        <text x="438" y="112" textAnchor="middle" fontFamily="monospace" fontSize="13" fill={textColor}>{'B \\ A'}</text>
      </svg>
      <VisualLegend
        items={[
          { label: <InlineMath math="B" />, color: secondaryColor },
          { label: <InlineMath math="A\cap B" />, color: primaryColor },
          { label: 'removed outcomes outside B', color: axisColor, hollow: true },
        ]}
      />
      <NoteParagraph className="mb-0 text-sm">
        The left side shows the original sample space. After learning <InlineMath math="B" />, every outcome outside <InlineMath math="B" /> is
        discarded, so the right side uses <InlineMath math="B" /> as the whole universe. Then <InlineMath math="\Pr(A\mid B)" /> is the fraction
        of that new universe that also lies in <InlineMath math="A" />.
      </NoteParagraph>
    </div>
  );
}

function ProductRuleTreeDiagram() {
  const { subtlePanelClass, primaryColor, secondaryColor, axisColor, textColor } = useProbabilityTheme();
  const nodeRadius = 14;
  const complement = (symbol: string) => (
    <>
      {symbol}
      <tspan baselineShift="super" fontSize="9">c</tspan>
    </>
  );
  const probability = (event: ReactNode) => <>P({event})</>;
  const conditional = (event: ReactNode, given: ReactNode) => <>P({event}|{given})</>;
  const node = (x: number, y: number, label: ReactNode, highlighted = false) => (
    <g>
      <circle cx={x} cy={y} r={nodeRadius} fill={highlighted ? secondaryColor : primaryColor} fillOpacity={highlighted ? 0.24 : 0.12} stroke={highlighted ? secondaryColor : primaryColor} strokeWidth="2.5" />
      <text x={x} y={y + 5} textAnchor="middle" fontFamily="monospace" fontSize="13" fill={textColor}>{label}</text>
    </g>
  );
  const branch = (x1: number, y1: number, x2: number, y2: number, label: ReactNode, highlighted = false) => (
    (() => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const distance = Math.hypot(dx, dy);
      const trimX = distance === 0 ? 0 : (dx / distance) * nodeRadius;
      const trimY = distance === 0 ? 0 : (dy / distance) * nodeRadius;
      const startX = x1 + trimX;
      const startY = y1 + trimY;
      const endX = x2 - trimX;
      const endY = y2 - trimY;

      return (
        <g>
          <line x1={startX} y1={startY} x2={endX} y2={endY} stroke={highlighted ? secondaryColor : axisColor} strokeWidth={highlighted ? 3 : 2} strokeLinecap="round" />
          <text x={(startX + endX) / 2} y={(startY + endY) / 2 - 8} textAnchor="middle" fontFamily="monospace" fontSize="11" fill={highlighted ? secondaryColor : textColor}>
            {label}
          </text>
        </g>
      );
    })()
  );

  return (
    <div className={`mb-8 rounded-lg border p-4 ${subtlePanelClass}`}>
      <p className="mb-3 text-sm font-bold uppercase tracking-wider">Tree paths multiply</p>
      <svg viewBox="0 0 520 220" className="h-64 w-full" role="img" aria-label="Probability tree showing product rule along one path">
        {branch(42, 110, 180, 64, probability('A'), true)}
        {branch(42, 110, 180, 156, probability(complement('A')))}
        {branch(180, 64, 360, 36, conditional('B', 'A'), true)}
        {branch(180, 64, 360, 92, conditional(complement('B'), 'A'))}
        {branch(180, 156, 360, 128, conditional('B', complement('A')))}
        {branch(180, 156, 360, 184, conditional(complement('B'), complement('A')))}
        {node(42, 110, 'S')}
        <text x="42" y="142" textAnchor="middle" fontFamily="monospace" fontSize="11" fill={textColor}>start</text>
        {node(180, 64, 'A', true)}
        {node(180, 156, complement('A'))}
        {node(360, 36, 'B', true)}
        {node(360, 92, complement('B'))}
        {node(360, 128, 'B')}
        {node(360, 184, complement('B'))}
        <rect x="410" y="22" width="88" height="34" rx="7" fill={secondaryColor} fillOpacity="0.18" stroke={secondaryColor} strokeWidth="2" />
        <text x="454" y="44" textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>{'A ∩ B'}</text>
      </svg>
      <VisualLegend
        items={[
          { label: 'chosen path', color: secondaryColor },
          { label: 'other paths', color: axisColor, hollow: true },
        ]}
      />
      <NoteParagraph className="mb-0 text-sm">
        Each complete path is a joint event. The highlighted path has probability <InlineMath math="\Pr(A)\Pr(B\mid A)" />. The labels{' '}
        <InlineMath math="A^c" /> and <InlineMath math="B^c" /> mark the complementary branches.
      </NoteParagraph>
    </div>
  );
}

function UniformIntervalDiagram() {
  const { isDarkMode, subtlePanelClass, primaryColor, secondaryColor, axisColor, textColor } = useProbabilityTheme();
  const [leftEndpointPct, setLeftEndpointPct] = useState(25);
  const [rightEndpointPct, setRightEndpointPct] = useState(70);
  const lowerPct = Math.min(leftEndpointPct, rightEndpointPct);
  const upperPct = Math.max(leftEndpointPct, rightEndpointPct);
  const lower = lowerPct / 100;
  const upper = upperPct / 100;
  const intervalLength = upper - lower;
  const axisLeft = 40;
  const width = 360;
  const x = (valuePct: number) => axisLeft + (valuePct / 100) * width;

  return (
    <InteractiveBlock title="Uniform Interval Probability">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(240px,300px)_minmax(0,1fr)]">
        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="uniform-left">
            <span>First endpoint</span>
            <span>{round(leftEndpointPct / 100, 2)}</span>
          </label>
          <input id="uniform-left" type="range" min="0" max="100" step="5" value={leftEndpointPct} onChange={(event) => setLeftEndpointPct(Number(event.target.value))} className="mb-4 w-full" />
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="uniform-right">
            <span>Second endpoint</span>
            <span>{round(rightEndpointPct / 100, 2)}</span>
          </label>
          <input id="uniform-right" type="range" min="0" max="100" step="5" value={rightEndpointPct} onChange={(event) => setRightEndpointPct(Number(event.target.value))} className="w-full" />
          <NoteParagraph className="mb-0 mt-4 text-sm">
            The order of the endpoints does not matter. The probability is the distance between them.
          </NoteParagraph>
        </div>

        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <svg viewBox="0 0 440 140" className="h-40 w-full" role="img" aria-label="Uniform probability on an adjustable interval">
            <line x1={axisLeft} y1="70" x2={axisLeft + width} y2="70" stroke={axisColor} strokeWidth="4" strokeLinecap="round" />
            <line x1={x(lowerPct)} y1="70" x2={x(upperPct)} y2="70" stroke={secondaryColor} strokeWidth="14" strokeLinecap="round" />
            {[0, 25, 50, 75, 100].map((value) => (
              <g key={value}>
                <line x1={x(value)} y1="56" x2={x(value)} y2="84" stroke={value === 0 || value === 100 ? primaryColor : axisColor} strokeWidth="1.5" />
              </g>
            ))}
            {[lowerPct, upperPct].map((value, index) => (
              <g key={`${value}-${index}`}>
                <line x1={x(value)} y1="47" x2={x(value)} y2="93" stroke={secondaryColor} strokeWidth="2.5" />
                <circle cx={x(value)} cy="70" r="5" fill={isDarkMode ? '#020617' : '#ffffff'} stroke={secondaryColor} strokeWidth="2.5" />
              </g>
            ))}
            <text x={axisLeft} y="116" textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>0</text>
            <text x={axisLeft + width} y="116" textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>1</text>
          </svg>
          <VisualLegend
            items={[
              { label: <InlineMath math={`${round(lower, 2)}\\le X\\le ${round(upper, 2)}`} />, color: secondaryColor },
              { label: 'outside interval', color: axisColor, hollow: true },
            ]}
          />
          <NoteParagraph className="mb-0 text-sm">
            For <InlineMath math="X\sim\operatorname{Uniform}[0,1]" />, probability is length:{' '}
            <InlineMath math={`\\Pr(${round(lower, 2)}\\le X\\le ${round(upper, 2)})=${round(intervalLength, 2)}`} />.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function DistributionShapeExplorer() {
  const { isDarkMode, subtlePanelClass, primaryColor, secondaryColor, axisColor, textColor } = useProbabilityTheme();
  const [view, setView] = useState<DistributionView>('pmf');
  const chart = { width: 430, height: 230, left: 34, top: 20, plotWidth: 360, plotHeight: 160 };
  const baseY = chart.top + chart.plotHeight;
  const xCoord = (value: number) => chart.left + ((value + 3) / 6) * chart.plotWidth;
  const yCoord = (value: number, maxValue = 1) => chart.top + chart.plotHeight - (value / maxValue) * chart.plotHeight;
  const curvePoints = Array.from({ length: 120 }, (_, index) => {
    const x = -3 + (6 * index) / 119;
    return { x, pdf: normalPdf(x), cdf: normalCdf(x) };
  });
  const pdfPath = curvePoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${xCoord(point.x)} ${yCoord(point.pdf, normalPdf(0))}`).join(' ');
  const cdfPath = curvePoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${xCoord(point.x)} ${yCoord(point.cdf)}`).join(' ');
  const intervalPoints = curvePoints.filter((point) => point.x >= -1 && point.x <= 1);
  const intervalPath = intervalPoints.length
    ? `M ${xCoord(-1)} ${baseY} ${intervalPoints.map((point) => `L ${xCoord(point.x)} ${yCoord(point.pdf, normalPdf(0))}`).join(' ')} L ${xCoord(1)} ${baseY} Z`
    : '';
  const pmfRows = Array.from({ length: 9 }, (_, k) => ({ k, probability: choose(8, k) * 0.45 ** k * 0.55 ** (8 - k) }));
  const maxPmf = Math.max(...pmfRows.map((row) => row.probability));
  const pmfMaxK = pmfRows.length - 1;
  const pmfBarWidth = Math.min(24, (chart.plotWidth / (pmfRows.length + 1)) * 0.72);
  const pmfXCoord = (k: number) => chart.left + (k / pmfMaxK) * chart.plotWidth;
  const buttonClass = (selected: boolean) =>
    `rounded-md border px-3 py-2 text-sm font-bold transition-colors ${
      selected
        ? isDarkMode
          ? 'border-green-400 bg-green-400 text-black'
          : 'border-blue-500 bg-blue-500 text-white'
        : isDarkMode
          ? 'border-green-500/30 bg-black/30 text-green-200 hover:bg-green-500/10'
          : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-100'
    }`;
  const caption =
    view === 'pmf'
      ? 'A PMF puts probability mass on exact values.'
      : view === 'pdf'
        ? 'A PDF uses area over intervals; the curve height itself is not a point probability.'
        : 'A CDF is accumulated probability, so it can only stay flat or increase.';

  return (
    <InteractiveBlock title="PMF, PDF, and CDF Shapes">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(220px,270px)_minmax(0,1fr)]">
        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <p className="mb-3 text-sm font-bold uppercase tracking-wider">View</p>
          <div className="grid grid-cols-3 gap-2">
            {(['pmf', 'pdf', 'cdf'] as DistributionView[]).map((option) => (
              <button key={option} type="button" className={buttonClass(view === option)} onClick={() => setView(option)}>
                {option.toUpperCase()}
              </button>
            ))}
          </div>
          <NoteParagraph className="mb-0 mt-4 text-sm">{caption}</NoteParagraph>
        </div>

        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className="h-64 w-full" role="img" aria-label={`${view.toUpperCase()} shape`}>
            <line x1={chart.left} y1={baseY} x2={chart.left + chart.plotWidth} y2={baseY} stroke={axisColor} strokeWidth="2" />
            <line x1={chart.left} y1={chart.top} x2={chart.left} y2={baseY} stroke={axisColor} strokeWidth="2" />
            {view === 'pmf' && (
              <>
                {pmfRows.map((row) => {
                  const x = clamp(pmfXCoord(row.k) - pmfBarWidth / 2, chart.left, chart.left + chart.plotWidth - pmfBarWidth);
                  const height = (row.probability / maxPmf) * chart.plotHeight;
                  return (
                    <rect
                      key={row.k}
                      x={x}
                      y={baseY - height}
                      width={pmfBarWidth}
                      height={height}
                      rx="2"
                      fill={row.k <= 4 ? secondaryColor : primaryColor}
                      opacity={isDarkMode ? 0.9 : 0.8}
                    />
                  );
                })}
                {[0, 4, 8].map((tick) => (
                  <g key={tick}>
                    <line x1={pmfXCoord(tick)} y1={baseY} x2={pmfXCoord(tick)} y2={baseY + 6} stroke={axisColor} strokeWidth="1.5" />
                    <text x={pmfXCoord(tick)} y={chart.height - 12} textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>{tick}</text>
                  </g>
                ))}
              </>
            )}
            {view === 'pdf' && (
              <>
                <path d={intervalPath} fill={secondaryColor} fillOpacity="0.28" />
                <path d={pdfPath} fill="none" stroke={primaryColor} strokeWidth="3" />
                <line x1={xCoord(-1)} y1={baseY} x2={xCoord(-1)} y2={yCoord(normalPdf(-1), normalPdf(0))} stroke={secondaryColor} strokeWidth="2" />
                <line x1={xCoord(1)} y1={baseY} x2={xCoord(1)} y2={yCoord(normalPdf(1), normalPdf(0))} stroke={secondaryColor} strokeWidth="2" />
                <text x={xCoord(-1)} y={chart.height - 12} textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>a</text>
                <text x={xCoord(1)} y={chart.height - 12} textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>b</text>
              </>
            )}
            {view === 'cdf' && (
              <>
                <path d={cdfPath} fill="none" stroke={primaryColor} strokeWidth="3" />
                <line x1={xCoord(0.8)} y1={baseY} x2={xCoord(0.8)} y2={yCoord(normalCdf(0.8))} stroke={secondaryColor} strokeWidth="2" strokeDasharray="5 4" />
                <line x1={chart.left} y1={yCoord(normalCdf(0.8))} x2={xCoord(0.8)} y2={yCoord(normalCdf(0.8))} stroke={secondaryColor} strokeWidth="2" strokeDasharray="5 4" />
                <text x={xCoord(0.8)} y={chart.height - 12} textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>x</text>
              </>
            )}
          </svg>
          <VisualLegend
            items={[
              { label: view.toUpperCase(), color: primaryColor },
              { label: view === 'pmf' ? <InlineMath math="X\le 4" /> : view === 'pdf' ? <InlineMath math="a\le X\le b" /> : <InlineMath math="F_X(x)" />, color: secondaryColor },
            ]}
          />
          <NoteParagraph className="mb-0 text-sm">
            {view === 'pmf' && <>The shaded bars show <InlineMath math="\Pr(X\le 4)" /> for a discrete count.</>}
            {view === 'pdf' && <>The shaded area shows <InlineMath math="\Pr(a\le X\le b)" /> for a continuous value.</>}
            {view === 'cdf' && <>The curve height at <InlineMath math="x" /> is <InlineMath math="F_X(x)=\Pr(X\le x)" />.</>}
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function BayesExplorer() {
  const { isDarkMode, subtlePanelClass, primaryColor, secondaryColor, axisColor } = useProbabilityTheme();
  const [priorPct, setPriorPct] = useState(5);
  const [sensitivityPct, setSensitivityPct] = useState(95);
  const [falsePositivePct, setFalsePositivePct] = useState(10);

  const prior = priorPct / 100;
  const sensitivity = sensitivityPct / 100;
  const falsePositive = falsePositivePct / 100;
  const evidence = sensitivity * prior + falsePositive * (1 - prior);
  const posterior = evidence === 0 ? 0 : (sensitivity * prior) / evidence;
  const barClass = isDarkMode ? 'bg-green-400' : 'bg-blue-500';
  const trackClass = isDarkMode ? 'bg-black/40' : 'bg-slate-200';
  const truePositiveCells = Math.round(sensitivity * prior * 100);
  const falseNegativeCells = Math.round((1 - sensitivity) * prior * 100);
  const falsePositiveCells = Math.round(falsePositive * (1 - prior) * 100);
  const trueNegativeCells = Math.max(0, 100 - truePositiveCells - falseNegativeCells - falsePositiveCells);
  const populationCells = [
    ...Array.from({ length: truePositiveCells }, () => 'true-positive'),
    ...Array.from({ length: falsePositiveCells }, () => 'false-positive'),
    ...Array.from({ length: falseNegativeCells }, () => 'false-negative'),
    ...Array.from({ length: trueNegativeCells }, () => 'true-negative'),
  ];
  const cellFill = (kind: string) => {
    if (kind === 'true-positive') return secondaryColor;
    if (kind === 'false-positive') return primaryColor;
    if (kind === 'false-negative') return axisColor;
    return 'transparent';
  };
  const cellStroke = (kind: string) => (kind === 'true-negative' ? axisColor : cellFill(kind));

  return (
    <InteractiveBlock title="Bayes Update">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(240px,300px)_minmax(0,1fr)]">
        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="bayes-prior">
            <span>Prior <InlineMath math="\Pr(H)" /></span>
            <span>{priorPct}%</span>
          </label>
          <input id="bayes-prior" type="range" min="1" max="50" value={priorPct} onChange={(event) => setPriorPct(Number(event.target.value))} className="mb-4 w-full" />
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="bayes-sensitivity">
            <span>Sensitivity <InlineMath math="\Pr(+\mid H)" /></span>
            <span>{sensitivityPct}%</span>
          </label>
          <input id="bayes-sensitivity" type="range" min="50" max="99" value={sensitivityPct} onChange={(event) => setSensitivityPct(Number(event.target.value))} className="mb-4 w-full" />
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="bayes-false-positive">
            <span>False positive <InlineMath math="\Pr(+\mid H^c)" /></span>
            <span>{falsePositivePct}%</span>
          </label>
          <input id="bayes-false-positive" type="range" min="1" max="50" value={falsePositivePct} onChange={(event) => setFalsePositivePct(Number(event.target.value))} className="w-full" />
        </div>

        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <p className="mb-3 text-sm font-bold uppercase tracking-wider">Expected cases out of 100</p>
          <svg viewBox="0 0 180 150" className="mb-4 h-44 w-full" role="img" aria-label="Bayes population grid">
            {populationCells.map((kind, index) => {
              const column = index % 10;
              const row = Math.floor(index / 10);
              return (
                <rect
                  key={`${kind}-${index}`}
                  x={12 + column * 16}
                  y={12 + row * 14}
                  width="11"
                  height="11"
                  rx="2"
                  fill={cellFill(kind)}
                  fillOpacity={kind === 'true-negative' ? 0 : 0.72}
                  stroke={cellStroke(kind)}
                  strokeOpacity={kind === 'true-negative' ? 0.35 : 0.9}
                />
              );
            })}
          </svg>
          <VisualLegend
            items={[
              { label: 'true positive', color: secondaryColor },
              { label: 'false positive', color: primaryColor },
              { label: 'missed case', color: axisColor },
              { label: 'negative', color: axisColor, hollow: true },
            ]}
          />
          <div className="mb-4 grid gap-2 text-xs sm:grid-cols-2">
            <div className={`rounded-md border p-2 ${isDarkMode ? 'border-green-500/20 bg-black/20' : 'border-slate-200 bg-white/70'}`}>
              <div className="font-bold">Positive tests</div>
              <div>{truePositiveCells + falsePositiveCells} out of 100</div>
            </div>
            <div className={`rounded-md border p-2 ${isDarkMode ? 'border-green-500/20 bg-black/20' : 'border-slate-200 bg-white/70'}`}>
              <div className="font-bold">True positives</div>
              <div>{truePositiveCells} out of 100</div>
            </div>
          </div>
          <MathBlock math={String.raw`\Pr(H\mid +)=\frac{\Pr(+\mid H)\Pr(H)}{\Pr(+\mid H)\Pr(H)+\Pr(+\mid H^c)\Pr(H^c)}`} />
          <div className="mb-4">
            <div className="mb-1 flex justify-between text-sm">
              <span>Updated belief after positive evidence</span>
              <strong>{percent(posterior, 2)}</strong>
            </div>
            <div className={`h-4 rounded ${trackClass}`}>
              <div className={`h-4 rounded ${barClass}`} style={{ width: `${clamp(posterior * 100, 0, 100)}%` }} />
            </div>
          </div>
          <NoteParagraph className="mb-0 text-sm">
            This is the prosecutor's-fallacy warning in miniature: <InlineMath math="\Pr(+\mid H)" /> is not the same as{' '}
            <InlineMath math="\Pr(H\mid +)" />. The prior and false-positive rate still matter.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function BinomialExplorer() {
  const { isDarkMode, subtlePanelClass, primaryColor, secondaryColor, axisColor, textColor } = useProbabilityTheme();
  const [n, setN] = useState(10);
  const [pPct, setPPct] = useState(50);
  const p = pPct / 100;
  const rows = useMemo(
    () => Array.from({ length: n + 1 }, (_, k) => ({ k, probability: choose(n, k) * p ** k * (1 - p) ** (n - k) })),
    [n, p],
  );
  const mean = n * p;
  const variance = n * p * (1 - p);
  const maxProbability = Math.max(...rows.map((row) => row.probability));
  const chart = { left: 30, right: 15, top: 20, bottom: 34, width: 390, height: 220 };
  const plotWidth = chart.width - chart.left - chart.right;
  const plotHeight = chart.height - chart.top - chart.bottom;
  const xCoord = (value: number) => chart.left + (value / Math.max(1, n)) * plotWidth;
  const barWidth = Math.min(20, Math.max(5, (plotWidth / (rows.length + 1)) * 0.72));
  const meanX = xCoord(mean);
  const xTicks = Array.from(new Set([0, Math.floor(n / 2), n]));

  return (
    <InteractiveBlock title="Binomial Distribution">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(240px,300px)_minmax(0,1fr)]">
        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="binomial-n">
            <span>Trials <InlineMath math="n" /></span>
            <span>{n}</span>
          </label>
          <input id="binomial-n" type="range" min="1" max="20" value={n} onChange={(event) => setN(Number(event.target.value))} className="mb-4 w-full" />
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="binomial-p">
            <span>Success probability <InlineMath math="p" /></span>
            <span>{pPct}%</span>
          </label>
          <input id="binomial-p" type="range" min="5" max="95" step="5" value={pPct} onChange={(event) => setPPct(Number(event.target.value))} className="mb-4 w-full" />
          <MathBlock math={String.raw`X\sim\operatorname{Binomial}(${n},${round(p, 2)})`} />
          <NoteParagraph className="mb-0 text-sm">
            Mean <InlineMath math={`\\mathbb E[X]=${round(mean, 2)}`} /> and variance{' '}
            <InlineMath math={`\\operatorname{Var}(X)=${round(variance, 2)}`} />.
          </NoteParagraph>
        </div>

        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className="h-64 w-full" role="img" aria-label="Binomial probability mass function">
            <line x1={chart.left} y1={chart.top + plotHeight} x2={chart.left + plotWidth} y2={chart.top + plotHeight} stroke={axisColor} strokeWidth="2" />
            <line x1={meanX} y1={chart.top} x2={meanX} y2={chart.top + plotHeight} stroke={secondaryColor} strokeWidth="2" strokeDasharray="5 4" />
            {rows.map((row) => {
              const height = maxProbability === 0 ? 0 : (row.probability / maxProbability) * plotHeight;
              const x = clamp(xCoord(row.k) - barWidth / 2, chart.left, chart.left + plotWidth - barWidth);
              const y = chart.top + plotHeight - height;
              return (
                <rect
                  key={row.k}
                  x={x}
                  y={y}
                  width={barWidth}
                  height={height}
                  rx="2"
                  fill={row.k === Math.round(mean) ? secondaryColor : primaryColor}
                  opacity={isDarkMode ? 0.9 : 0.8}
                />
              );
            })}
            {xTicks.map((tick) => (
              <g key={tick}>
                <line x1={xCoord(tick)} y1={chart.top + plotHeight} x2={xCoord(tick)} y2={chart.top + plotHeight + 6} stroke={axisColor} strokeWidth="1.5" />
                <text x={xCoord(tick)} y={chart.height - 8} textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>{tick}</text>
              </g>
            ))}
          </svg>
          <VisualLegend
            items={[
              { label: <InlineMath math="\Pr(X=k)" />, color: primaryColor },
              { label: 'mean marker', color: secondaryColor },
            ]}
          />
          <NoteParagraph className="mb-0 text-sm">
            Each bar is <InlineMath math="\Pr(X=k)" />. Changing <InlineMath math="n" /> spreads out the count; changing <InlineMath math="p" /> shifts where successes concentrate.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function NormalStandardizationExplorer() {
  const { subtlePanelClass, primaryColor, secondaryColor, axisColor, textColor } = useProbabilityTheme();
  const [mu, setMu] = useState(60);
  const [sigma, setSigma] = useState(20);
  const [rawXValue, setXValue] = useState(80);
  const xMin = Math.round(mu - 4 * sigma);
  const xMax = Math.round(mu + 4 * sigma);
  const xValue = clamp(rawXValue, xMin, xMax);
  const z = (xValue - mu) / sigma;
  const cdf = normalCdf(z);
  const points = Array.from({ length: 120 }, (_, index) => {
    const x = -4 + (8 * index) / 119;
    return { x, y: normalPdf(x) };
  });
  const chart = { left: 25, top: 18, width: 390, height: 220, plotWidth: 350, plotHeight: 165 };
  const xCoord = (value: number) => chart.left + ((value + 4) / 8) * chart.plotWidth;
  const yCoord = (value: number) => chart.top + chart.plotHeight - (value / normalPdf(0)) * chart.plotHeight;
  const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${xCoord(point.x)} ${yCoord(point.y)}`).join(' ');
  const zClamped = clamp(z, -4, 4);
  const shadedPoints = points.filter((point) => point.x <= zClamped);
  if (zClamped > -4 && shadedPoints[shadedPoints.length - 1]?.x !== zClamped) {
    shadedPoints.push({ x: zClamped, y: normalPdf(zClamped) });
  }
  const shadedPath = shadedPoints.length
    ? `M ${xCoord(-4)} ${chart.top + chart.plotHeight} ${shadedPoints
        .map((point) => `L ${xCoord(point.x)} ${yCoord(point.y)}`)
        .join(' ')} L ${xCoord(zClamped)} ${chart.top + chart.plotHeight} Z`
    : '';

  return (
    <InteractiveBlock title="Normal Standardization">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(240px,300px)_minmax(0,1fr)]">
        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="normal-mu">
            <span>Mean <InlineMath math="\mu" /></span>
            <span>{mu}</span>
          </label>
          <input id="normal-mu" type="range" min="30" max="90" value={mu} onChange={(event) => setMu(Number(event.target.value))} className="mb-4 w-full" />
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="normal-sigma">
            <span>Std dev <InlineMath math="\sigma" /></span>
            <span>{sigma}</span>
          </label>
          <input id="normal-sigma" type="range" min="5" max="30" value={sigma} onChange={(event) => setSigma(Number(event.target.value))} className="mb-4 w-full" />
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="normal-x">
            <span>Value <InlineMath math="x" /></span>
            <span>{xValue}</span>
          </label>
          <input id="normal-x" type="range" min={xMin} max={xMax} value={xValue} onChange={(event) => setXValue(Number(event.target.value))} className="w-full" />
        </div>

        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <MathBlock math={String.raw`z=\frac{x-\mu}{\sigma}=\frac{${xValue}-${mu}}{${sigma}}=${round(z, 3)}`} />
          <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className="h-64 w-full" role="img" aria-label="Standard normal curve with z score">
            <line x1={chart.left} y1={chart.top + chart.plotHeight} x2={chart.left + chart.plotWidth} y2={chart.top + chart.plotHeight} stroke={axisColor} strokeWidth="2" />
            <path d={shadedPath} fill={secondaryColor} fillOpacity="0.24" />
            <path d={path} fill="none" stroke={primaryColor} strokeWidth="3" />
            <line x1={xCoord(0)} y1={chart.top} x2={xCoord(0)} y2={chart.top + chart.plotHeight} stroke={axisColor} strokeWidth="1.5" strokeDasharray="4 4" />
            <line x1={xCoord(zClamped)} y1={chart.top} x2={xCoord(zClamped)} y2={chart.top + chart.plotHeight} stroke={secondaryColor} strokeWidth="3" />
            <text x={xCoord(0)} y={chart.height - 10} textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>0</text>
          </svg>
          <VisualLegend
            items={[
              { label: 'standard normal curve', color: primaryColor },
              { label: <InlineMath math="\Pr(Z\le z)" />, color: secondaryColor },
              { label: 'zero line', color: axisColor, hollow: true },
            ]}
          />
          <NoteParagraph className="mb-0 text-sm">
            <InlineMath math={`\\Pr(X\\le ${xValue})`} /> becomes <InlineMath math={`\\Pr(Z\\le ${round(z, 3)})`} />, which is about{' '}
            <strong>{percent(cdf, 2)}</strong>.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function EmpiricalConvergenceExplorer() {
  const { isDarkMode, subtlePanelClass, primaryColor, secondaryColor, axisColor, textColor } = useProbabilityTheme();
  const [pPct, setPPct] = useState(60);
  const [trials, setTrials] = useState(200);
  const [seed, setSeed] = useState(0);
  const p = pPct / 100;
  const step = Math.max(1, Math.floor(trials / 140));
  let successes = 0;
  const points: { trial: number; estimate: number }[] = [];

  for (let trial = 1; trial <= trials; trial += 1) {
    if (pseudoUniform(trial, seed) < p) successes += 1;
    if (trial === 1 || trial === trials || trial % step === 0) {
      points.push({ trial, estimate: successes / trial });
    }
  }

  const estimate = successes / trials;
  const chart = { width: 430, height: 230, left: 38, top: 18, plotWidth: 350, plotHeight: 160 };
  const xCoord = (trial: number) => chart.left + (trial / trials) * chart.plotWidth;
  const yCoord = (value: number) => chart.top + chart.plotHeight - value * chart.plotHeight;
  const path = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${xCoord(point.trial)} ${yCoord(point.estimate)}`).join(' ');

  return (
    <InteractiveBlock title="Simulation Settles Toward a Distribution">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(240px,300px)_minmax(0,1fr)]">
        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="simulation-p">
            <span>Success probability <InlineMath math="p" /></span>
            <span>{pPct}%</span>
          </label>
          <input id="simulation-p" type="range" min="10" max="90" step="5" value={pPct} onChange={(event) => setPPct(Number(event.target.value))} className="mb-4 w-full" />
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="simulation-trials">
            <span>Trials</span>
            <span>{trials}</span>
          </label>
          <input id="simulation-trials" type="range" min="20" max="1000" step="20" value={trials} onChange={(event) => setTrials(Number(event.target.value))} className="w-full" />
          <button
            type="button"
            className={`mt-4 w-full rounded-md border px-3 py-2 text-sm font-bold transition-colors ${
              isDarkMode
                ? 'border-green-500/30 bg-black/30 text-green-200 hover:bg-green-500/10'
                : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
            }`}
            onClick={() => setSeed((value) => value + 1)}
          >
            New sample path
          </button>
          <NoteParagraph className="mb-0 mt-4 text-sm">
            The final simulated estimate is <strong>{percent(estimate, 2)}</strong>. The target probability is <strong>{percent(p, 0)}</strong>.
          </NoteParagraph>
        </div>

        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className="h-64 w-full" role="img" aria-label="Running sample proportion approaching true probability">
            <line x1={chart.left} y1={chart.top + chart.plotHeight} x2={chart.left + chart.plotWidth} y2={chart.top + chart.plotHeight} stroke={axisColor} strokeWidth="2" />
            <line x1={chart.left} y1={chart.top} x2={chart.left} y2={chart.top + chart.plotHeight} stroke={axisColor} strokeWidth="2" />
            <line x1={chart.left} y1={yCoord(p)} x2={chart.left + chart.plotWidth} y2={yCoord(p)} stroke={secondaryColor} strokeWidth="2" strokeDasharray="6 5" />
            <path d={path} fill="none" stroke={primaryColor} strokeWidth="3" />
            <circle cx={xCoord(trials)} cy={yCoord(estimate)} r="4" fill={primaryColor} />
            <text x={chart.left - 8} y={yCoord(1) + 4} textAnchor="end" fontFamily="monospace" fontSize="12" fill={textColor}>1</text>
            <text x={chart.left - 8} y={yCoord(0.5) + 4} textAnchor="end" fontFamily="monospace" fontSize="12" fill={textColor}>.5</text>
            <text x={chart.left - 8} y={yCoord(0) + 4} textAnchor="end" fontFamily="monospace" fontSize="12" fill={textColor}>0</text>
            <text x={chart.left + chart.plotWidth} y={chart.height - 12} textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>{trials}</text>
          </svg>
          <VisualLegend
            items={[
              { label: 'running estimate', color: primaryColor },
              { label: 'true probability', color: secondaryColor },
            ]}
          />
          <NoteParagraph className="mb-0 text-sm">
            The running proportion can wander early. More trials usually make the empirical estimate fluctuate on a smaller scale.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function ChebyshevExplorer() {
  const { subtlePanelClass, primaryColor, secondaryColor, axisColor, textColor } = useProbabilityTheme();
  const [k, setK] = useState(2);
  const bound = 1 / (k * k);
  const normalTail = 2 * (1 - normalCdf(k));
  const chart = { width: 430, height: 230, left: 34, top: 20, plotWidth: 360, plotHeight: 160 };
  const baseY = chart.top + chart.plotHeight;
  const xCoord = (value: number) => chart.left + ((value + 4) / 8) * chart.plotWidth;
  const yCoord = (value: number) => chart.top + chart.plotHeight - (value / normalPdf(0)) * chart.plotHeight;
  const points = Array.from({ length: 140 }, (_, index) => {
    const x = -4 + (8 * index) / 139;
    return { x, y: normalPdf(x) };
  });
  const curvePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${xCoord(point.x)} ${yCoord(point.y)}`).join(' ');
  const leftTail = [...points.filter((point) => point.x <= -k), { x: -k, y: normalPdf(-k) }];
  const rightTail = [{ x: k, y: normalPdf(k) }, ...points.filter((point) => point.x >= k)];
  const tailPath = (tailPoints: { x: number; y: number }[]) =>
    tailPoints.length
      ? `M ${xCoord(tailPoints[0].x)} ${baseY} ${tailPoints
          .map((point) => `L ${xCoord(point.x)} ${yCoord(point.y)}`)
          .join(' ')} L ${xCoord(tailPoints[tailPoints.length - 1].x)} ${baseY} Z`
      : '';

  return (
    <InteractiveBlock title="Chebyshev as a Tail Bound">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(240px,300px)_minmax(0,1fr)]">
        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="chebyshev-k">
            <span>Distance from mean <InlineMath math="k\sigma" /></span>
            <span>{round(k, 1)} sigma</span>
          </label>
          <input id="chebyshev-k" type="range" min="1.5" max="4" step="0.5" value={k} onChange={(event) => setK(Number(event.target.value))} className="mb-4 w-full" />
          <MathBlock math={String.raw`\Pr(|X-\mu|\ge ${round(k, 1)}\sigma)\le \frac{1}{${round(k, 1)}^2}=${round(bound, 3)}`} />
          <NoteParagraph className="mb-0 text-sm">
            The drawn curve is only a shape guide. Chebyshev's bound works even when the distribution is not bell-shaped.
          </NoteParagraph>
        </div>

        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className="h-64 w-full" role="img" aria-label="Distribution tails outside k standard deviations">
            <line x1={chart.left} y1={baseY} x2={chart.left + chart.plotWidth} y2={baseY} stroke={axisColor} strokeWidth="2" />
            <path d={tailPath(leftTail)} fill={secondaryColor} fillOpacity="0.26" />
            <path d={tailPath(rightTail)} fill={secondaryColor} fillOpacity="0.26" />
            <path d={curvePath} fill="none" stroke={primaryColor} strokeWidth="3" />
            <line x1={xCoord(-k)} y1={chart.top} x2={xCoord(-k)} y2={baseY} stroke={secondaryColor} strokeWidth="2" strokeDasharray="5 4" />
            <line x1={xCoord(k)} y1={chart.top} x2={xCoord(k)} y2={baseY} stroke={secondaryColor} strokeWidth="2" strokeDasharray="5 4" />
            <line x1={xCoord(0)} y1={chart.top} x2={xCoord(0)} y2={baseY} stroke={axisColor} strokeWidth="1.5" strokeDasharray="4 4" />
            <text x={xCoord(0)} y={chart.height - 12} textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>mu</text>
            <text x={xCoord(-k)} y={chart.height - 12} textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>-k</text>
            <text x={xCoord(k)} y={chart.height - 12} textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>k</text>
          </svg>
          <VisualLegend
            items={[
              { label: 'reference curve', color: primaryColor },
              { label: 'outside tail area', color: secondaryColor },
              { label: 'mean line', color: axisColor, hollow: true },
            ]}
          />
          <NoteParagraph className="mb-0 text-sm">
            For a normal-shaped variable the outside area would be about {percent(normalTail, 2)}, but Chebyshev only promises it is at most{' '}
            {percent(bound, 2)}.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function PollingExplorer() {
  const { isDarkMode, subtlePanelClass, primaryColor, secondaryColor, axisColor, textColor } = useProbabilityTheme();
  const [pPct, setPPct] = useState(50);
  const [n, setN] = useState(1000);
  const [errorPct, setErrorPct] = useState(4);
  const p = pPct / 100;
  const error = errorPct / 100;
  const variance = (p * (1 - p)) / n;
  const chebyshev = clamp(variance / (error * error), 0, 1);
  const conservative = clamp(1 / (4 * n * error * error), 0, 1);
  const guarantee = 1 - conservative;
  const barClass = isDarkMode ? 'bg-green-400' : 'bg-blue-500';
  const trackClass = isDarkMode ? 'bg-black/40' : 'bg-slate-200';
  const intervalChart = { left: 38, width: 350, height: 120 };
  const intervalX = (value: number) => intervalChart.left + clamp(value, 0, 1) * intervalChart.width;
  const lower = clamp(p - error, 0, 1);
  const upper = clamp(p + error, 0, 1);

  return (
    <InteractiveBlock title="Polling Estimator">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(240px,300px)_minmax(0,1fr)]">
        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="poll-p">
            <span>True support <InlineMath math="p" /></span>
            <span>{pPct}%</span>
          </label>
          <input id="poll-p" type="range" min="5" max="95" step="5" value={pPct} onChange={(event) => setPPct(Number(event.target.value))} className="mb-4 w-full" />
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="poll-n">
            <span>Sample size <InlineMath math="n" /></span>
            <span>{n}</span>
          </label>
          <input id="poll-n" type="range" min="100" max="5000" step="100" value={n} onChange={(event) => setN(Number(event.target.value))} className="mb-4 w-full" />
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="poll-error">
            <span>Error tolerance <InlineMath math="a" /></span>
            <span>{errorPct}%</span>
          </label>
          <input id="poll-error" type="range" min="1" max="10" value={errorPct} onChange={(event) => setErrorPct(Number(event.target.value))} className="w-full" />
        </div>

        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <MathBlock math={String.raw`\widehat p=\frac{1}{n}\sum_{i=1}^n X_i,\qquad \operatorname{Var}(\widehat p)=\frac{p(1-p)}{n}`} />
          <div className="mb-4 grid gap-2 text-xs sm:grid-cols-2">
            <div className={`rounded-md border p-2 ${isDarkMode ? 'border-green-500/20 bg-black/20' : 'border-slate-200 bg-white/70'}`}>
              <div className="font-bold"><InlineMath math="\mathbb E[\widehat p]" /></div>
              <div><InlineMath math={`${round(p, 3)}`} /></div>
            </div>
            <div className={`rounded-md border p-2 ${isDarkMode ? 'border-green-500/20 bg-black/20' : 'border-slate-200 bg-white/70'}`}>
              <div className="font-bold"><InlineMath math="\operatorname{Var}(\widehat p)" /></div>
              <div><InlineMath math={`${round(variance, 6)}`} /></div>
            </div>
            <div className={`rounded-md border p-2 ${isDarkMode ? 'border-green-500/20 bg-black/20' : 'border-slate-200 bg-white/70'}`}>
              <div className="font-bold">Outside tolerance</div>
              <div>At most {percent(chebyshev, 2)} using actual <InlineMath math="p" />.</div>
            </div>
            <div className={`rounded-md border p-2 ${isDarkMode ? 'border-green-500/20 bg-black/20' : 'border-slate-200 bg-white/70'}`}>
              <div className="font-bold">Inside tolerance</div>
              <div>At least {percent(guarantee, 2)} using <InlineMath math="p(1-p)\le 1/4" />.</div>
            </div>
          </div>
          <svg viewBox={`0 0 430 ${intervalChart.height}`} className="mb-4 h-32 w-full" role="img" aria-label="Polling tolerance interval around true support">
            <line x1={intervalChart.left} y1="56" x2={intervalChart.left + intervalChart.width} y2="56" stroke={axisColor} strokeWidth="4" strokeLinecap="round" />
            <rect x={intervalX(lower)} y="43" width={Math.max(2, intervalX(upper) - intervalX(lower))} height="26" rx="6" fill={secondaryColor} fillOpacity="0.28" stroke={secondaryColor} strokeWidth="2" />
            <line x1={intervalX(p)} y1="28" x2={intervalX(p)} y2="86" stroke={primaryColor} strokeWidth="3" />
            {[0, 0.5, 1].map((tick) => (
              <g key={tick}>
                <line x1={intervalX(tick)} y1="47" x2={intervalX(tick)} y2="65" stroke={axisColor} strokeWidth="1.5" />
                <text x={intervalX(tick)} y="104" textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>
                  {tick === 0.5 ? '.5' : tick}
                </text>
              </g>
            ))}
          </svg>
          <VisualLegend
            items={[
              { label: 'true support', color: primaryColor },
              { label: <InlineMath math={`p\\pm ${round(error, 2)}`} />, color: secondaryColor },
            ]}
          />
          <div className="mb-2 flex justify-between text-sm">
            <span>Conservative reliability guarantee</span>
            <strong>{percent(guarantee, 2)}</strong>
          </div>
          <div className={`h-4 rounded ${trackClass}`}>
            <div className={`h-4 rounded ${barClass}`} style={{ width: `${clamp(guarantee * 100, 0, 100)}%` }} />
          </div>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function CouponCollectorRunner() {
  const { isDarkMode, subtlePanelClass, primaryColor, secondaryColor, axisColor, textColor } = useProbabilityTheme();
  const [types, setTypes] = useState(10);
  const [seed, setSeed] = useState(3);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  const states = useMemo(() => {
    const seen = new Set<number>();
    const result: { draw: number; coupon: number | null; collected: Set<number>; isNew: boolean }[] = [
      { draw: 0, coupon: null, collected: new Set<number>(), isNew: false },
    ];

    for (let draw = 1; draw <= 180; draw += 1) {
      const coupon = Math.floor(pseudoUniform(draw, seed) * types);
      const isNew = !seen.has(coupon);
      seen.add(coupon);
      result.push({ draw, coupon, collected: new Set(seen), isNew });
      if (seen.size === types) break;
    }

    return result;
  }, [seed, types]);

  const boundedStep = Math.min(stepIndex, states.length - 1);
  const current = states[boundedStep];
  const atEnd = boundedStep === states.length - 1;
  const expectedDraws = types * Array.from({ length: types }, (_, index) => 1 / (index + 1)).reduce((sum, value) => sum + value, 0);
  const buttonClass = isDarkMode
    ? 'rounded-md border border-green-500/30 bg-black/30 px-3 py-2 text-sm font-bold text-green-200 transition-colors hover:bg-green-500/10 disabled:cursor-not-allowed disabled:opacity-40'
    : 'rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40';
  useAutoRunner({
    playing,
    canAdvance: !atEnd,
    delay: 260,
    onAdvance: () => setStepIndex((step) => Math.min(states.length - 1, step + 1)),
    onStop: () => setPlaying(false),
  });
  const progressPoints = states
    .slice(0, boundedStep + 1)
    .map((state, index) => {
      const x = 26 + (index / Math.max(1, states.length - 1)) * 318;
      const y = 128 - (state.collected.size / types) * 94;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <InteractiveBlock title="Coupon Collector Runner">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(250px,310px)_minmax(0,1fr)]">
        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 flex justify-between gap-3 text-sm font-bold" htmlFor="coupon-types">
            <span>Types</span>
            <span>{types}</span>
          </label>
          <input
            id="coupon-types"
            type="range"
            min="3"
            max="10"
            value={types}
            onChange={(event) => {
              setPlaying(false);
              setTypes(Number(event.target.value));
              setStepIndex(0);
            }}
            className="mb-4 w-full"
          />
          <label className="mb-2 flex justify-between gap-3 text-sm font-bold" htmlFor="coupon-seed">
            <span>Run</span>
            <span>{seed}</span>
          </label>
          <input
            id="coupon-seed"
            type="range"
            min="1"
            max="8"
            value={seed}
            onChange={(event) => {
              setPlaying(false);
              setSeed(Number(event.target.value));
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
              onClick={() => { setPlaying(false); setStepIndex((step) => Math.min(states.length - 1, step + 1)); }}
              disabled={atEnd}
            >
              Draw
            </button>
          </div>
          <div className="mt-4 grid gap-2 text-sm">
            <div className={`rounded-md border p-3 ${isDarkMode ? 'border-green-500/20 bg-black/20' : 'border-slate-200 bg-white/75'}`}>
              Draws so far: <strong>{current.draw}</strong>
            </div>
            <div className={`rounded-md border p-3 ${isDarkMode ? 'border-green-500/20 bg-black/20' : 'border-slate-200 bg-white/75'}`}>
              Expected total: <strong>{round(expectedDraws, 2)}</strong>
            </div>
          </div>
        </div>

        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <div className="mb-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
            {Array.from({ length: types }, (_, coupon) => {
              const collected = current.collected.has(coupon);
              const isCurrent = current.coupon === coupon;
              return (
                <div
                  key={coupon}
                  className={`rounded-md border p-3 text-center text-sm font-bold ${
                    collected
                      ? isDarkMode
                        ? 'border-green-400 bg-green-400 text-black'
                        : 'border-blue-500 bg-blue-500 text-white'
                      : isDarkMode
                        ? 'border-green-500/20 bg-black/20 text-green-100/70'
                        : 'border-slate-200 bg-white/75 text-slate-500'
                  } ${isCurrent ? 'ring-2 ring-orange-500' : ''}`}
                >
                  {coupon + 1}
                </div>
              );
            })}
          </div>
          <svg viewBox="0 0 370 150" className="h-40 w-full" role="img" aria-label="Unique coupon count over draws">
            <line x1="26" y1="128" x2="344" y2="128" stroke={axisColor} strokeWidth="2" />
            <line x1="26" y1="34" x2="26" y2="128" stroke={axisColor} strokeWidth="2" />
            <polyline points={progressPoints} fill="none" stroke={primaryColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <circle
              cx={26 + (boundedStep / Math.max(1, states.length - 1)) * 318}
              cy={128 - (current.collected.size / types) * 94}
              r="4"
              fill={secondaryColor}
            />
            <text x="30" y="24" fontFamily="monospace" fontSize="12" fill={textColor}>collected</text>
            <text x="344" y="145" textAnchor="end" fontFamily="monospace" fontSize="12" fill={textColor}>draws</text>
          </svg>
          <VisualLegend
            items={[
              { label: current.coupon === null ? 'no draw yet' : current.isNew ? 'new type collected' : 'duplicate draw', color: secondaryColor },
              { label: `${current.collected.size}/${types} types collected`, color: primaryColor },
            ]}
          />
          <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-5">
            {states.slice(Math.max(1, boundedStep - 9), boundedStep + 1).map((state) => (
              <div key={state.draw} className={`rounded border px-2 py-1 text-center ${state.isNew ? (isDarkMode ? 'border-green-400 bg-green-400/15' : 'border-blue-500 bg-blue-50') : 'border-current/20'}`}>
                <div>draw {state.draw}</div>
                <strong>{state.coupon === null ? '-' : state.coupon + 1}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
      <CodeBlock language="python" code={couponCollectorCode} />
    </InteractiveBlock>
  );
}

function ReservoirSamplingRunner() {
  const { isDarkMode, subtlePanelClass, primaryColor, secondaryColor, axisColor, textColor } = useProbabilityTheme();
  const [seed, setSeed] = useState(2);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const reservoirSize = 3;

  const states = useMemo(() => {
    const reservoir: string[] = [];
    return reservoirStream.map((item, index) => {
      const i = index + 1;
      const threshold = Math.min(1, reservoirSize / i);
      let randomValue = 0;
      let candidateIndex: number | null = null;
      let replaceIndex: number | null = null;

      if (i <= reservoirSize) {
        reservoir.push(item);
        replaceIndex = i - 1;
      } else {
        randomValue = pseudoUniform(i, seed);
        candidateIndex = Math.floor(randomValue * i);
        if (candidateIndex < reservoirSize) {
          replaceIndex = candidateIndex;
          reservoir[candidateIndex] = item;
        }
      }

      return { i, item, threshold, randomValue, candidateIndex, replaceIndex, reservoir: [...reservoir] };
    });
  }, [seed]);

  const boundedStep = Math.min(stepIndex, states.length - 1);
  const current = states[boundedStep];
  const atEnd = boundedStep === states.length - 1;
  const buttonClass = isDarkMode
    ? 'rounded-md border border-green-500/30 bg-black/30 px-3 py-2 text-sm font-bold text-green-200 transition-colors hover:bg-green-500/10 disabled:cursor-not-allowed disabled:opacity-40'
    : 'rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40';

  useAutoRunner({
    playing,
    canAdvance: !atEnd,
    delay: 650,
    onAdvance: () => setStepIndex((step) => Math.min(states.length - 1, step + 1)),
    onStop: () => setPlaying(false),
  });

  return (
    <InteractiveBlock title="Reservoir Sampling Runner">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(250px,310px)_minmax(0,1fr)]">
        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 flex justify-between gap-3 text-sm font-bold" htmlFor="reservoir-seed">
            <span>Run</span>
            <span>{seed}</span>
          </label>
          <input
            id="reservoir-seed"
            type="range"
            min="1"
            max="8"
            value={seed}
            onChange={(event) => {
              setPlaying(false);
              setSeed(Number(event.target.value));
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
              onClick={() => { setPlaying(false); setStepIndex((step) => Math.min(states.length - 1, step + 1)); }}
              disabled={atEnd}
            >
              Process item
            </button>
          </div>
          <div className="mt-4 grid gap-2 text-sm">
            <div className={`rounded-md border p-3 ${isDarkMode ? 'border-green-500/20 bg-black/20' : 'border-slate-200 bg-white/75'}`}>
              item <strong>{current.i}</strong>: {current.item}
            </div>
            <div className={`rounded-md border p-3 ${isDarkMode ? 'border-green-500/20 bg-black/20' : 'border-slate-200 bg-white/75'}`}>
              reservoir: <strong>{current.reservoir.join(', ')}</strong>
            </div>
          </div>
        </div>

        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <div className="mb-4 flex flex-wrap gap-2">
            {reservoirStream.map((item, index) => {
              const processed = index <= boundedStep;
              const active = index === boundedStep;
              const selected = current.reservoir.includes(item);
              return (
                <span
                  key={item}
                  className={`flex h-10 min-w-10 items-center justify-center rounded-md border px-3 text-sm font-bold ${
                    selected
                      ? isDarkMode
                        ? 'border-green-400 bg-green-400 text-black'
                        : 'border-blue-500 bg-blue-500 text-white'
                      : active
                        ? 'border-orange-500 bg-orange-500/15 text-orange-500'
                        : processed
                          ? isDarkMode
                            ? 'border-green-500/20 bg-black/20 text-green-100'
                            : 'border-slate-300 bg-white text-slate-700'
                          : isDarkMode
                            ? 'border-green-500/10 bg-black/10 text-green-100/40'
                            : 'border-slate-200 bg-white/50 text-slate-400'
                  }`}
                >
                  {item}
                </span>
              );
            })}
          </div>
          <svg viewBox="0 0 420 110" className="h-32 w-full" role="img" aria-label="Reservoir sampling random threshold comparison">
            <line x1="34" y1="62" x2="386" y2="62" stroke={axisColor} strokeWidth="2" />
            <rect x="34" y="50" width={current.threshold * 352} height="24" rx="5" fill={primaryColor} fillOpacity="0.25" stroke={primaryColor} />
            <line x1={34 + current.randomValue * 352} y1="42" x2={34 + current.randomValue * 352} y2="82" stroke={secondaryColor} strokeWidth="3" />
            <text x="34" y="95" fontFamily="monospace" fontSize="12" fill={textColor}>0</text>
            <text x="386" y="95" textAnchor="end" fontFamily="monospace" fontSize="12" fill={textColor}>1</text>
            <text x="34" y="25" fontFamily="monospace" fontSize="12" fill={textColor}>
              replace when u &lt; k/i
            </text>
          </svg>
          <div className="grid gap-2 text-sm sm:grid-cols-3">
            <div className={`rounded-md border p-3 ${isDarkMode ? 'border-green-500/20 bg-black/20' : 'border-slate-200 bg-white/75'}`}>
              <InlineMath math={`k/i=${round(current.threshold, 3)}`} />
            </div>
            <div className={`rounded-md border p-3 ${isDarkMode ? 'border-green-500/20 bg-black/20' : 'border-slate-200 bg-white/75'}`}>
              u = <strong>{round(current.randomValue, 3)}</strong>
            </div>
            <div className={`rounded-md border p-3 ${isDarkMode ? 'border-green-500/20 bg-black/20' : 'border-slate-200 bg-white/75'}`}>
              {current.replaceIndex === null ? 'keep' : `slot ${current.replaceIndex + 1}`}
            </div>
          </div>
        </div>
      </div>
      <CodeBlock language="python" code={reservoirSamplingCode} />
    </InteractiveBlock>
  );
}

export default function ProbabilityStatisticsNote() {
  return (
    <NotesLayout>
      <NoteHeader
        title="Probability and Statistics"
        subtitle="Model uncertainty, estimate unknown quantities, and prove guarantees for randomized computation."
      />

      <NotationGuide />

      {/* 1. FRAMING */}
      <NoteSectionTitle id="modeling-uncertainty">1. Modeling Uncertainty</NoteSectionTitle>
      <NoteSubSectionTitle id="probability-modeling-steps">1.1 Probability Modeling Steps</NoteSubSectionTitle>
      <NoteParagraph>
        Probability is a tool for computing. The goal is not only to solve card and dice problems, but to model randomized algorithms,
        simulations, polling, streaming samples, network packets, server arrivals, and systems where exact deterministic analysis is too expensive.
      </NoteParagraph>
      <NoteParagraph>
        The recurring sequence is: describe the random process, define a probability model, choose useful random variables, compute expectation and
        variance, then prove a guarantee about how unlikely bad outcomes are.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Four-Level View">
          <BulletList className="mb-0">
            <li>Real-world process: packets, users, servers, elections, trials, or simulations.</li>
            <li>Probability model: outcomes, events, and assumptions.</li>
            <li>Random variable: a numerical measurement of the outcome.</li>
            <li>Guarantee: expectation, variance, or a concentration bound.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      {/* 2. PROBABILITY SPACES */}
      <NoteSectionTitle id="probability-spaces">2. Probability Spaces</NoteSectionTitle>
      <NoteSubSectionTitle id="experiments-outcomes-events">2.1 Experiments, Outcomes, and Events</NoteSubSectionTitle>
      <NoteParagraph>
        A random experiment is a repeatable procedure whose outcome is uncertain. An outcome is one possible result. The sample space{' '}
        <InlineMath math="\Omega" /> is the set of all possible outcomes. An event is a subset of the sample space.
      </NoteParagraph>
      <NoteTable
        headers={['Object', 'Meaning', 'Coin-toss example']}
        rows={[
          ['Experiment', 'uncertain process', 'toss a coin three times'],
          ['Outcome', 'one possible result', <InlineMath math="\omega=HTH" />],
          ['Sample space', 'all possible outcomes', <InlineMath math="\Omega=\{HHH,HHT,HTH,HTT,THH,THT,TTH,TTT\}" />],
          ['Event', 'set of outcomes we care about', <InlineMath math="E=\{HHT,HTH,THH\}" />],
        ]}
      />
      <SampleSpaceDiagram />
      <NoteParagraph>
        The event example above is "exactly one tail." The important move is turning English into a set. Probability attaches to events, so a lot
        of probability is set reasoning with a numeric layer on top.
      </NoteParagraph>

      <NoteSubSectionTitle id="probability-axioms">2.2 Probability Axioms</NoteSubSectionTitle>
      <NoteParagraph>
        A probability function assigns a number to each event. The axioms say probabilities are nonnegative, the whole sample space has probability
        1, and disjoint events add without correction.
      </NoteParagraph>
      <NoteTable
        headers={['Axiom', 'Statement', 'Intuition']}
        rows={[
          ['Non-negativity', <InlineMath math="\Pr(E)\ge 0" />, 'probability cannot be negative'],
          ['Normalization', <InlineMath math="\Pr(\Omega)=1" />, 'something in the sample space happens'],
          ['Additivity', <InlineMath math="A\cap B=\emptyset\Rightarrow\Pr(A\cup B)=\Pr(A)+\Pr(B)" />, 'valid when A and B cannot both happen'],
        ]}
      />
      <NoteParagraph>
        From these axioms, probabilities land between 0 and 1. That bound is a consequence, not an extra rule.
      </NoteParagraph>

      <NoteSubSectionTitle id="basic-probability-rules">2.3 Basic Probability Rules</NoteSubSectionTitle>
      <NoteParagraph>
        Most early probability work is learning when to add, when to subtract overlap, and when to count the complement instead.
      </NoteParagraph>
      <NoteTable
        headers={['Rule', 'Formula', 'Use']}
        rows={[
          ['Complement', <InlineMath math="\Pr(A^c)=1-\Pr(A)" />, 'best for "at least one" problems'],
          ['Monotonicity', <InlineMath math="A\subseteq B\Rightarrow \Pr(A)\le \Pr(B)" />, 'larger event cannot be less likely'],
          ['Union bound', <InlineMath math="\Pr(A\cup B)\le \Pr(A)+\Pr(B)" />, 'safe upper bound without independence'],
          ['Inclusion-exclusion', <InlineMath math="\Pr(A\cup B)=\Pr(A)+\Pr(B)-\Pr(A\cap B)" />, 'subtract overlap counted twice'],
        ]}
      />
      <ProbabilityRulesDiagram />

      <NoteSubSectionTitle id="uniform-models">2.4 Uniform Models</NoteSubSectionTitle>
      <NoteParagraph>
        In a finite uniform sample space, all outcomes are equally likely, so probability becomes counting:
      </NoteParagraph>
      <MathBlock math={String.raw`\Pr(E)=\frac{|E|}{|\Omega|}`} />
      <NoteParagraph>
        This model fits fair dice, fair coins, shuffled cards, and uniformly chosen bit strings. The main danger is choosing the wrong sample space:
        cards, hands, positions, and permutations may all be valid models for different questions.
      </NoteParagraph>

      <NoteSubSectionTitle id="continuous-uniform-spaces">2.5 Continuous Uniform Spaces</NoteSubSectionTitle>
      <NoteParagraph>
        Continuous sample spaces replace counting with length, area, or volume. For a uniform spinner on <InlineMath math="[0,1)" />, intervals
        have probability proportional to length, while exact points have probability <InlineMath math="0" />.
      </NoteParagraph>
      <UniformIntervalDiagram />
      <NoteParagraph>
        This does not mean a point is physically impossible. It means probability is spread over a continuum, so any one exact point receives zero
        mass.
      </NoteParagraph>

      {/* 3. CONDITIONING */}
      <NoteSectionTitle id="conditioning-and-bayes">3. Conditioning and Bayes</NoteSectionTitle>
      <NoteSubSectionTitle id="conditional-probability">3.1 Conditional Probability</NoteSubSectionTitle>
      <NoteParagraph>
        Conditional probability updates probabilities after learning information. If <InlineMath math="\Pr(B)>0" />, then:
      </NoteParagraph>
      <MathBlock math={String.raw`\Pr(A\mid B)=\frac{\Pr(A\cap B)}{\Pr(B)}`} />
      <NoteParagraph>
        Conditioning shrinks the universe. Once <InlineMath math="B" /> is known, the relevant sample space is <InlineMath math="B" />. Inside
        that restricted world, <InlineMath math="A" /> happens exactly on <InlineMath math="A\cap B" />.
      </NoteParagraph>
      <ConditionalProbabilityDiagram />
      <NoteParagraph>
        Monty Hall is a warning that conditioning is not "split evenly among what remains" unless the remaining cases are actually equally likely
        after the new information. The host's behavior is part of the probability model.
      </NoteParagraph>

      <NoteSubSectionTitle id="product-rule-and-trees">3.2 Product Rule and Trees</NoteSubSectionTitle>
      <NoteParagraph>
        Rearranging conditional probability gives the product rule, assuming the conditional probability is defined:
      </NoteParagraph>
      <MathBlock math={String.raw`\Pr(A\cap B)=\Pr(A)\Pr(B\mid A)`} />
      <NoteParagraph>
        For sequential experiments, a tree diagram keeps the conditions straight. Multiply along a complete path. Add the path probabilities for
        every path that belongs to the event.
      </NoteParagraph>
      <ProductRuleTreeDiagram />
      <MathBlock math={String.raw`\Pr(E_1\cap E_2\cap E_3)=\Pr(E_1)\Pr(E_2\mid E_1)\Pr(E_3\mid E_1\cap E_2)`} />

      <NoteSubSectionTitle id="total-probability">3.3 Law of Total Probability</NoteSubSectionTitle>
      <NoteParagraph>
        A partition breaks the sample space into disjoint cases that cover everything. If <InlineMath math="A_1,\dots,A_n" /> partition{' '}
        <InlineMath math="\Omega" /> and the conditioning events have positive probability, then:
      </NoteParagraph>
      <MathBlock math={String.raw`\Pr(B)=\sum_i \Pr(B\mid A_i)\Pr(A_i)`} />
      <NoteParagraph>
        This is probability casework: compute the chance of <InlineMath math="B" /> inside each case, weight by how likely the case is, then add.
      </NoteParagraph>

      <NoteSubSectionTitle id="bayes-theorem">3.4 Bayes' Theorem</NoteSubSectionTitle>
      <NoteParagraph>
        Bayes' theorem reverses conditional probability. It turns likelihood of evidence given a hypothesis into probability of the hypothesis
        after seeing evidence.
      </NoteParagraph>
      <MathBlock math={String.raw`\Pr(A\mid B)=\frac{\Pr(B\mid A)\Pr(A)}{\Pr(B)}`} />
      <BayesExplorer />

      {/* 4. INDEPENDENCE */}
      <NoteSectionTitle id="independence">4. Independence</NoteSectionTitle>
      <NoteSubSectionTitle id="event-independence">4.1 Event Independence</NoteSubSectionTitle>
      <NoteParagraph>
        Events <InlineMath math="A" /> and <InlineMath math="B" /> are independent when the product rule simplifies:
      </NoteParagraph>
      <MathBlock math={String.raw`\Pr(A\cap B)=\Pr(A)\Pr(B)`} />
      <NoteParagraph>
        Equivalently, if the relevant probabilities are nonzero, learning <InlineMath math="B" /> does not change the probability of{' '}
        <InlineMath math="A" />. Independence means no information is gained.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Important Warning">
          <NoteParagraph className="mb-0">
            Independent does not mean disjoint. If two nontrivial events are disjoint, then knowing one happened tells you the other did not happen.
            That is usually the opposite of independence.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSubSectionTitle id="pairwise-and-mutual-independence">4.2 Pairwise and Mutual Independence</NoteSubSectionTitle>
      <NoteParagraph>
        For three or more events, pairwise independence is not enough. Pairwise independence checks every pair. Mutual independence requires every
        subcollection to multiply correctly.
      </NoteParagraph>
      <NoteTable
        headers={['Type', 'For three events A, B, C']}
        rows={[
          ['Pairwise', <InlineMath math="A\perp B,\;A\perp C,\;B\perp C" />],
          ['Mutual', <span>the pairwise checks, plus <InlineMath math="\Pr(A\cap B\cap C)=\Pr(A)\Pr(B)\Pr(C)" /></span>],
        ]}
      />
      <NoteParagraph>
        The standard example uses independent random signs <InlineMath math="X,Y\in\{-1,1\}" /> and defines <InlineMath math="Z=XY" />. Any pair
        can look independent, but all three together are not mutually independent because <InlineMath math="Z" /> is determined by{' '}
        <InlineMath math="X" /> and <InlineMath math="Y" />.
      </NoteParagraph>

      <NoteSubSectionTitle id="fallacies-and-false-independence">4.3 Fallacies and False Independence</NoteSubSectionTitle>
      <NoteParagraph>
        People v. Collins is a cautionary example: multiplying probabilities of characteristics assumes the characteristics are
        mutually independent. That assumption can be wrong, especially when characteristics are socially, biologically, or contextually related.
      </NoteParagraph>
      <NoteParagraph>
        The prosecutor's fallacy is a Bayes mistake. <InlineMath math="\Pr(\text{evidence}\mid\text{innocent})" /> is not the same as{' '}
        <InlineMath math="\Pr(\text{innocent}\mid\text{evidence})" />. Rare evidence is not automatically decisive evidence; priors and the size
        of the possible population matter.
      </NoteParagraph>

      {/* 5. RANDOM VARIABLES */}
      <NoteSectionTitle id="random-variables-and-distributions">5. Random Variables and Distributions</NoteSectionTitle>
      <NoteSubSectionTitle id="random-variable-definition">5.1 Random Variables</NoteSubSectionTitle>
      <NoteParagraph>
        A random variable is a function from outcomes to numbers:
      </NoteParagraph>
      <MathBlock math={String.raw`X:\Omega\to\mathbb R`} />
      <NoteParagraph>
        Events ask whether something happened. Random variables measure something numerical about the outcome: number of heads, time until a job
        arrives, money won, packets needed, or distance from the center of a dartboard.
      </NoteParagraph>

      <NoteSubSectionTitle id="discrete-vs-continuous">5.2 Discrete vs Continuous</NoteSubSectionTitle>
      <NoteTable
        headers={['Type', 'Range', 'Probability lives on']}
        rows={[
          ['Discrete', 'countable values like 0, 1, 2, ...', <InlineMath math="\Pr(X=x)" />],
          ['Continuous', 'intervals of real numbers', <InlineMath math="\Pr(a\le X\le b)" />],
        ]}
      />
      <NoteParagraph>
        The type depends on the random variable's range, not only on the experiment. A dart lands at a continuous location, but a score that is
        either 0 or 100 is a discrete random variable.
      </NoteParagraph>

      <NoteSubSectionTitle id="pmf-pdf-cdf">5.3 PMF, PDF, and CDF</NoteSubSectionTitle>
      <NoteParagraph>
        A distribution tells how probability is assigned to values of a random variable. In standard notation, discrete variables use a PMF and
        continuous variables use a PDF.
      </NoteParagraph>
      <NoteTable
        headers={['Object', 'Meaning']}
        rows={[
          ['PMF', <span><InlineMath math="f_X(x)=\Pr(X=x)" /> for a discrete random variable</span>],
          ['PDF', <span><InlineMath math="\Pr(a\le X\le b)=\int_a^b f_X(x)\,dx" /> for a continuous random variable</span>],
          ['CDF', <span><InlineMath math="F_X(x)=\Pr(X\le x)" /> for either type</span>],
        ]}
      />
      <NoteParagraph>
        The PMF/PDF is local probability information. The CDF is accumulated probability up to <InlineMath math="x" />. Once the distribution is
        known, many different experiments can be studied with the same formulas.
      </NoteParagraph>
      <DistributionShapeExplorer />

      <NoteSubSectionTitle id="simulation-and-empirical-distributions">5.4 Simulation and Empirical Distributions</NoteSubSectionTitle>
      <NoteParagraph>
        Simulation estimates probabilities, expectations, and distributions by repeated trials. Histograms turn simulated outcomes into an
        empirical distribution. The hot-hand examples show a key lesson: randomness naturally creates streaks, so seeing streaks does not by itself
        prove dependence.
      </NoteParagraph>
      <EmpiricalConvergenceExplorer />

      {/* 6. DISCRETE DISTRIBUTIONS */}
      <NoteSectionTitle id="discrete-distributions">6. Discrete Distributions</NoteSectionTitle>
      <NoteSubSectionTitle id="discrete-uniform">6.1 Discrete Uniform</NoteSubSectionTitle>
      <NoteParagraph>
        A discrete uniform random variable takes finitely many values with equal probability. Fair dice, random IDs, and many randomized algorithms
        use this model.
      </NoteParagraph>
      <MathBlock math={String.raw`X\sim\operatorname{Uniform}(\{1,\dots,n\}),\qquad \Pr(X=k)=\frac{1}{n}\quad(k=1,\dots,n)`} />

      <NoteSubSectionTitle id="bernoulli-and-binomial">6.2 Bernoulli and Binomial</NoteSubSectionTitle>
      <NoteParagraph>
        A Bernoulli random variable is one yes/no trial. It equals 1 with probability <InlineMath math="p" /> and 0 with probability{' '}
        <InlineMath math="1-p" />. It is the basic indicator distribution.
      </NoteParagraph>
      <MathBlock math={String.raw`X\sim\operatorname{Bernoulli}(p),\qquad \mathbb E[X]=p,\qquad \operatorname{Var}(X)=p(1-p)`} />
      <NoteParagraph>
        A Binomial random variable counts successes across <InlineMath math="n" /> independent Bernoulli trials with the same success probability.
      </NoteParagraph>
      <MathBlock math={String.raw`X\sim\operatorname{Binomial}(n,p),\qquad \Pr(X=k)=\binom nk p^k(1-p)^{n-k}\quad(k=0,\dots,n)`} />
      <MathBlock math={String.raw`\mathbb E[X]=np,\qquad \operatorname{Var}(X)=np(1-p)`} />
      <BinomialExplorer />

      <NoteSubSectionTitle id="geometric-and-negative-binomial">6.3 Geometric and Negative Binomial</NoteSubSectionTitle>
      <NoteParagraph>
        A Geometric random variable counts the number of independent trials until the first success, including the successful trial.
      </NoteParagraph>
      <MathBlock math={String.raw`X\sim\operatorname{Geometric}(p),\qquad \Pr(X=k)=(1-p)^{k-1}p\quad(k=1,2,\dots)`} />
      <MathBlock math={String.raw`\mathbb E[X]=\frac{1}{p},\qquad \operatorname{Var}(X)=\frac{1-p}{p^2}`} />
      <NoteParagraph>
        Geometric waiting time is memoryless: past failures do not make success due. If each trial still has probability <InlineMath math="p" />,
        the expected additional waiting time is still <InlineMath math="1/p" />.
      </NoteParagraph>
      <MathBlock math={String.raw`\mathbb E[X]=\frac16(1)+\frac56(1+\mathbb E[X])=6\quad\text{for rolls until the first six}`} />
      <NoteParagraph>
        Negative Binomial generalizes Geometric: instead of waiting for the first success, it waits for the <InlineMath math="r" />th success.
      </NoteParagraph>
      <MathBlock math={String.raw`\Pr(X=k)=\binom{k-1}{r-1}p^r(1-p)^{k-r}\quad(k=r,r+1,\dots),\qquad \mathbb E[X]=\frac{r}{p}`} />

      <NoteSubSectionTitle id="poisson">6.4 Poisson</NoteSubSectionTitle>
      <NoteParagraph>
        Poisson counts random arrivals or rare events in a fixed interval: jobs at a server, emails in a day, photons at a detector, or earthquakes
        in a century.
      </NoteParagraph>
      <MathBlock math={String.raw`X\sim\operatorname{Poisson}(\lambda),\qquad \Pr(X=k)=e^{-\lambda}\frac{\lambda^k}{k!},\qquad \mathbb E[X]=\operatorname{Var}(X)=\lambda`} />
      <NoteParagraph>
        Poisson is related to Binomial when there are many trials, each with small success probability. The parameter <InlineMath math="\lambda" />
        is both the average count and the variance.
      </NoteParagraph>

      {/* 7. CONTINUOUS DISTRIBUTIONS */}
      <NoteSectionTitle id="continuous-distributions">7. Continuous Distributions</NoteSectionTitle>
      <NoteSubSectionTitle id="continuous-uniform">7.1 Continuous Uniform</NoteSubSectionTitle>
      <NoteParagraph>
        A continuous uniform random variable spreads probability evenly over an interval.
      </NoteParagraph>
      <MathBlock math={String.raw`X\sim\operatorname{Uniform}[a,b],\qquad f(x)=\frac{1}{b-a}\quad(a\le x\le b)`} />
      <MathBlock math={String.raw`\Pr(c\le X\le d)=\frac{d-c}{b-a}\quad(a\le c\le d\le b),\qquad \mathbb E[X]=\frac{a+b}{2}`} />

      <NoteSubSectionTitle id="normal-and-standardization">7.2 Normal and Standardization</NoteSubSectionTitle>
      <NoteParagraph>
        The Normal distribution is the bell curve. It models measurement error, noisy quantities, heights, delivery times, and averages of many
        independent values.
      </NoteParagraph>
      <MathBlock math={String.raw`X\sim\operatorname{Normal}(\mu,\sigma^2),\qquad f(x)=\frac{1}{\sigma\sqrt{2\pi}}e^{-(x-\mu)^2/(2\sigma^2)}`} />
      <NoteParagraph>
        The standard Normal is <InlineMath math="Z\sim\operatorname{Normal}(0,1)" />. Standardization converts any Normal problem into a standard
        Normal problem:
      </NoteParagraph>
      <MathBlock math={String.raw`Z=\frac{X-\mu}{\sigma}`} />
      <NoteParagraph>
        Normal CDF values usually come from a table, calculator, or numerical function. The key algebra move is standardizing first, then reading
        the accumulated probability for <InlineMath math="Z" />.
      </NoteParagraph>
      <NormalStandardizationExplorer />
      <NoteParagraph>
        The 68-95-99.7 rule is a quick scale check: about 68% lies within one standard deviation, about 95% within two, and about 99.7% within three.
      </NoteParagraph>

      <NoteSubSectionTitle id="exponential-distribution">7.3 Exponential</NoteSubSectionTitle>
      <NoteParagraph>
        The Exponential distribution models continuous waiting time until an event: a server job arrives, a bus shows up, a hard drive fails, or a
        shooting star appears.
      </NoteParagraph>
      <MathBlock math={String.raw`X\sim\operatorname{Exponential}(\lambda),\qquad f(x)=\lambda e^{-\lambda x},\qquad F(x)=1-e^{-\lambda x}\quad(x\ge 0)`} />
      <MathBlock math={String.raw`\mathbb E[X]=\frac{1}{\lambda},\qquad \operatorname{Var}(X)=\frac{1}{\lambda^2}`} />
      <NoteParagraph>
        Geometric is discrete waiting time. Exponential is continuous waiting time. Both carry the same memoryless intuition.
      </NoteParagraph>

      {/* 8. EXPECTATION */}
      <NoteSectionTitle id="expectation">8. Expectation</NoteSectionTitle>
      <NoteSubSectionTitle id="expectation-basics">8.1 Expectation Basics</NoteSubSectionTitle>
      <NoteParagraph>
        Expectation is the long-run average or weighted average value of a random variable. It is a summary of a distribution, not necessarily the
        most likely value.
      </NoteParagraph>
      <MathBlock math={String.raw`\mathbb E[X]=\sum_x x\Pr(X=x)\quad\text{(discrete)},\qquad \mathbb E[X]=\int_{-\infty}^{\infty}x f_X(x)\,dx\quad\text{(continuous)}`} />
      <NoteParagraph>
        Expectation is a balance point. Two variables can have the same expectation but very different risk, which is why variance matters later.
      </NoteParagraph>

      <NoteSubSectionTitle id="linearity-of-expectation">8.2 Linearity of Expectation</NoteSubSectionTitle>
      <NoteParagraph>
        Linearity of expectation is one of the most useful facts in probability:
      </NoteParagraph>
      <MathBlock math={String.raw`\mathbb E[c_1X_1+\cdots+c_nX_n]=c_1\mathbb E[X_1]+\cdots+c_n\mathbb E[X_n]`} />
      <NoteParagraph>
        This does not require independence. That is why we can solve expected counts by decomposing a complicated random variable into simpler
        pieces, even when those pieces interact.
      </NoteParagraph>

      <NoteSubSectionTitle id="indicator-random-variables">8.3 Indicator Variables</NoteSubSectionTitle>
      <NoteParagraph>
        Indicator variables are Bernoulli variables used to count events. If <InlineMath math="X_i=1" /> when event <InlineMath math="A_i" /> happens
        and 0 otherwise, then <InlineMath math="\mathbb E[X_i]=\Pr(A_i)" />.
      </NoteParagraph>
      <MathBlock math={String.raw`X=\sum_i X_i\quad\Longrightarrow\quad \mathbb E[X]=\sum_i \Pr(A_i)`} />
      <NoteParagraph>
        This technique appears in polling, coupon collector, expected successes, and probabilistic algorithm analysis.
      </NoteParagraph>

      <NoteSubSectionTitle id="conditional-expectation">8.4 Conditional and Total Expectation</NoteSubSectionTitle>
      <NoteParagraph>
        Conditional expectation is the average value after learning information. It is the expectation analogue of conditional probability.
      </NoteParagraph>
      <MathBlock math={String.raw`\mathbb E[X]=\sum_i \mathbb E[X\mid A_i]\Pr(A_i),\qquad \mathbb E[X]=\mathbb E[\mathbb E[X\mid Y]]`} />
      <NoteParagraph>
        The law of total expectation is casework for averages: break the world into cases, find the average inside each case, weight by the case
        probability, and add.
      </NoteParagraph>

      {/* 9. VARIANCE */}
      <NoteSectionTitle id="variance-and-covariance">9. Variance and Covariance</NoteSectionTitle>
      <NoteSubSectionTitle id="variance-basics">9.1 Variance and Standard Deviation</NoteSubSectionTitle>
      <NoteParagraph>
        Variance measures spread around the mean. Read the definition from the inside out: deviation, squared deviation, average squared deviation.
      </NoteParagraph>
      <MathBlock math={String.raw`\operatorname{Var}(X)=\mathbb E[(X-\mathbb E[X])^2]=\mathbb E[X^2]-(\mathbb E[X])^2`} />
      <NoteParagraph>
        Standard deviation is <InlineMath math="\sigma_X=\sqrt{\operatorname{Var}(X)}" />. It returns spread to the original units of{' '}
        <InlineMath math="X" />.
      </NoteParagraph>

      <NoteSubSectionTitle id="variance-rules">9.2 Variance Rules</NoteSubSectionTitle>
      <NoteTable
        headers={['Rule', 'Meaning']}
        rows={[
          [<InlineMath math="\operatorname{Var}(c)=0" />, 'a constant has no spread'],
          [<InlineMath math="\operatorname{Var}(X+c)=\operatorname{Var}(X)" />, 'shifting does not change spread'],
          [<InlineMath math="\operatorname{Var}(cX)=c^2\operatorname{Var}(X)" />, 'scaling changes squared spread'],
          [<InlineMath math="\operatorname{Var}(X+Y)=\operatorname{Var}(X)+\operatorname{Var}(Y)" />, 'true when covariance is 0, especially when X and Y are independent'],
        ]}
      />
      <NoteParagraph>
        Expectation always adds. Variance only adds cleanly when variables do not move together.
      </NoteParagraph>

      <NoteSubSectionTitle id="covariance">9.3 Covariance</NoteSubSectionTitle>
      <NoteParagraph>
        Covariance measures how two random variables move together.
      </NoteParagraph>
      <MathBlock math={String.raw`\operatorname{Cov}(X,Y)=\mathbb E[XY]-\mathbb E[X]\mathbb E[Y]`} />
      <MathBlock math={String.raw`\operatorname{Var}(X+Y)=\operatorname{Var}(X)+\operatorname{Var}(Y)+2\operatorname{Cov}(X,Y)`} />
      <NoteParagraph>
        Positive covariance means the variables tend to move together. Negative covariance means they tend to move opposite ways. Zero covariance
        means no linear co-movement, but it does not always imply full independence.
      </NoteParagraph>

      <NoteSubSectionTitle id="independent-random-variables">9.4 Independent Random Variables</NoteSubSectionTitle>
      <NoteParagraph>
        Random variables are independent when learning the value of one gives no probability information about the other. For discrete variables,
        this becomes:
      </NoteParagraph>
      <MathBlock math={String.raw`\Pr(X=x,\;Y=y)=\Pr(X=x)\Pr(Y=y)\quad\text{for all }x,y`} />
      <NoteParagraph>
        Independence lets us simplify <InlineMath math="\mathbb E[XY]=\mathbb E[X]\mathbb E[Y]" /> and variance of sums.
      </NoteParagraph>

      {/* 10. SAMPLING */}
      <NoteSectionTitle id="sampling-and-concentration">10. Sampling, Estimation, and Concentration</NoteSectionTitle>
      <NoteSubSectionTitle id="estimator-language">10.1 Estimator Language</NoteSubSectionTitle>
      <NoteParagraph>
        In statistics, a parameter is an unknown number describing a population or model. An estimator is a random variable computed from samples
        to approximate that parameter. Before data is observed, <InlineMath math="\widehat p" /> is random. After data is observed, it becomes a
        numerical estimate.
      </NoteParagraph>
      <NoteTable
        headers={['Term', 'Meaning']}
        rows={[
          ['Parameter', <span>fixed but unknown value, such as population support <InlineMath math="p" /></span>],
          ['Estimator', <span>random rule from samples, such as <InlineMath math="\widehat p" /></span>],
          ['Unbiased', <span><InlineMath math="\mathbb E[\widehat p]=p" />, so the estimator is correct on average</span>],
          ['Standard error', <span><InlineMath math="\sqrt{\operatorname{Var}(\widehat p)}" />, the typical sampling-scale error</span>],
        ]}
      />

      <NoteSubSectionTitle id="polling-estimators">10.2 Polling Estimators</NoteSubSectionTitle>
      <NoteParagraph>
        Polling estimates an unknown population fraction <InlineMath math="p" /> by sampling people independently and uniformly at random. Each
        response becomes a Bernoulli indicator <InlineMath math="X_i" />, and the estimator is the sample average.
      </NoteParagraph>
      <MathBlock math={String.raw`\widehat p=\frac{1}{n}\sum_{i=1}^{n}X_i,\qquad \mathbb E[\widehat p]=p,\qquad \operatorname{Var}(\widehat p)=\frac{p(1-p)}{n}`} />
      <PollingExplorer />

      <NoteSubSectionTitle id="markov-and-chebyshev">10.3 Markov and Chebyshev</NoteSubSectionTitle>
      <NoteParagraph>
        Markov's inequality applies to nonnegative random variables. It is very general, but often weak because it only uses the mean.
      </NoteParagraph>
      <MathBlock math={String.raw`X\ge 0,\;a>0\quad\Longrightarrow\quad \Pr(X\ge a)\le \frac{\mathbb E[X]}{a}`} />
      <NoteParagraph>
        Chebyshev's inequality uses variance, so it gives concentration around the mean:
      </NoteParagraph>
      <MathBlock math={String.raw`a>0\quad\Longrightarrow\quad \Pr(|X-\mathbb E[X]|\ge a)\le \frac{\operatorname{Var}(X)}{a^2}`} />
      <NoteParagraph>
        For polling, <InlineMath math="p(1-p)\le 1/4" /> gives the conservative bound{' '}
        <InlineMath math="\Pr(|\widehat p-p|\ge a)\le 1/(4na^2)" />. This explains how sample size controls reliability.
      </NoteParagraph>
      <ChebyshevExplorer />

      {/* 11. COMPUTING APPLICATIONS */}
      <NoteSectionTitle id="computing-applications">11. Computing Applications</NoteSectionTitle>
      <NoteSubSectionTitle id="coupon-collector">11.1 Coupon Collector</NoteSubSectionTitle>
      <NoteParagraph>
        Coupon Collector asks how many uniform samples are needed to collect all <InlineMath math="n" /> types. The trick is to split the wait into
        stages: <InlineMath math="X_i" /> is the number of boxes needed to go from <InlineMath math="i-1" /> distinct types to{' '}
        <InlineMath math="i" /> distinct types.
      </NoteParagraph>
      <MathBlock math={String.raw`\mathbb E[X_i]=\frac{n}{n-i+1},\qquad \mathbb E[X]=n\left(1+\frac12+\cdots+\frac1n\right)=nH_n\approx n\ln n`} />
      <NoteParagraph>
        Early coupons are easy. The last few are slow. That long tail creates the <InlineMath math="n\log n" /> behavior. In computing, this models
        router ID collection when each packet samples one router on a path.
      </NoteParagraph>
      <CouponCollectorRunner />

      <NoteSubSectionTitle id="reservoir-sampling">11.2 Reservoir Sampling</NoteSubSectionTitle>
      <NoteParagraph>
        Reservoir sampling selects one uniformly random item from a stream of unknown length using one stored sample.
      </NoteParagraph>
      <CodeBlock
        language="python"
        code={`import random

sample = None

for i, item in enumerate(stream, start=1):
    if random.random() < 1 / i:
        sample = item`}
      />
      <NoteParagraph>
        After processing <InlineMath math="i" /> items, each item has probability <InlineMath math="1/i" /> of being stored. A new item gets that
        probability directly. An old item was stored with probability <InlineMath math="1/(i-1)" /> and survives with probability{' '}
        <InlineMath math="(i-1)/i" />, so its final probability is also <InlineMath math="1/i" />.
      </NoteParagraph>
      <ReservoirSamplingRunner />

      <NoteSubSectionTitle id="randomized-algorithms-and-systems">11.3 Randomized Algorithms and Systems</NoteSubSectionTitle>
      <NoteParagraph>
        Probability is used to reason about algorithms and systems: randomized algorithms, simulations, streaming samples,
        queues, arrivals, packet paths, hashing-style estimates, and rare bad outcomes.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Final Pattern">
          <BulletList className="mb-0">
            <li>Model the uncertain process clearly.</li>
            <li>Choose random variables that measure what matters.</li>
            <li>Use expectation and variance to summarize behavior.</li>
            <li>Use Markov, Chebyshev, or stronger bounds to prove bad outcomes are unlikely.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>
    </NotesLayout>
  );
}
