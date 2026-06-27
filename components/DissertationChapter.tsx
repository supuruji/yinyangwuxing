'use client';

import { useState } from 'react';
import Link from 'next/link';

const LOCALE_UI = {
  ko: { toc: '목차', back: '← 논문 개요', dissertations: '학위논문', doctoral: '박사논문', masters: '석사논문', dissertationShort: '동학·대순 비교연구', footnotes: '각주', prev: '← 이전', next: '다음 →', tocOpen: '목차 보기', tocClose: '목차 닫기', resources: '자료', watchYoutube: '유튜브 보기 ↗' },
  en: { toc: 'Contents', back: '← Overview', dissertations: 'Dissertations', doctoral: 'Doctoral', masters: "Master's", dissertationShort: 'Donghak·Daesoon Study', footnotes: 'Footnotes', prev: '← Prev', next: 'Next →', tocOpen: 'Show Contents', tocClose: 'Hide Contents', resources: 'Resources', watchYoutube: 'Watch on YouTube ↗' },
  zh: { toc: '目录', back: '← 论文概要', dissertations: '学位论文', doctoral: '博士论文', masters: '硕士论文', dissertationShort: '东学·大巡比较研究', footnotes: '脚注', prev: '← 上一章', next: '下一章 →', tocOpen: '显示目录', tocClose: '隐藏目录', resources: '资料', watchYoutube: '观看 YouTube ↗' },
  ja: { toc: '目次', back: '← 論文概要', dissertations: '学位論文', doctoral: '博士論文', masters: '修士論文', dissertationShort: '東学·大巡比較研究', footnotes: '脚注', prev: '← 前', next: '次 →', tocOpen: '目次を開く', tocClose: '目次を閉じる', resources: '資料', watchYoutube: 'YouTube を見る ↗' },
} as const;
type LocaleKey = keyof typeof LOCALE_UI;

interface Heading { level: number; text: string; anchor: string | null; }
interface Paragraph { text: string; level: number; anchor: string | null; }
interface Cell { text: string; colSpan?: number; rowSpan?: number; }
interface TableItem { type: 'table'; caption: string; rows: Cell[][]; }
interface ParaItem { type: 'para'; text: string; level: number; anchor: string | null; }
type Item = ParaItem | TableItem;
interface Footnote { number: number; text: string; }
interface ChapterMeta {
  id: string;
  title: string;
  headings: Heading[];
}

interface Props {
  chapterId: string;
  chapterTitle: string;
  items: Item[];
  footnotes: Footnote[];
  headings: Heading[];
  locale: string;
  dissertationId: string;
  allChapters: ChapterMeta[];
  section?: 'doctoral' | 'masters';
  dissertationShort?: string;
  downloads?: { label: string; href: string }[];
  youtubeUrl?: string;
}

/* 본문 [^N] → 위첨자 앵커 */
function renderText(text: string, fnNums: Set<number>): React.ReactNode {
  return text.split(/(\[\^\d+\])/).map((part, i) => {
    const m = part.match(/^\[\^(\d+)\]$/);
    if (m) {
      const n = parseInt(m[1], 10);
      if (fnNums.has(n)) {
        return (
          <a key={i} href={`#fn-${n}`} id={`fnref-${n}`}
            className="text-gold text-[10px] align-super no-underline hover:underline ml-0.5">
            {n})
          </a>
        );
      }
      return null;
    }
    return <span key={i}>{part}</span>;
  });
}

