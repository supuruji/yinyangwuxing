import Link from 'next/link';
import { readFileSync } from 'fs';
import { join } from 'path';
import ContentCard from '@/components/ContentCard';
import DoctoralOutline, { type OutlineItem } from '@/components/DoctoralOutline';
import { getContent } from '@/lib/content';

interface Props {
  params: Promise<{ locale: string }>;
}

interface OutlineData {
  items: OutlineItem[];
  totalPages: number;
  playlistUrl: string;
}

// Map locale to the dissertationId that hosts the outline.json (only ko for now).
const OUTLINE_BY_LOCALE: Record<string, string> = {
  ko: 'donghak-daesoon-ko',
};

function loadOutline(locale: string): { dissertationId: string; data: OutlineData } | null {
  const dissertationId = OUTLINE_BY_LOCALE[locale];
  if (!dissertationId) return null;
  try {
    const p = join(process.cwd(), 'content', 'dissertation', dissertationId, 'outline.json');
    const data = JSON.parse(readFileSync(p, 'utf-8')) as OutlineData;
    return { dissertationId, data };
  } catch {
    return null;
  }
}

const OUTLINE_LABELS: Record<string, {
  watchYoutube: string;
  openPdf: string;
  readOnSite: string;
  pageRange: (a: number, b: number) => string;
  playlist: string;
  fullPresentation: string;
  fullDissertation: string;
  intro: string;
}> = {
  ko: {
    watchYoutube: '유튜브',
    openPdf: 'PDF',
    readOnSite: '본문',
    pageRange: (a, b) => `pp. ${a}–${b}`,
    playlist: '유튜브 재생목록 전체보기',
    fullPresentation: '발표PDF 전체보기',
    fullDissertation: '논문 전체보기',
    intro: '유튜브 재생목록 · PDF 절별 파일 · 본문 리더를 한 카드에서 열람하세요.',
  },
  en: {
    watchYoutube: 'YouTube',
    openPdf: 'PDF',
    readOnSite: 'Read',
    pageRange: (a, b) => `pp. ${a}–${b}`,
    playlist: 'Open full YouTube playlist',
    fullPresentation: 'Open full presentation PDF',
    fullDissertation: 'Open full dissertation',
    intro: 'Each card links to a YouTube video, a PDF section, and the on-site chapter reader.',
  },
  zh: {
    watchYoutube: 'YouTube',
    openPdf: 'PDF',
    readOnSite: '正文',
    pageRange: (a, b) => `pp. ${a}–${b}`,
    playlist: '打开完整 YouTube 播放列表',
    fullPresentation: '打开完整发表 PDF',
    fullDissertation: '打开完整论文',
    intro: '每张卡片链接到 YouTube 视频、PDF 分节和站内正文阅读器。',
  },
  ja: {
    watchYoutube: 'YouTube',
    openPdf: 'PDF',
    readOnSite: '本文',
    pageRange: (a, b) => `pp. ${a}–${b}`,
    playlist: 'YouTube プレイリスト全体を開く',
    fullPresentation: '発表 PDF 全体を開く',
    fullDissertation: '論文全体を開く',
    intro: '各カードから YouTube 動画・PDF 節・本文リーダーを開けます。',
  },
};

const FULL_PRESENTATION_URL = '/dissertation/donghak-daesoon-ko-presentation.pdf';
const FULL_DISSERTATION_URL = '/dissertation/donghak-daesoon-ko.pdf';

export default async function DoctoralPage({ params }: Props) {
  const { locale } = await params;
  const content = getContent(locale);
  const outline = loadOutline(locale);
  const labels = OUTLINE_LABELS[locale] ?? OUTLINE_LABELS.en;

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <nav className="text-parchment-muted text-sm mb-8 flex items-center gap-2">
        <Link href={`/${locale}/dissertation`} className="hover:text-gold transition-colors">
          {content.nav.dissertation}
        </Link>
        <span className="text-gold/40">›</span>
        <span className="text-parchment">{content.nav.doctoral}</span>
      </nav>

      <h1 className="text-4xl font-serif text-gold mb-4">{content.nav.doctoral}</h1>

      {outline ? (
        <>
          <p className="text-parchment-muted text-sm mb-8 max-w-3xl leading-relaxed">
            {labels.intro}
          </p>
          <DoctoralOutline
            locale={locale}
            dissertationId={outline.dissertationId}
            items={outline.data.items}
            playlistUrl={outline.data.playlistUrl}
            fullPresentationUrl={FULL_PRESENTATION_URL}
            fullDissertationUrl={FULL_DISSERTATION_URL}
            labels={labels}
          />
        </>
      ) : (
        <div className="space-y-6 mt-6">
          {content.dissertation.doctoral.map((item) => (
            <ContentCard
              key={item.id}
              item={item}
              youtubeLabel={content.nav.visitYoutube}
              websiteLabel={content.nav.visitWebsite}
              comingSoonLabel={content.nav.comingSoon}
            />
          ))}
        </div>
      )}
    </div>
  );
}
