export interface PaperBlock {
  type: 'h3' | 'h4' | 'p' | 'quote';
  text: string;
}

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

export interface Paper {
  id: string;
  title: string;
  subtitle?: string;
  author: string;
  venue?: string;
  year?: number;
  downloads?: PaperDownload[];
  chapters: PaperChapter[];
}
