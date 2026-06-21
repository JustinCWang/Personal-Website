import { useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { CodeBlock, InteractiveBlock } from '../../../components/notes';
import { getRunnerPlayLabel, toggleOrReplayRunner, useAutoRunner } from '../../../components/notes/useAutoRunner';
import { useDarkMode } from '../../../hooks/useDarkMode';

type Metric = {
  label: string;
  value: ReactNode;
};

type RunnerFrameProps = {
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
  codeLanguage?: string;
  delay?: number;
  status?: ReactNode;
  stepLabel?: string;
};

function formatNumber(value: number, digits = 2) {
  const rounded = Number(value.toFixed(digits));
  return Number.isInteger(rounded) ? String(rounded) : String(rounded).replace(/0+$/, '').replace(/\.$/, '');
}

function useCsRunnerTheme() {
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
  const warningColor = isDarkMode ? '#facc15' : '#ca8a04';
  const mutedColor = isDarkMode ? '#86efac66' : '#94a3b8';
  const textColor = isDarkMode ? '#bbf7d0' : '#334155';
  const panelFill = isDarkMode ? '#052e16' : '#f8fafc';
  const inverseText = isDarkMode ? '#03140a' : '#ffffff';

  return {
    isDarkMode,
    subtlePanelClass,
    buttonClass,
    primaryColor,
    secondaryColor,
    accentColor,
    warningColor,
    mutedColor,
    textColor,
    panelFill,
    inverseText,
  };
}

function MetricTile({ label, value }: Metric) {
  const { isDarkMode } = useCsRunnerTheme();

  return (
    <div className={`min-w-0 rounded-md border p-3 ${isDarkMode ? 'border-green-500/20 bg-black/20' : 'border-slate-200 bg-white/75'}`}>
      <div className="text-[0.68rem] font-bold uppercase tracking-wide opacity-70">{label}</div>
      <div className="mt-1 break-words text-sm font-bold">{value}</div>
    </div>
  );
}

function RunnerFrame({
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
  codeLanguage = 'python',
  delay = 700,
  status,
  stepLabel = 'Step',
}: RunnerFrameProps) {
  const { subtlePanelClass, buttonClass } = useCsRunnerTheme();
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
              <MetricTile key={metric.label} {...metric} />
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

const linearSearchCode = `
def linear_search(values, target):
    for i, value in enumerate(values):
        if value == target:
            return i
    return -1
`;

export function LinearSearchRunner() {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const { primaryColor, secondaryColor, mutedColor } = useCsRunnerTheme();
  const values = [12, 4, 19, 7, 23, 5, 16];
  const target = 16;
  const maxStep = values.length - 1;
  const boundedStep = Math.min(stepIndex, maxStep);
  const found = values[boundedStep] === target;

  return (
    <RunnerFrame
      title="Linear Search Runner"
      stepIndex={boundedStep}
      maxStep={maxStep}
      playing={playing}
      setPlaying={setPlaying}
      setStepIndex={setStepIndex}
      atEnd={boundedStep === maxStep}
      delay={580}
      code={linearSearchCode}
      metrics={[
        { label: 'target', value: target },
        { label: 'index checked', value: boundedStep },
        { label: 'comparison', value: `${values[boundedStep]} == ${target}` },
      ]}
      status={found ? `The target is found at index ${boundedStep}.` : 'The active value is not the target, so the loop advances.'}
      stepLabel="Compare"
    >
      <div className="grid grid-cols-[repeat(7,minmax(2.4rem,1fr))] gap-2 overflow-x-auto pb-2">
        {values.map((value, index) => (
          <div
            key={value}
            className="min-w-10 rounded-lg border p-3 text-center font-mono text-sm font-bold"
            style={{
              borderColor: index === boundedStep ? secondaryColor : mutedColor,
              backgroundColor: index < boundedStep ? `${primaryColor}24` : index === boundedStep ? `${secondaryColor}24` : 'transparent',
            }}
          >
            <div className="text-[0.65rem] uppercase opacity-70">{index}</div>
            {value}
          </div>
        ))}
      </div>
    </RunnerFrame>
  );
}

type SortingAlgorithm = 'selection' | 'insertion' | 'merge' | 'heap';

type SortingStep = {
  values: number[];
  note: string;
  pass: string;
  focus: number[];
  sorted: number[];
  range?: [number, number];
  aux?: Array<number | null>;
};

const sortingExample = [8, 3, 5, 4, 7, 6, 1, 2];

const sortingCodeByAlgorithm: Record<SortingAlgorithm, string> = {
  selection: `
def selection_sort(a):
    for i in range(len(a) - 1):
        min_i = i
        for j in range(i + 1, len(a)):
            if a[j] < a[min_i]:
                min_i = j
        a[i], a[min_i] = a[min_i], a[i]
`,
  insertion: `
def insertion_sort(a):
    for i in range(1, len(a)):
        key = a[i]
        j = i - 1
        while j >= 0 and a[j] > key:
            a[j + 1] = a[j]
            j -= 1
        a[j + 1] = key
`,
  merge: `
def merge_sort(a):
    aux = [None] * len(a)
    width = 1
    while width < len(a):
        for lo in range(0, len(a), 2 * width):
            mid = min(lo + width, len(a))
            hi = min(lo + 2 * width, len(a))
            merge(a, aux, lo, mid, hi)
        width *= 2
`,
  heap: `
def heap_sort(a):
    for start in range((len(a) - 2) // 2, -1, -1):
        sift_down(a, start, len(a) - 1)

    for end in range(len(a) - 1, 0, -1):
        a[0], a[end] = a[end], a[0]
        sift_down(a, 0, end - 1)
`,
};

function indexRange(start: number, endExclusive: number) {
  return Array.from({ length: Math.max(0, endExclusive - start) }, (_, index) => start + index);
}

function allIndexes(values: number[]) {
  return indexRange(0, values.length);
}

function buildSelectionSortTrace(): SortingStep[] {
  const values = [...sortingExample];
  const trace: SortingStep[] = [{
    values: [...values],
    note: `Run selection sort on [${sortingExample.join(', ')}].`,
    pass: 'setup',
    focus: [],
    sorted: [],
  }];

  for (let i = 0; i < values.length - 1; i += 1) {
    let min = i;
    trace.push({
      values: [...values],
      note: `Pass ${i + 1}: treat index ${i} as the smallest value seen in the unsorted suffix.`,
      pass: `pass ${i + 1}`,
      focus: [i],
      sorted: indexRange(0, i),
      range: [i, values.length - 1],
    });

    for (let j = i + 1; j < values.length; j += 1) {
      trace.push({
        values: [...values],
        note: `Compare a[${j}]=${values[j]} with the current minimum a[${min}]=${values[min]}.`,
        pass: `compare ${j}`,
        focus: [min, j],
        sorted: indexRange(0, i),
        range: [i, values.length - 1],
      });
      if (values[j] < values[min]) {
        min = j;
        trace.push({
          values: [...values],
          note: `${values[j]} is the new smallest value, so min moves to index ${j}.`,
          pass: `new min ${j}`,
          focus: [j],
          sorted: indexRange(0, i),
          range: [i, values.length - 1],
        });
      }
    }

    [values[i], values[min]] = [values[min], values[i]];
    trace.push({
      values: [...values],
      note: `Swap the smallest remaining value into final position ${i}.`,
      pass: `fix ${i}`,
      focus: [i, min],
      sorted: indexRange(0, i + 1),
      range: [i, values.length - 1],
    });
  }

  trace.push({ values: [...values], note: 'The whole array is sorted.', pass: 'done', focus: [], sorted: allIndexes(values) });
  return trace;
}

function buildInsertionSortTrace(): SortingStep[] {
  const values = [...sortingExample];
  const trace: SortingStep[] = [{
    values: [...values],
    note: `Run insertion sort on [${sortingExample.join(', ')}]. The sorted prefix starts with one item.`,
    pass: 'setup',
    focus: [0],
    sorted: [0],
  }];

  for (let i = 1; i < values.length; i += 1) {
    const key = values[i];
    let j = i - 1;
    trace.push({
      values: [...values],
      note: `Take key ${key} from index ${i} and scan left through the sorted prefix.`,
      pass: `insert ${i}`,
      focus: [i],
      sorted: indexRange(0, i),
      range: [0, i],
    });

    while (j >= 0 && values[j] > key) {
      values[j + 1] = values[j];
      trace.push({
        values: [...values],
        note: `Shift ${values[j]} right because it is greater than key ${key}.`,
        pass: `shift ${j}`,
        focus: [j, j + 1],
        sorted: indexRange(0, i + 1),
        range: [0, i],
      });
      j -= 1;
    }

    values[j + 1] = key;
    trace.push({
      values: [...values],
      note: `Place key ${key} at index ${j + 1}; the sorted prefix now has ${i + 1} values.`,
      pass: `place ${key}`,
      focus: [j + 1],
      sorted: indexRange(0, i + 1),
      range: [0, i],
    });
  }

  trace.push({ values: [...values], note: 'The sorted prefix has grown to cover the whole array.', pass: 'done', focus: [], sorted: allIndexes(values) });
  return trace;
}

function buildMergeSortTrace(): SortingStep[] {
  const values = [...sortingExample];
  const trace: SortingStep[] = [{
    values: [...values],
    note: `Run bottom-up merge sort on [${sortingExample.join(', ')}].`,
    pass: 'setup',
    focus: [],
    sorted: [],
    aux: Array.from({ length: values.length }, () => null),
  }];

  for (let width = 1; width < values.length; width *= 2) {
    for (let lo = 0; lo < values.length; lo += 2 * width) {
      const mid = Math.min(lo + width, values.length);
      const hi = Math.min(lo + 2 * width, values.length);
      if (mid >= hi) continue;

      let left = lo;
      let right = mid;
      let out = lo;
      const aux: Array<number | null> = Array.from({ length: values.length }, () => null);
      trace.push({
        values: [...values],
        note: `Merge sorted runs [${lo}, ${mid - 1}] and [${mid}, ${hi - 1}].`,
        pass: `width ${width}`,
        focus: [lo, mid],
        sorted: [],
        range: [lo, hi - 1],
        aux: [...aux],
      });

      while (left < mid && right < hi) {
        trace.push({
          values: [...values],
          note: `Compare left ${values[left]} and right ${values[right]}; write the smaller value next.`,
          pass: 'merge compare',
          focus: [left, right],
          sorted: [],
          range: [lo, hi - 1],
          aux: [...aux],
        });
        if (values[left] <= values[right]) {
          aux[out] = values[left];
          left += 1;
        } else {
          aux[out] = values[right];
          right += 1;
        }
        trace.push({
          values: [...values],
          note: `Write ${aux[out]} into auxiliary index ${out}.`,
          pass: `write ${out}`,
          focus: [out],
          sorted: [],
          range: [lo, hi - 1],
          aux: [...aux],
        });
        out += 1;
      }

      while (left < mid) {
        aux[out] = values[left];
        trace.push({
          values: [...values],
          note: `Copy remaining left value ${values[left]} into auxiliary index ${out}.`,
          pass: `copy left ${out}`,
          focus: [left, out],
          sorted: [],
          range: [lo, hi - 1],
          aux: [...aux],
        });
        left += 1;
        out += 1;
      }

      while (right < hi) {
        aux[out] = values[right];
        trace.push({
          values: [...values],
          note: `Copy remaining right value ${values[right]} into auxiliary index ${out}.`,
          pass: `copy right ${out}`,
          focus: [right, out],
          sorted: [],
          range: [lo, hi - 1],
          aux: [...aux],
        });
        right += 1;
        out += 1;
      }

      for (let k = lo; k < hi; k += 1) values[k] = aux[k] as number;
      trace.push({
        values: [...values],
        note: `Copy the merged run back into array positions ${lo} through ${hi - 1}.`,
        pass: 'copy back',
        focus: indexRange(lo, hi),
        sorted: hi - lo === values.length ? allIndexes(values) : [],
        range: [lo, hi - 1],
        aux: [...aux],
      });
    }
  }

  trace.push({ values: [...values], note: 'The final merge produced one sorted run.', pass: 'done', focus: [], sorted: allIndexes(values), aux: Array.from({ length: values.length }, () => null) });
  return trace;
}

function buildHeapSortTrace(): SortingStep[] {
  const values = [...sortingExample];
  const trace: SortingStep[] = [{
    values: [...values],
    note: `Run heapsort on [${sortingExample.join(', ')}]. First build a max heap.`,
    pass: 'setup',
    focus: [],
    sorted: [],
    range: [0, values.length - 1],
  }];

  const push = (note: string, pass: string, focus: number[], heapEnd: number) => {
    trace.push({
      values: [...values],
      note,
      pass,
      focus,
      sorted: indexRange(heapEnd + 1, values.length),
      range: heapEnd >= 0 ? [0, heapEnd] : undefined,
    });
  };

  const siftDown = (start: number, end: number, label: string) => {
    let root = start;
    while (root * 2 + 1 <= end) {
      let child = root * 2 + 1;
      const right = child + 1;
      if (right <= end) {
        push(`Compare children ${values[child]} and ${values[right]} and keep the larger child candidate.`, `${label}: child compare`, [child, right], end);
        if (values[right] > values[child]) child = right;
      }

      push(`Compare root ${values[root]} with child ${values[child]}.`, `${label}: root compare`, [root, child], end);
      if (values[root] < values[child]) {
        [values[root], values[child]] = [values[child], values[root]];
        push(`Swap ${values[child]} down and ${values[root]} up to restore heap order locally.`, `${label}: sift swap`, [root, child], end);
        root = child;
      } else {
        push(`Node at index ${root} is at least as large as its children, so this sift stops.`, `${label}: stop`, [root], end);
        return;
      }
    }
    push(`Index ${root} has no children in the current heap.`, `${label}: leaf`, [root], end);
  };

  for (let start = Math.floor((values.length - 2) / 2); start >= 0; start -= 1) {
    push(`Sift down index ${start} while building the max heap.`, `heapify ${start}`, [start], values.length - 1);
    siftDown(start, values.length - 1, `heapify ${start}`);
  }

  for (let end = values.length - 1; end > 0; end -= 1) {
    [values[0], values[end]] = [values[end], values[0]];
    push(`Move the current maximum ${values[end]} to sorted position ${end}.`, `extract ${end}`, [0, end], end - 1);
    siftDown(0, end - 1, `repair heap ${end}`);
  }

  trace.push({ values: [...values], note: 'The heap is empty and the sorted suffix is the whole array.', pass: 'done', focus: [], sorted: allIndexes(values) });
  return trace;
}

const sortingTraceBuilders: Record<SortingAlgorithm, () => SortingStep[]> = {
  selection: buildSelectionSortTrace,
  insertion: buildInsertionSortTrace,
  merge: buildMergeSortTrace,
  heap: buildHeapSortTrace,
};

const sortingLabels: Record<SortingAlgorithm, string> = {
  selection: 'Selection',
  insertion: 'Insertion',
  merge: 'Merge',
  heap: 'Heap',
};

export function SortingAlgorithmsRunner() {
  const [algorithm, setAlgorithm] = useState<SortingAlgorithm>('selection');
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const { isDarkMode, primaryColor, secondaryColor, accentColor, mutedColor } = useCsRunnerTheme();
  const trace = useMemo(() => sortingTraceBuilders[algorithm](), [algorithm]);
  const maxStep = trace.length - 1;
  const boundedStep = Math.min(stepIndex, maxStep);
  const current = trace[boundedStep];
  const maxValue = Math.max(...current.values);
  const focus = new Set(current.focus);
  const sorted = new Set(current.sorted);

  const chooseAlgorithm = (next: SortingAlgorithm) => {
    setPlaying(false);
    setStepIndex(0);
    setAlgorithm(next);
  };

  return (
    <RunnerFrame
      title="Sorting Algorithm Trace Runner"
      stepIndex={boundedStep}
      maxStep={maxStep}
      playing={playing}
      setPlaying={setPlaying}
      setStepIndex={setStepIndex}
      atEnd={boundedStep === maxStep}
      delay={algorithm === 'merge' || algorithm === 'heap' ? 360 : 430}
      code={sortingCodeByAlgorithm[algorithm]}
      metrics={[
        { label: 'algorithm', value: `${sortingLabels[algorithm]} sort` },
        { label: 'example list', value: `[${sortingExample.join(', ')}]` },
        { label: 'trace event', value: current.pass },
      ]}
      status={current.note}
      stepLabel="Next event"
    >
      <div className="space-y-5">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(sortingLabels) as SortingAlgorithm[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => chooseAlgorithm(option)}
              className={`rounded-md px-3 py-2 text-sm font-bold transition ${
                algorithm === option
                  ? isDarkMode
                    ? 'bg-green-400 text-black'
                    : 'bg-blue-600 text-white'
                  : isDarkMode
                    ? 'bg-slate-800 text-green-100'
                    : 'bg-slate-200 text-slate-700'
              }`}
            >
              {sortingLabels[option]}
            </button>
          ))}
        </div>

        <div className="grid min-h-56 grid-cols-8 items-end gap-1 pb-2 sm:gap-2">
          {current.values.map((value, index) => {
            const active = focus.has(index);
            const isSorted = sorted.has(index);
            const inRange = current.range ? index >= current.range[0] && index <= current.range[1] : false;
            const fill = active ? secondaryColor : isSorted ? primaryColor : inRange ? accentColor : mutedColor;
            return (
              <div key={`${value}-${index}`} className="flex min-w-0 flex-col items-center gap-2">
                <div
                  className="flex w-full max-w-11 items-end justify-center rounded-t-md border text-xs font-bold text-white"
                  style={{
                    height: `${42 + (value / maxValue) * 130}px`,
                    borderColor: active ? secondaryColor : mutedColor,
                    backgroundColor: fill,
                    opacity: active || isSorted || inRange ? 1 : 0.72,
                  }}
                >
                  {value}
                </div>
                <div className="font-mono text-xs opacity-70">{index}</div>
              </div>
            );
          })}
        </div>

        {current.aux && (
          <div>
            <div className="mb-2 text-xs font-bold uppercase opacity-70">merge auxiliary array</div>
            <div className="grid grid-cols-[repeat(8,minmax(1.8rem,1fr))] gap-1 overflow-x-auto pb-2 sm:gap-2">
              {current.aux.map((value, index) => (
                <div
                  key={index}
                  className="min-w-0 rounded-lg border px-2 py-3 text-center font-mono text-sm font-bold"
                  style={{
                    borderColor: focus.has(index) ? secondaryColor : mutedColor,
                    backgroundColor: value === null ? 'transparent' : `${primaryColor}24`,
                  }}
                >
                  <div className="text-[0.65rem] uppercase opacity-70">{index}</div>
                  {value ?? '-'}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </RunnerFrame>
  );
}

const dijkstraCode = `
def dijkstra(graph, source):
    dist = {v: float("inf") for v in graph}
    parent = {v: None for v in graph}
    dist[source] = 0
    settled = set()

    while len(settled) < len(graph):
        u = min((v for v in graph if v not in settled), key=dist.get)
        settled.add(u)
        for v, weight in graph[u]:
            if dist[u] + weight < dist[v]:
                dist[v] = dist[u] + weight
                parent[v] = u
    return dist, parent
`;

type DijkstraNode = 'S' | 'A' | 'B' | 'C' | 'D' | 'T';

const dijkstraNodes: DijkstraNode[] = ['S', 'A', 'B', 'C', 'D', 'T'];
const dijkstraPositions: Record<DijkstraNode, { x: number; y: number }> = {
  S: { x: 48, y: 132 },
  A: { x: 150, y: 58 },
  B: { x: 150, y: 202 },
  C: { x: 280, y: 72 },
  D: { x: 280, y: 192 },
  T: { x: 418, y: 132 },
};
const dijkstraEdges: Array<{ u: DijkstraNode; v: DijkstraNode; weight: number }> = [
  { u: 'S', v: 'A', weight: 4 },
  { u: 'S', v: 'B', weight: 1 },
  { u: 'B', v: 'A', weight: 2 },
  { u: 'A', v: 'C', weight: 1 },
  { u: 'B', v: 'D', weight: 5 },
  { u: 'C', v: 'D', weight: 2 },
  { u: 'C', v: 'T', weight: 6 },
  { u: 'D', v: 'T', weight: 1 },
];

type DijkstraStep = {
  current: DijkstraNode | null;
  settled: DijkstraNode[];
  distances: Record<DijkstraNode, number>;
  parent: Partial<Record<DijkstraNode, DijkstraNode>>;
  note: string;
};

function buildDijkstraTrace(): DijkstraStep[] {
  const adjacency: Record<DijkstraNode, Array<{ to: DijkstraNode; weight: number }>> = {
    S: [],
    A: [],
    B: [],
    C: [],
    D: [],
    T: [],
  };
  for (const edge of dijkstraEdges) adjacency[edge.u].push({ to: edge.v, weight: edge.weight });

  const distances = Object.fromEntries(dijkstraNodes.map((node) => [node, node === 'S' ? 0 : Infinity])) as Record<DijkstraNode, number>;
  const parent: Partial<Record<DijkstraNode, DijkstraNode>> = {};
  const settled: DijkstraNode[] = [];
  const trace: DijkstraStep[] = [{
    current: null,
    settled: [],
    distances: { ...distances },
    parent: {},
    note: 'Initialize the source at distance 0 and every other vertex at infinity.',
  }];

  while (settled.length < dijkstraNodes.length) {
    const current = dijkstraNodes
      .filter((node) => !settled.includes(node))
      .sort((left, right) => distances[left] - distances[right])[0];
    const updates: string[] = [];

    for (const edge of adjacency[current]) {
      const candidate = distances[current] + edge.weight;
      if (candidate < distances[edge.to]) {
        distances[edge.to] = candidate;
        parent[edge.to] = current;
        updates.push(`${edge.to} becomes ${candidate}`);
      }
    }

    settled.push(current);
    trace.push({
      current,
      settled: [...settled],
      distances: { ...distances },
      parent: { ...parent },
      note: updates.length > 0 ? `Settle ${current}; relax outgoing edges so ${updates.join(', ')}.` : `Settle ${current}; no distance improves.`,
    });
  }

  return trace;
}

export function DijkstraAlgorithmRunner() {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const { primaryColor, secondaryColor, accentColor, mutedColor, textColor, panelFill, inverseText } = useCsRunnerTheme();
  const trace = useMemo(buildDijkstraTrace, []);
  const maxStep = trace.length - 1;
  const boundedStep = Math.min(stepIndex, maxStep);
  const current = trace[boundedStep];
  const settled = new Set(current.settled);
  const settledEdges = new Set(
    dijkstraNodes
      .filter((node) => current.parent[node])
      .map((node) => `${current.parent[node]}-${node}`),
  );

  return (
    <RunnerFrame
      title="Dijkstra Shortest Path Runner"
      stepIndex={boundedStep}
      maxStep={maxStep}
      playing={playing}
      setPlaying={setPlaying}
      setStepIndex={setStepIndex}
      atEnd={boundedStep === maxStep}
      delay={850}
      code={dijkstraCode}
      metrics={[
        { label: 'settled', value: current.settled.length ? current.settled.join(' -> ') : 'none' },
        { label: 'current', value: current.current ?? 'not selected yet' },
        { label: 'target distance', value: Number.isFinite(current.distances.T) ? current.distances.T : 'inf' },
      ]}
      status={current.note}
    >
      <svg viewBox="0 0 470 270" className="h-80 w-full" role="img" aria-label="Dijkstra shortest path graph">
        <defs>
          <marker id="dijkstra-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill={mutedColor} />
          </marker>
        </defs>
        {dijkstraEdges.map((edge) => {
          const from = dijkstraPositions[edge.u];
          const to = dijkstraPositions[edge.v];
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2;
          const onPath = settledEdges.has(`${edge.u}-${edge.v}`);
          return (
            <g key={`${edge.u}-${edge.v}`}>
              <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={onPath ? accentColor : mutedColor} strokeWidth={onPath ? 4 : 2} markerEnd="url(#dijkstra-arrow)" />
              <rect x={midX - 11} y={midY - 13} width="22" height="20" rx="4" fill={panelFill} stroke={mutedColor} strokeOpacity="0.25" />
              <text x={midX} y={midY + 2} textAnchor="middle" fontFamily="monospace" fontSize="11" fill={textColor}>{edge.weight}</text>
            </g>
          );
        })}
        {dijkstraNodes.map((node) => {
          const position = dijkstraPositions[node];
          const isCurrent = current.current === node;
          const isSettled = settled.has(node);
          const distance = current.distances[node];
          return (
            <g key={node}>
              <circle
                cx={position.x}
                cy={position.y}
                r="27"
                fill={isCurrent ? secondaryColor : isSettled ? primaryColor : panelFill}
                stroke={isCurrent ? secondaryColor : isSettled ? primaryColor : mutedColor}
                strokeWidth="2.5"
              />
              <text x={position.x} y={position.y - 2} textAnchor="middle" fontFamily="monospace" fontSize="14" fontWeight="700" fill={isCurrent || isSettled ? inverseText : textColor}>{node}</text>
              <text x={position.x} y={position.y + 15} textAnchor="middle" fontFamily="monospace" fontSize="11" fill={isCurrent || isSettled ? inverseText : textColor}>
                d={Number.isFinite(distance) ? distance : 'inf'}
              </text>
            </g>
          );
        })}
      </svg>
    </RunnerFrame>
  );
}

const lcsCode = `
def lcs_length(x, y):
    dp = [[0] * (len(y) + 1) for _ in range(len(x) + 1)]
    for i in range(1, len(x) + 1):
        for j in range(1, len(y) + 1):
            if x[i - 1] == y[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[len(x)][len(y)]
`;

function buildLcsTable(source: string, target: string) {
  const table = Array.from({ length: source.length + 1 }, () => Array.from({ length: target.length + 1 }, () => 0));
  for (let row = 1; row <= source.length; row += 1) {
    for (let column = 1; column <= target.length; column += 1) {
      table[row][column] = source[row - 1] === target[column - 1]
        ? table[row - 1][column - 1] + 1
        : Math.max(table[row - 1][column], table[row][column - 1]);
    }
  }
  return table;
}

export function LcsDynamicProgrammingRunner() {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const { isDarkMode, primaryColor, secondaryColor } = useCsRunnerTheme();
  const source = 'ABCBDAB';
  const target = 'BDCABA';
  const table = useMemo(() => buildLcsTable(source, target), []);
  const columns = target.length + 1;
  const maxStep = table.length * columns - 1;
  const boundedStep = Math.min(stepIndex, maxStep);
  const activeRow = Math.floor(boundedStep / columns);
  const activeColumn = boundedStep % columns;
  const finalValue = table[source.length][target.length];
  const activeValue = table[activeRow][activeColumn];

  return (
    <RunnerFrame
      title="LCS Dynamic Programming Runner"
      stepIndex={boundedStep}
      maxStep={maxStep}
      playing={playing}
      setPlaying={setPlaying}
      setStepIndex={setStepIndex}
      atEnd={boundedStep === maxStep}
      delay={95}
      code={lcsCode}
      metrics={[
        { label: 'cell', value: `(${activeRow}, ${activeColumn})` },
        { label: 'active value', value: activeValue },
        { label: 'final LCS length', value: boundedStep === maxStep ? finalValue : 'not filled yet' },
      ]}
      status={`Fill cells left-to-right, top-to-bottom for X=${source} and Y=${target}.`}
      stepLabel="Fill cell"
    >
      <div className="overflow-x-auto">
        <table className="min-w-[470px] border-collapse text-center text-xs sm:text-sm">
          <tbody>
            <tr>
              <td className="h-9 w-10" />
              <td className="h-9 w-10 font-bold opacity-70">eps</td>
              {target.split('').map((char, index) => (
                <td key={`${char}-${index}`} className="h-9 w-10 font-bold">{char}</td>
              ))}
            </tr>
            {table.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="h-9 w-10 font-bold">{rowIndex === 0 ? 'eps' : source[rowIndex - 1]}</td>
                {row.map((cell, columnIndex) => {
                  const cellIndex = rowIndex * columns + columnIndex;
                  const filled = cellIndex <= boundedStep;
                  const active = rowIndex === activeRow && columnIndex === activeColumn;
                  return (
                    <td
                      key={`${rowIndex}-${columnIndex}`}
                      className={`h-9 w-10 border ${isDarkMode ? 'border-green-500/20' : 'border-slate-200'}`}
                      style={{
                        backgroundColor: active ? secondaryColor : filled ? `${primaryColor}2E` : 'transparent',
                        color: active ? '#ffffff' : undefined,
                      }}
                    >
                      {filled ? cell : ''}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </RunnerFrame>
  );
}

const aStarCode = `
def astar(graph, start, goal, heuristic):
    open_set = {start}
    came_from = {}
    g = {start: 0}

    while open_set:
        current = min(open_set, key=lambda n: g[n] + heuristic[n])
        if current == goal:
            return reconstruct_path(came_from, goal)
        open_set.remove(current)

        for neighbor, cost in graph[current]:
            candidate = g[current] + cost
            if candidate < g.get(neighbor, float("inf")):
                came_from[neighbor] = current
                g[neighbor] = candidate
                open_set.add(neighbor)
`;

type AStarNode = 'S' | 'A' | 'B' | 'C' | 'D' | 'G';
const aStarNodes: AStarNode[] = ['S', 'A', 'B', 'C', 'D', 'G'];
const aStarHeuristic: Record<AStarNode, number> = { S: 6, A: 5, B: 4, C: 2, D: 2, G: 0 };
const aStarPositions: Record<AStarNode, { x: number; y: number }> = {
  S: { x: 48, y: 132 },
  A: { x: 150, y: 58 },
  B: { x: 150, y: 202 },
  C: { x: 286, y: 70 },
  D: { x: 286, y: 194 },
  G: { x: 420, y: 132 },
};
const aStarEdges: Array<{ u: AStarNode; v: AStarNode; cost: number }> = [
  { u: 'S', v: 'A', cost: 2 },
  { u: 'S', v: 'B', cost: 1 },
  { u: 'A', v: 'C', cost: 4 },
  { u: 'B', v: 'C', cost: 2 },
  { u: 'B', v: 'D', cost: 4 },
  { u: 'C', v: 'G', cost: 3 },
  { u: 'D', v: 'G', cost: 2 },
];

type AStarStep = {
  current: AStarNode | null;
  open: AStarNode[];
  closed: AStarNode[];
  g: Partial<Record<AStarNode, number>>;
  cameFrom: Partial<Record<AStarNode, AStarNode>>;
  note: string;
};

function buildAStarTrace(): AStarStep[] {
  const adjacency: Record<AStarNode, Array<{ to: AStarNode; cost: number }>> = {
    S: [],
    A: [],
    B: [],
    C: [],
    D: [],
    G: [],
  };
  for (const edge of aStarEdges) {
    adjacency[edge.u].push({ to: edge.v, cost: edge.cost });
  }

  const open: AStarNode[] = ['S'];
  const closed: AStarNode[] = [];
  const g: Partial<Record<AStarNode, number>> = { S: 0 };
  const cameFrom: Partial<Record<AStarNode, AStarNode>> = {};
  const trace: AStarStep[] = [{ current: null, open: [...open], closed: [], g: { ...g }, cameFrom: {}, note: 'Start with only S in the frontier.' }];

  while (open.length > 0) {
    const current = [...open].sort((left, right) => ((g[left] ?? Infinity) + aStarHeuristic[left]) - ((g[right] ?? Infinity) + aStarHeuristic[right]))[0];
    open.splice(open.indexOf(current), 1);
    closed.push(current);

    if (current === 'G') {
      trace.push({ current, open: [...open], closed: [...closed], g: { ...g }, cameFrom: { ...cameFrom }, note: 'The goal has the smallest f score, so the optimal path is found.' });
      break;
    }

    const updates: string[] = [];
    for (const edge of adjacency[current]) {
      if (closed.includes(edge.to)) continue;
      const candidate = (g[current] ?? Infinity) + edge.cost;
      if (candidate < (g[edge.to] ?? Infinity)) {
        g[edge.to] = candidate;
        cameFrom[edge.to] = current;
        if (!open.includes(edge.to)) open.push(edge.to);
        updates.push(`${edge.to}: g=${candidate}, f=${candidate + aStarHeuristic[edge.to]}`);
      }
    }

    trace.push({
      current,
      open: [...open],
      closed: [...closed],
      g: { ...g },
      cameFrom: { ...cameFrom },
      note: updates.length > 0 ? `Expand ${current}; update ${updates.join('; ')}.` : `Expand ${current}; no frontier score improves.`,
    });
  }

  return trace;
}

export function AStarSearchRunner() {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const { primaryColor, secondaryColor, accentColor, mutedColor, textColor, panelFill, inverseText } = useCsRunnerTheme();
  const trace = useMemo(buildAStarTrace, []);
  const maxStep = trace.length - 1;
  const boundedStep = Math.min(stepIndex, maxStep);
  const current = trace[boundedStep];
  const open = new Set(current.open);
  const closed = new Set(current.closed);

  return (
    <RunnerFrame
      title="A* Search Runner"
      stepIndex={boundedStep}
      maxStep={maxStep}
      playing={playing}
      setPlaying={setPlaying}
      setStepIndex={setStepIndex}
      atEnd={boundedStep === maxStep}
      delay={900}
      code={aStarCode}
      metrics={[
        { label: 'open frontier', value: current.open.length ? current.open.join(', ') : 'empty' },
        { label: 'closed', value: current.closed.length ? current.closed.join(', ') : 'none' },
        { label: 'best goal cost', value: current.g.G ?? 'unknown' },
      ]}
      status={current.note}
    >
      <svg viewBox="0 0 470 270" className="h-80 w-full" role="img" aria-label="A star search frontier and closed set">
        {aStarEdges.map((edge) => {
          const from = aStarPositions[edge.u];
          const to = aStarPositions[edge.v];
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2;
          return (
            <g key={`${edge.u}-${edge.v}`}>
              <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={mutedColor} strokeWidth="2" />
              <rect x={midX - 11} y={midY - 12} width="22" height="18" rx="4" fill={panelFill} />
              <text x={midX} y={midY + 2} textAnchor="middle" fontFamily="monospace" fontSize="11" fill={textColor}>{edge.cost}</text>
            </g>
          );
        })}
        {aStarNodes.map((node) => {
          const position = aStarPositions[node];
          const isCurrent = current.current === node;
          const isOpen = open.has(node);
          const isClosed = closed.has(node);
          const gValue = current.g[node];
          const fValue = gValue === undefined ? 'inf' : gValue + aStarHeuristic[node];
          const fill = isCurrent ? secondaryColor : isClosed ? primaryColor : isOpen ? accentColor : panelFill;
          return (
            <g key={node}>
              <circle cx={position.x} cy={position.y} r="29" fill={fill} stroke={isOpen || isClosed || isCurrent ? fill : mutedColor} strokeWidth="2.5" />
              <text x={position.x} y={position.y - 8} textAnchor="middle" fontFamily="monospace" fontSize="14" fontWeight="700" fill={isOpen || isClosed || isCurrent ? inverseText : textColor}>{node}</text>
              <text x={position.x} y={position.y + 7} textAnchor="middle" fontFamily="monospace" fontSize="10" fill={isOpen || isClosed || isCurrent ? inverseText : textColor}>h={aStarHeuristic[node]}</text>
              <text x={position.x} y={position.y + 20} textAnchor="middle" fontFamily="monospace" fontSize="10" fill={isOpen || isClosed || isCurrent ? inverseText : textColor}>f={fValue}</text>
            </g>
          );
        })}
      </svg>
    </RunnerFrame>
  );
}

const lruCode = `
def lru_pages(reference, frame_count):
    frames = [None] * frame_count
    last_used = {}
    faults = 0

    for time, page in enumerate(reference):
        if page not in frames:
            faults += 1
            if None in frames:
                victim = frames.index(None)
            else:
                victim = min(range(frame_count), key=lambda i: last_used[frames[i]])
            frames[victim] = page
        last_used[page] = time
        yield time, page, list(frames), faults
`;

type LruStep = {
  page: number;
  frames: Array<number | null>;
  hit: boolean;
  evicted: number | null;
  faults: number;
};

function buildLruTrace(): LruStep[] {
  const reference = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2];
  const frames: Array<number | null> = [null, null, null];
  const lastUsed = new Map<number, number>();
  let faults = 0;

  return reference.map((page, index) => {
    const frameIndex = frames.indexOf(page);
    let evicted: number | null = null;
    const hit = frameIndex !== -1;

    if (!hit) {
      faults += 1;
      const empty = frames.indexOf(null);
      const victimIndex = empty !== -1
        ? empty
        : frames.reduce<number>((victim, frame, candidateIndex) => {
            if (frame === null) return victim;
            const candidateTime = lastUsed.get(frame) ?? -1;
            const victimFrame = frames[victim];
            const victimTime = victimFrame === null ? -1 : lastUsed.get(victimFrame) ?? -1;
            return candidateTime < victimTime ? candidateIndex : victim;
          }, 0);
      evicted = frames[victimIndex];
      frames[victimIndex] = page;
    }

    lastUsed.set(page, index);
    return { page, frames: [...frames], hit, evicted, faults };
  });
}

export function LruCacheRunner() {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const { isDarkMode, primaryColor, secondaryColor, accentColor, mutedColor } = useCsRunnerTheme();
  const reference = [7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2];
  const trace = useMemo(buildLruTrace, []);
  const maxStep = trace.length - 1;
  const boundedStep = Math.min(stepIndex, maxStep);
  const current = trace[boundedStep];
  const hits = trace.slice(0, boundedStep + 1).filter((step) => step.hit).length;

  return (
    <RunnerFrame
      title="LRU Page Replacement Runner"
      stepIndex={boundedStep}
      maxStep={maxStep}
      playing={playing}
      setPlaying={setPlaying}
      setStepIndex={setStepIndex}
      atEnd={boundedStep === maxStep}
      delay={650}
      code={lruCode}
      metrics={[
        { label: 'requested page', value: current.page },
        { label: 'result', value: current.hit ? 'hit' : current.evicted === null ? 'fault, empty frame' : `fault, evict ${current.evicted}` },
        { label: 'faults / hits', value: `${current.faults} / ${hits}` },
      ]}
      status="Least recently used evicts the resident page whose last access is farthest in the past."
    >
      <div className="space-y-5">
        <div className="grid grid-cols-[repeat(13,minmax(2.25rem,1fr))] gap-1 overflow-x-auto pb-2">
          {reference.map((page, index) => (
            <div
              key={`${page}-${index}`}
              className={`flex h-10 min-w-9 items-center justify-center rounded border text-sm font-bold ${isDarkMode ? 'border-green-500/20' : 'border-slate-200'}`}
              style={{
                backgroundColor: index === boundedStep ? secondaryColor : index < boundedStep ? `${primaryColor}22` : 'transparent',
                color: index === boundedStep ? '#ffffff' : undefined,
              }}
            >
              {page}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {current.frames.map((page, index) => (
            <div key={index} className="rounded-lg border p-4 text-center" style={{ borderColor: page === current.page ? secondaryColor : mutedColor }}>
              <div className="text-xs uppercase opacity-70">frame {index}</div>
              <div className="mt-2 text-2xl font-bold" style={{ color: page === current.page ? secondaryColor : accentColor }}>{page ?? '-'}</div>
            </div>
          ))}
        </div>
      </div>
    </RunnerFrame>
  );
}

const hashJoinCode = `
def hash_join(customers, orders):
    table = {}
    for customer in customers:
        table.setdefault(customer.id, []).append(customer)

    output = []
    for order in orders:
        for customer in table.get(order.customer_id, []):
            output.append((customer.name, order.item))
    return output
`;

type HashJoinStep = {
  phase: 'build' | 'probe';
  rowLabel: string;
  bucket: number;
  buckets: Record<number, string[]>;
  output: string[];
  matches: string[];
};

function buildHashJoinTrace(): HashJoinStep[] {
  const customers = [
    { id: 1, name: 'Ada' },
    { id: 2, name: 'Grace' },
    { id: 3, name: 'Linus' },
    { id: 5, name: 'Ken' },
  ];
  const orders = [
    { id: 'O1', customerId: 2, item: 'GPU' },
    { id: 'O2', customerId: 4, item: 'Cable' },
    { id: 'O3', customerId: 1, item: 'Keyboard' },
    { id: 'O4', customerId: 5, item: 'SSD' },
    { id: 'O5', customerId: 3, item: 'Monitor' },
  ];
  const buckets: Record<number, string[]> = { 0: [], 1: [], 2: [] };
  const output: string[] = [];
  const trace: HashJoinStep[] = [];

  for (const customer of customers) {
    const bucket = customer.id % 3;
    buckets[bucket].push(`${customer.id}:${customer.name}`);
    trace.push({ phase: 'build', rowLabel: `Customer ${customer.id}:${customer.name}`, bucket, buckets: structuredClone(buckets), output: [...output], matches: [] });
  }

  for (const order of orders) {
    const bucket = order.customerId % 3;
    const matches = buckets[bucket].filter((row) => row.startsWith(`${order.customerId}:`));
    for (const match of matches) output.push(`${match.split(':')[1]} - ${order.item}`);
    trace.push({ phase: 'probe', rowLabel: `${order.id}: customer ${order.customerId}, ${order.item}`, bucket, buckets: structuredClone(buckets), output: [...output], matches });
  }

  return trace;
}

export function HashJoinRunner() {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const { primaryColor, secondaryColor, accentColor, mutedColor } = useCsRunnerTheme();
  const trace = useMemo(buildHashJoinTrace, []);
  const maxStep = trace.length - 1;
  const boundedStep = Math.min(stepIndex, maxStep);
  const current = trace[boundedStep];

  return (
    <RunnerFrame
      title="Hash Join Runner"
      stepIndex={boundedStep}
      maxStep={maxStep}
      playing={playing}
      setPlaying={setPlaying}
      setStepIndex={setStepIndex}
      atEnd={boundedStep === maxStep}
      delay={760}
      code={hashJoinCode}
      metrics={[
        { label: 'phase', value: current.phase },
        { label: 'active row', value: current.rowLabel },
        { label: 'matches', value: current.matches.length ? current.matches.join(', ') : 'none yet' },
      ]}
      status={current.phase === 'build' ? 'Build a hash table on the smaller input relation.' : 'Probe the hash table with rows from the larger relation.'}
    >
      <div className="grid gap-4">
        <div className="grid gap-3 sm:grid-cols-3">
          {[0, 1, 2].map((bucket) => (
            <div key={bucket} className="min-h-32 rounded-lg border p-3" style={{ borderColor: bucket === current.bucket ? secondaryColor : mutedColor }}>
              <div className="mb-2 text-xs font-bold uppercase">bucket {bucket}</div>
              <div className="space-y-2">
                {current.buckets[bucket].map((row) => (
                  <div key={row} className="rounded border px-2 py-1 text-sm" style={{ borderColor: primaryColor, backgroundColor: `${primaryColor}1A` }}>{row}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-lg border p-3 text-sm" style={{ borderColor: accentColor }}>
          <strong>Output rows:</strong> {current.output.length ? current.output.join(', ') : 'none'}
        </div>
      </div>
    </RunnerFrame>
  );
}

const raftCode = `
func (n *Node) startElection() {
    n.term++
    n.state = Candidate
    votes := 1
    for _, peer := range peers {
        go sendRequestVote(peer, n.term, n.lastLogIndex, n.lastLogTerm)
    }
    if votes >= majority {
        n.state = Leader
        broadcastAppendEntries()
    }
}
`;

const raftSteps = [
  { term: 4, role: 'followers idle', leader: '-', votes: [] as string[], committed: 2, message: 'Followers are idle; no leader heartbeat arrives before C times out.', arrows: [] as string[] },
  { term: 5, role: 'candidate', leader: '-', votes: ['C'], committed: 2, message: 'C increments term and asks peers for votes.', arrows: ['C-A', 'C-B', 'C-D', 'C-E'] },
  { term: 5, role: 'candidate', leader: '-', votes: ['C', 'A'], committed: 2, message: 'A grants a vote because C has an up-to-date log.', arrows: ['A-C'] },
  { term: 5, role: 'candidate', leader: '-', votes: ['C', 'A', 'D'], committed: 2, message: 'D grants a vote; C now has a majority of three.', arrows: ['D-C'] },
  { term: 5, role: 'leader', leader: 'C', votes: ['C', 'A', 'D'], committed: 2, message: 'C becomes leader and sends heartbeats.', arrows: ['C-A', 'C-B', 'C-D', 'C-E'] },
  { term: 5, role: 'leader', leader: 'C', votes: ['C', 'A', 'D'], committed: 2, message: 'Client command is appended to C log at index 3.', arrows: [] },
  { term: 5, role: 'leader', leader: 'C', votes: ['C', 'A', 'D'], committed: 2, message: 'Followers replicate the new log entry.', arrows: ['C-A', 'C-D', 'C-E'] },
  { term: 5, role: 'leader', leader: 'C', votes: ['C', 'A', 'D'], committed: 3, message: 'A majority acknowledges index 3, so C commits it.', arrows: ['A-C', 'D-C'] },
];

const raftPositions: Record<string, { x: number; y: number }> = {
  A: { x: 92, y: 70 },
  B: { x: 235, y: 48 },
  C: { x: 372, y: 126 },
  D: { x: 235, y: 210 },
  E: { x: 92, y: 182 },
};

export function RaftElectionRunner() {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const { primaryColor, secondaryColor, accentColor, mutedColor, textColor, panelFill, inverseText } = useCsRunnerTheme();
  const maxStep = raftSteps.length - 1;
  const boundedStep = Math.min(stepIndex, maxStep);
  const current = raftSteps[boundedStep];

  return (
    <RunnerFrame
      title="Raft Election and Commit Runner"
      stepIndex={boundedStep}
      maxStep={maxStep}
      playing={playing}
      setPlaying={setPlaying}
      setStepIndex={setStepIndex}
      atEnd={boundedStep === maxStep}
      delay={850}
      code={raftCode}
      codeLanguage="go"
      metrics={[
        { label: 'term', value: current.term },
        { label: 'leader', value: current.leader },
        { label: 'committed index', value: current.committed },
      ]}
      status={current.message}
    >
      <svg viewBox="0 0 470 270" className="h-80 w-full" role="img" aria-label="Raft election and commit trace">
        {current.arrows.map((arrow) => {
          const [fromId, toId] = arrow.split('-');
          const from = raftPositions[fromId];
          const to = raftPositions[toId];
          return <line key={arrow} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={accentColor} strokeWidth="3" strokeDasharray="7 5" />;
        })}
        {Object.entries(raftPositions).map(([node, position]) => {
          const isLeader = current.leader === node;
          const voted = current.votes.includes(node);
          const fill = isLeader ? secondaryColor : voted ? primaryColor : panelFill;
          return (
            <g key={node}>
              <rect x={position.x - 36} y={position.y - 28} width="72" height="56" rx="8" fill={fill} stroke={voted || isLeader ? fill : mutedColor} strokeWidth="2" />
              <text x={position.x} y={position.y - 4} textAnchor="middle" fontFamily="monospace" fontSize="14" fontWeight="700" fill={voted || isLeader ? inverseText : textColor}>{node}</text>
              <text x={position.x} y={position.y + 14} textAnchor="middle" fontFamily="monospace" fontSize="10" fill={voted || isLeader ? inverseText : textColor}>
                {isLeader ? 'leader' : voted ? 'voted' : 'follower'}
              </text>
            </g>
          );
        })}
      </svg>
    </RunnerFrame>
  );
}

const modularExponentiationCode = `
def mod_pow(base, exponent, modulus):
    result = 1
    for bit in bin(exponent)[2:]:
        result = (result * result) % modulus
        if bit == "1":
            result = (result * base) % modulus
    return result
`;

type ModStep = {
  bit: string;
  afterSquare: number;
  result: number;
  multiplied: boolean;
};

function buildModPowTrace(): ModStep[] {
  const base = 5;
  const exponent = 117;
  const modulus = 19;
  let result = 1;
  return exponent.toString(2).split('').map((bit) => {
    const afterSquare = (result * result) % modulus;
    result = bit === '1' ? (afterSquare * base) % modulus : afterSquare;
    return { bit, afterSquare, result, multiplied: bit === '1' };
  });
}

export function ModularExponentiationRunner() {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const { primaryColor, secondaryColor, accentColor, mutedColor } = useCsRunnerTheme();
  const bits = '1110101';
  const trace = useMemo(buildModPowTrace, []);
  const maxStep = trace.length - 1;
  const boundedStep = Math.min(stepIndex, maxStep);
  const current = trace[boundedStep];

  return (
    <RunnerFrame
      title="Square-and-Multiply Modular Exponentiation"
      stepIndex={boundedStep}
      maxStep={maxStep}
      playing={playing}
      setPlaying={setPlaying}
      setStepIndex={setStepIndex}
      atEnd={boundedStep === maxStep}
      delay={760}
      code={modularExponentiationCode}
      metrics={[
        { label: 'problem', value: '5^117 mod 19' },
        { label: 'current bit', value: current.bit },
        { label: 'result', value: current.result },
      ]}
      status={current.multiplied ? `Square to ${current.afterSquare}, then multiply by the base because the bit is 1.` : `Square to ${current.afterSquare}; skip multiply because the bit is 0.`}
    >
      <div className="space-y-5">
        <div className="grid grid-cols-7 gap-2">
          {bits.split('').map((bit, index) => (
            <div
              key={`${bit}-${index}`}
              className="rounded-lg border p-3 text-center"
              style={{ borderColor: index === boundedStep ? secondaryColor : mutedColor, backgroundColor: index <= boundedStep ? `${primaryColor}22` : 'transparent' }}
            >
              <div className="text-xs uppercase opacity-70">bit {index + 1}</div>
              <div className="text-xl font-bold">{bit}</div>
            </div>
          ))}
        </div>
        <div className="rounded-lg border p-4" style={{ borderColor: accentColor }}>
          <div className="mb-2 text-sm font-bold">Residue modulo 19</div>
          <div className="h-8 overflow-hidden rounded bg-current/10">
            <div className="h-full rounded" style={{ width: `${Math.max(6, (current.result / 18) * 100)}%`, backgroundColor: secondaryColor }} />
          </div>
        </div>
      </div>
    </RunnerFrame>
  );
}

const ransacCode = `
def ransac_line(points, samples, threshold=0.45):
    best = None
    for i, j in samples:
        line = fit_line(points[i], points[j])
        inliers = [p for p in points if distance_to_line(p, line) <= threshold]
        if best is None or len(inliers) > len(best.inliers):
            best = Result(line=line, inliers=inliers)
    return best
`;

type VisionPoint = { id: string; x: number; y: number };
const ransacPoints: VisionPoint[] = [
  { id: 'A', x: 0.5, y: 0.8 },
  { id: 'B', x: 1.1, y: 1.4 },
  { id: 'C', x: 1.9, y: 2.1 },
  { id: 'D', x: 2.8, y: 2.8 },
  { id: 'E', x: 3.6, y: 3.6 },
  { id: 'F', x: 4.5, y: 4.4 },
  { id: 'G', x: 5.5, y: 5.1 },
  { id: 'H', x: 6.3, y: 5.9 },
  { id: 'I', x: 1.5, y: 5.4 },
  { id: 'J', x: 4.8, y: 1.1 },
  { id: 'K', x: 6.0, y: 3.0 },
];
const ransacSamples = [
  [0, 8],
  [1, 2],
  [4, 9],
  [2, 6],
  [0, 10],
  [3, 7],
  [8, 9],
  [1, 5],
  [6, 10],
  [0, 7],
];

function fitLine(a: VisionPoint, b: VisionPoint) {
  const m = (b.y - a.y) / Math.max(0.0001, b.x - a.x);
  return { m, b: a.y - m * a.x };
}

function residual(point: VisionPoint, line: { m: number; b: number }) {
  return Math.abs(line.m * point.x - point.y + line.b) / Math.sqrt(line.m * line.m + 1);
}

function buildRansacTrace() {
  let best = { index: 0, line: fitLine(ransacPoints[0], ransacPoints[8]), inliers: [] as string[] };
  return ransacSamples.map(([left, right], index) => {
    const line = fitLine(ransacPoints[left], ransacPoints[right]);
    const inliers = ransacPoints.filter((point) => residual(point, line) <= 0.45).map((point) => point.id);
    if (inliers.length > best.inliers.length) best = { index, line, inliers };
    return { left, right, line, inliers, best: { ...best, inliers: [...best.inliers] } };
  });
}

export function RansacLineRunner() {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const { primaryColor, secondaryColor, accentColor, mutedColor, textColor } = useCsRunnerTheme();
  const trace = useMemo(buildRansacTrace, []);
  const maxStep = trace.length - 1;
  const boundedStep = Math.min(stepIndex, maxStep);
  const current = trace[boundedStep];
  const sampleIds = new Set([ransacPoints[current.left].id, ransacPoints[current.right].id]);
  const bestInliers = new Set(current.best.inliers);
  const chart = { width: 460, height: 300, left: 42, top: 24, plotWidth: 360, plotHeight: 220 };
  const xCoord = (x: number) => chart.left + (x / 7) * chart.plotWidth;
  const yCoord = (y: number) => chart.top + chart.plotHeight - (y / 7) * chart.plotHeight;
  const linePoints = (line: { m: number; b: number }) => ({
    x1: xCoord(0),
    y1: yCoord(line.b),
    x2: xCoord(7),
    y2: yCoord(line.m * 7 + line.b),
  });
  const candidate = linePoints(current.line);
  const best = linePoints(current.best.line);

  return (
    <RunnerFrame
      title="RANSAC Line Fitting Runner"
      stepIndex={boundedStep}
      maxStep={maxStep}
      playing={playing}
      setPlaying={setPlaying}
      setStepIndex={setStepIndex}
      atEnd={boundedStep === maxStep}
      delay={760}
      code={ransacCode}
      metrics={[
        { label: 'sample', value: `${ransacPoints[current.left].id}, ${ransacPoints[current.right].id}` },
        { label: 'candidate inliers', value: current.inliers.length },
        { label: 'best inliers', value: current.best.inliers.length },
      ]}
      status="Each iteration samples a tiny model, scores all points, and keeps the line with the largest consensus set."
    >
      <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className="h-80 w-full" role="img" aria-label="RANSAC line fitting iterations">
        <defs>
          <clipPath id="ransac-plot-clip">
            <rect x={chart.left} y={chart.top} width={chart.plotWidth} height={chart.plotHeight} rx="8" />
          </clipPath>
        </defs>
        <rect x={chart.left} y={chart.top} width={chart.plotWidth} height={chart.plotHeight} rx="8" fill="transparent" stroke={mutedColor} strokeOpacity="0.5" />
        <g clipPath="url(#ransac-plot-clip)">
          <line x1={best.x1} y1={best.y1} x2={best.x2} y2={best.y2} stroke={accentColor} strokeWidth="4" strokeLinecap="round" opacity="0.8" />
          <line x1={candidate.x1} y1={candidate.y1} x2={candidate.x2} y2={candidate.y2} stroke={secondaryColor} strokeWidth="2.5" strokeDasharray="7 5" />
        </g>
        {ransacPoints.map((point) => {
          const isSample = sampleIds.has(point.id);
          const inBest = bestInliers.has(point.id);
          return (
            <g key={point.id}>
              <circle cx={xCoord(point.x)} cy={yCoord(point.y)} r={isSample ? 8 : 6} fill={isSample ? secondaryColor : inBest ? primaryColor : 'transparent'} stroke={inBest || isSample ? primaryColor : mutedColor} strokeWidth="2" />
              <text x={xCoord(point.x)} y={yCoord(point.y) - 11} textAnchor="middle" fontFamily="monospace" fontSize="10" fill={textColor}>{point.id}</text>
            </g>
          );
        })}
      </svg>
    </RunnerFrame>
  );
}

const passwordStretchingCode = `
from hashlib import sha256

def stretch_password(password, salt, rounds=100_000):
    state = (salt + password).encode()
    for _ in range(rounds):
        state = sha256(state).hexdigest().encode()
    return state.decode()
`;

function pseudoDigest(seed: string, round: number) {
  let acc = 2166136261;
  for (const char of `${seed}:${round}`) {
    acc ^= char.charCodeAt(0);
    acc = Math.imul(acc, 16777619);
  }
  return (acc >>> 0).toString(16).padStart(8, '0');
}

export function PasswordHashStretchingRunner() {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const { primaryColor, secondaryColor, mutedColor } = useCsRunnerTheme();
  const rounds = Array.from({ length: 10 }, (_, index) => pseudoDigest('salt:correct horse battery staple', index + 1));
  const maxStep = rounds.length - 1;
  const boundedStep = Math.min(stepIndex, maxStep);

  return (
    <RunnerFrame
      title="Password Hash Stretching Runner"
      stepIndex={boundedStep}
      maxStep={maxStep}
      playing={playing}
      setPlaying={setPlaying}
      setStepIndex={setStepIndex}
      atEnd={boundedStep === maxStep}
      delay={520}
      code={passwordStretchingCode}
      metrics={[
        { label: 'round', value: boundedStep + 1 },
        { label: 'digest prefix', value: rounds[boundedStep] },
        { label: 'work multiplier', value: `${boundedStep + 1}x toy rounds` },
      ]}
      status="The real setting uses many more rounds; the visual keeps ten rounds so the dependency chain is readable."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {rounds.map((digest, index) => (
          <div
            key={digest}
            className="rounded-lg border p-3"
            style={{
              borderColor: index === boundedStep ? secondaryColor : mutedColor,
              backgroundColor: index <= boundedStep ? `${primaryColor}20` : 'transparent',
            }}
          >
            <div className="text-xs font-bold uppercase opacity-70">round {index + 1}</div>
            <div className="mt-1 font-mono text-sm">{index <= boundedStep ? digest : 'waiting'}</div>
          </div>
        ))}
      </div>
    </RunnerFrame>
  );
}

const backpropagationCode = `
def train_one_example(x1, x2, y, lr=0.35, epochs=10):
    w1, w2, b1 = 0.3, -0.4, 0.1
    v, c = -0.6, 0.2
    for epoch in range(epochs):
        z = w1*x1 + w2*x2 + b1
        h = max(0, z)
        yhat = sigmoid(v*h + c)
        loss = 0.5 * (yhat - y) ** 2

        dlogit = (yhat - y) * yhat * (1 - yhat)
        dv = dlogit * h
        dh = dlogit * v
        dz = dh if z > 0 else 0
        w1 -= lr * dz * x1
        w2 -= lr * dz * x2
        b1 -= lr * dz
        v -= lr * dv
        c -= lr * dlogit
        yield epoch, yhat, loss
`;

function sigmoid(value: number) {
  return 1 / (1 + Math.exp(-value));
}

function buildBackpropTrace() {
  let w1 = 0.3;
  let w2 = -0.4;
  let b1 = 0.1;
  let v = -0.6;
  let c = 0.2;
  const x1 = 1;
  const x2 = 0.8;
  const y = 1;
  const lr = 0.35;
  const trace: Array<{ epoch: number; yhat: number; loss: number; gradNorm: number; w1: number; w2: number; v: number }> = [];

  for (let epoch = 0; epoch < 10; epoch += 1) {
    const z = w1 * x1 + w2 * x2 + b1;
    const h = Math.max(0, z);
    const yhat = sigmoid(v * h + c);
    const loss = 0.5 * (yhat - y) ** 2;
    const dlogit = (yhat - y) * yhat * (1 - yhat);
    const dv = dlogit * h;
    const dh = dlogit * v;
    const dz = z > 0 ? dh : 0;
    const gradW1 = dz * x1;
    const gradW2 = dz * x2;
    const gradNorm = Math.hypot(gradW1, gradW2, dz, dv, dlogit);
    trace.push({ epoch, yhat, loss, gradNorm, w1, w2, v });
    w1 -= lr * gradW1;
    w2 -= lr * gradW2;
    b1 -= lr * dz;
    v -= lr * dv;
    c -= lr * dlogit;
  }

  return trace;
}

export function BackpropagationRunner() {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const { primaryColor, secondaryColor, accentColor, mutedColor, textColor } = useCsRunnerTheme();
  const trace = useMemo(buildBackpropTrace, []);
  const maxStep = trace.length - 1;
  const boundedStep = Math.min(stepIndex, maxStep);
  const current = trace[boundedStep];
  const maxLoss = Math.max(...trace.map((step) => step.loss));
  const width = 430;
  const height = 250;

  return (
    <RunnerFrame
      title="Backpropagation Training Runner"
      stepIndex={boundedStep}
      maxStep={maxStep}
      playing={playing}
      setPlaying={setPlaying}
      setStepIndex={setStepIndex}
      atEnd={boundedStep === maxStep}
      delay={620}
      code={backpropagationCode}
      metrics={[
        { label: 'epoch', value: current.epoch },
        { label: 'prediction', value: formatNumber(current.yhat, 3) },
        { label: 'loss', value: formatNumber(current.loss, 4) },
      ]}
      status="The forward pass computes a prediction; the backward pass pushes error gradients from output back to earlier weights."
    >
      <svg viewBox={`0 0 ${width} ${height}`} className="h-72 w-full" role="img" aria-label="Tiny neural network and loss over epochs">
        <line x1="80" y1="70" x2="215" y2="120" stroke={primaryColor} strokeWidth={2 + Math.abs(current.w1) * 4} />
        <line x1="80" y1="170" x2="215" y2="120" stroke={primaryColor} strokeWidth={2 + Math.abs(current.w2) * 4} />
        <line x1="215" y1="120" x2="350" y2="120" stroke={secondaryColor} strokeWidth={2 + Math.abs(current.v) * 4} />
        {[
          { label: 'x1', x: 80, y: 70, color: accentColor },
          { label: 'x2', x: 80, y: 170, color: accentColor },
          { label: 'h', x: 215, y: 120, color: primaryColor },
          { label: 'yhat', x: 350, y: 120, color: secondaryColor },
        ].map((node) => (
          <g key={node.label}>
            <circle cx={node.x} cy={node.y} r="27" fill={node.color} fillOpacity="0.28" stroke={node.color} strokeWidth="2" />
            <text x={node.x} y={node.y + 4} textAnchor="middle" fontFamily="monospace" fontSize="13" fontWeight="700" fill={textColor}>{node.label}</text>
          </g>
        ))}
        <text x="24" y="28" fontFamily="monospace" fontSize="12" fill={textColor}>grad norm: {formatNumber(current.gradNorm, 4)}</text>
        <g transform="translate(34 205)">
          {trace.map((step, index) => (
            <rect
              key={step.epoch}
              x={index * 28}
              y={-Math.max(4, (step.loss / maxLoss) * 48)}
              width="18"
              height={Math.max(4, (step.loss / maxLoss) * 48)}
              rx="3"
              fill={index <= boundedStep ? secondaryColor : mutedColor}
              opacity={index <= boundedStep ? 0.85 : 0.25}
            />
          ))}
          <text x="0" y="22" fontFamily="monospace" fontSize="11" fill={textColor}>loss by epoch</text>
        </g>
      </svg>
    </RunnerFrame>
  );
}

const unificationCode = `
def unify(equations):
    substitution = {}
    while equations:
        left, right = apply(substitution, equations.pop())
        if left == right:
            continue
        if is_variable(left):
            if occurs(left, right):
                raise TypeError("occurs check failed")
            substitution[left] = right
        elif is_variable(right):
            equations.append((right, left))
        else:
            equations.extend(decompose(left, right))
    return substitution
`;

const unificationSteps = [
  { equation: "('a -> 'b) = (int -> 'c)", substitutions: {}, queue: ["'b = bool", "'d = list 'c", "'e = 'd"], note: 'Start with a function-type equality and three remaining constraints.' },
  { equation: "decompose arrows", substitutions: {}, queue: ["'a = int", "'b = 'c", "'b = bool", "'d = list 'c", "'e = 'd"], note: 'Equal function types require equal argument types and equal return types.' },
  { equation: "'a = int", substitutions: { "'a": 'int' }, queue: ["'b = 'c", "'b = bool", "'d = list 'c", "'e = 'd"], note: "Bind variable 'a to int." },
  { equation: "'b = 'c", substitutions: { "'a": 'int', "'b": "'c" }, queue: ["'b = bool", "'d = list 'c", "'e = 'd"], note: "Bind 'b to 'c and keep solving." },
  { equation: "'b = bool", substitutions: { "'a": 'int', "'b": "'c" }, queue: ["'c = bool", "'d = list 'c", "'e = 'd"], note: "Apply the current substitution, turning 'b = bool into 'c = bool." },
  { equation: "'c = bool", substitutions: { "'a": 'int', "'b": 'bool', "'c": 'bool' }, queue: ["'d = list bool", "'e = 'd"], note: "Bind 'c to bool and rewrite dependent substitutions." },
  { equation: "'d = list bool", substitutions: { "'a": 'int', "'b": 'bool', "'c": 'bool', "'d": 'list bool' }, queue: ["'e = list bool"], note: "Bind 'd to the constructed list type." },
  { equation: "'e = list bool", substitutions: { "'a": 'int', "'b": 'bool', "'c": 'bool', "'d": 'list bool', "'e": 'list bool' }, queue: [], note: 'The constraint queue is empty, so the substitution is a unifier.' },
];

export function UnificationRunner() {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const { primaryColor, secondaryColor, mutedColor } = useCsRunnerTheme();
  const maxStep = unificationSteps.length - 1;
  const boundedStep = Math.min(stepIndex, maxStep);
  const current = unificationSteps[boundedStep];

  return (
    <RunnerFrame
      title="Unification Constraint Runner"
      stepIndex={boundedStep}
      maxStep={maxStep}
      playing={playing}
      setPlaying={setPlaying}
      setStepIndex={setStepIndex}
      atEnd={boundedStep === maxStep}
      delay={760}
      code={unificationCode}
      metrics={[
        { label: 'active equation', value: current.equation },
        { label: 'queue length', value: current.queue.length },
        { label: 'bindings', value: Object.keys(current.substitutions).length },
      ]}
      status={current.note}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-3" style={{ borderColor: secondaryColor }}>
          <div className="mb-2 text-xs font-bold uppercase">substitution</div>
          <div className="space-y-2">
            {Object.entries(current.substitutions).map(([name, value]) => (
              <div key={name} className="rounded border px-2 py-1 text-sm" style={{ borderColor: primaryColor }}>{name}{' -> '}{value}</div>
            ))}
            {Object.keys(current.substitutions).length === 0 && <div className="text-sm opacity-70">empty</div>}
          </div>
        </div>
        <div className="rounded-lg border p-3" style={{ borderColor: mutedColor }}>
          <div className="mb-2 text-xs font-bold uppercase">constraint queue</div>
          <div className="space-y-2">
            {current.queue.map((constraint) => (
              <div key={constraint} className="rounded border border-current/20 px-2 py-1 text-sm">{constraint}</div>
            ))}
            {current.queue.length === 0 && <div className="text-sm opacity-70">empty</div>}
          </div>
        </div>
      </div>
    </RunnerFrame>
  );
}

const galeShapleyCode = `
def gale_shapley(proposers, receivers):
    free = list(proposers)
    next_choice = {p: 0 for p in proposers}
    held = {}

    while free:
        p = free.pop(0)
        r = proposers[p][next_choice[p]]
        next_choice[p] += 1

        if r not in held:
            held[r] = p
        elif receivers[r].index(p) < receivers[r].index(held[r]):
            free.append(held[r])
            held[r] = p
        else:
            free.append(p)
    return held
`;

const galeProposers = ['A', 'B', 'C', 'D'];
const galeReceivers = ['X', 'Y', 'Z', 'W'];
const galeSteps = [
  { proposal: 'none', matches: {} as Record<string, string>, note: 'All proposers are free and every receiver has no tentative match.' },
  { proposal: 'A -> X', matches: { X: 'A' }, note: 'X is free, so X holds A.' },
  { proposal: 'B -> Y', matches: { X: 'A', Y: 'B' }, note: 'Y is free, so Y holds B.' },
  { proposal: 'C -> Y', matches: { X: 'A', Y: 'C' }, note: 'Y prefers C over B, so B becomes free again.' },
  { proposal: 'B -> X', matches: { X: 'B', Y: 'C' }, note: 'X prefers B over A, so A becomes free again.' },
  { proposal: 'A -> Y', matches: { X: 'B', Y: 'C' }, note: 'Y still prefers C, so A is rejected.' },
  { proposal: 'A -> Z', matches: { X: 'B', Y: 'C', Z: 'A' }, note: 'Z is free, so Z holds A.' },
  { proposal: 'D -> X', matches: { X: 'B', Y: 'C', Z: 'A' }, note: 'X keeps B and rejects D.' },
  { proposal: 'D -> Z', matches: { X: 'B', Y: 'C', Z: 'A' }, note: 'Z keeps A and rejects D.' },
  { proposal: 'D -> W', matches: { X: 'B', Y: 'C', Z: 'A', W: 'D' }, note: 'W is free, so W holds D and the matching is complete.' },
];

export function GaleShapleyRunner() {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const { primaryColor, secondaryColor, accentColor, mutedColor } = useCsRunnerTheme();
  const maxStep = galeSteps.length - 1;
  const boundedStep = Math.min(stepIndex, maxStep);
  const current = galeSteps[boundedStep];
  const matchedProposers = new Set(Object.values(current.matches));
  const activeProposer = current.proposal === 'none' ? null : current.proposal.split(' -> ')[0];
  const activeReceiver = current.proposal === 'none' ? null : current.proposal.split(' -> ')[1];

  return (
    <RunnerFrame
      title="Gale-Shapley Deferred Acceptance Runner"
      stepIndex={boundedStep}
      maxStep={maxStep}
      playing={playing}
      setPlaying={setPlaying}
      setStepIndex={setStepIndex}
      atEnd={boundedStep === maxStep}
      delay={760}
      code={galeShapleyCode}
      metrics={[
        { label: 'proposal', value: current.proposal },
        { label: 'tentative matches', value: Object.keys(current.matches).length },
        { label: 'free proposers', value: galeProposers.filter((person) => !matchedProposers.has(person)).join(', ') || 'none' },
      ]}
      status={current.note}
    >
      <div className="grid gap-4 md:grid-cols-[1fr_minmax(150px,0.8fr)_1fr]">
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase opacity-70">proposers</div>
          {galeProposers.map((person) => (
            <div
              key={person}
              className="rounded-lg border px-3 py-2 text-sm font-bold"
              style={{ borderColor: person === activeProposer ? secondaryColor : mutedColor, backgroundColor: matchedProposers.has(person) ? `${primaryColor}22` : 'transparent' }}
            >
              {person} {matchedProposers.has(person) ? 'held' : 'free'}
            </div>
          ))}
        </div>
        <div className="rounded-lg border p-3 text-sm" style={{ borderColor: accentColor }}>
          <div className="mb-2 text-xs font-bold uppercase opacity-70">current offer</div>
          <div className="font-mono text-lg font-bold">{current.proposal}</div>
          <div className="mt-4 text-xs font-bold uppercase opacity-70">held pairs</div>
          <div className="mt-2 space-y-1">
            {Object.entries(current.matches).map(([receiver, proposer]) => (
              <div key={receiver} className="font-mono">{proposer} - {receiver}</div>
            ))}
            {Object.keys(current.matches).length === 0 && <div className="opacity-70">none</div>}
          </div>
        </div>
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase opacity-70">receivers</div>
          {galeReceivers.map((person) => (
            <div
              key={person}
              className="rounded-lg border px-3 py-2 text-sm font-bold"
              style={{ borderColor: person === activeReceiver ? secondaryColor : mutedColor, backgroundColor: current.matches[person] ? `${primaryColor}22` : 'transparent' }}
            >
              {person} holds {current.matches[person] ?? '-'}
            </div>
          ))}
        </div>
      </div>
    </RunnerFrame>
  );
}

const bfsCode = `
from collections import deque

def bfs(graph, source):
    level = {source: 0}
    parent = {source: None}
    queue = deque([source])

    while queue:
        u = queue.popleft()
        for v in graph[u]:
            if v not in level:
                level[v] = level[u] + 1
                parent[v] = u
                queue.append(v)
    return level, parent
`;

type BfsNode = 'S' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
const bfsNodes: BfsNode[] = ['S', 'A', 'B', 'C', 'D', 'E', 'F'];
const bfsEdges: Array<[BfsNode, BfsNode]> = [
  ['S', 'A'],
  ['S', 'B'],
  ['A', 'C'],
  ['A', 'D'],
  ['B', 'E'],
  ['D', 'F'],
  ['E', 'F'],
];
const bfsPositions: Record<BfsNode, { x: number; y: number }> = {
  S: { x: 56, y: 132 },
  A: { x: 158, y: 72 },
  B: { x: 158, y: 192 },
  C: { x: 280, y: 52 },
  D: { x: 280, y: 126 },
  E: { x: 280, y: 212 },
  F: { x: 410, y: 168 },
};

type BfsStep = {
  current: BfsNode | null;
  queue: BfsNode[];
  discovered: BfsNode[];
  level: Partial<Record<BfsNode, number>>;
  note: string;
};

function buildBfsTrace(): BfsStep[] {
  const adjacency: Record<BfsNode, BfsNode[]> = {
    S: ['A', 'B'],
    A: ['S', 'C', 'D'],
    B: ['S', 'E'],
    C: ['A'],
    D: ['A', 'F'],
    E: ['B', 'F'],
    F: ['D', 'E'],
  };
  const queue: BfsNode[] = ['S'];
  const discovered: BfsNode[] = ['S'];
  const level: Partial<Record<BfsNode, number>> = { S: 0 };
  const trace: BfsStep[] = [{ current: null, queue: [...queue], discovered: [...discovered], level: { ...level }, note: 'Start at S with level 0 and put it in the queue.' }];

  while (queue.length > 0) {
    const current = queue.shift() as BfsNode;
    const added: BfsNode[] = [];
    for (const neighbor of adjacency[current]) {
      if (!discovered.includes(neighbor)) {
        discovered.push(neighbor);
        level[neighbor] = (level[current] ?? 0) + 1;
        queue.push(neighbor);
        added.push(neighbor);
      }
    }
    trace.push({
      current,
      queue: [...queue],
      discovered: [...discovered],
      level: { ...level },
      note: added.length ? `Dequeue ${current}; discover ${added.join(', ')} and enqueue them.` : `Dequeue ${current}; every neighbor was already discovered.`,
    });
  }

  return trace;
}

export function BfsTraversalRunner() {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const { primaryColor, secondaryColor, accentColor, mutedColor, textColor, panelFill, inverseText } = useCsRunnerTheme();
  const trace = useMemo(buildBfsTrace, []);
  const maxStep = trace.length - 1;
  const boundedStep = Math.min(stepIndex, maxStep);
  const current = trace[boundedStep];
  const discovered = new Set(current.discovered);

  return (
    <RunnerFrame
      title="Breadth-First Search Queue Runner"
      stepIndex={boundedStep}
      maxStep={maxStep}
      playing={playing}
      setPlaying={setPlaying}
      setStepIndex={setStepIndex}
      atEnd={boundedStep === maxStep}
      delay={700}
      code={bfsCode}
      metrics={[
        { label: 'current', value: current.current ?? 'not dequeued yet' },
        { label: 'queue', value: current.queue.length ? current.queue.join(', ') : 'empty' },
        { label: 'reached', value: current.discovered.length },
      ]}
      status={current.note}
    >
      <svg viewBox="0 0 470 270" className="h-80 w-full" role="img" aria-label="Breadth-first search graph and queue state">
        {bfsEdges.map(([fromId, toId]) => {
          const from = bfsPositions[fromId];
          const to = bfsPositions[toId];
          return <line key={`${fromId}-${toId}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={mutedColor} strokeWidth="2" />;
        })}
        {bfsNodes.map((node) => {
          const position = bfsPositions[node];
          const active = current.current === node;
          const queued = current.queue.includes(node);
          const reached = discovered.has(node);
          const fill = active ? secondaryColor : queued ? accentColor : reached ? primaryColor : panelFill;
          return (
            <g key={node}>
              <circle cx={position.x} cy={position.y} r="28" fill={fill} stroke={reached || active || queued ? fill : mutedColor} strokeWidth="2.5" />
              <text x={position.x} y={position.y - 3} textAnchor="middle" fontFamily="monospace" fontSize="14" fontWeight="700" fill={reached || active || queued ? inverseText : textColor}>{node}</text>
              <text x={position.x} y={position.y + 15} textAnchor="middle" fontFamily="monospace" fontSize="10" fill={reached || active || queued ? inverseText : textColor}>
                L={current.level[node] ?? '-'}
              </text>
            </g>
          );
        })}
      </svg>
    </RunnerFrame>
  );
}

const kruskalCode = `
def kruskal(vertices, edges):
    dsu = DisjointSet(vertices)
    mst = []
    for u, v, weight in sorted(edges, key=lambda e: e.weight):
        if dsu.find(u) != dsu.find(v):
            mst.append((u, v, weight))
            dsu.union(u, v)
    return mst
`;

type MstNode = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
type MstEdge = { u: MstNode; v: MstNode; weight: number };
const mstNodes: MstNode[] = ['A', 'B', 'C', 'D', 'E', 'F'];
const mstPositions: Record<MstNode, { x: number; y: number }> = {
  A: { x: 82, y: 72 },
  B: { x: 215, y: 52 },
  C: { x: 348, y: 82 },
  D: { x: 112, y: 198 },
  E: { x: 252, y: 202 },
  F: { x: 390, y: 178 },
};
const mstEdges: MstEdge[] = [
  { u: 'A', v: 'D', weight: 1 },
  { u: 'B', v: 'C', weight: 2 },
  { u: 'A', v: 'B', weight: 3 },
  { u: 'C', v: 'D', weight: 4 },
  { u: 'C', v: 'E', weight: 5 },
  { u: 'D', v: 'E', weight: 6 },
  { u: 'E', v: 'F', weight: 7 },
  { u: 'B', v: 'F', weight: 8 },
  { u: 'A', v: 'F', weight: 9 },
];

function mstEdgeKey(edge: MstEdge) {
  return `${edge.u}-${edge.v}`;
}

type KruskalStep = {
  edge: MstEdge | null;
  added: string[];
  skipped: string[];
  components: Record<MstNode, MstNode>;
  totalWeight: number;
  note: string;
};

function buildKruskalTrace(): KruskalStep[] {
  const parent = Object.fromEntries(mstNodes.map((node) => [node, node])) as Record<MstNode, MstNode>;
  const added: string[] = [];
  const skipped: string[] = [];
  let totalWeight = 0;

  const find = (node: MstNode): MstNode => {
    if (parent[node] !== node) parent[node] = find(parent[node]);
    return parent[node];
  };
  const snapshot = () => Object.fromEntries(mstNodes.map((node) => [node, find(node)])) as Record<MstNode, MstNode>;
  const trace: KruskalStep[] = [{ edge: null, added: [], skipped: [], components: snapshot(), totalWeight, note: 'Start with every vertex in its own union-find component.' }];

  for (const edge of mstEdges) {
    const left = find(edge.u);
    const right = find(edge.v);
    if (left !== right) {
      parent[right] = left;
      added.push(mstEdgeKey(edge));
      totalWeight += edge.weight;
      trace.push({ edge, added: [...added], skipped: [...skipped], components: snapshot(), totalWeight, note: `Add ${edge.u}-${edge.v}; it connects two different components.` });
    } else {
      skipped.push(mstEdgeKey(edge));
      trace.push({ edge, added: [...added], skipped: [...skipped], components: snapshot(), totalWeight, note: `Skip ${edge.u}-${edge.v}; it would close a cycle inside one component.` });
    }
  }

  return trace;
}

export function KruskalMstRunner() {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const { primaryColor, secondaryColor, mutedColor, textColor, panelFill, inverseText } = useCsRunnerTheme();
  const trace = useMemo(buildKruskalTrace, []);
  const maxStep = trace.length - 1;
  const boundedStep = Math.min(stepIndex, maxStep);
  const current = trace[boundedStep];
  const added = new Set(current.added);
  const skipped = new Set(current.skipped);
  const activeKey = current.edge ? mstEdgeKey(current.edge) : '';

  return (
    <RunnerFrame
      title="Kruskal MST and Union-Find Runner"
      stepIndex={boundedStep}
      maxStep={maxStep}
      playing={playing}
      setPlaying={setPlaying}
      setStepIndex={setStepIndex}
      atEnd={boundedStep === maxStep}
      delay={760}
      code={kruskalCode}
      metrics={[
        { label: 'edge under test', value: current.edge ? `${current.edge.u}-${current.edge.v} (${current.edge.weight})` : 'none yet' },
        { label: 'MST edges', value: current.added.length },
        { label: 'total weight', value: current.totalWeight },
      ]}
      status={current.note}
    >
      <svg viewBox="0 0 470 270" className="h-80 w-full" role="img" aria-label="Kruskal minimum spanning tree trace">
        {mstEdges.map((edge) => {
          const from = mstPositions[edge.u];
          const to = mstPositions[edge.v];
          const key = mstEdgeKey(edge);
          const active = key === activeKey;
          const inTree = added.has(key);
          const rejected = skipped.has(key);
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2;
          return (
            <g key={key}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={active ? secondaryColor : inTree ? primaryColor : mutedColor}
                strokeWidth={active || inTree ? 4 : 2}
                strokeDasharray={rejected && !active ? '6 5' : undefined}
                opacity={rejected && !active ? 0.35 : 1}
              />
              <rect x={midX - 11} y={midY - 12} width="22" height="18" rx="4" fill={panelFill} stroke={mutedColor} strokeOpacity="0.25" />
              <text x={midX} y={midY + 2} textAnchor="middle" fontFamily="monospace" fontSize="11" fill={textColor}>{edge.weight}</text>
            </g>
          );
        })}
        {mstNodes.map((node) => {
          const position = mstPositions[node];
          const active = current.edge?.u === node || current.edge?.v === node;
          return (
            <g key={node}>
              <circle cx={position.x} cy={position.y} r="25" fill={active ? secondaryColor : primaryColor} fillOpacity={active ? 1 : 0.18} stroke={active ? secondaryColor : primaryColor} strokeWidth="2.5" />
              <text x={position.x} y={position.y + 4} textAnchor="middle" fontFamily="monospace" fontSize="14" fontWeight="700" fill={active ? inverseText : textColor}>{node}</text>
            </g>
          );
        })}
      </svg>
    </RunnerFrame>
  );
}

const fordFulkersonCode = `
def ford_fulkerson(network, source, sink):
    flow = defaultdict(int)
    while path := find_residual_path(network, flow, source, sink):
        bottleneck = min(residual_capacity(edge, flow) for edge in path)
        for edge in path:
            flow[edge] += bottleneck
            flow[edge.reverse] -= bottleneck
    return sum(flow[source, v] for v in network[source])
`;

type FlowEdge = { u: string; v: string; cap: number };
const flowPositions: Record<string, { x: number; y: number }> = {
  S: { x: 52, y: 132 },
  A: { x: 164, y: 72 },
  B: { x: 164, y: 198 },
  C: { x: 304, y: 132 },
  T: { x: 420, y: 132 },
};
const flowEdges: FlowEdge[] = [
  { u: 'S', v: 'A', cap: 10 },
  { u: 'S', v: 'B', cap: 8 },
  { u: 'A', v: 'B', cap: 3 },
  { u: 'A', v: 'C', cap: 5 },
  { u: 'B', v: 'C', cap: 4 },
  { u: 'B', v: 'T', cap: 10 },
  { u: 'C', v: 'T', cap: 7 },
];
const emptyFlow = { 'S-A': 0, 'S-B': 0, 'A-B': 0, 'A-C': 0, 'B-C': 0, 'B-T': 0, 'C-T': 0 };
const fordFulkersonSteps = [
  { path: [] as string[], bottleneck: 0, flow: { ...emptyFlow }, note: 'Start with zero flow and all original capacities available.' },
  { path: ['S-A', 'A-C', 'C-T'], bottleneck: 5, flow: { ...emptyFlow, 'S-A': 5, 'A-C': 5, 'C-T': 5 }, note: 'Augment along S-A-C-T by the bottleneck capacity 5.' },
  { path: ['S-B', 'B-T'], bottleneck: 8, flow: { ...emptyFlow, 'S-A': 5, 'S-B': 8, 'A-C': 5, 'B-T': 8, 'C-T': 5 }, note: 'Augment along S-B-T by 8.' },
  { path: ['S-A', 'A-B', 'B-T'], bottleneck: 2, flow: { ...emptyFlow, 'S-A': 7, 'S-B': 8, 'A-B': 2, 'A-C': 5, 'B-T': 10, 'C-T': 5 }, note: 'Use remaining capacity into B and out to T for 2 more units.' },
  { path: ['S-A', 'A-B', 'B-C', 'C-T'], bottleneck: 1, flow: { ...emptyFlow, 'S-A': 8, 'S-B': 8, 'A-B': 3, 'A-C': 5, 'B-C': 1, 'B-T': 10, 'C-T': 6 }, note: 'Route one final unit through B-C before A-B saturates.' },
  { path: [] as string[], bottleneck: 0, flow: { ...emptyFlow, 'S-A': 8, 'S-B': 8, 'A-B': 3, 'A-C': 5, 'B-C': 1, 'B-T': 10, 'C-T': 6 }, note: 'No residual path from S to T remains, so the flow value is maximum for this network.' },
];

export function FordFulkersonRunner() {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const { primaryColor, secondaryColor, mutedColor, textColor, panelFill, inverseText } = useCsRunnerTheme();
  const maxStep = fordFulkersonSteps.length - 1;
  const boundedStep = Math.min(stepIndex, maxStep);
  const current = fordFulkersonSteps[boundedStep];
  const path = new Set(current.path);
  const flowValue = current.flow['S-A'] + current.flow['S-B'];

  return (
    <RunnerFrame
      title="Ford-Fulkerson Augmenting Path Runner"
      stepIndex={boundedStep}
      maxStep={maxStep}
      playing={playing}
      setPlaying={setPlaying}
      setStepIndex={setStepIndex}
      atEnd={boundedStep === maxStep}
      delay={820}
      code={fordFulkersonCode}
      metrics={[
        { label: 'path', value: current.path.length ? current.path.join(', ') : 'none' },
        { label: 'bottleneck', value: current.bottleneck || '-' },
        { label: 'flow value', value: flowValue },
      ]}
      status={current.note}
    >
      <svg viewBox="0 0 470 270" className="h-80 w-full" role="img" aria-label="Ford Fulkerson flow network">
        <defs>
          <marker id="flow-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill={mutedColor} />
          </marker>
        </defs>
        {flowEdges.map((edge) => {
          const key = `${edge.u}-${edge.v}`;
          const from = flowPositions[edge.u];
          const to = flowPositions[edge.v];
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2;
          const active = path.has(key);
          const saturated = current.flow[key as keyof typeof emptyFlow] === edge.cap;
          return (
            <g key={key}>
              <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={active ? secondaryColor : saturated ? primaryColor : mutedColor} strokeWidth={active ? 4 : 2.5} markerEnd="url(#flow-arrow)" />
              <rect x={midX - 20} y={midY - 13} width="40" height="20" rx="4" fill={panelFill} stroke={mutedColor} strokeOpacity="0.25" />
              <text x={midX} y={midY + 2} textAnchor="middle" fontFamily="monospace" fontSize="11" fill={textColor}>
                {current.flow[key as keyof typeof emptyFlow]}/{edge.cap}
              </text>
            </g>
          );
        })}
        {Object.entries(flowPositions).map(([node, position]) => (
          <g key={node}>
            <circle cx={position.x} cy={position.y} r="27" fill={node === 'S' || node === 'T' ? secondaryColor : primaryColor} stroke={node === 'S' || node === 'T' ? secondaryColor : primaryColor} strokeWidth="2.5" />
            <text x={position.x} y={position.y + 5} textAnchor="middle" fontFamily="monospace" fontSize="14" fontWeight="700" fill={inverseText}>{node}</text>
          </g>
        ))}
        <text x="22" y="248" fontFamily="monospace" fontSize="12" fill={textColor}>edge labels show flow/capacity</text>
      </svg>
    </RunnerFrame>
  );
}

const reconciliationCode = `
function reconcileChildren(oldChildren, newChildren) {
  const oldByKey = new Map(oldChildren.map((child) => [child.key, child]));
  const operations = [];

  for (const child of newChildren) {
    if (oldByKey.has(child.key)) {
      operations.push({ type: 'reuse', key: child.key });
      oldByKey.delete(child.key);
    } else {
      operations.push({ type: 'insert', key: child.key });
    }
  }
  for (const removed of oldByKey.keys()) {
    operations.push({ type: 'delete', key: removed });
  }
  return operations;
}
`;

const reconciliationSteps = [
  { op: 'start', key: '-', old: ['header', 'nav', 'feed', 'ad', 'footer'], next: [], note: 'Begin with the old keyed child list.' },
  { op: 'reuse', key: 'header', old: ['nav', 'feed', 'ad', 'footer'], next: ['header'], note: 'Key header exists, so reuse its DOM node.' },
  { op: 'reuse', key: 'nav', old: ['feed', 'ad', 'footer'], next: ['header', 'nav'], note: 'Key nav also exists and stays in order.' },
  { op: 'insert', key: 'stories', old: ['feed', 'ad', 'footer'], next: ['header', 'nav', 'stories'], note: 'stories is new, so create and insert a node.' },
  { op: 'reuse', key: 'feed', old: ['ad', 'footer'], next: ['header', 'nav', 'stories', 'feed'], note: 'feed is reused after the inserted stories section.' },
  { op: 'delete', key: 'ad', old: ['footer'], next: ['header', 'nav', 'stories', 'feed'], note: 'ad is not present in the new child set, so remove it.' },
  { op: 'reuse', key: 'footer', old: [], next: ['header', 'nav', 'stories', 'feed', 'footer'], note: 'footer is reused at the end of the main layout.' },
  { op: 'insert', key: 'toast', old: [], next: ['header', 'nav', 'stories', 'feed', 'footer', 'toast'], note: 'toast is mounted as a new child.' },
  { op: 'commit', key: '-', old: [], next: ['header', 'nav', 'stories', 'feed', 'footer', 'toast'], note: 'Commit applies the queued DOM mutations.' },
];

export function ReactReconciliationRunner() {
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const { primaryColor, secondaryColor, accentColor, mutedColor } = useCsRunnerTheme();
  const maxStep = reconciliationSteps.length - 1;
  const boundedStep = Math.min(stepIndex, maxStep);
  const current = reconciliationSteps[boundedStep];

  return (
    <RunnerFrame
      title="Keyed Reconciliation Runner"
      stepIndex={boundedStep}
      maxStep={maxStep}
      playing={playing}
      setPlaying={setPlaying}
      setStepIndex={setStepIndex}
      atEnd={boundedStep === maxStep}
      delay={720}
      code={reconciliationCode}
      codeLanguage="javascript"
      metrics={[
        { label: 'operation', value: current.op },
        { label: 'key', value: current.key },
        { label: 'mounted children', value: current.next.length },
      ]}
      status={current.note}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="mb-2 text-xs font-bold uppercase">remaining old children</div>
          <div className="space-y-2">
            {current.old.map((key) => (
              <div key={key} className="rounded border px-3 py-2 text-sm" style={{ borderColor: key === current.key ? secondaryColor : mutedColor }}>{key}</div>
            ))}
            {current.old.length === 0 && <div className="rounded border border-current/20 px-3 py-2 text-sm opacity-70">none</div>}
          </div>
        </div>
        <div>
          <div className="mb-2 text-xs font-bold uppercase">new child list</div>
          <div className="space-y-2">
            {current.next.map((key) => (
              <div key={key} className="rounded border px-3 py-2 text-sm" style={{ borderColor: current.op === 'insert' && key === current.key ? accentColor : key === current.key ? secondaryColor : primaryColor }}>{key}</div>
            ))}
            {current.next.length === 0 && <div className="rounded border border-current/20 px-3 py-2 text-sm opacity-70">waiting</div>}
          </div>
        </div>
      </div>
    </RunnerFrame>
  );
}
