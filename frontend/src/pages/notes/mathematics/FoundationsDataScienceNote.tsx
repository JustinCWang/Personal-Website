/**
 * Foundations of Data Science Notes Page
 * A standalone note for probability, modeling, clustering, dimensionality reduction, graph mining, learning, evaluation, and rank aggregation.
 */

import { useMemo, useState, type ReactNode } from 'react';
import { NotesLayout } from '../../../components/notes/NotesLayout';
import {
  AlgorithmBlock,
  InlineMath,
  InteractiveBlock,
  NoteHeader,
  NoteParagraph,
  NoteSectionTitle,
  NoteTopicBlock,
  NoteTopicGroup,
} from '../../../components/notes';
import { useDarkMode } from '../../../hooks/useDarkMode';

type TableRow = ReactNode[];

function useDataScienceTheme() {
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
  const primaryColor = isDarkMode ? '#4ade80' : '#2563eb';
  const secondaryColor = isDarkMode ? '#fb923c' : '#ea580c';
  const mutedColor = isDarkMode ? '#86efac66' : '#94a3b8';
  const textColor = isDarkMode ? '#bbf7d0' : '#334155';
  const panelFill = isDarkMode ? '#052e16' : '#f8fafc';

  return {
    subtlePanelClass,
    listClass,
    tableClass,
    tableHeadClass,
    tableCellClass,
    primaryColor,
    secondaryColor,
    mutedColor,
    textColor,
    panelFill,
  };
}

