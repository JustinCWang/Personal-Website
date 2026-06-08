/**
 * Cryptography Notes Page
 * A standalone note for security games, reductions, pseudorandomness, encryption, MACs, public-key crypto, signatures, zero knowledge, and secure computation.
 */

import { useState, type ReactNode } from 'react';
import { NotesLayout } from '../../../components/notes/NotesLayout';
import {
  AlgorithmBlock,
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

function useCryptoTheme() {
  const { isDarkMode } = useDarkMode();
  const subtlePanelClass = isDarkMode
    ? 'bg-green-500/5 border-green-500/20 text-green-100'
    : 'bg-slate-50 border-slate-200 text-slate-700';
  const tableClass = `w-full border-collapse overflow-hidden rounded-lg font-mono text-sm ${
    isDarkMode ? 'text-green-100' : 'text-slate-700'
  }`;
  const tableHeadClass = isDarkMode ? 'bg-green-500/15 text-green-300' : 'bg-slate-100 text-slate-800';
  const tableCellClass = isDarkMode ? 'border border-green-500/20' : 'border border-slate-200';
  const listClass = `list-disc pl-6 mb-6 font-mono text-sm leading-relaxed space-y-2 ${
    isDarkMode ? 'text-green-100/90' : 'text-slate-700'
  }`;
  const primaryColor = isDarkMode ? '#4ade80' : '#2563eb';
  const secondaryColor = isDarkMode ? '#fb923c' : '#ea580c';
  const accentColor = isDarkMode ? '#38bdf8' : '#0891b2';
  const mutedColor = isDarkMode ? '#86efac66' : '#94a3b8';
  const textColor = isDarkMode ? '#bbf7d0' : '#334155';

  return {
    subtlePanelClass,
    tableClass,
    tableHeadClass,
    tableCellClass,
    listClass,
    primaryColor,
    secondaryColor,
    accentColor,
    mutedColor,
    textColor,
  };
}

function BulletList({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { listClass } = useCryptoTheme();
  return <ul className={`${listClass} ${className}`}>{children}</ul>;
}

function NoteTable({ headers, rows }: { headers: ReactNode[]; rows: TableRow[] }) {
  const { tableClass, tableHeadClass, tableCellClass } = useCryptoTheme();

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

function CryptographyNotationGuide() {
  return (
    <NoteTopicGroup>
      <NoteTopicBlock title="Notation Used Throughout">
        <BulletList className="mb-0">
          <li><InlineMath math="A" /> is an adversary or attacker. <InlineMath math="B" /> is often a reduction adversary built using <InlineMath math="A" />.</li>
          <li><InlineMath math="W_b" /> is the event that the adversary outputs <InlineMath math="1" /> in experiment <InlineMath math="b" />.</li>
          <li><InlineMath math="Adv[A]" /> is an advantage. Exact constants depend on the game convention, so each section states the formula it uses.</li>
          <li><InlineMath math="\lambda" /> is the security parameter. Efficient means polynomial time in <InlineMath math="\lambda" />.</li>
          <li><InlineMath math="\epsilon(\lambda)" /> is a negligible or small error term.</li>
          <li><InlineMath math="Gen" />, <InlineMath math="Enc" />, and <InlineMath math="Dec" /> are key generation, encryption, and decryption.</li>
          <li><InlineMath math="Tag" /> and <InlineMath math="Verify" /> are MAC tag generation and verification.</li>
          <li><InlineMath math="Sign" /> and <InlineMath math="Verify" /> are signature generation and public verification.</li>
          <li><InlineMath math="k" /> is a symmetric key. <InlineMath math="pk" /> and <InlineMath math="sk" /> are public and secret keys.</li>
          <li><InlineMath math="m" /> is a message, <InlineMath math="c" /> is a ciphertext, <InlineMath math="t" /> is a tag, and <InlineMath math="\sigma" /> is a signature.</li>
          <li><InlineMath math="G" /> can mean a pseudorandom generator or a group; the local section disambiguates it.</li>
          <li><InlineMath math="F" /> usually means a pseudorandom function, <InlineMath math="H" /> a hash function or random oracle, and <InlineMath math="g" /> a group generator.</li>
          <li><InlineMath math="x" /> is often a secret exponent or witness. <InlineMath math="h=g^x" /> is a common discrete-log public key.</li>
          <li><InlineMath math="\beta" /> is a hardcore predicate and <InlineMath math="f" /> is often a one-way function or permutation.</li>
        </BulletList>
      </NoteTopicBlock>
    </NoteTopicGroup>
  );
}

function OneTimePadExplorer() {
  const { subtlePanelClass, primaryColor, secondaryColor } = useCryptoTheme();
  const [m1, setM1] = useState(0b10101100);
  const [m2, setM2] = useState(0b01101010);
  const [key, setKey] = useState(0b11010011);
  const c1 = m1 ^ key;
  const c2 = m2 ^ key;
  const xorCiphertexts = c1 ^ c2;
  const xorMessages = m1 ^ m2;
  const bits = (value: number) => value.toString(2).padStart(8, '0');

  return (
    <InteractiveBlock title="Two-Time Pad Cancellation">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          {[
            ['m1', m1, setM1],
            ['m2', m2, setM2],
            ['key', key, setKey],
          ].map(([label, value, setter]) => (
            <label key={label as string} className="mb-4 block text-sm">
              <span className="mb-1 flex justify-between gap-3">
                <span>{label as string}</span>
                <span className="font-mono">{bits(value as number)}</span>
              </span>
              <input type="range" min="0" max="255" value={value as number} onChange={(event) => (setter as (value: number) => void)(Number(event.target.value))} className="w-full" />
            </label>
          ))}
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <NoteTable
            headers={['quantity', 'bits']}
            rows={[
              [<InlineMath math="c_1=m_1\oplus k" />, bits(c1)],
              [<InlineMath math="c_2=m_2\oplus k" />, bits(c2)],
              [<InlineMath math="c_1\oplus c_2" />, bits(xorCiphertexts)],
              [<InlineMath math="m_1\oplus m_2" />, bits(xorMessages)],
            ]}
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-2 rounded" style={{ backgroundColor: primaryColor, opacity: 0.65 }} />
            <div className="h-2 rounded" style={{ backgroundColor: secondaryColor, opacity: 0.65 }} />
          </div>
          <NoteParagraph className="mb-0 mt-4 text-sm">
            Reusing the key makes it cancel. The adversary learns <InlineMath math="m_1\oplus m_2" /> even without learning <InlineMath math="k" />.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function AdvantageConventionExplorer() {
  const { subtlePanelClass } = useCryptoTheme();
  const [p0, setP0] = useState(0.25);
  const [p1, setP1] = useState(0.65);
  const twoExperiment = Math.abs(p1 - p0);
  const guessing = twoExperiment / 2;

  return (
    <InteractiveBlock title="Two Equivalent Advantage Conventions">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-4 block text-sm" htmlFor="adv-p0">
            <span className="mb-1 flex justify-between gap-3"><span><InlineMath math="Pr[W_0]" /></span><span>{p0.toFixed(2)}</span></span>
            <input id="adv-p0" type="range" min="0" max="1" step="0.01" value={p0} onChange={(event) => setP0(Number(event.target.value))} className="w-full" />
          </label>
          <label className="block text-sm" htmlFor="adv-p1">
            <span className="mb-1 flex justify-between gap-3"><span><InlineMath math="Pr[W_1]" /></span><span>{p1.toFixed(2)}</span></span>
            <input id="adv-p1" type="range" min="0" max="1" step="0.01" value={p1} onChange={(event) => setP1(Number(event.target.value))} className="w-full" />
          </label>
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <NoteTable
            headers={['definition', 'value']}
            rows={[
              [<InlineMath math="\left|Pr[W_1]-Pr[W_0]\right|" />, twoExperiment.toFixed(3)],
              [<InlineMath math="\left|Pr[\hat{b}=b]-1/2\right|" />, guessing.toFixed(3)],
            ]}
          />
          <NoteParagraph className="mb-0 text-sm">
            These conventions differ by a factor of two in standard symmetric bit-guessing games. Constants do not affect negligible vs non-negligible security.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function HybridArgumentExplorer() {
  const { subtlePanelClass, primaryColor, secondaryColor, mutedColor, textColor } = useCryptoTheme();
  const [step, setStep] = useState(0);
  const hybrids = [
    'real construction',
    'replace first primitive call',
    'replace second primitive call',
    'ideal experiment',
  ];

  return (
    <InteractiveBlock title="Hybrid Chain">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 flex justify-between gap-3 text-sm" htmlFor="hybrid-step">
            <span>Displayed game</span>
            <span><InlineMath math={`H_${step}`} /></span>
          </label>
          <input id="hybrid-step" type="range" min="0" max={hybrids.length - 1} value={step} onChange={(event) => setStep(Number(event.target.value))} className="w-full" />
          <NoteParagraph className="mb-0 mt-4 text-sm">
            If endpoints are distinguishable, some adjacent pair must be distinguishable.
          </NoteParagraph>
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <svg viewBox="0 0 520 160" className="h-44 w-full">
            {hybrids.map((label, index) => {
              const x = 55 + index * 135;
              const active = index === step;
              return (
                <g key={label}>
                  {index < hybrids.length - 1 && <line x1={x + 35} y1="70" x2={x + 100} y2="70" stroke={mutedColor} strokeWidth="3" />}
                  <circle cx={x} cy="70" r="32" fill={active ? primaryColor : 'transparent'} stroke={active ? primaryColor : secondaryColor} strokeWidth="3" />
                  <text x={x} y="75" textAnchor="middle" fontSize="13" fontWeight="700" fill={active ? '#ffffff' : textColor}>{`H${index}`}</text>
                  <text x={x} y="126" textAnchor="middle" fontSize="11" fill={textColor}>{label}</text>
                </g>
              );
            })}
          </svg>
          <MathBlock math="Adv(H_0,H_n)\le \sum_{i=0}^{n-1} Adv(H_i,H_{i+1})" />
        </div>
      </div>
    </InteractiveBlock>
  );
}

type ModeKey = 'ecb' | 'ctr' | 'cbc';

function EncryptionModeExplorer() {
  const { subtlePanelClass, primaryColor, secondaryColor, accentColor, mutedColor, textColor } = useCryptoTheme();
  const [mode, setMode] = useState<ModeKey>('ctr');
  const blocks = ['A', 'B', 'A', 'C'];
  const ciphertexts: Record<ModeKey, string[]> = {
    ecb: ['E(A)', 'E(B)', 'E(A)', 'E(C)'],
    ctr: ['A^P1', 'B^P2', 'A^P3', 'C^P4'],
    cbc: ['E(A^IV)', 'E(B^c1)', 'E(A^c2)', 'E(C^c3)'],
  };
  const descriptions: Record<ModeKey, string> = {
    ecb: 'Equal plaintext blocks produce equal ciphertext blocks, so patterns leak.',
    ctr: 'A fresh counter input creates a fresh pad for each block.',
    cbc: 'Each block is mixed with the previous ciphertext block and a fresh IV.',
  };

  return (
    <InteractiveBlock title="Encryption Modes and Pattern Leakage">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(240px,320px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-2 block text-sm font-bold" htmlFor="mode-select">Mode</label>
          <select id="mode-select" value={mode} onChange={(event) => setMode(event.target.value as ModeKey)} className="w-full rounded border border-current/20 bg-transparent p-2 text-sm">
            <option value="ecb">ECB</option>
            <option value="ctr">CTR</option>
            <option value="cbc">CBC</option>
          </select>
          <NoteParagraph className="mb-0 mt-4 text-sm">{descriptions[mode]}</NoteParagraph>
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <svg viewBox="0 0 560 210" className="h-60 w-full">
            {blocks.map((block, index) => {
              const x = 40 + index * 130;
              const repeated = mode === 'ecb' && block === 'A';
              return (
                <g key={`${block}-${index}`}>
                  <rect x={x} y="28" width="92" height="42" rx="7" fill={repeated ? secondaryColor : primaryColor} fillOpacity="0.14" stroke={repeated ? secondaryColor : primaryColor} />
                  <text x={x + 46} y="54" textAnchor="middle" fontSize="13" fill={textColor}>{`m${index + 1}=${block}`}</text>
                  <line x1={x + 46} y1="75" x2={x + 46} y2="108" stroke={mutedColor} strokeWidth="2" />
                  <rect x={x} y="114" width="92" height="48" rx="7" fill={mode === 'ctr' ? accentColor : repeated ? secondaryColor : primaryColor} fillOpacity="0.14" stroke={mode === 'ctr' ? accentColor : repeated ? secondaryColor : primaryColor} />
                  <text x={x + 46} y="134" textAnchor="middle" fontSize="11" fill={textColor}>c{index + 1}</text>
                  <text x={x + 46} y="151" textAnchor="middle" fontSize="10" fill={textColor}>{ciphertexts[mode][index]}</text>
                </g>
              );
            })}
          </svg>
          <NoteParagraph className="mb-0 text-sm">
            The repeated <InlineMath math="A" /> blocks are visible only in ECB.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function BadEventExplorer() {
  const { subtlePanelClass, primaryColor, secondaryColor } = useCryptoTheme();
  const [queries, setQueries] = useState(16);
  const [bits, setBits] = useState(8);
  const space = 2 ** bits;
  const birthdayBound = Math.min(1, (queries * (queries - 1)) / (2 * space));

  return (
    <InteractiveBlock title="Bad Event Collision Bound">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <label className="mb-4 block text-sm" htmlFor="bad-queries">
            <span className="mb-1 flex justify-between gap-3"><span>queries <InlineMath math="q" /></span><span>{queries}</span></span>
            <input id="bad-queries" type="range" min="2" max="80" value={queries} onChange={(event) => setQueries(Number(event.target.value))} className="w-full" />
          </label>
          <label className="block text-sm" htmlFor="bad-bits">
            <span className="mb-1 flex justify-between gap-3"><span>output bits <InlineMath math="n" /></span><span>{bits}</span></span>
            <input id="bad-bits" type="range" min="4" max="16" value={bits} onChange={(event) => setBits(Number(event.target.value))} className="w-full" />
          </label>
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <MathBlock math="Pr[Bad]\lesssim \frac{q(q-1)}{2\cdot 2^n}" />
          <NoteTable
            headers={['quantity', 'value']}
            rows={[
              [<InlineMath math="2^n" />, space.toLocaleString()],
              [<InlineMath math="q(q-1)/(2\cdot 2^n)" />, birthdayBound.toFixed(4)],
            ]}
          />
          <div className="h-3 rounded bg-current/10">
            <div className="h-3 rounded" style={{ width: `${birthdayBound * 100}%`, backgroundColor: birthdayBound > 0.25 ? secondaryColor : primaryColor }} />
          </div>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function MerkleTreeDiagram() {
  const { subtlePanelClass, primaryColor, secondaryColor, mutedColor, textColor } = useCryptoTheme();
  return (
    <div className={`mb-8 rounded-lg border p-4 ${subtlePanelClass}`}>
      <svg viewBox="0 0 560 260" className="h-72 w-full" role="img" aria-label="Merkle tree membership proof">
        {[
          [280, 38, 'root'],
          [170, 100, 'h01'],
          [390, 100, 'h23'],
          [110, 174, 'h0'],
          [230, 174, 'h1'],
          [330, 174, 'h2'],
          [450, 174, 'h3'],
        ].map(([x, y, label]) => (
          <g key={label as string}>
            <circle cx={x as number} cy={y as number} r="26" fill={(label === 'h1' || label === 'h23') ? secondaryColor : primaryColor} fillOpacity="0.14" stroke={(label === 'h1' || label === 'h23') ? secondaryColor : primaryColor} strokeWidth="3" />
            <text x={x as number} y={(y as number) + 4} textAnchor="middle" fontSize="12" fill={textColor}>{label as string}</text>
          </g>
        ))}
        {[
          [280, 64, 170, 80],
          [280, 64, 390, 80],
          [170, 126, 110, 148],
          [170, 126, 230, 148],
          [390, 126, 330, 148],
          [390, 126, 450, 148],
        ].map(([x1, y1, x2, y2], index) => (
          <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke={mutedColor} strokeWidth="2" />
        ))}
        <text x="110" y="228" textAnchor="middle" fontSize="12" fill={textColor}>leaf 0</text>
        <text x="230" y="228" textAnchor="middle" fontSize="12" fill={textColor}>target leaf</text>
        <text x="330" y="228" textAnchor="middle" fontSize="12" fill={textColor}>leaf 2</text>
        <text x="450" y="228" textAnchor="middle" fontSize="12" fill={textColor}>leaf 3</text>
      </svg>
      <NoteParagraph className="mb-0 text-sm">
        To prove membership for leaf 1, reveal the target leaf, sibling <InlineMath math="h_0" />, sibling subtree hash <InlineMath math="h_{23}" />, and recompute the root.
      </NoteParagraph>
    </div>
  );
}

function DiffieHellmanExplorer() {
  const { subtlePanelClass } = useCryptoTheme();
  const [a, setA] = useState(5);
  const [b, setB] = useState(9);
  const p = 23;
  const g = 5;
  const modPow = (base: number, exponent: number, modulus: number) => {
    let result = 1;
    for (let i = 0; i < exponent; i += 1) result = (result * base) % modulus;
    return result;
  };
  const A = modPow(g, a, p);
  const B = modPow(g, b, p);
  const aliceSecret = modPow(B, a, p);
  const bobSecret = modPow(A, b, p);

  return (
    <InteractiveBlock title="Diffie-Hellman Shared Secret">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(260px,340px)_minmax(0,1fr)]">
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <NoteParagraph className="text-sm">Toy parameters: <InlineMath math="p=23" />, <InlineMath math="g=5" />.</NoteParagraph>
          <label className="mb-4 block text-sm" htmlFor="dh-a">
            <span className="mb-1 flex justify-between gap-3"><span>Alice secret <InlineMath math="a" /></span><span>{a}</span></span>
            <input id="dh-a" type="range" min="1" max="21" value={a} onChange={(event) => setA(Number(event.target.value))} className="w-full" />
          </label>
          <label className="block text-sm" htmlFor="dh-b">
            <span className="mb-1 flex justify-between gap-3"><span>Bob secret <InlineMath math="b" /></span><span>{b}</span></span>
            <input id="dh-b" type="range" min="1" max="21" value={b} onChange={(event) => setB(Number(event.target.value))} className="w-full" />
          </label>
        </div>
        <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
          <NoteTable
            headers={['value', 'result']}
            rows={[
              [<InlineMath math="A=g^a\bmod p" />, A],
              [<InlineMath math="B=g^b\bmod p" />, B],
              [<InlineMath math="B^a\bmod p" />, aliceSecret],
              [<InlineMath math="A^b\bmod p" />, bobSecret],
            ]}
          />
          <NoteParagraph className="mb-0 text-sm">
            The toy group is tiny and insecure, but it shows the algebra: both sides compute <InlineMath math="g^{ab}" /> without sending <InlineMath math="a" /> or <InlineMath math="b" />.
          </NoteParagraph>
        </div>
      </div>
    </InteractiveBlock>
  );
}

function SchnorrTrace() {
  const { subtlePanelClass } = useCryptoTheme();
  const [challenge, setChallenge] = useState(3);
  const x = 4;
  const r = 7;
  const z = r + challenge * x;

  return (
    <InteractiveBlock title="Schnorr Transcript Algebra">
      <div className={`rounded-lg border p-4 ${subtlePanelClass}`}>
        <label className="mb-4 flex justify-between gap-3 text-sm" htmlFor="schnorr-c">
          <span>challenge <InlineMath math="c" /></span>
          <span>{challenge}</span>
        </label>
        <input id="schnorr-c" type="range" min="1" max="9" value={challenge} onChange={(event) => setChallenge(Number(event.target.value))} className="mb-6 w-full" />
        <NoteTable
          headers={['step', 'value']}
          rows={[
            ['secret witness', <InlineMath math="x=4" />],
            ['random commitment exponent', <InlineMath math="r=7" />],
            ['commitment', <InlineMath math="a=g^r" />],
            ['response', <InlineMath math={`z=r+cx=${z}`} />],
            ['verifier check', <InlineMath math="g^z=a h^c" />],
          ]}
        />
        <NoteParagraph className="mb-0 text-sm">
          The verifier learns a valid relation, not the witness <InlineMath math="x" />. Soundness comes from extracting <InlineMath math="x" /> if the prover answers two challenges for the same commitment.
        </NoteParagraph>
      </div>
    </InteractiveBlock>
  );
}

export default function CryptographyNote() {
  return (
    <NotesLayout>
      <NoteHeader
        title="Cryptography"
        subtitle="A proof-oriented guide to modern cryptography: security games, reductions, pseudorandomness, encryption, authentication, public-key systems, signatures, zero knowledge, and secure computation."
      />

      <CryptographyNotationGuide />

      <NoteSectionTitle id="cryptography-overview-and-proof-style">1. Cryptography Overview and Proof Style</NoteSectionTitle>
      <NoteParagraph>
        Modern cryptography is not just designing algorithms that look random or seem hard to break. It is the process of writing precise security definitions, building constructions, and proving that any efficient attacker against the construction would also break a stated assumption.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Proof Pattern">
          <BulletList className="mb-0">
            <li>Define a security game and what it means for the adversary to win.</li>
            <li>Define the adversary's advantage.</li>
            <li>State the construction.</li>
            <li>Prove security by reduction, hybrid argument, or bad-event argument.</li>
            <li>Interpret exactly which assumption the theorem depends on.</li>
          </BulletList>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="one-time-encryption-and-the-one-time-pad">2. One-Time Encryption and the One-Time Pad</NoteSectionTitle>
      <NoteParagraph>
        A private-key encryption scheme has <InlineMath math="Gen" />, <InlineMath math="Enc" />, and <InlineMath math="Dec" />. Correctness requires <InlineMath math="Dec(k,Enc(k,m))=m" /> for valid keys and messages.
      </NoteParagraph>
      <MathBlock math="c=m\oplus k,\qquad m=c\oplus k" />
      <NoteParagraph>
        The one-time pad chooses a uniformly random key as long as the message and XORs it with the message. For every fixed message and ciphertext, exactly one key explains that ciphertext, so the ciphertext reveals no information when the key is uniform and used once.
      </NoteParagraph>
      <OneTimePadExplorer />

      <NoteSectionTitle id="perfect-secrecy-and-shannons-impossibility">3. Perfect Secrecy and Shannon's Impossibility</NoteSectionTitle>
      <NoteParagraph>
        Perfect secrecy means ciphertexts reveal no information even to computationally unbounded adversaries.
      </NoteParagraph>
      <MathBlock math="Pr[C=c\mid M=m_0]=Pr[C=c\mid M=m_1]" />
      <NoteParagraph>
        Shannon's theorem says perfect secrecy requires the key space to be at least as large as the message space. For <InlineMath math="n" />-bit messages, a perfectly secret one-time scheme needs about <InlineMath math="n" /> key bits.
      </NoteParagraph>

      <NoteSectionTitle id="computational-security">4. Computational Security</NoteSectionTitle>
      <NoteParagraph>
        Computational security relaxes perfect secrecy. Instead of protecting against all adversaries with zero advantage, it protects against efficient adversaries with only negligible advantage.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Security Statement Shape">
          <MathBlock math="\text{for every PPT adversary }A,\ Adv[A](\lambda)\text{ is negligible}" />
          <NoteParagraph className="mb-0">
            PPT means probabilistic polynomial time. The adversary may use randomness, but its running time must be polynomial in the security parameter.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="negligible-functions-and-polynomial-time-adversaries">5. Negligible Functions and Polynomial-Time Adversaries</NoteSectionTitle>
      <NoteParagraph>
        A function <InlineMath math="\epsilon(\lambda)" /> is negligible if it eventually becomes smaller than every inverse polynomial.
      </NoteParagraph>
      <MathBlock math="\forall p,\ \exists N,\ \lambda>N\Rightarrow \epsilon(\lambda)<\frac{1}{p(\lambda)}" />
      <NoteTable
        headers={['negligible', 'not negligible']}
        rows={[
          [<InlineMath math="2^{-\lambda}" />, <InlineMath math="1/\lambda" />],
          [<InlineMath math="2^{-\sqrt{\lambda}}" />, <InlineMath math="1/\lambda^2" />],
          ['failure probability that vanishes faster than inverse polynomials', 'constant advantage such as 0.01'],
        ]}
      />

      <NoteSectionTitle id="attack-games-and-advantage">6. Attack Games and Advantage</NoteSectionTitle>
      <NoteParagraph>
        A security definition is an experiment. The challenger samples hidden information, the adversary interacts with what the definition allows, and the advantage measures how much better the adversary does than a baseline.
      </NoteParagraph>
      <NoteTable
        headers={['form', 'advantage']}
        rows={[
          ['two experiments', <InlineMath math="\left|Pr[W_0]-Pr[W_1]\right|" />],
          ['one bit-guessing experiment', <InlineMath math="\left|Pr[\hat{b}=b]-1/2\right|" />],
        ]}
      />
      <AdvantageConventionExplorer />

      <NoteSectionTitle id="semantic-security">7. Semantic Security</NoteSectionTitle>
      <NoteParagraph>
        Semantic security says ciphertexts reveal no efficiently computable information about plaintexts. The usual working form is indistinguishability: an adversary chooses two equal-length messages, receives an encryption of one of them, and should not know which was encrypted.
      </NoteParagraph>
      <MathBlock math="Adv_{SS}[A,E]=\left|Pr[A(Enc(k,m_1))=1]-Pr[A(Enc(k,m_0))=1]\right|" />

      <NoteSectionTitle id="indistinguishability-definitions">8. Indistinguishability Definitions</NoteSectionTitle>
      <NoteParagraph>
        Two-experiment and one-experiment indistinguishability definitions express the same idea. The two-experiment version compares the adversary's output distribution under two worlds. The one-experiment version samples a hidden bit <InlineMath math="b" /> and asks the adversary to guess it.
      </NoteParagraph>
      <AlgorithmBlock
        title="One-Bit Indistinguishability Experiment"
        steps={[
          <span>Sample <InlineMath math="b\leftarrow\{0,1\}" />.</span>,
          <span>The adversary chooses equal-length messages <InlineMath math="m_0,m_1" />.</span>,
          <span>The challenger returns <InlineMath math="c=\operatorname{Enc}(k,m_b)" />.</span>,
          <span>The adversary outputs a guess <InlineMath math="\hat{b}" />.</span>,
          <span>The adversary wins when <InlineMath math="\hat{b}=b" />.</span>,
        ]}
      />

      <NoteSectionTitle id="pseudorandom-generators">9. Pseudorandom Generators</NoteSectionTitle>
      <NoteParagraph>
        A pseudorandom generator expands a short random seed into a longer string that efficient adversaries cannot distinguish from uniform randomness.
      </NoteParagraph>
      <MathBlock math="G:S\to R,\qquad |R|>|S|" />
      <NoteParagraph>
        Since the image of <InlineMath math="G" /> is smaller than <InlineMath math="R" />, an unbounded adversary could distinguish PRG outputs by checking image membership. Security therefore depends on computational limits.
      </NoteParagraph>

      <NoteSectionTitle id="stream-ciphers">10. Stream Ciphers</NoteSectionTitle>
      <NoteParagraph>
        A stream cipher uses a PRG to generate a long keystream from a short key and XORs that keystream with the message.
      </NoteParagraph>
      <MathBlock math="c=m\oplus G(k)" />
      <NoteParagraph>
        The proof intuition is simple: if <InlineMath math="G(k)" /> looks uniform, then the ciphertext looks like one-time-pad encryption. Reusing the same keystream recreates the two-time pad failure.
      </NoteParagraph>

      <NoteSectionTitle id="prg-composition">11. PRG Composition</NoteSectionTitle>
      <NoteParagraph>
        PRGs can be composed in parallel or sequentially. Parallel composition concatenates independent outputs. Sequential composition repeatedly feeds the next seed through a one-bit-stretch generator.
      </NoteParagraph>
      <MathBlock math="G'(s_1,s_2)=G(s_1)\Vert G(s_2)" />
      <HybridArgumentExplorer />

      <NoteSectionTitle id="one-way-functions-and-one-way-permutations">12. One-Way Functions and One-Way Permutations</NoteSectionTitle>
      <NoteParagraph>
        A one-way function is easy to compute but hard to invert on a random output. A one-way permutation is also bijective, so every output has exactly one preimage.
      </NoteParagraph>
      <AlgorithmBlock
        title="One-Wayness Experiment"
        steps={[
          <span>The challenger samples <InlineMath math="x" />.</span>,
          <span>The challenger gives <InlineMath math="y=f(x)" /> to the adversary.</span>,
          <span>The adversary outputs <InlineMath math="\hat{x}" />.</span>,
          <span>The adversary wins when <InlineMath math="f(\hat{x})=y" />.</span>,
        ]}
      />

      <NoteSectionTitle id="hardcore-predicates">13. Hardcore Predicates</NoteSectionTitle>
      <NoteParagraph>
        A predicate <InlineMath math="\beta(x)" /> is hardcore for <InlineMath math="f" /> if it is easy to compute from <InlineMath math="x" /> but hard to predict from <InlineMath math="f(x)" />.
      </NoteParagraph>
      <MathBlock math="PredAdv[P,(f,\beta)]=\left|Pr[P(f(x))=\beta(x)]-\frac12\right|" />

      <NoteSectionTitle id="blum-micali-prg">14. Blum-Micali PRG</NoteSectionTitle>
      <NoteParagraph>
        If <InlineMath math="f" /> is a one-way permutation and <InlineMath math="\beta" /> is a hardcore predicate, then <InlineMath math="G(x)=(f(x),\beta(x))" /> stretches by one bit. The output of the permutation remains uniform, while the extra bit is unpredictable given the permutation output.
      </NoteParagraph>
      <MathBlock math="G(x)=(f(x),\beta(x))" />

      <NoteSectionTitle id="discrete-logarithm-assumption">15. Discrete Logarithm Assumption</NoteSectionTitle>
      <NoteParagraph>
        In a cyclic group with generator <InlineMath math="g" />, the discrete logarithm problem asks for <InlineMath math="x" /> given <InlineMath math="g^x" />. The discrete logarithm assumption says this is hard in suitable groups.
      </NoteParagraph>
      <MathBlock math="\text{given }y=g^x,\ \text{find }x" />

      <NoteSectionTitle id="necessity-of-assumptions">16. Necessity of Assumptions</NoteSectionTitle>
      <NoteParagraph>
        Computational cryptography needs assumptions because many primitives are impossible against unbounded adversaries. A PRG maps a small seed space into a larger output space, so its outputs are not truly uniform over the full range.
      </NoteParagraph>
      <NoteParagraph>
        A theorem should say exactly what breaks if the assumption is false: the construction's security reduces to the assumed hardness of inversion, distinguishing, collision finding, or another primitive.
      </NoteParagraph>

      <NoteSectionTitle id="pseudorandom-functions">17. Pseudorandom Functions</NoteSectionTitle>
      <NoteParagraph>
        A pseudorandom function is a keyed function that looks like a truly random function to efficient oracle-query adversaries.
      </NoteParagraph>
      <MathBlock math="F:K\times X\to Y" />
      <NoteParagraph>
        In the real world the adversary queries <InlineMath math="F(k,\cdot)" />. In the ideal world it queries a random function <InlineMath math="R(\cdot)" />.
      </NoteParagraph>

      <NoteSectionTitle id="prf-tree-construction">18. PRF Tree Construction</NoteSectionTitle>
      <NoteParagraph>
        A length-doubling PRG can build a PRF by viewing input bits as a path through a binary tree. If <InlineMath math="G(s)=G_0(s)\Vert G_1(s)" />, then each input bit chooses the left or right child seed.
      </NoteParagraph>
      <AlgorithmBlock
        title="GGM Tree Evaluation"
        steps={[
          <span>Start with seed <InlineMath math="s=k" />.</span>,
          <span>For each input bit <InlineMath math="x_i" />, update <InlineMath math="s\leftarrow G_{x_i}(s)" />.</span>,
          <span>Return the final seed <InlineMath math="s" />.</span>,
        ]}
      />

      <NoteSectionTitle id="prgs-from-prfs">19. PRGs from PRFs</NoteSectionTitle>
      <NoteParagraph>
        A PRF can build a PRG by evaluating the keyed function on fixed, distinct inputs and concatenating the outputs.
      </NoteParagraph>
      <MathBlock math="G(k)=F(k,1)\Vert F(k,2)\Vert\cdots\Vert F(k,q)" />

      <NoteSectionTitle id="block-ciphers">20. Block Ciphers</NoteSectionTitle>
      <NoteParagraph>
        A block cipher is a keyed family of permutations on fixed-size blocks. For each key <InlineMath math="k" />, <InlineMath math="E(k,\cdot)" /> is invertible.
      </NoteParagraph>
      <NoteTable
        headers={['object', 'ideal comparison']}
        rows={[
          ['PRF', 'random function; outputs may collide'],
          ['block cipher / PRP', 'random permutation; no collisions for a fixed key'],
        ]}
      />

      <NoteSectionTitle id="des-aes-prfs-and-prps">21. DES, AES, PRFs, and PRPs</NoteSectionTitle>
      <NoteParagraph>
        DES is historically important but has too small a key size for modern use. AES is the standard modern block cipher. The theoretical role of block ciphers is to approximate pseudorandom permutations used inside encryption modes, MACs, and hash constructions.
      </NoteParagraph>

      <NoteSectionTitle id="cpa-security">22. CPA Security</NoteSectionTitle>
      <NoteParagraph>
        Chosen-plaintext security lets the adversary request encryptions of messages of its choice before and after the challenge. A secure scheme still hides which challenge message was encrypted.
      </NoteParagraph>
      <NoteParagraph>
        Deterministic encryption fails CPA security because the adversary can encrypt both challenge messages and compare with the challenge ciphertext.
      </NoteParagraph>

      <NoteSectionTitle id="ctr-mode">23. CTR Mode</NoteSectionTitle>
      <NoteParagraph>
        Counter mode turns a PRF or block cipher into a stream of pads by evaluating it on a random starting value and successive counters.
      </NoteParagraph>
      <MathBlock math="c_i=m_i\oplus F(k,r+i)" />
      <NoteParagraph>
        Security depends on never reusing counter inputs under the same key.
      </NoteParagraph>
      <EncryptionModeExplorer />

      <NoteSectionTitle id="ecb-insecurity">24. ECB Insecurity</NoteSectionTitle>
      <NoteParagraph>
        ECB encrypts each block independently: <InlineMath math="c_i=E(k,m_i)" />. Equal plaintext blocks produce equal ciphertext blocks, so repeated structure leaks directly.
      </NoteParagraph>
      <NoteParagraph>
        ECB is useful as a warning example: a secure block cipher is not automatically a secure multi-block encryption scheme.
      </NoteParagraph>

      <NoteSectionTitle id="cbc-mode">25. CBC Mode</NoteSectionTitle>
      <NoteParagraph>
        CBC mode uses a random IV and chains ciphertext blocks so each plaintext block is mixed with the previous ciphertext block.
      </NoteParagraph>
      <MathBlock math="c_0=IV,\qquad c_i=E(k,m_i\oplus c_{i-1})" />
      <MathBlock math="m_i=D(k,c_i)\oplus c_{i-1}" />
      <NoteParagraph>
        CPA security requires a fresh unpredictable IV.
      </NoteParagraph>

      <NoteSectionTitle id="difference-lemma-bad-event-lemma">26. Difference Lemma / Bad Event Lemma</NoteSectionTitle>
      <NoteParagraph>
        If two games behave identically unless a bad event occurs, then any distinguishing advantage is bounded by the probability of that event.
      </NoteParagraph>
      <MathBlock math="\left|Pr[W_0]-Pr[W_1]\right|\le Pr[Bad]" />
      <BadEventExplorer />

      <NoteSectionTitle id="message-authentication-codes">27. Message Authentication Codes</NoteSectionTitle>
      <NoteParagraph>
        Encryption protects confidentiality. A message authentication code protects integrity and authenticity for parties sharing a secret key.
      </NoteParagraph>
      <MathBlock math="Verify(k,m,Tag(k,m))=accept" />

      <NoteSectionTitle id="macs-from-prfs">28. MACs from PRFs</NoteSectionTitle>
      <NoteParagraph>
        If <InlineMath math="F" /> is a secure PRF, then <InlineMath math="Tag(k,m)=F(k,m)" /> is a MAC for fixed-length messages. A tag for a new message looks unpredictable in the random-function world.
      </NoteParagraph>
      <NoteParagraph>
        The security game is existential unforgeability under chosen-message attack: after seeing tags on chosen messages, the adversary must not output a valid tag on a new message.
      </NoteParagraph>

      <NoteSectionTitle id="cbc-mac-cascade-and-extension-attacks">29. CBC-MAC, Cascade, and Extension Attacks</NoteSectionTitle>
      <NoteParagraph>
        Iterated MAC constructions process blocks through a chaining state. They can be secure for fixed-length or prefix-free domains, but naive variable-length versions may allow extension attacks.
      </NoteParagraph>
      <NoteParagraph>
        In an extension attack, a tag for one message becomes useful as an internal state for authenticating a longer related message.
      </NoteParagraph>

      <NoteSectionTitle id="full-variable-length-mac-security">30. Full Variable-Length MAC Security</NoteSectionTitle>
      <NoteParagraph>
        Full variable-length MAC security requires design choices that prevent prefix and extension ambiguity: prefix-free encodings, final-value re-keying, CMAC-style corrections, ECBC, NMAC, or related constructions.
      </NoteParagraph>

      <NoteSectionTitle id="chosen-ciphertext-security">31. Chosen-Ciphertext Security</NoteSectionTitle>
      <NoteParagraph>
        CCA security allows the adversary to submit ciphertexts to a decryption oracle, subject to not asking for the challenge ciphertext itself. It captures attacks where ciphertext malleability or decryption errors leak information.
      </NoteParagraph>

      <NoteSectionTitle id="authenticated-encryption">32. Authenticated Encryption</NoteSectionTitle>
      <NoteParagraph>
        Authenticated encryption combines confidentiality with ciphertext integrity. Decryption should return either the original message or reject. Tampered ciphertexts should not produce attacker-controlled plaintexts.
      </NoteParagraph>
      <MathBlock math="Dec(k,c)\in \{m,reject\}" />

      <NoteSectionTitle id="encrypt-then-mac">33. Encrypt-then-MAC</NoteSectionTitle>
      <NoteParagraph>
        Encrypt-then-MAC first encrypts the message, then authenticates the ciphertext. Decryption verifies the tag before decrypting.
      </NoteParagraph>
      <AlgorithmBlock
        title="Encrypt-then-MAC"
        steps={[
          <span>Encrypt with the encryption key: <InlineMath math="c=\operatorname{Enc}(k_E,m)" />.</span>,
          <span>Authenticate the ciphertext: <InlineMath math="t=\operatorname{Tag}(k_M,c)" />.</span>,
          <span>Send <InlineMath math="(c,t)" />.</span>,
          <span>On receipt, verify <InlineMath math="t" /> before decrypting <InlineMath math="c" />.</span>,
          'Reject immediately if verification fails.',
        ]}
      />
      <NoteParagraph>
        This is the preferred generic composition: the MAC blocks malformed ciphertexts before they reach the decryption algorithm.
      </NoteParagraph>

      <NoteSectionTitle id="aead">34. AEAD</NoteSectionTitle>
      <NoteParagraph>
        Authenticated Encryption with Associated Data encrypts a secret message while authenticating additional public data such as headers.
      </NoteParagraph>
      <MathBlock math="Enc(k,m,d,N)\to c,\qquad Dec(k,c,d,N)\to m\text{ or }reject" />
      <NoteParagraph>
        The associated data <InlineMath math="d" /> is not hidden, but any tampering with it should cause rejection.
      </NoteParagraph>

      <NoteSectionTitle id="collision-resistant-hashing">35. Collision-Resistant Hashing</NoteSectionTitle>
      <NoteParagraph>
        A collision-resistant hash function compresses inputs while making it computationally hard to find two distinct inputs with the same hash.
      </NoteParagraph>
      <MathBlock math="x\ne x'\ \text{ and }\ H(x)=H(x')" />
      <NoteParagraph>
        Collisions must exist when the domain is larger than the range. Security says they are hard to find.
      </NoteParagraph>

      <NoteSectionTitle id="dl-based-hashing">36. DL-Based Hashing</NoteSectionTitle>
      <NoteParagraph>
        A discrete-log-based hash can use a form such as <InlineMath math="H(x,y)=g^x h^y" /> when the discrete-log relation between <InlineMath math="g" /> and <InlineMath math="h" /> is unknown.
      </NoteParagraph>
      <NoteParagraph>
        A collision <InlineMath math="g^x h^y=g^{x'}h^{y'}" /> can reveal the relation between <InlineMath math="g" /> and <InlineMath math="h" />, so collision finding reduces to solving a discrete-log problem.
      </NoteParagraph>

      <NoteSectionTitle id="merkle-trees">37. Merkle Trees</NoteSectionTitle>
      <NoteParagraph>
        A Merkle tree commits to many data blocks with one short root. Leaves hash data blocks, internal nodes hash child hashes, and a membership proof contains sibling hashes along the path to the root.
      </NoteParagraph>
      <MathBlock math="\text{proof length}=O(\log n)" />
      <MerkleTreeDiagram />

      <NoteSectionTitle id="diffie-hellman">38. Diffie-Hellman</NoteSectionTitle>
      <NoteParagraph>
        Diffie-Hellman lets two parties derive a shared secret over an insecure channel. Alice sends <InlineMath math="g^a" />, Bob sends <InlineMath math="g^b" />, and both compute <InlineMath math="g^{ab}" />.
      </NoteParagraph>
      <DiffieHellmanExplorer />

      <NoteSectionTitle id="cdh-and-ddh">39. CDH and DDH</NoteSectionTitle>
      <NoteParagraph>
        Computational Diffie-Hellman asks whether one can compute <InlineMath math="g^{ab}" /> from <InlineMath math="g,g^a,g^b" />. Decisional Diffie-Hellman asks whether one can distinguish <InlineMath math="g^{ab}" /> from a random group element.
      </NoteParagraph>
      <NoteTable
        headers={['assumption', 'challenge']}
        rows={[
          ['CDH', <InlineMath math="\text{given }g,g^a,g^b,\text{ compute }g^{ab}" />],
          ['DDH', <InlineMath math="\text{given }g,g^a,g^b,T,\text{ decide whether }T=g^{ab}" />],
        ]}
      />

      <NoteSectionTitle id="elgamal-encryption">40. ElGamal Encryption</NoteSectionTitle>
      <NoteParagraph>
        ElGamal encryption uses a Diffie-Hellman shared secret to mask a message. With secret key <InlineMath math="x" /> and public key <InlineMath math="h=g^x" />, encryption samples <InlineMath math="r" />.
      </NoteParagraph>
      <MathBlock math="u=g^r,\qquad w=h^r,\qquad c=(u,w\cdot m)" />
      <MathBlock math="w=u^x=g^{rx},\qquad m=(w\cdot m)/w" />

      <NoteSectionTitle id="public-key-semantic-security">41. Public-Key Semantic Security</NoteSectionTitle>
      <NoteParagraph>
        Public-key encryption uses <InlineMath math="Gen\to(pk,sk)" />, <InlineMath math="Enc(pk,m)\to c" />, and <InlineMath math="Dec(sk,c)\to m" />. The adversary receives <InlineMath math="pk" /> and can encrypt messages on its own.
      </NoteParagraph>
      <NoteParagraph>
        Therefore public-key encryption must be randomized. If it were deterministic, the adversary could encrypt both challenge messages and compare.
      </NoteParagraph>

      <NoteSectionTitle id="elgamal-in-the-random-oracle-model">42. ElGamal in the Random Oracle Model</NoteSectionTitle>
      <NoteParagraph>
        Random oracles model hash functions as ideal random functions. ElGamal variants hash the Diffie-Hellman shared secret to derive key material.
      </NoteParagraph>
      <MathBlock math="K=H(g^{xr})" />
      <NoteParagraph>
        The random oracle turns the hidden shared secret into pseudorandom-looking key material under a Diffie-Hellman assumption.
      </NoteParagraph>

      <NoteSectionTitle id="digital-signatures">43. Digital Signatures</NoteSectionTitle>
      <NoteParagraph>
        Digital signatures provide public verifiability. Anyone can verify using <InlineMath math="pk" />, but only the holder of <InlineMath math="sk" /> should be able to sign new messages.
      </NoteParagraph>
      <MathBlock math="Verify(pk,m,Sign(sk,m))=accept" />

      <NoteSectionTitle id="schnorr-identification">44. Schnorr Identification</NoteSectionTitle>
      <NoteParagraph>
        Schnorr identification is an interactive proof of knowledge of a discrete logarithm. The prover knows <InlineMath math="x" /> such that <InlineMath math="h=g^x" />.
      </NoteParagraph>
      <MathBlock math="a=g^r,\qquad z=r+cx,\qquad g^z=a h^c" />
      <SchnorrTrace />

      <NoteSectionTitle id="completeness-knowledge-soundness-and-zero-knowledge">45. Completeness, Knowledge Soundness, and Zero Knowledge</NoteSectionTitle>
      <NoteParagraph>
        Completeness means honest provers convince honest verifiers. Knowledge soundness means a successful prover must know a witness. Zero knowledge means the verifier learns nothing beyond the truth of the statement.
      </NoteParagraph>
      <NoteParagraph>
        In Schnorr, two accepting responses to different challenges for the same commitment allow extraction:
      </NoteParagraph>
      <MathBlock math="z-z'=(c-c')x,\qquad x=\frac{z-z'}{c-c'}" />

      <NoteSectionTitle id="fiat-shamir-and-schnorr-signatures">46. Fiat-Shamir and Schnorr Signatures</NoteSectionTitle>
      <NoteParagraph>
        Fiat-Shamir replaces the verifier's random challenge with a hash of the commitment and message. For Schnorr, the challenge becomes <InlineMath math="c=H(a,m)" />, producing a noninteractive signature.
      </NoteParagraph>
      <MathBlock math="\sigma=(a,z),\qquad c=H(a,m),\qquad g^z=a h^c" />
      <NoteParagraph>
        Never reuse the Schnorr nonce <InlineMath math="r" />. Reusing it across messages can reveal the secret key.
      </NoteParagraph>

      <NoteSectionTitle id="merkle-signatures-and-hash-based-authentication">47. Merkle Signatures and Hash-Based Authentication</NoteSectionTitle>
      <NoteParagraph>
        Merkle signatures use many one-time signature verification keys as leaves of a Merkle tree. The public key is the root. To sign, use one one-time key and include an authentication path proving that key belongs to the tree.
      </NoteParagraph>

      <NoteSectionTitle id="certificates-signature-chains-and-pki">48. Certificates, Signature Chains, and PKI</NoteSectionTitle>
      <NoteParagraph>
        A certificate binds an identity to a public key using an issuer signature. Public Key Infrastructure manages certificate authorities, chains, trust anchors, validity periods, and revocation.
      </NoteParagraph>
      <NoteParagraph>
        The core question PKI answers is: how do I know this public key belongs to the entity I think it belongs to?
      </NoteParagraph>

      <NoteSectionTitle id="blockchains">49. Blockchains</NoteSectionTitle>
      <NoteParagraph>
        Blockchains combine hash chains, Merkle trees, digital signatures, public verification, and a consensus mechanism. Transactions are signed, blocks commit to transactions, and each block references the previous block hash.
      </NoteParagraph>

      <NoteSectionTitle id="miller-rabin-primality-testing">50. Miller-Rabin Primality Testing</NoteSectionTitle>
      <NoteParagraph>
        Miller-Rabin is a randomized primality test. If it finds a witness to compositeness, the number is composite. If it does not, the number is probably prime with small error probability.
      </NoteParagraph>
      <NoteParagraph>
        Primality testing matters because public-key systems often need large primes or group parameters.
      </NoteParagraph>

      <NoteSectionTitle id="oblivious-transfer">51. Oblivious Transfer</NoteSectionTitle>
      <NoteParagraph>
        In 1-out-of-2 oblivious transfer, the sender has <InlineMath math="m_0,m_1" /> and the receiver has a choice bit <InlineMath math="b" />. The receiver learns <InlineMath math="m_b" /> and nothing about <InlineMath math="m_{1-b}" />; the sender learns nothing about <InlineMath math="b" />.
      </NoteParagraph>

      <NoteSectionTitle id="secure-two-party-computation">52. Secure Two-Party Computation</NoteSectionTitle>
      <NoteParagraph>
        Secure two-party computation lets two parties compute <InlineMath math="f(x,y)" /> without revealing more about their private inputs than the output itself reveals. Security properties include correctness, privacy, and sometimes fairness depending on the model.
      </NoteParagraph>

      <NoteSectionTitle id="yao-garbled-circuits">53. Yao Garbled Circuits</NoteSectionTitle>
      <NoteParagraph>
        Yao garbled circuits compute a Boolean circuit securely. Each wire has two random tokens, one for bit <InlineMath math="0" /> and one for bit <InlineMath math="1" />. The evaluator receives exactly one token per input wire and evaluates encrypted gate tables without learning hidden wire values.
      </NoteParagraph>
      <NoteTopicGroup>
        <NoteTopicBlock title="Why OT Appears">
          <NoteParagraph className="mb-0">
            For the evaluator's private input bits, oblivious transfer gives the evaluator the matching token without telling the garbler which bit was chosen and without revealing the other token.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

      <NoteSectionTitle id="verifiable-outsourced-computation">54. Verifiable Outsourced Computation</NoteSectionTitle>
      <NoteParagraph>
        Verifiable outsourced computation asks whether a weak client can outsource work to a powerful server and verify the result faster than recomputing it. This idea leads toward interactive proofs, SNARK-style systems, and proof-carrying computation.
      </NoteParagraph>

      <NoteSectionTitle id="circuit-arithmetization">55. Circuit Arithmetization</NoteSectionTitle>
      <NoteParagraph>
        Circuit arithmetization represents computation as algebraic constraints over a field. Boolean gates are replaced by arithmetic relations such as <InlineMath math="z=x+y" /> and <InlineMath math="z=x\cdot y" />.
      </NoteParagraph>
      <NoteParagraph>
        A valid computation becomes an assignment satisfying all constraints, which is a foundation for modern proof systems.
      </NoteParagraph>

      <NoteSectionTitle id="cryptographic-proof-techniques">56. Cryptographic Proof Techniques</NoteSectionTitle>
      <NoteTopicGroup>
        <NoteTopicBlock title="Reductions">
          <NoteParagraph className="mb-0">
            If an adversary breaks the construction, use it as a subroutine to break the underlying assumption.
          </NoteParagraph>
        </NoteTopicBlock>
        <NoteTopicBlock title="Hybrid Arguments">
          <NoteParagraph className="mb-0">
            Move from real to ideal one small game change at a time. If endpoints differ, an adjacent pair differs.
          </NoteParagraph>
        </NoteTopicBlock>
        <NoteTopicBlock title="Bad Events">
          <NoteParagraph className="mb-0">
            If two games are identical unless a rare event happens, bound the adversary's advantage by the probability of that event.
          </NoteParagraph>
        </NoteTopicBlock>
        <NoteTopicBlock title="Game Hopping">
          <NoteParagraph className="mb-0">
            Combine reductions, hybrids, and bad-event bounds until the real game becomes an ideal game whose advantage is zero or easy to bound.
          </NoteParagraph>
        </NoteTopicBlock>
      </NoteTopicGroup>

    </NotesLayout>
  );
}
