import { notFound } from 'next/navigation';
import Link from 'next/link';
import { koAiSurvivalBook, type Book } from '@/content/books/ko-ai-survival';
import { enAiSurvivalBook } from '@/content/books/en-ai-survival';
import { zhAiSurvivalBook } from '@/content/books/zh-ai-survival';
import { jaAiSurvivalBook } from '@/content/books/ja-ai-survival';
import { AI_SURVIVAL_OUTLINE, AI_SURVIVAL_PLAYLIST } from '@/content/books/ai-survival-outline';
import { getContent } from '@/lib/content';
import BookReader from '@/components/BookReader';
import BookOutline, { type BookOutlineCard } from '@/components/BookOutline';
import type { Metadata } from 'next';

const BOOKS_BY_LOCALE: Record<string, Record<string, Book>> = {
  ko: { 'ai-survival': koAiSurvivalBook },
  en: { 'ai-survival': enAiSurvivalBook },
  zh: { 'ai-survival': zhAiSurvivalBook },
  ja: { 'ai-survival': jaAiSurvivalBook },
};

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
}> = {
  ko: {
    watchYoutube: '유튜브', openPdf: '발표', readOnSite: '본문',
    playlist: '유튜브 재생목록 전체보기', fullPresentation: '발표PDF 전체보기', fullBook: '처음부터 읽기',
    intro: '유튜브 영상 · 발표 PDF · 본문 리더를 한 카드에서 열람하세요. 각 장·절이 유튜브 영상과 1:1로 연결됩니다.',
  },
  en: {
    watchYoutube: 'YouTube', openPdf: 'Slides', readOnSite: 'Read',
    playlist: 'Open full YouTube playlist', fullPresentation: 'Open full presentation PDF', fullBook: 'Read from the start',
    intro: 'Each card links to a YouTube video, a slide-deck PDF, and the on-site chapter reader. Every chapter maps one-to-one to a video.',
  },
  zh: {
    watchYoutube: 'YouTube', openPdf: '发表', readOnSite: '正文',
    playlist: 'YouTube 播放列表全览', fullPresentation: '发表PDF全览', fullBook: '从头阅读',
    intro: '每张卡片链接到 YouTube 视频、发表 PDF 及站内正文阅读器。各章·节与视频一一对应。',
  },
  ja: {
    watchYoutube: 'YouTube', openPdf: '発表', readOnSite: '本文',
    playlist: 'YouTube 再生リスト全体を開く', fullPresentation: '発表PDF全体を開く', fullBook: '最初から読む',
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

  // Card landing view
  const titleById = new Map(book.chapters.map((c) => [c.id, c.title]));
  const cards: BookOutlineCard[] = AI_SURVIVAL_OUTLINE.map((it) => ({
    code: it.code,
    title: titleById.get(it.chapter) ?? it.chapter,
    chapter: it.chapter,
    group: it.group,
    youtubeUrl: it.youtubeId
      ? `https://www.youtube.com/watch?v=${it.youtubeId}&list=${AI_SURVIVAL_PLAYLIST.split('list=')[1] ?? ''}`
      : AI_SURVIVAL_PLAYLIST,
    pdfPath: `/pdf/books/${bookId}/${locale}/${it.pdfSlug}.pdf`,
  }));

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
        playlistUrl={AI_SURVIVAL_PLAYLIST}
        fullPresentationUrl={`/pdf/books/${bookId}/${locale}/presentation.pdf`}
        fullBookUrl={`/${locale}/books/${bookId}?read=preface`}
        labels={ui}
        groupLabel={(g) => groupMap[g] ?? g}
      />
    </div>
  );
}
