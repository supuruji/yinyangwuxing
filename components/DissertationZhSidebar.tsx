'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Item {
  index: number;
  type: 'chapter' | 'section';
  number: string;
  title: string;
}

interface Props {
  items: Item[];
  base: string;
  doctoralHref: string;
  titleZh: string;
  author: string;
}

export default function DissertationZhSidebar({ items, base, doctoralHref, titleZh, author }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  let activeKey: string | null = null;
  if (pathname === base) activeKey = 'home';
  else if (pathname.startsWith(base + '/')) activeKey = pathname.slice(base.length + 1);

  return (
    <aside className="md:w-72 md:shrink-0 md:border-r md:border-gold/20 bg-ink-soft/40">
      <div className="md:sticky md:top-16 md:max-h-[calc(100vh-4rem)] md:overflow-y-auto p-4">
        {/* Header */}
        <Link href={doctoralHref} className="block text-gold/60 hover:text-gold text-xs mb-3 transition-colors">
          ← 返回 博士论文
        </Link>
        <Link href={base} className="block mb-1">
          <span className="font-serif text-gold text-sm leading-snug hover:text-gold-light transition-colors">
            {titleZh}
          </span>
        </Link>
        <p className="text-parchment-muted text-xs mb-4">{author} · 2024</p>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="md:hidden w-full text-left px-3 py-2 mb-2 rounded border border-gold/30 text-parchment text-sm flex items-center justify-between"
        >
          <span>目录</span>
          <span className="text-gold/70">{open ? '▲' : '▼'}</span>
        </button>

        {/* Nav */}
        <nav className={`${open ? 'block' : 'hidden'} md:block space-y-0.5`}>
          <p className="hidden md:block text-gold/50 text-[0.65rem] uppercase tracking-widest mb-2 px-1">
            目录
          </p>
          {items.map((item) => {
            const active = activeKey === String(item.index);
            const isChapter = item.type === 'chapter';
            return (
              <Link
                key={item.index}
                href={`${base}/${item.index}`}
                onClick={() => setOpen(false)}
                className={[
                  'block rounded px-3 py-2 text-sm leading-snug transition-colors',
                  isChapter ? 'font-serif' : 'pl-5 text-[0.82rem]',
                  active
                    ? 'bg-gold/15 text-gold'
                    : isChapter
                      ? 'text-parchment hover:text-gold hover:bg-gold/5'
                      : 'text-parchment-muted hover:text-gold hover:bg-gold/5',
                ].join(' ')}
              >
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
