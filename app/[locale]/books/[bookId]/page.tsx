import { notFound } from 'next/navigation';
import { koAiSurvivalBook } from '@/content/books/ko-ai-survival';
import { getContent } from '@/lib/content';
import BookReader from '@/components/BookReader';
import type { Metadata } from 'next';

const BOOKS: Record<string, typeof koAiSurvivalBook> = {
  'ai-survival': koAiSurvivalBook,
};

interface Props {
  params: Promise<{ locale: string; bookId: string }>;
}

export async function generateStaticParams() {
  return ['ko', 'en', 'ja', 'zh'].flatMap((locale) =>
    Object.keys(BOOKS).map((bookId) => ({ locale, bookId }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { bookId } = await params;
  const book = BOOKS[bookId];
  if (!book) return {};
  return {
    title: `${book.title} — ${book.author}`,
    description: `${book.subtitle} · ${book.series}`,
  };
}

export default async function BookPage({ params }: Props) {
  const { locale, bookId } = await params;
  const book = BOOKS[bookId];
  if (!book) notFound();

  const content = getContent(locale);

  return (
    <BookReader
      book={book}
      locale={locale}
      backLabel={content.nav.backToTop}
      backHref={`/${locale}/books`}
    />
  );
}
