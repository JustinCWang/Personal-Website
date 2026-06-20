/**
 * Foundations of Data Science Notes Page
 * A standalone note for probability, modeling, clustering, dimensionality reduction, graph mining, learning, evaluation, and rank aggregation.
 */

import { useMemo, useState, type ReactNode } from 'react';
import { NotesLayout } from '../../../components/notes/NotesLayout';
import {
  AlgorithmBlock,
  CodeBlock,
  InlineMath,
  InteractiveBlock,
  NoteHeader,
  NoteParagraph,
  NoteSectionTitle,
  NoteTopicBlock,
  NoteTopicGroup,
} from '../../../components/notes';
import { useDarkMode } from '../../../hooks/useDarkMode';
import { getRunnerPlayLabel, toggleOrReplayRunner, useAutoRunner } from '../../../components/notes/useAutoRunner';

type TableRow = ReactNode[];
type LegendItem = {
  label: ReactNode;
  color: string;
  hollow?: boolean;
};

const round = (value: number, digits = 3) => Number(value.toFixed(digits));
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const percent = (value: number, digits = 1) => `${round(value * 100, digits)}%`;

const emLoopCode = `
def em_gaussian_mixture(xs, means, priors, variance, max_iter=24):
    for step in range(max_iter):
        gammas = []
        for x in xs:
            left = priors[0] * normal_pdf(x, means[0], variance)
            right = priors[1] * normal_pdf(x, means[1], variance)
            gammas.append(left / (left + right))
        yield means, priors, gammas
        left_mass = sum(gammas)
        right_mass = len(xs) - left_mass
        means = [
            sum(g * x for g, x in zip(gammas, xs)) / left_mass,
            sum((1 - g) * x for g, x in zip(gammas, xs)) / right_mass,
        ]
        priors = [left_mass / len(xs), right_mass / len(xs)]
`;

const kMeansCode = `
def squared_distance(a, b):
    return sum((x - y) ** 2 for x, y in zip(a, b))

def mean_point(points):
    dimension = len(points[0])
    return tuple(sum(point[d] for point in points) / len(points) for d in range(dimension))

def kmeans(points, centers, max_iter=20, tol=1e-4):
    for step in range(max_iter):
        assignments = [
            min(range(len(centers)), key=lambda c: squared_distance(point, centers[c]))
            for point in points
        ]
        inertia = sum(squared_distance(point, centers[a]) for point, a in zip(points, assignments))
        updated = []
        for c, old_center in enumerate(centers):
            cluster = [point for point, a in zip(points, assignments) if a == c]
            updated.append(mean_point(cluster) if cluster else old_center)
        yield step, centers, assignments, updated, inertia
        shift = max(squared_distance(a, b) ** 0.5 for a, b in zip(centers, updated))
        if shift < tol:
            break
        centers = updated
`;

const dbscanCode = `
def distance(a, b):
    return sum((x - y) ** 2 for x, y in zip(a, b)) ** 0.5

def dbscan(points, epsilon, min_pts):
    labels = [None] * len(points)
    visited = [False] * len(points)
    cluster_id = 0
    yield "start", None, [], [], list(labels)

    def neighbors(i):
        return [
            j for j, point in enumerate(points)
            if distance(points[i], point) <= epsilon
        ]

    for i in range(len(points)):
        if visited[i]:
            continue
        visited[i] = True
        seeds = neighbors(i)
        yield "inspect", i, list(seeds), [], list(labels)
        if len(seeds) < min_pts:
            labels[i] = "noise"
            yield "noise", i, list(seeds), [], list(labels)
            continue

        cluster_id += 1
        labels[i] = cluster_id
        queue = [j for j in seeds if j != i]
        queued = set(queue)
        yield "start_cluster", i, list(seeds), list(queue), list(labels)
        while queue:
            j = queue.pop(0)
            expanded = neighbors(j)
            if not visited[j]:
                visited[j] = True
                yield "expand", j, list(expanded), list(queue), list(labels)
                if len(expanded) >= min_pts:
                    for candidate in expanded:
                        if candidate != i and candidate not in queued:
                            queue.append(candidate)
                            queued.add(candidate)
                    yield "queue", j, list(expanded), list(queue), list(labels)
            if labels[j] is None or labels[j] == "noise":
                labels[j] = cluster_id
                yield "assign", j, list(expanded), list(queue), list(labels)
    return labels
`;

const editDistanceCode = `
def edit_distance(source, target):
    dp = [[0] * (len(target) + 1) for _ in range(len(source) + 1)]
    for i in range(len(source) + 1):
        for j in range(len(target) + 1):
            if i == 0:
                dp[i][j] = j
            elif j == 0:
                dp[i][j] = i
            else:
                cost = 0 if source[i - 1] == target[j - 1] else 1
                dp[i][j] = min(
                    dp[i - 1][j] + 1,
                    dp[i][j - 1] + 1,
                    dp[i - 1][j - 1] + cost
                )
            yield i, j, [row[:] for row in dp]
    return dp[-1][-1]
`;

const agglomerativeCode = `
def agglomerative_single_link(points):
    clusters = [{point} for point in points]
    yield clusters
    while len(clusters) > 1:
        best = min(
            ((i, j) for i in range(len(clusters)) for j in range(i + 1, len(clusters))),
            key=lambda pair: single_link_distance(clusters[pair[0]], clusters[pair[1]])
        )
        i, j = best
        clusters[i] = clusters[i] | clusters[j]
        clusters.pop(j)
        yield clusters
`;

const powerMethodCode = `
def power_method(M, x, tol=1e-4, max_iter=30):
    yield 0, x, 0.0
    for step in range(max_iter):
        x_next = [sum(x[r] * M[r][c] for r in range(len(x))) for c in range(len(x))]
        delta = sum(abs(a - b) for a, b in zip(x_next, x))
        yield step + 1, x_next, delta
        if delta < tol:
            break
        x = x_next
`;

const topKThresholdCode = `
def threshold_top_k(sorted_lists, score, k):
    seen = set()
    for depth in range(1, len(sorted_lists[0]) + 1):
        for ranked_list in sorted_lists:
            seen.add(ranked_list[depth - 1].object_id)
        known = sorted(seen, key=score, reverse=True)
        threshold = sum(ranked_list[depth - 1].score for ranked_list in sorted_lists)
        yield depth, known, threshold
        if len(known) >= k and score(known[k - 1]) >= threshold:
            return known[:k]
`;

const pageRankCode = `
def pagerank_power_iteration(outlinks, alpha=0.85, tol=1e-5, max_iter=80):
    pages = list(outlinks)
    n = len(pages)
    rank = {page: 1 / n for page in pages}
    yield 0, rank, None
    for step in range(1, max_iter + 1):
        next_rank = {page: (1 - alpha) / n for page in pages}
        sink_mass = sum(rank[page] for page in pages if not outlinks[page])
        for page in pages:
            next_rank[page] += alpha * sink_mass / n
        for page, links in outlinks.items():
            if links:
                share = alpha * rank[page] / len(links)
                for target in links:
                    next_rank[target] += share
        delta = sum(abs(next_rank[page] - rank[page]) for page in pages)
        yield step, next_rank, delta
        if delta < tol:
            break
        rank = next_rank
`;

const logisticGradientDescentCode = `
from math import exp, log

def fit_logistic_regression(points, eta=0.08, tol=1e-3, max_iter=90):
    w = [-0.8, 0.4]
    b = -0.2
    n = len(points)
    for step in range(max_iter):
        grad = [0.0, 0.0]
        grad_b = 0.0
        loss = 0.0
        for x1, x2, y in points:
            z = w[0] * x1 + w[1] * x2 + b
            p = 1 / (1 + exp(-z))
            loss += -(y * log(p + 1e-12) + (1 - y) * log(1 - p + 1e-12))
            error = p - y
            grad[0] += error * x1
            grad[1] += error * x2
            grad_b += error
        grad = [g / n for g in grad]
        grad_b /= n
        grad_norm = (grad[0] ** 2 + grad[1] ** 2 + grad_b ** 2) ** 0.5
        yield step, w, b, loss / n, grad_norm
        if grad_norm < tol:
            break
        w = [w[0] - eta * grad[0], w[1] - eta * grad[1]]
        b -= eta * grad_b
`;

function normalPdf(x: number, mean: number, variance: number) {
  return Math.exp(-((x - mean) ** 2) / (2 * variance)) / Math.sqrt(2 * Math.PI * variance);
}

function logisticSigmoid(value: number) {
  return 1 / (1 + Math.exp(-value));
}

function squaredDistance2D(left: Point2D, right: Point2D) {
  return (left.x - right.x) ** 2 + (left.y - right.y) ** 2;
}

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
    isDarkMode,
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

function VisualLegend({ items }: { items: LegendItem[] }) {
  const { isDarkMode } = useDataScienceTheme();

  return (
    <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2 text-xs">
      {items.map((item, index) => (
        <span key={index} className="inline-flex items-center gap-2">
          <span
            className="h-3 w-3 shrink-0 rounded-sm border"
            style={{
              backgroundColor: item.hollow ? 'transparent' : item.color,
              borderColor: item.color,
              opacity: item.hollow ? 1 : isDarkMode ? 0.9 : 0.78,
            }}
          />
          <span>{item.label}</span>
        </span>
      ))}
    </div>
  );
}

function MetricTile({ label, value }: { label: ReactNode; value: ReactNode }) {
  const { isDarkMode } = useDataScienceTheme();

  return (
    <div className={`rounded-md border p-2 text-xs ${isDarkMode ? 'border-green-500/20 bg-black/20' : 'border-slate-200 bg-white/75'}`}>
      <div className="font-bold">{label}</div>
      <div>{value}</div>
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
  const { subtlePanelClass, primaryColor, secondaryColor, mutedColor, textColor } = useDataScienceTheme();
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
  const chart = { width: 430, height: 180, left: 30, right: 22, top: 24, rowGap: 42 };
  const barWidth = chart.width - chart.left - chart.right;
  const rows = [
    { label: 'Good numerator', value: goodNumerator, color: primaryColor },
    { label: 'Bad numerator', value: badNumerator, color: secondaryColor },
    { label: 'normalizer', value: normalizer, color: mutedColor },
  ];
  const maxBarValue = Math.max(...rows.map((row) => row.value), 0.01);

  return (
    <InteractiveBlock title="Bayes Normalization">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(250px,340px)_minmax(0,1fr)]">
        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
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
          <div className="mt-4 grid gap-2">
            <MetricTile label={<InlineMath math="P(Good)" />} value={priorGood.toFixed(2)} />
            <MetricTile label={<InlineMath math={'P(feature\\mid Good)'} />} value={current.good.toFixed(2)} />
            <MetricTile label={<InlineMath math={'P(feature\\mid Bad)'} />} value={current.bad.toFixed(2)} />
          </div>
        </div>
        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className="h-52 w-full" role="img" aria-label="Bayes classifier numerator bars and posterior normalization">
            {rows.map((row, index) => {
              const y = chart.top + index * chart.rowGap;
              const width = (row.value / maxBarValue) * barWidth;
              return (
                <g key={row.label}>
                  <text x={chart.left} y={y - 8} fontFamily="monospace" fontSize="12" fill={textColor}>{row.label}</text>
                  <rect x={chart.left} y={y} width={barWidth} height="14" rx="5" fill="transparent" stroke={mutedColor} strokeWidth="1" />
                  <rect x={chart.left} y={y} width={width} height="14" rx="5" fill={row.color} fillOpacity="0.72" />
                  <text x={chart.left + barWidth} y={y - 8} textAnchor="end" fontFamily="monospace" fontSize="12" fill={textColor}>{row.value.toFixed(3)}</text>
                </g>
              );
            })}
            <rect x={chart.left} y="150" width={posteriorGood * barWidth} height="16" rx="5" fill={primaryColor} fillOpacity="0.8" />
            <rect x={chart.left + posteriorGood * barWidth} y="150" width={posteriorBad * barWidth} height="16" rx="5" fill={secondaryColor} fillOpacity="0.8" />
          </svg>
          <VisualLegend
            items={[
              { label: <InlineMath math={'P(Good\\mid feature)'} />, color: primaryColor },
              { label: <InlineMath math={'P(Bad\\mid feature)'} />, color: secondaryColor },
            ]}
          />
          <div className="mb-4 grid gap-2 sm:grid-cols-2">
            <MetricTile label={<InlineMath math={'P(Good\\mid feature)'} />} value={posteriorGood.toFixed(3)} />
            <MetricTile label={<InlineMath math={'P(Bad\\mid feature)'} />} value={posteriorBad.toFixed(3)} />
          </div>
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
        ['Bernoulli', 'Did one binary trial succeed?', <InlineMath math={'0\\text{ or }1'} />],
        ['Binomial', 'How many successes occur in n independent trials?', <InlineMath math={'0,1,\\dots,n'} />],
        ['Geometric', 'How many trials until the first success?', <InlineMath math={'1,2,3,\\dots'} />],
        ['Poisson', 'How many events occur in a fixed interval?', <InlineMath math={'0,1,2,\\dots'} />],
        ['Exponential', 'How long until the next event?', <InlineMath math={'x\\ge 0'} />],
        ['Gaussian', 'What value comes from many small additive effects?', 'all real numbers'],
      ]}
    />
  );
}