/* 표 렌더 */
function TableBlock({ item }: { item: TableItem }) {
  return (
    <div className="my-6 overflow-x-auto">
      {item.caption && (
        <p className="text-xs text-parchment-muted mb-2 font-medium">{item.caption}</p>
      )}
      <table className="w-full border-collapse text-xs text-parchment">
        <tbody>
          {item.rows.map((row, ri) => (
            <tr key={ri} className={ri === 0 ? 'bg-gold/10' : ri % 2 === 0 ? 'bg-ink-soft/50' : ''}>
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  colSpan={cell.colSpan ?? 1}
                  rowSpan={cell.rowSpan ?? 1}
                  className="border border-gold/30 px-2 py-1.5 align-top leading-snug whitespace-pre-wrap"
                >
                  {cell.text}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* 단락 렌더: level별로 다른 스타일 */
function Paragraph({ para, fnNums }: { para: Paragraph; fnNums: Set<number> }) {
  const anchorId = para.anchor ?? undefined;

  if (para.level === 1) {
    return (
      <h2 id={anchorId} className="text-xl font-serif text-gold mt-12 mb-4 scroll-mt-24 border-b border-gold/20 pb-2">
        {renderText(para.text, fnNums)}
      </h2>
    );
  }
  if (para.level === 2) {
    return (
      <h3 id={anchorId} className="text-base font-semibold text-parchment mt-8 mb-3 scroll-mt-24">
        {renderText(para.text, fnNums)}
      </h3>
    );
  }
  if (para.level === 3) {
    return (
      <h4 id={anchorId} className="text-sm font-semibold text-parchment-muted mt-6 mb-2 scroll-mt-24">
        {renderText(para.text, fnNums)}
      </h4>
    );
  }
  return (
    <p className="text-parchment leading-relaxed text-[0.92rem]">
      {renderText(para.text, fnNums)}
    </p>
  );
}

/* 사이드바: 현재 챕터 아래 L2/L3 헤딩 3단계 전개 */
function Sidebar({
  allChapters, chapterId, dissertationId, locale, headings, onNav, section = 'doctoral',
}: {
  allChapters: ChapterMeta[];
  chapterId: string;
  dissertationId: string;
  locale: string;
  headings: Heading[];
  onNav?: () => void;
  section?: 'doctoral' | 'masters';
}) {
  /* L2 → L3 계층 빌드 */
  type L2Node = { heading: Heading; children: Heading[] };
  const l2nodes: L2Node[] = [];
  let cur: L2Node | null = null;
  for (const h of headings) {
    if (h.level === 1) continue; // 장 제목 자체는 스킵
    if (h.level === 2) { cur = { heading: h, children: [] }; l2nodes.push(cur); }
    else if (h.level === 3 && cur) cur.children.push(h);
  }

  const ui = LOCALE_UI[(locale as LocaleKey)] ?? LOCALE_UI.en;
  return (
    <nav className="space-y-0.5">
      <p className="text-[10px] font-semibold text-gold/50 uppercase tracking-widest px-3 pb-2 pt-1">
        {ui.toc}
      </p>

      {allChapters.map((ch) => {
        const isCurrent = ch.id === chapterId;
        return (
          <div key={ch.id}>
            {/* ── 장 (Level 0 / 챕터) ── */}
            <Link
              href={`/${locale}/dissertation/${section}/${dissertationId}/${ch.id}`}
              onClick={onNav}
              className={`block px-3 py-1.5 rounded text-xs leading-snug transition-colors ${
                isCurrent
                  ? 'bg-gold/15 text-gold font-semibold border-l-2 border-gold'
                  : 'text-parchment-muted hover:text-parchment hover:bg-gold/5'
              }`}
            >
              {ch.title}
            </Link>

            {/* ── 현재 챕터만 절/소절 전개 ── */}
            {isCurrent && l2nodes.length > 0 && (
              <div className="ml-3 mt-0.5 mb-1 border-l border-gold/20 pl-2 space-y-0.5">
                {l2nodes.map((node, ni) => (
                  <div key={ni}>
                    {/* 절 (Level 2) */}
                    <a
                      href={node.heading.anchor ? `#${node.heading.anchor}` : '#'}
                      onClick={onNav}
                      className="block py-1 text-[11px] text-parchment-muted hover:text-gold transition-colors leading-snug"
                    >
                      {node.heading.text}
                    </a>

                    {/* 소절 (Level 3) */}
                    {node.children.length > 0 && (
                      <div className="ml-2 border-l border-gold/10 pl-2 space-y-0.5">
                        {node.children.map((h3, hi) => (
                          <a
                            key={hi}
                            href={h3.anchor ? `#${h3.anchor}` : '#'}
                            onClick={onNav}
                            className="block py-0.5 text-[10px] text-parchment-muted/70 hover:text-gold transition-colors leading-snug"
                          >
                            {h3.text}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

export default function DissertationChapter({
  chapterId, chapterTitle, items, footnotes, headings,
  locale, dissertationId, allChapters, section = 'doctoral', dissertationShort,
  downloads, youtubeUrl,
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const fnNums = new Set(footnotes.map(f => f.number));
  const currentIdx = allChapters.findIndex(c => c.id === chapterId);
  const prev = currentIdx > 0 ? allChapters[currentIdx - 1] : null;
  const next = currentIdx < allChapters.length - 1 ? allChapters[currentIdx + 1] : null;
  const ui = LOCALE_UI[(locale as LocaleKey)] ?? LOCALE_UI.en;
  const sectionLabel = section === 'masters' ? ui.masters : ui.doctoral;
  const shortLabel = dissertationShort ?? ui.dissertationShort;
  const hasResources = (downloads && downloads.length > 0) || !!youtubeUrl;
  const resourceBlock = hasResources ? (
    <div className="mt-3 pt-3 border-t border-gold/20 space-y-2">
      <p className="text-[10px] font-semibold text-gold/50 uppercase tracking-widest px-3 pb-1">{ui.resources}</p>
      {downloads?.map((dl) => (
        <a
          key={dl.href}
          href={dl.href}
          download
          className="block w-full text-center px-3 py-2 text-xs border border-gold/40 hover:border-gold hover:bg-gold/10 text-parchment rounded transition-colors"
        >
          {dl.label}
        </a>
      ))}
      {youtubeUrl && (
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center px-3 py-2 text-xs border border-gold/40 hover:border-gold hover:bg-gold/10 text-parchment rounded transition-colors"
        >
          {ui.watchYoutube}
        </a>
      )}
    </div>
  ) : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* 모바일 목차 토글 */}
      <button
        className="lg:hidden mb-4 flex items-center gap-2 text-xs text-gold border border-gold/30 rounded px-3 py-1.5 hover:bg-gold/5 transition-colors"
        onClick={() => setMobileOpen(o => !o)}
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        {mobileOpen ? ui.tocClose : ui.tocOpen}
      </button>

      {/* 모바일 목차 드롭다운 */}
      {mobileOpen && (
        <div className="lg:hidden mb-6 p-3 bg-ink-soft border border-gold/20 rounded-lg max-h-72 overflow-y-auto">
          <Sidebar
            allChapters={allChapters} chapterId={chapterId}
            dissertationId={dissertationId} locale={locale}
            headings={headings} onNav={() => setMobileOpen(false)} section={section}
          />
          {resourceBlock}
        </div>
      )}

      <div className="flex gap-8">
        {/* ── 왼쪽 세로 메뉴 (데스크톱) ── */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-20 bg-ink-soft border border-gold/20 rounded-xl p-3 max-h-[calc(100vh-6rem)] overflow-y-auto">
            <Link
              href={`/${locale}/dissertation/${section}/${dissertationId}`}
              className="block text-[10px] text-parchment-muted hover:text-gold transition-colors mb-3 px-3"
            >
              {ui.back}
            </Link>
            <Sidebar
              allChapters={allChapters} chapterId={chapterId}
              dissertationId={dissertationId} locale={locale}
              headings={headings} section={section}
            />
            {resourceBlock}
          </div>
        </aside>

        {/* ── 본문 영역 ── */}
        <div className="flex-1 min-w-0">
          {/* 빵부스러기 */}
          <nav className="text-xs text-parchment-muted mb-6 flex items-center gap-1.5 flex-wrap">
            <Link href={`/${locale}/dissertation`} className="hover:text-gold transition-colors">{ui.dissertations}</Link>
            <span className="text-gold/40">›</span>
            <Link href={`/${locale}/dissertation/${section}`} className="hover:text-gold transition-colors">{sectionLabel}</Link>
            <span className="text-gold/40">›</span>
            <Link href={`/${locale}/dissertation/${section}/${dissertationId}`} className="hover:text-gold transition-colors">{shortLabel}</Link>
            <span className="text-gold/40">›</span>
            <span className="text-parchment">{chapterTitle}</span>
          </nav>

          {/* 장 제목 */}
          <h1 className="text-2xl md:text-3xl font-serif text-gold mb-10 leading-snug">
            {chapterTitle}
          </h1>

          {/* 본문 */}
          <article className="space-y-4">
            {items.map((item, i) =>
              item.type === 'table'
                ? <TableBlock key={i} item={item} />
                : <Paragraph key={i} para={item} fnNums={fnNums} />
            )}
          </article>

          {/* 각주 */}
          {footnotes.length > 0 && (
            <section className="mt-16 pt-8 border-t border-gold/20">
              <h2 className="text-sm font-semibold text-gold mb-4 tracking-wide">{ui.footnotes}</h2>
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

          {/* 이전 / 다음 */}
          <nav className="mt-12 pt-6 border-t border-gold/20 flex justify-between gap-4">
            {prev ? (
              <Link href={`/${locale}/dissertation/${section}/${dissertationId}/${prev.id}`}
                className="flex-1 p-4 border border-gold/20 rounded-lg text-sm hover:border-gold/50 transition-colors bg-ink-soft">
                <span className="block text-xs text-parchment-muted mb-1">{ui.prev}</span>
                <span className="text-parchment font-medium line-clamp-1">{prev.title}</span>
              </Link>
            ) : <div />}
            {next ? (
              <Link href={`/${locale}/dissertation/${section}/${dissertationId}/${next.id}`}
                className="flex-1 p-4 border border-gold/20 rounded-lg text-sm hover:border-gold/50 transition-colors bg-ink-soft text-right">
                <span className="block text-xs text-parchment-muted mb-1">{ui.next}</span>
                <span className="text-parchment font-medium line-clamp-1">{next.title}</span>
              </Link>
            ) : <div />}
          </nav>
        </div>
      </div>
    </div>
  );
}
