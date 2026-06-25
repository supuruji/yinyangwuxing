'use client';

import { useState, useEffect, useRef, Fragment } from 'react';
import Link from 'next/link';
import type { Paper, PaperBlock, PaperFootnote } from '@/content/papers/types';

interface PaperReaderProps {
  paper: Paper;
  backLabel: string;
  backHref: string;
}

export default function PaperReader({ paper, backLabel, backHref }: PaperReaderProps) {
  const [activeId, setActiveId] = useState(paper.chapters[0].id);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const activeChapter = paper.chapters.find((c) => c.id === activeId) ?? paper.chapters[0];
  const activeIndex = paper.chapters.findIndex((c) => c.id === activeId);
  const prevChapter = activeIndex > 0 ? paper.chapters[activeIndex - 1] : null;
  const nextChapter = activeIndex < paper.chapters.length - 1 ? paper.chapters[activeIndex + 1] : null;

  const footnoteMap = new Map<number, PaperFootnote>();
  if (paper.footnotes) {
    for (const fn of paper.footnotes) footnoteMap.set(fn.n, fn);
  }

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setSidebarOpen(false);
  }, [activeId]);

  return (
    <div className="flex h-[calc(100vh-120px)] relative">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

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
        <div className="p-4 border-b border-gold/20 flex-shrink-0">
          <Link
            href={backHref}
            className="inline-flex items-center gap-1 text-parchment-muted hover:text-gold text-xs mb-3 transition-colors"
          >
            <span>←</span>
            <span>{backLabel}</span>
          </Link>
          {paper.venue && (
            <p className="text-gold/70 text-xs uppercase tracking-widest mb-1">{paper.venue}</p>
          )}
          <h2 className="text-parchment text-sm font-serif leading-snug line-clamp-3">{paper.title}</h2>
          <p className="text-parchment-muted text-xs mt-1">— {paper.author}</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          {paper.chapters.map((chapter) => {
            const isActive = chapter.id === activeId;
            return (
              <button
                key={chapter.id}
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
            );
          })}
        </nav>

        {paper.downloads && paper.downloads.length > 0 && (
          <div className="p-4 border-t border-gold/20 flex-shrink-0 space-y-2">
            <p className="text-gold/60 text-xs uppercase tracking-wider mb-1">원문 다운로드</p>
            {paper.downloads.map((dl) => (
              <a
                key={dl.href}
                href={dl.href}
                download
                className="block w-full text-center px-3 py-2 text-xs border border-gold/40 hover:border-gold hover:bg-gold/10 text-parchment rounded transition-colors"
              >
                {dl.label}
              </a>
            ))}
          </div>
        )}
      </aside>

      <main ref={contentRef} className="flex-1 overflow-y-auto bg-ink">
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
          {activeChapter.subtitle && (
            <p className="text-gold/60 text-xs uppercase tracking-widest mb-3">{activeChapter.subtitle}</p>
          )}

          <h1 className="text-3xl lg:text-4xl font-serif text-gold mb-2 leading-tight">
            {activeChapter.title}
          </h1>
          <div className="mb-8 border-b border-gold/20" />

          <div className="space-y-5">
            {activeChapter.blocks.map((block, i) => (
              <BlockRenderer key={i} block={block} footnoteMap={footnoteMap} />
            ))}
          </div>

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

function BlockRenderer({
  block,
  footnoteMap,
}: {
  block: PaperBlock;
  footnoteMap: Map<number, PaperFootnote>;
}) {
  if (block.type === 'footnotes-list') {
    const items: PaperFootnote[] = [];
    for (let n = block.from; n <= block.to; n++) {
      const fn = footnoteMap.get(n);
      if (fn) items.push(fn);
    }
    return (
      <ol className="my-6 space-y-3 list-none pl-0">
        {items.map((fn) => (
          <li
            key={fn.n}
            id={`fn-${fn.n}`}
            className="text-parchment-muted text-sm leading-relaxed border-l-2 border-gold/20 pl-4 scroll-mt-24"
          >
            <span className="text-gold/80 font-serif mr-2">[{fn.n}]</span>
            <span className="whitespace-pre-wrap">{fn.body}</span>
          </li>
        ))}
      </ol>
    );
  }

  if (block.type === 'image') {
    return (
      <figure className="my-6 flex flex-col items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={block.src}
          alt={block.alt}
          style={block.width ? { maxWidth: `${block.width}px` } : undefined}
          className="rounded border border-gold/20 bg-parchment/5"
        />
        {block.caption && (
          <figcaption className="text-gold/70 text-sm font-serif mt-2 text-center">
            {renderInline(block.caption, footnoteMap)}
          </figcaption>
        )}
      </figure>
    );
  }

  if (block.type === 'table') {
    return (
      <div className="my-6 overflow-x-auto">
        {block.caption && (
          <p className="text-gold/80 text-sm font-serif mb-2">{renderInline(block.caption, footnoteMap)}</p>
        )}
        <table className="min-w-full border border-gold/30 text-xs lg:text-sm">
          <thead>
            <tr className="bg-gold/10">
              {block.headers.map((h, i) => (
                <th key={i} className="border border-gold/20 px-3 py-2 text-left font-serif text-gold/90">
                  {renderInline(h, footnoteMap)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, ri) => (
              <tr key={ri} className="even:bg-gold/5">
                {row.map((cell, ci) => (
                  <td key={ci} className="border border-gold/15 px-3 py-2 align-top text-parchment leading-relaxed">
                    {renderInline(cell, footnoteMap)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  switch (block.type) {
    case 'h3':
      return (
        <h3 className="text-xl font-serif text-gold mt-8 mb-3 leading-snug pt-2">
          {renderInline(block.text, footnoteMap)}
        </h3>
      );
    case 'h4':
      return (
        <h4 className="text-base font-serif text-gold/80 mt-6 mb-2 leading-snug">
          {renderInline(block.text, footnoteMap)}
        </h4>
      );
    case 'quote':
      return (
        <blockquote className="border-l-2 border-gold/50 pl-4 my-6 text-parchment-muted italic leading-relaxed">
          {renderInline(block.text, footnoteMap)}
        </blockquote>
      );
    case 'p':
    default:
      return (
        <p className="text-parchment leading-[1.9] text-[0.975rem]">
          {renderInline(block.text, footnoteMap)}
        </p>
      );
  }
}

function renderInline(text: string, footnoteMap: Map<number, PaperFootnote>) {
  const parts: (string | { n: number; body: string })[] = [];
  const re = /\[fn:(\d+)\]/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const n = Number(m[1]);
    const fn = footnoteMap.get(n);
    parts.push({ n, body: fn?.body ?? '' });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));

  const renderText = (s: string, keyPrefix: string) => {
    const lines = s.split('\n');
    return lines.map((line, li) => (
      <Fragment key={`${keyPrefix}-${li}`}>
        {li > 0 && <br />}
        {line}
      </Fragment>
    ));
  };

  return (
    <>
      {parts.map((p, i) =>
        typeof p === 'string' ? (
          <Fragment key={i}>{renderText(p, String(i))}</Fragment>
        ) : (
          <sup key={i} className="text-gold/80 mx-0.5">
            <a
              href={`#fn-${p.n}`}
              title={p.body}
              className="hover:text-gold underline decoration-gold/40 text-[0.7em]"
            >
              [{p.n}]
            </a>
          </sup>
        )
      )}
    </>
  );
}

function MenuIcon() {
  return (
    <svg className="w-5 h-5 text-parchment-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  );
}
