import Link from 'next/link';
import { KO_META } from '@/lib/dissertationKo';
import { getContent } from '@/lib/content';

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function DissertationKoHome({ params }: Props) {
  const { locale } = await params;
  const content = getContent(locale);
  const base = `/${locale}/dissertation/doctoral/donghak-daesoon-ko`;

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
        <span className="text-parchment">한국어 원문</span>
      </nav>

      {/* Cover */}
      <div className="border border-gold/30 rounded-lg p-8 md:p-12 bg-ink-card mb-12 text-center">
        <p className="text-gold/60 text-xs uppercase tracking-widest mb-4">
          박사학위논문 · 대진대학교 · 2024
        </p>
        <h1 className="text-2xl md:text-3xl font-serif text-gold leading-snug mb-3">
          {KO_META.titleKo}
        </h1>
        <p className="text-parchment-muted font-serif mb-6">{KO_META.subtitleKo}</p>
        <p className="text-parchment-muted text-sm leading-relaxed">{KO_META.titleEn}</p>
        <div className="text-parchment text-sm mt-6 leading-relaxed">
          <p>저자: {KO_META.author} ｜ 지도교수: {KO_META.supervisor}</p>
          <p>{KO_META.affiliation} ｜ {KO_META.date}</p>
        </div>
      </div>

      {/* Hint + Start reading */}
      <p className="text-parchment-muted text-sm text-center mb-6">
        왼쪽 목차에서 각 장·절의 제목을 클릭하여 본문을 읽을 수 있습니다.
      </p>
      <div className="text-center py-4">
        <Link
          href={`${base}/0`}
          className="inline-block px-8 py-3 bg-gold text-ink font-semibold rounded-lg hover:bg-gold-light transition-colors text-sm tracking-wide"
        >
          읽기 시작 →
        </Link>
      </div>
    </div>
  );
}
