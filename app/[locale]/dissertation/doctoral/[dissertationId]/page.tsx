import { notFound } from 'next/navigation';
import Link from 'next/link';
import { readFileSync } from 'fs';
import { join } from 'path';

interface Props {
  params: Promise<{ locale: string; dissertationId: string }>;
}

function loadMeta(dissertationId: string) {
  try {
    const p = join(process.cwd(), 'content', 'dissertation', dissertationId, 'metadata.json');
    return JSON.parse(readFileSync(p, 'utf-8'));
  } catch {
    return null;
  }
}

export default async function DissertationOverviewPage({ params }: Props) {
  const { locale, dissertationId } = await params;
  const meta = loadMeta(dissertationId);
  if (!meta) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <nav className="text-xs text-parchment-muted mb-6 flex items-center gap-1.5">
        <Link href={`/${locale}/dissertation`} className="hover:text-gold transition-colors">학위논문</Link>
        <span className="text-gold/40">›</span>
        <Link href={`/${locale}/dissertation/doctoral`} className="hover:text-gold transition-colors">박사논문</Link>
        <span className="text-gold/40">›</span>
        <span className="text-parchment">{meta.title}</span>
      </nav>

      <h1 className="text-3xl font-serif text-gold mb-2 leading-snug">{meta.title}</h1>
      <p className="text-parchment-muted text-sm mb-1">{meta.subtitle}</p>
      <p className="text-parchment-muted text-sm mb-8">{meta.author} · {meta.university} · {meta.year}</p>

      <div className="space-y-3">
        {meta.chapters.map((ch: { id: string; title: string; paragraphCount: number; footnoteCount: number }) => (
          <Link
            key={ch.id}
            href={`/${locale}/dissertation/doctoral/${dissertationId}/${ch.id}`}
            className="flex items-center justify-between p-4 border border-gold/20 rounded-lg bg-ink-soft hover:border-gold/50 hover:bg-gold/5 transition-colors group"
          >
            <span className="text-parchment group-hover:text-gold transition-colors font-medium">
              {ch.title}
            </span>
            <span className="text-xs text-parchment-muted shrink-0 ml-4">
              {ch.footnoteCount > 0 && `각주 ${ch.footnoteCount}개`}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
