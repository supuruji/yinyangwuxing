import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { getBookIndex, getBookSegment, getBookUi, BOOK_TOTAL } from '@/lib/bookAiSurvival';

interface Props {
  params: Promise<{ locale: string; seg: string }>;
}

export function generateStaticParams() {
  return Array.from({ length: BOOK_TOTAL }, (_, i) => ({ seg: String(i) }));
}

/* ---------- inline markdown (**bold**, *italic*, <br>) ---------- */
function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let k = 0;
  const segments = text.split(/<br\s*\/?>/);
  segments.forEach((seg, si) => {
    if (si > 0) nodes.push(<br key={`br${k++}`} />);
    const re = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;
    let last = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(seg)) !== null) {
      if (m.index > last) nodes.push(seg.slice(last, m.index));
      if (m[1] !== undefined) nodes.push(<strong key={k++} className="text-parchment font-semibold">{m[1]}</strong>);
      else nodes.push(<em key={k++}>{m[2]}</em>);
      last = m.index + m[0].length;
    }
    if (last < seg.length) nodes.push(seg.slice(last));
  });
  return nodes;
}

/* ---------- block-level markdown renderer ---------- */
function renderMarkdown(raw: string): ReactNode[] {
  const lines = raw.split('\n');
  const blocks: ReactNode[] = [];
  let i = 0;
  let key = 0;

  const splitRow = (line: string) =>
    line.replace(/^\||\|$/g, '').split('|').map((c) => c.trim());

  while (i < lines.length) {
    const line = lines[i];
    const t = line.trim();

    if (!t) {
      i++;
      continue;
    }

    // Table block: a line of cells followed by a separator row
    if (t.startsWith('|') && i + 1 < lines.length && /^\|[\s:|-]+\|?$/.test(lines[i + 1].trim())) {
      const header = splitRow(t);
      i += 2; // skip header + separator
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        rows.push(splitRow(lines[i].trim()));
        i++;
      }
      blocks.push(
        <div key={key++} className="my-6 overflow-x-auto">
          <table className="w-full border-collapse text-[0.85rem]">
            <thead>
              <tr>
                {header.map((h, hi) => (
                  <th
                    key={hi}
                    className="border border-gold/25 bg-gold/10 text-gold px-3 py-2 text-left font-serif font-semibold align-top"
                  >
                    {renderInline(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <tr key={ri} className={ri % 2 ? 'bg-gold/[0.03]' : ''}>
                  {r.map((c, ci) => (
                    <td
                      key={ci}
                      className="border border-gold/20 px-3 py-2 text-parchment/85 align-top leading-relaxed"
                    >
                      {renderInline(c)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    // Sub-subsection heading (#### -> h3)
    if (t.startsWith('#### ')) {
      blocks.push(
        <h3 key={key++} className="text-base font-serif text-parchment font-semibold mt-7 mb-2 leading-snug">
          {renderInline(t.slice(5))}
        </h3>
      );
      i++;
      continue;
    }

    // Section heading (### -> h2)
    if (t.startsWith('### ')) {
      blocks.push(
        <h2 key={key++} className="text-lg font-serif text-gold mt-9 mb-3 leading-snug">
          {renderInline(t.slice(4))}
        </h2>
      );
      i++;
      continue;
    }

    // Unordered list
    if (t.startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith('- ')) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      blocks.push(
        <ul key={key++} className="list-disc pl-6 space-y-2 my-4">
          {items.map((it, ii) => (
            <li key={ii} className="text-parchment/90 leading-[1.85] text-[0.95rem]">
              {renderInline(it)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Paragraph
    blocks.push(
      <p key={key++} className="text-parchment/90 leading-[1.9] text-[0.97rem]" style={{ textAlign: 'justify' }}>
        {renderInline(t)}
      </p>
    );
    i++;
  }

  return blocks;
}

export default async function BookSegmentPage({ params }: Props) {
  const { locale, seg } = await params;
  const id = parseInt(seg, 10);
  if (Number.isNaN(id) || id < 0 || id >= BOOK_TOTAL) notFound();

  const segment = getBookSegment(locale, id);
  const index = getBookIndex(locale);
  const ui = getBookUi(locale);
  const base = `/${locale}/books/ai-survival`;
  const prevId = id > 0 ? id - 1 : null;
  const nextId = id < BOOK_TOTAL - 1 ? id + 1 : null;
  const blocks = renderMarkdown(segment.content);
  const eyebrow = segment.part ? ui.partEyebrow(segment.part) : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Top nav */}
      <div className="flex items-center justify-between mb-8 text-sm">
        <Link href={base} className="text-gold/70 hover:text-gold transition-colors">
          ← {ui.contents}
        </Link>
        <div className="flex gap-3">
          {prevId !== null && (
            <Link href={`${base}/${prevId}`} className="text-parchment-muted hover:text-gold transition-colors">
              {ui.previous}
            </Link>
          )}
          {nextId !== null && (
            <Link href={`${base}/${nextId}`} className="text-parchment-muted hover:text-gold transition-colors">
              {ui.next}
            </Link>
          )}
        </div>
      </div>

      {/* Header */}
      {eyebrow && (
        <p className="text-gold/60 text-xs uppercase tracking-widest mb-2">{eyebrow}</p>
      )}
      <h1 className="text-2xl font-serif text-gold mb-2 leading-snug">{segment.title}</h1>
      <div className="h-px bg-gold/20 my-6" />

      {/* Body */}
      <article>{blocks}</article>

      {/* Bottom nav */}
      <div className="flex items-center justify-between mt-12 pt-6 border-t border-gold/20 text-sm gap-4">
        <div>
          {prevId !== null && (
            <Link href={`${base}/${prevId}`} className="text-gold/80 hover:text-gold transition-colors font-semibold">
              ← {index[prevId].navTitle}
            </Link>
          )}
        </div>
        <div className="text-right">
          {nextId !== null && (
            <Link href={`${base}/${nextId}`} className="text-gold/80 hover:text-gold transition-colors font-semibold">
              {index[nextId].navTitle} →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
