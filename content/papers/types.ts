export type PaperBlock =
  | { type: 'h3' | 'h4' | 'p' | 'quote'; text: string }
  | { type: 'table'; caption?: string; headers: string[]; rows: string[][] }
  | { type: 'image'; src: string; alt: string; caption?: string; width?: number }
  | { type: 'footnotes-list'; from: number; to: number };

export interface PaperChapter {
  id: string;
  title: string;
  subtitle?: string;
  blocks: PaperBlock[];
}

export interface PaperDownload {
  label: string;
  href: string;
}

export interface PaperFootnote {
  n: number;
  body: string;
}

/**
 * A presentation section shown as a master's-thesis-style outline card
 * (YouTube video + slide-section PDF + on-site reader). Titles are localized;
 * `chapter`, `youtubeId`, `pdfSlug`, and page labels are shared across locales.
 */
export interface PaperSection {
  /** Roman/section marker, e.g. 'I' … 'V'. */
  code: string;
  /** Localized section title. */
  title: string;
  /** Reader chapter id this card opens (via ?read=). */
  chapter: string;
  /** YouTube video id for this section. */
  youtubeId: string;
  /** Slide-section PDF basename under /pdf/papers/<id>/<locale>/. */
  pdfSlug: string;
  /** Original deck page range (display label only). */
  pageStart: number;
  pageEnd: number;
}

export interface Paper {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  venue?: string;
  year?: number;
  downloads?: PaperDownload[];
  youtubeUrl?: string;
  /** When present, the paper page shows a master's-style section-card outline. */
  sections?: PaperSection[];
  chapters: PaperChapter[];
  footnotes?: PaperFootnote[];
}
