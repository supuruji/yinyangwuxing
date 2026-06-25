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

export interface Paper {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  venue?: string;
  year?: number;
  downloads?: PaperDownload[];
  youtubeUrl?: string;
  chapters: PaperChapter[];
  footnotes?: PaperFootnote[];
}
