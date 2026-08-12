import { notFound } from 'next/navigation';
import { koJinmukWonPaper } from '@/content/papers/ko-jinmuk-won';
import { koSamgangOryunPaper } from '@/content/papers/ko-samgang-oryun';
import { koGeumgangsanPaper } from '@/content/papers/ko-geumgangsan';
import { koPostcoronaPaper } from '@/content/papers/ko-postcorona';
import { koTaejoPaper } from '@/content/papers/ko-taejo';
import { koKimJihaPaper } from '@/content/papers/ko-kim-jiha';
import { koLiminalityPaper } from '@/content/papers/ko-liminality';
import { koJejuMythPaper } from '@/content/papers/ko-jeju-myth';
import { enJejuMythPaper } from '@/content/papers/en-jeju-myth';
import { zhJejuMythPaper } from '@/content/papers/zh-jeju-myth';
import { jaJejuMythPaper } from '@/content/papers/ja-jeju-myth';
import { koJejuArchetypePaper } from '@/content/papers/ko-jeju-archetype';
import { koKungfuPandaPaper } from '@/content/papers/ko-kungfu-panda';
import { getContent } from '@/lib/content';
import PaperReader from '@/components/PaperReader';
import type { Metadata } from 'next';
import type { Paper } from '@/content/papers/types';

const PAPERS: Record<string, Paper> = {
  'jinmuk-won': koJinmukWonPaper,
  'samgang-oryun': koSamgangOryunPaper,
  'geumgangsan': koGeumgangsanPaper,
  'postcorona': koPostcoronaPaper,
  'taejo': koTaejoPaper,
  'kim-jiha': koKimJihaPaper,
  'liminality': koLiminalityPaper,
  'jeju-myth': koJejuMythPaper,
  'jeju-archetype': koJejuArchetypePaper,
  'kungfu-panda': koKungfuPandaPaper,
};

// Per-locale overrides for papers that have been translated.
// Falls back to the Korean paper when no translation exists for the locale.
const PAPER_OVERRIDES: Record<string, Record<string, Paper>> = {
  en: { 'jeju-myth': enJejuMythPaper },
  zh: { 'jeju-myth': zhJejuMythPaper },
  ja: { 'jeju-myth': jaJejuMythPaper },
};

function getPaper(locale: string, paperId: string): Paper | undefined {
  return PAPER_OVERRIDES[locale]?.[paperId] ?? PAPERS[paperId];
}

interface Props {
  params: Promise<{ locale: string; paperId: string }>;
}

export async function generateStaticParams() {
  return ['ko', 'en', 'ja', 'zh'].flatMap((locale) =>
    Object.keys(PAPERS).map((paperId) => ({ locale, paperId }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, paperId } = await params;
  const paper = getPaper(locale, paperId);
  if (!paper) return {};
  return {
    title: `${paper.title} — ${paper.author}`,
    description: paper.subtitle ?? paper.venue,
  };
}

export default async function PaperPage({ params }: Props) {
  const { locale, paperId } = await params;
  const paper = getPaper(locale, paperId);
  if (!paper) notFound();

  const content = getContent(locale);

  return (
    <PaperReader
      paper={paper}
      backLabel={content.nav.backToTop}
      backHref={`/${locale}/papers`}
      labels={{
        downloads: content.nav.readerDownloads,
        youtube: content.nav.readerYoutube,
        prev: content.nav.readerPrev,
        next: content.nav.readerNext,
        openToc: content.nav.readerToc,
      }}
    />
  );
}
