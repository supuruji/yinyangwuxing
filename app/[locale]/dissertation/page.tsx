import Link from 'next/link';
import { getContent } from '@/lib/content';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function DissertationPage({ params }: Props) {
  const { locale } = await params;
  const content = getContent(locale);

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-serif text-gold mb-3">{content.nav.dissertation}</h1>
      <p className="text-parchment-muted mb-12">{content.nav.dissertationDesc}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href={`/${locale}/dissertation/doctoral`}
          className="group border border-gold/30 hover:border-gold rounded-lg p-8 bg-ink-card transition-all hover:bg-gold/5"
        >
          <p className="text-gold/60 text-xs uppercase tracking-widest mb-3">
            {content.nav.doctoral}
          </p>
          <h2 className="text-parchment text-xl font-serif mb-3 group-hover:text-gold transition-colors">
            {content.dissertation.doctoral[0]?.title ?? content.nav.doctoral}
          </h2>
          <span className="text-gold/50 group-hover:text-gold text-sm transition-colors">→</span>
        </Link>

        <Link
          href={`/${locale}/dissertation/masters`}
          className="group border border-gold/30 hover:border-gold rounded-lg p-8 bg-ink-card transition-all hover:bg-gold/5"
        >
          <p className="text-gold/60 text-xs uppercase tracking-widest mb-3">
            {content.nav.masters}
          </p>
          <h2 className="text-parchment text-xl font-serif mb-3 group-hover:text-gold transition-colors">
            {content.dissertation.masters[0]?.title ?? content.nav.masters}
          </h2>
          <span className="text-gold/50 group-hover:text-gold text-sm transition-colors">→</span>
        </Link>
      </div>
    </div>
  );
}
