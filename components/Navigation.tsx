'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { SiteContent } from '@/content/types';
import { locales, localeLabels } from '@/lib/content';
import type { Locale } from '@/content/types';

interface NavigationProps {
  locale: string;
  content: SiteContent;
}

export default function Navigation({ locale, content }: NavigationProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dissertationOpen, setDissertationOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

  const getLocaleSwitchHref = (targetLocale: Locale) => {
    const segments = pathname.split('/').filter(Boolean);
    if (locales.includes(segments[0] as Locale)) {
      segments[0] = targetLocale;
    } else {
      segments.unshift(targetLocale);
    }
    return '/' + segments.join('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-ink/95 backdrop-blur border-b border-gold/20">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}`} className="text-gold font-serif text-xl tracking-wider hover:text-gold-light transition-colors">
            陰陽五行
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {/* 학위논문 with dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setDissertationOpen(true)}
              onMouseLeave={() => setDissertationOpen(false)}
            >
              <Link
                href={`/${locale}/dissertation`}
                className={`px-4 py-2 text-sm rounded transition-colors ${
                  isActive(`/${locale}/dissertation`)
                    ? 'text-gold bg-gold/10'
                    : 'text-parchment hover:text-gold hover:bg-gold/5'
                }`}
              >
                {content.nav.dissertation}
              </Link>
              {dissertationOpen && (
                <div className="absolute top-full left-0 mt-1 w-52 bg-ink-soft border border-gold/30 rounded-lg shadow-xl py-1">
                  <Link
                    href={`/${locale}/dissertation/doctoral`}
                    className="block px-4 py-2.5 text-sm text-parchment hover:text-gold hover:bg-gold/5 transition-colors"
                  >
                    {content.nav.doctoral}
                  </Link>
                  <Link
                    href={`/${locale}/dissertation/masters`}
                    className="block px-4 py-2.5 text-sm text-parchment hover:text-gold hover:bg-gold/5 transition-colors"
                  >
                    {content.nav.masters}
                  </Link>
                </div>
              )}
            </div>

            {[
              { href: `/${locale}/papers`, label: content.nav.papers },
              { href: `/${locale}/books`, label: content.nav.books },
              { href: `/${locale}/yinyang`, label: content.nav.yinyang },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 text-sm rounded transition-colors ${
                  isActive(href)
                    ? 'text-gold bg-gold/10'
                    : 'text-parchment hover:text-gold hover:bg-gold/5'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Language Switcher */}
          <div className="hidden md:flex items-center gap-1 border border-gold/30 rounded-lg p-1">
            {locales.map((l) => (
              <Link
                key={l}
                href={getLocaleSwitchHref(l)}
                className={`px-2.5 py-1 text-xs rounded transition-colors ${
                  l === locale
                    ? 'bg-gold text-ink font-semibold'
                    : 'text-parchment-muted hover:text-parchment'
                }`}
              >
                {localeLabels[l]}
              </Link>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-parchment p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="메뉴"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gold/20 py-3 space-y-1">
            <Link href={`/${locale}/dissertation`} className="block px-3 py-2 text-parchment hover:text-gold text-sm" onClick={() => setMenuOpen(false)}>
              {content.nav.dissertation}
            </Link>
            <Link href={`/${locale}/dissertation/doctoral`} className="block px-6 py-2 text-parchment-muted hover:text-gold text-sm" onClick={() => setMenuOpen(false)}>
              └ {content.nav.doctoral}
            </Link>
            <Link href={`/${locale}/dissertation/masters`} className="block px-6 py-2 text-parchment-muted hover:text-gold text-sm" onClick={() => setMenuOpen(false)}>
              └ {content.nav.masters}
            </Link>
            <Link href={`/${locale}/papers`} className="block px-3 py-2 text-parchment hover:text-gold text-sm" onClick={() => setMenuOpen(false)}>
              {content.nav.papers}
            </Link>
            <Link href={`/${locale}/books`} className="block px-3 py-2 text-parchment hover:text-gold text-sm" onClick={() => setMenuOpen(false)}>
              {content.nav.books}
            </Link>
            <Link href={`/${locale}/yinyang`} className="block px-3 py-2 text-parchment hover:text-gold text-sm" onClick={() => setMenuOpen(false)}>
              {content.nav.yinyang}
            </Link>
            <div className="flex gap-1 px-3 pt-2">
              {locales.map((l) => (
                <Link
                  key={l}
                  href={getLocaleSwitchHref(l)}
                  className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                    l === locale
                      ? 'border-gold bg-gold text-ink font-semibold'
                      : 'border-gold/30 text-parchment-muted hover:text-parchment'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {localeLabels[l]}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
