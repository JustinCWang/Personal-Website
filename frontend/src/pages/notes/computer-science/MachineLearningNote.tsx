/**
 * Machine Learning Notes Page
 * A standalone note for mathematical foundations, supervised learning, regularization, Bayesian learning, kernels, neural networks, ensembles, unsupervised learning, and reinforcement learning.
 */

import { useState, type ReactNode } from 'react';
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
import { BackpropagationRunner } from './CsAlgorithmRunners';

type TableRow = ReactNode[];

function useMLTheme() {
  const { isDarkMode } = useDarkMode();
  const subtlePanelClass = isDarkMode
    ? 'bg-green-500/5 border-green-500/20 text-green-100'
    : 'bg-slate-50 border-slate-200 text-slate-700';
  const tableClass = `w-full border-collapse overflow-hidden rounded-lg font-mono text-sm ${
    isDarkMode ? 'text-green-100' : 'text-slate-700'
  }`;
  const tableHeadClass = isDarkMode ? 'bg-green-500/15 text-green-300' : 'bg-slate-100 text-slate-800';
  const tableCellClass = isDarkMode ? 'border border-green-500/20' : 'border border-slate-200';
  const listClass = `list-disc pl-6 mb-6 font-mono text-sm leading-relaxed space-y-2 ${
    isDarkMode ? 'text-green-100/90' : 'text-slate-700'
  }`;
  const primaryColor = isDarkMode ? '#4ade80' : '#2563eb';
  const secondaryColor = isDarkMode ? '#fb923c' : '#ea580c';
  const accentColor = isDarkMode ? '#38bdf8' : '#0891b2';
  const mutedColor = isDarkMode ? '#86efac66' : '#94a3b8';
  const textColor = isDarkMode ? '#bbf7d0' : '#334155';

  return {
    subtlePanelClass,
    tableClass,
    tableHeadClass,
    tableCellClass,
    listClass,
    primaryColor,
    secondaryColor,
    accentColor,
    mutedColor,
    textColor,
  };
}

