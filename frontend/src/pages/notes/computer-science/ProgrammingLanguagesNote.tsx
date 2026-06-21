/**
 * Programming Languages Notes Page
 * A standalone note for functional programming, formal syntax, typing, semantics, type inference, and interpreters.
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
  RelatedNotes,
} from '../../../components/notes';
import { useDarkMode } from '../../../hooks/useDarkMode';
import { UnificationRunner } from './CsAlgorithmRunners';

type TableRow = ReactNode[];

function usePLTheme() {
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
  const { listClass } = usePLTheme();
  return <ul className={`${listClass} ${className}`}>{children}</ul>;
}

function NoteTable({ headers, rows }: { headers: ReactNode[]; rows: TableRow[] }) {
  const { tableClass, tableHeadClass, tableCellClass } = usePLTheme();

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

function InferenceRule({
  name,
  premises,
  conclusion,
}: {
  name: string;
  premises: ReactNode[];
  conclusion: ReactNode;
}) {
  const { subtlePanelClass } = usePLTheme();

  return (
    <div className={`mb-6 rounded-lg border p-4 ${subtlePanelClass}`}>
      <div className="mb-3 flex flex-wrap items-end justify-center gap-x-6 gap-y-2 font-mono text-sm">
        {premises.length === 0 ? <span className="opacity-70">no premises</span> : premises.map((premise, index) => <span key={index}>{premise}</span>)}
      </div>
      <div className="mx-auto mb-3 h-px max-w-xl bg-current/40" />
      <div className="text-center font-mono text-sm">
        {conclusion}
        <span className="ml-3 opacity-70">({name})</span>
      </div>
    </div>
  );
}

function PLNotationGuide() {
  return (
    <NoteTopicGroup>
      <NoteTopicBlock title="Notation Used Throughout">
        <BulletList className="mb-0">
          <li><InlineMath math={'\\Gamma'} /> is a typing context: the static assumptions about variable types.</li>
          <li><InlineMath math={'\\mathcal{E}'} /> is a runtime environment: the dynamic mapping from variables to values.</li>
          <li><InlineMath math={'e'} /> means expression, <InlineMath math={'v'} /> means value, and <InlineMath math={'\\tau'} /> means type.</li>
          <li><InlineMath math={'\\Gamma \\vdash e : \\tau'} /> reads as: under context <InlineMath math={'\\Gamma'} />, expression <InlineMath math={'e'} /> has type <InlineMath math={'\\tau'} />.</li>
          <li><InlineMath math={'e \\Downarrow v'} /> means expression <InlineMath math={'e'} /> evaluates to value <InlineMath math={'v'} /> in big-step semantics.</li>
          <li><InlineMath math={'e \\to e\\prime'} /> means expression <InlineMath math={'e'} /> takes one small step to <InlineMath math={'e\\prime'} />.</li>
          <li><InlineMath math={'\\lambda x.e'} /> is a lambda expression: a function with parameter <InlineMath math={'x'} /> and body <InlineMath math={'e'} />.</li>
          <li><InlineMath math={'[e\\prime/x]e'} /> means substitute <InlineMath math={'e\\prime'} /> for free occurrences of <InlineMath math={'x'} /> in <InlineMath math={'e'} />.</li>
          <li><InlineMath math={'\\alpha'} />, <InlineMath math={'\\beta'} />, and <InlineMath math={'\\gamma'} /> often name type variables.</li>
          <li><InlineMath math={'\\forall\\alpha.\\tau'} /> is a polymorphic type scheme that can be specialized by replacing <InlineMath math={'\\alpha'} />.</li>
        </BulletList>
      </NoteTopicBlock>
    </NoteTopicGroup>
  );
}

function LanguagePipelineExplorer() {
  return (
    <NoteTable
      headers={['Stage', 'Question', 'Artifact']}
      rows={[
        ['Source', 'What did the programmer write?', 'Characters such as let x = 2 + 3 in x.'],
        ['Lexing', 'How are characters grouped into tokens?', 'Tokens such as LET, IDENT(x), INT(2), PLUS, INT(3).'],
        ['Parsing', 'What syntax tree does the token stream describe?', 'An AST such as Let("x", Add(Int 2, Int 3), Var "x").'],
        ['Typing', 'Is the syntax statically meaningful?', <InlineMath math={'\\Gamma \\vdash e : int'} />],
        ['Evaluation', 'What value does the expression compute?', <InlineMath math={'e \\Downarrow 5'} />],
      ]}
    />
  );
}

type RecursionMode = 'plain' | 'tail';

function RecursionTraceExplorer() {
  const { subtlePanelClass } = usePLTheme();
  const [mode, setMode] = useState<RecursionMode>('tail');
  const trace =
    mode === 'plain'
      ? [
          'sum [1; 2; 3]',
          '1 + sum [2; 3]',
          '1 + (2 + sum [3])',
          '1 + (2 + (3 + sum []))',
          '1 + (2 + (3 + 0))',
          '6',
        ]
      : [
          'go 0 [1; 2; 3]',
          'go 1 [2; 3]',
          'go 3 [3]',
          'go 6 []',
          '6',
        ];

  return (
    <InteractiveBlock title="Recursion vs Tail Recursion">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,360px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 block text-sm font-bold" htmlFor="recursion-mode">Implementation</label>
          <select
            id="recursion-mode"
            value={mode}
            onChange={(event) => setMode(event.target.value as RecursionMode)}
            className="mb-4 w-full rounded border border-current/20 bg-transparent p-2 text-sm"
          >
            <option value="plain">ordinary recursive sum</option>
            <option value="tail">tail-recursive sum</option>
          </select>
          <CodeBlock
            language="ocaml"
            code={
              mode === 'plain'
                ? `let rec sum l =
  match l with
  | [] -> 0
  | x :: xs -> x + sum xs`
                : `let sum l =
  let rec go acc l =
    match l with
    | [] -> acc
    | x :: xs -> go (acc + x) xs
  in
  go 0 l`
            }
            className="mb-0"
          />
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <ol className="mb-4 list-decimal space-y-2 pl-6 font-mono text-sm">
            {trace.map((line) => (
              <li key={line}><code>{line}</code></li>
            ))}
          </ol>
          <NoteParagraph className="mb-0 text-sm">
            Tail recursion moves pending work into an accumulator, so the recursive call is the final action.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

type AdtExample = 'option' | 'tree' | 'shape';

function AdtExplorer() {
  const { subtlePanelClass } = usePLTheme();
  const [example, setExample] = useState<AdtExample>('option');
  const examples = {
    option: {
      label: 'option',
      definition: `type 'a option =
  | None
  | Some of 'a`,
      intuition: 'A value is either missing or present. The type parameter keeps the present value flexible.',
      pattern: `match value with
| None -> default
| Some x -> use x`,
    },
    tree: {
      label: 'tree',
      definition: `type 'a tree =
  | Leaf
  | Node of 'a * 'a tree * 'a tree`,
      intuition: 'A tree is recursively defined: each node contains smaller trees.',
      pattern: `match tree with
| Leaf -> base
| Node (x, left, right) -> combine x left right`,
    },
    shape: {
      label: 'shape',
      definition: `type shape =
  | Circle of float
  | Rectangle of float * float`,
      intuition: 'A shape is one of several named alternatives, and each alternative can carry different data.',
      pattern: `match shape with
| Circle r -> ...
| Rectangle (w, h) -> ...`,
    },
  } satisfies Record<AdtExample, { label: string; definition: string; intuition: string; pattern: string }>;
  const current = examples[example];

  return (
    <InteractiveBlock title="Algebraic Data Type Shapes">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,360px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 block text-sm font-bold" htmlFor="adt-example">ADT</label>
          <select
            id="adt-example"
            value={example}
            onChange={(event) => setExample(event.target.value as AdtExample)}
            className="mb-4 w-full rounded border border-current/20 bg-transparent p-2 text-sm"
          >
            {Object.entries(examples).map(([key, value]) => (
              <option key={key} value={key}>{value.label}</option>
            ))}
          </select>
          <CodeBlock language="ocaml" code={current.definition} className="mb-0" />
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <NoteTable
            headers={['view', current.label]}
            rows={[
              ['intuition', current.intuition],
              ['destructor pattern', <CodeBlock key={current.label} language="ocaml" code={current.pattern} className="mb-0" />],
            ]}
          />
        </div>
      </div>
    </InteractiveBlock>
  );
}

type FoldMode = 'map' | 'filter' | 'fold-left' | 'fold-right';

const foldData = [1, 2, 3];

function FoldExplorer() {
  const { subtlePanelClass } = usePLTheme();
  const [mode, setMode] = useState<FoldMode>('fold-left');
  const result = useMemo(() => {
    if (mode === 'map') return foldData.map((x) => x * x).join('; ');
    if (mode === 'filter') return foldData.filter((x) => x % 2 === 1).join('; ');
    if (mode === 'fold-left') return '((0 + 1) + 2) + 3 = 6';
    return '1 + (2 + (3 + 0)) = 6';
  }, [mode]);
  const code = {
    map: 'List.map (fun x -> x * x) [1; 2; 3]',
    filter: 'List.filter (fun x -> x mod 2 = 1) [1; 2; 3]',
    'fold-left': 'List.fold_left ( + ) 0 [1; 2; 3]',
    'fold-right': 'List.fold_right ( + ) [1; 2; 3] 0',
  } satisfies Record<FoldMode, string>;

  return (
    <InteractiveBlock title="Map, Filter, and Fold">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,360px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 block text-sm font-bold" htmlFor="fold-mode">Operation</label>
          <select
            id="fold-mode"
            value={mode}
            onChange={(event) => setMode(event.target.value as FoldMode)}
            className="mb-4 w-full rounded border border-current/20 bg-transparent p-2 text-sm"
          >
            <option value="map">map</option>
            <option value="filter">filter</option>
            <option value="fold-left">fold_left</option>
            <option value="fold-right">fold_right</option>
          </select>
          <CodeBlock language="ocaml" code={code[mode]} className="mb-0" />
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <NoteTable
            headers={['input', 'output']}
            rows={[
              ['[1; 2; 3]', result],
              ['result shape', mode.startsWith('fold') ? 'Collapse a structure into one result.' : 'Produce a new list from the old list.'],
            ]}
          />
        </div>
      </div>
    </InteractiveBlock>
  );
}

type TypingRuleKey = 'var' | 'fun' | 'app' | 'let' | 'if';

function TypingRuleExplorer() {
  const { subtlePanelClass } = usePLTheme();
  const [rule, setRule] = useState<TypingRuleKey>('app');
  const rules = {
    var: {
      label: 'variable',
      premises: [<InlineMath key="p" math={'(x:\\tau) \\in \\Gamma'} />],
      conclusion: <InlineMath math={'\\Gamma \\vdash x : \\tau'} />,
      explanation: 'A variable has the type recorded for it in the context.',
    },
    fun: {
      label: 'function',
      premises: [<InlineMath key="p" math={'\\Gamma, x:\\tau_1 \\vdash e : \\tau_2'} />],
      conclusion: <InlineMath math={'\\Gamma \\vdash fun\\ x \\to e : \\tau_1 \\to \\tau_2'} />,
      explanation: 'To type a function, assume a type for its parameter and type-check the body under that extended context.',
    },
    app: {
      label: 'application',
      premises: [<InlineMath key="p1" math={'\\Gamma \\vdash e_1 : \\tau_1 \\to \\tau_2'} />, <InlineMath key="p2" math={'\\Gamma \\vdash e_2 : \\tau_1'} />],
      conclusion: <InlineMath math={'\\Gamma \\vdash e_1\\ e_2 : \\tau_2'} />,
      explanation: 'A function application is well typed when the argument type matches the function input type.',
    },
    let: {
      label: 'let',
      premises: [<InlineMath key="p1" math={'\\Gamma \\vdash e_1 : \\tau_1'} />, <InlineMath key="p2" math={'\\Gamma, x:\\tau_1 \\vdash e_2 : \\tau_2'} />],
      conclusion: <InlineMath math={'\\Gamma \\vdash let\\ x=e_1\\ in\\ e_2 : \\tau_2'} />,
      explanation: 'First type the binding expression, then type the body with the new variable available.',
    },
    if: {
      label: 'if',
      premises: [<InlineMath key="p1" math={'\\Gamma \\vdash e_1 : bool'} />, <InlineMath key="p2" math={'\\Gamma \\vdash e_2 : \\tau'} />, <InlineMath key="p3" math={'\\Gamma \\vdash e_3 : \\tau'} />],
      conclusion: <InlineMath math={'\\Gamma \\vdash if\\ e_1\\ then\\ e_2\\ else\\ e_3 : \\tau'} />,
      explanation: 'The condition must be Boolean, and both branches must have the same type.',
    },
  } satisfies Record<TypingRuleKey, { label: string; premises: ReactNode[]; conclusion: ReactNode; explanation: string }>;
  const current = rules[rule];

  return (
    <InteractiveBlock title="Typing Rule Explorer">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 block text-sm font-bold" htmlFor="typing-rule">Rule</label>
          <select
            id="typing-rule"
            value={rule}
            onChange={(event) => setRule(event.target.value as TypingRuleKey)}
            className="w-full rounded border border-current/20 bg-transparent p-2 text-sm"
          >
            {Object.entries(rules).map(([key, value]) => (
              <option key={key} value={key}>{value.label}</option>
            ))}
          </select>
        </div>
        <div>
          <InferenceRule name={rule} premises={current.premises} conclusion={current.conclusion} />
          <NoteParagraph className="mb-0 text-sm">{current.explanation}</NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function SemanticsExplorer() {
  return (
    <NoteTable
      headers={['Style', 'Judgment', 'Meaning']}
      rows={[
        ['Big-step', <InlineMath math={'e \\Downarrow v'} />, 'Relates an expression directly to its final value.'],
        ['Small-step', <InlineMath math={'e \\to e\\prime'} />, 'Models execution as a sequence of local reductions.'],
        ['Environment big-step', <InlineMath math={'\\langle \\mathcal{E}, e \\rangle \\Downarrow v'} />, 'Evaluates under runtime bindings instead of rewriting expressions with substitution.'],
      ]}
    />
  );
}

type ScopeMode = 'lexical' | 'dynamic';

function ClosureScopeExplorer() {
  const { subtlePanelClass } = usePLTheme();
  const [mode, setMode] = useState<ScopeMode>('lexical');
  const result = mode === 'lexical' ? 11 : 101;

  return (
    <InteractiveBlock title="Lexical vs Dynamic Scope">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,360px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 block text-sm font-bold" htmlFor="scope-mode">Scope rule</label>
          <select
            id="scope-mode"
            value={mode}
            onChange={(event) => setMode(event.target.value as ScopeMode)}
            className="mb-4 w-full rounded border border-current/20 bg-transparent p-2 text-sm"
          >
            <option value="lexical">lexical scope</option>
            <option value="dynamic">dynamic scope</option>
          </select>
          <CodeBlock
            language="ocaml"
            code={`let x = 10 in
let f = fun y -> x + y in
let x = 100 in
f 1`}
            className="mb-0"
          />
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <NoteTable
            headers={['question', 'answer']}
            rows={[
              ['result', result],
              ['why', mode === 'lexical' ? 'f remembers the x=10 environment where it was defined.' : 'f uses the x=100 binding active where it is called.'],
              ['language behavior', 'Most modern functional languages use lexical scope.'],
            ]}
          />
          <NoteParagraph className="mb-0 text-sm">
            A closure is function code packaged with the definition-time environment needed to resolve its free variables.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

type UnificationCase = 'identical' | 'function' | 'variable' | 'occurs';

function UnificationExplorer() {
  const { subtlePanelClass } = usePLTheme();
  const [caseKey, setCaseKey] = useState<UnificationCase>('function');
  const cases = {
    identical: {
      label: 'identical',
      constraint: <InlineMath math={'int \\doteq int'} />,
      action: 'Remove the constraint because it is already satisfied.',
      result: '{}',
    },
    function: {
      label: 'function types',
      constraint: <InlineMath math={'\\alpha \\to int \\doteq bool \\to \\beta'} />,
      action: 'Decompose into argument and return constraints.',
      result: '{ alpha = bool, beta = int }',
    },
    variable: {
      label: 'variable vs type',
      constraint: <InlineMath math={'\\alpha \\doteq int \\to bool'} />,
      action: 'Substitute the type for the variable everywhere, if alpha does not occur inside it.',
      result: '{ alpha -> int -> bool }',
    },
    occurs: {
      label: 'occurs check',
      constraint: <InlineMath math={'\\alpha \\doteq \\alpha \\to \\beta'} />,
      action: 'Fail because solving would require an infinite type.',
      result: 'type error',
    },
  } satisfies Record<UnificationCase, { label: string; constraint: ReactNode; action: string; result: string }>;
  const current = cases[caseKey];

  return (
    <InteractiveBlock title="Unification Cases">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,360px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 block text-sm font-bold" htmlFor="unification-case">Case</label>
          <select
            id="unification-case"
            value={caseKey}
            onChange={(event) => setCaseKey(event.target.value as UnificationCase)}
            className="w-full rounded border border-current/20 bg-transparent p-2 text-sm"
          >
            {Object.entries(cases).map(([key, value]) => (
              <option key={key} value={key}>{value.label}</option>
            ))}
          </select>
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <NoteTable
            headers={['field', current.label]}
            rows={[
              ['constraint', current.constraint],
              ['action', current.action],
              ['result', <code>{current.result}</code>],
            ]}
          />
        </div>
      </div>
    </InteractiveBlock>
  );
}

type StackProgram = 'sub-mul' | 'add' | 'vars';

function StackMachineExplorer() {
  const { subtlePanelClass } = usePLTheme();
  const [program, setProgram] = useState<StackProgram>('sub-mul');
  const traces = {
    'sub-mul': {
      label: 'PUSH 2 PUSH 3 SUB PUSH 4 MUL',
      code: 'PUSH 2 PUSH 3 SUB PUSH 4 MUL',
      trace: ['[]', '[2]', '[3; 2]', '[-1]', '[4; -1]', '[-4]'],
      result: '-4',
    },
    add: {
      label: 'PUSH 5 PUSH 7 ADD',
      code: 'PUSH 5 PUSH 7 ADD',
      trace: ['[]', '[5]', '[7; 5]', '[12]'],
      result: '12',
    },
    vars: {
      label: 'PUSH 9 ASSIGN x LOOKUP x',
      code: 'PUSH 9 ASSIGN x LOOKUP x',
      trace: ['stack=[], env={}', 'stack=[9], env={}', 'stack=[], env={x=9}', 'stack=[9], env={x=9}'],
      result: '9',
    },
  } satisfies Record<StackProgram, { label: string; code: string; trace: string[]; result: string }>;
  const current = traces[program];

  return (
    <InteractiveBlock title="Stack Machine Trace">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,360px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 block text-sm font-bold" htmlFor="stack-program">Program</label>
          <select
            id="stack-program"
            value={program}
            onChange={(event) => setProgram(event.target.value as StackProgram)}
            className="mb-4 w-full rounded border border-current/20 bg-transparent p-2 text-sm"
          >
            {Object.entries(traces).map(([key, value]) => (
              <option key={key} value={key}>{value.label}</option>
            ))}
          </select>
          <CodeBlock language="bytecode" code={current.code} className="mb-0" />
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <ol className="mb-4 list-decimal space-y-2 pl-6 font-mono text-sm">
            {current.trace.map((entry, index) => (
              <li key={`${entry}-${index}`}><code>{entry}</code></li>
            ))}
          </ol>
          <NoteParagraph className="mb-0 text-sm">
            Top of stack is written first. Final result: <code>{current.result}</code>.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

export default function ProgrammingLanguagesNote() {
  return (
    <NotesLayout>
      <NoteHeader
        title="Programming Languages"
        subtitle="Understand languages by specifying their syntax, typing rules, semantics, runtime environments, type inference, and interpreters."
      />

      <RelatedNotes
        links={[
          { href: '/notes/ocaml', label: 'OCaml', note: 'Concrete functional programming syntax, recursion, pattern matching, modules, and tests.' },
        ]}
      />

      <PLNotationGuide />

      <NoteSectionTitle id="programming-languages-overview">1. Programming Languages Overview</NoteSectionTitle>
      <NoteParagraph>
        Programming languages can be studied as tools for writing programs and as formal systems with precise rules. The central organizing idea is that
        every construct should have syntax rules, typing rules, and semantic rules.
      </NoteParagraph>
      <LanguagePipelineExplorer />
      <NoteTopicGroup>
        <NoteTopicBlock title="Three Questions for Every Construct">
          <BulletList className="mb-0">
            <li>Syntax: what forms are allowed?</li>
            <li>Typing: when is the expression statically meaningful?</li>
            <li>Semantics: what does the expression do when evaluated?</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="expression-oriented-core-model">2. Expression-Oriented Core Model</NoteSectionTitle>
      <NoteParagraph>
        Many programming-language ideas are clearest in a small expression-oriented core. The basic model is simple: a program fragment is an
        expression, the type system predicts what kind of value it can produce, and evaluation computes that value. OCaml-style examples are used here
        as compact notation; the dedicated OCaml note covers the language and tooling in detail.
      </NoteParagraph>
      <NoteTable
        headers={['core idea', 'meaning']}
        rows={[
          ['expression', 'A syntactic object that can be evaluated.'],
          ['type', 'A static classification of expressions, such as int, bool, or string.'],
          ['value', 'The result of evaluation, such as 5, true, or a function closure.'],
          ['let-binding', 'Names the result of an expression in a body.'],
          ['function', 'A value that maps inputs to outputs.'],
        ]}
      />

      <NoteSectionTitle id="source-text-to-meaning">3. Source Text to Meaning</NoteSectionTitle>
      <NoteParagraph>
        A language implementation turns source text into meaning through a sequence of representations. Keeping those representations separate makes
        interpreters, compilers, type checkers, and tests easier to reason about.
      </NoteParagraph>
      <NoteTable
        headers={['stage', 'what can go wrong']}
        rows={[
          ['lexing', 'characters are grouped into the wrong tokens'],
          ['parsing', 'tokens form the wrong syntax tree or an ambiguous tree'],
          ['type checking', 'an invalid program is accepted or a valid program is rejected'],
          ['evaluation', 'the dynamic semantics compute the wrong value'],
          ['testing', 'a stage works alone but disagrees with the next stage'],
        ]}
      />

      <NoteSectionTitle id="expressions-types-and-values">4. Expressions, Types, and Values</NoteSectionTitle>
      <NoteParagraph>
        An expression is written syntax. A type is a static description of what kind of value the expression may produce. A value is the result after
        evaluation. For example, <code>2 + 3</code> has type <code>int</code> and evaluates to <code>5</code>.
      </NoteParagraph>
      <CodeBlock
        language="ocaml"
        code={`2 + (2 * 3)

if x = 3 then 4 else 5

let x = 3 in x + 1

fun x -> x + 1`}
      />
      <NoteParagraph>
        In OCaml, <code>if</code> is an expression, not a statement. The condition must have type <code>bool</code>, and both branches must have the same
        type because the entire <code>if</code> expression must have one type.
      </NoteParagraph>

      <NoteSectionTitle id="recursion-and-functional-programming">5. Recursion and Functional Programming</NoteSectionTitle>
      <NoteParagraph>
        Functional programming often replaces loops and mutation with recursion. A recursive function defines a base case and a recursive case. The base
        case stops the computation; the recursive case handles one layer and calls the function on a smaller input.
      </NoteParagraph>
      <RecursionTraceExplorer />

      <NoteSectionTitle id="lists-and-pattern-matching">6. Lists and Pattern Matching</NoteSectionTitle>
      <NoteParagraph>
        An OCaml list is ordered, variable-length, homogeneous, and immutable. Homogeneous means every element has the same type. A list is structurally
        closer to a linked list than an array, so accessing the head is natural but random indexing is not the basic operation.
      </NoteParagraph>
      <CodeBlock
        language="ocaml"
        code={`[]
1 :: 2 :: 3 :: []
[1; 2; 3]

let rec length l =
  match l with
  | [] -> 0
  | _ :: t -> 1 + length t`}
      />
      <NoteTopicGroup>
        <NoteTopicBlock title="List Pattern">
          <BulletList className="mb-0">
            <li><code>[]</code> matches the empty list.</li>
            <li><code>h :: t</code> matches a nonempty list with head <code>h</code> and tail <code>t</code>.</li>
            <li><code>::</code> is right-associative, so <code>1 :: 2 :: []</code> means <code>1 :: (2 :: [])</code>.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="tail-recursion">7. Tail Recursion</NoteSectionTitle>
      <NoteParagraph>
        A function is tail-recursive when the recursive call is the final computation performed by the function. Tail-recursive functions often use an
        accumulator to carry work that would otherwise remain pending on the call stack.
      </NoteParagraph>
      <NoteTable
        headers={['implementation', 'recursive call position']}
        rows={[
          ['ordinary sum', <code>x + sum xs</code>],
          ['tail-recursive sum', <code>go (acc + x) xs</code>],
        ]}
      />
      <NoteParagraph>
        Tail recursion is an implementation concern as well as a design pattern: it lets recursive code run like a loop when the compiler can optimize it.
      </NoteParagraph>

      <NoteSectionTitle id="tuples-and-records">8. Tuples and Records</NoteSectionTitle>
      <NoteParagraph>
        Tuples and records are product types. A product type contains multiple pieces at the same time. Tuples are ordered and unlabeled; records are
        labeled, which makes them clearer when fields have domain meaning.
      </NoteParagraph>
      <CodeBlock
        language="ocaml"
        code={`let point : float * float = (2.0, 3.0)

type student = {
  name : string;
  id : int;
}`}
      />
      <NoteTable
        headers={['structure', 'best when']}
        rows={[
          ['tuple', 'The data is small and positions are obvious, such as coordinates.'],
          ['record', 'Fields need names, such as name, id, and email.'],
        ]}
      />

      <NoteSectionTitle id="variants-and-algebraic-data-types">9. Variants and Algebraic Data Types</NoteSectionTitle>
      <NoteParagraph>
        A variant type defines values by alternatives. Variants are sum types because a value is one of several cases. Constructors name the cases, and
        constructors can carry data.
      </NoteParagraph>
      <AdtExplorer />
      <NoteParagraph>
        Algebraic data types are powerful because they let programmers model the shape of data directly, then use pattern matching to handle every shape.
      </NoteParagraph>

      <NoteSectionTitle id="options-and-parametric-adts">10. Options and Parametric ADTs</NoteSectionTitle>
      <NoteParagraph>
        A parametric ADT uses type variables so the same structure works for many element types. The option type is the cleanest first example: a value is
        either absent or present.
      </NoteParagraph>
      <CodeBlock
        language="ocaml"
        code={`type 'a option =
  | None
  | Some of 'a

let default d value =
  match value with
  | None -> d
  | Some x -> x`}
      />
      <InferenceRule
        name="some"
        premises={[<InlineMath key="p" math={'\\Gamma \\vdash e : \\tau'} />]}
        conclusion={<InlineMath math={'\\Gamma \\vdash Some(e) : \\tau\\ option'} />}
      />

      <NoteSectionTitle id="recursive-adts-and-trees">11. Recursive ADTs and Trees</NoteSectionTitle>
      <NoteParagraph>
        A recursive ADT is defined in terms of smaller values of the same type. Trees are the standard example: a tree is either empty, or a node
        containing a value and smaller subtrees.
      </NoteParagraph>
      <CodeBlock
        language="ocaml"
        code={`type 'a tree =
  | Leaf
  | Node of 'a * 'a tree * 'a tree

let rec map_tree f t =
  match t with
  | Leaf -> Leaf
  | Node (x, left, right) ->
      Node (f x, map_tree f left, map_tree f right)`}
      />
      <NoteParagraph>
        Recursive functions over ADTs usually mirror the type definition: one branch for each constructor, and recursive calls for recursive fields.
      </NoteParagraph>

      <NoteSectionTitle id="higher-order-functions">12. Higher-Order Functions</NoteSectionTitle>
      <NoteParagraph>
        A higher-order function takes a function as input or returns a function as output. This turns repeated recursion patterns into reusable library
        functions.
      </NoteParagraph>
      <NoteTable
        headers={['function', 'idea']}
        rows={[
          ['map', 'Transform every element.'],
          ['filter', 'Keep elements satisfying a predicate.'],
          ['fold', 'Consume a structure into one accumulated result.'],
          ['function return', 'Build specialized functions from general ones.'],
        ]}
      />

      <NoteSectionTitle id="map-filter-and-fold">13. Map, Filter, and Fold</NoteSectionTitle>
      <NoteParagraph>
        <code>map</code>, <code>filter</code>, and <code>fold</code> are higher-order functions over collections. They capture three common intentions:
        transform, select, and accumulate.
      </NoteParagraph>
      <FoldExplorer />
      <CodeBlock
        language="ocaml"
        code={`let rec map f l =
  match l with
  | [] -> []
  | x :: xs -> f x :: map f xs

let rec filter p l =
  match l with
  | [] -> []
  | x :: xs ->
      if p x then x :: filter p xs
      else filter p xs`}
      />

      <NoteSectionTitle id="modules-and-testing">14. Modules and Testing</NoteSectionTitle>
      <NoteParagraph>
        Modules organize larger OCaml programs by grouping names, hiding implementation details, and separating interfaces from implementations. Unit
        tests are especially useful when building interpreters because parsing, substitution, evaluation, and type inference all have crisp expected
        behavior.
      </NoteParagraph>
      <NoteTable
        headers={['practice', 'why it matters for language implementations']}
        rows={[
          ['module boundaries', 'Separate syntax definitions, parser code, evaluator code, and type checker code.'],
          ['interface files', 'Expose only the intended functions and types.'],
          ['unit tests', 'Check small rules and edge cases before debugging whole programs.'],
          ['regression tests', 'Protect fixed interpreter bugs from returning.'],
        ]}
      />

      <NoteSectionTitle id="inference-rules">15. Inference Rules</NoteSectionTitle>
      <NoteParagraph>
        Inference rules are the formal notation used to define typing and semantic systems. Premises appear above the line. The conclusion appears below
        the line. If every premise holds, the conclusion follows by the named rule.
      </NoteParagraph>
      <InferenceRule
        name="rule-name"
        premises={['P1', 'P2', '...', 'Pk']}
        conclusion="C"
      />
      <NoteParagraph>
        Rules are not decoration; they are executable specifications for type checkers, evaluators, and proof trees.
      </NoteParagraph>

      <NoteSectionTitle id="typing-judgments-and-contexts">16. Typing Judgments and Contexts</NoteSectionTitle>
      <NoteParagraph>
        A typing judgment states that an expression has a type under a context. The context tracks variable declarations currently in scope.
      </NoteParagraph>
      <NoteTable
        headers={['notation', 'reading']}
        rows={[
          [<InlineMath math={'\\Gamma'} />, 'Typing context.'],
          [<InlineMath math={'x : \\tau'} />, 'Variable x has type tau.'],
          [<InlineMath math={'\\Gamma \\vdash e : \\tau'} />, 'Under context Gamma, expression e has type tau.'],
          [<InlineMath math={'\\Gamma, x:\\tau'} />, 'Context Gamma extended with x : tau.'],
        ]}
      />
      <TypingRuleExplorer />

      <NoteSectionTitle id="derivations">17. Derivations</NoteSectionTitle>
      <NoteParagraph>
        A derivation is a proof tree built from inference rules. The root is the judgment to prove. The leaves are assumptions or axioms. Each internal
        node is justified by one rule.
      </NoteParagraph>
      <InferenceRule
        name="add"
        premises={[
          <InlineMath key="p1" math={'\\Gamma \\vdash 2 : int'} />,
          <InlineMath key="p2" math={'\\Gamma \\vdash 3 : int'} />,
        ]}
        conclusion={<InlineMath math={'\\Gamma \\vdash 2 + 3 : int'} />}
      />
      <NoteParagraph>
        A good derivation does not skip why subexpressions have their types. Every variable use must be justified by the context, and every compound
        expression must match a rule.
      </NoteParagraph>

      <NoteSectionTitle id="formal-grammar-and-parsing">18. Formal Grammar and Parsing</NoteSectionTitle>
      <NoteParagraph>
        A formal grammar defines which strings belong to a language. Parsing turns a token stream into a parse tree or abstract syntax tree according to
        the grammar.
      </NoteParagraph>
      <MathBlock math="\begin{aligned}\mathtt{expr} &::= \mathtt{INT}\\&\mid \mathtt{expr}\ \mathtt{PLUS}\ \mathtt{expr}\\&\mid \mathtt{IF}\ \mathtt{expr}\ \mathtt{THEN}\ \mathtt{expr}\ \mathtt{ELSE}\ \mathtt{expr}\\&\mid \mathtt{LET}\ \mathtt{IDENT}\ \mathtt{EQ}\ \mathtt{expr}\ \mathtt{IN}\ \mathtt{expr}\end{aligned}" />
      <NoteTable
        headers={['piece', 'role']}
        rows={[
          ['terminal', 'A literal token, such as PLUS or INT.'],
          ['nonterminal', 'A syntactic category, such as expr.'],
          ['production', 'A rule for expanding a nonterminal.'],
          ['AST', 'The tree representation the interpreter usually consumes.'],
        ]}
      />

      <NoteSectionTitle id="ambiguity-and-parser-generators">19. Ambiguity and Parser Generators</NoteSectionTitle>
      <NoteParagraph>
        A grammar is ambiguous if one string has more than one parse tree. Ambiguity is a problem because different parse trees can imply different
        meanings. Parser generators build parsers from grammar specifications, but the grammar still needs precedence and associativity decisions.
      </NoteParagraph>
      <NoteTable
        headers={['issue', 'example', 'fix']}
        rows={[
          ['operator precedence', <code>1 + 2 * 3</code>, 'Make multiplication bind tighter than addition.'],
          ['associativity', <code>1 - 2 - 3</code>, 'Decide whether subtraction groups left or right.'],
          ['dangling else', <code>if a then if b then c else d</code>, 'Specify which if owns the else.'],
        ]}
      />

      <NoteSectionTitle id="formal-semantics">20. Formal Semantics</NoteSectionTitle>
      <NoteParagraph>
        Formal semantics defines program behavior precisely. Instead of saying an expression "runs somehow," semantic rules specify how evaluation
        proceeds and what values can result.
      </NoteParagraph>
      <SemanticsExplorer />

      <NoteSectionTitle id="big-step-semantics">21. Big-Step Semantics</NoteSectionTitle>
      <NoteParagraph>
        Big-step semantics relates an expression directly to its final value. It is good for describing final results, but it hides intermediate states and
        is less convenient for modeling nontermination step by step.
      </NoteParagraph>
      <InferenceRule
        name="if-true"
        premises={[
          <InlineMath key="p1" math={'e_1 \\Downarrow true'} />,
          <InlineMath key="p2" math={'e_2 \\Downarrow v'} />,
        ]}
        conclusion={<InlineMath math={'if\\ e_1\\ then\\ e_2\\ else\\ e_3 \\Downarrow v'} />}
      />

      <NoteSectionTitle id="small-step-semantics">22. Small-Step Semantics</NoteSectionTitle>
      <NoteParagraph>
        Small-step semantics describes one local computation step at a time. Repeating small steps gives an execution trace. This style is useful for
        reasoning about evaluation order, state, and machines.
      </NoteParagraph>
      <MathBlock math="\begin{aligned}(2+3)\cdot 4 &\to 5\cdot 4\\&\to 20\end{aligned}" />
      <NoteParagraph>
        A value is an expression that is already finished. A stuck expression is not a value and cannot take a step.
      </NoteParagraph>

      <NoteSectionTitle id="lambda-calculus">23. Lambda Calculus</NoteSectionTitle>
      <NoteParagraph>
        Lambda calculus is a tiny formal language for functions. Its core expressions are variables, lambda abstractions, and applications.
      </NoteParagraph>
      <MathBlock math="e ::= x\mid \lambda x.e\mid e_1\ e_2" />
      <NoteTable
        headers={['form', 'meaning']}
        rows={[
          [<InlineMath math={'x'} />, 'Variable.'],
          [<InlineMath math={'\\lambda x.e'} />, 'Function with parameter x and body e.'],
          [<InlineMath math={'e_1\\ e_2'} />, 'Apply function expression e1 to argument expression e2.'],
        ]}
      />

      <NoteSectionTitle id="substitution-and-capture-avoidance">24. Substitution and Capture Avoidance</NoteSectionTitle>
      <NoteParagraph>
        Substitution replaces free occurrences of a variable with an expression. Capture-avoiding substitution prevents a free variable from accidentally
        becoming bound by a lambda.
      </NoteParagraph>
      <NoteTable
        headers={['notation', 'meaning']}
        rows={[
          [<InlineMath math={'[e\\prime/x]e'} />, <span>Substitute <InlineMath math="e'" /> for <InlineMath math="x" /> in <InlineMath math="e" />.</span>],
          [<InlineMath math={'FV(e)'} />, 'Free variables of e.'],
          ['capture', 'A free variable becomes accidentally bound after substitution.'],
          ['alpha-renaming', 'Rename bound variables to avoid capture.'],
        ]}
      />
      <MathBlock math="\text{bad:}\quad [y/x](\lambda y.x)=\lambda y.y" />
      <NoteParagraph>
        This is wrong because the free <InlineMath math="y" /> became captured. Capture-avoiding substitution first alpha-renames the bound
        <InlineMath math="y" />, then substitutes.
      </NoteParagraph>

      <NoteSectionTitle id="environment-model">25. Environment Model</NoteSectionTitle>
      <NoteParagraph>
        The environment model evaluates expressions with a runtime environment instead of repeatedly rewriting expressions by substitution. The
        environment maps variables to values.
      </NoteParagraph>
      <NoteTable
        headers={['model', 'stores']}
        rows={[
          ['typing context', 'Static assumptions such as x : int.'],
          ['runtime environment', 'Runtime values such as x maps to 3.'],
          ['closure', 'Function code plus its definition-time environment.'],
        ]}
      />

      <NoteSectionTitle id="lexical-scope-and-closures">26. Lexical Scope and Closures</NoteSectionTitle>
      <NoteParagraph>
        Lexical scope resolves free variables using the environment where a function is defined. Dynamic scope resolves them using the environment where a
        function is called. Closures implement lexical scope by storing a function with its definition-time environment.
      </NoteParagraph>
      <ClosureScopeExplorer />

      <NoteSectionTitle id="recursion-and-named-closures">27. Recursion and Named Closures</NoteSectionTitle>
      <NoteParagraph>
        Recursive functions need a way for the function body to refer to the function itself. In an environment-based interpreter, this usually means a
        named closure or a recursive environment binding.
      </NoteParagraph>
      <CodeBlock
        language="ocaml"
        code={`let rec fact n =
  if n = 0 then 1
  else n * fact (n - 1)`}
      />
      <NoteParagraph>
        The key implementation issue is that <code>fact</code> must be available inside its own body when the closure runs.
      </NoteParagraph>

      <NoteSectionTitle id="simply-typed-lambda-calculus">28. Simply Typed Lambda Calculus</NoteSectionTitle>
      <NoteParagraph>
        The simply typed lambda calculus, or STLC, adds types to lambda calculus. It is small enough to reason about formally but rich enough to show
        functions, application, contexts, and type safety.
      </NoteParagraph>
      <MathBlock math="\begin{aligned}\tau &::= int\mid bool\mid \tau_1\to\tau_2\\e &::= x\mid \lambda x:\tau.e\mid e_1\ e_2\end{aligned}" />

      <NoteSectionTitle id="type-checking-and-type-inference">29. Type Checking and Type Inference</NoteSectionTitle>
      <NoteParagraph>
        Type checking verifies a program against known type annotations. Type inference discovers types with little or no annotation. Inference is harder
        because the checker must invent type variables and solve constraints.
      </NoteParagraph>
      <NoteTable
        headers={['task', 'input', 'output']}
        rows={[
          ['type checking', 'Expression plus expected annotations.', 'Accept or reject, sometimes producing a type.'],
          ['type inference', 'Expression with missing types.', 'A type, constraints, or an error.'],
          ['constraint generation', 'Expression and context.', 'Provisional type plus type equations.'],
          ['unification', 'Type equations.', 'Most general substitution or failure.'],
        ]}
      />

      <NoteSectionTitle id="type-safety-progress-and-preservation">30. Type Safety: Progress and Preservation</NoteSectionTitle>
      <NoteParagraph>
        Type safety is the formal guarantee that well-typed programs do not get stuck. It is usually proved with two theorems: progress and preservation.
      </NoteParagraph>
      <NoteTable
        headers={['theorem', 'meaning']}
        rows={[
          ['progress', 'A well-typed closed expression is either a value or can take a step.'],
          ['preservation', 'If a well-typed expression steps, the resulting expression has the same type.'],
          ['type safety', 'Together, progress and preservation rule out stuck states for well-typed closed programs.'],
        ]}
      />

      <NoteSectionTitle id="hindley-milner-light">31. Hindley-Milner Light</NoteSectionTitle>
      <NoteParagraph>
        Hindley-Milner-style inference supports parametric polymorphism and principal types. A lightweight version uses monotypes, type schemes,
        constraints, instantiation, unification, and top-level generalization.
      </NoteParagraph>
      <NoteTable
        headers={['term', 'meaning']}
        rows={[
          ['monotype', 'A type with no universal quantifier. It may still contain type variables.'],
          ['monomorphic type', 'A monotype with no type variables, such as int.'],
          ['type scheme', 'A type possibly quantified over type variables.'],
          ['polymorphic type', 'A closed type scheme such as forall alpha. alpha -> alpha.'],
          ['instantiation', 'Replace quantified variables with fresh type variables at each use.'],
        ]}
      />

      <NoteSectionTitle id="constraint-based-type-inference">32. Constraint-Based Type Inference</NoteSectionTitle>
      <NoteParagraph>
        Constraint-based inference assigns provisional types while collecting equations that must hold for the expression to be well typed.
      </NoteParagraph>
      <NoteTable
        headers={['notation', 'reading']}
        rows={[
          [<InlineMath math={'\\Gamma \\vdash e : \\tau \\dashv C'} />, 'Expression e has provisional type tau under constraints C.'],
          [<InlineMath math={'\\tau_1 \\doteq \\tau_2'} />, 'The two types must become equal.'],
          [<InlineMath math={'\\alpha'} />, 'A fresh type variable when the type is not known yet.'],
        ]}
      />
      <InferenceRule
        name="app-infer"
        premises={[
          <InlineMath key="p1" math={'\\Gamma \\vdash e_1 : \\tau_1 \\dashv C_1'} />,
          <InlineMath key="p2" math={'\\Gamma \\vdash e_2 : \\tau_2 \\dashv C_2'} />,
          <InlineMath key="p3" math={'\\alpha\\ fresh'} />,
        ]}
        conclusion={<InlineMath math={'\\Gamma \\vdash e_1\\ e_2 : \\alpha \\dashv \\tau_1 \\doteq \\tau_2 \\to \\alpha, C_1, C_2'} />}
      />

      <NoteSectionTitle id="unification">33. Unification</NoteSectionTitle>
      <NoteParagraph>
        Unification solves equations over type expressions. A unifier is a substitution that makes every equation true. The most general unifier, or MGU,
        is the least-specific solution.
      </NoteParagraph>
      <UnificationExplorer />
      <UnificationRunner />
      <NoteParagraph>
        The occurs check prevents infinite types. For example, self-application can generate a constraint like <InlineMath math={'\\alpha \\doteq \\alpha \\to \\beta'} />,
        which has no finite solution.
      </NoteParagraph>

      <NoteSectionTitle id="principal-types-and-specialization">34. Principal Types and Specialization</NoteSectionTitle>
      <NoteParagraph>
        A principal type is the most general type for an expression. Every other valid type should be a specialization of it, meaning it can be obtained by
        replacing quantified variables with more specific types.
      </NoteParagraph>
      <NoteTable
        headers={['principal type', 'specializations']}
        rows={[
          [<InlineMath math={'\\forall\\alpha.\\alpha \\to \\alpha'} />, <><InlineMath math={'int \\to int'} />, <br /><InlineMath math={'bool \\to bool'} />, <br /><InlineMath math={'(int \\to bool) \\to (int \\to bool)'} /></>],
        ]}
      />
      <NoteParagraph>
        A top-level inference pipeline generates constraints, unifies them, applies the MGU, generalizes remaining free type variables, and extends the
        context with the resulting type scheme.
      </NoteParagraph>

      <NoteSectionTitle id="bytecode-interpreters">35. Bytecode Interpreters</NoteSectionTitle>
      <NoteParagraph>
        A virtual machine is a computational abstraction. A bytecode interpreter executes lower-level commands, often represented compactly as bytes.
        Stack machines are a common simple model because most operations consume and produce values on a stack.
      </NoteParagraph>
      <NoteTable
        headers={['reason', 'meaning']}
        rows={[
          ['simplicity', 'Stack commands are easy to define and implement.'],
          ['portability', 'The same bytecode stream can be interpreted on different systems.'],
          ['implementation bridge', 'Bytecode is lower level than source syntax but higher level than native machine code.'],
        ]}
      />

      <NoteSectionTitle id="stack-machines-and-compilation">36. Stack Machines and Compilation</NoteSectionTitle>
      <NoteParagraph>
        A stack-machine configuration contains a stack and remaining program. With variables, it also contains an environment. Compilation translates
        source expressions into stack commands while preserving behavior.
      </NoteParagraph>
      <StackMachineExplorer />
      <NoteTable
        headers={['source expression', 'stack code pattern']}
        rows={[
          [<code>n</code>, <code>PUSH n</code>],
          [<code>e1 + e2</code>, <code>compile e2; compile e1; ADD</code>],
          [<code>e1 - e2</code>, <code>compile e2; compile e1; SUB</code>],
          [<code>x</code>, <code>LOOKUP x</code>],
        ]}
      />
      <NoteParagraph>
        The operand order matters because the top of stack is written first and arithmetic commands pop operands according to the machine rule.
      </NoteParagraph>

    </NotesLayout>
  );
}
