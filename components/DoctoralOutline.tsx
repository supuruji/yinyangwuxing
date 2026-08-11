import Link from 'next/link';

export interface OutlineItem {
  order: number;
  level: number;
  code: string;
  title: string;
  youtubeId: string;
  youtubeUrl: string;
  pdfFile: string;
  pdfPath: string;
  pdfStart: number;
  pdfEnd: number;
  chapter: string;
  dissertationPdfFile?: string | null;
  dissertationPdfPath?: string | null;
}

interface Labels {
  watchYoutube: string;
  openPdf: string;
  openDissertationPdf: string;
  readOnSite: string;
  pageRange: (a: number, b: number) => string;
  playlist: string;
  fullPresentation: string;
  fullDissertation: string;
}

interface Props {
  locale: string;
  dissertationId: string;
  items: OutlineItem[];
  playlistUrl: string;
  fullPresentationUrl: string;
  fullDissertationUrl: string;
  labels: Labels;
  /** URL segment under /dissertation/ — 'doctoral' (default) or 'masters'. */
  basePath?: string;
  /** Renders the sticky group header for a chapter key. */
  groupLabel?: (chapter: string) => string;
}

const ROMAN_LABELS: Record<string, string> = {
  intro: 'I',
  ch2: 'II',
  ch3: 'III',
  ch4: 'IV',
  ch5: 'V',
  conclusion: 'VI',
};

function groupByChapter(items: OutlineItem[]): OutlineItem[][] {
  const groups: Record<string, OutlineItem[]> = {};
  const order: string[] = [];
  for (const it of items) {
    if (!groups[it.chapter]) {
      groups[it.chapter] = [];
      order.push(it.chapter);
    }
    groups[it.chapter].push(it);
  }
  return order.map((k) => groups[k]);
}

export default function DoctoralOutline({
  locale,
  dissertationId,
  items,
  playlistUrl,
  fullPresentationUrl,
  fullDissertationUrl,
  labels,
  basePath = 'doctoral',
  groupLabel,
}: Props) {
  const groups = groupByChapter(items);
  const renderGroupLabel = groupLabel ?? ((chapter: string) => `Chapter ${ROMAN_LABELS[chapter] ?? ''}`);

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center gap-3">
        <a
          href={playlistUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-crimson/80 hover:bg-crimson text-parchment text-sm rounded transition-colors"
        >
          <YoutubeIcon />
          {labels.playlist}
        </a>
        {fullPresentationUrl ? (
          <a
            href={fullPresentationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 border border-gold/50 hover:border-gold hover:bg-gold/10 text-parchment text-sm rounded transition-colors"
          >
            <PdfIcon />
            {labels.fullPresentation}
          </a>
        ) : null}
        {fullDissertationUrl ? (
          <a
            href={fullDissertationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 border border-gold/50 hover:border-gold hover:bg-gold/10 text-parchment text-sm rounded transition-colors"
          >
            <BookIcon />
            {labels.fullDissertation}
          </a>
        ) : null}
      </div>

      {groups.map((group) => {
        const head = group[0];
        return (
          <section key={head.chapter} className="space-y-2">
            <div className="sticky top-0 z-10 bg-ink-soft/95 backdrop-blur-sm py-2 border-b border-gold/30 mb-3">
              <p className="text-xs text-gold/70 tracking-widest uppercase">
                {renderGroupLabel(head.chapter)}
              </p>
            </div>
            <div className="grid gap-2">
              {group.map((item) => (
                <OutlineCard
                  key={item.order}
                  item={item}
                  locale={locale}
                  dissertationId={dissertationId}
                  labels={labels}
                  basePath={basePath}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function OutlineCard({
  item,
  locale,
  dissertationId,
  labels,
  basePath = 'doctoral',
}: {
  item: OutlineItem;
  locale: string;
  dissertationId: string;
  labels: Labels;
  basePath?: string;
}) {
  const indent = item.level === 1 ? 'pl-0' : item.level === 2 ? 'pl-4 sm:pl-6' : 'pl-8 sm:pl-12';
  const titleSize = item.level === 1 ? 'text-lg sm:text-xl' : item.level === 2 ? 'text-base sm:text-lg' : 'text-sm sm:text-base';
  const border = item.level === 1 ? 'border-gold/50 bg-ink-card' : 'border-gold/20 bg-ink-card/60';

  return (
    <div className={`${indent}`}>
      <div className={`rounded-md border ${border} px-3 py-3 sm:px-4 sm:py-4 hover:border-gold/70 transition-colors`}>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
          <div className="min-w-0 flex-1">
            <h3 className={`text-parchment font-serif leading-snug ${titleSize}`}>{item.title}</h3>
            <p className="mt-1 text-[11px] text-parchment-muted">
              {labels.pageRange(item.pdfStart, item.pdfEnd)}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5 shrink-0">
            <a
              href={item.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-crimson/80 hover:bg-crimson text-parchment text-xs rounded transition-colors"
              title={labels.watchYoutube}
            >
              <YoutubeIcon />
              <span className="hidden sm:inline">{labels.watchYoutube}</span>
            </a>
            <a
              href={item.pdfPath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-gold/50 hover:border-gold hover:bg-gold/10 text-parchment text-xs rounded transition-colors"
              title={labels.openPdf}
            >
              <PdfIcon />
              <span className="hidden sm:inline">{labels.openPdf}</span>
            </a>
            {item.dissertationPdfPath ? (
              <a
                href={item.dissertationPdfPath}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-gold/50 hover:border-gold hover:bg-gold/10 text-parchment text-xs rounded transition-colors"
                title={labels.openDissertationPdf}
              >
                <DissertationIcon />
                <span className="hidden sm:inline">{labels.openDissertationPdf}</span>
              </a>
            ) : null}
            <Link
              href={`/${locale}/dissertation/${basePath}/${dissertationId}/${item.chapter}`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 border border-gold/50 hover:border-gold hover:bg-gold/10 text-parchment text-xs rounded transition-colors"
              title={labels.readOnSite}
            >
              <BookIcon />
              <span className="hidden sm:inline">{labels.readOnSite}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function YoutubeIcon() {
  return (
    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function PdfIcon() {
  return (
    <svg className="w-3.5 h-3.5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg className="w-3.5 h-3.5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

function DissertationIcon() {
  return (
    <svg className="w-3.5 h-3.5 stroke-current fill-none" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4h11a3 3 0 013 3v13H7a3 3 0 01-3-3V4zm0 0v13a3 3 0 003 3M8 8h6M8 12h6" />
    </svg>
  );
}
