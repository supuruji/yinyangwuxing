export interface ContentItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  youtubeUrl?: string;
  websiteUrl?: string;
  pdfUrl?: string;
  comingSoon?: boolean;
}

export interface NavTranslations {
  home: string;
  dissertation: string;
  papers: string;
  books: string;
  yinyang: string;
  ai: string;
  homepage: string;
  masters: string;
  doctoral: string;
  visitYoutube: string;
  visitWebsite: string;
  downloadPdf: string;
  comingSoon: string;
  backToTop: string;
  readerDownloads: string;
  readerYoutube: string;
  readerPrev: string;
  readerNext: string;
  readerToc: string;
  dissertationDesc: string;
  papersDesc: string;
  booksDesc: string;
  yinyangDesc: string;
  aiDesc: string;
  homepageDesc: string;
}

export interface SiteContent {
  meta: { title: string; description: string };
  nav: NavTranslations;
  home: { heading: string; subheading: string; intro: string };
  dissertation: {
    masters: ContentItem[];
    doctoral: ContentItem[];
  };
  papers: ContentItem[];
  books: ContentItem[];
  yinyang: ContentItem[];
  ai: {
    homepage: ContentItem[];
  };
}

export type Locale = 'ko' | 'en' | 'zh' | 'ja';
