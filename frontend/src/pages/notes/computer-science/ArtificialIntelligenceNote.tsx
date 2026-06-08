/**
 * Artificial Intelligence Notes Page
 * A standalone note for agents, search, optimization, games, CSPs, supervised learning, MDPs, and reinforcement learning.
 */

import { useMemo, useState, type ReactNode } from 'react';
import { NotesLayout } from '../../../components/notes/NotesLayout';
import {
  AlgorithmBlock,
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

function useAITheme() {
  const { isDarkMode } = useDarkMode();
  const subtlePanelClass = isDarkMode
    ? 'bg-green-500/5 border-green-500/20 text-green-100'
    : 'bg-slate-50 border-slate-200 text-slate-700';
  const strongPanelClass = isDarkMode
    ? 'bg-green-500/10 border-green-400/30 text-green-100'
    : 'bg-white border-slate-200 text-slate-800';
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
  const accentColor = isDarkMode ? '#38bdf8' : '#0891b2';
  const mutedColor = isDarkMode ? '#86efac66' : '#94a3b8';
  const textColor = isDarkMode ? '#bbf7d0' : '#334155';
  const panelFill = isDarkMode ? '#052e16' : '#f8fafc';

  return {
    subtlePanelClass,
    strongPanelClass,
    listClass,
    orderedListClass,
    tableClass,
    tableHeadClass,
    tableCellClass,
    primaryColor,
    secondaryColor,
    accentColor,
    mutedColor,
    textColor,
    panelFill,
    isDarkMode,
  };
}

function BulletList({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { listClass } = useAITheme();
  return <ul className={`${listClass} ${className}`}>{children}</ul>;
}

function NoteTable({ headers, rows }: { headers: ReactNode[]; rows: TableRow[] }) {
  const { tableClass, tableHeadClass, tableCellClass } = useAITheme();

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

function AINotationGuide() {
  return (
    <NoteTopicGroup>
      <NoteTopicBlock title="Notation Used Throughout">
        <BulletList className="mb-0">
          <li><InlineMath math="s" /> is a state, and <InlineMath math="s'" /> is a next state reached after an action.</li>
          <li><InlineMath math="a" /> is an action. <InlineMath math="A(s)" /> is the set of actions available in state <InlineMath math="s" />.</li>
          <li><InlineMath math="g(n)" /> is path cost from the start to node <InlineMath math="n" />. <InlineMath math="h(n)" /> is a heuristic estimate from <InlineMath math="n" /> to a goal.</li>
          <li><InlineMath math="f(n)=g(n)+h(n)" /> is the A* priority score.</li>
          <li><InlineMath math="\alpha" /> and <InlineMath math="\beta" /> are alpha-beta pruning bounds in game search. In learning sections, <InlineMath math="\alpha" /> is often a learning rate, so the section will redefine it.</li>
          <li><InlineMath math="X_i" /> is a CSP variable, <InlineMath math="D_i" /> is its domain, and <InlineMath math="C" /> is a constraint.</li>
          <li><InlineMath math="x_i" /> is an input example, <InlineMath math="y_i" /> is its label or target, and <InlineMath math="\hat{y}_i" /> is the model prediction.</li>
          <li><InlineMath math="\theta" /> means model parameters, and <InlineMath math="f_\theta" /> is a parameterized model.</li>
          <li><InlineMath math="\pi" /> is a policy in decision-making sections: <InlineMath math="\pi(s)" /> is the action recommended in state <InlineMath math="s" />.</li>
          <li><InlineMath math="P(s'\mid s,a)" /> is a transition probability, <InlineMath math="R(s)" /> is a reward, <InlineMath math="U(s)" /> or <InlineMath math="V(s)" /> is a state value, and <InlineMath math="Q(s,a)" /> is an action value.</li>
          <li><InlineMath math="\gamma" /> is a discount factor with <InlineMath math="0\le \gamma < 1" />. Future rewards are multiplied by powers of <InlineMath math="\gamma" />.</li>
          <li><InlineMath math="\nabla" /> is the gradient operator: it points in the direction of steepest local increase.</li>
        </BulletList>
      </NoteTopicBlock>
    </NoteTopicGroup>
  );
}

type FrontierAlgorithm = 'bfs' | 'dfs' | 'dijkstra' | 'astar';

function FrontierOrderingExplorer() {
  const { subtlePanelClass, primaryColor, secondaryColor, accentColor } = useAITheme();
  const [algorithm, setAlgorithm] = useState<FrontierAlgorithm>('astar');
  const nodes = [
    { name: 'A', depth: 1, cost: 2, heuristic: 7, order: 5 },
    { name: 'B', depth: 1, cost: 5, heuristic: 2, order: 4 },
    { name: 'C', depth: 2, cost: 4, heuristic: 4, order: 3 },
    { name: 'D', depth: 3, cost: 3, heuristic: 3, order: 2 },
    { name: 'E', depth: 2, cost: 7, heuristic: 0, order: 1 },
  ];
  const scored = nodes
    .map((node) => {
      const score =
        algorithm === 'bfs'
          ? node.depth
          : algorithm === 'dfs'
            ? -node.order
            : algorithm === 'dijkstra'
              ? node.cost
              : node.cost + node.heuristic;
      return { ...node, score };
    })
    .sort((left, right) => left.score - right.score || left.name.localeCompare(right.name));
  const maxScore = Math.max(...scored.map((node) => Math.abs(node.score))) || 1;
  const labelMap: Record<FrontierAlgorithm, string> = {
    bfs: 'BFS: smallest depth first',
    dfs: 'DFS: most recently generated path first',
    dijkstra: 'Dijkstra: smallest true path cost first',
    astar: 'A*: smallest estimated total cost first',
  };

  return (
    <InteractiveBlock title="One Frontier, Four Search Strategies">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 block text-sm font-bold" htmlFor="frontier-algorithm">Frontier rule</label>
          <select
            id="frontier-algorithm"
            value={algorithm}
            onChange={(event) => setAlgorithm(event.target.value as FrontierAlgorithm)}
            className="w-full rounded border border-current/20 bg-transparent p-2 text-sm"
          >
            <option value="bfs">BFS</option>
            <option value="dfs">DFS</option>
            <option value="dijkstra">Dijkstra</option>
            <option value="astar">A*</option>
          </select>
          <NoteParagraph className="mb-0 mt-4 text-sm">
            Same partial paths, different priority rule. The first row is the next node to expand.
          </NoteParagraph>
        </div>
        <div className="space-y-3">
          <p className="font-mono text-sm font-bold">{labelMap[algorithm]}</p>
          {scored.map((node, index) => {
            const width = Math.max(8, (Math.abs(node.score) / maxScore) * 100);
            return (
              <div key={node.name} className="grid grid-cols-[3rem_minmax(0,1fr)_7rem] items-center gap-3 text-sm">
                <span className="font-mono font-bold">{index + 1}. {node.name}</span>
                <div className={`h-8 overflow-hidden rounded border ${subtlePanelClass}`}>
                  <div
                    className="h-full rounded"
                    style={{
                      width: `${width}%`,
                      backgroundColor: index === 0 ? primaryColor : index === 1 ? accentColor : secondaryColor,
                      opacity: 0.72,
                    }}
                  />
                </div>
                <span className="text-right font-mono">
                  {algorithm === 'astar' ? `g+h=${node.score}` : `score=${node.score}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </InteractiveBlock>
  );
}

function AStarHeuristicExplorer() {
  const { subtlePanelClass, primaryColor, secondaryColor, mutedColor, textColor } = useAITheme();
  const [weight, setWeight] = useState(1);
  const nodes = [
    { name: 'S', x: 40, y: 130, g: 0, h: 6 },
    { name: 'A', x: 130, y: 70, g: 2, h: 4 },
    { name: 'B', x: 130, y: 190, g: 1, h: 7 },
    { name: 'C', x: 230, y: 78, g: 5, h: 2 },
    { name: 'D', x: 230, y: 185, g: 3, h: 4 },
    { name: 'G', x: 330, y: 130, g: 7, h: 0 },
  ];
  const ranked = [...nodes]
    .filter((node) => node.name !== 'S')
    .map((node) => ({ ...node, f: node.g + weight * node.h }))
    .sort((left, right) => left.f - right.f || left.name.localeCompare(right.name));
  const best = ranked[0].name;

  return (
    <InteractiveBlock title="A* Heuristic Weight">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(270px,360px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="astar-weight">
            <span>Heuristic weight</span>
            <span><InlineMath math={`w=${weight.toFixed(1)}`} /></span>
          </label>
          <input id="astar-weight" type="range" min="0" max="2" step="0.1" value={weight} onChange={(event) => setWeight(Number(event.target.value))} className="w-full" />
          <NoteParagraph className="mb-0 mt-4 text-sm">
            Standard A* uses <InlineMath math="w=1" />. Raising the weight makes the search greedier; lowering it moves toward Dijkstra.
          </NoteParagraph>
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <svg viewBox="0 0 370 250" className="h-64 w-full">
            <line x1="40" y1="130" x2="130" y2="70" stroke={mutedColor} strokeWidth="3" />
            <line x1="40" y1="130" x2="130" y2="190" stroke={mutedColor} strokeWidth="3" />
            <line x1="130" y1="70" x2="230" y2="78" stroke={mutedColor} strokeWidth="3" />
            <line x1="130" y1="190" x2="230" y2="185" stroke={mutedColor} strokeWidth="3" />
            <line x1="230" y1="78" x2="330" y2="130" stroke={mutedColor} strokeWidth="3" />
            <line x1="230" y1="185" x2="330" y2="130" stroke={mutedColor} strokeWidth="3" />
            {nodes.map((node) => {
              const f = node.g + weight * node.h;
              const active = node.name === best;
              return (
                <g key={node.name}>
                  <circle cx={node.x} cy={node.y} r="23" fill={active ? primaryColor : node.name === 'G' ? secondaryColor : 'transparent'} stroke={active ? primaryColor : mutedColor} strokeWidth="3" opacity={active ? 0.9 : 1} />
                  <text x={node.x} y={node.y - 3} textAnchor="middle" fontSize="14" fontWeight="700" fill={active ? '#ffffff' : textColor}>{node.name}</text>
                  <text x={node.x} y={node.y + 14} textAnchor="middle" fontSize="10" fill={active ? '#ffffff' : textColor}>f={f.toFixed(1)}</text>
                </g>
              );
            })}
          </svg>
          <NoteParagraph className="mb-0 text-sm">
            The highlighted node has the smallest current <InlineMath math="f(n)=g(n)+w h(n)" /> score.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

const hillClimbingValues = [3, 5, 8, 7, 6, 6, 9, 12, 10, 8, 13, 15, 14, 11];

function LocalSearchLandscape() {
  const { subtlePanelClass, primaryColor, secondaryColor, accentColor, mutedColor, textColor } = useAITheme();
  const [start, setStart] = useState(1);
  const trajectory = useMemo(() => {
    const path = [start];
    let current = start;
    while (true) {
      const candidates = [current - 1, current + 1].filter((index) => index >= 0 && index < hillClimbingValues.length);
      const best = candidates.reduce((bestIndex, index) => (hillClimbingValues[index] > hillClimbingValues[bestIndex] ? index : bestIndex), current);
      if (hillClimbingValues[best] <= hillClimbingValues[current]) break;
      current = best;
      path.push(current);
    }
    return path;
  }, [start]);
  const finalIndex = trajectory[trajectory.length - 1];
  const maxValue = Math.max(...hillClimbingValues);

  return (
    <InteractiveBlock title="Hill Climbing Gets Local Information">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="hill-start">
            <span>Starting state</span>
            <span>{start}</span>
          </label>
          <input id="hill-start" type="range" min="0" max={hillClimbingValues.length - 1} value={start} onChange={(event) => setStart(Number(event.target.value))} className="w-full" />
          <NoteParagraph className="mb-0 mt-4 text-sm">
            Hill climbing moves to a better neighbor until neither immediate neighbor improves the objective.
          </NoteParagraph>
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <svg viewBox="0 0 420 220" className="h-64 w-full">
            <polyline
              points={hillClimbingValues.map((value, index) => `${24 + index * 28},${190 - value * 10}`).join(' ')}
              fill="none"
              stroke={mutedColor}
              strokeWidth="3"
            />
            {hillClimbingValues.map((value, index) => {
              const inPath = trajectory.includes(index);
              const isFinal = index === finalIndex;
              return (
                <g key={index}>
                  <line x1={24 + index * 28} y1="192" x2={24 + index * 28} y2={190 - value * 10} stroke={inPath ? accentColor : mutedColor} strokeWidth="2" opacity="0.55" />
                  <circle cx={24 + index * 28} cy={190 - value * 10} r={isFinal ? 8 : inPath ? 6 : 4} fill={isFinal ? primaryColor : inPath ? accentColor : secondaryColor} />
                  <text x={24 + index * 28} y="210" textAnchor="middle" fontSize="10" fill={textColor}>{index}</text>
                </g>
              );
            })}
            <text x="16" y="28" fontSize="12" fill={textColor}>max value = {maxValue}</text>
            <text x="16" y="46" fontSize="12" fill={textColor}>returned state = {finalIndex}</text>
          </svg>
          <NoteParagraph className="mb-0 text-sm">
            A random restart changes the starting state; simulated annealing sometimes accepts a worse step to escape traps.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function AlphaBetaTrace() {
  const { subtlePanelClass, primaryColor, secondaryColor, mutedColor, textColor } = useAITheme();
  const [ordering, setOrdering] = useState<'good' | 'bad'>('good');
  const leaves = ordering === 'good'
    ? [
        [8, 7],
        [6, 5],
        [4, 3],
      ]
    : [
        [3, 4],
        [5, 6],
        [7, 8],
      ];
  const firstMin = Math.min(...leaves[0]);
  const secondMin = Math.min(...leaves[1]);
  const thirdMin = Math.min(...leaves[2]);
  const root = Math.max(firstMin, secondMin, thirdMin);
  const pruned = ordering === 'good' ? 4 : 0;

  return (
    <InteractiveBlock title="Alpha-Beta Pruning Depends on Order">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 block text-sm font-bold" htmlFor="ab-order">Move ordering</label>
          <select
            id="ab-order"
            value={ordering}
            onChange={(event) => setOrdering(event.target.value as 'good' | 'bad')}
            className="w-full rounded border border-current/20 bg-transparent p-2 text-sm"
          >
            <option value="good">strong moves first</option>
            <option value="bad">weak moves first</option>
          </select>
          <NoteParagraph className="mb-0 mt-4 text-sm">
            Alpha-beta gives the same minimax answer as full search. Good ordering only reduces how much of the tree must be examined.
          </NoteParagraph>
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <svg viewBox="0 0 440 260" className="h-72 w-full">
            <circle cx="220" cy="32" r="22" fill={primaryColor} opacity="0.85" />
            <text x="220" y="37" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff">MAX {root}</text>
            {[80, 220, 360].map((x, groupIndex) => (
              <g key={x}>
                <line x1="220" y1="54" x2={x} y2="103" stroke={mutedColor} strokeWidth="2" />
                <circle cx={x} cy="118" r="22" fill={secondaryColor} opacity="0.8" />
                <text x={x} y="123" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff">MIN {Math.min(...leaves[groupIndex])}</text>
                {[x - 30, x + 30].map((leafX, leafIndex) => {
                  const isPruned = ordering === 'good' && groupIndex > 0 && leafIndex === 1;
                  return (
                    <g key={leafX} opacity={isPruned ? 0.22 : 1}>
                      <line x1={x} y1="140" x2={leafX} y2="190" stroke={isPruned ? secondaryColor : mutedColor} strokeWidth={isPruned ? 4 : 2} />
                      <rect x={leafX - 18} y="190" width="36" height="32" rx="6" fill="transparent" stroke={isPruned ? secondaryColor : mutedColor} strokeWidth="2" />
                      <text x={leafX} y="211" textAnchor="middle" fontSize="12" fill={textColor}>{leaves[groupIndex][leafIndex]}</text>
                    </g>
                  );
                })}
              </g>
            ))}
          </svg>
          <NoteParagraph className="mb-0 text-sm">
            Pruned leaves: {pruned}. Once a MIN branch is already no better than the current MAX option, it cannot change the root decision.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

type CspStep = 0 | 1 | 2 | 3;

function CSPPruningExplorer() {
  const { subtlePanelClass, primaryColor, secondaryColor } = useAITheme();
  const [step, setStep] = useState<CspStep>(0);
  const domains = [
    { step: 0, a: [1, 2, 3], b: [1, 2, 3], c: [1, 2, 3], note: 'Start with broad domains.' },
    { step: 1, a: [1, 2], b: [2, 3], c: [1, 2, 3], note: 'Unary facts remove impossible values.' },
    { step: 2, a: [1, 2], b: [2, 3], c: [1, 3], note: 'Revise arcs using binary constraints.' },
    { step: 3, a: [1], b: [2], c: [3], note: 'Search plus inference reaches a complete assignment.' },
  ];
  const current = domains[step];

  return (
    <InteractiveBlock title="CSP Domains Shrink Before Search">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="csp-step">
            <span>Inference step</span>
            <span>{step}</span>
          </label>
          <input id="csp-step" type="range" min="0" max="3" value={step} onChange={(event) => setStep(Number(event.target.value) as CspStep)} className="w-full" />
          <NoteParagraph className="mb-0 mt-4 text-sm">
            Constraints: <InlineMath math="A<B" />, <InlineMath math="B\ne C" />, and <InlineMath math="A\ne C" />. Arc consistency deletes values that have no legal partner.
          </NoteParagraph>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ['A', current.a],
            ['B', current.b],
            ['C', current.c],
          ].map(([name, values]) => (
            <div key={name as string} className={`rounded-lg border p-4 ${subtlePanelClass}`}>
              <p className="mb-3 font-mono text-sm font-bold"><InlineMath math={`D_${name}`} /></p>
              <div className="flex flex-wrap gap-2">
                {(values as number[]).map((value) => (
                  <span key={value} className="rounded border px-3 py-2 font-mono text-sm" style={{ borderColor: primaryColor, color: primaryColor }}>
                    {value}
                  </span>
                ))}
              </div>
            </div>
          ))}
          <div className={`rounded-lg border p-4 sm:col-span-3 ${subtlePanelClass}`}>
            <p className="mb-0 font-mono text-sm">{current.note}</p>
            <div className="mt-4 h-2 rounded" style={{ backgroundColor: secondaryColor, opacity: 0.35, width: `${25 + step * 25}%` }} />
          </div>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function BellmanUpdateExplorer() {
  const { subtlePanelClass, primaryColor, secondaryColor } = useAITheme();
  const [gamma, setGamma] = useState(0.8);
  const [leftProb, setLeftProb] = useState(0.7);
  const reward = -0.04;
  const leftValue = 1.0;
  const rightValue = -0.4;
  const expected = leftProb * leftValue + (1 - leftProb) * rightValue;
  const updated = reward + gamma * expected;

  return (
    <InteractiveBlock title="Bellman One-Step Backup">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="bellman-gamma">
            <span>Discount <InlineMath math="\gamma" /></span>
            <span>{gamma.toFixed(2)}</span>
          </label>
          <input id="bellman-gamma" type="range" min="0" max="0.99" step="0.01" value={gamma} onChange={(event) => setGamma(Number(event.target.value))} className="mb-4 w-full" />
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="bellman-prob">
            <span><InlineMath math="P(left\ outcome)" /></span>
            <span>{leftProb.toFixed(2)}</span>
          </label>
          <input id="bellman-prob" type="range" min="0" max="1" step="0.05" value={leftProb} onChange={(event) => setLeftProb(Number(event.target.value))} className="w-full" />
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <NoteTable
            headers={['quantity', 'value']}
            rows={[
              [<InlineMath math="R(s)" />, reward.toFixed(2)],
              [<InlineMath math="U(left)" />, leftValue.toFixed(2)],
              [<InlineMath math="U(right)" />, rightValue.toFixed(2)],
              [<InlineMath math="\sum_{s'}P(s'\mid s,a)U(s')" />, expected.toFixed(3)],
              [<InlineMath math="R(s)+\gamma\sum_{s'}P(s'\mid s,a)U(s')" />, updated.toFixed(3)],
            ]}
          />
          <div className="grid grid-cols-[1fr_1fr] gap-3">
            <div className="h-3 rounded" style={{ backgroundColor: primaryColor, opacity: Math.max(0.2, leftProb) }} />
            <div className="h-3 rounded" style={{ backgroundColor: secondaryColor, opacity: Math.max(0.2, 1 - leftProb) }} />
          </div>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function QUpdateExplorer() {
  const { subtlePanelClass } = useAITheme();
  const [method, setMethod] = useState<'qlearning' | 'sarsa'>('qlearning');
  const [alpha, setAlpha] = useState(0.4);
  const currentQ = 0.3;
  const reward = 1;
  const gamma = 0.9;
  const bestNextQ = 0.8;
  const actualNextQ = 0.2;
  const bootstrap = method === 'qlearning' ? bestNextQ : actualNextQ;
  const target = reward + gamma * bootstrap;
  const nextQ = currentQ + alpha * (target - currentQ);

  return (
    <InteractiveBlock title="Q-Learning vs SARSA Target">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 block text-sm font-bold" htmlFor="q-method">Update rule</label>
          <select
            id="q-method"
            value={method}
            onChange={(event) => setMethod(event.target.value as 'qlearning' | 'sarsa')}
            className="mb-4 w-full rounded border border-current/20 bg-transparent p-2 text-sm"
          >
            <option value="qlearning">Q-learning: best next action</option>
            <option value="sarsa">SARSA: actual next action</option>
          </select>
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="q-alpha">
            <span>Learning rate <InlineMath math="\alpha" /></span>
            <span>{alpha.toFixed(2)}</span>
          </label>
          <input id="q-alpha" type="range" min="0.05" max="1" step="0.05" value={alpha} onChange={(event) => setAlpha(Number(event.target.value))} className="w-full" />
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <NoteTable
            headers={['quantity', 'value']}
            rows={[
              [<InlineMath math="Q(s,a)" />, currentQ.toFixed(2)],
              [<InlineMath math="r" />, reward.toFixed(2)],
              [<InlineMath math="\gamma" />, gamma.toFixed(2)],
              [method === 'qlearning' ? <InlineMath math="\max_{a'}Q(s',a')" /> : <InlineMath math="Q(s',a')" />, bootstrap.toFixed(2)],
              ['TD target', target.toFixed(3)],
              ['updated value', nextQ.toFixed(3)],
            ]}
          />
          <NoteParagraph className="mb-0 text-sm">
            Q-learning is off-policy because it updates toward the greedy next action. SARSA is on-policy because it updates toward the action actually taken.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

export default function ArtificialIntelligenceNote() {
  return (
    <NotesLayout>
      <NoteHeader
        title="Artificial Intelligence"
        subtitle="A practical guide to intelligent agents: representation, search, optimization, games, constraints, supervised learning, Markov decision processes, and reinforcement learning."
      />

      <AINotationGuide />

      <NoteSectionTitle id="artificial-intelligence-overview">1. Artificial Intelligence Overview</NoteSectionTitle>
      <NoteParagraph>
        Artificial intelligence is the study of systems that choose actions, make predictions, solve problems, or improve behavior from experience. The unifying object is an <strong>agent</strong>: something that receives information, reasons or learns from it, and acts in an environment.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="The Central Question">
          <NoteParagraph>
            Given an agent, a world, available information, and a performance objective, what action should the agent choose? Search answers this with state graphs, games answer it with opponents, CSPs answer it with legal assignments, supervised learning answers it from labeled examples, and reinforcement learning answers it from reward-driven experience.
          </NoteParagraph>
        </NoteTopicBlock>
        <NoteTopicBlock title="Symbolic and Statistical AI">
          <BulletList className="mb-0">
            <li><strong>Symbolic AI</strong> represents states, rules, goals, constraints, and game trees explicitly.</li>
            <li><strong>Statistical AI</strong> learns patterns from data or experience using probabilities, parameters, gradients, or value functions.</li>
            <li>Modern systems often combine both: for example, a learned evaluation function inside a search procedure.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="brief-history-of-ai">2. Brief History of AI</NoteSectionTitle>
      <NoteParagraph>
        AI has moved through waves of optimism, disappointment, and resurgence. Early work asked whether computation could imitate reasoning. Rule-based systems later showed that expert knowledge could be encoded, but they were brittle and expensive to maintain. Modern progress came from faster hardware, larger datasets, numerical optimization, and practical neural-network training.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Why This Matters">
          <NoteParagraph className="mb-0">
            The history explains why AI contains both hand-built reasoning systems and data-driven learning systems. Search, heuristics, game trees, and constraints are still central because many intelligent behaviors require deliberate reasoning, not only prediction.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="ai-umbrella-and-core-vocabulary">3. AI Umbrella and Core Vocabulary</NoteSectionTitle>
      <NoteParagraph>
        AI is not one algorithm. It is an umbrella for methods that let machines perceive, represent, search, decide, learn, and act. Common areas include natural language processing, computer vision, robotics, search, planning, learning theory, and reinforcement learning.
      </NoteParagraph>
      <NoteTable
        headers={['term', 'meaning']}
        rows={[
          ['state', 'A representation of the world at one moment.'],
          ['action', 'A choice that may change the state.'],
          ['model', 'A representation of how the world works, how data is generated, or how actions lead to outcomes.'],
          ['objective', 'The quantity the system tries to optimize.'],
          ['policy', 'A rule for choosing actions from states.'],
          ['learning', 'Changing a model or policy based on data or experience.'],
        ]}
      />

      <NoteSectionTitle id="agents-environments-and-rationality">4. Agents, Environments, and Rationality</NoteSectionTitle>
      <NoteParagraph>
        An <strong>agent</strong> receives percepts from an environment and chooses actions. An <strong>agent function</strong> maps available information to actions. Rationality means choosing the action expected to do best according to a performance metric, given what the agent has perceived and knows.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Rational Is Not Omniscient">
          <NoteParagraph className="mb-0">
            A rational agent can still get a bad outcome if the world is uncertain. Rationality is about using available information well; omniscience would mean knowing the future.
          </NoteParagraph>
        </NoteTopicBlock>
        <NoteTopicBlock title="Agent Loop">
          <AlgorithmBlock
            title="Agent Loop"
            steps={[
              'Observe the current state or percept.',
              'Update internal information.',
              'Choose an action using the objective.',
              'Let the environment change.',
              'Repeat with the next percept.',
            ]}
            className="mb-0"
          />
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="task-environments">5. Task Environments</NoteSectionTitle>
      <NoteParagraph>
        A task environment describes the problem an agent faces: performance metric, environment, sensors, and actions. The same algorithm can be appropriate or inappropriate depending on these properties.
      </NoteParagraph>
      <NoteTable
        headers={['axis', 'question']}
        rows={[
          ['fully observable vs partially observable', 'Does the agent see the complete state?'],
          ['deterministic vs stochastic', 'Does an action have a guaranteed result or probabilistic result?'],
          ['single-agent vs multi-agent', 'Is another decision-maker involved?'],
          ['competitive vs cooperative', 'Do agents have conflicting objectives or shared objectives?'],
          ['static vs dynamic', 'Can the world change while the agent thinks?'],
          ['known vs unknown', 'Does the agent know the transition rules?'],
          ['discrete vs continuous', 'Are states/actions countable or real-valued?'],
          ['episodic vs sequential', 'Does each decision stand alone, or do actions affect later choices?'],
        ]}
      />

      <NoteSectionTitle id="agent-types">6. Agent Types</NoteSectionTitle>
      <NoteParagraph>
        Agent designs differ by how much memory, planning, utility modeling, and learning they use.
      </NoteParagraph>
      <NoteTable
        headers={['agent type', 'decision rule']}
        rows={[
          ['simple reflex', 'Use the current percept only.'],
          ['model-based reflex', 'Maintain internal state so hidden history can matter.'],
          ['goal-based', 'Choose actions that move toward desired states.'],
          ['utility-based', 'Compare outcomes using numeric utility.'],
          ['learning', 'Improve the decision process from data or reward.'],
        ]}
      />

      <NoteSectionTitle id="classical-search-problems">7. Classical Search Problems</NoteSectionTitle>
      <NoteParagraph>
        Classical search represents the world as states and transitions. A goal test identifies success, and a search algorithm decides which partial path to expand next. If the world is a graph <InlineMath math="G=(V,E)" />, vertices are states and edges are legal transitions.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Search Problem Ingredients">
          <BulletList className="mb-0">
            <li><strong>Initial state:</strong> where the agent starts.</li>
            <li><strong>Actions:</strong> legal moves from each state.</li>
            <li><strong>Transition model:</strong> what state results from an action.</li>
            <li><strong>Goal test:</strong> whether a state is a solution.</li>
            <li><strong>Path cost:</strong> the cost of the action sequence.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>
      <FrontierOrderingExplorer />

      <NoteSectionTitle id="breadth-first-search">8. Breadth-First Search</NoteSectionTitle>
      <NoteParagraph>
        Breadth-first search explores by distance from the start. It visits all states at depth <InlineMath math="0" />, then all states at depth <InlineMath math="1" />, then depth <InlineMath math="2" />, and so on.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="When BFS Is Useful">
          <BulletList className="mb-0">
            <li>It is complete for finite graphs when repeated states are handled.</li>
            <li>It finds a shallowest solution in unweighted graphs.</li>
            <li>It can use a lot of memory because it stores the frontier level by level.</li>
            <li>It is blind: it does not know which direction the goal lies.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="depth-first-search-and-iterative-deepening">9. Depth-First Search and Iterative Deepening</NoteSectionTitle>
      <NoteParagraph>
        Depth-first search explores one branch deeply before trying siblings. It can be implemented recursively or with a stack. It uses less memory than BFS but can return a poor path or get trapped without cycle control.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Depth Limits">
          <NoteParagraph>
            Depth-limited search cuts off exploration after a maximum depth. Iterative deepening repeats depth-limited DFS with limits <InlineMath math="0,1,2,\ldots" /> until a goal is found.
          </NoteParagraph>
          <NoteParagraph className="mb-0">
            Iterative deepening often behaves like BFS for solution depth while keeping DFS-style memory.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="dijkstras-algorithm">10. Dijkstra's Algorithm</NoteSectionTitle>
      <NoteParagraph>
        Dijkstra's algorithm solves shortest paths with nonnegative edge costs. It expands the frontier path with the smallest known cost so far. Once a node is expanded with the minimum possible cost, its shortest path is finalized.
      </NoteParagraph>
      <MathBlock math="g(v)=\min_{(u,v)\in E} g(u)+w(u,v)" />
      <NoteParagraph>
        The key idea is that shortest paths contain shortest subpaths. If a cheaper route to a frontier node is found, the old route is replaced.
      </NoteParagraph>

      <NoteSectionTitle id="a-star-search">11. A* Search</NoteSectionTitle>
      <NoteParagraph>
        A* adds a heuristic estimate to Dijkstra. Instead of expanding the smallest <InlineMath math="g(n)" /> only, it expands the smallest estimated total cost:
      </NoteParagraph>
      <MathBlock math="f(n)=g(n)+h(n)" />
      <NoteParagraph>
        <InlineMath math="g(n)" /> is the true path cost from the start to <InlineMath math="n" />. <InlineMath math="h(n)" /> estimates the remaining cost from <InlineMath math="n" /> to a goal.
      </NoteParagraph>
      <AStarHeuristicExplorer />

      <NoteSectionTitle id="heuristics-admissibility-and-consistency">12. Heuristics: Admissibility and Consistency</NoteSectionTitle>
      <NoteParagraph>
        A heuristic is <strong>admissible</strong> if it never overestimates the true remaining cost. It is <strong>consistent</strong> if it obeys a triangle-inequality-like rule across every action.
      </NoteParagraph>
      <MathBlock math="h(n)\le \operatorname{trueCost}(n,\operatorname{goal})" />
      <MathBlock math="h(u)\le cost(u,a,v)+h(v)" />
      <NoteParagraph>
        Consistency implies admissibility. With a consistent admissible heuristic and nonnegative costs, A* is optimal while often expanding far fewer nodes than Dijkstra.
      </NoteParagraph>

      <NoteSectionTitle id="local-search-and-optimization">13. Local Search and Optimization</NoteSectionTitle>
      <NoteParagraph>
        Classical search finds paths. Local search is for problems where the path does not matter and only the final state matters. The algorithm moves among neighboring states to optimize an objective function.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Objective Surface">
          <BulletList className="mb-0">
            <li>A <strong>local optimum</strong> is better than nearby states but not necessarily globally best.</li>
            <li>A <strong>plateau</strong> is a flat region where nearby states have equal value.</li>
            <li>A <strong>ridge</strong> requires movement in a direction not obvious from single-step neighbors.</li>
            <li>A <strong>trajectory</strong> is the sequence of states visited by the optimizer.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="hill-climbing">14. Hill Climbing</NoteSectionTitle>
      <NoteParagraph>
        Hill climbing repeatedly moves to a better neighbor. It is greedy, memory efficient, and often useful, but it can stop at local optima or plateaus.
      </NoteParagraph>
      <AlgorithmBlock
        title="Hill Climbing"
        steps={[
          'Start with an initial state.',
          'If some neighbor has a better objective value, move to the best such neighbor.',
          'Repeat until no neighboring state improves the objective.',
          'Return the final local optimum.',
        ]}
      />
      <LocalSearchLandscape />

      <NoteSectionTitle id="simulated-annealing">15. Simulated Annealing</NoteSectionTitle>
      <NoteParagraph>
        Simulated annealing is hill climbing with controlled randomness. It accepts better moves, and sometimes accepts worse moves with a probability that decreases over time.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Temperature Intuition">
          <NoteParagraph className="mb-0">
            High temperature means broad exploration. Low temperature means mostly greedy behavior. The temperature schedule controls the transition from exploration to convergence.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="local-beam-search">16. Local Beam Search</NoteSectionTitle>
      <NoteParagraph>
        Local beam search keeps <InlineMath math="k" /> current states. Each step generates children from all <InlineMath math="k" /> states, then keeps the best <InlineMath math="k" /> children as the new beam.
      </NoteParagraph>
      <NoteParagraph>
        Unlike random restarts, the states in the beam share information indirectly because the global top <InlineMath math="k" /> candidates survive. Stochastic beam search keeps diversity by sampling instead of always taking the top candidates.
      </NoteParagraph>

      <NoteSectionTitle id="genetic-algorithms">17. Genetic Algorithms</NoteSectionTitle>
      <NoteParagraph>
        Genetic algorithms are population-based local search. The population contains candidate states, the fitness function scores them, selection chooses parents, crossover combines parent structure, mutation injects variation, and replacement forms the next generation.
      </NoteParagraph>
      <NoteTable
        headers={['term', 'meaning']}
        rows={[
          ['population', 'The beam of current candidate solutions.'],
          ['fitness', 'Objective score; higher usually means better.'],
          ['selection', 'Choose candidates to become parents.'],
          ['crossover', 'Combine parts of two parents into a child.'],
          ['mutation', 'Randomly modify a child to preserve diversity.'],
          ['schema', 'A pattern that fixes some properties while leaving others free.'],
        ]}
      />

      <NoteSectionTitle id="continuous-optimization-and-gradients">18. Continuous Optimization and Gradients</NoteSectionTitle>
      <NoteParagraph>
        In continuous spaces, enumerating all neighbors is impossible. The gradient gives the local direction of steepest increase:
      </NoteParagraph>
      <MathBlock math="\nabla f(x)=\left[\frac{\partial f}{\partial x_1},\frac{\partial f}{\partial x_2},\ldots,\frac{\partial f}{\partial x_d}\right]" />
      <NoteParagraph>
        For maximization, move with the gradient. For minimization, move against it:
      </NoteParagraph>
      <MathBlock math="x\leftarrow x-\eta \nabla f(x)" />
      <NoteParagraph>
        Here <InlineMath math="\eta" /> is a step size or learning rate.
      </NoteParagraph>

      <NoteSectionTitle id="adversarial-search">19. Adversarial Search</NoteSectionTitle>
      <NoteParagraph>
        Adversarial search studies decisions when another agent is also choosing actions. A game problem includes an initial state, players, legal actions, a transition function, a terminal test, and a utility function for terminal states.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Zero-Sum Setup">
          <NoteParagraph className="mb-0">
            In a two-player zero-sum game, one player's gain is the other's loss. The game tree alternates between MAX nodes, where our agent chooses the best move, and MIN nodes, where the opponent chooses the worst move for us.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="minimax">20. Minimax</NoteSectionTitle>
      <NoteParagraph>
        Minimax expands the game tree, evaluates terminal states, and backs values up to the root. MAX nodes take the maximum child value. MIN nodes take the minimum child value.
      </NoteParagraph>
      <MathBlock math="\begin{aligned}V(s)&=U(s) && \text{if }s\text{ is terminal}\\V(s)&=\max_{c\in \operatorname{Children}(s)}V(c) && \text{if }s\text{ is a MAX node}\\V(s)&=\min_{c\in \operatorname{Children}(s)}V(c) && \text{if }s\text{ is a MIN node}\end{aligned}" />
      <NoteParagraph>
        Minimax assumes optimal play from both sides. The chosen action is the move whose backed-up value is best for MAX.
      </NoteParagraph>

      <NoteSectionTitle id="depth-limited-and-iterative-deepening-minimax">21. Depth-Limited and Iterative-Deepening Minimax</NoteSectionTitle>
      <NoteParagraph>
        Full minimax is often impossible because game trees grow exponentially with branching factor and depth. Depth-limited minimax stops after a fixed number of plies and uses a heuristic evaluation function at the cutoff.
      </NoteParagraph>
      <NoteParagraph>
        Iterative deepening searches depth <InlineMath math="1" />, then <InlineMath math="2" />, then <InlineMath math="3" />, and so on. With a time limit, the agent can return the best move from the deepest completed search.
      </NoteParagraph>

      <NoteSectionTitle id="alpha-beta-pruning">22. Alpha-Beta Pruning</NoteSectionTitle>
      <NoteParagraph>
        Alpha-beta pruning avoids branches that cannot change the final minimax decision. <InlineMath math="\alpha" /> is the best value MAX can already force. <InlineMath math="\beta" /> is the best value MIN can already force.
      </NoteParagraph>
      <MathBlock math="\text{prune when }\alpha\ge \beta" />
      <AlphaBetaTrace />

      <NoteSectionTitle id="move-ordering-and-killer-moves">23. Move Ordering and Killer Moves</NoteSectionTitle>
      <NoteParagraph>
        Alpha-beta pruning is most effective when strong moves are searched early. Good move ordering makes cutoffs happen closer to the top of the tree.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Killer Move Intuition">
          <NoteParagraph className="mb-0">
            A killer move is a move that caused a cutoff elsewhere at the same depth. Trying it early in similar positions can trigger more pruning.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="heuristic-evaluation-and-quiescence-search">24. Heuristic Evaluation and Quiescence Search</NoteSectionTitle>
      <NoteParagraph>
        A heuristic evaluation function estimates utility for nonterminal states at a depth cutoff. It should correlate with eventual win/loss quality while being fast enough to compute many times.
      </NoteParagraph>
      <NoteParagraph>
        Quiescence search extends search in unstable positions so the cutoff does not happen during a tactical swing. The goal is to evaluate calmer states where the heuristic is less misleading.
      </NoteParagraph>

      <NoteSectionTitle id="stochastic-adversarial-search">25. Stochastic Adversarial Search</NoteSectionTitle>
      <NoteParagraph>
        Some games include randomness. In stochastic adversarial search, the game tree contains player choice nodes and chance nodes. Chance nodes represent random outcomes such as dice rolls, card draws, or stochastic effects.
      </NoteParagraph>

      <NoteSectionTitle id="chance-nodes-and-expectiminimax">26. Chance Nodes and Expectiminimax</NoteSectionTitle>
      <NoteParagraph>
        Expectiminimax extends minimax by backing up expected values at chance nodes.
      </NoteParagraph>
      <MathBlock math="V(chance)=\sum_i P(outcome_i)V(child_i)" />
      <NoteParagraph>
        MAX still takes maximum child values and MIN still takes minimum child values. Chance nodes take probability-weighted averages.
      </NoteParagraph>

      <NoteSectionTitle id="move-order-uncertainty">27. Move Order Uncertainty</NoteSectionTitle>
      <NoteParagraph>
        If move order is uncertain, the agent must reason about distributions over possible turns or outcomes rather than a single deterministic alternating tree. This pushes the model toward expected utility and policies instead of fixed action sequences.
      </NoteParagraph>

      <NoteSectionTitle id="constraint-satisfaction-problems">28. Constraint Satisfaction Problems</NoteSectionTitle>
      <NoteParagraph>
        A constraint satisfaction problem asks for values for variables so that all constraints are satisfied. A CSP contains variables <InlineMath math="X_1,\ldots,X_n" />, domains <InlineMath math="D_1,\ldots,D_n" />, and constraints <InlineMath math="C" />.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="CSP Solution">
          <NoteParagraph className="mb-0">
            A solution is a complete assignment that gives every variable one value from its domain and violates no constraint.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="node-and-arc-consistency">29. Node and Arc Consistency</NoteSectionTitle>
      <NoteParagraph>
        Node consistency handles unary constraints by deleting values that are illegal for a single variable. Arc consistency handles binary constraints by deleting values that have no compatible value in a neighboring variable's domain.
      </NoteParagraph>
      <CSPPruningExplorer />

      <NoteSectionTitle id="ac-3">30. AC-3</NoteSectionTitle>
      <NoteParagraph>
        AC-3 enforces arc consistency by repeatedly revising arcs. If revising <InlineMath math="X_i\to X_j" /> deletes a value from <InlineMath math="D_i" />, then arcs pointing into <InlineMath math="X_i" /> may need to be checked again.
      </NoteParagraph>
      <AlgorithmBlock
        title="AC-3"
        steps={[
          <span>Initialize the queue with all directed arcs <InlineMath math="(X_i,X_j)" />.</span>,
          <span>Remove one arc <InlineMath math="(X_i,X_j)" /> from the queue.</span>,
          <span>Revise <InlineMath math="D_i" /> by deleting values that have no compatible value in <InlineMath math="D_j" />.</span>,
          <span>If <InlineMath math="D_i=\varnothing" />, report failure.</span>,
          <span>If <InlineMath math="D_i" /> changed, add arcs <InlineMath math="(X_k,X_i)" /> for neighboring variables <InlineMath math="X_k" />.</span>,
          'Repeat until the queue is empty.',
        ]}
      />

      <NoteSectionTitle id="backtracking-search">31. Backtracking Search</NoteSectionTitle>
      <NoteParagraph>
        Backtracking search builds an assignment one variable at a time. If a partial assignment cannot lead to a solution, the algorithm undoes choices and tries another branch.
      </NoteParagraph>
      <AlgorithmBlock
        title="Backtracking Search"
        steps={[
          'If the assignment is complete, return it.',
          'Choose an unassigned variable.',
          'Try domain values in the chosen order.',
          'When a value is consistent, extend the assignment and run inference.',
          'Recursively search from the extended assignment.',
          'If the recursive search fails, undo the value and try the next one.',
          'Return failure after every value has failed.',
        ]}
      />

      <NoteSectionTitle id="mrv-degree-heuristic-and-lcv">32. MRV, Degree Heuristic, and LCV</NoteSectionTitle>
      <NoteParagraph>
        CSP heuristics try to fail early and leave future choices open.
      </NoteParagraph>
      <NoteTable
        headers={['heuristic', 'idea']}
        rows={[
          ['MRV', 'Minimum remaining values: choose the variable with the fewest legal values left.'],
          ['degree heuristic', 'Tie-break by choosing the variable involved in the most constraints on unassigned variables.'],
          ['LCV', 'Least constraining value: try the value that rules out the fewest values for neighbors.'],
        ]}
      />

      <NoteSectionTitle id="forward-checking-and-mac">33. Forward Checking and MAC</NoteSectionTitle>
      <NoteParagraph>
        Forward checking deletes inconsistent values from neighboring unassigned variables after each assignment. Maintaining arc consistency, or MAC, runs stronger arc-consistency inference during search.
      </NoteParagraph>
      <NoteParagraph>
        Forward checking is cheaper but weaker. MAC costs more per step but can prune deeper failures earlier.
      </NoteParagraph>

      <NoteSectionTitle id="backjumping-and-conflict-sets">34. Backjumping and Conflict Sets</NoteSectionTitle>
      <NoteParagraph>
        Chronological backtracking undoes the most recent assignment. Backjumping can jump directly to the variable that caused the conflict. A conflict set records which earlier variables are responsible for the failure.
      </NoteParagraph>

      <NoteSectionTitle id="supervised-learning-overview">35. Supervised Learning Overview</NoteSectionTitle>
      <NoteParagraph>
        Supervised learning uses labeled examples to learn a function that generalizes. Each training example has features <InlineMath math="x_i" /> and a target <InlineMath math="y_i" />. The model predicts <InlineMath math="\hat{y}_i=f_\theta(x_i)" />.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Classification vs Regression">
          <BulletList className="mb-0">
            <li><strong>Classification:</strong> predict a discrete label, such as spam/not spam.</li>
            <li><strong>Regression:</strong> predict a numeric value, such as price or time.</li>
            <li><strong>Generalization:</strong> performance on unseen examples, not memorized training examples.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="train-validation-test-splits">36. Train/Validation/Test Splits</NoteSectionTitle>
      <NoteParagraph>
        Training data fits parameters. Validation data compares model choices and hyperparameters. Test data estimates final performance after choices are fixed.
      </NoteParagraph>
      <NoteTable
        headers={['split', 'use']}
        rows={[
          ['train', 'Update model parameters.'],
          ['validation', 'Choose model family, depth, regularization, thresholds, or hyperparameters.'],
          ['test', 'Estimate final generalization once model selection is done.'],
        ]}
      />

      <NoteSectionTitle id="decision-trees">37. Decision Trees</NoteSectionTitle>
      <NoteParagraph>
        A decision tree predicts by asking a sequence of feature questions. Internal nodes test features, branches represent outcomes, and leaves output predictions.
      </NoteParagraph>
      <NoteParagraph>
        Trees are interpretable, handle nonlinear decision boundaries, and naturally mix feature types. They can overfit if grown too deep, so pruning or validation-based stopping is important.
      </NoteParagraph>

      <NoteSectionTitle id="information-gain">38. Information Gain</NoteSectionTitle>
      <NoteParagraph>
        Information gain chooses a split by measuring how much uncertainty about the label decreases after splitting. Entropy measures class impurity.
      </NoteParagraph>
      <MathBlock math="H(Y)=-\sum_y P(y)\log_2 P(y)" />
      <MathBlock math="IG(Y,X)=H(Y)-H(Y\mid X)" />
      <NoteParagraph>
        A split is useful when child groups are more label-pure than the parent group.
      </NoteParagraph>

      <NoteSectionTitle id="naive-bayes">39. Naive Bayes</NoteSectionTitle>
      <NoteParagraph>
        Naive Bayes is a probabilistic classifier. It uses Bayes' rule and assumes features are conditionally independent given the class.
      </NoteParagraph>
      <MathBlock math="P(c\mid x_1,\ldots,x_d)\propto P(c)\prod_{j=1}^d P(x_j\mid c)" />
      <NoteParagraph>
        The independence assumption is often false, but the classifier can work well because it only needs the correct class to get the largest posterior score.
      </NoteParagraph>

      <NoteSectionTitle id="linear-regression">40. Linear Regression</NoteSectionTitle>
      <NoteParagraph>
        Linear regression predicts a numeric value using a weighted sum of features:
      </NoteParagraph>
      <MathBlock math="\hat{y}=w^Tx+b" />
      <NoteParagraph>
        The usual objective is squared error. Fitting means choosing weights that minimize prediction error on training data.
      </NoteParagraph>
      <MathBlock math="L(w,b)=\sum_i (y_i-\hat{y}_i)^2" />

      <NoteSectionTitle id="logistic-regression">41. Logistic Regression</NoteSectionTitle>
      <NoteParagraph>
        Logistic regression is a linear classifier that passes a linear score through the sigmoid function to produce a probability.
      </NoteParagraph>
      <MathBlock math="\sigma(z)=\frac{1}{1+e^{-z}}" />
      <MathBlock math="P(y=1\mid x)=\sigma(w^Tx+b)" />
      <NoteParagraph>
        The decision boundary is linear in feature space, but the output is a calibrated probability between <InlineMath math="0" /> and <InlineMath math="1" />.
      </NoteParagraph>

      <NoteSectionTitle id="neural-networks">42. Neural Networks</NoteSectionTitle>
      <NoteParagraph>
        A neural network composes layers of linear transformations and nonlinear activation functions. Each layer transforms representations so later layers can separate patterns that were not linearly separable in the original input.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Layer Template">
          <MathBlock math="h^{(k)}=\phi(W^{(k)}h^{(k-1)}+b^{(k)})" />
          <NoteParagraph className="mb-0">
            <InlineMath math="W^{(k)}" /> and <InlineMath math="b^{(k)}" /> are parameters. <InlineMath math="\phi" /> is an activation function such as ReLU, sigmoid, or tanh.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="backpropagation">43. Backpropagation</NoteSectionTitle>
      <NoteParagraph>
        Backpropagation computes gradients through a neural network efficiently using the chain rule. The forward pass computes predictions and loss. The backward pass propagates derivatives from the loss back through each layer.
      </NoteParagraph>
      <AlgorithmBlock
        title="Backpropagation"
        steps={[
          'Forward pass: compute activations and the loss.',
          'Backward pass: compute gradients by repeated chain-rule applications.',
          <span>Update parameters with a rule such as <InlineMath math="\theta\leftarrow\theta-\eta\nabla_\theta L" />.</span>,
        ]}
      />

      <NoteSectionTitle id="cnns-rnns-and-graph-neural-networks">44. CNNs, RNNs, and Graph Neural Networks</NoteSectionTitle>
      <NoteParagraph>
        Different architectures encode different assumptions about data.
      </NoteParagraph>
      <NoteTable
        headers={['architecture', 'useful when']}
        rows={[
          ['CNN', 'Local patterns repeat across space, as in images or grids.'],
          ['RNN', 'Order and history matter, as in sequences or text.'],
          ['GNN', 'Examples are nodes or edges in a graph, and neighbors influence one another.'],
        ]}
      />

      <NoteSectionTitle id="markov-decision-processes">45. Markov Decision Processes</NoteSectionTitle>
      <NoteParagraph>
        A Markov decision process is a model for sequential decisions in a fully observable stochastic environment. It contains states, actions, transition probabilities, rewards, and often a discount factor.
      </NoteParagraph>
      <NoteTable
        headers={['component', 'meaning']}
        rows={[
          [<InlineMath math="S" />, 'set of states'],
          [<InlineMath math="A(s)" />, 'actions available in state s'],
          [<InlineMath math="P(s'\mid s,a)" />, <span>probability of next state <InlineMath math="s'" /> after action <InlineMath math="a" /> in state <InlineMath math="s" /></span>],
          [<InlineMath math="R(s)" />, <span>immediate reward for state <InlineMath math="s" />, or sometimes <InlineMath math="R(s,a,s')" /> for a transition reward</span>],
          [<InlineMath math="\gamma" />, 'discount factor for future rewards'],
        ]}
      />

      <NoteSectionTitle id="policies-rewards-utilities-and-horizons">46. Policies, Rewards, Utilities, and Horizons</NoteSectionTitle>
      <NoteParagraph>
        A policy maps states to actions. Because MDP transitions are stochastic, a fixed action sequence is not enough; the agent needs a rule for whatever state it actually reaches.
      </NoteParagraph>
      <MathBlock math="\pi(s)=\text{action recommended in state }s" />
      <NoteParagraph>
        Finite-horizon problems have a fixed time limit and may use time-dependent policies. Infinite-horizon discounted problems usually use stationary policies, where the best action depends on the state rather than the time step.
      </NoteParagraph>

      <NoteSectionTitle id="bellman-equations">47. Bellman Equations</NoteSectionTitle>
      <NoteParagraph>
        Bellman equations express a recursive relationship: current value equals immediate reward plus discounted expected future value.
      </NoteParagraph>
      <MathBlock math="U(s)=R(s)+\gamma\max_a\sum_{s'}P(s'\mid s,a)U(s')" />
      <BellmanUpdateExplorer />

      <NoteSectionTitle id="value-iteration">48. Value Iteration</NoteSectionTitle>
      <NoteParagraph>
        Value iteration repeatedly applies Bellman updates until utilities stabilize. Terminal rewards propagate backward through the state space.
      </NoteParagraph>
      <MathBlock math="U_{k+1}(s)=R(s)+\gamma\max_a\sum_{s'}P(s'\mid s,a)U_k(s')" />
      <AlgorithmBlock
        title="Value Iteration"
        steps={[
          <span>Initialize <InlineMath math="U_0(s)" /> for every state.</span>,
          <span>Apply the Bellman update to produce <InlineMath math="U_{k+1}" /> from <InlineMath math="U_k" />.</span>,
          'Repeat until the largest utility change is small.',
        ]}
      />
      <NoteParagraph>
        In discounted settings, the Bellman update is a contraction, so repeated updates converge to a unique fixed point.
      </NoteParagraph>

      <NoteSectionTitle id="policy-iteration">49. Policy Iteration</NoteSectionTitle>
      <NoteParagraph>
        Policy iteration alternates between evaluating the current policy and improving it.
      </NoteParagraph>
      <AlgorithmBlock
        title="Policy Iteration"
        steps={[
          <span>Start with a policy <InlineMath math="\pi" />.</span>,
          <span>Policy evaluation: compute <InlineMath math="U_\pi" /> for the current policy.</span>,
          <span>Policy improvement: set <InlineMath math="\pi(s)=\arg\max_a \sum_{s'}P(s'\mid s,a)U_\pi(s')" />.</span>,
          'Stop when the policy no longer changes.',
        ]}
      />
      <NoteParagraph>
        Policy iteration often converges in fewer high-level iterations than value iteration, but policy evaluation can be expensive.
      </NoteParagraph>

      <NoteSectionTitle id="passive-reinforcement-learning">50. Passive Reinforcement Learning</NoteSectionTitle>
      <NoteParagraph>
        Passive reinforcement learning assumes the agent follows a fixed policy and learns the utility of states under that policy. The agent observes trials and estimates values from experience.
      </NoteParagraph>

      <NoteSectionTitle id="direct-utility-estimation">51. Direct Utility Estimation</NoteSectionTitle>
      <NoteParagraph>
        Direct utility estimation treats the value of a state as the average reward-to-go observed after visiting that state. It is simple but slow because it waits for full trajectories and ignores Bellman dependencies between states.
      </NoteParagraph>

      <NoteSectionTitle id="adaptive-dynamic-programming">52. Adaptive Dynamic Programming</NoteSectionTitle>
      <NoteParagraph>
        Adaptive Dynamic Programming learns the transition model from observed triples <InlineMath math="(s,a,s')" />, estimates <InlineMath math="P(s'\mid s,a)" />, then solves the learned MDP using dynamic programming.
      </NoteParagraph>
      <NoteParagraph>
        This is model-based RL: learn the model first, then plan with it. It can be costly for large state spaces.
      </NoteParagraph>

      <NoteSectionTitle id="temporal-difference-learning">53. Temporal-Difference Learning</NoteSectionTitle>
      <NoteParagraph>
        Temporal-difference learning updates from one-step experience instead of waiting for the full trial. It compares the current estimate with a reward-plus-next-state target.
      </NoteParagraph>
      <MathBlock math="U(s)\leftarrow U(s)+\alpha[R(s)+\gamma U(s')-U(s)]" />
      <NoteParagraph>
        The bracketed quantity is the TD error. It measures surprise relative to the current value estimate.
      </NoteParagraph>

      <NoteSectionTitle id="active-reinforcement-learning">54. Active Reinforcement Learning</NoteSectionTitle>
      <NoteParagraph>
        Active RL lets the agent choose actions while learning. The agent must balance exploitation, which uses the current best policy, with exploration, which gathers information that may improve future decisions.
      </NoteParagraph>

      <NoteSectionTitle id="exploration-vs-exploitation">55. Exploration vs Exploitation</NoteSectionTitle>
      <NoteParagraph>
        Exploitation chooses what currently looks best. Exploration tries less-known actions to improve knowledge. A good agent explores enough to discover better actions, then becomes increasingly greedy as evidence accumulates.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="GLIE">
          <NoteParagraph className="mb-0">
            Greedy in the Limit of Infinite Exploration means every state-action pair is explored unboundedly often, while the policy eventually becomes greedy.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="q-learning-and-sarsa">56. Q-Learning and SARSA</NoteSectionTitle>
      <NoteParagraph>
        A Q-function estimates the value of taking action <InlineMath math="a" /> in state <InlineMath math="s" />. Once <InlineMath math="Q(s,a)" /> is known, the policy can choose <InlineMath math="\arg\max_a Q(s,a)" />.
      </NoteParagraph>
      <NoteParagraph className="mb-2">
        <strong>Q-learning:</strong> off-policy update toward the greedy next action.
      </NoteParagraph>
      <MathBlock math="Q(s,a)\leftarrow Q(s,a)+\alpha[r+\gamma\max_{a'}Q(s',a')-Q(s,a)]" />
      <NoteParagraph className="mb-2">
        <strong>SARSA:</strong> on-policy update toward the action actually taken next.
      </NoteParagraph>
      <MathBlock math="Q(s,a)\leftarrow Q(s,a)+\alpha[r+\gamma Q(s',a')-Q(s,a)]" />
      <QUpdateExplorer />

      <NoteSectionTitle id="function-approximation">57. Function Approximation</NoteSectionTitle>
      <NoteParagraph>
        Tables such as <InlineMath math="U(s)" /> and <InlineMath math="Q(s,a)" /> do not scale to huge or continuous spaces. Function approximation represents values with parameters:
      </NoteParagraph>
      <MathBlock math="Q(s,a)\approx Q_\theta(s,a)" />
      <NoteParagraph>
        Approximation saves memory and generalizes across similar states, but it can introduce bias and training instability.
      </NoteParagraph>

      <NoteSectionTitle id="policy-search-and-softmax-policies">58. Policy Search and Softmax Policies</NoteSectionTitle>
      <NoteParagraph>
        Policy search directly optimizes a parameterized policy rather than trying to estimate the optimal Q-function first. Softmax policies turn action scores into differentiable probabilities:
      </NoteParagraph>
      <MathBlock math="\pi(a\mid s)=\frac{e^{\operatorname{score}(s,a)}}{\sum_b e^{\operatorname{score}(s,b)}}" />
      <NoteParagraph>
        Softmax is useful because small parameter changes lead to smooth probability changes, which makes gradient-based optimization possible.
      </NoteParagraph>

      <NoteSectionTitle id="reinforce">59. REINFORCE</NoteSectionTitle>
      <NoteParagraph>
        REINFORCE is a Monte Carlo policy-gradient method. It samples trajectories, computes reward-to-go, and increases the probability of actions that led to high returns.
      </NoteParagraph>
      <AlgorithmBlock
        title="REINFORCE"
        steps={[
          'Sample a trajectory using the current policy.',
          'Compute reward-to-go for each time step.',
          'Increase the log-probability of actions with high reward-to-go.',
          'Repeat with new trajectories.',
        ]}
      />

      <NoteSectionTitle id="actor-critic-a2c-and-a3c">60. Actor-Critic, A2C, and A3C</NoteSectionTitle>
      <NoteParagraph>
        Actor-critic methods combine policy optimization with value learning. The actor approximates the policy. The critic approximates a value function and tells the actor whether actions were better or worse than expected.
      </NoteParagraph>
      <MathBlock math="Advantage(s,a)=Q(s,a)-V(s)" />
      <NoteParagraph>
        A2C means Advantage Actor-Critic. A3C is an asynchronous version that gathers experience from many parallel workers before updating shared parameters.
      </NoteParagraph>

      <NoteSectionTitle id="neural-network-q-functions">61. Neural-Network Q-Functions</NoteSectionTitle>
      <NoteParagraph>
        A neural network can approximate <InlineMath math="Q(s,a)" /> for large spaces. Because a network shares parameters across many state-action pairs, changing one estimate can affect others.
      </NoteParagraph>
      <MathBlock math="\operatorname{target}=r+\gamma\max_{a'}Q_\theta(s',a')" />
      <MathBlock math="\operatorname{loss}=(\operatorname{target}-Q_\theta(s,a))^2" />
      <NoteParagraph>
        Training uses gradient descent on this TD-style loss. Practical deep RL often needs stabilizers such as replay buffers, target networks, and careful exploration schedules.
      </NoteParagraph>

    </NotesLayout>
  );
}
