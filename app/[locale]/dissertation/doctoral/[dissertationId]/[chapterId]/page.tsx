import { notFound } from 'next/navigation';
import { readFileSync } from 'fs';
import { join } from 'path';
import DissertationChapter from '@/components/DissertationChapter';

interface Props {
  params: Promise<{ locale: string; dissertationId: string; chapterId: string }>;
}

const RESOURCES: Record<string, { downloads?: { label: string; href: string }[]; youtubeUrl?: string }> = {
  'donghak-daesoon-ko': {
    downloads: [
      { label: 'PDF 다운로드', href: '/dissertation/donghak-daesoon-ko.pdf' },
      { label: '요약 PPT 다운로드', href: '/dissertation/donghak-daesoon-ko-summary.pdf' },
    ],
    youtubeUrl: 'https://www.youtube.com/playlist?list=PLw9IxWay4JN-f_AEhSlun0hBRifiMVfV2',
  },
};

function loadMeta(dissertationId: string) {
  try {
    const p = join(process.cwd(), 'content', 'dissertation', dissertationId, 'metadata.json');
    return JSON.parse(readFileSync(p, 'utf-8'));
  } catch { return null; }
}

function loadChapter(dissertationId: string, chapterId: string) {
  try {
    const p = join(process.cwd(), 'content', 'dissertation', dissertationId, `${chapterId}.json`);
    return JSON.parse(readFileSync(p, 'utf-8'));
  } catch { return null; }
}

export async function generateStaticParams() {
  const dissertations = [
    { dissertationId: 'donghak-daesoon-ko', locales: ['ko'] },
    { dissertationId: 'donghak-daesoon-zh', locales: ['zh'] },
    { dissertationId: 'donghak-daesoon-ja', locales: ['ja'] },
    { dissertationId: 'donghak-daesoon-en', locales: ['en'] },
  ];
  const chapterIds = ['intro', 'ch2', 'ch3', 'ch4', 'ch5', 'conclusion', 'references'];
  return dissertations.flatMap(({ dissertationId, locales }) =>
    locales.flatMap(locale =>
      chapterIds.map(chapterId => ({ locale, dissertationId, chapterId }))
    )
  );
}

export default async function ChapterPage({ params }: Props) {
  const { locale, dissertationId, chapterId } = await params;
  const meta = loadMeta(dissertationId);
  const chapter = loadChapter(dissertationId, chapterId);
  if (!meta || !chapter) notFound();

  const res = RESOURCES[dissertationId];

  return (
    <DissertationChapter
      chapterId={chapterId}
      chapterTitle={chapter.title}
      items={chapter.items ?? []}
      footnotes={chapter.footnotes}
      headings={chapter.headings ?? []}
      locale={locale}
      dissertationId={dissertationId}
      allChapters={meta.chapters}
      downloads={res?.downloads}
      youtubeUrl={res?.youtubeUrl}
    />
  );
}
