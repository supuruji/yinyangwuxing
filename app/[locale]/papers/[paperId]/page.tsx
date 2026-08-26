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
import { koSearchForDialoguePaper } from '@/content/papers/ko-search-for-dialogue';
import { enSearchForDialoguePaper } from '@/content/papers/en-search-for-dialogue';
import { zhSearchForDialoguePaper } from '@/content/papers/zh-search-for-dialogue';
import { jaSearchForDialoguePaper } from '@/content/papers/ja-search-for-dialogue';
import { koBaekgang663Paper } from '@/content/papers/ko-baekgang-663';
import { enBaekgang663Paper } from '@/content/papers/en-baekgang-663';
import { zhBaekgang663Paper } from '@/content/papers/zh-baekgang-663';
import { jaBaekgang663Paper } from '@/content/papers/ja-baekgang-663';
import { enGeumgangsanPaper } from '@/content/papers/en-geumgangsan';
import { zhGeumgangsanPaper } from '@/content/papers/zh-geumgangsan';
import { jaGeumgangsanPaper } from '@/content/papers/ja-geumgangsan';
import { enKimJihaPaper } from '@/content/papers/en-kim-jiha';
import { zhKimJihaPaper } from '@/content/papers/zh-kim-jiha';
import { jaKimJihaPaper } from '@/content/papers/ja-kim-jiha';
import { koDangunEconomyPaper } from '@/content/papers/ko-dangun-economy';
import { enDangunEconomyPaper } from '@/content/papers/en-dangun-economy';
import { zhDangunEconomyPaper } from '@/content/papers/zh-dangun-economy';
import { jaDangunEconomyPaper } from '@/content/papers/ja-dangun-economy';
import Link from 'next/link';
import { getContent } from '@/lib/content';
import PaperReader from '@/components/PaperReader';
import PaperOutline from '@/components/PaperOutline';
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
  'search-for-dialogue': koSearchForDialoguePaper,
  'baekgang-663': koBaekgang663Paper,
  'dangun-economy': koDangunEconomyPaper,
};

// Per-locale overrides for papers that have been translated.
// Falls back to the Korean paper when no translation exists for the locale.
const PAPER_OVERRIDES: Record<string, Record<string, Paper>> = {
  en: { 'jeju-myth': enJejuMythPaper, 'search-for-dialogue': enSearchForDialoguePaper, 'baekgang-663': enBaekgang663Paper, 'geumgangsan': enGeumgangsanPaper, 'kim-jiha': enKimJihaPaper, 'dangun-economy': enDangunEconomyPaper },
  zh: { 'jeju-myth': zhJejuMythPaper, 'search-for-dialogue': zhSearchForDialoguePaper, 'baekgang-663': zhBaekgang663Paper, 'geumgangsan': zhGeumgangsanPaper, 'kim-jiha': zhKimJihaPaper, 'dangun-economy': zhDangunEconomyPaper },
  ja: { 'jeju-myth': jaJejuMythPaper, 'search-for-dialogue': jaSearchForDialoguePaper, 'baekgang-663': jaBaekgang663Paper, 'geumgangsan': jaGeumgangsanPaper, 'kim-jiha': jaKimJihaPaper, 'dangun-economy': jaDangunEconomyPaper },
};

function getPaper(locale: string, paperId: string): Paper | undefined {
  return PAPER_OVERRIDES[locale]?.[paperId] ?? PAPERS[paperId];
}

interface Props {
  params: Promise<{ locale: string; paperId: string }>;
  searchParams: Promise<{ read?: string }>;
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
    title: `${paper.title} — ${paper.author.replace(/\[fn:\d+\]/g, '')}`,
    description: paper.subtitle ?? paper.venue,
  };
}

export default async function PaperPage({ params, searchParams }: Props) {
  const { locale, paperId } = await params;
  const { read } = await searchParams;
  const paper = getPaper(locale, paperId);
  if (!paper) notFound();

  const content = getContent(locale);

  // Papers with a presentation outline show a master's-thesis-style card grid
  // as the landing page; the on-site reader opens via ?read=<chapterId>.
  if (paper.sections && paper.sections.length > 0 && !read) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <nav className="text-parchment-muted text-sm mb-8 flex items-center gap-2">
          <Link href={`/${locale}/papers`} className="hover:text-gold transition-colors">
            {content.nav.papers}
          </Link>
          <span className="text-gold/40">›</span>
          <span className="text-parchment line-clamp-1">{paper.title}</span>
        </nav>

        {paper.venue && (
          <p className="text-gold/70 text-xs uppercase tracking-widest mb-2">{paper.venue}</p>
        )}
        <h1 className="text-3xl sm:text-4xl font-serif text-gold mb-1 leading-tight">{paper.title}</h1>
        {paper.subtitle && <p className="text-parchment-muted mb-1">{paper.subtitle}</p>}
        <p className="text-parchment-muted text-sm mb-10">— {paper.author.replace(/\[fn:\d+\]/g, '')}</p>

        <PaperOutline paper={paper} locale={locale} />
      </div>
    );
  }

  return (
    <PaperReader
      paper={paper}
      backLabel={content.nav.backToTop}
      backHref={paper.sections && paper.sections.length > 0 ? `/${locale}/papers/${paperId}` : `/${locale}/papers`}
      initialChapterId={read}
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
