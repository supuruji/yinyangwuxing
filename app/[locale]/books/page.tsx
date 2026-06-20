import ContentCard from '@/components/ContentCard';
import { getContent } from '@/lib/content';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function BooksPage({ params }: Props) {
  const { locale } = await params;
  const content = getContent(locale);

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-serif text-gold mb-3">{content.nav.books}</h1>
      <p className="text-parchment-muted mb-12">{content.nav.booksDesc}</p>

      <div className="space-y-6">
        {content.books.map((item) => (
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
