import { notFound } from 'next/navigation';
import Link from 'next/link';
import { koAiSurvivalBook, type Book } from '@/content/books/ko-ai-survival';
import { enAiSurvivalBook } from '@/content/books/en-ai-survival';
import { zhAiSurvivalBook } from '@/content/books/zh-ai-survival';
import { jaAiSurvivalBook } from '@/content/books/ja-ai-survival';
import { AI_SURVIVAL_OUTLINE, AI_SURVIVAL_PLAYLISTS, AI_SURVIVAL_CHANNEL, AI_SURVIVAL_OVERVIEW_IDS } from '@/content/books/ai-survival-outline';
import { JEJU_OUTLINE, JEJU_PLAYLISTS, JEJU_CHANNEL, JEJU_GROUP_LABELS, JEJU_OVERVIEW_IDS } from '@/content/books/jeju-serendipity-outline';
import { koJejuSerendipityBook } from '@/content/books/ko-jeju-serendipity';
import { enJejuSerendipityBook } from '@/content/books/en-jeju-serendipity';
import { zhJejuSerendipityBook } from '@/content/books/zh-jeju-serendipity';
import { jaJejuSerendipityBook } from '@/content/books/ja-jeju-serendipity';
import { getContent } from '@/lib/content';
import BookReader from '@/components/BookReader';
import BookOutline, { type BookOutlineCard } from '@/components/BookOutline';
import type { Metadata } from 'next';

const BOOKS_BY_LOCALE: Record<string, Record<string, Book>> = {
  ko: { 'ai-survival': koAiSurvivalBook, 'jeju-serendipity': koJejuSerendipityBook },
  en: { 'ai-survival': enAiSurvivalBook, 'jeju-serendipity': enJejuSerendipityBook },
  zh: { 'ai-survival': zhAiSurvivalBook, 'jeju-serendipity': zhJejuSerendipityBook },
  ja: { 'ai-survival': jaAiSurvivalBook, 'jeju-serendipity': jaJejuSerendipityBook },
};

// Books with a card outline (YouTube + presentation PDF). Books not listed here
// fall back to a plain cover + chapter-list landing that opens the reader.
const HAS_OUTLINE: Record<string, boolean> = { 'ai-survival': true, 'jeju-serendipity': true };

// Shared shape for a card outline item (jeju items additionally carry per-locale
// `titles`; ai-survival items pull their title from the localized Book chapter).
type OutlineItem = {
  code: string; chapter: string; group: string; pdfSlug: string;
  youtubeId?: string;                       // ai-survival: single per-section id
  youtubeIds?: Record<string, string>;      // jeju: per-locale ids
  titles?: Record<string, string>;
};

const OUTLINE_BY_BOOK: Record<string, OutlineItem[]> = {
  'ai-survival': AI_SURVIVAL_OUTLINE,
  'jeju-serendipity': JEJU_OUTLINE,
};

// Resolve the playlist/channel URL for a book+locale.
function playlistFor(bookId: string, locale: string): string {
  if (bookId === 'jeju-serendipity') return JEJU_PLAYLISTS[locale] || JEJU_CHANNEL;
  return AI_SURVIVAL_PLAYLISTS[locale] || AI_SURVIVAL_CHANNEL;
}

function getBook(locale: string, bookId: string): Book | undefined {
  return (BOOKS_BY_LOCALE[locale] ?? BOOKS_BY_LOCALE.ko)[bookId];
}

interface Props {
  params: Promise<{ locale: string; bookId: string }>;
  searchParams: Promise<{ read?: string }>;
}