function MleExplorer() {
  const { subtlePanelClass, primaryColor, secondaryColor, mutedColor, textColor } = useDataScienceTheme();
  const [successes, setSuccesses] = useState(30);
  const [trials, setTrials] = useState(100);
  const safeSuccesses = Math.min(successes, trials);
  const pHat = safeSuccesses / trials;
  const logLikelihoodAt = (p: number) =>
    safeSuccesses * Math.log(Math.max(p, 1e-9)) + (trials - safeSuccesses) * Math.log(Math.max(1 - p, 1e-9));
  const logLikelihood = logLikelihoodAt(clamp(pHat, 1e-9, 1 - 1e-9));
  const chart = { width: 430, height: 245, left: 50, top: 18, plotWidth: 328, plotHeight: 150 };
  const curvePoints = Array.from({ length: 140 }, (_, index) => {
    const p = 0.001 + (0.998 * index) / 139;
    return { p, value: logLikelihoodAt(p) };
  });
  const minCurve = Math.min(...curvePoints.map((point) => point.value));
  const maxCurve = Math.max(...curvePoints.map((point) => point.value));
  const xCoord = (p: number) => chart.left + clamp(p, 0, 1) * chart.plotWidth;
  const yCoord = (value: number) =>
    chart.top + chart.plotHeight - ((value - minCurve) / Math.max(1e-9, maxCurve - minCurve)) * chart.plotHeight;
  const curvePath = curvePoints.map((point, index) => `${index === 0 ? 'M' : 'L'} ${xCoord(point.p)} ${yCoord(point.value)}`).join(' ');

  return (
    <InteractiveBlock title="Bernoulli MLE">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(250px,340px)_minmax(0,1fr)]">
        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
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
        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className="h-64 w-full" role="img" aria-label="Bernoulli log-likelihood curve with x-axis candidate probability and y-axis log likelihood">
            <line x1={chart.left} y1={chart.top + chart.plotHeight} x2={chart.left + chart.plotWidth} y2={chart.top + chart.plotHeight} stroke={mutedColor} strokeWidth="2" />
            <line x1={chart.left} y1={chart.top} x2={chart.left} y2={chart.top + chart.plotHeight} stroke={mutedColor} strokeWidth="2" />
            <text transform={`translate(16 ${chart.top + chart.plotHeight / 2}) rotate(-90)`} textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>
              log L(p)
            </text>
            <path d={curvePath} fill="none" stroke={primaryColor} strokeWidth="3" />
            <line x1={xCoord(pHat)} y1={chart.top} x2={xCoord(pHat)} y2={chart.top + chart.plotHeight} stroke={secondaryColor} strokeWidth="2.5" strokeDasharray="5 4" />
            <circle cx={xCoord(pHat)} cy={yCoord(logLikelihood)} r="4" fill={secondaryColor} />
            {[0, 0.5, 1].map((tick) => (
              <g key={tick}>
                <line x1={xCoord(tick)} y1={chart.top + chart.plotHeight} x2={xCoord(tick)} y2={chart.top + chart.plotHeight + 6} stroke={mutedColor} strokeWidth="1.5" />
                <text x={xCoord(tick)} y={chart.top + chart.plotHeight + 22} textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>
                  {tick === 0.5 ? '.5' : tick}
                </text>
              </g>
            ))}
            <text x={chart.left + chart.plotWidth / 2} y={chart.height - 14} textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>
              candidate p
            </text>
          </svg>
          <VisualLegend
            items={[
              { label: 'log-likelihood', color: primaryColor },
              { label: <InlineMath math={'\\hat{p}_{MLE}'} />, color: secondaryColor },
            ]}
          />
          <div className="mb-4 grid gap-2 sm:grid-cols-3">
            <MetricTile label="data" value={`${safeSuccesses}/${trials}`} />
            <MetricTile label={<InlineMath math={'\\hat{p}_{MLE}'} />} value={pHat.toFixed(3)} />
            <MetricTile label="log likelihood" value={logLikelihood.toFixed(2)} />
          </div>
          <NoteParagraph className="mb-0 text-sm">
            The peak occurs at the observed success frequency, which is why the Bernoulli MLE is <InlineMath math={'\\hat p=s/n'} />.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function EMResponsibilityExplorer() {
  const { subtlePanelClass, primaryColor, secondaryColor, mutedColor, textColor } = useDataScienceTheme();
  const [x, setX] = useState(2);
  const components = [
    { name: 'component 1', prior: 0.45, mean: 0, variance: 1.2 },
    { name: 'component 2', prior: 0.55, mean: 4, variance: 1.6 },
  ];
  const densities = components.map((component) => normalPdf(x, component.mean, component.variance));
  const numerators = densities.map((density, index) => density * components[index].prior);
  const total = numerators.reduce((sum, value) => sum + value, 0);
  const gammas = numerators.map((value) => value / total);
  const chart = { width: 430, height: 245, left: 46, top: 20, plotWidth: 338, plotHeight: 145 };
  const domain = { min: -3, max: 7 };
  const xCoord = (value: number) => chart.left + ((value - domain.min) / (domain.max - domain.min)) * chart.plotWidth;
  const yCoord = (value: number) => chart.top + chart.plotHeight - (value / 0.42) * chart.plotHeight;
  const curvePath = (component: (typeof components)[number]) =>
    Array.from({ length: 140 }, (_, index) => {
      const value = domain.min + ((domain.max - domain.min) * index) / 139;
      const y = normalPdf(value, component.mean, component.variance);
      return `${index === 0 ? 'M' : 'L'} ${xCoord(value)} ${yCoord(y)}`;
    }).join(' ');

  return (
    <InteractiveBlock title="EM Responsibilities">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(250px,340px)_minmax(0,1fr)]">
        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
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
          <div className="mt-4 grid gap-2">
            <MetricTile label={<InlineMath math={'\\gamma_{i1}'} />} value={gammas[0].toFixed(3)} />
            <MetricTile label={<InlineMath math={'\\gamma_{i2}'} />} value={gammas[1].toFixed(3)} />
          </div>
        </div>
        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className="h-64 w-full" role="img" aria-label="Gaussian mixture density curves with x-axis observed value and y-axis density">
            <line x1={chart.left} y1={chart.top + chart.plotHeight} x2={chart.left + chart.plotWidth} y2={chart.top + chart.plotHeight} stroke={mutedColor} strokeWidth="2" />
            <line x1={chart.left} y1={chart.top} x2={chart.left} y2={chart.top + chart.plotHeight} stroke={mutedColor} strokeWidth="2" />
            <text transform={`translate(16 ${chart.top + chart.plotHeight / 2}) rotate(-90)`} textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>
              density
            </text>
            <path d={curvePath(components[0])} fill="none" stroke={primaryColor} strokeWidth="3" />
            <path d={curvePath(components[1])} fill="none" stroke={secondaryColor} strokeWidth="3" />
            <line x1={xCoord(x)} y1={chart.top} x2={xCoord(x)} y2={chart.top + chart.plotHeight} stroke={textColor} strokeWidth="2" strokeDasharray="5 4" />
            <circle cx={xCoord(x)} cy={chart.top + chart.plotHeight} r="4" fill={textColor} />
            <text x={chart.left + chart.plotWidth / 2} y={chart.top + chart.plotHeight + 20} textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>observed value x</text>
            <rect x={chart.left} y="204" width={gammas[0] * chart.plotWidth} height="14" rx="5" fill={primaryColor} fillOpacity="0.82" />
            <rect x={chart.left + gammas[0] * chart.plotWidth} y="204" width={gammas[1] * chart.plotWidth} height="14" rx="5" fill={secondaryColor} fillOpacity="0.82" />
            <text x={chart.left} y="197" fontFamily="monospace" fontSize="11" fill={textColor}>responsibility split</text>
          </svg>
          <VisualLegend
            items={[
              { label: 'component 1 density', color: primaryColor },
              { label: 'component 2 density', color: secondaryColor },
              { label: 'observed point', color: textColor, hollow: true },
            ]}
          />
          <NoteParagraph className="mb-0 text-sm">
            The E-step computes a probability distribution over hidden components for each observed point.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

type Point2D = { id: string; x: number; y: number };

const kmeansPoints: Point2D[] = [
  { id: 'A', x: 3.471, y: 3.647 },
  { id: 'B', x: 5.358, y: 6.016 },
  { id: 'C', x: 6.438, y: 2.532 },
  { id: 'D', x: 4.03, y: 8.014 },
  { id: 'E', x: 2.17, y: 4.057 },
  { id: 'F', x: 1.777, y: 4.858 },
  { id: 'G', x: 3.11, y: 7.615 },
  { id: 'H', x: 8.457, y: 2.125 },
  { id: 'I', x: 5.006, y: 2.355 },
  { id: 'J', x: 5.143, y: 3.876 },
  { id: 'K', x: 4.594, y: 3.828 },
  { id: 'L', x: 4.232, y: 6.828 },
  { id: 'M', x: 1.666, y: 3.607 },
  { id: 'N', x: 6.256, y: 7.579 },
  { id: 'O', x: 6.644, y: 2.506 },
  { id: 'P', x: 7.501, y: 2.481 },
  { id: 'Q', x: 4.789, y: 4.029 },
  { id: 'R', x: 6.58, y: 1.817 },
];

const initialKMeansCenters: Point2D[] = [
  { id: 'C1', x: 6.455, y: 7.086 },
  { id: 'C2', x: 8.846, y: 1.101 },
  { id: 'C3', x: 9.355, y: 3.355 },
];

const emMixtureData = [-2, -1.5, -1, -0.4, 0.2, 0.8, 1.4, 2.1, 2.7, 3.4, 4.1, 4.8, 5.4, 6];
const powerMethodMatrix = [
  [0.8, 0.2, 0],
  [0.1, 0.7, 0.2],
  [0.2, 0.2, 0.6],
];

const pageRankPages = ['A', 'B', 'C', 'D', 'E'];
const pageRankOutlinks: Record<string, string[]> = {
  A: ['B', 'C', 'D'],
  B: ['A', 'C'],
  C: ['A', 'D'],
  D: ['A', 'E'],
  E: ['D'],
};
const pageRankIndex = new Map(pageRankPages.map((page, index) => [page, index]));

const logisticTrainingExamples = [
  { x: 1.0, y: 1.4, label: 0 },
  { x: 1.5, y: 2.4, label: 0 },
  { x: 2.2, y: 1.1, label: 0 },
  { x: 2.8, y: 2.7, label: 0 },
  { x: 3.2, y: 1.8, label: 0 },
  { x: 3.6, y: 3.0, label: 0 },
  { x: 5.4, y: 5.2, label: 1 },
  { x: 5.8, y: 6.5, label: 1 },
  { x: 6.6, y: 4.8, label: 1 },
  { x: 7.2, y: 6.2, label: 1 },
  { x: 7.9, y: 5.5, label: 1 },
  { x: 8.4, y: 7.0, label: 1 },
];

const dbscanPoints = [
  { id: 'a', x: 2.0, y: 4.2 },
  { id: 'b', x: 2.5, y: 4.7 },
  { id: 'c', x: 2.8, y: 3.7 },
  { id: 'd', x: 1.7, y: 3.5 },
  { id: 'e', x: 3.2, y: 4.1 },
  { id: 'f', x: 6.7, y: 6.2 },
  { id: 'g', x: 7.3, y: 6.6 },
  { id: 'h', x: 7.8, y: 5.8 },
  { id: 'i', x: 6.4, y: 5.4 },
  { id: 'j', x: 4.6, y: 4.6 },
  { id: 'k', x: 8.8, y: 2.1 },
  { id: 'l', x: 1.1, y: 7.6 },
];

function DbscanExplorer() {
  const { isDarkMode, subtlePanelClass, primaryColor, secondaryColor, mutedColor, textColor, panelFill } = useDataScienceTheme();
  const [epsilon, setEpsilon] = useState(1.35);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const minPts = 4;
  const clusterColors = [primaryColor, secondaryColor, '#a855f7'];
  const steps = useMemo(() => {
    const labels: (number | 'noise' | null)[] = Array.from({ length: dbscanPoints.length }, () => null);
    const visited = Array.from({ length: dbscanPoints.length }, () => false);
    const result: {
      message: string;
      activeIndex: number | null;
      neighborhood: number[];
      queue: number[];
      labels: (number | 'noise' | null)[];
      visited: boolean[];
      clusterId: number;
    }[] = [];
    let clusterId = 0;
    const neighborsOf = (index: number) =>
      dbscanPoints
        .map((_, candidateIndex) => candidateIndex)
        .filter((candidateIndex) => Math.sqrt(squaredDistance2D(dbscanPoints[index], dbscanPoints[candidateIndex])) <= epsilon);
    const pushStep = (message: string, activeIndex: number | null, neighborhood: number[], queue: number[]) => {
      result.push({
        message,
        activeIndex,
        neighborhood: [...neighborhood],
        queue: [...queue],
        labels: [...labels],
        visited: [...visited],
        clusterId,
      });
    };

    pushStep('start with every point unvisited', null, [], []);
    for (let index = 0; index < dbscanPoints.length; index += 1) {
      if (visited[index]) continue;
      visited[index] = true;
      const seeds = neighborsOf(index);
      pushStep(`inspect point ${dbscanPoints[index].id}`, index, seeds, []);
      if (seeds.length < minPts) {
        labels[index] = 'noise';
        pushStep(`${dbscanPoints[index].id} has too few neighbors, so mark it noise for now`, index, seeds, []);
        continue;
      }

      clusterId += 1;
      labels[index] = clusterId;
      const queue = seeds.filter((candidateIndex) => candidateIndex !== index);
      const queued = new Set(queue);
      pushStep(`start cluster ${clusterId} from core point ${dbscanPoints[index].id}`, index, seeds, queue);

      for (let queueIndex = 0; queueIndex < queue.length; queueIndex += 1) {
        const pointIndex = queue[queueIndex];
        let neighborhood = neighborsOf(pointIndex);
        if (!visited[pointIndex]) {
          visited[pointIndex] = true;
          pushStep(`expand from ${dbscanPoints[pointIndex].id}`, pointIndex, neighborhood, queue.slice(queueIndex + 1));
          if (neighborhood.length >= minPts) {
            neighborhood.forEach((candidateIndex) => {
              if (!queued.has(candidateIndex) && candidateIndex !== index) {
                queue.push(candidateIndex);
                queued.add(candidateIndex);
              }
            });
            pushStep(`${dbscanPoints[pointIndex].id} is core, so add its neighbors to the queue`, pointIndex, neighborhood, queue.slice(queueIndex + 1));
          }
        } else {
          neighborhood = neighborsOf(pointIndex);
        }

        if (labels[pointIndex] === null || labels[pointIndex] === 'noise') {
          labels[pointIndex] = clusterId;
          pushStep(`assign ${dbscanPoints[pointIndex].id} to cluster ${clusterId}`, pointIndex, neighborhood, queue.slice(queueIndex + 1));
        }
      }
    }

    pushStep('finished: every reachable dense region has been expanded', null, [], []);
    return result;
  }, [epsilon]);
  const boundedStep = Math.min(stepIndex, steps.length - 1);
  const current = steps[boundedStep];
  const atEnd = boundedStep === steps.length - 1;
  const assignedCount = current.labels.filter((label) => typeof label === 'number').length;
  const noiseCount = current.labels.filter((label) => label === 'noise').length;
  const activePoint = current.activeIndex === null ? null : dbscanPoints[current.activeIndex];
  const chart = { width: 460, height: 310, left: 44, top: 24, plotSize: 230 };
  const xCoord = (value: number) => chart.left + (value / 10) * chart.plotSize;
  const yCoord = (value: number) => chart.top + (1 - value / 10) * chart.plotSize;
  const epsilonRadius = (epsilon / 10) * chart.plotSize;
  const buttonClass = isDarkMode
    ? 'rounded-md border border-green-500/30 bg-black/30 px-3 py-2 text-sm font-bold text-green-200 transition-colors hover:bg-green-500/10 disabled:cursor-not-allowed disabled:opacity-40'
    : 'rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40';

  useAutoRunner({
    playing,
    canAdvance: !atEnd,
    delay: 620,
    onAdvance: () => setStepIndex((step) => Math.min(steps.length - 1, step + 1)),
    onStop: () => setPlaying(false),
  });

  return (
    <InteractiveBlock title="DBSCAN Expansion Runner">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(250px,340px)_minmax(0,1fr)]">
        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 block text-sm font-bold" htmlFor="dbscan-epsilon">Radius epsilon: {epsilon.toFixed(2)}</label>
          <input
            id="dbscan-epsilon"
            type="range"
            min="0.75"
            max="2.1"
            step="0.05"
            value={epsilon}
            onChange={(event) => {
              setPlaying(false);
              setEpsilon(Number(event.target.value));
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
            <button type="button" className={buttonClass} onClick={() => { setPlaying(false); setStepIndex((step) => Math.min(steps.length - 1, step + 1)); }} disabled={atEnd}>
              Expand
            </button>
          </div>
          <div className="mt-4 grid gap-2">
            <MetricTile label={<InlineMath math={'\\epsilon'} />} value={epsilon.toFixed(2)} />
            <MetricTile label="minPts" value={minPts} />
            <MetricTile label="step" value={`${boundedStep} of ${steps.length - 1}`} />
            <MetricTile label="active point" value={activePoint ? activePoint.id : 'none'} />
            <MetricTile label="neighbors / queue" value={`${current.neighborhood.length} / ${current.queue.length}`} />
            <MetricTile label="assigned / noise" value={`${assignedCount} / ${noiseCount}`} />
          </div>
          <p className="mt-4 text-sm">{current.message}</p>
        </div>
        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className="h-80 w-full" role="img" aria-label="DBSCAN cluster expansion in feature space">
            <rect x={chart.left} y={chart.top} width={chart.plotSize} height={chart.plotSize} rx="8" fill={panelFill} stroke={mutedColor} strokeWidth="1.5" />
            <text x={chart.left + chart.plotSize / 2} y={chart.top + chart.plotSize + 24} textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>feature 1</text>
            <text transform={`translate(18 ${chart.top + chart.plotSize / 2}) rotate(-90)`} textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>feature 2</text>
            {activePoint && (
              <circle
                cx={xCoord(activePoint.x)}
                cy={yCoord(activePoint.y)}
                r={epsilonRadius}
                fill={primaryColor}
                fillOpacity="0.08"
                stroke={primaryColor}
                strokeWidth="2"
                strokeDasharray="5 4"
              />
            )}
            {activePoint &&
              current.neighborhood.map((neighborIndex) => {
                const neighbor = dbscanPoints[neighborIndex];
                return (
                  <line
                    key={`neighbor-${neighbor.id}`}
                    x1={xCoord(activePoint.x)}
                    y1={yCoord(activePoint.y)}
                    x2={xCoord(neighbor.x)}
                    y2={yCoord(neighbor.y)}
                    stroke={primaryColor}
                    strokeOpacity="0.22"
                    strokeWidth="1.5"
                  />
                );
              })}
            {dbscanPoints.map((point, index) => {
              const label = current.labels[index];
              const clusterColor = typeof label === 'number' ? clusterColors[(label - 1) % clusterColors.length] : null;
              const isActive = index === current.activeIndex;
              const isQueued = current.queue.includes(index);
              const isNeighbor = current.neighborhood.includes(index);
              return (
                <g key={point.id}>
                  <circle
                    cx={xCoord(point.x)}
                    cy={yCoord(point.y)}
                    r={isActive ? 8 : isQueued ? 7 : 5.8}
                    fill={clusterColor ?? (label === 'noise' ? mutedColor : panelFill)}
                    fillOpacity={clusterColor ? 0.88 : label === 'noise' ? 0.5 : 1}
                    stroke={isActive ? textColor : isQueued ? secondaryColor : isNeighbor ? primaryColor : mutedColor}
                    strokeWidth={isActive || isQueued ? 3 : 1.5}
                  />
                </g>
              );
            })}
            <rect x="306" y="39" width="124" height="22" rx="5" fill={panelFill} fillOpacity="0.88" stroke={mutedColor} strokeOpacity="0.35" />
            <text x="314" y="54" fontFamily="monospace" fontSize="12" fill={textColor}>cluster count: {current.clusterId}</text>
          </svg>
          <VisualLegend
            items={[
              { label: 'active epsilon-neighborhood', color: primaryColor },
              { label: 'queued point', color: secondaryColor },
              { label: 'noise', color: mutedColor },
            ]}
          />
          <NoteParagraph className="mb-0 text-sm">
            DBSCAN expands a cluster from each dense core; points can move from temporary noise into a cluster if reached later.
          </NoteParagraph>
        </div>
      </div>
      <CodeBlock language="python" code={dbscanCode} />
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
  const { subtlePanelClass, primaryColor, secondaryColor, mutedColor, textColor } = useDataScienceTheme();
  const [k, setK] = useState(2);
  const singularValues = [9, 4, 2, 1];
  const totalEnergy = singularValues.reduce((sum, value) => sum + value ** 2, 0);
  const keptEnergy = singularValues.slice(0, k).reduce((sum, value) => sum + value ** 2, 0);
  const retained = keptEnergy / totalEnergy;
  const chart = { width: 430, height: 250, left: 58, top: 24, plotWidth: 300, plotHeight: 128 };
  const maxValue = Math.max(...singularValues);
  const barGap = 20;
  const barWidth = (chart.plotWidth - barGap * (singularValues.length - 1)) / singularValues.length;

  return (
    <InteractiveBlock title="SVD Truncation">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(250px,340px)_minmax(0,1fr)]">
        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
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
          <div className="mt-4 grid gap-2">
            <MetricTile label="kept values" value={singularValues.slice(0, k).join(', ')} />
            <MetricTile label="retained energy" value={percent(retained)} />
          </div>
        </div>
        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className="h-64 w-full" role="img" aria-label="Singular value bars with x-axis rank index and y-axis singular value">
            <line x1={chart.left} y1={chart.top + chart.plotHeight} x2={chart.left + chart.plotWidth} y2={chart.top + chart.plotHeight} stroke={mutedColor} strokeWidth="2" />
            <line x1={chart.left} y1={chart.top} x2={chart.left} y2={chart.top + chart.plotHeight} stroke={mutedColor} strokeWidth="2" />
            <text transform={`translate(18 ${chart.top + chart.plotHeight / 2}) rotate(-90)`} textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>
              singular value
            </text>
            {singularValues.map((value, index) => {
              const height = (value / maxValue) * chart.plotHeight;
              const x = chart.left + index * (barWidth + barGap);
              const y = chart.top + chart.plotHeight - height;
              const kept = index < k;
              return (
                <g key={value}>
                  <rect x={x} y={y} width={barWidth} height={height} rx="6" fill={kept ? primaryColor : mutedColor} fillOpacity={kept ? 0.82 : 0.32} />
                  <text x={x + barWidth / 2} y={y - 8} textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>{value}</text>
                  <text x={x + barWidth / 2} y={chart.top + chart.plotHeight + 22} textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>
                    s{index + 1}
                  </text>
                </g>
              );
            })}
            <text x={chart.left + chart.plotWidth / 2} y={chart.top + chart.plotHeight + 42} textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>rank index</text>
            <rect x={chart.left} y="220" width={chart.plotWidth} height="14" rx="5" fill="transparent" stroke={mutedColor} strokeWidth="1" />
            <rect x={chart.left} y="220" width={retained * chart.plotWidth} height="14" rx="5" fill={secondaryColor} fillOpacity="0.78" />
          </svg>
          <VisualLegend
            items={[
              { label: 'kept singular values', color: primaryColor },
              { label: 'discarded tail', color: mutedColor },
              { label: 'retained squared energy', color: secondaryColor },
            ]}
          />
          <NoteParagraph className="mb-0 text-sm">
            Keeping the largest singular values preserves the strongest variance directions while dropping weaker detail.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function PageRankExplorer() {
  const { isDarkMode, subtlePanelClass, primaryColor, secondaryColor, mutedColor, textColor, panelFill } = useDataScienceTheme();
  const [alpha, setAlpha] = useState(0.85);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const states = useMemo(() => {
    let ranks = pageRankPages.map(() => 1 / pageRankPages.length);
    const result: { iteration: number; ranks: number[]; delta: number | null }[] = [
      { iteration: 0, ranks: [...ranks], delta: null },
    ];

    for (let iteration = 1; iteration <= 80; iteration += 1) {
      const next = pageRankPages.map(() => (1 - alpha) / pageRankPages.length);
      pageRankPages.forEach((page, sourceIndex) => {
        const links = pageRankOutlinks[page];
        if (links.length === 0) {
          const sinkShare = (alpha * ranks[sourceIndex]) / pageRankPages.length;
          for (let targetIndex = 0; targetIndex < pageRankPages.length; targetIndex += 1) {
            next[targetIndex] += sinkShare;
          }
          return;
        }
        const share = (alpha * ranks[sourceIndex]) / links.length;
        links.forEach((target) => {
          const targetIndex = pageRankIndex.get(target);
          if (targetIndex !== undefined) next[targetIndex] += share;
        });
      });
      const delta = next.reduce((sum, value, index) => sum + Math.abs(value - ranks[index]), 0);
      result.push({ iteration, ranks: next, delta });
      ranks = next;
      if (delta < 1e-5) break;
    }
    return result;
  }, [alpha]);
  const boundedStep = Math.min(stepIndex, states.length - 1);
  const current = states[boundedStep];
  const atEnd = boundedStep === states.length - 1 || (current.delta !== null && current.delta < 1e-5);
  const maxRank = Math.max(...current.ranks);
  const nodes = [
    { id: 'A', x: 118, y: 76, rank: current.ranks[0], color: primaryColor },
    { id: 'B', x: 58, y: 162, rank: current.ranks[1], color: secondaryColor },
    { id: 'C', x: 166, y: 178, rank: current.ranks[2], color: secondaryColor },
    { id: 'D', x: 238, y: 82, rank: current.ranks[3], color: primaryColor },
    { id: 'E', x: 238, y: 174, rank: current.ranks[4], color: secondaryColor },
  ];
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const edgePairs = pageRankPages.flatMap((source) => pageRankOutlinks[source].map((target) => [source, target] as const));
  const bars = nodes.map((node, index) => ({ ...node, x: 322, y: 40 + index * 34, width: 110 * (node.rank / maxRank) }));
  const leader = nodes.reduce((best, node) => (node.rank > best.rank ? node : best), nodes[0]);
  const buttonClass = isDarkMode
    ? 'rounded-md border border-green-500/30 bg-black/30 px-3 py-2 text-sm font-bold text-green-200 transition-colors hover:bg-green-500/10 disabled:cursor-not-allowed disabled:opacity-40'
    : 'rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40';

  useAutoRunner({
    playing,
    canAdvance: !atEnd,
    delay: 520,
    onAdvance: () => setStepIndex((step) => Math.min(states.length - 1, step + 1)),
    onStop: () => setPlaying(false),
  });

  return (
    <InteractiveBlock title="PageRank Power Iteration Runner">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(250px,340px)_minmax(0,1fr)]">
        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 block text-sm font-bold" htmlFor="pagerank-alpha">Damping alpha: {alpha.toFixed(2)}</label>
          <input
            id="pagerank-alpha"
            type="range"
            min="0.5"
            max="0.95"
            step="0.01"
            value={alpha}
            onChange={(event) => {
              setPlaying(false);
              setAlpha(Number(event.target.value));
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
            <button type="button" className={buttonClass} onClick={() => { setPlaying(false); setStepIndex((step) => Math.min(states.length - 1, step + 1)); }} disabled={atEnd}>
              Iterate
            </button>
          </div>
          <div className="mt-4 grid gap-2">
            <MetricTile label={<InlineMath math={'\\alpha'} />} value={alpha.toFixed(2)} />
            <MetricTile label="iteration" value={`${current.iteration} of ${states.length - 1}`} />
            <MetricTile label={<InlineMath math={'\\|r_k-r_{k-1}\\|_1'} />} value={current.delta === null ? 'initial' : current.delta.toFixed(5)} />
            <MetricTile label="current leader" value={`${leader.id} (${leader.rank.toFixed(3)})`} />
          </div>
        </div>
        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <svg viewBox="0 0 500 250" className="h-72 w-full" role="img" aria-label="Directed PageRank graph and PageRank score bars">
            <defs>
              <marker id="pagerank-live-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill={mutedColor} />
              </marker>
            </defs>
            <text x="154" y="26" textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>link graph</text>
            <text x="390" y="26" textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>rank</text>
            {edgePairs.map(([sourceId, targetId], index) => {
              const source = nodeById.get(sourceId)!;
              const target = nodeById.get(targetId)!;
              const dx = target.x - source.x;
              const dy = target.y - source.y;
              const length = Math.hypot(dx, dy) || 1;
              const sourceRadius = 18 + source.rank * 42;
              const targetRadius = 18 + target.rank * 42;
              const startX = source.x + (dx / length) * sourceRadius;
              const startY = source.y + (dy / length) * sourceRadius;
              const endX = target.x - (dx / length) * (targetRadius + 5);
              const endY = target.y - (dy / length) * (targetRadius + 5);
              const midX = (startX + endX) / 2;
              const midY = (startY + endY) / 2 - (index % 2 === 0 ? 18 : -12);
              return (
                <path
                  key={`${sourceId}-${targetId}`}
                  d={`M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`}
                  fill="none"
                  stroke={mutedColor}
                  strokeWidth="2"
                  strokeOpacity="0.55"
                  markerEnd="url(#pagerank-live-arrow)"
                />
              );
            })}
            {nodes.map((node) => (
              <g key={node.id}>
                <circle cx={node.x} cy={node.y} r={18 + node.rank * 42} fill={panelFill} stroke={node.color} strokeWidth="3" />
                <text x={node.x} y={node.y + 5} textAnchor="middle" fontFamily="monospace" fontSize="16" fontWeight="700" fill={textColor}>{node.id}</text>
              </g>
            ))}
            {bars.map((bar) => (
              <g key={bar.id}>
                <text x="306" y={bar.y + 12} textAnchor="end" fontFamily="monospace" fontSize="12" fill={textColor}>{bar.id}</text>
                <rect x={bar.x} y={bar.y} width="114" height="16" rx="5" fill="transparent" stroke={mutedColor} strokeWidth="1" />
                <rect x={bar.x} y={bar.y} width={bar.width} height="16" rx="5" fill={bar.color} fillOpacity="0.8" />
                <text x="486" y={bar.y + 12} textAnchor="end" fontFamily="monospace" fontSize="12" fill={textColor}>{bar.rank.toFixed(3)}</text>
              </g>
            ))}
          </svg>
          <VisualLegend
            items={[
              { label: 'directed link', color: mutedColor },
              { label: 'larger node means more rank mass', color: primaryColor },
            ]}
          />
          <NoteParagraph className="mb-0 text-sm">
            Each iteration distributes rank through outgoing links, adds teleportation, and stops once the rank vector barely changes.
          </NoteParagraph>
        </div>
      </div>
      <CodeBlock language="python" code={pageRankCode} />
    </InteractiveBlock>
  );
}

function GraphModelSketch() {
  const { subtlePanelClass, primaryColor, secondaryColor, mutedColor, textColor, panelFill } = useDataScienceTheme();
  const miniNodes = {
    random: [
      [50, 76],
      [86, 54],
      [113, 88],
      [62, 122],
      [103, 134],
      [133, 120],
    ],
    hub: [
      [214, 94],
      [175, 52],
      [244, 52],
      [162, 112],
      [256, 124],
      [198, 148],
      [232, 154],
    ],
    ring: [
      [328, 62],
      [370, 62],
      [396, 96],
      [376, 136],
      [328, 136],
      [302, 96],
    ],
  };
  const drawEdges = (nodes: number[][], edges: [number, number][], stroke = mutedColor) =>
    edges.map(([from, to], index) => (
      <line
        key={`${from}-${to}-${index}`}
        x1={nodes[from][0]}
        y1={nodes[from][1]}
        x2={nodes[to][0]}
        y2={nodes[to][1]}
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
    ));
  const drawNodes = (nodes: number[][], color: string, hubIndex?: number) =>
    nodes.map(([x, y], index) => (
      <circle
        key={`${x}-${y}`}
        cx={x}
        cy={y}
        r={index === hubIndex ? 8 : 5.5}
        fill={index === hubIndex ? secondaryColor : color}
        fillOpacity="0.86"
        stroke={panelFill}
        strokeWidth="1.5"
      />
    ));

  return (
    <InteractiveBlock title="Graph Model Patterns">
      <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
        <svg viewBox="0 0 430 220" className="h-60 w-full" role="img" aria-label="Comparison of Erdos-Renyi preferential attachment and Watts-Strogatz graph patterns">
          <rect x="24" y="28" width="126" height="146" rx="8" fill={panelFill} stroke={mutedColor} strokeOpacity="0.5" />
          <rect x="152" y="28" width="126" height="146" rx="8" fill={panelFill} stroke={mutedColor} strokeOpacity="0.5" />
          <rect x="280" y="28" width="126" height="146" rx="8" fill={panelFill} stroke={mutedColor} strokeOpacity="0.5" />
          {drawEdges(miniNodes.random, [[0, 1], [0, 3], [1, 2], [2, 5], [3, 4], [4, 5], [1, 4]])}
          {drawNodes(miniNodes.random, primaryColor)}
          {drawEdges(miniNodes.hub, [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [5, 6]], primaryColor)}
          {drawNodes(miniNodes.hub, primaryColor, 0)}
          {drawEdges(miniNodes.ring, [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [0, 2], [1, 3], [3, 5], [4, 0]])}
          <line x1="302" y1="96" x2="376" y2="136" stroke={secondaryColor} strokeWidth="2.5" strokeLinecap="round" strokeDasharray="5 4" />
          {drawNodes(miniNodes.ring, primaryColor)}
          <text x="87" y="198" textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>Erdos-Renyi</text>
          <text x="215" y="198" textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>preferential</text>
          <text x="343" y="198" textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>small-world</text>
        </svg>
        <VisualLegend
          items={[
            { label: 'ordinary edge', color: mutedColor },
            { label: 'hub or shortcut', color: secondaryColor },
          ]}
        />
        <NoteParagraph className="mb-0 text-sm">
          The model is a mechanism: independent edges look scattered, attachment creates hubs, and rewiring adds shortcuts to a clustered ring.
        </NoteParagraph>
      </div>
    </InteractiveBlock>
  );
}

function GradientDescentExplorer() {
  const { isDarkMode, subtlePanelClass, primaryColor, secondaryColor, mutedColor, textColor, panelFill } = useDataScienceTheme();
  const [learningRate, setLearningRate] = useState(0.08);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const trace = useMemo(() => {
    let w = [-0.8, 0.4];
    let b = -0.2;
    const result: { w: number[]; b: number; loss: number; gradNorm: number; accuracy: number }[] = [];

    for (let step = 0; step < 90; step += 1) {
      let gradW0 = 0;
      let gradW1 = 0;
      let gradB = 0;
      let loss = 0;
      let correct = 0;

      logisticTrainingExamples.forEach((example) => {
        const z = w[0] * example.x + w[1] * example.y + b;
        const probability = logisticSigmoid(z);
        loss += -(example.label * Math.log(Math.max(probability, 1e-12)) + (1 - example.label) * Math.log(Math.max(1 - probability, 1e-12)));
        const error = probability - example.label;
        gradW0 += error * example.x;
        gradW1 += error * example.y;
        gradB += error;
        if ((probability >= 0.5 ? 1 : 0) === example.label) correct += 1;
      });

      gradW0 /= logisticTrainingExamples.length;
      gradW1 /= logisticTrainingExamples.length;
      gradB /= logisticTrainingExamples.length;
      const gradNorm = Math.sqrt(gradW0 ** 2 + gradW1 ** 2 + gradB ** 2);
      result.push({ w: [...w], b, loss: loss / logisticTrainingExamples.length, gradNorm, accuracy: correct / logisticTrainingExamples.length });
      if (gradNorm < 1e-3) break;
      w = [w[0] - learningRate * gradW0, w[1] - learningRate * gradW1];
      b -= learningRate * gradB;
    }

    return result;
  }, [learningRate]);
  const boundedStep = Math.min(stepIndex, trace.length - 1);
  const current = trace[boundedStep];
  const atEnd = boundedStep === trace.length - 1 || current.gradNorm < 1e-3;
  const chart = { width: 460, height: 310, left: 44, top: 24, plotWidth: 348, plotHeight: 230 };
  const xCoord = (value: number) => chart.left + (value / 10) * chart.plotWidth;
  const yCoord = (value: number) => chart.top + chart.plotHeight - (value / 10) * chart.plotHeight;
  const boundaryCandidates: Point2D[] = [];
  if (Math.abs(current.w[1]) > 1e-9) {
    [0, 10].forEach((x) => {
      const y = -(current.w[0] * x + current.b) / current.w[1];
      if (y >= 0 && y <= 10) boundaryCandidates.push({ id: `x-${x}`, x, y });
    });
  }
  if (Math.abs(current.w[0]) > 1e-9) {
    [0, 10].forEach((y) => {
      const x = -(current.w[1] * y + current.b) / current.w[0];
      if (x >= 0 && x <= 10) boundaryCandidates.push({ id: `y-${y}`, x, y });
    });
  }
  const boundaryPoints = boundaryCandidates.filter(
    (point, index, points) =>
      points.findIndex((candidate) => Math.abs(candidate.x - point.x) < 1e-6 && Math.abs(candidate.y - point.y) < 1e-6) === index,
  );
  const boundarySegment = boundaryPoints.length >= 2 ? [boundaryPoints[0], boundaryPoints[1]] : null;
  const lossChart = { width: 460, height: 110, left: 44, top: 12, plotWidth: 348, plotHeight: 68 };
  const visibleLosses = trace.slice(0, boundedStep + 1);
  const maxLoss = Math.max(...trace.map((state) => state.loss), 1);
  const minLoss = Math.min(...trace.map((state) => state.loss));
  const lossX = (index: number) => lossChart.left + (index / Math.max(1, trace.length - 1)) * lossChart.plotWidth;
  const lossY = (value: number) =>
    lossChart.top + lossChart.plotHeight - ((value - minLoss) / Math.max(1e-9, maxLoss - minLoss)) * lossChart.plotHeight;
  const lossPath = visibleLosses.map((state, index) => `${index === 0 ? 'M' : 'L'} ${lossX(index)} ${lossY(state.loss)}`).join(' ');
  const buttonClass = isDarkMode
    ? 'rounded-md border border-green-500/30 bg-black/30 px-3 py-2 text-sm font-bold text-green-200 transition-colors hover:bg-green-500/10 disabled:cursor-not-allowed disabled:opacity-40'
    : 'rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40';

  useAutoRunner({
    playing,
    canAdvance: !atEnd,
    delay: 360,
    onAdvance: () => setStepIndex((step) => Math.min(trace.length - 1, step + 1)),
    onStop: () => setPlaying(false),
  });

  return (
    <InteractiveBlock title="Logistic Regression Gradient Descent">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(250px,340px)_minmax(0,1fr)]">
        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 block text-sm font-bold" htmlFor="logistic-gd-rate">Learning rate: {learningRate.toFixed(2)}</label>
          <input
            id="logistic-gd-rate"
            type="range"
            min="0.02"
            max="0.16"
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
            <button type="button" className={buttonClass} onClick={() => { setPlaying(false); setStepIndex((step) => Math.min(trace.length - 1, step + 1)); }} disabled={atEnd}>
              Train step
            </button>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <MetricTile label="iteration" value={`${boundedStep} of ${trace.length - 1}`} />
            <MetricTile label="cross entropy" value={current.loss.toFixed(4)} />
            <MetricTile label="accuracy" value={`${Math.round(current.accuracy * 100)}%`} />
            <MetricTile label="gradient norm" value={current.gradNorm.toFixed(4)} />
            <MetricTile label={<InlineMath math={'w'} />} value={`[${current.w.map((value) => value.toFixed(2)).join(', ')}]`} />
            <MetricTile label={<InlineMath math={'b'} />} value={current.b.toFixed(2)} />
          </div>
        </div>
        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className="h-80 w-full" role="img" aria-label="Logistic regression decision boundary moving during gradient descent">
            <rect x={chart.left} y={chart.top} width={chart.plotWidth} height={chart.plotHeight} rx="8" fill={panelFill} stroke={mutedColor} strokeOpacity="0.45" />
            {[0, 2, 4, 6, 8, 10].map((tick) => (
              <g key={tick}>
                <line x1={xCoord(tick)} y1={chart.top} x2={xCoord(tick)} y2={chart.top + chart.plotHeight} stroke={mutedColor} strokeOpacity="0.15" />
                <line x1={chart.left} y1={yCoord(tick)} x2={chart.left + chart.plotWidth} y2={yCoord(tick)} stroke={mutedColor} strokeOpacity="0.15" />
                <text x={xCoord(tick)} y={chart.top + chart.plotHeight + 18} textAnchor="middle" fontFamily="monospace" fontSize="10" fill={textColor}>{tick}</text>
              </g>
            ))}
            {boundarySegment && (
              <line
                x1={xCoord(boundarySegment[0].x)}
                y1={yCoord(boundarySegment[0].y)}
                x2={xCoord(boundarySegment[1].x)}
                y2={yCoord(boundarySegment[1].y)}
                stroke={textColor}
                strokeWidth="3"
                strokeDasharray="7 5"
              />
            )}
            {logisticTrainingExamples.map((example) => {
              const probability = logisticSigmoid(current.w[0] * example.x + current.w[1] * example.y + current.b);
              const predicted = probability >= 0.5 ? 1 : 0;
              const correct = predicted === example.label;
              const fill = example.label === 1 ? primaryColor : secondaryColor;
              return (
                <g key={`${example.x}-${example.y}`}>
                  <circle
                    cx={xCoord(example.x)}
                    cy={yCoord(example.y)}
                    r="7"
                    fill={fill}
                    fillOpacity="0.85"
                    stroke={correct ? panelFill : '#ef4444'}
                    strokeWidth={correct ? 1.5 : 3}
                  />
                </g>
              );
            })}
            <text x={chart.left + chart.plotWidth / 2} y={chart.height - 12} textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>feature 1</text>
            <text x="16" y={chart.top + chart.plotHeight / 2} transform={`rotate(-90 16 ${chart.top + chart.plotHeight / 2})`} textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>feature 2</text>
          </svg>
          <svg viewBox={`0 0 ${lossChart.width} ${lossChart.height}`} className="h-28 w-full" role="img" aria-label="Logistic regression loss history">
            <line x1={lossChart.left} y1={lossChart.top + lossChart.plotHeight} x2={lossChart.left + lossChart.plotWidth} y2={lossChart.top + lossChart.plotHeight} stroke={mutedColor} strokeWidth="2" />
            <line x1={lossChart.left} y1={lossChart.top} x2={lossChart.left} y2={lossChart.top + lossChart.plotHeight} stroke={mutedColor} strokeWidth="2" />
            <path d={lossPath} fill="none" stroke={primaryColor} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={lossX(boundedStep)} cy={lossY(current.loss)} r="4" fill={secondaryColor} />
            <text x={lossChart.left} y={lossChart.height - 8} fontFamily="monospace" fontSize="12" fill={textColor}>iteration</text>
            <text x={lossChart.left + lossChart.plotWidth} y={lossChart.top + 12} textAnchor="end" fontFamily="monospace" fontSize="12" fill={textColor}>loss</text>
          </svg>
          <VisualLegend
            items={[
              { label: 'label 1 examples', color: primaryColor },
              { label: 'label 0 examples', color: secondaryColor },
              { label: 'dashed decision boundary', color: textColor },
            ]}
          />
          <NoteParagraph className="mb-0 text-sm">
            The boundary moves because each gradient step reduces cross-entropy on the labeled examples.
          </NoteParagraph>
        </div>
      </div>
      <CodeBlock language="python" code={logisticGradientDescentCode} />
    </InteractiveBlock>
  );
}

function EvaluationExplorer() {
  const { subtlePanelClass, primaryColor, secondaryColor, mutedColor, textColor } = useDataScienceTheme();
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
  const chart = { width: 430, height: 265, left: 38, top: 24, plotWidth: 350 };
  const xCoord = (score: number) => chart.left + score * chart.plotWidth;
  const matrix = [
    { label: 'TP', value: counts.tp, x: 244, y: 148, color: primaryColor },
    { label: 'FP', value: counts.fp, x: 330, y: 148, color: secondaryColor },
    { label: 'FN', value: counts.fn, x: 244, y: 196, color: secondaryColor },
    { label: 'TN', value: counts.tn, x: 330, y: 196, color: mutedColor },
  ];

  return (
    <InteractiveBlock title="Threshold Metrics">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(250px,340px)_minmax(0,1fr)]">
        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
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
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <MetricTile label="precision" value={precision.toFixed(3)} />
            <MetricTile label="recall" value={recall.toFixed(3)} />
            <MetricTile label="accuracy" value={accuracy.toFixed(3)} />
            <MetricTile label={<InlineMath math={'F_1'} />} value={f1.toFixed(3)} />
          </div>
        </div>
        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className="h-72 w-full" role="img" aria-label="Prediction scores on an x-axis split by threshold with confusion matrix counts">
            <line x1={chart.left} y1="80" x2={chart.left + chart.plotWidth} y2="80" stroke={mutedColor} strokeWidth="2" />
            {[0, 0.5, 1].map((tick) => (
              <g key={tick}>
                <line x1={xCoord(tick)} y1="74" x2={xCoord(tick)} y2="86" stroke={mutedColor} strokeWidth="1.5" />
                <text x={xCoord(tick)} y="108" textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>{tick.toFixed(1)}</text>
              </g>
            ))}
            <line x1={xCoord(threshold)} y1="36" x2={xCoord(threshold)} y2="118" stroke={secondaryColor} strokeWidth="2.5" strokeDasharray="5 4" />
            <text x={xCoord(threshold)} y="28" textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>threshold</text>
            {examples.map((example, index) => {
              const predicted = example.score >= threshold;
              const y = predicted ? 62 : 94;
              const color = example.label === 1 ? primaryColor : mutedColor;
              return (
                <g key={`${example.score}-${index}`}>
                  <circle cx={xCoord(example.score)} cy={y} r="7" fill={color} fillOpacity={example.label === 1 ? 0.86 : 0.55} stroke={predicted ? secondaryColor : 'transparent'} strokeWidth="2" />
                  <text x={xCoord(example.score)} y={y - 12} textAnchor="middle" fontFamily="monospace" fontSize="10" fill={textColor}>{example.score.toFixed(2)}</text>
                </g>
              );
            })}
            <text x={chart.left + chart.plotWidth / 2} y="123" textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>predicted score</text>
            <text x="76" y="166" textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>actual +</text>
            <text x="76" y="214" textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>actual -</text>
            <text x="244" y="135" textAnchor="middle" fontFamily="monospace" fontSize="11" fill={textColor}>pred +</text>
            <text x="330" y="135" textAnchor="middle" fontFamily="monospace" fontSize="11" fill={textColor}>pred -</text>
            {matrix.map((cell) => (
              <g key={cell.label}>
                <rect x={cell.x - 34} y={cell.y} width="68" height="38" rx="6" fill={cell.color} fillOpacity="0.2" stroke={cell.color} strokeWidth="2" />
                <text x={cell.x} y={cell.y + 16} textAnchor="middle" fontFamily="monospace" fontSize="12" fontWeight="700" fill={textColor}>{cell.label}</text>
                <text x={cell.x} y={cell.y + 31} textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>{cell.value}</text>
              </g>
            ))}
          </svg>
          <VisualLegend
            items={[
              { label: 'true positive label', color: primaryColor },
              { label: 'predicted positive outline', color: secondaryColor, hollow: true },
              { label: 'true negative label', color: mutedColor },
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
  const { subtlePanelClass, primaryColor, secondaryColor, mutedColor, textColor } = useDataScienceTheme();
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
  const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const winner = sortedScores[0][0];
  const maxScore = Math.max(...Object.values(scores), 1);
  const candidateColors: Record<string, string> = { A: primaryColor, B: secondaryColor, C: mutedColor };

  return (
    <InteractiveBlock title="Rank Aggregation">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(250px,340px)_minmax(0,1fr)]">
        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
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
        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <svg viewBox="0 0 430 220" className="h-56 w-full" role="img" aria-label="Rank aggregation score bars by candidate">
            <text x="78" y="24" fontFamily="monospace" fontSize="12" fill={textColor}>candidate</text>
            <text x="208" y="24" textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>aggregate score</text>
            {sortedScores.map(([candidate, score], index) => {
              const y = 42 + index * 48;
              return (
                <g key={candidate}>
                  <text x="48" y={y + 14} textAnchor="middle" fontFamily="monospace" fontSize="16" fontWeight="700" fill={textColor}>{candidate}</text>
                  <rect x="78" y={y} width="260" height="18" rx="6" fill="transparent" stroke={mutedColor} strokeWidth="1" />
                  <rect x="78" y={y} width={(score / maxScore) * 260} height="18" rx="6" fill={candidateColors[candidate]} fillOpacity="0.82" />
                  <text x="360" y={y + 14} fontFamily="monospace" fontSize="12" fill={textColor}>{score}</text>
                  {candidate === winner && (
                    <text x="392" y={y + 14} fontFamily="monospace" fontSize="12" fontWeight="700" fill={textColor}>winner</text>
                  )}
                </g>
              );
            })}
            <text x="78" y="196" fontFamily="monospace" fontSize="12" fill={textColor}>method changes the meaning of score</text>
          </svg>
          <VisualLegend
            items={Object.keys(scores).map((candidate) => ({
              label: `candidate ${candidate}`,
              color: candidateColors[candidate],
            }))}
          />
          <NoteParagraph className="mb-0 text-sm">
            Winner under this method: <strong>{winner}</strong>. Different aggregation rules can choose different winners.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function EmLoopRunner() {
  const { isDarkMode, subtlePanelClass, primaryColor, secondaryColor, mutedColor, textColor } = useDataScienceTheme();
  const [iteration, setIteration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const variance = 4.0;
  const states = useMemo(() => {
  let means = [1.5, 2.5];
    let priors = [0.5, 0.5];
    const result: { means: number[]; priors: number[]; responsibilities: number[]; logLikelihood: number }[] = [];

    for (let step = 0; step <= 24; step += 1) {
      const responsibilities = emMixtureData.map((x) => {
        const left = priors[0] * normalPdf(x, means[0], variance);
        const right = priors[1] * normalPdf(x, means[1], variance);
        return left / (left + right);
      });
      const logLikelihood = emMixtureData.reduce((sum, x) => {
        const mixtureDensity = priors[0] * normalPdf(x, means[0], variance) + priors[1] * normalPdf(x, means[1], variance);
        return sum + Math.log(Math.max(mixtureDensity, 1e-12));
      }, 0);
      result.push({ means: [...means], priors: [...priors], responsibilities, logLikelihood });

      const leftMass = responsibilities.reduce((sum, value) => sum + value, 0);
      const rightMass = emMixtureData.length - leftMass;
      means = [
        emMixtureData.reduce((sum, x, index) => sum + responsibilities[index] * x, 0) / leftMass,
        emMixtureData.reduce((sum, x, index) => sum + (1 - responsibilities[index]) * x, 0) / rightMass,
      ];
      priors = [leftMass / emMixtureData.length, rightMass / emMixtureData.length];
    }

    return result;
  }, []);
  const boundedIteration = Math.min(iteration, states.length - 1);
  const current = states[boundedIteration];
  const previousLogLikelihood = states[Math.max(0, boundedIteration - 1)].logLikelihood;
  const converged = boundedIteration > 0 && Math.abs(current.logLikelihood - previousLogLikelihood) < 1e-4;
  const atEnd = boundedIteration === states.length - 1 || converged;
  const xMin = -2.3;
  const xMax = 6.7;
  const chart = { width: 430, height: 250, left: 42, top: 28, plotWidth: 230, axisY: 132 };
  const xCoord = (value: number) => chart.left + ((value - xMin) / (xMax - xMin)) * chart.plotWidth;
  const meanTrace = states.slice(Math.max(0, boundedIteration - 11), boundedIteration + 1);
  const buttonClass = isDarkMode
    ? 'rounded-md border border-green-500/30 bg-black/30 px-3 py-2 text-sm font-bold text-green-200 transition-colors hover:bg-green-500/10 disabled:cursor-not-allowed disabled:opacity-40'
    : 'rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40';

  useAutoRunner({
    playing,
    canAdvance: !atEnd,
    delay: 800,
    onAdvance: () => setIteration((step) => Math.min(states.length - 1, step + 1)),
    onStop: () => setPlaying(false),
  });

  return (
    <InteractiveBlock title="EM Loop Runner">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(250px,340px)_minmax(0,1fr)]">
        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <p className="mb-3 text-sm font-bold uppercase tracking-wider">Iteration {boundedIteration}</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={buttonClass} onClick={() => toggleOrReplayRunner(atEnd, setPlaying, () => setIteration(0))}>
              {getRunnerPlayLabel(playing, atEnd)}
            </button>
            <button type="button" className={buttonClass} onClick={() => { setPlaying(false); setIteration(0); }} disabled={boundedIteration === 0}>
              Reset
            </button>
            <button type="button" className={buttonClass} onClick={() => { setPlaying(false); setIteration((step) => Math.max(0, step - 1)); }} disabled={boundedIteration === 0}>
              Back
            </button>
            <button
              type="button"
              className={buttonClass}
              onClick={() => { setPlaying(false); setIteration((step) => Math.min(states.length - 1, step + 1)); }}
              disabled={atEnd}
            >
              EM step
            </button>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <MetricTile label={<InlineMath math={'\\mu_1'} />} value={current.means[0].toFixed(3)} />
            <MetricTile label={<InlineMath math={'\\mu_2'} />} value={current.means[1].toFixed(3)} />
            <MetricTile label={<InlineMath math={'\\pi_1'} />} value={current.priors[0].toFixed(3)} />
            <MetricTile label={<InlineMath math={'\\pi_2'} />} value={current.priors[1].toFixed(3)} />
            <MetricTile label="log likelihood" value={current.logLikelihood.toFixed(3)} />
          </div>
        </div>

        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className="h-64 w-full" role="img" aria-label="EM responsibilities for a one-dimensional Gaussian mixture">
            <line x1={chart.left} y1={chart.axisY} x2={chart.left + chart.plotWidth} y2={chart.axisY} stroke={mutedColor} strokeWidth="2" />
            {[-2, 0, 2, 4, 6].map((tick) => (
              <g key={tick}>
                <line x1={xCoord(tick)} y1={chart.axisY - 5} x2={xCoord(tick)} y2={chart.axisY + 5} stroke={mutedColor} strokeWidth="1.5" />
                <text x={xCoord(tick)} y={chart.axisY + 24} textAnchor="middle" fontFamily="monospace" fontSize="11" fill={textColor}>{tick}</text>
              </g>
            ))}
            {meanTrace.map((state, traceIndex) =>
              state.means.map((mean, componentIndex) => {
                const isCurrentTrace = traceIndex === meanTrace.length - 1;
                const color = componentIndex === 0 ? primaryColor : secondaryColor;
                return (
                  <circle
                    key={`mean-trace-${traceIndex}-${componentIndex}`}
                    cx={xCoord(mean)}
                    cy={componentIndex === 0 ? 54 : 68}
                    r={isCurrentTrace ? 4 : 2.5}
                    fill={color}
                    fillOpacity={isCurrentTrace ? 0.72 : 0.18 + (traceIndex / Math.max(1, meanTrace.length - 1)) * 0.32}
                  />
                );
              }),
            )}
            {current.means.map((mean, index) => (
              <g key={index}>
                <line x1={xCoord(mean)} y1="42" x2={xCoord(mean)} y2={chart.axisY - 20} stroke={index === 0 ? primaryColor : secondaryColor} strokeWidth="3" />
                <path d={`M ${xCoord(mean)} 36 l 8 8 l -8 8 l -8 -8 Z`} fill={index === 0 ? primaryColor : secondaryColor} />
                <text x={xCoord(mean)} y="25" textAnchor="middle" fontFamily="monospace" fontSize="11" fill={textColor}>mu{index + 1}</text>
              </g>
            ))}
            {emMixtureData.map((x, index) => {
              const gamma = current.responsibilities[index];
              const y = chart.axisY - 58 + index * 12;
              return (
                <g key={x}>
                  <line x1={xCoord(x)} y1={chart.axisY - 16} x2={xCoord(x)} y2={chart.axisY + 16} stroke={mutedColor} strokeOpacity="0.35" />
                  <circle cx={xCoord(x)} cy={chart.axisY} r="6" fill={gamma >= 0.5 ? primaryColor : secondaryColor} fillOpacity="0.82" />
                  <rect x="302" y={y} width="82" height="8" rx="3" fill={secondaryColor} fillOpacity="0.2" />
                  <rect x="302" y={y} width={gamma * 82} height="8" rx="3" fill={primaryColor} fillOpacity="0.85" />
                  <text x="292" y={y + 8} textAnchor="end" fontFamily="monospace" fontSize="10" fill={textColor}>{x.toFixed(1)}</text>
                </g>
              );
            })}
            <text x="302" y="60" fontFamily="monospace" fontSize="11" fill={textColor}>responsibility to component 1</text>
            <text x={chart.left + chart.plotWidth / 2} y="232" textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>feature value</text>
          </svg>
          <VisualLegend
            items={[
              { label: 'component 1 mass', color: primaryColor },
              { label: 'component 2 mass', color: secondaryColor },
            ]}
          />
        </div>
      </div>
      <CodeBlock language="python" code={emLoopCode} />
    </InteractiveBlock>
  );
}

function KMeansConvergenceRunner() {
  const { isDarkMode, subtlePanelClass, primaryColor, secondaryColor, mutedColor, textColor, panelFill } = useDataScienceTheme();
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const clusterColors = [primaryColor, secondaryColor, '#a855f7'];
  const steps = useMemo(() => {
    let centers = initialKMeansCenters.map((center) => ({ ...center }));
    const result: {
      centers: Point2D[];
      assignments: number[];
      updatedCenters: Point2D[];
      shift: number;
      inertia: number;
      converged: boolean;
    }[] = [];

    for (let step = 0; step < 20; step += 1) {
      const assignments = kmeansPoints.map((point) => {
        let bestCluster = 0;
        let bestDistance = squaredDistance2D(point, centers[0]);
        for (let cluster = 1; cluster < centers.length; cluster += 1) {
          const distance = squaredDistance2D(point, centers[cluster]);
          if (distance < bestDistance) {
            bestCluster = cluster;
            bestDistance = distance;
          }
        }
        return bestCluster;
      });
      const inertia = kmeansPoints.reduce((sum, point, index) => sum + squaredDistance2D(point, centers[assignments[index]]), 0);
      const updatedCenters = centers.map((center, cluster) => {
        const assignedPoints = kmeansPoints.filter((_, index) => assignments[index] === cluster);
        if (assignedPoints.length === 0) return { ...center };
        return {
          ...center,
          x: assignedPoints.reduce((sum, point) => sum + point.x, 0) / assignedPoints.length,
          y: assignedPoints.reduce((sum, point) => sum + point.y, 0) / assignedPoints.length,
        };
      });
      const shift = Math.max(...updatedCenters.map((center, index) => Math.sqrt(squaredDistance2D(center, centers[index]))));
      const converged = shift < 1e-4;
      result.push({
        centers: centers.map((center) => ({ ...center })),
        assignments,
        updatedCenters,
        shift,
        inertia,
        converged,
      });
      centers = updatedCenters;
      if (converged) break;
    }
    return result;
  }, []);
  const boundedStep = Math.min(stepIndex, steps.length - 1);
  const current = steps[boundedStep];
  const atEnd = boundedStep === steps.length - 1 || current.converged;
  const counts = current.assignments.reduce(
    (totals, assignment) => {
      totals[assignment] += 1;
      return totals;
    },
    [0, 0, 0],
  );
  const chart = { width: 460, height: 330, left: 44, top: 24, plotWidth: 348, plotHeight: 246 };
  const xCoord = (value: number) => chart.left + (value / 10) * chart.plotWidth;
  const yCoord = (value: number) => chart.top + chart.plotHeight - (value / 10) * chart.plotHeight;
  const buttonClass = isDarkMode
    ? 'rounded-md border border-green-500/30 bg-black/30 px-3 py-2 text-sm font-bold text-green-200 transition-colors hover:bg-green-500/10 disabled:cursor-not-allowed disabled:opacity-40'
    : 'rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40';

  useAutoRunner({
    playing,
    canAdvance: !atEnd,
    delay: 850,
    onAdvance: () => setStepIndex((step) => Math.min(steps.length - 1, step + 1)),
    onStop: () => setPlaying(false),
  });

  return (
    <InteractiveBlock title="KMeans Clustering Runner">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(250px,340px)_minmax(0,1fr)]">
        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <p className="mb-3 text-sm font-bold uppercase tracking-wider">Iteration {boundedStep + 1}</p>
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
            <button
              type="button"
              className={buttonClass}
              onClick={() => { setPlaying(false); setStepIndex((step) => Math.min(steps.length - 1, step + 1)); }}
              disabled={atEnd}
            >
              Step
            </button>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <MetricTile label="inertia" value={current.inertia.toFixed(2)} />
            <MetricTile label="largest center move" value={current.shift.toFixed(3)} />
            <MetricTile label="cluster sizes" value={counts.join(' / ')} />
            <MetricTile label="status" value={current.converged ? 'converged' : 'updating means'} />
          </div>
          <p className="mt-4 text-sm">{current.converged ? 'Centers no longer move, so the run has converged.' : 'Assign every point to its nearest center, then move each center to its assigned mean.'}</p>
        </div>

        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className="h-80 w-full" role="img" aria-label="KMeans convergence over two-dimensional points">
            <rect x={chart.left} y={chart.top} width={chart.plotWidth} height={chart.plotHeight} rx="8" fill={panelFill} stroke={mutedColor} strokeOpacity="0.45" />
            {[0, 2, 4, 6, 8, 10].map((tick) => (
              <g key={tick}>
                <line x1={xCoord(tick)} y1={chart.top} x2={xCoord(tick)} y2={chart.top + chart.plotHeight} stroke={mutedColor} strokeOpacity="0.16" />
                <line x1={chart.left} y1={yCoord(tick)} x2={chart.left + chart.plotWidth} y2={yCoord(tick)} stroke={mutedColor} strokeOpacity="0.16" />
                <text x={xCoord(tick)} y={chart.top + chart.plotHeight + 18} textAnchor="middle" fontFamily="monospace" fontSize="10" fill={textColor}>{tick}</text>
              </g>
            ))}
            {kmeansPoints.map((point, index) => {
              const cluster = current.assignments[index];
              const color = clusterColors[cluster];
              const center = current.centers[cluster];
              return (
                <g key={point.id}>
                  <line x1={xCoord(point.x)} y1={yCoord(point.y)} x2={xCoord(center.x)} y2={yCoord(center.y)} stroke={color} strokeOpacity="0.26" strokeWidth="1.5" />
                  <circle cx={xCoord(point.x)} cy={yCoord(point.y)} r="6" fill={color} fillOpacity="0.88" stroke={panelFill} strokeWidth="1.5" />
                </g>
              );
            })}
            {current.centers.map((center, index) => {
              const color = clusterColors[index];
              const updated = current.updatedCenters[index];
              return (
                <g key={index}>
                  <line x1={xCoord(center.x)} y1={yCoord(center.y)} x2={xCoord(updated.x)} y2={yCoord(updated.y)} stroke={color} strokeWidth="2.5" strokeDasharray="6 5" />
                  <path d={`M ${xCoord(center.x)} ${yCoord(center.y) - 11} l 11 11 l -11 11 l -11 -11 Z`} fill={color} stroke={panelFill} strokeWidth="1.5" />
                  <circle cx={xCoord(updated.x)} cy={yCoord(updated.y)} r="10" fill="transparent" stroke={color} strokeWidth="3" />
                </g>
              );
            })}
            <text x={chart.left + chart.plotWidth / 2} y={chart.height - 12} textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>feature 1</text>
            <text x="16" y={chart.top + chart.plotHeight / 2} transform={`rotate(-90 16 ${chart.top + chart.plotHeight / 2})`} textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>feature 2</text>
          </svg>
          <VisualLegend
            items={[
              { label: 'cluster 1', color: clusterColors[0] },
              { label: 'cluster 2', color: clusterColors[1] },
              { label: 'cluster 3', color: clusterColors[2] },
              { label: 'open circle is updated mean', color: mutedColor, hollow: true },
            ]}
          />
        </div>
      </div>
      <CodeBlock language="python" code={kMeansCode} />
    </InteractiveBlock>
  );
}

function EditDistanceRunner() {
  const { isDarkMode, subtlePanelClass, primaryColor, secondaryColor, mutedColor } = useDataScienceTheme();
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const source = 'kitten';
  const target = 'sitting';
  const rows = source.length + 1;
  const columns = target.length + 1;
  const dp = Array.from({ length: rows }, () => Array.from({ length: columns }, () => 0));

  for (let row = 0; row < rows; row += 1) dp[row][0] = row;
  for (let column = 0; column < columns; column += 1) dp[0][column] = column;
  for (let row = 1; row < rows; row += 1) {
    for (let column = 1; column < columns; column += 1) {
      const cost = source[row - 1] === target[column - 1] ? 0 : 1;
      dp[row][column] = Math.min(
        dp[row - 1][column] + 1,
        dp[row][column - 1] + 1,
        dp[row - 1][column - 1] + cost,
      );
    }
  }

  const maxStep = rows * columns - 1;
  const boundedStep = Math.min(stepIndex, maxStep);
  const atEnd = boundedStep === maxStep;
  const activeRow = Math.floor(boundedStep / columns);
  const activeColumn = boundedStep % columns;
  const buttonClass = isDarkMode
    ? 'rounded-md border border-green-500/30 bg-black/30 px-3 py-2 text-sm font-bold text-green-200 transition-colors hover:bg-green-500/10 disabled:cursor-not-allowed disabled:opacity-40'
    : 'rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40';

  useAutoRunner({
    playing,
    canAdvance: !atEnd,
    delay: 115,
    onAdvance: () => setStepIndex((step) => Math.min(maxStep, step + 1)),
    onStop: () => setPlaying(false),
  });

  return (
    <InteractiveBlock title="Edit Distance Dynamic Program">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(250px,320px)_minmax(0,1fr)]">
        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <p className="mb-3 text-sm">
            Source <strong>{source}</strong>, target <strong>{target}</strong>
          </p>
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
              Fill cell
            </button>
          </div>
          <div className="mt-4 grid gap-2">
            <MetricTile label="active cell" value={`(${activeRow}, ${activeColumn})`} />
            <MetricTile label="current value" value={dp[activeRow][activeColumn]} />
            <MetricTile label="final distance" value={boundedStep === maxStep ? dp[source.length][target.length] : 'not fully filled'} />
          </div>
        </div>

        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <div className="overflow-x-auto">
            <table className="min-w-[420px] border-collapse text-center text-sm">
              <tbody>
                <tr>
                  <td className="h-9 w-10" />
                  <td className="h-9 w-10 text-xs text-current/60">eps</td>
                  {target.split('').map((char) => (
                    <td key={char} className="h-9 w-10 font-bold">{char}</td>
                  ))}
                </tr>
                {dp.map((rowValues, row) => (
                  <tr key={row}>
                    <td className="h-9 w-10 font-bold">{row === 0 ? 'eps' : source[row - 1]}</td>
                    {rowValues.map((value, column) => {
                      const cellIndex = row * columns + column;
                      const isFilled = cellIndex <= boundedStep;
                      const isActive = row === activeRow && column === activeColumn;
                      return (
                        <td
                          key={`${row}-${column}`}
                          className={`h-9 w-10 border ${
                            isDarkMode ? 'border-green-500/20' : 'border-slate-200'
                          } ${
                            isActive
                              ? isDarkMode
                                ? 'bg-green-400 text-black'
                                : 'bg-blue-500 text-white'
                              : isFilled
                                ? isDarkMode
                                  ? 'bg-green-500/10'
                                  : 'bg-blue-50'
                                : ''
                          }`}
                        >
                          {isFilled ? value : ''}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <VisualLegend
            items={[
              { label: 'filled DP cell', color: primaryColor },
              { label: 'active cell', color: secondaryColor },
              { label: 'unfilled future cell', color: mutedColor, hollow: true },
            ]}
          />
          <p className="text-sm">Each cell stores the best cost for converting prefixes of the two strings.</p>
        </div>
      </div>
      <CodeBlock language="python" code={editDistanceCode} />
    </InteractiveBlock>
  );
}

function HierarchicalClusteringRunner() {
  const { isDarkMode, subtlePanelClass, primaryColor, secondaryColor, mutedColor, textColor } = useDataScienceTheme();
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const points = [
    { id: 'A', x: 0 },
    { id: 'B', x: 0.8 },
    { id: 'C', x: 2.6 },
    { id: 'D', x: 3.1 },
    { id: 'E', x: 5.2 },
    { id: 'F', x: 6 },
    { id: 'G', x: 8.4 },
    { id: 'H', x: 9.1 },
  ];
  const pointMap = new Map(points.map((point) => [point.id, point.x]));
  const steps = (() => {
    const clusters = points.map((point) => [point.id]);
    const result: { clusters: string[][]; merge: string; distance: number | null }[] = [
      { clusters: clusters.map((cluster) => [...cluster]), merge: 'start with singleton clusters', distance: null },
    ];
    const singleLinkDistance = (left: string[], right: string[]) =>
      Math.min(...left.flatMap((leftId) => right.map((rightId) => Math.abs((pointMap.get(leftId) ?? 0) - (pointMap.get(rightId) ?? 0)))));

    while (clusters.length > 1) {
      let bestI = 0;
      let bestJ = 1;
      let bestDistance = singleLinkDistance(clusters[0], clusters[1]);
      for (let i = 0; i < clusters.length; i += 1) {
        for (let j = i + 1; j < clusters.length; j += 1) {
          const distance = singleLinkDistance(clusters[i], clusters[j]);
          if (distance < bestDistance) {
            bestI = i;
            bestJ = j;
            bestDistance = distance;
          }
        }
      }
      const left = clusters[bestI];
      const right = clusters[bestJ];
      clusters[bestI] = [...left, ...right].sort();
      clusters.splice(bestJ, 1);
      result.push({
        clusters: clusters.map((cluster) => [...cluster]),
        merge: `merge {${left.join(',')}} with {${right.join(',')}}`,
        distance: bestDistance,
      });
    }

    return result;
  })();
  const boundedStep = Math.min(stepIndex, steps.length - 1);
  const current = steps[boundedStep];
  const atEnd = boundedStep === steps.length - 1;
  const chart = { width: 430, height: 280, left: 40, plotWidth: 340, axisY: 92 };
  const maxPoint = Math.max(...points.map((point) => point.x));
  const xCoord = (value: number) => chart.left + (value / maxPoint) * chart.plotWidth;
  const clusterColor = (index: number) => [primaryColor, secondaryColor, '#a855f7', '#f59e0b', mutedColor][index] ?? mutedColor;
  const buttonClass = isDarkMode
    ? 'rounded-md border border-green-500/30 bg-black/30 px-3 py-2 text-sm font-bold text-green-200 transition-colors hover:bg-green-500/10 disabled:cursor-not-allowed disabled:opacity-40'
    : 'rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40';

  useAutoRunner({
    playing,
    canAdvance: !atEnd,
    delay: 800,
    onAdvance: () => setStepIndex((step) => Math.min(steps.length - 1, step + 1)),
    onStop: () => setPlaying(false),
  });

  return (
    <InteractiveBlock title="Agglomerative Clustering Runner">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(250px,320px)_minmax(0,1fr)]">
        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <p className="mb-3 text-sm font-bold uppercase tracking-wider">Step {boundedStep}</p>
          <p className="mb-4 text-sm">{current.merge}</p>
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
            <button type="button" className={buttonClass} onClick={() => { setPlaying(false); setStepIndex((step) => Math.min(steps.length - 1, step + 1)); }} disabled={atEnd}>
              Merge closest
            </button>
          </div>
          <div className="mt-4 grid gap-2">
            <MetricTile label="clusters" value={current.clusters.map((cluster) => `{${cluster.join(',')}}`).join(' ')} />
            <MetricTile label="single-link distance" value={current.distance === null ? 'none yet' : current.distance} />
          </div>
        </div>

        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className="h-72 w-full" role="img" aria-label="Agglomerative clustering merges on a one-dimensional line">
            <line x1={chart.left} y1={chart.axisY} x2={chart.left + chart.plotWidth} y2={chart.axisY} stroke={mutedColor} strokeWidth="2" />
            {points.map((point) => (
              <g key={point.id}>
                <circle cx={xCoord(point.x)} cy={chart.axisY} r="6" fill={textColor} />
                <text x={xCoord(point.x)} y={chart.axisY + 24} textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>{point.id}</text>
              </g>
            ))}
            {current.clusters.map((cluster, index) => {
              const xs = cluster.map((id) => pointMap.get(id) ?? 0);
              const minX = Math.min(...xs);
              const maxX = Math.max(...xs);
              return (
                <g key={cluster.join('-')}>
                  <rect
                    x={xCoord(minX) - 13}
                    y={136 + index * 14}
                    width={Math.max(26, xCoord(maxX) - xCoord(minX) + 26)}
                    height="10"
                    rx="5"
                    fill={clusterColor(index)}
                    fillOpacity="0.35"
                    stroke={clusterColor(index)}
                    strokeWidth="1.5"
                  />
                </g>
              );
            })}
            <text x="214" y="264" textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>single-link clusters after each merge</text>
          </svg>
        </div>
      </div>
      <CodeBlock language="python" code={agglomerativeCode} />
    </InteractiveBlock>
  );
}

function PowerMethodRunner() {
  const { isDarkMode, subtlePanelClass, primaryColor, secondaryColor, mutedColor } = useDataScienceTheme();
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const states = useMemo(() => {
    let vector = [1 / 3, 1 / 3, 1 / 3];
    const result = [vector];
    for (let step = 0; step < 30; step += 1) {
      const next = [0, 0, 0];
      for (let row = 0; row < 3; row += 1) {
        for (let column = 0; column < 3; column += 1) {
          next[column] += vector[row] * powerMethodMatrix[row][column];
        }
      }
      vector = next;
      result.push(vector);
      const previous = result[result.length - 2];
      const delta = vector.reduce((sum, value, index) => sum + Math.abs(value - previous[index]), 0);
      if (delta < 1e-4) break;
    }
    return result;
  }, []);
  const boundedStep = Math.min(stepIndex, states.length - 1);
  const current = states[boundedStep];
  const previous = states[Math.max(0, boundedStep - 1)];
  const delta = current.reduce((sum, value, index) => sum + Math.abs(value - previous[index]), 0);
  const atEnd = boundedStep === states.length - 1 || (boundedStep > 0 && delta < 1e-4);
  const colors = [primaryColor, secondaryColor, mutedColor];
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
    <InteractiveBlock title="Power Method Runner">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(250px,320px)_minmax(0,1fr)]">
        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <p className="mb-3 text-sm font-bold uppercase tracking-wider">Iteration {boundedStep}</p>
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
            <button type="button" className={buttonClass} onClick={() => { setPlaying(false); setStepIndex((step) => Math.min(states.length - 1, step + 1)); }} disabled={atEnd}>
              Multiply by M
            </button>
          </div>
          <div className="mt-4 grid gap-2">
            <MetricTile label={<InlineMath math={'\\|x_k-x_{k-1}\\|_1'} />} value={delta.toFixed(5)} />
            <MetricTile label="sum check" value={current.reduce((sum, value) => sum + value, 0).toFixed(3)} />
          </div>
        </div>

        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <div className="grid gap-3">
            {current.map((value, index) => (
              <div key={index}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>state {index + 1}</span>
                  <span>{value.toFixed(4)}</span>
                </div>
                <div className={isDarkMode ? 'h-4 rounded bg-black/40' : 'h-4 rounded bg-slate-200'}>
                  <div className="h-4 rounded" style={{ width: `${value * 100}%`, backgroundColor: colors[index] }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full border-collapse text-center text-sm">
              <tbody>
                {powerMethodMatrix.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((value, columnIndex) => (
                      <td key={`${rowIndex}-${columnIndex}`} className={`border p-2 ${isDarkMode ? 'border-green-500/20' : 'border-slate-200'}`}>
                        {value.toFixed(1)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm">The vector stabilizes when repeated multiplication no longer changes the distribution much.</p>
        </div>
      </div>
      <CodeBlock language="python" code={powerMethodCode} />
    </InteractiveBlock>
  );
}

function TopKThresholdRunner() {
  const { isDarkMode, subtlePanelClass, primaryColor, secondaryColor, mutedColor, textColor } = useDataScienceTheme();
  const [depth, setDepth] = useState(1);
  const [playing, setPlaying] = useState(false);
  const k = 3;
  const objects = {
    A: [0.98, 0.10],
    B: [0.91, 0.45],
    C: [0.86, 0.88],
    D: [0.72, 0.71],
    E: [0.64, 0.96],
    F: [0.52, 0.72],
    G: [0.43, 0.83],
    H: [0.31, 0.58],
  } as const;
  const list1 = Object.entries(objects).sort((a, b) => b[1][0] - a[1][0]);
  const list2 = Object.entries(objects).sort((a, b) => b[1][1] - a[1][1]);
  const seen = new Set([...list1.slice(0, depth).map(([id]) => id), ...list2.slice(0, depth).map(([id]) => id)]);
  const fullScores = Object.entries(objects).map(([id, scores]) => ({ id, score: scores[0] + scores[1], scores }));
  const knownScores = fullScores.filter((item) => seen.has(item.id)).sort((a, b) => b.score - a.score);
  const threshold = list1[depth - 1][1][0] + list2[depth - 1][1][1];
  const secondBestKnown = knownScores[k - 1]?.score ?? 0;
  const canStop = knownScores.length >= k && secondBestKnown >= threshold;
  const atEnd = depth === list1.length || canStop;
  const maxScore = Math.max(...fullScores.map((item) => item.score));
  const buttonClass = isDarkMode
    ? 'rounded-md border border-green-500/30 bg-black/30 px-3 py-2 text-sm font-bold text-green-200 transition-colors hover:bg-green-500/10 disabled:cursor-not-allowed disabled:opacity-40'
    : 'rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40';

  useAutoRunner({
    playing,
    canAdvance: !atEnd,
    delay: 750,
    onAdvance: () => setDepth((value) => Math.min(list1.length, value + 1)),
    onStop: () => setPlaying(false),
  });

  return (
    <InteractiveBlock title="Top-k Threshold Runner">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(250px,320px)_minmax(0,1fr)]">
        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <p className="mb-3 text-sm font-bold uppercase tracking-wider">Depth {depth}</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={buttonClass} onClick={() => toggleOrReplayRunner(atEnd, setPlaying, () => setDepth(1))}>
              {getRunnerPlayLabel(playing, atEnd)}
            </button>
            <button type="button" className={buttonClass} onClick={() => { setPlaying(false); setDepth(1); }} disabled={depth === 1}>
              Reset
            </button>
            <button type="button" className={buttonClass} onClick={() => { setPlaying(false); setDepth((value) => Math.max(1, value - 1)); }} disabled={depth === 1}>
              Back
            </button>
            <button type="button" className={buttonClass} onClick={() => { setPlaying(false); setDepth((value) => Math.min(list1.length, value + 1)); }} disabled={atEnd}>
              Read next row
            </button>
          </div>
          <div className="mt-4 grid gap-2">
            <MetricTile label="threshold" value={threshold.toFixed(2)} />
            <MetricTile label="known objects" value={[...seen].join(', ')} />
            <MetricTile label="stop condition" value={canStop ? 'top-k certified' : 'keep scanning'} />
          </div>
        </div>

        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            {[list1, list2].map((list, listIndex) => (
              <div key={listIndex} className={`rounded-md border p-3 ${isDarkMode ? 'border-green-500/20 bg-black/20' : 'border-slate-200 bg-white/75'}`}>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider">score list {listIndex + 1}</p>
                {list.map(([id, scores], index) => (
                  <div key={id} className={`flex justify-between gap-3 py-1 text-sm ${index < depth ? 'font-bold' : 'opacity-55'}`}>
                    <span>{id}</span>
                    <span>{scores[listIndex].toFixed(2)}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <svg viewBox="0 0 430 280" className="h-72 w-full" role="img" aria-label="Known aggregate scores for threshold top-k retrieval">
            {fullScores.sort((a, b) => b.score - a.score).map((item, index) => {
              const y = 20 + index * 30;
              const known = seen.has(item.id);
              const inTopK = knownScores.slice(0, k).some((candidate) => candidate.id === item.id);
              return (
                <g key={item.id}>
                  <text x="34" y={y + 14} textAnchor="middle" fontFamily="monospace" fontSize="13" fontWeight="700" fill={textColor}>{item.id}</text>
                  <rect x="64" y={y} width="270" height="16" rx="5" fill="transparent" stroke={mutedColor} strokeWidth="1" />
                  <rect
                    x="64"
                    y={y}
                    width={(item.score / maxScore) * 270}
                    height="16"
                    rx="5"
                    fill={known ? (inTopK ? primaryColor : secondaryColor) : mutedColor}
                    fillOpacity={known ? 0.82 : 0.22}
                  />
                  <text x="356" y={y + 13} fontFamily="monospace" fontSize="12" fill={textColor}>{known ? item.score.toFixed(2) : 'unseen'}</text>
                </g>
              );
            })}
          </svg>
          <p className="text-sm">
            The algorithm can stop when the kth known score is at least the score any unseen object could still reach.
          </p>
        </div>
      </div>
      <CodeBlock language="python" code={topKThresholdCode} />
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
      <EmLoopRunner />

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
      <KMeansConvergenceRunner />

      <NoteSectionTitle id="dbscan">13. DBSCAN</NoteSectionTitle>
      <NoteParagraph>
        DBSCAN clusters points by density instead of assigning every point to the nearest center. It uses a radius <InlineMath math={'\\epsilon'} /> and a
        minimum neighbor count.
      </NoteParagraph>
      <DbscanExplorer />
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
        Singular Value Decomposition factors a matrix as <InlineMath math={'X=U\\Sigma V^T'} />. The singular values in <InlineMath math={'\\Sigma'} />{' '}
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
      <EditDistanceRunner />

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
      <HierarchicalClusteringRunner />

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
      <GraphModelSketch />
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
          <span>Otherwise set <InlineMath math={'k\\leftarrow k+1'} /> and repeat.</span>,
        ]}
      />
      <PowerMethodRunner />

      <NoteSectionTitle id="pagerank">29. PageRank</NoteSectionTitle>
      <NoteParagraph>
        PageRank models a random web surfer who follows links with probability <InlineMath math={'\\alpha'} /> and teleports elsewhere with probability{' '}
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
      <TopKThresholdRunner />

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
