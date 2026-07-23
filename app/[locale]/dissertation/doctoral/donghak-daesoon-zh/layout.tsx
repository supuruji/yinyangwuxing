import DissertationZhSidebar from '@/components/DissertationZhSidebar';
import { getZhIndex, ZH_META } from '@/lib/dissertationZh';

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function DonghakDaesoonZhLayout({ children, params }: Props) {
  const { locale } = await params;
  const index = getZhIndex();
  const base = `/${locale}/dissertation/doctoral/donghak-daesoon-zh`;
  const doctoralHref = `/${locale}/dissertation/doctoral`;

  return (
    <div className="flex flex-col md:flex-row max-w-7xl mx-auto w-full">
      <DissertationZhSidebar
        items={index}
        base={base}
        doctoralHref={doctoralHref}
        titleZh={ZH_META.titleZh}
        author={ZH_META.author}
      />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
