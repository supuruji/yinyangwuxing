'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Footnote {
  number: number;
  text: string;
}

interface Props {
  chapterId: string;
  chapterTitle: string;
  paragraphs: string[];
  footnotes: Footnote[];
  locale: string;
  dissertationId: string;
  allChapters: { id: string; title: string }[];
}

function renderParagraph(text: string, footnoteNumbers: Set<number>): React.ReactNode {
  // [^N] → superscript anchor
  const parts = text.split(/(\[\^\d+\])/);
  return parts.map((part, i) => {
    const m = part.match(/^\[\^(\d+)\]$/);
    if (m) {
      const n = parseInt(m[1], 10);
      if (footnoteNumbers.has(n)) {
        return (
          <a
            key={i}
            href={`#fn-${n}`}
            id={`fnref-${n}`}
            className="text-gold text-xs align-super no-underline hover:underline ml-0.5"
          >
            {n})
          </a>
        );
      }
      return null;
    }
    return <span key={i}>{part}</span>;
  });
}

export default function DissertationChapter({
  chapterId, chapterTitle, paragraphs, footnotes, locale, dissertationId, allChapters,
}: Props) {
  const [tocOpen, setTocOpen] = useState(false);
  const fnNumbers = new Set(footnotes.map(f => f.number));
  const currentIdx = allChapters.findIndex(c => c.id === chapterId);
  const prev = currentIdx > 0 ? allChapters[currentIdx - 1] : null;
  const next = currentIdx < allChapters.length - 1 ? allChapters[currentIdx + 1] : null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-parchment-muted mb-6 flex items-center gap-1.5 flex-wrap">
        <Link href={`/${locale}/dissertation`} className="hover:text-gold transition-colors">학위논문</Link>
        <span className="text-gold/40">›</span>
        <Link href={`/${locale}/dissertation/doctoral`} className="hover:text-gold transition-colors">박사논문</Link>
        <span className="text-gold/40">›</span>
        <Link href={`/${locale}/dissertation/doctoral/${dissertationId}`} className="hover:text-gold transition-colors">동학·대순 비교연구</Link>
        <span className="text-gold/40">›</span>
        <span className="text-parchment">{chapterTitle}</span>
      </nav>

      {/* TOC toggle */}
      <button
        onClick={() => setTocOpen(o => !o)}
        className="mb-6 text-xs text-gold border border-gold/30 rounded px-3 py-1.5 hover:bg-gold/5 transition-colors"
      >
        {tocOpen ? '▲ 목차 닫기' : '▼ 목차 보기'}
      </button>

      {tocOpen && (
        <nav className="mb-8 p-4 bg-ink-soft border border-gold/20 rounded-lg text-sm space-y-1">
          {allChapters.map(ch => (
            <Link
              key={ch.id}
              href={`/${locale}/dissertation/doctoral/${dissertationId}/${ch.id}`}
              className={`block px-2 py-1 rounded transition-colors ${
                ch.id === chapterId ? 'text-gold bg-gold/10' : 'text-parchment-muted hover:text-gold'
              }`}
            >
              {ch.title}
            </Link>
          ))}
        </nav>
      )}

      {/* Chapter title */}
      <h1 className="text-2xl md:text-3xl font-serif text-gold mb-8 leading-snug">
        {chapterTitle}
      </h1>

      {/* Body text */}
      <article className="space-y-5 text-parchment leading-relaxed text-[0.95rem]">
        {paragraphs.map((para, i) => (
          <p key={i}>
            {renderParagraph(para, fnNumbers)}
          </p>
        ))}
      </article>

      {/* Footnotes */}
      {footnotes.length > 0 && (
        <section className="mt-16 pt-8 border-t border-gold/20">
          <h2 className="text-sm font-semibold text-gold mb-4 tracking-wide uppercase">각주</h2>
          <ol className="space-y-3 text-xs text-parchment-muted leading-relaxed">
            {footnotes.map(fn => (
              <li key={fn.number} id={`fn-${fn.number}`} className="flex gap-2 scroll-mt-20">
                <a
                  href={`#fnref-${fn.number}`}
                  className="shrink-0 text-gold hover:underline font-mono"
                >
                  {fn.number})
                </a>
                <span>{fn.text}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Prev / Next */}
      <nav className="mt-12 pt-6 border-t border-gold/20 flex justify-between gap-4">
        {prev ? (
          <Link
            href={`/${locale}/dissertation/doctoral/${dissertationId}/${prev.id}`}
            className="flex-1 p-4 border border-gold/20 rounded-lg text-sm hover:border-gold/50 transition-colors bg-ink-soft"
          >
            <span className="block text-xs text-parchment-muted mb-1">← 이전</span>
            <span className="text-parchment font-medium line-clamp-1">{prev.title}</span>
          </Link>
        ) : <div />}
        {next ? (
          <Link
            href={`/${locale}/dissertation/doctoral/${dissertationId}/${next.id}`}
            className="flex-1 p-4 border border-gold/20 rounded-lg text-sm hover:border-gold/50 transition-colors bg-ink-soft text-right"
          >
            <span className="block text-xs text-parchment-muted mb-1">다음 →</span>
            <span className="text-parchment font-medium line-clamp-1">{next.title}</span>
          </Link>
        ) : <div />}
      </nav>
    </div>
  );
}
