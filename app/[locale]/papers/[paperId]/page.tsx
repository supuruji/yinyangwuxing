import { notFound } from 'next/navigation';
import { koJinmukWonPaper } from '@/content/papers/ko-jinmuk-won';
import { getContent } from '@/lib/content';
import PaperReader from '@/components/PaperReader';
import type { Metadata } from 'next';
import type { Paper } from '@/content/papers/types';

const PAPERS: Record<string, Paper> = {
  'jinmuk-won': koJinmukWonPaper,
};

interface Props {
  params: Promise<{ locale: string; paperId: string }>;
}

export async function generateStaticParams() {
  return ['ko', 'en', 'ja', 'zh'].flatMap((locale) =>
    Object.keys(PAPERS).map((paperId) => ({ locale, paperId }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { paperId } = await params;
  const paper = PAPERS[paperId];
  if (!paper) return {};
  return {
    title: `${paper.title} — ${paper.author}`,
    description: paper.subtitle ?? paper.venue,
  };
}

export default async function PaperPage({ params }: Props) {
  const { locale, paperId } = await params;
  const paper = PAPERS[paperId];
  if (!paper) notFound();

  const content = getContent(locale);

  return (
    <PaperReader
      paper={paper}
      backLabel={content.nav.backToTop}
      backHref={`/${locale}/papers`}
    />
  );
}
