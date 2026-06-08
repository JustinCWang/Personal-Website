/**
 * Linear Algebra Notes Page
 * Linear algebra notes focused on algebra, geometry, and computation.
 */

import { useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { Coordinates, Line, Mafs, Point, Theme, Vector } from 'mafs';
import 'mafs/core.css';
import 'mafs/font.css';
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

type TableRow = ReactNode[];
type Vec2 = [number, number];
type Matrix2 = [[number, number], [number, number]];

const round = (value: number) => Math.round(value * 1000) / 1000;
const cleanNumber = (value: number) => {
  const rounded = round(value);
  return Object.is(rounded, -0) ? 0 : rounded;
};
const formatNumber = (value: number) => {
  const cleaned = cleanNumber(value);
  return Number.isInteger(cleaned) ? String(cleaned) : String(cleaned).replace(/0+$/, '').replace(/\.$/, '');
};
const add = ([x1, y1]: Vec2, [x2, y2]: Vec2): Vec2 => [x1 + x2, y1 + y2];
const scale = ([x, y]: Vec2, scalar: number): Vec2 => [x * scalar, y * scalar];
const dot = ([x1, y1]: Vec2, [x2, y2]: Vec2) => x1 * x2 + y1 * y2;
const normSquared = (v: Vec2) => dot(v, v);
const distance = ([x1, y1]: Vec2, [x2, y2]: Vec2) => Math.hypot(x2 - x1, y2 - y1);
const isVisibleVector = (tail: Vec2, tip: Vec2) => distance(tail, tip) > 0.03;
const matrixVector = ([x, y]: Vec2) => String.raw`\begin{bmatrix}${formatNumber(x)}\\${formatNumber(y)}\end{bmatrix}`;
const transform = ([[a, b], [c, d]]: Matrix2, [x, y]: Vec2): Vec2 => [a * x + b * y, c * x + d * y];

function useLinearTheme() {
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
  const mafsStyle = isDarkMode
    ? ({
        '--mafs-fg': '#4ade80',
        '--mafs-bg': 'transparent',
        '--mafs-line-color': '#22c55e40',
        '--mafs-origin-color': '#4ade80',
      } as CSSProperties)
    : ({
        '--mafs-fg': '#1e293b',
        '--mafs-bg': 'transparent',
        '--mafs-line-color': '#cbd5e1',
        '--mafs-origin-color': '#64748b',
      } as CSSProperties);

  return {
    isDarkMode,
    subtlePanelClass,
    listClass,
    tableClass,
    tableHeadClass,
    tableCellClass,
    mafsStyle,
  };
}

function BulletList({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { listClass } = useLinearTheme();
  return <ul className={`${listClass} ${className}`}>{children}</ul>;
}

function NoteTable({ headers, rows }: { headers: ReactNode[]; rows: TableRow[] }) {
  const { tableClass, tableHeadClass, tableCellClass } = useLinearTheme();

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

function DiagramLegend({
  items,
  className = '',
}: {
  items: { label: ReactNode; swatchClass: string; dashed?: boolean }[];
  className?: string;
}) {
  return (
    <div className={`mt-3 flex flex-wrap gap-x-4 gap-y-2 px-1 text-xs leading-tight ${className}`}>
      {items.map((item, index) => (
        <div key={index} className="flex min-w-0 items-center gap-2">
          <span
            className={
              item.dashed
                ? `h-0 w-5 shrink-0 border-t-2 border-dashed ${item.swatchClass}`
                : `h-2.5 w-2.5 shrink-0 rounded-full ${item.swatchClass}`
            }
            aria-hidden="true"
          />
          <span className="min-w-0">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function MafsVector({
  tail = [0, 0],
  tip,
  color,
  opacity,
}: {
  tail?: Vec2;
  tip: Vec2;
  color: string;
  opacity?: number;
}) {
  if (!isVisibleVector(tail, tip)) {
    return <Point x={tip[0]} y={tip[1]} color={color} />;
  }

  return <Vector tail={tail} tip={tip} color={color} opacity={opacity} />;
}

function NotationGuide() {
  return (
    <NoteTopicGroup>
      <NoteTopicBlock title="Notation Used Throughout">
        <BulletList className="mb-0">
          <li><InlineMath math="\mathbb R^n" /> means all column vectors with <InlineMath math="n" /> real-number entries.</li>
          <li><InlineMath math="\mathbf{x}" /> is a vector. Plain <InlineMath math="x" /> is usually a scalar.</li>
          <li><InlineMath math="A\in\mathbb R^{m\times n}" /> means <InlineMath math="A" /> has <InlineMath math="m" /> rows and <InlineMath math="n" /> columns.</li>
          <li><InlineMath math="\mathbf{e}_i" /> is a standard basis vector: one entry is 1 and the rest are 0.</li>
          <li><InlineMath math="A\mathbf{x}=\mathbf{b}" /> means a matrix acts on an input vector <InlineMath math="\mathbf{x}" /> to produce an output vector <InlineMath math="\mathbf{b}" />.</li>
          <li><InlineMath math="I" /> is the identity matrix, the matrix that leaves every vector unchanged.</li>
          <li><InlineMath math="A^T" /> is the transpose of <InlineMath math="A" />: rows and columns are swapped.</li>
          <li><InlineMath math="\det A" /> is the determinant of a square matrix. In this note, <InlineMath math="\det A=0" /> means the matrix is singular, or not invertible.</li>
          <li><InlineMath math="\operatorname{Span}\{\mathbf{v}_1,\dots,\mathbf{v}_p\}" /> means every linear combination of those vectors.</li>
          <li><InlineMath math="\operatorname{Col} A" />, <InlineMath math="\operatorname{Nul} A" />, and <InlineMath math="\operatorname{rank} A" /> mean column space, null space, and rank.</li>
          <li><InlineMath math="\mathbf{u}\cdot\mathbf{v}" /> is the dot product. <InlineMath math="\|\mathbf{v}\|" /> is vector length.</li>
          <li><InlineMath math="\widehat{\mathbf{x}}" /> or <InlineMath math="\widehat{\mathbf{b}}" /> marks an approximate or projected best-fit vector.</li>
          <li><InlineMath math="\lambda" /> is usually an eigenvalue, and <InlineMath math="\sigma" /> is usually a singular value.</li>
        </BulletList>
      </NoteTopicBlock>
    </NoteTopicGroup>
  );
}

function VectorCombinationExplorer() {
  const { subtlePanelClass, mafsStyle } = useLinearTheme();
  const [a, setA] = useState(1);
  const [b, setB] = useState(1);
  const u: Vec2 = [2, 1];
  const v: Vec2 = [-1, 2];
  const au = scale(u, a);
  const bv = scale(v, b);
  const result = add(au, bv);

  return (
    <InteractiveBlock title="Linear Combination Explorer">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(230px,280px)_minmax(0,1fr)]">
        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <p className="mb-4 text-sm font-bold uppercase tracking-wider">Weights</p>
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="weight-a">
            <span><InlineMath math="a" /></span>
            <span>{formatNumber(a)}</span>
          </label>
          <input id="weight-a" type="range" min="-2" max="2" step="0.5" value={a} onChange={(event) => setA(Number(event.target.value))} className="mb-4 w-full" />
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="weight-b">
            <span><InlineMath math="b" /></span>
            <span>{formatNumber(b)}</span>
          </label>
          <input id="weight-b" type="range" min="-2" max="2" step="0.5" value={b} onChange={(event) => setB(Number(event.target.value))} className="mb-4 w-full" />
          <MathBlock math={String.raw`${formatNumber(a)}\mathbf{u}+${formatNumber(b)}\mathbf{v}=${matrixVector(result)}`} />
          <p className="text-sm leading-relaxed">
            Changing the weights moves through <InlineMath math="\operatorname{Span}\{\mathbf{u},\mathbf{v}\}" />. Since these two vectors are not multiples,
            their span is the whole plane.
          </p>
        </div>
        <div className={`min-w-0 rounded-lg border p-3 ${subtlePanelClass}`}>
          <div className="rounded-lg overflow-hidden" style={mafsStyle}>
            <Mafs viewBox={{ x: [-6.5, 6.5], y: [-6.5, 6.5], padding: 0.25 }} height={300} zoom>
              <Coordinates.Cartesian />
              <MafsVector tip={u} color={Theme.blue} opacity={0.75} />
              <MafsVector tip={v} color={Theme.green} opacity={0.75} />
              <MafsVector tip={au} color={Theme.violet} />
              <MafsVector tail={au} tip={result} color={Theme.orange} />
              <MafsVector tip={result} color={Theme.red} />
              <Point x={result[0]} y={result[1]} color={Theme.red} />
            </Mafs>
          </div>
          <DiagramLegend
            items={[
              { label: <InlineMath math="\mathbf{u}" />, swatchClass: 'bg-blue-500' },
              { label: <InlineMath math="\mathbf{v}" />, swatchClass: 'bg-green-500' },
              { label: <InlineMath math="a\mathbf{u}" />, swatchClass: 'bg-violet-500' },
              { label: <InlineMath math="b\mathbf{v}" />, swatchClass: 'bg-orange-500' },
              { label: <InlineMath math="a\mathbf{u}+b\mathbf{v}" />, swatchClass: 'bg-red-500' },
            ]}
          />
        </div>
      </div>
    </InteractiveBlock>
  );
}

function MatrixTransformExplorer() {
  const { isDarkMode, subtlePanelClass } = useLinearTheme();
  const presets: { name: string; matrix: Matrix2; math: string }[] = [
    { name: 'Identity', matrix: [[1, 0], [0, 1]], math: String.raw`\begin{bmatrix}1&0\\0&1\end{bmatrix}` },
    { name: 'Stretch', matrix: [[2, 0], [0, 0.75]], math: String.raw`\begin{bmatrix}2&0\\0&0.75\end{bmatrix}` },
    { name: 'Shear', matrix: [[1, 1], [0, 1]], math: String.raw`\begin{bmatrix}1&1\\0&1\end{bmatrix}` },
    { name: 'Rotate', matrix: [[0, -1], [1, 0]], math: String.raw`\begin{bmatrix}0&-1\\1&0\end{bmatrix}` },
    { name: 'Project', matrix: [[1, 0], [0, 0]], math: String.raw`\begin{bmatrix}1&0\\0&0\end{bmatrix}` },
  ];
  const [presetIndex, setPresetIndex] = useState(2);
  const active = presets[presetIndex];
  const square: Vec2[] = [[0, 0], [1, 0], [1, 1], [0, 1]];
  const transformed = square.map((point) => transform(active.matrix, point));
  const scaleFactor = 70;
  const origin: Vec2 = [130, 190];
  const svgPoint = ([x, y]: Vec2): Vec2 => [origin[0] + x * scaleFactor, origin[1] - y * scaleFactor];
  const toPointString = (points: Vec2[]) => points.map((point) => svgPoint(point).join(',')).join(' ');
  const e1 = transform(active.matrix, [1, 0]);
  const e2 = transform(active.matrix, [0, 1]);
  const blue = isDarkMode ? '#60a5fa' : '#2563eb';
  const orange = isDarkMode ? '#fb923c' : '#ea580c';
  const grid = isDarkMode ? '#86efac55' : '#94a3b8';
  const renderSvgVector = (tip: Vec2, color: string, markerId: string, strokeWidth = 3) => {
    const [x1, y1] = origin;
    const [x2, y2] = svgPoint(tip);

    if (!isVisibleVector([0, 0], tip)) {
      return <circle cx={x1} cy={y1} r="4" fill={color} />;
    }

    return (
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        markerEnd={`url(#${markerId})`}
      />
    );
  };
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

  return (
    <InteractiveBlock title="Matrix as a Transformation">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(240px,290px)_minmax(0,1fr)]">
        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <p className="mb-3 text-sm font-bold uppercase tracking-wider">Choose a matrix</p>
          <div className="mb-4 grid grid-cols-2 gap-2">
            {presets.map((preset, index) => (
              <button key={preset.name} type="button" className={buttonClass(index === presetIndex)} onClick={() => setPresetIndex(index)}>
                {preset.name}
              </button>
            ))}
          </div>
          <MathBlock math={`A=${active.math}`} />
          <div className="mb-4 grid gap-2 text-xs">
            <div className="flex items-center justify-between gap-3">
              <span><InlineMath math="A\mathbf{e}_1" /></span>
              <InlineMath math={matrixVector(e1)} />
            </div>
            <div className="flex items-center justify-between gap-3">
              <span><InlineMath math="A\mathbf{e}_2" /></span>
              <InlineMath math={matrixVector(e2)} />
            </div>
          </div>
          <p className="text-sm leading-relaxed">
            The dashed blue square is the input. The orange shape is the image after applying <InlineMath math="A\mathbf{x}" /> to every corner.
          </p>
        </div>
        <div className={`min-w-0 rounded-lg border p-3 ${subtlePanelClass}`}>
          <svg viewBox="-50 -40 390 300" className="h-[300px] w-full" role="img" aria-label="Matrix transformation of a unit square">
            <defs>
              <marker id="linear-transform-arrow-blue" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L9,3 z" fill={blue} />
              </marker>
              <marker id="linear-transform-arrow-orange" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L9,3 z" fill={orange} />
              </marker>
            </defs>
            <line x1="-30" y1={origin[1]} x2="320" y2={origin[1]} stroke={grid} strokeWidth="1.5" />
            <line x1={origin[0]} y1="250" x2={origin[0]} y2="-20" stroke={grid} strokeWidth="1.5" />
            <polygon points={toPointString(square)} fill={blue} fillOpacity="0.08" stroke={blue} strokeWidth="2.5" strokeDasharray="7 5" />
            <polygon points={toPointString(transformed)} fill={orange} fillOpacity="0.16" stroke={orange} strokeWidth="3" />
            {renderSvgVector([1, 0], blue, 'linear-transform-arrow-blue')}
            {renderSvgVector([0, 1], blue, 'linear-transform-arrow-blue')}
            {renderSvgVector(e1, orange, 'linear-transform-arrow-orange', 4)}
            {renderSvgVector(e2, orange, 'linear-transform-arrow-orange', 4)}
          </svg>
          <DiagramLegend
            items={[
              { label: <InlineMath math="\mathbf{e}_1,\mathbf{e}_2" />, swatchClass: 'bg-blue-500' },
              { label: 'input square', swatchClass: 'border-blue-500', dashed: true },
              { label: <InlineMath math="A\mathbf{e}_1,A\mathbf{e}_2" />, swatchClass: 'bg-orange-500' },
              { label: 'transformed square', swatchClass: 'bg-orange-500' },
            ]}
          />
        </div>
      </div>
    </InteractiveBlock>
  );
}

function MarkovExplorer() {
  const { isDarkMode, subtlePanelClass } = useLinearTheme();
  const [steps, setSteps] = useState(0);
  const state = useMemo(() => {
    const transition: Matrix2 = [[0.85, 0.2], [0.15, 0.8]];
    let current: Vec2 = [1, 0];
    for (let i = 0; i < steps; i += 1) {
      current = transform(transition, current);
    }
    return current;
  }, [steps]);

  return (
    <InteractiveBlock title="Markov Chain State">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(230px,280px)_minmax(0,1fr)]">
        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 flex justify-between gap-3 text-sm font-bold" htmlFor="markov-steps">
            <span>Steps</span>
            <span>{steps}</span>
          </label>
          <input id="markov-steps" type="range" min="0" max="20" value={steps} onChange={(event) => setSteps(Number(event.target.value))} className="mb-4 w-full" />
          <MathBlock math={String.raw`P=\begin{bmatrix}0.85&0.20\\0.15&0.80\end{bmatrix}`} />
          <p className="text-sm leading-relaxed">
            Each column sums to 1, so multiplying by <InlineMath math="P" /> moves probability mass without creating or destroying it.
          </p>
        </div>
        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <div className="grid gap-4">
            {[
              ['State A', state[0]],
              ['State B', state[1]],
            ].map(([label, value]) => (
              <div key={label as string}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{label}</span>
                  <span>{formatNumber(value as number)}</span>
                </div>
                <div className={isDarkMode ? 'h-4 rounded bg-black/40' : 'h-4 rounded bg-slate-200'}>
                  <div
                    className={isDarkMode ? 'h-4 rounded bg-green-400' : 'h-4 rounded bg-blue-500'}
                    style={{ width: `${Math.min(100, Math.max(0, Number(value) * 100))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <MathBlock math={String.raw`\mathbf{x}_{${steps}}=${matrixVector(state)},\qquad \mathbf{x}_{k+1}=P\mathbf{x}_k`} />
        </div>
      </div>
    </InteractiveBlock>
  );
}

function EigenExplorer() {
  const { isDarkMode, subtlePanelClass, mafsStyle } = useLinearTheme();
  const [angle, setAngle] = useState(0);
  const theta = (angle * Math.PI) / 180;
  const vector: Vec2 = [Math.cos(theta), Math.sin(theta)];
  const matrix: Matrix2 = [[2, 0], [0, 0.5]];
  const image = transform(matrix, vector);
  const cross = vector[0] * image[1] - vector[1] * image[0];
  const isEigenDirection = Math.abs(cross) < 0.03;

  return (
    <InteractiveBlock title="Eigenvector Direction">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(230px,280px)_minmax(0,1fr)]">
        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 flex justify-between gap-3 text-sm font-bold" htmlFor="eigen-angle">
            <span>Direction</span>
            <span>{angle} deg</span>
          </label>
          <input id="eigen-angle" type="range" min="0" max="180" value={angle} onChange={(event) => setAngle(Number(event.target.value))} className="mb-4 w-full" />
          <MathBlock math={String.raw`A=\begin{bmatrix}2&0\\0&0.5\end{bmatrix}`} />
          <div className="mb-4 grid gap-2 text-xs">
            <div className="flex items-center justify-between gap-3">
              <span><InlineMath math="\mathbf{v}" /></span>
              <InlineMath math={matrixVector(vector)} />
            </div>
            <div className="flex items-center justify-between gap-3">
              <span><InlineMath math="A\mathbf{v}" /></span>
              <InlineMath math={matrixVector(image)} />
            </div>
          </div>
          <p className="text-sm leading-relaxed">
            A vector is an eigenvector when <InlineMath math="A\mathbf{v}" /> stays on the same line as <InlineMath math="\mathbf{v}" />. Here that happens on the coordinate axes.
          </p>
          <p className={`mt-3 text-sm font-bold ${isEigenDirection ? (isDarkMode ? 'text-green-300' : 'text-blue-600') : ''}`}>
            {isEigenDirection ? 'Same line: eigenvector direction' : 'Direction changed'}
          </p>
        </div>
        <div className={`min-w-0 rounded-lg border p-3 ${subtlePanelClass}`}>
          <div className="rounded-lg overflow-hidden" style={mafsStyle}>
            <Mafs viewBox={{ x: [-2.4, 2.4], y: [-2.4, 2.4], padding: 0.2 }} height={300} zoom>
              <Coordinates.Cartesian />
              <Line.ThroughPoints point1={[-2, 0]} point2={[2, 0]} color={Theme.green} style="dashed" />
              <Line.ThroughPoints point1={[0, -2]} point2={[0, 2]} color={Theme.green} style="dashed" />
              <MafsVector tip={vector} color={Theme.blue} />
              <MafsVector tip={image} color={Theme.orange} />
              <Point x={image[0]} y={image[1]} color={Theme.orange} />
            </Mafs>
          </div>
          <DiagramLegend
            items={[
              { label: <InlineMath math="\mathbf{v}" />, swatchClass: 'bg-blue-500' },
              { label: <InlineMath math="A\mathbf{v}" />, swatchClass: 'bg-orange-500' },
              { label: 'eigenvector lines', swatchClass: 'border-green-500', dashed: true },
            ]}
          />
        </div>
      </div>
    </InteractiveBlock>
  );
}

function ProjectionExplorer() {
  const { subtlePanelClass, mafsStyle } = useLinearTheme();
  const [x, setX] = useState(3);
  const [y, setY] = useState(2);
  const b: Vec2 = [x, y];
  const u: Vec2 = [2, 1];
  const scalar = dot(b, u) / normSquared(u);
  const projection = scale(u, scalar);
  const error = add(b, scale(projection, -1));

  return (
    <InteractiveBlock title="Projection and Residual">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(230px,280px)_minmax(0,1fr)]">
        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="projection-x">
            <span><InlineMath math="b_1" /></span>
            <span>{formatNumber(x)}</span>
          </label>
          <input id="projection-x" type="range" min="-4" max="4" step="0.5" value={x} onChange={(event) => setX(Number(event.target.value))} className="mb-4 w-full" />
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="projection-y">
            <span><InlineMath math="b_2" /></span>
            <span>{formatNumber(y)}</span>
          </label>
          <input id="projection-y" type="range" min="-4" max="4" step="0.5" value={y} onChange={(event) => setY(Number(event.target.value))} className="mb-4 w-full" />
          <MathBlock math={String.raw`\widehat{\mathbf{b}}=\operatorname{proj}_{\mathbf{u}}\mathbf{b}=${matrixVector(projection)}`} />
          <div className="mb-4 grid gap-2 text-xs">
            <div className="flex items-center justify-between gap-3">
              <span><InlineMath math="\mathbf{b}-\widehat{\mathbf{b}}" /></span>
              <InlineMath math={matrixVector(error)} />
            </div>
          </div>
          <p className="text-sm leading-relaxed">
            The error vector <InlineMath math="\mathbf{b}-\widehat{\mathbf{b}}" /> is perpendicular to the line. Least squares uses this same idea in higher dimensions.
          </p>
        </div>
        <div className={`min-w-0 rounded-lg border p-3 ${subtlePanelClass}`}>
          <div className="rounded-lg overflow-hidden" style={mafsStyle}>
            <Mafs viewBox={{ x: [-5.25, 5.25], y: [-5.25, 5.25], padding: 0.2 }} height={300} zoom>
              <Coordinates.Cartesian />
              <Line.ThroughPoints point1={[-4, -2]} point2={[4, 2]} color={Theme.green} />
              <MafsVector tip={b} color={Theme.blue} />
              <MafsVector tip={projection} color={Theme.orange} />
              <MafsVector tail={projection} tip={b} color={Theme.red} />
              <Point x={b[0]} y={b[1]} color={Theme.blue} />
              <Point x={projection[0]} y={projection[1]} color={Theme.orange} />
            </Mafs>
          </div>
          <DiagramLegend
            items={[
              { label: <InlineMath math="\mathbf{b}" />, swatchClass: 'bg-blue-500' },
              { label: <InlineMath math="\widehat{\mathbf{b}}" />, swatchClass: 'bg-orange-500' },
              { label: <InlineMath math="\mathbf{b}-\widehat{\mathbf{b}}" />, swatchClass: 'bg-red-500' },
              { label: <InlineMath math="\operatorname{Span}\{\mathbf{u}\}" />, swatchClass: 'border-green-500', dashed: true },
            ]}
          />
        </div>
      </div>
    </InteractiveBlock>
  );
}

export default function LinearAlgebraNote() {
  return (
    <NotesLayout>
      <NoteHeader
        title="Linear Algebra"
        subtitle="Algebra, geometry, and computation for thinking in many dimensions."
      />

      <NotationGuide />

      {/* 1. SYSTEMS */}
      <NoteSectionTitle id="linear-systems">1. Linear Systems</NoteSectionTitle>
      <NoteSubSectionTitle id="linear-equations-and-solutions">1.1 Linear Equations and Solutions</NoteSubSectionTitle>
      <NoteParagraph>
        A linear equation in variables <InlineMath math="x_1,\dots,x_n" /> has the form{' '}
        <InlineMath math="a_1x_1+\cdots+a_nx_n=b" />. The variables only appear to the first power, and there are no products like{' '}
        <InlineMath math="x_1x_2" />. A linear system is a collection of such equations using the same variables.
      </NoteParagraph>
      <NoteParagraph>
        A solution is a list of numbers that makes every equation true. A system is consistent if it has at least one solution and inconsistent if
        it has none. If it is consistent, it can have exactly one solution or infinitely many solutions.
      </NoteParagraph>
      <NoteSubSectionTitle id="geometry-of-systems">1.2 Geometry of Systems</NoteSubSectionTitle>
      <NoteParagraph>
        Geometrically, each linear equation cuts out a flat object: a line in <InlineMath math="\mathbb R^2" />, a plane in{' '}
        <InlineMath math="\mathbb R^3" />, and a hyperplane in higher dimensions. Solving the system means finding the common intersection.
      </NoteParagraph>
      <NoteTable
        headers={['Algebra result', 'Geometric picture']}
        rows={[
          ['Unique solution', 'all hyperplanes meet at one point'],
          ['No solution', 'the hyperplanes have no common intersection'],
          ['Infinitely many solutions', 'the common intersection is a line, plane, or higher-dimensional flat set'],
        ]}
      />
      <NoteSubSectionTitle id="matrices-of-a-system">1.3 Matrices of a System</NoteSubSectionTitle>
      <NoteParagraph>
        A matrix is a rectangular array of numbers. Its rows run horizontally and its columns run vertically. The coefficient matrix stores the
        coefficients on the left side of a system, while the augmented matrix appends the constants from the right side. For computation, this is
        the point where equations become an array we can manipulate.
      </NoteParagraph>
      <MathBlock math={String.raw`\left[\begin{array}{ccc|c}1&-2&1&5\\0&2&-8&-4\\6&5&9&-4\end{array}\right]`} />

      {/* 2. COMPUTATION */}
      <NoteSectionTitle id="numerical-computation">2. Numerical Computation</NoteSectionTitle>
      <NoteSubSectionTitle id="floating-point-thinking">2.1 Floating-Point Thinking</NoteSubSectionTitle>
      <NoteParagraph>
        Computation is not an afterthought. Mathematical real numbers are ideal objects, but computers store finite
        representations. Most real numbers are rounded to nearby floating-point numbers, so exact algebraic identities can fail mechanically.
      </NoteParagraph>
      <NoteParagraph>
        The practical question is not only whether a formula is true, but whether a computer can use it reliably. A well-conditioned problem is
        stable under small input errors. An ill-conditioned problem can turn tiny rounding errors into noticeably different answers.
      </NoteParagraph>
      <NoteTable
        headers={['Issue', 'Practical rule']}
        rows={[
          ['Representation error', 'expect about 16 decimal digits of accuracy in standard double precision'],
          ['Equality tests', <span>use closeness, not exact equality, for floating-point comparisons</span>],
          ['Ill-conditioning', 'small input errors can become large output errors'],
          ['Subtraction', 'subtracting nearly equal numbers can magnify relative error'],
        ]}
      />
      <NoteSubSectionTitle id="flops-and-cost">2.2 Flops and Cost</NoteSubSectionTitle>
      <NoteParagraph>
        A flop is a floating-point operation such as addition, multiplication, division, subtraction, or square root. Runtime is the time an
        algorithm takes to finish. For numerical algorithms, constants matter, so it is useful to track leading constants rather than only
        using broad asymptotic notation.
      </NoteParagraph>
      <MathBlock math={String.raw`\text{Gaussian elimination on }n\times n\text{ systems costs about }\frac{2}{3}n^3\text{ flops}`} />

      {/* 3. ELIMINATION */}
      <NoteSectionTitle id="gaussian-elimination">3. Gaussian Elimination</NoteSectionTitle>
      <NoteSubSectionTitle id="row-operations-and-echelon-form">3.1 Row Operations and Echelon Form</NoteSubSectionTitle>
      <NoteParagraph>
        Row reduction replaces a system with an equivalent system: different equations, same solution set. The allowed elementary row operations
        are swapping rows, scaling a row by a nonzero scalar, and adding a multiple of one row to another.
      </NoteParagraph>
      <NoteParagraph>
        Echelon form makes the structure visible. Nonzero rows sit above zero rows, leading entries move right as you move down, and entries below
        each leading entry are zero. Reduced echelon form goes further: each pivot is 1 and is the only nonzero entry in its column.
      </NoteParagraph>
      <NoteTable
        headers={['Object', 'Meaning']}
        rows={[
          ['Leading entry', 'first nonzero entry in a row'],
          ['Pivot position', 'location of a leading 1 in the reduced echelon form'],
          ['Basic variable', 'variable whose column has a pivot'],
          ['Free variable', 'variable whose column has no pivot'],
        ]}
      />
      <NoteSubSectionTitle id="pivot-and-free-variables">3.2 Pivot and Free Variables</NoteSubSectionTitle>
      <NoteParagraph>
        Free variables create families of solutions. If a consistent system has one free variable, the solution set is controlled by one
        parameter, so geometrically it behaves like a line. Two free variables produce a plane-like solution set, and so on.
      </NoteParagraph>
      <MathBlock math={String.raw`\left[\begin{array}{ccc|c}1&0&-5&1\\0&1&1&4\\0&0&0&0\end{array}\right]\quad\Longrightarrow\quad x_1=1+5x_3,\;x_2=4-x_3,\;x_3\text{ free}`} />
      <NoteSubSectionTitle id="elimination-template">3.3 Elimination Template</NoteSubSectionTitle>
      <NoteTopicGroup>
        <NoteTopicBlock title="Gaussian Elimination">
          <BulletList className="mb-0">
            <li>Find a pivot in the leftmost possible column.</li>
            <li>Swap rows if needed so the pivot is in the active row.</li>
            <li>Use row replacement to create zeros below the pivot.</li>
            <li>Repeat until echelon form exposes consistency and free variables.</li>
            <li>Scale pivots and clear above them to reach reduced echelon form.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      {/* 4. VECTORS */}
      <NoteSectionTitle id="vectors-and-linear-combinations">4. Vectors and Linear Combinations</NoteSectionTitle>
      <NoteSubSectionTitle id="vectors-in-rn">4.1 Vectors in Rn</NoteSubSectionTitle>
      <NoteParagraph>
        A vector is a column of numbers. The entries are called components. We can think of a vector as a point, as an arrow from the origin, or
        as data with several coordinates. These views are all useful, and the note constantly moves between them.
      </NoteParagraph>
      <NoteTable
        headers={['Operation', 'Definition']}
        rows={[
          ['Vector equality', 'corresponding components are equal'],
          ['Scalar multiplication', 'multiply every component by the scalar'],
          ['Vector addition', 'add corresponding components'],
          ['Dimension rule', 'vectors must have the same number of components to be added or compared'],
        ]}
      />
      <NoteSubSectionTitle id="linear-combinations-and-span">4.2 Linear Combinations and Span</NoteSubSectionTitle>
      <NoteParagraph>
        A linear combination uses weights to mix vectors: <InlineMath math="c_1\mathbf{v}_1+\cdots+c_p\mathbf{v}_p" />. The span of a set of
        vectors is the set of every vector you can reach by changing those weights.
      </NoteParagraph>
      <VectorCombinationExplorer />
      <NoteParagraph>
        Asking whether <InlineMath math="\mathbf{b}\in\operatorname{Span}\{\mathbf{v}_1,\dots,\mathbf{v}_p\}" /> is the same as asking whether
        the vector equation <InlineMath math="x_1\mathbf{v}_1+\cdots+x_p\mathbf{v}_p=\mathbf{b}" /> has a solution.
      </NoteParagraph>

      {/* 5. AXB */}
      <NoteSectionTitle id="matrix-equations">5. Matrix Equations</NoteSectionTitle>
      <NoteSubSectionTitle id="columns-of-a-matrix">5.1 Columns of a Matrix</NoteSubSectionTitle>
      <NoteParagraph>
        If <InlineMath math="A=[\mathbf{a}_1\;\mathbf{a}_2\;\cdots\;\mathbf{a}_n]" />, then{' '}
        <InlineMath math="A\mathbf{x}" /> is the linear combination of the columns of <InlineMath math="A" /> using the entries of{' '}
        <InlineMath math="\mathbf{x}" /> as weights.
      </NoteParagraph>
      <MathBlock math={String.raw`A\mathbf{x}=x_1\mathbf{a}_1+x_2\mathbf{a}_2+\cdots+x_n\mathbf{a}_n`} />
      <NoteSubSectionTitle id="existence-and-uniqueness">5.2 Existence and Uniqueness</NoteSubSectionTitle>
      <NoteParagraph>
        The equation <InlineMath math="A\mathbf{x}=\mathbf{b}" /> is solvable exactly when <InlineMath math="\mathbf{b}" /> is in the column
        span of <InlineMath math="A" />. It has a unique solution exactly when there are no free variables. These two questions - existence and
        uniqueness - drive much of linear algebra.
      </NoteParagraph>
      <NoteParagraph>
        The codomain is the target space where outputs are supposed to live. A map is onto, or surjective, when every vector in that target space is
        hit by some input. It is one-to-one, or injective, when different inputs never land on the same output.
      </NoteParagraph>
      <NoteTable
        headers={['Question', 'Equivalent check']}
        rows={[
          [<span>Does <InlineMath math="A\mathbf{x}=\mathbf{b}" /> have a solution?</span>, <span>Is <InlineMath math="\mathbf{b}" /> in <InlineMath math="\operatorname{Col}A" />?</span>],
          ['Is the solution unique?', 'Does every variable column have a pivot?'],
          [<span>Does <InlineMath math="A" /> map onto every vector in the codomain?</span>, <span>Does <InlineMath math="A" /> have a pivot in every row?</span>],
          [<span>Is the map <InlineMath math="\mathbf{x}\mapsto A\mathbf{x}" /> one-to-one?</span>, <span>Does <InlineMath math="A" /> have a pivot in every column?</span>],
        ]}
      />

      {/* 6. INDEPENDENCE */}
      <NoteSectionTitle id="linear-independence">6. Linear Independence</NoteSectionTitle>
      <NoteSubSectionTitle id="dependence-definition">6.1 Dependence Definition</NoteSubSectionTitle>
      <NoteParagraph>
        A set of vectors is linearly independent if the only way to make the zero vector as a linear combination is to use all zero weights. It is
        dependent if at least one vector is redundant - it can be built from the others.
      </NoteParagraph>
      <MathBlock math={String.raw`c_1\mathbf{v}_1+\cdots+c_p\mathbf{v}_p=\mathbf{0}\quad\Longrightarrow\quad c_1=\cdots=c_p=0`} />
      <NoteSubSectionTitle id="independence-intuition">6.2 Independence Intuition</NoteSubSectionTitle>
      <NoteParagraph>
        Independence means each vector contributes a genuinely new direction. In <InlineMath math="\mathbb R^2" />, two nonzero vectors are
        independent when they are not multiples. In <InlineMath math="\mathbb R^3" />, three vectors are independent when they do not all lie in
        the same plane through the origin.
      </NoteParagraph>
      <NoteTable
        headers={['Fast signal', 'Meaning']}
        rows={[
          ['More vectors than dimensions', 'the set must be dependent'],
          ['A zero vector appears', 'the set is dependent'],
          ['A vector is a multiple of another', 'the set is dependent'],
          ['Every column has a pivot', 'the columns are independent'],
        ]}
      />

      {/* 7. TRANSFORMATIONS */}
      <NoteSectionTitle id="linear-transformations-and-matrix-algebra">7. Linear Transformations and Matrix Algebra</NoteSectionTitle>
      <NoteSubSectionTitle id="linear-transformations">7.1 Linear Transformations</NoteSubSectionTitle>
      <NoteParagraph>
        A transformation <InlineMath math="T:\mathbb R^n\to\mathbb R^m" /> assigns an output vector in <InlineMath math="\mathbb R^m" /> to each
        input vector in <InlineMath math="\mathbb R^n" />. It is linear when it preserves vector addition and scalar multiplication.
      </NoteParagraph>
      <MathBlock math={String.raw`T(\mathbf{u}+\mathbf{v})=T(\mathbf{u})+T(\mathbf{v}),\qquad T(c\mathbf{u})=cT(\mathbf{u})`} />
      <NoteParagraph>
        Every matrix transformation <InlineMath math="\mathbf{x}\mapsto A\mathbf{x}" /> is linear. Conversely, every linear transformation from{' '}
        <InlineMath math="\mathbb R^n" /> to <InlineMath math="\mathbb R^m" /> has a standard matrix whose columns are the images of the standard
        basis vectors.
      </NoteParagraph>
      <MatrixTransformExplorer />
      <NoteSubSectionTitle id="matrix-products">7.2 Matrix Products</NoteSubSectionTitle>
      <NoteParagraph>
        Matrix multiplication is composition of transformations. The product <InlineMath math="AB" /> means first apply <InlineMath math="B" />,
        then apply <InlineMath math="A" />. This explains why matrix multiplication is usually not commutative.
      </NoteParagraph>
      <NoteParagraph>
        The dimensions must line up: if <InlineMath math="A" /> is <InlineMath math="m\times n" /> and <InlineMath math="B" /> is{' '}
        <InlineMath math="n\times p" />, then <InlineMath math="AB" /> is <InlineMath math="m\times p" />. The shared inner dimension is the
        space that the two transformations pass through.
      </NoteParagraph>
      <MathBlock math={String.raw`A(B\mathbf{x})=(AB)\mathbf{x}`} />

      {/* 8. INVERSES AND FACTORIZATIONS */}
      <NoteSectionTitle id="inverses-and-factorizations">8. Inverses and Factorizations</NoteSectionTitle>
      <NoteSubSectionTitle id="matrix-inverse">8.1 Matrix Inverse</NoteSubSectionTitle>
      <NoteParagraph>
        A square matrix <InlineMath math="A" /> is invertible if there is a matrix <InlineMath math="A^{-1}" /> with{' '}
        <InlineMath math="A^{-1}A=AA^{-1}=I" />. Geometrically, an inverse means the transformation can be undone exactly.
      </NoteParagraph>
      <NoteParagraph>
        Square means the matrix has the same number of rows and columns. Singular means not invertible: some direction is collapsed or some output
        direction is missing. For square matrices, <InlineMath math="\det A=0" /> is the determinant test for singularity.
      </NoteParagraph>
      <NoteTable
        headers={['Invertibility condition', 'Same idea in another language']}
        rows={[
          [<InlineMath math="A^{-1}" />, 'the transformation can be undone'],
          ['pivot in every row and column', 'no lost dimension and no missing output direction'],
          [<InlineMath math="A\mathbf{x}=\mathbf{b}" />, <span>unique solution for every <InlineMath math="\mathbf{b}" /></span>],
          [<InlineMath math="\operatorname{Nul}A=\{\mathbf{0}\}" />, 'only zero maps to zero'],
        ]}
      />
      <NoteSubSectionTitle id="lu-factorization">8.2 LU Factorization</NoteSubSectionTitle>
      <NoteParagraph>
        A factorization writes a matrix as a product of simpler matrices. LU factorization stores elimination as{' '}
        <InlineMath math="A=LU" />, where <InlineMath math="L" /> records lower-triangular elimination information and <InlineMath math="U" /> is
        upper triangular. Once built, it lets us solve many systems with the same coefficient matrix efficiently.
      </NoteParagraph>
      <MathBlock math={String.raw`A\mathbf{x}=\mathbf{b},\quad A=LU\quad\Longrightarrow\quad L\mathbf{y}=\mathbf{b},\;U\mathbf{x}=\mathbf{y}`} />

      {/* 9. APPLICATIONS */}
      <NoteSectionTitle id="computational-applications">9. Computational Applications</NoteSectionTitle>
      <NoteSubSectionTitle id="markov-chains">9.1 Markov Chains</NoteSubSectionTitle>
      <NoteParagraph>
        A Markov chain uses a matrix to update a probability vector. The current state determines the next state, and repeated multiplication
        describes long-run behavior.
      </NoteParagraph>
      <NoteParagraph>
        A probability vector has nonnegative entries that add to 1. A transition matrix stores the probabilities of moving between states. In the
        convention used here, each column adds to 1, so <InlineMath math="\mathbf{x}_{k+1}=P\mathbf{x}_k" /> keeps total probability equal to 1.
      </NoteParagraph>
      <MarkovExplorer />
      <NoteSubSectionTitle id="computer-graphics">9.2 Computer Graphics</NoteSubSectionTitle>
      <NoteParagraph>
        Computer graphics turns geometry into matrix multiplication. Scaling, rotation, shear, projection, and translation can be represented as
        matrices or homogeneous-coordinate transformations. Complex scenes are built by composing simple transformations.
      </NoteParagraph>
      <NoteTable
        headers={['Transformation', 'Matrix idea']}
        rows={[
          ['Scaling', 'stretch basis vectors'],
          ['Rotation', 'turn basis vectors while preserving length'],
          ['Shear', 'slide one coordinate in proportion to another'],
          ['Projection', 'drop information onto a lower-dimensional view'],
          ['Composition', 'multiply transformation matrices in order'],
        ]}
      />

      {/* 10. SUBSPACES */}
      <NoteSectionTitle id="subspaces-dimension-and-rank">10. Subspaces, Dimension, and Rank</NoteSectionTitle>
      <NoteSubSectionTitle id="subspaces">10.1 Subspaces</NoteSubSectionTitle>
      <NoteParagraph>
        A subspace is a set of vectors that contains the zero vector and is closed under addition and scalar multiplication. In practice, subspaces
        are flat spaces through the origin: lines, planes, and their higher-dimensional versions.
      </NoteParagraph>
      <NoteTable
        headers={['Subspace', 'Meaning']}
        rows={[
          [<InlineMath math="\operatorname{Col}A" />, <span>all outputs reachable as <InlineMath math="A\mathbf{x}" /></span>],
          [<InlineMath math="\operatorname{Nul}A" />, 'all inputs sent to the zero vector'],
          [<InlineMath math="\operatorname{Row}A" />, <span>span of the rows of <InlineMath math="A" /></span>],
          [<InlineMath math="\mathbb R^n" />, 'the full ambient vector space'],
        ]}
      />
      <NoteSubSectionTitle id="basis-dimension-rank">10.2 Basis, Dimension, and Rank</NoteSubSectionTitle>
      <NoteParagraph>
        A basis is a linearly independent spanning set. It gives coordinates for the subspace without redundancy. Dimension is the number of
        vectors in any basis. Rank is the dimension of the column space.
      </NoteParagraph>
      <MathBlock math={String.raw`\operatorname{rank}A=\dim(\operatorname{Col}A)=\text{number of pivot columns}`} />
      <NoteParagraph>
        The rank theorem connects inputs, lost directions, and output dimension:
      </NoteParagraph>
      <MathBlock math={String.raw`\operatorname{rank}A+\dim(\operatorname{Nul}A)=n\quad\text{for }A\in\mathbb R^{m\times n}`} />

      {/* 11. EIGENVALUES */}
      <NoteSectionTitle id="eigenvalues-and-diagonalization">11. Eigenvalues and Diagonalization</NoteSectionTitle>
      <NoteSubSectionTitle id="eigenvectors-and-eigenvalues">11.1 Eigenvectors and Eigenvalues</NoteSubSectionTitle>
      <NoteParagraph>
        An eigenvector is a nonzero vector whose direction is preserved by a matrix. The matrix may stretch, shrink, or reverse it, but it stays on
        the same line. The stretch factor is the eigenvalue.
      </NoteParagraph>
      <MathBlock math={String.raw`A\mathbf{v}=\lambda\mathbf{v},\qquad \mathbf{v}\ne\mathbf{0}`} />
      <EigenExplorer />
      <NoteSubSectionTitle id="characteristic-equation">11.2 Characteristic Equation</NoteSubSectionTitle>
      <NoteParagraph>
        Rearranging <InlineMath math="A\mathbf{v}=\lambda\mathbf{v}" /> gives{' '}
        <InlineMath math="(A-\lambda I)\mathbf{v}=\mathbf{0}" />. A nonzero solution exists exactly when{' '}
        <InlineMath math="A-\lambda I" /> is singular, which leads to the characteristic equation.
      </NoteParagraph>
      <NoteParagraph>
        The determinant detects whether a square matrix collapses volume. Setting <InlineMath math="\det(A-\lambda I)=0" /> asks for the values of
        <InlineMath math="\lambda" /> that make <InlineMath math="A-\lambda I" /> lose an inverse, which is exactly when a nonzero eigenvector can
        appear.
      </NoteParagraph>
      <MathBlock math={String.raw`\det(A-\lambda I)=0`} />
      <NoteSubSectionTitle id="diagonalization-and-pagerank">11.3 Diagonalization and PageRank</NoteSubSectionTitle>
      <NoteParagraph>
        A matrix is diagonalizable when it has enough independent eigenvectors to form a basis. Then the matrix acts like a diagonal matrix after a
        change of coordinates. This makes powers of the matrix much easier to understand.
      </NoteParagraph>
      <MathBlock math={String.raw`A=PDP^{-1}\quad\Longrightarrow\quad A^k=PD^kP^{-1}`} />
      <NoteParagraph>
        PageRank uses eigenvector thinking on a web-link matrix: a stable importance vector is a vector that remains unchanged, up to scale, after
        the link-following transformation.
      </NoteParagraph>

      {/* 12. ORTHOGONALITY */}
      <NoteSectionTitle id="orthogonality-and-projection">12. Orthogonality and Projection</NoteSectionTitle>
      <NoteSubSectionTitle id="dot-products-and-orthogonality">12.1 Dot Products and Orthogonality</NoteSubSectionTitle>
      <NoteParagraph>
        The dot product measures alignment. If <InlineMath math="\mathbf{u}\cdot\mathbf{v}=0" />, the vectors are orthogonal. Orthogonality is
        the algebraic version of a right angle, and it becomes the main tool for measuring distance to subspaces.
      </NoteParagraph>
      <MathBlock math={String.raw`\mathbf{u}\cdot\mathbf{v}=u_1v_1+\cdots+u_nv_n,\qquad \|\mathbf{v}\|=\sqrt{\mathbf{v}\cdot\mathbf{v}}`} />
      <NoteSubSectionTitle id="projection">12.2 Projection</NoteSubSectionTitle>
      <NoteParagraph>
        Projection breaks a vector into the part that lies in a subspace and the error that points perpendicular to that subspace. In one
        dimension, projection onto the line through <InlineMath math="\mathbf{u}" /> has a simple formula.
      </NoteParagraph>
      <MathBlock math={String.raw`\operatorname{proj}_{\mathbf{u}}\mathbf{b}=\frac{\mathbf{b}\cdot\mathbf{u}}{\mathbf{u}\cdot\mathbf{u}}\mathbf{u}`} />
      <ProjectionExplorer />
      <NoteSubSectionTitle id="orthogonal-bases">12.3 Orthogonal Bases</NoteSubSectionTitle>
      <NoteParagraph>
        Orthogonal bases make coordinates easy because each direction can be measured independently. Orthonormal bases are even cleaner: every
        basis vector has length 1, so projections become dot products.
      </NoteParagraph>
      <MathBlock math={String.raw`Q^TQ=I\quad\text{for a matrix }Q\text{ with orthonormal columns}`} />

      {/* 13. LEAST SQUARES */}
      <NoteSectionTitle id="least-squares-and-linear-models">13. Least Squares and Linear Models</NoteSectionTitle>
      <NoteSubSectionTitle id="least-squares">13.1 Least Squares</NoteSubSectionTitle>
      <NoteParagraph>
        Sometimes <InlineMath math="A\mathbf{x}=\mathbf{b}" /> has no exact solution. Least squares asks for the closest possible output in the
        column space of <InlineMath math="A" />. The residual <InlineMath math="\mathbf{b}-A\widehat{\mathbf{x}}" /> must be orthogonal to the
        column space.
      </NoteParagraph>
      <NoteParagraph>
        The vector <InlineMath math="\widehat{\mathbf{x}}" /> is the best-fit coefficient vector. The equation below is called the normal equation;
        it is the algebraic form of making the residual perpendicular to every column of <InlineMath math="A" />.
      </NoteParagraph>
      <MathBlock math={String.raw`A^TA\widehat{\mathbf{x}}=A^T\mathbf{b}`} />
      <NoteSubSectionTitle id="linear-models">13.2 Linear Models</NoteSubSectionTitle>
      <NoteParagraph>
        Linear models use least squares to fit data. The columns of the design matrix are features, the vector <InlineMath math="\mathbf{x}" /> is
        the coefficient vector, and <InlineMath math="A\mathbf{x}" /> is the model prediction.
      </NoteParagraph>
      <CodeBlock
        language="python"
        code={`import numpy as np

# A has one row per observation and one column per feature.
x_hat, residuals, rank, singular_values = np.linalg.lstsq(A, b, rcond=None)`}
      />

      {/* 14. SYMMETRIC MATRICES */}
      <NoteSectionTitle id="symmetric-matrices">14. Symmetric Matrices</NoteSectionTitle>
      <NoteSubSectionTitle id="spectral-theorem">14.1 Spectral Theorem</NoteSubSectionTitle>
      <NoteParagraph>
        A symmetric matrix satisfies <InlineMath math="A^T=A" />. Symmetric matrices are especially well-behaved: their eigenvalues are real, and
        eigenvectors from different eigenvalues are orthogonal. This makes them central in geometry, optimization, and data analysis.
      </NoteParagraph>
      <NoteParagraph>
        The spectral theorem says a symmetric matrix has an orthonormal eigenvector basis. In the factorization below, <InlineMath math="Q" /> has
        those orthonormal eigenvectors as columns, and <InlineMath math="D" /> stores the eigenvalues on the diagonal.
      </NoteParagraph>
      <MathBlock math={String.raw`A=QDQ^T\quad\text{for symmetric }A`} />
      <NoteSubSectionTitle id="quadratic-forms">14.2 Quadratic Forms</NoteSubSectionTitle>
      <NoteParagraph>
        A quadratic form is an expression like <InlineMath math="\mathbf{x}^TA\mathbf{x}" />. Symmetric matrices let us rotate coordinates to see
        whether the form is positive, negative, or mixed. This is the linear algebra behind ellipses, saddles, and many optimization tests.
      </NoteParagraph>
      <NoteTable
        headers={['Eigenvalue pattern', 'Quadratic form behavior']}
        rows={[
          ['all positive', 'positive definite: bowl-shaped'],
          ['all negative', 'negative definite: upside-down bowl'],
          ['mixed signs', 'indefinite: saddle-shaped'],
          ['zeros present', 'flat directions appear'],
        ]}
      />

      {/* 15. SVD */}
      <NoteSectionTitle id="singular-value-decomposition">15. Singular Value Decomposition</NoteSectionTitle>
      <NoteSubSectionTitle id="svd-structure">15.1 SVD Structure</NoteSubSectionTitle>
      <NoteParagraph>
        The singular value decomposition works for any matrix, square or rectangular. It writes a transformation as a rotation or reflection,
        followed by axis-aligned scaling, followed by another rotation or reflection.
      </NoteParagraph>
      <NoteParagraph>
        The singular values are the nonnegative scaling factors in that middle step. They tell which input directions are stretched the most and
        which directions are nearly flattened.
      </NoteParagraph>
      <MathBlock math={String.raw`A=U\Sigma V^T`} />
      <NoteTable
        headers={['Part', 'Meaning']}
        rows={[
          [<InlineMath math="V^T" />, 'choose the input directions'],
          [<InlineMath math="\Sigma" />, 'scale by singular values'],
          [<InlineMath math="U" />, 'place the output directions'],
        ]}
      />
      <NoteSubSectionTitle id="svd-applications">15.2 SVD Applications</NoteSubSectionTitle>
      <NoteParagraph>
        SVD reveals the dominant directions of a matrix. Keeping only the largest singular values gives a lower-rank approximation, which is why
        SVD appears in compression, noise reduction, principal component analysis, and recommender systems.
      </NoteParagraph>
      <MathBlock math={String.raw`A\approx \sigma_1\mathbf{u}_1\mathbf{v}_1^T+\cdots+\sigma_k\mathbf{u}_k\mathbf{v}_k^T`} />
      <NoteParagraph>
        Intuitively, each term is one layer of the transformation. The largest singular values describe the strongest layers; smaller singular
        values describe weaker detail.
      </NoteParagraph>
    </NotesLayout>
  );
}
