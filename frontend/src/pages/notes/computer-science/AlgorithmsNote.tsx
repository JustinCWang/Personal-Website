/**
 * Algorithms Notes Page
 * A standalone note for algorithm design, analysis, graph algorithms, dynamic programming, network flow, and hardness.
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
  NoteTopicBlock,
  NoteTopicGroup,
} from '../../../components/notes';
import { useDarkMode } from '../../../hooks/useDarkMode';

type TableRow = ReactNode[];

function useAlgorithmsTheme() {
  const { isDarkMode } = useDarkMode();
  const subtlePanelClass = isDarkMode
    ? 'bg-green-500/5 border-green-500/20 text-green-100'
    : 'bg-slate-50 border-slate-200 text-slate-700';
  const listClass = `list-disc pl-6 mb-6 font-mono text-sm leading-relaxed space-y-2 ${
    isDarkMode ? 'text-green-100/90' : 'text-slate-700'
  }`;
  const orderedListClass = `list-decimal pl-6 mb-6 font-mono text-sm leading-relaxed space-y-2 ${
    isDarkMode ? 'text-green-100/90' : 'text-slate-700'
  }`;
  const tableClass = `w-full border-collapse overflow-hidden rounded-lg font-mono text-sm ${
    isDarkMode ? 'text-green-100' : 'text-slate-700'
  }`;
  const tableHeadClass = isDarkMode ? 'bg-green-500/15 text-green-300' : 'bg-slate-100 text-slate-800';
  const tableCellClass = isDarkMode ? 'border border-green-500/20' : 'border border-slate-200';
  const primaryColor = isDarkMode ? '#4ade80' : '#2563eb';
  const secondaryColor = isDarkMode ? '#fb923c' : '#ea580c';
  const mutedColor = isDarkMode ? '#86efac66' : '#94a3b8';
  const textColor = isDarkMode ? '#bbf7d0' : '#334155';

  return {
    subtlePanelClass,
    listClass,
    orderedListClass,
    tableClass,
    tableHeadClass,
    tableCellClass,
    primaryColor,
    secondaryColor,
    mutedColor,
    textColor,
    isDarkMode,
  };
}

function BulletList({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { listClass } = useAlgorithmsTheme();
  return <ul className={`${listClass} ${className}`}>{children}</ul>;
}

function NumberedList({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { orderedListClass } = useAlgorithmsTheme();
  return <ol className={`${orderedListClass} ${className}`}>{children}</ol>;
}

function NoteTable({ headers, rows }: { headers: ReactNode[]; rows: TableRow[] }) {
  const { tableClass, tableHeadClass, tableCellClass } = useAlgorithmsTheme();

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

function AlgorithmNotationGuide() {
  return (
    <NoteTopicGroup>
      <NoteTopicBlock title="Notation Used Throughout">
        <BulletList className="mb-0">
          <li><InlineMath math="n" /> usually means the number of vertices, jobs, items, or input records.</li>
          <li><InlineMath math="m" /> usually means the number of edges in a graph.</li>
          <li><InlineMath math="G=(V,E)" /> is a graph with vertex set <InlineMath math="V" /> and edge set <InlineMath math="E" />.</li>
          <li><InlineMath math="w(e)" />, <InlineMath math="c(e)" />, and <InlineMath math="\ell(e)" /> denote edge weight, capacity, and length, depending on context.</li>
          <li><InlineMath math="O(g(n))" />, <InlineMath math="\Omega(g(n))" />, and <InlineMath math="\Theta(g(n))" /> are asymptotic upper, lower, and tight bounds.</li>
          <li><InlineMath math="\operatorname{OPT}" /> denotes an optimal value or optimal solution.</li>
          <li><InlineMath math="\infty" /> means "not reached yet" in shortest path tables.</li>
          <li><InlineMath math="s" /> and <InlineMath math="t" /> are common names for a source and target or sink.</li>
          <li><InlineMath math="X\le_p Y" /> means problem <InlineMath math="X" /> polynomial-time reduces to problem <InlineMath math="Y" />.</li>
        </BulletList>
      </NoteTopicBlock>
    </NoteTopicGroup>
  );
}

function GrowthRateExplorer() {
  const { subtlePanelClass, primaryColor, secondaryColor } = useAlgorithmsTheme();
  const [n, setN] = useState(32);
  const safeLog = Math.log2(Math.max(2, n));
  const rates = [
    { label: '1', value: 1, math: 'O(1)' },
    { label: 'log n', value: safeLog, math: 'O(\\log n)' },
    { label: 'n', value: n, math: 'O(n)' },
    { label: 'n log n', value: n * safeLog, math: 'O(n\\log n)' },
    { label: 'n^2', value: n * n, math: 'O(n^2)' },
    { label: '2^n', value: Math.pow(2, Math.min(n, 20)), math: 'O(2^n)' },
  ];
  const maxLog = Math.max(...rates.map((rate) => Math.log10(rate.value + 1)));

  return (
    <InteractiveBlock title="Growth Rate Comparison">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="growth-n">
            <span>Input size <InlineMath math="n" /></span>
            <span>{n}</span>
          </label>
          <input id="growth-n" type="range" min="4" max="128" value={n} onChange={(event) => setN(Number(event.target.value))} className="w-full" />
          <NoteParagraph className="mb-0 mt-4 text-sm">
            The bars use a log scale so the slower functions are still visible. Even then, exponential growth quickly dominates everything else.
          </NoteParagraph>
        </div>
        <div className="space-y-3">
          {rates.map((rate, index) => {
            const width = Math.max(4, (Math.log10(rate.value + 1) / maxLog) * 100);
            return (
              <div key={rate.label} className="grid grid-cols-[6rem_minmax(0,1fr)_5rem] items-center gap-3 text-sm">
                <span><InlineMath math={rate.math} /></span>
                <div className={`h-7 overflow-hidden rounded border ${subtlePanelClass}`}>
                  <div
                    className="h-full rounded"
                    style={{
                      width: `${width}%`,
                      backgroundColor: index <= 2 ? primaryColor : secondaryColor,
                      opacity: 0.75,
                    }}
                  />
                </div>
                <span className="text-right">{rate.value > 100000 ? rate.value.toExponential(1) : Math.round(rate.value)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </InteractiveBlock>
  );
}

type MatchSnapshot = {
  proposal: string;
  matches: Record<string, string | null>;
  free: string[];
};

function buildStableMatchingSnapshots(): MatchSnapshot[] {
  const hospitals = ['H1', 'H2', 'H3'];
  const students = ['S1', 'S2', 'S3'];
  const hospitalPrefs: Record<string, string[]> = {
    H1: ['S1', 'S2', 'S3'],
    H2: ['S1', 'S3', 'S2'],
    H3: ['S2', 'S1', 'S3'],
  };
  const studentPrefs: Record<string, string[]> = {
    S1: ['H2', 'H1', 'H3'],
    S2: ['H1', 'H3', 'H2'],
    S3: ['H1', 'H2', 'H3'],
  };
  const rank: Record<string, Record<string, number>> = Object.fromEntries(
    students.map((student) => [student, Object.fromEntries(studentPrefs[student].map((hospital, index) => [hospital, index]))]),
  );
  const nextIndex = Object.fromEntries(hospitals.map((hospital) => [hospital, 0])) as Record<string, number>;
  const free = new Set(hospitals);
  const matches = Object.fromEntries(students.map((student) => [student, null])) as Record<string, string | null>;
  const snapshots: MatchSnapshot[] = [{ proposal: 'Start with every hospital unmatched.', matches: { ...matches }, free: [...free] }];

  while ([...free].some((hospital) => nextIndex[hospital] < students.length)) {
    const hospital = hospitals.find((candidate) => free.has(candidate) && nextIndex[candidate] < students.length);
    if (!hospital) break;
    const student = hospitalPrefs[hospital][nextIndex[hospital]];
    nextIndex[hospital] += 1;
    const current = matches[student];

    if (current === null) {
      matches[student] = hospital;
      free.delete(hospital);
      snapshots.push({
        proposal: `${hospital} proposes to ${student}. ${student} is unmatched, so the proposal is tentatively accepted.`,
        matches: { ...matches },
        free: [...free],
      });
    } else if (rank[student][hospital] < rank[student][current]) {
      matches[student] = hospital;
      free.delete(hospital);
      free.add(current);
      snapshots.push({
        proposal: `${hospital} proposes to ${student}. ${student} prefers ${hospital} over ${current}, so ${current} becomes unmatched.`,
        matches: { ...matches },
        free: [...free],
      });
    } else {
      snapshots.push({
        proposal: `${hospital} proposes to ${student}. ${student} keeps ${current}, so ${hospital} remains unmatched.`,
        matches: { ...matches },
        free: [...free],
      });
    }
  }

  return snapshots;
}

function StableMatchingExplorer() {
  const { subtlePanelClass, primaryColor, secondaryColor } = useAlgorithmsTheme();
  const snapshots = useMemo(buildStableMatchingSnapshots, []);
  const [step, setStep] = useState(0);
  const snapshot = snapshots[step];
  const students = ['S1', 'S2', 'S3'];
  const hospitals = ['H1', 'H2', 'H3'];

  return (
    <InteractiveBlock title="Deferred Acceptance Trace">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="stable-step">
            <span>Proposal step</span>
            <span>{step} / {snapshots.length - 1}</span>
          </label>
          <input id="stable-step" type="range" min="0" max={snapshots.length - 1} value={step} onChange={(event) => setStep(Number(event.target.value))} className="w-full" />
          <NoteParagraph className="mb-0 mt-4 text-sm">{snapshot.proposal}</NoteParagraph>
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="mb-3 text-sm font-bold">Hospitals</h4>
              <div className="space-y-2">
                {hospitals.map((hospital) => (
                  <div
                    key={hospital}
                    className="rounded border px-3 py-2 text-sm"
                    style={{ borderColor: snapshot.free.includes(hospital) ? secondaryColor : primaryColor }}
                  >
                    {hospital} {snapshot.free.includes(hospital) ? '(free)' : '(matched)'}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="mb-3 text-sm font-bold">Tentative matches</h4>
              <div className="space-y-2">
                {students.map((student) => (
                  <div key={student} className="rounded border border-current/20 px-3 py-2 text-sm">
                    {student}: {snapshot.matches[student] ?? 'unmatched'}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <NoteParagraph className="mb-0 mt-4 text-sm">
            A tentative match can change, but only because the student trades up. That monotonic behavior is what makes stability provable.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

type SearchMode = 'bfs' | 'dfs';

const graphPositions: Record<string, { x: number; y: number }> = {
  A: { x: 70, y: 90 },
  B: { x: 180, y: 45 },
  C: { x: 180, y: 140 },
  D: { x: 300, y: 35 },
  E: { x: 300, y: 100 },
  F: { x: 300, y: 165 },
};

const graphEdges = [
  ['A', 'B'],
  ['A', 'C'],
  ['B', 'D'],
  ['B', 'E'],
  ['C', 'F'],
  ['E', 'F'],
];

const searchOrders: Record<SearchMode, string[]> = {
  bfs: ['A', 'B', 'C', 'D', 'E', 'F'],
  dfs: ['A', 'B', 'D', 'E', 'F', 'C'],
};

function GraphSearchExplorer() {
  const { subtlePanelClass, primaryColor, secondaryColor, mutedColor, textColor } = useAlgorithmsTheme();
  const [mode, setMode] = useState<SearchMode>('bfs');
  const [step, setStep] = useState(3);
  const order = searchOrders[mode];
  const visited = new Set(order.slice(0, step));

  return (
    <InteractiveBlock title="BFS vs DFS Search Order">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <div className="mb-4 grid grid-cols-2 gap-2">
            {(['bfs', 'dfs'] as SearchMode[]).map((choice) => (
              <button
                type="button"
                key={choice}
                onClick={() => {
                  setMode(choice);
                  setStep(3);
                }}
                className={`rounded border px-3 py-2 text-sm uppercase ${mode === choice ? 'border-current font-bold' : 'border-current/20'}`}
              >
                {choice}
              </button>
            ))}
          </div>
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="search-step">
            <span>Visited vertices</span>
            <span>{step}</span>
          </label>
          <input id="search-step" type="range" min="1" max={order.length} value={step} onChange={(event) => setStep(Number(event.target.value))} className="w-full" />
          <NoteParagraph className="mb-0 mt-4 text-sm">
            Order: {order.slice(0, step).join(' -> ')}
          </NoteParagraph>
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <svg viewBox="0 0 370 210" className="h-64 w-full" role="img" aria-label="Graph search order">
            {graphEdges.map(([u, v]) => {
              const a = graphPositions[u];
              const b = graphPositions[v];
              return <line key={`${u}-${v}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={mutedColor} strokeWidth="2" />;
            })}
            {Object.entries(graphPositions).map(([node, position]) => {
              const isVisited = visited.has(node);
              const visitIndex = order.indexOf(node) + 1;
              return (
                <g key={node}>
                  <circle
                    cx={position.x}
                    cy={position.y}
                    r="22"
                    fill={isVisited ? primaryColor : 'transparent'}
                    fillOpacity={isVisited ? '0.22' : '0.04'}
                    stroke={isVisited ? secondaryColor : mutedColor}
                    strokeWidth="2"
                  />
                  <text x={position.x} y={position.y + 4} textAnchor="middle" fontFamily="monospace" fontSize="14" fontWeight="700" fill={textColor}>
                    {node}
                  </text>
                  {isVisited && (
                    <text x={position.x + 18} y={position.y - 18} textAnchor="middle" fontFamily="monospace" fontSize="11" fill={secondaryColor}>
                      {visitIndex}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
          <NoteParagraph className="mb-0 text-sm">
            BFS expands in layers from the start. DFS commits to a path, then backtracks when it cannot keep going.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

type IntervalStrategy = 'finish' | 'start' | 'length';

const intervalJobs = [
  { name: 'A', start: 0, finish: 6 },
  { name: 'B', start: 1, finish: 3 },
  { name: 'C', start: 3, finish: 5 },
  { name: 'D', start: 4, finish: 7 },
  { name: 'E', start: 5, finish: 9 },
  { name: 'F', start: 6, finish: 10 },
  { name: 'G', start: 8, finish: 11 },
];

function chooseIntervals(strategy: IntervalStrategy) {
  const sorted = [...intervalJobs].sort((a, b) => {
    if (strategy === 'finish') return a.finish - b.finish || a.start - b.start;
    if (strategy === 'start') return a.start - b.start || a.finish - b.finish;
    return a.finish - a.start - (b.finish - b.start) || a.finish - b.finish;
  });
  const chosen: typeof intervalJobs = [];
  let lastFinish = -Infinity;
  for (const job of sorted) {
    if (job.start >= lastFinish) {
      chosen.push(job);
      lastFinish = job.finish;
    }
  }
  return chosen;
}

function IntervalGreedyExplorer() {
  const { subtlePanelClass, primaryColor, secondaryColor } = useAlgorithmsTheme();
  const [strategy, setStrategy] = useState<IntervalStrategy>('finish');
  const chosen = chooseIntervals(strategy);
  const chosenNames = new Set(chosen.map((job) => job.name));
  const strategyLabel = {
    finish: 'earliest finish time',
    start: 'earliest start time',
    length: 'shortest length',
  }[strategy];

  return (
    <InteractiveBlock title="Interval Scheduling Greedy Choice">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <div className="space-y-2">
            {(['finish', 'start', 'length'] as IntervalStrategy[]).map((choice) => (
              <button
                type="button"
                key={choice}
                onClick={() => setStrategy(choice)}
                className={`w-full rounded border px-3 py-2 text-left text-sm ${strategy === choice ? 'border-current font-bold' : 'border-current/20'}`}
              >
                {choice === 'finish' ? 'Earliest finish' : choice === 'start' ? 'Earliest start' : 'Shortest interval'}
              </button>
            ))}
          </div>
          <NoteParagraph className="mb-0 mt-4 text-sm">
            Current rule: {strategyLabel}. Selected jobs: {chosen.map((job) => job.name).join(', ')}.
          </NoteParagraph>
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <div className="relative h-72">
            {intervalJobs.map((job, index) => {
              const left = (job.start / 11) * 100;
              const width = ((job.finish - job.start) / 11) * 100;
              const selected = chosenNames.has(job.name);
              return (
                <div key={job.name} className="absolute left-0 right-0 h-7" style={{ top: `${index * 34}px` }}>
                  <span className="absolute left-0 top-1 text-xs font-bold">{job.name}</span>
                  <div
                    className="absolute top-0 h-7 rounded border px-2 py-1 text-xs"
                    style={{
                      left: `calc(${left}% + 2rem)`,
                      width: `calc(${width}% - 0.25rem)`,
                      borderColor: selected ? secondaryColor : primaryColor,
                      backgroundColor: selected ? `${secondaryColor}33` : `${primaryColor}1A`,
                    }}
                  >
                    {job.start}-{job.finish}
                  </div>
                </div>
              );
            })}
          </div>
          <NoteParagraph className="mb-0 text-sm">
            Earliest finish is the safe rule: it leaves the most remaining time for future compatible jobs.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

const weightedEdges = [
  ['S', 'A', 4],
  ['S', 'B', 1],
  ['B', 'A', 2],
  ['A', 'T', 1],
  ['B', 'C', 5],
  ['A', 'C', 1],
  ['C', 'T', 2],
] as const;

const dijkstraPositions: Record<string, { x: number; y: number }> = {
  S: { x: 50, y: 100 },
  A: { x: 170, y: 55 },
  B: { x: 170, y: 145 },
  C: { x: 290, y: 145 },
  T: { x: 410, y: 90 },
};

type DijkstraSnapshot = {
  settled: string[];
  distances: Record<string, number>;
  current: string;
};

function buildDijkstraSnapshots(): DijkstraSnapshot[] {
  const nodes = ['S', 'A', 'B', 'C', 'T'];
  const adj: Record<string, { to: string; weight: number }[]> = Object.fromEntries(nodes.map((node) => [node, []]));
  for (const [u, v, weight] of weightedEdges) {
    adj[u].push({ to: v, weight });
  }
  const distances = Object.fromEntries(nodes.map((node) => [node, node === 'S' ? 0 : Infinity])) as Record<string, number>;
  const settled: string[] = [];
  const snapshots: DijkstraSnapshot[] = [{ settled: [], distances: { ...distances }, current: 'S' }];

  while (settled.length < nodes.length) {
    const current = nodes
      .filter((node) => !settled.includes(node))
      .sort((a, b) => distances[a] - distances[b])[0];
    settled.push(current);
    for (const edge of adj[current]) {
      if (distances[current] + edge.weight < distances[edge.to]) {
        distances[edge.to] = distances[current] + edge.weight;
      }
    }
    snapshots.push({ settled: [...settled], distances: { ...distances }, current });
  }

  return snapshots;
}

function DijkstraExplorer() {
  const { subtlePanelClass, primaryColor, secondaryColor, mutedColor, textColor } = useAlgorithmsTheme();
  const snapshots = useMemo(buildDijkstraSnapshots, []);
  const [step, setStep] = useState(2);
  const snapshot = snapshots[step];
  const settled = new Set(snapshot.settled);
  const nodes = ['S', 'A', 'B', 'C', 'T'];

  return (
    <InteractiveBlock title="Dijkstra Distance Labels">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="dijkstra-step">
            <span>Settled step</span>
            <span>{step} / {snapshots.length - 1}</span>
          </label>
          <input id="dijkstra-step" type="range" min="0" max={snapshots.length - 1} value={step} onChange={(event) => setStep(Number(event.target.value))} className="w-full" />
          <NoteTable
            headers={['vertex', 'distance', 'settled?']}
            rows={nodes.map((node) => [
              node,
              Number.isFinite(snapshot.distances[node]) ? snapshot.distances[node] : <InlineMath math="\infty" />,
              settled.has(node) ? 'yes' : 'no',
            ])}
          />
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <svg viewBox="0 0 460 210" className="h-64 w-full" role="img" aria-label="Weighted graph for Dijkstra algorithm">
            {weightedEdges.map(([u, v, weight]) => {
              const a = dijkstraPositions[u];
              const b = dijkstraPositions[v];
              const midX = (a.x + b.x) / 2;
              const midY = (a.y + b.y) / 2;
              return (
                <g key={`${u}-${v}`}>
                  <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={mutedColor} strokeWidth="2" />
                  <rect x={midX - 9} y={midY - 10} width="18" height="18" rx="4" fill="currentColor" fillOpacity="0.08" />
                  <text x={midX} y={midY + 4} textAnchor="middle" fontFamily="monospace" fontSize="11" fill={textColor}>{weight}</text>
                </g>
              );
            })}
            {Object.entries(dijkstraPositions).map(([node, position]) => {
              const isSettled = settled.has(node);
              return (
                <g key={node}>
                  <circle
                    cx={position.x}
                    cy={position.y}
                    r="24"
                    fill={isSettled ? primaryColor : 'transparent'}
                    fillOpacity={isSettled ? '0.22' : '0.04'}
                    stroke={isSettled ? secondaryColor : mutedColor}
                    strokeWidth="2"
                  />
                  <text x={position.x} y={position.y + 4} textAnchor="middle" fontFamily="monospace" fontSize="14" fontWeight="700" fill={textColor}>
                    {node}
                  </text>
                </g>
              );
            })}
          </svg>
          <NoteParagraph className="mb-0 text-sm">
            Dijkstra is greedy: once the smallest tentative distance is settled, no later nonnegative edge can improve it.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function buildLcsTable(x: string, y: string) {
  const table = Array.from({ length: x.length + 1 }, () => Array(y.length + 1).fill(0) as number[]);
  for (let i = 1; i <= x.length; i += 1) {
    for (let j = 1; j <= y.length; j += 1) {
      if (x[i - 1] === y[j - 1]) table[i][j] = 1 + table[i - 1][j - 1];
      else table[i][j] = Math.max(table[i - 1][j], table[i][j - 1]);
    }
  }
  return table;
}

function LcsDpExplorer() {
  const { subtlePanelClass, primaryColor, secondaryColor } = useAlgorithmsTheme();
  const [example, setExample] = useState<'classic' | 'short'>('classic');
  const x = example === 'classic' ? 'ABCBDAB' : 'ABAZDC';
  const y = example === 'classic' ? 'BDCABA' : 'BACBAD';
  const table = useMemo(() => buildLcsTable(x, y), [x, y]);
  const maxValue = table[x.length][y.length];

  return (
    <InteractiveBlock title="Dynamic Programming Table for LCS">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <div className="mb-4 grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setExample('classic')} className={`rounded border px-3 py-2 text-sm ${example === 'classic' ? 'border-current font-bold' : 'border-current/20'}`}>
              Example 1
            </button>
            <button type="button" onClick={() => setExample('short')} className={`rounded border px-3 py-2 text-sm ${example === 'short' ? 'border-current font-bold' : 'border-current/20'}`}>
              Example 2
            </button>
          </div>
          <NoteParagraph className="mb-2 text-sm"><InlineMath math={`X=${x}`} /></NoteParagraph>
          <NoteParagraph className="mb-2 text-sm"><InlineMath math={`Y=${y}`} /></NoteParagraph>
          <NoteParagraph className="mb-0 text-sm">
            The final cell gives LCS length <strong>{maxValue}</strong>. Backtracking through the table recovers an actual subsequence.
          </NoteParagraph>
        </div>
        <div className={`overflow-x-auto rounded-lg border p-4 ${subtlePanelClass}`}>
          <table className="border-collapse text-center text-xs">
            <tbody>
              <tr>
                <td className="h-8 w-8" />
                <td className="h-8 w-8 font-bold">-</td>
                {y.split('').map((char, index) => (
                  <td key={`${char}-${index}`} className="h-8 w-8 font-bold">{char}</td>
                ))}
              </tr>
              {table.map((row, i) => (
                <tr key={i}>
                  <td className="h-8 w-8 font-bold">{i === 0 ? '-' : x[i - 1]}</td>
                  {row.map((cell, j) => {
                    const intensity = maxValue === 0 ? 0 : cell / maxValue;
                    return (
                      <td
                        key={`${i}-${j}`}
                        className="h-8 w-8 border border-current/20"
                        style={{ backgroundColor: cell === maxValue ? `${secondaryColor}44` : `${primaryColor}${Math.round(18 + intensity * 42).toString(16).padStart(2, '0')}` }}
                      >
                        {cell}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </InteractiveBlock>
  );
}

type CutName = 's' | 'sa' | 'sb' | 'sab';

const flowEdges = [
  ['s', 'a', 3],
  ['s', 'b', 2],
  ['a', 'b', 1],
  ['a', 't', 2],
  ['b', 't', 3],
] as const;

const flowPositions: Record<string, { x: number; y: number }> = {
  s: { x: 60, y: 100 },
  a: { x: 190, y: 55 },
  b: { x: 190, y: 145 },
  t: { x: 330, y: 100 },
};

function FlowCutExplorer() {
  const { subtlePanelClass, primaryColor, secondaryColor, mutedColor, textColor } = useAlgorithmsTheme();
  const [cutName, setCutName] = useState<CutName>('s');
  const cutSets: Record<CutName, string[]> = {
    s: ['s'],
    sa: ['s', 'a'],
    sb: ['s', 'b'],
    sab: ['s', 'a', 'b'],
  };
  const side = new Set(cutSets[cutName]);
  const crossing = flowEdges.filter(([u, v]) => side.has(u) && !side.has(v));
  const capacity = crossing.reduce((sum, edge) => sum + edge[2], 0);

  return (
    <InteractiveBlock title="Cuts Upper-Bound Flows">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <div className="space-y-2">
            {(['s', 'sa', 'sb', 'sab'] as CutName[]).map((choice) => (
              <button
                type="button"
                key={choice}
                onClick={() => setCutName(choice)}
                className={`w-full rounded border px-3 py-2 text-left text-sm ${cutName === choice ? 'border-current font-bold' : 'border-current/20'}`}
              >
                S-side = {'{'}{cutSets[choice].join(', ')}{'}'}
              </button>
            ))}
          </div>
          <NoteParagraph className="mb-0 mt-4 text-sm">
            Crossing capacity: <strong>{capacity}</strong>. Every <InlineMath math="s\text{-}t" /> flow is at most every cut capacity.
          </NoteParagraph>
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <svg viewBox="0 0 390 210" className="h-64 w-full" role="img" aria-label="Flow network and cut capacity">
            {flowEdges.map(([u, v, cap]) => {
              const a = flowPositions[u];
              const b = flowPositions[v];
              const isCrossing = side.has(u) && !side.has(v);
              const midX = (a.x + b.x) / 2;
              const midY = (a.y + b.y) / 2;
              return (
                <g key={`${u}-${v}`}>
                  <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={isCrossing ? secondaryColor : mutedColor} strokeWidth={isCrossing ? 4 : 2} />
                  <text x={midX} y={midY - 6} textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>c={cap}</text>
                </g>
              );
            })}
            {Object.entries(flowPositions).map(([node, position]) => {
              const inSide = side.has(node);
              return (
                <g key={node}>
                  <circle
                    cx={position.x}
                    cy={position.y}
                    r="24"
                    fill={inSide ? primaryColor : 'transparent'}
                    fillOpacity={inSide ? '0.22' : '0.04'}
                    stroke={inSide ? primaryColor : mutedColor}
                    strokeWidth="2"
                  />
                  <text x={position.x} y={position.y + 4} textAnchor="middle" fontFamily="monospace" fontSize="14" fontWeight="700" fill={textColor}>
                    {node}
                  </text>
                </g>
              );
            })}
          </svg>
          <NoteParagraph className="mb-0 text-sm">
            The minimum cut here has capacity 5, matching the maximum flow value.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

type CertificateExample = 'independent-set' | 'hamilton-path' | 'coloring';

function HardnessCertificateExplorer() {
  const { subtlePanelClass } = useAlgorithmsTheme();
  const [example, setExample] = useState<CertificateExample>('independent-set');
  const examples: Record<CertificateExample, { title: string; certificate: string; checks: string[] }> = {
    'independent-set': {
      title: 'Independent Set',
      certificate: 'A proposed vertex subset S.',
      checks: ['Check |S| >= k.', 'For every edge (u, v), check that not both endpoints are in S.'],
    },
    'hamilton-path': {
      title: 'Hamilton Path',
      certificate: 'A proposed ordering of all vertices.',
      checks: ['Check every vertex appears exactly once.', 'Check every consecutive pair is connected by an edge.'],
    },
    coloring: {
      title: '3-Coloring',
      certificate: 'A proposed color for every vertex.',
      checks: ['Check every color is one of three allowed colors.', 'For every edge, check the endpoints have different colors.'],
    },
  };
  const current = examples[example];

  return (
    <InteractiveBlock title="NP Certificates">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <div className="space-y-2">
            {(Object.keys(examples) as CertificateExample[]).map((key) => (
              <button
                type="button"
                key={key}
                onClick={() => setExample(key)}
                className={`w-full rounded border px-3 py-2 text-left text-sm ${example === key ? 'border-current font-bold' : 'border-current/20'}`}
              >
                {examples[key].title}
              </button>
            ))}
          </div>
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <h4 className="mb-3 text-sm font-bold">{current.title}</h4>
          <NoteParagraph className="text-sm"><strong>Certificate:</strong> {current.certificate}</NoteParagraph>
          <BulletList className="mb-0">
            {current.checks.map((check) => <li key={check}>{check}</li>)}
          </BulletList>
        </div>
      </div>
    </InteractiveBlock>
  );
}

export default function AlgorithmsNote() {
  return (
    <NotesLayout>
      <NoteHeader
        title="Algorithms"
        subtitle="Design, prove, and analyze efficient procedures for computational problems."
      />

      <AlgorithmNotationGuide />

      <NoteSectionTitle id="algorithm-design-and-analysis-overview">1. Algorithm Design and Analysis Overview</NoteSectionTitle>
      <NoteParagraph>
        An algorithm is a finite set of unambiguous instructions for solving a computational problem. A computational problem specifies valid
        inputs and the acceptable outputs for each input. The point is not just to write code that works on examples; it is to understand why a
        procedure works on every valid input and how its resource use grows.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="The Core Loop">
          <NumberedList className="mb-0">
            <li>Define the problem precisely: input, output, and constraints.</li>
            <li>Recognize structure: graph, ordering, recursion, choice, table, flow, or reduction.</li>
            <li>Design the algorithm using a suitable paradigm.</li>
            <li>Prove correctness with invariants, induction, exchange arguments, cuts, or reductions.</li>
            <li>Analyze worst-case running time and space.</li>
          </NumberedList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="running-time-and-asymptotic-notation">2. Running Time and Asymptotic Notation</NoteSectionTitle>
      <NoteParagraph>
        Running time is modeled as a function <InlineMath math="T(n)" /> of input size <InlineMath math="n" />. Asymptotic notation ignores
        machine-specific constants and lower-order terms so we can compare growth rates.
      </NoteParagraph>
      <NoteTable
        headers={['notation', 'meaning', 'use']}
        rows={[
          [<InlineMath math="f(n)=O(g(n))" />, <span><InlineMath math="f" /> grows no faster than <InlineMath math="g" /> up to constants</span>, 'upper bound'],
          [<InlineMath math="f(n)=\Omega(g(n))" />, <span><InlineMath math="f" /> grows at least as fast as <InlineMath math="g" /> up to constants</span>, 'lower bound'],
          [<InlineMath math="f(n)=\Theta(g(n))" />, <span><InlineMath math="f" /> and <InlineMath math="g" /> have the same asymptotic rate</span>, 'tight bound'],
        ]}
      />
      <MathBlock math="f(n)=O(g(n)) \text{ means } \exists c>0,n_0 \text{ such that } f(n)\le c g(n) \text{ for all } n\ge n_0." />
      <GrowthRateExplorer />

      <NoteSectionTitle id="stable-matching-and-gale-shapley">3. Stable Matching and Gale-Shapley</NoteSectionTitle>
      <NoteParagraph>
        Stable matching pairs two equal-size groups so that no unmatched pair would both prefer each other over their assigned partners. Such an
        unhappy pair is called a blocking pair. Gale-Shapley, also called deferred acceptance, repeatedly lets unmatched proposers propose down
        their preference lists while receivers keep only their best offer so far.
      </NoteParagraph>
      <CodeBlock
        language="text"
        code={`
while some proposer h is unmatched and has not proposed to everyone:
    let s be the highest-ranked receiver h has not proposed to
    if s is unmatched:
        match h and s tentatively
    else if s prefers h to current match h':
        match h and s tentatively
        make h' unmatched
    else:
        s rejects h
        `}
      />
      <NoteParagraph>
        There are at most <InlineMath math="n^2" /> proposals, so the algorithm terminates in <InlineMath math="O(n^2)" /> time with appropriate
        preference-rank data structures. Correctness comes from monotonicity: receivers only trade up, while proposers move downward through their
        lists. If a proposer preferred a receiver to its final match, it must have already proposed there and been rejected or replaced.
      </NoteParagraph>
      <StableMatchingExplorer />

      <NoteSectionTitle id="graph-basics-and-representations">4. Graph Basics and Representations</NoteSectionTitle>
      <NoteParagraph>
        A graph <InlineMath math="G=(V,E)" /> stores relationships. Vertices are objects; edges are connections. In an undirected graph, an edge
        <InlineMath math="\{u,v\}" /> connects both ways. In a directed graph, an edge <InlineMath math="(u,v)" /> points from <InlineMath math="u" />
        to <InlineMath math="v" />. A weighted graph attaches a number such as distance, cost, length, or capacity to an edge.
      </NoteParagraph>
      <NoteTable
        headers={['representation', 'space', 'edge lookup', 'best use']}
        rows={[
          ['adjacency list', <InlineMath math="O(n+m)" />, <span><InlineMath math="O(\deg(u))" /> unless hashed</span>, 'sparse graphs and traversals'],
          ['adjacency matrix', <InlineMath math="O(n^2)" />, <InlineMath math="O(1)" />, 'dense graphs or frequent edge-existence queries'],
        ]}
      />
      <BulletList>
        <li>A path is a sequence of vertices connected by edges.</li>
        <li>A cycle is a path that returns to its start without repeating internal vertices.</li>
        <li>A connected component is a maximal set of mutually reachable vertices in an undirected graph.</li>
        <li>A tree is connected and acyclic; equivalently, it has a unique simple path between every pair of vertices.</li>
      </BulletList>

      <NoteSectionTitle id="bfs-and-connected-components">5. BFS and Connected Components</NoteSectionTitle>
      <NoteParagraph>
        Breadth-first search explores by distance from a start vertex. It uses a queue, discovers all vertices at distance 1 before distance 2,
        and computes shortest path distances when every edge has unit length.
      </NoteParagraph>
      <CodeBlock
        language="text"
        code={`
BFS(s):
    set Level[v] = infinity and parent[v] = null for every v
    Level[s] = 0
    enqueue s

    while queue is not empty:
        u = dequeue
        for each v in Adj[u]:
            if Level[v] == infinity:
                Level[v] = Level[u] + 1
                parent[v] = u
                enqueue v
        `}
      />
      <NoteParagraph>
        With adjacency lists, BFS runs in <InlineMath math="O(n+m)" /> time because each vertex is enqueued once and each edge is inspected a
        constant number of times. Running BFS from an unvisited vertex also finds its connected component.
      </NoteParagraph>
      <GraphSearchExplorer />

      <NoteSectionTitle id="dfs-edge-classification-and-cycles">6. DFS, Edge Classification, and Cycles</NoteSectionTitle>
      <NoteParagraph>
        Depth-first search explores as far as possible before backtracking. It naturally supports discovery times, finish times, parent pointers,
        and edge classification. In directed graphs, a back edge to an ancestor signals a directed cycle.
      </NoteParagraph>
      <NoteTable
        headers={['edge type', 'description']}
        rows={[
          ['tree edge', 'used by DFS to discover a new vertex'],
          ['forward edge', 'goes from a vertex to a descendant in the DFS tree'],
          ['back edge', 'goes from a vertex to an ancestor; proves a directed cycle exists'],
          ['cross edge', 'connects vertices where neither is an ancestor of the other'],
        ]}
      />

      <NoteSectionTitle id="topological-sort-and-dags">7. Topological Sort and DAGs</NoteSectionTitle>
      <NoteParagraph>
        A topological ordering of a directed graph places every edge <InlineMath math="(u,v)" /> forward, so <InlineMath math="u" /> appears before
        <InlineMath math="v" />. Such an ordering exists exactly when the graph is a DAG: a directed acyclic graph.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="DFS Method">
          <BulletList className="mb-0">
            <li>Run DFS and record finish times <InlineMath math="f[v]" />.</li>
            <li>Order vertices by decreasing finish time.</li>
            <li>In a DAG, every edge goes from a later-finishing vertex to an earlier-finishing vertex in this reversed finish order.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="strongly-connected-components">8. Strongly Connected Components</NoteSectionTitle>
      <NoteParagraph>
        In a directed graph, a strongly connected component is a maximal set of vertices where every vertex can reach every other vertex. If each
        SCC is collapsed to a single node, the resulting component graph is a DAG.
      </NoteParagraph>
      <NumberedList>
        <li>Run DFS on <InlineMath math="G" /> and compute finish times.</li>
        <li>Reverse every edge to get <InlineMath math="G^R" />.</li>
        <li>Process vertices in decreasing finish time from the first DFS.</li>
        <li>Run DFS on <InlineMath math="G^R" /> in that order; each DFS tree is one SCC.</li>
      </NumberedList>
      <NoteParagraph>
        The two-pass algorithm runs in <InlineMath math="O(n+m)" /> time.
      </NoteParagraph>

      <NoteSectionTitle id="greedy-algorithms">9. Greedy Algorithms</NoteSectionTitle>
      <NoteParagraph>
        A greedy algorithm builds a solution one local choice at a time. Greedy algorithms are often simple and fast, but the local choice must be
        proven safe. A natural-looking greedy rule can fail badly.
      </NoteParagraph>
      <NoteTable
        headers={['proof style', 'core idea']}
        rows={[
          ['exchange argument', 'transform an optimal solution so it starts with the greedy choice without making it worse'],
          ['stays-ahead argument', 'show the greedy partial solution is always at least as good as any competitor by the same step'],
          ['cut property', 'show the cheapest edge crossing a cut is safe for an MST'],
          ['cycle property', 'show the heaviest edge on a cycle cannot be needed in an MST'],
        ]}
      />

      <NoteSectionTitle id="interval-scheduling">10. Interval Scheduling</NoteSectionTitle>
      <NoteParagraph>
        Interval scheduling asks for the largest compatible subset of jobs, where each job has a start time <InlineMath math="s_j" /> and finish
        time <InlineMath math="f_j" />. The correct greedy rule is earliest finish time first.
      </NoteParagraph>
      <IntervalGreedyExplorer />
      <NoteParagraph>
        Sorting costs <InlineMath math="O(n\log n)" /> and the scan costs <InlineMath math="O(n)" />. The exchange proof replaces the first job
        of an optimal schedule with the earliest-finishing compatible job; this leaves at least as much room for the rest.
      </NoteParagraph>

      <NoteSectionTitle id="interval-partitioning-and-priority-queues">11. Interval Partitioning and Priority Queues</NoteSectionTitle>
      <NoteParagraph>
        Interval partitioning schedules all intervals into the minimum number of classrooms. The depth is the maximum number of intervals
        overlapping at one time, and it is a lower bound because simultaneous intervals require distinct rooms.
      </NoteParagraph>
      <CodeBlock
        language="text"
        code={`
sort lectures by start time
for each lecture j:
    if the earliest-finishing room is free by s_j:
        reuse that room
    else:
        open a new room
    update the room's finish time to f_j
        `}
      />
      <NoteParagraph>
        A priority queue keyed by room finish time gives <InlineMath math="O(n\log n)" /> total time. When the algorithm opens a room, all existing
        rooms overlap the current lecture, so opening a new room is forced.
      </NoteParagraph>
      <NoteTable
        headers={['priority queue operation', 'heap cost']}
        rows={[
          ['find min', <InlineMath math="O(1)" />],
          ['insert', <InlineMath math="O(\log n)" />],
          ['extract min', <InlineMath math="O(\log n)" />],
          ['decrease key', <InlineMath math="O(\log n)" />],
        ]}
      />

      <NoteSectionTitle id="scheduling-to-minimize-lateness">12. Scheduling to Minimize Lateness</NoteSectionTitle>
      <NoteParagraph>
        Each job has a processing time <InlineMath math="t_j" /> and deadline <InlineMath math="d_j" />. If job <InlineMath math="j" /> completes
        at time <InlineMath math="C_j" />, its lateness is <InlineMath math="L_j=\max(0,C_j-d_j)" />. The goal is to minimize maximum lateness.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Earliest Deadline First">
          <BulletList className="mb-0">
            <li>Sort jobs by increasing deadline.</li>
            <li>Run them in that order without idle time.</li>
            <li>An exchange argument removes inversions: if two adjacent jobs are in deadline-wrong order, swapping them does not increase maximum lateness.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="shortest-paths-and-dijkstra">13. Shortest Paths and Dijkstra</NoteSectionTitle>
      <NoteParagraph>
        In a weighted graph, a shortest path minimizes total edge length. Dijkstra's algorithm solves single-source shortest paths when every edge
        length is nonnegative. It repeatedly settles the unsettled vertex with the smallest tentative distance and relaxes outgoing edges.
      </NoteParagraph>
      <MathBlock math="\text{relax }(u,v):\quad d[v]\leftarrow \min(d[v], d[u]+\ell(u,v))" />
      <DijkstraExplorer />
      <NoteParagraph>
        Negative edges break the key proof idea: a later path through an unsettled vertex might improve a distance that was already declared final.
      </NoteParagraph>

      <NoteSectionTitle id="minimum-spanning-trees">14. Minimum Spanning Trees</NoteSectionTitle>
      <NoteParagraph>
        A spanning tree connects every vertex using exactly <InlineMath math="n-1" /> edges. A minimum spanning tree, or MST, is a spanning tree of
        minimum total edge weight in a connected undirected weighted graph.
      </NoteParagraph>
      <NoteTable
        headers={['property', 'meaning']}
        rows={[
          ['cut property', 'the lightest edge crossing any cut is safe to add to some MST'],
          ['cycle property', 'the heaviest edge on a cycle is not needed in any MST when it is uniquely heaviest'],
        ]}
      />

      <NoteSectionTitle id="prims-algorithm">15. Prim's Algorithm</NoteSectionTitle>
      <NoteParagraph>
        Prim's algorithm grows one tree from an arbitrary start vertex. At each step, it adds the cheapest edge crossing from the built tree to an
        outside vertex. This is safe by the cut property.
      </NoteParagraph>
      <CodeBlock
        language="text"
        code={`
start with any vertex s
while some vertex is outside the tree:
    add the cheapest edge crossing from the tree to an outside vertex
        `}
      />
      <NoteParagraph>
        With a binary heap priority queue and adjacency lists, Prim's algorithm is typically analyzed as <InlineMath math="O(m\log n)" />.
      </NoteParagraph>

      <NoteSectionTitle id="kruskals-algorithm-and-union-find">16. Kruskal's Algorithm and Union-Find</NoteSectionTitle>
      <NoteParagraph>
        Kruskal's algorithm sorts all edges by weight and scans from lightest to heaviest, adding an edge exactly when it connects two different
        components. Union-find, also called disjoint set union, supports this component tracking efficiently.
      </NoteParagraph>
      <CodeBlock
        language="text"
        code={`
sort edges by increasing weight
for each edge (u, v):
    if Find(u) != Find(v):
        add (u, v) to the MST
        Union(u, v)
        `}
      />
      <NoteParagraph>
        The main cost is sorting: <InlineMath math="O(m\log m)" />, which is also <InlineMath math="O(m\log n)" /> for simple graphs. Path
        compression and union by rank make union-find operations effectively constant for ordinary analysis.
      </NoteParagraph>

      <NoteSectionTitle id="divide-and-conquer">17. Divide and Conquer</NoteSectionTitle>
      <NoteParagraph>
        Divide and conquer splits a problem into smaller independent subproblems, solves them recursively, and combines the results. The analysis
        usually becomes a recurrence.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Template">
          <NumberedList className="mb-0">
            <li>Divide the input into subproblems.</li>
            <li>Conquer by solving each subproblem recursively.</li>
            <li>Combine the subproblem answers.</li>
            <li>Prove correctness by induction on input size.</li>
          </NumberedList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="mergesort-and-binary-search">18. MergeSort and Binary Search</NoteSectionTitle>
      <NoteParagraph>
        MergeSort recursively sorts two halves, then merges sorted lists in linear time. Binary search repeatedly cuts a sorted search range in half.
        Both algorithms are simple examples where the recurrence exposes the growth rate.
      </NoteParagraph>
      <NoteTable
        headers={['algorithm', 'recurrence', 'running time']}
        rows={[
          ['MergeSort', <InlineMath math="T(n)=2T(n/2)+O(n)" />, <InlineMath math="O(n\log n)" />],
          ['Binary search', <InlineMath math="T(n)=T(n/2)+O(1)" />, <InlineMath math="O(\log n)" />],
        ]}
      />

      <NoteSectionTitle id="karatsuba-multiplication">19. Karatsuba Multiplication</NoteSectionTitle>
      <NoteParagraph>
        Ordinary grade-school multiplication of two <InlineMath math="n" />-digit numbers uses four half-size products. Karatsuba reduces this to
        three by reusing algebra.
      </NoteParagraph>
      <MathBlock math="xy=(a\cdot 10^m+b)(c\cdot 10^m+d)=ac\cdot 10^{2m}+((a+b)(c+d)-ac-bd)\cdot 10^m+bd" />
      <NoteParagraph>
        The recurrence becomes <InlineMath math="T(n)=3T(n/2)+O(n)" />, giving <InlineMath math="O(n^{\log_2 3})" />, about
        <InlineMath math="O(n^{1.585})" />.
      </NoteParagraph>

      <NoteSectionTitle id="recurrences-and-master-method">20. Recurrences and Master Method</NoteSectionTitle>
      <NoteParagraph>
        A recurrence defines a running time in terms of smaller input sizes. The Master Method handles many divide-and-conquer recurrences of the
        form <InlineMath math="T(n)=aT(n/b)+O(n^d)" />.
      </NoteParagraph>
      <NoteTable
        headers={['case', 'condition', 'result']}
        rows={[
          ['subproblem work dominates', <InlineMath math="a>b^d" />, <InlineMath math="T(n)=\Theta(n^{\log_b a})" />],
          ['balanced', <InlineMath math="a=b^d" />, <InlineMath math="T(n)=\Theta(n^d\log n)" />],
          ['combine work dominates', <InlineMath math="a<b^d" />, <InlineMath math="T(n)=\Theta(n^d)" />],
        ]}
      />
      <NoteParagraph>
        Recursion trees are the intuition: compare how much work appears across levels as the tree expands.
      </NoteParagraph>

      <NoteSectionTitle id="dynamic-programming-principles">21. Dynamic Programming Principles</NoteSectionTitle>
      <NoteParagraph>
        Dynamic programming applies when subproblems overlap and optimal answers can be assembled from optimal subproblem answers. The hard part is
        usually choosing the right subproblem, not filling the table.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="DP Recipe">
          <NumberedList className="mb-0">
            <li>Define subproblems precisely.</li>
            <li>Write the recurrence.</li>
            <li>State base cases.</li>
            <li>Choose top-down memoization or bottom-up table order.</li>
            <li>Recover the actual solution by backtracking if needed.</li>
          </NumberedList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="weighted-interval-scheduling">22. Weighted Interval Scheduling</NoteSectionTitle>
      <NoteParagraph>
        Weighted interval scheduling gives each compatible job a value. Greedy earliest-finish no longer works because a short job might block a
        much more valuable one. Sort by finish time and define <InlineMath math="p(j)" /> as the last job before <InlineMath math="j" /> that is
        compatible with <InlineMath math="j" />.
      </NoteParagraph>
      <MathBlock math="\operatorname{OPT}(j)=\max\{v_j+\operatorname{OPT}(p(j)),\operatorname{OPT}(j-1)\}" />
      <NoteParagraph>
        The recurrence says: either take job <InlineMath math="j" /> and jump back to <InlineMath math="p(j)" />, or skip job <InlineMath math="j" />.
        With binary search for <InlineMath math="p(j)" />, preprocessing is <InlineMath math="O(n\log n)" /> and the DP table is
        <InlineMath math="O(n)" />.
      </NoteParagraph>

      <NoteSectionTitle id="subset-sum-and-knapsack">23. Subset Sum and Knapsack</NoteSectionTitle>
      <NoteParagraph>
        Subset Sum asks whether some subset reaches a target total. Knapsack asks for maximum value under a weight limit. Both are pseudo-polynomial
        dynamic programs: their table size depends on the numeric capacity, not just the number of items.
      </NoteParagraph>
      <NoteTable
        headers={['problem', 'subproblem', 'choice']}
        rows={[
          ['Subset Sum', <span><InlineMath math="A[i,w]" />: can first <InlineMath math="i" /> items make sum <InlineMath math="w" />?</span>, 'skip item i or include it'],
          ['0/1 Knapsack', <span><InlineMath math="\operatorname{OPT}(i,w)" />: best value using first <InlineMath math="i" /> items within capacity <InlineMath math="w" /></span>, 'skip item i or include it once'],
        ]}
      />
      <MathBlock math="\operatorname{OPT}(i,w)=\max\{\operatorname{OPT}(i-1,w),\;v_i+\operatorname{OPT}(i-1,w-w_i)\}" />

      <NoteSectionTitle id="bellman-ford-and-negative-cycles">24. Bellman-Ford and Negative Cycles</NoteSectionTitle>
      <NoteParagraph>
        Bellman-Ford solves single-source shortest paths even with negative edge lengths, as long as no reachable negative-cost cycle can keep
        reducing path length forever. It is dynamic programming over the number of edges allowed in a path.
      </NoteParagraph>
      <MathBlock math="\operatorname{OPT}(i,v)=\min\{\operatorname{OPT}(i-1,v),\min_{(u,v)\in E}(\operatorname{OPT}(i-1,u)+\ell(u,v))\}" />
      <NoteParagraph>
        After <InlineMath math="n-1" /> rounds, all simple shortest paths have been considered. A further improvement on round
        <InlineMath math="n" /> reveals a reachable negative-cost cycle. The running time is <InlineMath math="O(nm)" />.
      </NoteParagraph>

      <NoteSectionTitle id="network-flow-basics">25. Network Flow Basics</NoteSectionTitle>
      <NoteParagraph>
        A flow network is a directed graph with source <InlineMath math="s" />, sink <InlineMath math="t" />, and capacities
        <InlineMath math="c(e)\ge 0" />. A flow sends quantity through edges without exceeding capacities and without creating or destroying flow
        at intermediate vertices.
      </NoteParagraph>
      <NoteTable
        headers={['condition', 'formula']}
        rows={[
          ['capacity', <InlineMath math="0\le f(e)\le c(e)" />],
          ['conservation', <InlineMath math="\sum_{\text{in}} f(e)=\sum_{\text{out}} f(e)" />],
          ['value', <InlineMath math="v(f)=\sum_{(s,u)} f(s,u)" />],
        ]}
      />

      <NoteSectionTitle id="residual-graphs-and-ford-fulkerson">26. Residual Graphs and Ford-Fulkerson</NoteSectionTitle>
      <NoteParagraph>
        The residual graph shows how a current flow can still be changed. A forward residual edge means more flow can be pushed. A backward
        residual edge means previous flow can be canceled and rerouted.
      </NoteParagraph>
      <CodeBlock
        language="text"
        code={`
while there is an s-t path in the residual graph:
    let bottleneck be the minimum residual capacity on the path
    augment that much flow along the path
        `}
      />
      <NoteParagraph>
        With integral capacities, each augmentation increases the flow value by at least 1, so Ford-Fulkerson terminates. More refined choices of
        augmenting paths lead to stronger polynomial guarantees.
      </NoteParagraph>

      <NoteSectionTitle id="max-flow-min-cut-theorem">27. Max-Flow Min-Cut Theorem</NoteSectionTitle>
      <NoteParagraph>
        An <InlineMath math="s\text{-}t" /> cut partitions vertices into an <InlineMath math="S" /> side containing <InlineMath math="s" /> and a
        <InlineMath math="T" /> side containing <InlineMath math="t" />. The cut capacity is the total capacity of edges going from
        <InlineMath math="S" /> to <InlineMath math="T" />.
      </NoteParagraph>
      <MathBlock math="\text{maximum flow value}=\text{minimum }s\text{-}t\text{ cut capacity}" />
      <FlowCutExplorer />

      <NoteSectionTitle id="flow-reductions-and-bipartite-matching">28. Flow Reductions and Bipartite Matching</NoteSectionTitle>
      <NoteParagraph>
        A reduction solves one problem by transforming it into another. Bipartite matching reduces cleanly to max flow: add source
        <InlineMath math="s" />, sink <InlineMath math="t" />, unit edges from <InlineMath math="s" /> to the left side, unit edges across the
        bipartite graph, and unit edges from the right side to <InlineMath math="t" />.
      </NoteParagraph>
      <NoteParagraph>
        Every matching of size <InlineMath math="k" /> gives a flow of value <InlineMath math="k" />, and every integral flow of value
        <InlineMath math="k" /> gives a matching of size <InlineMath math="k" />. Therefore maximum matching size equals maximum flow value.
      </NoteParagraph>

      <NoteSectionTitle id="flow-applications-light-switches-and-disjoint-paths">29. Flow Applications: Light Switches and Disjoint Paths</NoteSectionTitle>
      <NoteParagraph>
        Flow is useful because it models limited resources and disjoint choices. For a switch-to-light assignment problem, make a bipartite graph
        between switches and lights, adding an edge when the light is visible from the switch. A perfect matching gives a valid assignment.
      </NoteParagraph>
      <NoteParagraph>
        For maximum edge-disjoint <InlineMath math="s\text{-}t" /> paths, give every edge capacity 1 and run max flow. Each unit of integral flow
        corresponds to one path, and capacity 1 prevents two paths from sharing an edge.
      </NoteParagraph>

      <NoteSectionTitle id="circulation-with-demands">30. Circulation with Demands</NoteSectionTitle>
      <NoteParagraph>
        Circulation with demands lets nodes consume or supply flow. A node with <InlineMath math="d(v)>0" /> has demand, a node with
        <InlineMath math="d(v)<0" /> has supply, and a node with <InlineMath math="d(v)=0" /> is a transshipment node.
      </NoteParagraph>
      <MathBlock math="\sum_{\text{in}} f(e)-\sum_{\text{out}} f(e)=d(v)" />
      <NoteParagraph>
        To reduce to max flow, add a super-source to every supply node with capacity <InlineMath math="-d(v)" />, and add every demand node to a
        super-sink with capacity <InlineMath math="d(v)" />. A feasible circulation exists exactly when all edges out of the super-source can be
        saturated.
      </NoteParagraph>

      <NoteSectionTitle id="image-segmentation-via-min-cut">31. Image Segmentation via Min-Cut</NoteSectionTitle>
      <NoteParagraph>
        Image segmentation labels pixels as foreground or background while balancing two goals: pixels should receive labels they individually
        prefer, and neighboring pixels should usually receive the same label. An <InlineMath math="s\text{-}t" /> cut is naturally a binary label:
        source side means foreground, sink side means background.
      </NoteParagraph>
      <NoteParagraph>
        Edges from the source and to the sink encode individual label costs. Edges between neighboring pixels encode separation penalties. The
        minimum cut gives the globally best labeling for that objective.
      </NoteParagraph>

      <NoteSectionTitle id="sequence-alignment-and-lcs">32. Sequence Alignment and LCS</NoteSectionTitle>
      <NoteParagraph>
        Sequence alignment compares strings by allowing matches, mismatches, and gaps. A standard subproblem is
        <InlineMath math="\operatorname{OPT}(i,j)" />, the best alignment cost for prefixes <InlineMath math="X[1..i]" /> and
        <InlineMath math="Y[1..j]" />.
      </NoteParagraph>
      <MathBlock math="\operatorname{OPT}(i,j)=\min\{\operatorname{OPT}(i-1,j-1)+\operatorname{cost}(x_i,y_j),\operatorname{OPT}(i-1,j)+\delta,\operatorname{OPT}(i,j-1)+\delta\}" />
      <NoteParagraph>
        Longest common subsequence is the maximization cousin: keep equal characters in order while skipping others. Both use a grid of size
        <InlineMath math="O(mn)" />.
      </NoteParagraph>
      <LcsDpExplorer />

      <NoteSectionTitle id="computational-hardness">33. Computational Hardness</NoteSectionTitle>
      <NoteParagraph>
        Efficient algorithms do not exist for every natural problem. Some problems are intractable as far as we know; others are undecidable, meaning
        no algorithm can solve every input correctly.
      </NoteParagraph>
      <NoteTable
        headers={['kind', 'meaning', 'examples']}
        rows={[
          ['in P', 'solvable in polynomial time', 'reachability, shortest paths with nonnegative edges, minimum cut'],
          ['NP-complete', 'efficiently verifiable and at least as hard as every problem in NP', '3-SAT, Independent Set, Hamilton Path'],
          ['undecidable', 'no always-correct algorithm exists', 'Halting Problem'],
        ]}
      />

      <NoteSectionTitle id="p-np-certificates-and-verifiers">34. P, NP, Certificates, and Verifiers</NoteSectionTitle>
      <NoteParagraph>
        <InlineMath math="P" /> is the class of decision problems solvable in polynomial time. <InlineMath math="NP" /> is the class of decision
        problems whose yes answers can be verified in polynomial time using a certificate.
      </NoteParagraph>
      <MathBlock math="x\in X \iff \exists y \text{ of polynomial length such that } \operatorname{Verify}(x,y)=\text{true}" />
      <NoteParagraph>
        Every problem in <InlineMath math="P" /> is also in <InlineMath math="NP" /> because a solver can serve as a verifier without needing a
        meaningful certificate.
      </NoteParagraph>
      <HardnessCertificateExplorer />

      <NoteSectionTitle id="polynomial-time-reductions">35. Polynomial-Time Reductions</NoteSectionTitle>
      <NoteParagraph>
        A polynomial-time reduction <InlineMath math="X\le_p Y" /> means: if we could solve <InlineMath math="Y" /> efficiently, then we could solve
        <InlineMath math="X" /> efficiently by transforming inputs of <InlineMath math="X" /> into inputs of <InlineMath math="Y" />.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Direction Matters">
          <BulletList className="mb-0">
            <li>To use an algorithm for <InlineMath math="Y" /> to solve <InlineMath math="X" />, prove <InlineMath math="X\le_p Y" />.</li>
            <li>To prove <InlineMath math="Y" /> is hard, reduce a known hard problem <InlineMath math="X" /> to <InlineMath math="Y" />.</li>
            <li>Network flow applications are constructive reductions: build a flow instance, solve it, and translate the result back.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="np-completeness-and-undecidability">36. NP-Completeness and Undecidability</NoteSectionTitle>
      <NoteParagraph>
        A decision problem <InlineMath math="Y" /> is NP-complete when <InlineMath math="Y\in NP" /> and every problem in <InlineMath math="NP" />
        reduces to <InlineMath math="Y" /> in polynomial time. These are the hardest problems in <InlineMath math="NP" />: a polynomial-time
        algorithm for one NP-complete problem would imply <InlineMath math="P=NP" />.
      </NoteParagraph>
      <NoteParagraph>
        Undecidability is stronger. The Halting Problem asks whether a program eventually stops on a given input. No algorithm can always answer
        correctly for all programs and inputs. NP-complete problems can still be solved by brute force; undecidable problems cannot be solved by any
        always-correct algorithm.
      </NoteParagraph>
    </NotesLayout>
  );
}
