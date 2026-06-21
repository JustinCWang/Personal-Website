import { useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { CodeBlock, InteractiveBlock } from '../../../components/notes';
import { getRunnerPlayLabel, toggleOrReplayRunner, useAutoRunner } from '../../../components/notes/useAutoRunner';
import { useDarkMode } from '../../../hooks/useDarkMode';

type Metric = {
  label: string;
  value: ReactNode;
};

type ToolRunnerFrameProps = {
  title: string;
  stepIndex: number;
  maxStep: number;
  playing: boolean;
  setPlaying: Dispatch<SetStateAction<boolean>>;
  setStepIndex: Dispatch<SetStateAction<number>>;
  atEnd: boolean;
  metrics: Metric[];
  children: ReactNode;
  code: string;
  codeLanguage: string;
  delay?: number;
  status?: ReactNode;
  stepLabel?: string;
};

function useToolRunnerTheme() {
  const { isDarkMode } = useDarkMode();
  const subtlePanelClass = isDarkMode
    ? 'bg-green-500/5 border-green-500/20 text-green-100'
    : 'bg-slate-50 border-slate-200 text-slate-700';
  const buttonClass = isDarkMode
    ? 'rounded-md border border-green-500/30 bg-black/30 px-3 py-2 text-sm font-bold text-green-200 transition-colors hover:bg-green-500/10 disabled:cursor-not-allowed disabled:opacity-40'
    : 'rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40';
  const primaryColor = isDarkMode ? '#4ade80' : '#2563eb';
  const secondaryColor = isDarkMode ? '#fb923c' : '#ea580c';
  const accentColor = isDarkMode ? '#38bdf8' : '#0891b2';
  const mutedColor = isDarkMode ? '#86efac66' : '#94a3b8';
  const textColor = isDarkMode ? '#bbf7d0' : '#334155';
  const panelFill = isDarkMode ? '#052e16' : '#f8fafc';
  const inverseText = isDarkMode ? '#03140a' : '#ffffff';

  return { isDarkMode, subtlePanelClass, buttonClass, primaryColor, secondaryColor, accentColor, mutedColor, textColor, panelFill, inverseText };
}

function ToolMetricTile({ label, value }: Metric) {
  const { isDarkMode } = useToolRunnerTheme();

  return (
    <div className={`min-w-0 rounded-md border p-3 ${isDarkMode ? 'border-green-500/20 bg-black/20' : 'border-slate-200 bg-white/75'}`}>
      <div className="text-[0.68rem] font-bold uppercase tracking-wide opacity-70">{label}</div>
      <div className="mt-1 break-words text-sm font-bold">{value}</div>
    </div>
  );
}

function ToolRunnerFrame({
  title,
  stepIndex,
  maxStep,
  playing,
  setPlaying,
  setStepIndex,
  atEnd,
  metrics,
  children,
  code,
  codeLanguage,
  delay = 650,
  status,
  stepLabel = 'Step',
}: ToolRunnerFrameProps) {
  const { subtlePanelClass, buttonClass } = useToolRunnerTheme();
  const boundedStep = Math.min(stepIndex, maxStep);

  useAutoRunner({
    playing,
    canAdvance: !atEnd,
    delay,
    onAdvance: () => setStepIndex((step) => Math.min(maxStep, step + 1)),
    onStop: () => setPlaying(false),
  });

  return (
    <InteractiveBlock title={title}>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(250px,340px)_minmax(0,1fr)]">
        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <div className="mb-3 text-sm font-bold uppercase tracking-wide">
            Step {boundedStep + 1} / {maxStep + 1}
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={buttonClass} onClick={() => toggleOrReplayRunner(atEnd, setPlaying, () => setStepIndex(0))}>
              {getRunnerPlayLabel(playing, atEnd)}
            </button>
            <button type="button" className={buttonClass} onClick={() => { setPlaying(false); setStepIndex(0); }} disabled={boundedStep === 0}>
              Reset
            </button>
            <button type="button" className={buttonClass} onClick={() => { setPlaying(false); setStepIndex((step) => Math.max(0, step - 1)); }} disabled={boundedStep === 0}>
              Back
            </button>
            <button type="button" className={buttonClass} onClick={() => { setPlaying(false); setStepIndex((step) => Math.min(maxStep, step + 1)); }} disabled={atEnd}>
              {stepLabel}
            </button>
          </div>
          {status && <p className="mt-4 text-sm leading-relaxed">{status}</p>}
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {metrics.map((metric) => (
              <ToolMetricTile key={metric.label} {...metric} />
            ))}
          </div>
        </div>
        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          {children}
        </div>
      </div>
      <CodeBlock language={codeLanguage} code={code} />
    </InteractiveBlock>
  );
}

