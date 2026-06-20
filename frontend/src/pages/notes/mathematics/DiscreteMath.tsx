/**
 * Discrete Mathematics Notes Page
 * Discrete mathematics notes focused on formal reasoning and discrete structures.
 */

import { useId, useMemo, useState, type ReactNode } from 'react';
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

const boolLabel = (value: boolean) => (value ? 'T' : 'F');
const mod = (value: number, modulus: number) => ((value % modulus) + modulus) % modulus;

const euclideanAlgorithmCode = `
def gcd(a, b):
    a, b = abs(a), abs(b)
    yield a, b, None, None
    while b != 0:
        q = a // b
        r = a % b
        yield a, b, q, r
        a, b = b, r
    return a
`;

function useDiscreteTheme() {
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
  const tableHeadClass = isDarkMode
    ? 'bg-green-500/15 text-green-300'
    : 'bg-slate-100 text-slate-800';
  const tableCellClass = isDarkMode
    ? 'border border-green-500/20'
    : 'border border-slate-200';
  return {
    isDarkMode,
    subtlePanelClass,
    listClass,
    tableClass,
    tableHeadClass,
    tableCellClass,
  };
}

function BulletList({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { listClass } = useDiscreteTheme();
  return <ul className={`${listClass} ${className}`}>{children}</ul>;
}

function NoteTable({ headers, rows }: { headers: ReactNode[]; rows: TableRow[] }) {
  const { tableClass, tableHeadClass, tableCellClass } = useDiscreteTheme();

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

function FunctionMappingDiagram() {
  const { isDarkMode, subtlePanelClass } = useDiscreteTheme();
  const stroke = isDarkMode ? '#86efac' : '#2563eb';
  const nodeFill = isDarkMode ? '#052e16' : '#eff6ff';
  const textFill = isDarkMode ? '#bbf7d0' : '#1e293b';
  const markerId = useId().replace(/:/g, '');
  const arrowId = `function-arrow-${markerId}`;

  return (
    <div className={`mb-8 rounded-xl border p-4 ${subtlePanelClass}`}>
      <p className="mb-3 text-sm font-bold uppercase tracking-wider">Function Mapping</p>
      <svg viewBox="0 0 520 220" className="h-64 w-full" role="img" aria-label="Function mapping from domain to codomain">
        <defs>
          <marker id={arrowId} markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill={stroke} />
          </marker>
        </defs>
        <text x="80" y="28" textAnchor="middle" fontFamily="monospace" fontSize="15" fontWeight="700" fill={textFill}>Domain A</text>
        <text x="420" y="28" textAnchor="middle" fontFamily="monospace" fontSize="15" fontWeight="700" fill={textFill}>Codomain B</text>
        {[
          { label: 'a1', x: 80, y: 70 },
          { label: 'a2', x: 80, y: 120 },
          { label: 'a3', x: 80, y: 170 },
        ].map((node) => (
          <g key={node.label}>
            <circle cx={node.x} cy={node.y} r="22" fill={nodeFill} stroke={stroke} strokeWidth="2" />
            <text x={node.x} y={node.y + 5} textAnchor="middle" fontFamily="monospace" fontSize="14" fill={textFill}>{node.label}</text>
          </g>
        ))}
        {[
          { label: 'b1', x: 420, y: 70 },
          { label: 'b2', x: 420, y: 120 },
          { label: 'b3', x: 420, y: 170 },
        ].map((node) => (
          <g key={node.label}>
            <circle cx={node.x} cy={node.y} r="22" fill={nodeFill} stroke={stroke} strokeWidth="2" />
            <text x={node.x} y={node.y + 5} textAnchor="middle" fontFamily="monospace" fontSize="14" fill={textFill}>{node.label}</text>
          </g>
        ))}
        <line x1="104" y1="70" x2="394" y2="70" stroke={stroke} strokeWidth="3" markerEnd={`url(#${arrowId})`} />
        <line x1="104" y1="120" x2="394" y2="170" stroke={stroke} strokeWidth="3" markerEnd={`url(#${arrowId})`} />
        <line x1="104" y1="170" x2="394" y2="120" stroke={stroke} strokeWidth="3" markerEnd={`url(#${arrowId})`} />
      </svg>
    </div>
  );
}

function SetOperationSummary() {
  const universe = String.raw`\{1,2,3,4,5,6,7,8\}`;
  const setA = String.raw`\{1,2,3,4\}`;
  const setB = String.raw`\{3,4,5,6\}`;

  return (
    <>
      <NoteParagraph>
        Example universe: <InlineMath math={`U=${universe}`} />, <InlineMath math={`A=${setA}`} />, and <InlineMath math={`B=${setB}`} />.
        The table below shows exactly which elements survive each operation.
      </NoteParagraph>
      <NoteTable
        headers={['Operation', 'Meaning', 'Result in the example']}
        rows={[
          [<InlineMath math="A\cup B" />, 'in A or in B, including both', <InlineMath math="\{1,2,3,4,5,6\}" />],
          [<InlineMath math="A\cap B" />, 'in both A and B', <InlineMath math="\{3,4\}" />],
          [<InlineMath math="A-B" />, 'in A but not in B', <InlineMath math="\{1,2\}" />],
          [<InlineMath math="A^c" />, 'in the universe but not in A', <InlineMath math="\{5,6,7,8\}" />],
        ]}
      />
    </>
  );
}

function RelationRepresentationPanel() {
  return (
    <NoteTopicGroup>
      <NoteTopicBlock title="Small Relation Example">
        <NoteParagraph>
          Let <InlineMath math="A=\{a,b,c\}" /> and <InlineMath math="R=\{(a,a),(b,b),(c,c),(a,b),(b,c),(a,c)\}" />. The same relation can be
          read as ordered pairs or as a matrix.
        </NoteParagraph>
        <NoteTable
          headers={['Rows/columns', 'a', 'b', 'c']}
          rows={[
            ['a', '1', '1', '1'],
            ['b', '0', '1', '1'],
            ['c', '0', '0', '1'],
          ]}
        />
        <NoteParagraph className="mb-0">
          A 1 means the ordered pair is in the relation. For example, the row <InlineMath math="a" /> and column <InlineMath math="b" /> entry is
          1 because <InlineMath math="aRb" />.
        </NoteParagraph>
      </NoteTopicBlock>
    </NoteTopicGroup>
  );
}

function RecursiveDefinitionFlow() {
  const cards = [
    ['Basis step', 'Name the starting objects.'],
    ['Recursive rule', 'Describe how old objects produce new objects.'],
    ['Closure', 'Only objects forced by those rules are included.'],
  ];

  return (
    <NoteTopicGroup>
      {cards.map(([title, text], index) => (
        <NoteTopicBlock key={title} title={`${index + 1}. ${title}`}>
          <NoteParagraph className="mb-0">{text}</NoteParagraph>
        </NoteTopicBlock>
      ))}
    </NoteTopicGroup>
  );
}

function InductionTemplate() {
  const steps = [
    ['Base case', 'Verify the first value directly. For the sum formula, prove S(1): 1 = 1(1 + 1) / 2.'],
    ['Inductive hypothesis', 'Assume 1 + 2 + ... + k = k(k + 1) / 2 for one arbitrary k.'],
    ['Inductive step', 'Add k + 1 to both sides and simplify to (k + 1)(k + 2) / 2.'],
    ['Conclusion', 'The base case starts the chain, and the step moves from any true rung to the next.'],
  ];

  return (
    <NoteTopicGroup>
      {steps.map(([title, text], index) => (
        <NoteTopicBlock key={title} title={`Step ${index + 1}: ${title}`}>
          <NoteParagraph className="mb-0">{text}</NoteParagraph>
        </NoteTopicBlock>
      ))}
    </NoteTopicGroup>
  );
}

function NotationGuide() {
  return (
    <NoteTopicGroup>
      <NoteTopicBlock title="Notation Used Throughout">
        <BulletList className="mb-0">
          <li><InlineMath math="\mathbb N" />: natural numbers. Depending on the class, this may start at 0 or 1; I will say when the starting point matters.</li>
          <li><InlineMath math="\mathbb Z" />: integers, including negative integers, 0, and positive integers.</li>
          <li><InlineMath math="\mathbb Q" />: rational numbers, meaning fractions of integers with nonzero denominator.</li>
          <li><InlineMath math="\mathbb R" />: real numbers.</li>
          <li><InlineMath math="\in" /> means "is an element of"; <InlineMath math="\notin" /> means "is not an element of".</li>
          <li><InlineMath math="\emptyset" /> is the empty set, and <InlineMath math="|S|" /> is the cardinality, or size, of a set <InlineMath math="S" />.</li>
          <li><InlineMath math="\subseteq" /> means subset; <InlineMath math="\subset" /> is used here for proper subset.</li>
          <li><InlineMath math="\mathcal P(S)" /> is the power set of <InlineMath math="S" />, the set of all subsets of <InlineMath math="S" />.</li>
          <li><InlineMath math="A\times B" /> is the Cartesian product: all ordered pairs <InlineMath math="(a,b)" /> with <InlineMath math="a\in A" /> and <InlineMath math="b\in B" />.</li>
          <li><InlineMath math="\forall" /> means "for all"; <InlineMath math="\exists" /> means "there exists"; <InlineMath math="\exists!" /> means "there exists exactly one".</li>
          <li><InlineMath math="\neg,\land,\lor,\to,\leftrightarrow,\oplus" /> mean NOT, AND, OR, conditional, biconditional, and XOR.</li>
          <li><InlineMath math=":" /> or <InlineMath math="\mid" /> inside set-builder notation means "such that".</li>
          <li><InlineMath math="\Longleftrightarrow" /> and "iff" mean "if and only if".</li>
          <li><InlineMath math="\lceil x\rceil" /> is the ceiling of <InlineMath math="x" />, the smallest integer at least as large as <InlineMath math="x" />.</li>
        </BulletList>
      </NoteTopicBlock>
    </NoteTopicGroup>
  );
}

function TruthTableExplorer() {
  const { isDarkMode, subtlePanelClass } = useDiscreteTheme();
  const [p, setP] = useState(true);
  const [q, setQ] = useState(false);

  const rows = [
    { p: false, q: false },
    { p: false, q: true },
    { p: true, q: false },
    { p: true, q: true },
  ];

  const buttonClass = (active: boolean) =>
    `rounded-md border px-3 py-2 text-sm font-bold transition-colors ${
      active
        ? isDarkMode
          ? 'border-green-400 bg-green-400 text-black'
          : 'border-blue-500 bg-blue-500 text-white'
        : isDarkMode
          ? 'border-green-500/30 bg-black/30 text-green-200 hover:bg-green-500/10'
          : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-100'
    }`;

  return (
    <InteractiveBlock title="Truth Table Explorer">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[180px_1fr]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <p className="mb-3 text-sm font-bold uppercase tracking-wider">Inputs</p>
          <div className="space-y-3">
            <div>
              <p className="mb-2 text-sm"><InlineMath math="p" /></p>
              <div className="flex gap-2">
                <button className={buttonClass(p)} onClick={() => setP(true)}>T</button>
                <button className={buttonClass(!p)} onClick={() => setP(false)}>F</button>
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm"><InlineMath math="q" /></p>
              <div className="flex gap-2">
                <button className={buttonClass(q)} onClick={() => setQ(true)}>T</button>
                <button className={buttonClass(!q)} onClick={() => setQ(false)}>F</button>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-center text-sm">
            <thead>
              <tr className={isDarkMode ? 'text-green-300' : 'text-slate-800'}>
                <th className="px-2 py-2">p</th>
                <th className="px-2 py-2">q</th>
                <th className="px-2 py-2"><InlineMath math="\neg p" /></th>
                <th className="px-2 py-2"><InlineMath math="p\land q" /></th>
                <th className="px-2 py-2"><InlineMath math="p\lor q" /></th>
                <th className="px-2 py-2"><InlineMath math="p\to q" /></th>
                <th className="px-2 py-2"><InlineMath math="p\leftrightarrow q" /></th>
                <th className="px-2 py-2"><InlineMath math="p\oplus q" /></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const active = row.p === p && row.q === q;
                return (
                  <tr key={`${row.p}-${row.q}`} className={active ? (isDarkMode ? 'bg-green-500/15' : 'bg-blue-50') : ''}>
                    <td className="px-2 py-2">{boolLabel(row.p)}</td>
                    <td className="px-2 py-2">{boolLabel(row.q)}</td>
                    <td className="px-2 py-2">{boolLabel(!row.p)}</td>
                    <td className="px-2 py-2">{boolLabel(row.p && row.q)}</td>
                    <td className="px-2 py-2">{boolLabel(row.p || row.q)}</td>
                    <td className="px-2 py-2">{boolLabel(!row.p || row.q)}</td>
                    <td className="px-2 py-2">{boolLabel(row.p === row.q)}</td>
                    <td className="px-2 py-2">{boolLabel(row.p !== row.q)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function QuantifierDependencyExplorer() {
  const { isDarkMode, subtlePanelClass } = useDiscreteTheme();
  const xs = [1, 2, 3];
  const ys = [2, 3, 4];
  const predicates = {
    successor: {
      label: String.raw`R(x,y): y=x+1`,
      test: (x: number, y: number) => y === x + 1,
    },
    greater: {
      label: String.raw`R(x,y): y>x`,
      test: (x: number, y: number) => y > x,
    },
    less: {
      label: String.raw`R(x,y): y<x`,
      test: (x: number, y: number) => y < x,
    },
  };
  const [predicateKey, setPredicateKey] = useState<keyof typeof predicates>('successor');
  const predicate = predicates[predicateKey];

  const allHaveWitness = xs.every((x) => ys.some((y) => predicate.test(x, y)));
  const globalWitnesses = ys.filter((y) => xs.every((x) => predicate.test(x, y)));
  const oneYWorksForAll = globalWitnesses.length > 0;

  return (
    <InteractiveBlock title="Quantifier Order">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <p className="mb-3 text-sm">
            <InlineMath math="X=\{1,2,3\}" />, <InlineMath math="Y=\{2,3,4\}" />
          </p>
          <p className="mb-3 text-sm font-bold uppercase tracking-wider">Predicate</p>
          <div className="grid gap-2">
            {Object.entries(predicates).map(([key, option]) => (
              <button
                key={key}
                onClick={() => setPredicateKey(key as keyof typeof predicates)}
                className={`rounded-md border p-3 text-left text-sm font-bold [&_span]:!text-inherit [&_.katex]:!text-inherit ${
                  predicateKey === key
                    ? isDarkMode
                      ? 'border-green-400 bg-green-400 text-black'
                      : 'border-blue-500 bg-blue-500 text-white'
                    : isDarkMode
                      ? 'border-green-500/30 bg-black/30 text-green-200'
                      : 'border-slate-300 bg-white text-slate-600'
                }`}
              >
                <InlineMath math={option.label} />
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-center text-sm">
            <thead className={isDarkMode ? 'text-green-300' : 'text-slate-800'}>
              <tr>
                <th className="p-3 text-left"><InlineMath math="x\backslash y" /></th>
                {ys.map((y) => <th key={y} className="p-3"><InlineMath math={`y=${y}`} /></th>)}
                <th className="p-3"><InlineMath math="\exists y" /></th>
              </tr>
            </thead>
            <tbody>
              {xs.map((x) => {
                const rowHasWitness = ys.some((y) => predicate.test(x, y));
                return (
                  <tr key={x}>
                    <td className="p-3 text-left font-bold"><InlineMath math={`x=${x}`} /></td>
                    {ys.map((y) => (
                      <td key={y} className={`p-3 ${predicate.test(x, y) ? (isDarkMode ? 'bg-green-500/15' : 'bg-blue-50') : ''}`}>
                        {boolLabel(predicate.test(x, y))}
                      </td>
                    ))}
                    <td className="p-3 font-bold">{boolLabel(rowHasWitness)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className={`rounded-lg border p-3 ${subtlePanelClass}`}>
              <InlineMath math="\forall x\exists y\,R(x,y)" />: <strong>{boolLabel(allHaveWitness)}</strong>
            </div>
            <div className={`rounded-lg border p-3 ${subtlePanelClass}`}>
              <InlineMath math="\exists y\forall x\,R(x,y)" />: <strong>{boolLabel(oneYWorksForAll)}</strong>
              <span className="mt-2 block text-xs">
                {oneYWorksForAll ? <>fixed <InlineMath math="y" />: {globalWitnesses.join(', ')}</> : <>no single <InlineMath math="y" /> works</>}
              </span>
            </div>
          </div>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function ModularClockExplorer() {
  const { isDarkMode, subtlePanelClass } = useDiscreteTheme();
  const [value, setValue] = useState(-7);
  const modulus = 5;
  const residue = mod(value, modulus);
  const quotient = Math.floor((value - residue) / modulus);
  const points = Array.from({ length: modulus }, (_, index) => {
    const angle = -Math.PI / 2 + (2 * Math.PI * index) / modulus;
    return {
      value: index,
      x: 100 + 72 * Math.cos(angle),
      y: 100 + 72 * Math.sin(angle),
    };
  });

  return (
    <InteractiveBlock title="Modulo Clock">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 block text-sm font-bold" htmlFor="mod-value">Integer</label>
          <input
            id="mod-value"
            type="range"
            min="-20"
            max="20"
            value={value}
            onChange={(event) => setValue(Number(event.target.value))}
            className="w-full"
          />
          <p className="mt-3 text-sm">n = <strong>{value}</strong></p>
          <p className="text-sm">n mod 5 = <strong>{residue}</strong></p>
          <MathBlock math={`${value} = 5(${quotient}) + ${residue}`} />
          <p className="mt-3 text-sm">
            The highlighted residue is the nonnegative remainder <InlineMath math="r" /> in <InlineMath math="n=5q+r" /> with{' '}
            <InlineMath math="0\le r<5" />.
          </p>
        </div>

        <div className="flex items-center justify-center">
          <svg viewBox="0 0 200 200" className="h-64 w-64">
            <circle cx="100" cy="100" r="82" fill="none" stroke={isDarkMode ? '#22c55e55' : '#94a3b8'} strokeWidth="3" />
            {points.map((point) => (
              <g key={point.value}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={point.value === residue ? 18 : 13}
                  fill={point.value === residue ? (isDarkMode ? '#4ade80' : '#2563eb') : (isDarkMode ? '#052e16' : '#e2e8f0')}
                  stroke={isDarkMode ? '#86efac' : '#475569'}
                  strokeWidth="2"
                />
                <text
                  x={point.x}
                  y={point.y + 5}
                  textAnchor="middle"
                  fontSize="14"
                  fontFamily="monospace"
                  fill={point.value === residue ? (isDarkMode ? '#000000' : '#ffffff') : (isDarkMode ? '#bbf7d0' : '#334155')}
                >
                  {point.value}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function SequencePlot() {
  const sequence = [1, 2, 4, 8, 16].map((value, index) => ({ n: index, value }));

  return (
    <>
      <NoteTable
        headers={sequence.map((point) => <InlineMath key={point.n} math={`n=${point.n}`} />)}
        rows={[
          sequence.map((point) => <InlineMath key={point.n} math={`a_n=${point.value}`} />),
        ]}
      />
      <NoteParagraph>
        The gaps matter: a sequence only has values at its allowed indices. Drawing a continuous curve can accidentally suggest inputs that are not part of the sequence.
      </NoteParagraph>
    </>
  );
}

function NormalFormExplorer() {
  const { isDarkMode, subtlePanelClass } = useDiscreteTheme();
  const [formula, setFormula] = useState<'xor' | 'implies' | 'and'>('xor');
  const formulaLabels = {
    xor: String.raw`p\oplus q`,
    implies: String.raw`p\to q`,
    and: String.raw`p\land q`,
  };

  const rows = useMemo(() => {
    return [
      { p: false, q: false },
      { p: false, q: true },
      { p: true, q: false },
      { p: true, q: true },
    ].map((row) => {
      const value = formula === 'xor'
        ? row.p !== row.q
        : formula === 'implies'
          ? !row.p || row.q
          : row.p && row.q;
      return { ...row, value };
    });
  }, [formula]);

  const literal = (name: 'p' | 'q', positive: boolean) => positive ? name : `\\neg ${name}`;
  const minterm = (p: boolean, q: boolean) => `${literal('p', p)}\\land ${literal('q', q)}`;
  const maxterm = (p: boolean, q: boolean) => `(${literal('p', !p)}\\lor ${literal('q', !q)})`;
  const dnf = rows.filter((row) => row.value).map((row) => `(${minterm(row.p, row.q)})`).join('\\lor ') || '0';
  const cnf = rows.filter((row) => !row.value).map((row) => maxterm(row.p, row.q)).join('\\land ') || '1';

  return (
    <InteractiveBlock title="DNF and CNF Builder">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <p className="mb-2 text-sm font-bold uppercase tracking-wider">Function</p>
          <div className="grid gap-2">
            {(Object.keys(formulaLabels) as Array<keyof typeof formulaLabels>).map((key) => (
              <button
                key={key}
                onClick={() => setFormula(key)}
                className={`rounded-md border p-3 text-left text-sm font-bold [&_span]:!text-inherit [&_.katex]:!text-inherit ${
                  formula === key
                    ? isDarkMode
                      ? 'border-green-400 bg-green-400 text-black'
                      : 'border-blue-500 bg-blue-500 text-white'
                    : isDarkMode
                      ? 'border-green-500/30 bg-black/30 text-green-200'
                      : 'border-slate-300 bg-white text-slate-600'
                }`}
              >
                <InlineMath math={formulaLabels[key]} />
              </button>
            ))}
          </div>
          <div className="mt-4 space-y-2 text-sm [&_span]:!text-inherit [&_.katex]:!text-inherit">
            <p><strong>DNF:</strong> <InlineMath math={dnf} /></p>
            <p><strong>CNF:</strong> <InlineMath math={cnf} /></p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-center text-sm">
            <thead className={isDarkMode ? 'text-green-300' : 'text-slate-800'}>
              <tr>
                <th className="px-3 py-2">p</th>
                <th className="px-3 py-2">q</th>
                <th className="px-3 py-2">f</th>
                <th className="px-3 py-2">DNF row</th>
                <th className="px-3 py-2">CNF row</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={`${row.p}-${row.q}`} className={row.value ? (isDarkMode ? 'bg-green-500/15' : 'bg-blue-50') : ''}>
                  <td className="px-3 py-2">{boolLabel(row.p)}</td>
                  <td className="px-3 py-2">{boolLabel(row.q)}</td>
                  <td className="px-3 py-2">{boolLabel(row.value)}</td>
                  <td className="px-3 py-2 [&_span]:!text-inherit [&_.katex]:!text-inherit">
                    {row.value ? <InlineMath math={minterm(row.p, row.q)} /> : '-'}
                  </td>
                  <td className="px-3 py-2 [&_span]:!text-inherit [&_.katex]:!text-inherit">
                    {!row.value ? <InlineMath math={maxterm(row.p, row.q)} /> : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className={`mt-4 text-sm [&_span]:!text-inherit [&_.katex]:!text-inherit ${isDarkMode ? 'text-green-100/80' : 'text-slate-600'}`}>
            The builder uses <InlineMath math="\neg,\land,\lor" /> notation. In Boolean algebra notation, these same rows become complements,
            products, and sums.
          </p>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function PigeonholeExplorer() {
  const { isDarkMode, subtlePanelClass } = useDiscreteTheme();
  const [objects, setObjects] = useState(11);
  const [boxes, setBoxes] = useState(4);
  const distribution = Array.from({ length: boxes }, (_, box) =>
    Math.floor(objects / boxes) + (box < objects % boxes ? 1 : 0)
  );
  const guaranteed = Math.ceil(objects / boxes);

  return (
    <InteractiveBlock title="Pigeonhole Principle">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 block text-sm font-bold" htmlFor="objects">Objects: {objects}</label>
          <input id="objects" type="range" min="1" max="24" value={objects} onChange={(event) => setObjects(Number(event.target.value))} className="w-full" />
          <label className="mt-4 mb-2 block text-sm font-bold" htmlFor="boxes">Boxes: {boxes}</label>
          <input id="boxes" type="range" min="1" max="8" value={boxes} onChange={(event) => setBoxes(Number(event.target.value))} className="w-full" />
          <p className="mt-4 text-sm">
            Some box has at least <strong>{guaranteed}</strong> object{guaranteed === 1 ? '' : 's'}.
          </p>
          <p className="mt-3 text-sm">
            The boxes show the most even possible spread. If even this spread needs a crowded box, every other spread does too.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {distribution.map((count, index) => (
            <div key={index} className={`rounded-lg border p-3 text-center ${subtlePanelClass}`}>
              <p className="mb-2 text-xs uppercase tracking-wider">Box {index + 1}</p>
              <div className="flex min-h-24 flex-wrap content-start justify-center gap-1">
                {Array.from({ length: count }, (_, dot) => (
                  <span
                    key={dot}
                    className={`h-4 w-4 rounded-full ${isDarkMode ? 'bg-green-400' : 'bg-blue-500'}`}
                  />
                ))}
              </div>
              <p className="mt-2 text-sm font-bold">{count}</p>
            </div>
          ))}
        </div>
      </div>
    </InteractiveBlock>
  );
}

function EuclideanAlgorithmRunner() {
  const { isDarkMode, subtlePanelClass } = useDiscreteTheme();
  const [a, setA] = useState(4181);
  const [b, setB] = useState(2584);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  const steps = useMemo(() => {
    const result: {
      a: number;
      b: number;
      q: number | null;
      r: number | null;
      description: string;
    }[] = [];
    let currentA = Math.abs(a);
    let currentB = Math.abs(b);

    result.push({
      a: currentA,
      b: currentB,
      q: null,
      r: null,
      description: 'Start with the two nonnegative inputs.',
    });

    while (currentB !== 0) {
      const q = Math.floor(currentA / currentB);
      const r = currentA % currentB;
      result.push({
        a: currentB,
        b: r,
        q,
        r,
        description: `${currentA} = ${currentB} * ${q} + ${r}; replace (a,b) with (${currentB},${r}).`,
      });
      currentA = currentB;
      currentB = r;
    }

    return result;
  }, [a, b]);

  const boundedStep = Math.min(stepIndex, steps.length - 1);
  const current = steps[boundedStep];
  const gcd = steps[steps.length - 1].a;
  const atEnd = boundedStep === steps.length - 1;
  const maxValue = Math.max(a, b, 1);
  const buttonClass = isDarkMode
    ? 'rounded-md border border-green-500/30 bg-black/30 px-3 py-2 text-sm font-bold text-green-200 transition-colors hover:bg-green-500/10 disabled:cursor-not-allowed disabled:opacity-40'
    : 'rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40';

  useAutoRunner({
    playing,
    canAdvance: !atEnd,
    delay: 700,
    onAdvance: () => setStepIndex((step) => Math.min(steps.length - 1, step + 1)),
    onStop: () => setPlaying(false),
  });

  return (
    <InteractiveBlock title="Euclidean Algorithm Runner">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(240px,290px)_minmax(0,1fr)]">
        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 flex justify-between gap-3 text-sm font-bold" htmlFor="euclid-a">
            <span>a</span>
            <span>{a}</span>
          </label>
          <input
            id="euclid-a"
            type="range"
            min="1"
            max="5000"
            value={a}
            onChange={(event) => {
              setPlaying(false);
              setA(Number(event.target.value));
              setStepIndex(0);
            }}
            className="mb-4 w-full"
          />
          <label className="mb-2 flex justify-between gap-3 text-sm font-bold" htmlFor="euclid-b">
            <span>b</span>
            <span>{b}</span>
          </label>
          <input
            id="euclid-b"
            type="range"
            min="1"
            max="5000"
            value={b}
            onChange={(event) => {
              setPlaying(false);
              setB(Number(event.target.value));
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
              onClick={() => { setPlaying(false); setStepIndex((step) => Math.min(steps.length - 1, step + 1)); }}
              disabled={atEnd}
            >
              Step
            </button>
          </div>
        </div>

        <div className={`min-w-0 rounded-lg border p-4 ${subtlePanelClass}`}>
          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            {[
              ['a', current.a],
              ['b', current.b],
            ].map(([label, value]) => (
              <div key={label as string}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{label}</span>
                  <span>{value}</span>
                </div>
                <div className={isDarkMode ? 'h-4 rounded bg-black/40' : 'h-4 rounded bg-slate-200'}>
                  <div
                    className={label === 'a' ? (isDarkMode ? 'h-4 rounded bg-green-400' : 'h-4 rounded bg-blue-500') : 'h-4 rounded bg-orange-500'}
                    style={{ width: `${Math.max(4, (Number(value) / maxValue) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mb-3 text-sm">
            Step <strong>{boundedStep}</strong> of <strong>{steps.length - 1}</strong>
          </p>
          <p className="mb-4 text-sm leading-relaxed">{current.description}</p>
          {current.q !== null && current.r !== null && (
            <MathBlock math={String.raw`q=${current.q},\quad r=${current.r}`} />
          )}
          <div className={`rounded-md border p-3 text-sm ${isDarkMode ? 'border-green-500/20 bg-black/20' : 'border-slate-200 bg-white/75'}`}>
            <InlineMath math={`\\gcd(${a},${b})=${gcd}`} />
          </div>
          <div className="mt-4 max-h-52 overflow-y-auto rounded-md border border-current/15">
            <table className="w-full border-collapse text-xs">
              <thead className={isDarkMode ? 'bg-green-500/10' : 'bg-slate-100'}>
                <tr>
                  {['k', 'a', 'b', 'q', 'r'].map((heading) => (
                    <th key={heading} className="px-2 py-2 text-left">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {steps.map((step, index) => (
                  <tr key={index} className={index === boundedStep ? (isDarkMode ? 'bg-green-400/20' : 'bg-blue-50') : ''}>
                    <td className="px-2 py-1">{index}</td>
                    <td className="px-2 py-1">{step.a}</td>
                    <td className="px-2 py-1">{step.b}</td>
                    <td className="px-2 py-1">{step.q ?? '-'}</td>
                    <td className="px-2 py-1">{step.r ?? '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <CodeBlock language="python" code={euclideanAlgorithmCode} />
    </InteractiveBlock>
  );
}

export default function DiscreteMathNote() {
  return (
    <NotesLayout>
      <NoteHeader
        title="Discrete Mathematics"
        subtitle="Formal reasoning, discrete structures, recursion, Boolean computation, and counting."
      />

      <NoteParagraph>
        Discrete mathematics is the language underneath much of computer science. Instead of modeling smooth change like calculus,
        it studies statements, proofs, integers, sets, functions, relations, recursive objects, bits, and finite counting.
      </NoteParagraph>
      <NotationGuide />

      {/* 1. LOGIC */}
      <NoteSectionTitle id="logic">1. Logic</NoteSectionTitle>
      <NoteSubSectionTitle id="propositions-and-operators">1.1 Propositions and Operators</NoteSubSectionTitle>
      <NoteParagraph>
        Logic starts by replacing messy natural language with statements whose truth can be tracked exactly. A <strong>proposition</strong> is a
        statement that is either true or false. Questions, commands, and open statements like "x is prime" are not propositions until the variable
        is assigned or quantified.
      </NoteParagraph>
      <NoteParagraph>
        In truth tables, <strong>T</strong> means true and <strong>F</strong> means false. Letters like <InlineMath math="p" /> and{' '}
        <InlineMath math="q" /> stand for propositions, not variables with numeric values.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Propositions and Compound Propositions">
          <BulletList>
            <li>Examples: "2 is even", "Boston is in Massachusetts", and "7 is prime".</li>
            <li>Non-examples: "What time is it?", "Do your homework", and <InlineMath math="x>3" /> before a domain and value are fixed.</li>
            <li>Compound propositions are built by joining simpler propositions with logical operators.</li>
            <li>The truth value of a compound proposition is determined by the truth values of its parts.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>
      <NoteTable
        headers={['Operator', 'Notation', 'Meaning', 'True when']}
        rows={[
          ['Negation', <InlineMath math="\neg p" />, 'NOT', <><InlineMath math="p" /> is false</>],
          ['Conjunction', <InlineMath math="p\land q" />, 'AND', 'both are true'],
          ['Disjunction', <InlineMath math="p\lor q" />, 'inclusive OR', 'at least one is true'],
          ['Conditional', <InlineMath math="p\to q" />, 'implication', <><InlineMath math="p" /> is false or <InlineMath math="q" /> is true</>],
          ['Biconditional', <InlineMath math="p\leftrightarrow q" />, 'iff', <><InlineMath math="p" /> and <InlineMath math="q" /> match</>],
          ['Exclusive or', <InlineMath math="p\oplus q" />, 'exclusive OR', 'exactly one is true'],
        ]}
      />
      <TruthTableExplorer />

      <NoteSubSectionTitle id="conditionals">1.2 Conditionals</NoteSubSectionTitle>
      <NoteParagraph>
        The conditional <InlineMath math="p\to q" /> is false only in the case where the promise is broken: <InlineMath math="p" /> is true but{' '}
        <InlineMath math="q" /> is false. When <InlineMath math="p" /> is false, the implication is true by <strong>vacuous truth</strong> because
        the hypothesis never occurs.
      </NoteParagraph>
      <NoteTable
        headers={['Related statement', 'Form', 'Relationship']}
        rows={[
          ['Original', <InlineMath math="p\to q" />, 'the statement being studied'],
          ['Converse', <InlineMath math="q\to p" />, 'not equivalent in general'],
          ['Inverse', <InlineMath math="\neg p\to \neg q" />, 'not equivalent in general'],
          ['Contrapositive', <InlineMath math="\neg q\to \neg p" />, 'logically equivalent to the original'],
        ]}
      />
      <NoteParagraph>
        In English, <InlineMath math="p\to q" /> can be read as "if p then q", "p is sufficient for q", "q is necessary for p", or "p only if q".
        The phrase "only if" points to the necessary condition.
      </NoteParagraph>

      <NoteSubSectionTitle id="biconditionals-xor-and-precedence">1.3 Biconditionals, XOR, and Precedence</NoteSubSectionTitle>
      <NoteParagraph>
        A biconditional means both directions hold:
      </NoteParagraph>
      <MathBlock math="p\leftrightarrow q \equiv (p\to q)\land(q\to p)" />
      <NoteParagraph>
        For two variables, XOR is true when exactly one input is true. For a longer XOR chain, it behaves like a parity check: the result is true
        when an odd number of propositions are true. The biconditional is the complement of XOR for two inputs, so <InlineMath math="p\leftrightarrow q" />
        is true when the two truth values match. For longer biconditional chains, use parentheses or state the parity convention explicitly.
      </NoteParagraph>
      <NoteParagraph>
        Operator precedence: <InlineMath math="\neg" /> first, then <InlineMath math="\land" />, then <InlineMath math="\lor" />, then{' '}
        <InlineMath math="\to" />, then <InlineMath math="\leftrightarrow" />. Parentheses override the order.
      </NoteParagraph>

      {/* 2. LOGICAL EQUIVALENCE */}
      <NoteSectionTitle id="logical-equivalence">2. Logical Equivalence</NoteSectionTitle>
      <NoteSubSectionTitle id="equivalence-methods">2.1 Equivalence Methods</NoteSubSectionTitle>
      <NoteParagraph>
        Two compound propositions are <strong>logically equivalent</strong> when they have the same truth value in every possible assignment.
        Equivalence lets us rewrite a proposition into a clearer or simpler form without changing its meaning.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Two Ways to Prove Equivalence">
          <BulletList>
            <li>Truth-table method: evaluate both expressions on every row and compare the final columns.</li>
            <li>Equivalence-law method: start with one side and apply known laws until it becomes the other side.</li>
            <li>In formal equivalence proofs, use one law per line and label the law used.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>
      <MathBlock math="p\to q \equiv \neg p\lor q" />
      <MathBlock math="\neg(p\land q)\equiv \neg p\lor \neg q \qquad \neg(p\lor q)\equiv \neg p\land \neg q" />
      <NoteTable
        headers={['Law family', 'Example']}
        rows={[
          ['Identity', <InlineMath math="p\land T\equiv p,\quad p\lor F\equiv p" />],
          ['Domination', <InlineMath math="p\lor T\equiv T,\quad p\land F\equiv F" />],
          ['Idempotent', <InlineMath math="p\lor p\equiv p,\quad p\land p\equiv p" />],
          ['Double negation', <InlineMath math="\neg(\neg p)\equiv p" />],
          ['Commutative', <InlineMath math="p\lor q\equiv q\lor p" />],
          ['Associative', <InlineMath math="(p\lor q)\lor r\equiv p\lor(q\lor r)" />],
          ['Distributive', <InlineMath math="p\land(q\lor r)\equiv(p\land q)\lor(p\land r)" />],
          ['Negation', <InlineMath math="p\lor\neg p\equiv T,\quad p\land\neg p\equiv F" />],
          ['Absorption', <InlineMath math="p\lor(p\land q)\equiv p,\quad p\land(p\lor q)\equiv p" />],
        ]}
      />
      <NoteSubSectionTitle id="equivalence-proof-format">2.2 Equivalence Proof Format</NoteSubSectionTitle>
      <NoteTable
        headers={['Step', 'Reason']}
        rows={[
          [<InlineMath math="p\to(q\lor r)" />, 'Start with one side'],
          [<InlineMath math="\neg p\lor(q\lor r)" />, <InlineMath math="p\to q\equiv\neg p\lor q" />],
          [<InlineMath math="(\neg p\lor q)\lor r" />, 'Associative law'],
          [<InlineMath math="(p\to q)\lor r" />, <InlineMath math="\neg p\lor q\equiv p\to q" />],
        ]}
      />

      {/* 3. PREDICATES AND QUANTIFIERS */}
      <NoteSectionTitle id="predicates-and-quantifiers">3. Predicates and Quantifiers</NoteSectionTitle>
      <NoteSubSectionTitle id="predicate-basics">3.1 Predicate Basics</NoteSubSectionTitle>
      <NoteParagraph>
        A predicate is a logical statement whose truth depends on variables. A proposition already has a truth value; a predicate becomes a
        proposition after assignment or quantification over a domain of discourse.
      </NoteParagraph>
      <NoteParagraph>
        The <strong>domain of discourse</strong> is the set that the variables are allowed to come from. A statement such as{' '}
        <InlineMath math="\forall x\,P(x)" /> is incomplete until we know what values <InlineMath math="x" /> ranges over.
      </NoteParagraph>
      <NoteTable
        headers={['Idea', 'Notation', 'How to think about it']}
        rows={[
          ['Predicate', <InlineMath math="P(x)" />, 'an open statement with a variable'],
          ['Universal quantifier', <InlineMath math="\forall x\,P(x)" />, 'P holds for every x in the domain'],
          ['Existential quantifier', <InlineMath math="\exists x\,P(x)" />, 'there is at least one witness x'],
          ['Uniqueness quantifier', <InlineMath math="\exists!x\,P(x)" />, 'there is exactly one witness'],
        ]}
      />
      <NoteParagraph>
        To disprove a universal statement, find one counterexample. To prove an existential statement constructively, give a witness. To disprove
        an existential statement, show that no possible witness can satisfy the predicate.
      </NoteParagraph>
      <NoteParagraph>
        Many universal statements have conditional structure: <InlineMath math="\forall x\,(P(x)\to Q(x))" />. This means every object that
        satisfies the hypothesis <InlineMath math="P(x)" /> must also satisfy the conclusion <InlineMath math="Q(x)" />; objects outside{' '}
        <InlineMath math="P" /> do not violate the statement.
      </NoteParagraph>
      <MathBlock math="\exists!x\,P(x)\quad\text{means}\quad \exists x\,P(x)\ \land\ \forall y\forall z((P(y)\land P(z))\to y=z)" />
      <MathBlock math="\neg\forall x\,P(x)\equiv \exists x\,\neg P(x)\qquad \neg\exists x\,P(x)\equiv \forall x\,\neg P(x)" />
      <NoteSubSectionTitle id="nested-quantifiers">3.2 Nested Quantifiers</NoteSubSectionTitle>
      <NoteParagraph>
        Quantifier order matters because later variables may depend on earlier variables. In <InlineMath math="\forall x\exists y" />, the witness{' '}
        <InlineMath math="y" /> can change with <InlineMath math="x" />. In <InlineMath math="\exists y\forall x" />, one fixed{' '}
        <InlineMath math="y" /> must work for every <InlineMath math="x" />.
      </NoteParagraph>
      <QuantifierDependencyExplorer />
      <NoteParagraph>
        A variable is <strong>bound</strong> when it is controlled by a quantifier. A variable is <strong>free</strong> when no quantifier has
        captured it, so the statement is still open.
      </NoteParagraph>

      {/* 4. PROOFS */}
      <NoteSectionTitle id="proofs">4. Proofs</NoteSectionTitle>
      <NoteSubSectionTitle id="proof-language-and-methods">4.1 Proof Language and Methods</NoteSubSectionTitle>
      <NoteParagraph>
        A proof is a valid argument that establishes a theorem. Good proof writing is not just about correctness; it is about making the chain of
        reasoning visible to another human.
      </NoteParagraph>
      <NoteTable
        headers={['Term', 'Meaning']}
        rows={[
          ['Theorem', 'an important statement to prove'],
          ['Proposition', 'a smaller proved statement'],
          ['Lemma', 'a helper result used to prove something larger'],
          ['Corollary', 'a result that follows quickly from a previous theorem'],
          ['Assumption', 'what you are allowed to start with'],
          ['Definition', 'the formal meaning of a term'],
          ['Conclusion', 'the statement reached at the end'],
          ['Counterexample', 'one example that disproves a universal claim'],
        ]}
      />
      <NoteTopicGroup>
        <NoteTopicBlock title="Proof Writing Style">
          <BulletList>
            <li>Start by stating the assumptions and what you want to prove.</li>
            <li>Unpack definitions explicitly before using them.</li>
            <li>Make the key step, then repack the definitions into the desired conclusion.</li>
            <li>Avoid jumps. Each line should have a reason.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>
      <NoteTable
        headers={['Method', 'Template']}
        rows={[
          ['Direct proof', <>Assume <InlineMath math="p" />, derive <InlineMath math="q" />, conclude <InlineMath math="p\to q" />.</>],
          ['Contrapositive', <>To prove <InlineMath math="p\to q" />, prove <InlineMath math="\neg q\to\neg p" />.</>],
          ['Contradiction', 'Assume the opposite of the target and derive an impossibility.'],
          ['Cases', 'Split into exhaustive cases and prove the claim in every case. Mutually exclusive cases are cleaner, but exhaustiveness is essential.'],
          ['Exhaustion', 'Use a finite search space and check every possibility.'],
          ['Constructive existence', 'Produce an object that satisfies the property.'],
          ['Nonconstructive existence', 'Prove something exists without identifying it.'],
          ['Uniqueness', 'Prove existence, then prove any two satisfying objects are equal.'],
          ['Biconditional', <>Prove both <InlineMath math="p\to q" /> and <InlineMath math="q\to p" />.</>],
        ]}
      />

      {/* 5. DIVISIBILITY AND MODULAR ARITHMETIC */}
      <NoteSectionTitle id="divisibility-and-modular-arithmetic">5. Divisibility and Modular Arithmetic</NoteSectionTitle>
      <NoteSubSectionTitle id="divisibility">5.1 Divisibility</NoteSubSectionTitle>
      <NoteParagraph>
        Divisibility turns arithmetic into propositions. The statement <InlineMath math="a\mid b" /> does not mean divide right now; it means
        there exists an integer multiplier that makes <InlineMath math="b" />.
      </NoteParagraph>
      <NoteParagraph>
        The symbol <InlineMath math="\mid" /> has two common roles in this note. In <InlineMath math="a\mid b" /> it means "divides"; inside a set
        such as <InlineMath math="\{x\mid x>0\}" /> it means "such that". Context decides which meaning is intended.
      </NoteParagraph>
      <MathBlock math="a\mid b \Longleftrightarrow \exists c\in\mathbb Z\text{ such that }b=ac" />
      <NoteTopicGroup>
        <NoteTopicBlock title="Divisibility Facts">
          <BulletList>
            <li><InlineMath math="a\nmid b" /> means <InlineMath math="a" /> does not divide <InlineMath math="b" />.</li>
            <li>Every integer divides <InlineMath math="0" /> because <InlineMath math="0=a\cdot 0" />.</li>
            <li><InlineMath math="0" /> divides no nonzero integer.</li>
            <li>If <InlineMath math="a\mid b" /> and <InlineMath math="a\mid c" />, then <InlineMath math="a\mid(b+c)" />.</li>
            <li>If <InlineMath math="a\mid b" />, then <InlineMath math="a\mid bc" />.</li>
            <li>If <InlineMath math="a\mid b" /> and <InlineMath math="b\mid c" />, then <InlineMath math="a\mid c" />.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>
      <NoteSubSectionTitle id="division-algorithm">5.2 Division Algorithm</NoteSubSectionTitle>
      <MathBlock math="a=dq+r,\qquad 0\le r<d" />
      <NoteParagraph>
        Here <InlineMath math="a" /> is the dividend, <InlineMath math="d" /> is the divisor, <InlineMath math="q" /> is the quotient, and{' '}
        <InlineMath math="r" /> is the remainder. In this form <InlineMath math="d" /> is positive. The remainder is what programming languages
        often expose with <InlineMath math="\bmod" />, but negative inputs require care because the mathematical remainder is kept nonnegative.
      </NoteParagraph>
      <ModularClockExplorer />

      <NoteSubSectionTitle id="congruence">5.3 Congruence</NoteSubSectionTitle>
      <NoteParagraph>
        Congruence modulo <InlineMath math="m" /> means two integers land in the same residue class.
      </NoteParagraph>
      <NoteParagraph>
        A <strong>residue class</strong> modulo <InlineMath math="m" /> is one of the buckets of integers with the same remainder after division by{' '}
        <InlineMath math="m" />. For example, modulo 5, the class <InlineMath math="[2]" /> contains <InlineMath math="\ldots,-8,-3,2,7,12,\ldots" />.
      </NoteParagraph>
      <MathBlock math="a\equiv b\pmod m \Longleftrightarrow m\mid(a-b)\Longleftrightarrow a=b+km\text{ for some }k\in\mathbb Z" />
      <MathBlock math="a\equiv b\pmod m \Longleftrightarrow a\bmod m=b\bmod m" />
      <NoteSubSectionTitle id="primes-and-euclids-algorithm">5.4 Primes and Euclid's Algorithm</NoteSubSectionTitle>
      <NoteParagraph>
        A prime is an integer greater than 1 whose only positive divisors are 1 and itself. A composite number has a nontrivial factorization.
        The greatest common divisor <InlineMath math="\gcd(a,b)" /> is the largest positive integer dividing both, and relatively prime numbers
        have gcd 1.
      </NoteParagraph>
      <CodeBlock
        language="python"
        code={`
def gcd(a, b):
    while b != 0:
        a, b = b, a % b
    return abs(a)
        `}
      />
      <NoteParagraph>
        The usual precondition is that <InlineMath math="a" /> and <InlineMath math="b" /> are not both zero. The final absolute value makes the
        returned gcd nonnegative even when one input is negative.
      </NoteParagraph>
      <EuclideanAlgorithmRunner />

      {/* 6. SETS */}
      <NoteSectionTitle id="sets">6. Sets</NoteSectionTitle>
      <NoteSubSectionTitle id="set-basics">6.1 Set Basics</NoteSubSectionTitle>
      <NoteParagraph>
        A set is a collection of elements. For a set <InlineMath math="S" /> and object <InlineMath math="x" />, exactly one of{' '}
        <InlineMath math="x\in S" /> or <InlineMath math="x\notin S" /> is true. Order and multiplicity do not matter.
      </NoteParagraph>
      <NoteParagraph>
        Roster notation lists elements, as in <InlineMath math="\{1,2,3\}" />. Set-builder notation describes a rule, as in{' '}
        <InlineMath math="\{x\in\mathbb Z\mid x\text{ is even}\}" />, read as "the set of integers x such that x is even".
      </NoteParagraph>
      <NoteTable
        headers={['Concept', 'Notation or example']}
        rows={[
          ['Roster notation', <InlineMath math="\{1,2,3\}" />],
          ['Set-builder notation', <InlineMath math="\{x\in\mathbb Z:x\text{ is even}\}" />],
          ['Empty set', <InlineMath math="\emptyset" />],
          ['Cardinality', <InlineMath math="|S|" />],
          ['Subset', <InlineMath math="A\subseteq B" />],
          ['Proper subset', <InlineMath math="A\subset B" />],
          ['Power set', <InlineMath math="\mathcal P(S)" />],
          ['Cartesian product', <InlineMath math="A\times B" />],
        ]}
      />
      <NoteParagraph>
        Common number sets include natural numbers, positive natural numbers, integers, rational numbers, and real numbers. The universal set is
        the background set from which complements are taken.
      </NoteParagraph>
      <SetOperationSummary />
      <NoteSubSectionTitle id="set-identities">6.2 Set Identities</NoteSubSectionTitle>
      <NoteParagraph>
        Set identities mirror logical equivalences because membership is a proposition. To prove set equality, either use known identities or use
        element chasing: show an arbitrary element of the left side is in the right side, then show the reverse inclusion.
      </NoteParagraph>
      <NoteTable
        headers={['Law family', 'Set version']}
        rows={[
          ['Identity', <InlineMath math="A\cup\emptyset=A,\quad A\cap U=A" />],
          ['Domination', <InlineMath math="A\cup U=U,\quad A\cap\emptyset=\emptyset" />],
          ['Idempotent', <InlineMath math="A\cup A=A,\quad A\cap A=A" />],
          ['Complement', <InlineMath math="A\cup A^c=U,\quad A\cap A^c=\emptyset" />],
          ['Commutative', <InlineMath math="A\cup B=B\cup A,\quad A\cap B=B\cap A" />],
          ['Associative', <InlineMath math="(A\cup B)\cup C=A\cup(B\cup C)" />],
          ['Distributive', <InlineMath math="A\cap(B\cup C)=(A\cap B)\cup(A\cap C)" />],
        ]}
      />
      <MathBlock math="(A\cup B)^c=A^c\cap B^c\qquad (A\cap B)^c=A^c\cup B^c" />

      {/* 7. FUNCTIONS */}
      <NoteSectionTitle id="functions">7. Functions</NoteSectionTitle>
      <NoteSubSectionTitle id="function-definition">7.1 Function Definition</NoteSubSectionTitle>
      <NoteParagraph>
        A function <InlineMath math="f:A\to B" /> assigns exactly one element of <InlineMath math="B" /> to each element of <InlineMath math="A" />.
        The key idea is mapping, not graph paper.
      </NoteParagraph>
      <FunctionMappingDiagram />
      <NoteParagraph>
        Every input in the domain has exactly one outgoing arrow. The codomain may contain outputs that are not hit unless the function is onto.
      </NoteParagraph>
      <NoteSubSectionTitle id="function-properties">7.2 Function Properties</NoteSubSectionTitle>
      <NoteTable
        headers={['Concept', 'Meaning']}
        rows={[
          ['Domain', 'allowed inputs'],
          ['Codomain', 'declared target set'],
          ['Range', 'outputs actually hit'],
          ['Function equality', 'same domain, same codomain, same output for every input'],
          ['Injective', 'different inputs always give different outputs'],
          ['Surjective', 'every codomain element is hit'],
          ['Bijective', 'both injective and surjective'],
          ['Inverse function', 'exists as a function when the original function is bijective onto its codomain'],
          ['Composition', <InlineMath math="(f\circ g)(x)=f(g(x))" />],
          ['Identity function', <InlineMath math="\operatorname{id}_A(x)=x" />],
        ]}
      />
      <NoteParagraph>
        Logical definition of function: for every input, there exists exactly one output. In symbols:{' '}
        <InlineMath math="\forall a\in A\,\exists! b\in B\, f(a)=b" />.
      </NoteParagraph>
      <NoteParagraph>
        The pigeonhole connection is immediate: if <InlineMath math="f:X\to Y" /> and <InlineMath math="|X|>|Y|" />, then <InlineMath math="f" /> cannot be injective.
      </NoteParagraph>

      {/* 8. RELATIONS */}
      <NoteSectionTitle id="relations">8. Relations</NoteSectionTitle>
      <NoteSubSectionTitle id="relation-basics">8.1 Relation Basics</NoteSubSectionTitle>
      <NoteParagraph>
        A binary relation from <InlineMath math="A" /> to <InlineMath math="B" /> is a subset of <InlineMath math="A\times B" />. If{' '}
        <InlineMath math="(a,b)\in R" />, we often write <InlineMath math="aRb" />. A relation on <InlineMath math="A" /> is a subset of{' '}
        <InlineMath math="A\times A" />.
      </NoteParagraph>
      <NoteParagraph>
        Relations can be represented as a set of ordered pairs, a directed graph whose arrows show related pairs, or a 0-1 matrix whose entries
        mark whether each pair is in the relation.
      </NoteParagraph>
      <RelationRepresentationPanel />
      <NoteTable
        headers={['Property', 'Meaning']}
        rows={[
          ['Reflexive', <InlineMath math="\forall a\in A,\;aRa" />],
          ['Irreflexive', <InlineMath math="\forall a\in A,\;\neg(aRa)" />],
          ['Symmetric', <InlineMath math="aRb\Rightarrow bRa" />],
          ['Antisymmetric', <InlineMath math="aRb\land bRa\Rightarrow a=b" />],
          ['Asymmetric', <InlineMath math="aRb\Rightarrow \neg(bRa)" />],
          ['Transitive', <InlineMath math="aRb\land bRc\Rightarrow aRc" />],
        ]}
      />
      <NoteSubSectionTitle id="equivalence-relations-and-classes">8.2 Equivalence Relations and Classes</NoteSubSectionTitle>
      <NoteParagraph>
        An equivalence relation is reflexive, symmetric, and transitive. It groups elements that should be considered the same for the purpose at
        hand. Equality and congruence modulo <InlineMath math="m" /> are the main examples.
      </NoteParagraph>
      <MathBlock math="[a]_R=\{b\mid (a,b)\in R\}" />
      <NoteParagraph>
        Equivalence classes form partitions: nonempty blocks that cover the whole set and do not overlap. Conversely, any partition defines an
        equivalence relation by saying two elements are related exactly when they belong to the same block.
      </NoteParagraph>
      <NoteParagraph>
        Under congruence modulo 5, there are five classes: <InlineMath math="[0],[1],[2],[3],[4]" />. Every integer belongs to exactly one of
        these residue classes.
      </NoteParagraph>

      {/* 9. SEQUENCES AND SUMMATIONS */}
      <NoteSectionTitle id="sequences-and-summations">9. Sequences and Summations</NoteSectionTitle>
      <NoteSubSectionTitle id="sequence-basics">9.1 Sequence Basics</NoteSubSectionTitle>
      <NoteParagraph>
        A sequence is a function whose domain is a set of consecutive integers. The input is an index, and the output is the term at that index.
      </NoteParagraph>
      <NoteParagraph>
        The panel below lists the sequence <InlineMath math="a_n=2^n" /> as separate terms. A sequence is not a continuous curve; only integer
        input values are part of the function.
      </NoteParagraph>
      <SequencePlot />
      <NoteTable
        headers={['Concept', 'Meaning']}
        rows={[
          ['Term', <InlineMath math="a_i" />],
          ['Increasing', <InlineMath math="a_{n+1}\ge a_n" />],
          ['Strictly increasing', <InlineMath math="a_{n+1}>a_n" />],
          ['Decreasing', <InlineMath math="a_{n+1}\le a_n" />],
          ['Strictly decreasing', <InlineMath math="a_{n+1}<a_n" />],
          ['Monotonic', 'consistently nondecreasing or nonincreasing'],
          ['Non-monotonic', 'does not move in one consistent direction'],
        ]}
      />
      <NoteSubSectionTitle id="recurrence-relations-and-summations">9.2 Recurrences and Summations</NoteSubSectionTitle>
      <NoteParagraph>
        A recurrence defines terms using earlier terms. It needs base cases plus a recursive rule. A closed form gives the term directly from the
        index.
      </NoteParagraph>
      <MathBlock math="a_0=1,\qquad a_n=2a_{n-1}\quad\text{versus}\quad a_n=2^n" />
      <NoteParagraph>
        Sigma notation compresses repeated addition. The index variable is local to the sum. For double summations, evaluate the inner summation
        first unless the expression is re-indexed.
      </NoteParagraph>
      <MathBlock math="\sum_{i=1}^{n} i=\frac{n(n+1)}{2}\qquad \sum_{i=1}^{m}\sum_{j=1}^{n} a_{ij}" />
      <NoteParagraph>
        A series is a cumulative sum. Infinite series are studied by partial sums; if the partial sums settle toward a finite value, the series
        converges, and otherwise it diverges.
      </NoteParagraph>

      {/* 10. INDUCTION */}
      <NoteSectionTitle id="induction">10. Induction</NoteSectionTitle>
      <NoteSubSectionTitle id="weak-induction">10.1 Weak Induction</NoteSubSectionTitle>
      <NoteParagraph>
        Mathematical induction proves an infinite family of statements by proving a first case and a rule for climbing from one case to the next.
        The proof must explicitly state where the inductive hypothesis is used.
      </NoteParagraph>
      <InductionTemplate />
      <NoteTable
        headers={['Part', 'Weak induction']}
        rows={[
          ['Statement', 'Define a claim S(n) parameterized by n.'],
          ['Base case', 'Prove S(m).'],
          ['Inductive hypothesis', 'Assume S(k) for an arbitrary k >= m.'],
          ['Inductive step', 'Use S(k) to prove S(k+1).'],
          ['Conclusion', 'Therefore S(n) holds for all n >= m.'],
        ]}
      />
      <NoteSubSectionTitle id="strong-induction-and-well-ordering">10.2 Strong Induction and Well-Ordering</NoteSubSectionTitle>
      <NoteParagraph>
        Strong induction assumes all earlier cases from the base through <InlineMath math="k" /> in order to prove the next case. It is useful
        when the next object depends on more than the immediately previous one.
      </NoteParagraph>
      <NoteParagraph>
        The well-ordering principle says every nonempty subset of the natural numbers has a least element. It is closely tied to induction and is
        often used in contradiction-style proofs by choosing the smallest counterexample.
      </NoteParagraph>

      {/* 11. RECURSION AND STRUCTURAL INDUCTION */}
      <NoteSectionTitle id="recursion-and-structural-induction">11. Recursion and Structural Induction</NoteSectionTitle>
      <NoteSubSectionTitle id="recursive-definitions">11.1 Recursive Definitions</NoteSubSectionTitle>
      <NoteParagraph>
        Recursion defines an object in terms of itself. A recursive definition needs a basis step that starts the construction and recursive steps
        that generate more objects.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Recursive Definitions">
          <BulletList>
            <li>Sequences: define initial terms and a rule for later terms.</li>
            <li>Functions: define values through smaller inputs.</li>
            <li>Sets: specify basis elements and rules that create new members.</li>
            <li>Algorithms: solve a problem by calling the same algorithm on smaller inputs.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>
      <RecursiveDefinitionFlow />
      <NoteSubSectionTitle id="strings-languages-and-structural-induction">11.2 Strings, Languages, and Structural Induction</NoteSubSectionTitle>
      <NoteParagraph>
        For strings, an alphabet <InlineMath math="\Sigma" /> supplies symbols. A language <InlineMath math="\mathcal L" /> is a set of strings,
        and the empty string is often denoted <InlineMath math="\lambda" />. Recursive construction rules can define exactly which strings belong.
      </NoteParagraph>
      <NoteParagraph>
        Structural induction is induction for recursively defined structures. Prove the property for basis elements, then prove every recursive
        construction preserves the property. Ordinary induction usually follows a numeric index; structural induction follows the way the object was built.
      </NoteParagraph>
      <NoteParagraph>
        Structural induction template: prove the property for every basis object, assume it holds for objects used in a construction rule, then
        prove it holds for the object produced by that rule.
      </NoteParagraph>

      {/* 12. PROGRAM VERIFICATION */}
      <NoteSectionTitle id="program-verification-and-loop-invariants">12. Program Verification and Loop Invariants</NoteSectionTitle>
      <NoteSubSectionTitle id="program-correctness">12.1 Program Correctness</NoteSubSectionTitle>
      <NoteParagraph>
        Program correctness connects proofs to code. A correct program starts with valid inputs, terminates, and ends with the post-condition true.
        Partial correctness proves the post-condition if the program terminates. Total correctness adds termination.
      </NoteParagraph>
      <NoteTable
        headers={['Idea', 'Meaning']}
        rows={[
          ['Pre-condition', 'what must be true before execution'],
          ['Post-condition', 'what must be true after execution'],
          ['Termination', 'the program finishes in finite time'],
          ['Loop invariant', 'a statement true before the loop and preserved by every iteration'],
        ]}
      />
      <NoteSubSectionTitle id="loop-correctness-template">12.2 Loop Correctness Template</NoteSubSectionTitle>
      <BulletList>
        <li>Initialization: the pre-condition implies the invariant before the loop starts.</li>
        <li>Maintenance: if the invariant and loop condition are true before an iteration, the invariant remains true afterward.</li>
        <li>Termination: show the loop eventually stops.</li>
        <li>Conclusion: invariant plus false loop condition implies the post-condition.</li>
      </BulletList>
      <CodeBlock
        language="python"
        code={`
# Pre-condition: n >= 0
total = 0
i = 0

# Invariant: total = 0 + 1 + ... + (i - 1)
while i <= n:
    total = total + i
    i = i + 1

# Post-condition: total = 0 + 1 + ... + n
        `}
      />

      {/* 13. BOOLEAN ALGEBRA */}
      <NoteSectionTitle id="boolean-algebra">13. Boolean Algebra</NoteSectionTitle>
      <NoteSubSectionTitle id="boolean-values-and-operations">13.1 Boolean Values and Operations</NoteSubSectionTitle>
      <NoteParagraph>
        Boolean algebra translates propositional logic into binary computation. False and true become 0 and 1, and circuits compute Boolean
        functions from Boolean expressions.
      </NoteParagraph>
      <NoteParagraph>
        In this section, <InlineMath math="+" /> means Boolean OR, product or <InlineMath math="\cdot" /> means Boolean AND, and an apostrophe
        such as <InlineMath math="x'" /> means Boolean complement, not a derivative.
      </NoteParagraph>
      <NoteTable
        headers={['Logic', 'Boolean algebra', 'Circuit idea']}
        rows={[
          [<InlineMath math="p\land q" />, 'product pq', 'AND gate'],
          [<InlineMath math="p\lor q" />, 'sum p + q', 'OR gate'],
          [<InlineMath math="\neg p" />, "complement p'", 'NOT gate'],
        ]}
      />
      <NoteParagraph>
        A Boolean function is the mapping from input bits to output bits. A Boolean expression is one formula that computes that function. Different
        expressions can represent the same function.
      </NoteParagraph>
      <NoteTable
        headers={['Law family', 'Boolean example']}
        rows={[
          ['Identity', <InlineMath math="x+0=x,\quad x\cdot 1=x" />],
          ['Domination', <InlineMath math="x+1=1,\quad x\cdot 0=0" />],
          ['Idempotent', <InlineMath math="x+x=x,\quad x\cdot x=x" />],
          ['Complement', <InlineMath math="x+x'=1,\quad x\cdot x'=0" />],
          ['Double complement', <InlineMath math="(x')'=x" />],
          ['Commutative', <InlineMath math="x+y=y+x,\quad xy=yx" />],
          ['Associative', <InlineMath math="(x+y)+z=x+(y+z)" />],
          ['Distributive', <InlineMath math="x(y+z)=xy+xz,\quad x+yz=(x+y)(x+z)" />],
          ['Absorption', <InlineMath math="x+x y=x,\quad x(x+y)=x" />],
          ['Duality', 'swap sums/products and swap 0/1 to get a dual valid identity'],
        ]}
      />

      {/* 14. NORMAL FORMS */}
      <NoteSectionTitle id="normal-forms">14. Normal Forms</NoteSectionTitle>
      <NoteSubSectionTitle id="literals-terms-and-clauses">14.1 Literals, Terms, and Clauses</NoteSubSectionTitle>
      <NoteParagraph>
        Normal forms give standard recipes for writing Boolean functions. A literal is a variable or its complement. A term is a product of
        literals. A clause is a sum of literals.
      </NoteParagraph>
      <NoteParagraph>
        DNF means <strong>disjunctive normal form</strong>: an OR of terms. CNF means <strong>conjunctive normal form</strong>: an AND of clauses.
      </NoteParagraph>
      <NoteTable
        headers={['Object', 'Meaning']}
        rows={[
          ['Literal', <InlineMath math="x\text{ or }x'" />],
          ['Term', 'product of literals'],
          ['Clause', 'sum of literals'],
          ['Minterm', 'a product true for exactly one assignment'],
          ['Maxterm', 'a clause false for exactly one assignment'],
        ]}
      />
      <NormalFormExplorer />
      <NoteSubSectionTitle id="dnf-and-cnf-algorithms">14.2 DNF and CNF Algorithms</NoteSubSectionTitle>
      <NoteTopicGroup>
        <NoteTopicBlock title="DNF">
          <BulletList>
            <li>Make the truth table.</li>
            <li>Find rows where the function is 1.</li>
            <li>Convert each true row to a minterm.</li>
            <li>OR the minterms together.</li>
          </BulletList>
        </NoteTopicBlock>
        <NoteTopicBlock title="CNF">
          <BulletList>
            <li>Make the truth table.</li>
            <li>Find rows where the function is 0.</li>
            <li>Convert each false row to a maxterm, a clause that is false on exactly that row.</li>
            <li>AND the clauses together.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>
      <NoteParagraph>
        Every Boolean function can be expressed in DNF and CNF. This matters in automated theorem proving and Boolean satisfiability.
      </NoteParagraph>

      {/* 15. FUNCTIONAL COMPLETENESS AND SAT */}
      <NoteSectionTitle id="functional-completeness-and-sat">15. Functional Completeness and SAT</NoteSectionTitle>
      <NoteSubSectionTitle id="functional-completeness">15.1 Functional Completeness</NoteSubSectionTitle>
      <NoteParagraph>
        A set of Boolean operators is functionally complete if every Boolean function can be expressed using only operators from that set.
      </NoteParagraph>
      <MathBlock math="\{+,\cdot,{}'\}\text{ is functionally complete}" />
      <NoteParagraph>
        To prove another set is complete, show it can express a known complete set. NAND and NOR are each functionally complete because they can
        build NOT plus AND/OR using De Morgan-style conversions. A common mistake is proving the wrong direction: you need to show the restricted
        operator set can express the known complete tools, not merely that the complete tools can express the restricted operator.
      </NoteParagraph>
      <MathBlock math="x' = x\operatorname{NAND}x\qquad x\cdot y=(x\operatorname{NAND}y)\operatorname{NAND}(x\operatorname{NAND}y)" />
      <NoteSubSectionTitle id="boolean-satisfiability">15.2 Boolean Satisfiability</NoteSubSectionTitle>
      <NoteParagraph>
        SAT asks whether a propositional formula can be made true by some assignment of truth values. <InlineMath math="p\land q" /> is satisfiable;
        <InlineMath math="p\land\neg p" /> is not satisfiable. CNF is especially important because SAT solvers commonly operate on CNF formulas.
      </NoteParagraph>

      {/* 16. COUNTING */}
      <NoteSectionTitle id="counting">16. Counting</NoteSectionTitle>
      <NoteSubSectionTitle id="counting-rules">16.1 Counting Rules</NoteSubSectionTitle>
      <NoteParagraph>
        Counting studies how to enumerate objects with certain properties. Most counting problems become manageable once the task is split into
        cases, stages, or a correspondence with something easier to count.
      </NoteParagraph>
      <NoteTable
        headers={['Rule', 'Use it when']}
        rows={[
          ['Product rule', 'a task is built from stages with a fixed number of choices at each stage'],
          ['Sum rule', 'a task is split into disjoint cases'],
          ['Bijection rule', 'pair the objects with another set of known size'],
          ['k-to-1 rule', 'each desired object is counted exactly k times'],
          ['Complement', 'count total minus unwanted cases, especially for "at least one"'],
        ]}
      />
      <NoteSubSectionTitle id="permutations-and-combinations">16.2 Permutations and Combinations</NoteSubSectionTitle>
      <MathBlock math="P(n,r)=\frac{n!}{(n-r)!}\qquad C(n,r)=\binom nr=\frac{n!}{r!(n-r)!}" />
      <NoteParagraph>
        Here <InlineMath math="n!" /> is <InlineMath math="n(n-1)(n-2)\cdots 1" />, with <InlineMath math="0!=1" /> by convention. Permutations
        count ordered arrangements. Combinations count unordered selections. With repetition, each position can often be chosen independently, so
        the product rule becomes the central tool.
      </NoteParagraph>
      <PigeonholeExplorer />
      <NoteParagraph>
        Generalized pigeonhole principle: if <InlineMath math="N" /> objects are placed into <InlineMath math="k" /> boxes, some box contains at
        least <InlineMath math="\lceil N/k\rceil" /> objects.
      </NoteParagraph>
      <NoteSubSectionTitle id="inclusion-exclusion-and-binomial-theorem">16.3 Inclusion-Exclusion and the Binomial Theorem</NoteSubSectionTitle>
      <MathBlock math="|A\cup B|=|A|+|B|-|A\cap B|" />
      <MathBlock math="|A\cup B\cup C|=|A|+|B|+|C|-|A\cap B|-|A\cap C|-|B\cap C|+|A\cap B\cap C|" />
      <NoteParagraph>
        Inclusion-exclusion corrects overcounting by subtracting overlaps and then adding back regions that were subtracted too many times. It is
        useful for "only one category" and overlapping-condition problems.
      </NoteParagraph>
      <MathBlock math="(x+y)^n=\sum_{k=0}^{n}\binom nk x^{n-k}y^k" />
      <NoteParagraph>
        The binomial coefficients count how many ways each term appears in the expansion, which is why the binomial theorem is really a counting
        statement written as algebra.
      </NoteParagraph>
    </NotesLayout>
  );
}
