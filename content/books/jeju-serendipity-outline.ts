// Card outline for the book "jeju-serendipity" — mirrors the ai-survival card UI.
// The presentation deck is organized into 5 sections (parts Ⅰ–Ⅴ); each card links
// to a YouTube video, the section's slide-deck PDF, and the on-site reader (opening
// at the first chapter of that part). youtubeId is filled per section once the
// section videos are uploaded (empty → the YouTube button stays hidden).

export interface JejuOutlineItem {
  /** short code shown on the card badge (Roman section numeral) */
  code: string;
  /** reader chapter id (target of the 본문/Read button) — first chapter of the part */
  chapter: string;
  /** part-group key for the sticky header */
  group: string;
  /** presentation PDF basename under /pdf/books/jeju-serendipity/<locale>/ */
  pdfSlug: string;
  /** per-section YouTube video id (empty → falls back to the playlist URL) */
  youtubeId: string;
  /** localized card title (the section/part name; not a single reader chapter) */
  titles: Record<string, string>;
}

export const JEJU_OUTLINE: JejuOutlineItem[] = [
  {
    code: 'Ⅰ', chapter: '1-1', group: 'sections', pdfSlug: '01-understanding', youtubeId: '',
    titles: {
      ko: 'Ⅰ. 세렌디피티의 이해',
      en: 'Ⅰ. Understanding Serendipity',
      zh: 'Ⅰ. 塞伦迪皮蒂的理解',
      ja: 'Ⅰ. セレンディピティの理解',
    },
  },
  {
    code: 'Ⅱ', chapter: '2-1', group: 'sections', pdfSlug: '02-expansion', youtubeId: '',
    titles: {
      ko: 'Ⅱ. 세렌디피티의 확장',
      en: 'Ⅱ. The Expansion of Serendipity',
      zh: 'Ⅱ. 塞伦迪皮蒂的扩展',
      ja: 'Ⅱ. セレンディピティの拡張',
    },
  },
  {
    code: 'Ⅲ', chapter: '3-1', group: 'sections', pdfSlug: '03-regional-culture', youtubeId: '',
    titles: {
      ko: 'Ⅲ. 나, 여기, 지금으로서의 세렌디피티와 지역문화',
      en: 'Ⅲ. Serendipity as I, Here, Now, and Local Culture',
      zh: 'Ⅲ. 作为「我、此地、此刻」的塞伦迪皮蒂与地域文化',
      ja: 'Ⅲ. 私・此処・今としてのセレンディピティと地域文化',
    },
  },
  {
    code: 'Ⅳ', chapter: '4-1', group: 'sections', pdfSlug: '04-jeju-culture', youtubeId: '',
    titles: {
      ko: 'Ⅳ. 나, 여기, 지금으로서의 세렌디피티와 제주문화',
      en: 'Ⅳ. Serendipity as I, Here, Now, and Jeju Culture',
      zh: 'Ⅳ. 作为「我、此地、此刻」的塞伦迪皮蒂与济州文化',
      ja: 'Ⅳ. 私・此処・今としてのセレンディピティと済州文化',
    },
  },
  {
    code: 'Ⅴ', chapter: '5-1', group: 'sections', pdfSlug: '05-jeju-creation', youtubeId: '',
    titles: {
      ko: 'Ⅴ. 나, 여기, 지금으로서의 세렌디피티와 제주문화 창조',
      en: 'Ⅴ. Serendipity as I, Here, Now, and the Creation of Jeju Culture',
      zh: 'Ⅴ. 作为「我、此地、此刻」的塞伦迪皮蒂与济州文化创造',
      ja: 'Ⅴ. 私・此処・今としてのセレンディピティと済州文化の創造',
    },
  },
];

export const JEJU_GROUP_LABELS: Record<string, Record<string, string>> = {
  ko: { sections: '절별 발표 (Ⅰ–Ⅴ)' },
  en: { sections: 'Sections (Ⅰ–Ⅴ)' },
  zh: { sections: '各节发表 (Ⅰ–Ⅴ)' },
  ja: { sections: '節別発表 (Ⅰ–Ⅴ)' },
};

/** YouTube playlist for the book (per-card youtubeId links resolve within it).
 *  Placeholder channel until the Korean/EN/ZH/JA section playlists are provided. */
export const JEJU_PLAYLIST =
  'https://www.youtube.com/@%EC%B5%9C%EC%9B%90%ED%98%81-b3r';
