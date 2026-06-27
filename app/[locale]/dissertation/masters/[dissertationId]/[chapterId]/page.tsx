import { notFound } from 'next/navigation';
import { readFileSync } from 'fs';
import { join } from 'path';
import DissertationChapter from '@/components/DissertationChapter';

interface Props {
  params: Promise<{ locale: string; dissertationId: string; chapterId: string }>;
}

const SHORT: Record<string, string> = {
  ko: '대순 순환경제관', en: 'Cyclic Economics', zh: '循环经济观', ja: '循環的経済観',
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
    { dissertationId: 'daesoon-economics-ko', locales: ['ko'] },
    { dissertationId: 'daesoon-economics-zh', locales: ['zh'] },
    { dissertationId: 'daesoon-economics-ja', locales: ['ja'] },
    { dissertationId: 'daesoon-economics-en', locales: ['en'] },
  ];
  const chapterIds = ['abstract', 'intro', 'ch2', 'ch3', 'ch4', 'conclusion', 'references'];
  return dissertations.flatMap(({ dissertationId, locales }) =>
    locales.flatMap(locale =>
      chapterIds.map(chapterId => ({ locale, dissertationId, chapterId }))
    )
  );
}

export default async function MastersChapterPage({ params }: Props) {
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
      section="masters"
      dissertationShort={SHORT[locale] ?? meta.title}
    />
  );
}
