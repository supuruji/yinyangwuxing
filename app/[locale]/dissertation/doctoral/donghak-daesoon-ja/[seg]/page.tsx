import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getJaIndex, getJaSegment, JA_TOTAL } from '@/lib/dissertationJa';

interface Props {
  params: Promise<{ locale: string; seg: string }>;
}

export function generateStaticParams() {
  return Array.from({ length: JA_TOTAL }, (_, i) => ({ seg: String(i) }));
}

type Block = { type: 'h' | 'p'; text: string };

function isHeading(line: string): boolean {
  if (line.length > 34) return false;
  if (/[。！？.]$/.test(line)) return false;
  if (/[。！？]/.test(line)) return false;
  if (
    /^(第[一二三四五六七八九十]+章|[0-9]+[.\.、]|[一二三四五六七八九十]+、|[（(][甲乙丙丁戊己庚辛][)）])/.test(
      line
    )
  )
    return true;
  if (line.length <= 24 && !/[、：]/.test(line)) return true;
  return false;
}

function formatContent(raw: string): Block[] {
  const lines = raw.split('\n');
  const blocks: Block[] = [];
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    if (!t) continue;
    if (isHeading(t) || (i === 0 && t.length <= 40)) {
      blocks.push({ type: 'h', text: t });
    } else {
      blocks.push({ type: 'p', text: t });
    }
  }
  return blocks;
}

export default async function SegmentPage({ params }: Props) {
  const { locale, seg } = await params;
  const id = parseInt(seg, 10);
  if (Number.isNaN(id) || id < 0 || id >= JA_TOTAL) notFound();

  const segment = getJaSegment(id);
  const index = getJaIndex();
  const base = `/${locale}/dissertation/doctoral/donghak-daesoon-ja`;
  const prevId = id > 0 ? id - 1 : null;
  const nextId = id < JA_TOTAL - 1 ? id + 1 : null;
  const blocks = formatContent(segment.content);
  const isChapter = segment.type === 'chapter';

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Top nav */}
      <div className="flex items-center justify-between mb-8 text-sm">
        <Link href={base} className="text-gold/70 hover:text-gold transition-colors">
          ← 目次
        </Link>
        <div className="flex gap-3">
          {prevId !== null && (
            <Link href={`${base}/${prevId}`} className="text-parchment-muted hover:text-gold transition-colors">
              前の節
            </Link>
          )}
          {nextId !== null && (
            <Link href={`${base}/${nextId}`} className="text-parchment-muted hover:text-gold transition-colors">
              次の節
            </Link>
          )}
        </div>
      </div>

      {/* Header */}
      {isChapter && (
        <p className="text-gold/60 text-xs uppercase tracking-widest mb-2">第 {segment.number} 章</p>
      )}
      <h1 className="text-2xl font-serif text-gold mb-2 leading-snug">{segment.title}</h1>
      <div className="h-px bg-gold/20 my-6" />

      {/* Body */}
      <article className="space-y-4">
        {blocks.map((b, i) =>
          b.type === 'h' ? (
            <h2
              key={i}
              className="text-lg font-serif text-parchment font-semibold mt-8 mb-2 leading-snug"
            >
              {b.text}
            </h2>
          ) : (
            <p
              key={i}
              className="text-parchment/90 leading-[1.9] text-[0.95rem]"
              style={{ textAlign: 'justify' }}
            >
              {b.text}
            </p>
          )
        )}
      </article>

      {/* Bottom nav */}
      <div className="flex items-center justify-between mt-12 pt-6 border-t border-gold/20 text-sm">
        <div>
          {prevId !== null && (
            <Link href={`${base}/${prevId}`} className="text-gold/80 hover:text-gold transition-colors font-semibold">
              ← {index[prevId].title}
            </Link>
          )}
        </div>
        <div className="text-right">
          {nextId !== null && (
            <Link href={`${base}/${nextId}`} className="text-gold/80 hover:text-gold transition-colors font-semibold">
              {index[nextId].title} →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
