'use client';

import { useState, Fragment } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Item {
  index: number;
  type: 'chapter' | 'section';
  part: string;
  navTitle: string;
  title: string;
}

interface Props {
  items: Item[];
  base: string;
  booksHref: string;
  booksLabel: string;
  title: string;
  author: string;
  partLabels: Record<string, string>;
  contentsLabel: string;
}

export default function BookSidebar({
  items,
  base,
  booksHref,
  booksLabel,
  title,
  author,
  partLabels,
  contentsLabel,
}: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  let activeKey: string | null = null;
  if (pathname === base) activeKey = 'home';
  else if (pathname.startsWith(base + '/')) activeKey = pathname.slice(base.length + 1);

  let lastPart = '';

  return (
    <aside className="md:w-72 md:shrink-0 md:border-r md:border-gold/20 bg-ink-soft/40">
      <div className="md:sticky md:top-16 md:max-h-[calc(100vh-4rem)] md:overflow-y-auto p-4">
        {/* Header */}
        <Link href={booksHref} className="block text-gold/60 hover:text-gold text-xs mb-3 transition-colors">
          ← {booksLabel}
        </Link>
        <Link href={base} className="block mb-1">
          <span className="font-serif text-gold text-sm leading-snug hover:text-gold-light transition-colors">
            {title}
          </span>
        </Link>
        <p className="text-parchment-muted text-xs mb-4">{author} · 2026</p>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((o) => !o)}
          className="md:hidden w-full text-left px-3 py-2 mb-2 rounded border border-gold/30 text-parchment text-sm flex items-center justify-between"
        >
          <span>{contentsLabel}</span>
          <span className="text-gold/70">{open ? '▲' : '▼'}</span>
        </button>

        {/* Nav */}
        <nav className={`${open ? 'block' : 'hidden'} md:block space-y-0.5`}>
          <p className="hidden md:block text-gold/50 text-[0.65rem] uppercase tracking-widest mb-2 px-1">
            {contentsLabel}
          </p>
          {items.map((item) => {
            const active = activeKey === String(item.index);
            const isChapter = item.type === 'chapter';
            const showPart = item.part && item.part !== lastPart;
            if (item.part) lastPart = item.part;
            return (
              <Fragment key={item.index}>
                {showPart && (
                  <p className="text-gold/50 text-[0.62rem] uppercase tracking-widest mt-4 mb-1.5 px-1 leading-snug">
                    {partLabels[item.part] ?? item.part}
                  </p>
                )}
                <Link
                  href={`${base}/${item.index}`}
                  onClick={() => setOpen(false)}
                  className={[
                    'block rounded px-3 py-2 text-sm leading-snug transition-colors',
                    isChapter ? 'font-serif' : 'text-[0.82rem]',
                    active
                      ? 'bg-gold/15 text-gold'
                      : isChapter
                        ? 'text-parchment hover:text-gold hover:bg-gold/5'
                        : 'text-parchment-muted hover:text-gold hover:bg-gold/5',
                  ].join(' ')}
                >
                  {item.navTitle}
                </Link>
              </Fragment>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
