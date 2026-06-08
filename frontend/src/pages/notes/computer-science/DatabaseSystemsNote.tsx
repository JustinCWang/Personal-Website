/**
 * Database Systems Notes Page
 * A standalone note for database design, relational models, SQL, storage engines, indexes, transactions, recovery, distributed data, and NoSQL.
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
  RelatedNotes,
} from '../../../components/notes';
import { useDarkMode } from '../../../hooks/useDarkMode';

type TableRow = ReactNode[];

function useDatabaseTheme() {
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
  const { listClass } = useDatabaseTheme();
  return <ul className={`${listClass} ${className}`}>{children}</ul>;
}

function NoteTable({ headers, rows }: { headers: ReactNode[]; rows: TableRow[] }) {
  const { tableClass, tableHeadClass, tableCellClass } = useDatabaseTheme();

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

function DatabaseNotationGuide() {
  return (
    <NoteTopicGroup>
      <NoteTopicBlock title="Notation Used Throughout">
        <BulletList className="mb-0">
          <li>A database is the stored data. A DBMS is the software system that manages that data.</li>
          <li>A relation is a table. A tuple is a row. An attribute is a column.</li>
          <li>A schema describes structure: relation names, attribute names, domains, keys, and constraints.</li>
          <li><InlineMath math={'R(A, B, C)'} /> names relation <InlineMath math={'R'} /> with attributes <InlineMath math={'A'} />, <InlineMath math={'B'} />, and <InlineMath math={'C'} />.</li>
          <li><InlineMath math={'\\sigma_{condition}(R)'} /> means selection: keep rows of <InlineMath math={'R'} /> that satisfy a condition.</li>
          <li><InlineMath math={'\\pi_{A,B}(R)'} /> means projection: keep only attributes <InlineMath math={'A'} /> and <InlineMath math={'B'} />.</li>
          <li><InlineMath math={'\\rho_{S}(R)'} /> means rename relation <InlineMath math={'R'} /> as <InlineMath math={'S'} />.</li>
          <li><InlineMath math={'R \\bowtie S'} /> means natural join; <InlineMath math={'R \\times S'} /> means Cartesian product.</li>
          <li><code>NULL</code> means unknown or not applicable. It is not the same as zero, empty string, or false.</li>
          <li><code>T1</code>, <code>T2</code>, and similar names usually mean transactions.</li>
        </BulletList>
      </NoteTopicBlock>
    </NoteTopicGroup>
  );
}

function DbmsLayerExplorer() {
  return (
    <NoteTable
      headers={['Layer', 'Question', 'Examples']}
      rows={[
        ['Logical layer', 'What data model and query interface does the user see?', 'ER models, relations, SQL, XML, JSON, document models, key-value models.'],
        ['Storage layer', 'How does the DBMS store, find, update, and recover the data physically?', 'Pages, records, indexes, buffer cache, locks, logs, recovery, replication.'],
      ]}
    />
  );
}

type CardinalityMode = 'many-to-one' | 'one-to-one' | 'many-to-many';

function CardinalityExplorer() {
  const { subtlePanelClass, primaryColor, secondaryColor, mutedColor, textColor, panelFill } = useDatabaseTheme();
  const [mode, setMode] = useState<CardinalityMode>('many-to-many');
  const modes = {
    'many-to-one': {
      label: 'many-to-one',
      left: 'Course',
      relationship: 'MeetsIn',
      right: 'Room',
      meaning: 'Each course meets in at most one room; a room may host many courses.',
      relationalChoice: 'Put room_id as a foreign key on Course when participation is common.',
    },
    'one-to-one': {
      label: 'one-to-one',
      left: 'Person',
      relationship: 'Chairs',
      right: 'Department',
      meaning: 'Each person chairs at most one department, and each department has at most one chair.',
      relationalChoice: 'Store the foreign key on the side with total participation or fewer nulls.',
    },
    'many-to-many': {
      label: 'many-to-many',
      left: 'Student',
      relationship: 'Enrolled',
      right: 'Course',
      meaning: 'A student can enroll in many courses, and each course can contain many students.',
      relationalChoice: 'Use a separate relationship table, such as Enrolled(student_id, course_id).',
    },
  } satisfies Record<CardinalityMode, { label: string; left: string; relationship: string; right: string; meaning: string; relationalChoice: string }>;
  const current = modes[mode];
  const leftArrow = mode === 'one-to-one';
  const rightArrow = mode === 'many-to-one' || mode === 'one-to-one';

  return (
    <InteractiveBlock title="ER Cardinality and Translation">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,360px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 block text-sm font-bold" htmlFor="cardinality-mode">Cardinality</label>
          <select
            id="cardinality-mode"
            value={mode}
            onChange={(event) => setMode(event.target.value as CardinalityMode)}
            className="mb-4 w-full rounded border border-current/20 bg-transparent p-2 text-sm"
          >
            {Object.entries(modes).map(([key, value]) => (
              <option key={key} value={key}>{value.label}</option>
            ))}
          </select>
          <svg viewBox="0 0 420 160" className="h-44 w-full" role="img" aria-label="Entity relationship diagram cardinality">
            <defs>
              <marker id="er-arrow-right" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" fill={mutedColor} />
              </marker>
              <marker id="er-arrow-left" markerWidth="8" markerHeight="8" refX="1" refY="4" orient="auto">
                <path d="M8,0 L0,4 L8,8 Z" fill={mutedColor} />
              </marker>
            </defs>
            <rect x="20" y="54" width="104" height="52" rx="8" fill={panelFill} stroke={primaryColor} strokeWidth="2" />
            <text x="72" y="84" textAnchor="middle" fontFamily="monospace" fontSize="13" fill={textColor}>{current.left}</text>
            <polygon points="210,36 276,80 210,124 144,80" fill={panelFill} stroke={secondaryColor} strokeWidth="2" />
            <text x="210" y="84" textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>{current.relationship}</text>
            <rect x="304" y="54" width="96" height="52" rx="8" fill={panelFill} stroke={primaryColor} strokeWidth="2" />
            <text x="352" y="84" textAnchor="middle" fontFamily="monospace" fontSize="13" fill={textColor}>{current.right}</text>
            <line
              x1="124"
              y1="80"
              x2="144"
              y2="80"
              stroke={mutedColor}
              strokeWidth="2.4"
              markerStart={leftArrow ? 'url(#er-arrow-left)' : undefined}
            />
            <line
              x1="276"
              y1="80"
              x2="304"
              y2="80"
              stroke={mutedColor}
              strokeWidth="2.4"
              markerEnd={rightArrow ? 'url(#er-arrow-right)' : undefined}
            />
          </svg>
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <NoteTable
            headers={['idea', current.label]}
            rows={[
              ['meaning', current.meaning],
              ['translation hint', current.relationalChoice],
              ['intuition', 'Cardinality tells you whether a relationship can fit as a foreign key or needs its own table.'],
            ]}
          />
        </div>
      </div>
    </InteractiveBlock>
  );
}

type AlgebraStep = 'base' | 'selection' | 'projection' | 'join';

const algebraStudents = [
  { studentId: 1, name: 'Ada', major: 'CS' },
  { studentId: 2, name: 'Linus', major: 'Math' },
  { studentId: 3, name: 'Grace', major: 'CS' },
];

const algebraEnrollments = [
  { studentId: 1, course: 'DB' },
  { studentId: 2, course: 'OS' },
  { studentId: 3, course: 'DB' },
];

function RelationalAlgebraExplorer() {
  const { subtlePanelClass } = useDatabaseTheme();
  const [step, setStep] = useState<AlgebraStep>('join');
  const rows = useMemo(() => {
    if (step === 'base') return algebraStudents.map((student) => [student.studentId, student.name, student.major]);
    if (step === 'selection') {
      return algebraStudents
        .filter((student) => student.major === 'CS')
        .map((student) => [student.studentId, student.name, student.major]);
    }
    if (step === 'projection') {
      return algebraStudents
        .filter((student) => student.major === 'CS')
        .map((student) => [student.name]);
    }
    return algebraStudents
      .flatMap((student) =>
        algebraEnrollments
          .filter((enrollment) => enrollment.studentId === student.studentId && enrollment.course === 'DB')
          .map((enrollment) => [student.name, student.major, enrollment.course]),
      );
  }, [step]);
  const headers =
    step === 'projection'
      ? ['name']
      : step === 'join'
        ? ['name', 'major', 'course']
        : ['student_id', 'name', 'major'];
  const expression =
    step === 'base'
      ? 'Student'
      : step === 'selection'
        ? '\\sigma_{major=CS}(Student)'
        : step === 'projection'
          ? '\\pi_{name}(\\sigma_{major=CS}(Student))'
          : '\\pi_{name,major,course}(\\sigma_{course=DB}(Student \\bowtie Enrolled))';

  return (
    <InteractiveBlock title="Relational Algebra as Table Transformers">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,360px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 block text-sm font-bold" htmlFor="algebra-step">Operation</label>
          <select
            id="algebra-step"
            value={step}
            onChange={(event) => setStep(event.target.value as AlgebraStep)}
            className="mb-4 w-full rounded border border-current/20 bg-transparent p-2 text-sm"
          >
            <option value="base">base relation</option>
            <option value="selection">selection</option>
            <option value="projection">selection then projection</option>
            <option value="join">join then filter</option>
          </select>
          <div className="rounded-lg border border-current/20 p-4 font-mono text-sm">
            <InlineMath math={expression} />
          </div>
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <NoteTable headers={headers} rows={rows} />
          <NoteParagraph className="mb-0 text-sm">
            Relational algebra is closed: every operation returns a relation, so query expressions can be nested and composed.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

type AggregateMode = 'count' | 'avg' | 'having';

const aggregateRows = [
  { department: 'CS', salary: 90000 },
  { department: 'CS', salary: 110000 },
  { department: 'Math', salary: 80000 },
  { department: 'Math', salary: 85000 },
  { department: 'Art', salary: 70000 },
];

function SqlAggregateExplorer() {
  const { subtlePanelClass } = useDatabaseTheme();
  const [mode, setMode] = useState<AggregateMode>('avg');
  const groups = useMemo(() => {
    const byDepartment = aggregateRows.reduce<Record<string, number[]>>((acc, row) => {
      acc[row.department] = [...(acc[row.department] ?? []), row.salary];
      return acc;
    }, {});
    return Object.entries(byDepartment)
      .map(([department, salaries]) => ({
        department,
        count: salaries.length,
        avg: salaries.reduce((sum, salary) => sum + salary, 0) / salaries.length,
      }))
      .filter((row) => mode !== 'having' || row.avg >= 85000);
  }, [mode]);
  const query =
    mode === 'count'
      ? `SELECT department, COUNT(*) AS employee_count
FROM Employee
GROUP BY department;`
      : mode === 'avg'
        ? `SELECT department, AVG(salary) AS avg_salary
FROM Employee
GROUP BY department;`
        : `SELECT department, AVG(salary) AS avg_salary
FROM Employee
GROUP BY department
HAVING AVG(salary) >= 85000;`;

  return (
    <InteractiveBlock title="GROUP BY and HAVING">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,360px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 block text-sm font-bold" htmlFor="aggregate-mode">Query</label>
          <select
            id="aggregate-mode"
            value={mode}
            onChange={(event) => setMode(event.target.value as AggregateMode)}
            className="mb-4 w-full rounded border border-current/20 bg-transparent p-2 text-sm"
          >
            <option value="count">COUNT by group</option>
            <option value="avg">AVG by group</option>
            <option value="having">AVG with HAVING</option>
          </select>
          <CodeBlock language="sql" code={query} className="mb-0" />
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <NoteTable
            headers={mode === 'count' ? ['department', 'employee_count'] : ['department', 'avg_salary']}
            rows={groups.map((group) => [
              group.department,
              mode === 'count' ? group.count : `$${Math.round(group.avg).toLocaleString()}`,
            ])}
          />
          <NoteParagraph className="mb-0 text-sm">
            <code>WHERE</code> filters rows before grouping. <code>HAVING</code> filters groups after aggregate values exist.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

type IndexScenario = 'scan' | 'hash' | 'btree';

function IndexCostExplorer() {
  const { subtlePanelClass, primaryColor, secondaryColor } = useDatabaseTheme();
  const [scenario, setScenario] = useState<IndexScenario>('btree');
  const scenarios = {
    scan: {
      label: 'table scan',
      reads: 18,
      goodFor: 'Small tables or queries that need most rows.',
      weakFor: 'Finding one row in a large table.',
    },
    hash: {
      label: 'hash index',
      reads: 3,
      goodFor: 'Equality lookup such as id = 42.',
      weakFor: 'Range queries such as date between two values.',
    },
    btree: {
      label: 'B+ tree index',
      reads: 5,
      goodFor: 'Equality lookup and ordered range scans.',
      weakFor: 'Extra maintenance cost on inserts, deletes, and updates.',
    },
  } satisfies Record<IndexScenario, { label: string; reads: number; goodFor: string; weakFor: string }>;
  const current = scenarios[scenario];

  return (
    <InteractiveBlock title="Index Tradeoff">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,360px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 block text-sm font-bold" htmlFor="index-scenario">Access path</label>
          <select
            id="index-scenario"
            value={scenario}
            onChange={(event) => setScenario(event.target.value as IndexScenario)}
            className="mb-4 w-full rounded border border-current/20 bg-transparent p-2 text-sm"
          >
            {Object.entries(scenarios).map(([key, value]) => (
              <option key={key} value={key}>{value.label}</option>
            ))}
          </select>
          <div className="space-y-2">
            {Array.from({ length: 18 }, (_, index) => (
              <div key={index} className="h-3 rounded-full bg-current/10">
                <div
                  className="h-3 rounded-full transition-all"
                  style={{
                    width: index < current.reads ? '100%' : '0%',
                    backgroundColor: index < current.reads ? (scenario === 'scan' ? secondaryColor : primaryColor) : 'transparent',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <NoteTable
            headers={['field', current.label]}
            rows={[
              ['illustrative page reads', current.reads],
              ['good for', current.goodFor],
              ['watch out for', current.weakFor],
              ['core tradeoff', 'Indexes spend extra space and write cost to reduce read cost.'],
            ]}
          />
        </div>
      </div>
    </InteractiveBlock>
  );
}

type ScheduleMode = 'serial' | 'safe-interleaving' | 'lost-update';

function ScheduleExplorer() {
  const { subtlePanelClass } = useDatabaseTheme();
  const [mode, setMode] = useState<ScheduleMode>('lost-update');
  const schedules = {
    serial: {
      label: 'serial',
      operations: ['T1: read A', 'T1: write A', 'T1: commit', 'T2: read A', 'T2: write A', 'T2: commit'],
      result: 'Serializable by definition: transactions run one at a time.',
    },
    'safe-interleaving': {
      label: 'safe interleaving',
      operations: ['T1: read A', 'T2: read B', 'T1: write A', 'T2: write B', 'T1: commit', 'T2: commit'],
      result: 'Serializable when the transactions touch independent data items.',
    },
    'lost-update': {
      label: 'lost update',
      operations: ['T1: read A=100', 'T2: read A=100', 'T1: write A=90', 'T2: write A=120', 'T1: commit', 'T2: commit'],
      result: 'Not safe: T2 overwrites T1 using an old value, so one update is lost.',
    },
  } satisfies Record<ScheduleMode, { label: string; operations: string[]; result: string }>;
  const current = schedules[mode];

  return (
    <InteractiveBlock title="Schedule Intuition">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,360px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 block text-sm font-bold" htmlFor="schedule-mode">Schedule</label>
          <select
            id="schedule-mode"
            value={mode}
            onChange={(event) => setMode(event.target.value as ScheduleMode)}
            className="w-full rounded border border-current/20 bg-transparent p-2 text-sm"
          >
            {Object.entries(schedules).map(([key, value]) => (
              <option key={key} value={key}>{value.label}</option>
            ))}
          </select>
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <ol className="mb-4 list-decimal space-y-2 pl-6 font-mono text-sm">
            {current.operations.map((operation) => (
              <li key={operation}>{operation}</li>
            ))}
          </ol>
          <NoteParagraph className="mb-0 text-sm">{current.result}</NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

type RecoveryMode = 'committed-not-flushed' | 'uncommitted-flushed' | 'checkpoint';

function RecoveryExplorer() {
  const { subtlePanelClass } = useDatabaseTheme();
  const [mode, setMode] = useState<RecoveryMode>('committed-not-flushed');
  const modes = {
    'committed-not-flushed': {
      label: 'committed update not on disk',
      beforeCrash: 'T1 wrote A=80 and committed, but the data page may not have reached disk.',
      recoveryAction: 'REDO T1 from the log.',
      reason: 'Durability requires committed work to survive.',
    },
    'uncommitted-flushed': {
      label: 'uncommitted update reached disk',
      beforeCrash: 'T2 wrote B=50, the page reached disk, but T2 never committed.',
      recoveryAction: 'UNDO T2 using old values in the log.',
      reason: 'Atomicity requires incomplete work to disappear.',
    },
    checkpoint: {
      label: 'recent checkpoint',
      beforeCrash: 'The log contains a checkpoint with dirty pages and active transactions.',
      recoveryAction: 'Start analysis from the checkpoint instead of scanning the entire log.',
      reason: 'Checkpointing reduces recovery time.',
    },
  } satisfies Record<RecoveryMode, { label: string; beforeCrash: string; recoveryAction: string; reason: string }>;
  const current = modes[mode];

  return (
    <InteractiveBlock title="Redo, Undo, and Checkpointing">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,360px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 block text-sm font-bold" htmlFor="recovery-mode">Crash case</label>
          <select
            id="recovery-mode"
            value={mode}
            onChange={(event) => setMode(event.target.value as RecoveryMode)}
            className="w-full rounded border border-current/20 bg-transparent p-2 text-sm"
          >
            {Object.entries(modes).map(([key, value]) => (
              <option key={key} value={key}>{value.label}</option>
            ))}
          </select>
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <NoteTable
            headers={['question', 'answer']}
            rows={[
              ['before crash', current.beforeCrash],
              ['recovery action', current.recoveryAction],
              ['why', current.reason],
            ]}
          />
          <NoteParagraph className="mb-0 text-sm">
            Write-ahead logging makes recovery possible because the durable log reaches stable storage before affected data pages are written.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function ToolChoiceExplorer() {
  return (
    <NoteTable
      headers={['Data model', 'Strong when', 'Tradeoff']}
      rows={[
        ['Relational DBMS', 'Structured data, joins, constraints, transactions, ad hoc SQL queries.', 'Schema design and horizontal scaling require careful planning.'],
        ['Document database', 'Nested records are usually read and written as whole documents.', 'Some joins and cross-document aggregates become harder.'],
        ['Key-value store', 'Simple lookup by key at high throughput.', 'Queries are limited unless additional indexes or application logic are added.'],
        ['Column-family store', 'Large-scale distributed writes and partition-key-shaped queries.', 'Data modeling is query-driven and denormalized.'],
      ]}
    />
  );
}

export default function DatabaseSystemsNote() {
  return (
    <NotesLayout>
      <NoteHeader
        title="Database Systems"
        subtitle="Model, query, store, index, update, recover, and distribute data while preserving the guarantees applications depend on."
      />

      <RelatedNotes
        links={[
          { href: '/notes/sql', label: 'SQL', note: 'Concrete relational querying, joins, aggregation, modification commands, constraints, and transaction-aware usage.' },
        ]}
      />

      <DatabaseNotationGuide />

      <NoteSectionTitle id="database-systems-overview-and-dbms-architecture">1. Database Systems Overview and DBMS Architecture</NoteSectionTitle>
      <NoteParagraph>
        A database is a collection of related data. A DBMS, or database management system, is the software that lets applications define, query, update,
        protect, recover, and share that data. This distinction matters: the data is the long-lived asset, while the DBMS is the machinery that manages it.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Why DBMSs Exist">
          <BulletList className="mb-0">
            <li>They give users a logical model so data can be queried without knowing disk layout.</li>
            <li>They enforce constraints such as primary keys, foreign keys, and data types.</li>
            <li>They provide transactions so related updates behave as one unit.</li>
            <li>They use indexes, caches, and query planning to reduce expensive storage work.</li>
            <li>They recover from crashes and coordinate concurrent users.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="two-layer-dbms-model">2. Two-Layer DBMS Model</NoteSectionTitle>
      <NoteParagraph>
        A DBMS can be separated into a logical layer and a storage layer. The logical layer defines what users see: schemas, data models,
        and query languages. The storage layer defines how the system physically stores, indexes, updates, logs, and recovers the data.
      </NoteParagraph>
      <DbmsLayerExplorer />

      <NoteSectionTitle id="database-design">3. Database Design</NoteSectionTitle>
      <NoteParagraph>
        Database design decides what data belongs in the system, how the data is related, and how it should be grouped. The goal is a logical schema that
        represents the real domain clearly while avoiding unnecessary duplication and update anomalies.
      </NoteParagraph>
      <NoteTable
        headers={['design question', 'why it matters']}
        rows={[
          ['What are the main entities?', 'Entities often become tables.'],
          ['What attributes describe each entity?', 'Attributes become columns or nested fields.'],
          ['What relationships connect entities?', 'Relationships become foreign keys or separate tables.'],
          ['What constraints must always hold?', 'Constraints protect valid states.'],
          ['Which queries matter most?', 'Important queries affect decomposition, indexing, and sometimes data model choice.'],
        ]}
      />

      <NoteSectionTitle id="entity-relationship-models">4. Entity-Relationship Models</NoteSectionTitle>
      <NoteParagraph>
        An entity-relationship model, or ER model, is an implementation-neutral design tool. It lets you describe entities, relationships, attributes,
        keys, cardinality constraints, and participation constraints before committing to SQL table definitions.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="ER Diagram Symbols">
          <BulletList className="mb-0">
            <li>Rectangles represent entity sets, such as <code>Student</code> or <code>Course</code>.</li>
            <li>Ovals represent attributes, such as <code>name</code> or <code>email</code>.</li>
            <li>Underlined attributes identify primary keys.</li>
            <li>Diamonds represent relationship sets, such as <code>Enrolled</code>.</li>
            <li>Double or thick lines often indicate total participation: every entity on that side must participate.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="entities-attributes-and-keys">5. Entities, Attributes, and Keys</NoteSectionTitle>
      <NoteParagraph>
        An entity is a distinguishable thing in the domain. An entity set is a collection of similar entities. Attributes describe entities. A key is an
        attribute or set of attributes that uniquely identifies each entity in an entity set.
      </NoteParagraph>
      <NoteTable
        headers={['term', 'meaning', 'example']}
        rows={[
          ['entity', 'One concrete thing.', 'A particular student.'],
          ['entity set', 'A collection of similar entities.', 'Student.'],
          ['attribute', 'A property of an entity or relationship.', 'email, capacity, start_time.'],
          ['key', 'Attributes that uniquely identify an entity.', 'student_id.'],
          ['candidate key', 'A minimal key with no unnecessary attributes.', 'isbn or (author_id, title).'],
          ['primary key', 'The candidate key chosen as the main identifier.', 'Student(id).'],
        ]}
      />
      <NoteParagraph>
        Minimal does not mean shortest in an informal sense. A candidate key is minimal because removing any attribute destroys uniqueness.
      </NoteParagraph>

      <NoteSectionTitle id="relationships-cardinality-and-participation">6. Relationships, Cardinality, and Participation</NoteSectionTitle>
      <NoteParagraph>
        A relationship connects entity sets. Cardinality constraints say how many times an entity can participate. Participation constraints say whether
        participation is optional or required.
      </NoteParagraph>
      <CardinalityExplorer />
      <NoteTopicGroup>
        <NoteTopicBlock title="Relationship Details">
          <BulletList className="mb-0">
            <li>The degree of a relationship is the number of entity sets involved. Binary relationships involve two; ternary relationships involve three.</li>
            <li>Role indicators are needed when the same entity set appears more than once, such as <code>Person Advises Person</code>.</li>
            <li>A relationship can have its own attributes, such as <code>credit_status</code> on <code>Enrolled</code>.</li>
            <li>Total participation plus at-most-one participation means exactly one.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="er-to-relational-translation">7. ER-to-Relational Translation</NoteSectionTitle>
      <NoteParagraph>
        Translating ER designs into relations means turning entity sets and relationship sets into schemas. Entity sets usually become tables. Relationship
        sets either become separate tables or foreign keys, depending on cardinality and participation.
      </NoteParagraph>
      <NoteTable
        headers={['ER pattern', 'relational translation']}
        rows={[
          ['entity set', 'Create a relation with the entity attributes and primary key.'],
          ['many-to-many relationship', 'Create a separate relation containing the keys of both sides and relationship attributes.'],
          ['many-to-one relationship', 'Often place a foreign key on the many side.'],
          ['one-to-one relationship', 'Place a foreign key on the side that avoids nulls and matches participation constraints.'],
          ['relationship attribute', 'Store it in the relationship relation or alongside the foreign key that represents the relationship.'],
        ]}
      />
      <CodeBlock
        language="sql"
        code={`Student(id, name)
Course(id, title)
Enrolled(student_id, course_id, credit_status)

Primary key: (student_id, course_id)
Foreign keys:
  student_id references Student(id)
  course_id references Course(id)`}
      />

      <NoteSectionTitle id="relational-model">8. Relational Model</NoteSectionTitle>
      <NoteParagraph>
        The relational model represents a database as a collection of relations. Its central idea is data independence: users and applications work with
        logical tables instead of physical storage details.
      </NoteParagraph>
      <NoteTable
        headers={['relational term', 'table term']}
        rows={[
          ['relation', 'table'],
          ['tuple', 'row'],
          ['attribute', 'column'],
          ['domain', 'set of allowed values for a column'],
          ['schema', 'structure of a relation or database'],
        ]}
      />
      <NoteParagraph>
        In the pure relational model, each cell contains a single value, column names are unique, values in a column come from the same domain, and no two
        tuples are identical.
      </NoteParagraph>

      <NoteSectionTitle id="primary-keys-foreign-keys-and-constraints">9. Primary Keys, Foreign Keys, and Constraints</NoteSectionTitle>
      <NoteParagraph>
        A primary key uniquely identifies rows in a relation. A foreign key stores values that refer to the primary key of another relation. Together,
        keys let the database represent relationships while enforcing referential integrity.
      </NoteParagraph>
      <NoteTable
        headers={['constraint', 'meaning']}
        rows={[
          ['primary key', 'No two rows can have the same key value, and key attributes should not be null.'],
          ['foreign key', 'Referenced values must exist in the target relation.'],
          ['domain constraint', 'A value must belong to the attribute domain, such as integer, date, or string.'],
          ['not null', 'A value must be present.'],
          ['unique', 'No two rows can share the constrained value or value combination.'],
          ['check', 'A row must satisfy a Boolean condition.'],
        ]}
      />

      <NoteSectionTitle id="relational-algebra">10. Relational Algebra</NoteSectionTitle>
      <NoteParagraph>
        Relational algebra is a formal query language for the relational model. Each operation takes one or more relations as input and produces a relation
        as output, so operations can be composed.
      </NoteParagraph>
      <RelationalAlgebraExplorer />

      <NoteSectionTitle id="selection-projection-rename-and-cartesian-product">11. Selection, Projection, Rename, and Cartesian Product</NoteSectionTitle>
      <NoteParagraph>
        Selection filters rows. Projection chooses columns. Rename changes relation or attribute names. Cartesian product pairs every row of one relation
        with every row of another relation.
      </NoteParagraph>
      <NoteTable
        headers={['operation', 'notation', 'meaning']}
        rows={[
          ['selection', <InlineMath math={'\\sigma_{condition}(R)'} />, 'Keep rows satisfying a predicate.'],
          ['projection', <InlineMath math={'\\pi_{A,B}(R)'} />, 'Keep attributes A and B, removing duplicate tuples in pure relational algebra.'],
          ['rename', <InlineMath math={'\\rho_{S}(R)'} />, 'Rename relation R to S, or rename attributes.'],
          ['Cartesian product', <InlineMath math={'R \\times S'} />, 'Pair every tuple of R with every tuple of S.'],
        ]}
      />
      <NoteParagraph>
        Cartesian product usually creates too many combinations by itself. Joins are built by combining product with conditions and projection.
      </NoteParagraph>

      <NoteSectionTitle id="joins-and-outer-joins">12. Joins and Outer Joins</NoteSectionTitle>
      <NoteParagraph>
        A join combines related rows from two relations. A natural join matches rows with equal values on shared attribute names. A theta join uses an
        explicit condition. Outer joins preserve unmatched rows by filling missing attributes with <code>NULL</code>.
      </NoteParagraph>
      <NoteTable
        headers={['join type', 'keeps unmatched rows?', 'typical use']}
        rows={[
          ['inner join', 'No.', 'Return only matching rows.'],
          ['left outer join', 'Keeps unmatched rows from the left relation.', 'Show all left-side entities even if related data is missing.'],
          ['right outer join', 'Keeps unmatched rows from the right relation.', 'Symmetric version of left outer join.'],
          ['full outer join', 'Keeps unmatched rows from both sides.', 'Audit data that may be missing on either side.'],
          ['theta join', 'Depends on condition and outer/inner variant.', 'Join with a non-natural or non-equality predicate.'],
        ]}
      />

      <NoteSectionTitle id="set-difference-and-assignment">13. Set Difference and Assignment</NoteSectionTitle>
      <NoteParagraph>
        Set difference returns tuples that appear in one relation but not another relation with the same schema. Assignment names an intermediate relation
        so a complex relational algebra expression can be broken into readable pieces.
      </NoteParagraph>
      <NoteTable
        headers={['operation', 'notation', 'use']}
        rows={[
          ['set difference', <InlineMath math={'R - S'} />, 'Find rows in R that are not in S.'],
          ['assignment', <InlineMath math={'Temp \\leftarrow expression'} />, 'Name an intermediate result.'],
        ]}
      />
      <NoteParagraph>
        In relational algebra, set operations require compatible schemas. If names differ but meanings line up, rename can make schemas compatible first.
      </NoteParagraph>

      <NoteSectionTitle id="sql-basics">14. SQL Basics</NoteSectionTitle>
      <NoteParagraph>
        SQL is the practical language for relational databases. Its most common query shape is <code>SELECT-FROM-WHERE</code>: choose output expressions,
        choose input tables, then filter rows.
      </NoteParagraph>
      <CodeBlock
        language="sql"
        code={`SELECT name, major
FROM Student
WHERE major = 'CS';`}
      />
      <NoteTable
        headers={['clause', 'role']}
        rows={[
          [<code>SELECT</code>, 'Names output columns or expressions.'],
          [<code>FROM</code>, 'Names input tables or joins.'],
          [<code>WHERE</code>, 'Filters rows before grouping.'],
          [<code>DISTINCT</code>, 'Removes duplicate output rows.'],
          [<code>ORDER BY</code>, 'Sorts the final result.'],
        ]}
      />
      <NoteParagraph>
        SQL tables often behave like bags, meaning duplicates can appear unless <code>DISTINCT</code> is requested. This differs from pure relational
        algebra, where relations are sets.
      </NoteParagraph>

      <NoteSectionTitle id="sql-pattern-matching">15. SQL Pattern Matching</NoteSectionTitle>
      <NoteParagraph>
        Pattern matching filters strings by shape instead of exact equality. In SQL, <code>LIKE</code> uses wildcard characters.
      </NoteParagraph>
      <NoteTable
        headers={['pattern', 'meaning']}
        rows={[
          [<code>'A%'</code>, 'Strings starting with A.'],
          [<code>'%son'</code>, 'Strings ending with son.'],
          [<code>'%data%'</code>, 'Strings containing data.'],
          [<code>'_at'</code>, 'Three-character strings ending in at.'],
        ]}
      />
      <CodeBlock
        language="sql"
        code={`SELECT title
FROM Course
WHERE title LIKE '%Database%';`}
      />

      <NoteSectionTitle id="sql-aggregates-and-group-by">16. SQL Aggregates and GROUP BY</NoteSectionTitle>
      <NoteParagraph>
        Aggregate functions summarize multiple rows. <code>GROUP BY</code> partitions rows into groups, then computes one aggregate result per group.
        <code>HAVING</code> filters groups after aggregation.
      </NoteParagraph>
      <SqlAggregateExplorer />

      <NoteSectionTitle id="sql-subqueries">17. SQL Subqueries</NoteSectionTitle>
      <NoteParagraph>
        A subquery is a query nested inside another query. Subqueries can compute values, sets, or existence tests used by the outer query.
      </NoteParagraph>
      <CodeBlock
        language="sql"
        code={`SELECT name
FROM Student
WHERE id IN (
  SELECT student_id
  FROM Enrolled
  WHERE course_id = 'DB'
);`}
      />
      <NoteTable
        headers={['form', 'meaning']}
        rows={[
          [<code>IN</code>, 'Checks whether a value appears in a subquery result.'],
          [<code>EXISTS</code>, 'Checks whether the subquery returns at least one row.'],
          [<code>ANY</code>, 'Compares against at least one value from a subquery.'],
          [<code>ALL</code>, 'Compares against every value from a subquery.'],
          ['correlated subquery', 'A subquery that refers to a row from the outer query.'],
        ]}
      />

      <NoteSectionTitle id="sql-joins-and-outer-joins">18. SQL Joins and Outer Joins</NoteSectionTitle>
      <NoteParagraph>
        SQL joins make relationships explicit in queries. The join condition usually connects a foreign key in one table to a primary key in another.
      </NoteParagraph>
      <CodeBlock
        language="sql"
        code={`SELECT Student.name, Course.title
FROM Student
JOIN Enrolled ON Student.id = Enrolled.student_id
JOIN Course ON Course.id = Enrolled.course_id;`}
      />
      <NoteTable
        headers={['SQL join', 'preserves unmatched rows?']}
        rows={[
          [<code>INNER JOIN</code>, 'No.'],
          [<code>LEFT JOIN</code>, 'Rows from the left table survive.'],
          [<code>RIGHT JOIN</code>, 'Rows from the right table survive.'],
          [<code>FULL OUTER JOIN</code>, 'Rows from both sides survive when unmatched.'],
        ]}
      />

      <NoteSectionTitle id="sql-data-types-and-modification-commands">19. SQL Data Types and Modification Commands</NoteSectionTitle>
      <NoteParagraph>
        SQL also defines schemas and changes data. Data definition commands create and alter structure. Data modification commands insert, update, and
        delete rows.
      </NoteParagraph>
      <NoteTable
        headers={['category', 'examples', 'purpose']}
        rows={[
          ['DDL', <code>CREATE, ALTER, DROP</code>, 'Define database structure.'],
          ['DML', <code>INSERT, UPDATE, DELETE</code>, 'Modify stored rows.'],
          ['DQL', <code>SELECT</code>, 'Query stored rows.'],
          ['TCL', <code>COMMIT, ROLLBACK</code>, 'Control transactions.'],
        ]}
      />
      <CodeBlock
        language="sql"
        code={`CREATE TABLE Student (
  id INTEGER PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  major VARCHAR(40)
);

INSERT INTO Student(id, name, major)
VALUES (1, 'Ada', 'CS');`}
      />

      <NoteSectionTitle id="storage-fundamentals">20. Storage Fundamentals</NoteSectionTitle>
      <NoteParagraph>
        Storage systems are built around a simple fact: disk and network I/O are expensive compared with CPU and memory operations. DBMS storage engines
        organize data so common queries read as few pages as possible.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Physical Storage Ideas">
          <BulletList className="mb-0">
            <li>A block or page is a fixed-size unit transferred between disk and memory.</li>
            <li>A record is the physical representation of a tuple.</li>
            <li>A file is a collection of pages managed by the storage engine.</li>
            <li>A buffer pool caches pages in memory to avoid repeated disk reads.</li>
            <li>An access path is the method used to find rows, such as a scan or index lookup.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="records-pages-blocks-and-caching">21. Records, Pages, Blocks, and Caching</NoteSectionTitle>
      <NoteParagraph>
        Records are placed into pages. Pages move between disk and memory. The buffer manager decides which pages stay cached and which pages are evicted.
        Dirty pages have been modified in memory but not yet written back to disk.
      </NoteParagraph>
      <NoteTable
        headers={['term', 'meaning']}
        rows={[
          ['page or block', 'Fixed-size storage transfer unit.'],
          ['record', 'Physical stored tuple.'],
          ['buffer pool', 'Memory area used to cache pages.'],
          ['pin', 'Temporarily prevent a page from being evicted while it is in use.'],
          ['dirty page', 'A cached page with changes not yet written to disk.'],
          ['replacement policy', 'Rule for choosing which cached page to evict.'],
        ]}
      />

      <NoteSectionTitle id="index-structures">22. Index Structures</NoteSectionTitle>
      <NoteParagraph>
        An index is an auxiliary structure that helps locate records without scanning every page. It trades extra space and update work for faster reads.
        The best index depends on the query pattern.
      </NoteParagraph>
      <IndexCostExplorer />

      <NoteSectionTitle id="b-trees-and-b-plus-trees">23. B-Trees and B+ Trees</NoteSectionTitle>
      <NoteParagraph>
        B-trees and B+ trees are balanced search-tree indexes designed for page-based storage. They keep height small by storing many keys per node. A B+
        tree stores actual data pointers in leaves, and leaves are linked for efficient range scans.
      </NoteParagraph>
      <NoteTable
        headers={['property', 'why it matters']}
        rows={[
          ['balanced height', 'Lookup cost stays logarithmic in the number of indexed keys.'],
          ['high fanout', 'Each page contains many keys, so the tree has few levels.'],
          ['sorted leaves', 'Range queries can scan adjacent leaf pages.'],
          ['update maintenance', 'Inserts and deletes may split, merge, or redistribute nodes.'],
        ]}
      />

      <NoteSectionTitle id="hash-indexes-and-linear-hashing">24. Hash Indexes and Linear Hashing</NoteSectionTitle>
      <NoteParagraph>
        Hash indexes use a hash function to map search keys to buckets. They are strong for equality lookup, but they do not preserve order, so they are
        poor for range queries.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Hashing Concepts">
          <BulletList className="mb-0">
            <li>Static hashing fixes the number of buckets and can suffer when the table grows.</li>
            <li>Overflow pages handle buckets that receive too many records.</li>
            <li>Dynamic hashing changes the bucket structure as data grows.</li>
            <li>Linear hashing gradually splits buckets without requiring a full rehash at once.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="semistructured-data">25. Semistructured Data</NoteSectionTitle>
      <NoteParagraph>
        Semistructured data does not fit a rigid table schema as naturally as relational data. It often has nested structure, optional fields, repeated
        elements, and records with slightly different shapes.
      </NoteParagraph>
      <NoteTable
        headers={['format', 'shape']}
        rows={[
          ['XML', 'Tree of tagged elements and attributes.'],
          ['JSON', 'Objects, arrays, strings, numbers, booleans, and null.'],
          ['document data', 'A nested record that is often read or written as one unit.'],
        ]}
      />
      <CodeBlock
        language="json"
        code={`{
  "name": "Database Systems",
  "topics": ["SQL", "indexes", "transactions"],
  "credits": 4
}`}
      />

      <NoteSectionTitle id="xml-xpath-and-xquery">26. XML, XPath, and XQuery</NoteSectionTitle>
      <NoteParagraph>
        XML stores nested data with explicit tags. XPath navigates XML trees using path expressions. XQuery extends XPath with query constructs for
        iteration, binding, filtering, ordering, and returning results.
      </NoteParagraph>
      <NoteTable
        headers={['tool', 'role']}
        rows={[
          ['XML', 'Represents tree-shaped tagged data.'],
          ['XPath', 'Selects nodes using path expressions such as /course/start or //start.'],
          ['XQuery', 'Queries XML using expressions, including FLWOR.'],
          ['FLWOR', 'for, let, where, order by, return.'],
        ]}
      />
      <CodeBlock
        language="xquery"
        code={`for $course in //course
where $course/start = "10:10"
order by $course/title
return $course/title`}
      />

      <NoteSectionTitle id="logical-to-physical-mapping">27. Logical-to-Physical Mapping</NoteSectionTitle>
      <NoteParagraph>
        Logical-to-physical mapping connects tables, rows, and queries to files, pages, indexes, and execution plans. This is where a declarative query
        becomes concrete work.
      </NoteParagraph>
      <NoteTable
        headers={['logical idea', 'physical machinery']}
        rows={[
          ['relation', 'File or collection of pages.'],
          ['tuple', 'Record stored inside a page.'],
          ['attribute', 'Field encoded inside a record.'],
          ['selection predicate', 'Scan or index lookup.'],
          ['join', 'Nested loops, hash join, merge join, or index join.'],
          ['transaction', 'Locks, log records, dirty pages, and commit protocol.'],
        ]}
      />

      <NoteSectionTitle id="transactions-and-acid">28. Transactions and ACID</NoteSectionTitle>
      <NoteParagraph>
        A transaction is a sequence of database operations treated as one logical unit. ACID names the classic correctness properties: atomicity,
        consistency preservation, isolation, and durability.
      </NoteParagraph>
      <NoteTable
        headers={['ACID property', 'meaning']}
        rows={[
          ['Atomicity', 'All changes take effect, or none do.'],
          ['Consistency preservation', 'A transaction moves the database from one valid state to another valid state, assuming the transaction logic is correct.'],
          ['Isolation', 'Concurrent transactions do not interfere in a way that violates the chosen correctness guarantee.'],
          ['Durability', 'Committed changes survive crashes.'],
        ]}
      />
      <NoteParagraph>
        The DBMS can enforce many constraints, but it cannot understand every application rule. Application logic and database constraints share
        responsibility for consistency.
      </NoteParagraph>

      <NoteSectionTitle id="schedules-and-serializability">29. Schedules and Serializability</NoteSectionTitle>
      <NoteParagraph>
        A schedule is an ordering of operations from multiple transactions. A serial schedule runs transactions one at a time. A concurrent schedule
        interleaves operations. Serializability means an interleaved schedule has the same effect as some serial schedule.
      </NoteParagraph>
      <ScheduleExplorer />

      <NoteSectionTitle id="concurrency-control">30. Concurrency Control</NoteSectionTitle>
      <NoteParagraph>
        Concurrency control is the DBMS machinery that allows multiple transactions to run at the same time without producing unsafe interleavings. It
        balances correctness, throughput, latency, deadlocks, aborts, and implementation complexity.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Common Problems">
          <BulletList className="mb-0">
            <li>Lost update: one write overwrites another transaction's work.</li>
            <li>Dirty read: a transaction reads data written by another transaction that later aborts.</li>
            <li>Nonrepeatable read: a transaction reads the same row twice and sees different values.</li>
            <li>Phantom: a repeated predicate query sees newly inserted or removed rows.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="locking-and-two-phase-locking">31. Locking and Two-Phase Locking</NoteSectionTitle>
      <NoteParagraph>
        Locking is pessimistic concurrency control: prevent unsafe conflicts before they happen. Shared locks allow reads. Exclusive locks allow writes
        and exclude conflicting operations.
      </NoteParagraph>
      <NoteTable
        headers={['lock concept', 'meaning']}
        rows={[
          ['shared lock', 'Read lock. Multiple transactions can often hold shared locks on the same item.'],
          ['exclusive lock', 'Write lock. Conflicts with shared and exclusive locks.'],
          ['growing phase', 'Under two-phase locking, a transaction may acquire locks but not release them.'],
          ['shrinking phase', 'After releasing a lock, the transaction may release more locks but cannot acquire new ones.'],
          ['strict 2PL', 'Often holds write locks until commit or abort to avoid cascading aborts.'],
        ]}
      />
      <NoteParagraph>
        Two-phase locking ensures conflict-serializability, but it can create deadlocks and reduce concurrency.
      </NoteParagraph>

      <NoteSectionTitle id="deadlocks-and-optimistic-concurrency-control">32. Deadlocks and Optimistic Concurrency Control</NoteSectionTitle>
      <NoteParagraph>
        A deadlock occurs when transactions wait on each other in a cycle. Optimistic concurrency control takes the opposite attitude from locking:
        let transactions run speculatively, then validate before commit.
      </NoteParagraph>
      <NoteTable
        headers={['topic', 'key idea']}
        rows={[
          ['wait-for graph', 'Nodes are transactions; an edge means one waits for another. A cycle indicates deadlock.'],
          ['deadlock detection', 'Find cycles and abort a victim transaction.'],
          ['timeouts', 'Abort a transaction that waits too long.'],
          ['optimistic read phase', 'Transaction reads and computes without locking everything first.'],
          ['optimistic validation phase', 'Check whether conflicts make commit unsafe.'],
          ['optimistic write phase', 'Apply changes if validation succeeds.'],
        ]}
      />

      <NoteSectionTitle id="distributed-databases-and-replication">33. Distributed Databases and Replication</NoteSectionTitle>
      <NoteParagraph>
        A distributed database stores data across multiple machines. Distribution can improve capacity, throughput, locality, and availability, but it
        introduces network latency, partial failures, replication consistency, sharding, and distributed transaction problems.
      </NoteParagraph>
      <NoteTable
        headers={['idea', 'benefit', 'cost']}
        rows={[
          ['replication', 'Fault tolerance, read scalability, geographic locality.', 'Writes must propagate and replicas can disagree.'],
          ['sharding', 'More capacity and parallelism.', 'Queries must route to the right shard, and rebalancing is hard.'],
          ['synchronous replication', 'Stronger freshness guarantees.', 'Higher write latency and lower availability under failures.'],
          ['asynchronous replication', 'Lower write latency and better availability.', 'Replicas may be stale.'],
          ['quorums', 'Tune read/write coordination.', 'Requires careful choices of replica count and quorum sizes.'],
        ]}
      />

      <NoteSectionTitle id="mapreduce">34. MapReduce</NoteSectionTitle>
      <NoteParagraph>
        MapReduce is a model for processing large data sets across clusters. A map function emits intermediate key-value pairs. A reduce function
        aggregates all intermediate values for each key.
      </NoteParagraph>
      <AlgorithmBlock
        title="Word Count MapReduce"
        steps={[
          <span>Map: for each word <InlineMath math="w" /> in a document, emit <InlineMath math="(w,1)" />.</span>,
          'Shuffle: group intermediate values by word.',
          <span>Reduce: emit <InlineMath math="(w,\sum_i count_i)" /> for each word.</span>,
        ]}
      />
      <NoteTopicGroup>
        <NoteTopicBlock title="Execution Flow">
          <BulletList className="mb-0">
            <li>Split input into chunks.</li>
            <li>Run map tasks on chunks.</li>
            <li>Partition intermediate data by key.</li>
            <li>Run reduce tasks to aggregate each key's values.</li>
            <li>Re-execute failed tasks when workers fail.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="nosql-databases">35. NoSQL Databases</NoteSectionTitle>
      <NoteParagraph>
        NoSQL databases are alternatives to conventional relational systems. They often prioritize flexible schemas, horizontal scalability, high write
        throughput, simple access patterns, or document-shaped data.
      </NoteParagraph>
      <NoteTable
        headers={['NoSQL model', 'data shape', 'common strength']}
        rows={[
          ['key-value', 'key maps directly to value.', 'Very fast lookup by key.'],
          ['document', 'Nested JSON-like documents.', 'Natural fit for records read as a whole.'],
          ['column-family', 'Rows with sparse columns grouped for distributed storage.', 'High-scale writes and query-driven denormalization.'],
          ['graph', 'Nodes and edges.', 'Relationship traversal.'],
        ]}
      />
      <NoteParagraph>
        The usual tradeoff is that the application may take on more responsibility for joins, constraints, transactions, and denormalized data consistency.
      </NoteParagraph>

      <NoteSectionTitle id="mongodb-and-aggregation">36. MongoDB and Aggregation</NoteSectionTitle>
      <NoteParagraph>
        MongoDB stores JSON-like documents. Aggregation pipelines process documents through stages such as <code>$match</code>, <code>$group</code>,
        <code>$project</code>, and <code>$sort</code>.
      </NoteParagraph>
      <CodeBlock
        language="javascript"
        code={`db.oscars.aggregate([
  { $match: { type: "Best Director" } },
  { $group: { _id: "$person_id", wins: { $sum: 1 } } },
  { $match: { wins: { $gt: 1 } } },
  { $project: { person_id: "$_id", wins: 1, _id: 0 } }
]);`}
      />
      <NoteParagraph>
        A pipeline is like a sequence of relational operations, but the input and output at each stage are documents rather than flat tuples.
      </NoteParagraph>

      <NoteSectionTitle id="recovery-and-logging">37. Recovery and Logging</NoteSectionTitle>
      <NoteParagraph>
        Recovery is the DBMS subsystem responsible for atomicity and durability after crashes. The central tool is a log: a durable record of changes and
        transaction states.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Write-Ahead Logging">
          <NoteParagraph className="mb-0">
            Before a changed data page is written to disk, the log record describing that change must be forced to stable storage. The log contains enough
            information to redo committed changes and undo uncommitted changes.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="redo-undo-and-checkpointing">38. Redo, Undo, and Checkpointing</NoteSectionTitle>
      <NoteParagraph>
        Redo repeats committed changes that might not have reached disk. Undo reverses uncommitted changes that might have reached disk. Checkpointing
        records recovery metadata so crash recovery can start from a recent point instead of scanning the whole log.
      </NoteParagraph>
      <RecoveryExplorer />

      <NoteSectionTitle id="two-phase-commit">39. Two-Phase Commit</NoteSectionTitle>
      <NoteParagraph>
        Two-phase commit, or 2PC, is a protocol for distributed atomic commit. It is used when one transaction spans multiple participants and the system
        must ensure that all participants commit or all participants abort.
      </NoteParagraph>
      <NoteTable
        headers={['phase', 'what happens']}
        rows={[
          ['prepare / voting', 'The coordinator asks participants if they can commit. Participants vote yes or no.'],
          ['decision', 'If every vote is yes, the coordinator decides commit. Otherwise it decides abort.'],
          ['participant duty', 'A yes vote means the participant must save enough state to obey the later decision.'],
          ['blocking problem', 'If the coordinator crashes after a participant votes yes but before it learns the decision, the participant may have to wait.'],
        ]}
      />
      <NoteParagraph>
        2PC preserves atomicity, but it can sacrifice availability because uncertain participants cannot safely decide alone.
      </NoteParagraph>

      <NoteSectionTitle id="choosing-the-right-data-management-tool">40. Choosing the Right Data Management Tool</NoteSectionTitle>
      <NoteParagraph>
        Relational DBMSs are powerful, but one size does not fit all. The right tool depends on schema stability, query patterns, transaction needs,
        distribution needs, latency goals, operational complexity, and how naturally the data fits the model.
      </NoteParagraph>
      <ToolChoiceExplorer />
    </NotesLayout>
  );
}
