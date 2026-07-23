import BookSidebar from '@/components/BookSidebar';
import { getBookIndex, getBookMeta, getPartLabels, getBookUi } from '@/lib/bookAiSurvival';
import { getContent } from '@/lib/content';

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function BookAiSurvivalLayout({ children, params }: Props) {
  const { locale } = await params;
  const content = getContent(locale);
  const index = getBookIndex(locale);
  const meta = getBookMeta(locale);
  const ui = getBookUi(locale);
  const base = `/${locale}/books/ai-survival`;
  const booksHref = `/${locale}/books`;

  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto w-full">
      <BookSidebar
        items={index}
        base={base}
        booksHref={booksHref}
        booksLabel={content.nav.books}
        title={ui.sidebarTitle}
        author={meta.author}
        partLabels={getPartLabels(locale)}
        contentsLabel={ui.contents}
      />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
