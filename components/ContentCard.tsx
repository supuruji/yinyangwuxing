import Link from 'next/link';
import type { ContentItem } from '@/content/types';

interface ContentCardProps {
  item: ContentItem;
  youtubeLabel: string;
  websiteLabel: string;
  comingSoonLabel: string;
}

export default function ContentCard({ item, youtubeLabel, websiteLabel, comingSoonLabel }: ContentCardProps) {
  if (item.comingSoon) {
    return (
      <div className="border border-gold/20 rounded-lg p-6 bg-ink-card opacity-60">
        <p className="text-parchment-muted text-sm uppercase tracking-widest mb-2">{item.subtitle}</p>
        <h3 className="text-parchment text-lg font-serif">{item.title}</h3>
        <span className="inline-block mt-3 text-xs text-gold/60 border border-gold/30 rounded px-2 py-1">
          {comingSoonLabel}
        </span>
      </div>
    );
  }

  return (
    <div className="border border-gold/30 rounded-lg p-6 bg-ink-card hover:border-gold/60 transition-colors group">
      {item.subtitle && (
        <p className="text-gold/70 text-xs uppercase tracking-widest mb-2">{item.subtitle}</p>
      )}
      <h3 className="text-parchment text-xl font-serif leading-snug mb-3 group-hover:text-gold transition-colors">
        {item.title}
      </h3>
      {item.description && (
        <p className="text-parchment-muted text-sm leading-relaxed mb-5">{item.description}</p>
      )}
      <div className="flex flex-wrap gap-3">
        {item.youtubeUrl && (
          <a
            href={item.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-crimson/80 hover:bg-crimson text-parchment text-sm rounded transition-colors"
          >
            <YoutubeIcon />
            {youtubeLabel}
          </a>
        )}
        {item.websiteUrl && (
          item.websiteUrl.startsWith('/') ? (
            <Link
              href={item.websiteUrl}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gold/50 hover:border-gold hover:bg-gold/10 text-parchment text-sm rounded transition-colors"
            >
              <ExternalLinkIcon />
              {websiteLabel}
            </Link>
          ) : (
            <a
              href={item.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 border border-gold/50 hover:border-gold hover:bg-gold/10 text-parchment text-sm rounded transition-colors"
            >
              <ExternalLinkIcon />
              {websiteLabel}
            </a>
          )
        )}
      </div>
    </div>
  );
}

function YoutubeIcon() {
  return (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg className="w-4 h-4 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}
