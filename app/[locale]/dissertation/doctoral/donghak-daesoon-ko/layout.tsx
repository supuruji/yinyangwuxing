import DissertationKoSidebar from '@/components/DissertationKoSidebar';
import { getKoIndex, KO_META } from '@/lib/dissertationKo';

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function DonghakDaesoonKoLayout({ children, params }: Props) {
  const { locale } = await params;
  const index = getKoIndex();
  const base = `/${locale}/dissertation/doctoral/donghak-daesoon-ko`;
  const doctoralHref = `/${locale}/dissertation/doctoral`;

  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto w-full">
      <DissertationKoSidebar
        items={index}
        base={base}
        doctoralHref={doctoralHref}
        titleKo={KO_META.titleKo}
        author={KO_META.author}
      />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
