/**
 * Information Security Notes Page
 * A standalone note for web security, cryptography, identity, network security, LLM security, and secure design.
 */

import { useMemo, useState, type ReactNode } from 'react';
import { NotesLayout } from '../../../components/notes/NotesLayout';
import {
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
import { PasswordHashStretchingRunner } from './CsAlgorithmRunners';

type TableRow = ReactNode[];

function useSecurityTheme() {
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
  const { listClass } = useSecurityTheme();
  return <ul className={`${listClass} ${className}`}>{children}</ul>;
}

function NoteTable({ headers, rows }: { headers: ReactNode[]; rows: TableRow[] }) {
  const { tableClass, tableHeadClass, tableCellClass } = useSecurityTheme();

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

function SecurityNotationGuide() {
  return (
    <NoteTopicGroup>
      <NoteTopicBlock title="Terminology Used Throughout">
        <BulletList className="mb-0">
          <li>An asset is something worth protecting: data, money, credentials, availability, identity, or trust.</li>
          <li>A threat model states what the attacker can do and what security properties must hold anyway.</li>
          <li>A trust boundary is a place where data crosses from one trust domain to another.</li>
          <li>Confidentiality means attackers cannot read protected data.</li>
          <li>Integrity means attackers cannot modify data without detection.</li>
          <li>Authenticity means the message, server, user, or key really belongs to the claimed identity.</li>
          <li>An origin is the triple: scheme, host, and port.</li>
          <li><code>HTTP</code> is the web request-response protocol; <code>HTTPS</code> is HTTP protected by TLS.</li>
          <li><code>PK</code> means public key, <code>SK</code> means secret key, and <code>k</code> often denotes a symmetric key.</li>
          <li><code>LLM</code> means large language model; <code>RAG</code> means retrieval-augmented generation.</li>
        </BulletList>
      </NoteTopicBlock>
    </NoteTopicGroup>
  );
}

function ThreatModelExplorer() {
  return (
    <NoteTable
      headers={['Scenario', 'Asset', 'Attacker control', 'Main defenses']}
      rows={[
        ['Private photo app', 'private photos, account sessions, profile data', 'file uploads, captions, profile fields, image metadata', 'authorization on every object access, safe file handling, output encoding, private storage defaults'],
        ['Money transfer form', 'account balance and transfer authorization', 'attacker site can submit a request through a logged-in browser', 'CSRF token, SameSite cookies, Origin checks, re-authentication for high-risk transfers'],
        ['LLM email assistant', 'private email, contacts, tool permissions', 'untrusted email text retrieved into model context', 'label retrieved content as data, least-privilege tools, human approval, policy checks outside the model'],
      ]}
    />
  );
}

function WebArchitectureDiagram() {
  const { subtlePanelClass, primaryColor, secondaryColor, mutedColor, textColor } = useSecurityTheme();
  const nodes = [
    { label: 'Browser', x: 70, y: 90 },
    { label: 'HTTP(S)', x: 190, y: 90 },
    { label: 'Server', x: 310, y: 90 },
    { label: 'Database', x: 430, y: 90 },
    { label: 'Third party', x: 310, y: 165 },
  ];

  return (
    <div className={`mb-8 rounded-lg border p-4 ${subtlePanelClass}`}>
      <svg viewBox="0 0 500 220" className="h-72 w-full" role="img" aria-label="Web application trust boundaries">
        <defs>
          <marker id="security-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill={mutedColor} />
          </marker>
        </defs>
        <line x1="105" y1="90" x2="155" y2="90" stroke={mutedColor} strokeWidth="2" markerEnd="url(#security-arrow)" />
        <line x1="225" y1="90" x2="275" y2="90" stroke={mutedColor} strokeWidth="2" markerEnd="url(#security-arrow)" />
        <line x1="345" y1="90" x2="395" y2="90" stroke={mutedColor} strokeWidth="2" markerEnd="url(#security-arrow)" />
        <line x1="310" y1="118" x2="310" y2="137" stroke={secondaryColor} strokeWidth="2" markerEnd="url(#security-arrow)" />
        <line x1="150" y1="35" x2="150" y2="190" stroke={secondaryColor} strokeDasharray="6 5" strokeWidth="2" />
        <text x="154" y="30" fontFamily="monospace" fontSize="12" fill={secondaryColor}>trust boundary</text>
        {nodes.map((node) => (
          <g key={node.label}>
            <rect x={node.x - 42} y={node.y - 22} width="84" height="44" rx="7" fill={node.label === 'HTTP(S)' ? secondaryColor : primaryColor} fillOpacity="0.14" stroke={node.label === 'HTTP(S)' ? secondaryColor : primaryColor} />
            <text x={node.x} y={node.y + 4} textAnchor="middle" fontFamily="monospace" fontSize="12" fill={textColor}>{node.label}</text>
          </g>
        ))}
      </svg>
      <NoteParagraph className="mb-0 text-sm">
        Web bugs often happen when one layer treats attacker-controlled data as a different kind of thing: SQL, HTML, JavaScript, a state-changing request, or a trusted identity.
      </NoteParagraph>
    </div>
  );
}

function BrowserBoundaryExplorer() {
  return (
    <NoteTable
      headers={['Case', 'Browser behavior', 'Security point']}
      rows={[
        ['Script reads same-origin API', 'Allowed because scheme, host, and port match.', 'If XSS runs in this origin, it inherits this power.'],
        ['Script reads cross-origin private response', 'Blocked unless CORS permits it.', 'A bad CORS policy can expose sensitive API data.'],
        ['Page embeds cross-origin image', 'Usually allowed because loading differs from reading private contents.', 'The third party can still observe the request and use tracking cookies.'],
        ['Attacker page submits form to target site', 'The request may be sent with cookies attached.', 'Without CSRF defenses, state-changing actions may be triggered unintentionally.'],
      ]}
    />
  );
}

function CsrfDefenseExplorer() {
  const { subtlePanelClass } = useSecurityTheme();
  const [token, setToken] = useState(true);
  const [sameSite, setSameSite] = useState(true);
  const [originCheck, setOriginCheck] = useState(false);
  const blocked = token || sameSite || originCheck;

  return (
    <InteractiveBlock title="CSRF Defense Layers">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          {[
            ['csrf-token', 'Require CSRF token', token, setToken],
            ['samesite-cookie', 'Use SameSite cookie', sameSite, setSameSite],
            ['origin-check', 'Check Origin header', originCheck, setOriginCheck],
          ].map(([id, label, value, setter]) => (
            <label key={id as string} className="mb-3 flex items-center gap-3 text-sm" htmlFor={id as string}>
              <input id={id as string} type="checkbox" checked={value as boolean} onChange={(event) => (setter as (next: boolean) => void)(event.target.checked)} />
              <span>{label as string}</span>
            </label>
          ))}
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <NoteParagraph className="mb-3 text-sm">
            Attacker site {'->'} victim browser {'->'} target site transfer request.
          </NoteParagraph>
          <div className={`rounded border p-4 text-center text-sm font-bold ${blocked ? 'border-emerald-500/60' : 'border-red-500/60'}`}>
            {blocked ? 'Request is rejected by at least one defense layer.' : 'Request may be accepted if cookies alone are treated as intent.'}
          </div>
          <NoteParagraph className="mb-0 mt-4 text-sm">
            CSRF is about intent, not just identity. A valid session cookie proves the browser has a session; it does not prove the user meant to perform the action.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function CryptoPropertyExplorer() {
  return (
    <NoteTable
      headers={['Mechanism', 'Provides', 'Does not provide by itself']}
      rows={[
        ['Encryption', 'confidentiality', 'integrity or authenticity'],
        ['MAC', 'integrity and symmetric authenticity', 'confidentiality or public verifiability'],
        ['Digital signature', 'integrity and public authenticity', 'confidentiality'],
        ['Cryptographic hash', 'fixed digest and collision/preimage resistance goals', 'encryption or authentication without a key'],
        ['AEAD', 'confidentiality, integrity, and authenticity for a keyed channel', 'identity without key management or protection after endpoint compromise'],
        ['TLS/HTTPS', 'server authentication, channel confidentiality, and channel integrity', 'application authorization or protection from app-layer bugs'],
      ]}
    />
  );
}

function PasswordHashingExplorer() {
  const { subtlePanelClass, primaryColor, secondaryColor } = useSecurityTheme();
  const [guesses, setGuesses] = useState(1_000_000);
  const [hashMs, setHashMs] = useState(100);
  const seconds = (guesses * hashMs) / 1000;
  const hours = seconds / 3600;
  const fastSeconds = guesses / 100_000_000;
  const width = Math.min(100, Math.max(4, Math.log10(seconds + 1) * 15));
  const fastWidth = Math.min(100, Math.max(4, Math.log10(fastSeconds + 1) * 15));

  return (
    <InteractiveBlock title="Password Hashing Cost Intuition">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="password-guesses">
            <span>Offline guesses</span>
            <span>{guesses.toLocaleString()}</span>
          </label>
          <input id="password-guesses" type="range" min="1000" max="10000000" step="1000" value={guesses} onChange={(event) => setGuesses(Number(event.target.value))} className="mb-4 w-full" />
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="hash-cost">
            <span>Cost per guess</span>
            <span>{hashMs} ms</span>
          </label>
          <input id="hash-cost" type="range" min="10" max="500" step="10" value={hashMs} onChange={(event) => setHashMs(Number(event.target.value))} className="w-full" />
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <div className="mb-4 space-y-3 text-sm">
            <div>
              <div className="mb-1 flex justify-between"><span>Fast hash model</span><span>{fastSeconds.toFixed(4)} sec</span></div>
              <div className="h-5 rounded border border-current/20"><div className="h-full rounded" style={{ width: `${fastWidth}%`, backgroundColor: primaryColor, opacity: 0.7 }} /></div>
            </div>
            <div>
              <div className="mb-1 flex justify-between"><span>Slow password hash</span><span>{hours >= 1 ? `${hours.toFixed(2)} hr` : `${seconds.toFixed(1)} sec`}</span></div>
              <div className="h-5 rounded border border-current/20"><div className="h-full rounded" style={{ width: `${width}%`, backgroundColor: secondaryColor, opacity: 0.7 }} /></div>
            </div>
          </div>
          <NoteParagraph className="mb-0 text-sm">
            Salts prevent one precomputed table from helping against many users. Slow, memory-hard hashes make each offline guess expensive.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function TlsPkiDiagram() {
  const { subtlePanelClass, primaryColor, secondaryColor, mutedColor, textColor } = useSecurityTheme();
  const steps = ['Client connects', 'Server certificate', 'CA chain check', 'Key exchange', 'Encrypted records'];

  return (
    <InteractiveBlock title="TLS and Certificate Flow">
      <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
        <svg viewBox="0 0 620 160" className="h-56 w-full" role="img" aria-label="TLS handshake and certificate verification">
          <defs>
            <marker id="tls-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill={mutedColor} />
            </marker>
          </defs>
          {steps.map((step, index) => {
            const x = 55 + index * 125;
            return (
              <g key={step}>
                <rect x={x - 47} y="50" width="94" height="46" rx="7" fill={index === 2 ? secondaryColor : primaryColor} fillOpacity="0.14" stroke={index === 2 ? secondaryColor : primaryColor} />
                <text x={x} y="70" textAnchor="middle" fontFamily="monospace" fontSize="11" fill={textColor}>{step.split(' ')[0]}</text>
                <text x={x} y="85" textAnchor="middle" fontFamily="monospace" fontSize="11" fill={textColor}>{step.split(' ').slice(1).join(' ')}</text>
                {index < steps.length - 1 && <line x1={x + 50} y1="73" x2={x + 75} y2="73" stroke={mutedColor} strokeWidth="2" markerEnd="url(#tls-arrow)" />}
              </g>
            );
          })}
        </svg>
        <NoteParagraph className="mb-0 text-sm">
          Certificates answer whether a public key belongs to the requested domain. The negotiated symmetric keys then protect application data efficiently.
        </NoteParagraph>
      </div>
    </InteractiveBlock>
  );
}

function IdentityFlowExplorer() {
  return (
    <NoteTable
      headers={['Mechanism', 'Main artifact', 'Watch out for']}
      rows={[
        ['Password login', 'session cookie after successful login', 'reuse, phishing, guessing, leaks, and weak reset flows'],
        ['MFA', 'second-factor challenge approval or code', 'phishable OTP/push flows and MFA fatigue'],
        ['OAuth 2.0', 'access token', 'overbroad scopes, token leakage, redirect mistakes, and using OAuth as login by itself'],
        ['OpenID Connect', 'ID token', 'incorrect token validation or confusing access tokens with ID tokens'],
        ['FIDO/WebAuthn', 'origin-bound signature from a private key on the authenticator', 'account recovery and device enrollment still need careful design'],
      ]}
    />
  );
}

function NetworkTrustExplorer() {
  return (
    <NoteTable
      headers={['Protocol', 'Job', 'Security risk', 'Mitigation direction']}
      rows={[
        ['TCP', 'reliable ordered byte stream between ports', 'reset/injection risks if sequence validation or entropy is weak', 'randomized sequence numbers, filtering, encryption/authentication above TCP'],
        ['UDP', 'connectionless datagrams with low overhead', 'source spoofing and reflection/amplification', 'source address validation, rate limiting, protocol hardening'],
        ['DNS', 'maps names to records such as IP addresses', 'spoofing, cache poisoning, privacy leakage, and domain hijacking', 'bailiwick checks, DNSSEC validation, encrypted DNS for privacy'],
        ['BGP', 'interdomain routing announcements between autonomous systems', 'prefix hijacks, route leaks, blackholing, and traffic interception', 'RPKI/ROA validation, route filtering, monitoring'],
      ]}
    />
  );
}

function LlmSecurityExplorer() {
  return (
    <NoteTable
      headers={['Boundary', 'Untrusted input', 'Possible failure', 'Defense']}
      rows={[
        ['Direct chat', 'user message', 'model follows attacker instructions instead of intended policy', 'instruction hierarchy, refusal/policy logic, output validation'],
        ['RAG document', 'retrieved document text', 'model treats document content as instructions', 'label retrieved text as data, filter sources, enforce access control before retrieval'],
        ['Tool-using agent', 'email, webpage, issue, or document read by the model', 'malicious text causes unauthorized tool use or data exfiltration', 'least privilege, human approval, separate read/write tools, policy checks outside the model'],
        ['Output handling', 'model output', 'output becomes SQL, shell, HTML, code, or API action without validation', 'schemas, escaping, sandboxing, authorization checks, human review for dangerous actions'],
      ]}
    />
  );
}

export default function InformationSecurityNote() {
  const injectionRows = useMemo<TableRow[]>(
    () => [
      ['SQL injection', 'user data becomes SQL syntax', 'prepared statements and least privilege'],
      ['XSS', 'user data becomes HTML or JavaScript', 'contextual output encoding and safe DOM APIs'],
      ['Command injection', 'user data becomes shell syntax', 'avoid shells, structured APIs, allowlists'],
      ['Prompt injection', 'untrusted text becomes model instruction', 'separate data from instructions and gate tools externally'],
    ],
    [],
  );

  return (
    <NotesLayout>
      <NoteHeader
        title="Information Security"
        subtitle="Protect web apps, cryptographic protocols, identity systems, networks, AI systems, and software designs by modeling threats and enforcing security properties."
      />

      <SecurityNotationGuide />

      <NoteSectionTitle id="security-and-threat-modeling">1. Security and Threat Modeling</NoteSectionTitle>
      <NoteParagraph>
        Information security studies what can go wrong when a system is used by an adversary. A threat model names the assets, adversaries, attacker-controlled inputs, trust boundaries, and security properties that must hold.
      </NoteParagraph>
      <MathBlock math="\text{security}=\text{policy}+\text{mechanism}+\text{threat model}" />
      <NoteTopicGroup>
        <NoteTopicBlock title="Threat Modeling Questions">
          <BulletList className="mb-0">
            <li>What assets are being protected?</li>
            <li>Who are the adversaries, and what capabilities do they have?</li>
            <li>Where can attacker-controlled input enter?</li>
            <li>Where are the trust boundaries?</li>
            <li>Which goals matter: confidentiality, integrity, availability, authenticity, privacy, or accountability?</li>
            <li>What mitigations reduce likelihood, impact, or both?</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>
      <ThreatModelExplorer />

      <NoteSectionTitle id="responsible-disclosure-and-cfaa">2. Responsible Disclosure and CFAA</NoteSectionTitle>
      <NoteParagraph>
        Security knowledge carries legal and ethical boundaries. Responsible disclosure means reporting a vulnerability through an appropriate
        channel, limiting testing to authorized scope, minimizing access to data, and giving the affected organization time to fix the problem before
        public details create broader risk.
      </NoteParagraph>
      <NoteParagraph>
        In the United States, the Computer Fraud and Abuse Act is a major law around unauthorized computer access. This note is not legal advice:
        the practical lesson is to get explicit authorization, follow published vulnerability disclosure or bug bounty rules, and avoid collecting,
        modifying, or retaining data beyond what is necessary to report the issue.
      </NoteParagraph>
      <BulletList>
        <li>Do not test systems without authorization.</li>
        <li>Do not extract secrets or private data as proof.</li>
        <li>Document observations carefully and proportionally.</li>
        <li>Use official reporting channels when available.</li>
        <li>Respect scope, safe-harbor language, and stop conditions.</li>
      </BulletList>

      <NoteSectionTitle id="web-architecture-urls-http-https">3. Web Architecture: URLs, HTTP, HTTPS</NoteSectionTitle>
      <NoteParagraph>
        A web app combines browser behavior, URLs, HTTP requests, server logic, databases, JavaScript, cookies, third-party resources, and TLS. Many
        bugs happen because data changes meaning as it crosses layers.
      </NoteParagraph>
      <WebArchitectureDiagram />
      <NoteTable
        headers={['URL part', 'example', 'meaning']}
        rows={[
          ['scheme', 'https', 'protocol used to retrieve the resource'],
          ['host', 'example.com', 'server name'],
          ['port', '443', 'network service endpoint'],
          ['path', '/account', 'resource path on the server'],
          ['query', '?tab=settings', 'client-provided parameters sent to server'],
          ['fragment', '#profile', 'client-side fragment not sent in the HTTP request'],
        ]}
      />
      <NoteParagraph>
        HTTP is plaintext. HTTPS is HTTP over TLS, which gives channel confidentiality, integrity, and server authentication. HTTPS does not fix SQL
        injection, XSS, broken authorization, phishing, or unsafe application logic; it secures the connection, not the entire system.
      </NoteParagraph>

      <NoteSectionTitle id="sql-injection">4. SQL Injection</NoteSectionTitle>
      <NoteParagraph>
        SQL injection occurs when attacker-controlled input is treated as SQL syntax instead of data. The root problem is code/data confusion: the
        server intended to search for a value, but the database parser received a different query structure.
      </NoteParagraph>
      <NoteTable
        headers={['pattern', 'what happens']}
        rows={[
          ['insecure concatenation', <span>The query string is built with raw input, so attacker text can become SQL syntax.</span>],
          ['prepared statement', <span>The database parses <code>SELECT email FROM users WHERE name = ?</code> first, then binds user input as data for the placeholder.</span>],
        ]}
      />
      <NoteParagraph>
        Prepared statements parse the SQL structure first and bind user input later as data. Escaping is fragile because it depends on getting every
        syntax context correct; parameterized queries are the primary defense.
      </NoteParagraph>
      <BulletList>
        <li>Use prepared statements or safe ORM parameter binding.</li>
        <li>Do not concatenate raw user input into SQL.</li>
        <li>Use least-privilege database accounts.</li>
        <li>Avoid exposing detailed database errors to users.</li>
        <li>Allowlist table or column identifiers if they must be user-selected.</li>
      </BulletList>

      <NoteSectionTitle id="xss">5. XSS</NoteSectionTitle>
      <NoteParagraph>
        Cross-site scripting is browser code injection. It happens when attacker-controlled input is included in a page and interpreted as HTML or
        JavaScript in the victim site's origin. The attacker wants code running with the victim site's browser privileges.
      </NoteParagraph>
      <NoteTable
        headers={['type', 'where the payload lives', 'typical shape']}
        rows={[
          ['stored XSS', 'saved on the server', 'comments, profiles, reviews, support tickets'],
          ['reflected XSS', 'in the request and immediate response', 'crafted link or submitted parameter reflected into HTML'],
          ['DOM-based XSS', 'client-side JavaScript', 'unsafe DOM sink receives URL fragment, query string, storage, or message data'],
        ]}
      />
      <NoteParagraph>
        XSS defenses depend on output context. HTML text, HTML attributes, JavaScript strings, URLs, and CSS each need different escaping rules. Safe
        templating helps, but dangerous DOM sinks such as <code>innerHTML</code> still deserve special care.
      </NoteParagraph>
      <BulletList>
        <li>Encode output for the exact context.</li>
        <li>Use safe DOM APIs such as text insertion rather than HTML parsing.</li>
        <li>Sanitize rich text with a well-tested sanitizer.</li>
        <li>Use Content Security Policy as defense in depth.</li>
        <li>Mark session cookies <code>HttpOnly</code> so XSS cannot read them through <code>document.cookie</code>.</li>
      </BulletList>
      <NoteTable headers={['injection pattern', 'boundary failure', 'main mitigation']} rows={injectionRows} />

      <NoteSectionTitle id="csrf">6. CSRF</NoteSectionTitle>
      <NoteParagraph>
        Cross-site request forgery abuses ambient authority. If a user is logged in with cookies, an attacker-controlled page may cause the browser
        to send a state-changing request to the target site. The attacker usually cannot read the response, but causing the action may be enough.
      </NoteParagraph>
      <CsrfDefenseExplorer />
      <NoteParagraph>
        CSRF defenses make the server check intent, not just identity. Tokens work because the attacker site cannot read a secret token from the
        target origin. SameSite cookies reduce when cookies ride along cross-site. Origin checks verify where the request came from.
      </NoteParagraph>

      <NoteSectionTitle id="same-origin-policy-cors-and-browser-security">7. Same-Origin Policy, CORS, and Browser Security</NoteSectionTitle>
      <NoteParagraph>
        The same-origin policy is a browser boundary. An origin is the scheme, host, and port. Scripts from one origin are restricted from reading
        sensitive responses belonging to another origin, but browsers still allow many forms of cross-origin loading.
      </NoteParagraph>
      <BrowserBoundaryExplorer />
      <NoteParagraph>
        CORS lets a server opt into cross-origin reads. It is not authentication. A broad CORS policy can leak sensitive API responses if it allows
        untrusted origins to read credentialed data.
      </NoteParagraph>

      <NoteSectionTitle id="cookies-sessions-and-cookie-flags">8. Cookies, Sessions, and Cookie Flags</NoteSectionTitle>
      <NoteParagraph>
        A cookie is a small browser-stored value sent with matching HTTP requests. Session cookies commonly identify a logged-in user, so whoever
        has the session cookie may be treated as that user.
      </NoteParagraph>
      <NoteTable
        headers={['cookie attribute', 'effect', 'security use']}
        rows={[
          ['Secure', 'send only over HTTPS', 'prevents accidental plaintext transmission'],
          ['HttpOnly', 'hide from JavaScript', 'reduces cookie theft through XSS'],
          ['SameSite', 'limit cross-site sending', 'reduces CSRF risk'],
          ['Path/Domain', 'scope where cookie is sent', 'limits unnecessary exposure'],
        ]}
      />
      <NoteParagraph>
        Cookies are powerful because the browser attaches them automatically. That convenience is also why CSRF exists.
      </NoteParagraph>

      <NoteSectionTitle id="web-privacy-and-tracking-pixels">9. Web Privacy and Tracking Pixels</NoteSectionTitle>
      <NoteParagraph>
        A tracking pixel is a tiny third-party resource, often an image, loaded by a page or email. When the browser loads it, the third party may
        learn the IP address, time, browser metadata, referring context, URL parameters, and tracking-domain cookies.
      </NoteParagraph>
      <BulletList>
        <li>Privacy leaks can come from images, scripts, iframes, fonts, analytics, beacons, and referrer headers.</li>
        <li>Loading a third-party resource can reveal behavior even if the user never clicks anything.</li>
        <li>Browser privacy controls often try to reduce cross-site tracking rather than eliminate all third-party loading.</li>
      </BulletList>

      <NoteSectionTitle id="hsts-and-https-deployment">10. HSTS and HTTPS Deployment</NoteSectionTitle>
      <NoteParagraph>
        HSTS, or HTTP Strict Transport Security, tells browsers to use HTTPS for a domain and avoid HTTP. This helps against downgrade and
        SSL-stripping attacks where a network attacker tries to keep the user on plaintext HTTP.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Deployment Intuition">
          <BulletList className="mb-0">
            <li>Without HSTS, the first visit or an old link to HTTP can be risky.</li>
            <li>With HSTS, the browser remembers that the site must be HTTPS.</li>
            <li>HSTS protects transport choice; it does not replace application security.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="cryptography-overview">11. Cryptography Overview</NoteSectionTitle>
      <NoteParagraph>
        Cryptography gives mathematical tools for security properties such as secrecy, message integrity, sender authenticity, public verification,
        key exchange, and password storage. The practical rule is to understand what property a primitive provides and to use standard libraries
        rather than inventing new schemes.
      </NoteParagraph>
      <CryptoPropertyExplorer />

      <NoteSectionTitle id="confidentiality-integrity-and-authenticity">12. Confidentiality, Integrity, and Authenticity</NoteSectionTitle>
      <NoteParagraph>
        These properties are related but separate. Encryption usually targets confidentiality. MACs and signatures target integrity and authenticity.
        TLS combines multiple mechanisms to protect a channel.
      </NoteParagraph>
      <NoteTable
        headers={['property', 'question it answers', 'common mechanism']}
        rows={[
          ['confidentiality', 'Can an attacker read it?', 'encryption'],
          ['integrity', 'Can an attacker modify it undetected?', 'MAC, digital signature, AEAD'],
          ['authenticity', 'Who sent it or owns this key?', 'MAC, digital signature, certificate'],
        ]}
      />

      <NoteSectionTitle id="symmetric-encryption">13. Symmetric Encryption</NoteSectionTitle>
      <NoteParagraph>
        Symmetric encryption uses one shared secret key <InlineMath math="k" /> for encryption and decryption. It is efficient, but both parties
        need a safe way to share the key first.
      </NoteParagraph>
      <MathBlock math="c=\operatorname{Enc}_k(m),\qquad m=\operatorname{Dec}_k(c)" />
      <NoteParagraph>
        Historical ciphers such as Caesar shifts are useful intuition but not security: tiny key spaces and visible patterns make them breakable.
        One-time pads provide perfect secrecy only under strict conditions: truly random key, key as long as the message, one use only, and secrecy
        of the key.
      </NoteParagraph>
      <NoteParagraph>
        Modern systems use stream ciphers, block ciphers with safe modes, or authenticated encryption. A block cipher by itself is not a complete
        secure encryption scheme; the mode and authentication matter.
      </NoteParagraph>

      <NoteSectionTitle id="macs-and-authenticated-encryption">14. MACs and Authenticated Encryption</NoteSectionTitle>
      <NoteParagraph>
        A MAC, or Message Authentication Code, uses a shared secret key to produce a tag for a message. Verification checks whether the tag is valid.
        MACs provide integrity and symmetric authenticity, but they do not hide the message.
      </NoteParagraph>
      <MathBlock math="t=\operatorname{MAC}_k(m),\qquad \operatorname{Ver}_k(m,t)\in\{0,1\}" />
      <NoteParagraph>
        Encrypt-then-MAC is the safe composition idea: encrypt the message, authenticate the ciphertext, and verify before decrypting. Modern AEAD
        schemes package confidentiality, integrity, and authenticity together.
      </NoteParagraph>

      <NoteSectionTitle id="hash-functions-and-password-hashing">15. Hash Functions and Password Hashing</NoteSectionTitle>
      <NoteParagraph>
        A cryptographic hash maps arbitrary input to a fixed-length digest. Hashing is not encryption; a digest cannot be decrypted. Security goals
        include preimage resistance, second-preimage resistance, and collision resistance.
      </NoteParagraph>
      <NoteTable
        headers={['property', 'attacker goal']}
        rows={[
          ['preimage resistance', <span>given <InlineMath math="h" />, find <InlineMath math="m" /> with <InlineMath math="H(m)=h" /></span>],
          ['second-preimage resistance', <span>given <InlineMath math="m" />, find different <InlineMath math="m'" /> with same hash</span>],
          ['collision resistance', <span>find any two different messages with the same hash</span>],
        ]}
      />
      <NoteParagraph>
        Password storage needs more than a fast hash. A leaked password database enables offline guessing, so systems use salts and slow,
        memory-hard password hashing such as bcrypt, scrypt, Argon2, or PBKDF2.
      </NoteParagraph>
      <PasswordHashingExplorer />
      <PasswordHashStretchingRunner />

      <NoteSectionTitle id="public-key-cryptography">16. Public Key Cryptography</NoteSectionTitle>
      <NoteParagraph>
        Public key cryptography uses a public key <code>PK</code> and secret key <code>SK</code>. The public key can be distributed; the secret key
        must remain private. Public key crypto enables encryption to a recipient, digital signatures, key exchange, certificates, and TLS
        authentication.
      </NoteParagraph>
      <NoteParagraph>
        Public key operations are usually slower than symmetric crypto, so real systems often use hybrid designs: public key crypto establishes or
        protects a symmetric key, then symmetric crypto carries the bulk data.
      </NoteParagraph>

      <NoteSectionTitle id="digital-signatures-and-bitcoin">17. Digital Signatures and Bitcoin</NoteSectionTitle>
      <NoteParagraph>
        Digital signatures provide public verifiability. The signer uses a secret key; anyone with the public key can verify. Unlike MACs, the
        verifier does not need the signing key.
      </NoteParagraph>
      <MathBlock math="\operatorname{Verify}_{PK}(m,\operatorname{Sign}_{SK}(m))=1" />
      <NoteParagraph>
        Signature schemes include RSA signatures, ECDSA, and EdDSA. The implementation lesson is simple: use standard libraries and protect private
        keys. Some schemes are extremely sensitive to nonce misuse. In Bitcoin-like systems, signatures authorize spending, so private-key loss or
        theft directly affects asset control.
      </NoteParagraph>

      <NoteSectionTitle id="diffie-hellman-key-exchange">18. Diffie-Hellman Key Exchange</NoteSectionTitle>
      <NoteParagraph>
        Diffie-Hellman lets two parties establish a shared symmetric key over public communication. An eavesdropper sees public values but should
        not be able to compute the shared secret.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Authentication Gap">
          <NoteParagraph className="mb-0 text-sm">
            Plain Diffie-Hellman does not prove who is on the other side. A man-in-the-middle can run separate exchanges with both parties unless
            the exchange is authenticated with signatures, certificates, or another identity mechanism.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="tls-certificates-and-pki">19. TLS, Certificates, and PKI</NoteSectionTitle>
      <NoteParagraph>
        TLS secures protocols such as HTTPS. The handshake negotiates keys and authenticates the server. The record layer then protects application
        data with symmetric cryptography.
      </NoteParagraph>
      <TlsPkiDiagram />
      <NoteParagraph>
        A certificate binds a public key to an identity such as a domain name. A certificate authority signs that binding. Browsers check the chain,
        domain name, expiration, and algorithm requirements before trusting the server key.
      </NoteParagraph>
      <NoteParagraph>
        TLS is connection encryption between client and server. End-to-end encryption is different: only the final sender and recipient can decrypt,
        even if intermediate service providers forward the data.
      </NoteParagraph>

      <NoteSectionTitle id="authentication-vs-authorization">20. Authentication vs Authorization</NoteSectionTitle>
      <NoteParagraph>
        Authentication asks who the user is. Authorization asks what that user is allowed to do. Many real bugs happen when a system authenticates a
        user but forgets to check object-level or action-level authorization.
      </NoteParagraph>
      <NoteTable
        headers={['question', 'example check']}
        rows={[
          ['Are you logged in?', 'session exists and is valid'],
          ['Are you allowed to access this object?', 'resource owner or permission rule matches'],
          ['Are you allowed to perform this action now?', 'role, state, risk, and intent checks pass'],
        ]}
      />

      <NoteSectionTitle id="passwords-credential-stuffing-and-mfa">21. Passwords, Credential Stuffing, and MFA</NoteSectionTitle>
      <NoteParagraph>
        Passwords are long-lived shared secrets. They fail through weak choices, reuse, phishing, database leaks, malware, and bad reset flows.
        Credential stuffing abuses password reuse by trying leaked username/password pairs on other services.
      </NoteParagraph>
      <IdentityFlowExplorer />
      <NoteParagraph>
        MFA reduces the impact of password theft by requiring another factor, but not all MFA is equal. OTPs and push approvals can be phished or
        abused through fatigue. FIDO/WebAuthn is stronger because signatures are bound to the real website origin and the private key stays on the
        authenticator.
      </NoteParagraph>

      <NoteSectionTitle id="oauth-2-0">22. OAuth 2.0</NoteSectionTitle>
      <NoteParagraph>
        OAuth 2.0 is delegated authorization. It lets a client application access an API without receiving the user's password. Instead, an
        authorization server issues a scoped access token.
      </NoteParagraph>
      <NoteTable
        headers={['role', 'meaning']}
        rows={[
          ['resource owner', 'the user who owns the data'],
          ['client', 'the app requesting delegated access'],
          ['authorization server', 'authenticates user and issues tokens'],
          ['resource server', 'API that accepts valid access tokens'],
          ['access token', 'bearer of scoped permission to an API'],
        ]}
      />
      <NoteParagraph>
        Tokens should be scoped, short-lived, revocable, and protected like credentials.
      </NoteParagraph>

      <NoteSectionTitle id="openid-connect">23. OpenID Connect</NoteSectionTitle>
      <NoteParagraph>
        OAuth answers authorization questions. OpenID Connect adds authentication on top of OAuth so a client can learn who logged in. The important
        artifact is the ID token, which asserts identity and authentication information.
      </NoteParagraph>
      <NoteTable
        headers={['artifact', 'purpose']}
        rows={[
          ['OAuth access token', 'used to call APIs with delegated permission'],
          ['OIDC ID token', 'used by the client to learn the authenticated user identity'],
        ]}
      />

      <NoteSectionTitle id="networking-basics-tcp-udp-ip">24. Networking Basics: TCP, UDP, IP</NoteSectionTitle>
      <NoteParagraph>
        The Internet is a network of networks. A simplified stack is application, transport, network, and link. Application messages are carried
        inside TCP or UDP segments, inside IP packets, inside link-layer frames. Each layer adds its own metadata and its own security assumptions.
      </NoteParagraph>
      <NetworkTrustExplorer />

      <NoteSectionTitle id="ddos-and-reflection-attacks">25. DDoS and Reflection Attacks</NoteSectionTitle>
      <NoteParagraph>
        A denial-of-service attack tries to make a service unavailable. A distributed denial-of-service attack uses many machines or sources. A
        reflection attack sends spoofed requests to third-party reflectors so their replies flood the victim. Amplification happens when a small
        request causes a large response.
      </NoteParagraph>
      <BulletList>
        <li>Source address validation reduces spoofing.</li>
        <li>Rate limiting and filtering reduce flood impact.</li>
        <li>Protocol hardening reduces amplification opportunities.</li>
        <li>DDoS mitigation services absorb or filter large traffic spikes.</li>
      </BulletList>

      <NoteSectionTitle id="dns-security">26. DNS Security</NoteSectionTitle>
      <NoteParagraph>
        DNS maps names to records. A resolver may query root servers, TLD servers, and authoritative nameservers, then cache the result. Traditional
        DNS was not designed with strong authentication, which creates spoofing, cache poisoning, and privacy risks.
      </NoteParagraph>
      <NoteTable
        headers={['risk', 'impact', 'mitigation']}
        rows={[
          ['cache poisoning', 'resolver stores false record', 'transaction/source-port randomization, bailiwick checks, DNSSEC'],
          ['privacy leakage', 'local network sees queried domains', 'DoT or DoH, with trust shifted to resolver'],
          ['domain hijacking', 'attacker changes authoritative control', 'registrar security, DNSSEC, monitoring'],
        ]}
      />

      <NoteSectionTitle id="bgp-security">27. BGP Security</NoteSectionTitle>
      <NoteParagraph>
        BGP is the interdomain routing protocol. Autonomous systems announce which IP prefixes they can reach, and other networks choose routes
        based on path and policy. BGP is powerful but historically trust-heavy.
      </NoteParagraph>
      <BulletList>
        <li>Prefix hijacking redirects traffic by falsely announcing reachability.</li>
        <li>Route leaks spread routes beyond intended policy.</li>
        <li>Misconfiguration can create global outages or traffic detours.</li>
        <li>RPKI and ROA validation help check whether an AS is authorized to originate a prefix.</li>
        <li>Filtering, monitoring, and operational discipline remain essential.</li>
      </BulletList>

      <NoteSectionTitle id="llm-security-and-prompt-injection">28. LLM Security and Prompt Injection</NoteSectionTitle>
      <NoteParagraph>
        LLM applications blur the boundary between instructions and data. Prompt injection occurs when untrusted text changes the model's behavior
        away from the intended instructions. The risk grows when the model can read private data or call tools.
      </NoteParagraph>
      <LlmSecurityExplorer />
      <NoteParagraph>
        Direct prompt injection comes from the user talking to the model. Indirect prompt injection comes from external content such as webpages,
        emails, documents, tickets, retrieved RAG chunks, or tool outputs. Jailbreaks target policy bypass; agent hijacking targets unauthorized
        tool use, data exfiltration, or process manipulation.
      </NoteParagraph>
      <BulletList>
        <li>Treat user and retrieved content as untrusted.</li>
        <li>Do not put secrets in prompts.</li>
        <li>Separate read tools from write tools where possible.</li>
        <li>Use least privilege and human approval for sensitive actions.</li>
        <li>Validate model outputs before passing them to interpreters or APIs.</li>
        <li>Apply authorization outside the model.</li>
      </BulletList>

      <NoteSectionTitle id="secure-system-design-principles">29. Secure System Design Principles</NoteSectionTitle>
      <NoteParagraph>
        The themes repeat across the whole subject. Most security failures are not isolated tricks; they are boundary failures, trust failures,
        authorization failures, or composition failures.
      </NoteParagraph>
      <NoteTable
        headers={['principle', 'meaning']}
        rows={[
          ['code/data separation', 'do not let untrusted data become instructions'],
          ['least privilege', 'give each component only the access it needs'],
          ['defense in depth', 'assume one layer can fail and add independent layers'],
          ['complete mediation', 'check authorization on every access, not just at login'],
          ['secure defaults', 'make the safe path the easy path'],
          ['fail closed', 'deny when checks are missing, ambiguous, or broken'],
          ['usability-aware security', 'design controls users and developers can operate correctly'],
        ]}
      />
    </NotesLayout>
  );
}
