/**
 * Computer Systems Notes Page
 * A standalone note for hardware/software systems, assembly, operating systems, memory, caches, and C.
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

type TableRow = ReactNode[];

const binary8 = (value: number) => value.toString(2).padStart(8, '0');
const hex8 = (value: number) => `0x${value.toString(16).padStart(2, '0').toUpperCase()}`;

function useSystemsTheme() {
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
  const { listClass } = useSystemsTheme();
  return <ul className={`${listClass} ${className}`}>{children}</ul>;
}

function NoteTable({ headers, rows }: { headers: ReactNode[]; rows: TableRow[] }) {
  const { tableClass, tableHeadClass, tableCellClass } = useSystemsTheme();

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

function SystemsNotationGuide() {
  return (
    <NoteTopicGroup>
      <NoteTopicBlock title="Notation Used Throughout">
        <BulletList className="mb-0">
          <li><code>0b...</code> denotes binary and <code>0x...</code> denotes hexadecimal.</li>
          <li><code>PC</code> is the program counter, the address of the next instruction.</li>
          <li><code>ISA</code> means instruction set architecture, the software/hardware contract.</li>
          <li><code>rsp</code> is the x86-64 stack pointer and <code>rbp</code> is commonly used as a frame pointer.</li>
          <li><code>&amp;x</code> is the address of <code>x</code> in C, and <code>*p</code> dereferences pointer <code>p</code>.</li>
          <li><code>VPN</code> and <code>PPN</code> mean virtual page number and physical page number.</li>
          <li><code>tag</code>, <code>index</code>, and <code>offset</code> are the cache address fields.</li>
          <li><InlineMath math="t_{PD}" /> is propagation delay, and <InlineMath math="t_{CD}" /> is contamination delay.</li>
        </BulletList>
      </NoteTopicBlock>
    </NoteTopicGroup>
  );
}

function SystemsStackDiagram() {
  const { subtlePanelClass, primaryColor, secondaryColor, axisColor, textColor } = useSystemsTheme();
  const layers = [
    'C source',
    'Compiler',
    'Assembly',
    'Assembler',
    'Object files',
    'Linker',
    'Executable',
    'OS loader',
    'Process',
    'CPU + memory',
  ];

  return (
    <div className={`mb-8 rounded-lg border p-4 ${subtlePanelClass}`}>
      <svg viewBox="0 0 560 380" className="h-[28rem] w-full" role="img" aria-label="Program translation and execution stack">
        {layers.map((layer, index) => {
          const y = 20 + index * 34;
          const active = index === 0 || index === layers.length - 1;
          return (
            <g key={layer}>
              <rect x="80" y={y} width="400" height="26" rx="6" fill={active ? secondaryColor : primaryColor} fillOpacity="0.12" stroke={active ? secondaryColor : axisColor} strokeWidth="1.5" />
              <text x="280" y={y + 18} textAnchor="middle" fontFamily="monospace" fontSize="13" fill={textColor}>{layer}</text>
              {index < layers.length - 1 && <line x1="280" y1={y + 26} x2="280" y2={y + 34} stroke={axisColor} strokeWidth="1.5" />}
            </g>
          );
        })}
      </svg>
      <NoteParagraph className="mb-0 text-sm">
        A program runs because each layer keeps a contract with the next one. Source text becomes instructions, the OS creates a process, and the
        CPU executes machine code while the memory hierarchy supplies bytes.
      </NoteParagraph>
    </div>
  );
}

function BitInterpretationExplorer() {
  const { subtlePanelClass } = useSystemsTheme();
  const [value, setValue] = useState(101);
  const unsigned = value;
  const signed = value >= 128 ? value - 256 : value;
  const ascii = value >= 32 && value <= 126 ? String.fromCharCode(value) : 'not printable';
  const highNibble = value >> 4;
  const lowNibble = value & 0xf;

  return (
    <InteractiveBlock title="Same Bits, Different Meaning">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="bit-value">
            <span>8-bit pattern</span>
            <span>{hex8(value)}</span>
          </label>
          <input id="bit-value" type="range" min="0" max="255" value={value} onChange={(event) => setValue(Number(event.target.value))} className="w-full" />
          <div className="mt-4 flex flex-wrap gap-1">
            {binary8(value).split('').map((bit, index) => (
              <span key={index} className="rounded border border-current/20 px-2 py-1 text-sm font-bold">{bit}</span>
            ))}
          </div>
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <NoteTable
            headers={['Interpretation', 'Value']}
            rows={[
              ['unsigned integer', unsigned],
              ["signed 8-bit two's complement", signed],
              ['ASCII character', ascii],
              ['two 4-bit fields', <span><code>{highNibble}</code> and <code>{lowNibble}</code></span>],
            ]}
          />
          <NoteParagraph className="mb-0 text-sm">
            The hardware stores bits. The type, instruction, or protocol decides what those bits mean.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function PipelineExplorer() {
  const { subtlePanelClass, primaryColor, secondaryColor } = useSystemsTheme();
  const [stages, setStages] = useState(4);
  const [workItems, setWorkItems] = useState(8);
  const unpipelinedCycles = workItems * stages;
  const pipelinedCycles = stages + workItems - 1;
  const speedup = unpipelinedCycles / pipelinedCycles;
  const cells = useMemo(
    () =>
      Array.from({ length: pipelinedCycles }, (_, cycle) =>
        Array.from({ length: stages }, (_, stage) => {
          const item = cycle - stage + 1;
          return item >= 1 && item <= workItems ? item : null;
        }),
      ),
    [pipelinedCycles, stages, workItems],
  );

  return (
    <InteractiveBlock title="Pipeline Throughput">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="pipeline-stages">
            <span>Stages</span>
            <span>{stages}</span>
          </label>
          <input id="pipeline-stages" type="range" min="2" max="6" value={stages} onChange={(event) => setStages(Number(event.target.value))} className="mb-4 w-full" />
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="pipeline-items">
            <span>Inputs</span>
            <span>{workItems}</span>
          </label>
          <input id="pipeline-items" type="range" min="3" max="12" value={workItems} onChange={(event) => setWorkItems(Number(event.target.value))} className="w-full" />
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <div className="mb-4 grid gap-2 text-sm sm:grid-cols-3">
            <div className="rounded-md border border-current/20 p-3">No pipeline: <strong>{unpipelinedCycles}</strong> cycles</div>
            <div className="rounded-md border border-current/20 p-3">Pipeline: <strong>{pipelinedCycles}</strong> cycles</div>
            <div className="rounded-md border border-current/20 p-3">Speedup: <strong>{speedup.toFixed(2)}x</strong></div>
          </div>
          <div className="overflow-x-auto">
            <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${pipelinedCycles}, minmax(34px, 1fr))` }}>
              {cells.flatMap((column, cycle) =>
                column.map((item, stage) => (
                  <div
                    key={`${cycle}-${stage}`}
                    className="flex h-8 min-w-8 items-center justify-center rounded text-xs font-bold"
                    style={{
                      backgroundColor: item === null ? 'transparent' : stage === stages - 1 ? secondaryColor : primaryColor,
                      color: item === null ? 'inherit' : 'white',
                      border: '1px solid currentColor',
                      opacity: item === null ? 0.25 : 0.9,
                    }}
                  >
                    {item ?? ''}
                  </div>
                )),
              )}
            </div>
          </div>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function CacheExplorer() {
  const { isDarkMode, subtlePanelClass, primaryColor, secondaryColor } = useSystemsTheme();
  const [hitRatioPct, setHitRatioPct] = useState(92);
  const [hitTime, setHitTime] = useState(2);
  const [missPenalty, setMissPenalty] = useState(80);
  const hitRatio = hitRatioPct / 100;
  const missRatio = 1 - hitRatio;
  const avg = hitTime + missRatio * missPenalty;

  return (
    <InteractiveBlock title="Average Memory Access Time">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="cache-hit">
            <span>Hit ratio</span>
            <span>{hitRatioPct}%</span>
          </label>
          <input id="cache-hit" type="range" min="50" max="99" value={hitRatioPct} onChange={(event) => setHitRatioPct(Number(event.target.value))} className="mb-4 w-full" />
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="hit-time">
            <span>Hit time</span>
            <span>{hitTime} cycles</span>
          </label>
          <input id="hit-time" type="range" min="1" max="10" value={hitTime} onChange={(event) => setHitTime(Number(event.target.value))} className="mb-4 w-full" />
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="miss-penalty">
            <span>Miss penalty</span>
            <span>{missPenalty} cycles</span>
          </label>
          <input id="miss-penalty" type="range" min="20" max="200" step="5" value={missPenalty} onChange={(event) => setMissPenalty(Number(event.target.value))} className="w-full" />
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <MathBlock math={String.raw`t_{avg}=t_{hit}+(1-\alpha)t_{miss}`} />
          <NoteParagraph>
            With <InlineMath math={`\\alpha=${hitRatio.toFixed(2)}`} />, the average access time is about <strong>{avg.toFixed(2)}</strong> cycles.
          </NoteParagraph>
          <div className={`h-4 rounded ${isDarkMode ? 'bg-black/40' : 'bg-slate-200'}`}>
            <div className="h-4 rounded" style={{ width: `${Math.min(100, avg)}%`, backgroundColor: avg > 20 ? secondaryColor : primaryColor }} />
          </div>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function VirtualMemoryExplorer() {
  const { isDarkMode, subtlePanelClass, primaryColor, secondaryColor } = useSystemsTheme();
  const [virtualAddress, setVirtualAddress] = useState(0x2a7);
  const pageSize = 64;
  const vpn = Math.floor(virtualAddress / pageSize);
  const offset = virtualAddress % pageSize;
  const pageTable: Record<number, number | null> = { 0: 5, 1: 9, 2: 3, 3: null, 4: 11, 5: 2, 6: null, 7: 8, 8: 6, 9: 4, 10: 12 };
  const ppn = pageTable[vpn] ?? null;
  const physicalAddress = ppn === null ? null : ppn * pageSize + offset;

  return (
    <InteractiveBlock title="Virtual Address Translation">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="virtual-address">
            <span>Virtual address</span>
            <span>0x{virtualAddress.toString(16).toUpperCase()}</span>
          </label>
          <input id="virtual-address" type="range" min="0" max="700" value={virtualAddress} onChange={(event) => setVirtualAddress(Number(event.target.value))} className="w-full" />
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <NoteTable
            headers={['Field', 'Value']}
            rows={[
              ['page size', `${pageSize} bytes`],
              ['virtual page number', vpn],
              ['page offset', offset],
              ['physical page number', ppn === null ? 'invalid page' : ppn],
              ['physical address', physicalAddress === null ? 'page fault' : `0x${physicalAddress.toString(16).toUpperCase()}`],
            ]}
          />
          <NoteParagraph className="mb-0 text-sm">
            The offset stays the same. The page table translates the virtual page number to a physical page number, or raises a page fault if the
            mapping is invalid.
          </NoteParagraph>
          <div className={`mt-4 h-4 rounded ${isDarkMode ? 'bg-black/40' : 'bg-slate-200'}`}>
            <div className="h-4 rounded" style={{ width: ppn === null ? '35%' : '85%', backgroundColor: ppn === null ? secondaryColor : primaryColor }} />
          </div>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function PointerMutationExplorer() {
  const { isDarkMode, subtlePanelClass, primaryColor, secondaryColor } = useSystemsTheme();
  const [usePointer, setUsePointer] = useState(true);
  const callerValue = usePointer ? 10 : 5;

  return (
    <InteractiveBlock title="C Pass-by-Value and Pointers">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <div className="mb-4 flex gap-2">
            {[
              { label: 'plain int', value: false },
              { label: 'int *', value: true },
            ].map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => setUsePointer(option.value)}
                className={`rounded-md px-3 py-2 text-sm font-bold transition ${
                  usePointer === option.value
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
            language="c"
            code={
              usePointer
                ? `void set_ten(int *p) {
    *p = 10;
}

int x = 5;
set_ten(&x);`
                : `void set_ten(int x) {
    x = 10;
}

int x = 5;
set_ten(x);`
            }
            className="mb-0"
          />
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <div className="mb-4 rounded-md border border-current/20 p-4">
            <div className="text-xs uppercase opacity-70">caller's x after call</div>
            <div className="text-3xl font-bold" style={{ color: usePointer ? secondaryColor : primaryColor }}>{callerValue}</div>
          </div>
          <NoteParagraph className="mb-0 text-sm">
            {usePointer
              ? 'The function receives a copy of an address. Dereferencing that address modifies the caller object.'
              : 'The function receives a copy of the integer. Reassigning the parameter does not modify the caller variable.'}
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

export default function ComputerSystemsNote() {
  return (
    <NotesLayout>
      <NoteHeader
        title="Computer Systems"
        subtitle="Connect bits, circuits, instructions, operating systems, memory, caches, and C programs."
      />

      <RelatedNotes
        links={[
          { href: '/notes/c-programming', label: 'C Programming', note: 'Compilation, memory layout, pointers, arrays, strings, structs, allocation, and debugging.' },
        ]}
      />

      <SystemsNotationGuide />

      <NoteSectionTitle id="computer-systems-big-picture">1. Computer Systems Big Picture</NoteSectionTitle>
      <NoteParagraph>
        Computer systems explains how software actually runs on hardware. The main idea is that each level provides an abstraction to the level
        above it: digital logic hides analog voltages, the instruction set hides microarchitecture, the operating system hides hardware management,
        and C exposes enough of the machine to make those abstractions visible.
      </NoteParagraph>
      <SystemsStackDiagram />

      <NoteSectionTitle id="digital-abstraction">2. Digital Abstraction</NoteSectionTitle>
      <NoteParagraph>
        Real hardware is analog: voltages vary and noise exists. Digital systems map safe voltage ranges to logical <code>0</code> and <code>1</code>,
        giving imperfect devices clean behavior.
      </NoteParagraph>
      <BitInterpretationExplorer />

      <NoteSectionTitle id="combinational-logic">3. Combinational Logic</NoteSectionTitle>
      <NoteParagraph>
        Combinational logic has no memory: the same current inputs always produce the same output. Gates such as AND, OR, NOT, NAND, NOR, and XOR
        implement Boolean functions.
      </NoteParagraph>
      <NoteTable
        headers={['Tool', 'Use']}
        rows={[
          ['Truth table', 'lists output for every input combination'],
          ['Boolean expression', 'symbolic formula for the output'],
          ['Sum of products', 'OR together product terms for rows where output is 1'],
          ['Gate diagram', 'hardware implementation of the expression'],
        ]}
      />
      <MathBlock math={String.raw`Y=A'B+AB'\qquad\text{is XOR}`} />

      <NoteSectionTitle id="timing-and-logic-simplification">4. Timing and Logic Simplification</NoteSectionTitle>
      <NoteParagraph>
        Gates are not instantaneous. Propagation delay is the maximum time until an output is valid after an input change. The critical path is the
        longest delay path through a circuit.
      </NoteParagraph>
      <NoteTable
        headers={['Quantity', 'Meaning']}
        rows={[
          [<InlineMath math="t_{PD}" />, 'maximum time until output is valid'],
          [<InlineMath math="t_{CD}" />, 'minimum time before output may start changing'],
          ['critical path', 'longest delay path that limits clock speed'],
          ['logic simplification', 'fewer gates, less area, less power, and often less delay'],
        ]}
      />

      <NoteSectionTitle id="sequential-logic">5. Sequential Logic</NoteSectionTitle>
      <NoteParagraph>
        Sequential logic adds memory. The output can depend on current inputs and previous state. Latches, flip-flops, and registers store bits so
        circuits can remember information across clock cycles.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Sequential Circuit Pattern">
          <BulletList className="mb-0">
            <li>State register stores the current state.</li>
            <li>Combinational logic computes next state and output.</li>
            <li>The clock updates the stored state.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="finite-state-machines">6. Finite State Machines</NoteSectionTitle>
      <NoteParagraph>
        A finite state machine models behavior with a finite set of states, inputs, outputs, an initial state, and transition rules. It describes controllers, protocols, digital locks, traffic lights, and CPU control logic.
      </NoteParagraph>
      <MathBlock math={String.raw`\text{current state + input}\longrightarrow\text{next state + output}`} />

      <NoteSectionTitle id="pipelining">7. Pipelining</NoteSectionTitle>
      <NoteParagraph>
        Pipelining divides a long computation into stages separated by registers. It usually improves throughput by overlapping different inputs,
        even though the latency of one input may not improve.
      </NoteParagraph>
      <PipelineExplorer />

      <NoteSectionTitle id="instruction-sets-and-beta-processor">8. Instruction Sets and the Beta Processor</NoteSectionTitle>
      <NoteParagraph>
        An instruction set architecture is the contract between software and CPU hardware. It defines instructions, registers, instruction formats,
        memory access rules, control flow, and data sizes.
      </NoteParagraph>
      <NoteTable
        headers={['CPU component', 'Role']}
        rows={[
          ['PC', 'address of next instruction'],
          ['register file', 'temporary operands and results'],
          ['ALU', 'arithmetic and logical operations'],
          ['control unit', 'decodes instruction bits and drives the datapath'],
          ['datapath', 'moves values between CPU components'],
        ]}
      />

      <NoteSectionTitle id="assembly-programming-basics">9. Assembly Programming Basics</NoteSectionTitle>
      <NoteParagraph>
        Assembly is a human-readable form of machine instructions. A typical assembly line has an optional label, a mnemonic, operands, and a
        comment.
      </NoteParagraph>
      <CodeBlock
        language="asm"
        code={`_start:
    mov rax, 60
    mov rdi, 0
    syscall`}
      />
      <NoteParagraph>
        Directives such as <code>.text</code>, <code>.data</code>, <code>.global</code>, <code>.byte</code>, and <code>.quad</code> are instructions
        to the assembler, not instructions executed by the CPU.
      </NoteParagraph>

      <NoteSectionTitle id="assembly-data-types-and-instructions">10. Assembly Data Types and Instructions</NoteSectionTitle>
      <NoteParagraph>
        At the assembly level, memory is an array of bytes. Instructions interpret fixed-size byte sequences as integers, addresses, characters, or
        instructions.
      </NoteParagraph>
      <NoteTable
        headers={['Category', 'Examples']}
        rows={[
          ['data movement', <code>mov, lea, push, pop</code>],
          ['arithmetic', <code>add, sub, inc, dec, imul</code>],
          ['logic and shifts', <code>and, or, xor, not, shl, shr, sar</code>],
          ['comparison', <code>cmp, test</code>],
          ['control flow', <code>jmp, je, jne, call, ret</code>],
          ['system', <code>syscall</code>],
        ]}
      />
      <CodeBlock language="asm" code={`mov rax, QWORD PTR [rbx]\nmov QWORD PTR [rbx], rax\nlea rax, [rbx + rcx*8 + 16]`} />

      <NoteSectionTitle id="assembly-control-flow">11. Assembly Control Flow</NoteSectionTitle>
      <NoteParagraph>
        The CPU normally executes instructions in order. Jumps change the program counter. Conditional jumps depend on flags set by earlier
        instructions such as <code>cmp</code>.
      </NoteParagraph>
      <CodeBlock
        language="asm"
        code={`cmp rax, 0
jne else_block
mov rbx, 1
jmp done
else_block:
mov rbx, 2
done:`}
      />

      <NoteSectionTitle id="assembly-functions-and-stack-frames">12. Assembly Functions and Stack Frames</NoteSectionTitle>
      <NoteParagraph>
        Functions need conventions. <code>call</code> pushes a return address and jumps to the function. <code>ret</code> pops that return address
        and jumps back. A stack frame stores call-specific data such as locals, saved registers, and return bookkeeping.
      </NoteParagraph>
      <CodeBlock
        language="asm"
        code={`push rbp
mov rbp, rsp
sub rsp, 32
; function body
mov rsp, rbp
pop rbp
ret`}
      />

      <NoteSectionTitle id="processes-executables-and-io">13. Processes, Executables, and I/O</NoteSectionTitle>
      <NoteParagraph>
        A process is a running program: CPU context plus memory context managed by the OS. An executable contains the bytes and metadata needed for
        the OS loader to create the process image.
      </NoteParagraph>
      <NoteTable
        headers={['Tool or object', 'Purpose']}
        rows={[
          [<code>ELF</code>, 'common Linux executable/object format'],
          [<code>readelf</code>, 'inspect executable sections and metadata'],
          [<code>objdump</code>, 'inspect machine code and symbols'],
          [<code>gdb</code>, 'debug registers, memory, and execution'],
          [<code>xxd</code>, 'dump raw bytes as hex'],
        ]}
      />

      <NoteSectionTitle id="operating-systems-and-system-calls">14. Operating Systems and System Calls</NoteSectionTitle>
      <NoteParagraph>
        The operating system manages hardware and gives programs controlled abstractions: processes, files, virtual memory, scheduling, and I/O.
        User programs run with restricted privileges and request kernel services through system calls.
      </NoteParagraph>
      <NoteTable
        headers={['Boundary', 'Meaning']}
        rows={[
          ['user mode', 'restricted program execution'],
          ['kernel mode', 'privileged OS execution'],
          ['system call', 'controlled entry into the kernel'],
          ['context switch', 'save one process context and load another'],
        ]}
      />

      <NoteSectionTitle id="scheduling-and-concurrency">15. Scheduling and Concurrency</NoteSectionTitle>
      <NoteParagraph>
        Scheduling decides which process or thread runs. Concurrency means multiple computations are active over the same time period, either
        interleaved on one core or actually parallel on multiple cores.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Concurrency Risk">
          <NoteParagraph className="mb-0">
            A race condition happens when correctness depends on timing. Synchronization tools such as locks, semaphores, atomic operations, and
            message passing make shared behavior predictable.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="virtual-memory">16. Virtual Memory</NoteSectionTitle>
      <NoteParagraph>
        Virtual memory gives each process a private address-space view. The CPU produces virtual addresses; the MMU translates them to physical
        addresses using OS-managed page tables.
      </NoteParagraph>
      <VirtualMemoryExplorer />

      <NoteSectionTitle id="caches-and-memory-hierarchy">17. Caches and Memory Hierarchy</NoteSectionTitle>
      <NoteParagraph>
        Memory is a hierarchy: registers are fastest and smallest, then caches, then main memory, then storage. Caches exploit temporal locality
        and spatial locality to reduce average access time.
      </NoteParagraph>
      <CacheExplorer />

      <NoteSectionTitle id="cache-writes-and-coherence">18. Cache Writes and Coherence</NoteSectionTitle>
      <NoteParagraph>
        Cache reads are conceptually simple. Writes are harder because a cached write may make lower memory or other cores' caches stale.
      </NoteParagraph>
      <NoteTable
        headers={['Policy', 'Idea']}
        rows={[
          ['write-through', 'write cache and lower memory on every write'],
          ['write-back', 'write cache first, mark dirty, update memory on eviction'],
          ['write allocate', 'bring a missed block into cache before writing'],
          ['no-write allocate', 'write directly to lower memory on a write miss'],
          ['coherence', 'keep multiple cached copies of the same address consistent'],
        ]}
      />

      <NoteSectionTitle id="c-programming-basics">19. C Programming Basics</NoteSectionTitle>
      <NoteParagraph>
        C is high-level enough for structured programs and low-level enough to expose memory, pointers, data representation, and compilation to
        assembly.
      </NoteParagraph>
      <CodeBlock
        language="c"
        code={`#include <stdio.h>

int main(void) {
    printf("hello world\\n");
    return 0;
}`}
      />
      <NoteParagraph>
        The usual toolchain is preprocessing, compilation, assembly, and linking. The <code>gcc</code> command often acts as a driver for all of
        these steps.
      </NoteParagraph>

      <NoteSectionTitle id="c-functions">20. C Functions</NoteSectionTitle>
      <NoteParagraph>
        A C function has a return type, name, parameters, and body. Declarations tell the compiler a function exists; definitions provide the body.
        C arguments are passed by value.
      </NoteParagraph>
      <CodeBlock
        language="c"
        code={`int square(int x) {
    return x * x;
}

void print_help(void);`}
      />

      <NoteSectionTitle id="c-data-representation-and-types">21. C Data Representation and Types</NoteSectionTitle>
      <NoteParagraph>
        C types tell the compiler how many bytes to use and how to interpret them. Common integer sizes include <code>char</code>, <code>short</code>,
        <code>int</code>, <code>long</code>, and <code>long long</code>, with signed and unsigned versions.
      </NoteParagraph>
      <NoteTable
        headers={['Type idea', 'Key point']}
        rows={[
          ['integer types', 'exact size depends on type and platform rules'],
          ['floating types', <code>float, double, long double</code>],
          ['casts', 'can preserve bits while changing interpretation'],
          ['truncation', 'discarding high bits can change value'],
          ['sign extension', 'copy sign bit when widening signed values'],
        ]}
      />

      <NoteSectionTitle id="signed-unsigned-and-twos-complement">22. Signed, Unsigned, and Two's Complement</NoteSectionTitle>
      <NoteParagraph>
        For <InlineMath math="w" /> bits, unsigned values range from <InlineMath math="0" /> to <InlineMath math="2^w-1" />. Two's-complement signed
        values range from <InlineMath math="-2^{w-1}" /> to <InlineMath math="2^{w-1}-1" />.
      </NoteParagraph>
      <MathBlock math={String.raw`UMax=2^w-1,\qquad TMax=2^{w-1}-1,\qquad TMin=-2^{w-1}`} />
      <NoteParagraph>
        Mixing signed and unsigned values can surprise you because C may convert the signed value to unsigned before comparing.
      </NoteParagraph>

      <NoteSectionTitle id="c-pointers">23. C Pointers</NoteSectionTitle>
      <NoteParagraph>
        A pointer stores an address. <code>&amp;</code> gets an address, and <code>*</code> follows an address to access the object stored there.
      </NoteParagraph>
      <PointerMutationExplorer />

      <NoteSectionTitle id="pointer-arithmetic-and-arrays">24. Pointer Arithmetic and Arrays</NoteSectionTitle>
      <NoteParagraph>
        Pointer arithmetic is scaled by the pointed-to type. If <code>p</code> is an <code>int *</code>, then <code>p + 1</code> advances by
        <code>sizeof(int)</code> bytes.
      </NoteParagraph>
      <CodeBlock
        language="c"
        code={`int a[10];
int *p = &a[0];

*(p + 1) = 12;  // same as a[1] = 12
a[2] = 30;`}
      />
      <NoteParagraph>
        It is legal to form a pointer one past the end of an array, but not to dereference it.
      </NoteParagraph>

      <NoteSectionTitle id="c-strings">25. C Strings</NoteSectionTitle>
      <NoteParagraph>
        A C string is a character array terminated by the null character <code>'\0'</code>. String functions work by scanning until that terminator.
      </NoteParagraph>
      <CodeBlock
        language="c"
        code={`int my_strlen(char *s) {
    char *p = s;
    while (*p != '\\0') {
        p++;
    }
    return p - s;
}`}
      />

      <NoteSectionTitle id="multidimensional-arrays">26. Multidimensional Arrays</NoteSectionTitle>
      <NoteParagraph>
        C stores multidimensional arrays in row-major order. A declaration like <code>int a[R][C]</code> is not an <code>int *</code>; when it decays,
        it behaves like a pointer to an array of <code>C</code> integers.
      </NoteParagraph>
      <CodeBlock
        language="c"
        code={`int a[NUM_ROWS][NUM_COLS];

for (int *p = &a[0][0]; p <= &a[NUM_ROWS-1][NUM_COLS-1]; p++) {
    *p = 0;
}`}
      />

      <NoteSectionTitle id="dynamic-memory-allocation">27. Dynamic Memory Allocation</NoteSectionTitle>
      <NoteParagraph>
        Dynamic memory allocation asks the heap for memory at runtime. Use <code>malloc</code> to allocate and <code>free</code> to release. Always
        allocate with <code>sizeof</code> instead of guessing byte counts.
      </NoteParagraph>
      <CodeBlock
        language="c"
        code={`int *a = malloc(n * sizeof(int));
if (a == NULL) {
    return 1;
}

free(a);`}
      />
      <NoteTable
        headers={['Error', 'Meaning']}
        rows={[
          ['memory leak', 'allocated memory is never freed'],
          ['dangling pointer', 'pointer used after free'],
          ['double free', 'same block freed twice'],
          ['buffer overflow', 'write past allocated memory'],
          ['null dereference', 'use allocation result without checking NULL'],
        ]}
      />

      <NoteSectionTitle id="structs-and-linked-lists">28. Structs and Linked Lists</NoteSectionTitle>
      <NoteParagraph>
        A <code>struct</code> groups fields. A linked list uses structs whose nodes point to the next node. This gives dynamic size but requires
        traversal and manual memory management.
      </NoteParagraph>
      <CodeBlock
        language="c"
        code={`struct node {
    int value;
    struct node *next;
};

struct node *new_node = malloc(sizeof(struct node));
new_node->value = 10;
new_node->next = first;
first = new_node;`}
      />
      <NoteParagraph>
        Use <code>.</code> for a struct object and <code>-&gt;</code> for a pointer to struct. <code>p-&gt;x</code> is shorthand for <code>(*p).x</code>.
      </NoteParagraph>

      <NoteSectionTitle id="pointer-declarations-and-operator-precedence">29. Pointer Declarations and Operator Precedence</NoteSectionTitle>
      <NoteParagraph>
        C declarations can be read by starting at the identifier and following operator precedence. Parentheses change meaning.
      </NoteParagraph>
      <NoteTable
        headers={['Declaration', 'Meaning']}
        rows={[
          [<code>int *p;</code>, 'p is a pointer to int'],
          [<code>int *p[13];</code>, 'p is an array of 13 pointers to int'],
          [<code>int **p;</code>, 'p is a pointer to a pointer to int'],
          [<code>int (*p)[13];</code>, 'p is a pointer to an array of 13 ints'],
          [<code>int *f();</code>, 'f is a function returning pointer to int'],
          [<code>int (*f)();</code>, 'f is a pointer to a function returning int'],
        ]}
      />
      <NoteParagraph>
        When pointer expressions are even slightly ambiguous, use parentheses. Readability is part of correctness in systems code.
      </NoteParagraph>

      <NoteSectionTitle id="systems-design-lessons">30. Systems Design Lessons</NoteSectionTitle>
      <NoteParagraph>
        Computer systems is about connections between layers. Performance depends on algorithms, but also on instruction count, CPI, clock rate,
        memory locality, cache behavior, OS overhead, and hardware/software contracts.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Layer Connections">
          <BulletList className="mb-0">
            <li>Everything is bits; interpretation gives those bits meaning.</li>
            <li>A process is an OS-created CPU and memory context.</li>
            <li>Function calls are implemented with conventions, registers, stack frames, <code>call</code>, and <code>ret</code>.</li>
            <li>Virtual memory translates virtual addresses to physical addresses through page tables.</li>
            <li>Caches exploit locality but introduce write and coherence complexity.</li>
            <li>C exposes low-level memory behavior directly, so pointer and allocation mistakes become real bugs.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>
    </NotesLayout>
  );
}
