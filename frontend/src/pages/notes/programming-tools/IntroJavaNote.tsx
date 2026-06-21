/**
 * Intro Computer Science Notes Page
 * A standalone Java, programming, algorithms, and data structures note.
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
import { HashTableChainingRunner, TreeTraversalRunner } from './ProgrammingToolAlgorithmRunners';

type TableRow = ReactNode[];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function useCSTheme() {
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
  const axisColor = isDarkMode ? '#86efac66' : '#94a3b8';
  const textColor = isDarkMode ? '#bbf7d0' : '#334155';
  const primaryColor = isDarkMode ? '#4ade80' : '#2563eb';
  const secondaryColor = isDarkMode ? '#fb923c' : '#ea580c';

  return {
    isDarkMode,
    subtlePanelClass,
    listClass,
    tableClass,
    tableHeadClass,
    tableCellClass,
    axisColor,
    textColor,
    primaryColor,
    secondaryColor,
  };
}

function BulletList({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { listClass } = useCSTheme();
  return <ul className={`${listClass} ${className}`}>{children}</ul>;
}

function NoteTable({ headers, rows }: { headers: ReactNode[]; rows: TableRow[] }) {
  const { tableClass, tableHeadClass, tableCellClass } = useCSTheme();

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

function JavaNotationGuide() {
  return (
    <NoteTopicGroup>
      <NoteTopicBlock title="Notation Used Throughout">
        <BulletList className="mb-0">
          <li><code>Type name = value;</code> declares a variable, gives it a type, and stores an initial value.</li>
          <li><code>new</code> creates an object or array on the heap and returns a reference to it.</li>
          <li><code>null</code> means a reference variable points to no object.</li>
          <li><code>.</code> accesses a field or calls a method through an object or class name.</li>
          <li><code>[]</code> accesses an array element, and Java array indices run from <code>0</code> to <code>length - 1</code>.</li>
          <li><code>public</code>, <code>private</code>, <code>static</code>, <code>void</code>, and <code>return</code> are Java keywords with specific roles.</li>
          <li><InlineMath math="O(f(n))" /> describes how runtime or space grows as input size <InlineMath math="n" /> grows.</li>
        </BulletList>
      </NoteTopicBlock>
    </NoteTopicGroup>
  );
}

function ReferenceExplorer() {
  const { isDarkMode, subtlePanelClass, primaryColor, secondaryColor, axisColor, textColor } = useCSTheme();
  const [alias, setAlias] = useState(true);
  const r1Width = alias ? 50 : 10;
  const r2Width = 50;
  const objectCount = alias ? 1 : 2;

  return (
    <InteractiveBlock title="References and Aliasing">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <div className="mb-4 flex gap-2">
            {[
              { label: 'Alias', value: true },
              { label: 'Separate', value: false },
            ].map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => setAlias(option.value)}
                className={`rounded-md px-3 py-2 text-sm font-bold transition ${
                  alias === option.value
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
          <CodeBlock
            language="java"
            code={
              alias
                ? `Rectangle r1 = new Rectangle(10, 20);
Rectangle r2 = r1;
r2.setWidth(50);`
                : `Rectangle r1 = new Rectangle(10, 20);
Rectangle r2 = new Rectangle(10, 20);
r2.setWidth(50);`
            }
            className="mb-0"
          />
        </div>

        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <svg viewBox="0 0 520 230" className="h-64 w-full" role="img" aria-label="Stack references pointing to heap objects">
            <text x="30" y="25" fontFamily="monospace" fontSize="14" fontWeight="700" fill={textColor}>Stack</text>
            <text x="320" y="25" fontFamily="monospace" fontSize="14" fontWeight="700" fill={textColor}>Heap</text>
            <rect x="25" y="45" width="150" height="55" rx="6" fill="none" stroke={axisColor} strokeWidth="2" />
            <rect x="25" y="120" width="150" height="55" rx="6" fill="none" stroke={axisColor} strokeWidth="2" />
            <text x="45" y="78" fontFamily="monospace" fontSize="14" fill={textColor}>r1</text>
            <text x="45" y="153" fontFamily="monospace" fontSize="14" fill={textColor}>r2</text>

            <rect x="330" y="55" width="150" height="70" rx="6" fill={primaryColor} fillOpacity="0.12" stroke={primaryColor} strokeWidth="2" />
            <text x="350" y="83" fontFamily="monospace" fontSize="13" fill={textColor}>Rectangle</text>
            <text x="350" y="105" fontFamily="monospace" fontSize="13" fill={textColor}>width = {r1Width}</text>

            <line x1="175" y1="72" x2="330" y2="88" stroke={primaryColor} strokeWidth="2.5" markerEnd="url(#java-reference-arrow-primary)" />
            <line x1="175" y1="148" x2={alias ? '330' : '330'} y2={alias ? '98' : '173'} stroke={secondaryColor} strokeWidth="2.5" markerEnd="url(#java-reference-arrow-secondary)" />

            {!alias && (
              <>
                <rect x="330" y="145" width="150" height="70" rx="6" fill={secondaryColor} fillOpacity="0.12" stroke={secondaryColor} strokeWidth="2" />
                <text x="350" y="173" fontFamily="monospace" fontSize="13" fill={textColor}>Rectangle</text>
                <text x="350" y="195" fontFamily="monospace" fontSize="13" fill={textColor}>width = {r2Width}</text>
              </>
            )}

            <defs>
              <marker id="java-reference-arrow-primary" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L9,3 z" fill={primaryColor} />
              </marker>
              <marker id="java-reference-arrow-secondary" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto" markerUnits="strokeWidth">
                <path d="M0,0 L0,6 L9,3 z" fill={secondaryColor} />
              </marker>
            </defs>
          </svg>
          <NoteParagraph className="mb-0 text-sm">
            {objectCount === 1
              ? 'Both variables store the same reference, so mutating through r2 changes the object r1 also sees.'
              : 'The variables point to different objects, so mutating r2 leaves the object referenced by r1 unchanged.'}
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function LoopTraceExplorer() {
  const { isDarkMode, subtlePanelClass, primaryColor } = useCSTheme();
  const [n, setN] = useState(6);
  const steps = useMemo(() => Array.from({ length: n }, (_, i) => ({ i, sumAfter: (i * (i + 1)) / 2 })), [n]);

  return (
    <InteractiveBlock title="Loop Trace">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="loop-n">
            <span>Limit <code>n</code></span>
            <span>{n}</span>
          </label>
          <input id="loop-n" type="range" min="2" max="10" value={n} onChange={(event) => setN(Number(event.target.value))} className="mb-4 w-full" />
          <CodeBlock
            language="java"
            code={`int sum = 0;

for (int i = 0; i < n; i++) {
    sum += i;
}`}
            className="mb-0"
          />
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {steps.map((step) => (
              <div key={step.i} className="rounded-md border border-current/20 p-3 text-center">
                <div className="text-xs uppercase opacity-70">i</div>
                <div className="text-lg font-bold">{step.i}</div>
                <div className="mt-1 text-xs opacity-80">sum = {step.sumAfter}</div>
              </div>
            ))}
          </div>
          <div className={`h-4 rounded ${isDarkMode ? 'bg-black/40' : 'bg-slate-200'}`}>
            <div className="h-4 rounded" style={{ width: `${clamp((n / 10) * 100, 0, 100)}%`, backgroundColor: primaryColor }} />
          </div>
          <NoteParagraph className="mb-0 mt-4 text-sm">
            The body runs once for each value <code>i = 0</code> through <code>i = n - 1</code>. That is <code>n</code> iterations, so this loop is linear.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function BigOExplorer() {
  const { isDarkMode, subtlePanelClass, primaryColor, secondaryColor } = useCSTheme();
  const [n, setN] = useState(20);
  const rows = [
    { name: 'O(1)', value: 1 },
    { name: 'O(log n)', value: Math.log2(n) },
    { name: 'O(n)', value: n },
    { name: 'O(n log n)', value: n * Math.log2(n) },
    { name: 'O(n^2)', value: n * n },
  ];
  const max = rows[rows.length - 1].value;

  return (
    <InteractiveBlock title="Growth Rate Comparison">
      <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
        <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="big-o-n">
          <span>Input size <InlineMath math="n" /></span>
          <span>{n}</span>
        </label>
        <input id="big-o-n" type="range" min="5" max="100" value={n} onChange={(event) => setN(Number(event.target.value))} className="mb-6 w-full" />
        <div className="space-y-3">
          {rows.map((row, index) => (
            <div key={row.name} className="grid grid-cols-[90px_1fr_90px] items-center gap-3 text-sm">
              <span className="font-bold">{row.name}</span>
              <div className={`h-4 rounded ${isDarkMode ? 'bg-black/40' : 'bg-slate-200'}`}>
                <div
                  className="h-4 rounded"
                  style={{
                    width: `${Math.max(2, (row.value / max) * 100)}%`,
                    backgroundColor: index >= 3 ? secondaryColor : primaryColor,
                  }}
                />
              </div>
              <span className="text-right">{Math.round(row.value)}</span>
            </div>
          ))}
        </div>
      </div>
    </InteractiveBlock>
  );
}

function TreeTraversalExplorer() {
  const { isDarkMode, subtlePanelClass, primaryColor, secondaryColor, axisColor, textColor } = useCSTheme();
  const [mode, setMode] = useState<'preorder' | 'inorder' | 'postorder' | 'level'>('inorder');
  const orders = {
    preorder: ['F', 'B', 'A', 'D', 'C', 'E', 'G'],
    inorder: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    postorder: ['A', 'C', 'E', 'D', 'B', 'G', 'F'],
    level: ['F', 'B', 'G', 'A', 'D', 'C', 'E'],
  };
  const nodes = [
    { label: 'F', x: 260, y: 35 },
    { label: 'B', x: 160, y: 95 },
    { label: 'G', x: 360, y: 95 },
    { label: 'A', x: 100, y: 155 },
    { label: 'D', x: 210, y: 155 },
    { label: 'C', x: 175, y: 215 },
    { label: 'E', x: 245, y: 215 },
  ];
  const edges = [
    ['F', 'B'],
    ['F', 'G'],
    ['B', 'A'],
    ['B', 'D'],
    ['D', 'C'],
    ['D', 'E'],
  ];
  const byLabel = Object.fromEntries(nodes.map((node) => [node.label, node]));

  return (
    <InteractiveBlock title="Tree Traversal Order">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <div className="mb-4 flex flex-wrap gap-2">
            {[
              { label: 'Preorder', value: 'preorder' as const },
              { label: 'Inorder', value: 'inorder' as const },
              { label: 'Postorder', value: 'postorder' as const },
              { label: 'Level', value: 'level' as const },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setMode(option.value)}
                className={`rounded-md px-3 py-2 text-sm font-bold transition ${
                  mode === option.value
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
          <NoteParagraph className="mb-0 text-sm">
            Visit order: <strong>{orders[mode].join(' -> ')}</strong>
          </NoteParagraph>
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <svg viewBox="0 0 520 250" className="h-72 w-full" role="img" aria-label="Binary tree traversal example">
            {edges.map(([from, to]) => (
              <line key={`${from}-${to}`} x1={byLabel[from].x} y1={byLabel[from].y} x2={byLabel[to].x} y2={byLabel[to].y} stroke={axisColor} strokeWidth="2" />
            ))}
            {nodes.map((node) => {
              const orderIndex = orders[mode].indexOf(node.label);
              return (
                <g key={node.label}>
                  <circle cx={node.x} cy={node.y} r="20" fill={orderIndex < 3 ? secondaryColor : primaryColor} fillOpacity="0.18" stroke={orderIndex < 3 ? secondaryColor : primaryColor} strokeWidth="2" />
                  <text x={node.x} y={node.y + 5} textAnchor="middle" fontFamily="monospace" fontSize="15" fontWeight="700" fill={textColor}>
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </InteractiveBlock>
  );
}

export default function IntroJavaNote() {
  return (
    <NotesLayout>
      <NoteHeader
        title="Intro Computer Science with Java"
        subtitle="Learn Java syntax, memory, objects, recursion, algorithms, and core data structures."
      />

      <JavaNotationGuide />

      <NoteSectionTitle id="python-to-java-overview">1. Python to Java Overview</NoteSectionTitle>
      <NoteParagraph>
        Java is more explicit than Python. A Java program lives inside a class, starts from <code>main</code>, declares types before variables, uses
        braces for blocks, and ends most statements with semicolons.
      </NoteParagraph>
      <CodeBlock
        language="java"
        code={`public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("hello!");
    }
}`}
      />
      <NoteTable
        headers={['Idea', 'Python', 'Java']}
        rows={[
          ['Typing', 'dynamic', 'static, with explicit declared types'],
          ['Blocks', 'indentation', 'braces'],
          ['Program shape', 'script or functions', 'classes and methods'],
          ['Entry point', 'top-level code can run', <code>public static void main(String[] args)</code>],
        ]}
      />

      <NoteSectionTitle id="input-output-and-variables">2. Input, Output, and Variables</NoteSectionTitle>
      <NoteParagraph>
        A variable is a named place to store a value. In Java, every variable has a type, and assignment evaluates the right side first before
        storing the result into the left side.
      </NoteParagraph>
      <CodeBlock
        language="java"
        code={`import java.util.*;

public class InputExample {
    public static void main(String[] args) {
        Scanner scan = new Scanner(System.in);
        System.out.print("Enter an integer: ");
        int num = scan.nextInt();
        System.out.println("You entered " + num);
    }
}`}
      />
      <NoteTable
        headers={['Type or method', 'Meaning']}
        rows={[
          [<code>int</code>, 'integer value'],
          [<code>double</code>, 'floating-point decimal value'],
          [<code>boolean</code>, <span><code>true</code> or <code>false</code></span>],
          [<code>char</code>, 'single character'],
          [<code>String</code>, 'sequence of characters; an object, not a primitive'],
          [<code>nextInt()</code>, 'read the next integer token from a Scanner'],
          [<code>nextLine()</code>, 'read the rest of the current input line'],
        ]}
      />

      <NoteSectionTitle id="java-memory-model">3. Java Memory Model</NoteSectionTitle>
      <NoteParagraph>
        Java separates primitive values from object references. Primitive variables store values directly. Reference variables store a reference to
        an object on the heap.
      </NoteParagraph>
      <NoteTable
        headers={['Memory area', 'Stores']}
        rows={[
          ['Stack', 'local variables, method call information, and references'],
          ['Heap', <span>objects and arrays created with <code>new</code></span>],
        ]}
      />
      <ReferenceExplorer />

      <NoteSectionTitle id="conditional-execution">4. Conditional Execution</NoteSectionTitle>
      <NoteParagraph>
        Flow of control is the order in which statements execute. Conditionals let the program choose a branch based on a Boolean expression.
      </NoteParagraph>
      <CodeBlock
        language="java"
        code={`if (score >= 90) {
    grade = 'A';
} else if (score >= 80) {
    grade = 'B';
} else {
    grade = 'C';
}`}
      />
      <NoteTopicGroup>
        <NoteTopicBlock title="Common Mistake">
          <NoteParagraph className="mb-0">
            Use <code>==</code> for primitive equality checks and <code>.equals(...)</code> for String content equality. A single <code>=</code> is assignment.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="switch-statements">5. Switch Statements</NoteSectionTitle>
      <NoteParagraph>
        A <code>switch</code> is useful when one expression is compared against many constant cases. Use <code>break</code> to stop fall-through into
        the next case.
      </NoteParagraph>
      <CodeBlock
        language="java"
        code={`switch (day) {
    case 1:
        System.out.println("Monday");
        break;
    case 2:
        System.out.println("Tuesday");
        break;
    default:
        System.out.println("Invalid day");
}`}
      />

      <NoteSectionTitle id="loops">6. Loops</NoteSectionTitle>
      <NoteParagraph>
        Loops repeat code. Most loops have initialization, a condition, a body, and an update that moves the loop toward termination.
      </NoteParagraph>
      <NoteTable
        headers={['Loop', 'Best use']}
        rows={[
          [<code>while</code>, 'repeat while a condition stays true; may run zero times'],
          [<code>do-while</code>, 'run the body at least once, then test'],
          [<code>for</code>, 'counted loops where initialization, condition, and update fit together'],
        ]}
      />
      <LoopTraceExplorer />

      <NoteSectionTitle id="scope-of-variables">7. Scope of Variables</NoteSectionTitle>
      <NoteParagraph>
        A variable's scope is the part of the program where the variable can be used. In Java, scope usually starts at the declaration and ends at
        the closing brace of the block.
      </NoteParagraph>
      <CodeBlock
        language="java"
        code={`if (score > 90) {
    int bonus = 5;
}

System.out.println(bonus); // error: bonus is out of scope`}
      />

      <NoteSectionTitle id="methods">8. Methods</NoteSectionTitle>
      <NoteParagraph>
        Java methods are functions that live inside classes. Methods turn repeated logic into named operations and help decompose a program into
        smaller testable pieces.
      </NoteParagraph>
      <CodeBlock
        language="java"
        code={`public static int square(int x) {
    return x * x;
}

int result = square(5);`}
      />
      <NoteTable
        headers={['Part', 'Meaning']}
        rows={[
          [<code>public</code>, 'access modifier'],
          [<code>static</code>, 'belongs to the class rather than an object'],
          [<code>int</code>, 'return type'],
          [<code>square</code>, 'method name'],
          [<code>int x</code>, 'parameter'],
        ]}
      />

      <NoteSectionTitle id="strings-and-java-api">9. Strings and the Java API</NoteSectionTitle>
      <NoteParagraph>
        A <code>String</code> is an immutable object. String methods return information or a new String; they do not mutate the original contents in
        place.
      </NoteParagraph>
      <NoteTable
        headers={['Method', 'Meaning']}
        rows={[
          [<code>s.length()</code>, 'number of characters'],
          [<code>s.charAt(i)</code>, 'character at zero-based index i'],
          [<code>s.substring(begin, end)</code>, 'substring from begin up to but not including end'],
          [<code>s.indexOf("x")</code>, 'first index of a substring, or -1'],
          [<code>s.equals(other)</code>, 'content equality'],
        ]}
      />

      <NoteSectionTitle id="arrays">10. Arrays</NoteSectionTitle>
      <NoteParagraph>
        An array is a fixed-size sequence of elements of the same type. Arrays are indexed from <code>0</code> to <code>length - 1</code>.
      </NoteParagraph>
      <CodeBlock
        language="java"
        code={`int[] values = {5, 10, 15, 20};

for (int i = 0; i < values.length; i++) {
    System.out.println(values[i]);
}`}
      />
      <NoteParagraph>
        Primitive arrays store primitive values in each cell. Object arrays store references, and the entries are initially <code>null</code> until
        objects are assigned.
      </NoteParagraph>

      <NoteSectionTitle id="classes-and-custom-data-types">11. Classes and Custom Data Types</NoteSectionTitle>
      <NoteParagraph>
        A class defines a new data type. It groups state, stored in instance variables, with behavior, implemented as methods. An object is one
        instance of that class.
      </NoteParagraph>
      <CodeBlock
        language="java"
        code={`public class Rectangle {
    private int width;
    private int height;

    public Rectangle(int w, int h) {
        width = w;
        height = h;
    }

    public int area() {
        return width * height;
    }
}`}
      />

      <NoteSectionTitle id="client-programs-and-encapsulation">12. Client Programs and Encapsulation</NoteSectionTitle>
      <NoteParagraph>
        A client program uses a class through its public API. Encapsulation keeps fields private so the object controls how its state changes.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Encapsulation Pattern">
          <BulletList className="mb-0">
            <li>Make instance variables <code>private</code>.</li>
            <li>Initialize objects through constructors.</li>
            <li>Expose safe operations through public methods.</li>
            <li>Preserve invariants, such as no negative width or invalid ID.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="bag-data-structure">13. Bag Data Structure</NoteSectionTitle>
      <NoteParagraph>
        A bag is an unordered collection. It cares which items are present and how many, but not their positions. This makes it a useful first ADT
        for practicing arrays, resizing, and implementation hiding.
      </NoteParagraph>
      <NoteTable
        headers={['Operation', 'Meaning']}
        rows={[
          [<code>add(item)</code>, 'put an item into the bag'],
          [<code>remove(item)</code>, 'remove one matching item if present'],
          [<code>contains(item)</code>, 'check membership'],
          [<code>size()</code>, 'return number of stored items'],
        ]}
      />

      <NoteSectionTitle id="inheritance">14. Inheritance</NoteSectionTitle>
      <NoteParagraph>
        Inheritance lets a subclass reuse and specialize behavior from a superclass. The core relationship is "is-a": a <code>Student</code> might
        be a kind of <code>Person</code>.
      </NoteParagraph>
      <CodeBlock
        language="java"
        code={`public class Student extends Person {
    private String id;

    public Student(String name, String id) {
        super(name);
        this.id = id;
    }
}`}
      />

      <NoteSectionTitle id="polymorphism">15. Polymorphism</NoteSectionTitle>
      <NoteParagraph>
        Polymorphism lets code work with a superclass or interface reference while the actual object decides which overridden method runs.
      </NoteParagraph>
      <CodeBlock
        language="java"
        code={`Shape s = new Circle(10);
double a = s.area(); // Circle's area method runs`}
      />
      <NoteParagraph>
        The reference type controls what methods the compiler allows. The object type controls which overridden implementation runs at runtime.
      </NoteParagraph>

      <NoteSectionTitle id="interfaces-and-iterators">16. Interfaces and Iterators</NoteSectionTitle>
      <NoteParagraph>
        An interface specifies behavior without committing to representation. A class implements the interface by providing the required methods.
      </NoteParagraph>
      <CodeBlock
        language="java"
        code={`public interface Stack<T> {
    void push(T item);
    T pop();
    T peek();
    boolean isEmpty();
}`}
      />
      <NoteParagraph>
        Iterators separate traversal from storage. Client code can loop over a collection without knowing whether it is array-backed, linked, or
        tree-based.
      </NoteParagraph>

      <NoteSectionTitle id="recursion">17. Recursion</NoteSectionTitle>
      <NoteParagraph>
        Recursion solves a problem by reducing it to a smaller version of the same problem. Every recursive method needs a base case and a recursive
        case that moves toward the base case.
      </NoteParagraph>
      <CodeBlock
        language="java"
        code={`public static int factorial(int n) {
    if (n == 0) {
        return 1;
    }
    return n * factorial(n - 1);
}`}
      />

      <NoteSectionTitle id="recursive-backtracking">18. Recursive Backtracking</NoteSectionTitle>
      <NoteParagraph>
        Backtracking explores choices recursively. It makes a choice, recurses, and undoes the choice when returning so another branch can be tried.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Backtracking Template">
          <BulletList className="mb-0">
            <li>If the partial solution is complete, record or print it.</li>
            <li>Otherwise, loop through possible next choices.</li>
            <li>Skip invalid choices early.</li>
            <li>Choose, recurse, then unchoose.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="big-o-and-algorithm-efficiency">19. Big-O and Algorithm Efficiency</NoteSectionTitle>
      <NoteParagraph>
        Big-O describes growth rate, not exact runtime. It asks how the number of steps grows as input size <InlineMath math="n" /> grows and keeps
        the dominant term.
      </NoteParagraph>
      <BigOExplorer />

      <NoteSectionTitle id="linked-lists">20. Linked Lists</NoteSectionTitle>
      <NoteParagraph>
        A linked list stores a sequence in nodes. Each node stores data plus a reference to the next node. The list itself stores a reference to the
        first node, often called <code>head</code>.
      </NoteParagraph>
      <CodeBlock
        language="java"
        code={`private class Node {
    Object item;
    Node next;
}

Node trav = head;
while (trav != null) {
    System.out.println(trav.item);
    trav = trav.next;
}`}
      />
      <NoteParagraph>
        Arrays store sequence through physical adjacency. Linked lists store sequence through references.
      </NoteParagraph>

      <NoteSectionTitle id="list-adt">21. List ADT</NoteSectionTitle>
      <NoteParagraph>
        A list is an ordered collection where position matters. The ADT describes operations like add, remove, get, replace, find, and size without
        requiring one representation.
      </NoteParagraph>
      <NoteTable
        headers={['Representation', 'Good at', 'Weak at']}
        rows={[
          ['Array-based list', <span><InlineMath math="O(1)" /> access by index</span>, 'middle insertion/deletion may shift many items'],
          ['Linked-list-based list', 'fast insertion/deletion once the node is known', <span><InlineMath math="O(n)" /> access by index</span>],
        ]}
      />

      <NoteSectionTitle id="stack-adt">22. Stack ADT</NoteSectionTitle>
      <NoteParagraph>
        A stack is Last In, First Out. The only active end is the top.
      </NoteParagraph>
      <NoteTable
        headers={['Operation', 'Meaning']}
        rows={[
          [<code>push</code>, 'add item to top'],
          [<code>pop</code>, 'remove and return top item'],
          [<code>peek</code>, 'inspect top item'],
          [<code>isEmpty</code>, 'check whether stack has no items'],
        ]}
      />
      <NoteParagraph>
        Stacks model method calls, undo history, expression evaluation, parentheses matching, depth-first search, and recursion.
      </NoteParagraph>

      <NoteSectionTitle id="queue-adt">23. Queue ADT</NoteSectionTitle>
      <NoteParagraph>
        A queue is First In, First Out. Items enter at the rear and leave from the front.
      </NoteParagraph>
      <NoteTable
        headers={['Implementation', 'Key idea']}
        rows={[
          ['Circular array queue', 'reuse array positions with front, rear, and item count'],
          ['Linked queue', 'keep front and rear references for O(1) insert and remove'],
        ]}
      />

      <NoteSectionTitle id="trees-and-binary-trees">24. Trees and Binary Trees</NoteSectionTitle>
      <NoteParagraph>
        A tree is a node structure with one root and parent-child relationships. A binary tree restricts each node to at most two children, usually
        called left and right.
      </NoteParagraph>
      <NoteTable
        headers={['Term', 'Meaning']}
        rows={[
          ['Root', 'top node'],
          ['Leaf', 'node with no children'],
          ['Depth', 'number of edges from root to node'],
          ['Height', 'maximum depth of the tree'],
          ['Path', 'sequence of edges from one node to another'],
        ]}
      />

      <NoteSectionTitle id="tree-traversals">25. Tree Traversals</NoteSectionTitle>
      <NoteParagraph>
        A traversal visits every node. Recursive traversals work naturally because a tree is either empty or a root with subtrees.
      </NoteParagraph>
      <TreeTraversalExplorer />
      <TreeTraversalRunner />

      <NoteSectionTitle id="binary-search-trees">26. Binary Search Trees</NoteSectionTitle>
      <NoteParagraph>
        A binary search tree stores ordered keys. For each node with key <code>k</code>, keys in the left subtree are less than <code>k</code>, and
        keys in the right subtree are greater than or equal to <code>k</code>.
      </NoteParagraph>
      <NoteParagraph>
        Search follows comparisons. Go left if the target is smaller, go right if larger, and stop when the key is found or the current reference is
        <code>null</code>.
      </NoteParagraph>

      <NoteSectionTitle id="balanced-search-trees-and-2-3-trees">27. Balanced Search Trees and 2-3 Trees</NoteSectionTitle>
      <NoteParagraph>
        A plain BST can degrade into a chain, giving linear-time search. Balanced search trees keep height proportional to <InlineMath math="\log n" />
        so search, insert, and delete stay efficient.
      </NoteParagraph>
      <NoteParagraph>
        A 2-3 tree allows nodes with one key and two children, or two keys and three children. When insertion overflows a node, the middle key is
        promoted and the split may propagate upward.
      </NoteParagraph>

      <NoteSectionTitle id="heaps">28. Heaps</NoteSectionTitle>
      <NoteParagraph>
        A heap is a complete binary tree with an ordering property. In a max-heap, every node is greater than or equal to its children, so the
        largest item is at the root.
      </NoteParagraph>
      <NoteTable
        headers={['Operation', 'Cost']}
        rows={[
          ['peek root', <InlineMath math="O(1)" />],
          ['insert', <InlineMath math="O(\log n)" />],
          ['remove root', <InlineMath math="O(\log n)" />],
        ]}
      />

      <NoteSectionTitle id="heap-implementation">29. Heap Implementation</NoteSectionTitle>
      <NoteParagraph>
        Because heaps are complete trees, they can be stored compactly in arrays. For zero-based index <code>i</code>, the child and parent formulas
        are mechanical.
      </NoteParagraph>
      <NoteTable
        headers={['Relationship', 'Index']}
        rows={[
          ['left child', <code>2 * i + 1</code>],
          ['right child', <code>2 * i + 2</code>],
          ['parent', <code>(i - 1) / 2</code>],
        ]}
      />
      <NoteParagraph>
        Insert uses sift up. Removal replaces the root with the last item and uses sift down to restore heap order.
      </NoteParagraph>

      <NoteSectionTitle id="priority-queues">30. Priority Queues</NoteSectionTitle>
      <NoteParagraph>
        A priority queue removes the most important item first. A heap is the standard implementation because the highest-priority item sits at the
        root.
      </NoteParagraph>
      <CodeBlock
        language="java"
        code={`public class PQItem implements Comparable<PQItem> {
    private Object data;
    private int priority;

    public int compareTo(PQItem other) {
        return this.priority - other.priority;
    }
}`}
      />

      <NoteSectionTitle id="hash-tables">31. Hash Tables</NoteSectionTitle>
      <NoteParagraph>
        A hash table maps a key to an array index using a hash function. With good hashing and controlled load factor, search, insertion, and
        deletion are average-case <InlineMath math="O(1)" />.
      </NoteParagraph>
      <NoteTable
        headers={['Concept', 'Meaning']}
        rows={[
          ['Hash function', 'converts a key into an integer'],
          ['Compression', 'maps the hash code into a table index'],
          ['Collision', 'two keys map to the same bucket'],
          ['Separate chaining', 'each bucket stores a list of entries'],
          ['Load factor', 'entries divided by bucket count'],
          ['Rehashing', 'grow the table and reinsert entries'],
        ]}
      />
      <HashTableChainingRunner />

      <NoteSectionTitle id="adts-and-design-principles">32. ADTs and Design Principles</NoteSectionTitle>
      <NoteParagraph>
        An Abstract Data Type defines behavior independently of implementation. The ADT says what operations mean. The data structure says how those
        operations are implemented.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Core Design Ideas">
          <BulletList className="mb-0">
            <li>Abstraction hides details behind useful operations.</li>
            <li>Encapsulation protects representation and invariants.</li>
            <li>Interfaces let code depend on behavior rather than concrete classes.</li>
            <li>Efficiency depends on representation and workload.</li>
            <li>Data structure choice is always a tradeoff among access, insertion, deletion, memory, and ordering.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>
    </NotesLayout>
  );
}
