/**
 * Web Development Notes Page
 * A standalone note for practical software development, full-stack web apps, React, APIs, databases, deployment, and delivery.
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
  RelatedNotes,
} from '../../../components/notes';
import { useDarkMode } from '../../../hooks/useDarkMode';
import { ReactReconciliationRunner } from './CsAlgorithmRunners';

type TableRow = ReactNode[];

function useWebTheme() {
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
  const { listClass } = useWebTheme();
  return <ul className={`${listClass} ${className}`}>{children}</ul>;
}

function NoteTable({ headers, rows }: { headers: ReactNode[]; rows: TableRow[] }) {
  const { tableClass, tableHeadClass, tableCellClass } = useWebTheme();

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

function WebNotationGuide() {
  return (
    <NoteTopicGroup>
      <NoteTopicBlock title="Terminology Used Throughout">
        <BulletList className="mb-0">
          <li>A client is software that initiates a request. In web apps, this is usually the browser.</li>
          <li>A server receives requests, runs application logic, and returns responses.</li>
          <li>A route maps a URL pattern to code that handles that location or request.</li>
          <li>An endpoint is a callable API route, usually identified by an HTTP method and URL.</li>
          <li>A request carries a method, URL, headers, and sometimes a body. A response carries a status code, headers, and sometimes a body.</li>
          <li>State is information that can change over time, such as form input, logged-in user data, or database records.</li>
          <li>Persistence means data survives beyond one page render, request, or process lifetime.</li>
          <li><code>JSON</code> is a text format for structured data; APIs often send and receive JSON objects and arrays.</li>
          <li><code>HTML</code> describes document structure, <code>CSS</code> describes presentation, and <code>JavaScript</code> describes behavior.</li>
        </BulletList>
      </NoteTopicBlock>
    </NoteTopicGroup>
  );
}

function SdlcExplorer() {
  return (
    <NoteTable
      headers={['Phase', 'Main question', 'Typical output']}
      rows={[
        ['Requirements', 'What problem are we solving, and for whom?', 'User stories, acceptance criteria, constraints, and success measures.'],
        ['Design', 'What components, data, and interfaces are needed?', 'Wireframes, data models, API contracts, diagrams, and technical decisions.'],
        ['Implementation', 'How do we turn the design into working code?', 'Frontend components, backend routes, database queries, tests, and integration glue.'],
        ['Testing', 'How do we know the behavior matches the requirement?', 'Unit tests, integration tests, manual checks, bug reports, and fixed regressions.'],
        ['Deployment', 'How does the app run outside a developer laptop?', 'Build artifacts, environment variables, containers, cloud resources, and release steps.'],
        ['Maintenance', 'How does the app evolve after release?', 'Monitoring, documentation, refactors, dependency updates, and future feature planning.'],
      ]}
    />
  );
}

function WebRequestFlowDiagram() {
  const { subtlePanelClass, primaryColor, secondaryColor, mutedColor, textColor, panelFill } = useWebTheme();
  const boxes = [
    { label: 'Browser', sub: 'UI + JS', x: 28, y: 72, color: secondaryColor },
    { label: 'HTTP API', sub: 'method + URL', x: 164, y: 72, color: primaryColor },
    { label: 'Backend', sub: 'business logic', x: 300, y: 72, color: primaryColor },
    { label: 'Database', sub: 'persistent data', x: 436, y: 72, color: secondaryColor },
  ];

  return (
    <div className={`mb-8 rounded-lg border p-4 ${subtlePanelClass}`}>
      <svg viewBox="0 0 560 210" className="h-64 w-full" role="img" aria-label="A web request moving from browser to backend and database">
        <defs>
          <marker id="web-flow-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill={mutedColor} />
          </marker>
        </defs>
        {boxes.map((box) => (
          <g key={box.label}>
            <rect x={box.x} y={box.y} width="96" height="60" rx="8" fill={panelFill} stroke={box.color} strokeWidth="2" />
            <text x={box.x + 48} y={box.y + 25} textAnchor="middle" fontFamily="monospace" fontSize="13" fontWeight="700" fill={textColor}>{box.label}</text>
            <text x={box.x + 48} y={box.y + 45} textAnchor="middle" fontFamily="monospace" fontSize="11" fill={textColor}>{box.sub}</text>
          </g>
        ))}
        <line x1="124" y1="102" x2="158" y2="102" stroke={mutedColor} strokeWidth="2.4" markerEnd="url(#web-flow-arrow)" />
        <line x1="260" y1="102" x2="294" y2="102" stroke={mutedColor} strokeWidth="2.4" markerEnd="url(#web-flow-arrow)" />
        <line x1="396" y1="102" x2="430" y2="102" stroke={mutedColor} strokeWidth="2.4" markerEnd="url(#web-flow-arrow)" />
        <path d="M484 140 C430 178, 246 178, 86 140" fill="none" stroke={mutedColor} strokeWidth="2" strokeDasharray="5 5" markerEnd="url(#web-flow-arrow)" />
        <text x="284" y="184" textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>response returns data/status to the browser</text>
      </svg>
      <NoteParagraph className="mb-0 text-sm">
        A web application is easier to reason about when every feature is traced as a request, server decision, data operation, and response back to the interface.
      </NoteParagraph>
    </div>
  );
}

type DomNodeKey = 'html' | 'head' | 'body' | 'main' | 'button' | 'ul' | 'li';

function DomTreeExplorer() {
  const { isDarkMode, subtlePanelClass, primaryColor, secondaryColor, mutedColor } = useWebTheme();
  const [selected, setSelected] = useState<DomNodeKey>('button');
  const nodes: Record<DomNodeKey, { label: string; role: string; js: string; css: string }> = {
    html: { label: '<html>', role: 'Root element for the document.', js: 'document.documentElement', css: 'html { font-family: system-ui; }' },
    head: { label: '<head>', role: 'Metadata, title, links, and scripts that are not page content.', js: 'document.querySelector("head")', css: 'metadata is not rendered as normal content' },
    body: { label: '<body>', role: 'Visible page content and interactive UI live here.', js: 'document.body', css: 'body { margin: 0; }' },
    main: { label: '<main>', role: 'Primary content region for the page.', js: 'document.querySelector("main")', css: 'main { max-width: 72rem; }' },
    button: { label: '<button>', role: 'Semantic clickable control.', js: 'button.addEventListener("click", handleClick)', css: 'button:hover { transform: translateY(-1px); }' },
    ul: { label: '<ul>', role: 'Unordered list container.', js: 'list.appendChild(newItem)', css: 'ul { padding-left: 1.5rem; }' },
    li: { label: '<li>', role: 'One list item inside a list.', js: 'item.textContent = "Deploy"', css: 'li + li { margin-top: .5rem; }' },
  };
  const treeRows: { key: DomNodeKey; indent: number }[] = [
    { key: 'html', indent: 0 },
    { key: 'head', indent: 1 },
    { key: 'body', indent: 1 },
    { key: 'main', indent: 2 },
    { key: 'button', indent: 3 },
    { key: 'ul', indent: 3 },
    { key: 'li', indent: 4 },
  ];
  const current = nodes[selected];

  return (
    <InteractiveBlock title="DOM Tree Explorer">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <div className="space-y-2">
            {treeRows.map((row) => (
              <button
                key={row.key}
                type="button"
                onClick={() => setSelected(row.key)}
                className={`block w-full rounded-md border px-3 py-2 text-left font-mono text-sm transition ${
                  selected === row.key
                    ? isDarkMode
                      ? 'border-green-400 bg-green-400 text-black'
                      : 'border-blue-600 bg-blue-600 text-white'
                    : 'border-current/20 bg-transparent'
                }`}
                style={{ paddingLeft: `${12 + row.indent * 18}px` }}
              >
                {row.indent > 0 ? 'L '.repeat(row.indent) : ''}
                {nodes[row.key].label}
              </button>
            ))}
          </div>
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <div className="mb-4 flex items-center gap-3">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: primaryColor }} />
            <h4 className="font-mono text-base font-bold">{current.label}</h4>
          </div>
          <NoteTable
            headers={['view', 'meaning']}
            rows={[
              ['semantic role', current.role],
              ['JavaScript access', <code>{current.js}</code>],
              ['CSS styling', <code>{current.css}</code>],
            ]}
          />
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded border border-current/20 px-2 py-1" style={{ color: primaryColor }}>HTML creates nodes</span>
            <span className="rounded border border-current/20 px-2 py-1" style={{ color: secondaryColor }}>CSS styles nodes</span>
            <span className="rounded border border-current/20 px-2 py-1" style={{ color: mutedColor }}>JS reads and mutates nodes</span>
          </div>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function ApiPaginationExplorer() {
  const { subtlePanelClass } = useWebTheme();
  const [page, setPage] = useState(2);
  const [limit, setLimit] = useState(5);
  const total = 23;
  const pageCount = Math.ceil(total / limit);
  const safePage = Math.min(page, pageCount);
  const offset = (safePage - 1) * limit;
  const visibleItems = useMemo(
    () => Array.from({ length: Math.max(0, Math.min(limit, total - offset)) }, (_, index) => `item_${offset + index + 1}`),
    [limit, offset],
  );

  return (
    <InteractiveBlock title="API Pagination">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 block text-sm font-bold" htmlFor="pagination-page">Page: {safePage}</label>
          <input
            id="pagination-page"
            type="range"
            min="1"
            max={pageCount}
            value={safePage}
            onChange={(event) => setPage(Number(event.target.value))}
            className="mb-4 w-full"
          />
          <label className="mb-2 block text-sm font-bold" htmlFor="pagination-limit">Items per page: {limit}</label>
          <input
            id="pagination-limit"
            type="range"
            min="3"
            max="8"
            value={limit}
            onChange={(event) => setLimit(Number(event.target.value))}
            className="w-full"
          />
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <CodeBlock language="http" code={`GET /api/items?page=${safePage}&limit=${limit}`} className="mb-4" />
          <NoteTable
            headers={['field', 'value']}
            rows={[
              ['total items', total],
              ['page count', pageCount],
              ['offset', <><InlineMath math="(page - 1)\cdot limit" /> = {offset}</>],
              ['returned IDs', visibleItems.join(', ')],
            ]}
          />
          <NoteParagraph className="mb-0 text-sm">
            Pagination keeps large collections usable by returning a slice plus enough metadata for the client to request the next slice.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function ReactStateExplorer() {
  const { isDarkMode, subtlePanelClass } = useWebTheme();
  const [count, setCount] = useState(1);
  const [selected, setSelected] = useState<'open' | 'closed'>('open');
  const message = selected === 'open' ? 'The panel is visible.' : 'The panel is hidden.';

  return (
    <InteractiveBlock title="React State and Renders">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <div className="mb-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCount((value) => value + 1)}
              className={`rounded-md px-3 py-2 text-sm font-bold ${
                isDarkMode ? 'bg-green-400 text-black' : 'bg-blue-600 text-white'
              }`}
            >
              increment
            </button>
            <button
              type="button"
              onClick={() => setCount(1)}
              className="rounded-md border border-current/20 px-3 py-2 text-sm font-bold"
            >
              reset
            </button>
          </div>
          <label className="mb-2 block text-sm font-bold" htmlFor="react-panel-mode">Panel state</label>
          <select
            id="react-panel-mode"
            value={selected}
            onChange={(event) => setSelected(event.target.value as 'open' | 'closed')}
            className="w-full rounded border border-current/20 bg-transparent p-2 text-sm"
          >
            <option value="open">open</option>
            <option value="closed">closed</option>
          </select>
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <CodeBlock
            language="tsx"
            code={`const [count, setCount] = useState(${count});
const [panel, setPanel] = useState("${selected}");`}
            className="mb-4"
          />
          <div className="rounded-lg border border-current/20 p-4">
            <p className="mb-2 font-mono text-sm font-bold">Rendered UI</p>
            <p className="mb-2 font-mono text-sm">Count: {count}</p>
            {selected === 'open' && <p className="font-mono text-sm">{message}</p>}
            {selected === 'closed' && <p className="font-mono text-sm opacity-70">{message}</p>}
          </div>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function RenderingModeExplorer() {
  return (
    <NoteTable
      headers={['Mode', 'First HTML', 'Where data work happens', 'Main tradeoff']}
      rows={[
        ['CSR', 'Mostly an empty shell until JavaScript loads.', 'The browser fetches data after the app starts.', 'Highly interactive, but first meaningful content can be delayed.'],
        ['SSR', 'Server returns HTML for the current request.', 'Server fetches data during request handling.', 'Good initial content, but each uncached request uses server work.'],
        ['SSG', 'HTML is generated ahead of time.', 'Data is fetched at build time or revalidation time.', 'Fast and cacheable, but less ideal for per-user live data.'],
        ['Server Components', 'Server builds component output without shipping all component code to the browser.', 'Server components can read server-side data sources directly.', 'Reduces client JavaScript, but interactive pieces still need client components.'],
      ]}
    />
  );
}

type JoinMode = 'inner' | 'left' | 'right' | 'full';

const joinUsers = [
  { id: 1, name: 'Ada' },
  { id: 2, name: 'Linus' },
  { id: 3, name: 'Grace' },
];

const joinTasks = [
  { id: 10, userId: 1, title: 'Design API' },
  { id: 11, userId: 1, title: 'Write tests' },
  { id: 12, userId: 4, title: 'Deploy app' },
];

function SqlJoinExplorer() {
  const { subtlePanelClass } = useWebTheme();
  const [joinMode, setJoinMode] = useState<JoinMode>('left');
  const rows = useMemo(() => {
    const matches = joinUsers.flatMap((user) =>
      joinTasks
        .filter((task) => task.userId === user.id)
        .map((task) => ({ user: user.name, task: task.title, reason: 'matching user_id' })),
    );
    if (joinMode === 'inner') return matches;
    if (joinMode === 'left') {
      return joinUsers.flatMap((user) => {
        const owned = joinTasks.filter((task) => task.userId === user.id);
        return owned.length
          ? owned.map((task) => ({ user: user.name, task: task.title, reason: 'matching user_id' }))
          : [{ user: user.name, task: 'NULL', reason: 'user kept without task' }];
      });
    }
    if (joinMode === 'right') {
      return joinTasks.map((task) => {
        const owner = joinUsers.find((user) => user.id === task.userId);
        return { user: owner?.name ?? 'NULL', task: task.title, reason: owner ? 'matching user_id' : 'task kept without user' };
      });
    }
    return [
      ...joinUsers.flatMap((user) => {
        const owned = joinTasks.filter((task) => task.userId === user.id);
        return owned.length
          ? owned.map((task) => ({ user: user.name, task: task.title, reason: 'matching user_id' }))
          : [{ user: user.name, task: 'NULL', reason: 'user kept without task' }];
      }),
      ...joinTasks
        .filter((task) => !joinUsers.some((user) => user.id === task.userId))
        .map((task) => ({ user: 'NULL', task: task.title, reason: 'task kept without user' })),
    ];
  }, [joinMode]);

  return (
    <InteractiveBlock title="SQL Join Intuition">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 block text-sm font-bold" htmlFor="join-mode">Join</label>
          <select
            id="join-mode"
            value={joinMode}
            onChange={(event) => setJoinMode(event.target.value as JoinMode)}
            className="mb-4 w-full rounded border border-current/20 bg-transparent p-2 text-sm"
          >
            <option value="inner">INNER JOIN</option>
            <option value="left">LEFT JOIN</option>
            <option value="right">RIGHT JOIN</option>
            <option value="full">FULL OUTER JOIN</option>
          </select>
          <CodeBlock
            language="sql"
            code={`SELECT users.name, tasks.title
FROM users
${joinMode === 'inner' ? 'INNER' : joinMode === 'left' ? 'LEFT' : joinMode === 'right' ? 'RIGHT' : 'FULL OUTER'} JOIN tasks
  ON users.id = tasks.user_id;`}
            className="mb-0"
          />
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <NoteTable
            headers={['user', 'task', 'why included']}
            rows={rows.map((row) => [row.user, row.task, row.reason])}
          />
          <NoteParagraph className="mb-0 text-sm">
            A join is a controlled way to combine rows. The join condition decides which rows match; the join type decides which unmatched rows survive.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function DockerBuildExplorer() {
  return (
    <NoteTable
      headers={['Stage', 'Purpose', 'Contains']}
      rows={[
        ['Base image', 'Choose the operating system and runtime family.', 'Node, Python, nginx, or another runtime foundation.'],
        ['Dependencies', 'Install packages in a repeatable environment.', 'package-lock.json, node_modules, Python wheels, or system packages.'],
        ['Build', 'Compile, bundle, or transpile source code.', 'Generated static assets, optimized JS bundles, and CSS output.'],
        ['Runtime', 'Run only what the deployed app needs.', 'A server process or static file server plus final artifacts.'],
      ]}
    />
  );
}

function TestStrategyExplorer() {
  return (
    <NoteTable
      headers={['Level', 'Checks', 'Best use']}
      rows={[
        ['Unit', 'One function, method, or small module in isolation.', 'Pure logic, validation, formatting, and edge cases.'],
        ['Component', 'A UI component with props, state, and user events.', 'Form behavior, conditional rendering, and component contracts.'],
        ['Integration', 'Several parts together, such as API route plus database.', 'Catching mismatches between components, schemas, and services.'],
        ['End-to-end', 'A realistic user path through the deployed-style app.', 'Critical user flows and broad regression coverage.'],
      ]}
    />
  );
}

function NetworkLocatorExplorer() {
  const { subtlePanelClass } = useWebTheme();
  const [url, setUrl] = useState('https://api.example.com:443/v1/items?page=2');
  const parsed = useMemo(() => {
    const parsedUrl = new URL(url);
    const defaultPort = parsedUrl.protocol === 'https:' ? '443' : parsedUrl.protocol === 'http:' ? '80' : '';
    return {
      protocol: parsedUrl.protocol.replace(':', ''),
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || defaultPort,
      pathname: parsedUrl.pathname,
      query: parsedUrl.search || '(none)',
    };
  }, [url]);

  return (
    <InteractiveBlock title="URL, DNS, and Port Breakdown">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,360px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 block text-sm font-bold" htmlFor="url-example">Example URL</label>
          <select
            id="url-example"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            className="w-full rounded border border-current/20 bg-transparent p-2 text-sm"
          >
            <option value="https://api.example.com:443/v1/items?page=2">https://api.example.com:443/v1/items?page=2</option>
            <option value="http://localhost:5173/notes/web-development">http://localhost:5173/notes/web-development</option>
            <option value="https://example.org/login?next=/dashboard">https://example.org/login?next=/dashboard</option>
          </select>
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <NoteTable
            headers={['part', 'value']}
            rows={[
              ['scheme', parsed.protocol],
              ['host name', parsed.hostname],
              ['port', parsed.port],
              ['path', parsed.pathname],
              ['query string', parsed.query],
              ['network idea', 'DNS maps the host name to an IP address; the port selects the process listening on that machine.'],
            ]}
          />
        </div>
      </div>
    </InteractiveBlock>
  );
}

export default function WebDevelopmentNote() {
  return (
    <NotesLayout>
      <NoteHeader
        title="Web Development"
        subtitle="Build practical web applications by connecting product thinking, frontend interfaces, backend APIs, databases, security, testing, and deployment."
      />

      <RelatedNotes
        links={[
          { href: '/notes/web-frameworks-and-tooling', label: 'Web Frameworks and Tooling', note: 'React, hooks, Next.js, API clients, FastAPI, Flask, SQLAlchemy, testing, Docker, Git, and deployment.' },
          { href: '/notes/sql', label: 'SQL', note: 'Relational querying for backend data access and persistence.' },
        ]}
      />

      <WebNotationGuide />

      <NoteSectionTitle id="web-development-and-practical-software-development">1. Web Development and Practical Software Development</NoteSectionTitle>
      <NoteParagraph>
        Web development is the practice of building software that people use through networked interfaces, most often a browser. The important shift from
        small programming exercises is that the work is no longer only about writing correct code. It is also about understanding users, coordinating with
        teammates, managing changing requirements, deploying reliably, and keeping the system understandable after it grows.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="The Practical Stack">
          <BulletList className="mb-0">
            <li>Product thinking defines the user need and the task the software should support.</li>
            <li>Frontend code renders the interface and handles browser-side interaction.</li>
            <li>Backend code validates requests, applies business rules, and protects data access.</li>
            <li>Databases preserve shared state and let the app query it efficiently.</li>
            <li>Deployment, testing, documentation, and security make the app usable by people other than its author.</li>
          </BulletList>
        </NoteTopicBlock>
        <NoteTopicBlock title="Core Intuition">
          <NoteParagraph className="mb-0">
            A web app is a conversation between layers. The browser asks for pages or data, the server decides what is allowed and what should happen,
            and storage remembers the result. Bugs often appear where those layers make different assumptions.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="software-development-lifecycle">2. Software Development Lifecycle</NoteSectionTitle>
      <NoteParagraph>
        A software development lifecycle is a way to organize work from idea to maintained product. It gives names to recurring activities:
        requirements, design, implementation, testing, deployment, and maintenance. Real projects move back and forth between these steps, but skipping
        any of them usually creates confusion later.
      </NoteParagraph>
      <SdlcExplorer />

      <NoteSectionTitle id="agile-development">3. Agile Development</NoteSectionTitle>
      <NoteParagraph>
        Agile development is an iterative approach where teams deliver small increments, get feedback, and adjust. The key idea is that uncertainty is
        normal. Instead of pretending every detail is known upfront, the team keeps the feedback loop short.
      </NoteParagraph>
      <NoteTable
        headers={['idea', 'meaning']}
        rows={[
          ['iteration or sprint', 'A short work cycle with a planned set of goals.'],
          ['backlog', 'An ordered list of work items, bugs, features, and improvements.'],
          ['standup', 'A brief coordination meeting focused on progress, plans, and blockers.'],
          ['retrospective', 'A meeting to improve the team process itself.'],
          ['increment', 'A working slice of the product that can be reviewed or shipped.'],
        ]}
      />
      <NoteParagraph>
        Agile is not a license to be disorganized. It works when small plans are explicit, completed work is demonstrable, and feedback changes the next
        decision.
      </NoteParagraph>

      <NoteSectionTitle id="user-stories-and-acceptance-criteria">4. User Stories and Acceptance Criteria</NoteSectionTitle>
      <NoteParagraph>
        A user story describes a feature from the perspective of someone who benefits from it. The common shape is: as a user role, I want a capability,
        so that I get a specific value. Acceptance criteria turn that story into testable conditions.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Example Story">
          <NoteParagraph className="mb-3">
            As a volunteer, I want to filter available pickup times so that I can choose one that fits my schedule.
          </NoteParagraph>
          <BulletList className="mb-0">
            <li>Given several pickup times.</li>
            <li>When I select a date filter.</li>
            <li>Then only matching pickup times are shown.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>
      <NoteTopicGroup>
        <NoteTopicBlock title="Why This Helps">
          <BulletList className="mb-0">
            <li>The role prevents building for an abstract user with no real needs.</li>
            <li>The value explains why the feature exists.</li>
            <li>The criteria give developers and reviewers a shared definition of done.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="team-software-development">5. Team Software Development</NoteSectionTitle>
      <NoteParagraph>
        Team software work is coordination under technical uncertainty. The same codebase may be touched by several people, so clarity matters:
        naming, documentation, review comments, issue tracking, branch strategy, and commit history all affect how quickly the team can move.
      </NoteParagraph>
      <NoteTable
        headers={['practice', 'purpose']}
        rows={[
          ['small pull requests', 'Make review easier and reduce merge conflicts.'],
          ['clear issues', 'Separate product intent from implementation details.'],
          ['code review', 'Catch bugs, share knowledge, and keep conventions consistent.'],
          ['shared style', 'Make code look like one project instead of several personal projects.'],
          ['ownership without silos', 'Let people lead areas while keeping enough shared context to avoid blockers.'],
        ]}
      />

      <NoteSectionTitle id="full-stack-project-delivery">6. Full-Stack Project Delivery</NoteSectionTitle>
      <NoteParagraph>
        A full-stack project ties together product requirements, frontend screens, backend routes, persistence, deployment, and presentation. The main
        challenge is integration: each layer can look correct alone while the complete user path still fails.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Delivery Checklist">
          <BulletList className="mb-0">
            <li>Define the primary user tasks before choosing implementation details.</li>
            <li>Design the data model and API shape early enough to unblock frontend and backend work.</li>
            <li>Keep a runnable demo path at all times, even if some features are incomplete.</li>
            <li>Record setup, environment variables, and deployment steps while they are fresh.</li>
            <li>Use final review to explain both what was built and why the design choices make sense.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="anatomy-of-a-web-application">7. Anatomy of a Web Application</NoteSectionTitle>
      <NoteParagraph>
        Most web apps have the same high-level shape: browser UI, HTTP requests, server logic, data storage, and external services. Frameworks change the
        developer experience, but the request-response structure remains the foundation.
      </NoteParagraph>
      <WebRequestFlowDiagram />
      <NoteTable
        headers={['piece', 'responsibility']}
        rows={[
          ['browser', 'Renders HTML/CSS, runs JavaScript, stores limited local state, and sends HTTP requests.'],
          ['frontend app', 'Organizes UI into screens and components, handles interaction, and displays data.'],
          ['backend app', 'Handles API routes, validation, authentication, authorization, and domain logic.'],
          ['database', 'Stores persistent records and supports queries.'],
          ['external API', 'Provides a service owned by another system, such as payment, maps, email, or identity.'],
        ]}
      />

      <NoteSectionTitle id="html-and-css">8. HTML and CSS</NoteSectionTitle>
      <NoteParagraph>
        HTML gives the page semantic structure. CSS controls visual presentation. Good HTML is not just a pile of tags; it communicates meaning to the
        browser, accessibility tools, search engines, and future developers.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="HTML Concepts">
          <BulletList className="mb-0">
            <li>Elements are written with tags such as <code>&lt;main&gt;</code>, <code>&lt;button&gt;</code>, and <code>&lt;form&gt;</code>.</li>
            <li>Attributes add information such as <code>href</code>, <code>src</code>, <code>alt</code>, <code>type</code>, and <code>aria-label</code>.</li>
            <li>Semantic elements describe purpose, not appearance.</li>
            <li>Forms collect user input and submit data.</li>
          </BulletList>
        </NoteTopicBlock>
        <NoteTopicBlock title="CSS Concepts">
          <BulletList className="mb-0">
            <li>Selectors choose elements; declarations assign properties and values.</li>
            <li>The box model describes content, padding, border, and margin.</li>
            <li>Flexbox and grid are layout systems for one-dimensional and two-dimensional arrangement.</li>
            <li>Responsive design uses relative units, media queries, and flexible layouts to support multiple viewport sizes.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="javascript-and-the-dom">9. JavaScript and the DOM</NoteSectionTitle>
      <NoteParagraph>
        JavaScript adds behavior to the page. The Document Object Model, or DOM, is the browser's tree representation of the HTML document. JavaScript can
        read that tree, listen for events, and update nodes.
      </NoteParagraph>
      <DomTreeExplorer />
      <NoteParagraph>
        Modern React apps do not usually mutate DOM nodes by hand for ordinary UI changes. Instead, React updates the DOM from component state. Still,
        understanding the DOM explains what React ultimately changes.
      </NoteParagraph>

      <NoteSectionTitle id="http-urls-apis-and-pagination">10. HTTP, URLs, APIs, and Pagination</NoteSectionTitle>
      <NoteParagraph>
        HTTP is the application protocol browsers and web servers use to communicate. A URL identifies where the request goes. An API defines what
        requests are valid, what data they require, and what responses they return.
      </NoteParagraph>
      <NoteTable
        headers={['HTTP idea', 'meaning']}
        rows={[
          [<code>GET</code>, 'Retrieve a resource. It should not change server state.'],
          [<code>POST</code>, 'Create something or trigger an operation with a request body.'],
          [<code>PUT</code>, 'Replace a resource with the supplied representation.'],
          [<code>PATCH</code>, 'Partially update a resource.'],
          [<code>DELETE</code>, 'Delete a resource or mark it removed.'],
          ['status code', 'A numeric result, such as 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, or 500 Server Error.'],
        ]}
      />
      <ApiPaginationExplorer />

      <NoteSectionTitle id="web-frameworks">11. Web Frameworks</NoteSectionTitle>
      <NoteParagraph>
        A web framework packages common decisions so developers can focus on the app's domain. Frameworks usually provide routing, rendering, state
        patterns, build tooling, and conventions for organizing files.
      </NoteParagraph>
      <NoteTable
        headers={['framework concern', 'example question']}
        rows={[
          ['routing', 'Which code handles this URL?'],
          ['rendering', 'Is HTML created in the browser, on the server, or ahead of time?'],
          ['data loading', 'Where does the component get the data it needs?'],
          ['forms and mutations', 'How does user input change server state?'],
          ['deployment model', 'Is the output static files, a server process, serverless functions, or a mix?'],
        ]}
      />

      <NoteSectionTitle id="react-components-props-and-state">12. React Components, Props, and State</NoteSectionTitle>
      <NoteParagraph>
        React builds user interfaces from components. A component is a function that returns UI. Props are inputs passed from a parent component. State is
        data owned by a component that can change and cause React to render again.
      </NoteParagraph>
      <ReactStateExplorer />
      <ReactReconciliationRunner />
      <NoteTopicGroup>
        <NoteTopicBlock title="React Data Flow">
          <BulletList className="mb-0">
            <li>Props flow down from parent to child.</li>
            <li>Events flow up by calling callback props.</li>
            <li>State should live in the smallest component that needs to own it.</li>
            <li>Derived values should usually be computed from existing state instead of stored separately.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="react-hooks-usestate-and-useeffect">13. React Hooks: useState and useEffect</NoteSectionTitle>
      <NoteParagraph>
        Hooks let function components use React features. <code>useState</code> stores component state. <code>useEffect</code> runs side effects after
        render, such as subscribing to something, updating the document title, or fetching data in client-rendered code.
      </NoteParagraph>
      <CodeBlock
        language="tsx"
        code={`function SearchBox() {
  const [query, setQuery] = useState("");

  useEffect(() => {
    document.title = query ? "Search: " + query : "Search";
  }, [query]);

  return <input value={query} onChange={(event) => setQuery(event.target.value)} />;
}`}
      />
      <NoteParagraph>
        The dependency array tells React when the effect should run again. If an effect reads a value that can change, that value usually belongs in the
        dependency array.
      </NoteParagraph>

      <NoteSectionTitle id="api-calls-with-fetch-and-axios">14. API Calls with Fetch and Axios</NoteSectionTitle>
      <NoteParagraph>
        Frontend code calls APIs to load or mutate data. A robust API call tracks at least three states: loading, success, and error. User interfaces
        should make each state visible instead of assuming the request always succeeds instantly.
      </NoteParagraph>
      <CodeBlock
        language="ts"
        code={`async function loadItems() {
  const response = await fetch("/api/items");

  if (!response.ok) {
    throw new Error("Request failed with status " + response.status);
  }

  return response.json();
}`}
      />
      <NoteTable
        headers={['concern', 'implementation check']}
        rows={[
          ['loading', 'Disable duplicate actions or show progress while the request is in flight.'],
          ['errors', 'Show a useful message and preserve enough detail for debugging.'],
          ['validation', 'Do not trust client input; validate again on the server.'],
          ['cancellation', 'Avoid setting state from outdated responses when users change screens quickly.'],
          ['secrets', 'Never put private API keys in browser code.'],
        ]}
      />

      <NoteSectionTitle id="styling-and-component-libraries">15. Styling and Component Libraries</NoteSectionTitle>
      <NoteParagraph>
        Styling choices affect speed, consistency, accessibility, and maintainability. A component library can accelerate common UI work, but it also
        brings conventions that the app should follow consistently.
      </NoteParagraph>
      <NoteTable
        headers={['approach', 'strength', 'watch out for']}
        rows={[
          ['plain CSS', 'Universal, explicit, and framework-independent.', 'Large stylesheets need naming discipline.'],
          ['CSS modules', 'Local class names reduce accidental collisions.', 'Styles can become fragmented across many files.'],
          ['utility classes', 'Fast layout and spacing directly in markup.', 'Markup can become noisy without conventions.'],
          ['component library', 'Accessible primitives and consistent widgets.', 'Custom design may fight the library defaults.'],
        ]}
      />

      <NoteSectionTitle id="typescript">16. TypeScript</NoteSectionTitle>
      <NoteParagraph>
        TypeScript adds static types to JavaScript. Static means the checker reasons about code before it runs. Types do not replace runtime validation,
        but they catch many mismatches between components, functions, and API shapes.
      </NoteParagraph>
      <CodeBlock
        language="ts"
        code={`type User = {
  id: number;
  name: string;
  role: "admin" | "member";
};

function canEdit(user: User) {
  return user.role === "admin";
}`}
      />
      <NoteTopicGroup>
        <NoteTopicBlock title="Useful TypeScript Vocabulary">
          <BulletList className="mb-0">
            <li>A type alias names a shape or union.</li>
            <li>An interface names an object shape and can be extended.</li>
            <li>A union type allows one of several possibilities.</li>
            <li>A generic type uses a type parameter, such as <code>Array&lt;User&gt;</code>.</li>
            <li>Type narrowing refines a broad type after a check, such as an <code>if</code> statement.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="next-js">17. Next.js</NoteSectionTitle>
      <NoteParagraph>
        Next.js is a React framework that adds file-based routing, server rendering, static generation, API-style server code, image optimization, and
        deployment conventions. It is useful when an app needs more than client-only React.
      </NoteParagraph>
      <NoteTable
        headers={['Next.js feature', 'why it matters']}
        rows={[
          ['file-based routing', 'Routes are created from the project directory structure.'],
          ['layouts', 'Shared UI can wrap groups of routes without being rebuilt manually on every page.'],
          ['server rendering', 'HTML can be produced before it reaches the browser.'],
          ['server components', 'Some component work can stay on the server and avoid extra client JavaScript.'],
          ['server actions', 'Forms and mutations can run server-side code without a separate manual API route for every case.'],
        ]}
      />

      <NoteSectionTitle id="client-side-rendering-server-side-rendering-and-hydration">18. Client-Side Rendering, Server-Side Rendering, and Hydration</NoteSectionTitle>
      <NoteParagraph>
        Rendering is the process of turning data and components into visible UI. Client-side rendering does most of that in the browser. Server-side
        rendering sends already-built HTML for a request. Static generation builds HTML ahead of time. Hydration attaches browser behavior to HTML that
        already exists.
      </NoteParagraph>
      <RenderingModeExplorer />

      <NoteSectionTitle id="next-js-server-components-client-components-and-server-actions">19. Next.js Server Components, Client Components, and Server Actions</NoteSectionTitle>
      <NoteParagraph>
        Server components run on the server and can access server-side resources without shipping their component code to the browser. Client components
        run in the browser and can use state, effects, event handlers, and browser APIs. A file marked with <code>"use client"</code> becomes a client
        component boundary.
      </NoteParagraph>
      <NoteTable
        headers={['piece', 'belongs where?', 'reason']}
        rows={[
          ['database query for initial page data', 'server component', 'The database should not be exposed to the browser.'],
          ['button click that opens a modal', 'client component', 'The click event happens in the browser.'],
          ['form mutation that writes to the database', 'server action or API route', 'The server must validate and persist the change.'],
          ['shared display component with no interactivity', 'often server component', 'It can render without shipping extra client JavaScript.'],
        ]}
      />

      <NoteSectionTitle id="backend-development">20. Backend Development</NoteSectionTitle>
      <NoteParagraph>
        Backend development is the server-side part of a web application. It handles requests, validates data, applies business rules, authenticates
        users, checks authorization, talks to databases, and returns responses.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Backend Responsibilities">
          <BulletList className="mb-0">
            <li>Define routes and handlers.</li>
            <li>Validate request parameters and bodies.</li>
            <li>Translate domain operations into database queries or service calls.</li>
            <li>Return correct status codes and response bodies.</li>
            <li>Keep secrets and privileged operations on the server.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="fastapi-and-flask">21. FastAPI and Flask</NoteSectionTitle>
      <NoteParagraph>
        Flask and FastAPI are Python web frameworks. Flask is small and flexible. FastAPI adds modern type-driven request validation and automatic API
        documentation through OpenAPI.
      </NoteParagraph>
      <NoteTable
        headers={['framework', 'style', 'good fit']}
        rows={[
          ['Flask', 'Minimal route handlers with extensions as needed.', 'Small apps, simple APIs, and projects where explicit wiring is preferred.'],
          ['FastAPI', 'Typed request and response models with async support.', 'APIs where validation, documentation, and type hints are central.'],
        ]}
      />
      <CodeBlock
        language="python"
        code={`from fastapi import FastAPI

app = FastAPI()

@app.get("/items/{item_id}")
def read_item(item_id: int):
    return {"item_id": item_id}`}
      />

      <NoteSectionTitle id="relational-databases-and-sql">22. Relational Databases and SQL</NoteSectionTitle>
      <NoteParagraph>
        A relational database stores data in tables. A table has rows and columns. A row is one record. A column is one named field. SQL is the language
        used to define, query, insert, update, and delete relational data.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Database Vocabulary">
          <BulletList className="mb-0">
            <li>A primary key uniquely identifies a row in a table.</li>
            <li>A foreign key stores a reference to a row in another table.</li>
            <li>A schema defines tables, columns, types, and constraints.</li>
            <li>A constraint is a rule the database enforces, such as uniqueness or non-null values.</li>
            <li>An index is an auxiliary structure that speeds up lookups at the cost of storage and write overhead.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="sql-joins-and-sql-categories">23. SQL Joins and SQL Categories</NoteSectionTitle>
      <NoteParagraph>
        Joins combine rows from multiple tables. They are central because relational design intentionally splits data into separate tables to avoid
        duplication and preserve consistency.
      </NoteParagraph>
      <SqlJoinExplorer />
      <NoteTable
        headers={['SQL category', 'examples', 'purpose']}
        rows={[
          ['DDL', <code>CREATE, ALTER, DROP</code>, 'Define or change database structure.'],
          ['DML', <code>INSERT, UPDATE, DELETE</code>, 'Change stored records.'],
          ['DQL', <code>SELECT</code>, 'Query records.'],
          ['DCL', <code>GRANT, REVOKE</code>, 'Control permissions.'],
          ['TCL', <code>COMMIT, ROLLBACK</code>, 'Control transactions.'],
        ]}
      />

      <NoteSectionTitle id="sqlalchemy">24. SQLAlchemy</NoteSectionTitle>
      <NoteParagraph>
        SQLAlchemy is a Python toolkit for working with relational databases. It can be used as a SQL expression builder or as an ORM. ORM stands for
        object-relational mapper: it maps database rows to language-level objects.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="ORM Tradeoff">
          <NoteParagraph className="mb-0">
            An ORM can make common queries more convenient and centralize model definitions. The cost is that developers must still understand the SQL
            being generated, especially for joins, transactions, indexes, and performance-sensitive queries.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="serverless-architecture">25. Serverless Architecture</NoteSectionTitle>
      <NoteParagraph>
        Serverless does not mean there are no servers. It means the cloud platform manages the server provisioning and scaling model. Developers deploy
        functions or managed services and pay attention to events, limits, cold starts, permissions, and externalized state.
      </NoteParagraph>
      <NoteTable
        headers={['benefit', 'cost']}
        rows={[
          ['Scales down when unused.', 'Cold starts can add latency.'],
          ['Reduces server maintenance work.', 'Debugging local and cloud behavior can differ.'],
          ['Works well for event-driven tasks.', 'Long-running or stateful workloads may fit poorly.'],
          ['Pairs naturally with managed databases and queues.', 'Vendor-specific configuration can create lock-in.'],
        ]}
      />

      <NoteSectionTitle id="git-and-github-version-control">26. Git and GitHub Version Control</NoteSectionTitle>
      <NoteParagraph>
        Git is a distributed version control system. It records snapshots of files as commits. GitHub hosts repositories and adds collaboration tools such
        as pull requests, issues, code review, and actions.
      </NoteParagraph>
      <NoteTable
        headers={['command or concept', 'meaning']}
        rows={[
          [<code>git status</code>, 'Show changed files and branch state.'],
          [<code>git add</code>, 'Stage changes for the next commit.'],
          [<code>git commit</code>, 'Create a snapshot with a message.'],
          [<code>git branch</code>, 'Create or list independent lines of work.'],
          [<code>git merge</code>, 'Combine branch history.'],
          [<code>pull request</code>, 'A proposed change reviewed before merging.'],
        ]}
      />
      <NoteParagraph>
        Clean Git history keeps commits focused, messages descriptive, and review scope small enough that teammates can reason about the change.
      </NoteParagraph>

      <NoteSectionTitle id="web-security">27. Web Security</NoteSectionTitle>
      <NoteParagraph>
        Web security is about preserving confidentiality, integrity, and availability while users, browsers, networks, and servers interact. Security
        failures often come from trusting the wrong boundary: client input, hidden form fields, query parameters, cookies, or third-party scripts.
      </NoteParagraph>
      <NoteTable
        headers={['risk', 'defense']}
        rows={[
          ['SQL injection', 'Parameterized queries and server-side validation.'],
          ['Cross-site scripting', 'Output encoding, framework escaping, content security policy, and avoiding unsafe HTML injection.'],
          ['Cross-site request forgery', 'SameSite cookies, CSRF tokens, and checking request intent.'],
          ['Broken access control', 'Server-side authorization checks on every protected operation.'],
          ['Secret exposure', 'Keep secrets out of client bundles and repositories; use environment variables or secret managers.'],
        ]}
      />

      <NoteSectionTitle id="threat-modeling-and-secure-coding">28. Threat Modeling and Secure Coding</NoteSectionTitle>
      <NoteParagraph>
        Threat modeling asks what can go wrong before the system is built or changed. A practical model identifies assets, actors, entry points, trust
        boundaries, likely attacks, and mitigations.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Secure Coding Checks">
          <BulletList className="mb-0">
            <li>Validate input at the boundary where it enters the server.</li>
            <li>Authorize by checking what the current user may do, not what the UI happens to show.</li>
            <li>Use framework-provided escaping and safe database APIs.</li>
            <li>Log enough to debug attacks, but do not log secrets or sensitive personal data.</li>
            <li>Fail closed when permission or validation logic is uncertain.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="debugging">29. Debugging</NoteSectionTitle>
      <NoteParagraph>
        Debugging is disciplined hypothesis testing. A good debugging loop reproduces the bug, narrows where it occurs, inspects actual state, changes one
        variable, and confirms the result.
      </NoteParagraph>
      <NoteTable
        headers={['tool', 'use']}
        rows={[
          ['browser console', 'Inspect JavaScript errors, logs, and runtime values.'],
          ['network tab', 'Inspect requests, status codes, payloads, headers, and timing.'],
          ['React devtools', 'Inspect component props, state, and render structure.'],
          ['server logs', 'See backend errors and request handling details.'],
          ['database console', 'Verify stored data and query results directly.'],
          ['debugger', 'Step through code and inspect variables at breakpoints.'],
        ]}
      />

      <NoteSectionTitle id="testing-with-jest-and-pytest">30. Testing with Jest and Pytest</NoteSectionTitle>
      <NoteParagraph>
        Tests are executable checks that protect behavior. Jest is commonly used in JavaScript and React projects. Pytest is commonly used in Python
        projects. The best test level depends on what kind of risk the code introduces.
      </NoteParagraph>
      <TestStrategyExplorer />
      <CodeBlock
        language="python"
        code={`def test_total_price():
    assert total_price([10, 15], tax_rate=0.1) == 27.5`}
      />

      <NoteSectionTitle id="containers-and-docker">31. Containers and Docker</NoteSectionTitle>
      <NoteParagraph>
        A container packages an application with the user-space environment it needs to run. An image is the immutable template. A container is a running
        instance of an image. Dockerfiles describe how to build images.
      </NoteParagraph>
      <DockerBuildExplorer />

      <NoteSectionTitle id="containerizing-react-apps">32. Containerizing React Apps</NoteSectionTitle>
      <NoteParagraph>
        React apps are often built into static assets and then served by a lightweight web server. A multi-stage Dockerfile can install dependencies,
        build the app, and copy only the final output into a runtime image.
      </NoteParagraph>
      <CodeBlock
        language="dockerfile"
        code={`FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html`}
      />
      <NoteParagraph>
        Environment-specific values should be handled intentionally. Values embedded during the frontend build become part of the shipped client bundle,
        so private secrets do not belong there.
      </NoteParagraph>

      <NoteSectionTitle id="documentation-and-diagrams">33. Documentation and Diagrams</NoteSectionTitle>
      <NoteParagraph>
        Documentation helps future readers understand intent, setup, architecture, and operational decisions. Diagrams are useful when relationships are
        easier to see than to describe linearly.
      </NoteParagraph>
      <NoteTable
        headers={['artifact', 'answers']}
        rows={[
          ['README', 'How do I install, configure, run, test, and deploy this project?'],
          ['architecture diagram', 'What are the major components and how do they communicate?'],
          ['database schema diagram', 'What tables exist and how are they related?'],
          ['API documentation', 'What endpoints exist, and what do they accept and return?'],
          ['decision record', 'Why did the team choose this approach over alternatives?'],
        ]}
      />

      <NoteSectionTitle id="networking-fundamentals">34. Networking Fundamentals</NoteSectionTitle>
      <NoteParagraph>
        Networking lets processes on different machines communicate. The internet breaks communication into layers so that applications can send data
        without manually controlling every electrical, wireless, routing, and transport detail.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Core Terms">
          <BulletList className="mb-0">
            <li>An IP address identifies a network location for a host or interface.</li>
            <li>A packet is a unit of network data with headers and payload.</li>
            <li>TCP provides reliable byte streams using sequencing, acknowledgments, and retransmission.</li>
            <li>UDP provides lightweight datagrams without TCP-style reliability guarantees.</li>
            <li>Latency is delay; bandwidth is data capacity per unit time; throughput is achieved transfer rate.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="dns-ports-and-osi-tcp-ip-models">35. DNS, Ports, and OSI/TCP-IP Models</NoteSectionTitle>
      <NoteParagraph>
        DNS maps human-readable names to network addresses. Ports identify which process or service should receive traffic on a machine. Layered models
        help separate concerns: applications use HTTP, transport uses TCP or UDP, the internet layer routes IP packets, and lower layers move bits.
      </NoteParagraph>
      <NetworkLocatorExplorer />
      <NoteTable
        headers={['layer idea', 'examples']}
        rows={[
          ['application', 'HTTP, DNS, SMTP, application-specific protocols.'],
          ['transport', 'TCP and UDP.'],
          ['internet', 'IP addressing and routing.'],
          ['link/physical', 'Ethernet, Wi-Fi, frames, signals, and local delivery.'],
        ]}
      />

      <NoteSectionTitle id="iot-and-computing-frontiers">36. IoT and Computing Frontiers</NoteSectionTitle>
      <NoteParagraph>
        Internet-of-Things systems connect physical devices to software services. They combine sensors, actuators, embedded devices, networks, cloud
        services, data processing, and security constraints.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="What Changes at the Edge">
          <BulletList className="mb-0">
            <li>Devices may have limited CPU, memory, battery, and network reliability.</li>
            <li>Physical-world actions can make bugs more consequential than ordinary UI bugs.</li>
            <li>Updates, identity, and device security need planning from the start.</li>
            <li>Data volume can force decisions about what to process locally versus in the cloud.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="project-delivery-and-review">37. Project Delivery and Review</NoteSectionTitle>
      <NoteParagraph>
        Final delivery is not just showing that code exists. It is explaining the problem, the users, the architecture, the main interactions, the tradeoffs,
        the testing story, the deployment story, and what the team would improve next.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Review Narrative">
          <BulletList className="mb-0">
            <li>Start with the user problem and the most important path through the app.</li>
            <li>Demonstrate a complete path through the app rather than disconnected screens.</li>
            <li>Explain the architecture at the level of components, APIs, and data.</li>
            <li>Call out security, testing, and deployment decisions explicitly.</li>
            <li>End with limitations and future work that show technical judgment.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>
    </NotesLayout>
  );
}