const treeTraversalCode = `
public static void inorder(Node node) {
    if (node == null) return;
    inorder(node.left);
    visit(node);
    inorder(node.right);
}
`;

const traversalOrder = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const traversalNodes = [
  { label: 'F', x: 250, y: 38 },
  { label: 'B', x: 150, y: 98 },
  { label: 'G', x: 350, y: 98 },
  { label: 'A', x: 92, y: 164 },
  { label: 'D', x: 205, y: 164 },
  { label: 'C', x: 170, y: 224 },
  { label: 'E', x: 240, y: 224 },
];
const traversalEdges = [
  ['F', 'B'],
  ['F', 'G'],
  ['B', 'A'],
  ['B', 'D'],
  ['D', 'C'],
  ['D', 'E'],
];
const traversalByLabel = Object.fromEntries(traversalNodes.map((node) => [node.label, node]));

export function TreeTraversalRunner() {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const { primaryColor, secondaryColor, mutedColor, textColor, panelFill, inverseText } = useToolRunnerTheme();
  const maxStep = traversalOrder.length - 1;
  const boundedStep = Math.min(stepIndex, maxStep);
  const active = traversalOrder[boundedStep];
  const visited = new Set(traversalOrder.slice(0, boundedStep + 1));

  return (
    <ToolRunnerFrame
      title="Inorder Tree Traversal Runner"
      stepIndex={boundedStep}
      maxStep={maxStep}
      playing={playing}
      setPlaying={setPlaying}
      setStepIndex={setStepIndex}
      atEnd={boundedStep === maxStep}
      delay={650}
      code={treeTraversalCode}
      codeLanguage="java"
      metrics={[
        { label: 'active visit', value: active },
        { label: 'visited count', value: visited.size },
        { label: 'order prefix', value: traversalOrder.slice(0, boundedStep + 1).join(' -> ') },
      ]}
      status="Inorder traversal recursively visits the left subtree, the node, then the right subtree."
      stepLabel="Visit"
    >
      <svg viewBox="0 0 480 270" className="h-80 w-full" role="img" aria-label="Inorder binary tree traversal">
        {traversalEdges.map(([fromLabel, toLabel]) => {
          const from = traversalByLabel[fromLabel];
          const to = traversalByLabel[toLabel];
          return <line key={`${fromLabel}-${toLabel}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={mutedColor} strokeWidth="2" />;
        })}
        {traversalNodes.map((node) => {
          const isActive = node.label === active;
          const isVisited = visited.has(node.label);
          const fill = isActive ? secondaryColor : isVisited ? primaryColor : panelFill;
          return (
            <g key={node.label}>
              <circle cx={node.x} cy={node.y} r="24" fill={fill} stroke={isVisited || isActive ? fill : mutedColor} strokeWidth="2.5" />
              <text x={node.x} y={node.y + 5} textAnchor="middle" fontFamily="monospace" fontSize="15" fontWeight="700" fill={isVisited || isActive ? inverseText : textColor}>{node.label}</text>
            </g>
          );
        })}
      </svg>
    </ToolRunnerFrame>
  );
}

const hashTableCode = `
public void put(String key, int value) {
    int bucket = Math.floorMod(key.hashCode(), table.length);
    for (Entry e = table[bucket]; e != null; e = e.next) {
        if (e.key.equals(key)) {
            e.value = value;
            return;
        }
    }
    table[bucket] = new Entry(key, value, table[bucket]);
}
`;

const hashInsertions = [
  { key: 'Ada', bucket: 1 },
  { key: 'Bob', bucket: 2 },
  { key: 'Eve', bucket: 1 },
  { key: 'Max', bucket: 3 },
  { key: 'Mia', bucket: 2 },
  { key: 'Ken', bucket: 4 },
  { key: 'Zoe', bucket: 1 },
];

function buildHashTableTrace() {
  const buckets: Record<number, string[]> = { 0: [], 1: [], 2: [], 3: [], 4: [] };
  return hashInsertions.map((item) => {
    buckets[item.bucket] = [item.key, ...buckets[item.bucket]];
    return {
      active: item,
      buckets: Object.fromEntries(Object.entries(buckets).map(([bucket, entries]) => [Number(bucket), [...entries]])) as Record<number, string[]>,
    };
  });
}

export function HashTableChainingRunner() {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const { primaryColor, secondaryColor, mutedColor } = useToolRunnerTheme();
  const trace = useMemo(buildHashTableTrace, []);
  const maxStep = trace.length - 1;
  const boundedStep = Math.min(stepIndex, maxStep);
  const current = trace[boundedStep];
  const load = (boundedStep + 1) / 5;

  return (
    <ToolRunnerFrame
      title="Hash Table Chaining Runner"
      stepIndex={boundedStep}
      maxStep={maxStep}
      playing={playing}
      setPlaying={setPlaying}
      setStepIndex={setStepIndex}
      atEnd={boundedStep === maxStep}
      delay={620}
      code={hashTableCode}
      codeLanguage="java"
      metrics={[
        { label: 'insert key', value: current.active.key },
        { label: 'bucket', value: current.active.bucket },
        { label: 'load factor', value: load.toFixed(2) },
      ]}
      status="Separate chaining handles collisions by keeping a small linked list at each bucket."
    >
      <div className="grid gap-3 sm:grid-cols-5">
        {[0, 1, 2, 3, 4].map((bucket) => (
          <div key={bucket} className="min-h-40 rounded-lg border p-3" style={{ borderColor: bucket === current.active.bucket ? secondaryColor : mutedColor }}>
            <div className="mb-2 text-center text-xs font-bold uppercase">bucket {bucket}</div>
            <div className="space-y-2">
              {current.buckets[bucket].map((key) => (
                <div key={key} className="rounded border px-2 py-1 text-center text-sm font-bold" style={{ borderColor: key === current.active.key ? secondaryColor : primaryColor, backgroundColor: `${primaryColor}1F` }}>
                  {key}
                </div>
              ))}
              {current.buckets[bucket].length === 0 && <div className="text-center text-sm opacity-60">empty</div>}
            </div>
          </div>
        ))}
      </div>
    </ToolRunnerFrame>
  );
}

const sqlPipelineCode = `
SELECT customer_id, SUM(total) AS revenue
FROM orders
WHERE status = 'paid'
GROUP BY customer_id
HAVING SUM(total) >= 500
ORDER BY revenue DESC;
`;

const sqlPipelineSteps = [
  { stage: 'FROM', rows: '8 order rows', note: 'Load the source table before any filter or grouping is applied.' },
  { stage: 'WHERE', rows: '5 paid rows', note: 'Remove unpaid rows before aggregates exist.' },
  { stage: 'GROUP BY', rows: '3 customer groups', note: 'Partition the remaining rows by customer_id.' },
  { stage: 'HAVING', rows: '2 groups', note: 'Filter groups using the aggregate revenue.' },
  { stage: 'SELECT', rows: '2 output rows', note: 'Compute the requested columns and aliases.' },
  { stage: 'ORDER BY', rows: '2 sorted rows', note: 'Sort the final output by the alias revenue.' },
];

export function SqlLogicalQueryRunner() {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const { primaryColor, secondaryColor, mutedColor } = useToolRunnerTheme();
  const maxStep = sqlPipelineSteps.length - 1;
  const boundedStep = Math.min(stepIndex, maxStep);
  const current = sqlPipelineSteps[boundedStep];

  return (
    <ToolRunnerFrame
      title="SQL Logical Query Pipeline Runner"
      stepIndex={boundedStep}
      maxStep={maxStep}
      playing={playing}
      setPlaying={setPlaying}
      setStepIndex={setStepIndex}
      atEnd={boundedStep === maxStep}
      delay={720}
      code={sqlPipelineCode}
      codeLanguage="sql"
      metrics={[
        { label: 'stage', value: current.stage },
        { label: 'working rows', value: current.rows },
        { label: 'written first?', value: current.stage === 'SELECT' ? 'yes, but evaluated late' : 'no' },
      ]}
      status={current.note}
    >
      <div className="grid gap-3 md:grid-cols-6">
        {sqlPipelineSteps.map((step, index) => (
          <div
            key={step.stage}
            className="rounded-lg border p-3 text-center"
            style={{
              borderColor: index === boundedStep ? secondaryColor : mutedColor,
              backgroundColor: index <= boundedStep ? `${primaryColor}20` : 'transparent',
            }}
          >
            <div className="text-xs font-bold uppercase opacity-70">{index + 1}</div>
            <div className="mt-1 font-mono text-sm font-bold">{step.stage}</div>
            <div className="mt-2 text-xs opacity-80">{index <= boundedStep ? step.rows : 'pending'}</div>
          </div>
        ))}
      </div>
    </ToolRunnerFrame>
  );
}
