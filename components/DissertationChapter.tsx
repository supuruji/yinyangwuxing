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
  const [mobileOpen, setMobileOpen] = useState(false);
  const fnNumbers = new Set(footnotes.map(f => f.number));
  const currentIdx = allChapters.findIndex(c => c.id === chapterId);
  const prev = currentIdx > 0 ? allChapters[currentIdx - 1] : null;
  const next = currentIdx < allChapters.length - 1 ? allChapters[currentIdx + 1] : null;

  const SidebarNav = () => (
    <nav className="space-y-0.5">
      <p className="text-[10px] font-semibold text-gold/60 uppercase tracking-widest px-3 pb-2 pt-1">
        목차
      </p>
      {allChapters.map((ch) => (
        <Link
          key={ch.id}
          href={`/${locale}/dissertation/doctoral/${dissertationId}/${ch.id}`}
          onClick={() => setMobileOpen(false)}
          className={`block px-3 py-2 rounded text-xs leading-snug transition-colors ${
            ch.id === chapterId
              ? 'bg-gold/15 text-gold font-semibold border-l-2 border-gold'
              : 'text-parchment-muted hover:text-parchment hover:bg-gold/5'
          }`}
        >
          {ch.title}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Mobile TOC toggle */}
      <button
        className="lg:hidden mb-4 flex items-center gap-2 text-xs text-gold border border-gold/30 rounded px-3 py-1.5 hover:bg-gold/5 transition-colors"
        onClick={() => setMobileOpen(o => !o)}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        {mobileOpen ? '목차 닫기' : '목차 보기'}
      </button>

      {/* Mobile sidebar (dropdown) */}
      {mobileOpen && (
        <div className="lg:hidden mb-6 p-3 bg-ink-soft border border-gold/20 rounded-lg">
          <SidebarNav />
        </div>
      )}

      <div className="flex gap-8">
        {/* ── 왼쪽 세로 메뉴 (데스크톱) ── */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-20 bg-ink-soft border border-gold/20 rounded-xl p-3">
            <Link
              href={`/${locale}/dissertation/doctoral/${dissertationId}`}
              className="block text-[10px] text-parchment-muted hover:text-gold transition-colors mb-3 px-3"
            >
              ← 논문 개요
            </Link>
            <SidebarNav />
          </div>
        </aside>

        {/* ── 본문 영역 ── */}
        <div className="flex-1 min-w-0">
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

          {/* Chapter title */}
          <h1 className="text-2xl md:text-3xl font-serif text-gold mb-8 leading-snug">
            {chapterTitle}
          </h1>

          {/* Body text */}
          <article className="space-y-5 text-parchment leading-relaxed text-[0.95rem]">
            {paragraphs.map((para, i) => (
              <p key={i}>{renderParagraph(para, fnNumbers)}</p>
            ))}
          </article>

          {/* Footnotes */}
          {footnotes.length > 0 && (
            <section className="mt-16 pt-8 border-t border-gold/20">
              <h2 className="text-sm font-semibold text-gold mb-4 tracking-wide">각주</h2>
              <ol className="space-y-3 text-xs text-parchment-muted leading-relaxed">
                {footnotes.map(fn => (
                  <li key={fn.number} id={`fn-${fn.number}`} className="flex gap-2 scroll-mt-20">
                    <a href={`#fnref-${fn.number}`} className="shrink-0 text-gold hover:underline font-mono">
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
      </div>
    </div>
  );
}
