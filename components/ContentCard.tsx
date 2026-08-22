import Link from 'next/link';
import type { ContentItem } from '@/content/types';
import { isSpecificYoutube } from '@/lib/youtube';

interface ContentCardProps {
  item: ContentItem;
  youtubeLabel: string;
  websiteLabel: string;
  comingSoonLabel: string;
  pdfLabel?: string;
}

export default function ContentCard({ item, youtubeLabel, websiteLabel, comingSoonLabel, pdfLabel }: ContentCardProps) {
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
        {isSpecificYoutube(item.youtubeUrl) && (
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
        {item.pdfUrl && pdfLabel && (
          <a
            href={item.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gold/90 hover:bg-gold text-ink text-sm font-semibold rounded transition-colors"
          >
            <PdfIcon />
            {pdfLabel}
          </a>
        )}
      </div>
    </div>
  );
}

function PdfIcon() {
  return (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 7V3.5L18.5 9H13zM8.5 13.5h1.25c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5H9v1H8.5v-4zm.5 2h.75c.28 0 .5-.22.5-.5s-.22-.5-.5-.5H9v1zm3-2h1.25c.69 0 1.25.56 1.25 1.25v1.5c0 .69-.56 1.25-1.25 1.25H12v-4zm.5 3.5h.75c.41 0 .75-.34.75-.75v-1.5c0-.41-.34-.75-.75-.75H12.5v3zm3-3.5H17v.5h-1v1h1v.5h-1v2h-.5v-4z" />
    </svg>
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
