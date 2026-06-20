import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { getContent, locales } from '@/lib/content';
import type { Locale } from '@/content/types';

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const content = getContent(locale);
  return { title: content.meta.title, description: content.meta.description };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const content = getContent(locale);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation locale={locale} content={content} />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-gold/20 py-6 text-center text-parchment-muted text-xs">
        <p>© {new Date().getFullYear()} 최원혁 · 陰陽五行 · yinyangwuxing.org</p>
      </footer>
    </div>
  );
}
