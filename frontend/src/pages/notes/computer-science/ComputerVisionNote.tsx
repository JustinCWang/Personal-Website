/**
 * Computer Vision Notes Page
 * A standalone note for image formation, camera geometry, filtering, features, recognition, dense prediction, generative models, and reconstruction.
 */

import { useState, type ReactNode } from 'react';
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

function useCVTheme() {
  const { isDarkMode } = useDarkMode();
  const subtlePanelClass = isDarkMode
    ? 'bg-green-500/5 border-green-500/20 text-green-100'
    : 'bg-slate-50 border-slate-200 text-slate-700';
  const strongPanelClass = isDarkMode
    ? 'bg-green-500/10 border-green-400/30 text-green-100'
    : 'bg-white border-slate-200 text-slate-800';
  const tableClass = `w-full border-collapse overflow-hidden rounded-lg font-mono text-sm ${
    isDarkMode ? 'text-green-100' : 'text-slate-700'
  }`;
  const tableHeadClass = isDarkMode ? 'bg-green-500/15 text-green-300' : 'bg-slate-100 text-slate-800';
  const tableCellClass = isDarkMode ? 'border border-green-500/20' : 'border border-slate-200';
  const listClass = `list-disc pl-6 mb-6 font-mono text-sm leading-relaxed space-y-2 ${
    isDarkMode ? 'text-green-100/90' : 'text-slate-700'
  }`;
  const orderedListClass = `list-decimal pl-6 mb-6 font-mono text-sm leading-relaxed space-y-2 ${
    isDarkMode ? 'text-green-100/90' : 'text-slate-700'
  }`;
  const primaryColor = isDarkMode ? '#4ade80' : '#2563eb';
  const secondaryColor = isDarkMode ? '#fb923c' : '#ea580c';
  const accentColor = isDarkMode ? '#38bdf8' : '#0891b2';
  const mutedColor = isDarkMode ? '#86efac66' : '#94a3b8';
  const textColor = isDarkMode ? '#bbf7d0' : '#334155';
  const panelFill = isDarkMode ? '#052e16' : '#f8fafc';

  return {
    subtlePanelClass,
    strongPanelClass,
    tableClass,
    tableHeadClass,
    tableCellClass,
    listClass,
    orderedListClass,
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
  const { listClass } = useCVTheme();
  return <ul className={`${listClass} ${className}`}>{children}</ul>;
}

function OrderedList({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { orderedListClass } = useCVTheme();
  return <ol className={`${orderedListClass} ${className}`}>{children}</ol>;
}

function NoteTable({ headers, rows }: { headers: ReactNode[]; rows: TableRow[] }) {
  const { tableClass, tableHeadClass, tableCellClass } = useCVTheme();

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

function MatrixGrid({ values }: { values: number[][] }) {
  const { subtlePanelClass, primaryColor, secondaryColor } = useCVTheme();

  return (
    <div className="grid grid-cols-3 gap-2">
      {values.flatMap((row, rowIndex) =>
        row.map((value, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`flex h-12 items-center justify-center rounded border text-sm ${subtlePanelClass}`}
            style={{
              backgroundColor: value >= 0 ? `${primaryColor}22` : `${secondaryColor}22`,
            }}
          >
            {value}
          </div>
        )),
      )}
    </div>
  );
}

function CVNotationGuide() {
  return (
    <NoteTopicGroup>
      <NoteTopicBlock title="Notation Used Throughout">
        <BulletList className="mb-0">
          <li><InlineMath math="I(x,y)" /> is image intensity or color at pixel coordinate <InlineMath math="(x,y)" />.</li>
          <li><InlineMath math="I_x" /> and <InlineMath math="I_y" /> are image derivatives in the horizontal and vertical directions.</li>
          <li><InlineMath math="\nabla I=[I_x,I_y]^T" /> is the image gradient, and <InlineMath math="\|\nabla I\|" /> is its magnitude.</li>
          <li><InlineMath math="X=(X,Y,Z)^T" /> is a 3D point. Lowercase <InlineMath math="x=(x,y)^T" /> is usually its image point.</li>
          <li><InlineMath math="f" /> is focal length. In the pinhole model, larger <InlineMath math="f" /> magnifies projected coordinates.</li>
          <li><InlineMath math="K" /> is the camera intrinsic matrix: focal lengths, principal point, and pixel scaling.</li>
          <li><InlineMath math="R" /> and <InlineMath math="t" /> usually mean camera rotation and translation. If a feature section uses <InlineMath math="R" /> for a score, it will redefine it locally.</li>
          <li><InlineMath math="P=K[R\mid t]" /> is a camera projection matrix that maps world points into image coordinates up to scale.</li>
          <li><InlineMath math="\rho" /> and <InlineMath math="\theta" /> parameterize a 2D line in Hough space: <InlineMath math="x\cos\theta+y\sin\theta=\rho" />.</li>
          <li><InlineMath math="\lambda_1,\lambda_2" /> are eigenvalues in the Harris corner section; they summarize local image variation in two directions.</li>
          <li><InlineMath math="z" /> is a latent variable for generative models. <InlineMath math="q(z\mid x)" /> is an encoder distribution, and <InlineMath math="p(x\mid z)" /> is a decoder distribution.</li>
          <li><InlineMath math="D" /> is a dictionary in sparse coding, and <InlineMath math="\alpha" /> is a sparse code with only a few active coefficients.</li>
        </BulletList>
      </NoteTopicBlock>
    </NoteTopicGroup>
  );
}

function ProjectionExplorer() {
  const { subtlePanelClass, primaryColor, secondaryColor, accentColor, mutedColor, textColor, panelFill } = useCVTheme();
  const [depth, setDepth] = useState(5);
  const [xWorld, setXWorld] = useState(1.2);
  const [yWorld, setYWorld] = useState(0.6);
  const [focal, setFocal] = useState(1.6);
  const xImage = (focal * xWorld) / depth;
  const yImage = (focal * yWorld) / depth;
  const cameraX = 70;
  const planeX = 155;
  const worldX = 430;
  const opticalY = 130;
  const worldY = opticalY - xWorld * 42;
  const imageY = opticalY - xImage * 120;

  return (
    <InteractiveBlock title="Pinhole Projection Explorer">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-3 flex justify-between gap-3 text-sm" htmlFor="cv-depth">
            <span>Depth <InlineMath math="Z" /></span>
            <span>{depth.toFixed(1)}</span>
          </label>
          <input id="cv-depth" type="range" min="2" max="9" step="0.1" value={depth} onChange={(event) => setDepth(Number(event.target.value))} className="mb-5 w-full" />

          <label className="mb-3 flex justify-between gap-3 text-sm" htmlFor="cv-x-world">
            <span>World offset <InlineMath math="X" /></span>
            <span>{xWorld.toFixed(1)}</span>
          </label>
          <input id="cv-x-world" type="range" min="-2" max="2" step="0.1" value={xWorld} onChange={(event) => setXWorld(Number(event.target.value))} className="mb-5 w-full" />

          <label className="mb-3 flex justify-between gap-3 text-sm" htmlFor="cv-y-world">
            <span>World offset <InlineMath math="Y" /></span>
            <span>{yWorld.toFixed(1)}</span>
          </label>
          <input id="cv-y-world" type="range" min="-2" max="2" step="0.1" value={yWorld} onChange={(event) => setYWorld(Number(event.target.value))} className="mb-5 w-full" />

          <label className="mb-3 flex justify-between gap-3 text-sm" htmlFor="cv-focal">
            <span>Focal length <InlineMath math="f" /></span>
            <span>{focal.toFixed(1)}</span>
          </label>
          <input id="cv-focal" type="range" min="0.7" max="3" step="0.1" value={focal} onChange={(event) => setFocal(Number(event.target.value))} className="w-full" />
        </div>

        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <svg viewBox="0 0 520 260" className="h-64 w-full">
            <rect x="0" y="0" width="520" height="260" rx="8" fill={panelFill} opacity="0.65" />
            <line x1="35" y1={opticalY} x2="485" y2={opticalY} stroke={mutedColor} strokeDasharray="6 6" />
            <line x1={planeX} y1="35" x2={planeX} y2="225" stroke={accentColor} strokeWidth="3" />
            <circle cx={cameraX} cy={opticalY} r="8" fill={primaryColor} />
            <line x1={cameraX} y1={opticalY} x2={worldX} y2={worldY} stroke={secondaryColor} strokeWidth="2.5" />
            <circle cx={worldX} cy={worldY} r="8" fill={secondaryColor} />
            <circle cx={planeX} cy={imageY} r="7" fill={accentColor} />
            <text x={cameraX} y={opticalY + 28} fill={textColor} fontSize="12" textAnchor="middle">center</text>
            <text x={planeX} y="28" fill={textColor} fontSize="12" textAnchor="middle">image plane</text>
            <text x={worldX} y={worldY - 14} fill={textColor} fontSize="12" textAnchor="middle">3D point</text>
            <text x={planeX + 12} y={imageY - 10} fill={textColor} fontSize="12">projected point</text>
          </svg>
          <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
            <div className={`rounded border p-3 ${subtlePanelClass}`}>
              <InlineMath math={`x=fX/Z=${xImage.toFixed(2)}`} />
            </div>
            <div className={`rounded border p-3 ${subtlePanelClass}`}>
              <InlineMath math={`y=fY/Z=${yImage.toFixed(2)}`} />
            </div>
          </div>
        </div>
      </div>
    </InteractiveBlock>
  );
}

type KernelName = 'box' | 'gaussian' | 'sharpen' | 'edge';

function ConvolutionExplorer() {
  const { subtlePanelClass, primaryColor, secondaryColor } = useCVTheme();
  const [kernelName, setKernelName] = useState<KernelName>('gaussian');
  const patch = [
    [20, 40, 45],
    [35, 90, 120],
    [30, 85, 160],
  ];
  const kernels: Record<KernelName, { label: string; values: number[][]; divisor: number; meaning: string }> = {
    box: {
      label: 'box blur',
      values: [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ],
      divisor: 9,
      meaning: 'Averages every neighbor equally, so it smooths but can smear edges.',
    },
    gaussian: {
      label: 'Gaussian blur',
      values: [
        [1, 2, 1],
        [2, 4, 2],
        [1, 2, 1],
      ],
      divisor: 16,
      meaning: 'Weights the center more than far neighbors, giving smoother denoising.',
    },
    sharpen: {
      label: 'sharpen',
      values: [
        [0, -1, 0],
        [-1, 5, -1],
        [0, -1, 0],
      ],
      divisor: 1,
      meaning: 'Subtracts neighbors from the center so local contrast becomes stronger.',
    },
    edge: {
      label: 'vertical edge',
      values: [
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1],
      ],
      divisor: 1,
      meaning: 'Compares left and right intensity. Large output means a strong vertical change.',
    },
  };
  const selected = kernels[kernelName];
  const raw = patch.reduce((sum, row, rowIndex) => {
    return sum + row.reduce((inner, value, colIndex) => inner + value * selected.values[rowIndex][colIndex], 0);
  }, 0);
  const output = raw / selected.divisor;

  return (
    <InteractiveBlock title="Convolution as a Local Dot Product">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(220px,280px)_1fr_minmax(220px,280px)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 block text-sm font-bold" htmlFor="cv-kernel">Kernel</label>
          <select
            id="cv-kernel"
            value={kernelName}
            onChange={(event) => setKernelName(event.target.value as KernelName)}
            className="w-full rounded border border-current/20 bg-transparent p-2 text-sm"
          >
            <option value="gaussian">Gaussian blur</option>
            <option value="box">Box blur</option>
            <option value="sharpen">Sharpen</option>
            <option value="edge">Vertical edge</option>
          </select>
          <NoteParagraph className="mb-0 mt-4 text-sm">{selected.meaning}</NoteParagraph>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto_1fr]">
          <div>
            <p className="mb-2 text-sm font-bold">image patch</p>
            <MatrixGrid values={patch} />
          </div>
          <div className="flex items-center justify-center text-2xl font-bold">.</div>
          <div>
            <p className="mb-2 text-sm font-bold">{selected.label} kernel</p>
            <MatrixGrid values={selected.values} />
          </div>
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <p className="mb-2 text-sm font-bold">center output</p>
          <div className="text-3xl font-bold" style={{ color: output >= 0 ? primaryColor : secondaryColor }}>
            {output.toFixed(1)}
          </div>
          <NoteParagraph className="mb-0 mt-4 text-sm">
            The kernel moves across the image. Each new center pixel gets a weighted sum of a nearby patch.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function CannyPipelineExplorer() {
  const { subtlePanelClass, primaryColor, secondaryColor, accentColor, mutedColor, textColor } = useCVTheme();
  const [step, setStep] = useState(2);
  const steps = [
    { name: 'smooth', detail: 'reduce noise before derivatives' },
    { name: 'gradient', detail: 'estimate magnitude and direction' },
    { name: 'thin', detail: 'keep local maxima along gradient direction' },
    { name: 'link', detail: 'use strong edges to keep connected weak edges' },
  ];

  return (
    <InteractiveBlock title="Canny Edge Detector Pipeline">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-3 flex justify-between gap-3 text-sm" htmlFor="cv-canny-step">
            <span>Pipeline step</span>
            <span>{steps[step].name}</span>
          </label>
          <input id="cv-canny-step" type="range" min="0" max="3" step="1" value={step} onChange={(event) => setStep(Number(event.target.value))} className="w-full" />
          <NoteParagraph className="mb-0 mt-4 text-sm">{steps[step].detail}</NoteParagraph>
        </div>
        <div className="grid gap-3 md:grid-cols-4">
          {steps.map((stage, index) => {
            const active = index <= step;
            const color = index === 0 ? primaryColor : index === 1 ? secondaryColor : index === 2 ? accentColor : primaryColor;
            return (
              <div key={stage.name} className={`rounded-lg border p-4 ${subtlePanelClass}`}>
                <div className="mb-3 h-24 rounded border border-current/20 p-3">
                  <svg viewBox="0 0 120 80" className="h-full w-full">
                    <path d="M10 62 C25 15, 43 75, 61 30 S96 38, 110 12" fill="none" stroke={active ? color : mutedColor} strokeWidth={index < 2 ? 8 - index * 2 : 2.5} strokeLinecap="round" opacity={active ? 0.85 : 0.35} />
                    {index >= 1 && <path d="M20 55 L35 30 M55 40 L75 28 M84 35 L102 20" stroke={active ? textColor : mutedColor} strokeWidth="2" opacity={active ? 0.75 : 0.25} />}
                  </svg>
                </div>
                <p className="text-sm font-bold">{stage.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    </InteractiveBlock>
  );
}

function HoughLineExplorer() {
  const { subtlePanelClass, primaryColor, secondaryColor, accentColor, mutedColor, textColor, panelFill } = useCVTheme();
  const [rho, setRho] = useState(8);
  const [thetaDeg, setThetaDeg] = useState(45);
  const theta = (thetaDeg * Math.PI) / 180;
  const cx = 180 + rho * Math.cos(theta);
  const cy = 120 + rho * Math.sin(theta);
  const dx = -Math.sin(theta) * 180;
  const dy = Math.cos(theta) * 180;

  return (
    <InteractiveBlock title="Hough Transform Line Parameters">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-3 flex justify-between gap-3 text-sm" htmlFor="cv-rho">
            <span><InlineMath math="\rho" /> distance</span>
            <span>{rho}</span>
          </label>
          <input id="cv-rho" type="range" min="-80" max="80" value={rho} onChange={(event) => setRho(Number(event.target.value))} className="mb-5 w-full" />
          <label className="mb-3 flex justify-between gap-3 text-sm" htmlFor="cv-theta">
            <span><InlineMath math="\theta" /> angle</span>
            <span>{thetaDeg} deg</span>
          </label>
          <input id="cv-theta" type="range" min="0" max="179" value={thetaDeg} onChange={(event) => setThetaDeg(Number(event.target.value))} className="w-full" />
          <NoteParagraph className="mb-0 mt-4 text-sm">
            A pixel votes for every line that could pass through it. Peaks in <InlineMath math="(\rho,\theta)" /> space reveal likely lines.
          </NoteParagraph>
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <svg viewBox="0 0 360 240" className="h-64 w-full">
            <rect x="0" y="0" width="360" height="240" rx="8" fill={panelFill} opacity="0.72" />
            <line x1="180" y1="20" x2="180" y2="220" stroke={mutedColor} strokeDasharray="5 5" />
            <line x1="40" y1="120" x2="320" y2="120" stroke={mutedColor} strokeDasharray="5 5" />
            <line x1={180} y1={120} x2={cx} y2={cy} stroke={secondaryColor} strokeWidth="2.5" markerEnd="url(#cv-hough-arrow)" />
            <line x1={cx - dx} y1={cy - dy} x2={cx + dx} y2={cy + dy} stroke={primaryColor} strokeWidth="4" strokeLinecap="round" />
            <circle cx="238" cy="82" r="6" fill={accentColor} />
            <circle cx="148" cy="148" r="6" fill={accentColor} />
            <circle cx="205" cy="109" r="6" fill={accentColor} />
            <defs>
              <marker id="cv-hough-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" fill={secondaryColor} />
              </marker>
            </defs>
            <text x="12" y="22" fill={textColor} fontSize="12">image plane</text>
            <text x={cx + 8} y={cy - 8} fill={textColor} fontSize="12">normal</text>
          </svg>
          <MathBlock math={`x\\cos(${thetaDeg}^{\\circ})+y\\sin(${thetaDeg}^{\\circ})=${rho}`} className="mb-0" />
        </div>
      </div>
    </InteractiveBlock>
  );
}

function HarrisCornerExplorer() {
  const { subtlePanelClass, primaryColor, secondaryColor, accentColor, mutedColor } = useCVTheme();
  const [lambdaOne, setLambdaOne] = useState(6);
  const [lambdaTwo, setLambdaTwo] = useState(5);
  const k = 0.05;
  const response = lambdaOne * lambdaTwo - k * (lambdaOne + lambdaTwo) ** 2;
  const classification =
    lambdaOne < 2 && lambdaTwo < 2 ? 'flat region' : lambdaOne > 3 && lambdaTwo > 3 ? 'corner' : 'edge';
  const color = classification === 'corner' ? primaryColor : classification === 'edge' ? secondaryColor : mutedColor;

  return (
    <InteractiveBlock title="Harris Corners from Two Local Variations">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-3 flex justify-between gap-3 text-sm" htmlFor="cv-lambda-one">
            <span><InlineMath math="\lambda_1" /></span>
            <span>{lambdaOne.toFixed(1)}</span>
          </label>
          <input id="cv-lambda-one" type="range" min="0.2" max="9" step="0.1" value={lambdaOne} onChange={(event) => setLambdaOne(Number(event.target.value))} className="mb-5 w-full" />
          <label className="mb-3 flex justify-between gap-3 text-sm" htmlFor="cv-lambda-two">
            <span><InlineMath math="\lambda_2" /></span>
            <span>{lambdaTwo.toFixed(1)}</span>
          </label>
          <input id="cv-lambda-two" type="range" min="0.2" max="9" step="0.1" value={lambdaTwo} onChange={(event) => setLambdaTwo(Number(event.target.value))} className="w-full" />
          <NoteParagraph className="mb-0 mt-4 text-sm">
            A corner has strong intensity change in two independent directions. An edge changes in mostly one direction.
          </NoteParagraph>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
          <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
            <p className="mb-3 text-sm font-bold">classification</p>
            <div className="flex h-36 items-center justify-center rounded border border-current/20 text-2xl font-bold" style={{ color }}>
              {classification}
            </div>
          </div>
          <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
            <p className="mb-3 text-sm font-bold">Harris response</p>
            <MathBlock math="R=\lambda_1\lambda_2-k(\lambda_1+\lambda_2)^2" />
            <div className="mt-4 h-7 rounded border border-current/20">
              <div className="h-full rounded" style={{ width: `${Math.min(100, Math.max(4, (response + 5) * 3))}%`, backgroundColor: color, opacity: 0.75 }} />
            </div>
            <p className="mt-3 text-sm" style={{ color: accentColor }}>R = {response.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function ModelFittingExplorer() {
  const { subtlePanelClass, primaryColor, secondaryColor, accentColor } = useCVTheme();
  const [outlierCount, setOutlierCount] = useState(4);
  const inliers = 18;
  const total = inliers + outlierCount;
  const inlierRatio = inliers / total;
  const sampleSize = 2;
  const successAfterTwenty = 1 - (1 - inlierRatio ** sampleSize) ** 20;

  return (
    <InteractiveBlock title="Why Robust Fitting Helps">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-3 flex justify-between gap-3 text-sm" htmlFor="cv-outliers">
            <span>Outliers</span>
            <span>{outlierCount}</span>
          </label>
          <input id="cv-outliers" type="range" min="0" max="24" value={outlierCount} onChange={(event) => setOutlierCount(Number(event.target.value))} className="w-full" />
          <NoteParagraph className="mb-0 mt-4 text-sm">
            Least squares tries to please every point. RANSAC-style fitting repeatedly samples small sets, fits a model, and keeps the model with the most inliers.
          </NoteParagraph>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
            <p className="mb-3 text-sm font-bold">points</p>
            <svg viewBox="0 0 280 170" className="h-44 w-full">
              <line x1="20" y1="132" x2="260" y2="38" stroke={primaryColor} strokeWidth="3" />
              {Array.from({ length: inliers }).map((_, index) => {
                const x = 30 + index * 12;
                const y = 132 - index * 4.6 + (index % 3) * 4;
                return <circle key={`in-${index}`} cx={x} cy={y} r="4" fill={primaryColor} opacity="0.85" />;
              })}
              {Array.from({ length: outlierCount }).map((_, index) => {
                const x = 35 + ((index * 37) % 210);
                const y = 35 + ((index * 53) % 110);
                return <circle key={`out-${index}`} cx={x} cy={y} r="4" fill={secondaryColor} opacity="0.9" />;
              })}
            </svg>
          </div>
          <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
            <p className="mb-3 text-sm font-bold">20 random two-point samples</p>
            <div className="text-3xl font-bold" style={{ color: successAfterTwenty > 0.8 ? primaryColor : accentColor }}>
              {(successAfterTwenty * 100).toFixed(0)}%
            </div>
            <NoteParagraph className="mb-0 mt-4 text-sm">
              Chance that at least one sample contains only inliers. More outliers mean robust methods need more trials.
            </NoteParagraph>
          </div>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function EMResponsibilityExplorer() {
  const { subtlePanelClass, primaryColor, secondaryColor } = useCVTheme();
  const [x, setX] = useState(1);
  const gaussian = (value: number, mean: number, sigma: number) => Math.exp(-0.5 * ((value - mean) / sigma) ** 2) / sigma;
  const left = 0.55 * gaussian(x, -1.4, 1.0);
  const right = 0.45 * gaussian(x, 2.0, 0.8);
  const total = left + right;
  const leftResp = left / total;
  const rightResp = right / total;

  return (
    <InteractiveBlock title="EM Responsibilities Are Soft Assignments">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-3 flex justify-between gap-3 text-sm" htmlFor="cv-em-x">
            <span>Data point <InlineMath math="x" /></span>
            <span>{x.toFixed(1)}</span>
          </label>
          <input id="cv-em-x" type="range" min="-4" max="5" step="0.1" value={x} onChange={(event) => setX(Number(event.target.value))} className="w-full" />
          <NoteParagraph className="mb-0 mt-4 text-sm">
            EM alternates between estimating responsibility for hidden components and refitting those components using the soft weights.
          </NoteParagraph>
        </div>
        <div className="space-y-4">
          {[
            { label: 'component 1', value: leftResp, color: primaryColor },
            { label: 'component 2', value: rightResp, color: secondaryColor },
          ].map((bar) => (
            <div key={bar.label} className={`rounded-lg border p-4 ${subtlePanelClass}`}>
              <div className="mb-2 flex justify-between gap-3 text-sm">
                <span>{bar.label}</span>
                <span>{(bar.value * 100).toFixed(1)}%</span>
              </div>
              <div className="h-8 rounded border border-current/20">
                <div className="h-full rounded" style={{ width: `${bar.value * 100}%`, backgroundColor: bar.color, opacity: 0.75 }} />
              </div>
            </div>
          ))}
          <MathBlock math="\gamma_{ik}=\frac{\pi_k p(x_i\mid z_i=k)}{\sum_j \pi_j p(x_i\mid z_i=j)}" />
        </div>
      </div>
    </InteractiveBlock>
  );
}

function DiffusionExplorer() {
  const { subtlePanelClass, primaryColor, secondaryColor, accentColor } = useCVTheme();
  const [step, setStep] = useState(45);
  const noise = step / 100;
  const cells = Array.from({ length: 64 }, (_, index) => {
    const pattern = ((index % 8) + Math.floor(index / 8)) % 2;
    const pseudoNoise = ((index * 37) % 100) / 100;
    return pattern * (1 - noise) + pseudoNoise * noise;
  });

  return (
    <InteractiveBlock title="Diffusion as Repeated Noise and Learned Denoising">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-3 flex justify-between gap-3 text-sm" htmlFor="cv-diffusion-step">
            <span>Noise step <InlineMath math="t" /></span>
            <span>{step}</span>
          </label>
          <input id="cv-diffusion-step" type="range" min="0" max="100" value={step} onChange={(event) => setStep(Number(event.target.value))} className="w-full" />
          <NoteParagraph className="mb-0 mt-4 text-sm">
            The forward process is fixed: add noise until the data is nearly Gaussian. The learned reverse process removes noise step by step.
          </NoteParagraph>
        </div>
        <div className="grid gap-4 md:grid-cols-[180px_minmax(0,1fr)]">
          <div className="grid h-[180px] w-[180px] grid-cols-8 overflow-hidden rounded-lg border border-current/20">
            {cells.map((value, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: value > 0.5 ? primaryColor : secondaryColor,
                  opacity: 0.25 + Math.abs(value - 0.5),
                }}
              />
            ))}
          </div>
          <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
            <p className="mb-3 text-sm font-bold">training target</p>
            <MathBlock math="x_t=\sqrt{\bar{\alpha}_t}x_0+\sqrt{1-\bar{\alpha}_t}\epsilon" />
            <NoteParagraph className="mb-0 text-sm">
              A model often predicts the noise <InlineMath math="\epsilon" /> that was added. Conditioning can guide denoising with a class, text prompt, mask, edge map, depth map, or low-resolution image.
            </NoteParagraph>
            <div className="mt-4 h-2 rounded" style={{ backgroundColor: `${accentColor}55` }}>
              <div className="h-full rounded" style={{ width: `${step}%`, backgroundColor: accentColor }} />
            </div>
          </div>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function SparseCodingExplorer() {
  const { subtlePanelClass, primaryColor, secondaryColor, accentColor } = useCVTheme();
  const [activeAtoms, setActiveAtoms] = useState(3);
  const atoms = [0.92, 0.68, 0.54, 0.4, 0.31, 0.22, 0.18, 0.11];
  const reconstruction = Math.min(99, 42 + activeAtoms * 8.5);
  const sparsity = Math.max(8, 100 - activeAtoms * 10);

  return (
    <InteractiveBlock title="Sparse Coding Tradeoff">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-3 flex justify-between gap-3 text-sm" htmlFor="cv-active-atoms">
            <span>Active dictionary atoms</span>
            <span>{activeAtoms}</span>
          </label>
          <input id="cv-active-atoms" type="range" min="1" max="8" value={activeAtoms} onChange={(event) => setActiveAtoms(Number(event.target.value))} className="w-full" />
          <NoteParagraph className="mb-0 mt-4 text-sm">
            A sparse code explains an image patch using only a few atoms from a larger dictionary. Fewer atoms give a simpler explanation; more atoms fit details better.
          </NoteParagraph>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
            <p className="mb-3 text-sm font-bold">dictionary coefficients</p>
            <div className="flex h-32 items-end gap-2">
              {atoms.map((value, index) => (
                <div key={index} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t"
                    style={{
                      height: `${value * 100}%`,
                      backgroundColor: index < activeAtoms ? primaryColor : secondaryColor,
                      opacity: index < activeAtoms ? 0.82 : 0.22,
                    }}
                  />
                  <span className="text-[10px]">{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
            {[
              { label: 'reconstruction detail', value: reconstruction, color: accentColor },
              { label: 'sparsity', value: sparsity, color: primaryColor },
            ].map((bar) => (
              <div key={bar.label} className="mb-4 last:mb-0">
                <div className="mb-2 flex justify-between gap-3 text-sm">
                  <span>{bar.label}</span>
                  <span>{bar.value.toFixed(0)}%</span>
                </div>
                <div className="h-7 rounded border border-current/20">
                  <div className="h-full rounded" style={{ width: `${bar.value}%`, backgroundColor: bar.color, opacity: 0.75 }} />
                </div>
              </div>
            ))}
            <MathBlock math="x\approx D\alpha" className="mt-3" />
          </div>
        </div>
      </div>
    </InteractiveBlock>
  );
}

export default function ComputerVisionNote() {
  return (
    <NotesLayout>
      <NoteHeader
        title="Computer Vision"
        subtitle="A geometry-first and data-driven guide to turning pixels into structure: cameras, projection, filtering, features, recognition, dense labeling, generative models, and reconstruction."
      />

      <CVNotationGuide />

      <NoteSectionTitle id="computer-vision-overview">1. Computer Vision Overview</NoteSectionTitle>
      <NoteParagraph>
        Computer vision studies how to recover useful information from images and videos. A raw image is just an array of measurements, but the goal is usually higher-level structure: edges, surfaces, objects, motion, depth, scene layout, semantic labels, or a generated image that matches a condition.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="The Main Pipeline">
          <BulletList className="mb-0">
            <li>Start with measurements from a camera or sensor.</li>
            <li>Clean, transform, or summarize the measurements.</li>
            <li>Use geometry, statistics, learning, or all three to infer structure.</li>
            <li>Evaluate whether the inferred structure is stable under viewpoint, lighting, scale, clutter, and noise.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="what-is-image-and-video-computing">2. What Is Image and Video Computing?</NoteSectionTitle>
      <NoteParagraph>
        Image and video computing is the broad family of methods that operate on visual data. It includes image processing, camera geometry, reconstruction, recognition, detection, segmentation, tracking, compression, enhancement, and image generation.
      </NoteParagraph>
      <NoteTable
        headers={['visual signal', 'examples of useful structure']}
        rows={[
          ['image appearance', 'edges, texture, color, material, illumination'],
          ['geometry', 'camera pose, depth, 3D shape, vanishing points, planar homographies'],
          ['semantics', 'objects, parts, classes, affordances, scene regions'],
          ['time', 'motion, optical flow, tracking, activity, temporal consistency'],
        ]}
      />

      <NoteSectionTitle id="why-vision-is-hard">3. Why Vision Is Hard</NoteSectionTitle>
      <NoteParagraph>
        Vision is hard because images are indirect measurements. The world is 3D, images are 2D, and the same object can look very different under changes in lighting, pose, scale, occlusion, deformation, camera settings, and background clutter.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="The Core Ambiguity">
          <NoteParagraph className="mb-0">
            A pixel value does not tell you what object produced it. It mixes surface color, lighting, reflectance, viewpoint, lens effects, sensor noise, and image processing. Most vision methods work by adding assumptions that make the inverse problem manageable.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="history-of-computer-vision">4. History of Computer Vision</NoteSectionTitle>
      <NoteParagraph>
        Computer vision has repeatedly moved between geometry, signal processing, statistics, and learning. Early work focused on simple worlds and geometric constraints. Later work emphasized multi-view geometry, multi-scale features, statistical models, local descriptors, and eventually deep neural networks.
      </NoteParagraph>
      <NoteTable
        headers={['idea', 'lasting contribution']}
        rows={[
          ['block worlds and shape analysis', 'showed that geometry and symbolic structure can be recovered in constrained scenes'],
          ['stereo and structure from motion', 'used multiple views to recover camera motion and 3D structure'],
          ['edges, corners, optical flow, and scale-space', 'made local image structure measurable and repeatable'],
          ['local features and visual words', 'made recognition more robust to viewpoint and clutter'],
          ['deep learning', 'learned features, detectors, segmenters, and generative models from data'],
        ]}
      />

      <NoteSectionTitle id="image-formation">5. Image Formation</NoteSectionTitle>
      <NoteParagraph>
        Image formation describes how light from the world becomes pixel values. A camera center collects rays, an optical system focuses them, a sensor measures energy, and later processing turns sensor measurements into a digital image.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Aperture Intuition">
          <NoteParagraph className="mb-0">
            A smaller aperture accepts fewer rays, so the image is darker but sharper. A larger aperture accepts more light, so the image is brighter but more sensitive to focus and depth-of-field blur.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="pinhole-camera-model">6. Pinhole Camera Model</NoteSectionTitle>
      <NoteParagraph>
        The pinhole model is the cleanest camera abstraction. Every visible 3D point sends one ray through the camera center to the image plane. For a 3D point <InlineMath math="(X,Y,Z)" />, the image coordinate is obtained by perspective division.
      </NoteParagraph>
      <MathBlock math="x=\frac{fX}{Z},\qquad y=\frac{fY}{Z}" />
      <ProjectionExplorer />

      <NoteSectionTitle id="homogeneous-coordinates">7. Homogeneous Coordinates</NoteSectionTitle>
      <NoteParagraph>
        Homogeneous coordinates add one extra coordinate so projection and translation can be written as matrix multiplication. In 2D, <InlineMath math="(x,y,w)" /> represents the ordinary point <InlineMath math="(x/w,y/w)" /> when <InlineMath math="w\ne 0" />.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Why the Extra Coordinate Helps">
          <BulletList className="mb-0">
            <li>Points that differ by nonzero scale represent the same location: <InlineMath math="(x,y,w)\sim (\alpha x,\alpha y,\alpha w)" />.</li>
            <li>Translations become matrix operations instead of special cases.</li>
            <li>Perspective projection is naturally represented because the final step divides by depth or scale.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="perspective-projection">8. Perspective Projection</NoteSectionTitle>
      <NoteParagraph>
        Perspective projection makes farther objects look smaller because image coordinates divide by depth. This projection loses information: every 3D point on the same camera ray maps to the same image point.
      </NoteParagraph>
      <MathBlock math="\tilde{x}\sim P\tilde{X},\qquad P=K[R\mid t]" />
      <NoteParagraph>
        The tilde indicates homogeneous coordinates. The symbol <InlineMath math="\sim" /> means equal up to a nonzero scale, so the final pixel coordinate is recovered by dividing by the last coordinate.
      </NoteParagraph>

      <NoteSectionTitle id="color-sensors-and-color-formats">9. Color Sensors and Color Formats</NoteSectionTitle>
      <NoteParagraph>
        Many cameras use a Bayer color filter array, where each sensor location measures only one color channel. Demosaicing estimates missing channels from neighboring measurements. Different color spaces then separate brightness and color in different ways.
      </NoteParagraph>
      <NoteTable
        headers={['format', 'useful idea']}
        rows={[
          ['RGB', 'stores red, green, and blue intensities directly'],
          ['grayscale', 'keeps luminance-like intensity when color is not needed'],
          ['luminance-chrominance spaces', 'separate brightness from color, useful for compression and some recognition tasks'],
          ['Bayer raw', 'captures one filtered color per sensor site before full-color reconstruction'],
        ]}
      />

      <NoteSectionTitle id="camera-calibration">10. Camera Calibration</NoteSectionTitle>
      <NoteParagraph>
        Camera calibration estimates the mapping from world coordinates to image coordinates. In the standard projective model, calibration separates intrinsics, which describe the camera internally, from extrinsics, which describe where the camera is in the world.
      </NoteParagraph>
      <MathBlock math="\tilde{x}\sim K[R\mid t]\tilde{X}" />
      <NoteParagraph>
        Calibration often uses points with known 3D or planar locations, observes where they land in the image, and solves for the camera parameters that best explain those correspondences.
      </NoteParagraph>

      <NoteSectionTitle id="intrinsic-parameters">11. Intrinsic Parameters</NoteSectionTitle>
      <NoteParagraph>
        Intrinsic parameters describe how camera-coordinate rays become pixel coordinates. They include focal lengths in pixel units, the principal point, skew if present, and sometimes lens distortion parameters.
      </NoteParagraph>
      <MathBlock math="K=\begin{bmatrix} f_x & s & c_x \\ 0 & f_y & c_y \\ 0 & 0 & 1 \end{bmatrix}" />
      <NoteTable
        headers={['symbol', 'meaning']}
        rows={[
          [<InlineMath math="f_x,f_y" />, 'focal lengths measured in horizontal and vertical pixel units'],
          [<InlineMath math="c_x,c_y" />, 'principal point, usually near the image center'],
          [<InlineMath math="s" />, 'skew between pixel axes, often zero in modern cameras'],
        ]}
      />

      <NoteSectionTitle id="extrinsic-parameters">12. Extrinsic Parameters</NoteSectionTitle>
      <NoteParagraph>
        Extrinsic parameters describe the camera pose relative to the world. A world point is rotated and translated into the camera coordinate frame before projection.
      </NoteParagraph>
      <MathBlock math="X_{\text{camera}}=R(X_{\text{world}}-C)=RX_{\text{world}}+t,\qquad t=-RC" />
      <NoteParagraph>
        Here <InlineMath math="C" /> is the camera center in world coordinates. Rotation <InlineMath math="R" /> changes orientation; translation <InlineMath math="t" /> shifts the origin into the camera frame.
      </NoteParagraph>

      <NoteSectionTitle id="triangulation">13. Triangulation</NoteSectionTitle>
      <NoteParagraph>
        Triangulation recovers a 3D point from two or more calibrated views. Each image observation defines a ray in space. In perfect data the rays intersect; in noisy data we choose the 3D point that best agrees with all rays.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Geometric Intuition">
          <NoteParagraph className="mb-0">
            One view gives a ray, not depth. A second view supplies another ray. The crossing point, or closest point between the rays, is the estimated 3D location.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="lighting-and-reflectance">14. Lighting and Reflectance</NoteSectionTitle>
      <NoteParagraph>
        Pixel intensity depends on incoming light, surface shape, material reflectance, view direction, shadows, and sensor response. This is why the same object can appear dramatically different across images.
      </NoteParagraph>
      <NoteTable
        headers={['component', 'role']}
        rows={[
          ['illumination', 'where light comes from and how much energy it has'],
          ['surface normal', 'which way the surface faces'],
          ['material', 'how the surface reflects, absorbs, or transmits light'],
          ['view direction', 'where the camera is relative to the surface'],
        ]}
      />

      <NoteSectionTitle id="brdf">15. BRDF</NoteSectionTitle>
      <NoteParagraph>
        A bidirectional reflectance distribution function, or BRDF, describes how much incoming light from one direction leaves a surface toward another direction. It is a compact way to talk about materials.
      </NoteParagraph>
      <NoteTable
        headers={['behavior', 'visual effect']}
        rows={[
          ['diffuse reflection', 'light scatters broadly, giving matte appearance'],
          ['specular reflection', 'light concentrates near mirror-like directions, giving highlights'],
          ['transparent or transmissive behavior', 'light passes through or refracts through material'],
        ]}
      />

      <NoteSectionTitle id="ray-tracing-and-path-tracing">16. Ray Tracing and Path Tracing</NoteSectionTitle>
      <NoteParagraph>
        Ray tracing renders images by sending rays from the camera into the scene, finding intersections, and computing light contributions. Path tracing extends this by sampling multiple light bounces, which can capture soft shadows, indirect illumination, and more realistic global lighting.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Rendering vs Vision">
          <NoteParagraph className="mb-0">
            Rendering maps scene structure to pixels. Vision tries to invert that process: it starts from pixels and infers something about the scene. The inversion is harder because many scenes can produce similar images.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="linear-filtering-and-convolution">17. Linear Filtering and Convolution</NoteSectionTitle>
      <NoteParagraph>
        Linear filtering replaces each pixel by a weighted sum of nearby pixels. The filter kernel encodes the operation: blur, sharpen, edge response, template response, or derivative estimate.
      </NoteParagraph>
      <MathBlock math="(I*K)(x,y)=\sum_u\sum_v I(x-u,y-v)K(u,v)" />
      <ConvolutionExplorer />

      <NoteSectionTitle id="gaussian-and-box-filtering">18. Gaussian and Box Filtering</NoteSectionTitle>
      <NoteParagraph>
        A box filter averages all pixels in a window equally. A Gaussian filter weights nearby pixels more than far pixels, which usually gives smoother behavior and fewer artifacts. Gaussian filters are also separable, so a 2D Gaussian blur can be implemented as one horizontal pass and one vertical pass.
      </NoteParagraph>
      <NoteTable
        headers={['filter', 'strength', 'weakness']}
        rows={[
          ['box blur', 'simple and fast', 'can produce blocky or smeared artifacts'],
          ['Gaussian blur', 'smooth, multi-scale, separable', 'still blurs true edges'],
          [<InlineMath math="\sigma" />, 'controls blur scale', 'large values remove detail as well as noise'],
        ]}
      />

      <NoteSectionTitle id="edge-detection">19. Edge Detection</NoteSectionTitle>
      <NoteParagraph>
        An edge is a location where image intensity or color changes rapidly. Edges can come from object boundaries, surface markings, shadows, changes in surface normal, depth discontinuities, or illumination changes.
      </NoteParagraph>
      <NoteParagraph>
        Edge detection is useful because it reduces a dense image to a sparse set of likely structural boundaries. The cost is ambiguity: not every edge is an object boundary, and some important boundaries are weak.
      </NoteParagraph>

      <NoteSectionTitle id="image-derivatives-and-gradients">20. Image Derivatives and Gradients</NoteSectionTitle>
      <NoteParagraph>
        Image derivatives measure local change. <InlineMath math="I_x" /> measures horizontal change, <InlineMath math="I_y" /> measures vertical change, and the gradient points in the direction where intensity increases fastest.
      </NoteParagraph>
      <MathBlock math="\nabla I=\begin{bmatrix}I_x\\I_y\end{bmatrix},\qquad \|\nabla I\|=\sqrt{I_x^2+I_y^2},\qquad \theta=\tan^{-1}(I_y/I_x)" />
      <NoteParagraph>
        The visible edge direction is perpendicular to the gradient direction. The gradient points across the edge from dark to bright, not along the edge.
      </NoteParagraph>

      <NoteSectionTitle id="derivative-of-gaussian-filters">21. Derivative of Gaussian Filters</NoteSectionTitle>
      <NoteParagraph>
        Derivatives amplify noise, so vision systems usually smooth before differentiating. By associativity of convolution, this can be done with derivative-of-Gaussian filters: convolve the image with a filter that both smooths and differentiates.
      </NoteParagraph>
      <MathBlock math="\frac{\partial}{\partial x}(G_\sigma * I)=\left(\frac{\partial G_\sigma}{\partial x}\right)*I" />

      <NoteSectionTitle id="canny-edge-detector">22. Canny Edge Detector</NoteSectionTitle>
      <NoteParagraph>
        The Canny detector turns noisy gradient measurements into thin, connected edge curves. Its steps are smoothing, gradient estimation, non-maximum suppression, and hysteresis thresholding.
      </NoteParagraph>
      <CannyPipelineExplorer />
      <CodeBlock
        language="text"
        code={`
smooth image with a Gaussian
compute gradient magnitude and direction
thin wide responses by non-maximum suppression
keep strong edges
keep weak edges only when connected to strong edges
        `}
      />

      <NoteSectionTitle id="morphological-operations">23. Morphological Operations</NoteSectionTitle>
      <NoteParagraph>
        Morphological operations process shapes in binary or mask-like images using a small structuring element. They are useful for cleaning segmentation masks, joining small gaps, removing specks, and changing object boundaries.
      </NoteParagraph>
      <NoteTable
        headers={['operation', 'effect']}
        rows={[
          ['erosion', 'shrinks foreground regions and removes small foreground noise'],
          ['dilation', 'grows foreground regions and fills small holes or gaps'],
          ['opening', 'erosion followed by dilation; removes small objects'],
          ['closing', 'dilation followed by erosion; fills small holes'],
        ]}
      />

      <NoteSectionTitle id="histogram-equalization">24. Histogram Equalization</NoteSectionTitle>
      <NoteParagraph>
        Histogram equalization remaps intensities so the output uses contrast more evenly. It is most helpful when an image uses only a narrow intensity range. It can also exaggerate noise or produce unnatural contrast if applied blindly.
      </NoteParagraph>
      <MathBlock math="s=T(r),\qquad T(r)=\sum_{j=0}^{r}p(j)" />
      <NoteParagraph>
        Here <InlineMath math="p(j)" /> is the normalized histogram probability of intensity <InlineMath math="j" />. The cumulative distribution function <InlineMath math="T" /> becomes the remapping curve.
      </NoteParagraph>

      <NoteSectionTitle id="hough-transform">25. Hough Transform</NoteSectionTitle>
      <NoteParagraph>
        The Hough transform detects simple shapes by voting in parameter space. For lines, each edge pixel votes for all <InlineMath math="(\rho,\theta)" /> pairs corresponding to lines that pass through that pixel.
      </NoteParagraph>
      <HoughLineExplorer />

      <NoteSectionTitle id="fourier-analysis">26. Fourier Analysis</NoteSectionTitle>
      <NoteParagraph>
        Fourier analysis represents an image as a sum of sinusoids at different frequencies and orientations. Low frequencies describe smooth structure; high frequencies describe rapid changes such as edges, texture, and noise.
      </NoteParagraph>
      <NoteTable
        headers={['frequency content', 'visual meaning']}
        rows={[
          ['low frequency', 'slow brightness changes, smooth shading, broad shapes'],
          ['mid frequency', 'texture, repeated patterns, many object details'],
          ['high frequency', 'edges, fine detail, sensor noise, compression artifacts'],
        ]}
      />

      <NoteSectionTitle id="frequency-domain-filtering">27. Frequency-Domain Filtering</NoteSectionTitle>
      <NoteParagraph>
        Filtering can be understood either in the image domain or the frequency domain. Blurring suppresses high frequencies. Sharpening boosts high frequencies. A notch filter suppresses selected frequencies, which is useful for periodic noise.
      </NoteParagraph>
      <MathBlock math="\mathcal{F}\{I*K\}=\mathcal{F}\{I\}\mathcal{F}\{K\}" />
      <NoteParagraph>
        This identity says convolution in the image domain becomes multiplication in the frequency domain.
      </NoteParagraph>

      <NoteSectionTitle id="image-pyramids-and-template-matching">28. Image Pyramids and Template Matching</NoteSectionTitle>
      <NoteParagraph>
        An image pyramid stores the same image at multiple scales. This is useful because objects can appear at different sizes. Template matching then scans a pattern over the image and scores how well it matches each location and scale.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Why Pyramids Matter">
          <NoteParagraph className="mb-0">
            Searching every possible scale directly is expensive. A pyramid converts scale search into a sequence of smaller, cheaper image searches.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="model-fitting">29. Model Fitting</NoteSectionTitle>
      <NoteParagraph>
        Model fitting chooses parameters that make a model agree with observed data. In vision, this might mean fitting a line to edge points, a homography to matched keypoints, a camera pose to correspondences, or a geometric primitive to 3D points.
      </NoteParagraph>
      <ModelFittingExplorer />

      <NoteSectionTitle id="feature-warping-and-generalized-linear-models">30. Feature Warping and Generalized Linear Models</NoteSectionTitle>
      <NoteParagraph>
        Feature warping transforms inputs before fitting a model. A linear model in transformed features can represent nonlinear behavior in the original input. Generalized linear models extend linear prediction by passing a linear score through a link function.
      </NoteParagraph>
      <MathBlock math="\hat{y}=g(w^T\phi(x)+b)" />
      <NoteParagraph>
        Here <InlineMath math="\phi(x)" /> is a feature map and <InlineMath math="g" /> is the response or link function. This same idea appears in classifiers, regressors, and learned feature extractors.
      </NoteParagraph>

      <NoteSectionTitle id="overfitting-and-regularization">31. Overfitting and Regularization</NoteSectionTitle>
      <NoteParagraph>
        Overfitting happens when a model explains accidental details of the training data instead of the stable signal. Regularization adds a preference for simpler, smoother, smaller, or more stable explanations.
      </NoteParagraph>
      <NoteTable
        headers={['tool', 'what it controls']}
        rows={[
          ['held-out validation', 'detects whether training performance transfers to unseen images'],
          [<InlineMath math="L_2" />, 'discourages large weights and usually gives smooth shrinkage'],
          [<InlineMath math="L_1" />, 'encourages sparse coefficients'],
          ['data augmentation', 'teaches invariance to transformations that should not change the label'],
        ]}
      />

      <NoteSectionTitle id="logistic-regression">32. Logistic Regression</NoteSectionTitle>
      <NoteParagraph>
        Logistic regression is a linear classifier that outputs a probability for a binary label. It is simple, convex in the standard setting, and useful as a baseline for image features.
      </NoteParagraph>
      <MathBlock math="P(y=1\mid x)=\sigma(w^T x+b),\qquad \sigma(a)=\frac{1}{1+e^{-a}}" />
      <NoteParagraph>
        The linear score <InlineMath math="w^Tx+b" /> defines a decision boundary. The sigmoid converts that score into a probability-like value between 0 and 1.
      </NoteParagraph>

      <NoteSectionTitle id="keypoint-detection">33. Keypoint Detection</NoteSectionTitle>
      <NoteParagraph>
        Keypoint detection finds repeatable locations that can be matched across images. Good keypoints are distinctive and stable under nuisance changes such as small viewpoint shifts, noise, and illumination changes.
      </NoteParagraph>
      <NoteTable
        headers={['property', 'why it matters']}
        rows={[
          ['repeatability', 'the same physical point is detected in different images'],
          ['distinctiveness', 'the local patch is not easily confused with many other patches'],
          ['locality', 'a small region is enough to describe and match the point'],
          ['invariance', 'matches survive scale, rotation, or illumination changes'],
        ]}
      />

      <NoteSectionTitle id="harris-corners">34. Harris Corners</NoteSectionTitle>
      <NoteParagraph>
        Harris corner detection measures how much a small image window changes when shifted. Flat regions barely change. Edges change strongly in one direction. Corners change strongly in two directions.
      </NoteParagraph>
      <HarrisCornerExplorer />

      <NoteSectionTitle id="sift-and-feature-invariance">35. SIFT and Feature Invariance</NoteSectionTitle>
      <NoteParagraph>
        SIFT builds local descriptors that are designed to be robust to scale and rotation changes. It detects stable scale-space extrema, assigns a dominant orientation, and describes local gradient patterns relative to that orientation.
      </NoteParagraph>
      <OrderedList className="mb-8">
        <li>Search over scale-space for stable extrema.</li>
        <li>Refine and reject unstable low-contrast or edge-like points.</li>
        <li>Assign an orientation from local gradient directions.</li>
        <li>Build a histogram-based descriptor of nearby gradients.</li>
      </OrderedList>

      <NoteSectionTitle id="image-recognition">36. Image Recognition</NoteSectionTitle>
      <NoteParagraph>
        Image recognition assigns labels to images or regions. A classical recognition pipeline extracts features, pools them into an image representation, trains a classifier, and evaluates generalization. Deep recognition systems learn features and classifiers jointly.
      </NoteParagraph>
      <NoteTable
        headers={['stage', 'classical version', 'learned version']}
        rows={[
          ['features', 'SIFT, HOG, color histograms, texture descriptors', 'convolutional or transformer features'],
          ['aggregation', 'visual words, spatial pyramids, pooling', 'pooling layers, attention, learned tokens'],
          ['classifier', 'logistic regression, SVM, nearest neighbor', 'linear head or detection/segmentation head'],
        ]}
      />

      <NoteSectionTitle id="bag-of-visual-words">37. Bag of Visual Words</NoteSectionTitle>
      <NoteParagraph>
        Bag of visual words represents an image by counting local descriptor types. First, descriptors are clustered into a visual vocabulary. Then each image becomes a histogram over those visual words.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="What It Keeps and Loses">
          <NoteParagraph className="mb-0">
            The representation keeps what local patterns appear, but mostly discards where they appear. That makes it robust to layout changes but weaker for structured scenes.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="spatial-pyramids">38. Spatial Pyramids</NoteSectionTitle>
      <NoteParagraph>
        Spatial pyramids add coarse layout back into bag-of-words features. Instead of one histogram for the whole image, the image is divided into grids at multiple resolutions and a histogram is computed in each cell.
      </NoteParagraph>
      <NoteParagraph>
        This creates a compromise: the representation is less rigid than exact geometry but more spatially aware than a single unordered histogram.
      </NoteParagraph>

      <NoteSectionTitle id="object-detection">39. Object Detection</NoteSectionTitle>
      <NoteParagraph>
        Object detection asks where objects are and what categories they belong to. The output is usually a set of bounding boxes, class labels, and confidence scores.
      </NoteParagraph>
      <NoteTable
        headers={['challenge', 'why it matters']}
        rows={[
          ['localization', 'the model must place boxes accurately, not just classify the image'],
          ['scale variation', 'objects may be tiny or fill the frame'],
          ['class imbalance', 'most candidate regions are background'],
          ['non-maximum suppression', 'duplicate boxes must be merged or removed'],
        ]}
      />

      <NoteSectionTitle id="r-cnn-fast-r-cnn-faster-r-cnn">40. R-CNN, Fast R-CNN, Faster R-CNN</NoteSectionTitle>
      <NoteParagraph>
        The R-CNN family shows the progression from slow region-based classification to shared feature computation and learned proposal generation.
      </NoteParagraph>
      <NoteTable
        headers={['model', 'main idea']}
        rows={[
          ['R-CNN', 'classify many proposed regions, with expensive feature extraction per region'],
          ['Fast R-CNN', 'compute shared image features once, then classify pooled region features'],
          ['Faster R-CNN', 'learn region proposals with a region proposal network'],
        ]}
      />

      <NoteSectionTitle id="dense-image-labeling">41. Dense Image Labeling</NoteSectionTitle>
      <NoteParagraph>
        Dense labeling assigns an output to every pixel or small image location. Semantic segmentation assigns a class to each pixel. Depth estimation assigns a depth value. Optical flow assigns motion. Instance segmentation assigns object identities as well as masks.
      </NoteParagraph>
      <NoteTable
        headers={['task', 'output']}
        rows={[
          ['semantic segmentation', 'one class label per pixel'],
          ['instance segmentation', 'class labels plus separate masks for each object instance'],
          ['depth estimation', 'a depth or disparity value per pixel'],
          ['optical flow', 'a 2D motion vector per pixel'],
        ]}
      />

      <NoteSectionTitle id="mean-shift-segmentation">42. Mean Shift Segmentation</NoteSectionTitle>
      <NoteParagraph>
        Mean shift is a mode-seeking algorithm. For segmentation, pixels are represented by features such as color and location. Each point repeatedly moves toward the local average of nearby points until it reaches a dense region.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Intuition">
          <NoteParagraph className="mb-0">
            Instead of assuming a fixed number of clusters, mean shift follows density hills. Points that climb to the same hilltop are grouped together.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="fully-convolutional-networks">43. Fully Convolutional Networks</NoteSectionTitle>
      <NoteParagraph>
        Fully convolutional networks replace final dense classification layers with convolutional layers so the network can output a spatial map. This makes them natural for segmentation and other dense prediction tasks.
      </NoteParagraph>
      <NoteParagraph>
        Downsampling gives large receptive fields and semantic context. Upsampling restores spatial resolution. Skip connections can combine high-level meaning with low-level detail.
      </NoteParagraph>

      <NoteSectionTitle id="instance-segmentation-and-mask-r-cnn">44. Instance Segmentation and Mask R-CNN</NoteSectionTitle>
      <NoteParagraph>
        Instance segmentation separates individual objects even when they have the same class. Mask R-CNN extends a detector by adding a mask prediction branch for each detected region.
      </NoteParagraph>
      <NoteTable
        headers={['output branch', 'purpose']}
        rows={[
          ['classification', 'predict object category'],
          ['box regression', 'refine the bounding box'],
          ['mask head', 'predict a binary object mask inside the region'],
        ]}
      />

      <NoteSectionTitle id="expectation-maximization">45. Expectation Maximization</NoteSectionTitle>
      <NoteParagraph>
        Expectation maximization, or EM, fits latent-variable models by alternating between hidden responsibility estimates and parameter updates. It is common in Gaussian mixture models, clustering-like segmentation, and probabilistic vision models.
      </NoteParagraph>
      <EMResponsibilityExplorer />

      <NoteSectionTitle id="autoencoders">46. Autoencoders</NoteSectionTitle>
      <NoteParagraph>
        An autoencoder learns to compress an input into a code and reconstruct the input from that code. The encoder maps <InlineMath math="x" /> to <InlineMath math="z" />. The decoder maps <InlineMath math="z" /> back to <InlineMath math="\hat{x}" />.
      </NoteParagraph>
      <MathBlock math="z=f_\theta(x),\qquad \hat{x}=g_\phi(z)" />
      <NoteParagraph>
        The bottleneck is the key idea. If the model can copy every input perfectly without constraint, it may learn an identity mapping instead of a useful representation. Linear autoencoders with squared reconstruction loss recover the same subspace idea as PCA.
      </NoteParagraph>

      <NoteSectionTitle id="variational-autoencoders">47. Variational Autoencoders</NoteSectionTitle>
      <NoteParagraph>
        A variational autoencoder, or VAE, makes the latent space probabilistic and sampleable. The encoder predicts a distribution over latent variables, usually with a mean and variance. The decoder maps sampled latent variables back to images.
      </NoteParagraph>
      <MathBlock math="\log p(x)\ge \mathbb{E}_{q(z\mid x)}[\log p(x\mid z)]-\mathrm{KL}(q(z\mid x)\|p(z))" />
      <NoteParagraph>
        The first term rewards reconstruction. The KL term keeps the encoded latent distribution close to a simple prior, commonly <InlineMath math="p(z)=\mathcal{N}(0,I)" />. The reparameterization trick writes <InlineMath math="z=\mu(x)+\sigma(x)\epsilon" /> so gradients can flow through sampling.
      </NoteParagraph>

      <NoteSectionTitle id="diffusion-models">48. Diffusion Models</NoteSectionTitle>
      <NoteParagraph>
        Diffusion models generate data by learning to reverse a gradual noising process. Starting from a real image <InlineMath math="x_0" />, the forward process creates noisier versions <InlineMath math="x_t" />. Generation starts from noise and repeatedly denoises.
      </NoteParagraph>
      <DiffusionExplorer />

      <NoteSectionTitle id="super-resolution">49. Super-Resolution</NoteSectionTitle>
      <NoteParagraph>
        Super-resolution reconstructs a high-resolution image from a low-resolution input. The task is ill-posed because many high-resolution images can downsample to the same low-resolution image, so methods rely on learned priors, patch statistics, or generative assumptions.
      </NoteParagraph>
      <NoteTable
        headers={['approach', 'intuition']}
        rows={[
          ['interpolation', 'fills missing pixels smoothly but cannot invent reliable detail'],
          ['patch-based methods', 'reuse high-resolution patterns associated with similar low-resolution patches'],
          ['deep models', 'learn image priors and task-specific reconstruction rules from data'],
        ]}
      />

      <NoteSectionTitle id="dictionary-learning-and-k-svd">50. Dictionary Learning and K-SVD</NoteSectionTitle>
      <NoteParagraph>
        Dictionary learning represents signals using a learned set of atoms. A sparse code combines only a few atoms to approximate each patch. K-SVD alternates between sparse coding and updating dictionary atoms with singular value decompositions.
      </NoteParagraph>
      <MathBlock math="\min_{D,\alpha_i}\sum_i\|x_i-D\alpha_i\|_2^2\quad \text{subject to}\quad \|\alpha_i\|_0\le s" />
      <SparseCodingExplorer />

      <NoteSectionTitle id="gpu-computing">51. GPU Computing</NoteSectionTitle>
      <NoteParagraph>
        Modern vision workloads often need GPU acceleration because convolutions, matrix multiplication, and batched tensor operations are expensive on large images and datasets.
      </NoteParagraph>
      <NoteTable
        headers={['concern', 'why it matters']}
        rows={[
          ['environment versions', 'CUDA, drivers, Python packages, and model code must be compatible'],
          ['batch size', 'larger batches use more GPU memory but can improve throughput'],
          ['checkpoints', 'long training runs need saved model states for recovery and comparison'],
          ['data loading', 'slow CPU preprocessing can leave the GPU idle'],
          ['reproducibility', 'random seeds and configuration values are needed to compare runs'],
        ]}
      />
    </NotesLayout>
  );
}
