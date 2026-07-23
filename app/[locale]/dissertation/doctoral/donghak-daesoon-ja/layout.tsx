import DissertationJaSidebar from '@/components/DissertationJaSidebar';
import { getJaIndex, JA_META } from '@/lib/dissertationJa';

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function DonghakDaesoonJaLayout({ children, params }: Props) {
  const { locale } = await params;
  const index = getJaIndex();
  const base = `/${locale}/dissertation/doctoral/donghak-daesoon-ja`;
  const doctoralHref = `/${locale}/dissertation/doctoral`;

  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto w-full">
      <DissertationJaSidebar
        items={index}
        base={base}
        doctoralHref={doctoralHref}
        titleJa={JA_META.titleJa}
        author={JA_META.author}
      />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
