import Link from 'next/link';
import type { Paper, PaperSection } from '@/content/papers/types';

interface OutlineLabels {
  intro: string;
  watchYoutube: string;
  openPdf: string;
  readOnSite: string;
  playlist: string;
  fullPresentation: string;
  pageRange: (a: number, b: number) => string;
}

const LABELS: Record<string, OutlineLabels> = {
  ko: {
    intro: '유튜브 영상 · 발표 PDF(절별) · 본문 리더를 한 카드에서 열람하세요. 각 장·절이 유튜브 영상과 1:1로 연결됩니다.',
    watchYoutube: '유튜브',
    openPdf: '발표',
    readOnSite: '본문',
    playlist: '유튜브 재생목록 전체보기',
    fullPresentation: '발표PDF 전체보기',
    pageRange: (a, b) => `p. ${a}–${b}`,
  },
  en: {
    intro: 'Each card links to a YouTube video, a slide-section PDF, and the on-site reader. Every section maps one-to-one to a video.',
    watchYoutube: 'YouTube',
    openPdf: 'Slides',
    readOnSite: 'Read',
    playlist: 'Open full YouTube playlist',
    fullPresentation: 'Open full presentation PDF',
    pageRange: (a, b) => `p. ${a}–${b}`,
  },
  zh: {
    intro: '每张卡片链接到 YouTube 视频、发表 PDF（分节）及站内正文阅读器。每个章·节与视频一一对应。',
    watchYoutube: 'YouTube',
    openPdf: '发表',
    readOnSite: '正文',
    playlist: 'YouTube 播放列表全览',
    fullPresentation: '发表PDF全览',
    pageRange: (a, b) => `p. ${a}–${b}`,
  },
  ja: {
    intro: '各カードから YouTube 動画・発表 PDF（節別）・本文リーダーを開けます。各章・節が動画と 1:1 で対応します。',
    watchYoutube: 'YouTube',
    openPdf: '発表',
    readOnSite: '本文',
    playlist: 'YouTube 再生リスト全体を開く',
    fullPresentation: '発表PDF全体を開く',
    pageRange: (a, b) => `p. ${a}–${b}`,
  },
};

interface Props {
  paper: Paper;
  locale: string;
}

export default function PaperOutline({ paper, locale }: Props) {
  const labels = LABELS[locale] ?? LABELS.en;
  const sections = paper.sections ?? [];
  const playlistUrl = paper.youtubeUrl;
  const fullPresentationUrl = `/pdf/papers/${paper.id}/${locale}/presentation.pdf`;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3">
        {playlistUrl ? (
          <a
            href={playlistUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-crimson/80 hover:bg-crimson text-parchment text-sm rounded transition-colors"
          >
            <YoutubeIcon />
            {labels.playlist}
          </a>
        ) : null}
        <a
          href={fullPresentationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 border border-gold/50 hover:border-gold hover:bg-gold/10 text-parchment text-sm rounded transition-colors"
        >
          <PdfIcon />
          {labels.fullPresentation}
        </a>
      </div>

      <p className="text-parchment-muted text-sm max-w-3xl leading-relaxed">{labels.intro}</p>

      <div className="grid gap-2">
        {sections.map((section) => (
          <OutlineCard key={section.chapter} section={section} paper={paper} locale={locale} labels={labels} />
        ))}
      </div>
    </div>
  );
}

function OutlineCard({
  section,
  paper,
  locale,
  labels,
}: {
  section: PaperSection;
  paper: Paper;
  locale: string;
  labels: OutlineLabels;
}) {
  // When a section has no dedicated video id yet, fall back to the paper's
  // playlist/channel URL so the button still leads somewhere useful.
  const youtubeUrl = section.youtubeId
    ? `https://www.youtube.com/watch?v=${section.youtubeId}${
        paper.youtubeUrl?.includes('list=')
          ? '&list=' + paper.youtubeUrl.split('list=')[1].split('&')[0]
          : ''
      }`
    : paper.youtubeUrl ?? '#';
  const pdfPath = `/pdf/papers/${paper.id}/${locale}/${section.pdfSlug}.pdf`;
  const readHref = `/${locale}/papers/${paper.id}?read=${section.chapter}`;

  return (
    <div className="rounded-md border border-gold/50 bg-ink-card px-3 py-3 sm:px-4 sm:py-4 hover:border-gold/70 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-gold/70 font-serif text-sm shrink-0">{section.code}</span>
            <h3 className="text-parchment font-serif leading-snug text-lg sm:text-xl">{section.title}</h3>
          </div>
          <p className="mt-1 text-[11px] text-parchment-muted pl-6">
            {labels.pageRange(section.pageStart, section.pageEnd)}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5 shrink-0">
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-crimson/80 hover:bg-crimson text-parchment text-xs rounded transition-colors"
            title={labels.watchYoutube}
          >
            <YoutubeIcon />
            <span className="hidden sm:inline">{labels.watchYoutube}</span>
          </a>
          <a
            href={pdfPath}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-gold/50 hover:border-gold hover:bg-gold/10 text-parchment text-xs rounded transition-colors"
            title={labels.openPdf}
          >
            <PdfIcon />
            <span className="hidden sm:inline">{labels.openPdf}</span>
          </a>
          <Link
            href={readHref}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-gold/50 hover:border-gold hover:bg-gold/10 text-parchment text-xs rounded transition-colors"
            title={labels.readOnSite}
          >
            <BookIcon />
            <span className="hidden sm:inline">{labels.readOnSite}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function YoutubeIcon() {
  return (
    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function PdfIcon() {
  return (
    <svg className="w-3.5 h-3.5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg className="w-3.5 h-3.5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}
