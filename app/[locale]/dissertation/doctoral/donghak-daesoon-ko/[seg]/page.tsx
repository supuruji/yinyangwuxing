import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getKoIndex, getKoSegment, KO_TOTAL } from '@/lib/dissertationKo';

interface Props {
  params: Promise<{ locale: string; seg: string }>;
}

export function generateStaticParams() {
  return Array.from({ length: KO_TOTAL }, (_, i) => ({ seg: String(i) }));
}

type Block = { type: 'h' | 'p' | 'q'; text: string };

function isHeading(line: string): boolean {
  if (line.length > 40) return false;
  if (/^[『「]/.test(line)) return false;
  if (/[다\.。]$/.test(line) && line.length > 20) return false;
  if (
    /^(제[일이삼사오육칠팔구십一二三四五六七八九十]+장|[IVXLCDM]+\.|[0-9]+\.|가\.|나\.|다\.|라\.|마\.)/.test(line)
  )
    return true;
  if (line.length <= 30 && !/[,]/.test(line)) return true;
  return false;
}

function formatContent(raw: string): Block[] {
  const lines = raw.split('\n');
  const blocks: Block[] = [];
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    if (!t) continue;
    if (t.startsWith('[QUOTE]')) {
      blocks.push({ type: 'q', text: t.slice(7).trim() });
    } else if (isHeading(t) || (i === 0 && t.length <= 50)) {
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
  if (Number.isNaN(id) || id < 0 || id >= KO_TOTAL) notFound();

  const segment = getKoSegment(id);
  const index = getKoIndex();
  const base = `/${locale}/dissertation/doctoral/donghak-daesoon-ko`;
  const prevId = id > 0 ? id - 1 : null;
  const nextId = id < KO_TOTAL - 1 ? id + 1 : null;
  const blocks = formatContent(segment.content);
  const isChapter = segment.type === 'chapter';

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Top nav */}
      <div className="flex items-center justify-between mb-8 text-sm">
        <Link href={base} className="text-gold/70 hover:text-gold transition-colors">
          ← 목차
        </Link>
        <div className="flex gap-3">
          {prevId !== null && (
            <Link href={`${base}/${prevId}`} className="text-parchment-muted hover:text-gold transition-colors">
              이전 절
            </Link>
          )}
          {nextId !== null && (
            <Link href={`${base}/${nextId}`} className="text-parchment-muted hover:text-gold transition-colors">
              다음 절
            </Link>
          )}
        </div>
      </div>

      {/* Header */}
      {isChapter && (
        <p className="text-gold/60 text-xs uppercase tracking-widest mb-2">제 {segment.number} 장</p>
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
          ) : b.type === 'q' ? (
            <blockquote
              key={i}
              className="border-l-2 border-gold/50 pl-4 ml-2 my-2 text-parchment/75 text-[0.9rem] leading-[1.9]"
              style={{ textAlign: 'justify' }}
            >
              {b.text}
            </blockquote>
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
