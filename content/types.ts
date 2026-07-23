export interface ContentItem {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  youtubeUrl?: string;
  websiteUrl?: string;
  comingSoon?: boolean;
}

export interface NavTranslations {
  home: string;
  dissertation: string;
  papers: string;
  books: string;
  yinyang: string;
  masters: string;
  doctoral: string;
  visitYoutube: string;
  visitWebsite: string;
  comingSoon: string;
  backToTop: string;
  dissertationDesc: string;
  papersDesc: string;
  booksDesc: string;
  yinyangDesc: string;
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
}

export type Locale = 'ko' | 'en' | 'zh' | 'ja';
