import Link from 'next/link';
import { getContent } from '@/lib/content';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const content = getContent(locale);

  const categories = [
    {
      href: `/${locale}/dissertation`,
      title: content.nav.dissertation,
      desc: content.nav.dissertationDesc,
      glyph: '論',
    },
    {
      href: `/${locale}/papers`,
      title: content.nav.papers,
      desc: content.nav.papersDesc,
      glyph: '文',
    },
    {
      href: `/${locale}/books`,
      title: content.nav.books,
      desc: content.nav.booksDesc,
      glyph: '書',
    },
    {
      href: `/${locale}/yinyang`,
      title: content.nav.yinyang,
      desc: content.nav.yinyangDesc,
      glyph: '行',
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center py-24 px-4 overflow-hidden">
        {/* Decorative yin-yang background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
          <svg viewBox="0 0 200 200" className="w-96 h-96">
            <circle cx="100" cy="100" r="100" fill="#c9a84c" />
            <path d="M100,0 A100,100 0 0,1 100,200 A50,50 0 0,1 100,100 A50,50 0 0,0 100,0" fill="#0f0e0b" />
            <circle cx="100" cy="50" r="25" fill="#0f0e0b" />
            <circle cx="100" cy="150" r="25" fill="#c9a84c" />
            <circle cx="100" cy="50" r="8" fill="#c9a84c" />
            <circle cx="100" cy="150" r="8" fill="#0f0e0b" />
          </svg>
        </div>

        <div className="relative text-center">
          <h1 className="text-6xl md:text-8xl font-serif text-gold mb-4 tracking-widest">
            {content.home.heading}
          </h1>
          <p className="text-parchment-muted text-lg md:text-xl mb-6 tracking-wide">
            {content.home.subheading}
          </p>
          <div className="w-24 h-px bg-gold/50 mx-auto mb-6" />
          <p className="text-parchment/80 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            {content.home.intro}
          </p>
        </div>
      </section>

      {/* Category cards */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map(({ href, title, desc, glyph }) => (
            <Link
              key={href}
              href={href}
              className="group border border-gold/25 hover:border-gold/60 rounded-lg p-6 bg-ink-card transition-all hover:bg-gold/5 flex flex-col gap-3"
            >
              <span className="text-4xl text-gold/40 group-hover:text-gold/70 font-serif transition-colors">
                {glyph}
              </span>
              <h2 className="text-parchment font-serif text-lg group-hover:text-gold transition-colors">
                {title}
              </h2>
              <p className="text-parchment-muted text-xs leading-relaxed">{desc}</p>
              <span className="mt-auto text-gold/50 group-hover:text-gold text-xs transition-colors">
                → 보기
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
