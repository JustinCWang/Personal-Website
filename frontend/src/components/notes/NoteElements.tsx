/**
 * Shared note content helpers for tables, lists, and related-note links.
 */

import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useDarkMode } from '../../hooks/useDarkMode';

type TableRow = ReactNode[];

function useNoteElementTheme() {
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
  const orderedListClass = `list-decimal pl-6 mb-6 font-mono text-sm leading-relaxed space-y-2 ${
    isDarkMode ? 'text-green-100/90' : 'text-slate-700'
  }`;
  const linkClass = isDarkMode
    ? 'border-green-500/25 bg-green-500/5 text-green-300 hover:bg-green-500/10'
    : 'border-slate-200 bg-white text-blue-600 hover:bg-slate-50';

  return {
    isDarkMode,
    subtlePanelClass,
    tableClass,
    tableHeadClass,
    tableCellClass,
    listClass,
    orderedListClass,
    linkClass,
  };
}

export function BulletList({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { listClass } = useNoteElementTheme();
  return <ul className={`${listClass} ${className}`}>{children}</ul>;
}

export function OrderedList({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { orderedListClass } = useNoteElementTheme();
  return <ol className={`${orderedListClass} ${className}`}>{children}</ol>;
}

export function NoteTable({ headers, rows }: { headers: ReactNode[]; rows: TableRow[] }) {
  const { tableClass, tableHeadClass, tableCellClass } = useNoteElementTheme();

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

export function RelatedNotes({
  links,
  className = '',
}: {
  links: Array<{ href: string; label: string; note: string }>;
  className?: string;
}) {
  const { linkClass } = useNoteElementTheme();

  return (
    <div className={`mb-8 grid grid-cols-1 gap-3 md:grid-cols-2 ${className}`}>
      {links.map((link) => (
        <Link key={link.href} to={link.href} className={`rounded-lg border p-4 font-mono transition-colors ${linkClass}`}>
          <span className="block text-sm font-bold">{link.label}</span>
          <span className="mt-1 block text-xs opacity-80">{link.note}</span>
        </Link>
      ))}
    </div>
  );
}