function BulletList({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { listClass } = useDataScienceTheme();
  return <ul className={`${listClass} ${className}`}>{children}</ul>;
}

function NoteTable({ headers, rows }: { headers: ReactNode[]; rows: TableRow[] }) {
  const { tableClass, tableHeadClass, tableCellClass } = useDataScienceTheme();

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

function DataScienceNotationGuide() {
  return (
    <NoteTopicGroup>
      <NoteTopicBlock title="Notation Used Throughout">
        <BulletList className="mb-0">
          <li><InlineMath math={'X'} /> may mean a random variable or a feature matrix; the local section will say which one.</li>
          <li><InlineMath math={'x_i'} /> means one data point, usually row <InlineMath math={'i'} /> of a dataset.</li>
          <li><InlineMath math={'y_i'} /> or <InlineMath math={'y_{gt}'} /> means a ground-truth label or response.</li>
          <li><InlineMath math={'\\theta'} /> names model parameters; fitting a model means estimating <InlineMath math={'\\theta'} /> from data.</li>
          <li><InlineMath math={'L(\\theta)'} /> is likelihood; <InlineMath math={'LL(\\theta)'} /> is log-likelihood.</li>
          <li><InlineMath math={'\\pi_j'} /> is the prior probability or mixture weight for component <InlineMath math={'j'} />.</li>
          <li><InlineMath math={'\\gamma_{ij}'} /> is the responsibility of component <InlineMath math={'j'} /> for point <InlineMath math={'i'} />.</li>
          <li><InlineMath math={'\\mu'} /> means mean, <InlineMath math={'\\sigma^2'} /> means variance, and <InlineMath math={'\\lambda'} /> often means rate.</li>
          <li><InlineMath math={'M'} /> often means a Markov transition matrix; <InlineMath math={'\\pi'} /> can also mean a stationary distribution.</li>
          <li><InlineMath math={'k'} /> is overloaded: clusters, dimensions, folds, or top items depending on context.</li>
        </BulletList>
      </NoteTopicBlock>
    </NoteTopicGroup>
  );
}

type BayesFeature = 'green' | 'dark' | 'soft' | 'hard';

function BayesClassifierExplorer() {
  const { subtlePanelClass } = useDataScienceTheme();
  const [feature, setFeature] = useState<BayesFeature>('soft');
  const priorGood = 0.6;
  const likelihoods: Record<BayesFeature, { label: string; good: number; bad: number }> = {
    green: { label: 'color = green', good: 0.7, bad: 0.25 },
    dark: { label: 'color = dark', good: 0.3, bad: 0.75 },
    soft: { label: 'softness = soft', good: 0.8, bad: 0.3 },
    hard: { label: 'softness = hard', good: 0.2, bad: 0.7 },
  };
  const current = likelihoods[feature];
  const goodNumerator = current.good * priorGood;
  const badNumerator = current.bad * (1 - priorGood);
  const normalizer = goodNumerator + badNumerator;
  const posteriorGood = goodNumerator / normalizer;
  const posteriorBad = badNumerator / normalizer;

  return (
    <InteractiveBlock title="Bayes Normalization">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(250px,340px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 block text-sm font-bold" htmlFor="bayes-feature">Observed feature</label>
          <select
            id="bayes-feature"
            value={feature}
            onChange={(event) => setFeature(event.target.value as BayesFeature)}
            className="w-full rounded border border-current/20 bg-transparent p-2 text-sm"
          >
            {Object.entries(likelihoods).map(([key, value]) => (
              <option key={key} value={key}>{value.label}</option>
            ))}
          </select>
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <NoteTable
            headers={['quantity', 'value']}
            rows={[
              [<InlineMath math={'P(Good)'} />, priorGood.toFixed(2)],
              [<InlineMath math={'P(feature\\mid Good)'} />, current.good.toFixed(2)],
              [<InlineMath math={'P(feature\\mid Bad)'} />, current.bad.toFixed(2)],
              ['good numerator', goodNumerator.toFixed(3)],
              ['bad numerator', badNumerator.toFixed(3)],
              [<InlineMath math={'P(Good\\mid feature)'} />, posteriorGood.toFixed(3)],
              [<InlineMath math={'P(Bad\\mid feature)'} />, posteriorBad.toFixed(3)],
            ]}
          />
          <NoteParagraph className="mb-0 text-sm">
            Bayes classifiers compute one numerator per class, then normalize so the posterior probabilities sum to one.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function DistributionExplorer() {
  return (
    <NoteTable
      headers={['Distribution', 'Question it answers', 'Support']}
      rows={[
        ['Bernoulli', 'Did one binary trial succeed?', <InlineMath math="0\\text{ or }1" />],
        ['Binomial', 'How many successes occur in n independent trials?', <InlineMath math="0,1,\dots,n" />],
        ['Geometric', 'How many trials until the first success?', <InlineMath math="1,2,3,\dots" />],
        ['Poisson', 'How many events occur in a fixed interval?', <InlineMath math="0,1,2,\dots" />],
        ['Exponential', 'How long until the next event?', <InlineMath math="x\ge 0" />],
        ['Gaussian', 'What value comes from many small additive effects?', 'all real numbers'],
      ]}
    />
  );
}

function MleExplorer() {
  const { subtlePanelClass } = useDataScienceTheme();
  const [successes, setSuccesses] = useState(30);
  const [trials, setTrials] = useState(100);
  const safeSuccesses = Math.min(successes, trials);
  const pHat = safeSuccesses / trials;
  const logLikelihood =
    safeSuccesses * Math.log(Math.max(pHat, 1e-9)) + (trials - safeSuccesses) * Math.log(Math.max(1 - pHat, 1e-9));

  return (
    <InteractiveBlock title="Bernoulli MLE">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(250px,340px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 block text-sm font-bold" htmlFor="mle-trials">Trials: {trials}</label>
          <input
            id="mle-trials"
            type="range"
            min="10"
            max="200"
            value={trials}
            onChange={(event) => setTrials(Number(event.target.value))}
            className="mb-4 w-full"
          />
          <label className="mb-2 block text-sm font-bold" htmlFor="mle-successes">Successes: {safeSuccesses}</label>
          <input
            id="mle-successes"
            type="range"
            min="0"
            max={trials}
            value={safeSuccesses}
            onChange={(event) => setSuccesses(Number(event.target.value))}
            className="w-full"
          />
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <NoteTable
            headers={['quantity', 'value']}
            rows={[
              ['data', `${safeSuccesses} successes in ${trials} trials`],
              [<InlineMath math={'\\hat{p}_{MLE}'} />, pHat.toFixed(3)],
              ['log-likelihood at MLE', logLikelihood.toFixed(3)],
              ['intuition', 'The MLE for a Bernoulli success probability is the observed success frequency.'],
            ]}
          />
        </div>
      </div>
    </InteractiveBlock>
  );
}

function EMResponsibilityExplorer() {
  const { subtlePanelClass } = useDataScienceTheme();
  const [x, setX] = useState(2);
  const components = [
    { name: 'component 1', prior: 0.45, mean: 0, variance: 1.2 },
    { name: 'component 2', prior: 0.55, mean: 4, variance: 1.6 },
  ];
  const densities = components.map((component) => {
    const coefficient = 1 / Math.sqrt(2 * Math.PI * component.variance);
    const exponent = Math.exp(-((x - component.mean) ** 2) / (2 * component.variance));
    return coefficient * exponent;
  });
  const numerators = densities.map((density, index) => density * components[index].prior);
  const total = numerators.reduce((sum, value) => sum + value, 0);
  const gammas = numerators.map((value) => value / total);

  return (
    <InteractiveBlock title="EM Responsibilities">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(250px,340px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 block text-sm font-bold" htmlFor="em-point">Point x: {x.toFixed(1)}</label>
          <input
            id="em-point"
            type="range"
            min="-2"
            max="6"
            step="0.1"
            value={x}
            onChange={(event) => setX(Number(event.target.value))}
            className="w-full"
          />
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <NoteTable
            headers={['component', 'prior', 'mean', 'variance', 'responsibility']}
            rows={components.map((component, index) => [
              component.name,
              component.prior.toFixed(2),
              component.mean,
              component.variance,
              gammas[index].toFixed(3),
            ])}
          />
          <NoteParagraph className="mb-0 text-sm">
            The E-step computes a probability distribution over hidden components for each observed point.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

const kmeansPoints = [0, 1, 2, 7, 8, 9];

function KMeansExplorer() {
  const { subtlePanelClass } = useDataScienceTheme();
  const [leftCenter, setLeftCenter] = useState(1);
  const [rightCenter, setRightCenter] = useState(8);
  const assignments = kmeansPoints.map((point) => (Math.abs(point - leftCenter) <= Math.abs(point - rightCenter) ? 0 : 1));
  const leftPoints = kmeansPoints.filter((_, index) => assignments[index] === 0);
  const rightPoints = kmeansPoints.filter((_, index) => assignments[index] === 1);
  const mean = (values: number[], fallback: number) =>
    values.length === 0 ? fallback : values.reduce((sum, value) => sum + value, 0) / values.length;
  const updatedLeft = mean(leftPoints, leftCenter);
  const updatedRight = mean(rightPoints, rightCenter);

  return (
    <InteractiveBlock title="One KMeans Iteration">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(250px,340px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 block text-sm font-bold" htmlFor="left-center">Center 1: {leftCenter.toFixed(1)}</label>
          <input
            id="left-center"
            type="range"
            min="-1"
            max="5"
            step="0.1"
            value={leftCenter}
            onChange={(event) => setLeftCenter(Number(event.target.value))}
            className="mb-4 w-full"
          />
          <label className="mb-2 block text-sm font-bold" htmlFor="right-center">Center 2: {rightCenter.toFixed(1)}</label>
          <input
            id="right-center"
            type="range"
            min="4"
            max="10"
            step="0.1"
            value={rightCenter}
            onChange={(event) => setRightCenter(Number(event.target.value))}
            className="w-full"
          />
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <NoteTable
            headers={['cluster', 'assigned points', 'updated center']}
            rows={[
              ['1', leftPoints.join(', ') || 'empty', updatedLeft.toFixed(2)],
              ['2', rightPoints.join(', ') || 'empty', updatedRight.toFixed(2)],
            ]}
          />
          <NoteParagraph className="mb-0 text-sm">
            KMeans alternates hard assignment to the nearest center and center update to the assigned mean.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function MetricExplorer() {
  return (
    <NoteTable
      headers={['Metric', 'Example', 'Best use']}
      rows={[
        ['Euclidean', '(1, 2) and (4, 6) have distance 5', 'Numeric points where straight-line distance is meaningful.'],
        ['Hamming', '10110 and 10011 differ in 2 positions', 'Equal-length strings or binary feature vectors.'],
        ['Jaccard', '{a,b,c} and {b,c,d,e} have distance 1 - 2/5', 'Sets, tags, shingles, or unordered sparse features.'],
        ['Edit distance', 'cat and cut have distance 1', 'Strings where insertions, deletions, and substitutions matter.'],
        ['Dynamic time warping', '[1,2,3] and [1,1,2,3] align after time stretching', 'Time series that may be stretched or shifted in time.'],
      ]}
    />
  );
}

function SvdEnergyExplorer() {
  const { subtlePanelClass } = useDataScienceTheme();
  const [k, setK] = useState(2);
  const singularValues = [9, 4, 2, 1];
  const totalEnergy = singularValues.reduce((sum, value) => sum + value ** 2, 0);
  const keptEnergy = singularValues.slice(0, k).reduce((sum, value) => sum + value ** 2, 0);
  const retained = keptEnergy / totalEnergy;

  return (
    <InteractiveBlock title="SVD Truncation">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(250px,340px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 block text-sm font-bold" htmlFor="svd-k">Kept singular values: {k}</label>
          <input
            id="svd-k"
            type="range"
            min="1"
            max={singularValues.length}
            value={k}
            onChange={(event) => setK(Number(event.target.value))}
            className="w-full"
          />
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <NoteTable
            headers={['quantity', 'value']}
            rows={[
              ['singular values', singularValues.join(', ')],
              ['kept values', singularValues.slice(0, k).join(', ')],
              ['retained squared energy', `${(retained * 100).toFixed(1)}%`],
              ['reconstruction intuition', 'Keeping larger singular values preserves the strongest directions in the data.'],
            ]}
          />
        </div>
      </div>
    </InteractiveBlock>
  );
}

function PageRankExplorer() {
  const { subtlePanelClass } = useDataScienceTheme();
  const [alpha, setAlpha] = useState(0.85);
  const ranks = useMemo(() => {
    const linkMatrix = [
      [0, 0.5, 0.5],
      [1, 0, 0],
      [1, 0, 0],
    ];
    let vector = [1 / 3, 1 / 3, 1 / 3];
    for (let iteration = 0; iteration < 20; iteration += 1) {
      const next = [0, 0, 0];
      for (let i = 0; i < 3; i += 1) {
        for (let j = 0; j < 3; j += 1) {
          next[j] += alpha * vector[i] * linkMatrix[i][j];
        }
      }
      const teleport = (1 - next.reduce((sum, value) => sum + value, 0)) / 3;
      vector = next.map((value) => value + teleport);
    }
    return vector;
  }, [alpha]);

  return (
    <InteractiveBlock title="PageRank Power Iteration">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(250px,340px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 block text-sm font-bold" htmlFor="pagerank-alpha">Damping alpha: {alpha.toFixed(2)}</label>
          <input
            id="pagerank-alpha"
            type="range"
            min="0.5"
            max="0.95"
            step="0.01"
            value={alpha}
            onChange={(event) => setAlpha(Number(event.target.value))}
            className="w-full"
          />
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <NoteTable
            headers={['page', 'rank after iteration']}
            rows={[
              ['A', ranks[0].toFixed(3)],
              ['B', ranks[1].toFixed(3)],
              ['C', ranks[2].toFixed(3)],
            ]}
          />
          <NoteParagraph className="mb-0 text-sm">
            PageRank is the stationary distribution of a random walk with teleportation.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

const gradientStart = -2;

function GradientDescentExplorer() {
  const { subtlePanelClass } = useDataScienceTheme();
  const [learningRate, setLearningRate] = useState(0.2);
  const [steps, setSteps] = useState(6);
  const theta = useMemo(() => {
    let value = gradientStart;
    for (let i = 0; i < steps; i += 1) {
      const gradient = 2 * (value - 3);
      value -= learningRate * gradient;
    }
    return value;
  }, [learningRate, steps]);
  const loss = (theta - 3) ** 2;

  return (
    <InteractiveBlock title="Gradient Descent on a Quadratic">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(250px,340px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 block text-sm font-bold" htmlFor="gd-rate">Learning rate: {learningRate.toFixed(2)}</label>
          <input
            id="gd-rate"
            type="range"
            min="0.02"
            max="0.6"
            step="0.01"
            value={learningRate}
            onChange={(event) => setLearningRate(Number(event.target.value))}
            className="mb-4 w-full"
          />
          <label className="mb-2 block text-sm font-bold" htmlFor="gd-steps">Steps: {steps}</label>
          <input
            id="gd-steps"
            type="range"
            min="1"
            max="20"
            value={steps}
            onChange={(event) => setSteps(Number(event.target.value))}
            className="w-full"
          />
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <NoteTable
            headers={['quantity', 'value']}
            rows={[
              ['objective', <InlineMath math={'f(\\theta)=(\\theta-3)^2'} />],
              ['start', gradientStart],
              ['current theta', theta.toFixed(3)],
              ['current loss', loss.toFixed(4)],
              ['update rule', <InlineMath math={'\\theta \\leftarrow \\theta - \\eta \\nabla f(\\theta)'} />],
            ]}
          />
        </div>
      </div>
    </InteractiveBlock>
  );
}

function EvaluationExplorer() {
  const { subtlePanelClass } = useDataScienceTheme();
  const [threshold, setThreshold] = useState(0.5);
  const examples = [
    { score: 0.95, label: 1 },
    { score: 0.81, label: 1 },
    { score: 0.72, label: 0 },
    { score: 0.62, label: 1 },
    { score: 0.41, label: 0 },
    { score: 0.35, label: 1 },
    { score: 0.2, label: 0 },
    { score: 0.1, label: 0 },
  ];
  const counts = examples.reduce(
    (acc, example) => {
      const predicted = example.score >= threshold ? 1 : 0;
      if (predicted === 1 && example.label === 1) acc.tp += 1;
      if (predicted === 1 && example.label === 0) acc.fp += 1;
      if (predicted === 0 && example.label === 0) acc.tn += 1;
      if (predicted === 0 && example.label === 1) acc.fn += 1;
      return acc;
    },
    { tp: 0, fp: 0, tn: 0, fn: 0 },
  );
  const accuracy = (counts.tp + counts.tn) / examples.length;
  const precision = counts.tp + counts.fp === 0 ? 0 : counts.tp / (counts.tp + counts.fp);
  const recall = counts.tp + counts.fn === 0 ? 0 : counts.tp / (counts.tp + counts.fn);
  const f1 = precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);

  return (
    <InteractiveBlock title="Threshold Metrics">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(250px,340px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 block text-sm font-bold" htmlFor="eval-threshold">Threshold: {threshold.toFixed(2)}</label>
          <input
            id="eval-threshold"
            type="range"
            min="0.05"
            max="0.95"
            step="0.05"
            value={threshold}
            onChange={(event) => setThreshold(Number(event.target.value))}
            className="w-full"
          />
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <NoteTable
            headers={['metric', 'value']}
            rows={[
              ['TP / FP / TN / FN', `${counts.tp} / ${counts.fp} / ${counts.tn} / ${counts.fn}`],
              ['accuracy', accuracy.toFixed(3)],
              ['precision', precision.toFixed(3)],
              ['recall', recall.toFixed(3)],
              ['F1', f1.toFixed(3)],
            ]}
          />
          <NoteParagraph className="mb-0 text-sm">
            Raising the threshold usually improves precision and hurts recall; lowering it usually does the opposite.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

type RankMethod = 'plurality' | 'borda' | 'pairwise';

const sampleRankings = [
  ['A', 'B', 'C'],
  ['B', 'C', 'A'],
  ['C', 'A', 'B'],
  ['A', 'C', 'B'],
];

function RankAggregationExplorer() {
  const { subtlePanelClass } = useDataScienceTheme();
  const [method, setMethod] = useState<RankMethod>('borda');
  const scores = useMemo(() => {
    const totals: Record<string, number> = { A: 0, B: 0, C: 0 };
    if (method === 'plurality') {
      sampleRankings.forEach((ranking) => {
        totals[ranking[0]] += 1;
      });
    } else if (method === 'borda') {
      sampleRankings.forEach((ranking) => {
        ranking.forEach((candidate, index) => {
          totals[candidate] += 2 - index;
        });
      });
    } else {
      const candidates = ['A', 'B', 'C'];
      candidates.forEach((candidate) => {
        candidates
          .filter((other) => other !== candidate)
          .forEach((other) => {
            const wins = sampleRankings.filter((ranking) => ranking.indexOf(candidate) < ranking.indexOf(other)).length;
            if (wins > sampleRankings.length / 2) totals[candidate] += 1;
          });
      });
    }
    return totals;
  }, [method]);
  const winner = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];

  return (
    <InteractiveBlock title="Rank Aggregation">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(250px,340px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 block text-sm font-bold" htmlFor="rank-method">Method</label>
          <select
            id="rank-method"
            value={method}
            onChange={(event) => setMethod(event.target.value as RankMethod)}
            className="mb-4 w-full rounded border border-current/20 bg-transparent p-2 text-sm"
          >
            <option value="plurality">plurality</option>
            <option value="borda">Borda count</option>
            <option value="pairwise">pairwise wins</option>
          </select>
          <ol className="mb-0 space-y-2 text-sm">
            {sampleRankings.map((ranking, index) => (
              <li key={index} className="rounded border border-current/20 px-3 py-2">
                <strong>ranker {index + 1}:</strong> {ranking.join(' > ')}
              </li>
            ))}
          </ol>
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <NoteTable
            headers={['candidate', 'score']}
            rows={Object.entries(scores).map(([candidate, score]) => [candidate, score])}
          />
          <NoteParagraph className="mb-0 text-sm">
            Winner under this method: <strong>{winner}</strong>. Different aggregation rules can choose different winners.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

export default function FoundationsDataScienceNote() {
  return (
    <NotesLayout>
      <NoteHeader
        title="Foundations of Data Science"
        subtitle="Use probability, statistics, optimization, linear algebra, graphs, and evaluation to find useful structure in data."
      />

      <DataScienceNotationGuide />

      <NoteSectionTitle id="foundations-of-data-science-overview">1. Foundations of Data Science Overview</NoteSectionTitle>
      <NoteParagraph>
        Data science is the practice of extracting structure, patterns, predictions, rankings, and useful summaries from data. The central sequence is to
        represent objects with features, choose a comparison or model, fit that model, and evaluate whether it generalizes.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Core Questions">
          <BulletList className="mb-0">
            <li>What are the objects?</li>
            <li>Which features describe them?</li>
            <li>How should similarity or distance be defined?</li>
            <li>What distribution, cluster structure, graph structure, or predictive model could explain the data?</li>
            <li>How do we know whether the result is useful rather than just fitted to noise?</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="data-science-features-and-datasets">2. Data Science, Features, and Datasets</NoteSectionTitle>
      <NoteParagraph>
        A dataset is a collection of examples. A feature is a measurable or encoded property of an example. Feature choice matters because models only see
        the representation we give them.
      </NoteParagraph>
      <NoteTable
        headers={['feature type', 'meaning', 'example']}
        rows={[
          ['nominal', 'Categories with no inherent order.', 'eye color, browser type'],
          ['ordinal', 'Categories with meaningful order.', 'low, medium, high'],
          ['numerical', 'Quantitative values.', 'age, price, temperature'],
          ['discrete', 'Countable values.', 'number of clicks'],
          ['continuous', 'Values over intervals.', 'height, time, probability score'],
          ['hierarchical', 'Values arranged in a taxonomy.', 'species, product category'],
        ]}
      />
      <NoteParagraph>
        Different data modalities need different representations: tabular rows, images as pixel grids, sequences as ordered values, and graphs as vertices
        plus edges.
      </NoteParagraph>

      <NoteSectionTitle id="probability-basics">3. Probability Basics</NoteSectionTitle>
      <NoteParagraph>
        A random experiment is a process with uncertain outcome. The sample space <InlineMath math={'\\Omega'} /> is the set of all possible outcomes. An
        event is a subset of <InlineMath math={'\\Omega'} />.
      </NoteParagraph>
      <NoteTable
        headers={['probability axiom', 'meaning']}
        rows={[
          [<InlineMath math={'P(A) \\ge 0'} />, 'Every event has nonnegative probability.'],
          [<InlineMath math={'P(\\Omega)=1'} />, 'The full sample space has probability one.'],
          [<InlineMath math={'P(A\\cup B)=P(A)+P(B)'} />, 'Disjoint events add.'],
        ]}
      />

      <NoteSectionTitle id="conditional-probability-independence-and-bayes-rule">4. Conditional Probability, Independence, and Bayes Rule</NoteSectionTitle>
      <NoteParagraph>
        Conditional probability updates the probability of <InlineMath math={'A'} /> after learning <InlineMath math={'B'} /> occurred:
        <InlineMath math={'P(A\\mid B)=P(A\\cap B)/P(B)'} /> when <InlineMath math={'P(B)>0'} />.
      </NoteParagraph>
      <BayesClassifierExplorer />
      <NoteTopicGroup>
        <NoteTopicBlock title="Key Identities">
          <BulletList className="mb-0">
            <li><InlineMath math={'P(A\\cap B)=P(A\\mid B)P(B)'} /></li>
            <li><InlineMath math={'A'} /> and <InlineMath math={'B'} /> are independent when <InlineMath math={'P(A\\cap B)=P(A)P(B)'} />.</li>
            <li>Total probability: <InlineMath math={'P(A)=\\sum_i P(A\\mid B_i)P(B_i)'} /> for a partition <InlineMath math={'B_1,\\ldots,B_n'} />.</li>
            <li>Bayes rule: <InlineMath math={'P(A\\mid B)=P(B\\mid A)P(A)/P(B)'} />.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="random-variables-pmfs-pdfs-and-cdfs">5. Random Variables, PMFs, PDFs, and CDFs</NoteSectionTitle>
      <NoteParagraph>
        A random variable is a function from outcomes to values. An event like <InlineMath math={'X=3'} /> is the subset of outcomes where the random
        variable takes value 3.
      </NoteParagraph>
      <NoteTable
        headers={['object', 'used for', 'definition']}
        rows={[
          ['PMF', 'discrete random variables', <InlineMath math={'p_X(x)=P(X=x)'} />],
          ['PDF', 'continuous random variables', <InlineMath math={'P(a\\le X\\le b)=\\int_a^b f_X(x)dx'} />],
          ['CDF', 'discrete or continuous variables', <InlineMath math={'F_X(x)=P(X\\le x)'} />],
        ]}
      />
      <NoteParagraph>
        A density value is not the probability of a single point. Continuous probabilities come from integrating over intervals.
      </NoteParagraph>

      <NoteSectionTitle id="common-distributions">6. Common Distributions</NoteSectionTitle>
      <NoteParagraph>
        A distribution family encodes a recurring kind of uncertainty. Choosing a distribution is choosing a story about how data might be generated.
      </NoteParagraph>
      <DistributionExplorer />

      <NoteSectionTitle id="expectation-variance-and-probability-bounds">7. Expectation, Variance, and Probability Bounds</NoteSectionTitle>
      <NoteParagraph>
        Expected value is the long-run average. Variance measures spread around the mean. Probability inequalities give useful bounds when exact
        probabilities are hard to compute.
      </NoteParagraph>
      <NoteTable
        headers={['concept', 'formula', 'note']}
        rows={[
          ['expectation', <InlineMath math={'E[X]=\\sum_x xP(X=x)'} />, 'Discrete form. Continuous form uses an integral.'],
          ['linearity', <InlineMath math={'E[aX+bY]=aE[X]+bE[Y]'} />, 'Does not require independence.'],
          ['variance', <InlineMath math={'Var(X)=E[X^2]-E[X]^2'} />, 'Spread in squared units.'],
          ['Markov', <InlineMath math={'P(X\\ge a)\\le E[X]/a'} />, 'Requires nonnegative X.'],
          ['Chebyshev', <InlineMath math={'P(|X-\\mu|\\ge k)\\le Var(X)/k^2'} />, 'Uses mean and variance only.'],
        ]}
      />

      <NoteSectionTitle id="maximum-likelihood-estimation">8. Maximum Likelihood Estimation</NoteSectionTitle>
      <NoteParagraph>
        Maximum likelihood estimation chooses the parameter values that make the observed data most likely. If samples are independent and identically
        distributed, the likelihood factors as a product.
      </NoteParagraph>
      <MleExplorer />
      <NoteTable
        headers={['step', 'MLE calculation']}
        rows={[
          ['1', 'Write the likelihood.'],
          ['2', 'Use the i.i.d. assumption to factor the joint probability.'],
          ['3', 'Take logs to turn products into sums.'],
          ['4', 'Differentiate with respect to parameters.'],
          ['5', 'Set derivative equal to zero and solve.'],
          ['6', 'Check the result is a maximum or compare boundary cases.'],
        ]}
      />

      <NoteSectionTitle id="gaussian-models">9. Gaussian Models</NoteSectionTitle>
      <NoteParagraph>
        A Gaussian model uses a mean <InlineMath math={'\\mu'} /> and variance <InlineMath math={'\\sigma^2'} />. It is common because sums of many small
        independent effects often become approximately Gaussian.
      </NoteParagraph>
      <NoteTable
        headers={['parameter', 'MLE estimate']}
        rows={[
          [<InlineMath math={'\\mu'} />, <InlineMath math={'\\hat{\\mu}=\\frac{1}{n}\\sum_i x_i'} />],
          [<InlineMath math={'\\sigma^2'} />, <InlineMath math={'\\hat{\\sigma}^2=\\frac{1}{n}\\sum_i (x_i-\\hat{\\mu})^2'} />],
        ]}
      />

      <NoteSectionTitle id="expectation-maximization">10. Expectation Maximization</NoteSectionTitle>
      <NoteParagraph>
        Expectation Maximization, or EM, solves problems with hidden labels. If labels were known, parameter estimation would be easy. If parameters were
        known, label estimation would be easy. EM alternates between those two easier problems.
      </NoteParagraph>
      <EMResponsibilityExplorer />
      <NoteTopicGroup>
        <NoteTopicBlock title="EM Loop">
          <BulletList className="mb-0">
            <li>Initialize parameters.</li>
            <li>E-step: estimate soft assignments or responsibilities.</li>
            <li>M-step: re-estimate parameters using those responsibilities.</li>
            <li>Repeat until likelihood stops improving meaningfully.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="gaussian-mixture-models">11. Gaussian Mixture Models</NoteSectionTitle>
      <NoteParagraph>
        A Gaussian Mixture Model assumes each point came from one of several Gaussian components. The component identity is hidden, so the E-step computes
        responsibilities and the M-step computes weighted Gaussian parameter estimates.
      </NoteParagraph>
      <NoteTable
        headers={['quantity', 'update']}
        rows={[
          [<InlineMath math={'\\pi_j'} />, <InlineMath math={'\\frac{1}{n}\\sum_i \\gamma_{ij}'} />],
          [<InlineMath math={'\\mu_j'} />, <InlineMath math={'\\frac{\\sum_i \\gamma_{ij}x_i}{\\sum_i \\gamma_{ij}}'} />],
          [<InlineMath math={'\\sigma_j^2'} />, <InlineMath math={'\\frac{\\sum_i \\gamma_{ij}(x_i-\\mu_j)^2}{\\sum_i \\gamma_{ij}}'} />],
        ]}
      />

      <NoteSectionTitle id="hard-clustering-and-kmeans">12. Hard Clustering and KMeans</NoteSectionTitle>
      <NoteParagraph>
        Clustering groups points without ground-truth labels. KMeans is a hard-clustering algorithm: each point belongs to exactly one cluster. It is also
        interpretable as a hard version of EM.
      </NoteParagraph>
      <KMeansExplorer />

      <NoteSectionTitle id="dbscan">13. DBSCAN</NoteSectionTitle>
      <NoteParagraph>
        DBSCAN clusters points by density instead of assigning every point to the nearest center. It uses a radius <InlineMath math={'\\epsilon'} /> and a
        minimum neighbor count.
      </NoteParagraph>
      <NoteTable
        headers={['point type', 'meaning']}
        rows={[
          ['core point', 'Has at least minPts neighbors within epsilon.'],
          ['border point', 'Not core, but reachable from a core point.'],
          ['noise point', 'Neither core nor border.'],
          ['density-reachable', 'Can be reached through a chain of dense neighborhoods.'],
        ]}
      />
      <NoteParagraph>
        DBSCAN can find non-spherical clusters and mark outliers, but it is sensitive to the distance metric and density parameters.
      </NoteParagraph>

      <NoteSectionTitle id="dimensionality-reduction-overview">14. Dimensionality Reduction Overview</NoteSectionTitle>
      <NoteParagraph>
        Dimensionality reduction maps data from many features to fewer features while trying to preserve important information. It can improve
        visualization, reduce noise, speed up algorithms, and help detect structure.
      </NoteParagraph>
      <NoteTable
        headers={['reason', 'meaning']}
        rows={[
          ['visualization', 'Map high-dimensional data into 2D or 3D.'],
          ['compression', 'Represent data with fewer numbers.'],
          ['noise reduction', 'Remove weak or redundant directions.'],
          ['speed', 'Reduce the cost of distance computations and model fitting.'],
          ['regularization', 'Reduce overfitting by simplifying representation.'],
        ]}
      />

      <NoteSectionTitle id="random-projection-and-johnson-lindenstrauss">15. Random Projection and Johnson-Lindenstrauss</NoteSectionTitle>
      <NoteParagraph>
        Random projection multiplies data by a random matrix to reduce dimension. The Johnson-Lindenstrauss idea says that with enough projected
        dimensions, pairwise distances can be approximately preserved with high probability.
      </NoteParagraph>
      <NoteTable
        headers={['symbol', 'meaning']}
        rows={[
          [<InlineMath math={'X'} />, 'Original data matrix.'],
          [<InlineMath math={'A'} />, 'Random projection matrix.'],
          [<InlineMath math={'\\hat{X}=XA'} />, 'Projected data.'],
          [<InlineMath math={'\\epsilon'} />, 'Allowed distance distortion.'],
          [<InlineMath math={'(1-\\epsilon)d(x,y)\\le d(f(x),f(y))\\le(1+\\epsilon)d(x,y)'} />, 'Distance preservation check.'],
        ]}
      />

      <NoteSectionTitle id="linear-algebra-refresher">16. Linear Algebra Refresher</NoteSectionTitle>
      <NoteParagraph>
        Data science uses vectors for points, matrices for datasets and graphs, norms for size, dot products for alignment, and matrix factorizations for
        structure.
      </NoteParagraph>
      <NoteTable
        headers={['object', 'data science role']}
        rows={[
          ['vector', 'One point, one parameter vector, or one embedding.'],
          ['matrix', 'Feature matrix, adjacency matrix, transition matrix, or image.'],
          ['norm', 'Magnitude or reconstruction error.'],
          ['dot product', 'Similarity, projection, or linear prediction.'],
          ['pseudoinverse', 'Least-squares solution for linear regression.'],
        ]}
      />

      <NoteSectionTitle id="singular-value-decomposition">17. Singular Value Decomposition</NoteSectionTitle>
      <NoteParagraph>
        Singular Value Decomposition factors a matrix as <InlineMath math={'X=U\\Sigma V^T'} />. The singular values in <InlineMath math={'\\Sigma'} />
        rank directions by information strength.
      </NoteParagraph>
      <SvdEnergyExplorer />

      <NoteSectionTitle id="svd-reconstruction-and-outlier-detection">18. SVD Reconstruction and Outlier Detection</NoteSectionTitle>
      <NoteParagraph>
        Truncated SVD reconstructs data using only the top <InlineMath math={'k'} /> singular values. Points with unusually high reconstruction error may
        be outliers because the low-rank structure does not explain them well.
      </NoteParagraph>
      <NoteTable
        headers={['step', 'outlier detection calculation']}
        rows={[
          ['1', 'Compute SVD of the data matrix.'],
          ['2', 'Keep the top k singular values and zero out the rest.'],
          ['3', 'Reconstruct the data matrix.'],
          ['4', 'Compute each row reconstruction error.'],
          ['5', 'Convert errors to z-scores.'],
          ['6', 'Flag examples with large absolute z-score.'],
        ]}
      />

      <NoteSectionTitle id="distances-and-metrics">19. Distances and Metrics</NoteSectionTitle>
      <NoteParagraph>
        A distance function compares objects. A true metric is nonnegative, zero only for identical objects, symmetric, and satisfies the triangle
        inequality.
      </NoteParagraph>
      <MetricExplorer />

      <NoteSectionTitle id="hamming-jaccard-edit-distance-and-dynamic-time-warping">20. Hamming, Jaccard, Edit Distance, and Dynamic Time Warping</NoteSectionTitle>
      <NoteParagraph>
        Different modalities need different comparison rules. Equal-length binary strings, sets, variable-length strings, and time series should not all
        be compared the same way.
      </NoteParagraph>
      <NoteTable
        headers={['distance', 'compares', 'core idea']}
        rows={[
          ['Hamming', 'equal-length strings', 'Count positions where symbols differ.'],
          ['Jaccard', 'sets', 'One minus intersection-over-union.'],
          ['Edit distance', 'strings', 'Minimum insertions, deletions, and substitutions.'],
          ['Dynamic time warping', 'time series', 'Minimum-cost alignment that can stretch time.'],
        ]}
      />

      <NoteSectionTitle id="hierarchical-clustering">21. Hierarchical Clustering</NoteSectionTitle>
      <NoteParagraph>
        Hierarchical clustering builds a nested tree of clusters. Agglomerative clustering starts with each point alone and repeatedly merges the closest
        clusters.
      </NoteParagraph>
      <NoteTable
        headers={['linkage', 'cluster distance']}
        rows={[
          ['single linkage', 'Minimum pairwise distance between clusters.'],
          ['complete linkage', 'Maximum pairwise distance between clusters.'],
          ['average linkage', 'Average pairwise distance between clusters.'],
          ['centroid linkage', 'Distance between cluster centers.'],
        ]}
      />
      <NoteParagraph>
        The dendrogram can be cut at different heights to produce different numbers of clusters.
      </NoteParagraph>

      <NoteSectionTitle id="clustering-aggregation">22. Clustering Aggregation</NoteSectionTitle>
      <NoteParagraph>
        Clustering aggregation combines multiple clusterings into one consensus clustering. This matters when different algorithms, random seeds, metrics,
        or feature choices produce different partitions.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Aggregation Intuition">
          <BulletList className="mb-0">
            <li>Build evidence about which pairs of points often appear together.</li>
            <li>Use that evidence to form a co-association matrix or consensus objective.</li>
            <li>Prefer clusters that agree with many input clusterings.</li>
            <li>Remember that no aggregation method can recover information absent from every input clustering.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="graph-mining-overview">23. Graph Mining Overview</NoteSectionTitle>
      <NoteParagraph>
        Graph mining studies data where entities are vertices and relationships are edges. The structure itself contains information: communities,
        hubs, bridges, central nodes, and paths.
      </NoteParagraph>
      <NoteTable
        headers={['graph object', 'meaning']}
        rows={[
          ['vertex', 'Entity such as a user, page, protein, or paper.'],
          ['edge', 'Relationship such as follows, links to, binds, or cites.'],
          ['directed edge', 'Relationship has direction.'],
          ['weighted edge', 'Relationship has strength or cost.'],
          ['adjacency matrix', 'Matrix representation of edges.'],
        ]}
      />

      <NoteSectionTitle id="degree-distributions-and-clustering-coefficients">24. Degree Distributions and Clustering Coefficients</NoteSectionTitle>
      <NoteParagraph>
        A vertex degree counts incident edges. A degree distribution summarizes how common different degrees are. A clustering coefficient measures how
        connected a node's neighbors are to each other.
      </NoteParagraph>
      <NoteTable
        headers={['quantity', 'intuition']}
        rows={[
          ['degree', 'How many connections a vertex has.'],
          ['in-degree', 'How many directed edges enter the vertex.'],
          ['out-degree', 'How many directed edges leave the vertex.'],
          ['local clustering coefficient', 'How close the neighborhood is to a clique.'],
          ['global clustering', 'How much triangle structure appears in the graph overall.'],
        ]}
      />

      <NoteSectionTitle id="graph-models-erdos-renyi-preferential-attachment-watts-strogatz">25. Graph Models: Erdos-Renyi, Preferential Attachment, Watts-Strogatz</NoteSectionTitle>
      <NoteParagraph>
        Graph models are simplified random processes that generate networks with certain structural properties. They are not perfect descriptions of the
        world, but they help explain which mechanisms create which patterns.
      </NoteParagraph>
      <NoteTable
        headers={['model', 'mechanism', 'pattern']}
        rows={[
          ['Erdos-Renyi', 'Each possible edge appears independently with probability p.', 'Random baseline with limited clustering.'],
          ['Preferential attachment', 'New nodes prefer to attach to high-degree nodes.', 'Hubs and heavy-tailed degree distributions.'],
          ['Watts-Strogatz', 'Start with local lattice connections and rewire some edges.', 'Small-world behavior: short paths plus clustering.'],
        ]}
      />

      <NoteSectionTitle id="centrality-measures">26. Centrality Measures</NoteSectionTitle>
      <NoteParagraph>
        Centrality measures rank vertices by importance, but importance has multiple meanings. A high-degree node, a bridge node, and a node linked by
        important nodes are important in different ways.
      </NoteParagraph>
      <NoteTable
        headers={['centrality', 'idea']}
        rows={[
          ['degree centrality', 'Important nodes have many edges.'],
          ['closeness centrality', 'Important nodes are close to many others.'],
          ['betweenness centrality', 'Important nodes lie on many shortest paths.'],
          ['eigenvector centrality', 'Important nodes are connected to important nodes.'],
          ['PageRank', 'Importance is long-run random-walk probability with teleportation.'],
        ]}
      />

      <NoteSectionTitle id="markov-chains">27. Markov Chains</NoteSectionTitle>
      <NoteParagraph>
        A Markov chain is a stochastic process where the next state distribution depends only on the current state. A transition matrix records the
        probabilities of moving between states.
      </NoteParagraph>
      <NoteTable
        headers={['term', 'meaning']}
        rows={[
          ['state', 'One possible position of the process.'],
          ['transition probability', <InlineMath math={'P(X_{t+1}=j\\mid X_t=i)'} />],
          ['transition matrix', 'Rows or columns store probabilities, depending on convention.'],
          ['stationary distribution', 'A distribution that does not change after one transition.'],
        ]}
      />

      <NoteSectionTitle id="stationary-distributions-and-power-method">28. Stationary Distributions and Power Method</NoteSectionTitle>
      <NoteParagraph>
        A stationary distribution satisfies <InlineMath math={'\\pi M=\\pi'} /> under row-vector convention. The power method repeatedly multiplies a
        distribution by the transition matrix until it converges.
      </NoteParagraph>
      <AlgorithmBlock
        title="Power Method"
        steps={[
          <span>Choose an initial distribution <InlineMath math="x_0" />.</span>,
          <span>Compute <InlineMath math="x_{k+1}=x_kM" />.</span>,
          <span>Stop when <InlineMath math="x_{k+1}" /> is close to <InlineMath math="x_k" />.</span>,
          <span>Otherwise set <InlineMath math="k\leftarrow k+1" /> and repeat.</span>,
        ]}
      />

      <NoteSectionTitle id="pagerank">29. PageRank</NoteSectionTitle>
      <NoteParagraph>
        PageRank models a random web surfer who follows links with probability <InlineMath math={'\\alpha'} /> and teleports elsewhere with probability
        <InlineMath math={'1-\\alpha'} />. Teleportation helps guarantee convergence and handles sinks.
      </NoteParagraph>
      <PageRankExplorer />

      <NoteSectionTitle id="supervised-learning">30. Supervised Learning</NoteSectionTitle>
      <NoteParagraph>
        Supervised learning uses examples with ground-truth outputs to learn a function from features to predictions. Regression predicts numeric values;
        classification predicts labels.
      </NoteParagraph>
      <NoteTable
        headers={['piece', 'meaning']}
        rows={[
          ['features', 'Input variables used for prediction.'],
          ['label or response', 'Ground-truth output.'],
          ['model', 'Parameterized prediction rule.'],
          ['loss', 'Penalty measuring prediction error.'],
          ['training', 'Choose parameters that reduce loss on training data.'],
          ['generalization', 'Performance on data not used for training.'],
        ]}
      />

      <NoteSectionTitle id="linear-regression">31. Linear Regression</NoteSectionTitle>
      <NoteParagraph>
        Linear regression predicts a numeric response as a linear combination of features. With an intercept column, the prediction has the form
        <InlineMath math={'\\hat{y}=X\\theta'} />.
      </NoteParagraph>
      <NoteTable
        headers={['method', 'formula or idea']}
        rows={[
          ['least squares objective', <InlineMath math={'\\min_\\theta \\|X\\theta-y\\|_2^2'} />],
          ['pseudoinverse solution', <InlineMath math={'\\theta^*=X^\\dagger y'} />],
          ['fit', 'Compute and store theta from training data.'],
          ['predict', 'Apply stored theta to new feature rows.'],
        ]}
      />

      <NoteSectionTitle id="logistic-regression">32. Logistic Regression</NoteSectionTitle>
      <NoteParagraph>
        Logistic regression is a linear classifier that maps a linear score through the sigmoid function to produce a probability.
      </NoteParagraph>
      <NoteTable
        headers={['quantity', 'meaning']}
        rows={[
          ['score', <InlineMath math={'z=\\theta^T x'} />],
          ['sigmoid', <InlineMath math={'\\sigma(z)=1/(1+e^{-z})'} />],
          ['probability', <InlineMath math={'P(Y=1\\mid x)=\\sigma(\\theta^T x)'} />],
          ['classification', <InlineMath math={'predict\\ 1\\ if\\ P(Y=1\\mid x)\\ge \\alpha'} />],
        ]}
      />
      <NoteParagraph>
        The threshold <InlineMath math={'\\alpha'} /> controls the precision-recall tradeoff and does not have to be 0.5.
      </NoteParagraph>

      <NoteSectionTitle id="gradient-descent-and-sgd">33. Gradient Descent and SGD</NoteSectionTitle>
      <NoteParagraph>
        Gradient descent minimizes a loss by moving parameters opposite the gradient. Stochastic gradient descent estimates the gradient from a single
        example or mini-batch instead of the full dataset.
      </NoteParagraph>
      <GradientDescentExplorer />
      <NoteTable
        headers={['optimizer', 'idea']}
        rows={[
          ['batch gradient descent', 'Use all data for each gradient step.'],
          ['SGD', 'Use one example at a time.'],
          ['mini-batch SGD', 'Use small batches to balance speed and stability.'],
          ['momentum', 'Smooth updates using a running direction.'],
          ['AdaGrad/RMSProp/Adam', 'Adapt learning rates using gradient history.'],
        ]}
      />

      <NoteSectionTitle id="model-evaluation">34. Model Evaluation</NoteSectionTitle>
      <NoteParagraph>
        A model should be evaluated on data not used to fit it. Training performance measures fit; testing performance estimates generalization.
      </NoteParagraph>
      <EvaluationExplorer />
      <NoteTable
        headers={['metric', 'definition']}
        rows={[
          ['accuracy', <InlineMath math={'(TP+TN)/(TP+FP+TN+FN)'} />],
          ['precision', <InlineMath math={'TP/(TP+FP)'} />],
          ['recall', <InlineMath math={'TP/(TP+FN)'} />],
          ['F1', <InlineMath math={'2PR/(P+R)'} />],
          ['AUC', 'Area under the ROC curve across thresholds.'],
        ]}
      />

      <NoteSectionTitle id="cross-validation-and-statistical-model-comparison">35. Cross Validation and Statistical Model Comparison</NoteSectionTitle>
      <NoteParagraph>
        Cross validation reduces dependence on one train/test split. In k-fold cross validation, each fold is used as the test set once while the other
        folds train the model.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Model Comparison Steps">
          <BulletList className="mb-0">
            <li>Split data into folds, preserving label balance when possible.</li>
            <li>Train and test each model on the same folds.</li>
            <li>Compare paired fold scores using differences.</li>
            <li>Use a paired t-test when differences are approximately Gaussian.</li>
            <li>Use a nonparametric alternative such as Wilcoxon signed-rank when that assumption is doubtful.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="rank-aggregation">36. Rank Aggregation</NoteSectionTitle>
      <NoteParagraph>
        Rank aggregation combines several rankings or scoring functions into one ranking. If numeric scores are available, aggregate functions such as
        min, max, average, or weighted average can be used.
      </NoteParagraph>
      <RankAggregationExplorer />
      <NoteParagraph>
        Top-k retrieval asks for the best k objects under a monotone aggregate function without reading every score if possible.
      </NoteParagraph>

      <NoteSectionTitle id="voting-theory-and-arrows-theorem">37. Voting Theory and Arrow's Theorem</NoteSectionTitle>
      <NoteParagraph>
        Voting systems are ordinal rank aggregation methods. A Condorcet winner beats every other option in pairwise majority votes, but majority
        preferences can cycle.
      </NoteParagraph>
      <NoteTable
        headers={['method or criterion', 'idea']}
        rows={[
          ['plurality', 'Choose the option with the most first-place votes.'],
          ['runoff', 'Repeatedly eliminate weak first-place performers and transfer votes.'],
          ['Borda count', 'Assign points by rank position and sum them.'],
          ['Condorcet criterion', 'If a pairwise majority winner exists, it should win.'],
          ['independence of irrelevant alternatives', 'Relative order of A and B should not depend on C.'],
          ["Arrow's theorem", 'No voting system satisfies all natural fairness axioms at once.'],
        ]}
      />

      <NoteSectionTitle id="implementation-guide">38. Implementation Guide</NoteSectionTitle>
      <NoteParagraph>
        The algorithms in this note translate cleanly into Python when each model separates fitting, probability or prediction, and parameter reporting.
        Shape discipline is often the difference between a clean implementation and a debugging session.
      </NoteParagraph>
      <NoteTable
        headers={['implementation', 'core functions']}
        rows={[
          ['Bayes predictor', 'count, normalize, apply Bayes, normalize posterior, argmax.'],
          ['distribution fitting', 'fit parameters, evaluate prob or density, report parameters.'],
          ['GMM with EM', 'estep returns responsibility matrix; mstep updates priors, means, variances.'],
          ['KMeans', 'assign nearest center, update means, handle empty clusters.'],
          ['random projection', 'sample matrix, project data, check pairwise distance distortion.'],
          ['SVD outliers', 'reconstruct with top k, compute errors, z-score, threshold.'],
          ['PageRank', 'iterate transition update with teleportation until convergence.'],
          ['linear regression', 'add intercept, fit with pseudoinverse, predict with stored weights.'],
        ]}
      />

    </NotesLayout>
  );
}
