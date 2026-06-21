import { notFound } from 'next/navigation';
import { readFileSync } from 'fs';
import { join } from 'path';
import DissertationChapter from '@/components/DissertationChapter';

interface Props {
  params: Promise<{ locale: string; dissertationId: string; chapterId: string }>;
}

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
    { dissertationId: 'donghak-daesoon-ko', locales: ['ko', 'ja'] },
    { dissertationId: 'donghak-daesoon-zh', locales: ['zh'] },
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
    />
  );
}
