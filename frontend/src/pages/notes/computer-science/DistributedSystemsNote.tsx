/**
 * Distributed Systems Notes Page
 * A standalone note for RPC, concurrency, logical time, replication, consensus, consistency, data systems, and formal specification.
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
  RelatedNotes,
} from '../../../components/notes';
import { useDarkMode } from '../../../hooks/useDarkMode';

type TableRow = ReactNode[];

function useDistributedTheme() {
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
  };
}

function BulletList({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { listClass } = useDistributedTheme();
  return <ul className={`${listClass} ${className}`}>{children}</ul>;
}

function NoteTable({ headers, rows }: { headers: ReactNode[]; rows: TableRow[] }) {
  const { tableClass, tableHeadClass, tableCellClass } = useDistributedTheme();

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

function DistributedNotationGuide() {
  return (
    <NoteTopicGroup>
      <NoteTopicBlock title="Terminology Used Throughout">
        <BulletList className="mb-0">
          <li>A node, server, replica, or process is one participant in the distributed system.</li>
          <li>A client sends requests; a server receives requests and returns replies.</li>
          <li>A replica is a copy of data or a service state on another node.</li>
          <li>A quorum is a large enough subset of replicas, often a majority.</li>
          <li>A partition is a network split where some nodes cannot communicate with others.</li>
          <li>A log is an ordered list of commands or events used to replay state consistently.</li>
          <li>A term in Raft is a logical election era; terms increase monotonically.</li>
          <li><InlineMath math="a\to b" /> means event <InlineMath math="a" /> happened before event <InlineMath math="b" />.</li>
          <li><InlineMath math="a\parallel b" /> means events are concurrent: neither causally happened before the other.</li>
          <li><code>N</code>, <code>R</code>, and <code>W</code> commonly mean replica count, read quorum size, and write quorum size.</li>
        </BulletList>
      </NoteTopicBlock>
    </NoteTopicGroup>
  );
}

function DistributedSystemDiagram() {
  const { subtlePanelClass, primaryColor, secondaryColor, mutedColor, textColor } = useDistributedTheme();
  const servers = [
    { name: 'A', x: 240, y: 55 },
    { name: 'B', x: 380, y: 100 },
    { name: 'C', x: 240, y: 165 },
  ];

  return (
    <div className={`mb-8 rounded-lg border p-4 ${subtlePanelClass}`}>
      <svg viewBox="0 0 520 230" className="h-72 w-full" role="img" aria-label="Distributed system components">
        <defs>
          <marker id="dist-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill={mutedColor} />
          </marker>
        </defs>
        <rect x="35" y="86" width="90" height="48" rx="8" fill={secondaryColor} fillOpacity="0.14" stroke={secondaryColor} />
        <text x="80" y="115" textAnchor="middle" fontFamily="monospace" fontSize="13" fill={textColor}>Client</text>
        {servers.map((server) => (
          <g key={server.name}>
            <rect x={server.x - 42} y={server.y - 23} width="84" height="46" rx="8" fill={primaryColor} fillOpacity="0.14" stroke={primaryColor} />
            <text x={server.x} y={server.y + 4} textAnchor="middle" fontFamily="monospace" fontSize="13" fill={textColor}>Node {server.name}</text>
            <line x1="125" y1="110" x2={server.x - 46} y2={server.y} stroke={mutedColor} strokeWidth="2" markerEnd="url(#dist-arrow)" />
          </g>
        ))}
        <line x1="278" y1="61" x2="342" y2="88" stroke={mutedColor} strokeWidth="2" strokeDasharray="5 5" />
        <line x1="342" y1="112" x2="278" y2="159" stroke={mutedColor} strokeWidth="2" strokeDasharray="5 5" />
        <line x1="240" y1="78" x2="240" y2="142" stroke={mutedColor} strokeWidth="2" strokeDasharray="5 5" />
      </svg>
      <NoteParagraph className="mb-0 text-sm">
        The difficulty is not that each node is complicated alone. The difficulty is that each node acts using local state, local clocks, and messages that may be delayed or lost.
      </NoteParagraph>
    </div>
  );
}

type RpcFailure = 'lost-request' | 'lost-reply' | 'server-crash-before' | 'server-crash-after';
type RpcSemantic = 'at-least-once' | 'at-most-once';

function RpcFailureExplorer() {
  const { subtlePanelClass } = useDistributedTheme();
  const [failure, setFailure] = useState<RpcFailure>('lost-reply');
  const [semantic, setSemantic] = useState<RpcSemantic>('at-most-once');
  const failureText: Record<RpcFailure, string> = {
    'lost-request': 'The request never reaches the server.',
    'lost-reply': 'The server executes the operation, but the reply is lost.',
    'server-crash-before': 'The server crashes before executing the operation.',
    'server-crash-after': 'The server executes, then crashes before the client receives a reply.',
  };
  const result =
    semantic === 'at-least-once'
      ? {
          guarantee: 'The client retries until it gets a response.',
          risk: failure === 'lost-reply' || failure === 'server-crash-after' ? 'Duplicate execution is possible unless the operation is idempotent.' : 'The operation may execute after a later retry.',
        }
      : {
          guarantee: 'The system suppresses duplicate request IDs when possible.',
          risk: failure === 'lost-reply' || failure === 'server-crash-after' ? 'The client may not know whether the operation happened.' : 'The operation may execute zero times.',
        };

  return (
    <InteractiveBlock title="RPC Failure Semantics">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 block text-sm font-bold" htmlFor="rpc-failure">Failure case</label>
          <select id="rpc-failure" value={failure} onChange={(event) => setFailure(event.target.value as RpcFailure)} className="mb-4 w-full rounded border border-current/20 bg-transparent p-2 text-sm">
            <option value="lost-request">request lost</option>
            <option value="lost-reply">reply lost</option>
            <option value="server-crash-before">server crash before execute</option>
            <option value="server-crash-after">server crash after execute</option>
          </select>
          <label className="mb-2 block text-sm font-bold" htmlFor="rpc-semantic">RPC semantic</label>
          <select id="rpc-semantic" value={semantic} onChange={(event) => setSemantic(event.target.value as RpcSemantic)} className="w-full rounded border border-current/20 bg-transparent p-2 text-sm">
            <option value="at-least-once">at-least-once</option>
            <option value="at-most-once">at-most-once</option>
          </select>
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <NoteTable
            headers={['case', 'what it means']}
            rows={[
              ['failure', failureText[failure]],
              ['guarantee', result.guarantee],
              ['remaining risk', result.risk],
            ]}
          />
          <NoteParagraph className="mb-0 text-sm">
            Exactly-once is not a simple network guarantee. Practical systems combine retries, unique request IDs, idempotent operations, duplicate suppression, and durable logs.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

type EventName = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

const clockEvents: Record<EventName, { process: string; description: string; lamport: number; vector: [number, number, number] }> = {
  A: { process: 'P1', description: 'local event', lamport: 1, vector: [1, 0, 0] },
  B: { process: 'P1', description: 'send m1 to P2', lamport: 2, vector: [2, 0, 0] },
  C: { process: 'P2', description: 'receive m1', lamport: 3, vector: [2, 1, 0] },
  D: { process: 'P2', description: 'local event', lamport: 4, vector: [2, 2, 0] },
  E: { process: 'P3', description: 'independent local event', lamport: 1, vector: [0, 0, 1] },
  F: { process: 'P2', description: 'send m2 to P3', lamport: 5, vector: [2, 3, 0] },
  G: { process: 'P3', description: 'receive m2', lamport: 6, vector: [2, 3, 2] },
};

function compareVectors(a: [number, number, number], b: [number, number, number]) {
  const lessOrEqual = a.every((value, index) => value <= b[index]);
  const greaterOrEqual = a.every((value, index) => value >= b[index]);
  const strictlyLess = lessOrEqual && a.some((value, index) => value < b[index]);
  const strictlyGreater = greaterOrEqual && a.some((value, index) => value > b[index]);
  if (strictlyLess) return 'first happened before second';
  if (strictlyGreater) return 'second happened before first';
  return 'concurrent';
}

function LogicalClockExplorer() {
  const { subtlePanelClass } = useDistributedTheme();
  const eventNames = Object.keys(clockEvents) as EventName[];
  const [first, setFirst] = useState<EventName>('D');
  const [second, setSecond] = useState<EventName>('E');
  const firstEvent = clockEvents[first];
  const secondEvent = clockEvents[second];
  const comparison = compareVectors(firstEvent.vector, secondEvent.vector);

  return (
    <InteractiveBlock title="Lamport vs Vector Clock Evidence">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 block text-sm font-bold" htmlFor="clock-first">First event</label>
          <select id="clock-first" value={first} onChange={(event) => setFirst(event.target.value as EventName)} className="mb-4 w-full rounded border border-current/20 bg-transparent p-2 text-sm">
            {eventNames.map((name) => <option key={name} value={name}>{name}: {clockEvents[name].description}</option>)}
          </select>
          <label className="mb-2 block text-sm font-bold" htmlFor="clock-second">Second event</label>
          <select id="clock-second" value={second} onChange={(event) => setSecond(event.target.value as EventName)} className="w-full rounded border border-current/20 bg-transparent p-2 text-sm">
            {eventNames.map((name) => <option key={name} value={name}>{name}: {clockEvents[name].description}</option>)}
          </select>
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <NoteTable
            headers={['event', 'process', 'Lamport', 'vector']}
            rows={[
              [first, firstEvent.process, firstEvent.lamport, `[${firstEvent.vector.join(', ')}]`],
              [second, secondEvent.process, secondEvent.lamport, `[${secondEvent.vector.join(', ')}]`],
            ]}
          />
          <NoteParagraph className="mb-0 text-sm">
            Vector comparison says: <strong>{comparison}</strong>. Lamport timestamps preserve causal order, but a smaller Lamport timestamp alone does not prove causality.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

type SnapshotCut = 'consistent' | 'receive-without-send' | 'in-transit';

function SnapshotExplorer() {
  const { subtlePanelClass, primaryColor, secondaryColor, mutedColor, textColor } = useDistributedTheme();
  const [cut, setCut] = useState<SnapshotCut>('in-transit');
  const explanation: Record<SnapshotCut, { title: string; valid: boolean; text: string; cutX: number[] }> = {
    consistent: {
      title: 'Consistent cut',
      valid: true,
      text: 'Every included receive has its corresponding send included.',
      cutX: [210, 220, 210],
    },
    'receive-without-send': {
      title: 'Inconsistent cut',
      valid: false,
      text: 'The cut includes a receive without including the send that caused it.',
      cutX: [120, 245, 250],
    },
    'in-transit': {
      title: 'Message in transit',
      valid: true,
      text: 'The send is included but the receive is not, so the message belongs to channel state.',
      cutX: [230, 150, 230],
    },
  };
  const current = explanation[cut];

  return (
    <InteractiveBlock title="Distributed Snapshot Cut">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <div className="space-y-2">
            {(Object.keys(explanation) as SnapshotCut[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setCut(key)}
                className={`w-full rounded border px-3 py-2 text-left text-sm ${cut === key ? 'border-current font-bold' : 'border-current/20'}`}
              >
                {explanation[key].title}
              </button>
            ))}
          </div>
          <NoteParagraph className="mb-0 mt-4 text-sm">{current.text}</NoteParagraph>
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <svg viewBox="0 0 420 230" className="h-72 w-full" role="img" aria-label="Distributed snapshot cut">
            {[55, 115, 175].map((y, index) => (
              <g key={y}>
                <text x="25" y={y + 4} fontFamily="monospace" fontSize="12" fill={textColor}>P{index + 1}</text>
                <line x1="55" y1={y} x2="380" y2={y} stroke={mutedColor} strokeWidth="2" />
                <line x1={current.cutX[index]} y1={y - 20} x2={current.cutX[index]} y2={y + 20} stroke={current.valid ? primaryColor : secondaryColor} strokeWidth="3" />
              </g>
            ))}
            <line x1="125" y1="55" x2="205" y2="115" stroke={secondaryColor} strokeWidth="2" />
            <text x="155" y="78" fontFamily="monospace" fontSize="11" fill={textColor}>m1</text>
            <line x1="255" y1="115" x2="325" y2="175" stroke={secondaryColor} strokeWidth="2" />
            <text x="285" y="138" fontFamily="monospace" fontSize="11" fill={textColor}>m2</text>
            {[95, 125, 205, 255, 325].map((x, index) => (
              <circle key={index} cx={x} cy={index < 2 ? 55 : index < 4 ? 115 : 175} r="5" fill={secondaryColor} />
            ))}
          </svg>
          <NoteParagraph className="mb-0 text-sm">
            A snapshot must include process states and channel states. Chandy-Lamport markers identify which messages were in transit at the cut.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function QuorumExplorer() {
  const { subtlePanelClass } = useDistributedTheme();
  const [n, setN] = useState(5);
  const [r, setR] = useState(3);
  const [w, setW] = useState(3);
  const majority = Math.floor(n / 2) + 1;
  const overlaps = r + w > n;
  const writeMajority = w >= majority;
  const readMajority = r >= majority;

  return (
    <InteractiveBlock title="Replica Quorum Tradeoff">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 flex justify-between text-sm" htmlFor="quorum-n"><span>Replicas N</span><span>{n}</span></label>
          <input id="quorum-n" type="range" min="3" max="7" value={n} onChange={(event) => {
            const next = Number(event.target.value);
            setN(next);
            setR(Math.min(r, next));
            setW(Math.min(w, next));
          }} className="mb-4 w-full" />
          <label className="mb-2 flex justify-between text-sm" htmlFor="quorum-r"><span>Read quorum R</span><span>{r}</span></label>
          <input id="quorum-r" type="range" min="1" max={n} value={r} onChange={(event) => setR(Number(event.target.value))} className="mb-4 w-full" />
          <label className="mb-2 flex justify-between text-sm" htmlFor="quorum-w"><span>Write quorum W</span><span>{w}</span></label>
          <input id="quorum-w" type="range" min="1" max={n} value={w} onChange={(event) => setW(Number(event.target.value))} className="w-full" />
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <NoteTable
            headers={['check', 'result']}
            rows={[
              ['majority size', majority],
              [<InlineMath math="R+W>N" />, overlaps ? 'yes: strict read/write quorums overlap' : 'no: reads may miss latest writes'],
              ['read majority', readMajority ? 'yes' : 'no'],
              ['write majority', writeMajority ? 'yes' : 'no'],
            ]}
          />
          <NoteParagraph className="mb-0 text-sm">
            Larger quorums improve coordination guarantees but reduce availability and increase latency. Dynamo makes this tunable, then handles conflicts when replicas diverge.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function RaftMajorityExplorer() {
  const { subtlePanelClass, primaryColor, secondaryColor } = useDistributedTheme();
  const [clusterSize, setClusterSize] = useState(5);
  const [leftPartition, setLeftPartition] = useState(3);
  const majority = Math.floor(clusterSize / 2) + 1;
  const rightPartition = clusterSize - leftPartition;
  const leftCanElect = leftPartition >= majority;
  const rightCanElect = rightPartition >= majority;

  return (
    <InteractiveBlock title="Raft Majority Intersection">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 flex justify-between text-sm" htmlFor="raft-size"><span>Cluster size</span><span>{clusterSize}</span></label>
          <input id="raft-size" type="range" min="3" max="7" step="2" value={clusterSize} onChange={(event) => {
            const next = Number(event.target.value);
            setClusterSize(next);
            setLeftPartition(Math.min(leftPartition, next));
          }} className="mb-4 w-full" />
          <label className="mb-2 flex justify-between text-sm" htmlFor="raft-left"><span>Nodes on left side of partition</span><span>{leftPartition}</span></label>
          <input id="raft-left" type="range" min="1" max={clusterSize - 1} value={leftPartition} onChange={(event) => setLeftPartition(Number(event.target.value))} className="w-full" />
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded border p-3" style={{ borderColor: leftCanElect ? primaryColor : secondaryColor }}>
              left partition: {leftPartition} nodes<br />{leftCanElect ? 'can elect/commit' : 'cannot reach majority'}
            </div>
            <div className="rounded border p-3" style={{ borderColor: rightCanElect ? primaryColor : secondaryColor }}>
              right partition: {rightPartition} nodes<br />{rightCanElect ? 'can elect/commit' : 'cannot reach majority'}
            </div>
          </div>
          <NoteParagraph className="mb-0 text-sm">
            Majority is {majority}. Two different majorities must overlap, which is why committed log information survives into later elections.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function ConsistencyModelExplorer() {
  return (
    <NoteTable
      headers={['Model', 'Contract', 'Cost']}
      rows={[
        ['Linearizability', 'Every operation appears to occur atomically between invocation and response, respecting real time.', 'Strongest programming model, usually highest coordination cost.'],
        ['Sequential consistency', 'There is one total order that respects each client program order, but not necessarily real time across clients.', 'Intuitive, but real-time effects may appear reordered.'],
        ['Causal consistency', 'Causally related operations are observed in causal order; concurrent operations may be seen differently.', 'Requires dependency metadata and conflict-tolerant applications.'],
        ['Session guarantees', 'Preserve client expectations such as read-your-writes and monotonic reads.', 'Improves user experience without global ordering.'],
        ['Eventual consistency', 'If writes stop, replicas eventually converge.', 'Lower coordination, but stale reads and conflicts are application-visible.'],
      ]}
    />
  );
}

function hashKey(value: string) {
  return value.split('').reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) % 360, 17);
}

function ConsistentHashingExplorer() {
  const { subtlePanelClass, primaryColor, secondaryColor, mutedColor, textColor } = useDistributedTheme();
  const [serverCount, setServerCount] = useState(4);
  const [key, setKey] = useState('user:42');
  const servers = Array.from({ length: serverCount }, (_, index) => ({
    name: `S${index + 1}`,
    angle: (index * 360) / serverCount + (index % 2) * 13,
  })).sort((a, b) => a.angle - b.angle);
  const keyAngle = hashKey(key);
  const owner = servers.find((server) => server.angle >= keyAngle) ?? servers[0];
  const center = 150;
  const radius = 88;
  const point = (angle: number) => {
    const radians = ((angle - 90) * Math.PI) / 180;
    return { x: center + radius * Math.cos(radians), y: center + radius * Math.sin(radians) };
  };
  const keyPoint = point(keyAngle);

  return (
    <InteractiveBlock title="Consistent Hashing Ring">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 flex justify-between text-sm" htmlFor="server-count"><span>Servers</span><span>{serverCount}</span></label>
          <input id="server-count" type="range" min="3" max="7" value={serverCount} onChange={(event) => setServerCount(Number(event.target.value))} className="mb-4 w-full" />
          <label className="mb-2 block text-sm" htmlFor="hash-key">Key</label>
          <input id="hash-key" value={key} onChange={(event) => setKey(event.target.value)} className="w-full rounded border border-current/20 bg-transparent p-2 text-sm" />
          <NoteParagraph className="mb-0 mt-4 text-sm">
            Key owner: <strong>{owner.name}</strong>, the first server clockwise from the key hash.
          </NoteParagraph>
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <svg viewBox="0 0 300 300" className="h-80 w-full" role="img" aria-label="Consistent hashing ring">
            <circle cx={center} cy={center} r={radius} fill="transparent" stroke={mutedColor} strokeWidth="2" />
            <circle cx={keyPoint.x} cy={keyPoint.y} r="7" fill={secondaryColor} />
            <text x={keyPoint.x} y={keyPoint.y - 12} textAnchor="middle" fontFamily="monospace" fontSize="11" fill={textColor}>key</text>
            {servers.map((server) => {
              const p = point(server.angle);
              return (
                <g key={server.name}>
                  <circle cx={p.x} cy={p.y} r="12" fill={server.name === owner.name ? secondaryColor : primaryColor} fillOpacity="0.25" stroke={server.name === owner.name ? secondaryColor : primaryColor} />
                  <text x={p.x} y={p.y + 4} textAnchor="middle" fontFamily="monospace" fontSize="10" fill={textColor}>{server.name}</text>
                </g>
              );
            })}
          </svg>
          <NoteParagraph className="mb-0 text-sm">
            Unlike <code>hash(key) mod N</code>, adding or removing a server mostly moves nearby keys instead of reshuffling almost everything.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function MapReduceExplorer() {
  const phases = ['split input', 'map tasks', 'shuffle by key', 'reduce tasks', 'write output'];

  return (
    <NoteTopicGroup className="grid grid-cols-1 gap-3 space-y-0 md:grid-cols-5">
      {phases.map((phase, index) => (
        <NoteTopicBlock key={phase} title={`${index + 1}. ${phase}`}>
          <NoteParagraph className="mb-0 text-sm">
            {index === 0 && 'Partition the input so many workers can process chunks independently.'}
            {index === 1 && 'Run the user map function on each chunk to emit intermediate key-value pairs.'}
            {index === 2 && 'Group intermediate values by key so all values for one key reach the same reducer.'}
            {index === 3 && 'Run the user reduce function for each key group.'}
            {index === 4 && 'Write deterministic output files that can be recomputed after worker failure.'}
          </NoteParagraph>
        </NoteTopicBlock>
      ))}
    </NoteTopicGroup>
  );
}

function PaperTradeoffExplorer() {
  return (
    <NoteTable
      headers={['System', 'Core idea', 'Tradeoff']}
      rows={[
        ['MapReduce', 'Programmer writes map and reduce; runtime handles parallelization, scheduling, shuffle, and failures.', 'Great for batch data processing, weak for low-latency or iterative workloads.'],
        ['GFS', 'Single metadata master, chunkservers for data, large chunks, replication, append-optimized writes.', 'High throughput and simple control, but relaxed consistency and poor fit for small random workloads.'],
        ['Dynamo', 'Consistent hashing, sloppy quorums, vector clocks, hinted handoff, Merkle anti-entropy, gossip.', 'High availability and tunable latency, but application-visible conflicts and weak consistency.'],
        ['Spanner', 'Paxos groups, 2PC, MVCC, TrueTime bounded uncertainty, commit wait.', 'Strong guarantees at global scale, but complex infrastructure and wide-area latency costs.'],
        ['Raft', 'Strong leader, terms, randomized elections, AppendEntries, safety rules, snapshots, joint consensus.', 'Clear and practical for crash failures, but requires majority availability and does not handle Byzantine behavior.'],
      ]}
    />
  );
}

function TlaPropertyExplorer() {
  return (
    <NoteTable
      headers={['Property', 'Meaning', 'Model-checking question']}
      rows={[
        ['Safety', 'Something bad never happens.', 'Can any allowed transition reach a bad state?'],
        ['Liveness', 'Something good eventually happens.', 'Can the behavior get stuck forever without progress?'],
        ['Invariant', 'A condition is true in every reachable state.', 'Does every next-state step preserve the condition?'],
      ]}
    />
  );
}

export default function DistributedSystemsNote() {
  return (
    <NotesLayout>
      <NoteHeader
        title="Distributed Systems"
        subtitle="Build systems that keep working across independent machines, unreliable networks, failures, and scale."
      />

      <RelatedNotes
        links={[
          { href: '/notes/go', label: 'Go', note: 'Language, runtime, goroutines, channels, context, testing, and RPC implementation patterns.' },
        ]}
      />

      <DistributedNotationGuide />

      <NoteSectionTitle id="distributed-systems-overview">1. Distributed Systems Overview</NoteSectionTitle>
      <NoteParagraph>
        A distributed system is a collection of independent computers that appears to users or applications as one coherent system. The hard part is
        that there is no shared memory by default, no perfect global clock, and no node instantly knows what every other node has seen.
      </NoteParagraph>
      <DistributedSystemDiagram />
      <NoteTopicGroup>
        <NoteTopicBlock title="Core Difficulties">
          <BulletList className="mb-0">
            <li>Messages can be delayed, dropped, duplicated, or reordered.</li>
            <li>Machines can crash, recover, or become unreachable.</li>
            <li>Concurrent clients can race.</li>
            <li>Replication improves availability but creates consistency questions.</li>
            <li>Coordination improves correctness but often costs latency and availability.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="go-foundations-for-distributed-systems">2. Go Foundations for Distributed Systems</NoteSectionTitle>
      <NoteParagraph>
        Go is a practical implementation language for distributed systems because it has simple syntax, static types, garbage collection, networking
        libraries, tests, benchmarks, goroutines, channels, mutexes, and a race detector.
      </NoteParagraph>
      <NoteTable
        headers={['Go feature', 'distributed systems use']}
        rows={[
          ['goroutines', 'handle concurrent RPCs, timers, background replication, and worker pools'],
          ['channels/select', 'coordinate messages, timeouts, task completion, and shutdown'],
          ['mutexes', 'protect shared state inside one process'],
          ['structs/interfaces', 'define service state, RPC arguments, replies, and abstractions'],
          ['testing/race detector', 'exercise interleavings and catch observed data races'],
        ]}
      />
      <CodeBlock
        language="go"
        code={`
type Args struct {
    Key string
}

type Reply struct {
    Value string
    OK    bool
}
        `}
      />

      <NoteSectionTitle id="concurrency-vs-parallelism">3. Concurrency vs Parallelism</NoteSectionTitle>
      <NoteParagraph>
        Concurrency is about structure: multiple tasks are active over the same time period. Parallelism is about execution: multiple tasks literally
        run at the same time on different cores or machines. A single-core program can be concurrent without being parallel.
      </NoteParagraph>
      <NoteTable
        headers={['idea', 'meaning', 'distributed systems example']}
        rows={[
          ['concurrency', 'interleaved active tasks', 'server handles request, timeout, and heartbeat logic'],
          ['parallelism', 'simultaneous execution', 'many workers process map tasks at once'],
          ['asynchrony', 'no fixed timing relationship', 'a slow reply may be delayed, lost, or hidden behind a partition'],
        ]}
      />

      <NoteSectionTitle id="goroutines-channels-mutexes-and-race-detection">4. Goroutines, Channels, Mutexes, and Race Detection</NoteSectionTitle>
      <NoteParagraph>
        A goroutine is a lightweight concurrent execution unit started with <code>go f()</code>. Channels move values between goroutines. Mutexes
        protect critical sections around shared memory. These tools solve different coordination problems, and mixing them casually can still create
        races or deadlocks.
      </NoteParagraph>
      <CodeBlock
        language="go"
        code={`
for _, server := range servers {
    srv := server // copy loop variable for this goroutine
    go func() {
        reply := call(srv)
        results <- reply
    }()
}
        `}
      />
      <BulletList>
        <li>Use channels for ownership transfer, request fan-out, worker queues, and event loops.</li>
        <li>Use mutexes when several goroutines need shared in-memory state.</li>
        <li>Use <code>select</code> to wait on messages, timers, cancellation, or multiple result channels.</li>
        <li>Run <code>go test -race</code> to catch data races that happen during tests.</li>
        <li>Remember that slices share underlying arrays, so passing a slice header can still share mutable data.</li>
      </BulletList>

      <NoteSectionTitle id="rpc-and-failure-semantics">5. RPC and Failure Semantics</NoteSectionTitle>
      <NoteParagraph>
        RPC, or Remote Procedure Call, lets code call a remote service through a local-looking function. The abstraction is useful, but it cannot
        make a remote call behave exactly like a local call because the network and remote process can fail independently.
      </NoteParagraph>
      <CodeBlock
        language="text"
        code={`
client application
client stub
RPC library
network
server dispatch
server implementation
        `}
      />
      <RpcFailureExplorer />

      <NoteSectionTitle id="time-asynchrony-and-causality">6. Time, Asynchrony, and Causality</NoteSectionTitle>
      <NoteParagraph>
        Wall-clock time is tempting, but local clocks drift and messages have unpredictable delay. A distributed system often needs ordering
        relationships more than physical timestamps. Causality is captured by the happened-before relation.
      </NoteParagraph>
      <MathBlock math="a\to b \text{ means event } a \text{ happened before event } b" />
      <BulletList>
        <li>Same-process order creates happened-before order.</li>
        <li>Sending a message happened before receiving that message.</li>
        <li>Happened-before is transitive.</li>
        <li>If neither event happened before the other, the events are concurrent.</li>
      </BulletList>

      <NoteSectionTitle id="lamport-clocks-and-vector-clocks">7. Lamport Clocks and Vector Clocks</NoteSectionTitle>
      <NoteParagraph>
        Lamport clocks use one counter per process. They guarantee that if <InlineMath math="a\to b" />, then <InlineMath math="L(a)<L(b)" />.
        The reverse is not guaranteed. Vector clocks carry more metadata and can distinguish causal order from concurrency.
      </NoteParagraph>
      <NoteTable
        headers={['clock', 'metadata', 'what it can prove']}
        rows={[
          ['Lamport clock', 'one integer', 'causal order implies timestamp order'],
          ['Lamport plus process ID', 'integer and tie-breaker', 'deterministic total order, not true causality'],
          ['Vector clock', 'one counter per process', 'causal comparison and concurrency detection'],
        ]}
      />
      <LogicalClockExplorer />

      <NoteSectionTitle id="distributed-snapshots">8. Distributed Snapshots</NoteSectionTitle>
      <NoteParagraph>
        A distributed snapshot captures a global state without stopping every node at one physical instant. A useful snapshot includes each process
        state and messages in transit. The key correctness idea is a consistent cut: a receive event cannot appear unless the corresponding send is
        also included.
      </NoteParagraph>
      <SnapshotExplorer />
      <NoteParagraph>
        The Chandy-Lamport algorithm uses marker messages on FIFO reliable channels. The first marker makes a process record local state and start
        recording incoming channel messages until markers arrive on those channels.
      </NoteParagraph>

      <NoteSectionTitle id="replication">9. Replication</NoteSectionTitle>
      <NoteParagraph>
        Replication stores copies of data or service state on multiple nodes. It improves fault tolerance, availability, read performance, and
        locality, but every write now raises a question: which replicas must see it, in what order, and when is it committed?
      </NoteParagraph>
      <NoteTable
        headers={['scheme', 'main idea', 'tradeoff']}
        rows={[
          ['primary-backup', 'one primary orders updates and backups follow', 'simple but primary is bottleneck and failover must avoid split brain'],
          ['quorum replication', 'reads and writes contact enough replicas', 'tunable but depends on quorum assumptions'],
          ['state-machine replication', 'all replicas apply same log in same order', 'strong behavior but consensus is required'],
          ['eventual replication', 'accept divergence and repair later', 'available but conflict handling moves to system/application logic'],
        ]}
      />
      <QuorumExplorer />

      <NoteSectionTitle id="failure-models">10. Failure Models</NoteSectionTitle>
      <NoteParagraph>
        A failure model states what kinds of faults the protocol is designed to tolerate. A protocol correct under crash-stop failures may be
        completely wrong under Byzantine failures.
      </NoteParagraph>
      <NoteTable
        headers={['failure model', 'meaning', 'design implication']}
        rows={[
          ['crash-stop', 'process works correctly then stops forever', 'timeouts and majority replication may be enough'],
          ['omission', 'messages are not sent, received, or delivered', 'retries, timeouts, and idempotence matter'],
          ['crash-recovery', 'process stops then later resumes', 'stable storage and replay become necessary'],
          ['Byzantine', 'process can lie or behave arbitrarily', 'ordinary crash-fault protocols are insufficient'],
        ]}
      />
      <NoteParagraph>
        Timing assumptions also matter. In an asynchronous system, a slow process can be indistinguishable from a crashed one. Practical systems
        often preserve safety without timing assumptions but rely on partial synchrony for eventual progress.
      </NoteParagraph>

      <NoteSectionTitle id="consensus-and-replicated-state-machines">11. Consensus and Replicated State Machines</NoteSectionTitle>
      <NoteParagraph>
        Consensus asks a group of nodes to agree on a value despite failures and unreliable communication. Replicated state machines use consensus
        repeatedly to agree on a log of commands. If every replica applies the same deterministic commands in the same order, the replicas behave
        like one reliable machine.
      </NoteParagraph>
      <MathBlock math="\text{same initial state}+\text{same command log}+\text{deterministic execution}=\text{same final state}" />
      <NoteParagraph>
        Consensus is used for replicated databases, configuration services, metadata services, leader election, distributed locks, and fault-tolerant
        storage. It is powerful because it converts a collection of unreliable machines into one logical ordering point, as long as assumptions hold.
      </NoteParagraph>

      <NoteSectionTitle id="raft-leader-election">12. Raft Leader Election</NoteSectionTitle>
      <NoteParagraph>
        Raft decomposes consensus into leader election, log replication, safety, membership changes, and log compaction. Servers are followers,
        candidates, or leaders. Time is divided into terms, and at most one leader can be elected in a term.
      </NoteParagraph>
      <BulletList>
        <li>Followers remain followers while they receive valid leader heartbeats.</li>
        <li>If a follower times out, it becomes a candidate, increments term, votes for itself, and sends RequestVote RPCs.</li>
        <li>A candidate becomes leader after receiving votes from a majority.</li>
        <li>Randomized election timeouts reduce repeated split votes.</li>
        <li>A server that sees a higher term steps down to follower.</li>
      </BulletList>
      <RaftMajorityExplorer />

      <NoteSectionTitle id="raft-log-replication-and-safety">13. Raft Log Replication and Safety</NoteSectionTitle>
      <NoteParagraph>
        Clients send commands to the leader. The leader appends the command to its log, sends AppendEntries RPCs to followers, waits for safe
        replication, marks the entry committed, applies it to the state machine, and informs followers through later AppendEntries.
      </NoteParagraph>
      <NoteTable
        headers={['Raft safety property', 'meaning']}
        rows={[
          ['Election Safety', 'at most one leader is elected in a term'],
          ['Leader Append-Only', 'leaders do not overwrite or delete entries in their own logs'],
          ['Log Matching', 'matching index/term entries imply identical earlier log prefixes'],
          ['Leader Completeness', 'committed entries appear in later leaders logs'],
          ['State Machine Safety', 'no two servers apply different commands at the same log index'],
        ]}
      />
      <NoteParagraph>
        Majority intersection is the intuition behind much of Raft safety. Two majorities overlap, so information about committed entries cannot be
        completely lost across elections.
      </NoteParagraph>

      <NoteSectionTitle id="raft-snapshotting-and-configuration-changes">14. Raft Snapshotting and Configuration Changes</NoteSectionTitle>
      <NoteParagraph>
        Logs cannot grow forever. Snapshotting saves state after applying entries through some index and discards old log entries while keeping
        metadata needed for future consistency checks. Lagging followers can receive snapshots through InstallSnapshot.
      </NoteParagraph>
      <NoteParagraph>
        Cluster membership changes are subtle because two different configurations must not elect independent leaders. Raft uses joint consensus:
        during the transition, decisions require majorities from both old and new configurations, preserving overlap.
      </NoteParagraph>

      <NoteSectionTitle id="consistency-models">15. Consistency Models</NoteSectionTitle>
      <NoteParagraph>
        A consistency model is the contract for what results clients are allowed to observe. Strong models are easier for programmers. Weak models
        can be faster and more available, but clients may see stale values, reordered effects, or conflicts.
      </NoteParagraph>
      <ConsistencyModelExplorer />

      <NoteSectionTitle id="transactions-and-acid">16. Transactions and ACID</NoteSectionTitle>
      <NoteParagraph>
        A transaction groups multiple operations into one logical unit. For example, a money transfer should not credit one account without debiting
        the other, even if a crash or concurrent transaction occurs halfway through.
      </NoteParagraph>
      <NoteTable
        headers={['ACID property', 'meaning']}
        rows={[
          ['Atomicity', 'all operations happen or none happen'],
          ['Consistency', 'application invariants are preserved if the transaction starts in a valid state'],
          ['Isolation', 'concurrent transactions behave as if ordered according to the isolation guarantee'],
          ['Durability', 'committed effects survive failures'],
        ]}
      />
      <NoteParagraph>
        Serializability means a concurrent execution is equivalent to some serial execution. Strict serializability also respects real-time order.
      </NoteParagraph>

      <NoteSectionTitle id="two-phase-commit-and-atomic-commit">17. Two-Phase Commit and Atomic Commit</NoteSectionTitle>
      <NoteParagraph>
        Two-Phase Commit coordinates whether a distributed transaction commits or aborts. It has a coordinator and participants.
      </NoteParagraph>
      <CodeBlock
        language="text"
        code={`
phase 1: prepare / vote
    coordinator asks each participant if it can commit
    participant logs prepared state before voting yes

phase 2: decision
    if every participant votes yes, coordinator decides commit
    otherwise coordinator decides abort
    participants obey the final decision
        `}
      />
      <NoteParagraph>
        The key downside is blocking. A participant that voted yes cannot safely decide alone if the coordinator crashes before revealing the final
        decision. It must wait or recover the decision from stable logs or other participants.
      </NoteParagraph>

      <NoteSectionTitle id="distributed-shared-memory">18. Distributed Shared Memory</NoteSectionTitle>
      <NoteParagraph>
        Distributed Shared Memory tries to make multiple machines feel like they share memory. The goal is programmer convenience, but the network
        is much slower than local memory and cached shared pages create consistency problems.
      </NoteParagraph>
      <NoteParagraph>
        Release consistency weakens the memory model by synchronizing at acquire and release operations rather than after every write. Lazy release
        consistency delays propagation until another processor needs the updates. This reduces communication but requires correct synchronization.
      </NoteParagraph>

      <NoteSectionTitle id="sharding-and-consistent-hashing">19. Sharding and Consistent Hashing</NoteSectionTitle>
      <NoteParagraph>
        Sharding partitions a large dataset across servers. It improves storage capacity, throughput, and scalability, but adds routing, rebalancing,
        hotspot, and fault tolerance problems.
      </NoteParagraph>
      <MathBlock math="\text{simple shard}=\operatorname{hash}(\text{key}) \bmod N" />
      <NoteParagraph>
        The modulo scheme is simple but painful when <InlineMath math="N" /> changes because many keys move. Consistent hashing maps keys and
        servers onto a ring, so joins and leaves mainly affect nearby keys. Virtual nodes help balance load.
      </NoteParagraph>
      <ConsistentHashingExplorer />

      <NoteSectionTitle id="mapreduce">20. MapReduce</NoteSectionTitle>
      <NoteParagraph>
        MapReduce is a programming model and runtime for large-scale batch data processing. The programmer writes a map function and a reduce
        function; the runtime handles parallelism, scheduling, data partitioning, shuffle, failures, and load balancing.
      </NoteParagraph>
      <CodeBlock
        language="text"
        code={`
map(documentName, contents):
    for each word w:
        emit(w, 1)

reduce(word, counts):
    total = sum(counts)
    emit(word, total)
        `}
      />
      <MapReduceExplorer />

      <NoteSectionTitle id="google-file-system">21. Google File System</NoteSectionTitle>
      <NoteParagraph>
        GFS is a distributed file system designed for large files, large streaming reads, append-heavy workloads, high throughput, and frequent
        component failures. Its architecture uses one master for metadata and many chunkservers for data.
      </NoteParagraph>
      <NoteTable
        headers={['component', 'role']}
        rows={[
          ['master', 'namespace, file-to-chunk mapping, chunk locations, leases, chunk versions'],
          ['chunkserver', 'stores chunk data and serves reads/writes'],
          ['client', 'asks master for metadata, then talks directly to chunkservers for data'],
        ]}
      />
      <NoteParagraph>
        Writes use a primary chunk replica to order mutations and secondary replicas to apply the same order. Record append supports concurrent
        append-heavy workloads, but the consistency model is weaker than a traditional local file system.
      </NoteParagraph>

      <NoteSectionTitle id="dynamo">22. Dynamo</NoteSectionTitle>
      <NoteParagraph>
        Dynamo is a highly available decentralized key-value store. It prioritizes always-writable behavior, low latency, fault tolerance, scalability,
        and tunable consistency. The cost is that applications may need to resolve conflicts.
      </NoteParagraph>
      <NoteTable
        headers={['technique', 'purpose']}
        rows={[
          ['consistent hashing', 'partition keys and place replicas'],
          ['sloppy quorums', 'keep service available by writing to substitute nodes when preferred replicas are unavailable'],
          ['vector clocks', 'detect divergent object versions'],
          ['hinted handoff', 'later deliver writes accepted by temporary substitute nodes'],
          ['Merkle trees', 'compare replica ranges efficiently for anti-entropy repair'],
          ['gossip', 'spread membership and failure information without one master'],
        ]}
      />
      <QuorumExplorer />

      <NoteSectionTitle id="spanner">23. Spanner</NoteSectionTitle>
      <NoteParagraph>
        Spanner is a globally distributed database that combines strong consistency, transactions, replication, and multi-version storage. It
        contrasts with Dynamo: Dynamo favors high availability and eventual consistency, while Spanner invests in coordination and clock
        infrastructure for stronger guarantees.
      </NoteParagraph>
      <MathBlock math="\operatorname{TT.now()}=[\text{earliest},\text{latest}]" />
      <NoteParagraph>
        TrueTime exposes bounded clock uncertainty. Spanner assigns commit timestamps, then uses commit wait until real time is definitely after the
        timestamp. This helps provide external consistency, also called strict serializability: transaction order respects real-time order.
      </NoteParagraph>

      <NoteSectionTitle id="tla-plus">24. TLA+</NoteSectionTitle>
      <NoteParagraph>
        TLA+ is a formal specification language for describing system behavior, not an implementation language. It models states, transitions,
        invariants, safety properties, and liveness properties. This is valuable because distributed bugs often require rare interleavings that tests
        may never hit.
      </NoteParagraph>
      <TlaPropertyExplorer />

      <NoteSectionTitle id="paper-reading-framework">25. Paper Reading Framework</NoteSectionTitle>
      <NoteParagraph>
        Systems papers are best read as design arguments. The goal is not only to memorize architecture, but to understand the problem, assumptions,
        tradeoffs, and evidence.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Questions to Ask">
          <BulletList className="mb-0">
            <li>What problem is the system trying to solve?</li>
            <li>What workload and failure assumptions does it make?</li>
            <li>What are the central mechanisms?</li>
            <li>Which guarantees are strong, and which are intentionally weakened?</li>
            <li>What did the evaluation measure?</li>
            <li>What would break if the assumptions changed?</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>
      <PaperTradeoffExplorer />

      <NoteSectionTitle id="distributed-systems-design-tradeoffs">26. Distributed Systems Design Tradeoffs</NoteSectionTitle>
      <NoteParagraph>
        Distributed systems design is mostly tradeoff management. Replication helps fault tolerance but creates consistency work. Sharding helps scale
        but creates routing and rebalancing work. Consensus gives one logical system but requires a communicating majority. Weak consistency improves
        availability but pushes conflict handling upward.
      </NoteParagraph>
      <NoteTable
        headers={['tradeoff', 'one side', 'other side']}
        rows={[
          ['availability vs consistency', 'Dynamo accepts writes and reconciles later', 'Spanner coordinates for strong transactions'],
          ['centralization vs decentralization', 'GFS master simplifies metadata', 'Dynamo gossip avoids a single master role'],
          ['simplicity vs performance', 'MapReduce simplifies batch jobs', 'specialized systems beat it for low-latency or iterative work'],
          ['strong guarantees vs programmer burden', 'linearizability is easy to use', 'eventual consistency requires conflict logic'],
          ['safety vs liveness', 'Raft must not commit conflicting logs', 'progress may pause during partitions'],
        ]}
      />
      <NoteParagraph>
        Every node has partial knowledge. Correct systems make progress when assumptions are good, but preserve safety even
        when messages are delayed, machines fail, and the global story is temporarily unknowable.
      </NoteParagraph>
    </NotesLayout>
  );
}
