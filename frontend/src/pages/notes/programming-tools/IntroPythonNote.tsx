/**
 * Intro Python Foundations Notes Page
 * A standalone programming foundations note for Python.
 */

import { useMemo, useState, type ReactNode } from 'react';
import { NotesLayout } from '../../../components/notes/NotesLayout';
import {
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

type TableRow = ReactNode[];

function usePythonTheme() {
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
  const axisColor = isDarkMode ? '#86efac66' : '#94a3b8';
  const textColor = isDarkMode ? '#bbf7d0' : '#334155';

  return {
    isDarkMode,
    subtlePanelClass,
    listClass,
    tableClass,
    tableHeadClass,
    tableCellClass,
    primaryColor,
    secondaryColor,
    axisColor,
    textColor,
  };
}

function BulletList({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { listClass } = usePythonTheme();
  return <ul className={`${listClass} ${className}`}>{children}</ul>;
}

function NoteTable({ headers, rows }: { headers: ReactNode[]; rows: TableRow[] }) {
  const { tableClass, tableHeadClass, tableCellClass } = usePythonTheme();

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

function PythonNotationGuide() {
  return (
    <NoteTopicGroup>
      <NoteTopicBlock title="Notation Used Throughout">
        <BulletList className="mb-0">
          <li><code>#</code> starts a Python comment.</li>
          <li><code>=</code> assigns a value to a name; <code>==</code> checks equality.</li>
          <li><code>:</code> starts an indented block after <code>if</code>, <code>for</code>, <code>while</code>, <code>def</code>, and similar headers.</li>
          <li><code>[]</code> indexes into sequences such as strings and lists.</li>
          <li><code>len(x)</code> returns the length of a string, list, tuple, dictionary, or other sized object.</li>
          <li><code>None</code> means "no value" or "nothing returned."</li>
          <li><InlineMath math="O(f(n))" /> describes how an algorithm's work grows as input size <InlineMath math="n" /> grows.</li>
        </BulletList>
      </NoteTopicBlock>
    </NoteTopicGroup>
  );
}

function ExpressionExplorer() {
  const { subtlePanelClass, primaryColor, secondaryColor } = usePythonTheme();
  const [x, setX] = useState(4);
  const [y, setY] = useState(3);
  const value = x + y * 2;

  return (
    <InteractiveBlock title="Expression Evaluation">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="expr-x">
            <span><code>x</code></span>
            <span>{x}</span>
          </label>
          <input id="expr-x" type="range" min="0" max="10" value={x} onChange={(event) => setX(Number(event.target.value))} className="mb-4 w-full" />
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="expr-y">
            <span><code>y</code></span>
            <span>{y}</span>
          </label>
          <input id="expr-y" type="range" min="0" max="10" value={y} onChange={(event) => setY(Number(event.target.value))} className="w-full" />
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <CodeBlock
            language="python"
            code={`x = ${x}
y = ${y}
result = x + y * 2`}
            className="mb-4"
          />
          <div className="grid gap-3 text-sm sm:grid-cols-3">
            <div className="rounded-md border border-current/20 p-3">
              <div className="text-xs uppercase opacity-70">First</div>
              <div className="font-bold"><code>y * 2 = {y * 2}</code></div>
            </div>
            <div className="rounded-md border border-current/20 p-3">
              <div className="text-xs uppercase opacity-70">Then</div>
              <div className="font-bold"><code>x + {y * 2}</code></div>
            </div>
            <div className="rounded-md border border-current/20 p-3">
              <div className="text-xs uppercase opacity-70">Result</div>
              <div className="font-bold" style={{ color: value >= 15 ? secondaryColor : primaryColor }}>{value}</div>
            </div>
          </div>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function BranchExplorer() {
  const { subtlePanelClass, primaryColor, secondaryColor } = usePythonTheme();
  const [score, setScore] = useState(84);
  const letter = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F';
  const branch = score >= 90 ? 'score >= 90' : score >= 80 ? 'score >= 80' : score >= 70 ? 'score >= 70' : score >= 60 ? 'score >= 60' : 'else';

  return (
    <InteractiveBlock title="Branch Selection">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="branch-score">
            <span><code>score</code></span>
            <span>{score}</span>
          </label>
          <input id="branch-score" type="range" min="0" max="100" value={score} onChange={(event) => setScore(Number(event.target.value))} className="w-full" />
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <CodeBlock
            language="python"
            code={`if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
elif score >= 60:
    grade = "D"
else:
    grade = "F"`}
            className="mb-4"
          />
          <NoteParagraph className="mb-0 text-sm">
            Python checks from top to bottom. The first true condition is <strong style={{ color: secondaryColor }}>{branch}</strong>, so{' '}
            <code style={{ color: primaryColor }}>grade = "{letter}"</code>.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function LoopTraceExplorer() {
  const { isDarkMode, subtlePanelClass, primaryColor } = usePythonTheme();
  const [n, setN] = useState(5);
  const steps = useMemo(() => Array.from({ length: n }, (_, i) => ({ i, total: (i * (i + 1)) / 2 })), [n]);

  return (
    <InteractiveBlock title="Loop Trace">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="loop-n">
            <span><code>n</code></span>
            <span>{n}</span>
          </label>
          <input id="loop-n" type="range" min="1" max="10" value={n} onChange={(event) => setN(Number(event.target.value))} className="mb-4 w-full" />
          <CodeBlock
            language="python"
            code={`total = 0

for i in range(n):
    total += i`}
            className="mb-0"
          />
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {steps.map((step) => (
              <div key={step.i} className="rounded-md border border-current/20 p-3 text-center">
                <div className="text-xs uppercase opacity-70">i</div>
                <div className="text-lg font-bold">{step.i}</div>
                <div className="mt-1 text-xs opacity-80">total = {step.total}</div>
              </div>
            ))}
          </div>
          <div className={`h-4 rounded ${isDarkMode ? 'bg-black/40' : 'bg-slate-200'}`}>
            <div className="h-4 rounded" style={{ width: `${n * 10}%`, backgroundColor: primaryColor }} />
          </div>
          <NoteParagraph className="mb-0 mt-4 text-sm">
            <code>range(n)</code> produces <code>0</code> through <code>n - 1</code>. That is exactly <code>n</code> loop iterations.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function ListMutationExplorer() {
  const { isDarkMode, subtlePanelClass, primaryColor, secondaryColor } = usePythonTheme();
  const [operation, setOperation] = useState<'append' | 'pop' | 'assign' | 'slice'>('append');
  const before = [10, 20, 30];
  const after =
    operation === 'append'
      ? [10, 20, 30, 40]
      : operation === 'pop'
        ? [10, 20]
        : operation === 'assign'
          ? [10, 99, 30]
          : [10, 20];
  const code =
    operation === 'append'
      ? 'nums.append(40)'
      : operation === 'pop'
        ? 'last = nums.pop()'
        : operation === 'assign'
          ? 'nums[1] = 99'
          : 'part = nums[0:2]';

  return (
    <InteractiveBlock title="List Operations">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <div className="mb-4 flex flex-wrap gap-2">
            {[
              { label: 'append', value: 'append' as const },
              { label: 'pop', value: 'pop' as const },
              { label: 'assign', value: 'assign' as const },
              { label: 'slice', value: 'slice' as const },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setOperation(option.value)}
                className={`rounded-md px-3 py-2 text-sm font-bold transition ${
                  operation === option.value
                    ? isDarkMode
                      ? 'bg-green-400 text-black'
                      : 'bg-blue-600 text-white'
                    : isDarkMode
                      ? 'bg-slate-800 text-green-100'
                      : 'bg-slate-200 text-slate-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <CodeBlock language="python" code={`nums = [10, 20, 30]\n${code}`} className="mb-0" />
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <div className="mb-5">
            <div className="mb-2 text-xs uppercase opacity-70">Before</div>
            <div className="flex gap-2">
              {before.map((value, index) => (
                <div key={`before-${index}`} className="rounded-md border border-current/20 p-3 text-center">
                  <div className="text-xs opacity-70">[{index}]</div>
                  <div className="font-bold">{value}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-2 text-xs uppercase opacity-70">{operation === 'slice' ? 'Slice result' : 'After'}</div>
            <div className="flex gap-2">
              {after.map((value, index) => (
                <div key={`after-${index}`} className="rounded-md border border-current/20 p-3 text-center">
                  <div className="text-xs opacity-70">[{index}]</div>
                  <div className="font-bold" style={{ color: value === 99 || value === 40 ? secondaryColor : primaryColor }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function DictionaryLookupExplorer() {
  const { isDarkMode, subtlePanelClass, primaryColor, secondaryColor, axisColor, textColor } = usePythonTheme();
  const [keyName, setKeyName] = useState<'Ada' | 'Grace' | 'Linus'>('Ada');
  const values = { Ada: 98, Grace: 95, Linus: 91 };

  return (
    <InteractiveBlock title="Dictionary Lookup">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <div className="mb-4 flex flex-wrap gap-2">
            {(['Ada', 'Grace', 'Linus'] as const).map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setKeyName(name)}
                className={`rounded-md px-3 py-2 text-sm font-bold transition ${
                  keyName === name
                    ? isDarkMode
                      ? 'bg-green-400 text-black'
                      : 'bg-blue-600 text-white'
                    : isDarkMode
                      ? 'bg-slate-800 text-green-100'
                      : 'bg-slate-200 text-slate-700'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
          <CodeBlock language="python" code={`scores = {"Ada": 98, "Grace": 95, "Linus": 91}
score = scores["${keyName}"]`} className="mb-0" />
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <svg viewBox="0 0 520 210" className="h-56 w-full" role="img" aria-label="Dictionary keys mapping to values">
            {Object.entries(values).map(([name, score], index) => {
              const y = 45 + index * 55;
              const active = name === keyName;
              return (
                <g key={name}>
                  <rect x="45" y={y - 24} width="140" height="38" rx="6" fill={active ? secondaryColor : primaryColor} fillOpacity="0.14" stroke={active ? secondaryColor : axisColor} strokeWidth="2" />
                  <text x="115" y={y} textAnchor="middle" fontFamily="monospace" fontSize="14" fill={textColor}>{name}</text>
                  <line x1="185" y1={y - 5} x2="330" y2={y - 5} stroke={active ? secondaryColor : axisColor} strokeWidth="2" />
                  <rect x="330" y={y - 24} width="110" height="38" rx="6" fill={active ? secondaryColor : primaryColor} fillOpacity="0.14" stroke={active ? secondaryColor : axisColor} strokeWidth="2" />
                  <text x="385" y={y} textAnchor="middle" fontFamily="monospace" fontSize="14" fontWeight={active ? '700' : '400'} fill={textColor}>{score}</text>
                </g>
              );
            })}
          </svg>
          <NoteParagraph className="mb-0 text-sm">
            The key <code>"{keyName}"</code> maps directly to <code>{values[keyName]}</code>. Dictionaries optimize lookup by key rather than by position.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

export default function IntroPythonNote() {
  return (
    <NotesLayout>
      <NoteHeader
        title="Intro Python Foundations"
        subtitle="Build the programming basics that later Java, data structures, and algorithms assume."
      />

      <PythonNotationGuide />

      <NoteSectionTitle id="programming-basics">1. Programming Basics</NoteSectionTitle>
      <NoteParagraph>
        Programming turns a problem into precise steps a computer can execute. A program usually reads or defines input values, performs operations on those values, and produces output.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Basic Program Structure">
          <BulletList className="mb-0">
            <li>Inputs are the values the program starts with.</li>
            <li>Operations transform or compare those values.</li>
            <li>Control flow decides which operations run and how many times.</li>
            <li>Outputs are printed, returned, stored, or used by later code.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="python-program-basics">2. Python Program Basics</NoteSectionTitle>
      <NoteParagraph>
        Python programs are executed from top to bottom. Blocks are created by indentation, so indentation is part of the program's meaning.
      </NoteParagraph>
      <CodeBlock
        language="python"
        code={`# A small Python program
name = "Ada"
print("Hello,", name)`}
      />
      <NoteParagraph>
        Python does not require every program to be inside a class. That makes it useful for learning the basic execution model before moving to a
        more structured language.
      </NoteParagraph>

      <NoteSectionTitle id="values-types-and-variables">3. Values, Types, and Variables</NoteSectionTitle>
      <NoteParagraph>
        A value is a piece of data. A type describes what kind of value it is. A variable is a name that refers to a value.
      </NoteParagraph>
      <NoteTable
        headers={['Type', 'Examples', 'Meaning']}
        rows={[
          [<code>int</code>, <code>3, -10, 0</code>, 'whole numbers'],
          [<code>float</code>, <code>2.5, 0.01</code>, 'decimal approximations'],
          [<code>bool</code>, <code>True, False</code>, 'truth values'],
          [<code>str</code>, <code>"hello"</code>, 'text'],
          [<code>NoneType</code>, <code>None</code>, 'absence of a value'],
        ]}
      />
      <CodeBlock
        language="python"
        code={`count = 0
average = 92.5
is_valid = True
message = "hello"`}
      />

      <NoteSectionTitle id="expressions-and-operators">4. Expressions and Operators</NoteSectionTitle>
      <NoteParagraph>
        An expression is code that evaluates to a value. Operators combine values, and precedence controls what is evaluated first.
      </NoteParagraph>
      <NoteTable
        headers={['Operator', 'Meaning']}
        rows={[
          [<code>+</code>, 'addition or string/list concatenation'],
          [<code>-</code>, 'subtraction'],
          [<code>*</code>, 'multiplication'],
          [<code>/</code>, 'floating-point division'],
          [<code>//</code>, 'floor division'],
          [<code>%</code>, 'remainder'],
          [<code>**</code>, 'exponentiation'],
        ]}
      />
      <ExpressionExplorer />

      <NoteSectionTitle id="input-output-and-conversion">5. Input, Output, and Conversion</NoteSectionTitle>
      <NoteParagraph>
        <code>print</code> sends output to the console. <code>input</code> reads text from the user and always returns a string, so numeric input
        must be converted before arithmetic.
      </NoteParagraph>
      <CodeBlock
        language="python"
        code={`age_text = input("Age: ")
age = int(age_text)
print("Next year:", age + 1)`}
      />
      <NoteParagraph>
        Type conversion functions such as <code>int</code>, <code>float</code>, and <code>str</code> create a value of the requested type when the
        input can be interpreted that way.
      </NoteParagraph>

      <NoteSectionTitle id="strings-and-indexing">6. Strings and Indexing</NoteSectionTitle>
      <NoteParagraph>
        A string is an ordered sequence of characters. Python uses zero-based indexing, so the first character is at index <code>0</code>.
      </NoteParagraph>
      <CodeBlock
        language="python"
        code={`word = "python"

first = word[0]      # "p"
last = word[-1]      # "n"
middle = word[1:4]   # "yth"`}
      />
      <NoteTable
        headers={['Operation', 'Meaning']}
        rows={[
          [<code>s[i]</code>, 'character at index i'],
          [<code>s[a:b]</code>, 'substring from a up to but not including b'],
          [<code>s.lower()</code>, 'lowercase copy'],
          [<code>s.strip()</code>, 'copy with surrounding whitespace removed'],
          [<code>s.find(part)</code>, 'first index where part appears, or -1'],
        ]}
      />

      <NoteSectionTitle id="boolean-logic-and-conditionals">7. Boolean Logic and Conditionals</NoteSectionTitle>
      <NoteParagraph>
        A Boolean expression evaluates to <code>True</code> or <code>False</code>. Conditionals use those truth values to choose which block runs.
      </NoteParagraph>
      <NoteTable
        headers={['Operator', 'Meaning']}
        rows={[
          [<code>==</code>, 'equal'],
          [<code>!=</code>, 'not equal'],
          [<code>&lt;</code>, 'less than'],
          [<code>&lt;=</code>, 'less than or equal'],
          [<code>and</code>, 'both conditions must be true'],
          [<code>or</code>, 'at least one condition must be true'],
          [<code>not</code>, 'negates a condition'],
        ]}
      />
      <BranchExplorer />

      <NoteSectionTitle id="loops-and-iteration">8. Loops and Iteration</NoteSectionTitle>
      <NoteParagraph>
        Loops repeat code. A <code>for</code> loop is best when iterating over a known sequence. A <code>while</code> loop is best when repetition
        depends on a condition becoming false.
      </NoteParagraph>
      <CodeBlock
        language="python"
        code={`for i in range(5):
    print(i)

while password != "secret":
    password = input("Try again: ")`}
      />
      <LoopTraceExplorer />

      <NoteSectionTitle id="functions-and-decomposition">9. Functions and Decomposition</NoteSectionTitle>
      <NoteParagraph>
        A function is a named reusable block of code. Functions help divide a program into smaller pieces, make tests easier, and hide details
        behind a clear interface.
      </NoteParagraph>
      <CodeBlock
        language="python"
        code={`def average(a, b):
    return (a + b) / 2

result = average(10, 20)`}
      />
      <NoteTable
        headers={['Term', 'Meaning']}
        rows={[
          ['Parameter', 'name in the function definition'],
          ['Argument', 'actual value passed during a call'],
          [<code>return</code>, 'sends a result back to the caller'],
          [<code>None</code>, 'default result when no value is returned'],
        ]}
      />

      <NoteSectionTitle id="scope-and-mutability">10. Scope and Mutability</NoteSectionTitle>
      <NoteParagraph>
        Scope is where a name can be used. Local variables created inside a function belong to that call. Mutability describes whether an object can
        be changed in place.
      </NoteParagraph>
      <NoteTable
        headers={['Object type', 'Mutable?']}
        rows={[
          [<code>int, float, bool, str, tuple</code>, 'immutable'],
          [<code>list, dict, set</code>, 'mutable'],
        ]}
      />
      <CodeBlock
        language="python"
        code={`def add_one(nums):
    nums.append(1)

values = [10, 20]
add_one(values)
print(values)  # [10, 20, 1]`}
      />

      <NoteSectionTitle id="lists-and-sequences">11. Lists and Sequences</NoteSectionTitle>
      <NoteParagraph>
        A list is an ordered mutable sequence. It stores multiple values under one name and lets you access, update, append, remove, and slice by
        position.
      </NoteParagraph>
      <ListMutationExplorer />

      <NoteSectionTitle id="nested-lists-and-grids">12. Nested Lists and Grids</NoteSectionTitle>
      <NoteParagraph>
        A nested list is a list containing other lists. It is often used for grids, tables, matrices, boards, and image-like data.
      </NoteParagraph>
      <CodeBlock
        language="python"
        code={`grid = [
    [1, 2, 3],
    [4, 5, 6],
]

for row in grid:
    for value in row:
        print(value)`}
      />
      <NoteParagraph>
        Nested loops usually mean the amount of work depends on both dimensions. A loop over every cell in an <InlineMath math="r\times c" /> grid
        does <InlineMath math="O(rc)" /> work.
      </NoteParagraph>

      <NoteSectionTitle id="tuples-sets-and-dictionaries">13. Tuples, Sets, and Dictionaries</NoteSectionTitle>
      <NoteParagraph>
        Python has several built-in collection types. Use the one that matches the question you need to answer.
      </NoteParagraph>
      <NoteTable
        headers={['Type', 'Use when']}
        rows={[
          [<code>tuple</code>, 'fixed ordered group of values'],
          [<code>set</code>, 'membership and uniqueness matter, order does not'],
          [<code>dict</code>, 'lookup by key matters'],
        ]}
      />
      <DictionaryLookupExplorer />

      <NoteSectionTitle id="files-and-exceptions">14. Files and Exceptions</NoteSectionTitle>
      <NoteParagraph>
        Files let a program read data from disk or write results for later. The <code>with</code> statement closes the file automatically.
      </NoteParagraph>
      <CodeBlock
        language="python"
        code={`with open("scores.txt", "r") as file:
    for line in file:
        score = int(line.strip())
        print(score)`}
      />
      <NoteParagraph>
        Exceptions are runtime errors represented as objects. Use <code>try</code> and <code>except</code> when failure is possible and recoverable,
        such as invalid user input.
      </NoteParagraph>
      <CodeBlock
        language="python"
        code={`try:
    age = int(input("Age: "))
except ValueError:
    print("Please enter a whole number.")`}
      />

      <NoteSectionTitle id="debugging-and-testing">15. Debugging and Testing</NoteSectionTitle>
      <NoteParagraph>
        Debugging is the process of finding why a program behaves differently from what you expected. Testing is the process of checking behavior
        against examples before and after changes.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Practical Debugging Loop">
          <BulletList className="mb-0">
            <li>Reproduce the bug with the smallest input you can.</li>
            <li>State what you expected and what actually happened.</li>
            <li>Inspect one variable or branch at a time.</li>
            <li>Fix the cause, not just the symptom.</li>
            <li>Add a test case that would have caught it.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="simple-algorithms-and-big-o">16. Simple Algorithms and Big-O</NoteSectionTitle>
      <NoteParagraph>
        An algorithm is a precise procedure for solving a problem. Big-O describes how the amount of work grows with the input size.
      </NoteParagraph>
      <NoteTable
        headers={['Pattern', 'Typical growth']}
        rows={[
          ['constant-time lookup by known index', <InlineMath math="O(1)" />],
          ['single loop over n items', <InlineMath math="O(n)" />],
          ['nested loop over all pairs', <InlineMath math="O(n^2)" />],
          ['binary search on sorted data', <InlineMath math="O(\log n)" />],
        ]}
      />
      <CodeBlock
        language="python"
        code={`def linear_search(values, target):
    for i in range(len(values)):
        if values[i] == target:
            return i
    return -1`}
      />

      <NoteSectionTitle id="program-design-foundations">17. Program Design Foundations</NoteSectionTitle>
      <NoteParagraph>
        Good programs are organized around clear names, small functions, explicit assumptions, and data structures that match the problem.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="What This Prepares You For">
          <BulletList className="mb-0">
            <li>Java's explicit types and class structure.</li>
            <li>Object references and mutation.</li>
            <li>Arrays, lists, stacks, queues, trees, and dictionaries.</li>
            <li>Recursive problem solving.</li>
            <li>Algorithm analysis and data structure tradeoffs.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>
    </NotesLayout>
  );
}
