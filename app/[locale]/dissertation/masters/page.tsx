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

// Map locale to the dissertationId that hosts the master's outline.json.
const OUTLINE_BY_LOCALE: Record<string, string> = {
  ko: 'daesoon-economics-ko',
};

// Map locale to the full-PDF / presentation URLs used by the top-level buttons.
const FULL_URLS_BY_LOCALE: Record<string, { presentation: string; dissertation: string }> = {
  ko: {
    presentation: '/dissertation/daesoon-economics-ko-presentation.pdf',
    dissertation: '/dissertation/daesoon-economics-ko.pdf',
  },
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
  openDissertationPdf: string;
  readOnSite: string;
  pageRange: (a: number, b: number) => string;
  playlist: string;
  fullPresentation: string;
  fullDissertation: string;
  intro: string;
}> = {
  ko: {
    watchYoutube: '유튜브',
    openPdf: '발표',
    openDissertationPdf: '논문',
    readOnSite: '본문',
    pageRange: (a, b) => `p. ${a}–${b}`,
    playlist: '유튜브 재생목록 전체보기',
    fullPresentation: '발표PDF 전체보기',
    fullDissertation: '논문 전체보기',
    intro: '유튜브 재생목록 · 발표PDF 절별 파일 · 본문 리더를 한 카드에서 열람하세요. 23개 장·절이 유튜브 영상과 1:1로 연결됩니다.',
  },
  en: {
    watchYoutube: 'YouTube',
    openPdf: 'Slides',
    openDissertationPdf: 'Paper',
    readOnSite: 'Read',
    pageRange: (a, b) => `p. ${a}–${b}`,
    playlist: 'Open full YouTube playlist',
    fullPresentation: 'Open full presentation PDF',
    fullDissertation: 'Open full paper',
    intro: 'Each card links to a YouTube video, a slide section PDF, and the on-site chapter reader. 23 sections map one-to-one to the videos.',
  },
  zh: {
    watchYoutube: 'YouTube',
    openPdf: '发表',
    openDissertationPdf: '论文',
    readOnSite: '正文',
    pageRange: (a, b) => `p. ${a}–${b}`,
    playlist: 'YouTube 播放列表全览',
    fullPresentation: '发表PDF全览',
    fullDissertation: '论文全览',
    intro: '每张卡片链接到 YouTube 视频、发表 PDF 分节及站内正文阅读器。23 个章·节与视频一一对应。',
  },
  ja: {
    watchYoutube: 'YouTube',
    openPdf: '発表',
    openDissertationPdf: '論文',
    readOnSite: '本文',
    pageRange: (a, b) => `p. ${a}–${b}`,
    playlist: 'YouTube 再生リスト全体を開く',
    fullPresentation: '発表PDF全体を開く',
    fullDissertation: '論文全体を開く',
    intro: '各カードから YouTube 動画・発表 PDF 節・本文リーダーを開けます。23 の章・節が動画と 1:1 で対応します。',
  },
};

// Chapter-group header labels for the master's thesis (5 chapters + abstract).
const GROUP_LABELS: Record<string, Record<string, string>> = {
  ko: { abstract: '국문초록', intro: 'Ⅰ · 들어가는 말', ch2: 'Ⅱ · 제 종교의 경제관', ch3: 'Ⅲ · 종지의 순환적 경제관', ch4: 'Ⅳ · 순환적 경제관의 가치', conclusion: 'Ⅴ · 맺는 말' },
  en: { abstract: 'Abstract', intro: 'Ⅰ · Introduction', ch2: 'Ⅱ · Religions & Economics', ch3: 'Ⅲ · Cyclic View in the Tenets', ch4: 'Ⅳ · Value', conclusion: 'Ⅴ · Conclusion' },
  zh: { abstract: '摘要', intro: 'Ⅰ · 引言', ch2: 'Ⅱ · 诸宗教经济观', ch3: 'Ⅲ · 宗旨的循环经济观', ch4: 'Ⅳ · 价值', conclusion: 'Ⅴ · 结语' },
  ja: { abstract: '要旨', intro: 'Ⅰ · 序論', ch2: 'Ⅱ · 諸宗教の経済観', ch3: 'Ⅲ · 宗旨の循環的経済観', ch4: 'Ⅳ · 価値', conclusion: 'Ⅴ · 結び' },
};

export default async function MastersPage({ params }: Props) {
  const { locale } = await params;
  const content = getContent(locale);
  const outline = loadOutline(locale);
  const labels = OUTLINE_LABELS[locale] ?? OUTLINE_LABELS.en;
  const fullUrls = FULL_URLS_BY_LOCALE[locale] ?? FULL_URLS_BY_LOCALE.ko;
  const groupMap = GROUP_LABELS[locale] ?? GROUP_LABELS.en;

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <nav className="text-parchment-muted text-sm mb-8 flex items-center gap-2">
        <Link href={`/${locale}/dissertation`} className="hover:text-gold transition-colors">
          {content.nav.dissertation}
        </Link>
        <span className="text-gold/40">›</span>
        <span className="text-parchment">{content.nav.masters}</span>
      </nav>

      <h1 className="text-4xl font-serif text-gold mb-4">{content.nav.masters}</h1>

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
            fullPresentationUrl={fullUrls.presentation}
            fullDissertationUrl={fullUrls.dissertation}
            labels={labels}
            basePath="masters"
            groupLabel={(chapter) => groupMap[chapter] ?? chapter}
          />
        </>
      ) : (
        <div className="space-y-6 mt-6">
          {content.dissertation.masters.map((item) => (
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
