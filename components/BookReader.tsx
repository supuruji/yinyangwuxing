'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import type { Book, BookChapter, BookBlock } from '@/content/books/ko-ai-survival';

interface BookReaderProps {
  book: Book;
  locale: string;
  backLabel: string;
  backHref: string;
}

export default function BookReader({ book, locale, backLabel, backHref }: BookReaderProps) {
  const [activeId, setActiveId] = useState(book.chapters[0].id);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const activeChapter = book.chapters.find((c) => c.id === activeId) ?? book.chapters[0];
  const activeIndex = book.chapters.findIndex((c) => c.id === activeId);
  const prevChapter = activeIndex > 0 ? book.chapters[activeIndex - 1] : null;
  const nextChapter = activeIndex < book.chapters.length - 1 ? book.chapters[activeIndex + 1] : null;

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setSidebarOpen(false);
  }, [activeId]);

  return (
    <div className="flex h-[calc(100vh-120px)] relative">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-full lg:h-[calc(100vh-120px)] z-30 lg:z-auto
          w-72 lg:w-64 xl:w-72
          bg-ink-soft border-r border-gold/20
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Sidebar header */}
        <div className="p-4 border-b border-gold/20 flex-shrink-0">
          <Link
            href={backHref}
            className="inline-flex items-center gap-1 text-parchment-muted hover:text-gold text-xs mb-3 transition-colors"
          >
            <span>←</span>
            <span>{backLabel}</span>
          </Link>
          <p className="text-gold/70 text-xs uppercase tracking-widest mb-1">{book.series}</p>
          <h2 className="text-parchment text-sm font-serif leading-snug line-clamp-3">{book.title}</h2>
          <p className="text-parchment-muted text-xs mt-1">— {book.author}</p>
        </div>

        {/* Chapter list */}
        <nav className="flex-1 overflow-y-auto py-2">
          {book.chapters.map((chapter, index) => {
            const isActive = chapter.id === activeId;
            const showPart = chapter.part && (index === 0 || book.chapters[index - 1].part !== chapter.part);
            return (
              <div key={chapter.id}>
                {showPart && (
                  <div className="px-4 pt-4 pb-1">
                    <p className="text-gold/50 text-xs uppercase tracking-wider leading-tight">
                      {chapter.part}
                    </p>
                  </div>
                )}
                <button
                  onClick={() => setActiveId(chapter.id)}
                  className={`
                    w-full text-left px-4 py-3 text-sm transition-colors
                    border-l-2 leading-snug
                    ${isActive
                      ? 'border-gold bg-gold/10 text-parchment font-medium'
                      : 'border-transparent text-parchment-muted hover:text-parchment hover:bg-gold/5 hover:border-gold/30'
                    }
                  `}
                >
                  {chapter.title}
                </button>
              </div>
            );
          })}
        </nav>

        {/* Book info */}
        <div className="p-4 border-t border-gold/20 flex-shrink-0">
          <p className="text-parchment-muted text-xs leading-relaxed">
            {book.publisher} · {book.year}
          </p>
          <p className="text-parchment-muted text-xs mt-0.5">ISBN {book.isbn}</p>
        </div>
      </aside>

      {/* Main content */}
      <main
        ref={contentRef}
        className="flex-1 overflow-y-auto bg-ink"
      >
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-10 bg-ink-soft border-b border-gold/20 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded border border-gold/30 hover:border-gold/60 transition-colors"
            aria-label="목차 열기"
          >
            <MenuIcon />
          </button>
          <span className="text-parchment text-sm font-serif truncate">{activeChapter.title}</span>
        </div>

        <div className="max-w-3xl mx-auto px-6 py-10 lg:px-10 lg:py-12">
          {/* Part label */}
          {activeChapter.part && (
            <p className="text-gold/60 text-xs uppercase tracking-widest mb-3">{activeChapter.part}</p>
          )}

          {/* Chapter title */}
          <h1 className="text-3xl lg:text-4xl font-serif text-gold mb-2 leading-tight">
            {activeChapter.title}
          </h1>
          {activeChapter.subtitle && (
            <p className="text-parchment-muted text-base mb-8 leading-relaxed">{activeChapter.subtitle}</p>
          )}
          {!activeChapter.subtitle && <div className="mb-8 border-b border-gold/20" />}

          {/* Chapter content */}
          <div className="space-y-5">
            {activeChapter.blocks.map((block, i) => (
              <BlockRenderer key={i} block={block} />
            ))}
          </div>

          {/* Navigation */}
          <div className="mt-16 pt-8 border-t border-gold/20 flex flex-col sm:flex-row gap-4 justify-between">
            {prevChapter ? (
              <button
                onClick={() => setActiveId(prevChapter.id)}
                className="flex items-start gap-3 text-left group"
              >
                <span className="text-gold/60 mt-0.5 group-hover:text-gold transition-colors">←</span>
                <div>
                  <p className="text-parchment-muted text-xs uppercase tracking-wide">이전</p>
                  <p className="text-parchment text-sm group-hover:text-gold transition-colors leading-snug">
                    {prevChapter.title}
                  </p>
                </div>
              </button>
            ) : (
              <div />
            )}
            {nextChapter ? (
              <button
                onClick={() => setActiveId(nextChapter.id)}
                className="flex items-start gap-3 text-right group sm:flex-row-reverse"
              >
                <span className="text-gold/60 mt-0.5 group-hover:text-gold transition-colors">→</span>
                <div>
                  <p className="text-parchment-muted text-xs uppercase tracking-wide">다음</p>
                  <p className="text-parchment text-sm group-hover:text-gold transition-colors leading-snug">
                    {nextChapter.title}
                  </p>
                </div>
              </button>
            ) : (
              <div />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function BlockRenderer({ block }: { block: BookBlock }) {
  switch (block.type) {
    case 'h3':
      return (
        <h3 className="text-xl font-serif text-gold mt-8 mb-3 leading-snug pt-2">
          {block.text}
        </h3>
      );
    case 'h4':
      return (
        <h4 className="text-base font-serif text-gold/80 mt-6 mb-2 leading-snug">
          {block.text}
        </h4>
      );
    case 'quote':
      return (
        <blockquote className="border-l-2 border-gold/50 pl-4 my-6 text-parchment-muted italic leading-relaxed">
          {block.text}
        </blockquote>
      );
    case 'p':
    default:
      return (
        <p className="text-parchment leading-[1.9] text-[0.975rem]">
          {block.text}
        </p>
      );
  }
}

function MenuIcon() {
  return (
    <svg className="w-5 h-5 text-parchment-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  );
}
