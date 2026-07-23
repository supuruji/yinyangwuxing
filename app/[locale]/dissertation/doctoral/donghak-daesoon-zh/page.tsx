import Link from 'next/link';
import { ZH_META } from '@/lib/dissertationZh';
import { getContent } from '@/lib/content';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function DissertationZhHome({ params }: Props) {
  const { locale } = await params;
  const content = getContent(locale);
  const base = `/${locale}/dissertation/doctoral/donghak-daesoon-zh`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      {/* Breadcrumb */}
      <nav className="text-parchment-muted text-sm mb-8 flex items-center gap-2">
        <Link href={`/${locale}/dissertation`} className="hover:text-gold transition-colors">
          {content.nav.dissertation}
        </Link>
        <span className="text-gold/40">›</span>
        <Link href={`/${locale}/dissertation/doctoral`} className="hover:text-gold transition-colors">
          {content.nav.doctoral}
        </Link>
        <span className="text-gold/40">›</span>
        <span className="text-parchment">中文全文</span>
      </nav>

      {/* Cover */}
      <div className="border border-gold/30 rounded-lg p-8 md:p-12 bg-ink-card mb-12 text-center">
        <p className="text-gold/60 text-xs uppercase tracking-widest mb-4">
          博士学位论文 · 大真大学校 · 2024
        </p>
        <h1 className="text-2xl md:text-3xl font-serif text-gold leading-snug mb-3">
          {ZH_META.titleZh}
        </h1>
        <p className="text-parchment-muted font-serif mb-6">{ZH_META.subtitleZh}</p>
        <p className="text-parchment-muted text-sm leading-relaxed">{ZH_META.titleEn}</p>
        <div className="text-parchment text-sm mt-6 leading-relaxed">
          <p>作者：{ZH_META.author} ｜ 指导教授：{ZH_META.supervisor}</p>
          <p>{ZH_META.affiliation} ｜ {ZH_META.date}</p>
        </div>
      </div>

      {/* Hint + Start reading */}
      <p className="text-parchment-muted text-sm text-center mb-6">
        点击左侧目录中各章节的标题即可阅读正文。
      </p>
      <div className="text-center py-4">
        <Link
          href={`${base}/0`}
          className="inline-block px-8 py-3 bg-gold text-ink font-semibold rounded-lg hover:bg-gold-light transition-colors text-sm tracking-wide"
        >
          开始阅读 →
        </Link>
      </div>
    </div>
  );
}
