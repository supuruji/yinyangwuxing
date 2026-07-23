import Link from 'next/link';
import { getBookMeta, getBookUi } from '@/lib/bookAiSurvival';
import { getContent } from '@/lib/content';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function BookAiSurvivalHome({ params }: Props) {
  const { locale } = await params;
  const content = getContent(locale);
  const meta = getBookMeta(locale);
  const ui = getBookUi(locale);
  const base = `/${locale}/books/ai-survival`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      {/* Breadcrumb */}
      <nav className="text-parchment-muted text-sm mb-8 flex items-center gap-2">
        <Link href={`/${locale}/books`} className="hover:text-gold transition-colors">
          {content.nav.books}
        </Link>
        <span className="text-gold/40">›</span>
        <span className="text-parchment">{ui.breadcrumbTail}</span>
      </nav>

      {/* Cover */}
      <div className="border border-gold/30 rounded-lg p-8 md:p-12 bg-ink-card mb-10 text-center">
        <p className="text-gold/60 text-xs uppercase tracking-widest mb-4">{meta.series}</p>
        <h1 className="text-2xl md:text-3xl font-serif text-gold leading-snug mb-4">{meta.title}</h1>
        <p className="text-parchment-muted font-serif mb-6">{meta.subtitle}</p>
        <div className="text-parchment text-sm mt-6 leading-relaxed">
          <p>{meta.author}</p>
          <p className="text-parchment-muted">
            {meta.publisher} · {meta.date}
          </p>
        </div>
      </div>

      {/* Translator note */}
      <div className="border-l-2 border-gold/30 pl-4 mb-10">
        <p className="text-parchment-muted text-sm leading-relaxed italic">{meta.note}</p>
      </div>

      {/* Hint + Start reading */}
      <p className="text-parchment-muted text-sm text-center mb-6">{ui.hint}</p>
      <div className="text-center py-4">
        <Link
          href={`${base}/0`}
          className="inline-block px-8 py-3 bg-gold text-ink font-semibold rounded-lg hover:bg-gold-light transition-colors text-sm tracking-wide"
        >
          {ui.startReading}
        </Link>
      </div>
    </div>
  );
}
