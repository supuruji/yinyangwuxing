// Card outline for the book "jeju-serendipity" — mirrors the ai-survival card UI.
// The presentation deck is organized into 5 sections (parts Ⅰ–Ⅴ); each card links
// to a YouTube video, the section's slide-deck PDF, and the on-site reader (opening
// at the first chapter of that part). A separate overview video covers the whole book.
//
// Videos are per LANGUAGE (Korean, English, Chinese, Japanese), each with its own
// YouTube playlist, so youtubeIds is keyed by locale.

export interface JejuOutlineItem {
  /** short code shown on the card badge (Roman section numeral) */
  code: string;
  /** reader chapter id (target of the 본문/Read button) — first chapter of the part */
  chapter: string;
  /** part-group key for the sticky header */
  group: string;
  /** presentation PDF basename under /pdf/books/jeju-serendipity/<locale>/ */
  pdfSlug: string;
  /** per-locale YouTube video id (empty → falls back to the locale playlist) */
  youtubeIds: Record<string, string>;
  /** localized card title (the section/part name; not a single reader chapter) */
  titles: Record<string, string>;
}

export const JEJU_OUTLINE: JejuOutlineItem[] = [
  {
    code: 'Ⅰ', chapter: '1-1', group: 'sections', pdfSlug: '01-understanding',
    youtubeIds: { ko: '6uBuU2gwUM0', en: 'O03tZ8bieVU', zh: 'AtsZsSA6pl0', ja: 'an-QeR1G4M4' },
    titles: {
      ko: 'Ⅰ. 세렌디피티의 이해',
      en: 'Ⅰ. Understanding Serendipity',
      zh: 'Ⅰ. 塞伦迪皮蒂的理解',
      ja: 'Ⅰ. セレンディピティの理解',
    },
  },
  {
    code: 'Ⅱ', chapter: '2-1', group: 'sections', pdfSlug: '02-expansion',
    youtubeIds: { ko: '9YrRjbH_yX8', en: 'USw_LBfNOfs', zh: 'czbvzOWAq0c', ja: 'CMF4arSpCyM' },
    titles: {
      ko: 'Ⅱ. 세렌디피티의 확장',
      en: 'Ⅱ. The Expansion of Serendipity',
      zh: 'Ⅱ. 塞伦迪皮蒂的扩展',
      ja: 'Ⅱ. セレンディピティの拡張',
    },
  },
  {
    code: 'Ⅲ', chapter: '3-1', group: 'sections', pdfSlug: '03-regional-culture',
    youtubeIds: { ko: 'pWKjYQoByDY', en: '7T4lHOFBeGE', zh: 'jommjCexCRw', ja: 'Psenp9XdJLg' },
    titles: {
      ko: 'Ⅲ. 나, 여기, 지금으로서의 세렌디피티와 지역문화',
      en: 'Ⅲ. Serendipity as I, Here, Now, and Local Culture',
      zh: 'Ⅲ. 作为「我、此地、此刻」的塞伦迪皮蒂与地域文化',
      ja: 'Ⅲ. 私・此処・今としてのセレンディピティと地域文化',
    },
  },
  {
    code: 'Ⅳ', chapter: '4-1', group: 'sections', pdfSlug: '04-jeju-culture',
    youtubeIds: { ko: 'f8sllDYGDmI', en: 'WLyvkYzsGec', zh: 'iEYU7YfZ57g', ja: 'vLH0UN4VdS4' },
    titles: {
      ko: 'Ⅳ. 나, 여기, 지금으로서의 세렌디피티와 제주문화',
      en: 'Ⅳ. Serendipity as I, Here, Now, and Jeju Culture',
      zh: 'Ⅳ. 作为「我、此地、此刻」的塞伦迪皮蒂与济州文化',
      ja: 'Ⅳ. 私・此処・今としてのセレンディピティと済州文化',
    },
  },
  {
    code: 'Ⅴ', chapter: '5-1', group: 'sections', pdfSlug: '05-jeju-creation',
    youtubeIds: { ko: 'uiuZa4xyKVQ', en: 'Qf0MMdkrRfE', zh: '3zS-bKrCaJk', ja: 'cYhQL583UEQ' },
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

/** Whole-book overview video, per locale (shown as a top "개요 영상" button). */
export const JEJU_OVERVIEW_IDS: Record<string, string> = {
  ko: 'fJtk1R0QvQY', en: 'fQfmSgxCMb4', zh: '8X6eGduY-lY', ja: 'lZwyQ_F0NCI',
};

/** Fallback channel when a locale has no dedicated playlist. */
export const JEJU_CHANNEL =
  'https://www.youtube.com/@%EC%B5%9C%EC%9B%90%ED%98%81-b3r';

/** Per-locale YouTube playlist (한·영·중·일). */
export const JEJU_PLAYLISTS: Record<string, string> = {
  ko: 'https://www.youtube.com/playlist?list=PLw9IxWay4JN_V_IRxyxJonhOIHVX22r66',
  en: 'https://www.youtube.com/playlist?list=PLfLEfE_wQTqs',
  zh: 'https://www.youtube.com/playlist?list=PLKq33i8Hqfjo',
  ja: 'https://www.youtube.com/playlist?list=PLf-LvaN16i7g',
};