function BulletList({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { listClass } = useMLTheme();
  return <ul className={`${listClass} ${className}`}>{children}</ul>;
}

function NoteTable({ headers, rows }: { headers: ReactNode[]; rows: TableRow[] }) {
  const { tableClass, tableHeadClass, tableCellClass } = useMLTheme();

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

function MLNotationGuide() {
  return (
    <NoteTopicGroup>
      <NoteTopicBlock title="Notation Used Throughout">
        <BulletList className="mb-0">
          <li><InlineMath math="D" /> is a dataset. In supervised learning, <InlineMath math="D=\{(x^{(i)},y^{(i)})\}_{i=1}^N" />.</li>
          <li><InlineMath math="x^{(i)}" /> is one input example, and <InlineMath math="y^{(i)}" /> is its target or label.</li>
          <li><InlineMath math="X\in\mathbb{R}^{N\times d}" /> is a feature matrix: <InlineMath math="N" /> examples by <InlineMath math="d" /> features.</li>
          <li><InlineMath math="y\in\mathbb{R}^N" /> is a target vector for regression; labels may be binary or multiclass for classification.</li>
          <li><InlineMath math="\theta" /> is a generic parameter vector. <InlineMath math="w" /> is usually a linear weight vector, and <InlineMath math="b" /> is an intercept or bias.</li>
          <li><InlineMath math="f_\theta(x)" /> is a parameterized prediction function, and <InlineMath math="\hat{y}" /> is a prediction.</li>
          <li><InlineMath math="L(\theta)" /> is a loss; <InlineMath math="LL(\theta)" /> is a log-likelihood.</li>
          <li><InlineMath math="\eta" /> is a learning rate. <InlineMath math="\lambda" /> usually means regularization strength unless a probability section defines it as a rate.</li>
          <li><InlineMath math="\phi(x)" /> is a feature map. <InlineMath math="k(x,x')" /> is a kernel, and <InlineMath math="K" /> is a Gram matrix.</li>
          <li><InlineMath math="\mu_k" />, <InlineMath math="\Sigma_k" />, and <InlineMath math="\pi_k" /> are Gaussian mean, covariance, and mixture/class weight for component or class <InlineMath math="k" />.</li>
          <li><InlineMath math="\gamma_{ik}" /> is a GMM responsibility: the soft assignment of point <InlineMath math="i" /> to component <InlineMath math="k" />.</li>
          <li>In reinforcement learning, <InlineMath math="s" /> is a state, <InlineMath math="a" /> an action, <InlineMath math="R(s,a)" /> a reward, <InlineMath math="\pi" /> a policy, and <InlineMath math="\gamma" /> a discount factor.</li>
        </BulletList>
      </NoteTopicBlock>
    </NoteTopicGroup>
  );
}

function ModelComplexityExplorer() {
  const { subtlePanelClass, primaryColor, secondaryColor, accentColor } = useMLTheme();
  const [complexity, setComplexity] = useState(35);
  const bias = Math.max(5, 100 - complexity);
  const variance = Math.max(5, complexity);
  const noise = 18;
  const testError = bias * 0.55 + variance * 0.45 + Math.abs(complexity - 48) * 0.6 + noise;
  const trainError = Math.max(4, 95 - complexity * 0.9);
  const bars = [
    { label: 'bias', value: bias, color: primaryColor },
    { label: 'variance', value: variance, color: secondaryColor },
    { label: 'train error', value: trainError, color: accentColor },
    { label: 'test error', value: testError, color: complexity < 25 || complexity > 75 ? secondaryColor : primaryColor },
  ];
  const maxValue = Math.max(...bars.map((bar) => bar.value));

  return (
    <InteractiveBlock title="Bias, Variance, and Model Complexity">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="ml-complexity">
            <span>Model complexity</span>
            <span>{complexity}</span>
          </label>
          <input id="ml-complexity" type="range" min="5" max="95" value={complexity} onChange={(event) => setComplexity(Number(event.target.value))} className="w-full" />
          <NoteParagraph className="mb-0 mt-4 text-sm">
            This is a cartoon, not a theorem. The useful pattern is that training error usually falls as flexibility rises, while test error can rise again when variance dominates.
          </NoteParagraph>
        </div>
        <div className="space-y-3">
          {bars.map((bar) => (
            <div key={bar.label} className="grid grid-cols-[7rem_minmax(0,1fr)_4rem] items-center gap-3 text-sm">
              <span>{bar.label}</span>
              <div className={`h-7 overflow-hidden rounded border ${subtlePanelClass}`}>
                <div className="h-full rounded" style={{ width: `${(bar.value / maxValue) * 100}%`, backgroundColor: bar.color, opacity: 0.72 }} />
              </div>
              <span className="text-right font-mono">{Math.round(bar.value)}</span>
            </div>
          ))}
        </div>
      </div>
    </InteractiveBlock>
  );
}

function GradientScalingExplorer() {
  const { subtlePanelClass, primaryColor, secondaryColor, mutedColor, textColor } = useMLTheme();
  const [scale, setScale] = useState(8);
  const x = 1.4;
  const y = 2.2;
  const w = 0.2;
  const rawGradient = 2 * (scale * x) * ((scale * x) * w - y);
  const standardizedGradient = 2 * x * (x * w - y);
  const maxMagnitude = Math.max(Math.abs(rawGradient), Math.abs(standardizedGradient), 1);

  return (
    <InteractiveBlock title="Why Feature Scaling Changes Gradient Descent">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="feature-scale">
            <span>Feature scale multiplier</span>
            <span>{scale}</span>
          </label>
          <input id="feature-scale" type="range" min="1" max="20" value={scale} onChange={(event) => setScale(Number(event.target.value))} className="w-full" />
          <NoteParagraph className="mb-0 mt-4 text-sm">
            Large feature units make some gradient coordinates much larger, which bends the optimization path and makes the learning rate harder to choose.
          </NoteParagraph>
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <svg viewBox="0 0 430 170" className="h-48 w-full">
            {[
              ['raw feature', rawGradient, secondaryColor],
              ['standardized', standardizedGradient, primaryColor],
            ].map(([label, value, color], index) => {
              const width = (Math.abs(value as number) / maxMagnitude) * 250;
              const yPos = 48 + index * 58;
              return (
                <g key={label as string}>
                  <text x="16" y={yPos + 6} fontSize="12" fill={textColor}>{label as string}</text>
                  <line x1="145" y1={yPos} x2="390" y2={yPos} stroke={mutedColor} strokeWidth="2" />
                  <rect x="145" y={yPos - 12} width={width} height="24" rx="5" fill={color as string} opacity="0.7" />
                  <text x="400" y={yPos + 5} fontSize="12" textAnchor="end" fill={textColor}>{(value as number).toFixed(1)}</text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function RegularizationExplorer() {
  const { subtlePanelClass, primaryColor, secondaryColor } = useMLTheme();
  const [lambda, setLambda] = useState(40);
  const baseWeights = [2.2, -1.4, 0.8, 0.3, -0.2, 0.1];
  const l2 = baseWeights.map((weight) => weight / (1 + lambda / 45));
  const threshold = lambda / 55;
  const l1 = baseWeights.map((weight) => Math.sign(weight) * Math.max(0, Math.abs(weight) - threshold));
  const maxWeight = Math.max(...baseWeights.map((weight) => Math.abs(weight)));

  return (
    <InteractiveBlock title="L1 vs L2 Parameter Effects">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="reg-lambda">
            <span>Regularization strength <InlineMath math="\lambda" /></span>
            <span>{lambda}</span>
          </label>
          <input id="reg-lambda" type="range" min="0" max="100" value={lambda} onChange={(event) => setLambda(Number(event.target.value))} className="w-full" />
          <NoteParagraph className="mb-0 mt-4 text-sm">
            L2 shrinks weights smoothly. L1 can drive small weights exactly to zero, which acts like feature selection.
          </NoteParagraph>
        </div>
        <div className="space-y-5">
          {[
            ['L2', l2, primaryColor],
            ['L1', l1, secondaryColor],
          ].map(([label, weights, color]) => (
            <div key={label as string} className={`rounded-lg border p-4 ${subtlePanelClass}`}>
              <p className="mb-3 font-mono text-sm font-bold">{label as string}</p>
              <div className="space-y-2">
                {(weights as number[]).map((weight, index) => (
                  <div key={index} className="grid grid-cols-[2rem_minmax(0,1fr)_4rem] items-center gap-2 text-xs">
                    <span>w{index + 1}</span>
                    <div className="h-5 rounded bg-current/10">
                      <div className="h-5 rounded" style={{ width: `${(Math.abs(weight) / maxWeight) * 100}%`, backgroundColor: color as string, opacity: 0.72 }} />
                    </div>
                    <span className="text-right font-mono">{weight.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </InteractiveBlock>
  );
}

function KernelExplorer() {
  const { subtlePanelClass } = useMLTheme();
  const [sigma, setSigma] = useState(1.2);
  const [distance, setDistance] = useState(1.5);
  const rbf = Math.exp(-(distance * distance) / (2 * sigma * sigma));

  return (
    <InteractiveBlock title="RBF Kernel Similarity">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-4 block text-sm" htmlFor="kernel-distance">
            <span className="mb-1 flex justify-between gap-3"><span>distance <InlineMath math="\|x-x'\|" /></span><span>{distance.toFixed(1)}</span></span>
            <input id="kernel-distance" type="range" min="0" max="5" step="0.1" value={distance} onChange={(event) => setDistance(Number(event.target.value))} className="w-full" />
          </label>
          <label className="block text-sm" htmlFor="kernel-sigma">
            <span className="mb-1 flex justify-between gap-3"><span>width <InlineMath math="\sigma" /></span><span>{sigma.toFixed(1)}</span></span>
            <input id="kernel-sigma" type="range" min="0.3" max="3" step="0.1" value={sigma} onChange={(event) => setSigma(Number(event.target.value))} className="w-full" />
          </label>
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <MathBlock math="k(x,x')=\exp\left(-\frac{\|x-x'\|^2}{2\sigma^2}\right)" />
          <NoteTable
            headers={['quantity', 'value']}
            rows={[
              [<InlineMath math="\|x-x'\|" />, distance.toFixed(2)],
              [<InlineMath math="\sigma" />, sigma.toFixed(2)],
              [<InlineMath math="k(x,x')" />, rbf.toFixed(3)],
            ]}
          />
          <NoteParagraph className="mb-0 text-sm">
            Small <InlineMath math="\sigma" /> makes similarity very local. Large <InlineMath math="\sigma" /> makes many points look similar, smoothing the decision boundary.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function NeuralActivationExplorer() {
  const { subtlePanelClass, primaryColor, secondaryColor, accentColor, mutedColor, textColor } = useMLTheme();
  const [activation, setActivation] = useState<'linear' | 'relu' | 'tanh'>('relu');
  const activate = (x: number) => {
    if (activation === 'linear') return x;
    if (activation === 'relu') return Math.max(0, x);
    return Math.tanh(x);
  };
  const points = Array.from({ length: 81 }, (_, index) => -4 + index * 0.1);
  const maxY = activation === 'linear' ? 4 : 1.2;
  const yToSvg = (y: number) => 100 - (y / maxY) * 70;
  const xToSvg = (x: number) => 190 + x * 42;
  const path = points.map((x, index) => `${index === 0 ? 'M' : 'L'} ${xToSvg(x)} ${yToSvg(activate(x))}`).join(' ');
  const color = activation === 'linear' ? mutedColor : activation === 'relu' ? primaryColor : accentColor;

  return (
    <InteractiveBlock title="Why Activations Matter">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 block text-sm font-bold" htmlFor="activation-select">Activation</label>
          <select id="activation-select" value={activation} onChange={(event) => setActivation(event.target.value as 'linear' | 'relu' | 'tanh')} className="w-full rounded border border-current/20 bg-transparent p-2 text-sm">
            <option value="linear">linear</option>
            <option value="relu">ReLU</option>
            <option value="tanh">tanh</option>
          </select>
          <NoteParagraph className="mb-0 mt-4 text-sm">
            Stacking linear layers still gives one linear map. Nonlinear activations let depth build piecewise or curved representations.
          </NoteParagraph>
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <svg viewBox="0 0 380 200" className="h-56 w-full">
            <line x1="22" y1="100" x2="358" y2="100" stroke={mutedColor} strokeWidth="2" />
            <line x1="190" y1="22" x2="190" y2="178" stroke={mutedColor} strokeWidth="2" />
            <path d={path} fill="none" stroke={color} strokeWidth="4" />
            <text x="22" y="28" fill={textColor} fontSize="12">{activation}</text>
            <circle cx="190" cy={yToSvg(activate(0))} r="4" fill={secondaryColor} />
          </svg>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function AttentionExplorer() {
  const { subtlePanelClass, primaryColor, secondaryColor } = useMLTheme();
  const [focus, setFocus] = useState(2);
  const tokens = ['the', 'cat', 'sat', 'there'];
  const baseScores = [
    [0.8, 0.1, 0.05, 0.05],
    [0.15, 0.65, 0.15, 0.05],
    [0.08, 0.22, 0.55, 0.15],
    [0.1, 0.12, 0.2, 0.58],
  ];
  const weights = baseScores[focus];

  return (
    <InteractiveBlock title="Attention as Weighted Retrieval">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 block text-sm font-bold" htmlFor="attention-token">Query token</label>
          <select id="attention-token" value={focus} onChange={(event) => setFocus(Number(event.target.value))} className="w-full rounded border border-current/20 bg-transparent p-2 text-sm">
            {tokens.map((token, index) => <option key={token} value={index}>{token}</option>)}
          </select>
          <NoteParagraph className="mb-0 mt-4 text-sm">
            Attention assigns weights to other token representations, then mixes their value vectors. In transformers, every token can do this in parallel.
          </NoteParagraph>
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <div className="space-y-3">
            {tokens.map((token, index) => (
              <div key={token} className="grid grid-cols-[4rem_minmax(0,1fr)_4rem] items-center gap-3 text-sm">
                <span className={index === focus ? 'font-bold' : ''}>{token}</span>
                <div className="h-7 rounded bg-current/10">
                  <div className="h-7 rounded" style={{ width: `${weights[index] * 100}%`, backgroundColor: index === focus ? secondaryColor : primaryColor, opacity: 0.72 }} />
                </div>
                <span className="text-right font-mono">{weights[index].toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function KMeansGMMExplorer() {
  const { subtlePanelClass, primaryColor, secondaryColor } = useMLTheme();
  const [softness, setSoftness] = useState(1.2);
  const distanceA = 1.0;
  const distanceB = 1.6;
  const scoreA = Math.exp(-(distanceA * distanceA) / (2 * softness * softness));
  const scoreB = Math.exp(-(distanceB * distanceB) / (2 * softness * softness));
  const responsibilityA = scoreA / (scoreA + scoreB);
  const responsibilityB = 1 - responsibilityA;

  return (
    <InteractiveBlock title="K-Means Hard Assignments vs GMM Soft Assignments">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="cluster-softness">
            <span>Gaussian spread</span>
            <span>{softness.toFixed(1)}</span>
          </label>
          <input id="cluster-softness" type="range" min="0.3" max="3" step="0.1" value={softness} onChange={(event) => setSoftness(Number(event.target.value))} className="w-full" />
          <NoteParagraph className="mb-0 mt-4 text-sm">
            K-means would pick the nearest center. A GMM turns distances into probabilities, so uncertainty remains visible when clusters overlap.
          </NoteParagraph>
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <NoteTable
            headers={['cluster', 'distance', 'responsibility']}
            rows={[
              ['A', distanceA.toFixed(1), responsibilityA.toFixed(3)],
              ['B', distanceB.toFixed(1), responsibilityB.toFixed(3)],
            ]}
          />
          <div className="flex h-4 overflow-hidden rounded">
            <div style={{ width: `${responsibilityA * 100}%`, backgroundColor: primaryColor }} />
            <div style={{ width: `${responsibilityB * 100}%`, backgroundColor: secondaryColor }} />
          </div>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function PCAExplorer() {
  const { subtlePanelClass, primaryColor, secondaryColor } = useMLTheme();
  const [lambda1, setLambda1] = useState(7);
  const [lambda2, setLambda2] = useState(2);
  const total = lambda1 + lambda2;
  const explained = lambda1 / total;

  return (
    <InteractiveBlock title="PCA Explained Variance">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-4 block text-sm" htmlFor="pca-lambda1">
            <span className="mb-1 flex justify-between gap-3"><span><InlineMath math="\lambda_1" /></span><span>{lambda1}</span></span>
            <input id="pca-lambda1" type="range" min="1" max="10" value={lambda1} onChange={(event) => setLambda1(Number(event.target.value))} className="w-full" />
          </label>
          <label className="block text-sm" htmlFor="pca-lambda2">
            <span className="mb-1 flex justify-between gap-3"><span><InlineMath math="\lambda_2" /></span><span>{lambda2}</span></span>
            <input id="pca-lambda2" type="range" min="1" max="10" value={lambda2} onChange={(event) => setLambda2(Number(event.target.value))} className="w-full" />
          </label>
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <MathBlock math="\text{explained variance ratio}=\frac{\lambda_1}{\lambda_1+\lambda_2}" />
          <NoteTable
            headers={['component', 'variance']}
            rows={[
              ['PC1', lambda1],
              ['PC2', lambda2],
              ['PC1 ratio', explained.toFixed(3)],
            ]}
          />
          <div className="flex h-4 overflow-hidden rounded">
            <div style={{ width: `${explained * 100}%`, backgroundColor: primaryColor }} />
            <div style={{ width: `${(1 - explained) * 100}%`, backgroundColor: secondaryColor }} />
          </div>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function QLearningExplorer() {
  const { subtlePanelClass } = useMLTheme();
  const [alpha, setAlpha] = useState(0.4);
  const [gamma, setGamma] = useState(0.9);
  const current = 0.2;
  const reward = 1;
  const bestNext = 0.7;
  const target = reward + gamma * bestNext;
  const updated = current + alpha * (target - current);

  return (
    <InteractiveBlock title="Q-Learning Update">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-4 block text-sm" htmlFor="q-alpha">
            <span className="mb-1 flex justify-between gap-3"><span>learning rate <InlineMath math="\alpha" /></span><span>{alpha.toFixed(2)}</span></span>
            <input id="q-alpha" type="range" min="0.05" max="1" step="0.05" value={alpha} onChange={(event) => setAlpha(Number(event.target.value))} className="w-full" />
          </label>
          <label className="block text-sm" htmlFor="q-gamma">
            <span className="mb-1 flex justify-between gap-3"><span>discount <InlineMath math="\gamma" /></span><span>{gamma.toFixed(2)}</span></span>
            <input id="q-gamma" type="range" min="0" max="0.99" step="0.01" value={gamma} onChange={(event) => setGamma(Number(event.target.value))} className="w-full" />
          </label>
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <NoteTable
            headers={['quantity', 'value']}
            rows={[
              [<InlineMath math="Q(s,a)" />, current.toFixed(2)],
              [<InlineMath math="r" />, reward.toFixed(2)],
              [<InlineMath math="\max_{a'}Q(s',a')" />, bestNext.toFixed(2)],
              ['TD target', target.toFixed(3)],
              ['updated value', updated.toFixed(3)],
            ]}
          />
        </div>
      </div>
    </InteractiveBlock>
  );
}

export default function MachineLearningNote() {
  return (
    <NotesLayout>
      <NoteHeader
        title="Machine Learning"
        subtitle="A model-centered guide to learning from data: objectives, assumptions, optimization, generalization, model tradeoffs, neural networks, unsupervised learning, and reinforcement learning."
      />

      <MLNotationGuide />

      <NoteSectionTitle id="machine-learning-overview">1. Machine Learning Overview</NoteSectionTitle>
      <NoteParagraph>
        Machine learning is the practice of choosing a hypothesis class, defining a loss or probabilistic objective, fitting parameters from data, and checking whether the learned function generalizes to unseen examples.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Training Setup">
          <BulletList className="mb-0">
            <li>Represent examples with features.</li>
            <li>Choose what kind of function the model can express.</li>
            <li>Choose a loss, likelihood, or reward objective.</li>
            <li>Optimize parameters using data.</li>
            <li>Evaluate on held-out data and revise assumptions.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="mathematical-foundations">2. Mathematical Foundations</NoteSectionTitle>
      <NoteParagraph>
        Most ML models are built from linear algebra, calculus, probability, and optimization. Linear algebra represents data and parameters. Calculus tells us how to change parameters. Probability connects data, uncertainty, and likelihood.
      </NoteParagraph>
      <NoteTable
        headers={['tool', 'why it matters']}
        rows={[
          ['linear algebra', 'datasets as matrices, linear layers, PCA, kernels, covariance'],
          ['calculus', 'gradients, backpropagation, convexity, optimization'],
          ['probability', 'likelihood, Bayes rule, generative models, uncertainty'],
          ['optimization', 'training as minimizing loss or maximizing likelihood'],
        ]}
      />

      <NoteSectionTitle id="linear-algebra-review">3. Linear Algebra Review</NoteSectionTitle>
      <NoteParagraph>
        A feature matrix <InlineMath math="X\in\mathbb{R}^{N\times d}" /> stores <InlineMath math="N" /> examples with <InlineMath math="d" /> features each. A linear model computes <InlineMath math="Xw" />. Neural network layers compute <InlineMath math="XW+b" />.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Shapes">
          <BulletList className="mb-0">
            <li><InlineMath math="X\in\mathbb{R}^{N\times d}" />: data matrix.</li>
            <li><InlineMath math="w\in\mathbb{R}^d" />: linear weights.</li>
            <li><InlineMath math="Xw\in\mathbb{R}^N" />: one prediction per row.</li>
            <li><InlineMath math="K_{ij}=k(x_i,x_j)" />: kernel or Gram matrix.</li>
          </BulletList>
        </NoteTopicBlock>
        <NoteTopicBlock title="Eigenvalue Intuition">
          <NoteParagraph className="mb-0">
            If <InlineMath math="Av=\lambda v" />, the matrix stretches direction <InlineMath math="v" /> by factor <InlineMath math="\lambda" />. PCA uses this to find directions where data varies most.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="calculus-and-optimization-review">4. Calculus and Optimization Review</NoteSectionTitle>
      <NoteParagraph>
        Training usually means minimizing <InlineMath math="L(\theta)" />. The gradient <InlineMath math="\nabla L(\theta)" /> points in the steepest local increase direction, so gradient descent steps the other way.
      </NoteParagraph>
      <MathBlock math="\theta\leftarrow \theta-\eta\nabla L(\theta)" />
      <NoteParagraph>
        Convex objectives are easier because every local minimum is global. Linear regression and logistic regression have convex losses in standard settings; neural networks are generally nonconvex.
      </NoteParagraph>

      <NoteSectionTitle id="probability-and-maximum-likelihood-review">5. Probability and Maximum Likelihood Review</NoteSectionTitle>
      <NoteParagraph>
        Maximum likelihood chooses parameters that make the observed data most likely under a probabilistic model.
      </NoteParagraph>
      <MathBlock math="L(\theta)=\prod_i p(x_i\mid \theta),\qquad LL(\theta)=\sum_i \log p(x_i\mid \theta)" />
      <NoteParagraph>
        Logs turn products into sums and preserve the maximizing parameter because log is monotone.
      </NoteParagraph>

      <NoteSectionTitle id="supervised-learning-setup">6. Supervised Learning Setup</NoteSectionTitle>
      <NoteParagraph>
        Supervised learning starts with examples and ground truth. A model predicts <InlineMath math="\hat{y}=f_\theta(x)" />, and training adjusts <InlineMath math="\theta" /> so predictions match targets.
      </NoteParagraph>
      <MathBlock math="L(\theta)=\frac{1}{N}\sum_{i=1}^N \ell(x^{(i)},y^{(i)};\theta)" />

      <NoteSectionTitle id="hypothesis-classes">7. Hypothesis Classes</NoteSectionTitle>
      <NoteParagraph>
        A hypothesis class is the set of functions a model can represent. Constant models, linear models, polynomial models, decision trees, kernel machines, and neural networks are different hypothesis classes.
      </NoteParagraph>
      <NoteParagraph>
        The practical question is not simply "which class is strongest?" It is "which class is expressive enough for the signal while constrained enough to generalize?"
      </NoteParagraph>

      <NoteSectionTitle id="regression-vs-classification">8. Regression vs Classification</NoteSectionTitle>
      <NoteTable
        headers={['task', 'target', 'typical output', 'typical loss']}
        rows={[
          ['regression', 'continuous value', <InlineMath math="\hat{y}\in\mathbb{R}" />, 'squared error or negative log-likelihood'],
          ['binary classification', 'two classes', <InlineMath math="P(y=1\mid x)" />, 'binary cross-entropy'],
          ['multiclass classification', 'one of K classes', <InlineMath math="P(y=k\mid x)" />, 'cross-entropy with softmax'],
          ['multi-label classification', 'many independent labels', 'one probability per label', 'sum of binary cross-entropies'],
        ]}
      />

      <NoteSectionTitle id="linear-regression">9. Linear Regression</NoteSectionTitle>
      <NoteParagraph>
        Linear regression predicts a weighted sum of features. With an intercept, append a column of ones to absorb <InlineMath math="b" /> into the parameter vector.
      </NoteParagraph>
      <MathBlock math="\hat{y}=Xw+b,\qquad L(w)=\|Xw-y\|_2^2" />

      <NoteSectionTitle id="gradient-descent-for-linear-models">10. Gradient Descent for Linear Models</NoteSectionTitle>
      <NoteParagraph>
        For squared error, the gradient points in the direction that most increases residual error.
      </NoteParagraph>
      <MathBlock math="\nabla L(w)=2X^T(Xw-y)" />
      <NoteParagraph>
        Feature scaling matters because unscaled features can dominate gradient coordinates.
      </NoteParagraph>
      <GradientScalingExplorer />

      <NoteSectionTitle id="normal-equation-and-pseudoinverse">11. Normal Equation and Pseudoinverse</NoteSectionTitle>
      <NoteParagraph>
        When the linear least-squares problem is well-conditioned and the matrix has suitable rank, the optimal weights have a closed form.
      </NoteParagraph>
      <MathBlock math="w^*=(X^TX)^{-1}X^Ty" />
      <NoteParagraph>
        More generally, <InlineMath math="w^*=X^\dagger y" />, where <InlineMath math="X^\dagger" /> is the Moore-Penrose pseudoinverse. In large or streaming settings, iterative optimization is often more practical.
      </NoteParagraph>

      <NoteSectionTitle id="feature-scaling-and-standardization">12. Feature Scaling and Standardization</NoteSectionTitle>
      <NoteParagraph>
        Standardization subtracts the mean and divides by the standard deviation. It makes feature coordinates comparable, improves gradient descent behavior, and makes regularization penalties more meaningful.
      </NoteParagraph>
      <MathBlock math="x_j\leftarrow \frac{x_j-\mu_j}{\sigma_j}" />

      <NoteSectionTitle id="maximum-likelihood-estimation">13. Maximum Likelihood Estimation</NoteSectionTitle>
      <NoteParagraph>
        MLE is a bridge between probabilistic modeling and loss minimization. Squared error corresponds to Gaussian noise, binary cross-entropy to Bernoulli likelihood, and multiclass cross-entropy to categorical likelihood.
      </NoteParagraph>
      <NoteTable
        headers={['modeling assumption', 'loss']}
        rows={[
          ['Gaussian noise around numeric target', 'squared error'],
          ['Bernoulli binary label', 'binary cross-entropy'],
          ['categorical class label', 'softmax cross-entropy'],
          ['general probabilistic model', 'negative log-likelihood'],
        ]}
      />

      <NoteSectionTitle id="bernoulli-and-exponential-mle">14. Bernoulli and Exponential MLE</NoteSectionTitle>
      <NoteParagraph>
        For Bernoulli data with <InlineMath math="H" /> successes in <InlineMath math="N" /> trials, the MLE is the observed success fraction.
      </NoteParagraph>
      <MathBlock math="\hat{p}_{MLE}=\frac{H}{N}" />
      <NoteParagraph>
        For exponential data, the rate MLE is the inverse sample mean.
      </NoteParagraph>
      <MathBlock math="\hat{\lambda}_{MLE}=\frac{N}{\sum_i x_i}=\frac{1}{\bar{x}}" />

      <NoteSectionTitle id="nonlinear-features">15. Nonlinear Features</NoteSectionTitle>
      <NoteParagraph>
        A model can be linear in parameters while nonlinear in original inputs. For example, <InlineMath math="\hat{y}=\theta_0+\theta_1x+\theta_2x^2" /> is linear in <InlineMath math="\theta" /> but quadratic in <InlineMath math="x" />.
      </NoteParagraph>
      <MathBlock math="\hat{y}=\theta^T\phi(x)" />
      <NoteParagraph>
        Feature engineering changes the geometry of what a linear model can express.
      </NoteParagraph>

      <NoteSectionTitle id="linear-classification">16. Linear Classification</NoteSectionTitle>
      <NoteParagraph>
        A linear classifier separates space with a hyperplane.
      </NoteParagraph>
      <MathBlock math="w^Tx+b=0" />
      <NoteParagraph>
        Linear regression used as a classifier and logistic regression can produce similar-looking boundaries, but logistic regression optimizes a classification likelihood rather than squared numeric targets.
      </NoteParagraph>

      <NoteSectionTitle id="logistic-regression">17. Logistic Regression</NoteSectionTitle>
      <NoteParagraph>
        Logistic regression turns a linear score into a probability using the sigmoid function.
      </NoteParagraph>
      <MathBlock math="P(y=1\mid x)=\sigma(w^Tx+b),\qquad \sigma(z)=\frac{1}{1+e^{-z}}" />
      <NoteParagraph>
        It is a strong baseline when the decision boundary is roughly linear or when nonlinear features have already been engineered.
      </NoteParagraph>

      <NoteSectionTitle id="overfitting">18. Overfitting</NoteSectionTitle>
      <NoteParagraph>
        Overfitting happens when a model learns noise or accidental training-set structure instead of the underlying pattern. Symptoms include low training error, high test error, unstable predictions, and overly complex boundaries.
      </NoteParagraph>

      <NoteSectionTitle id="bias-variance-tradeoff">19. Bias-Variance Tradeoff</NoteSectionTitle>
      <NoteParagraph>
        Bias is error from an overly rigid model. Variance is sensitivity to the particular training sample. Good model choice balances both against irreducible noise.
      </NoteParagraph>
      <ModelComplexityExplorer />

      <NoteSectionTitle id="regularization">20. Regularization</NoteSectionTitle>
      <NoteParagraph>
        Regularization adds a complexity penalty to the training objective.
      </NoteParagraph>
      <MathBlock math="L_{reg}(\theta)=L_{data}(\theta)+\lambda\Omega(\theta)" />
      <NoteParagraph>
        It reduces overfitting, controls parameter magnitude, improves conditioning, and encodes a preference for simpler explanations.
      </NoteParagraph>

      <NoteSectionTitle id="l1-vs-l2-regularization">21. L1 vs L2 Regularization</NoteSectionTitle>
      <NoteParagraph>
        L2 regularization shrinks weights smoothly and usually keeps many small nonzero coefficients. L1 regularization encourages sparsity and can set weights exactly to zero.
      </NoteParagraph>
      <RegularizationExplorer />

      <NoteSectionTitle id="bayesian-learning">22. Bayesian Learning</NoteSectionTitle>
      <NoteParagraph>
        Bayesian learning treats parameters as uncertain random variables. Instead of returning only one best parameter vector, it computes a posterior distribution.
      </NoteParagraph>
      <MathBlock math="p(\theta\mid D)=\frac{p(D\mid\theta)p(\theta)}{p(D)}" />
      <NoteParagraph>
        The prior expresses belief before data; the likelihood expresses evidence from data; the posterior combines both.
      </NoteParagraph>

      <NoteSectionTitle id="beta-distributions-and-additive-smoothing">23. Beta Distributions and Additive Smoothing</NoteSectionTitle>
      <NoteParagraph>
        The Beta distribution is a distribution over probabilities. It is conjugate to the Bernoulli likelihood, which means the posterior is also Beta.
      </NoteParagraph>
      <MathBlock math="p\sim \operatorname{Beta}(\alpha,\beta),\quad H\text{ successes},\quad T\text{ failures}" />
      <MathBlock math="p\mid D\sim \operatorname{Beta}(\alpha+H,\beta+T)" />
      <NoteParagraph>
        With a symmetric prior <InlineMath math="\operatorname{Beta}(c,c)" />, the posterior mean is additive smoothing:
      </NoteParagraph>
      <MathBlock math="E[p\mid D]=\frac{H+c}{H+T+2c}" />

      <NoteSectionTitle id="bayesian-linear-regression">24. Bayesian Linear Regression</NoteSectionTitle>
      <NoteParagraph>
        Bayesian linear regression places a prior on weights and updates it with observed data. A Gaussian prior on weights corresponds closely to L2-style regularization.
      </NoteParagraph>
      <MathBlock math="y_i=w^Tx_i+\epsilon_i,\qquad \epsilon_i\sim \mathcal{N}(0,\sigma^2)" />
      <MathBlock math="w\sim \mathcal{N}(0,S_0)" />
      <NoteParagraph>
        Bayesian prediction averages over posterior uncertainty instead of using only one fitted vector.
      </NoteParagraph>
      <MathBlock math="p(y\mid x,D)=\int p(y\mid x,w)p(w\mid D)\,dw" />

      <NoteSectionTitle id="kernels">25. Kernels</NoteSectionTitle>
      <NoteParagraph>
        A kernel acts like an inner product in a feature space that may be high-dimensional or implicit.
      </NoteParagraph>
      <MathBlock math="k(x,x')=\phi(x)^T\phi(x')" />
      <NoteParagraph>
        The kernel trick lets algorithms use <InlineMath math="k(x,x')" /> directly without explicitly constructing <InlineMath math="\phi(x)" />.
      </NoteParagraph>
      <KernelExplorer />

      <NoteSectionTitle id="valid-kernel-construction-rules">26. Valid Kernel Construction Rules</NoteSectionTitle>
      <NoteParagraph>
        A valid kernel must produce a positive semidefinite Gram matrix for any finite dataset.
      </NoteParagraph>
      <MathBlock math="K_{ij}=k(x_i,x_j),\qquad a^TKa\ge 0" />
      <NoteTable
        headers={['construction', 'valid when']}
        rows={[
          ['sum', <InlineMath math="k_1+k_2" />],
          ['product', <InlineMath math="k_1k_2" />],
          ['nonnegative scaling', <InlineMath math="ck_1,\ c\ge 0" />],
          ['polynomial', <InlineMath math="(x^Tx'+c)^d" />],
          ['RBF', <InlineMath math="\exp(-\|x-x'\|^2/(2\sigma^2))" />],
        ]}
      />

      <NoteSectionTitle id="support-vector-machines">27. Support Vector Machines</NoteSectionTitle>
      <NoteParagraph>
        A support vector machine finds a separating hyperplane with maximum margin. For labels <InlineMath math="y_i\in\{-1,+1\}" />, the hard-margin constraints are:
      </NoteParagraph>
      <MathBlock math="y_i(w^Tx_i+b)\ge 1" />
      <MathBlock math="\min \frac{1}{2}\|w\|^2" />
      <NoteParagraph>
        Large margin means the boundary is robust to small perturbations, and only boundary points matter.
      </NoteParagraph>

      <NoteSectionTitle id="soft-margin-svms">28. Soft-Margin SVMs</NoteSectionTitle>
      <NoteParagraph>
        Real data is rarely perfectly separable. Soft-margin SVMs add slack variables for margin violations.
      </NoteParagraph>
      <MathBlock math="y_i(w^Tx_i+b)\ge 1-\xi_i,\qquad \xi_i\ge 0" />
      <MathBlock math="\min \frac12\|w\|^2+C\sum_i\xi_i" />
      <NoteParagraph>
        Large <InlineMath math="C" /> punishes violations strongly. Small <InlineMath math="C" /> allows more violations and gives stronger regularization.
      </NoteParagraph>

      <NoteSectionTitle id="kernel-svms">29. Kernel SVMs</NoteSectionTitle>
      <NoteParagraph>
        The SVM dual depends on inner products, so replacing <InlineMath math="x_i^Tx_j" /> with <InlineMath math="k(x_i,x_j)" /> creates nonlinear boundaries.
      </NoteParagraph>
      <MathBlock math="f(x)=\sum_i \alpha_i y_i k(x_i,x)+b" />
      <NoteParagraph>
        Only points with nonzero <InlineMath math="\alpha_i" /> affect the decision function. These are the support vectors.
      </NoteParagraph>

      <NoteSectionTitle id="neural-networks">30. Neural Networks</NoteSectionTitle>
      <NoteParagraph>
        A neural network composes linear transformations with nonlinear activations. One hidden layer has the form:
      </NoteParagraph>
      <MathBlock math="h=a(W_1x+b_1),\qquad \hat{y}=g(W_2h+b_2)" />
      <NoteParagraph>
        Networks are flexible function approximators, but flexibility brings optimization difficulty, overfitting risk, and a need for careful architecture choices.
      </NoteParagraph>
      <NeuralActivationExplorer />

      <NoteSectionTitle id="output-activations-and-loss-functions">31. Output Activations and Loss Functions</NoteSectionTitle>
      <NoteTable
        headers={['task', 'output activation', 'loss', 'interpretation']}
        rows={[
          ['regression', 'linear', 'squared error', 'Gaussian observation noise'],
          ['binary classification', 'sigmoid', 'binary cross-entropy', 'Bernoulli probability'],
          ['multiclass classification', 'softmax', 'cross-entropy', 'categorical probability'],
          ['multi-label classification', 'sigmoid per label', 'binary cross-entropy per label', 'independent label probabilities'],
        ]}
      />

      <NoteSectionTitle id="backpropagation">32. Backpropagation</NoteSectionTitle>
      <NoteParagraph>
        Backpropagation applies the chain rule backward through the computation graph so every parameter gradient can be computed efficiently.
      </NoteParagraph>
      <AlgorithmBlock
        title="Backpropagation"
        steps={[
          'Forward pass: compute predictions and loss.',
          'Backward pass: compute gradients by the chain rule.',
          <span>Update parameters, for example <InlineMath math="\theta\leftarrow\theta-\eta\nabla_\theta L" />.</span>,
        ]}
      />
      <BackpropagationRunner />

      <NoteSectionTitle id="gradient-based-optimization">33. Gradient-Based Optimization</NoteSectionTitle>
      <NoteParagraph>
        Batch gradient descent uses all data for each update. Stochastic gradient descent uses one or a few examples. Mini-batch training balances noisy but cheap updates with hardware efficiency.
      </NoteParagraph>
      <NoteTable
        headers={['method', 'tradeoff']}
        rows={[
          ['full batch', 'stable gradients, expensive updates'],
          ['SGD', 'cheap noisy updates, can escape shallow traps'],
          ['mini-batch', 'standard compromise for neural networks'],
          ['momentum/Adam-style methods', 'adapt update directions and step sizes, but add tuning and implicit bias'],
        ]}
      />

      <NoteSectionTitle id="rnns-and-time-series">34. RNNs and Time Series</NoteSectionTitle>
      <NoteParagraph>
        Recurrent neural networks process sequences by carrying hidden state forward through time.
      </NoteParagraph>
      <MathBlock math="h_t=f(W_x x_t+W_h h_{t-1}+b)" />
      <NoteParagraph>
        They are natural for time series and sequence tasks because earlier inputs can influence later predictions. Their weakness is training through long histories: gradients can vanish, explode, or fail to preserve long-range dependencies.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="When to Use RNN-Style Models">
          <BulletList className="mb-0">
            <li>Use them when order matters and the sequence is moderate in length.</li>
            <li>Be cautious when long-range dependencies dominate.</li>
            <li>Use gating or attention when the model must decide what history to keep.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="attention-and-transformers">35. Attention and Transformers</NoteSectionTitle>
      <NoteParagraph>
        Attention lets a model decide which previous or neighboring representations are most relevant to the current token. Instead of compressing all history into one hidden state, attention computes a weighted mixture of value vectors.
      </NoteParagraph>
      <MathBlock math="\operatorname{Attention}(Q,K,V)=\operatorname{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V" />
      <NoteParagraph>
        Transformers replace recurrence with stacked self-attention and feedforward blocks. They are highly parallelizable and strong for long-context representation, but they can be data-hungry and computationally expensive.
      </NoteParagraph>
      <AttentionExplorer />

      <NoteSectionTitle id="decision-trees">36. Decision Trees</NoteSectionTitle>
      <NoteParagraph>
        A decision tree partitions feature space with a sequence of feature tests. Leaves make simple predictions such as class probabilities or average target values.
      </NoteParagraph>
      <NoteParagraph>
        Trees are interpretable and handle nonlinear interactions, but deep trees can overfit and produce jagged decision boundaries.
      </NoteParagraph>

      <NoteSectionTitle id="tree-decision-boundaries">37. Tree Decision Boundaries</NoteSectionTitle>
      <NoteParagraph>
        Axis-aligned decision trees split one feature at a time. In two dimensions, this creates rectangular regions. With enough depth, the boundary can become complex, but it may also chase noise.
      </NoteParagraph>

      <NoteSectionTitle id="ensembles">38. Ensembles</NoteSectionTitle>
      <NoteParagraph>
        Ensembles combine multiple models to improve prediction. The main idea is to reduce variance, reduce bias, or both by aggregating many weak or unstable learners.
      </NoteParagraph>
      <NoteTable
        headers={['ensemble idea', 'main effect']}
        rows={[
          ['bagging', 'reduce variance by averaging models trained on resampled data'],
          ['random forests', 'bagging plus feature randomness to decorrelate trees'],
          ['boosting', 'reduce bias by sequentially fitting what remains wrong'],
          ['gradient boosting', 'fit weak learners to negative gradients or residuals'],
        ]}
      />

      <NoteSectionTitle id="bagging-random-forests-and-boosting">39. Bagging, Random Forests, and Boosting</NoteSectionTitle>
      <NoteParagraph>
        Bagging trains many models independently and averages or votes. Random forests make trees less correlated by sampling features at splits. Boosting trains sequentially, so each new learner focuses on the current model's mistakes.
      </NoteParagraph>
      <NoteParagraph>
        Use random forests when you want a robust tabular baseline with little tuning. Use boosting when you can tune carefully and need high predictive performance on structured/tabular data.
      </NoteParagraph>

      <NoteSectionTitle id="gradient-boosted-trees">40. Gradient Boosted Trees</NoteSectionTitle>
      <NoteParagraph>
        Gradient boosting builds an additive model:
      </NoteParagraph>
      <MathBlock math="F_M(x)=F_0(x)+\eta\sum_{m=1}^M h_m(x)" />
      <NoteParagraph>
        Each new tree approximates the direction that would most reduce the loss. Learning rate, tree depth, and number of trees control the bias-variance tradeoff.
      </NoteParagraph>

      <NoteSectionTitle id="probabilistic-generative-models">41. Probabilistic Generative Models</NoteSectionTitle>
      <NoteParagraph>
        Discriminative models learn <InlineMath math="p(y\mid x)" /> or a decision boundary. Generative models learn <InlineMath math="p(x,y)" /> or <InlineMath math="p(x\mid y)p(y)" /> and classify with Bayes rule.
      </NoteParagraph>
      <MathBlock math="p(y\mid x)=\frac{p(x\mid y)p(y)}{p(x)}" />

      <NoteSectionTitle id="gaussian-classifiers">42. Gaussian Classifiers</NoteSectionTitle>
      <NoteParagraph>
        A Gaussian classifier models features in each class with a Gaussian distribution.
      </NoteParagraph>
      <MathBlock math="p(x\mid y=k)=\mathcal{N}(x\mid \mu_k,\Sigma_k)" />
      <NoteParagraph>
        Equal class covariances produce linear decision boundaries. Different covariances can produce quadratic boundaries.
      </NoteParagraph>

      <NoteSectionTitle id="naive-bayes">43. Naive Bayes</NoteSectionTitle>
      <NoteParagraph>
        Naive Bayes assumes features are conditionally independent given the class.
      </NoteParagraph>
      <MathBlock math="p(x\mid y)=\prod_j p(x_j\mid y)" />
      <MathBlock math="p(y\mid x)\propto p(y)\prod_j p(x_j\mid y)" />
      <NoteParagraph>
        It is simple, fast, and effective with limited data, but the independence assumption often makes probability calibration weak.
      </NoteParagraph>

      <NoteSectionTitle id="unsupervised-learning">44. Unsupervised Learning</NoteSectionTitle>
      <NoteParagraph>
        Unsupervised learning uses data without labels. Goals include clustering, density modeling, dimensionality reduction, visualization, compression, and latent-structure discovery.
      </NoteParagraph>

      <NoteSectionTitle id="k-means">45. K-Means</NoteSectionTitle>
      <NoteParagraph>
        K-means partitions data into <InlineMath math="K" /> clusters by minimizing squared distance to cluster means.
      </NoteParagraph>
      <MathBlock math="J=\sum_i \|x_i-\mu_{z_i}\|_2^2" />
      <AlgorithmBlock
        title="K-Means"
        steps={[
          <span>Assign each point <InlineMath math="x_i" /> to its nearest center.</span>,
          <span>Recompute each center <InlineMath math="\mu_k" /> as the mean of points assigned to cluster <InlineMath math="k" />.</span>,
          'Repeat until assignments or centers stop changing.',
        ]}
      />
      <NoteParagraph>
        Each assignment/update step cannot increase the objective, but the final answer can depend strongly on initialization.
      </NoteParagraph>

      <NoteSectionTitle id="gaussian-mixture-models">46. Gaussian Mixture Models</NoteSectionTitle>
      <NoteParagraph>
        A Gaussian mixture model represents data as a weighted sum of Gaussian components.
      </NoteParagraph>
      <MathBlock math="p(x)=\sum_k \pi_k \mathcal{N}(x\mid \mu_k,\Sigma_k)" />
      <NoteParagraph>
        Unlike k-means, GMMs use soft assignments, model covariance, and can represent overlapping or elliptical clusters.
      </NoteParagraph>
      <KMeansGMMExplorer />

      <NoteSectionTitle id="em-algorithm">47. EM Algorithm</NoteSectionTitle>
      <NoteParagraph>
        Expectation-Maximization alternates between estimating hidden variables from parameters and estimating parameters from hidden variables.
      </NoteParagraph>
      <MathBlock math="\gamma_{ik}=\frac{\pi_k\mathcal{N}(x_i\mid \mu_k,\Sigma_k)}{\sum_j\pi_j\mathcal{N}(x_i\mid \mu_j,\Sigma_j)}" />
      <NoteParagraph>
        For GMMs, the E-step computes responsibilities and the M-step updates mixture weights, means, and covariances using those responsibilities.
      </NoteParagraph>

      <NoteSectionTitle id="pca">48. PCA</NoteSectionTitle>
      <NoteParagraph>
        Principal Component Analysis finds orthogonal directions of maximum variance. With centered data and covariance <InlineMath math="S" />, the first component solves:
      </NoteParagraph>
      <MathBlock math="\max_{\|u\|_2=1} u^TSu" />
      <NoteParagraph>
        The solution is the eigenvector of <InlineMath math="S" /> with the largest eigenvalue.
      </NoteParagraph>
      <PCAExplorer />

      <NoteSectionTitle id="pca-normalization-and-reconstruction">49. PCA Normalization and Reconstruction</NoteSectionTitle>
      <NoteParagraph>
        Centering affects location. Scaling affects geometry. If features have different units, standardizing before PCA can prevent high-variance units from dominating the principal components.
      </NoteParagraph>
      <NoteParagraph>
        Keeping only the top components gives a low-dimensional approximation. Reconstruction error decreases as more components are kept.
      </NoteParagraph>

      <NoteSectionTitle id="reinforcement-learning">50. Reinforcement Learning</NoteSectionTitle>
      <NoteParagraph>
        Reinforcement learning studies agents that learn from interaction. At each step the agent observes state <InlineMath math="s_t" />, chooses action <InlineMath math="a_t" />, receives reward <InlineMath math="r_t" />, and moves to <InlineMath math="s_{t+1}" />.
      </NoteParagraph>
      <MathBlock math="\text{goal: maximize expected cumulative reward}" />

      <NoteSectionTitle id="mdps">51. MDPs</NoteSectionTitle>
      <NoteParagraph>
        A Markov decision process contains states, actions, transition probabilities, rewards, and a discount factor. The Markov assumption says the future depends on the current state and action, not the full history.
      </NoteParagraph>
      <MathBlock math="P(s_{t+1}\mid s_t,a_t,history)=P(s_{t+1}\mid s_t,a_t)" />

      <NoteSectionTitle id="bellman-equations">52. Bellman Equations</NoteSectionTitle>
      <NoteParagraph>
        Bellman equations express value recursively: value now equals immediate reward plus discounted expected future value.
      </NoteParagraph>
      <MathBlock math="v^*(s)=\max_a\left[R(s,a)+\gamma\sum_{s'}P(s'\mid s,a)v^*(s')\right]" />

      <NoteSectionTitle id="value-iteration">53. Value Iteration</NoteSectionTitle>
      <NoteParagraph>
        Value iteration repeatedly applies the Bellman optimality update until values stabilize, then extracts the greedy policy.
      </NoteParagraph>
      <MathBlock math="v_{k+1}(s)=\max_a\left[R(s,a)+\gamma\sum_{s'}P(s'\mid s,a)v_k(s')\right]" />
      <AlgorithmBlock
        title="Value Iteration"
        steps={[
          <span>Initialize <InlineMath math="v_0(s)" />.</span>,
          <span>Repeatedly apply the Bellman update to get <InlineMath math="v_{k+1}" /> from <InlineMath math="v_k" />.</span>,
          'Stop after convergence.',
          <span>Extract the greedy policy <InlineMath math="\pi(s)=\arg\max_a\left[R(s,a)+\gamma\sum_{s'}P(s'\mid s,a)v(s')\right]" />.</span>,
        ]}
      />

      <NoteSectionTitle id="policy-iteration">54. Policy Iteration</NoteSectionTitle>
      <NoteParagraph>
        Policy iteration alternates policy evaluation and policy improvement. If improvement no longer changes the policy, the policy is optimal.
      </NoteParagraph>
      <AlgorithmBlock
        title="Policy Iteration"
        steps={[
          <span>Evaluate the current policy <InlineMath math="\pi" /> to compute <InlineMath math="v_\pi" />.</span>,
          <span>Improve <InlineMath math="\pi" /> greedily using <InlineMath math="v_\pi" />.</span>,
          'Repeat until the policy stops changing.',
        ]}
      />

      <NoteSectionTitle id="q-learning">55. Q-Learning</NoteSectionTitle>
      <NoteParagraph>
        Q-learning learns action values directly from experience without knowing the transition model.
      </NoteParagraph>
      <MathBlock math="Q(s,a)\leftarrow Q(s,a)+\alpha[r+\gamma\max_{a'}Q(s',a')-Q(s,a)]" />
      <NoteParagraph>
        It is off-policy because the update uses the best next action even if the behavior policy took a different next action.
      </NoteParagraph>
      <QLearningExplorer />

      <NoteSectionTitle id="implementation-guide">56. Implementation Guide</NoteSectionTitle>
      <NoteTopicGroup>
        <NoteTopicBlock title="What To Implement Carefully">
          <BulletList className="mb-0">
            <li>Keep matrix shapes explicit and assert them while debugging.</li>
            <li>Standardize features before gradient-based linear models, SVMs, PCA, and many neural nets.</li>
            <li>Track train, validation, and test metrics separately.</li>
            <li>Use vectorized computations for losses, gradients, kernels, and neural layers.</li>
            <li>For probabilistic models, compute in log space when products may underflow.</li>
            <li>For iterative algorithms, plot objective values to catch divergence or bad initialization.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="model-selection-tradeoffs">57. Model Selection Tradeoffs</NoteSectionTitle>
      <NoteTable
        headers={['model family', 'use when', 'watch out for']}
        rows={[
          ['linear / logistic regression', 'you need a strong interpretable baseline', 'underfitting nonlinear structure'],
          ['kernel SVM', 'medium-size data with nonlinear boundaries', 'kernel and scaling sensitivity; poor scaling to huge datasets'],
          ['random forest', 'robust tabular baseline with low tuning burden', 'less smooth extrapolation; larger model size'],
          ['gradient boosted trees', 'high-performing tabular prediction', 'tuning sensitivity and overfitting with too many trees'],
          ['neural networks', 'large data, representation learning, images, text, sequences', 'data hunger, compute cost, debugging difficulty'],
          ['GMM / k-means', 'cluster discovery or density-style structure', 'cluster assumptions may not match real geometry'],
          ['PCA', 'compression, visualization, denoising, decorrelation', 'linear projection may miss nonlinear structure'],
        ]}
      />

    </NotesLayout>
  );
}