export async function generateStaticParams() {
  return ['ko', 'en', 'ja', 'zh'].flatMap((locale) =>
    Object.keys(BOOKS_BY_LOCALE.ko).map((bookId) => ({ locale, bookId }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, bookId } = await params;
  const book = getBook(locale, bookId);
  if (!book) return {};
  return {
    title: `${book.title} — ${book.author}`,
    description: `${book.subtitle} · ${book.series}`,
  };
}

const OUTLINE_LABELS: Record<string, {
  watchYoutube: string; openPdf: string; readOnSite: string;
  playlist: string; fullPresentation: string; fullBook: string; intro: string;
  overview?: string;
}> = {
  ko: {
    watchYoutube: '유튜브', openPdf: '발표', readOnSite: '본문',
    playlist: '유튜브 재생목록 전체보기', fullPresentation: '발표PDF 전체보기', fullBook: '처음부터 읽기',
    overview: '개요 영상',
    intro: '유튜브 영상 · 발표 PDF · 본문 리더를 한 카드에서 열람하세요. 각 장·절이 유튜브 영상과 1:1로 연결됩니다.',
  },
  en: {
    watchYoutube: 'YouTube', openPdf: 'Slides', readOnSite: 'Read',
    playlist: 'Open full YouTube playlist', fullPresentation: 'Open full presentation PDF', fullBook: 'Read from the start',
    overview: 'Overview video',
    intro: 'Each card links to a YouTube video, a slide-deck PDF, and the on-site chapter reader. Every chapter maps one-to-one to a video.',
  },
  zh: {
    watchYoutube: 'YouTube', openPdf: '发表', readOnSite: '正文',
    playlist: 'YouTube 播放列表全览', fullPresentation: '发表PDF全览', fullBook: '从头阅读',
    overview: '概述视频',
    intro: '每张卡片链接到 YouTube 视频、发表 PDF 及站内正文阅读器。各章·节与视频一一对应。',
  },
  ja: {
    watchYoutube: 'YouTube', openPdf: '発表', readOnSite: '本文',
    playlist: 'YouTube 再生リスト全体を開く', fullPresentation: '発表PDF全体を開く', fullBook: '最初から読む',
    overview: '概要動画',
    intro: '各カードから YouTube 動画・発表 PDF・本文リーダーを開けます。各章・節が動画と 1:1 で対応します。',
  },
};

const GROUP_LABELS: Record<string, Record<string, string>> = {
  ko: { front: '머리말', part1: 'Ⅰ · 이론편: 4가지 상관적 사유', part2: 'Ⅱ · 응용편: 화쟁이론과 상생경제' },
  en: { front: 'Preface', part1: 'Ⅰ · Theory: Four Modes of Correlative Thinking', part2: 'Ⅱ · Application: Hwajaeng & Symbiotic Economy' },
  zh: { front: '前言', part1: 'Ⅰ · 理论篇：四种相关性思维', part2: 'Ⅱ · 应用篇：和诤理论与相生经济' },
  ja: { front: 'まえがき', part1: 'Ⅰ · 理論篇：四つの相関的思惟', part2: 'Ⅱ · 応用篇：和諍理論と相生経済' },
};

export default async function BookPage({ params, searchParams }: Props) {
  const { locale, bookId } = await params;
  const { read } = await searchParams;
  const book = getBook(locale, bookId);
  if (!book) notFound();

  const content = getContent(locale);
  const ui = OUTLINE_LABELS[locale] ?? OUTLINE_LABELS.en;
  const groupMap = GROUP_LABELS[locale] ?? GROUP_LABELS.en;

  // Reader view (a chapter is being read)
  if (read) {
    return (
      <BookReader
        book={book}
        locale={locale}
        backLabel={content.nav.backToTop}
        backHref={`/${locale}/books/${bookId}`}
        initialChapterId={read}
      />
    );
  }

  // Plain landing view for books without a card outline (no YouTube / slides):
  // cover + grouped chapter list that opens the on-site reader.
  if (!HAS_OUTLINE[bookId]) {
    const contentsLabel = { ko: '목차', en: 'Contents', zh: '目录', ja: '目次' }[locale] ?? 'Contents';
    const firstId = book.chapters[0]?.id ?? '';
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <nav className="text-parchment-muted text-sm mb-6 flex items-center gap-2">
          <Link href={`/${locale}/books`} className="hover:text-gold transition-colors">
            {content.nav.books}
          </Link>
          <span className="text-gold/40">›</span>
          <span className="text-parchment">{book.title}</span>
        </nav>

        <div className="border border-gold/30 rounded-lg p-8 md:p-10 bg-ink-card mb-8 text-center">
          <p className="text-gold/60 text-xs uppercase tracking-widest mb-3">{book.series}</p>
          <h1 className="text-2xl sm:text-3xl font-serif text-gold mb-2 leading-snug">{book.title}</h1>
          <p className="text-parchment-muted font-serif mb-5">{book.subtitle}</p>
          <p className="text-parchment text-sm">{book.author}</p>
          <p className="text-parchment-muted text-sm">{book.publisher} · {book.year}</p>
        </div>

        <div className="text-center mb-10">
          <Link
            href={`/${locale}/books/${bookId}?read=${firstId}`}
            className="inline-block px-8 py-3 bg-gold text-ink font-semibold rounded-lg hover:bg-gold-light transition-colors text-sm tracking-wide"
          >
            {ui.fullBook}
          </Link>
        </div>

        <h2 className="text-gold/70 text-xs uppercase tracking-widest mb-3">{contentsLabel}</h2>
        <ul className="divide-y divide-gold/10 border-y border-gold/10">
          {book.chapters.map((c, i) => {
            const showPart = c.part && (i === 0 || book.chapters[i - 1].part !== c.part);
            return (
              <li key={c.id}>
                {showPart && (
                  <p className="text-gold/50 text-[0.7rem] uppercase tracking-widest pt-4 pb-1">{c.part}</p>
                )}
                <Link
                  href={`/${locale}/books/${bookId}?read=${c.id}`}
                  className="block py-3 text-parchment hover:text-gold transition-colors text-sm leading-snug"
                >
                  {c.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  // Card landing view
  const outline = OUTLINE_BY_BOOK[bookId] ?? AI_SURVIVAL_OUTLINE;
  const playlist = playlistFor(bookId, locale);
  const outlineGroupMap =
    bookId === 'jeju-serendipity'
      ? (JEJU_GROUP_LABELS[locale] ?? JEJU_GROUP_LABELS.en)
      : groupMap;
  const firstChapterId = book.chapters[0]?.id ?? '';
  const listId = playlist.split('list=')[1] ?? '';
  const overviewId =
    bookId === 'jeju-serendipity'
      ? (JEJU_OVERVIEW_IDS[locale] ?? '')
      : bookId === 'ai-survival'
        ? (AI_SURVIVAL_OVERVIEW_IDS[locale] ?? '')
        : '';
  const overviewUrl = overviewId
    ? `https://www.youtube.com/watch?v=${overviewId}${listId ? `&list=${listId}` : ''}`
    : '';
  const titleById = new Map(book.chapters.map((c) => [c.id, c.title]));
  const cards: BookOutlineCard[] = outline.map((it) => {
    const vid = it.youtubeIds?.[locale] ?? it.youtubeId ?? '';
    return {
      code: it.code,
      title: it.titles?.[locale] ?? titleById.get(it.chapter) ?? it.chapter,
      chapter: it.chapter,
      group: it.group,
      youtubeUrl: vid
        ? `https://www.youtube.com/watch?v=${vid}&list=${playlist.split('list=')[1] ?? ''}`
        : playlist,
      pdfPath: `/pdf/books/${bookId}/${locale}/${it.pdfSlug}.pdf`,
    };
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <nav className="text-parchment-muted text-sm mb-6 flex items-center gap-2">
        <Link href={`/${locale}/books`} className="hover:text-gold transition-colors">
          {content.nav.books}
        </Link>
        <span className="text-gold/40">›</span>
        <span className="text-parchment">{book.title}</span>
      </nav>

      <p className="text-gold/70 text-xs uppercase tracking-widest mb-2">{book.series}</p>
      <h1 className="text-3xl sm:text-4xl font-serif text-gold mb-2 leading-snug">{book.title}</h1>
      <p className="text-parchment-muted text-sm mb-1">{book.subtitle}</p>
      <p className="text-parchment-muted text-sm mb-6">{book.author} · {book.publisher} · {book.year}</p>
      <p className="text-parchment-muted text-sm mb-8 max-w-3xl leading-relaxed">{ui.intro}</p>

      <BookOutline
        locale={locale}
        bookId={bookId}
        cards={cards}
        playlistUrl={playlist}
        overviewUrl={overviewUrl}
        fullPresentationUrl={`/pdf/books/${bookId}/${locale}/presentation.pdf`}
        fullBookUrl={`/${locale}/books/${bookId}?read=${firstChapterId}`}
        labels={ui}
        groupLabel={(g) => outlineGroupMap[g] ?? g}
      />
    </div>
  );
}
