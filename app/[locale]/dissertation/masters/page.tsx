import Link from 'next/link';
import ContentCard from '@/components/ContentCard';
import { getContent } from '@/lib/content';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function MastersPage({ params }: Props) {
  const { locale } = await params;
  const content = getContent(locale);

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <nav className="text-parchment-muted text-sm mb-8 flex items-center gap-2">
        <Link href={`/${locale}/dissertation`} className="hover:text-gold transition-colors">
          {content.nav.dissertation}
        </Link>
        <span className="text-gold/40">›</span>
        <span className="text-parchment">{content.nav.masters}</span>
      </nav>

      <h1 className="text-4xl font-serif text-gold mb-10">{content.nav.masters}</h1>

      <div className="space-y-6">
        {content.dissertation.masters.map((item) => (
          <ContentCard
            key={item.id}
            item={item}
            youtubeLabel={content.nav.visitYoutube}
            websiteLabel={content.nav.visitWebsite}
            comingSoonLabel={content.nav.comingSoon}
          />
        ))}
      </div>
    </div>
  );
}
